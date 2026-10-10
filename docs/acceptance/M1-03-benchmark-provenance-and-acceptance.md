# 验收 M1-03：基准出处台账更新与全量质量门禁验收

> 更新 docs/benchmark-provenance.md 登记 10 道新题目的出处来源与背景，并执行全量质量门禁完成 Sprint 最终验收与留痕。
> 本文档是**收口记录**：证据可复跑、偏差可追溯、遗留有去向。
> 与工单的关系：工单（`../workorders/`）描述"怎么施工"，本文回答"做完了没有、证据是什么、欠了什么"。

| 项 | 内容 |
|---|---|
| 对应工单 | [M1-03](../workorders/M1-03-benchmark-provenance-and-acceptance.md) |
| 覆盖功能点 | 无（本单不挂功能点） |
| 验收日期 | 2026-10-10 |
| 验收结论 | 通过 |
| commit | `9713d49` |

> 「验收结论」只能是 **通过** / **有条件通过（条件列明）** / **不通过** / **待定**。
> 「commit」是代码提交的哈希；**回填单独一个提交，不要 `--amend`**——本文是 commit 号的唯一记录处。

## 1. 验收要点逐条

| # | 判定条目 | 预期 | 实际 | 证据 | 状态 |
|---|---|---|---|---|---|
| 1 | 出处台账新增 10 道题目完整记录 | 包含来源、许可协议与一票否决规则 | 已在 docs/benchmark-provenance.md 新增第二十四节并扩充总表 | `docs/benchmark-provenance.md#L182-L192` | ✅ |
| 2 | validate:prompts 门禁通过 | 54 道内置题、140 道前沿单题、16 套题 candidate 全量校验通过，0 错误 | 扫描 194 项提示词与候选，0 项属性缺失 | `pnpm validate:prompts` | ✅ |
| 3 | lint 类型安全门禁通过 | tsc --noEmit 0 错误 | tsc --noEmit 0 错误通过 | `pnpm lint` | ✅ |
| 4 | 全量单测 test 门禁通过 | 全量单元测试 100% 通过 | 911/911 tests passed (147 suites) | `pnpm test` | ✅ |
| 5 | 代码行数 check:length 门禁通过 | 零超标违规 | 扫描 422 个文件，超标 0 项 | `pnpm check:length` | ✅ |
| 6 | 密钥安全 check:secrets 门禁通过 | 零敏感信息泄漏 | 扫描 843 个已跟踪文件，问题 0 项 | `pnpm check:secrets` | ✅ |

## 2. 功能点逐条验收

| 功能点 | 标题 | 验收要点/AC | 状态 | 证据 |
|---|---|---|---|---|
| （本单不挂功能点） | | | | |

## 3. 自动化验证汇总（可复跑）

```bash
# 按依赖顺序排列（复制自工单「验收」节）
pnpm validate:prompts
pnpm lint
pnpm test
pnpm check:length
pnpm check:secrets
```

| 命令 | 结果 | 前置条件 |
|---|---|---|
| `pnpm validate:prompts` | 通过 (194 项 0 缺失) | 无 |
| `pnpm lint` | 通过 (0 errors) | 无 |
| `pnpm test` | 通过 (911/911 passed) | 无 |
| `pnpm check:length` | 通过 (0 violations) | 无 |
| `pnpm check:secrets` | 通过 (0 leaks) | 无 |

## 4. 交付物

更新 `docs/benchmark-provenance.md` 与验收留痕文件。

## 5. 与计划的偏差

无。

## 6. 技术决策

保持出处中立客观，严格遵循开源许可（CC BY 4.0 / Free to use）。

## 7. 已知限制与技术债

| # | 限制 | 影响 | 去向 |
|---|---|---|---|

## 8. 风险与下一步

无阻断风险，全量门禁通过后由 /sprint-acceptance 生成 Sprint M1-00 收口总结。
