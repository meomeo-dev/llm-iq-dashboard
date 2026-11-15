# 10 物理重量感纯CSS弹跳球（Animated Physics Squash-and-Stretch Bouncing Ball）

- 建议 ID：`animated-physics-bounce-ball-v1`
- 英文名：Animated Physics Squash-and-Stretch Bouncing Ball

## 来源

- 作者：Karo Zieminski
- 时间：2026-11-09
- 链接：https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts
- 热度快照：作者专栏文章 Prompt 04（“Claude Fable 5.2 设计与动效盲写测试”7 题之四，2026 年 11 月在 X 与前端设计社区被广泛引用，用于检验大模型在盲写条件下的 CSS 物理节奏与挤压拉伸纪律）
- 交叉：原文为 HTML+CSS 题目，要求纯 CSS `@keyframes`、禁用 `ease` 关键字、由物理推导 `cubic-bezier`、触地挤压、接触阴影、`prefers-reduced-motion` 并附带一段自我盲点追问；本草案将题目净室收敛为单文件纯内联动态 SVG（`viewBox="0 0 360 320"`），移除外部文档结构与文字追问，保留精确 `1.1s` 闭环、150 px 落差、44 px 球体、底部接触点锚定挤压、阴影反向耦合及显式物理 `cubic-bezier(...)` 约束。

## 讨论焦点

该题在社区被用来戳破大模型“嘴上会背迪士尼十二原则、代码里却写默认缓动”的典型幻觉：模型往往在文字说明里大谈重力与体积守恒，但关键帧中仍混入 `ease-in`/`ease-out` 关键字，或在半空中就提前拉长变形，甚至因 `transform-origin` 错误导致球体挤压时穿入地面。

典型失败：

- 使用 `<script>` 或 `requestAnimationFrame` 计算每帧位置，违反纯声明式 SVG 动画规范。
- 在 `@keyframes` 或 CSS 动画属性中使用 `ease`、`ease-in`、`ease-out`、`ease-in-out` 通用关键字，未对下落加速段与反弹减速段分别给出物理推导的 `cubic-bezier(...)`。
- 球体在半空下落或上升阶段提前发生拉伸/压扁，或 `transform-origin` 未锚定在地面接触点（`y=260`），致使球体穿模沉入地面基准线以下或悬空收缩。
- 挤压比例失衡未近似保持二维截面积（例如压扁 30% 却未横向加宽约 25–30%），或接触阴影在撞击时反而变宽、变淡。
- 周期偏离 `1.1s`，或首尾帧（`t=0` 与 `t=1.1s`）位置或形变状态不一致。

## 考点

重力加速与减速的显式 `cubic-bezier(...)` 分段拟合、触地瞬间近似截面积守恒挤压（横扩约 25–30%、纵压约 25–30%）、地面接触点 `transform-origin` 锚定防穿地、接触阴影反向耦合（撞击收窄加深、高点展宽变淡）、`1.1s` 无缝闭环与零脚本约束。区别于“弹跳鬼影间距图（Prompt 05）”的静态多帧展开，本题直接考察连续实时 SVG+CSS 物理表现。

## 提示词草案

```text
Generate one self-contained animated SVG (viewBox="0 0 360 320") of a heavy ball bouncing vertically in place. No text, no brand, no prose, no script.

Technical contract: inline CSS @keyframes wrapped in <style><![CDATA[...]]></style> only (no <script>, no event handlers, no external assets or libraries). Well-formed XML.

Geometry: a horizontal floor datum line at y = 260, a dynamic elliptical contact shadow centered at x = 180 on y = 260, and a 44 px solid circular ball (r = 22) centered at x = 180. The ball drops 150 px vertically from apex (center y = 88) to floor contact (center y = 238, bottom edge y = 260).

Seamless closed loop T = 1.1s: at t = 0 and t = 1.1s the ball is at apex (y = 88, undeformed circle) and pixels match identically (MAE === 0). The ball must feel heavy. Apply squash and stretch ONLY during floor contact: widen 25-30% and flatten 25-30% while preserving approximate 2D cross-sectional area, with zero mid-air distortion during descent or ascent. Anchor transform-origin at the bottom floor contact point (180px 260px) so the squashed ball stays flush on y = 260 without sinking below the floor.

The contact shadow tightens in width and darkens in opacity on impact, and widens and softens as the ball rises to apex.

Easing discipline: strictly DO NOT use ease, ease-in, ease-out, or ease-in-out keywords anywhere in @keyframes or CSS. Assign explicit physics-derived cubic-bezier(...) curves per descent and rebound segment to model gravitational acceleration and deceleration.

Output only the <svg>.
```

## 判读

**Pass：** `viewBox="0 0 360 320"`，含 `y=260` 水平地面线、位于 `(180, 260)` 的动态椭圆接触阴影及直径 44 px 实心球（顶部圆心 `y=88`、触地圆心 `y=238`、垂直落差 150 px）；周期严格为 `1.1s`；仅在触地瞬间发生横扩 25–30%、纵压 25–30% 的近似等面积挤压且底部贴合 `y=260` 不穿地，半空无形变；阴影触地收窄变深、高点展宽变淡；全程禁用 `ease`/`ease-in`/`ease-out`/`ease-in-out` 关键字而使用显式 `cubic-bezier(...)`；首尾帧 `t=0` 与 `t=1.1s` 像素 `MAE === 0` 且周期内 `max(MAE) >= 0.015`；0 `<script>`。

**Partial：** 球体上下弹跳闭环与基本阴影变化成立，但出现轻微半空拉伸、挤压幅度偏离 25–30%、挤压时略微沉入地面线，或仅单段使用 `cubic-bezier(...)` 而未分段刻画重物加速与反弹。

**Fail：** 使用 `<script>` 或事件处理器；使用 `ease` / `ease-in` / `ease-out` / `ease-in-out` 关键字；静止无动画（`max(MAE) < 0.015`）；首尾帧不重合（`MAE > 0`）；无触地挤压或完全没有接触阴影；输出 SVG 以外文字或存在 XML 语法错误。
