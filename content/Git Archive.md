可以使用 `git archive` 命令来打包获得不带版本信息（即没有 `.git` ）的包。使用如下命令：

``` shell
git archive --format=tar.gz -o archive.tar.gz <commit-id> 
```

如果希望只打包部分文件，可以在 `<commit-id>` 后跟随相关的路径，比如说：

``` shell
git archive --format=tar.gz -o archive.tar.gz HEAD README.org Makefile module/ user/
```

需要强调的是，这种打包功能不能正确处理 [[Git Submodule]] 。

我觉得它的侧重点不在于对于 `HEAD` 的打包，毕竟写一个忽略 `.git` 的 [[tar.gz, zip, 7z, rar]] 之类的命令并不难，其关键在于对于不同 `commit-id` 的打包。奥，它还有一个功能是按照 `.gitignore` 忽略文件。

可能是由于这个功能太废了，都没有在 [[Magit]] 中引入。
