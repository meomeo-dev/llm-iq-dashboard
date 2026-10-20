/**
 * 《水浒传》第 61–72 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch061-072.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH061_072_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-061": "Ch. 61 · Telling Fortunes Before the Pawnshop Gate",
  "shuihu-062": "Ch. 62 · Shi Xiu Leaps from the Upper Floor to Raid the Execution Ground",
  "shuihu-063": "Ch. 63 · Welcoming the Envoy at Pudong",
  "shuihu-064": "Ch. 64 · Suo Chao Pursues the Enemy over the Snow",
  "shuihu-065": "Ch. 65 · Zhang Shun Hails the Ferry in Wind and Snow",
  "shuihu-066": "Ch. 66 · Shi Qian Carries a Basket at Cuiyun Tower",
  "shuihu-067": "Ch. 67 · Meeting the Water and Fire Generals Before the Formations",
  "shuihu-068": "Ch. 68 · A Ghost Blocks Shi Wengong's Way",
  "shuihu-069": "Ch. 69 · The Double-Spear General Rides Out Before the Formations",
  "shuihu-070": "Ch. 70 · Zhang Qing Twists Round with a Stone in His Hand",
  "shuihu-071": "Ch. 71 · Fire Rolls from the Gate of Heaven onto the Xuhuang Altar",
  "shuihu-072": "Ch. 72 · Chai Jin Draws a Concealed Weapon Behind the Screen",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH061_072_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-061": {
    coreKey:
      "Before the pawnshop gate in Daming Prefecture: Wu Yong shakes a bronze bell and " +
      "holds a bronze striker as he chants his fortunes, Li Kui, disguised as a mute " +
      "Taoist acolyte, shoulders a wooden crook-staff hung with a paper signboard, and " +
      "children watch and laugh",
    groundTruth:
      "Chapter 61, \"Wu Yong Cleverly Lures the Jade Qilin; Zhang Shun Wreaks Havoc at " +
      "Jinsha Ferry by Night\". \"Wu Yong was shaking the hand bell and striker in his " +
      "hand\"; Li Kui, disguised as a Taoist acolyte, shoulders \"a wooden crook-staff " +
      "taller than his head\", \"on which hung a paper signboard\"; \"just then they came " +
      "round to the gate of Squire Lu's pawnshop\". Lu Junyi inviting them in comes later.",
    evaluationCriteria:
      "Full credit: A street market on a clear day; on the right of the frame the " +
      "pawnshop gate hangs a signboard bearing the character \"Jie\" (pawn); in the " +
      "middle of the frame Wu Yong, fair-faced with a long beard, in a black gauze " +
      "headscarf pulled down to the brows and a white silk Taoist robe edged in black, " +
      "shakes a bronze bell in one hand and holds a bronze striker in the other; on the " +
      "left of the frame Li Kui, his bushy dark-brown hair done up in twin hair buns, in " +
      "a short coarse cloth tunic, stands with his mouth shut, shouldering a wooden " +
      "crook-staff hung with a paper signboard; in the foreground children clap and laugh " +
      "as they watch. Deductions: Lu Junyi in the picture; Li Kui holding broad axes or " +
      "sitting down; Wu Yong holding a feather fan or wearing a silk-ribbon scarf cap " +
      "(guanjin).",
  },
  "shuihu-062": {
    coreKey:
      "The execution ground in Daming Prefecture: Shi Xiu, leaping from the tavern " +
      "window, is in midair with his waist saber raised, not yet brought down, Lu Junyi " +
      "kneels with his hands bound behind him, and Cai Fu and Cai Qing turn and withdraw",
    groundTruth:
      "Chapter 62, \"Shooting a Stealthy Arrow, Yan Qing Saves His Master; Raiding the " +
      "Execution Ground, Shi Xiu Leaps from the Upper Floor\". \"Cai Fu and Cai Qing let " +
      "go of Squire Lu, tugged at the ropes, and made off first\"; \"Shi Xiu came leaping " +
      "down from the upper floor, a steel saber raised in his hand\". The cangue has " +
      "already been opened before this, and \"Cai Fu had already drawn the execution " +
      "sword into his hand\"; cutting down the crowd comes later.",
    evaluationCriteria:
      "Full credit: A crossroads at noon; on the right of the frame a tavern, and Shi " +
      "Xiu, in a tea-brown sleeved shirt with a crimson waist pouch tied round him, has " +
      "leapt from the upper-floor window and is in midair, both hands raising his waist " +
      "saber, not yet brought down; in the middle of the frame Lu Junyi, in an old " +
      "coarse cloth robe, kneels with his hands bound behind him, the opened cangue lying " +
      "on the ground beside him; on the left of the frame Cai Fu, his execution sword " +
      "hanging toward the ground, turns and withdraws with Cai Qing; constables all " +
      "around hold sabers and cudgels. Deductions: Shi Xiu landed or cutting someone " +
      "down; blood shown; Lu Junyi wearing a cangue or with characters tattooed on his " +
      "face; an executioner in red or a ghost-head saber.",
  },
  "shuihu-063": {
    coreKey:
      "Before the gate of the Pudong Inspectorate: Guan Sheng and Hao Siwen come out " +
      "with cupped hands to welcome him, Xuan Zan, just dismounted, returns the salute, " +
      "and attendants lead the horses",
    groundTruth:
      "Chapter 63, \"Song Jiang's Troops Attack the Northern Capital; Guan Sheng Proposes " +
      "Taking Liangshan Marsh\". Xuan Zan \"came before the Pudong Inspectorate and " +
      "dismounted\"; \"Guan Sheng hurried out with Hao Siwen to welcome him\"; Guan Sheng " +
      "has \"a face like a dark-red date\". Talking in the hall comes later; reading a " +
      "book and the gold armor and green robe belong to Chapter 64.",
    evaluationCriteria:
      "Full credit: Before the gate of the inspectorate on a clear day in early winter; " +
      "on the right of the frame Guan Sheng, tall, with a reddish-brown complexion like " +
      "a ripe jujube, with natural shading, a thin three-strand beard, and a futou cap " +
      "and round-collared robe, comes out with Hao Siwen, hands cupped, to welcome him; " +
      "on the left of the frame Xuan Zan, seen from behind at an angle, a cloak over his " +
      "official dress, has dismounted and returns the salute, and behind him attendants " +
      "lead the horses. Deductions: Guan Sheng drawn with a red opera face-paint mask, in " +
      "gold armor and a green robe, riding Red Hare, or holding a blade; Xuan Zan with " +
      "curly hair and a red beard, or in a frontal close-up; anyone holding a book scroll.",
  },
  "shuihu-064": {
    coreKey:
      "A narrow road deep in snow: Suo Chao gallops up in pursuit with his gold-gilded " +
      "battle-axe, Li Jun, showing only his head and shoulders in the ravine, shouts, and " +
      "Zhang Shun spurs his horse in flight",
    groundTruth:
      "Chapter 64, \"Huyan Zhuo Tricks Guan Sheng on a Moonlit Night; Song Gongming " +
      "Captures Suo Chao on a Snowy Day\". \"When they looked at daybreak, the snow lay " +
      "some two feet deep\"; \"Li Jun abandoned his horse and leapt into the ravine\"; " +
      "\"hearing this, Suo Chao, heedless of his own safety, galloped across the " +
      "lines\". The cannon's boom and the fall into the pit come later.",
    evaluationCriteria:
      "Full credit: A narrow snow-covered road at daybreak in midwinter; on the right of " +
      "the frame Suo Chao, round-faced with a full beard, in a helmet, iron armor, and a " +
      "red brocade robe, gallops on a dappled horse, gripping a single long-handled " +
      "gold-gilded battle-axe raised at a slant, not yet striking; in the middle of the " +
      "frame, in the ravine, Li Jun, with a reddish-brown face, shows only his head and " +
      "shoulders and shouts forward; in the distance on the left of the frame Zhang Shun " +
      "spurs his horse in flight; the snow surface is smooth. Deductions: The pit exposed " +
      "or Suo Chao fallen from his horse; blood shown; Suo Chao holding two axes.",
  },
  "shuihu-065": {
    coreKey:
      "On the Yangzi bank at dusk in wind and snow: Zhang Shun, a bundle on his back, " +
      "calls toward the reeds, and the boatman, in a bamboo-leaf hat and a straw " +
      "raincoat, steps empty-handed out of the reeds",
    groundTruth:
      "Chapter 65, \"The Pagoda-Bearing Heavenly King Manifests Himself in a Dream; White " +
      "Streak in the Waves Avenges a Wrong on the Water\". \"That day the north wind blew " +
      "hard and frozen clouds hung low\", and \"a heavy snow fell all day\"; \"among the " +
      "withered and broken reeds some smoke was rising\"; \"out came a man, wearing a " +
      "bamboo-leaf hat on his head and a straw raincoat over his body\". Boarding the " +
      "boat comes later.",
    evaluationCriteria:
      "Full credit: The riverbank in heavy snow at dusk, cooking smoke rising from the " +
      "withered reeds; on the left of the frame Zhang Shun, fair-skinned, with a " +
      "three-strand black beard, in a blue gauze wan-pattern headscarf and a padded " +
      "cotton jacket, a bundle on his back and snow settling on his shoulders, calls " +
      "toward the reeds; on the right of the frame the boatman, wearing a bamboo-leaf hat " +
      "and a straw raincoat, steps out of the reeds with his hands hanging empty. " +
      "Deductions: Zhang Shun wearing a bamboo hat or a straw raincoat; the boatman " +
      "holding a blade; a ferryboat, a rope, or gold in the picture.",
  },
  "shuihu-066": {
    coreKey:
      "Upstairs in Cuiyun Tower on Lantern Festival night: Shi Qian carries under his arm " +
      "a basket stuck with paper-moth ornaments (nao'e) and hiding incendiary packets, and " +
      "Xie Zhen and Xie Bao stand before a private room trailing steel forks hung with " +
      "hares",
    groundTruth:
      "Chapter 66, \"Shi Qian Sets Fire to Cuiyun Tower; Wu Yong Takes Daming Prefecture " +
      "by Guile\". \"Shi Qian carried a basket under his arm, full of sulfur and " +
      "saltpeter incendiary packets for setting fires\"; \"stuck on the basket were a few " +
      "paper moths\"; Xie Zhen and Xie Bao were \"trailing steel forks, with hares hung " +
      "on the forks\". The fire breaking out comes later.",
    evaluationCriteria:
      "Full credit: Lanterns hang from the upturned eaves on Lantern Festival night, and " +
      "before the tower the white dragon on the lantern mountain (aoshan) is lit; at the " +
      "back of the frame young men in a private room play the sheng and xiao and beat " +
      "drum and clappers; on the left of the frame Shi Qian, small and thin, with thick " +
      "brows and bright eyes, carries under his arm a basket stuck with paper moths, with " +
      "paper-wrapped incendiary packets inside; on the right of the frame Xie Zhen and " +
      "Xie Bao, in hunters' short clothes and animal-skin skirts, trail steel forks hung " +
      "with hares. Deductions: Flames, thick smoke, or torches from the building on fire; " +
      "Shi Qian masked or made up as an opera clown with a white nose.",
  },
  "shuihu-067": {
    coreKey:
      "Before the formations at Lingzhou: Guan Sheng, in gold armor and a green robe, " +
      "reins in Red Hare, and Shan Tinggui (black) and Wei Dingguo (red), each with his " +
      "own side's banner carried before him, laugh loudly, point, and revile him",
    groundTruth:
      "Chapter 67, \"Song Jiang Rewards the Three Armies, Horse and Foot; Guan Sheng " +
      "Subdues the Water and Fire Generals\". \"The two tiger generals came out together " +
      "before the formation\"; Guan Sheng \"said from horseback: 'Two generals, it has " +
      "been a long time since we parted!'\"; \"Shan Tinggui and Wei Dingguo laughed " +
      "loudly, pointed at Guan Sheng, and reviled him\". Coming to blows comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Guan Sheng, with a reddish-brown complexion " +
      "like a ripe jujube, with natural shading, in gold armor and a green robe, rides " +
      "the Red Hare horse and reins in, holding the crescent blade; on the right of the " +
      "frame Shan Tinggui, in an iron helmet with a black tassel and black-lacquered " +
      "armor, rides a black horse holding a black-shafted spear, a black standard carried " +
      "before him, and Wei Dingguo, in a vermilion helmet with a red tassel and a " +
      "deep-red robe, rides a rouge-red horse holding a wrought-bronze saber, a red " +
      "embroidered banner carried before him, the two generals laughing loudly, " +
      "pointing, and reviling him; at the back the foot soldiers are drawn up by the " +
      "colors of their banners. Deductions: Guan Sheng drawn with a red opera face-paint " +
      "mask; the two armies engaged; firearms or fire carts.",
  },
  "shuihu-068": {
    coreKey:
      "Open country at night in black fog: Shi Wengong, on the snow-white Night-Shining " +
      "Jade Lion horse, pulls on the reins to turn back, and Chao Gai's ghost, become a " +
      "blurred human figure, blocks his way",
    groundTruth:
      "Chapter 68, \"Song Gongming Attacks Zengtou Market by Night; Lu Junyi Captures Shi " +
      "Wengong Alive\". \"By now black fog covered the sky, and north could not be told " +
      "from south\"; \"in the empty air a man blocked the way\"; \"Shi Wengong, suspecting " +
      "divine soldiers, reined in his horse and turned back\". The horse has \"not a " +
      "single stray hair on its whole body\" (Chapter 60). His capture comes later.",
    evaluationCriteria:
      "Full credit: Open country at night, black fog covering the sky and dark clouds " +
      "rolling; on the right of the frame Shi Wengong, in a gold helmet and soft armor, " +
      "holding a long spear with a vermilion tassel, rides a horse of pure snow-white " +
      "without a stray hair, looking startled and suspicious, pulling on the reins to " +
      "turn back; at the upper left of the frame, in the clouds and mist, Chao Gai's " +
      "ghost is a single pale, translucent, blurred human figure blocking the way. " +
      "Deductions: More than one figure, or the figure drawn as a skeleton or a ghost " +
      "face; an arrow wound or blood; the horse spotted or hung with bells; Lu Junyi, Yan " +
      "Qing, or the ambush troops in the picture.",
  },
  "shuihu-069": {
    coreKey:
      "Dawn at Anshan Town: Dong Ping, in a phoenix-wing helmet, rides out with a long " +
      "spear in each hand, a small flag stuck in his quiver, and Song Jiang watches from " +
      "afar under the gate banner",
    groundTruth:
      "Chapter 69, \"Nine Dragons Is Trapped by Mischance in Dongping Prefecture; Song " +
      "Gongming Righteously Releases the Double-Spear General\". \"Both sides drew up " +
      "their battle lines, and Dong Ping rode out\"; \"a white water-polished " +
      "phoenix-wing helmet, a blue embroidered qilin battle coat\"; \"in his quiver was " +
      "stuck a small flag\"; Song Jiang \"was delighted at first sight\". The fighting " +
      "comes later.",
    evaluationCriteria:
      "Full credit: Two armies drawn up on grassland at dawn; on the right of the frame " +
      "Dong Ping, in a white water-polished phoenix-wing helmet, silver-chased iron " +
      "armor, and a blue embroidered qilin battle coat, on horseback, holds a long spear " +
      "in each hand, a small flag stuck in his quiver; in the distance on the left of the " +
      "frame, under the gate banner, Song Jiang, dark-faced and short, with the " +
      "characters tattooed on his face, reins in and watches from afar, a pleased look on " +
      "his face. Deductions: Already engaged or Dong Ping captured; the couplet written " +
      "on a large banner; Dong Ping holding short spears.",
  },
  "shuihu-070": {
    coreKey:
      "Before the formations at Dongchang Prefecture: Zhang Qing, feigning defeat, twists " +
      "round, his right hand pinching a stone from his brocade pouch as he takes aim at " +
      "Xu Ning's face, and Xu Ning comes in pursuit with his hook-sickle spear leveled",
    groundTruth:
      "Chapter 70, \"The Featherless Arrow Strikes Heroes with Flying Stones; Song " +
      "Gongming Abandons the Grain to Capture a Stalwart\". \"They had fought fewer than " +
      "five bouts when Zhang Qing made off. Xu Ning gave chase\"; \"with his right hand " +
      "he took a stone from his brocade pouch, twisted round, and took aim at Xu Ning's " +
      "face, now close\". The stone striking him comes later.",
    evaluationCriteria:
      "Full credit: Open flatland on a clear day, the banners in five colors; on the left " +
      "of the frame Zhang Qing, with a madder-red tassel on his headscarf, in a brocade " +
      "coat and embroidered jacket, rides a blue-gray dappled horse in feigned defeat, " +
      "his left hand holding a long spear and his right hand pinching a stone as he " +
      "twists round and takes aim at Xu Ning; on the right of the frame Xu Ning, " +
      "white-faced, in a black headscarf and willow-leaf armor, comes in pursuit on " +
      "horseback with his hook-sickle spear leveled; at the left rear of the frame Gong " +
      "Wang on horseback grips a throwing spear and Ding Desun on horseback grips a " +
      "throwing fork. Deductions: The stone in the air or anyone struck; a slingshot or a " +
      "sling; blood shown.",
  },
  "shuihu-071": {
    coreKey:
      "The third watch on the seventh night of the Grand Luotian Jiao rite: the Gate of " +
      "Heaven opens in the northwest, a fireball the size of a wicker basket (kaolao) " +
      "rolls toward the Xuhuang altar, still in midair, and everyone on the three-tiered " +
      "altar looks up",
    groundTruth:
      "Chapter 71, \"In the Hall of Loyalty and Righteousness the Stone Tablet Receives " +
      "the Heavenly Script; the Heroes of Liangshan Marsh Are Ranked in Order\". \"Before " +
      "the Hall of Loyalty and Righteousness four long pennants were hung, and in the " +
      "hall a three-tiered high platform was lashed together\"; \"out of the middle " +
      "rolled a mass of fire, shaped like a wicker basket, and it rolled straight down " +
      "onto the Xuhuang altar\"; Gongsun Sheng is on the first tier, the Taoist priests " +
      "on the second, and Song Jiang and the others on the third. Digging up the stone " +
      "tablet comes later.",
    evaluationCriteria:
      "Full credit: A starlit night at the third watch, the three-tiered altar in the " +
      "Hall of Loyalty and Righteousness and long pennants before the hall; at the top of " +
      "the frame, left of center, an upright opening of light, pointed at both ends and " +
      "wide in the middle, wreathed in rosy clouds, from which a fireball rolls out, " +
      "still in midair; on the top tier of the altar Gongsun Sheng, in a lotus crown and " +
      "a deep-red ritual robe patterned with stars, on the second tier Taoist priests " +
      "holding incense, and on the third tier Song Jiang, dark-faced and short, with the " +
      "characters tattooed on his face, holding incense and looking up with the other " +
      "chieftains. Deductions: The fireball already on the ground or burrowing into the " +
      "earth; the stone tablet, the pit, or the apricot-yellow banner in the picture.",
  },
  "shuihu-072": {
    coreKey:
      "Before the plain white screen in Ruisi Hall: Chai Jin, a gold flower with " +
      "kingfisher-green leaves in his cap and a brocade jacket with palace flowers on, " +
      "draws a small pointed concealed weapon, its tip not yet touching the screen",
    groundTruth:
      "Chapter 72, \"Chai Jin, a Flower in His Cap, Enters the Forbidden Palace; Li Kui " +
      "Wreaks Havoc in the Eastern Capital on Lantern Festival Night\". The imperial " +
      "throne and desk stand in front of the painted screen at the front; \"going round " +
      "behind the screen, he saw on a plain white screen the names of the four great " +
      "bandits in the imperial hand\"; Chai Jin has changed into the brocade jacket and " +
      "flowered cap of a palace guardsman (banzhi), and \"then drew the concealed weapon " +
      "from his side\". Carving out the four characters comes later.",
    evaluationCriteria:
      "Full credit: Behind the painted screen in Ruisi Hall by day; on the left of the " +
      "frame a vermilion side door in the side wall; on the right of the frame the plain " +
      "white screen bearing four lines of names in the imperial hand; in the middle of " +
      "the frame Chai Jin, with a three-tufted mustache, in a flowered cap with a gold " +
      "flower with kingfisher-green leaves and a small gold tag pinned at its side, and a " +
      "brocade jacket with palace flowers, faces the screen and draws a small pointed " +
      "concealed weapon, its tip not yet touching the screen. Deductions: The throne and " +
      "desk on the same side as the plain white screen; carved marks or a gap already on " +
      "the screen; the emperor, eunuchs, guards, or anyone other than Chai Jin in the " +
      "picture.",
  },
  "shuihu-anim-061": {
    coreKey:
      "Wu Yong shaking a bronze bell and holding a bronze striker, and Li Kui, disguised " +
      "as a mute Taoist acolyte, shouldering a wooden crook-staff hung with a paper " +
      "signboard, with animated bronze bell, paper signboard, and children clapping",
    groundTruth:
      "Chapter 61, \"Wu Yong Cleverly Lures the Jade Qilin; Zhang Shun Wreaks Havoc at " +
      "Jinsha Ferry by Night\". \"Wu Yong was shaking the hand bell and striker in his " +
      "hand and chanting a four-line jingle\"; Li Kui shoulders \"a wooden crook-staff " +
      "taller than his head\", \"on which hung a paper signboard\"; \"they came round to " +
      "the gate of Squire Lu's pawnshop\". Going into the hall comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Wu Yong, in a black gauze headscarf " +
      "pulled down to the brows and a white silk Taoist robe, shakes a bronze bell in one " +
      "hand and holds a bronze striker in the other; on the left of the frame Li Kui, in " +
      "twin hair buns and a short coarse cloth tunic, stands with his mouth shut, " +
      "shouldering a wooden crook-staff hung with a paper signboard; the bronze bell, the " +
      "paper signboard, and the children's clapping loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Lu Junyi in the picture; Li Kui holding broad axes; Wu " +
      "Yong holding a feather fan or wearing a silk-ribbon scarf cap (guanjin); whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-062": {
    coreKey:
      "Shi Xiu in midair from the tavern window with his waist saber raised, Lu Junyi " +
      "kneeling with his hands bound behind him, and the Cai brothers withdrawing, with " +
      "animated black standard, and shirt hem and sash ends",
    groundTruth:
      "Chapter 62, \"Shooting a Stealthy Arrow, Yan Qing Saves His Master; Raiding the " +
      "Execution Ground, Shi Xiu Leaps from the Upper Floor\". \"Cai Fu and Cai Qing let " +
      "go of Squire Lu, tugged at the ropes, and made off first\"; \"Shi Xiu came leaping " +
      "down from the upper floor, a steel saber raised in his hand\". The cangue has " +
      "already been opened before this, and \"Cai Fu had already drawn the execution " +
      "sword into his hand\"; cutting down the crowd comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Shi Xiu, in a tea-brown sleeved shirt with " +
      "a crimson waist pouch tied round him, has leapt from the upper-floor window and is " +
      "in midair raising his waist saber; in the middle of the frame Lu Junyi kneels with " +
      "his hands bound behind him, the opened cangue on the ground beside him; on the " +
      "left of the frame Cai Fu, his execution sword hanging toward the ground, turns and " +
      "withdraws with Cai Qing; the black standard and the shirt hem and sash ends loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Shi Xiu landed; blood shown; " +
      "Lu Junyi wearing a cangue; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-063": {
    coreKey:
      "Guan Sheng and Hao Siwen coming out with cupped hands to welcome him, and Xuan " +
      "Zan, seen from behind at an angle, returning the salute, with animated horses' " +
      "manes and tails, cloak and robe hems, and falling leaves",
    groundTruth:
      "Chapter 63, \"Song Jiang's Troops Attack the Northern Capital; Guan Sheng Proposes " +
      "Taking Liangshan Marsh\". Xuan Zan \"came before the Pudong Inspectorate and " +
      "dismounted\"; \"Guan Sheng hurried out with Hao Siwen to welcome him\"; Guan Sheng " +
      "has \"a face like a dark-red date\". Talking in the hall comes later; the gold " +
      "armor and green robe and the Red Hare horse belong to Chapter 64.",
    evaluationCriteria:
      "Full credit: On the right of the frame Guan Sheng, with a reddish-brown complexion " +
      "like a ripe jujube, with natural shading, in a futou cap and round-collared robe, " +
      "comes out with Hao Siwen, hands cupped, to welcome him; on the left of the frame " +
      "Xuan Zan, seen from behind at an angle, in official dress and a cloak, returns the " +
      "salute, and attendants lead the horses; the horses' manes and tails, the cloak and " +
      "robe hems, and the falling leaves loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Guan Sheng drawn with a red opera face-paint mask, in gold armor and a " +
      "green robe, or riding Red Hare; Xuan Zan with curly hair and a red beard; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-064": {
    coreKey:
      "Suo Chao galloping up in pursuit with his gold-gilded battle-axe and Li Jun " +
      "shouting in the ravine with only his head and shoulders showing, with animated " +
      "fine snow, robe hem and horse's mane, and withered grass",
    groundTruth:
      "Chapter 64, \"Huyan Zhuo Tricks Guan Sheng on a Moonlit Night; Song Gongming " +
      "Captures Suo Chao on a Snowy Day\". \"That night the snow fell fast and the wind " +
      "was bitter; when they looked at daybreak, the snow lay some two feet deep\"; \"Li " +
      "Jun abandoned his horse and leapt into the ravine\"; Suo Chao \"galloped across " +
      "the lines\". The fall into the pit comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Suo Chao, with a full beard, in a helmet, " +
      "iron armor, and a red brocade robe, gallops on a dappled horse gripping a single " +
      "gold-gilded battle-axe; in the middle of the frame, in the ravine, Li Jun shows " +
      "only his head and shoulders and shouts; in the distance on the left of the frame " +
      "Zhang Shun spurs his horse in flight; the snow surface is smooth; the fine snow, " +
      "the robe hem and horse's mane, and the withered grass loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: The pit exposed or Suo Chao fallen from his horse; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "shuihu-anim-065": {
    coreKey:
      "Zhang Shun, a bundle on his back, calling toward the reeds and the boatman, in a " +
      "bamboo-leaf hat and a straw raincoat, stepping empty-handed out of them, with " +
      "animated wind and snow, withered reeds, and cooking smoke",
    groundTruth:
      "Chapter 65, \"The Pagoda-Bearing Heavenly King Manifests Himself in a Dream; White " +
      "Streak in the Waves Avenges a Wrong on the Water\". \"That day the north wind blew " +
      "hard and frozen clouds hung low\", and \"a heavy snow fell all day\"; \"among the " +
      "withered and broken reeds some smoke was rising\"; the boatman wears \"a " +
      "bamboo-leaf hat on his head and a straw raincoat over his body\". Boarding the " +
      "boat comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Zhang Shun, fair-skinned, in a blue gauze " +
      "wan-pattern headscarf and a padded cotton jacket, a bundle on his back and snow " +
      "settling on his shoulders, calls toward the reeds; on the right of the frame the " +
      "boatman, wearing a bamboo-leaf hat and a straw raincoat, has just stepped " +
      "empty-handed out of the reeds and stands still; the wind and snow, the withered " +
      "reeds, and the cooking smoke loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Zhang Shun wearing a bamboo hat or a straw raincoat; the boatman " +
      "holding a blade; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-066": {
    coreKey:
      "Shi Qian carrying under his arm a basket stuck with paper-moth ornaments (nao'e) " +
      "and hiding incendiary packets, and Xie Zhen and Xie Bao trailing steel forks hung " +
      "with hares, with animated lantern-mountain lamp flames, hanging lanterns, and " +
      "drum and clappers",
    groundTruth:
      "Chapter 66, \"Shi Qian Sets Fire to Cuiyun Tower; Wu Yong Takes Daming Prefecture " +
      "by Guile\". \"Shi Qian carried a basket under his arm, full of sulfur and " +
      "saltpeter incendiary packets for setting fires\"; \"stuck on the basket were a few " +
      "paper moths\"; Xie Zhen and Xie Bao were \"trailing steel forks, with hares hung " +
      "on the forks\". The fire breaking out comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Shi Qian, small and thin, with thick brows " +
      "and bright eyes, carries under his arm a basket stuck with paper moths, with " +
      "paper-wrapped incendiary packets inside; on the right of the frame Xie Zhen and " +
      "Xie Bao, in hunters' short clothes and animal-skin skirts, trail steel forks hung " +
      "with hares; before the tower the white dragon on the lantern mountain (aoshan) is " +
      "lit; the lamp flames, the hanging lanterns, and the drum and clappers loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Flames, thick smoke, or " +
      "torches from the building on fire; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-067": {
    coreKey:
      "Guan Sheng riding Red Hare, and Shan Tinggui (black) and Wei Dingguo (red), each " +
      "with his own side's banner carried before him, pointing and reviling him, with " +
      "animated banners, helmet tassels and manes, and green robe",
    groundTruth:
      "Chapter 67, \"Song Jiang Rewards the Three Armies, Horse and Foot; Guan Sheng " +
      "Subdues the Water and Fire Generals\". \"The two tiger generals came out together " +
      "before the formation\"; \"Shan Tinggui and Wei Dingguo laughed loudly, pointed at " +
      "Guan Sheng, and reviled him\"; Shan Tinggui has a black standard carried before " +
      "him, and Wei Dingguo a red embroidered banner. Coming to blows comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Guan Sheng, with a reddish-brown complexion " +
      "like a ripe jujube, with natural shading, in gold armor and a green robe, rides " +
      "the Red Hare horse holding the crescent blade; on the right of the frame Shan " +
      "Tinggui, in an iron helmet with a black tassel and black-lacquered armor, rides a " +
      "black horse, a black standard carried before him, and Wei Dingguo, in a vermilion " +
      "helmet with a red tassel and a deep-red robe, rides a rouge-red horse, a red " +
      "embroidered banner carried before him, the two generals laughing loudly, " +
      "pointing, and reviling him; the banners, the helmet tassels and manes, and the " +
      "green robe loop smoothly, driven by SMIL or inline CSS. Deductions: Guan Sheng " +
      "drawn with a red opera face-paint mask; coming to blows or firearms; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-068": {
    coreKey:
      "Shi Wengong pulling on the reins to turn back and Chao Gai's ghost, become a " +
      "blurred human figure, blocking his way, with animated black fog, spear tassel and " +
      "horse's mane, and woods",
    groundTruth:
      "Chapter 68, \"Song Gongming Attacks Zengtou Market by Night; Lu Junyi Captures Shi " +
      "Wengong Alive\". \"Dark clouds drifted, cold air whistled, black fog spread far " +
      "and wide, a fierce wind howled, and in the empty air a man blocked the way\"; " +
      "\"Shi Wengong, suspecting divine soldiers, reined in his horse and turned back\". " +
      "His capture comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Shi Wengong, in a gold helmet and soft " +
      "armor, holding a long spear with a vermilion tassel, rides a horse of pure " +
      "snow-white without a stray hair, pulling on the reins to turn back; at the upper " +
      "left of the frame, in the clouds and mist, Chao Gai's ghost is a single pale, " +
      "translucent, blurred human figure blocking the way; the black fog, the spear " +
      "tassel and horse's mane, and the woods loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: More than one figure, or the figure drawn as a skeleton or a " +
      "ghost face; blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-069": {
    coreKey:
      "Dong Ping, in a phoenix-wing helmet, riding out with a long spear in each hand and " +
      "Song Jiang watching from afar under the gate banner, with animated small flag and " +
      "gate banner, spear tassels and horse's mane, and morning mist",
    groundTruth:
      "Chapter 69, \"Nine Dragons Is Trapped by Mischance in Dongping Prefecture; Song " +
      "Gongming Righteously Releases the Double-Spear General\". \"Both sides drew up " +
      "their battle lines, and Dong Ping rode out\"; \"a white water-polished " +
      "phoenix-wing helmet, a blue embroidered qilin battle coat\"; \"in his quiver was " +
      "stuck a small flag\". The fighting comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Dong Ping, in a white water-polished " +
      "phoenix-wing helmet, silver-chased iron armor, and a blue embroidered qilin battle " +
      "coat, holds a long spear in each hand, a small flag stuck in his quiver; in the " +
      "distance on the left of the frame, under the gate banner, Song Jiang, dark-faced " +
      "and short, with the characters tattooed on his face; the small flag and gate " +
      "banner, the spear tassels and horse's mane, and the morning mist loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Already engaged; Dong Ping holding short " +
      "spears; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-070": {
    coreKey:
      "Zhang Qing twisting round with a stone pinched in his hand as he takes aim at Xu " +
      "Ning and Xu Ning coming in pursuit with his hook-sickle spear leveled, with " +
      "animated bronze bells and pheasant tails, five-colored banners, and madder-red " +
      "tassel",
    groundTruth:
      "Chapter 70, \"The Featherless Arrow Strikes Heroes with Flying Stones; Song " +
      "Gongming Abandons the Grain to Capture a Stalwart\". \"With his right hand he took " +
      "a stone from his brocade pouch, twisted round, and took aim at Xu Ning's face, now " +
      "close\"; Zhang Qing's horse is hung with wrought-bronze bells, \"trailing pheasant " +
      "tails behind\". Striking him off his horse comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Zhang Qing, with a madder-red tassel on his " +
      "headscarf, in a brocade coat and embroidered jacket, rides a blue-gray dappled " +
      "horse, his left hand holding a long spear and his right hand pinching a stone as " +
      "he twists round and takes aim at Xu Ning; on the right of the frame Xu Ning, in a " +
      "black headscarf and willow-leaf armor, comes in pursuit with his hook-sickle spear " +
      "leveled; at the left rear Gong Wang and Ding Desun on horseback grip a throwing " +
      "spear and a throwing fork; the bronze bells and pheasant tails, the five-colored " +
      "banners, and the madder-red tassel loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The stone flying out or anyone struck; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-071": {
    coreKey:
      "The fireball held in midair where the Gate of Heaven opens and everyone on the " +
      "three-tiered altar looking up, with animated fireball flames, rosy clouds, and " +
      "candle flames and long pennants",
    groundTruth:
      "Chapter 71, \"In the Hall of Loyalty and Righteousness the Stone Tablet Receives " +
      "the Heavenly Script; the Heroes of Liangshan Marsh Are Ranked in Order\". \"Before " +
      "the Hall of Loyalty and Righteousness four long pennants were hung, and in the " +
      "hall a three-tiered high platform was lashed together\"; \"that night at the third " +
      "watch, there came a sound in the sky like the tearing of silk\"; \"wreathed in " +
      "rosy clouds, out of the middle rolled a mass of fire, shaped like a wicker " +
      "basket\". The fire entering the earth comes later.",
    evaluationCriteria:
      "Full credit: The three-tiered altar in the Hall of Loyalty and Righteousness and " +
      "long pennants before the hall; at the top of the frame, left of center, an " +
      "opening of light, pointed at both ends and wide in the middle, wreathed in rosy " +
      "clouds, from which a fireball rolls out and is held in midair; on the top tier of " +
      "the altar Gongsun Sheng, in a lotus crown and a deep-red ritual robe patterned " +
      "with stars, and on the third tier Song Jiang, with the characters tattooed on his " +
      "face, looking up with the other chieftains; the fireball flames, the rosy clouds, " +
      "and the candle flames and long pennants loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The fireball fallen to the ground; the stone tablet, the pit, or " +
      "the apricot-yellow banner in the picture; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-072": {
    coreKey:
      "Chai Jin, a gold flower with kingfisher-green leaves in his cap and a brocade " +
      "jacket with palace flowers on, drawing a small pointed concealed weapon before the " +
      "plain white screen, with animated floating dust, and gold flower and gold tag",
    groundTruth:
      "Chapter 72, \"Chai Jin, a Flower in His Cap, Enters the Forbidden Palace; Li Kui " +
      "Wreaks Havoc in the Eastern Capital on Lantern Festival Night\". The imperial " +
      "throne and desk stand in front of the painted screen at the front; \"he saw on a " +
      "plain white screen the names of the four great bandits in the imperial hand\"; " +
      "the palace guardsmen (banzhi) \"each wore a flower with kingfisher-green leaves at " +
      "the side of the head\"; Chai Jin \"then drew the concealed weapon from his side\". " +
      "Carving out the four characters comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the plain white screen bearing four lines " +
      "of names in the imperial hand; in the middle of the frame Chai Jin, in a flowered " +
      "cap with a gold flower with kingfisher-green leaves and a small gold tag pinned at " +
      "its side, and a brocade jacket with palace flowers, faces the screen and draws a " +
      "small pointed concealed weapon, its tip not yet touching the screen; on the left " +
      "of the frame a vermilion side door in the side wall; the floating dust and the " +
      "gold flower and gold tag loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "The throne and desk on the same side as the plain white screen; carved marks " +
      "already on the screen; anyone other than Chai Jin in the picture; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
};
