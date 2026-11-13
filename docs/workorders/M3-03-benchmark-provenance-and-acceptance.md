# 施工单 M3-03：基准出处台账更新与全量质量门禁验收

> 在 `docs/benchmark-provenance.md` 中完整登记 2026 年 10 月 8 道流行评测题目的出处考证、核心物理/几何真值与一票否决规则，顺延生命周期章节，并运行全套质量防御门禁完成 Sprint 最终收口。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M3-00](M3-00-viral-prompts-2026-10.md) |
| 覆盖功能点 | （本单不挂功能点：台账更新与全量回归验收） |
| 依赖工单 | M3-02 |
| 验收文件 | [M3-03](../acceptance/M3-03-benchmark-provenance-and-acceptance.md) |

## 现状（已定位）

实测日期：2026-11-12

- **已有且够用**：
  - 基准出处权威文档 `docs/benchmark-provenance.md`（1750 行），完整登记了此前全部 54 个内置条目（含 2026-09 批次），具备中英双语目录、总览大表、机制考证小节与生命周期规范；
  - 自动化验证门禁：`pnpm validate:prompts`、`pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm check:secrets`、`pnpm build`。
- **已有但缺少新批次**：
  - `docs/benchmark-provenance.md` 第一章总览台账尚未登记 2026-10 批次的 8 道新题；
  - 缺少对应 8 道题目的权威来源链接、首发时间、物理/机械核心机制与一票否决规则小节。

## ⚠️ 关键落地约束（必须先验证）

1. **台账不可篡改与完整性**：
   - 必须为 8 道新题完整登记权威来源（推文 Snowflake ID 链接、HN 讨论串、Gist、arXiv 等）；
   - 必须记录真实首发时间（`originDate: "2026-10"`）与收录时间（`registeredAt: "2026-11-12"`）；
   - 保持后文生命周期章节编号顺延，避免断链。
2. **零破坏性回归**：
   - 必须保证 `pnpm build` 生产构建成功，所有静态与动态路由生成无阻断；
   - 密钥扫描 `pnpm check:secrets` 零报告；
   - 代码长度 `pnpm check:length` 零超标。

## 任务

### 1. 更新基准出处总览大表

- 在 `docs/benchmark-provenance.md` 的 §一 全量测试题目总览表中追加 8 行记录（序号顺延）：
  - 题目 ID、题目名称、领域分类、呈现形式（纯内联动画）、首发时间（`2026-10`）、收录时间（`2026-11-12`）、权威来源出处。

### 2. 建立 2026-10 专题机制与一票否决小节

- 新建小节（如 §二十八 2026 年 10 月流行 AI 评测基准），详细记录：
  - 分组设计理念（精密机械连杆、多足步态行波、流体驻波干涉与非定向流形）；
  - 逐题逐条记录呈现形式、出处链接、核心机制与黄金基准 (Ground Truth)、判读准则与一票否决规则（0 分项）。

### 3. 顺延后续章节并更新目录索引

- 更新文档开篇的 English Section & Prompt ID Index 索引表；
- 确保后文的《题目生命周期与淘汰机制》、《题目数据建模契约与自动化完整性门禁》与《参考资料与上游链接》章节编号依次顺延。

### 4. 全量质量防御门禁验收

- 运行 `pnpm validate:prompts`；
- 运行 `pnpm lint`；
- 运行 `pnpm test`；
- 运行 `pnpm check:length`；
- 运行 `pnpm check:secrets`；
- 运行 `pnpm build`。

### 不改的地方（红线）

- 既有题目的考证描述与出处链接逐字不动；
- 不修改既有已通过测试的业务逻辑代码；
- 保证数据仓契约 `src/core/data-repo/contract.ts` 保持一致。

### 测试

- 执行 `pnpm validate:prompts`，全库题目校验 100% 通过；
- 执行 `pnpm test`，全量测试套件全部绿灯；
- 执行 `pnpm build`，生产打包 100% 成功。

## 验收

```bash
pnpm validate:prompts
pnpm lint
pnpm test
pnpm check:length
pnpm check:secrets
pnpm build
```

## 回报格式

1. `pnpm validate:prompts` 题库体检输出；
2. `docs/benchmark-provenance.md` 出处台账新增内容与章节编号顺延检查；
3. 全量测试与质量门禁（`pnpm test`, `pnpm lint`, `pnpm check:length`, `pnpm check:secrets`, `pnpm build`）全绿报告。

## 边界

- 允许修改：`docs/benchmark-provenance.md`；
- 禁止修改：既有题目的考证描述与出处链接。

## 依赖

- 前置依赖：[M3-02](M3-02-grouping-october-prompts.md)；
- 依赖 2026-10 题库代码就绪。
