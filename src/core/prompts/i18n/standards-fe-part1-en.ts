/**
 * English PromptStandard definitions for FE-AI-01..10, FE-SEMI-01..10,
 * FE-QUANTUM-01..10, and FE-BIO-01..10.
 */

import type { LocalizedStandardEntry } from "./standards-single-en";

export const STANDARDS_FE_PART1_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "FE-AI-01": {
    coreKey: "Rigid Body Oblique Multi-Impact & Restitution Impulse Phase Dynamics",
    groundTruth:
      "1. **Impulse-Momentum Conservation**: $$J = \\int_{t_0}^{t_1} F \\, dt = m(v^+ - v^-), \\quad J_\\tau = \\int_{t_0}^{t_1} (r \\times F) \\, dt = I(\\omega^+ - \\omega^-)$$ 2. **Poisson/Newton Restitution & Coulomb Friction Cone**: $v_{rel, n}^+ = -e \\cdot v_{rel, n}^-$ ($0 \\le e \\le 1$), with $|J_t| \\le \\mu J_n$ (sticking) or $J_t = -\\mu \\operatorname{sgn}(v_{rel, t}) J_n$ (sliding), for an asymmetric polygon of mass $m=2.0\\,\\text{kg}$ ($e=0.65, \\mu=0.35$) impacting a $15^\\circ$ rigid base.",
    evaluationCriteria:
      "- **Geometric & Momentum Self-Consistency**: At contact ($t_{contact}$), impulse vectors align with the surface normal and friction-cone projection; - **Rebound Trajectory & Angular Jump**: Post-impact center-of-mass parabola $y(x)$ follows $g=-9.8\\,\\text{m/s}^2$, and eccentric torque $r \\times J$ induces an angular velocity jump $\\Delta \\omega$ synchronized with linear momentum loss.",
  },
  "FE-AI-02": {
    coreKey: "SPH Dam-Break Free-Surface Surge & Dynamic Vorticity",
    groundTruth:
      "1. **Weakly Compressible SPH (WCSPH) Momentum & Continuity**: $$\\frac{D\\mathbf{v}_i}{Dt} = -\\sum_j m_j \\left( \\frac{P_i}{\\rho_i^2} + \\frac{P_j}{\\rho_j^2} + \\Pi_{ij} \\right) \\nabla_i W_{ij} + \\mathbf{g}, \\quad \\frac{D\\rho_i}{Dt} = \\sum_j m_j (\\mathbf{v}_i - \\mathbf{v}_j) \\cdot \\nabla_i W_{ij}$$ 2. **Tait EOS**: $P = B [(\\rho/\\rho_0)^\\gamma - 1]$ with $\\gamma=7$ and $B = c_0^2 \\rho_0 / \\gamma$.",
    evaluationCriteria:
      "- **Snout Wave Profile**: The surge front forms a rounded non-hydrostatic snout wave rather than a sharp triangle; - **Vorticity & Streamlines**: A negative vorticity core ($\\omega = \\nabla \\times \\mathbf{v} < 0$) forms along the no-slip bottom wall with smooth streamline curvature from vertical collapse to horizontal jetting.",
  },
  "FE-AI-03": {
    coreKey: "GelSight Tactile Elastomeric Indentation & Hertzian Stress Tensor",
    groundTruth:
      "1. **Hertzian Contact Mechanics**: $$P(r) = P_0 \\sqrt{1 - (r/a)^2} \\quad (r \\le a), \\quad P_0 = \\frac{3 F_z}{2 \\pi a^2}, \\quad a = \\left(\\frac{3 F_z R}{4 E^*}\\right)^{1/3}, \\quad \\frac{1}{E^*} = \\frac{1 - \\nu_1^2}{E_1} + \\frac{1 - \\nu_2^2}{E_2}$$ 2. **Tri-Color Photometric Stereo**: $I_k(x, y) = \\rho_0 (-p L_{k,x} - q L_{k,y} + L_{k,z}) / \\sqrt{p^2 + q^2 + 1}$ for $k \\in \\{R, G, B\\}$ with surface gradients $p = \\partial z/\\partial x, q = \\partial z/\\partial y$.",
    evaluationCriteria:
      "- **Depth Contours & RGB Photometric Shading**: Indentation contours trace a hemispherical parabolic profile while R/G/B shading aligns with surface normal dot products $(\\mathbf{N} \\cdot \\mathbf{L}_k)$; - **Marker Shear Field**: Marker grid displacements $\\Delta \\vec{u}(x, y)$ converge on the eccentric shear side with divergence $\\nabla \\cdot \\vec{u}$ matching the Hertzian pressure gradient.",
  },
  "FE-AI-04": {
    coreKey: "Bipedal LIPM Zero Moment Point (ZMP) & Limit Cycle Phase Plane",
    groundTruth:
      "1. **LIPM Dynamics & Eigenfrequency**: $$\\ddot{x}_c = \\frac{g}{z_c} (x_c - x_{zmp}) = \\omega_0^2 (x_c - x_{zmp}), \\quad \\omega_0 = \\sqrt{g/z_c}$$ 2. **Hyperbolic Phase Flow & Support Switching**: $x_c(t) - x_{zmp} = c_1 e^{\\omega_0 t} + c_2 e^{-\\omega_0 t}$; over step period $T_{step}$ and stride $L$, $x_{zmp}$ shifts from left to right foot so the phase trajectory $(x_c, \\dot{x}_c/\\omega_0)$ crosses the separatrix into a closed limit cycle.",
    evaluationCriteria:
      "- **Hyperbolic Saddle Asymptotes**: Phase trajectories diverge along hyperbolic saddle asymptotes within each support phase rather than forming harmonic ellipses; - **ZMP Polygon & Closed Orbit**: ZMP stays strictly inside the foot support polygon and the left-right step cycle closes with zero phase drift.",
  },
  "FE-AI-05": {
    coreKey: "Two-Layer Transformer Induction Head QK/OV Causal Circuit Decomposition",
    groundTruth:
      "1. **Attention-Free Circuit Decomposition (Elhage et al.)**: $$A^{h} = \\operatorname{softmax}\\left(\\frac{x^T W_E^T W_Q^h (W_K^h)^T W_E x}{\\sqrt{d_k}}\\right) \\; (\\text{QK-Circuit}), \\quad T^{h} = W_E W_V^h (W_O^h)^T W_U \\; (\\text{OV-Circuit})$$ 2. **Two-Layer Composition**: Layer-0 Previous-Token Head (L0H1, $A_{i, i-1} \\approx 1.0$) writes token $A$ at $i-1$ into residual position $i$; Layer-1 Induction Head (L1H4) queries current $A$ via $W_Q^1$ and matches L0H1's key via $W_K^1$ to copy the subsequent token $B$.",
    evaluationCriteria:
      "- **Residual Stream & Cross-Layer Wiring**: A continuous residual stream backbone with attention heads attached as read-write branches and a dashed causal path from L0 OV output into L1 QK input; - **Attention Heatmap Contrast**: Distinct heatmaps showing L0H1's off-diagonal shift stripe ($A_{i,i-1}$) versus L1H4's sparse induction-copying spots.",
  },
  "FE-AI-06": {
    coreKey: "Sparse Autoencoder (SAE) Monosemantic Disentanglement & Polytope Geometry",
    groundTruth:
      "1. **SAE Dictionary Learning Objective**: $$f(x) = \\operatorname{ReLU}(W_e (x - b_d) + b_e), \\quad \\hat{x} = W_d f(x) + b_d, \\quad \\min \\mathbb{E}_{x} \\left[ \\|x - \\hat{x}\\|_2^2 + \\lambda \\sum_{i=1}^{M} |f_i(x)| \\right] \\; (M \\gg D)$$ 2. **Superposition Polytope Geometry**: When feature count $M > D$, dictionary vectors $d_i$ self-organize into symmetric polytopes or antipodal pairs ($d_i \\approx -d_j$) with bounded interference $|d_i^T d_j| \\le \\epsilon$.",
    evaluationCriteria:
      "- **Polysemantic vs. Monosemantic Split**: Left side shows entangled polysemantic neuron clusters while right side shows disentangled monosemantic SAE dictionary axes; - **Polytope Vertices & Sparsity Barcode**: Hypersphere feature rays form regular polytopes/antipodal pairs alongside a 99%-zero sparse activation barcode with only a few active slots lit.",
  },
  "FE-AI-07": {
    coreKey: "Two-Phase Microchannel Cold Plate Boiling & Critical Heat Flux (CHF)",
    groundTruth:
      "1. **Clausius-Clapeyron & Boiling Heat Flux**: $$\\frac{dP_{sat}}{dT} = \\frac{h_{fg}}{T_{sat} (v_g - v_f)}, \\quad q'' = h_{tp} (T_{wall} - T_{sat})$$ 2. **Microchannel Flow Boiling Regimes**: Evolves from subcooled liquid $\\to$ bubbly flow $\\to$ Taylor slug flow with thin liquid film $\\to$ annular flow and dryout above $q''_{CHF}$, where liquid film rupture drops $h$ by 1–2 orders of magnitude and triggers wall temperature excursion.",
    evaluationCriteria:
      "- **Flow Regime Progression**: Vapor morphology transitions from discrete micro-bubbles to elongated Taylor slugs to a continuous annular vapor core from left to right; - **Dryout Thermal Runaway & Pressure Drop**: Downstream of the dryout point, cold-plate wall color shifts from cool blue/green to high-temperature orange/red while the pressure drop slope $|dP/dz|$ steepens with vapor quality $x$.",
  },
  "FE-AI-08": {
    coreKey: "CDU Fractal Manifold Hydraulic Network & Darcy-Weisbach Balance",
    groundTruth:
      "1. **Darcy-Weisbach Friction & Minor Losses**: $$\\Delta P_f = f \\frac{L}{D_h} \\frac{\\rho v^2}{2}, \\quad \\Delta P_m = K \\frac{\\rho v^2}{2}$$ 2. **Murray's Biomimetic Branching Law & Kirchhoff Balance**: $D_{parent}^3 = \\sum_{k=1}^{N} D_{daughter, k}^3$ ($D_k = D_0 \\cdot 2^{-k/3}$ for symmetric bifurcation) keeps wall shear stress uniform, with $\\sum Q_{in} = \\sum Q_{out}$ and parallel branch pressure drops balanced across $\\Delta P_{CDU}$.",
    evaluationCriteria:
      "- **Murray Diameter Scaling**: Manifold branch diameters scale down across levels by $2^{-1/3} \\approx 0.7937$; - **Pressure Waterfall & Flow Balancing**: Includes a hydraulic pressure-waterfall step plot (supply recovery $\\to$ nozzle throttling $\\to$ return friction loss) and balancing orifices/tapered headers keeping branch flow deviation $\\le 3\\%$.",
  },
  "FE-AI-09": {
    coreKey: "Linear Temporal Logic (LTL) Runtime Shielding & Safe MDP Reachability Envelope",
    groundTruth:
      "1. **LTL Safety Specification & DBA**: $$\\phi = \\square (\\neg \\text{Hazard}) \\wedge \\square (\\text{Goal} \\to \\lozenge \\text{SafeHaven}), \\quad \\mathcal{A}_{\\phi} = (Q, \\Sigma, \\delta, q_0, F)$$ 2. **Product MDP & Minimal-Interference Shield**: Over product states $s^\\otimes = (s_{env}, q_{ltl}) \\in S \\times Q$ and $k$-step reachability $R_k(s)$, the shield operator $\\Pi(s, a)$ passes safe actions unchanged and projects unsafe proposals onto the closest safe action.",
    evaluationCriteria:
      "- **Runtime Trajectory Deflection**: Unsafe exploratory action vectors (yellow) approaching red hazard zones are deflected by the shield boundary onto tangent safe trajectories (green); - **Automaton Sync & Control Barrier**: An inset 4-state automaton transitions legally without entering the absorbing error state, while the state space displays a zero-level Control Barrier Function (CBF) safety envelope.",
  },
  "FE-AI-10": {
    coreKey: "Hierarchical Task Network (HTN) Recursive Goal Tree & MCTS Pareto Pruning Frontier",
    groundTruth:
      "1. **HTN Recursive Decomposition**: $$\\text{Task} = \\begin{cases} \\text{Primitive} & (\\text{direct atomic action } \\text{Act}(a)) \\\\ \\text{Compound} & (\\text{decomposed via method } M_k \\text{ into } [T_{k,1}, \\dots, T_{k,n}]) \\end{cases}$$ with precondition guards $\\text{Pre}(M_k) \\subseteq \\mathcal{S}$. 2. **PUCT Selection & Pruning**: $\\text{PUCT}(s, a) = \\frac{Q(s, a)}{N(s, a)} + c_{puct} P(s, a) \\frac{\\sqrt{\\sum_b N(s, b)}}{1 + N(s, a)}$.",
    evaluationCriteria:
      "- **3-Tier HTN Hierarchy & Pruning**: Left tree shows Root Goal $\\to$ Compound Tasks $\\to$ Primitive Nodes with red dashed pruning markers on dominated branches and green checkmarked feasible paths; - **Pareto Frontier Plot**: Right dual-axis scatter plot of Token Cost vs. Task Utility displays the concave Pareto envelope and marks the diminishing-returns knee point.",
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
  "FE-QUANTUM-01": {
    coreKey: "Rotated Surface Code Syndrome Extraction & MWPM Error Chain Decoding",
    groundTruth:
      "- **Lattice & Stabilizers ($d=3$)**: 9 data qubits $D_1 \\sim D_9$ at $(x, y) \\in \\{0, 1, 2\\}^2$ vertices and 8 measure qubits $A_1 \\sim A_8$ (4 diagonal bulk $X$-ancillas and 4 bulk/boundary $Z$-ancillas), with weight-4 bulk stabilizers ($S_Z^{(bulk)} = Z_2 Z_4 Z_6 Z_8$, $S_X^{(bulk)} = X_4 X_5 X_7 X_8$) and weight-2 smooth-$X$/rough-$Z$ boundaries. - **Injected Errors**: $X_4$ on $D_4$ and $Z_2$ on $D_2$ trigger $-1$ eigenvalues on adjacent $Z$ and $X$ stabilizers, paired by MWPM recovery chains.",
    evaluationCriteria:
      "- **Lattice & Stabilizer Rendering**: 9 data qubits as dark rings ($D_1 \\sim D_9$), 8 stabilizers as translucent cyan ($Z$) and warm orange ($X$) square/half-square plaquettes, and $-1$ excited syndromes with red/amber glow; - **MWPM Decoding Chains**: Dashed fluorescent MWPM paths pass strictly through $D_4$ and $D_2$ to pair syndromes or connect to the boundary ($\\le 2\\,\\text{px}$ grid alignment error).",
  },
  "FE-QUANTUM-02": {
    coreKey: "Neutral Atom Optical Tweezers Array Spatial Reconfiguration & Hungarian Routing",
    groundTruth:
      "- **Initial Array & Target Zone**: A $10 \\times 10$ optical tweezer lattice ($a = 4.0\\,\\mu\\text{m}$) randomly half-loaded with 50 $^{87}\\text{Rb}$ atoms ($r_0 = 0.8\\,\\mu\\text{m}$) surrounding a central $6 \\times 6$ defect-free target zone (36 sites). - **Hungarian Assignment & Routing**: Minimizes squared Euclidean transport distance $\\min \\sum_{i,j} \\|\\mathbf{r}_i^{init} - \\mathbf{r}_j^{target}\\|^2 x_{ij}$ along collision-free inter-site corridors ($d > 0.5a = 2.0\\,\\mu\\text{m}$).",
    evaluationCriteria:
      "- **3-Stage Defect-Free Assembly**: Starts from a half-filled $10 \\times 10$ random array, transports outer atoms via glowing AOD tweezers along collision-free tracks, and finishes with a 100%-filled 36-atom $6 \\times 6$ central array; - **Collision-Free SMIL Trajectories**: Uses `<animateMotion>` along Bezier or orthogonal Manhattan `<path>` segments that never cross occupied lattice sites.",
  },
  "FE-QUANTUM-03": {
    coreKey: "Rydberg Blockade Hamiltonian & Antiferromagnetic Z2 Lattice Quantum Phase Transition",
    groundTruth:
      "- **Rydberg Hamiltonian**: $$\\hat{H} = \\sum_{i=1}^N \\frac{\\hbar\\Omega(t)}{2} \\hat{\\sigma}_i^x - \\sum_{i=1}^N \\hbar\\Delta(t) \\hat{n}_i + \\sum_{i < j} \\frac{C_6}{|i-j|^6 a^6} \\hat{n}_i \\hat{n}_j$$ for $N = 21$ atoms spaced by $a = 5.7\\,\\mu\\text{m}$ ($C_6 / 2\\pi = 862\\,\\text{GHz}\\cdot\\mu\\text{m}^6$, $\\Omega / 2\\pi = 2.0\\,\\text{MHz}$, blockade radius $R_b / a \\approx 1.25$). - **Adiabatic Sweep**: Detuning $\\Delta(t)$ sweeps from $-8\\,\\text{MHz}$ to $+10\\,\\text{MHz}$ into an alternating $\\mathbb{Z}_2$ crystal ($P_r(2k+1) \\approx 0.92, P_r(2k) \\approx 0.08$).",
    evaluationCriteria:
      "- **Pulse Monitor & 21-Atom Chain**: Top panel tracks the bell-shaped $\\Omega(t)$ envelope and linear $\\Delta(t)$ ramp while the bottom panel animates 21 atom halos; - **Antiferromagnetic Z2 Density Wave**: Across the critical detuning, odd sites expand into bright red-orange Rydberg halos and even sites stay dark, achieving odd-even contrast $(P_{odd}-P_{even})/(P_{odd}+P_{even}) \\ge 0.80$.",
  },
  "FE-QUANTUM-04": {
    coreKey: "Superconducting Transmon Josephson Cosine Potential Well & Anharmonic Bound-State Wavefunctions",
    groundTruth:
      "- **Stationary Schrodinger Equation**: $$\\left[ -4E_C \\frac{d^2}{d\\phi^2} - E_J \\cos\\phi \\right] \\psi_m(\\phi) = E_m \\psi_m(\\phi)$$ with $E_J/E_C = 50$, $E_C/h = 250\\,\\text{MHz}$, and $E_J/h = 12.5\\,\\text{GHz}$. - **Anharmonic Spectrum**: $\\omega_{01}/2\\pi \\approx 4.75\\,\\text{GHz}$, $\\omega_{12}/2\\pi \\approx 4.50\\,\\text{GHz}$, and negative anharmonicity $\\alpha/2\\pi = (\\omega_{12} - \\omega_{01})/2\\pi \\approx -250\\,\\text{MHz}$.",
    evaluationCriteria:
      "- **Cosine Potential & Negative Anharmonicity**: Renders $V(\\phi) = -E_J \\cos\\phi$ over $\\phi \\in [-\\pi, \\pi]$ with four bound energy levels clearly satisfying $\\Delta E_{01} > \\Delta E_{12} > \\Delta E_{23}$; - **Wavefunction Parity & Nodes**: Eigenfunctions $E_m + A \\psi_m(\\phi)$ for $m=0,1,2,3$ exhibit exact $m$ zero crossings ($\\le 0.05\\,\\text{rad}$ error) and alternating even/odd reflection symmetry.",
  },
  "FE-QUANTUM-05": {
    coreKey: "Cavity QED Dispersive Readout & IQ Phase-Space Pointer Trajectory",
    groundTruth:
      "- **Dispersive Hamiltonian & Pointer ODE**: $$\\hat{H}_{disp} = \\hbar(\\omega_r - \\omega_d + \\chi \\hat{\\sigma}_z)\\hat{a}^\\dagger \\hat{a} + \\frac{\\hbar\\Omega_d}{2}(\\hat{a} + \\hat{a}^\\dagger), \\quad \\frac{d\\alpha(t)}{dt} = -\\left( \\frac{\\kappa}{2} + i(\\Delta_r \\pm \\chi) \\right)\\alpha(t) - i\\frac{\\Omega_d}{2}$$ - **Parameters**: Cavity decay $\\kappa/2\\pi = 2.0\\,\\text{MHz}$ and dispersive shift $\\chi/2\\pi = -1.2\\,\\text{MHz}$ at $\\Delta_r = 0$, yielding steady-state separation angle $\\Delta\\theta = 2\\arctan(2|\\chi|/\\kappa) \\approx 100.4^\\circ$.",
    evaluationCriteria:
      "- **IQ Phase-Space Bifurcation**: Annotated $(I, Q)$ plane showing sky-blue ($|0\\rangle$) and rose-red ($|1\\rangle$) damped spiral trajectories diverging from $(0,0)$ into distinct quadrants; - **Gaussian Noise Disks & Separation Angle**: Endpoints feature translucent Wigner uncertainty disks ($\\sigma_W = 1/2$, separation $> 3\\sigma$), a decision threshold line, and a separation angle within $100.4^\\circ \\pm 3.0^\\circ$.",
  },
  "FE-QUANTUM-06": {
    coreKey: "Schrodinger Cat State Bosonic QEC Wigner Function Topological Interference Fringes",
    groundTruth:
      "- **Even Cat State Wigner Function**: For $|\\psi_+\\rangle = \\mathcal{N}_+ (|\\alpha\\rangle + |-\\alpha\\rangle)$ with $\\alpha = 2.5$ ($\\bar{n} \\approx 6.25$): $$W(x, p) = \\frac{2}{\\pi(1 + e^{-2|\\alpha|^2})} e^{-(x^2 + p^2)} \\left[ \\cosh(2\\sqrt{2}\\alpha x) + \\cos(2\\sqrt{2}\\alpha p) \\right]$$ - **Topological Features**: Two Gaussian coherent peaks at $(x, p) = (\\pm \\sqrt{2}\\alpha, 0) \\approx (\\pm 3.54, 0)$ and central cosine interference fringes along $p$ with period $\\Delta p = \\pi / (\\sqrt{2}\\alpha) \\approx 0.888$ and negative troughs at $(0, \\pm 0.444)$.",
    evaluationCriteria:
      "- **Diverging Scientific Colormap & Fringes**: Warm red/yellow for positive peaks, neutral light gray/white for zero, and deep blue/indigo for negative Wigner troughs, with $\\ge 5$ alternating horizontal interference fringes near $x=0$; - **Twofold Symmetry & Period Accuracy**: Symmetric coherent lobes at $(\\pm 3.54, 0)$ obeying $W(\\pm x, \\pm p) = W(x, p)$ with fringe period $\\Delta p$ accurate within $\\le 3\\%$.",
  },
  "FE-QUANTUM-07": {
    coreKey: "Trapped Ion Phonon Phase-Space Closed Trajectory & Two-Qubit Molmer-Sorensen Entangling Gate",
    groundTruth:
      "- **Molmer-Sorensen Interaction Hamiltonian**: In the Lamb-Dicke regime with symmetric detuning $\\delta = \\omega_L - \\omega_{phonon}$: $$\\hat{H}_{MS}(t) = \\hbar \\eta \\Omega \\hat{J}_x \\left( \\hat{a} e^{-i\\delta t} + \\hat{a}^\\dagger e^{i\\delta t} \\right), \\quad \\alpha_{\\pm}(t) = \\mp \\frac{\\eta \\Omega}{\\delta} (1 - e^{i\\delta t})$$ - **Gate Closure & Geometric Phase**: At $\\tau_g = 2\\pi/\\delta = 50\\,\\mu\\text{s}$ and $\\eta\\Omega/\\delta = 1/\\sqrt{8}$, trajectories close at $\\alpha_\\pm(\\tau_g) = 0$ with enclosed geometric phase $\\Phi = 2\\pi (\\eta\\Omega/\\delta)^2 = \\pi/4$.",
    evaluationCriteria:
      "- **Dual-Panel Phase Space & Fidelity Meter**: Left panel shows phonon phase space $(x_m, p_m)$ with two counter-propagating circular orbits for $M_x = \\pm 1$; right panel tracks population and gate fidelity; - **Exact Origin Closure**: At $t = \\tau_g$, both trajectories return to the origin ($\\Delta r \\le 0.5\\,\\text{px}$) to disentangle spin from motion, shading the enclosed $\\Phi = \\pi/4$ area gold as fidelity reaches 100%.",
  },
  "FE-QUANTUM-08": {
    coreKey: "Fermi-Hubbard Strongly Correlated Antiferromagnetic Neel Order & Spin-Charge Separation Lattice",
    groundTruth:
      "- **Fermi-Hubbard Hamiltonian**: $$\\hat{H} = -t \\sum_{\\langle i,j \\rangle, \\sigma} (\\hat{c}_{i\\sigma}^\\dagger \\hat{c}_{j\\sigma} + \\text{h.c.}) + U \\sum_i \\hat{n}_{i\\uparrow}\\hat{n}_{i\\downarrow} - \\mu \\sum_i \\hat{n}_i$$ on an $8 \\times 8$ square optical lattice (64 sites) at $U/t = 8.0$, $J/t = 0.5$, and $T/t = 0.25$. - **Neel Order & Spin-Charge Separation**: Staggered correlation $C(d) = (-1)^{\\Delta x + \\Delta y} \\langle \\hat{S}_i^z \\hat{S}_{i+d}^z \\rangle > 0$ forms a checkerboard spin background disrupted by a mobile holon leaving a geometric string of flipped spins terminating at a spinon.",
    evaluationCriteria:
      "- **64-Site Antiferromagnetic Checkerboard**: Orthogonal $8 \\times 8$ grid with 100% antiparallel neighbor spins (blue $\\uparrow$ and red $\\downarrow$) in the undoped region; - **Holon-String-Spinon Defect**: Clearly highlights the mobile empty hole (white ring holon), the dashed string of frustrated parallel spins along its hopping path, and the decoupled spinon endpoint.",
  },
  "FE-QUANTUM-09": {
    coreKey: "Majorana Zero Modes (MZM) T-Junction Braiding Network & Non-Abelian Berry Geometric Phase",
    groundTruth:
      "- **Majorana Algebra**: Self-adjoint operators $\\gamma_i = \\gamma_i^\\dagger$ obeying $\\{\\gamma_i, \\gamma_j\\} = 2\\delta_{ij}$ with complex fermion $\\hat{c}^\\dagger = (\\gamma_1 - i\\gamma_2)/2$. - **3-Step T-Junction Braiding**: Across left (L), right (R), and bottom (B) nanowire branches: (1) park $\\gamma_1$ from L into B; (2) shuttle $\\gamma_2$ from R to L; (3) move $\\gamma_1$ from B to R, yielding the non-Abelian transformation $(\\gamma_1, \\gamma_2)^T \\to (\\gamma_2, -\\gamma_1)^T$.",
    evaluationCriteria:
      "- **T-Junction Nanowire & Gate Indicators**: Hollow T-shaped superconducting nanowire network with local gate-voltage indicators (green tuned topological / gray depleted trivial) and glowing MZM wavepackets ($\\gamma_1$ red, $\\gamma_2$ yellow); - **3-Step Braiding & Worldlines**: `<animateMotion>` strictly follows the T-junction axes alongside spacetime braiding worldlines and explicit final phase labels $\\gamma_1 \\to \\gamma_2, \\gamma_2 \\to -\\gamma_1$.",
  },
  "FE-QUANTUM-10": {
    coreKey: "Post-Quantum Lattice Cryptography LWE Discrete Gaussian Error Manifold & Babai Nearest-Plane Partition",
    groundTruth:
      "- **2D $q$-ary Lattice**: Modulo $q = 17$ with $\\mathbf{a} = (3, 7)^T$ defining $\\Lambda_q(\\mathbf{a}) = \\{ \\mathbf{x} \\in \\mathbb{Z}^2 : x_1 a_1 + x_2 a_2 \\equiv 0 \\pmod{17} \\}$. - **Bad vs. LLL-Reduced Basis**: Skewed bad basis $\\mathbf{B}_{bad} = \\begin{pmatrix} 1 & 14 \\\\ 0 & 17 \\end{pmatrix}$ vs. quasi-orthogonal LLL basis $\\mathbf{B}_{LLL} = \\begin{pmatrix} 3 & -2 \\\\ 2 & 5 \\end{pmatrix}$, overlaid with Voronoi cell $\\mathcal{V}(\\mathbf{0})$ and discrete Gaussian noise $\\rho_\\sigma(\\mathbf{x}) = \\exp(-\\pi \\|\\mathbf{x}\\|^2 / \\sigma^2)$ ($\\sigma = 1.2$).",
    evaluationCriteria:
      "- **Dual Basis Vectors & Fundamental Domains**: Renders integer lattice points, red skewed $\\mathbf{B}_{bad}$ arrows with narrow yellow fundamental parallelepiped $\\mathcal{P}_{1/2}(\\mathbf{B}_{bad})$, and teal orthogonal $\\mathbf{B}_{LLL}$ arrows with blue hexagonal Voronoi cell $\\mathcal{V}(\\mathbf{0})$; - **LWE Ciphertext Decoding Contrast**: Places perturbed target $\\mathbf{t} = \\mathbf{A}\\mathbf{s} + \\mathbf{e}$ inside $\\mathcal{V}(\\mathbf{0})$ and $\\mathcal{P}_{1/2}(\\mathbf{B}_{LLL})$ but outside $\\mathcal{P}_{1/2}(\\mathbf{B}_{bad})$.",
  },
  "FE-BIO-01": {
    coreKey: "epegRNA 3' evoPreQ1 Pseudoknot & PEmax Reverse Transcriptase Elongation Complex",
    groundTruth:
      "- **Authoritative Structures & Catalysis**: PDB 8WUV (SpCas9-M-MLV RT-pegRNA-DNA 16-nt elongation complex, $2.90\\,\\text{\\AA}$) and PDB 6E1W (Class I preQ1 pseudoknot, $1.69\\,\\text{\\AA}$); M-MLV RT active site Asp524/Asp525/Glu562 coordinates two $\\text{Mg}^{2+}$ ions ($\\text{Mg}^{2+}\\text{-O} = 2.08 \\pm 0.12\\,\\text{\\AA}$) while SpCas9 D10A nickase cleaves the non-target strand via H840. - **Pseudoknot Thermodynamics**: H-type evoPreQ1 pseudoknot (5-bp Stem 1, 6-bp Stem 2, G15:C30 pair, A14:G11:C28 base triple at $3.4 \\pm 0.2\\,\\text{\\AA}$, $\\Delta G^\\circ = -14.6\\,\\text{kcal/mol}$).",
    evaluationCriteria:
      "- **Required DOM Groups & Topology**: Contains `<g>` groups `cas9-core`, `rt-domain`, `r-loop-heteroduplex`, `linker-8nt`, and `evopreq1-pseudoknot`, depicting bilobed SpCas9, right-hand M-MLV RT, and 3' 8-nt linker plus two-stem H-type pseudoknot; - **Macromolecular Palette**: Adheres to specified hex palette (`#475569`/`#06b6d4` Cas9, `#7c3aed` RT, `#f59e0b` pegRNA, `#10b981` evoPreQ1, `#ec4899` nascent DNA).",
  },
  "FE-BIO-02": {
    coreKey: "Narrow-Window Adenine Base Editor TadA-NW1 Active-Site Steric Constriction & Bystander Suppression",
    groundTruth:
      "- **Catalytic Pocket Geometry (PDB 6VPC)**: Tetrahedral $\\text{Zn}^{2+}$ coordinated by His57, Cys87, and Cys90 ($\\text{Zn-S} = 2.32 \\pm 0.10\\,\\text{\\AA}$, $\\text{Zn-N} = 2.05 \\pm 0.10\\,\\text{\\AA}$) with general acid/base Glu59 at $3.8 \\pm 0.3\\,\\text{\\AA}$ from substrate C6-amino. - **Narrow-Window Steric Bottleneck**: TadA-NW1 narrows the entrance cleft from $14.2\\,\\text{\\AA} \\times 9.8\\,\\text{\\AA}$ (wide ABE8e window A3–A8) to $7.5\\,\\text{\\AA} \\times 6.2\\,\\text{\\AA}$, rejecting bystanders A3/A8 ($\\Delta G_{\\text{steric}} > +18\\,\\text{kcal/mol}$) while admitting target A6.",
    evaluationCriteria:
      "- **3-Phase Steric Discrimination Animation**: $0.0\\text{–}3.0\\,\\text{s}$ bystander A3 collides with steric side-chains and rebounds with red clash warning; $3.5\\text{–}6.5\\,\\text{s}$ target A6 enters the pocket for $\\text{Zn}^{2+}\\text{-Glu59}$ capture; $6.5\\text{–}8.0\\,\\text{s}$ deaminated inosine (I) releases; - **Active-Site Annotation & Pure SMIL**: Clearly marks tetrahedral $\\text{Zn}^{2+}$ coordination and Glu59 using pure `<animate>`/`<animateTransform>`.",
  },
  "FE-BIO-03": {
    coreKey: "De Novo Designed Mechanically Interlocked D8-C4 Rotary Protein Nanomotor",
    groundTruth:
      "- **Authoritative Structures & Dimensions**: PDB 8GA9 ($3.10\\,\\text{\\AA}$), PDB 8EOV ($2.40\\,\\text{\\AA}$), and EMDB-25575; outer C4 rotor ring ($OD = 115 \\pm 5\\,\\text{\\AA}$, bore $ID = 42.0 \\pm 1.5\\,\\text{\\AA}$) non-covalently interlocked around an inner D8 axle ($OD = 38.0 \\pm 1.0\\,\\text{\\AA}$) with radial steric clearance of $2.0 \\pm 0.5\\,\\text{\\AA}$. - **Rotational Energy Landscape**: Hydrophobic Leu/Val sliding interface yields a $90^\\circ$-step barrier $\\Delta G^\\ddagger \\approx 12.5\\,\\text{kcal/mol}$ and rotational diffusivity $D_{\\text{rot}} \\approx 1.8 \\times 10^5\\,\\text{rad}^2/\\text{s}$.",
    evaluationCriteria:
      "- **C4-on-D8 Symmetry & Concentric Rotation**: Top view exhibits exact 4-fold ($90^\\circ$) outer rotor symmetry around an 8-fold ($45^\\circ$) dihedral inner axle, driven by continuous concentric `<animateTransform type=\"rotate\">` while the axle stays fixed; - **Zero Steric Clash**: Maintains positive radial clearance ($> 0$) between rotor bore and axle outer contour at all rotation angles.",
  },
  "FE-BIO-04": {
    coreKey: "Organ-Specific SORT-LNP Delivery & Acid-Triggered Inverted Hexagonal (H_II) Endosomal Escape",
    groundTruth:
      "- **SORT Lipid Formulations**: Lung-SORT adds $50\\,\\text{mol\\%}$ cationic DOTAP ($50\\%$ DOTAP / $25\\%$ MC3 / $15\\%$ Chol / $8\\%$ DOPE / $2\\%$ DMG-PEG); Spleen-SORT adds $15\\,\\text{mol\\%}$ anionic 18PA. - **Packing Parameter & $L_\\alpha \\to H_{II}$ Phase Transition**: Dimensionless packing parameter $S = v / (a_0 l_c)$ shifts from $S \\approx 0.8 < 1$ at pH 7.4 (cylindrical lipids, lamellar $L_\\alpha$) to $S > 1.2$ at endosomal pH 5.0 (protonated tertiary amine pairs with anionic PS, shrinking headgroup area $a_0$ by $45\\%$ into inverted cones) to form inverted hexagonal $H_{II}$ cylinders ($d_w = 2.4 \\pm 0.3\\,\\text{nm}$, pitch $d = 6.5 \\pm 0.5\\,\\text{nm}$).",
    evaluationCriteria:
      "- **Dual-Panel pH 7.4 vs. pH 5.0 Comparison**: Left panel shows a spherical lamellar LNP at pH 7.4; right panel shows pH 5.0 honeycomb inverted hexagonal ($H_{II}$) cylinders fusing with the endosomal bilayer to open an mRNA escape pore; - **Inverted-Cone Lipid Inset**: Magnified inset illustrates small ion-paired headgroups and splayed hydrophobic tails radiating outward around aqueous mRNA channels.",
  },
  "FE-BIO-05": {
    coreKey: "Next-Gen ADC Trastuzumab Deruxtecan (T-DXd) Cathepsin B Cleavage & Bystander Membrane Permeation",
    groundTruth:
      "- **Structures & Bioconjugate Constants**: PDB 1N8Z (Trastuzumab Fab-HER2, $2.52\\,\\text{\\AA}$) and PDB 1HUC (Cathepsin B, $2.15\\,\\text{\\AA}$); drug-to-antibody ratio $\\text{DAR} = 7.7 \\pm 0.3 \\approx 8$. - **Cleavage & Payload Permeability**: Lysosomal Cathepsin B hydrolyzes the tetrapeptide GGFG linker at the Gly-DXd amide bond ($k_{\\text{cat}}/K_m \\approx 4.2 \\times 10^4\\,\\text{M}^{-1}\\text{s}^{-1}$ at pH 5.0; $<1.5\\%$ plasma degradation over 21 days at pH 7.4), releasing membrane-permeable DXd ($\\text{MW} = 429.4\\,\\text{Da}, \\text{cLog}P = 1.82, \\text{tPSA} = 92.4\\,\\text{\\AA}^2$).",
    evaluationCriteria:
      "- **4-Stage Bystander Killing Cycle**: Animates (1) DAR=8 antibody binding to HER2 domain IV, (2) lysosomal endocytosis and Cathepsin B (Cys29-His199) cleavage of GGFG, (3) free DXd transmembrane diffusion out of the HER2+ cell, and (4) Topoisomerase I inhibition in adjacent HER2-negative tumor nuclei; - **DOM Assertions**: Includes explicit `<path id=\"ggfg-cleavage-site\">` and `<circle class=\"dxd-payload\">` elements with animated transmembrane displacement.",
  },
  "FE-BIO-06": {
    coreKey: "Rigid Honeycomb DNA Origami Nanorobot Dual-Aptamer AND-Gate Hinge Actuation",
    groundTruth:
      "- **Origami Barrel Geometry & Lattice**: Closed hexagonal barrel of length $45.0 \\pm 1.0\\,\\text{nm}$ and circumscribed diameter $35.0 \\pm 1.0\\,\\text{nm}$ built from 24 parallel B-DNA double helices on a honeycomb lattice ($2.5\\,\\text{nm}$ inter-helical spacing) joined by two 12-nt ssDNA M13mp18 posterior hinges. - **Dual-Aptamer AND-Gate Thermodynamics**: Anterior aptamer locks with 6-nt toeholds undergo strand displacement ($\\Delta G^\\circ = -18.2\\,\\text{kcal/mol}$, single-input leakage $<2\\%$) to spring open the clamshell by $\\theta = 120^\\circ$.",
    evaluationCriteria:
      "- **4-Phase AND-Gate Actuation Sequence**: (1) $0.0\\text{–}2.0\\,\\text{s}$ closed barrel locked; (2) $2.0\\text{–}4.0\\,\\text{s}$ two distinct antigen keys simultaneously bind left and right aptamer locks; (3) $4.0\\text{–}6.0\\,\\text{s}$ dual locks unzip and clamshell halves swing open $\\theta = 120^\\circ$ to expose internal payload spheres; (4) $6.0\\text{–}8.0\\,\\text{s}$ payload release and reset; - **Honeycomb Cross-Section**: Each half-barrel displays 12 hexagonally packed DNA cylinders.",
  },
  "FE-BIO-07": {
    coreKey: "Octagonal Nuclear Pore Complex (NPC C8 Scaffold) & FG-Nup Phase-Separated Molecular Sieve Percolation",
    groundTruth:
      "- **Authoritative Structures & C8 Symmetry**: PDB 7R5J / 7PEQ ($12\\,\\text{\\AA}$ integrated NPC scaffold) and PDB 3ND2 (Importin-$\\beta$-FG peptide complex, $2.80\\,\\text{\\AA}$); 8-fold rotational symmetry ($OD = 120 \\pm 5\\,\\text{nm}$, central channel diameter $48 \\pm 2\\,\\text{nm}$, depth $80 \\pm 5\\,\\text{nm}$) with 16 Y-complexes per cytoplasmic/nuclear ring. - **FG-Nup Condensate Sieve**: Central channel contains $40\\text{–}50\\,\\text{mM}$ FG repeats forming a hydrophobic mesh of pore size $\\xi = 4.2 \\pm 0.5\\,\\text{nm}$ ($40\\,\\text{kDa}$ passive cutoff) that Importin-$\\beta$ transiently melts ($\\Delta G \\approx -3.5\\,\\text{kcal/mol}$ per FG pocket) in $5\\text{–}10\\,\\text{ms}$.",
    evaluationCriteria:
      "- **Macroscopic C8 Octagonal Ring**: Renders 8 radially symmetric spokes ($45^\\circ$ pitch) and concentric Y-complex rings; - **Selective Sieve Percolation Contrast**: Central hydrogel mesh simultaneously shows passive rejection of inert macromolecules ($>5\\,\\text{nm}$) and facilitated translocation of crescent-shaped Importin-$\\beta$-NLS cargo complexes via transient FG-repeat exchange.",
  },
  "FE-BIO-08": {
    coreKey: "Kinesin-1 Dimeric Hand-Over-Hand 16.4 nm / 8.2 nm Microtubule Stepping & Neck Linker Tension",
    groundTruth:
      "- **Structures & Mechanochemical Parameters**: PDB 3KIN, PDB 1MKJ, and EMDB-8546; microtubule protofilament binding pitch is $8.2 \\pm 0.1\\,\\text{nm}$ (center-of-mass step), while the trailing head swings forward by $16.4 \\pm 0.2\\,\\text{nm}$ per step against a stall force $F_{\\text{stall}} = 6.5 \\pm 0.5\\,\\text{pN}$. - **Neck Linker Zipper**: ATP binding to the leading head docks its 14-aa neck linker ($\\Delta G_{\\text{dock}} \\approx -4.2\\,\\text{kcal/mol}$) to throw the ADP-bound trailing head forward.",
    evaluationCriteria:
      "- **4-Phase Hand-Over-Hand Cycle ($6.0\\,\\text{s}$)**: (1) Leading head nucleotide-free, trailing head ADP-bound; (2) ATP binds leading head, yellow neck linker docks, and trailing head detaches; (3) trailing head translates $16.4\\,\\text{nm}$ past the leading head to land at $+8.2\\,\\text{nm}$ and releases ADP; (4) new trailing head hydrolyzes ATP $\\to$ ADP+Pi; - **8.2 nm Microtubule Ruler**: Alternating $\\alpha/\\beta$-tubulin dimers marked with an $8.2\\,\\text{nm}$ scale.",
  },
  "FE-BIO-09": {
    coreKey: "Mitochondrial ATP Synthase (FoF1) c8-Ring Proton Rotation & Asymmetric Gamma-Shaft Torque Transmission",
    groundTruth:
      "- **Structures & Stoichiometry**: PDB 6TT7 (mammalian $F_oF_1$ ATP synthase, $3.20\\,\\text{\\AA}$) and PDB 6CP6; comprises $(\\alpha\\beta)_3$ catalytic hexamer, peripheral stalk $b_2\\text{-}d\\text{-OSCP}$, membrane stator $a$ ($a\\text{Arg210}$), rotor $c_8$ ring ($c\\text{Glu58}$), and central asymmetric $\\gamma\\delta\\epsilon$ shaft. - **Bioenergetic Coupling**: Driven by $\\Delta p \\approx 200\\,\\text{mV}$, one $360^\\circ$ rotation translocates $8\\,\\text{H}^+$ to synthesize $3\\,\\text{ATP}$ ($8/3 \\approx 2.67\\,\\text{H}^+/\\text{ATP}$) at $40\\text{–}45\\,\\text{pN}\\cdot\\text{nm}$ torque.",
    evaluationCriteria:
      "- **Coupled Rotor-Shaft & Stationary Hexamer**: Membrane $c_8$ ring and central curved $\\gamma$ shaft rotate synchronously while the $(\\alpha\\beta)_3$ head stays anchored by the $b_2\\text{-OSCP}$ peripheral stalk and cycles its three $\\beta$ subunits through Open (`#94a3b8`) $\\to$ Loose (`#38bdf8`) $\\to$ Tight (`#fbbf24`) Boyer states; - **Proton Half-Channels**: Protons enter the upper IMS $a$-subunit half-channel, ride the $c_8$ ring $\\sim 300^\\circ$, and exit into the matrix.",
  },
  "FE-BIO-10": {
    coreKey: "CRISPR-Cas12a Target-Activated RuvC Lid Opening & Collateral ssDNA Trans-Cleavage Biosensor",
    groundTruth:
      "- **Structures & Catalytic Triad**: PDB 5XUS ($2.38\\,\\text{\\AA}$) and PDB 6GTC; RuvC active-site triad Asp998, Glu1006, and Asp1263 chelates two $\\text{Mg}^{2+}$ ions ($d = 3.8 \\pm 0.2\\,\\text{\\AA}$). - **Lid-Loop Gating & Trans-Cleavage Kinetics**: Target dsDNA R-loop formation shifts the REC lobe and pulls open the RuvC Lid Loop (aa 1010–1025) by $14.8 \\pm 1.2\\,\\text{\\AA}$, unleashing collateral ssDNA cleavage ($k_{\\text{cat}} \\approx 1500\\text{–}2500\\,\\text{min}^{-1}, K_m \\approx 1.2\\,\\mu\\text{M}$, attomolar $10^{-18}\\,\\text{M}$ sensitivity).",
    evaluationCriteria:
      "- **3-Act Biosensor Animation**: Act 1 ($0.0\\text{–}2.5\\,\\text{s}$): binary Cas12a-crRNA scans dsDNA with RuvC occluded by the dark Lid loop; Act 2 ($2.5\\text{–}5.0\\,\\text{s}$): PAM recognition and R-loop formation flip the REC lobe and open the red Lid loop by $15\\,\\text{\\AA}$ to expose the two-$\\text{Mg}^{2+}$ center; Act 3 ($5.0\\text{–}8.0\\,\\text{s}$): collateral cleavage severs FAM-IBFQ ssDNA reporters, surging FAM fluorescence `fill-opacity` from $0.2$ to $1.0$.",
  },
};
