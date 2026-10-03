# ACR-022: Git 钩子交给 lefthook 管理（Git Hooks Managed by lefthook）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-10-03 |
| 变更类型 | add-dependency |
| 触发来源 | 口头：发布门加了 `check:secrets` 之后只在手动跑门禁时执行，要用现成的开源钩子管理器在提交与推送前自动拦，不自己造轮子 |
| 基线 | ARCH-001 |
| 影响章节 | §0 §6 |
| 改造面上限 | 3 个模块（package.json、lefthook.yml、docker/ 与 docs 不计） |
| 取代 / 被取代 | 无 |

质量门目前全靠人记得跑：`pnpm lint`、`pnpm check:length`、`pnpm check:secrets`、`pnpm test` 都在 AGENTS.md 里，
没有任何机制保证一次提交或推送之前真的跑过。本 ACR 引入一个钩子管理器，把快的门挂在 pre-commit、慢的挂在
pre-push，钩子配置随仓库入库，`pnpm install` 后自动装好。

## 动机

- 现状：`check:secrets` 是防密钥进公开仓的本地门，但只在发布配方里手动执行；GitHub 侧只有厂商模式扫描与推送保护，
  个人账号公开仓没有 Generic patterns（见记忆 github-secret-scanning-limits），私钥块与中转商 key 完全靠本地门。
- 不动的代价：一次忘跑门禁的 `git push` 就把密钥或超长函数推上公开仓；推送保护拦不住非厂商形状的 key。
- 为什么现在：用户在 2026-10-03 核过三条安全问题后要求「找一个合适的开源项目来实现 pre-commit 的 hook 管理，
  没必要重复造轮子」。

## 方案评估

要的是：钩子配置入库、`pnpm install` 后自动装、同一仓的多个 worktree 共用、pre-commit 与 pre-push 各挂一组命令、
失败即拦。候选按 `revision.mjs probe` 的 registry 数据与各自文档核过。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| lefthook：Go 单二进制，npm 包按平台装可选依赖（周下载 610 万），`lefthook.yml` 配置，命令可并行，钩子装进 `git rev-parse --git-path hooks`，worktree 共用主仓那一份 | npm:lefthook | 2.1.16 | MIT | 2026-10-01 | active | 1 个模块（package.json 加 devDependency，pnpm-workspace.yaml 的 `allowBuilds` 放行其 postinstall，新增 lefthook.yml） | 低：Evil Martians 维护，周级发布，零运行时依赖，`LEFTHOOK=0` 一键绕过 | adopt | - |
| husky：npm 社区最常用（周下载 4390 万），`prepare` 脚本设相对路径 `core.hooksPath=.husky/_` | npm:husky | 9.1.7 | MIT | 2024-11-18 | stale | 1 个模块 | 中：近两年无发布（open issues 107）；相对 `core.hooksPath` 在 linked worktree 里解析到不存在的目录，git 静默跳过全部钩子，每个 worktree 都要重跑 install；钩子是 shell 脚本，并行要自己写 | reject | 维护成本：最近发布 2024-11 已 stale；worktree 下静默失效与本仓库多 worktree 流程冲突 |
| simple-git-hooks：极小 npm 包（周下载 91 万），钩子命令写在 package.json，一年 1–3 个版本 | npm:simple-git-hooks | 2.14.0 | MIT | 2026-08-28 | active | 1 个模块 | 低 | reject | 改造面：只能一个钩子一条 shell 串，没有并行、没有按文件过滤，pre-commit 要串三条命令只能自己拼 `&&`；与 lefthook 同为单依赖但能力更少 |
| pre-commit（Python 框架，PyPI 周下载 3370 万） | pypi:pre-commit | 4.6.2 | MIT | 2026-08-10 | active | 2 个模块（Python 工具链 + 配置） | 高：要求贡献者装 Python 与 pipx，本仓库是纯 Node/pnpm 工具链 | reject | 维护成本：引入第二套语言运行时，Docker 与 dashboard:prod 的安装链都要跟着改 |
| 自研：`scripts/install-hooks` 写 `.git/hooks/pre-commit` | self | - | - | - | - | 1 个模块 | 中：worktree、Windows、并行、跳过开关都要自己写并长期维护 | reject | 已有成熟开源方案，用户明确要求不造轮子 |

> **结论**：lefthook —— 唯一同时满足「配置入库 + 安装自动 + worktree 共用 + 并行 + 一键绕过」且仍在活跃维护的候选；
> 在临时目录实测：非 git 目录 `lefthook install` 退出 1（Docker 构建要跳过），git 仓装后 worktree 里提交会触发同一份钩子。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `package.json` | modify | devDependencies 加 `lefthook` | no |
| `pnpm-workspace.yaml` | modify | `allowBuilds` 加 `lefthook: true`，放行它的 postinstall（pnpm 10+ 缺省不跑依赖的构建脚本，本仓库已用此字段放行 esbuild 等） | no |
| `pnpm-lock.yaml` | modify | 锁文件随之更新 | no |
| `lefthook.yml` | add | pre-commit 并行跑 `check:secrets`、`lint`、`check:length`（合计约 3.5 秒）；pre-push 跑 `test` 与 `validate:prompts`（约 36 秒） | no |
| `docker/Dockerfile` | modify | 安装步骤加 `CI=1`：构建上下文是白名单、没有 `.git`，lefthook 的 postinstall 在 `CI` 为真时直接返回（实测 `LEFTHOOK=0` 不能让 `lefthook install` 在非 git 目录免错） | no |
| `AGENTS.md` | modify | 质量门一节说明钩子自动跑哪几条、`LEFTHOOK=0` 怎么绕 | no |
| `docs/development.md` | modify | 开发环境一节补钩子安装与绕过 | no |
| `docs/architecture/architecture.md` | modify | §0 技术栈表加 lefthook 行；§6 安全边界补「密钥扫描在 pre-commit 强制」 | no |
| `CHANGELOG.md` | modify | `[未发布]` 新增一条 | no |

**不动的东西**：

- 各门禁脚本本身（`check:secrets`、`check:length`、`lint`、`test`、`validate:prompts`）与 `config/*.yaml` 策略文件不改。
- `pnpm build` 与 `showcase:smoke` 不进钩子，仍在发布配方里手动跑（build 要先停开发看板，不适合挂钩子）。
- 数据仓 llm-iq-data 保持零依赖，不装钩子，靠它的 CI。
- 发布配方、提交信息规则、`src/` 任何代码。

## 兼容与回归

**兼容策略**：直接替换 —— 之前没有任何钩子，没有外部调用方；钩子只是把已有命令提前到提交与推送时执行，
命令本身不变。`LEFTHOOK=0 git commit` 可整体绕过，不会把人锁死。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | c81165b | |
| `pnpm test` | 单元测试 | pass | pass | c81165b | |
| `pnpm check:secrets` | 密钥扫描 | pass | pass | c81165b | |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | c81165b | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、变量注入、强度折叠 | pass | pass | be25c7b | 本 ACR 不动运行时代码，经用户同意只跑一次（轮次 20261003T060858Z，10 次调用 8 ok），两列同记；codex gpt-6-astra 两次 400 invalid_request 是上游模型侧错误，与钩子无关 |
| `docker compose -f compose.yaml -f compose.data-repo.yaml build web` | 容器镜像构建（非 git 上下文里 pnpm install 不被 lefthook 卡住） | pass | pass | c81165b | 构建日志无 lefthook 输出，钩子未装 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | `pnpm add -D lefthook`，pnpm-workspace.yaml 的 `allowBuilds` 放行，新增 `lefthook.yml`，本地验证 pre-commit 与 pre-push 触发、`LEFTHOOK=0` 绕过、worktree 里同样触发 | revert 本 commit，`pnpm lefthook uninstall` |
| 2 | Dockerfile 安装步骤加 `CI=1`，重建镜像验证 | revert 本 commit |
| 3 | AGENTS.md、docs/development.md、architecture.md、CHANGELOG 回填 | revert 本 commit |

## 回滚方案

- 触发条件：钩子让正常提交失败（误报）且无法用策略白名单解决；或 lefthook 二进制在某台开发机装不上。
- 步骤：`LEFTHOOK=0` 立即绕过；彻底退回 revert 步骤 1–3 的三个 commit，再 `pnpm lefthook uninstall`
  清掉 `.git/hooks`，`pnpm install` 一次。十分钟内可完成。
- 数据：无需迁移，钩子不触碰 `data/` 与配置。

## 人工确认

### 方案摘要

1. 要动什么：加 devDependency `lefthook`（pnpm-workspace.yaml 放行其 postinstall）与一份 `lefthook.yml`，pre-commit 并行跑 `check:secrets` / `lint` / `check:length`（约 3.5 秒），pre-push 跑 `test` / `validate:prompts`（约 36 秒）；Dockerfile 安装步骤加 `CI=1`。不动 `src/` 任何模块。
2. 不动什么：各门禁脚本、策略文件、`src/`、发布配方；`build` 与 `showcase:smoke` 仍手动；数据仓不装钩子。
3. 为什么现在：`check:secrets` 刚成为防密钥进公开仓的唯一本地门，不自动跑等于没有。
4. 风险与回滚：误报卡住提交时 `LEFTHOOK=0 git commit` 绕过；彻底退回 revert 3 个 commit 加 `pnpm lefthook uninstall`。
5. 成本：三步、约一小时；lefthook 活跃维护（2.1.16，2026-10-01），零运行时依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-10-03 | luojin | approved | 看板会话里按 brief 五问确认，选项 approved |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §0 | 技术栈表加 lefthook 行 | 已回填 |
| architecture.md §6 | 安全边界补「密钥扫描在 pre-commit 强制、推送前跑测试」 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-022 | 已回填 |
| ADR（/adr-curator） | 不适用：非难逆转，revert 即退回 | 不适用 |
