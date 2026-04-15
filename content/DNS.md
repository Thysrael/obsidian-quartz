DNS(Domain Name Server) 是一种建立从域名（比如说 `www.baidu.com` ）到 IP 地址（比如 `192.168.0.1` ） 之间映射关系的服务器。

DNS 里面 map entry 主要有 3 种类型：

- `A`: 表示 IPv4 Address，记录“域名 -> IPv4 IP Address”
- `AAA`：表示 IPv6 Address，记录“域名 -> IPv6 IP Address”
- `CNAME`：Canonical Name，也就是别名，记录着“域名 -> 另一个域名”