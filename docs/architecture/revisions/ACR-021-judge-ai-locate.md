# ACR-021: 裁判定位取景框再切细节表（Judge-Located Detail Crops）

| 项 | 内容 |
|---|---|
| 状态 | done |
| 日期 | 2026-10-01 |
| 变更类型 | new-module |
| 触发来源 | 口头：作品 20261001T161950Z/agy 的「座垫与臀」细节表切成了脚踏，「鹈鹕整体」与「头与喙」放大倍数只有 1.1；用户建议让裁判先给 BBOX，程序再切图 |
| 基线 | ARCH-001 |
| 影响章节 | §3 §4 |
| 改造面上限 | 3 个模块（src/core 与 test/core 同构；docs 不计） |
| 取代 / 被取代 | 无 |

ACR-019 的细节联系表取景框全靠几何推断（髋关节均值、车轮上方图形并集），它读不懂画法，遇到腿绕五通整体旋转、
背景元素与主体同层的作品就切错部位。本 ACR 在 AI 层的两次问答之前加一次「定位」：裁判看第一帧整幅画面，
给出鹈鹕整体、头与喙、座垫与臀、脚踏与脚四类部位的像素框，程序换算到 viewBox 后重切 8 帧细节表，再按原流程打分。

## 动机

- 现状：取景框由 `contact-sheet.ts` 的 `detailPlans` 按首帧量测推算。座垫以腿的旋转中心为准，腿是绕五通旋转的
  刚性杆时座垫表就切到曲柄；鹈鹕整体取车轮上方全部图形的并集，背景（天空、太阳、山）同层时并集等于整幅画面，
  放大倍数 1.1 等于没切。裁判拿着切错的表打 C7，分数不可信。
- 不动的代价：C7「坐姿与脚位」20 分、C6「主体是鹈鹕」15 分都依赖这两张表；只要画法稍复杂，AI 层就在看错的图。
- 为什么现在：用户复核 20261001T161950Z 这件作品时发现切图错误，并提出「裁判先给 BBOX、程序再切图」的两段式方案。

## 方案评估

需要的是「在一张动画首帧里找四个语义部位的框」。裁判 CLI 本来就要读这张图，多问一次即可；要评估的是
值不值得引入本地视觉模型。

| 方案 | 来源 | 版本 | 许可证 | 最近发布 | 维护状态 | 改造面（要动几个模块） | 维护成本 | 判定 | 否决理由 |
|---|---|---|---|---|---|---|---|---|---|
| onnxruntime-node + 开放词表检测模型（Grounding DINO 等）本地找部位 | npm:onnxruntime-node | 1.30.0 | MIT | 2026-09-14 | active | 2 个模块（src/core 接推理，docker 装运行时与模型权重） | 高：模型权重数百 MB 要随镜像分发；「座垫上的臀」「脚踏上的脚」这类语义框不在通用检测类别里，要自己标注微调 | reject | 维护成本：权重分发与微调都超出本项目范围，裁判 CLI 一次问答就能给出同样的框 |
| @tensorflow-models/coco-ssd 本地检测 | npm:@tensorflow-models/coco-ssd | 2.2.3 | Apache-2.0 | 2023-08-22 | unmaintained | 1 个模块 | 中 | reject | 维护成本：最近发布 2023-08 已 unmaintained；COCO 80 类没有座垫、曲柄、喙，识别不了要找的部位 |
| @google/genai 直调 Gemini 多模态 API 要 bbox | npm:@google/genai | 2.25.0 | Apache-2.0 | 2026-09-30 | active | 1 个模块 | 中：另开 API 账号与计费 | reject | 维护成本：本项目所有模型调用走 CLI 登录态（ACR-006 / ACR-014 / ACR-020），另开 API 通道要再做一套凭据与预算 |
| 自研：裁判 CLI 以评审模式读首帧 PNG，回 JSON 像素框；程序经根元素的屏幕矩阵换算到 viewBox，复用 ACR-019 的切图与拼表 | self | - | - | - | - | 1 个模块（src/core） | 低：约 200 行，一条提示词 + 一次 JSON 解析 + 一次重切，零新依赖 | adopt | - |

> **结论**：自研 —— 裁判已经在读联系表，定位只是多一次问答（多一张 640px 的图）；切图、拼表、落盘全部复用
> ACR-019 已有代码，零新依赖。

## 变更范围

| 路径 | 动作 | 改什么 | 影响既有行为 |
|---|---|---|---|
| `src/core/judge/ai-prompt.ts` | modify | 增定位提示词 `locatePrompt` 与解析 `parseLocateReply`（像素框夹到图内、过小的丢弃）；`AI_PROMPT_VERSION` 升 2 | no |
| `src/core/judge/ai-locate.ts` | add | 定位阶段：截首帧 640px 给裁判、换算像素框到 viewBox、合并成取景框清单、重切细节表并更新记录 | no |
| `src/core/judge/ai-judge.ts` | modify | `judgeOnce` 在盲描述之后、打分之前调用定位；定位失败只记日志，沿用代码层的表 | no |
| `src/core/judge/render-page.ts` | modify | 页面函数 `rootScreenMatrix`：根元素用户坐标到屏幕像素的矩阵，供像素框换算 | no |
| `src/core/judge/render-judge.ts` | modify | 导出 `captureLocateFrame`（首帧整幅截图 + 矩阵）与 `recaptureDetails`（按给定取景框重切 8 帧细节表、拼表、落盘） | no |
| `src/core/judge/contact-sheet.ts` | modify | 导出 `squarePlan`，定位阶段用同一规则（正方形、不小于短边 1/5）造取景框 | no |
| `src/core/judge/schema.ts` | modify | `ContactSheetDetail.locatedBy` 可选字段标明取景框来源（code 或 ai） | no |
| `test/core/judge/ai-locate.test.ts` | add | 定位提示词、解析、像素框换算与清单合并 | no |
| `docs/research/judge/judge.schema.json` | modify | `details[].locatedBy` | no |
| `docs/research/judge/animated-pelican-judging.md` | modify | 细节表一节补定位阶段 | no |
| `docs/architecture/architecture.md` | modify | §3 AI 层补定位；§4 问答次数 | no |
| `AGENTS.md` | modify | AI 语义层一条补「先定位再打分」 | no |
| `CHANGELOG.md` | modify | 作品评审条目补定位 | no |

**不动的东西**：

- 代码层的量测与分数（C1–C4）、首次出的代码层细节表：定位失败或 AI 层关闭时它们就是最终的表。
- 盲描述与打分两次问答的提示词与解析；`judges[]`、`usage`、`asks` 的记法（asks 自然变成 3）。
- 公开记录：`contactSheet` 本来就不发布，数据仓契约与校验器不变。
- 考场约束与适配器：定位调用仍是评审模式，只多一个可读文件。

## 兼容与回归

**兼容策略**：直接替换 —— 定位只在 AI 层开启时发生，且任何一步失败都退回代码层的表继续打分；
记录结构只增一个可选字段。

| 命令 | 覆盖 | 变更前 | 变更后 | commit | 备注 |
|---|---|---|---|---|---|
| `pnpm lint` | 全仓类型检查（tsc --noEmit，当前唯一静态门） | pass | pass | b1aa1ea | |
| `pnpm test` | node:test 单测，含新增 `test/core/judge/ai-locate.test.ts` | pass | pass | b1aa1ea | 854 用例 |
| `pnpm build` | Next.js 看板生产构建 | pass | pass | b1aa1ea | |
| `pnpm check:length` | 文件与函数长度阈值 | pass | pass | b1aa1ea | |
| `PELICAN_CONFIG=config/smoke.config.yaml pnpm run:once` | 端到端冒烟：三家 CLI 调用链 | skip | skip | | 真实调用 CLI 消耗配额，由所有者自行执行，不由代理触发 |
| `pnpm exec tsx /tmp/locate-check/run.ts` | 对 20261001T161950Z/agy 真实请裁判定位并重切：座垫表切到座垫、鹈鹕表放大倍数大于 1.5 | skip | pass | b1aa1ea | 变更前无此阶段；裁判 claude/claude-sonnet-5-5@high 16 秒给出四个框：座垫表切到座垫与臀（×7.9），鹈鹕整体 ×2、头与喙 ×3.9、脚踏与脚 ×7.9；车轮沿用代码层 |

## 分步实施

| 步 | 做什么 | 回滚点 |
|---|---|---|
| 1 | 页面矩阵 + 首帧截图 + 重切函数 + 定位提示词与解析 + `ai-locate` + `judgeOnce` 接入 + schema 字段 + 单测（b1aa1ea） | revert 本 commit |
| 2 | 对出错的那件作品真实跑一次定位核对切图；回填文档 | revert 本 commit |

## 回滚方案

- 触发条件：回归 fail；裁判给的框系统性偏离（切图比几何法更差）；定位使单幅评审超时。
- 步骤：逆序 revert 两个 commit；已落盘的各类细节表 PNG 会在下一次代码层评审时被几何法的表覆盖，不需迁移。
- 数据：`locatedBy` 是可选字段，旧代码读到会忽略。

## 人工确认

### 方案摘要

1. 要动什么：`src/core/judge` 加定位阶段（一个新文件、四个文件各加一小段）；裁判问答从 2 次变 3 次。涉及 1 个源模块。
2. 不动什么：代码层量测与分数、盲描述与打分提示词、公开记录与数据仓、适配器参数。
3. 为什么现在：几何法切错座垫与整体表，C6 / C7 在看错的图；用户复核后提出两段式方案。
4. 风险与回滚：裁判框不准则退回几何法的表（自动）；彻底回滚 2 个 commit。
5. 成本：2 步；零新依赖；每幅作品多一次带一张 640px 图的问答。

### 确认记录

| 日期 | 谁 | 结论 | 备注 |
|---|---|---|---|
| 2026-10-01 | 用户 | approved | 口头：「如果不行就交给裁判去切图，裁判切图和评审是两个独立的进程，做一个小的 pipeline，第一个切图的返回我们需要的 BBOX 列表，然后交给程序切图和生成帧序联系表图……具体还是你来」 |

## 回填

| 去处 | 内容 | 状态 |
|---|---|---|
| architecture.md §3 | AI 层补「先定位取景框再打分」 | 已回填 |
| architecture.md §4 | `.judge-ai.txt` 含三次问答 | 已回填 |
| architecture.md 表头「变更记录」 | 追加 ACR-021 | 已回填 |
| ADR（/adr-curator） | 不适用：失败自动退回几何法，可整体回滚 | 不适用 |
