# llm-iq-dashboard 项目工作记忆交接文档 (handoff.md)

> **文档定位**：本文档记录当前项目演进过程中的**动态工作记忆**（上下文背景、已落地的核心变更、关键架构决策、踩坑教训、当前运行状态及下一步待办路线）。  
> 静态架构与编码规范请参考 [`AGENTS.md`](./AGENTS.md)。每次新会话开始时，请优先通读本文档以快速恢复现场工作记忆。  
> **更新日期**：2026-11-15（版本 `v0.9.0`）

---

## 一、 项目定位与核心红线

- **核心使命**：面向大语言模型（Claude / Codex / Antigravity `agy` / OpenCode / Grok）的自动化 SVG 视觉基准评测看板与模型统计指纹（Model Fingerprint，ACR-024）核验控制台，支持定时轮次调度、同轮次原地补跑与单卡重跑、双层作品评审（代码层 30 分 + AI 裁判层 70 分）、题库画廊浏览与公开数据仓脱敏发布。
- **技术栈总览**：Node 22+、pnpm 10+、TypeScript 5、Next.js 15 (App Router) + React 19、chokidar + SSE 实时状态同步、jsdom + playwright-core (Chromium)、node:test 单元测试体系。
- **两仓物理分工**：
  - **主工程看板仓（`llm-iq-dashboard`）**：系统源码与本地控制台（MIT License）。
  - **公开数据仓（[`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data)，本地 `../llm-iq-data`）**：仅存放脱敏后的评测成果（`run.json`、`*.svg`、`index.json`）。
- **核心铁律 / 防御红线**：
  1. **代码与数据严格分离**：`data/`（含 `data/runs/` 与 `data/model-fingerprint/`）严禁入库；`data/model-fingerprint/` 绝不同步至公开数据仓。
  2. **配额与发布红线**：`pnpm run:once`、`pnpm pelican run --retry <runId>`（不带 `--dry-run`）、`pnpm fingerprint fill/check`（不带 `--dry-run`）与 `--ai-only` 评审会真实调用 CLI 消耗配额；向数据仓 `--push` 或向公开远端推送须经人工确认。
  3. **代码长度与 UI 卫生红线**：严格执行 [`config/code-length-policy.yaml`](./config/code-length-policy.yaml)（TS 模块 $\le 500$ 行、TSX 组件 $\le 300$ 行、CSS $\le 300$ 行、函数 $\le 50$ 行）与 [`scripts/check-ui-hygiene.ts`](./scripts/check-ui-hygiene.ts)（Token 化色彩/字号、标准断点、目录级类名唯一所有权）。
  4. **四大名著补全主观作业铁律**：补全四大名著全章节题目时，**严禁使用脚本批量生成题面或标准**；每一回必须先派子代理联网搜索 5–10 轮考证原著情节与阶段衣冠细节，再主观撰写提示词，随后派子代理到 `/tmp` 临时目录实测生图，若不通过则继续优化（每题最多优化 3 轮取最优版）。

---

## 二、 当前版本核心进展 (Current Milestones)

### 1. 同轮次原地重跑与单卡重试（In-Place Run Retry & Single-Attempt Retry，2026-11-14）
- **解决诉求**：针对单次评测调用偶发 `error`、`timeout`、`no-svg` 或整轮中途取消/中断遗留未完成项，支持在既有 `runId` 内原地重跑失败项或单张卡片，保留同轮已成功作品、严格锁定原轮随机抽样候选项（`RenderedPrompt[]` 与 `harnessGuard`），避免重复消耗配额或产生碎片化新时间线列（设计方案见 [`docs/architecture/in-place-run-retry-plan.md`](./docs/architecture/in-place-run-retry-plan.md)）。
- **落地改动**：
  - **核心规划与编排层**：新增 [`src/core/run/retry.ts`](./src/core/run/retry.ts)（`planRunRetry`、`executeRunRetry`），复用既有 `run.json` 的 `prompts` 与 `harnessGuard`（若历史 `target` 已从当前配置移除则自动合成回退 `Target`）；将不在重跑范围内的记录预填至 `slots` 前缀，并在重跑前调用 [`src/core/store.ts`](./src/core/store.ts) 的 `cleanAttemptArtifacts` 清理旧 `.svg`/`.txt`/`.judge.json`/`.sheet*.png` 与 [`src/core/run-cancel.ts`](./src/core/run-cancel.ts) 的 `clearCancel` 移除旧 `cancel.json`；抽取 [`src/core/runner.ts`](./src/core/runner.ts) 的 `runPreparedLanes` 供新轮次与原地重跑共用；[`src/core/progress.ts`](./src/core/progress.ts) 的 `listRecentProgress` 新增 `readLockedRunId()`，确保重跑较早历史轮次时仍进入活跃进度流。
  - **接口与 CLI 层**：扩展 [`src/core/run-selection.ts`](./src/core/run-selection.ts) 的 `RunSelection`（`retryRunId?`、`includeNoSvg?`），零侵入兼容分容器请求队列；[`src/app/api/run/run-request.ts`](./src/app/api/run/run-request.ts)、[`src/app/api/run/route.ts`](./src/app/api/run/route.ts) 与 [`src/bin/runner.ts`](./src/bin/runner.ts) 支持重试请求路由；[`src/bin/run-once.ts`](./src/bin/run-once.ts) 新增 `--retry <runId>` 与 `--include-no-svg`（可组合 `--target`、`--prompt`、`--dry-run`）。
  - **看板 UI 与实时状态覆盖**：新增单卡重试组件 [`src/app/components/card/CardRetryButton.tsx`](./src/app/components/card/CardRetryButton.tsx)（抽离 [`CardFrames.tsx`](./src/app/components/card/CardFrames.tsx) 使 [`PelicanCard.tsx`](./src/app/components/card/PelicanCard.tsx) 保持 242 行 $\le 300$ 行红线）与批量重试组件 [`src/app/components/run-control/RetryRunButton.tsx`](./src/app/components/run-control/RetryRunButton.tsx)（挂载于 [`RunStatus.tsx`](./src/app/components/run-status/RunStatus.tsx) 顶部面板与 [`ModelModal.tsx`](./src/app/components/model-modal/ModelModal.tsx) 四宫格弹窗头部）；[`src/app/components/dashboard/merge-live-progress.ts`](./src/app/components/dashboard/merge-live-progress.ts) 新增 `overlayActiveLiveStates` 实时将重跑中的失败卡片覆盖为 `running` / `queued`。
- **质量验证**：新增 [`test/core/run-retry.test.ts`](./test/core/run-retry.test.ts)，全量测试（**179 suites / 1,079 tests**）与全部门禁全绿。

### 2. `2026-11-h1` X 社区热点视觉与动态基准题组扩充（20 道纯内联动态 SVG 题，2026-11-14）
- **解决诉求**：将 2026 年 11 月上半月 X 社区高传播度大模型视觉、物理机械与动态评测题转化为纯内联动态矢量 SVG 基准题组 `2026-11-h1`。
- **落地改动**：
  - 调研报告与 20 题实测归档于 [`docs/research/x-viral-ai-evals-2026-11/`](./docs/research/x-viral-ai-evals-2026-11/)，溯源登记更新于 [`docs/benchmark-provenance.md`](./docs/benchmark-provenance.md)。
  - 新增题组目录 [`src/core/prompt/bank/benchmarks/2026-11-h1/`](./src/core/prompt/bank/benchmarks/2026-11-h1/)（含 `ids.ts`、`index.ts`、`display-en.ts` 与 `items/01..20` 共 20 道纯内联 CSS/SMIL 动态 SVG 题目），并在 [`src/core/prompt/bank/index.ts`](./src/core/prompt/bank/index.ts)、[`src/core/prompt/i18n/index.ts`](./src/core/prompt/i18n/index.ts)、[`src/core/prompt/i18n/standards-en.ts`](./src/core/prompt/i18n/standards-en.ts)、[`src/app/prompts/prompts-page-model.ts`](./src/app/prompts/prompts-page-model.ts) 与 [`src/app/components/run-control/run-once-grouping.ts`](./src/app/components/run-control/run-once-grouping.ts) 完成注册与分组。
  - 同步更新 [`test/fixtures/prompt-resolution-snapshot.json`](./test/fixtures/prompt-resolution-snapshot.json) 与 [`test/i18n/i18n-integrity.test.ts`](./test/i18n/i18n-integrity.test.ts)（内置核心题库 `BUILTIN_PROMPTS` 由 31 题升至 **51 题**，连同 140 道前沿单题总计 **191 题 / 1,140 候选**，`EXPECTED_BUILTIN_PROMPTS_SHA256` 更新为 `6aab3dcddf1fa69f62d2a5f61ede9ec886f68ff57c82b568036eb6a40a3c0f5d`）。

### 3. 时间线执行态四宫格显示与 SSE 增量同步改造（2026-11-14）
- **落地改动**：`runner.ts` 先排空并落盘 `run.json` 再更新 `progress.json`；`live-hub.ts` 监听 `run.json` / `*.judge.json` 并广播 `runs-revision` SSE 事件；`use-dashboard-sync.ts` 仅在修订号变化时请求 `GET /api/dashboard` 就地更新；`merge-live-progress.ts` 将 `running` / `queued` 调用实时合成为四宫格占位。

### 4. 全仓代码审查 23 项缺陷加固与测试补全（2026-11-14）
- **落地改动**：按 [`review/project-code-review/2026-11-13.md`](./review/project-code-review/2026-11-13.md) 完成全部 23 项加固修复并新增 [`review-2026-11-13.test.ts`](./test/core/review-2026-11-13.test.ts)。

---

## 三、 关键技术决策与踩坑教训 (Decisions & Lessons Learned)

1. **采用 Run 级原地重跑 + Attempt 级全新单轮调用，拒绝 CLI 会话级 `--resume` 续传**
   - **背景与争议**：当单次调用超时或中断时，是否用 CLI 的 `--resume` 会话续传？
   - **最终决策与原因**：(1) 本基准核心规则是单轮零样本直出（Single-Turn Zero-Shot），`--resume` 会破坏零样本可比性并将半截 `<svg>` 残片混入上下文造成拼接污染；(2) 三家 CLI 会话机制不一致（`codex app-server` 显式 `ephemeral: true` 不落盘会话、`claude` 虽有 `session_id` 但违背无痕隔离、`agy` 无机器可读会话 ID）；(3) Run 级原地重跑直接复用 `existingRecord.prompts`（锁定 `candidateId`）与 `harnessGuard`，兼具零样本公平性与免重跑已成功卡片的配额经济性。
2. **原地重跑的四大状态不变量：`slots` 预填、`cleanAttemptArtifacts`、`clearCancel` 与 `readLockedRunId`**
   - **故障风险**：(1) `runner.ts` 以 `slots.filter(Boolean)` 生成 `run.json`，若不预填 `keptAttempts` 会冲掉原轮已成功记录；(2) 若重跑由 `no-svg` 变为 `error`/`timeout`，旧 `.svg`/`.judge.json` 若不清理会残留幽灵产物；(3) 对曾被手动取消的轮次重跑时，若不删旧 `cancel.json`，`watchCancel` 会在 1 秒内再次中止重跑；(4) `listRecentProgress(3)` 默认只取最新 3 个 `runId`，若重跑更早的历史轮次，看板收不到实时进度。
   - **终态防范措施**：在 `executeRunRetry` 中先调 `clearCancel(runId)` 与 `cleanAttemptArtifacts(...)`，再将 `keptAttempts` 预填进 `slots` 前缀并保存初始快照；在 `progress.ts` 的 `listRecentProgress` 中读取 `active-execution.lock` 的 `readLockedRunId()`，把正在原地重跑的旧 `runId` 置顶纳入监听。
3. **`mergeLiveProgress` 中重跑完成瞬间的竞态防护（`finishedAt < activeSince`）**
   - **故障现象**：当单卡重跑刚完成、`run.json` 已落盘（`status: "ok"`），而 `progress.json` 尚未刷到 `done` 的微秒级窗口内，若无条件用 `activeCalls` 覆盖已有卡片，会把刚完成的成功卡片闪回 `running` 状态。
   - **终态防范措施**：在 [`merge-live-progress.ts`](./src/app/components/dashboard/merge-live-progress.ts) 的 `overlayActiveLiveStates` 中严格校验 `card.status !== "ok" && Date.parse(card.finishedAt) < active.activeSince`，仅覆盖重跑开始前遗留的旧失败卡片。
4. **严禁在 `next dev` 运行期间同目录执行 `pnpm build`（避免 `.next/` 产物损坏白屏）**
   - **故障现象**：开发服务器 `pnpm dev` 在线时执行 `pnpm build`，Next.js 会覆写共享的 `.next/` 目录导致开发态 webpack chunk 索引错乱或页面白屏。
   - **终态防范措施**：执行 `pnpm build` 前若 `next dev` 正在运行，应在构建后清理 `.next` 并重启 `pnpm dev --port 3001`；生产环境独立使用 `pnpm dashboard:prod`（在同级独立工作副本中构建运行 `:3000`）。
5. **历史沉淀教训（沿用）**：
   - `useDashboardSync` 以稳定的 `propSignature(input)` 字符串对比决定是否重置基线状态，严禁直接在 `useEffect` 依赖数组监听外部浅引用对象；
   - `runner.ts` 先落 `run.json` 再写 `progress.json`，`live-hub.ts` 监听 `run.json` / `*.judge.json` 并推送 `runs-revision`；
   - 新增样式严格留在各自组件目录拥有主类名下，遵守 [`scripts/check-ui-hygiene.ts`](./scripts/check-ui-hygiene.ts) UI-04 规则。

---

## 四、 核心代码架构与文件速查 (Architecture Map)

- **同轮次原地重跑与执行编排**：
  - [`src/core/run/retry.ts`](./src/core/run/retry.ts)：`planRunRetry` 与 `executeRunRetry`，负责目标回退合成、`keptAttempts` 预填、旧产物清理与分道重跑。
  - [`src/core/runner.ts`](./src/core/runner.ts)、[`src/core/store.ts`](./src/core/store.ts)、[`src/core/run-cancel.ts`](./src/core/run-cancel.ts)：`runPreparedLanes` 共用执行管线、`cleanAttemptArtifacts` 旧文件清理、`clearCancel` 取消标记清理。
  - [`src/app/components/card/CardRetryButton.tsx`](./src/app/components/card/CardRetryButton.tsx)、[`src/app/components/card/CardFrames.tsx`](./src/app/components/card/CardFrames.tsx)、[`src/app/components/run-control/RetryRunButton.tsx`](./src/app/components/run-control/RetryRunButton.tsx)：单卡、四宫格弹窗与顶部运行面板的原地重试交互入口。
- **实时看板同步与四宫格合成**：
  - [`src/core/runs-revision.ts`](./src/core/runs-revision.ts)、[`src/core/progress.ts`](./src/core/progress.ts)：轻量修订标记 `computeRunsRevision` 与支持历史轮次重跑置顶的 `listRecentProgress`。
  - [`src/app/api/events/live-hub.ts`](./src/app/api/events/live-hub.ts)、[`src/app/components/dashboard/use-dashboard-sync.ts`](./src/app/components/dashboard/use-dashboard-sync.ts)、[`src/app/components/dashboard/merge-live-progress.ts`](./src/app/components/dashboard/merge-live-progress.ts)：SSE 增量同步与 `overlayActiveLiveStates` 实时状态合成。
- **题库与画廊**：
  - [`src/core/prompt/bank/`](./src/core/prompt/bank/)（含新增 [`benchmarks/2026-11-h1/`](./src/core/prompt/bank/benchmarks/2026-11-h1/) 及 `literature/{xiyou,sanguo,shuihu,honglou}`）与 [`src/app/prompts/`](./src/app/prompts/)：51 道在用内置题 + 31 道归档题 + 140 道前沿单题（共 191 题 / 1,140 候选）与 `/prompts` 画廊页。

---

## 五、 标准验证、运行与部署流水线指令 (Runbook)

### 1. 运行自动化门禁与测试
```bash
pnpm lint                   # TypeScript 全量类型检查（含 src/、scripts/、test/）
pnpm check:ui               # UI 组件、Token 与 CSS 卫生门禁检查（325 个文件）
pnpm check:length           # 代码行数与函数长度红线检查（741 个文件）
pnpm check:secrets          # 敏感凭据扫描（1696+ 个已跟踪文件）
pnpm validate:prompts       # 题库 Schema 与黄金标准完整性体检（51 内置 + 140 前沿 = 191 题 / 1,140 候选）
pnpm test                   # 全量单元测试（179 suites / 1,079 tests，零 CLI 调用）
pnpm build                  # Next.js 生产构建检查
```

### 2. 原地重跑与本地看板服务
```bash
pnpm pelican run --retry <runId> --include-no-svg --dry-run
pnpm dev --port 3001        # 开发看板 http://127.0.0.1:3001
pnpm dashboard:prod         # 生产看板 http://127.0.0.1:3000（按已提交 HEAD 独立构建启动）
```

---

## 六、 下一步演进路线与待办清单 (Prioritized Backlog)

- [ ] **P1 - 按需重建生产看板 `:3000`**：本次提交合入 `main` 后，执行 `pnpm dashboard:prod` 更新同级生产工作副本。
- [ ] **P2 - 原地重试真实调用端到端目视验收**：在看板或 CLI 针对含 `error` / `timeout` / `no-svg` 的真实历史轮次执行一次单卡重试或 `--retry <runId>`（需用户授权消耗配额），观察原轮四宫格实时从失败态转为 `running` 再落盘更新。
- [ ] **P3 - 公开仓按需同步（人工门禁）**：确认本地轮次准备对外公开后，先 `pnpm sync:data --repo ../llm-iq-data --dry-run` 预检，经人工确认后再执行同步推送。

---

## 七、 会话交接前自检清单 (Pre-Handoff Checklist)

- [x] 本次提交完成 `2026-11-h1` 题组、同轮次原地重跑及全部文档同步（`README.md`、`README.zh-CN.md`、`CHANGELOG.md`、`AGENTS.md`、`handoff.md`）。
- [x] 所有质量门与测试全绿（`pnpm lint`、`pnpm check:ui`、`pnpm check:length`、`pnpm check:secrets`、`pnpm validate:prompts`、`pnpm test` 179 suites / 1,079 tests）。
- [x] 遵守代码行数红线、UI 卫生检查、两仓分离与公开仓库脱敏规范（全部相对路径化，无本机路径或远端别名泄露）。
