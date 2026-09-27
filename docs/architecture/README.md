# 架构（Architecture）

本目录存放两类文档：

- **权威架构文档** [`architecture.md`](architecture.md)：只有一份，说明系统由什么组成、
  进程与模块之间怎么调用、每层的硬约束。
- **技术架构选型文档** `ARCH-NNN-<slug>.md`：可有多份，说明为什么是这几个端、这样部署、
  这门语言、这套栈，以及否决了什么、什么条件下复议。

选型是架构文档的上游：`accepted` 的选型回填进 `architecture.md` 的 §0 / §2 / §7 / §8，
之后下游只引用 `architecture.md`。

选型由 [`/arch-selection`](../../.claude/skills/arch-selection/SKILL.md) 技能产出。评估判准见
[`evaluation-rubric.md`](../../.claude/skills/arch-selection/references/evaluation-rubric.md)，
命名见 [`naming.md`](../../.claude/skills/arch-selection/references/naming.md)，
台账 schema 见
[`architecture.catalog.schema.json`](../../.claude/skills/arch-selection/references/architecture.catalog.schema.json)。

## 目录结构

```
docs/architecture/
├── README.md                    ← 本文：定位 + 结构 + 索引（索引段由脚本重写）
├── architecture.md              ← 权威架构文档；表头「选型依据」指向 accepted 的 ARCH
├── architecture.catalog.jsonl   ← 选型台账，一行一份（脚本维护）
├── ARCH-NNN-<slug>.md           ← 一份选型一份文件；superseded / rejected 原地保留
└── revisions/                   ← 架构变更单 ACR-NNN（/arch-revision），见 revisions/README.md
```

选型层扁平，不按端分子目录。模板与 schema 在技能目录内，不放在本目录。

## 什么时候立一份新的 ARCH

- **基线补记**：项目已建成但没有选型文档时，用 `new --baseline` 把现状架构补记为第一份 ARCH，
  作为后续 ACR 的基线。
- **重大迭代**：换端形态、换部署形态、换语言、上 K8s，或换掉技术栈里框架级的 `adopt` 项
  （如 Next.js）——新立一份，表头写「取代 ARCH-XXX」，旧的改 `superseded`。
- **其它迭代**（引入新依赖、换同层库、升大版本、加模块、改部署细节）不立 ARCH，
  走 [`revisions/`](revisions/) 的 ACR（`/arch-revision`）。

同一时刻只有一份 `accepted`，`register` 会拦第二份。

## 常用命令

```bash
A=.claude/skills/arch-selection/scripts/arch.mjs
node $A find <关键词…>
node $A new <slug> --title "…" --title-en "…" [--baseline] [--req REQ-0001] [--scale small]
node $A probe npm:next npm:croner npm:yaml
node $A check ARCH-001 && node $A dupes ARCH-001
node $A register ARCH-001 --tags=a-b,c-d
node $A probe ARCH-001
node $A validate
```

校验手动执行，不进 CI。

## 索引

<!-- arch-index:start -->
| 编号 | 标题 | 状态 | 日期 | 端 | 部署 | K8s | 取代关系 |
|---|---|---|---|---|---|---|---|
| [ARCH-001](ARCH-001-current-baseline.md) | 现状基线补记 | accepted | 2026-09-25 | dashboard, scheduler, run-once | local | no | — |
<!-- arch-index:end -->
