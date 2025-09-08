# 镜像

镜像由一个很有趣的特点就是它是假的，所有的镜像都是需要“变成真的”才能发挥作用。在某种意义上说，镜像的两个特质都被“镜像”这个翻译表示得很好：

- 镜中的像是现实中物体的反映，和本体“一模一样”，镜像是某种计算机结构的反映，和这种结构“一模一样”。
- 镜中的像是虚假的，是无法发挥和本体一样的作用的，镜像同样是假的，想要利用镜像就必须想办法将其转换成真的。

文件系统就是状态机啊！它记录计算机的运行状态。

# 命令

基本上所有的操作实体都可以用 name 和 ID 两种方式指代。

## Image

罗列镜像

``` shell
docker images
```

删除镜像

``` shell
docker rmi <IMAGE>
```

导出/导入镜像

``` shell
docker save <IMAGE> -o <name>.tar
docker image load -i <name>.tar
```

## Container

列出容器

``` shell
docker ps
```

检查某个容器的具体信息

``` shell
docker inspect <CONTAINER>
```

执行命令/进入容器

``` shell
docker exec -it <CONTAINER> /bin/bash
docker exec -it <CONTAINER> bash -c "COMMAND"
```

状态转换

``` shell
docker stop <CONTAINER>
docker start <CONTAINER>
docker kill <CONTAINER>
docker restart <CONTAINER>
```

在宿主机和拷贝

``` shell
docker cp <CONTAINER> <HOST_PATH> <CONTAINER>:<CONTAINER_PATH>
docker cp <CONTAINER> <CONTAINER>:<CONTAINER_PATH> <HOST_PATH>
```

导入/导出

``` shell
docker export <CONTAINER> -o <name>.tar
docker import <name>.tar - <Container Name>
```

删除容器：

``` shell
docker rm <CONTAINER>
```

# 权限

在服务器上使用 docker 不加 `sudo` 的话很容易如下错误：

``` text
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/images/json": dial unix /var/run/docker.sock: connect: permission denied
```

为了避免每次执行都加 `sudo` 可以进行如下操作

``` shell
# 创建 docker 特权组，如果存在会报错，无需理会
sudo groupadd docker
# 当前用户加入 docker 组
sudo gpasswd -a${USER} docker
# 重启 docker 服务（生产环境慎用）
sudo systemctl restart docker
# 添加访问和执行权限
sudo chmod a+rw /var/run/docker.sock
```

# 核心原理

- 利用 [[Linux Namespace]] 隔离资源
- 利用 [[CGroups]] 限制资源的使用
- 利用 [[Chroot]] 改变进程的根目录到指定的目录
