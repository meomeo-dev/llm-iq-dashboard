# 03 铁屑指向移动磁极（Animated Iron Filings Magnetic Alignment）

- 建议 ID：`animated-iron-filings-align-v1`
- 英文名：Animated Iron Filings Magnetic Alignment

## 来源

- 作者：[@MiaAI_lab](https://x.com/MiaAI_lab)
- 时间：2026-11-09 23:08 UTC（雪花 ID `2119930229661503893`）
- 链接：https://x.com/MiaAI_lab/status/2119930229661503893
- 热度快照：2,615 赞（所属总实验帖为一条总提示生成 100 个独立 HTML、实际停在 76 个，约 2.489 亿 token、约 $512；单件提示索引为 `013-iron-filings.txt`）
- 仓库：https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files
- 交叉：X 上没有检索到单独以“iron filings”为标题的 11 月热帖，热度属于总实验。

原文件 `013-iron-filings.txt` 是一张白纸撒满铁屑、底下可拖拽磁铁的 Canvas 桌面玩具。本草案去掉了 Canvas、脚本与鼠标拖拽交互，改写为 24 根 6×4 网格铁屑加单个横向简谐移动圆磁极的纯内联 SVG 闭环契约；为保证客观可判，合同采用单磁极向心模型，要求每根铁屑长轴实时指向磁极中心，避免用主观场线或手绘效果打分。

## 讨论焦点

帖子的评测价值在于每根铁屑的朝向都是其自身坐标与动磁极坐标之间的非线性 `atan2` 函数，磁极一动，24 根铁屑必须绕各自几何中心同步差动旋转，既不是刚体平动，也不是步态或流体平流。

典型失败：

- 用 `<script>` 逐帧计算 `Math.atan2` 并修改 `transform`，违反纯声明式动画要求。
- 铁屑随磁铁一起水平平移，或者未以各自中心为枢轴旋转导致网格散架。
- 所有铁屑共用同一关键帧旋转角度，或仅中心几根旋转而边缘铁屑静止。
- 用随机抖动伪装响应，导致 `t = 0, 2, 4, 6, 8` 五个采样时刻朝向误差超过 `2°`。

## 考点

6×4 网格原地定轴枢转、多目标实时向心 `atan2` 角度追踪、磁极横向简谐往复与全图 `T = 8 s` 无缝闭环。

## 提示词草案

```text
Generate one self-contained animated SVG of iron filings on a sheet, with one round magnet moving underneath. No text, no script, no hands.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 400". CDATA around any <style>.

24 filings, a 6 by 4 grid, centers at x = 80 + c * 96, y = 70 + r * 80, c = 0..5, r = 0..3. Each filing is a 28 px line in its own group, pivoted at its center.

The magnet center moves on
x(t) = 320 + 160 * sin(2 * pi * t / 8)
y(t) = 200
with T = 8s. At t = 0 and t = 8 the magnet is at (320,200) and every pixel matches.

At every instant each filing's angle is
atan2(y_magnet - y_filing, x_magnet - x_filing)
measured from the +x axis. Tolerance at t = 0, 2, 4, 6, 8 is 2 degrees. Filings do not translate. Only the magnet translates, and only the filings rotate.

Output only the <svg>.
```

## 判读

**Pass：** 24 根铁屑按 6×4 网格（`x = 80 + c * 96`，`y = 70 + r * 80`）排列且全周期不平移；圆磁极按 `x(t) = 320 + 160 * sin(2 * pi * t / 8)`、`y(t) = 200` 往复运动；在 `t = 0, 2, 4, 6, 8` 秒五个抽样时刻每根铁屑朝向 `atan2(y_magnet - y_filing, x_magnet - x_filing)` 误差 `<= 2°`；首尾帧像素 MAE 为 0，周期内最大帧差 `max(MAE) >= 0.015`；无 `<script>`。

**Partial：** 磁铁在移动，但铁屑转角与磁极位置脱节、仅少数几条旋转，或抽样时刻朝向误差超过 `2°`。

**Fail：** 铁屑随磁铁平移或绕错枢轴漂移；随机抖动；包含 `<script>`；静态死图（`max(MAE) < 0.015`）或 XML 语法错误。
