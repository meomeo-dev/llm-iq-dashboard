/**
 * 《红楼梦》第 37–48 回候选的英文标签与英文评判标准，由
 * src/core/classics/honglou/ch037-048.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const HONGLOU_CH037_048_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-037": "Ch. 37 · Daiyu Tosses Her Poem Draft on the Desk",
  "honglou-038": "Ch. 38 · Daiyu Angles While Baochai Teases the Fish",
  "honglou-039": "Ch. 39 · Granny Liu Spins Her Tale of Gathering Firewood",
  "honglou-040": "Ch. 40 · Granny Liu Clamps a Pigeon Egg with Heavy Chopsticks",
  "honglou-041": "Ch. 41 · Miaoyu Pours Tea into the Green Jade Cup in the Side Room",
  "honglou-042": "Ch. 42 · Baochai Dictates the Painting List While Baoyu Writes",
  "honglou-043": "Ch. 43 · Baoyu Burns Incense on the Well Curb at the Water-Fairy Temple",
  "honglou-044": "Ch. 44 · Baoyu Offers Powder for Ping'er's Toilette at Green Delights",
  "honglou-045": "Ch. 45 · Baoyu Calls by Night in Bamboo Hat and Straw Rain Cape",
  "honglou-046": "Ch. 46 · Yuanyang Cuts Her Hair with Scissors before the Hall",
  "honglou-047": "Ch. 47 · Liu Xianglian Spurs His Horse to Lure Xue Pan",
  "honglou-048": "Ch. 48 · Daiyu Instructs Xiangling in Poetry at Her Desk",
};

/** 静态与动态候选 id → 英文评判标准 */
export const HONGLOU_CH037_048_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-037": {
    coreKey:
      "Inside Autumn Freshness Studio: the Dream-Sweet incense stick is nearly burned " +
      "out, Daiyu leans against the desk holding a brush and tosses her poem sheet onto " +
      "the desk, Baoyu pauses beside it, and Baochai and Tanchun stand by holding their " +
      "drafts",
    groundTruth:
      "Chapter 37, \"In Autumn Freshness Studio the Crabapple Poetry Club Is Casually " +
      "Formed; at Hengwu Court Chrysanthemum Topics Are Devised by Night\". Yingchun " +
      "orders a maid to light a stick of \"Dream-Sweet incense\"; Tanchun and Baochai " +
      "finish first, and while Baoyu paces the veranda urging her on, \"Daiyu said, " +
      "'Have you all finished?' Speaking, she picked up her brush, dashed it off at a " +
      "stroke, and tossed it to the others\". The white crabapple blossoms are still at " +
      "the House of Green Delights; Li Wan's judging and ranking come later.",
    evaluationCriteria:
      "Full credit: The large marble desk in Autumn Freshness Studio in early autumn, " +
      "with the Dream-Sweet incense in the censer nearly burned out; on the left of the " +
      "frame Daiyu leans against the desk holding a brush and tossing her poem sheet " +
      "onto the desk; in the middle of the frame Baoyu, capless with his braid tied in a " +
      "red silk cord, pauses in admiration; on the right of the frame Baochai and " +
      "Tanchun each hold a poem draft standing beside the desk (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "Potted white crabapple blossoms placed before the desk; Li Wan judging and " +
      "debating the poems; shaved foreheads with hanging queues, Manchu \"two-handle\" " +
      "headdresses, or flowerpot-sole shoes.",
  },
  "honglou-038": {
    coreKey:
      "Inside Lotus Fragrance Anchorage: Daiyu sits on an embroidered stool leaning on " +
      "the railing to angle, Baochai leans over the window sill plucking osmanthus " +
      "petals to entice the fish, Baoyu watches with a smile, and Xiangyun stands before " +
      "the round table",
    groundTruth:
      "Chapter 38, \"Lady Xiaoxiang Wins the Crown in the Chrysanthemum Poems; Lady " +
      "Hengwu Satirizes in Reply with the Crab Verses\". After Grandmother Jia leaves, " +
      "Xiangyun pins the chrysanthemum poem topics to the wall; \"Lin Daiyu had someone " +
      "bring an embroidered stool, sat leaning against the railing, and held a fishing " +
      "rod to angle. Baochai leaned over the window sill plucking osmanthus petals and " +
      "tossing them onto the water, drawing the swimming fish up to nibble at them\", " +
      "while Baoyu chats and laughs beside them.",
    evaluationCriteria:
      "Full credit: Lotus Fragrance Anchorage surrounded by water, with poem topics " +
      "pinned to the wall; on the left of the frame Daiyu sits on an embroidered stool " +
      "leaning on the railing and holding a green bamboo fishing rod to angle; in the " +
      "middle of the frame Baochai leans over the window sill holding a golden osmanthus " +
      "sprig and plucking petals to toss into the water to entice the fish, while Baoyu, " +
      "capless, leans beside Baochai watching with a smile; on the right of the frame " +
      "Xiangyun stands before a round table set with steamed crabs (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "Grandmother Jia at the table or Xifeng and Ping'er smearing crab roe; the " +
      "company holding brushes to tick off topics and write poems; shaved foreheads with " +
      "hanging queues, Manchu \"two-handle\" headdresses, or flowerpot-sole shoes.",
  },
  "honglou-039": {
    coreKey:
      "Grandmother Jia's main room: Granny Liu in clean cotton clothes sits on a wooden " +
      "chair gesturing as she tells her story, Grandmother Jia reclines on her couch, " +
      "Baoyu listens spellbound, and Daiyu smiles faintly",
    groundTruth:
      "Chapter 39, \"A Country Granny Talks Off the Top of Her Head; the Passionate Boy " +
      "Insists on Getting to the Bottom of Things\". Yuanyang first takes Granny Liu to " +
      "bathe and change into clean everyday clothes; in the evening Grandmother Jia " +
      "reclines on her couch while a maid massages her legs, and Granny Liu sits before " +
      "the couch spinning her tale of gathering firewood in the snow, while Baoyu and " +
      "his cousins listen raptly beside them. The fire in the south courtyard stables " +
      "and searching for the temple come later.",
    evaluationCriteria:
      "Full credit: Grandmother Jia's main room lit by lamps on an autumn night; on the " +
      "left of the frame Grandmother Jia reclines smiling on a luohan couch while a maid " +
      "massages her legs; in the middle of the frame Granny Liu in a clean cotton jacket " +
      "and skirt sits on a wooden chair gesturing as she tells her story; on the right " +
      "of the frame Baoyu leans forward listening spellbound, while Daiyu leans on a " +
      "side table with a faint smile (a compositional convention; the left and right of " +
      "the original text are not tested). Deductions: Granny Liu wearing tattered " +
      "patched clothes or with her head covered in chrysanthemum blossoms; the stable " +
      "fire or an actual scene of gathering firewood in the snow shown in the picture; " +
      "shaved foreheads with hanging queues, Manchu \"two-handle\" headdresses, or " +
      "flowerpot-sole shoes.",
  },
  "honglou-040": {
    coreKey:
      "The morning banquet at Dawn Greeneries Hall: Granny Liu, her head stuck full of " +
      "chrysanthemums, grips square gold-inlaid ivory chopsticks to pick up a pigeon " +
      "egg, Grandmother Jia hugs Baoyu laughing, and Xifeng suppresses a laugh",
    groundTruth:
      "Chapter 40, \"The Old Matriarch Twice Feasts in Prospect Garden; Golden Yuanyang " +
      "Thrice Calls the Domino Drinking Game\". Xifeng sticks a whole plate of " +
      "chrysanthemums crisscrossed all over Granny Liu's head; at the banquet in Dawn " +
      "Greeneries Hall, Xifeng and Yuanyang specially set out a pair of old square " +
      "gold-inlaid ivory chopsticks for Granny Liu to pick up pigeon eggs, Baoyu rolls " +
      "into Grandmother Jia's lap laughing, and \"with great difficulty she managed to " +
      "pinch one up and craned her neck to eat it\". The egg slipping away, changing " +
      "chopsticks, and calling the domino drinking game come later.",
    evaluationCriteria:
      "Full credit: The open hall of Dawn Greeneries Hall; in the middle of the frame " +
      "Granny Liu, her head stuck full of multicolored chrysanthemums, grips square " +
      "gold-inlaid ivory chopsticks with both hands and cranes her neck to pick up a " +
      "pigeon egg; on the left of the frame Grandmother Jia, with a red chrysanthemum " +
      "at her temple, leans back hugging the laughing Baoyu in her lap; on the right of " +
      "the frame Xifeng stands beside the table holding a handkerchief and suppressing " +
      "a laugh (a compositional convention; the left and right of the original text are " +
      "not tested). Deductions: Granny Liu without chrysanthemums on her head or wearing " +
      "a tattered felt hat; the gold-inlaid ivory chopsticks drawn as ordinary bamboo or " +
      "wooden chopsticks; the domino drinking game or painted barges in the picture; " +
      "Manchu \"two-handle\" headdresses or shaved foreheads with hanging queues.",
  },
  "honglou-041": {
    coreKey:
      "The side room of Green Lattice Nunnery: Miaoyu, keeping her hair in a Taoist bun, " +
      "holds a pot to pour tea into the green jade cup for Baoyu, Baochai sits on the " +
      "couch holding the banpao goblet, and Daiyu holds the rhino-horn cup",
    groundTruth:
      "Chapter 41, \"At Green Lattice Nunnery Tea Made from Plum-Blossom Snow Is " +
      "Savoringly Tasted; at the House of Green Delights a Calamitous Encounter with a " +
      "Mother Locust\". Miaoyu leads Baochai and Daiyu into the side room while Baoyu " +
      "follows behind; \"Baochai sat on the couch, and Daiyu sat on Miaoyu's meditation " +
      "mat\", and Miaoyu fans boiling water at the stove to brew tea, handing the " +
      "banpao gourd-jasper goblet to Baochai and the spotted rhino-horn cup to Daiyu, " +
      "and \"still poured tea for Baoyu into that green jade cup from which she herself " +
      "ordinarily drank\". Granny Liu lying drunk at the House of Green Delights comes " +
      "later.",
    evaluationCriteria:
      "Full credit: Brewing tea on a clay stove in the side room of Green Lattice " +
      "Nunnery; in the middle of the frame Miaoyu, an unshorn nun with her hair in a " +
      "bun and wearing a paddy-field blue satin vest, holds a teapot to pour tea into " +
      "the green jade cup, while Baoyu, capless, stands beside the table bowing to " +
      "receive the cup; on the left of the frame Baochai sits on a bamboo couch holding " +
      "the banpao goblet; on the right of the frame Daiyu sits on a rush meditation mat " +
      "holding the spotted rhino-horn cup (a compositional convention; the left and " +
      "right of the original text are not tested). Deductions: Miaoyu drawn as a " +
      "bald-shaven Buddhist nun; Granny Liu present or lying drunk on a bed in the " +
      "picture; shaved foreheads with hanging queues, Manchu \"two-handle\" headdresses, " +
      "or flowerpot-sole shoes.",
  },
  "honglou-042": {
    coreKey:
      "The main room of Paddy-Sweet Cottage: Baochai stands beside a narrow table " +
      "dictating a list of painting supplies, Baoyu bends over the desk writing with a " +
      "brush, Daiyu covers her mouth laughing, and Xichun rests her chin in her hands " +
      "listening",
    groundTruth:
      "Chapter 42, \"Lady Hengwu with Orchid Words Resolves Doubts and Foibles; Lady " +
      "Xiaoxiang with Graceful Jest Supplies the Lingering Note\". Gathering at " +
      "Paddy-Sweet Cottage to discuss Xichun's painting of Prospect Garden, Baochai " +
      "says, \"I will dictate, and Cousin Baoyu can write it down\", and Baoyu prepares " +
      "brush and inkstone and picks up the brush to write; Daiyu teases, \"I will ask " +
      "for an iron wok for you, so you can stir-fry the pigments to eat\". Procuring the " +
      "painting materials and starting the scroll come later.",
    evaluationCriteria:
      "Full credit: The large desk in the main room of Paddy-Sweet Cottage; on the left " +
      "of the frame Baochai stands beside a table calmly dictating; in the middle of the " +
      "frame Baoyu, capless, bends over the desk holding a brush to write on letter " +
      "paper; on the right of the frame Daiyu stands to one side covering her mouth " +
      "with a light laugh, while the young girl Xichun sits on an embroidered stool " +
      "resting her chin in her hands and listening attentively (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "The room cluttered with large pigment vats, iron woks, or an unrolled painting " +
      "scroll already being painted; Baochai pinning Daiyu down on the kang; shaved " +
      "foreheads with hanging queues, Manchu \"two-handle\" headdresses, or " +
      "flowerpot-sole shoes.",
  },
  "honglou-043": {
    coreKey:
      "The ancient well curb at the Water-Fairy Temple: Baoyu in a pure white robe " +
      "stands by the well curb burning incense in a small censer and bowing in tears, " +
      "while Mingyan stands to one side keeping watch",
    groundTruth:
      "Chapter 43, \"For Idle Amusement Gold Is Pooled to Celebrate a Birthday; for " +
      "Unending Love Earth Is Briefly Scooped as Incense\". Early on the morning of the " +
      "second day of the ninth month, Baoyu dresses entirely in plain white, rides out " +
      "the north gate to the Water-Fairy Temple, borrows only an incense burner, and " +
      "goes with Mingyan to the back courtyard, where \"together they came to the well " +
      "curb and set the censer down. Baoyu took out the incense, lit it, and made a " +
      "half-bow with tears in his eyes\". Mingyan kowtowing on his behalf and returning " +
      "to the mansion for the birthday feast come later.",
    evaluationCriteria:
      "Full credit: The bluestone ancient well curb in the back courtyard of the " +
      "Water-Fairy Temple in late autumn, with a small censer set on the stone rim; in " +
      "the middle-right of the frame the youth Baoyu, wearing a pure white robe with a " +
      "white silk cord on his braid, stands by the well curb burning incense and making " +
      "a bow in tears; on the left of the frame the page Mingyan in a short cloth robe " +
      "and soft cap stands with hands at his sides keeping watch (a compositional " +
      "convention; the left and right of the original text are not tested). Deductions: " +
      "Mingyan kneeling and kowtowing; an altar table with candles, burning paper " +
      "money, a statue of the Goddess of the Luo River, or nuns; Baoyu wearing a red " +
      "robe and gold crown; shaved foreheads with hanging queues or official hat " +
      "finials.",
  },
  "honglou-044": {
    coreKey:
      "Before the dressing table at the House of Green Delights: Ping'er sits on an " +
      "embroidered stool fixing her makeup before the mirror, Baoyu stands beside her " +
      "opening a Xuande porcelain box to hand her a hosta-flower powder stick, and " +
      "Xiren watches quietly with a smile",
    groundTruth:
      "Chapter 44, \"An Unexpected Turn of Events Makes Xifeng Spill Vinegar; Pleasantly " +
      "Surprised, Ping'er Repairs Her Toilette\". After suffering a wrong, Ping'er is " +
      "persuaded to come into the House of Green Delights to change her clothes and " +
      "wash her face; \"Baoyu hurried over to the dressing table, opened a Xuande kiln " +
      "porcelain box inside which lay a row of ten hosta-flower powder sticks, picked " +
      "one out, and handed it to Ping'er\", and also shows her how to use the rose " +
      "rouge in a white jade box and clips a twin-flowered autumn orchid to pin at her " +
      "temple.",
    evaluationCriteria:
      "Full credit: The dressing table in the inner room of the House of Green Delights " +
      "set with a bronze mirror and white jade box, and a side table holding a potted " +
      "twin-flowered autumn orchid; in the middle of the frame Ping'er sits on an " +
      "embroidered stool before the mirror repairing her makeup; on the right of the " +
      "frame the youth Baoyu, capless, stands beside the dressing table opening a Xuande " +
      "porcelain box and handing out a hosta-flower powder stick; on the left of the " +
      "frame Xiren stands on the other side watching quietly with a smile (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested). Deductions: Jia Lian or Xifeng present; swords or traces of a brawl in " +
      "the picture; Manchu \"two-handle\" headdresses, flowerpot-sole shoes, or shaved " +
      "foreheads with hanging queues.",
  },
  "honglou-045": {
    coreKey:
      "By lamplight at the Naiad's House on an autumn rain night: Daiyu sits before her " +
      "desk resting her hand on her poem sheet and looking back, while Baoyu in a large " +
      "bamboo hat and straw rain cape holds up a lantern and shades the light with a " +
      "smile",
    groundTruth:
      "Chapter 45, \"Sworn Sisters Open Their Hearts in Sworn Sisterly Words; on a " +
      "Windy and Rainy Evening Melancholy Verses on Wind and Rain Are Composed\". On an " +
      "autumn rain night Daiyu finishes writing \"Wind and Rain by the Autumn Window\" " +
      "and sets down her brush; \"she saw Baoyu wearing a large bamboo hat on his head " +
      "and a straw rain cape over his shoulders\", Daiyu laughs and calls him a " +
      "\"fisherman\", and Baoyu \"raised the lantern with one hand and shaded the light " +
      "with the other, shining it toward Daiyu's face to take a look\". Taking off the " +
      "hat and rain cape and gifting the glass embroidered-ball lantern come later.",
    evaluationCriteria:
      "Full credit: The study desk at the Naiad's House on an autumn rain night lit by a " +
      "short candlestick, with rain beating on bamboo and plantains outside the window; " +
      "on the left of the frame Daiyu sits before her desk with her hand on her poem " +
      "sheet, looking back with a smile; on the right of the frame Baoyu wears a large " +
      "bamboo hat and fine straw rain cape, holding up a lantern with one hand and " +
      "shading the light with the other to look at her (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: Baoyu holding an " +
      "umbrella, having already taken off the rain cape and hat, or pulling out a " +
      "pocket watch; Daiyu burning her poem drafts; shaved foreheads with hanging " +
      "queues, Manchu \"two-handle\" headdresses, or flowerpot-sole shoes.",
  },
  "honglou-046": {
    coreKey:
      "Before the hall of Grandmother Jia's main room: Yuanyang kneels on the floor " +
      "pulling her hair open with her left hand and cutting it with iron scissors in her " +
      "right, Grandmother Jia sits on her couch in shock and anger, and Lady Wang stands " +
      "beside the couch stunned",
    groundTruth:
      "Chapter 46, \"An Awkward Person Cannot Avoid an Awkward Business; the Mandarin " +
      "Duck Girl Swears Off a Mandarin Duck Match\". Yuanyang pulls her sister-in-law " +
      "before Grandmother Jia to kneel and swear her vow: \"as soon as she came in she " +
      "had hidden a pair of scissors up her sleeve, and as she spoke she spread her " +
      "hair open with her left hand and began to cut it with her right\"; Grandmother " +
      "Jia trembles all over with rage, and Lady Wang dares not utter a word. The old " +
      "women snatching the scissors and coiling her hair up come later.",
    evaluationCriteria:
      "Full credit: Before the hall of Grandmother Jia's main room; in the middle of the " +
      "frame Yuanyang, wearing a lotus-root-colored silk jacket, a blue satin vest with " +
      "piped edges, and a water-green skirt, kneels on the floor pulling her long hair " +
      "loose with her left hand and cutting it with iron scissors in her right; on the " +
      "left of the frame Grandmother Jia sits on her luohan couch in shock and anger; on " +
      "the right of the frame Lady Wang stands in attendance beside the couch bowing her " +
      "head in dismay (a compositional convention; the left and right of the original " +
      "text are not tested). Deductions: Jia She or Jia Lian present; the old women " +
      "having already snatched away the scissors; slitting the throat or bloody injury " +
      "scenes; Manchu \"two-handle\" headdresses or flowerpot-sole shoes.",
  },
  "honglou-047": {
    coreKey:
      "By the reed pond outside the north gate: Liu Xianglian rides a fine horse " +
      "pointing with his whip toward the reed pond and looking back with a cold smile, " +
      "and Xue Pan rides a tall horse close behind with a grin, neither dismounted",
    groundTruth:
      "Chapter 47, \"The Foolish Bully Flirts and Suffers a Bitter Beating; the " +
      "Cold-Hearted Youth Fears Trouble and Flees from Home\". Liu Xianglian lures Xue " +
      "Pan out the north gate: \"Xianglian smiled and said, 'Ride on quickly; if anyone " +
      "sees us and follows, it will be inconvenient.' Speaking, he gave his horse its " +
      "head and rode ahead, and Xue Pan followed closely behind\", where a stretch of " +
      "reed ponds lies ahead. Dismounting to swear an oath and the thrashing come later.",
    evaluationCriteria:
      "Full credit: A country dirt road north of the city in late autumn, with white " +
      "reed ponds in the distance; on the left of the frame the handsome Liu Xianglian " +
      "in a short riding tunic rides a fine horse ahead, pointing forward with his whip " +
      "and looking back with a cold smile; on the right of the frame Xue Pan in a " +
      "rich brocade robe rides a tall horse leaning forward and following closely with a " +
      "grin (a compositional convention; the left and right of the original text are not " +
      "tested). Deductions: The two having already dismounted, kneeling, or scenes of " +
      "whipping and wallowing in the mud pond; Liu Xianglian drawn as a painted " +
      "theatrical dan role; shaved foreheads with hanging queues or official hats with " +
      "finials.",
  },
  "honglou-048": {
    coreKey:
      "By lamplight at the Naiad's House: Daiyu sits behind her desk pointing out a " +
      "vermilion-circled poetry volume, and Xiangling, with a rouge mark between her " +
      "brows, bows to receive the Complete Works of Wang Mojie",
    groundTruth:
      "Chapter 48, \"A Wayward Man, Misled by Passion, Thinks of Traveling for His Art; " +
      "an Elegance-Loving Girl, Gathering in Elegance, Painstakingly Chants Verse\". " +
      "Xiangling enters the garden and comes to the Naiad's House to study poetry under " +
      "Daiyu; after discussing how \"conception comes first of all\", Daiyu \"told " +
      "Zijuan to bring Wang Youcheng's five-syllable regulated verses and handed them " +
      "to Xiangling, saying, 'Just read the ones marked with red circles, which are my " +
      "selections'\". Returning to her room to study and chanting painstakingly by the " +
      "pond come later.",
    evaluationCriteria:
      "Full credit: The study at the Naiad's House lit by lamps, with green bamboo " +
      "outside the window; on the left of the frame Daiyu sits behind her desk pointing " +
      "to a vermilion-circled poetry volume; on the right of the frame Xiangling, with a " +
      "rouge mark between her brows, stands before the desk bowing to receive the " +
      "thread-bound Complete Works of Wang Mojie with both hands, while Zijuan attends " +
      "beside the desk (a compositional convention; the left and right of the original " +
      "text are not tested). Deductions: Xiangling scratching at the earth by the rocks " +
      "and pond while chanting verse; Xue Pan or Xia Jingui in the picture; modern " +
      "hardcover books; Manchu \"two-handle\" headdresses or flowerpot-sole shoes.",
  },
  "honglou-anim-037": {
    coreKey:
      "Daiyu leaning against the desk holding a brush and tossing her poem sheet, Baoyu " +
      "pausing beside it, and Baochai and Tanchun standing by, with animated Dream-Sweet " +
      "incense smoke, plantain and parasol leaves, and poem sheet",
    groundTruth:
      "Chapter 37, \"In Autumn Freshness Studio the Crabapple Poetry Club Is Casually " +
      "Formed; at Hengwu Court Chrysanthemum Topics Are Devised by Night\". Yingchun " +
      "orders a maid to light a stick of \"Dream-Sweet incense\"; Tanchun and Baochai " +
      "finish first, and while Baoyu paces the veranda urging her on, \"Daiyu said, " +
      "'Have you all finished?' Speaking, she picked up her brush, dashed it off at a " +
      "stroke, and tossed it to the others\". The white crabapple blossoms are still at " +
      "the House of Green Delights; Li Wan's judging and ranking come later.",
    evaluationCriteria:
      "Full credit: Beside the large desk in Autumn Freshness Studio, on the left of the " +
      "frame Daiyu leans against the desk holding a brush and tossing her poem sheet " +
      "onto the desk; in the middle of the frame Baoyu, capless, pauses beside it; on " +
      "the right of the frame Baochai and Tanchun stand by the desk holding their drafts " +
      "(a compositional convention; the left and right of the original text are not " +
      "tested); the Dream-Sweet incense smoke, the plantain and parasol leaves, and the " +
      "corners of the poem sheet loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Potted white crabapple blossoms placed before the desk; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-038": {
    coreKey:
      "Daiyu leaning on the railing to angle, Baochai plucking osmanthus petals to " +
      "entice the fish, Baoyu watching with a smile, and Xiangyun standing before the " +
      "table, with animated swimming fish and ripples, fishing line, and poem topic " +
      "slips",
    groundTruth:
      "Chapter 38, \"Lady Xiaoxiang Wins the Crown in the Chrysanthemum Poems; Lady " +
      "Hengwu Satirizes in Reply with the Crab Verses\". After Grandmother Jia leaves, " +
      "Xiangyun pins the chrysanthemum poem topics to the wall; \"Lin Daiyu had someone " +
      "bring an embroidered stool, sat leaning against the railing, and held a fishing " +
      "rod to angle. Baochai leaned over the window sill plucking osmanthus petals and " +
      "tossing them onto the water, drawing the swimming fish up to nibble at them\", " +
      "while Baoyu chats and laughs beside them.",
    evaluationCriteria:
      "Full credit: Lotus Fragrance Anchorage surrounded by water; on the left of the " +
      "frame Daiyu leans on the railing holding a rod to angle; in the middle of the " +
      "frame Baochai leans over the window sill plucking osmanthus petals to toss into " +
      "the water to entice the fish, while Baoyu watches with a smile beside her; on " +
      "the right of the frame Xiangyun stands before the round table (a compositional " +
      "convention; the left and right of the original text are not tested); the falling " +
      "petals, swimming fish, and water ripples, the fishing line, and the poem topic " +
      "paper slips loop smoothly, driven by SMIL or inline CSS. Deductions: The company " +
      "holding brushes to write poems; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-039": {
    coreKey:
      "Granny Liu in clean cotton clothes sitting on a chair telling her story, " +
      "Grandmother Jia reclining on her couch, and Baoyu listening spellbound, with " +
      "animated candle flame, gesturing hands, and leg-massaging motion",
    groundTruth:
      "Chapter 39, \"A Country Granny Talks Off the Top of Her Head; the Passionate Boy " +
      "Insists on Getting to the Bottom of Things\". Yuanyang first takes Granny Liu to " +
      "bathe and change into clean everyday clothes; in the evening Grandmother Jia " +
      "reclines on her couch while a maid massages her legs, and Granny Liu sits before " +
      "the couch spinning her tale of gathering firewood in the snow, while Baoyu and " +
      "his cousins listen raptly beside them. The fire in the south courtyard stables " +
      "and searching for the temple come later.",
    evaluationCriteria:
      "Full credit: Grandmother Jia's main room on an autumn night; on the left of the " +
      "frame Grandmother Jia reclines smiling on a luohan couch while a maid massages " +
      "her legs; in the middle of the frame Granny Liu in clean cotton clothes sits on a " +
      "chair telling her story; on the right of the frame Baoyu leans forward listening " +
      "spellbound, while Daiyu rests her chin in her hand with a faint smile (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the candle flame, the gesturing hands, and the leg-massaging hands loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Granny Liu wearing tattered " +
      "clothes or with chrysanthemums in her hair; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-040": {
    coreKey:
      "Granny Liu with her head stuck full of chrysanthemums gripping square gold-inlaid " +
      "ivory chopsticks to pick up a pigeon egg and Grandmother Jia hugging Baoyu " +
      "laughing, with animated pigeon egg at the chopstick tips, chrysanthemums, and " +
      "bamboo leaves",
    groundTruth:
      "Chapter 40, \"The Old Matriarch Twice Feasts in Prospect Garden; Golden Yuanyang " +
      "Thrice Calls the Domino Drinking Game\". Xifeng sticks a whole plate of " +
      "chrysanthemums crisscrossed all over Granny Liu's head; at the banquet in Dawn " +
      "Greeneries Hall, Xifeng and Yuanyang specially set out a pair of old square " +
      "gold-inlaid ivory chopsticks for Granny Liu to pick up pigeon eggs, Baoyu rolls " +
      "into Grandmother Jia's lap laughing, and \"with great difficulty she managed to " +
      "pinch one up and craned her neck to eat it\". The egg slipping away, changing " +
      "chopsticks, and calling the domino drinking game come later.",
    evaluationCriteria:
      "Full credit: The open hall of Dawn Greeneries Hall; in the middle of the frame " +
      "Granny Liu, her head stuck full of chrysanthemums, grips square gold-inlaid ivory " +
      "chopsticks with both hands and cranes her neck to pick up a pigeon egg; on the " +
      "left of the frame Grandmother Jia hugs Baoyu in her lap laughing; on the right of " +
      "the frame Xifeng holds a handkerchief suppressing a laugh (a compositional " +
      "convention; the left and right of the original text are not tested); the pigeon " +
      "egg at the chopstick tips, the chrysanthemums on her head, and the bamboo leaves " +
      "outside the hall loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Ordinary bamboo or wooden chopsticks; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-041": {
    coreKey:
      "Miaoyu keeping her hair in a bun and holding a pot to pour tea into the green " +
      "jade cup for Baoyu, Baochai holding the banpao goblet, and Daiyu holding the " +
      "rhino-horn cup, with animated tea stream, stove steam, and bamboo shadows",
    groundTruth:
      "Chapter 41, \"At Green Lattice Nunnery Tea Made from Plum-Blossom Snow Is " +
      "Savoringly Tasted; at the House of Green Delights a Calamitous Encounter with a " +
      "Mother Locust\". Miaoyu leads Baochai and Daiyu into the side room while Baoyu " +
      "follows behind; \"Baochai sat on the couch, and Daiyu sat on Miaoyu's meditation " +
      "mat\", and Miaoyu fans boiling water at the stove to brew tea, handing the " +
      "banpao gourd-jasper goblet to Baochai and the spotted rhino-horn cup to Daiyu, " +
      "and \"still poured tea for Baoyu into that green jade cup from which she herself " +
      "ordinarily drank\". Granny Liu lying drunk at the House of Green Delights comes " +
      "later.",
    evaluationCriteria:
      "Full credit: The side room of Green Lattice Nunnery; in the middle of the frame " +
      "Miaoyu, keeping her hair in a bun, holds a teapot to pour tea into the green " +
      "jade cup, while Baoyu stands beside the table to receive the cup; on the left of " +
      "the frame Baochai sits on a bamboo couch holding the banpao goblet; on the right " +
      "of the frame Daiyu sits on a rush meditation mat holding the spotted rhino-horn " +
      "cup (a compositional convention; the left and right of the original text are not " +
      "tested); the poured tea stream and rising vapor, the stove fire and white steam, " +
      "and the bamboo shadows outside the window loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Miaoyu with a shaved bald head; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-042": {
    coreKey:
      "Baochai standing beside a table dictating the painting list, Baoyu bending over " +
      "the desk writing, Daiyu laughing, and Xichun resting her chin in her hands " +
      "listening, with animated brush strokes, tea steam, and bamboo leaves",
    groundTruth:
      "Chapter 42, \"Lady Hengwu with Orchid Words Resolves Doubts and Foibles; Lady " +
      "Xiaoxiang with Graceful Jest Supplies the Lingering Note\". Gathering at " +
      "Paddy-Sweet Cottage to discuss Xichun's painting of Prospect Garden, Baochai " +
      "says, \"I will dictate, and Cousin Baoyu can write it down\", and Baoyu prepares " +
      "brush and inkstone and picks up the brush to write; Daiyu teases, \"I will ask " +
      "for an iron wok for you, so you can stir-fry the pigments to eat\". Procuring the " +
      "painting materials and starting the scroll come later.",
    evaluationCriteria:
      "Full credit: The large desk in the main room of Paddy-Sweet Cottage; on the left " +
      "of the frame Baochai stands beside a table dictating; in the middle of the frame " +
      "Baoyu, capless, bends over the desk holding a brush to write; on the right of " +
      "the frame Daiyu covers her mouth laughing, while Xichun sits on an embroidered " +
      "stool resting her chin in her hands and listening (a compositional convention; " +
      "the left and right of the original text are not tested); the moving brush tip, " +
      "the tea steam, and the bamboo leaves outside the window loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: The room cluttered with pigment vats or iron " +
      "woks; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-043": {
    coreKey:
      "Baoyu in a pure white robe standing by the well curb burning incense in a small " +
      "censer and bowing in tears while Mingyan keeps watch, with animated incense " +
      "smoke, robe hem and white silk cord, and autumn grass",
    groundTruth:
      "Chapter 43, \"For Idle Amusement Gold Is Pooled to Celebrate a Birthday; for " +
      "Unending Love Earth Is Briefly Scooped as Incense\". Early on the morning of the " +
      "second day of the ninth month, Baoyu dresses entirely in plain white, rides out " +
      "the north gate to the Water-Fairy Temple, borrows only an incense burner, and " +
      "goes with Mingyan to the back courtyard, where \"together they came to the well " +
      "curb and set the censer down. Baoyu took out the incense, lit it, and made a " +
      "half-bow with tears in his eyes\". Mingyan kowtowing on his behalf and returning " +
      "to the mansion for the birthday feast come later.",
    evaluationCriteria:
      "Full credit: The ancient well curb in the back courtyard of the Water-Fairy " +
      "Temple with a small censer set on it; in the middle-right of the frame Baoyu in a " +
      "pure white robe stands by the well curb burning incense and bowing in tears; on " +
      "the left of the frame Mingyan stands with hands at his sides keeping watch (a " +
      "compositional convention; the left and right of the original text are not " +
      "tested); the censer smoke, the robe hem and white silk cord, and the autumn grass " +
      "and falling leaves loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Mingyan kneeling or an altar table with burning paper money; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-044": {
    coreKey:
      "Ping'er fixing her makeup before the mirror, Baoyu standing beside her opening a " +
      "Xuande porcelain box to hand her a hosta-flower powder stick, and Xiren watching " +
      "quietly, with animated autumn orchid, mirror gleam, and bamboo shadows",
    groundTruth:
      "Chapter 44, \"An Unexpected Turn of Events Makes Xifeng Spill Vinegar; Pleasantly " +
      "Surprised, Ping'er Repairs Her Toilette\". After suffering a wrong, Ping'er is " +
      "persuaded to come into the House of Green Delights to change her clothes and " +
      "wash her face; \"Baoyu hurried over to the dressing table, opened a Xuande kiln " +
      "porcelain box inside which lay a row of ten hosta-flower powder sticks, picked " +
      "one out, and handed it to Ping'er\", and also shows her how to use the rose " +
      "rouge in a white jade box and clips a twin-flowered autumn orchid to pin at her " +
      "temple.",
    evaluationCriteria:
      "Full credit: Before the dressing table at the House of Green Delights; in the " +
      "middle of the frame Ping'er sits on an embroidered stool fixing her makeup before " +
      "the mirror; on the right of the frame Baoyu stands beside the dressing table " +
      "opening a Xuande porcelain box to hand her a hosta-flower powder stick; on the " +
      "left of the frame Xiren watches quietly with a smile (a compositional convention; " +
      "the left and right of the original text are not tested); the twin-flowered " +
      "autumn orchid leaves and stems, the bronze mirror gleam, and the bamboo shadows " +
      "on the window gauze loop smoothly, driven by SMIL or inline CSS. Deductions: Jia " +
      "Lian, Xifeng, or swords in the picture; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-045": {
    coreKey:
      "Daiyu resting her hand on her poem sheet and looking back by lamplight, and Baoyu " +
      "in a large bamboo hat and straw rain cape holding up a lantern and shading the " +
      "light, with animated wind and rain on bamboo and plantains, candle flame, and " +
      "water droplets",
    groundTruth:
      "Chapter 45, \"Sworn Sisters Open Their Hearts in Sworn Sisterly Words; on a " +
      "Windy and Rainy Evening Melancholy Verses on Wind and Rain Are Composed\". On an " +
      "autumn rain night Daiyu finishes writing \"Wind and Rain by the Autumn Window\" " +
      "and sets down her brush; \"she saw Baoyu wearing a large bamboo hat on his head " +
      "and a straw rain cape over his shoulders\", Daiyu laughs and calls him a " +
      "\"fisherman\", and Baoyu \"raised the lantern with one hand and shaded the light " +
      "with the other, shining it toward Daiyu's face to take a look\". Taking off the " +
      "hat and rain cape and gifting the glass embroidered-ball lantern come later.",
    evaluationCriteria:
      "Full credit: The study at the Naiad's House on an autumn rain night; on the left " +
      "of the frame Daiyu sits before her desk with her hand on her poem sheet looking " +
      "back; on the right of the frame Baoyu wears a large bamboo hat and fine straw " +
      "rain cape, holding up a lantern with one hand and shading the light with the " +
      "other to look at her (a compositional convention; the left and right of the " +
      "original text are not tested); the wind and rain on bamboo and plantains outside " +
      "the window, the lamp and candle flames, and the water droplets on the rain cape " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Baoyu holding an " +
      "umbrella or having taken off the rain cape and hat; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-046": {
    coreKey:
      "Yuanyang kneeling before the hall pulling her hair and cutting it with scissors, " +
      "Grandmother Jia sitting on her couch in shock and anger, and Lady Wang stunned, " +
      "with animated cold glint of the iron scissors, falling locks of hair, and door " +
      "curtain",
    groundTruth:
      "Chapter 46, \"An Awkward Person Cannot Avoid an Awkward Business; the Mandarin " +
      "Duck Girl Swears Off a Mandarin Duck Match\". Yuanyang pulls her sister-in-law " +
      "before Grandmother Jia to kneel and swear her vow: \"as soon as she came in she " +
      "had hidden a pair of scissors up her sleeve, and as she spoke she spread her " +
      "hair open with her left hand and began to cut it with her right\"; Grandmother " +
      "Jia trembles all over with rage, and Lady Wang dares not utter a word. The old " +
      "women snatching the scissors and coiling her hair up come later.",
    evaluationCriteria:
      "Full credit: Before the hall of Grandmother Jia's main room; in the middle of the " +
      "frame Yuanyang, in a lotus-root-colored silk jacket and blue satin vest with " +
      "piped edges, kneels on the floor pulling her hair with her left hand and cutting " +
      "it with iron scissors in her right; on the left of the frame Grandmother Jia sits " +
      "on her luohan couch in shock and anger; on the right of the frame Lady Wang " +
      "stands beside the couch stunned (a compositional convention; the left and right " +
      "of the original text are not tested); the cold glint on the iron scissors, the " +
      "falling severed locks of hair, and the door curtain loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: The old women snatching the scissors or bloody scenes; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "honglou-anim-047": {
    coreKey:
      "Liu Xianglian on horseback pointing with his whip toward the reed pond and " +
      "looking back with a cold smile, and Xue Pan riding close behind with a grin, with " +
      "animated reed plumes and willow branches, horse manes and robe sashes, and autumn " +
      "dust",
    groundTruth:
      "Chapter 47, \"The Foolish Bully Flirts and Suffers a Bitter Beating; the " +
      "Cold-Hearted Youth Fears Trouble and Flees from Home\". Liu Xianglian lures Xue " +
      "Pan out the north gate: \"Xianglian smiled and said, 'Ride on quickly; if anyone " +
      "sees us and follows, it will be inconvenient.' Speaking, he gave his horse its " +
      "head and rode ahead, and Xue Pan followed closely behind\", where a stretch of " +
      "reed ponds lies ahead. Dismounting to swear an oath and the thrashing come later.",
    evaluationCriteria:
      "Full credit: By the reed pond on a country road north of the city in late autumn; " +
      "on the left of the frame Liu Xianglian in a short riding tunic rides a fine " +
      "horse, pointing forward with his whip and looking back with a cold smile; on the " +
      "right of the frame Xue Pan in a brocade robe rides a tall horse leaning forward " +
      "and following closely with a grin (a compositional convention; the left and " +
      "right of the original text are not tested); the reed plumes and willow branches, " +
      "the horse manes and robe sashes, and the autumn dust under the hooves loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Dismounting or scenes of " +
      "beating and mud in the picture; horses and figures translating as a whole; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-048": {
    coreKey:
      "Daiyu sitting behind her desk pointing out a vermilion-circled poetry volume and " +
      "Xiangling with a rouge mark between her brows bowing to receive the Complete " +
      "Works of Wang Mojie, with animated candle flame, bamboo shadows, and book pages",
    groundTruth:
      "Chapter 48, \"A Wayward Man, Misled by Passion, Thinks of Traveling for His Art; " +
      "an Elegance-Loving Girl, Gathering in Elegance, Painstakingly Chants Verse\". " +
      "Xiangling enters the garden and comes to the Naiad's House to study poetry under " +
      "Daiyu; after discussing how \"conception comes first of all\", Daiyu \"told " +
      "Zijuan to bring Wang Youcheng's five-syllable regulated verses and handed them " +
      "to Xiangling, saying, 'Just read the ones marked with red circles, which are my " +
      "selections'\". Returning to her room to study and chanting painstakingly by the " +
      "pond come later.",
    evaluationCriteria:
      "Full credit: The study at the Naiad's House lit by lamps; on the left of the " +
      "frame Daiyu sits behind her desk pointing to a vermilion-circled poetry volume; " +
      "on the right of the frame Xiangling, with a rouge mark between her brows, bows " +
      "to receive the thread-bound Complete Works of Wang Mojie with both hands, while " +
      "Zijuan attends beside the desk (a compositional convention; the left and right " +
      "of the original text are not tested); the candle flame, the bamboo shadows on the " +
      "window paper, and the book pages loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Scratching at the earth by the rocks in the picture; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
};
