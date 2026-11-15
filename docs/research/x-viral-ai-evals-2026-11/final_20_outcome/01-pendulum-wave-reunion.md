# 01 十五摆归相（Animated Pendulum Wave Reunion）

- 建议 ID：`animated-pendulum-wave-reunion-v1`
- 英文名：Animated Pendulum Wave Reunion

## 来源

- 作者：[@MiaAI_lab](https://x.com/MiaAI_lab)
- 时间：2026-11-09 23:08 UTC（雪花 ID `2119930229661503893`）
- 链接：https://x.com/MiaAI_lab/status/2119930229661503893
- 热度快照：总帖索引约 2,615 赞（“100 个单文件 HTML”实验停在 76 份，后续帖记约 2.489 亿 token、约 $512；热度属于总实验而非单件）
- 仓库：https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files （单件提示文件 `037-pendulum-wave.txt`，8,174 字符）
- 交叉：X 上没有检索到单独以“pendulum wave”为标题的 11 月热帖。

原文件 `037-pendulum-wave.txt` 要求以 Canvas 2D 绘制 15 摆 60 秒周期的精确解析模拟，并附带五声音阶音效、时间轴拖拽与多视角切换。本草案剥离脚本、音频与交互控件，将题目收敛为 9 摆、$T = 6\text{ s}$ 闭环的纯内联声明式 SVG，以可量测摆角检验解析余弦与可公度周期归相。

## 讨论焦点

该作品在社区被用作“模型能否写出闭式解析物理而不靠每帧积分产生数值漂移”的代表样例：摆群从同相释放出发，依次演化为行波、表观混沌、双列与三列交错，最终在整周期点同时回到初始平面。

典型失败：

- 用 `<script>` 或 `requestAnimationFrame` 驱动摆角，违反纯声明式动画约束。
- 所有摆采用同一振荡周期或任意随机频率，无法形成 $t=3\text{ s}$ 奇偶反相与 $t=6\text{ s}$ 齐整归相。
- 直接使用默认 `ease-in-out` 或粗糙少数关键帧，破坏过零时刻与 $\pm 16^\circ$ 极值采样。
- 摆锤直接穿过顶部横梁，或未按独立分组绘制导致无法测量各摆角度。

## 考点

多自由度可公度周期（commensurate periods）同相归零、解析余弦相位 $\theta_i(t)=16\cos(2\pi n_i t/6)$、$t=3\text{ s}$ 奇偶反相、无脚本纯声明式 SVG 闭环。区别于机械擒纵、多足步态与对数螺线。

## 提示词草案

```text
Generate one self-contained animated SVG of a pendulum wave. No text, no brand, no audio, no script.

Technical contract: SMIL or inline CSS only. 0 <script>. viewBox="0 0 900 360". Any <style> goes in CDATA. Well-formed XML.

Nine pendulums, index i = 0..8, pivots at x = 90 + i * 90, y = 70. Each rod length may differ, but the swing angle is the scored quantity. Released together from +16 degrees.

Closed loop T = 6s. Pendulum i completes exactly n_i = 4 + i full oscillations in 6s. Angle in degrees, clockwise positive, zero is straight down:

theta_i(t) = 16 * cos(2 * pi * n_i * t / 6)

Sample this formula at t = 0, 0.25, 0.5, ..., 6.0. At the sample instants the rendered angle must match the formula within 1.5 degrees. Between samples use the formula, not a sine keyword and not an ease-in-out that changes the zeros.

At t = 0 and t = 6 every pendulum is at +16 degrees and the pixels match. At t = 3, pendulums with odd n_i are at -16 degrees and pendulums with even n_i are at +16 degrees. Rods are separate groups so each angle can be measured. Bobs do not pass through the support bar.

Output only the <svg>.
```

## 判读

**Pass：** 9 根摆独立成组且支点为 `(90 + i*90, 70)`；$t=0$ 与 $t=6$ 全员位于 $+16^\circ$ 且首尾帧 `MAE === 0`；$t=3$ 时奇数 $n_i$ 位于 $-16^\circ$、偶数 $n_i$ 位于 $+16^\circ$；以 `0.25s` 步长抽样测量各摆角与公式误差均 $\le 1.5^\circ$；摆锤不穿过横梁；周期内 `max(MAE) >= 0.015`；0 `<script>`。

**Partial：** 9 摆数量与 6s 闭环正确，但归相时刻错位、部分摆未到达 $\pm 16^\circ$，或 $t=3$ 奇偶反相不严格。

**Fail：** 静态无运动（`max(MAE) < 0.015`）；所有摆同周期未形成行波；缓动毁坏过零点；包含 `<script>`；XML 语法错误。
