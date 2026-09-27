/**
 * VFX-6: 实时虚拟制片、深度合成与异构并行图形系统 前沿评测题库。
 * 包含 10 道独立题目规格，以及 1 套领域分组聚合套题（UX 交互与轮换结构对齐四大名著 candidates 规范）。
 */

import type { PromptSpec } from "../prompt";

/**
 * VFX-SYS-01: 现场虚拟制片(ICVFX) 摄像机离轴斜透视投影与曲面LED墙柱面畸变预补偿
 */
export const VFX_SYS_01_PROMPT: PromptSpec = {
  id: "VFX-SYS-01",
  label: "现场虚拟制片(ICVFX) 摄像机离轴斜透视投影与曲面LED墙柱面畸变预补偿 (In-Camera VFX Off-Axis Asymmetric Frustum Projection & Curved LED Cylindrical Pre-Warping)",
  template: "Generate an SVG technical visualization of In-Camera VFX Off-Axis Asymmetric Frustum Projection & Curved LED Cylindrical Pre-Warping using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Robert Kooima 广义透视投影方程**： 设摄影机光心在虚拟世界坐标为 $P_e = (x_e, y_e, z_e)$，LED 平面屏（或切平面分段）的三顶点为左下角 $P_a$、右下角 $P_b$、左上角 $P_c$。 构造屏幕正交基底： $$u = \\frac{P_b - P_a}{\\|P_b - P_a\\|}, \\quad v = \\frac{P_c - P_a}{\\|P_c - P_a\\|}, \\quad n = \\frac{u \\times v}{\\|u \\times v\\|}$$ 计算近裁剪面截断边界（距离 $d = -((P_a - P_e) \\cdot n)$，近裁距 $n_{near}$）： $$l = \\frac{n_{near}}{d} (u \\cdot (P_a - P_e)), \\quad r = \\frac{n_{near}}{d} (u \\cdot (P_b - P_e))$$ $$b = \\frac{n_{near}}{d} (v \\cdot (P_a - P_e)), \\quad t = \\frac{n_{near}}{d} (v \\cdot (P_c - P_e))$$ 最终离轴平截头体投影矩阵为： $$M_{off-axis} = \\begin{bmatrix} \\frac{2 n_{near}}{r - l} & 0 & \\frac{r + l}{r - l} & 0 \\\\ 0 & \\frac{2 n_{near}}{t - b} & \\frac{t + b}{t - b} & 0 \\\\ 0 & 0 & -\\frac{f + n_{near}}{f - n_{near}} & -\\frac{2 f n_{near}}{f - n_{near}} \\\\ 0 & 0 & -1 & 0 \\end{bmatrix} \\begin{bmatrix} u_x & u_y & u_z & -u \\cdot P_e \\\\ v_x & v_y & v_z & -v \\cdot P_e \\\\ n_x & n_y & n_z & -n \\cdot P_e \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}$$ 2. **柱面极坐标预反畸变方程**： 对半径为 $R$、中心在 $(X_c, Z_c)$ 的柱面 LED，任意空间投射光线在极角方向的角坐标为 $\\theta = \\arctan\\left(\\frac{X - X_c}{Z - Z_c}\\right)$，高度为 $Y$。将其无失真展开为平面 UV 纹理坐标： $$U = \\frac{\\theta - \\theta_{start}}{\\Delta\\theta}, \\quad V = \\frac{Y - Y_{bottom}}{\\Delta Y}$$ 3. **公差与精度指标**： 在摄影机视线偏移角达到 $\\pm 45^\\circ$ 时，合成图像的前后景几何边缘贴合残差 $\\le 0.5\\text{ px}$，动态跟踪延迟补偿抖动 $\\le 1.0\\text{ ms}$。 Visual Inspection Criteria: - **肉眼直观判断**：左屏相机沿弧形滑轨由左向右推移，绿色视锥斜角动态倾斜，LED 墙上的 Inner Frustum 窗口实时形变；右屏摄像机镜头内，红色前景标志立柱与虚拟背景中的延伸廊柱边缘在动画全程始终保持严格平行共线，无任何“漂浮”、“果冻”或断裂滑动。 - **机器自动化比对**：提取 SVG 中连接相机的投射光线线段端点，验证任意时刻 $t$ 其与 LED 弧形相交点的切线斜率严格满足 Kooima 投影与极角 $\\theta$ 的一阶导数连续性（$C^1$ 连续），重投影重合残差 RMSE $\\le 10^{-4}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Robert Kooima (2009), *\"Generalized Perspective Projection\"*, Journal of Graphics Tools. - SMPTE RIS-OSVP (2024), *\"OpenTrackIO: Camera Tracking and Lens Metadata Standard\"*. - VES Handbook of Virtu",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "现场虚拟制片(ICVFX) 摄像机离轴斜透视投影与曲面LED墙柱面畸变预补偿",
    groundTruth: "1. **Robert Kooima 广义透视投影方程**： 设摄影机光心在虚拟世界坐标为 $P_e = (x_e, y_e, z_e)$，LED 平面屏（或切平面分段）的三顶点为左下角 $P_a$、右下角 $P_b$、左上角 $P_c$。 构造屏幕正交基底： $$u = \\frac{P_b - P_a}{\\|P_b - P_a\\|}, \\quad v = \\frac{P_c - P_a}{\\|P_c - P_a\\|}, \\quad n = \\frac{u \\times v}{\\|u \\times v\\|}$$ 计算近裁剪面截断边界（距离 $d = -((P_a - P_e) \\cdot n)",
    evaluationCriteria: "- **肉眼直观判断**：左屏相机沿弧形滑轨由左向右推移，绿色视锥斜角动态倾斜，LED 墙上的 Inner Frustum 窗口实时形变；右屏摄像机镜头内，红色前景标志立柱与虚拟背景中的延伸廊柱边缘在动画全程始终保持严格平行共线，无任何“漂浮”、“果冻”或断裂滑动。 - **机器自动化比对**：提取 SVG 中连接相机的投射光线线段端点，验证任意时刻 $t$ 其与 LED 弧形相交点的切线斜率严格满足 Kooima 投影与极角 $\\theta$ 的一阶导数连续性（$C^1$ 连续），重投影重合残差 RMSE $\\le 10^{-4}$。",
    referenceSource: "- Robert Kooima (2009), *\"Generalized Perspective Projection\"*, Journal of Graphics Tools. - SMPTE RIS-OSVP (2024), *\"OpenTrackIO: Camera Tracking and Lens Metadata Standard\"*. - VES Handbook of Virtu",
  },
};

/**
 * VFX-SYS-02: 摄影机卷帘快门(Rolling Shutter)与LED扫描刷新Genlock相位偏移莫尔条纹空频滤波
 */
export const VFX_SYS_02_PROMPT: PromptSpec = {
  id: "VFX-SYS-02",
  label: "摄影机卷帘快门(Rolling Shutter)与LED扫描刷新Genlock相位偏移莫尔条纹空频滤波 (Rolling Shutter Sensor Readout & LED PWM Scanline Genlock Phase-Offset Moiré Spatial Frequency Filtering)",
  template: "Generate an SVG technical visualization of Rolling Shutter Sensor Readout & LED PWM Scanline Genlock Phase-Offset Moiré Spatial Frequency Filtering using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **卷帘快门曝光线时序积分与相位偏移（Phase Offset）**： 设第 $y$ 行像素在时刻 $t(y) = t_0 + y \\cdot \\tau_{line}$ 开始曝光，曝光时间为 $T_{exp} = \\frac{\\theta_{shutter}}{360^\\circ \\cdot FPS}$。 LED 行扫描亮度脉冲函数为周期为 $T_{pwm}$ 的脉冲列 $P(t) = \\sum_{k} \\text{rect}\\left(\\frac{t - k T_{pwm}}{\\delta}\\right)$。 各行有效曝光积分量为： $$I(y) = \\int_{t(y)}^{t(y) + T_{exp}} P(t) dt$$ 无黑斑的充要条件为：Genlock 锁相相位偏移 $\\Delta t_{phase}$ 使得对所有有效成像行 $y$，积分 $I(y)$ 波动方差 $\\frac{\\text{Var}(I)}{\\bar{I}^2} \\le 10^{-4}$。PTP 锁相容差 $\\le \\pm 0.5\\,\\mu\\text{s}$。 2. **莫尔干涉空间频率与 OLPF 截止方程**： 设传感器像元尺寸为 $p_{sensor}$（奈奎斯特极限 $f_N = \\frac{1}{2 p_{sensor}}$），LED 物理间距为 $p_{led}$，镜头光学放大倍率为 $M = \\frac{f}{D}$。 像面上的 LED 基频为 $f_{led} = \\frac{1}{M \\cdot p_{led}}$。莫尔拍频空间频率为： $$f_{moire} = |f_{sensor} - f_{led}| = \\left|\\frac{1}{p_{sensor}} - \\frac{1}{M \\cdot p_{led}}\\right|$$ 双折射晶体 OLPF 传递函数为 $H_{olpf}(f) = \\cos(\\pi d f)$，调谐晶体厚度 $d$ 使得 $H_{olpf}(f_N) = 0$，将 $f \\ge f_N$ 的高频能量衰减 $\\ge 26\\text{ dB}$。 Visual Inspection Criteria: - **肉眼直观判断**：当 Phase Offset 滑块在动画中进入“Lock Sync（绿标区间）”时，时序图中的重叠积分曲线瞬间拉平为纯直线，画面模拟窗口中的水平黑色滚带彻底消失；空间频谱图中，红色莫尔高频尖峰被虚线 OLPF 滤镜包络完全消除，成像面显示纯净无彩虹条纹的均匀灰阶。 - **机器自动化比对**：检验时序积分方程数值，非同步相位的明暗脉动幅度达到 $\\ge 35\\%$，而在锁定相位点残差标准差 $\\sigma \\le 0.001$；高频能量积分比 $E(f > f_N) / E_{total} \\le 0.01$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- SMPTE ST 2059-2:2021, *\"Precision Time Protocol (PTP) Profile for Audio/Video Media\"*. - Brompton Technology (2023), *\"Tessera ShutterSync® Technical Whitepaper on Frame Phase Offset\"*. - ISO 12233:",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "摄影机卷帘快门(Rolling Shutter)与LED扫描刷新Genlock相位偏移莫尔条纹空频滤波",
    groundTruth: "1. **卷帘快门曝光线时序积分与相位偏移（Phase Offset）**： 设第 $y$ 行像素在时刻 $t(y) = t_0 + y \\cdot \\tau_{line}$ 开始曝光，曝光时间为 $T_{exp} = \\frac{\\theta_{shutter}}{360^\\circ \\cdot FPS}$。 LED 行扫描亮度脉冲函数为周期为 $T_{pwm}$ 的脉冲列 $P(t) = \\sum_{k} \\text{rect}\\left(\\frac{t - k T_{pwm}}{\\delta}\\right)$。 各行有效曝光积分量为： $$I(y) = \\int_{t(y)}^{t(y)",
    evaluationCriteria: "- **肉眼直观判断**：当 Phase Offset 滑块在动画中进入“Lock Sync（绿标区间）”时，时序图中的重叠积分曲线瞬间拉平为纯直线，画面模拟窗口中的水平黑色滚带彻底消失；空间频谱图中，红色莫尔高频尖峰被虚线 OLPF 滤镜包络完全消除，成像面显示纯净无彩虹条纹的均匀灰阶。 - **机器自动化比对**：检验时序积分方程数值，非同步相位的明暗脉动幅度达到 $\\ge 35\\%$，而在锁定相位点残差标准差 $\\sigma \\le 0.001$；高频能量积分比 $E(f > f_N) / E_{total} \\le 0.01$。",
    referenceSource: "- SMPTE ST 2059-2:2021, *\"Precision Time Protocol (PTP) Profile for Audio/Video Media\"*. - Brompton Technology (2023), *\"Tessera ShutterSync® Technical Whitepaper on Frame Phase Offset\"*. - ISO 12233:",
  },
};

/**
 * VFX-SYS-03: 全谱系深度合成(Deep Compositing)沿光线非均匀亚像素体积不透明度与透过率积分重建
 */
export const VFX_SYS_03_PROMPT: PromptSpec = {
  id: "VFX-SYS-03",
  label: "全谱系深度合成(Deep Compositing)沿光线非均匀亚像素体积不透明度与透过率积分重建 (OpenEXR Deep Compositing Along-Ray Volumetric Opacity Reconstruction & Transmittance Integration)",
  template: "Generate an SVG technical visualization of OpenEXR Deep Compositing Along-Ray Volumetric Opacity Reconstruction & Transmittance Integration as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **体积样本 Beer-Lambert 连续消光模型**： 对于沿视线深度区间 $[Z_0, Z_1]$ 的均匀吸收体积样本，其消光系数为 $\\tau$。任意深度 $z \\in [Z_0, Z_1]$ 处的透过率为： $$T(z) = \\exp(-\\tau (z - Z_0))$$ 总不透明度为 $\\alpha = 1 - T(Z_1) = 1 - \\exp(-\\tau (Z_1 - Z_0))$。 2. **深度样本精确切分（Sample Splitting）方程**： 若在深度 $Z_{split} \\in (Z_0, Z_1)$ 处插入硬表面，样本被切分为前后两段，几何相对比率 $t = \\frac{Z_{split} - Z_0}{Z_1 - Z_0} \\in (0, 1)$。 前段样本 $[Z_0, Z_{split}]$ 的不透明度为： $$\\alpha_a = 1 - (1 - \\alpha)^t$$ 后段样本 $[Z_{split}, Z_1]$ 的不透明度为： $$\\alpha_b = 1 - (1 - \\alpha)^{1 - t}$$ 重组守恒等式必须满足： $$\\alpha_{total} = \\alpha_a + (1 - \\alpha_a) \\alpha_b = 1 - (1 - \\alpha)^t (1 - \\alpha)^{1 - t} \\equiv \\alpha$$ 3. **离散深度 Over 累积算子**： 对按深度升序排序的 $N$ 个非重叠样本，第 $i$ 个样本贡献的前向累积透过率 $T_i = \\prod_{j=1}^{i-1} (1 - \\alpha_j)$。 最终合并色彩 $C$ 与不透明度 $A$ 为： $$C = \\sum_{i=1}^N C_i \\alpha_i T_i, \\quad A = 1 - \\prod_{i=1}^N (1 - \\alpha_i)$$ 公差容差：样本切分重组数值误差 $|\\alpha_{total} - \\alpha| \\le 10^{-7}$。 Visual Inspection Criteria: - **肉眼直观判断**：图面中清楚标出光线进入体积的 $Z_0$ 与穿出深度 $ZBack$。切分点 $Z_{split}$ 处的透过率曲线连续平滑，无任何阶跃突变；分步阶梯面积与累积色彩层叠条块呈现清晰单调递减的指数衰减，硬表面穿插样本两侧的体积色块与实心色块界限分明。 - **机器自动化比对**：检验 SVG 路径中曲线采样点的纵坐标，验证其高度精确等于 $y = y_0 \\cdot (1 - \\alpha)^t$；检测前后两段子样本颜色加权乘积积分值，与原未切分连续积分的绝对误差 $\\Delta E \\le 10^{-6}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Peter Hillman (2013), *\"The Theory of OpenEXR Deep Samples\"*, Weta Digital Technical Document (Official OpenEXR Documentation). - Florian Kainz (2013), *\"Interpreting OpenEXR Deep Pixels\"*, Industri",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "全谱系深度合成(Deep Compositing)沿光线非均匀亚像素体积不透明度与透过率积分重建",
    groundTruth: "1. **体积样本 Beer-Lambert 连续消光模型**： 对于沿视线深度区间 $[Z_0, Z_1]$ 的均匀吸收体积样本，其消光系数为 $\\tau$。任意深度 $z \\in [Z_0, Z_1]$ 处的透过率为： $$T(z) = \\exp(-\\tau (z - Z_0))$$ 总不透明度为 $\\alpha = 1 - T(Z_1) = 1 - \\exp(-\\tau (Z_1 - Z_0))$。 2. **深度样本精确切分（Sample Splitting）方程**： 若在深度 $Z_{split} \\in (Z_0, Z_1)$ 处插入硬表面，样本被切分为前后两段，几何相对比率 $",
    evaluationCriteria: "- **肉眼直观判断**：图面中清楚标出光线进入体积的 $Z_0$ 与穿出深度 $ZBack$。切分点 $Z_{split}$ 处的透过率曲线连续平滑，无任何阶跃突变；分步阶梯面积与累积色彩层叠条块呈现清晰单调递减的指数衰减，硬表面穿插样本两侧的体积色块与实心色块界限分明。 - **机器自动化比对**：检验 SVG 路径中曲线采样点的纵坐标，验证其高度精确等于 $y = y_0 \\cdot (1 - \\alpha)^t$；检测前后两段子样本颜色加权乘积积分值，与原未切分连续积分的绝对误差 $\\Delta E \\le 10^{-6}$。",
    referenceSource: "- Peter Hillman (2013), *\"The Theory of OpenEXR Deep Samples\"*, Weta Digital Technical Document (Official OpenEXR Documentation). - Florian Kainz (2013), *\"Interpreting OpenEXR Deep Pixels\"*, Industri",
  },
};

/**
 * VFX-SYS-04: 学院色彩编码规范 ACES 2.0 CAM16 全谱色貌模型高光平滑退饱和与色域边界压缩
 */
export const VFX_SYS_04_PROMPT: PromptSpec = {
  id: "VFX-SYS-04",
  label: "学院色彩编码规范 ACES 2.0 CAM16 全谱色貌模型高光平滑退饱和与色域边界压缩 (ACES 2.0 Output Transform: CAM16-Hellwig Perceptual JMh Gamut Mapping & Highlight Desaturation)",
  template: "Generate an SVG technical visualization of ACES 2.0 Output Transform: CAM16-Hellwig Perceptual JMh Gamut Mapping & Highlight Desaturation using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **色彩空间转换矩阵（ACEScg AP1 至 ACES2065-1 AP0）**： $$M_{AP1 \\to AP0} = \\begin{bmatrix} 0.695452241357 & 0.140678696470 & 0.163869062172 \\\\ 0.044794563372 & 0.859671118456 & 0.095534318172 \\\\ -0.005525882558 & 0.004025219565 & 1.001500473950 \\end{bmatrix}$$ 2. **CAT16 适应矩阵（$M_{16}$）**： $$\\begin{bmatrix} R_{16} \\\\ G_{16} \\\\ B_{16} \\end{bmatrix} = \\begin{bmatrix} 0.401288 & 0.650173 & -0.051461 \\\\ -0.250268 & 1.204414 & 0.045854 \\\\ -0.002079 & 0.048952 & 0.953127 \\end{bmatrix} \\begin{bmatrix} X \\\\ Y \\\\ Z \\end{bmatrix}$$ 3. **Hellwig 2022 Cusp 几何色域压缩方程**： 在极坐标截面 $(J, M, h)$ 中，显示色域在色相 $h$ 处的边界彩度尖端为 $(J_{cusp}(h), M_{cusp}(h))$。 对于输入点 $(J_{in}, M_{in})$，若其超出色域边界，沿保持恒定明度 $J$ 与恒定色相 $h$ 的射线进行单调双曲正切压缩： $$M_{out} = M_{cusp} \\cdot \\left( \\frac{M_{in}}{M_{cusp}} \\right) \\Big/ \\left( 1 + \\left(\\frac{M_{in}}{M_{cusp}}\\right)^p \\right)^{1/p} \\quad (p \\approx 1.2)$$ 随着亮度趋向于峰值白色（$J \\to 100$），附加平滑退饱和包络函数： $$M_{final} = M_{out} \\cdot \\left( 1 - \\left(\\frac{J}{100}\\right)^4 \\right)$$ 保证高光中心完全汇聚于消色差轴（$M \\to 0$，纯白）。 Visual Inspection Criteria: - **肉眼直观判断**：动画中一个极高饱和度的点光源（如 $M=150$ 极端霓虹青）随亮度提升向中心靠拢；左侧 xy 坐标中轨迹严格沿固定色相射线收敛入 Rec.709 小三角形内，无任何顺时针或逆时针歪斜；右侧 $J$-$M$ 视图中，轨迹紧贴 Cusp 外边缘平滑滑入，在高光顶端垂直落入中性灰白轴。 - **机器自动化比对**：全过程色相角漂移 $|\\Delta h| \\le 0.05^\\circ$，输出 RGB 三通道在 Rec.709 范围内严格无下溢（$< 0$）或上溢（$> 1$），压缩函数一阶导数严格单调（$\\frac{d M_{out}}{d M_{in}} > 0$）。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Academy of Motion Picture Arts and Sciences (AMPAS) ACES Project (2024/2025), *\"ACES 2.0 Output Transform Specification\"*. - Hellwig, L. & Fairchild, M. D. (2022), *\"Bright light color appearance mo",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "学院色彩编码规范 ACES 2.0 CAM16 全谱色貌模型高光平滑退饱和与色域边界压缩",
    groundTruth: "1. **色彩空间转换矩阵（ACEScg AP1 至 ACES2065-1 AP0）**： $$M_{AP1 \\to AP0} = \\begin{bmatrix} 0.695452241357 & 0.140678696470 & 0.163869062172 \\\\ 0.044794563372 & 0.859671118456 & 0.095534318172 \\\\ -0.005525882558 & 0.004025219565 & 1.001500473950 \\end{bmatrix}$$ 2. **CAT16 适应矩阵（$M_{16}$）**： $$\\begin{bmatrix} R",
    evaluationCriteria: "- **肉眼直观判断**：动画中一个极高饱和度的点光源（如 $M=150$ 极端霓虹青）随亮度提升向中心靠拢；左侧 xy 坐标中轨迹严格沿固定色相射线收敛入 Rec.709 小三角形内，无任何顺时针或逆时针歪斜；右侧 $J$-$M$ 视图中，轨迹紧贴 Cusp 外边缘平滑滑入，在高光顶端垂直落入中性灰白轴。 - **机器自动化比对**：全过程色相角漂移 $|\\Delta h| \\le 0.05^\\circ$，输出 RGB 三通道在 Rec.709 范围内严格无下溢（$< 0$）或上溢（$> 1$），压缩函数一阶导数严格单调（$\\frac{d M_{out}}{d M_{in}} > 0$）。",
    referenceSource: "- Academy of Motion Picture Arts and Sciences (AMPAS) ACES Project (2024/2025), *\"ACES 2.0 Output Transform Specification\"*. - Hellwig, L. & Fairchild, M. D. (2022), *\"Bright light color appearance mo",
  },
};

/**
 * VFX-SYS-05: 连续时间几何蒙皮运动模糊(Continuous-Time Motion Blur)对偶四元数螺旋求交
 */
export const VFX_SYS_05_PROMPT: PromptSpec = {
  id: "VFX-SYS-05",
  label: "连续时间几何蒙皮运动模糊(Continuous-Time Motion Blur)对偶四元数螺旋求交 (Continuous-Time Dual Quaternion Skinning (DQS) Screw Motion & Ray-Polynomial Trajectory Intersection)",
  template: "Generate an SVG technical visualization of Continuous-Time Dual Quaternion Skinning (DQS) Screw Motion & Ray-Polynomial Trajectory Intersection as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **对偶四元数螺旋线性插值（ScLERP）方程**： 单位对偶四元数 $\\hat{q} = q_0 + \\epsilon q_\\epsilon$（$\\epsilon^2 = 0, \\|q_0\\|=1, q_0 \\cdot q_\\epsilon = 0$）。 两关键帧位姿 $\\hat{q}_A$ 到 $\\hat{q}_B$ 在时间 $t \\in [0, 1]$ 的解析轨迹为： $$\\hat{q}(t) = \\hat{q}_A (\\hat{q}_A^{-1} \\hat{q}_B)^t = \\cos\\frac{\\hat{\\theta} t}{2} + \\hat{s} \\sin\\frac{\\hat{\\theta} t}{2}$$ 其中 $\\hat{\\theta} = \\theta + \\epsilon d$（$\\theta$ 为旋转角，$d$ 为轴向平移距离），$\\hat{s}$ 为单位对偶螺距轴。 2. **时变双线性面元与光线相交多项式**： 三角形三顶点随时间运动轨迹可由二阶泰勒展开拟合：$v_k(t) = v_k(0) + \\mathbf{v}_k t + \\frac{1}{2} \\mathbf{a}_k t^2$。 光线方程为 $R(s) = O + s D$。光线在时刻 $t$ 击中三角形内部的代数行列式方程为： $$F(t) = \\det[R(s) - v_0(t), v_1(t) - v_0(t), v_2(t) - v_0(t)] = 0$$ 展开为关于时间 $t$ 的标量四次代数多项式： $$A t^4 + B t^3 + C t^2 + D t + E = 0$$ 采用 Ferrari 闭式解或 Durand-Kerner 算法求解 $t \\in [0, 1]$ 范围内的实根。 3. **体积保持率准则**： 对于扭转角 $\\theta = 180^\\circ$ 的圆柱体测试模型，LBS 在中间截面的体积萎缩至原面积的 $0\\%$（完全缩减为一个几何点），而 DQS 保持率严格为 $100\\%$。 Visual Inspection Criteria: - **肉眼直观判断**：左侧展示 LBS 插值，圆柱体旋转扭曲处剧烈坍塌凹陷，快门运动模糊散斑呈现不自然的直线折痕；右侧展示 DQS，圆柱体维持饱满管径，时空扫掠体（Swept Volume）外形呈完美外凸的光滑螺旋抛物面，光线切线求交点精准落在螺旋曲线外缘。 - **机器自动化比对**：验证插值螺旋线上采样点与刚体齐次变换矩阵群 $SE(3)$ 的距离 $\\|M^T M - I\\| \\le 10^{-7}$，多项式求根实根与几何求交几何误差 $\\le 10^{-5}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Ladislav Kavan, Steven Collins, Jiri Zara, Carol O'Sullivan (2007/2008), *\"Skinning with Dual Quaternions\"*, ACM Transactions on Graphics (SIGGRAPH 2007). - Intel Embree 4.3 Documentation, *\"Multi-S",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "连续时间几何蒙皮运动模糊(Continuous-Time Motion Blur)对偶四元数螺旋求交",
    groundTruth: "1. **对偶四元数螺旋线性插值（ScLERP）方程**： 单位对偶四元数 $\\hat{q} = q_0 + \\epsilon q_\\epsilon$（$\\epsilon^2 = 0, \\|q_0\\|=1, q_0 \\cdot q_\\epsilon = 0$）。 两关键帧位姿 $\\hat{q}_A$ 到 $\\hat{q}_B$ 在时间 $t \\in [0, 1]$ 的解析轨迹为： $$\\hat{q}(t) = \\hat{q}_A (\\hat{q}_A^{-1} \\hat{q}_B)^t = \\cos\\frac{\\hat{\\theta} t}{2} + \\hat{s} \\sin\\frac{\\ha",
    evaluationCriteria: "- **肉眼直观判断**：左侧展示 LBS 插值，圆柱体旋转扭曲处剧烈坍塌凹陷，快门运动模糊散斑呈现不自然的直线折痕；右侧展示 DQS，圆柱体维持饱满管径，时空扫掠体（Swept Volume）外形呈完美外凸的光滑螺旋抛物面，光线切线求交点精准落在螺旋曲线外缘。 - **机器自动化比对**：验证插值螺旋线上采样点与刚体齐次变换矩阵群 $SE(3)$ 的距离 $\\|M^T M - I\\| \\le 10^{-7}$，多项式求根实根与几何求交几何误差 $\\le 10^{-5}$。",
    referenceSource: "- Ladislav Kavan, Steven Collins, Jiri Zara, Carol O'Sullivan (2007/2008), *\"Skinning with Dual Quaternions\"*, ACM Transactions on Graphics (SIGGRAPH 2007). - Intel Embree 4.3 Documentation, *\"Multi-S",
  },
};

/**
 * VFX-SYS-06: 异构微着色语言 Slang 自动微分编译器可逆计算图与检查点梯度传播拓扑
 */
export const VFX_SYS_06_PROMPT: PromptSpec = {
  id: "VFX-SYS-06",
  label: "异构微着色语言 Slang 自动微分编译器可逆计算图与检查点梯度传播拓扑 (Slang/SLANG.D Heterogeneous Shading Compiler: Reverse-Mode Autodiff Computation Graph & Checkpointing Topology)",
  template: "Generate an SVG technical visualization of Slang/SLANG.D Heterogeneous Shading Compiler: Reverse-Mode Autodiff Computation Graph & Checkpointing Topology using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **反向模式自动微分伴随链式法则（Reverse-Mode AD）**： 设前向着色计算图包含拓扑序列 $v_i = \\phi_i(\\text{Parents}(v_i))$，标量损失为 $\\mathcal{L} = v_N$。 反向传播伴随变量定义为 $\\bar{v}_i = \\frac{\\partial \\mathcal{L}}{\\partial v_i}$，其在 DAG 中的逆向拓扑累加更新为： $$\\bar{v}_i = \\sum_{j \\in \\text{Children}(v_i)} \\bar{v}_j \\frac{\\partial \\phi_j}{\\partial v_i}$$ 2. **Slang 类型系统微积分契约**： 可微分变量封装为复合对 `DifferentialPair<T>(primal: T, d: Differential<T>)`。 在前向过程中，非平凡中间状态写入环形磁带缓冲 `Tape`；在反向过程中，`DifferentialPair` 在原位进行原子梯度累加（`atomicAdd`）。 3. **二叉树检查点（Optimal Checkpointing / Revolve）内存平衡方程**： 对于步数为 $L$ 的长光线反弹序列，设可用检查点显存槽位为 $M$。 - 无检查点（Naive Tape）：显存开销 $O(L)$，无额外 ALU 重计算； - 极小检查点（Only Input）：显存开销 $O(1)$，ALU 重计算次数膨胀至 $O(L^2)$； - Revolve 最优策略：在递归二分关键帧放置 Checkpoint，显存开销降为 $O(\\log_2 L)$，ALU 重计算系数严格满足： $$R(L, M) \\le 1 + \\left\\lceil \\log_2 \\binom{L+M}{M} \\right\\rceil$$ Visual Inspection Criteria: - **肉眼直观判断**：前向流（青色粗箭头）自左向右穿过着色节点，黄色菱形高亮标出 Checkpoint 冻结节点；橙色下沉管道为 Tape 显存缓存；反向伴随流（紫色箭头）自右向左精确回传梯度，在 Checkpoint 处分叉展开局部二次前向计算，全图各阶段张量流向层次分明无交叉干扰。 - **机器自动化比对**：计算图的拓扑排序无环性验证通过率 $100\\%$；对任意解析函数求导，反向模式自动生成代码计算出的数值梯度与有限差分基准相对误差 $\\frac{\\|\\nabla_{auto} - \\nabla_{num}\\|}{\\|\\nabla_{auto}\\| + 10^{-5}} \\le 10^{-6}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Yong He et al. (2023), *\"SLANG.D: Fast, Modular and Differentiable Shader Programming\"*, ACM Transactions on Graphics (SIGGRAPH Asia 2023). - Andreas Griewank & Andrea Walther (2000), *\"Algorithm 79",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "异构微着色语言 Slang 自动微分编译器可逆计算图与检查点梯度传播拓扑",
    groundTruth: "1. **反向模式自动微分伴随链式法则（Reverse-Mode AD）**： 设前向着色计算图包含拓扑序列 $v_i = \\phi_i(\\text{Parents}(v_i))$，标量损失为 $\\mathcal{L} = v_N$。 反向传播伴随变量定义为 $\\bar{v}_i = \\frac{\\partial \\mathcal{L}}{\\partial v_i}$，其在 DAG 中的逆向拓扑累加更新为： $$\\bar{v}_i = \\sum_{j \\in \\text{Children}(v_i)} \\bar{v}_j \\frac{\\partial \\phi_j}{\\partial v_i}",
    evaluationCriteria: "- **肉眼直观判断**：前向流（青色粗箭头）自左向右穿过着色节点，黄色菱形高亮标出 Checkpoint 冻结节点；橙色下沉管道为 Tape 显存缓存；反向伴随流（紫色箭头）自右向左精确回传梯度，在 Checkpoint 处分叉展开局部二次前向计算，全图各阶段张量流向层次分明无交叉干扰。 - **机器自动化比对**：计算图的拓扑排序无环性验证通过率 $100\\%$；对任意解析函数求导，反向模式自动生成代码计算出的数值梯度与有限差分基准相对误差 $\\frac{\\|\\nabla_{auto} - \\nabla_{num}\\|}{\\|\\nabla_{auto}\\| + 10^{-5}} \\le 1",
    referenceSource: "- Yong He et al. (2023), *\"SLANG.D: Fast, Modular and Differentiable Shader Programming\"*, ACM Transactions on Graphics (SIGGRAPH Asia 2023). - Andreas Griewank & Andrea Walther (2000), *\"Algorithm 79",
  },
};

/**
 * VFX-SYS-07: 实时神经辐射缓存(NRC)自训练 Tiny-MLP 时空辐射预测与偏差衰减网格
 */
export const VFX_SYS_07_PROMPT: PromptSpec = {
  id: "VFX-SYS-07",
  label: "实时神经辐射缓存(NRC)自训练 Tiny-MLP 时空辐射预测与偏差衰减网格 (Real-Time Neural Radiance Caching (NRC) Self-Training Tiny-MLP Architecture & Spatio-Temporal Bias Decay Grid)",
  template: "Generate an SVG technical visualization of Real-Time Neural Radiance Caching (NRC) Self-Training Tiny-MLP Architecture & Spatio-Temporal Bias Decay Grid as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **输入特征编码与网络拓扑结构**： - 空间坐标 $x \\in \\mathbb{R}^3$ 映射到 16 级分辨率的三维哈希网格（$2^L$ 到 $2^{L_{max}}$），经三线性插值得到 $16 \\times 2 = 32$ 维空间特征； - 视角方向 $\\omega \\in \\mathbb{S}^2$ 投影至 4 阶实球谐函数（Spherical Harmonics, 16 维）； - 加上表面粗糙度 $\\alpha$ 与漫反射反照率 $\\rho$，总输入维度为 64； - 隐藏层：4 层全连接，每层 64 神经元，激活函数为 LeakyReLU / Sine； - 输出层：3 维非负 HDR 辐射度向量 $(L_r, L_g, L_b)$。 2. **自训练辐射度目标与相对损失函数**： 对于一条光线路径，在反弹点 $x$ 处，其自训练目标为当前步直接辐射与下游网络缓存预测的组合： $$L_{\\text{target}} = L_{\\text{emit}} + \\rho(x, \\omega_{in}, \\omega_{out}) \\cdot f_{\\theta}(x', \\omega_{out}) \\cdot \\cos\\theta$$ 为抑制 HDR 高动态光强样本对梯度的过度主导，网络训练采用自适应相对误差损失函数： $$\\mathcal{L}(f_\\theta(x, \\omega), L_{\\text{target}}) = \\sum_{c \\in \\{r,g,b\\}} \\frac{|f_\\theta(x, \\omega)_c - L_{\\text{target},c}|}{L_{\\text{target},c} + \\epsilon} \\quad (\\epsilon = 0.01)$$ 3. **渐进偏差衰减（Bias Decay）时间指数平均**： 为防止自训练引发正反馈信号发散或局部偏色，网络权重与空间网格以滑动因子 $\\beta_t = 1 - \\frac{1}{t+1}$ 混合历史指数移动平均（EMA），理论证明在稳态场景下渐进收敛于无偏蒙特卡洛积分值。 Visual Inspection Criteria: - **肉眼直观判断**：红蓝色光路截断示意图清晰指引出“Primary Ray $\\to$ Secondary Bounce $\\to$ 截断点（Cache Query）”；下方绿色虚线反馈环标示自训练目标反向梯度，哈希多分辨率点阵立体网格与密集全连接矩阵节点标识准确无误。 - **机器自动化比对**：网络矩阵权重维度乘积严格吻合：$64 \\times 64 \\times 4 + 64 \\times 3 = 16576$ 个浮点参数；相对损失函数在极限点 $L_{\\text{target}} \\to \\infty$ 时梯度幅值有界（$\\le 1.0$），杜绝梯度爆炸。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Thomas Müller, Fabrice Rousselle, Jan Novák, Alexander Keller (2021), *\"Real-time Neural Radiance Caching for Path Tracing\"*, ACM Transactions on Graphics (SIGGRAPH 2021). - Thomas Müller, Alex Evan",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "实时神经辐射缓存(NRC)自训练 Tiny-MLP 时空辐射预测与偏差衰减网格",
    groundTruth: "1. **输入特征编码与网络拓扑结构**： - 空间坐标 $x \\in \\mathbb{R}^3$ 映射到 16 级分辨率的三维哈希网格（$2^L$ 到 $2^{L_{max}}$），经三线性插值得到 $16 \\times 2 = 32$ 维空间特征； - 视角方向 $\\omega \\in \\mathbb{S}^2$ 投影至 4 阶实球谐函数（Spherical Harmonics, 16 维）； - 加上表面粗糙度 $\\alpha$ 与漫反射反照率 $\\rho$，总输入维度为 64； - 隐藏层：4 层全连接，每层 64 神经元，激活函数为 LeakyReLU / Sine； - 输出层：3",
    evaluationCriteria: "- **肉眼直观判断**：红蓝色光路截断示意图清晰指引出“Primary Ray $\\to$ Secondary Bounce $\\to$ 截断点（Cache Query）”；下方绿色虚线反馈环标示自训练目标反向梯度，哈希多分辨率点阵立体网格与密集全连接矩阵节点标识准确无误。 - **机器自动化比对**：网络矩阵权重维度乘积严格吻合：$64 \\times 64 \\times 4 + 64 \\times 3 = 16576$ 个浮点参数；相对损失函数在极限点 $L_{\\text{target}} \\to \\infty$ 时梯度幅值有界（$\\le 1.0$），杜绝梯度爆炸。",
    referenceSource: "- Thomas Müller, Fabrice Rousselle, Jan Novák, Alexander Keller (2021), *\"Real-time Neural Radiance Caching for Path Tracing\"*, ACM Transactions on Graphics (SIGGRAPH 2021). - Thomas Müller, Alex Evan",
  },
};

/**
 * VFX-SYS-08: 裸眼3D光场显示倾斜柱镜光栅(Slanted Lenticular)微透镜光线转向与子像素视差切片拓扑
 */
export const VFX_SYS_08_PROMPT: PromptSpec = {
  id: "VFX-SYS-08",
  label: "裸眼3D光场显示倾斜柱镜光栅(Slanted Lenticular)微透镜光线转向与子像素视差切片拓扑 (Multiview Light Field Display Slanted Lenticular Array Ray Steering & Subpixel Angular Disparity Slicing)",
  template: "Generate an SVG technical visualization of Multiview Light Field Display Slanted Lenticular Array Ray Steering & Subpixel Angular Disparity Slicing as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **van Berkel 倾斜几何与透镜光栅节距方程**： 对于标准正方形显示像素（尺寸 $p \\times p$），包含红绿蓝 3 个子像素，单个子像素宽度为 $p_h = p/3$，高度为 $p_v = p$。 透镜倾斜角 $\\theta$ 取设计黄金角： $$\\tan\\theta = \\frac{p_h}{p_v} = \\frac{1}{3} \\implies \\theta \\approx 18.4349^\\circ$$ 透镜在垂直于光栅方向的物理周期（Pitch）为 $P_L$。为覆盖 $N$ 个离散视点（如 $N=8$），其有效视差步进周期满足： $$P_L = \\frac{N}{3} p \\cos\\theta$$ 2. **子像素视点索引映射（View Index Mapping）公式**： 屏幕上任意整数坐标子像素 $(x, y)$（以子像素宽和高为单位）对应的空间视点序号 $k \\in \\{0, 1, \\dots, N-1\\}$ 为： $$k = \\text{floor}\\left( x + 3 y \\cdot \\tan\\theta + \\phi_0 \\right) \\pmod N = \\text{floor}(x + y + \\phi_0) \\pmod N$$ 3. **斯涅尔定律微透镜表面光线偏转**： 柱面透镜曲率半径为 $R$，折射率为 $n_{glass} \\approx 1.491$（PMMA 亚克力材质）。基板厚度 $t$ 精确设计为透镜近轴焦距 $f = \\frac{R}{n_{glass} - 1}$。 离开透镜表面 $(x_s, z_s)$ 的光线偏转角 $\\alpha$ 与法线角 $\\beta = \\arcsin(x_s / R)$ 满足： $$\\sin\\alpha = n_{glass} \\sin(\\beta - \\gamma) \\quad (\\gamma \\text{ 为入射角})$$ Visual Inspection Criteria: - **肉眼直观判断**：图面中微观子像素用红绿蓝条形清晰标出，下方附着圆弧柱状微透镜；穿出透镜的光线按照 8 种视点色谱扇形发散，不同倾斜行的同色子像素光线汇聚于空间特定观察角域，相邻视点交界过渡平滑均匀，无光线重叠打结或死角盲区。 - **机器自动化比对**：视点映射函数在全子像素阵列上的分布熵达到最大值（各视点占比严格等于 $1/N$），折射几何光线偏转角经斯涅尔公式验算相对残差 $\\le 10^{-5}$。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Cees van Berkel, J.A. Clarke (1997), *\"Characterisation and optimisation of 3D-LCD module design\"*, SPIE Proceedings Vol. 3012, Stereoscopic Displays and Virtual Reality Systems IV. - Neil A. Dodgso",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "裸眼3D光场显示倾斜柱镜光栅(Slanted Lenticular)微透镜光线转向与子像素视差切片拓扑",
    groundTruth: "1. **van Berkel 倾斜几何与透镜光栅节距方程**： 对于标准正方形显示像素（尺寸 $p \\times p$），包含红绿蓝 3 个子像素，单个子像素宽度为 $p_h = p/3$，高度为 $p_v = p$。 透镜倾斜角 $\\theta$ 取设计黄金角： $$\\tan\\theta = \\frac{p_h}{p_v} = \\frac{1}{3} \\implies \\theta \\approx 18.4349^\\circ$$ 透镜在垂直于光栅方向的物理周期（Pitch）为 $P_L$。为覆盖 $N$ 个离散视点（如 $N=8$），其有效视差步进周期满足： $$P_L = \\frac{N",
    evaluationCriteria: "- **肉眼直观判断**：图面中微观子像素用红绿蓝条形清晰标出，下方附着圆弧柱状微透镜；穿出透镜的光线按照 8 种视点色谱扇形发散，不同倾斜行的同色子像素光线汇聚于空间特定观察角域，相邻视点交界过渡平滑均匀，无光线重叠打结或死角盲区。 - **机器自动化比对**：视点映射函数在全子像素阵列上的分布熵达到最大值（各视点占比严格等于 $1/N$），折射几何光线偏转角经斯涅尔公式验算相对残差 $\\le 10^{-5}$。",
    referenceSource: "- Cees van Berkel, J.A. Clarke (1997), *\"Characterisation and optimisation of 3D-LCD module design\"*, SPIE Proceedings Vol. 3012, Stereoscopic Displays and Virtual Reality Systems IV. - Neil A. Dodgso",
  },
};

/**
 * VFX-SYS-09: 现代广色域动态范围感知量化(PQ) SMPTE ST 2084 EOTF响应与Barten阶梯标尺
 */
export const VFX_SYS_09_PROMPT: PromptSpec = {
  id: "VFX-SYS-09",
  label: "现代广色域动态范围感知量化(PQ) SMPTE ST 2084 EOTF响应与Barten阶梯标尺 (SMPTE ST 2084 (Perceptual Quantizer / PQ) EOTF Non-Linear Log-Power Response & Barten CSF Luminance Ladder)",
  template: "Generate an SVG technical visualization of SMPTE ST 2084 (Perceptual Quantizer / PQ) EOTF Non-Linear Log-Power Response & Barten CSF Luminance Ladder as a high-precision static cross-sectional/topological vector SVG diagram (absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **ST 2084 EOTF 解析电光转换公式（数字量化码值 $E' \\in [0, 1] \\to$ 物理亮度 $L\\text{ (cd/m}^2\\text{)}$）**： $$L = 10000 \\cdot \\left( \\frac{\\max(E'^{1/m_2} - c_1, 0)}{c_2 - c_3 E'^{1/m_2}} \\right)^{1/m_1}$$ 2. **逆 EOTF 公式（物理亮度归一化 $Y = L / 10000 \\in [0, 1] \\to E'$）**： $$E' = \\left( \\frac{c_1 + c_2 Y^{m_1}}{1 + c_3 Y^{m_1}} \\right)^{m_2}$$ 3. **权威标准无理/有理数解析常数定义（SMPTE ST 2084 官方）**： $$m_1 = \\frac{2610}{16384} = 0.1593017578125$$ $$m_2 = \\frac{2523}{4096} \\times 128 = \\frac{2523}{32} = 78.84375$$ $$c_1 = \\frac{3424}{4096} = \\frac{107}{128} = 0.8359375$$ $$c_2 = \\frac{2413}{4096} \\times 32 = \\frac{2413}{128} = 18.8515625$$ $$c_3 = \\frac{2392}{4096} \\times 32 = \\frac{299}{16} = 18.6875$$ 4. **关键标定点参考真值**： - $0.0001\\text{ nits} \\implies E' \\approx 0.000000$ (底限) - $100\\text{ nits (标准 SDR 峰值)} \\implies E' = 0.508078$ (10-bit 对应 Code 520) - $1000\\text{ nits (消费级 HDR10 峰值)} \\implies E' = 0.751827$ (10-bit 对应 Code 769) - $10000\\text{ nits (工业大师母带极限)} \\implies E' = 1.000000$ (10-bit 对应 Code 1023) 5. **Barten 阶梯感知门限准则**： 在 10-bit 编码下，相邻码阶亮度相对比 $\\frac{\\Delta L}{L}$ 在全段稳定处于 $0.5\\% \\sim 0.9\\%$ 区间，紧贴 Barten JND 门限曲线（约 $0.4\\% \\sim 1.0\\%$）；在 12-bit 下步长降至 $0.2\\%$，完全沉入视觉盲区。 Visual Inspection Criteria: - **肉眼直观判断**：坐标图严格采用双对数等比网格，青色 ST 2084 曲线从中低亮度到高亮度呈现优美平缓的 S 型对数延伸，而传统的红虚线 Rec.709 曲线在超过 100 nits 处出现剧烈陡峭发散；Barten JND 灰色安全包络带标定清晰，10-bit 与 12-bit 离散台阶刻度与曲线吻合。 - **机器自动化比对**：校验曲线在 100、1000、10000 nits 处的 SVG 像素坐标，其与解析式理论值的归一化误差 $\\le 10^{-6}$；验证常数矩阵与 SMPTE ST 2084 有理数分数逐位一致。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- SMPTE ST 2084:2014, *\"High Dynamic Range Electro-Optical Transfer Function of Mastering Reference Displays\"*. - ITU-R Recommendation BT.2100-2 (2018), *\"Image parameter values for high dynamic range",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "现代广色域动态范围感知量化(PQ) SMPTE ST 2084 EOTF响应与Barten阶梯标尺",
    groundTruth: "1. **ST 2084 EOTF 解析电光转换公式（数字量化码值 $E' \\in [0, 1] \\to$ 物理亮度 $L\\text{ (cd/m}^2\\text{)}$）**： $$L = 10000 \\cdot \\left( \\frac{\\max(E'^{1/m_2} - c_1, 0)}{c_2 - c_3 E'^{1/m_2}} \\right)^{1/m_1}$$ 2. **逆 EOTF 公式（物理亮度归一化 $Y = L / 10000 \\in [0, 1] \\to E'$）**： $$E' = \\left( \\frac{c_1 + c_2 Y^{m_1}}{1 + c_3 Y^{m",
    evaluationCriteria: "- **肉眼直观判断**：坐标图严格采用双对数等比网格，青色 ST 2084 曲线从中低亮度到高亮度呈现优美平缓的 S 型对数延伸，而传统的红虚线 Rec.709 曲线在超过 100 nits 处出现剧烈陡峭发散；Barten JND 灰色安全包络带标定清晰，10-bit 与 12-bit 离散台阶刻度与曲线吻合。 - **机器自动化比对**：校验曲线在 100、1000、10000 nits 处的 SVG 像素坐标，其与解析式理论值的归一化误差 $\\le 10^{-6}$；验证常数矩阵与 SMPTE ST 2084 有理数分数逐位一致。",
    referenceSource: "- SMPTE ST 2084:2014, *\"High Dynamic Range Electro-Optical Transfer Function of Mastering Reference Displays\"*. - ITU-R Recommendation BT.2100-2 (2018), *\"Image parameter values for high dynamic range",
  },
};

/**
 * VFX-SYS-10: 屏幕空间时域抗锯齿(TAA/TSR)亚像素 Halton 抖动与历史样本方差裁剪
 */
export const VFX_SYS_10_PROMPT: PromptSpec = {
  id: "VFX-SYS-10",
  label: "屏幕空间时域抗锯齿(TAA/TSR)亚像素 Halton 抖动与历史样本方差裁剪 (Temporal Anti-Aliasing (TAA/TSR) Halton(2,3) Subpixel Jitter & YCoCg History Variance Clipping)",
  template: "Generate an SVG technical visualization of Temporal Anti-Aliasing (TAA/TSR) Halton(2,3) Subpixel Jitter & YCoCg History Variance Clipping using pure inline SVG animation (SMIL or inline CSS keyframes, absolutely NO JavaScript or interactive event listeners). Physical & Mathematical Ground Truth: 1. **Halton(2, 3) 低差异亚像素抖动序列（前 8 相位基准）**： 对基数 $b$，将整数索引 $n = \\sum a_k b^k$ 反转为根式倒数 $\\phi_b(n) = \\sum a_k b^{-(k+1)}$。 亚像素偏移 $(\\Delta x, \\Delta y) = (\\phi_2(n) - 0.5, \\phi_3(n) - 0.5)$，前 8 帧精确真值表为： - 帧 1: $(0.0, -0.166667)$ - 帧 2: $(-0.25, +0.166667)$ - 帧 3: $(+0.25, -0.388889)$ - 帧 4: $(-0.375, -0.055556)$ - 帧 5: $(+0.125, +0.277778)$ - 帧 6: $(-0.125, -0.277778)$ - 帧 7: $(+0.375, +0.055556)$ - 帧 8: $(-0.4375, +0.388889)$ 2. **可逆无损 RGB 至 YCoCg 变换矩阵**： $$\\begin{bmatrix} Y \\\\ Co \\\\ Cg \\end{bmatrix} = \\begin{bmatrix} 0.25 & 0.5 & 0.25 \\\\ 0.5 & 0 & -0.5 \\\\ -0.25 & 0.5 & -0.25 \\end{bmatrix} \\begin{bmatrix} R \\\\ G \\\\ B \\end{bmatrix}, \\quad \\begin{bmatrix} R \\\\ G \\\\ B \\end{bmatrix} = \\begin{bmatrix} 1 & 1 & -1 \\\\ 1 & 0 & 1 \\\\ 1 & -1 & -1 \\end{bmatrix} \\begin{bmatrix} Y \\\\ Co \\\\ Cg \\end{bmatrix}$$ 3. **YCoCg 方差裁剪盒（Variance Clipping AABB）与几何求交**： 在当前帧待更新像素的 $3\\times 3$ 邻域内计算 9 个像素的一阶矩 $m_1 = \\sum_{k=1}^9 C_k$ 与二阶矩 $m_2 = \\sum_{k=1}^9 C_k^2$。 局部均值与标准差为： $$\\mu = \\frac{m_1}{9}, \\quad \\sigma = \\sqrt{\\max\\left( \\frac{m_2}{9} - \\mu^2, 0 \\right)}$$ 构造轴对齐包围盒 $[C_{min}, C_{max}] = [\\mu - \\gamma\\sigma, \\mu + \\gamma\\sigma]$（影视标准参数 $\\gamma = 1.0 \\sim 1.25$）。 对于重投影历史样本 $C_{hist}$，求解线段从 $\\mu$ 到 $C_{hist}$ 与包围盒表面相交的插值比率 $t \\in [0, 1]$： $$C_{clamped} = \\text{Intersection}(C_{hist}, \\mu, C_{min}, C_{max})$$ 4. **时间指数混合（EMA）权重更新**： 最终像素颜色输出为 $C_{output} = \\alpha C_{current} + (1 - \\alpha) C_{clamped}$（常规平稳帧 $\\alpha \\approx 0.05 \\sim 0.1$）。 Visual Inspection Criteria: - **肉眼直观判断**：左图像素格中的黄色采样点沿 Halton 序号顺序动态跳跃分布均匀，覆盖整个亚像素区域；右图 YCoCg 坐标系中，代表当前帧统计的方差矩形框随时间根据边缘亮度扩张/收缩，当红色历史样本点被运镜拉出框外时，黄色的裁剪射线瞬间将其限制在矩形盒边缘交点处，彻底消除拖尾。 - **机器自动化比对**：验证 8 帧 Halton 点坐标绝对数值误差 $\\le 10^{-6}$；验证 YCoCg 正反变换矩阵相乘严格等于三阶单位矩阵 $I_3$；检验被裁切的历史样本严格位于 $[C_{min}, C_{max}]$ 闭区间边界内。 Ensure the output is strictly well-formed valid XML SVG: wrap any <style> CSS in CDATA, do NOT use consecutive hyphens '--' inside comments, avoid duplicate attributes on tags, and self-contain all elements.",
  variables: [],
  candidates: [],
  source: "- Brian Karis (Epic Games, 2014), *\"High-Quality Temporal Supersampling\"*, ACM SIGGRAPH 2014 Courses: Advances in Real-Time Rendering in Games. - Marco Salvi (2016), *\"Temporal Antialiasing in Unchart",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "屏幕空间时域抗锯齿(TAA/TSR)亚像素 Halton 抖动与历史样本方差裁剪",
    groundTruth: "1. **Halton(2, 3) 低差异亚像素抖动序列（前 8 相位基准）**： 对基数 $b$，将整数索引 $n = \\sum a_k b^k$ 反转为根式倒数 $\\phi_b(n) = \\sum a_k b^{-(k+1)}$。 亚像素偏移 $(\\Delta x, \\Delta y) = (\\phi_2(n) - 0.5, \\phi_3(n) - 0.5)$，前 8 帧精确真值表为： - 帧 1: $(0.0, -0.166667)$ - 帧 2: $(-0.25, +0.166667)$ - 帧 3: $(+0.25, -0.388889)$ - 帧 4: $(-0.375, -0.0",
    evaluationCriteria: "- **肉眼直观判断**：左图像素格中的黄色采样点沿 Halton 序号顺序动态跳跃分布均匀，覆盖整个亚像素区域；右图 YCoCg 坐标系中，代表当前帧统计的方差矩形框随时间根据边缘亮度扩张/收缩，当红色历史样本点被运镜拉出框外时，黄色的裁剪射线瞬间将其限制在矩形盒边缘交点处，彻底消除拖尾。 - **机器自动化比对**：验证 8 帧 Halton 点坐标绝对数值误差 $\\le 10^{-6}$；验证 YCoCg 正反变换矩阵相乘严格等于三阶单位矩阵 $I_3$；检验被裁切的历史样本严格位于 $[C_{min}, C_{max}]$ 闭区间边界内。",
    referenceSource: "- Brian Karis (Epic Games, 2014), *\"High-Quality Temporal Supersampling\"*, ACM SIGGRAPH 2014 Courses: Advances in Real-Time Rendering in Games. - Marco Salvi (2016), *\"Temporal Antialiasing in Unchart",
  },
};

export const VFX_SYS_INDIVIDUAL_PROMPTS: readonly PromptSpec[] = [
  VFX_SYS_01_PROMPT,
  VFX_SYS_02_PROMPT,
  VFX_SYS_03_PROMPT,
  VFX_SYS_04_PROMPT,
  VFX_SYS_05_PROMPT,
  VFX_SYS_06_PROMPT,
  VFX_SYS_07_PROMPT,
  VFX_SYS_08_PROMPT,
  VFX_SYS_09_PROMPT,
  VFX_SYS_10_PROMPT,
];

/**
 * VFX-6: 实时虚拟制片、深度合成与异构并行图形系统 领域分组套题（UX 交互对齐四大名著，含 10 个候选场景）
 */
export const VFX_SYS_SUITE_PROMPT: PromptSpec = {
  id: "vfx-sys-v1",
  label: "VFX-6: 实时虚拟制片与异构并行图形系统（十题组）",
  template: "VFX-6: 实时虚拟制片、深度合成与异构并行图形系统 前沿视觉特效十题组，每个轮换周期洗牌抽一题，或在下拉菜单中直接指定场景。",
  variables: [],
    candidates: [
    {
      id: VFX_SYS_01_PROMPT.id,
      label: "现场虚拟制片(ICVFX) 摄像机离轴斜透视投影与曲面LED墙柱面畸变预补偿",
      text: VFX_SYS_01_PROMPT.template,
      standard: VFX_SYS_01_PROMPT.standard,
    },
    {
      id: VFX_SYS_02_PROMPT.id,
      label: "摄影机卷帘快门(Rolling Shutter)与LED扫描刷新Genlock相位偏移莫尔条纹空频滤波",
      text: VFX_SYS_02_PROMPT.template,
      standard: VFX_SYS_02_PROMPT.standard,
    },
    {
      id: VFX_SYS_03_PROMPT.id,
      label: "全谱系深度合成(Deep Compositing)沿光线非均匀亚像素体积不透明度与透过率积分重建",
      text: VFX_SYS_03_PROMPT.template,
      standard: VFX_SYS_03_PROMPT.standard,
    },
    {
      id: VFX_SYS_04_PROMPT.id,
      label: "学院色彩编码规范 ACES 2.0 CAM16 全谱色貌模型高光平滑退饱和与色域边界压缩",
      text: VFX_SYS_04_PROMPT.template,
      standard: VFX_SYS_04_PROMPT.standard,
    },
    {
      id: VFX_SYS_05_PROMPT.id,
      label: "连续时间几何蒙皮运动模糊(Continuous-Time Motion Blur)对偶四元数螺旋求交",
      text: VFX_SYS_05_PROMPT.template,
      standard: VFX_SYS_05_PROMPT.standard,
    },
    {
      id: VFX_SYS_06_PROMPT.id,
      label: "异构微着色语言 Slang 自动微分编译器可逆计算图与检查点梯度传播拓扑",
      text: VFX_SYS_06_PROMPT.template,
      standard: VFX_SYS_06_PROMPT.standard,
    },
    {
      id: VFX_SYS_07_PROMPT.id,
      label: "实时神经辐射缓存(NRC)自训练 Tiny-MLP 时空辐射预测与偏差衰减网格",
      text: VFX_SYS_07_PROMPT.template,
      standard: VFX_SYS_07_PROMPT.standard,
    },
    {
      id: VFX_SYS_08_PROMPT.id,
      label: "裸眼3D光场显示倾斜柱镜光栅(Slanted Lenticular)微透镜光线转向与子像素视差切片拓扑",
      text: VFX_SYS_08_PROMPT.template,
      standard: VFX_SYS_08_PROMPT.standard,
    },
    {
      id: VFX_SYS_09_PROMPT.id,
      label: "现代广色域动态范围感知量化(PQ) SMPTE ST 2084 EOTF响应与Barten阶梯标尺",
      text: VFX_SYS_09_PROMPT.template,
      standard: VFX_SYS_09_PROMPT.standard,
    },
    {
      id: VFX_SYS_10_PROMPT.id,
      label: "屏幕空间时域抗锯齿(TAA/TSR)亚像素 Halton 抖动与历史样本方差裁剪",
      text: VFX_SYS_10_PROMPT.template,
      standard: VFX_SYS_10_PROMPT.standard,
    },
  ],
  source: "- Robert Kooima (2009), *\"Generalized Perspective Projection\"*, Journal of Graphics Tools. - SMPTE RIS-OSVP (2024), *\"OpenTrackIO: Camera Tracking and Lens Metadata Standard\"*. - VES Handbook of Virtu",
  verified: true,
  immutable: true,
  originDate: "2026-09",
  registeredAt: "2026-09-27",
  standard: {
    coreKey: "现场虚拟制片（ICVFX）离轴视锥斜投影、ACES 2.0 色彩转换与深度体积合成",
    groundTruth: "以摄影机视锥离轴斜透视变换矩阵、ACES 2.0 CAM16 高光退饱和色域映射、OpenEXR 沿视线亚像素连续深度积分与连续时间几何蒙皮运动模糊为基准，满足摄影机几何投影学与 SMPTE 标准。",
    evaluationCriteria: "1. 透视校正：LED 弧形背景离轴视差与前景相机光轴严格对准；2. 色彩空间：ACEScg 到 Rec.2020 转换色度与动态范围保真；3. 语法规范：XML 严格合法，无交互 JS。",
    referenceSource: "https://www.vesglobal.org",
  },
};

export const VFX_SYS_PROMPTS = VFX_SYS_INDIVIDUAL_PROMPTS;
