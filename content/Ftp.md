Ftp 的使用和 [[Ssh]] 的感觉有点类似，都是需要先登录

``` shell
ftp <IP>
```

然后有可能需要输入用户名和密码，输入完后也会进入到一个类似 shell 的操作界面，里面有一些类似 shell 的 CLI 命令，如下所示：

``` shell
# Download multiple files (glob expression):
mget *.png

# Upload multiple files (glob expression):
mput *.zip

# Delete multiple files on the remote server:
mdelete *.txt

# Rename a file on the remote server:
rename original_filename new_filename

# Exit
bye

# help
?
```
