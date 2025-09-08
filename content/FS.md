# 一切皆文件

文件系统在“[[Everything is a File]]”的设计哲学下，不再是一个单纯的数据组织形式，而变成了一种通用的接口。

特殊的文件有：

- 用户态缺页异常文件：[[UserFaultFD]]
- 信号处理文件：[[SignalFD]]
- 性能事件文件：[[PerfEventFD]]

# 文件系统类型

## 虚拟文件系统

- 临时文件系统：[[TmpFS]]
- 进程文件系统：[[Proc FS]]
- 系统文件系统：[[Sys FS]]

## 磁盘文件系统

- [[FAT]]
- EXT
- [[BtrFS]]
- [[NTFS]]

# 设计思想

- [[FAT vs INode]]
- [[FS Journal]]
