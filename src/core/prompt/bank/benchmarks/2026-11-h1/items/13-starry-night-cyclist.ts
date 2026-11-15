import type { LocalizedStandardEntry, PromptSpec } from "../../../../types";

export const PROMPT_SPEC: PromptSpec = {
  id: "animated-starry-night-cyclist-v1",
  label: "星夜漩涡山地骑行动效 (Animated Swirling Starry Night Cyclist)",
  template: [
    "Generate one self-contained animated SVG of a poetic night-cycling scene under a swirling post-impressionist cobalt and indigo brushstroke sky. No text, no brand, no real person names, no audio, no script.",
    'Technical contract: Pure inline animated SVG with viewBox="0 0 800 500", SMIL (<animate>, <animateTransform>) or inline CSS @keyframes inside <style><![CDATA[...]]></style>. Strictly 0 <script>, 0 event handlers, and 0 external assets, scripts, Three.js, Canvas, or WebGL. Well-formed XML.',
    "Scene composition:\n- Sky: Deep cobalt and indigo night sky filled with layered dashed and arc brushstroke bands forming at least two interlocking concentric vortex spirals, plus a golden haloed crescent moon and radiating haloed stars.\n- Foreground & valley: A dark flame-shaped cypress silhouette rising on the left foreground, rolling dark-indigo ridge hills, a quiet valley village with warm lit windows and a slender steeple, and a winding ridge path across the mid-foreground.\n- Cyclist: An anonymous silhouetted night cyclist riding a spoked road bicycle cleanly seated along the ridge road crown (0 wheel floating above or sinking below the road surface).",
    "Kinematics and seamless T = 6s closed loop:\n1. Both front and rear spoked wheels rotate forward cleanly around their exact hub centers by an exact integer multiple of 360 degrees over 6s with linear timing.\n2. The crankset, pedal arms, and the rider's articulated thigh and shin linkages pump in phase with the crank circle without disconnecting from the hubs, bottom bracket, or saddle.\n3. The interlocking sky vortex spirals rotate continuously by an exact integer multiple of 360 degrees over 6s, while the golden moon and star halos pulse gently and the cypress flame tips sway smoothly in a calm breeze.\n4. Identical visual state at t = 0s and t = 6s (pixel MAE === 0) with clear motion amplitude inside the loop (max(MAE) >= 0.015).",
    "Output only the <svg>.",
  ].join("\n\n"),
  variables: [],
  candidates: [],
  source: "https://x.com/ebbyamir/status/2120284261089673376",
  verified: true,
  immutable: true,
  originDate: "2026-11",
  registeredAt: "2026-11-14",
  standard: {
    coreKey:
      "纯内联声明式 SVG 夜空漩涡笔触、前景柏树山谷村落构图、自行车定轴旋转与骑手下肢曲柄同相联动及 6s 无缝闭环",
    groundTruth:
      "在 viewBox=\"0 0 800 500\" 中以纯 SMIL 或 CDATA 内联 CSS 实现 T=6s 无脚本动画（0 <script>，0 外部资源，无任何真实人物或商标名称）：天空含至少 2 组同心交织的钴蓝/靛青虚线弧段漩涡并绕各自圆心线性旋转 360*N 度，金色弯月与群星光晕柔和呼吸脉动；左侧前景火焰状柏树剪影尖端随微风往返摆动；山谷村落尖塔与暖光窗格、连绵山脊路面层次分明；匿名剪影骑手与前后带辐条车轮紧贴山脊路面冠顶（不悬空、不穿模），前后轮绕各自精确轮毂圆心同步正向旋转 360*N 度，牙盘曲柄与骑手大腿/小腿铰接连杆严格同相耦合；t=0s 与 t=6s 像素 MAE === 0，且周期内 max(MAE) >= 0.015。",
    evaluationCriteria:
      "Pass: 满足纯内联声明式 SVG 规范（0 <script>，0 外部依赖，零真实人物/商标），具备双组及以上旋转漩涡天穹、脉动弯月星晕、摆动柏树、山谷村落与尖塔，自行车稳固贴合路面冠顶，双轮定轴旋转且曲柄-下肢同相联动不断连，t=0s 与 t=6s 像素 MAE === 0 且 max(MAE) >= 0.015；Partial: 造型与闭环基本成立，但存在车轮微偏心、下肢与踏板相位轻微脱节、轮胎轻度悬空或个别背景层首尾轻微跳变；Fail: 静态无明显动画（max(MAE) < 0.015）、含 <script> 或外部框架、出现真实人物姓名或商标文本、XML 语法错误或闭环破裂。",
    referenceSource: "https://x.com/ebbyamir/status/2120284261089673376",
  },
};

export const STANDARD_EN: LocalizedStandardEntry = {
  coreKey:
    "Swirling Post-Impressionist Night Sky Vortices, Grounded Spoked Bicycle & Synchronized Crank-Leg Kinematics in a 6s Closed SVG Loop",
  groundTruth:
    "Pure declarative inline SVG (viewBox=\"0 0 800 500\", SMIL or CDATA CSS @keyframes, strictly 0 <script>, 0 external assets, zero real person names or trademarks) completing a T=6s closed loop: at least two interlocking concentric dashed-arc cobalt/indigo sky vortex spirals rotating 360*N deg linearly around their centers, golden crescent moon and star halos pulsing gently, left foreground flame-shaped cypress tips swaying smoothly, valley village steeple and lit windows behind a winding ridge road, and an anonymous silhouetted cyclist with front and rear spoked wheels grounded cleanly on the road crown rotating 360*N deg around exact hub centers while crankset and articulated thigh/shin linkages pump in phase without detachment; pixel MAE === 0 between t=0s and t=6s and max(MAE) >= 0.015.",
  evaluationCriteria:
    "Pass: Valid inline SVG with 0 <script> and 0 real names/brands, 2+ interlocking rotating sky vortices, pulsing moon/star halos, swaying cypress silhouette, valley steeple/village, wheels grounded cleanly on road crown spinning around exact hub centers with synchronized crank-leg kinematics, t=0s/t=6s pixel MAE === 0, and max(MAE) >= 0.015; Partial: Scene and loop present but minor hub eccentricity, slight pedal-leg desync, slight wheel float, or minor loop seam in background layers; Fail: Static output (max(MAE) < 0.015), any <script> or external dependency, real person or brand names present, broken XML, or non-closing loop.",
};
