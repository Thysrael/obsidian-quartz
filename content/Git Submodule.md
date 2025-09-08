# 增加一个 submodule

命令与 `git clone` 是类似的，如下所示：

``` shell
git submodule add <remote.git> <local path>
```

即使是已有 local 仓库，也必须使用 `url` 完成，如下所示：

``` shell
git submodule add <remote.git> <local path>
```

# 递归 clone

对于有 `submodule` 的仓库，在 `clone` 时应当使用如下命令

``` shell
git clone --recursive <remote.git>
```

如果忘记使用 `--recursive` ，那么可以使用如下命令补救：

``` shell
git submodule update --init
```

# 删除 submodule

除了需要在工作目录下删除，同时对于 git 本身也需要进行一些内容的删除：

``` shell
rm -rf <local path> # delete from work directory
rm -rf .git/modules/<local path> # delete in .git/
git config -f .gitmodules --remove-section submodule.<local path> # delete in .gitmodules
```
