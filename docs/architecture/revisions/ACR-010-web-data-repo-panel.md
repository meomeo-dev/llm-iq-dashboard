# ACR-010: 所有者看板内的数据仓同步面板（Data repository sync panel in the owner dashboard）

| 项 | 内容 |
|---|---|
| 状态 | approved |
| 日期 | 2026-09-27 |
| 变更类型 | new-module |
| 触发来源 | 口头：所有者希望在网页上完成数据仓同步，并查看数据健康与同步状态，不再手输 CLI |
| 基线 | ARCH-001 |
| 影响章节 | §2 §4 §6 |
| 改造面上限 | 5 个模块（源码 3 个：src/core、src/app、src/bin；test/core 与 test/app 只新增测试，不改既有断言） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：数据仓同步（ACR-009）只有 `pnpm sync:data` 一个入口；导出、发布确认、推送与台账状态
  都要在终端操作和阅读；看板 `/config` 页看不到数据仓是否连通、有多少轮次待同步、
  哪些轮次被泄漏扫描拦下。
- 不动的代价：宿主机 `autoSync` 已开启后，每轮结束都会产生本地提交，但推送与发布确认仍靠
  记得去敲命令；容器部署下执行器导出的轮次更没有可视化的核对入口，发布前的人工核验
  没有落脚点。
- 为什么现在：ACR-009 的流水线与冷热分层已稳定（55 轮已发布、修剪守卫生效），下一步是把
  "人工确认后发布"这条纪律做成看板上的一次显式确认，而不是靠终端。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| simple-git 提供仓库状态与 ahead/behind 查询 | npm:simple-git | 4.0.2 | MIT | 2026-09-26 | active | 1 个模块（src/core） | 低：社区维护，新增一项运行时依赖 | reject | 改造面：状态只需 `status --porcelain`、`rev-list --left-right --count`、`fetch` 三条命令，沿用 ACR-009 的 `data-repo-git.ts` execFile 封装同样只动 src/core 1 个模块，引入依赖不减少改造面 |
| bullmq 作为看板与执行器之间的任务队列 | npm:bullmq | 6.3.9 | MIT | 2026-09-25 | active | 3 个模块（src/core、src/app、src/bin）+ 新增 Redis 进程 | 高：需要 Redis 服务与连接配置，容器拓扑加一个组件 | reject | 维护成本：ACR-008 已有基于 `data/requests/` 的文件请求通道，新增 Redis 只为一种请求类型，部署与凭据面都变大 |
| 自研：复用 `data/requests/` 请求通道与 `src/core/sync` 编排，新增状态聚合与两条所有者接口 | self | - | - | - | - | 3 个模块（src/core、src/app、src/bin） | 低：全部沿用现有模块与命令封装 | adopt | - |

> **结论**：自研 —— 同步逻辑与 git 封装已在 ACR-009 落地，看板只需新增状态聚合、请求类型与页面，不引入新依赖。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| src/core/sync/data-repo-status.ts | add | 聚合数据仓状态：配置是否存在、路径可达、工作区是否干净、上游与 ahead/behind、清单 totalRuns、台账 exported/published 计数、本地待同步与被拦截轮次、最近一次同步时刻 | no |
| src/core/sync/data-repo-git.ts | modify | 新增只读查询：ahead/behind 计数、工作区状态摘要 | no |
| src/core/requests.ts | modify | 新增请求类型 `sync-data`（模式 dry-run / export / confirm / push）与结果结构 | no |
| src/bin/runner.ts | modify | 执行器认领 `sync-data` 请求，调用 `syncDataRepo` / `confirmPublished` 并写回报告 | no |
| src/app/api/data-repo/route.ts | add | `GET`：所有者会话下返回聚合状态；只读部署 403 | no |
| src/app/api/data-repo/sync/route.ts | add | `POST`：所有者动作，按部署形态就地执行或经请求通道交给执行器；`push` 模式要求请求体携带面板生成的确认令牌与轮次清单摘要；容器部署下 `push` 返回 409 并说明改在宿主机推送 | no |
| src/app/config/DataRepoPanel.tsx | add | `/config` 页新增「数据仓」区块：状态卡片、被拦截轮次列表、四个动作按钮；推送前弹出确认框列出将公开的轮次 | no |
| src/app/config/data-repo-panel-model.ts | add | 面板的状态归约、确认令牌与展示文案纯函数 | no |
| src/app/config/use-data-repo-actions.ts | add | 调用同步接口并轮询结果的 hook | no |
| src/app/config/page.tsx | modify | 装载数据仓状态并渲染面板 | no |
| test/core/sync/data-repo-status.test.ts | add | 状态聚合单测 | no |
| test/app/api/data-repo.test.ts | add | 接口守卫：所有者、只读 403、容器下 push 409 | no |
| test/app/config/data-repo-panel.test.ts | add | 面板渲染特征测试 | no |
| docs/data-sync-architecture.md | modify | 补充网页入口与容器下推送限制 | no |
| docs/deploy-docker.md | modify | 容器部署下面板可用动作 | no |
| handoff.md | modify | 运维操作改为面板优先、CLI 备用 | no |

**不动的东西**：

- `src/core/sync/sync-orchestrator.ts` 的导出、脱敏、台账与推送语义，以及 `UNPUBLISHABLE_PROMPT_IDS` 的剔除
- `pnpm sync:data` 命令的参数与退出码
- 只读展台（`PELICAN_READONLY=1`）：新接口一律 403，面板不渲染
- 所有者配对与会话机制（ACR-007）

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 面板与接口只在配置含 `dataRepo` 且非只读部署时启用；
`pnpm sync:data` 继续可用，两者共用同一编排与台账，不会各自记账。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | - | | |
| `pnpm test` | 单元与集成测试 | pass | - | | 变更前 505 项 |
| `pnpm build` | Next.js 看板生产构建 | pass | - | | |
| `pnpm showcase:smoke` | 端到端冒烟：只读远程模式下新接口 403、面板不渲染 | pass | - | | 变更前尚无新接口断言 |
| `pnpm check:length` | 文件与函数长度门禁 | pass | - | | |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 状态聚合 `data-repo-status.ts` 与 git 只读查询，附单测 | revert 本 commit |
| 2 | 请求类型 `sync-data`、执行器认领处理、`GET /api/data-repo` 与 `POST /api/data-repo/sync` | revert 本 commit |
| 3 | `/config` 页数据仓面板、推送确认框、特征测试 | revert 本 commit |
| 4 | 冒烟断言与文档 | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；面板动作绕过确认直接推送；只读部署出现可写入口。
- 步骤：按分步实施表倒序 revert；先删第 3 步即可让页面回到现状，第 1、2 步保留也无副作用。
- 数据：无需迁移。面板与 CLI 共用台账文件，回滚后 `pnpm sync:data` 读到的状态一致。

## 人工确认

### 方案摘要

1. 要动什么：在 `/config` 页加「数据仓」面板与两条所有者接口，执行器新增一种请求类型；涉及 src/core、src/app、src/bin 3 个源码模块，另加测试。
2. 不动什么：同步流水线的脱敏与台账语义、`pnpm sync:data`、只读展台边界、配对登录。
3. 为什么现在：宿主机 autoSync 已开启，推送与发布确认需要一个带人工确认的可视化入口。
4. 风险与回滚：误推送由二次确认框与容器下禁推兜底；按步 revert，删第 3 步即恢复页面现状。
5. 成本：4 步，无新增运行时依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-27 | xumetide-dev | approved | 对话中确认方案摘要 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §2 §4 §6 | 看板与执行器的请求类型增加 sync-data；数据仓状态与动作的网页入口；推送须经面板二次确认，容器部署下不可推送 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-010 | 待回填 |
| ADR（/adr-curator） | 不适用：非难逆转，按步 revert 即恢复 | 待回填 |
