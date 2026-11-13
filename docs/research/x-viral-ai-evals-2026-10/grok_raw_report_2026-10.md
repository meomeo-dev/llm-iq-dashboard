我先核对仓库里已收录的题目，再按 2026-10 窗口做连续检索，避免重复经典鹈鹕车、犰狳步态这类既有题。检索结果里已经出现 2026-09 的鹈鹕替代题库，我接着核验原始页面，并按 X、HN、Reddit、GitHub 分路深挖 2026-10 窗口。已排除 9 月等轴测硬件与经典动物骑行题。接下来核对时钟、步态、错觉几何和多触手操作这几条独立考点的原始出处。已有几条可核验的题面。我再补检索触手管风琴、四足步态、钟表擒纵和错觉几何的原始讨论，避免把 9 月已入库题目算进来。还差几条独立于已收录题的原始链接。我去抓 Anatomy 擒纵、Hairline、牛顿摇篮和 SVGBench 的一手页面。Fourier 圆描鹈鹕是 10 月的高传播样本，但它仍落在已收录的鹈鹕车上。我再找几条几何与机构题的一手出处，把候选从骑行变体里拆开。彭罗斯阶梯出现在 10 月等轴测技能演示里，且不与已收录的机柜、相机、初代电脑重复。我再补几条机构与多肢体题的原始链接。候选已经够做去重。我再补几轮交叉检索，确认 10 月窗口里的机构、错觉和多肢体题没有被更早的库内题目覆盖。非模态遮挡那一轮失败了，我补一次检索，并核对四足步态与擒纵机构的讨论热度。2026-10 窗口里，能同时满足「有可复现题面、考点不与现库重复、主体不是真人、并且能收成纯内联 SVG 动画」的爆款，最后留下 8 道。检索共 85 轮 `web_search`（1 轮传输失败后已重试）加 6 轮 `web_fetch`。`web_fetch` 对 Hacker News、GitHub、gally.net、svglab.app、springprompt.com、skills.wheresryan.sh 全部被 SSRF 拦截，下面的互动数字是搜索索引快照，不是打开原帖后的现场计数。

## 证据边界

现库已占用、本次直接剔除的题包括：动态鹈鹕车、火星网袜犰狳、狐猴滑板车、等轴测初代个人电脑、橙屏 CRT、十秒机架、相机爆炸图、人手屈伸、鱼跃入云、海岛宝箱、树下读书人，以及四大名著和城市地标。2026-10-13 的 Fourier 圆描鹈鹕（@fofrAI，约 8420 likes / 200 万 views）传播最高，主体仍是鹈鹕车，不单列。

Kris Chase 的 isometric-objects gist 已被现库挖过电脑、机架和相机。本次只取该 gist 里尚未入库的彭罗斯阶梯。品牌腕表、真人肖像、依赖 `<script>` 或外部 Skill 的原帖，在重构稿里都改成了自包含 SMIL / CSS。

## 1. 五点二十三分针钟

- 中文名：五点二十三的三针钟
- English: Three-Hand Clock Frozen at 5:23, Then Ticking
- ID: `animated-clock-five-twenty-three-v1`

来源有两条，时间都落在 2026-10。

| 项 | 内容 |
|---|---|
| 题面出处 | Rapidata Static SVG Benchmark 的种子题 “Make an SVG of a clock showing the time 5:23” |
| 链接 | https://www.benchmark.ai/svg ，数据集 https://huggingface.co/datasets/Rapidata/svg-benchmark |
| 10 月动态 | ModelScope 镜像约 2026-10-29 更新；同月投票集约 2026-10-08 发布 |
| 动画讨论 | @jurlycat，2026-10-18，https://x.com/jurlycat/status/2111781986071167103 |
| 热度 | 该帖索引为 55 likes、5 reposts、34 replies；演示 https://tkgally.github.io/500-clocks/ |

社区把静态 5:23 当成「会不会做角度算术」的探针。常见翻车是时针钉死在 5、分针钉死在 4 或 5、两针对调，或者直接画成广告常见的 10:10。500 clocks 那一串则说明 Opus 5.5 能堆出大量会动的表盘，但原产物是带脚本的 HTML，而且夹杂品牌表款。

考点是圆周角耦合，不是等轴测。5:23:00 的真值（12 点方向为 0°，顺时针）为：

- 分针：23 × 6° = 138°
- 时针：(5 + 23/60) × 30° = 161.5°
- 秒针：0°

真时钟的 12 小时闭环太长，也看不清。重构把检验拆成「冻结角」和「短周期速率」。

提示词草案：

```text
Generate one self-contained animated SVG of a generic round analog clock, with no brand, logo, or numeral words other than 1–12.

Technical contract: SMIL <animateTransform> or inline CSS @keyframes only. 0 <script>, no external assets, well-formed XML. If a <style> block is used, wrap it in CDATA.

Geometry: viewBox="0 0 400 400", pivot at (200,200). At t=0, which must be readable as 5:23:00, the minute hand is rotated 138 degrees, the hour hand 161.5 degrees, and the second hand 0 degrees, all clockwise from 12. Hour hand shorter and thicker than the minute hand. Twelve major ticks. Draw the hands as separate groups so each angle can be measured.

Motion over a 60-second cycle: second hand rotates exactly +360 degrees, minute hand exactly +6 degrees, hour hand exactly +0.5 degrees, all linear. Do not step the minute hand early. At t=60s the clock reads 5:24:00. Then play the same motion backward for 60 seconds so t=120s matches t=0 exactly.

Output only the <svg> document.
```

判读：

- Pass：t=0 三针角度误差各 ≤ 1.5°；60 秒内转角分别为 360° / 6° / 0.5°，线性；t=120s 与 t=0 的像素 MAE ≡ 0；周期内最大帧差 MAE ≥ 0.015；0 script。
- Partial：时刻读得对，但分针阶跃、时针不随分钟偏移，或回放段缺失。
- Fail：画成 10:10 或整点 5:00；时针分针对调；退化为数字时钟；含 script；静止图。

## 2. 杠杆擒纵

- 中文名：十五齿杠杆擒纵
- English: Fifteen-Tooth Lever Escapement
- ID: `animated-lever-escapement-tick-v1`

| 项 | 内容 |
|---|---|
| 技能发布 | @wheresryan22，2026-10-10，https://x.com/wheresryan22/status/2108948624004526516 |
| 热度 | 索引约 18235 likes、1593 reposts。另一次快照写 18231 likes。views 未索引 |
| 社区图 | 2026-10-12，提示 “/anatomy explain how a mechanical watch's lever escapement keeps time” |
| 链接 | https://skills.wheresryan.sh/anatomy/community/nader0913/lever-escapement |
| 作者标记 | 画廊署名 @nader0913，模型标记为 Claude Opus 5.5 |

10 月 10 日的原帖是 Anatomy 技能发布，正文没有点名擒纵。擒纵是两天后的社区样例。原技能常输出可交互 HTML / WebGL。重构去掉品牌机芯名和脚本，只留锁紧、释放、冲击三个相位。

典型失败是「一堆咬合的圆」，擒纵轮齿数与叉瓦节拍对不上，摆轮永远转，中间轮却不按齿距步进。

提示词草案：

```text
Generate one self-contained animated SVG of a generic Swiss lever escapement seen from the movement side. No brand, no logo, no text labels.

Technical contract: SMIL or inline CSS only, 0 <script>, no external files, CDATA around any <style>, well-formed XML. viewBox="0 0 640 400".

Parts, as separate groups: a 15-tooth escape wheel, a pallet fork with entry and exit stones, and a balance wheel on a hairspring. Dark hairline technical drawing on #111, brass and steel limited to four flat tones, ruby stones in one red.

Closed cycle T=3.75s, five ticks, linear timing. Each tick lasts 0.75s and advances the escape wheel by exactly 24 degrees (one tooth). Odd ticks: entry stone locks, then impulse, then the fork swings to the opposite bank. Even ticks: exit stone does the same. The balance rotates alternately +25 and -25 degrees and is at an extreme when a tooth locks. After five ticks the wheel has turned 120 degrees; after three such cycles (11.25s, 15 ticks) the wheel has turned 360 degrees and every part matches its t=0 pose.

Output only the <svg>.
```

判读：

- Pass：15 齿、每拍 24°、叉瓦左右交替、摆轮与锁紧反相、11.25 秒姿态回到 t=0、MAE ≥ 0.015、0 script。
- Partial：有交替摆动，但齿距不是 24°，或摆轮与擒纵轮各自空转。
- Fail：普通啮合齿轮组；叉瓦穿透轮齿；含 script；静止图。

## 3. 家猫侧序步态

- 中文名：家猫侧序行走，脚掌不滑
- English: Cat Lateral-Sequence Walk with Planted Paws
- ID: `animated-cat-lateral-gait-v1`

| 项 | 内容 |
|---|---|
| 技术源 | SVG Lab，约 2026-09-25，https://svglab.app/blog/how-we-made-an-svg-cat-walk |
| 窗口内转述 | 2026-10-13，https://rottenwifi.com/how-to-animate-an-svg-cat-walk-without-sliding-paws/ |
| 10 月讨论 | thehype.news，2026-10-21，https://thehype.news/deepseek-opus-gemini-gpt-cat-animation/ |
| 引用帖 | @OpenSquilla，2026-10-22，https://x.com/OpenSquilla/status/2113114586559959269 ，索引 0 likes |
| 原帖热度 | thehype 原文索引 45 likes、8 reposts、11 replies |

这题的传播在「四条腿是否还在」这句话上，不在 SVG Lab 原文。DeepSeek 的猫被描述成直立两足走，Opus 5.5 是少数把后腿折成坐姿的。SVG Lab 给出的可测数字是：支撑相脚掌漂移 ≤ 0.04 px，侧序而不是对角快步，至少两掌着地。原实验依赖绘制与动画 MCP。重构改成原地跑步机，这样支撑相可以用地面速度来判，不必真做数值 IK。

它和犰狳、狐猴的差别在于：这里考的是四拍侧序和支撑相零滑移，不是骑乘机械。

提示词草案：

```text
Generate one self-contained animated SVG of a domestic cat walking in place on a treadmill, side view, head to the right. Pure SMIL or inline CSS. 0 <script>. No brand, no text.

Body stays in screen x. The ground pattern and the planted paws move left together. One stride is T=1.2s and loops with identical poses at 0 and T.

Lateral sequence, each footfall 0.3s apart: left hind, left fore, right hind, right fore. At every instant at least two paws are in stance. A stance paw's screen speed equals the ground speed. A swing paw lifts on a low arc and lands ahead of its hip. Legs are two-segment polylines sharing the hip and the paw; the knee bends, it does not stretch.

Add a 0.4s crouch, a parabolic jump of 0.5s, and a 0.3s landing, then return to the walk. The jump's vertical motion must change direction only once at the apex.

Seamless loop, peak frame difference MAE >= 0.015. Output only the <svg>.
```

判读：

- Pass：四足、侧序 LH-LF-RH-RF、支撑相与地面同速、腾空段抛物线只有一个顶点、闭环、0 script。
- Partial：四足在走，但是对角相位，或支撑相相对地面滑动超过 4px。
- Fail：两足直立；脚掌不接触地面；身体平移而地面不动导致必滑；含 script；静止图。

## 4. 章鱼操作管风琴

- 中文名：章鱼操作管风琴
- English: Octopus Operating a Pipe Organ
- ID: `animated-octopus-pipe-organ-v1`

| 项 | 内容 |
|---|---|
| 作者 | Tom Gally（HN: tkgally） |
| 题面 | “Generate an SVG of an octopus operating a pipe organ” |
| 画廊 | https://gally.net/temp/20260914pelican-alternatives/index.html |
| 讨论 | https://news.ycombinator.com/item?id=49696402 ，133 points，45 comments |
| 时间 | 画廊日期 2026-09-14，落在 2026-10 向前两周的边缘外两天，讨论在 10 月仍被当作鹈鹕替代题库引用 |

这是 30 条「生物操作复杂器械」里区分度最高的一条：八条触手要同时落到键盘、音栓和音管上，管高还得像音高序列。HN 上的共识是，2026 年的模型已经能把零件画全，缠绕关系和朝向仍然经常错。Gemini 3.8 Flash 被描述为更艳、更不连贯。X 上没有检索到这句提示词的独立爆款帖。

提示词草案：

```text
Generate one self-contained animated SVG of an octopus operating a pipe organ. SMIL or inline CSS only. 0 <script>. No text.

The organ has one manual of 14 white keys and 10 black keys, four stop knobs, and 12 pipes whose heights strictly increase then decrease, tallest at the center. The octopus has one mantle, two eyes on the same side facing the pipes, and exactly eight tentacles.

Over a 4-second seamless loop, six tentacles press six different keys. A press is a vertical 8px depression of that key for 0.25s. The six presses form two overlapping triads and never depress the same key twice at once. The seventh tentacle pulls one stop knob out and back. The eighth rests on the bench. Suckers stay on the underside of each tentacle. Pipes do not move.

Pose at t=0 equals pose at t=4s. Peak motion MAE >= 0.015. Output only the <svg>.
```

判读：

- Pass：八条触手可数、眼朝向音管、按键有独立相位、管高中间最高、闭环、0 script。
- Partial：像章鱼也像管风琴，但触手数不是 8，或触手只是搭在琴上。
- Fail：章鱼坐在琴顶；音管穿过身体；触手融成一条带子；含 script；静止图。

## 5. 彭罗斯阶梯

- 中文名：彭罗斯阶梯上的循环攀登
- English: Penrose Stairs with a Perpetual Climb
- ID: `animated-penrose-stairs-climb-v1`

| 项 | 内容 |
|---|---|
| 演示出处 | Kris Chase isometric-objects gist 中的 “Penrose stairs with a climbing cube” |
| gist | https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee |
| 帖子 | @KrisRChase，2026-10-04，https://x.com/KrisRChase/status/2106894653886730288 |
| 热度 | 该帖索引只有 7 likes、2 reposts。技能传播主要来自同日回复链 |
| 失败模式旁证 | r/LLMDevs 彭罗斯三角挑战 https://www.reddit.com/r/LLMDevs/comments/1neff3u/challenge_drop_your_hardest_paradox_one_no_llm/ |

这道题和现库的初代电脑、机架、相机同源，考点不同。现库三题是可制造物体的等轴测；这一题要求局部直角、全局高度矛盾。模型通常画出一座真的旋转楼梯，四段都能落地。立方体若用淡入淡出「传送」，闭环是假的。

提示词草案：

```text
Generate one self-contained animated SVG of a Penrose endless staircase in isometric view, plus one plain cube climbing it. No people, no text, no brand. SMIL or inline CSS only. 0 <script>. CDATA around CSS.

Draw four flights and four landings. Each flight locally rises, and a full circuit returns to the same landing. Use three consistent shades (top, left, right) and one occluding join per corner so the loop is impossible in 3D but locally a normal stair. Do not draw a central column that explains the height away.

The cube travels one full circuit in 8 seconds, foot always on a tread, and is hidden only while it passes behind a nearer flight. At t=8s its pose and every stair vertex match t=0. No fade teleport.

Peak MAE >= 0.020 because the cube must cover a full circuit. Output only the <svg>.
```

判读：

- Pass：四段都在「上升」，绕回同一平台，立方体沿踏步走完一圈并被近处梯段遮挡，8 秒闭环。
- Partial：错觉成立，但立方体跳级或在转角瞬移。
- Fail：普通可建造楼梯；只画一个彭罗斯三角；用透明度把立方体挪走；含 script；静止图。

## 6. 转盘反转直立

- 中文名：等轴测转盘上的直立方块
- English: Isometric Turntable with Counter-Rotated Blocks
- ID: `animated-iso-turntable-counterrotate-v1`

| 项 | 内容 |
|---|---|
| 作者 | Lucas Markes，@lucasmarkes__ |
| 发布 | 2026-10-03，https://x.com/lucasmarkes__/status/2106502812498632707 |
| 热度 | 索引 4406 likes。10-06 @HeyHuazi 718 likes；10-14 adopt 帖 694 likes；10-30 @AdhamDannaway 98 likes |
| 站点 | https://hairline.lucasmarkes.com/ |
| 原交互 | 拨动转盘，方块跟着转，再减速吸到 90° |

Hairline 是 10 月传播最清楚的一条 SVG 线框线。原作靠指针事件，不能直接入库。重构保留「盘转、物体保持等轴测直立」这个几何核：盘转 θ 时，每个方块绕自身竖轴转 −θ，屏幕上的竖边仍然竖直。

提示词草案：

```text
Generate one self-contained animated SVG in the hairline isometric style: one stroke weight, no fill except the page, no labels, no pointer events. SMIL or CSS only. 0 <script>. viewBox="0 0 400 320".

Projection: screenX = (X - Y) * cos(30deg), screenY = (X + Y) * sin(30deg) - Z. A circular platter holds four identical cubes at 90-degree spacing.

Over T=4s the platter rotates +360 degrees about the vertical axis. Each cube counter-rotates -360 degrees about its own vertical axis, so its isometric front face stays aimed at the viewer and its vertical edges stay vertical on screen. Motion is linear. t=0 and t=4s match exactly, including which face is in front.

Peak MAE >= 0.015. Output only the <svg>.
```

判读：

- Pass：30° 投影、盘转一周、方块反转一周、竖边保持竖直、前后关系随角度切换、闭环、0 script。
- Partial：盘在转，方块被画成始终相同的贴纸，没有绕竖轴反转。
- Fail：正俯视圆盘；方块离开盘面；依赖鼠标事件或 script；静止图。

## 7. 牛顿摇篮

- 中文名：五球牛顿摇篮的动量传递
- English: Five-Ball Newton's Cradle, Kinematic Transfer
- ID: `animated-newtons-cradle-transfer-v1`

| 项 | 内容 |
|---|---|
| 作者 | @elliscrosby |
| 时间 | 2026-10-11 |
| 链接 | https://x.com/elliscrosby/status/2109260231167627638 |
| 热度 | 索引 3 likes、0 replies。场次后来扩到约 20 个模型 |
| 对照页 | https://springprompt.com/playground/newtons-cradle |

原题是可拖拽的 HTML 物理，不是 SVG。索引热度低，留在这批里是因为它的失败模式可自动判：中间球漂移、端球碰不到、五球一起荡。纯 SMIL 做不了数值碰撞，所以草案要求的是运动学相位，不要求解微分方程。

提示词草案：

```text
Generate one self-contained animated SVG of a Newton's cradle with exactly five identical metal balls. SMIL or inline CSS only. 0 <script>. No text.

A rigid frame suspends each ball on two equal strings. At rest the balls touch and their centers are colinear and horizontal. Pivot spacing equals two radii plus the string gap so neighboring balls meet at one point.

Loop T=2.4s. From 0 to 0.6s only ball 1 rises to 40 degrees while balls 2–5 stay still. At 0.6s ball 1 arrives back at contact. From 0.6 to 1.2s only ball 5 rises to 40 degrees on the opposite side. The return mirrors this. Balls 2, 3, and 4 never leave the rest line. Raised strings stay taut and equal to the resting string length.

t=0 equals t=2.4s. Peak MAE >= 0.015. Output only the <svg>.
```

判读：

- Pass：五球等半径并接触；任意时刻最多一端离列；中间三球中心位移 < 1px；抬起角 40°±3°；弦长不变；闭环。
- Partial：有交替弹出，但中间球跟着晃，或只有单弦。
- Fail：五球同步摆；端球穿过邻球；含 script；静止图。

## 8. 节拍器锁相

- 中文名：九只节拍器锁成一拍
- English: Nine Metronomes Phase-Locking
- ID: `animated-metronome-phase-lock-v1`

| 项 | 内容 |
|---|---|
| 作者 | @aijoey |
| 时间 | 2026-10-18 |
| 链接 | https://x.com/aijoey/status/2111876302714044632 |
| 热度 | 索引 13 likes、1 repost、2 replies |
| 原实现 | DeepSeek-V4.1-Flash-1017，浏览器里约 10 万只节拍器，从混乱锁到 60 bpm |

这是 8 道里最弱的传播样本，保留是因为相位锁定能把「各自摆动」和「耦合」分开判。原作是大规模 Web 音频。重构收成 9 只、预计算的锁相过程，不要求现场数值积分。

提示词草案：

```text
Generate one self-contained animated SVG of nine mechanical metronomes on one shared swinging base. SMIL or inline CSS only. 0 <script>. No text, no brand.

Each metronome has a pyramid case and a pendulum. At t=0 the nine pendulum angles are -24, -12, 0, 12, 24, 18, -18, 6, -6 degrees, all with the same 0.5-second half-period.

Over T=8s, linearly pull every pendulum toward one common angle A(t) = 24 * sin(2*pi*t / 1s), in degrees. At t=8s all nine angles match A(t) within 0.5 degrees, and that common motion continues. The shared base translates horizontally by 6px times the average angle, so the coupling is visible.

Seamless at the 1-second beat boundary after t=8s. Peak MAE >= 0.015. Output only the <svg>.
```

判读：

- Pass：9 只、起始相位分散、8 秒后相位差 < 0.5°、底座随平均角移动、0 script。
- Partial：都会摆，但相位从头到尾不变，或底座不动。
- Fail：只有一只；用 script 做数值耦合；静止图。

## 剔除记录

| 候选 | 处理 |
|---|---|
| 鹈鹕车、Fourier 圆描鹈鹕 | 现库已有同一主体 |
| 犰狳、狐猴、初代电脑、橙屏 CRT、机架、相机、人手、鱼、岛、树、名著、地标 | 现库已有 |
| World Clock 的 62 款品牌表 | 商标表款，且原作依赖 JS 与实拍 |
| 灯塔夜景、龙、猫骑车、折纸猫 | 静态审美题，或与骑乘模板同构 |
| 青蛙划船、三只小猪 | HN 讨论早于窗口，且故事动画难定真值 |
| 鲁布·戈德堡、双摆、10 万节拍器原版 | 原题是 JS 物理；双摆的混沌不能用关键帧冒充 |
| 真人肖像、政要、商业领袖 | 未进入候选 |

## 检索轨迹

85 轮 `web_search`，按执行顺序。第 81 轮第一次传输失败，下一项是重试。

1. `SVG benchmark LLM October 2026 viral prompt challenge`
2. `"pelican riding a bicycle" SVG replacement 2026`
3. `LLM SVG animation benchmark October 2026 Claude GPT Gemini`
4. `site:news.ycombinator.com SVG benchmark LLM 2026`
5. `"isometric SVG" LLM prompt challenge 2026`
6. `gally.net pelican alternatives SVG 2026 octopus pipe organ`
7. `simon willison SVG animation benchmark October 2026`
8. `site:simonwillison.net SVG pelican October 2026`
9. `"SVG of" prompt challenge October 2026 LLM site:x.com OR twitter`
10. `quadrupedal gait SVG LLM benchmark 2026`
11. `Tom Gally pelican alternatives SVG prompts list 2026`
12. `"Generate an SVG of" octopus OR flamingo OR penguin OR starfish 2026 LLM`
13. `hairline technical figure SVG LLM prompt 2026`
14. `amodal completion SVG benchmark LLM 2026 prompt`
15. `site:reddit.com/r/LocalLLaMA SVG benchmark October 2026`
16. `Hairline SVG Lucas Markes isometric prompt challenge October 2026`
17. `SVG-Bench October 22 2026 RyanJ_KOL 350K rankings`
18. `"animated SVG" challenge October 2026 reddit LocalLLaMA OR twitter`
19. `"draw an SVG" OR "generate an SVG" viral October 2026 Claude fail GPT`
20. `site:x.com isometric SVG prompt October 2026 LLM`
21. `"spatial reasoning" SVG prompt viral 2026 October`
22. `Kris Chase isometric SVG prompts list October 2026 server rack camera hand`
23. `"Generate an SVG" viral tweet October 2026 views likes`
24. `site:x.com "SVG of a" October 2026 prompt challenge gait OR isometric OR occlusion`
25. `"draw this in SVG" OR "SVG challenge" LLM October 2026`
26. `Penrose triangle SVG LLM benchmark 2026 OR "impossible object" SVG prompt`
27. `Rube Goldberg SVG LLM prompt 2026 viral`
28. `Dragon Benchmark SVG September 2026 counterfiction prompts list`
29. `Rapidata SVG benchmark hard prompts list 2026 horse astronaut occlusion`
30. `"SVG of a" "clock" OR "metronome" OR "orrery" OR "kaleidoscope" LLM October 2026`
31. `simon willison new SVG test besides pelican October 2026`
32. `"self-contained SVG" animation prompt viral 2026 site:news.ycombinator.com`
33. `github SVG LLM eval prompts 2026 isometric gait amodal`
34. `meowbench SVG cat prompts 2026 bicycle origami tail sway`
35. `"lighthouse SVG" Opus 5.5 vs Sol reddit October 2026`
36. `SVG clock 5:23 Rapidata prompt hands angle fail LLM`
37. `"metronome" SVG LLM prompt challenge 2026`
38. `"gear train" OR "escapement" SVG LLM animation prompt 2026 viral`
39. `"Newton's cradle" SVG LLM benchmark 2026`
40. `ellis crosby Newton's cradle 12 models tweet October 2026 SVG`
41. `SVGBench johnbean393 physical reasoning prompts list clock gear pendulum`
42. `"octopus" "pipe organ" SVG animation OR animated LLM 2026`
43. `"four bar linkage" OR "pantograph" SVG LLM prompt 2026`
44. `"double pendulum" SVG animation LLM prompt viral 2026`
45. `site:reddit.com/r/MachineLearning SVG generation benchmark October 2026`
46. `World Clock SVG benchmark christopherrbrown3 October 2026 prompt brief`
47. `"SVG cat walk" OR "walking cat SVG" LLM benchmark 2026 planted foot`
48. `Penrose triangle SVG LLM fail October 2026 x.com OR reddit`
49. `"impossible staircase" OR "Penrose stairs" SVG prompt LLM 2026`
50. `site:github.com SVG clock hands SMIL LLM generated 2026`
51. `"frog on a boat" SVG animation LLM HN 2026`
52. `Tom Gally HN pelican alternatives October 2026 comments Simon Willison`
53. `"Generate an SVG of an octopus operating a pipe organ" twitter OR x.com OR reddit`
54. `svglab cat walk planted paw October 2026 reddit OR twitter OR hacker news`
55. `"hairline" SVG isometric Lucas Markes October 2026 twitter stars`
56. `"Swiss lever" OR escapement SVG prompt LLM October 2026 x.com`
57. `"Make an SVG of a clock showing the time 5:23" benchmark`
58. `site:x.com hairline lucasmarkes October 2026 isometric SVG likes`
59. `site:x.com "newtons cradle" OR "Newton's cradle" SVG OR HTML models October 2026 elliscrosby likes replies`
60. `simon willison markdown svg renderer animated clock OR pendulum October 2026`
61. `site:news.ycombinator.com "four-bar" OR pantograph OR "double pendulum" SVG 2026`
62. `site:x.com "planted" OR "foot sliding" SVG cat walk October 2026 usman OR svglab`
63. `"SVG of a" "kaleidoscope" OR "spirograph" OR "orrery" prompt LLM October 2026 viral views`
64. `fofr Fourier epicycles pelican bicycle tweet October 13 2026 views likes`
65. `"Penrose triangle" SVG prompt reddit LLMDevs comments models fail 2026`
66. `site:x.com "isometric" "four bar" OR linkage OR metronome SVG prompt October 2026`
67. `Rapidata SVG benchmark "giraffe playing guitar" OR "thermometer" prompt October 2026 discussion`
68. `"SVG animation" "phase" gait dog OR horse OR cat prompt challenge October 2026 reddit`
69. `Kris Chase gist isometric prompts list October 2026 what objects`
70. `Kris Chase "Penrose stairs" isometric cube tweet October 2026 gist status likes`
71. `wheresryan22 anatomy skill launch tweet October 10 2026 likes views lever escapement`
72. `"thermometer" SVG mercury descending prompt LLM fail Rapidata discussion`
73. `site:x.com "SVG" "metronome" OR "pendulum clock" OR "grandfather clock" prompt October 2026 LLM`
74. `site:reddit.com/r/LocalLLaMA "SVG" October 2026 (clock OR pendulum OR linkage OR illusion OR gait)`
75. `"Generate an SVG of a seahorse examining a microscope" OR "squid disassembling" discussion 2026`
76. `site:x.com jurlycat 500 clocks HTML Opus October 18 2026 likes`
77. `site:x.com aijoey 100000 metronomes October 18 2026 likes DeepSeek`
78. `"impossible cube" OR "Penrose stairs" SVG LLM prompt fail 2026 reddit OR hacker news`
79. `"lateral sequence" OR "planted paw" SVG prompt benchmark LLM 2026 cat walk October discussion x.com`
80. `site:news.ycombinator.com SVG clock hands angle OR escapement OR metronome 2026`
81. `amodal SVG prompt challenge October 2026 viral occlusion completion LLM`（首次失败后重试）
82. `thehype.news four-leg retention cat animation October 21 2026 OpenSquilla tweet likes`
83. `site:x.com OpenSquilla "Four-Leg Retention" October 2026 likes views`
84. `site:x.com wheresryan22 anatomy October 10 2026 "lever" OR escapement OR watch likes`
85. `lucas markes hairline turntable figure description isometric SVG October 2026`

`web_fetch` 六次均失败：HN 49696402、gally.net 画廊、Anatomy 擒纵页、SVG Lab 猫步文章、springprompt 牛顿摇篮、GitHub meowbench。

未把这 8 道写入题库、分组或溯源台账。若要入库，优先顺序是钟、擒纵、猫步、转盘、阶梯；章鱼靠近窗口边缘，牛顿摇篮和节拍器的原帖热度低。