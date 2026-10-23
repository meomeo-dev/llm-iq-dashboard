/**
 * 《红楼梦》第 25–36 回候选的英文标签与英文评判标准，由
 * src/core/classics/honglou/ch025-036.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const HONGLOU_CH025_036_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-025": "Ch. 25 · The Scabby Monk Sighs over the Magic Jade in His Palm",
  "honglou-026": "Ch. 26 · Daiyu Weeps in the Flower Shade outside the Closed Gate",
  "honglou-027": "Ch. 27 · Baochai Chases Butterflies by Drenched Blossoms Pavilion",
  "honglou-028": "Ch. 28 · Jiang Yuhan Presents the Crimson Musk-Root Sash",
  "honglou-029": "Ch. 29 · Taoist Zhang Presents a Tray of Votive Gifts",
  "honglou-030": "Ch. 30 · Lingguan Traces the Character Qiang beneath the Roses",
  "honglou-031": "Ch. 31 · Qingwen Tears Folding Fans on a Summer Night",
  "honglou-032": "Ch. 32 · Daiyu Overhears Baoyu's Heartfelt Words through the Window",
  "honglou-033": "Ch. 33 · The Chief Steward Demands Qiguan in the Outer Hall",
  "honglou-034": "Ch. 34 · Daiyu Inscribes the Old Handkerchiefs by Lamplight",
  "honglou-035": "Ch. 35 · Ying'er Deftly Knots a Plum-Blossom Net",
  "honglou-036": "Ch. 36 · Baochai Embroiders Mandarin Ducks beside the Couch",
};

/** 静态与动态候选 id → 英文评判标准 */
export const HONGLOU_CH025_036_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-025": {
    coreKey:
      "The outer hall of Lady Wang's main rooms: the scabby-headed monk holds the Magic " +
      "Jade in his palm and sighs deeply, the lame Taoist stands by holding a wooden " +
      "fish, and Jia Zheng stands respectfully",
    groundTruth:
      "Chapter 25, \"By Black Magic Sister and Brother Encounter the Five Demons; in the " +
      "Red Chamber the Magic Jade Meets the Two Immortals\". \"It turned out to be a " +
      "scabby-headed monk and a lame Taoist\"; \"hearing this, Jia Zheng took the jade " +
      "from around Baoyu's neck and handed it to the two of them\"; \"the monk took it, " +
      "held it up on his palm, and heaved a long sigh, saying, 'Since we parted at " +
      "Greensickness Peak, thirteen years have passed in the blink of an eye!'\"",
    evaluationCriteria:
      "Full credit: The outer hall of Lady Wang's main rooms; on the left of the frame " +
      "Jia Zheng, a middle-aged scholar-official in a plain robe, stands bowing " +
      "respectfully; in the middle of the frame the scabby-headed monk in a patched " +
      "monk's robe holds the Magic Jade on his palm with both hands and bows his head " +
      "with a long sigh; on the right of the frame the lame Taoist with tousled hair and " +
      "a tattered Taoist robe stands in attendance holding a small wooden fish (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: A sickbed, coffins, paper demons, or anyone wielding a " +
      "knife in the picture; a Qing official hat with finial and peacock feather, a " +
      "shaved head with a queue, or theatrical facial paint.",
  },
  "honglou-026": {
    coreKey:
      "Outside the closed gate of the House of Green Delights: Daiyu stands alone in the " +
      "flower shade by the corner of the wall, wiping her tears with a handkerchief, as " +
      "roosting birds fly up in alarm from the willow branches",
    groundTruth:
      "Chapter 26, \"On Wasp-Waist Bridge Words Are Set Forth to Convey Secret Feelings; " +
      "in the Naiad's House Spring Lassitude Stirs Lonely Thoughts\". \"Coming again to " +
      "the House of Green Delights, she saw that the courtyard gate was closed, so Daiyu " +
      "knocked on it with her hand\"; after Qingwen refuses to open the gate, Daiyu " +
      "\"stood alone in the shade of the flowers by the corner of the wall and began to " +
      "sob sorrowfully\"; \"hearing this sound, the roosting birds and crows on the " +
      "nearby willow branches and blossoms all rose with a whirr of wings and flew far " +
      "away\".",
    evaluationCriteria:
      "Full credit: The flower path outside the House of Green Delights on an evening in " +
      "late spring or early summer; on the left of the frame the whitewashed wall and " +
      "the tightly closed vermilion courtyard gate, with moss at the foot of the wall; " +
      "in the middle of the frame the young girl Daiyu, slender and frail, stands alone " +
      "in the flower shade by the corner of the wall, wiping her tears with a silk " +
      "handkerchief; on the right of the frame roosting birds and crows on the willow " +
      "branches and flowering trees fly up in alarm (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: The courtyard " +
      "gate already open; Baoyu, Baochai, or Qingwen inside the gate shown in the " +
      "picture; Daiyu wearing a heavy winter cloak; a Manchu \"two-handle\" headdress or " +
      "high-soled Manchu shoes.",
  },
  "honglou-027": {
    coreKey:
      "The lawn by the water near Drenched Blossoms Pavilion: Baochai, holding a round " +
      "fan, tiptoes after a pair of jade-colored butterflies as large as round fans " +
      "toward the waterside pavilion",
    groundTruth:
      "Chapter 27, \"By Drenched Blossoms Pavilion Yang Guifei Sports with Colored " +
      "Butterflies; by the Mound of Buried Fragrance Feiyan Weeps over Fallen Red " +
      "Petals\". During the Grain in Ear festival farewell to the flower spirits, " +
      "\"suddenly she saw ahead a pair of jade-colored butterflies, as large as round " +
      "fans, fluttering up and down in the breeze\"; Baochai \"took a fan from her " +
      "sleeve and bent toward the grass to catch them\", and \"tiptoed all the way " +
      "after them to Drenched Blossoms Pavilion on the pond\". Overhearing the secret " +
      "talk through the window comes later.",
    evaluationCriteria:
      "Full credit: The waterside lawn in Prospect Garden on the Grain in Ear festival " +
      "in early summer, with colored threads and banners tied to the flowering trees; " +
      "on the left of the frame Baochai, with a silver-basin face and water-apricot " +
      "eyes, in a honey-colored thin jacket and an onion-yellow damask skirt, bends " +
      "forward on tiptoe holding a round fan to chase the butterflies; in the middle of " +
      "the frame a pair of jade-colored butterflies as large as round fans flutter up " +
      "and down; on the right of the frame Drenched Blossoms Pavilion on the water with " +
      "its winding bridge, its lattice windows closed (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: The pavilion " +
      "windows open to show Hongyu and Zhui'er inside; Daiyu burying flowers in the " +
      "picture; a Manchu headdress or flowerpot-sole shoes.",
  },
  "honglou-028": {
    coreKey:
      "Beneath the veranda eaves of the back hall at the Feng residence: Baoyu hands " +
      "over the jade-penannular fan pendant untied from his folding fan, and Jiang " +
      "Yuhan presents a crimson musk-root sash in return",
    groundTruth:
      "Chapter 28, \"Jiang Yuhan Fondly Presents a Crimson Musk-Root Sash; Xue Baochai " +
      "Bashfully Slips On the Red Musk Beads\". At Feng Ziying's banquet, Baoyu steps " +
      "out and Jiang Yuhan follows, and \"the two stood beneath the eaves of the " +
      "veranda\"; Baoyu \"took his fan from his sleeve, untied a jade penannular ring " +
      "fan pendant from it, and handed it to Qiguan\"; Jiang Yuhan presents in return " +
      "the crimson musk-root sash bestowed by the Prince of Beijing. Exchanging and " +
      "tying on the pine-pollen-green sash comes later.",
    evaluationCriteria:
      "Full credit: Beneath the veranda eaves of the back hall at Feng Ziying's " +
      "residence; on the left of the frame the youth Baoyu holds a folding fan and hands " +
      "over the untied white jade penannular fan pendant; on the right of the frame " +
      "Jiang Yuhan, gentle and handsome in a refined pleated gown, presents with both " +
      "hands a crimson musk-root sash, both neatly dressed (a compositional convention; " +
      "the left and right of the original text are not tested). Deductions: Unfastening " +
      "inner garments or baring the chest; the noisy banquet or Baochai slipping off " +
      "her red musk beads in the picture; Jiang Yuhan in heavy theatrical dan costume; " +
      "Qing shaved foreheads with queues.",
  },
  "honglou-029": {
    coreKey:
      "The main upper hall of the Temple of Clear Void: Taoist Zhang holds up a tea tray " +
      "draped with a crimson python-satin sutra cloth bearing gold and jade votive " +
      "gifts, and Baoyu picks out a gold filigree kirin to show Grandmother Jia",
    groundTruth:
      "Chapter 29, \"Those Blessed with Good Fortune Pray for Still More; a Passionate " +
      "Girl, Deep in Feeling, Feels All the More\". \"Just then they saw Taoist Zhang " +
      "come up holding a tray\", a large tea tray draped with a crimson python-satin " +
      "sutra cloth, on which \"there were gold arc pendants and jade penannular rings, " +
      "as well as 'everything as wished' sceptres and 'peace year after year' talismans\"; " +
      "Baoyu \"turned and stirred them with his hand, picking them out one by one to " +
      "show Grandmother Jia\", who spots the red-gold kingfisher-inlaid kirin.",
    evaluationCriteria:
      "Full credit: The main upper hall of the Temple of Clear Void; on the left of the " +
      "frame Grandmother Jia, her hair silver at the temples, sits in a brocade armchair " +
      "leaning forward to look at the tray; in the middle of the frame the youth Baoyu " +
      "stands beside her chair reaching into the tray to sort through the items; on the " +
      "right of the frame the eighty-year-old Taoist Zhang, white-haired and " +
      "white-bearded, holds with both hands a large tea tray draped with a crimson " +
      "python-satin sutra cloth, heaped with gold and jade ritual talismans and a large " +
      "red-gold kingfisher-inlaid kirin (a compositional convention; the left and right " +
      "of the original text are not tested). Deductions: Striking the little acolyte or " +
      "Baoyu and Daiyu smashing the jade and cutting the tassel in the picture; Qing " +
      "queues and official finials or a theatrical phoenix crown.",
  },
  "honglou-030": {
    coreKey:
      "Beneath the rose trellis: Lingguan crouches under the blossoms tracing the " +
      "character \"qiang\" on the ground with a gold hairpin in tears, while Baoyu " +
      "watches spellbound through a gap in the bamboo fence and traces it on his palm",
    groundTruth:
      "Chapter 30, \"Borrowing a Fan, Baochai Delivers a Double Barb; Tracing 'Qiang', " +
      "Lingguan Spellbinds an Outsider\". In the fifth month, when the roses are in " +
      "thick leaf and bloom, Baoyu \"quietly peeped through a hole in the bamboo fence " +
      "and saw a girl crouching beneath the flowers, holding a hairpin in her hand and " +
      "poking at the earth while silently shedding tears\", repeatedly writing the " +
      "character \"qiang\"; Baoyu, in a lotus-root-colored gauze gown, traces the " +
      "strokes on his palm, spellbound. The rain falling comes later.",
    evaluationCriteria:
      "Full credit: The rose trellis in high summer before the rain falls; on the left " +
      "of the frame, inside the trellis, the young girl Lingguan, with spring-hill " +
      "brows knit and a slender waist, crouches beneath the blossoms holding a gold " +
      "hairpin to trace the character \"qiang\" on the ground in tears; in the middle " +
      "of the frame the bamboo-lattice flower trellis; on the right of the frame Baoyu " +
      "in a lotus-root-colored gauze gown gazes through a gap in the fence while tracing " +
      "the character on his palm (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Pouring rain or umbrellas; slapping " +
      "Jinchuan or kicking Xiren in the picture; Lingguan in heavy theatrical armor " +
      "(dakao); shaved foreheads with hanging queues.",
  },
  "honglou-031": {
    coreKey:
      "A summer night in the House of Green Delights: Qingwen sits on a cooling bamboo " +
      "couch smiling as she tears a folding fan in two, Baoyu stands beside the couch " +
      "laughing, and Sheyue walks over from the veranda holding a fan",
    groundTruth:
      "Chapter 31, \"Tearing a Fan Buys a Thousand-Gold Smile; the Gold Kirin Foreshadows " +
      "White-Headed Twin Stars\". Returning slightly tipsy on the evening of the Dragon " +
      "Boat Festival, Baoyu \"saw that a cooling couch with pillows had already been set " +
      "out in the courtyard\" and hands his fan to Qingwen; \"Qingwen took it and, with " +
      "a riiip, tore it in half, followed by several more rips\"; as Baoyu laughs in " +
      "praise, \"Sheyue walked over and said with a smile, 'Do a little less mischief.'\" " +
      "Snatching Sheyue's fan comes later.",
    evaluationCriteria:
      "Full credit: The courtyard of the House of Green Delights on the night of the " +
      "Dragon Boat Festival, with a cooling couch set out; on the left of the frame " +
      "Qingwen, slender-waisted and narrow-shouldered, sits on the couch smiling as she " +
      "tears a folding fan in two with both hands; in the middle of the frame the youth " +
      "Baoyu stands beside the couch clapping and laughing; on the right of the frame " +
      "Sheyue walks over from the veranda holding an intact folding fan and smiling in " +
      "remonstrance (a compositional convention; the left and right of the original text " +
      "are not tested). Deductions: Baoyu already having snatched Sheyue's fan; the " +
      "daytime quarrel indoors or picking up the gold kirin the next day in the picture; " +
      "Qingwen drawn looking ill; a Manchu headdress or a Qing queue.",
  },
  "honglou-032": {
    coreKey:
      "Outside the green-gauze window of the House of Green Delights: having overheard " +
      "Baoyu's deep praise through the window, Daiyu, mingled joy and sorrow on her " +
      "face, wipes her tears with a handkerchief and turns to leave",
    groundTruth:
      "Chapter 32, \"Pouring Out His Heart, the Living Baoyu Loses His Wits; Swallowing " +
      "Her Shame, the Passionate Jinchuan Dies\". Walking to the window of the House of " +
      "Green Delights, Daiyu \"just heard Shi Xiangyun speaking of career and " +
      "statecraft, and Baoyu saying, 'Cousin Lin never talks such rubbish'\"; Daiyu " +
      "\"could not help feeling at once delighted and startled, sorrowful and " +
      "sighing\", and \"wiping her tears, she turned to go back\". Baoyu chasing after " +
      "her to pour out his heart comes later.",
    evaluationCriteria:
      "Full credit: Outside the green-gauze window beneath the veranda of the House of " +
      "Green Delights at noon in early summer; on the left of the frame the young girl " +
      "Daiyu, slender and frail, stands alone in the flower shade outside the window " +
      "with mingled joy and sorrow, wiping her tears with a silk handkerchief as she " +
      "turns to leave; in the middle and on the right of the frame, through the " +
      "green-gauze window with its half-rolled bamboo blind, the faint silhouettes of " +
      "Baoyu and Xiangyun indoors are dimly visible (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: Baoyu already " +
      "outside holding Daiyu's hand or pouring out his heart to Xiren; Jinchuan " +
      "drowning in the well in the picture; the indoor figures drawn as clear foreground " +
      "figures; Manchu dress or a \"two-handle\" headdress.",
  },
  "honglou-033": {
    coreKey:
      "The outer hall of the Rongguo Mansion: the chief steward of the Prince of " +
      "Zhongshun's palace bows with a cold smile and exposes the evidence of the red " +
      "sash, Jia Zheng turns pale with shock and rage, and Baoyu stands dumbfounded",
    groundTruth:
      "Chapter 33, \"A Jealous Brother Lets Slip a Few Spiteful Words; a Worthless Son " +
      "Receives a Heavy Flogging\". The chief steward of the Prince of Zhongshun's " +
      "palace comes to demand Qiguan and remarks with a cold smile, \"How did that red " +
      "sash come to be around your young gentleman's waist?\" \"Hearing this, Baoyu felt " +
      "as if his soul had been blasted away and stood dumbfounded\"; Jia Zheng is so " +
      "furious that \"his eyes stared and his mouth twisted\". Jia Huan's slander and " +
      "the heavy flogging come later.",
    evaluationCriteria:
      "Full credit: The main outer hall of the Rongguo Mansion; on the left of the frame " +
      "the chief steward of the Prince of Zhongshun's palace, in a black gauze hat and " +
      "official robe, stands bowing with a cold smile; in the middle of the frame Jia " +
      "Zheng, shocked and enraged, turns his head to glare at Baoyu; on the right of the " +
      "frame the youth Baoyu stands below with his hands at his sides, pale and " +
      "dumbfounded, the red sash hidden beneath his outer robe (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "A flogging bench, bamboo paddles, clubs, or a bloody beating in the picture; Jia " +
      "Huan, Lady Wang, or Grandmother Jia in the picture; a Qing queue or official hat " +
      "with finial and peacock feather.",
  },
  "honglou-034": {
    coreKey:
      "A summer night at the Naiad's House: by lamplight Daiyu sits neatly dressed " +
      "before her desk with two old white silk handkerchiefs spread out, wrist raised " +
      "and brush dipped in ink, gazing at them about to write, the cloth still blank",
    groundTruth:
      "Chapter 34, \"Feeling within Feeling, Because of Feeling She Is Moved by Her " +
      "Cousin; Mistake within Mistake, Through a Mistake She Counsels Her Brother\". " +
      "After Baoyu sends Qingwen with two old handkerchiefs, Daiyu \"grasped the " +
      "meaning of the handkerchiefs and her spirit was carried away\", \"ordered the " +
      "lamp lit\", and \"ground ink at the desk, dipped her brush, and wrote in a " +
      "running hand upon the two old handkerchiefs\". Finishing the three quatrains and " +
      "feeling feverish come later.",
    evaluationCriteria:
      "Full credit: The study in the inner room of the Naiad's House on a summer night, " +
      "with bamboo shadows cast on the window gauze; in the middle of the frame the " +
      "young girl Daiyu sits neatly dressed before her writing desk, tears in her eyes, " +
      "her right wrist raised holding an ink-charged brush just about to touch it down; " +
      "on the left of the frame an inkstone on the desk and the two spread-out old white " +
      "silk handkerchiefs (not yet written on); on the right of the frame a lighted " +
      "candle lamp on the desk (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Daiyu lying in bed, in nightclothes, " +
      "or with disheveled hair; Baoyu lying beaten on his couch or Qingwen in the " +
      "picture; legible long poems written across the handkerchiefs; a Manchu headdress.",
  },
  "honglou-035": {
    coreKey:
      "The side room of the House of Green Delights: Ying'er sits on an embroidered " +
      "stool knotting a half-finished plum-blossom net, Baoyu reclines on the couch " +
      "watching, and Baochai sits in an armchair leaning forward with a smile to point",
    groundTruth:
      "Chapter 35, \"White Yuchuan Tastes the Lotus-Leaf Soup Herself; Golden Ying'er " +
      "Deftly Knots a Plum-Blossom Net\". \"Baoyu watched Ying'er knotting the net while " +
      "chatting\", and when Baochai enters and sits down, \"she asked Ying'er, 'What are " +
      "you knotting?' As she asked, she looked at what was in her hands, which was only " +
      "half done. Baochai smiled and said, 'What fun is there in that? Better to knot a " +
      "net to hold the jade.'\" Fetching the gold thread comes later.",
    evaluationCriteria:
      "Full credit: The side room of the House of Green Delights on a summer day; in the " +
      "middle of the frame Ying'er sits on a low embroidered stool, her hands knotting a " +
      "half-finished colored-silk plum-blossom net; on the left of the frame the youth " +
      "Baoyu in a soft everyday robe reclines on a long couch watching with a smile; on " +
      "the right of the frame Baochai, in a honey-colored summer jacket and onion-yellow " +
      "skirt, sits in an armchair leaning forward with a smile to point at the work (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: The Magic Jade already netted with gold thread; Yuchuan " +
      "tasting the lotus-leaf soup or Baoyu lying face down having his wounds dressed in " +
      "the picture; a Qing riding jacket, queue, or Manchu headdress.",
  },
  "honglou-036": {
    coreKey:
      "The inner room of the House of Green Delights: Baoyu in a silver-red gauze shirt " +
      "sleeps on the couch at midday, Baochai sits on an embroidered stool embroidering " +
      "a white-damask red-lined stomacher with mandarin ducks and lotuses, and a " +
      "white-rhino fly whisk lies on the side table",
    groundTruth:
      "Chapter 36, \"Embroidering Mandarin Ducks, a Dream Brings an Omen at Crimson Rue " +
      "Studio; Recognizing Predestined Lots, Love Awakens at Pear Fragrance Court\". " +
      "After Xiren steps out, Baochai sees the white-damask red-lined stomacher " +
      "\"pricked with a pattern of mandarin ducks sporting among lotuses, red lotuses, " +
      "green leaves, and five-colored mandarin ducks\" and \"could not help picking up " +
      "the needle to embroider it in her stead\"; Baoyu \"was sleeping casually on the " +
      "bed in his silver-red gauze shirt\", with a white-rhinoceros-horn fly whisk " +
      "beside him. Crying out in his dream about the marriage of wood and stone comes " +
      "later.",
    evaluationCriteria:
      "Full credit: The inner room of the House of Green Delights at noon in high " +
      "summer; on the left of the frame the youth Baoyu, neatly dressed in a silver-red " +
      "gauze shirt and trousers, lies asleep on the couch in the daytime; in the middle " +
      "of the frame Baochai sits on an embroidered stool beside the couch, her head " +
      "bowed as she holds a needle to embroider the white-damask red-lined stomacher " +
      "with mandarin ducks and lotuses; on the right of the frame a small table beside " +
      "the couch holds a white-rhinoceros-horn fly whisk (a compositional convention; " +
      "the left and right of the original text are not tested). Deductions: Xiren, or " +
      "Daiyu and Xiangyun outside the window, in the picture; Baoyu lying half-naked, " +
      "disordered bedding, or physical contact between Baoyu and Baochai; a Manchu " +
      "headdress or a Qing palace queue.",
  },
  "honglou-anim-025": {
    coreKey:
      "The scabby-headed monk holding the Magic Jade on his palm with a long sigh, the " +
      "lame Taoist holding a wooden fish, and Jia Zheng standing respectfully, with " +
      "animated jade glow, robe corners and silk cord, and plain curtain",
    groundTruth:
      "Chapter 25, \"By Black Magic Sister and Brother Encounter the Five Demons; in the " +
      "Red Chamber the Magic Jade Meets the Two Immortals\". \"It turned out to be a " +
      "scabby-headed monk and a lame Taoist\"; \"hearing this, Jia Zheng took the jade " +
      "from around Baoyu's neck and handed it to the two of them\"; \"the monk took it, " +
      "held it up on his palm, and heaved a long sigh, saying, 'Since we parted at " +
      "Greensickness Peak, thirteen years have passed in the blink of an eye!'\"",
    evaluationCriteria:
      "Full credit: The outer hall of Lady Wang's main rooms; on the left of the frame " +
      "Jia Zheng stands bowing respectfully; in the middle of the frame the " +
      "scabby-headed monk holds the Magic Jade on his palm with both hands and bows his " +
      "head with a long sigh; on the right of the frame the lame Taoist stands in " +
      "attendance holding a small wooden fish (a compositional convention; the left and " +
      "right of the original text are not tested); the jade glow, the robe corners and " +
      "silk cord, and the plain curtain loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: A sickbed, coffins, or anyone wielding a knife in the picture; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-026": {
    coreKey:
      "Daiyu standing alone in the flower shade outside the closed gate of the House of " +
      "Green Delights wiping her tears with a handkerchief, with animated roosting birds " +
      "flying up in alarm, willow strands and skirt hem, and falling blossoms",
    groundTruth:
      "Chapter 26, \"On Wasp-Waist Bridge Words Are Set Forth to Convey Secret Feelings; " +
      "in the Naiad's House Spring Lassitude Stirs Lonely Thoughts\". \"Coming again to " +
      "the House of Green Delights, she saw that the courtyard gate was closed, so Daiyu " +
      "knocked on it with her hand\"; after Qingwen refuses to open the gate, Daiyu " +
      "\"stood alone in the shade of the flowers by the corner of the wall and began to " +
      "sob sorrowfully\"; \"hearing this sound, the roosting birds and crows on the " +
      "nearby willow branches and blossoms all rose with a whirr of wings and flew far " +
      "away\".",
    evaluationCriteria:
      "Full credit: The flower path outside the House of Green Delights at night; on the " +
      "left of the frame the whitewashed wall and the tightly closed vermilion courtyard " +
      "gate; in the middle of the frame Daiyu stands alone in the flower shade wiping " +
      "her tears with a silk handkerchief; on the right of the frame the willow branches " +
      "and flowering trees (a compositional convention; the left and right of the " +
      "original text are not tested); the roosting birds flying up in alarm, the willow " +
      "strands and skirt hem, and the falling blossoms loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: The courtyard gate already open; Baoyu or Qingwen inside " +
      "the gate in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-027": {
    coreKey:
      "Baochai holding a round fan and tiptoeing after a pair of jade-colored " +
      "butterflies toward Drenched Blossoms Pavilion on the water, with animated " +
      "fluttering butterflies, round fan and skirt hem, and embroidered ribbons and " +
      "water ripples",
    groundTruth:
      "Chapter 27, \"By Drenched Blossoms Pavilion Yang Guifei Sports with Colored " +
      "Butterflies; by the Mound of Buried Fragrance Feiyan Weeps over Fallen Red " +
      "Petals\". During the Grain in Ear festival farewell to the flower spirits, " +
      "\"suddenly she saw ahead a pair of jade-colored butterflies, as large as round " +
      "fans, fluttering up and down in the breeze\"; Baochai \"took a fan from her " +
      "sleeve and bent toward the grass to catch them\", and \"tiptoed all the way " +
      "after them to Drenched Blossoms Pavilion on the pond\". Overhearing the secret " +
      "talk through the window comes later.",
    evaluationCriteria:
      "Full credit: The waterside lawn; on the left of the frame Baochai, in a " +
      "honey-colored thin jacket and onion-yellow damask skirt, bends forward holding a " +
      "round fan to chase the butterflies; in the middle of the frame a pair of " +
      "jade-colored butterflies as large as round fans; on the right of the frame " +
      "Drenched Blossoms Pavilion on the water with its lattice windows closed (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the pair of butterflies, the round fan and skirt hem, and the " +
      "embroidered ribbons and water ripples loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The pavilion windows open to show the maids; Daiyu burying " +
      "flowers in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-028": {
    coreKey:
      "Beneath the veranda eaves Baoyu handing over the jade-penannular fan pendant and " +
      "Jiang Yuhan presenting the crimson musk-root sash, with animated sash corner and " +
      "silk cord, bamboo and plantain leaves, and dappled light",
    groundTruth:
      "Chapter 28, \"Jiang Yuhan Fondly Presents a Crimson Musk-Root Sash; Xue Baochai " +
      "Bashfully Slips On the Red Musk Beads\". At Feng Ziying's banquet, Baoyu steps " +
      "out and Jiang Yuhan follows, and \"the two stood beneath the eaves of the " +
      "veranda\"; Baoyu \"took his fan from his sleeve, untied a jade penannular ring " +
      "fan pendant from it, and handed it to Qiguan\"; Jiang Yuhan presents in return " +
      "the crimson musk-root sash bestowed by the Prince of Beijing. Exchanging and " +
      "tying on the pine-pollen-green sash comes later.",
    evaluationCriteria:
      "Full credit: Beneath the veranda eaves of the back hall at the Feng residence; " +
      "on the left of the frame the youth Baoyu hands over the white jade penannular fan " +
      "pendant; on the right of the frame Jiang Yuhan, in a refined pleated gown, " +
      "presents a crimson musk-root sash with both hands (a compositional convention; " +
      "the left and right of the original text are not tested); the sash and silk cord, " +
      "the bamboo and plantain leaves, and the dappled light loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Unfastening inner garments or baring the chest; " +
      "Jiang Yuhan in heavy theatrical costume; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-029": {
    coreKey:
      "Taoist Zhang holding up a tea tray of gold and jade votive gifts and Baoyu " +
      "picking out the red-gold kingfisher-inlaid kirin to show Grandmother Jia, with " +
      "animated gold and jade luster, white beard, and Taoist pennants",
    groundTruth:
      "Chapter 29, \"Those Blessed with Good Fortune Pray for Still More; a Passionate " +
      "Girl, Deep in Feeling, Feels All the More\". \"Just then they saw Taoist Zhang " +
      "come up holding a tray\", a large tea tray draped with a crimson python-satin " +
      "sutra cloth, on which \"there were gold arc pendants and jade penannular rings, " +
      "as well as 'everything as wished' sceptres and 'peace year after year' talismans\"; " +
      "Baoyu \"turned and stirred them with his hand, picking them out one by one to " +
      "show Grandmother Jia\", who spots the red-gold kingfisher-inlaid kirin.",
    evaluationCriteria:
      "Full credit: The main upper hall of the Temple of Clear Void; on the left of the " +
      "frame Grandmother Jia sits in a brocade armchair looking at the tray; in the " +
      "middle of the frame the youth Baoyu reaches out to sort through the items; on " +
      "the right of the frame the eighty-year-old Taoist Zhang holds with both hands a " +
      "tea tray draped with a crimson python-satin sutra cloth, containing a large " +
      "red-gold kingfisher-inlaid kirin (a compositional convention; the left and right " +
      "of the original text are not tested); the gold and jade luster, the white beard " +
      "and wide sleeves, and the Taoist pennants loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Striking the little acolyte or smashing the jade in the picture; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "honglou-anim-030": {
    coreKey:
      "Lingguan crouching beneath the roses to trace the character \"qiang\" with a gold " +
      "hairpin and Baoyu watching spellbound through the fence while tracing it on his " +
      "palm, with animated hairpin, palm-tracing finger, and rose branches",
    groundTruth:
      "Chapter 30, \"Borrowing a Fan, Baochai Delivers a Double Barb; Tracing 'Qiang', " +
      "Lingguan Spellbinds an Outsider\". In the fifth month, when the roses are in " +
      "thick leaf and bloom, Baoyu \"quietly peeped through a hole in the bamboo fence " +
      "and saw a girl crouching beneath the flowers, holding a hairpin in her hand and " +
      "poking at the earth while silently shedding tears\", repeatedly writing the " +
      "character \"qiang\"; Baoyu, in a lotus-root-colored gauze gown, traces the " +
      "strokes on his palm, spellbound. The rain falling comes later.",
    evaluationCriteria:
      "Full credit: The rose trellis before the rain falls; on the left of the frame, " +
      "inside the trellis, Lingguan crouches beneath the blossoms holding a gold hairpin " +
      "to trace the character \"qiang\" in tears; in the middle of the frame the bamboo " +
      "fence; on the right of the frame Baoyu in a lotus-root-colored gauze gown gazes " +
      "spellbound through the fence while tracing the character on his palm (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the gold hairpin tracing on the ground, the finger tracing on the palm, " +
      "and the rose branches loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Heavy rain or umbrellas; slapping Jinchuan or kicking Xiren in the picture; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-031": {
    coreKey:
      "On a summer night Qingwen sitting on a cooling couch tearing a folding fan, Baoyu " +
      "standing by laughing, and Sheyue walking over with a fan, with animated torn fan " +
      "halves, bamboo shadows, and gauze lantern",
    groundTruth:
      "Chapter 31, \"Tearing a Fan Buys a Thousand-Gold Smile; the Gold Kirin Foreshadows " +
      "White-Headed Twin Stars\". Returning slightly tipsy on the evening of the Dragon " +
      "Boat Festival, Baoyu \"saw that a cooling couch with pillows had already been set " +
      "out in the courtyard\" and hands his fan to Qingwen; \"Qingwen took it and, with " +
      "a riiip, tore it in half, followed by several more rips\"; as Baoyu laughs in " +
      "praise, \"Sheyue walked over and said with a smile, 'Do a little less mischief.'\" " +
      "Snatching Sheyue's fan comes later.",
    evaluationCriteria:
      "Full credit: The courtyard of the House of Green Delights on a summer night; on " +
      "the left of the frame Qingwen sits on the cooling couch smiling as she tears a " +
      "folding fan with both hands; in the middle of the frame Baoyu stands beside the " +
      "couch laughing; on the right of the frame Sheyue walks over from the veranda " +
      "holding an intact folding fan (a compositional convention; the left and right of " +
      "the original text are not tested); the trembling torn fan, the bamboo shadows, " +
      "and the gauze lantern and sash ribbons loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Sheyue's fan already snatched; picking up the gold kirin in the " +
      "picture; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-032": {
    coreKey:
      "Outside the green-gauze window Daiyu wiping her tears with a handkerchief and " +
      "turning to leave after overhearing Baoyu's praise, with animated silk " +
      "handkerchief and skirt hem, bamboo blind and plantain leaves, and indoor " +
      "silhouettes",
    groundTruth:
      "Chapter 32, \"Pouring Out His Heart, the Living Baoyu Loses His Wits; Swallowing " +
      "Her Shame, the Passionate Jinchuan Dies\". Walking to the window of the House of " +
      "Green Delights, Daiyu \"just heard Shi Xiangyun speaking of career and " +
      "statecraft, and Baoyu saying, 'Cousin Lin never talks such rubbish'\"; Daiyu " +
      "\"could not help feeling at once delighted and startled, sorrowful and sighing\", " +
      "and \"wiping her tears, she turned to go back\". Baoyu chasing after her to pour " +
      "out his heart comes later.",
    evaluationCriteria:
      "Full credit: Outside the green-gauze window beneath the veranda of the House of " +
      "Green Delights; on the left of the frame Daiyu stands alone in the flower shade " +
      "with mingled joy and sorrow, wiping her tears with a silk handkerchief as she " +
      "turns to leave; in the middle and on the right of the frame, through the " +
      "green-gauze window with its half-rolled bamboo blind, the faint silhouettes of " +
      "Baoyu and Xiangyun indoors are dimly visible (a compositional convention; the " +
      "left and right of the original text are not tested); the silk handkerchief and " +
      "skirt hem, the bamboo blind and plantain leaves, and the indoor silhouettes loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Baoyu already chasing out to " +
      "take her hand; whole figures drifting; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
  "honglou-anim-033": {
    coreKey:
      "In the outer hall the chief steward bowing with a cold smile to demand Qiguan and " +
      "exposing the red sash, Jia Zheng shocked and enraged, and Baoyu standing " +
      "dumbfounded, with animated sleeves, robe sleeves and beard, and light and shadow",
    groundTruth:
      "Chapter 33, \"A Jealous Brother Lets Slip a Few Spiteful Words; a Worthless Son " +
      "Receives a Heavy Flogging\". The chief steward of the Prince of Zhongshun's " +
      "palace comes to demand Qiguan and remarks with a cold smile, \"How did that red " +
      "sash come to be around your young gentleman's waist?\" \"Hearing this, Baoyu felt " +
      "as if his soul had been blasted away and stood dumbfounded\"; Jia Zheng is so " +
      "furious that \"his eyes stared and his mouth twisted\". Jia Huan's slander and " +
      "the heavy flogging come later.",
    evaluationCriteria:
      "Full credit: The outer hall of the Rongguo Mansion; on the left of the frame the " +
      "chief steward of the Prince of Zhongshun's palace, in a black gauze hat and " +
      "official robe, bows with a cold smile; in the middle of the frame Jia Zheng turns " +
      "pale with shock and rage; on the right of the frame the youth Baoyu stands " +
      "dumbfounded with his hands at his sides, the red sash not showing (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the sleeves, the robe sleeves and beard, and the window-lattice light " +
      "and shadow loop smoothly, driven by SMIL or inline CSS. Deductions: Bamboo " +
      "paddles, clubs, or a flogging in the picture; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-034": {
    coreKey:
      "On a summer night Daiyu sitting neatly before her desk by lamplight, wrist raised " +
      "with an ink-dipped brush over two old handkerchiefs, with animated flickering " +
      "candle flame, bamboo shadows on the window gauze, and trembling brush tip",
    groundTruth:
      "Chapter 34, \"Feeling within Feeling, Because of Feeling She Is Moved by Her " +
      "Cousin; Mistake within Mistake, Through a Mistake She Counsels Her Brother\". " +
      "After Baoyu sends Qingwen with two old handkerchiefs, Daiyu \"grasped the " +
      "meaning of the handkerchiefs and her spirit was carried away\", \"ordered the " +
      "lamp lit\", and \"ground ink at the desk, dipped her brush, and wrote in a " +
      "running hand upon the two old handkerchiefs\". Finishing the three quatrains and " +
      "feeling feverish come later.",
    evaluationCriteria:
      "Full credit: The study at the Naiad's House on a summer night; in the middle of " +
      "the frame Daiyu sits neatly dressed before her desk, her wrist raised holding an " +
      "ink-dipped brush about to write; on the left of the frame an inkstone and the two " +
      "old white silk handkerchiefs (not yet written on) on the desk; on the right of " +
      "the frame the candle lamp and bamboo shadows on the green-gauze window (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the candle flame, the bamboo shadows on the window gauze, and the brush " +
      "tip loop smoothly, driven by SMIL or inline CSS. Deductions: Daiyu lying in bed " +
      "with disheveled hair; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-035": {
    coreKey:
      "Ying'er sitting on an embroidered stool knotting a half-finished plum-blossom " +
      "net, Baoyu reclining on the couch watching, and Baochai leaning forward in her " +
      "chair, with animated colored silk threads, plantain shadows, and sleeves",
    groundTruth:
      "Chapter 35, \"White Yuchuan Tastes the Lotus-Leaf Soup Herself; Golden Ying'er " +
      "Deftly Knots a Plum-Blossom Net\". \"Baoyu watched Ying'er knotting the net while " +
      "chatting\", and when Baochai enters and sits down, \"she asked Ying'er, 'What are " +
      "you knotting?' As she asked, she looked at what was in her hands, which was only " +
      "half done. Baochai smiled and said, 'What fun is there in that? Better to knot a " +
      "net to hold the jade.'\" Fetching the gold thread comes later.",
    evaluationCriteria:
      "Full credit: The side room of the House of Green Delights on a summer day; in the " +
      "middle of the frame Ying'er sits on a low embroidered stool knotting a " +
      "half-finished colored-silk plum-blossom net; on the left of the frame Baoyu " +
      "reclines on a long couch watching; on the right of the frame Baochai sits in an " +
      "armchair leaning forward to point (a compositional convention; the left and right " +
      "of the original text are not tested); the colored silk threads, the plantain-leaf " +
      "shadows, and the sleeves loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "The jade already netted with gold thread; Baoyu lying face down having his wounds " +
      "dressed in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-036": {
    coreKey:
      "Baoyu sleeping on the couch at midday in a silver-red gauze shirt and Baochai " +
      "sitting on an embroidered stool embroidering a white-damask red-lined mandarin-" +
      "duck stomacher, with animated needle, white-rhino fly whisk, and window shadows",
    groundTruth:
      "Chapter 36, \"Embroidering Mandarin Ducks, a Dream Brings an Omen at Crimson Rue " +
      "Studio; Recognizing Predestined Lots, Love Awakens at Pear Fragrance Court\". " +
      "After Xiren steps out, Baochai sees the white-damask red-lined stomacher " +
      "\"pricked with a pattern of mandarin ducks sporting among lotuses, red lotuses, " +
      "green leaves, and five-colored mandarin ducks\" and \"could not help picking up " +
      "the needle to embroider it in her stead\"; Baoyu \"was sleeping casually on the " +
      "bed in his silver-red gauze shirt\", with a white-rhinoceros-horn fly whisk " +
      "beside him. Crying out in his dream about the marriage of wood and stone comes " +
      "later.",
    evaluationCriteria:
      "Full credit: The inner room of the House of Green Delights at noon in high " +
      "summer; on the left of the frame Baoyu, neatly dressed in a silver-red gauze " +
      "shirt and trousers, sleeps on the couch in the daytime; in the middle of the " +
      "frame Baochai sits on an embroidered stool embroidering the white-damask " +
      "red-lined mandarin-duck stomacher; on the right of the frame a small table holds " +
      "a white-rhinoceros-horn fly whisk (a compositional convention; the left and right " +
      "of the original text are not tested); the needle, the fly-whisk hairs, and the " +
      "bamboo shadows on the window gauze loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Daiyu and Xiangyun outside the window or Baoyu lying half-naked in " +
      "the picture; whole figures drifting; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
};
