import type { LocalizedStandardEntry } from "../../../types";

export const FOUNDATIONS_LABELS_EN: Readonly<Record<string, string>> = {
  "clock-v1": "Clock Spatial Geometry (3:45)",
  "penrose-v1": "Penrose Impossible Triangle",
  "ice-water-v1": "Floating Ice in Glass (Archimedes)",
};

export const FOUNDATIONS_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
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
};
