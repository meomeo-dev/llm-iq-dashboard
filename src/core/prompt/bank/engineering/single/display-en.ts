import type { LocalizedStandardEntry } from "../../../types";

export const ENGINEERING_SINGLE_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
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
};
