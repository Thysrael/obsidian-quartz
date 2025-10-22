# 加性位置编码

这是 "Attention is All You Need" 中提到的方法，有如下表达：

$$
q_{m} = W_{q} \cdot (x_{m} + PE(m))
$$

$$
k_{m} = W_{k} \cdot (x_{m} + PE(m))
$$

$$
PE(m) = [ \sin(\frac{i}{10000^{\frac{0}{d}}}), \cos(\frac{i}{10000^{\frac{0}{d}}}), \sin(\frac{i}{10000^{\frac{2}{d}}}), \cos(\frac{i}{10000^{\frac{2}{d}}}), \cdots , \sin(\frac{i}{10000^{\frac{d}{d}}}), \cos(\frac{i}{10000^{\frac{d}{d}}}) ]
$$

其中 $m$ 是 token id 或者说 position id ，$d$ 是模型维度（也就是 $x$ 的维度）。

直观上看，就是在原本的 $q, k$ **加上** 一个随位置变化的角度向量，这样 LLM 就可以获得位置信息了。但是这种加性操作产生的向量变化是非常随机的（一个随机的偏移），这就导致 LLM 很难掌握其中的规律，导致训练成本大（死记硬背），且在更长文本的拓展性弱。如下所示，图中的 $m$ 即 $i$ ，可以看到毫无规律。

![](img/clipboard-20250521T105837.png)

这种位置编码一般只需要在输入时编码一次，这个编码会进入每一个 transformer 块中。

# RoPE

RoPE 是一种 **乘法** 位置编码，有如下表述：

$$
q_{m} =  R_{m} \cdot  W_{q} \cdot x_{m}
$$

$$
k_{m} =  R_{m} \cdot W_{k} \cdot x_{m}
$$

$$
R_m = \bigoplus_{i=0}^{d/2-1} \begin{pmatrix}
\cos(m\theta_i) & -\sin(m\theta_i) \\
\sin(m\theta_i) & \cos(m\theta_i)
\end{pmatrix}
$$

$$
\theta_i = 10000^{-2i/d}
$$

其中, $m$ 表示第 $m$ 个 token； $q_m, k_m$ 分别表示这个 token 对应的 query 和 key 向量； $R_m$ 是一个近似对角矩阵，每个对角单元是一个 $2 \times 2$ 的旋转矩阵。这使得原本的向量中的 $d$ 个分量，被分成了两两一组，按照不同的速度去旋转。

再讲得细一些，对于第 $m$ 个 token，它对应一个 key 向量 $k_m$ ，$k_m$ 一共有 $d$ 个分量，这些分量都会旋转过一个角度 $\theta$ （这里的 $\theta$ 是上面公式的 $m\theta$ ），这个 $\theta$ 是 $m$ 和分量索引 $i$ 的函数，有：

$$
\theta(m, i) = m \times 10000^{\frac{-2i}{d}} 
$$

![](img/RoPE-20250906.png)

在实际的计算中，我们并不会为每个 $q, k$ 都分配一个近似对角旋转矩阵（虽然在数学上是需要的），而只是每个 $q, k$ 每两个元素单独处理，并不是矩阵运算，这样避免了形式上的繁复。此外，$10000^{\frac{-2i}{d}}$ 这个部分的结果对于不同位置的 token 是相同的，因此是可以 cache 的。

可以看出用这种方法，位置编码变得更有规律，是的 LLM 学习起来更轻松，长文本的拓展性更好。

![](img/clipboard-20250521T111615.png)
