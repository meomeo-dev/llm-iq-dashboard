# Codex 多 profile 运行设计

一个 profile 是一家 CLI 通往某个上游的一套完整配置：凭据、接口地址、模型清单与计价。
本文定义 profile 的领域模型、隔离方式、配置与凭据的存放、看板与数据仓的呈现规则，
作为后续变更单（ACR）的依据。首期只实现 codex。

## 1. 现状

每家 CLI 今天有且只有一个隐式 profile，即 OAuth 登录态，凭据在各自的登录卷里
（`compose.yaml` 的 `claude-auth` / `codex-auth` / `agy-auth`）。代码中三处按 CLI 单例：

| 假设 | 位置 | 后果 |
| --- | --- | --- |
| 会话池按 CLI 建 | `src/adapters/index.ts` `openSessionPool` | 一轮只起一个 `codex app-server`，继承 runner 的环境变量与 `~/.codex` |
| 分道键 `cli::model` | `src/core/run-plan.ts` `groupIntoLanes` | 两个上游跑同一模型会挤进一条道串行 |
| 就绪与能力缓存按 CLI | `src/capabilities/readiness-cache.ts`、`catalog.ts` | `data/readiness.json`、`data/capabilities.json` 均为 `Record<CliKind, …>` |

`src/capabilities/readiness.ts` 的 `keyEnv: ["OPENAI_API_KEY", "CODEX_API_KEY"]` 分支读的
是 runner 进程的全局环境变量，只能一份、无上游地址；且 `codex app-server` 不读
`CODEX_API_KEY`，该分支对当前调用路径无效。

轮次全局互斥（`src/bin/runner.ts` `startRun`）：已有一轮在跑时再发起一轮直接拒绝。

## 2. Codex 侧的隔离事实

依据 codex-cli 0.158.0 本机实测与 openai/codex 公开源码。

可用的机制：

- `thread/start` 接受 `model`、`modelProvider`、`config`（语义同 `-c key=value`）。
- `model_providers.<id>` 支持 `base_url`、`env_key`、`query_params`、`http_headers`、
  `env_http_headers`、`requires_openai_auth`；`env_key` 指向的 API key 在发请求时从进程
  环境变量读取，不落盘。
- `cli_auth_credentials_store = "ephemeral"` 加 `account/login/start {type: "apiKey"}` 可
  内存登录，home 内不生成 `auth.json`。
- 不同 `CODEX_HOME` 的进程在配置、凭据、会话与 sqlite 层面互不可见。

必须绕开的限制：

1. 登录态、`model/list`、`models_cache.json`、sqlite 都是进程级或 home 级。一个进程只有
   一个 AuthManager，ChatGPT 登录与 API key 二选一。
2. 多进程共享同一 home 有 refresh token 竞争（`refresh_token_reused`）与 sqlite 锁冲突
   的公开报告。
3. `[profiles.<name>]` 自 0.134 起废弃；新机制 `--profile <name>` 读 `<name>.config.toml`，
   但 `app-server` 子命令不接受 `--profile`，只接受 `-c`。
4. `model/list` 只按启动时的 provider 取目录，第三方 provider 返回的是内置 OpenAI 列表。
   第三方 profile 的模型清单须由本项目维护，`thread/start` 必须显式传 `model`。
5. `wire_api` 只接受 `"responses"`，第三方上游必须实现 `/v1/responses`。
6. `$CODEX_HOME/.env` 会覆盖外部注入的同名环境变量。每个 home 内不得存在 `.env`。
7. `$HOME/.agents/skills`、`~/.cache`、`/etc/codex` 不随 `CODEX_HOME` 变化，须同时改
   `HOME`。
8. 不复制 `auth.json`：两份副本各自刷新，超出服务端宽限窗口后另一份失效。多个 ChatGPT
   账号各自在自己的 home 内 device code 登录。

结论：**每个 profile 一个 `CODEX_HOME`、一个独立 app-server 进程、一套独立环境变量。**
共享 home 靠按线程切 provider 做不到隔离。

## 3. 领域模型

```yaml
# 上游类型清单，不写即起步清单；写了以此为准，可增删
upstreamTypes: [chatgpt-plus, chatgpt-pro-5x, official-api-key, azure, compatible]

profiles:
  # default 隐式存在，不写也有：该 CLI 的登录态，凭据在登录卷 ~/.codex
  - name: kedaya-group-a          # 全局唯一，kebab-case
    cli: codex
    upstreamType: chatgpt-pro-5x  # 取 upstreamTypes 之一
    group: group-a                # 上游侧分组名，自由文本
    website: https://kedaya.ai/
    baseUrl: https://api.kedaya.ai/v1
    queryParams: {}
    models: [gpt-5.5, gpt-6-mini] # 第三方无法探测，手工维护
    pricing:
      multiplier: 0.08            # 缺省价 = 官价 × 倍率，计价项与官方一致
      overrides: {}               # 逐模型逐计价项手填，见 §7
    enabled: true                 # false 时其目标不进定时任务、不可手动选

targets:
  - cli: codex
    profile: kedaya-group-a       # 缺省为 default
    model: gpt-5.5
    effort: high
```

非默认 profile 一律是第三方上游加 API key；"第二个 ChatGPT 账号"不在范围内，
因此没有 `kind` 字段。

### 3.1 字段

| 字段 | 约束 | 是否公开 |
| --- | --- | --- |
| `name` | 全局唯一，kebab-case（小写字母、数字、连字符），`default` 保留 | 公开 |
| `cli` | 首期只允许 `codex` | 公开 |
| `upstreamType` | 取顶层 `upstreamTypes` 之一；清单由用户在配置页维护，未配置时为起步清单 | 公开 |
| `group` | 自由文本 | 公开 |
| `website` | https URL | 公开 |
| `baseUrl` | https URL，必填 | **不公开** |
| `queryParams` | 字符串映射，仅用于 Azure 的 `api-version` 等 | 不公开 |
| `models` | 可空：新建 profile 先保存、写 key，再从上游 `/models` 同步或手填 | 公开 |
| `pricing` | 见 §7 | 公开 |
| `enabled` | 缺省 true | 不导出 |
| API key | 不在 YAML 中，见 §5 | 永不公开 |

起步清单：`chatgpt-plus`、`chatgpt-pro`、`chatgpt-pro-5x`、`chatgpt-team`、
`chatgpt-enterprise`、`official-api-key`、`azure`、`compatible`。清单项也须是 kebab-case。

`baseUrl` 与 `queryParams` 只用于生成该 profile 的 `config.toml`，不出现在运行记录、
接口响应与数据仓。

### 3.2 目标标识

`default` profile 的目标 id 保持 `cli__model__effort`，历史产物、成本历史与数据仓记录
完全兼容。非默认 profile 追加第四段：`cli__model__effort__<profile>`。产物文件名、
`scratchDir`、预算键、配置写回的节点身份均随 id 变化，`config-writer.ts` 的严格与
宽松身份都加入 `profile`。

`Attempt` 新增可选字段 `profile`，缺省视为 `default`；`normalizeRun` 与
`normalizeLegacyRun` 同步补默认值。

## 4. 运行时隔离

runner 为本轮用到的每个 codex profile 起一个 app-server：

| 项 | `default` | 非默认 profile |
| --- | --- | --- |
| `CODEX_HOME` | `~/.codex`（登录卷，不变） | `/app/codex-homes/<name>`（新卷 `codex-homes` 的子目录） |
| `HOME` | 不变 | `/app/codex-homes/<name>/home`，切断 `~/.agents`、`~/.cache` |
| `config.toml` | 用户自己的 | 由本项目生成：`model_provider`、`[history] persistence="none"`、MCP / notify / otel 留空 |
| 凭据 | `auth.json` | 只向该进程环境注入 `PELICAN_PROFILE_KEY`，provider 的 `env_key` 指向它 |
| 启动参数 | `codex app-server` | `codex app-server -c cli_auth_credentials_store="ephemeral"` |
| 停用（`enabled: false`） | 不适用 | 其目标从定时轮次剔除，"跑一次"里不可选，不起进程 |

生成的 `config.toml` 每轮开始时重写，保证与 YAML 一致；目录内若出现 `.env` 视为配置
错误，该 profile 本轮记为 `error`。

代码落点：`src/adapters/exec.ts` 的 `spawnDetached` 增加环境覆盖参数；
`src/adapters/codex-app-server.ts` 的 `start()` 接收 profile 解析结果；
`src/adapters/index.ts` 会话池键改为 `cli::profile`；`src/adapters/codex.ts` 的
`thread/start` 传 `modelProvider`。

## 5. 凭据存放与网页写入

API key 复用 `src/core/github-auth/credential-store.ts` 的模式：`PELICAN_SECRETS_DIR`
下 `profiles/<cli>/<name>.key`，目录 0700、文件 0600、临时文件后原子替换。

web 容器不挂 `runner-secrets` 卷，因此网页新建或改 key 的路径是：浏览器 → `PUT
/api/profiles/<name>/credential` → web 进程写入 `data/requests/` 一条
`profile-credential` 请求 → runner 认领、写入凭据目录、回写结果。请求文件只在数据卷上
短暂存在，处理完即删除；web 进程不缓存、不回显 key。

`GET /api/config` 与配置页 SSR 只返回 §3.1 标为公开的字段，另附 `hasCredential` 布尔值。

泄漏拦截：`src/core/leak-guard.ts` 的 `credentialFiles()` 加入全部 profile 的 key 文件与
各 home 的 `auth.json`；`src/core/sync/leak-scan.ts` 增加对 `baseUrl` 主机名的匹配。

## 6. 并行与互斥

一轮内可多选 profile，各 profile 并行。分道键改为 `cli::profile::model`，一个 profile
崩溃只影响自己的道：`EXIT_METHOD` 合成消息只送达该 server 的订阅者。

并行度分两层：

```yaml
run:
  concurrency: 3            # 现有：同时在跑的道数
  profileConcurrency: 5     # 新增：同时活跃的 codex app-server 进程数，默认 5
```

`profileConcurrency` 限制的是进程数而非道数：一个 profile 内多模型仍按 `concurrency`
分道。超出上限的 profile 排队等前一个 profile 的全部道跑完。配置页在"节奏"段提供
两个数字的输入。

轮次仍然全局互斥。"profile 1 在跑时再发起一轮跑 2–5"仍被拒绝，该场景由同一轮多选
覆盖。按 profile 拆互斥涉及 `progress.json`、`cancel.json`、预算门与看板"正在执行"语义
的整体改造，不在本设计范围内。

## 7. 计价

非默认 profile 的成本不按官方渠道价折算，改按 profile 自己的价格表：

- 缺省价 = 价格目录（`meomeo-dev/llm-pricing-catalog`，见
  `config/pricing-catalog.lock.json`）中该模型的官价 × `pricing.multiplier`。
- `pricing.overrides[model][meter]` 逐项手填，优先于缺省价。
- 配置页提供"同步官价"按钮：按当前锁定的目录版本重算缺省价并清空与之相同的
  override；用户填过的差异项保留并高亮提示"与官价 × 倍率不一致"。
- `estimateCost` 的入参增加 profile；`pricesAt` 对非默认 profile 走 profile 价格表。

看板的成本列对非默认 profile 显示 profile 名，鼠标悬停显示倍率与来源。

## 8. 能力与就绪

按 `(cli, profile)` 记录：

| 项 | `default` | 非默认 profile |
| --- | --- | --- |
| 模型清单 | `codex debug models` 探测 | 取 `profiles[].models` |
| 强度档位 | 探测结果 | 取同名模型在 `default` 探测结果中的档位；查不到则视为不可调 |
| 就绪 | `codex login status` | key 文件存在且非空；可选一次最小 `thread/start` 连通性探测 |

`data/capabilities.json` 与 `data/readiness.json` 的键由 `cli` 改为 `cli` 或
`cli:profile`；`CATALOG_SCHEMA_VERSION` 升到 3，旧缓存按 `default` 读取。

## 9. 看板呈现

首页时间线、模型弹窗、结果卡片、大图详情页与"跑一次"的上游呈现与交互见
[`profile-display-ux.md`](profile-display-ux.md)。配置页的"上游 Profile"段已随 ACR-013 之后的
配置页改动落地：列表、新建、编辑、启停、填 key、从上游同步模型、`upstreamTypes` 清单增删，
矩阵 `TargetRow` 显示上游列。

## 10. 公开数据仓

`PublicAttempt` 增加可选 `profile` 字段（名字）；`PublicRunRecord` 增加
`profiles[]`，每项只含 §3.1 标为公开的字段。`baseUrl`、`queryParams`、key、home
路径不进入导出。`DATA_REPO_SCHEMA_VERSION` 不升，远程展台按可选字段兼容读取；
数据仓的 `schemas/` 与 `scripts/lib/validator.mjs` 同步增加字段与"禁止出现 URL 主机名
以外的地址"的校验。

## 11. 改造面与分期

涉及 `src/core`、`src/adapters`、`src/capabilities`、`src/pricing`、`src/app`、
`src/core/data-repo` 与 `compose.yaml`，超过单张 ACR 的模块上限，拆为三张：

| 变更单 | 范围 | 交付物 |
| --- | --- | --- |
| ACR-A 模型与运行时 | `types`、`config/*`、`config-writer`、`adapters/*`、`run-plan`、`progress`、`leak-guard`、`compose.yaml` | YAML 手写 profile 即可跑；`pnpm run:once` 验证多 profile 并行 |
| ACR-B 凭据与计价 | `credential-store` 扩展、`requests` 新类型、`pricing/*`、`capabilities/*`、`data-repo/contract`、`export-run`、`leak-scan` | 网页填 key、按 profile 计价、导出白名单 |
| ACR-C 看板 | `app/config/*`、`app/api/{config,run,readiness,capabilities,profiles}`、`components/{toolbar,timeline,run-control,model-modal}` | 配置页 Profile 段、跑一次多选、时间线分组 |

每张 ACR 的回归清单在现有门禁之外增加：两 profile 同模型同强度的时间线不丢卡；
导出记录 grep 不到 `baseUrl` 主机名；`default` 目标 id 与改造前逐字相同。

## 12. 不做的事

- claude、agy 的 profile。数据模型带 `cli` 字段，但适配器与探针只实现 codex。
- 第二个 ChatGPT 账号（OAuth 型的非默认 profile）。
- 按 profile 拆轮次互斥（§6）。
- 复制或共享 `auth.json`；多个 ChatGPT 账号各自登录各自的 home。
- 通过 profile 透传任意 `-c` 键、`http_headers` 或命令：`ceiling.ts` 对 `extraArgs`
  的禁令同样适用于 profile。
