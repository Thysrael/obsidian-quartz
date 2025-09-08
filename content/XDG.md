# Dotfile

XDG 是一套指导各种 APP 的文件在家目录下存放位置的规范，通过环境变量设置。

在 Archlinux 中，默认是不设置它们的，所以需要我们手动设置。我把它放在了 `/etc/profile` 下，因为各种 shell 都会用到这些变量：

``` shell
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_STATE_HOME="$HOME/.local/state"
```

更进一步，因为个人 PC 不用考虑多用户的问题，所以我把各种基于 XDG 的环境变量，也放在了 `/etc/profile` 下，如下所示：

``` shell
export GTK2_RC_FILES="$XDG_CONFIG_HOME"/gtk-2.0/gtkrc
export PYTHONSTARTUP="$XDG_CONFIG_HOME"/python/pythonrc

export NPM_CONFIG_INIT_MODULE="$XDG_CONFIG_HOME"/npm/config/npm-init.js
export NPM_CONFIG_CACHE="$XDG_CACHE_HOME"/npm
export NPM_CONFIG_TMP="$XDG_RUNTIME_DIR"/npm
export NPM_CONFIG_USERCONFIG="$XDG_CONFIG_HOME"/npm/npmrc

export ZSH="$XDG_DATA_HOME"/oh-my-zsh

export DOTNET_CLI_HOME="$XDG_DATA_HOME"/dotnet
```

这种方式避免有些 APP 是先于 shell 登录的，如果在 shellrc 中设置，就来不及的问题。

此外还些关于 zsh 的文件，我放到了 `/etc/zsh/zprofile` 中设置，如下所示：

``` shell
export HISTFILE="$XDG_STATE_HOME"/zsh/history
export ZSH_COMPDUMP=$ZSH/cache/.zcompdump-$HOST
```

这些设置都是在 [xdg-ninja](https://github.com/b3nj5m1n/xdg-ninja) 软件的帮助下完成的。

# Default Dir

像 `desktop` 和 `download` 这种默认文件夹的位置，都是在 `~/.config/user-dirs.dirs` 这个文件中记录着。
