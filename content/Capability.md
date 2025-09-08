# 抽象

Capability 的机制与 Unix/Linux 的 File 机制非常类似，都可以看作一个结构统一的内核资源的胖指针。当然 Capability 摆脱了 File 抽象中必须“像个文件”一样的约束，更加自由，更加多样化。

Capability 常用于微内核之中，这是因为为了分担内核的工作，微内核 Server 需要使用的内核资源更多，比如说在宏内核中我们很少看见物理内存这个资源，但是在微内核中，如果我们希望使用一个用户态的 Memory Manage Server ，Server 就必须能够使用物理内存资源，所以 Capability 就必须能描述物理内存。

# 安全设计

Capability 的安全设计更加独立，不再有“覆盖”的概念，详见 [[Hierarchical vs Capability]] 。

此外传统的安全模式是“隐式的、全局的”，比如说 [[Unix]] 提出的 user, group 抽象，程序本身的权限取决于程序调用者的权限，这就很容易出现混淆。而 capability 则是“显式的、细粒度的”。
