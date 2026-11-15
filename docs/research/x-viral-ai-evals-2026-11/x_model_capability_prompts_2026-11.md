# 2026-11 X 能力实测提示词收集

报告日期：2026-11-14。
对象：Claude Fable 5.2、Google Gemini 4 Carbon。
窗口：2026-11-01 至 2026-11-14，并收入 2026-10-31 仍被 11 月讨论引用的 RADIAL NINE。
范围：X 与作者公开的博客、Gist、GitHub 提示词。只记录本次 `web_search`、`web_fetch` 与本机 HTTPS 打开后的文本。

## 结论

能逐字核对的测试提示词，集中在三处已打开的材料：Karo Zieminski 2026-11-09 的 8 条设计 brief、Simon Willison 的鹈鹕车与 Yonkers 机甲、MiaAI-Lab 仓库里 5 份已下载的 `.txt`。X 原帖在本次全部没有打开。`web_fetch` 对 `x.com` 返回 SSRF 拦截。因此 Saltline、Kevin Ngo、ORRERY、Analyse Spectrale、Glassy Jenga、RADIAL NINE、厂商 `/swarm` 演示，多数只有检索摘要或效果描述。

检索工具多次在「未找到原文」之后附上一段可粘贴的「重建提示词」。那些段落不收入正文。正文只保留页面、Gist、仓库文件，或多源检索里逐字重复的引文。

# 1. 检索汇总与能力–Prompt 映射

完整度只用三档：

- `全文`：本次打开的页面、Gist 或仓库文件里的完整提示。
- `片段`：检索摘要里的引文，原页未打开，或只录了已下载长文件的开篇。
- `未见原文`：只有作品、参数或失误描述。

| 维度 | 测试 | 目标模型 | 出处 | 日期 | 完整度 |
|---|---|---|---|---|---|
| 1 SVG / 动效算术 | Slow Signal 七板 + master brief | Fable 5.2 | productwithattitude.com，Karo Zieminski | 2026-11-09 | 全文 |
| 1 过思考 | 鹈鹕骑车，五档 effort | Fable 5.2 | simonwillison.net 与 gist `bcd1a1bf` | 2026-11-09 | 全文 |
| 1 思考档 | 同一句鹈鹕骑车，三档 thinking | Gemini 4 Carbon | simonwillison.net 与 gist `e5bf8606` | 2026-11-10 | 全文 |
| 1 盲写探针 | r/ClaudeAI `1xs0dct` | Fable 5.2 | Reddit 检索 | 2026-11 上旬 | 未见原文 |
| 1 低档对照 | r/singularity `1xsuixt`，「go all out」 | Fable 5.2 low vs Opus 5.5 med | Reddit 检索 | 2026-11 | 片段 |
| 1 非 SVG 艺术 | 「Not like an SVG」JS 画 | Fable 5.2 | @kevin_t_ngo `2121303379196662115` | 2026-11-13 | 片段 |
| 1 批量 HTML | 100 份规则 + 单题 `.txt` | Fable 5.2 | @MiaAI_lab；仓库 5 个 txt | 2026-11-09 | 规则为片段；5 个 PROMPT 已下载 |
| 1 齿轮花瓣 | ORRERY，13 条 brief 之 1 | Gemini 4 Carbon | @kimmonismus `2120186125591646250` | 2026-11-10 | 未见原文 |
| 1 百万粒子 | TIDEFORGE | Gemini 4 Carbon | 同线程 `2120186202271945137` | 2026-11-10 | 未见原文 |
| 1 等轴测 | Figma 先画再加运动 | Fable 5.2 | @BreejeAnadkat | 2026-11-10 | 未见原文 |
| 2 空间 + 错字 | Yonkers 机甲，OSM，Three.js | 两边 | simonwillison.net 两篇 | 2026-11-10 | 全文 |
| 2 平面门轴 | Seinfeld 公寓重建 | Gemini 4 Carbon | aifire.co，2026-11-12 | 2026-11-12 | 未见原文 |
| 2 水面 | 帆船水面材质 | 两边 | 同一评测的检索摘要 | 2026-11-12 | 未见原文 |
| 2 可玩性 | 英雄射击原型 | 两边 | 同一评测的检索摘要 | 2026-11-12 | 未见原文 |
| 2 机构 | Analyse Spectrale，92 零件 | Gemini 4 Carbon | @thebuggeddev | 2026-11-10 | 未见原文 |
| 2 玻璃物理 | Glassy Jenga / Vitrail | Gemini 4 Carbon | @AI_Andrew `2120243379388760176` | 2026-11-10 | 未见原文 |
| 2 连杆发火 | RADIAL NINE | Carbon、Opus 5.5、Argon、GPT-6.1 Sol。检索写明没有 Fable 5.2 | @olezhavich / @danieldwalton | 2026-10-31 | 未见原文 |
| 2 厂商 3D | Pelican Quest、埃菲尔铁塔、Platform 37、1780 钢琴、110 纤维 | Gemini 4 Carbon | Google 博文与 @Google 推文的检索转述 | 2026-11-10 | 未见原文 |
| 3 长程单文件 | Saltline 港口 FPS | Fable 5.2 | @felixrieseberg | 2026-11-09 | 片段 |
| 3 长程单文件 | Tromsø 北极光 | Fable 5.2 | @MichaelGannotti `2119922137011982652` | 2026-11-09 | 片段 |
| 3 长程游戏 | Starry Nightrider | Fable 5.2 | @ebbyamir `2120284261089673376` | 2026-11-10 | 未见原文 |
| 3 听音定位 | Beep Locator 起步提示 | 先 Opus 5.5，后 Fable 5.2 加功能 | simonwillison.net 检索引文 | 2026-11-09 | 片段 |
| 3 多代理证明 | 约 1000 agent，Lean FLT | Fable 5.2 早期快照 | Anthropic 工程博文检索 | 2026-11-09 窗口 | 未见原文 |
| 3 硬件长程 | USB-C 音箱 puck | Fable 5.2 | Anthropic electronics 博文检索 | 2026-11-09 窗口 | 片段 |
| 4 看图复建 | World Clock 62 面规范 | 两边各交一页 | christopherrbrown3/world-clock | 快照写 2026-11-10 | 规范片段 |
| 4 读图短板 | 盲写、间距图、回传截图 | Fable 5.2 | Zieminski 文内结论 | 2026-11-09 | 全文 |
| 4 引用 | 30 条主张，关搜索，低思考 | Carbon vs Argon | truestandard.ai | 2026-11-12 | 未见原文 |
| 4 超时 | 13 文件代码评审耗尽思考 | Gemini 4 Carbon high | r/GeminiAI `1xtbzvt` | 2026-11-11 | 未见原文 |
| 4 策略退化 | Snorkel 26 题 | Fable 5.2 vs 5.1 | snorkel.ai | 页面未打开 | 未见原文 |
| 5 审计流水线 | Go + HTMX + Tailwind + Templ | Carbon 写，Opus 5.5 审 | r/google_antigravity `1xszqoj` | 检索写约 2026-11-10 | 未见原文 |
| 5 分类器 | 网络与生物请求改路由 | Fable 5.2 → Opus | 支持文档检索 | 2026-11 | 未见原文 |

本次没有检索到可逐字核对的 SEC-bench 或漏洞验证提示词。检索返回过一段「安全审计系统提示」，那是工具生成的模板，不收录。

# 2. Claude Fable 5.2：能力实测提示词

## 2.1 SVG 与动效算术

### Karo Zieminski，2026-11-09

页面已用本机 HTTPS 打开：

https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts

`web_fetch` 对该域名返回 SSRF（解析到 `198.18.1.231`）。下面 8 条来自打开后的正文，标 `【原文全文】`。测试在 Claude 应用内、发布当日完成。作者写默认 effort 在 Claude 应用与 Claude Code 里是 Medium。没有插件，没有设计工具。客户是虚构的 Slow Signal（Aarhus，2027-06-12 至 06-14），避免套用真实品牌。

作者记录的结果，只转述页面原文中的观察：

- 海报：栏边 x 为 48、306、552。标题光学左移到 x 42。第一遍日期用了 em dash，第二遍改为 en dash。
- 字母：一条路径、两段 270° 弧、半径 60。16 px 仍能保持开口。第一遍半径标注压在笔画下。
- 图标：8 枚全部 1.5 描边、半像素网格、18 px 活区。Timeline 读成加号，Layers 偏重。模型自己的审计点了这两枚，仍然交了出去。
- 弹跳：1.1 s，触地 132 ms，压扁加宽约 28%、缩短约 30%。下落 `cubic-bezier(.33, 0, .67, .33)`，上升 `cubic-bezier(.33, .67, .67, 1)`。
- 间距图：间隙 3.5、10.5、17.5、24.5、31.5、38.5 px，每步加 7 px。公式写为 `Y = 126 × (T ÷ 6)²`。过冲曲线 `(.34, 1.56, .64, 1)`。第一遍下落曲线方向需要改正。
- 动态字：11 个字母，一个自定义属性，错开 45 ms。退出与进入共用同一错开。
- 条形图：每百分点 7 px。49.1→343.7，45.5→318.5，42.8→299.6，32.4→226.8。
- 七板交付字节合计 15,884，作者按约 3 字符 1 token 估计 5,295 output token、约 $0.21。该估计不含思考 token。

`【原文全文】` Prompt 01，海报：

```
Design a poster as one SVG, viewBox 0 0 600 800.

Client: Slow Signal, a festival of unhurried technology. Aarhus, 12 to 14 June 2027. Fictional. Do not reference any real brand.

Style: International Typographic Style.
Grid: 6 columns, 48 px outer margins, 12 px gutters. Every text block starts on a column edge.
Type: one grotesque family, two weights. One monospace for labels.
Color: dark ground, white type, exactly one accent color.
Shape: exactly one geometric shape. It may sit behind the type.
Banned: gradients, shadows, centered text, decorative lines.

Add a group with class "construction" that draws the columns and baselines so I can toggle it. Tell me the x position of every column edge.
```

`【原文全文】` Prompt 02，圆弧字母：

```
Design a monogram for Slow Signal as SVG.

Build the letter S from circular arcs only. One radius, one stroke weight, no freehand curves. It must be a single path.

Deliver, in one 600 x 400 SVG:
1. The mark large, with a "construction" group showing every circle, centre line and tangent point you used.
2. The same mark at 64, 32 and 16 px, reused with <use>, not redrawn.
3. One lockup: mark plus wordmark, reversed out of the accent color.
4. A clear space rule expressed in units of the radius.

Then list the path data and explain each arc flag.
```

`【原文全文】` Prompt 03，图标：

```
Draw 8 icons for a motion design tool: play, keyframe, ease, layers, timeline, loop, mask, export.

System rules, non negotiable:
- 24 x 24 grid, 3 px safe margin, live area 18 x 18.
- Stroke 1.5, round caps, round joins, no fills.
- Coordinates on whole or half pixels only.
- Corner radius 2 where a corner is rounded.
- Each icon in as few path commands as you can.

Show them at 3x with a "construction" overlay (grid, live area, 20 px keyline circle), then once more in a row at true size.

After drawing, audit your own set: which icon is optically heavier or lighter than the rest, and why?
```

`【原文全文】` Prompt 04，挤压拉伸。输出是 CSS，不是单张 SVG：

```
Animate a ball bouncing in place. CSS keyframes only, no JavaScript, no libraries.

- Loop: 1.1 s. Drop height: 150 px. Ball: 44 px.
- The ball must feel heavy. Use squash and stretch. Squash only while it touches the floor. Keep volume roughly constant.
- Add a contact shadow that tightens and darkens as the ball lands.
- Do not use ease, ease-in or ease-out keywords. Give every segment its own cubic-bezier and derive the values from physics, not taste. Show the derivation.
- Set transform-origin so the squash happens against the floor.
- Respect prefers-reduced-motion.

Then tell me what you cannot verify about this animation without watching it.
```

`【原文全文】` Prompt 05，间距图：

```
I cannot review motion from a description. Give me the animation on paper.

1. Spacing chart: draw the falling ball as 7 evenly timed ghost frames in one SVG, left to right. Label the pixel gap between each frame and the next. Draw the contact frame squashed.
2. Easing curves: plot every cubic-bezier you used as a real curve on a time by progress axis, with the four control values printed underneath. Put a dot on each plot that travels with that exact easing.
3. Compute every position. Do not eyeball any of them. Show the formula.
```

`【原文全文】` Prompt 06，动态字：

```
Build a kinetic type lockup in HTML and CSS only. The words: "make it move", on two lines.

- Each letter is its own inline-block. Each line is a mask (overflow hidden).
- Letters exit up and re-enter from below. Stagger 45 ms per letter using a CSS custom property, not eleven hand-written delays.
- Entry uses an overshoot curve. Exit uses an accelerating curve. Give me both as cubic-bezier and say why you chose each number.
- The resting state is the fully readable lockup. A screenshot at any random moment should usually be legible.
- Loop every 4.2 s. Respect prefers-reduced-motion.
- Type: heavy grotesque, tight tracking, line-height under 0.9. Pad the mask so descenders and the overshoot are not clipped.
```

`【原文全文】` Prompt 07，条形图：

```
Chart these four numbers as one SVG, 600 x 360.

FrontierCode 2.0, percent solved, reported by Anthropic:
Fable 5.2: 49.1. Opus 5.5: 45.5. GPT-6 Astra: 42.8. Fable 5.1: 32.4.

- Horizontal bars. Zero baseline. One linear scale. State the pixels per percentage point.
- Highlight one bar with the accent. Everything else neutral.
- Direct labels on the bars. No legend. Three gridlines at most.
- The title states the finding, not the topic.
- Add a source line and one line of honest caveat.
- No 3D, no gradients, no rounded bar ends, no truncated axis.

Print the width you computed for each bar so I can check your arithmetic.
```

`【原文全文】` Prompt 08，作者给出的可复用骨架：

```
ROLE: You are the designer. I am the art director. I will review the render, not your description of it.

FORMAT: One [SVG / HTML + CSS] file. viewBox or canvas: [W x H].

SYSTEM: Grid [columns, margins, gutters in px]. Type [families, weights, sizes]. Color [count, roles]. Stroke [weight, caps, joins].

MOTION (if any): Duration [ms]. Stagger [ms]. Easing as cubic-bezier only, with the reason for each value. Resting state must be the readable state. Respect prefers-reduced-motion.

BANNED: [gradients, shadows, centered text, easing keywords, anything you do not want].

PROOF: Add a group or layer with class "construction" showing the grid, keylines and any geometry you built on. For motion, add a spacing chart.

AUDIT: When you finish, list what you computed, what you estimated, and what you cannot verify without seeing it rendered or watching it play.

I will send back a screenshot. Expect exactly one correction pass.
```

页面上的能力结论，原句要点：模型写坐标时看不见渲染；数字约束一次就算对；词宽、标点、光学重量要等截图。它能检查静止帧，不能检查帧与帧之间的节奏。

### Simon Willison，鹈鹕骑车，2026-11-09

博文已打开：https://simonwillison.net/2026/Nov/9/llm-anthropic/
发布时间：2026-11-09 11:58 pm（页面未标时区）。
Gist 已整份下载：https://gist.github.com/simonw/bcd1a1bf38b929b0bbbae2e38b808e97
模型行：`anthropic/claude-fable-5-2`。

`【原文全文】` 五档使用同一句：

```
Generate an SVG of a pelican riding a bicycle
```

博文中的调用形式：

```
llm -m claude-fable-5.2 "Generate an SVG of a pelican riding a bicycle"
```

Gist 记录的选项与用量：

| effort | 输入 | 输出 | 其中思考 | 耗时 | 是否交出 SVG |
|---|---:|---:|---:|---|---|
| low | 27 | 1,214 | 0 | 14.024 s | 是 |
| medium | 27 | 1,386 | 0 | 15.030 s | 是 |
| high | 27 | 5,277 | 2,217 | 58.997 s | 是 |
| xhigh | 27 | 32,966 | 27,175 | 5 m 54 s | 是。博文称这是五档里最好的一张 |
| max | 27 | 128,000 | 128,000 | 22 m 1 s | 否。`## Response` 为空 |

max 的思考轨迹停在布局与喙的形状上，没有进入 SVG 正文。博文写：Fable 5 与 Fable 5.1 的 max 曾经交过图；这次与作者先前在 Opus 5.5 上看到的现象相同。价格在博文中写为 $8 / $40 per million。

X 帖本身本次没有打开。博文没有给出该实验的 X status 或赞数。

### r/singularity `1xsuixt`

`【原文片段（缺省部分已标出）】`。原帖未打开。检索写两边用同一提示，结尾是 “go all out”。检索另一次把整句写成 “Generate an SVG of a pelican riding a bicycle. Go all out.”，这句没有第二来源，不当作全文。

检索摘要中的数字：Fable 5.2 low 为 594 行、40 KB、14 min 12 s、输出 51,958、思考 23,592、约 $3.71。Opus 5.5 med 为 1,085 行、68 KB、29 min 30 s、输出 116,722、思考 70,250、约 $3.87。摘要称 Fable low 没有明显错误；Opus 翅膀有两套、喙压在眼睛上、围巾穿过身体。原帖未打开，这些数字只作索引。

### MiaAI-Lab，2026-11-09

X 帖 https://x.com/MiaAI_lab/status/2119930229661503893 未打开。

`【原文片段（缺省部分已标出）】`。检索摘要对总规则的转述是：

```
I asked Claude Fable 5.2 to create 100 HTML files
Rules were simple:
- look stunning
- zero repetitive designs
- go full creative mode
```

本次打开的仓库 README 没有 “look stunning” 这句。README 只说明画廊包含 76 份研究及原始提示，文件 076–078 不在集合里，并且写明不要发明研究或提示。因此上面三行只属于 X 帖索引，不属于仓库。

已整文件下载并核对的单题提示（`raw.githubusercontent.com`）：

- `037-pendulum-wave.txt`，8,174 字符。下面 PROMPT 段为 `【原文全文】`。同文件还有 DESCRIPTION、VISUAL TECHNIQUES、INTERACTION MODEL，不在这段里。

```
A physically exact simulation of the classic pendulum-wave demonstration: fifteen pendulums of carefully graded lengths hang in a row from a wooden frame; released together they drift out of phase into travelling waves, apparent chaos, then split into two and three interleaved groups, and after exactly sixty seconds swing back into perfect unison. Each bob chimes softly as it passes the centre. Concept: order, disorder and return, produced by nothing but arithmetic.

Mood: calm, precise, a physics cabinet in a sunlit hall. Palette: plaster cream #F2ECDF background, dark walnut/iron charcoal #2A2622 for frame and type, brass #B8893A for the bobs (with highlight #E3C27A and shadow #7A5A22), and cool slate blue #6B7F8E for shadows, traces and secondary type. Light page.

Physics: pendulum i (i = 0…14) completes (51 + i) oscillations in 60 seconds, so its period is 60 / (51 + i) s and its length is g·(T/2π)²: draw the lengths true to scale relative to one another. Angle θ_i(t) = θ0 · cos(2π t / T_i), exact and analytic, so the 60-second return is perfect and the page can run forever without drift; time derives from a clock that can be paused and scrubbed.

Rendering (Canvas 2D, crisp at high DPI): two coordinated views of the same system. (1) Front view, large, drawn in a shallow oblique projection so the swing towards and away from the viewer reads as a sideways sweep with correct depth ordering: the frame's top beam with fifteen suspension points, a centimetre scale engraved on the right post, fine strings, brass spherical bobs with a specular highlight and soft contact-less shadows cast on the back wall (offset, blurred, slate), the bobs' lengths forming a graceful curve; motion blur trails behind fast bobs. (2) Top/side "wave" view beneath: looking down the row so the bobs' displacements read as a single undulating line of dots, with a thin spline through them and a fading history, which is where the wave patterns become obvious. A circular 60-second dial at the side shows the cycle with engraved marks at the famous moments: 0 unison, 15 s, 20 s (three groups), 30 s (two groups in antiphase), 40 s, 45 s, 60 s unison; a hand sweeps it, and the current pattern is named in small type ("unison", "travelling wave", "five groups", "four groups", "three groups", "alternating", "apparent chaos", "returning"), together with the live fraction of a swing by which each bob leads its neighbour (t/60); the engraved marks are also buttons that jump the clock to that moment.

Sound (off until the viewer turns it on with a designed brass toggle): each pendulum is assigned a note of a pentatonic scale across two octaves (longest = lowest); each time a bob crosses the centre line a soft struck-bar tone plays (sine + a little inharmonic partial, 1.2 s exponential decay, slight stereo pan by position). The result: unison chords at the start, cascading arpeggios during the waves, rhythmic alternation at 30 s, a great chord on the return.

Signature moment: the return at 60 seconds: all fifteen bobs sweep back into a single line, the chord lands, the dial flashes softly, and a thin brass ring pulses outward from the frame; then it begins again. The first three seconds: the bobs are held to one side by a drawn release bar (a hinged iron rod with brass knobs across the strings), which swings up and over the beam on load, and they begin in perfect unison.

Interaction: play/pause; a scrubber along the bottom styled as a brass rule from 0 to 60 s that the viewer can drag to any moment (the system jumps there exactly); speed ×½, ×1, ×2, ×4; drag the release bar back down onto the strings (or press R, or the "release again" key) to gather the bobs and reset; while one bob is soloed only its chime sounds; a control for number of pendulums (9, 15, 21) which rebuilds the frame; click any bob to solo-highlight it and see its period and length in a small engraved tooltip ("No. 8 · 58 swings per minute · T 1.034 s · 26.6 cm"; pendulums are numbered from 1, longest first, and each suspension point on the beam is also a small focusable button). Keyboard: space, arrows scrub.

Typography: restrained scientific-instrument style: title in small tracked serif capitals (Baskerville/Georgia) on a brass plaque shape; captions in italic serif; numerals tabular. A short paragraph in a narrow column explains the trick in three sentences. Responsive: on phones the front view fills the width (strings shorter, bobs smaller), wave view beneath, dial reduced to a slim arc. Reduced motion: runs at ×½ with no blur trails and no pulse; the scrubber remains.
```

- `010-op-art-pulse.txt`，9,850 字符。标题是 “Six Rooms of Optical Pressure”。`【原文全文】` 的任务句：

```
A CSS-only (no JavaScript at all) gallery of six kinetic op-art works in strict black and white, in the lineage of 1960s perceptual abstraction (bulging grids, moire, vibrating stripes), but new compositions rather than copies of any existing painting. Concept: the eye does the animating; CSS only nudges it.
```

其后 PROMPT 段还规定纯黑白、六间全屏房间、scroll-snap、difference 混合、以及 Slow Interference、Bulge、Tremor、Current、Fold、Afterimage 六件的几何。整段已下载。报告不把后半改写成缩写版；入库若采用，应直接读该文件。

- `013-iron-filings.txt` 首句 `【原文片段】`：

```
A desk toy: a sheet of white paper dusted with iron filings, with magnets you slide around underneath.
```

- `042-dance-of-venus.txt` 首句 `【原文片段】`：

```
A data visualization of orbital resonance: draw a straight line between Earth and Venus every few days as they circle the Sun, and over eight years the lines weave a five-petalled rose.
```

同段写明只用这些周期（天）与半径（AU）：Mercury 87.97 / 0.387，Venus 224.70 / 0.723，Earth 365.26 / 1.000，Mars 686.98 / 1.524，Jupiter 4,332.6 / 5.203，Saturn 10,759 / 9.537。并写 13 × 224.70 对 8 × 365.26。

- `033-lava-lamp-1971.txt` 首句 `【原文片段】`：

```
An ambient page: one tall lava lamp glowing in a 1971 living room, its wax rendered with a hand-written WebGL fragment shader as smooth metaballs that rise, neck, pinch off, cool and sink.
```

仓库目录本次列出 001–059 以及更后的成对 html/txt。没有逐份下载其余提示。X 帖赞数本次检索没有给出数字。

### Kevin Ngo，2026-11-12 / 11-13

画作帖：https://x.com/kevin_t_ngo/status/2120722200001122321
提示帖：https://x.com/kevin_t_ngo/status/2121303379196662115
两帖都未打开。

热度只来自一次检索摘要：画作帖 2,638 likes、159 reposts、57 replies，书签超过 1,000。另一次摘要写 2,638–2,649，范围不一致，采用写明 2,638 的那次，并保留冲突。提示帖赞数本次没有数字。

`【原文片段（缺省部分已标出）】`。两次检索摘录重叠、后一次更长。重叠部分：

```
Analyze [/Users/kevin/Documents/art] for hands and self-portraits.

I want you to choose up to 3 to 5 dry art tools (the best combination), or make up your own tools and colors.

It must feel very HUMAN-DRAWN, not digital at all. Not like an SVG. u can spin up subagents but they all must be the same llm model as u. also try not to use headless chrome browser cuz it hurts my laptops memory

I want you to create one masterpiece artwork, drawn with Javascript only. 16:9. Very detailed. Put your heart and soul and energy into it.

It needs to evoke these human emotions, but DO NOT actually have anything from this. dont draw ppl:
```

后一次摘要在投资者故事之后多出金房间与 “Art drawn with javascript, by claude fable 5.2” 字幕。因为两次长度不同且原帖未打开，金房间之后不合并进「全文」。本地路径是帖文索引里的原文，不是本机路径。

这条提示明确要求不像 SVG、用 JavaScript、可开同模型子代理。它测的是长程绘图代码，不是纯内联 SVG 合同。

### 其他 11 月 SVG / CSS 帖

- r/ClaudeAI `1xs0dct`（“Fable 5.2 just landed”）：检索写讨论了 Max effort 过思考，帖内没有具体 SVG 提示。`【仅见效果描述，未检索到原文】`。
- @BreejeAnadkat，2026-11-10：检索写他先在 Figma 画等轴测，再让 Fable 5.2 加运动，并自称为 cheating。提示原文没有被检索到。status 本次没有消解。

## 2.2 长程编码与单文件工程

### Saltline，@felixrieseberg，2026-11-09

主帖索引：https://x.com/felixrieseberg/status/2119925633564463609
提示出现在后续帖索引：https://x.com/felixrieseberg/status/2119927483994907024
两帖未打开。

`【原文片段（缺省部分已标出）】`。下面这一句在三次检索摘要里用词一致：

```
You know, you should also build me a FPS. Insanely detailed quality pls, something that looks visually like it can keep up with AAA. Make it small in scope (like a tiny level) but otherwise impressive photorealistic graphics
```

同摘要写：作者称 prompt engineering 的时代基本结束；`claude.md` 为空；“also” 表示同一会话里先有更小的游戏。运行约 8 小时、约 $550、约 2.7M 输出 token、约 445M 输入 token（大量缓存）。单文件 HTML，程序化模型与声音。玩法摘要是雨中集装箱港，切断三处 uplink，躲避 Gulls 与 Hounds。公开版后来有大约 2 小时人工打磨。赞数索引从约 13,212 到 14.6k，快照不一致。

### Tromsø 北极光，@MichaelGannotti，2026-11-09

https://x.com/MichaelGannotti/status/2119922137011982652 未打开。

`【原文片段（缺省部分已标出）】`。检索给出的整句是：

```
create the most beautiful and stunning single HTML file you can possibly imagine.
```

摘要：约 12.6 分钟、数万思考 token；Canvas / WebGL；坐标 69°39′N 18°57′E；页标题 “Aurora — a night sky imagined in real time”。赞数本次没有数字。演示页 https://www.smfclearinghouse.com/blog/2026-11-09-fable-5.2-aurora-one-shot 本机连接被重置，未打开。

### Starry Nightrider，@ebbyamir，2026-11-10

https://x.com/ebbyamir/status/2120284261089673376 未打开。

`【仅见效果描述，未检索到原文】`。检索写作者没有公开提示；被问耗时时回答 6–8 小时，同时在做别的事，是迭代而不是单次生成。另一条 “let me walk inside The Starry Night” 属于 @RenativeStudio，不是这条。主体是梵高，本报告只记手法：短句加长时间迭代，可以做出可玩的 Three.js。不进入 SVG 题库。

检索工具随后提供的长篇 “Starry Nightrider” 模板是工具起草的，不是原帖。

### Beep Locator，2026-11-09

博文 URL：https://simonwillison.net/2026/Nov/9/mysterious-beeps/
本次没有打开该页。下面来自两次一致的检索引文，标 `【原文片段（缺省部分已标出）】`。

起步提示发给 Claude Code，对着空仓库，模型是 Opus 5.5。Fable 5.2 发布后，作者在笔记本上继续加功能。

```
Write out a problem.md file describing the problem we want to solve
There is a device beeping in a room and I cannot find it
I want to set up several devices - laptops, phones, iPads - around the room all listening at the same time and have them help triangulate where the beep comes from
There needs to be a Python web app which coordinates it all - one device shows a web page for the app, other devices join a URL which turns them into listeners - all via browser WebAudio and WebSockets back to the Python server app
Ideally I wouldn't need to manually input the relative locations of the devices - it would be amazing if they could play sounds to each other in order to locate each other in 2D space - is that even possible though?
```

检索列出的后续短句，仍是片段：拖拽 “rough mode”、用拍手测试、符号带 HH:MM:SS、日志可回放、标记 “This is the mystery beep”、重新摆放设备、建议下一只听筒的位置。摘要称定位到约 40 cm，来源是需要换电池的一氧化碳探测器。仓库索引为 https://github.com/simonw/beep-locator ，未打开。

### USB-C 音箱与 Lean

Anthropic electronics 页未打开。`【原文片段】`，检索两次给出的 brief 是：

```
a puck that plugs into a computer over USB-C and includes microphones and a speaker, supporting Bluetooth with a PCB antenna.
```

摘要称还有语音助手 hub 与掌上虚拟宠物两份同样短的 brief，以及 “continue”“clean up the schematic”。Diode 按文件装配，音箱原型电路没有改。PCB Gym 69% 对先前 Fable 5 的 25% 是检索转述的厂商数字，页面未打开。

Fermat 形式化：`【仅见效果描述，未检索到原文】`。检索描述输入包为 60 条目标陈述、古典路线的一句话提纲（原句未引用）、相关定义、47 条已证引理、Lean / Mathlib、Git、共享 Postgres、无网络。约 1,000 个代理，28.7 小时。一句话提纲的措辞没有公开。全息对偶两题同样没有公开提示原文。

### 社区长程模板

检索返回过 Claude Code「agent swarm + 截图回路」模板，以及 “This codebase is yours” 等句子。页面未打开，且行文像工具汇编。不收为 2026-11 的实测原文。可核对的自我验证写法，仍是 Zieminski Prompt 08 的 AUDIT 与「回传一张截图」。

## 2.3 视觉与 CAD

World Clock 见第 4 节对照。Fable 5.2 页路径索引为 `versions/fable-5.2.html`。规范要求内联 SVG、62 个可识别表款、浏览器时区。表款含大量在售品牌，不适合作为本库题面。

Chartography 73.4% 与 BenchCAD 2.1 出现在检索摘要里。公开样例的 TASK.md 本次没有下载。不能把检索工具起草的「仪表盘重建提示」写成实测原文。

## 2.4 过思考、盲写与分类器

已核对的探针就是鹈鹕车 max：128,000 思考 token，响应为空。Zieminski 文把盲写写成：栏边、半径、条宽、帧距是算术，一次即对；词宽、破折号、图标光学重量要看渲染。

分类器：`【仅见效果描述，未检索到原文】`。检索转述网络安全类改路由到 Opus 4.8，生物与化学类以及部分加速器内核类改路由到 Opus 5，要求把内部思考写进可见回复时往往直接拒绝。支持页未打开。检索附带的「触发句 / 安全改写」是工具举例，不收。

Snorkel：页面未打开。检索称 26 题 pass@1 从 53.1% 到 71.4%。两道 5.1 稳定通过的题，5.2 每次都失败；另一道从 5/5 降到 2/5。剩余失败里错误策略约 35%、错误推断约 28%、读错任务约 23%。题面与提示没有公开。`【仅见效果描述，未检索到原文】`。

# 3. Google Gemini 4 Carbon：能力实测提示词

## 3.1 空间、3D 与机构

### 鹈鹕骑车，2026-11-10

博文已打开：https://simonwillison.net/2026/Nov/10/llm-gemini/
发布时间：2026-11-10 8:09 pm（页面未标时区）。
Gist 已整份下载：https://gist.github.com/simonw/e5bf860633fc12e8f926f305c4c3190c
模型行：`gemini/gemini-4-carbon`，解析为 `gemini-4-carbon`。

`【原文全文】`：

```
Generate an SVG of a pelican riding a bicycle
```

| thinking_level | 输入 | 输出合计 | 候选 | 思考 | 耗时 | SVG |
|---|---:|---:|---:|---:|---|---|
| low | 40 | 9,153 | 9,153 | 用量 JSON 未单列 thoughts | 1 m 34 s | 有 |
| medium（博文写默认） | 40 | 11,020 | 8,304 | 2,716 | 1 m 53 s | 有 |
| high | 40 | 20,305 | 10,813 | 9,492 | 4 m 11 s | 有 |

三档都交了图。博文评语是 Gemini 的鹈鹕图早就很好。X 帖 https://x.com/simonw/status/2120259652093112614 未打开，本次没有核到赞数，也没有核到 “still pretty cute” 这句是否就是该 status 的正文。博文没有这句。

### Yonkers

见第 4 节。Carbon 使用的是博文里拼写已改正的那一句，另加：

`【原文全文】`

```
build that into a standalone HTML file
```

目的是去掉外部依赖。博文链到 `yonkers-mech-standalone.html`。本次没有下载该 HTML。

### ORRERY 与 TIDEFORGE，@kimmonismus，2026-11-10

https://x.com/kimmonismus/status/2120186125591646250
https://x.com/kimmonismus/status/2120186202271945137
https://x.com/alsamahi/status/2120442135862554731

三帖未打开。`【仅见效果描述，未检索到原文】`。

检索一致的描述：13 条 coding brief，覆盖 3D、网站和应用；没有一条一次成功，作者有迭代。ORRERY 是一个控件同时驱动齿轮和折叠花瓣，反转也工作；一条后续提示改进了取景，后续提示的句子没有被引用。TIDEFORGE 被描述为一次 brief、没有后续，粒子数为 1,048,576。brief 原文没有出现。检索工具起草的 Three.js / WebGPU 长提示不收录。赞数本次没有数字。

### Analyse Spectrale，@thebuggeddev，2026-11-10

`【仅见效果描述，未检索到原文】`。检索称单张参考图，92 个黄铜、铜与硼硅玻璃零件，Beer-Lambert 与 Rankine 涡，轴向爆炸图，模型自己设计的 Bento UI，以及 60 FPS SVG 瓦特指示器。status 在不同摘要里写成 `2120503246263603665`、`2120502848580403224`，与前序报告里的另外两个 ID 都未打开，不能判定哪条是主帖。

### Glassy Jenga / Vitrail，@AI_Andrew

帖 https://x.com/AI_Andrew/status/2120243379388760176 未打开。玩法页与仓库的检索描述是染色玻璃积木、WebGPU、MuJoCo、敲击发声、倒塌碎裂。

本次打开了 https://raw.githubusercontent.com/AndrewVoirol/tumbling-blocks-game/main/AGENTS.md 的开头。那是代理运行手册（测试命令与不变量），不是用户当初的提示。`【仅见效果描述，未检索到原文】`。检索里的 “What would Jenga feel like…” 被标成 high-level idea，不是帖文引文。

### RADIAL NINE，2026-10-31

@danieldwalton `2116649200339599487` 未打开。主帖 ID 仍未确认。

`【仅见效果描述，未检索到原文】`。检索把长提示标成 “reconstructed”。重建文本不收录。检索声称原题要求的、且多次重复的技术点是：九缸、每 40°、一号缸主连杆、其余八根副连杆接在主连杆大端、发火序 1-3-5-7-9-2-4-6-8、四冲程每两转点一次。这些点在打开原帖之前，只作为索引主张。

检索对结果的转述：四模型发火序都对；Carbon 最干净；Opus 5.5 多画了进气管与排气；Argon 更有气氛；GPT-6.1 Sol 火焰又小又暗。检索明确写 Fable 5.2 不在这一组里。

### 厂商演示

Pelican Quest 的说明出现在已打开的 Willison 博文里，是 Google 对结果的描述，不是提示词：

```
Using Google Antigravity’s /swarm feature, Carbon built an open-world 3D game where you explore Google’s Mountain View campus as a pelican riding a GBike — coordinating subagents to model 3D assets in Blender from Omni and Nano Banana references, build the browser game in Three.js with WebGL shaders, and pair procedural Web Audio sound effects with Lyria music.
```

埃菲尔铁塔施工、Platform 37（检索称 7 份规划 PDF、206 个视图、约 10 个过夜循环、约 906K 三角形）、1780 Stein 击弦机：检索都写 “a single prompt”，句子本身没有公开。`【仅见效果描述，未检索到原文】`。

针织纤维，@Google https://x.com/Google/status/2120279087314837642 未打开。`【原文片段】`，检索引用的推文是作品说明，不是提示：

```
Complex materials research is much easier to grasp when you can interact with the underlying math 🧶
From a 2026 study on knitted textile mechanics, Gemini 4 Carbon built an interactive 3D visualizer in @Antigravity tracking 110 individual fibers under tension.
```

### AI Fire，2026-11-12

https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests
本机连接被重置，页面未打开。

公寓、帆船、英雄射击的长提示在两次检索里详略不一致，后一次还以完整代码块出现。按「未打开页面则不升格为全文」处理。三份都是 `【仅见效果描述，未检索到原文】`。

结果侧，两次摘要一致的只有这些观察：

- 公寓：房间连通接近参考；Jerry 与 Kramer 的门开向反了；走廊几何在真实建筑里不成立。使用了参考图。
- 帆船水面：Carbon 的水更弱，纹理重复；Fable 更完整。提示句子没有稳定引文。
- 英雄射击：Fable 更可玩；Carbon 有滑步，没有完全可玩。提示句子没有稳定引文。

检索工具起草的 “Aether Vanguard” 长提示不收录。

## 3.2 `/swarm` 与多日工程

已核对的公开文本只有上一节 Pelican Quest 那段结果描述，外加博文里的跟随句 “build that into a standalone HTML file”。

检索里的过夜 `/swarm` 模板（STATE.md、至少 10 轮、冷评审）来自第三方文章摘要，页面未打开，且包含工具补全的口吻。不收为 Google 或 X 用户的实测原文。

可记录的工作流事实，全部是效果描述：Platform 37 约 10 个过夜循环；钢琴与埃菲尔铁塔用了协调器、并行工人和校验；Carbon 被放在更难的角色上。提示模板本身缺失。

## 3.3 代码审计与工作流

r/google_antigravity `1xszqoj` 未打开。`【仅见效果描述，未检索到原文】`。

检索摘要：无人值守流水线，技术栈 Go、HTMX、Tailwind、Templ。每一相有书面合同，Carbon 在 medium 或 high 上跑，Claude Opus 5.5 high 做审计。4 个 Carbon 相都一次落地。high 的数据模型相约 950 行代码加 2k 行测试，67 分钟，1.15M token，审计改了 2 行、1 条 low。medium 三相的审计改动中位数是 0 行。合同与审计提示没有贴出。

这不能写成「Carbon 的安全审计提示」。审计模型是 Opus 5.5。Carbon 在这里是实现模型。

SEC-bench Pro 88.2% 等数字来自检索对模型卡的转述。没有配套的公开审计提示。

## 3.4 门轴、引用与超时

门轴错误见 AI Fire 公寓。提示未核对。

TrueStandard，2026-11-12，https://truestandard.ai/gemini-hallucination-rate 未打开。`【仅见效果描述，未检索到原文】`。摘要：低思考、关闭网页搜索、30 条主张（一半真、一半编造），与 Argon 对照。Carbon 编造引用 ID 为 8/135（5.9%），Argon 为 10/131（7.6%），p = 0.63。把「真实 ID 配错论文」算进去是 15/135 对 20/131，p = 0.37。题目原文没有给出。

r/GeminiAI `1xtbzvt`，检索写 2026-11-11。`【仅见效果描述，未检索到原文】`。Carbon high 审阅 13 个文件、约 682 KB、初始输入约 252,465 token。44 分 54 秒，思考约 262,141 token，可见回复 3 token，然后 MAX_TOKENS，审查结果 0 字节。提示正文没有贴出。这是和 Fable max 空 SVG 同类的边界：思考额度吃掉可见输出。输入规模不同，不能当成同一题。

# 4. 双模型同题对照

只列入本次能指向同一题面的实验。

| 题面 | 谁跑了 | Fable 5.2 | Gemini 4 Carbon | 提示完整度 |
|---|---|---|---|---|
| `Generate an SVG of a pelican riding a bicycle` | Willison，11-09 与 11-10 | 五档。xhigh 被博文称为最好。max 空输出，128k 全是思考 | 低、中、高三档都交了 SVG。高档思考 9,492，仍有 10,813 候选 token | 全文 |
| Yonkers 机甲踩纽约 | Willison，11-10 | Medium。提示含 `átomos`。页面写模型把它当成 stomps。有站起、踩踏、高度读数 | 博文用已改成 `stomps` 的句子，再要求独立 HTML | 两句都是全文，但不是逐字同一字符串 |
| World Clock 62 面 | 仓库各一页 | `versions/fable-5.2.html`。检索称 136 城、两层 SVG | `versions/gemini-4-carbon.html`。检索称 174 城、太阳子午线 | 规范是片段。两边的聊天提示没有单独贴出 |
| AI Fire 三测 | 2026-11-12 文章索引 | 水面与英雄射击被说成更好、更可玩 | 公寓连通更好，门轴与走廊错；水面更弱；射击有滑步 | 未见原文 |
| RADIAL NINE | 2026-10-31 | 检索写明未参加 | 检索称画面最干净，发火序正确 | 未见原文 |
| 鹈鹕 `/swarm` 游戏 | Google 演示 | 无同题 | 结果描述已出现在 Willison 博文 | 提示未见 |

Yonkers 的两句原文如下。

Fable，已打开 https://simonwillison.net/2026/Nov/10/yonkers-rises/ ，发布 2026-11-10 3:53 am。`【原文全文】`：

```
Make a three js animation where yonkers stands up as a big mech (cool stand up motion) and átomos around manhattan and queens and Brooklyn, use openstreetmap mapping data
```

Carbon，已打开的 11 月 10 日 Gemini 博文。`【原文全文】`：

```
Make a three js animation where yonkers stands up as a big mech (cool stand up motion) and stomps around manhattan and queens and Brooklyn, use openstreetmap mapping data
```

页面写 Fable 正确处理了手机键盘造成的 `átomos`。博文没有写 Carbon 也收到了错字。不能把「两边都通过了错字测试」写成已核对事实。空间表现只核对到这些：两边都用 OSM 做出行走；Fable 页描述了站起、踩踏、陆地/涉水状态、计数器和高度。Carbon 的差异没有在已打开博文里被量化，只确认生成了可录屏的独立 HTML。

World Clock 已打开的规范片段（`docs/model-and-contributor-guide.md`）：

- 新模型必须新开一页，不得改旧页。
- 表盘用内联 SVG。不用表盘栅格图、截图、精灵图、服务端渲染或外部渲染 API。
- 从 `file://`、GitHub Pages 和静态服务器都能开。
- 保留城市增删、全体洗牌、单钟洗牌、按当前 UTC 偏移自西向东排序。
- 先对照实物照片再画。

README 已打开的句子是 “One brief. Thirty-two perspectives.” 以及 “Give different AI models the same specification: build a complete world clock with 62 recognizable timepieces.” 这是仓库说明，不是一条聊天记录。

# 5. 转成 llm_iq_dashboard 用例的启示

本库若维持「单文件、内联 SVG、无脚本、无外链、首尾帧可测」的合同，11 月这些提示里能直接改写的很少。能改写的原因是题面本身有可计算的不变量。

适合作为纯内联 SVG 或纯 CSS 合同的手法：

- Zieminski 01、02、03、05、07 已经是单份 SVG，并且要求印出可核对的数：栏边 x、半径、路径弧旗、像素间隙、每百分点像素、每根条的宽度。判分可以查这些数，不必看审美。
- Prompt 05 把时间变成几何。弹跳类题目若禁止脚本，应要求 7 个鬼影帧和单调增加的间隙，而不是要求模型「看起来有重量」。
- Prompt 03 的光学审计适合做成二阶段：第一阶段只交 SVG；第二阶段把渲染图发回，检查它是否改对自己点名的重图标。第一阶段单独入库，才能测盲写。
- Prompt 04 与 06 是 CSS。若题库允许 `<style>` 与 `@keyframes`，可以测 `prefers-reduced-motion`、禁止 `ease` 关键字、错开必须来自自定义属性。重量感仍然只能人工看。
- 金星舞步的数字合同可以留下：只用帖中那 12 个轨道数，画弦，8 年接近五瓣。页面里的声音、拖动和十八世纪装饰不进入合同。原题是 Canvas，改成 SVG 折线后才符合本库。
- 欧普第一间的合同可以留下：两层同心环、difference、中心漂移。原文件禁止 JavaScript，这一点与本库一致。其余五间和滚动画廊是另一题。

明确不入库：

- 鹈鹕骑车。本库已有，且 max 档测的是额度耗尽，不是图形新能力。
- Yonkers、Saltline、北极光、Starry Nightrider、ORRERY、Analyse Spectrale、Vitrail、厂商 `/swarm`。它们依赖 Three.js、地图、音频或过夜工具。
- Starry Nightrider 与 “walk inside The Starry Night”。主体是历史人物。
- World Clock 的 62 个表款。规范本身是好的 SVG 合同，题面是在售品牌。
- Seinfeld 公寓。角色与布景受保护，且原题要用参考图和 Three.js。门轴错误可以作为「空间题必须检查开向」的评分项，不能把剧集场景当题。
- Kevin Ngo。提示要求不要像 SVG，并用本地图库和子代理。
- RADIAL NINE。机械约束清楚，但本次没有打开原提示。不用检索工具的重建文本出题。
- Saltline 与 Gannotti 的单句。它们测的是代理时长和品味，没有可自动判的几何真值。
- 任何只在检索工具回复里出现、作者页面未包含的「推荐提示」。

工程化时保留的提示结构，对应 Zieminski 08：角色与验收者分开、一张画布、网格用像素、运动只许 cubic-bezier、建设层、结束时列出算了什么和看不见什么。第二轮只接受一张截图。这样测的是盲写加一次视觉修正，而不是一次对话里的品味。

# 6. 检索轨迹与证据边界

## 6.1 次数

- `web_search`：81 轮。其中 10 轮传输失败，没有正文。71 轮有摘要。
- `web_fetch`：7 轮，全部 SSRF。域名解析到 `198.18.0.0/15`。包括 productwithattitude.com、simonwillison.net、x.com、r.jina.ai、gist.githubusercontent.com、raw.githubusercontent.com。
- 本机 HTTPS 随后打开了 `web_fetch` 打不开的一部分公开页：Zieminski 全文、Willison 三篇、两份 pelican Gist、Mia README 与 5 个 txt、World Clock README 与 contributor guide 开头、Vitrail `AGENTS.md` 开头。
- aifire.co、da7tech.com、smfclearinghouse.com、snorkel.ai、truestandard.ai 本机连接被重置。
- X、Reddit、HN、YouTube、Google 博客、Anthropic 博客都没有打开原文。

## 6.2 传输失败的 10 轮

1. `"create the most beautiful and stunning single HTML file" Gannotti Fable aurora`
2. `Gemini 4 Carbon Go HTMX Tailwind one shot audit prompt reddit`（稍后换查询成功）
3. `"build that into a standalone HTML file" Yonkers Gemini Carbon simonwillison`
4. `marcthecreatorr sailing ship Fable 5.2 full prompt text water November 9 2026`
5. `site:aifire.co Gemini 4 Carbon apartment door hallway hero shooter prompt text`
6. 第一次 `"Design a puck that plugs into a computer over USB-C" Fable 5.2 Anthropic electronics`
7. `world-clock model-and-contributor-guide "62" faces one brief Fable Carbon raw`
8. `danieldwalton RADIAL NINE "master rod" exact prompt quote`
9. 第一次 `"Fermat" Fable 5.2 "one-sentence sketch" Lean agents prompt`
10. `"The Gemini 4 Carbon pelican is still pretty cute" simonw likes`

第 6 与第 9 条后来换查询得到了摘要。失败轮没有被当成证据。

## 6.3 有摘要的查询

设计与 SVG：Zieminski 总查询；`"Slow Signal" "spacing chart"`；Willison Fable pelican；Willison Carbon pelican；gist 页查询；`thinking_effort` max；r/ClaudeAI `1xs0dct`；r/ClaudeAI 空输出；r/singularity `1xsuixt`；`"go all out"`；BreejeAnadkat；Kevin 提示帖；Kevin 赞数；Mia master 与 pendulum；Mia “100 HTML files”；Mia GitHub “look stunning”。

空间与 3D：Yonkers 总查询；`"yonkers stands up" átomos`；ORRERY 两次；TIDEFORGE；Analyse Spectrale 两次；Glassy Jenga 两次；RADIAL NINE 两次（一次失败后另有成功摘要）；AI Fire 公寓；帆船；英雄射击；Pelican Quest / 埃菲尔 / Platform 37 / 钢琴 / 纤维总查询；Platform 37 “206”；埃菲尔单查；钢琴单查；纤维推文两次；World Clock 查询（页面后来用 raw 打开）。

长程与安全：Saltline 三次；Gannotti 一次成功；Starry Nightrider；`"let me walk inside"`；Beep Locator 两次；USB-C puck 的成功轮；Fermat 的成功轮；Snorkel；分类器改路由；Go/HTMX Reddit 的成功轮；TrueStandard；45 分钟 262k；Chartography / BenchCAD；`/swarm` 模板；Fable swarm 模板。

两轮查询返回了工具自己画的鹈鹕 SVG，没有返回博文正文：`"Generate an SVG of a pelican riding a bicycle" site:simonwillison.net`，以及 cute pelican 的 status 查询。那两段 SVG 不是 Willison 的模型输出，已忽略。

## 6.4 未打开或未恢复全文的原帖

- 全部 X status。包括 Saltline、Mia、Kevin、kimmonismus、ebbyamir、Gannotti、thebuggeddev、AI_Andrew、olezhavich、danieldwalton、Google 纤维帖、simonw 的 Carbon 鹈鹕帖。
- ORRERY 的 13 条 brief，以及改机位的那条跟帖。
- TIDEFORGE 的 brief。
- Analyse Spectrale 的主提示与参考图。status 有多个候选，未消解。
- Glassy Jenga 的用户提示。已打开的是代理手册开头。
- RADIAL NINE 全文。检索中的长文是重建。
- AI Fire 三道题的提示。结果描述采用，提示不采用。
- Starry Nightrider 的提示。作者索引称没有公开。
- 厂商四则 `/swarm` 演示的提示。
- Snorkel 26 题、TrueStandard 30 条主张、Reddit 大文件评审、Go/HTMX 各相合同。
- BenchCAD 的 TASK.md。
- Fermat 的一句话提纲与 60 条陈述。
- Fable 分类器的真实触发对话。

## 6.5 已打开、可以当原文用的材料

- Zieminski 文章全文，Prompt 01–08。
- Willison 2026-11-09 llm-anthropic、2026-11-10 llm-gemini、2026-11-10 Yonkers Rises。
- 两份 pelican Gist 的提示、effort / thinking 选项、token 与空响应。
- Mia `037` 的 PROMPT 段全文；`010`、`013`、`042`、`033` 整文件已下载，报告里 `010` 只录任务句，后三份只录首句。
- World Clock README 与 contributor guide 的开头规范。

Saltline、Gannotti、Kevin、USB-C puck、Beep Locator、Google 纤维推文，只在多源摘要里出现了稳定引文。它们标为片段，不标全文。
