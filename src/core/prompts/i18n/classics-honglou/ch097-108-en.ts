/**
 * English labels and prompt standards for Dream of the Red Chamber Chapters 97-108,
 * translated from src/core/classics/honglou/ch097-108.ts.
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** Static candidate id -> English label; dynamic candidate appends "(Animated)" */
export const HONGLOU_CH097_108_LABELS_EN: Readonly<Record<string, string>> = {
  "honglou-097": "Ch. 97 · Lin Daiyu Burns Her Poems to Sever Earthly Love",
  "honglou-098": "Ch. 98 · Baoyu Mourns Daiyu by the Bamboo at Naiad's House",
  "honglou-099": "Ch. 99 · Jia Zheng Faces Extortion in the Grain Registry",
  "honglou-100": "Ch. 100 · Tanchun Bids Farewell in Grand Robes at Autumn Studio",
  "honglou-101": "Ch. 101 · Xifeng Draws an Ominous Divination at Sanhua Temple",
  "honglou-102": "Ch. 102 · Setting Up an Altar to Exorcise Evil Spirits in the Grand View Hall",
  "honglou-103": "Ch. 103 · Jia Yu-tsun Examines Case Dockets in Shuntian Prefecture",
  "honglou-104": "Ch. 104 · Jia Zheng Examines Baoyu's Studies in Mengpo Studio",
  "honglou-105": "Ch. 105 · Embroidered-Uniform Guards Announce Confiscation in Ningguo Hall",
  "honglou-106": "Ch. 106 · The Lady Dowager Kneels to Pray to Heaven to Avert Calamity",
  "honglou-107": "Ch. 107 · The Lady Dowager Distributes Her Savings to Relieve the Clan",
  "honglou-108": "Ch. 108 · Baoyu Mourns by Night in the Deserted Naiad's House",
};

export const HONGLOU_LABELS_CH097_108_EN = HONGLOU_CH097_108_LABELS_EN;

/** Static and dynamic candidate id -> English prompt evaluation standards */
export const HONGLOU_CH097_108_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "honglou-097": {
    coreKey:
      "Naiad's House sickbed: Daiyu leans forward casting her poem handkerchief and manuscripts into the brazier, Zijuan reaches out weeping, and Xiyan stands crying beside the table",
    groundTruth:
      "Chapter 97, \"Lin Daiyu Burns Her Poems to Sever Passion; Xue Baochai Goes Forth from Her Maiden Bower to Celebrate the Grand Rite\". " +
      "Knowing her end is near, Daiyu has Xiyan set up the bronze brazier and bring her inscribed handkerchief and manuscripts. " +
      "She nods at the fire and casts them in; Zijuan tries to grab them in vain as they curl into ashes. Meanwhile, wedding music resounds " +
      "at Happy Red Court for Baoyu and Baochai. Daiyu resolutely severs earthly love in chilly isolation before her death.",
    evaluationCriteria:
      "Full credit: Early spring chilly night in Naiad's House with lowered plain curtains and a dim oil lamp; on the left Zijuan in a lilac jacket reaches out weeping; " +
      "in the center Daiyu in ivory plain silk nightclothes leans forward from the bed watching the brazier as her handkerchief and manuscripts burn to ash; " +
      "on the right Xiyan covers her face weeping (compositional convention; original textual left and right are not tested). " +
      "Deductions: Wedding celebration in Happy Red Court depicted; Daiyu's gruesome death throes; Qing banner costumes or queues.",
  },
  "honglou-098": {
    coreKey:
      "Naiad's House mourning hall: Baoyu collapses on a mottled bamboo chair weeping bitterly before Daiyu's coffin, while Zijuan kneels beside the altar recounting her dying words",
    groundTruth:
      "Chapter 98, \"Bitter Crimson Pearl's Soul Returns to the Realm of Separation; Ailing Divine Luminary Sheds Tears upon the Soil of Longing\". " +
      "Learning of the substitution trick and Daiyu's death, Baoyu is overcome with grief and visits Naiad's House in a bamboo chair. " +
      "Facing Daiyu's coffin draped in white curtains, he weeps inconsolably. Zijuan kneels tearfully beside the altar and recounts how Daiyu burned her poems " +
      "and spoke her dying words, marking the earthly conclusion of the wood-and-stone alliance.",
    evaluationCriteria:
      "Full credit: Naiad's House mourning hall with white curtains and lingering incense smoke; on the left Baoyu in plain hemp robes collapses on a mottled bamboo chair weeping bitterly; " +
      "on the right Zijuan in white mourning attire kneels beside the altar recounting dying words (compositional convention; original textual left and right are not tested). " +
      "Deductions: Showing Daiyu's corpse; bridal chamber red candles or underworld spirits; Qing queues or banner gowns.",
  },
  "honglou-099": {
    coreKey:
      "Grain registry office: Jia Zheng sits solemnly holding his vermilion brush under candlelight, while Li Shi'er bows fawningly whispering insidious advice beside piled dossiers",
    groundTruth:
      "Chapter 99, \"Guarding Official Discipline, an Evil Clerk Resorts to Insolence; Exercising Bureaucratic Cunning, a Minor Functionary Exerts Extortion\". " +
      "Appointed Grain Intendant of Jiangxi, Jia Zheng prohibits customary extortion, prompting clerks and attendants to stage work slowdowns. " +
      "Li Shi'er approaches Jia Zheng at night amidst piles of neglected official documents, subtly coercing him to compromise between outward repute and practical leeway. " +
      "Overwhelmed by bureaucratic gridlock, Jia Zheng wavers with a sigh.",
    evaluationCriteria:
      "Full credit: Grain Intendant private office on a winter night; on the left Jia Zheng wearing a black gauze cap and sapphire round-collar robe sits holding his vermilion brush with a stern gaze; " +
      "in the center the desk is piled with dossiers and illuminated by a tall candle; on the right Li Shi'er in brown servant garb bows whispering corrupt advice " +
      "(compositional convention; original textual left and right are not tested). Deductions: Depicting public courtroom hearings or striking clerks; Qing mandarin hats, rank badges, or queues.",
  },
  "honglou-100": {
    coreKey:
      "Autumn Studio steps: Tanchun stands solemnly in imperial ceremonial robes bidding farewell, while Baoyu weeps bitterly before her amid lush plantains and distant official barges",
    groundTruth:
      "Chapter 100, \"Spoiling a Good Thing, Xiangling Incurs Deep Hatred; Sorrowful over Distant Marriage, Baoyu Feels Grief of Parting\". " +
      "Arranged into marriage by Jia Zheng in the maritime province, Tanchun is granted nobility rank and prepares for distant departure. " +
      "Before Autumn Studio, she appears in full ceremonial robes, dignified and resolute; hearing of her departure, Baoyu is overcome by grief over family separation and weeps profusely at the steps. " +
      "This represents the poignant climax of the Separation of Kin song.",
    evaluationCriteria:
      "Full credit: Autumn Studio courtyard in early summer; on the left Baoyu in a plain blue gown bows covering his face in tears; " +
      "on the right Tanchun wearing a gold phoenix hairpin and scarlet embroidered wide-sleeved court robe stands erect in farewell; " +
      "wide plantain leaves and distant official barges with billowing sails (compositional convention; original textual left and right are not tested). " +
      "Deductions: Depicting Xia Jingui's brawls or Xiangling's illness; Qing banner dress or modern warships.",
  },
  "honglou-101": {
    coreKey:
      "Sanhua Temple hall: Xifeng kneels in terror holding the divination cylinder before the Buddha as an ominous lot falls, while the old nun Dale bows with a candle to retrieve it",
    groundTruth:
      "Chapter 101, \"In Grand View Garden on a Moonlit Night, Ghosts Are Perceived; at Sanhua Temple a Divine Divination Reveals an Ominous Omen\". " +
      "Disturbed by night visions in the garden, Xifeng visits Sanhua Temple to pray. While shaking the divination tube before the Buddha, the thirty-third lot leaps out: " +
      "\"Wang Xifeng Returns Home in Glory\", accompanied by a poem predicting bitter disillusionment: \"After gathering nectar from a hundred blossoms, for whom is the toil, for whom the sweetness?\" " +
      "The scene contrasts holy lamps with her worldly doom.",
    evaluationCriteria:
      "Full credit: Dim and solemn main hall of Sanhua Temple with a gilded Buddha statue and everlasting lamp; " +
      "on the left Xifeng in a pale silk jacket kneels on a cushion staring in shock at the fallen lot; in the center a bamboo lot lies on the floor; " +
      "on the right Dale in grey robes bows with a bronze candlestick to pick it up (compositional convention; original textual left and right are not tested). " +
      "Deductions: Depicting vicious hound attacks or ghostly apparitions; Xifeng in flashy festive dress; Qing headdresses.",
  },
  "honglou-102": {
    coreKey:
      "Grand View Hall: the Daoist high priest brandishes a peach-wood sword and sprinkles holy water at the altar, while Jia She watches apprehensively in a fur cloak",
    groundTruth:
      "Chapter 102, \"Ningguo Mansion Kin Suffer Afflictions; Grand View Garden Uses Talismans and Holy Water to Expel Demons\". " +
      "Haunted by rumors of fox spirits and apparitions, Jia She engages forty-nine Daoist priests to conduct an exorcism in the Grand View Hall where imperial visits once occurred. " +
      "The high priest brandishes a peach-wood sword, sprinkles consecrated water, waves banners, and burns talismans, transforming the former symbol of imperial glory into a bizarre site of exorcism.",
    evaluationCriteria:
      "Full credit: Winter ritual altar in Grand View Hall with Daoist portraits and five-element pennants; on the left Jia She in a fur-lined robe watches anxiously; " +
      "in the center the high priest in cloud-and-crane robes sprinkles holy water with a sword raised; on the right assisting priests hold a demon-striking whip and black banner " +
      "(compositional convention; original textual left and right are not tested). Deductions: Portraying fortune-teller Mao or literal demons; Qing Daoist garments or queues.",
  },
  "honglou-103": {
    coreKey:
      "Shuntian Prefecture courtroom: Jia Yu-tsun in fourth-rank court robes ponders the Xue homicide docket beneath the Justice plaque, attended by a clerk and runner",
    groundTruth:
      "Chapter 103, \"Scheming Poison, Jingui Brings Destruction upon Herself; Obscuring Truth, Yu-tsun Decides the Lawsuit\". " +
      "After Xia Jingui accidentally poisons herself while attempting to murder Xiangling, Jia Lian engages official connections. " +
      "Promoted to Governor of Shuntian Prefecture, Jia Yu-tsun reviews the case dockets and autopsy reports in his court, secretly calculating how to shield the Xue family under the guise of legal process.",
    evaluationCriteria:
      "Full credit: Shuntian Prefecture courtroom beneath the gilded Mirror of Justice plaque; on the left a clerk bows presenting case files; " +
      "in the center Yu-tsun in blue fourth-rank robes with cloud-goose badge sits examining documents; on the right an attendant runner holds a staff " +
      "(compositional convention; original textual left and right are not tested). Deductions: Depicting Jingui's gory poisoning or street scuffles; Qing peacock feathers, queues, or horseshoe sleeves.",
  },
  "honglou-104": {
    coreKey:
      "Mengpo Studio: Jia Zheng in a Zhongjing cap sits examining Baoyu on civil service essays, while Baoyu stands respectfully in reverie and Beiming holds tea",
    groundTruth:
      "Chapter 104, \"Drunk Vajra Brews a Tempest; Infatuated Young Master Utters Wild Words\". " +
      "Returning to the capital cleared of charges, Jia Zheng examines Baoyu on eight-legged essays and the Four Books in his library Mengpo Studio, " +
      "urging him to concentrate on civil examinations. Baoyu answers deferentially while secretly longing for Daiyu. Strict paternal instruction contrasts with the young master's detached melancholy.",
    evaluationCriteria:
      "Full credit: Elegant Mengpo Studio in early summer with bookshelves and bamboo; on the left Baoyu in a slate-blue robe stands with bowed head; " +
      "in the center Jia Zheng in a scholar cap and round-collar robe examines essays from an armchair; on the right Beiming holds a tea tray " +
      "(compositional convention; original textual left and right are not tested). Deductions: Depicting Ni Er's drunken street brawls or nocturnal spirit summoning; Qing queues or red-tasseled hats.",
  },
  "honglou-105": {
    coreKey:
      "Ningguo Hall: Guard Officer Zhao Quan in a flying-fish robe reads the confiscation decree, while Jia Zheng trembles bowing and a guardsman seals wooden chests",
    groundTruth:
      "Chapter 105, \"Embroidered-Uniform Guards Confiscate Ningguo Mansion; Censor Interrogates the Duke of Rongguo\". " +
      "Zhao Quan of the Embroidered-Uniform Guard arrives suddenly with an imperial warrant to confiscate the Ningguo residence. Entrances are sealed, " +
      "Jia She and Jia Zhen are detained, and inventories are taken, marking the dramatic downfall of the century-old noble house. The ceremonial confiscation in the reception hall captures this turning point.",
    evaluationCriteria:
      "Full credit: Ominous twilight in Ningguo Mansion's main hall with red dragon columns; on the left Jia Zheng in plain brown robes bows trembling in shock; " +
      "in the center Zhao Quan in a scarlet flying-fish robe with a spring-embroidery saber reads the decree; on the right a guardsman kneels sealing chests with stamped strips " +
      "(compositional convention; original textual left and right are not tested). Deductions: Inner quarter plundering or hysterical wailing; Qing queues or mandarin hats.",
  },
  "honglou-106": {
    coreKey:
      "East Warm Chamber courtyard: the Lady Dowager in white robes kneels with incense praying to Heaven to bear her kin's punishment, Lady Wang weeps beside her, and Xifeng lies in tears",
    groundTruth:
      "Chapter 106, \"Wang Xifeng Brings Disaster and Endures Shame; the Lady Dowager Prays to Heaven to Avert Calamities\". " +
      "Following the confiscation and interrogation of her sons, the Lady Dowager sets up a grand incense altar in the courtyard outside the East Warm Chamber. " +
      "Bowing to Heaven with white hair and mourning robes, she tearfully offers her own life to atone for her descendants' transgressions. In the inner chamber, the sick Xifeng weeps in remorse.",
    evaluationCriteria:
      "Full credit: Early autumn twilight before the East Warm Chamber with a grand incense altar and bronze tripod; on the left Xifeng weeps in bed; " +
      "in the center the Lady Dowager with snow-white hair kneels in white robes offering incense to Heaven; on the right Lady Wang kneels with palms joined in prayer " +
      "(compositional convention; original textual left and right are not tested). Deductions: Depicting prison torture or servants looting; Qing banner headdresses or lavish jewelry.",
  },
  "honglou-107": {
    coreKey:
      "Rongqing Hall: the Lady Dowager sits serenely distributing her silver savings from ironbound chests, while Jia Zheng kowtows weeping and Jia Lian kneels in remorse",
    groundTruth:
      "Chapter 107, \"Distributing Leftover Funds, the Lady Dowager Manifests Great Righteousness; Restoring Hereditary Office, Old Zheng Bathes in Imperial Grace\". " +
      "Although Jia Zheng is restored to his hereditary post, Jia She and Jia Zhen are sentenced to exile. Demonstrating extraordinary fortitude, the Lady Dowager opens her ironbound chests " +
      "containing decades of personal savings, distributing tens of thousands of taels of silver to support each branch of the family. Jia Zheng and Jia Lian weep in profound gratitude.",
    evaluationCriteria:
      "Full credit: Bright autumn day in Rongqing Hall with open ironbound chests displaying silver ingots and gold pieces on a red carpet; " +
      "on the left the Lady Dowager in a dark brown patterned gown directs the distribution; in the center Jia Zheng kowtows weeping on the carpet; " +
      "on the right Jia Lian kneels tearfully listening (compositional convention; original textual left and right are not tested). " +
      "Deductions: Depicting exile chains or deathbed scenes; Qing queues, mandarin robes, or banner attire.",
  },
  "honglou-108": {
    coreKey:
      "Deserted Naiad's House beneath the moon: Baoyu stands weeping against cold mottled bamboo mourning Daiyu, as Xiren rushes with an octagonal lantern to find him",
    groundTruth:
      "Chapter 108, \"Forcing Smiles, a Birthday Banquet Is Feigned; Death Presses Near, Parting Sorrow Is Poured Forth\". " +
      "During an uneasy banquet arranged by the Lady Dowager to celebrate Baochai's birthday, Baoyu is overcome by grief seeing everyone present except Daiyu. " +
      "Slipping away in the night, he enters the deserted Naiad's House, weeping inconsolably while touching the chilly bamboo stalks amidst fallen autumn leaves. " +
      "Xiren hurries through the grove with an octagonal glass lantern to comfort him.",
    evaluationCriteria:
      "Full credit: Late autumn night under a cold crescent moon in the deserted Naiad's House with rustling bamboos and leaf-strewn steps; " +
      "toward the left Baoyu in a plain moon-white gown weeps leaning against a mottled bamboo stalk; on the right Xiren in a winter jacket hurries along the path with an octagonal glass lantern " +
      "(compositional convention; original textual left and right are not tested). Deductions: Depicting banquet revelry; drunken servants or ghastly phantoms; Qing queues or banner gowns.",
  },
  "honglou-anim-097": {
    coreKey:
      "Naiad's House sickbed: Daiyu leans to burn her poems, Zijuan reaches out, and Xiyan weeps, with animated brazier flames and flying ashes, flickering lamp flame, and gentle sleeve flutter",
    groundTruth:
      "Chapter 97, \"Lin Daiyu Burns Her Poems to Sever Passion; Xue Baochai Goes Forth from Her Maiden Bower to Celebrate the Grand Rite\". " +
      "Knowing her end is near, Daiyu has Xiyan set up the bronze brazier and bring her inscribed handkerchief and manuscripts. " +
      "She nods at the fire and casts them in; Zijuan tries to grab them in vain as they curl into ashes. Meanwhile, wedding music resounds " +
      "at Happy Red Court for Baoyu and Baochai. Daiyu resolutely severs earthly love in chilly isolation before her death.",
    evaluationCriteria:
      "Full credit: Early spring night in Naiad's House with lowered curtains and an oil lamp; on the left Zijuan in a lilac jacket reaches out weeping; " +
      "in the center Daiyu in ivory silk nightclothes leans to burn poems; on the right Xiyan weeps beside the table (compositional convention; original textual left and right are not tested); " +
      "brazier flames with flying ashes, flickering lamp flame, and fluttering sleeves animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Wedding feast or death throes depicted; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-098": {
    coreKey:
      "Naiad's House mourning hall: Baoyu weeps on a bamboo chair and Zijuan kneels in mourning, with animated curling altar incense smoke, swaying white curtains, and rustling bamboo leaves",
    groundTruth:
      "Chapter 98, \"Bitter Crimson Pearl's Soul Returns to the Realm of Separation; Ailing Divine Luminary Sheds Tears upon the Soil of Longing\". " +
      "Learning of the substitution trick and Daiyu's death, Baoyu is overcome with grief and visits Naiad's House in a bamboo chair. " +
      "Facing Daiyu's coffin draped in white curtains, he weeps inconsolably. Zijuan kneels tearfully beside the altar and recounts how Daiyu burned her poems " +
      "and spoke her dying words, marking the earthly conclusion of the wood-and-stone alliance.",
    evaluationCriteria:
      "Full credit: Naiad's House mourning hall with white hangings and somber bamboos; on the left Baoyu in hemp robes collapses weeping; " +
      "on the right Zijuan kneels recounting dying words (compositional convention; original textual left and right are not tested); " +
      "curling incense smoke, billowing white hangings, and trembling bamboo twigs animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Showing corpses or bridal scenes; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-099": {
    coreKey:
      "Grain registry office: Jia Zheng sits with suspended brush and Li Shi'er bows offering advice, with animated dancing candle flame, rising incense vapor, and swaying bare winter branches",
    groundTruth:
      "Chapter 99, \"Guarding Official Discipline, an Evil Clerk Resorts to Insolence; Exercising Bureaucratic Cunning, a Minor Functionary Exerts Extortion\". " +
      "Appointed Grain Intendant of Jiangxi, Jia Zheng prohibits customary extortion, prompting clerks and attendants to stage work slowdowns. " +
      "Li Shi'er approaches Jia Zheng at night amidst piles of neglected official documents, subtly coercing him to compromise between outward repute and practical leeway. " +
      "Overwhelmed by bureaucratic gridlock, Jia Zheng wavers with a sigh.",
    evaluationCriteria:
      "Full credit: Grain Intendant registry office late at night; on the left Jia Zheng in a sapphire robe sits holding his brush; " +
      "on the right Li Shi'er in brown attire bows whispering; piled dossiers and bronze candleholder on the desk (compositional convention; original textual left and right are not tested); " +
      "dancing candle flame, rising incense plume, and swaying outdoor tree branches animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Court hearings or strike scenes; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-100": {
    coreKey:
      "Autumn Studio steps: Tanchun bids farewell in court robes and Baoyu weeps in grief, with animated fluttering robe hems, swaying plantain leaves, and undulating distant barge banners",
    groundTruth:
      "Chapter 100, \"Spoiling a Good Thing, Xiangling Incurs Deep Hatred; Sorrowful over Distant Marriage, Baoyu Feels Grief of Parting\". " +
      "Arranged into marriage by Jia Zheng in the maritime province, Tanchun is granted nobility rank and prepares for distant departure. " +
      "Before Autumn Studio, she appears in full ceremonial robes, dignified and resolute; hearing of her departure, Baoyu is overcome by grief over family separation and weeps profusely at the steps. " +
      "This represents the poignant climax of the Separation of Kin song.",
    evaluationCriteria:
      "Full credit: Courtyard of Autumn Studio in early summer with plantains and distant barges; on the left Baoyu in blue attire weeps covering his face; " +
      "on the right Tanchun stands in scarlet ceremonial robes (compositional convention; original textual left and right are not tested); " +
      "fluttering ceremonial robes, rustling plantain fronds, and billowing distant flags animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Domestic fights or servant abuse; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-101": {
    coreKey:
      "Sanhua Temple hall: Xifeng kneels holding the lot cylinder and Dale bows with a candle, with animated flickering oil lamp flame, swaying altar banners, and swirling incense smoke",
    groundTruth:
      "Chapter 101, \"In Grand View Garden on a Moonlit Night, Ghosts Are Perceived; at Sanhua Temple a Divine Divination Reveals an Ominous Omen\". " +
      "Disturbed by night visions in the garden, Xifeng visits Sanhua Temple to pray. While shaking the divination tube before the Buddha, the thirty-third lot leaps out: " +
      "\"Wang Xifeng Returns Home in Glory\", accompanied by a poem predicting bitter disillusionment: \"After gathering nectar from a hundred blossoms, for whom is the toil, for whom the sweetness?\" " +
      "The scene contrasts holy lamps with her worldly doom.",
    evaluationCriteria:
      "Full credit: Somber Sanhua Temple hall with a gilded Buddha and everlasting lamps; on the left Xifeng in a pale jacket kneels staring in horror; " +
      "on the right Dale bows holding a candle (compositional convention; original textual left and right are not tested); " +
      "flickering flame on the lamp, swaying silk streamers, and swirling incense curls animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Apparitions or demonic figures; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-102": {
    coreKey:
      "Grand View Hall altar: the priest sprinkles holy water and Jia She watches anxiously, with animated flying droplets, billowing purple talisman smoke, and fluttering pennants",
    groundTruth:
      "Chapter 102, \"Ningguo Mansion Kin Suffer Afflictions; Grand View Garden Uses Talismans and Holy Water to Expel Demons\". " +
      "Haunted by rumors of fox spirits and apparitions, Jia She engages forty-nine Daoist priests to conduct an exorcism in the Grand View Hall where imperial visits once occurred. " +
      "The high priest brandishes a peach-wood sword, sprinkles consecrated water, waves banners, and burns talismans, transforming the former symbol of imperial glory into a bizarre site of exorcism.",
    evaluationCriteria:
      "Full credit: Grand View Hall altar with three pure ones portraits and five banners; on the left Jia She watches in a fur cloak; " +
      "in the center the priest raises his sword and splashes water; on the right assistants hold whip and banner (compositional convention; original textual left and right are not tested); " +
      "splashing water droplets, billowing talisman smoke, and fluttering five-color pennants animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Showing literal demons; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-103": {
    coreKey:
      "Shuntian Prefecture court: Yu-tsun ponders the case docket attended by clerk and runner, with animated flickering red candle flame, rustling document pages, and swaying courtyard cypress boughs",
    groundTruth:
      "Chapter 103, \"Scheming Poison, Jingui Brings Destruction upon Herself; Obscuring Truth, Yu-tsun Decides the Lawsuit\". " +
      "After Xia Jingui accidentally poisons herself while attempting to murder Xiangling, Jia Lian engages official connections. " +
      "Promoted to Governor of Shuntian Prefecture, Jia Yu-tsun reviews the case dockets and autopsy reports in his court, secretly calculating how to shield the Xue family under the guise of legal process.",
    evaluationCriteria:
      "Full credit: Shuntian court under the Justice plaque; on the left a clerk presents case dossiers; " +
      "in the center Yu-tsun in court robes examines records; on the right a runner stands with a staff (compositional convention; original textual left and right are not tested); " +
      "dancing candle flame, rustling document sheets, and swaying courtyard cypress boughs animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Gory deaths or violent fights; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-104": {
    coreKey:
      "Mengpo Studio: Jia Zheng interrogates Baoyu on his studies while Beiming attends, with animated curling bronze censer incense, fluttering bamboo shadows on window lattices, and gently floating robe hems",
    groundTruth:
      "Chapter 104, \"Drunk Vajra Brews a Tempest; Infatuated Young Master Utters Wild Words\". " +
      "Returning to the capital cleared of charges, Jia Zheng examines Baoyu on eight-legged essays and the Four Books in his library Mengpo Studio, " +
      "urging him to concentrate on civil examinations. Baoyu answers deferentially while secretly longing for Daiyu. Strict paternal instruction contrasts with the young master's detached melancholy.",
    evaluationCriteria:
      "Full credit: Mengpo Studio with bookshelves and garden bamboos; on the left Baoyu stands respectfully; " +
      "in the center Jia Zheng sits examining books; on the right Beiming attends with tea (compositional convention; original textual left and right are not tested); " +
      "rising incense smoke, shifting bamboo shadows on windows, and gently moving robe hems animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Drunken brawl or mania; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-105": {
    coreKey:
      "Ningguo Hall: Guard Officer Zhao reads the confiscation decree and a guard seals chests, with animated billowing door curtains, trembling paper seal strips, and wildly swaying red lanterns",
    groundTruth:
      "Chapter 105, \"Embroidered-Uniform Guards Confiscate Ningguo Mansion; Censor Interrogates the Duke of Rongguo\". " +
      "Zhao Quan of the Embroidered-Uniform Guard arrives suddenly with an imperial warrant to confiscate the Ningguo residence. Entrances are sealed, " +
      "Jia She and Jia Zhen are detained, and inventories are taken, marking the dramatic downfall of the century-old noble house. The ceremonial confiscation in the reception hall captures this turning point.",
    evaluationCriteria:
      "Full credit: Somber twilight in Ningguo Hall; on the left Jia Zheng bows trembling; " +
      "in the center Zhao Quan in flying-fish robes reads the imperial decree; on the right a guardsman seals chests (compositional convention; original textual left and right are not tested); " +
      "wind-blown heavy door curtain, fluttering paper seal strips, and swinging courtyard lanterns animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Violent looting scenes; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-106": {
    coreKey:
      "East Warm Chamber courtyard: the Lady Dowager kneels praying to Heaven and Lady Wang weeps, with animated rising incense plume from the tripod, flickering white candle flames, and trembling white hair and robes",
    groundTruth:
      "Chapter 106, \"Wang Xifeng Brings Disaster and Endures Shame; the Lady Dowager Prays to Heaven to Avert Calamities\". " +
      "Following the confiscation and interrogation of her sons, the Lady Dowager sets up a grand incense altar in the courtyard outside the East Warm Chamber. " +
      "Bowing to Heaven with white hair and mourning robes, she tearfully offers her own life to atone for her descendants' transgressions. In the inner chamber, the sick Xifeng weeps in remorse.",
    evaluationCriteria:
      "Full credit: East Warm Chamber courtyard at twilight with a grand altar and bronze incense tripod; on the left Xifeng weeps in bed; " +
      "in the center the Lady Dowager kneels praying with incense; on the right Lady Wang kneels with hands joined (compositional convention; original textual left and right are not tested); " +
      "steady plume of incense, flickering white candles, and trembling white hair and wide sleeves animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Torture scenes or looting; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-107": {
    coreKey:
      "Rongqing Hall: the Lady Dowager distributes her silver savings while Jia Zheng kowtows, with animated dancing sunbeam dust motes over open silver chests, fluttering autumn leaves on the threshold, and trembling robe sleeves",
    groundTruth:
      "Chapter 107, \"Distributing Leftover Funds, the Lady Dowager Manifests Great Righteousness; Restoring Hereditary Office, Old Zheng Bathes in Imperial Grace\". " +
      "Although Jia Zheng is restored to his hereditary post, Jia She and Jia Zhen are sentenced to exile. Demonstrating extraordinary fortitude, the Lady Dowager opens her ironbound chests " +
      "containing decades of personal savings, distributing tens of thousands of taels of silver to support each branch of the family. Jia Zheng and Jia Lian weep in profound gratitude.",
    evaluationCriteria:
      "Full credit: Rongqing Hall with open ironbound chests full of silver and gold; on the left the Lady Dowager sits calmly distributing wealth; " +
      "in the center Jia Zheng kowtows weeping; on the right Jia Lian kneels in remorse (compositional convention; original textual left and right are not tested); " +
      "swirling dust motes in sunbeams, falling golden leaves across the threshold, and trembling sleeves of the kneeling son animated smoothly in a loop via SMIL or inline CSS. " +
      "Deductions: Depicting convicts in shackles; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
  "honglou-anim-108": {
    coreKey:
      "Deserted Naiad's House: Baoyu touches the bamboo mourning Daiyu and Xiren approaches with a lantern, with animated rustling bamboo grove, swaying lantern glow on stones, and fluttering moon-white robe sleeves",
    groundTruth:
      "Chapter 108, \"Forcing Smiles, a Birthday Banquet Is Feigned; Death Presses Near, Parting Sorrow Is Poured Forth\". " +
      "During an uneasy banquet arranged by the Lady Dowager to celebrate Baochai's birthday, Baoyu is overcome by grief seeing everyone present except Daiyu. " +
      "Slipping away in the night, he enters the deserted Naiad's House, weeping inconsolably while touching the chilly bamboo stalks amidst fallen autumn leaves. " +
      "Xiren hurries through the grove with an octagonal glass lantern to comfort him.",
    evaluationCriteria:
      "Full credit: Naiad's House late at night with a crescent moon, rustling bamboos, and fallen leaves; " +
      "toward the left Baoyu in a moon-white robe weeps touching a bamboo; on the right Xiren approaches holding an octagonal lantern " +
      "(compositional convention; original textual left and right are not tested); swaying bamboo tops, oscillating lantern glow on path stones, " +
      "and fluttering robe sleeves animated smoothly in a loop via SMIL or inline CSS. Deductions: Banquet gambling or ghostly apparitions; whole-figure translation drift; static artwork, JavaScript usage, or XML parse errors.",
  },
};

export const HONGLOU_STANDARDS_CH097_108_EN = HONGLOU_CH097_108_STANDARDS_EN;
