/**
 * 《水浒传》第 97–108 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch097-108.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH097_108_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-097": "Ch. 97 · A Woodcutter's Song Awakens Qiao Daoqing",
  "shuihu-098": "Ch. 98 · Qiongying Turns Round to Take Aim at Quan Yu",
  "shuihu-099": "Ch. 99 · Zhishen Meets a Monk in a Thatched Hermitage",
  "shuihu-100": "Ch. 100 · Qiongying Calls for the Gate at Weisheng",
  "shuihu-101": "Ch. 101 · Wang Qing Leans on a Willow in Yujin Garden",
  "shuihu-102": "Ch. 102 · Wang Qing Teaches Boxing in a Cangue",
  "shuihu-103": "Ch. 103 · Fan Quan Treats a Face in a Thatched Cottage",
  "shuihu-104": "Ch. 104 · Facing Third Sister Duan in the Wheat Field",
  "shuihu-105": "Ch. 105 · Qiao Daoqing Turns the Wind Back and Returns the Fire",
  "shuihu-106": "Ch. 106 · A Scholar Laughs and Talks on the Gate Tower",
  "shuihu-107": "Ch. 107 · Zhu Wu Changes the Formation from the Command Platform",
  "shuihu-108": "Ch. 108 · Chai Jin Hides Fire Bombs in the Firewood Carts",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH097_108_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-097": {
    coreKey:
      "Atop the cliff of Baigu Ridge at daybreak: Qiao Daoqing stands at the cliff edge, " +
      "turned sideways to listen to the song, and an old woodcutter, a hatchet tucked in " +
      "his belt and leaning on a carrying pole, comes up onto the cliff singing a " +
      "woodcutter's song",
    groundTruth:
      "Chapter 97, \"Chen Guan, a Remonstrance Official, Is Promoted to Pacification " +
      "Commissioner; Qiongying, a Maiden, Becomes the Vanguard\". Qiao Daoqing climbs the " +
      "cliff and sees the Song troops entering the city; the old woodcutter \"had a " +
      "hatchet tucked in his belt and used his carrying pole as a walking stick\", and " +
      "\"came up onto the cliff step by step, picking his footing\"; \"when Qiao Daoqing " +
      "heard these six lines of the woodcutter's song, something seemed to dawn on him\". " +
      "The old woodcutter answering him and leaving comes later.",
    evaluationCriteria:
      "Full credit: The high cliff of Baigu Ridge at daybreak in early spring, and in the " +
      "distance on the right of the frame the city of Zhaode with flags of surrender " +
      "raised; in the middle of the frame Qiao Daoqing, in a purple-gold fishtail Taoist " +
      "crown and a black-edged crane-feather cloak, his brows parted like the character " +
      "ba (eight), with a full beard and ordinary black eyes, stands at the cliff edge, " +
      "turned sideways toward the old woodcutter to listen to the song, both hands " +
      "hanging empty; on the left of the frame the old woodcutter, a hatchet tucked in " +
      "his belt, leans on his carrying pole as he comes up onto the cliff, singing with " +
      "his mouth open (a compositional convention; the left and right of the original " +
      "text are not tested). Deductions: Qiao Daoqing drawing his sword to work magic; " +
      "the old woodcutter carrying a load of firewood or drawn as an immortal.",
  },
  "shuihu-098": {
    coreKey:
      "Before the drill hall on the drill ground at Xiangyuan: Qiongying wheels her horse " +
      "round and twists back, her right hand pinching a stone as she takes aim at the " +
      "space under Quan Yu's ribs, and Quan Yu pursues closely with his spear leveled, " +
      "the stone not yet thrown",
    groundTruth:
      "Chapter 98, \"Zhang Qing Is Wed to Qiongying by Destiny; Wu Yong Schemes to Poison " +
      "Wu Li\". \"Qiongying suddenly wheeled her horse round and made off toward the " +
      "drill hall, and Quan Yu seized the moment to come after her\"; \"Qiongying took a " +
      "stone between her fingers, turned round, and took aim at the open space under " +
      "Quan Yu's ribs\". Qiongying has \"a gold hairpin set with a phoenix\" and \"armor " +
      "clad in silver\". Quan Yu catching the stone, and two stones striking each other " +
      "in the air, come later.",
    evaluationCriteria:
      "Full credit: The drill ground on a clear day, the drill hall at the right rear of " +
      "the frame; on the right of the frame Qiongying, a gold phoenix hairpin in her " +
      "black hair, wearing no helmet, in silver armor and a red embroidered robe, rides a " +
      "dark silver-maned horse toward the drill hall, her left hand holding the halberd " +
      "and the reins, twisting round to look back, her right hand pinching a round stone " +
      "as she takes aim at the space under Quan Yu's ribs; on the left of the frame Quan " +
      "Yu, in a green robe, on a white horse, pursues closely with his spear leveled (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: The stone already thrown, Quan Yu catching the stone, or two " +
      "stones striking each other; Qiongying wearing a phoenix coronet and rosy-cloud " +
      "cape (xiapei) or with back flags (kaoqi).",
  },
  "shuihu-099": {
    coreKey:
      "A thatched hermitage in a strange land below the pit: Lu Zhishen has just stepped " +
      "in at the door and stands still to look, and a monk just like him sits " +
      "cross-legged on the ground, striking a wooden fish (temple block) and chanting " +
      "sutras",
    groundTruth:
      "Chapter 99, \"The Tattooed Monk Is Released from the Well of Entangling Karma; the " +
      "River-Churning Dragon Floods the City of Taiyuan\". After falling into the pit, " +
      "Zhishen crosses open country, and \"there he saw a thatched hermitage, and heard " +
      "a wooden fish in it going tock, tock\"; \"when I went in to look\", there was \"a " +
      "monk just like me (sajia), sitting cross-legged on the ground chanting sutras\". " +
      "Asking the way and leaving the hermitage come later.",
    evaluationCriteria:
      "Full credit: The interior of a thatch-roofed hermitage, with green grassy open " +
      "country and a pale moon seen beyond the doorway on the left of the frame; on the " +
      "right of the frame a shaven-headed monk sits cross-legged on a rush cushion " +
      "chanting sutras, a wooden fish before his knees and a wooden mallet in his hand; " +
      "on the left of the frame Lu Zhishen, having just stepped in at the door, stands " +
      "still and looks on, shaven-headed, with a round face and large ears, his monk's " +
      "staff held at a slant with its head pointing up (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: A well mouth or " +
      "windlass drawn; a Buddha halo over the monk's head; Lu Zhishen drunk or " +
      "bare-backed.",
  },
  "shuihu-100": {
    coreKey:
      "The south wall of Weisheng at dusk under a new moon: Qiongying, at the head on " +
      "horseback, calls loudly for the gate to be opened, a false king sits on a white " +
      "horse under an ochre-yellow parasol, and Tian Bao and Tian Biao look down from the " +
      "gate tower",
    groundTruth:
      "Chapter 100, \"Zhang Qing and Qiongying Both Win Merit; Chen Guan and Song Jiang " +
      "Jointly Report the Victory\". \"The evening glow gathered in its colors, and the " +
      "new moon hung like a hook\"; Tian Bao and Tian Biao go up onto the gate tower to " +
      "look, \"and sure enough, under the ochre-yellow parasol, on that white horse with " +
      "the silver mane and carved saddle, sat the king\", in fact a soldier of the " +
      "southern army in disguise; the banner is inscribed in large characters \"Junzhu " +
      "Qiongying\" (Princess Qiongying). Opening the gate and seizing them come later.",
    evaluationCriteria:
      "Full credit: Lingering evening glow at dusk, a thin crescent moon low in the sky; " +
      "on the right of the frame the gate of the south wall of Weisheng is tightly shut, " +
      "and Tian Bao and Tian Biao look down from behind the battlements; in the middle of " +
      "the frame Qiongying, young and beautiful, on horseback, holds her painted halberd " +
      "upright and calls loudly for the gate to be opened; on the left of the frame, " +
      "under the ochre-yellow parasol, a soldier disguised as the king sits on a white " +
      "horse, with a large banner reading \"Junzhu Qiongying\" standing beside him (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: The gate already open or anyone seized; a full moon; " +
      "Qiongying wearing a phoenix coronet and rosy-cloud cape or with back flags.",
  },
  "shuihu-101": {
    coreKey:
      "Yujin Garden in mid-spring: Wang Qing, alone, leans his shoulder slantwise against " +
      "a weeping willow beside the pond, waiting for an acquaintance, sightseers swarm " +
      "like ants, and no sedan chair has yet appeared",
    groundTruth:
      "Chapter 101, \"Scheming for a Grave Site, Sinister Cunning Breeds a Rebel; " +
      "Treading the Spring Sunshine, Bewitching Beauty Breeds Adultery\". \"It was " +
      "mid-spring weather; the sightseers swarmed like ants, and soldiers and horses were " +
      "as many as clouds\"; Wang Qing \"leaned his shoulder slantwise against a weeping " +
      "willow beside the pond in the garden\", and he had \"phoenix eyes and thick brows " +
      "as if painted, a light beard, a fair face and rosy cheeks\". Jiaoxiu arriving in a " +
      "sedan chair comes later.",
    evaluationCriteria:
      "Full credit: A clear mid-spring day, apricot blossoms in full bloom, a pond in the " +
      "middle of the frame; on the left of the frame, under a weeping willow by the " +
      "pond, Wang Qing, alone, leans his shoulder slantwise against the trunk and gazes " +
      "idly about, with phoenix eyes and thick brows, a light beard, a fair face and rosy " +
      "cheeks, and a strong, sturdy build, no weapon in his hands, without the characters " +
      "tattooed on his face, and wearing no cangue; in the distance on the right of the " +
      "frame sightseers swarm like ants, some on horseback (a compositional convention; " +
      "the left and right of the original text are not tested). Deductions: A sedan " +
      "chair or aides (yuhou) in the picture; Wang Qing with the characters tattooed on " +
      "his face or wearing a cangue; the ornamental rocks of Genyue in the picture.",
  },
  "shuihu-102": {
    coreKey:
      "The threshing floor at Gong Family Village in the early morning: Wang Qing, " +
      "wearing a cangue, stands in the willow shade giving pointers, and Gong Duan and " +
      "Gong Zheng follow his lead, punching and kicking",
    groundTruth:
      "Chapter 102, \"Wang Qing Faces a Lawsuit over Adultery; Gong Duan, Having Been " +
      "Beaten, Takes a Convict Soldier as His Teacher\". Wang Qing has had his cheek " +
      "tattooed and has been nailed into \"a round-head iron-banded cangue weighing ten " +
      "and a half jin\"; \"Wang Qing, taking advantage of the cool of the early morning, " +
      "was coaching Gong Duan in punches and kicks on the threshing floor\"; Chapter 103, " +
      "looking back, says \"on the threshing floor in the shade of the willows\". Huang " +
      "Da bursting in comes later.",
    evaluationCriteria:
      "Full credit: The threshing floor of the manor in the early morning, big willows by " +
      "the earthen wall; on the left of the frame, in the willow shade at the edge of the " +
      "floor, Wang Qing, wearing a round-head iron-banded cangue around his neck, with " +
      "phoenix eyes and thick brows, a light beard and a fair face, a small patch of " +
      "illegible tattooed characters on one cheek, stands still and gives pointers with " +
      "his mouth open; on the right of the frame Gong Duan, nearer, throws a punch, and " +
      "Gong Zheng, a little farther off, kicks (a compositional convention; the left and " +
      "right of the original text are not tested); all three properly dressed. " +
      "Deductions: Holding cudgels or a cudgel bout; Huang Da in the picture; anyone " +
      "bare-chested; Wang Qing without his cangue.",
  },
  "shuihu-103": {
    coreKey:
      "A thatched cottage at Dingshan Fort: Fan Quan holds up Wang Qing's chin and, with " +
      "a bamboo spatula dipped in fine powder, rubs it onto the faint red scar where the " +
      "tattooed characters were removed from his cheek",
    groundTruth:
      "Chapter 103, \"Camp Warden (guanying) Zhang Loses His Life Because of His " +
      "Concubine's Brother; Jailer (jieji) Fan Treats His Cousin's Face\". Fan Quan, " +
      "\"thinking the tattooed characters (jinyin) on Wang Qing's face unsafe\", " +
      "dabbed them off with a caustic drug, \"and afterward treated it with good " +
      "medicine, and a red scar formed\"; \"then he applied fine powder of gold and " +
      "jade to it, and after more than two months the scar too wore away.\" The scar " +
      "fading completely comes later.",
    evaluationCriteria:
      "Full credit: Inside the thatched cottage in winter, withered grass and no snow " +
      "outside the window; on the left of the frame Wang Qing sits sideways, with phoenix " +
      "eyes and thick brows, a light beard and a fair face, only a faint red scar left on " +
      "his cheek, no characters to be seen; on the right of the frame Fan Quan sits " +
      "facing him, one hand holding up Wang Qing's chin and the other holding a bamboo " +
      "spatula dipped in fine powder to rub it on; on the table a small dish holds fine " +
      "pale gold-white powder (the positions and hand gestures are a compositional " +
      "convention; the original text is not tested). Deductions: Characters still left " +
      "on Wang Qing's face; Wang Qing wearing a cangue; a knife or blood in the picture.",
  },
  "shuihu-104": {
    coreKey:
      "The wheat field east of Dingshan Fort: Third Sister Duan, her outer jacket off, " +
      "steps forward with her fist raised, and Wang Qing raises both fists and takes up " +
      "a guard stance, the two not yet exchanging blows",
    groundTruth:
      "Chapter 104, \"Duan Family Manor Takes a New Son-in-Law Once More; Fangshan " +
      "Stronghold Joins Two Forces with the Old Outlaws\". The opera stage stands in the " +
      "wheat field east of the fort, where \"of the green, green wheat field, more than " +
      "ten mu had been trampled bare\"; Third Sister takes off her outer jacket and " +
      "\"tosses it onto a table\", wearing underneath \"a parrot-green short jacket\" " +
      "and \"wide-crotched purple lined silk trousers\"; Wang Qing \"likewise raised both " +
      "fists and opened a guard stance\". Exchanging blows comes later.",
    evaluationCriteria:
      "Full credit: Mid-spring, the wheat shoots before the opera stage trampled bare to " +
      "expose the yellow earth, green wheat on the ridged fields in the distance, and " +
      "the opera stage behind with no one on it; on the right of the frame Third Sister " +
      "Duan, with broad, coarse brows and eyes and a solid build, hairpins and hair " +
      "ornaments in her hair, in a tight parrot-green short jacket with narrow sleeves " +
      "and wide-crotched purple lined silk trousers, her outer jacket tossed onto an " +
      "empty table beside her, steps forward with her right fist raised; on the left of " +
      "the frame Wang Qing, with phoenix eyes and thick brows and smooth, clear cheeks, " +
      "empty-handed, raises both fists and takes up a guard stance (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "Anyone knocked down; Wang Qing holding a knife or wearing a cangue; Third Sister's " +
      "clothes in disarray; the place where they fight drawn as an unbroken stretch of " +
      "green wheat; the crowd of onlookers pressing in front of the two and blocking " +
      "them.",
  },
  "shuihu-105": {
    coreKey:
      "Fangcheng Mountain at the third watch: the south wind turns to the north, Qiao " +
      "Daoqing, sword in hand, forms a hand seal to turn the wind back and return the " +
      "fire, and the fire arrows and torches turn back and fly toward the bandit " +
      "formation below the mountain",
    groundTruth:
      "Chapter 105, \"Song Gongming Escapes the Summer Heat to Heal His Troops; Qiao " +
      "Daoqing Turns the Wind Back to Burn the Bandits\". The wind suddenly turns to the " +
      "north, \"and again a crash like a thunderclap was heard on the mountain\"; " +
      "\"those fire arrows and torches all came flying into the bandit formation to the " +
      "south\", \"like tens of thousands of golden snakes and fire dragons\". The bandit " +
      "soldiers being burned and the ambush troops charging out come later.",
    evaluationCriteria:
      "Full credit: The valley at the third watch, thick with mist, no moon to be seen; " +
      "at the top of the frame, before the hillside shed on the high ridge, Qiao Daoqing, " +
      "in a black-edged crane-feather cloak, his brows parted like the character ba " +
      "(eight), with a full beard and ordinary black eyes, points an ancient sword toward " +
      "the bottom of the frame with one hand and forms a hand seal with the other; the " +
      "fire arrows and torches, like golden snakes and fire dragons, turn back in the air " +
      "above the slope and fly toward the bottom of the frame; below, the bandit army " +
      "appears only as small dark silhouettes, the flames on their carts pressed toward " +
      "the bottom of the frame (north at the top and south at the bottom is a " +
      "compositional convention). Deductions: Anyone burned, or casualties; the Song " +
      "army's woods on fire; the stream of fire flying up the mountain.",
  },
  "shuihu-106": {
    coreKey:
      "The west gate tower of Wanzhou: three officials and a scholar sit around a table " +
      "laughing, talking, and drinking heartily, the city gate stands wide open with no " +
      "flags on the walls, and below the wall the bandit generals rein in and hesitate",
    groundTruth:
      "Chapter 106, \"A Scholar Repels a Strong Enemy with Laughter and Talk; the Marines " +
      "Submerge to Break a Strong City\". \"Chen Guan, Hou Meng, and Luo Jian at once " +
      "went up onto the gate tower, laughing, talking, and drinking heartily\"; the " +
      "bandit generals \"saw the city gate wide open, and three officials and a scholar " +
      "on the gate tower amid heaped flowers and clustered brocade\", and on the walls " +
      "\"not even the shadow of a single flag or pennant was to be seen\". The signal " +
      "blast and the ambush troops come later.",
    evaluationCriteria:
      "Full credit: The west gate tower of Wanzhou on a clear day, the gateway wide " +
      "open, no flags on the gate tower or the battlements; on the gate tower, beside " +
      "the wine table, from left to right of the frame are Chen Guan, Hou Meng, Luo " +
      "Jian, and the scholar Xiao Rang, laughing and talking around the table, Hou Meng " +
      "raising his wine cup and Xiao Rang holding his (the seating order is a " +
      "compositional convention, and the left and right of the original text are not " +
      "tested; that the scholar is Xiao Rang is an inference); at the lower right of the " +
      "frame, outside the city, Ji Sansi and Ni She rein in and hesitate, their horses' " +
      "heads toward the city gate. Deductions: A zither (qin), a page boy, or a feather " +
      "fan in the picture; flags on the walls; Xiao Rang taking up a brush to write.",
  },
  "shuihu-107": {
    coreKey:
      "South of Yique Mountain: on the Song army's command platform Zhu Wu, a signal flag " +
      "in each hand, beckons with the left and spreads with the right to shift into the " +
      "Eight-Array Diagram, and opposite him the bandit formation is square outside and " +
      "round inside",
    groundTruth:
      "Chapter 107, \"Song Jiang Wins a Great Victory over the Jishan Army; Zhu Wu Breaks " +
      "the Six-Petal Formation\". \"Lu Junyi entered the formation, and Zhu Wu, on the " +
      "command platform, beckoned with the signal flags to the left and spread them to " +
      "the right, changing into the method of the Eight-Array Diagram\"; the bandit " +
      "formation is \"square outside and round inside, a large formation enclosing small " +
      "ones\"; Zhu Wu has \"ruddy cheeks and handsome eyes, a fair face with a thin beard " +
      "hanging down\" (Chapter 2). Charging the formation comes later.",
    evaluationCriteria:
      "Full credit: Level ground south of Yique Mountain on a clear day; in the " +
      "foreground on the left of the frame, on the Song army's command platform, Zhu Wu, " +
      "with a fair face and rosy cheeks and a thin beard hanging to his chest, in a cloud " +
      "crown and Taoist robe, holds a signal flag in each hand, beckoning high with the " +
      "left hand and spreading the right hand outward; in the middle of the frame the " +
      "Song ranks shift formation as the flags direct; in the distance on the right of " +
      "the frame the bandit formation is square outside and round inside, a large " +
      "formation enclosing small ones, with blue-green and red flags (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "Already engaged; eight-trigram diagrams, yin-yang (taiji) diagrams, or a " +
      "six-petaled flower-shaped formation; Zhu Wu holding a feather fan or twin sabers.",
  },
  "shuihu-108": {
    coreKey:
      "A village at the southern foot of Longmen Mountain at dusk: Chai Jin directs the " +
      "soldiers to set the firewood carts by the eaves of the thatched cottages and hide " +
      "fire bombs under the firewood",
    groundTruth:
      "Chapter 108, \"Qiao Daoqing Raises a Fog to Take a City; the Little Whirlwind " +
      "Hides Fire Bombs to Strike the Bandits\". \"That evening a northeast wind rose " +
      "fiercely, and dense clouds spread like splashed ink\"; Chai Jin \"left behind a " +
      "hundred-odd firewood carts, scattered and lined up beside the thatched eaves of " +
      "the cottages downwind to the southwest\", and \"hid fire bombs everywhere, and " +
      "laid out dry firewood soaked with sulfur and saltpeter\". The fire attack comes " +
      "later.",
    evaluationCriteria:
      "Full credit: Dusk in late autumn, a fierce northeast wind, clouds as dark as ink, " +
      "no rain yet; at the lower left of the frame firewood carts stand in a row by the " +
      "eaves of the thatched cottages, and soldiers stuff fire bombs with exposed fuses " +
      "under the bundles of firewood and the grain sacks; on the right of the frame Chai " +
      "Jin, with dragon brows and phoenix eyes and a three-tufted mustache covering his " +
      "mouth, no weapon in his hands, points with one hand toward the thatched cottages " +
      "at the lower left (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Fire, an explosion, or torches; bandit " +
      "soldiers in the picture; the fire bombs drawn as bronze or iron tube cannon.",
  },
  "shuihu-anim-097": {
    coreKey:
      "Qiao Daoqing standing at the cliff edge, turned sideways to listen to the song, " +
      "and the old woodcutter coming up onto the cliff leaning on his carrying pole and " +
      "singing, with animated pine branches, crane-feather cloak, and beard, hair, and " +
      "jacket corners",
    groundTruth:
      "Chapter 97, \"Chen Guan, a Remonstrance Official, Is Promoted to Pacification " +
      "Commissioner; Qiongying, a Maiden, Becomes the Vanguard\". The old woodcutter " +
      "\"had a hatchet tucked in his belt and used his carrying pole as a walking " +
      "stick\", and \"came up onto the cliff step by step, picking his footing\", " +
      "singing six lines of a woodcutter's song; when Qiao Daoqing heard it, " +
      "\"something seemed to dawn on him\". The old woodcutter answering him and leaving " +
      "comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Qiao Daoqing, in a purple-gold fishtail " +
      "Taoist crown and a black-edged crane-feather cloak, stands at the cliff edge, " +
      "turned sideways toward the old woodcutter to listen to the song, and on the left " +
      "of the frame the old woodcutter, a hatchet tucked in his belt, leans on his " +
      "carrying pole as he comes up onto the cliff, singing with his mouth open (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the pine branches, the crane-feather cloak, and the beard, hair, and " +
      "jacket corners loop smoothly, driven by SMIL or inline CSS. Deductions: Qiao " +
      "Daoqing drawing his sword; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-098": {
    coreKey:
      "Qiongying wheeling her horse round and twisting back, pinching a stone as she " +
      "takes aim at Quan Yu, and Quan Yu pursuing closely with his spear leveled, with " +
      "animated flags, purple sash, robe hem, and manes, and fine dust under the hooves",
    groundTruth:
      "Chapter 98, \"Zhang Qing Is Wed to Qiongying by Destiny; Wu Yong Schemes to Poison " +
      "Wu Li\". \"Qiongying suddenly wheeled her horse round and made off toward the " +
      "drill hall, and Quan Yu seized the moment to come after her\"; \"Qiongying took a " +
      "stone between her fingers, turned round, and took aim at the open space under " +
      "Quan Yu's ribs\"; she rides a \"silver-maned horse\", and \"the purple " +
      "double-lozenge sash fluttered\". Quan Yu catching the stone comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Qiongying, with a gold phoenix hairpin, in " +
      "silver armor and a red embroidered robe, rides a dark silver-maned horse toward " +
      "the drill hall, twisting round to look back, her right hand pinching a round " +
      "stone and her left hand holding the halberd and the reins; on the left of the " +
      "frame Quan Yu, in a green robe, on a white horse, pursues closely with his spear " +
      "leveled (a compositional convention; the left and right of the original text are " +
      "not tested); the flags, the robe hem and manes, and the fine dust loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The stone already thrown; the figures " +
      "or the horses drifting as a whole; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "shuihu-anim-099": {
    coreKey:
      "Lu Zhishen, having just stepped into the thatched hermitage, standing still to " +
      "look, and the monk sitting cross-legged chanting sutras and striking the wooden " +
      "fish, with animated wooden mallet, blades of grass, and thin clouds drifting " +
      "across the moon",
    groundTruth:
      "Chapter 99, \"The Tattooed Monk Is Released from the Well of Entangling Karma; the " +
      "River-Churning Dragon Floods the City of Taiyuan\". \"There he saw a thatched " +
      "hermitage, and heard a wooden fish in it going tock, tock\"; \"when I (sajia) went " +
      "in to look\", there was \"a monk just like me, sitting cross-legged on the ground " +
      "chanting sutras\". \"The well of entangling karma\" is the monk's metaphor; " +
      "asking the way and leaving the hermitage come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame a shaven-headed monk sits cross-legged on " +
      "a rush cushion chanting sutras, a wooden fish before his knees and a wooden " +
      "mallet in his hand; on the left of the frame Lu Zhishen, having just stepped in " +
      "at the door, stands still and looks on, shaven-headed, with a round face and " +
      "large ears (a compositional convention; the left and right of the original text " +
      "are not tested); the wooden mallet, the blades of grass, and the thin clouds loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: A well mouth drawn; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-100": {
    coreKey:
      "Qiongying calling for the gate below the wall and a false king sitting on a white " +
      "horse under the ochre-yellow parasol, with animated flags, tassels and manes, and " +
      "bands of evening cloud",
    groundTruth:
      "Chapter 100, \"Zhang Qing and Qiongying Both Win Merit; Chen Guan and Song Jiang " +
      "Jointly Report the Victory\". \"The evening glow gathered in its colors, and the " +
      "new moon hung like a hook\"; Tian Bao and Tian Biao go up onto the gate tower to " +
      "look, \"and sure enough, under the ochre-yellow parasol, on that white horse with " +
      "the silver mane and carved saddle, sat the king\", in fact a soldier of the " +
      "southern army in disguise. Opening the gate and seizing them come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the gate of the south wall is tightly " +
      "shut, and Tian Bao and Tian Biao look down from the wall; in the middle of the " +
      "frame Qiongying, on horseback, holds her painted halberd upright and calls loudly " +
      "for the gate to be opened; on the left of the frame, under the ochre-yellow " +
      "parasol, a soldier disguised as the king sits on a white horse (a compositional " +
      "convention; the left and right of the original text are not tested); the flags, " +
      "the tassels and manes, and the evening glow loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: The gate already open; the figures or the horses drifting " +
      "as a whole; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-101": {
    coreKey:
      "Wang Qing, alone, leaning his shoulder slantwise against a weeping willow beside " +
      "the pond and gazing idly about, and sightseers swarming like ants, with animated " +
      "weeping willow, pond ripples and reflections, and falling apricot blossoms",
    groundTruth:
      "Chapter 101, \"Scheming for a Grave Site, Sinister Cunning Breeds a Rebel; " +
      "Treading the Spring Sunshine, Bewitching Beauty Breeds Adultery\". \"It was " +
      "mid-spring weather; the sightseers swarmed like ants, and soldiers and horses were " +
      "as many as clouds\"; Wang Qing \"leaned his shoulder slantwise against a weeping " +
      "willow beside the pond in the garden\", meaning to wait for an acquaintance to go " +
      "drinking with him. Jiaoxiu arriving in a sedan chair comes later.",
    evaluationCriteria:
      "Full credit: A pond in the middle of the frame, on the left of the frame, under a " +
      "weeping willow by the pond, Wang Qing, alone, leaning his shoulder slantwise " +
      "against the trunk and gazing idly about, with phoenix eyes and thick brows, a " +
      "fair face and rosy cheeks, without the characters tattooed on his face, and " +
      "wearing no cangue, and in the distance on the right of the frame sightseers " +
      "swarming like ants (a compositional convention; the left and right of the " +
      "original text are not tested); the weeping willow, the pond ripples and " +
      "reflections, and the apricot blossoms loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: A sedan chair in the picture; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-102": {
    coreKey:
      "Wang Qing, wearing a cangue, standing in the willow shade giving pointers, and " +
      "Gong Duan and Gong Zheng punching and kicking, with animated willow branches, " +
      "fists and legs, and fine dust",
    groundTruth:
      "Chapter 102, \"Wang Qing Faces a Lawsuit over Adultery; Gong Duan, Having Been " +
      "Beaten, Takes a Convict Soldier as His Teacher\". Wang Qing has had his cheek " +
      "tattooed and has been nailed into \"a round-head iron-banded cangue weighing ten " +
      "and a half jin\"; \"Wang Qing, taking advantage of the cool of the early morning, " +
      "was coaching Gong Duan in punches and kicks on the threshing floor\"; \"outside " +
      "the manor the new cicadas shrilled in the willows\". Huang Da bursting in comes " +
      "later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, in the willow shade at the edge of the " +
      "threshing floor, Wang Qing, wearing a round-head iron-banded cangue around his " +
      "neck, a small patch of illegible tattooed characters on his cheek, stands still " +
      "and gives pointers with his mouth open; on the right of the frame Gong Duan, " +
      "nearer, throws a punch, and Gong Zheng, a little farther off, kicks (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the willow branches, the fists and legs, and the fine dust loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Anyone bare-chested; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-103": {
    coreKey:
      "Fan Quan holding up Wang Qing's chin and rubbing the faint red scar with a bamboo " +
      "spatula, with animated floating dust, brazier glow and thin smoke, and rubbing " +
      "gesture",
    groundTruth:
      "Chapter 103, \"Camp Warden (guanying) Zhang Loses His Life Because of His " +
      "Concubine's Brother; Jailer (jieji) Fan Treats His Cousin's Face\". The tattooed " +
      "characters have already been dabbed off with a caustic drug; \"afterward he " +
      "treated it with good medicine, and a red scar formed\"; \"then he applied fine " +
      "powder of gold and jade to it, and after more than two months the scar too wore " +
      "away.\" The jinyin of the original means characters tattooed on the face. The scar " +
      "fading completely comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Wang Qing sits sideways, only a faint red " +
      "scar left on his cheek, no characters to be seen; on the right of the frame Fan " +
      "Quan sits facing him, one hand holding up Wang Qing's chin and the other holding " +
      "a bamboo spatula dipped in fine powder to rub it on (a compositional convention; " +
      "the left and right of the original text are not tested); the floating dust, the " +
      "charcoal glow and thin smoke, and the rubbing loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Characters still left; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-104": {
    coreKey:
      "Third Sister Duan stepping forward with her fist raised and Wang Qing raising " +
      "both fists and taking up a guard stance, not yet exchanging blows, with animated " +
      "green wheat, cloth curtains, and hair ornaments and clothing corners",
    groundTruth:
      "Chapter 104, \"Duan Family Manor Takes a New Son-in-Law Once More; Fangshan " +
      "Stronghold Joins Two Forces with the Old Outlaws\". The opera stage stands in the " +
      "wheat field east of the fort, where \"of the green, green wheat field, more than " +
      "ten mu had been trampled bare\"; Third Sister takes off her outer jacket and " +
      "\"tosses it onto a table\", wearing underneath \"a parrot-green short jacket\" " +
      "and \"wide-crotched purple lined silk trousers\"; Wang Qing \"likewise raised both " +
      "fists and opened a guard stance\". Exchanging blows comes later.",
    evaluationCriteria:
      "Full credit: The wheat field trampled into yellow earth; on the right of the " +
      "frame Third Sister Duan, with a solid build, hairpins and hair ornaments in her " +
      "hair, in a tight parrot-green short jacket with narrow sleeves and purple lined " +
      "silk trousers, steps forward with her right fist raised; on the left of the frame " +
      "Wang Qing raises both fists and takes up a guard stance (a compositional " +
      "convention; the left and right of the original text are not tested); the distant " +
      "green wheat, the cloth curtains, and the hair ornaments and clothing corners loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Anyone knocked down; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-105": {
    coreKey:
      "Qiao Daoqing, sword in hand, forming a hand seal to turn the wind back and return " +
      "the fire, and the fire arrows and torches turning back and flying down the " +
      "mountain, with animated flames, tree branches, and loose hair and waist cord",
    groundTruth:
      "Chapter 105, \"Song Gongming Escapes the Summer Heat to Heal His Troops; Qiao " +
      "Daoqing Turns the Wind Back to Burn the Bandits\". The wind suddenly turns to the " +
      "north, \"and again a crash like a thunderclap was heard on the mountain\"; " +
      "\"those fire arrows and torches all came flying into the bandit formation to the " +
      "south\"; Qiao Daoqing \"worked the magic of turning the wind back and returning " +
      "the fire\". The bandit soldiers being burned comes later.",
    evaluationCriteria:
      "Full credit: At the top of the frame, before the hillside shed on the high ridge, " +
      "Qiao Daoqing, in a black-edged crane-feather cloak, with ordinary black eyes, " +
      "points a sword toward the bottom of the frame with one hand and forms a hand seal " +
      "with the other; the fire arrows and torches turn back from the slope and fly " +
      "toward the bottom of the frame, frozen in midair (north at the top and south at " +
      "the bottom is a compositional convention); the flames, the tree branches, and the " +
      "loose hair and waist cord loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Anyone burned; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-106": {
    coreKey:
      "Three officials and a scholar laughing and talking around a table on the gate " +
      "tower, the city gate wide open with no flags, and the bandit generals reining in " +
      "and hesitating, with animated manes, wine vapor, and sleeves",
    groundTruth:
      "Chapter 106, \"A Scholar Repels a Strong Enemy with Laughter and Talk; the Marines " +
      "Submerge to Break a Strong City\". \"Chen Guan, Hou Meng, and Luo Jian at once " +
      "went up onto the gate tower, laughing, talking, and drinking heartily\"; the " +
      "bandit generals \"saw the city gate wide open, and three officials and a scholar " +
      "on the gate tower amid heaped flowers and clustered brocade\", and, puzzled and " +
      "suspicious, dared not advance. The signal blast and the ambush troops come later.",
    evaluationCriteria:
      "Full credit: The city gate wide open, no flags on the gate tower or the " +
      "battlements; on the gate tower, from left to right of the frame, Chen Guan, Hou " +
      "Meng, Luo Jian, and the scholar Xiao Rang laugh and talk around the table, Hou " +
      "Meng raising his wine cup and Xiao Rang holding his, and outside the city Ji " +
      "Sansi and Ni She rein in and hesitate (a compositional convention; the left and " +
      "right of the original text are not tested); the manes, the wine vapor, and the " +
      "sleeves loop smoothly, driven by SMIL or inline CSS. Deductions: A zither or a " +
      "feather fan in the picture; the figures or the horses drifting as a whole; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-107": {
    coreKey:
      "Zhu Wu on the Song army's command platform beckoning with the signal flag in his " +
      "left hand and spreading the one in his right, and the bandit formation opposite " +
      "square outside and round inside, with animated signal flags, banners, and sleeves " +
      "and thin beard",
    groundTruth:
      "Chapter 107, \"Song Jiang Wins a Great Victory over the Jishan Army; Zhu Wu Breaks " +
      "the Six-Petal Formation\". \"Lu Junyi entered the formation, and Zhu Wu, on the " +
      "command platform, beckoned with the signal flags to the left and spread them to " +
      "the right, changing into the method of the Eight-Array Diagram\"; the bandit " +
      "formation is \"square outside and round inside, a large formation enclosing small " +
      "ones\", with the blue-green and red armies divided to left and right. Yang Zhi " +
      "and the others charging the formation comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, on the Song army's command platform, Zhu " +
      "Wu, with a fair face and rosy cheeks and a thin beard hanging to his chest, in a " +
      "cloud crown and Taoist robe, holds a signal flag in each hand, beckoning high with " +
      "the left hand and spreading the right hand outward; in the distance on the right " +
      "of the frame the bandit formation is square outside and round inside (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the signal flags, the banners, and the sleeves and thin beard loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: A six-petaled flower-shaped " +
      "formation; whole figures drifting; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "shuihu-anim-108": {
    coreKey:
      "Chai Jin directing the soldiers to hide fire bombs in the firewood carts by the " +
      "eaves of the thatched cottages, with animated dense clouds and bits of thatch, " +
      "robe hem and headscarf ties, and firewood tips",
    groundTruth:
      "Chapter 108, \"Qiao Daoqing Raises a Fog to Take a City; the Little Whirlwind " +
      "Hides Fire Bombs to Strike the Bandits\". \"That evening a northeast wind rose " +
      "fiercely, and dense clouds spread like splashed ink\"; Chai Jin \"left behind a " +
      "hundred-odd firewood carts, scattered and lined up beside the thatched eaves of " +
      "the cottages downwind to the southwest\", and \"hid fire bombs everywhere\". The " +
      "fire attack comes later.",
    evaluationCriteria:
      "Full credit: Under dense clouds, at the lower left of the frame firewood carts " +
      "stand in a row by the eaves of the thatched cottages, and soldiers stuff fire " +
      "bombs with exposed fuses under the bundles of firewood; on the right of the frame " +
      "Chai Jin, with dragon brows and phoenix eyes, points with one hand toward the " +
      "thatched cottages at the lower left (a compositional convention; the left and " +
      "right of the original text are not tested); the dense clouds and bits of thatch, " +
      "the robe hem, and the firewood tips loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Already on fire; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
};
