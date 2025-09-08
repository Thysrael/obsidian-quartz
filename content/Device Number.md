在 Linux 上， `ls -l` 展示设备文件输出如下：

``` shell
$ ls -l /dev/hda[1-3]
brw-rw----  1 root  disk  3, 1 Jul  5  2000 /dev/hda1
brw-rw----  1 root  disk  3, 2 Jul  5  2000 /dev/hda2
brw-rw----  1 root  disk  3, 3 Jul  5  2000 /dev/hda3
```

其中的 `3, 1` 和 `3, 2` 被称为设备号（Device Number）。第一个数字被称为主设备号（Major Number），第二个数字被称为副设备号（Minor Number）。

主设备号相同的设备，使用的都是同一个驱动程序；副设备号用于供驱动区分不同的设备。
