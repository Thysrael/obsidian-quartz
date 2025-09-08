# Electron

Electron 应用默认不开启 wayland ，所以需要在启动时加入如下参数：

``` shell
--ozone-platform=wayland --enable-wayland-ime
```

除了开启 wayland 外，上述命令还适配了 [[Fcitx]] 输入法。

不知道为什么在 chrome 上删除正在输入的问题会出现问题，但是其他 electron 应用中则没有。后来更新了一下，就没有这个问题了。这个问题似乎被解决了。

# Emacs

在 [[ArchLinux]] 下安装 `emacs-wayland` 就可以使用 native wayland emacs 了，也就是编译时带了 `--with-pgtk` （pure GTK） 的 emacs 。

但是不幸的是， KDE Wayland 并不支持 EAF ，所以还是需要使用 xwayland 运行 emacs ，如果强行运行，则会报错：

``` shell
dbus-call-method: D-Bus error: "org.freedesktop.DBus.Error.ServiceUnknown", "The name is not activatable"
```

但是如果在 xwayland 中运行 emacs ，会发现它无法复制中文字符到 wayland electron 中，所以还需要借助 `xclip` 。

使用 xwayland emacs 会导致粘贴图片非常慢，我觉得不能忍受，所以就又切回了 X11 。后来发现不是 xwayland 的问题，而是因为 flameshot 的问题。

从这个角度看，基本上就是 EAF 和 `yank-media` 不能两全啊。

禁用 Emacs 使用系统输入法，可以通过环境变量设置：

``` shell
XMODIFIERS=nil GTK_IM_MODULE=xim QT_IM_MODULE=xim
```

也可以通过在 emacs 内部设置：

``` commonlisp
;; forbidden system im
(setq pgtk-use-im-context-on-new-connection nil)
```

最终还是 xwayland emacs 舒服。

# Peek

因为安全的原因，导致 GIF 录屏工具 peek 无法使用，但是我找到了 Kooha 作为代替。

但是 Kooha 也存在一定的问题。所以我决定放弃这个需求。必要时用 speculate 代替。

# Performance

我在网上看测评，似乎并没有说 wayland 的性能要比 x11 要好。可能 wayland 的安全性导致了一定的性能开销。不过似乎 emacs 的启动速度确实快了一些。

我觉得 Wayland 相比于 [[X11]] 的优势在于“它没有停止开发，正在逐渐称为主流”，其次才是流畅和安全等因素。

# WPS

wps 需要加入环境变量来保证输入法的正确使用：

``` shell
XMODIFIERS="@im=fcitx" GTK_IM_MODULE="fcitx" QT_IM_MODULE="fcitx" SDL_IM_MODULE=fcitx GLFW_IM_MODULE=ibus
```

# Screenshot

flameshot 在 wayland 下经常出现细微 bug ，而且截屏贴图也会带有 KDE 的标题栏，非常丑。

所以我最终采用 KDE 自带的 speculate 。

# Wemeet

首先安装腾讯会议：

``` shell
yay -S wemeet-bin
```

然后安装共享屏幕补丁：

``` shell
yay -S wemeet-wayland-screenshare-git
```
