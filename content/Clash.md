# TUN

开启 TUN 模式会更加全面得代理程序。

开启 TUN 后有可能会导致 wifi 图标显示感叹号，此时可以通过关闭“强制门户（captive portal）检测”来去掉感叹号。“强制门户”就是酒店或者机场 WIFI 使用的机制，它会将 HTTP 流量劫持到“登录界面”。“检测”会向一个 HTTP 网址发送信息，主动出发劫持，相当于主动触发登录界面。

可能是因为 TUN 也类似于“劫持”，导致触发了这个功能吧。我们可以通过创建 `/etc/NetworkManager/conf.d/20-connectivity.conf` 来关闭检测：

``` conf
[connectivity]
enabled=false
```
