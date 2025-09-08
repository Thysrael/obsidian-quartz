# Config

Git config 会存在 `~/.gitconfig` 文件中。

可以用如下命令设置选项：

``` shell
git config --global <option> <value>
```

用如下展示特定选项：

``` shell
git config --global <option> 
```

用如下命令取消选项（其实也可以在 `~/.gitconfig` 中删除）：

``` shell
git config --global --unset <option> 
```

# HTTPS Proxy

使用如下命令设置：

``` shell
git config --global https.proxy https://127.0.0.1:<port>
```
