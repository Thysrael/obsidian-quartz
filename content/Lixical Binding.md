# Lexical Binding

Lexical binding（词法绑定） 是指：一个变量名究竟指向哪个变量，由它在源代码中的位置和嵌套结构决定，而不是由程序运行时的调用路径决定。

这个话说的 trival 的都有些吓人了，这是因为基本上我接触的编程语言，包括 [[C]] ，[[Python]] 和 [[Javascript]] 都是这样的，简单来说就是：

```python
x = 10

def foo():
    print(x)

def bar():
    x = 20
    foo()

bar() # 10
```

也就是即使 `foo()` 是在 `bar()` 内调用的，它也只会去找源码中的上一层（也就是全局变量 `x` ），而不是调用逻辑的上一层（也就是 `bar` 中的 `x` ）。

# Dynamic Binding

而 dynamic binding（动态绑定）它的变量名就指向程序**运行时的调用路径** 。采用这种方式的有 [[ShellScript]] 和早期的 [[Elisp]] ，也就是说，对于如下代码：

```bash
x=10

foo() {
    echo $x
}

bar() {
    local x=20
    foo
}

bar # 20
```

会输出 `20` ，因为 `foo()` 会查找它调用者 `bar()` 的符号表。

动态绑定的优势在于，它很适合写配置语言，因为它可以让局部配置仅在某个调用链中生效，不会引入和修改过多的全局变量。

如果希望用词法绑定达到动态绑定的效果，就必须进行嵌套函数的定义了：

```python
x=10

def bar():
    x = 20
    def foo():
        print(x)
    foo()

bar() # 20
```

或者使用闭包 [[Python Closure]] ：

```python
x=10

def bar():
    x = 20
    def foo():
        print(x)
    return foo

foo = bar()
foo() # 20
```

我感觉我发现闭包的意义了，很多时候你只是想修改一个环境变量，而不希望创建一个全局变量或者结构体，那么闭包这种“捕获变量”的方式就很方便了。

动态绑定（Dynamic Binding）最大的缺点是：一个函数的行为不仅取决于它自己的代码，还取决于是谁调用了它。这就导致函数的行为难以预测，也增加了静态分析的难度，更难模块化。
