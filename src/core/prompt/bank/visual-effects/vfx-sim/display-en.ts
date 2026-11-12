import type { LocalizedStandardEntry } from "../../../types";

export const VFX_SIM_LABELS_EN: Readonly<Record<string, string>> = {
  "vfx-sim-v1": "VFX-1: Continuum Physics Simulation (10-Prompt Suite)",
};

export const VFX_SIM_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "vfx-sim-v1": {
    coreKey: "Incremental Potential Contact (IPC), Surface-Tension Crown Splash & Ferrofluid Rosensweig Instability",
    groundTruth:
      "Grounded in intersection-free C2 logarithmic barrier potentials (IPC), Drucker-Prager elastoplastic granular column collapse, Young-Laplace crown splash Worthington jets, Giesekus viscoelastic die swell, and Richtmyer-Meshkov shock-bubble baroclinic vorticity roll-up.",
    evaluationCriteria:
      "1. Intersection-free guarantee: Contact clearances remain strictly positive with zero geometric interpenetration; 2. Continuum topology: Shear bands, wrinkling wave numbers, K-H billow pairing, and dynamic phase-field crack branching match PDE solutions; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
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
};
