# 施工单 M1-03：基准出处台账更新与全量质量门禁验收

> 在基准出处台账（`docs/benchmark-provenance.md`）中完整登记 10 道新题目的学术与社区来源、评测背景与许可协议，并运行全量质量门禁完成最终工程验收与留痕。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M1-00](M1-00-viral-eval-prompts-grouping.md) |
| 覆盖功能点 | （本单不挂功能点：基准出处台账更新与质量门禁收口，独立自闭环） |
| 依赖工单 | [M1-02](M1-02-grouping-classic-and-september.md) |
| 验收文件 | [M1-03](../acceptance/M1-03-benchmark-provenance-and-acceptance.md) |

## 现状（已定位）

实测日期：2026-10-10

- **已有且够用**：
  - `docs/benchmark-provenance.md`：记载了既有题目的出处来源与口径规范（鹈鹕、四大名著、地标、前沿工程、VFX、微观物理等）；
  - 仓库质量门禁脚本集：`pnpm check:length`、`pnpm check:secrets`、`pnpm lint`、`pnpm test`、`pnpm validate:prompts`。
- **已有但未登记**：
  - `docs/benchmark-provenance.md` 尚未登记本次入库的 10 道 2026 秋季流行评测题目。
- **需要验收**：
  - 需要在完成所有代码改动与文档补充后，统一执行全套质量门禁，并在验收文件中完整记录证据。

## ⚠️ 关键落地约束（必须先验证）

1. **出处真实性与中立性**：
   - Q01–Q04 出处溯源为 Kris Chase 技术制图开源设计（Free to use, remix, ship）；
   - Q05–Q07 出处溯源为 2026 年 9 月 Hacker News 社区公开讨论题号（49982139、49578488、49573027）；
   - Q08–Q10 出处溯源为 2026 年 9 月 EMNLP 2026 空间几何评测论文（CC BY 4.0 开放许可）；
   - 彻底避免商业商标与未经审查的草稿叙事，语言客观中立。
2. **零泄漏与行数门禁**：
   - 必须通过 `pnpm check:secrets`，确认文档与代码无任何敏感凭据；
   - 必须通过 `pnpm check:length`，确认文档与代码未突破行数上限。

## 任务

### 1. 更新基准出处台账

- 在 `docs/benchmark-provenance.md` 中新增 2026 秋季流行基准章节：
  - 详细登记 10 道题目的 ID、标题、来源出处、许可协议、核心评测维度与一票否决门禁；
  - 标明犰狳与狐猴归属经典基准、其余 8 题归属 2026-09 分组的设计依据。

### 2. 执行全量质量门禁与验收收口

- 依次运行全套质量门禁：
  1. `pnpm validate:prompts`：校验题库规格与评分真值；
  2. `pnpm lint`：校验全库 TypeScript 类型安全；
  3. `pnpm test`：运行全部单元测试；
  4. `pnpm check:length`：校验文件与函数长度合规；
  5. `pnpm check:secrets`：进行代码安全与敏感信息扫描。
- 回填 `docs/acceptance/M1-03-benchmark-provenance-and-acceptance.md` 验收结果。

### 不改的地方（红线）

- 既有题目的出处描述与历史判定记录保持不变；
- 不引入未使用的外部依赖；
- 不修改既有测试用例预期。

### 测试

- 执行 `pnpm validate:prompts`，断言 46 道题目全量通过；
- 执行 `pnpm lint`，断言 0 错误；
- 执行 `pnpm test`，断言全量用例通过；
- 执行 `pnpm check:length`，断言超标为 0；
- 执行 `pnpm check:secrets`，断言泄漏为 0。

## 验收

```bash
pnpm validate:prompts
pnpm lint
pnpm test
pnpm check:length
pnpm check:secrets
```

## 回报格式

1. 5 项质量门禁执行命令的完整输出与通过证明；
2. `docs/benchmark-provenance.md` 新增内容概览；
3. 验收文件回填状态。

## 边界

- 允许修改：`docs/benchmark-provenance.md`、`docs/acceptance/M1-03-benchmark-provenance-and-acceptance.md`；
- 禁止修改：核心引擎代码、未涉及的业务组件。

## 依赖

- 依赖 [M1-01](M1-01-register-viral-prompts.md) 与 [M1-02](M1-02-grouping-classic-and-september.md) 全部完成。
