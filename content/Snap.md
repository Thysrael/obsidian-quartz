Snap 是由 Canonical 开发的一个软件包管理系统，Snap 包在几乎所有主流的 Linux 发行版上都可以运行，它的包含自身的依赖，这意味着即使系统没有这些依赖，软件也可以独立运行。

除了这些以外，Snap 的更新也比较快。通过 snap ，在 [[Ubuntu]] 这样的稳定 OS 上可以体验到新软件。命令如下所示：

``` shell
sudo snap install emacs --classic
sudo snap remove emacs
```

snap 会将软件安装到 `/snap` 下。
