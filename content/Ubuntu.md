# Apt

`apt` 是 Ubuntu 上的包管理器，它有如下命令：

``` shell
# install
sudo apt install package
# remove
sudo apt remove package
# remove and delete config file
sudo apt remove --purge package
# update package list
sudo apt update
# upgrade installed package
sudo apt upgrade
# search the package
sudo apt search package
```

其中值得强调的是，安装或者包的时候，并不会完全连网，包的搜索是在 `/etc/apt/sources.list` 下进行的，所以如果这个文件比较落后，那么安装和更新会并不及时，所以如果没有安装到符合预期的包，那么可以先使用 `sudo apt update` 来先更新。

此外，我们还常见到 `apt-get` 指令，这个指令是 `apt` 的“前辈”， `apt` 可以兼容 `apt-get` 的命令，两者的命令都很类似， `apt` 的优点在于对于 `search` 的支持更好，并且可以支持更加复杂的依赖关系，更新包时会删除旧版本的包。

# Dpkg

`dpkg` 是 Debian 系统及其衍生版本（如 Ubuntu）中用于软件包管理的底层工具。它用于安装、卸载和管理 `.deb` 软件包。 `dpkg` 不会自动处理依赖关系，所以常来来说我们只使用 `apt` ，相当于基于 `dpkg` 的一个可以处理依赖关系的封装。

我们使用 `dpkg` 往往是基于手动安装包的场景，如下所示：

``` shell
# download the package.deb to current dictory
sudo apt download package
# install package
sudo dpkg -i package.deb
# fix the broken dependency, not nessary
sudo apt install -f
```

如果希望卸载包，可以用：

``` shell
# 卸载软件包，但保留配置文件
sudo dpkg -r package.deb
# 完全卸载软件包，包括配置文件
sudo dpkg -P package.deb
```

# Update-alternatives

在 Ubuntu 中我们可以安装同一个软件的不同版本，比如说我们希望安装一个较靠前版本的 `gcc` ：

``` shell
sudo apt install gcc-4.8
```

然后我们可以使用如下命令来切换版本：

``` shell
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 100
```

切换完后可以用如下命令查看：

``` shell
sudo update-alternatives --config gcc
```

可以使用如下命令删除上面的设置：

``` shell
sudo update-alternatives --remove gcc /usr/bin/gcc-4.8
```
