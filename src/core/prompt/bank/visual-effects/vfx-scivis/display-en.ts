import type { LocalizedStandardEntry } from "../../../types";

export const VFX_SCIVIS_LABELS_EN: Readonly<Record<string, string>> = {
  "vfx-scivis-v1": "VFX-4: Multi-Physics Scientific Visualization (10-Prompt Suite)",
};

export const VFX_SCIVIS_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "vfx-scivis-v1": {
    coreKey: "Second-Order Tensor Hyperstreamlines, FTLE Lagrangian Coherent Structures & Magnetic Reconnection X-Point Topology",
    groundTruth:
      "Grounded in double-gyre FTLE transport barrier ridges, 2D Morse-Smale scalar field topological complexes, degenerate tensor field trisector/wedge singularities, Pack supersonic shock-diamond wavelength formulas, Petschek magnetic reconnection X-points, and Ginzburg-Landau Abrikosov vortex lattices.",
    evaluationCriteria:
      "1. Topological singularities: Poincaré-Hopf index sums, trisector/wedge streamline branches, and phase winding numbers (2π) are exact; 2. Physical fields: Shock polar angles, altitude-stratified auroral emission profiles, and knotted vortex tube helicity are quantitatively consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
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
};
