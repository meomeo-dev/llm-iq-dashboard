import type { LocalizedStandardEntry } from "../../../types";

export const FE_QUANTUM_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-quantum-v1": "FE-3: Fault-Tolerant Quantum & Post-Quantum (10-Prompt Suite)",
};

export const FE_QUANTUM_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-quantum-v1": {
    coreKey: "Fault-Tolerant Surface-Code QEC, Neutral-Atom Optical Tweezers & Superconducting Anharmonic Energy Levels",
    groundTruth:
      "Grounded in rotated surface-code stabilizer syndrome decoding, neutral-atom optical tweezer Hungarian collision-free routing, Rydberg blockade Z2 phase transitions, Transmon Josephson cosine potential bound states, and post-quantum LWE lattice geometry, obeying quantum Hamiltonians and wavefunction evolution.",
    evaluationCriteria:
      "1. Topology & state vectors: Stabilizer plaquette parity, Wigner quasiprobability fringes, and wavefunction node parities are exact; 2. Dynamical evolution: Coherent phase-space trajectories and braiding worldlines close cleanly; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
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
};
