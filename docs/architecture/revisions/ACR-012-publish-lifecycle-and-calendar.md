# ACR-012: 不可发布轮次的台账状态与展台日历计数（Ledger states for unpublishable runs and showcase calendar counts）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-27 |
| 变更类型 | new-module |
| 触发来源 | 口头：阶段审查发现不可发布轮次永不修剪、面板误报待导出，展台日历请求量随天数增长 |
| 基线 | ARCH-001 |
| 影响章节 | §4 |
| 改造面上限 | 5 个模块（源码 3 个：src/core、src/app、src/bin——执行器与调度器入口各加一行启动收尾调用；test/core 与 test/app 只新增测试，不改既有断言） |
| 取代 / 被取代 | 无 |

## 动机

- 现状一：台账只有 `exported` / `published` 两态。只含不可发布题目的轮次、被泄漏扫描拒绝的轮次、长期停在
  `inProgress` 或缺少 `run.json` 的残轮永远不会变成 `published`，修剪守卫永远保留它们；ACR-010 面板把只含
  不可发布题目的轮次计为"待导出"，与预演结果"导出 0 轮"矛盾。
- 现状二：远程数据源为日历计数逐日拉取全部日索引（`listRunStarts`），请求数随数据仓天数线性增长；清单
  `index.json` 的 `days[].runs` 已含每天的轮次数，但按 UTC 日分区，访客时区下的日历计数需要轮次时刻。
- 不动的代价：本地热区随时间积累无法清理的目录；面板状态误导发布判断；展台上线半年后每次渲染上百个请求。
- 为什么现在：本地保留期已缩到 7 天，容器已是生产执行器，这两处会在一周内开始产生可见影响。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| lowdb 作为台账存储并扩展状态 | npm:lowdb | 7.0.1 | MIT | 2023-12-26 | unmaintained | 1 个模块（src/core） | 中：替换现有原子写实现 | reject | 维护成本：最近发布 2023-12-26（unmaintained），台账只是一个 JSON 文件，现有原子读写已满足 |
| 自研：台账增加 `skipped` 状态与原因，修剪按状态分级；日历计数改用日索引的聚合缓存 | self | - | - | - | - | 2 个模块（src/core、src/app） | 低：在现有台账与数据源上扩展 | adopt | - |

> **结论**：自研 —— 台账状态与修剪规则是本项目领域逻辑，扩展现有模块即可。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| src/core/sync/sync-ledger.ts | modify | `SyncStatus` 增加 `skipped`，记录 `reason`（`unpublishable-prompt` / `rejected` / `abandoned` / `empty`）与 `skippedAt`；旧台账无该字段时兼容读取 | no |
| src/core/sync/ledger-skip.ts | add | 台账 skipped 记录写入辅助：已导出 / 已发布的记录不被覆盖 | no |
| src/core/sync/export-run.ts | modify | 一次调用都没完成的轮次跳过导出（`empty`） | yes |
| src/core/run/recover-interrupted.ts | add | 执行进程启动时收尾上次没跑完的轮次（按已停止收尾、保留已完成调用、自动导出），空目录删除 | yes |
| src/bin/runner.ts | modify | 启动时调用收尾 | yes |
| src/bin/scheduler.ts | modify | 启动时调用收尾 | yes |
| src/core/types.ts | modify | `cancelledAt` 语义扩展到重启收尾 | no |
| src/app/config/DataRepoCards.tsx | modify | 展示不可发布 / 被拒绝计数 | no |
| src/core/sync/sync-orchestrator.ts | modify | 非预演同步时，把 `unpublishable-prompt` 与 `rejected` 结果写入台账为 `skipped`；`rejected` 不自动清理，需人工处理 | yes |
| src/core/retention.ts | modify | 过期且 `skipped/unpublishable-prompt` 可删；过期超过保留期两倍仍 `inProgress` 或缺 `run.json` 的残轮标记 `abandoned` 后可删；`rejected` 永不自动删，汇总记日志 | yes |
| src/core/sync/data-repo-status.ts | modify | `pending` 排除 `skipped`；新增 `skipped` 计数与 `rejected` 清单 | yes |
| src/core/sync/data-repo-panel-types.ts | modify | `ledger` 增加 `skipped` 计数；`local` 增加 `rejected` 清单 | no |
| src/core/data-source/remote.ts | modify | `listRunStarts` 只拉取清单中最近 N 天（默认 62 天，覆盖两个月日历视窗）的日索引，更早的日期按清单 `days[].runs` 计数并以 UTC 日为准；拉取结果进请求级缓存 | yes |
| src/app/config/data-repo-panel-model.ts | modify | 面板展示"不可发布 N 轮""被拒绝 N 轮（需人工处理）" | yes |
| test/core/sync/ledger-skipped.test.ts | add | 新状态读写、旧台账兼容 | no |
| test/core/retention-skipped.test.ts | add | 各状态的修剪分级 | no |
| test/core/data-source/remote-calendar.test.ts | add | 请求数上界、远期按清单计数、近期按时刻计数 | no |
| test/app/config/data-repo-panel-skipped.test.ts | add | 面板计数与文案 | no |
| docs/data-sync-architecture.md | modify | 台账状态表、修剪分级；修正拓扑图只读变量名、时序图修剪时机、§3.4 拉取方式与刷新延迟（GitHub Raw 5 分钟缓存） | no |

**不动的东西**：

- 数据仓契约与 `UNPUBLISHABLE_PROMPT_IDS` 的剔除规则
- `published` 轮次的修剪条件
- 只读展台的安全边界与 `/art` 缓存策略

## 兼容与回归

**兼容策略**：适配层 —— 台账读取对缺少 `reason` 的旧记录按原两态处理；新状态只在后续同步时写入。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | ad3a5ce | |
| `pnpm test` | 单元与集成测试 | pass | pass | ad3a5ce | 变更前 569 项，变更后 686 项 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | ad3a5ce | |
| `pnpm showcase:smoke` | 端到端冒烟：远程日历与首页渲染 | pass | pass | ad3a5ce | |
| `pnpm check:length` | 文件与函数长度门禁 | pass | pass | ad3a5ce | |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 台账 `skipped` 状态、同步写入、修剪分级，附单测 | revert 本 commit |
| 2 | 面板状态与计数 | revert 本 commit |
| 3 | 远程日历拉取上界与缓存 | revert 本 commit |
| 4 | 文档修正 | revert 本 commit |

## 回滚方案

- 触发条件：修剪删除了 `rejected` 或未过期轮次；日历计数与清单不一致；回归 fail。
- 步骤：按分步倒序 revert；第 1 步回滚后台账中的 `skipped` 记录被旧代码视为未发布，只会少删不会多删。
- 数据：无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：台账新增"已跳过"状态并据此分级修剪，面板区分不可发布与被拒绝，展台日历限制拉取范围；涉及 src/core、src/app 2 个源码模块，另加测试。
2. 不动什么：数据仓契约、`UNPUBLISHABLE_PROMPT_IDS` 剔除、已发布轮次的修剪条件、只读边界。
3. 为什么现在：保留期已缩到 7 天，残轮与不可发布轮次一周内会开始积累；展台已上线。
4. 风险与回滚：被拒绝轮次永不自动删；回滚后旧代码只会少删；按 4 步 revert。
5. 成本：4 步，无新增依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-27 | xumetide-dev | approved | 实施前先从题库移除以真人为主体的测试题及其本地结果（bbcc3ea） |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §4 | 台账三态与修剪分级；远程日历拉取范围 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-012 | 已回填 |
| ADR（/adr-curator） | 不适用：按步 revert 即恢复，非难逆转 | 已回填 |
