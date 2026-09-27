/**
 * VFX-2: 波动光学传播、全光谱渲染与显式辐射场 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * VFX-OPTICS-01: 时空储层重采样全局光照重连雅可比行列式解析场
 */
export const VFX_OPTICS_01_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-01",
  label: "时空储层重采样全局光照重连雅可比行列式解析场 (Spatiotemporal Reservoir Resampling (ReSTIR GI/PT) Shift Mapping Jacobian)",
  template: "Generate an SVG technical visualization of Spatiotemporal Reservoir Resampling (ReSTIR GI/PT) Shift Mapping Jacobian as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Context & Engineering Background: ReSTIR（时空储层重要性重采样）消除数百万光源噪波。跨非平坦几何表面重连次级散射点时，必须乘以微分面积形式雅可比行列式 $|J|$ 以及平衡启发式 MIS 权重，否则光能失真、几何边缘亮斑撕裂。 Physical & Mathematical Ground Truth: $$|J| = \\frac{\\cos\\theta_2'}{\\cos\\theta_2} \\cdot \\frac{\\|\\mathbf{x}_1 - \\mathbf{x}_2\\|^2}{\\|\\mathbf{x}_1' - \\mathbf{x}_2'\\|^2} \\approx 2.6247 \\pm 0.05$$ Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "B. Bitterli et al., ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392481; Y. Ouyang et al., EGSR 2021; D. Lin et al., SIGGRAPH 2022.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "时空储层重采样全局光照重连雅可比行列式解析场",
    groundTruth: "$$|J| = \\frac{\\cos\\theta_2'}{\\cos\\theta_2} \\cdot \\frac{\\|\\mathbf{x}_1 - \\mathbf{x}_2\\|^2}{\\|\\mathbf{x}_1' - \\mathbf{x}_2'\\|^2} \\approx 2.6247 \\pm 0.05$$",
    evaluationCriteria: "雅可比行列式绝对公差 $\\le 0.05$，立体角微分比值绝对误差 $< 1.5\\%$，重连路径光强无偏估计偏差 $< 1.0\\%$。",
    referenceSource: "B. Bitterli et al., ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392481; Y. Ouyang et al., EGSR 2021; D. Lin et al., SIGGRAPH 2022.",
  },
};

/**
 * VFX-OPTICS-02: 显式 3D 高斯泼溅协方差投影与球谐视向高阶辐射场
 */
export const VFX_OPTICS_02_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-02",
  label: "显式 3D 高斯泼溅协方差投影与球谐视向高阶辐射场 (3D Gaussian Splatting Covariance EWA Ellipse Projection and Spherical Harmonics)",
  template: "Generate an SVG technical visualization of 3D Gaussian Splatting Covariance EWA Ellipse Projection and Spherical Harmonics as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: $\\Sigma_{2D} = J W \\Sigma W^T J^T + 0.3 I_{2\\times 2}$，透视仿射雅可比 $J$ 矩阵计算，2D 投影中心 $(u, v) = (120.0, -80.0)\\text{ px}$，半轴 $a, b$ 与 $3\\sigma$ 边界，2 阶球谐高光辐射瓣 $Y_2^0$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "B. Kerbl et al., 3D Gaussian Splatting, ACM TOG (SIGGRAPH 2023), DOI: 10.1145/3592433; M. Zwicker et al., IEEE TVCG (2001).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "显式 3D 高斯泼溅协方差投影与球谐视向高阶辐射场",
    groundTruth: "$\\Sigma_{2D} = J W \\Sigma W^T J^T + 0.3 I_{2\\times 2}$，透视仿射雅可比 $J$ 矩阵计算，2D 投影中心 $(u, v) = (120.0, -80.0)\\text{ px}$，半轴 $a, b$ 与 $3\\sigma$ 边界，2 阶球谐高光辐射瓣 $Y_2^0$。",
    evaluationCriteria: "中心投影坐标绝对公差 $\\le 0.5\\text{ px}$，半轴长相对误差 $< 1.2\\%$，主轴倾斜角偏差 $< 0.8^\\circ$；球谐函数 0~3 阶瓣型对称度公差 $< 1.0\\%$。",
    referenceSource: "B. Kerbl et al., 3D Gaussian Splatting, ACM TOG (SIGGRAPH 2023), DOI: 10.1145/3592433; M. Zwicker et al., IEEE TVCG (2001).",
  },
};

/**
 * VFX-OPTICS-03: 4D 动态时空高斯场时空协方差连续切片与局部等距刚度正则化
 */
export const VFX_OPTICS_03_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-03",
  label: "4D 动态时空高斯场时空协方差连续切片与局部等距刚度正则化 (4D Spatiotemporal Gaussian Field Covariance Slicing and Local Isometric Rigidity)",
  template: "Generate an SVG technical visualization of 4D Spatiotemporal Gaussian Field Covariance Slicing and Local Isometric Rigidity as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 4D 联合协方差分块 $\\Sigma_{4D}$，Schur 补条件切片 $\\Sigma^*(t) = \\Sigma_{\\mathbf{x}\\mathbf{x}} - \\Sigma_{\\mathbf{x}t}\\Sigma_{tt}^{-1}\\Sigma_{t\\mathbf{x}}$，ARAP 局部等距刚度损失 $\\mathcal{L}_{\\text{iso}} \\le 0.02$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "G. Wu et al., 4D Gaussian Splatting, CVPR 2024; Z. Yang et al., Deformable 3DGS, CVPR 2024; S. Sajjadi et al., Spacetime Gaussians, ACM SIGGRAPH 2024.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "4D 动态时空高斯场时空协方差连续切片与局部等距刚度正则化",
    groundTruth: "4D 联合协方差分块 $\\Sigma_{4D}$，Schur 补条件切片 $\\Sigma^*(t) = \\Sigma_{\\mathbf{x}\\mathbf{x}} - \\Sigma_{\\mathbf{x}t}\\Sigma_{tt}^{-1}\\Sigma_{t\\mathbf{x}}$，ARAP 局部等距刚度损失 $\\mathcal{L}_{\\text{iso}} \\le 0.02$。",
    evaluationCriteria: "关键帧时刻粒子间距形变误差率 $< 1.8\\%$，切片协方差拟合优度 $R^2 \\ge 0.985$，局部旋转等距能量损耗 $< 0.5\\%$。",
    referenceSource: "G. Wu et al., 4D Gaussian Splatting, CVPR 2024; Z. Yang et al., Deformable 3DGS, CVPR 2024; S. Sajjadi et al., Spacetime Gaussians, ACM SIGGRAPH 2024.",
  },
};

/**
 * VFX-OPTICS-04: 纳米级多层薄膜波动光学干涉与艾里干涉条纹全光谱反射剖面
 */
export const VFX_OPTICS_04_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-04",
  label: "纳米级多层薄膜波动光学干涉与艾里干涉条纹全光谱反射剖面 (Nanoscale Multilayer Thin-Film Wave Optics Interference and Airy Spectral Reflectance Profile)",
  template: "Generate an SVG technical visualization of Nanoscale Multilayer Thin-Film Wave Optics Interference and Airy Spectral Reflectance Profile as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 光程差 $\\Delta = 2 n_2 d \\cos\\theta_2$，艾里级数求和反射率 $R(\\lambda)$，硬/软反射界面净相移 $\\pi$，$d < 25\\text{ nm}$ 处完全相消牛顿黑斑（Newton's Black Film）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "L. Belcour, P. Barla, A Practical Extension to Microfacet Theory, ACM TOG (SIGGRAPH 2017), DOI: 10.1145/3072959.3073620; Born & Wolf, Principles of Optics.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "纳米级多层薄膜波动光学干涉与艾里干涉条纹全光谱反射剖面",
    groundTruth: "光程差 $\\Delta = 2 n_2 d \\cos\\theta_2$，艾里级数求和反射率 $R(\\lambda)$，硬/软反射界面净相移 $\\pi$，$d < 25\\text{ nm}$ 处完全相消牛顿黑斑（Newton's Black Film）。",
    evaluationCriteria: "黑斑厚度阈值在 $d \\le 30\\text{ nm}$ 内，各色级极值波长峰位偏差 $< 1.5\\%$，色差 $\\Delta E_{00} \\le 1.8$。",
    referenceSource: "L. Belcour, P. Barla, A Practical Extension to Microfacet Theory, ACM TOG (SIGGRAPH 2017), DOI: 10.1145/3072959.3073620; Born & Wolf, Principles of Optics.",
  },
};

/**
 * VFX-OPTICS-05: 各向异性微结构衍射光栅全光谱色散与 CIE 1931 色品图投影
 */
export const VFX_OPTICS_05_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-05",
  label: "各向异性微结构衍射光栅全光谱色散与 CIE 1931 色品图投影 (Anisotropic Micro-Grating Diffraction and Full-Spectrum CIE 1931 Chromaticity Dispersion)",
  template: "Generate an SVG technical visualization of Anisotropic Micro-Grating Diffraction and Full-Spectrum CIE 1931 Chromaticity Dispersion as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 光栅方程 $d(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$，$d=1400\\text{ nm}, \\theta_i=15^\\circ$。一阶衍射色散角：紫光(405nm) $33.23^\\circ$、绿光(532nm) $39.70^\\circ$、橙黄(589nm) $42.80^\\circ$、红光(680nm) $48.12^\\circ$；CIE 1931 谱色轨迹外轮廓匹配。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "J. Stam, Diffraction Shaders, ACM SIGGRAPH 1999, DOI: 10.1145/311535.311545; S. Werner et al., Scratch Iridescence, ACM TOG 2017; CIE 15:2004.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "各向异性微结构衍射光栅全光谱色散与 CIE 1931 色品图投影",
    groundTruth: "光栅方程 $d(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$，$d=1400\\text{ nm}, \\theta_i=15^\\circ$。一阶衍射色散角：紫光(405nm) $33.23^\\circ$、绿光(532nm) $39.70^\\circ$、橙黄(589nm) $42.80^\\circ$、红光(680nm) $48.12^\\circ$；CIE 1931 谱色轨迹外轮廓匹配。",
    evaluationCriteria: "出射折射角度绝对误差 $< 0.15^\\circ$，CIE 1931 色度坐标 $(x, y)$ 误差 $\\le 0.005$。",
    referenceSource: "J. Stam, Diffraction Shaders, ACM SIGGRAPH 1999, DOI: 10.1145/311535.311545; S. Werner et al., Scratch Iridescence, ACM TOG 2017; CIE 15:2004.",
  },
};

/**
 * VFX-OPTICS-06: 双偶极子微表面次表面散射 (BSSRDF) 空间扩散剖面与透光衰减
 */
export const VFX_OPTICS_06_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-06",
  label: "双偶极子微表面次表面散射 (BSSRDF) 空间扩散剖面与透光衰减 (Directional Dipole Subsurface Scattering (BSSRDF) Spatial Diffusion Profile and Translucency)",
  template: "Generate an SVG technical visualization of Directional Dipole Subsurface Scattering (BSSRDF) Spatial Diffusion Profile and Translucency as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 输运消光系数 $\\sigma'_{tr} = \\sqrt{3\\sigma_a\\sigma'_t}$，正实源深度 $z_r = 1/\\sigma'_t$，负虚源深度 $z_v = z_r + 4AD$，解析漫反射剖面 $R_d(r)$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "H. W. Jensen et al., A Practical Model for Subsurface Light Transport, ACM SIGGRAPH 2001; J. R. Frisvad et al., Directional Dipole, ACM TOG 2014; P. Christensen (Pixar 2015).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "双偶极子微表面次表面散射 (BSSRDF) 空间扩散剖面与透光衰减",
    groundTruth: "输运消光系数 $\\sigma'_{tr} = \\sqrt{3\\sigma_a\\sigma'_t}$，正实源深度 $z_r = 1/\\sigma'_t$，负虚源深度 $z_v = z_r + 4AD$，解析漫反射剖面 $R_d(r)$。",
    evaluationCriteria: "半高宽 FWHM 匹配误差 $< 1.0\\%$，渐近衰减斜率误差 $< 0.8\\%$，次表面透射能量守恒残差 $\\le 0.5\\%$。",
    referenceSource: "H. W. Jensen et al., A Practical Model for Subsurface Light Transport, ACM SIGGRAPH 2001; J. R. Frisvad et al., Directional Dipole, ACM TOG 2014; P. Christensen (Pixar 2015).",
  },
};

/**
 * VFX-OPTICS-07: 广义相对论克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化场
 */
export const VFX_OPTICS_07_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-07",
  label: "广义相对论克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化场 (Kerr Metric Black Hole Geodesic Lensing, Photon Sphere Shadow and Relativistic Doppler Beaming)",
  template: "Generate an SVG technical visualization of Kerr Metric Black Hole Geodesic Lensing, Photon Sphere Shadow and Relativistic Doppler Beaming as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 自旋 $a=0.94M$。顺行光子轨道 $1.543M$，逆行 $3.826M$；Bardeen 1973 冲击参数“D”形阴影；多普勒集束通量 $I_{\\text{obs}} = g^4 I_{\\text{em}}$，迎侧蓝移增亮 11.7 倍，背侧消光暗化至 0.09 倍；开普勒角速度 $\\Omega_K$ 旋转。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "O. James et al., Gravitational lensing by spinning black holes in astrophysics and Interstellar, Class. Quantum Grav. 32 (2015); J. M. Bardeen (1973).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "广义相对论克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化场",
    groundTruth: "自旋 $a=0.94M$。顺行光子轨道 $1.543M$，逆行 $3.826M$；Bardeen 1973 冲击参数“D”形阴影；多普勒集束通量 $I_{\\text{obs}} = g^4 I_{\\text{em}}$，迎侧蓝移增亮 11.7 倍，背侧消光暗化至 0.09 倍；开普勒角速度 $\\Omega_K$ 旋转。",
    evaluationCriteria: "黑洞阴影边界吻合度 $\\ge 98.5\\%$，左右盘面辐射亮度比在 $12.0 \\sim 15.0$ 之间，光子环半径绝对公差 $< 0.02 R_g$。",
    referenceSource: "O. James et al., Gravitational lensing by spinning black holes in astrophysics and Interstellar, Class. Quantum Grav. 32 (2015); J. M. Bardeen (1973).",
  },
};

/**
 * VFX-OPTICS-08: 狭义相对论 $0.95c$ 超高速巡航全天球相对论光行差与特勒尔几何旋转
 */
export const VFX_OPTICS_08_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-08",
  label: "狭义相对论 $0.95c$ 超高速巡航全天球相对论光行差与特勒尔几何旋转 (Special Relativistic 0.95c Aberration Headlight Effect and Terrell-Penrose Rotation)",
  template: "Generate an SVG technical visualization of Special Relativistic 0.95c Aberration Headlight Effect and Terrell-Penrose Rotation as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: $\\beta=0.95, \\gamma=3.2026$。半角正切公式 $\\tan(\\theta_{\\text{obs}}/2) = 0.1601 \\tan(\\theta_{\\text{src}}/2)$，正侧方 $90^\\circ$ 压缩至 $18.20^\\circ$；特勒尔视在旋转角 $\\theta_{\\text{rot}} = \\arcsin(0.95) \\approx 71.80^\\circ$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "R. Penrose, Proc. Cambridge Phil. Soc. 55 (1959); J. Terrell, Phys. Rev. 116 (1959); D. Weiskopf et al., IEEE TVCG 12(5), 2006.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "狭义相对论 $0.95c$ 超高速巡航全天球相对论光行差与特勒尔几何旋转",
    groundTruth: "$\\beta=0.95, \\gamma=3.2026$。半角正切公式 $\\tan(\\theta_{\\text{obs}}/2) = 0.1601 \\tan(\\theta_{\\text{src}}/2)$，正侧方 $90^\\circ$ 压缩至 $18.20^\\circ$；特勒尔视在旋转角 $\\theta_{\\text{rot}} = \\arcsin(0.95) \\approx 71.80^\\circ$。",
    evaluationCriteria: "$90^\\circ$ 压缩半角严格处于 $18.2^\\circ \\pm 0.3^\\circ$，视在旋转角误差 $< 1.0^\\circ$，头灯效应蓝移通量积分比吻合度 $> 99\\%$。",
    referenceSource: "R. Penrose, Proc. Cambridge Phil. Soc. 55 (1959); J. Terrell, Phys. Rev. 116 (1959); D. Weiskopf et al., IEEE TVCG 12(5), 2006.",
  },
};

/**
 * VFX-OPTICS-09: 双折射单轴晶体寻常光与非常光偏振分解与沃拉斯顿棱镜光路
 */
export const VFX_OPTICS_09_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-09",
  label: "双折射单轴晶体寻常光与非常光偏振分解与沃拉斯顿棱镜光路 (Birefringent Uniaxial Crystal Ordinary/Extraordinary Ray Splitting and Wollaston Prism)",
  template: "Generate an SVG technical visualization of Birefringent Uniaxial Crystal Ordinary/Extraordinary Ray Splitting and Wollaston Prism as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 方解石晶体 $n_o=1.6584, n_e=1.4864$；沃拉斯顿双直角楔形棱镜（楔角 $30^\\circ$），界面身份互换折射，两束出射光正交线偏振总分离角 $\\epsilon = 11.38^\\circ \\pm 0.05^\\circ$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "A. Weidlich, A. Wilkie, Realistic Rendering of Birefringency in Uniaxial Crystals, ACM TOG (EGSR 2008); W. H. Wollaston, Phil. Trans. R. Soc. Lon. (1802).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "双折射单轴晶体寻常光与非常光偏振分解与沃拉斯顿棱镜光路",
    groundTruth: "方解石晶体 $n_o=1.6584, n_e=1.4864$；沃拉斯顿双直角楔形棱镜（楔角 $30^\\circ$），界面身份互换折射，两束出射光正交线偏振总分离角 $\\epsilon = 11.38^\\circ \\pm 0.05^\\circ$。",
    evaluationCriteria: "寻常光与非常光总分离张角误差 $< 0.1^\\circ$，折射率比值计算误差 $< 0.2\\%$，正交偏振矢量方向误差 $0^\\circ$。",
    referenceSource: "A. Weidlich, A. Wilkie, Realistic Rendering of Birefringency in Uniaxial Crystals, ACM TOG (EGSR 2008); W. H. Wollaston, Phil. Trans. R. Soc. Lon. (1802).",
  },
};

/**
 * VFX-OPTICS-10: 高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点
 */
export const VFX_OPTICS_10_PROMPT: PromptSpec = {
  id: "VFX-OPTICS-10",
  label: "高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点 (Higher-Order Caustic Bifurcation, Hyperbolic Umbilic ($D_4^+$) Wavefront Singularity)",
  template: "Generate an SVG technical visualization of Higher-Order Caustic Bifurcation, Hyperbolic Umbilic ($D_4^+$) Wavefront Singularity as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 开折势 $V(x, y; \\xi, \\eta, \\zeta) = x^3 + y^3 + \\zeta xy - \\xi x - \\eta y$，Hessian 行列式奇异条件 $36xy - \\zeta^2 = 0$，分叉集呈现经典三尖点翼状包络面（Winged Cusp-Fold Network）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "M. V. Berry, C. Upstill, Catastrophe Optics, Prog. Opt. 18 (1980); T. Zeltner et al., Specular Manifold Sampling, ACM TOG (SIGGRAPH 2020).",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点",
    groundTruth: "开折势 $V(x, y; \\xi, \\eta, \\zeta) = x^3 + y^3 + \\zeta xy - \\xi x - \\eta y$，Hessian 行列式奇异条件 $36xy - \\zeta^2 = 0$，分叉集呈现经典三尖点翼状包络面（Winged Cusp-Fold Network）。",
    evaluationCriteria: "三尖点对称轴夹角误差 $< 0.5^\\circ$，尖点奇点辐照度峰值标度律误差 $< 2.0\\%$，焦散折叠双曲线曲率匹配度 $> 98\\%$。",
    referenceSource: "M. V. Berry, C. Upstill, Catastrophe Optics, Prog. Opt. 18 (1980); T. Zeltner et al., Specular Manifold Sampling, ACM TOG (SIGGRAPH 2020).",
  },
};

export const VFX_OPTICS_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  VFX_OPTICS_01_PROMPT,
  VFX_OPTICS_02_PROMPT,
  VFX_OPTICS_03_PROMPT,
  VFX_OPTICS_04_PROMPT,
  VFX_OPTICS_05_PROMPT,
  VFX_OPTICS_06_PROMPT,
  VFX_OPTICS_07_PROMPT,
  VFX_OPTICS_08_PROMPT,
  VFX_OPTICS_09_PROMPT,
  VFX_OPTICS_10_PROMPT,
];

/**
 * VFX-2: 波动光学传播、全光谱渲染与显式辐射场 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const VFX_OPTICS_SUITE_PROMPT: PromptSpec = {
  id: "vfx-optics-v1",
  label: "VFX-2: 波动光学与显式辐射场（十题组）",
  template: "VFX-2: 波动光学传播、全光谱渲染与显式辐射场 前沿视觉特效十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: VFX_OPTICS_01_PROMPT.id,
      label: "时空储层重采样全局光照重连雅可比行列式解析场",
      text: VFX_OPTICS_01_PROMPT.template,
      standard: VFX_OPTICS_01_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_02_PROMPT.id,
      label: "显式 3D 高斯泼溅协方差投影与球谐视向高阶辐射场",
      text: VFX_OPTICS_02_PROMPT.template,
      standard: VFX_OPTICS_02_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_03_PROMPT.id,
      label: "4D 动态时空高斯场时空协方差连续切片与局部等距刚度正则化",
      text: VFX_OPTICS_03_PROMPT.template,
      standard: VFX_OPTICS_03_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_04_PROMPT.id,
      label: "纳米级多层薄膜波动光学干涉与艾里干涉条纹全光谱反射剖面",
      text: VFX_OPTICS_04_PROMPT.template,
      standard: VFX_OPTICS_04_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_05_PROMPT.id,
      label: "各向异性微结构衍射光栅全光谱色散与 CIE 1931 色品图投影",
      text: VFX_OPTICS_05_PROMPT.template,
      standard: VFX_OPTICS_05_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_06_PROMPT.id,
      label: "双偶极子微表面次表面散射 (BSSRDF) 空间扩散剖面与透光衰减",
      text: VFX_OPTICS_06_PROMPT.template,
      standard: VFX_OPTICS_06_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_07_PROMPT.id,
      label: "广义相对论克尔度规旋转黑洞测地线透镜畸变与多普勒集束 $g^4$ 极化场",
      text: VFX_OPTICS_07_PROMPT.template,
      standard: VFX_OPTICS_07_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_08_PROMPT.id,
      label: "狭义相对论 $0.95c$ 超高速巡航全天球相对论光行差与特勒尔几何旋转",
      text: VFX_OPTICS_08_PROMPT.template,
      standard: VFX_OPTICS_08_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_09_PROMPT.id,
      label: "双折射单轴晶体寻常光与非常光偏振分解与沃拉斯顿棱镜光路",
      text: VFX_OPTICS_09_PROMPT.template,
      standard: VFX_OPTICS_09_PROMPT.standard,
    },
    {
      id: VFX_OPTICS_10_PROMPT.id,
      label: "高阶焦散波前法线曲率映射双曲脐点与焦散线包络奇点",
      text: VFX_OPTICS_10_PROMPT.template,
      standard: VFX_OPTICS_10_PROMPT.standard,
    },
  ],
  source: "B. Bitterli et al., ACM TOG (SIGGRAPH 2020), DOI: 10.1145/3386569.3392481; Y. Ouyang et al., EGSR 2021; D. Lin et al., SIGGRAPH 2022.",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "显式 3D 高斯泼溅（3DGS）、相对论黑洞克尔度规测地线与波动结构色",
    groundTruth: "以 3DGS 协方差椭球体 EWA 滤波投影、广义相对论克尔黑洞光子球偏折与多普勒辐射集束、薄膜波动光学艾里斑干涉与 ReSTIR GI 时空重采样为基准，满足广义相对论测地线方程与菲涅尔衍射理论。",
    evaluationCriteria: "1. 光学真实度：黑洞双重光晕非对称蓝红移与薄膜彩虹干涉色度精确；2. 几何投影：椭球外接椭圆与重采样权重无偏；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://siggraph.org",
  },
};

export const VFX_OPTICS_PROMPTS = VFX_OPTICS_INDIVIDUAL_PROMPTS;
