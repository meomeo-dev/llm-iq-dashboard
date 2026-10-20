/**
 * 《水浒传》第 73–84 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch073-084.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH073_084_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-073": "Ch. 73 · Li Kui Cuts Down the Apricot-Yellow Banner",
  "shuihu-074": "Ch. 74 · Yan Qing Faces Ren Yuan on the Wrestling Stage",
  "shuihu-075": "Ch. 75 · Ruan Xiaoqi Sniffs the Imperial Wine at the Stern",
  "shuihu-076": "Ch. 76 · Tong Guan Views the Formation from the Command Platform",
  "shuihu-077": "Ch. 77 · Song Jiang Appears on the Hilltop",
  "shuihu-078": "Ch. 78 · Song Jiang Reasons with Wang Huan Before the Formations",
  "shuihu-079": "Ch. 79 · Liu Tang's Fire Boats Come Out of the Lotus Marsh",
  "shuihu-080": "Ch. 80 · Zhang Shun Bores the Hull Underwater",
  "shuihu-081": "Ch. 81 · Le He Climbs Out over the Wall by Rope",
  "shuihu-082": "Ch. 82 · Xiao Rang Reads Out the Imperial Edict",
  "shuihu-083": "Ch. 83 · Marching North on the Highroad by Chenqiao Post Station",
  "shuihu-084": "Ch. 84 · Facing Off Before the Formations at Yutian",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH073_084_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-073": {
    coreKey:
      "Before the Hall of Loyalty and Righteousness: Li Kui, with a single broad axe, " +
      "cuts down the apricot-yellow banner and clutches the torn banner cloth in his " +
      "hand, Song Jiang shouts a demand from the entrance of the hall, and Yan Qing and " +
      "the chieftains look startled",
    groundTruth:
      "Chapter 73, \"The Black Whirlwind Pretends to Catch Ghosts; Two Heads Are " +
      "Presented at Liangshan Marsh\". Li Kui \"glared with his strange eyes wide open, " +
      "drew out his big axe, and first cut down the apricot-yellow banner\", \"tearing " +
      "the four characters 'Carry Out Justice on Heaven's Behalf' to shreds, and " +
      "everyone was startled\"; Song Jiang shouted, \"What is this black fellow up to " +
      "now?\" Rushing up into the hall with both axes comes later.",
    evaluationCriteria:
      "Full credit: Before the Hall of Loyalty and Righteousness; on the left of the " +
      "frame, at the entrance of the hall, Song Jiang, with a purplish-brown complexion, " +
      "short, shouts a demand in shock and anger; in the middle of the frame Li Kui, his " +
      "angry eyes glaring wide, his hair done up in twin hair buns, grips a single broad " +
      "axe in his right hand and clutches the torn banner cloth in his left; on the " +
      "right of the frame the apricot-yellow banner lies on the ground, pole and all, " +
      "its cloth ripped and its characters incomplete; behind Li Kui, Yan Qing, " +
      "empty-handed, looks stunned, and the chieftains before the steps look startled. " +
      "Deductions: Li Kui holding two axes or charging up into the hall; Song Jiang with " +
      "the characters tattooed on his face; blood shown.",
  },
  "shuihu-074": {
    coreKey:
      "The wrestling stage (xiantai) at the Daiyue Temple: Ren Yuan on the left takes up " +
      "his stance, Yan Qing, tattooed all over, crouches low on the right, and the match " +
      "referee (bushu) raises his bamboo tally-stick and calls \"Watch the bout!\", the " +
      "two not yet in contact",
    groundTruth:
      "Chapter 74, \"Yan Qing Cleverly Throws the Sky-Holding Pillar; Li Kui Poses as " +
      "Magistrate at Shouzhang\". \"On the bare wrestling stage there were only three " +
      "men; by now the night dew had all dried and the morning sun was just rising\"; " +
      "\"Yan Qing crouched in a heap on the right, and Ren Yuan first took up a stance " +
      "on the left\"; Yan Qing's tattoos are \"like soft kingfisher-green laid over a " +
      "jade pavilion pillar\". Grappling comes later.",
    evaluationCriteria:
      "Full credit: The morning sun just rising; beside the wrestling stage before the " +
      "main hall, display scaffolds (shanpeng) are set out with gold and silver vessels, " +
      "and spectators fill every seat; only three men are on the stage: on the left of " +
      "the frame Ren Yuan, ten feet tall, his hair tied up in a red topknot, in a " +
      "sleeveless vest (zhuyao) embroidered in gold with mandarin ducks, takes up his " +
      "stance; on the right of the frame Yan Qing, smaller than Ren Yuan, bare-chested " +
      "and tattooed all over, crouches low; behind them on the stage the match referee " +
      "raises his bamboo tally-stick. Deductions: The two already in contact, or Ren " +
      "Yuan lifted up and thrown down; more than three men on the stage; a loincloth or " +
      "ring ropes around the stage.",
  },
  "shuihu-075": {
    coreKey:
      "On a boat on Liangshan Marsh: Ruan Xiaoqi, seated at the stern, holds in both " +
      "hands a bottle of imperial wine with its yellow seal undone and sniffs its " +
      "fragrance without drinking, and at the bow stand the dragon-and-phoenix carrying " +
      "poles with a yellow flag stuck in them",
    groundTruth:
      "Chapter 75, \"The Living King of Hell Scuttles the Boat and Steals the Imperial " +
      "Wine; the Black Whirlwind Tears Up the Edict and Reviles the Imperial Envoy\". " +
      "\"One of the boatmen went to the load, took out a bottle of wine, undid its " +
      "seal, and handed it to Ruan Xiaoqi\"; \"Ruan Xiaoqi took it and smelled a " +
      "fragrance that went straight up his nose\"; the ten bottles of imperial wine are " +
      "packed in the dragon-and-phoenix carrying poles, \"with a yellow flag stuck in " +
      "front\". Drinking four bottles in a row comes later.",
    evaluationCriteria:
      "Full credit: A wooden boat on the water of Liangshan Marsh; on the left of the " +
      "frame, at the stern, Ruan Xiaoqi sits holding in both hands a bottle of imperial " +
      "wine with its seal undone, raising it close to sniff the fragrance, not yet " +
      "drinking; on the right of the frame, at the bow, a small yellow flag is stuck in " +
      "front of the dragon-and-phoenix carrying poles; boatmen bend to steady the " +
      "carrying poles or sit at the oars, with short knives at their waists. " +
      "Deductions: Ruan Xiaoqi tilting his head back to drink; Grand Marshal Chen or " +
      "other officials on the boat; the boat taking on water or anyone falling into the " +
      "water; wine jars, gold cups, or glass bottles.",
  },
  "shuihu-076": {
    coreKey:
      "The command platform on the open plain: Tong Guan, south of the formation, gazes " +
      "in alarm at the Nine Palaces Eight Trigrams Formation, red near and black far, " +
      "white on the left and blue-green on the right, the four corners in two colors " +
      "each, and apricot-yellow banners in the center",
    groundTruth:
      "Chapter 76, \"Wu Jialiang Deploys the Banners of the Four Quarters and Five " +
      "Directions; Song Gongming Arrays the Nine Palaces Eight Trigrams Formation\". " +
      "\"Commissioner of Military Affairs Tong Guan, on the command platform in his " +
      "formation, looked hard at the men and horses of Liangshan Marsh\"; \"in the " +
      "center of the eight formations, all the way round, were nothing but " +
      "apricot-yellow banners\"; the red vanguard in the south faces Tong Guan directly, " +
      "the black rearguard is in the north, blue-green is in the east, and white in the " +
      "west. Chen Zhu riding out of the formation comes later.",
    evaluationCriteria:
      "Full credit: Open level country; at the lower left of the frame, on the command " +
      "platform, Tong Guan, in armor and empty-handed, raises his hand to gaze into the " +
      "distance, eyes wide and mouth open in alarm, and at the corner of the platform " +
      "two formation officers hold their command flags hanging down; within the " +
      "formation, the lower part, on the side near the platform, has red flags and red " +
      "armor, the upper part at the far end black flags and black armor, the left white " +
      "flags and white armor, and the right blue-green flags and blue-green armor, the " +
      "small formations at the four corners each take their flags and armor in the " +
      "colors of the two adjacent sides, and in the very center is a ring of " +
      "apricot-yellow banners. Deductions: The center drawn in red or the four corners " +
      "drawn in a single color; fighting or anyone unhorsed; Tong Guan on horseback; " +
      "yin-yang (taiji) or eight-trigram symbols.",
  },
  "shuihu-077": {
    coreKey:
      "At the foot of the hill Tong Guan, on horseback, looks up in great fury, and on " +
      "the hilltop, where the multicolored embroidered banners part, Song Jiang appears, " +
      "the apricot-yellow banner at his side, and the heroes laugh loudly",
    groundTruth:
      "Chapter 77, \"Liangshan Marsh Lays Ambushes on Ten Sides; Song Gongming Defeats " +
      "Tong Guan a Second Time\". \"Then on the hilltop that apricot-yellow banner " +
      "flashed into view, embroidered with the four characters 'Carry Out Justice on " +
      "Heaven's Behalf'\"; \"the great army, men and horses, split into two routes and " +
      "was about to go up the hill, when from the hilltop came drums and music shaking " +
      "the sky, and all the heroes laughed\". The ambush troops charging out come later.",
    evaluationCriteria:
      "Full credit: The foot of a hill by the water; at the lower left of the frame Tong " +
      "Guan, on horseback, in armor and empty-handed, looks up at the hilltop, gritting " +
      "his teeth in great fury, officers on horseback to his left and right hold long " +
      "spears, and the government troops split into two routes, about to go up the " +
      "hill; at the upper right of the frame, on the hilltop, where the multicolored " +
      "embroidered banners part, stands Song Jiang, with a purplish-brown complexion, " +
      "short, the apricot-yellow banner standing at his side and slightly behind him, " +
      "and behind him the chieftains and the gold-spear and silver-spear men stand in " +
      "ranks, with drums and music and everyone laughing loudly. Deductions: The various " +
      "colored banners of the ambush troops patched in; fighting or anyone unhorsed; " +
      "Song Jiang with the characters tattooed on his face.",
  },
  "shuihu-078": {
    coreKey:
      "Before the formations of the two armies: Song Jiang rides out where the " +
      "embroidered banners part, saluting with his fist and calling out a respectful " +
      "greeting as he reasons with Wang Huan, and Wang Huan, gray-haired and " +
      "gray-bearded, holds his long spear and shouts, the two not yet engaged",
    groundTruth:
      "Chapter 78, \"The Ten Military Governors Plan to Take Liangshan Marsh; Song " +
      "Gongming Defeats Grand Marshal Gao for the First Time\". \"The vanguard Wang " +
      "Huan came out of the formation, wielding a long spear, and shouted fiercely from " +
      "horseback\"; \"where the embroidered banners of the opposing formation parted, " +
      "Song Jiang rode out in person and called out a respectful greeting to Wang " +
      "Huan\": \"You are advanced in years and no longer fit to exert yourself for the " +
      "state\". Lin Chong riding out to fight comes later.",
    evaluationCriteria:
      "Full credit: The two armies drawn up facing each other; on the left of the " +
      "frame, where the embroidered banners part, Song Jiang, with a purplish-brown " +
      "complexion, short, on horseback, one hand on the reins and the other fist held " +
      "before his chest in salute, calls out a respectful greeting, holding no weapon; " +
      "on the right of the frame the old general Wang Huan, on horseback, holds his " +
      "long spear raised at a slant, its head pointing up, and shouts fiercely; both " +
      "sides in battle array. Deductions: Wang Huan thrusting with his spear or the two " +
      "generals engaged; Gao Qiu or Lin Chong in the picture; Song Jiang holding a " +
      "weapon or with the characters tattooed on his face.",
  },
  "shuihu-079": {
    coreKey:
      "In the lotus marsh in a fierce wind: the fire boats have been rowed out and " +
      "slipped up beside the line of government ships, Liu Tang stands in the lead boat " +
      "raising a torch, the torches lit but the brushwood not yet burning",
    groundTruth:
      "Chapter 79, \"Liu Tang Sets Fire to the Warships; Song Jiang Defeats Grand " +
      "Marshal Gao a Second Time\". \"From among the reeds, deep in the lotus flowers, " +
      "out of the little inlets and narrow creeks, small boats were all rowed out and " +
      "slipped in among the line of big ships\"; \"at the sound of the drum, they all " +
      "lit their torches together\"; Liu Tang has \"a cinnabar-red birthmark beside his " +
      "temple\" (Chapter 14). The government ships catching fire comes later.",
    evaluationCriteria:
      "Full credit: Daytime, a fierce wind and black clouds; small boats have been rowed " +
      "out of the reeds and lotus on the left of the frame and slipped up beside the " +
      "line of government ships, their holds piled with reeds and dry firewood, and the " +
      "naval soldiers raise freshly lit torches; the lead boat closes on the government " +
      "ships on the right of the frame, and at its bow Liu Tang, with a broad " +
      "purplish-brown face, a cinnabar-red birthmark beside his temple, and black hair, " +
      "raises a torch high in one hand; the government ships are nailed together three " +
      "abreast and locked with iron rings, and the government soldiers back their oars " +
      "in panic. Deductions: The brushwood in the holds or the government ships already " +
      "on fire; the fire boats not near the government ships; anyone falling into the " +
      "water; Liu Tang drawn with red hair.",
  },
  "shuihu-080": {
    coreKey:
      "A cutaway of the sea-loach paddle-wheel ship (haiqiu): above the water the paddle " +
      "blades of the wheels stand still and small boats close in with boards held " +
      "overhead, and below the water Zhang Shun grips a chisel and swings a bronze " +
      "mallet to bore through the ship's bottom",
    groundTruth:
      "Chapter 80, \"Zhang Shun Bores Holes in the Sea-Loach Ships; Song Jiang Defeats " +
      "Grand Marshal Gao a Third Time\". Zhang Shun \"wore no clothes on his upper " +
      "body\", \"several iron chisels stuck at his waist and a bronze mallet in his " +
      "hand\"; \"the spoke-boards of the wheels could not be treaded round at all\"; " +
      "\"they all took mallets and chisels and bored right through the ship's bottom " +
      "from beneath it\"; the men on the small boats \"each held a board over his head " +
      "for cover\". The hold flooding and the capture of Gao Qiu come later.",
    evaluationCriteria:
      "Full credit: Water among the reeds, shown as an above-and-below-water cutaway; in " +
      "the upper half, a bamboo screen along the side of the sea-loach ship hides the " +
      "paddle wheels, showing only the motionless paddle blades along the lower edge, a " +
      "crossbow tower stands on deck, and the men on the small boats each hold a wooden " +
      "board overhead as they close in; in the lower half, in the center, Zhang Shun, " +
      "fair-skinned, with a three-strand black beard, iron chisels stuck at his waist, " +
      "holds a chisel against the ship's bottom with one hand and swings a bronze " +
      "mallet with the other, his companions chiseling at the planks, a thin stream of " +
      "water seeping in through the chisel holes and fine bubbles rising. Deductions: " +
      "The hull cracked apart or anyone falling into the water; sails, cannons, " +
      "funnels, or large exposed wheels in the style of a steam paddle steamer.",
  },
  "shuihu-081": {
    coreKey:
      "Outside the back wall of the Gao residence at the fourth watch: Yan Qing and Dai " +
      "Zong, at the foot of the wall, each haul on a thick rope, and Le He, using hands " +
      "and feet, climbs out over the top of the wall along the rope",
    groundTruth:
      "Chapter 81, \"Yan Qing Meets the Taoist Sovereign on a Moonlit Night; Dai Zong " +
      "Lays a Plan to Get Le He Out\". \"The watch drum had already sounded the fourth " +
      "watch\"; inside the wall, \"all the way round the side were big willow trees\"; " +
      "\"the two of them, outside, twisted the ropes fast and held the rope ends " +
      "tight\"; \"then Le He came clambering out first\". Xiao Rang sliding down and the " +
      "ropes being dropped come later.",
    evaluationCriteria:
      "Full credit: Night at the fourth watch, outside the whitewashed back wall, a row " +
      "of big willows inside the wall, and two thick ropes stretched taut over the top " +
      "of the wall; at the foot of the wall Yan Qing on the left of the frame and Dai " +
      "Zong on the right of the frame each haul on a rope end; at the top of the wall, " +
      "in the center, Le He, using hands and feet, climbs outward along a rope; in the " +
      "distance on the right of the frame two empty boats by the river. Deductions: " +
      "Xiao Rang on the ropes at the same time; masks and black nightclothes; lamps, " +
      "ladders, or pursuers.",
  },
  "shuihu-082": {
    coreKey:
      "Reading out the edict in the Hall of Loyalty and Righteousness: Xiao Rang unrolls " +
      "the yellow-paper edict and reads it out, Su Yuanjing sits to the right of the " +
      "tables, and Song Jiang and Lu Junyi lead the chieftains kneeling below the steps",
    groundTruth:
      "Chapter 82, \"Liangshan Marsh Distributes Its Gold in a Great Market; Song " +
      "Gongming and His Whole Band Accept the Amnesty\". The tables \"were all hung " +
      "round with yellow silk-gauze table skirts embroidered with dragons and " +
      "phoenixes\"; \"in the very center was set the Long-Live dragon tablet; the " +
      "imperial edict in vermilion, written in the emperor's own hand, was placed in " +
      "the middle; the gold and silver plaques were placed on the left; the red and " +
      "green brocades were placed on the right\"; \"Song Jiang, Lu Junyi, and the rest " +
      "all knelt before the hall\"; \"when the bows were done, Xiao Rang read out the " +
      "edict\". Handing out the plaques comes later.",
    evaluationCriteria:
      "Full credit: In the hall, three tables hung with yellow silk-gauze table skirts " +
      "embroidered with dragons and phoenixes, the Long-Live dragon tablet in the very " +
      "center, the gold and silver plaques on the left of the frame and the red and " +
      "green brocades on the right, imperial wine before the tables, and incense " +
      "burning in a gold censer; to the left of the tables Xiao Rang unrolls the " +
      "yellow-paper edict in both hands and reads it out, and to the right of the " +
      "tables Su Yuanjing sits upright; below the steps Song Jiang, with a " +
      "purplish-brown complexion, short, and Lu Junyi lead the chieftains kneeling in " +
      "rows. Deductions: Su Yuanjing reading the edict himself; the plaques, brocades, " +
      "or imperial wine already handed out; Song Jiang with the characters tattooed on " +
      "his face; Su Yuanjing wearing a Ming-style black gauze cap with short rounded " +
      "wings.",
  },
  "shuihu-083": {
    coreKey:
      "The highroad by Chenqiao Post Station: red banners reading \"Shuntian\" (Obey " +
      "Heaven) and \"Huguo\" (Protect the State) lead the way, Song Jiang, wearing the " +
      "precious saber and the bow and arrows bestowed by the emperor, rides in the " +
      "middle, and the generals follow as the army marches north",
    groundTruth:
      "Chapter 83, \"Song Gongming Receives the Edict to Crush the Great Liao; at " +
      "Chenqiao Post Station He Sheds Tears as He Beheads a Petty Soldier\". \"Song " +
      "Jiang urged the three armies on and advanced by the highroad through Chenqiao " +
      "Post Station, ordering his officers and men not to disturb the country people\"; " +
      "in the Wuying Hall he was granted a gold-traced magpie-painted bow and arrows " +
      "and a precious saber; the red banners \"Shuntian\" and \"Huguo\" appear in " +
      "Chapter 82. Beheading the soldier at the post station comes later.",
    evaluationCriteria:
      "Full credit: A yellow-earth official road, the great army marching toward the " +
      "left of the frame; on the left of the frame standard-bearers hold up the red " +
      "banners \"Shuntian\" and \"Huguo\" to lead the way; in the middle of the frame " +
      "Song Jiang, with a purplish-brown complexion, short, in armor, a precious saber " +
      "hanging at his waist and a gold-traced magpie-painted bow and arrows hung from " +
      "his saddle; right of center in the frame Lu Junyi holds his long spear upright; " +
      "on the right of the frame Wu Yong, in a silk-ribbon scarf cap (guanjin) and a " +
      "feather cloak, and Gongsun Sheng, in a Taoist headscarf and a crane-feather " +
      "cloak, ride along behind; all four on horseback. Deductions: Wine and meat at the " +
      "post station, the barracks officer (xiangguan), or a beheading; Song Jiang with " +
      "the characters tattooed on his face or in a brocade robe; the apricot-yellow " +
      "banner.",
  },
  "shuihu-084": {
    coreKey:
      "Before the formations at Yutian County: Lu Junyi, holding his spear, turns to " +
      "put a question, Yelü Dezhong rides out where the gate banners part, and four " +
      "Liao generals are ranged on his left and right, the two sides not yet engaged",
    groundTruth:
      "Chapter 84, \"Song Gongming's Troops Attack the City of Jizhou; Lu Junyi Fights a " +
      "Great Battle at Yutian County\". \"Where the gate banners parted, that Great " +
      "Prince, the emperor's younger brother, rode out in person, his four sons ranged " +
      "on his left and right\"; Lu Junyi asks, \"With the two armies facing the enemy, " +
      "which hero will be first to ride out and fight?\"; of the Liao soldiers, \"every " +
      "man's robe lapped over to the left\". Guan Sheng riding out to fight comes later.",
    evaluationCriteria:
      "Full credit: The plain outside Yutian County, yellow sand on the open ground " +
      "between the two formations; on the left of the frame, before the Song army's " +
      "formation, Lu Junyi, his brows parted like the character ba (eight), on " +
      "horseback, holds his spear in his right hand pointing up at a slant, turning " +
      "back to put a question to the generals on his own side; on the right of the " +
      "frame, under the black eagle banner, where the gate banners part, Yelü Dezhong, " +
      "in an iron helmet with a black pompom tassel, willow-leaf armor, and a robe " +
      "embroidered with coiled dragons, rides out holding a broom saber (saozhou dao), " +
      "with two young Liao generals on each side of him; the Liao soldiers in " +
      "left-lapelled robes. Deductions: Already engaged or anyone unhorsed; the features " +
      "of the Liao figures caricatured or exaggerated; pheasant-feather plumes (lingzi), " +
      "fox tails, or braided hair.",
  },
  "shuihu-anim-073": {
    coreKey:
      "Li Kui, with a single broad axe, having cut down the apricot-yellow banner and " +
      "clutching strips of the torn banner cloth, and Song Jiang shouting a demand from " +
      "the entrance of the hall, with animated fallen banner and torn cloth, red " +
      "banners, and cloth shreds",
    groundTruth:
      "Chapter 73, \"The Black Whirlwind Pretends to Catch Ghosts; Two Heads Are " +
      "Presented at Liangshan Marsh\". Li Kui \"drew out his big axe and first cut down " +
      "the apricot-yellow banner\", \"tearing the four characters 'Carry Out Justice on " +
      "Heaven's Behalf' to shreds\"; before the Hall of Loyalty and Righteousness stand " +
      "\"two red banners with embroidered characters\" (Chapter 71). Rushing up into " +
      "the hall with both axes comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, at the entrance of the hall, Song Jiang, " +
      "with a purplish-brown complexion, short, shouts a demand; in the middle of the " +
      "frame Li Kui, his hair done up in twin hair buns, grips a single broad axe in his " +
      "right hand and clutches the torn banner cloth in his left; on the right of the " +
      "frame the apricot-yellow banner lies on the ground, pole and all, its cloth " +
      "ripped and its characters incomplete; behind Li Kui, Yan Qing looks stunned; the " +
      "fallen banner and torn cloth, the red banners, and the cloth shreds loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Li Kui holding two axes or " +
      "charging up into the hall; Song Jiang with the characters tattooed on his face; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "shuihu-anim-074": {
    coreKey:
      "Ren Yuan taking up his stance on the left of the wrestling stage (xiantai) and Yan " +
      "Qing, tattooed all over, crouching low on the right, with animated brocades, " +
      "spectators waving their arms, and incense smoke",
    groundTruth:
      "Chapter 74, \"Yan Qing Cleverly Throws the Sky-Holding Pillar; Li Kui Poses as " +
      "Magistrate at Shouzhang\". \"On the bare wrestling stage there were only three " +
      "men; by now the night dew had all dried and the morning sun was just rising\"; " +
      "\"Yan Qing crouched in a heap on the right, and Ren Yuan first took up a stance " +
      "on the left\". Grappling comes later.",
    evaluationCriteria:
      "Full credit: Only three men on the stage: on the left of the frame Ren Yuan, ten " +
      "feet tall, his hair tied up in a red topknot, takes up his stance; on the right " +
      "of the frame Yan Qing, smaller than Ren Yuan, bare-chested and tattooed all " +
      "over, crouches low; behind them on the stage the match referee (bushu) raises " +
      "his bamboo tally-stick; the brocades, the spectators waving their arms, and the " +
      "incense smoke loop smoothly, driven by SMIL or inline CSS. Deductions: The two in " +
      "contact; a loincloth or ring ropes around the stage; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-075": {
    coreKey:
      "Ruan Xiaoqi, seated at the stern, holding the unsealed imperial wine and sniffing " +
      "its fragrance without drinking, with animated ripples and rocking boat, yellow " +
      "flag and reeds, and oar blade",
    groundTruth:
      "Chapter 75, \"The Living King of Hell Scuttles the Boat and Steals the Imperial " +
      "Wine; the Black Whirlwind Tears Up the Edict and Reviles the Imperial Envoy\". " +
      "\"One of the boatmen went to the load, took out a bottle of wine, undid its " +
      "seal, and handed it to Ruan Xiaoqi\"; \"Ruan Xiaoqi took it and smelled a " +
      "fragrance that went straight up his nose\"; the dragon-and-phoenix carrying " +
      "poles have \"a yellow flag stuck in front\". Drinking four bottles in a row comes " +
      "later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, at the stern, Ruan Xiaoqi sits holding in " +
      "both hands a bottle of imperial wine with its seal undone, raising it close to " +
      "sniff the fragrance, not yet drinking; on the right of the frame, at the bow, a " +
      "small yellow flag is stuck in front of the dragon-and-phoenix carrying poles; " +
      "boatmen steady the carrying poles and row; the ripples and rocking boat, the " +
      "yellow flag and reeds, and the oar blade loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Ruan Xiaoqi tilting his head back to drink; officials on the " +
      "boat; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-076": {
    coreKey:
      "Tong Guan on the command platform south of the formation gazing in alarm at the " +
      "Nine Palaces Eight Trigrams Formation, red near, black far, and apricot-yellow " +
      "in the center, with animated banners, helmet tassels and horses' manes, and dust",
    groundTruth:
      "Chapter 76, \"Wu Jialiang Deploys the Banners of the Four Quarters and Five " +
      "Directions; Song Gongming Arrays the Nine Palaces Eight Trigrams Formation\". " +
      "\"Commissioner of Military Affairs Tong Guan, on the command platform in his " +
      "formation, looked hard at the men and horses of Liangshan Marsh\"; \"in the " +
      "center of the eight formations, all the way round, were nothing but " +
      "apricot-yellow banners\"; the red vanguard in the south faces Tong Guan directly, " +
      "the black rearguard is in the north, blue-green is in the east, and white in the " +
      "west. Chen Zhu riding out of the formation comes later.",
    evaluationCriteria:
      "Full credit: At the lower left of the frame, on the command platform, Tong Guan, " +
      "in armor and empty-handed, raises his hand to gaze into the distance, leaning " +
      "back in alarm; within the formation, red in the lower part near the platform, " +
      "black at the far end, white on the left, and blue-green on the right, the four " +
      "corners each taking the colors of the two adjacent sides, and in the very center " +
      "a ring of apricot-yellow banners; the banners, the helmet tassels and horses' " +
      "manes, and the dust loop smoothly, driven by SMIL or inline CSS. Deductions: The " +
      "center drawn in red; fighting; Tong Guan on horseback; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-077": {
    coreKey:
      "Tong Guan on horseback looking up in great fury and Song Jiang appearing on the " +
      "hilltop with the apricot-yellow banner at his side, with animated embroidered " +
      "banners, robe hems, and reeds",
    groundTruth:
      "Chapter 77, \"Liangshan Marsh Lays Ambushes on Ten Sides; Song Gongming Defeats " +
      "Tong Guan a Second Time\". \"Then on the hilltop that apricot-yellow banner " +
      "flashed into view, embroidered with the four characters 'Carry Out Justice on " +
      "Heaven's Behalf'\"; \"behind him were the strategist Wu Yong, Gongsun Sheng, Hua " +
      "Rong, Xu Ning, the gold-spear men, and the silver-spear men\". The ambush troops " +
      "charging out come later.",
    evaluationCriteria:
      "Full credit: At the lower left of the frame Tong Guan, on horseback and " +
      "empty-handed, looks up in great fury, officers on horseback to his left and " +
      "right holding spears; at the upper right of the frame, on the hilltop, where the " +
      "multicolored embroidered banners part, stands Song Jiang, with a purplish-brown " +
      "complexion, short, the apricot-yellow banner standing at his side and slightly " +
      "behind him, and behind him the chieftains stand in ranks laughing loudly; the " +
      "embroidered banners, the robe hems, and the reeds loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: The various colored banners of the ambush troops; " +
      "fighting; Song Jiang with the characters tattooed on his face; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-078": {
    coreKey:
      "Song Jiang riding out, saluting with his fist and calling out a respectful " +
      "greeting as he reasons with Wang Huan, and Wang Huan holding his long spear and " +
      "shouting, with animated banners, horses' heads, manes, and tails, and spear " +
      "tassel and reeds",
    groundTruth:
      "Chapter 78, \"The Ten Military Governors Plan to Take Liangshan Marsh; Song " +
      "Gongming Defeats Grand Marshal Gao for the First Time\". \"The vanguard Wang " +
      "Huan came out of the formation, wielding a long spear, and shouted fiercely from " +
      "horseback\"; \"where the embroidered banners of the opposing formation parted, " +
      "Song Jiang rode out in person and called out a respectful greeting to Wang " +
      "Huan\". Wang Huan leveling his spear and Lin Chong riding out to fight come " +
      "later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, where the embroidered banners part, Song " +
      "Jiang, with a purplish-brown complexion, short, on horseback, holds his fist " +
      "before his chest in salute and calls out a respectful greeting, holding no " +
      "weapon; on the right of the frame the old general Wang Huan, on horseback, holds " +
      "his long spear raised at a slant and shouts fiercely; the banners, the horses' " +
      "heads, manes, and tails, and the spear tassel and reeds loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: The two engaged; Lin Chong in the picture; Song " +
      "Jiang with the characters tattooed on his face; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-079": {
    coreKey:
      "The fire boats rowed out and slipped up beside the line of government ships and " +
      "Liu Tang raising a torch in the lead boat, the brushwood not yet burning, with " +
      "animated lotus and reeds, torch flames, and pitching boats",
    groundTruth:
      "Chapter 79, \"Liu Tang Sets Fire to the Warships; Song Jiang Defeats Grand " +
      "Marshal Gao a Second Time\". \"Small boats were all rowed out and slipped in " +
      "among the line of big ships. At the sound of the drum, they all lit their " +
      "torches together\"; Liu Tang has \"a cinnabar-red birthmark beside his temple\" " +
      "(Chapter 14). The government ships catching fire comes later.",
    evaluationCriteria:
      "Full credit: Small boats have been rowed out of the reeds and lotus on the left " +
      "of the frame and slipped up beside the line of government ships, their holds " +
      "piled with reeds and dry firewood, and the naval soldiers raise torches; the " +
      "lead boat closes on the government ships on the right of the frame, and at its " +
      "bow Liu Tang, with a cinnabar-red birthmark beside his temple and black hair, " +
      "raises a torch high; the government ships are three abreast and locked with iron " +
      "rings, and the government soldiers are in a panic; the lotus and reeds, the " +
      "torch flames, and the pitching boats loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The brushwood in the holds or the government ships on fire; the " +
      "fire boats not near the government ships; anyone falling into the water; Liu " +
      "Tang with red hair; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-080": {
    coreKey:
      "A cutaway of the sea-loach paddle-wheel ship (haiqiu): Zhang Shun underwater " +
      "gripping a chisel and swinging a bronze mallet to bore through the ship's " +
      "bottom, with animated bubbles and seeping water, small boats and reeds, and " +
      "mallet arm",
    groundTruth:
      "Chapter 80, \"Zhang Shun Bores Holes in the Sea-Loach Ships; Song Jiang Defeats " +
      "Grand Marshal Gao a Third Time\". Zhang Shun \"wore no clothes on his upper " +
      "body\", \"several iron chisels stuck at his waist and a bronze mallet in his " +
      "hand\"; \"the spoke-boards of the wheels could not be treaded round at all\"; " +
      "\"they all took mallets and chisels and bored right through the ship's bottom " +
      "from beneath it\". The hold flooding and the capture of Gao Qiu come later.",
    evaluationCriteria:
      "Full credit: In the upper half, a bamboo screen along the side of the sea-loach " +
      "ship hides the paddle wheels, the paddle blades motionless, soldiers in the " +
      "crossbow tower hold crossbows, and the men on the small boats close in with " +
      "boards held overhead; in the lower half, in the center, Zhang Shun, iron chisels " +
      "stuck at his waist, holds a chisel against the ship's bottom with one hand and " +
      "swings a bronze mallet with the other; the bubbles and seeping water, the small " +
      "boats and reeds, and the mallet arm loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The paddle wheels turning; large exposed wheels or funnels; anyone " +
      "falling into the water; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-081": {
    coreKey:
      "Yan Qing and Dai Zong at the foot of the wall each hauling on a thick rope and Le " +
      "He climbing out over the top of the wall along the rope, with animated thick " +
      "ropes, weeping willows, and river surface and empty boats",
    groundTruth:
      "Chapter 81, \"Yan Qing Meets the Taoist Sovereign on a Moonlit Night; Dai Zong " +
      "Lays a Plan to Get Le He Out\". \"The watch drum had already sounded the fourth " +
      "watch\"; inside the wall \"were all big willow trees\"; \"the two of them, " +
      "outside, twisted the ropes fast and held the rope ends tight\"; \"then Le He came " +
      "clambering out first\". Xiao Rang sliding down comes later.",
    evaluationCriteria:
      "Full credit: Outside the whitewashed wall two thick ropes stretched taut over the " +
      "top of the wall, weeping willows inside the wall; at the foot of the wall Yan " +
      "Qing on the left of the frame and Dai Zong on the right of the frame each haul " +
      "on a rope end; at the top of the wall, in the center, Le He, using hands and " +
      "feet, climbs outward along a rope; in the distance on the right of the frame two " +
      "empty boats; the thick ropes, the weeping willows, and the river surface and " +
      "empty boats loop smoothly, driven by SMIL or inline CSS. Deductions: Masks and " +
      "black nightclothes; lamps or pursuers; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-082": {
    coreKey:
      "Xiao Rang unrolling the yellow-paper edict and reading it out, Su Yuanjing seated " +
      "to the right of the tables, and Song Jiang and Lu Junyi leading the chieftains " +
      "kneeling, with animated incense smoke, colored banners, and curling edict edges",
    groundTruth:
      "Chapter 82, \"Liangshan Marsh Distributes Its Gold in a Great Market; Song " +
      "Gongming and His Whole Band Accept the Amnesty\". \"In the very center was set " +
      "the Long-Live dragon tablet\"; \"fine incense was burning in the gold censer\"; " +
      "\"Song Jiang, Lu Junyi, and the rest all knelt before the hall\"; \"when the " +
      "bows were done, Xiao Rang read out the edict\". Handing out the plaques comes " +
      "later.",
    evaluationCriteria:
      "Full credit: In the hall, three tables hung with yellow silk-gauze table skirts " +
      "embroidered with dragons and phoenixes, the Long-Live dragon tablet in the very " +
      "center, and incense burning in a gold censer; to the left of the tables Xiao " +
      "Rang unrolls the yellow-paper edict in both hands and reads it out, and to the " +
      "right of the tables Su Yuanjing sits; below the steps Song Jiang, with a " +
      "purplish-brown complexion, short, and Lu Junyi lead the chieftains kneeling; the " +
      "incense smoke, the colored banners, and the curling edict edges loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Su Yuanjing reading the edict; Song " +
      "Jiang with the characters tattooed on his face; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-083": {
    coreKey:
      "Red banners reading \"Shuntian\" (Obey Heaven) and \"Huguo\" (Protect the State) " +
      "leading the way and Song Jiang, wearing the precious saber and the bow and " +
      "arrows bestowed by the emperor, riding north in the middle, with animated " +
      "banners and pennants, light dust, and manes, tails, and spear tassel",
    groundTruth:
      "Chapter 83, \"Song Gongming Receives the Edict to Crush the Great Liao; at " +
      "Chenqiao Post Station He Sheds Tears as He Beheads a Petty Soldier\". \"Song " +
      "Jiang urged the three armies on and advanced by the highroad through Chenqiao " +
      "Post Station\"; in the Wuying Hall he was granted a gold-traced magpie-painted " +
      "bow and arrows and a precious saber; the red banners \"Shuntian\" and \"Huguo\" " +
      "appear in Chapter 82. Beheading the soldier at the post station comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame standard-bearers hold up the red banners " +
      "\"Shuntian\" and \"Huguo\" to lead the way; in the middle of the frame Song " +
      "Jiang, with a purplish-brown complexion, short, a precious saber hanging at his " +
      "waist and a gold-traced magpie-painted bow and arrows hung from his saddle; " +
      "right of center in the frame Lu Junyi holds his spear; on the right of the frame " +
      "Wu Yong and Gongsun Sheng; all four on horseback; the banners and pennants, the " +
      "light dust, and the manes, tails, and spear tassel loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: A beheading at the post station; Song Jiang with the " +
      "characters tattooed on his face or in a brocade robe; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-084": {
    coreKey:
      "Lu Junyi holding his spear and putting a question, Yelü Dezhong riding out where " +
      "the gate banners part, and four Liao generals ranged on his left and right, with " +
      "animated black eagle banner, yellow sand, and manes and tassels",
    groundTruth:
      "Chapter 84, \"Song Gongming's Troops Attack the City of Jizhou; Lu Junyi Fights a " +
      "Great Battle at Yutian County\". \"Where the gate banners parted, that Great " +
      "Prince, the emperor's younger brother, rode out in person, his four sons ranged " +
      "on his left and right\"; Lu Junyi asks, \"With the two armies facing the enemy, " +
      "which hero will be first to ride out and fight?\" Guan Sheng riding out to " +
      "fight comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Lu Junyi, on horseback, holds his spear " +
      "pointing up at a slant, turning back to put a question to the generals on his " +
      "own side; on the right of the frame, where the gate banners part, Yelü Dezhong, " +
      "in an iron helmet with a black pompom tassel, willow-leaf armor, and a robe " +
      "embroidered with coiled dragons, rides out holding a broom saber (saozhou dao), " +
      "with two Liao generals on each side of him; the black eagle banner, the yellow " +
      "sand, and the manes and tassels loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The two sides engaged; the Liao figures caricatured; " +
      "pheasant-feather plumes (lingzi) or fox tails; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
};
