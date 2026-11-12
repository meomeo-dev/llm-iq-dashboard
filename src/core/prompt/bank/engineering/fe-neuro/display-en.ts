import type { LocalizedStandardEntry } from "../../../types";

export const FE_NEURO_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-neuro-v1": "FE-8: Neuroelectronics & Brain-Computer Interfaces (10-Prompt Suite)",
};

export const FE_NEURO_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-neuro-v1": {
    coreKey: "Kilochannel Flexible Neural Microwires, Microelectrode Randles Impedance & Biomimetic Tactile E-Skin",
    groundTruth:
      "Grounded in 1024-channel flexible polyimide microwire vascular-avoidance insertion mechanics, nanoporous PEDOT:PSS/CNT modified Randles electrochemical impedance spectroscopy (EIS), micropyramid piezoresistive normal/shear force decoupling, and 16x expansion microscopy synaptic connectomics.",
    evaluationCriteria:
      "1. Electrophysiological consistency: Bode/Nyquist impedance spectra, extracellular spike attenuation fields, and neuronal avalanche power laws match quantitative benchmarks; 2. Biomimetic microstructure: Micropyramid stress concentration, ionotronic EDL gradients, and 3D honeycomb field confinement are clearly resolved; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
  },
  "FE-NEURO-01": {
    coreKey: "1024-Channel Flexible Polyimide Microwire Robotic Vascular-Avoidance Insertion and Retraction Dynamics Benchmark",
    groundTruth:
      "Flexible polyimide threads ($5\\text{ }\\mu\\text{m}$ thick, $20\\text{ }\\mu\\text{m}$ wide, $50\\text{ }\\mu\\text{m}$ site pitch) have an Euler buckling load $F_{\\text{crit}} = \\pi^2 EI/(KL)^2 \\approx 6.3\\text{ }\\mu\\text{N}$ below pial penetration force, requiring shuttle-needle insertion outside vascular buffer zones $R_{\\text{buffer}} = D_v/2 + 25\\text{ }\\mu\\text{m}$. Under a $1.0\\text{ s}$ brain pulsation cycle, post-retraction thread relaxation settles at residual pullback $\\Delta z \\approx 150\\text{ }\\mu\\text{m}$.",
    evaluationCriteria:
      "Insertion trajectories must maintain a minimum Euclidean clearance $> 25\\text{ }\\mu\\text{m}$ from blood vessel walls while animating the 4-stage sequence of needle insertion, thread release, needle withdrawal, and tissue-coupled elastic recoil.",
  },
  "FE-NEURO-02": {
    coreKey: "Nanoporous PEDOT:PSS/CNT Neural Microelectrode Modified Randles Equivalent Circuit and EIS Benchmark",
    groundTruth:
      "Modified Randles interface model with solution resistance $R_s = 450\\text{ }\\Omega$, charge-transfer resistance $R_{ct} = 1.2\\text{ M}\\Omega$, and constant-phase element $Y_0 = 42\\text{ nS}\\cdot\\text{s}^n$ ($n = 0.88$). At $1\\text{ kHz}$, total impedance drops to $|Z| = 10.82\\text{ k}\\Omega$ with phase angle $-77.5^\\circ$, a $99.4\\%$ reduction compared to bare Au ($1.85\\text{ M}\\Omega$).",
    evaluationCriteria:
      "Depict the 4-layer microelectrode cross-section alongside Bode plots aligned precisely to $|Z| = 10.8\\text{ k}\\Omega$ and $-77.5^\\circ$ at $1\\text{ kHz}$ and a Nyquist plot intersecting the real axis at $R_s = 450\\text{ }\\Omega$.",
  },
  "FE-NEURO-03": {
    coreKey: "Single-Neuron Full-Band Extracellular Action Potential (Spike) vs. LFP 3D Spatial Field Decay and Biphasic Waveform Benchmark",
    groundTruth:
      "In a volume conductor ($\\sigma = 0.33\\text{ S/m}$), near-field extracellular spike amplitude decays exponentially as $V(r) = V_0\\exp(-r/r_0)$ with $V_0 = 850\\text{ }\\mu\\text{V}$ and $r_0 = 24.5\\text{ }\\mu\\text{m}$. The $1.8\\text{ ms}$ biphasic spike ($300\\text{ Hz}-3\\text{ kHz}$) exhibits a negative depolarization trough at $0.4\\text{ ms}$ ($-650\\text{ }\\mu\\text{V}$) and a positive repolarization peak at $1.1\\text{ ms}$ ($+200\\text{ }\\mu\\text{V}$).",
    evaluationCriteria:
      "Render concentric 3D elliptical equipotential contours around the soma and dual-channel oscilloscope traces contrasting rapidly decaying high-frequency biphasic spikes against slow $0.5\\text{-}300\\text{ Hz}$ local field potentials (LFP).",
  },
  "FE-NEURO-04": {
    coreKey: "Biomimetic Micropyramid Flexible Piezoresistive Tactile E-Skin Normal and Shear Force Multi-Axis Decoupling Benchmark",
    groundTruth:
      "Micropyramid elastomers (apex angle $70.5^\\circ$, base width $28.3\\text{ }\\mu\\text{m}$) paired with four-quadrant differential electrodes decouple normal force $V_z \\propto \\sum_{i=1}^4 \\Delta R_i$ and shear force $V_x \\propto (\\Delta R_1 + \\Delta R_4) - (\\Delta R_2 + \\Delta R_3)$. Cross-axis coupling interference is $< 2.5\\%$, response time is $< 5\\text{ ms}$, and viscoelastic hysteresis error is $< 3.5\\%$.",
    evaluationCriteria:
      "Clearly label 3D axes and four-quadrant electrodes, shift peak compressive stress contours toward the loaded pyramid flank under oblique force, and plot differential shear response with linearity $R^2 > 0.98$.",
  },
  "FE-NEURO-05": {
    coreKey: "Biomimetic Hydrogel Ionotronic Skin Electric Double Layer (EDL) Capacitive Sensing and Ultra-Wide Linear Gradient Benchmark",
    groundTruth:
      "Gouy-Chapman-Stern ionotronic interface with Debye length $\\lambda_D = 0.8\\text{ nm}$ and specific EDL capacitance $10\\text{-}25\\text{ }\\mu\\text{F/cm}^2$ across three-tier stepped microstructures ($H_1 = 30\\text{ }\\mu\\text{m}, H_2 = 20\\text{ }\\mu\\text{m}, H_3 = 10\\text{ }\\mu\\text{m}$). Initial sensitivity reaches $S_1 = 48.5\\text{ kPa}^{-1}$ while maintaining non-saturating linearity ($R^2 > 0.992$) up to $800\\text{ kPa}$.",
    evaluationCriteria:
      "Illustrate the Helmholtz compact layer and diffuse ion cloud gradient alongside three-stage stepped dome engagement directly mapped to the slope transitions of the $\\Delta C/C_0$ pressure response curve.",
  },
  "FE-NEURO-06": {
    coreKey: "16x Brain Expansion Microscopy Connectomics (LICONN) Synaptic Vesicle Cluster and Postsynaptic Density Deconvolution Benchmark",
    groundTruth:
      "Isotropic $16.0\\times$ linear hydrogel expansion ($4096\\times$ volume) enlarges a $20\\text{ nm}$ synaptic cleft to $320\\text{ nm}$ (surpassing the $250\\text{ nm}$ Abbe diffraction limit) and achieves an effective confocal PSF FWHM of $15.6\\text{ nm}$. Presynaptic Bassoon and postsynaptic PSD-95 fluorescence bands are separated by a resolved $20\\text{ nm}$ cleft with a calibrated centroid distance of $35\\text{-}40\\text{ nm}$.",
    evaluationCriteria:
      "Animate the three stages of unexpanded diffraction-limited blur, $16\\times$ isotropic hydrogel mesh expansion, and super-resolution deconvolution convergence, with final-frame dimension callouts marking the $35\\text{-}40\\text{ nm}$ Bassoon-to-PSD-95 centroid separation.",
  },
  "FE-NEURO-07": {
    coreKey: "Subretinal 3D Honeycomb Photovoltaic Prosthesis Vertical Electric Field Confinement and Bipolar Cell Activation Benchmark",
    groundTruth:
      "Hexagonal 3D honeycomb subretinal pixels ($30\\text{ }\\mu\\text{m}$ pitch, $25\\text{ }\\mu\\text{m}$ cavity depth) enforce insulating sidewall boundary conditions $\\partial\\Phi/\\partial n = 0$, confining the field to a 1D vertical gradient $E_z = V_{\\text{stim}}/H$ with lateral crosstalk $< 0.05$. Bipolar cell activation occurs at $80\\text{-}120\\text{ V/m}$ under a $0.15\\text{ mC/cm}^2$ charge injection density.",
    evaluationCriteria:
      "Side-by-side comparison contrasting hemispherical diverging equipotential lines above a flat pixel against parallel horizontal equipotential lines (linearly spaced from $100\\%$ at the base to $0\\%$ at the top) inside the 3D honeycomb well enclosing migrated bipolar cells.",
  },
  "FE-NEURO-08": {
    coreKey: "3D-MEA Brain Organoid Intelligence Spontaneous Synchronized Bursting and Critical Neuronal Avalanche Branching Benchmark",
    groundTruth:
      "Self-organized criticality in 3D-MEA brain organoids operates at branching ratio $\\sigma = 1.00 \\pm 0.02$, with scale-free avalanche size distribution $P(S) \\propto S^{-\\tau}$ ($\\tau = 1.50 \\pm 0.05$) and duration distribution $P(T) \\propto T^{-\\alpha}$ ($\\alpha = 2.00 \\pm 0.08$) obeying the crackling-noise scaling relation $(\\alpha - 1)/(\\tau - 1) = 2.0$.",
    evaluationCriteria:
      "Left panel animates cascading 3D-MEA electrode avalanches across the organoid neurosphere, while the right log-log plot dynamically accumulates scatter points around a fitted power-law line with slope $-1.50 \\pm 0.05$.",
  },
  "FE-NEURO-09": {
    coreKey: "Peripheral Nerve Regenerative Sieve Microelectrode Microchannel High-Resistance Sealing and Single-Axon Action Potential Amplification Benchmark",
    groundTruth:
      "Polyimide regenerative sieve electrode ($15\\text{ }\\mu\\text{m}$ pore diameter, $100\\text{ }\\mu\\text{m}$ channel length, interstitial fluid resistivity $\\rho = 0.7\\text{ }\\Omega\\cdot\\text{m}$) creates a high extracellular seal resistance $R_{\\text{ext}} = \\rho L/A \\approx 396\\text{ k}\\Omega$. Single-axon action currents confined inside the microchannel are amplified to $> 1.2\\text{ mV}$ peak-to-peak compared to tens of microvolts in open space.",
    evaluationCriteria:
      "Show a macro cross-section of regenerating nerve fascicles threading the sieve pores, a microchannel view with lumped seal-resistance circuit models, and an oscilloscope waveform marking a $1.4\\text{ mV}$ peak-to-peak amplified spike.",
  },
  "FE-NEURO-10": {
    coreKey: "Endovascular Stentrode Endothelialization Interface and Ultrasonic Neural Dust Backscatter Telemetry Benchmark",
    groundTruth:
      "A self-expanding Nitinol Stentrode ($50\\text{ }\\mu\\text{m}$ strut thickness) deployed in the $4\\text{ mm}$ superior sagittal sinus becomes fully encapsulated by a $40\\text{ }\\mu\\text{m}$ endothelial layer within 4 weeks, stabilizing $1\\text{ kHz}$ impedance at $15\\text{-}35\\text{ k}\\Omega$. Deep-tissue $0.8\\text{ mm}$ piezoelectric neural dust operating at $1.85\\text{ MHz}$ (acoustic transmission $T = 2Z_2/(Z_1+Z_2)$) modulates ultrasonic backscatter amplitude by $\\Delta\\Gamma \\approx 1.2\\%$.",
    evaluationCriteria:
      "Animate stent expansion against the sinus wall, progressive endothelial cell overgrowth, and $1.85\\text{ MHz}$ ultrasonic interrogation pulses returning phase/amplitude-modulated backscatter echoes from the neural dust mote with a labeled $1.2\\%$ modulation depth.",
  },
};
