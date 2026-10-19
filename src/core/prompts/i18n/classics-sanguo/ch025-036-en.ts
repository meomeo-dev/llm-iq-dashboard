/**
 * 《三国演义》第 25–36 回候选的英文标签与英文评判标准，由
 * src/core/classics/sanguo/ch025-036.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SANGUO_CH025_036_LABELS_EN: Readonly<Record<string, string>> = {
  "sanguo-025": "Ch. 25 · Guan Yu Charges the Lines at Baima",
  "sanguo-026": "Ch. 26 · Guan Yu Hangs Up His Seal and Seals Away the Gold",
  "sanguo-027": "Ch. 27 · Guan Yu Lifts the Robe on the Bridge",
  "sanguo-028": "Ch. 28 · Zhang Fei Levels His Spear at the Old City",
  "sanguo-029": "Ch. 29 · Sun Ce Rages at Yu Ji After the Rain",
  "sanguo-030": "Ch. 30 · Cao Cao Burns the Grain at Wuchao",
  "sanguo-031": "Ch. 31 · Yuan Shang Shows Off His Prowess at Cangting",
  "sanguo-032": "Ch. 32 · Breaching the Zhang River to Flood the City",
  "sanguo-033": "Ch. 33 · Cao Cao Opens Guo Jia's Last Letter",
  "sanguo-034": "Ch. 34 · Liu Bei Leaps His Horse Across the Tan Stream",
  "sanguo-035": "Ch. 35 · Water Mirror Welcomes Liu Bei with a Smile",
  "sanguo-036": "Ch. 36 · Liu Bei Sees Off Xu Shu by the Woods",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SANGUO_CH025_036_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "sanguo-025": {
    coreKey:
      "Charging the lines at Baima: Guan Yu, holding the Green Dragon Blade upside down, " +
      "rides Red Hare down the earthen hill, Yan Liang, blade in hand beneath his canopy " +
      "and banners, is about to ask, and Cao Cao looks on from the hilltop",
    groundTruth:
      "Chapter 25, \"Encamped on the Earthen Hill, Lord Guan Sets Three Conditions; " +
      "Relieving Baima, Cao Cao Breaks the Siege\". Cao Cao watches the battle lines from " +
      "the earthen hill at Baima; Lord Guan, \"holding the Green Dragon Blade upside down, " +
      "galloped down the hill\", \"his phoenix eyes wide open, his silkworm brows standing " +
      "straight up\"; Yan Liang, in embroidered robe and gold armor, \"sat his horse, " +
      "blade in hand\" beneath his command canopy, and \"just as he was about to ask\", " +
      "Guan Yu was already upon him. Red Hare was a gift from Cao Cao, and the green " +
      "brocade battle robe an earlier gift from Liu Bei.",
    evaluationCriteria:
      "Full credit: In the center of the frame Guan Yu, phoenix eyes wide open, wearing " +
      "the green brocade battle robe as an outer layer, holding the Green Dragon Blade " +
      "upside down, rides Red Hare down the earthen hill; on the right of the frame Yan " +
      "Liang, in embroidered robe and gold armor, sits his horse beneath the canopy and " +
      "banners, blade in hand, about to ask, and the Hebei army splits apart like parting " +
      "waves; at the upper left of the frame, on the earthen hilltop, Cao Cao and his " +
      "generals look on. Deductions: Stabbing him off his horse, beheading, or blood " +
      "shown; Guan Yu riding a horse that is not bright red; Chinese opera face paint on " +
      "Guan Yu or Yan Liang.",
  },
  "sanguo-026": {
    coreKey:
      "Hanging up the seal and sealing away the gold: Guan Yu gazes up at the seal " +
      "hanging in the hall, the farewell letter on the table is already sealed, the gold " +
      "and silver are sealed in chests, and the carriage and retinue wait outside the " +
      "gate to set out",
    groundTruth:
      "Chapter 26, \"Yuan Benchu Is Defeated, Losing Troops and Generals; Guan Yunchang " +
      "Hangs Up His Seal and Seals Away the Gold\". Lord Guan writes a letter taking leave " +
      "of Cao Cao with thanks, \"took the gold and silver he had received time after " +
      "time, sealed it all away item by item in the storehouse, hung the seal of the " +
      "Marquis of Hanshou Precinct in the hall, and asked the two ladies to get into the " +
      "carriage\"; everything Cao Cao had bestowed is left behind; riding out of the " +
      "north gate with his blade held crosswise comes after this.",
    evaluationCriteria:
      "Full credit: At the upper left of the frame the seal hangs beneath the hall beam; " +
      "in the center of the frame Guan Yu stands beside the table gazing up at the " +
      "hanging seal, the letter on the table already sealed; at the lower right of the " +
      "frame the gold is sealed in a wooden chest; on the right of the frame, outside the " +
      "gate, the carriage and retinue wait to set out, and attendants pack the luggage. " +
      "Deductions: Guan Yu holding his blade and shouting angrily; Red Hare or Cao Cao " +
      "drawn; Chinese opera face paint on Guan Yu.",
  },
  "sanguo-027": {
    coreKey:
      "Lifting the robe on the bridge: Guan Yu, on Red Hare and without dismounting, " +
      "lifts the brocade robe on the tip of his blade, a dismounted officer hands up the " +
      "robe, and Cao Cao and his generals are lined up without weapons",
    groundTruth:
      "Chapter 27, \"The Lord of the Fine Beard Rides Alone for a Thousand Li; The " +
      "Marquis of Hanshou Slays Six Generals at Five Passes\". \"Cao saw Lord Guan sitting " +
      "his horse on the bridge with his blade held crosswise, and ordered his generals to " +
      "rein in their horses and line up to the left and right\"; \"Lord Guan, seeing that " +
      "none of them had weapons in hand, at last set his mind at ease\"; without " +
      "dismounting, he \"lifted the brocade robe on the tip of the Green Dragon Blade and " +
      "threw it over his shoulders\". The original text calls it only \"the bridge\".",
    evaluationCriteria:
      "Full credit: On the right of the frame, in the middle of the bridge, Guan Yu, on " +
      "Red Hare and without dismounting, lifts the brocade robe on the tip of his blade, " +
      "not yet putting it on; in the center of the frame a dismounted officer hands up " +
      "the robe; on the left of the frame, at the bridgehead, Cao Cao reins in his horse, " +
      "and his generals line up to the left and right with no weapons in hand. " +
      "Deductions: Guan Yu dismounting, or the blade tip pointing at Cao Cao; attendants " +
      "holding weapons; a bridge name plaque or a fortified pass; Chinese opera face " +
      "paint on Guan Yu.",
  },
  "sanguo-028": {
    coreKey:
      "Outside the gate of the Old City: Zhang Fei, round-eyed and tiger-whiskered, " +
      "thrusts his spear straight out and shouts curses, Guan Yu, empty-handed on Red " +
      "Hare, explains himself, Zhou Cang holds the blade, and Lady Gan lifts the curtain " +
      "and calls out",
    groundTruth:
      "Chapter 28, \"Beheading Cai Yang, the Brothers Dispel Their Doubts; Meeting at the " +
      "Old City, Lord and Vassals Unite in Righteousness\". Lord Guan \"handed his blade " +
      "to Zhou Cang to take, and spurred his horse forward to meet him\"; Zhang Fei, \"his " +
      "round eyes glaring wide, his tiger whiskers standing on end, roaring like thunder, " +
      "swung his spear and thrust at Lord Guan\"; Lord Guan dodges, and the two exchange " +
      "words; Lord Guan asks Zhang Fei to ask his sisters-in-law himself, and the two " +
      "ladies \"lifted the curtain and called out\"; the beheading of Cai Yang comes " +
      "after this.",
    evaluationCriteria:
      "Full credit: On the right of the frame Zhang Fei, round-eyed, his tiger whiskers " +
      "standing on end, thrusts his eighteen-foot spear straight at Guan Yu and shouts " +
      "curses; in the center of the frame Guan Yu, empty-handed on Red Hare, reins in his " +
      "horse and explains himself; at the lower left of the frame Zhou Cang, on foot, " +
      "holds the blade; on the left of the frame, in the carriage, Lady Gan lifts the " +
      "curtain and calls out. Deductions: Guan Yu holding a blade, or the two crossing " +
      "weapons; the spear striking home, or blood shown; Cai Yang or war drums; black " +
      "opera face paint on Zhang Fei.",
  },
  "sanguo-029": {
    coreKey:
      "The rain altar after the rain: Sun Ce, on the altar, puts his hand on his sword " +
      "and changes color, the crowd helps Yu Ji down from the pyre and unties his ropes, " +
      "and officials and commoners bow all around in the standing water",
    groundTruth:
      "Chapter 29, \"The Little Conqueror Angrily Beheads Yu Ji; The Green-Eyed Boy Takes " +
      "Command of Jiangdong\". Yu Ji binds himself and prays for rain, and \"in an " +
      "instant the streets became rivers\"; \"the officials and the common people " +
      "together helped Yu Ji down from the pyre and untied his ropes\"; Sun Ce, the arrow " +
      "wound on his cheek still wrapped and not yet healed, sees officials and commoners " +
      "bowing all around in the water and flies into a rage.",
    evaluationCriteria:
      "Full credit: On the right of the frame, on the altar, Sun Ce, his cheek wrapped in " +
      "silk, puts his hand on his sword without drawing it, his face changing color in " +
      "sudden anger; in the center of the frame the crowd helps Yu Ji down from the wet " +
      "pyre and unties his ropes; at the lower left of the frame officials and commoners " +
      "bow all around in the standing water. Deductions: Burning a person, beheading, or " +
      "blood shown; Yu Ji in an eight-trigram Taoist robe or with a horsetail whisk; Sun " +
      "Ce in a white robe and silver armor.",
  },
  "sanguo-030": {
    coreKey:
      "Fire at Wuchao in the fourth watch: bundles of straw are set alight all around the " +
      "grain stores and thick smoke blots out the sky, Cao Cao reins in his horse in the " +
      "middle, and Zhang Liao and Xu Chu are at the front",
    groundTruth:
      "Chapter 30, \"Fighting at Guandu, Benchu Is Defeated; Raiding Wuchao, Mengde Burns " +
      "the Grain\". Cao's army \"carried the banners of Yuan's army; the soldiers all " +
      "bundled straw and carried firewood on their backs, the men with gags in their " +
      "mouths, the horses with their mouths bound\"; in the fourth watch \"Cao had the " +
      "soldiers set the bundled straw alight all around\", and fire breaks out on all " +
      "sides of the grain stores; Zhang Liao and Xu Chu are at the front.",
    evaluationCriteria:
      "Full credit: At night, on the right of the frame, flames rise on all sides around " +
      "the grain stores and thick smoke hides the stars; in the center of the frame Cao " +
      "Cao reins in his horse in the middle; at the lower right of the frame Xu Chu and " +
      "Zhang Liao are at the front; on the left of the frame Cao's soldiers carry bundles " +
      "of straw on their backs, hold gags in their mouths, and carry the banners of " +
      "Yuan's army. Deductions: Fighting or blood shown; fire arrows or gunpowder " +
      "explosions; Xu Chu bare-chested; a white face on Cao Cao; drawn as daytime.",
  },
  "sanguo-031": {
    coreKey:
      "Before the lines at Cangting: Yuan Shang, with two blades, gallops on horseback " +
      "between the two armies to show off his prowess, Cao Cao sits his horse, pointing " +
      "and asking, and Yuan Shao sits his horse with his eyes fixed on Yuan Shang",
    groundTruth:
      "Chapter 31, \"Cao Cao Defeats Benchu at Cangting; Xuande Takes Refuge with Liu " +
      "Biao in Jingzhou\". Cao Cao comes out before his lines, and Yuan Shao \"led his " +
      "three sons, his nephew, and his civil and military officials out before the " +
      "lines\"; \"Yuan Shang, wishing to show off his prowess before his father, whirled " +
      "his two blades, spurred his horse out of the ranks, and galloped back and forth\"; " +
      "Cao points and asks, \"Who is this?\"; Shi Huan riding out to fight comes after " +
      "this.",
    evaluationCriteria:
      "Full credit: In the center of the frame Yuan Shang, whirling a blade in each hand, " +
      "spurs his horse and gallops between the two armies; on the left of the frame Cao " +
      "Cao sits his horse before his lines, pointing and asking; on the right of the " +
      "frame Yuan Shao sits his horse with his eyes fixed on Yuan Shang; the two armies " +
      "face each other across open ground. Deductions: Shi Huan struck by an arrow and " +
      "falling from his horse, or blood shown; Yuan Shang holding a spear; the two " +
      "armies fighting; a white face on Cao Cao.",
  },
  "sanguo-032": {
    coreKey:
      "Breaching the Zhang River to flood the city: at daybreak the encircling trench " +
      "leads the Zhang River water surging toward the foot of the wall, Xu You points at " +
      "the water with Cao Cao beside him, and Shen Pei, on the city wall, looks down at " +
      "the water",
    groundTruth:
      "Chapter 32, \"Fighting over Jizhou, Yuan Shang Contends for Mastery; Breaching the " +
      "Zhang River, Xu You Offers a Plan\". Xu You proposes to \"breach the Zhang River " +
      "and flood the city with its water\"; Shen Pei sees that the trench \"was dug very " +
      "shallow\", but Cao's army adds men and digs through the night, and \"by daybreak " +
      "it was twenty feet wide and deep, and the Zhang River water was led in to flood " +
      "the city, several feet deep\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the Zhang River water is led into the " +
      "encircling trench and surges in, white foam pushing toward the foot of the wall; " +
      "on the left of the frame, on the trench bank, Xu You raises his hand to point at " +
      "the water, with Cao Cao beside him; on the right of the frame Shen Pei, on the " +
      "city wall, looks down at the water; soldiers beside the trench hold spades and " +
      "baskets. Deductions: A flood swallowing the city, or floating corpses; fighting " +
      "in an assault on the city; a white face on Cao Cao.",
  },
  "sanguo-033": {
    coreKey:
      "Before Guo Jia's coffin: Cao Cao, holding the opened last letter, nods and sighs, " +
      "the attendant who presented the letter stands by, the officials are puzzled, and " +
      "the coffin is half hidden",
    groundTruth:
      "Chapter 33, \"Cao Pi Takes Lady Zhen Amid the Chaos; Guo Jia's Posthumous Plan " +
      "Settles Liaodong\". Cao Cao weeps and offers sacrifice to Guo Jia, and those " +
      "around him present the sealed letter Guo Jia left on his deathbed, saying, \"If " +
      "the Chancellor follows what is said in the letter, the affair of Liaodong will be " +
      "settled\"; \"Cao opened the letter and read it, nodding and sighing\", and \"none " +
      "of the others knew what he meant\".",
    evaluationCriteria:
      "Full credit: In the center of the frame Cao Cao, holding the opened paper letter, " +
      "nods and sighs; on the right of the frame the attendant stands bowing, and the " +
      "officials look puzzled; on the left of the frame a corner of the coffin, half " +
      "hidden by a plain white curtain, with a lamp before the coffin. Deductions: The " +
      "body, or an opened coffin; paper spirit money, funeral couplets, or an envelope; " +
      "a white face on Cao Cao, or Cao Cao in mourning white.",
  },
  "sanguo-034": {
    coreKey:
      "Leaping the Tan Stream: Dilu, with a white spot on its forehead, surges up out of " +
      "the stream and flies toward the west bank, and Liu Bei, his robe wet, leans " +
      "forward, lashes his whip, and cries out",
    groundTruth:
      "Chapter 34, \"Lady Cai Overhears a Secret Talk from Behind the Screen; Imperial " +
      "Uncle Liu Leaps His Horse Across the Tan Stream\". \"The Tan Stream was dozens of " +
      "feet wide, its water flowing into the Xiang River, its current very swift\"; " +
      "Xuande's robe is soaked, and he \"lashed his whip and cried out: 'Dilu, Dilu! " +
      "Today you bring me harm'\", and \"the horse suddenly surged up out of the water, " +
      "leapt thirty feet in one bound, and flew up onto the west bank\". Dilu \"had a " +
      "white spot at the edge of its forehead\".",
    evaluationCriteria:
      "Full credit: In the center of the frame Dilu, with a white spot on its forehead, " +
      "has just surged up out of the stream and flies toward the west bank on the right " +
      "of the frame; Liu Bei, the hem of his robe soaked, leans forward, lashes his whip, " +
      "and cries out; spray splashes in all directions; far off on the left of the " +
      "frame, a dust cloud on the east bank. Deductions: A dragon form, or the horse " +
      "struggling as it drowns; Liu Bei drawing a sword; Zhao Yun or Cai Mao drawn; " +
      "stirrups on the horse.",
  },
  "sanguo-035": {
    coreKey:
      "Water Mirror Manor as the zither falls silent: Sima Hui, with the form of a pine " +
      "and the bones of a crane, comes out smiling in welcome, Liu Bei, the front of his " +
      "clothes half wet, looks toward Sima Hui, and the herd boy points at Sima Hui",
    groundTruth:
      "Chapter 35, \"Xuande Meets a Recluse at Nanzhang; Shan Fu Meets a Heroic Lord at " +
      "Xinye\". After leaping the stream, Liu Bei reaches Water Mirror Manor and \"told " +
      "the boy not to announce him yet, and inclined his ear to listen\"; the zither " +
      "music suddenly stops, and Sima Hui (Water Mirror) comes out smiling; Xuande, \"the " +
      "front of his clothes still wet\", looks at him: \"with the form of a pine and the " +
      "bones of a crane, of extraordinary bearing\"; \"a go board and a zither upon the " +
      "stone couch\".",
    evaluationCriteria:
      "Full credit: On the right of the frame Sima Hui, with the form of a pine and the " +
      "bones of a crane, comes out of the thatched hall smiling in welcome, and inside " +
      "the thatched hall a zither and a go board lie on the stone couch; on the left of " +
      "the frame Liu Bei, the front of his clothes half wet, turns to look toward Sima " +
      "Hui, and the herd boy beside him raises his hand to point at Sima Hui. " +
      "Deductions: Musical notes or sound waves; Sima Hui with a feather fan or in a " +
      "Taoist robe; Xu Shu or Zhuge Liang; a horse in the courtyard.",
  },
  "sanguo-036": {
    coreKey:
      "Farewell by the woods: Liu Bei reins in his horse by the woods, gazing with " +
      "tearful eyes and raising his whip to point at the trees, and Xu Shu and his " +
      "attendants ride off into the distance, half hidden behind the trees",
    groundTruth:
      "Chapter 36, \"Xuande Uses a Stratagem to Take Fancheng by Surprise; Yuanzhi Rides " +
      "Back to Recommend Zhuge\". Xuande accompanies him one stretch of road after " +
      "another; \"Xuande sat his horse by the woods, watching Xu Shu ride hurriedly away " +
      "with his attendants\", \"gazing after him with tears in his eyes, until a stretch " +
      "of woods cut off his view\", and \"Xuande pointed with his whip and said: 'I wish " +
      "to cut down every tree here'\". For Xu Shu's attire, see Chapter 35: \"a " +
      "kudzu-cloth headscarf and a cloth robe, a black sash and black shoes\".",
    evaluationCriteria:
      "Full credit: In the foreground on the left of the frame Liu Bei reins in his horse " +
      "and stands by the woods, gazing with tearful eyes and raising his whip to point at " +
      "the trees; far off on the right of the frame Xu Shu, in a kudzu-cloth headscarf " +
      "and cloth robe, rides off into the distance with his attendants, half hidden " +
      "behind the trees; behind Liu Bei his officers and men look sorrowful. Deductions: " +
      "Chopping with axes or felled trees; Liu Bei collapsing in tears; Xu Shu in " +
      "official dress or wearing a sword; Zhuge Liang or a thatched cottage.",
  },
  "sanguo-anim-025": {
    coreKey:
      "Guan Yu charging the lines on Red Hare and Yan Liang about to ask beneath his " +
      "canopy, with animated banners, hoof dust, and beard, robe, mane, and tail",
    groundTruth:
      "Chapter 25, \"Encamped on the Earthen Hill, Lord Guan Sets Three Conditions; " +
      "Relieving Baima, Cao Cao Breaks the Siege\". Cao Cao watches the battle lines from " +
      "the earthen hill; Lord Guan, \"holding the Green Dragon Blade upside down, " +
      "galloped down the hill\", \"his phoenix eyes wide open, his silkworm brows " +
      "standing straight up\", charging straight at Yan Liang's command canopy; Yan " +
      "Liang, in embroidered robe and gold armor, \"sat his horse, blade in hand\", and " +
      "\"just as he was about to ask\", Guan Yu was already upon him.",
    evaluationCriteria:
      "Full credit: In the center of the frame Guan Yu, phoenix eyes wide open, holding " +
      "the Green Dragon Blade upside down, rides Red Hare down the earthen hill, on the " +
      "right of the frame Yan Liang, in embroidered robe and gold armor, holds his blade " +
      "beneath the canopy and banners, about to ask, and far off at the upper left of " +
      "the frame Cao Cao and his generals look on; the banners, the hoof dust, and the " +
      "beard, robe, mane, and tail loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Stabbing him off his horse, beheading, or blood shown; the figures or " +
      "the horses drifting as a whole; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "sanguo-anim-026": {
    coreKey:
      "Guan Yu hanging up his seal and sealing away the gold, with animated seal ribbon, " +
      "hall-door curtain, and long beard and carriage curtain",
    groundTruth:
      "Chapter 26, \"Yuan Benchu Is Defeated, Losing Troops and Generals; Guan Yunchang " +
      "Hangs Up His Seal and Seals Away the Gold\". Lord Guan \"took the gold and silver " +
      "he had received time after time, sealed it all away item by item in the " +
      "storehouse, hung the seal of the Marquis of Hanshou Precinct in the hall, and " +
      "asked the two ladies to get into the carriage\"; riding out of the north gate " +
      "with his blade held crosswise comes after this.",
    evaluationCriteria:
      "Full credit: At the upper left of the frame the seal hangs beneath the beam, in " +
      "the center of the frame Guan Yu stands beside the table gazing up at the hanging " +
      "seal, the letter on the table already sealed, at the lower right of the frame the " +
      "gold is sealed in a wooden chest, and on the right of the frame the carriage and " +
      "retinue wait outside the gate; the seal ribbon, the curtain, and the long beard " +
      "and carriage curtain loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Guan Yu holding his blade and shouting angrily; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-027": {
    coreKey:
      "Guan Yu lifting the robe on his blade tip on the bridge, with animated brocade " +
      "robe hem, long beard, mane, and tail, and ripples under the bridge",
    groundTruth:
      "Chapter 27, \"The Lord of the Fine Beard Rides Alone for a Thousand Li; The " +
      "Marquis of Hanshou Slays Six Generals at Five Passes\". Cao Cao orders his " +
      "generals to \"line up to the left and right\", and Lord Guan, \"seeing that none " +
      "of them had weapons in hand, at last set his mind at ease\"; without dismounting, " +
      "he \"lifted the brocade robe on the tip of the Green Dragon Blade and threw it " +
      "over his shoulders\". The original text calls it only \"the bridge\".",
    evaluationCriteria:
      "Full credit: On the right of the frame, in the middle of the bridge, Guan Yu, on " +
      "Red Hare and without dismounting, lifts the brocade robe on the tip of his blade, " +
      "not yet putting it on, in the center of the frame a dismounted officer hands up " +
      "the robe, and on the left of the frame, at the bridgehead, Cao Cao reins in his " +
      "horse and his generals line up without weapons; the brocade robe, the long beard, " +
      "mane, and tail, and the ripples loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Guan Yu dismounting, or the blade tip pointing at Cao Cao; the " +
      "figures or the horses drifting as a whole; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "sanguo-anim-028": {
    coreKey:
      "Zhang Fei thrusting out his spear and shouting curses and Guan Yu explaining " +
      "himself empty-handed, with animated spear tassel and tiger whiskers, carriage " +
      "curtain, and army banners",
    groundTruth:
      "Chapter 28, \"Beheading Cai Yang, the Brothers Dispel Their Doubts; Meeting at the " +
      "Old City, Lord and Vassals Unite in Righteousness\". Lord Guan \"handed his blade " +
      "to Zhou Cang to take, and spurred his horse forward to meet him\"; Zhang Fei, \"his " +
      "round eyes glaring wide, his tiger whiskers standing on end, roaring like thunder, " +
      "swung his spear and thrust at Lord Guan\"; Lord Guan dodges, and the two exchange " +
      "words; Lord Guan asks Zhang Fei to ask his sisters-in-law himself, and the two " +
      "ladies \"lifted the curtain and called out\".",
    evaluationCriteria:
      "Full credit: On the right of the frame Zhang Fei, round-eyed, his tiger whiskers " +
      "standing on end, thrusts his spear straight at Guan Yu and shouts curses, in the " +
      "center of the frame Guan Yu, empty-handed on Red Hare, reins in his horse and " +
      "explains himself, at the lower left of the frame Zhou Cang holds the blade, and " +
      "on the left of the frame Lady Gan lifts the curtain; the spear tassel and tiger " +
      "whiskers, the carriage curtain, and the army banners loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Guan Yu holding a blade; the spear striking home, " +
      "or blood shown; the figures or the horses drifting as a whole; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-029": {
    coreKey:
      "Sun Ce on the altar, hand on his sword and face changing color, and Yu Ji being " +
      "helped down from the pyre, with animated lingering smoke, ripples in the standing " +
      "water, and banners and robe corner",
    groundTruth:
      "Chapter 29, \"The Little Conqueror Angrily Beheads Yu Ji; The Green-Eyed Boy Takes " +
      "Command of Jiangdong\". Yu Ji prays for rain, and \"in an instant the streets " +
      "became rivers\"; \"the officials and the common people together helped Yu Ji down " +
      "from the pyre and untied his ropes\"; Sun Ce sees officials and commoners bowing " +
      "all around in the water and flies into a rage.",
    evaluationCriteria:
      "Full credit: On the right of the frame, on the altar, Sun Ce, his cheek wrapped in " +
      "silk, puts his hand on his sword without drawing it, his face changing color in " +
      "sudden anger, in the center of the frame the crowd helps Yu Ji down from the pyre " +
      "and unties his ropes, and at the lower left of the frame officials and commoners " +
      "bow all around in the standing water; the lingering smoke, the ripples, and the " +
      "banners and robe corner loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Burning a person, beheading, or blood shown; Yu Ji in an eight-trigram Taoist " +
      "robe; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "sanguo-anim-030": {
    coreKey:
      "Fire breaking out at Wuchao in the fourth watch and Cao Cao reining in his horse " +
      "in the middle, with animated flames, thick smoke, and banners and horse mane",
    groundTruth:
      "Chapter 30, \"Fighting at Guandu, Benchu Is Defeated; Raiding Wuchao, Mengde Burns " +
      "the Grain\". Cao's army \"carried the banners of Yuan's army\", \"the men with " +
      "gags in their mouths, the horses with their mouths bound\"; in the fourth watch " +
      "\"Cao had the soldiers set the bundled straw alight all around\", and fire " +
      "breaks out on all sides of the grain stores; Zhang Liao and Xu Chu are at the " +
      "front.",
    evaluationCriteria:
      "Full credit: At night, on the right of the frame flames rise on all sides around " +
      "the grain stores and thick smoke hides the stars, in the center of the frame Cao " +
      "Cao reins in his horse in the middle, at the lower right of the frame Xu Chu and " +
      "Zhang Liao are at the front, and on the left of the frame Cao's soldiers carry " +
      "bundles of straw on their backs and hold gags in their mouths; the flames, the " +
      "thick smoke, and the banners and horse mane loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Fighting or blood shown; fire arrows or explosions; the " +
      "figures or the horses drifting as a whole; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "sanguo-anim-031": {
    coreKey:
      "Yuan Shang galloping before the lines with two blades to show off his prowess and " +
      "Cao Cao pointing and asking, with animated gate banners, hoof dust, and manes, " +
      "tails, and long beard",
    groundTruth:
      "Chapter 31, \"Cao Cao Defeats Benchu at Cangting; Xuande Takes Refuge with Liu " +
      "Biao in Jingzhou\". The two armies come out in battle array, and \"Yuan Shang, " +
      "wishing to show off his prowess before his father, whirled his two blades, " +
      "spurred his horse out of the ranks, and galloped back and forth\"; Cao Cao points " +
      "and asks, \"Who is this?\"; Shi Huan riding out to fight, and being struck by an " +
      "arrow and falling from his horse, come after this.",
    evaluationCriteria:
      "Full credit: In the center of the frame Yuan Shang, whirling a blade in each hand, " +
      "spurs his horse and gallops, on the left of the frame Cao Cao sits his horse, " +
      "pointing and asking, and on the right of the frame Yuan Shao sits his horse with " +
      "his eyes fixed on Yuan Shang; the gate banners, the hoof dust, and the manes, " +
      "tails, and long beard loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Shi Huan struck by an arrow and falling from his horse, or blood shown; the " +
      "figures or the horses drifting as a whole; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "sanguo-anim-032": {
    coreKey:
      "Breaching the Zhang River to flood the city and Xu You pointing at the water, " +
      "with animated advancing Zhang River water, flags, beard, and sleeves, and torches " +
      "and wisps of smoke",
    groundTruth:
      "Chapter 32, \"Fighting over Jizhou, Yuan Shang Contends for Mastery; Breaching the " +
      "Zhang River, Xu You Offers a Plan\". Xu You proposes to \"breach the Zhang River " +
      "and flood the city with its water\"; Cao's army digs through the night, and \"by " +
      "daybreak it was twenty feet wide and deep, and the Zhang River water was led in " +
      "to flood the city, several feet deep\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the encircling trench leads the Zhang " +
      "River water surging toward the foot of the wall, on the left of the frame, on the " +
      "trench bank, Xu You raises his hand to point at the water, with Cao Cao beside " +
      "him, and on the right of the frame Shen Pei, on the city wall, looks down at the " +
      "water; the Zhang River water, the flags, beard, and sleeves, and the torches and " +
      "wisps of smoke loop smoothly, driven by SMIL or inline CSS. Deductions: A flood " +
      "swallowing the city, or floating corpses; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-033": {
    coreKey:
      "Cao Cao opening and reading Guo Jia's last letter before the coffin, with " +
      "animated lamp flame, plain white curtain, and paper edges and long beard",
    groundTruth:
      "Chapter 33, \"Cao Pi Takes Lady Zhen Amid the Chaos; Guo Jia's Posthumous Plan " +
      "Settles Liaodong\". Cao Cao weeps and offers sacrifice to Guo Jia, and those " +
      "around him present the sealed letter Guo Jia left on his deathbed; \"Cao opened " +
      "the letter and read it, nodding and sighing\", and \"none of the others knew what " +
      "he meant\".",
    evaluationCriteria:
      "Full credit: In the center of the frame Cao Cao, holding the opened paper letter, " +
      "nods and sighs, on the right of the frame the attendant stands bowing and the " +
      "officials look puzzled, and on the left of the frame a corner of the coffin is " +
      "half hidden by a plain white curtain; the lamp flame, the plain white curtain, " +
      "and the paper edges and long beard loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The body, or an opened coffin; a white face on Cao Cao; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-034": {
    coreKey:
      "Dilu surging up out of the stream toward the west bank and Liu Bei lashing his " +
      "whip and crying out, with animated spray, mane, tail, and robe hem, and dust cloud",
    groundTruth:
      "Chapter 34, \"Lady Cai Overhears a Secret Talk from Behind the Screen; Imperial " +
      "Uncle Liu Leaps His Horse Across the Tan Stream\". The Tan Stream was \"dozens of " +
      "feet wide\", \"its current very swift\"; Xuande \"lashed his whip and cried " +
      "out\", and \"the horse suddenly surged up out of the water, leapt thirty feet in " +
      "one bound, and flew up onto the west bank\". Dilu \"had a white spot at the edge " +
      "of its forehead\".",
    evaluationCriteria:
      "Full credit: In the center of the frame Dilu, with a white spot on its forehead, " +
      "surges up out of the stream and flies toward the west bank on the right of the " +
      "frame, Liu Bei, his robe wet, leans forward, lashes his whip, and cries out, and " +
      "far off on the left of the frame a dust cloud rises; the spray, the mane, tail, " +
      "and robe hem, and the dust cloud loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A dragon form; Liu Bei drawing a sword; the figure or the horse " +
      "drifting as a whole; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "sanguo-anim-035": {
    coreKey:
      "Water Mirror welcoming him with a smile and Liu Bei, his clothes wet, looking " +
      "back, with animated pines and bamboo, homing birds, and sleeves and front of the " +
      "clothes",
    groundTruth:
      "Chapter 35, \"Xuande Meets a Recluse at Nanzhang; Shan Fu Meets a Heroic Lord at " +
      "Xinye\". Liu Bei \"inclined his ear to listen\"; the zither music suddenly stops, " +
      "and Sima Hui (Water Mirror) comes out smiling; Xuande, \"the front of his clothes " +
      "still wet\", looks at him: \"with the form of a pine and the bones of a crane, of " +
      "extraordinary bearing\"; the sun is about to set in the west.",
    evaluationCriteria:
      "Full credit: On the right of the frame Sima Hui, with the form of a pine and the " +
      "bones of a crane, comes out smiling in welcome, with a zither on the stone couch " +
      "in the thatched hall, on the left of the frame Liu Bei, the front of his clothes " +
      "half wet, turns to look toward Sima Hui, and the herd boy points at Sima Hui; the " +
      "pines and bamboo, the homing birds, and the sleeves and front of the clothes loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Musical notes or sound waves; " +
      "Sima Hui with a feather fan; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-036": {
    coreKey:
      "Liu Bei by the woods raising his whip as he watches Xu Shu ride away, with " +
      "animated treetops, dust behind the hooves, and sashes, mane, and tail",
    groundTruth:
      "Chapter 36, \"Xuande Uses a Stratagem to Take Fancheng by Surprise; Yuanzhi Rides " +
      "Back to Recommend Zhuge\". \"Xuande sat his horse by the woods, watching Xu Shu " +
      "ride hurriedly away with his attendants\", \"gazing after him with tears in his " +
      "eyes, until a stretch of woods cut off his view\", and \"Xuande pointed with his " +
      "whip and said: 'I wish to cut down every tree here'\".",
    evaluationCriteria:
      "Full credit: In the foreground on the left of the frame Liu Bei reins in his horse " +
      "by the woods, gazing with tearful eyes and raising his whip to point at the " +
      "trees, and far off on the right of the frame Xu Shu and his attendants ride off " +
      "into the distance, half hidden behind the trees; the treetops, the dust, and the " +
      "sashes, mane, and tail loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Chopping with axes or felled trees; Xu Shu in official dress or wearing a sword; " +
      "the figures or the horses drifting as a whole; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
};
