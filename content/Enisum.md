爱因斯坦求和标记（Einstein summation notation）是一种标记的约定，用于描述张量运算。

Einsum 的特点在于，它将 compute 和 reduce 阶段完全区分开了，而不是混在一起，更加清晰了。对矩阵乘法而言， compute 就是 $y_{i, j, k} = a_{i, j} \times b_{j, k }$ 的乘法计算，而 reduce 计算，则是 $o_{i, k} = \sum_{j} y_{i, j, k}$ 的求和运算。

之所以要将 compute 和 reduce 分开，我个人感觉是 compute 是一个完全并行的过程，而 reduce 的数据依赖性很强。将这两个阶段分开，有助于描述硬件计算单元（PE）的 layout （compute 如何分布在上面）和 connect （reduce 如何分布在上面）。
