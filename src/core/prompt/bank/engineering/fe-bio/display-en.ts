import type { LocalizedStandardEntry } from "../../../types";

export const FE_BIO_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-bio-v1": "FE-4: Engineered Biology & Molecular Machines (10-Prompt Suite)",
};

export const FE_BIO_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-bio-v1": {
    coreKey: "Engineered Biology Catalytic Mechanisms, Macromolecular Cryo-EM Topology & De Novo Nanomachines",
    groundTruth:
      "Grounded in experimental PDB cryo-EM and crystal structures (8WUV, 6VPC, 8GA9, 7R5J, 3KIN, 6TT7, 5XUS), accurately depicting active-site metal-ion coordination, steric hindrance windows, mechanically interlocked C4/D8 symmetry, and mechanochemical stepping cycles.",
    evaluationCriteria:
      "1. Molecular topology: Accurately reconstructs bi-lobed/right-hand protein domains, H-type RNA pseudoknots, and sub-3 Å steric clearances; 2. Dynamic phase transitions: Faithfully follows mechanochemical cycles and selective phase-separated sieve percolation; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
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
