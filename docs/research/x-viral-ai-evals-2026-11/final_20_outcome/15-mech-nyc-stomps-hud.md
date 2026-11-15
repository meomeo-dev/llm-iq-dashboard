# 15 等轴测网格机甲踩踏与冲击波HUD（Animated Isometric Mech Stomp Traversal & Shockwave HUD）

- 建议 ID：`animated-mech-nyc-stomps-hud-v1`
- 英文名：Animated Isometric Mech Stomp Traversal & Shockwave HUD

## 来源

- 作者：Simon Willison
- 时间：2026-11-10
- 链接：https://simonwillison.net/2026/Nov/10/llm-gemini/
- 备注：2026-11-10 Simon Willison 在 Gemini 4 Carbon 测试集中记录的独立“stomps”街区跨桥巡逻与遥测 HUD 评测；原实验依赖实时街区数据、Three.js/WebGL 与脚本交互。本净室版本剥离 OSM API、Three.js/WebGL、音频与 `<script>`，收敛为 `viewBox="0 0 840 520"` 的纯内联声明式动态矢量 SVG 闭环基准，并与第 14 题（斜向浮岛蹲伏起身）在空间构型与运动学上严格区分。

## 讨论焦点

该题检验模型在无 3D 引擎与脚本辅助下，仅凭内联 SVG 构建 30 度等轴测城市街区、钢拱悬索桥与重型双足机甲联合运动的能力：机甲需沿桥梁引道踏入等轴测十字路口完成往返或 8 字闭环巡逻，双足落地震撼必须在等轴测地平面上触发同心椭圆冲击波与桥索塔楼微幅弹性回弹，且角落 HUD 遥测条与迷你雷达点必须与脚步相位严格同步而不遮挡踩踏主区。

典型失败：

- 使用 `<script>`、`Three.js`、`Canvas`、`WebGL` 或外链 OSM 瓦片/字体资源，违反零脚本纯内联 SVG 约束。
- 冲击波使用正圆而非贴合 30 度等轴测地平面的椭圆扩散，或落脚时刻与 `t=1.5s` / `t=4.5s` 相位脱节。
- 机甲仅整体平推而无髋/膝/踝关节步态与重心起伏，或 `t=6s` 未回到初始位姿导致首尾帧跳变（`MAE > 0`）。
- 遥测 HUD 不透明遮挡十字路口踩踏区，或 `L-FOOT`/`R-FOOT` 柱状图与雷达光点静止不动。

## 考点

30 度等轴测街区网格（`grid A–D`、20–75 px 阶梯棱柱楼宇与跨河钢拱悬索桥）、`T = 6s` 闭环重型双足机甲巡逻（`t=1.5s` 左足落地、`t=4.5s` 右足落地）、等轴测地平面 2 道同心椭圆冲击波与桥索/塔楼 1–2 px 弹性回弹、以及无脚本同步双足冲击柱与雷达光点的暗石板矢量 HUD。

## 提示词草案

```text
Generate one self-contained animated SVG of an isometric heavy mech stomping across a steel-arch bridge into a street-grid intersection with a telemetry HUD. No external APIs, no OSM tiles, no Three.js, no WebGL, no Canvas, no audio, no brands, no real people, no script, and no inline event handlers.

Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS only. 0 <script>. viewBox="0 0 840 520". Any <style> goes in CDATA. Well-formed XML. Only concise HUD telemetry text ("STRIDE CADENCE", "L-FOOT", "R-FOOT", "A"-"D") is allowed.

1. 30-degree Isometric Borough-Bridge Street Grid: render crisp isometric avenue blocks (sectors A-D), stepped prism towers 20-75 px tall, an isometric river channel, and a steel-arch suspension bridge with cables spanning from the north shore into the midtown intersection grid using pure SVG polygons and paths.

2. Heavy Articulated Mech Patrol (Closed Loop T = 6s): render an articulated bipedal mech striding across the bridge apron into the intersection and returning smoothly along a forward-back or figure-eight patrol loop. Pixel states at t = 0s and t = 6s must be identical (MAE === 0), with clear motion amplitude inside the loop (max(MAE) >= 0.020). Left foot plants firmly at t = 1.5s and right foot plants firmly at t = 4.5s, with synchronized hip/knee/ankle leg articulation and torso bob.

3. Concentric Shockwave Rings & Structural Sway: on each planted footfall (t = 1.5s and t = 4.5s), emit 2 concentric dashed or solid elliptical shockwave rings aligned to the 30-degree isometric ground plane that expand from the planted foot and fade to opacity 0 before loop wrap, paired with subtle 1-2 px elastic recoil on adjacent bridge cables and towers.

4. Vector Telemetry HUD Panel: dock a dark-slate corner bezel (opacity <= 0.92, zero occlusion of the intersection stomp zone) displaying "STRIDE CADENCE", an animated dual-bar step impact meter ("L-FOOT" peaking at t = 1.5s, "R-FOOT" peaking at t = 4.5s), and an active sector dot tracking the mech inside a mini isometric radar inset purely via SMIL or CSS.

Output only the <svg>.
```

## 判读

**Pass：** 30 度等轴测街区（A–D 区、20–75 px 棱柱楼群、河道与钢拱悬索桥）几何清晰；机甲在 `T = 6s` 内完成闭环跨桥巡逻且 `t=0s` 与 `t=6s` 像素完全一致（`MAE === 0`）、周期内 `max(MAE) >= 0.020`；左足 `t=1.5s`、右足 `t=4.5s` 落地各触发 2 道等轴测地面同心椭圆冲击波并伴随 1–2 px 桥索/塔楼微回弹；角落 HUD（`opacity <= 0.92`）不遮挡踩踏主区且双柱仪与雷达光点相位同步；0 `<script>`。

**Partial：** 等轴测街区与机甲巡逻闭环存在，但冲击波偏离等轴测平面（呈正圆）、桥梁回弹缺失，或 HUD 柱状图/雷达点未与 `t=1.5s`/`t=4.5s` 脚步相位同步。

**Fail：** 静态无运动（`max(MAE) < 0.020`）；首尾帧不一致导致跳变；机甲退化为无关节刚体平推；HUD 大面积遮挡主场景；包含 `<script>`、事件处理器、外链资源或 XML 语法错误。
