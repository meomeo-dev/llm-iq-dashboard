/**
 * 《西游记》第 61–80 回候选的英文标签与英文评判标准，由 src/core/classics/xiyou/ch061-070.ts、
 * ch071-080.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const XIYOU_CH061_080_LABELS_EN: Readonly<Record<string, string>> = {
  "xiyou-061": "Ch. 61 · Forty-Nine Fans in a Row",
  "xiyou-062": "Ch. 62 · Sweeping the Pagoda at Night in Golden Light Monastery",
  "xiyou-063": "Ch. 63 · The Nine-Headed Beast Bites Bajie",
  "xiyou-064": "Ch. 64 · Bajie Clears the Way on Thornbush Ridge",
  "xiyou-065": "Ch. 65 · The Golden Cymbals Trap Wukong",
  "xiyou-066": "Ch. 66 · Maitreya Seizes the Bag in the Melon Field",
  "xiyou-067": "Ch. 67 · Bajie Roots Open Persimmon Alley",
  "xiyou-068": "Ch. 68 · Bajie, the Notice in His Bosom, Cannot Be Budged",
  "xiyou-069": "Ch. 69 · Taking the Pulse by Suspended Threads",
  "xiyou-070": "Ch. 70 · Pebbles Plugging the Nose",
  "xiyou-071": "Ch. 71 · Guanyin Sprinkles Dew to Quench the Bell Fire",
  "xiyou-072": "Ch. 72 · Silk Cords Seal the Farmstead on Silk Ridge",
  "xiyou-073": "Ch. 73 · The Golden Light of a Thousand Eyes Traps Wukong",
  "xiyou-074": "Ch. 74 · Wukong Shows His True Form and Frightens the Old Man",
  "xiyou-075": "Ch. 75 · Wukong Sticks Out His Head to Take the Blade",
  "xiyou-076": "Ch. 76 · Wukong Leads the Second Demon by the Nose",
  "xiyou-077": "Ch. 77 · The Great Peng Pinned atop the Tathagata's Head",
  "xiyou-078": "Ch. 78 · The State Father Saunters into the Golden Hall",
  "xiyou-079": "Ch. 79 · The Star of Longevity Covers the Light and Reveals the White Deer",
  "xiyou-080": "Ch. 80 · A Woman Cries for Help in Black Pine Forest",
};

/** 静态与动态候选 id → 英文评判标准 */
export const XIYOU_CH061_080_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "xiyou-061": {
    coreKey:
      "Forty-nine fans in a row: Wukong wields the great fan toward the mountaintop, rain " +
      "falls where there is fire, and master and disciples stand where it is clear",
    groundTruth:
      "Chapter 61, \"Zhu Bajie Lends His Strength to Defeat the Demon King; Pilgrim Sun's " +
      "Third Attempt at the Plantain Fan\". The first fan has already put out the flames; " +
      "to cut off the root of the fire, Wukong \"took the fan and, with all his strength, " +
      "fanned the mountaintop forty-nine times in a row, and on the mountain heavy rain " +
      "came pouring down\"; \"where there was fire it rained, and where there was no fire " +
      "the sky was clear\", and master and disciples \"stood in this place without fire and " +
      "were not wetted by the rain\".",
    evaluationCriteria:
      "Full credit: In the center of the frame Wukong wields a plantain-leaf-shaped fan " +
      "about three times his height toward the mountaintop on the right of the frame; a " +
      "few tongues of fire remain on the peak and the rain falls only on the fire; in the " +
      "clear area on the left of the frame the Tang Monk wears a Vairocana hat and a " +
      "cassock, Bajie wears a black zhiduo robe, and Sha Wujing is beside them. " +
      "Deductions: Drawn as churning dark clouds, a whirlwind, or half sea of fire and half " +
      "rain; rain falling on master and disciples; Wukong carrying the fan on his shoulder " +
      "or holding the iron rod; Bajie's zhiduo robe not black.",
  },
  "xiyou-anim-061": {
    coreKey:
      "Forty-nine fans in a row, with animated fanning, rain streaks, and tongues of fire",
    groundTruth:
      "Chapter 61, \"Zhu Bajie Lends His Strength to Defeat the Demon King; Pilgrim Sun's " +
      "Third Attempt at the Plantain Fan\". Wukong \"took the fan and, with all his " +
      "strength, fanned the mountaintop forty-nine times in a row\"; \"where there was fire " +
      "it rained, and where there was no fire the sky was clear\", and master and disciples " +
      "stand where there is no fire, untouched by the rain; the fire had already been put " +
      "out by the first fan.",
    evaluationCriteria:
      "Full credit: Wukong wields the great fan toward the mountaintop on the right of the " +
      "frame, the rain falls only on the remaining tongues of fire, and in the clear area " +
      "on the left of the frame master and disciples stand staggered; the fanning, the rain " +
      "streaks, and the tongues of fire loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: Drawn as churning dark clouds, a spiral storm, or half sea of fire and " +
      "half rain; Wukong carrying the fan on his shoulder; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-062": {
    coreKey:
      "Sweeping the pagoda at the second watch: the Tang Monk in a narrow-sleeved bianshan " +
      "shirt and Wukong each hold a new broom and sweep the dusty, unlit pagoda stories",
    groundTruth:
      "Chapter 62, \"Washing Off Grime and Cleansing the Mind, They Only Sweep the Pagoda; " +
      "Binding the Demons and Returning Them to the Lord Is Self-Cultivation\". After " +
      "bathing, Sanzang \"put on a narrow-sleeved bianshan shirt, tied on a ringed sash, " +
      "changed into a pair of soft shoes, and took a new broom in his hand\", and with " +
      "Wukong sweeps the pagoda story by story; \"by the time they had swept up to the " +
      "seventh story, it was already the second watch\"; the glazed lamps in the pagoda " +
      "\"had dust but no fire\".",
    evaluationCriteria:
      "Full credit: Inside the pagoda at night, the Tang Monk in a narrow-sleeved bianshan " +
      "shirt and sash on the left of the frame and Wukong with the golden fillet and zhiduo " +
      "robe on the right of the frame each hold a new broom and sweep the dust; the dusty " +
      "glazed lamps, the cobwebs, and the stars and moon outside the window are " +
      "recognizable. Deductions: The Tang Monk wearing a cassock or a Vairocana hat; Wukong " +
      "holding the iron rod; a demon, Bajie, or Sha Wujing appearing; drawn as daytime.",
  },
  "xiyou-anim-062": {
    coreKey:
      "Sweeping the pagoda at night in Golden Light Monastery, with animated brooms raising " +
      "dust, cobwebs, and golden eave bells",
    groundTruth:
      "Chapter 62, \"Washing Off Grime and Cleansing the Mind, They Only Sweep the Pagoda; " +
      "Binding the Demons and Returning Them to the Lord Is Self-Cultivation\". After " +
      "bathing, Sanzang \"put on a narrow-sleeved bianshan shirt and tied on a ringed " +
      "sash\", and he and Wukong, each holding a new broom, sweep the pagoda at night; \"by " +
      "the time they had swept up to the seventh story, it was already the second watch\"; " +
      "above the pagoda \"the whole sky shone with stars and moonlight\".",
    evaluationCriteria:
      "Full credit: Inside the pagoda at night the Tang Monk in a narrow-sleeved bianshan " +
      "shirt and Wukong with the golden fillet and zhiduo robe each hold a new broom and " +
      "sweep the dust; the dusty lamps, the cobwebs, and the stars and moon outside the " +
      "window are recognizable; the brooms raising dust, the cobwebs, and the golden eave " +
      "bells loop smoothly, driven by SMIL or inline CSS. Deductions: The Tang Monk wearing " +
      "a cassock or a Vairocana hat; Wukong holding the iron rod; a demon appearing; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-063": {
    coreKey:
      "The Nine-Headed Beast in its true form: nine brocade-feathered heads clustered in a " +
      "ring, a tenth head from its waist biting Bajie's bristles, and Wukong riding a cloud " +
      "with his rod raised",
    groundTruth:
      "Chapter 63, \"Two Monks Rout the Monsters and Wreak Havoc in the Dragon Palace; The " +
      "Sages Eliminate the Evil and Recover the Treasure\". The nine-headed prince consort " +
      "shows his true form, \"his feathers spread like brocade, his round body like fluffed " +
      "floss\", \"his two feet sharp as hooks, his nine heads clustered in a ring\"; as " +
      "Wukong rides a cloud in pursuit, he \"thrust out another head from his waist\" and " +
      "\"with one bite seized Bajie by the bristles\".",
    evaluationCriteria:
      "Full credit: In the center of the frame a great bird with a round, brocade-feathered " +
      "body and outspread wings has nine heads clustered in a ring, and a tenth head from " +
      "its waist bites the bristles of Bajie at the lower right of the frame; Bajie, in a " +
      "black zhiduo robe, holds his rake; at the upper left of the frame Wukong rides a " +
      "cloud with his rod raised. Deductions: Drawn as a nine-headed snake, with snake " +
      "necks, or with a dragon's body; a tortoise shell or scales; the Nine-Headed Beast " +
      "holding a crescent-moon spade; Sha Wujing, Erlang Shen, or the hound present; Bajie " +
      "already dragged into the water.",
  },
  "xiyou-anim-063": {
    coreKey:
      "The Nine-Headed Beast biting Bajie, with animated wings, cloud vapor, and feathers " +
      "and garment hems",
    groundTruth:
      "Chapter 63, \"Two Monks Rout the Monsters and Wreak Havoc in the Dragon Palace; The " +
      "Sages Eliminate the Evil and Recover the Treasure\". In its true form the " +
      "Nine-Headed Beast has \"feathers spread like brocade, its round body like fluffed " +
      "floss\", \"its nine heads clustered in a ring\", and it can spread its wings and " +
      "fly; as Wukong rides a cloud in pursuit, it thrusts out another head from its waist " +
      "and \"with one bite seized Bajie by the bristles\".",
    evaluationCriteria:
      "Full credit: The great brocade-feathered bird has nine heads clustered in a ring, a " +
      "tenth head from its waist bites the bristles of Bajie at the lower right of the " +
      "frame, and Wukong rides a cloud with his rod raised at the upper left of the frame; " +
      "the wings, the cloud vapor, and the feathers and garment hems loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: Drawn as a nine-headed snake or with a dragon's " +
      "body; the Nine-Headed Beast holding a crescent-moon spade; Erlang Shen appearing; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-064": {
    coreKey:
      "Clearing the way on Thornbush Ridge: Bajie, turned into a giant twenty zhang tall, " +
      "rakes the thorns apart with the long rake in both hands, while master and disciples " +
      "follow at his feet",
    groundTruth:
      "Chapter 64, \"On Thornbush Ridge Wuneng Exerts Great Effort; At Tree Immortals' " +
      "Hermitage Sanzang Discusses Poetry\". Winter is ending and spring has come, and " +
      "thorns cover the ridge; Bajie \"grew a body some twenty zhang tall\", the rake " +
      "handle lengthening too, and \"wielding the rake with both hands, raked the thorns " +
      "apart to left and right\"; Sanzang follows close on horseback, Sha Wujing carries " +
      "the luggage on a pole, and Wukong pushes the thorns aside with his iron rod.",
    evaluationCriteria:
      "Full credit: On the right of the frame the twenty-zhang giant Bajie, with a long " +
      "snout, big ears, and a black zhiduo robe, wields the long rake with both hands to " +
      "rake the thorns apart to left and right; at the lower left of the frame the Tang " +
      "Monk rides the horse, Wukong pushes aside the thorns with his rod, and Sha Wujing " +
      "carries the load on a pole, with a vast difference in scale. Deductions: Bajie " +
      "turned into a giant pig or rooting a path with his snout; Bajie the same height as " +
      "the others; the Tang Monk wearing a cassock; the stone tablet, the old men of Tree " +
      "Immortals' Hermitage, or the Apricot Immortal appearing.",
  },
  "xiyou-anim-064": {
    coreKey:
      "Bajie clearing the way on Thornbush Ridge, with animated thorns, vines, and mane, " +
      "tail, and garment sashes",
    groundTruth:
      "Chapter 64, \"On Thornbush Ridge Wuneng Exerts Great Effort; At Tree Immortals' " +
      "Hermitage Sanzang Discusses Poetry\". Bajie \"grew a body some twenty zhang tall\" " +
      "and, \"wielding the rake with both hands, raked the thorns apart to left and " +
      "right\"; Sanzang follows close on horseback, Sha Wujing carries the luggage on a " +
      "pole, and Wukong pushes the thorns aside with his iron rod.",
    evaluationCriteria:
      "Full credit: On the right of the frame the giant Bajie wields the long rake with " +
      "both hands to rake the thorns apart, and at the lower left of the frame the Tang " +
      "Monk rides the horse, Wukong pushes aside the thorns, and Sha Wujing follows " +
      "carrying the load on a pole; the thorns, the vines, and the mane, tail, and garment " +
      "sashes loop smoothly, driven by SMIL or inline CSS. Deductions: Bajie turned into a " +
      "giant pig or rooting a path with his snout; Bajie the same height as the others; " +
      "the Tang Monk wearing a cassock; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-065": {
    coreKey:
      "Lesser Thunderclap Monastery: the false Buddha sits on high, three of the pilgrims " +
      "prostrate themselves, Wukong refuses to bow and swings his rod, and the golden " +
      "cymbals in midair are about to close",
    groundTruth:
      "Chapter 65, \"Demons Set Up a False Lesser Thunderclap; All Four Pilgrims Meet a " +
      "Great Calamity\". Sanzang orders Bajie to \"fetch the cassock and change into the " +
      "monk's cap\" and enters the monastery to worship the false Buddha; \"Pilgrim openly " +
      "refused to bow\" and, \"swinging his rod with both hands, stepped up to strike\", " +
      "and from midair \"a pair of golden cymbals was dropped, enclosing Pilgrim from head " +
      "to foot within the cymbals\".",
    evaluationCriteria:
      "Full credit: At the top of the frame the false Buddha on the lotus throne still " +
      "looks like a Buddha image; at the lower left of the frame the Tang Monk, in a monk's " +
      "cap and cassock, prostrates himself with Bajie and Sha Wujing; in the center of the " +
      "frame Wukong charges forward swinging his rod, and the two golden cymbals, one above " +
      "and one below, are about to close but not yet shut. Deductions: The cymbals drawn " +
      "as a single golden bowl, or already closed with Wukong out of sight; the false " +
      "Buddha showing yellow brows or fangs; the Tang Monk wearing a Vairocana hat; Wukong " +
      "kneeling to worship as well.",
  },
  "xiyou-anim-065": {
    coreKey:
      "The golden cymbals trapping Wukong, with animated opening and closing cymbals, " +
      "sashes and kilt hem, and incense smoke",
    groundTruth:
      "Chapter 65, \"Demons Set Up a False Lesser Thunderclap; All Four Pilgrims Meet a " +
      "Great Calamity\". On the lotus throne sits the demon king disguised as the Buddha; " +
      "Sanzang, in a monk's cap and cassock, prostrates himself; \"Pilgrim openly refused " +
      "to bow\" and swings his rod to strike, and from midair \"a pair of golden cymbals " +
      "was dropped, enclosing Pilgrim from head to foot within the cymbals\".",
    evaluationCriteria:
      "Full credit: The false Buddha on the lotus throne still looks like a Buddha image, " +
      "at the lower left of the frame the Tang Monk prostrates himself with Bajie and Sha " +
      "Wujing, and in the center of the frame Wukong charges forward swinging his rod as " +
      "the golden cymbals, one above and one below, are about to close; the opening and " +
      "closing cymbals, the sashes and kilt hem, and the incense smoke loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The cymbals drawn as a single golden " +
      "bowl; the Tang Monk wearing a Vairocana hat; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-066": {
    coreKey:
      "Subduing the demon in the melon field: Maitreya, in his true form, holds the pouch " +
      "and grips the chime mallet, while the Yellow Brows King kneels, rubbing his belly " +
      "and kowtowing",
    groundTruth:
      "Chapter 66, \"The Gods Fall Victim to Vicious Harm; Maitreya Binds the Demon\". " +
      "While Wukong thrashes about in the demon king's belly, \"Maitreya then revealed his " +
      "true form, grinning and laughing\", and the demon \"hastily fell to his knees, " +
      "rubbing his belly with both hands and knocking his head on the ground\"; Maitreya " +
      "\"untied his Postnatal Bag and seized his chime-striking mallet\".",
    evaluationCriteria:
      "Full credit: By the melon field, on the left of the frame Maitreya, with big ears, a " +
      "square face, and a face full of delight, holds the white cloth pouch and grips the " +
      "short chime mallet; on the right of the frame the Yellow Brows King, with a gold " +
      "headband and yellow brows and wearing chain-link armor, kneels rubbing his belly " +
      "and kowtowing. Deductions: Wukong or the golden cymbals drawn; Maitreya carrying a " +
      "big cloth sack on his shoulder or with a lotus throne and halo; the Yellow Brows " +
      "King drawn as a boy.",
  },
  "xiyou-anim-066": {
    coreKey:
      "Maitreya seizing the bag in the melon field, with animated melon vines, sleeves and " +
      "silk sash, and dust",
    groundTruth:
      "Chapter 66, \"The Gods Fall Victim to Vicious Harm; Maitreya Binds the Demon\". By " +
      "the melon field \"Maitreya then revealed his true form, grinning and laughing\", and " +
      "the Yellow Brows King \"fell to his knees, rubbing his belly with both hands\"; " +
      "Maitreya \"untied his Postnatal Bag and seized his chime-striking mallet\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Maitreya, with big ears and a square face, in " +
      "a wide-sleeved plain robe, holds the white cloth pouch and grips the chime mallet; " +
      "on the right of the frame the Yellow Brows King, with a gold headband and chain-link " +
      "armor, kneels rubbing his belly; the melon vines, the sleeves and silk sash, and the " +
      "dust loop smoothly, driven by SMIL or inline CSS. Deductions: Wukong or the golden " +
      "cymbals drawn; Maitreya carrying a big cloth sack on his shoulder; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-067": {
    coreKey:
      "Rooting a path through Persimmon Alley: Bajie, turned into a huge black pig, roots " +
      "open the rotten persimmons with his long snout, the Tang Monk rides the horse, and " +
      "Wukong and Sha Wujing follow",
    groundTruth:
      "Chapter 67, \"Rescuing Tuoluo, the Chan Nature Holds Steady; Escaping the Filth, " +
      "the Mind of the Way Is Pure\". Bajie \"took off his black zhiduo robe and threw down " +
      "his nine-toothed rake\" and turned into a huge pig to root open Persimmon Alley, " +
      "\"black-faced, his ringed eyes like the sun and moon, his round head and big ears " +
      "like plantain leaves\", \"his four white hooves a thousand Chinese feet tall\"; the " +
      "Tang Monk rides the horse, Sha Wujing carries the load on a pole, and Wukong " +
      "steadies him.",
    evaluationCriteria:
      "Full credit: In the stone-walled alley covered with rotten persimmons, on the right " +
      "of the frame a huge black pig with ringed eyes, big ears, white hooves, and " +
      "sword-like bristles, far larger than the people and horse, roots a path with its " +
      "long snout; on the left of the frame the Tang Monk rides the horse, Wukong, rod on " +
      "his shoulder, steadies the horse, and Sha Wujing follows carrying the load on a " +
      "pole. Deductions: The huge pig wearing a zhiduo robe, holding the rake, or drawn " +
      "with a human body and a pig's head; drawn as a pinkish-white domestic pig; Wukong " +
      "riding the pig or the Tang Monk dismounted and walking; the red-scaled python " +
      "appearing.",
  },
  "xiyou-anim-067": {
    coreKey:
      "Bajie rooting open Persimmon Alley, with animated rotten persimmons and mud, " +
      "persimmon trees, and mane, tail, and garment hems",
    groundTruth:
      "Chapter 67, \"Rescuing Tuoluo, the Chan Nature Holds Steady; Escaping the Filth, " +
      "the Mind of the Way Is Pure\". Bajie \"took off his black zhiduo robe and threw down " +
      "his nine-toothed rake\" and turned into a huge pig, \"black-faced, his ringed eyes " +
      "like the sun and moon, his round head and big ears like plantain leaves\", to root " +
      "open the rotten persimmons; the Tang Monk rides the horse, Sha Wujing carries the " +
      "load on a pole, and Wukong steadies him.",
    evaluationCriteria:
      "Full credit: On the right of the frame a huge four-legged black pig with ringed " +
      "eyes, big ears, and white hooves roots open the rotten persimmons with its long " +
      "snout, and on the left of the frame the Tang Monk rides the horse, Wukong steadies " +
      "the horse, and Sha Wujing follows carrying the load on a pole; the rotten " +
      "persimmons and mud, the persimmon trees, and the mane, tail, and garment hems loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The huge pig wearing a zhiduo " +
      "robe, holding the rake, or drawn as a pinkish-white domestic pig; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-068": {
    coreKey:
      "Tugging at Bajie below the drum tower: Bajie props his snout against the foot of " +
      "the wall with a corner of the notice showing at his bosom, and the eunuchs and " +
      "guardsmen cannot pull him away",
    groundTruth:
      "Chapter 68, \"In the Scarlet-Purple Kingdom the Tang Monk Discourses on Former " +
      "Ages; Pilgrim Sun Acts as a Seasoned Physician\". Wukong, invisible, tears down the " +
      "notice and stuffs it into Bajie's bosom; Bajie \"propped his snout against the foot " +
      "of the wall, turned his face away, and would not budge for anything\"; the " +
      "guardsmen see \"the edge of a paper sticking out of his bosom\" and hold on to him, " +
      "and \"a dozen or so men could not move him\".",
    evaluationCriteria:
      "Full credit: In the market street below the drum tower, on the right of the frame " +
      "Bajie props his long snout against the wall with his back to everyone and a corner " +
      "of the white paper notice showing at his bosom; on the left of the frame a group of " +
      "eunuchs and guardsmen pull him backward, and Bajie stands firm without moving. " +
      "Deductions: Wukong, the Tang Monk, or Sha Wujing present; Bajie holding the rake, " +
      "sitting on the ground, or being dragged away; the guardsmen wearing flying-fish " +
      "robes.",
  },
  "xiyou-anim-068": {
    coreKey:
      "Bajie, the notice in his bosom, cannot be budged, with animated hat strings and " +
      "robe hems, the notice corner, and wine banners",
    groundTruth:
      "Chapter 68, \"In the Scarlet-Purple Kingdom the Tang Monk Discourses on Former " +
      "Ages; Pilgrim Sun Acts as a Seasoned Physician\". Bajie \"propped his snout against " +
      "the foot of the wall, turned his face away, and would not budge for anything\", the " +
      "edge of the notice showing from his bosom; the eunuchs and guardsmen hold on to " +
      "him, and \"a dozen or so men could not move him\".",
    evaluationCriteria:
      "Full credit: On the right of the frame Bajie props his long snout against the wall " +
      "with a corner of the white paper notice showing at his bosom, and on the left of " +
      "the frame a group of eunuchs and guardsmen pull at him while Bajie stands firm " +
      "without moving; the hat strings and robe hems, the notice corner, and the wine " +
      "banners loop smoothly, driven by SMIL or inline CSS. Deductions: Wukong present; " +
      "Bajie holding the rake or sitting on the ground; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-069": {
    coreKey:
      "Taking the pulse by suspended threads: three golden threads run from the wrist of " +
      "the king on the dragon bed out through the window lattice, and Wukong, outside the " +
      "door, pinches the threads to read the pulse",
    groundTruth:
      "Chapter 69, \"The Mind's Lord Prepares Medicine at Night; At the Banquet the King " +
      "Discusses the Demon\". Wukong \"went straight to the door of the royal bedchamber " +
      "and stood still\", the king \"sat on the dragon bed\", and the golden threads were " +
      "\"tied on at one end, and the other end drawn out through the window\"; Wukong " +
      "\"took the ends of the threads and, first supporting his index finger with the " +
      "thumb of his right hand, read the cun pulse\". There are three threads in all.",
    evaluationCriteria:
      "Full credit: On the right of the frame, inside the window, the sallow, emaciated " +
      "king sits on the dragon bed with golden threads tied to his wrist; three golden " +
      "threads pass out through the window lattice and stretch taut to the left of the " +
      "frame, where Wukong, in the corridor, pinches the threads to read the pulse. " +
      "Deductions: More or fewer than three golden threads; Wukong entering the room or " +
      "holding the king's wrist; a medicine chest or pills drawn; Wukong holding the iron " +
      "rod; the Tang Monk present.",
  },
  "xiyou-anim-069": {
    coreKey:
      "Taking the pulse by suspended threads, with animated quivering, glinting golden " +
      "threads, curtains, and flowering trees",
    groundTruth:
      "Chapter 69, \"The Mind's Lord Prepares Medicine at Night; At the Banquet the King " +
      "Discusses the Demon\". Wukong stands still outside the door of the royal " +
      "bedchamber, the king sits on the dragon bed, and the three golden threads are " +
      "\"tied on at one end, and the other end drawn out through the window\"; Wukong " +
      "\"took the ends of the threads\" and reads the pulse at the cun, guan, and chi " +
      "positions.",
    evaluationCriteria:
      "Full credit: On the right of the frame, inside the window, the sallow, emaciated " +
      "king sits on the dragon bed, three golden threads stretch taut from the window " +
      "lattice to the left of the frame, and Wukong, in the corridor, pinches the threads " +
      "to read the pulse; the golden threads, the curtains, and the flowering trees loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: More or fewer than three golden " +
      "threads; Wukong holding the king's wrist; a medicine chest drawn; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-070": {
    coreKey:
      "Smoke, sand, and fire on the summit of Qilin Mountain: Wukong, leaning on his rod, " +
      "plugs his nose with pebbles, while red flames, five-colored smoke, and yellow sand " +
      "rise from the mountain hollow",
    groundTruth:
      "Chapter 70, \"The Demon's Treasure Releases Smoke, Sand, and Fire; Wukong Schemes " +
      "to Steal the Golden Bells\". From the hollow of Qilin Mountain came \"red flames " +
      "striking the sky, and from within the red flames poured a vile smoke, more " +
      "poisonous than the fire\", then a stream of sand burst forth, \"blotting out the " +
      "sky and hiding the sun\"; with sand and ash in his nose, Wukong \"reached under the " +
      "rock, felt out two pebbles, and plugged his nostrils\".",
    evaluationCriteria:
      "Full credit: On the left of the frame, on a rock at the summit, Wukong leans on his " +
      "rod, and the two pebbles plugging his nostrils are clearly recognizable; at the " +
      "lower right of the frame red flames shoot skyward from the mountain hollow, " +
      "five-colored smoke churns, and yellow sand blots out the sky. Deductions: The " +
      "golden bells drawn; Wukong turned into a sparrow hawk or caught mid-transformation; " +
      "a demon appearing in the hollow; Wukong covering his mouth and nose with cloth.",
  },
  "xiyou-anim-070": {
    coreKey:
      "Pebbles plugging the nose, with animated flames, five-colored smoke, and yellow " +
      "sand and pine branches",
    groundTruth:
      "Chapter 70, \"The Demon's Treasure Releases Smoke, Sand, and Fire; Wukong Schemes " +
      "to Steal the Golden Bells\". From the hollow of Qilin Mountain came \"red flames " +
      "striking the sky\" and vile five-colored smoke, then yellow sand burst forth, " +
      "\"blotting out the sky and hiding the sun\"; Wukong \"reached under the rock, felt " +
      "out two pebbles, and plugged his nostrils\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Wukong leans on his rod on the rock, the " +
      "pebbles plugging his nose recognizable, and at the lower right of the frame the " +
      "mountain hollow shows red flames, five-colored smoke, and yellow sand; the flames, " +
      "the smoke columns, and the yellow sand and pine branches loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: The golden bells drawn; Wukong turned into a " +
      "sparrow hawk; a demon appearing in the hollow; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-071": {
    coreKey:
      "Smoke and fire not yet cleared outside Xiezhi Cave: Guanyin sprinkles sweet dew " +
      "from midair, Wukong bows with palms pressed together, and Sai Tai Sui in human " +
      "form, axe in hand, is trapped",
    groundTruth:
      "Chapter 71, \"Pilgrim, Under a False Name, Defeats the Monster-Hou; Guanyin Appears " +
      "and Subdues the Demon King\". Wukong shakes all three bells at once, and \"red fire, " +
      "blue-green smoke, and yellow sand all rolled out together\"; Guanyin appears in " +
      "midair, \"holding the pure vase in her left hand and the willow sprig in her right, " +
      "sprinkling sweet dew to put out the fire\"; Wukong hides the bells at his waist and " +
      "bows down to the ground.",
    evaluationCriteria:
      "Full credit: At the top of the frame Guanyin stands on an auspicious cloud, holding " +
      "the vase and sprinkling dew; at the lower left of the frame Wukong, empty-handed, " +
      "bows with palms pressed together; at the lower right of the frame Sai Tai Sui in " +
      "human form, holding the flower-engraved battle-axe, is trapped in the smoke, fire, " +
      "and yellow sand. Deductions: The Golden-Haired Hou drawn, or Guanyin riding a " +
      "beast, seated on a lotus throne, or carrying a fish basket; Wukong holding his rod; " +
      "the smoke and fire already completely out.",
  },
  "xiyou-anim-071": {
    coreKey:
      "Guanyin sprinkling dew to quench the bell fire, with animated smoke, fire, and " +
      "yellow sand, drops of sweet dew, and sashes and trees",
    groundTruth:
      "Chapter 71, \"Pilgrim, Under a False Name, Defeats the Monster-Hou; Guanyin Appears " +
      "and Subdues the Demon King\". With the three bells shaken at once, \"red fire, " +
      "blue-green smoke, and yellow sand all rolled out together\"; Guanyin, \"holding the " +
      "pure vase in her left hand and the willow sprig in her right\", \"flicked the " +
      "willow sprig several times, scattering a few drops of sweet dew\", and the smoke " +
      "and fire gradually die away; Wukong bows with palms pressed together.",
    evaluationCriteria:
      "Full credit: On an auspicious cloud Guanyin holds the vase and willow sprig and " +
      "sprinkles dew, at the lower left of the frame Wukong bows with palms pressed " +
      "together, and at the lower right of the frame Sai Tai Sui in human form, axe in " +
      "hand, is trapped in the smoke and fire; the smoke, fire, and yellow sand, the drops " +
      "of sweet dew, and the sashes and trees loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The Golden-Haired Hou drawn or Guanyin riding a beast; Wukong holding " +
      "the golden-hooped rod; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-072": {
    coreKey:
      "Silk cords sealing the farmstead: the farmstead is wrapped layer upon layer in " +
      "thick silver-white silk like warp and weft, and Wukong, one hand on the silk and " +
      "his rod raised, is about to strike but holds back",
    groundTruth:
      "Chapter 72, \"At Silk Cave Seven Passions Delude the Root; At Filth-Cleansing " +
      "Spring Bajie Forgets Himself\". The female demons release silk to seal the " +
      "farmstead, \"the whole expanse like snow yet brighter than snow, like silver yet " +
      "shinier than silver\"; Wukong \"tightened his tiger-skin kilt and pulled out the " +
      "golden-hooped rod\", and sees the silk cords \"wound a thousand layers thick, " +
      "crisscrossing back and forth just like warp and weft\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the farmstead is wrapped layer upon layer " +
      "in thick silver-white silk cords crisscrossing like warp and weft; in the right " +
      "foreground Wukong, one hand on the silk and the other raising his rod, is about to " +
      "strike; far off at the upper left Bajie and Sha Wujing guard the horse and watch " +
      "the luggage. Deductions: The silk drawn as a single round spiderweb; women, " +
      "spiders, or the spring pool appearing; the Tang Monk present.",
  },
  "xiyou-anim-072": {
    coreKey:
      "Silk cords sealing the farmstead, with animated silver light on the silk, water " +
      "under the bridge, and leaves and garment hems",
    groundTruth:
      "Chapter 72, \"At Silk Cave Seven Passions Delude the Root; At Filth-Cleansing " +
      "Spring Bajie Forgets Himself\". Silk cords seal the farmstead, \"the whole expanse " +
      "like snow yet brighter than snow, like silver yet shinier than silver\"; Wukong " +
      "\"tightened his tiger-skin kilt and pulled out the golden-hooped rod\", and sees " +
      "the silk cords \"crisscrossing back and forth just like warp and weft\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the farmstead is wrapped layer upon layer " +
      "in thick silver-white silk cords like warp and weft, in the right foreground Wukong " +
      "has one hand on the silk and the other raising his rod, and far off Bajie and Sha " +
      "Wujing guard the horse; the silver light on the silk, the water under the bridge, " +
      "and the leaves and garment hems loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The silk drawn as a single round spiderweb; women, spiders, or the " +
      "spring pool appearing; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-073": {
    coreKey:
      "Shedding the robe and releasing the light at Yellow Flower Temple: the thousand " +
      "eyes along the Taoist's flanks burst out golden light and yellow mist, and Wukong, " +
      "enclosed in the golden light, can neither advance nor retreat",
    groundTruth:
      "Chapter 73, \"Passion, Born of Old Grudges, Breeds Calamity and Poison; The Mind's " +
      "Lord, Beset by the Demon, Luckily Breaks the Light\". The Taoist, wearing a " +
      "gold-inlaid crown, takes off his black robe and raises both hands together, \"and " +
      "there under his two flanks were a thousand eyes, bursting out with golden light\"; " +
      "the yellow mist and golden light enclose Wukong, who \"could not take a step " +
      "forward or move a foot backward\".",
    evaluationCriteria:
      "Full credit: On the left of the frame the Taoist, in a gold-inlaid crown and a " +
      "short shirt, raises both arms together, and the thousand eyes along his flanks " +
      "burst out with golden light and yellow mist; on the right of the frame Wukong, " +
      "gripping his rod, is enclosed in the golden light. Deductions: Eyes growing on the " +
      "face or hands; the Taoist bare-chested; spider spirits, spider silk, a centipede, " +
      "Pilanpo, or the Tang Monk, Bajie, or Sha Wujing appearing.",
  },
  "xiyou-anim-073": {
    coreKey:
      "The golden light of a thousand eyes trapping Wukong, with animated yellow mist, " +
      "flashing eyes, and yellow sash and black robe",
    groundTruth:
      "Chapter 73, \"Passion, Born of Old Grudges, Breeds Calamity and Poison; The Mind's " +
      "Lord, Beset by the Demon, Luckily Breaks the Light\". The Taoist takes off his " +
      "black robe, \"and there under his two flanks were a thousand eyes, bursting out " +
      "with golden light\", \"from both flanks it gushed like spouting clouds; a blazing " +
      "golden light, as if fire shot from a thousand eyes\", enclosing Wukong.",
    evaluationCriteria:
      "Full credit: On the left of the frame the Taoist, in a gold-inlaid crown and a " +
      "short shirt, his black robe fallen to the ground, shines light from the thousand " +
      "eyes along his flanks, and on the right of the frame Wukong, gripping his rod, is " +
      "enclosed in a barrel-shaped column of golden light; the yellow mist, the flashing " +
      "eyes, and the yellow sash and black robe loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Eyes growing on the face; spider spirits, a centipede, or Pilanpo " +
      "appearing; whole figures drifting; a purely static image, use of JavaScript, or " +
      "XML parse errors.",
  },
  "xiyou-074": {
    coreKey:
      "Wukong shows his true form on the high mountain slope: beneath the stone cliff he " +
      "bares his teeth and holds his rod, and the old man with a staff, a transformation " +
      "of the Gold Star Taibai, falls down in fright",
    groundTruth:
      "Chapter 74, \"The Evening Star Brings Word of the Fierce Demon Chiefs; Pilgrim " +
      "Displays His Powers of Transformation\". At the end of summer and the start of " +
      "autumn, the Gold Star Taibai turns into an old man, \"a string of prayer beads " +
      "hung around his neck, in his hand a staff showing a dragon's head\"; Wukong reveals " +
      "his true form, \"baring his teeth and grimacing\", \"a tiger-skin kilt tied at his " +
      "waist, a golden-hooped rod held in his hand\", standing beneath the stone cliff.",
    evaluationCriteria:
      "Full credit: On the right of the frame, beneath the stone cliff, Wukong in his " +
      "true form bares his teeth, holds his rod, and wears the tiger-skin kilt; on the " +
      "left of the frame the white-haired, silver-bearded old man, with prayer beads " +
      "around his neck and leaning on a dragon-head staff, is so frightened that he falls " +
      "sitting and leans back. Deductions: The old man wearing court robes, holding a " +
      "whisk, or drawn as a white-bearded immortal official or a village girl; the Tang " +
      "Monk, Bajie, or demons appearing.",
  },
  "xiyou-anim-074": {
    coreKey:
      "Wukong showing his true form to frighten the old man, with animated hair, beard, " +
      "and kilt edge, falling parasol-tree leaves, and clouds over distant mountains",
    groundTruth:
      "Chapter 74, \"The Evening Star Brings Word of the Fierce Demon Chiefs; Pilgrim " +
      "Displays His Powers of Transformation\". At the end of summer and the start of " +
      "autumn, the Gold Star Taibai turns into an old man, \"in his hand a staff showing a " +
      "dragon's head\"; Wukong reveals his true form, \"a tiger-skin kilt tied at his " +
      "waist, a golden-hooped rod held in his hand\", \"standing beneath the stone " +
      "cliff\", and the old man falls down in fright.",
    evaluationCriteria:
      "Full credit: On the right of the frame, beneath the stone cliff, Wukong in his " +
      "true form holds his rod, and on the left of the frame the old man, leaning on a " +
      "dragon-head staff with prayer beads around his neck, falls sitting in fright; the " +
      "hair, beard, and kilt edge, the falling parasol-tree leaves, and the clouds loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The old man wearing court " +
      "robes, holding a whisk, or drawn as an immortal official or a village girl; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-075": {
    coreKey:
      "Taking the blade before Lion-Camel Cave: the lion-faced Old Demon in golden armor, " +
      "in a T-shaped stance, raises his blade to chop at the crown of Wukong's head, and " +
      "Wukong tilts his head up to meet the blade, unharmed",
    groundTruth:
      "Chapter 75, \"The Mind-Monkey Bores Through the Yin-Yang Body; The Demon Lord " +
      "Returns to the Truth of the Great Way\". The Old Demon, \"his body clad in seamless " +
      "golden armor, a dragon sash at his waist, alert to every chance\", \"took a firm " +
      "T-shaped stance, raised the blade with both hands, and chopped straight at the " +
      "crown of the Great Sage's head\"; Wukong \"thrust his head up to meet it\", and " +
      "\"his scalp did not even turn red\"; Bajie dodges to one side.",
    evaluationCriteria:
      "Full credit: On the left of the frame the lion-faced Old Demon in golden armor, in " +
      "a T-shaped stance, raises the blade with both hands to chop at the crown of the " +
      "head; in the center of the frame Wukong tilts his head up to meet the blade; on the " +
      "right of the frame Bajie, holding his rake, dodges aside. Deductions: Blood where " +
      "the blade falls; the Old Demon drawn as a whole lion; demon soldiers, skulls, the " +
      "precious vase, or the Second Demon, the Third Demon, or the Tang Monk appearing.",
  },
  "xiyou-anim-075": {
    coreKey:
      "The Old Demon raising his blade to chop at the crown of the head, with animated " +
      "helmet plume and dragon sash, blade-wind dust, and plants before the cave",
    groundTruth:
      "Chapter 75, \"The Mind-Monkey Bores Through the Yin-Yang Body; The Demon Lord " +
      "Returns to the Truth of the Great Way\". The Old Demon, \"his body clad in seamless " +
      "golden armor, a dragon sash at his waist, alert to every chance\", \"took a firm " +
      "T-shaped stance, raised the blade with both hands, and chopped straight at the " +
      "crown of the Great Sage's head\"; Wukong \"thrust his head up to meet it\", and " +
      "\"his scalp did not even turn red\".",
    evaluationCriteria:
      "Full credit: On the left of the frame the lion-faced Old Demon in golden armor " +
      "raises the blade to chop at the crown of the head, in the center of the frame " +
      "Wukong tilts his head up to meet the blade, and on the right of the frame Bajie, " +
      "holding his rake, dodges aside; the helmet plume and dragon sash, the blade-wind " +
      "dust, and the plants loop smoothly, driven by SMIL or inline CSS. Deductions: Blood " +
      "where the blade falls; the Old Demon drawn as a whole lion; demon soldiers, skulls, " +
      "or the precious vase appearing; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-076": {
    coreKey:
      "Leading him by the nose like elephant keepers: Wukong grips the long nose of the " +
      "Second Demon in human form and pulls him forward, while Bajie, holding the rake " +
      "upside down, beats him with the handle",
    groundTruth:
      "Chapter 76, \"When the Mind-Spirit Stays Home, the Demons Return to Their Nature; " +
      "The Wood Mother Joins in Subduing the Monster's True Form\". The Second Demon is in " +
      "human form, three zhang tall, with a nose like a flood dragon; Wukong grabs the " +
      "long nose, \"and just like two elephant keepers, they led him down the slope\", and " +
      "Bajie holds the rake upside down, \"just turning the handle around to beat him\"; " +
      "below the slope the Tang Monk gazes intently, waiting anxiously.",
    evaluationCriteria:
      "Full credit: In the center of the frame the Second Demon in human form, with " +
      "yellow tusks and a silver nose, stands several times Wukong's height; on the left " +
      "of the frame Wukong grips the nose and pulls forward; on the right of the frame, on " +
      "the slope, Bajie in wet clothes holds the rake upside down and beats him with the " +
      "handle; in the lower left corner at the foot of the slope the Tang Monk presses his " +
      "palms together. Deductions: The Second Demon drawn as a four-legged elephant; " +
      "striking with the rake's teeth or blood shown; an elephant goad drawn; the Tang " +
      "Monk wearing the brocade cassock.",
  },
  "xiyou-anim-076": {
    coreKey:
      "Wukong leading the Second Demon by the nose, with animated dripping wet clothes, " +
      "dust on the slope, and grass and kilt edge",
    groundTruth:
      "Chapter 76, \"When the Mind-Spirit Stays Home, the Demons Return to Their Nature; " +
      "The Wood Mother Joins in Subduing the Monster's True Form\". Bajie has just come " +
      "out of the pond, his clothes damp; Wukong grabs the Second Demon's long nose, \"and " +
      "just like two elephant keepers, they led him down the slope\", and Bajie holds the " +
      "rake upside down, \"just turning the handle around to beat him\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the Second Demon in human form has yellow " +
      "tusks and a silver nose, on the left of the frame Wukong grips the nose and pulls " +
      "forward, on the right of the frame, on the slope, Bajie in wet clothes holds the " +
      "rake upside down and beats him with the handle, and in the lower left corner the " +
      "Tang Monk gazes on; the dripping wet clothes, the dust on the slope, and the grass " +
      "and kilt edge loop smoothly, driven by SMIL or inline CSS. Deductions: The Second " +
      "Demon drawn as a four-legged elephant; blood drawn; the Tang Monk in a cassock or " +
      "a Vairocana hat; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-077": {
    coreKey:
      "The Great Peng pinned atop the Buddha's head: the golden body points once, the " +
      "Great Peng shows its true form as a golden-winged eagle and stands stiff atop the " +
      "Buddha's head, and Wukong hides in the golden light",
    groundTruth:
      "Chapter 77, \"The Demon Host Deceives the Original Nature; The One Body Bows to " +
      "Suchness\". The Tathagata, with the arhats and Guardians, surrounds the Third " +
      "Demon; the Great Peng swoops in, \"but the Buddha pointed his hand upward once, and " +
      "the demon's wing sinews cramped so that he could not fly away\", and \"he showed " +
      "his true form: a Great Peng Golden-Winged Eagle\"; Wukong \"hid within the shadow " +
      "of the Buddha's golden light\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the Tathagata's golden body points upward " +
      "with one hand, and atop his head stands the great golden-winged eagle, its wings " +
      "stiffly spread; on the right of the frame Wukong leans out from the golden light; " +
      "the black vapor over the city and the arhats in the clouds are recognizable. " +
      "Deductions: The Great Peng drawn with a human body holding a halberd, or as a " +
      "nine-headed bird, a peacock, or a phoenix; the Tathagata holding an alms bowl; " +
      "Manjushri, Samantabhadra, the blue lion, or the white elephant appearing; blood " +
      "drawn.",
  },
  "xiyou-anim-077": {
    coreKey:
      "The Great Peng pinned atop the Tathagata's head, with animated golden light, black " +
      "vapor, and auspicious clouds",
    groundTruth:
      "Chapter 77, \"The Demon Host Deceives the Original Nature; The One Body Bows to " +
      "Suchness\". The Great Peng swoops at the Tathagata, \"but the Buddha pointed his " +
      "hand upward once, and the demon's wing sinews cramped so that he could not fly " +
      "away\", and \"he showed his true form: a Great Peng Golden-Winged Eagle\"; Wukong " +
      "\"hid within the shadow of the Buddha's golden light\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the Tathagata's golden body points upward " +
      "with one hand, atop his head stands the great golden-winged eagle with its wings " +
      "stiffly spread, and on the right of the frame Wukong leans out from the golden " +
      "light; the golden light, the black vapor, and the auspicious clouds loop smoothly, " +
      "driven by SMIL or inline CSS. Deductions: The Great Peng drawn with a human body " +
      "holding a halberd, or as a nine-headed bird or a peacock; Manjushri, Samantabhadra, " +
      "or the blue lion and white elephant appearing; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-078": {
    coreKey:
      "The golden hall of Bhiksu Kingdom: the sickly king struggles down from the dragon " +
      "bed to bow in welcome, the State Father, an old Taoist, saunters into the hall " +
      "without saluting, and an insect perches on the monk's hat",
    groundTruth:
      "Chapter 78, \"In Bhiksu, Pitying the Children, He Dispatches the Hidden Spirits; In " +
      "the Golden Hall He Recognizes the Demon and Discourses on the Way and Virtue\". At " +
      "the winter morning court, the king, \"supported by the young eunuchs in " +
      "attendance, struggled down from the dragon bed and bowed in welcome\"; the State " +
      "Father \"turned out to be an old Taoist, who came swaying and swaggering in from " +
      "before the jade steps\", without any salute at all; Wukong, turned into a jiaoliao " +
      "insect, perches on the Tang Monk's hat.",
    evaluationCriteria:
      "Full credit: On the right of the frame the emaciated king, supported by a young " +
      "eunuch, bows in welcome; on the left of the frame the State Father, an old Taoist " +
      "in a gauze kerchief and crane-feather cloak, leaning on a coiled-dragon staff, " +
      "saunters in; slightly back in the center of the frame the Tang Monk, in a Vairocana " +
      "hat and the brocade cassock, stands sideways, and the small insect on top of his " +
      "hat is recognizable. Deductions: The State Father with deer antlers, or kneeling to " +
      "salute; goose cages, small children, cutting out hearts, or a fox drawn; Wukong " +
      "present in human form.",
  },
  "xiyou-anim-078": {
    coreKey:
      "The State Father sauntering into the golden hall, with animated cloud mist and " +
      "fragrance, gray beard and crane-feather cloak, and the nine rings of the monk's " +
      "staff",
    groundTruth:
      "Chapter 78, \"In Bhiksu, Pitying the Children, He Dispatches the Hidden Spirits; In " +
      "the Golden Hall He Recognizes the Demon and Discourses on the Way and Virtue\". The " +
      "king, \"supported by the young eunuchs in attendance, struggled down from the " +
      "dragon bed and bowed in welcome\"; the State Father \"turned out to be an old " +
      "Taoist, who came swaying and swaggering in from before the jade steps\"; Wukong, " +
      "turned into a jiaoliao insect, \"flew onto Sanzang's hat\".",
    evaluationCriteria:
      "Full credit: On the right of the frame the emaciated king, supported by a young " +
      "eunuch, bows in welcome, on the left of the frame the State Father, an old Taoist " +
      "leaning on a coiled-dragon staff, saunters in, and slightly back in the center of " +
      "the frame the Tang Monk in a Vairocana hat stands sideways, the small insect on top " +
      "of his hat recognizable; the cloud mist and fragrance, the gray beard and " +
      "crane-feather cloak, and the nine rings of the monk's staff loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: The State Father with deer antlers; goose cages " +
      "or small children drawn; Wukong present in human form; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-079": {
    coreKey:
      "The Star of Longevity covers the light at Willow Grove Slope: the State Father " +
      "shows his true form as a white deer, prostrate and shedding tears, the Star of " +
      "Longevity leans on his staff, Wukong returns the salute, and Bajie laughs",
    groundTruth:
      "Chapter 79, \"Searching the Cave to Seize the Fiend, They Meet Old Longevity; The " +
      "Rightful Lord of the Court Saves the Infants\". The State Father turns into a cold " +
      "light and flees east, and \"again they heard the cries of luan birds and cranes, " +
      "and auspicious light drifted faintly\"; the Star of Longevity covers the cold light " +
      "and calls, \"Great Sage, slow down; Marshal Tianpeng, stop the chase\"; ordered to " +
      "show his form, \"the monster turned around, and it was a white deer after all\", " +
      "prostrate and shedding tears.",
    evaluationCriteria:
      "Full credit: On the left of the frame the Star of Longevity, with a long head, big " +
      "ears, and a white beard, bareheaded, stands in the auspicious light leaning on a " +
      "coiled-dragon staff; in the center of the frame, by the stream, the white deer with " +
      "seven tines on its two antlers lies prostrate with ears flattened; on the right of " +
      "the frame Wukong, holding his rod, returns the salute, and Bajie, rake on his " +
      "shoulder, laughs. Deductions: The Star of Longevity riding the deer, holding an " +
      "immortal peach, or accompanied by immortal boys; the white deer drawn as a sika " +
      "deer with large spots or as a Taoist in human form; disemboweling, a fox, or blood " +
      "drawn.",
  },
  "xiyou-anim-079": {
    coreKey:
      "The Star of Longevity covering the light to reveal the white deer, with animated " +
      "stream water, willow twigs and white beard, and luan birds and cranes",
    groundTruth:
      "Chapter 79, \"Searching the Cave to Seize the Fiend, They Meet Old Longevity; The " +
      "Rightful Lord of the Court Saves the Infants\". \"Again they heard the cries of " +
      "luan birds and cranes, and auspicious light drifted faintly\"; the Star of " +
      "Longevity of the South Pole covers the cold light into which the State Father has " +
      "turned, and \"the monster turned around, and it was a white deer after all\", " +
      "lying prostrate on the ground; the Star of Longevity has a long head and big ears, " +
      "and a white beard hanging to his chest.",
    evaluationCriteria:
      "Full credit: On the left of the frame the Star of Longevity stands in the " +
      "auspicious light leaning on a coiled-dragon staff, in the center of the frame the " +
      "white deer with seven tines on its two antlers lies prostrate with ears flattened, " +
      "and on the right of the frame Wukong, holding his rod, returns the salute while " +
      "Bajie, rake on his shoulder, laughs; the stream water, the willow twigs and white " +
      "beard, and the luan birds and cranes loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The Star of Longevity riding the deer or holding an immortal peach; " +
      "the white deer still in human form; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "xiyou-080": {
    coreKey:
      "A woman bound to a tree in Black Pine Forest: the Tang Monk comes close to question " +
      "her, Wukong looks back from his cloud, and black vapor from the forest covers the " +
      "auspicious clouds",
    groundTruth:
      "Chapter 80, \"The Fair Maiden, Nurturing Yang, Seeks a Mate; The Mind-Monkey, " +
      "Guarding His Master, Recognizes the Demon\". In Black Pine Forest in late spring, " +
      "Wukong in midair sees auspicious clouds and lucky vapors, and then sees \"south of " +
      "the forest a column of black vapor, billowing and bubbling up\"; the woman on the " +
      "tree is bound by her upper body, with her lower body buried in the earth, \"tears " +
      "falling on her peach-blossom cheeks\", \"sorrow in her starry eyes\".",
    evaluationCriteria:
      "Full credit: On the right of the frame the woman, her upper body bound to a big " +
      "tree and her lower body buried in the earth, has tears on her peach-blossom " +
      "cheeks; on the left of the frame the Tang Monk in plain clothes stands still and " +
      "questions her; at the upper left Wukong rides a cloud looking back, holding his rod " +
      "and an alms bowl; at the upper right black vapor covers the pale gold auspicious " +
      "clouds. Deductions: The woman drawn with rat whiskers, a pointed nose, or a rat " +
      "tail; the Tang Monk wearing a Vairocana hat or a cassock; Bajie or Sha Wujing " +
      "present; the woman already untied.",
  },
  "xiyou-anim-080": {
    coreKey:
      "A woman crying for help in Black Pine Forest, with animated black vapor and " +
      "auspicious clouds, pine branches and kudzu vines, and the somersault cloud",
    groundTruth:
      "Chapter 80, \"The Fair Maiden, Nurturing Yang, Seeks a Mate; The Mind-Monkey, " +
      "Guarding His Master, Recognizes the Demon\". In Black Pine Forest in late spring, a " +
      "woman is bound to a big tree, her upper body tied to the tree and her lower body " +
      "buried in the earth, \"tears falling on her peach-blossom cheeks\"; Wukong in " +
      "midair then sees \"south of the forest a column of black vapor, billowing and " +
      "bubbling up\".",
    evaluationCriteria:
      "Full credit: On the right of the frame the woman has her upper body bound to the " +
      "tree and her lower body buried in the earth, on the left of the frame the Tang Monk " +
      "stands still and questions her, at the upper left Wukong rides a cloud looking " +
      "back, and the black vapor and pale gold auspicious clouds are recognizable; the " +
      "black vapor, the pine branches and kudzu vines, and the somersault cloud loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The woman drawn with rat " +
      "whiskers, a pointed nose, or a rat tail; the Tang Monk wearing a Vairocana hat; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
};
