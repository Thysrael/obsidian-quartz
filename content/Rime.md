# 定制

Rime 是一款可定制化程度非常高的开源输入法，它可以作为搜狗输入法的替代品。具体的定制可以参见这篇 [攻略](https://sspai.com/post/84373)。但是正因为太复杂了，所以我也没有看过，不过网上有已经定制好的方案，比如说 [雾凇拼音](https://github.com/iDvel/rime-ice)，我们可以这样使用：

``` shell
# 清除原本的配置
cd ~/.local/share/fcitx5/
rm -rf ./rime
# clone config
git clone https://github.com/iDvel/rime-ice --depth=1 ./rime
```

这里的 `~/.local/share/fcitx5/rime/` 本质上是一个配置文件和词库文件的路径，在 [[MacOS]] 上是 `~/Library/Rime` 。

而我们自定义的方式是以补丁（patch）的形式进行的，比如说我们希望更改 `default.yaml` 文件内的如下选项：

``` yaml
# 菜单
menu:
  page_size: 5  # 候选词个数
```

我们可以创建对应的 patch 文件 `default.custom.yaml` 并写入如下内容：

``` yaml
patch:
    menu:
        page_size: 8
```

其他的配置选项可以查阅 [Github Wiki](https://github.com/rime/home/wiki/CustomizationGuide) 。

# 词库

词库是是非常重要的，但是我也不太懂，我只知道有些词库很大，会影响 Rime 的启动速率，可以适当禁用来提高启动速率。

另外词库系统和 Emacs 是可以共用的。

# 自定义

Rime 本身是自带历史输入记忆功能的，但是我们依然可以为其自定义词库，在 `custom_phrase.txt` 下就可以定义，但是需要注意要使用 `TAB` 而不是 `SPACE` 。
