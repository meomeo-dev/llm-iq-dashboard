/**
 * English PromptStandard definitions for the first 30 VFX candidate benchmarks:
 * VFX-SIM-01..10, VFX-OPTICS-01..10, and VFX-GEOM-01..10.
 */

import type { LocalizedStandardEntry } from "./standards-single-en";

export const STANDARDS_VFX_PART1_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "VFX-SIM-01": {
    coreKey: "IPC Extreme Torsional Ring Squeeze & Intersection-Free Log-Barrier Potential Field",
    groundTruth:
      "Continuum variational optimization functional with C2-smooth logarithmic barrier function; CCD minimum clearance bound d_min >= 1e-4 * L0 with an empty global closure intersection. Two orthogonally linked hyperelastic rings compressed axially to the clearance limit and subjected to 180° torsional shear, yielding a contact patch aspect ratio a/b = 2.45 +- 0.05.",
    evaluationCriteria:
      "Penetration depth strictly 0; normal clearance at the contact patch center maintained at 0.05*d_hat +- 0.005*d_hat; von Mises peak stress relative error < 2.0%.",
  },
  "VFX-SIM-02": {
    coreKey: "MPM Granular Column Collapse with Drucker-Prager Elastoplastic Yield & Slip Surface",
    groundTruth:
      "Drucker-Prager yield criterion for dry sand with internal friction angle phi = 30.0° and cohesion c = 0; initial column aspect ratio a = 2.0. Final dimensionless runout distance X/L0 = 3.98 +- 0.08, residual stagnant wedge shear-band inclination 60.0 +- 1.0°, and angle of repose 28.5 +- 1.0°.",
    evaluationCriteria:
      "Collapse outer envelope Hausdorff distance / L0 < 2.5%; measured slip-band slope strictly within 59°–61°; global granular volume conservation error < 0.3%.",
  },
  "VFX-SIM-03": {
    coreKey: "Surface-Tension-Driven Crown Splash Rim Instability & Worthington Jet Pinch-Off Dynamics",
    groundTruth:
      "Navier-Stokes equations with Young-Laplace free-surface boundary conditions at We = 450, Re = 2200, Oh = 0.0096, h* = 0.20. Circumferential crown rim cusp count m = 20 +- 2, maximum dimensionless central Worthington jet height z_max / D0 = 3.65 +- 0.15, and first satellite droplet pinch-off dimensionless time t* = 8.4 +- 0.3.",
    evaluationCriteria:
      "Crown rim cusp extrema count strictly within 18–22; central jet axis tilt angle < 0.8°; satellite-to-primary droplet diameter ratio 0.14 +- 0.02.",
  },
  "VFX-SIM-04": {
    coreKey: "Viscoelastic Non-Newtonian Barus Die-Swell & First Normal Stress Difference Jump (Giesekus Model)",
    groundTruth:
      "Giesekus constitutive equation with upper-convected derivative and anisotropic mobility factor alpha = 0.2 at Wi = 2.5, Re = 0.05, beta = 0.1. Tanner elastic recovery die-swell ratio B_swell = [1 + 0.5*(N1/(2*tau_w))^2]^(1/6) = 1.58 +- 0.04.",
    evaluationCriteria:
      "Downstream free-surface profile RMSE against reference spline < 1.8%; die-lip singularity stress-concentration decay slope agreement >= 95%; axial centerline velocity deceleration ratio 0.40 +- 0.02.",
  },
  "VFX-SIM-05": {
    coreKey: "Discrete Elastic Shells (DES) Post-Buckling Wrinkling Cascade & Tension-Field Crease Fractal",
    groundTruth:
      "Föppl-von Kármán nonlinear large-deflection shell equations with thickness h = 50 um, E = 1.0 GPa, nu = 0.35, outer clamped radius R = 0.1 m, and central indentation depth 2.0 mm. Circumferential wrinkling wavenumber m = 32 +- 2 peaks at r = 0.5R, with critical wrinkling radius rc/R = 0.68 +- 0.02.",
    evaluationCriteria:
      "Dominant FFT power-spectrum peak of deflection along r = 0.5R located at k = 32 (+-1); radial amplitude decay curve correlation R^2 >= 0.95 against theory; total bending-to-stretching energy ratio near 5.0e-4.",
  },
  "VFX-SIM-06": {
    coreKey: "Multiphase Compressible Shock-Bubble Richtmyer-Meshkov Instability (RMI) & Baroclinic Vorticity Roll-Up",
    groundTruth:
      "Air and heavy SF6 gas bubble with Atwood number A = 0.667 impacted by a planar shock wave at Mach = 1.22. Samtaney-Zabusky deposited total circulation Gamma = 14.8 +- 0.5 m^2/s. At dimensionless time tau = 3.5, primary vortex core spacing Sv/D0 = 1.15 +- 0.04 and mushroom roll-up maximum span Wmax/D0 = 1.62 +- 0.05.",
    evaluationCriteria:
      "Upper/lower vortex core vorticity magnitude symmetry deviation < 1.0%; re-entrant cavity jet front coordinate Xjet/D0 = 2.10 +- 0.06; rolled-up interface Dice coefficient >= 0.94 against ground-truth mask.",
  },
  "VFX-SIM-07": {
    coreKey: "Kelvin-Helmholtz Shear Instability Billow Roll-Up & Secondary Vortex Pairing Dynamics",
    groundTruth:
      "Hyperbolic-tangent shear base flow U(y) = U0 * tanh(2y/delta_omega) at Re_delta = 1000. Fastest-growing linear-stability wavenumber alpha*delta = 0.444 and theoretical fundamental wavelength lambda_KH = 14.15 * delta_omega; subharmonic secondary vortex pairing doubles the characteristic wavelength to 2*lambda_KH.",
    evaluationCriteria:
      "Primary vortex center spacing error < 2.0%; inter-vortex braid saddle-point vorticity ratio to core <= 0.12; mid-pairing dual-core axis inclination angle 45.0 +- 3.0° relative to the horizontal.",
  },
  "VFX-SIM-08": {
    coreKey: "Ferrofluid Rosensweig Normal-Field Instability Hexagonal Conical Spike Array Phase Transition",
    groundTruth:
      "Cowley-Rosensweig critical capillary wavenumber kc = sqrt(rho*g/sigma) and critical lattice wavelength lambda_c = 2*pi*sqrt(sigma/(rho*g)) (9.38 mm for water-based EMG 901 ferrofluid). Regular hexagonal spike lattice with 60.0° neighbor angles and spike aspect ratio 0.72 +- 0.03.",
    evaluationCriteria:
      "Six nearest-neighbor spike angles within 58.5°–61.5°; peak-to-peak pitch relative deviation < 2.0%; tip fillet radius within 0.15–0.25 mm to prevent mesh singularity.",
  },
  "VFX-SIM-09": {
    coreKey: "Viscous Vortex Filament Variational Topological Reconnection & Helicity Jump Dynamics",
    groundTruth:
      "Two orthogonal anti-parallel vortex tubes undergoing four-stage evolution: convective approach, anti-parallel flattening, bridge rupture/reconnection, and perpendicular hairpin vortex recoil jetting. Reconnection timescale t_rec = 0.85 * d0^2 / Gamma0 +- 0.05; global topological helicity step jump Delta H / H0 = -(38% +- 3%).",
    evaluationCriteria:
      "Recoil jet axis strictly orthogonal to initial approach axis (angle error <= 1.5°); instantaneous jump in connected-component Euler characteristic; hairpin recoil apex curvature kappa = 2.4/sigma0 +- 0.2.",
  },
  "VFX-SIM-10": {
    coreKey: "Dynamic Phase-Field Brittle Fracture Supersonic Crack Branching & Stress Wave Interference",
    groundTruth:
      "Ginzburg-Landau crack phase-field evolution equation with PMMA parameters: dilatational wave speed 1788 m/s, Rayleigh wave speed 949 m/s, and Yoffe critical branching velocity v_crit = 0.60 * v_R = 570 m/s. Symmetric bifurcation angle 2*theta_branch = 58.5 +- 2.0° occurring at normalized plate length x/L = 0.42 +- 0.02.",
    evaluationCriteria:
      "Measured crack bifurcation angle within <= 1.5° of the 58.5° reference; branching point coordinate error <= 1.5%; crack-tip damage profile fits analytical d(r) = exp(-|r|/l0) with R^2 >= 0.96.",
  },
  "VFX-OPTICS-01": {
    coreKey: "Spatiotemporal Reservoir Resampling (ReSTIR GI/PT) Shift-Mapping Jacobian Determinant Field",
    groundTruth:
      "$$|J| = \\frac{\\cos\\theta_2'}{\\cos\\theta_2} \\cdot \\frac{\\|\\mathbf{x}_1 - \\mathbf{x}_2\\|^2}{\\|\\mathbf{x}_1' - \\mathbf{x}_2'\\|^2} \\approx 2.6247 \\pm 0.05$$",
    evaluationCriteria:
      "Jacobian determinant absolute tolerance $\\le 0.05$, differential solid-angle ratio absolute error $< 1.5\\%$, and reconnected path radiance unbiased estimation error $< 1.0\\%$.",
  },
  "VFX-OPTICS-02": {
    coreKey: "Explicit 3D Gaussian Splatting EWA Covariance Projection & Spherical Harmonics Radiance Field",
    groundTruth:
      "Projected 2D covariance $\\Sigma_{2D} = J W \\Sigma W^T J^T + 0.3 I_{2\\times 2}$ via perspective affine Jacobian $J$; 2D projection center $(u, v) = (120.0, -80.0)\\text{ px}$, semi-axes $a, b$ with $3\\sigma$ confidence ellipses, and 2nd-order spherical harmonic specular lobe $Y_2^0$.",
    evaluationCriteria:
      "Projected center coordinate absolute tolerance $\\le 0.5\\text{ px}$, semi-axis length relative error $< 1.2\\%$, principal axis tilt deviation $< 0.8^\\circ$, and spherical harmonic orders 0–3 lobe symmetry tolerance $< 1.0\\%$.",
  },
  "VFX-OPTICS-03": {
    coreKey: "4D Spatiotemporal Gaussian Field Conditional Covariance Slicing & ARAP Local Isometric Rigidity",
    groundTruth:
      "Joint 4D block covariance $\\Sigma_{4D}$, Schur-complement conditional temporal slice $\\Sigma^*(t) = \\Sigma_{\\mathbf{x}\\mathbf{x}} - \\Sigma_{\\mathbf{x}t}\\Sigma_{tt}^{-1}\\Sigma_{t\\mathbf{x}}$, and ARAP local isometric rigidity regularization loss $\\mathcal{L}_{\\text{iso}} \\le 0.02$.",
    evaluationCriteria:
      "Keyframe inter-particle distance deformation error $< 1.8\\%$, conditional slice covariance fit $R^2 \\ge 0.985$, and local rotational isometry energy loss $< 0.5\\%$.",
  },
  "VFX-OPTICS-04": {
    coreKey: "Nanoscale Multilayer Thin-Film Wave-Optics Interference & Airy Spectral Reflectance Profile",
    groundTruth:
      "Optical path difference $\\Delta = 2 n_2 d \\cos\\theta_2$, Airy series summation spectral reflectance $R(\\lambda)$, net $\\pi$ phase shift across hard/soft reflection interfaces, and destructive-interference Newton's black film for $d < 25\\text{ nm}$.",
    evaluationCriteria:
      "Newton's black-film thickness threshold within $d \\le 30\\text{ nm}$, spectral reflectance extrema wavelength peak deviation $< 1.5\\%$, and color difference $\\Delta E_{00} \\le 1.8$.",
  },
  "VFX-OPTICS-05": {
    coreKey: "Anisotropic Micro-Grating Full-Spectrum Diffraction Dispersion & CIE 1931 Chromaticity Projection",
    groundTruth:
      "Grating equation $d(\\sin\\theta_m - \\sin\\theta_i) = m\\lambda$ with $d=1400\\text{ nm}, \\theta_i=15^\\circ$. First-order ($m=1$) diffraction angles: violet ($405\\text{ nm}$) $33.23^\\circ$, green ($532\\text{ nm}$) $39.70^\\circ$, amber ($589\\text{ nm}$) $42.80^\\circ$, red ($680\\text{ nm}$) $48.12^\\circ$, matched to the CIE 1931 spectral locus boundary.",
    evaluationCriteria:
      "Outgoing diffraction angle absolute error $< 0.15^\\circ$, and CIE 1931 chromaticity coordinate $(x, y)$ error $\\le 0.005$.",
  },
  "VFX-OPTICS-06": {
    coreKey: "Directional Dipole Subsurface Scattering (BSSRDF) Spatial Diffusion Profile & Translucency Attenuation",
    groundTruth:
      "Effective transport extinction coefficient $\\sigma'_{tr} = \\sqrt{3\\sigma_a\\sigma'_t}$, positive real source depth $z_r = 1/\\sigma'_t$, negative virtual source depth $z_v = z_r + 4AD$, and analytical diffuse reflectance profile $R_d(r)$.",
    evaluationCriteria:
      "Diffusion profile FWHM error $< 1.0\\%$, asymptotic tail decay slope error $< 0.8\\%$, and subsurface energy conservation residual $\\le 0.5\\%$.",
  },
  "VFX-OPTICS-07": {
    coreKey: "General Relativistic Kerr Black Hole Geodesic Lensing & Doppler Beaming $g^4$ Polarization Field",
    groundTruth:
      "Kerr spin $a=0.94M$: prograde photon orbit at $1.543M$, retrograde at $3.826M$; Bardeen (1973) impact-parameter D-shaped shadow; relativistic Doppler beaming flux $I_{\\text{obs}} = g^4 I_{\\text{em}}$ with $11.7\\times$ approaching blueshift brightening and $0.09\\times$ receding redshift dimming under Keplerian angular velocity $\\Omega_K$.",
    evaluationCriteria:
      "Black hole shadow boundary agreement $\\ge 98.5\\%$, approaching-to-receding disk radiance ratio within $12.0$–$15.0$, and photon ring radius absolute tolerance $< 0.02 R_g$.",
  },
  "VFX-OPTICS-08": {
    coreKey: "Special Relativistic $0.95c$ All-Sky Aberration Headlight Effect & Terrell-Penrose Rotation",
    groundTruth:
      "Relativistic cruise at $\\beta=0.95, \\gamma=3.2026$: half-angle aberration formula $\\tan(\\theta_{\\text{obs}}/2) = 0.1601 \\tan(\\theta_{\\text{src}}/2)$ compressing $90^\\circ$ lateral rays forward to $18.20^\\circ$, with apparent Terrell-Penrose rotation angle $\\theta_{\\text{rot}} = \\arcsin(0.95) \\approx 71.80^\\circ$.",
    evaluationCriteria:
      "Compressed $90^\\circ$ half-angle strictly within $18.2^\\circ \\pm 0.3^\\circ$, apparent Terrell rotation angle error $< 1.0^\\circ$, and headlight blueshift integrated flux ratio agreement $> 99\\%$.",
  },
  "VFX-OPTICS-09": {
    coreKey: "Birefringent Uniaxial Crystal Ordinary/Extraordinary Polarization Splitting & Wollaston Prism Ray Path",
    groundTruth:
      "Calcite uniaxial crystal ($n_o=1.6584, n_e=1.4864$) in a dual right-angle Wollaston prism ($30^\\circ$ wedge angle) with optic-axis swap at the diagonal interface, yielding an orthogonal linear-polarization exiting beam separation angle $\\epsilon = 11.38^\\circ \\pm 0.05^\\circ$.",
    evaluationCriteria:
      "Total angular separation error between ordinary and extraordinary rays $< 0.1^\\circ$, refractive index ratio error $< 0.2\\%$, and orthogonal polarization vector angle error $0^\\circ$.",
  },
  "VFX-OPTICS-10": {
    coreKey: "Higher-Order Caustic Wavefront Normal-Curvature Mapping, Hyperbolic Umbilic ($D_4^+$) & Envelope Singularity",
    groundTruth:
      "Catastrophe unfolding potential $V(x, y; \\xi, \\eta, \\zeta) = x^3 + y^3 + \\zeta xy - \\xi x - \\eta y$ with Hessian degeneracy condition $36xy - \\zeta^2 = 0$, forming a classic three-cusped winged cusp-fold bifurcation envelope network.",
    evaluationCriteria:
      "Three-cusp symmetry axis angle error $< 0.5^\\circ$, cusp singularity irradiance peak scaling-law error $< 2.0\\%$, and caustic fold hyperbola curvature match $> 98\\%$.",
  },
  "VFX-GEOM-01": {
    coreKey: "Discrete Exterior Calculus (DEC) Triangle-Mesh Heat-Method Geodesic Distance Field & Isoline Reconstruction",
    groundTruth:
      "1. **Cotangent Laplace-Beltrami Operator**: $$L_{ij} = \\frac{1}{2}(\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\; (i \\neq j), \\quad L_{ii} = -\\sum_{j \\in N(i)} L_{ij}$$ 2. **Lumped Voronoi Dual Mass Matrix**: $$M_{ii} = A_{\\text{Voronoi}}(v_i) = \\frac{1}{8} \\sum_{j \\in N(i)} (\\cot \\alpha_{ij} + \\cot \\beta_{ij}) \\|\\mathbf{e}_{ij}\\|^2$$ 3. **Heat Diffusion & Normalized Gradient Field**: $(M - t L) u = \\delta_{x_0}$ ($t = h^2$ for mean edge length $h$), $X = -\\nabla u / \\|\\nabla u\\|$. 4. **Poisson Geodesic Reconstruction**: $L \\phi = \\nabla \\cdot X$ with $\\phi(x_0) = 0$. 5. **Tolerances**: Eikonal residual $|\\|\\nabla \\phi\\| - 1| \\le 2.5 \\times 10^{-3}$; iso-contours orthogonal to geodesic rays with 0 spurious extrema.",
    evaluationCriteria:
      "- **Machine Check**: Extract 10 equispaced iso-contour loops from SVG paths; geodesic distance RMSE to source $x_0$ $\\le 1.5\\%$; cosine of angle between gradient streamlines and iso-contour normals $|\\cos \\theta| \\le 0.02$. - **Visual Check**: Smooth concentric geodesic bands without jagged breaks, exhibiting hyperbolic fan-out across negative-Gaussian-curvature saddle regions.",
  },
  "VFX-GEOM-02": {
    coreKey: "Neural Implicit Signed Distance Field (NeuS) Eikonal Gradient Constraint & Adaptive Octree Dual Contouring",
    groundTruth:
      "1. **Analytical Polyhedral SDF**: $$f(\\mathbf{x}) = \\min_{k} (\\mathbf{n}_k \\cdot (\\mathbf{x} - \\mathbf{p}_k))$$ 2. **Eikonal Condition & Unit Normal Field**: $$\\|\\nabla f(\\mathbf{x})\\| = 1 \\; \\text{a.e.}, \\quad \\mathbf{n}(\\mathbf{x}) = \\frac{\\nabla f(\\mathbf{x})}{\\|\\nabla f(\\mathbf{x})\\|}$$ 3. **Adaptive Octree Subdivision & QEF Vertex Placement**: Subdivide leaf cell $C$ iff $\\max_{v \\in C} f(v) \\cdot \\min_{v \\in C} f(v) \\le 0$; place optimal Dual Contouring vertex via Quadric Error Function: $$\\mathbf{x}^* = \\arg\\min_{\\mathbf{x}} \\sum_{i \\in \\text{Edges}} (\\mathbf{n}_i \\cdot (\\mathbf{x} - \\mathbf{p}_i))^2$$ 4. **Tolerances**: Zero-isosurface genus $g=0$, surface normal error $\\Delta \\mathbf{n} \\le 1.0^\\circ$, and Eikonal deviation $\\mathbb{E}[(\\|\\nabla f\\| - 1)^2] \\le 1.0 \\times 10^{-4}$.",
    evaluationCriteria:
      "- **Machine Check**: Extracted zero-isosurface polygon vertices satisfy $\\max |f(\\mathbf{x}_k)| \\le 10^{-4}$; Dual Contouring resolves octree T-junctions with 0 non-manifold edges. - **Visual Check**: Crisp inside/outside sign transition (cool blue negative interior, warm red positive exterior), zero-level contour tightly hugging the white zero band, and sharp right-angle corner retention without Marching Cubes chamfering.",
  },
  "VFX-GEOM-03": {
    coreKey: "4D Tesseract (8-Cell) SO(4) Isoclinic Double Rotation & Petrie Octagon Coxeter Plane Projection",
    groundTruth:
      "1. **Polytope Combinatorics**: 16 vertices $(\\pm 1, \\pm 1, \\pm 1, \\pm 1)$, 32 edges, 24 square faces, 8 cubical cells, Euler characteristic $\\chi = V - E + F - C = 16 - 32 + 24 - 8 = 0$. 2. **SO(4) Left-Isoclinic Rotation**: $$R_L(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta & 0 & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 & 0 \\\\ 0 & 0 & \\cos\\theta & -\\sin\\theta \\\\ 0 & 0 & \\sin\\theta & \\cos\\theta \\end{pmatrix}$$ 3. **Coxeter Petrie Octagon Basis**: $$U = \\frac{1}{2}\\left(\\cos \\frac{\\pi}{8}, \\cos \\frac{3\\pi}{8}, \\cos \\frac{5\\pi}{8}, \\cos \\frac{7\\pi}{8}\\right), \\quad V = \\frac{1}{2}\\left(\\sin \\frac{\\pi}{8}, \\sin \\frac{3\\pi}{8}, \\sin \\frac{5\\pi}{8}, \\sin \\frac{7\\pi}{8}\\right)$$ 4. **Tolerances**: 4D edge length invariant $L_{4D} = 2.0$; outer hull converges to a regular octagon at symmetric phases (diagonal symmetry error $< 0.1\\%$).",
    evaluationCriteria:
      "- **Machine Check**: Sample 16 projected vertex coordinates at $t = 0, T/4, T/2$; maximum Euclidean deviation from exact Coxeter projection $\\le 0.5\\text{ px}$, with 32-edge adjacency matching the 4-cube graph. - **Visual Check**: Smooth topological inversion as inner cubical cells turn inside-out while maintaining 8-fold Coxeter rotational symmetry ($h=8$).",
  },
  "VFX-GEOM-04": {
    coreKey: "Klein Bottle 4D Immersion in 3-Space: Figure-8 Closed Non-Orientable Smooth Manifold",
    groundTruth:
      "1. **Figure-8 Immersion Equations** ($u, v \\in [0, 2\\pi), r_0 = 3.0$): $$x(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\cos u, \\quad y(u, v) = \\left( r_0 + \\cos\\frac{u}{2} \\sin v - \\sin\\frac{u}{2} \\sin 2v \\right) \\sin u, \\quad z(u, v) = \\sin\\frac{u}{2} \\sin v + \\cos\\frac{u}{2} \\sin 2v$$ 2. **Topology**: Closed non-orientable manifold with $\\chi = 2 - 2g_{\\text{unoriented}} = 0$ (gluing two Möbius bands). 3. **Self-Intersection Locus**: At $v = 0, \\pi$, $x^2 + y^2 = r_0^2$ in plane $z = 0$. 4. **Tolerances**: Integrated Gaussian curvature $\\iint_{\\mathcal{M}} K dA = 2\\pi \\chi = 0$; self-intersection circle coplanarity $\\Delta z < 1.0 \\times 10^{-4}$.",
    evaluationCriteria:
      "- **Machine Check**: Verify normal orientation reversal $\\mathbf{n}(u+2\\pi, v) = -\\mathbf{n}(u, v)$ after one meridian circuit and self-intersection vertices lying on a circle of radius $r_0$. - **Visual Check**: Longitudinal ribs twist smoothly by $180^\\circ$ as the Figure-8 cross-section revolves around the central axis, seamlessly connecting interior and exterior into a single surface.",
  },
  "VFX-GEOM-05": {
    coreKey: "Hopf Fibration ($S^3 \\to S^2$) Nested Coaxial Tori Family & Linked Villarceau Circles",
    groundTruth:
      "1. **Hopf Map & $S^3$ Parameterization**: For $(z_1, z_2) \\in \\mathbb{C}^2$ with $|z_1|^2 + |z_2|^2 = 1$: $$z_1 = \\cos\\eta \\, e^{i(\\xi_1 + \\xi_2)}, \\quad z_2 = \\sin\\eta \\, e^{i(\\xi_1 - \\xi_2)} \\quad (\\eta \\in (0, \\pi/2)), \\quad \\pi(z_1, z_2) = (2 z_1 \\bar{z}_2, |z_1|^2 - |z_2|^2) \\in S^2$$ 2. **Stereographic Projection to $\\mathbb{R}^3$**: $$(x, y, z) = \\frac{1}{1 - \\text{Im}(z_2)} \\left( \\text{Re}(z_1), \\text{Im}(z_1), \\text{Re}(z_2) \\right)$$ Each constant-$\\eta$ preimage is a torus with major radius $R = \\csc(2\\eta)$ and minor radius $r = \\cot(2\\eta)$ ($R/r = \\sec(2\\eta)$). 3. **Linking Invariant**: Any two distinct fibers $F_a, F_b$ are exact circles ($e < 10^{-4}$) with Gauss linking number $\\text{Lk}(F_a, F_b) = \\pm 1$.",
    evaluationCriteria:
      "- **Machine Check**: Parse closed fiber loops to verify pairwise linking number $|\\text{Lk}| = 1$ and coaxial concentricity error $\\le 0.1\\text{ px}$. - **Visual Check**: Coaxially nested inner and outer tori colored smoothly by base $S^2$ coordinates, with Villarceau circle fibers sweeping at inclination $\\theta = \\pm \\arcsin(r/R)$ in interlocked harmony.",
  },
  "VFX-GEOM-06": {
    coreKey: "Discrete Surface Ricci Flow & Circle-Packing Metric Conformal Parameterization with Zero Angular Distortion",
    groundTruth:
      "1. **Circle-Packing Metric**: Edge length $l_{ij}^2 = r_i^2 + r_j^2 + 2 r_i r_j \\cos \\Phi_{ij}$ from vertex circle radii $r_i, r_j$ and intersection angle $\\Phi_{ij}$. 2. **Discrete Ricci Flow**: For log-conformal factor $u_i = \\ln r_i$: $$\\frac{d u_i}{dt} = \\bar{K}_i - K_i, \\quad K_i = 2\\pi - \\sum_{j,k \\in F(i)} \\theta_i^{jk}, \\quad \\sum \\bar{K}_i = 2\\pi \\chi$$ 3. **Zero Angular Distortion (Beltrami Criterion)**: $\\mu(z) = (\\partial f / \\partial \\bar{z}) / (\\partial f / \\partial z) \\equiv 0$. 4. **Tolerances**: Maximum triangle interior-angle distortion $|\\theta_{\\text{planar}} - \\theta_{\\text{manifold}}| \\le 1.2^\\circ$; Tissot indicatrix aspect ratio $a/b \\equiv 1.0 \\pm 0.02$.",
    evaluationCriteria:
      "- **Machine Check**: Measure interior angle differences between 3D and flattened 2D mesh triangles (global variance $\\sigma^2_{\\Delta \\theta} < 0.25$) and verify circular Tissot indicatrices. - **Visual Check**: Parametric grid lines intersect at strict $90^\\circ$ right angles even across high-curvature regions, with isotropic checkerboard cells and zero shear strain.",
  },
  "VFX-GEOM-07": {
    coreKey: "Costa Genus-1 Three-Ended Embedded Minimal Surface Zero-Mean-Curvature ($H=0$) Analytical Wireframe",
    groundTruth:
      "1. **Weierstrass-Enneper Parameterization**: Defined on the square torus $\\mathbb{C}/(\\mathbb{Z} + i\\mathbb{Z})$: $$\\mathbf{x}(\\zeta) = \\text{Re} \\int_0^\\zeta \\left( \\frac{1}{2}(1 - g^2) f, \\; \\frac{i}{2}(1 + g^2) f, \\; g f \\right) dz, \\quad g(z) = \\frac{2\\sqrt{2\\pi}}{a \\wp'(z)}, \\quad f(z) = \\wp(z)$$ with lattice invariants $g_2 \\approx 189.072772, g_3 = 0, e_1 = \\wp(1/2) \\approx 6.87519$. 2. **Asymptotic Ends**: One middle planar end ($z \\to 0$) and two symmetric top/bottom catenoidal ends ($z \\to \\pm 1/2$). 3. **Differential Invariants**: Principal curvatures $k_1 + k_2 = 0 \\implies H(\\mathbf{x}) \\equiv 0$; genus $g=1$, ends $k=3$, total Gaussian curvature $\\iint_{\\mathcal{M}} K dA = -12\\pi$; discrete $\\|H_{\\text{discrete}}\\| \\le 5.0 \\times 10^{-4}$ with $D_4$ symmetry error $< 0.1\\%$.",
    evaluationCriteria:
      "- **Machine Check**: Discrete mean curvature residual $\\sum |H_i| / N \\le 10^{-3}$ across mesh faces; non-contractible first-homology basis loops $\\gamma_1, \\gamma_2$ around the central genus-1 tunnel. - **Visual Check**: Clear central torus pass-through tunnel balanced between the flat middle planar skirt and symmetric flaring upper/lower catenoidal trumpets, everywhere saddle-shaped.",
  },
  "VFX-GEOM-08": {
    coreKey: "Curvature Metric-Tensor Guided Adaptive Anisotropic Mesh Edge Collapse/Flip Equilibrium",
    groundTruth:
      "1. **Curvature Metric Tensor**: From Shape Operator eigendecomposition: $$\\mathcal{M}(\\mathbf{x}) = V \\Lambda V^T, \\quad \\lambda_i = \\max\\left( \\epsilon_{\\text{min}}, \\frac{|k_i|}{\\epsilon_{\\text{tol}}} \\right)$$ 2. **Riemannian Edge Length & Local Operators**: $$L_{\\mathcal{M}}(\\mathbf{e}) \\approx \\sqrt{\\mathbf{e}^T \\bar{\\mathcal{M}}_{ij} \\mathbf{e}}$$ Split if $L_{\\mathcal{M}}(\\mathbf{e}) > \\sqrt{2}$, collapse if $L_{\\mathcal{M}}(\\mathbf{e}) < 1/\\sqrt{2}$, and apply metric Delaunay flips. 3. **Equilibrium Invariants**: Interior vertex valence expectation $\\mathbb{E}[\\text{deg}(v)] = 6$, mean metric edge length $\\bar{L}_{\\mathcal{M}} \\in [0.95, 1.05]$, Hausdorff error $d_H \\le \\epsilon_{\\text{tol}}$, and 0 inverted faces.",
    evaluationCriteria:
      "- **Machine Check**: Project mesh edges onto local curvature tensor ellipsoids to verify $L_{\\mathcal{M}} \\in [0.7, 1.4]$ and valence-6 interior vertex fraction $\\ge 85\\%$. - **Visual Check**: High-aspect-ratio triangles elongated parallel to sharp curvature ridges, transitioning smoothly into equilateral triangles across isotropic flat/spherical regions.",
  },
  "VFX-GEOM-09": {
    coreKey: "Möbius Strip Parallel-Transport Normal Holonomy Inversion & Midline Bifurcation Topological Surgery",
    groundTruth:
      "1. **3D Parametric Embedding** ($R_0 = 4.0, w = 1.0, v \\in [-w, w], u \\in [0, 2\\pi]$): $$\\mathbf{r}(u, v) = \\left( \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\cos u, \\; \\left(R_0 + \\frac{v}{2}\\cos\\frac{u}{2}\\right)\\sin u, \\; \\frac{v}{2}\\sin\\frac{u}{2} \\right)$$ 2. **Normal Holonomy Flip ($v=0$)**: $$\\mathbf{n}(u) = \\left( -\\sin\\frac{u}{2}\\cos u, \\; -\\sin\\frac{u}{2}\\sin u, \\; \\cos\\frac{u}{2} \\right), \\quad \\mathbf{n}(2\\pi) = -\\mathbf{n}(0) \\; (\\Delta \\theta = \\pi)$$ 3. **Midline Topological Surgery**: Pre-cut strip is non-orientable with $B=1$ boundary of length $4\\pi R_0$ ($\\chi_1 = 0$); cutting along midline $v=0$ yields a single connected, **orientable** strip with $4\\pi$ twist, $B=2$ boundaries, double perimeter, and $\\chi_2 = 0$.",
    evaluationCriteria:
      "- **Machine Check**: Normal vector endpoint trajectory satisfies $\\mathbf{n}(2\\pi) \\cdot \\mathbf{n}(0) = -1.000$; connected component count remains 1 before and after midline $v=0$ bisection. - **Visual Check**: Normal arrows tilt continuously along the loop without abrupt mirror jumps; midline bisection unzips the strip into a single doubly-twisted connected loop.",
  },
  "VFX-GEOM-10": {
    coreKey: "Poincaré Disk Hyperbolic Regular {7, 3} Tiling & Circle-Inversion Isometry Condensation",
    groundTruth:
      "1. **Poincaré Metric & Hyperbolic Distance**: $$ds^2 = \\frac{4 (dx^2 + dy^2)}{(1 - x^2 - y^2)^2}, \\quad d_{\\mathbb{H}}(z_1, z_2) = 2 \\operatorname{artanh} \\left| \\frac{z_1 - z_2}{1 - z_1 \\bar{z}_2} \\right|$$ 2. **Hyperbolic Schläfli Condition**: $(p-2)(q-2) > 4$ (for $\\{7, 3\\}: 5 > 4$). 3. **Central Heptagon Euclidean Vertex Radius**: $$\\cosh d_0 = \\frac{\\cos(\\pi/3)}{\\sin(\\pi/7)} \\approx 1.15238 \\implies r_0 = \\tanh(d_0 / 2) \\approx 0.26610$$ 4. **Circle-Inversion Isometry**: $\\sigma(z) = c + R^2 / (\\bar{z} - \\bar{c})$. 5. **Tolerances**: Vertex interior angles strictly $2\\pi/3 = 120.0^\\circ$ ($\\pm 0.1^\\circ$); geodesic arcs intersect the unit circle orthogonally at $90.0^\\circ \\pm 0.05^\\circ$.",
    evaluationCriteria:
      "- **Machine Check**: Geodesic arc endpoints intersect the unit boundary orthogonally (dot-product error $\\le 10^{-4}$), and valence-3 vertex interior angles sum to $\\sum_{k=1}^3 \\theta_k = 360.0^\\circ$. - **Visual Check**: Centered regular hyperbolic heptagon recursively reflected outward with exponential Euclidean foreshortening toward the $|z| \\to 1$ boundary circle.",
  },
};
