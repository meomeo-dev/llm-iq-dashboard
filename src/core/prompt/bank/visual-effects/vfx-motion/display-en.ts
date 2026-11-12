import type { LocalizedStandardEntry } from "../../../types";

export const VFX_MOTION_LABELS_EN: Readonly<Record<string, string>> = {
  "vfx-motion-v1": "VFX-5: Physics-Driven Character & Biomechanics CFX (10-Prompt Suite)",
};

export const VFX_MOTION_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "vfx-motion-v1": {
    coreKey: "SLIP Running Limit Cycles, Hill-Type Muscle Mechanics & Anatomical Soft-Tissue CFX",
    groundTruth:
      "Grounded in Spring-Loaded Inverted Pendulum (SLIP) phase portraits, Hill-type 3-element musculotendon force-velocity curves, Stable Neo-Hookean volume-preserving muscle bulging with fascia sliding, Hildebrand Froude-number quadrupedal gait transitions, and Lighthill carangiform reverse-Kármán vortex propulsion.",
    evaluationCriteria:
      "1. Dynamical periodicity: Limit-cycle phase trajectories close smoothly, and Instantaneous Capture Point (ICP) stepping remains inside friction-cone constraints; 2. Biomechanical deformation: Volume-preserving muscle cross-sections, discrete elastic rod plectoneme writhing (Lk=Tw+Wr), and soft-finger limit ellipsoids are accurate; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "VFX-MOTION-01": {
    coreKey: "Spring-Loaded Inverted Pendulum (SLIP) Running Limit Cycle & Phase Portrait",
    groundTruth:
      "1. **Stance-Phase Nonlinear ODEs (Polar $(r, \\theta)$ about foot contact)**: $m\\ddot{r} = m r \\dot{\\theta}^2 + k(\\ell_0 - r) - mg\\sin\\theta$ and $m r^2 \\ddot{\\theta} + 2m r \\dot{r}\\dot{\\theta} - mg r \\cos\\theta = 0$. 2. **Flight-Phase Ballistic Parabola**: $\\ddot{x} = 0, \\ddot{z} = -g$. 3. **Canonical Parameters**: $m = 80\\,\\text{kg}$, $g = 9.81\\,\\text{m/s}^2$, $\\ell_0 = 1.0\\,\\text{m}$, $k = 20\\,\\text{kN/m}$ ($\\tilde{k} \\approx 25.48$), $\\theta_{td} = 68.5^\\circ$, $v_{apex} = 4.0\\,\\text{m/s}$, $z_{apex} = 1.05\\,\\text{m}$, $T_{stride} \\approx 0.385\\,\\text{s}$, $\\Delta r_{\\max} \\approx 0.162\\,\\text{m}$, energy conservation $|E(t)-E_0|/E_0 < 0.5\\%$.",
    evaluationCriteria:
      "- **Visual Inspection**: Left view shows spring compression color shift (relaxed blue to compressed red) during stance and smooth velocity vector reversal; right phase plane $(z - \\ell_0, \\dot{z})$ shows a closed cyan limit cycle with $C^1$-smooth stance-flight transitions. - **Automated Metrics**: Phase-plane closure residual $\\|\\mathbf{x}(T) - \\mathbf{x}(0)\\| / \\ell_0 < 0.008$ ($< 0.8\\%$); vertical peak-to-trough ratio $z_{\\max} / z_{\\min} \\in [1.24, 1.28]$; duty factor $\\beta = T_{stance}/T_{stride} = 0.39 \\pm 0.02$.",
  },
  "VFX-MOTION-02": {
    coreKey: "Hill-Type Musculotendon Tension-Length-Velocity Manifold",
    groundTruth:
      "1. **Musculotendon Equilibrium**: $F_{MT} = F_T = F_M \\cos\\alpha$, $F_M = F_{CE} + F_{PEE} = [a(t) f_L(\\tilde{l}_{CE}) f_V(\\tilde{v}_{CE}) + f_{PE}(\\tilde{l}_{CE})] F_0^M$ with $\\tilde{l}_{CE} = l_{CE}/l_0^M$, $\\tilde{v}_{CE} = v_{CE}/v_{\\max}$, $a(t) \\in [0, 1]$, and pennation angle $\\alpha$. 2. **Force-Length & Force-Velocity Laws**: Active Gaussian $f_L(\\tilde{l}_{CE}) = \\exp(-(\\tilde{l}_{CE} - 1)^2/\\gamma)$ ($\\gamma = 0.45$); concentric ($\\tilde{v}_{CE} \\le 0$) $f_V = \\frac{1 + \\tilde{v}_{CE}}{1 - \\tilde{v}_{CE}/k_c}$ ($k_c \\approx 0.25$); eccentric ($\\tilde{v}_{CE} > 0$) $f_V = \\frac{f_{max}\\tilde{v}_{CE} + c_e}{\\tilde{v}_{CE} + c_e}$ ($f_{max} = 1.4, c_e \\approx 0.05$); exponential passive $f_{PE}(\\tilde{l}_{CE})$ for $\\tilde{l}_{CE} > 1$.",
    evaluationCriteria:
      "- **Visual Inspection**: Clear schematic of CE, SEE, and PEE topology plus three biomechanical curves: (1) active force peaks at $1.0$ when $\\tilde{l}_{CE}=1.0$; (2) eccentric plateau approaches $1.4 F_0^M$ while concentric force hits $0$ at $-1.0 v_{\\max}$; (3) series tendon strain shows a toe-to-linear transition above $4\\%$. - **Automated Metrics**: Active force peak at $\\tilde{l}_{CE}^* = 1.00 \\pm 0.01$; eccentric asymptote $\\lim_{\\tilde{v} \\to \\infty} f_V / f_V(0) = 1.40 \\pm 0.03$; $C^1$ tangent continuity across $\\tilde{v}_{CE} = 0$.",
  },
  "VFX-MOTION-03": {
    coreKey: "Tissue-CFX: Fascia-Muscle Sliding & Bicep Bulging FEM",
    groundTruth:
      "1. **Stable Neo-Hookean Hyperelasticity (Smith et al., SIGGRAPH 2018)**: $\\Psi_{\\text{SNH}}(\\mathbf{F}) = \\frac{\\mu}{2}(I_1 - 3) - \\mu(J - 1) + \\frac{\\lambda + \\mu}{2}(J - 1)^2$ with $\\mathbf{F} = \\partial \\mathbf{x}/\\partial \\mathbf{X}$, $J = \\det(\\mathbf{F})$, $I_1 = \\mathrm{tr}(\\mathbf{F}^T\\mathbf{F})$. 2. **Active Fiber First Piola-Kirchhoff Stress**: $\\mathbf{P}_{\\text{total}} = \\partial \\Psi_{\\text{SNH}}/\\partial \\mathbf{F} + \\sigma_{act}(t)(\\mathbf{F}\\mathbf{a}_0 \\otimes \\mathbf{a}_0)$. 3. **Fascia Sliding & Incompressibility ($J \\approx 1$)**: Frictionless tangential sliding ($g_n \\ge 0, \\lambda_n \\ge 0, g_n\\lambda_n = 0, \\mathbf{f}_{\\text{tangential}} = \\mathbf{0}$); at axial shortening $\\lambda_z = 0.70$, radial expansion reaches $\\lambda_x = \\lambda_y = 1/\\sqrt{0.70} \\approx 1.195$ ($+19.5\\%$).",
    evaluationCriteria:
      "- **Visual Inspection**: During elbow flexion, the bicep belly bulges into a full saddle profile pushing outward against the sliding fascia while remaining anchored at tendon insertions, with fiber redness intensifying with $\\sigma_{act}$. - **Automated Metrics**: Cross-sectional area conservation $|\\Delta A|/A_0 < 1.5\\%$; transverse width ratio $1.19 \\pm 0.02$ at $30\\%$ axial shortening; tangential fascia-muscle slip $\\Delta u_\\tau \\ge 0.12 L_{bicep}$.",
  },
  "VFX-MOTION-04": {
    coreKey: "Avian Feather CFX: Barbule Interlocking & Anisotropic Aero-Torsion",
    groundTruth:
      "1. **Strongly Anisotropic Orthotropic Shell Energy (Jouve et al., SIGGRAPH 2024)**: $W(\\mathbf{E}) = \\frac{1}{2} E_{11} C_{1111} E_{11} + \\frac{1}{2} E_{22} C_{2222} E_{22} + 2 E_{12} C_{1212} E_{12}$ with longitudinal-to-transverse stiffness ratio $C_{1111} / C_{2222} \\sim 10^4$. 2. **Asymmetric Micro-Hooklet Contact**: $F_{\\text{slip}}(\\Delta x) = \\mu_0 N + k_{\\text{hook}}\\Delta x$ under separation (interlocked hooklets) vs. $\\mu_{\\text{low}} N$ under reverse re-zipping. 3. **Aero-Bending-Torsion Coupling**: $EI_y w'' = M_y(s)$ and $GJ \\theta' = T_{\\text{aero}}(s)$ with aerodynamic offset $e(s) \\approx 0.25 c(s)$ inducing washout twist.",
    evaluationCriteria:
      "- **Visual Inspection**: Micro-inset depicts rachis, barbs, and distal hooklets engaging adjacent barbule flanges; macro-view shows aerodynamic washout twist-down ($\\Delta \\theta \\approx -8^\\circ$ to $-12^\\circ$) and directional vane interlocking. - **Automated Metrics**: Hooklet inclination angle $\\alpha_{\\text{hook}} \\in [40^\\circ, 50^\\circ]$; tip bending-to-torsion ratio $w(L)/\\theta(L) \\in [0.15\\,\\text{m/rad}, 0.22\\,\\text{m/rad}]$; stiffness anisotropy annotations $\\ge 10^3$.",
  },
  "VFX-MOTION-05": {
    coreKey: "Mammalian Quadruped Gait Phase Transitions across Froude Spectrum",
    groundTruth:
      "1. **Dimensionless Froude Number**: $Fr = \\frac{v^2}{g L_{\\text{leg}}}$ ($g = 9.81\\,\\text{m/s}^2$, reference $L_{\\text{leg}} = 0.8\\,\\text{m}$). 2. **Hildebrand Gait Regimes**: **Walk** ($Fr < 0.5, v < 2.0\\,\\text{m/s}$): duty factor $\\beta > 0.5$ ($0.65$), phase lag $\\phi_{lh-lf} = 0.25$, inverted pendulum out-of-phase energy exchange; **Trot** ($0.5 < Fr < 2.0, 2.0 \\le v \\le 4.0\\,\\text{m/s}$): $\\beta \\approx 0.40$–$0.50$, diagonal synchronization $\\phi(LF)=\\phi(RH), \\phi(RF)=\\phi(LH)$ ($\\Delta \\phi = 0.50$); **Gallop** ($Fr > 2.5, v > 4.5\\,\\text{m/s}$): $\\beta < 0.35$ ($0.22$), asymmetric footfalls with gathered/extended flight suspensions ($S_i(t) \\in \\{0, 1\\}$).",
    evaluationCriteria:
      "- **Visual Inspection**: Hildebrand gait diagram with four footfall bars (LF, RF, LH, RH) transitions across $Fr = 0.2 \\to 1.0 \\to 3.0$ from staggered Walk to diagonal-paired Trot to asymmetric Gallop with two full-flight suspension gaps. - **Automated Metrics**: Trot diagonal phase difference $|\\phi_{LF} - \\phi_{RH}| < 0.02$; Gallop full-aerial suspension fraction ($\\sum S_i = 0$) $> 15\\%$; critical transition markers at $Fr = 0.5 \\pm 0.05$ and $Fr = 2.2 \\pm 0.2$.",
  },
  "VFX-MOTION-06": {
    coreKey: "Discrete Elastic Rods: Hair Strand Superhelical Buckling & Plectoneme Formation",
    groundTruth:
      "1. **Discrete Elastic Rods (DER) Kinematics (Bergou et al., 2008)**: Centerline vertices $\\mathbf{x}_0, \\dots, \\mathbf{x}_N$, edges $\\mathbf{e}^i = \\mathbf{x}_{i+1} - \\mathbf{x}_i$, twist-free Bishop frame $\\{\\mathbf{u}^i, \\mathbf{v}^i, \\mathbf{t}^i\\}$, material frame $\\mathbf{m}_1^i = \\cos\\theta^i \\mathbf{u}^i + \\sin\\theta^i \\mathbf{v}^i$. 2. **Elastic Energy & Topology**: $E_{\\text{total}} = \\frac{1}{2}\\sum \\frac{\\alpha(\\kappa_k - \\kappa_k^0)^2}{\\bar{l}_k} + \\frac{1}{2}\\sum \\frac{\\beta(\\Delta m_k)^2}{\\bar{l}_k}$; Calugareanu-White-Fuller theorem $Lk = Tw + Wr$. 3. **Michell Buckling Criterion**: Under tension $T$, buckling occurs at critical torque $\\tau_c = 2\\sqrt{\\alpha T}$, forming a plectoneme of loop radius $R_{\\text{loop}} \\approx \\sqrt{\\alpha/(2T)}$.",
    evaluationCriteria:
      "- **Visual Inspection**: Twisted elastic rod with zebra-stripe twist markers undergoes sudden midpoint snap-buckling once torque exceeds $\\tau_c$, converting twist $Tw$ into superhelical writhe $Wr$ to form a self-contacting plectoneme loop as end-to-end length contracts. - **Automated Metrics**: Topological invariant $|Lk - (Tw + Wr)| < 0.005$; critical buckling torque error $|\\tau - 2\\sqrt{\\alpha T}| / \\tau_c < 3\\%$; self-contact centerline clearance $\\ge 2r_{\\text{hair}}$.",
  },
  "VFX-MOTION-07": {
    coreKey: "Boids/Vicsek Flocking: Polarization Phase Transition & Streamline Bifurcation",
    groundTruth:
      "1. **Topological $k$-NN Flocking Dynamics**: $\\mathbf{x}_i(t + \\Delta t) = \\mathbf{x}_i(t) + \\mathbf{v}_i(t)\\Delta t$, $\\theta_i(t + \\Delta t) = \\operatorname{Arg}(\\sum_{j \\in \\mathcal{N}_k(i)} \\mathbf{v}_j(t) + \\mathbf{F}_{\\text{repel}}(i)) + \\eta \\xi_i(t)$ ($k = 7$ topological neighbors, noise $\\xi_i \\in [-\\pi, \\pi]$). 2. **Reynolds Steering & Polarization Order Parameter**: $\\varphi(t) = \\frac{1}{N v_0}\\|\\sum_{i=1}^N \\mathbf{v}_i(t)\\| \\in [0, 1]$ transitions from disordered gas ($\\eta > \\eta_c, \\varphi \\approx 1/\\sqrt{N} \\ll 1$) to ordered flock ($\\eta < \\eta_c, \\varphi \\to 1$). 3. **Obstacle Potential Flow**: $\\mathbf{v}_{\\text{mod}} = \\mathbf{v}_\\infty - \\frac{R^2}{r^2}[2(\\mathbf{v}_\\infty \\cdot \\hat{\\mathbf{r}})\\hat{\\mathbf{r}} - \\mathbf{v}_\\infty]$.",
    evaluationCriteria:
      "- **Visual Inspection**: Left curve shows step phase transition of $\\varphi(t)$ from $0.05$ to $> 0.92$; right particle field shows boids aligning into a coherent stream, bifurcating smoothly around the radius-$R$ cylindrical obstacle, and re-merging within $2R$ downstream without stagnation-point trapping. - **Automated Metrics**: Low-noise steady polarization $\\varphi_{\\text{steady}} \\ge 0.88$; minimum inter-agent distance $\\min_{i \\ne j}\\|\\mathbf{x}_i - \\mathbf{x}_j\\| \\ge d_{\\text{safe}}$; wake healing distance $L_{\\text{heal}} \\le 2.5 R_{\\text{obs}}$ for $\\varphi_{\\text{local}} > 0.8$.",
  },
  "VFX-MOTION-08": {
    coreKey: "Quadruped Rough Terrain GRF Friction Pyramid & Capture Point Recovery",
    groundTruth:
      "1. **3D CoM Divergent Dynamics & Instantaneous Capture Point (ICP, Pratt et al. 2006)**: $\\ddot{\\mathbf{x}}_{\\text{CoM}} = \\omega_0^2(\\mathbf{x}_{\\text{CoM}} - \\mathbf{p}_{\\text{CoP}})$ with $\\omega_0 = \\sqrt{g/z_0}$ and capture point $\\mathbf{\\xi} = \\mathbf{x}_{\\text{CoM}} + \\dot{\\mathbf{x}}_{\\text{CoM}}/\\omega_0$. 2. **Linearized Friction Pyramid**: At inclined contact frame $\\{\\mathbf{n}_i, \\mathbf{t}_{1i}, \\mathbf{t}_{2i}\\}$, ground reaction force $\\mathbf{f}_i$ satisfies $f_{i,n} \\ge 0$ and $|f_{i,t1}|, |f_{i,t2}| \\le \\frac{\\mu}{\\sqrt{2}} f_{i,n}$. 3. **Support Polygon Criterion**: Equivalent CoP remains strictly inside the convex hull $\\mathcal{CH}(\\{\\mathbf{p}_1, \\dots, \\mathbf{p}_4\\})$ with signed margin $d_{\\text{margin}} > 0$.",
    evaluationCriteria:
      "- **Visual Inspection**: Translucent cyan friction pyramids rendered at each foot contact with red GRF vectors strictly inside the cones; under external push impulse, the projected Capture Point $\\mathbf{\\xi}$ crosshair lands inside the planned recovery foothold polygon. - **Automated Metrics**: Zero friction-cone violation $\\max(|f_{t1}|/f_n, |f_{t2}|/f_n) \\le \\mu/\\sqrt{2}$; ICP coordinate residual $\\|\\mathbf{\\xi} - (\\mathbf{x} + \\dot{\\mathbf{x}}\\sqrt{z_0/g})\\|/L_{\\text{leg}} < 0.005$; CoP convex-hull margin $d \\ge 0.03\\,\\text{m}$.",
  },
  "VFX-MOTION-09": {
    coreKey: "Carangiform Undulation & Reverse von Karman Vortex Street Propulsion",
    groundTruth:
      "1. **Lighthill Elongated-Body Travelling Wave**: $y(x, t) = a(x)\\sin(k x - \\omega t)$ with quadratic amplitude envelope $a(x) = c_0 + c_1(x/L) + c_2(x/L)^2$ ($c_0 = 0.02 L, c_1 = -0.08 L, c_2 = 0.16 L, \\lambda \\approx 0.95 L$). 2. **Strouhal Number & Mean Thrust**: $St = \\frac{f A_{\\text{tail}}}{U_\\infty} \\in [0.25, 0.35]$; positive mean thrust $\\bar{T} = \\frac{1}{2}m_a[\\overline{(\\partial_t y)^2} - U_\\infty^2 \\overline{(\\partial_x y)^2}]_{x=L} > 0$ when wave speed $c = \\omega/k > U_\\infty$. 3. **Reverse von Karman Wake**: Clockwise upper vortices ($-\\Gamma$) and counterclockwise lower vortices ($+\\Gamma$) induce a rearward thrust jet ($u_{\\text{induced}} > 0$).",
    evaluationCriteria:
      "- **Visual Inspection**: Flexible sinusoidal spine with small head yaw and large caudal oscillation sheds alternating vortices at tail-beat extrema (upper clockwise, lower counterclockwise) with a strong rearward-pointing cyan jet velocity profile along the wake centerline. - **Automated Metrics**: Envelope monotonicity $da/dx > 0$ for $x > 0.5 L$; Strouhal number $St = f A / U = 0.28 \\pm 0.03$; streamwise vortex spacing ratio $\\Delta x_{\\text{vortex}} / \\lambda_{\\text{wave}} \\in [0.85, 1.05]$.",
  },
  "VFX-MOTION-10": {
    coreKey: "Dexterous Manipulation Soft-Finger Limit Surface & Slip Bifurcation",
    groundTruth:
      "1. **Howe-Cutkosky Ellipsoidal Limit Surface**: $\\Phi(\\mathbf{w}_c) = \\frac{f_x^2 + f_y^2}{f_{\\max}^2} + \\frac{m_z^2}{m_{\\max}^2} \\le 1$ for contact wrench $\\mathbf{w}_c = [f_x, f_y, m_z]^T$, where $f_{\\max} = \\mu f_n$ and $m_{\\max} = c_m \\mu f_n r_c$ ($c_m \\approx \\frac{3\\pi}{16} \\approx 0.589$ for Hertzian pressure $\\sigma_n(r) = \\sigma_0\\sqrt{1 - (r/r_c)^2}$). 2. **Associated Flow Rule**: At $\\Phi(\\mathbf{w}_c) = 1$, slip twist $\\mathbf{v}_{\\text{slip}} = [v_x, v_y, \\omega_z]^T = \\dot{\\lambda}\\nabla_{\\mathbf{w}_c}\\Phi(\\mathbf{w}_c)$ ($\\dot{\\lambda} \\ge 0$). 3. **Stick-Slip Core Contraction**: Stick radius obeys $r_a / r_c = (1 - f_t / (\\mu f_n))^{1/3}$.",
    evaluationCriteria:
      "- **Visual Inspection**: Right wrench-space plot renders the 3D limit ellipsoid ($f_x, f_y, m_z$) with outward normal slip twist vector $\\mathbf{v}_{\\text{slip}}$ at the boundary $\\Phi=1$; left circular contact patch shows the outer pink slip annulus surrounding the inner blue stick core. - **Automated Metrics**: Ellipsoid axis ratio $(m_{\\max}/r_c)/f_{\\max} = c_m = 0.59 \\pm 0.02$; normal flow alignment error $< 1.5^\\circ$ ($|\\mathbf{v}_{\\text{slip}} \\times \\nabla \\Phi| \\approx 0$); stick-core ratio $r_a/r_c = (0.5)^{1/3} \\approx 0.793 \\pm 0.015$ at $f_t = 0.5\\mu f_n$.",
  },
};
