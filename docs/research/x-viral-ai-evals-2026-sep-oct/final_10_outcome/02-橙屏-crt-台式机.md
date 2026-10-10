# EVAL-2026-Q3Q4-D3-02: 动态橙屏 CRT 台式机

> **所属领域**：多模态空间几何、装配与 SVG 矢量代码 (Multimodal Spatial Geometry & Dynamic SVG)  
> **题目全局编号**：`EVAL-2026-Q3Q4-D3-02`  
> **项目规范标识 (PromptSpec ID)**：`animated-iso-amber-crt-v1`  
> **题目全称**：动态橙屏 CRT 台式机（Animated Amber CRT Workstation）  
> **对齐基准模板**：参考 [`ANIMATED_PELICAN_PROMPT`](file:///Users/luojin/git/git-my-code/llm_iq_dashboard/src/core/prompt/data-classic.ts#L90-L116)  

---

## 1. 项目标准提示词模板 (PromptSpec Template)

```text
Generate an animated SVG of a vintage desktop computer workstation with a CRT monitor, a tiered keyboard, and a coiled cable in 30-degree isometric projection featuring pure inline SVG animation (SMIL <animate>/<animateTransform> or inline CSS @keyframes).
Render in a dark hairline technical figure style (near-black solids on a dark background, crisp 1px hairline edges with a subtle top-front highlight line, and at most 5% focal accent glow).
The CRT screen must exhibit a warm amber/orange phosphor luminance (#FF8C00 to #FFA500) confined strictly to the display area and bezel rim via localized gradients.
Animations must run smoothly and continuously in a modern browser with zero JavaScript:
1. A subtle, translucent horizontal scanline highlight band must continuously and smoothly sweep downwards across the CRT screen face.
2. The amber screen phosphor must exhibit a gentle, rhythmic breathing luminance pulsation while throwing a faint, localized warm light spill onto the desk plinth.
3. A terminal command prompt cursor on the screen must blink steadily at a 2 Hz cadence.
4. The entire animation cycle must loop seamlessly: visual states at t = 0s and t = T must be mathematically identical with zero jump.
The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).
```

---

## 2. 客观参考标准 (PromptStandard)

- **核心考点与鉴别维度 (`coreKey`)**：
  凸曲面 CRT 投影面板、向下扫描线滚扫、单焦点琥珀色发光与整周期闭合。
- **客观参考标准 (`groundTruth`)**：
  1. 30° 等轴测投影，机体与底板（plinth）深度层叠严密，平行线公差 $|\Delta \theta| \le 2.0^\circ$；
  2. CRT 显示器前脸具有曲面弧度或内嵌框（inset bezels），所有屏幕细节与扫描线严格以 `<clipPath>` 限位于屏内；
  3. 橙色荧光像素全图面积占比严格控制在 $1.0\% \sim 5.0\%$ 之间，机箱外表维持克制中性灰阶；
  4. 扫描线向下平滑滚动，所有子动画周期均为总周期 $T$ 的整除数，首尾帧位图差分 $\text{MAE}(t_0, t_T) \equiv 0.000$ 且过程帧位图差分 $\max_{k} \text{MAE}(t_0, t_k) \ge 0.015$（杜绝死图欺诈）。
- **判定标准与量规 (`evaluationCriteria`)**：
  - **Pass (满分)**：扫描线平滑向下滚扫且无越界溢出；琥珀色发光面积严格 $\le 5\%$；电缆呈现空间螺旋环层叠；首尾帧完全闭合（$\text{MAE} \equiv 0$ 且 $\max(\text{MAE}) \ge 0.015$）；0 `<script>` 且 XML 语法严格合规。
  - **Partial (及格)**：动画在动但扫描线越出屏幕边缘、整机发光溢出（$> 5\%$ 且 $\le 15\%$）、或循环接缝处存在跳闪断裂。
  - **Fail (零分)**：纯静态死图（$\max(\text{MAE}) < 0.015$）；含有 JavaScript；发光溢出 $> 15\%$；非等轴测退化；XML 解析报错。
- **参考出处 (`referenceSource`)**：
  <https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee>

---

## 3. 代码级注册规格 (TypeScript PromptSpec)

```typescript
export const ANIMATED_ISO_AMBER_CRT_PROMPT: PromptSpec = {
  id: "animated-iso-amber-crt-v1",
  label: "动态橙屏 CRT 台式机 (Animated Amber CRT Workstation)",
  template: [
    "Generate an animated SVG of a vintage desktop computer workstation with a CRT monitor, a tiered keyboard, and a coiled cable in 30-degree isometric projection featuring pure inline SVG animation (SMIL <animate>/<animateTransform> or inline CSS @keyframes).",
    "Render in a dark hairline technical figure style (near-black solids on a dark background, crisp 1px hairline edges with a subtle top-front highlight line, and at most 5% focal accent glow).",
    "The CRT screen must exhibit a warm amber/orange phosphor luminance (#FF8C00 to #FFA500) confined strictly to the display area and bezel rim via localized gradients.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. A subtle, translucent horizontal scanline highlight band must continuously and smoothly sweep downwards across the CRT screen face.",
    "2. The amber screen phosphor must exhibit a gentle, rhythmic breathing luminance pulsation while throwing a faint, localized warm light spill onto the desk plinth.",
    "3. A terminal command prompt cursor on the screen must blink steadily at a 2 Hz cadence.",
    "4. The entire animation cycle must loop seamlessly: visual states at t = 0s and t = T must be mathematically identical with zero jump.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee",
  verified: true,
  immutable: true,
  originDate: "2026-10",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "凸曲面 CRT 投影面板、向下扫描线滚扫、单焦点琥珀色发光与整周期闭合",
    groundTruth: "标准 30° 等轴测；屏幕内部使用 clipPath 限位；扫描线向下匀速移动；橙色发光像素严格在 1%~5% 之间；循环周期无缝闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015；绝对零脚本安全。",
    evaluationCriteria: "Pass: 扫描线平滑向下滚扫且限位于屏内，琥珀微光 <= 5%，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 动画在动但扫描线轻微溢出或发光在 5%~15%；Fail: 纯静态死图（max MAE < 0.015）、含 script、非等轴测退化或 XML 语法错误。",
    referenceSource: "https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee",
  },
};
```

---

## 4. 题目来源与背景说明 (Provenance & Benchmark Context)

1. **来源出处 (Source Attribution)**：源自 Kris Chase 2026 年 10 月公开等轴测项目中的 CRT 显像管技术图解与扫描线动态构想（Gist: <https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee>），许可为“Free to use, remix, ship”。
2. **评测设计背景 (Evaluation Motivation & Value)**：测试模型对凸曲面显像管几何建模、由 `<clipPath>` 限定的局域荧光渲染、自上而下匀速水平扫描线滚扫及 4.0 秒首尾完全等价无缝闭环的内联声明式动画实现能力。
3. **规格独立性与合规声明 (Specification Neutrality & IP Assurance)**：提示词自包含所有制图规范，不依赖任何宿主环境预装插件；发光色彩限定于琥珀色/橙色 P20 荧光波长，消除特定硬件专有标识，提供确定性的自动化几何与位图评测指标。
