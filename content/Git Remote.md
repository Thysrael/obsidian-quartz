# Origin 的变化

Remote 在本地常常表示为 `origin` 标签（当然可能还有别的名字），我们通过比较 `origin/main` 和 `main` 差别，就可以判断本地工作和远端工作的进度对比。我很感兴趣 `origin` 是什么时候更新的。

其实 `origin` 只在 `git fetch` 和 `git push` 的时候移动，而在 `merge` 和 `rebase` 的时候并不移动。

# Upstream 和 PushStream

简单说，就是 upstream 是拉取代码的分支，而 pushstream 是推送代码的分支。

之所以要区分这两个分支，是因为我们在提 pr 的时候，upstream 是原作者的库，而 pushstream 是我们 fork 的库。

# 将本地已有仓库 Push 到远端

使用如下命令设置一个远端仓库地址：

``` shell
git remote add origin git@github.com:user/repo.git
```

如果远端仓库为空，那么只需要将本地分支与远端分支关联起来即可：

``` shell
git push -u origin main
```

其中的 `-u` 参数就是 `--set-upstream` 的意思。

如果远端仓库不为空，那么就需要先 fetch-merge 一下：

``` shell
git pull origin main --allow-unrelated-histories
git push origin main
```
