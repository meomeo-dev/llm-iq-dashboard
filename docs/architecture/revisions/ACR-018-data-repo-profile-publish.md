# ACR-018: 数据仓发布 profile 结果与题目选择（Publish Profile Results to the Data Repo with Prompt Selection）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-30 |
| 变更类型 | structure-change |
| 触发来源 | 口头：codex 多 profile 之后，同步到 llm-iq-data 不能泄露 profile 的 key，profile 基本信息按用户运行时配置照常显示；上传时要能选题目（配置白名单 + 面板勾选）；容器里 autoSync 为 true，每轮结束即自动导出提交。前置 ACR-014 / ACR-016 |
| 基线 | ARCH-001 |
| 影响章节 | §4 §6 §8 |
| 改造面上限 | 6 个模块（测试目录与源模块同构：src/core、src/app、src/bin 各带一个 test 目录） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：`export-run.ts` 的 `withoutProfileAttempts` 把非登录态的调用整体扣下不发布，因为数据仓契约没有 `profile` 字段、数据仓 CI 的 `additionalProperties: false` 会拒收；同步阶段的泄漏指纹只覆盖三家 CLI 的登录凭据，不含 profile 的 key（运行阶段 `runner.ts` 已覆盖）；展台（Vercel 只读、远程数据源）没有配置文件，拿不到 profile 的显示名与倍率；同步没有题目筛选，候选就是 `data/runs` 下全部已完成轮次，配置页"导出提交"一键全导，容器里 `autoSync: true` 让每轮结束就本地提交。
- 不动的代价：多上游对比的结果永远发不出去；一旦有人放开 `withoutProfileAttempts`，同步这一关拦不住混进输出里的 key；题目无法选择，只能靠"本地只跑那道题"来控制公开内容。
- 为什么现在：ACR-014 / ACR-016 之后本地已经在跑多 profile 轮次（如 20260929T150913Z），用户明确要发布 profile 结果并选题。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| ajv：主仓导出前按数据仓 schemas 校验 run.json，契约改动靠 schema 单点约束 | npm:ajv | 8.20.0 | MIT | 2026-04-24 | active | 2 个模块（src/core 与 package.json） | 中：新增依赖树；数据仓 CI 已有手写校验器，两套并存 | reject | 改造面：数据仓的校验器与 schema 已是契约的机器守门，主仓再引一套只是重复；契约常量与类型在 `contract.ts` 单点，靠 tsc 守 |
| 自研：契约只增可选字段（attempt.profile、run.profiles），版本号不升；同步指纹纳入 profile key；`dataRepo.publishPrompts` 白名单；面板列出待导出轮次逐个勾选；展台从记录里取 profile 视图 | self | - | - | - | - | 3 个模块（src/core、src/app、src/bin） | 低：只用仓库既有的契约、面板与视图模型 | adopt | - |

> **结论**：自研 —— 全是本仓库特有的契约与面板逻辑；契约的机器守门在数据仓 CI，主仓不再引校验库。

## 变更范围

契约取舍：只增可选字段、不升 `DATA_REPO_SCHEMA_VERSION`。展台按版本号整体拒收，升版会让尚未重新部署的展台在数据推送后立刻不可用；可选字段让旧展台照常读、只是不显示 profile 信息。

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/data-repo/contract.ts` | modify | `PublicAttempt` 允许 `profile`；`PublicRunRecord` 增 `profiles: PublicProfile[]`（即 `ProfileView` 八个公开字段，按导出时配置快照，只含本轮用到的）；注释改为"只增可选字段不升版" | no |
| `src/core/sync/export-run.ts` | modify | 配置里登记的 profile 调用放行并写 `profiles`；配置里已不存在的 profile 仍扣下并计数；题目按 `publishPrompts` 白名单剔除，剩空整轮跳过 | yes |
| `src/core/sync/sync-orchestrator.ts` | modify | `SyncOptions` 增 `profiles`（ProfileConfig）与 `publishPrompts`；泄漏指纹 = 三家登录凭据 + 全部 profile key；缺省（不传）行为与现在相同 | no |
| `src/core/sync/sync-scope.ts` | add | 从配置取同步范围（路径、profile 清单、白名单）；解析上下文与导出参数 | no |
| `src/core/sync/data-repo-status.ts` | modify | `local.pendingRuns`：待导出轮次的 runId、题目、调用数、成功数、上游名，供面板勾选 | no |
| `src/core/sync/data-repo-panel-types.ts` | modify | `SyncActionRequest.runIds?`；`DataRepoStatus.local.pendingRuns` | no |
| `src/core/config/types.ts` | modify | `DataRepoConfig.publishPrompts`：字符串数组或 null | no |
| `src/core/config/loader.ts` | modify | 解析 `dataRepo.publishPrompts`（字符串数组，缺省 null = 全部） | no |
| `src/core/run/post-sync.ts` | modify | 自动同步传 profiles 与白名单 | no |
| `src/core/data-source/interface.ts` | modify | 可选 `knownProfiles(): ProfileView[]` | no |
| `src/core/data-source/remote.ts` | modify | 记录里的 `profiles` 汇入 `knownProfiles`，按首次出现排序 | no |
| `src/core/data-source/index.ts` | modify | 导出 `knownProfiles` 入口 | no |
| `src/app/components/dashboard/dashboard-page-data.ts` | modify | 配置没有 profile 时（展台）改用数据源的 `knownProfiles` | no |
| `src/app/api/data-repo/sync/route.ts` | modify | 传 profiles、白名单与 `runIds` | no |
| `src/app/api/data-repo/sync/sync-request.ts` | modify | 解析 `runIds`（字符串数组，可选） | no |
| `src/app/config/DataRepoPendingList.tsx` | add | 待导出轮次清单：勾选框、题目、调用数、上游；缺省全选 | no |
| `src/app/config/DataRepoPanel.tsx` | modify | 挂清单；导出与演练只带勾选的 runId | no |
| `src/app/config/DataRepoPipeline.tsx` | modify | 勾选数进导出按钮文案 | no |
| `src/app/config/data-repo-pipeline-model.ts` | modify | 勾选为零时导出按钮禁用并给原因 | no |
| `src/app/config/use-pending-selection.ts` | add | 勾选状态：缺省全选，刷新后新轮次默认勾上 | no |
| `src/app/config/use-data-repo-actions.ts` | modify | `executeAction` 带 `runIds` | no |
| `src/app/config/config-data-repo-pending.css` | add | 清单样式 | no |
| `src/app/config/config.css` | modify | 引入清单样式 | no |
| `src/bin/runner.ts` | modify | 分容器执行同步时传 profiles、白名单与 `runIds` | no |
| `src/bin/sync-data.ts` | modify | 从配置传 profiles 与白名单 | no |
| `config/pelican.example.yaml` | modify | `dataRepo.publishPrompts` 说明 | no |
| `test/core/sync/export-profile.test.ts` | modify | 登记的 profile 放行并带 `profiles`；未登记的仍扣下；key 不进记录 | no |
| `test/core/sync/export-prompts.test.ts` | add | 白名单剔除与整轮跳过 | no |
| `test/core/sync/data-repo-status.test.ts` | modify | `pendingRuns` | no |
| `test/core/config-data-repo.test.ts` | modify | `publishPrompts` 解析 | no |
| `test/core/sync/orchestrator-profile-guard.test.ts` | add | 同步指纹拦下作品里的 profile key；不传 profiles 时行为与此前相同 | no |
| `test/core/sync/runner-hook.test.ts` | modify | 配置夹具补 `publishPrompts` | no |
| `test/core/data-source/remote-profiles.test.ts` | add | `knownProfiles` 汇总 | no |
| `test/app/api/data-repo-sync-request.test.ts` | add | `runIds` 解析 | no |
| `test/app/config/use-data-repo-actions.test.ts` | modify | 请求体带 `runIds` | no |
| `test/app/config/data-repo-pending-list.test.ts` | add | 清单渲染与勾选 | no |
| `docs/architecture/architecture.md` | modify | §1 同步一句、§3 数据仓契约、§4 profile 数据边界 | no |

**数据仓仓库（同级目录 llm-iq-data，另一个 git 仓库，单独 commit）**：`schemas/public-run.schema.json` 与 `scripts/lib/schema-validators.mjs` 让 attempt 允许 `profile`、顶层可选 `profiles`（元素只允许八个公开字段）；`tests/` 覆盖 profile 记录；`README.md` 字段表补两处。

**不动的东西**：

- `data/runs/` 下各轮次的本地产物格式（run.json、progress.json）与 `sync-state.json` 台账格式。
- 数据仓只追加的规则：已导出的轮次目录不改写，此前扣下的 profile 调用不回填。
- `UNPUBLISHABLE_PROMPT_IDS` 的双端强制与 `leijun-v1` 清单。
- profile 的 key 存放（secrets 目录下 profiles 子目录按 CLI 与名字分文件）与 `ProfileView` 八字段白名单：baseUrl、queryParams、key 状态仍不进任何公开面。

## 兼容与回归

**兼容策略**：直接替换 —— 契约只增可选字段，旧记录与旧展台不受影响；`SyncOptions` 新参数缺省时行为与现在逐字相同。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | pass | c22481b | 变更前 3325158 |
| `pnpm test` | node:test 全量 | pass | pass | c22481b | 变更前 3325158 761 项，变更后 775 项 |
| `pnpm check:length` | 文件与函数长度门禁 | pass | pass | c22481b | 变更前 3325158 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | c22481b | 变更前 6bde09e |
| `pnpm showcase:smoke` | 只读展台与远程数据源 | pass | pass | c22481b | 变更前在 3325158 的临时 worktree 跑；13 项断言全过 |
| `pnpm --dir ../llm-iq-data test && pnpm --dir ../llm-iq-data validate` | 数据仓校验器与 schema 单测，全量校验 runs/ | pass | pass | c22481b | 变更前 22 项（a918cf5 之前），变更后 24 项（数据仓 commit a918cf5） |
| `pnpm sync:data --dry-run` | 对本机全部轮次演练导出：profile 轮次放行、白名单剔除、零写入 | pass | pass | c22481b | 变更前（3325158 临时 worktree）可导出 11 轮、冲突 0；变更后 75 轮候选：可导出 20、幂等 53、未完成 2、空 1、冲突 0，多出的 9 轮即含 profile 调用的轮次，20260929T150913Z 在内 |
| `PELICAN_CONFIG=data/profile-smoke.config.yaml pnpm run:once` | 端到端冒烟：3 个 profile 同轮并行（动态鹈鹕车） | pass | pass | c22481b | 变更前轮次 20260929T150913Z；变更只在同步与展示层，以该轮次产物演练导出并在配置页面板勾选后演练核对 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 契约与数据仓：`contract.ts` 增字段；数据仓 schema、校验器、README 与测试（数据仓单独一个 commit） | revert 本 commit；数据仓 revert 对应 commit |
| 2 | 同步放行 profile 与题目白名单：export-run、orchestrator 指纹、config 解析、CLI / post-sync / runner / 路由传参 | revert 本 commit |
| 3 | 面板勾选：状态 `pendingRuns`、请求体 `runIds`、清单组件 | revert 本 commit |
| 4 | 展台：远程数据源 `knownProfiles`、页面取用；`pnpm showcase:smoke` | revert 本 commit |
| 5 | 本单登记与 architecture.md 回填（docs） | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；数据仓 CI 拒收新记录；展台读取报错。
- 步骤：按步 revert；已推送到数据仓的记录只追加不改写，若含 profile 的记录必须撤回，在数据仓以新 commit 删除该轮目录并重建索引（`pnpm --dir ../llm-iq-data build-index`）。
- 数据：本地台账 `sync-state.json` 不需迁移；白名单只在导出时生效。

## 人工确认

### 方案摘要

1. 要动什么：数据仓契约增 `attempt.profile` 与 `run.profiles`（八个公开字段，按导出时配置快照）；同步放行登记在配置里的 profile 调用，泄漏指纹纳入全部 profile key；`dataRepo.publishPrompts` 题目白名单；配置页列出待导出轮次逐个勾选；展台从记录里取 profile 视图。涉及 src/core、src/app、src/bin 3 个模块与数据仓仓库。
2. 不动什么：本地产物格式、台账格式、只追加规则、永不发布题目清单、key 的存放与八字段白名单。
3. 为什么现在：多 profile 轮次已在本地产出，用户要发布并选题；容器 `autoSync: true` 与"勾选后导出"冲突，改为 false。
4. 风险与回滚：契约不升版，旧展台照常读；最坏情况数据仓 CI 拒收或展台报错，按步 revert，已发布记录需撤回时在数据仓新 commit 删目录重建索引。
5. 成本：5 步各一个 commit，无新依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-30 | luojin | approved | 对话中确认三项决策（profile 字段按运行时配置照发；白名单与面板勾选都要；autoSync 由代理在容器里核实）后批准开工 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §4 | 数据仓：attempt.profile 与 run.profiles（只增可选字段不升版）、题目白名单、面板勾选 | 已回填 |
| architecture.md §6 | 安全边界：profile 调用发布时只带八字段视图；同步指纹含 profile key | 已回填 |
| architecture.md §8 | Docker 同步：autoSync 关闭时在面板勾选后导出 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-018 | 已回填 |
| ADR（/adr-curator） | 不适用：非难逆转 | 不适用 |
