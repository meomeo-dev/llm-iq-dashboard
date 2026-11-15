# 11 中性公寓平面图与门扇开合动效（Animated Architectural Floorplan & Door Swings）

- 建议 ID：`animated-floorplan-door-swing-v1`
- 英文名：Animated Architectural Floorplan & Door Swings

## 来源

- 归档来源：AI Fire（2026-11-12）《Gemini 4 Carbon Takes on Coding, 3D, and Agent Swarm Tests》
- 链接：https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests
- 说明：衍生自 AI Fire 对 Gemini 4 Carbon 与 Fable 5.2 公寓重建测评中门扇开向画反、墙体连通错误等典型几何失败案例。原测试包含影视剧场景 IP 与 Three.js 3D 渲染；本条目经过净室重构，去除一切影视剧名称、品牌、人物、家具精灵图与脚本，收敛为 `#12161f` 深色蓝图风格的纯 2D 内联声明式 SVG（`viewBox="0 0 800 560"`），以 $T = 6\text{ s}$ 线性闭环检验房间拓扑连通性、铰链锚点、$90^\circ$ 虚线清扫圆弧与不穿墙约束。

## 讨论焦点

该题专门检测模型在 2D 建筑平面几何与局部旋转坐标系（hinge pivot transform）上的一致性：既要保证中央走廊连通全部房间且无死墙或墙体重叠，又要让 4 扇 48 px 宽门扇在各自门洞的正确铰链侧向室内开启 $90^\circ$，且清扫轨迹严格重合 48 px 半径的四分之一虚线圆弧。

典型失败：

- 门扇朝向走廊外开（阻塞通道）或开合旋转方向与虚线圆弧方向相反（镜像错位）。
- 铰链旋转原点（`transform-origin` 或 `animateTransform` 旋转中心）未锚定在门洞边缘，导致门扇漂移或穿墙。
- 卧室门铰链选错侧边，导致门扇开启时扫过或撞击走廊墙体。
- 中央走廊未贯通全部房间，出现封闭死墙、错位门洞或墙线重叠。
- 引入 `<script>`、外部资产、Three.js 或家具精灵，或输出无动画静态平面图。

## 考点

2D 建筑平面拓扑连通（90 px 连续中央走廊连接左侧门厅、右上客厅、右下卧室及中间浴室）、48 px 门洞与铰链定点、门扇向各自室内线性旋转 $0^\circ \to 90^\circ \to 0^\circ$ 且全程与 48 px 虚线四分之一圆弧重合不穿墙、无脚本声明式闭环动效。

## 提示词草案

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

## 判读

**Pass：** 外墙 `(80,60)` 到 `(720,500)`（`stroke-width="6"`）与 90 px 连续中央走廊拓扑连通（门厅、客厅、卧室、浴室无死墙与重叠墙）；4 扇 48 px 门均向各自室内侧开启，铰链锚点准确（卧室门铰链靠卧室角落墙侧），`t=0` 与 `t=6` 全闭与墙齐平且 `MAE === 0`，`t=3` 全部精确开启 $90^\circ$ 并与 48 px 虚线圆弧重合且零穿墙；线性 $T=6\text{ s}$ 往返闭环，`max(MAE) >= 0.015`，0 `<script>`。

**Partial：** 走廊连通正确且闭环运转，但存在单扇门朝外开启、某扇门虚线圆弧方向反向，或开启角度明显偏离 $90^\circ$。

**Fail：** 门扇穿墙或铰链漂移、门开向走廊堵塞通路、走廊拓扑死结或墙体缺口错误、静态无运动（`max(MAE) < 0.015`）、出现影视剧/品牌/人物元素、含 `<script>` 或 XML 语法错误。
