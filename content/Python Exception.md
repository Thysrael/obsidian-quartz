# try, except, finally

这个部分就是常见的内容，在 `try` 块里进行有可能 `raise` Exception 的代码，在 `except` 块里接住这些块抛出的异常，如果没有发生异常，那么就执行 `else` 块，无论执行哪个代码块，最后都要执行 `finally` 代码块。

示例如下：

``` python
file = open('./test.txt', 'w')
try:
    file.write('Hello world')
except OSError as e:
    print(f"An OS error occurred: {e}")
except ValueError as e:
    print(f"A value error occurred: {e}")
    raise e # 继续抛出异常
except:
    print("Other error")
else: # 在无异常的时候执行
    file.wite('Good bye')
finally: # 无论有无异常都执行
    file.close()
```

# with

当然这样编写代码就非常麻烦，每打开一个文件，我们都要记挂着它是否 `close` 了，所以衍生出了 `with` 关键字，它相当于一个自动执行 `finally` 的语法糖，省掉了自己写声明，其形式如下：

``` python
with open('./test.txt', 'w') as file:
    file.write('Hello, world')
```

这样就不用担心 `close` 问题了，它自动就 `close` 了。
