# 代码高亮

`Minted` 包简单高效，不要用 `listings` 这个包，非常复杂。

引用包：

``` latex
\usepackage{minted}
```

行间代码：

``` latex
\begin{minted}{c}
int main() {
printf("hello, world");
return 0;
}
\end{minted}
```

行内代码：

``` latex
\mintinline{python}{print(x**2)}
```

引用代码文件：

``` latex
\inputminted{python}{t1.py}
```

# LaTex Diff

首先将各个 `latex` 文件整理到同一个文件中：

```shell
latexpand main.tex > new.tex
```

然后进行 `diff`：

```shell
latexdiff ./origin.tex ./new.tex > diff.tex
```