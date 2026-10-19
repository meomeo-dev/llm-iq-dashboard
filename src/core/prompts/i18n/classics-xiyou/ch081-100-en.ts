/**
 * 《西游记》第 81–100 回候选的英文标签与英文评判标准，由 src/core/classics/xiyou/ch081-090.ts、
 * ch091-100.ts 的中文逐条翻译。
 */

import type { LocalizedStandardEntry } from "../standards-single-en";

/** 静态候选 id → 英文标签；动态候选由 localizeCandidateLabel 追加 “(Animated)” */
export const XIYOU_CH081_100_LABELS_EN: Readonly<Record<string, string>> = {
  "xiyou-081": "Ch. 81 · Beating the Mountain God and Earth God Out of the Forest",
  "xiyou-082": "Ch. 82 · Bajie, Disguised as a Monk, Bows and Greets by the Well",
  "xiyou-083": "Ch. 83 · Nezha Parries the Saber with His Sword to Save Wukong",
  "xiyou-084": "Ch. 84 · The Golden-Hooped Rod Turns into Razors",
  "xiyou-085": "Ch. 85 · The Short, Skinny Monk Walks into the Encircling Formation",
  "xiyou-086": "Ch. 86 · Bajie Builds a Grave and Offers Pebbles",
  "xiyou-087": "Ch. 87 · The Rice Mountain and Flour Mountain in the Hall of Fragrance",
  "xiyou-088": "Ch. 88 · Martial Display in Midair at Jade-Flower Prefecture",
  "xiyou-089": "Ch. 89 · Bajie Seizes His Rake at the Rake Banquet",
  "xiyou-090": "Ch. 90 · The Heavenly Worthy Shouts the Nine-Headed Lion into Submission",
  "xiyou-091": "Ch. 91 · Buddha Forms Appear in the Wind at Gold Lantern Bridge",
  "xiyou-092": "Ch. 92 · Bajie Smashes the Stone Doors",
  "xiyou-093": "Ch. 93 · The Embroidered Ball from the Festooned Tower Strikes the Monk's Hat",
  "xiyou-094": "Ch. 94 · Matching Poems on the Golden Screens in Huayi Pavilion",
  "xiyou-095": "Ch. 95 · The Star Lord of the Great Yin Takes Back the Jade Hare",
  "xiyou-096": "Ch. 96 · Farewell to the Squire at the Ten-Li Pavilion",
  "xiyou-097": "Ch. 97 · Wukong Scatters Dirt to Immobilize the Robbers",
  "xiyou-098": "Ch. 98 · The Bottomless Boat at Cloud-Transcending Ferry",
  "xiyou-099": "Ch. 99 · Drying the Scriptures on the Cliff by the River of Heaven",
  "xiyou-100": "Ch. 100 · The White Dragon Coils the Column as Wukong Feels His Head",
};

/** 静态与动态候选 id → 英文评判标准 */
export const XIYOU_CH081_100_STANDARDS_EN: Readonly<Record<string, LocalizedStandardEntry>> = {
  "xiyou-081": {
    coreKey:
      "Three heads and six arms in Black Pine Forest: Wukong, one body with three heads, " +
      "flails about with three rods in six hands, the mountain god and the earth god, two " +
      "old men, kneel on the ground, and Bajie looks on",
    groundTruth:
      "Chapter 81, \"At Zhenhai Monastery the Mind-Monkey Recognizes the Monster; In Black " +
      "Pine Forest the Three Disciples Search for Their Master\". In Black Pine Forest Wukong " +
      "shows \"three heads and six arms, his six hands wielding three rods, flailing about " +
      "with a crack and a bang in the forest\", and \"beat out two old men: one was the " +
      "mountain god, the other the earth god\", who come forward and kneel; Bajie watches " +
      "from the side.",
    evaluationCriteria:
      "Full credit: In the center of the frame Wukong has one body with three heads and six " +
      "arms, the middle head wearing the golden fillet, and his six hands, jointly gripping " +
      "three rods, flail about; at the lower right of the frame two white-haired old men " +
      "kneel empty-handed and kowtow; on the left of the frame Bajie holds his rake and " +
      "looks on; the vines, kudzu, and cloud mist in the forest are recognizable. " +
      "Deductions: Drawn as three Wukongs or as clones; Wukong in golden armor or holding a " +
      "weapon other than the rod; the two old men wearing squire's hats, holding court " +
      "tablets, or wounded by the beating; Sha Wujing or the white horse present; blood " +
      "shown.",
  },
  "xiyou-anim-081": {
    coreKey:
      "Beating the mountain god and earth god out of the forest, with animated cloud mist, " +
      "pine branches and kudzu vines, and falling leaves",
    groundTruth:
      "Chapter 81, \"At Zhenhai Monastery the Mind-Monkey Recognizes the Monster; In Black " +
      "Pine Forest the Three Disciples Search for Their Master\". Wukong, with \"three heads " +
      "and six arms, his six hands wielding three rods, flailing about with a crack and a " +
      "bang in the forest\", \"beat out two old men: one was the mountain god, the other " +
      "the earth god\", who come forward and kneel.",
    evaluationCriteria:
      "Full credit: In the center of the frame Wukong has one body with three heads and six " +
      "arms, his six hands jointly gripping three rods, at the lower right of the frame two " +
      "white-haired old men kneel and kowtow, and on the left of the frame Bajie leans on " +
      "his rake and looks on; the cloud mist, the pine branches and kudzu vines, and the " +
      "falling leaves loop smoothly, driven by SMIL or inline CSS. Deductions: Drawn as " +
      "three Wukongs; the two old men wearing squire's hats; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-082": {
    coreKey:
      "By the well on Pitfall Mountain: Bajie, turned into a swarthy, fat monk, bows and " +
      "calls out a greeting, while two female demons with tall chignon frames, their " +
      "carrying pole set down, look pleased",
    groundTruth:
      "Chapter 82, \"The Fair Maiden Seeks the Yang; The Primal Spirit Guards the Way\". " +
      "The two female demons by the well \"each wore on her head a bamboo-strip chignon " +
      "frame one Chinese foot two or three inches tall\", and had earlier beaten Bajie with " +
      "the pole they carried water on; Bajie \"tucked his rake into his waistband\" and " +
      "\"turned into a swarthy, fat monk. Swaying and waddling, he walked up to the demons " +
      "and made a deep bow with a loud greeting\".",
    evaluationCriteria:
      "Full credit: On the left of the frame the swarthy, fat monk, in human form with a " +
      "shaven head and the rake head showing behind his waist, bows and calls out a " +
      "greeting; on the right of the frame the two plainly dressed female demons wear " +
      "markedly tall bamboo-strip hair frames, and the carrying pole and wooden buckets sit " +
      "beside the well platform. Deductions: The monk showing a pig's snout and big ears, " +
      "carrying the rake on his shoulder, or striking a wooden fish; the female demons " +
      "raising the pole to strike or wearing phoenix crowns; Wukong, Sha Wujing, the Tang " +
      "Monk, the rat spirit, a memorial archway, or the cave entrance appearing.",
  },
  "xiyou-anim-082": {
    coreKey:
      "Bajie, disguised as a monk, bowing and greeting by the well, with animated water in " +
      "the bucket, plants, and robe hems and skirt sashes",
    groundTruth:
      "Chapter 82, \"The Fair Maiden Seeks the Yang; The Primal Spirit Guards the Way\". " +
      "The two female demons by the well wear tall \"bamboo-strip chignon frames\" and carry " +
      "water on a pole; Bajie \"tucked his rake into his waistband\" and \"turned into a " +
      "swarthy, fat monk. Swaying and waddling, he walked up to the demons and made a deep " +
      "bow with a loud greeting\".",
    evaluationCriteria:
      "Full credit: On the left of the frame the swarthy, fat monk in human form with a " +
      "shaven head bows and calls out a greeting, the rake head showing behind his waist, " +
      "and on the right of the frame the two female demons wear tall hair frames, with the " +
      "carrying pole set beside the well platform; the water in the bucket, the plants, and " +
      "the robe hems and skirt sashes loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The monk showing a pig's snout and big ears; Wukong, Sha Wujing, or the " +
      "rat spirit appearing; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-083": {
    coreKey:
      "Parrying with the sword at Cloud Tower Palace: Wukong, bound, smiles, Heavenly King " +
      "Li, without his pagoda, swings his saber down, and the boy Nezha raises the " +
      "demon-slaying sword to parry it",
    groundTruth:
      "Chapter 83, \"The Mind-Monkey Recognizes the Elixir's Source; The Fair Maiden Returns " +
      "to Her Original Nature\". The Heavenly King orders, \"Tie up this monkey with the " +
      "demon-binding rope\", and takes up the demon-hacking saber to chop at his head, \"but " +
      "the Third Prince had already rushed forward and parried it with the demon-slaying " +
      "sword\"; Wukong is \"not afraid in the least, all smiles\"; the Heavenly King \"was " +
      "not holding the pagoda\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Wukong, tied up with thick rope, smiles " +
      "empty-handed while heavenly generals hold the rope ends; on the right of the frame " +
      "the Heavenly King in helmet and armor swings his saber down, with no pagoda in hand; " +
      "in the center of the frame the boy Nezha with twin hair tufts raises his sword to " +
      "parry the saber; the Gold Star stands at the right rear with hands clasped, urging " +
      "restraint. Deductions: The Heavenly King holding up the pagoda or holding a halberd; " +
      "Nezha standing on Wind Fire Wheels or carrying the Universe Ring, the Red Armillary " +
      "Sash, or the Fire-Tipped Spear; Wukong holding his rod; blood shown where the saber " +
      "falls; the rat spirit, or the Tang Monk, Bajie, or Sha Wujing appearing.",
  },
  "xiyou-anim-083": {
    coreKey:
      "Nezha parrying with his sword to save Wukong, with animated incense smoke, cloud " +
      "vapor, and helmet plume and garment sashes",
    groundTruth:
      "Chapter 83, \"The Mind-Monkey Recognizes the Elixir's Source; The Fair Maiden Returns " +
      "to Her Original Nature\". Wukong, tied up with the demon-binding rope, is \"not " +
      "afraid in the least, all smiles\"; the Heavenly King takes up the demon-hacking saber " +
      "and chops down, \"but the Third Prince had already rushed forward and parried it " +
      "with the demon-slaying sword\"; the Heavenly King \"was not holding the pagoda\".",
    evaluationCriteria:
      "Full credit: On the left of the frame Wukong, tied up, smiles, on the right of the " +
      "frame the Heavenly King swings his saber with no pagoda in hand, in the center of the " +
      "frame the boy Nezha raises his sword to parry the saber, and the Gold Star urges " +
      "restraint; the incense smoke, the cloud vapor, and the helmet plume and garment " +
      "sashes loop smoothly, driven by SMIL or inline CSS. Deductions: The Heavenly King " +
      "holding up the pagoda; Nezha standing on Wind Fire Wheels or carrying the Universe " +
      "Ring or the Red Armillary Sash; whole figures drifting; a purely static image, use " +
      "of JavaScript, or XML parse errors.",
  },
  "xiyou-084": {
    coreKey:
      "Above the palace of the Dharma-Destroying Kingdom: Wukong, standing on a cloud, " +
      "hands out the razors his rod has become, little Pilgrims take the razors, and " +
      "sleep-inducing insects drift away",
    groundTruth:
      "Chapter 84, \"The Indestructible Empowerment Perfects Great Enlightenment; The " +
      "Dharma King Attains His True Form Naturally\". At the third watch Wukong makes the " +
      "hairs of his left arm \"all turn into little Pilgrims\", the golden-hooped rod \"at " +
      "once turned into hundreds and thousands of razors\", and the hairs of his right arm " +
      "\"all turned into sleep-inducing insects\", so that he can shave the heads of the " +
      "ruler and ministers of the Dharma-Destroying Kingdom; at this moment no one has yet " +
      "been shaved.",
    evaluationCriteria:
      "Full credit: Above the palace on a summer night, in the center of the frame Wukong " +
      "stands on a cloud with small razors heaped before him and one pinched in his " +
      "fingers, dozens of little Pilgrims gather around to take razors, and the " +
      "sleep-inducing insects drift toward the roofs. Deductions: People being shaved, a " +
      "shaven-headed ruler and ministers, or hair drawn; Wukong wearing a headscarf or " +
      "holding the golden-hooped rod; modern razors, or the Tang Monk, Bajie, or Sha Wujing " +
      "appearing.",
  },
  "xiyou-anim-084": {
    coreKey:
      "The golden-hooped rod turning into razors, with animated palace-lantern candle " +
      "flames, sleep-inducing insects, and cloud vapor",
    groundTruth:
      "Chapter 84, \"The Indestructible Empowerment Perfects Great Enlightenment; The " +
      "Dharma King Attains His True Form Naturally\". At the third watch the hairs of " +
      "Wukong's left arm \"all turned into little Pilgrims\", the golden-hooped rod \"at " +
      "once turned into hundreds and thousands of razors\", and the hairs of his right arm " +
      "\"all turned into sleep-inducing insects\"; at this moment no one has yet been " +
      "shaved.",
    evaluationCriteria:
      "Full credit: Above the palace on a summer night, in the center of the frame Wukong " +
      "stands on a cloud with small razors heaped before him, dozens of little Pilgrims " +
      "reach out to take razors, and the sleep-inducing insects are recognizable; the " +
      "candle flames, the sleep-inducing insects, and the cloud vapor loop smoothly, driven " +
      "by SMIL or inline CSS. Deductions: People being shaved or a shaven-headed ruler and " +
      "ministers drawn; Wukong wearing a headscarf or holding the golden-hooped rod; whole " +
      "figures drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-085": {
    coreKey:
      "The encircling formation at the main road junction: Bajie, turned into a short, " +
      "skinny monk, strikes a wooden fish, while beast-faced little demons in a half circle " +
      "tug at his clothes and sash",
    groundTruth:
      "Chapter 85, \"The Mind-Monkey Envies the Wood Mother; The Demon Lord Plots to Devour " +
      "the Chan Monk\". The demons \"gathered in the wind and drew in the mist\" and at the " +
      "main road junction \"laid out an encircling formation\"; Bajie \"turned into a " +
      "short, skinny monk, striking a wooden fish in his hand\", humming only the copybook " +
      "primer \"Shang Da Ren\", and \"was surrounded by the demons, one tugging at his " +
      "clothes, another pulling at his silk sash\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the short, skinny monk, in human form with a " +
      "shaven head, holds a wooden fish and strikes it, while six to ten beast-faced little " +
      "demons in a half circle tug at his clothes and silk sash. Deductions: The monk " +
      "showing a pig's snout and big ears, tall and fat, or holding the rake; the little " +
      "demons in armor; the old demon, Wukong, the Tang Monk, Sha Wujing, steamer baskets, " +
      "or blood appearing.",
  },
  "xiyou-anim-085": {
    coreKey:
      "The short, skinny monk walking into the encircling formation, with animated mallet, " +
      "garment fronts and silk sash, and pines, bamboo, and tall grass",
    groundTruth:
      "Chapter 85, \"The Mind-Monkey Envies the Wood Mother; The Demon Lord Plots to Devour " +
      "the Chan Monk\". Bajie \"turned into a short, skinny monk, striking a wooden fish in " +
      "his hand\", and walks into the encircling formation at the main road junction, where " +
      "he \"was surrounded by the demons, one tugging at his clothes, another pulling at " +
      "his silk sash, pushing and shoving\".",
    evaluationCriteria:
      "Full credit: In the center of the frame the short, skinny monk, in human form with a " +
      "shaven head, holds a wooden fish and strikes it, and beast-faced little demons in a " +
      "half circle tug at his clothes and sash; the mallet, the garment fronts and silk " +
      "sash, and the pines, bamboo, and tall grass loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: The monk showing a pig's snout and big ears or holding the rake; " +
      "the old demon, Wukong, or the Tang Monk appearing; whole figures drifting; a purely " +
      "static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-086": {
    coreKey:
      "A new grave in a sunny spot: willow branches stuck in the grave and pebbles as " +
      "offerings, with Bajie explaining, Wukong scolding, and Sha Wujing shedding tears",
    groundTruth:
      "Chapter 86, \"The Wood Mother Lends Strength to Fight the Monster; The Metal Lord " +
      "Works Magic to Destroy the Fiend\". The three wrongly believe their master is dead, " +
      "and Bajie builds a grave in a sunny spot: \"These willow branches will serve as pines " +
      "and cypresses to shade the top of Master's grave; these pebbles will serve as " +
      "pastries to make offerings to Master\"; Wukong scolds him as a \"dolt\", and Sha " +
      "Wujing sheds tears, keeping vigil by the grave.",
    evaluationCriteria:
      "Full credit: In the center of the frame a low earthen grave has willow branches " +
      "stuck in it and pebbles heaped before it; on the left of the frame Bajie holds his " +
      "rake and explains, on the right of the frame Wukong holds his rod and scolds, behind " +
      "the grave Sha Wujing stands shedding tears, and the white horse and luggage are " +
      "beside the grave. Deductions: A human head, a skull, or blood drawn; a tombstone or " +
      "memorial tablet set up, or an incense burner or paper money laid out; the Tang Monk " +
      "present; Sha Wujing collapsed in weeping.",
  },
  "xiyou-anim-086": {
    coreKey:
      "Bajie building a grave and offering pebbles, with animated stream water, willow " +
      "branches, and horse tail and garment hems",
    groundTruth:
      "Chapter 86, \"The Wood Mother Lends Strength to Fight the Monster; The Metal Lord " +
      "Works Magic to Destroy the Fiend\". Bajie builds a grave in a sunny spot: \"These " +
      "willow branches will serve as pines and cypresses to shade the top of Master's " +
      "grave; these pebbles will serve as pastries to make offerings to Master\"; Wukong " +
      "scolds him as a \"dolt\", and Sha Wujing sheds tears.",
    evaluationCriteria:
      "Full credit: In the center of the frame a low earthen grave has willow branches " +
      "stuck in it and pebbles heaped before it, on the left of the frame Bajie holds his " +
      "rake, on the right of the frame Wukong holds his rod, behind the grave Sha Wujing " +
      "sheds tears, and the white horse and luggage are beside the grave; the stream water, " +
      "the willow branches, and the horse tail and garment hems loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: A human head or blood drawn; a tombstone set up, or " +
      "an incense burner or paper money laid out; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-087": {
    coreKey:
      "The three things in the Hall of Fragrance: a chicken pecks at the rice mountain, a " +
      "dog licks the flour mountain, a lamp flame licks the bolt of the golden lock, and " +
      "Wukong turns to question the Heavenly Masters",
    groundTruth:
      "Chapter 87, \"Phoenix-Immortal Prefecture Offends Heaven and Brings On Drought; The " +
      "Great Sage Sun Urges Goodness and Brings Rain\". The Heavenly Masters lead Wukong to " +
      "the Hall of Fragrance to see three things: a rice mountain about ten zhang high and " +
      "a flour mountain about twenty zhang high; \"beside the rice mountain was a chicken " +
      "the size of a fist\", \"beside the flour mountain was a little golden-haired pug\", " +
      "and beneath the golden lock \"was a bright lamp, its flame licking at the bolt of " +
      "the lock\".",
    evaluationCriteria:
      "Full credit: On the left of the frame the rice mountain and the flour mountain, " +
      "twice as tall, are intact, and the fist-sized chicken pecking rice and the " +
      "golden-haired pug licking flour are clearly recognizable; on the right of the frame " +
      "a small golden lock a little over one Chinese foot long hangs from an iron frame, " +
      "its bolt licked by the lamp flame; in the center of the frame Wukong, empty-handed, " +
      "turns to question the Heavenly Masters. Deductions: The rice and flour mountains " +
      "collapsed, or rain falling; the golden lock drawn as a huge lock the size of a " +
      "bushel measure; Wukong holding his rod; the Jade Emperor, Bajie, a Dragon King, or " +
      "the wind bag appearing; writing in the frame.",
  },
  "xiyou-anim-087": {
    coreKey:
      "The rice mountain and flour mountain in the Hall of Fragrance, with animated lamp " +
      "flame, pecking chicken and licking dog, and sliding rice and flour",
    groundTruth:
      "Chapter 87, \"Phoenix-Immortal Prefecture Offends Heaven and Brings On Drought; The " +
      "Great Sage Sun Urges Goodness and Brings Rain\". \"Beside the rice mountain was a " +
      "chicken the size of a fist\" pecking rice, \"beside the flour mountain was a little " +
      "golden-haired pug\" licking flour, and beneath the golden lock \"was a bright lamp, " +
      "its flame licking at the bolt of the lock\"; until the three things are done, no " +
      "rain will fall.",
    evaluationCriteria:
      "Full credit: On the left of the frame the rice mountain and the flour mountain are " +
      "intact, with the chicken pecking rice and the dog licking flour recognizable, on the " +
      "right of the frame the lamp flame beneath the small golden lock licks the bolt, and " +
      "in the center of the frame Wukong turns to question the Heavenly Masters; the lamp " +
      "flame, the pecking chicken and licking dog, and the sliding rice and flour loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The rice and flour mountains " +
      "collapsed; Bajie or the wind bag appearing; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-088": {
    coreKey:
      "Martial display in midair before the Gauze-Airing Pavilion: the three disciples, " +
      "each on an auspicious cloud, wield rod, rake, and staff, the young princes kneel, " +
      "and the Tang Monk looks up",
    groundTruth:
      "Chapter 88, \"The Chan Monks Reach Jade-Flower and Hold a Dharma Assembly; " +
      "Mind-Monkey, Wood, and Earth Instruct Disciples\". Wukong, \"his two feet treading " +
      "five-colored auspicious clouds, rose into midair\", and \"after a while no one could " +
      "be seen, only a sky full of whirling rods\"; Bajie and Sha Wujing then rise into the " +
      "air wielding rake and staff, \"so frightening the three young princes that they " +
      "knelt in the dust\".",
    evaluationCriteria:
      "Full credit: At the top of the frame Wukong treads five-colored auspicious clouds, " +
      "his rod shadows forming a ring while he remains recognizable; at the upper left " +
      "Bajie wields his rake and at the upper right Sha Wujing swings his staff, each on a " +
      "cloud; on the ground the young princes kneel empty-handed, and beside the pavilion " +
      "the Tang Monk in plain clothes looks up. Deductions: Sha Wujing holding a " +
      "crescent-moon spade; Wukong wearing a purple-gold crown or golden armor; the young " +
      "princes holding weapons; the three disciples not airborne.",
  },
  "xiyou-anim-088": {
    coreKey:
      "Martial display in midair at Jade-Flower Prefecture, with animated rod shadows, " +
      "auspicious clouds, and red leaves",
    groundTruth:
      "Chapter 88, \"The Chan Monks Reach Jade-Flower and Hold a Dharma Assembly; " +
      "Mind-Monkey, Wood, and Earth Instruct Disciples\". Wukong, \"his two feet treading " +
      "five-colored auspicious clouds, rose into midair\", and there was \"only a sky full " +
      "of whirling rods\"; Bajie and Sha Wujing then rise into the air wielding rake and " +
      "staff, \"so frightening the three young princes that they knelt in the dust\".",
    evaluationCriteria:
      "Full credit: At the top of the frame Wukong treads five-colored auspicious clouds " +
      "and wields his rod, at the upper left Bajie wields his rake and at the upper right " +
      "Sha Wujing swings his staff, on the ground the young princes kneel, and beside the " +
      "pavilion the Tang Monk looks up; the rod shadows, the auspicious clouds, and the red " +
      "leaves loop smoothly, driven by SMIL or inline CSS. Deductions: Sha Wujing holding a " +
      "crescent-moon spade; the three disciples not airborne; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-089": {
    coreKey:
      "The open hall of Tiger's Mouth Cave: Bajie, in his true form, swings the rake from " +
      "the offering table and rakes at the Yellow Lion Demon, who dodges empty-handed",
    groundTruth:
      "Chapter 89, \"The Yellow Lion Demon Holds a Sham Rake Banquet; Metal, Wood, and " +
      "Earth Make an Uproar on Leopard-Head Mountain by a Ruse\". In the hall, \"on the " +
      "table in the very middle, a nine-toothed rake was enshrined high as an offering\"; " +
      "Bajie \"ran up, took it down, swung it in his hands, and revealed his true form\", " +
      "and \"raked straight at the demon's face\"; the rod and the staff had been leaning " +
      "against the gable walls on either side.",
    evaluationCriteria:
      "Full credit: In the center of the open hall Bajie, in his true form, swings the " +
      "glowing rake and rakes toward the right of the frame, where the Yellow Lion Demon, " +
      "with a golden-maned lion's head and a human body, dodges empty-handed; on the left " +
      "of the frame Wukong and at the right rear Sha Wujing each grip the rod and the staff " +
      "taken from the walls. Deductions: The Yellow Lion Demon holding a spade or drawn as " +
      "a four-legged lion; the rake already striking home with blood shown; the three " +
      "still looking like wolf-headed little demons; pigs and sheep or an invitation card " +
      "appearing; Sha Wujing holding a crescent-moon spade.",
  },
  "xiyou-anim-089": {
    coreKey:
      "Bajie seizing his rake and raking at the demon, with animated rake glow, dust in the " +
      "shaft of light, and garment hems and mane",
    groundTruth:
      "Chapter 89, \"The Yellow Lion Demon Holds a Sham Rake Banquet; Metal, Wood, and " +
      "Earth Make an Uproar on Leopard-Head Mountain by a Ruse\". The nine-toothed rake on " +
      "the offering table was \"dazzling to the eye with its radiance\"; Bajie \"ran up, " +
      "took it down, swung it in his hands, and revealed his true form\", and \"raked " +
      "straight at the demon's face\".",
    evaluationCriteria:
      "Full credit: In the center of the open hall Bajie, in his true form, swings the " +
      "glowing rake, on the right of the frame the Yellow Lion Demon, with a golden-maned " +
      "lion's head and a human body, dodges empty-handed, and Wukong and Sha Wujing each " +
      "grip their weapons; the rake glow, the dust, and the garment hems and mane loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The Yellow Lion Demon holding a " +
      "spade; blood shown; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-090": {
    coreKey:
      "Before the cliff of Bamboo-Joint Mountain: the nine-headed lion recognizes its " +
      "master and lies down kowtowing, the lion keeper grabs its neck mane with fist " +
      "raised, the Heavenly Worthy shouts his command, and Wukong laughs on the cliff",
    groundTruth:
      "Chapter 90, \"Teachers and Lions, Giving and Receiving, Return to the One; Thieves " +
      "of the Way, Entangling Chan, Quiet the Nine Spirits\". At one shout from the " +
      "Heavenly Worthy, \"the demon recognized its master and dared not struggle; it lay " +
      "down with all four feet on the ground and did nothing but kowtow\"; \"the lion " +
      "keeper ran over from the side and grabbed it by the neck mane\"; the nine-headed " +
      "lion, \"with nine heads, had nine mouths\"; Wukong stands on the high cliff laughing.",
    evaluationCriteria:
      "Full credit: In the center of the frame the blue-gray four-legged nine-headed lion, " +
      "all nine heads intact, lies down kowtowing with its heads toward the left; on the " +
      "left of the frame the Heavenly Worthy in a Taoist robe shouts his command " +
      "empty-handed; slightly back in the center of the frame the lion keeper grabs the " +
      "neck mane with fist raised; on the cliff at the upper right of the frame Wukong " +
      "holds his rod and watches, laughing. Deductions: Drawn as a bird form such as the " +
      "Nine-Headed Beast, or as one big head with eight small heads, or with heads missing; " +
      "the lion keeper's fist coming down; the Heavenly Worthy riding the lion, seated on a " +
      "lotus throne, or wearing an imperial crown with bead tassels; the Tang Monk, Bajie, " +
      "Sha Wujing, or blood appearing.",
  },
  "xiyou-anim-090": {
    coreKey:
      "The Heavenly Worthy shouting the nine-headed lion into submission, with animated " +
      "cloud vapor, stream water, and mane and garment sashes",
    groundTruth:
      "Chapter 90, \"Teachers and Lions, Giving and Receiving, Return to the One; Thieves " +
      "of the Way, Entangling Chan, Quiet the Nine Spirits\". The nine-headed lion " +
      "\"recognized its master and dared not struggle; it lay down with all four feet on " +
      "the ground and did nothing but kowtow\"; \"the lion keeper ran over from the side " +
      "and grabbed it by the neck mane\"; Wukong stands on the high cliff laughing.",
    evaluationCriteria:
      "Full credit: In the center of the frame the blue-gray nine-headed lion, all nine " +
      "heads intact, lies down kowtowing, on the left of the frame the Heavenly Worthy " +
      "shouts his command, slightly back in the center of the frame the lion keeper grabs " +
      "the mane with fist raised, and at the upper right Wukong watches from the cliff, " +
      "laughing; the cloud vapor, the stream water, and the mane and garment sashes loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: Drawn as the Nine-Headed Beast " +
      "or as one big head with eight small heads; the Heavenly Worthy riding the lion; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-091": {
    coreKey:
      "Gold Lantern Bridge on the Lantern Festival night: three Buddha forms in the wind " +
      "close in on the golden lanterns, the Tang Monk in plain clothes bows down at the top " +
      "of the bridge, and Wukong hastily pulls him back and exposes them",
    groundTruth:
      "Chapter 91, \"At Golden Level Prefecture They Watch the Lanterns on the Festival " +
      "Night; In Mysterious-Bloom Cave the Tang Monk Makes His Deposition\". On the night " +
      "of the fifteenth of the first month, three golden lanterns as big as vats stand on " +
      "Gold Lantern Bridge; a wind sounds in midair, \"and in the wind there indeed " +
      "appeared three Buddha forms, coming close to the lanterns\"; the Tang Monk \"ran up " +
      "to the top of the bridge and threw himself down to bow\", and Wukong hastily pulls " +
      "him back, saying, \"They must be demons\".",
    evaluationCriteria:
      "Full credit: At night three large gold-thread pavilion lanterns stand on the bridge, " +
      "at the top of the frame are the outlines of three golden Buddha forms, in the center " +
      "of the frame the Tang Monk in plain clothes bows down at the top of the bridge, and " +
      "on the right of the frame Wukong hastily pulls him back. Deductions: Rhinoceroses or " +
      "ox-headed demons drawn; the Buddha forms seated on lotus thrones; the Tang Monk " +
      "wearing a cassock or a Vairocana hat; Wukong holding the iron rod; drawn as daytime.",
  },
  "xiyou-anim-091": {
    coreKey:
      "Buddha forms appearing in the wind at Gold Lantern Bridge, with animated flickering " +
      "lantern light, revolving lanterns, and garment sashes and lantern tassels",
    groundTruth:
      "Chapter 91, \"At Golden Level Prefecture They Watch the Lanterns on the Festival " +
      "Night; In Mysterious-Bloom Cave the Tang Monk Makes His Deposition\". On the Lantern " +
      "Festival night three golden lanterns stand on Gold Lantern Bridge, \"and in the wind " +
      "there indeed appeared three Buddha forms, coming close to the lanterns\"; the Tang " +
      "Monk \"ran up to the top of the bridge and threw himself down to bow\", and Wukong " +
      "hastily pulls him back and exposes them: \"They must be demons\".",
    evaluationCriteria:
      "Full credit: Three large gold-thread pavilion lanterns stand on the bridge, at the " +
      "top of the frame are the outlines of three golden Buddha forms, in the center of the " +
      "frame the Tang Monk in plain clothes bows down at the top of the bridge, and on the " +
      "right of the frame Wukong reaches out and hastily pulls him back; the flickering " +
      "lantern light, the revolving lanterns, and the garment sashes and lantern tassels " +
      "loop smoothly, driven by SMIL or inline CSS. Deductions: Rhinoceroses or ox-headed " +
      "demons drawn; the Tang Monk wearing a cassock or a Vairocana hat; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-092": {
    coreKey:
      "Mysterious-Bloom Cave at the third watch of night: Bajie swings his rake and smashes " +
      "the stone doors, ox-headed little demons tumble away in flight, and Wukong and Sha " +
      "Wujing wait on either side, ready for battle",
    groundTruth:
      "Chapter 92, \"Three Monks Fight a Great Battle on Green Dragon Mountain; Four Stars " +
      "Seize the Rhinoceros Monsters\". \"It was then about the third watch, and the moon " +
      "in midsky was as bright as day\"; Bajie \"raised his rake and struck with all his " +
      "might, smashing the stone doors to pieces\", while Wukong and Sha Wujing wait at the " +
      "sides, ready for battle; the little demons in the cave are ox-headed goblins.",
    evaluationCriteria:
      "Full credit: On a moonlit night, in the center of the frame Bajie swings his rake " +
      "and smashes the stone doors, ox-headed little demons tumble away in flight inside " +
      "the doors, on the left of the frame Wukong holds his rod, and on the right of the " +
      "frame Sha Wujing holds his staff. Deductions: The rhinoceros true forms, rhinoceros " +
      "horns, or the three demon kings drawn; the little demons drawn as rhinoceroses; the " +
      "Four Wood Stars or other heavenly generals appearing; blood drawn; drawn as daytime.",
  },
  "xiyou-anim-092": {
    coreKey:
      "Bajie smashing the stone doors, with animated rock fragments and dust, vines and " +
      "pine branches, and garment hems and kilt edge",
    groundTruth:
      "Chapter 92, \"Three Monks Fight a Great Battle on Green Dragon Mountain; Four Stars " +
      "Seize the Rhinoceros Monsters\". \"It was then about the third watch, and the moon " +
      "in midsky was as bright as day\"; Bajie \"raised his rake and struck with all his " +
      "might, smashing the stone doors to pieces\", and the ox-headed goblin demons in the " +
      "cave start up in alarm.",
    evaluationCriteria:
      "Full credit: On a moonlit night, in the center of the frame Bajie swings his rake " +
      "and smashes the stone doors, ox-headed little demons tumble away in flight inside " +
      "the doors, on the left of the frame Wukong holds his rod, and on the right of the " +
      "frame Sha Wujing holds his staff; the rock fragments and dust, the vines and pine " +
      "branches, and the garment hems and kilt edge loop smoothly, driven by SMIL or inline " +
      "CSS. Deductions: Rhinoceroses, rhinoceros horns, or heavenly generals drawn; blood " +
      "drawn; whole figures drifting; a purely static image, use of JavaScript, or XML " +
      "parse errors.",
  },
  "xiyou-093": {
    coreKey:
      "Tossing the ball from the festooned tower: the princess throws the embroidered ball " +
      "down from the tower window, knocking the Tang Monk's Vairocana hat askew, the Tang " +
      "Monk steadies the ball with both hands, and Wukong is beside him",
    groundTruth:
      "Chapter 93, \"At Anathapindada's Garden They Ask of the Past and Discuss Causes; At " +
      "Audience with the King of India He Meets a Mate\". A festooned tower is built high " +
      "at the crossroads; \"just at the third quarter of the noon hour\", the princess " +
      "\"with her own hand threw\" the embroidered ball \"onto the Tang Monk's head\"; \"the " +
      "Tang Monk was startled; it knocked his Vairocana hat askew, and with both hands he " +
      "hastily held on to the ball\"; the clothing and caps of India are the same as those " +
      "of the Great Tang.",
    evaluationCriteria:
      "Full credit: At the upper right of the frame is a Han-style festooned tower, in " +
      "whose window the princess in palace dress, with a dignified air, has both hands stretched " +
      "forward as if she has just tossed the ball; at " +
      "the lower center of the frame the Tang Monk, in a Vairocana hat and cassock, has his " +
      "hat knocked askew by the embroidered ball and steadies the ball with both hands; at " +
      "the lower left of the frame Wukong holds the travel-rescript pouch. Deductions: " +
      "Indian-style architecture or clothing drawn; the princess " +
      "in a golden-orange or rose-red long gown or with crescent-moon makeup, or with a " +
      "frivolous air; the Tang Monk's hat sitting straight.",
  },
  "xiyou-anim-093": {
    coreKey:
      "The embroidered ball from the festooned tower striking the monk's hat, with " +
      "animated silk streamers and drapes, incense smoke, and ball tassels",
    groundTruth:
      "Chapter 93, \"At Anathapindada's Garden They Ask of the Past and Discuss Causes; At " +
      "Audience with the King of India He Meets a Mate\". \"Just at the third quarter of " +
      "the noon hour\", the princess lights incense and prays, then \"with her own hand " +
      "threw\" the embroidered ball \"onto the Tang Monk's head\"; \"it knocked his " +
      "Vairocana hat askew, and with both hands he hastily held on to the ball\"; the " +
      "clothing, caps, and palaces of India are the same as those of the Great Tang.",
    evaluationCriteria:
      "Full credit: At the upper right of the frame are the Han-style festooned tower and " +
      "the princess in palace dress, at the lower center of the frame the Tang Monk, in a " +
      "Vairocana hat and cassock, has his hat knocked askew by the embroidered ball and " +
      "steadies the ball with both hands, and at the lower left of the frame Wukong holds " +
      "the travel-rescript pouch; the silk streamers and drapes, the incense smoke, and the " +
      "tassels loop smoothly, driven by SMIL or inline CSS. Deductions: " +
      "Indian-style clothing drawn; whole figures drifting; a purely static image, " +
      "use of JavaScript, or XML parse errors.",
  },
  "xiyou-094": {
    coreKey:
      "Huayi Pavilion in the imperial garden: the king sits in attendance as the Tang Monk " +
      "in plain clothes takes up the brush to match poems on the four-season golden " +
      "screens, with garden scenery and musicians outside the pavilion",
    groundTruth:
      "Chapter 94, \"Four Monks Feast and Make Merry in the Imperial Garden; One Monster " +
      "Vainly Cherishes Lustful Joy\". The king takes the Tang Monk up into Huayi Pavilion, " +
      "while the three disciples are separately in the Spring-Keeping Pavilion; \"while " +
      "seated, he saw four golden screens hanging on the wall, painted with the four scenes " +
      "of spring, summer, autumn, and winter\"; the king asks him to write matching poems, " +
      "and \"the elder gladly did not decline, and took up the brush to match them\".",
    evaluationCriteria:
      "Full credit: On the left of the frame, inside the pavilion, are four golden screens " +
      "of the four seasons, the Tang Monk in plain clothes takes up the brush to match the " +
      "poems, and the king in Han-style clothing and cap is beside him; on the right of the " +
      "frame is a garden scene of winding streams, flowers, and trees. Deductions: Wukong, " +
      "Bajie, or Sha Wujing in the pavilion, or all four pilgrims at the same table; the " +
      "princess appearing; the Tang Monk wearing a cassock or a Vairocana hat; Indian-style " +
      "palaces or clothing drawn.",
  },
  "xiyou-anim-094": {
    coreKey:
      "Matching poems on the golden screens in Huayi Pavilion, with animated flowing water " +
      "and swimming fish, willow twigs and falling petals, and incense smoke from the burner",
    groundTruth:
      "Chapter 94, \"Four Monks Feast and Make Merry in the Imperial Garden; One Monster " +
      "Vainly Cherishes Lustful Joy\". The king takes the Tang Monk up into Huayi Pavilion, " +
      "while the three disciples are separately in the Spring-Keeping Pavilion; the Tang " +
      "Monk sees \"four golden screens hanging on the wall, painted with the four scenes of " +
      "spring, summer, autumn, and winter\", and at the king's request \"took up the brush " +
      "to match them\".",
    evaluationCriteria:
      "Full credit: On the left of the frame, inside the pavilion, are the four-season " +
      "golden screens, the Tang Monk in plain clothes takes up the brush to match the " +
      "poems, and the king in Han-style clothing and cap is beside him, and on the right of " +
      "the frame are the winding stream, the dragon pool, and flowers and trees; the " +
      "flowing water and swimming fish, the willow twigs and falling petals, and the " +
      "incense smoke loop smoothly, driven by SMIL or inline CSS. Deductions: Wukong, " +
      "Bajie, or Sha Wujing in the pavilion; the princess appearing; the Tang Monk wearing " +
      "a cassock or a Vairocana hat; whole figures drifting; a purely static image, use of " +
      "JavaScript, or XML parse errors.",
  },
  "xiyou-095": {
    coreKey:
      "Above Maoying Mountain: the Star Lord of the Great Yin descends on a cloud with her " +
      "fairies and calls out a command, the Jade Hare shows its true form with white fur " +
      "and red eyes, and Wukong puts away his rod and salutes",
    groundTruth:
      "Chapter 95, \"False Joined to True Form, the Jade Hare Is Caught; True Yin Returns " +
      "to the Right and Meets the Spirit Source\". At dusk the Star Lord of the Great Yin, " +
      "leading the Chang'e fairies, descends on colored clouds, stops Wukong, and orders " +
      "the hare to return to the right; \"the Jade Hare rolled over and showed its true " +
      "form\": \"a split lip and pointed teeth, long ears and sparse whiskers\", \"its two " +
      "eyes glowing red\"; Chang'e is the collective name for the attendant fairies.",
    evaluationCriteria:
      "Full credit: At the upper left of the frame the Star Lord of the Great Yin rides " +
      "colored clouds and points at the Jade Hare, with fairies following behind her; at " +
      "the lower center of the frame the white-furred, red-eyed, long-eared Jade Hare " +
      "crouches on a cloud, with the white jade pestle beside it; on the right of the frame " +
      "Wukong puts away his rod and bows. Deductions: The princess's appearance, nudity, or " +
      "fighting drawn; Wukong raising his rod; the Star Lord of the Great Yin holding the " +
      "Jade Hare in her arms or drawn as Chang'e flying to the moon; the Jade Hare wearing " +
      "human clothes.",
  },
  "xiyou-anim-095": {
    coreKey:
      "The Star Lord of the Great Yin taking back the Jade Hare, with animated colored " +
      "clouds and sunset glow, ribbons and sleeves, and hare fur and long whiskers",
    groundTruth:
      "Chapter 95, \"False Joined to True Form, the Jade Hare Is Caught; True Yin Returns " +
      "to the Right and Meets the Spirit Source\". At dusk the Star Lord of the Great Yin, " +
      "leading the Chang'e fairies, descends on colored clouds and orders the hare to " +
      "return to the right; \"the Jade Hare rolled over and showed its true form\", with " +
      "\"long ears and sparse whiskers\" and \"its two eyes glowing red\"; Wukong puts away " +
      "his rod and salutes.",
    evaluationCriteria:
      "Full credit: At the upper left of the frame the Star Lord of the Great Yin rides " +
      "colored clouds and points at the Jade Hare, with fairies behind her, at the bottom " +
      "of the frame the white-furred, red-eyed Jade Hare crouches on a cloud, and on the " +
      "right of the frame Wukong puts away his rod and bows; the colored clouds, the " +
      "ribbons and sleeves, and the hare fur and long whiskers loop smoothly, driven by " +
      "SMIL or inline CSS. Deductions: The princess's appearance, nudity, or fighting " +
      "drawn; the Jade Hare wearing human clothes; whole figures drifting; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-096": {
    coreKey:
      "Farewell feast at the Ten-Li Pavilion: the squire, in tears, raises his cup, loath " +
      "to part, the Tang Monk in plain clothes leans on his staff and gives thanks, and " +
      "colored banners and musicians see them off",
    groundTruth:
      "Chapter 96, \"Squire Kou Gladly Entertains the Eminent Monks; Elder Tang Does Not " +
      "Covet Wealth and Rank\". The squire prepares colored banners, drums and music, and " +
      "two ranks of Buddhist monks and Taoists to see them off; \"when they reached the " +
      "Ten-Li Pavilion, baskets of food and pots of drink were again set out, and raising " +
      "cups and holding goblets, they drank together and parted\"; \"the squire still " +
      "could not bear to let them go and said, holding back tears\"; Bajie has both sleeves " +
      "stuffed with pastries.",
    evaluationCriteria:
      "Full credit: In the center of the frame, in the pavilion, the white-haired squire " +
      "raises his cup in tears, and the Tang Monk in plain clothes leans on his staff and " +
      "raises one palm upright in thanks; on the left of the frame Bajie carries the load " +
      "on a pole and Wukong wears the travel-rescript pouch; at the right rear colored " +
      "banners and musicians see them off. Deductions: The \"Ten Thousand Monks Not " +
      "Refused\" sign, the squire's wife and children, or robbers drawn; the Tang Monk " +
      "wearing a cassock or a Vairocana hat; drawn as a rainy day.",
  },
  "xiyou-anim-096": {
    coreKey:
      "Farewell to the squire at the Ten-Li Pavilion, with animated colored banners and " +
      "jeweled canopies, willow branches, and road dust",
    groundTruth:
      "Chapter 96, \"Squire Kou Gladly Entertains the Eminent Monks; Elder Tang Does Not " +
      "Covet Wealth and Rank\". The squire prepares colored banners, drums, and music to " +
      "see them off; \"when they reached the Ten-Li Pavilion, baskets of food and pots of " +
      "drink were again set out, and raising cups and holding goblets, they drank together " +
      "and parted\"; \"the squire still could not bear to let them go and said, holding " +
      "back tears\".",
    evaluationCriteria:
      "Full credit: In the center of the frame, in the pavilion, the white-haired squire " +
      "raises his cup in tears and the Tang Monk in plain clothes leans on his staff and " +
      "gives thanks, on the left of the frame Bajie carries the load on a pole and Wukong " +
      "wears the travel-rescript pouch, and at the right rear is the procession seeing them " +
      "off; the colored banners and jeweled canopies, the willow branches, and the road " +
      "dust loop smoothly, driven by SMIL or inline CSS. Deductions: The squire's wife and " +
      "children or robbers drawn; the Tang Monk wearing a cassock; whole figures drifting; " +
      "a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-097": {
    coreKey:
      "The immobilizing spell on the main road: Wukong tosses dirt upward and recites a " +
      "spell, the robbers in short jackets, teeth clenched and eyes wide, stand rigidly " +
      "frozen, and master and disciples are in the distance",
    groundTruth:
      "Chapter 97, \"Gold Rewards the Lay Patron, Who Meets Demonic Harm; The Sage " +
      "Manifests the Departed Soul to Save the Original Life\". Some thirty robbers block " +
      "the road, and the Tang Monk and the others have already been let pass; Wukong " +
      "\"grabbed a handful of dirt from the ground, tossed it upward, and recited a " +
      "spell\", and the robbers \"one by one, teeth clenched, eyes wide open, hands spread, " +
      "stood rigidly still\".",
    evaluationCriteria:
      "Full credit: In the center of the frame Wukong, beside the bundle, tosses a handful " +
      "of dirt upward; on the right of the frame the robbers in short jackets stand in a " +
      "row, frozen with arms spread; far off at the upper right of the frame the Tang Monk " +
      "rides the horse, with Bajie and Sha Wujing following. Deductions: The robbers drawn " +
      "as blue-faced, fanged demons; blood, torches, or government soldiers drawn; Wukong " +
      "fighting with his rod.",
  },
  "xiyou-anim-097": {
    coreKey:
      "Wukong scattering dirt to immobilize the robbers, with animated dust, mane, tail, " +
      "and garment sashes, and roadside plants",
    groundTruth:
      "Chapter 97, \"Gold Rewards the Lay Patron, Who Meets Demonic Harm; The Sage " +
      "Manifests the Departed Soul to Save the Original Life\". Robbers block the road; " +
      "Wukong \"grabbed a handful of dirt from the ground, tossed it upward, and recited a " +
      "spell\", and the robbers \"one by one, teeth clenched, eyes wide open, hands spread, " +
      "stood rigidly still\"; the Tang Monk and the others had already been let pass.",
    evaluationCriteria:
      "Full credit: In the center of the frame Wukong tosses a handful of dirt upward, on " +
      "the right of the frame the robbers in short jackets stand in a row, rigidly frozen, " +
      "and far off at the upper right of the frame the Tang Monk rides the horse, with " +
      "Bajie and Sha Wujing following; the dust, the mane, tail, and garment sashes, and " +
      "the plants loop smoothly, driven by SMIL or inline CSS. Deductions: The robbers " +
      "drawn as demons; blood drawn; Wukong holding his rod; whole figures drifting; a " +
      "purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-098": {
    coreKey:
      "Boarding at Cloud-Transcending Ferry: at one push from Wukong, the Tang Monk in his " +
      "cassock tumbles toward the water, the plainly dressed boatman pulls him up with one " +
      "grab, and the boat has no bottom",
    groundTruth:
      "Chapter 98, \"Only When the Ape Is Ripe and the Horse Tamed Do They Shed Their " +
      "Shells; With Merit Achieved and Deeds Fulfilled They See Suchness\". From downstream " +
      "is poled \"a bottomless boat\"; the boatman is the Welcoming Buddha, but Wukong does " +
      "not give this away; \"Pilgrim braced his arms and gave a push upward\", and the Tang " +
      "Monk \"fell into the water, but was at once pulled up by the boatman with one " +
      "grab\".",
    evaluationCriteria:
      "Full credit: In the center of the frame is the narrow bottomless boat, where the " +
      "plainly dressed boatman holds the pole and grabs the Tang Monk, who, in a Vairocana " +
      "hat and the brocade cassock and gripping his monk's staff, pitches forward; on the " +
      "bank on the left of the frame Wukong is in a pushing posture and Bajie looks on; the " +
      "single-log bridge and the auspicious light in the distance are recognizable. " +
      "Deductions: The corpse floating downstream drawn; the boatman with a Buddha's halo " +
      "or drawn as a Buddha image with a golden body and yellow face; the boat drawn as a " +
      "raft or a sinking boat; the Tang Monk without the hat or without the cassock.",
  },
  "xiyou-anim-098": {
    coreKey:
      "The bottomless boat at Cloud-Transcending Ferry, with animated rolling waves and " +
      "ripples, splashes at the pole, and auspicious light over Spirit Mountain",
    groundTruth:
      "Chapter 98, \"Only When the Ape Is Ripe and the Horse Tamed Do They Shed Their " +
      "Shells; With Merit Achieved and Deeds Fulfilled They See Suchness\". The water at " +
      "Cloud-Transcending Ferry is wide and the waves rough, and from downstream is poled " +
      "\"a bottomless boat\"; \"Pilgrim braced his arms and gave a push upward\", and the " +
      "Tang Monk \"fell into the water, but was at once pulled up by the boatman with one " +
      "grab\".",
    evaluationCriteria:
      "Full credit: In the center of the frame is the narrow bottomless boat, where the " +
      "plainly dressed boatman holds the pole and grabs the Tang Monk, who, in a Vairocana " +
      "hat and the brocade cassock, pitches forward, and on the left of the frame Wukong is " +
      "in a pushing posture and Bajie looks on; the rolling waves and ripples, the splashes " +
      "at the pole, and the auspicious light loop smoothly, driven by SMIL or inline CSS. " +
      "Deductions: The corpse floating downstream drawn; the boatman with a Buddha's halo; " +
      "whole figures drifting; a purely static image, use of JavaScript, or XML parse " +
      "errors.",
  },
  "xiyou-099": {
    coreKey:
      "Drying the scriptures on a high cliff by the River of Heaven: after the wind and " +
      "thunder the sun shines high, the four pilgrims spread out the wet scriptures, and " +
      "clothes and shoes dry at the cliff's edge",
    groundTruth:
      "Chapter 99, \"When Nine Times Nine Is Complete, the Demons Are Wiped Out; When Three " +
      "Times Three Is Fulfilled, the Way Returns to Its Root\". The old turtle sinks into " +
      "the water, and the scripture bundles and clothes are all soaked; after the wind, " +
      "fog, thunder, and lightning the sun shines high, and \"they moved the scriptures " +
      "onto a high cliff and opened the bundles to dry them in the sun\"; \"they also " +
      "spread their clothes and shoes to dry beside the cliff, some standing, some " +
      "sitting, some jumping\".",
    evaluationCriteria:
      "Full credit: On a sunny day, on the rock ledge of a high cliff above the river, " +
      "scriptures are spread out and clothes and shoes are drying; in the center of the " +
      "frame the Tang Monk inspects the scriptures, Sha Wujing sits, Bajie stands, and " +
      "Wukong jumps, with the white horse below the cliff. Deductions: The old turtle, " +
      "thunder and lightning, or yin demons drawn; figures naked; the Tang Monk wearing a " +
      "cassock or a Vairocana hat; drawn as a sutra-drying terrace with ancient cypresses " +
      "and sutra banners.",
  },
  "xiyou-anim-099": {
    coreKey:
      "Drying the scriptures on the cliff by the River of Heaven, with animated shimmering " +
      "water and spray, scripture pages and robes, and rising vapor",
    groundTruth:
      "Chapter 99, \"When Nine Times Nine Is Complete, the Demons Are Wiped Out; When Three " +
      "Times Three Is Fulfilled, the Way Returns to Its Root\". The scripture bundles and " +
      "clothes have been soaked by the river; with the sun shining high, \"they moved the " +
      "scriptures onto a high cliff and opened the bundles to dry them in the sun\", \"some " +
      "standing, some sitting, some jumping\".",
    evaluationCriteria:
      "Full credit: On a sunny day, on the rock ledge of a high cliff, scriptures are " +
      "spread out and clothes and shoes are drying, and in the center of the frame the Tang " +
      "Monk inspects the scriptures, while Sha Wujing sits, Bajie stands, and Wukong jumps; " +
      "the shimmering water and spray, the scripture pages and robes, and the vapor loop " +
      "smoothly, driven by SMIL or inline CSS. Deductions: The old turtle or thunder and " +
      "lightning drawn; figures naked; the Tang Monk wearing a cassock; whole figures " +
      "drifting; a purely static image, use of JavaScript, or XML parse errors.",
  },
  "xiyou-100": {
    coreKey:
      "The white dragon coiled on the huabiao column inside the monastery gate on Spirit " +
      "Mountain: the white dragon with golden scales and silver whiskers wraps the column, " +
      "Wukong feels his head and finds the golden fillet gone, and the Tang Monk is beside " +
      "him",
    groundTruth:
      "Chapter 100, \"Going Straight Back to the Eastern Land; Five Sages Attain Truth\". " +
      "In the Dragon-Transforming Pool the white horse \"shed its hair and hide, changed " +
      "its head and horns, grew golden scales all over its body, and sprouted silver " +
      "whiskers beneath its cheeks and chin\", and \"coiled itself around the " +
      "sky-supporting huabiao column inside the monastery gate\"; Wukong asks for the " +
      "fillet-loosening spell to be recited, and \"Pilgrim raised his hand to feel for it, " +
      "and indeed it was gone\".",
    evaluationCriteria:
      "Full credit: In the very center of the frame the two-horned white dragon with golden " +
      "scales and silver whiskers coils on the huabiao column; at the lower right of the " +
      "frame Wukong raises his hand to feel his head, with no golden fillet on it; at the " +
      "lower left of the frame the Tang Monk in plain clothes looks serene; behind them are " +
      "auspicious clouds and small figures of the Buddhas. Deductions: Wukong still " +
      "wearing the golden fillet; the Tang Monk or Wukong drawn as a golden-bodied Buddha " +
      "image, seated on a lotus throne, or given a head halo; Bajie, Sha Wujing, or the " +
      "white horse in horse form drawn; the dragon not wrapped around the column.",
  },
  "xiyou-anim-100": {
    coreKey:
      "The white dragon coiling the column as Wukong feels his head, with animated " +
      "auspicious clouds, dragon whiskers and mane, and pines, cypresses, and falling " +
      "blossoms",
    groundTruth:
      "Chapter 100, \"Going Straight Back to the Eastern Land; Five Sages Attain Truth\". " +
      "The white horse becomes a dragon, \"grew golden scales all over its body, and " +
      "sprouted silver whiskers beneath its cheeks and chin\", and \"coiled itself around " +
      "the sky-supporting huabiao column inside the monastery gate\"; Wukong \"raised his " +
      "hand to feel for it, and indeed it was gone\": the golden fillet has disappeared.",
    evaluationCriteria:
      "Full credit: In the very center of the frame the two-horned white dragon with golden " +
      "scales and silver whiskers coils on the huabiao column, at the lower right of the " +
      "frame Wukong raises his hand to feel his head, with no golden fillet on it, and at " +
      "the lower left of the frame is the Tang Monk in plain clothes; the auspicious " +
      "clouds, the dragon whiskers and mane, and the pines, cypresses, and falling " +
      "blossoms loop smoothly, driven by SMIL or inline CSS. Deductions: Wukong still " +
      "wearing the golden fillet; drawn with golden bodies and lotus thrones; Bajie or Sha " +
      "Wujing drawn; the figures or the dragon's body drifting as a whole; a purely static " +
      "image, use of JavaScript, or XML parse errors.",
  },
};
