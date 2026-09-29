# ACR-013: codex 多 profile：配置模型与目标标识（Codex Profiles: Config Model and Target Identity）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-29 |
| 变更类型 | structure-change |
| 触发来源 | 口头：同时对比不同上游的 IQ；设计见 docs/profiles/codex-profiles-design.md §3 |
| 基线 | ARCH-001 |
| 影响章节 | §3 §5 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：目标身份只有 `cli × model × effort`；每家 CLI 只有一个隐式上游，即登录态。配置、
  写回、目标 id、运行记录都没有"上游"这一维，同一模型经不同第三方上游的成绩无法并列。
- 不动的代价：要对比上游只能改 `~/.codex` 后重跑，结果混在同一格里，历史不可比。
- 为什么现在：用户要在看板上为 codex 建多个 profile、一轮多选并行对比。设计文档已把领域模型
  定稿（`docs/profiles/codex-profiles-design.md` §3、§3.1），后续运行时（ACR-014）、凭据与
  计价、看板三张变更单都以本单的配置模型为前提。本单只落配置层，运行时对非默认 profile 的
  调用一律拦下，不会错拿登录态调用并记在 profile 名下。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 复用 codex 自己的 profile 机制：`$CODEX_HOME/NAME.config.toml` + `--profile`，本项目只在目标上记名字 | npm:@openai/codex | 0.159.0 | Apache-2.0 | 2026-09-29 | active | 2 个模块（src/adapters 改调用方式、src/core 目标字段） | 高：`app-server` 子命令不接受 `--profile`（0.158 实测），要退回每次调用起 `codex exec` 进程，与 ACR-006 之后的长驻 app-server 路线相反；凭据、模型清单、倍率仍无处登记 | reject | 改造面：要改 codex 调用方式并放弃长驻 app-server；维护成本：profile 机制 0.134 刚废弃过一版旧格式，接口不稳 |
| 在本项目配置里登记 profile（名字、上游类型、地址、模型、倍率、启停），目标加 `profile` 字段，id 追加一段 | self | - | - | - | - | 2 个模块（src/core、src/app 一行） | 低：只是配置解析与写回的一节，沿用现有 `reconcileSequence` 与校验聚合 | adopt | - |

> **结论**：自研配置模型 —— codex 侧的 profile 机制解决不了本项目要登记的上游元信息、倍率与
> 凭据落位，且与 app-server 不兼容；本单只定义配置与标识，CLI 侧隔离留给 ACR-014。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/types.ts` | modify | `DEFAULT_PROFILE` 常量；`buildTargetId` 第四参数 `profile`，非默认追加 `__` 加 profile 名一段；`Target.profile?`、`Attempt.profile?` | no |
| `src/core/config/types.ts` | modify | `ProfileConfig`、`ProfilePricing`、`DEFAULT_UPSTREAM_TYPES`；`AppConfig` 增 `upstreamTypes`、`profiles` | no |
| `src/core/config/profiles.ts` | add | `parseUpstreamTypes`、`parseProfiles`、`profileExists`；名字 kebab-case、`default` 保留、首期只允许 codex、`baseUrl` https、`models` 非空、倍率 > 0、`enabled` 布尔 | no |
| `src/core/config/targets.ts` | modify | 解析 `targets[].profile`，校验引用存在；id 与默认 label 带 profile | no |
| `src/core/config/loader.ts` | modify | `RawConfig` 增两键；先解析 `upstreamTypes`、`profiles` 再解析 `targets` | no |
| `src/core/config.ts` | modify | 导出 profile 相关类型与常量 | no |
| `src/core/config-writer.ts` | modify | `ConfigPatch` 增 `upstreamTypes`、`profiles`；目标节点身份加 profile；`profile` 只在非默认时写出，`managedKeys` 加 `profile` | no |
| `src/core/run-attempt.ts` | modify | `buildAttempt` 在非默认 profile 时写 `Attempt.profile` | no |
| `src/core/runner.ts` | modify | `admit` 对非默认 profile 的目标返回 `fail`：运行时尚未实现 | no |
| `src/app/config/target-table-model.ts` | modify | `withIdentity` 把 `profile` 传给 `buildTargetId` | no |
| `config/pelican.example.yaml` | modify | 注释说明 `upstreamTypes` / `profiles` / `targets[].profile` | no |
| `test/core/config-profiles.test.ts` | add | 解析、每类校验错误、写回节点认领与默认 profile 不写出 | no |
| `test/core/run-characterization.test.ts` | modify | `buildAttempt` 非默认 profile 写 `profile` 字段、默认不写 | no |
| `test/core/run/recover-interrupted.test.ts` | modify | `AppConfig` 字面量补 `upstreamTypes`、`profiles` | no |
| `test/core/sync/data-repo-status.test.ts` | modify | 同上 | no |
| `test/core/sync/runner-hook.test.ts` | modify | 同上 | no |
| `docs/profiles/codex-profiles-design.md` | add | 设计文档：领域模型、隔离事实、分期 | no |

**不动的东西**：

- 默认 profile 的目标 id、显示名、`run.json` 与 `progress.json` 字段：不写 `profile` 的配置
  解析结果与改造前逐字相同，历史产物、成本历史、数据仓记录不受影响。
- `src/adapters`、`src/capabilities`、`src/pricing`、`compose.yaml`：CLI 调用、探测、计价与
  容器编排在本单不动，非默认 profile 的调用由 `admit` 拦下。
- `src/core/data-repo/contract.ts` 与导出逻辑：`Attempt.profile` 现阶段不会产生（调用被拦），
  导出白名单在凭据与计价单处理。

## 兼容与回归

**兼容策略**：直接替换 —— 新字段全部可选且缺省即旧语义，旧配置文件不改一字即通过校验；
非默认 profile 在本单只能配置、不能运行。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | pass | 7b867ea | |
| `pnpm test` | node:test 全量；新增 `test/core/config-profiles.test.ts` | pass | pass | 7b867ea | |
| `pnpm check:length` | 文件与函数长度门禁 | pass | pass | 7b867ea | |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | 7b867ea | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：默认 profile 的调用链不变 | skip | pass | 7b867ea | 轮次 20260929T125959Z：10 次调用 8 ok；codex gpt-6-astra 两次 error 为上游拒绝（该模型不对 ChatGPT 账号开放，HTTP 400），与本单无关，正是 profile 要解决的场景 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 配置层：`types.ts`、`config/*`、`config.ts`、`config-writer.ts`、示例 YAML、`config-profiles.test.ts` 与三处 `AppConfig` 字面量（解析与写回同一 commit，测试文件同时覆盖两者） | revert 本 commit |
| 2 | 记录与守门：`run-attempt.ts` 写 `Attempt.profile`，`runner.ts` 拦下非默认 profile，`target-table-model.ts` 传 profile，`run-characterization.test.ts` | revert 本 commit |
| 3 | 设计文档与本单登记（docs） | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；或旧配置文件在新版校验下报错。
- 步骤：按步逆序 revert 两个代码 commit；配置文件里若已写入 `profiles` / `upstreamTypes` /
  `targets[].profile`，旧版加载器会因 `targets[].profile` 是未知键而忽略、`profiles` 顶层键
  同样忽略，无需手工改文件。
- 数据：无需迁移。本单不会产生带 `profile` 的 `run.json`。

## 人工确认

### 方案摘要

1. 要动什么：配置层加 profile 维度——`upstreamTypes` 清单、`profiles[]`（名字、cli、上游类型、分组、官网、`baseUrl`、`queryParams`、`models`、倍率与手填单价、启停）、`targets[].profile`；目标 id 非默认时追加第四段。涉及 src/core、src/app（一行）、test/core 3 个模块。
2. 不动什么：适配器、探测、计价、容器编排；默认 profile 的 id、显示名与记录格式逐字不变。
3. 为什么现在：多上游对比的设计已定稿，运行时、凭据与计价、看板三张单都以本单的模型为前提。
4. 风险与回滚：非默认 profile 在本单被 `admit` 拦下，不会错拿登录态；回滚 = revert 2 个代码 commit，无数据迁移。
5. 成本：配置层代码已在工作区完成并通过 `pnpm lint`、相关测试；3 步 3 个 commit。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-29 | luojin | approved | 变更后回归含端到端冒烟（登录态链路，不需配置 profile） |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §3 | 目标身份增补"× profile（缺省为登录态）"，编排一句注明非默认 profile 的运行时见 ACR-014 | 已回填 |
| architecture.md §5 | 配置项列表增 `upstreamTypes`、`profiles`、`targets[].profile` | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-013 | 已回填 |
| ADR（/adr-curator） | 不适用：配置层可整体 revert，非难逆转；难逆转的取舍（每 profile 一个 CODEX_HOME）在 ACR-014 | 不适用 |
