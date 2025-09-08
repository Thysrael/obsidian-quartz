# 解包

解包（unpacking）就是将像数组或者字典这样的集合拆开，取出其中的元素，其示例如下：

``` python
a, b = [1, 2]
c, d = (3, 4)
print(a) # 1
print(b) # 2
print(c) # 3
print(d) # 4
```

# `*/**`

`*` 一定是用在数组变量或者元组变量之前的， `**` 用于字典之前，有如下场景：

**函数参数解包** ：

``` python
def func(x, y, z):
    print(x, y, z)

args = (1, 2, 3)
func(*args)  # 等价于 func(1, 2, 3)

kwargs = {'x': 1, 'y': 2, 'z': 3}
func(**kwargs)  # 等价于 func(x=1, y=2, z=3)
```

**赋值解包** ：

``` python
a, *b, c = [1, 2, 3, 4, 5]
# a = 1, b = [2, 3, 4], c = 5
```

**合并列表或字典** ：

``` python
list1 = [1, 2, 3]
list2 = [4, 5]
merged_list = [*list1, *list2]
# merged_list = [1, 2, 3, 4, 5]

dict1 = {'a': 1, 'b': 2}
dict2 = {'b': 3, 'c': 4}
merged_dict = {**dict1, **dict2}
# merged_dict = {'a': 1, 'b': 3, 'c': 4}
# 注意：dict2 中的 'b' 覆盖了 dict1 中的 'b'
```
