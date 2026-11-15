# 18 针织线圈单轴拉伸与泊松收缩动效（Animated Knitted Yarn Loop Tension & Poisson Narrowing）

- 建议 ID：`animated-knitted-yarn-tension-v1`
- 英文名：Animated Knitted Yarn Loop Tension & Poisson Narrowing

## 来源

- 发布方：[@Google](https://x.com/Google)
- 时间：2026-11-10（雪花 ID `2120279087314837642`）
- 链接：https://x.com/Google/status/2120279087314837642
- 语境：2026-11-10 X（@Google）针织纱线级力学与几何渲染评测样例（110 knitted yarn-level mechanics benchmark），展示交织平针织物（jersey knit）线圈矩阵在周期性单轴拉伸下的几何变形与横向收缩。

本题目以净室规则改写为纯内联声明式 SVG 动画题：剥离所有脚本、外部字体、Canvas/WebGL 与品牌标识，聚焦 `4 列 × 4 行` 交织平针织物线圈矩阵在 `T = 6s` 单轴加载—卸载闭环中的拓扑穿插（over-under crossings）、纵向伸长、泊松横向颈缩（Poisson necking）以及接触弧应力色移。

## 讨论焦点

该题型用于检验大模型在“柔性微结构力学 + 精确二维拓扑穿插”上的空间表达能力：普通绘图容易把针织线圈画成无穿插的扁平波浪线或刚性矩形缩放，而真实针织在受拉时表现为线圈腿拉直、行距拉长、中部列向中心轴泊松内收且咬合接触区应力升高。

典型失败：

- 线圈交叉处没有上下穿插遮挡（缺少背景描边套壳或分段断口），全部纱线平铺重叠。
- 整体只是对静态网格做单向 `scaleY`，缺少线圈腿拉直与中部列的泊松横向颈缩。
- 拉伸过程中相邻线圈脱离咬合或发生网格撕裂，顶/底夹持端未保持固定锚定。
- 包含 `<script>` 或外部资源，或 `t = 0s` 与 `t = 6s` 未能严格回归同构。

## 考点

`4×4` 平针织物线圈上下穿插拓扑（over-under crossing casing）、约 `28%` 单轴纵向拉伸下的线圈腿拉直与泊松横向颈缩（Poisson transverse necking）、高应力接触弧颜色演化（`#38bdf8 -> #f59e0b -> #ef4444`）、侧边应变与宽幅标尺同步联动、以及 `T = 6s` 无脚本闭环回归。

## 提示词草案

```text
Generate one self-contained animated SVG of a knitted yarn lattice under cyclic uniaxial tension. No external assets, no external fonts, no brand names, no audio, no script.

Technical contract: pure inline SVG with viewBox="0 0 760 540" on dark laboratory background #0d131c. SMIL (<animate>, <animateTransform>) or inline CSS @keyframes inside <style><![CDATA[...]]></style> only. 0 <script>, 0 event handlers. Well-formed XML.

Geometry and yarn topology:
- Render a 4-column by 4-row (16 unit loops, plus clean entry and exit yarn tails anchored into top and bottom clamp bars) interlocking weft jersey-knit yarn lattice.
- Use thick cylindrical yarn strands (stroke-width 8 to 10, stroke-linecap="round") with explicit over-under crossing gaps or #0d131c background casing strokes so every loop alternates clearly over its neighbor's head arc and behind its adjacent course leg (zero flat uncrossed overlaps).
- Render a fixed bottom grip rail with 2 horizontal anchor pins and a moving top grip bar with upward tensile force vector arrows labeled F.
- Include a crisp side strain and transverse narrowing meter with an animated EPSILON_Y bar and width ruler ticks.

Closed tensile cycle T = 6s (infinite repeat, identical pixels at t = 0s and t = 6s):
- 0.0s -> 3.0s (uniaxial loading): top grip bar moves steadily upward by ~28% vertical gauge extension; every knit row elongates vertically (loop legs straighten upward) while middle rows and inner columns exhibit smooth Poisson transverse necking toward the vertical centerline without breaking loop interlock continuity. High-stress contact crown arcs shift smoothly from relaxed slate-cyan #38bdf8 through amber #f59e0b to peak orange-red #ef4444, while the EPSILON_Y bar and width meter track the deformation.
- 3.0s -> 6.0s (elastic unloading): top grip bar, loop curvatures, transverse width, stress colors, and strain/width meters smoothly relax back to the exact t = 0s geometry.

Output only the <svg>.
```

## 判读

**Pass：** `viewBox="0 0 760 540"` 且背景为 `#0d131c`；完整呈现 `4×4` 共 16 个交织平针线圈及上下夹持端纱尾，具备明确上下穿插套壳/断口（无扁平直接叠压）；底部固定夹轨含 2 枚水平锚钉，顶部活动夹条带向上拉力箭头 `F`；右侧具备 `EPSILON_Y` 应变柱与横向宽幅标尺；`0s -> 3s` 上夹条上移约 `28%` 伴随线圈腿拉直、中部泊松横向颈缩且不断裂咬合，高应力接触弧由 `#38bdf8` 经 `#f59e0b` 变至 `#ef4444`；`3s -> 6s` 弹性回弹至 `t = 0s` 完全一致（`MAE === 0`）；周期内 `max(MAE) >= 0.020`；`0 <script>`。

**Partial：** 具备针织线圈网格与 `6s` 拉伸回弹闭环，但仅做整体缩放而缺少泊松横向颈缩、上下穿插遮挡不完整、缺少应力变色或侧边 `EPSILON_Y`/宽幅读数不同步。

**Fail：** 静态无动画（`max(MAE) < 0.020`）；线圈非交织拓扑或全部扁平重叠；首尾帧不一致（`t = 0s` 与 `t = 6s` 存在残差）；包含 `<script>`、事件处理器或外部资源；XML 语法错误。
