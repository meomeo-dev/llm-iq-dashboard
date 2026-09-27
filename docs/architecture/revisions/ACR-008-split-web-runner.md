# ACR-008: 看板与执行器分容器，凭据只在执行器（Split Web and Runner Containers）

| 项 | 内容 |
|---|---|
| 状态 | implementing |
| 日期 | 2026-09-26 |
| 变更类型 | deployment-change |
| 触发来源 | 口头：看板公网暴露的安全设计 §4.4（docs/security/public-exposure-design.md） |
| 基线 | ARCH-001 |
| 影响章节 | §2 §8 |
| 改造面上限 | 6 个模块（docker/Dockerfile 与 docker/entrypoint.sh 是同一部署单元的两个文件；test/core 只新增单测） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：看板进程、调度器与三家 CLI 同一容器、同一用户；`POST /api/run` 在看板进程内执行调用。
- 不动的代价：Web 层任一漏洞直接落在持有凭据的进程里。
- 为什么现在：公网开放后 Web 层是唯一暴露面，凭据必须不在其文件系统内。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| 两容器 + 共享数据卷上的请求文件：看板写 `data/requests/`，执行器消费；沿用 `data/` 作唯一通道 | self | - | - | - | - | 3 个模块（src/core、src/app、src/bin）+ docker | 低：无新依赖，通道与现有进度文件同型 | adopt | - |
| 两容器 + 消息队列（Redis / NATS） | npm:ioredis | 5.x | MIT | 2026-08 | active | 3 个模块 + 第三个容器 + 1 项依赖 | 中：多一个常驻服务与依赖 | reject | 维护成本：单机单人场景，文件系统已提供有序、可观察的通道，队列服务是多余的运行部件 |
| 单容器，用 seccomp / 独立用户隔离看板进程 | github:moby/buildkit | 0.33 | Apache-2.0 | 2026-09-02 | active | docker 配置 | 高：看板仍需读写 `data/`，与凭据同一文件系统，边界靠权限位维持 | reject | 维护成本：边界易被卷权限、升级与调试操作破坏；分容器的边界由挂载决定，不可绕过 |

> **结论**：两容器，请求走文件。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/requests.ts` | add | `data/requests/` 下每请求一个 JSON：run / check-readiness / probe-capabilities 三类请求的写入、认领、完成 | no |
| `src/core/runner-link.ts` | add | `PELICAN_RUNNER=external` 判定；执行器心跳 `data/runner.json` 的读写与覆盖判定 | no |
| `src/core/auto-run.ts` | modify | 外部模式按执行器心跳判定调度器存活 | yes |
| `src/core/progress.ts` | modify | 外部模式按心跳加登记 pid 判定某轮的执行进程是否还在 | yes |
| `src/core/scheduler-launcher.ts` | modify | 外部模式不拉起调度器 | yes |
| `src/bin/runner.ts` | add | 执行器进程：调度器 + 请求消费循环 + 心跳 | no |
| `src/app/api/run/route.ts` | modify | 外部模式写请求文件并等待执行器认领后返回 202 | yes |
| `src/app/api/readiness/route.ts` | modify | 外部模式 POST 写请求并等待缓存更新 | yes |
| `src/app/api/capabilities/route.ts` | modify | 同上 | yes |
| `src/app/config/page.tsx` | modify | 外部模式下无缓存时经执行器探测能力目录 | yes |
| `docker/entrypoint.sh` | modify | 按参数 `web` / `runner` 分支：web 不装 CLI、只启动看板；runner 装 CLI、预检、启动执行器 | yes |
| `docker/Dockerfile` | modify | CMD 默认 `web`；命令提示前缀指向 runner 容器 | yes |
| `compose.yaml` | modify | 两个服务：`web`（端口、只挂数据卷）、`runner`（凭据卷、CLI 卷，不开端口） | yes |
| `package.json` | modify | scripts 增加 `runner` | no |
| `test/core/requests.test.ts` | add | 请求文件的写入、认领、完成与过期；心跳覆盖判定 | no |
| `docs/deploy-docker.md` | modify | 两容器的卷、命令与升级 | no |
| `README.md` | modify | Docker 小节 | no |
| `docs/development.md` | modify | src/bin 目录说明 | no |

**不动的东西**：

- 本机直跑形态：`pnpm dashboard:prod` 与 `pnpm scheduler` 仍在同一台机器、同一用户下，进程内执行不变。
- `data/runs/`、`progress.json`、`auto-run.json`、`cancel.json` 的格式与语义。
- 看板前端：`POST /api/run` 仍返回 `{ started, runId, calls }`。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— `PELICAN_RUNNER` 未设时一切如旧；只有容器部署设为 `external`。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查 | pass | pass | 22931d9 | |
| `pnpm test` | node:test 单元测试 | pass | pass | 22931d9 | |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | 22931d9 | |
| `PELICAN_PORT=3100 docker compose up -d --build && sleep 60 && curl -fsS -o /dev/null http://127.0.0.1:3100/` | 两容器启动，看板可访问 | fail | - | | 变更前只有单容器；变更后待跑：宿主机 Docker 经代理访问 registry 返回 405，镜像无法重建 |
| `docker exec llm-iq-web sh -c 'test ! -e /home/node/.claude/.credentials.json && test ! -e /opt/clis/bin/agy'` | 看板容器内没有凭据与 CLI | fail | - | | 同上 |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟 | skip | skip | 22931d9 | 冒烟含 codex，按约定不消耗其额度；本机以 `PELICAN_RUNNER=external` 的看板 + `pnpm runner` 两进程实测：请求文件 1 秒内被认领并返回 runId，agy 一次调用 ok，就绪检查经执行器返回 200，心跳判定存活正确 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 请求文件模块、执行器进程、心跳；看板路由按开关分支；单测 | revert 本 commit |
| 2 | 容器入口、镜像与 compose 拆分；文档 | revert 本 commit |

## 回滚方案

- 触发条件：请求文件积压或执行器不认领；心跳判定误报。
- 步骤：compose 改回单服务并去掉 `PELICAN_RUNNER`，代码路径自动回到进程内执行；或 revert 两个 commit。
- 数据：无需迁移；`data/requests/` 可整目录删除。

## 人工确认

### 方案摘要

1. 要动什么：请求文件通道与执行器进程；看板路由按开关分支；容器拆成 web 与 runner；3 个模块
2. 不动什么：本机直跑形态、产物格式、前端契约
3. 为什么现在：公网开放后凭据不能与 Web 进程同一文件系统
4. 风险与回滚：请求不被认领时看板报错；去掉开关即回到进程内执行
5. 成本：2 步，不加依赖

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-26 | xumetide-dev | approved | 在对话中同意按安全设计的最终形态实施 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §2 | 端与进程：容器部署为 web 与 runner 两个进程，请求经 `data/requests/` | 待回填 |
| architecture.md §8 | 部署形态 Docker 改为两容器 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-008 | 待回填 |
| ADR（/adr-curator） | 不适用：开关可回退 | 待回填 |
