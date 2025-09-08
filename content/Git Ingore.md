# 路径

Git ignore 的路径要写成绝对路径的形式，比如说想要忽略根目录下的 PDF 文件，应该写作：

``` shell
/*.pdf
```

而如果写作：

``` shell
*.pdf
```

那么会导致整个项目里所有的 PDF 文件都被忽略。

# 反选

可以使用 `!` 来确定不要忽略的文件。

如果我们希望忽略除了 `dir/example.text` 外的所有 `dir/` 下的文件，我们不能写成：

```Shell
dir/
!dir/example.txt
```

这样的意思是忽略 `dir/` 目录，所以 `git` 根本不会往 `dir/` 下去看。所以应该写成这样：

```Shell
dir/*
!dir/example.txt
```