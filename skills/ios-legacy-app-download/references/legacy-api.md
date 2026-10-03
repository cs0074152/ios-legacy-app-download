# 旧接口参考

这份资料保留原始文档中手工查询的思路，供旧环境兼容排查使用。**优先使用当前 ipatool 的 `list-versions` 与 `get-version-metadata`。** 本文件不保证私有接口、Cookie 格式或字段继续有效。

## 版本查询的原始思路

原文使用如下端点发送 Apple plist 请求：

```text
https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/volumeStoreDownloadProduct
```

原始流程依赖账号会话 Cookie、DSID 和客户端 GUID。会话解析和请求应留在用户可信的本机程序中；不要把 Cookie 或 DSID 加入 Agent 上下文，不要硬编码原文的示例 GUID，也不要导出会话文件到公开仓库。

| 原文请求 / 响应字段 | 记录的作用 |
| :--- | :--- |
| `salableAdamId` | 目标 App ID |
| `guid` | 与当前客户端环境有关的标识 |
| `externalVersionId` | 查询某个候选版本的元数据 |
| `songList[0].metadata.softwareVersionExternalIdentifiers` | 候选历史版本 ID 列表 |
| `songList[0].metadata.bundleShortVersionString` | 显示版本号 |

不同服务响应可能包含错误消息、重定向或不同结构。必须检查状态与字段，不能直接假设 `songList[0]` 存在。账号认证、许可和商店地区仍然适用。

## App Store 网页中的历史记录

原文尝试解析目标地区 App Store 网页的 `serialized-server-data`，读取版本号与日期。该数据是网页内部实现，可能改变、缺失或只包含部分记录。

应先检查当前网页可见的更新历史；如确实需要解析，按当前页面结构定位数据。不要把通用正则匹配到的 `primarySubtitle` 与 `secondarySubtitle` 全部当成版本历史，它们也可能来自页面其他卡片。

## 从原文调整的结论

- 删除“ipatool 没有历史版本查询命令”的固定判断：v2.5.0 与核对的 v2.6.0 源码均有相关命令。
- 删除“所有 Python 实现登录必定失败”的泛化：具体实现与版本需要分别核对。
- 将“所有版本日期都是假的”改为需要核对字段语义与来源。
- 不把某次下载案例写成现在仍可下载的保证。
- 不再固定使用 `~/.ipatool/cookies`，工具版本与系统的会话位置可能不同。

需要兼容研究时，可以阅读 [ipatool 当前实现](https://github.com/majd/ipatool/tree/main/pkg/appstore) 并对照实际安装版本；不要凭本参考绕过工具的认证与错误处理。
