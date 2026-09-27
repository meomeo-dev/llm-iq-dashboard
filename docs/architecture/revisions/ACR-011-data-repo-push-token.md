# ACR-011: 执行器经网页授权的 GitHub App 推送数据仓（Runner pushes the data repository through a web-authorized GitHub App）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-27 |
| 变更类型 | deployment-change |
| 触发来源 | 口头：所有者要求在网页上完成单次运行、导出提交与推送发布，授权像 Vercel 一样在浏览器里完成，不用终端、不手工配置令牌 |
| 基线 | ARCH-001 |
| 影响章节 | §6 §8 |
| 改造面上限 | 8 个模块（源码 3 个：src/core、src/app、src/bin；docker/ 下镜像、入口脚本与 askpass 脚本各计 1 个，都是同一部署细节、随同一 commit 回滚；test/core 与 test/app 只新增测试，不改既有断言） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：ACR-008 与 ACR-009 规定容器内不放任何 GitHub 凭据，ACR-010 的面板因此在分容器部署下禁用推送；
  所有者每次发布都要回到宿主机终端执行 `git push`。
- 不动的代价：网页流程在最后一步断开，"跑一次 → 导出 → 推送 → 确认"无法在看板上闭环。
- 为什么现在：ACR-010 已上线，面板的推送确认框与领先提交比对已就绪，只差执行器侧的推送凭据。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| Git Credential Manager 在容器内管理凭据 | github:git-ecosystem/git-credential-manager | 2.9.1 | MIT | 2026-07-14 | active | 1 个模块（src/core）+ 镜像内安装 .NET 运行时 | 高：镜像增加运行时与凭据存储后端，Linux 容器内需额外配置 secret service，且浏览器授权须在容器所在机器弹出 | reject | 维护成本：只需要对一个仓库做 https 推送，引入完整凭据管理器使镜像体积与配置面显著增大 |
| @octokit/oauth-methods 处理令牌交换与刷新 | npm:@octokit/oauth-methods | 6.0.5 | MIT | 2026-08-30 | active | 1 个模块（src/core） | 中：新增运行时依赖及约 9 个传递依赖，只替代三次 HTTP 调用；清单转换接口不在其范围内，仍需自写 | reject | 维护成本：依赖树 +9 个包换三个 fetch 调用，清单注册部分仍要自研 |
| 自研：GitHub App 清单注册 + 安装时授权 + 用户令牌，执行器专用卷存放，推送时经 `GIT_ASKPASS` 交给 git | self | - | - | - | - | 3 个模块（src/core、src/bin、src/app） | 低：沿用系统 git 与现有推送校验，GitHub 接口为三个 REST 调用 | adopt | - |

> **结论**：自研 —— 面板一键发起 GitHub App 清单注册，所有者在 GitHub 网页上点"创建"与"安装（仅 llm-iq-data）"，
> 执行器换取并保存用户令牌，推送时经 `GIT_ASKPASS` 交给 git；令牌不进环境变量、命令行、日志与 web 容器。

## 授权流程

1. 面板点"连接 GitHub"：web 生成一次性 `state`（httpOnly cookie），渲染自动提交的表单，把清单 POST 到
   `https://github.com/settings/apps/new?state=…`。清单：`name` 带随机后缀、`url` 为数据仓公开地址、
   `hook_attributes.active=false`、`public=false`、`default_permissions={contents:"write",metadata:"read"}`、
   `redirect_url={看板源}/api/data-repo/github/app-created`、`callback_urls=[{看板源}/api/data-repo/github/callback]`、
   `request_oauth_on_install=true`。看板源取当前请求的协议与主机。
2. 所有者在 GitHub 页面点"Create GitHub App"，GitHub 回跳 `app-created?code&state`：web 校验 `state` 后经请求通道
   交给执行器；执行器调用 `POST /app-manifests/{code}/conversions`，只保存 `id`、`slug`、`client_id`、
   `client_secret`，丢弃 `pem` 与 `webhook_secret`；web 随后跳转到 `https://github.com/apps/{slug}/installations/new`。
3. 所有者选"Only select repositories → llm-iq-data"并安装，GitHub 按安装时授权回跳 `callback?code`：执行器以
   `client_secret` 调用 `POST https://github.com/login/oauth/access_token` 换取用户令牌（8 小时）与刷新令牌
   （约 6 个月），附 `repository_id` 把令牌限定到数据仓；面板显示"已连接 {login}"。
4. 推送：令牌剩余有效期不足 10 分钟时先刷新；刷新令牌失效时面板提示"重新连接"。
5. 断开：面板点"断开 GitHub"，执行器调用 `DELETE /applications/{client_id}/grant` 撤销全部令牌并清除本地凭据；
   面板给出 GitHub 上删除该应用的设置页链接，是否删除由所有者决定。

令牌权限为"用户可写 ∩ 应用权限（仅 Contents 读写）∩ 应用安装的仓库（仅 llm-iq-data）"。

**待实测项（第 3 步验证，任一不成立即走备用路径）**：GitHub 接受清单中的 localhost 回跳地址；转换接口无需认证；
`x-access-token` + 用户令牌可用于 git over HTTPS 推送。备用路径：所有者在 GitHub 网页表单手工创建应用
（面板给出逐项填写说明），再把 Client ID 与 Client secret 填入面板表单，后续步骤不变。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| src/core/github-auth/manifest.ts | add | 生成清单与 `state`；校验回跳参数 | no |
| src/core/github-auth/github-api.ts | add | 清单转换、令牌交换、刷新、撤销授权四个调用；错误信息经泄漏扫描脱敏 | no |
| src/core/github-auth/credential-store.ts | add | 凭据目录 `PELICAN_SECRETS_DIR`（默认 `{数据目录}/secrets`）内原子读写，目录 700、文件 600；访问令牌单独成文件供 askpass 读取 | no |
| src/core/github-auth/push-env.ts | add | 生成仅对推送生效的 git 环境：`GIT_ASKPASS`、`GIT_TERMINAL_PROMPT=0`、`-c credential.helper=` 清空其它 helper；远程须为 `https://github.com/` 且与授权仓库一致 | no |
| docker/git-askpass.sh | add | 用户名固定输出 `x-access-token`，密码从访问令牌文件读取 | no |
| docker/Dockerfile | modify | 镜像内建 `/app/secrets` 并归属 node；同目录的 `Dockerfile.dockerignore` 放行 askpass 脚本 | no |
| docker/entrypoint.sh | modify | 入口修正凭据目录权限 | no |
| next.config.ts | modify | CSP `form-action` 允许提交到 github.com（清单注册表单） | no |
| src/app/api/data-repo/github/github-helpers.ts | add | 授权路由共用：以 Host 头推导回跳地址、state cookie 读写 | no |
| src/core/github-auth/index.ts | add | 模块出口与连接状态读取 | no |
| src/core/github-auth/status.ts | add | 模块出口与连接状态读取 | no |
| src/app/config/DataRepoPanel.tsx | modify | 装载 GitHub 卡片，台账文案改为"待发布 N 轮，已发布 M 轮" | no |
| src/app/config/DataRepoCards.tsx | modify | 装载 GitHub 卡片，台账文案改为"待发布 N 轮，已发布 M 轮" | no |
| src/app/config/config-data-repo.css | modify | 装载 GitHub 卡片，台账文案改为"待发布 N 轮，已发布 M 轮" | no |
| src/core/sync/data-repo-git.ts | modify | `pushCurrentBranch` 接受可选推送环境 | no |
| src/core/requests.ts | modify | 新增请求 `github-app-convert`、`github-token-exchange`、`github-disconnect`；结果只含 `slug`、`login`、状态，不含任何密钥 | no |
| src/core/sync/data-repo-status.ts | modify | 状态增加 `github`（未连接 / 应用已建未安装 / 已连接 {login} / 需重新连接）与 `pushCapability`（`github-app` / `host-credentials` / `unavailable`） | no |
| src/core/sync/data-repo-panel-types.ts | modify | 对应类型 | no |
| src/bin/runner.ts | modify | 认领上述请求；具备 `github-app` 能力时认领 push，执行前在执行器侧再次比对领先提交清单 | yes |
| src/app/api/data-repo/github/connect/route.ts | add | 渲染清单自动提交页，写 `state` cookie | no |
| src/app/api/data-repo/github/app-created/route.ts | add | 校验 `state`，转交执行器，跳转安装页 | no |
| src/app/api/data-repo/github/callback/route.ts | add | 转交执行器换令牌，跳回配置页 | no |
| src/app/api/data-repo/github/disconnect/route.ts | add | POST，转交执行器撤销 | no |
| src/app/api/data-repo/sync/route.ts | modify | 分容器部署下按执行器上报的 `pushCapability` 放行 push，否则仍 409 | yes |
| src/app/config/DataRepoGithubCard.tsx | add | 连接状态、"连接 GitHub""断开"按钮 | no |
| src/app/config/data-repo-panel-model.ts | modify | 推送按钮可用性改为依据 `pushCapability` | yes |
| compose.yaml | modify | runner 增加专用命名卷 `runner-secrets` 挂载到 `/app/secrets`，设置 `PELICAN_SECRETS_DIR`；web 不挂载 | no |
| scripts/showcase-smoke/assertions.ts | modify | 只读模式下 `/api/data-repo/github/*` 均 403 | no |
| test/core/github-auth/github-auth.test.ts | add | 清单字段、state 校验、令牌交换与刷新（假 fetch）、凭据文件权限、推送环境、错误信息不含令牌 | no |
| test/app/api/data-repo-github.test.ts | add | 非所有者 401/403、只读 403、state 不符 400、分容器下有令牌放行 push、无令牌 409 | no |
| test/app/config/data-repo-github-card.test.ts | add | 各连接状态的按钮与文案、推送按钮可用性 | no |
| docs/deploy-docker.md | modify | 网页连接步骤、凭据存放位置、撤销与删除应用、备用路径 | no |
| handoff.md | modify | 网页发布流程 | no |

**不动的东西**：

- 推送前的人工确认：面板确认框、领先提交清单比对、并发互斥均保留，且执行器侧再比对一次
- web 容器：不挂载凭据卷、不挂载数据仓、不接触任何密钥
- 自动同步的 `dataRepo.push` 语义：轮次结束后仍只导出提交，不自动推送；不开启任何定时任务
- 宿主机 `pnpm sync:data --push` 用宿主机凭据的行为

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 未连接 GitHub 时 `pushCapability` 与 ACR-010 完全一致（分容器部署下推送禁用）。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | ad3a5ce | |
| `pnpm test` | 单元与集成测试 | pass | pass | ad3a5ce | 变更前 566 项，变更后 686 项 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | ad3a5ce | |
| `pnpm showcase:smoke` | 端到端冒烟：只读远程模式下数据仓与 GitHub 授权接口 403 | pass | pass | ad3a5ce | |
| `pnpm check:length` | 文件与函数长度门禁 | pass | pass | ad3a5ce | |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | `src/core/github-auth/`、askpass 脚本、推送环境，附单测 | revert 本 commit |
| 2 | 请求类型、执行器认领、授权路由、面板卡片与推送按钮、冒烟断言 | revert 本 commit |
| 3 | compose 凭据卷、文档；重建容器后由所有者在浏览器完成一次连接与推送，核对待实测项 | revert 本 commit |

## 回滚方案

- 触发条件：令牌出现在日志、错误信息、环境变量或 web 容器可读路径；推送绕过确认；回归 fail。
- 步骤：先在面板点"断开"或在 GitHub 设置页撤销授权并删除应用（立即止损），再按分步倒序 revert；
  最后删除 `runner-secrets` 卷。
- 数据：无需迁移；数据仓只追加，已推送内容不受回滚影响。

## 人工确认

### 方案摘要

1. 要动什么：面板一键在 GitHub 创建仅装在 llm-iq-data 的应用并授权，执行器保存令牌后可在网页推送；涉及 src/core、src/bin、src/app 3 个源码模块，另加测试、compose 与 askpass 脚本。
2. 不动什么：推送前的面板确认与领先提交比对、web 容器无凭据、轮次结束只提交不推送、不开定时任务。
3. 为什么现在：ACR-010 面板已上线，网页流程只差推送一步。
4. 风险与回滚：令牌只在执行器专用卷，权限限定一个仓库；GitHub 未文档化的三点在第 3 步实测，不成立走手工建应用的备用路径；面板或 GitHub 设置页随时撤销。
5. 成本：3 步，无新增依赖；所有者在 GitHub 网页上点两次（创建、安装）。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-27 | xumetide-dev | approved | 批准推送能力，并要求改为网页授权、不配置令牌；本版按此改为 GitHub App 网页授权 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §6 §8 | 执行器可持有经网页授权、仅限数据仓的 GitHub App 用户令牌（专用卷），web 仍无凭据；推送须经面板确认 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-011 | 已回填 |
| ADR（/adr-curator） | 不适用：撤销授权并删除应用即恢复，非难逆转 | 已回填 |
