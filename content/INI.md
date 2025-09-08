INI 语言（我都不知道能不能称其为一种语言，可能更像是一种格式）是一种配置特化语言。

使用 INI 的例子有 [[Git]] 的 config 文件，[[Systemd]] 的单元配置文件。这种配置文件以 `ini, conf, cfg` 等结尾，在 [[Emacs]] 上会对应 `conf-mode` 。

INI 语法比较不正式，方言偏多（在 [[Unix]], [[Windows]] 上有不同用法）。对于是否大小写敏感，是否允许空格都存在差异性。

INI 的基础单元是 key-value 对，采用 `=` 连接：

``` conf
remote = origin
```

INI 并没有其他配置语言所具备的明显层次结构，它的层次结构用 `section` 描述，采用 `[]` 表示，其格式如下：

``` conf
[section_name]
```

不同于同样没有结束符的 [[Yaml]] ，INI 不利用缩进分节，就是简单的“在下一个 section 开始前的 key-value 对都属于前一个 section ”。

如果希望描述层次结构，也就是 `subsection` ，需要用 `.` 来分割，如下所示：

``` conf
[section.subsection]
```

似乎只支持一层嵌套。

使用 `#` 或者 `;` 进行注释，最后放上大杂烩示例：

``` conf
[project]
name = orchard rental service (with app)
target region = "Bay Area"
; TODO advertise vacant positions
legal team = (vacant)

[fruit "Apple"]
trademark issues = foreseeable
taste = known

[fruit.Date]
taste = novel
Trademark Issues = "truly unlikely"

[fruit "Raspberry"]
anticipated problems = "logistics (fragile fruit)"
Trademark Issues=\
 possible

[fruit.raspberry.proponents.fred]
date = 2021-11-23, 08:54 +0900
comment = "I like red fruit."
[fruit "Date/proponents/alfred"]
comment: Why,  \
 \
 \
 I would buy dates.
# folding: Is "\\\\\nn" interpreted as "\\n" or "\n"?
#   Or does "\\\\" prevent folding?
editor = My name may contain a \\
newline.
```
