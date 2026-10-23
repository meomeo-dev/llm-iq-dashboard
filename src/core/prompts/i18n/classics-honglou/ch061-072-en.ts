/**
 * 《红楼梦》第 61–72 回候选的英文标签与英文评判标准，由
 * src/core/classics/honglou/ch061-072.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const HONGLOU_CH061_072_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-061": "Ch. 61 · Baoyu Conceals the Stolen Goods as Ping'er Dispenses Justice",
  "honglou-062": "Ch. 62 · Xiangyun Sleeps Drunk on a Mattress of Peonies",
  "honglou-063": "Ch. 63 · The Beauties Hold an Evening Banquet in the House of Green Delights",
  "honglou-064": "Ch. 64 · Daiyu Mournfully Inscribes the Poems on Five Beauties",
  "honglou-065": "Ch. 65 · You Sanjie Sternly Denounces Zhen and Lian",
  "honglou-066": "Ch. 66 · Liu Xianglian Presents the Sword on the Post Road",
  "honglou-067": "Ch. 67 · The Xue Mother and Daughter Inspect Regional Gifts",
  "honglou-068": "Ch. 68 · Xifeng Entraps Second Sister You in Plain Mourning Attire",
  "honglou-069": "Ch. 69 · Hu Junrong Prescribes Medicine in the Wing Room",
  "honglou-070": "Ch. 70 · Flying Kites under Clear Skies by the Naiad's House",
  "honglou-071": "Ch. 71 · Yuanyang by Night Encounters Lovers under the Great Cassia",
  "honglou-072": "Ch. 72 · Jia Lian Pleads with Yuanyang with a Flattering Smile",
};

/** 静态与动态候选 id → 英文评判标准 */
export const HONGLOU_CH061_072_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-061": {
    coreKey:
      "Under the covered walkway of the House of Green Delights: Ping'er quietly confers " +
      "holding the rose-dew bottle and poria powder, Baoyu reaches out to take the blame, " +
      "and Xiren stands advising",
    groundTruth:
      "Chapter 61, \"To Spare the Rat the Dish Is Spared as Baoyu Conceals the Stolen Goods; " +
      "to Right the Wrong Ping'er Exercises Her Authority in Settling the Case\". Ping'er " +
      "quietly visits Xiren to inquire about the rose-dew and poria powder; Baoyu says he " +
      "took them himself when no one was looking to protect another's honor and offers to " +
      "take the blame, and Ping'er says she would not break the jade bottle just to strike a " +
      "rat. Releasing Wu'er comes later.",
    evaluationCriteria:
      "Full credit: Under the carved covered walkway of the House of Green Delights on a " +
      "summer morning, with plantains and slender bamboos; on the left of the frame young " +
      "Baoyu in a moon-white narrow-sleeved robe reaches out offering to conceal the theft " +
      "and take the blame; in the middle of the frame Ping'er, with a neat round hair bun " +
      "and a plain silver hairpin, calmly confers holding the glass dew bottle and the paper " +
      "packet of poria powder in both hands; on the right of the frame Xiren in a lotus-root-" +
      "color silk jacket stands gently advising (a compositional convention; the left and " +
      "right of the original text are not tested). Deductions: Uproar in the kitchen, beating " +
      "or detaining Liu Wu'er, or Caiyun arguing shown in the picture; penal instruments and " +
      "cangues; Manchu two-handle headdresses or Qing queues.",
  },
  "honglou-062": {
    coreKey:
      "A secluded spot behind the rocks at Red Fragrance Pavilion: Xiangyun sleeps soundly " +
      "on a stone bench pillowed on flowers, peony petals cover her head and robe, bees and " +
      "butterflies hover, and Baoyu and Daiyu watch smiling",
    groundTruth:
      "Chapter 62, \"Naive Xiangyun Sleeps Drunk on a Mattress of Peonies; Dull Xiangling " +
      "Sweetly Loosens Her Pomegranate Skirt\". All see that \"Xiangyun was lying on a " +
      "stone bench in a secluded spot by the rocks, already fast asleep, with peony blossoms " +
      "scattered all over her... the fan in her hand had fallen to the ground, half buried " +
      "in fallen blossoms, and a crowd of bees and butterflies swarmed buzzing around her, " +
      "while under her head lay a bundle of peony petals wrapped in a handkerchief\".",
    evaluationCriteria:
      "Full credit: A secluded rockery spot by Red Fragrance Pavilion in late spring; in the " +
      "middle of the frame Xiangyun, neatly dressed, sleeps soundly on a green stone bench, " +
      "pillowed on a silk handkerchief filled with petals, with peony petals covering her " +
      "head, face, and robe, lying on a red mattress of fallen petals, and her round white " +
      "silk fan half buried in blossoms; on the left of the frame bees and butterflies swarm " +
      "around her; on the right of the frame Daiyu and Baoyu by the rockery watch smiling " +
      "with their hands over their mouths (a compositional convention; the left and right " +
      "of the original text are not tested). Deductions: Disheveled clothing or exposed " +
      "chest; stepping forward to wake her or Xiangling's soiled skirt shown in the picture; " +
      "Manchu two-handle headdresses or Qing queues.",
  },
  "honglou-063": {
    coreKey:
      "Evening banquet in the warm room of the House of Green Delights: Baochai sits at the " +
      "round table drawing the ivory peony lot, Baoyu leans on a pillow clapping his hands, " +
      "and Daiyu and Tanchun raise cups in congratulations",
    groundTruth:
      "Chapter 63, \"The House of Green Delights Celebrates a Birthday with an Evening " +
      "Banquet of Beauties; Dead by Golden Elixir, the Lonely Beauty Manages Family Mourning\". " +
      "Behind closed doors the young maidens sit around a rosewood round kang table to draw " +
      "flower name lots; Qingwen presents a carved bamboo canister and ivory lots, and " +
      "Baochai throws the dice and draws the first lot, a peony inscribed \"Queen of All " +
      "Flowers\" with the Tang poem line \"Cold and detached she yet moves all hearts\".",
    evaluationCriteria:
      "Full credit: Red candles blazing in the warm room of the House of Green Delights at " +
      "midnight; in the middle of the frame Baochai in a honey-colored jacket and a " +
      "light-red silk skirt sits at the kang table holding the ivory peony lot; on the left " +
      "of the frame Baoyu in a scarlet small jacket leans on a petal-shaped cushion clapping " +
      "his hands with delight; on the right of the frame Daiyu leans against the kang edge " +
      "smiling, Tanchun raises her cup in toast, and the dice box, lot canister, and wine " +
      "cups rest on the table (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Drunken sprawling at dawn; Jia Jing's " +
      "sudden death from elixir poisoning or funeral mourning cloths shown in the picture; " +
      "Manchu headdresses or queues.",
  },
  "honglou-064": {
    coreKey:
      "The study in the Naiad's House: Baoyu draws out and admires the Five Beauties poem " +
      "scroll from under the inkstone, Daiyu reclines on the couch in shy reproach, and " +
      "Baochai lifts the curtain smiling",
    groundTruth:
      "Chapter 64, \"The Quiet Maiden Mournfully Inscribes the Poems on Five Beauties; the " +
      "Dissolute Youth Tenderly Leaves Behind the Nine-Dragon Pendant\". Baoyu visits the " +
      "Naiad's House at leisure, finds a slip of paper protruding beneath the inkstone, and " +
      "draws out Daiyu's five handwritten quatrains, praising them highly and entitling them " +
      "\"The Five Beauties\"; Baochai lifts the curtain, comes in, inspects them together, " +
      "and praises their original perspectives on history. Jia Lian presenting the pendant " +
      "comes later.",
    evaluationCriteria:
      "Full credit: The bamboo-shaded inner room of the Naiad's House in early autumn; in the " +
      "middle of the frame Baoyu in a plain moon-white robe unfolds the Five Beauties poem " +
      "scroll drawn from under the inkstone with delight; on the left of the frame Daiyu in " +
      "plain clothes reclines on the couch in shy reproach; on the right of the frame Baochai " +
      "in a honey-colored jacket lifts the bamboo curtain entering with a smile, while a " +
      "bronze censer and inkstone sit on the table (a compositional convention; the left " +
      "and right of the original text are not tested). Deductions: Jia Jing's funeral, " +
      "coffin, or hemp mourning attire; Jia Lian flirting or gifting the pendant in the tea " +
      "room; Manchu headdresses or queues.",
  },
  "honglou-065": {
    coreKey:
      "The central hall in Little Flower Branch Lane: You Sanjie in a red jacket and green " +
      "skirt proudly denounces the men, while Jia Zhen and Jia Lian stand awkwardly " +
      "bowing with sheepish smiles by the cold feast",
    groundTruth:
      "Chapter 65, \"Jia the Second Secretly Takes Second Sister You as Concubine; Third " +
      "Sister You Longs to Marry the Second Brother Liu\". Jia Zhen visits the new house in " +
      "secret; Jia Lian returns unexpectedly and brings Third Sister to join the drinking; " +
      "hating their frivolous advances, \"with her hair loosely coiled... in a scarlet " +
      "jacket... she pointed at Jia Lian and laughed: 'You needn't play your slippery " +
      "tricks with me; I see right through you!'\" severely rebuking their hypocrisy until " +
      "they submit meekly. Vowing to marry Liu Xianglian comes later.",
    evaluationCriteria:
      "Full credit: The central hall of the residence in Little Flower Branch Lane on an " +
      "early autumn night; on the left of the frame You Sanjie, with loosely coiled hair and " +
      "a silver hairpin, wearing a scarlet jacket and onion-green pleated skirt, stands " +
      "proudly pointing and denouncing with dignified authority; in the middle of the frame " +
      "a square table holds the cold feast, pewter wine pot, and cups; on the right of the " +
      "frame Jia Zhen and Jia Lian bow and shrink back with guilty, sheepish smiles (a " +
      "compositional convention; the left and right of the original text are not tested). " +
      "Deductions: Bare skin or flirtatious physical touching shown in the picture; the bridal " +
      "bedchamber; theatrical painted face makeup; Manchu headdresses or queues.",
  },
  "honglou-066": {
    coreKey:
      "The post pavilion on the Ping'an Prefecture highway: Liu Xianglian holds up the " +
      "twin Mandarin Duck swords as a marriage pledge, Jia Lian bows to receive them by " +
      "his horse, and Xue Pan looks on smiling",
    groundTruth:
      "Chapter 66, \"The Romantic Maiden Returns in Shame to the Netherworld; the Cold " +
      "Youth Enters the Gate of Emptiness in Desolation\". Jia Lian meets Xue Pan and Liu " +
      "Xianglian on the Ping'an Prefecture highway and acts as matchmaker for Third Sister; " +
      "delighted, Xianglian \"untied his bag and drew out the sword, presenting it to Jia " +
      "Lian\" as a marriage token, encased in a scabbard adorned with dragons and gems. Later " +
      "Xianglian suspects her virtue and demands the sword back, Third Sister slits her throat, " +
      "and Xianglian becomes a monk.",
    evaluationCriteria:
      "Full credit: The post pavilion on the highway on a clear autumn midday; in the middle " +
      "of the frame Liu Xianglian in narrow-sleeved archer's robes holds up the ancestral " +
      "Mandarin Duck swords with both hands (a dragon-decorated scabbard with long apricot-" +
      "yellow tassels); on the left of the frame Jia Lian stands by his horse bowing with " +
      "open arms to receive them; on the right of the frame Xue Pan on horseback looks on " +
      "smiling (a compositional convention; the left and right of the original text are not " +
      "tested). Deductions: Slitting the throat, flowing blood, or tonsure into the " +
      "monastery shown in the picture; a ruined temple; Qing queues or official hats.",
  },
  "honglou-067": {
    coreKey:
      "Aunt Xue's inner hall: Xue Pan opens the boxes and points smilingly at regional " +
      "gifts, Baochai holds a green-gauze box admiring a clay figurine of Xue Pan, and " +
      "Aunt Xue leans on the table smiling",
    groundTruth:
      "Chapter 67, \"Seeing Regional Gifts Daiyu Longs for Her Old Home; Hearing Secret " +
      "Matters Xifeng Interrogates the House Servants\". Xue Pan returns from Jiangnan with " +
      "two large palm-fiber boxes of local specialties; the mother and daughter open them " +
      "and find \"self-moving figures, drinking-game toys, mercury tumbling-dolls, sand " +
      "lanterns, and sets of clay figurine plays from Tiger Hill\"; Baochai smiles holding " +
      "the figurine of Xue Pan. Daiyu weeping over homesickness and Xifeng interrogating the " +
      "servants come later.",
    evaluationCriteria:
      "Full credit: Aunt Xue's inner hall in late summer or early autumn; on the left of " +
      "the frame Aunt Xue in a dark jacket leans on the table smiling kindly at her children; " +
      "in the middle of the frame two opened large boxes on the sandalwood table display " +
      "toys and fancy stationery, and Baochai in a light-yellow jacket holds a green-gauze " +
      "box smiling at the clay figurine; on the right of the frame Xue Pan points proudly " +
      "at the gifts, with Ying'er standing in attendance (a compositional convention; the " +
      "left and right of the original text are not tested). Deductions: Daiyu weeping or " +
      "Xifeng beating servants shown in the picture; modern clockwork or plastic toys; " +
      "Manchu headdresses or queues.",
  },
  "honglou-068": {
    coreKey:
      "The courtyard in Little Flower Branch Lane: Xifeng in plain silver hairpins, a " +
      "moon-white jacket, and a blue cloak beams warmly and supports Second Sister You, " +
      "who bows gracefully in plain dress",
    groundTruth:
      "Chapter 68, \"Bitter Second Sister You Is Entrapped into Prospect Garden; Jealous " +
      "Xifeng Causes an Uproar in the Ningguo Mansion\". Taking advantage of Jia Lian's " +
      "absence, Xifeng rides in a plain carriage to the lane, \"her hair adorned only with " +
      "plain silver ornaments, wearing a moon-white satin jacket, a blue satin cloak, and a " +
      "white damask skirt... charming as a spring peach\"; Second Sister comes out bowing, " +
      "and Xifeng returns the greeting with warm smiles, taking her hand. Later she gives " +
      "presents and coaxes her into the Garden.",
    evaluationCriteria:
      "Full credit: The courtyard of the house in Little Flower Branch Lane on a frosty " +
      "autumn morning; in the middle of the frame Wang Xifeng in plain silver ornaments, a " +
      "moon-white jacket, a blue cloak, and a white skirt warmly supports Second Sister You; " +
      "on the right of the frame Second Sister in a plain jacket and skirt bows in greeting; " +
      "on the left of the frame a plain carriage waits outside the gate, with Ping'er " +
      "holding wrapped gifts (a compositional convention; the left and right of the " +
      "original text are not tested). Deductions: Xifeng wearing festive red garments or a " +
      "golden phoenix headdress; making an angry scene in the Ningguo Mansion; Manchu " +
      "headdresses or queues.",
  },
  "honglou-069": {
    coreKey:
      "The outer room of the wing in Prospect Garden: Physician Hu sits at the table " +
      "writing a prescription, Jia Lian bows anxiously at his side inquiring, and a page " +
      "holds a tray awaiting the medical fee",
    groundTruth:
      "Chapter 69, \"With Cunning Schemes She Kills with a Borrowed Sword; Knowing Her Time " +
      "Has Come She Swallows Raw Gold to Die\". Jia Lian invites Dr. Hu Junrong to examine " +
      "Second Sister You's illness; Hu mistakenly diagnoses stagnant blood, \"closed the " +
      "bed-curtains, came out with Jia Lian, who asked how she was... and wrote a " +
      "prescription before taking his leave. Jia Lian ordered the medical fee to be " +
      "delivered\". The violent medicine aborts her male infant, and in despair Second " +
      "Sister swallows raw gold and dies.",
    evaluationCriteria:
      "Full credit: The outer parlor of the eastern wing in Prospect Garden in late winter; " +
      "in the middle of the frame Hu Junrong in a scholar's cap and gray Taoist robe sits at " +
      "the desk with raised brush drafting a prescription; on the left of the frame Jia Lian " +
      "in a plain robe bows with cupped hands anxiously asking questions; on the right of " +
      "the frame a young page in blue clothes stands holding a brass tray with silver pieces " +
      "(a compositional convention; the left and right of the original text are not tested). " +
      "Deductions: Bed-curtains pulled open inside, Second Sister hemorrhaging or swallowing " +
      "gold shown in the picture; Qiu Tong cursing; Qing official hats or queues.",
  },
  "honglou-070": {
    coreKey:
      "The open ground outside the Naiad's House: Daiyu holds the spool with a handkerchief " +
      "flying the maiden kite, Zijuan holds silver scissors ready to cut the string, and " +
      "Baoyu and Baochai look up",
    groundTruth:
      "Chapter 70, \"Lin Daiyu Revives the Peach Blossom Poetry Club; Shi Xiangyun Casually " +
      "Composes Willow Catkin Lyrics\". In late spring the young ladies fly kites outside " +
      "the Naiad's House to cast off bad luck; \"hearing this, Daiyu padded her hand with " +
      "a handkerchief... and took the spool\", while Zijuan \"took a pair of small Western " +
      "silver scissors and snipped the string right at the base of the spool with a clean " +
      "click\". The kite drifts away into the clouds.",
    evaluationCriteria:
      "Full credit: The open slope outside the Naiad's House on a clear spring day with an " +
      "east breeze; on the left of the frame Daiyu with a padded handkerchief holds the " +
      "bamboo spool flying a painted maiden kite; in the middle of the frame Zijuan approaches " +
      "the line with small Western silver scissors ready to snip it; on the right of the " +
      "frame Baoyu and Baochai look up smiling, with phoenix and wild-goose kites in the sky " +
      "(a compositional convention; the left and right of the original text are not tested). " +
      "Deductions: The kite string already severed and drifting away; Baoyu stomping on a " +
      "broken kite; modern plastic reels; Manchu headdresses or queues.",
  },
  "honglou-071": {
    coreKey:
      "Under the shade of the great cassia behind the garden rocks: Yuanyang turns the " +
      "rock and stops alertly, Siqi in a red skirt shrinks back in panic, and Pan You'an " +
      "crouches in the rock cleft",
    groundTruth:
      "Chapter 71, \"Spiteful Persons Deliberately Cause Rifts; the Mandarin Duck Maiden " +
      "Unwittingly Encounters a Pair of Mandarin Ducks\". After the evening banquet, under a " +
      "half moon in the quiet garden, Yuanyang walks to the shade of the great cassia behind " +
      "the rocks and hears rustling clothes; \"she made out a figure in a red skirt and " +
      "disheveled hair of tall, plump build, who was Siqi from Yingchun's apartments\", and " +
      "saw the young servant Pan You'an hiding. Later both kneel weeping to beg for mercy, " +
      "and Yuanyang vows never to speak of it.",
    evaluationCriteria:
      "Full credit: Under the shade of the great cassia behind the Taihu rocks on an early " +
      "autumn night under a half moon; on the left of the frame Yuanyang in a light-green " +
      "jacket and white skirt stops alertly looking aside; in the middle of the frame Siqi " +
      "in a bright red skirt and disheveled hair hastily shrinks into the trees and rocks; " +
      "on the right of the frame Pan You'an crouches in the dark shadows of the rocks, with " +
      "the distant gatehouse lamp visible (a compositional convention; the left and right " +
      "of the original text are not tested). Deductions: The two kneeling and kowtowing; " +
      "intimate physical contact; the banquet feast; Manchu headdresses or queues.",
  },
  "honglou-072": {
    coreKey:
      "Ping'er's room in the eastern wing: Jia Lian bows with cupped hands smilingly " +
      "pleading to borrow silver chests, Yuanyang sits calmly on the warm kang watching him " +
      "with a smile, and Ping'er holds clothes",
    groundTruth:
      "Chapter 72, \"Wang Xifeng Relies on Her Pride and Conceals Her Illness; Lai Wang's " +
      "Wife Relies on Her Influence to Force a Marriage\". Facing a financial deficit after " +
      "the birthday celebration, Jia Lian visits Ping'er's room and sees Yuanyang: \"He " +
      "quickly stood up and said, 'Dear sister, sit a while longer, your brother has a " +
      "favor to ask... secretly carry out a chest of gold and silver vessels that the " +
      "Dowager won't check on, so I can pawn it for about a thousand taels to tide us over'\", " +
      "and Yuanyang teases him with a smile. Forcing Caixia to marry Lai Wang's son comes later.",
    evaluationCriteria:
      "Full credit: Ping'er's room in the eastern wing of Xifeng's compound on an autumn " +
      "afternoon; on the left of the frame Jia Lian in a plain robe bows with cupped hands " +
      "pleading with a flattering smile; in the middle of the frame Yuanyang sits calmly on " +
      "the warm kang looking at him with a composed smile; on the right of the frame Ping'er " +
      "holds folded clothes watching with a hidden smile, and a maid offers a blue-and-white " +
      "teacup (a compositional convention; the left and right of the original text are not " +
      "tested). Deductions: Xifeng groaning on a sickbed or Lai Wang's wife forcing a " +
      "marriage; pawning at a pawnshop; Manchu headdresses or queues.",
  },
  "honglou-anim-061": {
    coreKey:
      "Ping'er conferring while holding the dew bottle and poria powder, Baoyu reaching out " +
      "to take the blame, and Xiren standing by, with animated plantain branches, dew " +
      "liquid, and flying birds",
    groundTruth:
      "Chapter 61, \"To Spare the Rat the Dish Is Spared as Baoyu Conceals the Stolen Goods; " +
      "to Right the Wrong Ping'er Exercises Her Authority in Settling the Case\". Ping'er " +
      "quietly visits Xiren to inquire about the rose-dew and poria powder; Baoyu says he " +
      "took them himself when no one was looking to protect another's honor and offers to " +
      "take the blame, and Ping'er says she would not break the jade bottle just to strike a " +
      "rat. Releasing Wu'er comes later.",
    evaluationCriteria:
      "Full credit: Under the covered walkway of the House of Green Delights on a summer " +
      "morning; in the middle of the frame Ping'er holds the glass dew bottle and poria " +
      "powder; on the left of the frame Baoyu reaches out to take the blame; on the right " +
      "of the frame Xiren stands in attendance (a compositional convention; the left and " +
      "right of the original text are not tested); the plantain leaves and bamboo branches, " +
      "the rose-dew inside the bottle, and the birds outside the walkway loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: Interrogating servants or kitchen uproar " +
      "shown in the picture; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-062": {
    coreKey:
      "Xiangyun sleeping on the stone bench pillowed on flowers, with peony petals covering " +
      "her robe, and animated swirling petals, circling bees and butterflies, and swaying " +
      "peony twigs",
    groundTruth:
      "Chapter 62, \"Naive Xiangyun Sleeps Drunk on a Mattress of Peonies; Dull Xiangling " +
      "Sweetly Loosens Her Pomegranate Skirt\". All see that \"Xiangyun was lying on a " +
      "stone bench in a secluded spot by the rocks, already fast asleep, with peony blossoms " +
      "scattered all over her... the fan in her hand had fallen to the ground, half buried " +
      "in fallen blossoms, and a crowd of bees and butterflies swarmed buzzing around her, " +
      "while under her head lay a bundle of peony petals wrapped in a handkerchief\".",
    evaluationCriteria:
      "Full credit: A secluded rockery spot by Red Fragrance Pavilion on an early summer " +
      "midday; in the middle of the frame Xiangyun, neatly dressed, sleeps on the stone " +
      "bench with a flower pillow, petals on her robe; on the left of the frame her round " +
      "fan is half buried in blossoms; on the right of the frame Baoyu and Daiyu watch " +
      "smiling (a compositional convention; the left and right of the original text are not " +
      "tested); the falling peony petals, the circling bees and butterflies, and the swaying " +
      "peony twigs loop smoothly, driven by SMIL or inline CSS. Deductions: Disheveled " +
      "clothing; waking her or drinking sour soup; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-063": {
    coreKey:
      "Baochai sitting at the table drawing the ivory peony lot, Baoyu leaning on a pillow " +
      "applauding, and Daiyu holding a wine cup, with animated candle flames, shimmering " +
      "ivory lot, and fluttering curtains",
    groundTruth:
      "Chapter 63, \"The House of Green Delights Celebrates a Birthday with an Evening " +
      "Banquet of Beauties; Dead by Golden Elixir, the Lonely Beauty Manages Family Mourning\". " +
      "Behind closed doors the young maidens sit around a rosewood round kang table to draw " +
      "flower name lots; Qingwen presents a carved bamboo canister and ivory lots, and " +
      "Baochai throws the dice and draws the first lot, a peony inscribed \"Queen of All " +
      "Flowers\" with the Tang poem line \"Cold and detached she yet moves all hearts\".",
    evaluationCriteria:
      "Full credit: The evening banquet in the warm room of the House of Green Delights at " +
      "midnight; in the middle of the frame Baochai draws the ivory peony lot; on the left " +
      "of the frame Baoyu applauds from his cushion; on the right of the frame Daiyu smiles " +
      "holding her cup (a compositional convention; the left and right of the original text " +
      "are not tested); the candle flames, the sheen on the ivory lot, and the crimson " +
      "window curtains loop smoothly, driven by SMIL or inline CSS. Deductions: Jia Jing's " +
      "funeral mourning rituals; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-064": {
    coreKey:
      "Baoyu reading the Five Beauties scroll, Daiyu reclining in reproach, and Baochai " +
      "lifting the curtain, with animated rising bronze censer smoke, moving bamboo shadows, " +
      "and trembling paper edge",
    groundTruth:
      "Chapter 64, \"The Quiet Maiden Mournfully Inscribes the Poems on Five Beauties; the " +
      "Dissolute Youth Tenderly Leaves Behind the Nine-Dragon Pendant\". Baoyu visits the " +
      "Naiad's House at leisure, finds a slip of paper protruding beneath the inkstone, and " +
      "draws out Daiyu's five handwritten quatrains, praising them highly and entitling them " +
      "\"The Five Beauties\"; Baochai lifts the curtain, comes in, inspects them together, " +
      "and praises their original perspectives on history. Jia Lian presenting the pendant " +
      "comes later.",
    evaluationCriteria:
      "Full credit: The study in the Naiad's House in early autumn; in the middle of the " +
      "frame Baoyu unfolds the Five Beauties poem scroll; on the left of the frame Daiyu " +
      "reclines on the couch; on the right of the frame Baochai enters lifting the curtain " +
      "(a compositional convention; the left and right of the original text are not tested); " +
      "the smoke from the bronze censer, the bamboo shadows on the wall, and the corner of " +
      "the paper scroll loop smoothly, driven by SMIL or inline CSS. Deductions: Funeral " +
      "mourning or Jia Lian gifting the pendant; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-065": {
    coreKey:
      "You Sanjie standing proudly in her red jacket and green skirt rebuking the men, with " +
      "Jia Zhen and Jia Lian bowing sheepishly, and animated candle flames, swaying gold " +
      "earrings, and fluttering door curtain",
    groundTruth:
      "Chapter 65, \"Jia the Second Secretly Takes Second Sister You as Concubine; Third " +
      "Sister You Longs to Marry the Second Brother Liu\". Jia Zhen visits the new house in " +
      "secret; Jia Lian returns unexpectedly and brings Third Sister to join the drinking; " +
      "hating their frivolous advances, \"with her hair loosely coiled... in a scarlet " +
      "jacket... she pointed at Jia Lian and laughed: 'You needn't play your slippery " +
      "tricks with me; I see right through you!'\" severely rebuking their hypocrisy until " +
      "they submit meekly. Vowing to marry Liu Xianglian comes later.",
    evaluationCriteria:
      "Full credit: The central hall in Little Flower Branch Lane at night; on the left of " +
      "the frame You Sanjie denounces the men proudly in her red jacket and green skirt; in " +
      "the middle of the frame a table holds the pewter pot and cups; on the right of the " +
      "frame Zhen and Lian bow sheepishly (a compositional convention; the left and right of " +
      "the original text are not tested); the candle flame, Sanjie's earrings, and the door " +
      "curtain loop smoothly, driven by SMIL or inline CSS. Deductions: Flirtatious physical " +
      "touching; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-066": {
    coreKey:
      "Liu Xianglian holding up the twin Mandarin Duck swords, Jia Lian bowing to receive " +
      "them, and animated tavern banner, swaying apricot-yellow sword tassels, and waving " +
      "horse mane",
    groundTruth:
      "Chapter 66, \"The Romantic Maiden Returns in Shame to the Netherworld; the Cold " +
      "Youth Enters the Gate of Emptiness in Desolation\". Jia Lian meets Xue Pan and Liu " +
      "Xianglian on the Ping'an Prefecture highway and acts as matchmaker for Third Sister; " +
      "delighted, Xianglian \"untied his bag and drew out the sword, presenting it to Jia " +
      "Lian\" as a marriage token, encased in a scabbard adorned with dragons and gems. Later " +
      "Xianglian suspects her virtue and demands the sword back, Third Sister slits her throat, " +
      "and Xianglian becomes a monk.",
    evaluationCriteria:
      "Full credit: The highway post pavilion on a clear autumn day; in the middle of the " +
      "frame Liu Xianglian holds up the twin Mandarin Duck swords; on the left of the frame " +
      "Jia Lian bows to receive them; on the right of the frame Xue Pan watches on horseback " +
      "(a compositional convention; the left and right of the original text are not tested); " +
      "the tavern banner, the apricot-yellow sword tassels, and the horse's mane and tail " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Slitting the throat with " +
      "flowing blood or tonsure into the monastery; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-067": {
    coreKey:
      "The sandalwood table displaying Jiangnan toys in opened boxes, with Baochai holding " +
      "the figurine box, and animated rolling mercury tumbling-doll, trickling sand lantern, " +
      "and fluttering gauze curtain",
    groundTruth:
      "Chapter 67, \"Seeing Regional Gifts Daiyu Longs for Her Old Home; Hearing Secret " +
      "Matters Xifeng Interrogates the House Servants\". Xue Pan returns from Jiangnan with " +
      "two large palm-fiber boxes of local specialties; the mother and daughter open them " +
      "and find \"self-moving figures, drinking-game toys, mercury tumbling-dolls, sand " +
      "lanterns, and sets of clay figurine plays from Tiger Hill\"; Baochai smiles holding " +
      "the figurine of Xue Pan. Daiyu weeping over homesickness and Xifeng interrogating the " +
      "servants come later.",
    evaluationCriteria:
      "Full credit: Aunt Xue's inner hall in early autumn; in the middle of the frame the " +
      "table displays Jiangnan toys from opened boxes, and Baochai holds the clay figurine " +
      "box; on the left of the frame Aunt Xue smiles; on the right of the frame Xue Pan " +
      "points (a compositional convention; the left and right of the original text are not " +
      "tested); the mercury tumbling-doll, the trickling sand in the lantern, and the corner " +
      "of the green gauze curtain loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Daiyu weeping or Xifeng beating servants; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-068": {
    coreKey:
      "Xifeng in plain silver ornaments and a blue cloak supporting Second Sister You as " +
      "she greets in plain dress, with animated fluttering cloak hem, horse frosty breath, " +
      "and drifting autumn leaves",
    groundTruth:
      "Chapter 68, \"Bitter Second Sister You Is Entrapped into Prospect Garden; Jealous " +
      "Xifeng Causes an Uproar in the Ningguo Mansion\". Taking advantage of Jia Lian's " +
      "absence, Xifeng rides in a plain carriage to the lane, \"her hair adorned only with " +
      "plain silver ornaments, wearing a moon-white satin jacket, a blue satin cloak, and a " +
      "white damask skirt... charming as a spring peach\"; Second Sister comes out bowing, " +
      "and Xifeng returns the greeting with warm smiles, taking her hand. Later she gives " +
      "presents and coaxes her into the Garden.",
    evaluationCriteria:
      "Full credit: The courtyard of the house in Little Flower Branch Lane on a frosty autumn " +
      "morning; in the middle of the frame Xifeng in silver ornaments, a blue cloak, and a " +
      "moon-white jacket supports Second Sister; on the right of the frame Second Sister " +
      "bows in greeting; on the left of the frame a plain carriage waits (a compositional " +
      "convention; the left and right of the original text are not tested); the cloak and " +
      "skirt hems, the horse's frosty breath, and the falling leaves loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: Xifeng in festive red or gold phoenix ornaments; " +
      "raging in Ningguo Mansion; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "honglou-anim-069": {
    coreKey:
      "Physician Hu sitting at the desk drafting a prescription, Jia Lian bowing to inquire, " +
      "and animated brush tip writing, glowing charcoal brazier, and swaying door curtain",
    groundTruth:
      "Chapter 69, \"With Cunning Schemes She Kills with a Borrowed Sword; Knowing Her Time " +
      "Has Come She Swallows Raw Gold to Die\". Jia Lian invites Dr. Hu Junrong to examine " +
      "Second Sister You's illness; Hu mistakenly diagnoses stagnant blood, \"closed the " +
      "bed-curtains, came out with Jia Lian, who asked how she was... and wrote a " +
      "prescription before taking his leave. Jia Lian ordered the medical fee to be " +
      "delivered\". The violent medicine aborts her male infant, and in despair Second " +
      "Sister swallows raw gold and dies.",
    evaluationCriteria:
      "Full credit: The outer parlor of the wing room in late winter; in the middle of the " +
      "frame Physician Hu drafts a prescription at the table; on the left of the frame Jia " +
      "Lian bows asking questions; on the right of the frame a page holds a tray (a " +
      "compositional convention; the left and right of the original text are not tested); " +
      "the brush tip, the glowing charcoal in the brazier, and the door curtain loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Swallowing gold or bleeding in " +
      "bed; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "honglou-anim-070": {
    coreKey:
      "Daiyu holding the spool with a padded handkerchief, Zijuan holding silver scissors " +
      "ready to cut the line, and animated maiden kite soaring, vibrating taut string, and " +
      "swaying bamboo grove",
    groundTruth:
      "Chapter 70, \"Lin Daiyu Revives the Peach Blossom Poetry Club; Shi Xiangyun Casually " +
      "Composes Willow Catkin Lyrics\". In late spring the young ladies fly kites outside " +
      "the Naiad's House to cast off bad luck; \"hearing this, Daiyu padded her hand with " +
      "a handkerchief... and took the spool\", while Zijuan \"took a pair of small Western " +
      "silver scissors and snipped the string right at the base of the spool with a clean " +
      "click\". The kite drifts away into the clouds.",
    evaluationCriteria:
      "Full credit: The open slope outside the Naiad's House in late spring; on the left of " +
      "the frame Daiyu holds the spool guiding the line; in the middle of the frame Zijuan " +
      "holds silver scissors ready to cut; on the right of the frame Baoyu and Baochai look " +
      "up (a compositional convention; the left and right of the original text are not " +
      "tested); the soaring maiden kite, the taut vibrating string, and the swaying bamboo " +
      "grove loop smoothly, driven by SMIL or inline CSS. Deductions: The kite already " +
      "severed and lost; stomping on a kite; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-071": {
    coreKey:
      "Yuanyang walking by night and pausing alertly, Siqi hiding in her red skirt, Pan " +
      "You'an crouching in the rock cleft, with animated rustling cassia leaves, fluttering " +
      "red skirt, and shifting moonlight",
    groundTruth:
      "Chapter 71, \"Spiteful Persons Deliberately Cause Rifts; the Mandarin Duck Maiden " +
      "Unwittingly Encounters a Pair of Mandarin Ducks\". After the evening banquet, under a " +
      "half moon in the quiet garden, Yuanyang walks to the shade of the great cassia behind " +
      "the rocks and hears rustling clothes; \"she made out a figure in a red skirt and " +
      "disheveled hair of tall, plump build, who was Siqi from Yingchun's apartments\", and " +
      "saw the young servant Pan You'an hiding. Later both kneel weeping to beg for mercy, " +
      "and Yuanyang vows never to speak of it.",
    evaluationCriteria:
      "Full credit: The shade of the great cassia behind the rocks on an autumn night under " +
      "a half moon; on the left of the frame Yuanyang stops alertly; in the middle of the " +
      "frame Siqi shrinks into hiding in her red skirt; on the right of the frame Pan " +
      "You'an crouches in the cleft (a compositional convention; the left and right of the " +
      "original text are not tested); the swaying cassia branches, the fluttering red skirt " +
      "hem, and the drifting clouds and moonlight loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Kowtowing and weeping or intimate physical contact; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "honglou-anim-072": {
    coreKey:
      "Jia Lian bowing with cupped hands and a flattering smile pleading to borrow chests, " +
      "Yuanyang sitting composedly on the warm kang watching, with animated rising tea steam, " +
      "trembling wide sleeve, and swaying bamboo blind",
    groundTruth:
      "Chapter 72, \"Wang Xifeng Relies on Her Pride and Conceals Her Illness; Lai Wang's " +
      "Wife Relies on Her Influence to Force a Marriage\". Facing a financial deficit after " +
      "the birthday celebration, Jia Lian visits Ping'er's room and sees Yuanyang: \"He " +
      "quickly stood up and said, 'Dear sister, sit a while longer, your brother has a " +
      "favor to ask... secretly carry out a chest of gold and silver vessels that the " +
      "Dowager won't check on, so I can pawn it for about a thousand taels to tide us over'\", " +
      "and Yuanyang teases him with a smile. Forcing Caixia to marry Lai Wang's son comes later.",
    evaluationCriteria:
      "Full credit: Ping'er's room on an autumn afternoon; on the left of the frame Jia Lian " +
      "bows pleading with a flattering smile; in the middle of the frame Yuanyang sits on " +
      "the warm kang; on the right of the frame Ping'er holds clothes smiling, with a maid " +
      "serving tea (a compositional convention; the left and right of the original text are " +
      "not tested); the steam from the teacup, the trembling sleeve of Jia Lian's robe, and " +
      "the thin bamboo blind loop smoothly, driven by SMIL or inline CSS. Deductions: Xifeng " +
      "gravely ill or pawning in a pawnshop; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
};
