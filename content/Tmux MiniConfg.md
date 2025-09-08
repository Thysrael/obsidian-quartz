配置需要存储在 `~/.tmux.conf` 中。

``` conf
set -g mouse on
set -sg escape-time 0
set -g default-terminal "screen-256color"
set -g history-limit 6400
bind-key   @ choose-window 'join-pane -h -s "%%"'
bind-key C-@ choose-window 'join-pane    -s "%%"'
```
