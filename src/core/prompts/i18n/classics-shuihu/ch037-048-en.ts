/**
 * 《水浒传》第 37–48 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch037-048.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH037_048_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-037": "Ch. 37 · Zhang Heng Sculls in Midstream",
  "shuihu-038": "Ch. 38 · Fighting Zhang Shun in the River",
  "shuihu-039": "Ch. 39 · Writing Drunkenly on the Whitewashed Wall of Xunyang Tower",
  "shuihu-040": "Ch. 40 · Raiding the Execution Ground at Jiangzhou",
  "shuihu-041": "Ch. 41 · Intercepting Huang Wenbing in Midstream",
  "shuihu-042": "Ch. 42 · The Mystic Woman of the Ninth Heaven Bestows the Heavenly Book",
  "shuihu-043": "Ch. 43 · Li Kui Meets Li Gui at the Edge of the Woods",
  "shuihu-044": "Ch. 44 · Meeting Shi Xiu in the Long Street",
  "shuihu-045": "Ch. 45 · Shi Xiu Lies in Wait for the Ascetic in a Dark Lane",
  "shuihu-046": "Ch. 46 · Shi Qian Steals a Chicken at the Zhu Family Inn",
  "shuihu-047": "Ch. 47 · Old Man Zhongli Points the Way",
  "shuihu-048": "Ch. 48 · Hu Sanniang Fights Wang the Stumpy Tiger",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH037_048_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-037": {
    coreKey:
      "Midstream on the Xunyang River: Zhang Heng stands at the stern sculling and looks " +
      "back with a cold sneer, Song Jiang and the escort officers crouch in the cabin, and " +
      "on the shoal under the torches Mu Hong and Mu Chun level their pudao (long-handled " +
      "saber)",
    groundTruth:
      "Chapter 37, \"The Unstoppable Gives Chase to the Timely Rain; the Boat Blaze Wreaks " +
      "Havoc on the Xunyang River\". \"They had already reached the shoal, with a " +
      "dozen-odd torches\"; \"Song Jiang and the two escort officers crouched together in " +
      "the cabin of the boat\"; the boatman went on \"sculling all the while\"; Zhang Heng " +
      "has \"a yellow beard, red hair, and red eyes\"; Song Jiang \"wore no travel cangue " +
      "on his neck\". Forcing them into the water comes later.",
    evaluationCriteria:
      "Full credit: On a starlit night the small boat has already left the bank and is in " +
      "midstream; on the right of the frame Zhang Heng, with a yellow beard and red hair, " +
      "stands at the stern sculling and looks back with a cold sneer, no blade in his " +
      "hands, and in the cabin Song Jiang, dark-faced and short, with the characters " +
      "tattooed on his face and no cangue, crouches with the two escort officers; on the " +
      "left of the frame a dozen-odd torches on the shoal, Mu Hong and Mu Chun stand " +
      "foremost leveling their pudao, and behind them the crowd holds spears and cudgels. " +
      "Deductions: Zhang Heng holding a blade or forcing anyone into the water; Song Jiang " +
      "wearing a cangue; Li Jun's fast boat; anyone on the bank going into the water; any " +
      "figure drawn with opera face paint.",
  },
  "shuihu-038": {
    coreKey:
      "Beside the capsized boat in midstream, Zhang Shun hauls Li Kui up out of the water, " +
      "about to push him under again; Song Jiang and Dai Zong cry out in dismay on the " +
      "bank, and a crowd looks on under the willows",
    groundTruth:
      "Chapter 38, \"The Timely Rain Meets the Magic Messenger; the Black Whirlwind Fights " +
      "White Streak in the Waves\". \"That man hauled Li Kui up, then ducked him under " +
      "again\"; Zhang Shun has \"frost-white skin all over his body\" and \"tied on a pair " +
      "of swimming trunks flat and tight\"; Li Kui \"had on only a checkered cloth towel " +
      "tied round him\"; Song Jiang and Dai Zong, \"the two of them, could only cry out in " +
      "dismay on the bank\". Lifting him up onto the bank comes later.",
    evaluationCriteria:
      "Full credit: In the light of the setting sun a fishing boat lies capsized in " +
      "midstream; on the right of the frame Zhang Shun, fair-skinned, with a three-strand " +
      "black beard and a dot of red on his topknot, hauls the bare-chested Li Kui up out " +
      "of the water, both men hidden in the waves below the waist, with Zhang Shun's " +
      "swimming trunks and the cloth at Li Kui's waist showing at the waterline; on the " +
      "left of the frame, on the bank, Song Jiang, dark-faced and short, with the " +
      "characters tattooed on his face, stands beside Dai Zong, in a black gauze headscarf " +
      "with a green flower tucked in it, both crying out in dismay, and a crowd looks on " +
      "under the willows. Deductions: Li Kui holding broad axes; Zhang Shun holding a fish " +
      "fork; anyone fully naked; Song Jiang wearing a cangue; any figure drawn with opera " +
      "face paint.",
  },
  "shuihu-039": {
    coreKey:
      "The riverside private room of Xunyang Tower: Song Jiang, drunk, stands alone " +
      "before the whitewashed wall and, ink ground thick and brush well charged, writes " +
      "out a ci lyric to the tune \"Xijiang Yue\" (Moon over the West River)",
    groundTruth:
      "Chapter 39, \"In Xunyang Tower Song Jiang Recites a Rebellious Poem; at Liangshan " +
      "Marsh Dai Zong Delivers a Forged Letter\". Song Jiang says of himself, \"instead I " +
      "had both sides of my face tattooed\"; he \"saw that on the whitewashed wall there " +
      "were many poems written by earlier visitors\", \"ground the ink thick, dipped the " +
      "brush full, and set to writing with a flourish on that whitewashed wall\"; the " +
      "four-line poem and the signature come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the whitewashed wall bears old inscriptions " +
      "in ink, and Song Jiang, dark-faced and short, with the characters tattooed on his " +
      "face, stands alone before it, brush raised, writing; on the left of the frame a " +
      "wine vessel, an inkstone, and vermilion plates and dishes on the table; fishing " +
      "boats on the river outside the window. Deductions: Song Jiang wearing a cangue or " +
      "with his hair hanging loose; the waiter or Huang Wenbing in the picture; writing on " +
      "a paper scroll, a screen, or carved stone.",
  },
  "shuihu-040": {
    coreKey:
      "The execution ground at Jiangzhou: Song Jiang and Dai Zong sit bound back to back, " +
      "the blade not yet fallen, a merchant beats a gong on his cart, and Li Kui, a broad " +
      "axe in each hand, leaps down from the upper floor of a teahouse",
    groundTruth:
      "Chapter 40, \"The Gallant Men of Liangshan Marsh Raid the Execution Ground; the " +
      "Heroes Hold a Small Sworn Gathering at the White Dragon Temple\". \"Song Jiang was " +
      "set facing south with his back to the north, and Dai Zong facing north with his " +
      "back to the south, and each was made to sit down\"; the two have their hair " +
      "\"twisted into a pear-shaped topknot\"; a merchant \"stood up on his cart and " +
      "struck it, clang, clang, two or three times\"; Li Kui \"came leaping down out of " +
      "midair\". Cutting down the executioners comes later.",
    evaluationCriteria:
      "Full credit: In the center of the frame Song Jiang, dark-faced and short, with the " +
      "characters tattooed on his face, and Dai Zong, their hair twisted into pear-shaped " +
      "topknots, a red paper flower stuck in each head, no cangues, sit bound back to " +
      "back, and the executioner holds his blade, not yet fallen; at the upper right of " +
      "the frame the bare-chested Li Kui, a broad axe in each hand, has leapt from the " +
      "upper floor of the teahouse and is in midair, not yet landed; on the left of the " +
      "frame Prefect Cai Jiu reins in his horse, and at the top of the frame a merchant " +
      "stands on his cart beating a gong. Deductions: Li Kui landed or cutting someone " +
      "down; blood shown; Song Jiang or Dai Zong wearing a cangue; an executioner in red " +
      "or a ghost-head saber.",
  },
  "shuihu-041": {
    coreKey:
      "The night river reddened by firelight: Li Jun catches the official boat with a " +
      "grappling hook and leaps across, Huang Wenbing runs to the stern about to jump into " +
      "the river, and Zhang Shun comes slipping up from under the water",
    groundTruth:
      "Chapter 41, \"Song Jiang Takes Wuwei Garrison by Guile; Zhang Shun Captures Huang " +
      "Wenbing Alive\". \"With one grappling hook he caught hold of the boat and leapt " +
      "across\"; Huang Wenbing \"ran toward the stern and flung himself toward the river " +
      "to jump\"; \"from under the water a man had already slipped across\". Seizing him " +
      "around the waist comes later. Li Jun has \"thick brows, big eyes, and a ruddy " +
      "face\".",
    evaluationCriteria:
      "Full credit: The night river reddened by firelight; on the right of the frame a " +
      "small boat rams in, and Li Jun, ruddy-faced, has caught the official boat with a " +
      "grappling hook and is leaping across; on the left of the frame, at the stern, " +
      "Huang Wenbing, panic-stricken, is about to jump, not yet in the water, and in the " +
      "water below the stern the pale shape of Zhang Shun slips toward him, not yet " +
      "surfaced; in the middle of the frame the boatmen and attendants on the official " +
      "boat are in a panic. Deductions: Huang Wenbing in the water or seized; Zhang Shun " +
      "holding a fish fork or a blade; blood shown; Huang Wenbing in a Ming or Qing " +
      "rank-badge robe or drawn with opera face paint.",
  },
  "shuihu-042": {
    coreKey:
      "In the hall of the Mystic Woman: she sits upright on the Nine-Dragon couch, a " +
      "blue-clad maiden brings out on a jade tray the three scrolls of the heavenly book " +
      "in a yellow silk wrapper, and Song Jiang bows twice before the steps",
    groundTruth:
      "Chapter 42, \"Receiving the Three Scrolls of the Heavenly Book in Huandao Village; " +
      "Song Gongming Meets the Mystic Woman of the Ninth Heaven\". \"The maiden in blue " +
      "went behind the screen and brought out on a jade tray a yellow silk wrapper holding " +
      "three scrolls of the heavenly book, and handed it to Song Jiang\"; the goddess " +
      "\"wore her hair in a nine-dragon flying-phoenix chignon, and was dressed in a " +
      "crimson silk-gauze robe of gold thread\"; after eating the dates Song Jiang \"kept " +
      "the pits in his hand\". Tucking the book into his sleeve comes later.",
    evaluationCriteria:
      "Full credit: A hall at night, its pearl curtains rolled high, with dragon lamps and " +
      "phoenix candles; at the top center of the frame the Mystic Woman sits upright on " +
      "the Nine-Dragon couch, with a nine-dragon flying-phoenix chignon and a crimson " +
      "silk-gauze robe of gold thread, holding up a white jade tablet (gui); right of " +
      "center in the frame a blue-clad maiden with spiral hair buns holds a jade tray and " +
      "hands Song Jiang the three scrolls of the heavenly book wrapped in a yellow silk " +
      "wrapper; at the bottom of the frame, before the steps, Song Jiang, dark-faced and " +
      "short, with the characters tattooed on his face, bows twice with his head lowered. " +
      "Deductions: The Mystic Woman in a phoenix crown and embroidered cape or holding a " +
      "sword; Song Jiang wearing a cangue or holding a staff; the heavenly book unrolled.",
  },
  "shuihu-043": {
    coreKey:
      "At the edge of the red-leaved woods in the morning light: Li Gui, his face smeared " +
      "with ink and a broad axe in each hand, steps out to block the road, and Li Kui, " +
      "pudao (long-handled saber) in hand and a waist saber at his side, stops and sizes " +
      "him up",
    groundTruth:
      "Chapter 43, \"The False Li Kui Waylays a Lone Traveler; the Black Whirlwind Kills " +
      "Four Tigers on Yi Ridge\". Li Gui \"wore a red silk headscarf tied up in horns and " +
      "a quilted jacket of coarse cloth, held two broad axes in his hands, and had smeared " +
      "black ink on his face\"; Li Kui \"put on his felt hat, took up his pudao, and " +
      "buckled on his waist saber\"; \"it was early autumn, and the leaves were just " +
      "turning red\".",
    evaluationCriteria:
      "Full credit: Early morning at the edge of a wood of big red-leaved trees; on the " +
      "right of the frame Li Gui, in a red silk headscarf tied up in horns and a quilted " +
      "jacket of coarse cloth, a broad axe gripped in each hand and ink smeared on his " +
      "face, steps out from behind a tree to block the road; on the left of the frame Li " +
      "Kui, in a felt hat, pudao in hand and a waist saber at his side, stops and sizes " +
      "him up, his pudao not yet leveled. Deductions: Li Kui holding broad axes or with " +
      "ink smeared on his face; the two coming to blows or blood shown; any figure drawn " +
      "with opera face paint.",
  },
  "shuihu-044": {
    coreKey:
      "At a street corner in Jizhou: Zhang Bao grabs Yang Xiong by the chest and two " +
      "soldiers drag back his hands, and Shi Xiu, setting down his load of firewood, parts " +
      "the crowd and steps up to talk them down",
    groundTruth:
      "Chapter 44, \"The Brocade Panther Meets Dai Zong on a Narrow Path; the Sickly " +
      "General Encounters Shi Xiu in the Long Street\". Yang Xiong has \"a pale yellow " +
      "face\" and \"showed a body covered in indigo tattoos\", and a lyric says \"beside " +
      "his temple he loves to wear a green hibiscus\" and \"on his vest is written the " +
      "character for 'executioner'\"; he \"was grabbed by the chest by Zhang Bao, and " +
      "from behind two more came and dragged back his hands\"; Shi Xiu \"set down his " +
      "load of firewood and parted the crowd\".",
    evaluationCriteria:
      "Full credit: In the middle of the frame Yang Xiong, with a pale yellow face and a " +
      "green hibiscus at his temple, in a red shirt with sleeves rolled up showing the " +
      "tattoos on both arms, the character for \"executioner\" written on the front of his " +
      "vest, is grabbed by the chest by Zhang Bao in front of him while two soldiers " +
      "behind him drag back both his hands; on the left of the frame Shi Xiu, his load of " +
      "firewood set down at his feet, parts the crowd and talks them down, not yet " +
      "raising a hand. Deductions: Yang Xiong with a long beard or drawn with opera face " +
      "paint; a ghost-head saber; Shi Xiu throwing a punch, anyone swinging fists in a " +
      "beating, or blood shown (Zhang Bao gripping his chest and the soldiers dragging " +
      "his hands do not count).",
  },
  "shuihu-045": {
    coreKey:
      "A dead-end lane at the fifth watch: Shi Xiu, a sharp wrist-slashing knife at his " +
      "side, crouches in the shadows, and the ascetic (toutuo), a wooden fish (temple " +
      "block) under his arm, comes to the mouth of the lane and peers furtively about, " +
      "neither striking it nor aware of him",
    groundTruth:
      "Chapter 45, \"Yang Xiong Drunkenly Rails at Pan Qiaoyun; Shi Xiu Cleverly Kills " +
      "Pei Ruhai\". Shi Xiu \"buckled on this sharp wrist-slashing knife for " +
      "self-defense\", \"slipped straight into the lane by Yang Xiong's back gate, and was " +
      "crouching in the shadows peering out\"; \"just then he saw that ascetic come to " +
      "the mouth of the lane with the wooden fish under his arm, peering furtively " +
      "about\". Seizing him and laying the knife on his neck comes later.",
    evaluationCriteria:
      "Full credit: A dead-end lane before daybreak; on the left of the frame, in the " +
      "shadows, Shi Xiu crouches with one hand on the wall, the wrist-slashing knife " +
      "sheathed at his waist and his hand not on it; on the right of the frame, at the " +
      "mouth of the lane, the ascetic, in a monk's long gown (zhiduo) and knee guards, a " +
      "wooden fish under his arm, peers furtively about, neither striking it nor aware of " +
      "Shi Xiu. Deductions: The knife out of its sheath or laid on a neck; blood shown; " +
      "the ascetic striking the wooden fish; Pei Ruhai, Pan Qiaoyun, or the incense table " +
      "in the picture.",
  },
  "shuihu-046": {
    coreKey:
      "The Zhu Family Inn at night: Yang Xiong, Shi Xiu, and Shi Qian sit around the " +
      "table, laughing as they tear apart by hand the rooster they stole and cooked, and a " +
      "dozen-odd pudao (long-handled saber) are stuck under the eaves",
    groundTruth:
      "Chapter 46, \"The Sickly General Wreaks Havoc on Cuiping Hill; the Desperado Burns " +
      "Down the Zhu Family Inn\". \"Shi Qian, grinning and chuckling, went to the stove " +
      "and lifted out a great big rooster\"; \"the three of them laughed for a while, then " +
      "tore the bird apart with their hands and ate it\"; earlier Shi Xiu saw a dozen-odd " +
      "pudao stuck under the eaves. The waiter discovering it comes later.",
    evaluationCriteria:
      "Full credit: Inside the inn at night; in the middle of the frame a wine jar, cooked " +
      "dishes, big bowls, and the cooked rooster on the table; on the right of the frame " +
      "Shi Qian tears at the bird with a laugh; on the left of the frame Yang Xiong, with " +
      "a pale yellow face, reaches out and pulls at the bird; behind the table Shi Xiu " +
      "reaches out with a laugh; none of the three holds a blade, and a dozen-odd pudao " +
      "are stuck under the eaves by the door. Deductions: A live chicken; anyone holding a " +
      "blade; the inn waiter in the picture; Shi Qian made up as an opera clown with a " +
      "white nose.",
  },
  "shuihu-047": {
    coreKey:
      "In an old man's house in Zhu Family Village: Old Man Zhongli raises his hand and " +
      "points out the turn at the white poplar, and Shi Xiu, disguised as a firewood " +
      "seller, bows twice and asks the way",
    groundTruth:
      "Chapter 47, \"The Sky-Pouncing Eagle Twice Writes Letters of Life and Death; Song " +
      "Gongming Attacks the Zhu Family Manor a First Time\". \"The old man poured out two " +
      "bowls of white wine and ladled out a bowl of porridge, and had Shi Xiu eat\"; Shi " +
      "Xiu \"bowed twice in thanks and said: 'Grandfather, show me the way out.'\"; \"just " +
      "look for the white poplars, and there you can turn\". Asking his surname and Yang " +
      "Lin's capture come later.",
    evaluationCriteria:
      "Full credit: Inside the house at dusk; in the middle of the frame two bowls of " +
      "white wine and a bowl of porridge on the table, a load of firewood set inside the " +
      "door, and a white poplar outside the door at the back; on the right of the frame " +
      "Old Man Zhongli, empty-handed, raises his hand and points toward the white poplar; " +
      "on the left of the frame Shi Xiu, disguised as a firewood seller, no weapon " +
      "showing, bows twice. Deductions: Weapons drawn against each other; Yang Lin or Zhu " +
      "Biao in the picture; the old man wearing a yellow vest marked with the character " +
      "\"Zhu\"; the white poplar cut down.",
  },
  "shuihu-048": {
    coreKey:
      "Below the hillside behind the Zhu Family Manor: Hu Sanniang, in chain-link armor " +
      "over red gauze, spurs her horse on and wields her twin sabers, and Wang Ying, spear " +
      "leveled, parries, the contest still undecided",
    groundTruth:
      "Chapter 48, \"Ten Feet of Steel Captures Wang the Stumpy Tiger Single-Handed; Song " +
      "Gongming Attacks the Zhu Family Manor a Second Time\". \"A pair of gold hairpins " +
      "presses her cicada-wing locks; her phoenix slippers rest slantwise in the jeweled " +
      "stirrups. Chain-link armor lined with red gauze, an embroidered sash at her " +
      "willowy waist, she sits squarely astride\"; \"one well practiced with twin sabers, " +
      "the other outstanding with a single spear\". Wang Ying is \"short of limb and " +
      "body\" (Chapter 32). Lifting him off the carved saddle comes later.",
    evaluationCriteria:
      "Full credit: Daytime below the hillside; on the right of the frame Hu Sanniang, " +
      "with cicada-wing locks and gold hairpins, red gauze beneath her chain-link armor " +
      "and an embroidered sash at her waist, rides with a saber flourished in each hand; " +
      "on the left of the frame Wang Ying, short of limb and body, on horseback, levels " +
      "his spear and parries, the contest still undecided; at the right rear of the frame " +
      "manor hands on horseback. Deductions: A red brocade lasso; the red armor costume " +
      "(kao), back flags, or pheasant plumes of opera; Wang Ying already captured; blood " +
      "shown.",
  },
  "shuihu-anim-037": {
    coreKey:
      "Zhang Heng at the stern sculling and looking back with a cold sneer, Song Jiang " +
      "crouching in the cabin, and the Mu brothers on the shoal leveling their sabers, " +
      "with animated flames, scull oar and ripples, and reeds",
    groundTruth:
      "Chapter 37, \"The Unstoppable Gives Chase to the Timely Rain; the Boat Blaze Wreaks " +
      "Havoc on the Xunyang River\". \"They had already reached the shoal, with a " +
      "dozen-odd torches\"; \"Song Jiang and the two escort officers crouched together in " +
      "the cabin of the boat\"; the boatman went on \"sculling all the while\"; Zhang Heng " +
      "has \"a yellow beard, red hair, and red eyes\", and his broad-bladed saber lies " +
      "under the deck planks. Forcing them into the water comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Zhang Heng, with a yellow beard and red " +
      "hair, stands at the stern sculling and looks back with a cold sneer, no blade in " +
      "his hands, and in the cabin Song Jiang, dark-faced and short, with the characters " +
      "tattooed on his face and no cangue, crouches with the two escort officers; on the " +
      "left of the frame a dozen-odd torches on the shoal, and Mu Hong and Mu Chun in " +
      "front leveling their pudao (long-handled saber); the flames, the scull oar and " +
      "ripples, and the reeds loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Zhang Heng holding a blade; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-038": {
    coreKey:
      "Zhang Shun in midstream hauling Li Kui up out of the water and Song Jiang and Dai " +
      "Zong crying out in dismay on the bank, with animated spray and ripples, capsized " +
      "boat, and willow branches",
    groundTruth:
      "Chapter 38, \"The Timely Rain Meets the Magic Messenger; the Black Whirlwind Fights " +
      "White Streak in the Waves\". \"That man hauled Li Kui up, then ducked him under " +
      "again\"; Zhang Shun has \"frost-white skin all over his body\" and \"tied on a pair " +
      "of swimming trunks flat and tight\"; Li Kui \"had on only a checkered cloth towel " +
      "tied round him\"; Song Jiang and Dai Zong, \"the two of them, could only cry out in " +
      "dismay on the bank\".",
    evaluationCriteria:
      "Full credit: On the right of the frame a fishing boat lies capsized in midstream, " +
      "and Zhang Shun, fair-skinned, with a dot of red on his topknot, hauls the " +
      "bare-chested Li Kui up out of the water, both men hidden in the waves below the " +
      "waist, with Zhang Shun's swimming trunks and Li Kui's cloth wrap showing at the " +
      "waterline; on the left of the frame, on the bank, Song Jiang, dark-faced and " +
      "short, with the characters tattooed on his face, stands beside Dai Zong, in a black " +
      "gauze headscarf with a green flower tucked in it, both crying out in dismay; the " +
      "spray and ripples, the capsized boat, and the willow branches loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Li Kui holding broad axes; anyone fully " +
      "naked; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-039": {
    coreKey:
      "Song Jiang standing drunk before the whitewashed wall, brush raised, writing a ci " +
      "lyric to the tune \"Xijiang Yue\" (Moon over the West River), with animated wine " +
      "banner, fishing boats, and green curtains",
    groundTruth:
      "Chapter 39, \"In Xunyang Tower Song Jiang Recites a Rebellious Poem; at Liangshan " +
      "Marsh Dai Zong Delivers a Forged Letter\". \"He saw that on the whitewashed wall " +
      "there were many poems written by earlier visitors\"; Song Jiang, \"riding the high " +
      "spirits of the wine, ground the ink thick and dipped the brush full\" and set to " +
      "writing; before the tower a pole holds out a blue cloth wine banner, and upstairs " +
      "there are blue-green railings and green curtains. The four-line poem and the " +
      "signature come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the whitewashed wall bears old inscriptions " +
      "in ink, and Song Jiang, dark-faced and short, with the characters tattooed on his " +
      "face, stands alone before it, brush raised, writing; on the left of the frame a " +
      "wine vessel, an inkstone, and vermilion plates and dishes on the table; a blue " +
      "cloth wine banner beyond the eaves; the wine banner, the fishing boats, and the " +
      "green curtains loop smoothly, driven by SMIL or inline CSS. Deductions: Song Jiang " +
      "wearing a cangue or with his hair hanging loose; the waiter or Huang Wenbing in the " +
      "picture; writing on a paper scroll; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-040": {
    coreKey:
      "Song Jiang and Dai Zong sitting bound back to back, Li Kui in midair with a broad " +
      "axe in each hand, and a merchant beating a gong on his cart, with animated banner " +
      "and tassels, paper flowers, and gong face",
    groundTruth:
      "Chapter 40, \"The Gallant Men of Liangshan Marsh Raid the Execution Ground; the " +
      "Heroes Hold a Small Sworn Gathering at the White Dragon Temple\". \"Song Jiang was " +
      "set facing south with his back to the north, and Dai Zong facing north with his " +
      "back to the south, and each was made to sit down\"; the two have their hair " +
      "\"twisted into a pear-shaped topknot\"; a merchant \"stood up on his cart and " +
      "struck it, clang, clang, two or three times\"; Li Kui \"came leaping down out of " +
      "midair\". Cutting down the executioners comes later.",
    evaluationCriteria:
      "Full credit: In the center of the frame Song Jiang, dark-faced and short, with the " +
      "characters tattooed on his face, and Dai Zong, their hair twisted into pear-shaped " +
      "topknots, a red paper flower stuck in each head, no cangues, sit bound back to " +
      "back, and the executioner holds his blade, not yet fallen; at the upper right of " +
      "the frame the bare-chested Li Kui, a broad axe in each hand, is in midair; on the " +
      "left of the frame Prefect Cai Jiu reins in his horse, and at the top of the frame a " +
      "merchant beats a gong; the banner and tassels, the paper flowers, and the lingering " +
      "tremor of the gong face loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Li Kui landed; blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-041": {
    coreKey:
      "Li Jun catching the boat with a grappling hook and leaping across, Huang Wenbing " +
      "running to the stern about to jump, and Zhang Shun slipping up from under the " +
      "water, with animated firelight reflections and fire and smoke in the city",
    groundTruth:
      "Chapter 41, \"Song Jiang Takes Wuwei Garrison by Guile; Zhang Shun Captures Huang " +
      "Wenbing Alive\". \"With one grappling hook he caught hold of the boat and leapt " +
      "across\"; Huang Wenbing \"ran toward the stern\"; \"from under the water a man had " +
      "already slipped across\"; the fire \"lit the whole surface of the river red\". " +
      "Seizing him around the waist comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Li Jun, ruddy-faced, has caught the " +
      "official boat with a grappling hook and is leaping across; on the left of the " +
      "frame, at the stern, Huang Wenbing is about to jump, not yet in the water, and in " +
      "the water below the stern the pale shape of Zhang Shun slips toward him, not yet " +
      "surfaced; in the middle of the frame the boatmen and attendants on the official " +
      "boat are in a panic; the firelight reflections and the fire and smoke loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Huang Wenbing in the water or " +
      "seized; blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-042": {
    coreKey:
      "The Mystic Woman sitting upright on the Nine-Dragon couch, a blue-clad maiden " +
      "handing Song Jiang the heavenly book on a jade tray, and Song Jiang bowing twice, " +
      "with animated candle flames, and pearl curtains and banners",
    groundTruth:
      "Chapter 42, \"Receiving the Three Scrolls of the Heavenly Book in Huandao Village; " +
      "Song Gongming Meets the Mystic Woman of the Ninth Heaven\". \"Brought out on a " +
      "jade tray a yellow silk wrapper holding three scrolls of the heavenly book, and " +
      "handed it to Song Jiang\"; \"in the very center, on the seven-jeweled Nine-Dragon " +
      "couch, sat that goddess\"; dragon lamps and phoenix candles in the hall. Tucking " +
      "the book into his sleeve comes later.",
    evaluationCriteria:
      "Full credit: At the top center of the frame the Mystic Woman sits on the " +
      "Nine-Dragon couch, with a nine-dragon flying-phoenix chignon and a crimson " +
      "silk-gauze robe of gold thread; right of center in the frame a blue-clad maiden " +
      "with spiral hair buns holds a jade tray and hands Song Jiang the three scrolls of " +
      "the heavenly book in a yellow silk wrapper; at the bottom of the frame, before the " +
      "steps, Song Jiang, dark-faced and short, with the characters tattooed on his face, " +
      "bows twice with his head lowered; the candle flames and the pearl curtains and " +
      "banners loop smoothly, driven by SMIL or inline CSS. Deductions: The Mystic Woman " +
      "in a phoenix crown and embroidered cape; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-043": {
    coreKey:
      "Li Gui, face smeared with ink and a broad axe in each hand, stepping out to block " +
      "the road and Li Kui, pudao (long-handled saber) in hand, stopping to size him up, " +
      "with animated red leaves, thin mist, and branches and leaves",
    groundTruth:
      "Chapter 43, \"The False Li Kui Waylays a Lone Traveler; the Black Whirlwind Kills " +
      "Four Tigers on Yi Ridge\". Li Gui \"held two broad axes in his hands, and had " +
      "smeared black ink on his face\"; Li Kui \"put on his felt hat, took up his pudao, " +
      "and buckled on his waist saber\"; \"it was early autumn, and the leaves were just " +
      "turning red\". Leveling the saber and knocking him down with a thrust comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Li Gui, in a red silk headscarf tied up in " +
      "horns, a broad axe gripped in each hand and ink smeared on his face, steps out " +
      "from behind a tree to block the road; on the left of the frame Li Kui, in a felt " +
      "hat, pudao in hand and a waist saber at his side, stops, his pudao not yet " +
      "leveled; the red leaves, the thin mist, and the branches and leaves loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Li Kui holding broad axes or smeared with " +
      "ink; blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-044": {
    coreKey:
      "Zhang Bao grabbing Yang Xiong by the chest and two soldiers dragging back his " +
      "hands, and Shi Xiu setting down his load of firewood and stepping up to talk them " +
      "down, with animated hibiscus and vest hem, and dust",
    groundTruth:
      "Chapter 44, \"The Brocade Panther Meets Dai Zong on a Narrow Path; the Sickly " +
      "General Encounters Shi Xiu in the Long Street\". Yang Xiong has \"a pale yellow " +
      "face\", and a lyric says \"beside his temple he loves to wear a green hibiscus\"; " +
      "he \"was grabbed by the chest by Zhang Bao, and from behind two more came and " +
      "dragged back his hands\"; Shi Xiu \"at once set down his load of firewood and " +
      "parted the crowd\". Felling them with one punch apiece comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Yang Xiong, with a pale yellow face and a " +
      "green hibiscus at his temple, in a red shirt with sleeves rolled up, the character " +
      "for \"executioner\" written on the front of his vest, is grabbed by the chest by " +
      "Zhang Bao while two soldiers drag back both his hands; on the left of the frame " +
      "Shi Xiu, his load of firewood at his feet, parts the crowd and talks them down, " +
      "not yet raising a hand; the hibiscus and vest hem and the dust loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Yang Xiong drawn with opera face paint; " +
      "Shi Xiu throwing a punch, anyone swinging fists in a beating, or blood shown " +
      "(Zhang Bao gripping his chest and the soldiers dragging his hands do not count); " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "shuihu-anim-045": {
    coreKey:
      "Shi Xiu, knife at his side, crouching in the shadows of the dead-end lane and the " +
      "ascetic (toutuo), a wooden fish (temple block) under his arm, peering about at the " +
      "mouth of the lane, with animated white breath and withered grass atop the wall",
    groundTruth:
      "Chapter 45, \"Yang Xiong Drunkenly Rails at Pan Qiaoyun; Shi Xiu Cleverly Kills " +
      "Pei Ruhai\". Shi Xiu \"buckled on this sharp wrist-slashing knife for " +
      "self-defense\" and \"was crouching in the shadows peering out\"; \"just then he saw " +
      "that ascetic come to the mouth of the lane with the wooden fish under his arm, " +
      "peering furtively about\". It is the fifth watch in the eleventh month, before " +
      "daybreak. Seizing him and laying the knife on his neck comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, in the shadows of the lane, Shi Xiu " +
      "crouches with one hand on the wall, the wrist-slashing knife sheathed at his " +
      "waist; on the right of the frame, at the mouth of the lane, the ascetic, in a " +
      "monk's long gown (zhiduo) and knee guards, a wooden fish under his arm, peers " +
      "furtively about; the white breath and the withered grass loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: The knife out of its sheath; blood shown; the " +
      "ascetic striking the wooden fish, or the sky growing light; Pei Ruhai, Pan " +
      "Qiaoyun, or the incense table in the picture; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-046": {
    coreKey:
      "The three around the table laughing as they tear apart by hand the rooster they " +
      "stole and cooked, and pudao (long-handled saber) stuck under the eaves, with " +
      "animated stove fire and steam, and weeping willows outside the door",
    groundTruth:
      "Chapter 46, \"The Sickly General Wreaks Havoc on Cuiping Hill; the Desperado Burns " +
      "Down the Zhu Family Inn\". \"Shi Qian, grinning and chuckling, went to the stove " +
      "and lifted out a great big rooster\"; they \"tore the bird apart with their hands " +
      "and ate it\"; the inn has \"several hundred weeping willows before its door\", and " +
      "a dozen-odd pudao are stuck under the eaves. The waiter discovering it comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame a wine jar, cooked dishes, and the cooked " +
      "rooster on the table; on the right of the frame Shi Qian tears at the bird with a " +
      "laugh; on the left of the frame Yang Xiong, with a pale yellow face, reaches out " +
      "and pulls at the bird; behind the table Shi Xiu reaches out; none of the three " +
      "holds a blade, and a dozen-odd pudao are stuck under the eaves; the stove fire and " +
      "steam and the weeping willows loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A live chicken; anyone holding a blade; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-047": {
    coreKey:
      "Old Man Zhongli raising his hand to point out the turn at the white poplar and Shi " +
      "Xiu bowing twice to ask the way, with animated lingering warmth, lamp flame, and " +
      "poplar leaves",
    groundTruth:
      "Chapter 47, \"The Sky-Pouncing Eagle Twice Writes Letters of Life and Death; Song " +
      "Gongming Attacks the Zhu Family Manor a First Time\". \"The old man poured out two " +
      "bowls of white wine and ladled out a bowl of porridge, and had Shi Xiu eat\"; Shi " +
      "Xiu \"bowed twice in thanks and said\" and asked the way; \"just look for the white " +
      "poplars, and there you can turn\". Asking his surname and Yang Lin's capture come " +
      "later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame two bowls of white wine and a bowl with a " +
      "little porridge left on the table, and a white poplar outside the door at the " +
      "back; on the right of the frame Old Man Zhongli, empty-handed, raises his hand and " +
      "points toward the white poplar; on the left of the frame Shi Xiu, disguised as a " +
      "firewood seller, bows twice; the lingering warmth, the lamp flame, and the poplar " +
      "leaves loop smoothly, driven by SMIL or inline CSS. Deductions: Weapons drawn " +
      "against each other; the white poplar cut down; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-048": {
    coreKey:
      "Hu Sanniang, in chain-link armor over red gauze, wielding twin sabers and Wang " +
      "Ying parrying with spear leveled, with animated dust, spear tassel and manes and " +
      "tails, and embroidered sash and red gauze",
    groundTruth:
      "Chapter 48, \"Ten Feet of Steel Captures Wang the Stumpy Tiger Single-Handed; Song " +
      "Gongming Attacks the Zhu Family Manor a Second Time\". \"Chain-link armor lined " +
      "with red gauze, an embroidered sash at her willowy waist, she sits squarely " +
      "astride\"; \"one well practiced with twin sabers, the other outstanding with a " +
      "single spear\". Wang Ying is \"short of limb and body\" (Chapter 32). Lifting him " +
      "off the carved saddle comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Hu Sanniang, with cicada-wing locks and " +
      "gold hairpins, red gauze beneath her chain-link armor and an embroidered sash at " +
      "her waist, rides with a saber flourished in each hand; on the left of the frame " +
      "Wang Ying, on horseback, levels his spear and parries, the contest still " +
      "undecided; the dust, the spear tassel and manes and tails, and the embroidered " +
      "sash and red gauze loop smoothly, driven by SMIL or inline CSS. Deductions: A red " +
      "brocade lasso; a red armor costume (kao), back flags, or pheasant plumes; blood " +
      "shown; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
};
