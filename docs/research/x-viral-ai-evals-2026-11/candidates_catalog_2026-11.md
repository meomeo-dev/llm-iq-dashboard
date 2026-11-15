# 2026-11 候选评测题目完整选型目录（无折叠、全提示词原文）

本目录汇总 `grok_raw_report_2026-11.md` 与 `x_model_capability_prompts_2026-11.md` 中**具备完整可测提示词原文或已重构成纯内联 SVG 草案的 16 道候选题**（全部通过 `dedupe.mjs` 对既有 1122 题查重，无真人、无商标、0 `<script>`），供直接挑选入库。

---

## 一、16 道完整候选题逐题全文

### #1 `animated-pendulum-wave-reunion-v1` · 十五摆归相（9 摆 SVG 闭环合同）
- **出处**：`@MiaAI_lab`，2026-11-09，`037-pendulum-wave.txt`（[status/2119930229661503893](https://x.com/MiaAI_lab/status/2119930229661503893)）
- **考点**：多自由度可公度周期同相归零（区别于擒纵、步态与螺线）。

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
- **判读**：Pass：9 摆；t=0 与 t=6 的 MAE ≡ 0；抽样角误差 ≤ 1.5°；t=3 奇偶反相；max MAE ≥ 0.015；0 script。Partial：归相时刻不对或奇偶反相错。Fail：同周期 / 缓动毁零点 / 含 script / 静止。

---

### #2 `animated-moire-ring-drift-v1` · 同心环莫尔漂移
- **出处**：`@MiaAI_lab`，2026-11-09，`010-op-art-pulse.txt`（第一间）
- **考点**：两套周期图元相对微角位移产生双曲干涉拍频。

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
- **判读**：Pass：48 环、8 px 间距、t=4 为 +8°、t=8 MAE ≡ 0、max MAE ≥ 0.015、0 script。Partial：峰值角非 8° 或两层都在转。Fail：纯转圆 / 透明度伪装干涉 / 含 script / 静止。

---

### #3 `animated-iron-filings-align-v1` · 铁屑指向移动磁极
- **出处**：`@MiaAI_lab`，2026-11-09，`013-iron-filings.txt`
- **考点**：24 根铁屑原地旋转不平移，朝向实时追踪移动磁极 $\text{atan2}$。

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
- **判读**：Pass：24 条不平移；5 个抽样时刻误差 ≤ 2°；t=8 MAE ≡ 0；max MAE ≥ 0.015；0 script。Partial：脱节或只转少数几条。Fail：铁屑平移 / 随机抖动 / 含 script / 静止。

---

### #4 `animated-venus-rose-trace-v1` · 金星五瓣相对轨道
- **出处**：`@MiaAI_lab`，2026-11-09，`042-dance-of-venus.txt`
- **考点**：13:8 轨道共振下的 5 次近地点 $72^\circ$ 等分与相对轨迹闭环。

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
- **判读**：Pass：五瓣；5 次近地点间隔 72°±2°；t=16 笔尖同坐标且 MAE ≡ 0；max MAE ≥ 0.015；0 script。Partial：瓣数不对或近地点不均。Fail：对数螺线 / 椭圆 / 静止全图无笔尖运动 / 含 script。

---

### #5 `animated-orrery-single-crank-v1` · 单摇把正反转太阳系仪
- **出处**：`@kimmonismus`，2026-11-10，[status/2120186125591646250](https://x.com/kimmonismus/status/2120186125591646250)（719 likes）
- **考点**：单一角度驱动齿轮啮合比、三行星速比与六瓣光圈开合，后半周期精确反转归零。

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
- **判读**：Pass：φ(6)=360°、齿轮 B=-180°、三行星 1:1/2:1/4、后半段反向、t=12 MAE ≡ 0、max MAE ≥ 0.015、0 script。Partial：缺失反转或齿数比不符。Fail：行星自由无限转 / 花瓣不联动 / 含 script / 静止。

---

### #6 `animated-watt-governor-flyball-v1` · 瓦特飞球调速器
- **出处**：`@thebuggeddev`，2026-11-10（物理柜 SVG 瓦特表，~372–378 likes）
- **考点**：飞球张角、套筒上升、节流阀反向下降的三元连杆耦合。

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
- **判读**：Pass：t=4 张角 45°±1.5°；左右镜像；套筒与阀门反向；t=8 MAE ≡ 0；max MAE ≥ 0.015；0 script。Partial：套筒不跟随或左右不对称。Fail：只画旋转轴 / 含 script / 静止。

---

### #7 `animated-radial-master-rod-v1` · 九缸星形发动机主副连杆
- **出处**：`@olezhavich` / `@danieldwalton`，2026-10-31（334 likes）
- **考点**：1 号主连杆与 8 根副连杆的非对称铰接拓扑 + 720° 四冲程隔缸发火序。

```text
Generate one self-contained animated SVG cutaway of a nine-cylinder radial engine, front view. No title, no brand, no script, no CDN.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>. Navy background, flat technical colors.

Nine cylinders at 0, 40, 80, ..., 320 degrees. Cylinder 1 is at the top. One crank pin. The master rod of cylinder 1 is pinned to that crank pin. The other eight rods are pinned to the master rod's big end, not to the crank pin. Do not animate the eight pistons with the same sine shifted by 40 degrees.

Loop T = 8s = two crank revolutions = 720 degrees of crank, linear. Each cylinder fires once per 720 degrees. Firing order is 1, 3, 5, 7, 9, 2, 4, 6, 8, which is an 80 degree crank step. A firing is a 0.15s flash in that cylinder only. At t = 0 and t = 8 the crank angle is 0 and every rod matches. Piston motion must reverse at the two ends of the stroke, not slide through the head.

Output only the <svg>.
```
- **判读**：Pass：九缸 40° 均布；仅 1 号连杆接曲柄销；发火间隔 80° 且序为 1-3-5-7-9-2-4-6-8；t=8 MAE ≡ 0；max MAE ≥ 0.015；0 script。Partial：8 副连杆错套曲柄销或顺序发火。Fail：活塞同正弦 / 含 script / 静止。

---

### #8 `animated-lava-blob-convection-v1` · 熔蜡对流颈缩与合并
- **出处**：`@MiaAI_lab`，2026-11-09，`033-lava-lamp-1971.txt`（`@aitrendz_xyz` 转述 3 likes）
- **考点**：浮力单次反号、分裂前几何颈缩（腰宽 ≤ 30%）与回落无缝合并。

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
- **判读**：Pass：上升仅一次竖向反号；分裂前腰宽 ≤ 30% 最大宽；t=10 MAE ≡ 0；max MAE ≥ 0.015；0 script。Partial：用透明度代替颈缩或合并漂移。Fail：双球各自上下弹 / 含 script / 静止。

---

### #9 `animated-bounce-spacing-chart-v1`（Zieminski Prompt 05）· 弹跳间距图 + Easing 动态圆点
- **出处**：Karo Zieminski，2026-11-09，[productwithattitude.com](https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts)（原生即纯内联动态 SVG，原文全文）
- **考点**：把不可见的动画节奏转为 7 帧等时鬼影图、像素间距计算与 `cubic-bezier` 真实曲线同步运动点。

```text
I cannot review motion from a description. Give me the animation on paper.

1. Spacing chart: draw the falling ball as 7 evenly timed ghost frames in one SVG, left to right. Label the pixel gap between each frame and the next. Draw the contact frame squashed.
2. Easing curves: plot every cubic-bezier you used as a real curve on a time by progress axis, with the four control values printed underneath. Put a dot on each plot that travels with that exact easing.
3. Compute every position. Do not eyeball any of them. Show the formula.
```
*(若正式入库本平台，可在结尾补 1 行 SVG 闭环与 0 `<script>` 约束；或保留原句。)*

---

### #10 `animated-physics-bounce-ball-v1`（Zieminski Prompt 04）· 纯 CSS 物理重量感弹跳球
- **出处**：Karo Zieminski，2026-11-09，同上（HTML+CSS，原文全文）
- **考点**：禁用 `ease` 关键字、从物理推导 `cubic-bezier`、触地体积守恒挤压、阴影收紧与 `prefers-reduced-motion`。

```text
Animate a ball bouncing in place. CSS keyframes only, no JavaScript, no libraries.

- Loop: 1.1 s. Drop height: 150 px. Ball: 44 px.
- The ball must feel heavy. Use squash and stretch. Squash only while it touches the floor. Keep volume roughly constant.
- Add a contact shadow that tightens and darkens as the ball lands.
- Do not use ease, ease-in or ease-out keywords. Give every segment its own cubic-bezier and derive the values from physics, not taste. Show the derivation.
- Set transform-origin so the squash happens against the floor.
- Respect prefers-reduced-motion.

Then tell me what you cannot verify about this animation without watching it.
```

---

### #11 `animated-kinetic-type-mask-v1`（Zieminski Prompt 06）· 纯 CSS 动态字 `make it move`
- **出处**：Karo Zieminski，2026-11-09，同上（HTML+CSS，原文全文）
- **考点**：单 CSS 自定义属性错开 `45 ms`、遮罩防截断、过冲进入与加速退出。

```text
Build a kinetic type lockup in HTML and CSS only. The words: "make it move", on two lines.

- Each letter is its own inline-block. Each line is a mask (overflow hidden).
- Letters exit up and re-enter from below. Stagger 45 ms per letter using a CSS custom property, not eleven hand-written delays.
- Entry uses an overshoot curve. Exit uses an accelerating curve. Give me both as cubic-bezier and say why you chose each number.
- The resting state is the fully readable lockup. A screenshot at any random moment should usually be legible.
- Loop every 4.2 s. Respect prefers-reduced-motion.
- Type: heavy grotesque, tight tracking, line-height under 0.9. Pad the mask so descenders and the overshoot are not clipped.
```

---

### #12 Zieminski Prompt 01 · 国际主义 6 列网格海报（静态 SVG 原文）
- **出处**：Karo Zieminski，2026-11-09，同上（虚构客户 Slow Signal）

```text
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

---

### #13 Zieminski Prompt 02 · 纯圆弧单路径字母 `S`（静态 SVG 原文）
- **出处**：Karo Zieminski，2026-11-09，同上

```text
Design a monogram for Slow Signal as SVG.

Build the letter S from circular arcs only. One radius, one stroke weight, no freehand curves. It must be a single path.

Deliver, in one 600 x 400 SVG:
1. The mark large, with a "construction" group showing every circle, centre line and tangent point you used.
2. The same mark at 64, 32 and 16 px, reused with <use>, not redrawn.
3. One lockup: mark plus wordmark, reversed out of the accent color.
4. A clear space rule expressed in units of the radius.

Then list the path data and explain each arc flag.
```

---

### #14 Zieminski Prompt 03 · 8 枚动效图标 + 光学重量自审（静态 SVG 原文）
- **出处**：Karo Zieminski，2026-11-09，同上

```text
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

---

### #15 Zieminski Prompt 07 · FrontierCode 2.0 水平条形图算术（静态 SVG 原文）
- **出处**：Karo Zieminski，2026-11-09，同上

```text
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

---

### #16 `animated-floorplan-door-swing-v1` · 中性公寓平面图与门扇开合动效（衍生自 AI Fire 门轴翻车）
- **出处**：衍生自 AI Fire 2026-11-12 对 Gemini 4 Carbon 公寓重建的失败观察（原题带《Seinfeld》版权与 Three.js，此处净室重拟为纯 2D 建筑平面 + 门扇旋转闭环 SVG）
- **考点**：房间连通拓扑（客厅、走廊、卧室、浴室、厨房通路封闭无死墙）、门铰链定点、90° 虚线清扫弧线与开合不穿墙（专抓 Carbon 常见的门开向画反错误）。

```text
Generate one self-contained animated architectural floor plan SVG of a fictional three-room apartment. Top-down 2D view, white blueprint lines on #12161f. No TV show names, no brand, no furniture sprites, no script.

Technical contract: SMIL <animateTransform> or inline CSS @keyframes only. 0 <script>, viewBox="0 0 800 560". CDATA around any <style>.

Layout geometry:
- Outer wall rectangle from (80,60) to (720,500), stroke-width 6.
- A continuous 90 px wide central hallway connects an entry vestibule on the left, a living room on the top-right, a bedroom on the bottom-right, and a bathroom between them. No corridor dead-ends or overlapping walls.
- Exactly 4 hinged doors placed in door openings (opening width 48 px each):
  1. Entry door opens inward into the vestibule.
  2. Living room door opens inward into the living room.
  3. Bedroom door opens inward into the bedroom, hinge on the side closest to the bedroom corner wall so the leaf never hits the hallway wall.
  4. Bathroom door opens inward into the bathroom.
- Draw a dashed quarter-circle swing arc (radius 48 px) for every door.

Loop T = 6s, linear:
At t = 0 and t = 6 all 4 doors are closed (0 degrees, flush with wall).
At t = 3 all 4 doors are open to exactly 90 degrees inward inside their respective rooms, aligned with their dashed swing arcs and never crossing walls. Return cleanly from 3s to 6s so t = 6 matches t = 0 identically.

Output only the <svg>.
```
- **判读**：Pass：4 扇门均向各自室内侧开启 90°、铰链位置正确、门扇旋转轨迹与虚线圆弧重合且不穿墙、走廊连通无死结、t=6 MAE ≡ 0、max MAE ≥ 0.015、0 script。Partial：走廊连通对但 1 扇门朝外开或圆弧方向反了。Fail：门穿墙、门开到走廊堵塞通路、静止图、含 script。

---

## 二、其余已调查但未收录草案的 2026-11 X / 社区测试题（每题独立一行）

| 序号 | 题目 | 模型 | 出处 / 链接 | 排除原因 |
|---:|---|---|---|---|
| 17 | 鹈鹕骑自行车（5 档 effort） | Fable 5.2 | `@simonw` 11-09 & Gist `bcd1a1bf` | 本库已有 3 版；`max` 耗尽 128k 思考空白 |
| 18 | 鹈鹕骑自行车（3 档 thinking） | Gemini 4 Carbon | `@simonw` `2120259652093112614` & Gist `e5bf8606` | 本库已有 3 版 |
| 19 | 鹈鹕骑自行车（`"go all out"`） | Fable 5.2 vs Opus 5.5 | `reddit.com/r/singularity` `1xsuixt` | 本库已有 3 版 |
| 20 | `r/ClaudeAI` Max 过思考空输出 | Fable 5.2 | `reddit.com/r/ClaudeAI` `1xs0dct` | 无具体新题面 |
| 21 | Saltline 港口 FPS（8h 单文件） | Fable 5.2 | `@felixrieseberg` `2119925633564463609` | 依赖 JS/Three.js/音频与 8h 迭代 |
| 22 | Tromsø 北极光单文件 HTML | Fable 5.2 | `@MichaelGannotti` `2119922137011982652` | Canvas+WebGL 氛围图，无客观几何真值 |
| 23 | Starry Nightrider（《星夜》骑行） | Fable 5.2 | `@ebbyamir` `2120284261089673376` | 含真实历史人物梵高（一票否决）+ Three.js |
| 24 | Kevin Ngo 干画材 JS 艺术 | Fable 5.2 | `@kevin_t_ngo` `2121303379196662115` | 明确要求 `Not like an SVG` 且用 JS+子代理 |
| 25 | Yonkers 机甲踩纽约 OSM（`átomos`） | Fable 5.2 | `simonwillison.net/2026/Nov/10/yonkers-rises/` | Three.js + OSM 地图数据与脚本 |
| 26 | Yonkers 机甲踩纽约 OSM（`stomps`） | Gemini 4 Carbon | `simonwillison.net/2026/Nov/10/llm-gemini/` | Three.js + OSM 地图数据与脚本 |
| 27 | Pelican Quest（校园 3D 游戏） | Gemini 4 Carbon | `@vamsibatchuk` `2120191944643190808` | 依赖 `/swarm`、Blender、Three.js 且重复鹈鹕 |
| 28 | 埃菲尔铁塔施工 3D | Gemini 4 Carbon | Google 官方 11-10 演示 | 依赖 `/swarm` 与 Blender，原提示未公开 |
| 29 | Platform 37 工程图三维重建 | Gemini 4 Carbon | Google 官方 11-10 演示 | 10 轮过夜多文件工程，非单题 SVG |
| 30 | 1780 年 Stein 钢琴击弦机 3D | Gemini 4 Carbon | Google 官方 11-10 演示 | 依赖 `/swarm` 与 Blender，原提示未公开 |
| 31 | 110 根针织纤维拉伸力学交互可视化 | Gemini 4 Carbon | `@Google` `2120279087314837642` | 论文驱动的交互 3D，原提示未公开 |
| 32 | TIDEFORGE 百万粒子模拟 | Gemini 4 Carbon | `@kimmonismus` `2120186202271945137` | Three.js/WebGPU 粒子，brief 未公开 |
| 33 | Analyse Spectrale 92 零件物理柜 3D | Gemini 4 Carbon | `@thebuggeddev` 11-10 | 依赖参考图与 3D 柜体（SVG 瓦特表已拆为 #6） |
| 34 | Glassy Jenga / Vitrail 玻璃积木 | Gemini 4 Carbon | `@AI_Andrew` `2120243379388760176` | WebGPU + MuJoCo + 音频，飞溅无唯一真值 |
| 35 | 等轴测图 Figma 先画再加运动 | Fable 5.2 | `@BreejeAnadkat` 11-10 | 依赖外部 Figma 输入，非模型从零构图 |
| 36 | 帆船水面材质对照 | Fable 5.2 vs Carbon | `aifire.co` 11-12 | 三维渲染与材质比较，原提示未打开 |
| 37 | 英雄射击游戏原型可玩性对照 | Fable 5.2 vs Carbon | `aifire.co` 11-12 | 游戏逻辑与脚本，非纯内联 SVG |
| 38 | World Clock 62 面名表内联 SVG | Fable 5.2 vs Carbon | `christopherrbrown3/world-clock` | 含在售名表商标且角度考点与 10 月钟面重复 |
| 39 | MotionGraphicsBench（100 题加运动） | GPT-6 Astra / Fable 5.1 | `arXiv:2611.10592` | 任务为编辑既有静态 SVG，非从零生成 |
| 40 | Beep Locator 多设备声学定位应用 | Opus 5.5 + Fable 5.2 | `simonwillison.net/2026/Nov/9/mysterious-beeps/` | Python + WebAudio + WebSockets 全栈应用 |
| 41 | USB-C 麦克风音箱 PCB 硬件设计 | Fable 5.2 | Anthropic Electronics 博文 | 硬件电路与 KiCad/Diode 工程 |
| 42 | Lean 费马大定理形式化证明 | Fable 5.2 | Anthropic 工程博文 | 1000 agent 数学形式化证明，非视觉题目 |
| 43 | Go + HTMX + Tailwind 流水线与审计 | Carbon + Opus 5.5 | `reddit.com/r/google_antigravity` `1xszqoj` | 多阶段工程流水线 |
| 44 | TrueStandard 30 条主张引用幻觉 | Carbon vs Argon | `truestandard.ai` 11-12 | 文本事实引用测验，题面未公开 |
| 45 | 13 文件代码评审思考耗尽探针 | Gemini 4 Carbon | `reddit.com/r/GeminiAI` `1xtbzvt` | 262k 思考 token 超限探针，正文未公开 |
| 46 | Snorkel 26 道前沿编码任务 | Fable 5.2 vs 5.1 | `snorkel.ai` 11-12 | 私有编码评测集 |
| 47 | ForgeCAD 日内瓦间歇机构 | 几何求解器 | `@istvan_csanady` 11-09 | 求解器演示，非大模型盲测 |
