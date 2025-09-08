# 运行不同架构的可执行文件

在 `archlinux` 上需要安装 `qemu-binfmt-support, qemu-user` 这两个包。

`qemu-binfmt-support` 使得 qemu 可以解析其他架构的可执行文件，而 `qemu-user` 使得 host 可以利用 qemu 模拟其他架构来运行可执行文件。

这个功能十分强大，我们可以用它们来制作其他架构的根目录文件系统。

# Ubuntu Base Image for Qemu

## 创建镜像

使用如下命令创建一个 1G 的磁盘进行并格式化成 EXT4 格式：

``` shell
dd if=/dev/zero of=ubuntu.ext4 bs=1M count=1024
mkfs.ext4 ubuntu.ext4
```

## ChRoot 前

Ubuntu 磁盘镜像可以用于 qemu 等模拟器。但是普通的 Ubuntu Base 镜像并没有办法直接运行，因为缺少一些程序。我们可以使用 [[Chroot]] 进入根文件系统后，使用包管理器安装所缺少的硬件。

正如前所言，构架不同架构的根文件磁盘镜像，是需要 qemu 协助的，不然即使 chroot 进去，那些不同架构的包管理器可执行文件依然是无法在宿主机上执行的。

为此我们首先需要安装 `qemu-binfmt-support, qemu-user-static` 来进行异构执行。之所以使用 `static` ，是因为我们需要将其移动到磁盘文件系统中，移动 `static` 比较简单：

``` shell
cp /usr/bin/qemu-aarch64-static mnt/usr/bin/
```

除此之外还需要复制 host 的域名解析文件：

``` shell
sudo cp /etc/resolv.conf mnt/etc/resolv.conf
```

安装 Linux 内核模块：

``` shell
cd linux
sudo make modules_install ARCH=arm64 CROSS_COMPILE=aarch64-none-linux-gnu- INSTALL_MOD_PATH=mnt
```

## ChRoot 后

然后使用如下脚本完成 `chroot` ：

``` shell
#!/bin/bash

if [ ! -d "./mnt" ]; then
    mkdir ./mnt
    echo "mkdir mnt"
fi

mount$1 mnt
mount --bind /sys mnt/sys
mount --bind /proc mnt/proc
mount --bind /dev mnt/dev
mount --bind /dev/pts mnt/dev/pts # 伪终端
chroot mnt
```

然后在 `chroot` 后还需要修改 `/tmp/` 文件夹的权限来让 `apt` 正常工作：

``` shell
chmod 1777 /tmp
```

ubunut base 是不带 `init` 等程序的，需要自行安装：

``` shell
apt update
apt upgrade
apt install init systemd sudo rsyslog resolvconf udev vim
```

安装完后还需要进行一些其他配置（[[Systemd]] 是需要普通用户的）：

``` shell
useradd -s '/bin/bash' -m -G adm,sudo hellouser
passwd hellouser
echo "ubuntu22" > /etc/hostname
```

退出后用以下脚本解绑：

``` shell
#!/bin/bash

umount mnt/sys
umount mnt/proc
umount mnt/dev/pts
umount mnt/dev
umount mnt
```

# `-device` 与 `-drive`

当我们在 qemu 中模拟一个外存设备时，使用的参数如下：

``` shell
-device virtio-blk-device,drive=hd0 \
-drive file=ubuntu22-base.ext4,if=none,format=raw,id=hd0 \
```

需要 `-device` 和 `-drive` 两个参数。其实可以理解为 `-device` 参数是前端，用于定义和 CPU 交互的接口，而 `-drive` 是后端，用于定义实际的设备参数，两者通过 `id` 衔接。这是一种“控制器-设备”解耦的思想。唯一值得诟病的就是， `drive` 这个单词看上去太像前端了。

网络设备也是同理，以 `-device` 为前端，以 `-netdev` 为后端，如下所示：

``` shell
-device virtio-net-device,netdev=eth0 \
-netdev user,id=eth0 \
```

# 系统虚拟化

系统虚拟化包括 3 个部分：

- CPU 虚拟化
- 内存虚拟化
- 设备虚拟化

需要强调的是，这 3 个部分即使不借助 KVM ，作为一个基本上没啥特权的 Qemu 也是可以完成的。但是同时也需要强调，Qemu 可以完成这些，不是简单的一个“Minecraft 里搭建计算机”这么简单的事情，并不能仅靠用户态的那些资源（CPU 和内存）完成，因为设备模拟不能完成。比如说你希望 Qemu 可以模拟一个显示器，你就给他 CPU 和虚拟内存，你打死 Qemu 它也办不到啊，网卡也是同理，你或许可以用软件写出来一个实现了物理层和数据链路层协议的网卡，但是这个网卡一定不能跟真实的物理网卡一样收包和发包。

所以 Qemu 在模拟这些设备的时候，其实更像是宿主机的设备资源，Qemu 充当了一个“设备复用器”的角色，它会不断的发起系统调用来调用真实的物理设备，并将其转发给 VM 。

Qemu 最原始的 CPU 模拟，就是对 VM 的机器码进行二进制翻译，对于寄存器和特权级，也可以用软件进行模拟，这是合乎自然的。

Qemu 最原始的内存模拟，就是将自己的一片虚拟地址区域，交给 VM 当作物理地址区域，并且时时帮助 VM 完成地址翻译（相当于软件 MMU 了）。
