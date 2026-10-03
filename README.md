<p align="center">
  <img src="docs/assets/cover.svg" alt="iOS Legacy — 找回你熟悉的那个版本" width="100%">
</p>

<h1 align="center">iOS Legacy App Download</h1>

<p align="center"><strong>让 iOS App 的历史版本，更容易被找到。</strong></p>
<p align="center">一份基于 ipatool 的 Agent Skill 与中文使用指南。<br>从查找应用、定位版本，到下载 IPA，把零散的步骤串成清晰的流程。</p>

<p align="center">
  <img alt="类型：Agent Skill" src="https://img.shields.io/badge/Agent-Skill-252a26?style=flat-square">
  <img alt="工具：ipatool" src="https://img.shields.io/badge/Powered_by-ipatool-e77942?style=flat-square">
  <img alt="平台：Windows / macOS / Linux" src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-57745c?style=flat-square">
  <img alt="文档：中文" src="https://img.shields.io/badge/Docs-简体中文-57745c?style=flat-square">
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#作为-agent-skill-使用">安装 Skill</a> ·
  <a href="skills/ios-legacy-app-download/references/workflow.md">完整指南</a> ·
  <a href="#常见问题">常见问题</a> ·
  <a href="docs/index.html">介绍页面源码</a>
</p>

---

## 为什么做这个项目

你可能记得某个 App 的旧界面、某次更新前的功能，或者一个更适合旧设备的版本，却不知道从哪里开始找。

这个项目把应用身份、版本号、版本 ID 和下载步骤放到同一条路径里。你可以跟着文档操作，也可以交给支持 `SKILL.md` 的 Agent 协助查询和整理。

**项目提供的是 Skill 与操作指南，下载能力由上游 [ipatool](https://github.com/majd/ipatool) 提供。** 能否获取某个版本，取决于 Apple 服务、账号许可和该版本是否仍可下载。

## 可以帮你做什么

| 你想做的事 | 项目提供的帮助 |
| :--- | :--- |
| 只知道 App 名称 | 查询 App ID、Bundle ID 和目标商店地区 |
| 已经知道目标版本号 | 获取历史版本 ID，查询元数据并核对版本 |
| 只记得大致更新时间 | 参考 App Store 展示的更新记录，缩小查询范围 |
| 想保留一个旧版安装包 | 使用自己的 Apple 账号下载仍可获取的指定版本 IPA |
| 想让 Agent 协助操作 | 提供明确的 Skill 流程、凭据边界和失败处理方法 |

## 一条清晰的下载路径

<p align="center"><img src="docs/assets/workflow.svg" alt="确认应用 → 定位版本 → 下载 IPA" width="100%"></p>

1. **确认应用。** 核对名称、App ID、Bundle ID 和商店地区，避免找到同名应用。
2. **定位版本。** 先获取可用版本 ID，再核对对应版本号；日期用于辅助判断。
3. **下载与检查。** 下载到本地，检查 IPA 内的应用信息，并保留核对结果。

## 快速开始

准备一个已启用 App Store 的 Apple 账号，以及上游 Go 版 ipatool。Windows / Linux 可从 [官方 Releases](https://github.com/majd/ipatool/releases) 选择对应架构的压缩包；macOS 也可用 `brew install ipatool`。

以下命令假设 `ipatool` 已加入 `PATH`。Windows 若只解压到当前目录，请使用 `./ipatool.exe` 替代 `ipatool`。

### 1 · 登录自己的账号

在自己的交互式终端执行，按提示输入密码和双重认证验证码：

```sh
ipatool auth login --email "your-apple-account@example.com"
```

密码、验证码和 keychain 密码短语由你在本机输入，**不要发送到聊天、Issue 或提交记录中**。需要解锁 keychain 时，继续按本地终端提示操作。

### 2 · 查找应用与可用版本

```sh
ipatool search "应用名称" --limit 5
ipatool list-versions --app-id APP_ID
ipatool get-version-metadata --app-id APP_ID --external-version-id VERSION_ID
```

用查询结果替换 `APP_ID` 和 `VERSION_ID`。`VERSION_ID` 是 Apple 的历史版本标识，**不是** `2.10.11` 这样的显示版本号。查询返回的 `displayVersion` 可用于核对目标版本。

### 3 · 下载指定版本

```sh
ipatool download --app-id APP_ID --external-version-id VERSION_ID --output "./app-legacy.ipa"
```

先确认账号已拥有该应用的许可。文件下载成功后，请检查其内部 `Payload/*.app/Info.plist` 中的 Bundle ID、版本号和最低系统要求。详细步骤见 [完整使用指南](skills/ios-legacy-app-download/references/workflow.md)。

> 以上示例按上游 v2.6.0 命令源码核对（2026-10-03），未使用真实 Apple 账号验证下载。实际使用时请先查看本机 `ipatool --version` 与相应命令的 `--help`。

## 作为 Agent Skill 使用

下载或克隆本仓库，将 **整个** `skills/ios-legacy-app-download` 文件夹复制到你所用 Agent 支持的技能目录。保留 `references/` 和 `agents/` 的相对位置；具体加载方式以所用 Agent 的文档为准。

```text
ios-legacy-app-download/
├── SKILL.md
├── agents/openai.yaml
└── references/
    ├── workflow.md
    └── legacy-api.md
```

可以这样开始：

```text
使用 $ios-legacy-app-download 帮我查找某个 iOS App 的历史版本。
应用名称：……
商店地区：……
目标版本号或大致更新时间：……
请先核对可用版本，并让我在本机终端完成账号登录。
```

Skill 不包含账号、不内置 ipatool，也不会因为安装而自动执行登录或下载。

## 使用前，了解这些边界

- **历史版本不一定仍可获取。** 展示在更新记录里的版本，可能已经无法下载。
- **IPA 下载成功不代表能安装。** 下载的包通常带有 FairPlay 加密；签名、设备系统、账号许可和应用架构都会影响安装与运行。普通重新签名不会自动移除加密。
- **更新日期需要交叉核对。** App Store 网页只展示部分历史记录，页面结构也可能变化；接口日期不宜直接视为每个版本的真实发布日期。
- **账号会访问 Apple 服务。** 本仓库没有收集账号的服务端；上游工具会与 Apple 通信，并按自己的实现保存本地会话。会话文件同样需要保密。
- **下载和安装分开处理。** 在确认安装方式和完成数据备份前，不要先删除设备上正在使用的版本。

## 常见问题

<details>
<summary><strong>这是一个一键下载软件吗？</strong></summary>

这是一个 Agent Skill 与中文指南仓库，另附静态介绍页面。它借助 ipatool 完成查询与下载，没有内置桌面客户端或托管下载服务。

</details>

<details>
<summary><strong>能下载所有 App 的所有历史版本吗？</strong></summary>

不能保证。应用许可、商店地区、账号状态和 Apple 仍提供的版本范围都可能影响结果。查询到某个版本 ID，也不等于该版本一定能成功下载。

</details>

<details>
<summary><strong>为什么查到的版本 ID 看起来不像版本号？</strong></summary>

`externalVersionID` 是 Apple 用来标识某次版本发布的数字 ID；`displayVersion` 才是通常看到的版本号。请用 `get-version-metadata` 核对，避免直接把版本号传给下载命令。

</details>

<details>
<summary><strong>旧文档里的手工接口流程还需要使用吗？</strong></summary>

优先检查当前 ipatool 的 `list-versions` 和 `get-version-metadata`。本项目将原文中的手工接口整理为 [旧流程参考](skills/ios-legacy-app-download/references/legacy-api.md)，仅用于排查与兼容研究，不保证接口继续有效。

</details>

<details>
<summary><strong>登录失败，或者提示没有应用许可怎么办？</strong></summary>

先检查上游版本、账号地区、双重认证状态和本机终端是否支持交互。明确失败原因后再处理；不要连续自动重试账号认证。关于许可，请确认应用在该账号的购买记录中，不要让 Agent 未经确认执行购买或获取许可。

</details>

## 项目结构

```text
.
├── README.md                         GitHub 项目首页
├── docs/                             静态介绍页面与展示素材
├── skills/ios-legacy-app-download/    可独立复制的 Skill
├── .github/ISSUE_TEMPLATE/            问题反馈与改进建议模板
├── CONTRIBUTING.md                   参与方式
├── SECURITY.md                       凭据与会话处理说明
└── PUBLISHING.md                      仓库与 GitHub Pages 发布说明
```

## 参与改进

欢迎补充可复现的问题、更新上游命令说明，或者优化不同平台的操作体验。提交前请阅读 [参与指南](CONTRIBUTING.md)；日志和截图必须移除账号、Cookie、DSID、验证码及本机个人路径。

本仓库暂未指定开源许可证；如需复用或再分发，请先联系仓库维护者确认授权。上游 ipatool 的许可证由其自身仓库管理。

## 致谢与资料来源

- [majd/ipatool](https://github.com/majd/ipatool)：查询、认证与 IPA 下载能力。
- [ipatool v2.6.0](https://github.com/majd/ipatool/releases/tag/v2.6.0)：本文命令核对版本。
- [历史版本查询源码](https://github.com/majd/ipatool/blob/v2.6.0/cmd/list_versions.go) 与 [版本元数据源码](https://github.com/majd/ipatool/blob/v2.6.0/cmd/get_version_metadata.go)：参数与结果字段参考。
- [Apple iTunes Lookup API 文档](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/LookupExamples.html)：公共应用信息查询。

本项目独立于 Apple 与 ipatool 上游。应用名称、商标与内容归各自权利人所有。
