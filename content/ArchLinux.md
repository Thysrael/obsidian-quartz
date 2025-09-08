# 删除软件包

当需要彻底卸载一个软件包时，可以使用如下命令：

``` shell
yay -Rns <package-name>
```

其中参数为：

- `R`: 移除（remove）指定的包。
- `n`: 不保存（no-save）依赖项。
- `s`: 移除未使用的依赖项（cascade removal）。

# 参数

`pacman` 和 `yay` 的参数很相近，其中参数可以分为两类，第一类是大写的，表示 operation:

- `-S`: 安装软件包
- `-R`: 删除软件包
- `-U`: 安装本地包
- `-Q`: 查询已安装的软件包

operation 后是第二类小写参数，为 option ，用于修饰 operation ，可以使用 `--help` 进行命令的查询，如：

``` shell
pacman -Q --help
```

# 安装特定版本

如果希望安装特定版本的包的话，可以在 [ALA](https://archive.archlinux.org/packages/) 下找到适合的版本，然后使用如下命令安装：

``` shell
pacman -U https://archive.archlinux.org/packages/path/packagename.pkg.tar.zst
```

其中 `zst` 是一种被叫做 Zstandard 的特殊压缩包。里面是二进制文件。这个软件包是通过 `PKGBUILD` 文件而来的。

但我们有了一个 `PKGBUILD` 文件，就可以通过 `makepkg` 命令构建出 `.pkg.tar.zst` 文件。然后再通过 `pacman -U` 命令安装。

在传统的安装流程中， `pacman` 同样会缓存二进制文件，它会被放在 `/var/cache/pacman/pkg/` 下。

# 打扫系统

`pacman` 的 query 功能是我们打扫系统的基础，当我们直接使用 `pacman -Q` ，就会列出所有的软件包，和他们的版本，如下所示：

``` shell
aarch64-linux-musl 1.2.4-1
acpi 1.7-4
acpica 20240927-1
acpid 2.0.34-2
...
```

如果我们使用 `-q` 参数，那么就只会出现软件包的名称，而不会出现版本号：

``` shell
python-epc
python-ordered-set
python-prettytable
python-pymupdf
```

这种方式的好处在于它可以作为 `pacman` 安装或者删除软件包的输入。

此外还有如下重要参数：

- `-t`: 展示所有的“孤儿包”，即现在不作为其他包的依赖的包。
- `-e`: 展示所有“主动”安装的包。
- `-d`: 展示所有“被动”安装的包，即作为其他的包的依赖被安装的包。需要注意的是，这里强调的是“安装时”的被依赖了，现在可能是孤儿。

但是并不是所有的孤儿包都可以被安全地删除，比如像 EAF 这样的程序，它作为 emacs 的插件，隐式许多 python 包，这种依赖关系并不会被 `pacman` 监视到。

# MakePkg

`makepkg` 用于从 **源码** 构建软件。更具体的说， `makepkg` 负责由脚本文件 `PKGBUILD` 构建出二进制文件 `.pkg.tar.zst` 。

我们使用 `pacman` 的过程，本质是下载 `.pkg.tar.zst` 并安装的的过程。但是软件源，本质是监控 `PKGBUILD` 的更新，而不是监控二进制文件的过程。

因此如果我们希望通过修改 `PKGBUILD` 来自定义构建过程，那么虽然我们用 `pacman` 可以查看它们，但是我们并不能更新它们，因为它们不来自软件源，它们的 `PKGBUILD` 是我们自己在维护，因此没法更新。

我们修改完 `PKGBUILD` 后，可以使用如下命令来安装包：

``` shell
makepkg -si
```

其中 `-s` 表示下载相关依赖， `-i` 表示安装。
