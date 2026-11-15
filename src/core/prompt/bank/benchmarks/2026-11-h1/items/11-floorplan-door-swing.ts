import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-floorplan-door-swing-v1",
  label: "中性公寓平面图与门扇开合动效 (Animated Architectural Floorplan & Door Swings)",
  template: [
    "Generate one self-contained animated architectural floor plan SVG of a fictional three-room apartment. Top-down 2D view, white blueprint lines on #12161f. No TV show names, no brand, no furniture sprites, no script.",
    'Technical contract: SMIL <animateTransform> or inline CSS @keyframes only. 0 <script>, viewBox="0 0 800 560". CDATA around any <style>.',
    [
      "Layout geometry:",
      "- Outer wall rectangle from (80,60) to (720,500), stroke-width 6.",
      "- A continuous 90 px wide central hallway connects an entry vestibule on the left, a living room on the top-right, a bedroom on the bottom-right, and a bathroom between them. No corridor dead-ends or overlapping walls.",
      "- Exactly 4 hinged doors placed in door openings (opening width 48 px each):",
      "  1. Entry door opens inward into the vestibule.",
      "  2. Living room door opens inward into the living room.",
      "  3. Bedroom door opens inward into the bedroom, hinge on the side closest to the bedroom corner wall so the leaf never hits the hallway wall.",
      "  4. Bathroom door opens inward into the bathroom.",
      "- Draw a dashed quarter-circle swing arc (radius 48 px) for every door.",
    ].join("\n"),
    [
      "Loop T = 6s, linear:",
      "At t = 0 and t = 6 all 4 doors are closed (0 degrees, flush with wall).",
      "At t = 3 all 4 doors are open to exactly 90 degrees inward inside their respective rooms, aligned with their dashed swing arcs and never crossing walls. Return cleanly from 3s to 6s so t = 6 matches t = 0 identically.",
    ].join("\n"),
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey: "2D 公寓平面连通拓扑、4 扇门内开铰链定点、48 px 虚线 90 度清扫圆弧与零穿墙闭环",
    groundTruth:
      "在 #12161f 深色蓝图与 viewBox=\"0 0 800 560\" 上绘制外墙 (80,60)-(720,500)（线宽 6）及 90 px 连续中央走廊，连通左侧门厅、右上客厅、右下卧室及中间浴室且无死墙或重叠墙；4 处 48 px 门洞各有 1 扇带 48 px 半径四分之一虚线圆弧的门，全部向各自室内开启（卧室门铰链靠卧室角落墙侧避免碰走廊墙）；T=6s 线性闭环：t=0 与 t=6 全闭（0 度齐墙）且像素 MAE === 0，t=3 全开至室内 90 度并与虚线圆弧重合且零穿墙；max(MAE) >= 0.015；0 <script>。",
    evaluationCriteria:
      "Pass: 平面拓扑连通无死墙且外墙/走廊尺寸符合要求，4 扇门均向各自室内侧开启 90 度且铰链位置与 48 px 虚线圆弧一致不穿墙，t=0 与 t=6 全闭 MAE === 0，max(MAE) >= 0.015 且 0 <script>；Partial: 走廊连通正确且有开合闭环，但 1 扇门朝外开、圆弧方向反向或角度显著偏离 90 度；Fail: 门扇穿墙或铰链漂移、门开入走廊堵路、走廊死结或墙体错误、静止图（max(MAE) < 0.015）、含影视剧/品牌/人物元素或含 <script>。",
    referenceSource: "https://www.aifire.co/p/gemini-4-carbon-takes-on-coding-3d-and-agent-swarm-tests",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "2D Apartment Hallway Connectivity, Inward 90-Degree Hinged Door Swings, 48 px Dashed Sweep Arcs & Zero Wall Clipping",
  groundTruth:
    "Top-down white blueprint lines on #12161f within viewBox=\"0 0 800 560\": outer wall rectangle (80,60)-(720,500) with stroke-width 6 and a continuous 90 px central hallway connecting left entry vestibule, top-right living room, bottom-right bedroom, and intervening bathroom with zero dead-ends or overlapping walls; 4 hinged 48 px doors each paired with a 48 px dashed quarter-circle swing arc opening inward into its room (bedroom hinge nearest the corner wall so the leaf clears the hallway wall); linear T=6s closed loop with all 4 doors flush closed at 0 deg at t=0 and t=6 (MAE === 0) and open exactly 90 deg inward along their arcs at t=3 without crossing walls; max(MAE) >= 0.015; strictly 0 <script>.",
  evaluationCriteria:
    "Pass: Connected non-overlapping hallway topology, all 4 doors hinged properly and swinging 90 deg inward along 48 px dashed quarter-circle arcs with zero wall clipping, exact closed match at t=0 and t=6 (MAE === 0), max(MAE) >= 0.015, and 0 <script>; Partial: Connected layout and loop motion, but 1 door swings outward, has a mirrored sweep arc, or misses 90 deg alignment; Fail: Door leaf clips through walls or detaches from hinge, door blocks hallway, dead-end corridor, static output (max(MAE) < 0.015), any IP/brand/furniture sprites, <script>, or malformed XML.",
};
