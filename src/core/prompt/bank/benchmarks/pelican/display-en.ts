import type { LocalizedStandardEntry } from "../../../types";

export const PELICAN_LABELS_EN: Readonly<Record<string, string>> = {
  "classic-v1": "Classic Pelican on a Bicycle",
  "upgraded-v2": "Upgraded Pelican (2025-11)",
  "animated-pelican-v1": "Animated Pelican on a Bicycle",
};

export const PELICAN_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
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
};
