pyright 是 [[Python]] 的 LSP Server ，它的配置文件 `pyrightconfig.json` 在项目根目录下，其内容大致如下：

``` javascript
{
  "executionEnvironments": [
    {
      "extraPaths": [
        "python"
      ]
    }
  ],
  "verboseOutput": true,
  "venv": "venv",
  "venvPath": "."
}
```

其中 `executionEnvironments` 记录着源码的路径，而 `venv` 记录着虚拟环境的路径。
