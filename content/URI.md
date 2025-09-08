# 来由

随着互联网的兴起，需要一种标准化的方法来标识和访问网络资源。统一资源标识符（Uniform Resource Identifier, URI）提供了一种统一的方法来标识和访问各种互联网资源的方式。

我个人感觉，除了访问互联网资源外，URI 还提供了一种 [[IPC]] 的辅助手段。陌生的进程想要通信，就需要利用 **公共的标识符** （比如 share key 或者 fd），URI 就是这样的公共标识符。

# 分类

它可以分为两类：

- URL (Uniform Resource Locator)：统一资源定位符，比较常见
- URN (Uniform Resource Name): 统一资源名称，如 ISBN（国际标准书号）， `urn:isbn:0451450523` 。

# 格式

格式如下：

``` text
scheme:[//[user:password@][ip_addr|host[:port]]]path[?query=string][#fragment]
```

各个部分：

- `scheme`: 指定访问资源所用的协议，如 `http` 、 `https` 、 `ftp` 等。
- `authority`: 包含用户信息、主机名和端口。其中如果没有主机名 `host` 的话，也可以使用 IP 地址代替。
- `path`: 指定资源在服务器上的位置。
- `query`: 提供非层次化的参数。
- `fragment`: 用于标识资源的子部分。

# 使用

应用程序（一般是浏览器）解析 URI，提取出协议（如 HTTP、HTTPS）、主机名、端口号和路径等信息。然后应用程序根据这些信息创建 Socket 完成通信。
