# 08 熔蜡对流颈缩与合并（Animated Lava Blob Convection）

- 建议 ID：`animated-lava-blob-convection-v1`
- 英文名：Animated Lava Blob Convection

## 来源

- 作者：[@MiaAI_lab](https://x.com/MiaAI_lab)（原作）；[@aitrendz_xyz](https://x.com/aitrendz_xyz)（转述帖）
- 时间：2026-11-09 23:08 UTC（总帖雪花 ID `2119930229661503893`）；2026-11-10 13:37 UTC（转述雪花 ID `2120148925445521699`）
- 链接：https://x.com/aitrendz_xyz/status/2120148925445521699
- 总帖链接：https://x.com/MiaAI_lab/status/2119930229661503893
- 热度快照：转述帖索引 3 赞（不构成独立爆款）；总实验帖约 2,615 赞（76 份单文件 HTML 系列之一）
- 仓库：https://github.com/MiaAI-Lab/Claude-Fable-5.2-HTML-Files （对应子题 `033-lava-lamp-1971.txt`，标题 “Lava Lamp, 1971”）
- 交叉：X 上未见独立高赞熔蜡灯讨论串，热度归属于 `@MiaAI_lab` 的批量实验。

原文件 `033-lava-lamp-1971.txt` 要求以手写 WebGL 片元着色器渲染 1971 年客厅熔岩灯的平滑 metaballs（上升、颈缩、夹断、冷却、下沉）。本草案剥离 3D 场景、WebGL 与脚本，收敛为纯内联声明式 SVG（`viewBox="0 0 360 640"`，$T=10\text{ s}$ 闭环），通过路径几何颈缩与分裂合并来客观检验流体连续变形能力。

## 讨论焦点

社区将“熔蜡对流”视为检验大模型能否在无物理引擎和无着色器的条件下，仅凭矢量路径变形表达流体拓扑变化（单连通拉长、细腰夹断为双连通、回落后再融合）的试金石。与“鱼跃入云”依赖遮挡层不同，本题不存在遮挡层，完全考察连续轮廓变形与闭合对流。

典型失败：

- 用 `<script>` 或 WebGL / Canvas 实现 metaballs，违反纯声明式 SVG 要求。
- 用 `opacity` 淡入淡出或瞬移切换两个独立圆形，代替分裂前的几何颈缩（腰宽未降至最大宽度的 30% 以下）。
- 两个蜡块各自独立上下弹跳，从未真正融合成单一连续母体或分裂成双子路径。
- 合并回到 $t=10\text{ s}$ 时位置、轮廓或像素无法与 $t=0$ 严丝合缝对齐。

## 考点

浮力上升单次竖向速度反号（仅在最高点反号）、分裂前几何颈缩（腰宽 $\le 30\%$ 最大宽度）、分裂后上下分离与回落无缝合并闭环、禁止透明度伪装与禁止脚本。

## 提示词草案

```text
Generate one self-contained animated SVG of a generic lava lamp. No logo, no text, no glass brand, no script.

Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 360 640". CDATA around any <style>. One bottle silhouette, liquid, and exactly two wax blobs as separate paths.

Loop T = 10s. Blob A starts as one body at the bottom.
0.0–3.0s: it rises. Its vertical velocity changes sign only once, at the apex.
3.0–4.5s: a neck forms. The waist width falls to at most 30% of the body's maximum width, then the path splits into two subpaths.
4.5–7.0s: the upper piece stays near the top; the lower piece falls.
7.0–10.0s: the lower piece merges back, and at t = 10 the shape, position, and pixel values match t = 0.

Do not teleport the split. Do not fade one blob out and another in. The waist must be geometrically narrow before the split frame.

Output only the <svg>.
```

## 判读

**Pass：** 单瓶身轮廓、液体与两个独立路径蜡块结构清晰，无品牌与文字；0.0–3.0s 上升段仅在顶点发生一次竖向速度反号；3.0–4.5s 分裂前出现明显几何颈缩，腰部宽度 $\le$ 本体最大宽度的 30% 后再裂分为两段子路径；4.5–7.0s 上段滞留高位、下段回落；7.0–10.0s 无缝合并且 $t=10\text{ s}$ 与 $t=0$ 像素 `MAE === 0`；周期内 `max(MAE) >= 0.015`；0 `<script>` 且未用透明度淡入淡出伪装分裂。

**Partial：** 具备基本的上升与下沉阶段，但以透明度切换或硬切代替几何颈缩，或分裂腰宽明显高于 30%，或 $t=10\text{ s}$ 合并后存在位置/形状漂移。

**Fail：** 两个蜡球各自机械上下往返弹跳；静态无显著变形运动（`max(MAE) < 0.015`）；包含 `<script>`、事件处理器或外部资源；出现商标或文字；XML 语法无效。
