# 变量

## 变量赋值

shell 中的变量分为局部变量和环境变量，环境变量在声明的时候需要使用 `export` ，所谓的 `export` 就是指将原先局限与脚本内部的变量 export 到环境中，这样子进程都会继承这个变量。

shell 的变量的赋值的等号两侧不能有多余的空格，这是因为一旦出现空格，那么就会被 shell 识别成一条命令。

``` shell
var='Hello world' # succ
export var='Hello world' # succ
var = 'Hello world' # error: recongize the `var` as a command
```

我不确定 shell 中的变量是否有数据类型，不过看上去类型非常弱，比如两个字符串可以进行算数加法

``` shell
a='5'
b='3'
echo$((a + b)) # 8
```

## 变量使用

- 用 `$var` 或者 `${var}` 来引用变量。
- 用 `$(command)` 来引用命令的输出。
- 用 `$((a + b))` 来进行数学计算。
- `$1`, `$2` 等表示传递给脚本的参数，`$#` 表示参数的数量，`$@`, `$*` 用于引用所有参数。

# 流程控制

## 循环

需要注意的是，似乎下文列到的循环只在 `bash` 中使用，而在 `sh` 中并不支持：

``` shell
for (( i=1; i<=n; i=i+1 ))
do
    s=$(( S{s}+s{i} ))
done

for var in con1 con2 con3
do
    commands
done

for c in {a..z}
do
    echo$c
done
```
