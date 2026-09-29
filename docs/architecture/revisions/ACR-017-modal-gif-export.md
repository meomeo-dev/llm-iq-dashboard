# ACR-017: 结果集弹窗导出 GIF 动图（Animated GIF export of a result set）

| 项 | 内容 |
|---|---|
| 状态 | implementing |
| 日期 | 2026-09-29 |
| 变更类型 | add-dependency |
| 触发来源 | 口头：点格子打开的结果集弹窗要能导出图片，且作品是动画，要 GIF 动图；PNG / SVG 导出已在本地实现未提交 |
| 基线 | ARCH-001 |
| 影响章节 | §0 §1 |
| 改造面上限 | 3 个模块 |
| 取代 / 被取代 | 无 |

## 动机

- 现状：导出只有首页时间线（PNG / SVG 静态图）。结果集弹窗里的作品是 SMIL / CSS 动画 SVG，
  弹窗本身没有导出，横向滚动看不到的列也截不到；拿去分享只能截屏，动画丢失。
- 不动的代价：多上游对比的结果无法以动图形式分享到聊天工具、Issue 与 README，这些地方不播 SVG 动画。
- 为什么现在：ACR-016 之后弹窗是比较结果的主界面，导出是它的下一步；用户明确要求 GIF。

## 方案评估

作品动画只能靠浏览器播放，GIF 的每一帧必须由浏览器把动画 SVG 栅格化后取得；浏览器没有 GIF 编码器，
要么引入，要么自写。取帧方式已在开发看板里验证：实时录制不可靠（作为图片加载的 SVG，其动画在 Chromium
里只在文档可见且被观察时前进，画进画布时经常停在同一帧）；改为把时刻烘进作品副本——SMIL 动画的 `begin`
统一减去 t、CSS 动画加 `animation-delay: -t` 并暂停——每帧一份副本解码后立即画进画布，帧与帧之间
差异随 t 单调变化，6 帧只需十几毫秒，且不依赖标签页是否可见。题库里 32 件动态鹈鹕车作品 31 件用 SMIL、
5 件用 CSS 关键帧，`begin` 几乎都缺省（即 0s）；带事件或同步基准的 `begin` 不改写，这类动画停在起始态。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| modern-gif：帧序列（CanvasImageSource / 像素）→ GIF，可选 Web Worker，`maxColors` 控制体积 | npm:modern-gif | 2.1.0 | MIT | 2026-04-16 | active | 1 个模块（src/app）+ package.json | 低：1 个传递依赖（modern-palette），167 KB 未压缩，纯 JS 无 WASM | adopt | - |
| gifenc：PnnQuant 量化 + LZW，9 KB，支持全局调色板 | npm:gifenc | 1.0.3 | MIT | 2021-03-07 | unmaintained | 1 个模块 | 中：五年无发布，无抖动，Worker 要自己拼 | reject | 维护成本：最近发布 2021-03，unmaintained |
| gif.js：老牌 Worker 编码器 | npm:gif.js | 0.2.0 | MIT | 2016-12-06 | unmaintained | 1 个模块 | 高：九年无发布，需拷贝 worker 脚本到 public/ | reject | 维护成本：最近发布 2016-12，unmaintained |
| gifski-wasm：gifski 的 WASM 封装，画质最好 | npm:gifski-wasm | 2.2.0 | AGPL-3.0-or-later | 2025-02-05 | stale | 1 个模块 | 高：AGPL 与本仓库 MIT 发布不兼容；WASM 需配 Next.js 静态资源 | reject | 维护成本：AGPL 与 MIT 发布不兼容 |
| 自写：中值切分量化 + LZW 编码 | self | - | - | - | - | 1 个模块 | 高：编码器与量化都要自己测、自己修 | reject | 已有活跃维护的 MIT 方案，自写只多出维护面 |

> **结论**：modern-gif —— 活跃维护、MIT、纯 JS、接口就是"帧数组 + 延时 → 字节"，正好接在已有的画布栅格化之后；
> 帧的采集（把动画作品放进视口逐帧画到画布）是本仓库特有逻辑，自写。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `package.json` | modify | dependencies 增 `modern-gif` | no |
| `pnpm-lock.yaml` | modify | 锁定 modern-gif 与 modern-palette | no |
| `src/app/components/export/result-set-svg.ts` | add | 结果集合成图（标题 + 卡片；多上游为上游 × 强度矩阵），纯函数，PNG / SVG / GIF 共用 | no |
| `src/app/components/export/result-set-export.ts` | add | PNG / SVG / GIF 三条流水线的入口，作品源码只取一次、只净化一次 | no |
| `src/app/components/export/result-set-gif.ts` | add | 取帧与编码：静态层（标题、卡片框、文字）栅格化一次；每帧把时刻烘进各作品副本（SMIL `begin` 减 t、CSS 负延时并暂停）解码后画进作品框；10 fps × 4 秒共 40 帧交 modern-gif 编码；帧面积 × 帧数超上限时降倍率 | no |
| `src/app/components/export/export-image.ts` | modify | 抽出"SVG 字符串 → 画布"的栅格化函数供 GIF 复用；`downloadBlob` 导出 | no |
| `src/app/components/export/timeline-svg.ts` | modify | 导出 `escapeXml` 供结果集合成图复用 | no |
| `src/app/components/model-modal/ModelExportMenu.tsx` | add | 弹窗头部"导出"菜单：PNG / SVG / GIF；取帧与编码期间菜单项显示进度 | no |
| `src/app/components/model-modal/ModelModal.tsx` | modify | 头部动作区挂导出菜单 | no |
| `src/app/components/model-modal/ModelModalHeader.tsx` | modify | 增 `actions` 插槽 | no |
| `src/app/components/model-modal/model-modal-dialog.css` | modify | 导出按钮样式 | no |
| `test/app/components/export/result-set-svg.test.ts` | add | 合成图布局、尺寸、嵌图、失败框、截断折行、转义 | no |
| `test/app/components/export/result-set-gif.test.ts` | add | 时刻烘焙（SMIL `begin` 改写、CSS 延时注入，jsdom）、帧计划（帧数、延时、倍率上限）与作品落位（等比居中） | no |
| `test/fixtures/markup/wp-f/ModelModal-with-standard.html` | modify | 头部多出导出菜单 | no |
| `docs/architecture/architecture.md` | modify | §0 技术栈表增 modern-gif；§1 看板导出一句 | no |

**不动的东西**：

- 首页时间线导出（`ExportMenu.tsx`、`timeline-svg.ts` 的绘制逻辑）与画布上限规则。
- 作品净化与取数路径（`svg-sanitize.ts`、`art-source.ts`）：取帧只从净化后的作品副本出发。
- 页面数据、进度文件与配置：导出全在浏览器端完成，不新增接口。

## 兼容与回归

**兼容策略**：并行运行 + 开关 —— 新菜单只是入口；GIF 录制失败时在菜单内报错，PNG / SVG 与首页导出不受影响。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，含 test/） | pass | - | | 38ef7dd |
| `pnpm test` | node:test 全量 | pass | - | | 38ef7dd，750 项 |
| `pnpm check:length` | 文件与函数长度门禁 | pass | - | | 38ef7dd |
| `pnpm build` | Next.js 看板生产构建（含 modern-gif 打包） | pass | - | | 7e64a2d |
| `PELICAN_CONFIG=data/profile-smoke.config.yaml pnpm run:once` | 端到端冒烟：3 个 profile 同轮并行（动态鹈鹕车），产出供导出核对 | pass | - | | 轮次 20260929T150913Z |

GIF 本身在分步实施里用开发服务器核对：导出的文件能在图片查看器里播放、背景不透明、作品不被截断、
横向滚动看不到的列也在图里。

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 结果集合成图与弹窗导出菜单（PNG / SVG），无新依赖 | revert 本 commit |
| 2 | 加 modern-gif；时刻烘焙取帧与编码；菜单增 GIF | revert 本 commit + `pnpm remove modern-gif` |
| 3 | 本单登记与 architecture.md 回填（docs） | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；GIF 在主流看图工具里不播放或体积失控（单张超过 30 MB）。
- 步骤：revert 第 2 步 commit 并移除依赖，PNG / SVG 导出保留；无持久化状态。
- 数据：无需迁移。

## 人工确认

### 方案摘要

1. 要动什么：弹窗头部加"导出"菜单，PNG / SVG / GIF 三种；GIF 用 modern-gif 编码，帧由浏览器把时刻烘进作品副本后逐帧画到画布取得；涉及 src/app、test/app 2 个模块 + package.json。
2. 不动什么：首页时间线导出、作品净化与取数、页面数据与接口。
3. 为什么现在：弹窗已是多上游比较的主界面，作品是动画，分享要 GIF。
4. 风险与回滚：GIF 体积大（5 列 × 2 行、4 秒 10 fps 估计 10–25 MB）且编码要几秒到十几秒；带事件或同步基准 `begin` 的 SMIL 动画停在起始态；回滚 = revert 1 个 commit + 移除依赖。
5. 成本：3 步 3 个 commit；新依赖 modern-gif（MIT，活跃，1 个传递依赖）。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-09-29 | luojin | approved | AskUserQuestion 批准；取帧方式已在开发看板验证 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §0 | 技术栈表增 modern-gif（GIF 编码，浏览器端） | 待回填 |
| architecture.md §1 | 看板：结果集弹窗可导出 PNG / SVG / GIF，GIF 帧由时刻烘焙取得 | 待回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-017 | 待回填 |
| ADR（/adr-curator） | 不适用：非难逆转 | 待回填 |
