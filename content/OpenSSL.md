# Benchmark

测试 openssl 的时候，可以不用自己手写程序，而是直接使用测试命令：

``` shell
openssl speed -evp aes-128-cbc aes-256-cbc des-ede3 rsa2048 sha256
```

- `openssl speed`: 启动 OpenSSL 的性能测试工具。
- `-evp`: 使用 EVP 接口进行测试，这通常会启用硬件加速（如果可用）。
- `aes-128-cbc, aes-256-cbc, des-ede3`: 测试这几种对称加密算法的性能。
- `rsa2048`: 测试 2048 位 RSA 非对称加密算法的性能。
- `sha256`: 测试 SHA-256 哈希算法的性能。

其实最简单的测试命令是：

``` shell
openssl speed
```
