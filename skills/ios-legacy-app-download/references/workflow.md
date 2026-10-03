# 操作指南

此指南面向自己的 Apple 账号与有权获取的应用。命令参数按 [ipatool v2.6.0 源码](https://github.com/majd/ipatool/tree/v2.6.0/cmd) 核对；不代表已进行真实账号登录或端到端下载验证。

## 1. 准备工具

从 [官方 Releases](https://github.com/majd/ipatool/releases) 选择系统和架构对应的构建。Windows 发行包目前为 `.tar.gz`，不要依赖旧文档里的固定 `.zip` 文件名。解压后把可执行文件加入 `PATH`，或使用其完整路径。

macOS 也可以执行：

```sh
brew install ipatool
```

检查实际安装版本和命令：

```sh
ipatool --version
ipatool auth login --help
ipatool list-versions --help
ipatool get-version-metadata --help
ipatool download --help
```

Windows PowerShell 在当前目录运行时，命令写作 `./ipatool.exe`。示例中的 `APP_ID`、`VERSION_ID` 和邮箱都需要替换。

## 2. 在本机终端登录

```sh
ipatool auth login --email "your-apple-account@example.com"
```

按交互提示输入密码、2FA 码与 keychain 密码短语。不要将真实密码写进命令行参数，也不要粘贴到聊天或 Issue。自动化通道不支持隐藏输入时，改用用户自己的终端完成这一步。

某些环境可能要求显式传入 `--keychain-passphrase`。它的值会进入进程参数，可能被进程检查工具观察；请由用户在可信本机环境处理，不要把真实值写进脚本、日志或提交。

工具会访问 Apple 服务器，并使用本机 keychain 或文件保存会话；v2.6.0 还调整了 XDG 路径支持。存储位置应检查当前工具实现，不应固定假设为某一个目录。

## 3. 确认应用身份

```sh
ipatool search "应用名称" --limit 5
```

核对应用名称、开发者、App ID、Bundle ID 和账号所在商店。公共元数据也可用 Apple 的 Lookup API 查询，例如：

```text
https://itunes.apple.com/lookup?id=APP_ID&country=cn
```

`country=cn` 只是中国商店示例，按目标地区修改。公开查询的地区参数不会改变已登录账号的商店地区。无匹配结果时检查地区、上下架状态及同名应用，不要继续猜测 App ID。

## 4. 获取历史版本 ID

```sh
ipatool list-versions --app-id APP_ID
```

也可以按 Bundle ID 查询：

```sh
ipatool list-versions --bundle-identifier "com.example.app"
```

结果中的 `externalVersionIdentifiers` 是候选版本 ID。保留它们用于下一步；不要把列表顺序当成已验证的日期排序。

## 5. 将版本 ID 映射到版本号

```sh
ipatool get-version-metadata --app-id APP_ID --external-version-id VERSION_ID
```

对照返回的 `externalVersionID` 与 `displayVersion`。按目标筛选候选，串行查询并适当留出间隔；不发起无上限批量请求。已定位目标时停止查询。

### 用户只记得大致时间时

先访问目标地区的 App Store 页面，查看可见的版本历史和更新说明。网页可能只展示部分版本，页面结构和嵌入数据格式也会改变；它用于缩小范围，不能单独证明某个版本仍能下载。

上游元数据可能包含 `releaseDate`，但 Apple 的字段语义不一定等于每个历史版本的发布时间。原文记录过多个版本日期相同的情况；应交叉核对并明确不确定性，不将这个历史观察写成所有版本的固定结论。

## 6. 确认许可并下载

先确认该账号拥有应用许可。需要获取许可时，应按当前上游说明和用户授权处理；不要默认增加 `--purchase` 或自动执行 `purchase`。

```sh
ipatool download --app-id APP_ID --external-version-id VERSION_ID --output "./app-legacy.ipa"
```

`--output` 在此明确指定输出文件。执行前检查同名文件是否存在；避免覆盖已有资料，必要时换一个能识别版本的文件名。

## 7. 检查 IPA

确认文件存在、大小合理且可作为 ZIP 读取。检查 `Payload/*.app/Info.plist` 中：

| 字段 | 用途 |
| :--- | :--- |
| `CFBundleIdentifier` | 核对应用身份 |
| `CFBundleShortVersionString` | 核对显示版本号 |
| `CFBundleVersion` | 记录构建号 |
| `MinimumOSVersion` | 了解最低系统要求 |

仅检查 ZIP 文件头不能证明下载的是正确应用或版本。发现差异时停止安装建议，先说明检查结果。

## 8. 安装与运行

IPA 通常带有 FairPlay 加密。普通重签不会自动解密；即使账号相同，也可能因设备系统、架构、签名、许可和安装工具支持情况失败。

根据目标设备和合法的安装方式另行核对兼容性。没有验证前，不承诺 Sideloadly、某个助手或证书信任步骤一定可行。先备份数据并确认恢复方案，再决定是否移除当前安装版本。

## 排查原则

- 认证失败：检查交互式终端、2FA、账号状态和最新上游问题；停止无限重试。
- 未找到应用：确认账号商店地区与 App ID，不用其他同名应用替代。
- 未找到目标版本：说明实际查询范围，以及网页历史与下载候选的区别。
- 许可失败：先核对购买记录与授权，不用重复认证掩盖许可问题。
- 瞬时服务或网络错误：可做少量延迟重试；持续失败时保留已查询结果并交付错误摘要。
- 接口变化：优先检查原生命令与上游更新，再阅读 [旧接口参考](legacy-api.md)。
