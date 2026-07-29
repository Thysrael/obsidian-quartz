# Ownership

Rust 因为无 GC 的设计，采用了 RAII 思路，也就是说每个资源都有一个持有者。当持有者随着程序的运行，离开它的作用范围时（也就是不再存活），就会释放它所持有的资源。

我们用不加任何修饰的 `let =` 的 binging 语法（见 [[Rust Binding]]）来描述这种 ownship 关系：

```rust
// `x` owns the string
let x = String::from("hello");
// `x` moves the ownership to `y`.
// now `x` doesn't own the string.
let y = x;
```

只有一个变量可以拥有对应的资源。当我们让 `y` 拥有这个字符串时，`x` 就会失去 ownership 。

当然一些实现了 Copy Trait 的变量除外，比如说下面构造出了两个字符串，`x` 和 `y` 分别绑定一个：

```rust
let x = "hello";
let y = x;
```

# Borrowing

当然也不是在有了 ownership 以后就万事大吉了。因为在实际编程中，我们常常要传递变量，而如果在传递变量的时候使用了 move 语义，那很容易导致变量的错误释放。

比如说我们希望将变量作为函数参数传递给函数，如果直接使用 move 传，那么因为函数参数的作用域就是函数，所以函数调用结束后，资源就释放了，这肯定不是我们所希望的。

```rust
fn print(s: str) {
    println!("{}", s);
}
```

所以我们一般会使用 borrow 语义，也就是在不改变 ownership 的情况下，借用这个变量的读写权。具体写作：

```rust
let mut s = String::from("hello");

let a = &s;     // immutable borrow
let b = &mut s; // mutable borrow
```

Borrow 遵循类似于读写锁一样的规则，同时可以有多个 immutable borrow ，或者又一个 mutable borrow。

如果 `s` 本身是一个不可变的对象，那么就只能有 immutable borrow 。

对于 borrow 引用的使用，和 C 语言的指针类似，需要使用 `*` ，如下所示：

```rust
let x = *a; // read
*b = x;     // write
```

但是我们其实也可以写成：

```rust
let x = a;
b = x;
```

这是因为 rust 有自动解引用的功能，所以和使用一般的变量没有区别。

此外 borrow 引用本身也是可以的：

```rust
let x: i32 = 10;
let r1: &i32 = &x;
let r2: mut &&i32 = &r1;
println!("{}", r2);
```

可以看到即使是多层引用，也是可以被自动解引用的。

# Lifecycle

Borrow 设计又带来一个新的问题，那就是引用的生命周期，不应当超过 owner。Rust 编译器会帮我们自动检查这个事情，避免 dangling ：

```rust
fn main() {
    let x;

    {
        let s = String::from("hello");
        x = &s;
    } // s is released

    println!("{}", x); // x is dangling
}
```

这种就会被编译器检查出来，因为 `x` 的生命周期超过 owner `s` 的生命周期。

但是在考虑返回值是函数的影响时，rust 就很难去做分析了。比如下面这个：

```rust
fn foo(s_ref: &String) -> &String {
    s_ref
}

fn main() {
    let b;

    {
        let s = String::from("hello");
        b = foo(&s);
    } // s is released

    println!("{}", b); // b is dangling
}
```

我们可以看到 `b` 是一个被函数 `foo` “计算”出来的引用（虽然计算方式就是简单的引用赋值）。在不看 `foo` 的具体实现前，我们是没有办法知道 `b` 到底是从哪里来的（可能跟传入的参数 `s` 有关，也可能无关）。这个时候我们就很难分析 `b` 的 lifecycle 是否正常。

那如果我们看了 `foo` 的函数实现呢？对于当前的 `foo` 来说，是很好判断的，毕竟返回值就是 `s_ref` 。Rust 只需要看一下 `s_` 就是被绑定到 `s_ref` 上，然后认为 `b` 和 lifecycle 和 `s` 一样就好了。

换句话说，Rust 可以根据“作为函数参数的引用”的 lifecycle ，去推断“作为返回值的引用”的 lifecycle 。但是当 `foo` 变得复杂的时候，Rust 就不能这么干了，比如说：

```rust
fn foo(s1: &String, s2: &String) -> &str {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}
```

可以看到最终的返回值，有可能是 `s1` 也有可能是 `s2` ，这取决于两者传入的参数。所以这个时候 Rust 就没有办法自动推断了，那么就需要我们进行人工标注，也就是：

```rust
fn foo<'a>(s1: &'a String, s2: &'a String) -> &'a str {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}
```

这里我们引入了一个形容 `'a` 的标注符，它的意思是，当 `s1` 和 `s2` 这样的函数参数被标注成 `a` 的时候，返回值如果也被标了 `a` ，那么就表示“这个引用保证不会超过 a” 。

只有这样，才能保证两条路径都覆盖，也就是返回值的 lifecycle 要比 `s1` 和 `s2` 都短。

需要强调的是，这里只是 Rust 无法识别返回值的 lifecycle 了，并不能说明程序写错了。

总结一下，生命周期标注是一种根据函数参数的生命周期，判断返回值生命周期的方式。
