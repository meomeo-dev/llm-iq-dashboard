# 06 瓦特飞球调速器（Animated Watt Flyball Governor）

- 建议 ID：`animated-watt-governor-flyball-v1`
- 英文名：Animated Watt Flyball Governor

## 来源

- 作者：[@thebuggeddev](https://x.com/thebuggeddev)
- 时间：2026-11-10（关联雪花 ID `2120201759305998343` / `2120501054991216839`）
- 链接：https://x.com/thebuggeddev/status/2120201759305998343
- 热度快照：约 372–378 赞，25–26 转发（索引摘要显示原帖展示 92 零件物理柜并内嵌 60 FPS SVG 瓦特指示器）
- 交叉：原帖完整提示词未检索到且物理柜主体依赖参考图与三维渲染，本草案剥离实验柜外壳、文字标签与多余蒸汽机插画，将可独立验证的离心调速器连杆部分收束为纯内联 SVG 闭环基准。

## 讨论焦点

该题考察经典负反馈机械机构的三元几何耦合：离心飞球张角随转速规律增大时，连杆拉动套筒沿主轴上移，并通过杠杆或阀杆使节流阀塞反向下降，实现闭合机械因果而不依赖运行时脚本解算。

典型失败：

- 使用 `<script>` 或事件处理器逐帧计算三角函数坐标，违反纯声明式动画约束。
- 只用水平缩放假装主轴在自转，而飞球摆臂张角 `alpha` 静止在固定位置。
- 飞球臂长在开合过程中明显伸缩，或飞球圆心与摆臂末端铰点脱节分离。
- 左右两侧飞球臂未关于 `x = 240` 镜像对称，或套筒停滞未上升 48 px。
- 节流阀塞与套筒同向移动（同步上升而非反向下降 36 px），违背离心调速器的负反馈节流逻辑。

## 考点

飞球张角曲线 `alpha(t) = 20 + 25 * sin(pi * t / 8)` 度（20°→45°→20°）、关于垂直主轴 `x = 240` 的刚体镜像对称、定长摆臂铰接于 `(240, 160)`、滑套上升 48 px 与节流阀塞反向移动 36 px 的同步联动及首尾无缝归位。

## 提示词草案

```text
Generate one self-contained animated SVG of a generic Watt flyball governor. Side view. No text, no brand, no steam engine illustration beyond the linkage, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 480 640". CDATA around any <style>.

Parts as separate groups: vertical spindle, two flyballs on arms hinged at (240,160), a sliding sleeve, and a valve plug. Arm angle alpha is measured from straight down.

Loop T = 8s, linear in the sine argument:
alpha(t) = 20 + 25 * sin(pi * t / 8) degrees
alpha(0) = alpha(8) = 20, alpha(4) = 45. Both balls share alpha and mirror across x = 240. Sleeve height rises 48 px as alpha goes from 20 to 45, and returns. Valve plug moves the opposite way by 36 px. The spindle may spin, but spin does not replace the scored arm angle.

At t = 8 every part matches t = 0. Balls do not detach. Arms do not change length.

Output only the <svg>.
```

## 判读

**Pass：** 垂直主轴、铰接于 `(240,160)` 的双飞球臂、滑套与节流阀塞独立成组；`t = 4s` 时张角达到 `45° ± 1.5°`，`t = 0s` 与 `t = 8s` 为 `20° ± 1.5°`；左右飞球关于 `x = 240` 镜像且摆臂定长不断裂；滑套随张角增大上升 `48 px` 并归位，节流阀塞反向移动 `36 px`；首尾帧像素 `MAE === 0` 且周期内 `max(MAE) >= 0.015`；0 `<script>`。

**Partial：** 飞球臂能开合摆动且无脚本，但滑套不跟随位移、节流阀塞移动方向错误（与滑套同向）、或左右张角/臂长明显不对称。

**Fail：** 出现 `<script>` 或事件属性；仅画主轴旋转而飞球张角不动；球与臂脱节或摆臂长度明显变化；静止死图（`max(MAE) < 0.015`）；`t = 8s` 未回到 `t = 0s` 状态；出现文字/品牌/多余蒸汽机结构或 XML 语法错误。
