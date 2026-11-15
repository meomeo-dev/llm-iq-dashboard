# 14 北郊机甲起立与港湾步态SVG（Animated Articulated Mech Stand-Up & Harbor Gait）

- 建议 ID：`animated-mech-nyc-atomos-typo-v1`
- 英文名：Animated Articulated Mech Stand-Up & Harbor Gait

## 来源

- 作者：社区实验帖（Fable 5.2 Yonkers Mech 基准条目）
- 时间：2026-11-10
- 链接：https://simonwillison.net/2026/Nov/10/yonkers-rises/
- 说明：源自 2026-11-10 公开测试帖中由拼写误写 `'átomos'` 触发的空间岛屿地图与巨型机甲立起任务。原始场景常依赖外部 OSM 瓦片或 Three.js/WebGL 渲染；本条目净室重构为纯内联声明式 SVG 题目，用自包含矢量港湾拓扑替代外部地图 API，并将拼写彩蛋收敛为 HUD 反应堆标识 `ATOMOS-CORE`。

## 讨论焦点

该题目考察大模型能否在单份无脚本 SVG 中同时完成两类高难度任务：其一是自包含的斜俯视港湾城市矢量拓扑（北岸高地、狭长中央岛脊、东岸城区、双河道与悬索桥跨及立体建筑体块挤出）；其二是多关节双足机甲从蹲伏待机起身至全高并执行左右交替踏步的闭环逆向/正向运动学编排。

典型失败：

- 试图引入外部瓦片、Leaflet/OSM 链接或 `<script>` + Three.js/Canvas 驱动 3D 场景，违反纯内联 SVG 约束。
- 机甲仅做成静态剪影或整体刚性上下平移，缺少髋/膝/踝多段腿部屈伸与肩/肘/腕反向摆臂耦合。
- 脚掌在踏步相位中飘浮悬空或与桥面/地形穿模，且 `t=0` 与 `t=8s` 姿势不一致导致循环跳变。
- 缺失 `ATOMOS-CORE` 反应堆脉动或高度 HUD 指示条（`0m` -> `120m`）未能与起身相位同相联动。

## 考点

斜俯视港湾岛屿矢量拓扑构建、多连杆双足机甲蹲伏-起身-踏步耦合运动学、无脚本 SMIL/CSS `T=8s` 闭环归位（`MAE === 0`）与 HUD 高度条同相联动。

## 提示词草案

```text
Generate one self-contained animated SVG of a giant bipedal sci-fi mech rising and marching across a stylized metropolitan harbor map. No external assets, no map tile requests, no WebGL, no audio, no script.

Technical contract: Pure inline SVG with SMIL (<animate>, <animateTransform>) or CSS @keyframes inside <style><![CDATA[...]]></style>. Strictly 0 <script> tags and 0 event handlers. viewBox="0 0 800 540". Well-formed XML.

Self-contained vector harbor geography (oblique top-down / orthographic elevation backdrop):
- Deep blue Hudson and East River channels separating four vector land districts: north mainland bank labeled "Yonkers" centered near (180, 140), elongated central island spine labeled "Manhattan", and east shore districts labeled "Queens" and "Brooklyn".
- Include minimalist vector suspension bridge spans across the channels and extruded architectural skyline blocks on the island spine and shore districts.

Articulated giant bipedal mech (foreground/midground, grouped cleanly by joint):
- Distinct hierarchical groups for pelvis, torso with glowing cyan chest core, head visor, left/right multi-segment arms (shoulder, elbow, wrist), and left/right multi-segment legs (hip, knee, ankle, armored feet).
- Display a crisp fictional reactor HUD badge labeled "ATOMOS-CORE" and a vertical height/posture HUD gauge ("0m" to "120m") whose indicator bar rises and lowers in exact phase with the mech.

Closed kinematic loop T = 8s (t=0s and t=8s pixel-identical, MAE === 0, peak motion max(MAE) >= 0.020):
- t=0s: crouch-ready stance anchored on the north Yonkers bank, HUD bar at 0m.
- t=0s to t=2.5s: knees extend, pelvis lifts, torso straightens to towering upright stance (HUD bar climbs to 120m), cyan chest reactor pulses and dorsal stabilizer vents flare.
- t=2.5s to t=5.5s: alternating left-right heavy-footed harbor march cadence (coordinated hip/knee bend, firm ankle foot-plant, counter-rotating torso and arm swing balance).
- t=5.5s to t=8s: smoothly reverses back into the exact t=0s crouch-ready stance and 0m HUD level so t=8s matches t=0s with zero jump.

Output only the <svg>.
```

## 判读

**Pass：** 自包含矢量港湾地图完整呈现 `Yonkers`（北岸 `(180,140)` 附近）、`Manhattan` 中央岛脊、`Queens` 与 `Brooklyn` 东岸、深蓝双河道、悬索桥与建筑挤出体块；机甲具备独立成组的躯干、发光青色核心、头部护目镜、双臂三段关节与双腿髋/膝/踝/足部；包含 `ATOMOS-CORE` 标识与 `0m`–`120m` 同相高度 HUD；`T=8s` 完整展示蹲伏起身、核心脉动/喷口点火、左右交替重步及闭环回蹲，`t=0` 与 `t=8s` 首尾像素 `MAE === 0` 且周期内 `max(MAE) >= 0.020`；0 `<script>`，无外链或脚本。

**Partial：** 港湾地图与机甲基本成形且含动态循环，但关节耦合简化（如腿部仅刚性摆动）、HUD 高度条未与起身相位同步、或 `t=8s` 回位存在轻度跳变。

**Fail：** 静态无明显运动（`max(MAE) < 0.020`）；包含 `<script>`、事件处理器或外部地图/脚本引用；首尾帧不闭合；XML 语法错误。
