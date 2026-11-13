import type { LocalizedStandardEntry } from "../../../types";

export const OCTOBER_2026_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "animated-jansen-walker-v1": {
    coreKey: "11-Rod Planar Linkage, Circle-Circle Rigid Constraints, 155° Stance Phase & Out-of-Phase Dual Legs",
    groundTruth:
      "Fixed span a=38, vertical offset l=7.8, crank m=15, rigid rods b–k maintain constant length (delta < 3%); foot trajectory has a ~140°–170° horizontal stance phase; dual legs 180° out of phase; seamless loop closure MAE ≡ 0 with effective motion max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: 11 rigid rods assembled without elastic drift, realistic horizontal foot stance, dual legs alternating out-of-phase, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: Slight elastic rod stretching or short stance phase; Fail: Static image (max MAE < 0.015), <script> tag, broken rods, or XML syntax errors.",
  },
  "animated-jumping-spider-leap-v1": {
    coreKey: "8 Legs in Alternating Tetrapod Sets, Hydraulic Pre-Leap Crouch, 0.12s Explosive Extension & Iris Pupil Constriction",
    groundTruth:
      "8 legs strictly divided into alternating sets A & B; crouching phase before launch; legs explosively straighten within 0.12s during takeoff; forward median eyes constrict pupil diameter by 40%–60%; seamless loop closure MAE ≡ 0 with max MAE >= 0.020; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: 8 legs alternating in sets of four, clear slow crouch followed by fast explosive extension (<0.16s), pupil constriction visible, seamless loop MAE ≡ 0 and max MAE >= 0.020, 0 script; Partial: Linear uniform jump velocity without hydraulic snap or missing pupil constriction; Fail: Static image, leg count != 8, <script> tag, or XML syntax errors.",
  },
  "animated-centipede-wave-gait-v1": {
    coreKey: "16-Segment / 32-Leg Chain, Rearward Metachronal Wave, 0.11 Phase Offset & Zero-Slip Planted Stance",
    groundTruth:
      "Countable 16 segments and 32 legs; metachronal wave traveling from head to tail with adjacent leg pairs offset by 0.09–0.13 cycle; planted feet do not slide; lateral traveling wave synchronized with leg cadence; seamless loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Countable 32 legs with smooth rearward metachronal wave, zero slipping during ground contact, synchronized body undulation, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: Leg wave present but disordered phase offsets or rigid straight body; Fail: Static image, uncounted leg blob, legs moving in sync like a comb, <script> tag, or XML syntax errors.",
  },
  "animated-open-differential-v1": {
    coreKey: "30° Isometric Cutaway, Spider Gear Planetary Rotation, Turn Speed Differential & Speed Conservation",
    groundTruth:
      "Input pinion drives ring gear and carrier; in turn condition outside wheel rotates faster than carrier while inside wheel rotates slower by identical amount (ω1 + ω2 = 2ωc); spider gears rotate about cross pin; ground arcs reflect travel length; seamless loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Pinion meshes with ring gear, spider gears rotate on cross pin, outside wheel visibly faster than inside wheel, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: Wheels rotate but at equal speeds or flat 2D projection; Fail: Static image, wheels disconnected, outside wheel slower, <script> tag, or XML syntax errors.",
  },
  "animated-ferris-leveling-v1": {
    coreKey: "A-Frame Structure, Constant Wheel Orbit, Self-Leveling Cabin Reverse Rotation & 4:1 Pinion Drive",
    groundTruth:
      "A-frame wheel rotates with 8 cabins spaced at 45°; drive pinion rotates counterclockwise at 4x wheel speed; each cabin executes equal and opposite inner rotation to maintain horizontal floor (tilt < 5°); seamless loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: 8 cabins evenly spaced, cabin floors remain horizontal throughout the full rotation (tilt < 5°), pinion rotates opposite at 4:1 ratio, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: Cabins stay upright but gear ratio is wrong or teeth slip; Fail: Cabins flip upside-down, wheel static, <script> tag, or XML syntax errors.",
  },
  "animated-octopus-organ-v1": {
    coreKey: "8 Tentacles Multi-Tasking, Simultaneous Manual & Pedal Playing, Key Depressions & Out-of-Phase Cadence",
    groundTruth:
      "Countable 8 tentacles facing organ; 4 tentacles on manual pressing keys, 2 on pedalboard tilting pedals, 2 on stop knobs; key and pedal depression out of phase; 9 pipes arranged symmetrically with peak in middle; seamless loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Exactly 8 tentacles coordinating across manual and pedalboard, visible key and pedal travel out-of-phase, 9 center-peaked pipes, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: 8 tentacles present but keys do not depress; Fail: Tentacle count != 8, octopus facing away from organ, no pedalboard, <script> tag, or XML syntax errors.",
  },
  "animated-peacock-bicycle-v1": {
    coreKey: "12 Eye-Spot Folded Train, Rocking Pelvis Hinge Lag, Dual Pedal-Crank Phase & Non-Breaking Saddle Contact",
    groundTruth:
      "Peacock riding bicycle with feet locked to pedals; crank rotates in 1:1 sync with wheels; pelvis rocks with pedals while 12 eye spots in 3x4 array lag the pelvic tilt; continuous saddle contact; seamless loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Realistic riding posture with feet locked to rotating pedals, 12 eye spots in 3x4 pattern with lagging tail swing, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: Pedals rotate but eye spots not in 3x4 grid or tail rigid; Fail: Floating bird, pedals stationary while wheels turn, eye spots uncounted, <script> tag, or XML syntax errors.",
  },
  "animated-nautilus-spiral-v1": {
    coreKey: "Logarithmic Spiral (phi=1.618 / Quarter-Turn), 12 Chambers Self-Similar Growth & Smooth Crossfade Closure",
    groundTruth:
      "Logarithmic spiral r(θ) = a * e^(b θ) with growth ratio ~1.618 per quarter turn; inner hollow center; 12 chamber walls growing in spacing by same ratio; growth from 8 to 12 chambers with existing walls stationary followed by crossfade loop closure MAE ≡ 0 with max MAE >= 0.015; strictly zero <script> tags.",
    evaluationCriteria:
      "Pass: Rigorous logarithmic spiral geometry with expanding chamber spacing, growth animation without rigid body rotation, seamless loop MAE ≡ 0 and max MAE >= 0.015, 0 script; Partial: Spiral geometry correct but chambers equally spaced or loop uses rigid rotation; Fail: Static image, Archimedean or concentric circles, no hollow core, <script> tag, or XML syntax errors.",
  },
};
