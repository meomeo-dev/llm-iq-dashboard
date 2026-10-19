/**
 * 《西游记》第 41–60 回候选的英文标签与英文评判标准，由 src/core/classics/xiyou/ch041-050.ts、
 * ch051-060.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const XIYOU_CH041_060_LABELS_EN: Readonly<Record<string, string>> = {
  "xiyou-041": "Ch. 41 · Red Boy Punches His Nose and Spews Fire",
  "xiyou-042": "Ch. 42 · Guanyin Throws the Golden Fillets",
  "xiyou-043": "Ch. 43 · The Dugout Boat on the Black River",
  "xiyou-044": "Ch. 44 · Hauling Carts on the Sandbank and Questioning the Taoists",
  "xiyou-045": "Ch. 45 · Summoning the Wind at the Rain Altar",
  "xiyou-046": "Ch. 46 · Wukong Frolics in the Oil Cauldron",
  "xiyou-047": "Ch. 47 · Trial Carry of the Boy and Girl on Red Lacquer Trays",
  "xiyou-048": "Ch. 48 · Crossing the Ice of the River of Heaven, Staffs Held Crosswise",
  "xiyou-049": "Ch. 49 · Guanyin Takes In the Fish with Her Basket",
  "xiyou-050": "Ch. 50 · Wukong Draws a Circle to Protect His Master",
  "xiyou-051": "Ch. 51 · Snaring the Weapons at the Mouth of Golden Helmet Cave",
  "xiyou-052": "Ch. 52 · Laozi Leads the Green Ox by Its Pierced Nose",
  "xiyou-053": "Ch. 53 · Pregnant from the Water of the Mother-and-Child River",
  "xiyou-054": "Ch. 54 · The Queen Comes to Greet Him at Yingyang Post House",
  "xiyou-055": "Ch. 55 · One Crow of the Rooster Reveals the Scorpion",
  "xiyou-056": "Ch. 56 · Two Bandits Cannot Budge the Rod",
  "xiyou-057": "Ch. 57 · The False Pilgrim Reads the Rescript on the Stone Terrace",
  "xiyou-058": "Ch. 58 · Two Minds Contend at Thunderclap Monastery",
  "xiyou-059": "Ch. 59 · Rakshasi's One Fan of Dark Wind",
  "xiyou-060": "Ch. 60 · Wukong Shoulders the Plantain Fan",
};

/** 静态与动态候选 id → 英文评判标准 */
export const XIYOU_CH041_060_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "xiyou-041": {
    coreKey:
      "Standing on a cart before Fire Cloud Cave and punching his nose: Red Boy, in a brocade " +
      "skirt and barefoot, raises his spear and spews fire, and the five carts burst into flame",
    groundTruth:
      "Chapter 41, \"The Mind-Monkey Is Defeated by Fire; The Wood Mother Is Captured by the " +
      "Demon\". Red Boy has a white face and red lips, \"around his waist a brocade battle " +
      "skirt, his feet bare\", and raising the Fire-Tipped Spear he \"stood on the middle one " +
      "of the little carts\"; he punches his nose twice and spews fire from his mouth and " +
      "nose, and \"from the five carts fire and light gushed out\".",
    evaluationCriteria:
      "Full credit: Five little carts stand side by side, with Red Boy on the middle cart " +
      "punching his nose and spewing fire as the main figure on the right side of the frame; " +
      "his brocade skirt, bare " +
      "feet, and Fire-Tipped Spear are recognizable; Wukong raises his rod to face him, and " +
      "Bajie, rake in hand, is about to flee. Deductions: Red Boy wearing a red belly-band, " +
      "standing on Wind Fire Wheels, or in armor; rain, the Dragon King, Guanyin, or Sha " +
      "Wujing appearing.",
  },
  "xiyou-anim-041": {
    coreKey:
      "Red Boy punching his nose and spewing fire, with animated cart fires, fire and smoke " +
      "from his mouth and nose, and skirt hems",
    groundTruth:
      "Chapter 41, \"The Mind-Monkey Is Defeated by Fire; The Wood Mother Is Captured by the " +
      "Demon\". Red Boy, in a brocade battle skirt and barefoot, raises the Fire-Tipped Spear " +
      "and stands on the middle little cart; he punches his nose twice and fire and smoke " +
      "pour from his mouth and nose, and \"from the five carts fire and light gushed out\"; " +
      "Wukong raises his rod to face him, and Bajie, seeing the fire, flees first.",
    evaluationCriteria:
      "Full credit: Red Boy stands on the middle cart punching his nose and spewing fire, the " +
      "five carts burst into flame, Wukong raises his rod, and Bajie is about to flee; the " +
      "cart fires, the fire and smoke from his mouth and nose, and the skirt hems loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Red Boy wearing a red belly-band " +
      "or standing on Wind Fire Wheels; rain, the Dragon King, or Guanyin appearing; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-042": {
    coreKey:
      "Throwing the golden fillets in the fairyland conjured from the pure-vase water: Guanyin's " +
      "one fillet becomes " +
      "five and flies at Red Boy, three-tufted, who has gone back on his word and thrusts his " +
      "spear",
    groundTruth:
      "Chapter 42, \"The Great Sage Earnestly Pays Homage at the South Sea; Guanyin in Mercy " +
      "Binds Red Boy\". After his head is shaved into three tufts, Red Boy goes back on his " +
      "word and thrusts his spear, \"stabbing straight at the Bodhisattva's face\"; Guanyin " +
      "takes out the golden fillet, which \"at once became five fillets, and she threw them " +
      "at the boy's body\", one for the crown of his head and one each for his left and " +
      "right hands and left and right feet.",
    evaluationCriteria:
      "Full credit: On an auspicious cloud Guanyin throws out five golden fillets that fly in " +
      "arcs toward the crown of Red Boy's head and his hands and feet; Red Boy, with three " +
      "tufts and a brocade skirt, thrusts his spear at her, Wukong raises his rod at the " +
      "side, and the fairyland of flooding water and lotus flowers is recognizable. " +
      "Deductions: The fillets already on his body, or Red Boy rolling on the ground; a lotus " +
      "throne, the Heavenly Dipper swords, or bloodstains drawn; Red Boy wearing a red " +
      "belly-band, standing on Wind Fire Wheels, or drawn as a boy with palms pressed " +
      "together.",
  },
  "xiyou-anim-042": {
    coreKey:
      "Guanyin throwing the golden fillets, with animated flying fillets, waves, and sleeves " +
      "and willow sprig",
    groundTruth:
      "Chapter 42, \"The Great Sage Earnestly Pays Homage at the South Sea; Guanyin in Mercy " +
      "Binds Red Boy\". After his head is shaved into three tufts, Red Boy goes back on his " +
      "word and thrusts his spear at Guanyin; Guanyin takes out the golden fillet, which \"at " +
      "once became five fillets, and she threw them at the boy's body\", flying toward the " +
      "crown of his head and his left and right hands and feet.",
    evaluationCriteria:
      "Full credit: On an auspicious cloud Guanyin throws the fillets, the three-tufted Red " +
      "Boy thrusts his spear at her, and Wukong raises his rod at the side; the flying " +
      "fillets, the waves, and the sleeves and willow sprig loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: The fillets clamped tight on his body, or Red Boy rolling on " +
      "the ground; a lotus throne, the Heavenly Dipper swords, or bloodstains drawn; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-043": {
    coreKey:
      "Wind rising mid-stream on the Black River: a small dugout boat carries the Tang Monk " +
      "and Bajie, the helmsman, dressed as a boatman, holds his oar, and the boat heels over",
    groundTruth:
      "Chapter 43, \"The Fiend of the Black River Carries Off the Monk; The Dragon Prince of " +
      "the Western Ocean Brings Back the Alligator\". The black waves, \"seen up close, " +
      "reflect no human shadow\"; the little boat \"was carved from a single log, with only " +
      "one hatch in the middle, just enough to seat two people\", and mid-stream \"the waves " +
      "rolled and the billows churned, blotting out the sky and dimming the sun\".",
    evaluationCriteria:
      "Full credit: Mid-stream on the Black River the small dugout boat heels over, the Tang " +
      "Monk and Bajie sitting staggered side by side in the hatch, the helmsman standing at " +
      "the stern with his oar, and on the far bank Wukong and Sha Wujing guarding the horse. " +
      "Deductions: The helmsman drawn with a crocodile head and scales or as a dragon; the " +
      "boat already sunk; all four pilgrims in the boat, or the boat with an awning or sail; " +
      "a river god appearing; the Tang Monk wearing a cassock.",
  },
  "xiyou-anim-043": {
    coreKey:
      "The dugout boat mid-stream on the Black River, with animated black waves, flying sand " +
      "and reeds, and garment hems",
    groundTruth:
      "Chapter 43, \"The Fiend of the Black River Carries Off the Monk; The Dragon Prince of " +
      "the Western Ocean Brings Back the Alligator\". The little boat \"was carved from a " +
      "single log, with only one hatch in the middle, just enough to seat two people\"; the " +
      "Tang Monk and Bajie board, and mid-stream \"the waves rolled and the billows churned, " +
      "blotting out the sky and dimming the sun\", with sand flying on both banks.",
    evaluationCriteria:
      "Full credit: Mid-stream on the Black River the small dugout boat carries the Tang Monk " +
      "and Bajie, the helmsman stands at the stern with his oar, and on the far bank Wukong " +
      "and Sha Wujing guard the horse; the black waves, the flying sand and reeds, and the " +
      "garment hems loop smoothly, driven by SMIL or inline CSS. Deductions: The helmsman " +
      "drawn with a crocodile head and scales or as a dragon; the boat already sunk; all four " +
      "pilgrims in the boat; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-044": {
    coreKey:
      "The sandbank of Chechi Kingdom: Wukong, turned into a wandering Taoist, with a basket " +
      "on his arm and tapping a fish drum, questions the Taoists, while the monks haul carts " +
      "of bricks and tiles up the slope",
    groundTruth:
      "Chapter 44, \"The Dharma Body on Its Primal Course Meets the Cart's Force; With the " +
      "Mind Upright, the Demonic and Deviant Cross the Spinal Pass\". In early spring the " +
      "monks, \"in ragged clothes\", haul the carts, \"all loaded with bricks, tiles, timber, " +
      "adobe, and the like\"; Wukong turns into a wandering Quanzhen Taoist, \"a " +
      "water-and-fire basket hanging on his left arm, his hand tapping a fish drum\".",
    evaluationCriteria:
      "Full credit: In the distance ragged monks haul carts of bricks and tiles up the slope; " +
      "in the foreground Wukong in Taoist attire, basket on his arm and tapping the fish " +
      "drum, bows to question the young Taoists in star caps and colorful robes. Deductions: " +
      "Wukong showing his monkey face or golden fillet, holding his rod, or wearing the " +
      "tiger-skin kilt; whipping or bloodstains drawn; the Tang Monk, Bajie, or Sha Wujing " +
      "present.",
  },
  "xiyou-anim-044": {
    coreKey:
      "Questioning the Taoists where carts are hauled on the sandbank, with animated blowing " +
      "sand, Taoist robes and silk sashes, and willows",
    groundTruth:
      "Chapter 44, \"The Dharma Body on Its Primal Course Meets the Cart's Force; With the " +
      "Mind Upright, the Demonic and Deviant Cross the Spinal Pass\". In early spring the " +
      "ragged monks haul carts loaded with bricks, tiles, timber, and adobe up the slope; " +
      "Wukong turns into a wandering Quanzhen Taoist, \"a water-and-fire basket hanging on " +
      "his left arm, his hand tapping a fish drum\", and questions the young Taoists.",
    evaluationCriteria:
      "Full credit: In the distance the monks haul carts up the slope; in the foreground " +
      "Wukong in Taoist attire, basket on his arm and tapping the fish drum, bows to question " +
      "the Taoists in star caps and colorful robes; the blowing sand, the Taoist robes and " +
      "silk sashes, and the willows loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Wukong showing his monkey face or golden fillet, holding the golden-hooped rod, or " +
      "wearing the tiger-skin kilt; whipping drawn; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-045": {
    coreKey:
      "Pointing the rod to summon wind at the rain altar: the Tang Monk sits still, Wukong " +
      "raises his rod and points at the sky, Granny Wind opens her bag, and Xun Er Lang " +
      "loosens the cord",
    groundTruth:
      "Chapter 45, \"At the Abbey of the Three Pure Ones the Great Sage Leaves His Name; In " +
      "Chechi Kingdom the Monkey King Displays His Magic\". The Tang Monk mounts the altar, " +
      "sits upright, and silently recites scripture; Wukong takes out his iron rod and " +
      "\"pointed the rod at the sky\"; \"seeing this, Granny Wind hastily pulled open her " +
      "leather bag, and Xun Er Lang untied the cord at its mouth\", and across the whole city " +
      "\"sand flew and stones rolled\".",
    evaluationCriteria:
      "Full credit: On the high platform the Tang Monk, in his cassock, sits still and Wukong " +
      "raises his rod to point at the sky; in midair Granny Wind pulls open the bag and Xun " +
      "Er Lang loosens the cord, and a gale whips up sand and stones. Deductions: Dark " +
      "clouds, thunder and lightning, rain, or the Dragon King already present; the wind " +
      "deities drawn as the Thunder God; the Tang Monk burning talismans or striking a " +
      "command tablet; Bajie or Sha Wujing on the platform.",
  },
  "xiyou-anim-045": {
    coreKey:
      "Summoning the wind at the rain altar, with animated wind-swept sand and stones, " +
      "banners and sleeves, and censer smoke",
    groundTruth:
      "Chapter 45, \"At the Abbey of the Three Pure Ones the Great Sage Leaves His Name; In " +
      "Chechi Kingdom the Monkey King Displays His Magic\". The Tang Monk mounts the altar " +
      "and sits still reciting scripture; Wukong takes his iron rod and \"pointed the rod at " +
      "the sky\"; \"seeing this, Granny Wind hastily pulled open her leather bag, and Xun Er " +
      "Lang untied the cord at its mouth\", and across the whole city \"sand flew and stones " +
      "rolled\".",
    evaluationCriteria:
      "Full credit: On the altar the Tang Monk sits still and Wukong raises his rod to point " +
      "at the sky, while in midair Granny Wind pulls open the bag and Xun Er Lang loosens the " +
      "cord; the wind-swept sand and stones, the banners and sleeves, and the censer smoke " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Dark clouds, thunder and " +
      "lightning, rain, or the Dragon King appearing; the wind deities drawn as the Thunder " +
      "God; whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-046": {
    coreKey:
      "The martial bath in the oil cauldron before the hall: Wukong strips to his monkey fur " +
      "and jumps into the boiling oil to frolic as if in water, while Bajie bites his finger " +
      "and praises him to Sha Wujing",
    groundTruth:
      "Chapter 46, \"Heresy Flaunts Its Strength to Bully the True Dharma; The Mind-Monkey " +
      "Shows His Holy Power and Destroys the Deviants\". Under the oil cauldron \"a fierce " +
      "fire burned, bringing the oil to a boil\"; Wukong \"took off his cloth zhiduo robe and " +
      "slipped off his tiger-skin kilt\" and jumped into the cauldron, \"tumbling in the " +
      "waves and fighting the billows, playing just as if he were swimming\"; Bajie \"bit his " +
      "finger and said to Sha Wujing\".",
    evaluationCriteria:
      "Full credit: In the boiling oil over a fierce fire, Wukong, all monkey fur and bound " +
      "with the golden fillet, frolics with his head and shoulders showing; his zhiduo robe " +
      "and tiger-skin kilt lie folded on the ground beside the cauldron; Bajie bites his finger " +
      "with Sha Wujing " +
      "beside him. Deductions: Wukong drawn as a naked human, or still wearing his zhiduo " +
      "robe and tiger-skin kilt; blood, a dragon, or a date-pit nail in the cauldron; " +
      "beheading, disemboweling, a headless yellow-furred tiger, or a white-furred horned " +
      "deer drawn; Wukong stirring the oil with the golden-hooped rod.",
  },
  "xiyou-anim-046": {
    coreKey:
      "Wukong frolicking in the oil cauldron, with animated stove fire, boiling oil and oil " +
      "splashes, and rising heat",
    groundTruth:
      "Chapter 46, \"Heresy Flaunts Its Strength to Bully the True Dharma; The Mind-Monkey " +
      "Shows His Holy Power and Destroys the Deviants\". Under the oil cauldron \"a fierce " +
      "fire burned, bringing the oil to a boil\"; Wukong \"took off his cloth zhiduo robe and " +
      "slipped off his tiger-skin kilt\" and jumped into the cauldron, \"tumbling in the " +
      "waves and fighting the billows, playing just as if he were swimming\"; Bajie bites his " +
      "finger and praises him to Sha Wujing.",
    evaluationCriteria:
      "Full credit: In the cauldron of boiling oil Wukong, all monkey fur and bound with the " +
      "golden fillet, frolics with his head and shoulders showing, his robe and kilt folded " +
      "on the ground beside the cauldron, Bajie biting his finger and Sha Wujing beside him; the " +
      "stove " +
      "fire, the boiling oil and oil splashes, and the rising heat loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Wukong drawn as a naked human or still wearing his " +
      "robe and kilt; blood or a dragon in the cauldron; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-047": {
    coreKey:
      "Trial carry in the Chen family courtyard: Wukong as the boy and Bajie as the girl in a " +
      "red jacket and green cape, each seated on a red lacquer tray",
    groundTruth:
      "Chapter 47, \"The Holy Monk Is Blocked at Night by the Waters of the River of Heaven; " +
      "Metal and Wood, Moved to Mercy, Rescue the Little Children\". Wukong turns into " +
      "seven-year-old Guanbao and Bajie into eight-year-old Yichengjin; \"two red lacquer " +
      "trays were used, and the two were asked to sit in them\", and \"four young men lifted " +
      "the two tables and walked them about the courtyard\"; the girl wears a red ramie-silk " +
      "jacket shot with yellow.",
    evaluationCriteria:
      "Full credit: At night in the courtyard young men carry the two tables; on the red " +
      "trays the boy is joyful and the girl in a red jacket and green cape is anxious and " +
      "afraid, and the two old men look on. Deductions: The two children showing a monkey " +
      "face, a pig snout and big ears, or the golden fillet; Bajie holding the nine-toothed " +
      "rake; the demon appearing; the Tang Monk or Sha Wujing present.",
  },
  "xiyou-anim-047": {
    coreKey:
      "Trial carry of the boy and girl on red lacquer trays, with animated candle flames, " +
      "streamer banners, and incense smoke",
    groundTruth:
      "Chapter 47, \"The Holy Monk Is Blocked at Night by the Waters of the River of Heaven; " +
      "Metal and Wood, Moved to Mercy, Rescue the Little Children\". Wukong turns into " +
      "seven-year-old Guanbao and Bajie into eight-year-old Yichengjin, each seated on a red " +
      "lacquer tray, and \"four young men lifted the two tables and walked them about the " +
      "courtyard\"; the girl wears a red ramie-silk jacket shot with yellow and an " +
      "official-green satin cape.",
    evaluationCriteria:
      "Full credit: At night in the courtyard young men carry the two tables; on the red " +
      "trays the boy is joyful and the girl in a red jacket and green cape is anxious and " +
      "afraid, and the two old men look on; the candle flames, the streamer banners, and the " +
      "incense smoke loop smoothly, driven by SMIL or inline CSS. Deductions: The boy and " +
      "girl showing a monkey face, a pig snout, or the golden fillet; the demon appearing; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-048": {
    coreKey:
      "Walking west across the ice of the River of Heaven: three of the pilgrims carry " +
      "staffs and rods crosswise, Bajie shoulders the load with the rake held crosswise " +
      "at his waist, " +
      "and the horse's hooves are wrapped in straw",
    groundTruth:
      "Chapter 48, \"The Demon Stirs Up a Cold Wind and Heavy Snow Falls; The Monk, Longing " +
      "to Worship Buddha, Walks on Layered Ice\". After the snow the river is frozen for " +
      "eight hundred li; \"the elder carried his monk's staff crosswise, Pilgrim carried his " +
      "iron rod crosswise, Sha Wujing carried his demon-quelling precious staff crosswise, " +
      "and Bajie shouldered the luggage, his rake across his waist\"; the horse's hooves are " +
      "wrapped in straw against slipping.",
    evaluationCriteria:
      "Full credit: On the ice after the snow the four pilgrims and the horse travel west in " +
      "a line; three of them carry staffs and rod crosswise, Bajie has the load on his " +
      "shoulder and the rake held crosswise at his waist, and the straw-wrapped hooves are " +
      "recognizable. Deductions: The " +
      "ice cracking, people or the horse falling into the water, or the demon appearing; " +
      "drawn as a blizzard; the rake stuck upright; Wukong riding a cloud; Sha Wujing carrying " +
      "the load; the Tang " +
      "Monk wearing a cassock.",
  },
  "xiyou-anim-048": {
    coreKey:
      "Crossing the ice of the River of Heaven with staffs held crosswise, with animated " +
      "drifting snow, white breath mist, and mane and garment hems",
    groundTruth:
      "Chapter 48, \"The Demon Stirs Up a Cold Wind and Heavy Snow Falls; The Monk, Longing " +
      "to Worship Buddha, Walks on Layered Ice\". After the snow the river is frozen; \"the " +
      "elder carried his monk's staff crosswise, Pilgrim carried his iron rod crosswise, Sha " +
      "Wujing carried his demon-quelling precious staff crosswise, and Bajie shouldered the " +
      "luggage, his rake across his waist\"; the horse's hooves are wrapped in straw.",
    evaluationCriteria:
      "Full credit: On the ice the four pilgrims and the horse travel west in a line; the " +
      "staffs and rod carried crosswise by three of them, Bajie with the load on his " +
      "shoulder and the rake held crosswise at his waist, and the straw-wrapped hooves are " +
      "recognizable; the drifting snow, the " +
      "breath mist, and the mane and garment hems loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The ice cracking, or people or the horse falling into the water; the " +
      "rake " +
      "stuck upright; Sha Wujing carrying the load; the Tang Monk wearing a cassock; whole " +
      "figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-049": {
    coreKey:
      "Fish-Basket Guanyin: Guanyin, her toilette unfinished and barefoot, half-treading a " +
      "cloud, lifts the purple bamboo basket, and in it a goldfish flicks its tail",
    groundTruth:
      "Chapter 49, \"Sanzang Meets Disaster and Sinks to a Watery Dwelling; Guanyin Comes to " +
      "the Rescue and Appears with a Fish Basket\". Guanyin has not finished her toilette, " +
      "\"a brocade skirt tied loosely at her waist, both feet bare\"; she ties the basket " +
      "with a silk sash and, \"half-treading a cloud, cast it into the river\", and when she " +
      "lifts it, \"in the basket was a gleaming goldfish, still blinking its eyes and moving " +
      "its scales\".",
    evaluationCriteria:
      "Full credit: Guanyin, her hair loosely gathered in a single coil, in a short jacket " +
      "and brocade skirt and barefoot, half-treads a cloud and lifts the purple bamboo basket " +
      "by its silk sash, the goldfish in it recognizable; on the bank Wukong stands while " +
      "Bajie and Sha Wujing bow down. Deductions: Guanyin in white robes and a jeweled crown, " +
      "draped with pearl strands, holding the pure vase and willow sprig, or seated on a " +
      "lotus throne; standing on an Ao fish, or grabbing the fish bare-handed with no fish in " +
      "the basket; a humanoid demon " +
      "in the basket; the Tang Monk present.",
  },
  "xiyou-anim-049": {
    coreKey:
      "Fish-Basket Guanyin lifting the basket, with animated goldfish and dripping water, " +
      "hair and brocade skirt, and river waves",
    groundTruth:
      "Chapter 49, \"Sanzang Meets Disaster and Sinks to a Watery Dwelling; Guanyin Comes to " +
      "the Rescue and Appears with a Fish Basket\". Guanyin has not finished her toilette, " +
      "\"a brocade skirt tied loosely at her waist, both feet bare\"; she ties the basket " +
      "with a silk sash and casts it into the river, and when she lifts it, \"in the basket " +
      "was a gleaming goldfish, still blinking its eyes and moving its scales\".",
    evaluationCriteria:
      "Full credit: Guanyin, her toilette unfinished, in a short jacket and brocade skirt and " +
      "barefoot, half-treads a cloud and lifts the basket, the goldfish in it recognizable; " +
      "on the bank Wukong stands while Bajie and Sha Wujing bow down; the goldfish and " +
      "dripping water, the hair and brocade skirt, and the river waves loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: Guanyin in white robes and a jeweled crown, holding " +
      "the pure vase and willow sprig, seated on a lotus throne, or standing on an Ao fish; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-050": {
    coreKey:
      "Drawing a circle with the golden-hooped rod: Wukong touches the rod to the ground and " +
      "draws a circle line, the Tang Monk sits in the middle, Bajie and Sha Wujing stand in " +
      "attendance, and in the distance ominous clouds hang over towers",
    groundTruth:
      "Chapter 50, \"Feelings in Turmoil and Nature Yielding, All from Desire; Spirit Dulled " +
      "and Mind Stirred, They Meet the Demon Chief\". On a mountain road in deep winter, " +
      "Wukong takes the golden-hooped rod and \"drew a circle all around on the level ground " +
      "and asked the Tang Monk to sit in the middle\", with Bajie and Sha Wujing standing in " +
      "attendance left and right; \"far off they saw towers rising high in a mountain " +
      "hollow\", with ominous clouds faintly visible.",
    evaluationCriteria:
      "Full credit: On the snowy ground the circle line is clear; Wukong stands outside it " +
      "touching his rod to the ground, the Tang Monk sits inside, Bajie leading the horse and " +
      "Sha Wujing guarding the luggage stand in attendance on either side, and ominous clouds " +
      "churn over the distant towers. Deductions: The circle drawn as a light curtain or a " +
      "glowing barrier, or inscribed with talismanic script; a white ring or the demon " +
      "appearing in the sky; the Tang Monk already out of the circle, or Bajie and Sha Wujing " +
      "wearing the vests and bound; the Tang Monk wearing a cassock or a Vairocana hat.",
  },
  "xiyou-anim-050": {
    coreKey:
      "Wukong drawing a circle to protect his master, with animated falling snow, ominous " +
      "clouds, and robes and mane",
    groundTruth:
      "Chapter 50, \"Feelings in Turmoil and Nature Yielding, All from Desire; Spirit Dulled " +
      "and Mind Stirred, They Meet the Demon Chief\". On a mountain road in deep winter, " +
      "Wukong takes the golden-hooped rod and \"drew a circle all around on the level ground " +
      "and asked the Tang Monk to sit in the middle\", with Bajie and Sha Wujing standing in " +
      "attendance left and right; ominous clouds loom faintly over towers in a distant " +
      "mountain hollow.",
    evaluationCriteria:
      "Full credit: On the snowy ground the circle line is clear; Wukong stands outside it " +
      "touching his rod to the ground, the Tang Monk sits in the middle, and Bajie leading " +
      "the horse and Sha Wujing guarding the luggage stand in attendance; the falling snow, " +
      "the ominous clouds, and the robes and mane loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The circle drawn as a glowing barrier or inscribed with talismanic " +
      "script; the demon or a white ring appearing; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-051": {
    coreKey:
      "Two three-headed, six-armed figures face off: Nezha throws his six weapons, the demon " +
      "king tosses up the white ring and snares them, and Wukong is empty-handed",
    groundTruth:
      "Chapter 51, \"The Mind-Monkey Uses a Thousand Schemes in Vain; Water and Fire Fail to " +
      "Refine the Demon\". Nezha \"turned into three heads and six arms, holding six kinds of " +
      "weapons\", and the demon king also takes on three heads and six arms, \"took out that " +
      "gleaming white ring and tossed it into the air\", and \"snared the six weapons " +
      "down\"; Wukong's rod was snared away earlier.",
    evaluationCriteria:
      "Full credit: Two three-headed, six-armed figures face off; Nezha is in a brocade robe " +
      "and precious armor, the six weapons fall toward the white ring, the demon king has a " +
      "single horn and indigo hide, and Wukong looks on empty-handed. Deductions: Nezha " +
      "carrying the Universe Ring, the Red Armillary Sash, or the Fire-Tipped Spear, wearing " +
      "a lotus-leaf skirt, or standing on Wind Fire Wheels; the demon king without a single " +
      "horn; Wukong holding his rod or with three heads and six arms.",
  },
  "xiyou-anim-051": {
    coreKey:
      "Snaring the weapons at the mouth of Golden Helmet Cave, with animated weapons entering " +
      "the ring, fire-wheel flames, and the spinning white ring",
    groundTruth:
      "Chapter 51, \"The Mind-Monkey Uses a Thousand Schemes in Vain; Water and Fire Fail to " +
      "Refine the Demon\". Nezha \"turned into three heads and six arms, holding six kinds of " +
      "weapons\", and the demon king also takes on three heads and six arms and tosses up " +
      "the gleaming white ring; \"with a whoosh, it snared the six weapons down\"; Wukong is " +
      "empty-handed.",
    evaluationCriteria:
      "Full credit: Two three-headed, six-armed figures face off left and right, Nezha in a " +
      "brocade robe and precious armor and Wukong empty-handed; the weapons entering the " +
      "ring, the fire-wheel flames, and the spinning white ring loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: Nezha carrying the Universe Ring or the Red Armillary " +
      "Sash, or standing on Wind Fire Wheels; Wukong holding his rod; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-052": {
    coreKey:
      "The green ox revealed and its nose pierced: Laozi holds the plantain fan and leads the " +
      "ox by his belt tied to the diamond snare, and Wukong looks on empty-handed",
    groundTruth:
      "Chapter 52, \"Wukong Wreaks Havoc in Golden Helmet Cave; The Tathagata Covertly " +
      "Reveals the Owner\". Laozi comes along \"holding the plantain fan\"; \"with another " +
      "wave, the monster's strength failed and his sinews went numb, and he showed his " +
      "original form: a green ox\"; the diamond snare \"pierced the monster's nose\", and " +
      "Laozi \"untied the belt of his robe, fastened it to the snare, and led him in hand\"; " +
      "Wukong is empty-handed.",
    evaluationCriteria:
      "Full credit: Laozi, white-bearded in a Taoist robe, holds a plantain fan of ordinary " +
      "size and leads by the belt; the single-horned green ox has a white ring through its " +
      "nose with the belt tied to the ring; Wukong looks on empty-handed. Deductions: The fan " +
      "drawn as a giant plantain fan in the style of Princess Iron Fan's; Laozi holding a " +
      "whisk, riding the ox, or with an immortal crane beside him; the demon king still in " +
      "human form holding a spear; Wukong holding his rod.",
  },
  "xiyou-anim-052": {
    coreKey:
      "Laozi leading the green ox by its pierced nose, with animated fanning and robe " +
      "sleeves, belt, and plants and cloud vapor",
    groundTruth:
      "Chapter 52, \"Wukong Wreaks Havoc in Golden Helmet Cave; The Tathagata Covertly " +
      "Reveals the Owner\". Laozi comes along \"holding the plantain fan\", and with another " +
      "wave the demon king shows his original form as a green ox; the diamond snare " +
      "\"pierced the monster's nose\", and Laozi \"untied the belt of his robe, fastened it " +
      "to the snare, and led him in hand\"; Wukong's iron rod has already been snared away, " +
      "and he is empty-handed.",
    evaluationCriteria:
      "Full credit: Laozi holds a plantain fan of ordinary size and leads by the belt; the " +
      "single-horned green ox has a white ring through its nose with the belt tied to the " +
      "ring; Wukong looks on empty-handed; the fanning and robe sleeves, the belt going taut " +
      "and slack, and the plants and cloud vapor loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The fan drawn as a giant fan in the style of Princess Iron Fan's; " +
      "Laozi holding a whisk or riding the ox; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-053": {
    coreKey:
      "Drinking the Water of the Mother-and-Child River by mistake: the Tang Monk and Bajie, " +
      "bellies swollen, are helped into the cottage, while an old woman spinning hemp " +
      "outside the door watches with a smile",
    groundTruth:
      "Chapter 53, \"The Chan Master Eats and Drinks and Conceives a Ghostly Pregnancy; The " +
      "Yellow Dame Fetches Water to Dissolve the Demonic Fetus\". In early spring, after " +
      "drinking the Water of the Mother-and-Child River, the Tang Monk and Bajie have belly " +
      "pains and their bellies swell; at the roadside cottage \"two bundles of straw hung " +
      "from a treetop\", and outside the door an old woman \"sat upright on a straw stool, " +
      "spinning hemp\"; \"Pilgrim supported the Tang Monk, and Sha Wujing helped Bajie\".",
    evaluationCriteria:
      "Full credit: The Tang Monk and Bajie have swollen bellies, sallow faces, and knitted " +
      "brows; Wukong supports the Tang Monk and Sha Wujing helps Bajie toward the thatched " +
      "cottage; outside the door the old woman sits on a straw stool spinning hemp with a " +
      "smile; the straw bundles and the early-spring willow green are recognizable. " +
      "Deductions: Wukong or Sha Wujing also with a big belly; the Tang Monk wearing the " +
      "brocade cassock or a Vairocana hat; a ferry boat, river water, or childbirth drawn; " +
      "the old woman drawn as a richly dressed noblewoman.",
  },
  "xiyou-anim-053": {
    coreKey:
      "Pregnant from the Water of the Mother-and-Child River, with animated straw bundles and " +
      "willow twigs, swallows and petals, and hemp thread",
    groundTruth:
      "Chapter 53, \"The Chan Master Eats and Drinks and Conceives a Ghostly Pregnancy; The " +
      "Yellow Dame Fetches Water to Dissolve the Demonic Fetus\". In early spring, with " +
      "swallows twittering and willows budding, the Tang Monk and Bajie drink the Water of " +
      "the Mother-and-Child River and their bellies ache and swell; \"Pilgrim supported the " +
      "Tang Monk, and Sha Wujing helped Bajie\"; outside the cottage door an old woman \"sat " +
      "upright on a straw stool, spinning hemp\".",
    evaluationCriteria:
      "Full credit: The Tang Monk and Bajie have swollen bellies, Wukong and Sha Wujing, one " +
      "in front and one behind, help them toward the thatched cottage, and the old woman " +
      "spins hemp outside the door with a smile; the straw bundles and willow twigs, the " +
      "swallows and petals, and the hemp thread loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Wukong or Sha Wujing also with a big belly; a ferry boat, river water, or " +
      "childbirth drawn; whole figures drifting; a purely static image, use of JavaScript, " +
      "or XML parse errors.",
  },
  "xiyou-054": {
    coreKey:
      "Outside Yingyang Post House: the queen steps down from her carriage and catches hold " +
      "of the Tang Monk before the incense table to invite him, and the Tang Monk, in a " +
      "banded robe, is bashful",
    groundTruth:
      "Chapter 54, \"The Dharma-Nature, Going West, Comes to the Woman Country; The " +
      "Mind-Monkey Devises a Plan to Escape the Allure of Romance\". The queen's carriage " +
      "arrives at Yingyang Post House outside the city; she \"rolled up the curtain and " +
      "stepped down from the carriage\" and \"caught hold of Sanzang\", inviting him onto the " +
      "dragon carriage; the Tang Monk is \"the one in the banded robe before the incense " +
      "table outside the post-house gate\", \"his ears red and face flushed, too bashful to " +
      "raise his head\".",
    evaluationCriteria:
      "Full credit: Before the incense table outside the post-house gate, the queen catches " +
      "the Tang Monk's sleeve to invite him; the Tang Monk, in a plain banded robe, has red " +
      "ears and a flushed face; Wukong coaxes him and Bajie drools; the dragon-and-phoenix " +
      "carriage with its silk canopies and palace fans, and the female officials and palace " +
      "maids, are recognizable. Deductions: Set before a city gate or a palace; the Tang Monk " +
      "wearing the brocade cassock or a Vairocana hat, or holding prayer beads; the queen " +
      "wearing a phoenix crown, or holding both of the Tang Monk's hands; golden bells and " +
      "tassels hanging from the carriage; the Tang Monk already seated in the carriage.",
  },
  "xiyou-anim-054": {
    coreKey:
      "The queen greeting him at Yingyang Post House, with animated silk canopies and " +
      "banners, red silk gauze, and incense smoke",
    groundTruth:
      "Chapter 54, \"The Dharma-Nature, Going West, Comes to the Woman Country; The " +
      "Mind-Monkey Devises a Plan to Escape the Allure of Romance\". The queen's carriage " +
      "arrives at Yingyang Post House; she \"rolled up the curtain and stepped down from the " +
      "carriage\" and \"caught hold of Sanzang\", inviting him onto the dragon carriage; the " +
      "carriage has silk canopies, palace fans, and five-colored banners, and red silk gauze " +
      "hangs aslant from the queen's hair; the Tang Monk is \"his ears red and face flushed, " +
      "too bashful to raise his head\".",
    evaluationCriteria:
      "Full credit: Before the incense table outside the post-house gate, the queen catches " +
      "the Tang Monk's sleeve; the Tang Monk, in plain clothes, has red ears and a flushed " +
      "face; Wukong coaxes him and Bajie drools; the silk canopies and banners, the red silk " +
      "gauze, and the incense smoke loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "The Tang Monk wearing the brocade cassock or a Vairocana hat, or telling prayer beads; " +
      "the queen wearing a phoenix crown; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-055": {
    coreKey:
      "One crow of the rooster reveals the scorpion: a great double-combed rooster crows with " +
      "head held high, and the dark brown scorpion's pincers, legs, and tail hook are fully " +
      "shown",
    groundTruth:
      "Chapter 55, \"Lustful Evil Wantonly Toys with Tang Sanzang; The Upright Nature, " +
      "Through Cultivation, Keeps the Body Unspoiled\". The Pleiades Star Officer \"turned " +
      "out to be a great double-combed rooster; raising his head, some six or seven Chinese " +
      "feet tall, he crowed once at the demon\"; the demon reveals itself as \"a scorpion " +
      "spirit about the size of a pipa\"; in this chapter Bajie wears a black brocade zhiduo " +
      "robe.",
    evaluationCriteria:
      "Full credit: A double-combed rooster taller than a man crows at the scorpion with head " +
      "held high; the great dark brown scorpion has one pair of large pincers, four pairs of " +
      "walking legs, and its tail hook curled up; Wukong with his rod and Bajie in a black " +
      "zhiduo robe with his rake look back from beside the stone screen. Deductions: Drawn as " +
      "a beauty playing or holding a pipa; the rooster drawn in human form or as half man, " +
      "half rooster; the scorpion gripping a three-pronged fork in its hands; Bajie's zhiduo " +
      "robe not black; the scorpion drawn dead or crushed by the rake; the Tang Monk " +
      "appearing.",
  },
  "xiyou-anim-055": {
    coreKey:
      "One crow of the rooster reveals the scorpion, with animated neck feathers and beak, " +
      "tail hook and pincers, and grass",
    groundTruth:
      "Chapter 55, \"Lustful Evil Wantonly Toys with Tang Sanzang; The Upright Nature, " +
      "Through Cultivation, Keeps the Body Unspoiled\". The Pleiades Star Officer shows his " +
      "original form, \"turned out to be a great double-combed rooster\", and \"crowed once " +
      "at the demon\"; the demon reveals itself as \"a scorpion spirit about the size of a " +
      "pipa\", its three-pronged fork having been its two pincer legs all along.",
    evaluationCriteria:
      "Full credit: A double-combed rooster taller than a man crows at the scorpion, the dark " +
      "brown scorpion's pincers and tail hook fully shown, with Wukong and Bajie beside the " +
      "stone screen; the neck feathers and beak, the tail hook and pincers, and the grass " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Drawn as a beauty playing a " +
      "pipa; the rooster drawn in human form; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "xiyou-056": {
    coreKey:
      "A dragonfly shaking a stone pillar: the little monk in a black robe looks on as the " +
      "two bandit chiefs hug an iron rod as thick as a bowl's mouth and cannot pull it up",
    groundTruth:
      "Chapter 56, \"The Spirit in Rage Slays the Bandits; The Way Confused, the Mind-Monkey " +
      "Is Let Go\". Wukong turns into \"a neat and clean little monk, wearing a black robe, " +
      "only twice eight years old\"; the needle \"with a shake turned into a rod as thick as " +
      "a bowl\", and the two bandits grab for it, \"just like a dragonfly shaking a stone " +
      "pillar, unable to budge it the least bit\".",
    evaluationCriteria:
      "Full credit: The young little monk, shaven-headed in a black robe, looks on; an iron " +
      "rod as thick as a bowl's mouth stands planted in the road; the two bandit chiefs, with " +
      "red hair, yellow beards, and tiger-skin headscarves, hug the rod and cannot pull it " +
      "up; the lackeys watch around them; early-summer vegetation. Deductions: The little " +
      "monk drawn with a monkey face, wearing the golden fillet, or wearing the tiger-skin " +
      "kilt; the rod as thick as a well curb or already swung; someone fallen and bleeding; " +
      "the Tang Monk, Bajie, or Sha Wujing appearing; the bandit chiefs drawn as demons.",
  },
  "xiyou-anim-056": {
    coreKey:
      "Two bandits cannot budge the rod, with animated mugwort and bamboo, battle-skirt fur " +
      "trim, and fine dust",
    groundTruth:
      "Chapter 56, \"The Spirit in Rage Slays the Bandits; The Way Confused, the Mind-Monkey " +
      "Is Let Go\". In the season of the Duanyang Festival, Wukong turns into \"a neat and " +
      "clean little monk, wearing a black robe\" and makes the needle \"turn into a rod as " +
      "thick as a bowl\"; the two bandits grab for it, \"just like a dragonfly shaking a " +
      "stone pillar, unable to budge it the least bit\".",
    evaluationCriteria:
      "Full credit: The little monk, shaven-headed in a black robe, looks on as the two " +
      "bandit chiefs hug an iron rod as thick as a bowl's mouth and cannot pull it up, the " +
      "lackeys watching around them; the mugwort and bamboo, the battle-skirt fur trim, and " +
      "the fine dust loop smoothly, driven by SMIL or inline CSS. Deductions: The little monk " +
      "drawn with a monkey face or wearing the golden fillet; someone fallen and bleeding; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-057": {
    coreKey:
      "Outside Water Curtain Cave the false Pilgrim sits high on the stone terrace reading " +
      "the travel rescript aloud, Sha Wujing steps forward to challenge him, and the monkeys " +
      "crowd around",
    groundTruth:
      "Chapter 57, \"The True Pilgrim Pours Out His Grievance at Potalaka Mountain; The False " +
      "Monkey King Copies the Documents at Water Curtain Cave\". Sha Wujing reaches " +
      "Flower-Fruit Mountain and sees \"Pilgrim Sun sitting high on the stone terrace, " +
      "holding a sheet of paper with both hands and reading aloud in a clear voice\"; Sha " +
      "Wujing steps forward and calls, \"Elder Brother, why are you reading Master's travel " +
      "rescript?\", and \"the monkeys all closed in around him\".",
    evaluationCriteria:
      "Full credit: On the stone terrace the false Pilgrim spreads the paper with both hands " +
      "and reads the rescript, identical in appearance to Wukong; Sha Wujing, shaven-headed " +
      "with an indigo face, holds his staff and challenges him; the monkeys crowd around; the " +
      "cave front on Flower-Fruit Mountain is recognizable. Deductions: The false Pilgrim " +
      "with extra ears or any distinguishing mark; Sha Wujing holding a crescent-moon spade; " +
      "wine and food laid out on the stone terrace; a false Tang Monk, a false Bajie, or " +
      "fighting drawn; the Tang Monk or Bajie appearing.",
  },
  "xiyou-anim-057": {
    coreKey:
      "The false Pilgrim reading the rescript on the stone terrace, with animated paper, " +
      "cloud vapor, and pine branches and kilt edge",
    groundTruth:
      "Chapter 57, \"The True Pilgrim Pours Out His Grievance at Potalaka Mountain; The False " +
      "Monkey King Copies the Documents at Water Curtain Cave\". Sha Wujing sees \"Pilgrim " +
      "Sun sitting high on the stone terrace, holding a sheet of paper with both hands and " +
      "reading aloud in a clear voice\" from the travel rescript; he steps forward and " +
      "demands, \"Why are you reading Master's travel rescript?\"; \"the monkeys all closed " +
      "in around him\".",
    evaluationCriteria:
      "Full credit: On the stone terrace the false Pilgrim spreads the paper and reads the " +
      "rescript, identical in appearance to Wukong; Sha Wujing holds his staff and challenges " +
      "him; the monkeys crowd around; the paper, the cloud vapor, and the pine branches and " +
      "kilt edge loop smoothly, driven by SMIL or inline CSS. Deductions: The false Pilgrim " +
      "with any distinguishing mark; Sha Wujing holding a crescent-moon spade; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-058": {
    coreKey:
      "Two minds contending: two identical Wukongs fight on the clouds, while the Tathagata " +
      "has left his seat and stands amid a profusion of heavenly flowers",
    groundTruth:
      "Chapter 58, \"Two Minds Throw the Great Cosmos into Turmoil; One Body Can Hardly " +
      "Cultivate True Nirvana\". \"There were indeed two Pilgrims, shouting to heaven and " +
      "earth as they fought their way to the sacred precinct of Thunderclap\", their golden " +
      "fillets and clothing identical to the last hair; the Tathagata \"sent down heavenly " +
      "flowers scattering everywhere, then left his precious throne\" and said to the " +
      "assembly below the platform, \"Behold the two minds coming here in contention.\"",
    evaluationCriteria:
      "Full credit: On the clouds two identical Wukongs fight with rods; below, the " +
      "Tathagata has left his seat and stands amid a profusion of heavenly flowers, and the " +
      "assembly gathers below the lotus platform looking up. Deductions: The Tathagata " +
      "seated upright, holding an alms bowl, or covering a bee with a golden bowl; the " +
      "assembly lined up on both sides; Guanyin present; distinguishing marks on the two " +
      "monkeys; the Tang Monk and his disciples present.",
  },
  "xiyou-anim-058": {
    coreKey:
      "Two minds contending at Thunderclap Monastery, with animated heavenly flowers, cloud " +
      "vapor, and garment hems",
    groundTruth:
      "Chapter 58, \"Two Minds Throw the Great Cosmos into Turmoil; One Body Can Hardly " +
      "Cultivate True Nirvana\". The two Pilgrims, \"shouting to heaven and earth, fought " +
      "their way to the sacred precinct of Thunderclap\", identical to the last hair; the " +
      "Tathagata \"sent down heavenly flowers scattering everywhere, then left his precious " +
      "throne\", and the assembly gathers below the seven-jeweled lotus platform.",
    evaluationCriteria:
      "Full credit: Two identical Wukongs fight on the clouds, the Tathagata has left his " +
      "seat and stands, and the assembly gathers below the lotus platform; the heavenly " +
      "flowers, the cloud vapor, and the garment hems loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The Tathagata seated upright or holding an alms bowl, or the bowl " +
      "giving off golden light; the assembly lined up on both sides; Guanyin present; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-059": {
    coreKey:
      "One fan at dusk outside Plantain Cave: Rakshasi, in kerchief and cloud robe, swings " +
      "the fan, and Wukong is fanned head over heels off the ground",
    groundTruth:
      "Chapter 59, \"Tang Sanzang's Road Is Blocked at the Flaming Mountain; Pilgrim Sun's " +
      "First Attempt at the Plantain Fan\". Rakshasi, her head wrapped in a kerchief with " +
      "round floral patterns and wearing a quilted-brocade cloud robe, fights until \"the sun " +
      "sank in the west\", then \"took out the plantain fan, gave it a shake, and with one " +
      "fan of dark wind blew Pilgrim away without a trace\", \"just like dead leaves tumbling " +
      "in a whirlwind\".",
    evaluationCriteria:
      "Full credit: Outside the cave at dusk, Rakshasi, in kerchief and cloud robe, grips a " +
      "sword in one hand and swings the big plantain-leaf fan with the other, and Wukong, " +
      "holding his rod, is fanned head over heels off the ground. Deductions: The fan drawn " +
      "with an iron fan face; Rakshasi in armor and helmet; the Flaming Mountain or " +
      "fire-quenching drawn; Wukong turned into a tiny insect entering her belly; the Bull " +
      "Demon King appearing.",
  },
  "xiyou-anim-059": {
    coreKey:
      "Rakshasi's one fan of dark wind, with animated fallen leaves and dust, kerchief and " +
      "sashes, and pines and bamboo",
    groundTruth:
      "Chapter 59, \"Tang Sanzang's Road Is Blocked at the Flaming Mountain; Pilgrim Sun's " +
      "First Attempt at the Plantain Fan\". They fight until \"the sun sank in the west\"; " +
      "Rakshasi \"took out the plantain fan, gave it a shake, and with one fan of dark " +
      "wind\" blew Wukong away \"just like dead leaves tumbling in a whirlwind\"; her head is " +
      "wrapped in a kerchief with round floral patterns, and she wears a quilted-brocade " +
      "cloud robe.",
    evaluationCriteria:
      "Full credit: Rakshasi, in kerchief and cloud robe, grips her sword and swings the " +
      "fan, and Wukong, holding his rod, is fanned head over heels off the ground; the fallen " +
      "leaves and dust, the kerchief and sashes, and the pines and bamboo loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The fan drawn as iron; Rakshasi in armor; " +
      "the Flaming Mountain or fire-quenching drawn; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-060": {
    coreKey:
      "The second attempt at the plantain fan succeeds: Wukong, in his true form, treads a " +
      "cloud with the genuine fan, twelve Chinese feet long, on his shoulder",
    groundTruth:
      "Chapter 60, \"The Bull Demon King Breaks Off the Battle to Attend a Splendid Feast; " +
      "Pilgrim Sun's Second Attempt at the Plantain Fan\". Wukong leaps onto a high mountain " +
      "and \"spat out the fan to try out the method\"; the fan grows twelve Chinese feet " +
      "long, \"with thirty-six strands of red silk running through it like veins and " +
      "channels\"; not knowing how to shrink it, he \"had no choice but to hoist it onto his " +
      "shoulder\".",
    evaluationCriteria:
      "Full credit: On the high mountain Wukong in his true form treads a cloud, beaming with " +
      "joy, with the big plantain-leaf-shaped fan, twelve Chinese feet long, on his " +
      "shoulder; the vein-like red silk strands and the auspicious light are recognizable, " +
      "and the Flaming Mountain appears only in the distance. Deductions: Drawn as fanning " +
      "or quenching the fire, or Wukong standing in a sea of fire; Wukong with ox horns, in " +
      "the guise of the Bull Demon King, or riding a beast; the fan drawn as a small fan the " +
      "size of an apricot leaf; Rakshasi, the Bull Demon King, or the Tang Monk and his " +
      "disciples appearing; holding the iron rod.",
  },
  "xiyou-anim-060": {
    coreKey:
      "Wukong shouldering the plantain fan, with animated auspicious light, red silk sheen, " +
      "and auspicious clouds",
    groundTruth:
      "Chapter 60, \"The Bull Demon King Breaks Off the Battle to Attend a Splendid Feast; " +
      "Pilgrim Sun's Second Attempt at the Plantain Fan\". On the high mountain Wukong " +
      "\"spat out the fan to try out the method\"; the fan grows twelve Chinese feet long, " +
      "\"with thirty-six strands of red silk\", amid auspicious light and vapor; not knowing " +
      "the spell to shrink it, he \"had no choice but to hoist it onto his shoulder\".",
    evaluationCriteria:
      "Full credit: Wukong in his true form treads a cloud with the big plantain-leaf-shaped " +
      "fan, twelve Chinese feet long, on his shoulder, the red silk strands like veins, and " +
      "the Flaming Mountain appears only in the distance; the auspicious light, the red silk " +
      "sheen, and the auspicious clouds loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Drawn as fanning or quenching the fire; Wukong with ox horns; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
};
