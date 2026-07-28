# Let binding

Rust 的 `let` 语法已经在 [[Dataflow vs State]] 中详细讨论过了。

# Let vs Const

`let` 也会使得变量无法被改变，看上去和 `const` 效果是一样的。

但是实际上并不一样，`let` 说的是，在 binding 结束后，值就不可以改变了。而绑定的时候，是可以用一个变量给它绑定的，也就是说：

```rust
let mut variable = 300;

let a = variable;   // pass
const b: i32 = variable; // error
```

`const` 要求等号右侧的值必须要是编译期可计算的。
