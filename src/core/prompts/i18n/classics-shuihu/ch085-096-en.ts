/**
 * 《水浒传》第 85–96 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch085-096.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH085_096_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-085": "Ch. 85 · Calling for the Gate at Yijin Pass by Night",
  "shuihu-086": "Ch. 86 · Trapped in Qingshi Valley on a Starlit Night",
  "shuihu-087": "Ch. 87 · Shouting Yanshou to a Halt in the Black Vapor",
  "shuihu-088": "Ch. 88 · Viewing the Heaven-Encompassing Formation from the Command Platform",
  "shuihu-089": "Ch. 89 · Proclaiming the Edict in the Hall of the Golden Bells at Yanjing",
  "shuihu-090": "Ch. 90 · Seeking Chan Instruction in the Dharma Hall on Mount Wutai",
  "shuihu-091": "Ch. 91 · Ferrying the Army across the Yellow River at Yuanwu",
  "shuihu-092": "Ch. 92 · Hua Rong Fits an Arrow and Takes Aim at Yang Duan",
  "shuihu-093": "Ch. 93 · Li Kui Embraces His Mother in a Dream",
  "shuihu-094": "Ch. 94 · Tang Bin Bows to Song Jiang at Hu Pass",
  "shuihu-095": "Ch. 95 · Qiao Daoqing Forms a Hand Seal and Chants a Spell",
  "shuihu-096": "Ch. 96 · Gongsun Sheng Flings His Fly-Whisk and It Turns into a Bird",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH085_096_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-085": {
    coreKey:
      "Yijin Pass at the third watch: Vice Minister Ouyang rides at the head and shouts " +
      "for the gate to be opened, the gate stays tightly shut, and Song Jiang stands still " +
      "behind with his horsemen, gag-sticks held in their mouths",
    groundTruth:
      "Chapter 85, \"Song Gongming Crosses Yijin Pass by Night; Schoolmaster Wu Takes " +
      "Wen'an County by Guile\". \"All were ordered to have the bridle bells removed from " +
      "their horses, and the soldiers held gag-sticks in their mouths and marched " +
      "swiftly\"; \"by then it was about the third watch, and ahead lay the narrow mouth " +
      "of Yijin Pass\"; \"Vice Minister Ouyang gave a great shout: 'Open the gate!'\". " +
      "Opening the pass and crossing it come later.",
    evaluationCriteria:
      "Full credit: A starlit night at the third watch, a post road running between high " +
      "mountains on either side; on the right of the frame the wooden gate of the pass " +
      "tower is tightly shut, with Liao soldiers on the tower in the distance; in the " +
      "middle of the frame Vice Minister Ouyang rides at the head, raising his head to " +
      "shout for the gate to be opened; on the left of the frame Song Jiang, with Han " +
      "Chinese features and a purplish-brown complexion, short, reins in and stands " +
      "still, and behind him the horsemen hold wooden gag-sticks in their mouths, their " +
      "horses hung with no bells. Deductions: The gate wide open or the troops crossing " +
      "the pass; rows of torches or pursuers; Wu Yong, Lu Zhishen, or Wu Song in the " +
      "picture; Song Jiang with the characters tattooed on his face.",
  },
  "shuihu-086": {
    coreKey:
      "The floor of Qingshi Valley at the second watch: Lu Junyi reins in and looks up at " +
      "the high cliffs on all four sides, Xu Ning and Suo Chao are at his sides, and the " +
      "soldiers rest, exhausted",
    groundTruth:
      "Chapter 86, \"Song Gongming Fights a Great Battle at Dulu Mountain; Lu Junyi's " +
      "Troops Are Trapped in Qingshi Valley\". \"Around the second watch the wind at last " +
      "fell and the clouds parted, and once again the sky was full of stars\"; \"on all " +
      "four sides were high mountains, and to left and right sheer cliffs and " +
      "precipices\"; Lu Junyi orders, \"Let us rest here for the night for now\". Bai " +
      "Sheng rolling down to bring word comes later.",
    evaluationCriteria:
      "Full credit: A starlit night at the second watch, sheer cliffs on all four sides, " +
      "the wind fallen and the clouds parted, a few wisps of lingering cloud on the " +
      "clifftops; in the middle of the frame Lu Junyi, tall and imposing, his brows " +
      "parted like the character ba (eight), in helmet and armor, reins in with his spear " +
      "held crosswise and looks up at the high cliffs; on the left of the frame Xu Ning " +
      "on horseback holds his hook-sickle spear; on the right of the frame Suo Chao on " +
      "horseback, his gold-gilded battle-axe laid across the front of his saddle; at the " +
      "back the soldiers rest, exhausted. Deductions: The black fog and fierce wind not " +
      "yet cleared; campfires or torches; Liao soldiers in the picture; Lu Junyi holding " +
      "a cudgel.",
  },
  "shuihu-087": {
    coreKey:
      "In the black vapor at the north gate inside the formation: Huyan Zhuo bursts out " +
      "from the side, raising both rod-whips high, and shouts Yanshou to a halt, and " +
      "Yanshou, holding his Fangtian halberd, is about to turn round",
    groundTruth:
      "Chapter 87, \"Song Gongming Fights a Great Battle at Youzhou; Huyan Zhuo Captures a " +
      "Foreign General by Force\". At the north gate \"black vapor blotted out the sky and " +
      "dark clouds hid the sun\"; Huyan Zhuo \"shouted loudly: 'Young pup of a general, " +
      "where do you think you are going!'\"; Yanshou \"meant to come and fight, but was " +
      "caught off guard\". The rod-whip coming down to snap the halberd, and the capture, " +
      "come later.",
    evaluationCriteria:
      "Full credit: Black vapor blotting out the sky at the north gate inside the " +
      "formation; on the right of the frame Wuyan Yanshou, in a purple-gold crown and " +
      "silver armor, rides a jujube-bay horse holding his Fangtian halberd crosswise, " +
      "about to turn round; on the left of the frame Huyan Zhuo, in an iron futou cap " +
      "with skyward-pointing horns, a yellow silk-gauze forehead band, a black silk-gauze " +
      "robe, and black-lacquered armor, rides a black steed with four snow-white hooves " +
      "and bursts out from the side, a steel rod-whip in each hand raised high and not " +
      "yet brought down, shouting with his mouth open. Deductions: A rod-whip already " +
      "brought down, the halberd shaft snapped, or Yanshou captured; the two already in " +
      "contact; the features of the Liao figures caricatured.",
  },
  "shuihu-088": {
    coreKey:
      "The ladder-mounted command platform on the border of Changping County: Song Jiang, " +
      "Wu Yong, and Zhu Wu climb up to look out, and Zhu Wu points out the distant " +
      "Heaven-Encompassing Formation (huntianxiang), its yellow flags ringed by flags of " +
      "four colors",
    groundTruth:
      "Chapter 88, \"Commander Yan Arrays the Heaven-Encompassing Formation; Song Gongming " +
      "Receives the Mystic Woman's Method in a Dream\". \"Set up the ladder-mounted " +
      "command platform and took Wu Yong and Zhu Wu up onto it to look out\"; the Liao " +
      "formation is \"shaped just like a hen's egg\", black at the front, red at the " +
      "rear, blue-green on the left, and white on the right (the Liao army's own left and " +
      "right), with yellow flags in the center; Zhu Wu \"recognized it as a heavenly " +
      "formation\". The Liao army sallying out comes later.",
    evaluationCriteria:
      "Full credit: On the ladder-mounted command platform in the foreground, from left " +
      "to right of the frame, Wu Yong (fair-faced with a long beard), Song Jiang (with a " +
      "purplish-brown complexion, short), and Zhu Wu (raising his hand to point at the " +
      "formation); in the distance the Liao formation is egg-shaped, with black flags on " +
      "the side nearest the platform, blue-green flags on the right of the frame, white " +
      "flags on the left, red flags farthest away, and yellow flags in the center. " +
      "Deductions: The black and red flags drawn with front and back reversed; the Liao " +
      "army already sallying out to charge; Song Jiang with the characters tattooed on " +
      "his face; the Mystic Woman or snow in the picture.",
  },
  "shuihu-089": {
    coreKey:
      "The dragon pavilion (longting) in the center of the Hall of the Golden Bells: the " +
      "vice minister reads out the edict before the pavilion, Grand Marshal Su stands in " +
      "attendance at one side of it, the Liao ruler kneels with the officials to listen, " +
      "and the ten generals stand to left and right",
    groundTruth:
      "Chapter 89, \"Song Gongming Succeeds in Breaking the Formation; Grand Marshal Su " +
      "Bestows Grace and Delivers the Edict\". The edict is welcomed \"all the way up " +
      "into the Hall of the Golden Bells\"; \"the ten great generals stood to left and " +
      "right; Grand Marshal Su stood to the left of the dragon pavilion; the ruler of the " +
      "state knelt with the hundred officials before the hall\"; \"the Liao vice " +
      "minister, receiving the favor, requested the edict and read it out in the hall\". " +
      "The banquet comes later, and Song Jiang stays in camp.",
    evaluationCriteria:
      "Full credit: The dragon pavilion in the center of the hall, the Liao vice minister " +
      "standing before it, unrolling the edict scroll and reading it out; Grand Marshal " +
      "Su, in a purple robe and holding an ivory tablet, stands in attendance on the left " +
      "of the frame beside the dragon pavilion (a compositional convention; the left and " +
      "right of the original text are not tested); in the front row on the right of the " +
      "frame Guan Sheng, with a reddish-brown complexion like a ripe jujube, with natural " +
      "shading, and a three-strand beard, in a brocade robe and gold armor; the other " +
      "nine generals stand on either side; in the foreground the Liao ruler, properly " +
      "dressed in robe and cap, kneels with the officials below the steps before the hall " +
      "to hear the edict. Deductions: The dragon pavilion drawn outside the hall; Song " +
      "Jiang in the picture or a banquet already laid; Guan Sheng drawn with a red opera " +
      "face-paint mask; the Liao ruler's appearance caricatured.",
  },
  "shuihu-090": {
    coreKey:
      "The Dharma hall on Mount Wutai: Elder Zhizhen, his brows and hair entirely white, " +
      "sits on the Dharma seat with red gauze lanterns at his side, Song Jiang presses his " +
      "palms together before the incense table to put his question, and Lu Zhishen stands " +
      "in the ranks",
    groundTruth:
      "Chapter 90, \"Song Jiang Seeks Chan Instruction on Mount Wutai; Yan Qing Meets an " +
      "Old Friend at Shuanglin Town\". \"As the hand chime sounded, two red gauze " +
      "lanterns led the elder up to the Dharma seat\"; the elder takes up devotional " +
      "incense three times and offers a blessing; \"Song Jiang stepped forward, offered " +
      "incense, and bowed, then pressed his palms together and drew near to seek Chan " +
      "instruction\"; the elder's \"brows and hair were entirely white\", and everyone " +
      "\"took off their military dress and belts\". Speaking the gatha comes later.",
    evaluationCriteria:
      "Full credit: At the top of the frame Elder Zhizhen, his brows and hair entirely " +
      "white, sits in the full lotus position on the Dharma seat, two attendants beside " +
      "the seat carry red gauze lanterns, and several sticks of devotional incense stand " +
      "in the censer before the seat; in the middle of the frame Song Jiang, with a " +
      "purplish-brown complexion, short, in plain clothes, half turned, stands before the " +
      "incense table with his palms pressed together to put his question; on the left of " +
      "the frame monks in kasayas stand in attendance; on the right of the frame the " +
      "chieftains in plain clothes stand in a row, Lu Zhishen in the front row, " +
      "shaven-headed, with a round face and large ears. Deductions: Song Jiang in armor or " +
      "with the characters tattooed on his face; Lu Zhishen carrying his monk's staff.",
  },
  "shuihu-091": {
    coreKey:
      "The Yellow River ferry crossing at Yuanwu: the warships of the two marine " +
      "squadrons are moored apart to left and right, local boats carry the horses and " +
      "carts across the river, Song Jiang rides a boat, and Li Jun directs from the bow " +
      "of a ship",
    groundTruth:
      "Chapter 91, \"Song Gongming's Troops Cross the Yellow River; Lu Junyi Tricks His " +
      "Way into a City in the Dark of Night\". \"Song Jiang ordered Li Jun and the others " +
      "to lead six hundred marines, divided into two squadrons, posted on the left and " +
      "the right\"; \"also gather up some local boats to carry the horses and carts\"; " +
      "\"Song Jiang and the main army crossed one after another to the north bank of the " +
      "Yellow River\". The attack on Lingchuan comes later.",
    evaluationCriteria:
      "Full credit: The ferry crossing on the south bank of the Yellow River, the water " +
      "wide open; the warships of the two squadrons are moored apart on the left and " +
      "right of the frame, the marines holding oars; between them local boats carry " +
      "warhorses and carts toward the north bank, and in the middle of the frame, on the " +
      "large boat carrying horses, is Song Jiang, with a purplish-brown complexion, " +
      "short; on the right of the frame, at the bow of a warship, Li Jun, with thick " +
      "brows and big eyes and a reddish-brown complexion like a ripe jujube, with natural " +
      "shading, points forward with one hand to direct them. Deductions: A pontoon bridge " +
      "in the picture; Song Jiang with the characters tattooed on his face; Li Jun drawn " +
      "with a red opera face-paint mask.",
  },
  "shuihu-092": {
    coreKey:
      "Below the south gate of Gaizhou: Hua Rong, his spear hung on his saddle, holds his " +
      "bow in his left hand and fits an arrow with his right, the bow almost fully drawn " +
      "but not yet loosed, as he fixes his aim on Yang Duan, who holds a bow on the gate " +
      "tower",
    groundTruth:
      "Chapter 92, \"Little Li Guang's Divine Arrow Boosts the Army's Might; the " +
      "Resourceful Star Lays Secret Plans to Attack Gaizhou\". \"Yang Duan saw Hua Rong " +
      "drawing near the gate tower\"; Hua Rong snatches the arrow and \"held it between " +
      "his teeth\", then \"rose in the saddle, hung his spear on the saddle hook ring, " +
      "took up the bow in his left hand, and with his right took that arrow and fitted it " +
      "to the string\". The arrow striking Yang Duan comes later.",
    evaluationCriteria:
      "Full credit: The south gate of Gaizhou on a clear day; at the upper right of the " +
      "frame, behind the battlements of the gate tower, Yang Duan holds a bow and leans " +
      "out to look down, with defenders beside him; on the left of the frame Hua Rong, " +
      "with white teeth and red lips, his brows reaching to his temples, on horseback, " +
      "his steel-tipped spear hung on the ring at the side of the saddle, holds his bow " +
      "in his left hand with an arrow already fitted to the string by his right, the bow " +
      "almost fully drawn but not yet loosed, looking up and fixing his aim on Yang Duan, " +
      "with no arrow in his mouth. Deductions: The arrow already loosed or anyone struck " +
      "by an arrow; Hua Rong biting an arrow or holding his spear in hand; a crossbow in " +
      "place of the bow; Song Jiang in the picture.",
  },
  "shuihu-093": {
    coreKey:
      "In the woods of Tianchi Ridge in a dream: Li Kui steps forward and embraces his old " +
      "mother, who sits upright with her eyes closed on a bluestone, his broad axes " +
      "tucked in his belt and both hands free",
    groundTruth:
      "Chapter 93, \"Li Kui Wreaks Havoc at Tianchi in a Dream; Song Jiang Divides His " +
      "Troops into Two Routes\". \"He rushed into the woods, and sure enough there was an " +
      "old woman sitting there\"; \"it turned out to be Iron Ox's old mother, sitting " +
      "blankly with her eyes closed on a bluestone\"; \"Li Kui stepped forward and threw " +
      "his arms around her\". The fierce tiger leaping out comes later.",
    evaluationCriteria:
      "Full credit: The woods of Tianchi Ridge without snow, layer upon layer of peaks in " +
      "the distance; on the right of the frame Li Kui's mother sits upright on a large " +
      "bluestone with both eyes closed; in the middle of the frame Li Kui, with a deep " +
      "bronze, rough-skinned face, a reddish-yellow beard, and a thickset, sturdy body, " +
      "his two broad axes tucked in his belt, kneels on one knee before the stone and " +
      "holds his old mother in both arms, tear stains on his face. Deductions: A fierce " +
      "tiger or the scholar in the picture; pool water or lying snow.",
  },
  "shuihu-094": {
    coreKey:
      "Before the gate of Hu Pass: Song Jiang's main army enters the pass, Tang Bin " +
      "dismounts and bows to him, and Song Jiang hastens to return the courtesy and " +
      "reaches out to raise him up",
    groundTruth:
      "Chapter 94, \"Guan Sheng Wins Over Three Generals by Righteousness; Li Kui Rashly " +
      "Lands Everyone in a Trap\". Hu Pass \"lies right between two mountains\"; " +
      "\"Vanguard Song and the main army entered the pass one after another; Tang Bin " +
      "dismounted and bowed to Song Jiang\"; \"Song Jiang hastened to return the " +
      "courtesy and hurriedly raised him up\". Wen Zhongrong and Cui Ye entering the pass " +
      "to pay their respects comes later; Guan Sheng is not at Hu Pass.",
    evaluationCriteria:
      "Full credit: The gate archway and pass tower of Hu Pass between two mountains; on " +
      "the left of the frame Song Jiang, with a purplish-brown complexion, short, stands " +
      "on the left before the gate archway, bowing slightly to return the courtesy, both " +
      "hands reaching forward to raise him up; on the right of the frame Tang Bin, one " +
      "knee on the ground, bends forward with his fists clasped in salute to make his " +
      "bow, no lance in his hands, and behind him an attendant leads his horse and holds " +
      "his lance; at the left rear Song troops stand in ranks, and on both sides of the " +
      "gate archway the surrendered soldiers hold their dagger-axes lowered. Deductions: " +
      "Guan Sheng in the picture; Wen Zhongrong and Cui Ye in the same frame; Song Jiang " +
      "with the characters tattooed on his face.",
  },
  "shuihu-095": {
    coreKey:
      "South of the city of Zhaode, the two formations drawn up facing each other: Qiao " +
      "Daoqing, on horseback outside the drawbridge, holds his sword, forms a hand seal, " +
      "and chants a spell, Song Jiang points with his whip and shouts in anger, and Yu " +
      "Baosi holds up the commander's banner",
    groundTruth:
      "Chapter 95, \"Song Gongming's Loyalty Moves the Earth Sovereign (Houtu); Qiao " +
      "Daoqing Defeats the Song Troops with Magic\". \"Yu Baosi, holding up the " +
      "commander's banner, stood before the horse\"; \"Song Jiang, in a great rage, " +
      "pointed with the tip of his whip\"; \"Qiao Daoqing clicked his teeth to work his " +
      "magic, formed a hand seal, and chanted a spell\". The divine soldiers flying in " +
      "and heaven and earth going dark come later.",
    evaluationCriteria:
      "Full credit: South of the city of Zhaode by day in clear weather, the drawbridge " +
      "lowered, the two formations drawn up facing each other, not yet engaged; on the " +
      "right of the frame, outside the drawbridge, Qiao Daoqing, in a purple-gold " +
      "fishtail Taoist crown and a black-edged crane-feather cloak, on a silver-maned " +
      "horse, holds a sword in one hand and forms a sword-finger hand seal with the other " +
      "as he chants a spell; on the left of the frame Song Jiang, with a purplish-brown " +
      "complexion, short, on horseback, points forward with the tip of his whip; before " +
      "his horse Yu Baosi, taller than other men, holds up the commander's banner. " +
      "Deductions: Black vapor, wind-blown sand, white waves, or divine figures already " +
      "appearing; the two formations fighting; Song Jiang with the characters tattooed " +
      "on his face.",
  },
  "shuihu-096": {
    coreKey:
      "A contest of magic before Wulong Mountain: five dragons coil and dance in the air, " +
      "and the fly-whisk (zhuwei) that Gongsun Sheng, sword in his left hand, has flung " +
      "with his right has just turned into a bird the size of a wild goose and flown up",
    groundTruth:
      "Chapter 96, \"The Phantom Lord's Magic Is Thwarted at Wulong Mountain; Dragon in " +
      "the Clouds Besieges Baigu Ridge with His Troops\". \"The five dragons danced " +
      "wildly in the air\"; \"Gongsun Sheng, sword in his left hand, flung the fly-whisk " +
      "into the air with his right\"; \"the fly-whisk tumbled over once in the air and " +
      "turned into a bird like a wild goose that flew up and away\". The bird gradually " +
      "growing into a great roc and smashing the clay dragons comes later.",
    evaluationCriteria:
      "Full credit: Five dragons in the air, one each of blue-green, yellow, red, black, " +
      "and white, coiling and dancing; on the left of the frame two riders side by side, " +
      "Song Jiang on the left, with a purplish-brown complexion, short, and Gongsun Sheng " +
      "on the right, in a star crown and a crane-feather cloak, with a full beard " +
      "covering his mouth, riding a yellow-maned horse, his left hand gripping a sword " +
      "and his right hand raised, the fly-whisk already turned into a bird the size of a " +
      "wild goose and flying off; on the right of the frame Qiao Daoqing, his " +
      "purple-gold fishtail Taoist crown sitting straight, sword in hand, reins in and " +
      "looks up. Deductions: A great roc or a giant bird blotting out the sky; clods of " +
      "clay falling; yellow sand or beasts cut from paper.",
  },
  "shuihu-anim-085": {
    coreKey:
      "Vice Minister Ouyang on horseback shouting for the gate to be opened and Song " +
      "Jiang standing still with his horsemen, gag-sticks held in their mouths, with " +
      "animated lantern, horses' manes and tails, and starlight",
    groundTruth:
      "Chapter 85, \"Song Gongming Crosses Yijin Pass by Night; Schoolmaster Wu Takes " +
      "Wen'an County by Guile\". \"By then it was about the third watch, and ahead lay " +
      "the narrow mouth of Yijin Pass\"; \"Vice Minister Ouyang gave a great shout: 'Open " +
      "the gate!'\"; the soldiers hold gag-sticks in their mouths, and the horses have " +
      "their bridle bells removed. The officers guarding the pass opening the gate comes " +
      "later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the wooden gate of the pass tower is " +
      "tightly shut, in the middle of the frame Vice Minister Ouyang rides at the head, " +
      "raising his head to shout for the gate to be opened, and on the left of the frame " +
      "Song Jiang, with a purplish-brown complexion, short, reins in and stands still, " +
      "behind him the horsemen holding wooden gag-sticks in their mouths, their horses " +
      "hung with no bells; the lantern, the horses' manes and tails, and the starlight " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: The gate wide open; Song " +
      "Jiang with the characters tattooed on his face; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-086": {
    coreKey:
      "Lu Junyi reining in and looking up at the high cliffs on all four sides, with Xu " +
      "Ning and Suo Chao at his sides, with animated starlight, horses' manes and tails, " +
      "and lingering clouds",
    groundTruth:
      "Chapter 86, \"Song Gongming Fights a Great Battle at Dulu Mountain; Lu Junyi's " +
      "Troops Are Trapped in Qingshi Valley\". \"Around the second watch the wind at last " +
      "fell and the clouds parted, and once again the sky was full of stars\"; Qingshi " +
      "Valley \"had only one road leading in\", and \"on all four sides were high " +
      "mountains\"; Lu Junyi orders, \"Let us rest here for the night for now\". Bai " +
      "Sheng bringing word comes later.",
    evaluationCriteria:
      "Full credit: The valley floor on a starlit night, sheer cliffs on all four sides, " +
      "the wind fallen and the clouds parted; in the middle of the frame Lu Junyi, tall " +
      "and imposing, in helmet and armor, reins in with his spear held crosswise and " +
      "looks up at the high cliffs, on the left of the frame Xu Ning holds his " +
      "hook-sickle spear, and on the right of the frame Suo Chao has his gold-gilded " +
      "battle-axe laid across the front of his saddle; the starlight, the horses' manes " +
      "and tails, and the lingering clouds loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Campfires or torches; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-087": {
    coreKey:
      "Huyan Zhuo bursting out from the side with both rod-whips raised high to shout " +
      "Yanshou to a halt and Yanshou turning round with his Fangtian halberd, with " +
      "animated dark clouds, trailing band ends and manes, and colored streamers",
    groundTruth:
      "Chapter 87, \"Song Gongming Fights a Great Battle at Youzhou; Huyan Zhuo Captures a " +
      "Foreign General by Force\". Yanshou wears \"a three-pronged ruyi crown of purple " +
      "gold\" and \"silver armor with Shu-brocade roundel flowers\"; at the north gate " +
      "\"black vapor blotted out the sky and dark clouds hid the sun\"; Huyan Zhuo " +
      "\"shouted loudly: 'Young pup of a general, where do you think you are going!'\". " +
      "The rod-whip coming down to snap the halberd comes later.",
    evaluationCriteria:
      "Full credit: Black vapor blotting out the sky at the north gate; on the right of " +
      "the frame Wuyan Yanshou, in a purple-gold crown and silver armor, holds his " +
      "Fangtian halberd, about to turn round, and on the left of the frame Huyan " +
      "Zhuo, in an iron futou cap and a yellow silk-gauze forehead band, rides a black " +
      "steed with four snow-white hooves, a steel rod-whip in each hand raised high and " +
      "not yet brought down; the dark clouds, the trailing band ends and manes, and the " +
      "colored streamers loop smoothly, driven by SMIL or inline CSS. Deductions: A " +
      "rod-whip already brought down; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-088": {
    coreKey:
      "Song Jiang, Wu Yong, and Zhu Wu on the ladder-mounted command platform looking out " +
      "at the distant Heaven-Encompassing Formation, with animated flags, robe hems, and " +
      "feather fan",
    groundTruth:
      "Chapter 88, \"Commander Yan Arrays the Heaven-Encompassing Formation; Song Gongming " +
      "Receives the Mystic Woman's Method in a Dream\". Song Jiang \"took Wu Yong and Zhu " +
      "Wu up onto the platform to look out\"; the Liao formation is \"shaped just like a " +
      "hen's egg\", black at the front, red at the rear, blue-green on the left, and " +
      "white on the right (the Liao army's own left and right), with yellow flags in the " +
      "center; Zhu Wu \"recognized it as a heavenly formation\". The Liao army sallying " +
      "out comes later.",
    evaluationCriteria:
      "Full credit: On the ladder-mounted command platform in the foreground, from left " +
      "to right of the frame, Wu Yong, Song Jiang with a purplish-brown complexion, " +
      "short, and Zhu Wu raising his hand to point at the formation; in the distance the " +
      "Liao formation is egg-shaped, with black flags on the side nearest the platform, " +
      "red flags farthest away, white flags on the left of the frame, blue-green flags on " +
      "the right of the frame, and yellow flags in the center; the flags, the robe hems, " +
      "and the feather fan loop smoothly, driven by SMIL or inline CSS. Deductions: The " +
      "black and red flags drawn reversed; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-089": {
    coreKey:
      "The vice minister reading out the edict before the dragon pavilion in the center " +
      "of the hall, Grand Marshal Su standing in attendance beside the pavilion, and the " +
      "Liao ruler kneeling with the officials to listen, with animated yellow curtains " +
      "and tassels, and brocade robe hems",
    groundTruth:
      "Chapter 89, \"Song Gongming Succeeds in Breaking the Formation; Grand Marshal Su " +
      "Bestows Grace and Delivers the Edict\". \"Grand Marshal Su stood to the left of the " +
      "dragon pavilion; the ruler of the state knelt with the hundred officials before " +
      "the hall\"; \"the Liao vice minister, receiving the favor, requested the edict and " +
      "read it out in the hall\"; the generals wear \"brocade robes and gold armor, " +
      "military dress and leather belts\". The banquet comes later, and Song Jiang is not " +
      "in the hall.",
    evaluationCriteria:
      "Full credit: The dragon pavilion in the center of the hall, the Liao vice minister " +
      "standing before it reading out the edict scroll, Grand Marshal Su, in a purple " +
      "robe and holding an ivory tablet, standing in attendance on the left of the frame " +
      "beside the dragon pavilion (a compositional convention; the left and right of the " +
      "original text are not tested), in the front row on the right of the frame Guan " +
      "Sheng, with a reddish-brown complexion like a ripe jujube, with natural shading, " +
      "and in the foreground the Liao ruler, properly dressed in robe and cap, kneeling " +
      "with the officials below the steps before the hall to hear the edict; the yellow " +
      "curtains and the brocade robe hems loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The dragon pavilion drawn outside the hall; Song Jiang in the picture; " +
      "Guan Sheng drawn with a red opera face-paint mask; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-090": {
    coreKey:
      "Elder Zhizhen sitting on the Dharma seat, Song Jiang pressing his palms together " +
      "before the incense table to put his question, and Lu Zhishen in the ranks, with " +
      "animated incense smoke and lantern candle flames",
    groundTruth:
      "Chapter 90, \"Song Jiang Seeks Chan Instruction on Mount Wutai; Yan Qing Meets an " +
      "Old Friend at Shuanglin Town\". \"As the hand chime sounded, two red gauze " +
      "lanterns led the elder up to the Dharma seat\"; the elder is \"past sixty, his " +
      "brows and hair entirely white\"; \"Song Jiang stepped forward, offered incense, " +
      "and bowed, then pressed his palms together and drew near to seek Chan " +
      "instruction\". Speaking the gatha comes later.",
    evaluationCriteria:
      "Full credit: At the top of the frame Elder Zhizhen, his brows and hair entirely " +
      "white, on the Dharma seat, two attendants beside the seat carrying red gauze " +
      "lanterns, in the middle of the frame Song Jiang, with a purplish-brown " +
      "complexion, short, in plain clothes, standing before the incense table with his " +
      "palms pressed together to put his question, and on the right of the frame Lu " +
      "Zhishen, shaven-headed, with a round face and large ears; the incense smoke and " +
      "the lantern candle flames loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Song Jiang in armor; Lu Zhishen carrying his monk's staff; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-091": {
    coreKey:
      "The warships of the two squadrons moored apart to left and right, local boats " +
      "carrying the horses and carts across the river, and Li Jun directing from the bow " +
      "of a ship, with animated oar blades, ripples, and warhorses",
    groundTruth:
      "Chapter 91, \"Song Gongming's Troops Cross the Yellow River; Lu Junyi Tricks His " +
      "Way into a City in the Dark of Night\". \"Song Jiang ordered Li Jun and the others " +
      "to lead six hundred marines, divided into two squadrons, posted on the left and " +
      "the right\"; \"also gather up some local boats to carry the horses and carts\"; " +
      "\"Song Jiang and the main army crossed one after another to the north bank of the " +
      "Yellow River\". Encamping at Weizhou comes later.",
    evaluationCriteria:
      "Full credit: The warships of the two squadrons moored apart on the left and right " +
      "of the frame, between them local boats carrying warhorses and carts toward the " +
      "north bank, in the middle of the frame, on the large boat, Song Jiang, with a " +
      "purplish-brown complexion, short, and on the right of the frame, at a bow, Li " +
      "Jun, with a reddish-brown complexion like a ripe jujube, with natural shading, " +
      "pointing forward with one hand; the oar blades, the ripples, and the warhorses " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: A pontoon bridge in the " +
      "picture; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-092": {
    coreKey:
      "Hua Rong, his spear hung on his saddle, fitting an arrow, the bow almost fully " +
      "drawn but not yet loosed, as he fixes his aim on Yang Duan on the gate tower, with " +
      "animated flags, and horse's tail and robe corner",
    groundTruth:
      "Chapter 92, \"Little Li Guang's Divine Arrow Boosts the Army's Might; the " +
      "Resourceful Star Lays Secret Plans to Attack Gaizhou\". \"Yang Duan saw Hua Rong " +
      "drawing near the gate tower\"; Hua Rong \"rose in the saddle, hung his spear on " +
      "the saddle hook ring, took up the bow in his left hand, and with his right took " +
      "that arrow and fitted it to the string\". The arrow striking Yang Duan comes later.",
    evaluationCriteria:
      "Full credit: At the upper right of the frame, behind the battlements of the gate " +
      "tower, Yang Duan holds a bow and looks down, and on the left of the frame Hua " +
      "Rong, with white teeth and red lips, on horseback, his spear hung on the ring at " +
      "the side of the saddle, holds his bow in his left hand with an arrow already " +
      "fitted to the string by his right, the bow almost fully drawn but not yet loosed, " +
      "fixing his aim on Yang Duan, with no arrow in his mouth; the flags, and the " +
      "horse's tail and robe corner loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The arrow flying out or anyone struck by an arrow; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-093": {
    coreKey:
      "Li Kui kneeling on one knee to embrace his old mother, who sits upright with her " +
      "eyes closed on a bluestone, with animated pine branches, drifting mountain mist, " +
      "and shoulders heaving with sobs",
    groundTruth:
      "Chapter 93, \"Li Kui Wreaks Havoc at Tianchi in a Dream; Song Jiang Divides His " +
      "Troops into Two Routes\". \"It turned out to be Iron Ox's old mother, sitting " +
      "blankly with her eyes closed on a bluestone\"; \"Li Kui stepped forward and threw " +
      "his arms around her\", weeping as he tells her he has accepted the amnesty. The " +
      "fierce tiger leaping out and his swinging his axe and waking with a start come " +
      "later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Li Kui's mother sits upright on a large " +
      "bluestone with both eyes closed, and in the middle of the frame Li Kui, with a " +
      "deep bronze, rough-skinned face, his two broad axes tucked in his belt, kneels on " +
      "one knee before the stone and holds his old mother in both arms, tear stains on " +
      "his face; the pine branches, the drifting mountain mist, and the heaving of Li " +
      "Kui's shoulders loop smoothly, driven by SMIL or inline CSS. Deductions: A fierce " +
      "tiger or the scholar in the picture; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-094": {
    coreKey:
      "Tang Bin on one knee bowing to Song Jiang and Song Jiang bending forward and " +
      "reaching out to raise him up, with animated flags on the pass tower, and a " +
      "warhorse tossing its head and swishing its tail",
    groundTruth:
      "Chapter 94, \"Guan Sheng Wins Over Three Generals by Righteousness; Li Kui Rashly " +
      "Lands Everyone in a Trap\". \"Vanguard Song and the main army entered the pass one " +
      "after another; Tang Bin dismounted and bowed to Song Jiang\"; \"Song Jiang hastened " +
      "to return the courtesy and hurriedly raised him up\". Wen Zhongrong and Cui Ye " +
      "entering the pass to pay their respects comes later; Guan Sheng is not at Hu Pass.",
    evaluationCriteria:
      "Full credit: On the left of the frame Song Jiang, with a purplish-brown " +
      "complexion, short, stands on the left before the gate archway, bowing slightly to " +
      "return the courtesy, both hands reaching forward to raise him up, and on the right " +
      "of the frame Tang Bin, one knee on the ground, bends forward with his fists " +
      "clasped in salute to make his bow, no lance in his hands, and behind him an " +
      "attendant leads his horse and holds his lance; the flags and the warhorse loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Guan Sheng in the picture; " +
      "Wen Zhongrong and Cui Ye in the same frame; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-095": {
    coreKey:
      "Qiao Daoqing on horseback outside the drawbridge holding his sword, forming a hand " +
      "seal, and chanting a spell, Song Jiang pointing with his whip, and Yu Baosi " +
      "holding up the commander's banner, with animated flags, and crown ribbons and " +
      "sleeves",
    groundTruth:
      "Chapter 95, \"Song Gongming's Loyalty Moves the Earth Sovereign (Houtu); Qiao " +
      "Daoqing Defeats the Song Troops with Magic\". Qiao Daoqing \"clicked his teeth to " +
      "work his magic, formed a hand seal, and chanted a spell\"; Song Jiang \"pointed " +
      "with the tip of his whip\"; \"Yu Baosi, holding up the commander's banner, stood " +
      "before the horse\". Pointing his sword so that divine soldiers fly in, and heaven " +
      "and earth going dark, come later.",
    evaluationCriteria:
      "Full credit: The two formations drawn up facing each other, not yet engaged; on " +
      "the right of the frame Qiao Daoqing, in a purple-gold fishtail Taoist crown, holds " +
      "a sword in one hand and forms a sword-finger hand seal with the other as he chants " +
      "a spell, and on the left of the frame Song Jiang, with a purplish-brown " +
      "complexion, short, points forward with the tip of his whip, Yu Baosi before his " +
      "horse holding up the commander's banner; the flags, and the crown ribbons and " +
      "sleeves loop smoothly, driven by SMIL or inline CSS. Deductions: Black vapor, " +
      "white waves, or divine figures already appearing; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-096": {
    coreKey:
      "Five dragons coiling and dancing in the air and the fly-whisk flung by Gongsun " +
      "Sheng just turned into a bird the size of a wild goose, with animated dragon " +
      "bodies, bird's wings, and robe sleeves",
    groundTruth:
      "Chapter 96, \"The Phantom Lord's Magic Is Thwarted at Wulong Mountain; Dragon in " +
      "the Clouds Besieges Baigu Ridge with His Troops\". \"The five dragons danced " +
      "wildly in the air, in exact accord with the Five Phases of metal, wood, water, " +
      "fire, and earth\"; \"Gongsun Sheng, sword in his left hand, flung the fly-whisk " +
      "into the air with his right\", and it \"turned into a bird like a wild goose that " +
      "flew up and away\". Growing gradually into a great roc comes later.",
    evaluationCriteria:
      "Full credit: Five dragons in the air, one each of blue-green, yellow, red, black, " +
      "and white; on the left of the frame two riders side by side, Song Jiang on the " +
      "left, with a purplish-brown complexion, short, and Gongsun Sheng on the right, in " +
      "a star crown and a crane-feather cloak, his left hand gripping a sword and his " +
      "right hand raised, the fly-whisk already turned into a bird the size of a wild " +
      "goose; on the right of the frame Qiao Daoqing, his Taoist crown sitting straight, " +
      "holds his sword; the dragon bodies, the bird's wings, and the robe sleeves loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The bird growing into a great " +
      "roc; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
};
