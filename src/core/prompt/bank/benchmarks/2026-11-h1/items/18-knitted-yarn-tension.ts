import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-knitted-yarn-tension-v1",
  label: "针织线圈单轴拉伸与泊松收缩动效 (Animated Knitted Yarn Loop Tension & Poisson Narrowing)",
  template: [
    "Generate one self-contained animated SVG of a knitted yarn lattice under cyclic uniaxial tension. No external assets, no external fonts, no brand names, no audio, no script.",
    'Technical contract: pure inline SVG with viewBox="0 0 760 540" on dark laboratory background #0d131c. SMIL (<animate>, <animateTransform>) or inline CSS @keyframes inside <style><![CDATA[...]]></style> only. 0 <script>, 0 event handlers. Well-formed XML.',
    "Geometry and yarn topology:",
    "- Render a 4-column by 4-row (16 unit loops, plus clean entry and exit yarn tails anchored into top and bottom clamp bars) interlocking weft jersey-knit yarn lattice.",
    '- Use thick cylindrical yarn strands (stroke-width 8 to 10, stroke-linecap="round") with explicit over-under crossing gaps or #0d131c background casing strokes so every loop alternates clearly over its neighbor\'s head arc and behind its adjacent course leg (zero flat uncrossed overlaps).',
    "- Render a fixed bottom grip rail with 2 horizontal anchor pins and a moving top grip bar with upward tensile force vector arrows labeled F.",
    "- Include a crisp side strain and transverse narrowing meter with an animated EPSILON_Y bar and width ruler ticks.",
    "Closed tensile cycle T = 6s (infinite repeat, identical pixels at t = 0s and t = 6s):",
    "- 0.0s -> 3.0s (uniaxial loading): top grip bar moves steadily upward by ~28% vertical gauge extension; every knit row elongates vertically (loop legs straighten upward) while middle rows and inner columns exhibit smooth Poisson transverse necking toward the vertical centerline without breaking loop interlock continuity. High-stress contact crown arcs shift smoothly from relaxed slate-cyan #38bdf8 through amber #f59e0b to peak orange-red #ef4444, while the EPSILON_Y bar and width meter track the deformation.",
    "- 3.0s -> 6.0s (elastic unloading): top grip bar, loop curvatures, transverse width, stress colors, and strain/width meters smoothly relax back to the exact t = 0s geometry.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/Google/status/2120279087314837642",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "4x4 交织平针线圈上下穿插拓扑、单轴 28% 拉伸下的泊松横向颈缩与高应力弧色移闭环",
    groundTruth:
      "viewBox='0 0 760 540'、深色背景 #0d131c、0 <script>；4 列 x 4 行共 16 个交织纬编平针线圈及接入上下夹条的纱尾，粗圆柱纱线（stroke-width 8~10）在交叉点具备显式上下穿插套壳/断口（严禁扁平直接叠压）；底部固定夹轨含 2 枚水平锚钉，顶部活动夹条带向上拉力矢量箭头 F；侧边配备实时联动的 EPSILON_Y 应变柱与横向宽幅标尺；T=6s 闭环中 0->3s 顶部夹条上移约 28%、线圈腿拉直且中部列发生连续泊松横向内收（不破坏咬合连续性），接触冠弧颜色由 #38bdf8 经 #f59e0b 过渡至 #ef4444；3->6s 弹性回弹至 t=0 完全一致（MAE === 0），周期内 max(MAE) >= 0.020。",
    evaluationCriteria:
      "Pass: 4x4 交织线圈上下穿插清晰、固定底轨 2 锚钉与活动顶条拉力箭头 F 完整、0->3s 约 28% 纵向拉伸伴随显著泊松横向颈缩与冠弧 #38bdf8->#f59e0b->#ef4444 应力变色、侧边 EPSILON_Y 与宽幅标尺同步联动、t=0 与 t=6 像素 MAE === 0、max(MAE) >= 0.020 且 0 <script>；Partial: 线圈数量与 6s 闭环大致正确，但仅均匀缩放缺乏泊松颈缩、交叉穿插不清、无应力变色或仪表不同步；Fail: 静态无动画（max(MAE) < 0.020）、线圈非交织或撕裂断链、首尾帧不重合、含 <script> 或 XML 语法错误。",
    referenceSource: "https://x.com/Google/status/2120279087314837642",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "4x4 Interlocking Jersey-Knit Over-Under Topology, 28% Uniaxial Extension with Poisson Transverse Necking & Stress Color Shift",
  groundTruth:
    "Pure inline SVG (viewBox='0 0 760 540', #0d131c dark laboratory background, 0 <script>); 4-column x 4-row (16 unit loops plus top/bottom clamp tails) weft jersey-knit lattice using cylindrical strands (stroke-width 8-10, round caps) with explicit over-under crossing gaps or #0d131c casing strokes; fixed bottom grip rail with 2 horizontal anchor pins, moving top grip bar with upward force arrows F, and synchronized side EPSILON_Y strain bar + width ruler ticks; closed T=6s cycle where 0->3s yields ~28% vertical extension, straightened loop legs, continuous Poisson transverse necking toward centerline without breaking interlocks, and crown arc color shift #38bdf8 -> #f59e0b -> #ef4444; 3->6s elastically relaxes to exact t=0s pixels (MAE === 0) with max(MAE) >= 0.020.",
  evaluationCriteria:
    "Pass: Crisp 4x4 over-under interlaced loops, fixed bottom rail with 2 anchor pins, moving top bar with F arrows, synchronized EPSILON_Y and width ruler, authentic ~28% extension with visible Poisson necking and #38bdf8->#f59e0b->#ef4444 crown stress shift at t=3s, t=0 and t=6 pixel MAE === 0, max(MAE) >= 0.020, and 0 <script>; Partial: 6s loop and knit grid present but uniform scaling without Poisson necking, missing over-under crossing gaps, absent stress color shift, or unsynchronized side meter; Fail: Static output (max(MAE) < 0.020), uncrossed flat overlaps or broken loop continuity, non-zero t=0/t=6 drift, any <script>, or invalid XML.",
};
