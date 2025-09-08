在 [[Ubuntu]] 上，使用如下命令进行相关环境的配置：

首先，需要先安装 NVIDIA 的驱动，使用如下命令，参考 [这里](https://documentation.ubuntu.com/server/how-to/graphics/install-nvidia-drivers/) ：

``` shell
# list the availabe drivers
sudo ubuntu-drivers list
# choose the default drivers to install
sudo ubuntu-drivers install --gpgpu
# install 
sudo apt install nvidia-utils-550-server
# need reboot 
reboot
```

此时使用如下命令即可查看是否成功：

``` shell
nvidia-smi
```

需要注意的是，此时打印的 `CUDA VERSION` 并不意味着真的安装了 CUDA ，而只是说明了当前 driver 支持的 CUDA 的最高版本。

也可以使用如下命令来查看已经安装的 driver 的信息：

``` shell
cat /proc/driver/nvidia/version
```

然后安装 cuda ，使用如下命令来直接安装最新的 CUDA ：

``` shell
sudo apt install nvidia-cuda-toolkit
```

在安装结束后，使用如下命令来查看 CUDA 的版本：

``` shell
nvcc --version
```
