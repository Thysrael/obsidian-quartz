PTX (Parallel Thread Execution) 是 NVIDIA 为其 CUDA 平台设计的中间汇编语言。PTX 代码通常不会直接编写，而是由 CUDA 源代码编译生成的中间表示。它用于为不同 NVIDIA GPU 生成机器代码。

PTX 本身就是 [[CUDA]] [[SIMD vs SIMT|SIMT]] 模型的体现（其实 RTX 这个名字也有暗示），每条 PTX 指令并不是为一个线程写的。它将被一个 Warp 中的所有线程同时取指和解码。在 PTX 中，也利用 prediction 的概念来抽象分支执行。

此外，PTX 非常强调 Memory Heirarchy ，里面有 `.reg`，`.shared`，`.global` 等多种类型。