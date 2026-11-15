# 12 特罗姆瑟峡湾极光闭环动效（Animated 69°N Fjord Aurora Curtains）

- 建议 ID：`animated-tromso-aurora-fjord-v1`
- 英文名：Animated 69°N Fjord Aurora Curtains

## 来源

- 作者：[@MichaelGannotti](https://x.com/MichaelGannotti)
- 时间：2026-11-09（雪花 ID `2119922137011982652`）
- 链接：https://x.com/MichaelGannotti/status/2119922137011982652
- 转化说明：原帖为单文件 69°N 特罗姆瑟峡湾极光提示词（常见输出依赖 WebGL / Canvas 着色器或实时噪声循环）。本条目以净室方式剥离 `<script>`、WebGL 与 Canvas，收敛为 `viewBox="0 0 800 500"` 的纯内联声明式 SVG 8 秒闭环场景，以多层 SMIL / CSS 极光帷幕、纵向射线纹理与 `y = 330` 峡湾镜像倒影承载评测考点。

## 讨论焦点

该题考察模型能否在无着色器与脚本辅助下，仅靠 SVG 渐变遮罩、多层次波浪路径与声明式动画构建高对比度极夜大气层次，并保持远景山体稳定与倒影镜像一致性。

典型失败：

- 退回 `<script>`、Canvas 或 WebGL 实现极光波浪，违反零脚本契约。
- 极光仅画成单条静态色带或模糊色块，缺少多层颜色过渡（翠绿 `#34f5a3`、青色 `#38bdf8`、高空紫红 `#a855f7`）与纵向射线纹理。
- 倒影与天空极光相位、色相完全脱节，或水线 `y = 330` 以下没有横向涟漪扰动。
- 周期端点 `t = 0s` 与 `t = 8s` 存在跳变（`MAE > 0`），或静态山体与岸边灯火随极光一起漂移。

## 考点

多层大气与光学层次建模（极夜天幕、星点闪烁相位错开、三层及以上极光帷幕与纵向射线渐变遮罩）、`y = 330` 水平线处的对称峡湾山体构图与镜像水波倒影、`T = 8s` 无缝闭环声明式动效与静态地景零漂移控制。

## 提示词草案

```text
Generate one self-contained animated SVG of a 69°N polar fjord night scene with layered aurora borealis curtains and calm water reflections. No text, no brand, no real people, no audio, no script.

Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS @keyframes inside <style><![CDATA[...]]></style> only. 0 <script>, 0 event handlers, 0 Canvas/WebGL, 0 external assets or fonts. viewBox="0 0 800 500". Well-formed XML.

Scene layers and coordinates:
1. Polar night sky: vertical dark gradient from #070b14 at zenith to #0d1829 near horizon y = 330, with a crisp sub-pixel starfield across the upper sky using staggered subtle twinkle phase offsets.
2. Static fjord terrain: jagged snow-capped polar mountain silhouettes flanking the left and right edges, converging at horizon y = 330 to frame a central fjord channel, plus 3 to 5 tiny static warm amber (#fbbf24) cabin or harbor windows anchored just above y = 330. Mountains, horizon, and shore lights must remain strictly static (0 drift).
3. Aurora curtains: at least 3 layered luminous aurora borealis curtains—emerald (#34f5a3), cyan (#38bdf8), and an upper violet-magenta (#a855f7) veil—built with vertical ray striations and soft SVG gradient masks whose undulating wave ribbons, horizontal drift, and opacity breathe smoothly.
4. Fjord water reflection: calm dark water below y = 330 displaying vertically mirrored, horizontally rippled green-cyan aurora reflections and dark shoreline reflections.

Closed loop T = 8s: every animation must use an 8s period (or integer divisor such as 4s/8s) with periodic phase so t = 0s and t = 8s are pixel-identical (MAE === 0), while mid-cycle motion produces clear curtain undulation and shimmer (max(MAE) >= 0.015).

Output only the <svg>.
```

## 判读

**Pass：** `viewBox="0 0 800 500"` 且 0 `<script>`；极夜天幕 `#070b14` 至 `#0d1829` 配错相微星；左右积雪峡湾山体收敛至 `y = 330` 形成中央水道，含 3–5 处 `y = 330` 上方静止暖琥珀 `#fbbf24` 岸灯，山体与水线零漂移；至少 3 层极光帷幕（`#34f5a3`、`#38bdf8`、高空 `#a855f7`）具纵向射线纹理与柔和渐变遮罩；`y = 330` 以下呈现垂直镜像且带横向涟漪的绿青极光与岸线倒影；`t = 0s` 与 `t = 8s` 首尾像素完全一致（`MAE === 0`），周期内 `max(MAE) >= 0.015`。

**Partial：** 具备峡湾山体、极光渐变与基本闭环，但极光不足 3 层、缺少纵向射线或水波镜像倒影，或首尾闭环存在轻微相位接缝。

**Fail：** 静态无明显波动（`max(MAE) < 0.015`）；山体或岸灯发生漂移；缺少 `y = 330` 峡湾水面反射；包含 `<script>`、Canvas/WebGL、外链资源、商标/真实人物，或 XML 语法错误。
