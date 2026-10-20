/**
 * 《三国演义》第 85–96 回候选的英文标签与英文评判标准，由
 * src/core/classics/sanguo/ch085-096.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SANGUO_CH085_096_LABELS_EN: Readonly<Record<string, string>> = {
  "sanguo-085": "Ch. 85 · Entrusting the Heir at Yong'an Palace",
  "sanguo-086": "Ch. 86 · Cao Pi Takes Fright at the Decoy City Wall on the River",
  "sanguo-087": "Ch. 87 · The First Capture of Meng Huo in the Command Tent",
  "sanguo-088": "Ch. 88 · Ma Dai Crosses the Lu River by Night",
  "sanguo-089": "Ch. 89 · Kongming Visits Meng Jie",
  "sanguo-090": "Ch. 90 · Kongming Drives the Giant Beasts",
  "sanguo-091": "Ch. 91 · Zhuge Liang Presents the Chu Shi Biao",
  "sanguo-092": "Ch. 92 · Zhao Yun Battles Three Generals Alone",
  "sanguo-093": "Ch. 93 · Zhuge Liang Rebukes Wang Lang",
  "sanguo-094": "Ch. 94 · The Qiang Iron-Clad Carts Sink in the Snow",
  "sanguo-095": "Ch. 95 · The Empty Fort Strategy",
  "sanguo-096": "Ch. 96 · Zhuge Liang Weeps for Ma Su",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SANGUO_CH085_096_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "sanguo-085": {
    coreKey:
      "The bedchamber of Yong'an Palace: Liu Bei lies ill on a low couch, Kongming " +
      "sits on the couch, Liu Yong and Liu Li bow side by side to Kongming, and the " +
      "ministers stand in attendance",
    groundTruth:
      "Chapter 85, \"The First Lord Liu Leaves an Edict Entrusting His Orphan; Zhuge " +
      "Liang Pacifies the Five Armies While Staying at Home\". \"The First Lord then " +
      "asked Kongming to sit on the couch, and called Liu Yong, Prince of Lu, and Liu " +
      "Li, Prince of Liang, to come forward\", \"and then ordered the two princes to " +
      "bow together to Kongming\". Holding hands and kowtowing until blood flows come " +
      "earlier; the charge to Zhao Yun and the emperor's death come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Liu Bei, his earlobes reaching his " +
      "shoulders, lies ill on a low couch, and Kongming sits on the couch, in the " +
      "center of the frame Liu Yong and Liu Li bow low side by side to Kongming, and " +
      "on the right of the frame the ministers stand in attendance. Deductions: " +
      "Holding hands, kowtowing until blood flows, or the emperor's death; a beaded " +
      "imperial crown or python robe; candles; a high-legged bed; city towers or city " +
      "walls.",
  },
  "sanguo-086": {
    coreKey:
      "The river at Guangling as the fog lifts: Cao Pi stands at the bow of his dragon " +
      "boat staring in alarm, on the far bank a continuous city wall glints with " +
      "spears and blades in the sun, banners planted everywhere, and blue-clad figures " +
      "stand on the battlements",
    groundTruth:
      "Chapter 86, \"Confounding Zhang Wen, Qin Mi Displays His Eloquence on Heaven; " +
      "Defeating Cao Pi, Xu Sheng Uses a Fire Attack\". At daybreak there is heavy " +
      "fog; \"presently a wind arose, the fog dispersed and the clouds cleared, and " +
      "all along the south bank of the river they saw a continuous city wall\", \"on " +
      "the towers spears and blades dazzled in the sun, and banners and pennants were " +
      "planted all over the walls\", and Cao Pi is greatly alarmed; on the walls are " +
      "reed figures bound by Xu Sheng, \"all dressed in blue and holding banners\". " +
      "The gale capsizing the boats and the fire attack come later.",
    evaluationCriteria:
      "Full credit: The river fog is just lifting, on the left of the frame the dragon " +
      "boat flies five-colored banners and Cao Pi stands at the bow staring in alarm " +
      "toward the far bank, and on the right of the frame the continuous city wall on " +
      "the far bank stretches along the river, spears and blades glinting in the sun " +
      "on its towers, banners planted everywhere, and blue-clad figures on the " +
      "battlements. Deductions: A fire attack, a gale and huge waves, men falling into " +
      "the water, or fighting; a paddled racing dragon boat.",
  },
  "sanguo-087": {
    coreKey:
      "The central command tent: Kongming sits upright asking whether he submits, " +
      "battle-axes, canopies, blades, and spears stand in dense ranks, and Meng Huo, " +
      "in purple-gold cap and red brocade robe, kneels with arms bound behind him and " +
      "head held high",
    groundTruth:
      "Chapter 87, \"Marching Against the Southern Rebels, the Chancellor Raises a " +
      "Great Army; Resisting the Heavenly Troops, the Barbarian King Is Captured for " +
      "the First Time\". Meng Huo rides out to battle wearing a jewel-inlaid " +
      "purple-gold cap, a red brocade robe hung with jeweled strands, a carved-jade " +
      "lion belt, and green eagle-beak boots; in the tent \"seven ranks of " +
      "executioners were drawn up, their blades, spears, swords, and halberds gleaming " +
      "like frost and snow\", Meng Huo is \"brought bound before the tent\", and " +
      "Kongming asks, \"Do you submit in your heart?\" His release comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming sits upright at the head of the " +
      "tent, with battle-axes and canopies on both sides and armed guards holding " +
      "blades, spears, swords, and halberds standing in ranks, and on the right of the " +
      "frame Meng Huo, in purple-gold cap, red brocade robe, lion belt, and green " +
      "boots, kneels with arms bound behind him and head held high. Deductions: Meng " +
      "Huo with animal hides or skulls, or wearing a sword; beheading or blood shown; " +
      "barbarian soldiers in the tent; Kongming riding in a carriage.",
  },
  "sanguo-088": {
    coreKey:
      "Shakou on the Lu River at midnight: Ma Dai leads his troops across on wooden " +
      "rafts, a local guide stands at the head of a raft guiding the way, the water is slow " +
      "and all is well, and no one is on the far bank",
    groundTruth:
      "Chapter 88, \"Crossing the Lu River, He Binds the Barbarian King Again; Seeing " +
      "Through a Feigned Surrender, He Captures Meng Huo a Third Time\". A local " +
      "says, \"Here the water is slow; rafts can be lashed together to cross\", and " +
      "\"one must wait until the night is still and the water cold, when the poisonous " +
      "vapors do not rise, and cross after eating one's fill\"; Kongming has the " +
      "local lead the way and picks strong soldiers to follow Ma Dai, and they lash " +
      "wooden rafts together and cross at midnight, and indeed all is well. Crossing " +
      "by day stripped of clothing and being poisoned comes earlier; seizing the grain " +
      "comes later.",
    evaluationCriteria:
      "Full credit: At midnight the water is calm, in the center of the frame several " +
      "wooden rafts cross toward the far bank on the right of the frame, at the head of the lead " +
      "raft a local guide " +
      "points the way, Ma Dai stands on a raft, soldiers ride with him and some pole " +
      "the rafts, and no one guards the far bank. Deductions: Ma Dai on horseback; " +
      "crossing by day, men stripped and falling dead, or blood shown; poisonous mist " +
      "or skulls; torches; bamboo rafts or sheepskin rafts; Meng Huo.",
  },
  "sanguo-089": {
    coreKey:
      "Before the thatched hut by Wan'an Stream: Kongming arrives at the gate bearing " +
      "gifts, Meng Jie, in bamboo cap and white robe, green-eyed and yellow-haired, " +
      "comes out to greet him with a question, and the soldiers struck mute wait " +
      "outside the fence",
    groundTruth:
      "Chapter 89, \"The Marquis of Wuxiang Uses Stratagems a Fourth Time; The King of " +
      "the Southern Barbarians Is Captured a Fifth Time\". Kongming enters the " +
      "mountains carrying incense and gifts, and \"saw tall pines and great cypresses, " +
      "dense bamboo and rare flowers, encircling a farmstead\"; the recluse has \"a " +
      "bamboo cap and straw sandals, a white robe and black sash, green eyes and " +
      "yellow hair\", and asks, \"Is the visitor perhaps the Chancellor of Han?\" The " +
      "muted soldiers drinking from the Anle Spring, and Meng Jie revealing that he is " +
      "Meng Huo's elder brother, come later.",
    evaluationCriteria:
      "Full credit: Pines and bamboo encircle thatched huts behind a fence, in the " +
      "center of the frame Kongming, in silk scarf cap and crane-feather cloak and " +
      "holding his feather fan, arrives at the gate, on the right of the frame Meng " +
      "Jie, in bamboo cap and straw sandals, white robe and black sash, green-eyed and " +
      "yellow-haired, comes out to greet him, with a little boy standing by the gate, " +
      "and on the left of the frame, outside the fence, Wang Ping and the soldiers " +
      "pointing at their mouths wait quietly. Deductions: Kongming riding in a " +
      "four-wheeled carriage; Meng Jie drawn as a Daoist priest or a king, or with " +
      "exaggerated features; sickly faces.",
  },
  "sanguo-090": {
    coreKey:
      "Before Yinkeng Cave: Kongming in his carriage turns the wind back with his " +
      "feather fan, the carved wooden beasts surge out breathing fire, Mulu rides a " +
      "white elephant holding his handbell, and the real beasts dare not advance",
    groundTruth:
      "Chapter 90, \"Driving the Giant Beasts, He Defeats the Barbarian Troops a Sixth " +
      "Time; Burning the Rattan Armor, He Captures Meng Huo a Seventh Time\". " +
      "Kongming, \"in silk scarf cap and with feather fan, dressed in a Daoist robe, " +
      "sat upright in his carriage\"; King Mulu \"rode a white elephant, was decked in " +
      "strands of gold and pearls, wore two treasured sabers at his waist, and held a " +
      "handbell\"; with one wave of Kongming's feather fan the wind turns back and " +
      "blows on the barbarian lines, and the giant beasts \"spewed flames from their " +
      "mouths and black smoke from their nostrils, shaking the bronze bells on their " +
      "bodies\", so that \"none of the fierce beasts dared advance\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming, in silk scarf cap and Daoist " +
      "robe and holding his feather fan, sits upright in a small carriage, and carved " +
      "and painted wooden beasts, flames spewing from their mouths, black smoke from " +
      "their nostrils, and bronze bells hanging on their bodies, surge out toward the " +
      "right, and on the right of the frame King Mulu rides a white elephant, decked " +
      "in jeweled strands and holding his handbell, while tigers, leopards, and " +
      "venomous snakes dare not advance. Deductions: A four-wheeled carriage or an " +
      "Eight Trigrams robe; casualties or blood shown; the giant beasts drawn as live " +
      "animals or as geared machines.",
  },
  "sanguo-091": {
    coreKey:
      "The morning court at Chengdu: Kongming steps out of the ranks and, facing the " +
      "Later Lord, presents the Chu Shi Biao memorial with both hands, the Later Lord " +
      "sits upright and has not yet spoken, and the officials stand in ranks on both " +
      "sides",
    groundTruth:
      "Chapter 91, \"Sacrificing at the Lu River, the Han Chancellor Brings His Army " +
      "Home; Marching on the Central Plains, Marquis Wu Presents a Memorial\". \"The " +
      "next day, at the Later Lord's morning court, with all the officials assembled, " +
      "Kongming stepped out of the ranks and presented the Chu Shi Biao memorial.\" " +
      "The Later Lord reading the memorial and replying, and Qiao Zhou citing the " +
      "signs in the heavens to dissuade him, come later; \"gold crown and " +
      "crane-feather cloak\" appears only earlier, at the night sacrifice at the Lu " +
      "River.",
    evaluationCriteria:
      "Full credit: On the left of the frame the Later Lord sits upright on the " +
      "throne, not yet speaking, on the right of the frame Kongming steps out of the " +
      "ranks and, facing the Later Lord, presents the memorial with both hands, and on " +
      "both sides of the frame the officials stand in ranks. Deductions: A folded " +
      "memorial or a yellow silk imperial edict; gold pillars coiled with dragons, a " +
      "dragon robe, or court beads and peacock-feather plumes; the lamp array of the " +
      "night sacrifice, or ghosts.",
  },
  "sanguo-092": {
    coreKey:
      "Before Mount Fengming: the seventy-year-old veteran Zhao Yun holds the center " +
      "with spear leveled, while Han Yao swings his blade, Han Qiong levels his " +
      "Fangtian halberd, and Han Qi wields two blades, attacking him from three sides",
    groundTruth:
      "Chapter 92, \"Zhao Zilong Slays Five Generals by Main Strength; Zhuge Liang " +
      "Takes Three Cities by Wit\". Zhao Yun \"was already seventy years of age\"; Han " +
      "Yao \"spurred his horse and swung his blade to fight\", Han Qiong \"hastily " +
      "leveled his Fangtian halberd and galloped forward to join in a pincer attack\", " +
      "Han Qi wields two sun-and-moon blades, and \"Yun, in the middle, fought the " +
      "three generals alone\". Stabbing generals from their horses and capturing them " +
      "come later.",
    evaluationCriteria:
      "Full credit: In the center of the frame the veteran Zhao Yun, on horseback, " +
      "holds the center with spear leveled, on the left of the frame Han Yao swings " +
      "his blade, on the right of the frame Han Qiong levels his Fangtian halberd, and " +
      "at the right rear of the frame Han Qi wields two blades, the three surrounding " +
      "him on three sides, their weapons not yet striking home. Deductions: A rider " +
      "stabbed from his horse, corpses, or blood shown; Zhao Yun with a white horse, " +
      "white robe, or silver spear; Han De or Xiahou Mao.",
  },
  "sanguo-093": {
    coreKey:
      "Facing off before Mount Qi: Kongming, in plain robe and black sash, sits in his " +
      "four-wheeled carriage, his rebuke finished, and the white-bearded Wang Lang, in " +
      "the saddle, his chest swelling with rage, has not yet fallen from his horse",
    groundTruth:
      "Chapter 93, \"Jiang Boyue Surrenders to Kongming; The Marquis of Wuxiang Curses " +
      "Wang Lang to Death\". \"In the shadow of the gate banners, in the center, was a " +
      "four-wheeled carriage, with Kongming sitting upright in it, in silk scarf cap " +
      "and with feather fan, in plain robe and black sash, gliding out\", and then he \"had the " +
      "carriage pushed out beyond the lines\"; Wang Lang is " +
      "\"the white-bearded old man in the center\", and \"when Wang Lang heard this, " +
      "his chest swelled with rage\". His fall from the horse comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, out in front of the lines, Kongming, in " +
      "silk scarf cap with feather fan and in plain robe and black sash, sits upright " +
      "in the four-wheeled carriage, with Guan Xing and Zhang Bao sitting their horses " +
      "on either side of the gate banners behind, and on the right of the frame the " +
      "white-bearded Wang Lang, on horseback, his face full of anger, is still in the " +
      "saddle. Deductions: Wang Lang falling from his horse or lying on the ground; " +
      "Kongming in an Eight Trigrams robe; snow or iron-clad carts; Wang Lang with a " +
      "white face or colorful opera face paint.",
  },
  "sanguo-094": {
    coreKey:
      "The snowy mountain pass outside the camp: the concealed pits beneath the snow cave in, " +
      "the " +
      "iron-clad carts and mules and horses at the front pitch forward on the verge of " +
      "falling, the carts behind cannot stop, and Yue Ji and Ya Dan are in the column",
    groundTruth:
      "Chapter 94, \"Zhuge Liang Takes Advantage of the Snow to Defeat the Qiang " +
      "Troops; Sima Yi Captures Meng Da by the Appointed Day\". At the end of the " +
      "twelfth month there is heavy snow, and \"the mountain road was blanketed in " +
      "snow, flat as far as the eye could see\"; \"suddenly there was a crash, as if " +
      "the mountains were collapsing and the earth caving in\", and \"the iron-clad " +
      "carts behind were rolling fast and could hardly stop in time\". The iron-clad " +
      "carts are \"wrapped and nailed with iron plates\" and drawn by camels or by " +
      "mules and horses; Yue Ji \"carried an iron hammer and had a treasured carved " +
      "bow hanging at his waist\". Beheading Yue Ji and capturing Ya Dan come later.",
    evaluationCriteria:
      "Full credit: Snow covers the mountain road, in the center of the frame the " +
      "snow surface caves in and the iron-clad carts and mules and horses at the front " +
      "pitch forward on the verge of falling, on the right of the frame the carts " +
      "behind are linked nose to tail, at the right rear of the frame Yue Ji, iron " +
      "hammer in hand, reins in his horse and Ya Dan urges the troops on, and far off " +
      "on the left of the frame Jiang Wei leads his troops away in retreat. " +
      "Deductions: Sharpened stakes in the pits, men killed or wounded falling into " +
      "the pits, or blood shown; Lord Guan's spirit appearing; Kongming present.",
  },
  "sanguo-095": {
    coreKey:
      "Before the watchtower at Xicheng: Kongming sits by the railing, burning incense " +
      "and playing the zither, two boys hold a sword and a deer-tail fan, the city " +
      "gate stands wide open with soldiers sprinkling and sweeping, and Sima Yi gazes " +
      "from afar in deep suspicion",
    groundTruth:
      "Chapter 95, \"Ma Su Rejects Advice and Loses Jieting; Marquis Wu Plays the " +
      "Zither and Drives Off Zhongda\". Kongming, \"draped in a crane-feather cloak and " +
      "wearing a silk scarf cap\", \"sat by the railing before the watchtower on the " +
      "wall, burning incense and playing the zither\", one boy holding a treasured " +
      "sword and the other a deer-tail fan; \"inside and outside the city gate some " +
      "twenty commoners, heads lowered, were sprinkling and sweeping\"; Sima Yi halts " +
      "his armies, gallops forward himself to look from afar, and having looked is " +
      "deeply suspicious. Clapping his hands and laughing, and Sima Zhao's question, " +
      "come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, before the watchtower, Kongming, in silk " +
      "scarf cap and crane-feather cloak, sits by the railing burning incense and " +
      "playing the zither, with a boy on each side, one holding a treasured sword and " +
      "the other a deer-tail fan, the city gate stands wide open and some twenty " +
      "soldiers dressed as commoners sprinkle and sweep, and on the right of the " +
      "frame, outside the city, Sima Yi rides alone, gazing from afar, with his great " +
      "army behind him. Swapping the two boys left and right is not penalized. " +
      "Deductions: Kongming holding a feather fan or in an Eight Trigrams robe; Sima " +
      "Zhao, Sima Shi, or ambushers; a tufted horsetail whisk; banners lined up on the " +
      "wall.",
  },
  "sanguo-096": {
    coreKey:
      "The central command tent at Hanzhong: Kongming sits upright shedding tears, Ma " +
      "Su, self-bound, kneels before the tent weeping, and the armed guards on both " +
      "sides await orders without laying hands on him",
    groundTruth:
      "Chapter 96, \"Kongming Sheds Tears as He Beheads Ma Su; Zhou Fang Cuts Off His " +
      "Hair to Deceive Cao Xiu\". \"Su, self-bound, knelt before the tent\"; after Ma " +
      "Su's tearful plea, \"Kongming, shedding tears, said: 'You and I are as brothers " +
      "in righteousness; your son is my son. You need say no more.'\" Afterward \"the " +
      "attendants pushed Ma Su out beyond the camp gate to be beheaded\", and Jiang " +
      "Wan's intercession comes later still. Ma Su is thirty-nine years old.",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming sits upright in the tent, tears " +
      "falling, his expression solemn, on the right of the frame Ma Su, self-bound, " +
      "kneels inside the tent before Kongming, head lowered, weeping, and on both sides the " +
      "armed " +
      "guards await orders without laying hands on him. Deductions: Pushing him out of " +
      "the camp gate, blades and axes raised high, beheading, or blood shown; Ma Su " +
      "with white eyebrows or opera face paint; Jiang Wan, Wang Ping, or Zhao Yun.",
  },
  "sanguo-anim-085": {
    coreKey:
      "Liu Bei lying ill, Kongming seated on the couch, and the two princes bowing to " +
      "Kongming, with animated lamp flame, curtains, and river mist",
    groundTruth:
      "Chapter 85, \"The First Lord Liu Leaves an Edict Entrusting His Orphan; Zhuge " +
      "Liang Pacifies the Five Armies While Staying at Home\". \"The First Lord then " +
      "asked Kongming to sit on the couch, and called Liu Yong, Prince of Lu, and Liu " +
      "Li, Prince of Liang, to come forward\", \"and then ordered the two princes to " +
      "bow together to Kongming\". Holding hands and kowtowing until blood flows come " +
      "earlier; the charge to Zhao Yun and the emperor's death come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Liu Bei, his earlobes reaching his " +
      "shoulders, lies ill on a low couch, and Kongming sits on the couch, in the " +
      "center of the frame Liu Yong and Liu Li bow side by side to Kongming, and on " +
      "the right of the frame the ministers stand in attendance; the lamp flame, the " +
      "curtains, and the river mist loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Holding hands or the emperor's death; a beaded imperial crown; " +
      "candles; whole figures drifting; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "sanguo-anim-086": {
    coreKey:
      "Cao Pi on his dragon boat staring in alarm at the continuous city wall on the " +
      "far bank, with animated lingering fog, banners and pennants, and river waves",
    groundTruth:
      "Chapter 86, \"Confounding Zhang Wen, Qin Mi Displays His Eloquence on Heaven; " +
      "Defeating Cao Pi, Xu Sheng Uses a Fire Attack\". \"Presently a wind arose, the " +
      "fog dispersed and the clouds cleared, and all along the south bank of the " +
      "river they saw a continuous city wall\", \"on the towers spears and blades " +
      "dazzled in the sun, and banners and pennants were planted all over the " +
      "walls\", and Cao Pi is greatly alarmed; the reed figures on the walls are " +
      "\"all dressed in blue and holding banners\".",
    evaluationCriteria:
      "Full credit: On the left of the frame the dragon boat flies five-colored " +
      "banners and Cao Pi stands at the bow staring in alarm toward the far bank, and " +
      "on the right of the frame the continuous city wall on the far bank glints with " +
      "spears and blades in the sun, banners planted everywhere, and blue-clad figures " +
      "on the battlements; the lingering fog, the banners, and the river waves loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: A fire attack, men falling " +
      "into the water, or fighting; the figures or the boats drifting as a whole; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-087": {
    coreKey:
      "Kongming at the head of the tent asking whether he submits and Meng Huo " +
      "kneeling with arms bound behind him and head held high, with animated canopies " +
      "and feather canopies, brocade robe and jeweled strands, and tent curtains",
    groundTruth:
      "Chapter 87, \"Marching Against the Southern Rebels, the Chancellor Raises a " +
      "Great Army; Resisting the Heavenly Troops, the Barbarian King Is Captured for " +
      "the First Time\". Meng Huo wears a purple-gold cap and a red brocade robe; in " +
      "the tent \"seven ranks of executioners were drawn up, their blades, spears, " +
      "swords, and halberds gleaming like frost and snow\", Meng Huo is \"brought " +
      "bound before the tent\", and Kongming asks, \"Do you submit in your heart?\" " +
      "His release comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming sits upright at the head of the " +
      "tent, with battle-axes, canopies, and armed guards in ranks on both sides, and " +
      "on the right of the frame Meng Huo, in purple-gold cap and red brocade robe, " +
      "kneels with arms bound behind him and head held high; the canopies and feather " +
      "canopies, the brocade robe and jeweled strands, and the tent curtains loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Meng Huo wearing a sword; " +
      "beheading or blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "sanguo-anim-088": {
    coreKey:
      "Ma Dai crossing the Lu River by night on wooden rafts and a local guide guiding the " +
      "way from the head of a raft, with animated ripples and wakes, thin mist, and " +
      "long poles",
    groundTruth:
      "Chapter 88, \"Crossing the Lu River, He Binds the Barbarian King Again; Seeing " +
      "Through a Feigned Surrender, He Captures Meng Huo a Third Time\". \"One must " +
      "wait until the night is still and the water cold, when the poisonous vapors do " +
      "not rise, and cross after eating one's fill\"; Kongming has the local guide lead the " +
      "way and picks strong soldiers to follow Ma Dai, and they lash wooden rafts " +
      "together and cross at midnight, and indeed all is well. Crossing by day " +
      "stripped of clothing comes earlier.",
    evaluationCriteria:
      "Full credit: At midnight the water is calm, in the center of the frame several " +
      "wooden rafts cross toward the far bank on the right of the frame, at the head of the lead " +
      "raft a local guide " +
      "points the way, Ma Dai stands on a raft, and soldiers ride with him, poling; " +
      "the ripples and wakes, the thin mist, and the long poles loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: Ma Dai on horseback; crossing by day, or " +
      "blood shown; torches; the figures or the rafts drifting as a whole; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-089": {
    coreKey:
      "Kongming arriving at the gate and Meng Jie, in bamboo cap and white robe, " +
      "green-eyed and yellow-haired, coming out to greet him, with animated pines and " +
      "bamboo, stream water, and cooking smoke and incense wisps",
    groundTruth:
      "Chapter 89, \"The Marquis of Wuxiang Uses Stratagems a Fourth Time; The King of " +
      "the Southern Barbarians Is Captured a Fifth Time\". The recluse has \"a bamboo " +
      "cap and straw sandals, a white robe and black sash, green eyes and yellow " +
      "hair\", and asks, \"Is the visitor perhaps the Chancellor of Han?\"; \"tall " +
      "pines and great cypresses, dense bamboo and rare flowers, encircling a " +
      "farmstead\". The muted soldiers drinking from the Anle Spring comes later.",
    evaluationCriteria:
      "Full credit: In the center of the frame Kongming, in silk scarf cap and " +
      "crane-feather cloak and holding his feather fan, arrives at the gate, on the " +
      "right of the frame Meng Jie, in bamboo cap and straw sandals, white robe and " +
      "black sash, green-eyed and yellow-haired, comes out to greet him, and on the " +
      "left of the frame, outside the fence, Wang Ping and the soldiers pointing at " +
      "their mouths wait quietly; the pines and bamboo, the stream water, and the " +
      "cooking smoke and incense wisps loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Kongming riding in a four-wheeled carriage; whole figures drifting; " +
      "a purely static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-090": {
    coreKey:
      "The carved wooden beasts surging out breathing fire and Mulu on his white " +
      "elephant holding his handbell, with animated flames and black smoke, bronze " +
      "bells and fur, and handbell and great banner",
    groundTruth:
      "Chapter 90, \"Driving the Giant Beasts, He Defeats the Barbarian Troops a Sixth " +
      "Time; Burning the Rattan Armor, He Captures Meng Huo a Seventh Time\". " +
      "Kongming, \"in silk scarf cap and with feather fan, dressed in a Daoist robe, " +
      "sat upright in his carriage\"; King Mulu \"rode a white elephant\" and \"held a " +
      "handbell\"; with one wave of the feather fan, the giant beasts \"spewed flames " +
      "from their mouths and black smoke from their nostrils\", and \"none of the " +
      "fierce beasts dared advance\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming, in silk scarf cap and holding " +
      "his feather fan, sits upright in a small carriage, and the carved wooden " +
      "beasts, breathing fire and spewing smoke and hung with bronze bells, surge out " +
      "toward the right, and on the right of the frame King Mulu rides a white " +
      "elephant holding his handbell, while tigers, leopards, and venomous snakes dare " +
      "not advance; the flames and black smoke, the bronze bells and fur, and the " +
      "handbell and great banner loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A four-wheeled carriage; casualties or blood shown; the figures or " +
      "the beasts drifting as a whole; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "sanguo-anim-091": {
    coreKey:
      "Kongming stepping out of the ranks and, facing the Later Lord, presenting the " +
      "Chu Shi Biao memorial, and the Later Lord sitting upright, with animated drapes, " +
      "lamp flame, and sleeves and scroll ties",
    groundTruth:
      "Chapter 91, \"Sacrificing at the Lu River, the Han Chancellor Brings His Army " +
      "Home; Marching on the Central Plains, Marquis Wu Presents a Memorial\". \"The " +
      "next day, at the Later Lord's morning court, with all the officials assembled, " +
      "Kongming stepped out of the ranks and presented the Chu Shi Biao memorial.\" " +
      "The Later Lord reading the memorial and replying, and Qiao Zhou's attempt to " +
      "dissuade him, come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame the Later Lord sits upright on the " +
      "throne, not yet speaking, on the right of the frame Kongming steps out of the " +
      "ranks and, facing the Later Lord, presents the memorial with both hands, and on " +
      "both sides the officials stand in ranks; the drapes, the lamp flame, and the " +
      "sleeves and scroll ties loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A folded memorial, a yellow silk imperial edict, or gold pillars " +
      "coiled with dragons; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "sanguo-anim-092": {
    coreKey:
      "The seventy-year-old veteran Zhao Yun in the center fighting Han Yao, Han " +
      "Qiong, and Han Qi alone, with animated manes, tails, and dust, robe and beard, " +
      "and gate banners",
    groundTruth:
      "Chapter 92, \"Zhao Zilong Slays Five Generals by Main Strength; Zhuge Liang " +
      "Takes Three Cities by Wit\". Zhao Yun \"was already seventy years of age\"; Han " +
      "Yao swings his blade, Han Qiong levels his Fangtian halberd, Han Qi wields two " +
      "sun-and-moon blades, and \"Yun, in the middle, fought the three generals " +
      "alone\". Han Qi falling from his horse, Han Qiong struck by an arrow, and Han " +
      "Yao's capture come later.",
    evaluationCriteria:
      "Full credit: In the center of the frame the veteran Zhao Yun holds the center " +
      "with spear leveled, on the left of the frame Han Yao swings his blade, on the " +
      "right of the frame Han Qiong levels his Fangtian halberd, and at the right rear " +
      "of the frame Han Qi wields two blades, surrounding him on three sides; the " +
      "manes, tails, and dust, the robe and beard, and the gate banners loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Blood shown; Zhao Yun with a white " +
      "horse, white robe, or silver spear; the figures or the horses drifting as a " +
      "whole; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-093": {
    coreKey:
      "Kongming in his four-wheeled carriage, his rebuke finished, and the " +
      "white-bearded Wang Lang in the saddle, his chest swelling with rage, with " +
      "animated cap ribbons and sash, gate banners, and white breath from the horses' " +
      "nostrils",
    groundTruth:
      "Chapter 93, \"Jiang Boyue Surrenders to Kongming; The Marquis of Wuxiang Curses " +
      "Wang Lang to Death\". Kongming sits upright in a four-wheeled carriage, \"in " +
      "silk scarf cap and with feather fan, in plain robe and black sash\", and \"had the " +
      "carriage pushed out beyond the lines\"; Wang Lang " +
      "is \"the white-bearded old man in the center\", and \"when Wang Lang heard " +
      "this, his chest swelled with rage\". His giving a great cry and falling dead " +
      "from his horse comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming, in silk scarf cap with feather " +
      "fan and in plain robe and black sash, sits upright in the four-wheeled " +
      "carriage, with Guan Xing and Zhang Bao sitting their horses on either side " +
      "of the gate banners behind, and on the right of the frame the white-bearded Wang Lang, on " +
      "horseback and angry-faced, is still in the saddle; the cap ribbons and sash, " +
      "the gate banners, and the white breath from the horses' nostrils loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Wang Lang falling from his " +
      "horse; Kongming in an Eight Trigrams robe; snow; the figures, the horses, or " +
      "the carriage drifting as a whole; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "sanguo-anim-094": {
    coreKey:
      "The pits beneath the snow caving in, the iron-clad carts and mules and horses " +
      "pitching forward on the verge of falling, and the carts behind unable to stop, " +
      "with animated powder snow, sliding clumps of snow, and black banners",
    groundTruth:
      "Chapter 94, \"Zhuge Liang Takes Advantage of the Snow to Defeat the Qiang " +
      "Troops; Sima Yi Captures Meng Da by the Appointed Day\". \"The mountain road was " +
      "blanketed in snow, flat as far as the eye could see\"; \"suddenly there was a " +
      "crash, as if the mountains were collapsing and the earth caving in\", and \"the " +
      "iron-clad carts behind were rolling fast and could hardly stop in time\". Yue " +
      "Ji \"carried an iron hammer\". Beheading Yue Ji and capturing Ya Dan come later.",
    evaluationCriteria:
      "Full credit: In the center of the frame the snow surface caves in and the " +
      "iron-clad carts and mules and horses at the front pitch forward on the verge of " +
      "falling, on the right of the frame the carts behind are linked together, at the " +
      "right rear of the frame Yue Ji holds his iron hammer and Ya Dan urges the " +
      "troops on, and far off on the left of the frame Jiang Wei withdraws; the powder " +
      "snow, the clumps of snow, and the black banners loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: Men killed or wounded falling into the pits, or " +
      "blood shown; the figures, the horses, or the carts drifting as a whole; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-095": {
    coreKey:
      "Kongming playing the zither by the railing before the watchtower and Sima Yi " +
      "gazing from afar outside the city, with animated zither strings and sleeves, " +
      "incense smoke, and brooms and splashing water",
    groundTruth:
      "Chapter 95, \"Ma Su Rejects Advice and Loses Jieting; Marquis Wu Plays the " +
      "Zither and Drives Off Zhongda\". Kongming, \"draped in a crane-feather cloak and " +
      "wearing a silk scarf cap\", \"sat by the railing, burning incense and playing " +
      "the zither\"; two boys hold a sword and a deer-tail fan; \"inside and outside " +
      "the city gate some twenty commoners, heads lowered, were sprinkling and " +
      "sweeping\"; Sima Yi gallops forward himself to look from afar, and having " +
      "looked is deeply suspicious.",
    evaluationCriteria:
      "Full credit: On the left of the frame, before the watchtower, Kongming, in silk " +
      "scarf cap and crane-feather cloak, plays the zither by the railing, with boys " +
      "on both sides holding a sword and a deer-tail fan, the city gate stands wide " +
      "open and soldiers sprinkle and sweep, and on the right of the frame, outside " +
      "the city, Sima Yi on horseback gazes from afar; the zither strings and sleeves, " +
      "the incense smoke, and the brooms and splashing water loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Kongming holding a feather fan; ambushers or " +
      "Sima Zhao; the figures or the horses drifting as a whole; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "sanguo-anim-096": {
    coreKey:
      "Kongming shedding tears and Ma Su, self-bound, kneeling before the tent, the " +
      "armed guards not laying hands on him, with animated tent curtains, teardrops, " +
      "and halberd tassels and banner tails",
    groundTruth:
      "Chapter 96, \"Kongming Sheds Tears as He Beheads Ma Su; Zhou Fang Cuts Off His " +
      "Hair to Deceive Cao Xiu\". \"Su, self-bound, knelt before the tent\"; " +
      "\"Kongming, shedding tears, said: 'You and I are as brothers in righteousness; " +
      "your son is my son. You need say no more.'\" Afterward \"the attendants pushed " +
      "Ma Su out beyond the camp gate to be beheaded\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Kongming sits upright in the tent, tears " +
      "falling, on the right of the frame Ma Su, self-bound, kneels inside the tent before " +
      "Kongming, " +
      "head lowered, weeping, and on both sides the armed guards await orders without " +
      "laying hands on him; the tent curtains, the teardrops, and the halberd tassels " +
      "and banner tails loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Pushing him out, blades and axes raised high, or blood shown; Ma Su with white " +
      "eyebrows; whole figures drifting; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
};
