/**
 * 《三国演义》第 109–120 回候选的英文标签与英文评判标准，由
 * src/core/classics/sanguo/ch109-120.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SANGUO_CH109_120_LABELS_EN: Readonly<Record<string, string>> = {
  "sanguo-109": "Ch. 109 · Praying at the Spring on Mount Tielong",
  "sanguo-110": "Ch. 110 · Wen Yang's Lone Ride Drives Back the Host",
  "sanguo-111": "Ch. 111 · Deng Ai's Banner on Mount Wucheng",
  "sanguo-112": "Ch. 112 · Jiang Wei Fights Deng Zhong",
  "sanguo-113": "Ch. 113 · The Long-Snake Coiling Formation",
  "sanguo-114": "Ch. 114 · The Grain Carts Catch Fire in Tanshan Valley",
  "sanguo-115": "Ch. 115 · Jiang Wei's Tearful Plea in the Rear Garden",
  "sanguo-116": "Ch. 116 · Zhong Hui Dreams of Kongming in His Tent",
  "sanguo-117": "Ch. 117 · Deng Ai Rolls Down Wrapped in Felt",
  "sanguo-118": "Ch. 118 · The Later Lord Surrenders Bound",
  "sanguo-119": "Ch. 119 · Weeping, Cup in Hand, at the Lantern Festival Banquet",
  "sanguo-120": "Ch. 120 · Torches Burn Through the River Chains",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SANGUO_CH109_120_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "sanguo-109": {
    coreKey:
      "By the spring on the summit of Mount Tielong: Sima Zhao has knelt, bowed, and " +
      "finished his prayer, the spring water gushes out, the registrar Wang Tao stands " +
      "in attendance behind him to one side, and the Shu camps below the mountain " +
      "hold it under siege",
    groundTruth:
      "Chapter 109, \"Trapping Sima, a Han General Uses an Ingenious Plan; Deposing " +
      "Cao Fang, the House of Wei Meets Retribution\". On the mountain \"there was " +
      "only one spring, enough for only a hundred men to drink\"; following Wang " +
      "Tao's advice, Sima Zhao \"went up to the spring on the mountaintop, bowed " +
      "twice, and prayed\", and \"when the prayer was done, the spring water gushed " +
      "out, and however much was drawn it never ran dry\". The \"cut my own throat\" " +
      "in the prayer is only the wording of an oath; the growth beneath his eye " +
      "belongs to Sima Shi.",
    evaluationCriteria:
      "Full credit: Sheer cliffs on the mountaintop, right of center in the frame " +
      "water gushes from the spring among the rocks, in the center of the frame Sima " +
      "Zhao, armored, kneels and bows facing the spring, on the left of the frame " +
      "Wang Tao, in a wide robe and cap, stands behind him to one side, and far off " +
      "at the bottom of the frame the banners of the Shu camps. Deductions: Sima " +
      "Zhao with the growth beneath his eye; drawing a sword or cutting his own " +
      "throat; an incense table or offering table; rain or snow; Chinese opera face " +
      "paint or opera back flags.",
  },
  "sanguo-110": {
    coreKey:
      "By Lejia Bridge: Wen Yang, eighteen years old and in full armor, steel " +
      "whip-mace in hand, reins in his horse and rides on slowly, and the Wei " +
      "generals he has driven back gather in one place in amazement",
    groundTruth:
      "Chapter 110, \"Wen Yang Drives Back a Mighty Host Riding Alone; Jiang Wei, His " +
      "Back to the River, Defeats a Great Enemy\". Wen Yang \"was just eighteen years " +
      "old: eight feet tall, in full armor, with a steel whip-mace hanging at his " +
      "waist\"; after he wheels his horse by the bridge and charges the enemy ranks, " +
      "and the Wei generals fall back wherever his steel whip-mace rises, \"Wen Yang " +
      "again rode on slowly\", and \"the Wei generals gathered in one place and said " +
      "in amazement\". Wheeling his horse to charge and slay once more comes later.",
    evaluationCriteria:
      "Full credit: A wooden bridge spans the river, on the left of the frame at the " +
      "bridgehead the young Wen Yang, in full armor, steel whip-mace in hand, reins " +
      "in his horse and rides on slowly, and on the right of the frame the Wei " +
      "generals gather in a crowd in amazement, not yet giving chase. Deductions: " +
      "Wen Yang holding a long spear, in white robe with silver spear, or with twin " +
      "whip-maces, a four-edged mace, or a hammer; any warhorse with paired " +
      "stirrups; men fallen from their horses, corpses, or blood shown; Deng Ai or " +
      "Sima Shi; a stone arch bridge; snow.",
  },
  "sanguo-111": {
    coreKey:
      "Before Mount Wucheng: on the mountain drums and horns sound together and " +
      "banners stand everywhere, a yellow flag in the center is inscribed in large " +
      "characters \"Deng Ai\", and below the mountain Jiang Wei and Xiahou Ba rein in " +
      "their horses in alarm and doubt",
    groundTruth:
      "Chapter 111, \"Deng Shizai Outwits Jiang Boyue; Zhuge Dan Righteously " +
      "Campaigns Against Sima Zhao\". On reaching Mount Wucheng, \"suddenly a signal " +
      "bomb went off on the mountain, a great shout shook the air, and drums and " +
      "horns sounded together\", and \"banners stood everywhere, all of them Wei " +
      "troops: in the center a yellow flag fluttered out in the wind, inscribed in " +
      "large characters 'Deng Ai'\". The Wei troops charging down come later.",
    evaluationCriteria:
      "Full credit: On the mountainside on the right of the frame Wei soldiers stand " +
      "in ranks, beating drums and blowing horns, with banners standing everywhere, " +
      "in the center of the summit a yellow flag inscribed \"Deng Ai\", and at the " +
      "lower left of the frame Jiang Wei with his spear and Xiahou Ba with his blade " +
      "ride side by side, looking up in alarm and doubt, with the Shu soldiers " +
      "behind them. Deductions: Deng Ai himself drawn; cannon barrels, cannon " +
      "flashes, or gunpowder smoke; Wei troops charging down, or dead and wounded; a " +
      "long-snake formation; snow.",
  },
  "sanguo-112": {
    coreKey:
      "Outside the walls of Changcheng: Jiang Wei and the young general Deng Zhong, " +
      "his face as if powdered and his lips as if daubed with vermilion, meet horse " +
      "to horse, their two spears thrusting at each other, with neither yet gaining " +
      "the upper hand",
    groundTruth:
      "Chapter 112, \"Rescuing Shouchun, Yu Quan Dies for His Loyalty; Taking " +
      "Changcheng, Boyue Fights a Fierce Battle\". The young general in the Wei " +
      "ranks is \"in full armor and belt\", \"some twenty-odd years old, his face as " +
      "if powdered and his lips as if daubed with vermilion\"; this is Deng Zhong, " +
      "whom Jiang Wei mistakes for Deng Ai; \"they fought thirty or forty bouts with " +
      "neither gaining the upper hand\". The backward shot, the gripping of the spear " +
      "under the arm, and Deng Ai riding out of the ranks with his blade come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Jiang Wei levels his spear, on the " +
      "right of the frame Deng Zhong, young, white-faced and red-lipped, in full " +
      "armor, levels his spear, and the two horses meet, the two spears thrusting at " +
      "each other without striking home. Deductions: Deng Zhong drawn as an older " +
      "general; Deng Ai; Jiang Wei drawing his bow to shoot backward; blood shown; a " +
      "close-up siege or blazing piles of firewood below the walls; the walls of the " +
      "Great Wall.",
  },
  "sanguo-113": {
    coreKey:
      "Contesting formations before Mount Qi: Jiang Wei waves his flag, the Shu army " +
      "changes into the Long-Snake Coiling Formation and surrounds Deng Ai layer " +
      "upon layer, and Deng Ai, at its center, reins in his horse in great alarm",
    groundTruth:
      "Chapter 113, \"Ding Feng Lays a Plan and Beheads Sun Chen; Jiang Wei Contests " +
      "Formations and Defeats Deng Ai\". \"Jiang Wei reached the middle and waved his " +
      "flag, and suddenly it changed into the 'Long-Snake Coiling Formation', " +
      "trapping Deng Ai at its center\"; \"Deng Ai did not know this formation and " +
      "was greatly alarmed at heart\", and \"Deng Ai led his generals in charges but " +
      "could not break out\". Sima Wang fighting his way in to rescue him comes " +
      "later.",
    evaluationCriteria:
      "Full credit: On the open plain the Shu army coils into multiple rings, on the " +
      "left of the frame Jiang Wei, on horseback, holds a command flag high, and in " +
      "the center of the frame Deng Ai reins in his horse in great alarm while the " +
      "Wei generals charge but cannot break out. Deductions: An Eight Trigrams " +
      "diagram on the ground, talismans, or smoke and supernatural beings; Sima Wang " +
      "fighting his way in; casualties or blood shown; snow.",
  },
  "sanguo-114": {
    coreKey:
      "Tanshan Valley on a moonlit night: the grain carts under blue cloth burst into " +
      "flames all at once, Fu Qian spurs his horse out of the woods with a great " +
      "shout, and Deng Ai, helmet and armor in good order, reins his horse around in " +
      "alarm",
    groundTruth:
      "Chapter 114, \"Cao Mao Drives His Carriage and Dies at the Southern Gate " +
      "Tower; Jiang Wei Abandons His Grain and Defeats the Wei Troops\". On the " +
      "fifteenth day of the eighth month, \"it was then the first watch, and the moon " +
      "was as bright as day\"; the grain carts are \"covered with blue cloth\", " +
      "\"suddenly a band of troops burst out of the woods, led by the Shu general Fu " +
      "Qian, who spurred his horse and shouted loudly\", and \"the carts were all " +
      "ablaze\". Deng Ai throwing off his armor and helmet and fleeing on foot comes " +
      "later; the Mao Zonggang edition has no sulfur or saltpeter.",
    evaluationCriteria:
      "Full credit: A bright moon hangs in the sky, on the right of the frame the " +
      "grain carts under blue cloth burst into flames in a mass, on the left of the " +
      "frame Fu Qian, spear leveled, spurs his horse out of the woods, and in the " +
      "center of the frame Deng Ai, helmet and armor in good order, reins in his " +
      "horse and stares in alarm. Deductions: Deng Ai throwing off his armor and " +
      "helmet, or on foot; sulfur and saltpeter, or gunpowder explosions; dead and " +
      "wounded, or blood; Jiang Wei or Xiahou Ba.",
  },
  "sanguo-115": {
    coreKey:
      "Below the pavilion in the rear garden at Chengdu: Jiang Wei kowtows and begs " +
      "that Huang Hao be executed, the Later Lord, at his banquet in the pavilion, " +
      "smiles and refuses, and Huang Hao still hides beside the rockery",
    groundTruth:
      "Chapter 115, \"Recalling the Army by Edict, the Later Lord Believes Slander; " +
      "Pleading Military Farming, Jiang Wei Avoids Disaster\". The Later Lord is " +
      "feasting with Huang Hao in the rear garden, and \"Huang Hao hastily hid beside " +
      "the rockery\"; the Later Lord, smiling, calls Huang Hao \"a petty servant who " +
      "runs errands\", and \"Jiang Wei kowtowed and said: 'If Your Majesty does not " +
      "kill Huang Hao today, disaster is not far off.'\" Summoning Huang Hao to come " +
      "out, weep, and bow comes later.",
    evaluationCriteria:
      "Full credit: In the center of the frame the Later Lord sits on his mat in the " +
      "pavilion, smiling, on the left of the frame Jiang Wei prostrates himself and " +
      "kowtows, and on the right of the frame Huang Hao hides behind the rockery. " +
      "Deductions: Huang Hao coming out to kneel and bow; a horsetail whisk or white " +
      "opera face paint; the Later Lord in a beaded imperial crown and dragon robe, " +
      "or on a dragon throne; Jiang Wei in armor or with opera back flags; snow or " +
      "flowers.",
  },
  "sanguo-116": {
    coreKey:
      "Night in a tent of the Wei camp: Zhong Hui sleeps slumped over his low table, " +
      "not yet awake, and as a cool breeze passes, Kongming, in silk scarf cap with " +
      "feather fan and in crane-feather cloak, walks into the tent",
    groundTruth:
      "Chapter 116, \"Zhong Hui Divides His Troops on the Hanzhong Roads; Marquis Wu " +
      "Manifests His Spirit at Mount Dingjun\". \"That night Zhong Hui was sleeping " +
      "slumped over his low table in his tent, when suddenly a cool breeze passed\", " +
      "\"and he saw a man in silk scarf cap and with feather fan, dressed in a " +
      "crane-feather cloak, with plain shoes and a black sash, his face like " +
      "flawless jade\", and \"the man walked into the tent\". Zhong Hui rising to " +
      "greet him and ask who he is, and waking with a start, come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Zhong Hui sleeps soundly slumped over " +
      "his low table, and on the right of the frame Kongming, in silk scarf cap with " +
      "feather fan, crane-feather cloak, plain shoes, and black sash, walks into the " +
      "tent on foot. Deductions: Kongming in an Eight Trigrams robe, with a halo, or " +
      "floating; Kongming riding in a carriage; Zhong Hui already awake or rising; a " +
      "weapon rack; rain or snow.",
  },
  "sanguo-117": {
    coreKey:
      "The western slope of Motian Ridge: Deng Ai, his body wrapped in a felt " +
      "blanket, is first to roll down the steep cliff, the weapons have already been " +
      "thrown to the foot of the slope, and Deng Zhong and the lieutenant generals " +
      "remain on the clifftop, not yet moving",
    groundTruth:
      "Chapter 117, \"Deng Shizai Secretly Crosses Yinping; Zhuge Zhan Dies in Battle " +
      "at Mianzhu\". \"The horses could not go on, and Deng Ai climbed the ridge on " +
      "foot\"; \"Deng Ai ordered the weapons to be thrown down first. Deng Ai took a " +
      "felt blanket, wrapped himself in it, and rolled down first.\" The lieutenant " +
      "generals who had felt coats wrapping themselves and rolling down, and those " +
      "without felt coats tying ropes around themselves and climbing down by the " +
      "trees, come later.",
    evaluationCriteria:
      "Full credit: On the steep slope in the center of the frame Deng Ai, his whole " +
      "body wrapped in a felt blanket into a roll, tumbles down, at the lower left of " +
      "the frame weapons lie scattered at the foot of the slope, and at the upper " +
      "right of the frame Deng Zhong, the lieutenant generals, and the soldiers " +
      "stand still on the clifftop, not yet moving. Deductions: Lieutenant generals " +
      "rolling down wrapped in felt, or climbing down the cliff by the trees; " +
      "warhorses; fighting, or dead and wounded; the stone tablet of Marquis Wu; " +
      "snow or rain.",
  },
  "sanguo-118": {
    coreKey:
      "Ten li outside the north gate of Chengdu: the Later Lord comes out to " +
      "surrender with hands bound behind, Deng Ai helps him up and unties his bonds " +
      "himself, a coffin carried on a cart stands to one side, not yet burned, and " +
      "the ministers stand behind",
    groundTruth:
      "Chapter 118, \"Weeping at the Ancestral Temple, a Prince Dies for Filial " +
      "Piety; Entering Xichuan, Two Officers Contend for Merit\". \"The Later Lord " +
      "led the crown prince, the princes, and more than sixty ministers, hands bound " +
      "behind and with a coffin carried on a cart, out ten li beyond the north gate " +
      "to surrender\"; \"Deng Ai helped the Later Lord up and untied his bonds " +
      "himself\". Burning the coffin and its cart and riding into the city in the " +
      "same carriage come later; the Mao Zonggang edition does not mention holding a " +
      "jade disc in the mouth.",
    evaluationCriteria:
      "Full credit: In the center of the frame the Later Lord, in plain clothes with " +
      "hands bound behind, is being helped up, on the right of the frame Deng Ai, in " +
      "military dress, supports him with one hand and unties the rope with the " +
      "other, and on the left of the frame the cart with the plain coffin stands " +
      "unburned and the ministers bow their heads. Deductions: Holding a jade disc " +
      "in the mouth or leading a sheep; burning the coffin, or fire; a welcome into " +
      "the city; the Later Lord in a beaded imperial crown and dragon robe; Liu " +
      "Chen, or blood shown; snow.",
  },
  "sanguo-119": {
    coreKey:
      "The Lantern Festival night banquet in the old palace at Chengdu: lamplight " +
      "fills the hall, Zhong Hui and Jiang Wei weep aloud, cups in hand, and the " +
      "generals on both sides pause with their cups and ask in alarm",
    groundTruth:
      "Chapter 119, \"A Feigned Surrender, the Clever Plan Comes to Nothing; A Second " +
      "Abdication, the Gourd Is Drawn After the Same Pattern\". \"The next day was " +
      "the Lantern Festival; lamps were lit in profusion in the old palace, and the " +
      "generals were invited to a banquet\"; \"after several rounds of wine, he wept " +
      "aloud, cup in hand. The generals asked in alarm what the reason was.\" " +
      "Reading out the posthumous edict, drawing swords, and signing names come " +
      "later; Zhong Hui says of himself, \"I am not yet forty\".",
    evaluationCriteria:
      "Full credit: Lamplight fills the hall, in the center of the frame, in the " +
      "seat of honor, Zhong Hui weeps aloud, cup in hand, close by on the right " +
      "Jiang Wei, his hair and beard grizzled, weeps with him, cup in hand, and on " +
      "both sides the generals kneel at their tables, pausing with their cups, " +
      "dumbfounded. Deductions: An edict scroll; a drawn sword; a smile on Jiang " +
      "Wei; red paper lanterns or decorative lanterns; dead and wounded, or blood " +
      "shown.",
  },
  "sanguo-120": {
    coreKey:
      "The chains across the great river: great rafts bearing straw men drift " +
      "downstream against the chains, the long torches on the rafts, soaked in oil, " +
      "burn, the linked iron chains glow red and are about to break, and warships " +
      "follow behind",
    groundTruth:
      "Chapter 120, \"Recommending Du Yu, an Old General Offers a New Plan; Sun Hao " +
      "Surrenders and the Three-Way Division Returns to Unity\". Wang Jun builds " +
      "rafts; \"straw was bound into men on them, armored and holding weapons, " +
      "standing all around the edges, and they were sent down with the current\"; " +
      "\"on the rafts torches were made, more than a hundred feet long, soaked with " +
      "sesame oil\", and \"whenever they met iron chains, the torches were lit to " +
      "burn them, and in a moment all were severed\".",
    evaluationCriteria:
      "Full credit: Sheer cliffs on both banks, linked iron chains stretch across " +
      "the river, in the center of the frame great rafts press against the chains, " +
      "around the edges of the rafts straw men stand armored, holding spears and " +
      "halberds, the fierce flames of the long torches burn right against the iron " +
      "chains and the iron links glow red, and far off at the top of the frame " +
      "warships follow. Deductions: Living men steering the rafts; Wu soldiers, " +
      "dead and wounded, or blood shown; iron chains linking ships, fire ships with " +
      "red sails, or giant gold-armored warships; gunpowder explosions or cannons.",
  },
  "sanguo-anim-109": {
    coreKey:
      "Sima Zhao kneeling and bowing by the spring as he finishes his prayer and Wang " +
      "Tao standing in attendance, with animated spring water, flag corners and " +
      "sash, and cooking smoke from the Shu camps",
    groundTruth:
      "Chapter 109, \"Trapping Sima, a Han General Uses an Ingenious Plan; Deposing " +
      "Cao Fang, the House of Wei Meets Retribution\". Sima Zhao \"went up to the " +
      "spring on the mountaintop, bowed twice, and prayed\", and \"when the prayer " +
      "was done, the spring water gushed out, and however much was drawn it never " +
      "ran dry\"; on the mountain \"there was only one spring\". The growth beneath " +
      "his eye belongs to Sima Shi.",
    evaluationCriteria:
      "Full credit: Right of center in the frame water gushes from the spring, in " +
      "the center of the frame Sima Zhao kneels and bows facing the spring, and on " +
      "the left of the frame Wang Tao stands in attendance behind him to one side; " +
      "the spring water, the flag corners and sash, and the cooking smoke loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Sima Zhao with the growth " +
      "beneath his eye; drawing a sword; an incense table; rain or snow; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "sanguo-anim-110": {
    coreKey:
      "Wen Yang, steel whip-mace in hand, reining in his horse and riding on slowly " +
      "and the Wei generals gathered in amazement, with animated manes and tails, " +
      "banners and spear tassels, and river water",
    groundTruth:
      "Chapter 110, \"Wen Yang Drives Back a Mighty Host Riding Alone; Jiang Wei, His " +
      "Back to the River, Defeats a Great Enemy\". Wen Yang \"was just eighteen years " +
      "old: eight feet tall, in full armor, with a steel whip-mace hanging at his " +
      "waist\"; \"Wen Yang again rode on slowly\", and \"the Wei generals gathered in " +
      "one place and said in amazement\". Wheeling his horse to charge and slay once " +
      "more comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame at the bridgehead Wen Yang, in full " +
      "armor, steel whip-mace in hand, reins in his horse and rides on slowly, and on " +
      "the right of the frame the Wei generals gather in amazement; the manes and " +
      "tails, the banners and spear tassels, and the river water loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Wen Yang holding a long spear; any " +
      "warhorse with paired stirrups; men fallen from their horses, or blood shown; " +
      "Deng Ai; the figures or the horses drifting as a whole; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-111": {
    coreKey:
      "The yellow flag inscribed \"Deng Ai\", Wei soldiers beating drums amid banners " +
      "standing everywhere, and Jiang Wei and Xiahou Ba below the mountain in alarm " +
      "and doubt, with animated flags, drumsticks, and manes and tails",
    groundTruth:
      "Chapter 111, \"Deng Shizai Outwits Jiang Boyue; Zhuge Dan Righteously " +
      "Campaigns Against Sima Zhao\". On reaching Mount Wucheng, \"suddenly a signal " +
      "bomb went off on the mountain, a great shout shook the air, and drums and " +
      "horns sounded together\", and \"banners stood everywhere, all of them Wei " +
      "troops: in the center a yellow flag fluttered out in the wind, inscribed in " +
      "large characters 'Deng Ai'\". The Wei troops charging down come later.",
    evaluationCriteria:
      "Full credit: On the mountainside on the right of the frame Wei soldiers beat " +
      "drums amid banners standing everywhere, on the summit a yellow flag inscribed " +
      "\"Deng Ai\", and at the lower left of the frame Jiang Wei and Xiahou Ba ride " +
      "side by side in alarm and doubt; the flags, the drumsticks, and the manes and " +
      "tails loop smoothly, driven by SMIL or inline CSS. Deductions: Deng Ai " +
      "himself; cannon barrels or cannon flashes; Wei troops charging down, or dead " +
      "and wounded; the figures or the horses drifting as a whole; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-112": {
    coreKey:
      "Jiang Wei and the white-faced, red-lipped young general Deng Zhong meeting " +
      "horse to horse, their two spears thrusting at each other, with animated " +
      "banners, manes, tails, and flying dust, and thick smoke over the city wall",
    groundTruth:
      "Chapter 112, \"Rescuing Shouchun, Yu Quan Dies for His Loyalty; Taking " +
      "Changcheng, Boyue Fights a Fierce Battle\". The young general in the Wei " +
      "ranks is \"in full armor and belt\", \"some twenty-odd years old, his face as " +
      "if powdered and his lips as if daubed with vermilion\"; this is Deng Zhong, " +
      "whom Jiang Wei mistakes for Deng Ai; \"they fought thirty or forty bouts with " +
      "neither gaining the upper hand\". The backward shot and the gripping of the " +
      "spear under the arm come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Jiang Wei levels his spear, on the " +
      "right of the frame Deng Zhong, young, white-faced and red-lipped, in full " +
      "armor, levels his spear, and the two horses meet, the two spears thrusting at " +
      "each other without striking home; the gate banners and army banners, the " +
      "manes, tails, and flying dust, and the thick smoke loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Deng Zhong drawn as an older general; Deng " +
      "Ai; blood shown; Jiang Wei drawing his bow; the figures or the horses " +
      "drifting as a whole; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "sanguo-anim-113": {
    coreKey:
      "Jiang Wei holding a command flag high and the Long-Snake Coiling Formation " +
      "surrounding Deng Ai layer upon layer, with animated command flag cloth, " +
      "banners within the formation, and dust kicked up by hooves",
    groundTruth:
      "Chapter 113, \"Ding Feng Lays a Plan and Beheads Sun Chen; Jiang Wei Contests " +
      "Formations and Defeats Deng Ai\". \"Jiang Wei reached the middle and waved his " +
      "flag, and suddenly it changed into the 'Long-Snake Coiling Formation', " +
      "trapping Deng Ai at its center\"; \"Deng Ai did not know this formation and " +
      "was greatly alarmed at heart\". Sima Wang fighting his way in to rescue him " +
      "comes later.",
    evaluationCriteria:
      "Full credit: The Shu army coils into multiple rings, on the left of the frame " +
      "Jiang Wei, on horseback, holds a command flag high, and in the center of the " +
      "frame Deng Ai reins in his horse in great alarm; the command flag cloth, the " +
      "banners, and the flying dust loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: An Eight Trigrams diagram, talismans, or smoke and supernatural " +
      "beings; casualties or blood shown; the figures or the horses drifting as a " +
      "whole; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-114": {
    coreKey:
      "The grain carts bursting into flames, Fu Qian charging out of the woods with " +
      "a great shout, and Deng Ai reining his horse around in alarm, with animated " +
      "cart fires and sparks, thick smoke, and manes and tails, flag corners, and " +
      "leaves",
    groundTruth:
      "Chapter 114, \"Cao Mao Drives His Carriage and Dies at the Southern Gate " +
      "Tower; Jiang Wei Abandons His Grain and Defeats the Wei Troops\". On the " +
      "fifteenth day of the eighth month, \"it was then the first watch, and the moon " +
      "was as bright as day\"; \"suddenly a band of troops burst out of the woods, " +
      "led by the Shu general Fu Qian, who spurred his horse and shouted loudly\", " +
      "and \"the carts were all ablaze\". Deng Ai throwing off his armor and helmet " +
      "and fleeing on foot comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the grain carts burst into flames, on " +
      "the left of the frame Fu Qian, spear leveled, charges out of the woods, and " +
      "in the center of the frame Deng Ai, helmet and armor in good order, reins in " +
      "his horse and stares in alarm; the cart fires and sparks, the thick smoke, " +
      "and the manes and tails, flag corners, and leaves loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Deng Ai throwing off his armor and helmet, or " +
      "on foot; gunpowder explosions; dead and wounded, or blood shown; Jiang Wei or Xiahou " +
      "Ba; the figures or the horses drifting as a whole; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-115": {
    coreKey:
      "Jiang Wei kowtowing below the pavilion and begging that Huang Hao be " +
      "executed, the Later Lord smiling, and Huang Hao hiding behind the rockery, " +
      "with animated leaves and sashes, falling leaves, and teardrops",
    groundTruth:
      "Chapter 115, \"Recalling the Army by Edict, the Later Lord Believes Slander; " +
      "Pleading Military Farming, Jiang Wei Avoids Disaster\". The Later Lord is " +
      "feasting with Huang Hao in the rear garden, and \"Huang Hao hastily hid beside " +
      "the rockery\"; \"Jiang Wei kowtowed and said: 'If Your Majesty does not kill " +
      "Huang Hao today, disaster is not far off.'\" Summoning Huang Hao to come out, " +
      "weep, and bow comes later.",
    evaluationCriteria:
      "Full credit: In the center of the frame the Later Lord sits on his mat in the " +
      "pavilion, smiling, on the left of the frame Jiang Wei prostrates himself and " +
      "kowtows, and on the right of the frame Huang Hao hides behind the rockery; " +
      "the leaves and sashes, the falling leaves, and the teardrops loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Huang Hao coming out to kneel and " +
      "bow; a horsetail whisk; the Later Lord in a beaded imperial crown and dragon " +
      "robe; snow; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "sanguo-anim-116": {
    coreKey:
      "Zhong Hui sleeping soundly slumped over his low table and Kongming, in silk " +
      "scarf cap with feather fan and in crane-feather cloak, walking into the tent, " +
      "with animated tent curtain and lamp flame, sleeves and feather fan, and " +
      "breathing rising and falling",
    groundTruth:
      "Chapter 116, \"Zhong Hui Divides His Troops on the Hanzhong Roads; Marquis Wu " +
      "Manifests His Spirit at Mount Dingjun\". \"That night Zhong Hui was sleeping " +
      "slumped over his low table in his tent, when suddenly a cool breeze passed\", " +
      "\"and he saw a man in silk scarf cap and with feather fan, dressed in a " +
      "crane-feather cloak, with plain shoes and a black sash, his face like " +
      "flawless jade\", and \"the man walked into the tent\". Zhong Hui waking with a " +
      "start comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Zhong Hui sleeps soundly slumped over " +
      "his low table, and on the right of the frame Kongming, in silk scarf cap with " +
      "feather fan, crane-feather cloak, plain shoes, and black sash, walks into the " +
      "tent on foot; the tent curtain and lamp flame, the sleeves and feather fan, " +
      "and the breathing rising and falling loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Kongming in an Eight Trigrams robe, with a halo, or " +
      "floating; Zhong Hui already awake; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-117": {
    coreKey:
      "Deng Ai, wrapped in a felt blanket into a roll, first to roll down the steep " +
      "slope and Deng Zhong and the lieutenant generals not yet moving on the " +
      "clifftop, with animated gravel and dust, clouds and mist, and ropes and " +
      "garment corners",
    groundTruth:
      "Chapter 117, \"Deng Shizai Secretly Crosses Yinping; Zhuge Zhan Dies in Battle " +
      "at Mianzhu\". \"Deng Ai ordered the weapons to be thrown down first. Deng Ai " +
      "took a felt blanket, wrapped himself in it, and rolled down first.\" The " +
      "lieutenant generals who had felt coats wrapping themselves and rolling down, " +
      "and those without felt coats tying ropes around themselves and climbing down " +
      "by the trees, come later.",
    evaluationCriteria:
      "Full credit: On the steep slope in the center of the frame Deng Ai lies with " +
      "his whole body wrapped in a felt blanket into a roll, at the lower left of the " +
      "frame weapons lie at the foot of the slope, and at the upper right of the " +
      "frame Deng Zhong and the soldiers remain on the clifftop, not yet moving; the " +
      "gravel and dust, " +
      "the clouds and mist, and the ropes and garment corners loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: Lieutenant generals already rolled down, " +
      "or climbing down the cliff by the trees; warhorses; the figures or the felt " +
      "roll drifting as a whole; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "sanguo-anim-118": {
    coreKey:
      "The Later Lord, hands bound behind, being helped up by Deng Ai, who unties his " +
      "bonds himself, and the coffin carried on a cart not yet burned, with animated " +
      "robes and hair ribbons, rope ends, and white breath from the horses' nostrils",
    groundTruth:
      "Chapter 118, \"Weeping at the Ancestral Temple, a Prince Dies for Filial " +
      "Piety; Entering Xichuan, Two Officers Contend for Merit\". \"The Later Lord " +
      "led the crown prince, the princes, and more than sixty ministers, hands bound " +
      "behind and with a coffin carried on a cart, out ten li beyond the north gate " +
      "to surrender\"; \"Deng Ai helped the Later Lord up and untied his bonds " +
      "himself\". Burning the coffin and its cart comes later; the Mao Zonggang " +
      "edition does not mention holding a jade disc in the mouth.",
    evaluationCriteria:
      "Full credit: In the center of the frame the Later Lord, in plain clothes with " +
      "hands bound behind, is being helped up, on the right of the frame Deng Ai, in " +
      "military dress, supports him with one hand and unties the rope with the " +
      "other, and on the left of the frame the cart with the plain coffin stands " +
      "unburned and the ministers bow their heads; the robes and hair ribbons, the " +
      "rope ends, and the white breath from the horses' nostrils loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Holding a jade disc in the mouth; " +
      "burning the coffin; the Later Lord in a beaded imperial crown and dragon " +
      "robe; the figures or the horses drifting as a whole; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-119": {
    coreKey:
      "Zhong Hui and Jiang Wei weeping aloud, cups in hand, at the Lantern Festival " +
      "banquet and the generals pausing with their cups, dumbfounded, with animated lamp " +
      "flames and their shadows, teardrops, and drapes and sleeves",
    groundTruth:
      "Chapter 119, \"A Feigned Surrender, the Clever Plan Comes to Nothing; A Second " +
      "Abdication, the Gourd Is Drawn After the Same Pattern\". \"The next day was " +
      "the Lantern Festival; lamps were lit in profusion in the old palace, and the " +
      "generals were invited to a banquet\"; \"after several rounds of wine, he wept " +
      "aloud, cup in hand. The generals asked in alarm what the reason was.\" " +
      "Reading out the posthumous edict and drawing swords come later.",
    evaluationCriteria:
      "Full credit: Lamplight fills the hall, in the center of the frame, in the " +
      "seat of honor, Zhong Hui weeps aloud, cup in hand, close by on the right " +
      "Jiang Wei weeps with him, cup in hand, and on both sides the generals pause " +
      "with their cups, dumbfounded; the lamp flames and their shadows, the teardrops, " +
      "and the drapes and sleeves loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: An edict scroll; a drawn sword; red paper lanterns or decorative " +
      "lanterns; whole figures drifting; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
  "sanguo-anim-120": {
    coreKey:
      "Great rafts bearing straw men pressing against the chains and long torches " +
      "burning right against the iron chains as they are about to break, with " +
      "animated fierce flames and sparks, red glow of the iron links, and white " +
      "waves and streamers",
    groundTruth:
      "Chapter 120, \"Recommending Du Yu, an Old General Offers a New Plan; Sun Hao " +
      "Surrenders and the Three-Way Division Returns to Unity\". Wang Jun builds " +
      "rafts; \"straw was bound into men on them, armored and holding weapons, " +
      "standing all around the edges, and they were sent down with the current\"; " +
      "\"on the rafts torches were made, more than a hundred feet long, soaked with " +
      "sesame oil\", and \"whenever they met iron chains, the torches were lit to " +
      "burn them, and in a moment all were severed\".",
    evaluationCriteria:
      "Full credit: Linked iron chains stretch across the river, in the center of " +
      "the frame great rafts press against the chains, around the edges of the " +
      "rafts straw men stand armored, holding spears and halberds, the fierce flames " +
      "of the long torches burn right against the iron chains, and far off at the " +
      "top of the frame warships follow; the fierce flames and sparks, the red glow " +
      "of the iron links, and the white waves and streamers loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Living men steering the rafts; blood shown; " +
      "the rafts or the straw men drifting as a whole; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
};
