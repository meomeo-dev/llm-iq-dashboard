/**
 * 《红楼梦》第 49–60 回候选的英文标签与英文评判标准，由
 * src/core/classics/honglou/ch049-060.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const HONGLOU_CH049_060_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-049": "Ch. 49 · Roasting Venison around the Brazier at Snowy Reed Convent",
  "honglou-050": "Ch. 50 · Baoqin Stands in the Snow in Her Feather Cloak beside Plum Blossoms",
  "honglou-051": "Ch. 51 · Debating Poems on Antiquity by Lamplight at Warm Fragrance Anchorage",
  "honglou-052": "Ch. 52 · Qingwen Bravely Mends the Peacock Cloak in Sickness",
  "honglou-053": "Ch. 53 · The Ning Mansion Ancestral Sacrifice on New Year's Eve",
  "honglou-054": "Ch. 54 · Wang Xifeng Pours Wine Emulating the Colorful Robe",
  "honglou-055": "Ch. 55 · Tanchun Dispenses Impartial Justice in the Council Hall",
  "honglou-056": "Ch. 56 · Astute Tanchun Assigns Garden Plots by the Register",
  "honglou-057": "Ch. 57 · Clever Zijuan Tests Baoyu beneath Peach Blossoms",
  "honglou-058": "Ch. 58 · Baoyu Shields Ouguan in the Apricot Shade",
  "honglou-059": "Ch. 59 · Ying'er Weaves Flower Baskets on Willow Leaf Islet",
  "honglou-060": "Ch. 60 · Fangguan Tosses Jasmine Powder to Substitute for Salve",
};

/** 静态与动态候选 id → 英文评判标准 */
export const HONGLOU_CH049_060_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-049": {
    coreKey:
      "Snowy Reed Convent snowfield: Xiangyun and Baoyu hold iron skewers around an iron " +
      "brazier roasting venison, Ping'er removes her bracelet onto a table to take meat, " +
      "and Daiyu and Baoqin watch in cloaks",
    groundTruth:
      "Chapter 49, \"White Snow and Red Plum Blossoms in a World of Crystal; Fragrant " +
      "Maidens Feast on Scented Raw Game\". \"The old women were seen bringing in an " +
      "iron brazier, iron skewers, and a wire grill\"; Xiangyun wears a scarlet felt " +
      "Zhaojun hood and a sable-trimmed outer gown to roast venison with Baoyu; " +
      "\"Ping'er... slipped the bracelet from her wrist, and the three encircled the " +
      "fire brazier to roast three pieces first\", while Baoqin in her duck-feather cape " +
      "and others watch.",
    evaluationCriteria:
      "Full credit: Snowfield before the thatched eaves of Snowy Reed Convent just after " +
      "heavy snowfall; on the left of the frame Xiangyun, wearing a Zhaojun hood and " +
      "sable coat, and Baoyu in a scarlet felt cloak hold iron skewers roasting venison " +
      "over an iron brazier; in the middle of the frame Ping'er rolls up her sleeves, " +
      "with her slipped-off gold bracelet placed on the side table, reaching for roasted " +
      "meat around the fire; on the right of the frame Daiyu and Baoqin, wearing her " +
      "golden-green wild-duck feather cloak, watch with smiles (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "Indoor heated-bed verse-linking or searching for the lost bracelet in the picture; " +
      "Qingwen jabbing Zhuir with a hairpin; Manchu \"two-handle\" headdresses or Qing " +
      "queues.",
  },
  "honglou-050": {
    coreKey:
      "Snow-cleared slope in Grand View Garden: Baoqin in golden-green duck-feather cloak " +
      "waits in the snow, a maid holds a vase of red plum blossoms, and Baoyu in scarlet " +
      "felt emerges",
    groundTruth:
      "Chapter 50, \"At the Snowy Reed Convent They Strive to Improvise Linked Verses; in " +
      "the Warm Fragrance Anchorage They Devise Spring Lantern Riddles\". \"Suddenly " +
      "Baoqin was seen standing on the hill slope waiting in her wild-duck feather cloak, " +
      "with a maid behind her holding a vase of red plum blossoms\"; Grandmother Jia " +
      "praised the scene as resembling Qiu Shizhou's Double Beauties; \"then from behind " +
      "Baoqin emerged a person cloaked in scarlet felt... that was Baoyu\". Entering " +
      "Warm Fragrance Anchorage to inspect paintings and write riddles comes later.",
    evaluationCriteria:
      "Full credit: Hill slope in Grand View Garden after heavy snow has cleared; in the " +
      "middle of the frame Baoqin, wearing her resplendent golden-green wild-duck feather " +
      "cloak, stands on the snowy slope; on the left of the frame a young maid attends " +
      "holding a high-shouldered porcelain vase filled with carmine red plum blossoms; " +
      "on the right of the frame Baoyu in a scarlet felt cloak carrying a plum sprig " +
      "emerges from behind the slope (a compositional convention; the left and right of " +
      "the original text are not tested). Deductions: Baoqin's cloak drawn as an " +
      "ordinary red cape; roasting venison or indoor painting-inspection and " +
      "riddle-making in the picture; Manchu \"two-handle\" headdresses or Qing queues.",
  },
  "honglou-051": {
    coreKey:
      "By lamplight in Warm Fragrance Anchorage: Baoqin presents poetry sheets on " +
      "antiquity, Daiyu leans against the desk smilingly rejecting dogmatism, and " +
      "Baochai sits on a stool discussing historical evidence",
    groundTruth:
      "Chapter 51, \"Little Sister Xue Composes New Poems on the Past; Quack Hu " +
      "Recklessly Prescribes Violent Medicine\". \"Everyone heard that Baoqin had " +
      "composed ten quatrains on historical sites she had visited in various provinces, " +
      "each concealing an object\"; Baochai remarked that the last two lacked historical " +
      "evidence, but \"Daiyu promptly intervened, 'Cousin Baochai is really being far too " +
      "hidebound and artificial!'\" Xiren visiting her sick mother and Quack Hu taking " +
      "the pulse come later.",
    evaluationCriteria:
      "Full credit: Inner study of Warm Fragrance Anchorage on a winter night, with a " +
      "bronze candlestick and a red clay stove on the desk; on the left of the frame " +
      "Baoqin in an indoor gown stands beside the red sandalwood desk holding her poem " +
      "sheets; in the middle of the frame Daiyu leans against the desk stroking the " +
      "sheets and laughing in debate; on the right of the frame Baochai sits on an " +
      "embroidered stool holding a sheet discussing historical records, with Li Wan and " +
      "Tanchun attending nearby (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Still wearing heavy outdoor fur " +
      "cloaks indoors; Quack Hu taking a pulse through the red curtain or decocting " +
      "medicine in the picture; Manchu \"two-handle\" headdresses.",
  },
  "honglou-052": {
    coreKey:
      "Cold night in the House of Green Delights warm chamber: Qingwen sits up in a " +
      "squirrel cloak nailing a bamboo hoop to mend the peacock cloak, Baoyu inquires " +
      "with tea, and Sheyue rolls thread",
    groundTruth:
      "Chapter 52, \"Pretty Ping'er Kindly Conceals the Shrimp-Whisker Bracelet; Brave " +
      "Qingwen Bravely Mends the Peacock-Feather Cloak in Sickness\". Qingwen sits up " +
      "despite illness, \"nailing firmly to the underside a bamboo hoop the size of a tea " +
      "cup, scraping the edges of the hole loose with a gold knife, and threading a needle " +
      "with two strands to work out the warp and weft\" in reweaving, while Baoyu attends " +
      "with hot water and Sheyue helps twist thread. Collapsing after finishing comes " +
      "later.",
    evaluationCriteria:
      "Full credit: A heated kang in the warm chamber of the House of Green Delights on a " +
      "cold night, with a bronze lampstand; in the middle of the frame Qingwen, cheeks " +
      "flushed feverish, sits propped on cushions in a squirrel cloak, holding the peacock " +
      "cloak fitted with a bamboo hoop as she guides peacock-gold thread to reweave; on the " +
      "left of the frame Baoyu in informal robe stands by the kang holding a teacup " +
      "inquiring anxiously; on the right of the frame Sheyue sits on the kang edge " +
      "helping twist gold thread (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Qingwen already collapsed in a faint; " +
      "jabbing Zhuir with a hairpin or Ping'er concealing the bracelet in the picture; " +
      "modern sewing tools; Manchu \"two-handle\" headdresses or queues.",
  },
  "honglou-053": {
    coreKey:
      "On the moon terrace of the Ning Mansion Ancestral Temple: antique bronze vessels " +
      "stand in solemn array, Jia Jing presides, Jia Zhen presents a bronze libation cup, " +
      "and Baoyu holds an incense burner",
    groundTruth:
      "Chapter 53, \"The Ning Mansion Sacrifices to the Ancestors on New Year's Eve; the " +
      "Rong Mansion Hosts a Banquet on the Lantern Festival\". Sacrificing at the Jia " +
      "Family Ancestral Temple on New Year's Eve, \"on the moon terrace were set " +
      "green-patinated antique bronze tripods, beakers, and ritual vessels. Above the porch " +
      "hung a gold plaque carved with nine dragons\"; \"the men of the Jia clan lined up in " +
      "generational order: Jia Jing presided, Jia She assisted, Jia Zhen presented " +
      "libations, Jia Lian and Jia Cong presented silk, and Baoyu held incense\". Passing " +
      "dishes in the main hall and the Lantern Festival banquet come later.",
    evaluationCriteria:
      "Full credit: Moon terrace before the main hall of the Ning Mansion Ancestral Temple, " +
      "with pines, cypresses, palace lanterns, and green-patinated bronze ritual vessels " +
      "displayed; in the middle of the frame Jia Jing, hair in a Taoist bun with jade " +
      "hairpin, presides in ceremonial robes; on the left of the frame Jia Zhen in brocade " +
      "sacrificial robes presents a bronze libation cup with both hands, while Jia She " +
      "assists; on the right of the frame Baoyu in embroidered python-pattern court dress " +
      "stands solemnly holding a long-handled incense burner (a compositional convention; " +
      "the left and right of the original text are not tested). Deductions: Wu Jinxiao " +
      "paying rent, passing dishes in the main hall, or the Lantern Festival banquet in the " +
      "picture; Qing shaved queues or official finials with peacock feathers.",
  },
  "honglou-054": {
    coreKey:
      "Lantern Festival banquet in the reception hall: Grandmother Jia reclines on a " +
      "dragon-carved couch smilingly critiquing ballads, Xifeng pours wine from a silver " +
      "flagon to delight her, and two female minstrels hold a sanxian and pipa",
    groundTruth:
      "Chapter 54, \"Lady Dowager Shi Explodes Hackneyed Formulas; Wang Xifeng Emulates " +
      "the Clownish Filial Son\". At the Lantern Festival reception hall banquet, two " +
      "female storytellers sit on stools holding a sanxian lute and a pipa singing The " +
      "Phoenix Seeks a Mate; Grandmother Jia lambastes the stale clichés of brilliant " +
      "youths and fair maidens, and \"Xifeng stepped up to pour wine, saying with a " +
      "laugh, 'Enough, enough! The wine is growing cold; let our Old Ancestress take a " +
      "sip to wet her throat before exploding more lies!'\" Moving into the warm chamber to " +
      "play the drum-and-plum-blossom game comes later.",
    evaluationCriteria:
      "Full credit: Grand reception hall of the Rong Mansion on the Lantern Festival night; " +
      "in the middle of the frame Grandmother Jia reclines on a short couch carved with " +
      "openwork dragons, laughing and chatting merrily; on the left of the frame Wang " +
      "Xifeng in festive attire holds a warming silver flagon to pour wine to please her, " +
      "while Baoyu, Baochai, and Daiyu laugh at table; on the right of the frame two " +
      "female ballad-singers sit on rosewood stools holding a sanxian and a pipa (a " +
      "compositional convention; the left and right of the original text are not tested). " +
      "Deductions: An outdoor opera troupe performing, young men kneeling to toast, or the " +
      "drum-and-plum-blossom game in the picture; ballad-singers in rags; Manchu " +
      "\"two-handle\" headdresses or Qing queues.",
  },
  "honglou-055": {
    coreKey:
      "In the Council Hall of Grand View Garden: Tanchun presides at the desk " +
      "adjudicating by past accounts, Li Wan sits alongside, Ping'er bows holding tally " +
      "tallies, and matrons wait under the veranda",
    groundTruth:
      "Chapter 55, \"A Foolish Concubine Vents Petty Grudges on Her Own Daughter; Crafty " +
      "Bondservants Harbor Sinister Intentions toward Young Mistresses\". The small " +
      "three-bay hall south of the garden gate bore a plaque reading \"Fostering Virtue " +
      "and Instructing in Propriety\", commonly called the Council Hall; Tanchun verified " +
      "past accounts and ruled by precedent to award twenty taels for Zhao Guoji's " +
      "funeral; Ping'er brought word from Xifeng, standing respectfully to ask the young " +
      "mistress to make the final decision; \"the supervisory matrons all waited quietly on " +
      "the veranda\". Washing hands and lecturing the matrons come later.",
    evaluationCriteria:
      "Full credit: The \"Fostering Virtue and Instructing in Propriety\" Council Hall in " +
      "early spring; in the middle of the frame Tanchun, with keen eyes and slender " +
      "brows, sits upright behind the large sandalwood desk resting her hand on an old " +
      "account book; on the left of the frame Li Wan in plain gown sits beside the desk; " +
      "on the right of the frame Ping'er in a pink sleeveless vest bows holding " +
      "silver-disbursing tallies to report, while steward matrons wait respectfully under " +
      "the veranda (a compositional convention; the left and right of the original text " +
      "are not tested). Deductions: Concubine Zhao throwing a tantrum or Tanchun weeping " +
      "in the picture; Xifeng taking medicine in her bedchamber; Manchu \"two-handle\" " +
      "headdresses or modern stationery.",
  },
  "honglou-056": {
    coreKey:
      "Inside the Council Hall: Tanchun marks the plantation register with a vermilion " +
      "brush, Baochai advises beside the desk, Li Wan sits nearby, and three elderly " +
      "matrons receive their charges",
    groundTruth:
      "Chapter 56, \"Astute Tanchun Promotes Welfare to Root out Deep-Seated Abuses; " +
      "Discreet Baochai Dispenses Small Favors to Preserve the Greater Harmony\". " +
      "Tanchun and the others decided on contracting out garden plots, \"pointing out " +
      "several names on the register for the three of them to examine. Ping'er hastened to " +
      "fetch brush and ink\", assigning Old Dame Zhu to the bamboo groves, Old Dame Tian " +
      "to the paddy fields and vegetable plots of Sweet-Rice Village, and Old Dame Ye to " +
      "the fragrant herbs; \"Tanchun and Li Wan made clear instructions to all\", and the " +
      "matrons gladly received their appointments.",
    evaluationCriteria:
      "Full credit: Inside the Council Hall in Grand View Garden; on the left of the frame " +
      "Tanchun sits behind the sandalwood desk marking the garden land register with a " +
      "vermilion brush, while Li Wan sits beside her; in the middle of the frame Baochai " +
      "in a honey-colored sleeveless coat stands beside the desk offering counsel; on the " +
      "right of the frame Dame Zhu, Dame Tian, and Dame Ye, three elderly maidservants, " +
      "bow joyfully to accept their tasks (a compositional convention; the left and right " +
      "of the original text are not tested). Deductions: A physician feeling pulses, " +
      "Concubine Zhao making a scene, or Baoyu dreaming of Zhen Baoyu in the picture; " +
      "Manchu \"two-handle\" headdresses or modern stitched-bound books.",
  },
  "honglou-057": {
    coreKey:
      "On rocks beneath the peach tree behind Drenched Blossoms Pavilion: Baoyu sits " +
      "stunned resting his cheek in hand, while Zijuan in patterned damask and satin vest " +
      "sits beside him watching",
    groundTruth:
      "Chapter 57, \"Clever Zijuan Tests Rash Jade with Affecting Words; Tender Aunt " +
      "Comforts Simple Pin with Loving Counsel\". Baoyu sat on a rock under a peach tree " +
      "behind Drenched Blossoms Pavilion lost in thought with his chin propped in his " +
      "hand; Zijuan, wearing \"a thin lined jacket of ink-splashed damask with a lined vest " +
      "of black satin outside\", came looking for him and sat beside him, falsely claiming " +
      "that Miss Lin would return to Suzhou next year; \"hearing this, Baoyu felt as if a " +
      "clap of thunder had exploded over his head\". Falling into a delirious stupor comes " +
      "later.",
    evaluationCriteria:
      "Full credit: Beside rocks beneath a blooming peach tree behind Drenched Blossoms " +
      "Pavilion in mid-spring, with blossoms in full bloom and fallen petals; on the left " +
      "of the frame young Baoyu in a silk robe sits dazed on a rock propping his chin, " +
      "wearing a shocked and stricken expression; on the right of the frame Zijuan, wearing " +
      "an ink-splashed damask jacket and black satin vest, sits beside him on the rock " +
      "watching him closely to test his feelings; in the middle of the frame peach branches " +
      "shed blossoms (a compositional convention; the left and right of the original text " +
      "are not tested). Deductions: Delirium on the sickbed at Green Delights, pinching the " +
      "philtrum, or Daiyu coughing up medicine in the picture; Manchu \"two-handle\" " +
      "headdresses or Qing queues.",
  },
  "honglou-058": {
    coreKey:
      "Behind rocks by the large apricot tree loaded with green fruit: Ouguan crouches by " +
      "the earthen basin weeping over paper ashes, and Baoyu in slippers taps away the " +
      "matron's hand with his cane to shield her",
    groundTruth:
      "Chapter 58, \"In the Apricot Shade the False Phoenix Weeps for the Absent Phenix; " +
      "through the Madder-Silk Window True Emotion Interprets Passionate Truth\". " +
      "\"Behind the garden rocks stood a large apricot tree whose blossoms had all " +
      "fallen and whose dense foliage cast a verdant shade, bearing numerous small " +
      "apricots the size of peas\"; Ouguan, tears streaming down her face, crouched " +
      "grieving over the ashes of paper money; seized by a matron, \"Baoyu hastily held " +
      "Ouguan back and knocked away the old woman's hand with his cane\" to rescue her.",
    evaluationCriteria:
      "Full credit: Under the large apricot tree behind the rocks in late spring " +
      "(blossoms all fallen, leaves dense and green, loaded with pea-sized green apricots); " +
      "on the left of the frame the girl Ouguan crouches weeping beside the paper ashes " +
      "in a small earthen basin at the rock corner; in the middle of the frame Baoyu in " +
      "informal robe and slippers steps forward, using his jointed bamboo cane to knock " +
      "away the matron's hand and protect Ouguan; on the right of the frame the patrol " +
      "matron recoils in panic (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Apricot tree drawn with pink flowers in " +
      "full bloom; Fangguan's foster mother splashing water in quarrel or funeral cortege " +
      "in the picture; Ouguan wearing flamboyant theatrical costume; shaved heads with queues.",
  },
  "honglou-059": {
    coreKey:
      "Rain-washed willow bank on Willow Leaf Islet: Ying'er sits on stream rocks weaving " +
      "tender willows and peach sprigs, Chunyan holds an arched willow basket filled with " +
      "fresh flowers, and Ruiguan looks on holding willows",
    groundTruth:
      "Chapter 59, \"On Willow Leaf Islet Scolding Ying and Chastising Yan; in the Crimson " +
      "Rue Chamber Summoning Generals and Flying Talismans\". At dawn after the rain " +
      "stopped, Ying'er and Ruiguan walked to Willow Leaf Islet, \"seeing that the willow " +
      "leaves were just budding pale green and the twigs hung like golden threads\", " +
      "snapping twigs and picking blossoms to \"weave an exquisite basket with an arched " +
      "handle\"; after presenting one to Daiyu, she sat back on the rocks to weave again as " +
      "Chunyan came up to chat and admire. Chunyan's aunt and mother arriving to beat her " +
      "and throw the basket into the river come later.",
    evaluationCriteria:
      "Full credit: Willow-lined bank along the stream on Willow Leaf Islet after " +
      "late-spring rain, with weeping willows sprouting green; on the left of the frame " +
      "young Ying'er sits on a boulder weaving tender willow twigs and flower sprigs; in " +
      "the middle of the frame Chunyan holds in both hands an arched wicker basket filled " +
      "with fresh flowers, admiring it with a smile; on the right of the frame Ruiguan " +
      "stands by holding willow branches and watching with a smile (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "An old woman beating Chunyan with a staff, slapping her face, or flinging the " +
      "flower basket into the river in the picture; Manchu \"two-handle\" headdresses or " +
      "flowerpot-sole shoes.",
  },
  "honglou-060": {
    coreKey:
      "Beside the warm couch in the House of Green Delights: Fangguan haughtily tosses a " +
      "packet of jasmine powder onto the kang, Jia Huan bows picking it up onto paper " +
      "from his boot, and Baoyu looks on smiling",
    groundTruth:
      "Chapter 60, \"Jasmine Powder Replaces Rose-Attar Salve; Rose Syrup Attracts Poria " +
      "Cake\". Seeing the rose-attar salve in Fangguan's hands, Jia Huan \"bent his waist, " +
      "pulled a sheet of paper from his boot-top to hold it\", and begged for some; " +
      "\"Fangguan wrapped up some jasmine powder and brought it. When Jia Huan saw it he " +
      "stretched out his hand to take it, but Fangguan promptly tossed it onto the kang. " +
      "Jia Huan had no choice but to pick it up from the kang\". Concubine Zhao's violent " +
      "outburst comes later.",
    evaluationCriteria:
      "Full credit: Beside the warm kang couch in the main room of the House of Green " +
      "Delights in late spring; on the left of the frame Fangguan in a pink vest stands " +
      "beside the couch, disdainfully tossing a paper packet of jasmine powder onto the " +
      "kang; in the middle of the frame Jia Huan, holding paper pulled from his boot, " +
      "bends at the waist and knees reaching to pick up the powder packet from the kang; " +
      "on the right of the frame Baoyu reclines comfortably by a backrest holding a " +
      "folding fan and watching with a smile (a compositional convention; the left and " +
      "right of the original text are not tested). Deductions: Concubine Zhao bursting in " +
      "to scuffle or five actresses counter-attacking in the picture; Liu Wu'er falsely " +
      "accused in the picture; Manchu \"two-handle\" headdresses or queues.",
  },
  "honglou-anim-049": {
    coreKey:
      "Before Snowy Reed Convent Xiangyun, Baoyu, and Ping'er roast venison around a " +
      "brazier while Daiyu and Baoqin watch, with animated brazier smoke, roof snow, and " +
      "snow-laden reeds",
    groundTruth:
      "Chapter 49, \"White Snow and Red Plum Blossoms in a World of Crystal; Fragrant " +
      "Maidens Feast on Scented Raw Game\". \"The old women were seen bringing in an " +
      "iron brazier, iron skewers, and a wire grill\"; Xiangyun wears a scarlet felt " +
      "Zhaojun hood and a sable-trimmed outer gown to roast venison with Baoyu; " +
      "\"Ping'er... slipped the bracelet from her wrist, and the three encircled the " +
      "fire brazier to roast three pieces first\", while Baoqin in her duck-feather cape " +
      "and others watch.",
    evaluationCriteria:
      "Full credit: Snowfield before Snowy Reed Convent; on the left of the frame " +
      "Xiangyun and Baoyu hold skewers roasting venison over an iron brazier; in the " +
      "middle of the frame Ping'er rolls up her sleeves, places her bracelet on the " +
      "table, and reaches for meat around the fire; on the right of the frame Daiyu and " +
      "Baoqin in her golden-green duck-feather cloak watch with smiles (a compositional " +
      "convention; the left and right of the original text are not tested); the " +
      "brazier flame and blue smoke, the eaves snow, and the snow reeds and cloak edges " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Indoor verse-linking or " +
      "searching for the bracelet in the picture; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-050": {
    coreKey:
      "On the snow slope Baoqin stands in her duck-feather cloak, a maid holds a plum " +
      "vase, and Baoyu emerges in scarlet felt, with animated cloaks, plum branches, and " +
      "drifting snow",
    groundTruth:
      "Chapter 50, \"At the Snowy Reed Convent They Strive to Improvise Linked Verses; in " +
      "the Warm Fragrance Anchorage They Devise Spring Lantern Riddles\". \"Suddenly " +
      "Baoqin was seen standing on the hill slope waiting in her wild-duck feather cloak, " +
      "with a maid behind her holding a vase of red plum blossoms\"; Grandmother Jia " +
      "praised the scene as resembling Qiu Shizhou's Double Beauties; \"then from behind " +
      "Baoqin emerged a person cloaked in scarlet felt... that was Baoyu\". Entering " +
      "Warm Fragrance Anchorage to inspect paintings and write riddles comes later.",
    evaluationCriteria:
      "Full credit: Snowy slope in Grand View Garden; in the middle of the frame Baoqin in " +
      "a golden-green duck-feather cloak stands waiting in the snow; on the left of the " +
      "frame a young maid holds a high-shouldered vase with carmine plum blossoms; on the " +
      "right of the frame Baoyu in scarlet felt emerges holding a plum sprig (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the cloak hems, plum branches, and fine snow on the slope loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Indoor painting-inspection or " +
      "riddle-making in the picture; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "honglou-anim-051": {
    coreKey:
      "Before the study desk in Warm Fragrance Anchorage Baoqin displays poem sheets " +
      "while Daiyu and Baochai debate verses by lamplight, with animated candlelight, " +
      "stove glow, paper sheets, and bamboo shadows",
    groundTruth:
      "Chapter 51, \"Little Sister Xue Composes New Poems on the Past; Quack Hu " +
      "Recklessly Prescribes Violent Medicine\". \"Everyone heard that Baoqin had " +
      "composed ten quatrains on historical sites she had visited in various provinces, " +
      "each concealing an object\"; Baochai remarked that the last two lacked historical " +
      "evidence, but \"Daiyu promptly intervened, 'Cousin Baochai is really being far too " +
      "hidebound and artificial!'\" Xiren visiting her sick mother and Quack Hu taking " +
      "the pulse come later.",
    evaluationCriteria:
      "Full credit: Inner room of Warm Fragrance Anchorage on a winter night; on the left " +
      "of the frame Baoqin stands beside the sandalwood desk holding her poem sheets; in " +
      "the middle of the frame Daiyu leans on the desk smilingly debating; on the right " +
      "of the frame Baochai sits on an embroidered stool discussing historical evidence, " +
      "with Li Wan and Tanchun standing by (a compositional convention; the left and right " +
      "of the original text are not tested); the candlelight and stove glow, poem " +
      "sheets, and window bamboo shadows loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Quack Hu taking pulses or brewing medicine in the picture; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-052": {
    coreKey:
      "On a cold night Qingwen sits up holding a bamboo hoop guiding peacock-gold thread " +
      "to mend the cloak while Baoyu offers tea and Sheyue twists thread, with animated " +
      "candle flame and gleaming thread",
    groundTruth:
      "Chapter 52, \"Pretty Ping'er Kindly Conceals the Shrimp-Whisker Bracelet; Brave " +
      "Qingwen Bravely Mends the Peacock-Feather Cloak in Sickness\". Qingwen sits up " +
      "despite illness, \"nailing firmly to the underside a bamboo hoop the size of a tea " +
      "cup, scraping the edges of the hole loose with a gold knife, and threading a needle " +
      "with two strands to work out the warp and weft\" in reweaving, while Baoyu attends " +
      "with hot water and Sheyue helps twist thread. Collapsing after finishing comes " +
      "later.",
    evaluationCriteria:
      "Full credit: Heated kang in the warm chamber of the House of Green Delights on a " +
      "cold night; in the middle of the frame Qingwen in a squirrel cloak sits propped up, " +
      "guiding peacock-gold thread to mend the cloak fitted with a bamboo hoop; on the " +
      "left of the frame Baoyu stands by the kang holding a teacup inquiring with " +
      "concern; on the right of the frame Sheyue sits on the kang edge helping twist " +
      "gold thread (a compositional convention; the left and right of the original text " +
      "are not tested); the needlework gold-glimmer, candle flame, and steam from the cup " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Qingwen collapsed or " +
      "jabbing Zhuir in the picture; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "honglou-anim-053": {
    coreKey:
      "Before ritual bronzes on the Ancestral Temple terrace Jia Jing presides, Jia Zhen " +
      "offers libations, and Baoyu holds incense, with animated incense smoke, palace " +
      "lanterns, jade pendants, and pines",
    groundTruth:
      "Chapter 53, \"The Ning Mansion Sacrifices to the Ancestors on New Year's Eve; the " +
      "Rong Mansion Hosts a Banquet on the Lantern Festival\". Sacrificing at the Jia " +
      "Family Ancestral Temple on New Year's Eve, \"on the moon terrace were set " +
      "green-patinated antique bronze tripods, beakers, and ritual vessels. Above the porch " +
      "hung a gold plaque carved with nine dragons\"; \"the men of the Jia clan lined up in " +
      "generational order: Jia Jing presided, Jia She assisted, Jia Zhen presented " +
      "libations, Jia Lian and Jia Cong presented silk, and Baoyu held incense\". Passing " +
      "dishes in the main hall and the Lantern Festival banquet come later.",
    evaluationCriteria:
      "Full credit: Moon terrace before the main hall of the Ancestral Temple displaying " +
      "bronze ritual vessels; in the middle of the frame Jia Jing presides; on the left of " +
      "the frame Jia Zhen presents a bronze libation cup with both hands while Jia She " +
      "assists; on the right of the frame Baoyu in court dress stands solemnly holding an " +
      "incense burner (a compositional convention; the left and right of the original " +
      "text are not tested); the incense smoke from tripod and burner, palace lantern " +
      "tassels and jade pendants, and pine boughs loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Passing dishes in the main hall or the Lantern Festival " +
      "feast in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-054": {
    coreKey:
      "In the hall Grandmother Jia laughs from her couch, Xifeng pours wine from a silver " +
      "flagon, and minstrels hold lutes, with animated wine stream, incense smoke, and " +
      "lanterns",
    groundTruth:
      "Chapter 54, \"Lady Dowager Shi Explodes Hackneyed Formulas; Wang Xifeng Emulates " +
      "the Clownish Filial Son\". At the Lantern Festival reception hall banquet, two " +
      "female storytellers sit on stools holding a sanxian lute and a pipa singing The " +
      "Phoenix Seeks a Mate; Grandmother Jia lambastes the stale clichés of brilliant " +
      "youths and fair maidens, and \"Xifeng stepped up to pour wine, saying with a " +
      "laugh, 'Enough, enough! The wine is growing cold; let our Old Ancestress take a " +
      "sip to wet her throat before exploding more lies!'\" Moving into the warm chamber to " +
      "play the drum-and-plum-blossom game comes later.",
    evaluationCriteria:
      "Full credit: Grand reception hall of the Rong Mansion on the Lantern Festival " +
      "night; in the middle of the frame Grandmother Jia laughs on the dragon couch; on " +
      "the left of the frame Wang Xifeng pours warm wine from a silver flagon to cheer " +
      "her; on the right of the frame two female storytellers on stools hold a sanxian " +
      "and a pipa (a compositional convention; the left and right of the original text " +
      "are not tested); the wine stream from the spout, burner smoke and candlelight, " +
      "and outdoor festive lanterns and fireworks loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Stage opera or passing plum blossoms to drums in the " +
      "picture; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-055": {
    coreKey:
      "In the Council Hall Tanchun rules at the desk, Li Wan sits alongside, and Ping'er " +
      "reports with tallies, with animated bamboo blinds, account leaves, and tree shadows",
    groundTruth:
      "Chapter 55, \"A Foolish Concubine Vents Petty Grudges on Her Own Daughter; Crafty " +
      "Bondservants Harbor Sinister Intentions toward Young Mistresses\". The small " +
      "three-bay hall south of the garden gate bore a plaque reading \"Fostering Virtue " +
      "and Instructing in Propriety\", commonly called the Council Hall; Tanchun verified " +
      "past accounts and ruled by precedent to award twenty taels for Zhao Guoji's " +
      "funeral; Ping'er brought word from Xifeng, standing respectfully to ask the young " +
      "mistress to make the final decision; \"the supervisory matrons all waited quietly on " +
      "the veranda\". Washing hands and lecturing the matrons come later.",
    evaluationCriteria:
      "Full credit: Council Hall in Grand View Garden; in the middle of the frame Tanchun " +
      "sits behind the sandalwood desk resting her hand on the accounts; on the left of " +
      "the frame Li Wan sits beside the desk; on the right of the frame Ping'er bows " +
      "presenting tallies, with matrons waiting on the veranda (a compositional " +
      "convention; the left and right of the original text are not tested); the eaves " +
      "bamboo blinds, account book pages, and courtyard tree shadows loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Concubine Zhao crying or Tanchun wiping " +
      "tears in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-056": {
    coreKey:
      "In the Council Hall Tanchun marks the register with vermilion ink, Baochai " +
      "advises, and three matrons receive charges, with animated vermilion brush, bamboo " +
      "shadows, and sleeves",
    groundTruth:
      "Chapter 56, \"Astute Tanchun Promotes Welfare to Root out Deep-Seated Abuses; " +
      "Discreet Baochai Dispenses Small Favors to Preserve the Greater Harmony\". " +
      "Tanchun and the others decided on contracting out garden plots, \"pointing out " +
      "several names on the register for the three of them to examine. Ping'er hastened to " +
      "fetch brush and ink\", assigning Old Dame Zhu to the bamboo groves, Old Dame Tian " +
      "to the paddy fields and vegetable plots of Sweet-Rice Village, and Old Dame Ye to " +
      "the fragrant herbs; \"Tanchun and Li Wan made clear instructions to all\", and the " +
      "matrons gladly received their appointments.",
    evaluationCriteria:
      "Full credit: Council Hall in Grand View Garden; on the left of the frame Tanchun " +
      "sits marking the garden register with a vermilion brush while Li Wan sits beside " +
      "her; in the middle of the frame Baochai stands beside the desk advising; on the " +
      "right of the frame Dame Zhu, Dame Tian, and Dame Ye bow to receive their " +
      "assignments (a compositional convention; the left and right of the original text " +
      "are not tested); the vermilion brush dipping and marking, outdoor bamboo shadows, " +
      "and register pages and sleeves loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: An attending doctor or dreaming of Zhen Baoyu in the picture; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-057": {
    coreKey:
      "Under the peach tree Baoyu sits stunned with chin in hand while Zijuan in a black " +
      "satin vest sits testing him, with animated falling petals, vest ribbons, and " +
      "stream ripples",
    groundTruth:
      "Chapter 57, \"Clever Zijuan Tests Rash Jade with Affecting Words; Tender Aunt " +
      "Comforts Simple Pin with Loving Counsel\". Baoyu sat on a rock under a peach tree " +
      "behind Drenched Blossoms Pavilion lost in thought with his chin propped in his " +
      "hand; Zijuan, wearing \"a thin lined jacket of ink-splashed damask with a lined vest " +
      "of black satin outside\", came looking for him and sat beside him, falsely claiming " +
      "that Miss Lin would return to Suzhou next year; \"hearing this, Baoyu felt as if a " +
      "clap of thunder had exploded over his head\". Falling into a delirious stupor comes " +
      "later.",
    evaluationCriteria:
      "Full credit: Beside the rocks under the peach tree behind Drenched Blossoms " +
      "Pavilion; on the left of the frame Baoyu sits stunned on the rock with his chin in " +
      "hand, grief-stricken and dazed; on the right of the frame Zijuan in damask jacket " +
      "and black satin vest sits beside him watching to probe his response; in the " +
      "middle of the frame peach boughs (a compositional convention; the left and right " +
      "of the original text are not tested); the drifting peach petals, vest ribbons and " +
      "robe corners, and shimmering stream ripples loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Sickbed stupor or Daiyu coughing up medicine in the " +
      "picture; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-058": {
    coreKey:
      "Under the green-apricot tree Ouguan weeps over paper ashes while Baoyu shields " +
      "her by tapping away the matron's hand, with animated basin smoke, apricot leaves, " +
      "and robe hems",
    groundTruth:
      "Chapter 58, \"In the Apricot Shade the False Phoenix Weeps for the Absent Phenix; " +
      "through the Madder-Silk Window True Emotion Interprets Passionate Truth\". " +
      "\"Behind the garden rocks stood a large apricot tree whose blossoms had all " +
      "fallen and whose dense foliage cast a verdant shade, bearing numerous small " +
      "apricots the size of peas\"; Ouguan, tears streaming down her face, crouched " +
      "grieving over the ashes of paper money; seized by a matron, \"Baoyu hastily held " +
      "Ouguan back and knocked away the old woman's hand with his cane\" to rescue her.",
    evaluationCriteria:
      "Full credit: Under the large apricot tree laden with pea-sized green apricots " +
      "behind the rocks in late spring; on the left of the frame Ouguan tearfully crouches " +
      "by the earthen basin of paper ashes; in the middle of the frame Baoyu in slippers " +
      "uses his bamboo cane to tap away the matron's hand and shield Ouguan; on the right " +
      "of the frame the old woman recoils in fright (a compositional convention; the " +
      "left and right of the original text are not tested); the basin's blue smoke, green " +
      "leaves and apricots, and sleeves loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Tree covered with blooming pink blossoms or water-splashing quarrel in " +
      "the picture; whole figures drifting; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "honglou-anim-059": {
    coreKey:
      "On Willow Leaf Islet Ying'er sits weaving willows, Chunyan holds a flower basket " +
      "smiling, and Ruiguan holds willows, with animated weeping willows, woven twigs, " +
      "and stream water",
    groundTruth:
      "Chapter 59, \"On Willow Leaf Islet Scolding Ying and Chastising Yan; in the Crimson " +
      "Rue Chamber Summoning Generals and Flying Talismans\". At dawn after the rain " +
      "stopped, Ying'er and Ruiguan walked to Willow Leaf Islet, \"seeing that the willow " +
      "leaves were just budding pale green and the twigs hung like golden threads\", " +
      "snapping twigs and picking blossoms to \"weave an exquisite basket with an arched " +
      "handle\"; after presenting one to Daiyu, she sat back on the rocks to weave again as " +
      "Chunyan came up to chat and admire. Chunyan's aunt and mother arriving to beat her " +
      "and throw the basket into the river come later.",
    evaluationCriteria:
      "Full credit: Willow bank of Willow Leaf Islet after late-spring rain; on the left of " +
      "the frame Ying'er sits on a stream rock threading tender willow twigs and floral " +
      "sprays; in the middle of the frame Chunyan holds an arched willow basket filled " +
      "with blooms, smiling in admiration; on the right of the frame Ruiguan holds willows " +
      "and looks on (a compositional convention; the left and right of the original text " +
      "are not tested); the weeping willow tendrils, twigs in hands, and stream ripples " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: An old woman beating " +
      "Chunyan or throwing the basket into the river in the picture; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-060": {
    coreKey:
      "Beside the couch Fangguan tosses the jasmine packet onto the kang, Jia Huan bows " +
      "to pick it up on paper, and Baoyu smiles, with animated powder packet, robe " +
      "sleeves, and folding fan",
    groundTruth:
      "Chapter 60, \"Jasmine Powder Replaces Rose-Attar Salve; Rose Syrup Attracts Poria " +
      "Cake\". Seeing the rose-attar salve in Fangguan's hands, Jia Huan \"bent his waist, " +
      "pulled a sheet of paper from his boot-top to hold it\", and begged for some; " +
      "\"Fangguan wrapped up some jasmine powder and brought it. When Jia Huan saw it he " +
      "stretched out his hand to take it, but Fangguan promptly tossed it onto the kang. " +
      "Jia Huan had no choice but to pick it up from the kang\". Concubine Zhao's violent " +
      "outburst comes later.",
    evaluationCriteria:
      "Full credit: Beside the warm couch in the main hall of the House of Green Delights; " +
      "on the left of the frame Fangguan in a pink vest casually tosses the powder " +
      "packet onto the kang; in the middle of the frame Jia Huan, holding boot paper, " +
      "bends down reaching to pick it up; on the right of the frame Baoyu sits holding a " +
      "folding fan watching with a smile (a compositional convention; the left and right " +
      "of the original text are not tested); the paper packet sliding, robe sleeves and " +
      "paper sheet, and folding fan gently swaying loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Concubine Zhao rushing in to scuffle or actresses brawling " +
      "in the picture; whole figures drifting; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
};
