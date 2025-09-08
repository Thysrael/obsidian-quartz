`fc-list` 是字体展示工具，它会展示系统里可用的所有字体。

`fc-list` 展示的每个字体都分为 `file`, `family`, `style` 3 个部分，如下所示：

``` shell
/usr/local/share/fonts/s/Sarasa_Light.ttc: Sarasa Mono SC,等距更纱黑体 SC,Sarasa Mono SC Light,等距更纱黑体 SC Light
```

其中 `family` 存在多个，我个人感觉可能是因为一个字体有多个名字比较好表示，我也没有探究清楚到底这些名字是什么。

我大概能知道的是 `fc-list` 显示的是字体的 full font name ，这种名字是字体的完整名称，通常用于字体选择界面中以便用户识别。它通常更具描述性，并且可能包括样式和变体的信息。与之相对的是 PostScript Name 是一个用于在 PostScript 和 PDF 文件中引用字体的名称。它是用于打印和处理的更“技术性”的名称，通常遵循特定的命名规范。

full font name 一般采用空格分割，而 PostScript Name 则使用 `_` 或者 `-` 连字符分割：

``` shell
DejaVu Sans Bold
DejaVuSans-Bold
```

我们可以用以下形式指定每个字体需要显示的部分，移除一些字段就会导致不再打印：

``` shell
fc-list : file family style
```

也可以使用如下命令来过滤显示支持某种语言的字体：

``` shell
fc-list :lang=zh
```

还有一些更加复杂的用法，但是缺少文档：

``` shell
fc-list --format="%{family[1]}\n"
```
