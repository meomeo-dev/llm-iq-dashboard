/**
 * English PromptStandard definitions for the 24 suite-level prompts
 * (8 Four Classic Novels suites, 2 World Landmarks suites, 8 FE suites, 6 VFX suites).
 */

import type { LocalizedStandardEntry } from "./standards-single-en";

export const STANDARDS_SUITES_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-v1": {
    coreKey: "Water Margin Classical Narrative Composition & Iconic Character Weapons/Postures",
    groundTruth:
      "Faithfully depicts the canonical episode from Water Margin (e.g., Lu Da punching Butcher Zheng, uprooting the weeping willow, Lin Chong at the Mountain Spirit Temple in the blizzard with spear and gourd, Wu Song fighting the tiger on Jingyang Ridge) without anachronistic modern or theatrical distortions.",
    evaluationCriteria:
      "1. Character identity: Signature weapons and Song-dynasty attire match the original novel; 2. Narrative conflict: Key props, environment, and action postures capture the core dramatic conflict of the chapter.",
  },
  "shuihu-anim-v1": {
    coreKey: "Water Margin Narrative Reconstruction & Pure Inline Kinematic Action Animation",
    groundTruth:
      "Faithfully captures the dramatic martial tension of the selected Water Margin scene with continuous, smooth inline SVG animation (SMIL or CSS @keyframes), accurate joint pivot centers, and strictly well-formed XML.",
    evaluationCriteria:
      "1. Motion quality: Core actions (striking, uprooting, swirling blizzard, galloping) loop smoothly around proper pivot centers; 2. Historical fidelity: Song-dynasty attire and weaponry match the text; 3. XML compliance: Zero XML parse errors, no duplicate attributes, and zero <script> tags.",
  },
  "xiyou-v1": {
    coreKey: "Journey to the West Mythological Composition & Iconic Magical Artifacts",
    groundTruth:
      "Faithfully depicts the canonical mythological scene from Journey to the West (e.g., Stone Monkey entering Water-Curtain Cave, claiming the Golden-Hooped Rod at the Dragon Palace, Five-Finger Mountain, Three Battles with the White Bone Demon, Quenching the Flaming Mountains with the Plantain Fan) with expressive characters and atmosphere.",
    evaluationCriteria:
      "1. Magical artifacts: Iconic treasures (Ruyi Jingu Bang, Plantain Fan, Buddha's palm seal) are accurately represented; 2. Scene recognizability: Environmental setting and character silhouettes match the novel.",
  },
  "xiyou-anim-v1": {
    coreKey: "Journey to the West Mythological Artifact Aura & Pure Inline Transform/Motion Animation",
    groundTruth:
      "Faithfully depicts the magical artifacts and supernatural powers of Journey to the West with continuous, smooth inline SVG animation (scaling Golden-Hooped Rod, billowing Samadhi flames, sweeping Plantain Fan gales) and strictly well-formed XML.",
    evaluationCriteria:
      "1. Magical VFX animation: Flowing divine auras, rolling flames, and artifact transformations animate smoothly; 2. Character iconography: Monkey King and celestial/demonic figures are clearly recognizable; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
  "sanguo-v1": {
    coreKey: "Romance of the Three Kingdoms Historical Lore & Heroic General Iconography",
    groundTruth:
      "Faithfully depicts the canonical historical episode from Romance of the Three Kingdoms (e.g., Oath of the Peach Garden, Three Heroes battling Lü Bu at Hulao Pass, Warming Wine and Discussing Heroes, Zhao Yun at Changban, Borrowing Arrows with Straw Boats, Empty Fort Strategy).",
    evaluationCriteria:
      "1. Iconic emblems: Signature weapons and props (Green Dragon Crescent Blade, Dual Halberds, feather fan, guqin, straw-covered boats) are accurate; 2. Historical gravitas: Composition conveys the strategic tension and martial presence of the era.",
  },
  "sanguo-anim-v1": {
    coreKey: "Three Kingdoms Battlefield Dynamics & Pure Inline Weapon/Elemental Animation",
    groundTruth:
      "Faithfully captures the battlefield momentum and strategic tension of Romance of the Three Kingdoms with continuous, smooth inline SVG animation (volleys of arrows, sweeping polearms, galloping steeds, billowing war banners) and strictly well-formed XML.",
    evaluationCriteria:
      "1. Battlefield kinematics: Clashing weapons, arrow trajectories, wind, and wave motions loop smoothly; 2. Period authenticity: Late-Han/Three-Kingdoms armor, weaponry, and architecture match historical lore; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
  "honglou-v1": {
    coreKey: "Dream of the Red Chamber Classical Poetic Imagery & Refined Attire/Garden Aesthetics",
    groundTruth:
      "Faithfully depicts the poetic classical scene from Dream of the Red Chamber (e.g., Daiyu entering Rongguo Mansion, Daiyu burying fallen blossoms with hoe and silk pouch, Qingwen tearing folding fans, Granny Liu touring Grand View Garden, Baoqin standing in snow holding red plum blossoms) with refined classical palette.",
    evaluationCriteria:
      "1. Poetic details: Key symbolic props (flower-burial mound, folding fans, red plum cloak in snow, burning poems) are accurately rendered; 2. Classical grace: Architectural framing and character attire reflect Grand View Garden aesthetics.",
  },
  "honglou-anim-v1": {
    coreKey: "Dream of the Red Chamber Poetic Atmosphere & Pure Inline Petal/Snow/Breeze Animation",
    groundTruth:
      "Faithfully captures the poetic space of Grand View Garden with continuous, smooth inline SVG animation (drifting flower petals, fluttering butterflies, flickering candle flames, falling snow) and strictly well-formed XML.",
    evaluationCriteria:
      "1. Poetic particle & breeze motion: Drifting blossoms, snowflakes, and rising smoke move gently and seamlessly; 2. Classical aesthetics: Refined gongbi-inspired brushwork and classical costume silhouettes; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
  "landmarks-v1": {
    coreKey: "Structural & Proportional Reconstruction of World Landmarks Rendered as Isometric Miniature Dioramas",
    groundTruth:
      "Each candidate scene is backed by an independent fact sheet (construction date, height and base footprint dimensions, tier divisions, materials and color palette, surrounding environment) sourced from Wikidata (CC0) and Wikipedia architectural facts.",
    evaluationCriteria:
      "Evaluated against each candidate's specific standard; common requirements: landmark is immediately recognizable, key structural components are complete, proportions and colors match the fact sheet, presented as an elevated three-quarter miniature diorama on a circular display plinth, with zero text or flags.",
  },
  "landmarks-anim-v1": {
    coreKey: "World Landmark Structural & Proportional Fidelity Combined with Pure Inline Looping Diorama Animation",
    groundTruth:
      "Architectural fact sheets are identical to the static edition; inline animation applies exclusively to naturally moving elements in the environment section (looping smoothly over 4–12 seconds via SMIL or inline CSS @keyframes) while the main landmark remains stationary; scenes without moving props remain static.",
    evaluationCriteria:
      "First evaluate structure, proportions, and colors against the static criteria, then evaluate motion: only naturally moving environment props animate, loops are smooth without jump cuts, rotations/sways pivot around each object's own local axis, the main landmark stays stationary, no extra objects or lighting effects are added for animation, zero JavaScript, and valid XML.",
  },
  "fe-ai-v1": {
    coreKey: "Physical AI Spatial Causal Reasoning, Embodied Dynamics & LLM Mechanistic Interpretability",
    groundTruth:
      "Grounded in rigid-body multi-impact impulse-momentum conservation, weakly compressible SPH free-surface hydrodynamics, bipedal LIPM Zero-Moment-Point limit cycles, and Transformer mechanistic circuits (induction head QK/OV decomposition, SAE polytope geometry), strictly adhering to physical conservation laws and mathematical theorems.",
    evaluationCriteria:
      "1. Physical fidelity: Impulse conservation, hyperbolic phase-plane asymptotes, and fluid regime evolution obey analytical dynamics; 2. Mechanistic decoupling: Residual stream and cross-layer causal circuits are topologically consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-semi-v1": {
    coreKey: "Sub-Angstrom Semiconductor Device Micro-Topology, Backside Power Delivery & High-NA EUV Optics",
    groundTruth:
      "Grounded in A16 angstrom-class Gate-All-Around (GAA) nanosheets, Backside Power Delivery Networks (BSPDN), monolithic 3D CFET complementary stacking, and High-NA 0.55 EUV anamorphic reflective lithography optics, preserving angstrom-scale dimensional tolerances and band-diagram alignment.",
    evaluationCriteria:
      "1. Cross-sectional topology: Nanosheet ribbons, 360° gate stacks, inner spacers, and nano-TSV interconnects are layered accurately; 2. Optical ray paths: Anamorphic magnification (4x/8x) and chief-ray angles are geometrically self-consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-quantum-v1": {
    coreKey: "Fault-Tolerant Surface-Code QEC, Neutral-Atom Optical Tweezers & Superconducting Anharmonic Energy Levels",
    groundTruth:
      "Grounded in rotated surface-code stabilizer syndrome decoding, neutral-atom optical tweezer Hungarian collision-free routing, Rydberg blockade Z2 phase transitions, Transmon Josephson cosine potential bound states, and post-quantum LWE lattice geometry, obeying quantum Hamiltonians and wavefunction evolution.",
    evaluationCriteria:
      "1. Topology & state vectors: Stabilizer plaquette parity, Wigner quasiprobability fringes, and wavefunction node parities are exact; 2. Dynamical evolution: Coherent phase-space trajectories and braiding worldlines close cleanly; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-bio-v1": {
    coreKey: "Engineered Biology Catalytic Mechanisms, Macromolecular Cryo-EM Topology & De Novo Nanomachines",
    groundTruth:
      "Grounded in experimental PDB cryo-EM and crystal structures (8WUV, 6VPC, 8GA9, 7R5J, 3KIN, 6TT7, 5XUS), accurately depicting active-site metal-ion coordination, steric hindrance windows, mechanically interlocked C4/D8 symmetry, and mechanochemical stepping cycles.",
    evaluationCriteria:
      "1. Molecular topology: Accurately reconstructs bi-lobed/right-hand protein domains, H-type RNA pseudoknots, and sub-3 Å steric clearances; 2. Dynamic phase transitions: Faithfully follows mechanochemical cycles and selective phase-separated sieve percolation; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-energy-v1": {
    coreKey: "Extreme Fusion Plasma Magnetic Confinement, Solid-State Electrochemical Interfaces & Radiative Sky Cooling",
    groundTruth:
      "Grounded in high-field compact Tokamak Grad-Shafranov equilibria, quasi-isodynamic stellarator 3D island divertors, ICF hohlraum laser implosion hydrodynamics, and all-solid-state sulfide battery Griffith chemo-mechanical fracture criteria, satisfying MHD and thermodynamic conservation laws.",
    evaluationCriteria:
      "1. Magnetic & flux surfaces: Closed nested flux surfaces, X-point divertor strike lines, and field-reversed configurations are topologically sound; 2. Interfacial transport: Electrochemical overpotential gradients, multi-phase Darcy percolation, and spectral emissivity windows obey physical laws; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-aero-v1": {
    coreKey: "Booster Chopstick Catch Dynamics, Rotating Detonation Combustion & Hypersonic Reentry Shock Interaction",
    groundTruth:
      "Grounded in heavy-lift launch tower chopstick catch damping mechanics, Rotating Detonation Rocket Engine (RDRE) supersonic shock-wave reflections, lunar-return skip-reentry lift-to-drag corridor envelopes, and deep-ocean Ti-6Al-4V pressure-hull buckling, obeying Newtonian mechanics, gas dynamics, and finite-element stress equations.",
    evaluationCriteria:
      "1. Trajectory & aerodynamics: Reentry skip corridors, isolator Mach stems, and oblique shock polar angles match compressible gas dynamics; 2. Structural mechanics: Gimbal attitude decoupling, drill-string helical buckling, and von Mises stress contours are physically consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-meta-v1": {
    coreKey: "Auxetic Mechanical Metamaterials, Topological Phononic Insulators & Magic-Angle Moiré Superlattice Relaxation",
    groundTruth:
      "Grounded in negative-Poisson's-ratio (auxetic) rotating-square kinematics, acoustic valley-Hall backscattering-immune edge waveguides, Pancharatnam-Berry spin-decoupled chiral metasurfaces, epsilon-near-zero (ENZ) phase tunneling, and magic-angle twisted bilayer graphene atomic reconstruction.",
    evaluationCriteria:
      "1. Lattice symmetry: Periodic unit cells, C4/C6 rotational symmetries, and moiré soliton networks maintain exact geometric ratios; 2. Wave propagation: Topological edge states, quantized quadrupole corner modes, and spatial Laplace differentiation profiles are physically accurate; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "fe-neuro-v1": {
    coreKey: "Kilochannel Flexible Neural Microwires, Microelectrode Randles Impedance & Biomimetic Tactile E-Skin",
    groundTruth:
      "Grounded in 1024-channel flexible polyimide microwire vascular-avoidance insertion mechanics, nanoporous PEDOT:PSS/CNT modified Randles electrochemical impedance spectroscopy (EIS), micropyramid piezoresistive normal/shear force decoupling, and 16x expansion microscopy synaptic connectomics.",
    evaluationCriteria:
      "1. Electrophysiological consistency: Bode/Nyquist impedance spectra, extracellular spike attenuation fields, and neuronal avalanche power laws match quantitative benchmarks; 2. Biomimetic microstructure: Micropyramid stress concentration, ionotronic EDL gradients, and 3D honeycomb field confinement are clearly resolved; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "vfx-sim-v1": {
    coreKey: "Incremental Potential Contact (IPC), Surface-Tension Crown Splash & Ferrofluid Rosensweig Instability",
    groundTruth:
      "Grounded in intersection-free C2 logarithmic barrier potentials (IPC), Drucker-Prager elastoplastic granular column collapse, Young-Laplace crown splash Worthington jets, Giesekus viscoelastic die swell, and Richtmyer-Meshkov shock-bubble baroclinic vorticity roll-up.",
    evaluationCriteria:
      "1. Intersection-free guarantee: Contact clearances remain strictly positive with zero geometric interpenetration; 2. Continuum topology: Shear bands, wrinkling wave numbers, K-H billow pairing, and dynamic phase-field crack branching match PDE solutions; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "vfx-optics-v1": {
    coreKey: "Explicit 3D Gaussian Splatting (3DGS), Kerr Black Hole Geodesic Lensing & Wave-Optics Structural Color",
    groundTruth:
      "Grounded in 3DGS EWA covariance ellipse projection, Kerr metric photon-sphere D-shaped shadows and g^4 relativistic Doppler beaming, multilayer thin-film Airy interference, ReSTIR GI shift-mapping Jacobians, and directional dipole BSSRDF subsurface scattering profiles.",
    evaluationCriteria:
      "1. Optical accuracy: Kerr shadow asymmetry, relativistic aberration angles, thin-film Newton black-spot thresholds, and Wollaston birefringent ray splitting match analytical formulas; 2. Geometric projection: Covariance ellipses, spherical harmonic lobes, and hyperbolic umbilic caustics are distortion-free; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "vfx-geom-v1": {
    coreKey: "Discrete Exterior Calculus (DEC), 4D Tesseract SO(4) Isoclinic Rotation & Non-Euclidean Manifold Immersion",
    groundTruth:
      "Grounded in cotangent Laplace-Beltrami heat-method geodesics, 4D tesseract SO(4) isoclinic double rotation in the Coxeter plane, figure-8 Klein bottle smooth immersion, Hopf fibration nested Villarceau tori, discrete Ricci flow circle-packing conformal parameterization, and Poincaré disk {7,3} hyperbolic tiling.",
    evaluationCriteria:
      "1. Topological invariants: Manifold genus, linking numbers (|Lk|=1), normal holonomy sign flips, and Euler characteristic are exact; 2. Conformal & metric fidelity: 4D rotational symmetry, Tissot circle preservation, zero mean curvature (H=0), and orthogonal boundary arcs are preserved; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "vfx-scivis-v1": {
    coreKey: "Second-Order Tensor Hyperstreamlines, FTLE Lagrangian Coherent Structures & Magnetic Reconnection X-Point Topology",
    groundTruth:
      "Grounded in double-gyre FTLE transport barrier ridges, 2D Morse-Smale scalar field topological complexes, degenerate tensor field trisector/wedge singularities, Pack supersonic shock-diamond wavelength formulas, Petschek magnetic reconnection X-points, and Ginzburg-Landau Abrikosov vortex lattices.",
    evaluationCriteria:
      "1. Topological singularities: Poincaré-Hopf index sums, trisector/wedge streamline branches, and phase winding numbers (2π) are exact; 2. Physical fields: Shock polar angles, altitude-stratified auroral emission profiles, and knotted vortex tube helicity are quantitatively consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "vfx-motion-v1": {
    coreKey: "SLIP Running Limit Cycles, Hill-Type Muscle Mechanics & Anatomical Soft-Tissue CFX",
    groundTruth:
      "Grounded in Spring-Loaded Inverted Pendulum (SLIP) phase portraits, Hill-type 3-element musculotendon force-velocity curves, Stable Neo-Hookean volume-preserving muscle bulging with fascia sliding, Hildebrand Froude-number quadrupedal gait transitions, and Lighthill carangiform reverse-Kármán vortex propulsion.",
    evaluationCriteria:
      "1. Dynamical periodicity: Limit-cycle phase trajectories close smoothly, and Instantaneous Capture Point (ICP) stepping remains inside friction-cone constraints; 2. Biomechanical deformation: Volume-preserving muscle cross-sections, discrete elastic rod plectoneme writhing (Lk=Tw+Wr), and soft-finger limit ellipsoids are accurate; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "vfx-sys-v1": {
    coreKey: "In-Camera VFX Off-Axis Frustum Projection, ACES 2.0 CAM16 Gamut Mapping & OpenEXR Deep Volumetric Compositing",
    groundTruth:
      "Grounded in Kooima generalized off-axis perspective projection matrices, rolling-shutter vs. LED PWM genlock Moiré filtering, OpenEXR Beer-Lambert deep sample splitting, ACES 2.0 CAM16-Hellwig JMh gamut compression, continuous-time Dual Quaternion Skinning (DQS) motion blur, and Halton(2,3) TAA variance clipping.",
    evaluationCriteria:
      "1. Projection & temporal alignment: Curved LED wall frustum seams remain collinear with foreground parallax, and Halton subpixel jitter / YCoCg AABB clipping are exact; 2. Color & shading pipelines: ACES 2.0 hue-linear desaturation, SMPTE ST 2084 PQ EOTF curves, Slang reverse-mode AD graphs, and slanted lenticular ray steering match reference equations; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
};
