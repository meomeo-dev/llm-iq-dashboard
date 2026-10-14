import type { LocalizedStandardEntry } from "./standards-single-en";

/**
 * English localization for FE-5..FE-8 candidate standards (`FE-ENERGY-01`..`10`,
 * `FE-AERO-01`..`10`, `FE-META-01`..`10`, `FE-NEURO-01`..`10`).
 */
export const STANDARDS_FE_PART2_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "FE-ENERGY-01": {
    coreKey: "SPARC 20T REBCO Compact Tokamak D-T Core Poloidal Cross-Section and $\\nabla B$ Drift Equilibrium",
    groundTruth:
      "Grad-Shafranov plasma boundary with major radius $R_0 = 1.85\\text{ m}$, minor radius $a = 0.57\\text{ m}$ ($A \\approx 3.25$), elongation $\\kappa = 1.97$, triangularity $\\delta = 0.54$, and a lower single-null X-point. Toroidal field $\\mathbf{B}(R) = B_0 (R_0/R) \\hat{\\mathbf{e}}_\\phi$ (18-20 T inner high-field side to 8-9 T outer side) drives guiding-center drift $\\mathbf{v}_D = \\frac{m(v_\\perp^2/2 + v_\\parallel^2)}{q B^3}(\\mathbf{B} \\times \\nabla B)$. ",
    evaluationCriteria:
      "D-shaped plasma cross-section must match $\\kappa = 1.97 \\pm 0.05$ and $\\delta = 0.54 \\pm 0.05$, with lower divertor strike lines landing at acute angles on tilted inner/outer tungsten target plates. Include a $1/R$ false-color field contour (18-20 T magenta inner to 8 T dark-blue outer) and opposite vertical drift arrows for D/T ions (downward) and electrons (upward).",
  },
  "FE-ENERGY-02": {
    coreKey: "Wendelstein 7-X 3D Non-Planar Modular Coils and $\\iota=5/5$ Resonant Magnetic Island Divertor Topology",
    groundTruth:
      "Edge rotational transform $\\iota = 1.0 = 5/5$ with resonant magnetic island width governed by low magnetic shear $w = 4\\sqrt{\\frac{r B_{mn}}{m B_\\theta (d\\iota/dr)}}$. Side-by-side poloidal cross-sections at $\\phi = 0^\\circ$ (vertically elongated bean shape) and $\\phi = 36^\\circ$ (inverted triangular shape) with nested Poincare flux surfaces.",
    evaluationCriteria:
      "Strictly 5 edge magnetic islands with local elliptic O-points and hyperbolic X-points, prohibited from showing 4 or 6 islands. Left bean section aspect ratio $\\ge 2.2$ and right triangular section with conserved area, with 10 3D divertor target plates intercepting the outer island exhaust channels.",
  },
  "FE-ENERGY-03": {
    coreKey: "NIF W-Doped Diamond Capsule Implosion Ablation and Rayleigh-Taylor Instability Dynamics",
    groundTruth:
      "Layered capsule ($R_0 = 1050\\text{ }\\mu\\text{m}$) with outer pure HDC ($\\rho = 3.52\\text{ g/cm}^3$, $\\sim 40\\text{ }\\mu\\text{m}$), middle W-doped HDC (0.2-0.4 at.% W, $\\sim 20\\text{ }\\mu\\text{m}$), inner cryogenic DT ice ($\\sim 55\\text{ }\\mu\\text{m}$), and central DT vapor cavity. Convergence ratio $C_r = R_0 / R_{\\text{hot-spot}} \\approx 30$, with ablative Rayleigh-Taylor growth rate governed by the Takabe formula $\\gamma(k) = \\alpha\\sqrt{\\frac{k g}{1 + k L}} - \\beta k v_a$.",
    evaluationCriteria:
      "SMIL/CSS animation of implosion from $t=0\\text{ ns}$ to $t_{\\text{peak}} \\approx 8\\text{-}10\\text{ ns}$ compressing $R_0$ by $1/30$ into an incandescent $>10\\text{ keV}$ hot-spot with outward rocket-effect ablative blowoff. Depict inward cold spikes and outward hot bubbles smoothed at high modes by ablation, plus an amber W-doped M-band X-ray shielding layer.",
  },
  "FE-ENERGY-04": {
    coreKey: "Field-Reversed Configuration Plasmoid Collision Compression and Faraday Inductive Direct Energy Recovery",
    groundTruth:
      "Two closed-field-line FRC toroids with separatrix radius $r_s$ and end X-points collide and merge, followed by adiabatic magnetic compression from $B_0 \\sim 0.2\\text{ T}$ to $B_{\\text{max}} \\sim 10\\text{ T}$ obeying $T \\propto B^{4/5}$, $n \\propto B^{6/5}$, and $r_s \\propto B^{-2/5}$. D-$^3\\text{He}$ fusion expansion pushes magnetic flux outward to induce direct electrical energy recovery $\\mathcal{E} = -d\\Phi_B/dt$ at $>95\\%$ round-trip efficiency.",
    evaluationCriteria:
      "Four-stage continuous animation covering supersonic plasmoid acceleration, central shock merging, 10 T magnetic compression to bright pink fusion core, and piston-like expansion driving current back into external capacitor banks. Internal axial magnetic field lines must strictly reverse direction relative to the external guide field.",
  },
  "FE-ENERGY-05": {
    coreKey: "Gen-IV Thorium Molten Salt Reactor (TMSR-LF1) Passive Freeze Plug Phase-Change and Gravity Drain Safety Loop",
    groundTruth:
      "FLiBe carrier salt ($\\text{LiF-BeF}_2$ 66-34 mol%, $T_{\\text{melt}} = 459^\\circ\\text{C}$, operating at $650\\text{-}700^\\circ\\text{C}$, $\\rho \\approx 1940\\text{ kg/m}^3$, $C_p \\approx 2414\\text{ J/(kg}\\cdot\\text{K)}$) with 1D Stefan phase-change moving boundary $\\rho L \\frac{ds(t)}{dt} = -k_{\\text{solid}}\\left.\\frac{\\partial T}{\\partial z}\\right|_{s^-} + k_{\\text{liquid}}\\left.\\frac{\\partial T}{\\partial z}\\right|_{s^+}$ melting within 300-600 s after blower blackout. Gravity drainage follows $v(t) = \\sqrt{\\frac{2 g H(t)}{1 + f(L/D) + \\sum K_L}}$ into subcritical honeycomb tanks ($k_{\\text{eff}} < 0.95$).",
    evaluationCriteria:
      "Four-stage animation showing active blower cooling maintaining the solid gray-blue salt plug, station blackout halting airflow, radial/axial melting perforation of the freeze plug, and gravity drainage of red $650^\\circ\\text{C}$ molten salt into subcritical tanks with passive air-chimney convection. Reactor vessel level drop and drain tank filling must conserve volume.",
  },
  "FE-ENERGY-06": {
    coreKey: "Sulfide All-Solid-State Lithium Battery Interphase (SEI) Chemo-Mechanical Stress and Grain Boundary Dendrite Penetration",
    groundTruth:
      "Hydrostatic stress $\\sigma_h = \\frac{1}{3}\\text{Tr}(\\boldsymbol{\\sigma})$ modulates interfacial lithium chemical potential $\\mu_{\\text{Li}} = \\mu_{\\text{Li}}^0 - F\\eta - \\Omega\\sigma_h$, where tensile stress accelerates deposition. Mode-I Griffith crack propagation occurs at grain boundary triple junctions when $K_I = \\sigma_{\\text{tip}}\\sqrt{\\pi a} \\ge K_{Ic}^{\\text{GB}}$, controlled within a $5\\text{ MPa} \\le P_{\\text{stack}} \\le 10\\text{ MPa}$ stack pressure window.",
    evaluationCriteria:
      "Three-layer cross-section showing top Li metal anode with creep slip lines and stripping Kirkendall voids, middle nanoscale $\\text{Li}_3\\text{N}/\\text{Li}_2\\text{S}$ SEI layer, and bottom Voronoi polycrystalline sulfide electrolyte. Include von Mises stress contours around the dendrite tip (red tensile tip, blue compressive flanks), crack opening displacement (COD) vectors, and $J_{\\text{Li}^+}$ flux arrows.",
  },
  "FE-ENERGY-07": {
    coreKey: "Sodium-Ion Battery Prussian White Cathode 3D Open-Framework Lattice Strain and Phase Transitions",
    groundTruth:
      "Structural phase transitions upon desodiation follow $\\text{Monoclinic } P2_1/n (\\beta \\approx 92.5^\\circ) \\xrightarrow{x \\sim 0.5} \\text{Rhombohedral } R\\bar{3}m \\xrightarrow{x \\sim 2.0} \\text{Cubic } Fm\\bar{3}m (\\beta = 90^\\circ)$ with unit-cell volume contraction $\\Delta V / V_0 \\approx 16.2\\%$. The 3D $\\text{Fe}^{2+}\\text{-C}\\equiv\\text{N-Fe}^{3+}$ framework provides $\\sim 1.6\\text{ \\AA}$ migration necks with low diffusion activation barrier $E_a \\approx 0.28\\text{-}0.35\\text{ eV}$.",
    evaluationCriteria:
      "3D perspective framework of alternating light-blue $\\text{Fe}^{2+}\\text{C}_6$ and purple $\\text{Fe}^{3+}\\text{N}_6$ octahedra linked by $-\\text{C}\\equiv\\text{N}-$ bridges and populated by yellow $\\text{Na}^+$ ions along 3D diffusion paths. Compare tilted monoclinic ($\\beta=92.5^\\circ$) and orthogonal cubic ($\\beta=90^\\circ$) cells with $\\Delta a, \\Delta b, \\Delta c$ strain vectors and an $[\\text{Fe(CN)}_6]$ vacancy occupied by distorting $\\text{H}_2\\text{O}$ molecules.",
  },
  "FE-ENERGY-08": {
    coreKey: "MW-Scale PEM Water Electrolyzer Bipolar Plate Porous Transport Layer Counter-Flow Two-Phase Capillary Transport",
    groundTruth:
      "Counter-current liquid water and $\\text{O}_2$ gas Darcy flow $\\mathbf{u}_l = -\\frac{K k_{rl}(S_l)}{\\mu_l}\\nabla P_l$ and $\\mathbf{u}_g = -\\frac{K k_{rg}(S_g)}{\\mu_g}\\nabla P_g$ coupled via Leverett capillary pressure $P_c(S_l) = \\sigma\\cos\\theta_c\\sqrt{\\varepsilon/K}J(S_l)$ across a sintered Ti-PTL ($d_f \\approx 20\\text{ }\\mu\\text{m}$, thickness $300\\text{ }\\mu\\text{m}$, $\\varepsilon \\approx 65\\%$, $1.0\\text{ mm}$ rib/channel). High gas saturation ($S_g > 0.4$) drives concentration overpotential $\\eta_{\\text{conc}} = \\frac{RT}{4F}\\ln\\left(\\frac{1}{1 - S_{g,\\text{interface}}}\\right)$.",
    evaluationCriteria:
      "Animated downward blue water permeation from bipolar plate channels and upward red $\\text{O}_2$ bubble coalescence and capillary fingering from the bottom anode catalyst layer, showing bubble stagnation under ribs. Include a right-side water saturation profile $S_l(z)$ ($0.9$ at channel to $0.5$ at catalyst interface) and hydrophilic concave menisci ($\\theta_c < 90^\\circ$) on $\\text{TiO}_2$ fibers.",
  },
  "FE-ENERGY-09": {
    coreKey: "Passive Daytime Radiative Cooling Metamaterial 8-13 um Atmospheric Window Emissivity and Solar Reflectance Photonic Topology",
    groundTruth:
      "Net cooling power balance $P_{\\text{net}}(T) = P_{\\text{rad}}(T) - P_{\\text{atm}}(T_{\\text{amb}}) - P_{\\text{sun}} - P_{\\text{cond+conv}}$ with non-radiative parasitic loss $P_{\\text{cond+conv}} = h_c(T_{\\text{amb}} - T)$ ($h_c \\approx 6\\text{-}10\\text{ W/(m}^2\\cdot\\text{K)}$). Hierarchical porous/microsphere metamaterial achieves solar reflectance $R \\approx 0.98$ ($\\lambda \\in [0.3, 2.5]\\text{ }\\mu\\text{m}$) via Mie scattering and thermal emissivity $\\varepsilon \\ge 0.95$ within the $8\\text{-}13\\text{ }\\mu\\text{m}$ atmospheric window.",
    evaluationCriteria:
      "Three-tier vertical layout showing the $3\\text{ K}$ deep-space heat sink, Earth atmosphere with highlighted $8\\text{-}13\\text{ }\\mu\\text{m}$ transparent window between $\\text{H}_2\\text{O}/\\text{CO}_2$ absorption bands, and bottom microsphere-polymer metamaterial film. Show $98\\%$ Mie-scattered yellow solar reflection, blocked cyan downward atmospheric radiation, unattenuated magenta $8\\text{-}13\\text{ }\\mu\\text{m}$ thermal emission to space, and a bar chart showing $P_{\\text{net}} \\approx 100\\text{ W/m}^2$ with $\\Delta T = -8.5^\\circ\\text{C}$ sub-ambient cooling.",
  },
  "FE-ENERGY-10": {
    coreKey: "Direct Lithium Extraction (DLE) Titanate/Manganate Ion-SieveSelective Coordination and Concentration Polarization Boundary Layer",
    groundTruth:
      "$\\text{Li}^+$ ($r = 0.76\\text{ \\AA}$, $\\Delta G_{\\text{hyd}} \\approx -515\\text{ kJ/mol}$) sheds its hydration shell to enter $d_{\\text{pore}} \\approx 1.5\\text{-}2.0\\text{ \\AA}$ ion-sieve tunnels, whereas $\\text{Mg}^{2+}$ ($r = 0.72\\text{ \\AA}$, $\\Delta G_{\\text{hyd}} \\approx -1922\\text{ kJ/mol}$, hydrated diameter $8.6\\text{ \\AA}$) is sterically and energetically blocked. Nernst-Planck flux $J_{\\text{Li}} = -D_{\\text{eff}}\\frac{\\partial C_{\\text{Li}}}{\\partial x} - \\frac{z_{\\text{Li}} F D_{\\text{eff}}}{RT}C_{\\text{Li}}\\frac{\\partial \\phi}{\\partial x}$ across a $10\\text{-}50\\text{ }\\mu\\text{m}$ boundary layer yields separation factor $\\beta_{\\text{Li/Mg}} > 1000$.",
    evaluationCriteria:
      "Three-zone multi-scale cross-section from left bulk brine (hydrated $[\\text{Mg}(\\text{H}_2\\text{O})_6]^{2+}$, $[\\text{Na}(\\text{H}_2\\text{O})_6]^+$, and $\\text{Li}^+$) through the middle concentration-polarization boundary layer to the right LIS crystal lattice. Show hydrated $\\text{Mg}^{2+}$ repelled at the $1.8\\text{ \\AA}$ pore mouth, $\\text{Li}^+$ dehydration and octahedral lattice oxygen coordination, and a bottom free-energy profile $\\Delta G(x)$ illustrating $\\Delta G_{\\text{barrier}}^{\\text{Mg}} \\gg \\Delta G_{\\text{barrier}}^{\\text{Li}}$.",
  },
  "FE-AERO-01": {
    coreKey: "SpaceX Starship Super Heavy Booster Mechazilla Chopstick Tower Catch Dynamics and Hydraulic Damping",
    groundTruth:
      "Transient catch arrest governed by $M_{dry}\\ddot{z}(t) + C_d(t)\\dot{z}(t) + K_s z(t) = \\sum T_{Raptor}\\cos(\\theta_{TVC}) - M_{dry}g$ with $M_{dry} = 2.50 \\times 10^5\\text{ kg}$, $v_{z0} = -1.15\\text{ m/s}$ at $h_{catch} = 78.5\\text{ m}$, and 3 Raptor engines at $T = 8.50 \\times 10^5\\text{ N}$ gimbaling $\\theta_{TVC} = 2.8^\\circ \\to 0^\\circ$. Hydraulic rails ($C_d = 8.20 \\times 10^5\\text{ N}\\cdot\\text{s/m}$) arrest the booster over stroke $\\Delta z_{stroke} = 0.45\\text{ m}$ in $t_{arrest} = 0.62\\text{ s}$ at $\\le 1.65\\text{ g}$.",
    evaluationCriteria:
      "Separate SVG `<path>` elements for the 0-140 m Mechazilla tower, dual chopstick arms ($9.0\\text{ m}$ spacing), $9.0\\text{ m}$ diameter booster hull, and $0.35\\text{ m}$ catch pins, driven by `<animateTransform>` over $0 \\le t \\le 0.62\\text{ s}$ from $0$ to $-0.45\\text{ m}$ without oscillation. Include synchronized TVC plume polygons, hydraulic damper piston compression, and $v_z(t)$ / $F_{damp}(t)$ plots peaking at $F_{max} \\approx 2.85 \\times 10^6\\text{ N}$.",
  },
  "FE-AERO-02": {
    coreKey: "Rotating Detonation Rocket Engine (RDRE) Annular Combustor Continuous Supersonic Detonation Wave and Shock Reflection Topology",
    groundTruth:
      "LOX/CH4 ($\\Phi = 1.15$) annular RDRE ($L = 280\\text{ mm}$ circumference, $H = 90\\text{ mm}$ height) with theoretical $D_{CJ} = 2390\\text{ m/s}$, observed wave speed $D_{exp} = 1780\\text{ m/s}$, von Neumann spike $P_{vN} = 8.45\\text{ MPa}$, and CJ pressure $P_{CJ} = 4.25\\text{ MPa}$. Unburned refill wedge height $h_{fill} = 19.2\\text{ mm}$ ($u_{inj} = 185\\text{ m/s}$), trailing oblique shock angle $\\beta = 34.6^\\circ$, slip line angle $\\theta_{slip} = 28.2^\\circ$, and Prandtl-Meyer expansion fan $\\Delta\\theta_{fan} = 16.5^\\circ$.",
    evaluationCriteria:
      "Unwrapped 2D domain ($x \\in [0, 280]\\text{ mm}, y \\in [0, 90]\\text{ mm}$) depicting the vertical detonation front, triangular unburned refill wedge, high-pressure detonation products, and low-pressure expansion zone. Include periodic Kelvin-Helmholtz vortices (`<path class=\"kh-vortex\">`) along the slip line, Rankine-Hugoniot shock reflections, pressure isocontours ($>8\\text{ MPa}$ dark red to $<0.8\\text{ MPa}$ cyan), and labeled $D_{exp} = 1780\\text{ m/s}$, $\\beta = 34.6^\\circ$, and Triple Point.",
  },
  "FE-AERO-03": {
    coreKey: "Deep Space Return Dual-Pulse Skip Reentry Lift-to-Drag Modulation and Corridor Boundaries",
    groundTruth:
      "Planar skip reentry governed by $\\frac{dv}{dt} = -\\frac{D}{m} - g\\sin\\gamma$ and $v\\frac{d\\gamma}{dt} = \\frac{L\\cos\\sigma}{m} - (g - \\frac{v^2}{R_E+h})\\cos\\gamma$ with $L/D = 0.36$, $m/(C_D A) = 850\\text{ kg/m}^2$, entry interface $h_{EI} = 120.0\\text{ km}$, $v_0 = 10.95\\text{ km/s}$, and safe corridor $\\gamma_{EI} \\in [-5.20^\\circ, -6.50^\\circ]$ ($\\gamma_0 = -5.85^\\circ$). First pull-up perigee reaches $h_{p1} = 61.2\\text{ km}$ ($n_{max1} = 4.8\\text{ g}$, $\\dot{q}_{max} = 4.85\\text{ MW/m}^2$) with bank reversal $\\sigma = 45^\\circ \\to 135^\\circ$ at $65\\text{ km}$, skipping to $h_{apo2} = 118.5\\text{ km}$ ($v_{apo} = 7.58\\text{ km/s}$) before final descent.",
    evaluationCriteria:
      "Scaled Earth arc ($R_E = 6371\\text{ km}$), $100\\text{ km}$ Karman line, $120\\text{ km}$ Entry Interface, and semi-transparent `<polygon class=\"reentry-corridor\">` bounds. Animate the spacecraft via `<animateMotion>` along the double-dip trajectory with a bank-reversing `<line id=\"lift-vector\">`, heat-flux trajectory color-coding, and an accompanying $h\\text{-}v$ phase-plane diagram.",
  },
  "FE-AERO-04": {
    coreKey: "Hypersonic Scramjet Isolator Shock Train, Mach Stem, and Shock-Wave/Boundary-Layer Interaction (SWBLI) Flow Separation",
    groundTruth:
      "Scramjet isolator ($H = 50.0\\text{ mm}$, $L = 500\\text{ mm}$, $L/H = 10.0$) with supersonic inflow $M_1 = 2.50$, $P_1 = 45.0\\text{ kPa}$, $T_1 = 280\\text{ K}$, and back-pressure ratio $P_b/P_1 = 4.85$. First oblique shock angle $\\beta_1 = 32.4^\\circ$ ($\\theta_1 = 7.8^\\circ$), normal Mach stem height $h_{stem} = 16.5\\text{ mm}$ with triple point at $(128.5, 33.5)\\text{ mm}$, wall separation bubble spanning $L_{sep} = 68.0\\text{ mm}$ from $x_{sep} = 102.0\\text{ mm}$, exit $M_2 = 1.35$ ($P_2 = 212.0\\text{ kPa}$), and Kantrowitz unstart margin $\\Delta x_{margin} = 42.0\\text{ mm}$.",
    evaluationCriteria:
      " Isolator duct scaled from $x=0$ to $500\\text{ mm}$ showing intersecting oblique shocks forming a central vertical Mach stem, triple points, trailing slip lines, and wall separation bubbles with recirculating velocity arrows. Pair a Mach contour map ($M=2.5$ red to $M=0.72$ subsonic blue behind the Mach stem to $M=1.35$ green) with an aligned wall static pressure plot $P_w(x)/P_1$.",
  },
  "FE-AERO-05": {
    coreKey: "Ultra-High-Temperature Ceramic (ZrB2-SiC) Hypersonic Stagnation Point Ablation and Multi-Tier Thermal Gradient",
    groundTruth:
      "Fay-Riddell stagnation heat flux $\\dot{q}_w = 6.45\\text{ MW/m}^2$ and radiative equilibrium temperature $T_{surf} = 2280\\text{ K}$ ($2007^\\circ\\text{C}$, $\\varepsilon = 0.85$) at Mach 8.0, $h = 32\\text{ km}$, and nose radius $R_N = 15.0\\text{ mm}$. Four-tier depth profile: (1) $\\delta_1 = 35\\text{ }\\mu\\text{m}$ porous $t\\text{-ZrO}_2$ filled with liquid $\\text{SiO}_2\\text{-B}_2\\text{O}_3$ glass, (2) $\\delta_2 = 80\\text{ }\\mu\\text{m}$ SiC-depleted $\\text{ZrB}_2$ zone with outgassing $\\text{B}_2\\text{O}_3(g)/\\text{SiO}(g)$, (3) $\\delta_3 = 8.0\\text{ mm}$ virgin $\\text{ZrB}_2\\text{-SiC}$ bulk ($k = 55.0\\text{ W/(m}\\cdot\\text{K)}$), and (4) $\\delta_4 = 15.0\\text{ mm}$ C/C insulator ($k_{ins} = 1.25\\text{ W/(m}\\cdot\\text{K)}$) stepping from $2280\\text{ K} \\to 1920\\text{ K} \\to 1150\\text{ K} \\to 420\\text{ K}$.",
    evaluationCriteria:
      "Leading-edge arc and magnified 4-layer microstructural cross-section with distinct vector textures for glassy columnar $\\text{ZrO}_2$, porous SiC-depleted zone, dense UHTC bulk, and C/C substrate. Overlay isotherms ($2000\\text{ K}, 1500\\text{ K}, 1000\\text{ K}, 500\\text{ K}$) showing a sharp Fourier slope break at the UHTC-insulator interface and label the Passive-to-Active Oxidation Boundary ($P_{O2} = 125\\text{ Pa}$).",
  },
  "FE-AERO-06": {
    coreKey: "Deep Space Solar Photon Sail Radiation Pressure Momentum Exchange and Billow Curvature Torque Decoupling",
    groundTruth:
      "Non-ideal solar radiation pressure force $\\vec{F}_{SRP} = P_0(R_0/R)^2 A\\cos\\theta[(1-\\rho_s)\\hat{u}_i + 2(\\rho_s\\cos\\theta + \\rho_d/3)\\hat{n}_{eff} + \\varepsilon_f B_f\\hat{n}_{eff}]$ at 1 AU ($P_0 = 4.56 \\times 10^{-6}\\text{ N/m}^2$, $A = 80.0\\text{ m}^2$, $\\rho_s = 0.88$, $\\rho_d = 0.05$). Billow deflection $w(r) = w_{max}(1-(r/R_{quad})^2)$ ($w_{max} = 0.38\\text{ m}$, $\\eta_{billow} = 0.932$) creates CP-CM offset $\\Delta\\vec{r}_{CP-CM} = [0.065, -0.042, 0.015]\\text{ m}$ at $\\theta = 35.0^\\circ$, yielding $|\\vec{F}_{SRP}| = 5.24 \\times 10^{-4}\\text{ N}$ and parasitic torque $|\\vec{\\tau}| = 4.05 \\times 10^{-5}\\text{ N}\\cdot\\text{m}$ compensated by Active Mass Translator shift $\\Delta x_{AMT} = 18.2\\text{ mm}$.",
    evaluationCriteria:
      "3D axonometric 4-quadrant square solar sail with carbon-fiber booms, `<path class=\"billow-contour\">` curvature grid, and animated specular/diffuse photon rays. Dynamically show the CM-CP lever arm, disturbance torque vector $\\vec{\\tau}$, reaction wheel saturation bar filling from 0% to 85%, and AMT mass translation zeroing the torque.",
  },
  "FE-AERO-07": {
    coreKey: "MW-Class Applied-Field Magnetoplasmadynamic Thruster (AF-MPDT) Coaxial Lorentz Acceleration and Ambipolar Plume Divergence",
    groundTruth:
      "3D Lorentz force density $\\vec{f}_L = \\vec{j} \\times \\vec{B} = (j_\\theta B_z - j_z B_\\theta)\\hat{r}_{\\text{pinch}} + (j_z B_r - j_r B_z)\\hat{\\theta}_{\\text{swirl}} + (j_r B_\\theta - j_\\theta B_r)\\hat{z}_{\\text{Hall}}$ in a 1.5 MW Argon thruster ($J = 3500\\text{ A}$, $V_d = 430\\text{ V}$, $\\dot{m} = 0.82\\text{ g/s}$, $B_{z0} = 0.48\\text{ T}$) producing $v_{ex} = 46.5\\text{ km/s}$, $I_{sp} = 4740\\text{ s}$, and $F = 38.13\\text{ N}$. Ambipolar radial field $E_r = -\\frac{k_B T_e}{e n_e}\\frac{\\partial n_e}{\\partial r}$ ($T_e = 4.2\\text{ eV}$, $n_e = 2.5 \\times 10^{20}\\text{ m}^{-3}$) sets plume half-angle $\\theta_{div} = 21.8^\\circ$ ($\\eta_{div} = 0.964$).",
    evaluationCriteria:
      "Axisymmetric half-section showing central tungsten cathode, annular water-cooled copper anode, external solenoid coils, and diverging magnetic nozzle flux lines $B$. Overlay current vectors $\\vec{j}$, helical-to-axial plasma velocity vectors $\\vec{u}$, violet-to-cyan density/potential contours, and the $\\theta_{div} = 21.8^\\circ$ plume divergence cone.",
  },
  "FE-AERO-08": {
    coreKey: "Ultra-Deep 12,000 m HPHT Wellbore Drill String Sinusoidal-to-Helical Buckling Transition and Stick-Slip Resonance",
    groundTruth:
      "In a $H_{well} = 12,000\\text{ m}$ wellbore ($\\theta = 15.0^\\circ$, $D_h = 215.9\\text{ mm}$, 5-inch S-135 drill pipe $EI = 4.85 \\times 10^6\\text{ N}\\cdot\\text{m}^2$, $\\omega = 285.0\\text{ N/m}$, radial clearance $r = 44.45\\text{ mm}$), critical buckling loads are $F_{sin} = 2\\sqrt{EI\\omega\\sin\\theta/r} = 179.8\\text{ kN}$ and $F_{hel} = 2\\sqrt{2}F_{sin} = 508.6\\text{ kN}$, placing the lower $1100\\text{ m}$ under $WOB = 580.0\\text{ kN}$ into full helical buckling. Stick-slip torsional oscillation ($T_{tors} \\approx 7.55\\text{ s}$, $f_0 = 0.132\\text{ Hz}$, surface $\\Omega_{top} = 80.0\\text{ rpm}$) alternates between a $3.20\\text{ s}$ stick phase ($\\omega_{bit} = 0$, $\\tau_{max} = 38.5\\text{ kN}\\cdot\\text{m}$) and a $0.8\\text{ s}$ slip burst peaking at $\\omega_{bit,max} = 265.0\\text{ rpm}$.",
    evaluationCriteria:
      "Full $0\\text{-}12000\\text{ m}$ depth scale paired with a 3D bottom-hole assembly cutaway showing pitch-shortening helical buckling (`<path id=\"helical-coil\">`) and red wall-contact stress patches. Synchronize a dashboard animating the bit tachometer sticking at 0 rpm (red indicator) and snapping to 265 rpm (green indicator) alongside a sawtooth torque curve $\\tau(t)$ and limit-cycle phase portrait ($\\tau$ vs $\\omega_{bit}$).",
  },
  "FE-AERO-09": {
    coreKey: "Full-Ocean-Depth 11,000 m Manned Submersible Ti-6Al-4V ELI Spherical Pressure Hull Elastoplastic Buckling and Viewport Reinforcement Topology",
    groundTruth:
      "Ti-6Al-4V ELI spherical hull ($E = 114.0\\text{ GPa}$, $\\nu = 0.33$, $\\sigma_y = 825.0\\text{ MPa}$, $R_i = 1050\\text{ mm}$, $t = 52.0\\text{ mm}$) under $P_{ext} = 115.0\\text{ MPa}$ hydrostatic pressure has ideal Zoelly elastic buckling pressure $P_{cr,el} = \\frac{2E}{\\sqrt{3(1-\\nu^2)}}(t/R_{mid})^2 = 328.6\\text{ MPa}$ and imperfection-reduced elastoplastic buckling pressure $P_{cr,real} = \\eta_p P_{cr,el} = 141.3\\text{ MPa}$ ($\\delta_{imp} \\le 1.5\\text{ mm}$, $\\eta_p \\approx 0.43$, $SF = 1.229$). ASME PVHO-1 conical viewport ($\\alpha = 45.0^\\circ$) uses an integral boss thickened to $t_{boss} = 88.0\\text{ mm}$ ($R_{fillet} = 125.0\\text{ mm}$, $\\beta = 18.0^\\circ$), keeping peak stress at $\\sigma_{vM,max} = 712.0\\text{ MPa} < \\sigma_y$.",
    evaluationCriteria:
      "Cross-section of the spherical hull, conical PMMA viewport, and integral boss filled with FEA von Mises stress contours ($200\\text{ MPa}$ blue to $750\\text{ MPa}$ red, nominal membrane $\\sim 550\\text{-}600\\text{ MPa}$ green) under radial external pressure arrows ($P_{ext} = 115\\text{ MPa}$). Dimension $t_{boss} = 88\\text{ mm}$ and $R = 125\\text{ mm}$, and include an imperfection sensitivity curve of $P_{cr}$ versus $\\Delta R/t$.",
  },
  "FE-AERO-10": {
    coreKey: "Interplanetary Space Station 7-DOF Relocatable Manipulator Inchworm Walking Gait and Dynamic Capture Docking",
    groundTruth:
      "Symmetric 7-DOF space manipulator ($L = 14.80\\text{ m}$, $M_{arm} = 1750\\text{ kg}$) relocating between PDGF-A and PDGF-B ($D_{base} = 11.50\\text{ m}$) regulates redundancy arm angle $\\psi(t)$ via null-space projection of $\\dot{\\vec{x}} = J(\\vec{\\theta})\\dot{\\vec{\\theta}}$ to keep manipulability $w = \\sqrt{\\det(JJ^T)} \\ge 0.082$ and elbow pitch $\\theta_{elbow} \\in [15.0^\\circ, 162.0^\\circ]$. The $30.0\\text{ s}$ gait cycle spans LEE-2 release ($0\\text{-}10\\text{ s}$), arch flip ($10\\text{-}22\\text{ s}$), visual alignment within $\\Delta r_{align} \\le 15.0\\text{ mm}, \\Delta\\phi \\le 1.2^\\circ$ ($22\\text{-}27\\text{ s}$), and snare capture limiting station angular disturbance to $\\Delta\\omega_{ISS} < 0.015^\\circ/\\text{s}$ ($27\\text{-}30\\text{ s}$).",
    evaluationCriteria:
      "Space station truss and solar array backdrop with PDGF-A and PDGF-B anchors and hierarchical forward-kinematics groups `<g id=\"joint-1\">` through `<g id=\"joint-7\">` driven by `<animateTransform>` along a cyan `<path class=\"end-effector-trajectory\">`. Include a live telemetry bar showing Base Switch (A to B), joint angles, manipulability $w$ staying in the safe green zone, and 3-snare LEE latching.",
  },
  "FE-META-01": {
    coreKey: "Grima-Evans Rotating Rigid Squares Auxetic Mechanical Metamaterial Kinematics",
    groundTruth:
      "A 4x4 hinged rigid-square array exhibits an isotropic in-plane Poisson's ratio strictly equal to $\\nu = -1$, with instantaneous dimensions $L_x(\\theta) = L_y(\\theta) = 2\\sqrt{2}a\\cos(\\theta/2 - \\pi/4)$. Unit squares of edge length $a = 40\\text{ px}$ (hinge tolerance $\\le 0.5\\text{ px}$) rotate periodically and smoothly between $10^\\circ$ and $80^\\circ$.",
    evaluationCriteria:
      "Adjacent squares counter-rotate synchronously by equal angles around shared vertices while central rhombic pores expand and contract periodically. The transverse-to-axial strain ratio must remain $+1$ with edge-length distortion error $< 0.1\\%$.",
  },
  "FE-META-02": {
    coreKey: "Acoustic Topological Valley Hall Edge State Backscattering-Immune Waveguide Transport",
    groundTruth:
      "Triangular sonic-crystal lattice ($a = 60\\text{ px}$) with upper-domain triangular scatterers rotated $+30^\\circ$ and lower-domain scatterers rotated $-30^\\circ$, yielding valley Chern number difference $|\\Delta C_V| = 1$. Dynamic acoustic wavepackets traverse a Z-shaped domain wall with two sharp $120^\\circ$ bends at near-zero reflection ($R \\approx 0$) and transmittance $T > 98\\%$.",
    evaluationCriteria:
      "Equiphase wavefronts flow smoothly along the Z-shaped domain wall without standing-wave fringes at either $120^\\circ$ corner, maintaining output-to-input energy flux deviation $< 2\\%$.",
  },
  "FE-META-03": {
    coreKey: "Spin-Decoupled Dielectric Chiral Metasurface with Giant Circular Dichroism and Geometric Phase Step",
    groundTruth:
      "Spatial Jones-matrix spin decoupling using $\\text{TiO}_2$ nanopillars (height $600\\text{ nm}$, pitch $350\\text{ nm}$) at wavelength $\\lambda = 633\\text{ nm}$. Left-circularly polarized (LCP) light focuses into a central Airy spot with transmittance $\\ge 90\\%$, whereas right-circularly polarized (RCP) transmittance is $\\le 5\\%$, achieving circular dichroism $CD \\ge 0.89$.",
    evaluationCriteria:
      "The LCP focal plane displays a sharp bright Airy disk while the RCP focal plane remains dark, with focal spot FWHM matching $0.51\\lambda/\\text{NA} \\pm 5\\%$.",
  },
  "FE-META-04": {
    coreKey: "Epsilon-Near-Zero (ENZ) Subwavelength Waveguide Bend Supercoupling and Phase Tunneling",
    groundTruth:
      "In the Maxwell-Ampere ENZ limit, phase accumulation approaches zero across a subwavelength bend channel ($w_{ch} = 15\\text{ px}$) connecting wide waveguides ($W_{in} = 120\\text{ px}$, 1:8 contraction ratio). The electric field is compressed $8\\times$ inside the channel by area conservation, achieving transmittance $\\ge 98\\%$ and reflectance $\\le 2\\%$.",
    evaluationCriteria:
      "The electric field inside the bent channel flashes uniformly in global synchrony without spatial wavelength fringes, reconstructing a planar outgoing wavefront strictly in-phase with the incident wave (equiphase curvature error $\\le 0.005\\text{ px}^{-1}$).",
  },
  "FE-META-05": {
    coreKey: "2D Benalcazar-Bernevig-Hughes (BBH) Quantized Quadrupole Topological Insulator Zero-Energy Corner States",
    groundTruth:
      "BBH tight-binding lattice with $\\pi$ flux per plaquette and intracell-to-intercell hopping ratio $\\gamma/\\lambda = 0.2 < 1$, yielding quantized quadrupole moment $q_{xy} = e/2$. Four zero-energy corner modes pinned at mid-gap $E = 0$ decay bi-exponentially into the bulk with localization length $\\xi = 0.62a$.",
    evaluationCriteria:
      "The 8x8 lattice bulk and four 1D edges remain dark while intense hot-spot modes light up solely at the four corners, decaying by $> 95\\%$ within $2a$ toward the center with corner symmetry variance $\\le 0.5\\%$.",
  },
  "FE-META-06": {
    coreKey: "STM Hydrogen Depassivation Lithography (HDL) and Single-Atom Transistor Phosphorus Dopant Placement",
    groundTruth:
      "On a reconstructed $\\text{Si}(001)\\text{-}2\\times 1$ surface (dimer row pitch $0.768\\text{ nm}$, intra-row dimer period $0.384\\text{ nm}$), inelastic multi-electron vibrational heating at $+2.5\\text{ V}$ and $2.0\\text{ nA}$ excites $\\text{Si-H}$ stretching modes. Desorbing exactly 3 adjacent dimers (6 H atoms) along a single row opens a $1.15\\text{ nm} \\times 0.4\\text{ nm}$ reactive window for $\\text{PH}_3$ incorporation.",
    evaluationCriteria:
      "Against the striped dimer-row background, the central lithographic window exposes bright dangling-bond lobes without spillover to neighboring dimers, maintaining window aspect ratio within $2.8\\text{-}3.2$ and STM tip positioning tolerance $\\le 0.05\\text{ nm}$.",
  },
  "FE-META-07": {
    coreKey: "Magic-Angle Twisted Bilayer Graphene (TBG) Sub-Angstrom Moire Superlattice Atomic Reconstruction and Soliton Network",
    groundTruth:
      "At magic angle $\\theta = 1.08^\\circ$, the Moire superlattice period is $L_M = 13.06\\text{ nm}$, and van der Waals relaxation shrinks high-energy AA stacking cores to radius $3.2\\text{ nm}$ (area fraction reduced from $33\\%$ to $\\le 12\\%$). Low-energy AB/BA triangular domains expand across $1.8\\text{ nm}$ shear-soliton domain walls with local Burgers vector $b = a_0/\\sqrt{3}$.",
    evaluationCriteria:
      "Periodic bright AA nodes spaced at $13.06 \\pm 0.5\\text{ nm}$ are interconnected by narrow Y-junction dark soliton walls separating uniform AB and BA domains with aligned hexagonal centers.",
  },
  "FE-META-08": {
    coreKey: "Ultralight High-Stiffness Octet-Truss Nanolattice Euler Buckling and Specific Energy Absorption Limit Cycle",
    groundTruth:
      "Satisfying Maxwell's rigidity criterion $M = b - 3j + 6 = 36 - 3(14) + 6 = 0$, the stretching-dominated octet-truss nanolattice scales linearly in relative stiffness ($E/E_s \\propto \\rho^1$). Under cyclic uniaxial compression from $\\varepsilon = 0$ to $15\\%$ and back to $0$, struts undergo half-sine Euler buckling and achieve $100\\%$ elastic recovery upon unloading.",
    evaluationCriteria:
      "Diagonal struts buckle outward symmetrically in coordinated half-sine arcs ($R^2 \\ge 0.99$) under compression without joint detachment, preserving strict $C_4$ rotational symmetry at peak deformation.",
  },
  "FE-META-09": {
    coreKey: "Wave-Based Analog Computing Metasurface for All-Optical Real-Time Spatial Laplace Differentiation and Edge Extraction",
    groundTruth:
      "A Green's-function photonic-crystal metasurface slab (thickness $320\\text{ nm}$ at $\\lambda = 850\\text{ nm}$) implements the Fourier spatial transfer function $H(k_x, k_y) \\propto -(k_x^2 + k_y^2)$, outputting the 2D Laplacian $(-\\nabla^2)$ of the incident field. Uniform interior regions are attenuated by $> 99.5\\%$, leaving narrow double-peaked interference contours along geometric edges.",
    evaluationCriteria:
      "Homogeneous interior and background zones remain dark (central leakage $< 0.005 I_{\\text{edge}}$) while continuous high-contrast bright contours trace the object boundaries with azimuthal peak-intensity variation $\\le 3\\%$.",
  },
  "FE-META-10": {
    coreKey: "Superconducting SQUID Array Microwave Metamaterial Flux-Tunable Dispersion and Kerr Nonlinearity",
    groundTruth:
      "Josephson inductance tunes with external magnetic flux as $L_J(\\Phi) = \\Phi_0 / [2\\pi I_c \\cos(\\pi\\Phi/\\Phi_0)]$, shifting the microwave resonance dip downward by several GHz as $\\Phi/\\Phi_0$ sweeps from $0$ to $0.45$. At high drive power, Kerr nonlinearity tilts the resonance dip leftward into Duffing bistability and hysteretic switching.",
    evaluationCriteria:
      "The sharp V-shaped transmission dip ($Q \\ge 5000$) shifts smoothly leftward, exhibits Kerr hysteretic jumps near half-integer flux quanta, and oscillates with strict $\\Phi_0$ periodicity.",
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
