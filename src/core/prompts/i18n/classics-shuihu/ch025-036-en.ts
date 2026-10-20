/**
 * 《水浒传》第 25–36 回候选的英文标签与英文评判标准，由
 * src/core/classics/shuihu/ch025-036.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const SHUIHU_CH025_036_LABELS_EN: Readonly<Record<string, string>> = {
  "shuihu-025": "Ch. 25 · Yun'ge Looks for Wu Da with His Basket",
  "shuihu-026": "Ch. 26 · Wu Song Holds a Memorial Sacrifice and Invites the Neighbors",
  "shuihu-027": "Ch. 27 · Sun Erniang Hails Them from the Doorway",
  "shuihu-028": "Ch. 28 · Wu Song Tosses the Stone Before the Heavenly King Hall",
  "shuihu-029": "Ch. 29 · Wu Song Feigns Drunkenness and Eyes the Door God",
  "shuihu-030": "Ch. 30 · Halting on the Bridge at Feiyun Inlet",
  "shuihu-031": "Ch. 31 · The Itinerant Ascetic Takes Leave of Shizi Slope",
  "shuihu-032": "Ch. 32 · Wu Song Drunkenly Chases the Yellow Dog",
  "shuihu-033": "Ch. 33 · Song Jiang Views the Little Lantern Mountain by Night",
  "shuihu-034": "Ch. 34 · Qin Ming and Hua Rong Face Each Other Before the Formations",
  "shuihu-035": "Ch. 35 · Hua Rong Shoots the Wild Goose from the Pass",
  "shuihu-036": "Ch. 36 · Li Jun Bows to Song Jiang on Jieyang Ridge",
};

/** 静态与动态候选 id → 英文评判标准 */
export const SHUIHU_CH025_036_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "shuihu-025": {
    coreKey:
      "On a street in Yanggu County: Yun'ge, carrying a basket of snow pears, stops and " +
      "asks a question, and Wu Da, having set down his load of steamed buns, stands " +
      "beside it and answers",
    groundTruth:
      "Chapter 25, \"Granny Wang Schemes to Wheedle Ximen Qing; the Adulteress Poisons " +
      "Wu Dalang\". Yun'ge \"took up his basket of snow pears\" to look for Wu Da, \"and " +
      "there was Wu Da carrying his load of steamed buns on his pole\", and \"Wu Da set " +
      "down his load\" to answer; Yun'ge is just fifteen or sixteen, and Wu Da is under " +
      "five feet tall, with ugly features. Going into the tavern comes later.",
    evaluationCriteria:
      "Full credit: The street market by day; on the left of the frame Yun'ge, with a " +
      "boy's build, carries a basket of snow pears, stops, and asks a question; on the " +
      "right of the frame Wu Da, short and ugly-featured, his load of steamed buns set " +
      "down at his feet, stands beside it and answers. Deductions: Wu Da hunchbacked or " +
      "in clown makeup; the steamed buns drawn as baked sesame cakes or fried dough " +
      "sticks; a teahouse or a tavern; Wu Song, Pan Jinlian, or Ximen Qing.",
  },
  "shuihu-026": {
    coreKey:
      "The memorial sacrifice before the spirit tablet in Wu Da's house: Wu Song sits at " +
      "the end of the table and calls out a respectful greeting, his knife hidden under " +
      "his clothes, Pan Jinlian, Granny Wang, and the neighbors are seated, and the " +
      "county soldiers guard the door",
    groundTruth:
      "Chapter 26, \"Ninth Uncle He Steals the Bones at the Funeral; Wu Erlang Offers Up " +
      "Heads at the Memorial Sacrifice\". \"Sister-in-law, take the host's seat; " +
      "Godmother, sit opposite\"; \"Wu Song brought over a bench and sat at the end of " +
      "the table, and had the county soldiers shut the front and back doors\", and a " +
      "county soldier at the back \"poured the wine himself\"; before the spirit tablet " +
      "are two candles and a burner of incense; Pan Jinlian has already \"hastily put on " +
      "her mourning skirt and mourning jacket\". Drawing the knife comes later.",
    evaluationCriteria:
      "Full credit: At the back of the frame the spirit tablet, candles, incense burner, " +
      "and wine and dishes; in the middle of the frame, behind the table, Pan Jinlian, in " +
      "mourning jacket and skirt, sits in the host's seat, Granny Wang sits opposite " +
      "across the table, and the neighbors sit to the side; on the right of the frame Wu " +
      "Song, eight feet tall, in a new headscarf and tied with a hemp cord, sits at the " +
      "end of the table and calls out a respectful greeting, his knife not showing; on " +
      "the left of the frame, by the door, a county soldier guards the door, and another " +
      "county soldier pours wine. Deductions: Wu Song's knife unsheathed or in his grip; " +
      "the table overturned; blood or severed heads shown; Wu Song wearing a cangue or " +
      "with characters tattooed on his face.",
  },
  "shuihu-027": {
    coreKey:
      "Before the tavern at Shizi Slope: Sun Erniang leans in the doorway and hails them, " +
      "Wu Song, in a cangue and with the characters tattooed on his face, carries a " +
      "bundle on his back, and the two escort officers carry cudgels",
    groundTruth:
      "Chapter 27, \"The Female Yaksha Sells Human Flesh on the Mengzhou Road; Captain Wu " +
      "(dutou) Meets Zhang Qing at Shizi Slope\". \"From a willow beside the stream hung " +
      "out a wine banner\"; \"the woman leaned in the doorway to greet them\", in a green " +
      "gauze blouse and a red silk skirt; Wu Song wears an iron-leaf round-head " +
      "protective cangue, with two lines of characters tattooed on his face. Going into " +
      "the tavern comes later.",
    evaluationCriteria:
      "Full credit: A wine banner hangs from the willow by the stream; on the right of " +
      "the frame Sun Erniang leans in the doorway and hails them, her brows set with a " +
      "murderous air and her waist thick and sturdy, in a green gauze blouse and a bright " +
      "red silk skirt, hairpins and ornaments all over her head and wildflowers tucked " +
      "at her temples; in the middle of the frame Wu Song wears an iron-leaf round-head " +
      "cangue, with the characters tattooed on his face and a bundle on his back; on the " +
      "left of the frame the two escort officers carry cudgels. Deductions: Sun Erniang " +
      "bare-breasted or drawn as a pretty young girl; human flesh or blood shown; Zhang " +
      "Qing.",
  },
  "shuihu-028": {
    coreKey:
      "Before the Heavenly King Hall at Anping Camp: Wu Song, bare-chested, looks up " +
      "with both hands spread, waiting to catch, the bluestone block with a hole hangs " +
      "in midair, not yet fallen, and Shi En has stepped aside and watches in " +
      "astonishment",
    groundTruth:
      "Chapter 28, \"Wu Song Overawes Anping Camp; Shi En Righteously Seizes Kuaihuo " +
      "Forest\". The bluestone block before the Heavenly King Hall \"has a hole through " +
      "it\"; Wu Song \"took off the top half of his clothes and tied them round his " +
      "waist\", \"tossed it once into the air\", and \"it flew up some ten feet off the " +
      "ground\". Catching it with both hands comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame the Heavenly King Hall; in the middle of " +
      "the frame Wu Song, with the characters tattooed on his face and no cangue, his " +
      "clothes tied round his waist and bare above the waist, looks up with both hands " +
      "spread, waiting to catch, high above his head the bluestone block with a hole " +
      "hangs in midair, not yet fallen, and a pit in the earth lies at his feet; on the " +
      "left of the frame Shi En, a white kerchief wrapped round his head, in a blue " +
      "gauze overgarment, his arm in a white silk sling, has stepped aside and watches in " +
      "astonishment; at the back the prisoners gather round to watch. Deductions: Wu " +
      "Song fully naked or wearing a cangue; the stone block drawn as a stone padlock " +
      "weight or a stone barbell.",
  },
  "shuihu-029": {
    coreKey:
      "On the road at the entrance to Kuaihuo Forest: Wu Song, his cloth shirt thrown " +
      "open, feigns drunkenness and looks askance, and Jiang the Door God, a white cloth " +
      "shirt draped over him, sits in a folding chair, fly whisk in hand, enjoying the " +
      "cool",
    groundTruth:
      "Chapter 29, \"Shi En Again Lords It over the Mengzhou Road; Wu Song Drunkenly " +
      "Beats Jiang the Door God\". Wu Song wears a wan-pattern headscarf, an " +
      "earth-colored cloth shirt, and a red silk waist sash, with a plaster stuck over " +
      "the characters tattooed on his face; he \"threw open his cloth shirt\" and \"gave " +
      "a sidelong glance\"; Jiang the Door God has \"purple flesh spread thick all over " +
      "his body\", \"with a white cloth shirt draped over him\", and sits under a green " +
      "locust tree with a fly whisk, enjoying the cool. Going into the tavern comes " +
      "later.",
    evaluationCriteria:
      "Full credit: The highroad at the wu hour (noon); on the left of the frame Wu " +
      "Song, in a wan-pattern headscarf, his earth-colored cloth shirt thrown open, with " +
      "a red silk waist sash and a plaster on his face, feigns drunkenness and looks " +
      "askance; on the right of the frame, under the green locust tree, Jiang the Door " +
      "God, more burly than Wu Song, with a dark purplish face and a yellow beard, a " +
      "white cloth shirt draped over him, sits in a folding chair, fly whisk in hand, " +
      "enjoying the cool, neither rising nor turning his head. Deductions: Wu Song " +
      "bare-chested or holding a blade or cudgel; a tavern or wine vats; the two engaged; " +
      "any figure drawn with opera face paint.",
  },
  "shuihu-030": {
    coreKey:
      "On the broad plank bridge at Feiyun Inlet: Wu Song, in a cangue with his right " +
      "hand nailed fast and his left hand free, halts and speaks, and the two men " +
      "carrying pudao (long-handled saber) step one pace closer",
    groundTruth:
      "Chapter 30, \"Shi En Enters the Death-Row Prison Three Times; Wu Song Wreaks Havoc " +
      "at Feiyun Inlet\". \"They came to a broad plank bridge by the inlet, and a " +
      "memorial archway\"; Wu Song wears an iron-leaf clamp cangue, \"but his right hand " +
      "was nailed fast to the traveling cangue, while his left hand was free\"; \"the two " +
      "carrying pudao stepped one pace closer\". Kicking men into the water comes later.",
    evaluationCriteria:
      "Full credit: Open water and a broad plank bridge; on the right of the frame the " +
      "memorial archway at the bridgehead; in the middle of the frame Wu Song, with the " +
      "characters tattooed on his face, wears an iron-leaf clamp cangue, his right hand " +
      "nailed to the cangue and his left hand free, a bundle tied at his waist, and " +
      "halts and speaks; left of center in the frame the two men carry pudao and wear " +
      "waist sabers, stepping one pace closer, blades not yet raised; on the left of the " +
      "frame the two escort officers carry cudgels. Deductions: The cangue locking both " +
      "hands or already broken; cooked geese; anyone in the water; blood shown.",
  },
  "shuihu-031": {
    coreKey:
      "Before the inn door at Shizi Slope: Wu Song, dressed as an itinerant ascetic " +
      "(xingzhe), strides out the door with his hands tucked in his sleeves, and Zhang " +
      "Qing and Sun Erniang stand by the door cheering",
    groundTruth:
      "Chapter 31, \"The Blood of Military Inspector Zhang (dujian) Spatters Yuanyang " +
      "Tower; Wu the Itinerant Ascetic Crosses Wugong Ridge by Night\". \"Wu Song took " +
      "his leave and went out the door, tucked his hands into both sleeves, and strode " +
      "off with a swagger\", and \"Zhang Qing and his wife watched and cheered\"; the " +
      "hair is cut so that it \"must cover the characters tattooed on his forehead\", " +
      "\"the front hair falling level with his brows, the back hair uneven at his " +
      "neck\", and the ascetic's clothing and the monk's knives are all already on him.",
    evaluationCriteria:
      "Full credit: Before the inn door at dusk; left of center in the frame Wu Song, " +
      "his front hair level with his brows covering the characters tattooed on his " +
      "forehead and his back hair reaching his neck, with a thin iron headband, a black " +
      "monk's robe with a multicolored sash, prayer beads hung on his chest, and two " +
      "monk's knives at his waist, strides out the door with his hands tucked in his " +
      "sleeves; on the right of the frame, by the door, Zhang Qing, in a blue gauze " +
      "concave-topped headscarf and a white cloth shirt, and Sun Erniang, in a green " +
      "gauze blouse and a red silk skirt, cheer. Deductions: Wu Song wearing a golden " +
      "headband or a felt hat, or holding a monk's staff; the prayer beads drawn as " +
      "skulls; Wu Song with loose long hair or a shaven head.",
  },
  "shuihu-032": {
    coreKey:
      "A stream bank in the eleventh month: the drunken Wu Song, an unsheathed monk's " +
      "knife in his left hand, gives chase in long strides, a big yellow dog runs " +
      "barking along the stream bank, and the knife has not yet been swung",
    groundTruth:
      "Chapter 32, \"Wu the Itinerant Ascetic Drunkenly Beats Kong Liang; the Brocade " +
      "Tiger Releases Song Jiang out of Righteousness\". A north wind in the eleventh " +
      "month; Wu Song \"knotted the sleeves of his monk's robe behind his back\", " +
      "wearing a padded cloth jacket underneath (Chapter 31), \"and with his left hand " +
      "drew a monk's knife from its sheath and went after it in long strides\"; the " +
      "yellow dog came out \"from the earthen wall to one side\", and at this moment it " +
      "is \"barking as it ran along the stream bank\". Slashing at empty air and falling " +
      "into the stream come later.",
    evaluationCriteria:
      "Full credit: A north wind and withered willows, the stream shallow and nearly " +
      "dry; on the left of the frame Wu Song, his front hair level with his brows " +
      "covering the characters tattooed on his forehead, with a thin iron headband, the " +
      "sleeves of his black monk's robe knotted behind his back to show the sleeves of " +
      "the padded cloth jacket beneath, and prayer beads hung on his chest, staggers " +
      "drunkenly and, an unsheathed monk's knife in his left hand, gives chase in long " +
      "strides; on the right of the frame a big yellow dog runs barking along the stream " +
      "bank, an earthen wall behind it. Deductions: Wu Song's knife already swung or Wu " +
      "Song already fallen; Wu Song with both arms bare; the yellow dog wounded; Kong " +
      "Liang, Kong Ming, or farmhands; Wu Song wearing a felt hat; the prayer beads " +
      "drawn as skulls.",
  },
  "shuihu-033": {
    coreKey:
      "Before the Temple of the Earth God King in Qingfeng Town on the night of the " +
      "Lantern Festival: Song Jiang and three attendants, hand in hand, look up at the " +
      "lanterns on the little lantern mountain (aoshan), the bright moon already risen",
    groundTruth:
      "Chapter 33, \"Song Jiang Views the Little Lantern Mountain by Night; Hua Rong " +
      "Wreaks Havoc at Qingfeng Fort\". \"The four or five of them, hand in hand, came " +
      "before the King's Temple to look at the little lantern mountain\"; \"through the " +
      "rocks, twin dragons sport in the water; against the rosy clouds, a lone crane " +
      "faces the sky\". The bright moon has already risen in the east; Song Jiang has " +
      "not yet been tattooed and exiled at this point, and Chapter 36 describes him as " +
      "having \"a purplish-brown complexion\".",
    evaluationCriteria:
      "Full credit: The night of the Lantern Festival, a bright moon at the upper left " +
      "of the frame; on the right of the frame, before the temple, the little lantern " +
      "mountain hung all over with lanterns, with twin dragons sporting in the water and " +
      "a lone crane; on the left of the frame Song Jiang, with a purplish-brown " +
      "complexion, short, in a headscarf and cloth robe, with no cangue and no " +
      "characters tattooed on his face, looks up at the lantern mountain hand in hand " +
      "with three attendants. Deductions: Song Jiang wearing a cangue or with characters " +
      "tattooed on his face; Hua Rong; the Bao Lao dance; sky lanterns or revolving " +
      "lanterns; Song Jiang drawn with black opera face paint.",
  },
  "shuihu-034": {
    coreKey:
      "Below Mount Qingfeng, the two formations drawn up facing each other: Qin Ming " +
      "reins in his horse, holds his wolf-tooth mace crosswise, and glares, and Hua " +
      "Rong, on horseback, holding up his iron spear, bows slightly and calls out a " +
      "respectful greeting; the two have not yet engaged",
    groundTruth:
      "Chapter 34, \"Guardian of Three Mountains Wreaks Havoc on the Qingzhou Road; the " +
      "Thunderbolt Rides by Night to a Field of Rubble\". \"Qin Ming reined in his " +
      "horse, held his wolf-tooth mace crosswise, and looked with wide-open eyes\"; " +
      "\"Hua Rong, on horseback, holding up his iron spear, called out a greeting to Qin " +
      "Ming\". Qin Ming has a red tassel on his helmet, a scarlet brocade robe, and " +
      "interlinked chain armor; shooting off the tassel comes later.",
    evaluationCriteria:
      "Full credit: At dawn the two formations drawn up facing each other; on the left " +
      "of the frame Qin Ming reins in his horse, with a red tassel on his helmet, a " +
      "scarlet brocade robe, and interlinked chain armor, holds his bronze-studded " +
      "wolf-tooth mace crosswise, and glares wide-eyed; on the right of the frame Hua " +
      "Rong, with white teeth and red lips, on horseback holding up his iron spear, bows " +
      "slightly and calls out a respectful greeting to Qin Ming, bow and arrows hung at " +
      "his side; behind him on the slope the bandit lackeys in red headscarves stand in " +
      "formation holding long spears. Deductions: The two engaged; the red tassel " +
      "already shot off; Hua Rong wearing a helmet; the mounts drawn as unicorns; the " +
      "wolf-tooth mace drawn as a spiked iron ball; any figure drawn with opera face " +
      "paint.",
  },
  "shuihu-035": {
    coreKey:
      "On the third pass before the stronghold at Liangshan Marsh: Hua Rong, on foot, " +
      "draws the slender bow to the full and aims at the third goose in the line of " +
      "wild geese, the arrow not yet loosed, while Chao Gai looks up and Wu Yong stands " +
      "watching",
    groundTruth:
      "Chapter 35, \"The Stone General Delivers a Letter at a Village Inn; Little Li " +
      "Guang Shoots a Wild Goose at Liangshan\". \"As they reached the third pass before " +
      "the stronghold, they heard several lines of wild geese calling loud and clear in " +
      "the sky\"; Hua Rong borrows a bow to shoot \"the third goose in the line of wild " +
      "geese in the head\", \"fitted the arrow and drew the bow to the full\". Shooting " +
      "it down comes later.",
    evaluationCriteria:
      "Full credit: Flags and banners on the pass and the marsh below it; at the upper " +
      "right of the frame a line of at least five wild geese; on the left of the frame " +
      "Hua Rong, with white teeth and red lips, on foot, shoots upward, drawing the " +
      "slender bow to the full and aiming at the third goose in the line of wild geese, " +
      "the arrow not yet loosed; on the right of the frame Chao Gai looks up and Wu " +
      "Yong, fair-faced with a long beard, stands watching, with the other chieftains " +
      "behind. Deductions: The arrow already loosed or a goose struck and falling; Hua " +
      "Rong on horseback; an archery target; Wu Yong holding a feather fan.",
  },
  "shuihu-036": {
    coreKey:
      "In the guest room of Li Li's tavern on Jieyang Ridge: Song Jiang, just come to, " +
      "is held up by two men, Li Jun bows down to the ground at once, and Li Li also " +
      "kneels and bows",
    groundTruth:
      "Chapter 36, \"At Liangshan Marsh Wu Yong Recommends Dai Zong; on Jieyang Ridge " +
      "Song Jiang Meets Li Jun\". \"The big man had the two brothers hold Song Jiang up, " +
      "and bowed down to the ground at once\"; \"and the man who sold the wine bowed " +
      "too\". Song Jiang has \"a purplish-brown complexion\" and the characters " +
      "tattooed on his face, and his cangue has already been removed; Li Li has a red " +
      "curly beard, a tattered headscarf, and a cloth vest.",
    evaluationCriteria:
      "Full credit: The guest room of the tavern; in the middle of the frame Song Jiang, " +
      "with a purplish-brown complexion, short, with the characters tattooed on his face " +
      "and no cangue, just come to and dazed, is held up by two men; on the left of the " +
      "frame Li Jun, eight feet tall and red-faced, bows down to the ground at once; on " +
      "the right of the frame Li Li, with a red curly beard, a tattered headscarf, and a " +
      "cloth vest that leaves both arms bare, also kneels and bows. Deductions: Song " +
      "Jiang wearing a cangue; the human-flesh workshop, a knife, or blood shown; the " +
      "two escort officers; any figure drawn with opera face paint; Li Li bare-chested.",
  },
  "shuihu-anim-025": {
    coreKey:
      "Yun'ge, carrying a basket of snow pears, stopping to ask a question and Wu Da, " +
      "his load set down, answering, with animated steam from the steamer baskets, pear " +
      "basket, and garment corners",
    groundTruth:
      "Chapter 25, \"Granny Wang Schemes to Wheedle Ximen Qing; the Adulteress Poisons " +
      "Wu Dalang\". Yun'ge \"took up his basket of snow pears\" to look for Wu Da, and " +
      "\"Wu Da set down his load\" to answer; Yun'ge is just fifteen or sixteen, and Wu " +
      "Da is under five feet tall. Going into the tavern comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Yun'ge, with a boy's build, carries a " +
      "basket of snow pears, stops, and asks a question; on the right of the frame Wu " +
      "Da, short and ugly-featured, his load of steamed buns set down at his feet, " +
      "stands beside it and answers; the steam, the pear basket, and the garment corners " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Wu Da hunchbacked or in " +
      "clown makeup; the steamed buns drawn as baked sesame cakes or fried dough sticks; " +
      "a teahouse or a tavern; Wu Song or Pan Jinlian; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-026": {
    coreKey:
      "Wu Song sitting at the end of the table calling out a respectful greeting, his " +
      "knife hidden under his clothes, everyone seated and the county soldiers guarding " +
      "the door, with animated candle flames and incense smoke, and sutra streamers and " +
      "paper money",
    groundTruth:
      "Chapter 26, \"Ninth Uncle He Steals the Bones at the Funeral; Wu Erlang Offers Up " +
      "Heads at the Memorial Sacrifice\". \"Sister-in-law, take the host's seat; " +
      "Godmother, sit opposite\"; \"Wu Song brought over a bench and sat at the end of " +
      "the table, and had the county soldiers shut the front and back doors\"; before " +
      "the spirit tablet are two candles and a burner of incense. Drawing the knife " +
      "comes later.",
    evaluationCriteria:
      "Full credit: At the back of the frame the spirit tablet, candles, and incense; in " +
      "the middle of the frame, behind the table, Pan Jinlian, in mourning jacket and " +
      "skirt, sits in the host's seat and Granny Wang sits opposite across the table, " +
      "with the neighbors sitting to the side; on the right of the frame Wu Song sits at " +
      "the end of the table and calls out a respectful greeting, his knife not showing; " +
      "on the left of the frame a county soldier guards the door and another county " +
      "soldier pours wine; the candle flames and incense smoke and the sutra streamers " +
      "and paper money loop smoothly, driven by SMIL or inline CSS. Deductions: Wu " +
      "Song's knife unsheathed or Wu Song wearing a cangue; the table overturned; blood " +
      "shown; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-027": {
    coreKey:
      "Sun Erniang leaning in the doorway hailing them and Wu Song in a cangue, with the " +
      "characters tattooed on his face and a bundle on his back, with animated willow " +
      "branches and wine banner, withered vines, and cooking smoke",
    groundTruth:
      "Chapter 27, \"The Female Yaksha Sells Human Flesh on the Mengzhou Road; Captain Wu " +
      "(dutou) Meets Zhang Qing at Shizi Slope\". \"From a willow beside the stream hung " +
      "out a wine banner\"; \"the woman leaned in the doorway to greet them\"; Wu Song " +
      "wears an iron-leaf round-head protective cangue, with two lines of characters " +
      "tattooed on his face. Going into the tavern comes later.",
    evaluationCriteria:
      "Full credit: On the right of the frame Sun Erniang leans in the doorway and hails " +
      "them, her brows set with a murderous air, in a green gauze blouse and a bright " +
      "red silk skirt, hairpins and ornaments all over her head and wildflowers tucked " +
      "at her temples; in the middle of the frame Wu Song wears an iron-leaf round-head " +
      "cangue, with the characters tattooed on his face and a bundle on his back; on the " +
      "left of the frame the two escort officers carry cudgels; the willow branches and " +
      "wine banner, the withered vines, and the cooking smoke loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: Sun Erniang bare-breasted; human flesh or blood " +
      "shown; Zhang Qing; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-028": {
    coreKey:
      "Wu Song, bare-chested, looking up with his hands spread, waiting to catch, and " +
      "the bluestone block frozen in midair, with animated dust at the mouth of the pit, " +
      "and clothes and garment corners",
    groundTruth:
      "Chapter 28, \"Wu Song Overawes Anping Camp; Shi En Righteously Seizes Kuaihuo " +
      "Forest\". Wu Song \"took off the top half of his clothes and tied them round his " +
      "waist\", \"tossed it once into the air\", and \"it flew up some ten feet off the " +
      "ground\". Catching it with both hands comes later.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Wu Song, with the characters tattooed on " +
      "his face and no cangue, his clothes tied round his waist and bare above the " +
      "waist, looks up with both hands spread, waiting to catch, the bluestone block " +
      "with a hole frozen in midair above his head; on the left of the frame Shi En, his " +
      "head wrapped and his arm in a sling, in a blue gauze overgarment, has stepped " +
      "aside and watches in astonishment; the dust at the mouth of the pit and the " +
      "clothes and garment corners loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Wu Song fully naked or wearing a cangue; the stone block moving up " +
      "and down; whole figures drifting; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "shuihu-anim-029": {
    coreKey:
      "Wu Song, his cloth shirt thrown open, feigning drunkenness and looking askance " +
      "and Jiang the Door God sitting in a folding chair with a fly whisk, with animated " +
      "fly whisk, locust leaves and tree shadows, and shirt front",
    groundTruth:
      "Chapter 29, \"Shi En Again Lords It over the Mengzhou Road; Wu Song Drunkenly " +
      "Beats Jiang the Door God\". Wu Song \"asked for a small plaster and stuck it over " +
      "the characters tattooed on his face\", \"threw open his cloth shirt\", and \"gave " +
      "a sidelong glance\"; Jiang the Door God has \"purple flesh spread thick all over " +
      "his body\" and is \"holding a fly whisk, sitting under the green locust tree " +
      "enjoying the cool\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Wu Song, in a wan-pattern headscarf, his " +
      "cloth shirt thrown open, with a red waist sash and a plaster on his face, feigns " +
      "drunkenness and looks askance; on the right of the frame, under the green locust " +
      "tree, Jiang the Door God, more burly than Wu Song, with a dark purplish face and " +
      "a yellow beard, a white cloth shirt draped over him, sits in a folding chair with " +
      "a fly whisk; the fly whisk, the locust leaves and tree shadows, and the shirt " +
      "front loop smoothly, driven by SMIL or inline CSS. Deductions: Wu Song " +
      "bare-chested or holding a blade or cudgel; a tavern; the two engaged; any figure " +
      "drawn with opera face paint; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-030": {
    coreKey:
      "Wu Song in a cangue, his right hand nailed fast and his left hand free, halting " +
      "and speaking, and the two men with pudao (long-handled saber) stepping closer, " +
      "with animated ripples, reeds, and garment corners",
    groundTruth:
      "Chapter 30, \"Shi En Enters the Death-Row Prison Three Times; Wu Song Wreaks Havoc " +
      "at Feiyun Inlet\". Wu Song wears an iron-leaf clamp cangue, \"but his right hand " +
      "was nailed fast to the traveling cangue, while his left hand was free\"; \"Wu " +
      "Song halted\", and \"the two carrying pudao stepped one pace closer\".",
    evaluationCriteria:
      "Full credit: On the right of the frame the memorial archway at the bridgehead; in " +
      "the middle of the frame, on the bridge, Wu Song, with the characters tattooed on " +
      "his face, wears a cangue, his right hand nailed fast and his left hand free, and " +
      "halts and speaks; left of center in the frame the two men carry pudao and step " +
      "one pace closer; on the left of the frame the two escort officers carry cudgels; " +
      "the ripples, the reeds, and the garment corners loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: The cangue locking both hands or broken; blood shown; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "shuihu-anim-031": {
    coreKey:
      "Wu Song, dressed as an itinerant ascetic (xingzhe), striding out the door with " +
      "his hands tucked in his sleeves and Zhang Qing and his wife cheering, with " +
      "animated wine banner and willow twigs, robe and sash tassels, and prayer beads",
    groundTruth:
      "Chapter 31, \"The Blood of Military Inspector Zhang (dujian) Spatters Yuanyang " +
      "Tower; Wu the Itinerant Ascetic Crosses Wugong Ridge by Night\". \"Wu Song took " +
      "his leave and went out the door, tucked his hands into both sleeves, and strode " +
      "off with a swagger\"; \"Zhang Qing and his wife watched and cheered\"; the hair " +
      "is cut so that it \"must cover the characters tattooed on his forehead\", \"the " +
      "front hair falling level with his brows\".",
    evaluationCriteria:
      "Full credit: Left of center in the frame Wu Song, his front hair level with his " +
      "brows covering the characters tattooed on his forehead, with a thin iron " +
      "headband, a black monk's robe with a multicolored sash, prayer beads hung on his " +
      "chest, and two monk's knives at his waist, strides out the door with his hands " +
      "tucked in his sleeves; on the right of the frame Zhang Qing and Sun Erniang " +
      "cheer; the wine banner and willow twigs, the robe and sash tassels, and the " +
      "prayer beads loop smoothly, driven by SMIL or inline CSS. Deductions: Wu Song " +
      "wearing a golden headband or a felt hat, holding a monk's staff, or with loose " +
      "long hair or a shaven head; the prayer beads drawn as skulls; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-032": {
    coreKey:
      "The drunken Wu Song, an unsheathed monk's knife in his left hand, giving chase in " +
      "long strides and the big yellow dog barking, with animated stream water, robe and " +
      "withered grass and willow twigs, and dog's tail",
    groundTruth:
      "Chapter 32, \"Wu the Itinerant Ascetic Drunkenly Beats Kong Liang; the Brocade " +
      "Tiger Releases Song Jiang out of Righteousness\". \"The north wind came sweeping " +
      "up\"; Wu Song \"knotted the sleeves of his monk's robe behind his back\", wearing " +
      "a padded cloth jacket underneath, \"and with his left hand drew a monk's knife " +
      "from its sheath and went after it in long strides\"; \"that yellow dog ran " +
      "barking along the stream bank\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Wu Song, his front hair level with his " +
      "brows covering the characters tattooed on his forehead, with an iron headband, " +
      "the sleeves of his monk's robe knotted behind his back to show the sleeves of the " +
      "padded cloth jacket, and prayer beads hung on his chest, gives chase with an " +
      "unsheathed monk's knife in his left hand; on the right of the frame the big " +
      "yellow dog runs barking along the stream bank; the stream water, the robe and the " +
      "withered grass and willow twigs, and the dog's tail loop smoothly, driven by SMIL " +
      "or inline CSS. Deductions: Wu Song's knife swinging down, Wu Song falling, or his " +
      "arms bare; the yellow dog wounded; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-033": {
    coreKey:
      "Song Jiang and three attendants looking up hand in hand at the little lantern " +
      "mountain (aoshan), with animated flickering lamplight, embroidered ribbons and " +
      "fragrant balls and snow-willow sprays and green banners, and lantern tassels",
    groundTruth:
      "Chapter 33, \"Song Jiang Views the Little Lantern Mountain by Night; Hua Rong " +
      "Wreaks Havoc at Qingfeng Fort\". \"The four or five of them, hand in hand, came " +
      "before the King's Temple to look at the little lantern mountain\"; \"through the " +
      "rocks, twin dragons sport in the water; against the rosy clouds, a lone crane " +
      "faces the sky\". Song Jiang has not yet been tattooed and exiled at this point, " +
      "and has a purplish-brown complexion (Chapter 36).",
    evaluationCriteria:
      "Full credit: A bright moon at the upper left of the frame; on the right of the " +
      "frame, before the temple, the little lantern mountain hung all over with lamp " +
      "bowls, with twin dragons and a lone crane; on the left of the frame Song Jiang, " +
      "with a purplish-brown complexion, short, with no cangue and no characters " +
      "tattooed on his face, looks up hand in hand with three attendants; the " +
      "lamplight, the embroidered ribbons and fragrant balls and snow-willow sprays and " +
      "green banners, and the lantern tassels loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Song Jiang wearing a cangue, with characters tattooed on his " +
      "face, or drawn with black opera face paint; Hua Rong; sky lanterns; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "shuihu-anim-034": {
    coreKey:
      "Qin Ming reining in his horse, his wolf-tooth mace held crosswise, glaring, and " +
      "Hua Rong on horseback holding up his iron spear and calling out a respectful " +
      "greeting, with animated red tassel and red headscarves, manes and tails, and " +
      "morning mist",
    groundTruth:
      "Chapter 34, \"Guardian of Three Mountains Wreaks Havoc on the Qingzhou Road; the " +
      "Thunderbolt Rides by Night to a Field of Rubble\". \"Qin Ming reined in his " +
      "horse, held his wolf-tooth mace crosswise\"; \"Hua Rong, on horseback, holding " +
      "up his iron spear, called out a greeting to Qin Ming\"; the bandit lackeys wear " +
      "red headscarves. Shooting off the tassel comes later.",
    evaluationCriteria:
      "Full credit: On the left of the frame Qin Ming reins in his horse, with a red " +
      "tassel and a brocade robe, holds his bronze-studded wolf-tooth mace crosswise, " +
      "and glares; on the right of the frame Hua Rong, with white teeth and red lips, in " +
      "a blue headscarf, on horseback holding up his iron spear, calls out a respectful " +
      "greeting to Qin Ming, and behind him the bandit lackeys in red headscarves stand " +
      "in formation; the red tassel and red headscarves, the manes and tails, and the " +
      "morning mist loop smoothly, driven by SMIL or inline CSS. Deductions: The two " +
      "engaged; the red tassel shot off; Hua Rong wearing a helmet; the mounts drawn as " +
      "unicorns; the wolf-tooth mace drawn as a spiked iron ball; any figure drawn with " +
      "opera face paint; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "shuihu-anim-035": {
    coreKey:
      "Hua Rong drawing the slender bow to the full and aiming at the third goose in the " +
      "line of wild geese, the arrow not yet loosed, and Chao Gai and Wu Yong looking " +
      "up, with animated goose wings, flags and banners, and reeds and glinting water",
    groundTruth:
      "Chapter 35, \"The Stone General Delivers a Letter at a Village Inn; Little Li " +
      "Guang Shoots a Wild Goose at Liangshan\". \"As they reached the third pass before " +
      "the stronghold, they heard several lines of wild geese calling loud and clear in " +
      "the sky\"; \"this arrow will strike the third goose in the line of wild geese in " +
      "the head\"; \"Hua Rong fitted the arrow and drew the bow to the full\".",
    evaluationCriteria:
      "Full credit: At the upper right of the frame a line of five wild geese; on the " +
      "left of the frame Hua Rong, with white teeth and red lips, on foot, shoots " +
      "upward, drawing the slender bow to the full and aiming at the third goose in the " +
      "line of wild geese, the arrow not yet loosed; on the right of the frame Chao Gai " +
      "and Wu Yong look up; the goose wings, the flags and banners, and the reeds and " +
      "glinting water loop smoothly, driven by SMIL or inline CSS. Deductions: The arrow " +
      "flying off or a goose falling; Hua Rong on horseback; Wu Yong holding a feather " +
      "fan; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "shuihu-anim-036": {
    coreKey:
      "Song Jiang, just come to, held up by two men, Li Jun bowing down to the ground at " +
      "once, and Li Li also kneeling and bowing, with animated wine pennant, leaves and " +
      "dappled light, and grass blades",
    groundTruth:
      "Chapter 36, \"At Liangshan Marsh Wu Yong Recommends Dai Zong; on Jieyang Ridge " +
      "Song Jiang Meets Li Jun\". \"The big man had the two brothers hold Song Jiang up, " +
      "and bowed down to the ground at once\"; \"and the man who sold the wine bowed " +
      "too\". Song Jiang has \"a purplish-brown complexion\" and the characters " +
      "tattooed on his face, and his cangue has already been removed.",
    evaluationCriteria:
      "Full credit: In the middle of the frame Song Jiang, with a purplish-brown " +
      "complexion, short, with the characters tattooed on his face and no cangue, just " +
      "come to and dazed, is held up by two men; on the left of the frame Li Jun, " +
      "red-faced, bows down to the ground at once; on the right of the frame Li Li, with " +
      "a red curly beard and a cloth vest, also kneels and bows; the wine pennant, the " +
      "leaves and dappled light, and the grass blades loop smoothly, driven by SMIL or " +
      "inline CSS. Deductions: Song Jiang wearing a cangue; a knife or blood shown; the " +
      "two escort officers; any figure drawn with opera face paint; Li Li bare-chested; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
};
