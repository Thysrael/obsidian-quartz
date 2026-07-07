# Template vs Constexpr

我个人觉得 template 主要是有两种用法，一种是对“类型”进行元编程，也就是 `typename`；另一种是传递常量值，也就是 `int`。

但是我一直有个疑问，那就是在有了 `constexpr` 的情况下，也就是编译期常量的语法的情况下，用 template 去进行 `int` 的声明是否有必要？

是有必要的，我们用一个简单的例子去举例：

```cpp
void f(int n) {
	#pragma unroll
	for (int i = 0; i < n ; i++) //...
};
constexpr int N = 4;
f(N)
```

在上面这个例子里面，即使 `N` 是编译期常量，在 `f` 内也无法体现它的常量特性，进而无法展开优化。那为什么不直接把 `N` 定义到 `f` 中呢？不就可以避免了这种尴尬了吗？

好问题！这其实就问出了 template 和 `constexpr` 的区别。虽然我们最常见的理解是将 template 理解成一种更“安全”的宏，但是实际上我们不可忽视，template 是 C++ 的元编程的实现。也就是说，当我们使用 template int 的时候，我们本质是在进行元编程，也就是说，我们是要修改代码的结构。比如说：

```c++
auto f(int n) {
	if (n == 4)
		return std::array<int, 4>{};  
	else
		return std::array<int, 8>{};  
}
```

这段代码是编译不过的，因为我们不知道到底 `auto` 是是 `array<int, 4>` 还是 `array<int, 8>`。当我们尝试用 `constexpr` 来解决这个事情的时候，就会有：

```cpp
auto f_4() {
	constexpr int N = 4;
	return std::arrary<int, N>{};
}
auto f_8() {
	constexpr int N = 8;
	return std::arrary<int, N>{};
}
```

可以看到完全没有任何复用代码的思想，说白了，它们都不是元编程，都无法制造和修改代码，而用 template 做这件事情就非常简洁和本质：

```cpp
template <int N>
auto f_template() {
    return std::array<int, N>{};
}
```

当然 template int 也不是免费的午餐，它要求模板参数传入的时候，一定是要在编译期可以确定的，也基本等于 `constexpr` 或者字面量，也就是：

```cpp
constexpr int N = 4;
f_template<N>(); // method 1
f_template<8>(); // method 2
```

这就导致编程的僵化，毕竟我们不会闲得没事写字面量或者 `constexpr`，所以我们往往会有一个 dispatch wrapper 编程范式来解决这个问题，如下：

```cpp
switch (n) {  
	case 4:  
		f_template<4>(); break; 
	case 8:
		f_template<8>(); break;  
	case 16:  
		f_template<16>(); break;  
}
```

# 特化

特化模板是一种针对性的，为某个参数写的代码。我们会先写一个 general 的版本：

```cpp
template <typename A, typename B>
struct Demo {
	static constexpr const char* value = "A:unknow, B:unknow";
};
```

特化版本长这样：

```cpp
template <>
struct Demo<int, int> {
	static constexpr const char* value = "A:int, B:int";
};

template <A>
struct Demo<A, int> {
	static constexpr const char* value = "A:unknow, B:int";
};

template <A>
struct Demo<A*, int> {
	static constexpr const char* value = "A:unknow_ptr, B:int";
};
```

我们基本上可以归纳出语法规律，也就是 `template<...>` 中声明的，是目前还没有办法确认的部分，而像模板实例化的部分，则是已经确定的部分。

# 递归模板

结合模板特化，我们可以写出来一种递归的模板，来实现非常花哨的功能。比如说静态计算 fib 数列，常规版本是：

```cpp
int fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib(n - 1) + fib(n - 2);
}
```

我们可以写出来递归版本：

```cpp
template <int N>  
struct Fib {  
	static constexpr int value = Fib<N - 1>::value + Fib<N - 2>::value;  
};
```

当然这还不够，因为没有设置基准情况，所以我们可以用模板特化来实现，也就是：

```cpp
template <>  
struct Fib<0> {  
	static constexpr int value = 0;  
};  
  
template <>  
struct Fib<1> {  
	static constexpr int value = 1;  
};
```

学吧，学无止境。

# 变长模板参数

变长模板参数，指的是可以接收任意长度的模板，用 `typename ....` 声明：

```cpp
template <typename... Ts>  
struct TypeList {};
```

以下方式都可以正确实例化：

```cpp
TypeList<>;  
TypeList<int>;  
TypeList<int, float>;  
TypeList<int, float, double>;
```

那么一个关键问题是，我们该如何使用呢？基本上有两种方式，一种是交给调用的函数处理，自己是不管的，我们使用 `Args...` 和 `args...` 来使用：

```cpp
template <typename... Args>  
void call_g(Args... args) {  
	g(args...);  
}
```

如果我们调用：

```cpp
call_g(1, 2.0, "hi");
```

本质上是：

```cpp
// Args = {int, float, str}
// args = {1, 2.0, "hi"}
g(1, 2.0, "hi");
```

还以一种使用模板特化来进行递归处理的方式，将可变参数列表进行递归遍历，如下所示：

```cpp
template <typename... Ts>
void print_all() {  
	std::cout << "\n";  
}  
  
template <typename T, typename... Rest>  
void print_all(T first, Rest... rest) {  
	std::cout << first << " ";  
	print_all(rest...);  
}
```

# 模板模板参数

其实在语法上面并没有什么特别的，只是长得非常吓人，也就是模板参数本身也是一个模板：

```cpp
template <template <typename> typename F>
struct B {};
```

那么在实例化 `B` 的时候，我们要求模板参数 `F` 本身也是一个模板：

```cpp
template <typename T>  
struct Wrapper {};

B<Wrapper> b;
```