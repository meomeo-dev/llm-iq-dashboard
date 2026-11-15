import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-lattice-tower-erection-v1",
  label: "铆接铁桁架塔吊装施工动效 (Animated Riveted Lattice Tower Staged Erection)",
  template: [
    "Generate one self-contained animated SVG depicting the staged erection of a parabolic tapered riveted lattice iron tower. No real landmark names, no brand, no real people, no external assets, no audio, no script.",
    'Technical contract: SMIL (<animate>, <animateTransform>) or inline CSS @keyframes only. 0 <script>, 0 event handlers. viewBox="0 0 800 560". Any <style> goes inside <![CDATA[...]]>. Well-formed XML.',
    "Visual style: Engineering twilight blueprint aesthetic on a deep navy background (#0e1522). Crisp oblique/isometric vector ironwork using amber-steel and bronze-slate trusses paired with cool cyan blueprint plumb lines and a dashed target silhouette.",
    "Fixed base & rig: Centered on baseline (400, 495), draw a fixed ground baseplate with 4 symmetric splayed stone foundation piers and a climbing mast crane positioned beside the central axis. Every truss diagonal must meet its corner chord node cleanly with zero floating detached members.",
    "Four parabolic tapered lattice stages:\n1. Stage 1: 4 inclined leg pylons joined by an arched lower truss bridge and Level-1 observation deck.\n2. Stage 2: Tapered mid-shaft converging legs and Level-2 gallery deck.\n3. Stage 3: Slender upper shaft lattice panels.\n4. Stage 4: Crown gallery and tapered lattice spire mast with top beacon.",
    "Animation sequence (closed loop T = 8s):\n- At t = 0s (and t = 8s): Only the stone foundation piers, ready crane boom, faint cyan dashed blueprint target outline, and 0% elevation bar are visible; pixels at t = 0s and t = 8s must match identically (MAE === 0).\n- 0.5s to 6.0s: The crane boom rotates and tracks upward while Stages 1 through 4 sequentially hoist into exact pinned alignment (Level 1 -> Level 2 -> Upper Shaft -> Spire), with brief rivet-weld spark flashes at seam joints and a phase-synchronized vertical elevation marker bar advancing from 0% to 100%.\n- 6.0s to 6.8s: Hold the completed illuminated tower with steady top beacon.\n- 6.8s to 8.0s: Cleanly dissolve the lifted ironwork back down to the initial dashed blueprint state at t = 0s.",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source:
    "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "四阶段抛物线收分铆接桁架塔分段吊装、斜腹杆节点全闭合、塔吊追踪与接缝火花及 T=8s 闭环复原",
    groundTruth:
      "纯内联声明式 SVG（viewBox=\"0 0 800 560\"，#0e1522 深蓝图底，琥珀钢/青铜灰桁架配冷青铅垂线与虚线轮廓），基线 (400, 495) 设四座对称石墩基座与中轴旁爬升塔吊；四段抛物线收分结构（含下层拱桥与一层平台、中段收敛柱与二层廊台、上段细桁架、顶冠平台与尖塔信标）斜腹杆均准确交汇角柱节点无浮空断杆；T=8s 闭环内 t=0s 仅见基座、待命吊臂与蓝图虚线，0.5s-6.0s 吊臂追踪伴随 Level 1 -> Level 2 -> Upper Shaft -> Spire 顺序吊装、接缝闪烁及 0%-100% 高程条同步推进，6.0s-6.8s 稳态保持，6.8s-8.0s 溶解复位；t=0s 与 t=8s 像素 MAE === 0，周期内 max(MAE) >= 0.020，0 <script>。",
    evaluationCriteria:
      "Pass: #0e1522 蓝图配色、四石墩基座与塔吊齐全，四段抛物线收分桁架斜杆节点全闭合无悬空，0.5s-6.0s 四段按序就位且与吊臂追踪、焊点闪烁、0%-100% 高程条严格同步，6.0s-6.8s 保持并在 6.8s-8.0s 复原至 t=0s 虚线态（MAE === 0），周期内 max(MAE) >= 0.020 且 0 <script>，无真实地标商标或人物；Partial: 四段结构与 8s 闭环基本成立，但局部斜杆未闭节点、吊臂或高程条未联动或缺少焊点闪烁；Fail: 静态无动效（max(MAE) < 0.020）、首尾帧不一致（MAE > 0）、四段无序同时出现、含 <script>/外部资产/真实地标商标或 XML 错误。",
    referenceSource:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Four-Stage Parabolic Riveted Lattice Tower Hoist, Closed Truss Nodes, Crane Tracking & T=8s Blueprint Loop",
  groundTruth:
    'Pure inline declarative SVG (viewBox="0 0 800 560", #0e1522 twilight blueprint background, amber-steel/bronze-slate ironwork with cyan plumb lines and dashed target outline); fixed baseplate at (400, 495) with 4 splayed stone foundation piers and beside-axis climbing mast crane; 4 parabolic tapered stages (arched lower bridge + Level-1 deck, converging mid-shaft + Level-2 gallery, slender upper shaft, crown gallery + spire beacon) with every truss diagonal meeting corner chord nodes without detached members; T=8s loop starting from piers + ready boom + dashed outline at t=0s, sequential hoisting from 0.5s to 6.0s (Level 1 -> Level 2 -> Upper Shaft -> Spire) synchronized with crane tracking, seam spark flashes, and 0%-100% elevation bar, steady illuminated hold 6.0s-6.8s, and clean dissolve back to t=0s blueprint by 8.0s; pixel MAE === 0 between t=0s and t=8s, max(MAE) >= 0.020, strictly 0 <script>.',
  evaluationCriteria:
    "Pass: Correct #0e1522 blueprint palette, 4 foundation piers, climbing crane, and 4 parabolic lattice stages with all truss diagonals closed cleanly at chord nodes; sequential 0.5s-6.0s erection synchronized with crane tracking, seam flashes, and 0%-100% elevation marker; steady hold 6.0s-6.8s and full dissolve back to t=0s dashed state by 8.0s with MAE === 0, max(MAE) >= 0.020, 0 <script>, and zero trademarks or real people; Partial: Overall 4-stage silhouette and 8s loop present but some floating truss members, uncoupled crane/elevation bar, or missing seam flashes; Fail: Static image (max(MAE) < 0.020), non-matching t=0s/t=8s frames (MAE > 0), simultaneous unordered pop-in, any <script>/external assets/real landmark trademarks, or invalid XML.",
};
