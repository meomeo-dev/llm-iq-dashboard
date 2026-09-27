# ACR-009: 运行结果公开数据仓与只读展台（Public data repository and read-only showcase）

| 项 | 内容 |
|---|---|
| 状态 | awaiting-approval |
| 日期 | 2026-09-27 |
| 变更类型 | new-module |
| 触发来源 | 口头：按 handoff.md 实现运行结果与代码仓分离、公开数据仓同步与只读展台 |
| 基线 | ARCH-001 |
| 影响章节 | §4 §6 §8 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：运行结果只存在本机 `data/runs/`，保留期到了直接删除；看板只能在本机或容器里看，
  没有可公开访问、可长期引用的结果归档。
- 不动的代价：历史结果随修剪丢失；公开展示只能暴露运行评测的本机服务，写能力与 CLI 登录态
  都在同一进程边界内。
- 为什么现在：评测矩阵与题库已稳定（183 项题目校验通过），需要把结果沉淀为可引用的公开数据，
  并提供不带写能力的公网展示入口。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| simple-git 封装 git 操作 | npm:simple-git | 4.0.2 | MIT | 2026-09-26 | active | 1 个模块（src/core） | 低：社区维护，新增一项运行时依赖 | reject | 改造面：同步只用 add/commit/push/fetch/merge-base/log 六条命令，execFile 直调同样只动 src/core 1 个模块，引入依赖不减少改造面 |
| isomorphic-git 纯 JS 实现 git | npm:isomorphic-git | 1.42.2 | MIT | 2026-09-11 | active | 1 个模块（src/core） | 中：需自行接入 http 传输与凭据，与宿主机 git 配置不共用 | reject | 维护成本：绕开宿主机 git 的身份与凭据助手，要另建凭据接入；依赖树随之增大 |
| 自研：execFile 调宿主机 git，Next.js 数据源抽象读取数据仓 | self | - | - | - | - | 3 个模块（src/core、src/app、src/bin） | 低：沿用宿主机 git 与现有读路径 | adopt | - |

> **结论**：自研 —— git 只用少量命令，直调宿主机 git 可复用用户身份与凭据；展台复用现有卡片与成本计算。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| src/core/data-repo/contract.ts | add | 数据仓布局、记录契约与永不发布题目清单 | no |
| src/core/sync/ | add | 脱敏导出、泄漏扫描、索引、台账、git 适配与编排 | no |
| src/bin/sync-data.ts | add | `pnpm sync:data` 命令 | no |
| src/core/retention.ts | modify | 修剪只删已发布轮次 | yes |
| src/core/runner.ts | modify | 轮次结束后按 dataRepo.autoSync 同步 | no |
| src/core/config.ts | modify | 新增 dataRepo 配置段 | no |
| src/core/deploy-mode.ts | add | PELICAN_READONLY 与 PELICAN_DATA_SOURCE 解析 | no |
| src/core/data-source/ | add | 本地与远程数据源 | no |
| src/core/auth/ | modify | 只读部署下拒绝会话、写接口与密钥生成 | no |
| src/app/ | modify | 页面与路由经数据源读取；只读徽章；/api/health | no |
| next.config.ts | modify | 价格目录随函数打包 | no |
| scripts/showcase-smoke.ts | add | 只读展台端到端冒烟 | no |
| package.json | modify | 新增 sync:data、showcase:smoke 脚本 | no |
| config/pelican.example.yaml | modify | dataRepo 注释示例 | no |
| compose.yaml | modify | runner 挂载数据仓工作副本 | no |

**不动的东西**：

- `data/runs/` 下每轮目录的产物格式（run.json、progress.json、svg、txt）
- 所有者配对与会话机制（ACR-007）在非只读部署下的行为
- 调度器与执行器的分容器拓扑（ACR-008）

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 同步由 dataRepo.autoSync 开启，只读与远程数据源由环境变量开启，
缺省时看板与执行器行为不变；修剪守卫只会少删、不会多删。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | d26a518 | |
| `pnpm test` | 单元与集成测试 | pass | pass | d26a518 | 255 项 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | ff93861 | |
| `pnpm showcase:smoke` | 端到端冒烟：只读远程模式构建、启动与关键路由断言 | - | pass | ff93861 | 变更前无此入口 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 数据仓契约 | revert 6c6f51b |
| 2 | 只读部署与远程数据源 | revert b59fe36 |
| 3 | 同步流水线与修剪守卫 | revert 3cac282 |
| 4 | 展台首屏回落、健康检查与冒烟 | revert ff93861 |
| 5 | 永不发布题目的剔除 | revert fe2873a、d26a518 |
| 6 | 容器挂载数据仓与发布确认 | revert 该步 commit |

## 回滚方案

- 触发条件：回归 fail；修剪误删；只读部署出现可写入口。
- 步骤：按分步实施表倒序 revert；关闭 dataRepo.autoSync 与只读环境变量即可先行止损。
- 数据：数据仓只追加，本地回滚不影响已发布数据；台账文件可删除，同步会从数据仓历史补记。

## 人工确认

### 方案摘要

1. 要动什么：新增数据仓同步与只读展台两条能力，涉及 src/core、src/app、src/bin 3 个模块。
2. 不动什么：本地产物格式、配对登录与分容器拓扑。
3. 为什么现在：结果需要沉淀为公开可引用数据，并提供不带写能力的公网展示。
4. 风险与回滚：泄漏由双重扫描与数据仓 CI 拦截；按步 revert，开关关闭即恢复原行为。
5. 成本：6 步，无新增运行时依赖；公网部署由用户在 Vercel 控制台完成。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §4 §6 §8 | 数据仓同步与修剪守卫；只读部署边界；只读展台部署形态 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-009 | 待回填 |
| ADR（/adr-curator） | 不适用：非难逆转，开关关闭即恢复 | 不适用 |
