/**
 * English PromptStandard definitions for the 30 single-benchmark prompts
 * (8 classic/viral, 8 2026-09 spatial/isometric, 7 engineering, 7 frontier-visual).
 */

import type { PromptStandard } from "../../prompt/types";

export type LocalizedStandardEntry = Omit<PromptStandard, "referenceSource">;

export const STANDARDS_SINGLE_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "classic-v1": {
    coreKey: "Out-of-Distribution (OOD) Composition & Subject-Object Articulation",
    groundTruth:
      "A California pelican (long bill, characteristic gular pouch, avian plumage) seated on a classic bicycle with front and rear wheels, diamond frame, handlebar, pedals, and saddle.",
    evaluationCriteria:
      "1. Well-formed XML: Self-contained valid SVG without truncation or parse errors; 2. Rider-bicycle topology: Pelican torso proportioned to the frame, with feet on pedals and body seated on the saddle; 3. Part legibility: Distinct wheels, frame triangles, and steering geometry.",
  },
  "upgraded-v2": {
    coreKey: "High-Density Anatomical & Mechanical Instruction Following (Spokes, Breeding Plumage, Pedaling)",
    groundTruth:
      "California brown pelican in full breeding plumage (white/yellow crown, dark chestnut/black hindneck, gray-brown body feathers); prominent gular pouch; spoked wheels; anatomically sound frame; active pedaling posture.",
    evaluationCriteria:
      "1. Spokes & frame: Both wheels must contain radial spokes and a structurally valid frame; 2. Breeding plumage & pouch: Distinct California brown pelican breeding coloration and large pouch; 3. Pedaling kinematics: Legs flexed in active pedaling posture with feet placed on the pedals.",
  },
  "animated-pelican-v1": {
    coreKey: "Pure Inline SVG Kinematics, Axle Transform Centers & Synchronous Pedaling Cycle",
    groundTruth:
      "Front and rear wheels continuously rotate around their own hub centers (cx, cy); crank arms and pedals revolve with 180° phase offset around the bottom bracket; pelican legs articulate in sync with the pedals; pure inline SMIL or CSS @keyframes with CDATA-wrapped styles.",
    evaluationCriteria:
      "1. Rotation centers: Rotating around global (0,0) so wheels fly off scores 0; steady rotation around each wheel axle passes; 2. Pedaling linkage: Continuous periodic leg extension synchronized with pedal motion; 3. XML compliance: Zero XML parse errors and zero <script> tags.",
  },
  "clock-v1": {
    coreKey: "Non-Linear Continuous Time-to-Angle Mapping (Clock-Drawing Test at 3:45)",
    groundTruth:
      "Circular dial with numerals 1–12; minute hand pointing at 9 (270° clockwise from 12 o'clock); hour hand advanced three-quarters of the way from 3 toward 4 at 90° + 22.5° = 112.5° (NOT horizontally at 90°).",
    evaluationCriteria:
      "1. Hour-hand angle (critical): Pointing horizontally at 3 (90°) fails the continuous gearing test; pointing at 112.5° (three-quarters toward 4) earns full credit; 2. Hand hierarchy: Distinct lengths/widths for hour, minute, and second hands with a center pin.",
  },
  "penrose-v1": {
    coreKey: "Isometric 3D Projection & Impossible Tribar Topological Paradox",
    groundTruth:
      "Three mutually orthogonal square beams in isometric projection forming a cyclic occlusion loop (A over B, B over C, C over A) with consistent three-tone directional shading across top, left, and right faces.",
    evaluationCriteria:
      "1. Impossible loop: Must form an Escher-style cyclic occlusion paradox rather than a flat triangle or broken joints; 2. Face shading: Crisp three-tone lighting across the three visible face orientations.",
  },
  "ice-water-v1": {
    coreKey: "Archimedes' Buoyancy Principle (~90% Submerged Ice) & Refractive Transparency",
    groundTruth:
      "Because ice density (~917 kg/m³) is ~91.7% of liquid water (~1000 kg/m³), roughly 90% of each floating ice cube's volume is submerged below the elliptical water meniscus, with only ~10% exposed above.",
    evaluationCriteria:
      "1. Buoyancy physics (core): Ice floating completely above the surface (0% submerged) or resting at the bottom fails; ~90% submerged below the meniscus earns full credit; 2. Optics: Translucent water column, meniscus ellipse, and refractive ice facets.",
  },
  "animated-armadillo-fishnet-mars-v1": {
    coreKey: "Quadrupedal Diagonal Walking Gait, Conformally Deforming Fishnet Mesh & Seamless Loop",
    groundTruth:
      "Nine-banded armadillo walking with alternating diagonal limb pairs (no ice-skating slide); diamond fishnet mesh conforming to flexing limbs; rhythmic carapace pitch/bob and undulating tail over Martian iron-oxide terrain; seamless loop (MAE ≡ 0, max MAE >= 0.015); 0 <script> tags.",
    evaluationCriteria:
      "Pass: Coordinated diagonal quadrupedal gait with grounded footfalls, conformally moving diamond fishnets, rhythmic carapace bobbing, Martian landscape, seamless loop (MAE ≡ 0, max MAE >= 0.015), 0 script; Partial: Skating limbs or detached mesh; Fail: Static image, <script> tag, or wrong subject.",
  },
  "animated-lemur-scooter-front-v1": {
    coreKey: "Orthographic Head-On Front Symmetry, Single-Leg Kick Propulsion & Coaxial Wheel Occlusion",
    groundTruth:
      "Strictly head-on front view (side profile is an automatic veto); bilateral symmetry RMSE <= 2.0%; one foot planted on deck while the other executes a forward swing–ground kick–lift cycle; front wheel coaxial with rear wheel; swaying banded tail; seamless loop (MAE ≡ 0, max MAE >= 0.015).",
    evaluationCriteria:
      "Pass: 100% head-on front perspective with horizontal handlebar, realistic single-leg ground kick cycle, deck suspension bounce, counter-swaying ringed tail, seamless loop, 0 script; Partial: Front view with jerky motion; Fail: Side view (0 pts veto), static image, or <script> tag.",
  },
  "animated-iso-vintage-pc-v1": {
    coreKey: "30° Isometric 3D Projection, Subtle Phosphor Breathing, 2 Hz Square-Wave Cursor Blink & Seamless Loop",
    groundTruth:
      "True 30° isometric projection coordinates x=(X-Y)*cos(30°)*s, y=((X+Y)*0.5-Z)*s; dark hairline technical figure three-tone shading (top #1f1f1f, left #181818, right #121212); 2 Hz cursor blink and subtle screen phosphor breathing; seamless loop closure MAE ≡ 0 with effective motion max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Parallel isometric axes with distinct top/left/right facet shading, 2 Hz cursor blink and screen breathing, seamless loop closure MAE ≡ 0 and max MAE >= 0.015, 0 script and zero XML errors; Partial: Correct geometry but loop seam jump or glow spill between 5%–15%; Fail: Static image (max MAE < 0.015), <script> tag, flat orthographic degeneration, or XML syntax errors.",
  },
  "animated-iso-amber-crt-v1": {
    coreKey: "Curved CRT Projection Bezel, Downward Rolling Scanline, Single-Focus Amber Glow & Seamless Cycle Closure",
    groundTruth:
      "Standard 30° isometric projection; screen interior bounded via clipPath; horizontal scanline sweeping downward at uniform velocity; warm amber glowing pixels strictly within 1%–5% of canvas area; seamless loop closure MAE ≡ 0 with effective motion max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Scanline sweeps smoothly downward clipped inside the CRT bezel, amber glow <= 5%, seamless loop closure MAE ≡ 0 and max MAE >= 0.015, 0 script and zero XML errors; Partial: Animated but scanline spills outside screen or glow is 5%–15%; Fail: Static image (max MAE < 0.015), <script> tag, non-isometric degeneration, or XML syntax errors.",
  },
  "animated-iso-server-rack-v1": {
    coreKey: "19-Inch Rack Grid, Integer-Divisor Clock Cadence, Multi-Channel LED Array, Coplanar Top Fans & 10s Seamless Loop",
    groundTruth:
      "30° isometric server rack grid; dual top exhaust fans rotating coplanarly within the isometric top plane; integer-divisor periodic LED blinking (0.5s/1s/2s/2.5s/5s/10s); frame-0 to frame-T pixel difference MAE ≡ 0.000 with max MAE >= 0.015; accent glow <= 3%; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: 10.0s loop closure MAE ≡ 0 with max MAE >= 0.015, LEDs aligned coplanarly on tray faceplates, dual top fans rotating coplanarly within the top facet; Partial: Non-divisor LED periods or slight fan wobble; Fail: Static image (max MAE < 0.015), fans flying off chassis, <script> tag, or XML syntax errors.",
  },
  "animated-iso-camera-exploded-v1": {
    coreKey: "Coaxial Exploded Kinematics, 4-Stage Cadence, Dynamically Anchored Leader Callouts & Drift-Free Restitution",
    groundTruth:
      "Optical-axis coaxiality tolerance <= 2.0px; 4-stage kinematic cycle (expansion 0–35% / exploded hold 35–60% / reassembly 60–85% / closed hold 85–100%); leader line anchor gap <= 5px; restitution drift residual <= 0.5px; seamless loop closure MAE ≡ 0 with max MAE >= 0.020; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Clean coaxial separation and reassembly along the 30° isometric optical axis, clear exploded hold with dynamic leader labels (LENS, BARREL, BODY, BACK), seamless loop MAE ≡ 0 and max MAE >= 0.020, 0 script and zero XML errors; Partial: 2D lateral scattering or restitution drift; Fail: Static image (max MAE < 0.020), parts flying off canvas, <script> tag, or XML syntax errors.",
  },
  "animated-human-hand-kinetic-v1": {
    coreKey: "Five-Finger Anatomical Kinematics, Hierarchical Phalangeal Joint Rotation, Opposable Thumb Trajectory & Seamless Loop",
    groundTruth:
      "Strict 5-digit topology (thumb with 2 phalanges, 4 fingers with 3 phalanges each); hierarchical phalangeal flexion/extension around joint pivot centers; diagonal opposable thumb adduction across the palm; seamless loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Strictly 5 well-proportioned digits with clear phalangeal segments rotating around joint pivots, realistic opposable thumb trajectory, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script and zero XML errors; Partial: 5 fingers moving as rigid rods or rubber-hose arcs without multi-joint linkage; Fail: Non-5 finger count (polydactyly/oligodactyly automatic 0-pt veto), static image (max MAE < 0.015), <script> tag, or XML syntax errors.",
  },
  "animated-fish-cloud-amodal-v1": {
    coreKey: "Parabolic Leap Kinematics, Cloud Amodal Occlusion, Water Splash Ripples & Collinear Spine Continuity",
    groundTruth:
      "Ballistic parabolic trajectory fit R² >= 0.98; true Painter's algorithm depth occlusion behind the cloud (inverted Z-order is an automatic veto); collinear spine extrapolation across cloud entry/exit within <= 2px; synchronized entry/exit splash ripples; seamless loop MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Smooth parabolic leap passing strictly behind the opaque cloud with collinear spine alignment across the cloud, synchronized water ripples, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script and zero XML errors; Partial: Leaping motion but sheared body alignment across the cloud or missing ripples; Fail: Fish rendered in front of cloud (depth-order inversion automatic 0-pt veto), static image, <script> tag, or XML syntax errors.",
  },
  "animated-island-chest-containment-v1": {
    coreKey: "Harmonic Ocean Waves, Wind-Bent Palm Catenary Sway, Treasure Chest Glimmer Pulse & Multi-Layer Spatial Containment",
    groundTruth:
      "Multi-layer convex hull inclusion ratio identically 1.0 (palm root & chest ∈ sandy island ∈ ocean; boundary violation is an automatic veto); curved palm trunk swaying in the breeze while root base remains firmly anchored (drift <= 0.5px); harmonic shoreline wave ripples; seamless loop MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Smoothly lapping waves, swaying palm with stationary rooted base, periodic golden chest glimmer, strict multi-layer containment (tree base & chest ∈ island ∈ ocean), seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script and zero XML errors; Partial: Animated but tree base drifts into water or abrupt wave cuts; Fail: Chest or tree floating in open ocean outside island (containment violation automatic 0-pt veto), static image, <script> tag, or XML syntax errors.",
  },
  "animated-tree-reader-occlusion-v1": {
    coreKey: "Wind-Swaying Canopy, Drifting Dappled Sunlight, Page-Turning Kinematics & Multi-Layer Depth Occlusion",
    groundTruth:
      "Strict multi-layer depth ordering (tree trunk back < seated reader torso middle < open book & turning hand front; layer inversion is an automatic veto); amodal path continuity of reader torso behind the book; arched page-turning motion; swaying canopy with drifting dappled light; subtle chest breathing while leaning against trunk; seamless loop MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Intact depth hierarchy (trunk < reader torso < lap < open book < turning hand/page), natural arched page flip, drifting dappled foliage shadows, subtle breathing, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script and zero XML errors; Partial: Animated scene but flat blinking page turn or torso detaching from trunk; Fail: Person occluded behind tree trunk (depth inversion automatic 0-pt veto), static image, <script> tag, or XML syntax errors.",
  },
  "four-stroke-engine-v1": {
    coreKey: "Four-Stroke Internal Combustion Cycle Phase Synchronization & Slider-Crank Kinematics",
    groundTruth:
      "Strict 4-stroke cycle synchronization: 1. Intake (piston descending TDC->BDC + intake valve open); 2. Compression (piston ascending BDC->TDC + both valves closed); 3. Power/Combustion (spark plug ignition flash at TDC + piston driven downward TDC->BDC + both valves closed); 4. Exhaust (piston ascending BDC->TDC + exhaust valve open); connecting rod articulating rigidly between wrist pin and crank journal over 2 crankshaft revolutions per cycle.",
    evaluationCriteria:
      "1. Phase synchronization (golden metric): Spark ignition must fire at Top Dead Center (TDC) after compression, with valve openings matched to piston strokes; 2. Slider-crank rigid geometry: Connecting rod articulates without detachment or stretching as crankshaft rotates around a fixed main bearing; 3. XML compliance: Zero XML parse errors.",
  },
  "mobius-strip-v1": {
    coreKey: "Non-Orientable Single-Sided Surface Topological Continuity & 720° Double-Circuit Traversal",
    groundTruth:
      "A Möbius strip is a non-orientable surface with a single side and a single boundary component; the vehicle must traverse a full 720° double circuit along the centerline to complete an upright -> inverted -> upright topological cycle, with clear 3D half-twist shading and foreground/background ribbon occlusion.",
    evaluationCriteria:
      "1. Topological continuity (golden metric): Vehicle must continuously traverse both apparent sides across a full 720° double loop; resetting abruptly after a 360° single loop fails the topological test; 2. Spatial occlusion & depth: Clean foreground-over-background occlusion at the half-twist crossing; 3. XML compliance: Zero XML parse errors.",
  },
  "cart-pole-v1": {
    coreKey: "Inverted Pendulum Closed-Loop Feedback Causality & Micro-Balance Damping",
    groundTruth:
      "Closed-loop physical causality: whichever side the inverted pendulum tilts toward, the motorized cart must accelerate in that SAME horizontal direction underneath the pivot to generate a restoring torque (tilt left -> cart accelerates left; tilt right -> cart accelerates right); wheel rotation matches cart translation; oscillations damp toward vertical equilibrium.",
    evaluationCriteria:
      "1. Control causality (core): Reversed causality (pole tilts left while cart drives right) scores 0; same-direction accelerating catch response earns full credit; 2. Mechanical coupling: Pole base remains hinged to the moving cart center without detaching; 3. XML compliance: Zero XML parse errors.",
  },
  "cyber-cube-v1": {
    coreKey: "3D Isometric Affine Projection, Euler Rotation & Dynamic Z-Order Depth Occlusion",
    groundTruth:
      "Accurate 3D isometric axis projection (30°/150°/270°); continuous multi-axis 3D rotation; periodic exploded-view expansion where outer cubelets translate outward along 3D surface normals to reveal the glowing inner core before re-converging; dynamic Z-ordering where foreground faces properly occlude rear cubelets.",
    evaluationCriteria:
      "1. 3D projection & occlusion (golden metric): True 3D rotational occlusion rather than flat 2D skewing, with foreground facets covering background facets; 2. Exploded-view rhythm: Smooth elastic outward expansion and re-convergence along 3D normal vectors; 3. XML compliance: Zero XML parse errors.",
  },
  "synthwave-drive-v1": {
    coreKey: "Logarithmic Perspective Grid Pseudo-3D Velocity, Segmented Sunset Mask & Roadster Body Roll Kinematics",
    groundTruth:
      "Pseudo-3D perspective ground grid: horizontal grid lines scroll downward with logarithmically increasing vertical spacing to convey forward depth velocity; retro magenta-to-orange sunset segmented by horizontal blinds; rear-chase cyber-roadster swaying across lanes with suspension body roll angle, glowing taillights, and exhaust particles.",
    evaluationCriteria:
      "1. Perspective velocity consistency (golden metric): Scrolling horizontal grid lines must accelerate and widen from horizon to foreground rather than sliding like a flat vertical ladder; 2. Vehicle dynamics: Lane-weaving accompanied by realistic body roll and thruster glow; 3. XML compliance: Zero XML parse errors.",
  },
  "cyber-hud-v1": {
    coreKey: "Coaxial Multi-Ring Differential Rotation, Radar Sweep Phosphor Decay & High-Density Vector Telemetry",
    groundTruth:
      "Central 360° radar sweep rotating coaxially around the dial center, triggering target blip highlights with trailing phosphorescent decay; concentric telemetry tick rings counter-rotating coaxially without eccentric wobble; real-time oscilloscope sine waveform, pulsing hexagonal meters, and scrolling hex telemetry.",
    evaluationCriteria:
      "1. Coaxial rotation & phosphor trail (golden metric): All rotating reticle rings and the radar beam must share an exact coaxial pivot center with zero eccentric wobble; 2. Information hierarchy: Crisp high-density vector tick marks layered with feGaussianBlur glow; 3. XML compliance: Zero XML parse errors.",
  },
  "black-hole-lensing-v1": {
    coreKey: "General Relativistic Double-Ring Gravitational Lensing & Relativistic Doppler Beaming Asymmetry",
    groundTruth:
      "Pitch-black central event horizon shadow and photon sphere; rear accretion disk light bent above and below the shadow by extreme spacetime curvature to form a double-ring lensing crown; relativistic Doppler beaming (approaching side blue-white and brighter, receding side red-orange and dimmer); Keplerian differential orbital swirl (faster at inner radius).",
    evaluationCriteria:
      "1. Relativistic physics (golden metric): Must depict both the gravitationally lensed double-ring crown and Doppler brightness/color asymmetry between approaching and receding disk sides (a flat symmetric Saturn-like ring fails); 2. Differential swirl: Inner plasma streams orbit faster than outer streams; 3. XML compliance: Zero XML parse errors.",
  },
  "quantum-double-slit-v1": {
    coreKey: "Huygens-Fresnel Coherent Wavefront Diffraction & Detector Probability-Density Interference Fringes",
    groundTruth:
      "Coherent plane waves incident from the left; two slits acting as synchronous Huygens-Fresnel point sources radiating concentric circular wavefronts; constructive interference along integer-wavelength path-difference rays and destructive nodal lines along half-integer rays; detector screen on the right showing alternating bright/dark fringes aligned with the constructive interference angles and a central maximum envelope.",
    evaluationCriteria:
      "1. Wave-optics geometry (core): Concentric phase-locked circular wavefronts emerging from both slits with physically consistent constructive/destructive interference geometry; 2. Detector alignment: Fringe intensity peaks on the right screen spatially aligned with constructive interference rays; 3. XML compliance: Zero XML parse errors.",
  },
  "ferrofluid-spikes-v1": {
    coreKey: "Magnetohydrodynamic Rosensweig Normal-Field Instability, Conical Spike Lattice & Specular Liquid Metallic Sheen",
    groundTruth:
      "Competition between surface tension, gravity, and vertical magnetic field gradient triggers normal-field Rosensweig instability, morphing a jet-black ferrofluid pool into a self-organized hexagonal lattice of sharp conical spikes; spikes rhythmically rise, tilt along rotating magnetic flux lines, and relax back into a glossy liquid surface.",
    evaluationCriteria:
      "1. Conical spike lattice (golden metric): Sharp 3D conical liquid spines arranged in a self-organized array with high-contrast metallic specular highlights rather than flat 2D circles; 2. Magnetic response dynamics: Smooth rhythmic growth, tilting, and relaxation tied to the magnetic field pulse; 3. XML compliance: Zero XML parse errors.",
  },
  "jwst-deployment-v1": {
    coreKey: "18-Segment Hexagonal Gold Primary Mirror Honeycomb, Tripod Secondary Struts & 5-Layer Diamond Sunshield Topology",
    groundTruth:
      "18 hexagonal gold-coated beryllium mirror segments arranged in a seamless honeycomb with a central aft-optics aperture; three deployable tripod struts supporting the secondary mirror in front of the primary array; 5 stacked diamond/kite-shaped Kapton sunshield membranes separating the warm sun-facing spacecraft bus/solar array from the cryogenic gold-lit optical deck.",
    evaluationCriteria:
      "1. 18-hexagon primary mirror array (golden metric): Symmetrical honeycomb of hexagonal gold mirror segments (random polygons or circular mirror fails); 2. Tripod struts & 5-layer sunshield: Three struts converging on the secondary mirror and 5 distinct stacked diamond sunshield layers with warm-vs-cryogenic lighting contrast; 3. XML compliance: Zero XML parse errors.",
  },
  "tokamak-plasma-v1": {
    coreKey: "D-Shaped Vacuum Vessel Cross-Section, Orthogonal Toroidal/Poloidal Field Coils & Helical Magnetic Flux Plasma Core",
    groundTruth:
      "D-shaped toroidal vacuum vessel cross-section with bottom divertor plates; vertical D-shaped toroidal field (TF) coils orthogonal to horizontal circular poloidal field (PF) coils around a central solenoid pillar; incandescent plasma torus inside the chamber exhibiting twisted helical magnetic field lines (q-profile rotational transform); outer cryostat and blanket shielding.",
    evaluationCriteria:
      "1. Magnetic confinement topology (golden metric): D-shaped chamber cross-section with orthogonal TF and PF coil geometry and helically twisted plasma flux lines; 2. Plasma core dynamics: High-energy core-to-edge thermal color gradient with flowing helical motion; 3. XML compliance: Zero XML parse errors.",
  },
  "gaa-nanosheet-v1": {
    coreKey: "3-Stack Horizontal Silicon Nanosheet Gate-All-Around (GAA) Channels, Source/Drain Epitaxy & Backside Power Delivery (BSPDN)",
    groundTruth:
      "Three vertically stacked, horizontally flat silicon nanosheet channel ribbons wrapped 360° on all four sides by high-k dielectric and metal gate (distinguishing GAA from 3-sided FinFET); raised faceted source/drain epitaxial blocks at both ends separated from the gate by inner dielectric spacers; frontside M0/M1 signal routing and backside power delivery rail (BSPDN) connected via nano-TSVs.",
    evaluationCriteria:
      "1. 360° GAA topology (golden metric): Gate stack must surround and interleave between all 3 horizontal nanosheet ribbons (drawing a vertical FinFET fin or planar block fails); 2. Frontside vs. backside hierarchy: Clear separation between top signal interconnects and bottom backside power delivery rails; 3. Layer coding: Crisp semiconductor CAD color coding and proportions.",
  },
  "crispr-cas9-rloop-v1": {
    coreKey: "Bi-Lobed Cas9 Architecture, gRNA Base-Pairing, Unwound DNA R-Loop & PAM-Proximal Dual HNH/RuvC Cleavage",
    groundTruth:
      "Bi-lobed Cas9 protein (REC recognition lobe and NUC nuclease lobe); single guide RNA (with scaffold hairpin loop) base-paired to the target DNA strand to form an unwound 3-stranded R-loop while the non-target DNA strand is displaced as a single-stranded loop; PAM (5'-NGG-3') recognition cleft with HNH cleaving the target strand and RuvC cleaving the non-target strand 3 bp upstream of PAM.",
    evaluationCriteria:
      "1. R-loop molecular topology (core): Must depict the unwound DNA bubble with gRNA-target strand heteroduplex and displaced non-target single strand rather than an intact closed double helix; 2. Dual catalytic centers & PAM: Distinct HNH and RuvC active cleavage sites alongside the PAM motif; 3. Visual clarity: Clear differentiation of Cas9 lobes, gRNA, and both DNA strands.",
  },
  "pulsar-jet-v1": {
    coreKey: "Neutron Star Magnetic Dipole Lighthouse Sweep, Collimated Relativistic Bipolar Jets & Equatorial Wind Nebula",
    groundTruth:
      "Rapidly spinning magnetized neutron star core; opposing collimated relativistic particle jets shooting along the magnetic poles with propagating shock knots; sweeping conical magnetic dipole radiation beams producing periodic lighthouse flashes as they cross the line of sight; concentric equatorial termination-shock rings and filamentary pulsar wind nebula.",
    evaluationCriteria:
      "1. Astrophysical symmetry & lighthouse effect (golden metric): Bipolar relativistic jets aligned with sweeping dipole radiation cones and periodic lighthouse flashing; 2. Shock-wave hierarchy: Propagating jet knots and expanding equatorial wind nebula filaments; 3. XML compliance: Zero XML parse errors.",
  },
};
