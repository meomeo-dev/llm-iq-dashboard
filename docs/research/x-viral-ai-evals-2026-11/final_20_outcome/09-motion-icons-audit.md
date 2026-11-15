# 09 八枚动效图标与光学网格动画（Animated Eight Motion Tool Icons & Optical Grid）

- 建议 ID：`animated-motion-icons-audit-v1`
- 英文名：Animated Eight Motion Tool Icons & Optical Grid

## 来源

- 作者：Karo Zieminski（Product with Attitude）
- 时间：2026-11-09
- 链接：https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts
- 交叉：2026-11-09 发布于 Product with Attitude《Claude Fable 5.2 Design & Motion Tests》专题，对应原文 Prompt 03。原题为静态 SVG 图标集评测，要求按 24×24 像素网格绘制 8 枚动效工具图标并附带光学重量自审说明；本草案移除文外说明文字，保留全部网格、描边与 `construction` 构造层规则，并增补 `T = 8s` 顺序激活高亮与 3×/1× 同步微动效闭环，使之可纳入纯内联动态 SVG 自动帧差评测。

## 讨论焦点

原评测测试模型在无视觉回放条件下能否严格遵守微尺度图标系统几何（24×24 画格、3 px 安全边距、半像素对齐、无填充统一描边）并避免光学重量失衡（原文实测中 `timeline` 易被误读为加号、`layers` 视觉偏重）。改为动态基准后，又增加“固定步进时间片同步”与“双倍率同步微动”维度。

典型失败：

- 使用 `<script>` 或事件属性控制逐槽高亮与动效，违反纯声明式动画规则。
- 图标出现实心填充（如实心 `play` 三角形或实心控制点），或未遵守 1.5 px 线宽、圆头圆角与 0.5 px 坐标网格。
- 缺失可切换的 `class="construction"` 构造层（24×24 网格、18×18 活区框、20 px 关键线圆），或缺少底部 1× 实寸对照行。
- 8 枚图标顺序错乱、缺项，3× 与 1× 动作不同步，或 8 秒周期首尾未回到同一静止态（`MAE !== 0`）及动画幅值过弱（`max(MAE) < 0.015`）。

## 考点

微尺度图标系统几何纪律（24×24 单元、3 px 安全边距 18×18 活区、20 px 关键线圆、半像素坐标、1.5 px 无填充圆角描边、圆角半径 2、最简路径指令）、`construction` 构造层与 3×/1× 双排同源映射，以及 `T = 8s` 按槽位 1..8（每槽 1 秒）顺序扫过的激活高亮框与语义微动闭环。

## 提示词草案

```text
Generate one self-contained animated SVG of an 8-icon motion-design tool set with an optical construction grid. No brand names, no prose audit text, no script, no external assets or fonts.

Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS <style><![CDATA[...]]></style> @keyframes only. 0 <script>, 0 event handlers. viewBox="0 0 800 420". Well-formed XML.

Draw 8 motion-design icons in strict left-to-right order: play, keyframe, ease, layers, timeline, loop, mask, export.

Non-negotiable icon system rules (in each icon's 24x24 local unit):
- 24 x 24 grid, 3 px safe margin, 18 x 18 live area (x, y in [3, 21]).
- Stroke 1.5, stroke-linecap="round", stroke-linejoin="round", fill="none" (no fills).
- All coordinates on whole or half pixels only (multiples of 0.5).
- Corner radius 2 where corners are rounded; minimal path commands per icon.

Layout:
- Top row: all 8 icons scaled 3x (72 x 72 each), overlaid with a toggleable <g class="construction"> group showing each slot's 24 x 24 grid, 18 x 18 live area box, and 20 px diameter keyline circle centered at (12, 12).
- Bottom row: the same 8 icons in a matching left-to-right row at true 1x size (24 x 24 each).

Motion, 8-second seamless closed loop (T = 8s):
- A crisp active slot highlight (accent frame/ring and stroke highlight) sweeps cleanly through slots 1..8, spending 1 second per icon (0..1s play, 1..2s keyframe, ..., 7..8s export).
- During its 1-second active window, each icon performs a clear synchronized semantic micro-motion in both the 3x and 1x rows: play triangle pulses right; keyframe diamond rotates 45 -> 90 -> 45 deg; ease indicator circle slides along the curve; layers stack shifts vertically; timeline playhead sweeps horizontally; loop arc rotates 360 deg; mask shutter slides; export arrow lifts upward.
- At t = 0s and t = 8s every slot and icon returns identically to the initial rest pose (pixel MAE === 0) with clear visible motion during the cycle (max(MAE) >= 0.015).

Output only the <svg>.
```

## 判读

**Pass：** 从左到右完整绘制 play、keyframe、ease、layers、timeline、loop、mask、export 八枚图标；局部坐标符合 24×24 网格、3 px 安全边距（18×18 活区）、半像素坐标、1.5 px 描边、圆头圆角、无填充且圆角半径 2；上排 3× 含可切换 `class="construction"` 构造层（网格、活区框、20 px 关键线圆），下排 1× 对齐；8 秒闭环中激活高亮与对应微动效每 1 秒依次扫过 1..8 槽位且 3×/1× 同步，首尾帧 `MAE === 0` 且 `max(MAE) >= 0.015`；0 `<script>` 且 XML 合法。

**Partial：** 八枚图标与构造层基本齐全且可闭环动画，但部分图标存在轻微填充、坐标未严格落于整/半像素、缺少 1× 行，或部分槽位微动效与 3×/1× 同步不严格。

**Fail：** 静态无运动（`max(MAE) < 0.015`）；包含 `<script>` 或事件属性；缺漏图标或顺序错误；大量实心填充违背线框规则；`t = 0` 与 `t = 8s` 首尾未归零；出现品牌名/大段文字或 XML 语法错误。
