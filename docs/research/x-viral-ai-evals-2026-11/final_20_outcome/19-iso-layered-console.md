# 19 等轴测分层音频遥测调音台动效（Animated Isometric Layered Audio-Telemetry Console）

- 建议 ID：`animated-iso-layered-console-v1`
- 英文名：Animated Isometric Layered Audio-Telemetry Console

## 来源

- 作者：[@BreejeAnadkat](https://x.com/BreejeAnadkat)
- 时间：2026-11-10（雪花 ID `2120115744168091921`）
- 链接：https://x.com/BreejeAnadkat/status/2120115744168091921
- 说明：2026-11-10 X（@BreejeAnadkat）等轴测分层矢量动效基准；净室重构为不依赖任何外部设计工具或脚本、严格 $30^\circ$ 等轴测投影的模块化野战音频与信号遥测调音台。

原讨论聚焦于多图层等轴测工业设备在爆炸装配与运行时微交互之间的协同表达。本题目剥离所有外部设计工具导出、脚本与品牌标识，收敛为 `800×540` 纯内联声明式 SVG、`T = 6s` 闭环动画：三层矢量结构沿垂直等轴测导向销完成「分离悬浮 → 齐平对接 → 内部推子/旋钮/LED/光谱仪联动 → 复位分离」。

## 讨论焦点

该类题目重点检验模型对严格 $30^\circ$ 等轴测坐标投影（`2:1` 近似或 $\cos 30^\circ$ 网格）、三阶受光面明暗关系（顶面亮、左侧中灰、右侧深灰）以及多层爆炸装配时序同步的几何控制能力。

典型失败：

- 各图层采用不一致的透视角度或近大远小透视，导致对接时边缘错位、穿模或无法齐平咬合。
- 推子滑块垂直或水平移动而非严格沿 $30^\circ$ 等轴测槽道轴线滑动，直接脱离滑轨。
- 旋钮指针以正圆旋转覆盖椭圆投影面，未按等轴测椭圆轮廓约束指示弧段。
- 玻璃频谱罩内的电平脉冲或频谱波形溢出边框，或末帧未精确回到初始爆炸分离高度导致首尾跳变。
- 引入 `<script>`、外部矢量资源或商业品牌徽标。

## 考点

严格 $30^\circ$ 等轴测投影与三向受光面体块建模、三层结构爆炸装配/拆卸零错位对齐、沿斜轴约束的五通道机动推子相位运动、等轴测椭圆旋钮弧与多段 LED/双 VU 频谱罩内裁切联动、纯声明式 SVG $T=6\text{s}$ 闭环（`MAE === 0`）。区别于复古桌面主机、服务器机柜或相机硬件造型。

## 提示词草案

```text
Generate one self-contained animated SVG of an isometric layered modular field-audio and signal-telemetry mixing console on a studio dark slate background (#0f141e). No text, no brand logos, no external assets, no audio, no script.

Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS @keyframes only. 0 <script>, 0 event handlers. viewBox="0 0 800 540". Any <style> goes inside CDATA. Well-formed XML.

Isometric geometry: strict 30-degree isometric projection (2:1 / cos 30 deg axis grid) with consistent 3-value surface shading (top-lit light, left mid-tone, right dark shadow) and clean vertical corner alignment pins.

Assemble three distinct vector elevation sublayers along the vertical stack axis:
1. Lower layer: chamfered brushed-aluminum chassis base with side heatsink fins.
2. Middle layer: modular control deck featuring 5 recessed fader tracks aligned strictly along the 30-degree isometric axis, circular rotary encoder dials projected in isometric ellipses, and tactile glowing pad buttons.
3. Upper layer: angled translucent glass telemetry visor hood enclosing a multi-bar LED meter array and dual-VU spectrum traces.

Closed kinematic loop T = 6s (states at t = 0s and t = 6s must be pixel-identical, MAE === 0, with clear in-loop motion max(MAE) >= 0.015):
- 0.0s to 1.2s: The three layers start cleanly separated along the vertical stack axis with dotted cyan alignment drop-lines visible, then glide smoothly down and dock flush together with zero inter-layer edge misalignment.
- 1.2s to 4.6s: While docked, 5 motorized fader caps glide smoothly up and down strictly inside their 30-degree isometric channel rails in staggered phases, rotary encoder indicator arcs sweep cleanly inside their dial ellipses, multi-bar LED meters pulse, and dual spectrum/VU traces animate cleanly inside the glass visor without clipping panel bezels.
- 4.6s to 6.0s: The three layers cleanly undock and rise back along the vertical alignment pins to their exact initial exploded elevation (t = 6s matches t = 0s).

Output only the <svg>.
```

## 判读

**Pass：** 严格保持 $30^\circ$ 等轴测投影与顶亮/左中/右暗三阶明暗；底盘散热片、中层五通道斜轴推子+椭圆旋钮+发光按键、顶层半透明玻璃光谱/双 VU 遮光罩三层结构完整；`0.0s–1.2s` 沿青色虚线导向销齐平对接、`1.2s–4.6s` 推子严格沿斜轴分相滑动且指针/LED/波形不越界裁切、`4.6s–6.0s` 精准复位至初始悬浮高度；$t=0$ 与 $t=6$ 像素 `MAE === 0`；周期内 `max(MAE) >= 0.015`；0 `<script>` 且无外部引用或商业标识。

**Partial：** 三层等轴测主体与 6 秒闭环基本成立，但推子略微偏离 $30^\circ$ 轨道、层间对接存在轻微错缝，或玻璃罩内频谱存在边缘轻度溢出。

**Fail：** 静态无运动（`max(MAE) < 0.015`）；非等轴测或透视混乱；首尾帧未对齐复位（`MAE > 0`）；包含 `<script>`、事件处理器或 XML 语法错误。
