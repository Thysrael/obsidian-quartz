# Index

python 的 index 非常有趣，它包括负数 index 。对于一个长度为 3 的 array ，有：

``` python
a = [0, 1, 2]
a[2]    # 2
a[-3]   # 0
```

总的来说就是现在的 index 范围变成了 $[-len, len - 1]$ 。

# Naive Slice

Python 的切片语法非常多变，有如下几种形式：

``` python
a[start:end:step]
a[start:end]
a[start::step]
a[:end:step]
a[start:]
a[:end]
a[::step]
```

可以看出基本上都是 `[start:end:step]` 的简化。

当 `step` 为正数的时候，我们是“从左向右”构造切片，切片的顺序是与原本数组的顺序相同的。而当 `step` 为负数的时候，我们是“从右向左”构造切片，切片的顺序是与原本数组的顺序相反的。

无论如何，切片包含的元素，都是以 `start` 为起始点，以 `end` **前** 的元素为终止点的。也就是说，当 `step` 为正时，范围是 `[start, end)` ，而当 `step` 为负时，范围是 `(end, start]` 。

`start` 和 `end` 都可以使用负数 index ，使用负数并不意味着某种方向，我们只在乎这些 index 具体指向哪个元素。

当 `start` 或 `end` 空缺时，表示并 **不会约束** 切片在起点或者终点上的选取，这甚至和取 `0` 和 `len` 还不同，是真正的没有约束。

# Numpy Slice

`numpy` 相对于普通的 slice ，引入了新的语法 `,` 。

当我们由一个普通的二维数组的时候，我们是没有办法使用如下语法的：

``` python
b = [[1, 2],
     [3, 4]]

print(b[0:, 0:])
```

但是在 `numpy` 中是可以的：

``` python
import numpy as np
b = np.array(b)
print(b[0:, 0:])
```

我也不知道这是怎么做到的，不过没有关系，不耽误我们用就行了。

`[slice1, slice2]` 语法是一种交集运算，它会筛选出在第一个维度上符合 `slice1` 的 index1 ，然后在第二个维度上选择符合 `slice2` 的 index2 ，然后确定它们的交集。

需要强调的是，这样选出来的切片，维度并不会下降，比如说 `b[:, 1:]` 就是第二个列向量，但是它也依然是一个二维矩阵，其形状为：

``` python
array([[2],
       [4]])
```

与之形成对比的是 `index` 语法，比如说 `b[:, 1]` 就是一个向量了，甚至都不是列向量（也没法是，毕竟一维数组无法表示列向量），而是行向量。

``` python
array([2, 4])
```
