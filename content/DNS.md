DNS(Domain Name Server) 是一种建立从域名（比如说 `www.baidu.com` ）到 IP 地址（比如 `192.168.0.1` ） 之间映射关系的服务器。

# DNS Entry

DNS 里面 map entry 主要有 3 种类型：

- `A`: 表示 IPv4 Address，记录“域名 -> IPv4 IP Address”
- `AAA`：表示 IPv6 Address，记录“域名 -> IPv6 IP Address”
- `CNAME`：Canonical Name，也就是别名，记录着“域名 -> 另一个域名”

# Find DNS

我们往往是通过 domain 来访问服务器的，但是这就引入了一个 Bootstrap 问题，即如果我们没有 DNS ，那么我们就无法获得 IP ，进而我们连 DNS 都访问不了。

因此 DNS 往往是没有域名的，它们只有 IP ，比较有名的是国内运营商的 DNS，阿里 ` 223.5.5.5`、腾讯 `119.29.29.29`、Cloudflare `1.1.1.1`、Google `8.8.8.8`、Quad9 `9.9.9.9`。

那么我们到底应该用哪一个呢？实际上，在默认情况下这也不归我们管，当我们的设备接入某个网络的时候，这个网络里的 [[DHCP]] 会告诉我们 DNS 的 IP 是什么，这个 DNS 往往也不是上面的 DNS ，而是一个离设备更近的次级 DNS 。

正因为 DNS 决定了我们实际访问的 IP ，而 DNS 又是由某个网络中的 DHCP 控制的（本质是这个网络的管理员控制），所以网络管理员很容易就可以实现一种“DNS 劫持/污染”的功能，也就是修改 DNS Entry ，让 domain 对应错误的 IP ，进而达到目的。比如说酒店的 [[Wi-Fi]] 就可以在未登陆的情况下，强制将任何网页都路由到登陆页面上。