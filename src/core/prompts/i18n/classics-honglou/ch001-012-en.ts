/**
 * 《红楼梦》第 1–12 回候选的英文标签与英文评判标准，由
 * src/core/classics/honglou/ch001-012.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const HONGLOU_CH001_012_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-001": "Ch. 1 · Shiyin Meets the Monk and the Taoist in the Street",
  "honglou-002": "Ch. 2 · Yucun Reads the Couplet at Zhitong Temple",
  "honglou-003": "Ch. 3 · Xifeng Enters Grandmother Jia's Main Room Laughing",
  "honglou-004": "Ch. 4 · The Clerk Gives a Warning Look in the Tribunal Hall",
  "honglou-005": "Ch. 5 · Before the Stone Archway of the Land of Illusion",
  "honglou-006": "Ch. 6 · Granny Liu Hears the Clock on the Kang",
  "honglou-007": "Ch. 7 · Mrs. Zhou Rui Delivers the Palace Flowers",
  "honglou-008": "Ch. 8 · Baochai Holds the Jade in Her Palm to Examine It",
  "honglou-009": "Ch. 9 · Mingyan Bursts into the Schoolroom",
  "honglou-010": "Ch. 10 · Zhang Youshi Takes the Pulse",
  "honglou-011": "Ch. 11 · Xifeng Admires the Scenery in the Garden of Gathered Fragrance",
  "honglou-012": "Ch. 12 · Jia Lian Sees Daiyu onto the Boat",
};

/** 静态与动态候选 id → 英文评判标准 */
export const HONGLOU_CH001_012_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-001": {
    coreKey:
      "Before the Zhen family gate in the heat of summer: Shiyin holds the three-year-old " +
      "Yinglian, a scabby-headed, barefoot monk wails loudly at Yinglian, and a lame " +
      "Taoist with tousled hair arrives with him",
    groundTruth:
      "Chapter 1, \"Zhen Shiyin Comes to Know the Magic Jade in a Dream; Jia Yucun, amid " +
      "the Dust of the World, Cherishes a Fair Maid\". \"A long day in the heat of " +
      "summer\"; Shiyin, holding Yinglian, \"carried her out to the street to watch the " +
      "bustle of the passing procession\"; \"the monk was scabby-headed and barefoot, the " +
      "Taoist lame and with tousled hair\", and \"seeing Shiyin holding Yinglian, the " +
      "monk burst into loud weeping\". Reciting the verse comes later.",
    evaluationCriteria:
      "Full credit: The street before the Zhen family gate on a blazing summer day, with " +
      "neighbors in the distance watching the procession; on the left of the frame Zhen " +
      "Shiyin, already fifty, holds his three-year-old daughter Yinglian; on the right of " +
      "the frame a scabby-headed, barefoot monk, his mouth open, wails loudly at " +
      "Yinglian, and a lame Taoist with tousled hair arrives with him, both in ragged " +
      "clothes (a compositional convention; the left and right of the original text are " +
      "not tested). Deductions: Yinglian drawn as an older child; the monk or the Taoist " +
      "holding a crutch or a fly whisk; a nursemaid, Yucun, or the archway of the Land of " +
      "Illusion in the picture; Shiyin wearing an official's hat or a queue.",
  },
  "honglou-002": {
    coreKey:
      "Zhitong Temple outside Yangzhou: its gate and lane in ruins, Yucun stands alone " +
      "before the dilapidated little temple, looking up at the old, tattered couplet " +
      "beside the gate, not yet having entered",
    groundTruth:
      "Chapter 2, \"Lady Jia Passes Away in the City of Yangzhou; Leng Zixing Discourses " +
      "on the Rongguo Mansion\". Yucun \"happened to go outside the city walls\" and saw " +
      "a temple whose \"gate and lane had fallen into ruin and whose walls were " +
      "crumbling\"; \"over the gate was a tablet inscribed with the three characters " +
      "'Zhitong Temple'\", and \"beside the gate there was also an old, tattered " +
      "couplet\". Entering the temple and meeting the old monk come later.",
    evaluationCriteria:
      "Full credit: Outside Yangzhou, encircled by hills and winding streams, with dense " +
      "woods and deep bamboo; on the right of the frame the dilapidated little temple, " +
      "its gate and lane in ruins and its walls crumbling, a tablet reading \"Zhitong " +
      "Temple\", and an old, tattered couplet beside the gate; on the left of the frame " +
      "Jia Yucun, thick-waisted and broad-backed, with a wide face and a square mouth, " +
      "sword-like brows and starry eyes, stands alone looking up at the couplet, his " +
      "face visible in profile (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Yucun already inside the temple; the " +
      "old monk, attendants, or a sedan chair and horses in the picture; Yucun in " +
      "official robes or wearing a queue.",
  },
  "honglou-003": {
    coreKey:
      "Grandmother Jia's main room: Wang Xifeng, with a pearl-cluster chignon and a " +
      "five-phoenix hairpin, a scarlet narrow-fitting jacket, a slate-blue over-jacket, " +
      "and an emerald skirt, comes in laughing through the back door, and Daiyu rises",
    groundTruth:
      "Chapter 3, \"In Jinling, Jia Yucun Is Restored to Office; the Rongguo Mansion " +
      "Takes In Lin Daiyu\". \"A crowd of serving women and maids, clustered round one " +
      "person, came in through the back door\"; \"Daiyu hastily rose to greet her\"; " +
      "Xifeng wears a \"pearl-cluster chignon\", a \"five-phoenix pendant-pearl " +
      "hairpin\", a \"narrow-fitting jacket of scarlet foreign satin\", and a " +
      "\"slate-blue silver-squirrel over-jacket\". Taking Daiyu's hand and wiping away " +
      "tears come later.",
    evaluationCriteria:
      "Full credit: Grandmother Jia's main room; on the right of the frame Xifeng comes " +
      "in through the back door, with triangular phoenix eyes and willow-leaf brows " +
      "slanting upward, a pearl-cluster chignon and a five-phoenix pendant-pearl " +
      "hairpin, a scarlet narrow-fitting jacket, a slate-blue over-jacket, and an " +
      "emerald skirt, surrounded by serving women and maids; left of center in the " +
      "frame, beside Grandmother Jia's couch, Daiyu, small and frail, rises; on the left " +
      "of the frame Grandmother Jia, her hair silver at the temples (left and right, and " +
      "Grandmother Jia's seated posture, are compositional conventions). Deductions: " +
      "Xifeng already holding Daiyu's hand or holding a handkerchief; Baoyu in the " +
      "picture; a \"two-handle\" Manchu headdress or flowerpot-sole shoes; a " +
      "dragon-headed walking stick.",
  },
  "honglou-004": {
    coreKey:
      "The tribunal hall of Yingtian Prefecture: Yucun, in a black gauze hat and red " +
      "robe, angrily reaches for a warrant slip, the clerk (menzi) standing by the desk " +
      "gives him a look to stop him, and the slip has not yet been issued",
    groundTruth:
      "Chapter 4, \"An Ill-Fated Girl Happens upon an Ill-Fated Young Man; the Gourd " +
      "Monk Settles the Gourd Case Any Old Way\". Yucun wears \"a black hat and scarlet " +
      "robe\" (Chapter 1), and \"went to issue a warrant slip sending runners to seize " +
      "members of the murderer's clan at once for interrogation\"; \"just as he was " +
      "about to issue the slip, he saw a clerk standing beside the desk giving him a " +
      "look, meaning him not to issue it.\" Withdrawing from the tribunal comes later.",
    evaluationCriteria:
      "Full credit: The tribunal hall of Yingtian Prefecture, with a tally-slip holder " +
      "of warrant slips on the judge's desk; in the middle of the frame Jia Yucun, " +
      "thick-waisted and broad-backed, with a wide face and a square mouth, in a black " +
      "gauze hat and red robe, sits behind the desk with an angry look, reaching toward " +
      "the tally-slip holder, the slip not yet issued; on the right of the frame the " +
      "clerk standing by the desk gives Yucun a look (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: The officials' " +
      "protective charm (huguanfu); cangues, ankle presses, flogging boards, or other " +
      "instruments of torture, or anyone being tortured (the water-and-fire staves " +
      "that the yamen runners on duty rest on the ground do not count); the clerk " +
      "shaven-headed in monk's robes; Yucun in a Qing official hat with finial and " +
      "peacock feather.",
  },
  "honglou-005": {
    coreKey:
      "The Land of Illusion in a dream: Baoyu follows the Fairy Jinghuan to the stone " +
      "archway and looks up at the tablet reading \"The Land of Illusion\"; vermilion " +
      "railings and white stones, green trees and clear streams may serve as background",
    groundTruth:
      "Chapter 5, \"Opening a Fresh Scene, the Dream of the Red Chamber Is Performed in " +
      "a Dream; Setting Up a New Stage, Love Is Conveyed in the Land of Illusion\". In " +
      "the dream he first follows Madam Qin, and \"all he saw were vermilion railings " +
      "and white stones, green trees and clear streams\"; after meeting Jinghuan, Baoyu " +
      "\"followed the fairy to a place where a stone archway stood across the way, " +
      "inscribed with the four large characters 'The Land of Illusion'\"; Jinghuan has " +
      "\"a kingfisher-dark chignon piled like clouds\". The palace gate and the " +
      "Department of the Ill-Fated come later.",
    evaluationCriteria:
      "Full credit: A fairyland of vermilion railings and white stones, green trees and " +
      "clear streams (scenery along the way there, which may serve as background); in " +
      "the middle of the frame the stone archway, its tablet bearing the four " +
      "characters \"The Land of Illusion\", with a couplet on its pillars; on the " +
      "left of the frame Baoyu as a young boy, his face like the mid-autumn moon, looks " +
      "up at the tablet; on the right of the frame the Fairy Jinghuan, with a " +
      "cloud-piled kingfisher-dark chignon and pale yellow makeup on her forehead, leads " +
      "the way (a compositional convention; the left and right of the original text are " +
      "not tested). Deductions: The palace gate, Qin Keqing, a couch, or the registers " +
      "in the picture; Jinghuan with wings or immodestly dressed.",
  },
  "honglou-006": {
    coreKey:
      "The east room in Xifeng's courtyard: Granny Liu, seated on the kang, hears a " +
      "clacking sound and stares blankly at the wooden box on the pillar and the " +
      "steelyard-weight-like pendulum swinging to and fro, the clock not yet striking",
    groundTruth:
      "Chapter 6, \"Jia Baoyu Has His First Taste of Clouds and Rain; Granny Liu Makes " +
      "Her First Visit to the Rongguo Mansion\". \"Autumn was ending and winter " +
      "beginning\"; \"Ping'er and Mrs. Zhou Rui sat facing each other on the edge of the " +
      "kang\"; \"suddenly she saw a box hanging on a pillar in the central room, with " +
      "something like a steelyard weight hanging beneath it, swinging to and fro without " +
      "stopping\". The clock striking comes later.",
    evaluationCriteria:
      "Full credit: The east room of the main building in Xifeng's courtyard, at the end " +
      "of autumn and the beginning of winter; on the left of the frame, on the kang, " +
      "Granny Liu, an old country woman, turns her head and stares blankly at the " +
      "wooden box, with Ban'er sitting close beside her; in the middle of the frame " +
      "Ping'er and Mrs. Zhou Rui sit facing each other on the edge of the kang, Ping'er " +
      "dressed all in silks and satins and adorned with gold and silver; on the right of " +
      "the frame, through the doorway, a wooden box can be seen hanging on a pillar in " +
      "the central room, with a steelyard-weight-like pendulum beneath it (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: The clock already striking; Xifeng in the picture; bedding " +
      "or a kang table; Granny Liu caricatured or with her head stuck full of flowers.",
  },
  "honglou-007": {
    coreKey:
      "Baoyu's room: Baoyu holds open a small brocade box with two sprays of gauze " +
      "palace flowers inside, Daiyu looks at them in his hands, and Mrs. Zhou Rui, " +
      "empty-handed, faces the two",
    groundTruth:
      "Chapter 7, \"Delivering the Palace Flowers, Mrs. Zhou Rui Sighs over Yinglian; " +
      "Talking of Schooling, Qin Zhong Befriends Baoyu\". Daiyu \"was in Baoyu's room, " +
      "where they were all playing at undoing the nine linked rings\"; when Baoyu " +
      "\"opened the box and looked, they were novel artificial flowers of piled gauze " +
      "made in the palace style\", only two sprays left; Daiyu looks at them in Baoyu's " +
      "hands and asks whether they were sent to her alone. Her cold laugh comes later.",
    evaluationCriteria:
      "Full credit: Baoyu's room, with the nine linked rings nearby; in the middle of " +
      "the frame Baoyu as a youth holds the opened small brocade box in both hands, two " +
      "sprays of gauze palace flowers inside; on the left of the frame Daiyu as a young " +
      "girl, slender and frail, her brows slightly knit, looks at the flowers in " +
      "Baoyu's hands; on the right of the frame Mrs. Zhou Rui stands empty-handed, " +
      "facing the two (a compositional convention; the left and right of the original " +
      "text are not tested). Deductions: The flowers already worn, or more than two " +
      "sprays; Baochai or Qin Zhong in the picture; bed curtains; Baoyu wearing a " +
      "purple-gold coronet.",
  },
  "honglou-008": {
    coreKey:
      "The inner room at Pear Fragrance Court: Baochai, seated on the kang, holds the " +
      "Magic Jade in her palm and examines it closely, turning her head to ask Ying'er, " +
      "Baoyu sits on the edge of the kang, and the golden locket is not yet shown",
    groundTruth:
      "Chapter 8, \"Xue Baochai, Slightly Unwell, at Pear Fragrance Court; Jia Baoyu, " +
      "Thoroughly Drunk, at Crimson Rue Studio\". Baochai \"held it on her palm and saw " +
      "that it was as big as a sparrow's egg, brilliant as rosy dawn clouds, lustrous " +
      "and smooth as cream, and wrapped in patterns of five colors\"; Baochai wears \"a " +
      "honey-colored padded jacket, a rose-purple sleeveless over-jacket of two-toned " +
      "gold and silver squirrel fur, and a padded skirt of onion-yellow damask\". " +
      "Bringing out the golden locket comes later.",
    evaluationCriteria:
      "Full credit: The inner room at Pear Fragrance Court; on the left of the frame " +
      "Baochai sits on the kang in a honey-colored padded jacket, a rose-purple " +
      "sleeveless over-jacket, and an onion-yellow damask skirt, holding in her palm the " +
      "Magic Jade, as big as a sparrow's egg and patterned in five colors, and turns her " +
      "head to look past Baoyu at Ying'er; in the middle of the frame Baoyu sits on the " +
      "edge of the kang in a purple-gold coronet, a forehead band, and an olive-yellow " +
      "archer's-cuff robe; on the right of the frame Ying'er stands before the kang with " +
      "empty hands (a compositional convention; the left and right of the original text " +
      "are not tested). Deductions: The golden locket showing; Aunt Xue or Daiyu in the " +
      "picture; the two leaning against each other; a Manchu headdress or " +
      "flowerpot-sole shoes.",
  },
  "honglou-009": {
    coreKey:
      "The family school: with Dairu away, Mingyan bursts in and stands beside Jin " +
      "Rong's desk without yet raising a hand, Jin Rong sits behind the desk, and no " +
      "inkstone or book box has yet flown",
    groundTruth:
      "Chapter 9, \"Drawn by Romance, Loving Friends Enter the Family School; Stirring " +
      "Up Suspicion, Unruly Boys Raise an Uproar in the Schoolroom\". \"As it happened, " +
      "that day Dairu had some business and had already gone home\"; Mingyan \"came " +
      "straight in looking for Jin Rong\", saying only, \"You, Jin, what sort of thing " +
      "are you!\" The inkstone flying over and Jia Jun throwing the book box come later.",
    evaluationCriteria:
      "Full credit: The schoolroom of the family school; on the right of the frame " +
      "Mingyan, having just burst in, stands side-on beside Jin Rong's desk without yet " +
      "raising a hand, and Jin Rong sits behind the desk; on the left of the frame Baoyu " +
      "and Qin Zhong sit at two adjacent desks, the books, brush, inkstone, and tea bowl " +
      "on Baoyu's desk intact, Qin Zhong with fine brows and clear eyes, a powder-white " +
      "face and red lips; in the back row the schoolboys sit in their places (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: An inkstone or book box flying, bamboo rods or a door bar, " +
      "or anyone coming to blows; the tutor or a ferule in the picture; shaved " +
      "foreheads with hanging queues.",
  },
  "honglou-010": {
    coreKey:
      "The inner room of Jia Rong's quarters: Zhang Youshi presses three fingers on " +
      "Madam Qin's right wrist and carefully takes her pulse, Madam Qin rests her arm on " +
      "a large bolster while a serving woman pulls back her sleeve, and Jia Rong stands " +
      "in attendance",
    groundTruth:
      "Chapter 10, \"Widow Jin, Greedy for Gain, Swallows an Insult; Physician Zhang, " +
      "Discussing the Illness, Traces It to Its Source\". \"The serving women of the " +
      "household brought over a large bolster and at the same time pulled back Madam " +
      "Qin's sleeve to expose the pulse\"; \"only then did the doctor reach out and " +
      "press on the pulse of her right hand, regulate his breathing to count the beats, " +
      "and calmly and carefully take the pulse for half a quarter of an hour\". " +
      "Switching to the pulse of the left hand and writing the prescription come later.",
    evaluationCriteria:
      "Full credit: The inner room of Jia Rong's quarters; on the left of the frame " +
      "Madam Qin, a young married woman, slender and graceful, her hair neatly dressed, " +
      "sits upright with her right arm resting on a large bolster, and a serving woman " +
      "pulls back her sleeve to expose the wrist; on the right of the frame Zhang Youshi " +
      "presses three fingers on Madam Qin's right wrist, taking her pulse with close " +
      "attention, and Jia Rong stands behind him (a compositional convention; the left " +
      "and right of the original text are not tested). Deductions: A prescription, a " +
      "medicine bowl, or a medicine chest; a pulse thread, a curtain between them, or a " +
      "handkerchief over the wrist; Madam Qin lying in bed; the doctor in official " +
      "robes.",
  },
  "honglou-011": {
    coreKey:
      "Autumn in the Garden of Gathered Fragrance: yellow chrysanthemums covering the " +
      "ground, white willows across the slope, a stream and red leaves; Xifeng, with old " +
      "serving women and maids, admires the scenery as she goes, and Jia Rui has not yet " +
      "appeared",
    groundTruth:
      "Chapter 11, \"Celebrating a Birthday, the Ningguo Mansion Holds a Family Feast; " +
      "Seeing Xifeng, Jia Rui Conceives a Lustful Desire\". \"Yellow flowers covered the " +
      "ground, white willows lay across the slope\"; \"clear water rushed among the " +
      "rocks, fragrance drifted from the hedges, and red leaves fluttered on the " +
      "treetops\"; \"Xifeng was just looking at the scenery in the garden, praising it " +
      "step by step as she came along\". The time is \"the middle of the ninth month\"; " +
      "Jia Rui comes later.",
    evaluationCriteria:
      "Full credit: The Garden of Gathered Fragrance on an autumn day in the middle of " +
      "the ninth month, yellow chrysanthemums covering the ground, white willows across " +
      "the slope, a small bridge over a rushing stream, and red leaves on the treetops; " +
      "in the middle of the frame Xifeng, with triangular phoenix eyes and willow-leaf " +
      "brows slanting upward, slender, turns her head to look at the scenery, smiling; " +
      "on the left of the frame old serving women and maids follow a few steps behind " +
      "(a compositional convention; the left and right of the original text are not " +
      "tested). Deductions: Jia Rui or a figure behind the rockery in the picture; the " +
      "Tower of Celestial Fragrance; peach, apricot, or plum blossoms, or snow; a Manchu " +
      "headdress or flowerpot-sole shoes.",
  },
  "honglou-012": {
    coreKey:
      "A canal wharf late in winter: Jia Lian leads Daiyu, about ten years old, and the " +
      "servants aboard, the boat moored at the bank with a gangplank laid, not yet under " +
      "way",
    groundTruth:
      "Chapter 12, \"Wang Xifeng Viciously Sets a Lovesick Trap; Jia Tianxiang Looks " +
      "into the Front of the Mirror of Romance\". \"Late in the winter of that year\", " +
      "\"Grandmother Jia insisted that Jia Lian escort her\"; \"Jia Lian and Lin Daiyu " +
      "took leave of Grandmother Jia and the others and, leading their servants, boarded " +
      "a boat for Yangzhou\". Dress, the wharf, and the type of boat are not described " +
      "in the original; all are inferred.",
    evaluationCriteria:
      "Full credit: A canal wharf late in winter, the boat moored at the bank and not " +
      "yet under way; in the middle of the frame Jia Lian leads the way for Daiyu, a " +
      "young girl of delicate build, the two about to board; on the left of the frame " +
      "servants carry trunks, cases, and bundles on their shoulders (the " +
      "wharf, positions, dress, and boat type are inferred and not tested against the " +
      "original). Deductions: The boat already under way; Grandmother Jia or Baoyu " +
      "seeing them off, or a tearful farewell; snow or an icebound river; Jia Lian in " +
      "official robes with a rank badge (buzi) or wearing a queue.",
  },
  "honglou-anim-001": {
    coreKey:
      "Shiyin holding Yinglian, a scabby-headed, barefoot monk wailing loudly at " +
      "Yinglian, and a lame Taoist with tousled hair arriving with him, with animated " +
      "colored flags and canopy, and ragged clothes and tousled hair",
    groundTruth:
      "Chapter 1, \"Zhen Shiyin Comes to Know the Magic Jade in a Dream; Jia Yucun, amid " +
      "the Dust of the World, Cherishes a Fair Maid\". \"A long day in the heat of " +
      "summer\"; Shiyin, holding Yinglian, \"carried her out to the street to watch the " +
      "bustle of the passing procession\"; \"the monk was scabby-headed and barefoot, the " +
      "Taoist lame and with tousled hair\", and \"seeing Shiyin holding Yinglian, the " +
      "monk burst into loud weeping\". Reciting the verse comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Zhen Shiyin, already fifty, holds the " +
      "three-year-old Yinglian; on the right of the frame a scabby-headed, barefoot " +
      "monk, his mouth open, wails loudly at Yinglian, and a lame Taoist with tousled " +
      "hair arrives with him (a compositional convention; the left and right of the " +
      "original text are not tested); the colored flags and canopy, and the ragged " +
      "clothes and tousled hair loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The monk or the Taoist holding a crutch or a fly whisk; a nursemaid " +
      "or Yucun in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-002": {
    coreKey:
      "Yucun standing alone before the dilapidated little Zhitong Temple, looking up at " +
      "the old, tattered couplet, with animated bamboo leaves and treetops, and ripples " +
      "on the stream",
    groundTruth:
      "Chapter 2, \"Lady Jia Passes Away in the City of Yangzhou; Leng Zixing Discourses " +
      "on the Rongguo Mansion\". Yucun \"happened to go outside the city walls\" and saw " +
      "a temple whose \"gate and lane had fallen into ruin and whose walls were " +
      "crumbling\"; \"over the gate was a tablet inscribed with the three characters " +
      "'Zhitong Temple'\", and \"beside the gate there was also an old, tattered " +
      "couplet\". Entering the temple and meeting the old monk come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the dilapidated little temple, a tablet " +
      "reading \"Zhitong Temple\", and an old, tattered couplet beside the gate; on the " +
      "left of the frame Jia Yucun, thick-waisted and broad-backed, with a wide face and " +
      "a square mouth, stands alone looking up at the couplet, his face visible in " +
      "profile (a compositional convention; the left and right of the original text are " +
      "not tested); the bamboo leaves and the stream loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Yucun already inside the temple; the old monk or " +
      "attendants in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-003": {
    coreKey:
      "Xifeng, with a pearl-cluster chignon, a five-phoenix hairpin, and a scarlet " +
      "narrow-fitting jacket, coming in laughing through the back door, and Daiyu " +
      "rising, with animated pearl hairpin and palace sash, door curtain, and tea steam",
    groundTruth:
      "Chapter 3, \"In Jinling, Jia Yucun Is Restored to Office; the Rongguo Mansion " +
      "Takes In Lin Daiyu\". \"A crowd of serving women and maids, clustered round one " +
      "person, came in through the back door\"; \"Daiyu hastily rose to greet her\"; " +
      "Xifeng wears a \"pearl-cluster chignon\", a \"five-phoenix pendant-pearl " +
      "hairpin\", a \"narrow-fitting jacket of scarlet foreign satin\", and a " +
      "\"slate-blue silver-squirrel over-jacket\". Taking Daiyu's hand and wiping away " +
      "tears come later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Xifeng comes in through the back door, " +
      "with a pearl-cluster chignon and a five-phoenix pendant-pearl hairpin, a scarlet " +
      "narrow-fitting jacket, and an emerald skirt; left of center in the frame, beside " +
      "Grandmother Jia's couch, Daiyu, small and frail, rises to her feet (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the pearl hairpin and palace sash, the door curtain, and the tea steam " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Xifeng already holding " +
      "Daiyu's hand; Baoyu in the picture; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-004": {
    coreKey:
      "Yucun, in a black gauze hat and red robe, angrily reaching for a warrant slip, " +
      "and the clerk by the desk giving him a look, with animated signaling wink, " +
      "incense smoke from the censer, and hanging drapes",
    groundTruth:
      "Chapter 4, \"An Ill-Fated Girl Happens upon an Ill-Fated Young Man; the Gourd " +
      "Monk Settles the Gourd Case Any Old Way\". Yucun wears \"a black hat and scarlet " +
      "robe\" (Chapter 1), and \"went to issue a warrant slip sending runners to seize " +
      "members of the murderer's clan at once for interrogation\"; \"just as he was " +
      "about to issue the slip, he saw a clerk standing beside the desk giving him a " +
      "look, meaning him not to issue it.\" Withdrawing from the tribunal comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Jia Yucun, thick-waisted and " +
      "broad-backed, with a wide face and a square mouth, in a black gauze hat and red " +
      "robe, sits behind the judge's desk with an angry look, reaching toward the " +
      "tally-slip holder, the slip not yet issued; on the right of the frame the clerk " +
      "by the desk gives Yucun a look (a compositional convention; the left and right " +
      "of the original text are not tested); the wink, the incense smoke, and the drapes " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: The officials' " +
      "protective charm (huguanfu); cangues, ankle presses, flogging boards, or other " +
      "instruments of torture, or anyone being tortured (the water-and-fire staves " +
      "that the yamen runners on duty rest on the ground do not count); whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-005": {
    coreKey:
      "Baoyu following the Fairy Jinghuan to the stone archway of \"The Land of " +
      "Illusion\" and looking up at the tablet, with animated sleeves and ribbons, and " +
      "ripples on the clear stream",
    groundTruth:
      "Chapter 5, \"Opening a Fresh Scene, the Dream of the Red Chamber Is Performed in " +
      "a Dream; Setting Up a New Stage, Love Is Conveyed in the Land of Illusion\". In " +
      "the dream he first follows Madam Qin, and \"all he saw were vermilion railings " +
      "and white stones, green trees and clear streams\"; after meeting Jinghuan, Baoyu " +
      "\"followed the fairy to a place where a stone archway stood across the way, " +
      "inscribed with the four large characters 'The Land of Illusion'\"; Jinghuan has " +
      "\"a kingfisher-dark chignon piled like clouds\". The palace gate and the " +
      "Department of the Ill-Fated come later.",
    evaluationCriteria:
      "Full credit: Vermilion railings and white stones, green trees and clear streams " +
      "(scenery along the way there); in the middle of the frame the stone archway, its " +
      "tablet reading \"The Land of Illusion\"; on the left of the frame Baoyu as a " +
      "young boy looks up at the tablet, and on the right of the frame the Fairy " +
      "Jinghuan, with a cloud-piled kingfisher-dark chignon and pale yellow makeup on " +
      "her forehead (a compositional convention; the left and right of the original " +
      "text are not tested); the sleeves and ribbons, and the ripples loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Jinghuan with wings; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-006": {
    coreKey:
      "Granny Liu on the kang staring at the wooden box on the pillar and the pendulum " +
      "swinging to and fro, and Ping'er and Mrs. Zhou Rui seated on the edge of the " +
      "kang, with animated pendulum, door curtain, and tea steam",
    groundTruth:
      "Chapter 6, \"Jia Baoyu Has His First Taste of Clouds and Rain; Granny Liu Makes " +
      "Her First Visit to the Rongguo Mansion\". \"Autumn was ending and winter " +
      "beginning\"; \"Ping'er and Mrs. Zhou Rui sat facing each other on the edge of the " +
      "kang\"; \"suddenly she saw a box hanging on a pillar in the central room, with " +
      "something like a steelyard weight hanging beneath it, swinging to and fro without " +
      "stopping\". The clock striking comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, on the kang, Granny Liu stares at the " +
      "wooden box, with Ban'er sitting close beside her; in the middle of the frame " +
      "Ping'er and Mrs. Zhou Rui sit facing each other on the edge of the kang; on the " +
      "right of the frame the wooden box on a pillar in the central room, with a " +
      "steelyard-weight-like pendulum beneath it (a compositional convention; the left " +
      "and right of the original text are not tested); the pendulum, the door curtain, " +
      "and the tea steam loop smoothly, driven by SMIL or inline CSS. Deductions: The " +
      "clock already striking; Xifeng in the picture; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-007": {
    coreKey:
      "Baoyu holding open a small brocade box with two sprays of gauze palace flowers " +
      "inside, and Daiyu looking at them in his hands, with animated gauze flowers, " +
      "nine linked rings, and pearl string at the end of his braid",
    groundTruth:
      "Chapter 7, \"Delivering the Palace Flowers, Mrs. Zhou Rui Sighs over Yinglian; " +
      "Talking of Schooling, Qin Zhong Befriends Baoyu\". Daiyu \"was in Baoyu's room, " +
      "where they were all playing at undoing the nine linked rings\"; when Baoyu " +
      "\"opened the box and looked, they were novel artificial flowers of piled gauze " +
      "made in the palace style\", only two sprays left; Daiyu looks at them in Baoyu's " +
      "hands and asks whether they were sent to her alone. Her cold laugh comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Baoyu as a youth holds open the small " +
      "brocade box, two sprays of gauze palace flowers inside; on the left of the frame " +
      "Daiyu as a young girl looks at the flowers in Baoyu's hands; on the right of the " +
      "frame Mrs. Zhou Rui, empty-handed, faces the two (a compositional convention; " +
      "the left and right of the original text are not tested); the gauze flowers, the " +
      "nine linked rings, and the end of the braid loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: The flowers already worn; Baochai in the picture; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-008": {
    coreKey:
      "Baochai seated on the kang holding the Magic Jade in her palm and turning her " +
      "head to ask Ying'er, and Baoyu seated on the edge of the kang, with animated " +
      "silk cord of the jade, soft door curtain, and Baoyu's sash (luantao)",
    groundTruth:
      "Chapter 8, \"Xue Baochai, Slightly Unwell, at Pear Fragrance Court; Jia Baoyu, " +
      "Thoroughly Drunk, at Crimson Rue Studio\". Baochai \"held it on her palm and saw " +
      "that it was as big as a sparrow's egg, brilliant as rosy dawn clouds, lustrous " +
      "and smooth as cream, and wrapped in patterns of five colors\"; Baochai wears \"a " +
      "honey-colored padded jacket, a rose-purple sleeveless over-jacket of two-toned " +
      "gold and silver squirrel fur, and a padded skirt of onion-yellow damask\". " +
      "Bringing out the golden locket comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Baochai sits on the kang in a " +
      "honey-colored padded jacket and an onion-yellow damask skirt, holding in her " +
      "palm the Magic Jade patterned in five colors, and turns her head to look past " +
      "Baoyu at Ying'er; in the middle of the frame Baoyu sits on the edge of the kang; " +
      "on the right of the frame Ying'er stands before the kang (a compositional " +
      "convention; the left and right of the original text are not tested); the silk " +
      "cord, the soft curtain, and the sash loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The golden locket showing; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-009": {
    coreKey:
      "Mingyan bursting in and standing beside Jin Rong's desk without yet raising a " +
      "hand, and Jin Rong seated behind the desk, with animated light and shadow from " +
      "the window lattice, book pages, and robe hem",
    groundTruth:
      "Chapter 9, \"Drawn by Romance, Loving Friends Enter the Family School; Stirring " +
      "Up Suspicion, Unruly Boys Raise an Uproar in the Schoolroom\". \"As it happened, " +
      "that day Dairu had some business and had already gone home\"; Mingyan \"came " +
      "straight in looking for Jin Rong\", saying only, \"You, Jin, what sort of thing " +
      "are you!\" The inkstone flying over and Jia Jun throwing the book box come later.",
    evaluationCriteria:
      "Full credit: The schoolroom of the family school; on the right of the frame " +
      "Mingyan, having just burst in, stands side-on beside Jin Rong's desk without yet " +
      "raising a hand, and Jin Rong sits; on the left of the frame Baoyu and Qin Zhong " +
      "sit at two desks, the tea bowl on Baoyu's desk intact (a compositional " +
      "convention; the left and right of the original text are not tested); the light " +
      "and shadow, the book pages, and the robe hem loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: An inkstone or book box flying, or anyone coming to " +
      "blows; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-010": {
    coreKey:
      "Zhang Youshi pressing three fingers on Madam Qin's right wrist and taking her " +
      "pulse with close attention, and Madam Qin resting her arm on a large bolster, " +
      "with animated light and shadow from the window lattice, bamboo blind, and " +
      "clothing ties",
    groundTruth:
      "Chapter 10, \"Widow Jin, Greedy for Gain, Swallows an Insult; Physician Zhang, " +
      "Discussing the Illness, Traces It to Its Source\". \"The serving women of the " +
      "household brought over a large bolster and at the same time pulled back Madam " +
      "Qin's sleeve to expose the pulse\"; \"only then did the doctor reach out and " +
      "press on the pulse of her right hand, regulate his breathing to count the beats, " +
      "and calmly and carefully take the pulse for half a quarter of an hour\". " +
      "Switching to the pulse of the left hand and writing the prescription come later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Madam Qin, slender and graceful, sits " +
      "upright with her right arm resting on a large bolster, and a serving woman pulls " +
      "back her sleeve; on the right of the frame Zhang Youshi presses three fingers on " +
      "Madam Qin's right wrist, taking her pulse with close attention (a compositional " +
      "convention; the left and right of the original text are not tested); the light " +
      "and shadow, the bamboo blind, and the clothing ties loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: A prescription or a medicine bowl; a pulse thread or a " +
      "handkerchief over the wrist; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "honglou-anim-011": {
    coreKey:
      "Xifeng amid the autumn scenery of the Garden of Gathered Fragrance, turning her " +
      "head to admire the view, with old serving women and maids following, with " +
      "animated red leaves, clear stream, and willow branches and skirt hem",
    groundTruth:
      "Chapter 11, \"Celebrating a Birthday, the Ningguo Mansion Holds a Family Feast; " +
      "Seeing Xifeng, Jia Rui Conceives a Lustful Desire\". \"Yellow flowers covered the " +
      "ground, white willows lay across the slope\"; \"clear water rushed among the " +
      "rocks, fragrance drifted from the hedges, and red leaves fluttered on the " +
      "treetops\"; \"Xifeng was just looking at the scenery in the garden, praising it " +
      "step by step as she came along\". The time is \"the middle of the ninth month\"; " +
      "Jia Rui comes later.",
    evaluationCriteria:
      "Full credit: The Garden of Gathered Fragrance in the middle of the ninth month, " +
      "yellow chrysanthemums covering the ground, white willows across the slope; in " +
      "the middle of the frame Xifeng, with triangular phoenix eyes and willow-leaf " +
      "brows slanting upward, turns her head to look at the scenery, smiling; on the " +
      "left of the frame old serving women and maids follow a few steps behind (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the red leaves, the clear stream, and the willow branches and skirt hem " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Jia Rui in the picture; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "honglou-anim-012": {
    coreKey:
      "Jia Lian leading Daiyu, about ten years old, and the servants aboard, the boat " +
      "moored at the bank and not yet under way, with animated river ripples and " +
      "wooden boat, and withered reeds",
    groundTruth:
      "Chapter 12, \"Wang Xifeng Viciously Sets a Lovesick Trap; Jia Tianxiang Looks " +
      "into the Front of the Mirror of Romance\". \"Late in the winter of that year\", " +
      "\"Grandmother Jia insisted that Jia Lian escort her\"; \"Jia Lian and Lin Daiyu " +
      "took leave of Grandmother Jia and the others and, leading their servants, boarded " +
      "a boat for Yangzhou\". Dress, the wharf, and the type of boat are not described " +
      "in the original; all are inferred.",
    evaluationCriteria:
      "Full credit: A canal wharf late in winter, the boat moored at the bank and not " +
      "yet under way; in the middle of the frame Jia Lian leads the way for Daiyu, a " +
      "young girl of delicate build, the two about to board; on the left of the frame " +
      "servants carry trunks and cases on their shoulders (the wharf, positions, dress, " +
      "and boat type are inferred and not tested against the original); the ripples and " +
      "wooden boat, and the withered reeds loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The boat already under way or sliding across; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
};
