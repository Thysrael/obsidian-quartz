# Stacked Attention

Attention 算子是一种获取上下文语义的结构，但是我一直很好奇为什么需要多层 Attention 算子堆叠在一起，难道只有一层 Attention 来获得上下文语义还不够吗？对着一个已经获得了上下文语义的 token 序列再次 Attention ，它的目的是什么呢？

后来我找到了一种比较符合直觉的解释，我们以一句话为例：

> Alice thinks Bob is handsome.

我猜测只需要一次 Attention 机制，LLM 就可以搞清楚是“Bob 具有 handsome 的语义”。这是因为 Bob 与 handsome 之间的“主语-补语”关系，很容易就会被 Attention 机制发现。

但是如果是一个更加复杂的例子呢：

> Alice thinks himself is handsome.

我相信 LLM 依然会发现“himself 具有 handsome 的语义”，也会发现“himeself 具有 Alice 的语义”，但是这离这句话最终的意思“Alice 具有 handsome 的语义”依然是有一定的距离的，所以只有再使用一次 Attention 机制，才能挖掘出这种更加深层次的语义。
