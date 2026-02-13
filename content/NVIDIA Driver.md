# 原理

如果希望让自己带有 NVIDIA 独显的电脑正确运行 LLM 程序（尤其是自己手搓的算子），那么是需要花费很大精力。

为了理解这一点，我们需要先了解一下 GPU Driver 以及上面的库的结构：

![NVIDIA Driver-20260210181909813](img/NVIDIA%20Driver-20260210181909813.png)

CUDA Driver 是一个内核和用户态双层驱动结构。内核态的驱动，只是为 GPU 硬件提供一层薄薄的 wrapper，为用户态的 driver 提供基本的寄存器读写能力。而所有的控制逻辑，均集中在用户态的驱动里。这也就是，为什么 NVIDIA 即使开源了内核态的 Driver，开源社区对 NV 的评价也不高的原因。

用户态的驱动会带有一个名为 `libcuda.so` 的库，这个库用于向上层提供 API，我们的 CUDA 算子就会运行在这个上面。`libcuda.so` 会提供一个最高的 CUDA Version，这指的是，能够在它上面运行的算子的最高版本。

算子的版本本质上编译它的编译器（也就是 `nvcc`）以及相关库（包括 `libcudart.so`）的版本。这套东西，统称 CUDA Toolkit。也就是我们所说的 CUDA 。

`libcudart.so` 是一个构建在 `libcuda.so` 更加易用的 API 层，[[PyTorch]] 甚至会自带一个这个，来加强兼容性。

# 实践

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
