/**
 * English candidate labels and evaluation criteria for Dream of the Red Chamber chapters 73-84,
 * translated entry-by-entry from src/core/classics/honglou/ch073-084.ts.
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** Static candidate id -> English label; animated candidates append "(Animated)" via localizeCandidateLabel */
export const HONGLOU_CH073_084_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-073": "Ch. 73 · Yingchun Declines to Pursue the Missing Golden Phoenix",
  "honglou-074": "Ch. 74 · Tanchun Holds a Candle and Denounces the Night Raid",
  "honglou-075": "Ch. 75 · Enjoying the Mid-Autumn Moon Banquet at the Pavilion of Green Summit",
  "honglou-076": "Ch. 76 · Linking Verses by Night at Concave Crystal Sanctuary",
  "honglou-077": "Ch. 77 · Qingwen Cuts Her Nails and Bestows Her Old Jacket",
  "honglou-078": "Ch. 78 · Baoyu Recites the Hibiscus Elegy beneath the Moon",
  "honglou-079": "Ch. 79 · Baoyu Mournfully Inscribes the Song of Purple Water-Chestnut Isle",
  "honglou-080": "Ch. 80 · Priest Wang Fabricates the Jealousy-Curing Decoction",
  "honglou-081": "Ch. 81 · Four Beauties Fish for Minnows at Smartweed Shoal",
  "honglou-082": "Ch. 82 · Savoring Longjing Tea and Discussing Books at Bamboo Lodge",
  "honglou-083": "Ch. 83 · The Imperial Physician Takes the Pulse at Bamboo Lodge",
  "honglou-084": "Ch. 84 · Testing Literary Talent and Setting the Theme at Mengpo Studio",
};

export const HONGLOU_LABELS_CH073_084_EN = HONGLOU_CH073_084_LABELS_EN;

/** Static and animated candidate id -> English evaluation standards */
export const HONGLOU_CH073_084_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-073": {
    coreKey:
      "Upper chamber of Brocade Splendor: Yingchun reclines reading the Treatise on " +
      "Action and Retribution, Tanchun presses the table rebuking insolent " +
      "servants, and Ping'er lifts the curtain exerting authority",
    groundTruth:
      "Chapter 73, \"The Simple Maid Mistakenly Finds the Embroidered Spring Pouch; " +
      "the Cowardly Young Mistress Declines to Inquire after the Piled-Gold " +
      "Phoenix\". Yingchun's wet-nurse pawned the piled-gold phoenix and the nurse's " +
      "daughter-in-law creates an uproar; Yingchun \"took up a copy of the Treatise " +
      "on Action and Retribution to read... as though she heard nothing\". Tanchun " +
      "sternly rebukes the insolent servants, while Ping'er lifts the curtain " +
      "entering to dismiss them and promises to redeem the ornament. The simple " +
      "maid finding the pouch happens earlier.",
    evaluationCriteria:
      "Full credit: Upper chamber of Brocade Splendor Pavilion on Purple " +
      "Water-Chestnut Isle on an early autumn morning; on the left of the frame " +
      "Yingchun in a drooping horse-mane bun and pale lotus-root jacket reclines " +
      "reading the Taoist scripture; in the middle of the frame Tanchun in a pale " +
      "purple long jacket sits pressing the table sternly rebuking insolent " +
      "servants; on the right of the frame Ping'er in a celestial-blue jacket lifts " +
      "the curtain asserting authority (compositional convention, not testing " +
      "textual left/right). Deductions: Gambling beatings, the simple maid finding " +
      "the pouch, or violent quarrel shown; Manchu two-handle headdresses or Qing " +
      "queues.",
  },
  "honglou-074": {
    coreKey:
      "Night search in Autumn Freshness Studio: Tanchun in her broad purple robe " +
      "stands upright before the large table denouncing internal destruction, " +
      "Xifeng leans smiling to mediate, and Mother Wang Shanbao cowers in the " +
      "shadow",
    groundTruth:
      "Chapter 74, \"Misled by Slanderous Tongues, the Garden of Total Vision Is " +
      "Raided by Night; Keeping Up Her Pride, Xichun Cuts Off the Ningguo Mansion\". " +
      "When the search party arrives at Autumn Freshness Studio, \"candles blazed in " +
      "Tanchun's chamber... wearing only her inner clothes covered with a broad " +
      "purple robe\", she orders the doors opened and boxes displayed, lamenting " +
      "\"such a great family... must first be destroyed from within before it falls " +
      "completely\". Xifeng smiles placatingly. Mother Wang Shanbao being slapped " +
      "and searching Siqi occur later.",
    evaluationCriteria:
      "Full credit: The spacious main hall of Autumn Freshness Studio illuminated " +
      "by candles on a late autumn night; in the middle of the frame Tanchun in a " +
      "broad purple robe stands upright before the table sternly condemning the " +
      "self-destructive raid with open luggage displayed; on the left of the frame " +
      "Xifeng half-reclines in a chair smiling placatingly; on the right of the " +
      "frame Mother Wang Shanbao cowers in the shadow of the doorway screen " +
      "(compositional convention, not testing textual left/right). Deductions: " +
      "Qingwen overturning her chest, slap on the face, or searching illicit goods " +
      "shown; Manchu two-handle headdresses or Qing queues.",
  },
  "honglou-075": {
    coreKey:
      "Round banquet under the Mid-Autumn moon at the Pavilion of Green Summit: " +
      "Grandmother Jia in a crane cloak sits at the head of the table sighing, Jia " +
      "Zheng holding a cassia sprig bows telling a humorous tale to please her, and " +
      "Baoyu stands holding a cup",
    groundTruth:
      "Chapter 75, \"At the Evening Banquet an Ominous Sign Gives Forth a Mournful " +
      "Sound; Viewing the Mid-Autumn Moon White Hairs Lament the Diminished " +
      "Gathering\". On the fifteenth of the eighth month, Grandmother Jia leads the " +
      "family to the highest mountain ridge at the Pavilion of Green Summit, " +
      "setting a round banquet to view the moon and passing a cassia sprig to the " +
      "beat of a drum; the drum stops at Jia Zheng, who drinks and tells a joke " +
      "about a henpecked husband to amuse Grandmother Jia. Jia She's mocking tale " +
      "happens later.",
    evaluationCriteria:
      "Full credit: The open terrace of the Pavilion of Green Summit on the " +
      "mountain ridge at midnight of Mid-Autumn; a bright full moon in the clear " +
      "sky; in the middle of the frame Grandmother Jia in a slate-blue crane cloak " +
      "sits at the round table; on the left of the frame Jia Zheng holding a cassia " +
      "sprig bows telling a story; on the right of the frame young Baoyu holds a " +
      "gold wine goblet standing beside (compositional convention, not testing " +
      "textual left/right). Deductions: Mournful sighs in the ancestral shrine or " +
      "Jia She's departure shown; linking verses at Concave Crystal Sanctuary " +
      "shown; Qing official caps, horse-hoof cuffs, or queues.",
  },
  "honglou-076": {
    coreKey:
      "Water terrace at Concave Crystal Sanctuary: Xiangyun leaning on the " +
      "balustrade composes the crane line, Daiyu sitting on the stool matches the " +
      "flower-spirit verse, a white crane startles across the water, and Miaoyu " +
      "emerges from behind the rock",
    groundTruth:
      "Chapter 76, \"At the Hall of Green Summit Listening to the Flute Evokes " +
      "Melancholy; At Concave Crystal Sanctuary Linking Verses Mourns Solitude\". " +
      "After the banquet disperses, Xiangyun and Daiyu visit the waterside terrace " +
      "of Concave Crystal Sanctuary to link couplets; a stone thrown into water " +
      "startles a white crane, inspiring Xiangyun's line \"Cold pond carries the " +
      "crane's shadow\", to which Daiyu responds \"Chilly moon buries the flower's " +
      "soul\". Miaoyu emerges from behind the rocks in high praise. Proceeding to " +
      "Green Bower Nunnery occurs later.",
    evaluationCriteria:
      "Full credit: Waterside terrace of Concave Crystal Sanctuary late on " +
      "Mid-Autumn night; withered lotus reflected in rippling water; on the left of " +
      "the frame Xiangyun with a round silk fan leans on the balustrade chanting; " +
      "in the middle of the frame Daiyu draped in a moon-white satin cape sits on a " +
      "wicker stool contemplating her verse; a white crane takes flight across the " +
      "pond; on the right of the frame Miaoyu in nun attire emerges smiling in " +
      "praise (compositional convention, not testing textual left/right). " +
      "Deductions: Weeping or spitting blood shown; flute playing at Green Summit " +
      "shown; Manchu hairstyles or queues.",
  },
  "honglou-077": {
    coreKey:
      "Earthen bed in a southern alley cottage: Qingwen holding silver scissors " +
      "cuts her two-inch fingernails and bestows her old red damask jacket, while " +
      "Baoyu kneels holding a silk kerchief in tears",
    groundTruth:
      "Chapter 77, \"The Fair Actor Cuts Ties of Passion and Retires to Water-Moon " +
      "Nunnery; The Pretty Maid Bears Wrong and Dies Untimely\". Baoyu sneaks out at " +
      "night to visit dying Qingwen in a southern alley; indignant at the false " +
      "accusations, Qingwen clips off the two long scallion-tube fingernails from " +
      "her left hand, removes her inner red damask jacket to exchange with Baoyu, " +
      "vowing mutual purity before death. Her sister-in-law demanding money occurs " +
      "later.",
    evaluationCriteria:
      "Full credit: Autumn rainy night in a southern city cottage with a celadon " +
      "oil lamp; on the left of the frame Qingwen in a loose bun and white " +
      "under-jacket reclines on an earthen bed cutting her long nails and bestowing " +
      "her red jacket; on the right of the frame Baoyu half-kneels holding a plain " +
      "kerchief in tears to receive them (compositional convention, not testing " +
      "textual left/right). Deductions: Disrobed nudity or bedchamber indecency; " +
      "coughing blood or death throes shown; Lady Wang expelling servants shown; " +
      "Manchu two-handle headdresses or Qing queues.",
  },
  "honglou-078": {
    coreKey:
      "Hibiscus flowers by the pool behind the House of Green Delights: Baoyu " +
      "stands before a jade table unrolling ice-gauze to chant the elegy, and Daiyu " +
      "steps smiling from the floral shadows",
    groundTruth:
      "Chapter 78, \"The Old Scholar at Leisure Solicits the Ballad of the Virtuous " +
      "Heroine; The Foolish Boy Fabricates the Elegy for the Hibiscus Spirit\". " +
      "Believing Qingwen has become the Hibiscus Flower Goddess, Baoyu prepares " +
      "four pure offerings and recites his Elegy for the Hibiscus Maiden before the " +
      "blossoming hibiscus tree at night; Daiyu emerges from behind the blooms " +
      "praising the work and suggests altering the verse to \"beneath the red-gauze " +
      "window\". Daiyu turning pale occurs later.",
    evaluationCriteria:
      "Full credit: Blossoming hibiscus trees by the pool behind the House of Green " +
      "Delights on a late autumn moonlit night; on the left of the frame Baoyu in a " +
      "moon-white robe stands before a white jade table reciting from an ice-gauze " +
      "scroll, with incense burning in a white censer; on the right of the frame " +
      "Daiyu in a pale purple jacket and cloak steps gracefully from behind the " +
      "hibiscus flowers (compositional convention, not testing textual left/right). " +
      "Deductions: Funeral catafalques, spirits, or corpses shown; banquet " +
      "recitation of the Virtuous Heroine shown; bright red ceremonial robes or " +
      "queues.",
  },
  "honglou-079": {
    coreKey:
      "Smartweed waterside of Purple Water-Chestnut Isle: Baoyu leans against the " +
      "rock looking back after chanting the song, and Xiangling holding a " +
      "handkerchief claps her hands smiling and asking why he is daydreaming",
    groundTruth:
      "Chapter 79, \"Xue Wenlong Regrets Marrying the Hedong Lioness; Jia Yingchun " +
      "Is Mistakenly Wed to the Zhongshan Wolf\". Yingchun is moved out to prepare " +
      "for her wedding; Baoyu wanders grief-stricken to Purple Water-Chestnut Isle, " +
      "and seeing closed windows and withered lotus, improvises the Song of Purple " +
      "Water-Chestnut Isle; Xiangling passing by claps her hands laughing and asks " +
      "why he is daydreaming again. Xue Pan wedding Xia Jingui occurs later.",
    evaluationCriteria:
      "Full credit: Waterside of Purple Water-Chestnut Isle in late autumn " +
      "twilight; closed windows, smartweed, and reed leaves; on the left of the " +
      "frame Baoyu in a slate-blue robe leans on a rock looking back in melancholy; " +
      "on the right of the frame Xiangling in a lotus-root jacket and grass-green " +
      "skirt holds a kerchief clapping her hands and inquiring with a smile " +
      "(compositional convention, not testing textual left/right). Deductions: " +
      "Domestic violence, Xia Jingui raging, or Xiangling being beaten shown; " +
      "bridal sedan chair shown; Manchu headdresses or queues.",
  },
  "honglou-080": {
    coreKey:
      "Quiet chamber of the Daoist cloister at Tianqi Temple: Priest Wang " +
      "brandishes a fly-whisk spinning an absurd tale of the pear jealousy-curing " +
      "soup, Baoyu reclines laughing, and Mingyan holding incense bursts into " +
      "laughter",
    groundTruth:
      "Chapter 80, \"Fair Xiangling Suffers the Stick from Her Covetous Husband; " +
      "Daoist Wang Babbles a Recipe for a Jealous Wife\". Baoyu visits Tianqi Temple " +
      "to offer incense and rests in a quiet room; he asks Priest Wang whether " +
      "plaster can cure jealousy, and the priest jokingly invents a soup of autumn " +
      "pears and dried orange peel, saying \"when one dies at a hundred, how could " +
      "she still be jealous?\", making Baoyu and Mingyan roar with laughter. " +
      "Xiangling being beaten occurs earlier.",
    evaluationCriteria:
      "Full credit: Quiet Daoist room at Tianqi Temple on a clear autumn morning; " +
      "on the left of the frame Baoyu in a purple-red robe reclines on a bamboo " +
      "couch laughing with hand on his knee; in the middle of the frame Priest Wang " +
      "in Daoist robes holding a fly-whisk gesticulates animatedly; on the right of " +
      "the frame Mingyan holding sweet-dream incense bows laughing uncontrollably " +
      "(compositional convention, not testing textual left/right). Deductions: " +
      "Xiangling beaten with a door-bar or Yingchun weeping shown; temple demon " +
      "idols shown; Manchu attire or queues.",
  },
  "honglou-081": {
    coreKey:
      "Smartweed Shoal waterside terrace: Tanchun lifts a bamboo rod catching a " +
      "leaping minnow, Xiuyan and Li Wen lean on the railing smiling, Shishu holds " +
      "a porcelain jar, and Baoyu peeks playfully from behind the rock",
    groundTruth:
      "Chapter 81, \"Divining Good Fortune, Four Beauties Fish for Minnows; Obeying " +
      "Stern Admonition, for the Second Time Baoyu Enters the Family School\". Baoyu " +
      "strolls to Smartweed Shoal and finds Tanchun, Xiuyan, and Li Wen fishing " +
      "from the balustrade to divine fortune; Tanchun jerks her rod catching a " +
      "lively willow-leaf minnow which Shishu collects in a water-filled porcelain " +
      "jar, while Baoyu hides behind a rock pretending to throw a pebble. Baoyu " +
      "snapping his rod occurs later.",
    evaluationCriteria:
      "Full credit: Smartweed Shoal waterside balustrade on a bright early winter " +
      "day; on the left of the frame Tanchun hooks a fish, Xiuyan and Li Wen watch " +
      "smiling, and Shishu holds a blue-and-white porcelain jar; on the right of " +
      "the frame Baoyu peeks from behind a rock pretending to throw a pebble " +
      "playfully (compositional convention, not testing textual left/right). " +
      "Deductions: Snapped fishing rod shown; schoolmaster Jia Dairu reprimanding " +
      "with a ruler shown; modern reels or fishing gear; Manchu attire or queues.",
  },
  "honglou-082": {
    coreKey:
      "Main room of Bamboo Lodge: Daiyu rests her chin on her hand discussing " +
      "classical composition, Baoyu unslings his satchel chatting warmly, and " +
      "Zijuan enters holding steaming Longjing tea",
    groundTruth:
      "Chapter 82, \"The Pedantic Schoolmaster Expounds the Text to Warn the Truant " +
      "Heart; The Sick Maiden of Bamboo Lodge Is Startled by an Evil Nightmare\". " +
      "Baoyu hurries from school to Bamboo Lodge to see Daiyu; Daiyu has Zijuan " +
      "brew fine Longjing tea, and the two sit together as Daiyu gently explains " +
      "that even civil examination essays can contain sincere and delicate " +
      "reflections. The school examination happens earlier; the nightmare and " +
      "coughing blood occur later.",
    evaluationCriteria:
      "Full credit: Sunlight and slender bamboos outside the window of Bamboo Lodge " +
      "on an early winter afternoon; on the left of the frame Daiyu in a pale " +
      "lotus-root jacket rests her chin discussing literature; in the middle of the " +
      "frame Baoyu in a slate-blue robe leans forward chatting affectionately; on " +
      "the right of the frame Zijuan carries a lacquer tray serving steaming " +
      "Longjing tea (compositional convention, not testing textual left/right). " +
      "Deductions: Nightmare, chest pains, or spitting blood into a cup shown; old " +
      "woman delivering lychees shown; Manchu attire or queues.",
  },
  "honglou-083": {
    coreKey:
      "Bedchamber of Bamboo Lodge: Daiyu extends a slender wrist from behind bed " +
      "curtains onto a pulse pillow, Physician Wang concentrates on feeling the " +
      "pulse, Zijuan supports the arm, and Jia Lian waits beside",
    groundTruth:
      "Chapter 83, \"Visiting the Imperial Palace, Consort Yuan Falls Ill; Making a " +
      "Scene in the Inner Chambers, Xue Baochai Swallows Her Anger\". Jia Lian " +
      "conducts Imperial Physician Wang into Daiyu's bedchamber; Zijuan guides " +
      "Daiyu's wrist from the curtain onto a wrist-rest and pulls back her golden " +
      "bracelet, and Physician Wang diagnoses taut pulses due to suppressed sorrow. " +
      "The palace illness and Xia Jingui's hysterical tantrums occur later.",
    evaluationCriteria:
      "Full credit: Inner bedchamber of Bamboo Lodge on an early winter afternoon " +
      "with draperies drawn; on the left of the frame Daiyu extends a fair wrist " +
      "from behind curtains resting on a red satin pulse pillow, while Zijuan " +
      "gently supports it; in the middle of the frame Physician Wang in scholar cap " +
      "sits on a stool taking the pulse; on the right of the frame Jia Lian waits " +
      "respectfully beside a carved partition (compositional convention, not " +
      "testing textual left/right). Deductions: Domestic quarreling or royal " +
      "illness shown; agonized coughing blood shown; Qing official caps or queues.",
  },
  "honglou-084": {
    coreKey:
      "Inner study of Mengpo Studio: Jia Zheng unrolls the essay paper nodding in " +
      "approval, Baoyu bows with hands clasped presenting his theme, and Mingyan " +
      "holds ink and brushes standing attentively",
    groundTruth:
      "Chapter 84, \"Testing Literary Talent, Baoyu's Marriage Is First Proposed; " +
      "Inquiring after the Convulsion, Jia Huan Renews the Grudge\". Jia Zheng " +
      "examines Baoyu's academy schoolwork in his study, asking him to improvise a " +
      "theme interpretation for \"Only the Gentleman Is Capable\"; Baoyu answers " +
      "fluently without cliche, and Jia Zheng nods approvingly saying \"passable\". " +
      "Grandmother Jia's marriage proposal precedes; Qiaojie's convulsion follows.",
    evaluationCriteria:
      "Full credit: Morning light in the inner study of Mengpo Studio in early " +
      "winter, with stationery and books prepared; on the left of the frame Jia " +
      "Zheng in a dark gown sits in an armchair stroking his beard in approval; in " +
      "the middle of the frame Baoyu in a slate-blue robe bows respectfully after " +
      "presenting his theme; on the right of the frame Mingyan stands attentively " +
      "by the curio shelf holding ink and brushes (compositional convention, not " +
      "testing textual left/right). Deductions: Wrathful father beating his son " +
      "shown; child convulsing in illness shown; Qing official hats or queues.",
  },
  "honglou-anim-073": {
    coreKey:
      "Yingchun reclines reading scripture, Tanchun rebukes insolent servants, " +
      "along with rippling pond water swaying withered lotus, trembling scripture " +
      "pages, and fluttering bamboo curtain animations",
    groundTruth:
      "Chapter 73, \"The Simple Maid Mistakenly Finds the Embroidered Spring Pouch; " +
      "the Cowardly Young Mistress Declines to Inquire after the Piled-Gold " +
      "Phoenix\". Yingchun's wet-nurse pawned the piled-gold phoenix and the nurse's " +
      "daughter-in-law creates an uproar; Yingchun \"took up a copy of the Treatise " +
      "on Action and Retribution to read... as though she heard nothing\". Tanchun " +
      "sternly rebukes the insolent servants, while Ping'er lifts the curtain " +
      "entering to dismiss them and promises to redeem the ornament. The simple " +
      "maid finding the pouch happens earlier.",
    evaluationCriteria:
      "Full credit: Upper chamber of Brocade Splendor Pavilion on Purple " +
      "Water-Chestnut Isle on an early autumn morning; on the left of the frame " +
      "Yingchun reclines reading the Taoist scripture; in the middle of the frame " +
      "Tanchun sits rebuking insolent servants; on the right of the frame Ping'er " +
      "lifts the curtain asserting authority (compositional convention, not testing " +
      "textual left/right); autumn water swaying withered lotus, scripture pages " +
      "trembling, and curtain fluttering smoothly cycle, driven by SMIL or inline " +
      "CSS. Deductions: Gambling beatings or loud quarrels shown; overall character " +
      "translation; purely static rendering, JavaScript usage, or XML parsing " +
      "errors.",
  },
  "honglou-anim-074": {
    coreKey:
      "Tanchun in broad purple robe denounces the night raid, Xifeng smiles " +
      "placatingly, along with flickering candle flame, swaying silk ribbons, and " +
      "rustling plantain and wutong leaves animations",
    groundTruth:
      "Chapter 74, \"Misled by Slanderous Tongues, the Garden of Total Vision Is " +
      "Raided by Night; Keeping Up Her Pride, Xichun Cuts Off the Ningguo Mansion\". " +
      "When the search party arrives at Autumn Freshness Studio, \"candles blazed in " +
      "Tanchun's chamber... wearing only her inner clothes covered with a broad " +
      "purple robe\", she orders the doors opened and boxes displayed, lamenting " +
      "\"such a great family... must first be destroyed from within before it falls " +
      "completely\". Xifeng smiles placatingly. Mother Wang Shanbao being slapped " +
      "and searching Siqi occur later.",
    evaluationCriteria:
      "Full credit: Spacious hall of Autumn Freshness Studio illuminated by candles " +
      "on a late autumn night; in the middle of the frame Tanchun in a broad purple " +
      "robe stands upright condemning the raid; on the left of the frame Xifeng " +
      "half-reclines smiling; on the right of the frame Mother Wang Shanbao cowers " +
      "in the shadow (compositional convention, not testing textual left/right); " +
      "tall candle flame flickering in the draft, vanity ribbons fluttering, and " +
      "courtyard foliage swaying smoothly cycle, driven by SMIL or inline CSS. " +
      "Deductions: Slapping or rummaging luggage shown; overall character " +
      "translation; purely static rendering, JavaScript usage, or XML parsing " +
      "errors.",
  },
  "honglou-anim-075": {
    coreKey:
      "Mid-Autumn round banquet viewing the moon at Green Summit, Jia Zheng tells a " +
      "tale to please Grandmother Jia, along with lunar halo floating, red palace " +
      "lanterns swaying, and wine cup ripples animations",
    groundTruth:
      "Chapter 75, \"At the Evening Banquet an Ominous Sign Gives Forth a Mournful " +
      "Sound; Viewing the Mid-Autumn Moon White Hairs Lament the Diminished " +
      "Gathering\". On the fifteenth of the eighth month, Grandmother Jia leads the " +
      "family to the highest mountain ridge at the Pavilion of Green Summit, " +
      "setting a round banquet to view the moon and passing a cassia sprig to the " +
      "beat of a drum; the drum stops at Jia Zheng, who drinks and tells a joke " +
      "about a henpecked husband to amuse Grandmother Jia. Jia She's mocking tale " +
      "happens later.",
    evaluationCriteria:
      "Full credit: Mountain ridge at the Pavilion of Green Summit at midnight of " +
      "Mid-Autumn; bright full moon in the clear sky; in the middle of the frame " +
      "Grandmother Jia in a crane cloak sits at the round table; on the left of the " +
      "frame Jia Zheng bows telling a story; on the right of the frame Baoyu stands " +
      "holding a gold wine cup (compositional convention, not testing textual " +
      "left/right); ethereal halo shimmering around the moon, corner lanterns " +
      "swaying in mountain wind, and fine ripples in the wine cup smoothly cycle, " +
      "driven by SMIL or inline CSS. Deductions: Mournful sighs in the shrine " +
      "shown; overall character translation; purely static rendering, JavaScript " +
      "usage, or XML parsing errors.",
  },
  "honglou-anim-076": {
    coreKey:
      "Xiangyun and Daiyu linking verses at Concave Crystal Sanctuary as Miaoyu " +
      "appears, along with crane taking flight, water ripples expanding, withered " +
      "lotus swaying, and robe sashes fluttering animations",
    groundTruth:
      "Chapter 76, \"At the Hall of Green Summit Listening to the Flute Evokes " +
      "Melancholy; At Concave Crystal Sanctuary Linking Verses Mourns Solitude\". " +
      "After the banquet disperses, Xiangyun and Daiyu visit the waterside terrace " +
      "of Concave Crystal Sanctuary to link couplets; a stone thrown into water " +
      "startles a white crane, inspiring Xiangyun's line \"Cold pond carries the " +
      "crane's shadow\", to which Daiyu responds \"Chilly moon buries the flower's " +
      "soul\". Miaoyu emerges from behind the rocks in high praise. Proceeding to " +
      "Green Bower Nunnery occurs later.",
    evaluationCriteria:
      "Full credit: Waterside terrace of Concave Crystal Sanctuary late on " +
      "Mid-Autumn night; on the left of the frame Xiangyun with a fan leans on the " +
      "balustrade; in the middle of the frame Daiyu in a cape sits meditating on " +
      "verses; on the right of the frame Miaoyu in nun attire emerges " +
      "(compositional convention, not testing textual left/right); crane beating " +
      "wings across water, ripples expanding on pond, withered lotus gently " +
      "swaying, and nun robe sashes fluttering smoothly cycle, driven by SMIL or " +
      "inline CSS. Deductions: Coughing blood shown; overall character translation; " +
      "purely static rendering, JavaScript usage, or XML parsing errors.",
  },
  "honglou-anim-077": {
    coreKey:
      "Qingwen cuts fingernails and bestows red damask jacket, Baoyu kneels " +
      "receiving them, along with flickering oil lamp flame, glimmering silver " +
      "scissors, and wind-blown foliage in autumn rain animations",
    groundTruth:
      "Chapter 77, \"The Fair Actor Cuts Ties of Passion and Retires to Water-Moon " +
      "Nunnery; The Pretty Maid Bears Wrong and Dies Untimely\". Baoyu sneaks out at " +
      "night to visit dying Qingwen in a southern alley; indignant at the false " +
      "accusations, Qingwen clips off the two long scallion-tube fingernails from " +
      "her left hand, removes her inner red damask jacket to exchange with Baoyu, " +
      "vowing mutual purity before death. Her sister-in-law demanding money occurs " +
      "later.",
    evaluationCriteria:
      "Full credit: Autumn rainy night in a southern city cottage; on the left of " +
      "the frame Qingwen in undergarments on an earthen bed cuts long nails and " +
      "bestows her jacket; on the right of the frame Baoyu half-kneels holding a " +
      "kerchief in tears (compositional convention, not testing textual " +
      "left/right); celadon lamp flame trembling in the draft, silver scissors " +
      "glinting, and rain-swept plantains swaying outside the window smoothly " +
      "cycle, driven by SMIL or inline CSS. Deductions: Indecent disrobing; " +
      "coughing blood in death throes; overall character translation; purely static " +
      "rendering, JavaScript usage, or XML parsing errors.",
  },
  "honglou-anim-078": {
    coreKey:
      "Baoyu stands before jade table reciting Hibiscus Elegy from gauze scroll as " +
      "Daiyu emerges, along with trembling hibiscus blooms, ascending censer smoke, " +
      "and rippling lunar reflections animations",
    groundTruth:
      "Chapter 78, \"The Old Scholar at Leisure Solicits the Ballad of the Virtuous " +
      "Heroine; The Foolish Boy Fabricates the Elegy for the Hibiscus Spirit\". " +
      "Believing Qingwen has become the Hibiscus Flower Goddess, Baoyu prepares " +
      "four pure offerings and recites his Elegy for the Hibiscus Maiden before the " +
      "blossoming hibiscus tree at night; Daiyu emerges from behind the blooms " +
      "praising the work and suggests altering the verse to \"beneath the red-gauze " +
      "window\". Daiyu turning pale occurs later.",
    evaluationCriteria:
      "Full credit: Blossoming hibiscus by the pool behind the House of Green " +
      "Delights on a late autumn moonlit night; on the left of the frame Baoyu in a " +
      "moon-white robe recites from a gauze scroll; on the right of the frame Daiyu " +
      "steps from behind floral shadows (compositional convention, not testing " +
      "textual left/right); hibiscus blossoms trembling in the night breeze, " +
      "incense smoke curling upward from the censer, and moon reflection with " +
      "floating petals rippling on the pool smoothly cycle, driven by SMIL or " +
      "inline CSS. Deductions: Funeral catafalques or corpses shown; overall " +
      "character translation; purely static rendering, JavaScript usage, or XML " +
      "parsing errors.",
  },
  "honglou-anim-079": {
    coreKey:
      "Baoyu leans on rock looking back mourning the Song of Purple Water-Chestnut " +
      "Isle, Xiangling claps hands smiling, along with swaying smartweed, curling " +
      "bamboo blind, and drifting yellow leaves animations",
    groundTruth:
      "Chapter 79, \"Xue Wenlong Regrets Marrying the Hedong Lioness; Jia Yingchun " +
      "Is Mistakenly Wed to the Zhongshan Wolf\". Yingchun is moved out to prepare " +
      "for her wedding; Baoyu wanders grief-stricken to Purple Water-Chestnut Isle, " +
      "and seeing closed windows and withered lotus, improvises the Song of Purple " +
      "Water-Chestnut Isle; Xiangling passing by claps her hands laughing and asks " +
      "why he is daydreaming again. Xue Pan wedding Xia Jingui occurs later.",
    evaluationCriteria:
      "Full credit: Waterside of Purple Water-Chestnut Isle in late autumn " +
      "twilight; withered lotus and smartweed; on the left of the frame Baoyu in a " +
      "slate-blue robe leans on a rock looking back in melancholy; on the right of " +
      "the frame Xiangling in a lotus-root jacket holds a handkerchief clapping " +
      "hands and smiling (compositional convention, not testing textual " +
      "left/right); smartweed swaying in autumn wind, bamboo blind corner curling " +
      "slightly, and fallen leaves drifting on the water smoothly cycle, driven by " +
      "SMIL or inline CSS. Deductions: Xia Jingui beating Xiangling shown; overall " +
      "character translation; purely static rendering, JavaScript usage, or XML " +
      "parsing errors.",
  },
  "honglou-anim-080": {
    coreKey:
      "Priest Wang brandishes fly-whisk fabricating jealousy recipe, Baoyu laughs " +
      "on couch, Mingyan roars with laughter, along with curling sweet-dream " +
      "incense smoke, twitching fly-whisk horsehairs, and falling pagoda tree " +
      "leaves animations",
    groundTruth:
      "Chapter 80, \"Fair Xiangling Suffers the Stick from Her Covetous Husband; " +
      "Daoist Wang Babbles a Recipe for a Jealous Wife\". Baoyu visits Tianqi Temple " +
      "to offer incense and rests in a quiet room; he asks Priest Wang whether " +
      "plaster can cure jealousy, and the priest jokingly invents a soup of autumn " +
      "pears and dried orange peel, saying \"when one dies at a hundred, how could " +
      "she still be jealous?\", making Baoyu and Mingyan roar with laughter. " +
      "Xiangling being beaten occurs earlier.",
    evaluationCriteria:
      "Full credit: Quiet Daoist room at Tianqi Temple on a clear autumn day; on " +
      "the left of the frame Baoyu in a purple-red robe reclines on a bamboo couch " +
      "laughing; in the middle of the frame Priest Wang in Daoist robes brandishes " +
      "a fly-whisk gesticulating; on the right of the frame Mingyan holding " +
      "sweet-dream incense laughs heartily (compositional convention, not testing " +
      "textual left/right); incense smoke spiraling upward, fly-whisk horsehairs " +
      "twitching, and courtyard leaves fluttering down smoothly cycle, driven by " +
      "SMIL or inline CSS. Deductions: Beating Xiangling shown; overall character " +
      "translation; purely static rendering, JavaScript usage, or XML parsing " +
      "errors.",
  },
  "honglou-anim-081": {
    coreKey:
      "Tanchun lifts bamboo rod catching minnow, Xiuyan and Li Wen watch smiling, " +
      "Shishu holds porcelain jar, Baoyu peeks from rock, along with leaping " +
      "minnow, concentric ripples, and shimmering jar water animations",
    groundTruth:
      "Chapter 81, \"Divining Good Fortune, Four Beauties Fish for Minnows; Obeying " +
      "Stern Admonition, for the Second Time Baoyu Enters the Family School\". Baoyu " +
      "strolls to Smartweed Shoal and finds Tanchun, Xiuyan, and Li Wen fishing " +
      "from the balustrade to divine fortune; Tanchun jerks her rod catching a " +
      "lively willow-leaf minnow which Shishu collects in a water-filled porcelain " +
      "jar, while Baoyu hides behind a rock pretending to throw a pebble. Baoyu " +
      "snapping his rod occurs later.",
    evaluationCriteria:
      "Full credit: Smartweed Shoal waterside balustrade on a bright early winter " +
      "day; on the left of the frame Tanchun hooks a fish, Xiuyan and Li Wen watch " +
      "smiling, and Shishu holds a porcelain jar; on the right of the frame Baoyu " +
      "peeks from behind a rock playfully (compositional convention, not testing " +
      "textual left/right); bamboo tip vibrating with the leaping minnow, " +
      "concentric water ripples expanding, and water in the jar shimmering smoothly " +
      "cycle, driven by SMIL or inline CSS. Deductions: Broken rod shown; overall " +
      "character translation; purely static rendering, JavaScript usage, or XML " +
      "parsing errors.",
  },
  "honglou-anim-082": {
    coreKey:
      "Daiyu rests chin discussing classical essays, Baoyu chats warmly, Zijuan " +
      "serves hot tea, along with steaming tea vapor, rising censer incense, and " +
      "swaying bamboo shadows on window animations",
    groundTruth:
      "Chapter 82, \"The Pedantic Schoolmaster Expounds the Text to Warn the Truant " +
      "Heart; The Sick Maiden of Bamboo Lodge Is Startled by an Evil Nightmare\". " +
      "Baoyu hurries from school to Bamboo Lodge to see Daiyu; Daiyu has Zijuan " +
      "brew fine Longjing tea, and the two sit together as Daiyu gently explains " +
      "that even civil examination essays can contain sincere and delicate " +
      "reflections. The school examination happens earlier; the nightmare and " +
      "coughing blood occur later.",
    evaluationCriteria:
      "Full credit: Sunlight and slender bamboos in the main room of Bamboo Lodge " +
      "on an early winter afternoon; on the left of the frame Daiyu rests her chin " +
      "discussing literature; in the middle of the frame Baoyu chats " +
      "affectionately; on the right of the frame Zijuan serves steaming Longjing " +
      "tea (compositional convention, not testing textual left/right); delicate " +
      "steam rising from the tea bowl, straight incense smoke drifting from the " +
      "bronze burner, and bamboo shadows swaying across the paper window smoothly " +
      "cycle, driven by SMIL or inline CSS. Deductions: Nightmare or coughing blood " +
      "shown; overall character translation; purely static rendering, JavaScript " +
      "usage, or XML parsing errors.",
  },
  "honglou-anim-083": {
    coreKey:
      "Daiyu extends wrist from behind curtain onto pulse pillow, Physician Wang " +
      "takes pulse, Zijuan supports wrist and Jia Lian waits, along with lily " +
      "incense smoke, fluttering door curtain, and rustling bamboo leaves " +
      "animations",
    groundTruth:
      "Chapter 83, \"Visiting the Imperial Palace, Consort Yuan Falls Ill; Making a " +
      "Scene in the Inner Chambers, Xue Baochai Swallows Her Anger\". Jia Lian " +
      "conducts Imperial Physician Wang into Daiyu's bedchamber; Zijuan guides " +
      "Daiyu's wrist from the curtain onto a wrist-rest and pulls back her golden " +
      "bracelet, and Physician Wang diagnoses taut pulses due to suppressed sorrow. " +
      "The palace illness and Xia Jingui's hysterical tantrums occur later.",
    evaluationCriteria:
      "Full credit: Inner bedchamber of Bamboo Lodge on an early winter afternoon " +
      "with draperies drawn; on the left of the frame Daiyu extends a wrist from " +
      "behind curtains resting on a pulse pillow supported by Zijuan; in the middle " +
      "of the frame Physician Wang takes the pulse; on the right of the frame Jia " +
      "Lian waits beside the partition (compositional convention, not testing " +
      "textual left/right); lily incense smoke unfurling from the censer, silk door " +
      "curtain swaying in the draft, and courtyard bamboo leaves rustling in winter " +
      "wind smoothly cycle, driven by SMIL or inline CSS. Deductions: Quarreling or " +
      "royal illness shown; overall character translation; purely static rendering, " +
      "JavaScript usage, or XML parsing errors.",
  },
  "honglou-anim-084": {
    coreKey:
      "Jia Zheng unrolls essay paper stroking beard in approval, Baoyu bows with " +
      "clasped hands presenting theme, Mingyan holds stationery, along with " +
      "sandalwood incense smoke, fluttering exam paper, and swaying pine needles " +
      "animations",
    groundTruth:
      "Chapter 84, \"Testing Literary Talent, Baoyu's Marriage Is First Proposed; " +
      "Inquiring after the Convulsion, Jia Huan Renews the Grudge\". Jia Zheng " +
      "examines Baoyu's academy schoolwork in his study, asking him to improvise a " +
      "theme interpretation for \"Only the Gentleman Is Capable\"; Baoyu answers " +
      "fluently without cliche, and Jia Zheng nods approvingly saying \"passable\". " +
      "Grandmother Jia's marriage proposal precedes; Qiaojie's convulsion follows.",
    evaluationCriteria:
      "Full credit: Morning light in the inner study of Mengpo Studio in early " +
      "winter, with stationery and books prepared; on the left of the frame Jia " +
      "Zheng in a dark gown sits stroking his beard in approval; in the middle of " +
      "the frame Baoyu bows respectfully presenting his theme; on the right of the " +
      "frame Mingyan stands attentively holding ink and brushes (compositional " +
      "convention, not testing textual left/right); thin ribbon of sandalwood " +
      "incense drifting upward, bamboo-paper corner fluttering in morning breeze, " +
      "and courtyard pine needles swaying smoothly cycle, driven by SMIL or inline " +
      "CSS. Deductions: Father beating son shown; overall character translation; " +
      "purely static rendering, JavaScript usage, or XML parsing errors.",
  },
};

export const HONGLOU_STANDARDS_CH073_084_EN = HONGLOU_CH073_084_STANDARDS_EN;
