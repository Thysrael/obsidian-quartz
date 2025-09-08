Python 函数参数可以分为两类，即位置参数和关键字参数。位置参数利用的是实参传入的顺序来确定形参和实参的对应关系，而关键字参数利用“形参=实参”的键值对来确定形参和实参的对应关系。如下所示：

``` python
def greet(p, q):
    print(f"{p} say hi to {q}")

greet('A', 'B') # A say hi to B
greet(q='A', p='B') # B say hi to A
```

Python 的可变参数设计也很简洁，它对于位置参数和关键字参数分别提供了不同的可变参数

``` python
def my_function(*args, **kwargs):
    print("位置参数：", args)
    print("关键字参数：", kwargs)

my_function(1, 2, name='Bob', age=30)
```

如上所示，其中 `args` 的本质是一个元组，而 `kwargs` 的本质是一个字典。这种函数声明的本质是 [[Python Unpacking]] 语法的一种体现。

在使用方面，有如下要点：

1.  在函数声明中， `args` 和 `kwargs` 必须在其他参数之后，且 `kwargs` 要在 `args` 之后。
2.  在函数调用中，所有无法匹配的位置参数都会传递给 `args` ，而所有无法匹配的关键字参数都会传递给 `kwargs` 。
