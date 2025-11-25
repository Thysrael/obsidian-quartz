# History

Hugging Face 是于 2016 年的创建在纽约的一个公司，以 🤗 emoji 命名。

HF 最初是以开发 chatbot 为目标的，但是后来转向称为机器学习平台。

# Transformers

`transformers` 库是由 Hugging Face 开发和维护的一个开源库，专注于自然语言处理（NLP）任务。它提供了对多种预训练模型的访问和使用，这些模型是当前 NLP 领域的前沿技术。它最开始是一个对于 [[Transformer]] 架构的开源实现。

但是随着各种先进 Attention 后端的兴起，`transformers` 库就退化成了一个模型下载

# Download Model
Model Hub 是 Hugging Face 提供的一个在线平台，用于存储、分享和发现预训练机器学习模型，特别是自然语言处理（NLP）模型。

下模型这种庞大的任务，经常因为翻墙而导致崩溃，所以我们可以使用镜像站完成下载：

```shell
# 安装 huggingface-cli，用于下载模型
pip install -U huggingface_hub

# 换成镜像站
export HF_ENDPOINT=https://hf-mirror.com

# 使用 hugginface-cli 下载模型
huggingface-cli download --resume-download Qwen/Qwen2.5-7B-Instruct-1M --local-dir Qwen2.5-7B-Instruct-1M
```

当遇到 Gated Model 的时候，需要 HuggingFace Token，可以在命令行参数中指定 `--token hf_***` 。

在申请

此外，也可以使用 HuggingFace 提供的 `snapshot_download` 方法下载，脚本如下：

```python
from huggingface_hub import snapshot_download

snapshot_download(
    repo_id="meta-llama/Meta-Llama-3.1-8B-Instruct",
    local_dir="./Meta-Llama-3.1-8B-Instruct",
    token="hf_**",
    resume_download=True，
    local_dir_use_symlinks=False,
    endpoint='https://hf-mirror.com'
    )
```

其本质是完全一样的，都是来自 `huggingface_hub` 模块。