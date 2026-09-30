# ACR-019: 动态鹈鹕车评审打分（Judge Scoring for Animated Pelican）

| 项 | 内容 |
|---|---|
| 状态 | approved |
| 日期 | 2026-09-30 |
| 变更类型 | add-dependency |
| 触发来源 | 口头：动态鹈鹕车（animated-pelican-v1）的结果要打「智商在线 / 降智」标签并给百分制分数；方案见 `docs/research/judge/animated-pelican-judging.md`，记录结构见同目录 `judge.schema.json` |
| 基线 | ARCH-001 |
| 影响章节 | §3 §4 §7 |
| 改造面上限 | 3 个模块（测试目录与源模块同构：src/core、src/app 各带一个 test 目录） |
| 取代 / 被取代 | 无 |

本 ACR 只覆盖方案的代码层（静态解析、渲染量测、联系图、评审记录与看板标签）。
AI 语义层要给适配器加「评审模式」并在执行进程里排评审队列，涉及 `src/adapters` 与 `src/bin`，
待代码层在本地 44 幅作品上校准后另立 ACR。

## 动机

- 现状：每次调用只记 `ok` / `no-svg` / `error` / `timeout`，`ok` 只表示提取到了 SVG；动态鹈鹕车
  的作品是不是真的在动、车轮绕不绕轴心、有没有飞出画布，只能人工逐幅点开看。
  题目自带的 `standard.evaluationCriteria` 已写明"绕全局 (0,0) 旋转判零分"等口径，但没有任何代码执行它。
- 不动的代价：本地已有 13 轮、44 幅作品，之后每轮还在增加；没有分数就没法在看板上横比各家的动画能力，
  也没法给作品贴标签。
- 为什么现在：用户明确要求给动态鹈鹕车打「智商在线 / 降智」标签与 0–100 分，方案已写成
  `docs/research/judge/`，需要在动代码前把新依赖与新产物登记进架构。

## 方案评估

渲染量测需要一个真的能跑 SMIL 与 CSS 动画的引擎；静态解析沿用已在用的 jsdom。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| playwright-core：无头 Chromium 定格动画、量包围盒、截联系图 | npm:playwright-core | 1.63.0 | Apache-2.0 | 2026-09-04 | active | 1 个模块（src/core，另加 package.json） | 低：微软维护；浏览器二进制运行时下载，不入仓库 | adopt | - |
| puppeteer-core：同为无头 Chromium 驱动 | npm:puppeteer-core | 25.12.0 | Apache-2.0 | 2026-09-23 | active | 1 个模块 | 低：谷歌维护 | reject | 与 playwright-core 能力等价；visual-ruler 技能已按 Playwright/CDP 口径量测看板，选同一家少一套浏览器管理 |
| @resvg/resvg-js：Rust 光栅化器 | npm:@resvg/resvg-js | 2.6.2 | MPL-2.0 | 2024-03-26 | unmaintained | 1 个模块 | 高：30 个月未发布；MPL-2.0 弱传染，与 MIT 发布不宜混用 | reject | 维护成本：unmaintained 且 MPL-2.0；不渲染动画，只能出首帧 |
| pixelmatch：帧差比较 | npm:pixelmatch | 7.2.0 | ISC | 2026-04-29 | active | 1 个模块 | 低 | reject | 改造面：帧差在 Chromium 内用 canvas 一次算完，不值得多一个依赖 |
| 全部自研：含自写 SVG 光栅化与动画时间轴 | self | - | - | - | - | 2 个模块（src/core、src/app），但要自造 SMIL / CSS 动画引擎 | 高：自维护一个渲染引擎 | reject | 改造面：动画引擎非本仓库领域逻辑；打分规则（解析、旋转中心、周期、记录、标签）仍自写，因为它们是题目自带口径，没有现成实现 |

> **结论**：playwright-core 负责渲染与截图，其余自研 —— 打分规则是本仓库题目自带的口径，没有现成实现；
> 浏览器引擎不自造。参考来源（OpenEnv `pelican_svg_env`、LiveSVG）只借思路，按净室流程实施，
> 登记进 `.ip-compliance/ingress-ledger.jsonl`。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `package.json` | modify | `dependencies` 增 `playwright-core`；`scripts` 增 `judge:backfill`（对 `data/runs` 回填评审） | no |
| `pnpm-lock.yaml` | modify | 随依赖更新 | no |
| `src/core/judge/schema.ts` | add | 评审记录类型与 `judge.schema.json` 的 TypeScript 对应；rubric 常量（闸门、标准、分值、阈值） | no |
| `src/core/judge/static-judge.ts` | add | jsdom 静态解析：G1–G3、C1–C4 静态分 | no |
| `src/core/judge/render-judge.ts` | add | playwright-core 定格取样：G4–G5、C1–C4 渲染分、联系图（一行 8 帧） | no |
| `src/core/judge/judge-store.ts` | add | `{attemptKey}.judge.json` 与 `.sheet.png` 的读写，原子替换 | no |
| `src/core/runner.ts` | modify | `ok` 调用落盘后同步调用代码层评审，结果不影响 `Attempt` 字段 | no |
| `src/core/storage.ts` | modify | 读轮次时附带评审记录，供看板显示 | no |
| `src/app/components/card/` | modify | 结果卡片显示标签（在线 / 降智 / 待复核）与分数，展开看逐条标准 | no |
| `test/core/judge/` | add | 静态解析与记录读写的单元测试，用固定 SVG 夹具，不启动浏览器 | no |
| `docs/architecture/architecture.md` | modify | §3 增评审口径、§4 增评审产物、§7 增 `src/core/judge/` | no |
| `docs/research/judge/` | add | 方案与 schema（已写） | no |

**不动的东西**：

- `Attempt` 与 `RunRecord` 的字段：评审结果只在独立的 `.judge.json` 里，`run.json` 逐字不变。
- 考场约束（ACR-006）：被测 CLI 仍在空目录、无工具下调用；评审在调用结束后于本进程内执行。
- `src/adapters`、`src/bin`、`src/capabilities`：本 ACR 不碰。
- 数据仓契约 `src/core/data-repo/contract.ts`：评审记录是否同步到 `llm-iq-data` 留给 AI 层 ACR 一并决定。
- 题目登记与 `standard` 文本：评审 rubric 在 `src/core/judge/schema.ts` 另写，不改题目。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 评审是新增产物，不改既有记录；配置项 `judge.enabled`（缺省 true）
关闭后 runner 不评审，看板遇到没有 `.judge.json` 的作品不显示标签。Chromium 不可用时渲染层记 `skip`，
只出静态分，`verdict` 保持 `pending`。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | - | - | | |
| `pnpm test` | node:test 单测，含新增的 `test/core/judge/` | - | - | | |
| `pnpm build` | Next.js 看板生产构建 | - | - | | |
| `pnpm check:length` | 文件与函数长度阈值 | - | - | | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链，`ok` 调用之后生成 `.judge.json` | - | - | | 真实调用 CLI，须已登录 |
| `pnpm judge:backfill -- --dry-run` | 对本地 `data/runs` 全量回填不落盘，检查静态解析不抛错 | - | - | | 变更前不存在，记 - |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | `src/core/judge/schema.ts` + `static-judge.ts` + `judge-store.ts` + 单测；`judge:backfill` 脚本对本地 44 幅出分，人工核对 | revert 本 commit |
| 2 | runner 在 `ok` 落盘后调用静态评审；`judge.enabled` 开关 | revert 本 commit |
| 3 | 引入 playwright-core；`render-judge.ts` 定格取样、联系图、渲染分与静态分取低 | revert 本 commit，删依赖 |
| 4 | 看板卡片显示标签与分数，展开逐条标准 | revert 本 commit |
| 5 | 回填 architecture.md §3 §4 §7；登记 ingress-ledger | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；评审拖慢调用道（单幅静态解析超过 1 s 或渲染超过 10 s）；Chromium 在 runner 容器内起不来且无法降级。
- 步骤：按步逆序 revert，最多 5 个 commit；第 3 步回滚同时 `pnpm remove playwright-core`。
- 数据：`.judge.json` 与 `.sheet.png` 是附加文件，回滚后留在 `data/runs/` 里不碍事，随轮次保留期一起删除；`run.json` 未改无需迁回。

## 人工确认

### 方案摘要

1. 要动什么：新增 `src/core/judge/` 打分模块与 playwright-core 依赖，runner 在 `ok` 后评审，看板卡片贴标签；涉及 2 个模块（src/core、src/app）。
2. 不动什么：`run.json` 字段、考场约束、三家适配器、数据仓契约、题目文本。
3. 为什么现在：本地已有 44 幅动态鹈鹕车作品无法判优劣；方案与 schema 已写好，动代码前先登记。
4. 风险与回滚：Chromium 在容器内不可用则只出静态分；最坏 5 个 commit 逆序 revert，附加文件不用迁。
5. 成本：5 步；新增一个 Apache-2.0 依赖（微软维护），浏览器二进制运行时下载不入仓库；AI 层另立 ACR，本 ACR 不花配额。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-30 | 用户 | approved | 代码层先行；AI 语义层另立 ACR |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §3 | 增一条：动态题的作品在 `ok` 落盘后由 `src/core/judge` 按题目口径评审，闸门任一不过判降智，总分 ≥ 60 判在线 | 待回填 |
| architecture.md §4 | `runs/{runId}/` 增 `{attemptKey}.judge.json` 与 `.sheet.png`；`run.json` 不变 | 待回填 |
| architecture.md §7 | `src/core/judge/` 目录职责 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-019 | 待回填 |
| ADR（/adr-curator） | 不适用：附加产物，可整体回滚 | 待回填 |
