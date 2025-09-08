Process Group 进程组是多个进程的一个管理单位。处于同一个进程组的进程可以收到同一个 [[Signal]]。

用管道 `|` 衔接的命令，就是在一个进程组中，如下面命令的 `proc1, proc2, proc3, proc4` 就属于一个进程组：

``` shell
proc1 | proc2 | proc3 | proc4
```

在会话上下文语义下的进程组也被称为作业（job）。有前台作业（fg）和后台作业（bg）之分。
