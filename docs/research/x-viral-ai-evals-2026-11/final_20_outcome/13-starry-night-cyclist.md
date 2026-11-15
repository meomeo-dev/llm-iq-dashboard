# 13 星夜漩涡山地骑行动效（Animated Swirling Starry Night Cyclist）

- 建议 ID：`animated-starry-night-cyclist-v1`
- 英文名：Animated Swirling Starry Night Cyclist

## 来源

- 作者：[@ebbyamir](https://x.com/ebbyamir)
- 时间：2026-11-10（推文 ID `2120284261089673376`）
- 链接：https://x.com/ebbyamir/status/2120284261089673376

原帖展示了在夜景山脊道路中结合后印象派漩涡笔触夜空与骑行者的动态三维场景。为满足零脚本、零外部依赖与净室匿名化规范，本题目剥离了所有 WebGL/Three.js 渲染与任何历史人物、画家姓名或具体画作商标指涉，收敛为 `viewBox="0 0 800 500"`、闭环周期 $T = 6\text{ s}$ 的纯内联声明式 SVG 夜景骑行题。

## 讨论焦点

该题主要考察模型在复杂分层风景 SVG 中同时协调“艺术笔触层次”与“刚体/铰接机械联动”的能力：既要写出钴蓝、靛青漩涡笔触、发光弯月与星晕、左侧火焰状柏树剪影及山谷村落尖塔等造型，又要让自行车前后轮、牙盘曲柄与匿名骑手大腿/小腿铰接连杆严格同相运转。

典型失败：

- 引入 `<script>`、事件处理器或外部脚本/纹理库，违反纯声明式 SVG 约束。
- 车轮未绕各自轮毂精确圆心旋转（导致轮圈偏心抖动或脱离车架），或脚踏/大腿小腿连杆与曲柄相位脱节。
- 自行车悬空于山脊路面之上，或轮胎嵌入路面之下。
- 天空漩涡、柏树摆动或车轮旋转角度非 $360^\circ$ 整数倍，导致 $t = 6\text{ s}$ 与 $t = 0\text{ s}$ 无法无缝闭环（`MAE > 0`），或整图静止（`max(MAE) < 0.015`）。

## 考点

多层漩涡笔触天穹旋转、月晕与星环呼吸脉动、前景柏树剪影微风摆动、山脊路面上自行车前后轮定轴转动与曲柄-下肢同相联动，以及 $T = 6\text{ s}$ 纯声明式 SVG 严格闭环。

## 提示词草案

```text
Generate one self-contained animated SVG of a poetic night-cycling scene under a swirling post-impressionist cobalt and indigo brushstroke sky. No text, no brand, no real person names, no audio, no script.

Technical contract: Pure inline animated SVG with viewBox="0 0 800 500", SMIL (<animate>, <animateTransform>) or inline CSS @keyframes inside <style><![CDATA[...]]></style>. Strictly 0 <script>, 0 event handlers, and 0 external assets, scripts, Three.js, Canvas, or WebGL. Well-formed XML.

Scene composition:
- Sky: Deep cobalt and indigo night sky filled with layered dashed and arc brushstroke bands forming at least two interlocking concentric vortex spirals, plus a golden haloed crescent moon and radiating haloed stars.
- Foreground & valley: A dark flame-shaped cypress silhouette rising on the left foreground, rolling dark-indigo ridge hills, a quiet valley village with warm lit windows and a slender steeple, and a winding ridge path across the mid-foreground.
- Cyclist: An anonymous silhouetted night cyclist riding a spoked road bicycle cleanly seated along the ridge road crown (0 wheel floating above or sinking below the road surface).

Kinematics and seamless T = 6s closed loop:
1. Both front and rear spoked wheels rotate forward cleanly around their exact hub centers by an exact integer multiple of 360 degrees over 6s with linear timing.
2. The crankset, pedal arms, and the rider's articulated thigh and shin linkages pump in phase with the crank circle without disconnecting from the hubs, bottom bracket, or saddle.
3. The interlocking sky vortex spirals rotate continuously by an exact integer multiple of 360 degrees over 6s, while the golden moon and star halos pulse gently and the cypress flame tips sway smoothly in a calm breeze.
4. Identical visual state at t = 0s and t = 6s (pixel MAE === 0) with clear motion amplitude inside the loop (max(MAE) >= 0.015).

Output only the <svg>.
```

## 判读

**Pass：** 纯内联声明式 SVG（`viewBox="0 0 800 500"`，0 `<script>`，0 外部资源，无任何真实人物或商标名称）；包含至少两组同心交织旋转的钴蓝/靛青漩涡笔触、发光弯月与星晕、左侧火焰状柏树剪影、山谷村落尖塔与山脊路面；匿名骑手与带辐条自行车稳固落于路面冠顶不悬空不穿模；前后车轮绕精确轮毂圆心、牙盘曲柄与骑手大腿/小腿同相闭合联动；天空漩涡、光晕脉动与柏树尖端摆动在 $T = 6\text{ s}$ 内均完成整数周期；$t = 0\text{ s}$ 与 $t = 6\text{ s}$ 像素 `MAE === 0` 且周期内 `max(MAE) >= 0.015`。

**Partial：** 夜景造型与循环大致正确，但车轮偏心旋转、骑手腿部与踏板脱节、轮胎轻微悬空，或某组背景动效在 $t = 6\text{ s}$ 出现微小跳变。

**Fail：** 静态无动画（`max(MAE) < 0.015`）；首尾帧无法闭环；包含 `<script>` 或外部依赖；出现真实历史人物姓名或无关品牌文字；XML 语法错误。
