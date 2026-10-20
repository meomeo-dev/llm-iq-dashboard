/**
 * 《水浒传》第 13–24 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch013-024.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH013_024_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-013": "Ch. 13 · Suo Chao and Yang Zhi Rein In Before the Formations",
  "shuihu-014": "Ch. 14 · Wu Yong Parts the Fight with Bronze Chains",
  "shuihu-015": "Ch. 15 · The Three Ruans Welcome Wu Yong in the Lotus Marsh",
  "shuihu-016": "Ch. 16 · Seizing the Birthday Convoy by Guile",
  "shuihu-017": "Ch. 17 · Lu Zhishen Presented as a Ruse in the Buddha Hall",
  "shuihu-018": "Ch. 18 · Zhu Tong Calls Out to Chao Gai at the Back Gate",
  "shuihu-019": "Ch. 19 · Lin Chong Draws His Knife in the Waterside Pavilion",
  "shuihu-020": "Ch. 20 · Parting from Liu Tang at the Lane's Mouth on a Moonlit Night",
  "shuihu-021": "Ch. 21 · The Old Bawd Drunkenly Beats Tang Niu'er",
  "shuihu-022": "Ch. 22 · Zhu Tong Uncovers the Cellar in the Shrine Room",
  "shuihu-023": "Ch. 23 · Beating the Tiger on Jingyang Ridge",
  "shuihu-024": "Ch. 24 · The Forked Pole Strikes Ximen Qing",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH013_024_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-013": {
    coreKey:
      "Before the two formations on the drill ground at the East Gate: Suo Chao, his " +
      "gold-gilded battle-axe held crosswise, rides a white horse, and Yang Zhi, spear " +
      "leveled, rides a red horse; they rein in facing each other, and the flag officer " +
      "comes riding up",
    groundTruth:
      "Chapter 13, \"The Impetuous Vanguard Vies for Merit at the East Gate; the " +
      "Blue-Faced Beast Competes in Arms in the Northern Capital\". \"In the left " +
      "formation, 'the Impetuous Vanguard' Suo Chao reined in his horse, holding his " +
      "gold-gilded battle-axe, and halted his horse before the formation\"; \"in the " +
      "right formation, 'the Blue-Faced Beast' Yang Zhi gripped the spear in his hand, " +
      "reined in his mount, and stood before the formation\"; the flag officer \"came " +
      "galloping up\". Spurring the horses to clash comes later.",
    evaluationCriteria:
      "Full credit: The gate banners of the two formations part; on the left of the " +
      "frame Suo Chao, in a lion helmet with a red tassel and a crimson robe, holds a " +
      "gold-gilded battle-axe crosswise and rides a white horse; on the right of the " +
      "frame Yang Zhi, with a bluish birthmark and the characters tattooed on his cheek, " +
      "in a white silk-gauze robe, levels his spear and rides a red horse; the two rein " +
      "in facing each other, not yet engaged; in the middle of the frame the flag " +
      "officer rides up on horseback holding a command flag; on the raised terrace at " +
      "the top of the frame Secretary Liang (zhongshu) sits in a silver folding chair " +
      "with a parasol held up behind him, and the soldiers and attendants are drawn " +
      "small. Deductions: Suo Chao with two axes; the two engaged; an archery contest; " +
      "any figure drawn with opera face paint.",
  },
  "shuihu-014": {
    coreKey:
      "On the highroad outside Dongxi Village: Wu Yong thrusts his two bronze chains in " +
      "between Liu Tang and Lei Heng to part them, and each checks his pudao " +
      "(long-handled saber) and stands still",
    groundTruth:
      "Chapter 14, \"The Red-Haired Devil Sleeps Drunk in the Lingguan Hall; Heavenly " +
      "King Chao Claims a Kinsman in Dongxi Village\". \"Where the wattle gate at the " +
      "side opened, a man brandished two bronze chains\", \"and thrust the bronze chains " +
      "in between them to part them; both men held back their pudao, leapt out of the " +
      "ring, and planted their feet\". Liu Tang has \"a broad purplish-black face, and a " +
      "cinnabar-red birthmark beside his temple\".",
    evaluationCriteria:
      "Full credit: At sunrise the wattle gate beside the road stands open; in the " +
      "center of the frame Wu Yong, in headscarf and wide gown, holds a bronze chain in " +
      "each hand and thrusts them in between; on the left of the frame Liu Tang, with a " +
      "broad purplish-black face and a cinnabar-red birthmark beside his temple, wears a " +
      "headscarf; on the right of the frame Lei Heng, with a purplish-brown face and a " +
      "fan-shaped ring of whiskers; the two check their sabers and stand still, and " +
      "behind Lei Heng the county soldiers hold spears and cudgels. Deductions: Wu Yong " +
      "holding a feather fan or wearing a Taoist robe; Liu Tang with red hair; blades " +
      "crossing or blood shown.",
  },
  "shuihu-015": {
    coreKey:
      "Before the waterside lodge on the lotus marsh at Shijie Village: three boats " +
      "moored side by side, Ruan Xiaoer helping Wu Yong ashore, and Ruan Xiaowu and Ruan " +
      "Xiaoqi each in a boat",
    groundTruth:
      "Chapter 15, \"Schoolmaster Wu Persuades the Three Ruans to Join the Venture; " +
      "Gongsun Sheng Answers the Sworn Alliance of the Seven Stars\". \"The three boats " +
      "were poled into the lotus marsh below the waterside pavilion, and all three boats " +
      "were moored\", \"and helped Schoolmaster Wu ashore\"; Ruan Xiaowu has a " +
      "pomegranate flower tucked at his temple and a blue-green leopard tattooed on his " +
      "chest, and Ruan Xiaoqi wears a black bamboo-leaf hat against the sun and a " +
      "checkered cloth vest.",
    evaluationCriteria:
      "Full credit: On the right of the frame the waterside lodge hangs vermilion " +
      "blinds, the waterside pavilion juts into the lotus marsh, and three small boats " +
      "are moored side by side below it; right of center in the frame, on the bank, Ruan " +
      "Xiaoer, in a tattered headscarf and barefoot, helps Wu Yong ashore, Wu Yong in " +
      "headscarf and wide gown; of the three boats, in the front one Ruan Xiaowu has a " +
      "pomegranate flower tucked at his temple and a blue-green leopard on his chest, " +
      "and in the rear one Ruan Xiaoqi wears a black bamboo-leaf hat and a checkered " +
      "cloth vest. Deductions: Wu Yong carrying the bronze chains or a feather fan; Ruan " +
      "Xiaowu tattooed all over.",
  },
  "shuihu-016": {
    coreKey:
      "Noon in the pine wood on Huangni Ridge: in the shade of the pines Yang Zhi holds " +
      "the coconut-shell ladle, about to drink half a ladleful; the soldiers have " +
      "already drained a whole bucket, and the seven travelers and the Jiangzhou " +
      "wheelbarrows are across from them",
    groundTruth:
      "Chapter 16, \"Yang Zhi Escorts the Loads of Gold and Silver; Wu Yong Seizes the " +
      "Birthday Convoy by Guile\". On the fourth day of the sixth month, \"the sun was " +
      "nearly at noon\"; \"Yang Zhi saw that the others had drunk and come to no harm\", " +
      "\"picked it up and drank only half\". Escorting the convoy, Yang Zhi wears a " +
      "summer hat and a blue gauze shirt; the seven travelers push seven Jiangzhou " +
      "wheelbarrows. Everyone going limp and collapsing comes later.",
    evaluationCriteria:
      "Full credit: The pine wood on Huangni Ridge at noon; on the left of the frame " +
      "Yang Zhi, with a bluish birthmark and the characters tattooed on his cheek, in a " +
      "summer hat and blue gauze shirt, sits in the shade of the pines holding the " +
      "coconut-shell ladle; in the middle of the frame the old steward and the two aides " +
      "(yuhou) stand in attendance, the soldiers gather around the empty wine bucket, and " +
      "Bai Sheng stands to one side leaning on his carrying pole; on the right of the " +
      "frame the seven date peddlers and the seven Jiangzhou wheelbarrows. Deductions: " +
      "Anyone fallen to the ground; the date peddlers stripped naked; bronze chains; " +
      "drug powder.",
  },
  "shuihu-017": {
    coreKey:
      "The Buddha hall of Baozhu Monastery: Yang Zhi and Cao Zheng, disguised as " +
      "farmhands, escort Lu Zhishen, bound with a slipknot, and Deng Long, helped into " +
      "the tiger-skin folding chair, opens his mouth and curses roundly",
    groundTruth:
      "Chapter 17, \"The Tattooed Monk Attacks Mount Erlong Single-Handed; the " +
      "Blue-Faced Beast Joins in Seizing Baozhu Monastery\". \"The Buddha statues in the " +
      "hall had all been carried away, and in the middle stood a tiger-skin folding " +
      "chair\"; \"two bandit lackeys helped Deng Long out and sat him in the folding " +
      "chair\", and he opened his mouth and cursed roundly. Cao Zheng carries the iron " +
      "monk's staff and Yang Zhi carries his pudao (long-handled saber) point down; " +
      "pulling loose the slipknot comes later.",
    evaluationCriteria:
      "Full credit: The Buddha hall without statues; on the right of the frame Deng " +
      "Long, helped into the tiger-skin folding chair by two bandit lackeys, opens his " +
      "mouth and curses; in the middle of the frame Lu Zhishen, shaven-headed, bound " +
      "with a slipknot, two farmhands holding the rope; left of center in the frame Cao " +
      "Zheng holds the iron monk's staff; on the left of the frame Yang Zhi, with a " +
      "bluish birthmark and the characters tattooed on his cheek, in a summer hat, " +
      "carries his pudao point down. Deductions: A crescent-moon spade head on the iron " +
      "monk's staff; Deng Long with golden eyes; Lu Zhishen fully naked; fighting or " +
      "blood shown.",
  },
  "shuihu-018": {
    coreKey:
      "The back gate of the Chao Family Manor on a night of fire: Chao Gai, pudao " +
      "(long-handled saber) leveled, charges out with a great shout, Gongsun Sheng " +
      "behind him, and Zhu Tong, standing in the shadows, calls out to Chao Gai and has " +
      "not given way",
    groundTruth:
      "Chapter 18, \"The Lord of the Beautiful Beard Cleverly Keeps the Winged Tiger in " +
      "Check; Song Gongming Secretly Lets Heavenly King Chao Go\". Chao Gai and the " +
      "others \"leveled their pudao, fought their way out of the back gate, and gave a " +
      "great shout\"; \"Zhu Tong called out from the shadows: 'Headman, don't run!'\" " +
      "Zhu Tong stands eight feet four or five inches tall, his tiger-whisker beard is a " +
      "foot and a half long, and his face is like a dark-red date. Feinting aside to let " +
      "them pass comes later.",
    evaluationCriteria:
      "Full credit: On a moonless night fire breaks out inside the manor; on the left of " +
      "the frame, in the firelight at the back gate, Chao Gai charges out with his pudao " +
      "leveled, followed by Gongsun Sheng with twin hair buns and a sword on his back; " +
      "in the shadows on the right of the frame Zhu Tong, his long beard hanging to his " +
      "chest and his face like a dark-red date, holds a pudao and calls out to Chao Gai, " +
      "not giving way. Deductions: Zhu Tong holding a crescent blade; any figure drawn " +
      "with opera face paint; Chao Gai with a long beard; fighting or blood shown.",
  },
  "shuihu-019": {
    coreKey:
      "At the banquet in the waterside pavilion of Liangshan Marsh: Lin Chong kicks the " +
      "table aside, springs up, and draws a knife from under his robe front, Wang Lun " +
      "stands in alarm, and Wu Yong strokes his beard as the signal",
    groundTruth:
      "Chapter 19, \"Lin Chong Leads a Great Showdown in the Water Stronghold; Chao Gai " +
      "Takes Over Liangshan Marsh\". Wang Lun \"rose to offer the cup\"; \"Chao Gai and " +
      "the other six rose, about to go down from the pavilion\"; \"Lin Chong gave the " +
      "table one kick, sent it aside, and sprang up\", \"and from under his robe front " +
      "drew a gleaming knife\"; \"Wu Yong then stroked his whiskers with his hand\". Lin " +
      "Chong has a leopard's head and round eyes, a swallow's jaw and tiger whiskers, " +
      "and the characters tattooed on his cheek.",
    evaluationCriteria:
      "Full credit: Lotus leaves and flowers outside the pavilion; on the left of the " +
      "frame Wang Lun stands in alarm before the host's seat; in the left foreground Lin " +
      "Chong, leopard-headed and round-eyed, with the characters tattooed on his cheek, " +
      "kicks the table aside, rises, and draws a short knife, not yet near Wang Lun; on " +
      "the right of the frame the guests have already left their seats and stood up, " +
      "and Wu Yong, in headscarf and wide gown, raises his hand to stroke his beard. " +
      "Deductions: Lin Chong holding a serpent spear; Wu Yong holding a feather fan; " +
      "stabbing, blood shown, or a severed head.",
  },
  "shuihu-020": {
    coreKey:
      "The mouth of a lane in Yuncheng County on a moonlit night: Song Jiang holds Liu " +
      "Tang's hand and gives him parting advice, Liu Tang, in a white felt hat, bundle " +
      "on his back and pudao (long-handled saber) in hand, has not yet stepped off, and " +
      "the moon is just rising",
    groundTruth:
      "Chapter 20, \"The Righteous Men of Liangshan Marsh Honor Chao Gai; Liu Tang " +
      "Departs Yuncheng County on a Moonlit Night\". \"They came out to the mouth of the " +
      "lane; it was dusk, the middle of the eighth month, and the moon was coming up\"; " +
      "\"Song Jiang held Liu Tang's hand\" and gave him parting advice; Liu Tang " +
      "\"shouldered his bundle and took up his pudao\", wearing a white Fanyang felt hat " +
      "and a black-green silk-gauze jacket, with a waist saber at his side. Heading west " +
      "comes later.",
    evaluationCriteria:
      "Full credit: The mouth of a small lane at dusk, a full moon just rising above the " +
      "roof ridges at the upper right of the frame; on the left of the frame Song Jiang, " +
      "dark-faced and short, empty-handed, holds Liu Tang's hand; on the right of the " +
      "frame Liu Tang, with a broad purplish-black face and a cinnabar-red birthmark " +
      "beside his temple, in a white felt hat and a black-green silk-gauze jacket, " +
      "bundle on his back and pudao in hand, faces Song Jiang and has not yet stepped " +
      "off. Deductions: Gold ingots showing; Liu Tang with red hair or a red beard; Song " +
      "Jiang in official dress; any figure drawn with opera face paint.",
  },
  "shuihu-021": {
    coreKey:
      "The front hall downstairs in Granny Yan's house: Tang Niu'er pushes up in front " +
      "of Granny Yan, crying \"Hit me!\", and Granny Yan, emboldened by the wine, spreads " +
      "her five fingers, her hand not yet fallen",
    groundTruth:
      "Chapter 21, \"The Old Bawd Drunkenly Beats Tang Niu'er; Song Jiang Kills Yan " +
      "Poxi in a Rage\". After being shoved down the stairs, Tang Niu'er \"pushed his " +
      "way up and said: 'Hit me!'\"; \"the old woman, emboldened by the wine, spread her " +
      "five fingers\"; \"the glazed lamp in the front hall was burning bright\". The two " +
      "slaps in a row and his tumbling out through the door curtain come later.",
    evaluationCriteria:
      "Full credit: The front hall brightly lit by the lamp; on the left of the frame, " +
      "at the foot of the stairs, Granny Yan spreads her five fingers and raises her " +
      "hand, not yet fallen; on the right of the frame, before the door curtain, Tang " +
      "Niu'er, empty-handed, thrusts his head forward and pushes up in front of her, one " +
      "step away, looking defiant. Deductions: Granny Yan's hand already landing on his " +
      "face; the upstairs bedroom, Song Jiang, or Poxi; a knife or blood shown; figures " +
      "wearing opera water sleeves.",
  },
  "shuihu-022": {
    coreKey:
      "The Buddhist shrine room at the Song Family Manor: Zhu Tong drags the offering " +
      "table aside, lifts the floorboard, and tugs the rope end, and as the bronze bell " +
      "rings Song Jiang crawls out of the cellar",
    groundTruth:
      "Chapter 22, \"Granny Yan Wreaks Havoc in Yuncheng County; Zhu Tong Out of " +
      "Loyalty Releases Song Gongming\". Zhu Tong \"leaned his pudao against the wall " +
      "and bolted the door. He went into the shrine room\", \"dragged the offering table " +
      "aside and lifted that floorboard\", \"gave the rope end one tug, the bronze bell " +
      "rang once, and Song Jiang crawled out of the cellar\". Zhu Tong has a face like a " +
      "dark-red date and a tiger-whisker beard a foot and a half long.",
    evaluationCriteria:
      "Full credit: The Buddhas of the Three Ages at the back of the shrine room; on the " +
      "left of the frame Zhu Tong, his face like a dark-red date and his long beard " +
      "hanging to his chest, tugs the rope end, no blade in his hands; in the middle of " +
      "the frame the offering table dragged aside and the floorboard lifted, and Song " +
      "Jiang, dark-faced and short, crawls out of the opening, looking startled. " +
      "Deductions: Zhu Tong armored, holding a blade, or with his long beard hanging to " +
      "his waist; an iron ladder or a hidden door; Lei Heng.",
  },
  "shuihu-023": {
    coreKey:
      "The tangled woods on Jingyang Ridge: Wu Song, his left hand gripping the striped " +
      "hide on the tiger's crown, presses its jaws into the mud pit, his right fist " +
      "raised and not yet brought down, and the broken half of the cudgel lies cast " +
      "aside",
    groundTruth:
      "Chapter 23, \"Chai Jin Detains a Guest in Henghai Prefecture; Wu Song Beats the " +
      "Tiger on Jingyang Ridge\". At the shen hour (late afternoon) in the tenth month " +
      "Wu Song wears a newly made red pongee jacket; going up the ridge he \"slung the " +
      "felt hat on his back\", and after the tiger is dead he \"found the felt hat beside " +
      "the rock\"; the cudgel breaks on a withered tree, he \"threw the half cudgel " +
      "aside\", and afterward he \"came to the pine tree to look for the broken stump of " +
      "the cudgel\"; \"he pressed the beast's jaws straight down into the yellow mud " +
      "pit\", \"his left hand gripping the striped hide on its crown tightly\".",
    evaluationCriteria:
      "Full credit: The tangled woods in the light of the setting sun; left of center in " +
      "the frame Wu Song, tall and burly, with brows black as if brushed with lacquer, " +
      "his red pongee jacket open at the front, grips the striped hide on the tiger's " +
      "crown with his left hand, his right fist raised and not yet brought down; right " +
      "of center in the frame the tiger with upslanted eyes and a white forehead, black " +
      "stripes on yellow, its jaws pressed into the yellow mud pit; on the left of the " +
      "frame the broken half of the cudgel under a pine; on the right of the frame a big " +
      "bluestone with the white felt hat beside it. Deductions: Blood shown; Wu Song " +
      "bare-chested, holding the cudgel, or wearing the felt hat; hunters; the official " +
      "notice.",
  },
  "shuihu-024": {
    coreKey:
      "Before Wu Da's door on Zishi Street: Pan Jinlian, propping up the blind, loses " +
      "her grip, the forked pole lands squarely on the headscarf of the passing Ximen " +
      "Qing, and Granny Wang sees it from under the curtain of her teahouse",
    groundTruth:
      "Chapter 24, \"Granny Wang, Greedy for a Bribe, Arranges an Affair; Yun'ge, " +
      "Indignant, Makes a Scene at the Teahouse\". Winter is nearly over; Jinlian \"came " +
      "to the door first herself to prop up the blind\", \"lost her grip, and it slipped " +
      "and fell, and, as chance would have it, struck that man right on his " +
      "headscarf\"; \"the old woman was in her tea shop under the door curtain and saw " +
      "it\". Turning his face and breaking into a smile comes later.",
    evaluationCriteria:
      "Full credit: Zishi Street at the end of winter; on the left of the frame, before " +
      "the ground-floor door of Wu Da's house, Jinlian, properly dressed, has let go of " +
      "the forked pole and looks startled; in the middle of the frame Ximen Qing's " +
      "headscarf is struck by the tip of the pole, his steps just halted and his face " +
      "not yet turned; on the right of the frame Granny Wang watches from behind the " +
      "curtain of the teahouse next door. Deductions: The pole dropped from a " +
      "second-floor window; Ximen Qing holding a folding fan; snow; Jinlian and Ximen " +
      "Qing flirting.",
  },
  "shuihu-anim-013": {
    coreKey:
      "Suo Chao, axe held crosswise, on a white horse and Yang Zhi, spear leveled, on a " +
      "red horse, reining in to face each other, with animated gate banners and helmet " +
      "tassels, and the warhorses' manes and tails",
    groundTruth:
      "Chapter 13, \"The Impetuous Vanguard Vies for Merit at the East Gate; the " +
      "Blue-Faced Beast Competes in Arms in the Northern Capital\". \"In the left " +
      "formation, 'the Impetuous Vanguard' Suo Chao reined in his horse, holding his " +
      "gold-gilded battle-axe, and halted his horse before the formation\"; \"in the " +
      "right formation, 'the Blue-Faced Beast' Yang Zhi gripped the spear in his hand, " +
      "reined in his mount, and stood before the formation\". Spurring the horses to " +
      "clash comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Suo Chao, with a red tassel and a crimson " +
      "robe, holds a gold-gilded battle-axe crosswise and rides a white horse; on the " +
      "right of the frame Yang Zhi, with a bluish birthmark and the characters tattooed " +
      "on his cheek, levels his spear and rides a red horse; the two rein in facing each " +
      "other; in the middle of the frame the flag officer, on horseback with a command " +
      "flag, rides up and reins in; Secretary Liang (zhongshu) on the raised terrace at " +
      "the top of the frame, and the soldiers and attendants drawn small; the gate " +
      "banners and helmet tassels and the manes and tails of the three horses loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Suo Chao with two axes; the " +
      "two engaged; the figures or the horses drifting as a whole; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-014": {
    coreKey:
      "Wu Yong, a bronze chain in each hand, parting the fight from the middle and Liu " +
      "Tang and Lei Heng checking their sabers and standing still, with animated gown, " +
      "spear tassels, and bands of dawn cloud",
    groundTruth:
      "Chapter 14, \"The Red-Haired Devil Sleeps Drunk in the Lingguan Hall; Heavenly " +
      "King Chao Claims a Kinsman in Dongxi Village\". \"Where the wattle gate at the " +
      "side opened, a man brandished two bronze chains\", \"and thrust the bronze chains " +
      "in between them to part them; both men held back their pudao (long-handled " +
      "saber)\". Liu Tang has \"a broad purplish-black face, and a cinnabar-red " +
      "birthmark beside his temple\"; the \"Red-Haired\" in his nickname refers to this " +
      "birthmark.",
    evaluationCriteria:
      "Full credit: In the center of the frame Wu Yong, in headscarf and wide gown, " +
      "holds a bronze chain in each hand and thrusts them in between; on the left of the " +
      "frame Liu Tang, with a broad purplish-black face and a cinnabar-red birthmark " +
      "beside his temple, wears a headscarf; on the right of the frame Lei Heng, with a " +
      "purplish-brown face; the two check their sabers and stand still; the gown, the " +
      "spear tassels, and the light and shade of the dawn cloud bands move smoothly back " +
      "and forth, driven by SMIL or inline CSS. Deductions: Wu Yong holding a feather " +
      "fan; Liu Tang with red hair; blood shown; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-015": {
    coreKey:
      "Three boats moored side by side, Ruan Xiaoer helping Wu Yong ashore, and Xiaowu " +
      "and Xiaoqi in their boats, with animated lotus leaves and flowers, ripples, and " +
      "vermilion blinds",
    groundTruth:
      "Chapter 15, \"Schoolmaster Wu Persuades the Three Ruans to Join the Venture; " +
      "Gongsun Sheng Answers the Sworn Alliance of the Seven Stars\". \"The three boats " +
      "were poled into the lotus marsh below the waterside pavilion, and all three boats " +
      "were moored\", \"and helped Schoolmaster Wu ashore\"; Ruan Xiaowu has a " +
      "pomegranate flower tucked at his temple and a blue-green leopard tattooed on his " +
      "chest, and Ruan Xiaoqi wears a black bamboo-leaf hat against the sun.",
    evaluationCriteria:
      "Full credit: On the right of the frame the waterside lodge hangs vermilion " +
      "blinds, the waterside pavilion juts into the lotus marsh, and three boats are " +
      "moored side by side below it; right of center in the frame, on the bank, Ruan " +
      "Xiaoer helps Wu Yong ashore; in the front boat Ruan Xiaowu has a pomegranate " +
      "flower tucked at his temple and a blue-green leopard on his chest, and in the " +
      "rear boat Ruan Xiaoqi wears a black bamboo-leaf hat; the lotus leaves and " +
      "flowers, the ripples, and the vermilion blinds loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Wu Yong carrying the bronze chains or a feather fan; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "shuihu-anim-016": {
    coreKey:
      "Yang Zhi in the shade of the pines holding the coconut-shell ladle, about to " +
      "drink half a ladleful, the soldiers around the empty bucket, and the seven " +
      "travelers with the Jiangzhou wheelbarrows, with animated heat haze, pine " +
      "branches, and wine surface",
    groundTruth:
      "Chapter 16, \"Yang Zhi Escorts the Loads of Gold and Silver; Wu Yong Seizes the " +
      "Birthday Convoy by Guile\". On the fourth day of the sixth month, \"the sun was " +
      "nearly at noon\"; \"Yang Zhi saw that the others had drunk and come to no harm\", " +
      "\"picked it up and drank only half\". Everyone going limp and collapsing comes " +
      "later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Yang Zhi, with a bluish birthmark and the " +
      "characters tattooed on his cheek, in a summer hat and blue gauze shirt, sits " +
      "holding the coconut-shell ladle; in the middle of the frame the old steward, the " +
      "two aides (yuhou), and the soldiers gather around the empty wine bucket, and Bai " +
      "Sheng stands by leaning on his carrying pole; on the right of the frame the seven " +
      "travelers and the seven Jiangzhou wheelbarrows; the heat haze, the pine branches, " +
      "and the wine surface loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Anyone fallen to the ground; bronze chains; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-017": {
    coreKey:
      "Lu Zhishen, bound with a slipknot, escorted into the Buddha hall and Deng Long, " +
      "helped into the folding chair, cursing, with animated rope end and dust floating " +
      "in the hall",
    groundTruth:
      "Chapter 17, \"The Tattooed Monk Attacks Mount Erlong Single-Handed; the " +
      "Blue-Faced Beast Joins in Seizing Baozhu Monastery\". \"The Buddha statues in the " +
      "hall had all been carried away, and in the middle stood a tiger-skin folding " +
      "chair\"; \"two bandit lackeys helped Deng Long out and sat him in the folding " +
      "chair\". Pulling loose the slipknot and killing Deng Long come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Deng Long, helped into the tiger-skin " +
      "folding chair by two bandit lackeys; in the middle of the frame Lu Zhishen, " +
      "shaven-headed, bound with a slipknot, two farmhands holding the rope; left of " +
      "center in the frame Cao Zheng holds the iron monk's staff; on the left of the " +
      "frame Yang Zhi, in a summer hat, carries his pudao (long-handled saber) point " +
      "down; the rope end and the floating dust loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: A crescent-moon spade head on the iron monk's staff; Lu Zhishen " +
      "fully naked; blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-018": {
    coreKey:
      "Chao Gai charging out of the back gate with his saber leveled and Zhu Tong " +
      "calling out from the shadows without giving way, with animated flames and black " +
      "smoke, flickering firelight, and long beard and robe corners",
    groundTruth:
      "Chapter 18, \"The Lord of the Beautiful Beard Cleverly Keeps the Winged Tiger in " +
      "Check; Song Gongming Secretly Lets Heavenly King Chao Go\". Chao Gai and the " +
      "others \"leveled their pudao (long-handled saber) and fought their way out of the " +
      "back gate\"; \"Zhu Tong called out from the shadows: 'Headman, don't run!'\" Zhu " +
      "Tong's tiger-whisker beard is a foot and a half long, and his face is like a " +
      "dark-red date.",
    evaluationCriteria:
      "Full credit: Fire breaks out inside the manor; on the left of the frame, in the " +
      "firelight at the back gate, Chao Gai charges out with his pudao leveled, followed " +
      "by Gongsun Sheng with twin hair buns; in the shadows on the right of the frame " +
      "Zhu Tong, his long beard hanging to his chest and his face like a dark-red date, " +
      "holds a pudao and calls out to Chao Gai, not giving way; the flames and black " +
      "smoke, the firelight, and the long beard and robe corners loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: Zhu Tong holding a crescent blade; blood " +
      "shown; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-019": {
    coreKey:
      "Lin Chong kicking the table aside, rising and drawing his knife, Wang Lun " +
      "standing in alarm, and Wu Yong stroking his beard, with animated lotus leaves and " +
      "flowers, ripples and pavilion reflection, and beard and robe front",
    groundTruth:
      "Chapter 19, \"Lin Chong Leads a Great Showdown in the Water Stronghold; Chao Gai " +
      "Takes Over Liangshan Marsh\". \"Chao Gai and the other six rose, about to go down " +
      "from the pavilion\"; \"Lin Chong gave the table one kick, sent it aside, and " +
      "sprang up\", \"and from under his robe front drew a gleaming knife\"; \"Wu Yong " +
      "then stroked his whiskers with his hand\". Seizing Wang Lun comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Wang Lun stands in alarm before the host's " +
      "seat; in the left foreground Lin Chong, leopard-headed and round-eyed, with the " +
      "characters tattooed on his cheek, rises and draws a short knife; the pavilion is " +
      "reflected in the water; on the right of the frame the guests have already left " +
      "their seats and stood up, and Wu Yong raises his hand to stroke his beard; the " +
      "lotus leaves and flowers, the ripples and pavilion reflection, and the beard and " +
      "robe front loop smoothly, driven by SMIL or inline CSS. Deductions: Wu Yong " +
      "holding a feather fan; blood shown; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-020": {
    coreKey:
      "Song Jiang at the mouth of the lane holding Liu Tang's hand and giving parting " +
      "advice, and Liu Tang in his felt hat with bundle and pudao (long-handled saber), " +
      "with animated thin clouds drifting across the moon and robes",
    groundTruth:
      "Chapter 20, \"The Righteous Men of Liangshan Marsh Honor Chao Gai; Liu Tang " +
      "Departs Yuncheng County on a Moonlit Night\". \"They came out to the mouth of the " +
      "lane; it was dusk, the middle of the eighth month, and the moon was coming up\"; " +
      "\"Song Jiang held Liu Tang's hand\" and gave him parting advice; Liu Tang " +
      "\"shouldered his bundle and took up his pudao\", wearing a white Fanyang felt hat " +
      "and a black-green silk-gauze jacket.",
    evaluationCriteria:
      "Full credit: A full moon just rising above the roof ridges at the upper right of " +
      "the frame; on the left of the frame Song Jiang, dark-faced and short, holds Liu " +
      "Tang's hand; on the right of the frame Liu Tang, with a broad purplish-black face " +
      "and a cinnabar-red birthmark beside his temple, in a white felt hat and a " +
      "black-green silk-gauze jacket, bundle on his back and pudao in hand; the thin " +
      "clouds drifting across the moon and the robe hems loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: Liu Tang with red hair; gold ingots showing; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-021": {
    coreKey:
      "Granny Yan, five fingers spread and hand raised, not yet fallen, and Tang Niu'er " +
      "pushing up in front of her, with animated lamp flame and shadows, curtain corner, " +
      "and garment corners",
    groundTruth:
      "Chapter 21, \"The Old Bawd Drunkenly Beats Tang Niu'er; Song Jiang Kills Yan " +
      "Poxi in a Rage\". Tang Niu'er \"pushed his way up and said: 'Hit me!'\"; \"the " +
      "old woman, emboldened by the wine, spread her five fingers\"; \"the glazed lamp in " +
      "the front hall was burning bright\". The two slaps in a row come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, at the foot of the stairs, Granny Yan " +
      "spreads her five fingers and raises her hand, frozen and not yet fallen; on the " +
      "right of the frame, before the door curtain, Tang Niu'er thrusts his head forward " +
      "and pushes up in front of her; the lamp flame and shadows, the curtain corner, " +
      "and the garment corners loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Granny Yan's hand falling or slapping again and again; Song Jiang or Poxi; blood " +
      "shown; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-022": {
    coreKey:
      "Zhu Tong tugging the rope as the bronze bell rings and Song Jiang crawling out of " +
      "the cellar, with animated bronze bell, dust rising from the opening, and " +
      "tiger-whisker beard",
    groundTruth:
      "Chapter 22, \"Granny Yan Wreaks Havoc in Yuncheng County; Zhu Tong Out of " +
      "Loyalty Releases Song Gongming\". Zhu Tong \"leaned his pudao (long-handled " +
      "saber) against the wall and bolted the door. He went into the shrine room\", " +
      "\"dragged the offering table aside and lifted that floorboard\", \"gave the rope " +
      "end one tug, the bronze bell rang once, and Song Jiang crawled out of the " +
      "cellar\". Zhu Tong has a face like a dark-red date and a tiger-whisker beard a " +
      "foot and a half long.",
    evaluationCriteria:
      "Full credit: The Buddhas of the Three Ages at the back of the shrine room; on the " +
      "left of the frame Zhu Tong, his face like a dark-red date and his long beard " +
      "hanging to his chest, tugs the rope end, no blade in his hands; in the middle of " +
      "the frame the offering table dragged aside, and Song Jiang, dark-faced and short, " +
      "crawls out of the opening; the bronze bell, the rising dust, and the beard loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Zhu Tong holding a blade; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "shuihu-anim-023": {
    coreKey:
      "Wu Song, his left hand gripping the striped hide on the tiger's crown and " +
      "pressing its jaws into the mud, his right fist frozen and not yet brought down, " +
      "with animated tiger tail, yellow mud and grass bits, and branches and dry leaves",
    groundTruth:
      "Chapter 23, \"Chai Jin Detains a Guest in Henghai Prefecture; Wu Song Beats the " +
      "Tiger on Jingyang Ridge\". Going up the ridge he \"slung the felt hat on his " +
      "back\", and after the tiger is dead he \"found the felt hat beside the rock\"; " +
      "\"he threw the half cudgel aside\", \"pressed the beast's jaws straight down into " +
      "the yellow mud pit\", \"his left hand gripping the striped hide on its crown " +
      "tightly, and freed his right hand\". Blood comes later.",
    evaluationCriteria:
      "Full credit: Left of center in the frame Wu Song, tall and burly, with brows " +
      "black as if brushed with lacquer, his red pongee jacket open at the front, grips " +
      "the striped hide on the tiger's crown with his left hand, his right fist not yet " +
      "brought down; right of center in the frame the tiger with upslanted eyes and a " +
      "white forehead, black stripes on yellow, its jaws pressed into the mud pit; on " +
      "the left of the frame the broken half of the cudgel under a pine; on the right of " +
      "the frame a big bluestone with the white felt hat beside it; the tiger tail, the " +
      "yellow mud and grass bits, and the branches and dry leaves loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Blood shown; Wu Song holding the cudgel, wearing " +
      "the felt hat, or pounding down with his fist again and again; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-024": {
    coreKey:
      "The forked pole landing squarely on Ximen Qing's headscarf, Jinlian letting go " +
      "of the pole, and Granny Wang watching from behind the curtain, with animated " +
      "reed blind, steam from the tea stove, and headscarf ribbons and sashes",
    groundTruth:
      "Chapter 24, \"Granny Wang, Greedy for a Bribe, Arranges an Affair; Yun'ge, " +
      "Indignant, Makes a Scene at the Teahouse\". Winter is nearly over; with the " +
      "forked pole Jinlian \"lost her grip, and it slipped and fell, and, as chance " +
      "would have it, struck that man right on his headscarf\"; \"the old woman was in " +
      "her tea shop under the door curtain and saw it\". Turning his face and breaking " +
      "into a smile comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, before the ground-floor door of Wu Da's " +
      "house, Jinlian, properly dressed, has let go of the forked pole; in the middle of " +
      "the frame Ximen Qing's headscarf is struck by the tip of the pole, his steps just " +
      "halted; on the right of the frame Granny Wang watches from behind the curtain; " +
      "the reed blind, the steam, and the sashes loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The pole dropped from a second-floor window; Ximen Qing holding " +
      "a folding fan; the two flirting; the forked pole falling again and again; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
};
