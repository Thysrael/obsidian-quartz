# 类型系统承担语义

在像 [[C]] 和 [[C++]] 这种传统语言中，类型系统的本质适用于描述变量在内存中的格式。比如说一个类型为 `float` 的变量，我们看到它是 `float`，就知道它占据 4 个 byte ，这 4 个 byte 会使用“IEEE 754”标准去解析。

而 Rust 语言（其实可能其他现代语言也有这个设计）尝试让类型系统承担更多的语义，总结来说就是：

> 一个类型代表这个变量所有可能取值的集合。

举个例子，对于 C 语言来说，有一个常见的“`NULL` 就是 error”的设计：

```C
User *find_user(int id);
```

对于这种 API ，约定：

- 找到了：返回有效指针
- 没找到：返回 `NULL`

这种方式的问题就在于，这种约定是定义在文档中的，是无法被编译器检查的。

而 Rust 处理这个问题的时候，就会把“找到了”和“没找到”两种情况都显式的放到返回值的类型系统中：

```rust
fn find_user(id: i32) -> Option<User>
enum Option<T> {
    Some(T),
    None,
}
```

至于为什么选择“类型系统”，我觉得是因为类型系统是静态的，是可以被编译器 offline 检查的。而 C 语言将很多的程序语义交给变量的值来承载（比如用 `0` 表示 `NULL` ，进而表示 error），而变量的值，则要到了 online 的时候才知道，这就没办法让编译器检查了。

# Struct 与 Enum

我们有两种方式构造复杂的类型：

`struct` 跟其他语言的结构体的定义差不多，表达一种“积类型”，即“所有 field 同时拥有”的语义：

```rust
struct Point {
    x: i32,
    y: i32,
}
```

而 `enum` 表达一种“和类型”，即“从多种 field 中选择一种”的语义：

```rust
enum Message {
    Quit,
    Text(String),
    Move(i32, i32),
}
```

传统的 enum 中的 field 往往是同一个类型的，而 Rust 允许它们不一样。

# 解包与 Match

正如前面所说的，Rust 倾向于构建出足够复杂的类型，去承接程序的语义。但是这就意味着，我们需要有足够强的消解类型的手段，才能把语义再次还原出来。对于“和类型”，Rust 给出的方案就是 `match` 关键字。

虽然说 `match` 第一眼看上去和 C 语言的 `switch` 差不多，但是仔细看就会发现差异。`switch` 关注的是“这个标签的值是多少？”，而 `match` 关注的是“这个值是由哪一种构造方式创建的？它内部的数据形状是什么？把我关心的部分提取出来。”

举个例子，对于上文的 `Message` ，有：

```rust
match message {
    Message::Quit => ...
    Message::Text(text) => ...
    Message::Move(x, y) => ...
}
```

而对于“积类型”，我们也可以解包：

```rust
let Point { x, y } = point;
```

# OOP

## 封装

Rust 并不能直接将一个函数定义成一个 field ，而是需要使用 `impl` 关键字：

```rust
struct User {
    name: String,
    age: u32,
}

impl User {
    fn new(name: String, age: u32) -> Self {
        Self { name, age }
    }

    fn greet(&self) {
        println!("Hello, {}", self.name);
    }
}
```

## 多态

而对于接口（interface），Rust 使用 `trait` 关键字，类似于 C++ 中的抽象类：

```rust
trait Animal {
    fn speak(&self);
}

struct Dog;

impl Animal for Dog {
    fn speak(&self) {
        println!("woof");
    }
}

struct Cat;

impl Animal for Cat {
    fn speak(&self) {
        println!("meow");
    }
}
```

而在调用的时候，使用：

```rust
fn speak<T: Animal>(animal: &T) {
    animal.speak();
}
```

这种被称为“静态多态”，还有一种“动态多态”，我没有看，就不写了。

其实很容易就可以想到，其实我们用 `enum + match` 的方式，也可以实现多态：

```rust
enum Command {
    Start,
    Stop,
    Send { payload: Vec<u8> },
}

fn execute(command: Command) {
    match command {
        Command::Start => start(),
        Command::Stop => stop(),
        Command::Send { payload } => send(payload),
    }
}
```

## 继承

Rust 中没有继承，它使用“组合”来代替。
