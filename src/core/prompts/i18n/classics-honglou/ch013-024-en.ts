/**
 * 《红楼梦》第 13–24 回候选的英文标签与英文评判标准，由
 * src/core/classics/honglou/ch013-024.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const HONGLOU_CH013_024_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-013": "Ch. 13 · Baoyu Presses the Tally Token on Xifeng",
  "honglou-014": "Ch. 14 · Xifeng Tosses Down a Tally Token in the Side Hall",
  "honglou-015": "Ch. 15 · The Prince of Beijing Catches Hold of Baoyu",
  "honglou-016": "Ch. 16 · Xia Shouzhong Delivers a Special Decree by Word of Mouth",
  "honglou-017": "Ch. 17 · Baoyu Composes a Couplet at Seeping Fragrance Pavilion",
  "honglou-018": "Ch. 18 · The Imperial Consort Views the Lantern Tablet from Her Boat",
  "honglou-019": "Ch. 19 · Xiren Offers Pine Nuts at the Hua Home",
  "honglou-020": "Ch. 20 · Daiyu Teases Xiangyun for Her Lisp",
  "honglou-021": "Ch. 21 · Xiangyun Combs Baoyu's Hair",
  "honglou-022": "Ch. 22 · Jia Zheng Reads the Lantern Riddles before the Screen",
  "honglou-023": "Ch. 23 · Daiyu with Her Hoe beneath the Peach Blossoms",
  "honglou-024": "Ch. 24 · Ni Er Recognizes Jia Yun through Drunken Eyes",
};

/** 静态与动态候选 id → 英文评判标准 */
export const HONGLOU_CH013_024_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-013": {
    coreKey:
      "The main room of the Ningguo Mansion: Jia Zhen stands leaning on a crutch, Baoyu " +
      "holds out the tally token (duipai) toward Xifeng, and Xifeng, standing, has not " +
      "taken the token and looks at Lady Wang",
    groundTruth:
      "Chapter 13, \"Qin Keqing Dies and Is Granted the Rank of Wife of an Imperial " +
      "Guard Officer; Wang Xifeng Helps Manage the Ningguo Mansion\". Jia Zhen \"came " +
      "pacing in, leaning on a crutch\"; \"Baoyu had already taken the tally token from " +
      "Jia Zhen's hand and forcibly handed it to Xifeng\", and Xifeng, not daring to " +
      "take it, looked at Lady Wang. Xifeng has \"triangular phoenix eyes and " +
      "willow-leaf brows slanting upward\". Going to the side hall (baoxia) to manage " +
      "affairs comes later.",
    evaluationCriteria:
      "Full credit: The main room of the inner quarters of the Ningguo Mansion; on the " +
      "right of the frame Jia Zhen, middle-aged and looking ill, stands leaning on a " +
      "crutch; in the middle of the frame Baoyu as a youth holds out the tally token " +
      "toward Xifeng; left of center in the frame Xifeng, with triangular phoenix eyes " +
      "and willow-leaf brows slanting upward, stands without taking the token, looking " +
      "at Lady Wang; on the left of the frame Lady Wang and Lady Xing sit side by side " +
      "(a compositional convention; the left and right of the original text are not " +
      "tested). Deductions: Xifeng already holding the token; Jia Zhen kneeling, seated, " +
      "shedding tears, or wearing a Qing official hat with finial; a coffin or bed " +
      "curtains in the picture.",
  },
  "honglou-014": {
    coreKey:
      "The side hall (baoxia) of the Ningguo Mansion: Xifeng, seated behind the desk, " +
      "tosses a tally token down in front of it, Caiming holds the list and records it, " +
      "and the wife of Wang Xing stands before the desk to receive the token",
    groundTruth:
      "Chapter 14, \"Lin Ruhai Passes Away in the City of Yangzhou; Jia Baoyu Pays His " +
      "Respects to the Prince of Beijing on the Road\". Xifeng \"stayed alone in the " +
      "side hall\"; the wife of Wang Xing came \"to collect a tally token for drawing " +
      "thread\"; Xifeng \"listened, found that the figures tallied, told Caiming to " +
      "record it, and took a Rongguo Mansion tally token and tossed it down\". The " +
      "latecomer has not yet been dealt with at this moment; the beating comes later.",
    evaluationCriteria:
      "Full credit: The side hall of the Ningguo Mansion in the early morning; in the " +
      "middle of the frame Xifeng, with triangular phoenix eyes and willow-leaf brows " +
      "slanting upward, seated behind the desk, tosses the tally token down in front of " +
      "the desk; on the left of the frame Caiming holds the list and reads it aloud, " +
      "brush in hand to record; on the right of the frame the wife of Wang Xing stands " +
      "before the desk, and a latecomer servant stands at the right edge with his hands " +
      "at his sides (a compositional convention; the left and right of the original " +
      "text are not tested). Deductions: A beating with boards or a punishment scene; " +
      "Xifeng looking angry; a mourning hall or coffin in the picture; a \"two-handle\" " +
      "Manchu headdress or flowerpot-sole shoes.",
  },
  "honglou-015": {
    coreKey:
      "Before the roadside offering tent: Shui Rong, the Prince of Beijing, reaches out " +
      "from his sedan chair to catch hold of Baoyu, Baoyu bows to pay his respects, and " +
      "Jia Zheng stands behind Baoyu",
    groundTruth:
      "Chapter 15, \"Wang Xifeng Abuses Her Power at Iron Threshold Temple; Qin " +
      "Jingqing Finds Pleasure at Mantou Convent\". Shui Rong was \"wearing a " +
      "silver-winged princely cap with pure white tassels, and a white python robe with " +
      "five-clawed seated dragons over sea waves and rocks\"; Baoyu, in a silver " +
      "hair-binding coronet and a white python archer's-cuff robe, \"hurried forward to " +
      "pay his respects, and Shui Rong quickly reached out from the sedan chair to " +
      "catch hold of him\". Asking about the jade and the gift of the prayer beads come " +
      "later.",
    evaluationCriteria:
      "Full credit: Before the roadside offering tent; on the left of the frame, in the " +
      "sedan chair, Shui Rong, not yet twenty, with a face like fine jade, in a " +
      "silver-winged princely cap and a white python robe, a string of prayer beads on " +
      "his wrist, leans out and reaches to catch hold of Baoyu; in the middle of the " +
      "frame Baoyu as a youth, in a silver hair-binding coronet, a forehead band of twin " +
      "dragons rising from the sea, a white python archer's-cuff robe, and a silver belt " +
      "studded with clusters of pearls, bows to pay his respects; on the right of the " +
      "frame Jia Zheng stands behind Baoyu (a compositional convention; the left and " +
      "right of the original text are not tested). Deductions: Shui Rong out of the " +
      "sedan chair; the prayer beads already given or the Magic Jade already taken out; " +
      "a coffin in the picture; an opera beard (rankou), pheasant plumes (lingzi), or a " +
      "Qing official hat with finial.",
  },
  "honglou-016": {
    coreKey:
      "The hall of the Jia mansion: Xia Shouzhong, empty-handed and all smiles, " +
      "delivers a special decree by word of mouth, and Jia She and Jia Zheng kneel " +
      "before the incense table to receive it",
    groundTruth:
      "Chapter 16, \"Jia Yuanchun, for Her Talents, Is Chosen for the Phoenix Elegance " +
      "Palace; Qin Jingqing Dies Young on the Road to the Yellow Springs\". \"They " +
      "cleared away the feast, set out an incense table, and opened the central gate to " +
      "kneel and receive him\"; Xia Shouzhong \"bore no edict and held no decree\", " +
      "and, \"all smiles, walked up into the hall and stood facing south\", delivering " +
      "a special decree by word of mouth, and no one knew what the news was. The " +
      "announcement of the good news comes later.",
    evaluationCriteria:
      "Full credit: The great hall of the Rongguo Mansion with the central gate wide " +
      "open and an incense table before the hall; on the right of the frame, in the " +
      "hall, Xia Shouzhong, empty-handed and all smiles, delivers a special decree by " +
      "word of mouth; on the left of the frame Jia She and Jia Zheng, in everyday cloth " +
      "caps and informal clothes, kneel side-on before the incense table to receive it, " +
      "their faces visible in profile, looking fearful (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: Xia Shouzhong " +
      "holding an edict, on horseback, or in a pointed hat and python robe; Yuanchun in " +
      "the picture; those kneeling laughing or in court attire (a black gauze hat and a " +
      "round-collared official robe); a Qing official hat with finial.",
  },
  "honglou-017": {
    coreKey:
      "On Seeping Fragrance Pavilion: Jia Zheng sits leaning on the railing, stroking " +
      "his beard and smiling, Baoyu stands in the pavilion looking all around and " +
      "improvises a couplet, and the literary retainers (qingke) are in the pavilion",
    groundTruth:
      "Chapter 17, \"Testing Talents with Couplets and Inscriptions in the Garden of " +
      "Gathered Fragrance; Jia Baoyu's Quick Wit Impresses the Guests\". \"White stones " +
      "formed a balustrade encircling the edge of the pool, a stone bridge spanned it " +
      "with three arches, and beasts' heads spouted water from their mouths. On the " +
      "bridge was a pavilion\"; \"Jia Zheng and the others went up into the pavilion " +
      "and sat down leaning on the railing\"; Baoyu \"stood in the pavilion and looked " +
      "all around\", and improvised a couplet. Visiting the Xiaoxiang Lodge comes later.",
    evaluationCriteria:
      "Full credit: Warm, mild weather, a clear stream, white stone balustrades, and " +
      "the pavilion on the stone bridge, with no tablet on the pavilion; in the " +
      "pavilion, on the left of the frame, Jia Zheng, bearded, sits leaning on the " +
      "railing, stroking his beard and smiling; on the right of the frame Baoyu as a " +
      "youth stands in the pavilion looking all around and improvises a couplet; two " +
      "literary retainers are in the pavilion (a compositional convention; the left " +
      "and right of the original text are not tested). Deductions: A tablet with " +
      "writing hung on the pavilion; Jia Zheng scolding, or Baoyu with his head lowered " +
      "being lectured; the Imperial Consort, lantern displays, or boats in the picture; " +
      "a Qing official hat with finial.",
  },
  "honglou-018": {
    coreKey:
      "The clear stream in the garden on the night of the Lantern Festival: the " +
      "Imperial Consort Yuanchun sits upright in a decorated boat and looks up, " +
      "smiling, at the lantern tablet reading \"Smartweed Bank and Flowery Cove\", with " +
      "storm lanterns along both banks",
    groundTruth:
      "Chapter 18, \"Lin Daiyu Mistakenly Cuts Up a Scent Pouch; Jia Yuanchun Returns " +
      "Home on a Visit to Celebrate the Lantern Festival\". \"Presently they entered a " +
      "stone inlet, above which hung a lantern tablet clearly showing the four " +
      "characters 'Smartweed Bank and Flowery Cove'\"; the Imperial Consort looked at " +
      "it and said with a smile that the two characters \"Flowery Cove\" alone would " +
      "do; Baochai speaks of her as one who \"wears the yellow robe\". Leaving the boat " +
      "for the sedan chair and receiving homage in the temporary palace come later.",
    evaluationCriteria:
      "Full credit: The night of the fifteenth of the first month, storm lanterns of " +
      "every color on the stone balustrades along both banks of the clear stream in " +
      "the garden, and artificial flowers and lanterns on the branches; in the middle " +
      "of the frame a decorated boat with its pearl curtains half rolled up, and the " +
      "Imperial Consort, in a yellow robe, seated upright in the boat, looks up at the " +
      "lantern tablet at the mouth of the stone inlet at the upper right of the frame, " +
      "smiling; beside her the eunuch holding the fly whisk and the eunuch attending " +
      "her seat stand in attendance, and at the stern eunuchs row with oars (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: The Imperial Consort in a sedan chair; a kneeling crowd of " +
      "welcomers in the picture; the lotus and waterbird lanterns drawn as real lotuses " +
      "and birds; the Grand View Tower or a \"two-handle\" Manchu headdress in the " +
      "picture.",
  },
  "honglou-019": {
    coreKey:
      "On the kang in the Hua home: Baoyu holds a hand warmer and rests his feet on a " +
      "foot warmer, Xiren stands by the kang and hands him shelled pine nuts on a " +
      "handkerchief, and the jade is still at his neck",
    groundTruth:
      "Chapter 19, \"On a Fine Night, with Earnest Feeling, the Flower Speaks Her Mind; " +
      "on a Quiet Day, with Lingering Tenderness, the Jade Gives Off Fragrance\". Baoyu " +
      "was \"wearing a scarlet archer's-cuff robe of fox-belly fur patterned with golden " +
      "pythons, with a slate-blue sable over-jacket with tasseled fringe on top\"; " +
      "Xiren set the foot warmer under his feet and put the hand warmer in his arms, " +
      "and \"picked up a few pine-nut kernels, blew off the thin skins, and offered " +
      "them to Baoyu on her handkerchief\". Taking off the jade and passing it round to " +
      "look at comes later.",
    evaluationCriteria:
      "Full credit: On the kang in the Hua home; in the middle of the frame Baoyu as a " +
      "youth, in a scarlet archer's-cuff robe of fox-belly fur patterned with golden " +
      "pythons and a slate-blue sable over-jacket with tasseled fringe, with the Magic " +
      "Jade, as big as a sparrow's egg, hanging at his neck, rests his feet on the foot " +
      "warmer and holds the hand warmer; on the right of the frame Xiren stands by the " +
      "kang and hands him shelled pine nuts on a handkerchief; on the left of the frame " +
      "Xiren's mother and Hua Zifang stand beside the fruit table, and the girls stand " +
      "with their heads lowered at the right edge (a compositional convention; the left " +
      "and right of the original text are not tested). Deductions: The jade taken off " +
      "and passed round; the jade drawn as a large white-and-green jade; a " +
      "Baochai-style golden locket in the picture; a \"two-handle\" Manchu headdress or " +
      "a Qing official hat with finial.",
  },
  "honglou-020": {
    coreKey:
      "Daiyu's room: Xiangyun lifts the door curtain and comes in laughing heartily, " +
      "Daiyu, sitting under the window, smilingly teases her for her lisp, and Baoyu " +
      "stands laughing",
    groundTruth:
      "Chapter 20, \"Wang Xifeng Rebukes Jealousy with Plain Words; Lin Daiyu Mocks a " +
      "Sweet Lisp with Playful Words\". \"Just as the two of them were talking, they " +
      "saw Xiangyun come in, laughing and saying\"; Daiyu laughs at her as \"a lisper " +
      "who loves to talk, who can't even manage to say 'Second' Brother\". Baochai has " +
      "already left, and Baoyu's dark fox-fur cape is already off; Xiangyun running off " +
      "comes later.",
    evaluationCriteria:
      "Full credit: Daiyu's room in the first month; on the left of the frame Daiyu as " +
      "a young girl, with mist-like knitted brows and dewy eyes, sits under the window, " +
      "smilingly teasing; in the middle of the frame Baoyu as a youth, without a " +
      "coronet, his braided hair tied with red cord and the Magic Jade hanging at his " +
      "neck, stands looking at Xiangyun and laughing; on the right of the frame " +
      "Xiangyun as a young girl lifts the curtain and comes in laughing heartily (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: Baochai or Xiren in the picture; Baoyu wearing a cape; " +
      "Daiyu weeping; Xiangyun in men's clothes; a \"two-handle\" Manchu headdress or " +
      "flowerpot-sole shoes.",
  },
  "honglou-021": {
    coreKey:
      "Beside the dressing table in Daiyu's room: Xiangyun stands behind Baoyu braiding " +
      "his hair, Baoyu sits on a stool, and Daiyu washes her hands and watches coldly",
    groundTruth:
      "Chapter 21, \"Virtuous Xiren, with Pretty Petulance, Admonishes Baoyu; Clever " +
      "Ping'er, with Soft Words, Rescues Jia Lian\". Baoyu \"wore no coronet at home\"; " +
      "Xiangyun \"just braided the short hair all round into small plaits, gathered " +
      "them together on the hair at the crown, and plaited one big braid, tied off with " +
      "red cord\", and pointed out that one of the pearls was missing; Daiyu washed her " +
      "hands nearby with a cold smile. Picking up the rouge and having it knocked away " +
      "come later.",
    evaluationCriteria:
      "Full credit: Beside the dressing table in Daiyu's room; in the middle of the " +
      "frame Baoyu as a youth, without a coronet or forehead band, sits on a stool with " +
      "his head lowered, and Xiangyun stands behind him, one hand steadying his head " +
      "and the other holding a fine-toothed comb as she braids, the big braid tied off " +
      "with red cord and strung with pearls and gold braid pendants, not yet finished; " +
      "on the right of the frame Daiyu as a young girl washes her hands in a basin and " +
      "watches coldly (a compositional convention; the left and right of the original " +
      "text are not tested). Deductions: Baoyu wearing a coronet or forehead band, or " +
      "holding rouge; a bed in the picture; Xiangyun or Daiyu with long hair hanging " +
      "loose; a \"two-handle\" Manchu headdress or flowerpot-sole shoes.",
  },
  "honglou-022": {
    coreKey:
      "Grandmother Jia's main room on the night of the Lantern Festival: Jia Zheng has " +
      "risen and stands before the folding-screen lantern, bending to read the " +
      "riddles, Grandmother Jia smiles in the seat of honor, and Baoyu sits beside her",
    groundTruth:
      "Chapter 22, \"Hearing an Aria, Baoyu Grasps a Zen Truth; Making Lantern " +
      "Riddles, Jia Zheng Grieves over Ominous Words\". The girls made riddles and " +
      "\"wrote them out and pasted them on the screen\"; \"above, Grandmother Jia, Jia " +
      "Zheng, and Baoyu at one table; below, Lady Wang, Baochai, Daiyu, and Xiangyun at " +
      "another\"; Jia Zheng \"rose and went over to the screen\" and read the riddles " +
      "one by one, filled with foreboding. Being sent off to rest comes later.",
    evaluationCriteria:
      "Full credit: Grandmother Jia's main room on the night of the Lantern Festival, " +
      "with riddle slips pasted on the folding-screen lantern; on the right of the " +
      "frame Jia Zheng, his beard turning white, stands side-on before the screen, " +
      "bending to look closely, his face visible in profile; on the left of the frame " +
      "Grandmother Jia, her hair silver at the temples, smiles in the seat of honor, " +
      "and Baoyu sits beside her; at the bottom of the frame the women of the family " +
      "sit quietly at two tables (a compositional convention; the left and right of " +
      "the original text are not tested). Deductions: Jia Zheng angry, weeping, or " +
      "seated at the table; the real objects that answer the riddles in the picture; a " +
      "Qing official hat with finial.",
  },
  "honglou-023": {
    coreKey:
      "Under the peach tree by the bridge at Seeping Fragrance Weir: Baoyu, book in " +
      "hand, turns his head, and Daiyu comes up with a flower hoe on her shoulder, a " +
      "flower bag hanging from the hoe, and a flower broom in her hand",
    groundTruth:
      "Chapter 23, \"Wonderful Lines from The Western Chamber Serve for Playful " +
      "Banter; Seductive Songs from The Peony Pavilion Stir a Tender Heart\". In the " +
      "middle third of the third month, fallen petals covered the ground; \"Baoyu " +
      "turned his head, and it was Lin Daiyu who had come, with a flower hoe on her " +
      "shoulder, a flower bag hanging from the hoe, and a flower broom in her hand\"; " +
      "Baoyu still has the book in his hand. Hiding the book, reading it together, and " +
      "burying the flowers come later.",
    evaluationCriteria:
      "Full credit: A peach tree by the bridge at Seeping Fragrance Weir in late " +
      "spring, fallen petals covering the ground and floating on the pool; on the left " +
      "of the frame Baoyu as a youth, his braided hair tied with red cord, petals on " +
      "the front of his robe, holding a volume, turns side-on to look back, his face " +
      "visible; on the right of the frame Daiyu as a young girl, with mist-like knitted " +
      "brows, comes up with a flower hoe on her shoulder, a silk flower bag hanging " +
      "from the hoe, and a flower broom in her hand (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: A flower grave " +
      "or flower basket in the picture; Baoyu sitting on the rock or having put the " +
      "book down; Daiyu wearing a veiled hat (weimao); a \"two-handle\" Manchu " +
      "headdress.",
  },
  "honglou-024": {
    coreKey:
      "A street at dusk: Ni Er recognizes Jia Yun through drunken eyes, lets go of him " +
      "and staggers, laughing, Jia Yun stands still in surprise, and the two have not " +
      "yet talked of money",
    groundTruth:
      "Chapter 24, \"The Drunken Diamond Makes Light of Money and Values Chivalry; a " +
      "Lovesick Girl Loses Her Handkerchief and Stirs Up Longing\". Jia Yun is " +
      "eighteen, with \"a long oval face and a tall, slender build\"; Ni Er \"opened " +
      "his drunken eyes to look, saw that it was Jia Yun, hastily let go of him, and " +
      "staggered, laughing\". Taking out silver and lending the money come later; Ni Er " +
      "then says \"it's getting dark\", so the time is near dusk.",
    evaluationCriteria:
      "Full credit: A street darkening at dusk; on the left of the frame Jia Yun, with " +
      "a long oval face and a tall, slender build, refined and good-looking, stands " +
      "still with a look of surprise; on the right of the frame Ni Er, drunken-eyed, a " +
      "cloth belt-pouch (dabao) tied at his waist, his hands already let go, staggers, " +
      "laughing (a compositional convention; the left and right of the original text " +
      "are not tested). Deductions: Ni Er raising a fist or striking someone; silver in " +
      "the picture; Ni Er drawn as a ferocious brute or an opera clown; a shaved " +
      "forehead and long queue, or a Qing official hat with finial.",
  },
  "honglou-anim-013": {
    coreKey:
      "Jia Zhen leaning on a crutch, Baoyu holding out the tally token toward Xifeng, " +
      "and Xifeng, without taking it, looking at Lady Wang, with animated tea steam, " +
      "door curtain, and palace sash",
    groundTruth:
      "Chapter 13, \"Qin Keqing Dies and Is Granted the Rank of Wife of an Imperial " +
      "Guard Officer; Wang Xifeng Helps Manage the Ningguo Mansion\". Jia Zhen \"came " +
      "pacing in, leaning on a crutch\"; \"Baoyu had already taken the tally token from " +
      "Jia Zhen's hand and forcibly handed it to Xifeng\", and Xifeng, not daring to " +
      "take it, looked at Lady Wang. Xifeng has \"triangular phoenix eyes and " +
      "willow-leaf brows slanting upward\". Going to the side hall (baoxia) to manage " +
      "affairs comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Jia Zhen stands leaning on a crutch; in " +
      "the middle of the frame Baoyu holds out the tally token toward Xifeng; left of " +
      "center in the frame Xifeng, without taking the token, looks at Lady Wang; on the " +
      "left of the frame Lady Wang and Lady Xing sit side by side (a compositional " +
      "convention; the left and right of the original text are not tested); the tea " +
      "steam, the door curtain, and the palace sash loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Xifeng already holding the token; Jia Zhen kneeling; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "honglou-anim-014": {
    coreKey:
      "Xifeng, seated behind the desk, tossing a tally token down in front of it, " +
      "Caiming holding the list and recording it, and the wife of Wang Xing receiving " +
      "the token, with animated window curtain, tea steam, and writing brush",
    groundTruth:
      "Chapter 14, \"Lin Ruhai Passes Away in the City of Yangzhou; Jia Baoyu Pays His " +
      "Respects to the Prince of Beijing on the Road\". Xifeng \"stayed alone in the " +
      "side hall\"; the wife of Wang Xing came \"to collect a tally token for drawing " +
      "thread\"; Xifeng \"listened, found that the figures tallied, told Caiming to " +
      "record it, and took a Rongguo Mansion tally token and tossed it down\". The " +
      "latecomer has not yet been dealt with at this moment; the beating comes later.",
    evaluationCriteria:
      "Full credit: The side hall of the Ningguo Mansion in the early morning; in the " +
      "middle of the frame Xifeng, seated behind the desk, tosses the tally token down " +
      "in front of the desk; on the left of the frame Caiming holds the list, brush in " +
      "hand, recording; on the right of the frame the wife of Wang Xing stands before " +
      "the desk, and a latecomer servant stands at the right edge with his hands at his " +
      "sides (a compositional convention; the left and right of the original text are " +
      "not tested); the window curtain, the tea steam, and the brush loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: A beating; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-015": {
    coreKey:
      "Shui Rong reaching out from his sedan chair to catch hold of Baoyu, Baoyu bowing " +
      "to pay his respects, and Jia Zheng standing behind him, with animated canopy and " +
      "drapes, and white banners",
    groundTruth:
      "Chapter 15, \"Wang Xifeng Abuses Her Power at Iron Threshold Temple; Qin " +
      "Jingqing Finds Pleasure at Mantou Convent\". Shui Rong was \"wearing a " +
      "silver-winged princely cap with pure white tassels, and a white python robe with " +
      "five-clawed seated dragons over sea waves and rocks\"; Baoyu, in a silver " +
      "hair-binding coronet and a white python archer's-cuff robe, \"hurried forward to " +
      "pay his respects, and Shui Rong quickly reached out from the sedan chair to " +
      "catch hold of him\". Asking about the jade and the gift of the prayer beads come " +
      "later.",
    evaluationCriteria:
      "Full credit: On the left of the frame, in the sedan chair, Shui Rong, not yet " +
      "twenty, in a silver-winged princely cap and a white python robe, leans out and " +
      "reaches to catch hold of Baoyu; in the middle of the frame Baoyu, in a silver " +
      "hair-binding coronet and a white python archer's-cuff robe, bows to pay his " +
      "respects; on the right of the frame Jia Zheng stands behind Baoyu (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the canopy and drapes, and the white banners loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Shui Rong out of the sedan chair; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-016": {
    coreKey:
      "Xia Shouzhong, empty-handed, smiling as he delivers a special decree, and Jia " +
      "She and Jia Zheng kneeling before the incense table to receive it, with animated " +
      "incense smoke, candle flames, and bamboo blind",
    groundTruth:
      "Chapter 16, \"Jia Yuanchun, for Her Talents, Is Chosen for the Phoenix Elegance " +
      "Palace; Qin Jingqing Dies Young on the Road to the Yellow Springs\". \"They " +
      "cleared away the feast, set out an incense table, and opened the central gate to " +
      "kneel and receive him\"; Xia Shouzhong \"bore no edict and held no decree\", " +
      "and, \"all smiles, walked up into the hall and stood facing south\", delivering " +
      "a special decree by word of mouth, and no one knew what the news was. The " +
      "announcement of the good news comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame, in the hall, Xia Shouzhong, empty-handed " +
      "and all smiles, delivers a special decree by word of mouth; on the left of the " +
      "frame Jia She and Jia Zheng, in everyday cloth caps and informal clothes, kneel " +
      "side-on before the incense table to receive it, their faces visible in profile, " +
      "looking fearful (a compositional convention; the left and right of the original " +
      "text are not tested); the incense smoke, the candle flames, and the bamboo blind " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Xia Shouzhong holding " +
      "an edict or on horseback; those kneeling in court attire (a black gauze hat and " +
      "a round-collared official robe); whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-017": {
    coreKey:
      "Jia Zheng sitting against the railing, stroking his beard and smiling, and Baoyu " +
      "standing in the pavilion looking all around and improvising a couplet, with " +
      "animated willow branches, and spouting water and flowing stream",
    groundTruth:
      "Chapter 17, \"Testing Talents with Couplets and Inscriptions in the Garden of " +
      "Gathered Fragrance; Jia Baoyu's Quick Wit Impresses the Guests\". \"White stones " +
      "formed a balustrade encircling the edge of the pool, a stone bridge spanned it " +
      "with three arches, and beasts' heads spouted water from their mouths. On the " +
      "bridge was a pavilion\"; \"Jia Zheng and the others went up into the pavilion " +
      "and sat down leaning on the railing\"; Baoyu \"stood in the pavilion and looked " +
      "all around\", and improvised a couplet. Visiting the Xiaoxiang Lodge comes later.",
    evaluationCriteria:
      "Full credit: Warm, mild weather, the pavilion on the stone bridge; in the " +
      "pavilion, on the left of the frame, Jia Zheng, bearded, sits leaning on the " +
      "railing, stroking his beard and smiling; on the right of the frame Baoyu as a " +
      "youth stands in the pavilion looking all around and improvises a couplet; two " +
      "literary retainers are in the pavilion (a compositional convention; the left " +
      "and right of the original text are not tested); the willow branches, and the " +
      "spouting water and stream loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Jia Zheng scolding; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-018": {
    coreKey:
      "The Imperial Consort seated upright in a decorated boat, looking up, smiling, at " +
      "the lantern tablet reading \"Smartweed Bank and Flowery Cove\", with animated " +
      "storm-lantern flames, ripples, and pearl curtains",
    groundTruth:
      "Chapter 18, \"Lin Daiyu Mistakenly Cuts Up a Scent Pouch; Jia Yuanchun Returns " +
      "Home on a Visit to Celebrate the Lantern Festival\". \"Presently they entered a " +
      "stone inlet, above which hung a lantern tablet clearly showing the four " +
      "characters 'Smartweed Bank and Flowery Cove'\"; the Imperial Consort looked at " +
      "it and said with a smile that the two characters \"Flowery Cove\" alone would " +
      "do; Baochai speaks of her as one who \"wears the yellow robe\". Leaving the boat " +
      "for the sedan chair and receiving homage in the temporary palace come later.",
    evaluationCriteria:
      "Full credit: Storm lanterns on the stone balustrades along both banks of the " +
      "clear stream in the garden on the night of the Lantern Festival; in the middle " +
      "of the frame a decorated boat with its pearl curtains half rolled up, and the " +
      "Imperial Consort, in a yellow robe, seated upright in the boat, looks up at the " +
      "lantern tablet at the mouth of the stone inlet at the upper right of the frame, " +
      "smiling (a compositional convention; the left and right of the original text " +
      "are not tested); the lantern flames, the ripples, and the pearl curtains loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The Imperial Consort in a " +
      "sedan chair; the decorated boat sliding across, or whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-019": {
    coreKey:
      "Baoyu seated on the kang holding a hand warmer, his feet on a foot warmer, and " +
      "Xiren standing by the kang handing him shelled pine nuts on a handkerchief, with " +
      "animated incense smoke from the hand warmer, and tea steam",
    groundTruth:
      "Chapter 19, \"On a Fine Night, with Earnest Feeling, the Flower Speaks Her Mind; " +
      "on a Quiet Day, with Lingering Tenderness, the Jade Gives Off Fragrance\". Baoyu " +
      "was \"wearing a scarlet archer's-cuff robe of fox-belly fur patterned with golden " +
      "pythons, with a slate-blue sable over-jacket with tasseled fringe on top\"; " +
      "Xiren set the foot warmer under his feet and put the hand warmer in his arms, " +
      "and \"picked up a few pine-nut kernels, blew off the thin skins, and offered " +
      "them to Baoyu on her handkerchief\". Taking off the jade and passing it round to " +
      "look at comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Baoyu as a youth, in a scarlet " +
      "archer's-cuff robe of fox-belly fur patterned with golden pythons, with the " +
      "Magic Jade hanging at his neck, rests his feet on the foot warmer and holds the " +
      "hand warmer; on the right of the frame Xiren stands by the kang and hands him " +
      "shelled pine nuts on a handkerchief; on the left of the frame Xiren's mother and " +
      "Hua Zifang stand beside the fruit table (a compositional convention; the left " +
      "and right of the original text are not tested); the incense smoke and the tea " +
      "steam loop smoothly, driven by SMIL or inline CSS. Deductions: The jade taken " +
      "off; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-020": {
    coreKey:
      "Xiangyun lifting the curtain and coming in laughing heartily, Daiyu sitting " +
      "under the window smilingly teasing her, and Baoyu standing and laughing, with " +
      "animated soft door curtain and clothing ties",
    groundTruth:
      "Chapter 20, \"Wang Xifeng Rebukes Jealousy with Plain Words; Lin Daiyu Mocks a " +
      "Sweet Lisp with Playful Words\". \"Just as the two of them were talking, they " +
      "saw Xiangyun come in, laughing and saying\"; Daiyu laughs at her as \"a lisper " +
      "who loves to talk, who can't even manage to say 'Second' Brother\". Baochai has " +
      "already left, and Baoyu's dark fox-fur cape is already off; Xiangyun running off " +
      "comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Daiyu as a young girl, with mist-like " +
      "knitted brows, sits under the window smilingly teasing; in the middle of the " +
      "frame Baoyu as a youth, his braided hair tied with red cord, stands looking at " +
      "Xiangyun and laughing; on the right of the frame Xiangyun as a young girl lifts " +
      "the curtain and comes in laughing heartily (a compositional convention; the " +
      "left and right of the original text are not tested); the soft curtain and the " +
      "clothing ties loop smoothly, driven by SMIL or inline CSS. Deductions: Baochai " +
      "or Xiren in the picture; Baoyu wearing a cape; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-021": {
    coreKey:
      "Xiangyun standing behind Baoyu braiding his hair with a fine-toothed comb, Baoyu " +
      "seated on a stool, and Daiyu washing her hands and watching coldly, with " +
      "animated comb, ripples, and gold braid pendants",
    groundTruth:
      "Chapter 21, \"Virtuous Xiren, with Pretty Petulance, Admonishes Baoyu; Clever " +
      "Ping'er, with Soft Words, Rescues Jia Lian\". Baoyu \"wore no coronet at home\"; " +
      "Xiangyun \"just braided the short hair all round into small plaits, gathered " +
      "them together on the hair at the crown, and plaited one big braid, tied off with " +
      "red cord\", and pointed out that one of the pearls was missing; Daiyu washed her " +
      "hands nearby with a cold smile. Picking up the rouge and having it knocked away " +
      "come later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Baoyu as a youth, without a coronet, " +
      "sits on a stool with his head lowered, and Xiangyun stands behind him, one hand " +
      "steadying his head and the other holding a fine-toothed comb as she braids, the " +
      "big braid tied off with red cord, not yet finished; on the right of the frame " +
      "Daiyu washes her hands in a basin and watches coldly (a compositional " +
      "convention; the left and right of the original text are not tested); the comb, " +
      "the ripples, and the gold pendants loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Whole figures drifting; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
  "honglou-anim-022": {
    coreKey:
      "Jia Zheng standing side-on before the folding-screen lantern, bending to read " +
      "the riddles, Grandmother Jia smiling in the seat of honor, and Baoyu sitting " +
      "beside her, with animated candlelight and tassels",
    groundTruth:
      "Chapter 22, \"Hearing an Aria, Baoyu Grasps a Zen Truth; Making Lantern " +
      "Riddles, Jia Zheng Grieves over Ominous Words\". The girls made riddles and " +
      "\"wrote them out and pasted them on the screen\"; \"above, Grandmother Jia, Jia " +
      "Zheng, and Baoyu at one table; below, Lady Wang, Baochai, Daiyu, and Xiangyun at " +
      "another\"; Jia Zheng \"rose and went over to the screen\" and read the riddles " +
      "one by one, filled with foreboding. Being sent off to rest comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the folding-screen lantern with riddle " +
      "slips pasted on it, and Jia Zheng, his beard turning white, stands side-on " +
      "before the screen, bending to look closely, his face visible in profile; on the " +
      "left of the frame Grandmother Jia, her hair silver at the temples, smiles in the " +
      "seat of honor, and Baoyu sits beside her; at the bottom the women of the family " +
      "sit quietly at two tables (a compositional convention; the left and right of " +
      "the original text are not tested); the candlelight and the tassels loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Jia Zheng seated at the " +
      "table; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-023": {
    coreKey:
      "Baoyu, book in hand, turning side-on to look back, and Daiyu with a flower hoe " +
      "on her shoulder, a flower bag hanging from the hoe, and a flower broom in her " +
      "hand, with animated falling petals and flower bag",
    groundTruth:
      "Chapter 23, \"Wonderful Lines from The Western Chamber Serve for Playful " +
      "Banter; Seductive Songs from The Peony Pavilion Stir a Tender Heart\". In the " +
      "middle third of the third month, fallen petals covered the ground; \"Baoyu " +
      "turned his head, and it was Lin Daiyu who had come, with a flower hoe on her " +
      "shoulder, a flower bag hanging from the hoe, and a flower broom in her hand\"; " +
      "Baoyu still has the book in his hand. Hiding the book, reading it together, and " +
      "burying the flowers come later.",
    evaluationCriteria:
      "Full credit: Fallen petals covering the ground under the peach tree by the " +
      "bridge at Seeping Fragrance Weir; on the left of the frame Baoyu as a youth, his " +
      "braided hair tied with red cord, holding a volume, turns side-on to look back, " +
      "his face visible; on the right of the frame Daiyu as a young girl, with a flower " +
      "hoe on her shoulder, a silk flower bag hanging from the hoe, and a flower broom " +
      "in her hand (a compositional convention; the left and right of the original " +
      "text are not tested); the falling petals and the flower bag loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: A flower grave drawn; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-024": {
    coreKey:
      "Ni Er recognizing Jia Yun through drunken eyes, letting go of him and " +
      "staggering, laughing, and Jia Yun standing still in surprise, with animated " +
      "drunken swaying, front of his jacket, and lamplight",
    groundTruth:
      "Chapter 24, \"The Drunken Diamond Makes Light of Money and Values Chivalry; a " +
      "Lovesick Girl Loses Her Handkerchief and Stirs Up Longing\". Jia Yun is " +
      "eighteen, with \"a long oval face and a tall, slender build\"; Ni Er \"opened " +
      "his drunken eyes to look, saw that it was Jia Yun, hastily let go of him, and " +
      "staggered, laughing\". Taking out silver and lending the money come later; Ni Er " +
      "then says \"it's getting dark\", so the time is near dusk.",
    evaluationCriteria:
      "Full credit: A street darkening at dusk; on the left of the frame Jia Yun, with " +
      "a long oval face and a tall, slender build, stands still with a look of " +
      "surprise; on the right of the frame Ni Er, drunken-eyed, a cloth belt-pouch tied " +
      "at his waist, his hands already let go, laughs apologetically (a compositional " +
      "convention; the left and right of the original text are not tested); the " +
      "drunken swaying, the front of his jacket, and the lamplight loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Ni Er raising a fist; whole figures " +
      "sliding across; a purely static image, use of JavaScript, or XML parse errors.",
  },
};
