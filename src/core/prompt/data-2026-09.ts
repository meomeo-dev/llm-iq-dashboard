/**
 * 2026 年秋季社区流行前沿评测提示词数据（2026-09 分组）
 * 包含 Kris Chase Gist 等轴测工业图解规范、HN 解剖学动态、EMNLP 空间几何/遮挡与拓扑评测
 */

import type { PromptSpec } from "./types";

/**
 * 等轴测初代个人电脑基准。
 * 考察 30° 等轴测三维几何投影、微光磷光呼吸、2Hz 方波光标闪烁与无缝时序闭环。
 */
export const ANIMATED_ISO_VINTAGE_PC_PROMPT: PromptSpec = {
  id: "animated-iso-vintage-pc-v1",
  label: "动态等轴测初代个人电脑 (Animated Isometric Vintage PC)",
  template: [
    "Generate an animated SVG of a classic 1980s vintage personal computer workstation in true 30-degree isometric projection featuring pure inline SVG animation (using SMIL <animateTransform>/<animate> or inline CSS @keyframes).",
    "Render in a dark hairline technical figure style (near-black solids on a dark background, crisp 1px hairline edges with a subtle top-front highlight line, and at most 5% focal accent glow), with distinctly shaded top, left, and right isometric facets.",
    "The computer setup must feature an integrated desktop chassis with a sunken monochrome CRT monitor, a tiered mechanical keyboard on the desk plinth, and a coiled helix cable connecting the keyboard to the chassis port.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. The CRT screen phosphor must exhibit a subtle, periodic breathing luminance fluctuation (simulating phosphor refresh/glow).",
    "2. A bright rectangular command-line cursor on the screen must continuously blink at a steady 2 Hz square-wave cadence.",
    "3. Chassis status indicator LEDs must demonstrate synchronized multi-phase pulse cycles.",
    "4. The entire animation must loop seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
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
    coreKey: "30° 等轴测三维几何投影、微光磷光呼吸、2Hz 方波光标闪烁与无缝时序闭环",
    groundTruth: "30° 等轴测投影坐标公式 x=(X-Y)*cos(30°)*s, y=((X+Y)*0.5-Z)*s；深色精密技术图解三色阶（顶#1f1f1f、左#181818、右#121212）；2Hz 光标明灭与屏幕微弱呼吸；首尾无缝循环 MAE ≡ 0 且有效动量 max MAE >= 0.015；严禁任何 script 标签。",
    evaluationCriteria: "Pass: 三轴平行且顶/左/右三面色阶分明，光标 2Hz 闪烁与屏幕呼吸，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 几何正确但在动图中有跳闪或发光溢出在 5%~15%；Fail: 纯静态死图（max MAE < 0.015）、含 script、退化为正平视或 XML 语法错误。",
    referenceSource: "https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee",
  },
};

/**
 * 动态橙屏 CRT 台式机基准。
 * 考察凸曲面 CRT 投影面板、向下扫描线滚扫、单焦点琥珀色发光与整周期闭合。
 */
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

/**
 * 动态十秒无缝机架基准。
 * 考察 19 英寸机柜网格、整除周期时钟律、多通道 LED 阵列律动、顶面双风扇共面旋转与 10 秒无缝循环。
 */
export const ANIMATED_ISO_SERVER_RACK_PROMPT: PromptSpec = {
  id: "animated-iso-server-rack-v1",
  label: "动态十秒无缝机架 (Animated 10-Second Seamless Server Rack)",
  template: [
    "Generate an animated SVG of an industrial 19-inch server rack cabinet in 30-degree isometric projection executing a strictly seamless 10.0-second periodic loop using pure inline SVG animation (SMIL <animate>/<set> or inline CSS @keyframes).",
    "Render in a dark hairline technical figure style (near-black solids on a dark background, crisp 1px hairline edges with a subtle top-front highlight line, and at most 5% focal accent glow).",
    "The server rack cabinet must feature vertical mounting rails, at least 8 uniform rack units (1U trays) with horizontal arrays of status indicator LEDs, ventilation slot grids, and top-mounted dual cooling fans.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. Multi-channel status indicator LEDs on each tray faceplate must blink in staggered rhythms whose individual cycle durations are strictly integer divisors of 10.0 seconds (e.g., 0.5s, 1.0s, 2.0s, 2.5s, or 5.0s).",
    "2. The dual top-mounted exhaust fans must smoothly rotate around their respective center axes within the isometric top plane (retaining proper planar skew and coplanarity without wobbling out of the top surface).",
    "3. The visual state at t = 0.0s and t = 10.0s must be mathematically identical with zero discontinuity (absolute seamless loop).",
    "4. All LED lights must be strictly coplanar within their respective isometric tray front faces, emitting crisp green (#00FF66) or amber (#FFAA00) pinpoints occupying no more than 3% of total image area.",
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
    coreKey: "19 英寸机柜网格、整除周期时钟、多通道 LED 阵列律动、顶面风扇共面旋转与 10 秒无缝循环",
    groundTruth: "30° 等轴测机架网格；顶置双风扇在轴测顶面内共面自转；整除律周期闪烁（0.5s/1s/2s/2.5s/5s/10s）；首尾两帧逐像素差分 MAE ≡ 0.000 且过程动量 max MAE >= 0.015；微光占比 <= 3%；严格 0 脚本。",
    evaluationCriteria: "Pass: 10 秒首尾帧 MAE ≡ 0 且过程有动量 max MAE >= 0.015，LED 排布在托盘面内，双风扇顶面共面自转；Partial: LED 使用非整除周期或风扇轻度翘曲；Fail: 纯静态死图（max MAE < 0.015）、风扇飞出机柜、含 script 或 XML 语法错误。",
    referenceSource: "https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee",
  },
};

/**
 * 动态相机爆炸图再组装基准。
 * 考察同轴爆炸运动学、四段式节拍律、引线标注动态锚定与无漂移复位。
 */
export const ANIMATED_ISO_CAMERA_EXPLODED_PROMPT: PromptSpec = {
  id: "animated-iso-camera-exploded-v1",
  label: "动态相机爆炸图再组装 (Animated Coaxial Camera Exploded View & Reassembly)",
  template: [
    "Generate an animated exploded assembly SVG diagram of a mechanical rangefinder film camera in 30-degree isometric view using pure inline SVG animation (SMIL <animateTransform> or inline CSS @keyframes).",
    "Render in a dark hairline technical figure style (near-black solids on a dark background, crisp 1px hairline edges with a subtle top-front highlight line, and at most 5% focal accent glow).",
    "The camera structure must separate along its primary optical axis into at least 4 discrete subassemblies: front lens element group, aperture/focus barrel, camera body housing, and rear film door.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript, adhering to a 4-stage golden ratio kinematic cycle:",
    "1. Coaxial Expansion (0% - 35%): Components smoothly separate strictly along the common 30-degree isometric optical axis vector (never drifting sideways in 2D screen space).",
    "2. Exploded Hold (35% - 60%): The assembly holds fully expanded for 25% of the total loop duration; thin technical leader lines appear anchored to each part, pointing to crisp uppercase labels (LENS, BARREL, BODY, BACK).",
    "3. Smooth Reassembly (60% - 85%): Components smoothly glide back in reverse along the optical axis, leader lines fade out, and parts fit back flush together.",
    "4. Closed Hold & Restitution (85% - 100%): The fully assembled camera rests in flush baseline alignment before seamlessly repeating the loop with zero positional drift: visual states at t = 0s and t = T must be mathematically identical (restitution error <= 0.5px).",
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
    coreKey: "同轴爆炸运动学、四段式节拍律、引线标注动态锚定与无漂移复位",
    groundTruth: "主光轴同轴度公差 <= 2.0px；四段式节拍（展开 0-35% / 悬停 35-60% / 收拢 60-85% / 闭合 85-100%）；引线起点距离 <= 5px；复位漂移残差 <= 0.5px；首尾闭合 MAE ≡ 0 且分离动量 max MAE >= 0.020；严禁任何 script 标签。",
    evaluationCriteria: "Pass: 沿 30° 投影光轴整齐同轴分离与收拢，悬停充分且引线动态显示，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.020，0 script 且 XML 零错误；Partial: 零件沿 2D 平面杂乱飞散或复位漂移；Fail: 纯静态死图（max MAE < 0.020）、零件飞出画布、含 script 或 XML 语法错误。",
    referenceSource: "https://gist.github.com/mehh/b2aa7b990f1d4fa0d6e06fcefc38f2ee",
  },
};

/**
 * 动态人手关节屈伸屈曲基准。
 * 考察严格五指解剖拓扑、指节层级旋转约束、大拇指对掌轨迹与无缝循环。
 */
export const ANIMATED_HUMAN_HAND_KINETIC_PROMPT: PromptSpec = {
  id: "animated-human-hand-kinetic-v1",
  label: "动态人手关节屈伸屈曲 (Animated Articulated Human Hand)",
  template: [
    "Generate an animated SVG of an anatomically realistic human hand demonstrating a continuous finger flexion and extension articulation cycle using pure inline SVG animation (SMIL <animateTransform>/<animate> or inline CSS @keyframes).",
    "The hand must clearly depict the palm, an opposable thumb (2 phalanges), and four fingers (index, middle, ring, and little finger, each with 3 distinct phalanges and knuckles).",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. Coordinated finger curling: The four fingers must smoothly and sequentially curl inwards from an open resting palm into a relaxed semi-clenched fist, then unfurl back smoothly to the open position.",
    "2. Hierarchical joint kinematics: For each finger, the proximal, intermediate, and distal phalanges must rotate with anatomically constrained angular ratios around their respective joint pivot axes (no rubber-hose bending or dislocated joints).",
    "3. Opposable thumb trajectory: The thumb must rotate and adduct diagonally across the thenar eminence of the palm in synchronization with the closing fingers.",
    "4. The entire flexion-extension cycle must loop seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://news.ycombinator.com/item?id=49573027",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "五指解剖运动学、指节层级旋转约束、大拇指对掌轨迹与无缝循环",
    groundTruth: "严格五指拓扑（拇指2节，余4指各3节）；多级指节绕关节中心点旋转屈伸；大拇指对掌内收轨迹；动作循环完全闭合 MAE ≡ 0 且 max MAE >= 0.015；严禁任何 script 脚本。",
    evaluationCriteria: "Pass: 严格 5 根手指且比例正确，指节分节清晰且绕各有关节轴旋转屈伸，拇指对掌轨迹真实，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 有 5 根手指且在动但呈整根刚体摆动或橡皮软体弯曲、缺少多节联动或循环跳闪；Fail: 手指数量非 5（多指/少指一票否决零分）、纯静态死图（max MAE < 0.015）、含 script 或 XML 语法错误。",
    referenceSource: "https://news.ycombinator.com/item?id=49573027",
  },
};

/**
 * 动态鱼跃水入云基准（非模态遮挡完整性）。
 * 考察抛物线跳跃运动学、云层非模态遮挡、水花涟漪扩散与同轴连续性。
 */
export const ANIMATED_FISH_CLOUD_AMODAL_PROMPT: PromptSpec = {
  id: "animated-fish-cloud-amodal-v1",
  label: "动态鱼跃水入云：非模态遮挡完整 (Animated Fish Leaping Water to Clouds with Amodal Occlusion)",
  template: [
    "Generate an animated SVG demonstrating a stylized fish leaping out of ocean water and arching through a floating cloud layer with strict amodal occlusion using pure inline SVG animation (SMIL <animateTransform>/<animateMotion> or inline CSS @keyframes).",
    "The scene consists of three depth-ordered layers: the ocean water at the bottom, an opaque white puffy cloud suspended in the mid-air sky, and a swimming fish following a smooth ballistic arc.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. Parabolic leaping trajectory: The fish must emerge upward from the water line, follow a smooth parabolic leaping arc across the sky, and dive head-first back into the ocean.",
    "2. Dynamic amodal occlusion: As the fish traverses the mid-air cloud, its body must pass strictly BEHIND the opaque cloud layer (Painter's algorithm Z-order); when the fish's head emerges from the far side while its tail is still entering, their respective spines must remain collinear along the same continuous trajectory without pre-cut holes or spatial shearing.",
    "3. Swimming body undulation: Throughout the jump, the fish's body and caudal tail fin must smoothly flex in a continuous sinusoidal swimming motion aligned tangentially to its flight path.",
    "4. Splash and ripple dynamics: Dynamic expanding ripple rings and splash droplets must trigger at the exact coordinates of water emergence and splashdown entry.",
    "5. The leaping cycle must loop continuously and seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://aclanthology.org/2026.emnlp-main.spatial/",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "抛物线跳跃运动学、云层非模态遮挡、水花涟漪扩散与同轴连续性",
    groundTruth: "抛物线弹道动力学拟合 R² >= 0.98；画家算法真实遮挡（层级倒错一票否决）；穿云前后躯干同轴外插偏差 <= 2px；出入水扩散涟漪同步；无缝循环 MAE ≡ 0 且 max MAE >= 0.015；绝对零脚本安全。",
    evaluationCriteria: "Pass: 抛物线飞跃平滑，穿云时鱼身在云层背后穿过且跨云身体轴向严格共线，水花涟漪同步扩散，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 鱼在跳跃但穿云时身体断开错位或缺少出入水涟漪；Fail: 鱼浮在云朵最前面（遮挡层级倒错一票否决零分）、纯静态死图（max MAE < 0.015）、含 script、鱼沿直线抽搐或 XML 语法错误。",
    referenceSource: "https://aclanthology.org/2026.emnlp-main.spatial/",
  },
};

/**
 * 动态海岛微风与宝箱包含基准。
 * 考察动态海浪推进、椰树受风悬链弯曲、宝箱发光脉冲与多层包含几何不变性。
 */
export const ANIMATED_ISLAND_CHEST_CONTAINMENT_PROMPT: PromptSpec = {
  id: "animated-island-chest-containment-v1",
  label: "动态海岛微风与宝箱包含 (Animated Tropical Island with Swaying Palm and Glimmering Chest)",
  template: [
    "Generate an animated SVG of a tropical island scene featuring a sandy island, a swaying palm tree, and a glimmering treasure chest with strict spatial containment invariants using pure inline SVG animation (SMIL <animateTransform>/<animate> or inline CSS @keyframes).",
    "The composition must respect strict topological nesting: the ocean bounds the scene, the sandy island is fully contained within the ocean, and both the palm tree base and the treasure chest are fully contained within the island boundary.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. Ocean wave dynamics: Harmonic sea foam ripples and layered wave crests must continuously roll and lap rhythmically against the outer shoreline of the sandy island.",
    "2. Palm tree breeze flexion: The curved trunk of the palm tree and its crown of leafy fronds must sway rhythmically in an ocean breeze; the base of the trunk must remain 100% firmly rooted to the island sand with zero positional drifting.",
    "3. Treasure chest sparkle: A wooden and brass-banded treasure chest sitting on the beach sand must feature a glowing golden glimmer or starburst sparkle pulsating periodically from its slightly ajar lid.",
    "4. Containment invariant: Throughout every frame of the animation, the tree root contact polygon and the treasure chest bounding box must remain strictly and completely within the interior of the sandy island polygon (inclusion ratio = 1.0).",
    "5. The entire scene must loop seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://aclanthology.org/2026.emnlp-main.spatial/",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "动态海浪推进、椰树受风悬链弯曲、宝箱发光脉冲与多层包含几何不变性",
    groundTruth: "多层凸包包含率恒等于 1.0（树根与宝箱 ∈ 海岛 ∈ 海洋，越界一票否决）；树干弯曲受风摇曳但树根绝对扎根静止（漂移 <= 0.5px）；海浪谐波律动；无缝循环 MAE ≡ 0 且 max MAE >= 0.015；严禁任何 script 脚本。",
    evaluationCriteria: "Pass: 海浪平滑推涌，椰树柔和受风摆动且树根扎根不动，宝箱金光周期闪烁，多层包含几何不变性严丝合缝（树根与宝箱 ∈ 海岛 ∈ 海洋），首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 有动态但树根滑出海岛漂在水面、波浪硬切断裂或宝箱全屏变色；Fail: 宝箱或树木直接漂浮在深海中（包含关系倒错一票否决零分）、纯静态死图（max MAE < 0.015）、含 script 或 XML 语法错误。",
    referenceSource: "https://aclanthology.org/2026.emnlp-main.spatial/",
  },
};

/**
 * 动态树下读书的人基准（人体与复杂遮挡）。
 * 考察树冠风吹微动、斑驳树影漂移、读者翻书动作与复合图层深度遮挡。
 */
export const ANIMATED_TREE_READER_OCCLUSION_PROMPT: PromptSpec = {
  id: "animated-tree-reader-occlusion-v1",
  label: "动态树下读书的人：人体与遮挡 (Animated Reader Under Tree Occlusion and Foliage Breeze)",
  template: [
    "Generate an animated SVG demonstrating a tranquil scene of a person sitting and reading under a large shade tree with complex dynamic depth occlusion using pure inline SVG animation (SMIL <animateTransform>/<animate> or inline CSS @keyframes).",
    "The layered composition must feature a large deciduous shade tree with an expansive foliage canopy, a person seated on the grassy ground leaning back against the tree trunk, and an open book resting on their lap.",
    "Animations must run smoothly and continuously in a modern browser with zero JavaScript:",
    "1. Wind-blown canopy & dappled sunlight: The leafy tree canopy must gently sway in a breeze, casting subtle animated patches of shifting dappled sunlight and leaf shadows that gently drift across the grass and the reader's clothing.",
    "2. Animated page-turning: The reader's right hand must smoothly lift the corner of a paper page, curve it across the book's center spine in a gentle arc, and press it flat onto the opposite page in a periodic reading cadence.",
    "3. Subtle breathing rhythm: The reader's chest and shoulders must demonstrate subtle, rhythmic vertical expansion and contraction (respiratory breathing cycle) while maintaining leaning contact with the trunk.",
    "4. Depth occlusion preservation: Throughout all animations, the depth order must remain strictly intact: the tree trunk is behind the person's back, the book rests on top of the person's lap, and the turning hand/page remains in front of the book without any Z-index flickering or layer popping. The reader's seated torso and lap must be constructed as complete amodal continuous paths behind the occluding book.",
    "5. The tranquil scene must loop continuously and seamlessly with zero seam jump: visual states at t = 0s and t = T must be mathematically identical.",
    "The entire output must be completely self-contained within a single valid SVG element (ensure strictly well-formed XML: if using <style>, wrap CSS inside <![CDATA[ ... ]]> or avoid raw unescaped '&' and '<'), requiring no external scripts or stylesheets (absolutely NO JavaScript / 0 <script> tags).",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://aclanthology.org/2026.emnlp-main.spatial/",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-10-10",
  standard: {
    coreKey: "树冠风吹微动、斑驳树影漂移、读者翻书动作与复合图层深度遮挡",
    groundTruth: "多层深度遮挡顺序（树干后层 < 躯干中层 < 书本前层，反转一票否决）；读者被遮挡躯干具备非模态路径完整性；翻书纸张平滑拱起翻转；树冠晃动与斑驳光影漫射；胸腔呼吸起伏且人体与树干切触不脱开；无缝循环 MAE ≡ 0 且 max MAE >= 0.015；严禁任何 script 脚本。",
    evaluationCriteria: "Pass: 复合深度层级严密无穿模（树干后层 < 读者躯干靠背 < 膝盖大腿 < 摊开书本 < 翻页手腕纸张），翻书动作拱形立体自然，树影光斑微风漂移，胸腔呼吸真实，首尾闭合 MAE ≡ 0 且有效动量 max MAE >= 0.015，0 script 且 XML 零错误；Partial: 有人树书动态但翻书平贴闪烁瞬移或呼吸导致人体脱离树干悬空；Fail: 人穿透到树干后面被树干遮挡（层级倒错一票否决零分）、纯静态死图（max MAE < 0.015）、含 script、图元混杂成无序色块或 XML 语法错误。",
    referenceSource: "https://aclanthology.org/2026.emnlp-main.spatial/",
  },
};

/**
 * 2026-09 专属题目数组清单（8 道题）
 */
export const PROMPTS_2026_09: readonly PromptSpec[] = [
  ANIMATED_ISO_VINTAGE_PC_PROMPT,
  ANIMATED_ISO_AMBER_CRT_PROMPT,
  ANIMATED_ISO_SERVER_RACK_PROMPT,
  ANIMATED_ISO_CAMERA_EXPLODED_PROMPT,
  ANIMATED_HUMAN_HAND_KINETIC_PROMPT,
  ANIMATED_FISH_CLOUD_AMODAL_PROMPT,
  ANIMATED_ISLAND_CHEST_CONTAINMENT_PROMPT,
  ANIMATED_TREE_READER_OCCLUSION_PROMPT,
];
