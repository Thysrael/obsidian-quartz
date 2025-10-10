# DS_store

为了避免 Finder 污染外部设备，可以使用如下命令：

``` shell
# 禁用网络存储生成（推荐）
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true

# 禁用外接存储生成（如 U 盘）
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true
```

此外也可以完全关闭 Finder 生成 `.DS_store` 的能力，但是我不确定是不是真的完全关掉了（经过实践以后发现并不会真的关掉）：

```shell
defaults write com.apple.finder AppleShowAllFiles FALSE
```

如果希望恢复，那么可以使用如下命令：

```shell
defaults write com.apple.finder AppleShowAllFiles TRUE
```

# LauchCtl

为了给 GUI 应用添加环境变量，可以这样操作：

编辑 `/etc/launchd.conf` ，其形式如下：

```shell
setenv CONTINUE_GLOBAL_DIR "$HOME/.config/continue/"
```

但是这种方式似乎时灵时不灵的。

# 指纹 Sudo

编辑 `/etc/pam.d/sudo` 文件，在开头增加如下内容：

```conf
auth sufficient pam_tid.so
```

# 访问权限

在使用 [[Kitty]] 这样的终端程序的时候，经常会出现一些 "permission" 的报错，即使加上 `sudo` 也会有这种现象。

此时我们可以在 `system setting` 里选择 `privacy & Security` ，然后再选择 `Full Disk Access`，将对应程序的权限打开即可。

如果希望让程序拥有卸载其他程序（比如 Appcleaner）的权利，也可以选择 `App Management` 来完成。

# 下载非官方 App

使用如下命令可以解决“已损坏，无法打开。您应该将它移到废纸篓​”的报错。

```
xattr -cr /Applications/<APP_NAME>
```

可以在 [这里](https://appstorrent.ru/) 下载软件。