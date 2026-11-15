# 05 单摇把正反转太阳系仪（Animated Single-Crank Reversing Orrery）

- 建议 ID：`animated-orrery-single-crank-v1`
- 英文名：Animated Single-Crank Reversing Orrery

## 来源

- 作者：[@kimmonismus](https://x.com/kimmonismus)
- 时间：2026-11-10 16:05 UTC（雪花 ID `2120186125591646250`）
- 链接：https://x.com/kimmonismus/status/2120186125591646250
- 热度快照：719 赞，29 转发，49 回复（同日 `@alsamahi` 转述帖 `status/2120442135862554731` 索引 0 赞，不计入独立热度）
- 交叉：X 原帖为 13 条 coding brief 之一，完整 brief 原文未公开。公开正文确认「单一控件同时驱动齿轮与折叠花瓣，正转与反转均成立」。本草案按考场纯内联 SVG 合同重构为明确齿数比、轨道角速度比与光圈开合函数的可测基准，移除交互控件、三维引擎与品牌/行星名称。

## 讨论焦点

该题走红在于考察多自由度机械与光学机构的「单输入双向可逆耦合」：仅靠一个摇把角度标量 `phi(t)`，驱动正反两半周期内齿数比、行星公转与光圈折叠同步反转而不发生脱啮或相位撕裂。

典型失败：

- 使用 `<script>` 或点击/拖拽事件驱动旋转，违反纯声明式动态 SVG 约束。
- 只做单向无限旋转，缺失 `6 < t <= 12` 的线性反转归零段，导致 `t = 12s` 无法无缝闭合。
- 16 齿齿轮 A 与 32 齿齿轮 B 啮合方向或齿数比错误，未实现 `-phi / 2` 反向半速传动或两齿轮齿牙交错打滑。
- 三颗同心轨道标志物各自独立旋转或未保持 `1 : 1/2 : 1/4` 的刚性角速度比例。
- 六瓣光圈与摇把角 `phi` 脱钩，开合半径未按 `20 + 40 * abs(sin(phi))` 随正反转周期缩放归零。

## 考点

单一驱动角 `phi(t)` 下的双向可逆齿轮啮合（16:32 反向半速）、三轨道标志物角速度比（`phi`、`phi/2`、`phi/4`）以及六瓣折叠光圈半径联动开合与无缝反转归零（区别于开放差速器的左右轮差速分配与摩天轮的重力自稳吊厢）。

## 提示词草案

```text
Generate one self-contained animated SVG of a tabletop orrery driven by one crank. No planet names, no brand, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 800 480". CDATA around any <style>. Separate groups for the crank, two gears, three planets, and one petal iris.

Loop T = 12s. Crank angle phi, in degrees:
phi(t) = 360 * t / 6 for 0 <= t <= 6
phi(t) = 360 * (12 - t) / 6 for 6 < t <= 12
So phi(0) = phi(12) = 0 and phi(6) = 360. The second half is the first half played backward. Pixel MAE at t = 12 equals t = 0.

Gear A has 16 teeth and rotates by phi. Gear B has 32 teeth, meshes with A, and therefore rotates by -phi / 2. Three orbit markers on a common center rotate by phi, phi/2, and phi/4. A six-petal iris opens by radius 20 + 40 * abs(sin(phi in radians)) and closes on the return. Teeth must stay meshed: do not let gear B spin independently of the crank.

Output only the <svg>.
```

## 判读

**Pass：** 分组完整（摇把、双齿轮、三行星、六瓣光圈）；`t = 6s` 时摇把角 `phi = 360°`、齿轮 B 旋转 `-180°`；三行星标志物旋转角满足 `1 : 1/2 : 1/4`；六瓣光圈随 `20 + 40 * abs(sin(phi))` 明显开合；后半周期 `6 < t <= 12` 所有部件严格反转回零；`t = 12s` 与 `t = 0s` 像素 `MAE === 0` 且周期内 `max(MAE) >= 0.020`；0 `<script>`。

**Partial：** 齿轮与行星能够旋转并构成太阳系仪结构，但缺少后半周期反转归零、或 16:32 齿轮转向/比例偏差、或六瓣光圈未与 `phi` 同步联动。

**Fail：** 出现 `<script>` 或事件处理器；各行星或齿轮各自无限单向旋转；光圈静止或无联动；静止死图（`max(MAE) < 0.020`）；首尾状态不一致；出现品牌名、行星文字或 XML 语法错误。
