微软开源的优化器/训练推理加速库，它最核心的能力是 ZeRO 优化器：把模型参数、梯度、优化器状态分散到多张 GPU，甚至 CPU/NVMe 上，从而显著降低单卡显存压力。

它可以和 [[Megatron-LM]] 配合使用，很多大规模训练会把二者结合起来，也就是 **Megatron-DeepSpeed**：用 Megatron 做 [[TP]]，用 DeepSpeed 做 ZeRO、[[PP]]/offload 等优化。

此外，相比于 Megatron-LM，DeepSpeed 更加轻量，与 [[PyTorch]] 兼容性更好，所以常用于微调任务。
