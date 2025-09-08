Kitty 终端使用的是远超 256 的真彩色（true color），被称为 `xterm-kitty` 。

在有些服务器上可能没有，似乎 kitty 会主动给 server 安装，但是如果没有 `sudo` 权限似乎就会安装失败。

这个时候我们可以找到我们 PC 上的 `~/.terminfo/` 文件夹，并将其中的内容移动到 server 上。然后设置环境变量：

``` shell
export TERM=xterm-kitty
```
