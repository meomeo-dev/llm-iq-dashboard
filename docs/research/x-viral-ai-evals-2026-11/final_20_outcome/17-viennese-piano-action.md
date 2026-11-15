# 17 18世纪维也纳拨弦式钢琴击弦机剖面动效（Animated 18th-Century Viennese Piano Action Cutaway）

- 建议 ID：`animated-viennese-piano-action-v1`
- 英文名：Animated 18th-Century Viennese Piano Action Cutaway

## 来源

- 发布方：Google Gemini 官方发布博客
- 时间：2026-11-10
- 链接：https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/
- 备注：2026-11-10 Google Gemini 4 Carbon 发布博文展示的历史维也纳式擒纵钢琴击弦机评测题；本条目做净室化处理，剥离任何制琴师/品牌商标与三维脚本渲染引擎依赖，收敛为纯二维机械剖面动效 SVG。

## 讨论焦点

该题专门检验模型是否真正理解 18 世纪维也纳拨弦式击弦机（*Prellmechanik*）与现代双擒纵击弦机的本质拓扑差异：维也纳式的槌柄直接枢接在琴键尾部自带的音叉托架（*Kapsel*）上，且槌头朝前（向左）上方指向平衡销上方，而非架设在独立固定的总槌档上。

典型失败：

- 将击弦机构造错画成现代立式或现代三角钢琴的独立固定槌轴架，槌柄从琴键分离。
- 槌头朝右而非朝左上方指向平衡销上方，或缺失后部独立的擒纵档与弹簧擒纵喙（*Auslösezunge*）及槌尾喙（*Schnabel*）啮合结构。
- 击弦后槌头直接穿模越过琴弦，或在琴键仍按下期间未实现擒纵脱开与托木唇（backcheck）微幅回落缓冲。
- 琴弦两端未锚定在弦轴板与弦马销之间、整体刚性平移而非基频驻波包络振动，或制音毡未在敲击前抬离并在复位时落回。
- 含 `<script>` 标签、静态无动态（`max(MAE) < 0.015`）或首尾帧未严格对齐。

## 考点

18 世纪维也纳 *Prellmechanik* 单键擒纵拓扑（键尾音叉托架随键同步升降、朝后枢接且槌头朝左前方的槌柄、弹簧擒纵喙拨脱机制、制音器联动与托木接槌）、击弦瞬时非穿模回弹、基频驻波衰减与 $T=4\text{ s}$ 纯声明式 SVG 闭环。

## 提示词草案

```text
Generate one self-contained animated 2D mechanical cutaway SVG of an 18th-century Viennese Prellmechanik grand piano single-key escapement action. No maker name, no brand, no audio, no script.

Technical contract: SMIL (<animate>, <animateTransform>) or inline <style><![CDATA[...]]></style> CSS @keyframes only. Strictly 0 <script> and 0 event handlers. viewBox="0 0 820 460". Well-formed XML.

Visual style: warm mechanical schematic on dark slate #11161d, brass #d97706, pearwood/maple tones #e5b887 and #b45309, tensioned steel treble string #e2e8f0, crisp exploded pivot pins, and dashed arc guides.

Authentic Viennese Prellmechanik topology:
1. Fixed keybed and balance-rail fulcrum pin supporting a horizontal key lever (front key head on the left, key tail extending right).
2. Brass/wood fork bracket (Kapsel) mounted directly onto the rear section of the key lever, carrying a backward-facing pivoted hammer shank whose tapered felt-tipped hammer head points forward/left above the balance rail (NOT mounted on a separate hammer rail).
3. Fixed rear escapement rail and spring-loaded escapement hopper/beak (Auslosezunge) positioned so its upper ledge engages the rear hammer tail (Schnabel) until key elevation trips the beak backward.
4. Overhead damper arm with felt pad resting on a fixed horizontal steel string strung cleanly between a left pin block and a right bridge pin, plus a backcheck lip catching hammer rebound.

Closed kinematic loop T = 4s (t = 0s and t = 4s pixel-identical):
- 0.0s-0.7s: front key depresses smoothly downward about the balance pin (~5-7 deg); key tail and fork rise, pushing the hammer tail under the escapement beak so the hammer head swings rapidly upward toward the string while the damper lifts cleanly off the string.
- 0.7s-1.0s: hammer crown strikes the string cleanly at t ~= 0.85s with a brief impact ring; escapement beak snaps free so the hammer rebounds slightly below the string even while the key remains momentarily held down (escapement check phase, zero clipping through the string).
- 1.0s-1.8s: horizontal string oscillates in a clear fundamental standing-wave envelope anchored at both bridge endpoints, decaying smoothly.
- 1.8s-4.0s: front key rises back to rest, spring beak resets under the hammer butt, and damper settles cleanly onto the stationary string so t = 4.0s matches t = 0.0s identically.

Output only the <svg>.
```

## 判读

**Pass：** 完整呈现维也纳 *Prellmechanik* 拓扑（键尾直接承载音叉托架、槌头朝左前上方、独立擒纵喙拨脱槌尾、制音毡与托木唇配合）；`t=0s` 与 `t=4s` 像素完全一致（`MAE === 0`）且周期内 `max(MAE) >= 0.015`；`t ≈ 0.85s` 击弦无穿模且在键未抬起前呈现擒纵回落、琴弦以两端锚点作基频驻波衰减；`0 <script>`。

**Partial：** 闭环动效与主要连杆运动正常，但将槌轴错架在独立槌档上、缺少擒纵喙脱开回落阶段，或琴弦振动两端未锚定。

**Fail：** 静态无运动（`max(MAE) < 0.015`）、槌头直接穿过琴弦、关键构件缺失、包含 `<script>` 或出现制琴师/品牌商标文本。
