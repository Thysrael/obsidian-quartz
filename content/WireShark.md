Wireshark 是一款跨平台的网络协议分析工具。

WireShark 会捕获（Capture）网卡上的流量包，所以需要以 root 权限运行，这就造成了很多的安全问题。后来开发者将其分为了 Capturing 和 Displaying 两个部分，其中 Capturing 部分是一个命令行工具 `Dumpcap` ，用于收集网络接口上的包，运行在较高特权级。而 Displaying 部分用于设置捕获过滤器、分析数据包、查看协议，这个部分较为灵活，以较低特权级运行。

WireShark 的命令行工具被称为 `tshark` 。

WireShark 可以用 [[Lua]] 脚本来实现过滤器或者协议解析器，提高了 wireshark 的灵活度。
