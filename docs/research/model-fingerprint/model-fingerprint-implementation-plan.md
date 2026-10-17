# 模型指纹模块实施计划

| 项 | 内容 |
|---|---|
| 状态 | 已实施（第 1 期 + 第 2 期代码已落地，992/992 测试通过） |
| 日期 | 2026-10-17 |
| 方法设计 | [model-fingerprint-design.md](model-fingerprint-design.md) |
| 执行计划 | [20261017_model-fingerprint_execution-plan.yaml](../../../plans/20261017_model-fingerprint_execution-plan.yaml) |

本文给出模型指纹模块的落地安排：模块划分、命令与 Web API、现有代码的改动面、配置、分期与
验收标准。探针、Jensen-Shannon 散度打分算法、调用环境隔离与数据布局的设计取舍见
[model-fingerprint-design.md](model-fingerprint-design.md)。逐文件的改动清单与回归
清单在 ACR 中给出。

## 1. 模块划分

```text
src/core/model-fingerprint/
├── types.ts         零 I/O 的纯领域类型、枚举与常量（供前后端、配置与 i18n 共用）
├── probes/          面向对象探针与问答编解码器体系（无外部独立的 extract.ts）：
│   ├── codec.ts     PromptCodec 接口（成对内聚 buildPrompt 与 extractCandidates）及默认 RegexPromptCodec
│   ├── base.ts      Probe 抽象基类（统一 normalizeCanonical、validateCanonical、extractFeatures 与 extractAttempt 模板方法）
│   ├── uuid.ts      UuidProbe 实现
│   ├── number.ts    NumberProbe 实现
│   ├── seed.ts      SeedProbe 实现
│   ├── palette.ts   PaletteProbe 实现
│   ├── words-en.ts  WordsEnProbe 实现
│   ├── words-zh.ts  WordsZhProbe 实现
│   └── index.ts     探针单例注册表 PROBES、getProbe(id) 与 listProbes()
├── jsd.ts           消费 Probe.extractFeatures() 的多样本计数池化、经验频率统计与 Jensen-Shannon 散度 / 相似度纯数学计算
├── score.ts         单探针平均相似度 S_p(Q, M)、成对得分差 D(A)、自身下界检验、排名与四态结论状态机
├── self-test.ts     配对无重叠交叉验证自检；单条样本留一相似度、自身第 5 百分位下界、模型对判定阈值、各探针区分度与自检一致率
├── plan.ts          解析探针列表、跳过缺样本探针、筛选候选模型、在内存副本模拟剔除/重置并计算缺口与调用次数上限
├── store.ts         文件级互斥锁 withProbeFileLock(filePath, fn)、样本集、archive 归档、核验记录、作业文件读写与经 Probe.extractAttempt() 实时解码封装
├── collect.ts       内存单写者、inFlightCalls * activeCodec.valuesPerCall 预占计数、首请求串行缓存预热、并发调用、调用上限、取消与费用记录
└── job.ts           作业生命周期与 findActiveFingerprintJob()（含 externalRunner() 心跳存活检查）
src/core/config/model-fingerprint.ts  modelFingerprint 与 modelPrompts 配置解析、默认值与边界校验
src/core/active-work.ts               组合 findActiveRun()（经 listProgressViews 覆盖采样与 isJudging 阶段）与 findActiveFingerprintJob() 的双向互斥检查及 describeActiveWorkConflict()
src/bin/model-fingerprint.ts          命令入口（status | fill | check | self-test | rescore）
src/bin/runner-sync.ts                从 src/bin/runner.ts 拆出的 GitHub 授权与数据仓同步子模块
src/app/fingerprint/                  第 2 期：看板模型指纹页面与组件
├── fingerprint.css                   模型指纹工作台样式（≤ 300 行）
├── fingerprint-model.ts              前端纯视图模型、actionFetch 请求辅助与 resolveActiveProbes()
├── fingerprint-check-model.ts        发起核验多目标 × 多 Profile × 探针预演与批量队列状态模型
├── page.tsx                          服务端路由入口（只读展台模式隐藏重定向 + verifySession 鉴权）
├── FingerprintDashboard.tsx          工作台顶层容器（标签页切换、活跃作业进度条、SSE 实时联动）
├── FingerprintMatrix.tsx             基准样本矩阵视图（模型 × 探针单元格状态、CLI 版本、强度折叠标记、一键补齐）
├── FingerprintSampleDrawer.tsx       单格样本抽屉（展示标准值、留一相似度 sampleSelfSim、生效窗口计数、剔除/恢复、差额补采与归档重置）
├── FingerprintCheckPanel.tsx         发起核验面板（复用 PickerHead、ModelRows、RunOncePrompts、RunOnceProfileModal）
├── FingerprintCheckSections.tsx      核验预演汇总表与历史核验列表子视图组件
└── FingerprintCheckDetail.tsx        核验详情面板（四态判决徽章、逐探针分数对比、逐条核验记录展示、一键重算按钮）
src/app/api/fingerprint/              第 2 期：模型指纹 Web API 路由
├── route.ts                          GET/POST /api/fingerprint（快照/单格详情/单条核验查询，及 fill/check/plan/self-test/rescore/cancel 动作）
└── samples/route.ts                  PATCH /api/fingerprint/samples（单格样本剔除/恢复与归档重置）
src/app/config/
├── ConfigSectionShell.tsx            从 ConfigEditor.tsx 拆出的配置页通用区块骨架与头部组件
└── ModelFingerprintSection.tsx       配置页「模型指纹」配置区块组件
src/i18n/messages/fingerprint.ts      中英双语对称词条字典（6 类探针说明、四态结论、拒绝原因、矩阵与核验面板文案）
test/core/model-fingerprint/          单元测试与数学定值测试（11 个测试文件，不调用真实 CLI）：
  probes.test.ts, config.test.ts, jsd.test.ts, score-and-self-test.test.ts, plan.test.ts,
  adapter-isolation.test.ts, active-work.test.ts, store.test.ts, collect-and-cli.test.ts,
  api-and-requests.test.ts, ui-model.test.ts
```

单个 `.ts` 文件严格低于 `config/code-length-policy.yaml` 的 500 行上限、单个函数低于 50 行上限
（`.tsx` / `.css` 文件 ≤ 300 行、函数 ≤ 80 行）。`plan.ts` 是纯函数，`fingerprint:status`
的状态表与补齐、核验前的报告均由它计算。模块不复用鹈鹕轮次的编排（`executeRun`）：那条路径会写入考场规则、按 SVG 提取作品，并进入时间线、预算
历史与数据仓同步。模块经 `src/core` 调用适配器，`src/app` 只引用 `src/core` 与 `src/i18n`
（不直接引用 `src/adapters`），与现有分层一致。

## 2. 命令与 Web API

### 2.1 CLI 命令

| 命令 | 作用 | 调用模型 |
|---|---|---|
| `pnpm fingerprint:status [-- [--cli <cli>] [--model <模型>] [--probes <探针>]]` | 列出配置 `references` 与磁盘已有样本集的并集状态、每条样本的留一相似度、CLI 版本与补齐所需调用次数 | 否 |
| `pnpm fingerprint:fill -- [--cli <cli>] [--profile <profile>] [--model <模型>] [--probes <探针>] [--count <n>] [--exclude <reqId,...>] [--include <reqId,...>] [--reset] [--dry-run] [--yes\|-y]` | 补齐缺少的基准样本（指定 `--model` 时只针对该单一模型与所选 `--probes` 独立定向采集，不要求模型已写入配置 `references`，也绝不触碰其他模型；省略 `--cli` 时优先匹配配置 `references`，若未登记则自动从磁盘已有样本集中解析同名模型的 `cli`；省略 `--model` 时遍历配置 `references`；支持先按 `reqId` 剔除/恢复样本，再按 `min(missingValues, count)` 增量补采；`--count <n>` 支持小步试采 $n$ 条且合格样本直接留存，`--count 0` 仅应用剔除/恢复落盘而不调用模型；`--reset` 须同时指定 `--cli`、`--model` 与 `--probes`，将目标样本集移入 `archive/` 后重采）；先显示调用次数与估算费用并确认 | 是（`--dry-run`、`--count 0` 或剔除后无缺口时为否） |
| `pnpm fingerprint:check -- --cli <cli> [--profile <profile>] --model <模型> [--probes <探针>] [--dry-run] [--yes\|-y]` | 核验指定 CLI 与 `profile`（缺省 `default`；`--declared <模型>` 为 `--model <模型>` 的同义别名）；先显示将核验与跳过的探针、候选模型、调用次数、估算费用与自检一致率 | 是（`--dry-run` 否） |
| `pnpm fingerprint:self-test -- [--cli <cli>] [--model <模型>] [--probes <探针>]` | 自检：各探针区分度、单条样本留一相似度、自身第 5 百分位下界、每对模型的判定阈值、所选组合的自检一致率、误判率及不同样本子集容量下的区分度变化 | 否 |
| `pnpm fingerprint:rescore -- <checkId>`（或 `--id <checkId>`） | 用当前最新 `probes/`（`Probe` 与 `PromptCodec`）、`jsd.ts`、`self-test.ts` 与 `score.ts` 对历史核验原文及基准样本（含 `archive/` 回退）重新解码打分，在记录 `rescores` 中追加条目 | 否 |

- `--probes` 取探针名，逗号分隔，如 `--probes uuid,palette,words-zh`；任意非空子集均可，
  缺省取配置 `probes`。
- `--profile` 缺省为 `default`（即该 CLI 的官方默认登录态；首期仅 `codex` 支持非默认
  `profile`）。
- `--count <n>` 限制本次作业在每个目标（模型 × 探针）上最多新增采集 $n$ 条合格值（`targetNewValues = min(missingValues, n)`；当 $n = 0$ 时仅持久化 `--exclude` / `--include` 变更而不发起调用），用于新模型或自定义 `PromptCodec` 小步试采。
- `--exclude <reqId,...>` 与 `--include <reqId,...>` 对所选样本集中的指定 `reqId` 记录设置/清除 `excluded: true`（被剔除样本不计入有效合格值，随后的补采仅补足缺口 `missingValues`）。
- `--reset` 必须同时显式指定 `--cli <cli>`、`--model <模型>` 与 `--probes <探针>`（禁止未限定模型或探针的批量重置）。
- `--dry-run` 在内存副本上模拟 `--reset` / `--exclude` / `--include` 并仅输出 `plan.ts` 计算的缺口、调用次数、估算费用与自检一致率，不修改磁盘文件、不移动 `archive/`、不发起调用；
  `--yes`（或 `-y`）跳过命令行交互式确认（供自动化测试或已获人工授权的执行使用）。

会调用模型的命令遵守 `AGENTS.md` 的规定：运行前先征得人工同意。

### 2.2 Web API 路由契约（第 2 期）

- `GET /api/fingerprint`（`requireOwner`，只读展台模式返回 403）：
  - 无查询参数时返回看板全局快照：`{ modelFingerprint, profiles, matrix, fillPlan, selfTest, selfTestByCli, activeJob, activeWork, checks }`；
  - 传入 `?checkId=<checkId>` 时返回单条核验记录：`{ record }`（不存在时返回 404）；
  - 传入 `?sampleDetail=<cli>:<model>:<probe>`（按首个与末个 `:` 切分，兼容含 `:` 的模型名）或 `?cli=<cli>&model=<model>&probe=<probe>` 时返回单格样本详情：`{ cli, model, probe, gap, attempts }`（含逐条 `sampleSelfSim` 与 `activeWindowCount`）；
- `POST /api/fingerprint`（`requireOwnerAction`）：支持 `action: "fill" | "check" | "plan" | "self-test" | "rescore" | "cancel"`：
  - `fill` / `check` 接收与 CLI 完全对齐的 `{ cli, profile?, model?, probes?, count?, exclude?, include?, reset?, dryRun? }`（当 `dryRun: true` 时自动转入 `plan` 预演，否则经 `findActiveWork()` 互斥检查后异步启动作业并返回 HTTP 202 `{ ok: true, started, jobId }`）；
  - `plan` 支持 `mode: "fill" | "check"`，返回 `{ ok: true, mode, fillPlan }` 或 `{ ok: true, mode, checkPlan }`；
  - `self-test` 接收可选 `{ cli?, model?, probes? }`，返回 `{ ok: true, modelFilter, selfTest, selfTestByCli }`；
  - `rescore` 接收 `{ checkId }`，返回 `{ ok: true, record }`；
  - `cancel` 接收可选 `{ jobId? }`（省略时自动取消当前活跃指纹作业；传入但与当前活跃作业不一致时返回 409；无活跃作业时返回 404）；
- `PATCH /api/fingerprint/samples`（`requireOwnerAction`）：接收 `{ cli, model, probe, exclude?: string[], include?: string[], reset?: boolean }`，在 `withProbeFileLock` 保护下执行单条样本剔除/恢复或单探针归档重置（存在活跃指纹作业时返回 409 Conflict），返回 `{ ok: true, cli, model, probe, archivePath, gap, attempts }`。

## 3. 现有代码的改动面

| 位置 | 改动 |
|---|---|
| `src/core/paths.ts`、`src/core/scratch-cleanup.ts` | `paths.ts` 增加本模块的数据根目录（`data/model-fingerprint`）、样本集（`samples/`）、归档目录（`archive/`）、核验记录（`checks/<yyyy-mm>/`）、作业文件（`jobs/`）以及固定空工作目录 `fingerprintWorkdir()`（`data/scratch/model-fingerprint`）路径函数；`scratch-cleanup.ts` 的 `pruneOrphanScratch` 跳过 `"model-fingerprint"` 子目录 |
| `src/core/types.ts` | 导出 `sanitizeSegment` 供模型名目录安全编码复用 |
| `src/core/store.ts` | 增加按任意路径带随机后缀 `.staging` 临时文件原子写 JSON 的 `writeJsonPathAtomic` 函数（配合 `src/core/model-fingerprint/store.ts` 的 `withProbeFileLock(filePath, fn)` 防并发读改写覆盖） |
| `src/core/run-cancel.ts` | 底层抽为按取消文件路径工作的 `requestCancelAt` / `watchCancelAt`（保持 `requestCancel(runId)` 向后兼容）；指纹作业使用独立的 `jobs/<jobId>.cancel.json` |
| `src/core/active-work.ts`、`src/core/scheduler.ts`、`src/bin/runner.ts`、`src/bin/runner-sync.ts`、`src/app/api/run/route.ts`、`src/app/components/run-control/run-once-api.ts` | 保持 `progress.ts` 的 `findActiveRun()` 原签名与返回类型不变（避免破坏 `RunStatus.tsx`、`GET /api/run` 与 `/api/run/cancel`）；新增独立的 `src/core/active-work.ts` 导出无参 `findActiveWork(): Promise<{ runId: string; kind: "run" \| "fingerprint"; trigger?: RunRecord["trigger"] } \| null>` 与 `describeActiveWorkConflict(active)`（直接复用 `listProgressViews()` 覆盖鹈鹕采样与 AI 裁判 `isJudging` 阶段，并组合支持 `externalRunner()` 心跳检查的 `findActiveFingerprintJob()`，指纹作业的 `runId` 取 `job.jobId`）。先把 `src/bin/runner.ts`（原 492/500 行）中的 GitHub 授权与数据仓同步子模块拆出为 `src/bin/runner-sync.ts`，再将 `scheduler.ts` 的 `DEFAULT_DEPS.activeRun`（顺手删除死函数 `reasonToSkip`）、`src/bin/runner.ts` 的 `startRun` 及 `src/app/api/run/route.ts` 的 `POST`（将 409 冲突响应拼装抽为辅助函数；`GET` 保持用 `findActiveRun()`）接入 `findActiveWork()`，并在 `run-once-api.ts` 中适配指纹作业冲突的英文错误提示 |
| `src/core/runner.ts`、`src/core/leak-guard.ts` | 从 `runner.ts`（其 `executeRun` 原 48/50 行）抽出 `launchFor(config, cli, name, { allowDisabled })`（增加 `profile.cli === cli` 校验，核验时允许指定已停用的 `profile`），并在 `src/core/leak-guard.ts` 新增包含全部已登记 `profile` `.key` 文件的 `buildConfigLeakGuard(config)` 共用 |
| `src/adapters/` | (1) `types.ts`：`AgentRequest` 增加 `fingerprint?: boolean`，`openSession` 增加默认环境隔离选项；(2) `index.ts`、`codex.ts`、`codex-app-server.ts`、`codex-profile-home.ts`：打通 `codex` 默认 `profile` 最小隔离环境启动项（设置 `CODEX_HOME` 与 `HOME`，写入含 `project_doc_max_bytes = 0\n\n[history]\npersistence = "none"\n` 的最小 `config.toml` 以阻断向上读取宿主仓库 `AGENTS.md`，对存在的宿主机 `auth.json` 建符号链接而不复制文件；同时在非默认 `profile` 的 `renderProfileConfig` 中也写入 `project_doc_max_bytes = 0`）；(3) `claude.ts`：`request.fingerprint` 为真时追加 `--safe-mode --no-session-persistence`；(4) `agy.ts`：抽出 `buildAgyArgs`，在 `request.fingerprint` 为真时追加 `--disable-slash-commands`，捕获 `write_to_file` 时跳过读盘并向 `reply.writtenFiles` 推入空内容占位项 `{ path, content: "" }` 以保持 `wroteFile: true` |
| `src/core/config.ts`、`src/core/config/types.ts`、`src/core/config/model-fingerprint.ts`、`src/core/config/loader.ts`、`config/pelican.example.yaml` | 在 `src/core/config/types.ts` 定义 `ModelFingerprintConfig` 并在 `src/core/config.ts` 重导出，新增 `src/core/config/model-fingerprint.ts`（导出 `parseModelFingerprint` 与 `resolveModelFingerprintConfig`），`loader.ts` 只负责接入，同步更新 `config/pelican.example.yaml` |
| `package.json` | 增加 `fingerprint:status`、`fingerprint:fill`、`fingerprint:check`、`fingerprint:self-test`、`fingerprint:rescore` 脚本 |
| `src/core/requests.ts`、`src/bin/runner.ts`（第 2 期） | 先将 `requests.ts` 的 `enqueueRequest` 拆出 `normalizePayload` 辅助函数；再为 `RequestKind` 增加 `"fingerprint-fill"` 与 `"fingerprint-check"` 并在 `runner.ts` 分派执行 |
| `src/core/config-writer.ts`、`src/app/api/config/route.ts`、`src/app/config/{ConfigSectionShell.tsx,ModelFingerprintSection.tsx,page.tsx,config-editor-model.ts,ConfigEditor.tsx,config-nav-items.ts}`（第 2 期） | `config-writer.ts` 通过独立函数 `applyModelFingerprint` 写回 `modelFingerprint` 并保留 YAML 注释；`api/config/route.ts`、`config/page.tsx` 与 `config-editor-model.ts` 补入 `modelFingerprint`；从 `ConfigEditor.tsx` 拆出 `ConfigSectionShell.tsx`，新增 `ModelFingerprintSection.tsx` 并接入配置页导航项（同步更新 `test/app/config/{config-nav-anchors,config-side-nav}.test.ts`） |
| `src/app/components/toolbar/{ToolbarUtils.tsx,ToolbarIcons.tsx}`（第 2 期） | 新增 `FingerprintIcon` 图标与 `/fingerprint` 顶部工具栏入口（仅在已认证所有者且非只读展台模式下展示） |
| `src/app/api/events/live-hub.ts`、`src/app/api/events/route.ts`、`src/app/components/live-state/live-store.ts`（第 2 期） | 在 `live-hub.ts` 的 `isIgnored` 中逐层放行 `fingerprintRoot()`、`fingerprintJobsRoot()` 及 `jobs/<jobId>.json`（忽略 `samples/`、`archive/`、`checks/`、`.cancel.json` 与 `.staging`），接入 `livenessTimer` 存活检查，在 `events/route.ts` 推送初始作业快照，并增加 `"fingerprint-job"` SSE 事件 |
| `src/i18n/`（第 2 期） | 新增 `src/i18n/messages/fingerprint.ts` 并更新 `config.ts`、`common.ts`、`toolbar.ts`、`index.ts`，提供 `en` 与 `zh-CN` 对称双语词条（含 6 个探针的界面格式说明、结论枚举、拒绝原因、矩阵与配置文案） |

直接复用的现有函数：

- `openSessionPool`（`src/adapters/index.ts`，扩展默认环境隔离选项后）：按 CLI 与 `profile` 开启会话；
- `buildConfigLeakGuard`（`src/core/leak-guard.ts`）：应答落盘前的凭据指纹比对；
- `foldEffort`、`sanitizeSegment`（`src/core/types.ts`）：折叠思考强度与模型目录名安全编码；
- `usageFromTranscript`、`estimateCost`（`src/pricing/`）：解析用量与估算费用。

不改：鹈鹕轮次编排、题库、评审、数据仓契约与同步。

### 3.1 文档同步面（Documentation Sync Surface）

| 文档路径 | 同步内容 |
|---|---|
| `docs/architecture/revisions/ACR-024-model-fingerprint.md`（及 `revisions.catalog.jsonl`、`README.md`） | 立项并登记模型指纹核心/CLI 与看板 Web/SSE 架构变更单，包含改动范围、开源候选对比、回归结果与人工确认记录 |
| `docs/architecture/architecture.md` | 回填 §1（进程协作、SSE `"fingerprint-job"`、`findActiveWork` 双向互斥、取消路径）、§2（`model-fingerprint` CLI 与 `runner-sync`）、§3（面向对象 `Probe` & `PromptCodec`、JSD 打分、自检、适配器 `fingerprint` 隔离模式）、§4（`data/model-fingerprint/` 布局）、§5（`modelFingerprint` 配置段）、§6（`buildConfigLeakGuard`、`/fingerprint` 鉴权与只读隐藏）、§7（目录结构） |
| `docs/development.md` / `docs/development.zh-CN.md` | 成对同步目录结构（`src/core/model-fingerprint/`、`src/core/active-work.ts`、`src/bin/model-fingerprint.ts`、`src/app/fingerprint/`）、运行产物（`data/model-fingerprint/`、`data/scratch/model-fingerprint/`）、HTTP API（`GET/POST /api/fingerprint`、`PATCH /api/fingerprint/samples`、`GET /api/events`）与测试套件说明 |
| `docs/design-notes.md` / `docs/design-notes.zh-CN.md` | 成对同步固定空工作目录 `data/scratch/model-fingerprint/`（保持 Prompt Cache 前缀命中）、CLI 适配器指纹隔离模式（`request.fingerprint === true`） |
| `README.md` / `README.zh-CN.md`、`AGENTS.md` | 同步 `pnpm fingerprint:*` 常用命令、`modelFingerprint` 顶层配置项说明、架构速览要点及 `data/model-fingerprint/` 不入公开数据仓规则 |

## 4. 配置

```yaml
modelFingerprint:
  enabled: false
  effort: low           # 指纹调用统一的基准思考强度，按能力目录折叠后记录实际强度
  samplesPerProbe: 20   # 未单独配置 samplesByProbe[probe] 时的回退目标合格值条数 N（N >= 10）
  samplesByProbe:       # 可选：按各探针特征空间自由度独立标定的基准目标样本数（>= 10），内置推荐值如下
    uuid: 40
    number: 40
    seed: 50
    palette: 60
    words-en: 60
    words-zh: 80
  probes: []            # 核验不指定探针时的缺省列表；空表示全部 6 个探针（保序去重）
  valuesPerCheck: 1     # 核验时每个探针需采满的合格值下限 m（1 <= m <= floor(min(N_p) / 2)；单次调用返回多值时整批池化计入查询分布 Q）
  checkAttempts: 3      # 核验时每个探针最多尝试调用的倍数（1..20，上限为 ceil(valuesPerCheck / valuesPerCall) * checkAttempts 次）
  targetAccuracy: 0.95  # 自检中判对方向的目标条件准确率（0.5 < targetAccuracy <= 1.0），各模型对的判定阈值由此计算
  maxCallsFactor: 3     # 单次补齐作业中一个样本集最多尝试 ceil(targetNewValues / valuesPerCall) * maxCallsFactor 次调用（1..20）
  concurrency: 5        # 单次作业最大并发请求数（1..20）
  references:           # 批量采集基准样本的默认模型列表（按 cli:model 保序去重；缺省走各 CLI 的 default 登录态；命令行可显式传 --profile）
    - cli: codex
      model: gpt-5.5
    - cli: codex
      model: gpt-6-mini
  modelPrompts: {}      # 可选：按 "<cli>:<model>"（优先）或 "<model>" -> "<probe>" 轻量覆盖 { prompt?: string, valuesPerCall?: number (1..50) }，由 Probe.resolveCodec 调用 RegexPromptCodec.withPrompt 生效
```

单次调用的超时沿用看板对目标的解析顺序（`targets[].timeoutMs`、`timeoutByEffort`、
`timeoutByCli`、`defaultTimeoutMs`，靠前者优先）。

## 5. 分期

| 期 | 内容 | 是否调用模型 |
|---|---|---|
| 0 | 评审方法设计与本计划；登记 issue；立 ACR | 否 |
| 1 | 核心逻辑与命令行：面向对象探针体系（`Probe` 抽象基类、`PromptCodec` 问答编解码器及 `UuidProbe`、`NumberProbe`、`SeedProbe`、`PaletteProbe`、`WordsEnProbe`、`WordsZhProbe` 6 个子类，各自内聚封装默认/按模型定制 `PromptCodec`、领域标准值校验 `validateCanonical` 与特征切分 `extractFeatures`）、JSD 相似度计算、单探针平均相似度、成对比较、核验计划、存储与归档、单模型小步试采（`--count`）、单条样本剔除恢复与增量补齐、核验、配对无重叠自检（含单条样本留一相似度与不同样本子集容量下的区分度变化）、重算，样本集与核验记录的 schema，以及单元测试。完成后经人工确认，对 2 个模型做小规模实采，用 `fingerprint:self-test` 检验 6 个探针的格式通过率、单探针与组合区分度（1 / 3 / 6 个探针一致率对比）及 `valuesPerCall` 参数 | 单元测试不调用；首次实采前征得同意 |
| 2 | 看板页面 `/fingerprint` 与 API `/api/fingerprint/*`（基准样本矩阵、展开查看单条样本提取值与留一相似度、单条剔除/恢复并只补采差额、核验历史与详情；发起补齐与核验时勾选探针，显示将核验与跳过的探针、调用次数、估算费用与自检一致率；支持点击停止写入 `jobs/<jobId>.cancel.json` 及触发离线 `rescore`）、配置页区块、SSE 进度、分容器请求、`src/i18n/` 中英双语词条。接口读用 `requireOwner`、写用 `requireOwnerAction`；只读展台模式（`PELICAN_READONLY=1` 或 `PELICAN_DATA_SOURCE=remote`）不显示本模块 | 由使用者发起时调用 |
| 3 | 监测：鹈鹕轮次结束后通过独立后置钩子对本轮用到的第三方 `profile` 顺带核验（默认关闭，不直接塞入 `executeRun` 主体）、时间线标记、按时间窗与探针组合汇总不一致率与置信区间、混合比例估计 | 按配置调用 |

第 1 期与第 2 期分别立 ACR，与 `codex` 多 `profile` 设计分成多份 ACR 实施的做法一致。

## 6. 验收标准（AC）

1. 探针面向对象内聚封装（`Probe` 基类 + `PromptCodec` 编解码器 + 领域标准值校验）：
   - 6 个探针各自实现为继承自 `Probe`（`src/core/model-fingerprint/probes/base.ts`）的独立子类（`UuidProbe`、`NumberProbe`、`SeedProbe`、`PaletteProbe`、`WordsEnProbe`、`WordsZhProbe`），不设外部独立的 `extract.ts`；
   - 每个 `Probe` 子类内聚默认 `RegexPromptCodec`（成对绑定 `buildPrompt(reqId)` 与 `extractCandidates(rawText)`）与按 `codec.id` 索引的 `codecs` 注册表：轻量定制时通过 `withPrompt(prompt?, valuesPerCall?)`（或配置 `modelPrompts`）替换提示词文本或 `valuesPerCall` 并复用默认提取器；当某模型需要改变返回外层格式（如要求输出 `1..8` 编号列表或 JSON 数组）时，自定义 `PromptCodec` 在同一对象内同时定义 `buildPrompt` 与 `extractCandidates`，将自定义应答格式解析并组装为探针统一的领域标准值候选串（如 `"词1-词2-...-词8"`）；
   - `probe.extractAttempt(attempt, activeCodec)` 按三级回退顺序（`attempt.codecId ?? "default"` $\to$ 当前模型 `activeCodec` $\to$ `defaultCodec`，按 `codec.id` 去重）逐级串联执行 `codec.extractCandidates`（阶段一，对 `RegexPromptCodec` 自动按 `attempt.valuesPerCall` 适配单次候选提取规则）与 `probe.normalizeCanonical` + `probe.validateCanonical`（阶段二）：若某级提取到 0 个候选或候选全部未通过阶段二校验，则继续回退下一级；一旦某级产出至少 1 条合格标准值，即保序去重并截取最多 `attempt.valuesPerCall` 条立即返回；
   - 同一 `<probe>.json` 样本集中混合默认 `PromptCodec` 与自定义格式 `PromptCodec` 的历史应答原文时，`probe.extractAttempt` 均能无损还原为统一的领域标准值并展平合并，旧样本 0 条失效，其他模型与其他探针 0 次重跑。
2. 修改 `PromptCodec.extractCandidates`、`Probe.validateCanonical`、`Probe.extractFeatures` 或 `jsd.ts` / `score.ts` 打分公式后，`fingerprint:status`、`fingerprint:self-test` 与
   `fingerprint:rescore` 自动按新规则生效且不发起 CLI 调用（`rescore` 对核验查询原文与基准
   样本原文重新解码打分并追加条目，不覆盖原结论；若 `samples/` 下不存在该探针样本集或有效合格值少于 `samplesPerProbe`，自动从 `archive/` 回退读取最新满额归档样本集）；
   测试中用计数的假适配器验证。
3. `jsd.ts` 实现满足以下解析性质、边界保护与定值校验：
   - 任一输入分布为空时抛出异常（禁止返回 `1.0` 或 `0.5`）；相同非空分布的相似度恒为 `1`，
     支撑集完全不相交的两个非空分布相似度恒为 `0`，对任意非空分布结果经 `[0, 1]` 钳制后严格满足 `0 <= sim <= 1`
     且对称 `sim(P, Q) === sim(Q, P)`；
   - 对解析测试分布 $P = \{a: 0.5, b: 0.5\}$、$Q = \{a: 1.0\}$，给出
     $\text{JSD}(P \parallel Q) = 1.5 - 0.75 \log_2 3$（约 `0.31127812445913283`），相似度
     $\text{sim}(P, Q) = 0.75 \log_2 3 - 0.5$（约 `0.6887218755408672`）；
   - 保持基准分布 $P$ 在查询支撑集 $\text{supp}(Q)$ 内各特征的概率 $P(x)$（$x \in \text{supp}(Q)$）
     不变，将剩余概率质量 $1 - \sum_{x \in \text{supp}(Q)} P(x)$ 任意拆分到 $K$ 个不同的未共现
     特征（$K \ge 1$）或加入任意零概率项时，$\text{JSD}(P \parallel Q)$ 的值恒定不变；
   - 各 `Probe` 子类的 `extractFeatures` 方法在生成 $P^{(1)}$、$P^{(2)}$ 与可选 $P^{(\text{seg})}$ 特征时，按设计 6.1 节剥离各自的固定结构前缀与分隔符（`SeedProbe` 剥离 `seed_`，`UuidProbe`、`PaletteProbe`、`WordsEnProbe`、`WordsZhProbe` 剥离 `-` 与 `#`），按 Unicode 码点（`Array.from`）在单条样本内部提取相邻码点对，不跨样本拼接，`jsd.ts` 不硬编码具体探针名称。
4. 分别选 1 个、3 个、6 个探针核验时，调用次数为未跳过探针数 × `ceil(valuesPerCheck / valuesPerCall)`
   （不计重试）；结论只用所选探针，未选探针的样本集缺失或未采满不影响结果。
5. 所选探针中，声明模型没有可用样本集的探针跳过，并列出补齐所需调用次数，其余探针照常
   核验；核验中失败的探针不参与打分，其余探针照常出结论。只有声明模型无任何可用探针时
   才不发起调用。
6. 某候选模型只有部分探针的样本集时，按它与声明模型共有的有效探针参与成对比较，不被整体
   排除；新增或删除一个基准模型，不改变其他模型对的平均得分差 $D(A)$ 与判定阈值 $t_{C,A}$。
7. 自检交叉验证与四态结论状态机满足以下统计与完备互斥要求：
   - 配置满足 $\text{samplesPerProbe} \ge 10$ 且 $1 \le m = \text{valuesPerCheck} \le \lfloor N / 2 \rfloor$；基准样本池与查询池按展平后的有效合格值固定截取 $N = \text{samplesPerProbe}$ 与
     $m = \text{valuesPerCheck}$ 条（每个 `reqId` 最多计入 $\lfloor N / (2m) \rfloor$ 条）；所有探针与模型统一使用相同折数 $R$（$m=1$ 时 $R=N$ 留一法，
     $m>1$ 时 $R=\min(\binom{N}{m}, 50)$），自检模拟查询折 $B_r$ 与基准折 $C_{\text{ref}}^{(r)}$
     按 `reqId` 严格不相交（$\text{reqIds}(B_r) \cap \text{reqIds}(C_{\text{ref}}^{(r)}) = \emptyset$），且每个模型对 $(C, A)$ 在自检与真实核验中均采用双方对等的公共子参照容量 $N_{\text{ref},p}(C, A) = \min(N_{\text{ref},p}(C), N_{\text{ref},p}(A))$；
   - 每对模型的判定阈值 $t_{C,A} \ge 10^{-4}$ 在满足双边最小样本覆盖率（$\text{Cov}_C(t) \ge 0.5$、
     $\text{Cov}_A(t) \ge 0.5$ 且有效判定总折数 $\ge \min(10, R)$）的有限候选阈值集合上计算；
   - 核验状态机严格按 `not-comparable` → `inconsistent` → `consistent` → `inconclusive`
     优先级互斥求值：当存在可区分候选模型 $A$ 满足 $D(A) \le -t_{C,A}$ 时即使
     $\text{selfSim}(Q, C) < q_{0.05}(C)$ 也优先判为 `inconsistent`，并在同时通过候选自身下界 $\text{selfSim}_{\mathcal{P}_{C,A}}(Q, A) \ge q_{0.05}(A; \mathcal{P}_{C,A})$ 的达标候选子集 $\mathcal{A}_{\text{match}}$ 中按设计 6.4 节确定性全序唯一选出 `closestCandidate`；当无候选模型（$\mathcal{A} = \emptyset$）
     或所有候选模型均不可区分（$\mathcal{A}_{\text{dist}} = \emptyset$）或
     $\text{selfSim}(Q, C) < q_{0.05}(C)$ 时绝不误判为 `consistent`，并给出对应的
     `inconclusiveReason`。
8. `fingerprint:fill` 支持单模型独立适配、小步试采、单条样本剔除恢复、文件级互斥锁与增量差额补采：
   - 显式传入 `--cli <cli> --model <new-model> --probes <probe>` 时，即使 `<new-model>` 未登记在
     `config.modelFingerprint.references` 中，也只单独采集该模型的该探针，绝不触发 `references`
     中其他模型的任何调用；
   - 传入 `--count <n>` 时，单次作业在该探针上最多新增采集 `targetNewValues = min(missingValues, n)`
     条合格值（调用尝试上限为 `ceil(targetNewValues / activeCodec.valuesPerCall) * maxCallsFactor`；`--count 0` 时仅应用剔除/恢复落盘而不发起调用），`--dry-run` 不修改任何磁盘文件或归档目录；
   - 通过 `--exclude <reqId,...>` 剔除异常调用记录（设共含 $k$ 条有效合格值）后，样本集有效合格值更新为 $V_{\text{valid}}$，随后的补采
     仅针对缺口 `missingValues = max(0, samplesPerProbe - V_valid)`（单值满额 20 条下即 `missingValues = k`）发起调用，不重采其余已合格样本，支持
     `--include <reqId,...>` 恢复，且所有 `<probe>.json` 读改写均受 `withProbeFileLock(filePath, fn)` 串行保护；
   - `--reset` 必须同时显式指定 `--cli`、`--model` 与 `--probes`（拒绝未限定模型或探针的批量重置），将
     目标样本集移入 `archive/` 而不删除。
9. 三家 CLI 的宿主环境隔离符合设计第 7 节：指纹调用使用固定空工作目录 `data/scratch/model-fingerprint`（`pruneOrphanScratch` 跳过该子目录），不写 `AGENTS.md` /
   `CLAUDE.md` / `GEMINI.md` 考场规则、不附 `harnessGuard`；`codex` 默认 `profile` 使用隔离
   目录（含 `project_doc_max_bytes = 0`，非默认 `profile` 的 `config.toml` 同样写入 `project_doc_max_bytes = 0`）并以 `symlink` 链接存在的 `auth.json`（不复制文件）；`claude` 传
   `--safe-mode --no-session-persistence`；`agy` 传 `--disable-slash-commands`，模型触发
   `write_to_file` 时推入占位项记录 `wroteFile: true`，若正文无合格值则由 `probe.extractAttempt` 归类为
   `tool_write_instead_of_inline`，不从外部文件兜底读取。
10. 每次调用记录 token 用量与估算费用；补齐与核验前显示调用次数与估算费用，无历史费用记录
    时只显示调用次数。
11. 鹈鹕轮次（含采样与 AI 裁判 `isJudging` 阶段）在跑时指纹作业拒绝启动；指纹作业在跑时，
    手动轮次被拒绝、定时轮次排队，且不破坏现有 `RunStatus` 组件、`GET /api/run` 与 `/api/run/cancel` 接口。
12. 应答落盘前经包含全部已登记 `profile` 密钥的凭据指纹比对，命中即不落盘原文并记为
    `leak-blocked`。
13. 第 2 期看板 `/fingerprint` 与 `/api/fingerprint/*` 接口满足：读接口经 `requireOwner`、写接口经 `requireOwnerAction` 鉴权；只读展台模式（`PELICAN_READONLY=1` 或 `PELICAN_DATA_SOURCE=remote`）隐藏本模块并拒绝接口访问；`live-hub.ts` 通过 `"fingerprint-job"` SSE 事件实时推送作业进度与存活状态；界面支持单条样本剔除/恢复、差额补采、发起核验、停止作业与离线重算闭环。
14. `pnpm lint`、`pnpm test`、`pnpm build`、`pnpm check:length`、`pnpm check:secrets`
    通过（第 2 期含 `test/i18n/i18n-integrity.test.ts` 中英双语词条完整性门禁）；测试不调用
    CLI、不读本机 `data/`。源码与测试夹具中持有 UUID 或长候选串的变量/字段名不使用 `*Token`、`*Secret`、`*SecretKey`、`*Credential`、
    `*Password`、`*ApiKey` 等后缀。
