# 2026-10 X 流行视觉评测：精选 8 题与检索轨迹

> 窗口：2026-09-17 至 2026-11-14，重点 2026-10。
> 检索：52 轮公开网页检索，交叉 X、Hacker News、Reddit、GitHub、论文与数据集页。
> 状态：研究归档。尚未注册进 `src/core/prompt/bank/`。
> 日期由推文雪花 ID 换算为 UTC，热度为检索时公开快照，会随时间变化。

## 精选

| ID | 题目 | 首发 UTC | 主来源 | 独立考点 |
| :--- | :--- | :--- | :--- | :--- |
| `animated-jansen-walker-v1` | 简森步行机构 | 2026-10-30 | [@elvar_official](https://x.com/elvar_official/status/2116192984299344372) | 11 杆定长、圆圆交点、平地相 |
| `animated-jumping-spider-leap-v1` | 跳蛛四足交替起跳 | 2026-10-31 | [@elvar_official](https://x.com/elvar_official/status/2116618736371118544) | 两组四足、下蹲、0.12 s 伸直 |
| `animated-centipede-wave-gait-v1` | 蜈蚣行波步态 | 2026-11-01 | [@Koan0x](https://x.com/Koan0x/status/2116967605294502345) | 相位差 0.11、后向行波 |
| `animated-open-differential-v1` | 开放差速器过弯 | 2026-10-12 | [社区图](https://skills.wheresryan.sh/anatomy/community/nader0913/open-differential) | 行星轮、外侧轮更快 |
| `animated-ferris-leveling-v1` | 摩天轮吊厢自水平 | 2026-10 | [YouMind 679](https://youmind.com/prompts/svg-ferris-wheel-mechanical-animation-in-html-679) | 反向等角、啮合转向 |
| `animated-octopus-organ-v1` | 章鱼操作管风琴 | 2026-09-14 重跑，10 月续议 | [HN 49696402](https://news.ycombinator.com/item?id=49696402) | 8 腕、手键盘、脚键盘 |
| `animated-peacock-bicycle-v1` | 孔雀骑车尾屏 | 2026-10-26 | [@SahilPanhotra](https://x.com/SahilPanhotra/status/2114802178212892744) | 眼斑、尾屏、踏板相位 |
| `animated-nautilus-spiral-v1` | 鹦鹉螺对数螺线 | 2026-08-05 起，10 月仍作曲线探针 | [PyShine](https://pyshine.com/Ollama-Local-Models-SVG-Comparison-Nautilus-Shell/) | φ 增长、隔板、生长动画 |

每题细则见同目录 `01` 至 `08`。

## 淘汰

| 候选 | 原因 |
| :--- | :--- |
| 经典鹈鹕车、犰狳、狐猴、四件等轴测硬件、人手、鱼云、海岛宝箱、树下读者、四大名著、城市地标 | 库内已有 |
| 彭罗斯三角、3:45 时钟 | 库内 `penrose-v1`、`clock-v1` |
| Anatomy 的猛禽发动机、街机、台式 CRT | 依赖 `/anatomy`，且与机柜、CRT、爆炸图同构 |
| Kris Chase `/isometric-objects`、Hairline `/hairline-create` | 依赖客户端技能；Hairline 交互需要脚本 |
| SVG-Bench、FW-Icon、Rapidata、MotionGraphicsBench | 数据集或编辑任务，没有单道可复现爆款题面 |
| Codevember 2026 Day 6 Orrery | 提示词只有单词 Orrery，日期 2026-11-01，成品是 Three.js |
| 真人肖像、政要、商业领袖 | 一票否决 |
| 静态五角星、单色色块、无计数约束的普通图标 | 区分度不足 |

商标已中立化：社区原帖里的具体火箭发动机、具体品牌电脑不进入题面。简森（Jansen）连杆长度是公开机构学常数，保留数值，不保留沙滩兽商品名。

## 检索轨迹（52）

| # | 查询 | 结论 |
| :--- | :--- | :--- |
| 1 | LLM SVG benchmark viral prompt October 2026 site:x.com | 孔雀骑车、SVG-Bench、FW-Icon |
| 2 | pelican SVG benchmark replacement prompt 2026 | Gally 30 题替代集 |
| 3 | SVG Claude OR GPT animation benchmark October 2026 | SVG.new 描摹动画，依赖外部描摹 |
| 4 | isometric SVG LLM prompt challenge 2026 Hacker News | 无独立 HN 挑战；技能文很多 |
| 5 | site:news.ycombinator.com SVG LLM draw 2026 | 鹈鹕续测、替代集、设备箱等轴测 |
| 6 | SahilPanhotra peacock SVG bicycle October 2026 | 2026-10-26，GPT 6.1 Terra 焊在车上 |
| 7 | SVG-Bench datapointai October 2026 | 2026-10-22，352,270 票，无单题 |
| 8 | pelican-bicycle alternatives gally.net | 2026-09-14 画廊，章鱼管风琴为第 1 题 |
| 9 | site:reddit.com/r/LocalLLaMA SVG October 2026 | 10 月无新帖；7 月火烈鸟太空步 |
| 10 | MotionGraphicsBench arXiv | 2026-11-07，编辑任务，pass@1 6.0–67.7% |
| 11 | Generate an SVG OR animated SVG October 2026 viral | 技能与教程，缺独立题面 |
| 12 | quadruped gait SVG LLM benchmark 2026 | SVG Lab 猫行走，侧向序列，9 月 |
| 13 | amodal SVG occlusion prompt October 2026 | EMNLP 分层论文，与鱼云同构 |
| 14 | site:github.com SVG benchmark isometric hairline SMIL | Hairline、svg-3d、Meowbench、青蛙下颌 |
| 15 | Kris Chase gist beyond Macintosh CRT rack | 示波器、合成器，与已收录四题同技能 |
| 16 | site:x.com SVG benchmark October 2026 -pelican | SVGator 奖金赛、FW-Icon |
| 17 | Generate an SVG of octopus giraffe starfish | 替代集题面，无新原帖 |
| 18 | simonwillison.net SVG October 2026 | 工具与鹈鹕续测，无新题 |
| 19 | draw an SVG viral October 2026 Claude fail wheels | Anatomy 10 月 10 日走红 |
| 20 | Hacker News Show HN SVG October 2026 | 无等轴测动画挑战首页帖 |
| 21 | wheresryan22 Anatomy October 10 2026 | 一句话机器图，约 1.8 万赞、2.6 万星 |
| 22 | Anatomy isometric HN October 2026 | HN 无同名帖 |
| 23 | FW-Icon October 2026 | 2026-10-01，半日图标流程，无单题动画 |
| 24 | animated SVG crab octopus mantis gait 2026 | 蟹、蛛、蜈蚣、螳螂拆解潮 |
| 25 | LocalLLaMA SVG October prompt | 仍只命中 7 月 |
| 26 | Gustafssonkotte centipede 32 legs | 实为 @Koan0x 11 月 1 日，相位 0.11 |
| 27 | Buildwahab mechanical crab prompt | 11 月 6 日 Three.js，晚于窗口 |
| 28 | Ovrento praying mantis 434 | 11 月拆解，晚于窗口且需脚本 |
| 29 | octopus unicycle OpenVGLab | 2026-09-24 一镜生成，早于窗口 |
| 30 | hairline isometric October 2026 Kris Chase | 与 Lucas Markes Hairline 不是同一项目 |
| 31 | Koan0x centipede metrics | 24 赞量级；机制描述可复现 |
| 32 | Elvar skill spider crab October 2026 | 10 月 30 日 teardown，Strandbeest 为内置例 |
| 33 | OpenVGLab riders list dates | 8 题均 2026-09-24 |
| 34 | spatial reasoning Penrose Escher amodal 2026 | 11 月不可能物体帖；库内已有彭罗斯 |
| 35 | animated SVG pendulum orrery kaleidoscope 2026 | Codevember 单词 Orrery；摩天轮提示词可复现 |
| 36 | jina.ai HN 49696402 date | 约 2026-09-14，133 分、45 评论 |
| 37 | OpenVGLab stars date | 16 星，9 月 24 日 |
| 38 | SVG Claude fail fingers spokes welded October 2026 | 浮空、辐条、多腿、焊死 |
| 39 | tandem corgi duck hedgehog snail tweet | 无 10 月原帖 |
| 40 | HN SVG October benchmark | 替代集与 Pele；无新动物题 |
| 41 | Rapidata October 29 2026 hardest prompts | 500 题集合，无单道爆款 |
| 42 | Strandbeest SVG prompt October 2026 | 公开“圣数”；常见答案违规使用脚本 |
| 43 | man o' war pyrosome SVG | 2025-10 图像题，不是 SVG，且早于窗口 |
| 44 | codevember 2026 day 6 orrery exact prompt | 提示词仅为 Orrery，2026-11-01 |
| 45 | elvar Strandbeest likes | 3,970 赞、457 转发、4,478 书签 |
| 46 | Introducing Anatomy likes stars | 18,231 赞、27,383 书签、约 26.7k 星 |
| 47 | open differential anatomy October 2026 | 2026-10-12 社区开放差速器 |
| 48 | kaleidoscope zoetrope nautilus anemone SVG | 鹦鹉螺曲线探针；其余无稳定题面 |
| 49 | HN front page October 2026 SVG isometric | HLR/SVG 渲染基准，不是出题 |
| 50 | elvar spider tweet 2116618736371118544 | 2,482 赞；8 腿分 2 组，0.12 s |
| 51 | lucasmarkes hairline October 3 likes | 4,406 赞、33 图、3.7k 星；需脚本与技能 |
| 52 | Ferris wheel self-leveling + octopus organ failures | 吊厢翻面、齿轮同向；腕数与踏板失效 |

## 使用边界

提示词草案是净室重构，不复制技能文件、仓库源码或第三方 SVG。判定只看几何、计数、相位与循环，不看画风相似度。
