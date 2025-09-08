Pretty Good Privacy（PGP）是一种加密程序，旨在提供高强度的安全性，尤其是在电子邮件通信中。它用于构建 [[Web of Trust]] 。GPG（GNU Privacy Guard）是一个自由和开源的实现 PGP（Pretty Good Privacy）标准的工具。

# 密钥生成与邮箱地址

我们可以使用如下命令生成密钥

``` shell
gpg --full-generate-key
```

这条命令会交互式的让你输入密钥类型、大小、有效期、用户名、电子邮箱、密码（passphrase）等。

密钥本身是很难记忆的，所以我们一般都用电子邮箱来指代某个密钥。

我们可以使用如下命令来罗列所有的公钥（公钥成了 key ，并不奇怪）：

``` shell
gpg --list-keys
```

# Import, Fingerprint, Export

将他人的公钥导入到你的密钥环中：

``` shell
gpg --import publickey.asc
```

当然，如果处于安全性考量，如果担心公钥在传递过程中被篡改，还可以导出公钥的指纹（Fingerprint），其本质公钥的一个哈希。生成指纹后可以通过安全渠道和公钥的分发者进行比对：

``` shell
gpg --show-keys --fingerprint publickey.asc
```

导出公钥以便分享给其他人：

``` shell
gpg --export --armor your_email@example.com > publickey.asc
```

其中 `--armor` 指的是 ASCII ARMOR 的意思，就是 ASCII 格式， `.asc` 格式也是 ASCII 的意思。

# Encrypt vs Decrypt

使用他人的公钥加密文件：

``` shell
gpg --encrypt --recipient their_email@example.com file.txt
```

这会生成一个加密文件 `file.txt.gpg` 。

使用自己的私钥解密文件：

``` shell
gpg --decrypt file.txt.gpg > decrypted.txt
```

# Sign vs Verify

当我们对某个文件签名时，文件的完整性和来源都会得到保证。如果我们“签署一个密钥”（sign a key）是指用你的私钥对另一个人的公钥进行签名。这通常用于表示你信任该公钥属于它声称的所有者。

``` shell
gpg --sign file.txt
```

我们还可以将签名附在文件上：

``` shell
gpg --clearsign file.txt
```

验证独立的签名文件：

``` shell
gpg --verify file.sig file.txt
```

验证附加签名的文件：

``` shell
gpg --verify file.txt.asc
```

# KeyServer

密钥服务器（Key Server）是一个用于存储和分发公钥的服务器。用户可以将他们的公钥上传到密钥服务器，以便其他人能够查找和下载这些公钥，从而进行加密通信或验证数字签名。不过这种方式很容易导致“密钥的通货膨胀式签署”。

常用的密钥服务器有 `keyserver.ubuntu.com` 、 `pgp.mit.edu` 等。

可以使用如下命令来在 keyserver 上查询公钥：

``` shell
gpg --keyserver keyserver.ubuntu.com --search-keys [email@example.com]
```

使用如下命令导入公钥：

``` shell
gpg --keyserver keyserver.ubuntu.com --recv-keys [key-id]
```
