# 加载语言时间

Org Babel 加载 `gnuplot` 时会消耗大量的时间，而且平时是不会用到这个功能的，所以可以在 `.dir-locals.el` 中进行加载，代码如下：

``` commonlisp
((org-mode .
           ((eval . (org-babel-do-load-languages
                     'org-babel-load-languages
                     '(
                       (gnuplot . t)
                       ))))))
```

# C 语言

可以使用如下写法，来保证写的时候不需要麻烦的 `main` 函数：

``` c
printf("Hello, world\n");
```
