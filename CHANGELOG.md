# 更新日志

格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循
[语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增

- 所有者配对登录：宿主机 `pnpm pair` 签发一次性配对码，浏览器换取设备凭据（服务端只存
  HMAC）；不登录只能看结果，配置、跑一次、停止与自动任务开关只对所有者开放；写操作要求
  `X-Pelican-Action` 头并写入审计日志；配置页可逐台吊销设备。
- 宿主机上限：`PELICAN_CEILING_PER_DAY_USD` / `PELICAN_CEILING_PER_ROUND_USD` 限住配置里的预算，
  `PELICAN_ALLOW_EXTRA_ARGS` 未设时含 `extraArgs` 的配置校验失败。
- 输出泄漏拦截：每轮以三家凭据文件的滑窗 HMAC 指纹比对模型输出，命中的调用记为 error 且
  作品与转录不落盘。
- 安全响应头：CSP、`X-Frame-Options`、`Referrer-Policy`、`X-Content-Type-Options`。
- 公网暴露的安全设计文档 `docs/security/public-exposure-design.md`。

### 变更

- 三家 CLI 的调用不再给模型任何工具：claude `--tools ""`，codex `untrusted` 审批策略且适配器
  一律拒绝，agy 去掉 `--dangerously-skip-permissions`。
- Docker 部署拆为 `llm-iq-web` 与 `llm-iq-runner` 两个容器：看板容器不装 CLI、不挂登录态卷；
  看板发起的一轮经数据卷里的请求文件交给 runner。登录、配对与排查命令改在 runner 里执行。

## [0.1.0] - 2026-09-26

首个公开版本。

### 新增

- 定时调用 claude / codex / agy 三家 CLI 执行鹈鹕自行车基准，按 CLI × 模型 × 思考强度组成
  被测矩阵，每次调用在干净的临时工作目录中进行。
- 提示词：Simon Willison 的经典版与升级版原文，以及四大名著名场面候选集，按周期轮换。
- 看板：24 小时时间线与结果矩阵，格子按强度排成 2×2，点开查看完整卡片；执行进度与自动任务
  状态经 SSE 推送；作品按需加载；支持筛选、时区切换、导出当天时间轴为 PNG / SVG。
- “跑一次”面板按范围与题目临时发起一轮，显示调用数与预计成本；可停止正在执行的一轮。
- 配置界面在保留注释的前提下写回 YAML；CLI 能力探测、安装与登录预检、登录引导命令。
- 成本：从 CLI 转录解析用量，按公开价格目录折算 API 等价成本；支持每轮与每日预算上限。
- Docker 部署：单容器运行看板与调度器，三家 CLI 在容器首次启动时安装到独立卷，登录态持久化。

[0.1.0]: https://github.com/meomeo-dev/llm-iq-dashboard/releases/tag/v0.1.0
