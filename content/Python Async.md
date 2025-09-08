# Coroutine, Event Loop

Python 的 `async/await` 关键词的本质是协程（Coroutine）。而 Python Coroutine 的实现采用的是事件循环机制（Event Loop）。

Python Coroutine 主要优化的 IO 密集的问题，包括：

- 文件处理
- 网络请求
- 数据库操作

如下所示：

``` python
import time

def io_operation():
    print("Some time-consuming IO operations...")
    time.sleep(2) # 模拟耗时的 IO

def main():
    print("Begin operation")
    io_operation()
    print("End operation")

main()
```

当进入 `io_operation` 时会导致大量的时间开销，这个时候其实是 IO 设备在工作，而 CPU 只是在忙等而已（其实也不是，CPython 也可以调度不同线程），所以我们最好让 CPU 去干其他的计算任务（就是最为基础的异步思想）。

事件循环机制就是这样，当我们执行到 `io_operation` 时，就自动 yield，然后从 event loop 中选择一个其他 event 进行执行，当 `io_operation` 结束的时候，它就重新把 `main` 加入到 event loop 中，这样我们就实现了一个协程机制。

# async/await

根据上面的分析，我们可以将上面的版本改成异步版本：

``` python
import asyncio

# 异步函数需要使用 async 声明
async def io_operation():
    print("Some time-consuming IO operations...")
    await asyncio.sleep(2) # 模拟耗时的 IO

# 只要使用了 await 就需要声明
async def main():
    print("Begin operation")
    # yield main, 将 CPU 让给 io_operation
    # main 会 wait 到 io_operation 执行完成
    await io_operation()
    print("End operation")

# async 不能直接调用，而是要用 run 方法
asyncio.run(main())
```

在上面这段代码中， `await` 关键字很容易给人两个印象：

- `yield` 并启动一个 `async` 函数
- wait 直到 `async` 函数执行完

这两个印象在这个情景下虽然都对，但是 `await` 在其他场景中，其实更侧重第二点。启动 `async` 函数执行不一定需要 `await` 。

# Gather, Tasks

为什么启动 `async` 函数不一定需要 `await` 呢，是因为这样就 event loop 中很难超过一个协程，最后的执行过程还是串行的，相当于只是 yield 了。为了解决这个问题，我们需要同时启动多个 `async` 函数。

`gather` 函数可以有这种效果：

``` python
import asyncio

async def io_operation(id, delay):
    await asyncio.sleep(delay)
    print(f"IO {id} delayed {delay}s")


async def main():
    # gather 接受任意个参数
    await asyncio.gather(io_operation(1, 1), io_operation(2, 2))

asyncio.run(main())
```

这个程序执行了 2 s 左右，也就是说，2 个 task 并发执行。

还有一种办法，就是显式创建 task ，如下所示：

``` python
import asyncio

async def io_operation(id, delay):
    await asyncio.sleep(delay)
    print(f"IO {id} delayed {delay}s")


async def main():
    task1 = asyncio.create_task(io_operation(1, 1)) # task1 开始运行
    task2 = asyncio.create_task(io_operation(2, 2)) # task2 开始运行
    # 此处并没有启动 task1, task2 ，只是等待 task 结束
    await task1
    await task2

# async 不能直接调用，而是要用 run 方法
asyncio.run(main())
```

# async for/ async with

`async for` 这个关键字听上去，似乎和 `gather` 功能是类似的，而实际上依然是顺序遍历。如下所示：

``` python
import asyncio

class AsyncIterable:
    def __init__(self, max_count):
        self.max_count = max_count

    async def __aiter__(self):
        for i in range(self.max_count):
            await asyncio.sleep(1)  # 模拟异步操作
            yield i

async def main():
    async for item in AsyncIterable(5):
        print(f"Received: {item}")

asyncio.run(main())
```

最终 `item` 会按序输出。那么异步的地方其实是在迭代中。换句话说， `async for` 允许我们在迭代的时候去干点别的事情，等迭代好了再回来，但是依然是按顺序的。

`async with` 也是相同的逻辑，如下所示：

``` python
import asyncio

class AsyncDBConnection:
    async def __aenter__(self):
        print("Connecting to database...")
        await asyncio.sleep(1)  # 模拟异步连接数据库
        return self  # 返回数据库连接对象

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print("Disconnecting from database...")
        await asyncio.sleep(1)  # 模拟异步断开数据库连接

    async def query(self, sql):
        await asyncio.sleep(1)  # 模拟异步数据库查询
        return f"Results of query: {sql}"

async def main():
    async with AsyncDBConnection() as db:
        result = await db.query("SELECT * FROM users")
        print(result)

asyncio.run(main())
```

它的异步过程发生在创建和退出 context manager 的过程中。

# GIL

常常有一种说法是，python 是一种单线程语言。但是这句话并不是那么显然的，因为 python 是有 `threading` 模块的。

应该这么说，“python 是一种单线程语言”的来源是 Global Interpreter Lock(GIL) ，它是 CPython 解释器的全局锁，确保同一时刻仅有一个线程执行 Python 字节码。其设计初衷是保护内存管理（如引用计数）的线程安全。

所以更正确的版本是“ **Python 是无法并行执行的** ”。如果希望并行执行，那么用 C 扩展处理关键代码段，要么换用 Jython 或 IronPython（无 GIL）。

所以 python 的多线程只对于 IO 密集型的 workload 具有优化作用（这点和协程类似，一个是 OS 控制，一个是 User 控制的区别），而对于 CPU 密集型的 workload 没有作用了，甚至还有副作用（切换线程也有开销）。

那么在有 GIL 的情况下，是不是就不需要 lock 了呢？显然不是的（这个问题我居然还思考了半天），这是因为 lock 还可以用于构建原子事务，将多个操作打包成一个原子事务，显然是需要 lock 的。
