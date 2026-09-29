# ACR-015: 跑一次多选上游 profile（Run Once: Multi-Select Upstream Profiles）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-29 |
| 变更类型 | structure-change |
| 触发来源 | 口头：选好 codex gpt-6-sol high 与题目后，开始前要能多选 profile；设计见 docs/profiles/profile-display-ux.md §2，前置 ACR-014 |
| 基线 | ARCH-001 |
| 影响章节 | §1 §3 §5 |
| 改造面上限 | 4 个模块（测试目录与源模块同构：src/app、src/core 各带一个 test 目录） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：ACR-014 之后 profile 能跑，但"跑一次"面板只列矩阵里逐条登记的目标；同模型不同上游的同名强度按钮
  落在同一列互相重叠，用户要比三个上游得先在配置页把每个模型 × 强度 × 上游各登记一遍。
- 不动的代价：多上游对比这个核心用法没有入口，只能手写 YAML 走 `run:once`。
- 为什么现在：三个上游已配置好 key 并通过冒烟，用户在等这个入口。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 用 Radix Dialog 做"选择 Profile"二级模态 | npm:@radix-ui/react-dialog | 1.1.23 | MIT | 2026-07-24 | active | 2 个模块（src/app 与 package.json），另需把已有的模态窗迁到同一套或并存 | 中：新增依赖树，与仓库自有 `use-modal-behavior` 两套焦点与滚动锁并存 | reject | 改造面：为一个模态引入组件库；仓库已有 `model-modal/use-modal-behavior.ts` 提供 Esc、焦点归还与滚动锁，复用只动 src/app 1 个模块 |
| 自研：面板不变，页脚按钮三态；多上游时打开复用 `use-modal-behavior` 的二级模态；`RunSelection.profiles` 由 `narrowConfig` 展开组合 × 上游 | self | - | - | - | - | 2 个模块（src/app、src/core） | 低：只用仓库既有模态行为与配置模型 | adopt | - |

> **结论**：自研 —— 上游选择是本仓库特有的领域交互，模态行为已有可复用实现，不需要新依赖。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/run-selection.ts` | modify | `RunSelection.profiles?`；有值时 `targetIds` 视为 `cli · model · effort` 组合，按上游展开：矩阵里已有同 id 的目标沿用，没有的按组合合成（id 由 `buildTargetId` 生成，只存在于本轮）；校验上游存在、启用、CLI 支持、模型在清单内；不传 `profiles` 时行为逐字不变 | no |
| `src/core/config/targets.ts` | modify | 导出 `defaultLabel`，合成目标的显示名与解析配置时一致 | no |
| `src/app/api/run/run-request.ts` | modify | 解析可选 `profiles: string[]` | no |
| `src/app/api/run/run-options.ts` | add | 组合去重、上游清单（公开字段 + 是否已填 key）、登录态被拦但有可用上游时仍列出该 CLI 的组合 | no |
| `src/app/api/run/route.ts` | modify | GET 增 `profiles`（名字、显示名、CLI、启用、是否已填 key、模型清单）与 `profileClis`；`targets` 按组合去重（去掉 profile 段） | no |
| `src/app/components/run-control/run-once-api.ts` | modify | `postRun` 带 `profiles` | no |
| `src/app/components/run-control/run-once-profiles.ts` | add | 纯函数：本轮可用上游及不可用原因、调用数、按钮三态 | no |
| `src/app/components/run-control/run-selection-store.ts` | modify | 存储与解析上游勾选（缺省全部可用项） | no |
| `src/app/components/run-control/use-run-once-selection.ts` | modify | 上游勾选状态与更新回调 | no |
| `src/app/components/run-control/use-run-once-launcher.ts` | modify | 发起时带上游 | no |
| `src/app/components/run-control/use-run-once-profiles.ts` | add | 上游选择状态：按钮形态、可选上游、勾选与二级模态开合，面板在模态打开期间不被外点或 Esc 关闭 | no |
| `src/app/components/run-control/RunOnceFooter.tsx` | modify | 按钮三态：`开始（N 次调用）` / `选择 Profile 后开始` / 置灰 `没有可用的上游` | yes |
| `src/app/components/run-control/RunOnceProfileModal.tsx` | add | 二级模态：复述条件、上游复选清单、`开始（M 个 Profile，共 N 次调用）` | no |
| `src/app/components/run-control/RunOnceMenu.tsx` | modify | 接入模态与上游勾选 | no |
| `src/app/components/run-control/run-control-profiles.css` | add | 模态样式，固定宽 420px | no |
| `src/app/components/run-control/run-control.css` | modify | 引入新样式文件 | no |
| `test/core/run-selection.test.ts` | modify | 组合 × 上游展开、合成目标、各类拒绝 | no |
| `test/app/api/run-request.test.ts` | modify | `profiles` 解析 | no |
| `test/app/api/run-options.test.ts` | add | 组合去重、上游清单不含接口地址、登录态被拦时的补列 | no |
| `test/app/components/run-control/run-once-profiles.test.ts` | add | 可用性、原因、调用数、按钮三态 | no |
| `test/app/components/run-control/run-selection-store.test.ts` | modify | 上游勾选的存储与缺省 | no |

**不动的东西**：

- 面板两栏布局与宽度；范围、题目的勾选逻辑；不含 codex 目标时的按钮与发起路径逐字不变。
- 定时轮次：仍只跑矩阵里 `enabled` 的目标，不受上游勾选影响。
- 运行时（ACR-014）：放行、分道、会话池不变；缺 key 仍由 runner 在放行时拦下记 error。
- `src/bin/runner.ts`：分容器时同样经 `narrowConfig` 展开，不需改动。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 请求体不带 `profiles` 即旧语义，配置页"立即执行"与旧前端缓存照常工作。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | pass | cabed61 | 变更前 6797610 |
| `pnpm test` | node:test 全量 | pass | pass | cabed61 | 变更前 6797610 722 项；变更后 736 项 |
| `pnpm check:length` | 文件与函数长度门禁 | pass | pass | cabed61 | 变更前 6797610 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | cabed61 | 变更前 bd14e0d；变更后以 `NEXT_DIST_DIR` 输出到临时目录，避开运行中的开发服务器 |
| `PELICAN_CONFIG=data/profile-smoke.config.yaml pnpm run:once` | 端到端冒烟：3 个 profile 同轮并行（动态鹈鹕车） | pass | pass | cabed61 | 变更前轮次 20260929T140327Z；变更后经看板“跑一次”→ 选择 Profile 模态发起轮次 20260929T144441Z（gpt-6-sol · low × 3 profile）3/3 ok，POST /api/run 202。登录态冒烟因所有者已停订阅不跑 |

看板交互（面板按钮三态、模态勾选与发起）在分步实施里用开发服务器人工核对，不进回归表。

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 服务端：`RunSelection.profiles` 展开与校验、请求体解析、GET 可选范围增上游 | revert 本 commit |
| 2 | 前端：上游可用性纯函数、勾选存储、按钮三态、二级模态、发起带上游 | revert 本 commit |
| 3 | 本单登记与 architecture.md 回填（docs） | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；不带 `profiles` 的发起路径出现新错误。
- 步骤：逆序 revert 两个代码 commit；旧前端缓存里没有上游字段，回滚后按缺省解析。
- 数据：合成目标只存在于本轮，`run.json` 里的记录与矩阵登记的目标形状相同，无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：跑一次面板不变，页脚按钮按可用上游数三态；多上游时打开"选择 Profile"模态；服务端把组合 × 上游展开成本轮目标；涉及 src/core、src/app 及其测试 4 个模块。
2. 不动什么：面板布局、定时轮次、运行时放行与分道、runner。
3. 为什么现在：三个上游已就绪，多上游对比缺入口。
4. 风险与回滚：最坏是展开逻辑把上游错配到目标——服务端按 CLI 与模型清单校验，runner 放行再拦一次；回滚 = 逆序 revert 2 个 commit。
5. 成本：3 步 3 个 commit；无新依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-29 | luojin | approved | 设计文档 docs/profiles/profile-display-ux.md（6797610）已确认，AskUserQuestion 批准 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §1 | 跑一次：组合 × 上游在服务端展开，合成目标只存在于本轮 | 已回填 |
| architecture.md §3 | `RunSelection.profiles` 的校验规则 | 已回填 |
| architecture.md §5 | 上游勾选记在浏览器本地存储 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-015 | 已回填 |
| ADR（/adr-curator） | 不适用：非难逆转，无被否决的架构级方案 | 已回填 |
