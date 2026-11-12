import type { LocalizedStandardEntry } from "../../../types";

export const VFX_OPTICS_LABELS_EN: Readonly<Record<string, string>> = {
  "vfx-optics-v1": "VFX-2: Wave Optics & Radiance Fields (10-Prompt Suite)",
};

export const VFX_OPTICS_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "vfx-optics-v1": {
    coreKey: "Explicit 3D Gaussian Splatting (3DGS), Kerr Black Hole Geodesic Lensing & Wave-Optics Structural Color",
    groundTruth:
      "Grounded in 3DGS EWA covariance ellipse projection, Kerr metric photon-sphere D-shaped shadows and g^4 relativistic Doppler beaming, multilayer thin-film Airy interference, ReSTIR GI shift-mapping Jacobians, and directional dipole BSSRDF subsurface scattering profiles.",
    evaluationCriteria:
      "1. Optical accuracy: Kerr shadow asymmetry, relativistic aberration angles, thin-film Newton black-spot thresholds, and Wollaston birefringent ray splitting match analytical formulas; 2. Geometric projection: Covariance ellipses, spherical harmonic lobes, and hyperbolic umbilic caustics are distortion-free; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
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
};
