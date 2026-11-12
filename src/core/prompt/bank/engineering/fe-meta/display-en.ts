import type { LocalizedStandardEntry } from "../../../types";

export const FE_META_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-meta-v1": "FE-7: Metamaterials & Nanofabrication (10-Prompt Suite)",
};

export const FE_META_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-meta-v1": {
    coreKey: "Auxetic Mechanical Metamaterials, Topological Phononic Insulators & Magic-Angle Moiré Superlattice Relaxation",
    groundTruth:
      "Grounded in negative-Poisson's-ratio (auxetic) rotating-square kinematics, acoustic valley-Hall backscattering-immune edge waveguides, Pancharatnam-Berry spin-decoupled chiral metasurfaces, epsilon-near-zero (ENZ) phase tunneling, and magic-angle twisted bilayer graphene atomic reconstruction.",
    evaluationCriteria:
      "1. Lattice symmetry: Periodic unit cells, C4/C6 rotational symmetries, and moiré soliton networks maintain exact geometric ratios; 2. Wave propagation: Topological edge states, quantized quadrupole corner modes, and spatial Laplace differentiation profiles are physically accurate; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "FE-META-01": {
    coreKey: "Grima-Evans Rotating Rigid Squares Auxetic Mechanical Metamaterial Kinematics",
    groundTruth:
      "A 4x4 hinged rigid-square array exhibits an isotropic in-plane Poisson's ratio strictly equal to $\\nu = -1$, with instantaneous dimensions $L_x(\\theta) = L_y(\\theta) = 2\\sqrt{2}a\\cos(\\theta/2 - \\pi/4)$. Unit squares of edge length $a = 40\\text{ px}$ (hinge tolerance $\\le 0.5\\text{ px}$) rotate periodically and smoothly between $10^\\circ$ and $80^\\circ$.",
    evaluationCriteria:
      "Adjacent squares counter-rotate synchronously by equal angles around shared vertices while central rhombic pores expand and contract periodically. The transverse-to-axial strain ratio must remain $+1$ with edge-length distortion error $< 0.1\\%$.",
  },
  "FE-META-02": {
    coreKey: "Acoustic Topological Valley Hall Edge State Backscattering-Immune Waveguide Transport",
    groundTruth:
      "Triangular sonic-crystal lattice ($a = 60\\text{ px}$) with upper-domain triangular scatterers rotated $+30^\\circ$ and lower-domain scatterers rotated $-30^\\circ$, yielding valley Chern number difference $|\\Delta C_V| = 1$. Dynamic acoustic wavepackets traverse a Z-shaped domain wall with two sharp $120^\\circ$ bends at near-zero reflection ($R \\approx 0$) and transmittance $T > 98\\%$.",
    evaluationCriteria:
      "Equiphase wavefronts flow smoothly along the Z-shaped domain wall without standing-wave fringes at either $120^\\circ$ corner, maintaining output-to-input energy flux deviation $< 2\\%$.",
  },
  "FE-META-03": {
    coreKey: "Spin-Decoupled Dielectric Chiral Metasurface with Giant Circular Dichroism and Geometric Phase Step",
    groundTruth:
      "Spatial Jones-matrix spin decoupling using $\\text{TiO}_2$ nanopillars (height $600\\text{ nm}$, pitch $350\\text{ nm}$) at wavelength $\\lambda = 633\\text{ nm}$. Left-circularly polarized (LCP) light focuses into a central Airy spot with transmittance $\\ge 90\\%$, whereas right-circularly polarized (RCP) transmittance is $\\le 5\\%$, achieving circular dichroism $CD \\ge 0.89$.",
    evaluationCriteria:
      "The LCP focal plane displays a sharp bright Airy disk while the RCP focal plane remains dark, with focal spot FWHM matching $0.51\\lambda/\\text{NA} \\pm 5\\%$.",
  },
  "FE-META-04": {
    coreKey: "Epsilon-Near-Zero (ENZ) Subwavelength Waveguide Bend Supercoupling and Phase Tunneling",
    groundTruth:
      "In the Maxwell-Ampere ENZ limit, phase accumulation approaches zero across a subwavelength bend channel ($w_{ch} = 15\\text{ px}$) connecting wide waveguides ($W_{in} = 120\\text{ px}$, 1:8 contraction ratio). The electric field is compressed $8\\times$ inside the channel by area conservation, achieving transmittance $\\ge 98\\%$ and reflectance $\\le 2\\%$.",
    evaluationCriteria:
      "The electric field inside the bent channel flashes uniformly in global synchrony without spatial wavelength fringes, reconstructing a planar outgoing wavefront strictly in-phase with the incident wave (equiphase curvature error $\\le 0.005\\text{ px}^{-1}$).",
  },
  "FE-META-05": {
    coreKey: "2D Benalcazar-Bernevig-Hughes (BBH) Quantized Quadrupole Topological Insulator Zero-Energy Corner States",
    groundTruth:
      "BBH tight-binding lattice with $\\pi$ flux per plaquette and intracell-to-intercell hopping ratio $\\gamma/\\lambda = 0.2 < 1$, yielding quantized quadrupole moment $q_{xy} = e/2$. Four zero-energy corner modes pinned at mid-gap $E = 0$ decay bi-exponentially into the bulk with localization length $\\xi = 0.62a$.",
    evaluationCriteria:
      "The 8x8 lattice bulk and four 1D edges remain dark while intense hot-spot modes light up solely at the four corners, decaying by $> 95\\%$ within $2a$ toward the center with corner symmetry variance $\\le 0.5\\%$.",
  },
  "FE-META-06": {
    coreKey: "STM Hydrogen Depassivation Lithography (HDL) and Single-Atom Transistor Phosphorus Dopant Placement",
    groundTruth:
      "On a reconstructed $\\text{Si}(001)\\text{-}2\\times 1$ surface (dimer row pitch $0.768\\text{ nm}$, intra-row dimer period $0.384\\text{ nm}$), inelastic multi-electron vibrational heating at $+2.5\\text{ V}$ and $2.0\\text{ nA}$ excites $\\text{Si-H}$ stretching modes. Desorbing exactly 3 adjacent dimers (6 H atoms) along a single row opens a $1.15\\text{ nm} \\times 0.4\\text{ nm}$ reactive window for $\\text{PH}_3$ incorporation.",
    evaluationCriteria:
      "Against the striped dimer-row background, the central lithographic window exposes bright dangling-bond lobes without spillover to neighboring dimers, maintaining window aspect ratio within $2.8\\text{-}3.2$ and STM tip positioning tolerance $\\le 0.05\\text{ nm}$.",
  },
  "FE-META-07": {
    coreKey: "Magic-Angle Twisted Bilayer Graphene (TBG) Sub-Angstrom Moire Superlattice Atomic Reconstruction and Soliton Network",
    groundTruth:
      "At magic angle $\\theta = 1.08^\\circ$, the Moire superlattice period is $L_M = 13.06\\text{ nm}$, and van der Waals relaxation shrinks high-energy AA stacking cores to radius $3.2\\text{ nm}$ (area fraction reduced from $33\\%$ to $\\le 12\\%$). Low-energy AB/BA triangular domains expand across $1.8\\text{ nm}$ shear-soliton domain walls with local Burgers vector $b = a_0/\\sqrt{3}$.",
    evaluationCriteria:
      "Periodic bright AA nodes spaced at $13.06 \\pm 0.5\\text{ nm}$ are interconnected by narrow Y-junction dark soliton walls separating uniform AB and BA domains with aligned hexagonal centers.",
  },
  "FE-META-08": {
    coreKey: "Ultralight High-Stiffness Octet-Truss Nanolattice Euler Buckling and Specific Energy Absorption Limit Cycle",
    groundTruth:
      "Satisfying Maxwell's rigidity criterion $M = b - 3j + 6 = 36 - 3(14) + 6 = 0$, the stretching-dominated octet-truss nanolattice scales linearly in relative stiffness ($E/E_s \\propto \\rho^1$). Under cyclic uniaxial compression from $\\varepsilon = 0$ to $15\\%$ and back to $0$, struts undergo half-sine Euler buckling and achieve $100\\%$ elastic recovery upon unloading.",
    evaluationCriteria:
      "Diagonal struts buckle outward symmetrically in coordinated half-sine arcs ($R^2 \\ge 0.99$) under compression without joint detachment, preserving strict $C_4$ rotational symmetry at peak deformation.",
  },
  "FE-META-09": {
    coreKey: "Wave-Based Analog Computing Metasurface for All-Optical Real-Time Spatial Laplace Differentiation and Edge Extraction",
    groundTruth:
      "A Green's-function photonic-crystal metasurface slab (thickness $320\\text{ nm}$ at $\\lambda = 850\\text{ nm}$) implements the Fourier spatial transfer function $H(k_x, k_y) \\propto -(k_x^2 + k_y^2)$, outputting the 2D Laplacian $(-\\nabla^2)$ of the incident field. Uniform interior regions are attenuated by $> 99.5\\%$, leaving narrow double-peaked interference contours along geometric edges.",
    evaluationCriteria:
      "Homogeneous interior and background zones remain dark (central leakage $< 0.005 I_{\\text{edge}}$) while continuous high-contrast bright contours trace the object boundaries with azimuthal peak-intensity variation $\\le 3\\%$.",
  },
  "FE-META-10": {
    coreKey: "Superconducting SQUID Array Microwave Metamaterial Flux-Tunable Dispersion and Kerr Nonlinearity",
    groundTruth:
      "Josephson inductance tunes with external magnetic flux as $L_J(\\Phi) = \\Phi_0 / [2\\pi I_c \\cos(\\pi\\Phi/\\Phi_0)]$, shifting the microwave resonance dip downward by several GHz as $\\Phi/\\Phi_0$ sweeps from $0$ to $0.45$. At high drive power, Kerr nonlinearity tilts the resonance dip leftward into Duffing bistability and hysteretic switching.",
    evaluationCriteria:
      "The sharp V-shaped transmission dip ($Q \\ge 5000$) shifts smoothly leftward, exhibits Kerr hysteretic jumps near half-integer flux quanta, and oscillates with strict $\\Phi_0$ periodicity.",
  },
};
