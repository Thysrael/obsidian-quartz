# Overflow & Scaled

目前 Softmax 的形式如下：

$$
softmax(X) = \frac{e^{X}}{\sum e^{X}} = \frac{e^{X - \max(X)}}{\sum e^{X - \max(X)}}
$$

至于为什么要有减去 $\max(X)$ 这个操作，是因为这样可以在 $e^X$ 中出现大到溢出的值，让计算依然保持准确，其在数学上是与完全不减是等价的。

另外需要强调，这里面的 $X$ 为：

$$
X = \frac{QK^T}{\sqrt{d_K}}
$$

注意这里并不是简单的 $Q$ 与 $K^T$ 的点乘，还要再除以一个 $\sqrt{d_K}$ ，这个过程被称作缩放（Scaled）。缩放的目的，虽然在数学上，和前面减去 $\max(X)$ 的操作一样，会让 $X$ 的值变小，但不是担心 $QK^T$ 中有哪个值会溢出，而是出于算法的考量，如果不这么做，可能会使注意力过于“锐利”。

之所以在这里先介绍这个，纯粹是我闲的，我只是想在展开 FlashAttention 之前先对于 Attention 有一定的熟悉。

# Pass & Reduce & Map

那么让我们回顾 Softmax 算法，就会发现朴素的它，是一个 3-Pass （也就是需要遍历 3 遍 $X$ 才能最终获得结果）的算法：

- 我们要首先遍历一遍获得 $\max(X)$
- 然后再遍历一遍获得 $\sum e^{X - \max(X)}$
- 最后再用上一遍的结果作为分母，计算出完整的 $\frac{e^{X - \max(X)}}{\sum e^{X - \max(X)}}$

然后我们不用花太大的力气，就可以发现我们可以合并前 2 个 Pass，将其优化成一个 2-Pass 的算法。我们用数学归纳法来演示这个过程：

假设我们已经处理了 $n$ 个 $X$ 的分量，马上要处理第 $n + 1$ 个分量。我们维护了两个变量，分别是：

- `prefix_max` ，表示前 $n$ 个分量中最大的值
- `prefix_sum` ，表示 `sum(exp(X[:n] - prefix_max))` ，当然，也就是等于 `sum(exp(X[:n])) / prefix_max`

那么遍历到 `X[n + 1]` 时，我们可以更新这两个变量：

``` python
if prefix_max < X[n + 1]:
	pre_prefix_max = prefix_max
	prefix_max = X[n + 1]
	prefix_sum = (prefix_sum * pre_prefix_max + X[n + 1]) / prefix_max
else:
	prefix_sum += exp(X[n + 1] - prefix_max)
```

可以看到，当 `prefix_max < X[n + 1]` 时，就意味着我们需要更新 `prefix_sum` ，而我们并不会因为 `prefix_sum` 使用的是一个不正确的 max 值，而无法撤销，实际上我们很轻松地通过乘上 `pre_prefix_max` 的方法撤销了原本的错误。

那么我们能不能继续努努力，获得一个 1-Pass 的 Softmax 呢？然后我们发现并不可以。仔细思考，我们在合并 pass 的时候，遵循的一种“撤销历史”的范式，也就是一旦我们读入到一个足以改变局部结果的值 `X[n + 1]`，那么我们要有能力撤销原本错误的历史。那么我们为什么不能撤销如下结构呢？

$$
normal = \frac{A}{\sum A}
$$

这是因为 `normal` 操作本身是一个 vector $\rightarrow$ vector 的 map 操作，我们的历史同样是一个 vector，那么要撤销它，就要撤销整个 vector，这样遍历的次数就多了。 softmax 作为一种特殊的 normal 操作，在第 3 个 Pass 也是进行了这样的 map 算法，因此无法撤销。

那为什么第 1 和第 2 个 Pass 是可以合并的呢？因为它俩都是 reduce 操作，也就是 vector $\rightarrow$ item 。历史结果本质都是一个标量（`prefix_max, prefix_sum`），自然是非常容易撤销的。

# Split-KV

Split-KV 也被称为 FlashDecode，也有可能 FlashDecode 是 Split-KV 的 system 实现。我目前觉得 FlashAttention 应该用得也是类似于 Split-KV 的逻辑。只不过 FA 针对 Prefill 场景，使用的 Prefix-Current 范式，而 Split-KV 针对 Decode 场景，使用的是 Split-Merge 范式。原理都是一样。

说回之前的问题，无论如何，最后的归一化操作，是一个 map 操作，所以 softmax 只能是 2-Pass 的。但是如果我们将目光放到整个 Attention 计算中呢？就会发现事情得到了解决，因为 $V$ 的“加权和”本质上是一个 reduce 过程。也就是说，我们能对如下过程进行 1-Pass 求解:

$$
\frac{e^{X - \max(X)}}{\sum e^{X - \max(X)}} V
$$

我们直接说结论，假设 $X$ 由 $X_1$ 和 $X_2$ 两个部分组成，那么只要我们对于这两个部分，分别保存如下变量，那么就可以最终获得 $X$ 的结果：

$$
O_i = \frac{e^{X_i}}{\sum e^{X_i}} V_i
$$
$$
LSE_i = \ln{\sum e^{X_i}}
$$

在这里的演示中，我们并没有考虑 $\max$ ，是因为考虑以后会让问题变得更加复杂。也就是说，我们这里演示的，其实是将第 2 遍 Pass 和第 3 遍 Pass 融合的技术。

$LSE$ 是“Log-Sum-Exp”的缩写。从作用上看，它的存在是为了“撤销局部结果”，更具体的说，是撤销错误的局部分母。至于为什么要有一个 $\ln$ 计算，我猜测单纯是因为防止数值溢出，方便运算。

那么具体是怎么操作的呢？如下所示：

$$
O = \frac{e^X}{\sum e^X} V = \frac{e^{X_1} V_1 + e^{X_2} V_2}{\sum e^{X_1} + \sum e^{X_2}} =  \frac{e^{X_1} V_1}{\sum e^{X_1} + \sum e^{X_2}} + \frac{e^{X_2} V_2}{\sum e^{X_1} + \sum e^{X_2}}
$$
$$
\frac{e^{X_1} V_1}{\sum e^{X_1} + \sum e^{X_2}} = \frac{e^{X_1} V_1}{\sum e^{X_1}} \frac{\sum e^{X_1}}{\sum e^{X_1} + \sum e^{X_2}} = O_1 \frac{e^{LSE_1}}{e^{LSE_1} + e^{LSE_2}}
$$

可以看到经过 $LSE$ 的修正，我们就可以在 1-Pass 内完成 Attention 计算。