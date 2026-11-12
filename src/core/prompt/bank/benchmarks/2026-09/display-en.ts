import type { LocalizedStandardEntry } from "../../../types";

export const SEPTEMBER_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
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
};
