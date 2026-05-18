在 Backward 的时候我们会得到梯度 $G_t$ ，优化器（Optimizer）的作用就是用它来更新权重矩阵 $W_t$ 。

最传统的 Optimizer 就是 SGD ，表达式是：

$$
W_{t + 1} = W_{t} - \eta G_t
$$

其中 $\eta$ 是学习率。

目前用的最常见的 Optimizer 是 Adam，相比于 SGD ，它考虑了多次梯度的平滑效应，使得变化更加均匀：

$$
W_{t + 1} = W_{t + 1} - \eta u_{t}
$$

可以看出不再是 $G_t$ 直接更新权重矩阵了，而是新引入了一个 $u_t$ ，而它的表达式是：

$$
u_t = \frac{m_t}{\sqrt{v_t}}
$$

那么 $u_t$ 又是怎么得出呢？依靠的是两个迭代维护的状态变量：

$$
m_t = \beta_1 m_{t - 1} + (1 - \beta_1) G_t
$$
$$
v_t = \beta_2 v_{t - 1} + (1 - \beta_2) G_t^2
$$

AdamW 是 Adam 的一个变体，思路是接近的。

[[DeepSeek]] 的 V4 采用了 Muon 优化器，它的思路是在 AdamW 的基础上，补上了一个正则化（通过 [[SVD]] 将 $\Sigma$ 除掉）的处理。只能用于二维的权重矩阵，据说有更好的训练稳定性和收敛性（Convergence）。