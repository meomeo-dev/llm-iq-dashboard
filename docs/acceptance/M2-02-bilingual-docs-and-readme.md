# 验收 M2-02：英文主 README 与对外核心文档双语化

> 将 `README.md` 与 5 份对外核心部署、开发与设计文档切换为英文主版，同时归档完整 `.zh-CN.md` 中文版并建立顶部双语互链。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M2-02](../workorders/M2-02-bilingual-docs-and-readme.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-13 |
| 验收结论 | 通过 |
| commit | 23627eb |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | `README.md` 切换为英文主入口并保留 `README.zh-CN.md` 互链 | 两份文件成对存在且顶部互链 | `README.md` 与 `README.zh-CN.md` 已建立互链，正文中链接同步指向对应语种 | `README.md L1-L3`、`README.zh-CN.md L1-L3` | ✅ |
| 2 | 5 份对外核心文档建立英文版与 `.zh-CN.md` 中文版互链 | `deploy-docker`、`deploy-public-showcase`、`development`、`design-notes`、`data-sync-architecture` 成对存在 | 5 组共 10 份双语文档全部就绪，`benchmark-provenance.md` 顶部补充双语导读 | `docs/*.md` 与 `docs/*.zh-CN.md` | ✅ |
| 3 | 更新 `package.json` 与 `config/pelican.example.yaml` 并通过门禁 | YAML 键值不变，类型检查与密钥扫描 0 错误 | `pnpm lint` 与 `pnpm check:secrets`（878 文件 0 问题）全部通过 | `pnpm lint && pnpm check:secrets` | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm lint
pnpm test
pnpm check:secrets
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm lint` | 通过（tsc --noEmit 退出码 0） | 无 |
| `pnpm test` | 通过（配置与 i18n 单测全绿） | 无 |
| `pnpm check:secrets` | 通过（扫描 878 个已跟踪文件，问题 0 项） | 无 |

## 4. 交付物

- `README.md`（英文）与 `README.zh-CN.md`（中文）
- `docs/{deploy-docker,deploy-public-showcase,development,design-notes,data-sync-architecture}.md` 及对应 `.zh-CN.md`
- `docs/benchmark-provenance.md`、`package.json`、`config/pelican.example.yaml`

## 5. 与计划的偏差

无。

## 6. 技术决策

主入口采用英文 `README.md` + `README.zh-CN.md` 互链模式，内部治理文档（`docs/workorders/`、`docs/acceptance/`、`AGENTS.md`）保持中文不变。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|

## 8. 风险与下一步

无阻断风险，继续推进 M2-03（题库展示元数据与评审标准双语映射）。
