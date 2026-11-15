import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-orrery-single-crank-v1",
  label: "单摇把正反转太阳系仪 (Animated Single-Crank Reversing Orrery)",
  template: [
    "Generate one self-contained animated SVG of a tabletop orrery driven by one crank. No planet names, no brand, no script.",
    'Technical contract: SMIL or inline CSS. 0 <script>. viewBox="0 0 800 480". CDATA around any <style>. Separate groups for the crank, two gears, three planets, and one petal iris.',
    "Loop T = 12s. Crank angle phi, in degrees:",
    "phi(t) = 360 * t / 6 for 0 <= t <= 6",
    "phi(t) = 360 * (12 - t) / 6 for 6 < t <= 12",
    "So phi(0) = phi(12) = 0 and phi(6) = 360. The second half is the first half played backward. Pixel MAE at t = 12 equals t = 0.",
    "Gear A has 16 teeth and rotates by phi. Gear B has 32 teeth, meshes with A, and therefore rotates by -phi / 2. Three orbit markers on a common center rotate by phi, phi/2, and phi/4. A six-petal iris opens by radius 20 + 40 * abs(sin(phi in radians)) and closes on the return. Teeth must stay meshed: do not let gear B spin independently of the crank.",
    "Output only the <svg>.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://x.com/kimmonismus/status/2120186125591646250",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "单一摇把角度驱动 16:32 齿轮反向啮合、1:1/2:1/4 行星公转与六瓣光圈开合的双向可逆闭环",
    groundTruth:
      "纯内联动态 SVG（viewBox 0 0 800 480，0 <script>，独立分组含摇把、双齿轮、三行星与六瓣光圈）；T=12s 闭环中 phi(t) 在 0..6s 由 0° 线性增至 360°、在 6..12s 线性反转回 0°；16 齿齿轮 A 转 phi，32 齿齿轮 B 啮合反转 -phi/2；三行星绕共心转 phi、phi/2、phi/4；六瓣光圈半径遵循 20 + 40*abs(sin(phi)) 开合归零；首尾帧像素 MAE === 0 且周期内 max(MAE) >= 0.020。",
    evaluationCriteria:
      "Pass: 摇把、16/32 齿啮合齿轮、三行星与六瓣光圈分组齐全且保持啮合，t=6s 达 phi=360°、B=-180°，后半周期严格反转回零，首尾帧 MAE === 0 且 max(MAE) >= 0.020，0 <script>；Partial: 机构完整且转动，但缺失反转段、齿数/速比偏差或光圈未联动；Fail: 含 <script> 或事件属性、齿轮脱啮各自无限旋转、静止死图（max(MAE) < 0.020）、出现品牌/行星文字或 XML 错误。",
    referenceSource: "https://x.com/kimmonismus/status/2120186125591646250",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Single-crank angle driving 16:32 reverse gear meshing, 1:1/2:1/4 planet orbits, and 6-petal iris aperture in a reversible loop",
  groundTruth:
    "Pure inline animated SVG (viewBox 0 0 800 480, 0 <script>, separate groups for crank, two gears, three planets, and 6-petal iris); 12s closed loop with phi(t) rising linearly from 0 to 360 deg over 0..6s and reversing linearly back to 0 deg over 6..12s; 16-tooth gear A rotates by phi while meshed 32-tooth gear B rotates by -phi/2; three concentric orbit markers rotate by phi, phi/2, and phi/4; 6-petal iris opens and closes with radius 20 + 40*abs(sin(phi)); pixel MAE === 0 between t=0 and t=12 with max(MAE) >= 0.020.",
  evaluationCriteria:
    "Pass: All mechanism groups present and meshed, at t=6s phi=360 deg and gear B=-180 deg, second half strictly reverses to zero, seamless loop MAE === 0 with max(MAE) >= 0.020, 0 <script>; Partial: Mechanism rotates but lacks the reversing return half, mismatches gear/orbit ratios, or leaves the iris uncoupled; Fail: Contains <script> or event handlers, unmeshed free-spinning parts, static output (max(MAE) < 0.020), planet/brand text labels, or invalid XML.",
};
