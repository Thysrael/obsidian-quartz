GitHub Pages 是一项静态站点托管服务，它直接从 GitHub 上的仓库获取 HTML、CSS 和 JavaScript 文件。

Github Page 的文档在[这里](https://docs.github.com/zh/pages) 。

# URL

若要发布用户站点，必须创建名为 `<username>.github.io` 的个人帐户拥有的仓库。若要发布组织站点，必须创建名为 `<organization>.github.io` 的组织帐户拥有的仓库。 项目站点的源文件与其项目存储在同一个仓库中。项目站点在 `http(s)://<username>.github.io/<repository>` 。

# Github Action

并非仓库内一定是 HTML 文件，而是可以通过 [[Github Action]] 来处理源文件（比如说 `markdown` 或者 `org-mode` 来）并部署。
