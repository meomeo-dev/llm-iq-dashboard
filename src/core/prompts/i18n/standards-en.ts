/**
 * 题目与候选集客观参考标准（PromptStandard）的英文映射与术语转换器。
 */

import type { PromptStandard } from "../../prompt/types";

export const STANDARDS_EN: Readonly<Record<string, Omit<PromptStandard, "referenceSource">>> = {
  "classic-v1": {
    coreKey: "Out-of-Distribution (OOD) Composition & Subject-Object Articulation",
    groundTruth:
      "A California pelican (long bill, characteristic gular pouch, avian plumage) seated on a classic bicycle with front and rear wheels, diamond frame, handlebar, pedals, and saddle.",
    evaluationCriteria:
      "1. Well-formed XML: Self-contained valid SVG without truncation or parse errors; 2. Rider-bicycle topology: Pelican torso proportioned to the frame, with feet on pedals and body seated on the saddle; 3. Part legibility: Distinct wheels, frame triangles, and steering geometry.",
  },
  "upgraded-v2": {
    coreKey: "High-Density Anatomical & Mechanical Instruction Following (Spokes, Breeding Plumage, Pedaling)",
    groundTruth:
      "California brown pelican in full breeding plumage (white/yellow crown, dark chestnut/black hindneck, gray-brown body feathers); prominent gular pouch; spoked wheels; anatomically sound frame; active pedaling posture.",
    evaluationCriteria:
      "1. Spokes & frame: Both wheels must contain radial spokes and a structurally valid frame; 2. Breeding plumage & pouch: Distinct California brown pelican breeding coloration and large pouch; 3. Pedaling kinematics: Legs flexed in active pedaling posture with feet placed on the pedals.",
  },
  "animated-pelican-v1": {
    coreKey: "Pure Inline SVG Kinematics, Axle Transform Centers & Synchronous Pedaling Cycle",
    groundTruth:
      "Front and rear wheels continuously rotate around their own hub centers (cx, cy); crank arms and pedals revolve with 180° phase offset around the bottom bracket; pelican legs articulate in sync with the pedals; pure inline SMIL or CSS @keyframes with CDATA-wrapped styles.",
    evaluationCriteria:
      "1. Rotation centers: Rotating around global (0,0) so wheels fly off scores 0; steady rotation around each wheel axle passes; 2. Pedaling linkage: Continuous periodic leg extension synchronized with pedal motion; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
  "clock-v1": {
    coreKey: "Non-Linear Continuous Time-to-Angle Mapping (Clock-Drawing Test at 3:45)",
    groundTruth:
      "Circular dial with numerals 1–12; minute hand pointing at 9 (270° clockwise from 12 o'clock); hour hand advanced three-quarters of the way from 3 toward 4 at 90° + 22.5° = 112.5° (NOT horizontally at 90°).",
    evaluationCriteria:
      "1. Hour-hand angle (critical): Pointing horizontally at 3 (90°) fails the continuous gearing test; pointing at 112.5° (three-quarters toward 4) earns full credit; 2. Hand hierarchy: Distinct lengths/widths for hour, minute, and second hands with a center pin.",
  },
  "penrose-v1": {
    coreKey: "Isometric 3D Projection & Impossible Tribar Topological Paradox",
    groundTruth:
      "Three mutually orthogonal square beams in isometric projection forming a cyclic occlusion loop (A over B, B over C, C over A) with consistent three-tone directional shading across top, left, and right faces.",
    evaluationCriteria:
      "1. Impossible loop: Must form an Escher-style cyclic occlusion paradox rather than a flat triangle or broken joints; 2. Face shading: Crisp three-tone lighting across the three visible face orientations.",
  },
  "ice-water-v1": {
    coreKey: "Archimedes' Buoyancy Principle (~90% Submerged Ice) & Refractive Transparency",
    groundTruth:
      "Because ice density (~917 kg/m³) is ~91.7% of liquid water (~1000 kg/m³), roughly 90% of each floating ice cube's volume is submerged below the elliptical water meniscus, with only ~10% exposed above.",
    evaluationCriteria:
      "1. Buoyancy physics (core): Ice floating completely above the surface (0% submerged) or resting at the bottom fails; ~90% submerged below the meniscus earns full credit; 2. Optics: Translucent water column, meniscus ellipse, and refractive ice facets.",
  },
  "animated-armadillo-fishnet-mars-v1": {
    coreKey: "Quadrupedal Diagonal Walking Gait, Conformally Deforming Fishnet Mesh & Seamless Loop",
    groundTruth:
      "Nine-banded armadillo walking with alternating diagonal limb pairs (no ice-skating slide); diamond fishnet mesh conforming to flexing limbs; rhythmic carapace pitch/bob and undulating tail over Martian iron-oxide terrain; seamless loop (MAE ≡ 0, max MAE >= 0.015); 0 <script> tags.",
    evaluationCriteria:
      "Pass: Coordinated diagonal quadrupedal gait with grounded footfalls, conformally moving diamond fishnets, rhythmic carapace bobbing, Martian landscape, seamless loop (MAE ≡ 0, max MAE >= 0.015), 0 script; Partial: Skating limbs or detached mesh; Fail: Static image, <script> tag, or wrong subject.",
  },
  "animated-lemur-scooter-front-v1": {
    coreKey: "Orthographic Head-On Front Symmetry, Single-Leg Kick Propulsion & Coaxial Wheel Occlusion",
    groundTruth:
      "Strictly head-on front view (side profile is an automatic veto); bilateral symmetry RMSE <= 2.0%; one foot planted on deck while the other executes a forward swing–ground kick–lift cycle; front wheel coaxial with rear wheel; swaying banded tail; seamless loop (MAE ≡ 0, max MAE >= 0.015).",
    evaluationCriteria:
      "Pass: 100% head-on front perspective with horizontal handlebar, realistic single-leg ground kick cycle, deck suspension bounce, counter-swaying ringed tail, seamless loop, 0 script; Partial: Front view with jerky motion; Fail: Side view (0 pts veto), static image, or <script> tag.",
  },
};

const PHRASE_REPLACEMENTS: ReadonlyArray< readonly [RegExp, string] > = [
  [/核心考点与鉴别维度/g, "Core Dimension & Discriminators"],
  [/冲量-动量守恒方程/g, "Impulse-Momentum Conservation"],
  [/泊松\/牛顿恢复系数与库仑干摩擦锥/g, "Poisson/Newton Restitution & Coulomb Friction Cone"],
  [/拓扑与状态参数/g, "Topology & State Parameters"],
  [/几何与动量自洽性/g, "Geometric & Momentum Consistency"],
  [/反弹轨迹曲率/g, "Rebound Trajectory Curvature"],
  [/角动量旋向突变/g, "Angular Momentum Sign Jump"],
  [/一票否决/g, "automatic veto"],
  [/纯静态死图/g, "static non-animated output"],
  [/严禁任何 script 脚本/g, "strictly zero <script> tags"],
  [/首尾无缝对接/g, "seamless loop closure"],
  [/有效动量/g, "effective motion amplitude"],
  [/语法错误/g, "XML syntax errors"],
  [/状态方程与非量纲基准/g, "Equation of State & Non-Dimensional Baseline"],
  [/关键剖面时步/g, "Key Cross-Section Timesteps"],
  [/前锋形态对比/g, "Wavefront Profile Comparison"],
  [/涡度矢量场分布/g, "Vorticity Vector Field Distribution"],
  [/粒子速度流线/g, "Particle Velocity Streamlines"],
];

/**
 * 将含 LaTeX 公式与中英术语的评分标准说明转换为英文展示格式（保留全部公式与定量阈值）。
 */
export function translateTechnicalTextToEn(
  text: string,
  englishTitle?: string,
): string {
  let out = text;
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    out = out.replace(pattern, replacement);
  }
  if (/[\u4e00-\u9fff]/.test(out) && englishTitle) {
    // 保留原文本中的全部数学公式（$$...$$ 与 $...$）与定量指标，附加英文标题导引
    const formulas = out.match(/\$\$[\s\S]+?\$\$|\$[^$]+\$/g) ?? [];
    if (formulas.length > 0) {
      return `${englishTitle} — Quantitative invariants: ${formulas.join(" ; ")}`;
    }
  }
  return out;
}
