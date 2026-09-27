# ACR-006: 模型层收口：禁用 CLI 工具、宿主机上限与输出泄漏拦截（Model Guardrails: No Tools, Host Ceiling, Leak Guard）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-26 |
| 变更类型 | structure-change |
| 触发来源 | 口头：看板公网暴露前的安全设计（docs/security/public-exposure-design.md §4.3、§4.5） |
| 基线 | ARCH-001 |
| 影响章节 | §3 §6 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：`targets[].extraArgs` 原样拼进 claude 命令行；claude 的 print 模式默认可用只读工具，codex 沙箱为
  read-only（可读全盘），agy 以 `--dangerously-skip-permissions` 运行。能改配置的人可以让模型读取容器内
  的凭据文件并写进作品。
- 不动的代价：凭据泄露只差一条提示词；预算上限只存在于可被 API 改写的配置里。
- 为什么现在：看板即将对公网开放只读访问，所有者操作面也会经网络到达。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 用三家 CLI 自带的权限开关禁用工具：claude `--tools ""`、codex `approvalPolicy: untrusted`（适配器拒绝一切审批）、agy 仅 `--sandbox` | npm:@anthropic-ai/claude-code | 2.1 | 专有 | 2026-09 | active | 1 个模块（src/adapters） | 低：只加参数，各家已实测拒绝读文件 | adopt | - |
| 用操作系统沙箱（seccomp / 独立 uid）限制 CLI 进程读凭据 | github:moby/buildkit | 0.33 | Apache-2.0 | 2026-09-02 | active | 2 个模块 + 容器配置 | 高：CLI 自身要读凭据刷新令牌，无法与模型的读取区分 | reject | 改造面：要改容器用户模型与卷权限，且无法区分 CLI 进程与模型工具的读取 |
| 只靠考场规则文本约束模型 | self | - | - | - | - | 0 个模块 | 低 | reject | 维护成本：文本约束可被提示词覆盖，已实测不可依赖 |

> **结论**：用各家 CLI 的权限开关关掉工具；宿主机上限与输出指纹拦截作为纵深。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/adapters/claude.ts` | modify | 调用参数加 `--tools ""` | yes |
| `src/adapters/agy.ts` | modify | 去掉 `--dangerously-skip-permissions`，只保留 `--sandbox` | yes |
| `src/adapters/codex.ts` | modify | `approvalPolicy` 改为 `untrusted`，命令与改文件一律进入审批并被适配器拒绝 | yes |
| `src/core/ceiling.ts` | add | 宿主机上限：`PELICAN_CEILING_PER_DAY_USD`、`PELICAN_CEILING_PER_ROUND_USD`、`PELICAN_ALLOW_EXTRA_ARGS`；预算取配置与上限的较小者，未放行时含 `extraArgs` 的配置校验失败 | yes |
| `src/core/config.ts` | modify | `loadConfig` 末尾套用上限 | no |
| `src/core/leak-guard.ts` | add | 每轮开始读取凭据文件，只保留令牌子串的 HMAC 指纹；调用结束落盘前扫描回答与作品，命中即拦截 | yes |
| `src/core/runner.ts` | modify | 开轮时构建指纹集并传给单次调用 | no |
| `src/core/run-attempt.ts` | modify | 命中指纹的调用记为 error，作品与转录不落盘 | yes |
| `test/core/ceiling.test.ts` | add | 上限：预算取小、extraArgs 拒绝与放行 | no |
| `test/core/leak-guard.test.ts` | add | 指纹：命中、未命中、短串不计 | no |
| `docs/deploy-docker.md` | modify | 上限环境变量说明 | no |
| `docs/security/public-exposure-design.md` | modify | §4.5 按实测结果写各家参数 | no |
| `docs/design-notes.md` | modify | 适配器调用形态表与权限取舍段 | no |

**不动的东西**：

- 提示词与考场规则文本；作品的净化与 `/art` 沙箱；`run.json`、`progress.json` 格式。
- 配置文件的字段结构：`extraArgs` 仍可解析，只是默认不放行。

## 兼容与回归

**兼容策略**：直接替换 —— 调用参数收紧后模型仍能产出内联 SVG（三家已实测拒绝读文件并正常回答）。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查 | pass | pass | ad257fd | |
| `pnpm test` | node:test 单元测试 | pass | pass | ad257fd | |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | ad257fd | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟 | skip | skip | ad257fd | 冒烟含 codex，按约定不消耗其额度；本地实跑 claude 与 agy 三目标 3/3 ok（20260926T091804Z）；植入假令牌的调用被拦下且无产物 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 三家适配器禁用工具；用 claude 与 agy 各跑一次真实调用确认仍出 SVG（b25d163） | revert 本 commit |
| 2 | 宿主机上限与配置套用；泄漏指纹拦截；单测（ad257fd） | revert 本 commit |

## 回滚方案

- 触发条件：某家 CLI 在禁用工具后无法产出内联 SVG；指纹扫描误拦正常作品。
- 步骤：revert 对应 commit；上限与拦截都在进程内，无落盘格式变化。
- 数据：无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：三家适配器的调用参数；新增上限与泄漏拦截两个 core 模块；2 个模块（src/adapters、src/core）
2. 不动什么：提示词、考场规则、产物格式、看板
3. 为什么现在：公网暴露前必须堵住"改配置即取凭据"这条路
4. 风险与回滚：模型在无工具下成功率可能变化；revert 即恢复
5. 成本：2 步，不加依赖

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-26 | xumetide-dev | approved | 在对话中同意按安全设计的最终形态实施 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §3 | 硬约束增加：CLI 调用不带工具；宿主机上限高于配置 | 已回填 |
| architecture.md §6 | 安全边界增加：输出指纹拦截 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-006 | 已回填 |
| ADR（/adr-curator） | 不适用：可 revert，非难逆转 | 不适用 |
