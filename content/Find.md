# 格式

`find` 用于在查找文件，其格式大概如下：

``` shell
find [path] [expression]
```

也就是需要指明在哪个目录 `path` 下查找，和查找的要求 `expression` 是什么。

# 按文件名查找

其格式如下：

``` shell
find [path] -iname "name"
```

其中 `-i` 表示忽略大小写， `-name` 表示按照文件名进行查找。

需要强调的是， `name` 必须精准匹配文件名，才算符合要求，也就是说，如果当前文件夹下有 `hello.txt` 这个文件，而我们的命令是：

``` shell
find . -iname "hello"
```

这样是无法获得结果的。

如果希望进行模糊搜索， `find` 是支持通配符的，包括：

- `*`: 匹配零个或者多个任意字符。
- `?`: 匹配一个任意字符。
- `[]`: 支持范围内的字符。

所以上面那个需求，可以用以下命令来完成：

``` shell
find . -iname "*hello*"
find . -iname "*.txt"
```

如果希望使用正则表达式，需要增加 `-regex` 参数。
