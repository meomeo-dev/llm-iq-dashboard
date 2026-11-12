import type { LocalizedStandardEntry } from "../../../types";

export const FE_ENERGY_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-energy-v1": "FE-5: Clean Fusion & Zero-Carbon Energy (10-Prompt Suite)",
};

export const FE_ENERGY_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-energy-v1": {
    coreKey: "Extreme Fusion Plasma Magnetic Confinement, Solid-State Electrochemical Interfaces & Radiative Sky Cooling",
    groundTruth:
      "Grounded in high-field compact Tokamak Grad-Shafranov equilibria, quasi-isodynamic stellarator 3D island divertors, ICF hohlraum laser implosion hydrodynamics, and all-solid-state sulfide battery Griffith chemo-mechanical fracture criteria, satisfying MHD and thermodynamic conservation laws.",
    evaluationCriteria:
      "1. Magnetic & flux surfaces: Closed nested flux surfaces, X-point divertor strike lines, and field-reversed configurations are topologically sound; 2. Interfacial transport: Electrochemical overpotential gradients, multi-phase Darcy percolation, and spectral emissivity windows obey physical laws; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "FE-ENERGY-01": {
    coreKey: "SPARC 20T REBCO Compact Tokamak D-T Core Poloidal Cross-Section and $\\nabla B$ Drift Equilibrium",
    groundTruth:
      "Grad-Shafranov plasma boundary with major radius $R_0 = 1.85\\text{ m}$, minor radius $a = 0.57\\text{ m}$ ($A \\approx 3.25$), elongation $\\kappa = 1.97$, triangularity $\\delta = 0.54$, and a lower single-null X-point. Toroidal field $\\mathbf{B}(R) = B_0 (R_0/R) \\hat{\\mathbf{e}}_\\phi$ (18-20 T inner high-field side to 8-9 T outer side) drives guiding-center drift $\\mathbf{v}_D = \\frac{m(v_\\perp^2/2 + v_\\parallel^2)}{q B^3}(\\mathbf{B} \\times \\nabla B)$. ",
    evaluationCriteria:
      "D-shaped plasma cross-section must match $\\kappa = 1.97 \\pm 0.05$ and $\\delta = 0.54 \\pm 0.05$, with lower divertor strike lines landing at acute angles on tilted inner/outer tungsten target plates. Include a $1/R$ false-color field contour (18-20 T magenta inner to 8 T dark-blue outer) and opposite vertical drift arrows for D/T ions (downward) and electrons (upward).",
  },
  "FE-ENERGY-02": {
    coreKey: "Wendelstein 7-X 3D Non-Planar Modular Coils and $\\iota=5/5$ Resonant Magnetic Island Divertor Topology",
    groundTruth:
      "Edge rotational transform $\\iota = 1.0 = 5/5$ with resonant magnetic island width governed by low magnetic shear $w = 4\\sqrt{\\frac{r B_{mn}}{m B_\\theta (d\\iota/dr)}}$. Side-by-side poloidal cross-sections at $\\phi = 0^\\circ$ (vertically elongated bean shape) and $\\phi = 36^\\circ$ (inverted triangular shape) with nested Poincare flux surfaces.",
    evaluationCriteria:
      "Strictly 5 edge magnetic islands with local elliptic O-points and hyperbolic X-points, prohibited from showing 4 or 6 islands. Left bean section aspect ratio $\\ge 2.2$ and right triangular section with conserved area, with 10 3D divertor target plates intercepting the outer island exhaust channels.",
  },
  "FE-ENERGY-03": {
    coreKey: "NIF W-Doped Diamond Capsule Implosion Ablation and Rayleigh-Taylor Instability Dynamics",
    groundTruth:
      "Layered capsule ($R_0 = 1050\\text{ }\\mu\\text{m}$) with outer pure HDC ($\\rho = 3.52\\text{ g/cm}^3$, $\\sim 40\\text{ }\\mu\\text{m}$), middle W-doped HDC (0.2-0.4 at.% W, $\\sim 20\\text{ }\\mu\\text{m}$), inner cryogenic DT ice ($\\sim 55\\text{ }\\mu\\text{m}$), and central DT vapor cavity. Convergence ratio $C_r = R_0 / R_{\\text{hot-spot}} \\approx 30$, with ablative Rayleigh-Taylor growth rate governed by the Takabe formula $\\gamma(k) = \\alpha\\sqrt{\\frac{k g}{1 + k L}} - \\beta k v_a$.",
    evaluationCriteria:
      "SMIL/CSS animation of implosion from $t=0\\text{ ns}$ to $t_{\\text{peak}} \\approx 8\\text{-}10\\text{ ns}$ compressing $R_0$ by $1/30$ into an incandescent $>10\\text{ keV}$ hot-spot with outward rocket-effect ablative blowoff. Depict inward cold spikes and outward hot bubbles smoothed at high modes by ablation, plus an amber W-doped M-band X-ray shielding layer.",
  },
  "FE-ENERGY-04": {
    coreKey: "Field-Reversed Configuration Plasmoid Collision Compression and Faraday Inductive Direct Energy Recovery",
    groundTruth:
      "Two closed-field-line FRC toroids with separatrix radius $r_s$ and end X-points collide and merge, followed by adiabatic magnetic compression from $B_0 \\sim 0.2\\text{ T}$ to $B_{\\text{max}} \\sim 10\\text{ T}$ obeying $T \\propto B^{4/5}$, $n \\propto B^{6/5}$, and $r_s \\propto B^{-2/5}$. D-$^3\\text{He}$ fusion expansion pushes magnetic flux outward to induce direct electrical energy recovery $\\mathcal{E} = -d\\Phi_B/dt$ at $>95\\%$ round-trip efficiency.",
    evaluationCriteria:
      "Four-stage continuous animation covering supersonic plasmoid acceleration, central shock merging, 10 T magnetic compression to bright pink fusion core, and piston-like expansion driving current back into external capacitor banks. Internal axial magnetic field lines must strictly reverse direction relative to the external guide field.",
  },
  "FE-ENERGY-05": {
    coreKey: "Gen-IV Thorium Molten Salt Reactor (TMSR-LF1) Passive Freeze Plug Phase-Change and Gravity Drain Safety Loop",
    groundTruth:
      "FLiBe carrier salt ($\\text{LiF-BeF}_2$ 66-34 mol%, $T_{\\text{melt}} = 459^\\circ\\text{C}$, operating at $650\\text{-}700^\\circ\\text{C}$, $\\rho \\approx 1940\\text{ kg/m}^3$, $C_p \\approx 2414\\text{ J/(kg}\\cdot\\text{K)}$) with 1D Stefan phase-change moving boundary $\\rho L \\frac{ds(t)}{dt} = -k_{\\text{solid}}\\left.\\frac{\\partial T}{\\partial z}\\right|_{s^-} + k_{\\text{liquid}}\\left.\\frac{\\partial T}{\\partial z}\\right|_{s^+}$ melting within 300-600 s after blower blackout. Gravity drainage follows $v(t) = \\sqrt{\\frac{2 g H(t)}{1 + f(L/D) + \\sum K_L}}$ into subcritical honeycomb tanks ($k_{\\text{eff}} < 0.95$).",
    evaluationCriteria:
      "Four-stage animation showing active blower cooling maintaining the solid gray-blue salt plug, station blackout halting airflow, radial/axial melting perforation of the freeze plug, and gravity drainage of red $650^\\circ\\text{C}$ molten salt into subcritical tanks with passive air-chimney convection. Reactor vessel level drop and drain tank filling must conserve volume.",
  },
  "FE-ENERGY-06": {
    coreKey: "Sulfide All-Solid-State Lithium Battery Interphase (SEI) Chemo-Mechanical Stress and Grain Boundary Dendrite Penetration",
    groundTruth:
      "Hydrostatic stress $\\sigma_h = \\frac{1}{3}\\text{Tr}(\\boldsymbol{\\sigma})$ modulates interfacial lithium chemical potential $\\mu_{\\text{Li}} = \\mu_{\\text{Li}}^0 - F\\eta - \\Omega\\sigma_h$, where tensile stress accelerates deposition. Mode-I Griffith crack propagation occurs at grain boundary triple junctions when $K_I = \\sigma_{\\text{tip}}\\sqrt{\\pi a} \\ge K_{Ic}^{\\text{GB}}$, controlled within a $5\\text{ MPa} \\le P_{\\text{stack}} \\le 10\\text{ MPa}$ stack pressure window.",
    evaluationCriteria:
      "Three-layer cross-section showing top Li metal anode with creep slip lines and stripping Kirkendall voids, middle nanoscale $\\text{Li}_3\\text{N}/\\text{Li}_2\\text{S}$ SEI layer, and bottom Voronoi polycrystalline sulfide electrolyte. Include von Mises stress contours around the dendrite tip (red tensile tip, blue compressive flanks), crack opening displacement (COD) vectors, and $J_{\\text{Li}^+}$ flux arrows.",
  },
  "FE-ENERGY-07": {
    coreKey: "Sodium-Ion Battery Prussian White Cathode 3D Open-Framework Lattice Strain and Phase Transitions",
    groundTruth:
      "Structural phase transitions upon desodiation follow $\\text{Monoclinic } P2_1/n (\\beta \\approx 92.5^\\circ) \\xrightarrow{x \\sim 0.5} \\text{Rhombohedral } R\\bar{3}m \\xrightarrow{x \\sim 2.0} \\text{Cubic } Fm\\bar{3}m (\\beta = 90^\\circ)$ with unit-cell volume contraction $\\Delta V / V_0 \\approx 16.2\\%$. The 3D $\\text{Fe}^{2+}\\text{-C}\\equiv\\text{N-Fe}^{3+}$ framework provides $\\sim 1.6\\text{ \\AA}$ migration necks with low diffusion activation barrier $E_a \\approx 0.28\\text{-}0.35\\text{ eV}$.",
    evaluationCriteria:
      "3D perspective framework of alternating light-blue $\\text{Fe}^{2+}\\text{C}_6$ and purple $\\text{Fe}^{3+}\\text{N}_6$ octahedra linked by $-\\text{C}\\equiv\\text{N}-$ bridges and populated by yellow $\\text{Na}^+$ ions along 3D diffusion paths. Compare tilted monoclinic ($\\beta=92.5^\\circ$) and orthogonal cubic ($\\beta=90^\\circ$) cells with $\\Delta a, \\Delta b, \\Delta c$ strain vectors and an $[\\text{Fe(CN)}_6]$ vacancy occupied by distorting $\\text{H}_2\\text{O}$ molecules.",
  },
  "FE-ENERGY-08": {
    coreKey: "MW-Scale PEM Water Electrolyzer Bipolar Plate Porous Transport Layer Counter-Flow Two-Phase Capillary Transport",
    groundTruth:
      "Counter-current liquid water and $\\text{O}_2$ gas Darcy flow $\\mathbf{u}_l = -\\frac{K k_{rl}(S_l)}{\\mu_l}\\nabla P_l$ and $\\mathbf{u}_g = -\\frac{K k_{rg}(S_g)}{\\mu_g}\\nabla P_g$ coupled via Leverett capillary pressure $P_c(S_l) = \\sigma\\cos\\theta_c\\sqrt{\\varepsilon/K}J(S_l)$ across a sintered Ti-PTL ($d_f \\approx 20\\text{ }\\mu\\text{m}$, thickness $300\\text{ }\\mu\\text{m}$, $\\varepsilon \\approx 65\\%$, $1.0\\text{ mm}$ rib/channel). High gas saturation ($S_g > 0.4$) drives concentration overpotential $\\eta_{\\text{conc}} = \\frac{RT}{4F}\\ln\\left(\\frac{1}{1 - S_{g,\\text{interface}}}\\right)$.",
    evaluationCriteria:
      "Animated downward blue water permeation from bipolar plate channels and upward red $\\text{O}_2$ bubble coalescence and capillary fingering from the bottom anode catalyst layer, showing bubble stagnation under ribs. Include a right-side water saturation profile $S_l(z)$ ($0.9$ at channel to $0.5$ at catalyst interface) and hydrophilic concave menisci ($\\theta_c < 90^\\circ$) on $\\text{TiO}_2$ fibers.",
  },
  "FE-ENERGY-09": {
    coreKey: "Passive Daytime Radiative Cooling Metamaterial 8-13 um Atmospheric Window Emissivity and Solar Reflectance Photonic Topology",
    groundTruth:
      "Net cooling power balance $P_{\\text{net}}(T) = P_{\\text{rad}}(T) - P_{\\text{atm}}(T_{\\text{amb}}) - P_{\\text{sun}} - P_{\\text{cond+conv}}$ with non-radiative parasitic loss $P_{\\text{cond+conv}} = h_c(T_{\\text{amb}} - T)$ ($h_c \\approx 6\\text{-}10\\text{ W/(m}^2\\cdot\\text{K)}$). Hierarchical porous/microsphere metamaterial achieves solar reflectance $R \\approx 0.98$ ($\\lambda \\in [0.3, 2.5]\\text{ }\\mu\\text{m}$) via Mie scattering and thermal emissivity $\\varepsilon \\ge 0.95$ within the $8\\text{-}13\\text{ }\\mu\\text{m}$ atmospheric window.",
    evaluationCriteria:
      "Three-tier vertical layout showing the $3\\text{ K}$ deep-space heat sink, Earth atmosphere with highlighted $8\\text{-}13\\text{ }\\mu\\text{m}$ transparent window between $\\text{H}_2\\text{O}/\\text{CO}_2$ absorption bands, and bottom microsphere-polymer metamaterial film. Show $98\\%$ Mie-scattered yellow solar reflection, blocked cyan downward atmospheric radiation, unattenuated magenta $8\\text{-}13\\text{ }\\mu\\text{m}$ thermal emission to space, and a bar chart showing $P_{\\text{net}} \\approx 100\\text{ W/m}^2$ with $\\Delta T = -8.5^\\circ\\text{C}$ sub-ambient cooling.",
  },
  "FE-ENERGY-10": {
    coreKey: "Direct Lithium Extraction (DLE) Titanate/Manganate Ion-SieveSelective Coordination and Concentration Polarization Boundary Layer",
    groundTruth:
      "$\\text{Li}^+$ ($r = 0.76\\text{ \\AA}$, $\\Delta G_{\\text{hyd}} \\approx -515\\text{ kJ/mol}$) sheds its hydration shell to enter $d_{\\text{pore}} \\approx 1.5\\text{-}2.0\\text{ \\AA}$ ion-sieve tunnels, whereas $\\text{Mg}^{2+}$ ($r = 0.72\\text{ \\AA}$, $\\Delta G_{\\text{hyd}} \\approx -1922\\text{ kJ/mol}$, hydrated diameter $8.6\\text{ \\AA}$) is sterically and energetically blocked. Nernst-Planck flux $J_{\\text{Li}} = -D_{\\text{eff}}\\frac{\\partial C_{\\text{Li}}}{\\partial x} - \\frac{z_{\\text{Li}} F D_{\\text{eff}}}{RT}C_{\\text{Li}}\\frac{\\partial \\phi}{\\partial x}$ across a $10\\text{-}50\\text{ }\\mu\\text{m}$ boundary layer yields separation factor $\\beta_{\\text{Li/Mg}} > 1000$.",
    evaluationCriteria:
      "Three-zone multi-scale cross-section from left bulk brine (hydrated $[\\text{Mg}(\\text{H}_2\\text{O})_6]^{2+}$, $[\\text{Na}(\\text{H}_2\\text{O})_6]^+$, and $\\text{Li}^+$) through the middle concentration-polarization boundary layer to the right LIS crystal lattice. Show hydrated $\\text{Mg}^{2+}$ repelled at the $1.8\\text{ \\AA}$ pore mouth, $\\text{Li}^+$ dehydration and octahedral lattice oxygen coordination, and a bottom free-energy profile $\\Delta G(x)$ illustrating $\\Delta G_{\\text{barrier}}^{\\text{Mg}} \\gg \\Delta G_{\\text{barrier}}^{\\text{Li}}$.",
  },
};
