# Design

我也没有体验过其他的数据图绘制软件，反正我觉得 GNUPlot 是有点风格在身上的。

它在命令中使用了大量的缩写，比如说将 `help` 缩写成 `h` ，将 `title` 缩写成 `t` ，将 `using` 缩写成 `u` 将 `with` 缩写成 `w` ，将 `plot` 缩写成 `p` ，将相同的重复数据用 `""` 表示等。这种非常频繁出现的缩写甚至到了模糊语义的地步，我觉得这是为了方便交互式输入。

GNUPlot 是不经常使用 `,` 的，而是大量使用空格来隔离参数。

# Set/Unset/Show/Reset

总的来说，GNUPlot 的工作流程是用 `set` 设置一堆的环境变量（在 GNUPlot 中的），然后在利用 `plot` 绘图， `plot` 命令会根据自身的参数和之前 `set` 设置的环境变量来指导绘图的行为。

我们可以用 `show` 命令来打印环境变量的值。用 `unset` 表示取消某个环境变量，对应的就是图上不会出现某个元素。

我们使用 `reset` 命令来让环境变量恢复默认设置。

# Help

如果有不懂的，可以使用 `help` 命令（也可以用 `?` ）在交互终端中查询各种东西，但是并不是每次都会成功。其格式为：

``` gnuplot
help {<topic>}
h  {<topic>}
?  {<topic>}
```

在解释完 `topic` 后，有可能会继续出现 `subtopic` 的 list 让用户选择继续查看。在查看完后会重新回到 `subtopic` 的选择界面，但是已经没有 subtopic 的 list 了，我们可以键入 `?` 来查看 list 。

# Overview

- `key`: 右上角的图例，在 `plot` 中也可以用 `title` 指定。
- `data`: 绘图所需要的数据， `data style` 是绘图默认的样式。
- `style`: 绘图的样式，在 `plot` 中使用 `with` 指定，也可以用 `set style` 设置。
- `label`: 坐标轴的名字。
- `tics`: 坐标轴的刻度。
- `range`: 坐标轴的范围
- `using`: 挑选的数据的一部分

# Topics

## Terminal

`terminal` 用于文件的输出格式，在论文中我们使用 `postscript` 格式。不同格式的选项设置也不同，这些选项往往设置了一些全局的属性，对于 `postscript` 有：

``` gnuplot
set terminal postscript {landscape | portrait | eps}
                        {enhanced | noenhanced}
                        {defaultplex | simplex | duplex}
                        {fontfile {add | delete} "<filename>"
                         | nofontfiles} {{no}adobeglyphnames}
                        {level1 | leveldefault | level3}
                        {color | colour | monochrome}
                        {background <rgbcolor> | nobackground}
                        {dashlength | dl <DL>}
                        {linewidth | lw <LW>} {pointscale | ps <PS>}
                        {rounded | butt}
                        {clip | noclip}
                        {palfuncparam <samples>{,<maxdeviation>}}
                        {size <XX>{unit},<YY>{unit}}
                        {blacktext | colortext | colourtext}
                        {{font} "fontname{,fontsize}" {<fontsize>}}
                        {fontscale <scale>}
```

其中比较重要的有：

- `eps`: 是一种 postscript 的子格式，适合嵌入 latex
- `enhanced`: 会开启 subscript 等功能
- `color`: 输出彩色文件
- `dashlength`: 唯一一个可以虚线宽度的地方
- `font`: 设置全局字体，注意需要使用 postscript name ，在 [[FC-List]] 中可以找到命名格式

## Key

如果希望图例出现在非右上角（默认）的位置，应该用的是小写的方位，比如说希望 key 在右下角，有：

``` gnuplot
set key right bottom offset 0, 2
```

多出来的 `offset` 可以用于微调图例的位置。

而如果希望 key 的色块和解释位置调换，那么应该选择 `reverse` ，如果希望修改解释的对齐方式，那应该用大写的方位，如下所示：

``` gnuplot
set key reverse Left
```

## Plot

plot 的比较全的格式如下：

``` gnuplot
plot [<xrange>][<yrange>] \            # 数据范围
     <data source> \                   # 数据来源，文件或者变量
     using <y, x:y> \                  # 数据列
     axes <x1y1, x1y2, x2y1, x2y2> \   # 使用的坐标轴
     title "title-name" \              # key 的名称
     with <style>                      # 样式
```

我们并不需要对于每个数据都进行一遍相同的设计，有很多设计我们都是通过指定环境变量的方式来全局设定，然后用 `plot` 的选项来局部特定。比如说 `range` 我们依赖于全局设定。

`using` 指定数据列的时候，可以直接指定 tics label ，其写法是：

``` gnuplot
using 2:xtic(1)
```

## Axes

### Tics

用如下命令设置刻度和分刻度：

``` gnuplot
set ytics 1
set mytics 2
```

如果希望刻度更加自定义，可以给刻度一个名字（似乎学名叫做 label）：

``` gnuplot
set xtics ("1" 0, "2" 1, "4" 2, "6" 3, "8" 4, "10" 5)
```

面对过于长的 label ，我们还可以旋转它来节约空间：

``` shell
set xtics rotate by -25
```

### 双轴

基本上就是只要 `set` 就会显示，非常简单。

``` gnuplot
set y2label "Throughput(Kbytes/sec)"
set y2range [1:119]
set ytics nomirror # 取消 y 在 y2 上的刻度
```

## Style

Style 有很多中 substyle ，每个 substyle 又有不同的选项。如果在 `plot` 中，那么格式是：

``` gnuplot
with histograms fillstyle pattern 7 linecolor rgb "#2878b5"
```

也就是说，要先指定 substyle ，然后指定对应的选项。

### Linespoints

如果希望全局设定，那么会先选择一种样式，比如说 `points`, `linespoints`, `histograms` ，设置方式如下：

``` gnuplot
set style data linespoints
```

对于线类，可以先设置出具体的样式 `linestyle` ，然后再在后面的 `plot` 中引用：

``` gnuplot
set style line 1 linecolor rgb "#9ac9db" pointtype 4 pointsize 1.5 linewidth 3 dashtype "-"
plot thr using 1:2 title "lat-base" axes x1y1 linestyle 1
```

### Histogram

柱型图主要考虑填充 `fill` 和边框 `border` 的风格，其设置如下：

``` gnuplot
set boxwidth 0.9 relative # 柱型图宽度
set style histogram clustered gap 1 # 柱型图间距
set style fill solid border 0 # 柱型图填充和 border 

# pattern 是柱型图 fill 的花纹
plot data using 3:xtic(1) with histograms fillstyle pattern 7 linecolor rgb "#2878b5"
```

不过我不喜欢 gnuplot 的花纹，它的花纹的背景只能是白色的，而不能是其他颜色，具体讨论见 [这里](https://stackoverflow.com/questions/25065288/gnuplot-how-to-fill-a-bar-with-both-a-color-background-and-a-pattern) 。
