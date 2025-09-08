fdisk 是一款命令行磁盘分区工具，可以对一个设备文件进行分区，但是因为是命令行操作，所以我觉得可能有些不直观，不如 [[GParted]] 这种 GUI 工具舒服。

但是还可以用 fdisk 来查看磁盘分区情况，比较舒适，如下所示：

``` shell
sudo fdisk -l <image-path>
```
