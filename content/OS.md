# Firmware

Firmware 固件存放在主板 ROM 中的软件，一般由硬件厂商提供，他们的主要任务是找到外存中对应的 bootloader 。

- [[BIOS]]
- [[UEFI]]
- [[Boot ROM]]

# Bootloader

Bootloader 是外存上的软件，用于加载操作系统。因为启动过程比较繁复，所以往往分成多个阶段进行加载（一般是 2 个阶段）。

Stage1 Bootloader 主要是对于内存控制器的设置和对于安全的设置:

- [[MBR]]

在 UEFI 盛行以后，Stage1 Bootloader 就逐渐退出历史舞台了，这是因为 UEFI 可以直接加载 Stage2 的 Bootloader 。

Stage2 Bootloader 主要负责加载内核：

- [[Uboot]]
- [[Grub]]

# 操作系统

- [[Linux]]
- [[Unix]]
- [[Windows]]

# 组件

- Linux 内核构建：[[Kernel Build]]
- 中断：[[Interrupt]]
- 进程管理：[[Process]]
- 进程间通信：[[IPC]]
- 文件系统：[[FS]]
- 虚拟化：[[Virtualization]]
- 设备：[[Device]]
- 安全：[[Security]]
- 并行：[Note not found: Parralle](id:431af327-c60e-4f6f-852a-4784b3171bfe)
- 初始化：[[Init]]
- 网络：[[Network]]

# 理念

- 微内核：[[Microkernel]]
- 外核：[[ExoKernel]]
