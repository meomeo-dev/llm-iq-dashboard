import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

const TEMPLATE = [
  "Generate one self-contained animated SVG of an 8-icon motion-design tool set with an optical construction grid. No brand names, no prose audit text, no script, no external assets or fonts.",
  'Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS <style><![CDATA[...]]></style> @keyframes only. 0 <script>, 0 event handlers. viewBox="0 0 800 420". Well-formed XML.',
  "Draw 8 motion-design icons in strict left-to-right order: play, keyframe, ease, layers, timeline, loop, mask, export.",
  "Non-negotiable icon system rules (in each icon's 24x24 local unit):",
  "- 24 x 24 grid, 3 px safe margin, 18 x 18 live area (x, y in [3, 21]).",
  '- Stroke 1.5, stroke-linecap="round", stroke-linejoin="round", fill="none" (no fills).',
  "- All coordinates on whole or half pixels only (multiples of 0.5).",
  "- Corner radius 2 where corners are rounded; minimal path commands per icon.",
  "Layout:",
  '- Top row: all 8 icons scaled 3x (72 x 72 each), overlaid with a toggleable <g class="construction"> group showing each slot\'s 24 x 24 grid, 18 x 18 live area box, and 20 px diameter keyline circle centered at (12, 12).',
  "- Bottom row: the same 8 icons in a matching left-to-right row at true 1x size (24 x 24 each).",
  "Motion, 8-second seamless closed loop (T = 8s):",
  "- A crisp active slot highlight (accent frame/ring and stroke highlight) sweeps cleanly through slots 1..8, spending 1 second per icon (0..1s play, 1..2s keyframe, ..., 7..8s export).",
  "- During its 1-second active window, each icon performs a clear synchronized semantic micro-motion in both the 3x and 1x rows: play triangle pulses right; keyframe diamond rotates 45 -> 90 -> 45 deg; ease indicator circle slides along the curve; layers stack shifts vertically; timeline playhead sweeps horizontally; loop arc rotates 360 deg; mask shutter slides; export arrow lifts upward.",
  "- At t = 0s and t = 8s every slot and icon returns identically to the initial rest pose (pixel MAE === 0) with clear visible motion during the cycle (max(MAE) >= 0.015).",
  "Output only the <svg>.",
].join("\n\n");

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-motion-icons-audit-v1",
  label: "八枚动效图标与光学网格动画 (Animated Eight Motion Tool Icons & Optical Grid)",
  template: TEMPLATE,
  variables: [],
  candidates: [],
  source: "https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "24x24 网格与半像素对齐的八枚无填充动效图标、construction 光学构造层、3x/1x 双排同构及 8 秒逐槽高亮微动闭环",
    groundTruth:
      "纯内联动态 SVG（viewBox 0 0 800 420，仅 SMIL 或 CDATA 内联 CSS @keyframes，0 <script>，0 事件属性）；按 play、keyframe、ease、layers、timeline、loop、mask、export 顺序绘制 8 枚图标；每枚遵守 24x24 网格、3 px 安全边距（18x18 活区）、stroke-width=1.5、round 线帽与连接、fill=none 无填充、整/半像素坐标与圆角半径 2；上排 3x 含可切换 class='construction' 构造层（网格、18x18 活区、20 px 关键线圆），下排 1x 对齐；T=8s 闭环每 1 秒高亮并驱动对应槽位在 3x/1x 同步执行语义微动效，首尾帧 MAE === 0 且 max(MAE) >= 0.015。",
    evaluationCriteria:
      "Pass: 8 枚图标顺序完整且符合 24x24/3 px 边距/1.5 px 圆头圆角无填充/半像素/圆角半径 2 规范；上排 3x 含可切换 construction 构造层、下排 1x 完整对照；8s 闭环中高亮与语义微动每 1s 依次扫过 1..8 槽位且 3x/1x 同步，首尾帧 MAE === 0 且 max(MAE) >= 0.015，0 <script>；Partial: 图标与构造层齐全且闭环可动，但偶有填充、半像素偏移、缺少 1x 行或部分槽位 3x/1x 不同步；Fail: 静态无运动（max(MAE) < 0.015）、含 <script> 或事件属性、缺漏或错序图标、大量实心填充、首尾帧未归零、出现品牌/长段文字或 XML 错误。",
    referenceSource:
      "https://productwithattitude.com/articles/claude-fable-5-2-design-motion-tests-prompts",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "24x24 half-pixel aligned un-filled 8 motion-tool icons, construction optical overlay, 3x/1x dual-scale parity, and 8s sequential slot-sweep micro-motion loop",
  groundTruth:
    "Pure inline animated SVG (viewBox 0 0 800 420, SMIL or CDATA inline CSS @keyframes only, 0 <script>, 0 event handlers); 8 icons in left-to-right order: play, keyframe, ease, layers, timeline, loop, mask, export; each obeys 24x24 grid, 3 px safe margin (18x18 live area), stroke 1.5, round caps and joins, fill none, whole/half-pixel coordinates, and corner radius 2; top 3x row includes toggleable class='construction' overlay (24x24 grid, 18x18 live box, 20 px keyline circle) above a matching 1x bottom row; 8s closed loop sweeps active highlight and semantic micro-motion across slots 1..8 (1s per slot) in 3x/1x sync, returning identically at t=8s (MAE === 0, max(MAE) >= 0.015).",
  evaluationCriteria:
    "Pass: All 8 icons in exact order obeying 24x24/3 px margin/1.5 round unfilled/half-pixel/radius-2 rules; top 3x row with toggleable construction overlay and matching 1x bottom row; 8s loop sweeps highlight and semantic micro-motion cleanly across slots 1..8 (1s each) in 3x/1x sync with MAE === 0 at t=0/8s, max(MAE) >= 0.015, and 0 <script>; Partial: Complete icon set and loop with minor fill leaks, off-grid coordinates, missing 1x row, or partial 3x/1x desync; Fail: Static output (max(MAE) < 0.015), any <script> or event handler, missing or reordered icons, heavy solid fills, non-zero t=0/8s MAE, brand/prose clutter, or invalid XML.",
};
