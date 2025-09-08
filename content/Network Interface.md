网络接口是 Linux 提供的关于 **网络连接** 的抽象。可以粗浅的理解为网卡（[[NIC]]），而实际上不只是网卡，还包括虚拟接口（比如 [[Docker]] 和 [[VMWare]] ）回环设备等。

有如下种类：

- 以太网接口（Ethernet Interface）：也就是有线网卡，以 `eth` 或者 `enp` 开头
- 无线接口（Wireless Interface）：也就是无线网卡，以 `wlan` 或者 `eth` 开头
- 回环接口（Loopback Interface）：用于在同一个计算机内部的通信，可以用于测试程序和进程间通信，借助了端口的概念
- 虚拟接口（Virtual Interface）：虚拟机的网络接口，通常以 `veth, tun, tap` 开头
- 桥接接口（Bridge Interface）：网桥是一种中继设备，它工作在数据链路层（废话），和工作在 IP 层的就是网关了。每个网桥可以看作是一个 LAN 的关口，以 `br` 开头。

近些年来，以太网接口和无线接口的命名规范化，如 `enpXsYfZ` 中的 `X` 表示主板上的物理编号， `Y` 表示插槽上的端口号， `Z` 表示某个特性。这种命名方式提供了更加稳定和可预测的网络接口命名方式。

网络接口非常像一个设备，它上面会有和网卡设备紧密连接的属性，比如说 `MTU` ， `MAC ADDR` ， `STATE` ， `Interface Name` 等，也有通过 IP 地址的信息，比如说 `IPv4` （又叫做 `inet` ）， `IPv6` （又叫做 `inet6` ）， `Port` 。
