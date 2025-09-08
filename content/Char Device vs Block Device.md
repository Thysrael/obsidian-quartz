Linux 中有两种设备，字符设备（Character Device）和块设备（Block Device）。两者在 `ls -l` 中第一个字符有如下区别：

``` shell
brw-rw---- 1 root disk 259, 7  3月31日 10:06 /dev/nvme0n1
crw-rw-rw-   1 root tty         5,     0  9月24日 19:24 tty
```

其中字符设备是 `c` ，而块设备是 `b` 。

其对比如下表所示：

|  | Char Device | Block Device |
|----|----|----|
| 数据访问 | 直接通过 `read/write` 系统调用 | 通过 FS 层操作 |
| 缓存机制 | 一般无缓存 | Page Cache |
| I/O 调度 | 一般无调度，立即处理 | 使用电梯算法等调度器 |
| 典型操作 | `file_operations` 操作直接处理字符流 | 处理 `bio request` ，操作扇区 |
| 适用场景 | 低延迟设备（键盘、串口，tty） | 高吞吐设备（SSD） |
