# Module Import

在 python 中，module 可以理解为一个“函数库”文件，里面就和正常的 python 文件一样。

我们用 `import` 命令来引用它。当我有一个名为 `lib.py` 的文件：

``` python
def fib(n):    # write Fibonacci series up to n
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()

global_value = 3

print("Hello, Module Lib")
print("__name__: " + __name__)
```

我按照如下格式引用：

``` python
import lib

lib.fib(2)
print(lib.global_value)
```

可以看到当我们希望使用其中的函数或者全局变量时，还是需要先指出它属于 `lib` 这个 module ，这主要是因为这样可以不污染 `main` 的命名空间。

当然如果这样太麻烦的话，也可以使用如下语法引入：

``` python
from lib import fib

fib(2)
```

不过这样就有污染命名空间的嫌疑，所以我们可以给它起个别名：

``` python
from lib import fib as main_fib

main_fib(2)
```

按照我的理解，module 会在 `import` 的时候被 eval ，如下所示，所以即使在 `main.py` 下只有一个 `import` 语句，那么也依然会有如下输出：

``` python
import lib
# Hello, Module fib
# __name__: fib
```

此外如果 `lib` 中有以 `_` 开头的函数或者变量，是不会被导出的。换句话说，它们是 module 的私有变量。

# `__name__`

每个模块都会有一个 `__name__` 变量，它等价于 module 的名字，比如上面的 `lib` module ，它就有

``` text
__name__: fib
```

而对于我们实际运行的脚本，有 `__name__` 这个变量恒为 `'__main__'` 。

如果我们希望有一些内容，在这个文件被当作 module 文件时不执行，而当作运行脚本文件时执行，那么可以这样写：

``` python
if __name__ == '__main__':
    print("Content only in script.")
```

BTW, 我们执行 module 文件的方式是：

``` shell
python -m lib
```

经过粗略的考究，这种方式和如下方式并没有大区别：

``` shell
python lib.py
```

# Package

只引入 module 的概念并不能形成“层次化”的管理模式，所以我们又引入了 package 的概念。

简单来说，package 就是包含多个 subpackages 和 modules 的的文件夹。除此之外，这个文件夹下还必须包括 `__init__.py` 这个文件。

`__init__.py` 文件内可以什么内容都没有，它主要是用于向 python 声明这不是一个普通的文件夹。当然它也可以有一些内容，如下所示：

``` python
__all__ = ["echo", "surround", "reverse"]
```

这个的意思是说，在如下代码中决定了到底要导出多少 modules ：

``` python
from pack import *
```
