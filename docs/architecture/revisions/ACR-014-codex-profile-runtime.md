# ACR-014: codex 多 profile：按 profile 隔离的 app-server 运行时（Codex Profiles: Per-Profile Isolated App-Server Runtime）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-29 |
| 变更类型 | structure-change |
| 触发来源 | 口头：同时对比不同上游的 IQ；设计见 docs/profiles/codex-profiles-design.md §2 §4 §6，前置 ACR-013 |
| 基线 | ARCH-001 |
| 影响章节 | §3 §5 §6 |
| 改造面上限 | 4 个模块（测试目录与源模块同构：src/adapters、src/core 各带一个 test 目录） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：ACR-013 之后可以在配置页登记 codex profile、填 API key、同步模型，但会话池按 CLI 建，一轮只起
  一个继承 `~/.codex` 登录态的 app-server；非默认 profile 的调用在 `admit` 被一律拦下。
- 不动的代价：profile 只能配置不能运行，多上游对比无从谈起；若简单放开拦截，调用会错拿登录态，
  结果记在 profile 名下，数据失真。
- 为什么现在：用户已在配置页登记了第一个第三方上游并填好 key、同步了模型，等待实测。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 每个 profile 一个 `codex app-server` 进程：独立临时 `CODEX_HOME` 与 `HOME`，生成的 `config.toml` 以 `model_providers` 指向上游，`env_key` 从该进程环境读 key | npm:@openai/codex | 0.159.0 | Apache-2.0 | 2026-09-29 | active | 2 个模块（src/adapters 启动参数与环境、src/core 分道与会话池键） | 低：只用 codex 公开配置项与环境变量，长驻 app-server 路线不变 | adopt | - |
| 共用一个 app-server，按线程在 `thread/start` 传 `modelProvider` 与 `config` 切上游 | npm:@openai/codex | 0.159.0 | Apache-2.0 | 2026-09-29 | active | 1 个模块 | 高：登录态、`model/list`、sqlite 与模型缓存都是进程级，所有 profile 的 key 须注入同一进程环境、彼此可见，隔离不成立 | reject | 维护成本：进程级共享使 profile 之间凭据互相可见，一个上游故障拖垮同进程全部线程 |
| 每次调用起 `codex exec --profile`，读 `$CODEX_HOME/NAME.config.toml` | npm:@openai/codex | 0.159.0 | Apache-2.0 | 2026-09-29 | active | 2 个模块 | 高：`exec` 并发时各自刷新模型目录并卡死至超时（见 codex-app-server.ts 注释），正是改用 app-server 的原因 | reject | 维护成本：回到已知会卡死的调用方式 |

> **结论**：每 profile 一个 app-server 进程、一个临时 home、一份只含该 profile key 的环境 —— 隔离边界
> 落在操作系统进程上，profile 之间没有共享状态。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/adapters/types.ts` | modify | `ProfileLaunch`（名字、接口地址、查询参数、key）；`openSession(profile?)` | no |
| `src/adapters/exec.ts` | modify | `spawnDetached` 接受额外环境变量，缺省与现在相同 | no |
| `src/adapters/codex-profile-home.ts` | add | 为 profile 建临时 `CODEX_HOME`（同时作 `HOME`），写 `config.toml`：`model_provider`、`[model_providers.pelican]`（`base_url`、`env_key`、`wire_api = "responses"`、`query_params`）、`[history] persistence = "none"`；会话结束删除目录 | no |
| `src/adapters/codex-app-server.ts` | modify | `start(launch?)`：有 profile 时带 home 与 key 环境启动，关闭时清理 home | no |
| `src/adapters/codex.ts` | modify | `openSession(profile?)` 把 profile 交给 `CodexAppServer.start` | no |
| `src/adapters/index.ts` | modify | 会话池键改为 `cli::profile`，`sessionFor(cli, profile?)` 取对应 `ProfileLaunch` | no |
| `src/core/run-plan.ts` | modify | 分道键改为 `cli::profile::model`；`laneIdentity` 带 profile | no |
| `src/core/progress.ts` | modify | `LaneProgress.profile?`，默认 profile 不写 | no |
| `src/core/run/execute-lanes.ts` | modify | 先按 profile 分组、组间并行上限 `run.profileConcurrency`，组内仍按 `run.concurrency` 分道并行 | no |
| `src/core/run-attempt.ts` | modify | `sessionFor(target.cli, target.profile)` | no |
| `src/core/runner.ts` | modify | 开轮时为用到的 profile 读 key 组 `ProfileLaunch`；缺 key 或 profile 已停用的调用记 error 且不发起；去掉 ACR-013 的一律拦截；凭据指纹纳入 profile key | yes |
| `src/core/leak-guard.ts` | modify | 实施时未改：`runner.ts` 把 profile key 文件与 `credentialFiles()` 一并交给 `buildLeakGuard` | no |
| `src/core/config/types.ts` | modify | `RunConfig.profileConcurrency` | no |
| `src/core/config/loader.ts` | modify | 解析 `run.profileConcurrency`，缺省 5，须 ≥ 1 | no |
| `src/core/config-writer.ts` | modify | `ConfigPatch.run.profileConcurrency` | no |
| `src/core/run-selection.ts` | modify | 定时轮次与"跑一次"都剔除已停用 profile 的目标 | no |
| `src/core/sync/export-run.ts` | modify | 非默认 profile 的调用不导出到公开数据仓（契约尚无该字段，剔掉字段会把第三方结果冒充登录态），条数记在导出结果 `withheldProfileAttempts`；全是 profile 调用的轮次按空轮次跳过 | no |
| `config/pelican.example.yaml` | modify | 注释说明 `run.profileConcurrency` | no |
| `test/adapters/codex-profile-home.test.ts` | add | 生成的 `config.toml` 内容、home 隔离与清理、key 不落盘 | no |
| `test/core/run-plan-profile.test.ts` | add | 分道键含 profile、profile 分组并行上限 | no |
| `test/core/sync/export-profile.test.ts` | add | profile 调用不进导出 | no |
| `test/core/run-selection.test.ts` | modify | 停用 profile 的目标被剔除 | no |
| `test/core/config-profiles.test.ts` | modify | `profileConcurrency` 缺省与校验 | no |
| `test/core/run/recover-interrupted.test.ts` | modify | 手写的 `RunConfig` 夹具补 `profileConcurrency`（实施中补登，模块数不变） | no |
| `test/core/sync/data-repo-status.test.ts` | modify | 手写的 `RunConfig` 夹具补 `profileConcurrency`（实施中补登，模块数不变） | no |
| `test/core/sync/runner-hook.test.ts` | modify | 手写的 `RunConfig` 夹具补 `profileConcurrency`（实施中补登，模块数不变） | no |

**不动的东西**：

- 默认 profile 的调用链：仍是一个继承登录卷的 app-server，参数与环境逐字不变。
- `src/app` 配置页：`profileConcurrency` 的输入框与跑一次菜单的 profile 分组留给看板变更单；本单
  只能在 YAML 里改。
- 公开数据仓契约 `src/core/data-repo/contract.ts` 与数据仓 schema：profile 字段与元信息的发布留给
  凭据与计价变更单。
- 计价：profile 调用暂按官价折算"API 等价成本"，倍率折算留给凭据与计价变更单。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 默认 profile 走原路径；只有目标写了 `profile` 才进入新路径，
不写即与改造前完全相同。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | pass | bd14e0d | 7a223ed |
| `pnpm test` | node:test 全量 | pass | pass | bd14e0d | 变更前 7a223ed 708 项；变更后 722 项 |
| `pnpm check:length` | 文件与函数长度门禁 | pass | pass | bd14e0d | 7a223ed |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | bd14e0d | 变更后以 `NEXT_DIST_DIR` 输出到临时目录，避开运行中的开发服务器 |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：默认 profile 调用链不变 | pass | skip | bd14e0d | 所有者已停 ChatGPT 订阅并要求不跑登录态：轮次 20260929T135650Z 的登录态 codex 调用得 404（模型不可用）。默认 profile 的启动参数与环境逐字未改，会话池单测覆盖不传 profile 即登录态会话 |
| `PELICAN_CONFIG=data/profile-smoke.config.yaml pnpm run:once` | 端到端冒烟：3 个 profile 同轮并行（gpt-5.5 × low × animated-pelican-v1），经第三方上游完成 | skip | pass | bd14e0d | 轮次 20260929T140327Z 3/3 ok，三个调用同时开始；临时 home 已删、无残留进程、产物不含 key。配置由本机 profile 生成、放在不入库的 data/ |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 适配器：`exec.ts` 环境参数、`codex-profile-home.ts`、`codex-app-server.ts`、`codex.ts`、`types.ts`、`index.ts` 与适配器测试 | revert 本 commit |
| 2 | 配置：`profileConcurrency` 解析与写回、`run-selection` 剔除停用 profile、示例 YAML | revert 本 commit |
| 3 | 编排：分道键、profile 分组并行、`run-attempt` 取会话、`runner` 组 `ProfileLaunch` 与去掉拦截、`leak-guard`、`progress` | revert 本 commit |
| 4 | 导出：`export-run` 剔除 profile 调用 | revert 本 commit |
| 5 | 本单登记与 architecture.md 回填（docs） | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；登录态轮次出现新的 error；profile 调用出现用错凭据或串上游的迹象。
- 步骤：按步逆序 revert 代码 commit；revert 第 3 步即恢复 ACR-013 的一律拦截，profile 配置保留可用。
- 数据：已产生的带 `profile` 字段的 `run.json` 留在本机，第 4 步保证它们从未进入公开数据仓。

## 人工确认

### 方案摘要

1. 要动什么：每个 codex profile 起一个独立 app-server 进程（临时 `CODEX_HOME`、只含该 profile key 的环境、生成的 `config.toml`），分道与会话池按 profile 分开，profile 之间并行上限 `run.profileConcurrency`（缺省 5）；涉及 src/adapters、src/core 及其测试 4 个模块。
2. 不动什么：登录态调用链逐字不变；配置页、数据仓契约与计价留给后续变更单。
3. 为什么现在：第一个第三方上游已配置好 key 与模型，等待实测。
4. 风险与回滚：最坏是 profile 调用串用凭据——进程与目录隔离使其不可能共享；profile 结果在契约落地前不导出；回滚 = 逆序 revert 4 个代码 commit。
5. 成本：5 步 5 个 commit；冒烟会消耗第三方上游与登录态各一轮额度。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-29 | luojin | approved | profile 冒烟用 gpt-5.5 × low，1 道题，与登录态 codex 目标同轮 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §3 | 非默认 profile 由独立 app-server 进程执行，去掉"放行前被拦下" | 已回填 |
| architecture.md §5 | 配置项增 `run.profileConcurrency` | 已回填 |
| architecture.md §6 | 凭据指纹纳入 profile key；profile 结果在契约落地前不发布 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-014 | 已回填 |
| ADR（/adr-curator） | 不适用：隔离只在 src/adapters 的会话池与启动参数内，逆转成本低；否决方案与理由已记在本单「方案评估」 | 已回填 |
