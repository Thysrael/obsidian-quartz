可惜了我没有时间了。大部分内容都在下面这个链接中：

https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html

有如下要点：

- 只要有脑子，无论采用哪种通信设计，通信量都不会变，会变的是某个节点或者链路是否会出现拥塞
- gather/scatter 与 broadcast/reduce 的区别，前者持有的只是数据的一个 partition ，而后者持有的是数据的 replica
- 很多通信的底层拓扑都是 ring 和 tree ，这样的优势就是避免拥塞，但是可能通信需要分几轮。
- all-to-all 是最复杂的。
- AllGather 只需要一次通信，而 AllReduce 需要两次通信。
