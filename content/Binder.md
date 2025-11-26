# 编程模型

Binder 是一种被 [[Android]] 广泛应用的 IPC 机制，但是它并不是基于原有的 Linux 的 IPC 机制实现的，而是通过一个 `binder` 内核模块来实现的。“Binder”的中文是“装订机”或者“黏合剂”，这说明它在中间沟通 IPC 中的 server 和 client 的作用。

虽然像 [[Socket]] 等 IPC 机制也会有类似 server 和 client 的分工，但是 binder 的抽象程度要更高，它可以直接让 client 使用 server 注册的函数（还是以面向对象的方式），而其他的 IPC 机制，还局限于传递数据。

# 工作流程

启动：

- Server 启动，将给 Client 提供的服务注册到 ServiceManager
- Server 创建一个 `Stub` 对象，用于调用 Server 的服务
- Client 启动，并通过查询 ServiceManager 找到 Server 提供的服务
- Client 创建一个 `Proxy` 对象，Client 如果想调用 Server 的服务，可以直接调用 `Proxy` 

调用：

- Client 通过 `Proxy` 调用方法
- `Proxy` 将这个方法通过 `ioctl` 发送给 `/dev/binder` 驱动
- `binder` 将方法转发给 `Stub`
- `Stub` 在 Server 侧开始进行处理

# 底层实现

在 IPC 时，Binder 采用的是以 `mmap` 为原理的“一次拷贝”流程。

即 Server 和 Client 都通过 `mmap` 与 kernel 共享地址空间，但是它们两个的共享地址空间并不相同，所以还需要由内核帮忙中转一次。


