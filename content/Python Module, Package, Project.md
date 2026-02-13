# Module 

## Import

在 python 中，module 就可以理解成一个 python 文件。它起得作用，就是提供一些我们需要的函数。

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

在 import 的时候，本质上是将 `lib.py` 中的代码执行了一遍。

## `__name__`

每个模块都会有一个 `__name__` 变量，它等价于 module 的名字（这个其实不准确，严格说它等于 `package.moduel` ），比如上面的 `lib` module ，它就有

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

## 层次化

只引入 module 的概念并不能形成“层次化”的管理模式，也就是说，我们只能在 `main.py` 所在的目录下平铺一堆 `lib.py` ，这显然是不够的。

因此 python 提出了 package 的概念，它可以理解为包含 module 和 sub package 的文件夹。

## `__init__.py`

通常，package 这个文件夹下还必须包括 `__init__.py` 这个文件。

`__init__.py` 这个文件，会在 `import package` 的时候自动执行（按理说 `package` 是一个文件夹，`import` 不会执行任何源码）。

`__init__.py` 文件内可以什么内容都没有，它主要是用于向 python 声明这不是一个普通的文件夹，而是一个 package。

当然它也可以有一些内容，用于控制其下的 module 的导出，如下所示：

``` python
__all__ = ["echo", "surround", "reverse"]
```

这个 `__all__` 的意思是说，在如下代码中决定了到底要导出多少符号。我们用这种方式，可以避免所有符号都暴露出去。

## Path

我们可以用 `.` 来索引在 package 内的 module ，比如说：

```python
import A.B
```

这意味着 package `A` 内的 module `B` 。

这种语法思路其实跟文件系统的目录树有点像。似乎我们就是有一个 `A` 文件夹，它下面有一个名叫 `B.py` 的文件一样。

怎么说呢，这种说法也不能错，大概率确实是这样的，但是这就产生了一个问题，那就是 `A` 这个目录在基于哪里开始搜索的？是项目的根目录吗？还是说是脚本运行的目录？还是这个文件所在的目录？

其实都不是，在 python 运行的时候，维护着一个 `sys.path` 列表，它在这个列表中维护着一系列搜索 `A` 的路径，这就好像 [[Shell]] 中的 `PATH` 一样。

## Relative Dot

上面介绍了引用第三方 package 的方式，但是如果是我们自己开发的项目需要有一些层次性，那么我们该如何引用呢？我们并没有将我们自己的项目加到 `sys.path` 列表中啊。

这个时候就需要我们使用相对引用语法了，它的形式如下：

``` python
# C.py
import .A
import ..B
```

此时的文件结构如下

```
main.py
dir1/
	A.py
	dir2/
		B.py
		C.py
```

也就是说，我们可以用 `.` 语法，在 `C.py` 引用与它同目录的 `B.py` ，和在它父目录的 `A.py` 
既然是相对引用，那么就有一个问题，这里的相对，是基于目录结构（也就是基于 `C.py` 所在的 `dir2`），还是基于运行脚本（也就是 `main.py` 所在目录）。

在这点上，python 也没有让我们失望，是基于目录结构的，非常简单。
# Project

## 构建与分发

在上面我们介绍了 module 和 package 的概念，那么其实对于一个运行的系统来说足够了，但是对于软件的分发，还不够。

分发不仅需要源码，还需要有文档，有安装步骤，有构建步骤和版本信息之类的东西。而且我们有的时候也不会以“一个” package 为粒度，可能涉及“多个” package。

正因为如此，我们提出了 project 的概念，当我们使用如下命令的时候：

```shell
pip install numpy
```

本质上，我们不是安装了一个名为 `numpy` 的 package，而是安装了一个名为 `numpy` 的 project。

出于分发的考虑，python project 需要有一套规范。在最开始的时候是 `setup.py` ，而到了后面，变成了 `pyproject.toml` 。

## `setup.py`

`setup.py` 是定义 package 元数据和依赖项的传统方法。它使用 `setuptools` 或 `distutils` 来指定如何构建和安装包。

需要强调的是，并不是说 `setup.py` 就等价于 `setuptools`。 `setuptools` 只是打包工具，而 `setup.py` 中还包括项目名、版本信息等元数据。

`setup.py` 的核心是一个 `setup()` 函数，所有的元数据，都是这个函数的参数，一个 demo 如下：

```python
from setuptools import setup, find_packages

setup(
    name="my_awesome_project",    # 项目名称（pip install 后面跟的名字）
    version="0.1.0",              # 版本号
    author="Your Name",           # 作者
    
    packages=find_packages(),     
    
    install_requires=[            
        "numpy>=1.18.0",
        "requests",
        "pandas"
    ],
    
    entry_points={
        'console_scripts': [
            'start-my-app = mypackage.main:run',
        ],
    }
)
```

## `pyproject.toml`

`setup.py` 有两个最大的缺点：

- 难以自举：`setup.py` 依赖于 `setuptools`，而 `setuptools` 又需要在 `setup.py` 中声明
- 动态性过强：本质上是一个 python 脚本，所以可以写得非常自由，难以被解析（比如条件依赖），还有安全风险

`pyproject.toml` 是定义 package 的新方法，它是静态的、声明式的配置文件。比较重要的字段有：

项目元信息：

```toml
[project]
name = "mosaic"
version = "0.1.0"
description = "Mosaic inference engine"
readme = "README.md"
requires-python = ">=3.10,<3.11"
dependencies = [
    "numpy>=2.2.6",
    "torch>=2.6",
    "transformers>=5.0.0",
]
```

项目的构建信息（这里就避免了自举问题）：

```toml
[build-system]
requires = ["setuptools>=68", "wheel", "torch>=2.6", "numpy>=2.2.6", "ninja"]
build-backend = "setuptools.build_meta"
```

一般有了上面这两个部分就够了，此外，我们还可以给项目中涉及的工具（比如 `setuptools` 和 `uv`）传递各种参数：

```toml
[tool.setuptools.packages.find]
where = ["src"]

[[tool.uv.index]]
name = "pytorch-cu128"
url = "https://download.pytorch.org/whl/cu128"
explicit = true

[tool.uv.sources]
torch = { index = "pytorch-cu128" }
```

## Install

在开发完这些 project 后，我们需要把它加入到 python 开发环境中（一般是一个虚拟环境），这样我们才能在其他地方使用它们（其实在项目目录直接索引就可以，但是这样复用性会更好）。这个过程我们称之为 package install（是的，它这里又叫作 package 了，但是本质是 project）。

更本质的说，install 过程就是将包安装到当前 Python 环境的 `site-packages` 目录的过程。

我们使用如下命令来 install:

``` shell
pip install <package-path>
```

还有一个相关命令：

``` shell
pip install -e <package-path>
```

新增的 `-e` 参数将包以“开发模式”安装。即，你可以在源代码中进行更改，而无需每次修改后都重新安装包。这对于开发和测试手头的包非常有用。使用这个模式时， `pip` 会创建一个指向源目录的符号链接（而不是复制整个包），因此可以立即反映代码的变化。
