/**
 * English labels and prompt standards for Dream of the Red Chamber Chapters 109-120,
 * translated from src/core/classics/honglou/ch109-120.ts.
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** Static candidate id -> English label; dynamic candidate appends "(Animated)" */
export const HONGLOU_CH109_120_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-109": "Ch. 109 · Miaoyu Awakens Baoyu with Zen Counsel in the Convent",
  "honglou-110": "Ch. 110 · The Lady Dowager Passes Peacefully with a Smile in the Warm Chamber",
  "honglou-111": "Ch. 111 · Yuanyang Clings to the Coffin with Incense to Martyr for Her Mistress",
  "honglou-112": "Ch. 112 · Xichun Severs Her Hair to Enter the Buddhist Order at Green Bower Convent",
  "honglou-113": "Ch. 113 · Xifeng Entrusts Her Daughter to Granny Liu from Her Sickbed",
  "honglou-114": "Ch. 114 · True and False Baoyu Meet in the Guest Hall to Discern the Way",
  "honglou-115": "Ch. 115 · The Two Baoyus Compare Pursuits in the Outer Study of Rongxi Hall",
  "honglou-116": "Ch. 116 · Baoyu Reopens the Register of the Twelve Beauties in the Land of Illusion",
  "honglou-117": "Ch. 117 · Baochai and Xiren Weep to Restrain Baoyu from Transcending the Mortal World",
  "honglou-118": "Ch. 118 · Ping'er and Granny Liu Devise the Escape Plan in the Side Chamber",
  "honglou-119": "Ch. 119 · Receiving the Triumphant Civil Examination Bulletin while Weeping for Baoyu",
  "honglou-120": "Ch. 120 · Baoyu in the Crimson Felt Cloak Bows Farewell in the Snow at Piling Post",
};

export const HONGLOU_LABELS_CH109_120_EN = HONGLOU_CH109_120_LABELS_EN;

/** Static and dynamic candidate id -> English prompt evaluation standards */
export const HONGLOU_CH109_120_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-109": {
    coreKey:
      "Green Bower Convent meditation room: plain-robed Miaoyu seated on a rush mat holding whisk and beads, Baoyu sitting opposite with hands folded receiving Zen admonition, framed by pine snow and red plum blossoms",
    groundTruth:
      "Chapter 109, \"Awaiting the Departed Soul in the Fifth Watch He Receives Admonition; Visiting Miaoyu at Midnight He Walks to Green Bower Convent\". Grieving for Daiyu in deep despair, Baoyu walks through the snow to Green Bower Convent at the fifth watch. Miaoyu sits in meditation on a rush mat amidst curling incense smoke, admonishing him with detached wisdom: \"When all sounds are hushed, it is the hour for enlightenment; why cling bitterly to worldly ties?\" Setting offerings for the lost soul precedes this; Yingchun weeping upon her visit follows.",
    evaluationCriteria:
      "Full credit: Green Bower Convent meditation chamber on a freezing winter night with pine snow and red plums under the cold moon; in the center Miaoyu with a Taoist-nun coiffure wearing a moon-white silk jacket and water-field patchwork satin vest seated on a stone rush mat; on the right Baoyu in a slate-blue lined jacket and silver-fox vest sitting opposite with folded hands listening reverently (compositional convention; original textual left and right are not tested). Deductions: Bedchamber intimacies pulling Wu'er; Yingchun weeping with bruises; Manchu two-handle headdresses or queues.",
  },
  "honglou-110": {
    coreKey:
      "Eastern warm chamber: the Lady Dowager passing away peacefully on the auspicious couch with a gentle smile, Lady Wang and Baochai weeping and supporting her, Yuanyang kneeling at the foot of the bed lamenting, and Xifeng straining to manage the funeral",
    groundTruth:
      "Chapter 110, \"Lady Dowager Shi Completes Her Lifespan and Returns to the Underworld; Wang Xifeng Exhausts Her Strength and Loses Goodwill\". At eighty-three, the Lady Dowager distributes her possessions and rests on the auspicious couch, passing away peacefully \"with a gentle smile across her countenance\", plunging the household into weeping. Lady Wang and Baochai tend to her tearfully, Yuanyang wails at the bedstead, and the ailing Xifeng strains to organize the funeral robes. Male relatives entering in frantic grief follows.",
    evaluationCriteria:
      "Full credit: Eastern warm chamber of Rongguo Mansion in early spring morning with a red sandalwood couch and white mourning draperies; in the center the Lady Dowager in a purple-crimson burial gown resting with a serene smile as she expires, supported by Lady Wang and Baochai; on the left Yuanyang kneeling by the bed wailing; on the right an emaciated Xifeng holding funeral robes straining to supervise (compositional convention; original textual left and right are not tested). Deductions: Corpse decay or gruesome details; men throwing themselves frantically on the floor; Qing queues or banner dress.",
  },
  "honglou-111": {
    coreKey:
      "Mourning hall before Grandmother Jia's bier: dismal white banners, Yuanyang in coarse hemp mourning garb holding a stick of incense with one hand on the cold lacquered coffin swearing to martyr herself, and Hupo weeping behind the drapery",
    groundTruth:
      "Chapter 111, \"Faithful Yuanyang Follows Her Mistress to the Land of Illusion; Traitorous Servants Deceive Heaven and Invite Bandits\". In the second watch after mourners disperse, Yuanyang awakens from swooning and resolves to preserve her integrity. Kneeling before Grandmother Jia's cinnabar-lacquered bier, she clasps the coffin and vows, \"The old lady loved me dearly all her life, and I shall follow her,\" before entering the adjoining room to end her life. Bandits raiding the mansion occurs later.",
    evaluationCriteria:
      "Full credit: Mourning hall of Rongguo Mansion late at night with suspended white mourning banners and guttering white candles; on the left Grandmother Jia's cinnabar-lacquered coffin with a white stone incense burner; in the center Yuanyang in coarse hemp mourning robes clasping the coffin, raising a stick of incense and gazing upward in resolute devotion; on the right Hupo weeping behind a pillar (compositional convention; original textual left and right are not tested). Deductions: Gruesome depiction of hanging suicide; violent sword-fighting bandits; Manchu dress or queues.",
  },
  "honglou-112": {
    coreKey:
      "Green Bower Convent Buddhist shrine: Xichun in plain dark nun's robes severing her hair with iron shears and offering incense to enter the order, wooden fish and sutras on the altar, with nun Zhitong and Yuanxin chanting with joined palms",
    groundTruth:
      "Chapter 112, \"The Living Nemesis Miaoyu Is Abducted by Force; Parting by Death and Dispersion Xichun Enters the Buddhist Gate\". After Miaoyu is kidnapped by bandits, Xichun perceives the vanity of worldly glory. In the convent shrine before the white porcelain Guanyin, she severs her black locks with shears and offers incense, vowing to leave secular life and dwell by the blue lamp and wooden fish. Lady Wang attempting to dissuade her follows.",
    evaluationCriteria:
      "Full credit: Green Bower Convent shrine at dawn with frosty bamboo outside, white porcelain Guanyin statue, and bronze censer; in the center Xichun in loose dark Buddhist robes severing her hair with shears in resolute renunciation, with cut locks and sutras on the table; on the right nuns Zhitong and Yuanxin standing with palms joined in sighs and prayer (compositional convention; original textual left and right are not tested). Deductions: Bandits abducting Miaoyu violently; entirely bald shaved nuns; Qing banner dress or queues.",
  },
  "honglou-113": {
    coreKey:
      "Bedside of the ailing Xifeng: an emaciated Xifeng weeping and grasping Granny Liu's calloused hands to entrust Qiaojie, Granny Liu holding her hands tearfully with solemn promises, with Qiaojie leaning by the bed and Baoyu watching from the doorway",
    groundTruth:
      "Chapter 113, \"Repenting Past Wrongs Xifeng Entrusts Her Daughter to a Village Woman; Releasing Old Grievances Baoyu Inquires after Qiaojie\". Granny Liu visits Rongguo Mansion to pay condolences and visits Xifeng's sickbed. Bitterly regretting her past ruthless arrogance, Xifeng grasps Granny Liu's hands in tears and entrusts Qiaojie to her care. Touched by past benevolence, Granny Liu pledges with tears to protect the child. Ping'er providing travel funds and Baoyu reflecting on karmic retribution follow.",
    evaluationCriteria:
      "Full credit: Sickroom of Rongguo Mansion on a sunny spring afternoon; in the center an emaciated Xifeng leaning on pillows weeping as she clasps Granny Liu's hands, while Granny Liu in coarse ochre jacket returns her grip with earnest promises; on the left Qiaojie leaning tearfully by the bed and Ping'er holding a medicine cup; on the right Baoyu standing by the beaded curtain watching sorrowfully (compositional convention; original textual left and right are not tested). Deductions: Malevolent specters with chains; villainous kin haggling; Manchu banner gowns or queues.",
  },
  "honglou-114": {
    coreKey:
      "Outer study guest hall: Jia Zheng inspecting the map for the southward funeral procession, Zhen Baoyu holding forth on official career, and Jia Baoyu leaning by the desk listening with cold disillusionment and turning to the great Tao",
    groundTruth:
      "Chapter 114, \"Wang Xifeng Travels through Illusion to Return to Jinling; Zhen Baoyu Humbles His Heart to Follow the Great Path\". Xifeng dies in delirium speaking of returning to the Jinling ledger. Jia Zheng reviews preparations to escort Grandmother Jia's coffin south, while Zhen Baoyu visits the outer study praising worldly honors. Listening to him, Jia Baoyu realizes the futility of worldly look-alikes and deepens his resolve to abandon secular ties for transcendence. Escorting the coffin south follows.",
    evaluationCriteria:
      "Full credit: Guest hall of Rongguo Mansion at midday in late spring with southward mourning banners visible on the veranda; on the left Jia Zheng in hemp mourning dress reading route maps with Jia Lian attending; on the right Zhen Baoyu in a sapphire robe holding forth on official honors; in the center Jia Baoyu in a moon-white robe leaning against the desk listening with detached enlightenment (compositional convention; original textual left and right are not tested). Deductions: Gruesome corpse of Xifeng; burning paper carriages; Qing queues or horse-hoof cuffs.",
  },
  "honglou-115": {
    coreKey:
      "Outer study guest hall: Jia Baoyu seated in plain white mourning robes seeking transcendent purity, Zhen Baoyu in an azure robe discoursing on family honors and career, with Jia Lan listening respectfully and Jia Huan glaring with envy",
    groundTruth:
      "Chapter 115, \"Misled by Partiality Jia Zheng Suffers Deception; Prompted by Dream Omens Baoyu Encounters the Phantom\". Zhen Baoyu visits Rongguo Mansion and converses with Jia Baoyu in the outer study. Hoping to find a kindred immortal spirit, Jia Baoyu is disheartened to hear Zhen Baoyu speak only of filial advancement and civil examinations, finding him a mere worldly careerist. The stark contrast between their identical faces and conflicting ideals deepens Baoyu's estrangement. Baoyu falling into a trance follows.",
    evaluationCriteria:
      "Full credit: Outer study of Rongguo Mansion at dusk in late autumn with bamboo shadows and sunset light; on the left Jia Baoyu in plain white mourning robes seated with aloof detachment; on the right Zhen Baoyu in an azure robe holding forth on worldly virtues; in the center Jia Lan listening upright and Jia Huan looking on with sullen envy (compositional convention; original textual left and right are not tested). Deductions: Baoyu dying in bed; crazy monk demanding money; Manchu hairstyles or horse-hoof sleeves.",
  },
  "honglou-116": {
    coreKey:
      "Side hall of the Department of Ill-Fated Beauties in the Land of Illusion: Baoyu in a moon-white gossamer robe opening the Main Register of the Twelve Beauties before scented cupboards, with the celestial spirit of Yuanyang beckoning from the doorway",
    groundTruth:
      "Chapter 116, \"Regaining the Numinous Jade in the Land of Illusion He Awakes to Immortal Destiny; Escorting the Loving Coffin Jia Zheng Travels the Imperial Highway\". In a deathly trance, Baoyu's spirit follows Yuanyang into the Side Hall of the Department of Ill-Fated Beauties, opens the great scented-wood cupboards, and reads through the Main Register of the Twelve Beauties of Jinling, finally grasping all predestined karmic outcomes. Encountering Daiyu at the celestial terrace and awakening by the monk's mirror follow.",
    evaluationCriteria:
      "Full credit: Side hall of the Department of Ill-Fated Beauties with crimson pillars, half-open scented-wood cupboards, and drifting clouds; in the center Baoyu in a gossamer robe holding open the register booklet with enlightened clarity; on the right the celestial spirit of Yuanyang in a flowing azure-green celestial robe smiling and beckoning outside the door (compositional convention; original textual left and right are not tested). Deductions: Mortal sickbed mourning scenes; demonic battles; Qing banner dress or queues.",
  },
  "honglou-117": {
    coreKey:
      "Naiad's House inner chamber: Baoyu in plain mourning robes sitting silently with hands on his lute detached from mortal ties, Baochai standing by the table wiping tears and entreating, and Xiren kneeling and clutching his hem weeping",
    groundTruth:
      "Chapter 117, \"To Restrain His Transcendence Two Beauties Weep in Despair; Listening to the Prophecy the Blind Maiden Plays the Lute Alone\". After meeting the monk, Baoyu resolves to sever all mortal bonds and sits silently at his lute. Baochai and Xiren weep bitterly, pleading with him to honor familial and marital obligations, yet he remains unmoved like dry wood. Reckless gambling in the outer study and Xichun's determination to become a nun follow.",
    evaluationCriteria:
      "Full credit: Inner chamber of the Naiad's House at late autumn dusk with cold light through windows and fallen leaves; in the center Baoyu in an ivory mourning robe seated with hands resting on his lute, silent and detached; on the left Baochai in a patterned dark silk jacket wiping tears as she admonishes; on the right Xiren kneeling and clasping his robes weeping bitterly (compositional convention; original textual left and right are not tested). Deductions: Violent scuffles over the jade at the gate; outer gambling scenes; Manchu dress or queues.",
  },
  "honglou-118": {
    coreKey:
      "Secluded side chamber: flicker of the lamp on the table, Ping'er kneeling before Granny Liu weeping and clasping her hands to entrust Qiaojie, and Granny Liu embracing Qiaojie while whispering the escape plan",
    groundTruth:
      "Chapter 118, \"Harboring Petty Spite Uncles and Brothers Cheat the Vulnerable Girl; Startled by Peerless Beauty Cousins Unite in Auspicious Marriage\". Discovering that Wang Ren and his accomplices scheme to sell Qiaojie as a concubine to an external prince, Ping'er finds no recourse and weeps before Granny Liu in a secluded room. Granny Liu devises an ingenious plan to disguise Qiaojie in peasant clothes and spirit her away into the countryside. Qiaojie spinning yarn on the farm follows.",
    evaluationCriteria:
      "Full credit: Secluded side chamber of Rongguo Mansion late at night in autumn with a flickering candle on the desk; in the center Ping'er in a moon-white jacket kneeling and clasping Granny Liu's hands in tears to entrust the child, while Granny Liu in coarse blue clothes holds Qiaojie and imparts the secret plan; on the left thirteen-year-old Qiaojie trembling in tears; rural bundles on the table (compositional convention; original textual left and right are not tested). Deductions: Treacherous kin feasting and plotting; brothel scenes; Manchu banner dress or queues.",
  },
  "honglou-119": {
    coreKey:
      "Rongxi Hall illuminated by blazing candles: messengers arriving at the fifth watch with the civil examination bulletin, Li Wan weeping with joy as Jia Lan bows, and Lady Wang stumbling forward weeping for Baoyu supported by a sorrowful Baochai",
    groundTruth:
      "Chapter 119, \"Passing the Provincial Examinations Baoyu Abandons the Mortal World; Bathed in Imperial Favor the Jia Household Perpetuates Its Hereditary Glory\". At the fifth watch, messengers rush into Rongxi Hall announcing that Baoyu has won seventh place and Jia Lan 130th in the provincial examinations. Li Wan and Jia Lan rejoice, but Lady Wang and Baochai weep in anguish upon learning that Baoyu has vanished after leaving the examination hall, fulfilling his vow of leaving the mortal realm. Restoration of hereditary titles follows.",
    evaluationCriteria:
      "Full credit: Rongxi Hall at the fifth watch illuminated by tall bronze candle stands; in the center messengers rushing onto the veranda holding the gilded red examination notice; on the left Lady Wang leaning against the desk weeping for Baoyu supported by Baochai; on the right Li Wan holding the red notice weeping with joy as Jia Lan bows in respect (compositional convention; original textual left and right are not tested). Deductions: Examination hall fires; plotting kin; Qing queues or horse-hoof cuffs.",
  },
  "honglou-120": {
    coreKey:
      "Piling Post on the snow-swept canal: Baoyu with shaved head and bare feet wrapped in a crimson felt cloak bowing farewell to his father from the gangplank, Jia Zheng rushing out in grief and shock, and the monk and Taoist beckoning from the snowy shore",
    groundTruth:
      "Chapter 120, \"Zhen Shiyin Expounds on Illusory Passions; Jia Yucun Concludes the Dream of the Red Chamber\". While returning northward after burying Grandmother Jia, Jia Zheng's boat moors at Piling Post in a heavy snowfall. Through the falling snow, Baoyu appears with shaved head and bare feet, wrapped in a fiery crimson felt cloak, bowing to his father in farewell before departing with the monk and Taoist into the vast white wilderness toward the Great Desolation. Jia Zheng failing to overtake him follows.",
    evaluationCriteria:
      "Full credit: Canal mooring at Piling Post at winter dusk amidst a swirling blizzard; in the center Baoyu with shaved head and bare feet wrapped in a crimson felt cloak bowing with joined hands in serene detachment; on the right Jia Zheng rushing onto the deck in a fox-fur robe with outstretched arms in shock and grief; on the left the Buddhist monk and Taoist priest smiling and beckoning on the snowy shore (compositional convention; original textual left and right are not tested). Deductions: Slips and falls in the snow; Qing banner jackets or queues.",
  },
  "honglou-anim-109": {
    coreKey:
      "Green Bower Convent meditation room: Miaoyu seated on a rush mat, Baoyu receiving counsel with joined hands, accompanied by curling censer smoke, falling pine snow, and flickering candlelight",
    groundTruth:
      "Chapter 109, \"Awaiting the Departed Soul in the Fifth Watch He Receives Admonition; Visiting Miaoyu at Midnight He Walks to Green Bower Convent\". Grieving for Daiyu in deep despair, Baoyu walks through the snow to Green Bower Convent at the fifth watch. Miaoyu sits in meditation on a rush mat amidst curling incense smoke, admonishing him with detached wisdom: \"When all sounds are hushed, it is the hour for enlightenment; why cling bitterly to worldly ties?\" Setting offerings for the lost soul precedes this; Yingchun weeping upon her visit follows.",
    evaluationCriteria:
      "Full credit: Green Bower Convent meditation room on a winter night with pine snow and red plums; in the center Miaoyu seated on a rush mat in plain silk robes; on the right Baoyu in a slate-blue robe listening reverently (compositional convention; original textual left and right are not tested); curling incense smoke, falling snow dust from pine boughs, and flickering candle flame looping smoothly, driven by SMIL or inline CSS. Deductions: Bedchamber intimacies; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-110": {
    coreKey:
      "Eastern warm chamber: Grandmother Jia passing peacefully, Lady Wang and Baochai supporting her, Yuanyang wailing, and Xifeng managing the funeral, accompanied by swaying white curtains, brazier smoke, and trembling shroud borders",
    groundTruth:
      "Chapter 110, \"Lady Dowager Shi Completes Her Lifespan and Returns to the Underworld; Wang Xifeng Exhausts Her Strength and Loses Goodwill\". At eighty-three, the Lady Dowager distributes her possessions and rests on the auspicious couch, passing away peacefully \"with a gentle smile across her countenance\", plunging the household into weeping. Lady Wang and Baochai tend to her tearfully, Yuanyang wails at the bedstead, and the ailing Xifeng strains to organize the funeral robes. Male relatives entering in frantic grief follows.",
    evaluationCriteria:
      "Full credit: Eastern warm chamber of Rongguo Mansion with red sandalwood couch and mourning hangings; in the center Grandmother Jia expiring with a smile supported by Lady Wang and Baochai; on the left Yuanyang wailing; on the right Xifeng holding funeral garments (compositional convention; original textual left and right are not tested); lifting white drapery corners, wisps of blue brazier smoke, and trembling shroud borders looping smoothly, driven by SMIL or inline CSS. Deductions: Corpse decay; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-111": {
    coreKey:
      "Mourning hall before the coffin: Yuanyang holding incense and swearing fidelity, Hupo weeping behind the veil, accompanied by rising incense smoke, swaying mourning banners, and dripping candle wax",
    groundTruth:
      "Chapter 111, \"Faithful Yuanyang Follows Her Mistress to the Land of Illusion; Traitorous Servants Deceive Heaven and Invite Bandits\". In the second watch after mourners disperse, Yuanyang awakens from swooning and resolves to preserve her integrity. Kneeling before Grandmother Jia's cinnabar-lacquered bier, she clasps the coffin and vows, \"The old lady loved me dearly all her life, and I shall follow her,\" before entering the adjoining room to end her life. Bandits raiding the mansion occurs later.",
    evaluationCriteria:
      "Full credit: Mourning hall of Rongguo Mansion late at night; on the left Grandmother Jia's cinnabar coffin; in the center Yuanyang in hemp robes clasping the bier and raising incense; on the right Hupo weeping (compositional convention; original textual left and right are not tested); straight wisps of incense smoke, fluttering hemp banners, and dripping candle wax tears looping smoothly, driven by SMIL or inline CSS. Deductions: Suicide violence; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-112": {
    coreKey:
      "Green Bower Convent shrine: Xichun severing her hair to enter the order, Zhitong and Yuanxin chanting, accompanied by oil lamp flame sparks, swaying dark sleeves, and billowing incense smoke",
    groundTruth:
      "Chapter 112, \"The Living Nemesis Miaoyu Is Abducted by Force; Parting by Death and Dispersion Xichun Enters the Buddhist Gate\". After Miaoyu is kidnapped by bandits, Xichun perceives the vanity of worldly glory. In the convent shrine before the white porcelain Guanyin, she severs her black locks with shears and offers incense, vowing to leave secular life and dwell by the blue lamp and wooden fish. Lady Wang attempting to dissuade her follows.",
    evaluationCriteria:
      "Full credit: Green Bower Convent shrine at dawn before the Guanyin statue; in the center Xichun in dark robes severing her hair with shears; on the right nuns Zhitong and Yuanxin with palms joined (compositional convention; original textual left and right are not tested); flickering oil lamp flame with minute sparks, swaying dark sleeves, and billowing white incense smoke looping smoothly, driven by SMIL or inline CSS. Deductions: Violent abduction; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-113": {
    coreKey:
      "Sickbed entrustment: Xifeng tearfully clasping Granny Liu's hands, Granny Liu holding her with solemn promises, Qiaojie and Baoyu watching, accompanied by rising steam from the medicine bowl, drifting sunlit dust motes, and trembling sleeve hems",
    groundTruth:
      "Chapter 113, \"Repenting Past Wrongs Xifeng Entrusts Her Daughter to a Village Woman; Releasing Old Grievances Baoyu Inquires after Qiaojie\". Granny Liu visits Rongguo Mansion to pay condolences and visits Xifeng's sickbed. Bitterly regretting her past ruthless arrogance, Xifeng grasps Granny Liu's hands in tears and entrusts Qiaojie to her care. Touched by past benevolence, Granny Liu pledges with tears to protect the child. Ping'er providing travel funds and Baoyu reflecting on karmic retribution follow.",
    evaluationCriteria:
      "Full credit: Sickroom on a sunny spring afternoon; in the center Xifeng weeping and clasping Granny Liu's hands, while Granny Liu holds her with promises; on the left Qiaojie leaning and Ping'er holding a cup; on the right Baoyu watching sorrowfully (compositional convention; original textual left and right are not tested); rising steam from the medicine bowl, drifting dust motes in the sunbeam, and subtle trembling of sleeve borders looping smoothly, driven by SMIL or inline CSS. Deductions: Malicious specters; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-114": {
    coreKey:
      "Outer study: Jia Zheng reading the route map, Zhen Baoyu holding forth, and Jia Baoyu listening with enlightenment, accompanied by swaying mourning banners on the veranda, drifting incense smoke, and fluttering map edges",
    groundTruth:
      "Chapter 114, \"Wang Xifeng Travels through Illusion to Return to Jinling; Zhen Baoyu Humbles His Heart to Follow the Great Path\". Xifeng dies in delirium speaking of returning to the Jinling ledger. Jia Zheng reviews preparations to escort Grandmother Jia's coffin south, while Zhen Baoyu visits the outer study praising worldly honors. Listening to him, Jia Baoyu realizes the futility of worldly look-alikes and deepens his resolve to abandon secular ties for transcendence. Escorting the coffin south follows.",
    evaluationCriteria:
      "Full credit: Guest hall of Rongguo Mansion at midday; on the left Jia Zheng reading the route map; on the right Zhen Baoyu discoursing on career; in the center Jia Baoyu listening with detachment (compositional convention; original textual left and right are not tested); swaying funeral banners on the veranda, curving censer smoke, and gently fluttering edges of the paper map looping smoothly, driven by SMIL or inline CSS. Deductions: Corpse horror; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-115": {
    coreKey:
      "Outer study: Jia Baoyu seeking transcendence, Zhen Baoyu expounding career, Jia Lan and Jia Huan listening, accompanied by swaying bamboo tips outside, drifting tea steam, and fluttering robe sleeves",
    groundTruth:
      "Chapter 115, \"Misled by Partiality Jia Zheng Suffers Deception; Prompted by Dream Omens Baoyu Encounters the Phantom\". Zhen Baoyu visits Rongguo Mansion and converses with Jia Baoyu in the outer study. Hoping to find a kindred immortal spirit, Jia Baoyu is disheartened to hear Zhen Baoyu speak only of filial advancement and civil examinations, finding him a mere worldly careerist. The stark contrast between their identical faces and conflicting ideals deepens Baoyu's estrangement. Baoyu falling into a trance follows.",
    evaluationCriteria:
      "Full credit: Outer study of Rongguo Mansion at dusk in late autumn; on the left Jia Baoyu seated in white mourning robes; on the right Zhen Baoyu in an azure robe holding forth; in the center Jia Lan listening and Jia Huan glaring (compositional convention; original textual left and right are not tested); swaying bamboo branches outside the window, curling steam from the teacup, and gently swaying robe sleeves looping smoothly, driven by SMIL or inline CSS. Deductions: Trance collapse; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-116": {
    coreKey:
      "Side hall of the Department of Ill-Fated Beauties: Baoyu reading the Main Register before cupboards, celestial Yuanyang beckoning, accompanied by drifting immortal mists, fluttering golden-flecked pages, and swaying silk tassels",
    groundTruth:
      "Chapter 116, \"Regaining the Numinous Jade in the Land of Illusion He Awakes to Immortal Destiny; Escorting the Loving Coffin Jia Zheng Travels the Imperial Highway\". In a deathly trance, Baoyu's spirit follows Yuanyang into the Side Hall of the Department of Ill-Fated Beauties, opens the great scented-wood cupboards, and reads through the Main Register of the Twelve Beauties of Jinling, finally grasping all predestined karmic outcomes. Encountering Daiyu at the celestial terrace and awakening by the monk's mirror follow.",
    evaluationCriteria:
      "Full credit: Side hall of the Department of Ill-Fated Beauties with half-open cupboards and clouds; in the center Baoyu in gossamer robes holding open the register; on the right celestial Yuanyang beckoning (compositional convention; original textual left and right are not tested); rolling celestial clouds outside the gate, gently curling golden-flecked paper pages, and swaying cupboard silk tassels looping smoothly, driven by SMIL or inline CSS. Deductions: Mortal funeral scenes; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-117": {
    coreKey:
      "Naiad's House: Baoyu playing the lute detached from the world, Baochai entreating in tears, Xiren kneeling and weeping, accompanied by swirling fallen leaves outside, curling censer smoke, and weeping shoulder sobs",
    groundTruth:
      "Chapter 117, \"To Restrain His Transcendence Two Beauties Weep in Despair; Listening to the Prophecy the Blind Maiden Plays the Lute Alone\". After meeting the monk, Baoyu resolves to sever all mortal bonds and sits silently at his lute. Baochai and Xiren weep bitterly, pleading with him to honor familial and marital obligations, yet he remains unmoved like dry wood. Reckless gambling in the outer study and Xichun's determination to become a nun follow.",
    evaluationCriteria:
      "Full credit: Inner chamber of the Naiad's House at late autumn dusk; in the center Baoyu seated silently at his lute; on the left Baochai wiping tears; on the right Xiren kneeling and weeping (compositional convention; original textual left and right are not tested); swirling yellow leaves outside the window, curling spirals of incense smoke, and rhythmic trembling of Xiren's sobbing shoulders looping smoothly, driven by SMIL or inline CSS. Deductions: Scuffles over the jade; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-118": {
    coreKey:
      "Secluded side chamber: Ping'er kneeling to entrust Qiaojie, Granny Liu imparting the escape plan, accompanied by flickering candlelight on the table, comforting pats on Qiaojie's back, and rapid heaving of the girl's bodice",
    groundTruth:
      "Chapter 118, \"Harboring Petty Spite Uncles and Brothers Cheat the Vulnerable Girl; Startled by Peerless Beauty Cousins Unite in Auspicious Marriage\". Discovering that Wang Ren and his accomplices scheme to sell Qiaojie as a concubine to an external prince, Ping'er finds no recourse and weeps before Granny Liu in a secluded room. Granny Liu devises an ingenious plan to disguise Qiaojie in peasant clothes and spirit her away into the countryside. Qiaojie spinning yarn on the farm follows.",
    evaluationCriteria:
      "Full credit: Secluded side chamber late at night; in the center Ping'er kneeling before Granny Liu in tears, while Granny Liu holds Qiaojie and imparts the plan; on the left Qiaojie weeping; travel bundles on the table (compositional convention; original textual left and right are not tested); flickering candle flame on the desk, rhythmic patting of Granny Liu's hand on the child's back, and rapid heaving of Qiaojie's bodice looping smoothly, driven by SMIL or inline CSS. Deductions: Treacherous kin plotting; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-119": {
    coreKey:
      "Rongxi Hall: messengers announcing examination success, Li Wan weeping with joy as Jia Lan bows, Lady Wang weeping for Baoyu with Baochai, accompanied by dripping candle wax, fluttering red bulletin paper, and trembling fingers",
    groundTruth:
      "Chapter 119, \"Passing the Provincial Examinations Baoyu Abandons the Mortal World; Bathed in Imperial Favor the Jia Household Perpetuates Its Hereditary Glory\". At the fifth watch, messengers rush into Rongxi Hall announcing that Baoyu has won seventh place and Jia Lan 130th in the provincial examinations. Li Wan and Jia Lan rejoice, but Lady Wang and Baochai weep in anguish upon learning that Baoyu has vanished after leaving the examination hall, fulfilling his vow of leaving the mortal realm. Restoration of hereditary titles follows.",
    evaluationCriteria:
      "Full credit: Rongxi Hall at the fifth watch with tall bronze candle stands; in the center messengers rushing in with the examination notice; on the left Lady Wang weeping for Baoyu supported by Baochai; on the right Li Wan holding the bulletin as Jia Lan bows (compositional convention; original textual left and right are not tested); dripping candle wax tears, fluttering red ribbons of the bulletin, and subtle trembling of Li Wan's excited fingertips looping smoothly, driven by SMIL or inline CSS. Deductions: Examination fires; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-120": {
    coreKey:
      "Piling Post blizzard: Baoyu in a crimson felt cloak bowing farewell, Jia Zheng rushing onto the deck in grief, monk and Taoist beckoning from the shore, accompanied by swirling blizzard flakes, billowing crimson cloak hem, and rocking boat waves",
    groundTruth:
      "Chapter 120, \"Zhen Shiyin Expounds on Illusory Passions; Jia Yucun Concludes the Dream of the Red Chamber\". While returning northward after burying Grandmother Jia, Jia Zheng's boat moors at Piling Post in a heavy snowfall. Through the falling snow, Baoyu appears with shaved head and bare feet, wrapped in a fiery crimson felt cloak, bowing to his father in farewell before departing with the monk and Taoist into the vast white wilderness toward the Great Desolation. Jia Zheng failing to overtake him follows.",
    evaluationCriteria:
      "Full credit: Piling Post canal mooring at winter dusk amidst a blizzard; in the center Baoyu in a crimson felt cloak bowing in farewell; on the right Jia Zheng rushing onto the deck with outstretched arms; on the left the monk and Taoist beckoning from the shore (compositional convention; original textual left and right are not tested); swirling horizontal snowflake gusts, billowing crimson felt cloak edges, and gentle rocking of the moored boat in the cold waves looping smoothly, driven by SMIL or inline CSS. Deductions: Falling on the ice; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
};

export const HONGLOU_STANDARDS_CH109_120_EN = HONGLOU_CH109_120_STANDARDS_EN;
