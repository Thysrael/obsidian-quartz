# 总论

GDB 并不一定适用于所有的场景，它有如下缺点：

1.  交互式，导致多次重复调试不可复现
2.  没有办法简单的实现过于复杂的输出逻辑
3.  部署有些难度，包括开启编译选项，还有调试内核所需要做出的额外努力

所以可能 gdb 对我来说只能是解决某些特殊问题的工具，而不是一个普世的工具，除非解决上面提出的问题。

# 启动

我们一般使用如下命令启动 gdb ：

``` shell
gdb program
```

当然如果没有指定 `program` ，在进入 `gdb` 以后，也可以使用如下命令来指定要调试的文件：

``` shell
file program
```

但是这种方式并不是说程序已经开始运行了，而只是将可执行文件和符号表文件（symbol-file）加载到 `gdb` 中了。如果希望多加几个符号表文件，这种情况一般出现在加载动态链接库文件或者在内核调试中，加载内核模块或者用户程序：

``` shell
add-symbol-file [filename] [address]
```

因为需要指定地址，所以并不是一个很方便的事情。是需要查询 [[ELF]] 文件的。不过可以用如下命令自动化：

``` gdb-script
define add-symbol-file-auto
  # Parse .text address to temp file
  shell echo set \$text_address=$(readelf -WS$arg0 | grep .text | awk '{ print "0x"$5 }') >/tmp/temp_gdb_text_address.txt

  # Source .text address
  source /tmp/temp_gdb_text_address.txt

  #  Clean tempfile
  shell rm -f /tmp/temp_gdb_text_address.txt

  # Load symbol table
  add-symbol-file$arg0$text_address
end
```

我们需要使用 `run/r` 来运行程序，在运行前需要设置好断点。在 `run` 的时候可以后面增加参数，就是传递给这个程序的参数。

我们常常会在 `main` 程序开始处打一个断点，如果觉得太麻烦，可以用 `start` 命令，它是 `b, r` 的结合体。

# 单步调试

## 断点

设置断点的方式如下：

``` gdb-script
break/b <where>
delete <breakpoint> # Remove a breakpoint
clear # Remove all breakpoints
enable/disable <breakpoint>
```

其中 `where` 是：

``` gdb-script
function_name
line_number
file_name:function_name
file_name:line_number
```

## 运行

使用 `next/n` 可以单步执行，使用 `step/s` 可以进入函数执行。

使用 `continue/c` 可以到达下一个断点，使用 `finish` 可以到达函数的 `return` 处。 `util <where>` 会运行到指定的地点，类似于一个临时的断点了。

# 信息打印

## 格式化输出

`print/p` 命令具有简单的格式化功能，比如说： `print/x` 表示 16 进制打印。

如果希望使用更加现代化的打印方式，需要使用 `printf` ，如下所示：

``` gdb-script
printf "%d iter, sum: %d\n", i, sum
```

需要注意的是， `\n` 是必不可少的，否则会不显示打印的内容。

## 栈

可以使用 `backtrace/bt` 打印调用栈，如果使用 `bt full` 则会将栈上的所有局部变量一起打印。

使用 `show locals` 会打印当前栈帧， `show args` 会打印当前栈帧的参数。

如果希望打印非当前栈帧的局部变量，那么可以先用 `frame <n>` 切换栈帧（其中 `n` ）

## 持续打印

`display` 类似于 `print` ，但是它会在每次交互式命令结束后，都打印一遍，可以用于追踪变量。

使用 `info display` 可以查看自己设置的持续打印变量，然后使用 `enable/disable display <n>` 可以开启或者禁用这些变量。

## 源码

使用 `list/l` 可以打印源码，使用 `l .` 可以重新定位。

# 场景

## Core dump/Bus error/Segmentation fault

非常好用，gdb 后使用 `bt` 就可以查看在哪里 coredump 了。

## Deadlock

我们可以使用 gdb 的 `attach` 功能直接调试发生死锁的进程，方式如下：

``` shell
gdb <program> <pid>
```

然后就可以用 `bt` 之类的查看了调用栈，然后用 `info threads` 查看多线程，并用 `thread <n>` 进行切换。

# 技巧

## 调用函数

可以使用 `call` 命令调用 C 程序里的函数，真的是非常神奇，比如说如果 C 语言里面有一个这样的函数：

``` c
int print(int val)
{
    printf("value: %d\n", val + 1);
    return val + g;
}
```

可以通过调用 `call print(3)` 进行调用。

## 内存布局

对于用户进程而言，全局变量（数据段）、PC 和函数指针（数据段）和堆变量（堆）都位于低地址区（以 `0x55` 开头），而局部变量（栈）和动态链接库都在高地址区（以 `0x7f` 开头），根据这个方式，可以在调试的时候判断变量的位置。

## 脚本

我用了用，暂时感觉非常难用，我个人觉得脚本的应用是在断点处自动化执行一些命令，而这可以通过 `commands` 关键字来实现。 `commands` 会绑定一个断点，并自动执行定义在其中的指令，比如下面就是一个打在 `21` 行（for 循环体）的一个断点，用于打印 `sum` 的值和迭代次数：

``` gdb-script
break 21
commands
  silent
  printf "%d iter, sum: %d\n", i, sum
  continue
end
```

当然这个功能可以用一种更加简单的方式，即：

``` gdb-script
dprintf 21, "%d iter, sum: %d\n", i, sum
```

也就是当运行到第 `21` 行的时候打印语句。这个方式其实和 printf 大法已经非常接近了。

脚本如下执行：

``` shell
gdb -x <script-file>
```

## Record-Replay

gdb 默认是没有重播功能的，也就是“后退执行”。但是我们可以用 `record` 命令开启，并使用 `reverse-next` 来逆行。然后用 `record stop` 来关闭记录功能。
