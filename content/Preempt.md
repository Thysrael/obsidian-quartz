# Kernel Preempt

Linux 内核提供了多种内核抢占模式，用于在吞吐和延迟之间 tradeoff。

内核抢占模型的一个重要概念是抢占点（preemption points），它指的是代码中发生内核抢占的位置（更直观粗糙一些的说就是调用 `__schedule()` 的位置），一共有以下几类：

1.  常规：硬件中断返回内核处、内核返回用户空间处
2.  启发式：调用 cond<sub>sched</sub>() 或者 might<sub>sleep</sub>() 处，这两个函数类似于 yield()
3.  条件变化：开启抢占、释放自旋锁、开软中断

并不是每个抢占点都真的会发生抢占，这大概取决于几种因素：

1.  当前内核是否是抢占内核
2.  当前有无高特权级的 RT Task
3.  当前的进程是否可被抢占，这取决于这些进程在是不是持有一些锁、是不是有一些原子性的语义，有没有特殊的事件在阻止抢占内核用 `preempt_counter` 变量来描述是否满足抢占条件（基本包含后 2 点），当 `preempt_counter == 0` 的时候，就是可以抢占的了（但是抢占后可能并不满足效果，比如被抢占的进程拿着锁，抢占进程拿不到锁，依然只能死等）。

![](img/clipboard-20241029T222527.png)

Linux Kenerl 本身的抢占模型分为 4 种：

- PREEMPT<sub>NONE</sub>：并不抢占，一个内核线程只会在时间片耗尽、发生阻塞和调用 cond<sub>sched</sub> 时自愿放弃 CPU
- PREEMPT<sub>VOLUNTARY</sub>：和 PREEMPT<sub>NOE</sub> 一样，只是有更多的 might<sub>sleep</sub> 来自愿放弃 CPU
- PREEMPT<sub>FULL</sub>：基本上在任何会导致 preempt<sub>counter</sub> 变化的时候都会进行抢占，只要 preempt<sub>counter</sub> == 0 就立刻抢占。
- PREEMPT<sub>RT</sub>：类似于 PREEMPT<sub>FULL</sub>，为 RT workload 设计，所以条件判断会松一些。

每次内核在 reboot 后只能是其中的一种模型，并不能动态调整。这就导致对于非抢占内核（NONE，VOLUNTARY），它面对那种会耗尽整个时间片的内核任务，就只能使用 cond<sub>sched</sub> 来自愿放弃 CPU 来提高系统的实时性。

这种“启发式的自愿放弃法”会导致非抢占的内核中弥散着各种 cond<sub>sched</sub> 函数，这些函数的维护性非常差，因为我们需要解释为什么在这个点可以自愿放弃 CPU，当这个点附近的代码发生变化的时候，这个启发式的抢占点的位置也需要调整。而且这种启发式的方法，可能导致有一些可能潜在的自愿放弃点没有被发现。
