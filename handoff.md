# llm-iq-dashboard 项目工作记忆交接文档 (handoff.md)

> **文档定位**：本文档记录当前项目演进过程中的**动态工作记忆**（上下文背景、已落地的核心变更、关键架构决策、踩坑教训、当前运行状态及下一步待办路线）。  
> 静态架构与编码规范请参考 [`AGENTS.md`](./AGENTS.md)。每次新会话开始时，请优先通读本文档以快速恢复现场工作记忆。  
> **更新日期**：2026-11-14

---

## 一、 项目定位与核心红线

- **核心使命**：面向大语言模型（Claude / Codex / Antigravity `agy` / OpenCode / Grok）的自动化 SVG 视觉基准评测看板与模型统计指纹（Model Fingerprint，ACR-024）核验控制台，支持定时轮次调度、双层作品评审（代码层 30 分 + AI 裁判层 70 分）、题库画廊浏览与公开数据仓脱敏发布。
- **技术栈总览**：Node 22+、pnpm 10+、TypeScript 5、Next.js 15 (App Router) + React 19、chokidar + SSE 实时状态同步、jsdom + playwright-core (Chromium)、node:test 单元测试体系。
- **两仓物理分工**：
  - **主工程看板仓（`llm-iq-dashboard`）**：系统源码与本地控制台（MIT License）。
  - **公开数据仓（[`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data)，本地 `../llm-iq-data`）**：仅存放脱敏后的评测成果（`run.json`、`*.svg`、`index.json`）。
- **核心铁律 / 防御红线**：
  1. **代码与数据严格分离**：`data/`（含 `data/runs/` 与 `data/model-fingerprint/`）严禁入库；`data/model-fingerprint/` 绝不同步至公开数据仓。
  2. **配额与发布红线**：`pnpm run:once`、`pnpm fingerprint fill/check`（不带 `--dry-run`）与 `--ai-only` 评审会真实调用 CLI 消耗配额；向数据仓 `--push`（主仓请先区分 `local-git-my-code` 与公开 `origin`）须经人工确认。
  3. **代码长度与 UI 卫生红线**：严格执行 [`config/code-length-policy.yaml`](./config/code-length-policy.yaml)（TS 模块 $\le 500$ 行、TSX 组件 $\le 300$ 行、CSS $\le 300$ 行、函数 $\le 50$ 行）与 [`scripts/check-ui-hygiene.ts`](./scripts/check-ui-hygiene.ts)（Token 化色彩/字号、标准断点、目录级类名唯一所有权）。
  4. **四大名著补全主观作业铁律**：补全四大名著全章节题目时，**严禁使用脚本批量生成题面或标准**；每一回必须先派子代理联网搜索 5–10 轮考证原著情节与阶段衣冠细节，再主观撰写提示词，随后派子代理到 `/tmp` 临时目录实测生图，若不通过则继续优化（每题最多优化 3 轮取最优版）。

---

## 二、 当前版本核心进展 (Current Milestones)

### 1. 时间线执行态四宫格显示与 SSE 增量同步改造（2026-11-14）
- **解决诉求**：
  1. 运行进行中时，时间线泳道不显示 2×2 四宫格占位；
  2. 运行结束后结果不自动出现在看板界面中；
  3. 废弃 `router.refresh()` 整页刷新与定时轮询，改为精确增量同步。
- **落地改动**：
  - **写序与监听闭环**：[`src/core/runner.ts`](./src/core/runner.ts) 的 `onDone` 与 `finishRunRecord` 改为先排空并落盘 `run.json` 再更新 `progress.json`；[`src/core/runs-revision.ts`](./src/core/runs-revision.ts) 基于最近轮次 `run.json` / `*.judge.json` 的 `stat` 聚合生成轻量修订号 `runsRevision`；[`src/app/api/events/live-hub.ts`](./src/app/api/events/live-hub.ts) 与 [`route.ts`](./src/app/api/events/route.ts) 放行 `run.json` / `*.judge.json` 监听并广播 `runs-revision` SSE 事件。
  - **增量 JSON 接口与前端状态同步**：新增共享窗口加载器 [`dashboard-window.ts`](./src/app/components/dashboard/dashboard-window.ts) 与 [`src/app/api/dashboard/route.ts`](./src/app/api/dashboard/route.ts)（`GET /api/dashboard?day=...`）；移除 [`useRunProgress.ts`](./src/app/components/run-status/useRunProgress.ts) 中的 `router.refresh()`；[`use-dashboard-sync.ts`](./src/app/components/dashboard/use-dashboard-sync.ts) 订阅 [`live-store.ts`](./src/app/components/live-state/live-store.ts) 的 `runsRevision`，仅在修订号变化时用 `AbortController` 请求当前窗口 JSON 就地替换状态。
  - **四宫格实时合成与渲染态**：[`merge-live-progress.ts`](./src/app/components/dashboard/merge-live-progress.ts) 将 `ProgressView` 中的 `running` / `queued` 调用合成为内存 `DashboardCard` 占位（跳过 `jobKind` 指纹作业与已失活轮次，真实卡片落盘后即时覆盖）并同步补充 `runStarts`；[`Thumb.tsx`](./src/app/components/timeline/Thumb.tsx)、[`FolderTile.tsx`](./src/app/components/timeline/FolderTile.tsx)、[`moments.ts`](./src/app/components/timeline/moments.ts)、[`PelicanCard.tsx`](./src/app/components/card/PelicanCard.tsx)、[`ModelModal.tsx`](./src/app/components/model-modal/ModelModal.tsx)、[`dashboard-calc.ts`](./src/app/components/dashboard/dashboard-calc.ts)、[`pass-rate.ts`](./src/app/components/timeline/pass-rate.ts) 与 [`timeline-svg.ts`](./src/app/components/export/timeline-svg.ts) 适配 `liveState` 显示与统计口径。
- **质量验证**：新增 [`live-sync.test.ts`](./test/app/components/dashboard/live-sync.test.ts) 与更新 [`live-hub-watch.test.ts`](./test/app/api/live-hub-watch.test.ts)，`pnpm test` 共 **176 suites / 1,071 tests** 全绿，`pnpm lint`、`pnpm check:ui`、`pnpm check:length`、`pnpm check:secrets`、`pnpm validate:prompts`、`pnpm build` 及在线 `:3001` `/api/dashboard`、`/api/events` 验证通过。

### 2. 全仓代码审查 23 项缺陷加固与测试补全（2026-11-14）
- **解决诉求**：按 [`review/project-code-review/2026-11-13.md`](./review/project-code-review/2026-11-13.md) 逐一完成高/中/低优先级问题修复并固化回归测试。
- **落地改动**：覆盖 Auth Cookie `SameSite=Lax` 与非对称校验、数据同步互斥锁与脱敏二次检查、SVG 标签平衡提取与 DOMPurify 净化/缓存策略、模型指纹样本原子写入与校验、`codex app-server` 超时收敛、历史时区偏移精准标注（`dayOffsetLabel`）、进度完成签名与系统 UI 原语收敛，新增 [`review-2026-11-13.test.ts`](./test/core/review-2026-11-13.test.ts)。

---

## 三、 关键技术决策与踩坑教训 (Decisions & Lessons Learned)

1. **`useDashboardSync` 严禁直接在 `useEffect` 依赖数组监听外部浅引用对象**
   - **故障现象**：当调用方或测试传入内联数组/对象（如 `cards={[]}`、`promptLabels={{}}`）时，`setSnapshot` 触发重渲染会产生新对象引用，引发 `Maximum update depth exceeded` 无限重渲染。
   - **终态防范措施**：在 [`use-dashboard-sync.ts`](./src/app/components/dashboard/use-dashboard-sync.ts) 中以稳定的 `propSignature(input)` 字符串对比决定是否重置基线状态，并用 `pickedDayRef` 隔离日期变更与 `liveRunsRevision` 拉取副作用，同时用 `useMemo` 稳定 `mergeLiveProgress` 返回引用。
2. **`runner.ts` 与 `live-hub.ts` 的文件写序与监听闭环**
   - **故障现象**：此前 `progress.markDone` / `progress.finish` 先于 `saveRun` 落盘，且 `live-hub.ts` 忽略 `run.json` 与 `*.judge.json`，导致结束或评审更新后看板收不到数据刷新信号。
   - **终态防范措施**：`runner.ts` 一律先 `writer.enqueue(() => saveRun(...))` / `writer.drainOrThrow()` + `await saveRun(record)`，再更新 `progress.json`；`live-hub.ts` 放行 `run.json` 与 `*.judge.json` 并通过 `computeRunsRevision()`（仅做目录与文件 `stat`，不读全文）推送 `runs-revision`。
3. **跨目录 CSS 主类名唯一所有权（`pnpm check:ui` UI-04）**
   - **防范措施**：新增实时样式严格留在各自组件目录拥有主类名下（`.thumb-running` / `.thumb-queued` / `.folder-live` / `.status-dot.status-running` 在 [`src/app/components/timeline/`](./src/app/components/timeline/)，`.frame-live` / `.status-text.status-running` 在 [`src/app/components/card/`](./src/app/components/card/)），只使用 [`tokens.css`](./src/app/tokens.css) 变量。
4. **题库分卷与 SHA-256 锁定红线（沿用）**
   - `src/core/prompt/bank/literature/` 按分卷 `chNNN-MMM.ts` 组织以遵守代码长度门禁；改动题库后须跑 `pnpm validate:prompts` 并同步 [`test/i18n/i18n-integrity.test.ts`](./test/i18n/i18n-integrity.test.ts) 的 `EXPECTED_BUILTIN_PROMPTS_SHA256`。

---

## 四、 核心代码架构与文件速查 (Architecture Map)

- **实时看板同步与四宫格合成**：
  - [`src/core/runs-revision.ts`](./src/core/runs-revision.ts)：基于 `stat` 计算本地轮次集合与 `run.json` / `*.judge.json` 轻量修订标记 `computeRunsRevision`。
  - [`src/app/api/events/live-hub.ts`](./src/app/api/events/live-hub.ts)、[`src/app/api/events/route.ts`](./src/app/api/events/route.ts)：监听 `progress.json`、`run.json`、`*.judge.json` 与指纹作业，推送 SSE（含 `runs-revision`）。
  - [`src/app/api/dashboard/route.ts`](./src/app/api/dashboard/route.ts)、[`src/app/components/dashboard/dashboard-window.ts`](./src/app/components/dashboard/dashboard-window.ts)：`GET /api/dashboard` 日期窗口增量数据接口与 SSR 共用加载器。
  - [`src/app/components/dashboard/use-dashboard-sync.ts`](./src/app/components/dashboard/use-dashboard-sync.ts)、[`src/app/components/dashboard/merge-live-progress.ts`](./src/app/components/dashboard/merge-live-progress.ts)：SSE 驱动的就地增量拉取与执行中四宫格占位合成。
- **执行调度与题目画廊**：
  - [`src/core/runner.ts`](./src/core/runner.ts)：按模型分道调度、`run.json` 先于 `progress.json` 写盘保障。
  - [`src/core/prompt/bank/`](./src/core/prompt/bank/)（含 `literature/{xiyou,sanguo,shuihu,honglou}`）与 [`src/app/prompts/`](./src/app/prompts/)：全量题库与 `/prompts` 画廊页。

---

## 五、 标准验证、运行与部署流水线指令 (Runbook)

### 1. 运行自动化门禁与测试
```bash
pnpm lint                   # TypeScript 全量类型检查（含 src/、scripts/、test/）
pnpm check:ui               # UI 组件、Token 与 CSS 卫生门禁检查（322 个文件）
pnpm check:length           # 代码行数与函数长度红线检查（714 个文件）
pnpm check:secrets          # 敏感凭据扫描（1689 个已跟踪文件）
pnpm validate:prompts       # 题库 Schema 与黄金标准完整性体检（171 题 / 1,140 候选）
pnpm test                   # 全量单元测试（176 suites / 1,071 tests，零 CLI 调用）
pnpm build                  # Next.js 生产构建检查
```

### 2. 本地开发与生产看板服务
```bash
pnpm dev --port 3001        # 开发看板 http://127.0.0.1:3001（当前后台 PID 25748 / next-server 25756 在线）
pnpm dashboard:prod         # 生产看板 http://127.0.0.1:3000（按已提交 HEAD 构建启动）
```

---

## 六、 下一步演进路线与待办清单 (Prioritized Backlog)

> 注：[`plans/`](./plans/) 下四大名著全章节补全计划（`20261019_classics-{xiyou,sanguo,shuihu,honglou}-*`）及 `M3`（`2026-10` 热点题库）均已收尾完成（`status: completed`）。

- [ ] **P1 - 按需重建生产看板 `:3000`**：待确认本次提交合入 `main` 后，执行 `pnpm dashboard:prod` 更新同级生产工作副本（开发看板 `:3001` 仅作实时调试使用）。
- [ ] **P2 - 端到端真实执行流浏览器目视复核**：下次发起 `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once`（需用户授权消耗配额）或自动调度触发时，在看板观察 `queued` → `running` → 真实 SVG 缩略图覆盖 → 整轮结束与 AI 评审徽章原地自动刷新的完整动效。
- [ ] **P3 - 公开仓按需同步（人工门禁）**：确认本地轮次准备对外公开后，先 `pnpm sync:data --repo ../llm-iq-data --dry-run` 预检，经人工确认后再执行同步推送。

---

## 七、 会话交接前自检清单 (Pre-Handoff Checklist)

- [x] 本次提交完成全部文档同步（`README.md`、`README.zh-CN.md`、`CHANGELOG.md`、`AGENTS.md`、`handoff.md`）并清理工作区。
- [x] 所有质量门与测试全绿（`pnpm lint`、`pnpm check:ui`、`pnpm check:length`、`pnpm check:secrets`、`pnpm validate:prompts`、`pnpm test` 176 suites / 1,071 tests、`pnpm build`）。
- [x] 本地开发看板 `:3001`（`PID 25748` / `25756`）在线且 `/api/dashboard`、`/api/events`（含 `runs-revision`）响应正常。
- [x] 遵守代码行数红线、UI 卫生检查、两仓分离与安全推送策略（仅推送 `local-git-my-code`，未未经许可推送公开 `origin`）。
