# CUDA Graph

CUDA Graph 是 NVIDIA 推出的用于优化 GPU 任务执行的技术。它允许开发者将一系列 CUDA 操作（如内存拷贝、核函数启动等）预先录制为一个计算图（Graph），之后可以重复高效地执行整个图，减少 CPU 与 GPU 之间的交互开销，尤其适用于需要重复执行相同操作序列的场景（如深度学习推理）。

传统方式中，每次调用 CUDA 操作需通过 CPU 提交指令，而 CUDA Graph 将多个操作合并为一个图，只需一次提交。它主要节省的是 CPU Launch 的软件栈的开销（只需要 launch 一次了）。

# CUDA Context

GPU 版本的 process ，即 GPU 的运行时上下文。一般来说，一个 CPU Process 会在一个 GPU 上对应一个 CUDA Context。CPU Process 也可以显式的创建多个 context 。

CUDA Context 包括：

- 虚拟地址空间：CPU 和 GPU 共享同一个地址空间的不同区域
- CUDA Objects:
  - stream
  - event
  - module
  - kernel
  - memory allocation

CUDA Context 一般是使用第一个 CUDA API 的时候隐式创建，所以第一个 API 的时延会包括创建 context 的时延。

在 CPU Process 发生切换的时候，GPU Context 也会发生切换。而这种 context switch 是比较低效的。所以后来又开发了 MPS 技术，让多个 CPU Process 共享一个 GPU Context 来避免切换开销。
