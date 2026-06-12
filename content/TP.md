Tensor Parallelism ，本质是将模型沿非 layer 方向切割。这种切割方式会引入很多 Scatter-Reduce（Collective Operation） 导致的通信开销，因此 TP 往往是在一个 Node 内进行的，Node 内的 GPU 可以用 [[NVLink]] 这种高速互联联系在一起。

[[PP]] 可以理解为将模型竖向切割，那么在 Training 时， GPU 显存不够的情况下，我们到底应该选择 PP 还是 TP 呢？其实主要还是 TP，这是因为训练过程中使用 PP 是存在 Bubble 的，而 TP 则没有（不过引入了一定的通信开销）。而且部署 PP 需要考虑 MicroBatch 等参数，比较难配置。

那在 Inference 阶段呢？依然是用 TP ，这是因为 PP 就算没有因为 Backward 依赖导致的 Bubble ，也会因为 Inference 的 Batch Size 较小，而无法利用好流水线的问题，而 TP 则不会。

此外 PP 还有一个非常明显的缺点，那就是它没有办法改善 Latency（分成多个阶段并不会有延迟的降低，甚至还有所增加），只能改善吞吐，这使得它在推理用的应用并不多。

另外 TP 虽然名字起得很 general，似乎只要是且 tensor 的都可以叫 TP，但是实际上往往局限于对于模型权重的某个维度的切割，比如 [[CP]] 因为切割的是序列维度，而序列维度并不是模型权重的一个维度，因此不能算是一种特殊的 TP 。