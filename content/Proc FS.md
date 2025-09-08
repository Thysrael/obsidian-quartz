# 进程信息

`/proc/` 提供了一个接口用于访问进程信息的虚拟文件系统。我们可以使用 `/proc/<pid>` 的形式去访问某个进程的信息。

## `maps`

存储着程序的内存布局，如下所示：

``` fundamental
555555554000-555555555000 r--p 00000000 00:1b 5638740     ~/gdb/test
555555555000-555555556000 r-xp 00001000 00:1b 5638740     ~/gdb/test
555555556000-555555557000 r--p 00002000 00:1b 5638740     ~/gdb/test
555555557000-555555558000 r--p 00002000 00:1b 5638740     ~/gdb/test
555555558000-555555559000 rw-p 00003000 00:1b 5638740     ~/gdb/test
555555559000-55555557a000 rw-p 00000000 00:00 0           [heap]
7ffff7da0000-7ffff7da3000 rw-p 00000000 00:00 0 
7ffff7da3000-7ffff7dc7000 r--p 00000000 00:1b 811416      /usr/lib/libc.so.6
7ffff7dc7000-7ffff7f38000 r-xp 00024000 00:1b 811416      /usr/lib/libc.so.6
7ffff7f38000-7ffff7f86000 r--p 00195000 00:1b 811416      /usr/lib/libc.so.6
7ffff7f86000-7ffff7f8a000 r--p 001e3000 00:1b 811416      /usr/lib/libc.so.6
7ffff7f8a000-7ffff7f8c000 rw-p 001e7000 00:1b 811416      /usr/lib/libc.so.6
7ffff7f8c000-7ffff7f96000 rw-p 00000000 00:00 0 
7ffff7fc1000-7ffff7fc5000 r--p 00000000 00:00 0           [vvar]
7ffff7fc5000-7ffff7fc7000 r-xp 00000000 00:00 0           [vdso]
7ffff7fc7000-7ffff7fc8000 r--p 00000000 00:1b 811407      /usr/lib/ld-linux-x86-64.so.2
7ffff7fc8000-7ffff7ff1000 r-xp 00001000 00:1b 811407      /usr/lib/ld-linux-x86-64.so.2
7ffff7ff1000-7ffff7ffb000 r--p 0002a000 00:1b 811407      /usr/lib/ld-linux-x86-64.so.2
7ffff7ffb000-7ffff7ffd000 r--p 00034000 00:1b 811407      /usr/lib/ld-linux-x86-64.so.2
7ffff7ffd000-7ffff7fff000 rw-p 00036000 00:1b 811407      /usr/lib/ld-linux-x86-64.so.2
7ffffffdd000-7ffffffff000 rw-p 00000000 00:00 0           [stack]
ffffffffff600000-ffffffffff601000 --xp 00000000 00:00 0   [vsyscall]
```

其字段解释如下：

- `rwxp`: 分别是 read, write, execute, private ，private 指的是是否被其他进程共享
- `00000000`: 所在文件的偏移量
- `00:1b`: 设备号
- `5638740`: inode 号

从这里可以看出，全局变量（数据段）、PC 和函数指针（数据段）和堆变量（堆）都位于低地址区（以 `0x55` 开头），而局部变量（栈）和动态链接库都在高地址区（以 `0x7f` 开头），根据这个方式，可以在调试的时候判断变量的位置。

# 内核信息

除了进程信息外， `/proc/` 还提供了对于内核信息的访问（所以我觉得其实 `/proc/` 本质是一个展示 **运行时** 的文件系统），比如说：

- `/proc/cpuinfo` ：显示 CPU 的信息。
- `/proc/meminfo` ：显示内存的使用情况。
- `/proc/version` ：显示内核的版本信息。
- `/proc/modules` ：显示内核模块挂载信息。
- `/proc/kallsyms` ：内核的所有符号
- `/proc/devices` ：内核所有的设备驱动（即每个主设备号一行）

需要注意，在查看 `/proc/` 时最好加上 `sudo` ，这是因为很多信息都只有在 root 权限下才能得到正确展示。
