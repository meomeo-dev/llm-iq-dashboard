/**
 * English PromptStandard definitions for the 30 VFX candidate standards in Part 2:
 * VFX-SCIVIS-01..10, VFX-MOTION-01..10, and VFX-SYS-01..10.
 */

import type { LocalizedStandardEntry } from "./standards-single-en";

export const STANDARDS_VFX_PART2_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "VFX-SCIVIS-01": {
    coreKey: "Unsteady Double-Gyre FTLE Transport Barrier Ridges and Lagrangian Coherent Structures (LCS)",
    groundTruth:
      "1. **Flow Domain & Analytical Velocity Field**: Domain $\\Omega = [0, 2] \\times [0, 1]$, streamfunction $\\psi(x, y, t) = A \\sin(\\pi f(x, t)) \\sin(\\pi y)$ with $f(x, t) = a(t) x^2 + b(t) x$, $a(t) = \\epsilon \\sin(\\omega t)$, $b(t) = 1 - 2\\epsilon \\sin(\\omega t)$, $u = -\\pi A \\sin(\\pi f)\\cos(\\pi y)$, $v = \\pi A \\cos(\\pi f)\\sin(\\pi y)(2a(t)x + b(t))$. 2. **Parameters**: $A = 0.1$, $\\epsilon = 0.25$, $\\omega = 0.2\\pi$ ($T_{period} = 10\\text{ s}$), integration $T = \\pm 15\\text{ s}$ yielding repelling/attracting LCS ridges ($\\sigma_{t_0}^T \\ge 0.35$) intersecting at central lobes.",
    evaluationCriteria:
      "- **Topological Invariants**: Primary vortex cores symmetric near $x \\approx 0.5$ and $x \\approx 1.5$; central saddle manifold spans $y=0$ to $y=1$. - **Ridge Geometry Tolerance**: Repelling ridge intercept error at $y=0.5$ satisfies $\\Delta x \\le \\pm 0.03$. - **Colormap & Scale**: Continuous Viridis/Turbo scale from $0$ (deep purple/blue) to $0.45$ (bright yellow) with crisp ridges ($\\|\\nabla \\sigma\\| > 1.5$). - **Tracer Kinematics**: Tracer advection synchronized with $\\omega = 0.2\\pi$, diverging across repelling ridges.",
  },
  "VFX-SCIVIS-02": {
    coreKey: "2D Scalar Morse-Smale Complex Critical Point Watershed Topology and Persistence Simplification",
    groundTruth:
      "1. **Analytical Scalar Field**: Domain $(x, y) \\in [-2.5, 2.5]^2$, potential $f(x, y) = 1.2 e^{-((x-1)^2 + y^2)} + 1.5 e^{-((x+1)^2 + y^2)} + 1.0 e^{-(x^2 + (y-1.2)^2)} - 0.7 e^{-(x^2 + y^2)/0.6} - 0.08(x^2 + y^2)$. 2. **Critical Points (Hessian Classification)**: 3 maxima $M_1(1.08, 0.00)$ [$f \\approx 1.04$], $M_2(-1.08, 0.00)$ [$f \\approx 1.35$], $M_3(0.00, 1.25)$ [$f \\approx 0.92$]; 1 central minimum $m_0(0.00, 0.00)$ [$f \\approx -0.68$]; 3 saddles $S_{12}(0.00, -0.42)$, $S_{13}(0.62, 0.71)$, $S_{23}(-0.62, 0.71)$ satisfying $\\chi = 1 - 3 + 3 = 1$ and partitioning into 6 Morse-Smale 2-cells.",
    evaluationCriteria:
      "- **Critical Point Localization**: All 7 critical points placed within Euclidean error $L_2 \\le 0.05$ pixel equivalents. - **Morse-Smale Graph Topology**: Saddle $S_{13}$ emits exactly 2 ascending separatrices to $M_1, M_3$ and 2 descending separatrices to $m_0$ and the outer boundary with zero non-physical crossings. - **2-Cell Shading**: Each quadrangular 2-cell shaded by its $(m_j, M_i)$ pair with boundary stroke width encoding persistence lifetime $\\Delta f$.",
  },
  "VFX-SCIVIS-03": {
    coreKey: "2D Symmetric Tensor Field Topology: Trisector/Wedge Degenerate Points and Hyperstreamline Separatrices",
    groundTruth:
      "1. **Traceless Symmetric Tensor Field**: Domain $(x, y) \\in [-1.5, 1.5]^2$, $T(x, y) = \\begin{pmatrix} f(x, y) & g(x, y) \\\\ g(x, y) & -f(x, y) \\end{pmatrix}$ with $f(x, y) = x^2 - y^2 - d^2$, $g(x, y) = 2xy - c$, $d = 0.6, c = 0$, degenerate condition $\\Delta \\lambda = 2\\sqrt{f^2 + g^2} = 0$ at $P_{1,2}(\\pm 0.6, 0)$. 2. **Delmarcelle-Hesselink Classification**: Jacobian $\\delta > 0$ yields a **Wedge Point** ($I = +1/2$); $\\delta < 0$ yields a **Trisector Point** ($I = -1/2$) with 3 separatrices spaced by $120^\\circ$; eigenvector angle $\\theta = \\frac{1}{2}\\operatorname{atan2}(g, f)$.",
    evaluationCriteria:
      "- **Poincare Index Invariant**: Closed loop integral around $P_1$ and $P_2$ satisfies $\\oint d\\theta = \\pi (+1/2)$ or $2\\pi$. - **Trisector 3-Fold Symmetry**: Trisector singularities display distinct 3-sector geometry with separatrix departure angle error $\\le \\pm 5^\\circ$. - **Bi-Orthogonal Hyperstreamline Mesh**: Major (tensile, red) and minor (compressive, blue) eigenvector trajectories intersect strictly at $90^\\circ$ at all non-degenerate points.",
  },
  "VFX-SCIVIS-04": {
    coreKey: "Supersonic Underexpanded Jet Shock Diamonds, Mach Disks, and Prandtl-Meyer Expansion Fans",
    groundTruth:
      "1. **Nozzle Flow Parameters**: Specific heat ratio $\\gamma = 1.4$ (air), exit diameter $D = 1.0$, exit Mach $M_e = 1.5$, fully expanded jet Mach $M_j = 2.0$, Mach angle $\\mu = \\arcsin(1/M_j) = 30^\\circ$. 2. **Pack (1950) Shock Cell Wavelength**: $L_s = \\frac{\\pi D \\sqrt{M_j^2 - 1}}{\\mu_1} \\approx \\frac{3.14159 \\times 1.0 \\times \\sqrt{3}}{2.40483} \\approx 2.262 D$ where $\\mu_1 \\approx 2.4048$ is the first root of $J_0(x)$. 3. **Shock Topology**: Lip Prandtl-Meyer expansion fans ($x=0, y=\\pm 0.5$), free-jet compression reflection, normal Mach disk at $x \\approx 0.67 D \\sqrt{P_0/P_a}$, and triple-point slipstreams.",
    evaluationCriteria:
      "- **Shock Cell Periodicity Error**: Spacing across the first 3 shock diamond intersections $x_1, x_2, x_3$ matches theoretical $L_s$ within $|\\Delta L_s| / L_s \\le 3.5\\%$. - **Oblique Shock Envelope Angle**: Reflected oblique shock angle matches Rankine-Hugoniot shock polar solution $\\beta \\approx 42^\\circ \\pm 1.5^\\circ$. - **Slipstream & Shear Divergence**: Initial jet boundary deflection angle at the nozzle exit matches Prandtl-Meyer expansion angle $\\theta \\approx 10.2^\\circ$.",
  },
  "VFX-SCIVIS-05": {
    coreKey: "Solar Flare Magnetic Reconnection: Petschek/Sweet-Parker X-point Tearing and Alfvenic Exhaust Jets",
    groundTruth:
      "1. **Magnetic Flux Function $\\Psi(x, z)$**: Outflow along $x$, inflow along $z$; Harris current sheet with tearing perturbation $\\Psi(x, z) = B_0 \\delta \\ln[\\cosh(z/\\delta)] + \\epsilon B_0 \\cos(k x) e^{-z^2 / (2 \\delta^2)}$ with $B_x = \\partial_z \\Psi$ and $B_z = -\\partial_x \\Psi$. 2. **X-Point Null & Separatrices**: Magnetic null $\\|\\mathbf{B}\\| = 0$ at $(x, z) = (\\pi/k, 0)$; separatrix $\\Psi = -\\epsilon B_0$ divides space into 4 flux domains bounded by 4 Petschek slow-mode shocks accelerating exhaust jets to Alfven speed $v_{out} \\approx v_A = B_0 / \\sqrt{\\mu_0 \\rho}$.",
    evaluationCriteria:
      "- **Separatrix Asymptotic Opening Angle**: Separatrix opening angle at the X-point reflects fast Petschek reconnection rate $\\tan\\theta \\sim R_{rec} \\approx 0.1 \\pm 0.02$. - **Dynamic Field-Line Reconnection (SMIL)**: Field lines/particles advect inward from top/bottom at $v_{in} \\sim 0.1 v_A$, reconnect at the X-point, and eject horizontally at $v_{out} \\sim 1.0 v_A$ (10:1 speed ratio). - **Current Density Peak Concentricity**: Out-of-plane current peak $j_y = -\\nabla^2 \\Psi$ coincides with the X-point with $z$-direction FWHM $\\le 2\\delta$.",
  },
  "VFX-SCIVIS-06": {
    coreKey: "Ferrofluid Rosensweig Normal-Field Instability and Conical Hexagonal Spike Lattice Formation",
    groundTruth:
      "1. **Critical Dispersion Relation**: Density difference $\\Delta \\rho = \\rho_{fluid} - \\rho_{air}$, surface tension $\\sigma$, gravity $g$, capillary length $l_c = \\sqrt{\\sigma / (\\Delta \\rho g)}$; Cowley-Rosensweig critical wavenumber $k_c = 1/l_c = \\sqrt{\\Delta \\rho g / \\sigma}$ and wavelength $\\lambda_c = 2\\pi / k_c$. 2. **Hexagonal Surface Elevation $\\zeta(x, y)$**: Superposition of three $120^\\circ$ resonant wavevectors $\\mathbf{k}_1 + \\mathbf{k}_2 + \\mathbf{k}_3 = 0$: $\\zeta(x, y) = A_1 \\sum_{i=1}^3 \\cos(\\mathbf{k}_i \\cdot \\mathbf{r}) + A_2 \\sum_{i=1}^3 \\cos(2 \\mathbf{k}_i \\cdot \\mathbf{r})$ with lattice pitch $a = \\frac{2}{\\sqrt{3}}\\lambda_c$.",
    evaluationCriteria:
      "- **Six-Fold Rotational Symmetry**: 2D FFT or Delaunay triangulation of spike peaks exhibits a 6-fold symmetric hexagonal Brillouin zone with inter-peak angles of $60.0^\\circ \\pm 1.0^\\circ$. - **Spike Pitch Consistency**: Nearest-neighbor peak distance mean $\\bar{a}$ satisfies relative standard deviation $\\sigma_a / \\bar{a} \\le 2.0\\%$. - **Conical Tip Curvature Gradient**: Steep normal concentration as $r \\to 0$, with concentric circular tip contours transitioning smoothly into hexagonal bases.",
  },
  "VFX-SCIVIS-07": {
    coreKey: "3D Geomagnetic Dipole Field and Altitude-Stratified Two-Color Auroral Curtains (557.7nm / 630.0nm)",
    groundTruth:
      "1. **Dipole Field & McIlwain $L$-Shell**: In polar coordinates $(r, \\theta)$ ($r$: geocentric radius, $\\theta$: magnetic colatitude), $r(\\theta) = R_E L \\sin^2\\theta$ with $R_E \\approx 6371\\text{ km}$, $L \\in [5.6, 8.5]$ ($65^\\circ$–$70^\\circ$ auroral oval), and tangent dip angle $\\tan\\alpha = \\frac{1}{2}\\tan\\theta$. 2. **Chapman Forbidden-Transition Altitude Profile**: Lower green band (557.7 nm, $O(^1S) \\to O(^1D)$) peaks sharply at $z = 105$–$130\\text{ km}$ (FWHM $\\sim 25\\text{ km}$); upper red crown (630.0 nm, $O(^1D) \\to O(^3P)$, $\\tau \\approx 110\\text{ s}$, quenched by $N_2$ below $200\\text{ km}$) spans $z = 200$–$400\\text{ km}$ along Kelvin-Helmholtz folded rayed curtains $y(x) = Y_0 + A_c\\sin(k_c x) + B_c\\sin(3k_c x)$.",
    evaluationCriteria:
      "- **Altitude-Stratified Spectral Accuracy**: Vertical profile displays bright green (#00FF66 / #22EE44, 557.7 nm) at 100–150 km, transitions across 160–200 km, and grades into diffuse crimson/magenta (#CC1133 / #EE2244, 630.0 nm) above 220 km. - **Field-Aligned Ray Inclination Tolerance**: Auroral ray tilt matches analytical dipole inclination within $\\le \\pm 2.0^\\circ$. - **Curtain Fold Harmonics**: Rayed curtain folds exhibit self-similar secondary harmonic Kelvin-Helmholtz shear curls.",
  },
  "VFX-SCIVIS-08": {
    coreKey: "Trefoil Vortex Knot Dynamics, Biot-Savart Self-Advection, and Helicity Invariant Transfer",
    groundTruth:
      "1. **Standard $(3, 1)$ Trefoil Knot Parametric Centerline**: For $s \\in [0, 2\\pi)$ with $R_0 = 1.0, r_0 = 0.4$: $x(s) = (R_0 + r_0 \\cos(3 s)) \\cos(2 s)$, $y(s) = (R_0 + r_0 \\cos(3 s)) \\sin(2 s)$, $z(s) = -r_0 \\sin(3 s)$. 2. **Topological Helicity Conservation**: Circulation $\\Gamma$, total helicity $H = \\Gamma^2 (Wr(\\mathcal{C}) + Tw(\\mathcal{C}))$, Gauss writhe integral $Wr \\approx +2.016$ (right-handed trefoil $3_1$). 3. **Biot-Savart Local Induction Approximation (LIA)**: $\\mathbf{v}_{LIA}(s) \\approx \\frac{\\Gamma}{4\\pi} \\ln(L/\\sigma_{core}) \\kappa(s) \\mathbf{b}(s)$ along binormal $\\mathbf{b} = \\mathbf{t} \\times \\mathbf{n}$.",
    evaluationCriteria:
      "- **Knot Crossing Topology**: 3D projection clearly resolves all 3 over/under-crossings strictly obeying right-handed $3_1$ trefoil occlusion order without false intersections. - **Curvature & Binormal Shading**: Tube surface color encodes local curvature $\\kappa(s)$, contrasting high-curvature bends ($\\kappa \\approx 3.2$) against low-curvature segments ($\\kappa \\approx 0.8$). - **Cross-Section Orthogonality**: Circular/elliptical vortex tube cross-sections remain orthogonal to tangent $\\mathbf{t}(s)$ without non-physical pinching.",
  },
  "VFX-SCIVIS-09": {
    coreKey: "Arterial Bifurcation Wall Shear Stress (WSS) Topology Singularities and Helicity Density Evolution",
    groundTruth:
      "1. **Symmetric Y-Bifurcation Geometry**: Parent radius $R_0 = 1.0$, bifurcation half-angle $\\alpha = 35^\\circ$, daughter radius $R_1 = R_0 / \\sqrt{2} \\approx 0.707$ (Murray's law). 2. **Wall Shear Stress $\\mathbf{\\tau}_w$ Topology**: Stagnation saddle/nodal source at the bifurcation apex/carina $(x_{apex}, 0)$ where $\\mathbf{\\tau}_w = 0$; nodal sink and separation lines ($\\nabla \\cdot \\mathbf{\\tau}_w < 0$) along the outer sinus wall. 3. **Intraluminal Helicity Density**: $h_d = \\mathbf{u} \\cdot (\\nabla \\times \\mathbf{u})$ forms counter-rotating Dean vortex pairs with alternating $\\pm h_d$ tubes.",
    evaluationCriteria:
      "- **Poincare-Hopf Index Theorem**: Isolated critical points on the unfolded bifurcation wall satisfy $\\sum I_i = 1 - 2 = -1$. - **Carina Stagnation Saddle Alignment**: Saddle point aligns with the apex curvature maximum with $\\|\\mathbf{\\tau}_w\\| \\to 0$ positional error $\\le 0.02 R_0$. - **Low-WSS Separation Footprint**: Outer-wall low-WSS zone ($\\|\\mathbf{\\tau}_w\\| < 0.2 \\bar{\\tau}_0$) overlaps the recirculation vortex footprint with IoU $\\ge 90\\%$.",
  },
  "VFX-SCIVIS-10": {
    coreKey: "Type-II Superconductor Abrikosov Quantum Vortex Lattice and Phase Singularities",
    groundTruth:
      "1. **Ginzburg-Landau Complex Order Parameter**: $\\psi(x, y) = |\\psi(x, y)| e^{i \\theta(x, y)}$ with phase singularities at vortex cores $\\mathbf{r}_k$: $|\\psi(\\mathbf{r}_k)| = 0$, $\\oint_{\\mathcal{C}_k} \\nabla \\theta \\cdot d\\mathbf{l} = 2\\pi$, and recovery profile $|\\psi(r)| \\approx \\psi_0 \\tanh(r / (\\sqrt{2}\\xi))$. 2. **Triangular Lattice Pitch**: Flux quantum $\\Phi_0 = 2.0678 \\times 10^{-15}\\text{ Wb}$, cell area $A_{cell} = \\frac{\\sqrt{3}}{2}a^2 = \\Phi_0 / B \\implies a = (4/3)^{1/4}\\sqrt{\\Phi_0/B} \\approx 1.07457\\sqrt{\\Phi_0/B}$. 3. **Local Magnetic Field**: $B_z(\\mathbf{r}) = \\sum_k \\frac{\\Phi_0}{2\\pi \\lambda^2} K_0(\\|\\mathbf{r} - \\mathbf{r}_k\\|/\\lambda)$.",
    evaluationCriteria:
      "- **Strict $60^\\circ$ Triangular Lattice Tolerance**: Interior angles of adjacent vortex-core triplets deviate from $60^\\circ$ by $|\\Delta \\theta| \\le 1.0^\\circ$. - **Phase Winding Number**: Counterclockwise phase loop around each isolated vortex core cycles through a full $2\\pi$ HSV color wheel without branch-cut discontinuities. - **Six-Fold Coordination Completeness**: 100% of interior vortex cores have coordination number 6 (regular hexagonal Wigner-Seitz Voronoi cells).",
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
