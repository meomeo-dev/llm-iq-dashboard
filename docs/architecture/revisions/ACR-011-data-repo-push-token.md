# ACR-011: 执行器以仅限数据仓的令牌推送（Runner pushes the data repository with a repository-scoped token）

| 项 | 内容 |
|---|---|
| 状态 | awaiting-approval |
| 日期 | 2026-09-27 |
| 变更类型 | deployment-change |
| 触发来源 | 口头：所有者要求在网页上完成单次运行、导出提交与推送发布，全程不用终端 |
| 基线 | ARCH-001 |
| 影响章节 | §6 §8 |
| 改造面上限 | 6 个模块（源码 3 个：src/core、src/app、src/bin；docker/ 只新增一个 askpass 脚本；test/core 与 test/app 只新增测试，不改既有断言） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：ACR-008 与 ACR-009 规定容器内不放任何 GitHub 凭据，ACR-010 的面板因此在分容器部署下禁用推送；
  所有者每次发布都要回到宿主机终端执行 `git push`。
- 不动的代价：网页流程在最后一步断开，"跑一次 → 导出 → 推送 → 确认"无法在看板上闭环。
- 为什么现在：ACR-010 已上线，面板的推送确认框与领先提交比对已就绪，只差执行器侧的推送凭据。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| Git Credential Manager 在容器内管理凭据 | github:git-ecosystem/git-credential-manager | 2.9.1 | MIT | 2026-07-14 | active | 1 个模块（src/core）+ 镜像内安装 .NET 运行时 | 高：镜像增加运行时与凭据存储后端，Linux 容器内需额外配置 secret service | reject | 维护成本：只需要对一个仓库做 https 推送，引入完整凭据管理器使镜像体积与配置面显著增大 |
| isomorphic-git 以令牌直推 | npm:isomorphic-git | 1.42.2 | MIT | 2026-09-11 | active | 1 个模块（src/core） | 中：推送路径与现有宿主机 git 实现分叉 | reject | 改造面：现有同步全部基于系统 git，引入第二套 git 实现只为推送一步，两条路径需要分别维护与测试 |
| 自研：只读挂载令牌文件 + `GIT_ASKPASS` 辅助脚本，仅在推送命令上生效 | self | - | - | - | - | 3 个模块（src/core、src/bin、src/app） | 低：沿用系统 git 与现有推送校验 | adopt | - |

> **结论**：自研 —— 令牌以 compose secret 只读挂载，推送时经 `GIT_ASKPASS` 交给 git，不进环境变量、命令行与日志。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| compose.data-repo.yaml | modify | runner 增加 secret `data_repo_token`，源文件路径由 `PELICAN_DATA_REPO_TOKEN_FILE` 指定；未设置时不挂载 | no |
| docker/git-askpass.sh | add | 从 `/run/secrets/data_repo_token` 读取令牌输出给 git；用户名固定 `x-access-token` | no |
| src/core/sync/push-credential.ts | add | 探测令牌文件是否存在且可读；生成仅对推送生效的 git 环境（`GIT_ASKPASS`、`GIT_TERMINAL_PROMPT=0`、清空其它 credential helper） | no |
| src/core/sync/data-repo-git.ts | modify | `pushCurrentBranch` 在令牌可用时附加上述环境；远程须为 `https://github.com/` 且只在 push 命令上使用 | no |
| src/core/sync/data-repo-status.ts | modify | 状态增加 `pushCapability`：`host-credentials` / `runner-token` / `unavailable` 与原因 | no |
| src/core/sync/data-repo-panel-types.ts | modify | `DataRepoStatus.deploy` 增加 `pushCapability` 字段 | no |
| src/bin/runner.ts | modify | 令牌可用时认领 push 请求；执行前在执行器侧再次比对领先提交清单 | yes |
| src/app/api/data-repo/sync/route.ts | modify | 分容器部署下按执行器上报的 `pushCapability` 放行 push，否则仍 409 | yes |
| src/app/config/data-repo-panel-model.ts | modify | 推送按钮可用性改为依据 `pushCapability` | yes |
| test/core/sync/push-credential.test.ts | add | 令牌探测、环境构造、非 https 远程拒绝、令牌不出现在错误信息里 | no |
| test/app/api/data-repo-push.test.ts | add | 分容器部署下有令牌放行、无令牌 409、清单不一致 409 | no |
| test/app/config/data-repo-panel-push.test.ts | add | 推送按钮可用性随能力变化 | no |
| docs/deploy-docker.md | modify | 令牌创建（细粒度、仅 llm-iq-data、Contents 读写、设过期）、存放路径与权限 600、轮换与吊销 | no |
| handoff.md | modify | 网页发布流程 | no |

**不动的东西**：

- 推送前的人工确认：面板确认框、领先提交清单比对、并发互斥均保留，且执行器侧再比对一次
- web 容器：不挂载令牌、不挂载数据仓
- 自动同步的 `dataRepo.push` 语义：定时或手动轮次结束后仍只导出提交，不自动推送
- 宿主机 `pnpm sync:data --push` 用宿主机凭据的行为

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 未设置 `PELICAN_DATA_REPO_TOKEN_FILE` 时不挂载令牌，面板行为与 ACR-010 完全一致。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | - | | |
| `pnpm test` | 单元与集成测试 | pass | - | | 变更前 569 项 |
| `pnpm build` | Next.js 看板生产构建 | pass | - | | |
| `pnpm showcase:smoke` | 端到端冒烟：只读远程模式下数据仓接口 403 | pass | - | | |
| `pnpm check:length` | 文件与函数长度门禁 | pass | - | | |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 令牌探测与推送环境、askpass 脚本、compose secret，附单测 | revert 本 commit |
| 2 | 状态上报 pushCapability、执行器认领 push、接口放行、面板按钮 | revert 本 commit |
| 3 | 文档与部署验证 | revert 本 commit |

## 回滚方案

- 触发条件：令牌出现在日志、错误信息或环境变量中；推送绕过确认；回归 fail。
- 步骤：先在宿主机删除令牌文件并在 GitHub 吊销该令牌（立即止损），再按分步倒序 revert。
- 数据：无需迁移；数据仓只追加，已推送内容不受回滚影响。

## 人工确认

### 方案摘要

1. 要动什么：执行器容器以只读挂载的仓库级令牌推送数据仓，面板在分容器部署下可推送；涉及 src/core、src/bin、src/app 3 个源码模块，另加测试与 compose/docker 文件。
2. 不动什么：推送前的面板确认与领先提交比对、web 容器无凭据、轮次结束只提交不推送。
3. 为什么现在：ACR-010 面板已上线，网页流程只差推送一步。
4. 风险与回滚：令牌泄漏由只读 secret、askpass 与日志脱敏约束，权限仅限一个仓库且可随时吊销；按 3 步 revert。
5. 成本：3 步，无新增依赖；令牌由所有者在 GitHub 创建并放到宿主机指定路径。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §6 §8 | 执行器可持有仅限数据仓的推送令牌（只读 secret），web 仍无凭据；推送须经面板确认 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-011 | 待回填 |
| ADR（/adr-curator） | 不适用：删除令牌文件即恢复，非难逆转 | 待回填 |
