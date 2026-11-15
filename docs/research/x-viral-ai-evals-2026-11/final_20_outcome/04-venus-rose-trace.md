# 04 金星五瓣相对轨道（Venus Rose Trace）

- 建议 ID：`animated-venus-rose-trace-v1`
- 英文名：Animated Venus Five-Petal Relative Orbit

## 来源

- 作者：[@MiaAI_lab](https://x.com/MiaAI_lab)
- 时间：2026-11-09 23:08 UTC（雪花 ID `2119930229661503893`）
- 链接：https://x.com/MiaAI_lab/status/2119930229661503893
- 热度快照：2,615 赞（索引快照）
- 仓库：https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files （对应子题 `042-dance-of-venus.txt`）

原帖用单条总提示驱动生成 76 个独立单文件 HTML，其中 `042-dance-of-venus.txt` 以 13:8 轨道共振为题，每隔几天在地球与金星之间连线、在 8 年周期内织出五瓣玫瑰。本草案只保留地心相对轨迹几何，改写为纯内联 SVG 闭环契约：地球固定在画布中心 `(320,320)`，16s 闭环内由半径为 3 的笔尖追踪轨迹并用 `stroke-dashoffset` 逐步揭示五瓣曲线，去掉脚本、交互控件、行星天体插画与文字标签。

## 讨论焦点

该题考察模型能否把双圆日心轨道的矢量差 $R(t) = V(t) - E(t)$ 精确落成封闭的五瓣相对曲线，而不是凭视觉印象画出泛化螺线或对称花纹。

典型失败：

- 使用 `<script>` 在 Canvas 或 SVG 中逐帧计算三角函数点列，违反纯声明式动画合同。
- 画成对数螺线、椭圆或 6 瓣/8 瓣对称装饰图案，而非 13:8 共振对应的 5 个内环。
- 仅给出静止完整路径而无笔尖运动，或笔尖运动与 `stroke-dashoffset` 描边揭露节奏脱节。
- 5 次近地点角距偏离 $72^\circ$ 过多，或 `t=0` 与 `t=16` 的笔尖位置与描边状态未闭合。

## 考点

13:8 轨道共振矢量减法、五内环拓扑与 5 次近地点 $72^\circ$ 等分、半径 3 笔尖追踪与 `stroke-dashoffset` 同步揭露、16s 首尾精准闭环。

## 提示词草案

```text
Generate one self-contained animated SVG of the geocentric relative orbit of Venus under an exact 13:8 period ratio. No labels, no planets as illustrations, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 640 640". CDATA around any <style>.

Earth is fixed at (320,320). Use circular coplanar orbits and an exact ratio, so the curve closes:
E(t) = (cos(2*pi*t/16), sin(2*pi*t/16))
V(t) = 0.723 * (cos(13*2*pi*t/16), sin(13*2*pi*t/16))
R(t) = V(t) - E(t)
Screen point = (320,320) + 150 * R(t)
t runs from 0 to 16 seconds, standing for 8 years.

A pen of radius 3 follows that point. A polyline or path stroke reveals the curve as the pen moves, using stroke-dashoffset only. At t = 0 and t = 16 the pen is at the same coordinate, the stroke state matches, and pixel MAE is 0.

The finished curve has exactly five inner loops. The five closest approaches of the pen to Earth are 72 degrees apart around (320,320), tolerance 2 degrees. Do not draw a logarithmic spiral. Do not add a sixth petal.

Output only the <svg>.
```

## 判读

**Pass：** 固定地球于 `(320,320)`，完成曲率连贯的五瓣相对轨道且恰好含 5 个内环；5 次近地点绕中心间隔 $72^\circ \pm 2^\circ$；半径 3 的笔尖轨迹与 `stroke-dashoffset` 描边揭露同步；`t=0` 与 `t=16` 笔尖同坐标且像素 MAE ≡ 0，周期内最大帧差 `max(MAE) >= 0.015`；0 `<script>`，无文字与行星插画。

**Partial：** 具备五瓣轮廓或笔尖运动，但内环数偏差、近地点角距误差超过 $2^\circ$，或笔尖与 `stroke-dashoffset` 揭露轻微脱节。

**Fail：** 出现 `<script>`；画成对数螺线、椭圆或六瓣装饰图；静止全图无笔尖运动（`max(MAE) < 0.015`）；无封闭矢量 SVG 或 XML 语法错误。
