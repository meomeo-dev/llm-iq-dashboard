/**
 * 《西游记》第 21–40 回候选的英文标签与英文评判标准，由 src/core/classics/xiyou/ch021-030.ts、
 * ch031-040.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const XIYOU_CH021_040_LABELS_EN: Readonly<Record<string, string>> = {
  "xiyou-021": "Ch. 21 · The Yellow Wind Demon Blows His Wind",
  "xiyou-022": "Ch. 22 · Clash on the Bank of Flowing Sands River",
  "xiyou-023": "Ch. 23 · Bajie Gropes Blindfolded for a Heaven-Sent Bride",
  "xiyou-024": "Ch. 24 · Pilgrim Steals the Ginseng Fruit",
  "xiyou-025": "Ch. 25 · The Universe in a Sleeve",
  "xiyou-026": "Ch. 26 · Guanyin Revives the Tree with Sweet Spring Water",
  "xiyou-027": "Ch. 27 · The Corpse Demon's First Trick on Tang Sanzang",
  "xiyou-028": "Ch. 28 · The Monkeys of Flower-Fruit Mountain Kowtow",
  "xiyou-029": "Ch. 29 · Baihuaxiu Unties the Monk and Hands Over a Letter",
  "xiyou-030": "Ch. 30 · The Yellow Robe Demon Sprays Water to Make a Tiger",
  "xiyou-031": "Ch. 31 · Clash on the Summit of Bowl Mountain",
  "xiyou-032": "Ch. 32 · Bajie Bows and Hails the Rocks",
  "xiyou-033": "Ch. 33 · Mountains Summoned to Crush Pilgrim",
  "xiyou-034": "Ch. 34 · The Gourd Captures Zhexing Sun",
  "xiyou-035": "Ch. 35 · Golden Horn Fans Fire with the Plantain Fan",
  "xiyou-036": "Ch. 36 · Smashing the Stone Lion at Baolin Temple",
  "xiyou-037": "Ch. 37 · The Ghost King Visits Sanzang by Night",
  "xiyou-038": "Ch. 38 · Lowering Bajie into the Well on the Rod",
  "xiyou-039": "Ch. 39 · Manjushri's Demon-Revealing Mirror",
  "xiyou-040": "Ch. 40 · A Child Hung from a Pine Top on Mount Hao",
};

/** 静态与动态候选 id → 英文评判标准 */
export const XIYOU_CH021_040_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "xiyou-021": {
    coreKey:
      "The Yellow Wind Demon turns his head and blows his wind: golden helmet with " +
      "pheasant-tail plume, goose-yellow robe, and three-pronged fork; Wukong's clones " +
      "spin like spinning wheels",
    groundTruth:
      "Chapter 21, \"The Guardians Conjure a Farmstead to Detain the Great Sage; Lingji of " +
      "Sumeru Subdues the Wind Demon\". The Yellow Wind Demon has \"a golden helmet dazzling " +
      "in the sun and golden armor gleaming with light\", a pheasant-tail plume and a " +
      "goose-yellow gauze robe, and holds a three-pronged steel fork; he turns his head and, " +
      "\"facing the Xun quarter\", blows out the yellow wind; Wukong's clones \"spun wildly " +
      "like spinning wheels\".",
    evaluationCriteria:
      "Full credit: On the left the human-shaped Yellow Wind Demon has his golden helmet " +
      "with pheasant-tail plume, goose-yellow gauze robe, and three-pronged steel fork all " +
      "present, turning his head and opening his mouth to blow; on the right a crowd of " +
      "Wukong's clones spin wildly in the yellow sand, with a clear visual hierarchy. " +
      "Deductions: The Yellow Wind Demon drawn with a rat's head or in his true form as a " +
      "yellow-furred marten; Lingji Bodhisattva, the flying-dragon staff, or the " +
      "eight-clawed golden dragon appearing prematurely; Bajie or Sha Wujing present; only " +
      "one Wukong drawn, with no clones.",
  },
  "xiyou-anim-021": {
    coreKey:
      "Blowing wind at the mouth of Yellow Wind Cave, with animated sweeping yellow sand, " +
      "spinning clones, and pheasant plume and robe hem",
    groundTruth:
      "Chapter 21, \"The Guardians Conjure a Farmstead to Detain the Great Sage; Lingji of " +
      "Sumeru Subdues the Wind Demon\". The Yellow Wind Demon, with golden helmet and " +
      "pheasant plume and a goose-yellow gauze robe, holds a three-pronged steel fork, turns " +
      "his head and, \"facing the Xun quarter\", blows out the yellow wind; Wukong's " +
      "body-beyond-the-body clones are blown until they \"spun wildly like spinning " +
      "wheels\".",
    evaluationCriteria:
      "Full credit: On the left the human-shaped Yellow Wind Demon turns his head and blows, " +
      "and on the right a crowd of Wukong's clones spin wildly; the sweeping yellow sand, " +
      "the spinning clones, and the fluttering pheasant plume and robe hem loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The Yellow Wind Demon drawn with a rat's " +
      "head or in his true marten form; Lingji Bodhisattva or the golden dragon appearing; " +
      "Bajie or Sha Wujing present; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-022": {
    coreKey:
      "Rake and staff cross on the bank of Flowing Sands River: the river monster with red " +
      "hair, indigo face, goose-yellow cloak, nine skulls, and precious staff",
    groundTruth:
      "Chapter 22, \"Bajie Wages a Great Battle at Flowing Sands River; Moksa, by Dharma " +
      "Command, Takes In Wujing\". The monster \"in a whirlwind rushed up onto the bank, " +
      "heading straight to seize the Tang Monk\", with flame-red hair, an indigo face, and a " +
      "goose-yellow cloak, \"nine skulls hanging below his neck and a precious staff in " +
      "hand\"; Wukong carries his master up the high bank and Bajie meets the attack.",
    evaluationCriteria:
      "Full credit: The rake and staff crossing on the bank are the main subject; the " +
      "monster's red hair, indigo face, goose-yellow cloak, nine skulls, and precious staff " +
      "are all present; Bajie, in his zhiduo robe, raises his rake; Wukong carries the Tang " +
      "Monk away up the high bank. Deductions: The monster drawn as a shaven-headed monk in " +
      "monastic dress, wearing large prayer beads, or holding a crescent-moon spade; no " +
      "skulls below his neck; Wukong swinging his rod to join the fight; Bajie already " +
      "stripped and in the water.",
  },
  "xiyou-anim-022": {
    coreKey:
      "The clash on the bank of Flowing Sands River, with animated breaking waves, skulls, " +
      "and red hair and cloak hem",
    groundTruth:
      "Chapter 22, \"Bajie Wages a Great Battle at Flowing Sands River; Moksa, by Dharma " +
      "Command, Takes In Wujing\". The monster, with flame-red hair, an indigo face, and a " +
      "goose-yellow cloak, nine skulls hanging below his neck and a precious staff in hand, " +
      "rushes up the bank in a whirlwind to seize the Tang Monk; Wukong hastily carries his " +
      "master up the high bank, and Bajie draws his rake to meet the attack.",
    evaluationCriteria:
      "Full credit: Rake and staff cross; the monster's red hair, indigo face, goose-yellow " +
      "cloak, nine skulls, and precious staff are all present; Wukong carries the Tang Monk " +
      "back up the high bank; the waves, skulls, and red hair and cloak hem loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The monster shaven-headed in monastic " +
      "dress, wearing prayer beads, or holding a crescent-moon spade; Wukong swinging his " +
      "rod to join the fight; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-023": {
    coreKey:
      "Groping for a heaven-sent bride: Bajie, a kerchief over his face, lunges about with " +
      "outstretched hands; the middle-aged woman sits upright in the seat of honor; the " +
      "hall is full of silver candles",
    groundTruth:
      "Chapter 23, \"Sanzang Does Not Forget His Origins; Four Sages Test the Chan Mind\". " +
      "Bajie, in a blue-green brocade-cloth zhiduo robe, puts a kerchief over his head to " +
      "\"cover his face and bump into a heaven-sent marriage\"; \"lunging east, he hugged a " +
      "pillar; lunging west, he groped at the wooden wall\", catching no one; \"the whole " +
      "hall glowed with silver candles\", and the woman sits upright in the seat of honor.",
    evaluationCriteria:
      "Full credit: In the foreground Bajie, a kerchief over his face, lunges about with " +
      "outstretched hands and hugs a pillar; the woman sits upright in the seat of honor; " +
      "the hall is full of silver candles; clothing and ornaments are recognizable. " +
      "Deductions: Drawn as the tossing of an embroidered ball, or Bajie holding an " +
      "embroidered ball; Bajie already bound tight by ropes; Bajie shouldering the " +
      "nine-toothed rake; Wukong, the Tang Monk, or Sha Wujing in the hall; set in a pine " +
      "and cypress forest.",
  },
  "xiyou-anim-023": {
    coreKey:
      "The instant of groping for a heaven-sent bride, with animated candle flames and " +
      "passing garment shadows and embroidered sashes",
    groundTruth:
      "Chapter 23, \"Sanzang Does Not Forget His Origins; Four Sages Test the Chan Mind\". " +
      "Bajie, in a blue-green brocade-cloth zhiduo robe, puts a kerchief over his head to " +
      "\"cover his face and bump into a heaven-sent marriage\"; \"lunging east, he hugged a " +
      "pillar; lunging west, he groped at the wooden wall\"; he hears only the jingle of " +
      "girdle pendants and smells orchid and musk, and \"the whole hall glowed with silver " +
      "candles\".",
    evaluationCriteria:
      "Full credit: In the foreground Bajie, a kerchief over his face, reaches out and hugs " +
      "a pillar; the woman sits upright in the seat of honor; the hall is full of silver " +
      "candles; the flickering candle flames and the passing garment shadows and embroidered " +
      "sashes loop smoothly, driven by SMIL or inline CSS. Deductions: Tossing an " +
      "embroidered ball; Bajie bound by ropes or shouldering the nine-toothed rake; Wukong, " +
      "the Tang Monk, or Sha Wujing in the hall; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-024": {
    coreKey:
      "One figure and one tree in the ginseng garden: Wukong knocks a fruit with the golden " +
      "knocker, a slender rod of red gold, and holds up the front of his zhiduo robe as a " +
      "pouch to catch it",
    groundTruth:
      "Chapter 24, \"On Longevity Mountain the Great Immortal Detains an Old Friend; At Five " +
      "Villages Abbey Pilgrim Steals the Ginseng Fruit\". The fruit looks like an infant not " +
      "yet three days old, \"its hands and feet moving wildly, nodding and wagging its " +
      "head\", and falls when struck by metal; Wukong wields the golden knocker (a slender " +
      "rod of red gold two Chinese feet long) in one hand and with the other holds up the " +
      "front of his brocade-cloth zhiduo robe as a pouch.",
    evaluationCriteria:
      "Full credit: One figure and one tree; Wukong climbs the branches, knocking a fruit " +
      "with the slender red-gold rod in one hand and holding up the front of his robe to " +
      "catch it with the other; the infant-shaped fruit and the plantain-like leaves are " +
      "recognizable. Deductions: The golden knocker drawn as a hammer; knocking the fruit " +
      "with the golden-hooped rod; Bajie or Sha Wujing peering up from under the tree; a " +
      "fruit shown falling to the ground or fruit scattered all over the ground; the tree " +
      "pushed over; Qingfeng and Mingyue in the garden.",
  },
  "xiyou-anim-024": {
    coreKey:
      "Knocking and catching the fruit in the ginseng garden, with animated fruit hands and " +
      "feet, plantain-like leaves, and green velvet cord",
    groundTruth:
      "Chapter 24, \"On Longevity Mountain the Great Immortal Detains an Old Friend; At Five " +
      "Villages Abbey Pilgrim Steals the Ginseng Fruit\". The fruit looks like an infant not " +
      "yet three days old, \"its hands and feet moving wildly, nodding and wagging its " +
      "head\"; the leaves \"look just like plantain leaves\"; Wukong wields the golden " +
      "knocker, a slender rod of red gold, in one hand and with the other holds up the front " +
      "of his robe as a pouch.",
    evaluationCriteria:
      "Full credit: One figure and one tree; Wukong climbs the branches holding the slender " +
      "red-gold rod and holding up the front of his robe as a pouch; the infant-shaped fruit " +
      "is recognizable; the fruit's hands and feet, the plantain-like leaves, and the green " +
      "velvet cord loop smoothly, driven by SMIL or inline CSS. Deductions: The golden " +
      "knocker drawn as a hammer; Bajie under the tree; fruit falling to the ground; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-025": {
    coreKey:
      "The universe in a sleeve: Master Zhenyuan, in purple-gold crown and crane cloak with " +
      "a boyish face, parries the rod with his jade whisk and spreads his sleeve to sweep " +
      "them in",
    groundTruth:
      "Chapter 25, \"The Immortal Zhenyuan Pursues and Captures the Scripture Pilgrims; " +
      "Pilgrim Sun Wreaks Havoc on Five Villages Abbey\". Master Zhenyuan \"wears a " +
      "purple-gold crown on his head and a carefree crane cloak on his body\", has a face " +
      "like a boy's and three strands of black beard, and \"only twirls a jade whisk in his " +
      "hand\"; he \"spread his robe sleeve gently against the wind\" and enclosed the four " +
      "monks along with the horse.",
    evaluationCriteria:
      "Full credit: Master Zhenyuan, in purple-gold crown and crane cloak, with a boyish " +
      "face and three strands of black beard, parries the rod with his jade whisk and " +
      "spreads his sleeve downward; Wukong swings his rod from the left; the Tang Monk and " +
      "the others, with the white horse, are covered by the sleeve opening at lower right. " +
      "Deductions: Master Zhenyuan drawn as an old man with white hair and a white beard; " +
      "holding a sword or other weapon; a separate bag, gourd, or other magic treasure drawn " +
      "to capture them; wearing a patchwork robe or beating a fish drum; only the Tang Monk " +
      "covered.",
  },
  "xiyou-anim-025": {
    coreKey:
      "The universe in a sleeve, with animated billowing sleeve, auspicious clouds, and " +
      "whisk hair and beard",
    groundTruth:
      "Chapter 25, \"The Immortal Zhenyuan Pursues and Captures the Scripture Pilgrims; " +
      "Pilgrim Sun Wreaks Havoc on Five Villages Abbey\". Master Zhenyuan \"wears a " +
      "purple-gold crown on his head and a carefree crane cloak on his body\", has three " +
      "strands of beard, \"only twirls a jade whisk in his hand\", and \"spread his robe " +
      "sleeve gently against the wind\", enclosing the four monks along with the horse.",
    evaluationCriteria:
      "Full credit: Master Zhenyuan, in purple-gold crown and crane cloak with a boyish " +
      "face, parries the rod with his jade whisk and spreads his sleeve downward, with " +
      "Wukong swinging his rod from the left; the billowing sleeve, the flowing auspicious " +
      "clouds, and the gently swaying whisk hair and beard loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: A white-haired old man; holding a sword; a separate bag or " +
      "magic treasure drawn; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-026": {
    coreKey:
      "Reviving the tree with sweet spring water: Guanyin sprinkles water with her willow " +
      "sprig, Wukong holds up a jade cup, and Bajie and Sha Wujing set the fruit tree " +
      "upright",
    groundTruth:
      "Chapter 26, \"Sun Wukong Seeks a Remedy on the Three Islands; Guanshiyin Revives the " +
      "Tree with Sweet Spring Water\". The three disciples \"lifted the tree, set it upright, " +
      "and banked up the soil\", and bring the spring water in jade cups; \"the Bodhisattva " +
      "carefully sprinkled it on with her willow sprig\"; Guanyin has a coiled-dragon " +
      "chignon, pearl strands, and a plain silk-gauze robe, and Sha Wujing is shaven-headed " +
      "with an indigo face.",
    evaluationCriteria:
      "Full credit: Guanyin sprinkles water with her willow sprig onto the great tree set " +
      "upright, Wukong holds up a jade cup, and Bajie and Sha Wujing steady the tree; the " +
      "pure vase, willow sprig, and jade cup are recognizable. Deductions: Guanyin on a " +
      "lotus throne or drawn with a thousand arms; water poured straight from the mouth of " +
      "the pure vase; Wukong wearing the purple-gold crown or holding the golden-hooped rod; " +
      "Sha Wujing with hair or wearing the nine skulls; water held in a golden basin or " +
      "wooden bucket.",
  },
  "xiyou-anim-026": {
    coreKey:
      "Reviving the tree with sweet spring water, with animated water droplets, the water " +
      "surface in the cup, and unfurling leaves",
    groundTruth:
      "Chapter 26, \"Sun Wukong Seeks a Remedy on the Three Islands; Guanshiyin Revives the " +
      "Tree with Sweet Spring Water\". The three disciples set the ginseng fruit tree " +
      "upright and bring the spring water in jade cups; \"the Bodhisattva carefully " +
      "sprinkled it on with her willow sprig\", and the tree turns green again; Guanyin has " +
      "a coiled-dragon chignon and pearl strands and holds the pure vase in her hand.",
    evaluationCriteria:
      "Full credit: Guanyin sprinkles water with her willow sprig, Wukong holds up a jade " +
      "cup, and Bajie and Sha Wujing steady the tree; the pure vase and willow sprig are " +
      "recognizable; the water droplets, the water surface in the cup, and the leaves loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Guanyin on a lotus throne or with " +
      "a thousand arms; Wukong wearing the purple-gold crown; Sha Wujing wearing skulls; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-027": {
    coreKey:
      "The Corpse Demon's first trick as a young woman: Wukong lands and raises his rod to " +
      "strike her head-on, the Tang Monk reaches out to hold him back, and Sha Wujing stands " +
      "by",
    groundTruth:
      "Chapter 27, \"The Corpse Demon Three Times Toys with Tang Sanzang; The Holy Monk in " +
      "Anger Banishes the Handsome Monkey King\". The Corpse Demon first turns into a young " +
      "woman in kingfisher-green sleeves and a Xiang silk skirt, bringing food to the monks; " +
      "Bajie noses over the jar; Wukong \"put down the alms bowl, whipped out his iron rod, " +
      "and struck at her head\"; the Tang Monk \"held him back with his hands\"; Sha Wujing " +
      "stands by.",
    evaluationCriteria:
      "Full credit: The woman in kingfisher-green sleeves and a Xiang silk skirt; Wukong, " +
      "just landed, raises his rod to strike her head-on; the Tang Monk reaches out to hold " +
      "him back; Bajie noses at the jar; Sha Wujing stands guard nearby; the positions of " +
      "all five are clear. Deductions: A skeleton showing in the woman's shadow or on her " +
      "body; a pile of white bones drawn; the Tang Monk blocking with both arms spread wide; " +
      "Wukong chopping down from midair; Sha Wujing absent; a rainy, gloomy night scene.",
  },
  "xiyou-anim-027": {
    coreKey:
      "The Corpse Demon's first trick, the raised rod held back, with animated dispersing " +
      "cloud, sleeves and robes, and brambles",
    groundTruth:
      "Chapter 27, \"The Corpse Demon Three Times Toys with Tang Sanzang; The Holy Monk in " +
      "Anger Banishes the Handsome Monkey King\". The Corpse Demon first turns into a young " +
      "woman in kingfisher-green sleeves and a Xiang silk skirt, bringing food to the monks; " +
      "Bajie noses over the jar; Wukong lands, \"whipped out his iron rod, and struck at her " +
      "head\"; the Tang Monk \"held him back with his hands\"; Sha Wujing stands by; it is a " +
      "summer day.",
    evaluationCriteria:
      "Full credit: The woman in kingfisher-green sleeves and a Xiang silk skirt; Wukong " +
      "raises his rod to strike her head-on; the Tang Monk reaches out to hold him back; " +
      "Bajie noses at the jar; Sha Wujing stands by; the three effects of dispersing cloud, " +
      "sleeves and robes, and brambles loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A skeleton showing in her shadow, or white bones drawn; the Tang Monk " +
      "blocking with arms spread; Sha Wujing absent; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-028": {
    coreKey:
      "Scorched Flower-Fruit Mountain: Wukong lands from his cloud in tears as seven or " +
      "eight scrawny little monkeys surround him and kowtow",
    groundTruth:
      "Chapter 28, \"On Flower-Fruit Mountain the Fiends Gather in Brotherhood; In Black " +
      "Pine Forest Sanzang Meets a Demon\". Banished, Wukong returns to the mountain and " +
      "sees \"no flowers or grass at all, the mist and rosy clouds all gone; peaks and crags " +
      "collapsed, the woods scorched and withered\"; before the slope \"seven or eight " +
      "little monkeys leapt out, crowded forward, surrounded him, and kowtowed\". Wukong " +
      "still wears the golden fillet.",
    evaluationCriteria:
      "Full credit: A scorched, barren mountain forms the background; Wukong is at the " +
      "center; seven or eight scrawny little monkeys surround him and kowtow; the instant of " +
      "recognition is clear. Deductions: Flower-Fruit Mountain drawn as a fairyland lush " +
      "with flowers and trees and a flying waterfall; a \"Great Sage Equal to Heaven\" " +
      "banner raised; the little monkeys wearing hunters' clothes and boots, or hunters' " +
      "corpses drawn; Wukong in the purple-gold crown or golden chain mail, or holding his " +
      "rod; the Tang Monk, Bajie, Sha Wujing, or the Yellow Robe Demon appearing.",
  },
  "xiyou-anim-028": {
    coreKey:
      "The monkeys kowtowing on the scorched mountain, with animated cloud, dust, and " +
      "kowtowing",
    groundTruth:
      "Chapter 28, \"On Flower-Fruit Mountain the Fiends Gather in Brotherhood; In Black " +
      "Pine Forest Sanzang Meets a Demon\". Flower-Fruit Mountain has \"no flowers or grass " +
      "at all, the mist and rosy clouds all gone\", and the springs in the ravines have " +
      "dried up; Wukong lands from his cloud, and before the slope \"seven or eight little " +
      "monkeys leapt out, crowded forward, surrounded him, and kowtowed\".",
    evaluationCriteria:
      "Full credit: Before the scorched, barren mountain, Wukong stands at the center in " +
      "tears as seven or eight scrawny little monkeys surround him and kowtow; the three " +
      "effects of cloud, dust, and kowtowing loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A flying waterfall or lush flowers and trees; a \"Great Sage Equal to " +
      "Heaven\" banner raised; Wukong in the purple-gold crown or holding his rod; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-029": {
    coreKey:
      "Before the Soul-Fixing Stake in Moon-in-the-Waves Cave: Baihuaxiu unties the Tang " +
      "Monk's ropes and hands him a sealed letter home",
    groundTruth:
      "Chapter 29, \"Escaping Peril, River Float Comes to the Kingdom; Receiving Grace, " +
      "Bajie Returns to the Mountain Forest\". The third princess of the Kingdom of " +
      "Baoxiang, \"whose childhood name is Baihuaxiu\", was carried off thirteen years ago; " +
      "she \"went to the stake, set the Tang Monk free, and handed him the letter\"; at this " +
      "moment the Yellow Robe Demon is fighting Bajie and Sha Wujing in midair outside the " +
      "cave.",
    evaluationCriteria:
      "Full credit: Inside the cave before the Soul-Fixing Stake, the princess hands over " +
      "the letter and the Tang Monk, freed of his bonds, takes it, the ropes hanging down, " +
      "with a clear visual hierarchy between the two. Deductions: The Yellow Robe Demon " +
      "watching inside the cave; Wukong present; Bajie or Sha Wujing entering the cave; the " +
      "Tang Monk still tightly bound and not yet holding the letter; the Tang Monk holding a " +
      "ringed monk's staff or wearing a bamboo hat; the king or the court of Baoxiang " +
      "appearing.",
  },
  "xiyou-anim-029": {
    coreKey:
      "Untying the monk and handing over the letter before the Soul-Fixing Stake, with " +
      "animated rope end and speckled bamboo curtain",
    groundTruth:
      "Chapter 29, \"Escaping Peril, River Float Comes to the Kingdom; Receiving Grace, " +
      "Bajie Returns to the Mountain Forest\". The third princess, Baihuaxiu, carried off " +
      "thirteen years ago, has written a letter home; she \"went to the stake, set the Tang " +
      "Monk free, and handed him the letter\"; a speckled bamboo curtain hangs at the cave " +
      "mouth, and the Yellow Robe Demon is fighting in midair outside the cave.",
    evaluationCriteria:
      "Full credit: Before the Soul-Fixing Stake the princess hands over the letter and the " +
      "Tang Monk, freed of his bonds, takes it, with a clear visual hierarchy between the " +
      "two; the gently swinging rope end and the gently swaying bamboo curtain loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The Yellow Robe Demon in the " +
      "cave; Wukong, Bajie, or Sha Wujing present; the Tang Monk holding a ringed monk's " +
      "staff; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "xiyou-030": {
    coreKey:
      "Spraying water to make a tiger at court: the handsome Yellow Robe Demon in " +
      "magpie-tail cap and jade gauze pleated robe sprays water, and the Tang Monk turns " +
      "into a striped tiger",
    groundTruth:
      "Chapter 30, \"The Evil Demon Assails the True Dharma; The Horse of the Will Recalls " +
      "the Mind-Monkey\". The Yellow Robe Demon turns into a handsome man in a magpie-tail " +
      "cap and a jade gauze pleated robe and \"sprayed a mouthful of water at the Tang " +
      "Monk\"; the Tang Monk appears in tiger form, \"white forehead and round head, " +
      "patterned body and lightning eyes\", and the king is frightened out of his wits.",
    evaluationCriteria:
      "Full credit: On the left the handsome man sprays water, a fierce tiger appears " +
      "before the embroidered stool, and the king behind is terrified; the spraying and the " +
      "transformation into a tiger share the same instant. Deductions: The Yellow Robe Demon " +
      "drawn in his true form with a blue face and fangs, golden armor, or a saber; the Tang " +
      "Monk already locked in an iron cage; the Tang Monk still in human form; Wukong " +
      "present; drawn as the white dragon horse's night assassination attempt in the Silver " +
      "Peace Hall.",
  },
  "xiyou-anim-030": {
    coreKey:
      "Spraying water to make a tiger at court, with animated water mist and tiger tail",
    groundTruth:
      "Chapter 30, \"The Evil Demon Assails the True Dharma; The Horse of the Will Recalls " +
      "the Mind-Monkey\". The Yellow Robe Demon turns into a handsome man in a magpie-tail " +
      "cap and a jade gauze pleated robe and \"sprayed a mouthful of water at the Tang " +
      "Monk\"; the Tang Monk appears in tiger form, \"white forehead and round head, " +
      "patterned body and lightning eyes\", and the king is frightened out of his wits.",
    evaluationCriteria:
      "Full credit: On the left the handsome man sprays water, a fierce tiger appears " +
      "before the embroidered stool, and the king behind is terrified; the spreading water " +
      "mist and the swinging tiger tail loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The true form with a blue face and fangs, golden armor, or a saber; an " +
      "iron cage; Wukong present; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-031": {
    coreKey:
      "Clash on the summit of Bowl Mountain: Wukong, alone, raises his rod and leaves an " +
      "opening; the blue-indigo-faced Yellow Robe Demon swings his saber at his lower body",
    groundTruth:
      "Chapter 31, \"Zhu Bajie Rouses the Monkey King with an Appeal to Loyalty; Pilgrim Sun " +
      "Subdues the Monster by Wit\". The summit is \"half in cloud, half in mist\"; Wukong " +
      "\"raised his rod with both hands\", and the monster, wielding his precious saber, " +
      "\"slashed straight at his lower body\"; the Yellow Robe Demon has a blue-indigo face, " +
      "white fangs, a red beard and red hair, and a pale yellow robe draped slantwise over " +
      "his golden armor.",
    evaluationCriteria:
      "Full credit: On the cloud-and-mist summit Wukong raises his iron rod high while the " +
      "Yellow Robe Demon swings his saber at his lower body, and the instant of the lure is " +
      "clear; the Yellow Robe Demon's blue-indigo face, red beard and red hair, golden " +
      "armor, and yellow robe are recognizable. Deductions: Wukong with three heads and six " +
      "arms or holding three rods; the Yellow Robe Demon drawn with a wolf's head and tail; " +
      "Wukong in the purple-gold crown and golden chain mail; Bajie, Sha Wujing, the " +
      "princess, or the children appearing; bloodstains drawn.",
  },
  "xiyou-anim-031": {
    coreKey:
      "Clash on the summit of Bowl Mountain, with animated cloud and mist, robe and kilt, " +
      "and gleaming blade",
    groundTruth:
      "Chapter 31, \"Zhu Bajie Rouses the Monkey King with an Appeal to Loyalty; Pilgrim Sun " +
      "Subdues the Monster by Wit\". The summit is \"half in cloud, half in mist\"; Wukong " +
      "\"raised his rod with both hands\" to lure the enemy, and the monster, wielding his " +
      "precious saber, \"slashed straight at his lower body\"; the Yellow Robe Demon has a " +
      "blue-indigo face, a red beard and red hair, and a pale yellow robe draped over his " +
      "golden armor, and \"as the saber rose it shone like bright rosy clouds\".",
    evaluationCriteria:
      "Full credit: Wukong raises his iron rod high while the Yellow Robe Demon swings his " +
      "saber at his lower body, both true to the novel in appearance; the flowing cloud and " +
      "mist, the lifting robe and kilt, and the flashing blade loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: Three heads and six arms, or three rods; the Yellow Robe " +
      "Demon with a wolf's head and tail; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-032": {
    coreKey:
      "Bowing to the rocks in a mountain hollow: Bajie sets down his rake and hails three " +
      "square blue-green rocks with a bow, while a jiaoliao insect behind his ear " +
      "eavesdrops",
    groundTruth:
      "Chapter 32, \"On Flat-Top Mountain the Day Sentinel Brings Word; In Lotus Flower " +
      "Cave the Wood Mother Meets Disaster\". In spring Bajie patrols the mountain and in a " +
      "hollow sees \"three square blue-green rocks as big as tabletops\"; he \"put down his " +
      "rake and made the rocks a big, loud bow\"; Wukong, turned into a jiaoliao insect, " +
      "\"clung behind his ear\".",
    evaluationCriteria:
      "Full credit: The three square blue-green rocks in the hollow, the rake on the " +
      "ground, and Bajie bowing and calling out a greeting are all present; the tiny insect " +
      "behind his ear is recognizable; Bajie has a long snout, big ears, and bristles at the " +
      "back of his head. Deductions: The jiaoliao insect drawn as a fly, or Wukong shown in " +
      "monkey form; Bajie shouldering or swinging the rake; writing on the rocks or a cave " +
      "door beside them; the Tang Monk, Sha Wujing, the Golden Horn King, the Silver Horn " +
      "King, or minor demons appearing; an autumn or winter scene.",
  },
  "xiyou-anim-032": {
    coreKey:
      "Bajie hailing the rocks, with animated insect wings, grass, and big ears",
    groundTruth:
      "Chapter 32, \"On Flat-Top Mountain the Day Sentinel Brings Word; In Lotus Flower " +
      "Cave the Wood Mother Meets Disaster\". In spring Bajie sees in a hollow \"three " +
      "square blue-green rocks\"; he \"put down his rake and made the rocks a big, loud " +
      "bow\"; Wukong turns into a jiaoliao insect, \"its thin wings dancing in the wind\", " +
      "and clings behind his ear.",
    evaluationCriteria:
      "Full credit: The three square blue-green rocks, the rake on the ground, and Bajie " +
      "bowing and calling out a greeting are all present, with the tiny insect behind his " +
      "ear recognizable; the three effects of insect wings, grass, and big ears loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The jiaoliao insect drawn as a " +
      "fly, or monkey form shown; Bajie shouldering the rake; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-033": {
    coreKey:
      "The Silver Horn King, disguised as a Taoist, rides on Wukong's back and summons " +
      "mountains: with a mountain on each shoulder Wukong still races on, as a third " +
      "mountain hangs overhead about to fall",
    groundTruth:
      "Chapter 33, \"Heresy Deludes the True Nature; The Primal Spirit Aids the Original " +
      "Mind\". The Silver Horn King turns into a Taoist, \"his star cap gleaming, his " +
      "crane-white hair tousled\", in a feathered robe and cloud slippers; on Wukong's back " +
      "he \"formed a hand seal and recited a true incantation\" to summon mountains; " +
      "Wukong, \"bearing two great mountains, raced like a shooting star after his " +
      "master\", and Mount Tai is then summoned to crush him from above.",
    evaluationCriteria:
      "Full credit: Wukong carries the Taoist on his back and, with a mountain on each " +
      "shoulder, still strides swiftly ahead, while the third mountain hangs over his head, " +
      "not yet fallen; the Taoist's star cap, crane-white hair, feathered robe, and cloud " +
      "slippers are recognizable. Deductions: Drawn as Five Elements Mountain or Five Finger " +
      "Mountain pinning him; the Taoist showing a demonic look or gripping the seven-star " +
      "sword; Wukong holding the iron rod; Wukong already crushed and bleeding from the " +
      "seven apertures; the Tang Monk, Sha Wujing, mountain gods, Nezha, or minor demons " +
      "holding a gourd appearing.",
  },
  "xiyou-anim-033": {
    coreKey:
      "Mountains summoned to crush Pilgrim, with animated crane-white hair and embroidered " +
      "sash, kilt hem, and dust",
    groundTruth:
      "Chapter 33, \"Heresy Deludes the True Nature; The Primal Spirit Aids the Original " +
      "Mind\". The Silver Horn King, disguised as a Taoist, \"his star cap gleaming, his " +
      "crane-white hair tousled\", lies on Wukong's back, \"formed a hand seal and recited a " +
      "true incantation\", and summons mountains onto both his shoulders; Wukong, \"bearing " +
      "two great mountains, raced like a shooting star after his master\", and Mount Tai " +
      "then comes crashing down on his head.",
    evaluationCriteria:
      "Full credit: Wukong carries the Taoist on his back and, with mountains on both " +
      "shoulders, still races on, the third mountain hanging overhead; the Taoist's star " +
      "cap and crane-white hair are recognizable; the crane-white hair and embroidered " +
      "sash, the kilt hem, and the dust loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Drawn as Five Finger Mountain; the Taoist showing a demonic look or " +
      "gripping a sword; Wukong holding his rod; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-034": {
    coreKey:
      "The gourd captures Zhexing Sun: the Silver Horn King, in midair, holds the gourd " +
      "upside down and calls the name, and Wukong answers and is sucked in",
    groundTruth:
      "Chapter 34, \"The Demon King's Clever Scheme Traps the Mind-Monkey; The Great Sage, " +
      "Ever Nimble, Tricks Away the Treasures\". The Silver Horn King \"took the treasure, " +
      "leapt into the air, turned its bottom to the sky and its mouth to the ground\" and " +
      "called \"Zhexing Sun\"; the moment Wukong answered he was sucked in; the Silver Horn " +
      "King's phoenix helmet is whiter than midwinter snow and he wears a python-dragon " +
      "sinew belt; the original text gives him no horns.",
    evaluationCriteria:
      "Full credit: The Silver Horn King holds the gourd upside down in midair, mouth to " +
      "the ground, and Wukong on the ground answers and is sucked toward the gourd's mouth, " +
      "with a clear above-and-below relationship; the Silver Horn King's phoenix helmet and " +
      "armor and Wukong's golden fillet and tiger-skin kilt are recognizable. Deductions: " +
      "Horns on the Silver Horn King's head; the gourd's mouth pointing up or the gourd held " +
      "upright; writing on the gourd or a slip already pasted on it; Wukong bound with rope; " +
      "the Golden Horn King, the nine-tailed fox, minor demons, or the Tang Monk and his " +
      "disciples appearing.",
  },
  "xiyou-anim-034": {
    coreKey:
      "The gourd captures Zhexing Sun, with animated dust and grass sucked upward, robe " +
      "hem, and cloud vapor",
    groundTruth:
      "Chapter 34, \"The Demon King's Clever Scheme Traps the Mind-Monkey; The Great Sage, " +
      "Ever Nimble, Tricks Away the Treasures\". The Silver Horn King \"leapt into the air, " +
      "turned its bottom to the sky and its mouth to the ground\" and called \"Zhexing " +
      "Sun\"; the moment Wukong answered, \"whoosh, he was sucked into the gourd\"; the " +
      "Silver Horn King's phoenix helmet is whiter than midwinter snow, and the original " +
      "text gives him no horns.",
    evaluationCriteria:
      "Full credit: The Silver Horn King holds the gourd upside down in midair, and Wukong " +
      "on the ground answers and is sucked in, with a clear above-and-below relationship; " +
      "the dust and grass swirling upward, the fluttering robe hem, and the slowly drifting " +
      "cloud vapor loop smoothly, driven by SMIL or inline CSS. Deductions: The Silver Horn " +
      "King with horns; the gourd's mouth pointing up; Wukong bound with rope; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-035": {
    coreKey:
      "The Golden Horn King, sword in his left hand and fan in his right, fans out red " +
      "flames: a smokeless sea of fire covers the mountain, with Wukong and his clones " +
      "outside the fire",
    groundTruth:
      "Chapter 35, \"Heresy Flaunts Its Might to Oppress the True Nature; The Mind-Monkey " +
      "Wins the Treasures and Subdues the Demons\". The Golden Horn King wears a crimson " +
      "silk robe over dragon-scale armor and raises the seven-star sword in his left hand; " +
      "\"his right hand reached behind his neck and took out the plantain fan\" to fan fire, " +
      "\"with not a wisp of blue smoke, only red flames over the whole mountain\", and the " +
      "pines become trees of fire.",
    evaluationCriteria:
      "Full credit: The Golden Horn King, in crimson robe with a steely beard, sword in the " +
      "left hand and fan in the right, fans fire downward; red flames cover the mountain " +
      "without smoke and the pines and cypresses become trees of fire; Wukong and his " +
      "clones stand outside the fire holding rods. Deductions: The plantain fan drawn as a " +
      "giant fan; thick smoke rising from the fire; horns on the Golden Horn King's head; " +
      "Wukong scorched by the fire; the Tang Monk and his disciples or Laozi appearing.",
  },
  "xiyou-anim-035": {
    coreKey:
      "The Golden Horn King fanning fire, with animated fan, red flames and sparks, and " +
      "steely beard and crimson robe",
    groundTruth:
      "Chapter 35, \"Heresy Flaunts Its Might to Oppress the True Nature; The Mind-Monkey " +
      "Wins the Treasures and Subdues the Demons\". The Golden Horn King, with a crimson " +
      "silk robe over dragon-scale armor and a steely beard, raises his sword in his left " +
      "hand; \"his right hand reached behind his neck and took out the plantain fan\" to fan " +
      "fire, \"with not a wisp of blue smoke, only red flames over the whole mountain\".",
    evaluationCriteria:
      "Full credit: The Golden Horn King, sword in the left hand and fan in the right, fans " +
      "fire downward; red flames cover the mountain without smoke; Wukong and his clones " +
      "are outside the fire; the fanning, the flames and sparks, and the steely beard and " +
      "crimson robe loop smoothly, driven by SMIL or inline CSS. Deductions: The plantain " +
      "fan drawn as a giant fan; thick smoke rising from the fire; the Golden Horn King with " +
      "horns; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "xiyou-036": {
    coreKey:
      "The abbot's courtyard at Baolin Temple: Wukong smashes a stone lion with an iron rod " +
      "as thick as a basin's mouth, while the monk official watches in terror from behind a " +
      "window",
    groundTruth:
      "Chapter 36, \"When the Mind-Monkey Is Upright, All Conditions Submit; Breaking " +
      "Through the Side Gate, One Sees the Bright Moon\". At dusk Wukong sees \"a stone lion " +
      "outside the abbot's door\"; he \"raised his rod and, with one crash, smashed it to " +
      "powder and splinters\"; the monk official \"saw it through a hole in the window " +
      "lattice\" and was so frightened that his bones went soft and his sinews numb.",
    evaluationCriteria:
      "Full credit: Wukong swings an iron rod as thick as a basin's mouth and smashes a " +
      "single stone lion, stone chips flying; the monk official peeks from behind a window " +
      "and a temple servant crawls into the stove; dusk lighting. Deductions: The stone " +
      "lions drawn as a pair, or the lion pushed over or split in two; Wukong grown into a " +
      "giant or wearing armor; a moonlit night scene; the Tang Monk, Bajie, or Sha Wujing " +
      "appearing.",
  },
  "xiyou-anim-036": {
    coreKey:
      "Smashing the stone lion at Baolin Temple, with animated stone chips, dust, and kilt " +
      "edge",
    groundTruth:
      "Chapter 36, \"When the Mind-Monkey Is Upright, All Conditions Submit; Breaking " +
      "Through the Side Gate, One Sees the Bright Moon\". At dusk Wukong makes his rod as " +
      "thick as a basin's mouth and sees \"a stone lion outside the abbot's door\"; he " +
      "\"raised his rod and, with one crash, smashed it to powder and splinters\"; the monk " +
      "official sees it through a hole in the window lattice.",
    evaluationCriteria:
      "Full credit: Wukong swings the thick iron rod and smashes a single stone lion; the " +
      "monk official peeks from behind a window and a temple servant crawls into the stove; " +
      "the stone chips, dust, and kilt edge loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The stone lions in a pair, or the lion pushed over; Wukong grown into a " +
      "giant or wearing armor; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-037": {
    coreKey:
      "The ghost king's night visit to the meditation hall at the third watch: in " +
      "heaven-piercing crown and ochre-yellow robe, dripping wet and holding a jade tablet; " +
      "Sanzang reaches out to help him up and grasps only air",
    groundTruth:
      "Chapter 37, \"The Ghost King Visits Tang Sanzang by Night; Wukong, by Wondrous " +
      "Transformation, Leads the Child\". At the third watch a wind passes and the lamp " +
      "dims; the ghost of the King of Wuji, in a heaven-piercing crown, a jasper belt, and " +
      "an ochre-yellow robe, \"held in his hand a white jade tablet arrayed with the Dipper " +
      "and the stars\" and stands dripping wet outside the door; Sanzang \"hastily reached " +
      "out to help him up, but grasped only empty air\".",
    evaluationCriteria:
      "Full credit: The dripping-wet ghost king outside the door and Sanzang reaching out " +
      "and grasping air before the lamp face each other left and right; the heaven-piercing " +
      "crown, jasper belt, ochre-yellow robe, and white jade tablet are recognizable; the " +
      "lamplight is dim. Deductions: The ghost drawn as a skeleton, wounded and bleeding, or " +
      "as a fanged fierce ghost; the ghost king entering the room and sitting down; the " +
      "jade tablet drawn as an imperial jade seal or a seal stamp; Sanzang wearing a cassock " +
      "or holding a ringed monk's staff; Wukong or the other disciples, the false king, or " +
      "the crown prince appearing.",
  },
  "xiyou-anim-037": {
    coreKey:
      "The ghost king's night visit, with animated lamp flame, dripping water, and " +
      "wind-blown fallen leaves",
    groundTruth:
      "Chapter 37, \"The Ghost King Visits Tang Sanzang by Night; Wukong, by Wondrous " +
      "Transformation, Leads the Child\". At the third watch a fierce wind passes and the " +
      "lamp flickers bright and dim; the ghost of the King of Wuji, in a heaven-piercing " +
      "crown, a jasper belt, and an ochre-yellow robe, holds a white jade tablet and stands " +
      "outside the door dripping wet all over; Sanzang \"hastily reached out to help him " +
      "up, but grasped only empty air\".",
    evaluationCriteria:
      "Full credit: The dripping-wet ghost king outside the door and Sanzang grasping air " +
      "before the lamp face each other left and right; the crown, belt, robe, and jade " +
      "tablet are recognizable; the lamp flame, dripping water, and fallen leaves loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The ghost as a skeleton, wounded " +
      "and bleeding, or fanged; the ghost king entering the room; Sanzang wearing a " +
      "cassock; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-038": {
    coreKey:
      "At the well in the imperial garden: Wukong holds up the golden-hooped rod, now seven " +
      "or eight zhang long, and Bajie, clinging to it, hangs in the well",
    groundTruth:
      "Chapter 38, \"The Child Questions His Mother to Know False from True; Metal and Wood " +
      "Probe the Mystery and See Fake and Real\". Under the stars and moon at the second " +
      "watch, Bajie rakes down the plantain tree, noses aside the stone slab, and takes off " +
      "his zhiduo robe; the golden-hooped rod is \"a full seven or eight zhang long\"; " +
      "Bajie, \"hugging the iron rod, was gently lifted by Pilgrim\" and lowered into the " +
      "well.",
    evaluationCriteria:
      "Full credit: Wukong holds the rod at the well mouth and Bajie hangs in the well " +
      "clinging to it, in a clear vertical composition; the water at the bottom of the well " +
      "reflects the stars and moon; the plantain lies toppled and the stone slab is moved " +
      "aside. Deductions: The rod drawn as a rope; Bajie wearing his zhiduo robe or holding " +
      "the nine-toothed rake; the crystal palace, the Well Dragon King, or the king's corpse " +
      "drawn; lanterns or torches in the garden.",
  },
  "xiyou-anim-038": {
    coreKey:
      "Lowering Bajie into the well on the rod, with animated water glints, swaying rod, " +
      "and plantain and wild grass",
    groundTruth:
      "Chapter 38, \"The Child Questions His Mother to Know False from True; Metal and Wood " +
      "Probe the Mystery and See Fake and Real\". Under the stars and moon at the second " +
      "watch, Wukong stretches the golden-hooped rod until it is \"a full seven or eight " +
      "zhang long\"; Bajie takes off his zhiduo robe and goes down the well hugging the rod; " +
      "in the well \"the light of the stars and moon made the water shine\"; the plantain " +
      "has already been raked down.",
    evaluationCriteria:
      "Full credit: Wukong holds the rod at the well mouth and Bajie hangs in the well " +
      "clinging to it, in a clear vertical composition; the water glints, the swaying rod, " +
      "and the plantain and wild grass loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The rod drawn as a rope; Bajie wearing his zhiduo robe or holding the " +
      "nine-toothed rake; the crystal palace or the Dragon King drawn; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-039": {
    coreKey:
      "Manjushri raises the demon-revealing mirror on a colored cloud: the blue-haired " +
      "lion's true form appears in the mirror, and Wukong puts away his rod and salutes",
    groundTruth:
      "Chapter 39, \"A Grain of Cinnabar Is Obtained from Heaven; The Former King, Dead " +
      "Three Years, Returns to Life in the World\". Manjushri appears on a colored cloud " +
      "from the northeast and \"took the demon-revealing mirror from his sleeve and shone it " +
      "on the monster's original form\"; in the mirror the blue-haired lion is \"indigo all " +
      "over like dye of the dog days, its four paws white as late-autumn frost\", with \"red " +
      "eyes giving off golden light\".",
    evaluationCriteria:
      "Full credit: On the colored cloud Manjushri raises the mirror, and in it the " +
      "blue-haired lion's indigo body, frost-white paws, and red eyes are recognizable; " +
      "Wukong puts away his rod and salutes; Bajie and Sha Wujing look on. Deductions: The " +
      "lion drawn outside the mirror, or Manjushri riding the lion; Manjushri holding a " +
      "sword; Wukong swinging his rod at the lion; Sha Wujing holding a crescent-moon " +
      "spade; the king or the officials drawn.",
  },
  "xiyou-anim-039": {
    coreKey:
      "Manjushri's demon-revealing mirror, with animated colored clouds, mirror glint, and " +
      "golden light from the lion's eyes",
    groundTruth:
      "Chapter 39, \"A Grain of Cinnabar Is Obtained from Heaven; The Former King, Dead " +
      "Three Years, Returns to Life in the World\". Manjushri appears on a colored cloud " +
      "from the northeast and \"took the demon-revealing mirror from his sleeve\"; in the " +
      "mirror the blue-haired lion is \"indigo all over like dye of the dog days, its four " +
      "paws white as late-autumn frost\", with \"red eyes giving off golden light\"; Wukong " +
      "puts away his rod, salutes, and calls Bajie and Sha Wujing over to look.",
    evaluationCriteria:
      "Full credit: On the colored cloud Manjushri raises the mirror and the blue-haired " +
      "lion in it is clear; Wukong salutes while Bajie and Sha Wujing look on; the colored " +
      "clouds, the mirror glint, and the golden light from the lion's eyes loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The lion drawn outside the mirror, or " +
      "Manjushri riding the lion; Sha Wujing holding a crescent-moon spade; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-040": {
    coreKey:
      "A child hung from a pine top on Mount Hao: Sanzang, on horseback, points with the " +
      "tip of his whip and asks, while Wukong lowers his head in silence",
    groundTruth:
      "Chapter 40, \"The Child's Playful Transformations Confuse the Chan Mind; Ape, Horse, " +
      "Spatula, and Wood Mother All Come to Naught\". At the end of autumn and the start of " +
      "winter, the fiend \"turned into a naughty boy of seven, stark naked without a stitch " +
      "on, his hands and feet bound with hemp rope, hung high at the top of a pine tree\"; " +
      "Sanzang \"pointed with the tip of his whip and asked\", while Wukong lowers his head " +
      "in silence.",
    evaluationCriteria:
      "Full credit: From the pine top hangs a naked, bound child rendered as a simplified " +
      "outline; Sanzang on horseback points with his whip and Wukong lowers his head before " +
      "the horse, the relationship among the three clear; the autumn-to-winter mountain " +
      "scenery is recognizable. Deductions: The child wearing a red belly-band, standing on " +
      "Wind Fire Wheels, holding a long spear, or wreathed in flames; the child showing " +
      "fangs and a demonic look; Wukong raising his rod toward the child; red clouds or red " +
      "light in the sky; a spring or summer scene.",
  },
  "xiyou-anim-040": {
    coreKey:
      "A child hung from a pine top on Mount Hao, with animated swinging rope, pines and " +
      "bamboo, and red leaves",
    groundTruth:
      "Chapter 40, \"The Child's Playful Transformations Confuse the Chan Mind; Ape, Horse, " +
      "Spatula, and Wood Mother All Come to Naught\". At the end of autumn and the start of " +
      "winter, the fiend turns into a naughty boy of seven, \"stark naked without a stitch " +
      "on\", his hands and feet bound with hemp rope, hung from a pine top; Sanzang " +
      "\"pointed with the tip of his whip and asked\", while Wukong lowers his head and " +
      "dares not answer; in the mountain scenery the red leaves are withered by frost.",
    evaluationCriteria:
      "Full credit: From the pine top hangs the naked child rendered as a simplified " +
      "outline; Sanzang on horseback points with his whip and Wukong lowers his head; the " +
      "swinging rope, the pines and bamboo, and the red leaves loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: The child wearing a red belly-band, standing on Wind Fire " +
      "Wheels, or wreathed in flames; Wukong raising his rod; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
};
