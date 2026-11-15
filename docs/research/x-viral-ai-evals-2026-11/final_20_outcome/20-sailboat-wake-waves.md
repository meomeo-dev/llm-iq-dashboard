# 20 帆船乘浪俯仰与开尔文尾迹动效（Animated Sailing Sloop, Wave Heave & Kelvin Wake）

- 建议 ID：`animated-sailboat-wake-waves-v1`
- 英文名：Animated Sailing Sloop, Wave Heave & Kelvin Wake

## 来源

- 发布方：AI Fire
- 时间：2026-11-12
- 链接：https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests
- 评测背景：2026-11-12 AI Fire 横评文章中的“帆船水面着色器测试”（sailboat water shader test），原题面向交互式实时水面渲染与帆船运动场景。
- 净室改造说明：剥离原题对 WebGL / Three.js / Canvas 着色器与外部脚本的依赖，收敛为 `viewBox="0 0 820 500"`、闭环周期 $T = 6\text{ s}$ 的纯内联声明式动态矢量 SVG，聚焦可量测的周期性次摆线分层海浪、水线耦合升沉俯仰与开尔文 V 形尾迹，不含任何真实人物、商业商标或外部资产。

## 讨论焦点

该题检验模型在无脚本、无 3D 引擎条件下，用 2D 矢量与声明式动画构建“流体表面—浮体姿态—尾迹扩散”三者动力学耦合的能力：既要通过多层波峰错速平铺营造纵深海况，又必须保证船体吃水线始终咬合波面，避免帆船脱离水面悬浮或索具错位。

典型失败：

- 使用 `<script>`、WebGL、Canvas 或外部纹理/脚本，违反纯内联静态声明式 SVG 约束。
- 海浪路径未按整数波周期平铺，导致 `t = 6s` 回到 `t = 0s` 时出现明显跳帧或相位接缝（`MAE !== 0`）。
- 船体未围绕水线中点做与波峰锁相的升沉（heave）与 $\pm 4^\circ$ 俯仰（pitch），导致船底悬空在波谷上方，或主帆/前帆与桅杆、横桁脱离。
- 开尔文尾迹仅画静态两条白线，缺乏自船尾斜向后方展开并随周期脉动消散的羽化泡沫带，或整体画面像素变化幅度不足（`max(MAE) < 0.018`）。

## 考点

`y = 265` 暮色海天渐变地平线、$\ge 3$ 层整数周期无缝平铺的次摆线（trochoidal）海浪带与日光碎波高光（`#fde68a` / `#38bdf8`）、3/4 斜视角百慕大帆船的船体水线中心升沉与 $\pm 4^\circ$ 波峰锁相俯仰、帆索与帆骨完整连结、开尔文 V 形尾迹与船首浪花在 $T = 6\text{ s}$ 内的周期性扩展消退。

## 提示词草案

```text
Generate one self-contained animated SVG of a sailing sloop riding ocean waves at golden hour with a Kelvin V-wake. No text, no brand, no audio, no script, no event handlers, no external assets.

Technical contract: Pure inline SVG with SMIL (<animate>, <animateTransform>) or CSS @keyframes inside <style><![CDATA[...]]></style> only. 0 <script>. viewBox="0 0 820 500". Well-formed XML. Closed loop T = 6s: the frame at t = 6s must be pixel-identical to t = 0s (MAE === 0), with clear continuous motion inside the loop (max(MAE) >= 0.018).

Scene and hydrodynamics:
1. Atmosphere & Horizon: A twilight/golden-hour marine sky linearGradient fading smoothly into a deep sea horizon line at y = 265.
2. Tiled Periodic Trochoidal Wave Trains: At least 3 depth-layered ocean wave bands from y = 265 down to y = 500. Each wave band must be drawn as a periodic repeating profile that translates horizontally by an exact integer number of wave periods over T = 6s (or an integer divisor of 6s) so t = 6s overlays t = 0s with zero phase seam. Accent foreground wave facets with animated broken sunlit reflection shimmer dashes (#fde68a and #38bdf8).
3. Coupled Sailing Sloop: A single-masted Bermuda sloop in 3/4 oblique view with an angled hull, tapered mast, horizontal boom, taut forestay and backstay, and convex wind-billowed mainsail and triangular jib with subtle internal batten lines. Group the entire boat so it executes smooth vertical heave and +/-4 deg pitch around a transform-origin at the mid-hull waterline, phase-locked to the passing wave crest so the hull waterline never floats in mid-air above wave troughs and all sails stay attached to the mast, boom, and stays.
4. Kelvin V-Wake & Bow Spray: Feathered translucent white-cyan foam wake chevron ribbons trailing diagonally aft from the stern across the water surface, plus subtle bow spray, expanding and fading periodically in strict sync with the T = 6s cycle.

Output only the <svg>.
```

## 判读

**Pass：** `viewBox="0 0 820 500"` 且包含 `y = 265` 暮色海天渐变地平线；存在 $\ge 3$ 层整数周期无缝平铺的次摆线海浪带与 `#fde68a`/`#38bdf8` 动态碎波高光；3/4 斜视角帆船具备船体、渐细桅杆、横桁、前后支索及带帆骨线的鼓风主帆与前帆，整船围绕水线中点做与波峰锁相的升沉与 $\pm 4^\circ$ 俯仰，水线不脱离波面且帆索不脱节；具备随 $T = 6\text{ s}$ 同步舒展消退的开尔文 V 形尾迹与船首浪花；$t = 0\text{ s}$ 与 $t = 6\text{ s}$ 像素完全重合（`MAE === 0`），周期内 `max(MAE) >= 0.018`；`0 <script>` 且 XML 合法。

**Partial：** 帆船与多层海浪造型完整且闭环可运行，但波浪平铺周期未对齐导致循环接缝轻度跳变、水线偶有浮空、俯仰缺少波峰锁相，或尾迹仅微弱抖动而缺少周期性扩展消退。

**Fail：** 静态无明显运动（`max(MAE) < 0.018`）；首尾帧不重合且存在严重断层；帆船无升沉俯仰或部件明显脱节穿模；含 `<script>`、事件处理器、外部链接或 XML 语法错误。
