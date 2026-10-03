# 发布说明

## GitHub 仓库首页

建议仓库名：`ios-legacy-app-download`

建议 About 描述：

```text
基于 ipatool 的 iOS 历史版本下载 Skill 与中文指南：查询应用、核对版本 ID、下载可获取的 IPA。
```

建议 Topics：`ios`、`ipatool`、`ipa`、`app-store`、`agent-skill`、`legacy-apps`、`chinese-documentation`。

将整个项目目录的内容上传到仓库根目录，保留 `README.md`、`docs/` 和 `skills/` 之间的相对路径。请勿只上传 README，也不要上传原始账号会话或下载的 IPA。

当前未指定项目许可证。如果希望允许其他人按某种开源许可证复用和再分发，维护者应先选择适合的许可，再补充 `LICENSE` 和 README 说明。

## GitHub Pages 介绍页面

介绍页面是静态文件，可在本地直接打开 `docs/index.html`。若要在 GitHub 上单独展示：

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Deploy from a branch**。
3. 选择 `main` 分支，目录选择 `/docs`，保存。
4. 等待 GitHub 显示实际部署网址，再将网址填入仓库 About 的 Website 字段。

发布仓库与启用 Pages 是两个动作。未启用前，不应把预期网址写成已上线页面。

详情以 [GitHub Pages 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) 为准。
