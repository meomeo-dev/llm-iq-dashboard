/**
 * 《西游记》第 1–20 回候选的英文标签与英文评判标准，由 src/core/classics/xiyou/ch001-010.ts、
 * ch011-020.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const XIYOU_CH001_020_LABELS_EN: Readonly<Record<string, string>> = {
  "xiyou-001": "Ch. 1 · The Stone Monkey Leaps into the Waterfall",
  "xiyou-002": "Ch. 2 · Receiving the Way at the Bedside in the Third Watch",
  "xiyou-003": "Ch. 3 · Taking the Treasure from the Dragon Palace",
  "xiyou-004": "Ch. 4 · Three Heads and Six Arms Against Nezha",
  "xiyou-005": "Ch. 5 · Picking Peaches in the Immortal Peach Orchard",
  "xiyou-006": "Ch. 6 · Erlang Sees Through the Earth God Shrine",
  "xiyou-007": "Ch. 7 · In the Palm of the Tathagata",
  "xiyou-008": "Ch. 8 · Huian Blocks the Monster at Flowing Sands River",
  "xiyou-009": "Ch. 9 · Elder Faming Rescues the Infant at the Riverside",
  "xiyou-010": "Ch. 10 · Wei Zheng Dreams over a Game of Go",
  "xiyou-011": "Ch. 11 · Checking the Register in Senluo Hall",
  "xiyou-012": "Ch. 12 · Guanyin Manifests at Huasheng Temple",
  "xiyou-013": "Ch. 13 · Liu Boqin Fights the Tiger",
  "xiyou-014": "Ch. 14 · First Meeting at Two Frontier Mountain",
  "xiyou-015": "Ch. 15 · The Horse Swallowed at Eagle Grief Stream",
  "xiyou-016": "Ch. 16 · Night Fire at Guanyin Temple",
  "xiyou-017": "Ch. 17 · First Battle Before Black Wind Cave",
  "xiyou-018": "Ch. 18 · The Back Quarters at Gao Village",
  "xiyou-019": "Ch. 19 · The Crow's Nest Chan Master on Pagoda Mountain",
  "xiyou-020": "Ch. 20 · Bajie Charges First on Yellow Wind Ridge",
};

/** 静态与动态候选 id → 英文评判标准 */
export const XIYOU_CH001_020_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "xiyou-001": {
    coreKey:
      "The Stone Monkey leaps into the waterfall with eyes shut; no clothing, headgear, or " +
      "weapon; the bridge and stone tablet behind the water curtain stay hidden",
    groundTruth:
      "Chapter 1, \"The Divine Root Conceives and the Source Flows Forth; Cultivating the " +
      "Mind's Nature, the Great Way Is Born\". The monkeys agree that whoever can enter the " +
      "waterfall and find its source will be honored as king; the Stone Monkey \"shut his " +
      "eyes, crouched down, and with one leap sprang straight into the waterfall\". He is not " +
      "yet king: monkey-shaped, with no clothing, headgear, or weapon. The waterfall is like " +
      "a \"white rainbow\" and \"snowy waves\"; the iron-plate bridge and the stone tablet lie " +
      "inside the water curtain and cannot be seen from outside.",
    evaluationCriteria:
      "Full credit: The waterfall is the main subject; the Stone Monkey leaps into the water " +
      "curtain, monkey-shaped and without clothing or headgear, far smaller than the " +
      "waterfall; monkeys watch from the streamside. Deductions: A golden fillet, tiger-skin " +
      "kilt, clothing or armor, or the golden-hooped rod; the Stone Monkey already inside the " +
      "cave or already king; the iron-plate bridge, a stone stele, or carved inscriptions " +
      "visible outside the waterfall; eyes emitting golden light.",
  },
  "xiyou-anim-001": {
    coreKey:
      "Looping animation of the plunging waterfall, splashes, and mist; the Stone Monkey leaps " +
      "in with no clothing, headgear, or weapon",
    groundTruth:
      "Chapter 1, \"The Divine Root Conceives and the Source Flows Forth; Cultivating the " +
      "Mind's Nature, the Great Way Is Born\". The Stone Monkey \"sprang with one leap\" into " +
      "the waterfall, monkey-shaped with no clothing or headgear; the waterfall has \"snowy " +
      "waves flying a thousand fathoms\" and \"cold air parting the green peaks\", so the " +
      "falling water, splashes, and mist are grounded in the text; the bridge and stone " +
      "tablet are inside the water curtain.",
    evaluationCriteria:
      "Full credit: The waterfall plunges continuously, splashes and mist rise and fall in a " +
      "loop, and the stream flows; the Stone Monkey, without clothing or headgear, leaps " +
      "toward the water curtain; animations loop smoothly and are driven by SMIL or inline " +
      "CSS. Deductions: A golden fillet, tiger-skin kilt, clothing or armor, or a weapon; the " +
      "bridge and stone tablet visible; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "xiyou-002": {
    coreKey:
      "At the third watch, with the back door half open, Wukong kneels at the bedside to " +
      "receive the Way; the Patriarch sits cross-legged with a robe thrown on, his appearance " +
      "not invented",
    groundTruth:
      "Chapter 2, \"Fully Awakened to the True Wondrous Truth of Bodhi; Cutting Off Mara, He " +
      "Returns to the Root and Joins the Primal Spirit\". At the third watch Wukong enters " +
      "through the half-open back door and kneels at the bedside; the Patriarch \"rose at " +
      "once, threw on his robe, and sat cross-legged\" to teach him the formula for long " +
      "life. Wukong has hollow cheeks and a pointed mouth, stands under four Chinese feet " +
      "tall, and is bareheaded, in red clothes, a yellow sash, and black boots; the " +
      "Patriarch's appearance is not described. The night has \"a bright moon and cold clear " +
      "dew\" and \"flying fireflies scattering their light\".",
    evaluationCriteria:
      "Full credit: A night scene with the back door half open; the Patriarch sits " +
      "cross-legged on the bed with a robe thrown on; Wukong kneels at the bedside, " +
      "monkey-shaped and clothed, with no headgear or weapon. Deductions: A golden fillet, " +
      "tiger-skin kilt, purple-gold crown, or golden-hooped rod; the Patriarch given the " +
      "film-and-TV look of a Taoist crown and long white beard; mixing in the daytime " +
      "lecture-hall scene of the three raps on the head, the pine-tree transformation, or " +
      "the somersault cloud.",
  },
  "xiyou-anim-002": {
    coreKey:
      "Receiving the Way at the bedside in the third watch; night-scene animation of " +
      "flickering fireflies, passing geese, and swaying branches",
    groundTruth:
      "Chapter 2, \"Fully Awakened to the True Wondrous Truth of Bodhi; Cutting Off Mara, He " +
      "Returns to the Root and Joins the Primal Spirit\". At the third watch Wukong enters " +
      "through the half-open back door and kneels at the bedside; the Patriarch \"rose at " +
      "once, threw on his robe, and sat cross-legged\". A verse reads \"flying fireflies " +
      "scatter their light; passing geese write characters across the clouds\", so the " +
      "fireflies and the goose formation are grounded in the text.",
    evaluationCriteria:
      "Full credit: Fireflies flicker, a goose formation passes, and branches sway gently; " +
      "the back door is half open; the Patriarch sits cross-legged with a robe thrown on; " +
      "Wukong, clothed, kneels and listens; animations loop smoothly and are driven by SMIL " +
      "or inline CSS. Deductions: A golden fillet, tiger-skin kilt, crown and armor, or the " +
      "golden-hooped rod; the Patriarch given a Taoist crown and white beard; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-003": {
    coreKey:
      "In the sea treasury Wukong grips the glowing iron pillar with both hands and bids it " +
      "grow shorter and thinner; the Dragon King shows the way; the golden hoops not yet " +
      "visible; no one recoiling in fear",
    groundTruth:
      "Chapter 3, \"The Four Seas and Thousand Mountains All Bow in Submission; From the Nine " +
      "Netherworlds the Ten Kinds Are Struck from the Register\". In the sea treasury " +
      "\"suddenly ten thousand rays of golden light appeared\": \"it was an iron pillar, about " +
      "as thick as a dou measure and more than two zhang long\"; Wukong hitches up his robe, " +
      "steps forward, grabs it with both hands, and bids it become \"a little shorter and " +
      "thinner\". The Dragon King leads the way beside him. The golden hoops and the " +
      "inscription \"Ruyi Jingu Bang\" only become legible after he leaves the sea treasury; " +
      "at this point Wukong wears no crown or armor.",
    evaluationCriteria:
      "Full credit: The gold-glowing iron pillar stands at the center, far taller than " +
      "Wukong; Wukong, clothed, grips the pillar with both hands; the Dragon King of the " +
      "Eastern Sea shows the way beside him. Deductions: Calling the pillar the \"divine " +
      "needle\"; golden hoops or an inscription already showing on the pillar; Wukong with " +
      "crown and armor, a golden fillet, or a tiger-skin kilt; the Dragon King and sea " +
      "creatures recoiling in fear; all four Dragon Kings present.",
  },
  "xiyou-anim-003": {
    coreKey:
      "Gripping the pillar in the sea treasury and bidding it grow shorter and thinner; " +
      "animation of the pillar's pulsing golden light, bubbles, and the robe flap; golden " +
      "hoops not yet visible",
    groundTruth:
      "Chapter 3, \"The Four Seas and Thousand Mountains All Bow in Submission; From the Nine " +
      "Netherworlds the Ten Kinds Are Struck from the Register\". The iron pillar in the sea " +
      "treasury gives off \"ten thousand rays of golden light\" and is as thick as a dou " +
      "measure and more than two zhang long; Wukong hitches up his robe, grabs it with both " +
      "hands, and bids it grow shorter and thinner, with the Dragon King beside him. The " +
      "golden light is grounded in the text and the bubbles are a pictorial addition; the " +
      "golden hoops are seen only after he leaves the sea treasury.",
    evaluationCriteria:
      "Full credit: The pillar's golden light pulses bright and dim, bubbles rise, and the " +
      "robe flap sways; Wukong, without crown or armor, grips the pillar with both hands; " +
      "animations loop smoothly and are driven by SMIL or inline CSS. Deductions: Calling the " +
      "pillar the \"divine needle\", golden hoops or an inscription already showing on the " +
      "pillar, the Dragon King recoiling in fear, or Wukong wearing a golden fillet or crown " +
      "and armor; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-004": {
    coreKey:
      "Outside Water Curtain Cave both sides take on three heads and six arms; Nezha with six " +
      "weapons and the fire wheel held in hand; Wukong in crown and armor wielding three rods",
    groundTruth:
      "Chapter 4, \"Appointed Keeper of the Horses, How Could He Be Content? Named Equal to " +
      "Heaven, Still He Is Not at Peace\". Outside the cave a banner on a tall pole reads " +
      "\"Great Sage Equal to Heaven\". Nezha, a boy with twin hair tufts in full armor, " +
      "\"changed into three heads and six arms\", holding a demon-slaying sword, a " +
      "demon-hacking saber, a demon-binding rope, a demon-quelling pestle, an embroidered " +
      "ball, and a fire wheel; Wukong, in the purple-gold crown, golden chain mail, and " +
      "cloud-treading shoes, also takes on three heads and six arms, his rod becoming three.",
    evaluationCriteria:
      "Full credit: The two sides face off left and right, each with three heads and six " +
      "arms; Nezha's six hands hold six weapons, the fire wheel in hand; Wukong in full crown " +
      "and armor holds three rods; a banner stands outside the cave. Deductions: Nezha " +
      "standing on Wind Fire Wheels or holding the Fire-Tipped Spear, Universe Ring, or Red " +
      "Armillary Sash; three heads and eight arms; Wukong with a golden fillet, tiger-skin " +
      "kilt, or twin pheasant plumes on his crown; wounds and bloodshed.",
  },
  "xiyou-anim-004": {
    coreKey:
      "Three-headed, six-armed face-off; animation of the spinning fire wheel, the writhing " +
      "demon-binding rope, and the fluttering banner",
    groundTruth:
      "Chapter 4, \"Appointed Keeper of the Horses, How Could He Be Content? Named Equal to " +
      "Heaven, Still He Is Not at Peace\". Nezha has three heads and six arms, \"the " +
      "demon-binding rope is like a flying python\" and \"the fire wheel flashes like " +
      "lightning, blazing bright\"; Wukong, in full crown and armor, also has three heads and " +
      "six arms, his rod becoming three; the banner outside the cave reads \"Great Sage Equal " +
      "to Heaven\".",
    evaluationCriteria:
      "Full credit: The fire wheel spins with flames, the demon-binding rope writhes, and the " +
      "banner flutters while the two three-headed, six-armed sides face off; animations loop " +
      "smoothly and are driven by SMIL or inline CSS. Deductions: Wind Fire Wheels underfoot, " +
      "the Fire-Tipped Spear, the Universe Ring, or the Red Armillary Sash; Wukong wearing a " +
      "golden fillet or tiger-skin kilt; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-005": {
    coreKey:
      "The maidens pull down the southern branch and pick its half-red, half-white peach; the " +
      "two-inch figure sleeps unnoticed at the branch tip; the tree's fruit is sparse",
    groundTruth:
      "Chapter 5, \"Wrecking the Peach Banquet, the Great Sage Steals the Elixir; Revolting " +
      "Against Heaven, the Monster Is Seized by the Gods\". The Seven Fairy Maidens wear red, " +
      "blue-green, white, black, purple, yellow, and green, \"each carrying a flower basket " +
      "on her head\"; the rear trees have sparse blossoms and fruit, only small green-skinned " +
      "peaches with fuzzy stems remaining, the large ones all eaten by Wukong. \"The maiden " +
      "in blue-green pulled the branch down with her hand, and the maiden in red picked\" the " +
      "half-red, half-white peach on the southern branch; Wukong, turned into \"a little " +
      "figure two inches long\", sleeps on that branch, his crown and robes left in the " +
      "flower pavilion.",
    evaluationCriteria:
      "Full credit: The seven maidens' garment colors are distinguishable and they carry " +
      "flower baskets; the maiden in blue-green pulls the branch down and the maiden in red " +
      "picks the peach; the tree's fruit is sparse; a tiny sleeping figure lies under the " +
      "leaves at the branch tip. Deductions: A maiden looking up to notice or pointing at " +
      "Wukong; a tree full of huge immortal peaches; Wukong wearing crown and armor, holding " +
      "the rod, or already in his true form; a golden fillet or tiger-skin kilt; garment " +
      "colors swapped for colors absent from the novel, such as orange.",
  },
  "xiyou-anim-005": {
    coreKey:
      "Picking the peach on the southern branch with the two-inch figure asleep at the branch " +
      "tip; drifting clouds, fluttering sashes, and gently trembling leaves",
    groundTruth:
      "Chapter 5, \"Wrecking the Peach Banquet, the Great Sage Steals the Elixir; Revolting " +
      "Against Heaven, the Monster Is Seized by the Gods\". In the orchard \"clouds and " +
      "rainbows are always seen veiling the sky\"; the Seven Fairy Maidens each carry a " +
      "flower basket on her head; the maiden in blue-green pulls down the branch and the " +
      "maiden in red picks the half-red, half-white peach on the southern branch; the rear " +
      "trees bear only small green-skinned peaches; the tiny figure sleeps on that branch, " +
      "unnoticed.",
    evaluationCriteria:
      "Full credit: Clouds drift, sashes flutter, and the southern branch trembles gently; " +
      "maidens in seven garment colors pull the branch and pick the peach; the tiny figure " +
      "sleeps under the leaves; animations loop smoothly and are driven by SMIL or inline " +
      "CSS. Deductions: A maiden noticing Wukong; a tree full of large peaches; Wukong " +
      "wearing crown and armor or a golden fillet; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
  "xiyou-006": {
    coreKey:
      "The flagpole behind Wukong's transformed shrine gives him away; Erlang Shen, in his own " +
      "form, raises his fist to smash the window lattice, with no third eye",
    groundTruth:
      "Chapter 6, \"Guanyin Attends the Banquet and Asks the Cause; The Little Sage Shows His " +
      "Might and Subdues the Great Sage\". Wukong turns into an Earth God shrine: his mouth " +
      "the shrine door, his teeth the door leaves, his tongue the bodhisattva statue, his " +
      "eyes the window lattice, and his tail a flagpole standing behind the shrine. Erlang is " +
      "handsome and refined, with ears hanging to his shoulders, wearing the three-mountain " +
      "flying-phoenix cap, a pale goose-yellow robe, and gold-threaded boots, a slingshot at " +
      "his waist and the three-pointed double-edged lance in hand; seeing the flagpole he " +
      "sees through the ruse and means to \"first smash the windows, then kick in the " +
      "doors\".",
    evaluationCriteria:
      "Full credit: The small shrine with a flagpole behind it and Erlang in his own form " +
      "share the frame; Erlang has his full cap, robe, and boots and a slingshot at his " +
      "waist, raising his fist toward the shrine; the shrine shows no monkey features. " +
      "Deductions: Erlang with a third eye on his forehead or accompanied by the Howling " +
      "Celestial Hound; Erlang drawn as a blue-faced, fanged giant; a separate monkey body of " +
      "Wukong beside the shrine; mixing in the Diamond Snare, the Plum Mountain Brothers, or " +
      "the capture scene.",
  },
  "xiyou-anim-006": {
    coreKey:
      "The flagpole behind the shrine gives away the ruse as Erlang Shen raises his fist; " +
      "small-scale animation of the stream, the flagpole tip, and the robe sashes",
    groundTruth:
      "Chapter 6, \"Guanyin Attends the Banquet and Asks the Cause; The Little Sage Shows His " +
      "Might and Subdues the Great Sage\". Wukong turns into a shrine, his tail a flagpole " +
      "standing behind it; Erlang, in the three-mountain flying-phoenix cap and pale " +
      "goose-yellow robe, sees the flagpole and raises his fist to smash the window lattice. " +
      "The stream and smartweed come from earlier in the chapter; the motion is mostly a " +
      "pictorial treatment.",
    evaluationCriteria:
      "Full credit: The stream flows, the smartweed sways gently, the flagpole tip quivers, " +
      "and the sashes flutter; the shrine and Erlang share the frame and the shrine shows no " +
      "monkey features; animations loop smoothly and are driven by SMIL or inline CSS. " +
      "Deductions: A third eye or the Howling Celestial Hound; a monkey body drawn beside the " +
      "shrine; the shrine or figures moving as a whole; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-007": {
    coreKey:
      "Five flesh-red pillars hold up a column of blue-green vapor, and Wukong writes on the " +
      "middle pillar with a brush made from his hair; the pillars are the five fingers of " +
      "the Tathagata Buddha's right hand",
    groundTruth:
      "Chapter 7, \"The Great Sage Escapes from the Eight Trigrams Furnace; Beneath Five " +
      "Elements Mountain the Mind-Monkey Is Stilled\". \"Suddenly he saw five flesh-red " +
      "pillars holding up a column of blue-green vapor\"; Wukong plucks a hair and turns it " +
      "into \"a double-tipped brush loaded with thick ink\", writing \"The Great Sage Equal to " +
      "Heaven was here\" on the middle pillar; the pillars are the five fingers of the " +
      "Tathagata's right hand. Wukong wears the purple-gold crown, golden chain mail, and " +
      "cloud-treading shoes, and the Eight Trigrams Furnace has given him fiery eyes with " +
      "golden pupils. The original text has no sea of clouds and no \"Five Finger " +
      "Mountain\".",
    evaluationCriteria:
      "Full credit: Five flesh-red pillars hold up blue-green vapor at their tops; Wukong is " +
      "tiny, in full crown and armor, writing with a brush on the middle pillar; the " +
      "composition suggests the five pillars are the fingers of a giant hand. Deductions: A " +
      "vast sea of clouds; a \"Five Finger Mountain\" label; Wukong wearing a golden fillet or " +
      "tiger-skin kilt or holding the golden-hooped rod; the full figure of the Tathagata " +
      "seated to one side; mixing in the urination, the mountain pinning him down, or the " +
      "sealing talisman being affixed.",
  },
  "xiyou-anim-007": {
    coreKey:
      "Five pillars holding up blue-green vapor, Wukong writing on the middle pillar; " +
      "animation of the vapor, the cloud light, and the ink characters appearing one by one " +
      "from top to bottom",
    groundTruth:
      "Chapter 7, \"The Great Sage Escapes from the Eight Trigrams Furnace; Beneath Five " +
      "Elements Mountain the Mind-Monkey Is Stilled\". Five flesh-red pillars \"hold up a " +
      "column of blue-green vapor\" and are the Tathagata Buddha's right hand; Wukong, in " +
      "crown and armor with fiery golden eyes, writes \"The Great Sage Equal to Heaven was " +
      "here\" with a brush made from his hair; he comes and goes \"along a trail of cloud " +
      "light\", with no sea of clouds.",
    evaluationCriteria:
      "Full credit: The blue-green vapor drifts and disperses, the cloud light flows, and the " +
      "ink characters appear one by one; the five pillars read as the fingers of a " +
      "giant hand; Wukong wears crown and armor and no golden fillet; animations loop " +
      "smoothly and are driven by SMIL or inline CSS. Deductions: A churning sea of clouds; " +
      "fingers or pillars swaying as a whole; Wukong with a golden fillet or tiger-skin kilt; " +
      "a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-008": {
    coreKey:
      "The monster leaps ashore to seize Guanyin and Huian blocks him with his iron cudgel; " +
      "precious staff, red hair, no skulls at the neck",
    groundTruth:
      "Chapter 8, \"Our Buddha Creates Scriptures to Pass On Ultimate Bliss; Guanyin Receives " +
      "the Decree and Goes to Chang'an\". At Flowing Sands River \"the rolling waves rise like " +
      "a mountain's hunched back\"; the monster has \"a dingy, ill-omened face\", red hair and " +
      "fangs, bare feet and a sinewy body, and holds a precious staff; he \"came ashore to " +
      "seize the Bodhisattva, but Huian blocked him with his solid iron cudgel\". Guanyin has " +
      "a coiled-dragon chignon, a plain silk-gauze robe, and an embroidered sash floating " +
      "lightly, and carries a ringed monk's staff when descending to the world; Huian (Moksa) " +
      "carries the cassock bundle on his back. The skulls are hung only after the monster " +
      "converts.",
    evaluationCriteria:
      "Full credit: The river waves churn; the monster comes ashore lunging forward; Huian " +
      "with his cudgel blocks him at the center; Guanyin stands on the bank; the monster has " +
      "red hair and holds a precious staff. Deductions: The monster holding a crescent-moon " +
      "spade, wearing skulls at the neck, or drawn as a monk; Guanyin on a lotus throne or " +
      "with a thousand arms; mixing in the Tang Monk, Wukong, Bajie, or the Jade Dragon; " +
      "casualties shown.",
  },
  "xiyou-anim-008": {
    coreKey:
      "Huian blocks the monster as Guanyin stands on the bank; animation of rising and " +
      "falling waves, drifting mist, and the fluttering embroidered sash",
    groundTruth:
      "Chapter 8, \"Our Buddha Creates Scriptures to Pass On Ultimate Bliss; Guanyin Receives " +
      "the Decree and Goes to Chang'an\". At Flowing Sands River \"the rolling waves rise like " +
      "a mountain's hunched back\"; the red-haired monster with the ill-omened face comes " +
      "ashore with his precious staff to seize Guanyin, and Huian (Moksa) blocks him with his " +
      "solid iron cudgel. The battle poem describes breathing out mist and spouting wind; " +
      "Guanyin's \"embroidered sash floats lightly\".",
    evaluationCriteria:
      "Full credit: Waves rise and fall throwing up spray, mist drifts and disperses, and the " +
      "embroidered sash flutters; Huian stands between the monster and Guanyin; animations " +
      "loop smoothly and are driven by SMIL or inline CSS. Deductions: A crescent-moon spade, " +
      "skulls at the neck, or Guanyin on a lotus throne; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-009": {
    coreKey:
      "A wooden plank drifts to the foot of Jinshan Temple and Elder Faming bends to rescue " +
      "the infant tied to it; a letter fastened to the chest, nothing gory",
    groundTruth:
      "Chapter 9, \"Chen Guangrui Meets Disaster on the Way to His Post; The River-Float Monk " +
      "Takes Revenge and Repays His Roots\", an appendix included in the base edition. Lady " +
      "Yin \"laid the infant on a plank, tied him with a band, fastened the letter written in " +
      "blood to his chest, and pushed him into the river\"; the plank drifts to the foot of " +
      "Jinshan Temple, and Elder Faming, hearing crying, hurries to the riverbank: \"he saw a " +
      "baby asleep on a wooden plank by the shore\"; he rescues him in haste and gives him " +
      "the childhood name River Float (Jiangliu). The elder's appearance is not described.",
    evaluationCriteria:
      "Full credit: On a plank at the bank lies a swaddled infant tied in place with a letter " +
      "on his chest; Faming bends to pick him up; the river and the foot of the temple are " +
      "visible in the background. Deductions: The vessel drawn as a wooden tub or bamboo " +
      "basket; bloodstains, finger-biting, or bodies thrown into the river; the infant drawn " +
      "as the adult Xuanzang, or given the brocade cassock and a ringed monk's staff; mixing " +
      "in Fahai or the flooding of Jinshan Temple.",
  },
  "xiyou-anim-009": {
    coreKey:
      "Elder Faming rescues the plank-bound infant at the riverbank; animation of flowing " +
      "river ripples, the bobbing plank, and the fluttering band",
    groundTruth:
      "Chapter 9, \"Chen Guangrui Meets Disaster on the Way to His Post; The River-Float Monk " +
      "Takes Revenge and Repays His Roots\", an appendix in the base edition. The infant was " +
      "\"laid on a plank, tied with a band, with the letter written in blood fastened to his " +
      "chest\"; the plank drifts to the foot of Jinshan Temple and Elder Faming hurries to " +
      "the riverbank to rescue him. The fluttering band is a pictorial treatment.",
    evaluationCriteria:
      "Full credit: River ripples flow, the plank bobs, and the band and sleeves sway gently; " +
      "Faming bends to rescue the infant, and the vessel is a plank; animations loop smoothly " +
      "and are driven by SMIL or inline CSS. Deductions: A wooden tub or bamboo basket, " +
      "bloodstains, or the adult Xuanzang; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-010": {
    coreKey:
      "An unfinished game of Go in the side hall; Wei Zheng slumps over the table snoring " +
      "into a dream as Taizong smiles; no dragon or dragon head",
    groundTruth:
      "Chapter 10, \"The Old Dragon King's Clumsy Scheme Breaks Heaven's Law; Minister Wei " +
      "Leaves a Letter for an Underworld Official\". Emperor Taizong of Tang keeps Wei Zheng " +
      "in the side hall and \"had the large board brought out\" to play; \"just as they " +
      "reached the third quarter of the noon hour, with the game unfinished, Wei Zheng " +
      "suddenly slumped over the edge of the table, snoring fast asleep\", and Taizong smiles " +
      "and lets him sleep; a verse says \"in a dream he left His Majesty, riding an " +
      "auspicious cloud\". The two men's attire during the game is not described; the game " +
      "is Go.",
    evaluationCriteria:
      "Full credit: The unfinished Go game on the imperial table is centered; Wei Zheng " +
      "sleeps soundly slumped over the table while Taizong smiles across from him; the scene " +
      "is calm with nothing gory. Deductions: A dragon, a dragon head, or the beheading of " +
      "the dragon; Wei Zheng awake brandishing a sword, or wearing a blue-green headband and " +
      "a brocade robe; the board drawn as Chinese chess (xiangqi); mixing in Qin Shubao and " +
      "Hu Jingde guarding the gate or Yuan Shoucheng's fortune-telling stall.",
  },
  "xiyou-anim-010": {
    coreKey:
      "An unfinished Go game with Wei Zheng asleep over the table; animation of his snoring " +
      "breath, the slight motion of the hand holding a stone, and a faint cloud rising and " +
      "fading",
    groundTruth:
      "Chapter 10, \"The Old Dragon King's Clumsy Scheme Breaks Heaven's Law; Minister Wei " +
      "Leaves a Letter for an Underworld Official\". In the side hall they play on \"the " +
      "large board\"; at the third quarter of the noon hour Wei Zheng \"slumped over the edge " +
      "of the table, snoring fast asleep\", and Emperor Taizong of Tang smiles and lets him " +
      "sleep; a verse says \"in a dream he left His Majesty, riding an auspicious cloud\", " +
      "and the faint cloud is symbolic.",
    evaluationCriteria:
      "Full credit: Wei Zheng's shoulders and back rise and fall, Taizong's hand moves " +
      "slightly, and the faint cloud rises and disperses; the unfinished Go game is centered " +
      "and no dragon appears; animations loop smoothly and are driven by SMIL or inline CSS. " +
      "Deductions: A dragon or dragon head, Wei Zheng brandishing a sword, or Chinese chess; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-011": {
    coreKey:
      "The Ten Kings check the register in Senluo Hall: Cui Jue with black gauze cap, " +
      "rhinoceros-horn belt, and ivory tablet; Taizong giving thanks from the guest seat",
    groundTruth:
      "Chapter 11, \"Touring the Underworld, Taizong Returns to Life; Presenting Melons, Liu " +
      "Quan Is Reunited with His Wife\". Cui Jue presents the Register of Life and Death and " +
      "the Ten Kings examine it from the beginning; Emperor Taizong of Tang, seated in the " +
      "guest seat, learns that he still has twenty years of life left and bows to thank " +
      "them. Cui Jue has \"a black gauze cap on his head with soft ribbons floating, and a " +
      "rhinoceros-horn belt at his waist showing gold inlay\" and holds an ivory tablet; " +
      "Taizong later recalls him as wearing \"a black cap and black robe\"; Ox-Head on the " +
      "left and Horse-Face on the right guard the gate.",
    evaluationCriteria:
      "Full credit: The Ten Kings sit in a row checking the register, Cui Jue stands in the " +
      "middle of the hall, and Taizong bows from the guest seat, with a clear visual " +
      "hierarchy; Cui Jue's black gauze cap with soft ribbons, rhinoceros-horn belt, and " +
      "ivory tablet are recognizable. Deductions: Cui Jue in a red robe, holding a judge's " +
      "brush, or openly altering the register with a brush; King Yama sitting alone at the " +
      "center; Taizong kneeling on trial; mixing in later scenes outside the hall such as " +
      "the Nai River Bridge or the Eighteen Levels of Hell.",
  },
  "xiyou-anim-011": {
    coreKey:
      "Checking the register in Senluo Hall: Cui Jue's attire and Taizong in the guest seat, " +
      "with animated incense smoke, lamp flames, and cap ribbons",
    groundTruth:
      "Chapter 11, \"Touring the Underworld, Taizong Returns to Life; Presenting Melons, Liu " +
      "Quan Is Reunited with His Wife\". Cui Jue presents the Register of Life and Death, the " +
      "Ten Kings examine it, and Emperor Taizong of Tang bows his thanks from the guest seat. " +
      "Cui Jue has \"a black gauze cap on his head with soft ribbons floating\", his beard " +
      "flying, and an ivory tablet in hand; the hall has beast-shaped censers and crimson " +
      "gauze lanterns.",
    evaluationCriteria:
      "Full credit: The Ten Kings check the register, Cui Jue stands in the hall, and " +
      "Taizong bows from the guest seat; Cui Jue's black gauze cap, rhinoceros-horn belt, and " +
      "ivory tablet are recognizable; the rising incense smoke, flickering lamp flames, and " +
      "gently swaying cap ribbons and beard loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Cui Jue in a red robe or holding a judge's brush; King Yama sitting alone " +
      "at the center; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-012": {
    coreKey:
      "Guanyin reveals her true form as Savior from Suffering at Huasheng Temple: blue robe " +
      "and pearl strands, pure vase and willow sprig, white parrot, and Moksa",
    groundTruth:
      "Chapter 12, \"The Tang Emperor Sincerely Holds the Great Mass; Guanyin Manifests Her " +
      "Holiness to Convert Golden Cicada\". Guanyin \"trod an auspicious cloud straight up to " +
      "the ninth heaven and revealed her true form as Savior from Suffering, holding the pure " +
      "vase with the willow sprig\", in a blue robe with pearl strands, a white parrot before " +
      "her; Moksa (Huian) stands at her left holding a cudgel, and in Huasheng Temple Emperor " +
      "Taizong of Tang leads the assembly in worship.",
    evaluationCriteria:
      "Full credit: Guanyin and Moksa on the clouds are clearly separated from Taizong and " +
      "the monks on the ground below; the blue robe and pearl strands, pure vase and willow " +
      "sprig, and white parrot are all present. Deductions: Guanyin in white, on a lotus " +
      "throne, or drawn in the Thousand-Armed or Fish-Basket form; Moksa holding a sword; " +
      "Xuanzang wearing a bright red cassock; Wukong, Bajie, or Sha " +
      "Wujing appearing; mixing in the episode of the scabby monks selling the cassock.",
  },
  "xiyou-anim-012": {
    coreKey:
      "Three-tier composition of Guanyin's manifestation, with animated banners, censer " +
      "smoke, and willow sprig and auspicious clouds",
    groundTruth:
      "Chapter 12, \"The Tang Emperor Sincerely Holds the Great Mass; Guanyin Manifests Her " +
      "Holiness to Convert Golden Cicada\". Guanyin reveals her true form as Savior from " +
      "Suffering, in a plain-woven blue robe with hanging pearl strands, holding the pure " +
      "vase with the willow sprig, a white parrot before her; Moksa (Huian) stands at her " +
      "left holding a cudgel. In the temple \"banners and pennants flutter and dance\" and " +
      "\"censers burn sandalwood and laka incense\".",
    evaluationCriteria:
      "Full credit: Guanyin and Moksa on the clouds are clearly separated from Taizong and " +
      "the monks on the ground; the blue robe and pearl strands, pure vase, and white parrot " +
      "are recognizable; the banners, censer smoke, and willow sprig and auspicious clouds " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Guanyin in white, on a lotus " +
      "throne, or with a thousand arms; Wukong or other disciples appearing; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-013": {
    coreKey:
      "Liu Boqin fights a striped tiger with his three-pronged fork on Double Fork Ridge: the " +
      "leopard-skin-capped hunter's outfit and the instant of the clash",
    groundTruth:
      "Chapter 13, \"Fallen into the Tiger's Den, He Is Rescued by the Gold Star; On Double " +
      "Fork Ridge, Boqin Shelters the Monk\". The hunter Liu Boqin wears a mugwort-leaf " +
      "spotted leopard-skin cap and a poluo coat, girds on a lion-and-barbarian belt, and " +
      "holds a steel-tipped three-pronged fork; on a late-autumn slope a striped tiger " +
      "\"turned and pounced with claws swinging\", and Sanzang goes limp.",
    evaluationCriteria:
      "Full credit: The instant of Boqin, with leopard-skin cap, poluo coat, and " +
      "three-pronged fork, clashing with the tiger is centered; Sanzang sits slumped to one " +
      "side; the autumn scenery is recognizable. Deductions: Boqin holding a quarterstaff or " +
      "fighting the tiger bare-handed; the tiger drawn as the upright, human-shaped General " +
      "Yin; Sun Wukong, a golden fillet, or the two attendants appearing; the fork impaling " +
      "the tiger or blood pooling on the ground.",
  },
  "xiyou-anim-013": {
    coreKey:
      "Boqin's fork-against-tiger clash with animated dust, falling leaves, and tiger tail",
    groundTruth:
      "Chapter 13, \"Fallen into the Tiger's Den, He Is Rescued by the Gold Star; On Double " +
      "Fork Ridge, Boqin Shelters the Monk\". Liu Boqin, in a mugwort-leaf spotted " +
      "leopard-skin cap and a poluo coat, meets with his steel-tipped three-pronged fork the " +
      "striped tiger that \"turned and pounced with claws swinging\"; it is late autumn, and " +
      "Sanzang lies limp on the grass.",
    evaluationCriteria:
      "Full credit: Boqin, with leopard-skin cap, poluo coat, and three-pronged fork, " +
      "clashing with the tiger is centered, with Sanzang slumped to one side; the dust, " +
      "falling leaves, and tiger tail all loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Boqin holding a quarterstaff; Sun Wukong appearing; bloodstains; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-014": {
    coreKey:
      "Wukong overgrown with moss and grass in the stone box at Two Frontier Mountain: no " +
      "fillet or kilt, Sanzang leading his horse, Boqin pulling the grass",
    groundTruth:
      "Chapter 14, \"The Mind-Monkey Returns to the Right; The Six Robbers Vanish Without a " +
      "Trace\". Wukong is pinned in a stone box at Two Frontier Mountain (formerly Five " +
      "Elements Mountain), \"his head sticking out and his hands reaching out\", with \"moss " +
      "heaped on his head and creepers growing from his ears\", without clothes or fillet; " +
      "Boqin pulls the grass off him, and the sealing talisman on the summit gives off " +
      "golden light.",
    evaluationCriteria:
      "Full credit: Wukong, only his head and hands showing from the stone box, is covered in " +
      "moss and grass, with golden eyes and a pointed mouth; Sanzang leads his horse and " +
      "looks closely; Boqin pulls the grass; the visual hierarchy is clear. Deductions: " +
      "Wukong wearing a golden fillet, a tiger-skin kilt, or a zhiduo robe, or holding the " +
      "iron rod; his whole body already out of the mountain; the mountain drawn as five " +
      "fingers; a monkey face prettified in film-and-TV style with no moss or grass; a " +
      "tiger, Guanyin, or the Six Robbers appearing.",
  },
  "xiyou-anim-014": {
    coreKey:
      "First meeting with Wukong in the stone box, with animated beckoning hand, golden " +
      "light, and green grass",
    groundTruth:
      "Chapter 14, \"The Mind-Monkey Returns to the Right; The Six Robbers Vanish Without a " +
      "Trace\". Wukong is pinned in a stone box at Two Frontier Mountain, \"his head sticking " +
      "out, his hands reaching out, waving wildly\", moss heaped on his head and green grass " +
      "at his temples, without clothes or fillet; Boqin pulls the grass off him, and the " +
      "sealing talisman on the summit sends out ten thousand rays of golden light.",
    evaluationCriteria:
      "Full credit: Wukong in the stone box with head and hands out, covered in moss and " +
      "grass; Sanzang leads his horse and Boqin pulls the grass; the beckoning hand, golden " +
      "light, and green grass all loop smoothly, driven by SMIL or inline CSS. Deductions: A " +
      "golden fillet, tiger-skin kilt, or iron rod appearing prematurely; his whole body out " +
      "of the mountain; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-015": {
    coreKey:
      "The wicked dragon swallows the horse at Eagle Grief Stream: the dragon swallows the " +
      "saddled and bridled white horse while Wukong, empty-handed, carries his master away",
    groundTruth:
      "Chapter 15, \"On Coiled Snake Mountain the Gods Give Secret Protection; At Eagle Grief " +
      "Stream the Horse of the Will Is Reined In\". In the cold of the twelfth month \"a " +
      "dragon burst out\" of the stream, \"pushing the waves and stirring up the billows\", " +
      "and swallowed the white horse \"saddle, bridle, and all in one gulp\"; Wukong, wearing " +
      "the golden fillet, his zhiduo robe belted and his tiger-skin kilt hitched up, carries " +
      "his master down.",
    evaluationCriteria:
      "Full credit: The dragon surges up to the cliff edge through the waves and swallows the " +
      "saddled and bridled white horse; Wukong, empty-handed, carries Sanzang and turns away; " +
      "the dragon's whiskers and pearl and the perilous wintry gorge are recognizable. " +
      "Deductions: Wukong fighting the dragon with his rod; Wukong missing the golden fillet " +
      "or tiger-skin kilt; Guanyin, the Guardians (Jiedi), or mountain gods appearing " +
      "prematurely; the dragon chewing with blood visible; Bajie or Sha Wujing appearing; a " +
      "spring scene.",
  },
  "xiyou-anim-015": {
    coreKey:
      "The instant the horse is swallowed at Eagle Grief Stream, with animated spray, the " +
      "dragon's whiskers and colored mist, and the north wind",
    groundTruth:
      "Chapter 15, \"On Coiled Snake Mountain the Gods Give Secret Protection; At Eagle Grief " +
      "Stream the Horse of the Will Is Reined In\". In the north wind of the twelfth month " +
      "the dragon in the stream comes \"pushing the waves and stirring up the billows\", its " +
      "whiskers like white jade threads and its pearl spouting colored mist, and swallows the " +
      "white horse with saddle and bridle; Wukong, wearing the golden fillet and a cotton " +
      "zhiduo robe, carries his master away.",
    evaluationCriteria:
      "Full credit: The dragon swallowing the saddled and bridled white horse and Wukong " +
      "carrying Sanzang away empty-handed share the same instant; the spray, the dragon's " +
      "whiskers and colored mist, and the robe hems all loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Wukong fighting the dragon with his rod; Guanyin appearing " +
      "prematurely; visible blood; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-016": {
    coreKey:
      "Night fire at Guanyin Temple: Wukong on the abbot's roof ridge blows wind to feed the " +
      "fire, and the meditation hall is covered by the fire-proof canopy",
    groundTruth:
      "Chapter 16, \"At Guanyin Temple the Monks Plot for the Treasure; On Black Wind " +
      "Mountain a Monster Steals the Cassock\". The monks set the fire at the second watch; " +
      "Wukong borrows the fire-proof canopy of the Heavenly King Virupaksa (Guangmu) to cover " +
      "the meditation hall, and, sitting on the roof of the abbot's quarters, \"drew in a " +
      "breath and blew it toward the Xun quarter\" (southeast); he wears the golden fillet, " +
      "a zhiduo robe, and a tiger-skin kilt.",
    evaluationCriteria:
      "Full credit: Wukong sits on the abbot's roof ridge forming a hand seal and blowing " +
      "wind; the meditation hall is covered and unburned while the other halls are a sea of " +
      "fire and black smoke and the monks flee. Deductions: Wukong setting fires with a " +
      "torch or holding the golden-hooped rod; a purple-gold crown, chain mail, or a " +
      "flowered cap appearing; Bajie or Sha Wujing present; the Black Bear Spirit drawn; the " +
      "fire-proof canopy drawn as a specific fabric such as fire-washed (asbestos) cloth.",
  },
  "xiyou-anim-016": {
    coreKey:
      "The sea of fire at Guanyin Temple, with animated flames and black smoke, sparks, and " +
      "robe hem",
    groundTruth:
      "Chapter 16, \"At Guanyin Temple the Monks Plot for the Treasure; On Black Wind " +
      "Mountain a Monster Steals the Cassock\". The monks set the fire; Wukong covers the " +
      "meditation hall with the fire-proof canopy and, sitting on the roof of the abbot's " +
      "quarters forming a hand seal, \"drew in a breath and blew it toward the Xun quarter\" " +
      "(southeast); the fire starts at the second watch, black smoke blots out the sky, and " +
      "the halls all burn.",
    evaluationCriteria:
      "Full credit: Wukong forming a hand seal and blowing wind on the abbot's roof ridge, " +
      "the covered meditation hall, and the sea of fire and black smoke form a clear visual " +
      "hierarchy; the flames and black smoke, sparks, and robe hem loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Wukong holding a torch or the golden-hooped rod; a " +
      "purple-gold crown or flowered cap appearing; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-017": {
    coreKey:
      "First battle before Black Wind Cave: Wukong's golden-hooped rod against the " +
      "human-shaped dark fellow's black-tasseled spear and black-gold armor",
    groundTruth:
      "Chapter 17, \"Pilgrim Sun Wreaks Havoc on Black Wind Mountain; Guanshiyin Subdues the " +
      "Bear Monster\". The dark fellow has \"a bowl-shaped iron helmet gleaming like fire " +
      "lacquer and black-gold armor shining bright\", with a black silk robe; \"Ruyi rod and " +
      "black-tasseled spear: the two show their might at the cave mouth\"; a horizontal " +
      "stone plaque over the stone doors bears the cave's name, and it is springtime.",
    evaluationCriteria:
      "Full credit: Before the stone doors of the cave, Wukong's rod meets the dark fellow's " +
      "spear in a single instant of combat; the dark fellow is human-shaped and pitch-black, " +
      "with iron helmet, black-gold armor, black silk robe, and black-tasseled spear all " +
      "present. Deductions: The dark fellow drawn with a bear's head or in beast form; a " +
      "hoop already on the dark fellow's head; Guanyin present; the dark fellow holding the " +
      "cassock; Wukong in the purple-gold crown and golden chain mail; Bajie, Sha Wujing, or " +
      "the white horse appearing.",
  },
  "xiyou-anim-017": {
    coreKey:
      "The face-off at Black Wind Cave, with animated haze, spear tassel and silk sash, and " +
      "falling petals",
    groundTruth:
      "Chapter 17, \"Pilgrim Sun Wreaks Havoc on Black Wind Mountain; Guanshiyin Subdues the " +
      "Bear Monster\". At the cave mouth the \"Ruyi rod and black-tasseled spear\" cross; the " +
      "dark fellow has \"a bowl-shaped iron helmet gleaming like fire lacquer and black-gold " +
      "armor shining bright\", a black silk robe, and a black-green silk sash; on a spring " +
      "day misty haze swirls before the cave.",
    evaluationCriteria:
      "Full credit: Wukong's rod against the human-shaped dark fellow's spear, with iron " +
      "helmet, black armor, black robe, and black-tasseled spear all present; the haze, spear " +
      "tassel and silk sash, and falling petals all loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The dark fellow drawn with a bear's head or in beast form; Guanyin " +
      "present; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "xiyou-018": {
    coreKey:
      "The back quarters at Gao Village: Wukong, disguised as the daughter, lies in bed " +
      "feigning illness as Zhu Ganglie rides the wind into the room and grabs her " +
      "empty-handed",
    groundTruth:
      "Chapter 18, \"At Guanyin Temple the Tang Monk Escapes Disaster; At Gao Village the " +
      "Great Sage Drives Out the Demon\". Wukong turns into the Gao daughter, \"lying in bed " +
      "pleading illness\"; Zhu Ganglie arrives on a fierce wind, \"walked into the room and " +
      "grabbed her in his arms\", with \"a black face and short bristles, a long snout and big " +
      "ears\", wearing a coarse homespun zhiduo robe neither quite blue-green nor quite blue, " +
      "tied with a patterned cloth kerchief, and holding no rake; the name \"Bajie\" is given " +
      "only in Chapter 19.",
    evaluationCriteria:
      "Full credit: The woman lies in bed feigning illness while Zhu Ganglie grabs her " +
      "bare-handed; his black face, long snout, big ears, coarse zhiduo robe, and patterned " +
      "kerchief are recognizable; wind and sand blow outside. Deductions: The woman sitting " +
      "at the bedside; Zhu Ganglie shouldering the nine-toothed rake or holding a weapon; " +
      "pushing the door open to enter; labeling him Zhu Bajie; the woman showing a golden " +
      "fillet, tiger-skin kilt, or monkey fur; Old Master Gao or Sha Wujing present.",
  },
  "xiyou-anim-018": {
    coreKey:
      "The instant of the grab in the back quarters at Gao Village, with animated wind and " +
      "sand, robe hem, and the rise and fall of the feigned illness",
    groundTruth:
      "Chapter 18, \"At Guanyin Temple the Tang Monk Escapes Disaster; At Gao Village the " +
      "Great Sage Drives Out the Demon\". Wukong turns into the Gao daughter, \"lying in bed " +
      "pleading illness\"; Zhu Ganglie enters the room on a fierce wind, black-faced with a " +
      "long snout and big ears, in a coarse homespun zhiduo robe tied with a patterned cloth " +
      "kerchief, grabbing her empty-handed and not shouldering his rake.",
    evaluationCriteria:
      "Full credit: The woman lying in bed feigning illness, Zhu Ganglie grabbing her " +
      "empty-handed, and the wind and sand outside are all present, with appearances true to " +
      "the novel; the wind and sand, robe hem, and rising and falling shoulder loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Shouldering the rake, pushing the door open, " +
      "or the woman sitting at the bedside; calling him Bajie; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-019": {
    coreKey:
      "The Crow's Nest Chan Master on Pagoda Mountain: the nest of sticks and straw in the " +
      "tree, the deer, monkey, and birds, and the master coming down to help up the Tang Monk",
    groundTruth:
      "Chapter 19, \"At Cloud Pathway Cave Wukong Takes In Bajie; On Pagoda Mountain " +
      "Xuanzang Receives the Heart Sutra\". \"Before a fragrant juniper there was a nest of " +
      "sticks and straw; on the left a deer held flowers in its mouth, and on the right a " +
      "mountain monkey offered fruit\"; the Chan master \"jumped down from the tree\" to greet " +
      "the Tang Monk; Zhu Bajie, in a bianshan monk's shirt, carries the luggage on a pole, " +
      "and Wukong shoulders his rod.",
    evaluationCriteria:
      "Full credit: The nest of sticks and straw in the tree, the deer on the left and the " +
      "monkey on the right, and the birds in the treetop are all present; the master comes " +
      "down from the tree to help up the Tang Monk; Bajie carrying the luggage and Wukong " +
      "shouldering his rod stand in attendance. Deductions: Sha Wujing appearing; the master " +
      "drawn as Guanyin or a Buddha statue, or with a halo; scrolls or sutra text drawn; " +
      "mixing in Wukong jabbing at the nest with his rod, lotus flowers and auspicious mist, " +
      "or the night battle at Cloud Pathway Cave.",
  },
  "xiyou-anim-019": {
    coreKey:
      "Greeting the monk beneath the tree on Pagoda Mountain, with animated stream, white " +
      "clouds, and bird wings",
    groundTruth:
      "Chapter 19, \"At Cloud Pathway Cave Wukong Takes In Bajie; On Pagoda Mountain " +
      "Xuanzang Receives the Heart Sutra\". Before the fragrant juniper is a nest of sticks " +
      "and straw, a deer on the left and a monkey on the right, and in the treetop blue luan " +
      "birds and colorful phoenixes sing together; the Chan master jumps down from the tree " +
      "and helps up the Tang Monk; Zhu Bajie, in a bianshan shirt, carries the luggage, and " +
      "Wukong shoulders his rod; below, green water surges through the gorge.",
    evaluationCriteria:
      "Full credit: The nest of sticks and straw in the tree and the deer, monkey, and birds " +
      "are all present; the master helps up the Tang Monk while Bajie and Wukong stand in " +
      "attendance; the stream, white clouds, and bird wings loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Sha Wujing appearing; the master with a halo or drawn as a " +
      "Buddha statue; scrolls drawn; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-020": {
    coreKey:
      "A tiger appears on Yellow Wind Ridge: the Tang Monk falls from his horse and Bajie " +
      "raises his nine-toothed rake to meet the tiger first",
    groundTruth:
      "Chapter 20, \"On Yellow Wind Ridge the Tang Monk Meets Trouble; Halfway Up the " +
      "Mountain Bajie Strives to Be First\". On a summer day \"a whirlwind suddenly rose\", a " +
      "striped tiger leapt out, and Sanzang \"tumbled head over heels off the white horse\"; " +
      "\"Bajie dropped the luggage, drew his rake, and would not let Pilgrim go ahead\". " +
      "Bajie is black-faced with a long snout and big ears, in a bianshan shirt; Wukong " +
      "wears the golden fillet and tiger-skin kilt and holds his iron rod; the tiger has not " +
      "yet stripped off its skin.",
    evaluationCriteria:
      "Full credit: The tiger pouncing, the Tang Monk falling from his horse, and Bajie " +
      "charging first with his rake raised share the same instant; the whirlwind of dust and " +
      "sand and the tossing pines and bamboo are recognizable; Wukong is to one side. " +
      "Deductions: Sha Wujing appearing; the Yellow Wind King, or golden helmet and golden " +
      "armor, or a three-pronged steel fork appearing prematurely; the tiger upright in " +
      "human form, stripping off its skin, or holding a red-copper blade; Wukong charging " +
      "ahead of Bajie; the nine-ringed monk's staff drawn in Wukong's hand.",
  },
  "xiyou-anim-020": {
    coreKey:
      "The instant Bajie charges first on Yellow Wind Ridge, with animated whirlwind dust, " +
      "pines and bamboo, and white clouds",
    groundTruth:
      "Chapter 20, \"On Yellow Wind Ridge the Tang Monk Meets Trouble; Halfway Up the " +
      "Mountain Bajie Strives to Be First\". On a summer day \"a whirlwind rose\": a thousand " +
      "trees roar, ten thousand bamboo stems sway, and dust and sand burst up; a tiger leaps " +
      "out, Sanzang falls off the white horse, Bajie drops the luggage and draws his rake to " +
      "charge first, and Wukong holds his iron rod.",
    evaluationCriteria:
      "Full credit: The tiger pouncing, the Tang Monk falling from his horse, and Bajie " +
      "charging first with his rake raised share the same instant, with Wukong to one side; " +
      "the dust and sand, pines and bamboo, and white clouds loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Sha Wujing or the Yellow Wind King appearing; the tiger " +
      "upright or stripping off its skin; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
};
