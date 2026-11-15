# 2026-11 前沿模型与纯内联 SVG 盲测题检索报告

检索窗口：2026-11-01 至 2026-11-14，并收入 10 月底直接延续进 11 月的发布与实测。
报告日期：2026-11-14。
检索轮次：`web_search` 98 轮（其中 1 轮传输失败），`web_fetch` 10 轮。10 轮抓取全部被 SSRF 拦截，没有打开官网、X、arXiv、GitHub、HN 或 Reddit 原文。

## 结论

Claude Fable 5.2 与 Claude Mythos 5.2 已于 2026-11-09 由 Anthropic 正式发布。公开 API 代号是 `claude-fable-5-2`。社区里的「Fable 5.5」没有对应的已发布模型。

Google 的对应型号官方名称是 Gemini 4 Carbon，不是单独的「Gemini carbon」产品线。2026-10-28 通过 Fairwind 向部分网络安全防御方预览，2026-11-10 对付费开发者与 Google AI Ultra 一般可用。API 代号是 `gemini-4-carbon`。

11 月 X 上传播最广的实测是长程代码游戏、Three.js / WebGL 与「一句话出整部片子」，不是纯内联 SVG。鹈鹕车仍被两边拿来做探针，但本库已收录，不进入候选。下面 8 道候选来自可核验题面，并改写成 0 `<script>` 的闭环动画。互动数字全部是检索索引快照，不是打开原帖后的现场计数。

## 证据边界

未能用 `web_fetch` 打开的域名包括 `anthropic.com`、`blog.google`、`simonwillison.net`、`arxiv.org`、`productwithattitude.com`、`github.com`、`r.jina.ai`。这些域名被解析到 `198.18.0.0/15`，工具直接拦截。因此：

- 规格、分数、帖文与赞数来自 `web_search` 索引对上述页面的摘录，不是本会话打开原文后的抄录。
- 同一 status ID 在不同快照里被描述成不同帖文时，报告并列两个 ID，不选一个假装已消解。
- 没有摘录到的能力、没有同时出现在两处以上的分数，不写入「已核实」。
- 厂商自报基准与独立复现分开写。

# 第一部分：2026 年 11 月 Claude Fable 5.2

## 发布、代号与版本状态

| 项 | 已核实内容 | 来源（索引，原文未打开） |
|---|---|---|
| 发布日 | 2026-11-09 | https://www.anthropic.com/claude-fable-and-mythos-5-2 |
| 公开型号 | Claude Fable 5.2 | 同上；MacRumors 同日转述 |
| 受限孪生 | Claude Mythos 5.2，同一套权重，安全分类器更松，只给 Cyber / Life Sciences 核验组织 | 同上 |
| API ID | `claude-fable-5-2`；fast 模式 `claude-fable-5-2-fast` | https://platform.claude.com/docs/en/models/fable-5-2/overview.md |
| 不存在的代号 | `claude-fable-5-5` / Fable 5.5 没有模型页、定价或发布。9–10 月传言指向的就是这次 5.2 | https://fable5.app/fable-5-2/ |
| 上下文 / 输出 | 1M / 128K | 平台文档索引 |
| 输入 / 输出 | 文本与图像进，文本出。无原生图像生成 | 平台文档；@d_gundyrev 索引转述 |
| 知识截止 | 2026-06 | 平台文档 |
| 思考 | Adaptive thinking 常开，API 默认 effort `high`。`temperature` / `top_p` / `top_k` 会报错 | 平台文档 |
| 价格 | $8 / $40 per MTok；fast $16 / $80，最高约 2.5 倍输出速度。比 Fable 5.1 低 20% | 公告索引与平台文档 |
| 速度 | 公告称输出最多比 5.1 快 30% | 公告索引 |
| 系统卡 | 264 页，覆盖 Fable 5.2 与 Mythos 5.2 | https://assets.claude.com/27d60918d218125e7504bc7354c4b4626ec56b11.pdf |
| 分发 | Claude 应用、API、Bedrock、Google Cloud、Microsoft Foundry、GitHub Copilot。Claude Code 需要 2.1.321+ | AWS what's-new 2026-11 索引 |

Anthropic 的使用建议是：日常工作从 Opus 5.5 开始，Fable 5.2 留给最难、最长、最开放的技术任务。

HN 主帖 https://news.ycombinator.com/item?id=50429068 索引为 919 points、1053 comments。帖子提交时刻未能打开核对；公告日本身是 2026-11-09。

## 已核实新能力

分数除另注外是 Anthropic 自报，effort 多为最高档，Fable 侧包含安全分类器。独立复现到 2026-11-14 仍不完整。

### 代码与长程代理（agent）

- FrontierCode 2.0：49.1%（Xhigh）。FrontierSWE v2：69.9%。SWE-bench Pro：93.0%（发布材料）。Remote Labor Index：41.3%（high），对照 Opus 5.5 的 21.3% 来自社区转述，不是本会话打开的 Scale 表。
- Artificial Analysis Intelligence Index v5：发布后索引为 65，高于当时 Gemini 4 Carbon high 的 60。这是第三方榜，不是 Anthropic 正文。
- Snorkel 2026-11-12，26 道前沿编码任务：pass@1 从 5.1 的 53.1% 到 5.2 的 71.4%。中途工具失败几乎消失。来源：https://snorkel.ai/blog/fable-5-2-vs-fable-5-1-coding-benchmark/
- 长程演示（厂商或员工自述，不是盲测）：Felix Rieseberg 的 Saltline 约 8 小时无人值守；公告提到可协调大量子代理。这些证明「能跑很长」，不证明一次就对。

### 视觉、空间与前端

- Chartography 无工具 73.4%（5.1 为 44.8%，Opus 5.5 为 64.4%）。BenchCAD 2.1 无工具 75.4%、带工具 83.5%。OSWorld 2.1 离线部分分 89.3%、严格通过 54.6%。SWE-bench Multimodal 74.1%。RoboDojo Sim 64.9%（5.1 为 27.6%）。
- 这些是「看图再建」或「看屏幕操作」，不是「盲写 SVG 然后自己看见播放」。
- Karo Zieminski 2026-11-09 的 7 张设计板用纯 SVG / HTML / CSS：网格、圆弧字母、图标、挤压拉伸、间距图、动态字、条形图。算术项（每百分点 7px、自由落体间距递增）一次就算对。来源：https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts
- r/ClaudeAI 有用户称 5.2 画矢量明显好于 5.1。这是定性评论，没有公开分数。

### SVG 与动画

- Simon Willison 2026-11-09 用五个 effort 跑「鹈鹕骑自行车」SVG。xhigh 最好。max 把 128K 输出额度花在思考上，没有吐出 SVG。Fable 5 与 5.1 的 max 曾经能出图。来源：https://simonwillison.net/2026/Nov/9/llm-anthropic/
- 模型可以写 SMIL、CSS `@keyframes` 和带脚本的动画。它不能观看播放。Zieminski 的补救是要求间距图（spacing chart），把时间变成可量的几何。

## 已知翻车点与社区评价

- max / 高 effort 过思考（overthinking）：Reddit r/ClaudeAI `1xs0dct` 与 Willison 的空 SVG 一致。更高档位不保证更好，有时更差、更贵。
- 盲设计（designs blind）：坐标在看见渲染之前就写死。标签压线、光学重量不均，要等截图回传。发布说明里的视觉提升主要改善这条反馈环，不取消第一遍的盲写。
- Snorkel：剩下的失败集中在错误策略（约 35%）、错误推断（约 28%）、读错任务（约 23%）。有两道 5.1 能稳定通过的题，5.2 每次都错，而且错得稳定。
- 社区成本抱怨：有测试者称同样的 SVG 任务 token 远高于 Opus 5.5。20% 的单价降幅盖不住用量上升。
- 安全分类器会把部分请求改路由到 Opus。系统卡索引提到多轮追踪类回答率相对 5.1 回落（61% 对 73%）。这是安全行为，不是视觉能力。
- 黑洞物理：公告称解了两个全息对偶（holographic duality）开题，预印本在 Hexagon。到 2026-11-14，检索没有看到外部同行的完整复核。只记为厂商声明，不记为已核实能力。
- HN 高赞意见：普通编码和 Opus 5.5 难分；差距出现在把野心推高的时候。

# 第二部分：2026 年 11 月 Google Gemini 4 Carbon

## 发布、代号与版本状态

「Gemini carbon」「Google Gemini carbon」在 11 月检索里对应的正式名是 **Gemini 4 Carbon**。

| 项 | 已核实内容 | 来源（索引，原文未打开） |
|---|---|---|
| 宣布 | 2026-10-28，Fairwind 计划内的防御方预览 | https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/ |
| 一般可用 | 2026-11-10。付费 Gemini API、AI Studio、Gemini for business；Ultra 用户的 Gemini app、Search AI Mode、Antigravity | https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/ |
| API ID | `gemini-4-carbon` | 转述 Google 文档的索引 |
| 模型卡 | 2026-11-10 发布 | https://deepmind.google/models/model-cards/gemini-4-carbon/ |
| 上下文 | 约 1,048,576，输入、思考、输出共用 | GA 博文索引 |
| 模态 | 文本、图像、音频、视频、PDF 进；文本出 | 模型卡索引 |
| 知识截止 | 2026-03 | 模型卡索引 |
| 价格 | 2026-11-30 前 $2 / $10 per MTok；2026-12-01 起 $4 / $20。缓存输入约 95% 折扣 | GA 博文索引 |
| 定位 | 比 Argon 更慢、更耗 token，面向多日代理与高难任务。日常工程仍建议 Argon | 公告与模型卡 |

HN：宣布帖 https://news.ycombinator.com/item?id=50276792 索引 1019 points、803 comments；可用帖 https://news.ycombinator.com/item?id=50442303 索引 295 points、165 comments。讨论焦点是入口碎片化，不是某一道 SVG。

r/LocalLLaMA 与 r/MachineLearning 在本窗口没有匹配帖。r/Bard、r/GeminiAI、r/singularity 有发布与配额讨论。

## 已核实新能力

### 多模态与空间

- Chartography 无工具 72.5%（2026-11-13 BenchLM 快照，第 2，低于 Fable 5.2 的 73.4%）。Blueprint-Bench 2：58.6%（2026-11-12 快照，第 1，Fable 5.2 为 56.6%）。这两条是聚合站快照，不是本会话打开的榜页。
- WebDev Arena：约 1768 Elo，发布当周大约第 4，落后 Fable 5.2 / Opus 5.5 / Sonnet 5.5 一档。
- 模型卡网络安全分（2026-10，无护栏设定，只对 Fairwind 的专门能力）：SEC-bench Pro 88.2%，ExploitGym 54.8%，CWE-bench 71.0%。GraphWalks 256K–1M 的 BFS F1 96.2%。
- Gray Swan 间接提示注入：厂商报 0.0%（k=15）。Google 自己写了这只覆盖该评测集。
- AA-Omniscience：high 档净分 54、幻觉率 11%，Argon 为 4%。11% 是「非正确答案里猜错的比例」，不是总错误率。Carbon 答得更多，所以幻觉率上升、净分仍更高。
- 厂商演示（不是社区盲测）：Pelican Quest（鹈鹕骑 GBike 的 Three.js 游戏）、埃菲尔铁塔施工三维、Platform 37 的 206 张工程图重建、针织纤维 110 根追踪、1780 年钢琴击弦机。这些用了 `/swarm`、Blender 和多小时循环。

### SVG、前端与机构

- Simon Willison 2026-11-10：https://x.com/simonw/status/2120259652093112614 ，「The Gemini 4 Carbon pelican is still pretty cute」。他同时用 Carbon 做了 Yonkers 机甲踩纽约的 Three.js，并和 Fable 5.2 medium 对照。两边都跑通。Carbon 的空间映射被评论者单列；Fable 的镜头与踩踏循环更完整。来源索引：https://simonwillison.net/2026/Nov/10/llm-gemini/
- @kimmonismus 2026-11-10：https://x.com/kimmonismus/status/2120186125591646250 。ORRERY：一个控件驱动齿轮和折叠花瓣，正转反转都工作。索引 719 likes。原始 13 条 brief 的全文没有被索引完整摘出。
- @thebuggeddev 2026-11-10 的「Analyse Spectrale」：单张参考图做出 92 个零件的巴黎物理柜，UI 里有 60 FPS 的 SVG 瓦特指示器。索引约 372–378 likes。status ID 见下方冲突说明。
- r/google_antigravity 有人报告 Carbon 在 Go / HTMX / Tailwind 流水线上一次落地、审计改动很少。r/TopologyAI 报告 Blender 绑定优于 Argon，但耗时从十几分钟到数小时。

### 与 Fable 5.2 的独立对照

AI Fire 2026-11-12 的非官方三测（索引，原文未打开）：

- 帆船水面：Fable 的水和材质更完整；Carbon 更风格化，纹理重复。
- 公寓平面重建：Carbon 的房间连通最接近参考，但两扇门的开启方向错了，走廊几何在真实建筑里不成立。
- 英雄射击原型：Fable 更可玩；Carbon 有滑步，且没有完全可玩。

这些是单人评测，不是排行榜。

## 已知翻车点与社区评价

- 模型卡写明：幻觉、偶发变慢与超时、高思考档消耗更多 token。知识截止 2026-03，早于 Fable 的 2026-06。
- 独立引用测试（TrueStandard，2026-11-12，低思考、关搜索）：编造引用 ID 的比例与 Argon 没有统计显著差异。Google「幻觉大约减半」的内部说法，在这个小样本上没有被证实。
- r/GeminiAI 有人在明显事实上抓到幻觉，并因速度放弃。这是单用户报告。
- 空间错误仍在：门的开向、走廊连通。Blueprint-Bench 领先不等于生成场景的门轴正确。
- 专用 SVG 榜（Design Arena、Pokémon SVG Bench、AgentKernel，11 月上旬快照）前列经常是 GPT-6 Astra、Gemini 4 Argon、Qwen3.8 Max。Carbon 与 Fable 5.2 在这些 SVG 专项榜上没有被索引到稳定的公开名次。不能把 WebDev Arena 或 Intelligence Index 写成 SVG 专项胜利。
- 访问碎片化是 HN 与 r/Bard 的主抱怨：Ultra、Pro、Workspace、国家与 Antigravity 配额不一致。

# 第三部分：2026 年 11 月热议测试题

## 综合爆款

互动数均为索引快照。打不开的帖不补写浏览量。

| 题目 | 出处 | 日期 | 热度快照 | 题面与表现 | 入库 |
|---|---|---|---|---|---|
| Saltline 港口 FPS | @felixrieseberg https://x.com/felixrieseberg/status/2119925633564463609 | 2026-11-09 22:50 UTC | 约 14.5k–14.7k likes | 一句提示、约 8 小时、约 $550、2.7M 输出 token。雨、集装箱、程序化模型与声音，单文件 HTML。传播最高的 Fable 5.2 作品之一 | 否。依赖脚本与三维，且不是矢量闭环 |
| Starry Nightrider | @ebbyamir https://x.com/ebbyamir/status/2120284261089673376 | 2026-11-10 22:35 UTC | 索引约 17.6k likes；早期聚合站曾写约 5.6k，以后者为爬取时点差异 | 骑车穿过《星夜》。可玩，Three.js | 否。主体是真实历史人物梵高，一票否决 |
| 鹈鹕车 SVG | @simonw 2026-11-09 Fable；2026-11-10 Carbon https://x.com/simonw/status/2120259652093112614 | 11-09 / 11-10 | Carbon 帖的赞数未被索引到数字 | Fable xhigh 最好，max 空输出。Carbon 三个思考档都「仍然可爱」。r/singularity `1xsuixt`：Fable low 更干净，Opus 5.5 med 更满但翅膀和喙错位 | 否。本库已有经典 / 升级 / 动态鹈鹕车 |
| Pelican Quest | @vamsibatchuk https://x.com/vamsibatchuk/status/2120191944643190808 ；Google 演示 | 2026-11-10 | 136 likes | 厂商 `/swarm` 把鹈鹕探针做成校园三维游戏 | 否。厂商演示，且是鹈鹕骑行 |
| 76 个单文件 HTML | @MiaAI_lab https://x.com/MiaAI_lab/status/2119930229661503893 | 2026-11-09 23:08 UTC | 2,615 likes | 一条总提示生成 100 个独立 HTML，用量上限停在 76，索引称 0 个打不开。后续帖写约 2.489 亿 token、约 $512。仓库 https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files | 总帖本身不是一道题。其中 4 个文件被拆成下面的候选 |
| ORRERY | @kimmonismus https://x.com/kimmonismus/status/2120186125591646250 | 2026-11-10 16:05 UTC | 719 likes，29 reposts，49 replies | 一个控件驱动齿轮与折叠花瓣，反转也不卡。跟帖改了机位。@alsamahi 的转述帖 https://x.com/alsamahi/status/2120442135862554731 索引 0 likes，不当作独立热度 | 是。见候选 5。原文 brief 未完整公开 |
| Analyse Spectrale / 瓦特指示器 | @thebuggeddev | 2026-11-10 | 约 372–378 likes，25–26 reposts | 单图生成物理柜，含 60 FPS SVG 瓦特指示器。Sundar Pichai 回复被索引到 | 机构部分见候选 6。status 冲突见下 |
| 北极光单文件 | @MichaelGannotti https://x.com/MichaelGannotti/status/2119922137011982652 | 2026-11-09 | 赞数未被本次索引给出 | 一句「最美的单个 HTML」。约 12.6 分钟、58k 思考 token。Canvas + WebGL，坐标写着特罗姆瑟 | 否。无闭合几何真值，且主路径不是 SVG |
| Yonkers 机甲 | Willison 2026-11-10 博文，对照 Fable 5.2 与 Carbon | 2026-11-10 | 博文，不是单条已核赞数 | 错字提示仍跑通 OSM 上的机甲行走。Fable 补了踩踏与高度读数；Carbon 被称映射了分区 | 否。依赖地图数据与脚本 |
| MotionGraphicsBench | arXiv:2611.10592，2026-11-07 | 2026-11-07 | 论文，不是推文 | 100 道「给静态 SVG 加运动」。pass@1 6.0%–67.7%。索引写最高是 GPT-6 Astra 67.72%，Fable 5.1 为 66.34%。Fable 5.2 与 Carbon 没有被索引到这篇的分数 | 否。任务是编辑已有 SVG，且 5.2 发布在论文之后 |
| 等轴测动起来 | @BreejeAnadkat | 2026-11-10 | 索引 24 或 45 likes，自相矛盾 | Figma 先画，再让 Fable 5.2 加运动。作者自己称为 cheating，因为几何不是模型建的 | 否。原题依赖外部设计文件；status 未消解 |
| Glassy Jenga | @AI_Andrew https://x.com/AI_Andrew/status/2120243379388760176 | 2026-11-10 19:53 UTC | 52–53 likes | 染色玻璃积木、敲击发声、倒塌飞溅。Google 回复 | 否。三维折射与音频，热度低，且飞溅没有唯一几何真值 |
| 针织力学 | @Google https://x.com/Google/status/2120279087314837642 | 2026-11-10 22:15 UTC | 1,067 likes | 厂商从论文做出 110 根纤维的应力可视化 | 否。厂商演示，依赖论文与三维 |
| Kevin Ngo 的 JS 画 | @kevin_t_ngo https://x.com/kevin_t_ngo/status/2120722200001122321 与提示帖 https://x.com/kevin_t_ngo/status/2121303379196662115 | 2026-11-12 / 11-13 | 画作约 2,638–2,649 likes；提示帖约 563 likes | 明确要求不像 SVG、不要画人、用 JavaScript | 否。与本库技术合同相反 |
| World Clock 62 面 | https://github.com/christopherrbrown3/world-clock | 快照日 2026-11-10 | 仓库，不是推文热度 | Fable 5.2 与 Carbon 各交一份 62 面表。含品牌表款 | 否。商标，且与 10 月钟面角度题重叠 |
| RADIAL NINE | @olezhavich，2026-10-31 | 2026-10-31 | 索引 334 likes。主帖 status ID 未确认 | 四模型同题画九缸星形发动机。索引称发火顺序都对，Carbon 画面最干净，Opus 5.5 多画了管路 | 是。见候选 7。窗口按「10 月底延续」收入 |

### 未消解的帖号

- @thebuggeddev：索引同时给出 https://x.com/thebuggeddev/status/2120201759305998343 与 https://x.com/thebuggeddev/status/2120501054991216839 。日期都写 2026-11-10。未能打开页面判断哪条是主帖、哪条是致谢。
- @BreejeAnadkat status `2120115744168091921`：一个快照说这是等轴测正文，另一个快照说这是 “Thanks bro”。不采用该 ID 作为唯一原文。
- @olezhavich 的 RADIAL NINE 主帖 ID 没有被索引确认。同线程回复 https://x.com/danieldwalton/status/2116649144928641535 与 https://x.com/danieldwalton/status/2116649200339599487 的时间是 2026-10-31 21:50 UTC。题面摘录挂在这组回复的索引上。

### 明确不入库

真人与历史人物、品牌表款、已收录鹈鹕车、已收录的 2026-09 等轴测硬件与动物骑行、已收录的 2026-10 简森连杆、跳蛛、蜈蚣、差速器、摩天轮、章鱼管风琴、孔雀骑车、鹦鹉螺。日内瓦驱动（Geneva drive）的 ForgeCAD 帖约 32 likes，是求解器演示，不是模型盲测，不入库。

## 八道纯内联动态 SVG 候选

共同技术合同：只允许 SMIL `<animate>` / `<animateTransform>` 或 `<style>` 里的 CSS `@keyframes`。0 `<script>`，0 事件属性，0 外链，0 字体文件，0 商标，0 真人。若使用 `<style>`，用 CDATA 包裹。首尾帧像素 MAE ≡ 0。周期内最大帧差 max MAE ≥ 0.015。静止图直接 Fail。

下面的提示词是按出处题面改写的考场合同，不是把原帖全文伪造成已打开。

### 1. 十五摆归相

- 中文名：十五摆波，六十秒尺度压缩后的精确归相
- English: Pendulum Wave, Exact Reunion
- ID: `animated-pendulum-wave-reunion-v1`

出处：@MiaAI_lab，2026-11-09 23:08 UTC，https://x.com/MiaAI_lab/status/2119930229661503893 ，索引 2,615 likes。单件提示文件索引为 `037-pendulum-wave.txt`，原始演示是 Canvas，要求 15 摆在 60 秒精确重新同相。X 上没有检索到单独以 “pendulum wave” 为标题的 11 月热帖。热度属于总实验，不属于这一件。

社区焦点：这件被用来证明 Fable 5.2 能写闭合公式物理，而不是每帧积分。原作有声音、拖动和视角切换，那些都不能进本库。翻车点若照搬 60 秒 SMIL，采样太稀，归相会被缓动毁掉。

考点：多个可公度周期（commensurate periods）在同一时刻回到同一姿态。不是擒纵，不是步态，不是鹦鹉螺生长螺线。

```text
Generate one self-contained animated SVG of a pendulum wave. No text, no brand, no audio, no script.

Technical contract: SMIL or inline CSS only. 0 <script>. viewBox="0 0 900 360". Any <style> goes in CDATA. Well-formed XML.

Nine pendulums, index i = 0..8, pivots at x = 90 + i * 90, y = 70. Each rod length may differ, but the swing angle is the scored quantity. Released together from +16 degrees.

Closed loop T = 6s. Pendulum i completes exactly n_i = 4 + i full oscillations in 6s. Angle in degrees, clockwise positive, zero is straight down:

theta_i(t) = 16 * cos(2 * pi * n_i * t / 6)

Sample this formula at t = 0, 0.25, 0.5, ..., 6.0. At the sample instants the rendered angle must match the formula within 1.5 degrees. Between samples use the formula, not a sine keyword and not an ease-in-out that changes the zeros.

At t = 0 and t = 6 every pendulum is at +16 degrees and the pixels match. At t = 3, pendulums with odd n_i are at -16 degrees and pendulums with even n_i are at +16 degrees. Rods are separate groups so each angle can be measured. Bobs do not pass through the support bar.

Output only the <svg>.
```

判读：

- Pass：9 摆；t=0 与 t=6 的 MAE ≡ 0；抽样角误差 ≤ 1.5°；t=3 的奇偶反相成立；周期内 max MAE ≥ 0.015；0 script。
- Partial：有疏密波，但归相时刻不是 6 秒，或 t=3 的奇偶反相错。
- Fail：所有摆同一周期；用缓动毁掉零点；含 script；静止。

### 2. 同心环莫尔漂移

- 中文名：同心环慢干涉
- English: Concentric-Ring Moiré Drift
- ID: `animated-moire-ring-drift-v1`

出处：同一条 @MiaAI_lab 帖。文件索引为 `010-op-art-pulse.txt`。原题是六间房的 CSS 欧普，其中第一间用两层同心环和 difference 混合产生双曲线条纹。原作有滚动和按压，考场只留可测的那一层。

考点：两套周期图案的相对相位产生拍频（beat），不是物体沿路径移动。与 10 月齿轮相位锁不同：这里没有齿数，条纹间距必须随相对转角变。

```text
Generate one self-contained animated SVG of a moiré interference disk. Black and white only. No text, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>.

Two groups, each 48 concentric circles, center (320,320), radii 12, 20, 28, ... px (8 px pitch), stroke 1.5, no fill. Group A is fixed. Group B rotates about (320,320).

Loop T = 8s, angles linear in each half:
t = 0 and t = 8: group B rotation = 0 degrees, pixels match.
t = 4: group B rotation = +8 degrees exactly.
The return half is the same motion reversed. Do not rotate group A. Do not fade the strokes in and out. The only moving parameter is group B's angle.

The moiré must stay visible as hyperbolic light and dark bands. Optional feBlend mode="difference" is allowed. It must not be required for the angle test: group B remains a measurable transform.

Output only the <svg>.
```

判读：

- Pass：48 环、8 px 间距、t=4 为 +8°、t=8 与 t=0 的 MAE ≡ 0、max MAE ≥ 0.015、0 script。
- Partial：有莫尔，但峰值角不是 8°，或两层都在转导致相对角不可测。
- Fail：只是一个旋转的圆；用透明度假装干涉；含 script；静止。

### 3. 铁屑指向移动磁极

- 中文名：铁屑跟随单磁极
- English: Iron Filings Pointing at a Moving Pole
- ID: `animated-iron-filings-align-v1`

出处：同一条 @MiaAI_lab 帖。文件索引为 `013-iron-filings.txt`。原作是可拖拽磁铁的 Canvas 桌面玩具。X 上没有检索到单独的 “iron filings” + Fable 5.2 热帖。

考点：每个线段的朝向是位置的函数，磁极一动，全体朝向一起变。这不是步态，也不是流体平流。为了能判，合同使用单磁极教学模型：线段长轴指向磁极中心。完整偶极子公式留到以后的加分题，避免用不可见的场线做主观分。

```text
Generate one self-contained animated SVG of iron filings on a sheet, with one round magnet moving underneath. No text, no script, no hands.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 400". CDATA around any <style>.

24 filings, a 6 by 4 grid, centers at x = 80 + c * 96, y = 70 + r * 80, c = 0..5, r = 0..3. Each filing is a 28 px line in its own group, pivoted at its center.

The magnet center moves on
x(t) = 320 + 160 * sin(2 * pi * t / 8)
y(t) = 200
with T = 8s. At t = 0 and t = 8 the magnet is at (320,200) and every pixel matches.

At every instant each filing's angle is
atan2(y_magnet - y_filing, x_magnet - x_filing)
measured from the +x axis. Tolerance at t = 0, 2, 4, 6, 8 is 2 degrees. Filings do not translate. Only the magnet translates, and only the filings rotate.

Output only the <svg>.
```

判读：

- Pass：24 条不平移；五个抽样时刻角度误差 ≤ 2°；t=8 与 t=0 的 MAE ≡ 0；max MAE ≥ 0.015；0 script。
- Partial：磁铁在动，但铁屑转角与磁铁脱节，或只有靠近的几条在转。
- Fail：铁屑随磁铁平移；随机抖动；含 script；静止。

### 4. 金星五瓣相对轨道

- 中文名：金星五瓣舞，精确 13:8
- English: Venus Five-Petal Relative Orbit
- ID: `animated-venus-rose-trace-v1`

出处：同一条 @MiaAI_lab 帖。文件索引为 `042-dance-of-venus.txt`。原题用真实轨道数据画地心相对路径，五瓣玫瑰。检索没有找到独立的高赞推文。

考点：13:8 共振的五次合（five inferior conjunctions），不是对数螺线生长。鹦鹉螺题考的是半径随角度指数增长；本题半径振荡，并且在 8 个「年」后闭合。

```text
Generate one self-contained animated SVG of the geocentric relative orbit of Venus under an exact 13:8 period ratio. No labels, no planets as illustrations, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>.

Earth is fixed at (320,320). Use circular coplanar orbits and an exact ratio, so the curve closes:
E(t) = (cos(2*pi*t/16), sin(2*pi*t/16))
V(t) = 0.723 * (cos(13*2*pi*t/16), sin(13*2*pi*t/16))
R(t) = V(t) - E(t)
Screen point = (320,320) + 150 * R(t)
t runs from 0 to 16 seconds, standing for 8 years.

A pen of radius 3 follows that point. A polyline or path stroke reveals the curve as the pen moves, using stroke-dashoffset only. At t = 0 and t = 16 the pen is at the same coordinate, the stroke state matches, and pixel MAE is 0.

The finished curve has exactly five inner loops. The five closest approaches of the pen to Earth are 72 degrees apart around (320,320), tolerance 2 degrees. Do not draw a logarithmic spiral. Do not add a sixth petal.

Output only the <svg>.
```

判读：

- Pass：五瓣；五次近地点方位间隔 72°±2°；t=16 与 t=0 的笔尖坐标相同且 MAE ≡ 0；绘制过程 max MAE ≥ 0.015；0 script。
- Partial：有花瓣，但不是五瓣，或近地点方位不均匀。
- Fail：对数螺线、椭圆扫掠、含 script、静止全图一次画出且没有笔尖运动。

### 5. 单摇把太阳系仪，正反转

- 中文名：单输入太阳系仪，反转不卡
- English: Single-Crank Orrery That Reverses
- ID: `animated-orrery-single-crank-v1`

出处：@kimmonismus，2026-11-10 16:05 UTC，https://x.com/kimmonismus/status/2120186125591646250 ，索引 719 likes、29 reposts、49 replies。公开正文只确认「一个控件驱动齿轮和折叠花瓣，反转也成立」。13 条 brief 的原文没有被完整索引。下面的齿数是考场合同，不是假装的原提示词。

考点：单一角度驱动多级齿比，并且后半段时间反号。与开放差速器的差别是：这里没有左右轮速度分配，有的是输入反向时所有从动件反向，花瓣开合跟随同一角度。

```text
Generate one self-contained animated SVG of a tabletop orrery driven by one crank. No planet names, no brand, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 800 480". CDATA around any <style>. Separate groups for the crank, two gears, three planets, and one petal iris.

Loop T = 12s. Crank angle phi, in degrees:
phi(t) = 360 * t / 6 for 0 <= t <= 6
phi(t) = 360 * (12 - t) / 6 for 6 < t <= 12
So phi(0) = phi(12) = 0 and phi(6) = 360. The second half is the first half played backward. Pixel MAE at t = 12 equals t = 0.

Gear A has 16 teeth and rotates by phi. Gear B has 32 teeth, meshes with A, and therefore rotates by -phi / 2. Three orbit markers on a common center rotate by phi, phi/2, and phi/4. A six-petal iris opens by radius 20 + 40 * abs(sin(phi in radians)) and closes on the return. Teeth must stay meshed: do not let gear B spin independently of the crank.

Output only the <svg>.
```

判读：

- Pass：φ(6)=360°、齿轮 B 为 −180°、三颗从动体比例 1 : 1/2 : 1/4、后半段反向、t=12 MAE ≡ 0、max MAE ≥ 0.015、0 script。
- Partial：行星在转，但反转段缺失，或齿数与转角不符。
- Fail：每个行星各自无限旋转；花瓣不跟随曲柄；含 script；静止。

### 6. 瓦特飞球调速器

- 中文名：飞球升起，套筒反向
- English: Watt Flyball Governor
- ID: `animated-watt-governor-flyball-v1`

出处：@thebuggeddev，2026-11-10，索引约 372–378 likes。演示主体是三维实验柜；可改造的部分是其中的 SVG 瓦特指示器。status 未消解，见上。原提示词没有被完整索引，下面按离心调速器的运动合同重写，去掉巴黎实验室和参考图。

考点：转速升、飞球张角升、套筒升、阀门降，四者锁在同一个标量上。不是差速，也不是摩天轮吊厢的重力摆。

```text
Generate one self-contained animated SVG of a generic Watt flyball governor. Side view. No text, no brand, no steam engine illustration beyond the linkage, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 480 640". CDATA around any <style>.

Parts as separate groups: vertical spindle, two flyballs on arms hinged at (240,160), a sliding sleeve, and a valve plug. Arm angle alpha is measured from straight down.

Loop T = 8s, linear in the sine argument:
alpha(t) = 20 + 25 * sin(pi * t / 8) degrees
alpha(0) = alpha(8) = 20, alpha(4) = 45. Both balls share alpha and mirror across x = 240. Sleeve height rises 48 px as alpha goes from 20 to 45, and returns. Valve plug moves the opposite way by 36 px. The spindle may spin, but spin does not replace the scored arm angle.

At t = 8 every part matches t = 0. Balls do not detach. Arms do not change length.

Output only the <svg>.
```

判读：

- Pass：t=4 张角 45°±1.5°；左右镜像；套筒与阀门方向相反；t=8 MAE ≡ 0；max MAE ≥ 0.015；0 script。
- Partial：球在摆，但套筒不跟随，或左右张角不一致。
- Fail：只画了一个旋转的轴；含 script；静止。

### 7. 九缸星形发动机主副连杆

- 中文名：九缸星形发动机，主连杆与副连杆
- English: Nine-Cylinder Radial, Master and Articulated Rods
- ID: `animated-radial-master-rod-v1`

出处：@olezhavich，2026-10-31，索引 334 likes、30 reposts。主帖 URL 未确认。题面摘录要求：九缸、每 40°、1 号主连杆接曲柄销、其余八根副连杆接在主连杆大端、发火顺序 1-3-5-7-9-2-4-6-8、禁止九个相同正弦。原题允许 Canvas 与 CDN。本库改成纯 SVG，并丢掉 “RADIAL NINE” 字样。

考点：主副连杆拓扑与隔缸发火。开放差速器考的是左右轮速度和；本题考的是一个曲柄销带动一个主连杆，副连杆不直接套在曲柄销上。

```text
Generate one self-contained animated SVG cutaway of a nine-cylinder radial engine, front view. No title, no brand, no script, no CDN.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>. Navy background, flat technical colors.

Nine cylinders at 0, 40, 80, ..., 320 degrees. Cylinder 1 is at the top. One crank pin. The master rod of cylinder 1 is pinned to that crank pin. The other eight rods are pinned to the master rod's big end, not to the crank pin. Do not animate the eight pistons with the same sine shifted by 40 degrees.

Loop T = 8s = two crank revolutions = 720 degrees of crank, linear. Each cylinder fires once per 720 degrees. Firing order is 1, 3, 5, 7, 9, 2, 4, 6, 8, which is an 80 degree crank step. A firing is a 0.15s flash in that cylinder only. At t = 0 and t = 8 the crank angle is 0 and every rod matches. Piston motion must reverse at the two ends of the stroke, not slide through the head.

Output only the <svg>.
```

判读：

- Pass：九缸 40° 均布；只有 1 号连杆接触曲柄销；发火间隔 80° 曲柄角且顺序为 1-3-5-7-9-2-4-6-8；t=8 MAE ≡ 0；max MAE ≥ 0.015；0 script。
- Partial：缸数和转动对，但八根副连杆直接套在曲柄销上，或发火按 1-2-3 顺序。
- Fail：活塞用同一正弦；含 script；静止。

### 8. 熔蜡对流颈缩

- 中文名：熔蜡灯，上升、颈缩、合并
- English: Lava Blob, Rise, Neck, and Merge
- ID: `animated-lava-blob-convection-v1`

出处：同一条 @MiaAI_lab 帖中的 “Lava Lamp, 1971”。@aitrendz_xyz 2026-11-10 13:37 UTC 的转述帖 https://x.com/aitrendz_xyz/status/2120148925445521699 索引只有 3 likes，不能把这件说成独立爆款。原作是对流、浮力和蜡滴拉长。

考点：浮力上升只有一次竖向速度反号，颈缩发生在分裂前，分裂后的两块质量中心分开再合并。与「鱼跃入云」的差别是：这里没有非模态遮挡层，考的是连续变形和闭合对流。

```text
Generate one self-contained animated SVG of a generic lava lamp. No logo, no text, no glass brand, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 360 640". CDATA around any <style>. One bottle silhouette, liquid, and exactly two wax blobs as separate paths.

Loop T = 10s. Blob A starts as one body at the bottom.
0.0–3.0s: it rises. Its vertical velocity changes sign only once, at the apex.
3.0–4.5s: a neck forms. The waist width falls to at most 30% of the body's maximum width, then the path splits into two subpaths.
4.5–7.0s: the upper piece stays near the top; the lower piece falls.
7.0–10.0s: the lower piece merges back, and at t = 10 the shape, position, and pixel values match t = 0.

Do not teleport the split. Do not fade one blob out and another in. The waist must be geometrically narrow before the split frame.

Output only the <svg>.
```

判读：

- Pass：上升段只有一次竖向反号；分裂前腰宽 ≤ 30% 最大宽度；t=10 MAE ≡ 0；max MAE ≥ 0.015；0 script。
- Partial：有上升和掉落，但用透明度切换代替颈缩，或合并后位置漂移。
- Fail：两个球各自上下弹；含 script；静止。

## 候选与爆款之间的缺口

11 月真正高赞的作品几乎都是带脚本的三维或游戏。能收成纯 SVG 闭环的，主要来自 Mia 的 76 件仓库和少数机构演示。这是窗口事实，不是筛选过严。若只要「有独立高赞推文、且原帖就是 SVG」的题，本窗口过线的只有被排除的鹈鹕车，以及热度中等的 ORRERY / 瓦特指示器。上面 8 道里，1–4 与 8 的热度应记在总实验上，不能写成八条各自病毒传播。

# 第四部分：检索轨迹与边界

## web_search（98）

1. Claude Fable 5.2 Anthropic November 2026
2. Gemini carbon Google DeepMind November 2026
3. "Fable 5.2" Claude release OR announced OR preview November 2026
4. site:platform.claude.com Claude Fable 5.2 overview model card November 2026
5. Claude Fable 5.2 SVG animation coding benchmark Simon Willison
6. "Gemini 4 Carbon" SVG OR frontend OR "visual" benchmark OR test November 2026
7. "Fable 5.2" site:news.ycombinator.com OR site:reddit.com November 2026
8. site:simonwillison.net Fable 5.2 pelican SVG November 2026
9. "Fable 5.2" SVG OR isometric OR animation OR "spatial" site:x.com OR twitter November 2026
10. "Gemini 4 Carbon" OR "Gemini carbon" pelican OR SVG OR shader OR WebGL November 2026
11. Fable 5.2 system card Anthropic safeguards vision benchmark scores November 9 2026
12. site:reddit.com/r/ClaudeAI Fable 5.2 SVG OR design OR frontend OR vision November 2026（传输失败）
13. simonwillison.net 2026 Nov 9 Fable 5.2 pelican xhigh max thinking tokens
14. Claude Fable 5.2 Chartography BenchCAD OSWorld scores system card
15. Gemini 4 Carbon Chartography Blueprint-Bench WebDev Arena Elo November 2026
16. x.com Fable 5.2 isometric animation BreejeAnadkat November 2026
17. "Gemini 4 Carbon" site:reddit.com SVG OR design OR frontend OR hallucination November 2026
18. Fable 5.2 "failed" OR "worse" OR hallucination OR "overthinking" SVG OR coding November 2026
19. LLM SVG animation challenge November 2026 clock OR pendulum OR fluid OR kaleidoscope OR gear
20. "Fable 5.2" OR "Gemini 4 Carbon" prompt kaleidoscope OR pendulum OR orrery OR moiré OR tessellation SVG
21. site:x.com "Fable 5.2" SVG OR prompt animation OR isometric OR physics November
22. Gemini 4 Carbon Antigravity demos Eiffel OR fortepiano OR textile OR Platform 37
23. Hacker News Fable 5.2 discussion item November 2026 coding vision
24. awesome-fable-5.2 GitHub SVG games November 2026
25. productwithattitude Claude Fable 5.2 design motion tests prompts SVG November 2026
26. Fable 5.2 Spirograph OR harmonograph OR lissajous OR geneva OR scotch yoke SVG
27. Gemini 4 Carbon community test prompt SVG physics OR geometry OR fluid OR kaleidoscope
28. site:reddit.com/r/singularity Fable 5.2 pelican test go all out November 2026
29. Claude Fable 5.2 API model ID pricing knowledge cutoff June 2026
30. Gemini 4 Carbon API model ID pricing November 30 2026
31. MiaAI-Lab Claude-Fable-5.2 HTML studies physics mechanisms
32. Fable 5.2 Watt governor OR cardan OR antikythera OR harmonograph OR kaleidoscope prompt
33. Gemini 4 Carbon Watt indicator OR glass Jenga OR knitted OR cloth simulation
34. site:x.com Fable 5.2 "prompt:" animation OR SVG OR physics likes November 2026
35. prompt challenge November 2026 Claude Fable OR Gemini 4 SVG OR HTML viral
36. Fable 5.2 one-shotted dream game Saltline Starry Nightrider
37. x.com thebuggeddev Gemini Carbon Parisian physics lab Watt indicator likes
38. x.com AI_Andrew glassy jenga Gemini Carbon likes
39. x.com kimmonismus ORRERY Gemini Carbon likes
40. x.com simonw Gemini Carbon pelican SVG status 2120259652093112614
41. x.com kevin_t_ngo Fable 5.2 drawing prompt likes
42. site:reddit.com/r/LocalLLaMA Fable 5.2 OR Gemini 4 Carbon November 2026
43. Fable 5.2 Mythos 5.2 Fable 5.5 rumor debunked
44. Gemini 4 Carbon Fairwind October 28 general availability November 10 slowness
45. site:news.ycombinator.com Gemini 4 Carbon discussion November 2026
46. Gemini 4 Carbon vs Fable 5.2 SVG OR frontend OR spatial independent test
47. Fable 5.2 RoboDojo BenchCAD vision limitations system card
48. Ripple Tank OR Iron Filings OR Pendulum Wave OR Dance of Venus MiaAI prompt file
49. site:x.com Geneva drive OR scotch yoke OR Watt governor OR cardan joint SVG Claude OR Gemini OR Fable
50. Artificial Analysis Fable 5.2 Intelligence Index vs Gemini 4 Carbon
51. Gemini 4 Carbon floor plan OR spatial error OR wrong door OR hallucination
52. Snorkel Fable 5.2 vs 5.1 coding benchmark 71.4%
53. site:x.com Fable 5.2 kaleidoscope OR spirograph OR harmonograph OR newton cradle November
54. x.com evvvvince Fable 5.2 Swiss lever watch Three.js likes date
55. x.com danieldwalton radial engine Gemini Carbon likes date
56. x.com istvan_csanady Geneva drive solver likes 2026
57. ripple tank double slit SVG animation LLM prompt November 2026
58. Fable 5.2 black hole physics solved independent verification
59. site:reddit.com/r/ClaudeAI Fable 5.2 SVG OR frontend OR design OR overthinking
60. MotionGraphicsBench arxiv 2611.10592
61. site:github.com MiaAI-Lab Claude-Fable-5.2-HTML-Files pendulum-wave op-art
62. Gemini 4 Carbon orrery gear system prompt alsamahi
63. Fable 5.2 northern lights Arctic lake MichaelGannotti
64. world-clock christopherrbrown3 Fable 5.2 Gemini Carbon
65. Artificial Analysis Gemini 4 Carbon hallucination rate
66. pendulum wave Fable 5.2 site:x.com November 2026
67. MiaAI-Lab 76 HTML op-art Fable 5.2 twitter
68. squash and stretch bouncing ball Fable 5.2 Karo productwithattitude
69. site:x.com Fable 5.2 marbling OR suminagashi OR iron filings OR ripple tank OR lava lamp OR sandpile
70. Gemini 4 Carbon model card SEC-bench ExploitGym CWE-bench GraphWalks
71. Claude Fable 5.2 FrontierCode SWE-bench Remote Labor Index scores
72. site:reddit.com/r/Bard Gemini 4 Carbon November 2026
73. site:reddit.com/r/MachineLearning Fable 5.2 OR Gemini 4 Carbon November 2026
74. Qwen OR GPT-6 OR Grok SVG benchmark November 2026 Fable OR Gemini 4 Carbon
75. x.com MiaAI_lab status 2119930229661503893 likes date
76. x.com aitrendz_xyz Lava Lamp likes date
77. x.com olezhavich RADIAL NINE likes
78. x.com Google Gemini 4 Carbon textile OR jenga OR pelican quest likes
79. amodal completion OR impossible triangle OR penrose SVG LLM November 2026
80. site:reddit.com/r/singularity Gemini 4 Carbon SVG OR coding OR slow OR hallucination
81. x.com felixrieseberg Saltline likes date
82. x.com ebbyamir Starry Nightrider likes date
83. x.com AndrewCurran_ status 2119953960794780133 likes date
84. Claude Fable 5.2 text and images output no native image generation
85. Gemini 4 Carbon Gray Swan 0.0% AND AA-Omniscience 11%
86. Fable 5.2 designs blind OR cannot watch SVG animation
87. x.com BreejeAnadkat status 2120115744168091921 likes date
88. x.com kimmonismus status 2120186125591646250 date likes
89. x.com alsamahi status 2120442135862554731 date likes
90. x.com motion_so status 2119956569597358414 likes date
91. news.ycombinator.com item 50429068 points comments
92. 065-ripple-tank OR Ripple Tank MiaAI Fable 5.2 prompt txt
93. Starry Nightrider ebbyamir likes bookmarks November 10 2026
94. x.com BreejeAnadkat Animating these isometric likes
95. x.com ruben_kostard OR ForgeCAD Geneva drive likes November 9 2026
96. x.com Google Gemini 4 Carbon announcement status 2120186187298058708
97. site:reddit.com/r/ClaudeAI/comments/1xs0dct Fable 5.2 overthinking Max
98. Venus pentagram Dance of Venus exact 8 year period

第 12 轮传输失败，没有返回结果。其余 97 轮返回了索引摘录。

## web_fetch（10，全部失败）

1. https://www.anthropic.com/claude-fable-and-mythos-5-2
2. https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/
3. https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/
4. https://arxiv.org/abs/2611.10592
5. https://simonwillison.net/2026/Nov/9/llm-anthropic/
6. https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts
7. https://r.jina.ai/https://www.anthropic.com/claude-fable-and-mythos-5-2
8. https://r.jina.ai/https://simonwillison.net/2026/Nov/9/llm-anthropic/
9. https://r.jina.ai/https://arxiv.org/abs/2611.10592
10. https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files

失败原因相同：目标解析到 `198.18.0.0/15`，SSRF 拦截。没有获得页面正文、原始 JSON 或现场互动数。

## 无结果或证据不足

- r/LocalLLaMA、r/MachineLearning：本窗口没有 Fable 5.2 或 Gemini 4 Carbon 的匹配帖。
- r/singularity 上针对 Carbon 的 SVG / 幻觉检索，没有返回可用的用户实测帖。
- X 上没有检索到 2026-11 的 Fable 5.2 + kaleidoscope / spirograph / harmonograph / Newton's cradle 帖。
- X 上没有检索到独立的 “pendulum wave” + Fable 5.2 热帖。摆波只存在于 Mia 仓库文件索引。
- “Ripple Tank” 的完整提示词索引指向 Opus 5.5 的 100 HTML 实验，不指向 Fable 5.2 的 76 件。因此没有把双缝涟漪槽列入候选。
- Suminagashi 的公开演示索引指向更早的 Fable 5 / 5.1，不记到 5.2。
- MotionGraphicsBench 没有给出 Fable 5.2 或 Gemini 4 Carbon 的分数。
- 黑洞两题没有检索到外部完整复核。
- Google 公告推文的精确 status `2120186187298058708` 没有对上公开帖。附近 Google 帖的赞数不能转记到这个 ID。
- 专用 SVG 榜没有给出可引用的 Fable 5.2 与 Carbon 名次。缺席不解释成失败，只说明本会话没有核实到名次。

本报告不需要后续动作。候选尚未写入 `src/core/prompt`，入库前应先打开上表 URL 复核赞数与提示词原文。
