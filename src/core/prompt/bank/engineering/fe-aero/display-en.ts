import type { LocalizedStandardEntry } from "../../../types";

export const FE_AERO_LABELS_EN: Readonly<Record<string, string>> = {
  "fe-aero-v1": "FE-6: Commercial Spaceflight & Hypersonics (10-Prompt Suite)",
};

export const FE_AERO_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "fe-aero-v1": {
    coreKey: "Booster Chopstick Catch Dynamics, Rotating Detonation Combustion & Hypersonic Reentry Shock Interaction",
    groundTruth:
      "Grounded in heavy-lift launch tower chopstick catch damping mechanics, Rotating Detonation Rocket Engine (RDRE) supersonic shock-wave reflections, lunar-return skip-reentry lift-to-drag corridor envelopes, and deep-ocean Ti-6Al-4V pressure-hull buckling, obeying Newtonian mechanics, gas dynamics, and finite-element stress equations.",
    evaluationCriteria:
      "1. Trajectory & aerodynamics: Reentry skip corridors, isolator Mach stems, and oblique shock polar angles match compressible gas dynamics; 2. Structural mechanics: Gimbal attitude decoupling, drill-string helical buckling, and von Mises stress contours are physically consistent; 3. XML compliance: Strictly well-formed XML with zero JavaScript.",
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
};
