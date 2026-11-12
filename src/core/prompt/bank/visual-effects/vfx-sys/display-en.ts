import type { LocalizedStandardEntry } from "../../../types";

export const VFX_SYS_LABELS_EN: Readonly<Record<string, string>> = {
  "vfx-sys-v1": "VFX-6: Virtual Production & Differentiable Rendering (10-Prompt Suite)",
};

export const VFX_SYS_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "vfx-sys-v1": {
    coreKey: "In-Camera VFX Off-Axis Frustum Projection, ACES 2.0 CAM16 Gamut Mapping & OpenEXR Deep Volumetric Compositing",
    groundTruth:
      "Grounded in Kooima generalized off-axis perspective projection matrices, rolling-shutter vs. LED PWM genlock Moiré filtering, OpenEXR Beer-Lambert deep sample splitting, ACES 2.0 CAM16-Hellwig JMh gamut compression, continuous-time Dual Quaternion Skinning (DQS) motion blur, and Halton(2,3) TAA variance clipping.",
    evaluationCriteria:
      "1. Projection & temporal alignment: Curved LED wall frustum seams remain collinear with foreground parallax, and Halton subpixel jitter / YCoCg AABB clipping are exact; 2. Color & shading pipelines: ACES 2.0 hue-linear desaturation, SMPTE ST 2084 PQ EOTF curves, Slang reverse-mode AD graphs, and slanted lenticular ray steering match reference equations; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "VFX-SYS-01": {
    coreKey: "In-Camera VFX Off-Axis Asymmetric Frustum Projection & Curved LED Cylindrical Pre-Warping",
    groundTruth:
      "1. **Robert Kooima Generalized Perspective Projection**: Camera eye $P_e = (x_e, y_e, z_e)$ and screen corners $P_a, P_b, P_c$ define orthonormal screen basis $u = \\frac{P_b - P_a}{\\|P_b - P_a\\|}, v = \\frac{P_c - P_a}{\\|P_c - P_a\\|}, n = \\frac{u \\times v}{\\|u \\times v\\|}$, distance $d = -((P_a - P_e)\\cdot n)$, frustum bounds $l, r, b, t = \\frac{n_{near}}{d}(u\\text{ or }v)\\cdot(P_{a,b,c}-P_e)$, and off-axis matrix $M_{off-axis}$. 2. **Cylindrical Pre-Warping**: For LED radius $R$ centered at $(X_c, Z_c)$, ray azimuth $\\theta = \\arctan(\\frac{X - X_c}{Z - Z_c})$ maps to $U = (\\theta - \\theta_{start})/\\Delta\\theta, V = (Y - Y_{bottom})/\\Delta Y$ with seam residual $\\le 0.5\\text{ px}$ at $\\pm 45^\\circ$ and tracking jitter $\\le 1.0\\text{ ms}$.",
    evaluationCriteria:
      "- **Visual Inspection**: Left view shows camera dolly motion along a curved track with the green off-axis inner frustum dynamically warping across the LED volume; right camera viewport shows foreground red pillars remaining strictly collinear with virtual background architecture without swimming or parallax shear. - **Automated Metrics**: Projection rays from $P_e$ to the curved LED wall maintain $C^1$ slope continuity with Kooima frustum bounds and cylindrical azimuth $\\theta$, achieving reprojection RMSE $\\le 10^{-4}$.",
  },
  "VFX-SYS-02": {
    coreKey: "Rolling Shutter Sensor Readout & LED PWM Scanline Genlock Phase-Offset Moire Spatial Frequency Filtering",
    groundTruth:
      "1. **Rolling Shutter Readout & Genlock Phase Offset**: Scanline $y$ begins exposure at $t(y) = t_0 + y\\cdot\\tau_{line}$ for duration $T_{exp} = \\frac{\\theta_{shutter}}{360^\\circ \\cdot FPS}$ over LED PWM pulse train $P(t) = \\sum_k \\text{rect}(\\frac{t - k T_{pwm}}{\\delta})$, yielding exposure integral $I(y) = \\int_{t(y)}^{t(y)+T_{exp}} P(t)dt$ with banding-free lock criterion $\\text{Var}(I)/\\bar{I}^2 \\le 10^{-4}$ and PTP jitter $\\le \\pm 0.5\\,\\mu\\text{s}$. 2. **Moire Beat Frequency & OLPF Cutoff**: $f_{moire} = |f_{sensor} - f_{led}| = |\\frac{1}{p_{sensor}} - \\frac{1}{M \\cdot p_{led}}|$; birefringent OLPF $H_{olpf}(f) = \\cos(\\pi d f)$ zeroes Nyquist $f_N = \\frac{1}{2p_{sensor}}$ ($\\ge 26\\text{ dB}$ attenuation).",
    evaluationCriteria:
      "- **Visual Inspection**: When Phase Offset enters the green Lock Sync zone, the scanline exposure integral flattens into a constant line and horizontal dark shutter bars vanish; in the spatial frequency plot, the OLPF envelope suppresses the red Moire alias spike. - **Automated Metrics**: Out-of-sync exposure ripple reaches $\\ge 35\\%$ whereas phase-locked residual standard deviation satisfies $\\sigma \\le 0.001$; high-frequency energy ratio $E(f > f_N)/E_{total} \\le 0.01$.",
  },
  "VFX-SYS-03": {
    coreKey: "OpenEXR Deep Compositing Along-Ray Volumetric Opacity Reconstruction & Transmittance Integration",
    groundTruth:
      "1. **Beer-Lambert Volumetric Extinction**: Over depth interval $[Z_0, Z_1]$ with extinction $\\tau$, transmittance is $T(z) = \\exp(-\\tau(z - Z_0))$ and total opacity is $\\alpha = 1 - \\exp(-\\tau(Z_1 - Z_0))$. 2. **Exact Deep Sample Splitting**: Splitting at $Z_{split} \\in (Z_0, Z_1)$ with fraction $t = \\frac{Z_{split}-Z_0}{Z_1-Z_0} \\in (0, 1)$ yields $\\alpha_a = 1 - (1 - \\alpha)^t$ and $\\alpha_b = 1 - (1 - \\alpha)^{1-t}$, preserving $\\alpha_{total} = \\alpha_a + (1 - \\alpha_a)\\alpha_b \\equiv \\alpha$. 3. **Ordered Front-to-Back Over Integration**: $T_i = \\prod_{j=1}^{i-1}(1 - \\alpha_j)$, $C = \\sum_{i=1}^N C_i \\alpha_i T_i$, $A = 1 - \\prod_{i=1}^N(1 - \\alpha_i)$ with split-merge error $|\\alpha_{total} - \\alpha| \\le 10^{-7}$.",
    evaluationCriteria:
      "- **Visual Inspection**: Diagram clearly marks volumetric entry $Z_0$, exit $ZBack$, and hard-surface insertion $Z_{split}$, showing a continuous exponential transmittance curve $T(z)$ without step discontinuities across $Z_{split}$ and distinct pre/post-split volumetric strata. - **Automated Metrics**: Sampled transmittance curve obeys $y = y_0(1 - \\alpha)^t$; composited color integral before and after sample splitting matches within $|\\Delta E| \\le 10^{-6}$.",
  },
  "VFX-SYS-04": {
    coreKey: "ACES 2.0 Output Transform: CAM16-Hellwig Perceptual JMh Gamut Mapping & Highlight Desaturation",
    groundTruth:
      "1. **ACEScg AP1 to AP0 Matrix**: $M_{AP1 \\to AP0} = \\begin{bmatrix} 0.695452241357 & 0.140678696470 & 0.163869062172 \\\\ 0.044794563372 & 0.859671118456 & 0.095534318172 \\\\ -0.005525882558 & 0.004025219565 & 1.001500473950 \\end{bmatrix}$. 2. **CAT16 Matrix $M_{16}$**: Maps $XYZ$ to $(R_{16}, G_{16}, B_{16})^T$. 3. **Hellwig 2022 JMh Cusp Gamut Compression & Highlight Desaturation**: Along constant lightness $J$ and hue $h$ toward cusp $(J_{cusp}(h), M_{cusp}(h))$, $M_{out} = M_{cusp}(M_{in}/M_{cusp}) / (1 + (M_{in}/M_{cusp})^p)^{1/p}$ ($p \\approx 1.2$), followed by highlight roll-off $M_{final} = M_{out}(1 - (J/100)^4) \\to 0$ as $J \\to 100$.",
    evaluationCriteria:
      "- **Visual Inspection**: High-chroma input ($M=150$) compresses radially along constant-hue rays into the Rec.709 triangle in chromaticity space without hue skew, while following the gamut cusp boundary in the $J$-$M$ plane and converging smoothly to the achromatic white axis ($M \\to 0$) at peak lightness. - **Automated Metrics**: Hue angle drift $|\\Delta h| \\le 0.05^\\circ$; output Rec.709 RGB channels strictly within $[0, 1]$ without clipping; monotonic compression derivative $dM_{out}/dM_{in} > 0$.",
  },
  "VFX-SYS-05": {
    coreKey: "Continuous-Time Dual Quaternion Skinning (DQS) Screw Motion & Ray-Polynomial Trajectory Intersection",
    groundTruth:
      "1. **Dual Quaternion Screw Linear Interpolation (ScLERP)**: Unit dual quaternion $\\hat{q} = q_0 + \\epsilon q_\\epsilon$ ($\\epsilon^2 = 0, \\|q_0\\|=1, q_0 \\cdot q_\\epsilon = 0$) interpolates from $\\hat{q}_A$ to $\\hat{q}_B$ over $t \\in [0, 1]$ via $\\hat{q}(t) = \\hat{q}_A(\\hat{q}_A^{-1}\\hat{q}_B)^t = \\cos(\\frac{\\hat{\\theta}t}{2}) + \\hat{s}\\sin(\\frac{\\hat{\\theta}t}{2})$ ($\\hat{\\theta} = \\theta + \\epsilon d$). 2. **Continuous-Time Ray-Triangle Quartic Intersection**: Vertex trajectories $v_k(t) = v_k(0) + \\mathbf{v}_k t + \\frac{1}{2}\\mathbf{a}_k t^2$ intersected with ray $R(s) = O + sD$ yield scalar quartic $F(t) = \\det[R(s)-v_0(t), v_1(t)-v_0(t), v_2(t)-v_0(t)] = At^4 + Bt^3 + Ct^2 + Dt + E = 0$, preserving $100\\%$ cross-sectional volume at $\\theta = 180^\\circ$ twist vs. $0\\%$ LBS candy-wrapper collapse.",
    evaluationCriteria:
      "- **Visual Inspection**: Side-by-side comparison shows LBS collapsing at the midpoint under $180^\\circ$ twist with linear motion-blur artifacts, whereas DQS preserves full cylindrical volume along a smooth helical swept envelope with exact ray-quartic intersection points. - **Automated Metrics**: Rigid transformation orthogonality residual $\\|M^T M - I\\| \\le 10^{-7}$ in $SE(3)$; quartic root intersection accuracy $\\le 10^{-5}$.",
  },
  "VFX-SYS-06": {
    coreKey: "Slang/SLANG.D Heterogeneous Shading Compiler: Reverse-Mode Autodiff Computation Graph & Checkpointing Topology",
    groundTruth:
      "1. **Reverse-Mode AD Adjoint Chain Rule**: For forward DAG $v_i = \\phi_i(\\text{Parents}(v_i))$ and scalar loss $\\mathcal{L} = v_N$, adjoints $\\bar{v}_i = \\partial \\mathcal{L}/\\partial v_i$ accumulate in reverse topological order via $\\bar{v}_i = \\sum_{j \\in \\text{Children}(v_i)} \\bar{v}_j \\frac{\\partial \\phi_j}{\\partial v_i}$. 2. **Slang DifferentialPair & Tape**: `DifferentialPair<T>(primal: T, d: Differential<T>)` records non-trivial intermediates to a ring-buffer `Tape` and accumulates gradients via `atomicAdd`. 3. **Revolve Binary-Tree Checkpointing**: For path length $L$ and $M$ checkpoint slots, memory drops from $O(L)$ to $O(\\log_2 L)$ with recomputation factor $R(L, M) \\le 1 + \\lceil \\log_2 \\binom{L+M}{M} \\rceil$.",
    evaluationCriteria:
      "- **Visual Inspection**: Forward primal flow (cyan arrows) traverses shader nodes left-to-right with yellow diamond Checkpoint nodes and orange Tape storage; reverse adjoint flow (purple arrows) propagates gradients right-to-left, triggering local forward recomputation sub-trees at checkpoints without edge tangling. - **Automated Metrics**: 100% DAG topological acyclicity; reverse-mode autodiff gradient matches finite-difference ground truth within $\\frac{\\|\\nabla_{auto} - \\nabla_{num}\\|}{\\|\\nabla_{auto}\\| + 10^{-5}} \\le 10^{-6}$.",
  },
  "VFX-SYS-07": {
    coreKey: "Real-Time Neural Radiance Caching (NRC) Self-Training Tiny-MLP Architecture & Spatio-Temporal Bias Decay Grid",
    groundTruth:
      "1. **Feature Encoding & Tiny-MLP Topology**: 3D position $x \\in \\mathbb{R}^3$ multi-resolution hash grid ($L=16$ levels $\\times 2 = 32$-D), view direction $\\omega \\in \\mathbb{S}^2$ 4th-order spherical harmonics ($16$-D), roughness $\\alpha$, and albedo $\\rho$ form a $64$-D input into 4 fully connected hidden layers ($64$ neurons/layer, LeakyReLU/Sine) outputting 3-D HDR radiance $(L_r, L_g, L_b)$. 2. **Self-Training Target & Relative Loss**: $L_{\\text{target}} = L_{\\text{emit}} + \\rho(x, \\omega_{in}, \\omega_{out}) f_\\theta(x', \\omega_{out})\\cos\\theta$, trained with relative $L_1$ loss $\\mathcal{L} = \\sum_{c \\in \\{r,g,b\\}} \\frac{|f_\\theta(x,\\omega)_c - L_{\\text{target},c}|}{L_{\\text{target},c} + \\epsilon}$ ($\\epsilon = 0.01$) and EMA bias decay $\\beta_t = 1 - \\frac{1}{t+1}$.",
    evaluationCriteria:
      "- **Visual Inspection**: Path termination diagram clearly traces Primary Ray $\\to$ Secondary Bounce $\\to$ Cache Query cutoff, coupled with the green dashed self-training gradient feedback loop, multi-resolution 3D hash grid, and fused $64 \\times 64$ MLP layers. - **Automated Metrics**: Parameter count matches $64 \\times 64 \\times 4 + 64 \\times 3 = 16576$ weights; relative loss gradient magnitude remains bounded ($\\le 1.0$) as $L_{\\text{target}} \\to \\infty$.",
  },
  "VFX-SYS-08": {
    coreKey: "Multiview Light Field Display Slanted Lenticular Array Ray Steering & Subpixel Angular Disparity Slicing",
    groundTruth:
      "1. **van Berkel Slanted Lenticular Geometry**: Square pixel ($p \\times p$) with RGB subpixels of width $p_h = p/3$ and height $p_v = p$; golden slant angle $\\tan\\theta = p_h / p_v = 1/3 \\implies \\theta \\approx 18.4349^\\circ$ and lenticular pitch $P_L = \\frac{N}{3}p\\cos\\theta$ for $N$ views ($N=8$). 2. **Subpixel View Index Mapping**: $k = \\text{floor}(x + 3y\\tan\\theta + \\phi_0) \\pmod N = \\text{floor}(x + y + \\phi_0) \\pmod N$. 3. **Snell Refraction Steering**: Cylindrical lens radius $R$, index $n_{glass} \\approx 1.491$ (PMMA), paraxial focal thickness $t = R/(n_{glass}-1)$, exit angle $\\sin\\alpha = n_{glass}\\sin(\\beta - \\gamma)$ where $\\beta = \\arcsin(x_s/R)$.",
    evaluationCriteria:
      "- **Visual Inspection**: RGB subpixel matrix overlaid with cylindrical micro-lenses steers rays into an 8-view angular fan where slanted subpixels map uniformly across viewing zones without ray crossovers or dead zones. - **Automated Metrics**: Subpixel view-index distribution achieves maximum entropy (each view occupies exactly $1/N$ of the array); refracted ray steering angles satisfy Snell's law within $\\le 10^{-5}$.",
  },
  "VFX-SYS-09": {
    coreKey: "SMPTE ST 2084 (Perceptual Quantizer / PQ) EOTF Non-Linear Log-Power Response & Barten CSF Luminance Ladder",
    groundTruth:
      "1. **SMPTE ST 2084 EOTF & Inverse EOTF**: Code value $E' \\in [0, 1]$ maps to luminance $L = 10000 \\cdot \\left(\\frac{\\max(E'^{1/m_2} - c_1, 0)}{c_2 - c_3 E'^{1/m_2}}\\right)^{1/m_1}\\text{ cd/m}^2$ and $E' = \\left(\\frac{c_1 + c_2 Y^{m_1}}{1 + c_3 Y^{m_1}}\\right)^{m_2}$ ($Y = L/10000$), with exact rational constants $m_1 = \\frac{2610}{16384} = 0.1593017578125$, $m_2 = \\frac{2523}{32} = 78.84375$, $c_1 = \\frac{107}{128} = 0.8359375$, $c_2 = \\frac{2413}{128} = 18.8515625$, $c_3 = \\frac{299}{16} = 18.6875$. 2. **Anchor Landmarks & Barten CSF**: $100\\text{ nits} \\to E'=0.508078$ (10-bit 520), $1000\\text{ nits} \\to E'=0.751827$ (10-bit 769), $10000\\text{ nits} \\to E'=1.0$ (10-bit 1023), keeping 10-bit step $\\Delta L/L \\in [0.5\\%, 0.9\\%]$ below the Barten JND threshold.",
    evaluationCriteria:
      "- **Visual Inspection**: Log-log plot contrasts the smooth S-shaped cyan ST 2084 curve up to $10000\\text{ nits}$ against the steep red dashed Rec.709 curve clipping at $100\\text{ nits}$, alongside the gray Barten JND envelope and 10-bit/12-bit quantization step ladders. - **Automated Metrics**: Plotted coordinates at $100, 1000, 10000\\text{ nits}$ match analytical EOTF values within $\\le 10^{-6}$, and displayed constants match exact SMPTE ST 2084 rational fractions.",
  },
  "VFX-SYS-10": {
    coreKey: "Temporal Anti-Aliasing (TAA/TSR) Halton(2,3) Subpixel Jitter & YCoCg History Variance Clipping",
    groundTruth:
      "1. **Halton(2, 3) Subpixel Jitter Sequence (8-Phase Reference)**: Radical inverse $(\\Delta x, \\Delta y) = (\\phi_2(n)-0.5, \\phi_3(n)-0.5)$: Frame 1 $(0.0, -0.166667)$, Frame 2 $(-0.25, +0.166667)$, Frame 3 $(+0.25, -0.388889)$, Frame 4 $(-0.375, -0.055556)$, Frame 5 $(+0.125, +0.277778)$, Frame 6 $(-0.125, -0.277778)$, Frame 7 $(+0.375, +0.055556)$, Frame 8 $(-0.4375, +0.388889)$. 2. **YCoCg Transform & Variance Clipping AABB**: $3 \\times 3$ neighborhood moments $m_1 = \\sum_{k=1}^9 C_k, m_2 = \\sum_{k=1}^9 C_k^2$ define $\\mu = m_1/9, \\sigma = \\sqrt{\\max(m_2/9 - \\mu^2, 0)}$ and AABB $[C_{min}, C_{max}] = [\\mu - \\gamma\\sigma, \\mu + \\gamma\\sigma]$ ($\\gamma = 1.0$–$1.25$), clipping $C_{hist}$ along ray $C_{hist} \\to \\mu$ before EMA blend $C_{output} = \\alpha C_{current} + (1-\\alpha)C_{clamped}$ ($\\alpha \\approx 0.05$–$0.1$).",
    evaluationCriteria:
      "- **Visual Inspection**: Left pixel grid shows yellow sampling points cycling uniformly through the 8-point Halton(2,3) subpixel pattern; right YCoCg space shows the dynamic $\\mu \\pm \\gamma\\sigma$ variance box clipping out-of-bounds red history samples along the ray toward $\\mu$ to eliminate ghosting. - **Automated Metrics**: 8-frame Halton coordinate error $\\le 10^{-6}$; forward/inverse YCoCg matrices multiply to $I_3$; clipped history samples lie strictly within $[C_{min}, C_{max}]$.",
  },
};
