/**
 * English PromptStandard definitions for the 40 World Landmark miniature dioramas
 * (`landmark-<slug>`) and their 40 animated counterparts (`landmark-anim-<slug>`).
 */

import type { LocalizedStandardEntry } from "./standards-single-en";

const MOTION_CORE_KEY_EN =
  "smooth looping animation of moving diorama props around their own local pivot axes while keeping the main landmark stationary";

const MOTION_CRITERIA_EN =
  " Motion criteria: Full credit when moving elements from the environment section animate in smooth, seamless loops around their own local pivot centers while the main landmark remains stationary, driven purely by SMIL or inline CSS (static scene receives full credit if no moving elements exist). Deductions: adding extra objects, lighting effects, or weather solely for animation; moving or deforming the main landmark; rotating around the canvas origin so parts fly off; visible loop seam jumps; using JavaScript; XML parse errors.";

const LANDMARK_BASE_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "paris-eiffel-tower": {
    coreKey: "Concave tapering curve of the four-legged lattice tower, two-tier platform segmentation, and monochrome wrought-iron finish",
    groundTruth:
      "Architectural height 300 m, square base side 125 m (height-to-width ratio ~2.4:1); four splayed lattice legs at the base corners connected by decorative arches; three accessible platform levels (first at ~57 m, top observation deck at 276 m) surmounted by an antenna spire (330 m total); concave exponential outer profile; wrought-iron lattice painted in three graded shades of Eiffel Tower brown from dark at the base to light at the top.",
    evaluationCriteria:
      "Full credit: Four lattice legs, decorative base arches, two ring platforms, concave tapering shaft, and top spire/antenna present; height ~2.4x base width; monochrome brown palette; Champ de Mars lawn strip and Seine corner on the plinth. Deductions: Straight conical shaft or fewer than four legs; missing base arches or platforms; silver-gray steel finish; night lighting/sparkle effects; spherical or non-Eiffel crown.",
  },
  "london-tower-bridge": {
    coreKey: "Portal silhouette of twin Gothic towers with high-level walkways, central double-leaf bascule span, and suspension side spans",
    groundTruth:
      "Opened 1894; total length 290 m, central bascule span 61 m, main towers 65 m tall, high-level walkways 44 m above the river; twin Victorian Gothic steel-framed towers clad in Cornish granite and Portland stone; central double-leaf bascule bridge flanked by two suspension side spans with curved steel chains and vertical hangers; steelwork painted blue and white.",
    evaluationCriteria:
      "Full credit: Twin pointed-roof stone towers, twin high-level enclosed walkways, central double-leaf bascule deck, suspension side spans with chains/hangers, and shore abutment towers; blue-and-white steelwork with gray-white stone; tower height comparable to central span width; Thames river plinth. Deductions: Single or cylindrical tower; missing high-level walkways; single arch or cable-stayed bridge; red or gray steelwork; Tower of London drawn as main subject.",
  },
  "prague-charles-bridge": {
    coreKey: "Long horizontal multi-arch stone deck, Gothic bridge towers at both ends, and rhythmic balustrade statue silhouettes",
    groundTruth:
      "Built 1357–1402; length 515.8 m, width 9.5 m, 16 semicircular stone arches (max span 13.4 m) of Bohemian sandstone with ice guards on piers; single high Gothic tower at the Old Town end and an asymmetric pair of towers at the Lesser Town end; 30 Baroque statue groups arrayed along both parapets; pedestrian-only stone deck.",
    evaluationCriteria:
      "Full credit: Multi-span semicircular arches, stout piers, nearly level long deck, single tower at one end and paired towers at the other, evenly spaced statue silhouettes along both parapets, dark gray-brown sandstone, Vltava river plinth. Deductions: Fewer than six arches or pointed arches; steep camelback hump deck; missing bridge towers; identifiable human facial portraits on statues; steel or timber texture; castle drawn as main subject.",
  },
  "bruges-belfry": {
    coreKey: "Square brick lower tower rising from the center of a rectangular cloth hall facade, topped by a lighter octagonal stone lantern with a flat crown",
    groundTruth:
      "Begun c. 1240, upper stages rebuilt after 1280 fire, octagonal stone upper stage added 1483–1487, wooden spire burned down in 1741 and never rebuilt, Gothic Revival openwork parapet added in 1822; height 83 m (leaning 87 cm east); square brick lower shaft with four corner pinnacles, octagonal pale limestone upper stage with flat top; rises from the front center of the rectangular Market Hall (44 m × 84 m) enclosing an inner courtyard.",
    evaluationCriteria:
      "Full credit: Distinct two-tone segmentation between square brick lower shaft (with four corner turrets) and paler octagonal stone upper lantern (with arched openings and flat openwork parapet), rising from the front center of a deep rectangular courtyard hall on a paved market square. Deductions: Adding a spire or pointed cap; uniform material/color across lower and upper stages; circular lower shaft; freestanding tower without the Market Hall; exaggerated lean.",
  },
  "beijing-temple-of-heaven": {
    coreKey: "Progressive tapering of triple deep-blue circular eaves, three-tiered white marble circular terrace, and vermilion cylindrical hall",
    groundTruth:
      "Complex founded 1420, Hall of Prayer for Good Harvests rebuilt in the 1890s after 1889 fire; hall height 38 m, diameter 36 m (~1:1 height-to-diameter ratio); triple-eaved conical roof covered in deep cobalt-blue glazed tiles crowned with a gilt finial; three-tiered circular white marble terrace (Qigutan) with balustrades and axial stairs; all-timber structure with vermilion walls and polychrome bracket friezes.",
    evaluationCriteria:
      "Full credit: Three-tiered circular white marble base, vermilion cylindrical hall, three progressively smaller deep-blue circular umbrella roofs, golden top finial, ~1:1 hall height-to-diameter ratio, axial causeway and cypress trees on plinth. Deductions: Fewer than three eaves or polygonal/square roof; yellow or green roof tiles; square or missing terrace base; square hall plan; text plaques or flags.",
  },
  "kyoto-kiyomizu-dera": {
    coreKey: "Interlocking timber pillar-and-beam trestle beneath the cantilevered stage, sweeping cypress-bark hip-and-gable roof, and steep hillside setting",
    groundTruth:
      "Founded 778, present Main Hall rebuilt in 1633; wooden stage cantilevers ~13 m above the steep Otowa hillside supported by an interlocking grid of tall zelkova timber pillars and horizontal tie beams joined without nails; large dark gray-brown cypress-bark (hiwadabuki) irimoya roof; unpainted dark brown timber framing.",
    evaluationCriteria:
      "Full credit: Steep hillside slope, cantilevered wooden stage, tall interlocking timber pillar-and-beam lattice beneath the stage (roughly equal in height to the hall above), expansive gray-brown hip-and-gable roof, dark brown unpainted wood, autumn maples and slope on plinth. Deductions: Hall sitting on flat ground without cantilever; missing under-stage timber lattice; blue/green glazed tiles; vermilion-painted hall; pagoda drawn as main subject.",
  },
  "jaipur-hawa-mahal": {
    coreKey: "Five-story pyramidal tapering screen facade, dense honeycomb array of semi-octagonal jharokha bay windows, and terracotta-pink sandstone palette",
    groundTruth:
      "Built 1799; height ~15 m, five stories tapering upward like a crown; street facade pierced by 953 small lattice windows arranged in rows of semi-octagonal projecting bays (jharokhas) topped with miniature domes and finials; built of red and pink sandstone with white lime border trim; upper three stories are only one room deep.",
    evaluationCriteria:
      "Full credit: Five-story upward-tapering crown profile, dense rows of semi-octagonal projecting bay windows with lattice screens and mini domes, topped by small chhatri pavilions, wafer-thin building depth, terracotta-pink palette with white trim, street plinth. Deductions: Un-tapered rectangular block; sparse flat square windows; white or yellow facade; deep bulky palace massing; flags or text.",
  },
  "new-york-statue-of-liberty": {
    coreKey: "Raised-torch classical figure posture, seven-rayed crown, and 1:1 height ratio between copper statue and truncated-pyramid granite pedestal on a star fort",
    groundTruth:
      "Dedicated 1886; copper statue 46 m tall, total height with pedestal 93 m (~1:1 statue-to-pedestal height ratio); patinated verdigris copper skin over iron armature; right arm raised holding torch, left arm cradling tablet, seven-rayed crown, draped toga; truncated-pyramid granite pedestal standing atop the 11-pointed star-shaped Fort Wood on Liberty Island.",
    evaluationCriteria:
      "Full credit: Right arm raising torch, left arm holding tablet, seven-rayed crown, draped verdigris robe, truncated-pyramid stone pedestal of equal height to the statue, 11-pointed star fort base, island surrounded by harbor water. Deductions: Swapped left/right arms; crown ray count clearly not seven; gold or brown unpatinated statue; missing or cylindrical pedestal; text, flags, or photorealistic facial portrait.",
  },
  "rio-de-janeiro-sugarloaf-mountain": {
    coreKey: "Steep dome-topped granite monolith, half-height neighboring Morro da Urca peak, and two-stage aerial cableway",
    groundTruth:
      "Monolithic granite-and-quartz dome rising 396 m directly from Guanabara Bay on a peninsula surrounded by water on three sides; neighboring peak Morro da Urca stands at 220 m (~55% of Sugarloaf's height); two-stage aerial cableway (opened 1912, 1,400 m total) running from base to Urca and from Urca to Sugarloaf summit.",
    evaluationCriteria:
      "Full credit: Steep bare-granite dome monolith, half-height flat-topped neighboring peak (Morro da Urca), two-stage cableway lines with tiny cabins, peninsula surrounded by bay water and sandy beach strip, tropical base vegetation. Deductions: Pointed snow-capped peak; missing second peak or single-span cableway; entirely green grass-covered mountain without bare rock; no water; Christ statue or city skyscrapers as main subject.",
  },
  "cape-town-table-mountain": {
    coreKey: "Wide level plateau summit, distinct flanking peaks (Devil's Peak & Lion's Head), and cascading 'tablecloth' orographic cloud",
    groundTruth:
      "Summit elevation 1,084.6 m; level plateau ~3 km wide bounded by sheer quartzitic sandstone cliffs (width ~3x vertical cliff height); flanked by pointed Devil's Peak on the east and domed/conical Lion's Head on the west; thin white 'tablecloth' cloud sheet spilling over the plateau edge; aerial cableway on the western flank.",
    evaluationCriteria:
      "Full credit: Flat horizontal plateau top (width much greater than height), vertical stratified cliff face, two asymmetrically shaped flanking peaks (one pointed, one rounded), thin tablecloth cloud spilling over the rim, single cableway line, fynbos slope and Table Bay coastline. Deductions: Pointed or rounded main summit; gentle slope instead of sheer cliff; missing or identical flanking peaks; snow cover; city drawn as main subject.",
  },
  "sydney-harbour-bridge": {
    coreKey: "Parabolic steel through-arch truss, suspended deck passing through the arch on vertical hangers, and four granite-faced pylons",
    groundTruth:
      "Opened 1932; total length 1,149 m, arch span 503 m, arch crown 134 m above mean sea level, deck clearance 49 m; steel through-arch truss bridge whose roadway passes horizontally through the arch ~1/3 of the way up, suspended from the arch by vertical hangers; flanked by pairs of 89 m granite-faced concrete pylons at each shore.",
    evaluationCriteria:
      "Full credit: Single parabolic steel truss arch (span ~4x crown height), deck passing horizontally through the arch suspended by vertical hangers of varying length, four twin rectangular stone pylons at the arch ends, approach spans, Sydney Harbour water plinth. Deductions: Deck resting on top of the arch crown; missing or equal-length hangers; fewer than four or cylindrical pylons; cable-stayed or suspension cables; Opera House included.",
  },
  "marrakesh-koutoubia-mosque": {
    coreKey: "Five-stage tapering square Almohad minaret, turquoise-and-white tile frieze with stepped crenellations, and three-orb finial",
    groundTruth:
      "Built 1158–1195; square sandstone minaret 77 m tall with 12.81 m base side (height-to-width ratio > 5:1, main shaft 55.68 m); topped by a turquoise-and-white ceramic tile band, stepped merlons, a smaller square lantern turret, a fluted dome, and a finial of three diminishing copper spheres; adjoined by a low wide prayer hall with green-tiled pitched roofs and a planted courtyard.",
    evaluationCriteria:
      "Full credit: Tall square ochre-sandstone shaft (~5x base width), turquoise-white tile band, stepped merlons, smaller square lantern, fluted dome, three diminishing golden spheres, low green-roofed prayer hall and palm courtyard. Deductions: Circular or octagonal tower shaft; pointed conical spire; sphere count not three; missing tile band; prayer hall taller than minaret; text or crescent symbols.",
  },
  "suzhou-tiger-hill-pagoda": {
    coreKey: "Uniform ~3° lean of the seven-story octagonal brick pagoda, alternating arched doors and niches, and corbeled brick eaves",
    groundTruth:
      "Built 907–961 (Five Dynasties) with Ming top repairs; height 47 m, seven stories, octagonal plan, brick masonry imitating timber-frame columns and brackets; uniform ~3° tilt (top displaced 2.32 m horizontally from base); short corbeled brick eaves between stories; stands atop tree-covered Tiger Hill beside the Sword Pool.",
    evaluationCriteria:
      "Full credit: Octagonal seven-story brick tower with a clear uniform lean (~3°), alternating arched openings and niches per story, short corbeled brick eaves, brick timber-imitation relief lines, wooded hillock and rock pool on plinth (height ~3x base width). Deductions: Perfectly vertical or curved banana-like shaft; square or circular plan; not seven stories; upturned wooden eaves or bright glazed tiles; text.",
  },
  "xian-giant-wild-goose-pagoda": {
    coreKey: "Stepped pyramidal tapering of the seven-story square pavilion-style brick pagoda, single arched opening per face, and corbeled brick eaves",
    groundTruth:
      "Founded 652, rebuilt to seven stories c. 704, brick outer facing added 1604; total height 64.1 m on a 4.2 m square platform (48.8 m wide), ground-story side 25 m; square pavilion-style brick pagoda tapering in distinct steps across seven stories; each story has pilaster relief lines, corbeled brick eaves, and a single small arched doorway centered on each face; warm gray-tan brick.",
    evaluationCriteria:
      "Full credit: Square terraced platform, seven-story square brick body stepping inward at each level, single centered arched opening per face per story, corbeled brick eaves, brick pilaster relief, small steeple finial, gray-tan brick palette, courtyard pines. Deductions: Circular or octagonal plan; not seven stories; sweeping upturned wooden roofs or colorful glazed tiles; missing arched openings; text.",
  },
  "lisbon-belem-tower": {
    coreKey: "Juxtaposition of four-story square keep and low hexagonal bulwark projecting into the river, cylindrical bartizan turrets with ribbed domes, and Manueline rope relief",
    groundTruth:
      "Built c. 1514–1519 on the Tagus riverbank; 30 m four-story square tower (~12 m wide) behind an irregular hexagonal lower bastion with 17 cannon embrasures and an open terrace; Manueline limestone architecture featuring cylindrical corner bartizan watchtowers with ribbed domes, a seven-arched south loggia, and carved stone ropework in pale cream-white lioz limestone.",
    evaluationCriteria:
      "Full credit: Four-story square tower, cylindrical corner bartizans with small ribbed domes, arched river-facing loggia, much lower hexagonal bastion with cannon ports projecting forward into the water, carved rope moldings, cream-white limestone, Tagus river plinth. Deductions: Missing bastion or bastion as tall as the tower; circular keep; pointed conical turret roofs; gray or red stone; flags or emblems.",
  },
  "nara-todai-ji": {
    coreKey: "Massive near-cubic hall volume, double-tiered hip-and-gable roof with golden shibi finials, and central karahafu gable over an octagonal viewing window",
    groundTruth:
      "Present Great Buddha Hall (Daibutsuden) completed 1709; frontage 57.5 m (seven bays), depth 50.5 m, height to ridge 49.1 m (height nearly equal to width); double-tiered roof with dark gray tiles and tall golden shibi ridge-end ornaments; lower front eave rises at the center into a curved karahafu gable framing a central viewing window; dark brown timber columns on white plaster walls.",
    evaluationCriteria:
      "Full credit: Low stone terrace with broad stairs, seven-bay dark brown timber colonnade with white infill walls, lower pent eave and upper hip-and-gable roof with golden shibi horns, central curved karahafu gable with window, stone approach path with bronze lantern and miniature deer; height nearly equal to width. Deductions: Vermilion-painted hall; multi-story pagoda roof; missing central gable/window; flat low-slung proportions; blue/green tiles; Buddha statue or text.",
  },
  "budapest-fishermans-bastion": {
    coreKey: "Rhythmic height hierarchy of seven conical-roofed round stone towers, continuous neo-Romanesque arcaded promenade, and symmetrical switchback stairs",
    groundTruth:
      "Built 1895–1902 (designed by Frigyes Schulek) in neo-Romanesque style on Castle Hill; seven round limestone towers with conical roofs symbolizing the seven Magyar chieftains (central main tower tallest); ~140 m viewing terrace connected by continuous triple-arched galleries, openwork parapets, and wide ceremonial switchback staircases in pale creamy-white limestone.",
    evaluationCriteria:
      "Full credit: Seven conical-roofed round towers with the central tower tallest, continuous semicircular arcaded gallery and parapet, symmetrical ceremonial staircases with arched wall openings, pale cream-white stone, wooded hillside and Danube strip at base. Deductions: Tower count not seven; square towers or pointed Gothic arches; missing arcade or stairs; red brick color; statues, flags, or text; Matthias Church drawn as main subject.",
  },
  "segovia-aqueduct": {
    coreKey: "Two-tier semicircular arches at the tallest central section, unmortared granite ashlar texture, and progressive single-tier taper toward both hillsides",
    groundTruth:
      "Built 1st century AD (Roman Empire); elevated urban section ~728 m long, reaching 28.5 m high at Plaza del Azoguejo; 167 semicircular arches of dry-laid gray Guadarrama granite blocks without mortar; central valley crossing features two stacked tiers of arches (upper piers narrower than stepped lower piers) carrying a flat top water channel, transitioning to single-tier arches on the flanking slopes.",
    evaluationCriteria:
      "Full credit: Two-tier semicircular arches across the central dip (upper tier lower than bottom tier), stepped tapering piers, rough dry-laid gray granite block texture, flat continuous top water channel, single-tier end arches, paved plaza and low ochre-roofed houses at base. Deductions: Single-tier arches throughout; pointed arches; smooth brick masonry; curved bridge plan; houses taller than aqueduct; people or text.",
  },
  "montreal-notre-dame-basilica": {
    coreKey: "Symmetrical flat-topped twin Gothic Revival square towers and triple-arched portico below a statuary niche frieze",
    groundTruth:
      "Nave built 1824–1829, facade completed 1865, twin 60 m square towers completed 1841–1843 in Gothic Revival style using gray Montreal limestone; facade divided into three vertical bays and three horizontal levels: triple pointed-arch entrance portico at base, recessed gallery with statue niches and arcaded frieze in the middle, and twin flat-topped crenellated towers with corner pinnacles flanking a recessed central gable.",
    evaluationCriteria:
      "Full credit: Symmetrical flat-topped twin square towers with corner pinnacles, triple pointed-arch entrance portico, niche band and crenellated frieze, deep central recess between towers, pitched nave roof behind, gray limestone, Place d'Armes square plinth. Deductions: Pointed spires on towers; asymmetric or single tower; missing triple portico or niche frieze; red brick or white walls; flags or text.",
  },
  "uyuni-salar-de-uyuni": {
    coreKey: "Hexagonal salt-crust polygon network, flooded mirror reflection, cactus-covered Incahuasi island outcrop, and distant volcano horizon",
    groundTruth:
      "World's largest salt flat (10,582 km² at ~3,656 m elevation, elevation variance < 1 m); dry surface forms a tessellated network of raised hexagonal salt ridges; wet season creates a thin mirror water sheet reflecting sky and landforms symmetrically; rocky dark-brown Incahuasi Island outcrop studded with giant columnar cacti (~12 m tall); Tunupa volcano cone on the distant rim.",
    evaluationCriteria:
      "Full credit: Hexagonal salt-ridge polygon grid, wet mirror zone with vertical reflection symmetry, dark rocky Incahuasi island with tiny columnar cacti, distant ochre-red volcano cone on rim, expansive white-and-pale-blue palette dominating the plinth. Deductions: Drawn as snow or ice floes; missing hexagonal salt pattern; missing island or cacti; buildings, vehicles, or people; inverted reflection; leafy trees.",
  },
  "salzburg-hohensalzburg-fortress": {
    coreKey: "Elongated hilltop curtain-wall enclosure on a sheer dolomite cliff, central rectangular Hoher Stock keep, massive northern Kuenburg bastion, and straight funicular track",
    groundTruth:
      "Founded 1077, curtain wall and four round towers added 1462, expanded 1495–1519, northern Kuenburg bastion completed 1681; 250 m × 150 m enclosure crowning Festungsberg hill (506 m); four-story rectangular central keep (Hoher Stock, 22 × 33 m), 30 m high northern stepped bastion wall facing the city, whitewashed walls with dark gray-brown roofs, and the straight Festungsbahn funicular track ascending the steep wooded northern slope.",
    evaluationCriteria:
      "Full credit: Steep rocky hill, elongated hilltop curtain wall with round towers, massive stepped northern bastion, tall rectangular central keep, straight funicular track up the wooded slope, miniature old-town roofs and Salzach river strip at base; white walls with dark roofs. Deductions: Single fairytale spire castle; fortress on flat ground; missing curtain wall, central keep, or northern bastion; missing funicular track; modern buildings.",
  },
  "carcassonne-cite": {
    coreKey: "Concentric double curtain walls separated by the Lices bailey, 52 round towers with slate witch-hat cones, twin-towered Narbonne Gate, and inner Château Comtal",
    groundTruth:
      "Gallo-Roman and 13th-century concentric fortification restored 1853–1913 by Viollet-le-Duc; nearly 3 km of double curtain walls (inner wall 1,070 m) separated by a continuous grassy ring (the Lices); 52 round towers topped with steep blue-gray slate conical roofs; twin-towered Porte Narbonnaise with barbican on the east; inner Château Comtal with moat and tall square Watchtower on the west; warm ochre sandstone enclosing terracotta-roofed medieval lanes.",
    evaluationCriteria:
      "Full credit: Concentric inner and outer curtain walls with open ring between them, dense array of round towers with steep blue-gray conical roofs, twin-towered Narbonne Gate, inner Château Comtal with square keep, dense terracotta roofs inside, Aude river and stone bridge at hill base. Deductions: Single curtain wall; fewer than 20 towers; flat-topped or red-tiled towers; missing gatehouse or inner citadel; single keep without town.",
  },
  "himeji-castle": {
    coreKey: "Fan-curved dry-stone ishigaki walls, five-roof pure-white main tenshu linked by covered galleries to three smaller tenshu around a courtyard, and alternating chidori/karahafu gables",
    groundTruth:
      "Rebuilt 1601–1609; five-roof, six-story main keep (Daitenshu, 46.4 m tall) connected by covered watari-yagura galleries to three three-story subsidiary keeps (East, West, Northwest) enclosing a small inner court (renritsu-shiki layout); timber structure completely coated in brilliant white shikkui plaster with gray tile roofs, shachihoko ridge finials, and alternating triangular (chidori) and curved (karahafu) gables; rests on steep fan-curved dry-stone walls (up to 26 m) and moats.",
    evaluationCriteria:
      "Full credit: Fan-curved stone walls, white plastered earthen walls with loopholes, three smaller keeps linked by galleries to the five-tiered pure-white main keep around a court, alternating triangular and curved gables, ridge shachihoko, moat and cherry trees. Deductions: Single isolated keep; gray or unpainted wood walls; vertical flat stone walls; missing gables or moat; fewer than four roof tiers.",
  },
  "sousse-ribat": {
    coreKey: "Square Aghlabid stone fortress with round corner towers, semicircular mid-wall bastions, tall cylindrical southeast watchtower, projecting south gatehouse, and arcaded courtyard",
    groundTruth:
      "Founded late 8th century, rebuilt 821 AD (Aghlabid era); ~38 m square stone enclosure with ~11 m crenellated walls, three round corner towers, semicircular mid-wall bastions, and a tall slender cylindrical watchtower/minaret rising from a square podium at the southeast corner; projecting south entrance portal; two-story interior courtyard surrounded by whitewashed barrel-vaulted arcades.",
    evaluationCriteria:
      "Full credit: Square plan, round corner towers, semicircular mid-wall towers, tall slender cylindrical watchtower at the southeast corner (~2x wall height), projecting south gatehouse, visible two-story arcaded inner courtyard, flat terraced roofs, warm sandy-yellow stone. Deductions: Watchtower not at corner or drawn square; missing corner/mid-wall towers; pitched roofs or spires; circular/polygonal fortress; hidden courtyard; European castle styling.",
  },
  "pingyao-city-walls": {
    coreKey: "Square rammed-earth and blue-brick city wall circuit, 72 evenly spaced watchtowers, four corner pavilions, barbican gatehouses, and dense gray-tiled courtyard grid inside",
    groundTruth:
      "Expanded 1370 (Ming dynasty); ~6.4 km square circuit (~1.6 km per side), ~12 m tall, 3.5 m wide paved top walk with outer crenels and inner parapet; rammed earth faced with blue-gray brick; 72 projecting bastions with small dark-red hip-and-gable watchtowers, four taller corner towers, six gates (east and west with outer barbican enclosures and multi-tier gate towers), surrounded by a 4 m moat and enclosing a dense grid of gray-tiled siheyuan courtyards.",
    evaluationCriteria:
      "Full credit: Complete square city wall circuit, crenellated top walk, evenly spaced bastion watchtowers, four corner towers, multi-tier gatehouses with outer barbicans, moat, and dense grid of low gray-tiled courtyard houses inside (walls taller than houses). Deductions: Circular or broken wall; fewer than eight watchtowers; missing corner towers or barbicans; tall modern buildings inside; European castle towers.",
  },
  "jaisalmer-fort": {
    coreKey: "Triple-ringed golden sandstone walls with 99 tightly packed semicircular bastions crowning a desert mesa, packed inside with flat-roofed houses and multistorey palaces",
    groundTruth:
      "Founded 1156 on Trikuta Hill (~76 m above Thar Desert), 99 bastions rebuilt 1633–1647; elongated triangular/oval hilltop (~460 m × 230 m) ringed by three concentric yellow sandstone walls: outer pitching revetment wall, middle snake wall, and inner curtain wall formed by 99 contiguous rounded cylindrical bastions with flared overhang parapets; interior densely packed with flat-roofed golden sandstone houses, carved Jain temple spires, and a seven-story royal palace.",
    evaluationCriteria:
      "Full credit: Desert mesa hill, three concentric wall tiers, tightly packed row of rounded semicircular bastions, monochromatic golden-yellow sandstone across hill, walls, and buildings, dense interior flat-roofed houses topped by taller palace and temple spires, desert town and sand dunes at base. Deductions: Fewer than 10 bastions or square towers; single wall ring; gray/white stone; green forested hill; empty fort interior.",
  },
  "natal-forte-dos-reis-magos": {
    coreKey: "Low five-pointed star stone fort on an intertidal reef, battered walls with cannon embrasures, central two-story square keep, and stone causeway to shore",
    groundTruth:
      "Begun 1598, rebuilt in stone 1614 at the mouth of the Potengi River on a coastal reef connected to the beach by a stone causeway; five-pointed star-polygon plan (240 m perimeter) with sharp projecting triangular bastions, low inward-sloping whitewashed masonry walls pierced by cannon embrasures, a broad paved gun platform, and a small two-story square chapel/quarters block in the center.",
    evaluationCriteria:
      "Full credit: Five-pointed star polygon plan, low battered pale-gray/white stone walls with cannon embrasures, flat open gun deck, small two-story square central building, stone causeway over exposed dark reef rock, river mouth water and sandy beach strip. Deductions: Circular, square, or tall vertical castle; missing causeway; fort sitting inland instead of on a reef in water; modern bridge or high-rises; missing or oversized central house.",
  },
  "brisbane-fort-lytton": {
    coreKey: "Low grassy pentagonal earthwork rampart, water-filled pentagonal moat, river-facing circular gun pits, and sunken parade ground with timber barracks",
    groundTruth:
      "Built 1880–1882 (designed by Peter Scratchley) on the south bank of the Brisbane River mouth; concealed pentagonal grass-covered earthwork fort surrounded by a water-filled moat of matching pentagonal plan; concrete gun emplacements, magazines, and casemate tunnels recessed into the river-facing earthen ramparts; sunken inner parade ground with low corrugated-iron/timber buildings.",
    evaluationCriteria:
      "Full credit: Clear pentagonal plan, low grass-covered earthen ramparts blending into the ground, water-filled pentagonal moat with narrow bridge, recessed circular grey concrete gun pits on the river-facing side, sunken parade ground with low huts, Brisbane River water strip. Deductions: Tall stone castle walls or towers; circular or square plan; missing water moat or gun pits; flags, port cranes, or modern buildings.",
  },
  "avila-city-walls": {
    coreKey: "Rectangular gray granite city wall circuit with 88 closely spaced flat-topped semicircular towers, twin-towered arched gates, and fortified cathedral apse",
    groundTruth:
      "Begun 1090s, rebuilt 12th century; complete 2,516 m rectangular circuit (~900 m × 400 m) of rough gray-and-black granite masonry, 12 m average height, 3 m thick, rising vertically without a talus; 88 closely spaced flat-topped crenellated semicircular towers, ~2,500 merlons, two main eastern gates each flanked by 20 m twin towers linked by a high stone arch bridge, and the semicircular fortified apse of Ávila Cathedral (Cimorro) protruding directly from the eastern wall.",
    evaluationCriteria:
      "Full credit: Complete rectangular gray granite wall circuit, closely spaced flat-topped semicircular towers with crenellations, twin-towered gate linked by a high stone arch, bulging fortified cathedral apse integrated into the east wall, terracotta-roofed medieval town inside, rocky hillside base. Deductions: Conical roofs on towers; fewer than 10 towers; sloped earth talus; only a wall fragment; red brick; modern high-rises.",
  },
  "san-francisco-fort-point": {
    coreKey: "Boxy three-tiered red-brick casemate fort with rows of arched cannon embrasures and flat barbette roof sitting at water level behind a granite seawall",
    groundTruth:
      "Built 1853–1861 by the US Army Corps of Engineers at the Golden Gate strait; 20 m tall, four-sided red-brick Third System coastal fort (three tiers of vaulted brick casemates plus a flat rooftop barbette tier with circular gun mounts) enclosing a courtyard with octagonal stair turrets; sits just 4.6 m above water behind an 1869 pale granite seawall against a coastal bluff (without the Golden Gate Bridge overhead).",
    evaluationCriteria:
      "Full credit: Boxy thick-walled red-brick fort, three stacked rows of evenly spaced arched cannon openings across the three water-facing facades, flat barbette roof with gun circles, inner courtyard, water-level placement behind a pale granite seawall, strait water and green coastal bluff behind. Deductions: Drawing the Golden Gate Bridge; fewer than three tiers of arched openings; circular or star-shaped castle; gray stone walls; perched high atop the cliff.",
  },
  "san-diego-uss-midway": {
    coreKey: "Elongated gray carrier hull with wide overhanging flight deck, 13.5° port-side angled deck, and single mid-starboard island superstructure",
    groundTruth:
      "Commissioned 1945, decommissioned 1992, museum ship in San Diego since 2004; hull length 305 m, beam 37 m, flight deck width 73 m after 1955–1970 modernizations; axial bow deck with two steam catapult tracks plus a 13.5° port-side angled landing deck; three deck-edge elevators (two starboard, one port); single compact multi-tier island superstructure with lattice radar masts at mid-starboard; moored at Navy Pier with empty deck.",
    evaluationCriteria:
      "Full credit: Properly proportioned gray hull, wide overhanging dark-gray flight deck with port-side angled landing deck, single island superstructure with radar masts at mid-starboard, three deck-edge elevators, white runway stripe markings, wooden pier and harbor water, zero aircraft on deck. Deductions: Aircraft on deck; straight axial deck without angled deck; island on port side or multiple islands; hull numbers, text, or flags; stubby hull.",
  },
  "portsmouth-uss-albacore": {
    coreKey: "Complete teardrop body-of-revolution hull resting in dry-land concrete cradles, streamlined fairwater sail, and single propeller with X-stern control surfaces",
    groundTruth:
      "Commissioned 1953, decommissioned 1972, displayed on dry land in Albacore Park (Portsmouth, NH) since 1985; pioneering teardrop hull of revolution (length 62.6 m, beam 8.3 m, ~7.5:1 ratio, widest forward of midships, blunt spherical bow tapering continuously to a pointed tail without a flat deck); streamlined dorsal sail with diving planes; Phase IV tail configuration featuring four diagonal X-configured stern rudders/planes and contra-rotating single-axis propeller.",
    evaluationCriteria:
      "Full credit: Full teardrop hull exposed in dry-land concrete cradles in a grassy park, widest section forward of center, blunt bow and pointed tail, streamlined sail with planes, single tail propeller and diagonal X-stern fins, dark charcoal-gray upper hull and red-brown lower hull. Deductions: Conventional flat-decked submarine hull; cruciform (+) tail fins; twin propellers; floating in water; hull numbers or flags.",
  },
  "sahuarita-titan-missile-museum": {
    coreKey: "Half-open horizontal concrete silo closure door, cutaway 8-level reinforced concrete missile silo housing a slender two-stage rocket, and 3-level domed underground control center",
    groundTruth:
      "USAF Titan II ICBM Launch Complex 571-7 (built 1963, museum since 1986); surface desert compound with chain-link fence, communication tower, and 680-ton concrete silo door permanently locked half-open on rails; subterranean cutaway reveals the 44.5 m deep, 8-level cylindrical silo (2.4 m thick walls) with the 31.4 m two-stage silver-and-black Titan II missile on its thrust mount, connected via a blast-locked cable tunnel to a 3-level domed underground Launch Control Center.",
    evaluationCriteria:
      "Full credit: Desert surface compound with half-open rail-mounted blast door and lattice antenna, deep subterranean cutaway showing the 8-level thick-walled silo, slender two-stage missile standing inside the shaft, connecting tunnel with blast doors, and 3-level domed control center. Deductions: Missile above ground or launching; no underground cutaway; silo door fully closed or fully open; fewer than four silo levels; text, insignia, or flags.",
  },
  "tillamook-hangar-b": {
    coreKey: "Immense barrel-vaulted timber blimp hangar, dense external vertical truss bay ribs, and six-leaf telescoping sliding doors at both ends",
    groundTruth:
      "Built 1942 by the US Navy for K-class blimps; world's largest clear-span wooden structure: length 327 m, width 90 m, height 59 m (~3.6:1 length-to-width ratio); barrel-arch cross-section framed by 51 timber arch trusses creating dense vertical exterior ribs and a full-length rooftop monitor clerestory; each end features two massive concrete door towers flanking six 37 m tall steel-framed sliding door leaves partly open on tracks.",
    evaluationCriteria:
      "Full credit: Elongated barrel-vaulted hangar (~3.6:1 length-to-width, width > height), dense vertical structural bay lines along the curved sides, rooftop monitor ridge, massive concrete end towers with six-leaf sliding doors partly open at both ends, warm weathered wood-plank texture, green pasture plinth. Deductions: Airships or airplanes drawn; flat, pitched, or steel truss roof; missing segmented end doors; stubby square proportions; text or flags.",
  },
  "bedford-cardington-sheds": {
    coreKey: "Twin parallel rectangular giant airship sheds, densely ribbed corrugated cladding, and segmented sliding end doors on concrete A-frame tracks",
    groundTruth:
      "Shed No. 1 built 1915 (enlarged 1924–1926 to 247 m × 55 m × 48 m) and Shed No. 2 relocated beside it in 1928 on flat Bedfordshire farmland; two nearly identical colossal rectangular steel-framed hangars standing parallel (length ~4.5x width, separation gap ~1.5x shed width); vertical corrugated steel walls divided by 30+ structural bays, shallow gambrel/curved roofs with skylights, and giant four-leaf sliding doors supported by outward-sloping steel A-frames at the ends.",
    evaluationCriteria:
      "Full credit: Two identical parallel rectangular giant sheds (~4.5:1 length-to-width), dense vertical bay ribs, shallow twin-pitched/curved roofs with monitor ridges, segmented sliding end doors with external A-frame braces (one shed slightly ajar), muted gray-green/silver-gray corrugated cladding, flat patchwork farmland and tiny village cottages for scale. Deductions: Drawing airships or aircraft; only one shed; barrel-vault or flat roof; stubby proportions; text or flags.",
  },
  "thames-estuary-knock-john-fort": {
    coreKey: "Twin stout hollow concrete cylindrical towers rising from a sunken pontoon in open sea, supporting a rectangular steel gun deck with central radar house and end gun mounts",
    groundTruth:
      "Maunsell Naval Sea Fort grounded in the Thames Estuary in 1942; 51.2 m × 21.2 m submerged reinforced-concrete pontoon base supporting two hollow cylindrical concrete legs (18.3 m tall, 7.3 m diameter) spaced side by side; topped by a rectangular two-level steel gun deck overhanging both towers, featuring semicircular 3.7-inch gun emplacements at bow and stern and a central two-story steel control house with lattice radar mast.",
    evaluationCriteria:
      "Full credit: Open grey-green sea with no land, two parallel stout concrete cylindrical towers rising from a subtle underwater pontoon shadow, overhanging rectangular rusted-steel gun deck on top, central boxy control cabin with lattice mast, circular gun pits at both ends, weathered concrete and rust patina. Deductions: Four-legged Army fort towers; tower count not two; land or shoreline; pristine unweathered paint; text or flags.",
  },
  "wall-minuteman-delta-09": {
    coreKey: "Half-retracted 90-ton concrete blast door with glass viewing enclosure on open prairie, and deep subterranean cutaway shaft housing a white three-stage Minuteman II missile",
    groundTruth:
      "Built 1963 (active 1963–1991, National Historic Site in South Dakota badlands prairie); small 1.6-acre fenced surface compound where the 90-ton horizontal concrete blast door is welded half-open on rails and fitted with a faceted glass viewing canopy; subterranean cutaway reveals the Upper Equipment Room collar and the 24.4 m deep, 3.7 m wide steel-lined concrete launch tube (~6.6:1 depth-to-width ratio) containing a white three-stage Minuteman II ICBM suspended above a dish-shaped flame deflector.",
    evaluationCriteria:
      "Full credit: Flat prairie compound with chain-link fence, half-retracted thick concrete blast door on rails, faceted glass viewing hood over the opening, deep narrow subterranean cutaway shaft with equipment collar, and slender white three-stage conical-nosed missile suspended inside. Deductions: Missile above ground or launching; no underground cutaway; blast door fully closed or missing glass hood; wide/shallow shaft; buildings, text, or flags.",
  },
  "ottawa-diefenbunker": {
    coreKey: "Unassuming surface entry hut on a grassy mound, long subterranean blast tunnel with right-angle blast-trap doors, and buried four-story reinforced-concrete bunker box",
    groundTruth:
      "Canada's Central Emergency Government Headquarters built 1959–1961 near Carp, Ontario; only a small single-story corrugated-metal entrance building, earth mound, and antenna masts appear on the surface; subterranean cutaway reveals a 115 m horizontal corrugated-steel blast tunnel with 90° offset blast doors leading into a buried four-story, 9,300 m² reinforced-concrete box supported by an interior grid of columns, cushioned by gravel drainage layers, with the Bank of Canada vault on the lowest level.",
    evaluationCriteria:
      "Full credit: Modest surface grass mound with small entry hut and antennas, cutaway earth overburden and gravel jacket, long horizontal blast tunnel with offset blast doors, and buried four-story flat-slab concrete bunker showing column grid, rooms, and bottom vault. Deductions: Bunker exposed above ground; no subterranean cutaway; missing blast tunnel; fewer than three underground stories; urban high-rises, text, or flags.",
  },
  "melbourne-hmas-castlemaine": {
    coreKey: "Slender light-gray Bathurst-class corvette hull with high flared forecastle, low rounded cruiser stern, single forward 4-inch gun, open bridge, and single central funnel",
    groundTruth:
      "Built 1942 in Williamstown (museum ship at Gem Pier since 1973); Bathurst-class corvette/minesweeper: length 57 m, beam 9.4 m (~6:1 length-to-beam ratio); raised forecastle deck (~40% of hull length) stepping down to a low main deck and rounded stern; single 4-inch gun with shield on the bow, two-tier forward superstructure with open bridge wings and tripod mast, single slightly raked funnel amidships, two lifeboats on davits, and stern depth-charge rails.",
    evaluationCriteria:
      "Full credit: Slender ~6:1 naval-gray hull, high flared bow stepping down to a low stern, shielded forward deck gun, two-tier bridge with tripod mast, single central black-topped funnel, lifeboats on davits, stern depth-charge racks, moored alongside a wooden pier on calm bay water. Deductions: Aircraft carrier or battleship massing; more than one funnel; missing bow gun; hull numbers, flags, or modern missiles.",
  },
  "fremantle-hmas-ovens": {
    coreKey: "Very slender black Oberon-class submarine perched high on dry-dock keel blocks ashore, tall narrow fin sail, bulbous sonar bow, and twin propellers with cruciform tail fins",
    groundTruth:
      "Oberon-class diesel-electric submarine (commissioned 1969, museum piece on a dry-dock slipway at Fremantle since 1998); length 90.0 m, beam 8.1 m (~11:1 length-to-beam ratio); matte coal-black cylindrical pressure hull topped by a flat narrow casing deck from bow to stern, bulbous bow sonar dome with torpedo shutters, tall thin vertical fin sail forward of midships, and a tapered stern with twin brass propellers and cruciform (+) vertical/horizontal rudders, resting on concrete keel blocks ashore.",
    evaluationCriteria:
      "Full credit: Very slender ~11:1 matte-black hull resting completely out of the water on dry-dock keel blocks and steel cradles, full-length flat casing deck, tall thin fin sail with diving planes, bulbous bow, twin propellers and cruciform (+) stern planes, concrete slipway beside a harbor corner. Deductions: Floating in water; short fat teardrop hull; single propeller or X-stern fins; gray or white hull; hull numbers or flags.",
  },
};

function buildLandmarkStandards(): Readonly<Record<string, LocalizedStandardEntry>> {
  const out: Record<string, LocalizedStandardEntry> = {};
  for (const [slug, std] of Object.entries(LANDMARK_BASE_STANDARDS_EN)) {
    out[`landmark-${slug}`] = std;
    out[`landmark-anim-${slug}`] = {
      coreKey: `${std.coreKey}; ${MOTION_CORE_KEY_EN}`,
      groundTruth: std.groundTruth,
      evaluationCriteria: `${std.evaluationCriteria}${MOTION_CRITERIA_EN}`,
    };
  }
  return out;
}

export const STANDARDS_LANDMARKS_EN: Readonly<Record<string, LocalizedStandardEntry>> =
  buildLandmarkStandards();
