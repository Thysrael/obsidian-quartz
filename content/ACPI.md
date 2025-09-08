Advanced Configuration and Power Interface (ACPI) 是 X86 上可以对标 [[Device Tree]] 的设备接口架构。

X86 利用它来发现和配置计算机硬件组件、执行电源管理。相比于设备树，它具有更多的操作结构，可以通过 ACPI 来直接操作和监视设备，而设备树只提供了设备的描述功能。

ASL（ACPI Source Language）：一种用于描述硬件配置和电源管理的高级语言。AML（ACPI Machine Language）：ACPI 机器语言，是 ASL 代码编译后的形式，用于在系统中执行。

ACPI 命名空间（Namespace）是固件提供的硬件平台的层次视图。它包括处理器对象和设备对象声明、电源资源声明、GPE（通用事件）事件处理程序、热区映射。
