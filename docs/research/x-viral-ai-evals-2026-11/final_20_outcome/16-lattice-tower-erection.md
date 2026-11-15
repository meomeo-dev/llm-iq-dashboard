# 16 铆接铁桁架塔吊装施工动效（Animated Riveted Lattice Tower Staged Erection）

- 建议 ID：`animated-lattice-tower-erection-v1`
- 英文名：Animated Riveted Lattice Tower Staged Erection

## 来源

- 发布方：Google DeepMind（Gemini 4 Carbon 发布博文）
- 时间：2026-11-10
- 链接：https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/
- 原始背景：2026-11-10 Gemini 4 Carbon 发布博文中展示的等轴测分段钢结构铁塔吊装施工演示；本条目按净室（clean-room）规范剥离任何真实地标商标、地名与外部脚本/渲染引擎依赖，收敛为纯内联声明式动态 SVG。

## 讨论焦点

该题主要检验模型对复杂斜交桁架拓扑、抛物线收分轮廓以及多阶段时间轴编排的协同控制能力：四根倾斜主塔柱需经拱形下层桁架与两级观景平台逐段向上收敛至纤细塔冠与尖塔桅杆，同时塔侧爬升起重机与拼装焊点火花、高程进度条保持严格相位同步。

典型失败：

- 桁架斜腹杆与角柱节点未闭合，出现悬空断杆或跨层穿模。
- 塔身四段吊装与起重机臂仰角/回转、高程进度条脱节，未按 `Level 1 -> Level 2 -> Upper Shaft -> Spire` 顺序就位。
- 使用 `<script>` 或外部资源，或引入真实地标商标/外部字体。
- 周期末段未能回退至虚线蓝图态，导致 `t = 0s` 与 `t = 8s` 首尾帧像素不一致（`MAE !== 0`）。

## 考点

等轴测/斜投影铆接铁桁架几何拓扑、四阶段抛物线收分分段吊装时序、爬升起重机联动追踪、节点闪烁与高程标尺同步、`T = 8s` 闭环复原及纯声明式无脚本 SVG。

## 提示词草案

```text
Generate one self-contained animated SVG depicting the staged erection of a parabolic tapered riveted lattice iron tower. No real landmark names, no brand, no real people, no external assets, no audio, no script.

Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS @keyframes only. 0 <script>, 0 event handlers. viewBox="0 0 800 560". Any <style> goes inside <![CDATA[...]]>. Well-formed XML.

Visual style: Engineering twilight blueprint aesthetic on a deep navy background (#0e1522). Crisp oblique/isometric vector ironwork using amber-steel and bronze-slate trusses paired with cool cyan blueprint plumb lines and a dashed target silhouette.

Fixed base & rig: Centered on baseline (400, 495), draw a fixed ground baseplate with 4 symmetric splayed stone foundation piers and a climbing mast crane positioned beside the central axis. Every truss diagonal must meet its corner chord node cleanly with zero floating detached members.

Four parabolic tapered lattice stages:
1. Stage 1: 4 inclined leg pylons joined by an arched lower truss bridge and Level-1 observation deck.
2. Stage 2: Tapered mid-shaft converging legs and Level-2 gallery deck.
3. Stage 3: Slender upper shaft lattice panels.
4. Stage 4: Crown gallery and tapered lattice spire mast with top beacon.

Animation sequence (closed loop T = 8s):
- At t = 0s (and t = 8s): Only the stone foundation piers, ready crane boom, faint cyan dashed blueprint target outline, and 0% elevation bar are visible; pixels at t = 0s and t = 8s must match identically (MAE === 0).
- 0.5s to 6.0s: The crane boom rotates and tracks upward while Stages 1 through 4 sequentially hoist into exact pinned alignment (Level 1 -> Level 2 -> Upper Shaft -> Spire), with brief rivet-weld spark flashes at seam joints and a phase-synchronized vertical elevation marker bar advancing from 0% to 100%.
- 6.0s to 6.8s: Hold the completed illuminated tower with steady top beacon.
- 6.8s to 8.0s: Cleanly dissolve the lifted ironwork back down to the initial dashed blueprint state at t = 0s.

Output only the <svg>.
```

## 判读

**Pass：** 呈现 `#0e1522` 深蓝图背景、`(400, 495)` 基线四座石墩基座、旁侧塔吊、四段抛物线收分桁架与塔尖信标；斜腹杆节点全闭合无悬空断杆；`0.5s–6.0s` 起重机与 `Level 1 -> Level 2 -> Upper Shaft -> Spire` 顺序吊装、接缝火花及 `0%–100%` 高程条严格同步；`6.0s–6.8s` 稳态保持后于 `6.8s–8.0s` 复原；`t=0s` 与 `t=8s` 首尾帧像素 `MAE === 0` 且周期内 `max(MAE) >= 0.020`；0 `<script>`；无商标、真实地标名或人物。

**Partial：** 四段塔身基本完整且满足 `T=8s` 闭环，但局部桁架斜杆浮空未接节点、起重机未随吊装高度联动、接缝闪烁或高程条缺省/不同步。

**Fail：** 静态无运动（`max(MAE) < 0.020`）；首尾帧不闭合（`MAE > 0`）；塔身各段杂乱同时弹出无阶段序；包含 `<script>`、事件处理器、外部资源、真实地标商标或 XML 语法错误。
