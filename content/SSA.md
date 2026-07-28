SSA 即 Single Static Assignment 。也就是变量只会在初始化的时候确定一次，以后就不再会发生变化了。

SSA 是构建 DAG 图的基础，如果没有 SSA ，我们对于这样的代码：

```c
tmp = 1
tmp = tmp + 1
tmp = tmp + 2
```

就会发现如果根据上面构建 DAG 图，那么我们就会同时用 `tmp` 指向三个节点，这就很难再在 DAG 图上做优化。

而如果我们稍微改写成 SSA 形式：

```c
tmp1 = 1
tmp2 = tmp1 + 1
tmp3 = tmp2 + 2
```

就会发现容易分析很多。

普通的程序是可以改写成 SSA 程序的，在分支判断处，主要依赖的是 `phi` 指令。
