# 07 九缸星形发动机主副连杆（Animated Nine-Cylinder Radial Master Rod）

- 建议 ID：`animated-radial-master-rod-v1`
- 英文名：Animated Nine-Cylinder Radial Master Rod

## 来源

- 作者：[@olezhavich](https://x.com/olezhavich) / [@danieldwalton](https://x.com/danieldwalton)
- 时间：2026-10-31 21:50 UTC（同线程回复雪花 ID `2116649200339599487`）
- 链接：https://x.com/danieldwalton/status/2116649200339599487
- 热度快照：索引 334 赞，30 转发（2026-10-31 窗口延续）
- 交叉：原帖以四模型同题对比九缸星形发动机剖视动画（原题允许 Canvas 与 CDN，并含标题字样）。本草案按纯内联 SVG 考场规范重构：移除所有标题文字、品牌标识、外部 CDN 与 `<script>`，保留深蓝工程底色与平面几何颜色，明确主副连杆铰接拓扑、720° 线性曲轴闭环及 80° 等步长隔缸发火序。

## 讨论焦点

该题走红在于同时检验大模型对「非对称多连杆拓扑」与「四冲程 720° 周期隔缸发火」的精确空间-时间耦合推理能力：星形发动机并非九根连杆共同套在曲柄销上，而是只有 1 号缸主连杆连接曲柄销，其余八根副连杆均铰接在主连杆大端的偏心销孔上，因此九个活塞的行程与上下止点相位并不等价于简单平移 `40°` 的同一正弦波。

典型失败：

- 使用 `<script>` 或 Canvas/CDN 逐帧求解连杆交点，违反纯声明式动态 SVG 约束。
- 将八根副连杆错误直接套在中心曲柄销上，忽视主连杆大端耳孔的偏置铰接拓扑。
- 九个活塞直接套用相位差 `40°` 的相同正弦往复位移，连杆长度在周期内发生明显伸缩或与活塞销脱节。
- 发火顺序按缸号 `1-2-3-4-5-6-7-8-9` 顺序点亮，或每转 360° 就全缸发火一次，未实现 720° 双转四冲程 `1-3-5-7-9-2-4-6-8` 隔缸 80° 步进。
- 活塞越过气缸顶部缸盖或末帧 `t = 8s` 与 `t = 0s` 曲柄角度、连杆姿态不一致。

## 考点

1 号主连杆与 8 根副连杆的非对称铰接拓扑（仅主连杆接曲柄销、副连杆接主连杆大端）、非简单移相正弦的真实活塞往复行程与上下止点换向，以及 `T = 8s`（720° 两转）线性曲轴闭环下的 80° 步长隔缸发火序 `1-3-5-7-9-2-4-6-8`。

## 提示词草案

```text
Generate one self-contained animated SVG cutaway of a nine-cylinder radial engine, front view. No title, no brand, no script, no CDN.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>. Navy background, flat technical colors.

Nine cylinders at 0, 40, 80, ..., 320 degrees. Cylinder 1 is at the top. One crank pin. The master rod of cylinder 1 is pinned to that crank pin. The other eight rods are pinned to the master rod's big end, not to the crank pin. Do not animate the eight pistons with the same sine shifted by 40 degrees.

Loop T = 8s = two crank revolutions = 720 degrees of crank, linear. Each cylinder fires once per 720 degrees. Firing order is 1, 3, 5, 7, 9, 2, 4, 6, 8, which is an 80 degree crank step. A firing is a 0.15s flash in that cylinder only. At t = 0 and t = 8 the crank angle is 0 and every rod matches. Piston motion must reverse at the two ends of the stroke, not slide through the head.

Output only the <svg>.
```

## 判读

**Pass：** 九个气缸沿 `0°, 40°, 80°, ..., 320°` 均布且 1 号缸位于正上方；仅 1 号缸主连杆连接单曲柄销，其余 8 根副连杆均铰接在主连杆大端耳孔；活塞在气缸内于上下止点平滑换向且不穿出缸盖；`T = 8s` 对应曲轴线性旋转 `720°`（两圈），每缸在 720° 内仅发火一次（每次约 `0.15s` 闪光），严格遵循每 `80°` 曲柄角步进的 `1-3-5-7-9-2-4-6-8` 发火序；`t = 0s` 与 `t = 8s` 像素 `MAE === 0` 且周期内 `max(MAE) >= 0.020`；0 `<script>` 且无标题/品牌/CDN。

**Partial：** 九缸均布、曲轴旋转与发火动画成立，但 8 根副连杆错误直接套在曲柄销上，或发火顺序变为连续 `1-2-3-...` / 每 360° 重复一次。

**Fail：** 出现 `<script>`、事件处理器或外部 CDN；九个活塞使用简单移相正弦导致连杆脱节或穿出缸盖；静止死图（`max(MAE) < 0.020`）；首尾帧不闭合；出现标题、品牌字样或 XML 语法错误。
