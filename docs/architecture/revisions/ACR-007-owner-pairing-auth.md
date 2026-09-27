# ACR-007: 所有者配对登录与公开只读（Owner Pairing Auth and Public Read-Only）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-26 |
| 变更类型 | new-module |
| 触发来源 | 口头：看板对公网开放只读，所有者配置、跑一次与开定时须登录（docs/security/public-exposure-design.md §4.2、§4.3、§4.6） |
| 基线 | ARCH-001 |
| 影响章节 | §1 §2 §6 |
| 改造面上限 | 4 个模块（test/core 只新增单测文件，不改既有行为） |
| 取代 / 被取代 | 无 |

## 动机

- 现状：所有路由无鉴权；`POST /api/run` 花钱，`PUT /api/config` 改矩阵与提示词，`/api/readiness`
  暴露登录状态与 `docker exec` 命令。
- 不动的代价：端口一旦放开，任何人都能发起整轮调用与改配置。
- 为什么现在：两个视角已明确——公网匿名只读结果，所有者登录后操作。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| next-auth 做用户名口令或 OAuth 登录 | npm:next-auth | 4.24 | ISC | 2026-07-20 | active | 2 个模块 + 1 项依赖 + 外部身份源 | 中：单人看板要维护用户表或第三方 OAuth 配置 | reject | 维护成本：单人场景不需要用户体系；口令可被撞库与钓鱼，OAuth 引入外部依赖与回调地址 |
| iron-session 加密 cookie 会话 | npm:iron-session | 9.0 | MIT | 2026-08-30 | active | 1 个模块 + 1 项依赖 | 低 | reject | 改造面：只解决 cookie 编码，不解决"凭据怎么发"；本方案的会话是随机凭据加服务端 HMAC 记录，无需加密 cookie |
| 配对式登录：宿主机命令签发一次性配对码，浏览器换取设备凭据；服务端只存凭据的 HMAC | self | - | - | - | - | 2 个模块（src/core、src/app）+ src/bin 一条命令 | 低：约 300 行，只用 Node 内置 crypto | adopt | - |

> **结论**：配对式登录。无口令可撞、配对窗口只在宿主机打开；设备凭据可逐个吊销。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/auth/store.ts` | add | JSON 原子写入；`data/server.key`（32 字节，0600）首次启动生成；HMAC 与常量时间比较 | no |
| `src/core/auth/pairing.ts` | add | 配对窗口 `data/pairing.json`：配对码 HMAC、10 分钟有效、最多 5 次尝试、用后即失效 | no |
| `src/core/auth/devices.ts` | add | 设备表 `data/devices.json`：凭据 HMAC、名称、签发与最近使用、吊销 | no |
| `src/core/auth/session.ts` | add | 签发与校验设备凭据、cookie 属性、24 小时轮换、30 天滑动与 90 天绝对有效期 | no |
| `src/core/auth/guard.ts` | add | `requireOwner(request)`：cookie 校验 + 写操作校验 `X-Pelican-Action` 头；`isOwner()` 供页面 | no |
| `src/core/auth/rate-limit.ts` | add | 进程内按来源 IP 与设备计数：配对 5 次/窗口，发起执行 6 次/小时 | no |
| `src/core/auth/audit.ts` | add | `data/audit.log` 追加写操作记录 | no |
| `src/bin/pair.ts` | add | `pnpm pair [--name 名称]` 打开配对窗口并打印配对码；`--revoke-all` 清空设备 | no |
| `package.json` | modify | scripts 增加 `pair` | no |
| `src/app/api/pair/route.ts` | add | `POST`：配对码换设备凭据 | no |
| `src/app/api/session/route.ts` | add | `GET`：是否所有者与设备列表；`DELETE`：退出当前设备 | no |
| `src/app/api/devices/[id]/route.ts` | add | `DELETE`：吊销指定设备 | no |
| `src/app/api/run/route.ts` | modify | GET 与 POST 都要求所有者 | yes |
| `src/app/api/run/cancel/route.ts` | modify | 要求所有者 | yes |
| `src/app/api/config/route.ts` | modify | GET 与 PUT 都要求所有者 | yes |
| `src/app/api/auto-run/route.ts` | modify | PUT 要求所有者；GET 保持公开（看板显示下一次触发） | yes |
| `src/app/api/readiness/route.ts` | modify | GET 与 POST 都要求所有者 | yes |
| `src/app/api/capabilities/route.ts` | modify | GET 与 POST 都要求所有者 | yes |
| `src/app/pair/page.tsx` | add | 输入配对码的页面 | no |
| `src/app/pair/PairForm.tsx` | add | 配对码表单；已登录时显示当前设备与退出 | no |
| `src/app/pair/pair.css` | add | 配对页样式 | no |
| `src/app/config/page.tsx` | modify | 非所有者重定向到 `/pair`；页尾增加设备列表与吊销 | yes |
| `src/app/config/DevicePanel.tsx` | add | 已配对设备列表与吊销 | no |
| `src/app/config/config.css` | modify | 设备表样式 | no |
| `src/app/page.tsx` | modify | 读 cookie 判断所有者，传给看板；CLI 状态提示只对所有者显示 | no |
| `src/app/components/Dashboard.tsx` | modify | 透传 `owner` | no |
| `src/app/components/toolbar/Toolbar.tsx` | modify | 非所有者隐藏跑一次、自动任务开关与配置入口，显示"所有者登录"链接 | yes |
| `src/app/components/run-status/RunStatus.tsx` | modify | 停止按钮只对所有者显示 | yes |
| `src/app/components/cli-status/CliStatusBanner.tsx` | modify | 重新检查改用 action-fetch | no |
| `src/app/components/action-fetch.ts` | add | 写请求统一加 `X-Pelican-Action` 头，401 时跳转 `/pair` | no |
| `src/app/components/run-control/AutoRunToggle.tsx` | modify | 改用 action-fetch | no |
| `src/app/components/run-control/RunOnceMenu.tsx` | modify | 改用 action-fetch | no |
| `src/app/components/run-control/StopRunButton.tsx` | modify | 改用 action-fetch | no |
| `src/app/config/ConfigEditor.tsx` | modify | 改用 action-fetch | no |
| `src/app/config/CapabilityPanel.tsx` | modify | 改用 action-fetch | no |
| `next.config.ts` | modify | 安全响应头：CSP、`X-Frame-Options`、`Referrer-Policy`、`X-Content-Type-Options` | no |
| `test/core/auth` | add | 配对、设备、会话、限流的单测 | no |
| `docs/deploy-docker.md` | modify | 配对流程与设备管理 | no |
| `README.md` | modify | 两个视角与 `pnpm pair` | no |

**不动的东西**：

- 公开只读的路由与页面：`GET /`、`/api/runs`、`/api/progress`、`/api/events`、`GET /api/auto-run`、`/art`、`/view`。
- 执行、调度、存储与产物格式。
- 现有 API 的请求与响应结构（只增加鉴权，不改字段）。

## 兼容与回归

**兼容策略**：直接替换 —— 本机部署（127.0.0.1）同样启用鉴权，首次使用需配对一次；没有外部调用方。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查 | pass | pass | 22931d9 | |
| `pnpm test` | node:test 单元测试 | pass | pass | 22931d9 | |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | 22931d9 | |
| `PELICAN_PORT=3100 docker compose up -d --build && sleep 30 && test "$(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:3100/api/run)" = 401` | 无凭据的写请求被拒 | fail | pass | 22931d9 | 变更前无鉴权，该请求返回 202 或 409 |
| `test "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3100/api/runs)" = 200` | 公开只读仍可访问 | pass | pass | 22931d9 | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟 | skip | pass | 22931d9 | 回归时误跑了完整冒烟（含 codex）；另在开发服务器上完成配对、写操作头、退出与吊销的实测 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | auth 核心模块、`pnpm pair`、配对与会话路由、单测 | revert 本 commit |
| 2 | 现有路由加守卫；页面按所有者渲染；安全响应头；文档 | revert 本 commit |

## 回滚方案

- 触发条件：所有者无法配对或会话反复失效。
- 步骤：revert 第 2 步恢复无鉴权；`data/devices.json`、`data/pairing.json`、`data/server.key` 可直接删除。
- 数据：无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：新增 auth 模块与配对命令；路由加守卫；页面按所有者渲染；3 个模块（src/core、src/app、src/bin）
2. 不动什么：公开只读路由、执行链路、产物格式
3. 为什么现在：公网开放前的前提
4. 风险与回滚：所有者被锁在外面时在宿主机重新 `pnpm pair`；revert 两个 commit
5. 成本：2 步，不加依赖

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-26 | xumetide-dev | approved | 在对话中确认两个视角：公网只读，所有者登录后操作 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §1 | 看板分公开只读与所有者两个视角 | 已回填 |
| architecture.md §2 | 端增加 `pnpm pair` | 已回填 |
| architecture.md §6 | 安全边界增加：配对登录、写操作头校验、审计 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-007 | 已回填 |
| ADR（/adr-curator） | 不适用：可 revert | 不适用 |
