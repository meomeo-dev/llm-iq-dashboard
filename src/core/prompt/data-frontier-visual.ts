/**
 * 量子光学、微观芯片与天体物理前沿视效提示词数据
 */

import type { PromptSpec } from "./types";

/**
 * 量子双缝干涉与波粒二象性（纯内联 SVG 动画）。
 * 考察惠更斯-菲涅耳相干波前同心扩散、波程差空间交织与探测屏概率密度干涉条纹。
 */
export const QUANTUM_DOUBLE_SLIT_PROMPT: PromptSpec = {
  id: "quantum-double-slit-v1",
  label: "量子双缝干涉实验（Quantum Double-Slit Wave）",
  template: [
    "Generate an animated SVG demonstrating the classic quantum double-slit wave-particle duality and interference experiment using pure inline SVG animation (SMIL or CSS keyframes).",
    "The physical apparatus and dynamics must feature:",
    "1. An emitter on the far left continuously radiating coherent parallel wavefronts (moving linear plane waves) toward a central barrier.",
    "2. A central barrier with two closely spaced micro-slits.",
    "3. As the wavefront reaches the slits, Huygens-Fresnel wave diffraction creates two expanding concentric circular wave sources emerging from each slit.",
    "4. In the space between barrier and detector screen, the two circular wave trains overlap, creating dynamic wave interference: constructive interference where crests align (glowing peak lines) and destructive interference where crests cancel troughs (dark nodal lines).",
    "5. On the detector screen at the far right, show the resulting probability density curve and alternating bright and dark fringe bands dynamically building up intensity in direct alignment with the constructive interference angles.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Double-slit_experiment",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "惠更斯-菲涅耳相干波前同心扩散与明暗干涉条纹概率分布",
    groundTruth: "左侧入射连续平面行波；双狭缝各自产生同心扩散相干球面波（圆弧波阵面）；波程差满足整数倍波长处形成明亮辐射相长线，半整数倍处形成相消暗节线；最右侧探测屏上明暗相间的干涉条纹中心最亮且向两侧衰减，与理论概率密度函数高度吻合。",
    evaluationCriteria: "1. 波动光学几何（核心）：双缝出射必须为同心圆弧且波阵面同相位扩散，相长/相消干涉节点空间拓扑准确；2. 探测屏条纹对应：干涉条纹峰位与波干涉亮纹角度严格空间对齐；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Double-slit_experiment",
  },
};

/**
 * 磁流体尖刺脉动实验（纯内联 SVG 动画）。
 * 考察磁流体力学 Rosensweig 正常场不稳定性、圆锥尖刺阵列与金属镜面流体光泽。
 */
export const FERROFLUID_SPIKES_PROMPT: PromptSpec = {
  id: "ferrofluid-spikes-v1",
  label: "磁流体尖刺脉动实验（Ferrofluid Magnetic Spikes）",
  template: [
    "Generate an animated SVG visualizing the dynamic normal-field Rosensweig instability of a ferrofluid pool subjected to a pulsating magnetic field using pure inline SVG animation (SMIL or CSS keyframes).",
    "The scientific visualization features:",
    "1. A shallow circular dish containing an ultra-glossy, jet-black magnetic liquid (ferrofluid) with realistic specular highlights and ambient reflections.",
    "2. Beneath the dish, an active electromagnet pulses and rotates its magnetic field gradient.",
    "3. In response to the magnetic pulse, the liquid surface dynamically morphs from a calm, mirror-flat black surface into a dense hexagonal lattice of sharp, conical liquid spikes (spines) rising upward toward magnetic flux lines.",
    "4. As the magnetic field rotates and pulses in strength, the liquid spikes rhythmically grow, sharpen, divide, tilt toward rotating flux vectors, and then smoothly relax back into a rippling liquid pool.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Ferrofluid",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "磁流体力学 Rosensweig 正常场不稳定性、圆锥尖刺阵列与金属镜面流体光泽",
    groundTruth: "强垂直磁场下表面张力与磁化力竞争触发 Rosensweig 不稳定性，流体表面自组织凸起形成规则六边形点阵圆锥尖刺群；尖刺随磁场周期性耸立、扭动指向磁力线方向并平滑松弛；黑色高反射率金属镜面高光反射与微小涟漪。",
    evaluationCriteria: "1. 尖刺阵列形态（黄金指标）：呈现锐利圆锥尖端与流体自组织点阵，而非平庸的平面圆圈；2. 磁响应动态：尖刺拔高与倒回伴随流体吸聚与平滑变形；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Ferrofluid",
  },
};

/**
 * 韦伯空间望远镜主镜与遮阳帆空间展开架构（航天前沿）。
 * 考察 18 块六边形蜂窝镀金主镜、三脚副镜桁架与 5 层菱形隔热遮阳帆空间拓扑与冷热色温渲染。
 */
export const JWST_DEPLOYMENT_PROMPT: PromptSpec = {
  id: "jwst-deployment-v1",
  label: "韦伯太空望远镜（JWST Deployment）",
  template: [
    "Generate an SVG technical illustration of the James Webb Space Telescope (JWST) in deep space showcasing its iconic deployed architecture and thermal-optical engineering.",
    "The spacecraft structure must accurately feature:",
    "1. Primary Mirror Array: Exactly 18 hexagonal beryllium segments coated in vapor-deposited gold, arranged in a pristine, seamless honeycomb array with a central clearance hole for the aft optics subsystem; three slender deployable secondary mirror support struts extending forward to hold the secondary mirror assembly aiming directly back at the primary array.",
    "2. Five-Layer Sunshield: 5 distinct diamond/kite-shaped kapton sunshield membranes stacked beneath the telescope with clear separation gaps and tensioning spreader cables, visually isolating the hot spacecraft bus side from the cryogenic science instrument deck.",
    "3. Spacecraft Bus & Propulsion: On the warm sun-facing side beneath the sunshield, depict the spacecraft bus, solar power array, and gimbaled high-gain communications antenna pointing toward Earth.",
    "4. Deep Space Atmosphere & Lighting: Deep space backdrop with subtle starry field; dramatic, scientifically accurate lighting with warm golden-amber specular reflections across the primary mirrors on the cryogenic side, contrasted with intense solar glare along the silver-pink sunshield layers.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://webb.nasa.gov/content/observatory/sunshield.html",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "18 块六边形主镜蜂窝矩阵、三脚副镜桁架与五层菱形遮阳帆空间拓扑",
    groundTruth: "18 块正六边形蜂窝镀金主镜矩阵（中央留空）；向前伸出三脚铰接桁架汇聚于副镜；底部 5 层间距分明的菱形/风筝形遮阳帆阻隔冷热两端；向阳侧底部配备太阳能帆板与高增益天线；冷端（镜面与仪器舱）与热端（底盘与太阳帆）光照与色温严谨区分。",
    evaluationCriteria: "1. 六边形主镜阵列（黄金指标）：18 块六边形主镜必须排列为严密对称蜂窝，缺少六边形或错乱排列判定为空间结构失误；2. 副镜三脚桁架与五层遮阳帆：三脚架空间透视汇聚于副镜，5 层风筝帆层叠清晰；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://webb.nasa.gov/content/observatory/sunshield.html",
  },
};

/**
 * 托卡马克受控核聚变反应堆磁约束截面与等离子体芯部（核物理前沿，纯内联 SVG 动画）。
 * 考察 D 形真空室截面、环向/极向场线圈正交拓扑与螺旋磁力线发光等离子体。
 */
export const TOKAMAK_PLASMA_PROMPT: PromptSpec = {
  id: "tokamak-plasma-v1",
  label: "托卡马克核聚变反应堆（Tokamak Fusion Core）",
  template: [
    "Generate an animated SVG illustrating a high-tech cutaway cross-section and 3D perspective of a Tokamak magnetic confinement fusion reactor using pure inline SVG animation (SMIL or CSS keyframes).",
    "The nuclear fusion engineering system must accurately depict:",
    "1. Central Toroidal Vacuum Vessel: A clean D-shaped toroidal cross-section chamber with internal divertor plates at the bottom for helium exhaust.",
    "2. Magnetic Confinement System: Vertical D-shaped Toroidal Field Coils encircling the chamber, horizontal circular Poloidal Field Coils rings surrounding the perimeter, and a central solenoid pillar at the core axis.",
    "3. Plasma Core & Dynamics: A radiant, incandescent burning plasma torus inside the D-shaped vacuum chamber, featuring continuous swirling helical magnetic flux lines (twisting field lines representing the safety factor q-profile) in vivid neon cyan, electric violet, and scorching core white.",
    "4. Thermal & Structural Shielding: Cryostat exterior wall, blanket modules protecting the coils, and neutral beam injection ports.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://www.iter.org/mach/tokamak",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "托卡马克 D 形真空室截面、正交环向/极向磁场线圈拓扑与螺旋磁力线等离子体",
    groundTruth: "真空室呈严谨的 D 型截面（垂直平直内侧与外凸外侧）；底部具备偏转器（Divertor）；大 D 型环向场线圈与水平环绕的极向场线圈空间正交；中心为高耸圆柱形中心螺线管；芯部发光等离子体沿环向与极向双重扭曲螺旋缠绕（磁剪切与 q 分布）；外层包裹超导低温恒温器与包层屏蔽。",
    evaluationCriteria: "1. 聚变磁约束拓扑（黄金指标）：真空室必须呈 D 形而非普通圆管，线圈正交空间关系正确，等离子体具备螺旋磁力线拓扑；2. 等离子体发光动效：高能芯部白亮、边缘紫青色温渐变且具有流动螺旋感；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://www.iter.org/mach/tokamak",
  },
};

/**
 * 2nm 全环绕栅极纳米片晶体管与背面供电网络（半导体芯片微观前沿）。
 * 考察 3 层水平硅纳米片沟道、360° 全包裹高 K 金属栅极、源漏外延与背面供电轨（BSPDN）微观三维架构。
 */
export const GAA_NANOSHEET_PROMPT: PromptSpec = {
  id: "gaa-nanosheet-v1",
  label: "2nm 纳米片晶体管（2nm GAA Nanosheet & Backside Power）",
  template: [
    "Generate an SVG technical 3D cutaway diagram of a state-of-the-art 2nm Gate-All-Around (GAA) nanosheet field-effect transistor with Backside Power Delivery Network (BSPDN).",
    "The nano-architectural microelectronics structure features:",
    "1. Nanosheet Channel: Three vertically stacked, horizontally flat silicon (or SiGe) nanosheet ribbons forming the conduction channels, separated by uniform sub-nanometer vertical gaps.",
    "2. Gate-All-Around Stack: High-k dielectric and metallic gate completely wrapping 360° around every individual nanosheet channel ribbon, extending between and around all three sheets.",
    "3. Source/Drain Epitaxy: Faceted raised source and drain crystalline epitaxial blocks abutting both ends of the nanosheet ribbons, with inner dielectric spacers isolating gate from S/D.",
    "4. Frontside & Backside Interconnects: Top-side signal interconnect metal layers (M0/M1) routing out contacts, and bottom-side Backside Power Delivery Network (Super Power Rail) connected directly to source contacts via nano-through-silicon vias (nTSV).",
    "Use a modern high-contrast semiconductor cleanroom CAD aesthetic with crisp layer color coding (silicon blue, metal gate gold/copper, dielectric green/cyan, isolation gray).",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Nanosheet",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "3 层水平硅纳米片全包覆栅极（GAA）、源漏外延与背面供电网络（BSPDN）微观拓扑",
    groundTruth: "3 层水平平行堆叠的硅纳米片沟道，上下及层间被 High-k 金属栅极 360° 无死角包围（全环绕栅极，区别于 FinFET 的三面栅）；沟道两端为外延生长的多边形源极与漏极；内侧绝缘介质垫片（Inner Spacers）隔离栅极与源漏；晶圆正面有信号金属线，背面配备划时代的背面供电轨（BSPDN）与穿透通孔直接给源极供电。",
    evaluationCriteria: "1. GAA 拓扑（黄金指标）：栅极必须 360° 穿插包裹每片纳米片，若画成三面包裹的鳍状 FinFET 或实心方块判定为架构失误；2. 背面供电层次：清晰区分正面信号走线与晶圆背面独立供电网络；3. 标示与分层：纳米尺度结构比例协调、剖面颜色层次清晰。",
    referenceSource: "https://en.wikipedia.org/wiki/Nanosheet",
  },
};

/**
 * CRISPR-Cas9 基因剪刀与 DNA 双螺旋剪切复合体（生物医药与蛋白质前沿）。
 * 考察 Cas9 双叶蛋白结构、gRNA 发夹环引导、DNA 解旋形成的 R-环（R-Loop）与 PAM 双催化中心精确断裂。
 */
export const CRISPR_CAS9_PROMPT: PromptSpec = {
  id: "crispr-cas9-rloop-v1",
  label: "CRISPR-Cas9 基因剪刀（CRISPR-Cas9 & DNA R-Loop）",
  template: [
    "Generate an SVG scientific macromolecular visualization of the CRISPR-Cas9 genome-editing complex actively unwinding and cleaving target double-stranded DNA.",
    "The structural biology model must clearly depict:",
    "1. Cas9 Protein Scaffolding: Bi-lobed enzyme architecture consisting of the Recognition (REC) lobe and the Nuclease (NUC) lobe with distinct domains (including HNH and RuvC catalytic active cleavage centers indicated by glowing molecular scissor marks).",
    "2. Guide RNA (gRNA): A vibrant single guide RNA molecule winding through the central channel of Cas9, with a folded scaffold hairpin loop (tracrRNA handle) locked into the REC lobe and a 20-nucleotide guide spacer sequence.",
    "3. DNA Unwinding & R-Loop Formation: The target double-stranded DNA helix enters the enzyme; the DNA strands separate to form a distinct R-loop where the target DNA strand is base-paired with the guide RNA, while the non-target DNA strand is displaced into a single-stranded loop.",
    "4. Cleavage Sites & PAM: Highlight the Protospacer Adjacent Motif (PAM, 5'-NGG-3') recognition binding cleft, with HNH domain cleaving the target strand and RuvC domain cleaving the non-target strand precisely 3 base pairs upstream of the PAM site.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://www.rcsb.org/structure/4OO8",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "Cas9 双叶蛋白结构、gRNA 碱基互补、DNA 双链解旋 R-环（R-Loop）与 PAM 双活性中心剪切",
    groundTruth: "Cas9 蛋白分为识别叶（REC）与核酸酶叶（NUC）；包含两个催化结构域：HNH 负责剪切靶标链，RuvC 负责剪切非靶标链；单向导 gRNA（含发夹茎环）与解旋的靶标 DNA 链碱基配对，形成标志性 R-环（R-loop）；非靶标链被置换推开呈单链弧形；特异性识别 PAM（NGG）并在其上游 3 个碱基处完成双链精确断裂。",
    evaluationCriteria: "1. 分子生物学拓扑（核心）：必须呈现完整的 R-环（靶标链与 gRNA 配对，非靶标链解离），不可画成普通闭合双螺旋；2. 双核酸酶剪切中心：准确区分 HNH 与 RuvC 两个剪切位点与 PAM 序列；3. 视觉表现：蛋白包裹腔体、核酸链骨架与碱基阶梯分明。",
    referenceSource: "https://www.rcsb.org/structure/4OO8",
  },
};

/**
 * 脉冲星相对论高能喷流与风星云（前沿天体物理与纯视觉特效，纯内联 SVG 动画）。
 * 考察高速自转中子星磁偶极灯塔效应、相对论准直双向喷流激波节点与赤道风星云展开。
 */
export const PULSAR_JET_PROMPT: PromptSpec = {
  id: "pulsar-jet-v1",
  label: "脉冲星相对论喷流（Pulsar Relativistic Jet & Nebula）",
  template: [
    "Generate an animated SVG visualizing a rapidly spinning magnetized neutron star (pulsar) emitting relativistic particle jets and powering a pulsating synchrotron wind nebula using pure inline SVG animation (SMIL or CSS keyframes).",
    "The cosmic physics spectacle features:",
    "1. Central Neutron Star: An ultra-dense, blindingly bright spinning sphere at the core with extreme magnetic surface poles.",
    "2. Dual Relativistic Jets: Two blazing, collimated particle beams shooting outwards from opposite magnetic poles along the rotational axis, with helical shock nodes and glowing knots propagating away from the core at near light speed.",
    "3. Magnetic Dipole Lighthouse Beams: Sweeping cone beams of synchrotron radiation swinging through 360° space like an interstellar lighthouse beacon, producing rhythmic periodic flashes as the beams align with the viewer line of sight.",
    "4. Toroidal Pulsar Wind Nebula: Concentric equatorial shock rings and filamentary ion clouds glowing in electric turquoise, magenta, and solar amber, expanding dynamically outward from the magnetic termination shock.",
    "Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  ].join(" "),
  variables: [],
  candidates: [],
  source: "https://en.wikipedia.org/wiki/Pulsar_wind_nebula",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-26",
  standard: {
    coreKey: "中子星磁偶极辐射灯塔效应、相对论准直双向喷流节点与赤道激波环星云",
    groundTruth: "中心为高速自转的高密度中子星；沿磁轴发射两道高度准直的相对论粒子喷流，喷流内部具有沿程传播的高亮激波节点（shock nodes）；磁倾角导致两束辐射光锥绕自转轴做圆锥形扫掠（脉冲星灯塔效应）；赤道平面展开同心圆弧或环状激波风星云（Pulsar Wind Nebula，类蟹状星云结构）。",
    evaluationCriteria: "1. 天体物理对称与灯塔效应（黄金指标）：双向极向喷流与赤道环面具备严格物理对称性，辐射束扫过周期性明暗闪烁；2. 粒子激波层次：星云灯丝纤维结构与向外扩散的动效层次分明；3. 语法规范：XML 零解析错误。",
    referenceSource: "https://en.wikipedia.org/wiki/Pulsar_wind_nebula",
  },
};
