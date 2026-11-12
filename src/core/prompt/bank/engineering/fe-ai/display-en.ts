import type { LocalizedStandardEntry } from "../../../types";

export const FE_AI_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-ai-v1": "FE-1: AI Compute & Physical AI (10-Prompt Suite)",
};

export const FE_AI_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-ai-v1": {
    coreKey: "Physical AI Spatial Causal Reasoning, Embodied Dynamics & LLM Mechanistic Interpretability",
    groundTruth:
      "Grounded in rigid-body multi-impact impulse-momentum conservation, weakly compressible SPH free-surface hydrodynamics, bipedal LIPM Zero-Moment-Point limit cycles, and Transformer mechanistic circuits (induction head QK/OV decomposition, SAE polytope geometry), strictly adhering to physical conservation laws and mathematical theorems.",
    evaluationCriteria:
      "1. Physical fidelity: Impulse conservation, hyperbolic phase-plane asymptotes, and fluid regime evolution obey analytical dynamics; 2. Mechanistic decoupling: Residual stream and cross-layer causal circuits are topologically consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
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
};
