Python 的装饰器（Decorator）就是出现在函数声明上方以 `@` 开头的语句，如下所示：

``` python
@log
def now():
    print('2024-08-07')
```

这种语句可以拓展函数的功能，就像“装饰”了原本的函数一样，所以被称为装饰器。

而实际上它是一个语法糖，当我们调用 `now()` 的时候，实际上是调用了：

``` python
# now()
log(now)()
```

所以总的来说，实际调用的，其实是以 `now` 为参数（函数式编程）构造出的一个新函数，而非 `now` 了，更具体一些， `log` 可以实现成这个样子：

``` python
def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```

这是一种[[Python Closure]]的手法， `wrapper` 捕获了外部变量 `func` ，实际调用的是 `wrapper` ，而 `wrapper` 的效果是先打印一句 `call funcname` ，然后再调用 `now` 。此时调用 `now()` 的效果如下：

``` text
call now():
2024-08-07
```

更进一步，装饰器是可以有参数的，比如这种：

``` python
@log('execute')
def now():
    print('2024-6-1')
```

这种语法糖的本质是：

``` python
# now()
log('execute')(now)()
```

因此，此时 `log` 会在外面多一层，用于接收装饰器参数：

``` python
def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```

闭包分别捕获了 `text` 和 `func` 。
