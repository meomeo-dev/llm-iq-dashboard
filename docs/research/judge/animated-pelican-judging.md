# 动态鹈鹕车评审方案

给 `animated-pelican-v1` 的每幅作品打 0–100 分，并贴「智商在线」或「降智」标签。
评审分代码层与 AI 层：代码层不花配额、可回填历史；AI 层只对通过闸门的作品运行。
评审记录的结构由同目录 [`judge.schema.json`](judge.schema.json) 约束。

## 1. 口径

- 评审对象只限 `status = ok` 的调用；`no-svg` / `error` / `timeout` 不评审，沿用原有分类。
- 标准来自题目自带的 `standard`（[data-classic.ts](../../../src/core/prompt/data-classic.ts)）：
  旋转中心、踩踏联动、语法规范三条，拆成可逐项计分的闸门与标准。
- 闸门（gate）任一不通过：总分 0，判「降智」，不进入 AI 层。
- 标准（criterion）逐项计分，`maxScore` 之和为 100；总分 ≥ 78 判「智商在线」；及格线只定标签不改分数，调整不升 `version`，展示时按当前及格线重定旧记录的结论。
- 任何标准未判定时 `verdict = pending`，看板显示「待复核」，不贴标签。
- 分数只在同一 `rubric.id + version` 内可比；改标准即升版本，旧记录不重算、不混排。
  `version` 从首次发布起算：发布前改口径不升版本，已发布的版本上改口径才升；AI 提示词的 `promptVersion` 同此规矩。

## 2. 分层与标准

### 2.1 闸门

| id | 层 | 口径 |
|---|---|---|
| G1 | static | XML 解析零错误 |
| G2 | static | 存在 `<animate*>`，或 `<style>` 内同时有 `@keyframes` 与 `animation` |
| G3 | static | 无 `<script>`、`<foreignObject>`、外部引用、内嵌位图 |
| G4 | render | 8 帧两两像素差的最大值超过阈值，画面确实在动 |
| G5 | render | 每一帧的内容包围盒都在 viewBox 内，没有飞出画布 |

### 2.2 计分标准

| id | 层 | 分值 | 满分口径 | 零分口径 |
|---|---|---|---|---|
| C1 | static + render | 10 | 前后车轮各绕自身轴心旋转：静态解析时旋转中心与 `<circle>` 的 `cx cy` 一致；渲染时轮子包围盒中心逐帧漂移接近 0 | 绕全局 (0,0) 或其他点旋转，轮子位置随帧移动 |
| C2 | static + render | 8 | 曲柄与脚踏绕五通中心旋转，两脚踏相位相差 180° | 曲柄不转，或绕错中心 |
| C3 | static + render | 4 | `repeatCount="indefinite"` 或 `infinite`；首帧与末帧接近，循环闭合 | 只播放一次，或末帧跳变 |
| C4 | static + render | 8 | 腿部动画周期与曲柄周期相等或成整数倍；渲染时脚踩在脚踏上：首帧离脚尖最近的脚踏点随曲柄刚体搬到各帧后，到腿下半段的距离相对首帧的变化不超过曲柄伸出长度的 35% | 腿不动、周期与曲柄无关，或腿只绕髋摆动、脚踏点在半个周期里离开腿（变化 ≥ 80%） |
| C5 | ai | 15 | 车架、车把、座垫、辐条轮、脚踏、曲柄齐全且形状正确 | 只有轮子或缺少主要部件 |
| C6 | ai | 15 | 盲描述能认出是鹈鹕（长喙、喉囊） | 盲描述认成其他鸟或无法辨认的形状 |
| C7 | ai | 15 | 鹈鹕坐在座垫上，双脚落在脚踏上 | 鹈鹕悬空、脱离车身或脚不在脚踏上 |
| C8 | ai | 15 | 8 帧连看，腿的伸缩与脚踏位置对应，像在踩踏 | 腿与脚踏各动各的 |
| C9 | ai | 10 | 翅膀（前肢）搭在车把上，像在扶着车把骑行 | 翅膀收在身侧、够不着车把，或没有车把可扶 |

代码层合计 30 分，AI 层合计 70 分：代码层只能判「降智」，「智商在线」必须经 AI 层。
C6 只管「认得出是鹈鹕」；骑姿与接触点分归 C7（座垫、脚踏）与 C9（车把），不混进身份判断。
代码层量的是几何与时序，读不出鹈鹕像不像、坐没坐稳；它对复杂作品又有误判，所以权重压到不足以过线。

静态解析与渲染量测对同一标准各出一个分，取较低者。静态解析在嵌套 `transform`、
`<use>` 引用下会算不准，渲染结果为准；渲染层不可用时只用静态分，并在 `reason` 里写明。

## 3. 代码层

### 3.1 静态解析（现有 jsdom，MIT）

- 每次调用结束时同步执行，耗时毫秒级，可对 `data/runs/` 全量回填。
- 产出 G1–G3 与 C1–C4 的静态分。
- 旋转中心的判定：解析 `animateTransform type="rotate"` 的 `values` / `from` / `to`
  第二、三个分量，或 CSS 的 `transform-origin`（连同 `transform-box`），与被驱动元素内
  最大 `<circle>` 的圆心比较；距离小于圆半径的 5% 记满分，按距离线性扣至 0。
- 周期的判定：解析 `dur` 或 `animation-duration`，腿与曲柄周期之比为整数记满分。

### 3.2 渲染量测（新增 playwright-core，Apache-2.0）

- 在无头 Chromium 中加载 SVG。SMIL 用 `pauseAnimations()` + `setCurrentTime(t)` 定格，
  CSS 动画用 `document.getAnimations()` 逐个设置 `currentTime`。
- 周期 `periodMs` 取所有旋转动画中最长的 `dur`；解析不到时取 2000 ms。
- 取样时刻 `t_k = k × periodMs / 8`，k = 0…7。
- 每帧用 `getScreenCTM()` 记录车轮、曲柄、腿部元素的跟踪点，产出 G4、G5 与 C1–C4 的渲染分。
  元素识别沿用静态解析的结果：被 rotate 驱动且含圆的分组视为车轮或曲柄，其余被驱动分组视为腿
  （命名为腿的优先，否则取周期与曲柄成整数比的）。
- 脚与脚踏：把腿与曲柄子树的几何沿路径采样到根坐标；曲柄伸出长度 R 取五通到最远采样点
  （不超过车轮半径），脚踏区是最外 30%。首帧取离脚尖最近的脚踏点与曲柄变换矩阵，之后各帧把
  这个点按曲柄的刚体运动搬过去，量它到腿下半段最近采样点的距离；距离相对首帧的最大变化
  ≤ 0.35 R 满分、≥ 0.8 R 零分。脚画成独立形状时这段距离是恒定偏移，脚绕脚踝转也不影响；
  腿只绕髋摆动时脚踏点会在半个周期里离开腿。只看至少一帧碰到脚踏的候选腿（云朵、翅膀等同周期
  元素碰不到），取最稳的两条腿平均。
- 引入 playwright-core 须先立 ACR。Chromium 二进制由 Playwright 运行时下载，不入仓库；
  runner 镜像若打入 Chromium，仅供自用，不对外发布。

### 3.3 联系图

帧序联系表一张，细节联系表每类一张；所有表同帧号、同取样时刻，评审记录的 `contactSheet`
就是给 AI 层的图件清单（帧序表文件、各细节表的类别、文件、取景框、放大倍数与服务的标准）。

- 帧序表：一行 8 帧整幅画面，不分行；帧序即取样序，每帧左上角标 `1`–`8`。
- 细节表：每帧只把 viewBox 换成同一个取景框再截图（动画定格不变），左上角标
  `帧号 · 部位 ×倍数`。类别与取景框：

  | kind | 部位 | 取景框 | 服务标准 |
  |---|---|---|---|
  | `pelican` | 鹈鹕整体 | 骑手包围盒外扩 15%；骑手 = 轮顶线以上、排除车轮曲柄与背景大矩形的几何并集 | C6 C7 C8 C9 |
  | `head` | 头与喙 | 骑手包围盒上部 40% | C6 |
  | `crank` | 脚踏与脚 | 以五通为中心，边长 4 R | C2 C4 C7 |
  | `saddle` | 座垫与臀 | 以腿髋关节均值为中心（无腿时五通上方一个轮半径） | C7 |
  | `handlebar` | 翅与车把 | 代码层量不到车把，只在裁判定位给了框时出表 | C5 C9 |
  | `wheel-left` / `wheel-right` | 左轮 / 右轮 | 以轮心为中心，边长 2.6 倍半径 | C1 |

  量不到对应部件的类别不出表；取景框不小于画面短边的 1/5。
- 定位（ACR-021）：AI 层打分前，裁判先看首帧整幅画面（640px）给鹈鹕整体、头与喙、座垫与臀、脚踏与脚、翅与车把
  的像素框，程序经根元素屏幕矩阵换算到 viewBox、外扩 15% 造正方形框后重切这几类细节表，记录里标
  `locatedBy: ai`；车轮仍用代码层量的圆心。裁判没给或给不出的类别沿用几何推断的表。
- 单帧 320 × 320，viewBox 等比缩放居中；帧与帧之间留 16 px 中性灰间隔，读图者能分清每帧范围。
- 在 Chromium 内以 HTML 拼好后整体截图，不引入图像处理库。
- 落盘为 `data/runs/<runId>/<attemptKey>.sheet.png` 与 `<attemptKey>.sheet.<kind>.png`，
  看板经 `/sheet/<runId>/<file>` 读取；取样时刻写进 `contactSheet.sampleTimesMs`。

## 4. AI 层

### 4.1 运行方式

- 不在调用道内同步执行。轮次记录定稿后在同一进程里串行评审本轮作品（`src/core/judge/ai-round.ts`），
  被停止的轮次不评；历史作品不补评，`pnpm judge:backfill -- --ai-only` 仅在人工明确要求时按轮运行。
- 只评通过全部闸门、仍为「待复核」且有联系表的作品；已判「降智」的作品不再消耗配额。
- 裁判来自配置 `judge.ai.judges`，按顺序取第一个厂商与被评作品不同的，写入 `judges[].id`
  为 `cli/model@effort`；没有厂商不同的裁判就不评。
- 裁判调用走适配器的「评审模式」（`AgentRequest.review`）：临时目录内只放 `contactSheet` 清单里的
  联系图，允许读取这些图，不给写盘与执行命令。此模式与考生的「空目录、无工具」约束分开实现，互不影响。
- 输出限定为 JSON；解析失败重试一次，仍失败则该作品保持 `pending`；两次问答的转录存
  `<attemptKey>.judge-ai.txt`，记录里 `judges[].rawFile` 指向它。
- 成本：全部问答的 token 用量从转录解析，记在 `judges[]` 的 AI 条目（`usage`、`asks`）；
  成本与作品同口径，按价格目录在读取时折算，看板卡片、作品页与评审抽屉显示。

### 4.2 提示词结构

三轮对话，先盲、再定位、后判：

1. 盲描述：只给帧序联系表，不提题目，要求用一两句话描述画面主体与动作。
   回答原样存入 `blindDescription`。
2. 定位：给首帧整幅画面，要五类部位的像素框（见 3.3），程序据此重切细节表。
3. 逐项判定：给出题目原文、C5–C9 的 `standard` 与 `maxScore`，
   要求对每项返回 `score` 与一句话 `reason`，`reason` 必须引用帧号或画面细节。

C6 的分由代码核对 `blindDescription` 与判定结果共同决定：盲描述未提到鹈鹕或长喙鸟类时，
C6 上限降为一半。

### 4.3 校准

- 先人工标注本地 44 幅作品的「在线 / 降智」，作为阈值与权重的校准集。
- 同一裁判对同一作品评两次，记录分差；分差中位数超过 10 分时收紧提示词。
- 裁判换模型或提示词升版本，旧记录保留，新记录另起 `promptVersion`。

## 5. 记录与读取

- 每幅作品一份 `data/runs/<runId>/<attemptKey>.judge.json`，写法与 run.json 相同：
  先写临时文件再原子替换。
- 代码层写入完整文件，AI 标准 `score` 与 `reason` 置 `null`，`verdict = pending`
  （闸门失败时直接 `degraded`）。AI 层只填 C5–C9、`blindDescription`、追加一条 judge，
  并重算 `total`。
- 看板按 `verdict` 显示标签：`online` → 智商在线，`degraded` → 降智，`pending` → 待复核；
  展开可看每条标准的分与理由。
- 同步到数据仓时评审记录与联系图一并脱敏导出；契约改动同步 `schemas/` 与 validator。

记录示例（节选）：

```json
{
  "schemaVersion": 1,
  "subject": { "runId": "20260926T151036Z", "attemptKey": "codex__gpt-6-astra__high__animated-pelican-v1",
               "promptId": "animated-pelican-v1", "cli": "codex", "model": "gpt-6-astra",
               "effort": "high", "svgFile": "20260926T151036Z/codex__gpt-6-astra__high__animated-pelican-v1.svg" },
  "rubric": { "id": "animated-pelican-v1", "version": 1, "passThreshold": 60 },
  "judges": [ { "kind": "code", "id": "static-judge@1", "judgedAt": "2026-09-30T08:00:00Z" } ],
  "gates": [ { "id": "G1", "source": "static", "title": "XML 合法", "standard": "解析零错误",
               "passed": true, "evidence": "jsdom 解析无错误" } ],
  "criteria": [
    { "id": "C1", "source": "static", "title": "车轮绕轴心旋转", "maxScore": 20, "score": 20,
      "standard": "旋转中心与轮子圆心一致", "reason": "前后轮 rotate 中心与 circle 圆心距离均为 0" },
    { "id": "C6", "source": "ai", "title": "主体是鹈鹕", "maxScore": 10, "score": null,
      "standard": "盲描述能认出鹈鹕", "reason": null }
  ],
  "total": { "score": 55, "maxScore": 100, "verdict": "pending", "judgedAt": "2026-09-30T08:00:00Z" }
}
```

## 6. 许可证与净室

项目对外许可证为 MIT。方案不引入任何 copyleft 依赖：

| 依赖 | 许可证 | 结论 |
|---|---|---|
| jsdom | MIT | 已在用 |
| playwright-core | Apache-2.0 | 兼容，再分发时保留 NOTICE |
| @resvg/resvg-js | MPL-2.0 | 不用 |
| sharp | Apache-2.0，捆绑 LGPL-3.0 的 libvips | 不用，联系图在 Chromium 内拼接 |

参考来源只借思路，按净室流程实施：

1. 本文档即规格：第 2–4 节用自然语言写清标准、阈值与流程，不含任何来源代码或原文。
2. 实现者在全新上下文中只读本文档与仓库代码，不接触参考来源的仓库、论文或博客。
3. 参考来源登记进 `.ip-compliance/ingress-ledger.jsonl`，标注「仅借思路，未复制」：
   OpenEnv `pelican_svg_env`（BSD-3-Clause，三层打分与闸门思路）、
   LiveSVG（CC BY 4.0，逐帧取样与评审维度）、Simon Willison 博客（两两对比做法，未采用）。
4. 实现完成后跑片段溯源比对，比对干净再合并。

## 7. 依赖与实施顺序

| 步骤 | 内容 | 新依赖 | 配额 |
|---|---|---|---|
| 1 | 静态解析打分器，回填本地 44 幅，人工核对分布 | 无 | 无 |
| 2 | 评审记录落盘、看板标签与逐项展开 | 无 | 无 |
| 3 | ACR：引入 playwright-core；渲染量测与联系图 | playwright-core | 无 |
| 4 | ACR-020：评审模式适配、轮后串行评审、AI 层提示词与校准 | 无 | 每幅两次裁判问答 |
| 5 | 数据仓契约与 validator 同步 | 无 | 无 |

步骤 1 完成后即可给出「降智」的硬判定；「智商在线」的最终判定在步骤 4 之后才有。

## 8. 未决问题

- 44 幅校准集上 60 分阈值是否合适，需人工标注后再定。
- 腿部元素的识别只靠「被驱动且不含圆」的启发式，命名随意的作品会漏判，需看误判率。
- 评审输出能否随数据仓公开发布，需按各家服务条款确认。
