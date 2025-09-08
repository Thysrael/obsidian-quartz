# 包管理器

Python 的包管理器都具有隔离的功能，而且都非常明显，总是要激活一个虚拟环境的。但是都没有 lock 文件的功能，这也是他们总是需要虚拟环境的原因，因为项目无法根据像 `package.json, package.lock` 等文件来确定依赖。

# Conda

`conda` 是 Anaconda 的包管理器，Anaconda 是一个 **数据科学与机器学习工具集的发行版** ，这个工具集中不止有 python 的软件包，还有 `R, Ruby, Lua, Scala` 之类的软件包。

所以 `conda` 并不只是一个 python 包的管理器，只是恰好可以下载 python 包罢了，它支持一系列命令，如：

``` shell
# 更新 Conda 自身
conda update conda
# 创建一个新的环境
conda create --name myenv
# 创建一个带指定 Python 版本的环境
conda create --name myenv python=3.8
# 激活环境
conda activate myenv
# 停用当前环境
conda deactivate
# 列出所有环境
conda env list
# 删除环境
conda remove --name myenv --all
# 安装包
conda install package_name
# 从特定通道安装包
conda install -c channel_name package_name
# 更新包
conda update package_name
# 删除包
conda remove package_name
```

此外在 `conda` 虚拟环境中是可以使用 `pip` 来安装软件包的，安装的软件包同样会被 `conda` 监管。但是要注意如果在 `~/.local/bin/` 下有 `pip` ，是有可能使用 local pip 的，此时安装的包会被安装到 local 环境，所以要用如下命令核查：

``` shell
which python
```

如果还是不放心，可以先安装一个小包，检验它的安装目录：

``` shell
pip install tqdm
pip show tqdm
```

在实际使用的时候我们一般使用 `miniconda` ，它只包括 `conda` 和 `python` ，以及其基本的依赖。而 Anaconda 预装了很多软件包。

# Pip

`pip` 并不创建隔离环境的能力，需要依赖 python 自带的 `venv` 模块：

``` shell
# 创建一个名为 myenv 的虚拟环境
python3 -m venv myenv
# 激活这个虚拟环境
source myenv/bin/activate
# 退出虚拟环境
deactivate
```

激活环境后，就可以使用 `pip` 了，如下所示：

``` shell
# 升级 pip 到最新版本
python -m pip install --upgrade pip
# 安装包
pip install package_name
# 安装指定版本的包
pip install package_name==1.0.0
# 升级已安装的包到最新版本
pip install --upgrade package_name
# 卸载包
pip uninstall package_name
# 查看已安装的包列表
pip list
# 查看可升级的包
pip list --outdated
# 搜索包
pip search package_name
# 显示包的详细信息
pip show package_name
# 导出当前环境的所有包到 requirements.txt 文件
pip freeze > requirements.txt
# 从 requirements.txt 文件安装所有包
pip install -r requirements.txt
```

在使用完环境如果想保留环境，可以使用如下命令：

``` shell
pip freeze > requirements.txt
```

等到他人使用的时候，可以运行如下命令恢复环境：

``` shell
pip install -r requirements.txt
```

# Python Version

除了软件包以外，python 的版本也很重要。特定版本的 python 下可以运行的软件包，可能切换成了另一个版本的 python 上就行不通了。

使用 `conda` 可以指定 python 的版本：

``` shell
conda create --name myenv python=3.8
```

而 `pyenv` 也可以管理 python 的版本，如下所示：

``` shell
pyenv install 3.8.0
pyenv global 3.8.0
pyenv local 3.8.0
pyenv versions
```

这两种方法我都不用，而是直接在 [[ArchLinux]] 上安装多个版本的 python ，如果有需要使用低版本的 python ，那么就在命令行中使用：

``` shell
python3.11 -m venv venv
```

# Wheel

我个人理解 wheel 是编译好用于分发的二进制文件，它的后缀名是 `.whl` ，但是为什么 python 还有编译过程？这是因为有些 Python 包中有 [[C]] 或者 [[C++]] 拓展，所以编译好再分发，就避免了客户端的编译。

# 不只是 Python

不知道为什么，用 python 包管理器是可以安装一些完全和 python 没有啥关系的东西，比如说：

``` shell
pip install pyright
pip install cmake
```

我觉得这个性质很有用，是因为在服务器上常常没有 `root` 权限，而且也没法用 [[Docker]] ，所以安装很多东西都非常不方便。这个时候用 python 包管理器来安装就很方便了。

从这个角度看，虽然 `conda` 比 `pip venv` 要笨重，但是它可以安装各种其他语言的包，更加方便。我在实践中遇到了一个需要安装 `python3-dev` 的需求，但是没法 `sudo` ，用 `pip venv` 没有办法解决，而用 `conda` 根本没有需要解决。
