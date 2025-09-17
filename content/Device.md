设备在编程中也被叫做 **I/O** 。

# 设备列表

这里记录我所知道的设备：

- [[Console, Terminal, TTY]]
- [[SD vs eMMC]]
- [[GPIO]]
- [[Char Device vs Block Device]]
- [[NIC]]
- [[VirtIO]]
- [[TUN-TAP]]
- [[GPU]]
- [[HBM]]
- [[Unified Memory]]
- [[NPU]]

# 设备管理

这里介绍对于设备的管理技术：

- [[ACPI]]
- [[Device Tree]]
- [[Device Number]]
- [[UDev]]
- [[IOMMU]]

# 常数

这里记录一些常见设备的参数：

- HBM 4 的带宽是 1,638 GB/s 。
- NVLink 的带宽是 800GB/s 。
- DDR 4 3200 的带宽是 25.6 GB/s 。
- PCIe 的带宽与版本和通道数有关（总之大约是 10x GB/s 带宽的），目前最好的 PCIe 一般是 16 通道：
	- PCIe 3.0：约 1 GB/s 每通道
	- PCIe 4.0：约 2 GB/s 每通道
	- PCIe 5.0：约 4 GB/s 每通道
- NVIDIA A100 GPU 是 19,500 GFLOPS 。
- IPU MK2 的 inter-core 带宽是 5.5 GB/s ，共有 1472 个核，所以总带宽是 8,096 GB/s 。
- IPU MK2 的 FLOPS 是 250~280 TFLOPS(10<sup>12</sup>) ，即 265,000 GFLOPS 。
- APPLE M2 GPU 是 3,600 GFLOPS 。
- Intel i5-9600K 单核是 6.3 GFLOPS ，多核是 37.3 GFLOPS 。
- Mate60 GPU 2,300 GFLOPS 。
- Google TPUv4 是 275,000 GFLOPS 。
- Intel i5-14500 CPU 是 5GHz ，也就是一个 cycle 是 0.2 ns 。
- Linux TCP/IP 协议栈是 50,000 ~ 200,000 ns 。
- 网卡 Latency 是 1,000 ~ 10,000 ns ，而且有下降趋势。
- CPU 中断处理可能是 1ms 级别的。
- NIC 的 MMIO 是 400 ~ 1000 cycles
- 原子的大小是 0.1nm ，所以 4nm 的制程，就只有 40 个原子。

# 设计理念

- [[Enisum]]
- [[Roofline]]
