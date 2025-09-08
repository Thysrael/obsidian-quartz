# Package

虽然在 [[Python Module Package]] 这里介绍过 package 的概念，但是这里介绍的是能够被 [[Conda vs Pip]] 安装的包，也就是用于“分发”的包。

这样的包必须要指明版本、依赖、测试和平台信息。

# `setup.py`

`setup.py` 是定义 package 元数据和依赖项的传统方法。它使用 `setuptools` 或 `distutils` 来指定如何构建和安装包。

# `pyproject.toml`

`pyproject.toml` 是定义 package 的新方法。

# Install

在开发完这些 package 后，我们需要把它加入到 python 开发环境中（一般是一个虚拟环境），这样我们才能在其他地方使用它们（其实在项目目录直接索引就可以，但是这样复用性会更好）。这个过程我们称之为 package install 。

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
