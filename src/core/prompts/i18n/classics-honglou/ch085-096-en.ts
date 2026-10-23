/**
 * English labels and prompt standards for Dream of the Red Chamber Chapters 85-96,
 * translated from src/core/classics/honglou/ch085-096.ts.
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** Static candidate id -> English label; dynamic candidate appends "(Animated)" */
export const HONGLOU_CH085_096_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-085": "Ch. 85 · The Lady Dowager Hosts a Banquet in the Rear Chamber for the Double Celebration",
  "honglou-086": "Ch. 86 · Daiyu Expounds the Ancient Lute Tablature in the Quiet Chamber",
  "honglou-087": "Ch. 87 · Baoyu and Miaoyu Listen to the Lute through Bamboos",
  "honglou-088": "Ch. 88 · Xichun Receives the Diamond Sutra to Transcribe in the Warm Chamber",
  "honglou-089": "Ch. 89 · Baoyu Visits Daiyu as She Inscribes Verses at Her Desk",
  "honglou-090": "Ch. 90 · Xing Xiuyan Serenely Accepts the Gift of Winter Clothing",
  "honglou-091": "Ch. 91 · Baoyu Pledges His Vow through Zen Riddles in the Naiad's House",
  "honglou-092": "Ch. 92 · Qiaojie Recites Biographies of Exemplary Women in the Warm Chamber",
  "honglou-093": "Ch. 93 · Lai Da Inspects the Water-Moon Convent on Secret Orders",
  "honglou-094": "Ch. 94 · Admiring the Miraculous Winter Blossoms of the Begonia",
  "honglou-095": "Ch. 95 · The Lady Dowager Wears Spectacles to Inspect the Counterfeit Jade",
  "honglou-096": "Ch. 96 · Daiyu Loses Her Senses by the Fragrant Pond Bridge",
};

export const HONGLOU_LABELS_CH085_096_EN = HONGLOU_CH085_096_LABELS_EN;

/** Static and dynamic candidate id -> English prompt evaluation standards */
export const HONGLOU_CH085_096_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-085": {
    coreKey:
      "Rear chamber of the main hall: the Lady Dowager seated on the throne, Daiyu seated as " +
      "chief guest radiant as Chang'e, and Xifeng serving wine and dishes by the glass screen",
    groundTruth:
      "Chapter 85, \"Jia Cunzhou Receives Promotion as Senior Director; Xue Wenqi Incurs Exile " +
      "upon Revival of Old Trouble\". Celebrating both Jia Zheng's promotion and Daiyu's " +
      "birthday, a banquet is arranged in the rear chamber behind a glass theatrical screen. " +
      "\"Daiyu put on fresh festive garments, adorned like the Moon Goddess descending to earth, " +
      "coming out bashfully with a smile to meet everyone\" and took the seat of honor. The " +
      "Lady Dowager rejoiced, while Xifeng bustled about pouring wine and serving delicacies. " +
      "Outside stage performances and the Xue family's murder emergency occur later.",
    evaluationCriteria:
      "Full credit: Rear chamber of Rongguo Mansion's main hall with gilded glass theatrical " +
      "screen and yellow soft mist silk hangings; on the left the Lady Dowager in purple kesi " +
      "gown seated on a carved lacquer throne; in the center Daiyu in a lavender-blue " +
      "narrow-sleeved silk jacket and light purple pleated skirt seated at the head table " +
      "radiant as Chang'e; on the right Xifeng in a red brocade jacket pouring wine and " +
      "serving delicacies (compositional convention; original textual left and right are not " +
      "tested). Deductions: Outside stage opera performances or Xue family murder notification " +
      "entering the scene; Manchu two-handle headdresses or Qing queues.",
  },
  "honglou-086": {
    coreKey:
      "Naiad's House desk: Daiyu leaning to explain ancient lute tablature, Baoyu bending " +
      "forward pointing at characters to inquire, and Zijuan holding tea by bamboo-shadowed " +
      "windows",
    groundTruth:
      "Chapter 86, \"Bribing the Corrupt Official to Overturn Case Records; Diverting " +
      "Leisurely Hours the Maiden Explains Lute Music\". Baoyu visits the Naiad's House and " +
      "finds Daiyu studying a book of lute scores, noting that \"he could not decipher a " +
      "single character\". Daiyu smilingly explains that \"Da\" and \"Jiu\" signify the left " +
      "thumb pressing the ninth fret, while \"Gou\" and \"Wu\" mean the right middle finger " +
      "hooking the fifth string, discoursing on the sacred nature of the lute and the " +
      "discipline of serene contemplation. The courtroom corruption precedes this, and " +
      "Qiuwen delivering orchids follows.",
    evaluationCriteria:
      "Full credit: Quiet study in the Naiad's House on a winter afternoon with bamboo shadows " +
      "on the windows; on the left Baoyu in a tea-gold robe leaning over to point at the score " +
      "inquiringly; in the center Daiyu in a lavender-blue jacket leaning against the desk " +
      "pointing at the tablature with delicate fingers; on the right Zijuan holding a teacup " +
      "with a gentle smile, with a Boshan censer and wrapped lute on the desk (compositional " +
      "convention; original textual left and right are not tested). Deductions: Court trial of " +
      "Xue Pan or Qiuwen bringing potted orchids entering the scene; lute tablature drawn as " +
      "modern five-line staff notation; Manchu costume or queues.",
  },
  "honglou-087": {
    coreKey:
      "Bamboos outside Naiad's House: Miaoyu with fly-whisk and Baoyu holding breath to listen, " +
      "while inside the window Daiyu plays the seven-stringed lute beneath lamplight",
    groundTruth:
      "Chapter 87, \"Moved by Deep Autumn She Plays the Lute Mourning Past Days; Sitting in " +
      "Dhyana Silence She Succumbs to Demonic Hallucinations\". Escorting Miaoyu back to her " +
      "nunnery, Baoyu hears lute music from deep within the bamboo groves outside the Naiad's " +
      "House. Daiyu sits by the window playing the lute and reciting the \"Autumn Thoughts\". " +
      "Miaoyu listens intently, observing the sorrowful melody until the fourth chord breaks " +
      "and Miaoyu gasps that the tone is overly strained. The chess game with Xichun precedes " +
      "this; Miaoyu's demonic vision during meditation follows.",
    evaluationCriteria:
      "Full credit: Cold moon high over bamboo groves and a stone bridge outside the Naiad's " +
      "House in late autumn; on the left Miaoyu in a monastic cap holding a white fly-whisk " +
      "and Baoyu in a crane cloak leaning forward listening in silence; on the right behind a " +
      "translucent window Daiyu in a white embroidered robe playing the red-lacquered " +
      "seven-stringed lute beneath a dim lamp (compositional convention; original textual left " +
      "and right are not tested). Deductions: Depicting grotesque demons, night apparitions, or " +
      "demonic hallucinations; snapping strings or shouting in terror; Manchu headdresses or " +
      "Qing queues.",
  },
  "honglou-088": {
    coreKey:
      "Smartweed Breeze Pavilion warm chamber: Xichun seated at her kang writing desk " +
      "transcribing the Diamond Sutra, Yuanyang presenting the imperial yellow silk bundle, " +
      "and Caiping holding the felt curtain",
    groundTruth:
      "Chapter 88, \"Winning Household Favor Baoyu Praises the Orphan; Enforcing Domestic Law " +
      "Jia Zhen Flogs Rebellious Servants\". Approaching her eighty-first year, the Lady Dowager " +
      "makes a vow for a nine-day ritual to copy 3,600 volumes of the Diamond Sutra. Yuanyang " +
      "brings the yellow silk bundle to the Smartweed Breeze Pavilion to convey the order. " +
      "Xichun reverently accepts and begins copying with quiet composure, seeking seclusion " +
      "from worldly turmoil. Jia Zhen flogging servants and Jia Yun's rejected bribe occur " +
      "later.",
    evaluationCriteria:
      "Full credit: Quiet warm chamber of Smartweed Breeze Pavilion in early winter; on the left " +
      "Yuanyang in a dark blue jacket presenting the yellow silk scripture bundle with both " +
      "hands; in the center Xichun in a pale primrose cotton jacket seated at the kang desk " +
      "holding a fine hair brush with cool detachment; on the right Caiping holding up the blue " +
      "felt door curtain, with a copper hand warmer on the desk (compositional convention; " +
      "original textual left and right are not tested). Deductions: Jia Zhen flogging servants " +
      "with blood; Jia Yun offering bribes; Manchu banner headwear or queues.",
  },
  "honglou-089": {
    coreKey:
      "Naiad's House study: Daiyu in moon-white fur jacket and silver squirrel vest poised " +
      "with brush over desk, Baoyu holding a teacup watching with concern, and Zijuan holding " +
      "the bamboo curtain",
    groundTruth:
      "Chapter 89, \"Departed Souls and Extant Relics Inspire the Young Master's Verses; " +
      "Imaginary Snakes and Suspicious Shadows Shatter the Maiden's Spirit\". Baoyu visits the " +
      "Naiad's House on a snowy day and finds Daiyu wearing a moon-white embroidered fur coat, " +
      "a silver squirrel sleeveless vest, and an Yangfei rose silk skirt, with a plain gold " +
      "hairpin in her cloud coiffure, writing at her bamboo desk. Xueyan serves tea as Baoyu " +
      "and Daiyu converse warmly. Baoyu's memorial to Qingwen precedes this; Daiyu's fasting " +
      "upon hearing rumors follows.",
    evaluationCriteria:
      "Full credit: Winter study in the Naiad's House with frost outside and a copper brazier " +
      "glowing within; on the left Baoyu in an autumn-scent satin gown holding a white tea bowl; " +
      "in the center Daiyu in a moon-white fur jacket, silver squirrel vest, and rose silk " +
      "skirt holding her brush poised over paper; on the right Zijuan lifting the bamboo " +
      "curtain by the folding screen (compositional convention; original textual left and " +
      "right are not tested). Deductions: Baoyu burning eulogies or Daiyu fasting and coughing " +
      "blood; disheveled bedridden sickly portrayal; Manchu banner dress or queues.",
  },
  "honglou-090": {
    coreKey:
      "Purple Caltrop Islet guest quarters: Xing Xiuyan seated serenely expressing modest " +
      "gratitude, Ping'er unfolding a red wool cloak lined with white fox fur, and Feng'er " +
      "holding a red lacquer box",
    groundTruth:
      "Chapter 90, \"Losing a Padded Jacket the Poor Maiden Endures Abuse; Sending Winter " +
      "Fruit the Young Master Suspects Deceit\". Xiuyan's old red jacket was pawned, causing " +
      "the old women to quarrel. Learning of her plight, Xifeng generously dispatches Ping'er " +
      "and Feng'er to deliver a brand-new scarlet wool cloak with white fox fur lining to ward " +
      "off the cold. Xiuyan accepts with calm dignity and humility. Xue Ke and Baochai admire " +
      "her noble disposition and agree on betrothal. The servant quarrel precedes this; Xia " +
      "Jingui's seduction schemes follow.",
    evaluationCriteria:
      "Full credit: Purple Caltrop Islet guest chamber at dusk in midwinter, with a vase of " +
      "winter plum blossoms on the table; in the center Xing Xiuyan in simple faded cotton " +
      "dress seated serenely on a bamboo chair; on the right Ping'er unfolding a bright red " +
      "wool cloak trimmed with white fox fur, with Feng'er holding a red lacquer gift box " +
      "(compositional convention; original textual left and right are not tested). Deductions: " +
      "Servants squabbling or shrewish insults entering the scene; Xia Jingui seducing Xue Ke; " +
      "Manchu attire or queues, or Xiuyan depicted as a ragged beggar.",
  },
  "honglou-091": {
    coreKey:
      "Naiad's House chamber: Baoyu cross-legged with hands clasped declaring his vow of a " +
      "single ladle from three thousand rivers, Daiyu holding a folding fan inquiring " +
      "fondly, and Zijuan holding tea by the curtain",
    groundTruth:
      "Chapter 91, \"Giving Free Rein to Lust Baochan Devises Schemes; Laying a Screen of " +
      "Doubts Baoyu Talks Zen in Earnest\". Daiyu uses Zen riddles to probe Baoyu's true heart. " +
      "Baoyu laughs and solemnly vows: \"Though the weak water spans three thousand leagues, I " +
      "take but a single ladle to drink\", and \"My Zen heart has become willow catkins stuck " +
      "to the mud, no longer dancing with partridges in the spring wind\", cementing their " +
      "unspoken pledge. Baochan seducing Xue Ke precedes this; the crow cawing and Qiuwen " +
      "calling Baoyu follow.",
    evaluationCriteria:
      "Full credit: Interior of Naiad's House at dusk in late autumn with bamboo shadows across " +
      "the window; on the left Baoyu in an autumn-scent silk gown seated cross-legged on an " +
      "embroidered stool with palms joined, laughing heartily; in the center Daiyu in a pale " +
      "green narrow-sleeved jacket leaning against a bamboo chair holding a fan; on the right " +
      "Zijuan holding a teacup by the curtain observing quietly (compositional convention; " +
      "original textual left and right are not tested). Deductions: Baochan's seductive " +
      "antics or Baochai's fever bed entering the scene; Baoyu depicted as a shaved monk; " +
      "Manchu costumes or queues.",
  },
  "honglou-092": {
    coreKey:
      "The Lady Dowager's warm chamber: the Lady Dowager smiling on her daybed, Qiaojie nestled " +
      "beside her holding the Biographies of Exemplary Women, Baoyu explaining moral tales, " +
      "and Yuanyang serving tea",
    groundTruth:
      "Chapter 92, \"Evaluating Ancient Biographies Qiaojie Admires Virtuous Ladies; Playing " +
      "with the Mother Pearl Jia Zheng Ponders Gathering and Parting\". On a winter morning, " +
      "Qiaojie greets the Lady Dowager and recites from the Biographies of Exemplary Women. " +
      "Baoyu sits by her side patiently expounding on Queen Jiang and Meng Guang's ancient " +
      "virtues, while Qiaojie listens with earnest admiration and the Lady Dowager smiles " +
      "fondly. Siqi's double tragedy and Feng Ziying displaying the mother pearl occur later.",
    evaluationCriteria:
      "Full credit: The Lady Dowager's eastern warm chamber in early winter morning with a " +
      "glowing copper brazier; in the center the Lady Dowager in a fur robe reclining on her " +
      "couch smiling, while Qiaojie in a rose-pink brocade jacket nestles beside her knee " +
      "holding the book; on the left Baoyu leaning forward on an embroidered stool pointing at " +
      "the illustrations; on the right Yuanyang standing with a tea tray (compositional " +
      "convention; original textual left and right are not tested). Deductions: Siqi's suicide " +
      "with bloody corpses; merchants hawking pearls; Manchu two-handle headdresses or queues.",
  },
  "honglou-093": {
    coreKey:
      "Water-Moon Convent courtyard: Lai Da holding a horsewhip stepping onto stone stairs to " +
      "announce inspection, Jia Qin bowing in panic, and Fangguan in nun's attire watching " +
      "dispassionately by the window",
    groundTruth:
      "Chapter 93, \"Servants of the Zhen Family Seek Refuge with the Jias; Wind Stirs the " +
      "Water-Moon Scandal in the Nunnery\". Anonymous placards expose Jia Qin's debauchery at " +
      "the Water-Moon Convent. Jia Zheng secretly dispatches Chief Steward Lai Da to " +
      "investigate. \"All the nunnery girls gathered except Fangguan, who alone refused to " +
      "come\". Lai Da arrives sternly, Jia Qin is terrified, and Fangguan watches serenely in " +
      "solitude. Bao Yong joining the household precedes this; transporting the girls back in " +
      "wagons follows.",
    evaluationCriteria:
      "Full credit: Ancient pines, cypresses, and mossy stone steps of the Water-Moon Convent on " +
      "an early winter evening; on the left Lai Da in a blue officer cloak holding a whip " +
      "announcing the order; in the center Jia Qin in a blue silk jacket bowing in panic; on " +
      "the right Fangguan in grey nun's robe and cap holding prayer beads leaning by the " +
      "window with aloof detachment (compositional convention; original textual left and right " +
      "are not tested). Deductions: Degenerate gambling or intimate debauchery in the convent; " +
      "weeping girls boarding carriages; Manchu dress or queues; Fangguan drawn as a glamorous " +
      "coquette.",
  },
  "honglou-094": {
    coreKey:
      "House of Green Delights courtyard: withered begonia miraculously blooming in midwinter " +
      "bound with red silk, the Lady Dowager gazing up from her chair, Baoyu holding his red " +
      "poem sheet, and Ping'er presenting gifts",
    groundTruth:
      "Chapter 94, \"Feasting on Begonias the Lady Dowager Admires the Ominous Blossom; Losing " +
      "His Luminescent Jade Baoyu Learns of Impending Misfortune\". In midwinter, a withered " +
      "crabapple tree in Baoyu's courtyard inexplicably bursts into crimson blossoms. The Lady " +
      "Dowager rejoices and orders a feast. Xifeng sends red silk ribbons to bind the trunk in " +
      "celebration, and Baoyu puts on a fox-fur riding jacket to present auspicious verses. " +
      "The loss of the jade and frantic household searches occur after the banquet concludes.",
    evaluationCriteria:
      "Full credit: Front courtyard of the House of Green Delights after winter snow; on the " +
      "left a withered begonia tree bursting into scarlet flowers bound with red silk " +
      "ribbons, with Daiyu standing by a painted pillar looking pensive; in the center the " +
      "Lady Dowager in a black fox cloak seated on an armchair gazing up with delight, while " +
      "Baoyu in a fur jacket presents a gold-flecked poem sheet; on the right Ping'er holding " +
      "a red lacquer tray with silk gifts (compositional convention; original textual left and " +
      "right are not tested). Deductions: Ransacking chests or frantic searches for the lost " +
      "jade; locking garden gates; Manchu queues or banner dress.",
  },
  "honglou-095": {
    coreKey:
      "The Lady Dowager's eastern warm chamber: wearing tortoiseshell spectacles to inspect " +
      "the counterfeit jade, Xifeng leaning over the desk with suspicion, and Baoyu reclining " +
      "on the couch with a detached smile",
    groundTruth:
      "Chapter 95, \"Rumor Turns to Reality upon Imperial Consort Yuanchun's Demise; " +
      "Counterfeit Passes for Genuine as Baoyu Succumbs to Delusion\". Baoyu falls into dazed " +
      "stupor after losing his jade. When an impostor presents a dull, counterfeit jade stone " +
      "to claim the reward, the Lady Dowager puts on her spectacles to examine it closely. " +
      "Xifeng expresses suspicion, while Baoyu merely casts it aside with a cold, knowing " +
      "smile, seeing through the deception. Yuanchun's death precedes this; Jia Lian driving " +
      "off the fraud follows.",
    evaluationCriteria:
      "Full credit: Eastern warm chamber of the Lady Dowager in the twelfth lunar month with a " +
      "glowing brazier and crystal beaded curtains; in the center the Lady Dowager wearing " +
      "tortoiseshell round spectacles holding a silk-lined box to scrutinize the dull " +
      "counterfeit jade, with Lady Wang standing by anxiously; on the right Xifeng leaning " +
      "over the desk pointing at the fake jade; on the left Baoyu in a plain robe reclining on " +
      "the kang smiling with aloof clarity (compositional convention; original textual left " +
      "and right are not tested). Deductions: Funeral mourning for Consort Yuanchun; shouting " +
      "swindlers in the courtyard; Manchu dress, flower-pot shoes, or queues.",
  },
  "honglou-096": {
    coreKey:
      "Fragrant Pond Bridge: Daiyu clinging to a cold rock in dazed heartbreak, Simpleton " +
      "Sister weeping into her handkerchief behind the crag, and Zijuan hurrying along the " +
      "bamboo path",
    groundTruth:
      "Chapter 96, \"Concealing the Truth Xifeng Devises an Ingenious Plot; Leaking the Secret " +
      "Daiyu Loses Her Senses\". Walking to the rock behind the Fragrant Pond Bridge where she " +
      "once buried flowers with Baoyu, Daiyu overhears the simple-minded maid Simpleton Sister " +
      "weeping and blurt out that Baoyu is to marry Baochai to bring auspicious recovery. The " +
      "shock strikes Daiyu like a thunderbolt, shattering her soul into numbed despair. Xifeng " +
      "plotting the substitution trick precedes this; Zijuan supporting the trance-stricken " +
      "Daiyu follows.",
    evaluationCriteria:
      "Full credit: Fragrant Pond Bridge in early spring with melting ice, frozen moss, and " +
      "remnants of the flower burial mound; in the center Daiyu in an ivory gown clinging to the " +
      "cold crag swaying like a willow in the wind, with vacant eyes and pale countenance; on " +
      "the left Simpleton Sister in coarse blue cotton weeping into her cloth; on the right " +
      "Zijuan hurrying along the bamboo path with an embroidered handkerchief (compositional " +
      "convention; original textual left and right are not tested). Deductions: Plotting the " +
      "bridal substitution in dark rooms; burning poetry manuscripts or vomiting blood; " +
      "Manchu banner dress or queues.",
  },
  "honglou-anim-085": {
    coreKey:
      "Rear chamber banquet with the Lady Dowager seated, Daiyu as chief guest, and Xifeng " +
      "serving, accompanied by incense smoke, silk drapery flutter, and jade pendant tassel motion",
    groundTruth:
      "Chapter 85, \"Jia Cunzhou Receives Promotion as Senior Director; Xue Wenqi Incurs Exile " +
      "upon Revival of Old Trouble\". Celebrating both Jia Zheng's promotion and Daiyu's " +
      "birthday, a banquet is arranged in the rear chamber behind a glass theatrical screen. " +
      "\"Daiyu put on fresh festive garments, adorned like the Moon Goddess descending to earth, " +
      "coming out bashfully with a smile to meet everyone\" and took the seat of honor. Outside " +
      "stage performances and the Xue family's murder emergency occur later.",
    evaluationCriteria:
      "Full credit: Rear chamber of Rongguo Mansion with gilded glass theatrical screen and soft " +
      "mist silk drapery; on the left the Lady Dowager in purple kesi robe on her throne; in the " +
      "center Daiyu in lavender-blue jacket seated at the head table; on the right Xifeng in " +
      "red brocade serving wine (compositional convention; original textual left and right are " +
      "not tested); curling white incense smoke, swaying silk drapes, and swaying jade pendant " +
      "tassels looping smoothly, driven by SMIL or inline CSS. Deductions: Outside stage opera " +
      "or Xue family murder notification entering the frame; whole-figure translation drift; " +
      "static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-086": {
    coreKey:
      "Daiyu explaining lute tablature, Baoyu inquiring, and Zijuan serving tea, accompanied " +
      "by censer smoke, swaying bamboo shadows, and fluttering score pages",
    groundTruth:
      "Chapter 86, \"Bribing the Corrupt Official to Overturn Case Records; Diverting " +
      "Leisurely Hours the Maiden Explains Lute Music\". Baoyu visits the Naiad's House and " +
      "finds Daiyu studying a book of lute scores, noting that \"he could not decipher a " +
      "single character\". Daiyu smilingly explains that \"Da\" and \"Jiu\" signify the left " +
      "thumb pressing the ninth fret, while \"Gou\" and \"Wu\" mean the right middle finger " +
      "hooking the fifth string, discoursing on the sacred nature of the lute and the " +
      "discipline of serene contemplation. The courtroom corruption precedes this, and " +
      "Qiuwen delivering orchids follows.",
    evaluationCriteria:
      "Full credit: Quiet study in the Naiad's House on a winter afternoon; on the left Baoyu " +
      "leaning over pointing at the score; in the center Daiyu in a lavender-blue jacket " +
      "pointing at the tablature; on the right Zijuan standing with teacups (compositional " +
      "convention; original textual left and right are not tested); Boshan censer smoke rising, " +
      "bamboo branches and shadows fluttering, and score page corners gently turning looping " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Courtroom trial or Qiuwen delivering " +
      "orchids in the frame; whole-figure translation drift; static artwork, JavaScript " +
      "usage, or XML parse errors.",
  },
  "honglou-anim-087": {
    coreKey:
      "Miaoyu and Baoyu listening through bamboos to Daiyu playing the lute, accompanied by " +
      "censer smoke, swaying bamboo stalks, and drifting moonlit clouds",
    groundTruth:
      "Chapter 87, \"Moved by Deep Autumn She Plays the Lute Mourning Past Days; Sitting in " +
      "Dhyana Silence She Succumbs to Demonic Hallucinations\". Escorting Miaoyu back to her " +
      "nunnery, Baoyu hears lute music from deep within the bamboo groves outside the Naiad's " +
      "House. Daiyu sits by the window playing the lute and reciting the \"Autumn Thoughts\". " +
      "Miaoyu listens intently, observing the sorrowful melody until the fourth chord breaks " +
      "and Miaoyu gasps that the tone is overly strained. The chess game with Xichun precedes " +
      "this; Miaoyu's demonic vision during meditation follows.",
    evaluationCriteria:
      "Full credit: Bamboo grove and stone bridge beneath the autumn cold moon; on the left " +
      "Miaoyu holding a whisk and Baoyu in a cloak listening intently; on the right Daiyu " +
      "playing the red lute behind the window (compositional convention; original textual left " +
      "and right are not tested); censer smoke within the room, bamboo branches in the night " +
      "wind, and thin clouds passing before the cold moon looping smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Grotesque demon apparitions or snapping strings; whole-figure " +
      "translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-088": {
    coreKey:
      "Xichun transcribing the Diamond Sutra, Yuanyang presenting the scripture bundle, and " +
      "Caiping holding the curtain, accompanied by hand warmer vapor, swaying felt curtain, " +
      "and willow shadows",
    groundTruth:
      "Chapter 88, \"Winning Household Favor Baoyu Praises the Orphan; Enforcing Domestic Law " +
      "Jia Zhen Flogs Rebellious Servants\". Approaching her eighty-first year, the Lady Dowager " +
      "makes a vow for a nine-day ritual to copy 3,600 volumes of the Diamond Sutra. Yuanyang " +
      "brings the yellow silk bundle to the Smartweed Breeze Pavilion to convey the order. " +
      "Xichun reverently accepts and begins copying with quiet composure, seeking seclusion " +
      "from worldly turmoil. Jia Zhen flogging servants and Jia Yun's rejected bribe occur " +
      "later.",
    evaluationCriteria:
      "Full credit: Quiet warm chamber of Smartweed Breeze Pavilion in early winter; on the " +
      "left Yuanyang presenting the yellow silk scripture bundle; in the center Xichun seated " +
      "writing at the kang desk; on the right Caiping holding the door curtain (compositional " +
      "convention; original textual left and right are not tested); curling vapor from the " +
      "copper hand warmer, swaying felt door curtain, and waving willow shadows on the paper " +
      "window looping smoothly, driven by SMIL or inline CSS. Deductions: Flogging servants or " +
      "bribery entering the scene; whole-figure translation drift; static artwork, JavaScript " +
      "usage, or XML parse errors.",
  },
  "honglou-anim-089": {
    coreKey:
      "Daiyu writing at her desk in winter attire, Baoyu watching, and Zijuan lifting the " +
      "curtain, accompanied by brazier embers glowing, brush tip micro-motion, and curtain " +
      "tassel tremor",
    groundTruth:
      "Chapter 89, \"Departed Souls and Extant Relics Inspire the Young Master's Verses; " +
      "Imaginary Snakes and Suspicious Shadows Shatter the Maiden's Spirit\". Baoyu visits the " +
      "Naiad's House on a snowy day and finds Daiyu wearing a moon-white embroidered fur coat, " +
      "a silver squirrel sleeveless vest, and an Yangfei rose silk skirt, with a plain gold " +
      "hairpin in her cloud coiffure, writing at her bamboo desk. Xueyan serves tea as Baoyu " +
      "and Daiyu converse warmly. Baoyu's memorial to Qingwen precedes this; Daiyu's fasting " +
      "upon hearing rumors follows.",
    evaluationCriteria:
      "Full credit: Winter study in the Naiad's House with frost outside and warm brazier " +
      "within; on the left Baoyu in a satin gown holding a teacup; in the center Daiyu in a " +
      "moon-white fur jacket and squirrel vest holding a brush poised; on the right Zijuan " +
      "lifting the bamboo curtain (compositional convention; original textual left and right " +
      "are not tested); glowing red embers in the copper brazier, delicate hovering of the " +
      "brush tip, and trembling bamboo curtain tassels looping smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Burning eulogies or Daiyu vomiting blood in bed; whole-figure " +
      "translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-090": {
    coreKey:
      "Xing Xiuyan serenely accepting the winter cloak, Ping'er presenting the fur garment, " +
      "accompanied by plum blossom tremor, fluttering fox fur collar, and ripple reflections",
    groundTruth:
      "Chapter 90, \"Losing a Padded Jacket the Poor Maiden Endures Abuse; Sending Winter " +
      "Fruit the Young Master Suspects Deceit\". Xiuyan's old red jacket was pawned, causing " +
      "the old women to quarrel. Learning of her plight, Xifeng generously dispatches Ping'er " +
      "and Feng'er to deliver a brand-new scarlet wool cloak with white fox fur lining to ward " +
      "off the cold. Xiuyan accepts with calm dignity and humility. Xue Ke and Baochai admire " +
      "her noble disposition and agree on betrothal. The servant quarrel precedes this; Xia " +
      "Jingui's seduction schemes follow.",
    evaluationCriteria:
      "Full credit: Purple Caltrop Islet guest chamber at dusk in midwinter with winter plum " +
      "blossoms; in the center Xing Xiuyan in modest attire seated calmly; on the right " +
      "Ping'er unfolding the scarlet cloak and Feng'er holding the box (compositional " +
      "convention; original textual left and right are not tested); trembling plum petals, " +
      "fluttering fox fur collar edge, and gentle water ripples outside the window looping " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Servants fighting or Xia Jingui " +
      "seducing Xue Ke; whole-figure translation drift; static artwork, JavaScript usage, or " +
      "XML parse errors.",
  },
  "honglou-anim-091": {
    coreKey:
      "Baoyu declaring his Zen pledge, Daiyu questioning with a fan, and Zijuan holding tea, " +
      "accompanied by censer smoke, swaying bamboo branches, and curtain tassel motion",
    groundTruth:
      "Chapter 91, \"Giving Free Rein to Lust Baochan Devises Schemes; Laying a Screen of " +
      "Doubts Baoyu Talks Zen in Earnest\". Daiyu uses Zen riddles to probe Baoyu's true heart. " +
      "Baoyu laughs and solemnly vows: \"Though the weak water spans three thousand leagues, I " +
      "take but a single ladle to drink\", and \"My Zen heart has become willow catkins stuck " +
      "to the mud, no longer dancing with partridges in the spring wind\", cementing their " +
      "unspoken pledge. Baochan seducing Xue Ke precedes this; the crow cawing and Qiuwen " +
      "calling Baoyu follow.",
    evaluationCriteria:
      "Full credit: Interior of Naiad's House at dusk in late autumn with bamboo shadows on the " +
      "window; on the left Baoyu seated cross-legged with palms joined making his vow; in the " +
      "center Daiyu holding a fan conversing with affection; on the right Zijuan holding a tea " +
      "bowl by the curtain (compositional convention; original textual left and right are not " +
      "tested); curling sandalwood incense smoke, swaying bamboo leaves outside, and trembling " +
      "curtain tassels looping smoothly, driven by SMIL or inline CSS. Deductions: Baochan " +
      "seducing Xue Ke or Baochai ill in bed; whole-figure translation drift; static artwork, " +
      "JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-092": {
    coreKey:
      "The Lady Dowager reclining, Qiaojie reciting the classic, and Baoyu lecturing on " +
      "virtue, accompanied by brazier heat shimmer, turning book page corners, and swaying " +
      "narcissus petals",
    groundTruth:
      "Chapter 92, \"Evaluating Ancient Biographies Qiaojie Admires Virtuous Ladies; Playing " +
      "with the Mother Pearl Jia Zheng Ponders Gathering and Parting\". On a winter morning, " +
      "Qiaojie greets the Lady Dowager and recites from the Biographies of Exemplary Women. " +
      "Baoyu sits by her side patiently expounding on Queen Jiang and Meng Guang's ancient " +
      "virtues, while Qiaojie listens with earnest admiration and the Lady Dowager smiles " +
      "fondly. Siqi's double tragedy and Feng Ziying displaying the mother pearl occur later.",
    evaluationCriteria:
      "Full credit: Eastern warm chamber of the Lady Dowager in early winter morning; in the " +
      "center the Lady Dowager smiling on her daybed and Qiaojie holding the volume nestled " +
      "beside her; on the left Baoyu pointing at the book; on the right Yuanyang holding tea " +
      "(compositional convention; original textual left and right are not tested); shimmer of " +
      "warm air from the copper brazier, fluttering book page corners, and trembling narcissus " +
      "blossoms on the table looping smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Siqi's suicide or pearl merchants in the scene; whole-figure translation drift; static " +
      "artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-093": {
    coreKey:
      "Lai Da announcing the inspection, Jia Qin bowing in fear, and Fangguan watching " +
      "aloofly, accompanied by iron censer incense smoke, swaying pine branches, and " +
      "fluttering cloak hems",
    groundTruth:
      "Chapter 93, \"Servants of the Zhen Family Seek Refuge with the Jias; Wind Stirs the " +
      "Water-Moon Scandal in the Nunnery\". Anonymous placards expose Jia Qin's debauchery at " +
      "the Water-Moon Convent. Jia Zheng secretly dispatches Chief Steward Lai Da to " +
      "investigate. \"All the nunnery girls gathered except Fangguan, who alone refused to " +
      "come\". Lai Da arrives sternly, Jia Qin is terrified, and Fangguan watches serenely in " +
      "solitude. Bao Yong joining the household precedes this; transporting the girls back in " +
      "wagons follows.",
    evaluationCriteria:
      "Full credit: Water-Moon Convent stone steps and pine grove at dusk; on the left Lai Da " +
      "holding a riding crop in a dark cloak; in the center Jia Qin bowing nervously; on the " +
      "right Fangguan in monastic grey robes observing calmly (compositional convention; " +
      "original textual left and right are not tested); thin smoke from the iron incense " +
      "burner, pine boughs swaying in the winter gale, and fluttering cloak hems looping " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Licentious acts or shouting girls " +
      "entering the frame; whole-figure translation drift; static artwork, JavaScript " +
      "usage, or XML parse errors.",
  },
  "honglou-anim-094": {
    coreKey:
      "Midwinter blossoming begonia wrapped in red silk, the Lady Dowager admiring, Baoyu " +
      "presenting verses, and Ping'er serving, accompanied by fluttering red petals, swaying " +
      "silk ribbons, and wine pot steam",
    groundTruth:
      "Chapter 94, \"Feasting on Begonias the Lady Dowager Admires the Ominous Blossom; Losing " +
      "His Luminescent Jade Baoyu Learns of Impending Misfortune\". In midwinter, a withered " +
      "crabapple tree in Baoyu's courtyard inexplicably bursts into crimson blossoms. The Lady " +
      "Dowager rejoices and orders a feast. Xifeng sends red silk ribbons to bind the trunk in " +
      "celebration, and Baoyu puts on a fox-fur riding jacket to present auspicious verses. " +
      "The loss of the jade and frantic household searches occur after the banquet concludes.",
    evaluationCriteria:
      "Full credit: Courtyard of the House of Green Delights under clear snowy skies; on the " +
      "left the miraculous red-blooming begonia bound with silk ribbons and Daiyu observing; " +
      "in the center the Lady Dowager admiring the flowers and Baoyu holding poem sheets; on " +
      "the right Ping'er presenting gifts (compositional convention; original textual left and " +
      "right are not tested); crimson flower petals quivering in the cold wind, red silk " +
      "ribbons waving, and steam rising from the wine flagon looping smoothly, driven by SMIL " +
      "or inline CSS. Deductions: Ransacking rooms or frantic searches for the jade; " +
      "whole-figure translation drift; static artwork, JavaScript usage, or XML parse " +
      "errors.",
  },
  "honglou-anim-095": {
    coreKey:
      "The Lady Dowager examining the counterfeit jade with spectacles, Xifeng suspecting " +
      "fraud, and Baoyu smiling aloofly, accompanied by shimmering crystal curtains, brazier " +
      "heat waves, and silk lining tremor",
    groundTruth:
      "Chapter 95, \"Rumor Turns to Reality upon Imperial Consort Yuanchun's Demise; " +
      "Counterfeit Passes for Genuine as Baoyu Succumbs to Delusion\". Baoyu falls into dazed " +
      "stupor after losing his jade. When an impostor presents a dull, counterfeit jade stone " +
      "to claim the reward, the Lady Dowager puts on her spectacles to examine it closely. " +
      "Xifeng expresses suspicion, while Baoyu merely casts it aside with a cold, knowing " +
      "smile, seeing through the deception. Yuanchun's death precedes this; Jia Lian driving " +
      "off the fraud follows.",
    evaluationCriteria:
      "Full credit: Midwinter eastern warm chamber of the Lady Dowager; in the center the Lady " +
      "Dowager in spectacles examining the fake jade with Lady Wang watching anxiously; on the " +
      "right Xifeng pointing at the fake stone; on the left Baoyu reclining with a detached " +
      "smile (compositional convention; original textual left and right are not tested); " +
      "crystal beaded curtain shimmering in the breeze, faint heat waves rising from the " +
      "charcoal brazier, and silk box lining corners trembling looping smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Funeral caskets or brawling swindlers entering the " +
      "scene; whole-figure translation drift; static artwork, JavaScript usage, or XML parse " +
      "errors.",
  },
  "honglou-anim-096": {
    coreKey:
      "Daiyu dazed by the crag, Simpleton Sister weeping, and Zijuan rushing along the bamboo " +
      "path, accompanied by water ripple glint, rustling bamboo tops, and fluttering gown " +
      "sleeve hem",
    groundTruth:
      "Chapter 96, \"Concealing the Truth Xifeng Devises an Ingenious Plot; Leaking the Secret " +
      "Daiyu Loses Her Senses\". Walking to the rock behind the Fragrant Pond Bridge where she " +
      "once buried flowers with Baoyu, Daiyu overhears the simple-minded maid Simpleton Sister " +
      "weeping and blurt out that Baoyu is to marry Baochai to bring auspicious recovery. The " +
      "shock strikes Daiyu like a thunderbolt, shattering her soul into numbed despair. Xifeng " +
      "plotting the substitution trick precedes this; Zijuan supporting the trance-stricken " +
      "Daiyu follows.",
    evaluationCriteria:
      "Full credit: Early spring chill by the Fragrant Pond Bridge and ancient crag; in the " +
      "center Daiyu in an ivory robe clinging to the rock in stunned grief; on the left " +
      "Simpleton Sister weeping into her handkerchief; on the right Zijuan rushing along the " +
      "path (compositional convention; original textual left and right are not tested); cold " +
      "glint of water ripples on the stream, bamboo tops rustling in the wind, and fluttering " +
      "gown sleeves looping smoothly, driven by SMIL or inline CSS. Deductions: Secret scheming " +
      "or hysterical madness entering the frame; burning manuscript bed scene; whole-figure " +
      "translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
};

export const HONGLOU_STANDARDS_CH085_096_EN = HONGLOU_CH085_096_STANDARDS_EN;
