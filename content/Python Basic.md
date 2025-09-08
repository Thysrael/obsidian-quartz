# Arithmetic

python 中使用 `/` 会得到浮点数，而使用 `//` 才是整数除法。

# Loop

`for-in` 循环：

``` python
fruits = ['apple', 'banana', 'cherry']
for fruit in fruits:
    print(fruit)

# 遍历字典
person = {'name': 'Alice', 'age': 30}
for key, value in person.items():
    print(f"{key}: {value}")

# 使用 range 函数生成数字序列
for i in range(5):
    print(i)
```

`while` 循环：

``` python
sum = 0
i = 1
while i <= 5:
    sum += i
    i += 1
print(f"Sum of 1 to 5 is: {sum}")
```

列表推导式（List comprehension）：

``` python
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # 输出: [0, 2, 4, 6, 8]
```
