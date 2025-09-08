# 不构成作用域

在 C 语言中， `for` 或者 `if` 是构成作用域的，在里面声明的变量是无法在外面使用的：

``` c
for (int i = 0; i < 3; i++) {
    int a = i;
}
printf("i: %d, a: %d\n", i, a); // error

if (1) {
    int a = 3;
}

printf("a: %d\n", a); // error
```

但是在 python 中并没有这种规则，在 `if/elif/else`, `for/while`, `try/except/finally/with` 块都不构成作用域，所以你可以看到如下代码：

``` python
if True:
    a = 3

print(a) # 3
```

在 python 中，只有函数、类、模块（也就是文件）会形成新的作用域。

# 四种作用域

python 中有四种作用域：

- Local：当前函数的局部作用域。
- Enclosing：包含当前函数的外部函数的作用域（如果有嵌套函数）。
- Global：当前模块的全局作用域。
- Built-in：Python 内置的作用域。

查找时按从内往外的顺序查找：

![](img/clipboard-20250321T150836.png)

示例如下：

``` python
g_count = 0  # Global
def outer():
    o_count = 1  # Enclosing
    def inner():
        i_count = 2  # Local
```

# global/nonlocal

如果按照上面的规则，再配合“python 赋值时才声明”的语法特性，会发现一个有意思的“语义无能”现象：

``` python
global_value = 1

def write_global_value():
    global_value = 2

def read_global_value():
    print(global_value)

write_global_value()
read_global_value() # 为什么不是 2 而是 1
```

这个如果写成 C ，那么显然应该打印 `2` ，我们写了一个函数来更新全局变量，更新完了自然应该是 `2` 。就算是 python ，我并没有在 `write_global_value` 中声明 `global_value` 这个变量，它应该自动引用外部变量呀，在 `read_global_vaule` 中就很好得读出了全局变量的值呀？

这是因为当我们在函数中使用赋值语句 `global_value = 2` 时，其本质不是引用了全局变量，而是创造了一个新的局部变量，只是名字恰好和全局变量“撞车”了。

然后我们发现，当我们想用一个函数去写全局变量，就需要引入新的关键字了，他们就是 `global/nonlocal` ，分别用于引用全局变量，和引用 enclosing 变量。示例如下：

``` python
global_value = 1

def write_global_value():
    global global_value
    global_value = 2

def read_global_value():
    print(global_value)

write_global_value()
read_global_value() # 2
```

`nonlocal`:

``` python
def outer():
    num = 10
    def inner():
        nonlocal num
        num = 100
        print(num)
    inner()
    print(num)
outer()
```
