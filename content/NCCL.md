NCCL（读作 "Nickel"）全称是 NVIDIA Collective Communications Library，是一种分布式通信的库。它的特点是依赖 [[CUDA]]，使用 RDMA 来绕过 GPU。相比于 [[GLOO]] 更加适合高性能场景。

它支持多种集体通信操作，如 Broadcast、Reduce、All-Reduce、Gather、Scatter 等

我们可以使用 `torch.distributed` 来调用这些操作（需要先将后端设置成 `NCCL` ）。
