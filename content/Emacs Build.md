# 构建 Emacs

使用如下命令：

``` shell
wget https://ftp.gnu.org/pub/gnu/emacs/emacs-30.1.tar.xz
tar xvf emacs-30.1.tar.xz
cd emacs-30.1
./configure --without-x --without-gnutls --without-pop --without-sound --with-tree-sitter --without-native-compilation
```

# 构建 Tree-sitter

使用如下命令：

``` shell
git clone git@github.com:tree-sitter/tree-sitter.git
cd tree-sitter/
make
make install PREFIX="~/.local"
export LD_LIBRARY_PATH=/usr/local/lib/
sudo ldconfig # update the ld cache
```

# 配置文件

不要寄希望于 [[Straight]] 自己下载了，需要拷贝 `straight/repos/`, `tree-sitter` 。

# LSP

[[Ubuntu]] 常常无法用 `apt` 安装 lsp server ，此时就可以用 [[Snap]] 进行安装，如：

``` shell
sudo snap install pyright --classic
```

这种方法其实还是太麻烦了，最简单的方法是用 [[Conda vs Pip]] 来安装，如：

``` shell
pip install pyright
```

# App Image

白努力了这么半天，后来发现可以使用 AppImage ，在这个 [链接](https://github.com/blahgeek/emacs-appimage) 下载。
