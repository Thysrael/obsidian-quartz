# NVSwitch

NVLink 在单节点的硬件上，是通过 NVSwitch 实现的。

NVSwitch 就像一个 crossbar 一样，连接到这个节点里的所有 GPU 上，为每对 GPU 提供 pairwise 的 NVLink ，而不需要真的提供 all-to-all 的拓扑连接。

![nvswitch](img/nvswitch.png)
