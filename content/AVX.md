高级向量扩展指令集（Advanced Vector Extensions, AVX）是 X86 上的向量指令集。是 [[SSE]] 向量指令集的拓展。

AVX 使用的寄存器 YMM 为 256 Bit, 而 SSE 使用的 XMM 寄存器只有 128 Bit 。AVX 还支持了三运算指令（3-Operand Instructions），比如说熔合乘法累积（FMA）运算，减少在编码上需要先复制才能运算的动作。

AVX-512 则使用新的 EVEX 前缀编码将 AVX 指令进一步扩展到 512 位。
