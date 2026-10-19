# llm-iq-dashboard 项目工作记忆交接文档 (handoff.md)

> **文档定位**：本文档记录当前项目演进过程中的**动态工作记忆**（上下文背景、已落地的核心变更、关键架构决策、踩坑教训、当前运行状态及下一步待办路线）。  
> 静态架构与编码规范请参考 [`AGENTS.md`](./AGENTS.md)。每次新会话开始时，请优先通读本文档以快速恢复现场工作记忆。  
> **更新日期**：2026-10-19

---

## 一、 项目定位与核心红线

- **核心使命**：面向大语言模型（Claude / Codex / Antigravity `agy` / OpenCode / Grok）的自动化 SVG 视觉基准评测看板与模型统计指纹（Model Fingerprint，ACR-024）核验控制台，支持定时轮次调度、双层作品评审（代码层 30 分 + AI 裁判层 70 分）、题库画廊浏览与公开数据仓脱敏发布。
- **技术栈总览**：Node 22+、pnpm 10+、TypeScript 5、Next.js 15 (App Router) + React 19、chokidar + SSE 实时状态同步、jsdom + playwright-core (Chromium)、node:test 单元测试体系。
- **两仓物理分工**：
  - **主工程看板仓（`llm-iq-dashboard`）**：系统源码与本地控制台（MIT License）。
  - **公开数据仓（[`meomeo-dev/llm-iq-data`](https://github.com/meomeo-dev/llm-iq-data)，本地 `../llm-iq-data`）**：仅存放脱敏后的评测成果（`run.json`、`*.svg`、`index.json`）。
- **核心铁律 / 防御红线**：
  1. **代码与数据严格分离**：`data/`（含 `data/runs/` 与 `data/model-fingerprint/`）严禁入库；`data/model-fingerprint/` 绝不同步至公开数据仓。
  2. **配额与发布红线**：`pnpm run:once`、`pnpm fingerprint fill/check`（不带 `--dry-run`）与 `--ai-only` 评审会真实调用 CLI 消耗配额；向数据仓 `--push` 须经人工确认（CLI 端由 `confirmOrAbort` 拦截，非 TTY 必须显式传 `--yes`）。
  3. **代码长度与 UI 卫生红线**：严格执行 [`config/code-length-policy.yaml`](./config/code-length-policy.yaml)（TS 模块 $\le 500$ 行、TSX 组件 $\le 300$ 行、CSS $\le 300$ 行、函数 $\le 50$ 行）与 [`scripts/check-ui-hygiene.ts`](./scripts/check-ui-hygiene.ts)（Token 化色彩/字号、标准断点、前缀命名隔离）。
  4. **四大名著补全主观作业铁律**：补全四大名著全章节题目时，**严禁使用脚本批量生成题面或标准**；每一回必须先派子代理联网搜索 5–10 轮考证原著情节与阶段衣冠细节，再主观撰写提示词，随后派子代理到 `/tmp` 临时目录实测生图，若不通过则继续优化（每题最多优化 3 轮取最优版本）。

---

## 二、 当前版本核心进展 (Current Milestones)

### 1. 四大名著全章节（460 回 / 920 道候选）补全计划编排（2026-10-19，Ready 待执行）
- **解决诉求**：将四大名著测试题的每一部著作全章节调查补全（《西游记》100 回、《三国演义》120 回、《水浒传》120 回、《红楼梦》120 回，含静态与动态双套题），强制逐回子代理联网调研（5–10 轮）+ 主观写题 + 子代理 `/tmp` 生图测试迭代（最多 3 轮取最优版）。
- **落地计划文件（均已通过 `plan:check` 校验，状态 `ready`）**：
  1. [`plans/20261019_classics-xiyou-100ch_execution-plan.yaml`](./plans/20261019_classics-xiyou-100ch_execution-plan.yaml)（《西游记》全 100 回，`WU-001`~`WU-006`）
  2. [`plans/20261019_classics-sanguo-120ch_execution-plan.yaml`](./plans/20261019_classics-sanguo-120ch_execution-plan.yaml)（《三国演义》全 120 回，`WU-001`~`WU-006`）
  3. [`plans/20261019_classics-shuihu-120ch_execution-plan.yaml`](./plans/20261019_classics-shuihu-120ch_execution-plan.yaml)（《水浒传》全 120 回，`WU-001`~`WU-006`）
  4. [`plans/20261019_classics-honglou-120ch_execution-plan.yaml`](./plans/20261019_classics-honglou-120ch_execution-plan.yaml)（《红楼梦》全 120 回，`WU-001`~`WU-006`）

### 2. 新增「测评题目」画廊页（`/prompts`）与顶栏下拉导航改造（Commit `f5401f7`）
- **解决诉求**：
  1. 删除顶栏冗余的重复页面标题（`.brand-title`），将平铺的页面分段开关（[`PageGroupNav.tsx`](./src/app/components/toolbar/PageGroupNav.tsx)）改造为紧凑的下拉选择菜单。
  2. 新增 `/prompts`「测评题目」（`Benchmark Prompts`）页面，支持筛选搜索工具栏、响应式卡片瀑布流、卡片快捷复制提示词原文，以及点击卡片弹出模态窗查看题目详情（含多场景题组候选切换器、[`StandardCriteriaPanel.tsx`](./src/app/components/modal/StandardCriteriaPanel.tsx) 黄金标准、[`G1`–`G5` / `C1`–`C9`](./src/core/judge/schema.ts) 100 分评审量表、模板变量插槽与生命周期溯源）。
- **落地改动**：
  - 路由与视图模型：[`src/app/prompts/page.tsx`](./src/app/prompts/page.tsx)、[`src/app/prompts/prompts-page-model.ts`](./src/app/prompts/prompts-page-model.ts)
  - 界面组件与样式：[`src/app/prompts/PromptsGalleryPage.tsx`](./src/app/prompts/PromptsGalleryPage.tsx)、[`src/app/prompts/PromptsFilterBar.tsx`](./src/app/prompts/PromptsFilterBar.tsx)、[`src/app/prompts/PromptCard.tsx`](./src/app/prompts/PromptCard.tsx)、[`src/app/prompts/PromptDetailModal.tsx`](./src/app/prompts/PromptDetailModal.tsx)、[`src/app/prompts/prompts-page.css`](./src/app/prompts/prompts-page.css)、[`src/app/prompts/prompts-modal.css`](./src/app/prompts/prompts-modal.css)
  - 国际化词典：[`src/i18n/messages/prompts-page.ts`](./src/i18n/messages/prompts-page.ts)、[`src/i18n/messages/toolbar.ts`](./src/i18n/messages/toolbar.ts)
- **质量验证**：`pnpm lint`、`pnpm check:length`、`pnpm check:ui`、`pnpm check:secrets`、`pnpm validate:prompts` 与 `pnpm test`（1,036 项单测）全绿通过。

### 3. CLI 命令树统一、指纹成本追踪、实时状态同步与 `judge:backfill` 开关（Commit `8611272`）
- **解决诉求**：
  1. 统一 CLI 入口 [`src/bin/pelican.ts`](./src/bin/pelican.ts)（`pnpm pelican <subcommand>`），收敛单复数同义参数（`--effort/--efforts`、`--model/--models/--declared` 等）、TTY 感知安全确认（`confirmOrAbort`）与 4 层模型反查 CLI。
  2. 为 `scripts/judge-backfill.ts` 增加 `PELICAN_DISABLE_JUDGE_BACKFILL=1` 与 `config.judge.backfillEnabled: false` 禁用开关。
  3. 修复 `/fingerprint` 页面跑完后台任务或 CLI 任务后不自动刷新的问题：在 [`src/core/watcher.ts`](./src/core/watcher.ts) 监听 `checks/` 与 `samples/` 变更，并在 [`src/app/fingerprint/FingerprintDashboard.tsx`](./src/app/fingerprint/FingerprintDashboard.tsx) 订阅 `/api/events` SSE 自动拉取最新快照。
  4. 为模型指纹采样与核验引入真實 Token 用量与 USD 成本汇总展示，并实跑验证 `agy` 的 `gemini-4-argon` 与 `gemini-3.8-flash` 渠道核验结果（两模型 6 探针平均相似度 `0.941`，排除同模套壳）。

---

## 三、 关键技术决策与踩坑教训 (Decisions & Lessons Learned)

1. **`src/core/classics/**/*.ts` 的 500 行代码长度硬限制与分卷拆分决策**
   - **背景与陷阱**：[`config/code-length-policy.yaml`](./config/code-length-policy.yaml) 仅豁免了 `src/core/prompts/**`，而 **`src/core/classics/**` 未被豁免**，受 TypeScript 模块 $\le 500$ 行、函数 $\le 50$ 行硬性门禁约束。若将 100~120 回的题面与 `PromptStandard` 塞入单个 `src/core/classics/xiyou.ts`，必然触发 `pnpm check:length` 失败。
   - **最终决策**：在实施四大名著全章节补全计划时，按每 10~12 回拆分为独立子模块 `src/core/classics/<novel>/chNNN-MMM.ts`（每文件控制在 $\le 450$ 行），由 [`src/core/classics/xiyou.ts`](./src/core/classics/xiyou.ts)、[`sanguo.ts`](./src/core/classics/sanguo.ts)、[`shuihu.ts`](./src/core/classics/shuihu.ts)、[`honglou.ts`](./src/core/classics/honglou.ts) 汇总组装导出 `*_PROMPT` 与 `*_ANIM_PROMPT`。

2. **题库 SHA-256 锁定测试（`EXPECTED_BUILTIN_PROMPTS_SHA256`）与候选计数同步**
   - **故障现象**：修改 `BUILTIN_PROMPTS` 中任意题目的 `template` 或 `candidates` 列表后，[`test/i18n/i18n-integrity.test.ts`](./test/i18n/i18n-integrity.test.ts) 中的 `EXPECTED_BUILTIN_PROMPTS_SHA256` 与 `assert.equal(candidateTotal, ...)` 会拦截未授权变更。
   - **终态防范措施**：每部名著在 `WU-001`~`WU-005` 分批推进时，运行 `pnpm lint`、`pnpm check:length` 与 `pnpm validate:prompts` 验证；在该名著的收官单元 `WU-006` 统一补齐 [`src/core/prompts/i18n/labels-en.ts`](./src/core/prompts/i18n/labels-en.ts)（`CLASSICS_CANDIDATES_EN`）、英文标准映射 `src/core/prompts/i18n/standards-classics-<novel>-en.ts`、[`src/bin/validate-prompts.ts`](./src/bin/validate-prompts.ts)（`CANDIDATE_STANDARD_SUITE_IDS`），并同步更新 `test/i18n/i18n-integrity.test.ts` 中的 `EXPECTED_BUILTIN_PROMPTS_SHA256` 与候选总数断言。

3. **`agy` 零工具指纹隔离与不污染全局探针原则**
   - **背景**：`agy` CLI 无 `--tools ""` 硬件级禁用参数，在指纹采样时可能尝试调用 `run_command` 写文件。
   - **最终决策**：严禁修改 `src/core/model-fingerprint/probes/*.ts` 中的全局探针文本（避免破坏 Claude / Codex 等适配器的 Prompt Cache 前缀与既有基准分布），仅在 [`src/adapters/agy.ts`](./src/adapters/agy.ts) 当 `request.fingerprint === true` 时在 `[req:...]` 之前注入内联直出后缀约束。

4. **只读展台与访客模式下的导航可见性**
   - **背景**：`/fingerprint` 仅对配对所有者开放，而 `/`（鹈鹕基准）与 `/prompts`（测评题目）对所有访客及只读展台（`PELICAN_READONLY=1`）开放。
   - **防范措施**：[`PageGroupNav.tsx`](./src/app/components/toolbar/PageGroupNav.tsx) 按 `availableItems.length <= 1` 判断是否隐藏导航；隐藏 `/fingerprint` 后仍保留 `/` 与 `/prompts` 两项，访客与只读展台均可正常下拉切换浏览题库。

---

## 四、 核心代码架构与文件速查 (Architecture Map)

- **四大名著题库与国际化映射**：
  - [`src/core/classics/xiyou.ts`](./src/core/classics/xiyou.ts)：《西游记》静态（`xiyou-v1`）与动态（`xiyou-anim-v1`）套题入口（当前 10 回，待按计划扩展为 100 回）。
  - [`src/core/classics/sanguo.ts`](./src/core/classics/sanguo.ts)：《三国演义》静态（`sanguo-v1`）与动态（`sanguo-anim-v1`）套题入口（当前 10 回，待按计划扩展为 120 回）。
  - [`src/core/classics/shuihu.ts`](./src/core/classics/shuihu.ts)：《水浒传》静态（`shuihu-v1`）与动态（`shuihu-anim-v1`）套题入口（当前 10 回，待按计划扩展为 120 回）。
  - [`src/core/classics/honglou.ts`](./src/core/classics/honglou.ts)：《红楼梦》静态（`honglou-v1`）与动态（`honglou-anim-v1`）套题入口（当前 10 回，待按计划扩展为 120 回）。
  - [`src/core/prompts/i18n/labels-en.ts`](./src/core/prompts/i18n/labels-en.ts)：题组与候选条目英文标题映射（`PROMPT_LABELS_EN`、`CLASSICS_CANDIDATES_EN`）。
  - [`src/core/prompts/i18n/standards-en.ts`](./src/core/prompts/i18n/standards-en.ts)：`PromptStandard` 英文翻译聚合表。
  - [`src/bin/validate-prompts.ts`](./src/bin/validate-prompts.ts)：题库 Schema 与候选级 `PromptStandard` 完整性校验器（`CANDIDATE_STANDARD_SUITE_IDS`）。
- **测评题目画廊页（`/prompts`）**：
  - [`src/app/prompts/prompts-page-model.ts`](./src/app/prompts/prompts-page-model.ts)：题库目录构建、多维筛选搜索与提示词原文复制纯函数模型。
  - [`src/app/prompts/PromptsGalleryPage.tsx`](./src/app/prompts/PromptsGalleryPage.tsx)、[`PromptsFilterBar.tsx`](./src/app/prompts/PromptsFilterBar.tsx)、[`PromptCard.tsx`](./src/app/prompts/PromptCard.tsx)、[`PromptDetailModal.tsx`](./src/app/prompts/PromptDetailModal.tsx)：瀑布流画廊与详情模态窗组件。
- **统一 CLI 与模型指纹核心**：
  - [`src/bin/pelican.ts`](./src/bin/pelican.ts)、[`src/bin/cli-args.ts`](./src/bin/cli-args.ts)、[`src/core/cli-run-selection.ts`](./src/core/cli-run-selection.ts)：统一 CLI 命令树、参数正交词典与临时目标合成。
  - [`src/core/model-fingerprint/`](./src/core/model-fingerprint/)：ACR-024 模型指纹 6 探针采样、JSD 相似度核验与成本统计。

---

## 五、 标准验证、运行与部署流水线指令 (Runbook)

### 1. 运行自动化门禁与测试
```bash
pnpm lint                   # TypeScript 全量类型检查（含 src/、scripts/、test/）
pnpm check:length           # 代码行数与函数长度红线检查
pnpm check:ui               # UI 组件、Token 与 CSS 卫生门禁检查
pnpm check:secrets          # 敏感凭据扫描
pnpm validate:prompts       # 题库 Schema 与黄金标准完整性体检
pnpm test                   # 全量单元测试（1,036 项测试，零 CLI 调用、零 data/ 污染）
```

### 2. 检查四大名著执行计划状态
```bash
for p in plans/20261019_classics-xiyou-100ch_execution-plan.yaml \
         plans/20261019_classics-sanguo-120ch_execution-plan.yaml \
         plans/20261019_classics-shuihu-120ch_execution-plan.yaml \
         plans/20261019_classics-honglou-120ch_execution-plan.yaml; do
  npm --prefix /Users/luojin/.gemini/antigravity-cli/skills/plan-work-unit-orchestration --silent run plan:status -- --root /Users/luojin/git/git-my-code/llm_iq_dashboard "$p"
done
```

### 3. 本地开发与生产看板服务
```bash
pnpm dev --port 3001        # 开发看板 http://127.0.0.1:3001（当前 PID 7873 已在后台运行）
pnpm dashboard:prod         # 生产看板 http://127.0.0.1:3000（当前 PID 42304 已在后台运行）
```

---

## 六、 下一步演进路线与待办清单 (Prioritized Backlog)

新会话开启后，直接按顺序逐个计划、按工作单元（`WU-001` $\rightarrow$ `WU-006`）执行四大名著全章节补全：

- [ ] **P1 - 执行《西游记》全 100 回计划（[`plans/20261019_classics-xiyou-100ch_execution-plan.yaml`](./plans/20261019_classics-xiyou-100ch_execution-plan.yaml)）**：
  - **当前进度**：`status: ready`，下一个待执行单元为 **`WU-001`（第 1–20 回）**。
  - **执行步骤**：
    1. `WU-001`（第 1–20 回，拆分为 `src/core/classics/xiyou/ch001-010.ts` 与 `ch011-020.ts`）
    2. `WU-002`（第 21–40 回，拆分为 `ch021-030.ts` 与 `ch031-040.ts`）
    3. `WU-003`（第 41–60 回，拆分为 `ch041-050.ts` 与 `ch051-060.ts`）
    4. `WU-004`（第 61–80 回，拆分为 `ch061-070.ts` 与 `ch071-080.ts`）
    5. `WU-005`（第 81–100 回，拆分为 `ch081-090.ts` 与 `ch091-100.ts`）
    6. `WU-006`（总装 `src/core/classics/xiyou.ts`、补齐 `labels-en.ts` 与 `standards-classics-xiyou-en.ts`、接入 `CANDIDATE_STANDARD_SUITE_IDS` 并更新 `test/i18n/i18n-integrity.test.ts`）
  - **每回硬性纪律**：派子代理联网搜索 5–10 轮核查维基文库通行百回本原著细节（注意阶段造型：第 1–13 回悟空无金箍与虎皮裙，第 14 回始戴金箍围虎皮裙，第 15 回收白龙马，第 19 回收八戒，第 22 回收沙僧） $\rightarrow$ Agent 主观写题面与 `PromptStandard`（严禁批量脚本） $\rightarrow$ 派子代理在 `/tmp/pelican-xiyou-chNNN-XXXXXX` 生图实测并最多优化 3 轮取最优版，测试后清理 `/tmp`。

- [ ] **P2 - 执行《三国演义》全 120 回计划（[`plans/20261019_classics-sanguo-120ch_execution-plan.yaml`](./plans/20261019_classics-sanguo-120ch_execution-plan.yaml)）**：
  - **当前进度**：`status: ready`，待 P1 完成后按 `WU-001`（第 1–24 回）~ `WU-006` 顺序执行，每 12 回拆分为 `src/core/classics/sanguo/chNNN-MMM.ts`。

- [ ] **P3 - 执行《水浒传》全 120 回计划（[`plans/20261019_classics-shuihu-120ch_execution-plan.yaml`](./plans/20261019_classics-shuihu-120ch_execution-plan.yaml)）**：
  - **当前进度**：`status: ready`，待 P2 完成后按 `WU-001`（第 1–24 回）~ `WU-006` 顺序执行，对照袁无涯刊百二十回全本（含聚义、招安、征辽、征田虎、征王庆、征方腊），每 12 回拆分为 `src/core/classics/shuihu/chNNN-MMM.ts`。

- [ ] **P4 - 执行《红楼梦》全 120 回计划（[`plans/20261019_classics-honglou-120ch_execution-plan.yaml`](./plans/20261019_classics-honglou-120ch_execution-plan.yaml)）**：
  - **当前进度**：`status: ready`，待 P3 完成后按 `WU-001`（第 1–24 回）~ `WU-006` 顺序执行，对照程高百二十回通行本，每 12 回拆分为 `src/core/classics/honglou/chNNN-MMM.ts`。

---

## 七、 会话交接前自检清单 (Pre-Handoff Checklist)

- [x] 代码库 Git 工作区完全干净（最新功能提交 Commit Hash: `f5401f7`，含本交接文档更新提交）。
- [x] 所有门禁与测试全绿（`pnpm lint`、`pnpm check:length`、`pnpm check:ui`、`pnpm check:secrets`、`pnpm validate:prompts`、`pnpm test` 1,036 项单测全部通过）。
- [x] 4 份四大名著执行计划文件已落盘 `plans/` 并全部通过 `plan:check` 校验。
- [x] 本地服务运行状态确认：开发看板 `:3001`（PID `7873`）与生产看板 `:3000`（PID `42304`）均在线运行。
- [x] 遵守代码规范与工程行数红线，100% 恪守数据安全红线，零未授权破坏性操作。
