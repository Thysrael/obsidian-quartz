这里记录着 kernel 用到的 make rules:

# prepare

用于准备 Linux 内核源代码树，以便进行内核或模块的编译。具体来说，它会执行以下操作：

- 生成必要的头文件
- 检查和配置环境
- 创建符号链接和目录

# prepare<sub>modules</sub>

只准备内核模块编译所需要的环境。
