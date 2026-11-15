# 02 同心环莫尔漂移（Animated Concentric-Ring Moire Drift）

- 建议 ID：`animated-moire-ring-drift-v1`
- 英文名：Animated Concentric-Ring Moire Drift

## 来源

- 作者：[@MiaAI_lab](https://x.com/MiaAI_lab)
- 时间：2026-11-09 23:08 UTC（雪花 ID `2119930229661503893`）
- 链接：https://x.com/MiaAI_lab/status/2119930229661503893
- 热度快照：2,615 赞（总帖包含 76 个单文件 HTML 实验）
- 仓库：https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files （单题索引 `010-op-art-pulse.txt`，标题 “Six Rooms of Optical Pressure” 第一间）
- 交叉：X 上检索到原总帖实验，未见单独以“同心环莫尔漂移”独立出圈的 Reddit 或 Hacker News 讨论串；本题由 `010-op-art-pulse.txt` 第一间“Slow Interference”净室抽提为纯内联 SVG 闭环合同。

原题是纯 CSS 的六间房欧普艺术展（使用 `scroll-snap` 与 `difference` 混合），其中第一间通过两层同心环与混合模式产生双曲线干涉条纹；原版包含页面滚动与按压交互。本草案保留核心平面光学拍频几何，改成固定组 A 与线性正反旋转组 B（各 48 环、纯黑白、8 秒闭环）的纯内联 SVG，去掉交互控制与多房间框架。

## 讨论焦点

原实验走红在于仅用纯 CSS 与确定性几何叠加即可形成强烈的感知运动错觉（“the eye does the animating”）。拆解为可客观计分的基准后，常见失败模式集中在几何与可测性约束：

典型失败：

- 使用 `<script>` 动态计算圆环或逐帧改写属性，违反纯声明式 SVG 规范。
- 只绘制一组同心圆旋转（圆心对称无干涉），或用 `opacity` 淡入淡出伪装莫尔条纹。
- 峰值角偏离 `+8°`，或组 A 与组 B 同时旋转，导致相对转角与变换不可单独测量。
- 圆环数量、8 px 等距步长或 1.5 px 线宽不准确，使双曲线干涉带消失或退化。

## 考点

两套周期同心圆环（各 48 环、8 px 间距、1.5 px 线宽）的相对微角位移产生双曲线莫尔拍频（beat）。区别于齿轮啮合或离散轨迹追踪：此处没有齿数约束或路径平移，干涉条纹间距必须随组 B 的线性往返转角（`0° -> +8° -> 0°`）连续变化，且可测旋转变换仅作用于组 B。

## 提示词草案

```text
Generate one self-contained animated SVG of a moiré interference disk. Black and white only. No text, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>.

Two groups, each 48 concentric circles, center (320,320), radii 12, 20, 28, ... px (8 px pitch), stroke 1.5, no fill. Group A is fixed. Group B rotates about (320,320).

Loop T = 8s, angles linear in each half:
t = 0 and t = 8: group B rotation = 0 degrees, pixels match.
t = 4: group B rotation = +8 degrees exactly.
The return half is the same motion reversed. Do not rotate group A. Do not fade the strokes in and out. The only moving parameter is group B's angle.

The moiré must stay visible as hyperbolic light and dark bands. Optional feBlend mode="difference" is allowed. It must not be required for the angle test: group B remains a measurable transform.

Output only the <svg>.
```

## 判读

**Pass：** 两组各 48 环、圆心 `(320,320)`、半径 `12, 20, 28, ... px`（8 px 间距）、线宽 `1.5`、纯黑白无填充；组 A 固定不动，组 B 在 `t=4` 精确旋转 `+8°` 并线性往返；双曲线明暗莫尔干涉条纹清晰可见；首尾帧 `t=0` 与 `t=8` 像素 MAE 为 0，周期内最大帧差 `max(MAE) >= 0.015`；0 `<script>`。

**Partial：** 存在双层同心环莫尔干涉，但峰值转角非 `+8°`、环数或间距不符，或两组同时旋转导致相对角变换不可单独测得。

**Fail：** 仅有一组圆环旋转（无干涉）、用透明度闪烁伪装干涉、静止图像（`max(MAE) < 0.015`）、包含 `<script>`、出现彩色或文字标签，或存在 XML 语法错误。
