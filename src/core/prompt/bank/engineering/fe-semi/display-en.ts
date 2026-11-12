import type { LocalizedStandardEntry } from "../../../types";

export const FE_SEMI_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-semi-v1": "FE-2: Sub-Angstrom Semiconductor & Photonics (10-Prompt Suite)",
};

export const FE_SEMI_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-semi-v1": {
    coreKey: "Sub-Angstrom Semiconductor Device Micro-Topology, Backside Power Delivery & High-NA EUV Optics",
    groundTruth:
      "Grounded in A16 angstrom-class Gate-All-Around (GAA) nanosheets, Backside Power Delivery Networks (BSPDN), monolithic 3D CFET complementary stacking, and High-NA 0.55 EUV anamorphic reflective lithography optics, preserving angstrom-scale dimensional tolerances and band-diagram alignment.",
    evaluationCriteria:
      "1. Cross-sectional topology: Nanosheet ribbons, 360° gate stacks, inner spacers, and nano-TSV interconnects are layered accurately; 2. Optical ray paths: Anamorphic magnification (4x/8x) and chief-ray angles are geometrically self-consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "FE-SEMI-01": {
    coreKey: "A16 Sub-2nm GAA Nanosheet Cross-Section & HKMG Band Bending Profile",
    groundTruth:
      "1. **Nanosheet Channel Geometry**: Three vertically stacked monocrystalline Si nanosheets (Channel 1/2/3) with sheet thickness $T_{ns} = 5.0 \\pm 0.5\\,\\text{nm}$, width $W_{ns} = 22.0 \\pm 1.0\\,\\text{nm}$, and vertical pitch $S_{gap} = 10.0 \\pm 1.0\\,\\text{nm}$. 2. **360° Gate Stack**: Interfacial $\\text{SiO}_x$ ($0.6\\,\\text{nm}$), ALD $\\text{HfO}_2$ ($k \\approx 22$, physical thickness $1.4\\,\\text{nm}$, $\\text{EOT} = 0.65\\,\\text{nm}$), and work-function metal (TiN/TiAlC).",
    evaluationCriteria:
      "- **3-Sheet GAA Topology & Aspect Ratios**: Three parallel nanosheets fully wrapped 360° by IL, $\\text{HfO}_2$, and WFM with $W_{ns}/T_{ns} \\in [4.0, 4.8]$ and $S_{gap}/T_{ns} \\in [1.8, 2.2]$, flanked by $6\\,\\text{nm}$ inner spacers and S/D epitaxy; - **Band Alignment Side-Plot**: Linked band diagram ($E_c, E_v, E_F$ with $E_g \\approx 1.12\\,\\text{eV}$) showing proper band offsets and downward surface band bending under $V_G > V_{th}$.",
  },
  "FE-SEMI-02": {
    coreKey: "Backside Power Delivery Network (BSPDN) Super Power Rail & nTSV Dual-Sided Interconnect",
    groundTruth:
      "1. **Dual-Sided Vertical Stack**: Frontside BEOL (relaxed $36\\,\\text{nm}$-pitch M0 and compact M1/M2 signal lines in Low-k dielectric) $\\to$ $15\\text{–}25\\,\\text{nm}$ GAA active device layer $\\to$ CMP-thinned Si substrate ($d_{sub} \\le 100\\,\\text{nm}$) $\\to$ Backside PDN thick Cu power rails (BM0–BM2, $100\\text{–}300\\,\\text{nm}$ thick, $R_{\\square} < 0.1\\,\\Omega/\\text{sq}$).",
    evaluationCriteria:
      "- **Frontside Signal vs. Backside Power Separation**: Clear visual hierarchy with fine frontside signal routing at top, GAA transistors in the center, and wide backside power rails at bottom; - **Vertical nTSV Landing & IR-Drop Heatmap**: High-aspect-ratio nTSVs ($D \\approx 20\\,\\text{nm}$) land directly on bottom S/D silicide without touching the gate, paired with an inset IR-drop heatmap contrasting frontside $V_{DD}$ droop against uniform BSPDN voltage.",
  },
  "FE-SEMI-03": {
    coreKey: "Monolithic 3D Complementary FET (mCFET) with Middle Dielectric Isolation (MDI) & Vertical Contacts",
    groundTruth:
      "1. **Monolithic Vertical Dual-Device Stack**: Bottom pFET (2 SiGe/Si nanosheets with p-type SiGe:B diamond S/D epitaxy) and top nFET (2 Si nanosheets with n-type Si:P S/D epitaxy) spaced by $50.0 \\pm 5.0\\,\\text{nm}$ center-to-center. 2. **Middle Dielectric Isolation (MDI)**: Dual-layer ALD $\\text{SiO}_2 / \\text{SiN}_x$ isolation of thickness $H_{MDI} = 30.0 \\pm 3.0\\,\\text{nm}$.",
    evaluationCriteria:
      "- **Co-Axial Vertical Alignment**: Top 2-sheet nFET and bottom 2-sheet pFET are aligned along a single vertical axis separated by a flat $30\\,\\text{nm}$ MDI layer; - **Split Dual-WFM Gate & S/D Polarity**: Distinct color coding for top nFET low-$\\Phi_m$ gate and bottom pFET high-$\\Phi_m$ gate electrically severed at the MDI, with differentiated n/p S/D epitaxial facets and split front/backside contacts.",
  },
  "FE-SEMI-04": {
    coreKey: "High-NA 0.55 EUV Anamorphic 8-Mirror Projection Optics & Central Pupil Obscuration",
    groundTruth:
      "1. **8-Mirror Mo/Si Projection Optics (M1–M8)**: Aspheric multilayer Bragg mirrors ($d \\approx 6.9\\,\\text{nm}$) folding $\\lambda = 13.5\\,\\text{nm}$ EUV light from the reticle ($CRAO = 5.3^\\circ$ or $8.8^\\circ$) to the wafer. 2. **Anamorphic Magnification & Pupil Obscuration**: $M_x = 0.25$ ($4\\times$ slit reduction, $\\theta_x = \\arcsin(0.55) \\approx 33.37^\\circ$) and $M_y = 0.125$ ($8\\times$ scan reduction) with $\\sim 20\\%$ central pupil obscuration.",
    evaluationCriteria:
      "- **Complete M1–M8 Optical Train**: All 8 curved mirrors (M1–M8) are individually rendered with reflection angles matching incidence angles ($< 3^\\circ$ error) and no unphysical beam self-intersection; - **Central Obscuration & Pure SMIL Propagation**: Exit pupil displays a dark central obscuration ring bypassed by outer rays, with $\\lambda=13.5\\,\\text{nm}$ wavefronts animated from reticle to wafer via pure SMIL/CSS.",
  },
  "FE-SEMI-05": {
    coreKey: "CPO Silicon Photonic Micro-Ring Resonator (MRR) Thermo-Optic Tuning & Evanescent Coupling",
    groundTruth:
      "1. **Waveguide Geometry**: Single-mode silicon rib bus and ring waveguides ($w = 450 \\pm 10\\,\\text{nm}, h = 220\\,\\text{nm}$), outer ring radius $R = 5.0 \\pm 0.2\\,\\mu\\text{m}$, and coupling gap $G_{coup} = 150 \\pm 15\\,\\text{nm}$. 2. **Thermo-Optic Resonance**: Si thermo-optic coefficient $dn/dT = 1.86 \\times 10^{-4}\\,\\text{K}^{-1}$ and resonance condition $m \\lambda_{res} = 2 \\pi R n_{eff}$ near $\\lambda = 1550\\,\\text{nm}$.",
    evaluationCriteria:
      "- **Closed Integer Standing-Wave Nodes**: Optical phase inside the micro-ring closes self-consistently over $2\\pi$ with an integer number of standing-wave nodes; - **Evanescent Tail & Thermal Plume**: Exponential field decay $E(x) = E_0 e^{-\\gamma x}$ across the $150\\,\\text{nm}$ coupling gap into the Drop port, accompanied by an elliptical thermal diffusion gradient under the micro-heater.",
  },
  "FE-SEMI-06": {
    coreKey: "Glass Core Substrate High-Aspect-Ratio TGV & Von Mises Thermomechanical Stress Profile",
    groundTruth:
      "1. **Substrate & Hourglass TGV Geometry**: Alkali-free borosilicate glass core of thickness $H_{glass} = 400 \\pm 20\\,\\mu\\text{m}$ with laser-induced deep-etched (LIDE) hourglass vias ($D_{top} = 30\\,\\mu\\text{m}$, waist $D_{waist} = 18\\,\\mu\\text{m}$, $\\text{AR} \\approx 15:1$, pitch $P = 70\\,\\mu\\text{m}$). 2. **Metallization & Stress**: PVD Ti/TiN barrier ($30\\text{–}50\\,\\text{nm}$) with void-free Cu fill generating peak Von Mises stress $\\sigma_{vm} \\ge 350\\,\\text{MPa}$ under $\\Delta T = -235\\,\\text{K}$.",
    evaluationCriteria:
      "- **Hyperbolic Hourglass Via Profile**: TGV sidewalls curve inward smoothly to an $18\\,\\mu\\text{m}$ waist with filleted openings ($r \\approx 3\\,\\mu\\text{m}$) rather than straight cylinders; - **Von Mises Isostress Contours & Crack Vectors**: Includes a $0\\text{–}400\\,\\text{MPa}$ colorbar, dense concentric high-stress contours at RDL corners and waist inflections, and crack-initiation vectors normal to maximum principal tensile stress.",
  },
  "FE-SEMI-07": {
    coreKey: "16-High HBM4 Bumpless Direct Cu-Cu Hybrid Bonding Atomic Interface Cross-Section",
    groundTruth:
      "1. **16-High Ultra-Thin DRAM Stack**: A 4nm/5nm logic base die supporting 16 vertically bonded DRAM dies thinned to $t_{die} = 30.0 \\pm 1.5\\,\\mu\\text{m}$ with micro-TSVs ($D = 1.5\\,\\mu\\text{m}, H = 30\\,\\mu\\text{m}$). 2. **Nanoscale Cu-Cu Hybrid Bond**: Pad pitch $P_{pad} = 1.0 \\pm 0.1\\,\\mu\\text{m}$, Cu pad diameter $D_{pad} = 0.5\\,\\mu\\text{m}$, and pre-bond CMP dishing recess $h_{recess} = 2.0\\text{–}3.5\\,\\text{nm}$.",
    evaluationCriteria:
      "- **Exact 16-Die Stack Count**: Macro view depicts exactly 16 thinned DRAM layers atop 1 logic base die within the $775\\,\\mu\\text{m}$ package envelope; - **Pre-Bond vs. Post-Anneal Interface**: Magnified inset contrasts the pre-bond state ($2\\text{–}3.5\\,\\text{nm}$ Cu dishing gap with covalent SiCN dielectric bond) against the $200\\text{–}300^\\circ\\text{C}$ post-anneal state (grain-boundary migration across a void-free Cu-Cu joint with $\\Delta x \\le 100\\,\\text{nm}$ overlay).",
  },
  "FE-SEMI-08": {
    coreKey: "Atomic Layer Deposition (ALD) TMA/H2O 4-Phase Self-Limiting Chemisorption & Monolayer Kinetics",
    groundTruth:
      "1. **Four Sequential ALD Phases**: Phase A ($t_1 = 1.0\\,\\text{s}$ TMA pulse): $\\text{Al-OH}^* + \\text{Al(CH}_3)_3(g) \\to \\text{Al-O-Al(CH}_3)_2^* + \\text{CH}_4(g)\\uparrow$ reaching $-\\text{CH}_3$ saturation ($\\theta \\to 1$); Phase B ($t_2 = 1.0\\,\\text{s}$ $\\text{N}_2$ purge); Phase C ($t_3 = 1.0\\,\\text{s}$ $\\text{H}_2\\text{O}$ pulse regenerating $-\\text{OH}^*$); Phase D ($t_4 = 1.0\\,\\text{s}$ $\\text{N}_2$ purge) at $\\text{GPC} = 1.1\\,\\text{\\AA/cycle}$.",
    evaluationCriteria:
      "- **4-Phase Timeline State Machine**: Bottom timeline indicator steps smoothly across Phase A $\\to$ B $\\to$ C $\\to$ D synchronized with precursor pulsing and purging; - **Molecular Geometry & $1.1\\,\\text{\\AA}$ Monolayer Step**: Accurate TMA (trigonal planar $\\text{Al(CH}_3)_3$), bent $\\text{H}_2\\text{O}$ ($104.5^\\circ$), and tetrahedral $\\text{CH}_4$ byproduct geometries, with film thickness advancing by $1.1\\,\\text{\\AA}$ per cycle.",
  },
  "FE-SEMI-09": {
    coreKey: "Monolayer MoS2 (1L-MoS2) 2D FET with Semimetallic Bismuth Ultralow-SBH Ohmic Contact",
    groundTruth:
      "1. **2D Channel Parameters**: Monolayer S-Mo-S lattice of thickness $t = 0.65\\,\\text{nm}$, electron affinity $\\chi = 4.2\\,\\text{eV}$, direct bandgap $E_g = 1.80 \\pm 0.05\\,\\text{eV}$, and effective mass $m_e^* = 0.45\\,m_0$. 2. **Semimetallic Bi(0001) Contact**: $20\\,\\text{nm}$ Bi contact suppresses MIGS to achieve zero Schottky barrier height ($\\Phi_{Bn} \\le 0.02\\,\\text{eV} \\approx 0\\,\\text{eV}$) and $R_c = 123\\,\\Omega\\cdot\\mu\\text{m}$.",
    evaluationCriteria:
      "- **S-Mo-S Atomic Sandwich & vdW Gap**: Crisp trigonal prismatic S-Mo-S monolayer separated by a $\\sim 0.3\\,\\text{nm}$ van der Waals gap under a $3.0\\,\\text{nm}$ ALD $\\text{HfO}_2/\\text{Y}_2\\text{O}_3$ top-gate stack; - **Zero-Barrier Band Alignment**: Band diagram shows Bi Fermi level $E_F$ aligned flat with the $\\text{MoS}_2$ conduction band minimum $E_c$ without a MIGS-pinned Schottky spike, alongside barrier-free electron injection arrows.",
  },
  "FE-SEMI-10": {
    coreKey: "Ferroelectric HZO (Hf0.5Zr0.5O2) Orthorhombic Pca21 Domain Wall Nucleation & Switching Dynamics",
    groundTruth:
      "1. **Orthorhombic $Pca2_1$ Unit Cell**: $H_{HZO} = 10.0 \\pm 0.5\\,\\text{nm}$ film between TiN/TaN electrodes ($a \\approx 0.507\\,\\text{nm}, b \\approx 0.526\\,\\text{nm}, c \\approx 0.508\\,\\text{nm}$) with $0.02\\text{–}0.04\\,\\text{nm}$ asymmetric c-axis oxygen displacement. 2. **Ferroelectric Hysteresis & NLS Kinetics**: $P_r \\approx 18\\text{–}22\\,\\mu\\text{C/cm}^2$, $E_c = 1.5 \\pm 0.2\\,\\text{MV/cm}$, and $P(t) = 2 P_r [1 - \\exp(-(t/\\tau)^\\beta)]$.",
    evaluationCriteria:
      "- **Pca21 Atomic Dipole Displacement**: Distinct Hf/Zr cations and asymmetrically displaced oxygen anions generating net spontaneous polarization $\\vec{P}$; - **NLS Domain Wall Sweep & Closed P-E Loop**: Animation shows reverse domain nucleation followed by lateral $180^\\circ$ domain-wall propagation synchronized with a glowing tracer traversing a centrosymmetric P-E hysteresis loop.",
  },
};
