# 2026-11 上半月（`2026-11-h1`）20 题基准定稿归档

本目录记录从 `2026-11` 上半月 Claude Fable 5.2 与 Google Gemini 4 Carbon 相关 X / 技术博客测评中筛选并净室化定稿的 20 道 SVG 动态基准题目，已统一收录至代码分组 `2026-11-h1`（`src/core/prompt/bank/benchmarks/2026-11-h1/`）。

## 统一契约与净室原则

1. **零工具直出纯内联动态 SVG**：全部 20 题均要求单文件自包含 `<svg>`，动效仅允许 SMIL（`<animate>` / `<animateTransform>` / `<animateMotion>`）或 `<style><![CDATA[...]]></style>` 内联 CSS `@keyframes`；严禁 `<script>`、内联事件处理器、Three.js/WebGL/Canvas、`foreignObject` 与外部网络资源。
2. **闭环可判性**：所有题目均声明显式循环周期 `T` 与相位归零条件，保证终帧与首帧一致（`MAE === 0`）且关键帧具有可测量视觉位移（`max(MAE) >= 0.015` 或 `>= 0.020`）。
3. **合规净室去敏**：
   - 公寓平面图（`#11`）剔除影视版权名称，专考 90° 门扇内开、铰链位置与走廊无死结拓扑；
   - 星夜骑行（`#13`）完全匿名化为无名骑行者剪影与漩涡星夜，不含任何真实人物姓名与肖像；
   - 机甲踩纽约两题（`#14` / `#15`）将外部 OSM API 与 Three.js 替换为自包含矢量岛屿水道与等轴测桥网，并分别聚焦「起立拉伸+反应堆核心」与「等轴测巡航踩踏+冲击波 HUD」两条正交考纲；
   - 桁架塔施工（`#16`）、维也纳钢琴击弦机（`#17`）、分层等轴测调音台（`#19`）均去除真实地标、乐器厂牌与设计软件商标。

## 20 题目录索引

| # | 文档 | 题库 ID | 中文/英文标题 | `originDate` | 核心考点 |
|---:|---|---|---|---|---|
| 01 | [01-pendulum-wave-reunion.md](./01-pendulum-wave-reunion.md) | `animated-pendulum-wave-reunion-v1` | 十五摆归相 (Animated Pendulum Wave Reunion) | `2026-11` | 9 摆整周期频差行波、异相发散与 12s 同相归合 |
| 02 | [02-moire-ring-drift.md](./02-moire-ring-drift.md) | `animated-moire-ring-drift-v1` | 同心环莫尔漂移 (Animated Concentric-Ring Moire Drift) | `2026-11` | 18 层等距细环亚像素错位干涉波纹 |
| 03 | [03-iron-filings-align.md](./03-iron-filings-align.md) | `animated-iron-filings-align-v1` | 铁屑指向移动磁极 (Animated Iron Filings Magnetic Alignment) | `2026-11` | 6×6 铁屑磁偶极切线矢量重排与绕行磁极 |
| 04 | [04-venus-rose-trace.md](./04-venus-rose-trace.md) | `animated-venus-rose-trace-v1` | 金星五瓣相对轨道 (Animated Venus Five-Petal Relative Orbit) | `2026-11` | 日心角速度比与连线族包络五瓣花结 |
| 05 | [05-orrery-single-crank.md](./05-orrery-single-crank.md) | `animated-orrery-single-crank-v1` | 单摇把正反转太阳系仪 (Animated Single-Crank Reversing Orrery) | `2026-11` | 单摇把驱动双齿系、反向公转行星与太阳居中 |
| 06 | [06-watt-governor-flyball.md](./06-watt-governor-flyball.md) | `animated-watt-governor-flyball-v1` | 瓦特飞球调速器 (Animated Watt Flyball Governor) | `2026-11` | 离心抬臂角、滑套升程与节气门反相联动 |
| 07 | [07-radial-master-rod.md](./07-radial-master-rod.md) | `animated-radial-master-rod-v1` | 九缸星形发动机主副连杆 (Animated Nine-Cylinder Radial Master Rod) | `2026-10` | 主连杆与 8 根副连杆不对称冲程及 1-3-5-7-9-2-4-6-8 点火序 |
| 08 | [08-lava-blob-convection.md](./08-lava-blob-convection.md) | `animated-lava-blob-convection-v1` | 熔蜡对流颈缩与合并 (Animated Lava Blob Convection) | `2026-11` | Gooey 滤镜颈缩拉丝断裂、液滴上浮冷却下沉 |
| 09 | [09-motion-icons-audit.md](./09-motion-icons-audit.md) | `animated-motion-icons-audit-v1` | 八枚动效图标与光学网格动画 (Animated Eight Motion Tool Icons & Optical Grid) | `2026-11` | 24×24 网格 / 3px 安全边距 / 3× 构造线自审与 8s 巡检 |
| 10 | [10-physics-bounce-ball.md](./10-physics-bounce-ball.md) | `animated-physics-bounce-ball-v1` | 物理重量感纯CSS弹跳球 (Animated Physics Squash-and-Stretch Bouncing Ball) | `2026-11` | 抛物线物理 `cubic-bezier` 加速减速与接地 25%-30% 挤压 |
| 11 | [11-floorplan-door-swing.md](./11-floorplan-door-swing.md) | `animated-floorplan-door-swing-v1` | 中性公寓平面图与门扇开合动效 (Animated Architectural Floorplan & Door Swings) | `2026-11` | 4 扇门内开 90° 铰链定位、虚线圆弧与无阻塞走廊 |
| 12 | [12-tromso-aurora-fjord.md](./12-tromso-aurora-fjord.md) | `animated-tromso-aurora-fjord-v1` | 特罗姆瑟峡湾极光闭环动效 (Animated 69°N Fjord Aurora Curtains) | `2026-11` | 多层垂纹极光帷幔、静山剪影与峡湾水面倒影同步涟漪 |
| 13 | [13-starry-night-cyclist.md](./13-starry-night-cyclist.md) | `animated-starry-night-cyclist-v1` | 星夜漩涡山地骑行动效 (Animated Swirling Starry Night Cyclist) | `2026-11` | 同轴轮辐转动、脚踏曲柄闭环与夜空涡旋闭环 |
| 14 | [14-mech-nyc-atomos-typo.md](./14-mech-nyc-atomos-typo.md) | `animated-mech-nyc-atomos-typo-v1` | 北郊机甲起立与港湾步态SVG (Animated Articulated Mech Stand-Up & Harbor Gait) | `2026-11` | 多关节机甲蹲起到站立与河湾岛屿空间对应（`ATOMOS-CORE`） |
| 15 | [15-mech-nyc-stomps-hud.md](./15-mech-nyc-stomps-hud.md) | `animated-mech-nyc-stomps-hud-v1` | 等轴测网格机甲踩踏与冲击波HUD (Animated Isometric Mech Stomp Traversal & Shockwave HUD) | `2026-11` | 30° 等轴测街区桥梁、足落点椭圆冲击波与同步遥测 HUD |
| 16 | [16-lattice-tower-erection.md](./16-lattice-tower-erection.md) | `animated-lattice-tower-erection-v1` | 铆接铁桁架塔吊装施工动效 (Animated Riveted Lattice Tower Staged Erection) | `2026-11` | 四阶段桁架吊装对位、焊点脉冲与蓝图复位闭环 |
| 17 | [17-viennese-piano-action.md](./17-viennese-piano-action.md) | `animated-viennese-piano-action-v1` | 18世纪维也纳拨弦式钢琴击弦机剖面动效 (Animated 18th-Century Viennese Piano Action Cutaway) | `2026-11` | 键尾 Kapsel 反装击弦锤、擒纵嘴脱钩回弹与琴弦驻波振动 |
| 18 | [18-knitted-yarn-tension.md](./18-knitted-yarn-tension.md) | `animated-knitted-yarn-tension-v1` | 针织线圈单轴拉伸与泊松收缩动效 (Animated Knitted Yarn Loop Tension & Poisson Narrowing) | `2026-11` | 4×4 纬平针上下压茬编织、单轴拉伸与泊松横向颈缩 |
| 19 | [19-iso-layered-console.md](./19-iso-layered-console.md) | `animated-iso-layered-console-v1` | 等轴测分层音频遥测调音台动效 (Animated Isometric Layered Audio-Telemetry Console) | `2026-11` | 30° 等轴测三层爆炸落座合拢与推子/VU 仪表联动 |
| 20 | [20-sailboat-wake-waves.md](./20-sailboat-wake-waves.md) | `animated-sailboat-wake-waves-v1` | 帆船乘浪俯仰与开尔文尾迹动效 (Animated Sailing Sloop, Wave Heave & Kelvin Wake) | `2026-11` | 帆船升沉纵摇随浪相位耦合、风胀三角帆与开尔文尾迹 |
