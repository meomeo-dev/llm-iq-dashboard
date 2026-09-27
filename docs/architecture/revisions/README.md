# 架构变更（Revisions）

每次架构变更一份 `ACR-NNN-<slug>.md`（Architecture Change Request），记录变更内容、开源
候选评估、回归保证、确认记录与回滚方式。ACR 是 [`../architecture.md`](../architecture.md)
变更记录的上游：`done` 的 ACR 把结论回填进权威文档，并在其表头「变更记录」追加编号。

由 [`/arch-revision`](../../../.claude/skills/arch-revision/SKILL.md) 技能产出。判准见
[`revision-rubric.md`](../../../.claude/skills/arch-revision/references/revision-rubric.md)，
命名见 [`naming.md`](../../../.claude/skills/arch-revision/references/naming.md)，
台账 schema 见
[`revisions.catalog.schema.json`](../../../.claude/skills/arch-revision/references/revisions.catalog.schema.json)。

## 五条铁律

| # | 铁律 | 谁守 |
|---|---|---|
| 1 | 迭代不破坏既有功能 | `done` 要求「兼容与回归」全 pass 且带真实 commit；`revision.mjs regress --run` 跑清单 |
| 2 | 禁止大范围重构 | 「变更范围」涉及模块数 ≤ 上限（默认 3）、不整包删、必写「不动的东西」；`scope --diff` 拿真实 git diff 抓越界 |
| 3 | 更新前人工确认 | `approved` 及之后要求「确认记录」有 approved 行；`brief` 拼出十行草稿给人读 |
| 4 | 先找开源，别造轮子 | 「方案评估」至少一个开源候选；自研 adopt 时每个开源候选的否决理由必须落在改造面 / 维护成本 |
| 5 | 与选型 / 权威文档对齐 | 基线必须是 accepted 的 ARCH；`done` 要求回填全 已回填 / 不适用 |

## 该立 ACR 还是别的

- 换端形态 / 部署形态 / 语言 / 上 K8s / 换框架级 adopt 项（如 Next.js）→ **推翻基线，去 `/arch-selection` 新立 ARCH**。
- 引入新依赖、换同层库、升大版本、加模块（如新增一家 CLI 适配器）、改部署细节、改目录职责 → **ACR**。
- 升小版本、改配置、修 bug → 不立，走正常 issue；踩坑记 `adr-curator incident add`。
- 同一处第三次被动 → 先 `/adr-recall`。

## 目录结构

```
docs/architecture/revisions/
├── README.md                  ← 本文：定位 + 铁律 + 索引（索引段由脚本重写）
├── revisions.catalog.jsonl    ← 变更台账，一行一份（脚本维护）
└── ACR-NNN-<slug>.md          ← 一次变更一份；done / rejected / rolled-back 原地保留
```

扁平，不按年份分。状态只前进：`draft → awaiting-approval → approved → implementing → done`，
中途放弃 `rejected`，上线后回滚 `rolled-back`。

## 常用命令

```bash
R=.claude/skills/arch-revision/scripts/revision.mjs
node $R find src/core/scheduler.ts
node $R new <slug> --title "…" --title-en "…" --type <变更类型> [--trigger REQ-0001]
node $R probe npm:<pkg> github:<owner>/<repo>
node $R check ACR-001 && node $R scope ACR-001
node $R register ACR-001 --tags=a-b,c-d
node $R brief ACR-001
node $R scope ACR-001 --diff main
node $R regress ACR-001 --run
node $R validate
```

校验手动执行，不进 CI；持续检查由 `pnpm lint` 等仓库脚本承担。

## 索引

<!-- acr-index:start -->
| 编号 | 标题 | 状态 | 日期 | 类型 | 方案 | 改造面 | 确认 | 回归 | 取代关系 |
|---|---|---|---|---|---|---|---|---|---|
| [ACR-001](ACR-001-client-data-fetching.md) | 前端状态与取数改用 SWR | rejected | 2026-09-25 | add-dependency | SWR | 1 包 | — | 0/5 | 被 ACR-002 取代 |
| [ACR-002](ACR-002-dashboard-live-push.md) | 看板状态改为 SSE 推送 | done | 2026-09-25 | add-dependency | SSE：better-sse（服务端）+ chokidar（监听 data/）+ 浏览器原生 EventSource | 3 包 | ✓ 2026-09-25 | 5/6 | 取代 ACR-001 |
| [ACR-003](ACR-003-dashboard-lazy-art.md) | 看板作品按需加载，去掉定时整页刷新 | done | 2026-09-25 | structure-change | 自研 | 2 包 | ✓ 2026-09-25 | 4/5 | — |
| [ACR-004](ACR-004-root-layout-tidy.md) | 根目录只留工具约定入口，Docker 文件归入 docker/，生成物不入库 | done | 2026-09-26 | structure-change | 沿用 create-next-app 模板的约定：next-env.d.ts 与 *.tsbuildinfo 不入库；配合 BuildKit 的 Dockerfile 同名忽略文件（docker/Dockerfile.dockerignore）把 Docker 文件归入 docker/ | 3 包 | ✓ 2026-09-26 | 5/6 | — |
| [ACR-005](ACR-005-component-and-docs-layout.md) | 界面文档路径改为英文，看板组件按职责归入子目录 | done | 2026-09-26 | structure-change | 按 Next.js 项目结构指南的做法，组件按功能分目录、就近放置；文档路径用英文 kebab-case | 3 包 | ✓ 2026-09-26 | 6/7 | — |
| [ACR-006](ACR-006-model-guardrails.md) | 模型层收口：禁用 CLI 工具、宿主机上限与输出泄漏拦截 | done | 2026-09-26 | structure-change | 用三家 CLI 自带的权限开关禁用工具：claude --tools ""、codex approvalPolicy: untrusted（适配器拒绝一切审批）、agy 仅 --sandbox | 3 包 | ✓ 2026-09-26 | 3/4 | — |
| [ACR-007](ACR-007-owner-pairing-auth.md) | 所有者配对登录与公开只读 | done | 2026-09-26 | new-module | 自研 | 4 包 | ✓ 2026-09-26 | 6/6 | — |
| [ACR-008](ACR-008-split-web-runner.md) | 看板与执行器分容器，凭据只在执行器 | done | 2026-09-26 | deployment-change | 自研 | 6 包 | ✓ 2026-09-26 | 5/6 | — |
<!-- acr-index:end -->
