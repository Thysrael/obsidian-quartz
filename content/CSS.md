CSS（Cascading Style Sheets）是一种用于描述 [[HTML]] 或 [[XML]]（包括 SVG 和 XML）文档的表现形式的样式表语言。

# 选择器

## 元素选择器

即 html 元素的选择器，比如说

``` css
body {
    font-family: LXGW WenKai Mono;
}
```

## 类选择器

在 html 中含 `class` 的属性元素，如：

``` html
<div class="inline-code"></div>
```

可以用 `.` 来表示选择器，并用逗号可以同时设置多个 `class` ：

``` css
.inline-code, .editor-kit-code-block .code-block-content {
    font-family: JetBrainsMono Nerd Font Mono;
    font-size: 13px;
}
```

## ID 选择器

在 html 中含有 `id` 的属性元素，如：

``` html
<div id="my_id"></div>
```

可以用 `#` 开头的选择器：

``` css
#my_id {
    font-size: 13px;
}
```

# 常见属性

- `font-family`
- `font-size`

# 自定义字体

可以使用 `@font-face` 来实现自定义字体，如加粗的字体和普通字体不同，如下所示：

``` css
@font-face {
    font-family: 'MyCustomFont';
    src: local('Sarasa Mono SC Bold');
    font-weight: bold;
}

@font-face {
    font-family: 'MyCustomFont';
    src: local('LXGW WenKai Mono');
}

body#zh-CN {
    font-family: MyCustomFont;
}
```

在 CSS 中，任何以 `@` 开头的规则都被称为 **at-rule** （特定规则），这类规则通常用于引入额外的功能或指令。
