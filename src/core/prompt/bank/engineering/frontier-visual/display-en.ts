import type { LocalizedStandardEntry } from "../../../types";

export const FRONTIER_VISUAL_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
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
