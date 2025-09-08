# Old

ZSH 的配置非常恶心，所以姑且记录一下：

首先我们最好不要修改 `$ZDOTFILE` 这个环境变量来改变 `.zshrc` 的位置，因为这样我们使用 [[Ssh]] 的时候并不会读取这个变量，导致每次登录都会重新创建 `~/.zshrc` 这个文件。

但是其他配置文件，比如说插件文件，本质上都是在 `.zshrc` 中 `source` ，所以可以修改位置。

zsh 只有在有 `history` 文件的时候才能实现自动补全功能，这个变量由 `$HISTFILE` 控制。此外补全还依赖 compdump 文件，这个变量由 `$ZSH_COMPDUMP` 控制。

`$ZSH` 变量其实是 oh-my-zsh 的变量，也可以修改。

# Install

首先用包管理器安装 `zsh`:

``` shell
apt install zsh
```

首次运行 `zsh` 的时候会生成一个交互式的配置界面，这个交互式的生成界面会指导生成 `.zshrc` 文件。

然后我们用如下命令将 zsh 设置成默认 shell ：

``` shell
chsh -s /bin/zsh
```

使用该命令后似乎并不会立刻生效，我是用 `reboot` 修好的，但是似乎还可以用如下命令：

``` shell
exec -l$SHELL # -l means login
```
