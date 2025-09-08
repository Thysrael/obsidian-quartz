# 配置语言

**Yaml** 是一种用于写配置文件的语言。我个人觉得写配置文件并不需要语言具有过强的计算能力，而是需要语言可以更加清晰的描述配置的数据结构。

Yaml 的基本语法规则如下：

- **大小写敏感**
- 使用 **缩进** 来描述层次结构，缩进不能使用 tab 只能用 space ，缩进的多少不重要，重点是可以对齐
- 用 `#` 表 **注释**
- 支持 **字典，数组，纯量** 3 种数据结构

Yaml 语法简单（最难的居然是用空格左对齐），介绍 Yaml 较好的教程是[阮一峰博客](https://www.ruanyifeng.com/blog/2016/07/yaml.html) ，此外对于拿不准的语法，可以在这个[网站](https://nodeca.github.io/js-yaml/)转换成 [[JSON]] 格式查看。

# 语法

## 字典

字典就是一组 Key-Value 对，用 `:` 声明一个 Key-Value 对，如下所示：

``` yaml
name: Steve
age: 18
```

如果用 JSON 来表达就是：

``` javascript
{ "name": 'Steve', "age": 18 }
```

字典还有一种行内表达方式，如下所示：

``` yaml
{ name: Steve, age: 18 } 
```

## 数组

一组连词线开头的行，构成一个数组。

``` yaml
- Cat
- Dog
- Goldfish
```

对应的 JSON 是：

``` javascript
[ 'Cat', 'Dog', 'Goldfish' ]
```

Yaml 同样提供了数组的行内表示法：

``` yaml
[Cat, Dog, Goldfish]
```

数据结构的子成员是一个数组，则可以在该项下面缩进一个空格：

``` yaml
-
 - Cat
 - Dog
 - Goldfish
```

对应的 JSON 是：

``` javascript
[ [ 'Cat', 'Dog', 'Goldfish' ] ]
```

## 纯量

### 其他

Yaml 提供了多种数据类型，不过其实可以分为字符串类和非字符串类，字符串类的语法要更加复杂，而其他数据类型的语法非常简单直白。

- 布尔值： `true, false, True, False, TRUE, FALSE`
- null: `~` ，如果空着也默认是 null
- 整数： `12, 0b1010, 0x77, 0xff`
- 浮点数： `3.14, 6.8523015e+5`
- 日期： `2018-02-17`
- 时间： `2018-02-17T15:02:31+08:00`

其中布尔值可以具有多种写法，整数可以使用多种数制，浮点数可以使用科学计数法，日期和时间遵循的都是 ISO-8601 格式，对于日期，需要用 `yyyy-MM-dd` 格式，对于时间，时间和日期之间使用 `T` 连接，最后使用 `+` 代表时区。

### 字符串

1.  冲突

    Yaml 中的字符串默认是不用引号的，如下所示：

    ``` yaml
    str: 这是一行字符串
    ```

    对应的 JSON 就是

    ``` javascript
    { "str": '这是一行字符串' }
    ```

    这就引发了一个问题，就是其他类型也不用引号，所以我们没法简单的表达一个 `'true'` 类型，如果我们这么写

    ``` yaml
    str: true
    ```

    是不起作用的。所以要么可以使用强制类型转换：

    ``` yaml
    str: !!str true
    ```

    需要用引号显式声明：

    ``` yaml
    str: 'true'
    ```

    用引号还可以避免如 `:, -` 这样的关键词干扰。

    双引号和单引号都可以，单引号不会对特殊字符转义。单引号之中如果还有单引号，必须连续使用两个单引号转义。

2.  多行字符串

    字符串可以写成多行，从第二行开始，必须有一个单空格缩进。换行符会被转为空格。

    ``` yaml
    str: 这是一段
      多行
      字符串
    ```

    对应的 JSON 为：

    ``` javascript
    { "str": '这是一段 多行 字符串' }
    ```

    多行字符串可以使用 `|` 保留换行符，也可以使用 `>` 折叠换行：

    ``` yaml
    this: |
      Foo
      Bar
    that: >
      Foo
      Bar
    ```

    对应的 JSON 为：

    ``` javascript
    { "this": 'Foo\nBar\n', "that": 'Foo Bar\n' }
    ```

    `+` 表示保留文字块末尾的换行， `-` 表示删除字符串末尾的换行。

    ``` yaml
    s1: |
      Foo

    s2: |+
      Foo

    s3: |-
      Foo
    ```

    对应的 JSON 为：

    ``` javascript
    { "s1": 'Foo\n', "s2": 'Foo\n\n\n', "s3": 'Foo' }
    ```

## 引用

我其实没有太看懂，其中 `&` 用于声明一个引用， `*` 用来使用这个引用。关键是 `&` 似乎只能在两个特殊的位置出现，一个是 `key:` 的 `:` 之后，用 `*` 会获得 `key` 所表示的节点，如下所示：

``` yaml
this: &label 
  - son0
  - son1 
that: *label
```

对应的 JSON 是：

``` javascript
{ "this": [ 'son0', 'son1' ], "that": [ 'son0', 'son1' ] }
```

另一种是表示数组的 `-` 之后，纯量之前（不是纯量就不行），如下所示：

``` yaml
- &label scalar
- *label
```

对应的 JSON 是：

``` javascript
[ 'scalar', 'scalar' ]
```

`<<` 表示将引用的内容合并到当前字典，局限性似乎非常大：

``` yaml
defaults: &defaults
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  <<: *defaults
```

等价于

``` yaml
defaults:
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  adapter:  postgres
  host:     localhost
```

# 缩进层次结构

我个人感觉比较难以理解的是无论是字典还是数组，都没有像其他语言里那种明确的 `[], {}` 分界符，以致于不熟悉时，很难分清某段代码，是“有 3 个元素的数组”，还是“只有 1 个元素的数组，这个元素是一个有 3 个元素的数组”？

其实关键在于“缩进”，有如下规则：

- 利用缩进可以形成一颗树
- 兄弟节点必须是相同类型，要么用 `:` ，要么用 `-` 。
