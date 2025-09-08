Triton 是由 [[OpenAI]] 开发的 **开源编译器和运行时库** 。

Triton 不依赖 [[CUDA]] Runtime 库（如 `libcudart.so` ），直接通过 LLVM 生成 [[PTX]] 代码，绕过了 CUDA Runtime 的限制。但是 Triton 依赖 CUDA 驱动层​（如 `libcuda.so` ）来管理 GPU 设备、内存分配和内核启动。
