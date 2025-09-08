# DS_store

为了避免 Finder 污染外部设备，可以使用如下命令：

``` shell
# 禁用网络存储生成（推荐）
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true

# 禁用外接存储生成（如 U 盘）
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true
```

此外也可以完全关闭 Finder 生成 `.DS_store` 的能力，但是我不确定是不是真的完全关掉了：

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
