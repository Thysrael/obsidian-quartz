Kitty 终端使用的是远超 256 的真彩色（true color），被称为 `xterm-kitty` 。如果直接使用，会出现 `xterm-kitty unknown` 的报错。

初次使用的时候，应当使用如下命令来代替 `ssh` 命令：

```shell
kitten ssh <host>
```

这样 Kitty 就会自动安装 `~/.terminfo/` 。

但是如果是 root 用户，就不会自动安装了，但是此时我们可以使用如下软件包来解决这个问题：

```shell
sudo apt install kitty-terminfo
```