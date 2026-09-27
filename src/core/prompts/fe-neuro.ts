/**
 * FE-8: 神经电子工程、高带宽脑机接口与仿生微感知 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * FE-NEURO-01: 千通道柔性聚酰亚胺微丝阵列机器人光学避障穿刺与回缩动力学基准
 */
export const FE_NEURO_01_PROMPT: PromptSpec = {
  id: "FE-NEURO-01",
  label: "千通道柔性聚酰亚胺微丝阵列机器人光学避障穿刺与回缩动力学基准 (1024-Channel Flexible Polyimide Microwire Robotic Vascular-Avoidance Insertion & Retraction Benchmark)",
  template: "Generate an SVG technical visualization of 1024-Channel Flexible Polyimide Microwire Robotic Vascular-Avoidance Insertion & Retraction Benchmark using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 侵入式高带宽脑机接口采用超细柔性聚酰亚胺微丝，因极度柔软无法自穿刺脑膜，极易发生欧拉压屈，必须由穿刺针背负。机器人利用 OCT 实时避障，在无血管间隙高速穿刺并回退，微丝原位应力松弛与微回缩。 Physical & Mathematical Ground Truth: 欧拉压屈临界力 F_crit = pi^2*E*I / (K*L)^2 约 6.3 微牛，远低于软脑膜穿刺阻力。微丝厚 5 微米、宽 20 微米，电极点间距 50 微米。血管避障缓冲区 R_buffer = Dv/2 + 25 微米。脑搏动周期 1.0s，微丝残余回缩量 Delta_z 约 150 微米。 Visual Inspection Criteria: 穿刺路径与血管壁最小欧氏距离恒大于 25 微米；动画严格展现穿刺、释放、抽针、回弹 4 阶段时间节律。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "E. Musk et al., An Integrated Brain-Machine Interface Platform, JMIR / bioRxiv (2019); W. Jensen et al., IEEE TBME (2017).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "千通道柔性聚酰亚胺微丝阵列机器人光学避障穿刺与回缩动力学基准",
    groundTruth: "欧拉压屈临界力 F_crit = pi^2*E*I / (K*L)^2 约 6.3 微牛，远低于软脑膜穿刺阻力。微丝厚 5 微米、宽 20 微米，电极点间距 50 微米。血管避障缓冲区 R_buffer = Dv/2 + 25 微米。脑搏动周期 1.0s，微丝残余回缩量 Delta_z 约 150 微米。",
    evaluationCriteria: "穿刺路径与血管壁最小欧氏距离恒大于 25 微米；动画严格展现穿刺、释放、抽针、回弹 4 阶段时间节律。",
    referenceSource: "E. Musk et al., An Integrated Brain-Machine Interface Platform, JMIR / bioRxiv (2019); W. Jensen et al., IEEE TBME (2017).",
  },
};

/**
 * FE-NEURO-02: 纳米多孔 PEDOT:PSS/碳纳米管神经微电极修正 Randles 界面等效电路与 EIS 基准
 */
export const FE_NEURO_02_PROMPT: PromptSpec = {
  id: "FE-NEURO-02",
  label: "纳米多孔 PEDOT:PSS/碳纳米管神经微电极修正 Randles 界面等效电路与 EIS 基准 (Nanoporous PEDOT:PSS/CNT Neural Microelectrode Modified Randles Interface EIS Benchmark)",
  template: "Generate an SVG technical visualization of Nanoporous PEDOT:PSS/CNT Neural Microelectrode Modified Randles Interface EIS Benchmark as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 电极微型化使 1kHz 下阻抗急剧上升。通过电化学共沉积 PEDOT:PSS/CNT 纳米复合层，极大地增加三维比表面积，使 1kHz 阻抗降低至 30k 欧姆以下，相角偏向 -80 度。 Physical & Mathematical Ground Truth: 修正 Randles 电路，Rs = 450 欧，Rct = 1.2M 欧，CPE 导纳 Y0 = 42 nS*s^n，n = 0.88。在 1kHz 下总阻抗模值 |Z| = 10.82k 欧，相角 -77.5 度。对比裸金电极（1.85M 欧）降幅达 99.4%。 Visual Inspection Criteria: 微观剖面展现 4 层分层结构；Bode 图在 1kHz 严格对准 10.8k 欧，相角对准 -77.5 度；Nyquist 图高频截距交于 450 欧。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "X. T. Cui, D. C. Martin, Sensors and Actuators B (2003); F. Vitale et al., Nature Materials (2015).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "纳米多孔 PEDOT:PSS/碳纳米管神经微电极修正 Randles 界面等效电路与 EIS 基准",
    groundTruth: "修正 Randles 电路，Rs = 450 欧，Rct = 1.2M 欧，CPE 导纳 Y0 = 42 nS*s^n，n = 0.88。在 1kHz 下总阻抗模值 |Z| = 10.82k 欧，相角 -77.5 度。对比裸金电极（1.85M 欧）降幅达 99.4%。",
    evaluationCriteria: "微观剖面展现 4 层分层结构；Bode 图在 1kHz 严格对准 10.8k 欧，相角对准 -77.5 度；Nyquist 图高频截距交于 450 欧。",
    referenceSource: "X. T. Cui, D. C. Martin, Sensors and Actuators B (2003); F. Vitale et al., Nature Materials (2015).",
  },
};

/**
 * FE-NEURO-03: 单神经元全频带动作电位与局域场电位 3D 空间电位衰减梯度与双相波形基准
 */
export const FE_NEURO_03_PROMPT: PromptSpec = {
  id: "FE-NEURO-03",
  label: "单神经元全频带动作电位与局域场电位 3D 空间电位衰减梯度与双相波形基准 (Single-Neuron Full-Band Extracellular Spike vs LFP 3D Field Decay & Biphasic Waveforms Benchmark)",
  template: "Generate an SVG technical visualization of Single-Neuron Full-Band Extracellular Spike vs LFP 3D Field Decay & Biphasic Waveforms Benchmark using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 探针记录将原始信号滤波拆分为 Spike 频带（300Hz-3kHz）与 LFP 频带（0.5-300Hz）。Spike 峰值沿径向呈指数衰减并呈现典型的双相（先负后正）波形。 Physical & Mathematical Ground Truth: 容积导体电导率 sigma = 0.33 S/m。近场 Spike 幅值 V(r) = V0 * exp(-r/r0)，V0 = 850 微伏，r0 = 24.5 微米。双相 Spike 动作电位总时程 1.8ms，负峰位于 0.4ms (-650 微伏)，正复极峰位于 1.1ms (+200 微伏)。 Visual Inspection Criteria: 3D 等位线呈同心椭圆环向外扩散；示波器双通道清晰对比高频指数衰减 Spike 与低频平缓 LFP。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "G. R. Holt, C. Koch, J. Comp. Neurosci. (1999); J. J. Jun et al., Nature (2017); N. A. Steinmetz et al., Science (2021).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "单神经元全频带动作电位与局域场电位 3D 空间电位衰减梯度与双相波形基准",
    groundTruth: "容积导体电导率 sigma = 0.33 S/m。近场 Spike 幅值 V(r) = V0 * exp(-r/r0)，V0 = 850 微伏，r0 = 24.5 微米。双相 Spike 动作电位总时程 1.8ms，负峰位于 0.4ms (-650 微伏)，正复极峰位于 1.1ms (+200 微伏)。",
    evaluationCriteria: "3D 等位线呈同心椭圆环向外扩散；示波器双通道清晰对比高频指数衰减 Spike 与低频平缓 LFP。",
    referenceSource: "G. R. Holt, C. Koch, J. Comp. Neurosci. (1999); J. J. Jun et al., Nature (2017); N. A. Steinmetz et al., Science (2021).",
  },
};

/**
 * FE-NEURO-04: 仿生微金字塔微结构柔性压阻电子皮肤法向力与剪切滑移多轴解耦基准
 */
export const FE_NEURO_04_PROMPT: PromptSpec = {
  id: "FE-NEURO-04",
  label: "仿生微金字塔微结构柔性压阻电子皮肤法向力与剪切滑移多轴解耦基准 (Biomimetic Micropyramid Flexible Piezoresistive Tactile E-Skin Multi-Axis Force Decoupling Benchmark)",
  template: "Generate an SVG technical visualization of Biomimetic Micropyramid Flexible Piezoresistive Tactile E-Skin Multi-Axis Force Decoupling Benchmark as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 仿生电子皮肤需同时解耦法向力 Fz 与剪切力 Fx, Fy，并消除聚合物粘弹性迟滞。微金字塔配合四象限差分电极，利用受力侧翼不对称接触形变实现纯硬件多轴解耦。 Physical & Mathematical Ground Truth: 金字塔顶角 70.5 度，底面边长 28.3 微米。法向力 Vz 正比于四个象限电阻变化之和，切向力 Vx 正比于 (Delta R1 + Delta R4) - (Delta R2 + Delta R3)。解耦交叉干扰 < 2.5%，响应时间 < 5ms，迟滞误差 < 3.5%。 Visual Inspection Criteria: 清晰标注三维坐标与四象限电极剖面；加载倾斜力时最高应力点偏向受压倾斜侧；剪切扫描差分响应线性度 R^2 > 0.98。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "S. C. Mannsfeld et al., Nature Materials (2010); C. M. Boutry et al., Science Robotics (2018); Y. Zhang et al., Science Robotics (2021).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "仿生微金字塔微结构柔性压阻电子皮肤法向力与剪切滑移多轴解耦基准",
    groundTruth: "金字塔顶角 70.5 度，底面边长 28.3 微米。法向力 Vz 正比于四个象限电阻变化之和，切向力 Vx 正比于 (Delta R1 + Delta R4) - (Delta R2 + Delta R3)。解耦交叉干扰 < 2.5%，响应时间 < 5ms，迟滞误差 < 3.5%。",
    evaluationCriteria: "清晰标注三维坐标与四象限电极剖面；加载倾斜力时最高应力点偏向受压倾斜侧；剪切扫描差分响应线性度 R^2 > 0.98。",
    referenceSource: "S. C. Mannsfeld et al., Nature Materials (2010); C. M. Boutry et al., Science Robotics (2018); Y. Zhang et al., Science Robotics (2021).",
  },
};

/**
 * FE-NEURO-05: 仿生水凝胶离子电子皮肤双电层电容微界面传感与超宽线性梯度基准
 */
export const FE_NEURO_05_PROMPT: PromptSpec = {
  id: "FE-NEURO-05",
  label: "仿生水凝胶离子电子皮肤双电层电容微界面传感与超宽线性梯度基准 (Biomimetic Hydrogel Ionotronic Skin Electric Double Layer (EDL) Capacitive Benchmark)",
  template: "Generate an SVG technical visualization of Biomimetic Hydrogel Ionotronic Skin Electric Double Layer (EDL) Capacitive Benchmark as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 离子电子皮肤利用纳米级双电层（德拜长度 < 1nm）形成微法级超高电容。结合阶梯多级渐变高度微结构，解决高初始灵敏度与高压下过早饱和截断的矛盾。 Physical & Mathematical Ground Truth: Gouy-Chapman-Stern 模型，德拜长度 0.8nm，固有双电层电容 10~25 微法/cm^2。三级阶梯高度 H1=30, H2=20, H3=10 微米。初始灵敏度 S1 = 48.5 kPa^-1，在 800 kPa 极限重载下依然保持线性传感，R^2 > 0.992。 Visual Inspection Criteria: 展示 Helmholtz 紧密层与扩散层离子云梯度分布；三阶段微结构变形清晰对应 Delta C/C0 曲线的过渡区。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. A. Dobrzynska, M. A. Gijs, JMM (2012); N. Bai et al., Nature Communications (2020); A. Chortos et al., Nature Materials (2016).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "仿生水凝胶离子电子皮肤双电层电容微界面传感与超宽线性梯度基准",
    groundTruth: "Gouy-Chapman-Stern 模型，德拜长度 0.8nm，固有双电层电容 10~25 微法/cm^2。三级阶梯高度 H1=30, H2=20, H3=10 微米。初始灵敏度 S1 = 48.5 kPa^-1，在 800 kPa 极限重载下依然保持线性传感，R^2 > 0.992。",
    evaluationCriteria: "展示 Helmholtz 紧密层与扩散层离子云梯度分布；三阶段微结构变形清晰对应 Delta C/C0 曲线的过渡区。",
    referenceSource: "J. A. Dobrzynska, M. A. Gijs, JMM (2012); N. Bai et al., Nature Communications (2020); A. Chortos et al., Nature Materials (2016).",
  },
};

/**
 * FE-NEURO-06: 16倍全脑膨胀显微镜突触连接组学纳米囊泡簇与突触后致密区空间反褶积基准
 */
export const FE_NEURO_06_PROMPT: PromptSpec = {
  id: "FE-NEURO-06",
  label: "16倍全脑膨胀显微镜突触连接组学纳米囊泡簇与突触后致密区空间反褶积基准 (16× Expansion Microscopy Connectomics (LICONN) Synaptic Vesicle & PSD Deconvolution Benchmark)",
  template: "Generate an SVG technical visualization of 16× Expansion Microscopy Connectomics (LICONN) Synaptic Vesicle & PSD Deconvolution Benchmark using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 传统全脑连接组学依赖电镜。2025 年 Nature 发表的 LICONN 技术将脑组织水凝胶网络物理各向同性膨胀 16 倍（体积 4096 倍），在光镜下突破 20nm 有效分辨率，直接分辨突触间隙。 Physical & Mathematical Ground Truth: 物理膨胀因子 16.0，真实突触间隙 20nm 膨胀后为 320nm（突破阿贝极限 250nm）。共聚焦等效 PSF FWHM 达到 15.6nm。突触前 Bassoon 荧光带与突触后 PSD-95 之间清晰可见 20nm 黑色裂隙，质心间距标定为 35~40nm。 Visual Inspection Criteria: 动画展示未膨胀模糊光斑、16x 网格膨胀、超分辨反褶积收敛三阶段；最终帧定量测距 Bassoon 与 PSD-95 质心间距 35~40nm。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "F. Chen, P. W. Tillberg, E. S. Boyden, Science (2015); M. R. Tavakoli et al., LICONN, Nature (2025).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "16倍全脑膨胀显微镜突触连接组学纳米囊泡簇与突触后致密区空间反褶积基准",
    groundTruth: "物理膨胀因子 16.0，真实突触间隙 20nm 膨胀后为 320nm（突破阿贝极限 250nm）。共聚焦等效 PSF FWHM 达到 15.6nm。突触前 Bassoon 荧光带与突触后 PSD-95 之间清晰可见 20nm 黑色裂隙，质心间距标定为 35~40nm。",
    evaluationCriteria: "动画展示未膨胀模糊光斑、16x 网格膨胀、超分辨反褶积收敛三阶段；最终帧定量测距 Bassoon 与 PSD-95 质心间距 35~40nm。",
    referenceSource: "F. Chen, P. W. Tillberg, E. S. Boyden, Science (2015); M. R. Tavakoli et al., LICONN, Nature (2025).",
  },
};

/**
 * FE-NEURO-07: 视网膜人工光电假体 3D 蜂窝微腔电场垂向约束与双极细胞感受野激活基准
 */
export const FE_NEURO_07_PROMPT: PromptSpec = {
  id: "FE-NEURO-07",
  label: "视网膜人工光电假体 3D 蜂窝微腔电场垂向约束与双极细胞感受野激活基准 (Subretinal 3D Honeycomb Photovoltaic Prosthesis Electric Field Confinement Benchmark)",
  template: "Generate an SVG technical visualization of Subretinal 3D Honeycomb Photovoltaic Prosthesis Electric Field Confinement Benchmark as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 视网膜下腔无源微光伏阵列（PRIMA）中，平面电极边缘电场横向发散。3D 蜂窝微腔利用垂直绝缘壁将电场约束为单轴垂向，诱导双极细胞迁移入腔，以超低电荷注入实现高视锐度人工视觉。 Physical & Mathematical Ground Truth: 六边形像素间距 30 微米，深度 25 微米。侧壁绝缘边界 dPhi/dn = 0，腔内电场严格为一维垂直梯度 Ez = Vstim / H，侧向泄漏率 < 0.05。双极细胞激活电场阈值 80~120 V/m，电荷注入密度 0.15 mC/cm^2。 Visual Inspection Criteria: 双列对比传统平面电极发散半球等位线与 3D 蜂窝腔内平行等位线；腔内等位线自底向顶呈 100% 至 0% 线性等间距递减。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "H. Lorach et al., Nature Medicine (2015); D. Palanker et al., JNE (2020); T. Flores et al., PNAS (2022).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "视网膜人工光电假体 3D 蜂窝微腔电场垂向约束与双极细胞感受野激活基准",
    groundTruth: "六边形像素间距 30 微米，深度 25 微米。侧壁绝缘边界 dPhi/dn = 0，腔内电场严格为一维垂直梯度 Ez = Vstim / H，侧向泄漏率 < 0.05。双极细胞激活电场阈值 80~120 V/m，电荷注入密度 0.15 mC/cm^2。",
    evaluationCriteria: "双列对比传统平面电极发散半球等位线与 3D 蜂窝腔内平行等位线；腔内等位线自底向顶呈 100% 至 0% 线性等间距递减。",
    referenceSource: "H. Lorach et al., Nature Medicine (2015); D. Palanker et al., JNE (2020); T. Flores et al., PNAS (2022).",
  },
};

/**
 * FE-NEURO-08: 类器官脑机智能接口 3D-MEA 自发同步爆发与临界神经雪崩分支动力学基准
 */
export const FE_NEURO_08_PROMPT: PromptSpec = {
  id: "FE-NEURO-08",
  label: "类器官脑机智能接口 3D-MEA 自发同步爆发与临界神经雪崩分支动力学基准 (3D-MEA Brain Organoid Spontaneous Bursting & Critical Neuronal Avalanche Benchmark)",
  template: "Generate an SVG technical visualization of 3D-MEA Brain Organoid Spontaneous Bursting & Critical Neuronal Avalanche Benchmark using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 脑类器官智能（BEGIN OI）利用 3D 微电极阵列记录活体神经元。成熟类器官自发涌现同步爆发与神经雪崩，在自组织临界态（Criticality）下计算容量达到最大，统计特征呈现无标度双重幂律分布。 Physical & Mathematical Ground Truth: 临界分支比 sigma = 1.00 +- 0.02。雪崩规模分布 P(S) 正比于 S^-tau (tau = 1.50 +- 0.05)。雪崩持续时间分布 P(T) 正比于 T^-alpha (alpha = 2.00 +- 0.08)。满足标度塌缩关系 (alpha-1)/(tau-1) = 2.0。 Visual Inspection Criteria: 左侧三维神经球呈现电极级联闪烁雪崩；右侧双对数坐标系动态拟合散点，拟合红线斜率精确等于 -1.50 (+-0.05)。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. M. Beggs, D. Plenz, J. Neurosci. (2003); C. A. Trujillo et al., Cell Stem Cell (2019); L. Smirnova et al., Frontiers in Science (2023).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "类器官脑机智能接口 3D-MEA 自发同步爆发与临界神经雪崩分支动力学基准",
    groundTruth: "临界分支比 sigma = 1.00 +- 0.02。雪崩规模分布 P(S) 正比于 S^-tau (tau = 1.50 +- 0.05)。雪崩持续时间分布 P(T) 正比于 T^-alpha (alpha = 2.00 +- 0.08)。满足标度塌缩关系 (alpha-1)/(tau-1) = 2.0。",
    evaluationCriteria: "左侧三维神经球呈现电极级联闪烁雪崩；右侧双对数坐标系动态拟合散点，拟合红线斜率精确等于 -1.50 (+-0.05)。",
    referenceSource: "J. M. Beggs, D. Plenz, J. Neurosci. (2003); C. A. Trujillo et al., Cell Stem Cell (2019); L. Smirnova et al., Frontiers in Science (2023).",
  },
};

/**
 * FE-NEURO-09: 外周神经再生筛网微电极微通道高阻密封与单纤维动作电位放大基准
 */
export const FE_NEURO_09_PROMPT: PromptSpec = {
  id: "FE-NEURO-09",
  label: "外周神经再生筛网微电极微通道高阻密封与单纤维动作电位放大基准 (Regenerative Sieve Microchannel Microelectrode Axon Amplification Benchmark)",
  template: "Generate an SVG technical visualization of Regenerative Sieve Microchannel Microelectrode Axon Amplification Benchmark as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: 外周神经损伤截肢假肢控制中，再生筛网微电极（Sieve Electrode）多孔阵列引导再生轴突穿过微通道。微孔高外周电阻 R_ext = rho*L / A 将微弱离子流转化为毫伏级高信噪比电位信号。 Physical & Mathematical Ground Truth: 聚酰亚胺微孔阵列，微孔直径 15 微米，通道长度 100 微米。脑脊液/组织液电阻率 0.7 欧·米，微通道高密封电阻 R_ext 达到 396k 欧（远超开放空间电阻）。单轴突放电时在通道内产生的电位峰峰值放大至 > 1.2 mV（未密封仅数十微伏）。 Visual Inspection Criteria: 宏观横截面展示同心神经束穿过筛孔；微观微通道展示等效电阻回路与双侧密封边界；示波器曲线标出峰峰值 1.4 mV。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "G. T. Kovacs et al., IEEE TBME (1994); T. Stieglitz et al., Microsystem Technologies (1997); X. Navarro et al., NeuroRx (2005).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "外周神经再生筛网微电极微通道高阻密封与单纤维动作电位放大基准",
    groundTruth: "聚酰亚胺微孔阵列，微孔直径 15 微米，通道长度 100 微米。脑脊液/组织液电阻率 0.7 欧·米，微通道高密封电阻 R_ext 达到 396k 欧（远超开放空间电阻）。单轴突放电时在通道内产生的电位峰峰值放大至 > 1.2 mV（未密封仅数十微伏）。",
    evaluationCriteria: "宏观横截面展示同心神经束穿过筛孔；微观微通道展示等效电阻回路与双侧密封边界；示波器曲线标出峰峰值 1.4 mV。",
    referenceSource: "G. T. Kovacs et al., IEEE TBME (1994); T. Stieglitz et al., Microsystem Technologies (1997); X. Navarro et al., NeuroRx (2005).",
  },
};

/**
 * FE-NEURO-10: 血管内支架电极 (Stentrode) 内皮化界面与超声神经尘埃反向散射遥测基准
 */
export const FE_NEURO_10_PROMPT: PromptSpec = {
  id: "FE-NEURO-10",
  label: "血管内支架电极 (Stentrode) 内皮化界面与超声神经尘埃反向散射遥测基准 (Endovascular Stentrode Endothelialization & Ultrasonic Neural Dust Telemetry Benchmark)",
  template: "Generate an SVG technical visualization of Endovascular Stentrode Endothelialization & Ultrasonic Neural Dust Telemetry Benchmark using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: Stentrode 经血管微创植入上矢状窦贴壁记录皮层脑电，2-4 周血管内皮细胞完全爬覆包裹，彻底消弭微动位移与异物反应。结合深部超声神经尘埃（1.85 MHz 压电晶体），利用电生理阻抗失谐调制超声回波反向散射实现无源无线遥测。 Physical & Mathematical Ground Truth: 上矢状窦血管管径 4mm，镍钛合金自膨支架壁厚 50 微米。4 周内皮化厚度 40 微米，1kHz 阻抗稳定在 15~35k 欧。神经尘埃压电晶体尺寸 0.8mm，工作频率 1.85 MHz，声压透射系数 T = 2*Z2/(Z1+Z2)，反向散射回波调制深度 Delta_Gamma 约 1.2%。 Visual Inspection Criteria: 动画展示支架沿血管壁贴合、内皮细胞爬覆包裹以及超声探头向神经尘埃发射脉冲并接收相位调制回波的连续过程；调制深度波形标称 1.2%。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "T. J. Oxley et al., Nature Biotechnology (2016); D. J. Seo et al., Neuron (2016); D. K. Piech et al., Nature Biomedical Engineering (2020).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "血管内支架电极 (Stentrode) 内皮化界面与超声神经尘埃反向散射遥测基准",
    groundTruth: "上矢状窦血管管径 4mm，镍钛合金自膨支架壁厚 50 微米。4 周内皮化厚度 40 微米，1kHz 阻抗稳定在 15~35k 欧。神经尘埃压电晶体尺寸 0.8mm，工作频率 1.85 MHz，声压透射系数 T = 2*Z2/(Z1+Z2)，反向散射回波调制深度 Delta_Gamma 约 1.2%。",
    evaluationCriteria: "动画展示支架沿血管壁贴合、内皮细胞爬覆包裹以及超声探头向神经尘埃发射脉冲并接收相位调制回波的连续过程；调制深度波形标称 1.2%。",
    referenceSource: "T. J. Oxley et al., Nature Biotechnology (2016); D. J. Seo et al., Neuron (2016); D. K. Piech et al., Nature Biomedical Engineering (2020).",
  },
};

export const FE_NEURO_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  FE_NEURO_01_PROMPT,
  FE_NEURO_02_PROMPT,
  FE_NEURO_03_PROMPT,
  FE_NEURO_04_PROMPT,
  FE_NEURO_05_PROMPT,
  FE_NEURO_06_PROMPT,
  FE_NEURO_07_PROMPT,
  FE_NEURO_08_PROMPT,
  FE_NEURO_09_PROMPT,
  FE_NEURO_10_PROMPT,
];

/**
 * FE-8: 神经电子工程、高带宽脑机接口与仿生微感知 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const FE_NEURO_SUITE_PROMPT: PromptSpec = {
  id: "fe-neuro-v1",
  label: "FE-8: 神经电子工程与脑机感知（十题组）",
  template: "FE-8: 神经电子工程、高带宽脑机接口与仿生微感知 前沿工程十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: FE_NEURO_01_PROMPT.id,
      label: "千通道柔性聚酰亚胺微丝阵列机器人光学避障穿刺与回缩动力学基准",
      text: FE_NEURO_01_PROMPT.template,
      standard: FE_NEURO_01_PROMPT.standard,
    },
    {
      id: FE_NEURO_02_PROMPT.id,
      label: "纳米多孔 PEDOT:PSS/碳纳米管神经微电极修正 Randles 界面等效电路与 EIS 基准",
      text: FE_NEURO_02_PROMPT.template,
      standard: FE_NEURO_02_PROMPT.standard,
    },
    {
      id: FE_NEURO_03_PROMPT.id,
      label: "单神经元全频带动作电位与局域场电位 3D 空间电位衰减梯度与双相波形基准",
      text: FE_NEURO_03_PROMPT.template,
      standard: FE_NEURO_03_PROMPT.standard,
    },
    {
      id: FE_NEURO_04_PROMPT.id,
      label: "仿生微金字塔微结构柔性压阻电子皮肤法向力与剪切滑移多轴解耦基准",
      text: FE_NEURO_04_PROMPT.template,
      standard: FE_NEURO_04_PROMPT.standard,
    },
    {
      id: FE_NEURO_05_PROMPT.id,
      label: "仿生水凝胶离子电子皮肤双电层电容微界面传感与超宽线性梯度基准",
      text: FE_NEURO_05_PROMPT.template,
      standard: FE_NEURO_05_PROMPT.standard,
    },
    {
      id: FE_NEURO_06_PROMPT.id,
      label: "16倍全脑膨胀显微镜突触连接组学纳米囊泡簇与突触后致密区空间反褶积基准",
      text: FE_NEURO_06_PROMPT.template,
      standard: FE_NEURO_06_PROMPT.standard,
    },
    {
      id: FE_NEURO_07_PROMPT.id,
      label: "视网膜人工光电假体 3D 蜂窝微腔电场垂向约束与双极细胞感受野激活基准",
      text: FE_NEURO_07_PROMPT.template,
      standard: FE_NEURO_07_PROMPT.standard,
    },
    {
      id: FE_NEURO_08_PROMPT.id,
      label: "类器官脑机智能接口 3D-MEA 自发同步爆发与临界神经雪崩分支动力学基准",
      text: FE_NEURO_08_PROMPT.template,
      standard: FE_NEURO_08_PROMPT.standard,
    },
    {
      id: FE_NEURO_09_PROMPT.id,
      label: "外周神经再生筛网微电极微通道高阻密封与单纤维动作电位放大基准",
      text: FE_NEURO_09_PROMPT.template,
      standard: FE_NEURO_09_PROMPT.standard,
    },
    {
      id: FE_NEURO_10_PROMPT.id,
      label: "血管内支架电极 (Stentrode) 内皮化界面与超声神经尘埃反向散射遥测基准",
      text: FE_NEURO_10_PROMPT.template,
      standard: FE_NEURO_10_PROMPT.standard,
    },
  ],
  source: "E. Musk et al., An Integrated Brain-Machine Interface Platform, JMIR / bioRxiv (2019); W. Jensen et al., IEEE TBME (2017).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "高密度千通道柔性神经微丝、微电极等效阻抗与仿生触觉电子皮肤",
    groundTruth: "以千通道聚酰亚胺微丝电极空间阵列、PEDOT:PSS 微电极 Randles 等效电路阻抗谱（EIS）、微金字塔触觉压阻剪切解耦与动作电位细胞外衰减场为基准，满足神经电生理学方程与接触力学。",
    evaluationCriteria: "1. 电气参数自洽：阻抗频率响应与动作电位波形标准；2. 微结构仿生：微金字塔与纳米多孔界面拓扑清晰；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.nature.com/natbiotechnol",
  },
};

export const FE_NEURO_PROMPTS = FE_NEURO_INDIVIDUAL_PROMPTS;
