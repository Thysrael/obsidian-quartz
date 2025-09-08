[[IBM]] 在 CTSS/360 系统上引入了 Process 的概念。还有一说是 [[MIT]] 在设计 MULTICS 时引入的。

进程的核心技术是 [[Context]] 切换和 [[Schedule]] 。它提供了一个程序拥有的软硬件资源集合的抽象（也就是说是整个主板的抽象）。而线程只是一个 CPU 处理器核心的抽象。

- 进程 ID ：[[Pid]]
- 由内核线程生成的用户进程：[[Kernel User-mode Helpers]]
- 会话管理：[[Session]]
- 进程组：[[Process Group]]
