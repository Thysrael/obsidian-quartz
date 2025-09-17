# 添加用户

可以使用如下命令添加用户：

```
sudo adduser <username>
```

它本质是一个 `useradd` 命令的封装。

# 设置公钥

简单说，如下脚本可以自动化完成：

``` Shell
USER_NAME="newuser" 
PUBLIC_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..."

# add key 
sudo bash -c " \ 
	mkdir -p /home/${USER_NAME}/.ssh && \ 
	echo '${PUBLIC_KEY}' >> /home/${USER_NAME}/.ssh/authorized_keys && \ 
	chmod 700 /home/${USER_NAME}/.ssh && \ 
	chmod 600 /home/${USER_NAME}/.ssh/authorized_keys && \ 
	chown -R ${USER_NAME}:${USER_NAME} /home/${USER_NAME}/.ssh \
```
