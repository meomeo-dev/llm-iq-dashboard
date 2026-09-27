# ACR-003: 看板作品按需加载，去掉定时整页刷新（Lazy-Load Dashboard Art, Drop Periodic Refresh）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-09-25 |
| 变更类型 | structure-change |
| 触发来源 | 口头：“跑一次”加载选项要等 10 到 20 秒；排查发现看板进程内存涨到数 GB，要求优化 |
| 基线 | ARCH-001 |
| 影响章节 | §1 §4 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：首页把最近 24 小时约 309 张卡片的 SVG 源码作为属性内联进页面数据（约 4.2 MB），
  每次 `router.refresh()` 整份重发。刷新有两个来源：每个标签页每 60 秒一次，执行中每完成一次调用一次。
- 测量数据：生产构建下首页 HTML 5.9 MB、每次刷新的 RSC 负载 4.8 MB；dev 模式下 React 19 还会把每次
  `readFile` 的返回值写进调试信息，RSC 负载 9.7 MB，连刷 20 次看板进程 RSS 从 1.0 GB 涨到 7.4 GB，
  在内存吃紧的机器上所有 `/api` 请求被拖到 1.4 到 20 秒。
- 不动的代价：作品越多、打开的标签页越多，内存与网络开销线性上涨；“跑一次”等交互跟着变慢。
- 为什么现在：ACR-002 已把执行进度推送到前端，定时整页刷新不再承担“发现新结果”的职责，
  可以与内联 SVG 一起去掉。

## 方案评估

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| react-intersection-observer 做可见性 + SWR 做取数缓存 | npm:react-intersection-observer | 11.0 | MIT | 2026-08-26 | active | 2 个模块，另加 2 项依赖 | 中：两项依赖跟随 React 大版本升级 | reject | 改造面：要新增 2 项依赖（SWR 已在 ACR-001 否决），而所需能力只是一次可见性判断与按地址缓存一个 Promise，自研约 60 行、0 项依赖 |
| SWR 管理作品取数 | npm:swr | 2.5 | MIT | 2026-08-12 | active | 2 个模块，另加 1 项依赖 | 中：引入第二套客户端数据层，与 ACR-002 的推送存储并存 | reject | 维护成本：看板客户端将同时存在 SSE 存储与 SWR 缓存两套数据层；作品文件写出后不变，不需要重新验证与失效 |
| 浏览器原生 IntersectionObserver + fetch，按地址缓存 | self | - | - | - | - | 2 个模块（src/core、src/app） | 低：约 60 行，只用浏览器标准 API | adopt | - |

> **结论**：自研。卡片只带作品地址，进入视口时经已有的 `/art/{runId}/{file}` 取源码，浏览器端缓存；
> 删掉定时整页刷新。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| src/core/types.ts | modify | `DashboardCard` 去掉内联的 `svg` 字段 | no |
| src/core/store.ts | modify | `loadCardsBetween` 不再读 SVG；新增 `loadArt()` 供单件作品页与原始作品接口读源码 | no |
| src/app/art/[runId]/[file]/route.ts | modify | 改用 `loadArt()`；缓存头加 `immutable` | no |
| src/app/view/[runId]/[file]/page.tsx | modify | 改用 `loadArt()`，单件作品页仍由服务端带源码 | no |
| src/app/components/art-source.ts | add | 按作品地址取源码并缓存（同一件作品的卡片与缩略图共用一次请求） | no |
| src/app/components/LazySvgFrame.tsx | add | 进入视口附近才取源码，取回后交给 `SvgFrame` 净化挂载 | no |
| src/app/components/PelicanCard.tsx | modify | 作品框改用 `LazySvgFrame`；成功与否按 `svgFile` 判断 | no |
| src/app/components/timeline/Thumb.tsx | modify | 缩略图改用 `LazySvgFrame` | no |
| src/app/components/export/export-image.ts | modify | `buildThumbnails` 改为异步，先取齐源码再净化 | no |
| src/app/components/export/ExportMenu.tsx | modify | 导出流程等待缩略图就绪 | no |
| src/app/components/Dashboard.tsx | modify | 删除 60 秒定时 `router.refresh()` | yes |

**不动的东西**：

- SVG 的安全边界：模型输出仍只在浏览器端经 `sanitizeSvg` 净化后挂进 DOM，不走 `dangerouslySetInnerHTML`；
  `/art` 的 CSP 沙箱响应头与“文件名只认 run.json 登记项”的校验不变。
- `data/runs/{runId}/` 的产物格式（run.json、progress.json、SVG 文件）。
- ACR-002 的推送链路：完成数变化仍触发 `router.refresh()`。
- 导出图的版式与内容（`timeline-svg.ts`）。

## 兼容与回归

**兼容策略**：直接替换。只改看板内部的取数方式，接口路径与产物格式不变；回滚即 revert。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | 64f92c4 | |
| `pnpm test` | node:test 单元测试（45 项） | pass | pass | 64f92c4 | |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | 64f92c4 | 在 rsync 出的工作区副本中以 `next build` 执行，避免覆盖运行中 dev server 的 .next；首页 First Load JS 变更前 119 kB、变更后 120 kB |
| `test $(curl -s -o /dev/null -w "%{size_download}" -H "RSC: 1" http://localhost:3000/) -lt 1500000` | 首页刷新负载不再携带 SVG 源码（上限 1.5 MB） | fail | pass | 64f92c4 | 变更前 dev 9.7 MB、生产 4.8 MB；变更后 dev 0.6 MB、生产 0.33 MB；需看板在运行 |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链、候选集抽取、强度折叠 | skip | skip | 64f92c4 | 冒烟调用 codex，按约定不消耗其额度；本变更不触及执行链路，由看板上 claude 与 agy 的实际轮次覆盖 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 卡片去掉内联 SVG，新增 `loadArt`、`art-source`、`LazySvgFrame`；卡片、缩略图、导出、单件作品页、原始作品接口改用新路径；删除 60 秒定时刷新。浏览器核对缩略图、卡片、导出 PNG 与单件作品页 | revert 本 commit |
| 2 | 看板改为手动启动的生产模式：在同级独立目录按提交构建并 `next start`，产物目录与配置仍指向本仓库；不常驻、不写系统配置。单独 chore 提交，不在本 ACR 的代码改动内 | revert 该 chore 提交 |

## 回滚方案

- 触发条件：回归 fail；或缩略图、卡片、导出图出现空白。
- 步骤：revert 第 1 步的 commit，恢复内联 SVG 与定时刷新。
- 数据：无需迁移，不涉及任何落盘格式。

## 人工确认

### 方案摘要

1. 要动什么：卡片不再内联 SVG 源码，浏览器在作品进入视口时经 `/art` 取源码；删除 60 秒定时整页刷新；2 个模块。
2. 不动什么：SVG 净化与 CSP 沙箱边界、产物格式、SSE 推送链路、导出图版式。
3. 为什么现在：首页每次刷新重发 4.8 MB（dev 下 9.7 MB），看板进程内存涨到数 GB，交互被拖慢到 10 到 20 秒。
4. 风险与回滚：作品取数失败时显示空框或报错框；回滚 = revert 1 个 commit。
5. 成本：1 步、约半天；0 项新依赖。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-25 | 仓库所有者 | approved | 批准实施并提交；生产模式不常驻，只加手动启动配置，独立目录构建、占 :3000 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §1 | 页面数据不携带 SVG 源码，作品经 `/art` 按需取；整页刷新只由完成数变化触发 | 已回填 |
| architecture.md §4 | 看板读取 SVG 的时机改为浏览器按需请求 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-003 | 已回填 |
| ADR（/adr-curator） | 不适用：非难逆转，回滚仅 revert 1 个 commit | 已回填 |
