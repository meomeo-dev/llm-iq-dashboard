# ACR-023: 数据仓地址在配置页可改，执行器按地址自动 clone（Data Repo Address Editable on Config Page with Auto Clone）

| 项 | 内容 |
|---|---|
| 状态 | implementing |
| 日期 | 2026-10-03 |
| 变更类型 | structure-change |
| 触发来源 | 口头：数据仓是哪一个只能写在 YAML 里，网页改不了；用户要求在配置页填数据仓地址，本地没有就自动 clone |
| 基线 | ARCH-001 |
| 影响章节 | §4 §5 |
| 改造面上限 | 5 个模块（src/core、src/app、src/bin 三个代码模块，各自的测试目录 test/core、test/app 同构随之计入；config、docs 与根文件不计） |
| 取代 / 被取代 | 无 |

目前 `dataRepo.path / autoSync / push` 只能在 `config/pelican.config.yaml` 里写，配置页「数据仓」区块只展示状态；
目标仓库由本地目录的 `origin` 远程决定，网页上没有「用哪个仓」的入口，第三方用自己的数据仓要先在宿主机
clone 好再写路径。本 ACR 给配置加 `dataRepo.repository`（GitHub 仓地址），配置页可改地址、本地路径、自动同步、
自动推送；执行器发现本地路径不存在或是空目录时按地址 clone，本地 `origin` 与地址不一致时面板报警；
GitHub App 连接与清单一律以这个地址为准。

## 动机

- 现状：`config-writer` 没有 `dataRepo` 的写回键，面板只读；仓库身份藏在本地目录的 git remote 里，网页看不到也改不了；
  GitHub 连接流程的目标仓从 remote 推导，没配 path 时写死 `meomeo-dev/llm-iq-data`。
- 不动的代价：第三方部署要进容器或宿主机手工 clone、改 YAML、再回网页连 GitHub，三处要对齐；填错一处推送 403。
- 为什么现在：ACR-022 收口后用户问「不能在网页上配置吗？数据仓地址？」，并选了「加远程地址、自动 clone」这一档。

## 方案评估

要的是：配置多一个仓地址字段、网页能改、执行器能按地址把本地副本准备好、三处（YAML、本地 remote、GitHub App）一致。
这是本仓库配置页与同步流水线的扩展，没有可整体替代的开源件；候选只在「clone 怎么做」上。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| simple-git：Node 封装 git 命令，含 clone / remote | npm:simple-git | 4.0.2 | MIT | 2026-09-26 | active | 3 个模块（要替换 `data-repo-git.ts` 已有的 gitExec 调用才不至于两套） | 中：多一个依赖，而本仓库已经有 `gitExec` 封装 | reject | 改造面：现有 `gitExec` 已覆盖 clone / remote get-url，引入它要改三个模块的调用点，自研只在 src/core 加一个文件 |
| 自研：`src/core/sync/data-repo-checkout.ts` 用现有 `gitExec` 做 clone / 校验 remote，配置、写回、面板、runner 各加一段 | self | - | - | - | - | 3 个模块（src/core、src/app、src/bin） | 低：约 250 行，复用 gitExec、config-writer、ConfigSection 的既有模式 | adopt | - |

> **结论**：自研 —— 本仓库已有 git 执行封装与配置写回模式，新增的是一个字段、一个 checkout 步骤和一张表单；
> 引入 git 库只是换一种写法，不减工作量。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/config/types.ts` | modify | `DataRepoConfig.repository`：可选字符串，GitHub https 地址，缺省 null | no |
| `src/core/config/loader.ts` | modify | `parseDataRepo` 解析并校验 `repository`（须为 `https://github.com/owner/repo` 形式） | no |
| `src/core/config-writer.ts` | modify | `ConfigPatch.dataRepo`：按子键写 `path / repository / autoSync / push`，`null` 删整段；`publishPrompts` 不动 | no |
| `src/core/sync/data-repo-checkout.ts` | add | `ensureDataRepoCheckout`：有地址时本地路径不存在或为空目录 → clone；是 git 仓 → 比对 `origin`，不一致返回 mismatch 不动它；无地址 → 不做事 | no |
| `src/core/sync/data-repo-git.ts` | modify | `inspectGitRepo` 增返回 `originUrl` | no |
| `src/core/sync/sync-orchestrator.ts` | modify | `SyncOptions.repository`，同步入口经 `resolveSyncContext` 先准备副本 | no |
| `src/core/sync/sync-scope.ts` | modify | `syncOptionsFromConfig` 带上 `repository`；`resolveSyncContext` 开头 `ensureDataRepoCheckout`，mismatch 直接报错中止 | no |
| `src/core/sync/data-repo-status.ts` | modify | 状态加 `repository` 与 `repo.originUrl`、`remoteMismatch`；不一致写进 notices | no |
| `src/core/sync/data-repo-panel-types.ts` | modify | `DataRepoStatus` 对应字段 | no |
| `src/app/api/data-repo/github/connect/route.ts` | modify | GitHub App 清单 `url` 用配置的 `repository`，没配才用缺省 | no |
| `src/app/api/data-repo/github/github-helpers.ts` | modify | `resolveRepoFullNameAndId` 先用配置的 `repository`，再退回 remote，再退回缺省 | no |
| `src/app/api/data-repo/github/callback/route.ts` | modify | 换令牌时传整段 `dataRepo` 而不只是路径 | no |
| `src/bin/runner.ts` | modify | 同上的仓名解析；启动时与数据仓状态 / 同步请求前调用 `ensureDataRepoCheckout`，clone 结果写日志 | no |
| `src/app/config/DataRepoForm.tsx` | add | 表单：启用开关、仓地址、本地路径、自动同步、自动推送 | no |
| `src/app/config/ConfigEditor.tsx` | modify | 新区块 `data-repo-settings`「数据仓设置」 | no |
| `src/app/config/config-editor-model.ts` | modify | `EditableConfig.dataRepo`，补丁体带 `dataRepo` | no |
| `src/app/config/config-nav-items.ts` | modify | 导航加「数据仓设置」 | no |
| `src/app/config/page.tsx` | modify | 把配置的 `dataRepo` 交给编辑器初值 | no |
| `src/app/config/DataRepoPanel.tsx` | modify | 标题显示配置的仓名而不是写死 `llm-iq-data`；remote 不一致时报警条 | no |
| `src/app/config/DataRepoGithubCard.tsx` | modify | 按钮文案显示仓名 | no |
| `test/core/config-data-repo.test.ts` | modify | `repository` 解析与校验 | no |
| `test/core/config-writer.test.ts` | modify | `dataRepo` 写回与删段 | no |
| `test/core/sync/data-repo-checkout.test.ts` | add | clone 与 mismatch（本地裸仓做远端） | no |
| `test/core/sync/data-repo-status.test.ts` | modify | remote 不一致报警；配置字面量补 `repository` | no |
| `test/core/sync/data-repo-git-status.test.ts` | modify | `inspectGitRepo.originUrl` 断言 | no |
| `test/core/sync/sync-orchestrator.test.ts` | modify | origin 不一致拒绝同步、一致照常 | no |
| `test/app/api/data-repo-github.test.ts` | modify | 清单仓地址以配置为准 | no |
| `test/core/sync/runner-hook.test.ts` | modify | 配置字面量补 `repository` | no |
| `test/app/config/config-side-nav.test.ts` | modify | 导航项数 | no |
| `test/app/config/config-nav-anchors.test.ts` | modify | 锚点清单 | no |
| `config/pelican.example.yaml` | modify | `dataRepo.repository` 示例与说明 | no |
| `README.md` | modify | 数据仓同步一节：配置页可改、空目录自动 clone | no |
| `docs/deploy-docker.md` | modify | 容器里挂空目录即自动 clone | no |
| `docs/architecture/architecture.md` | modify | §4 §5 回填 | no |
| `AGENTS.md` | modify | 架构速览补一句 | no |
| `CHANGELOG.md` | modify | `[未发布]` 新增一条 | no |

**不动的东西**：

- 数据仓布局契约 `src/core/data-repo/contract.ts` 与数据仓侧 validator / schema。
- 导出、脱敏、台账、推送确认的流程与规则；`publishPrompts` 仍只在 YAML 里改。
- 推送凭据模型（GitHub App 用户令牌只在 runner），只读展台（`PELICAN_DATA_REPO_URL` 继续独立）。

## 兼容与回归

**兼容策略**：直接替换 —— `repository` 是可选字段，没配时一切与现在相同（仓库仍由本地 remote 决定）；
配置页多一个区块，旧配置文件不改也能加载。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | - | | |
| `pnpm test` | 单元测试 | pass | - | | |
| `pnpm check:secrets` | 密钥扫描 | pass | - | | |
| `pnpm build` | Next.js 看板生产构建 | pass | - | | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、变量注入、强度折叠 | pass | - | | 变更前取 ACR-022 的同一次冒烟（轮次 20261003T060858Z，运行时代码自那以后未动） |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 配置层：类型、解析、写回、`ensureDataRepoCheckout`、`inspectGitRepo.originUrl`，带测试 | revert 本 commit |
| 2 | 执行侧：runner 启动与同步前 checkout，`syncDataRepo` 入口校验，状态与 GitHub 连接以 `repository` 为准 | revert 本 commit |
| 3 | 网页：数据仓设置表单、面板文案与报警、导航项；文档与 CHANGELOG | revert 本 commit |

## 回滚方案

- 触发条件：clone 在容器里失败卡住同步；配置页写回把 YAML 写坏；GitHub 连接因仓名来源变化而 403。
- 步骤：revert 步骤 1–3 的三个 commit；配置文件里多出的 `dataRepo.repository` 旧版本会报「未知字段」吗——不会，
  `parseDataRepo` 只读已知键，多余键忽略，所以回滚后 YAML 不用改。
- 数据：无需迁移；已 clone 的目录保留，就是普通工作副本。

## 人工确认

### 方案摘要

1. 要动什么：配置加 `dataRepo.repository`；配置页新区块可改仓地址、本地路径、自动同步、自动推送；执行器按地址把本地副本 clone 好，remote 不一致时报警；GitHub App 连接以地址为准。涉及 src/core、src/app、src/bin 三个模块。
2. 不动什么：数据仓契约与 validator、导出 / 脱敏 / 台账 / 推送确认流程、`publishPrompts`、只读展台的 `PELICAN_DATA_REPO_URL`。
3. 为什么现在：用户确认要在网页上配数据仓，并选了「加远程地址、自动 clone」。
4. 风险与回滚：clone 只在路径不存在或为空目录时发生，已有仓绝不覆盖；三个 commit 可逐个 revert，YAML 多出的字段对旧版本无害。
5. 成本：三步、半天；零新依赖。收口的「变更后」冒烟要再跑一次（10 次调用）。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-10-03 | luojin | approved | 看板会话里按 brief 五问确认，选项 approved（含自动 clone） |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §4 | 数据仓一节补「仓地址在配置里，执行器按地址 clone，remote 不一致报警」 | 待回填 |
| architecture.md §5 | 配置项补 `dataRepo.repository`，配置页可改 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-023 | 待回填 |
| ADR（/adr-curator） | 不适用：非难逆转 | 不适用 |
