# ACR-024: 模型指纹核验模块（Model Fingerprint Verification Module）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-10-17 |
| 变更类型 | new-module |
| 触发来源 | 口头：核验第三方上游 profile 或默认登录态实际响应的模型是否与声明一致 |
| 基线 | ARCH-001 |
| 影响章节 | §1 §2 §3 §4 §5 §6 §7 |
| 改造面上限 | 8 个模块（src/core、src/adapters、src/bin、src/app、src/i18n 五个代码模块，以及对应的测试目录 test/core、test/app、test/i18n；config、docs 与根文件不计） |
| 取代 / 被取代 | 无 |

新增「模型指纹（Model Fingerprint）」核验模块（`src/core/model-fingerprint/`、命令行入口 `src/bin/model-fingerprint.ts`、所有权保护接口 `/api/fingerprint` 与 `/api/fingerprint/samples`、看板页面 `/fingerprint` 及配置页区块）：通过 6 个受控短提示词探针（`uuid`、`number`、`seed`、`palette`、`words-en`、`words-zh`）以零工具直出模式调用三家 CLI，提取字符与分段经验频率分布，用以 2 为底的 Jensen-Shannon 散度（JSD）与配对无重叠交叉验证判定指定 `profile` 的应答分布是否与声明模型一致。

## 动机

- 现状：看板支持为 `codex` 配置第三方上游 `profile` 并对比鹈鹕作品，但当某个上游作品表现异常或判「降智」时，无法区分是模型偶发失手还是上游将请求路由到了其他模型；同时缺少对官方 `default` 登录态输出分布偏移的量化基线。
- 不动的代价：只能靠人工肉眼看单件 SVG 猜测上游是否偷换模型，没有可复算、可离线交叉验证标定阈值的统计核验手段。
- 为什么现在：设计文档 `docs/research/model-fingerprint/model-fingerprint-design.md` 与实施计划 `model-fingerprint-implementation-plan.md` 已完成多轮审查定稿，需落地第 1 期（核心引擎 + 5 个 CLI 命令）与第 2 期（Web API + `/fingerprint` 看板 + `/config` 配置区块 + 双语国际化）。

## 方案评估

要的是：不引入任何外部 HTTP LLM SDK、完全复用本仓库现有的三家 CLI 适配器（`claude`、`codex`、`agy`），对短探针采样结果做多粒度离散分布相似度比较与留出法阈值标定。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| mathjs / simple-statistics：通用数学统计库 | npm:simple-statistics | 7.8.8 | ISC | 2024-04-29 | unmaintained | 5 个模块（仍需自写探针编解码、按 reqId 无重叠留出折、适配器隔离与看板 UI） | 中：最近发布 2024-04-29，unmaintained；且以 2 为底的离散 JSD 核心仅约 50 行，多一个运行时依赖无益 | reject | 维护成本：最近发布 2024-04-29，unmaintained，且以 2 为底的离散 JSD 核心仅 50 行，自研零新依赖 |
| 自研：`src/core/model-fingerprint/` 面向对象 `Probe` + `PromptCodec`、以 2 为底 JSD、配对无重叠自检与四态判决状态机，复用三家 CLI 适配器与文件锁存储 | self | - | - | - | - | 5 个代码模块（src/core、src/adapters、src/bin、src/app、src/i18n） | 低：纯 TypeScript 确定性计算与文件原子读写，零新增外部依赖，原始应答落盘后可随时离线重算 | adopt | - |

> **结论**：自研 —— 核心数学（以 2 为底的离散 JSD 与配对无重叠留出法）紧凑且完全确定，业务重点在于面向对象 `Probe`/`PromptCodec` 三级回退提取、三家 CLI 的零工具最小隔离环境以及与看板作业的双向互斥，自研零新依赖最稳妥。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/model-fingerprint/types.ts` | add | 领域类型定义（`ProbeId`、`ProbeAttempt`、`ProbeSampleSet`、`CheckRecord`、`SelfTestReport`、`FingerprintJobRecord` 等） | no |
| `src/core/model-fingerprint/probes/` | add | 面向对象 `Probe` 抽象基类、`PromptCodec` / `RegexPromptCodec` 与 6 个具体探针子类（`uuid`、`number`、`seed`、`palette`、`words-en`、`words-zh`） | no |
| `src/core/model-fingerprint/jsd.ts` | add | 以 2 为底的离散 Jensen-Shannon 散度、相似度与多粒度等权池化计算 | no |
| `src/core/model-fingerprint/self-test.ts` | add | 单次 `reqId` 贡献上限、等容量子参照、按 `reqId` 无重叠留出折、双边覆盖率阈值标定与单样本 `sampleSelfSim` | no |
| `src/core/model-fingerprint/score.ts` | add | 成对相似度差、四态互斥判决状态机（`not-comparable` / `inconsistent` / `consistent` / `inconclusive`）与 `closestCandidate` 全序决胜 | no |
| `src/core/model-fingerprint/plan.ts` | add | 补采缺口、状态汇总、核验探针分流与内存态样本剔除/恢复/重置模拟 | no |
| `src/core/model-fingerprint/job.ts` | add | 指纹作业记录读写、存活判定（含 `externalRunner` 心跳检查）与取消监听 | no |
| `src/core/model-fingerprint/store.ts` | add | 路径级互斥锁 `withProbeFileLock`、原子写盘、实时解码展平、`archive/` 重置归档与 `rescore` 历史回退重算 | no |
| `src/core/model-fingerprint/collect.ts` | add | 首请求串行缓存预热、`inFlight * valuesPerCall` 预占并发控制、凭据泄漏拦截 `leak-blocked` 与固定空工作区清理 | no |
| `src/core/active-work.ts` | add | `findActiveWork()` 统一聚合鹈鹕轮次（含 `isJudging`）与模型指纹作业，保持 `findActiveRun` 签名不变 | no |
| `src/core/config/model-fingerprint.ts` | add | `modelFingerprint` 配置段解析、默认值与边界校验 | no |
| `src/core/config/types.ts` | modify | `PelicanConfig` 新增 `modelFingerprint: ModelFingerprintConfig` | no |
| `src/core/config/loader.ts` | modify | 接入 `resolveModelFingerprintConfig` | no |
| `src/core/config.ts` | modify | 导出模型指纹配置类型与解析器 | no |
| `src/core/config-writer.ts` | modify | `ConfigPatch.modelFingerprint` 在 YAML 语法树上保留注释写回 | no |
| `src/core/paths.ts` | modify | 新增 `fingerprintRoot`、`fingerprintSamplesRoot`、`fingerprintArchiveRoot`、`fingerprintChecksRoot`、`fingerprintJobsRoot`、`fingerprintWorkdir` 等路径函数 | no |
| `src/core/scratch-cleanup.ts` | modify | `pruneOrphanScratch` 跳过固定空目录 `data/scratch/model-fingerprint` | no |
| `src/core/types.ts` | modify | 导出 `sanitizeSegment` 供模型目录安全编码复用 | no |
| `src/core/store.ts` | modify | 导出 `writeJsonPathAtomic` 供指纹存储复用 | no |
| `src/core/run-cancel.ts` | modify | 底层抽为按路径取消的 `requestCancelAt` / `watchCancelAt` 供轮次与指纹作业共用，保持 `requestCancel(runId)` 向后兼容 | no |
| `src/core/runner.ts` | modify | 导出 `launchFor`（支持 `allowDisabled`）供指纹采集按 `(cli, profile)` 启动会话 | no |
| `src/core/leak-guard.ts` | modify | 新增 `buildConfigLeakGuard` 覆盖配置中全部 `profile` 的密钥指纹 | no |
| `src/core/scheduler.ts` | modify | 定时触发前使用 `findActiveWork` 检查双向互斥 | no |
| `src/core/requests.ts` | modify | `RequestKind` 新增 `fingerprint-fill`、`fingerprint-check` 分容器请求类型 | no |
| `src/adapters/types.ts` | modify | `SessionOptions` 新增默认环境隔离选项，`AgentRequest` 新增可选 `fingerprint?: boolean` | no |
| `src/adapters/index.ts` | modify | 透传会话环境隔离选项 | no |
| `src/adapters/codex-profile-home.ts` | modify | 新增 `prepareCodexDefaultCleanHome`（`auth.json` 软链、`project_doc_max_bytes = 0`、`persistence = "none"`）及非默认 profile 指纹隔离 | no |
| `src/adapters/codex-app-server.ts` | modify | 支持传入隔离 `env` 与 `cleanup` | no |
| `src/adapters/codex.ts` | modify | `createDefaultCleanHome` 下为默认 profile 启用最小隔离环境 | no |
| `src/adapters/claude.ts` | modify | `request.fingerprint` 下追加 `--safe-mode --no-session-persistence` | no |
| `src/adapters/agy.ts` | modify | `request.fingerprint` 下跳过 `.mcp.json`、追加 `--disable-slash-commands`，并在 `write_to_file` 时跳过读盘仅记 `wroteFile: true` | no |
| `src/bin/model-fingerprint.ts` | add | `fingerprint:status`、`fingerprint:fill`、`fingerprint:check`、`fingerprint:self-test`、`fingerprint:rescore` 五个命令行入口 | no |
| `src/bin/runner-sync.ts` | add | 从 `src/bin/runner.ts` 拆出数据仓同步辅助函数以守住文件行数门禁 | no |
| `src/bin/runner.ts` | modify | 接入 `findActiveWork` 并消费 `fingerprint-fill` / `fingerprint-check` 请求 | no |
| `src/app/api/run/route.ts` | modify | 手动跑一次前通过 `findActiveWork` 拦截与指纹作业的并发冲突（409） | no |
| `src/app/api/config/route.ts` | modify | 支持 `modelFingerprint` 配置补丁校验与写回 | no |
| `src/app/api/events/live-hub.ts` | modify | 监听 `data/model-fingerprint/jobs/*.json` 并广播 `fingerprint-job` SSE 事件 | no |
| `src/app/api/events/route.ts` | modify | 新连接建立时推送初始 `fingerprint-job` 状态 | no |
| `src/app/api/fingerprint/route.ts` | add | 所有者专属 `GET`（矩阵快照 / 单元样本详情 / 单条核验详情）与 `POST`（`plan` / `fill` / `check` / `self-test` / `rescore` / `cancel`） | no |
| `src/app/api/fingerprint/samples/route.ts` | add | 所有者专属 `PATCH`（单条样本剔除/恢复与单模型单探针重置归档） | no |
| `src/app/fingerprint/` | add | `/fingerprint` 看板页面与组件（矩阵表、样本抽屉、核验与补采面板、核验详情、视图模型与样式） | no |
| `src/app/config/ConfigSectionShell.tsx` | add | 从 `ConfigEditor.tsx` 抽出通用区块壳组件以守住行数门禁 | no |
| `src/app/config/ModelFingerprintSection.tsx` | add | 配置页「模型指纹」设置区块 | no |
| `src/app/config/ConfigEditor.tsx` | modify | 挂载 `ModelFingerprintSection` | no |
| `src/app/config/config-editor-model.ts` | modify | `EditableConfig.modelFingerprint` 与补丁序列化 | no |
| `src/app/config/config-nav-items.ts` | modify | 配置页侧栏导航新增 `model-fingerprint` | no |
| `src/app/config/page.tsx` | modify | 传递 `modelFingerprint` 初始配置 | no |
| `src/app/components/live-state/live-store.ts` | modify | 订阅 `fingerprint-job` SSE 事件并通知页面刷新 | no |
| `src/app/components/run-control/run-once-api.ts` | modify | 适配 `findActiveWork` 返回的指纹作业冲突双语错误提示 | no |
| `src/app/components/toolbar/ToolbarIcons.tsx` | modify | 工具栏图标组件新增指纹图标 `FingerprintIcon` | no |
| `src/app/components/toolbar/ToolbarUtils.tsx` | modify | 所有者且非只读模式下展示 `/fingerprint` 入口按钮 | no |
| `src/i18n/messages/fingerprint.ts` | add | 模型指纹模块中英双语词条字典 | no |
| `src/i18n/messages/common.ts` | modify | 补充通用词条 | no |
| `src/i18n/messages/toolbar.ts` | modify | 补充工具栏模型指纹入口词条 | no |
| `src/i18n/messages/config.ts` | modify | 补充配置页模型指纹区块词条 | no |
| `src/i18n/messages/index.ts` | modify | 聚合导出 `fingerprint` 词条命名空间 | no |
| `src/i18n/index.ts` | modify | 导出指纹词条类型 | no |
| `package.json` | modify | 新增 `fingerprint:status`、`fingerprint:fill`、`fingerprint:check`、`fingerprint:self-test`、`fingerprint:rescore` 五个脚本 | no |
| `config/pelican.example.yaml` | modify | 补充 `modelFingerprint` 起步配置示例与注释 | no |
| `test/core/model-fingerprint/` | add | 11 个单测文件全面覆盖探针、配置、JSD、自检、状态机、规划器、适配器隔离、互斥、并发存储、CLI、API 与 UI 视图模型 | no |
| `test/i18n/i18n-integrity.test.ts` | modify | 纳入 `fingerprint` 双语词条对称性与占位符校验 | no |
| `test/app/config/config-nav-anchors.test.ts` | modify | 纳入 `model-fingerprint` 导航锚点校验 | no |
| `test/app/config/config-side-nav.test.ts` | modify | 更新配置页导航项断言 | no |
| `docs/architecture/architecture.md` | modify | 回填 §1、§2、§3、§4、§5、§6、§7 与表头变更记录 | no |
| `docs/development.md` | modify | 补充模型指纹目录、运行产物、API 与命令说明 | no |
| `docs/development.zh-CN.md` | modify | 补充模型指纹目录、运行产物、API 与命令说明（中文版） | no |
| `docs/design-notes.md` | modify | 补充模型指纹 JSD 核验与零工具隔离设计要点 | no |
| `docs/design-notes.zh-CN.md` | modify | 补充模型指纹 JSD 核验与零工具隔离设计要点（中文版） | no |
| `README.md` | modify | 补充 `modelFingerprint` 配置项与命令说明 | no |
| `README.zh-CN.md` | modify | 补充 `modelFingerprint` 配置项与命令说明（中文版） | no |
| `AGENTS.md` | modify | 常用命令与架构速览补充模型指纹说明 | no |

**不动的东西**：

- 公开数据仓契约 `src/core/data-repo/contract.ts` 与同步流水线（模型指纹数据仅存本机 `data/model-fingerprint/`，绝不进入公开数据仓，也不在只读展台公开）。
- 既有鹈鹕自行车基准的提示词、考场规则 `src/core/house-rules.ts`、`run.json` / `progress.json` 结构与 `findActiveRun()` 返回契约。
- 作品评审（`src/core/judge/`）的静态层、渲染层与 AI 裁判逻辑。

## 兼容与回归

**兼容策略**：并行 + 开关 —— `modelFingerprint` 缺省关闭（`enabled: false`），且即使开启也仅在显式运行 `pnpm fingerprint:*` 或在所有者 `/fingerprint` 页面手动触发时执行，对既有定时调度与鹈鹕评测零干扰。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | pass | 0f05cf9 | |
| `pnpm test` | 全仓单元测试（含新增模型指纹与双语完整性测试） | pass | pass | 0f05cf9 | |
| `pnpm validate:prompts` | 题库与黄金标准校验 | pass | pass | 0f05cf9 | |
| `pnpm check:length` | 代码文件与函数行数门禁 | pass | pass | 0f05cf9 | 471 个文件 0 超标 |
| `pnpm check:secrets` | 已跟踪文件密钥与敏感信息扫描 | pass | pass | 0f05cf9 | 915 个文件 0 问题 |
| `pnpm build` | Next.js 生产构建检查（含 `/fingerprint` 与 `/api/fingerprint*`） | pass | pass | 0f05cf9 | |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | `WU-001` + `WU-002`：领域类型、面向对象 `Probe` & `PromptCodec`、6 个探针子类、`modelFingerprint` 配置解析、以 2 为底 JSD、配对无重叠自检、四态判决状态机与规划器 | revert 对应提交 |
| 2 | `WU-003` + `WU-004`：三家 CLI `fingerprint` 最小隔离环境、`findActiveWork` 双向互斥、`store.ts` 文件级互斥锁与归档重算、`collect.ts` 增量采集与 `src/bin/model-fingerprint.ts` 五个子命令 | revert 对应提交 |
| 3 | `WU-005` + `WU-006`：`/api/fingerprint` 与 `/api/fingerprint/samples`、分容器请求与 SSE 推送、YAML 配置写回、`/fingerprint` 看板页面与组件、`/config` 配置区块、中英双语词条与权威文档回填 | revert 对应提交 |

## 回滚方案

- 触发条件：模型指纹适配器隔离影响正常评测，或 `/fingerprint` 路由引发构建/运行异常。
- 步骤：revert 本 ACR 的实施提交；`config/pelican.config.yaml` 中的 `modelFingerprint` 段在旧版加载器中会被忽略，无需手工清理配置文件。
- 数据：`data/model-fingerprint/` 与 `data/scratch/model-fingerprint/` 均为独立子目录，不触碰 `data/runs/`，回滚后可直接保留或删除。

## 人工确认

### 方案摘要

1. 要动什么：新增 `src/core/model-fingerprint/`（面向对象 `Probe` & `PromptCodec`、JSD 统计、留出法自检、并发存储与增量采集）、`src/bin/model-fingerprint.ts`（5 个 CLI 命令）、三家 CLI 适配器的 `fingerprint` 隔离、`findActiveWork` 双向互斥、`/api/fingerprint*` 接口、`/fingerprint` 页面与 `/config` 配置区块。
2. 不动什么：公开数据仓契约 `src/core/data-repo/contract.ts`、既有鹈鹕基准题面与 `run.json` / `progress.json` 格式、作品评审逻辑。
3. 为什么现在：设计文档与实施计划已通过多轮交叉审查定稿，需按计划完成第 1–2 期交付与文档同步。
4. 风险与回滚：所有指纹产物隔离在 `data/model-fingerprint/`，通过 `findActiveWork` 与鹈鹕轮次双向互斥，只读展台模式完全隐藏并拒绝访问；按模块回滚不影响既有功能。
5. 成本：零新增第三方依赖；全部单元测试在本地临时目录中使用桩数据完成，不消耗真实 CLI 配额。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-10-17 | luojin | approved | 用户确认按 `docs/research/model-fingerprint/` 定稿方案与 `plans/20261017_model-fingerprint_execution-plan.yaml` 实施并同步文档 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §1 §2 §3 §4 §5 §6 §7 | 补记模型指纹模块、CLI 命令、适配器零工具隔离、`data/model-fingerprint/` 存储布局与 `/fingerprint` 看板边界 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-024 | 已回填 |
| ADR（/adr-curator） | 不适用：设计取舍已完整记录于 `docs/research/model-fingerprint/model-fingerprint-design.md` 与 `docs/design-notes*.md` | 不适用 |
