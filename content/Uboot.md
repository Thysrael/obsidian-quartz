# 与 UEFI 关系

Uboot 广泛用于嵌入式系统。在使用了 uboot 后，就没有必要再使用 [[UEFI]] 了。在资源有限的嵌入式系统中，一个 uboot 就等价于了在台式机中常用的“UEFI + [[Grub]]”的组合。

不过 uboot 通常会支持一些 UEFI 的 Runtime Service 或者其他接口，这主要是为了避免修改原本运行在 UEFI 上的 OS （UEFI Aware OS）。

# uboot 启动命令

采用如下形式设置系统启动命令：

``` shell
setenv bootcmd '<command>'
saveenv
```

# 内核启动参数

用如下命令设置内核启动参数：

``` shell
setenv bootargs '--debug-dt'
```
