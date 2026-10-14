/**
 * 54 道内置题目与 300 条候选的英文标题映射表与双语括号提取器。
 *
 * 注意：此模块处于 src/core/prompts/ 下，仅用于人类可读的 UI 展示，绝不改动题面原文。
 */

import type { Locale } from "../../../i18n/types";

/** 题组与特殊单题的显式英文标题 */
export const PROMPT_LABELS_EN: Readonly<Record<string, string>> = {
  "classic-v1": "Classic Pelican on a Bicycle",
  "upgraded-v2": "Upgraded Pelican (2025-11)",
  "animated-pelican-v1": "Animated Pelican on a Bicycle",
  "clock-v1": "Clock Spatial Geometry (3:45)",
  "penrose-v1": "Penrose Impossible Triangle",
  "ice-water-v1": "Floating Ice in Glass (Archimedes)",
  "shuihu-v1": "Water Margin · 10 Classic Scenes",
  "shuihu-anim-v1": "Water Margin · 10 Animated Scenes",
  "xiyou-v1": "Journey to the West · 10 Classic Scenes",
  "xiyou-anim-v1": "Journey to the West · 10 Animated Scenes",
  "sanguo-v1": "Romance of the Three Kingdoms · 10 Classic Scenes",
  "sanguo-anim-v1": "Romance of the Three Kingdoms · 10 Animated Scenes",
  "honglou-v1": "Dream of the Red Chamber · 10 Classic Scenes",
  "honglou-anim-v1": "Dream of the Red Chamber · 10 Animated Scenes",
  "landmarks-v1": "World City Landmarks · 40 Miniatures",
  "landmarks-anim-v1": "Animated World City Landmarks · 40 Miniatures",
  "fe-ai-v1": "FE-1: AI Compute & Physical AI (10-Prompt Suite)",
  "fe-semi-v1": "FE-2: Sub-Angstrom Semiconductor & Photonics (10-Prompt Suite)",
  "fe-quantum-v1": "FE-3: Fault-Tolerant Quantum & Post-Quantum (10-Prompt Suite)",
  "fe-bio-v1": "FE-4: Engineered Biology & Molecular Machines (10-Prompt Suite)",
  "fe-energy-v1": "FE-5: Clean Fusion & Zero-Carbon Energy (10-Prompt Suite)",
  "fe-aero-v1": "FE-6: Commercial Spaceflight & Hypersonics (10-Prompt Suite)",
  "fe-meta-v1": "FE-7: Metamaterials & Nanofabrication (10-Prompt Suite)",
  "fe-neuro-v1": "FE-8: Neuroelectronics & Brain-Computer Interfaces (10-Prompt Suite)",
  "vfx-sim-v1": "VFX-1: Continuum Physics Simulation (10-Prompt Suite)",
  "vfx-optics-v1": "VFX-2: Wave Optics & Radiance Fields (10-Prompt Suite)",
  "vfx-geom-v1": "VFX-3: Discrete Differential Geometry & Topology (10-Prompt Suite)",
  "vfx-scivis-v1": "VFX-4: Multi-Physics Scientific Visualization (10-Prompt Suite)",
  "vfx-motion-v1": "VFX-5: Physics-Driven Character & Biomechanics CFX (10-Prompt Suite)",
  "vfx-sys-v1": "VFX-6: Virtual Production & Differentiable Rendering (10-Prompt Suite)",
};

/** 四大名著 40 回基础候选 ID → 英文标题（动态版 `-anim-` 自动追加 `(Animated)`） */
export const CLASSICS_CANDIDATES_EN: Readonly<Record<string, string>> = {
  "shuihu-003": "Ch. 3 · Lu Da Punches Butcher Zheng",
  "shuihu-007": "Ch. 7 · Uprooting the Weeping Willow",
  "shuihu-010": "Ch. 10 · Mountain Spirit Temple in the Blizzard",
  "shuihu-016": "Ch. 16 · Outwitting the Birthday Convoy",
  "shuihu-023": "Ch. 23 · Wu Song Fights the Tiger on Jingyang Ridge",
  "shuihu-038": "Ch. 38 · Brawl in the River with Zhang Shun",
  "shuihu-039": "Ch. 39 · Writing the Rebellious Poem at Xunyang Tower",
  "shuihu-040": "Ch. 40 · Raid on the Execution Ground",
  "shuihu-056": "Ch. 56 · Shi Qian Steals the Golden Armor",
  "shuihu-071": "Ch. 71 · The Stone Tablet from Heaven at Liangshan",
  "xiyou-001": "Ch. 1 · The Stone Monkey Enters Water-Curtain Cave",
  "xiyou-003": "Ch. 3 · Claiming the Golden-Hooped Rod at Dragon Palace",
  "xiyou-005": "Ch. 5 · Havoc in the Immortal Peach Garden",
  "xiyou-007": "Ch. 7 · Beneath the Buddha's Five-Finger Mountain",
  "xiyou-018": "Ch. 18 · Subduing Zhu Bajie at Gao Village",
  "xiyou-024": "Ch. 24 · Stealing the Ginseng Fruit",
  "xiyou-027": "Ch. 27 · Three Battles with the White Bone Demon",
  "xiyou-054": "Ch. 54 · The Kingdom of Women of Western Liang",
  "xiyou-058": "Ch. 58 · The True and False Monkey Kings",
  "xiyou-061": "Ch. 61 · Quenching the Flaming Mountains with the Plantain Fan",
  "sanguo-001": "Ch. 1 · Oath of the Peach Garden",
  "sanguo-005": "Ch. 5 · Three Heroes Battle Lü Bu at Hulao Pass",
  "sanguo-021": "Ch. 21 · Warming Wine and Discussing Heroes",
  "sanguo-037": "Ch. 37 · Three Visits to the Thatched Cottage",
  "sanguo-041": "Ch. 41 · Zhao Yun's Lone Ride at Changban",
  "sanguo-046": "Ch. 46 · Borrowing Arrows with Straw Boats",
  "sanguo-049": "Ch. 49 · Praying for the Southeastern Wind at Seven-Star Altar",
  "sanguo-050": "Ch. 50 · Ambush at Huarong Trail",
  "sanguo-075": "Ch. 75 · Scraping Poison from the Bone",
  "sanguo-095": "Ch. 95 · The Empty Fort Strategy",
  "honglou-003": "Ch. 3 · Lin Daiyu Enters the Rongguo Mansion",
  "honglou-005": "Ch. 5 · Dreaming of the Land of Illusion",
  "honglou-008": "Ch. 8 · Comparing the Magic Jade and Golden Locket",
  "honglou-017": "Ch. 17 · Imperial Consort Yuanchun's Home Visitation",
  "honglou-027": "Ch. 27 · Daiyu Buries the Fallen Blossoms",
  "honglou-031": "Ch. 31 · Qingwen Tears the Folding Fans",
  "honglou-040": "Ch. 40 · Granny Liu Tours Grand View Garden",
  "honglou-050": "Ch. 50 · Baoqin Stands in Snow Holding Red Plum Blossoms",
  "honglou-062": "Ch. 62 · Xiangyun Sleeps Drunk Among Peony Petals",
  "honglou-097": "Ch. 97 · Daiyu Burns Her Poems",
};

/** 城市地标 40 景基础 slug → 英文标题 */
export const LANDMARK_SLUGS_EN: Readonly<Record<string, string>> = {
  "paris-eiffel-tower": "Paris · Eiffel Tower",
  "london-tower-bridge": "London · Tower Bridge",
  "prague-charles-bridge": "Prague · Charles Bridge",
  "bruges-belfry": "Bruges · Belfry of Bruges",
  "beijing-temple-of-heaven": "Beijing · Hall of Prayer for Good Harvests",
  "kyoto-kiyomizu-dera": "Kyoto · Kiyomizu-dera Stage",
  "jaipur-hawa-mahal": "Jaipur · Hawa Mahal",
  "new-york-statue-of-liberty": "New York · Statue of Liberty",
  "rio-de-janeiro-sugarloaf-mountain": "Rio de Janeiro · Sugarloaf Mountain",
  "cape-town-table-mountain": "Cape Town · Table Mountain",
  "sydney-harbour-bridge": "Sydney · Sydney Harbour Bridge",
  "marrakesh-koutoubia-mosque": "Marrakesh · Koutoubia Mosque",
  "suzhou-tiger-hill-pagoda": "Suzhou · Tiger Hill Pagoda",
  "xian-giant-wild-goose-pagoda": "Xi'an · Giant Wild Goose Pagoda",
  "lisbon-belem-tower": "Lisbon · Belém Tower",
  "nara-todai-ji": "Nara · Tōdai-ji Great Buddha Hall",
  "budapest-fishermans-bastion": "Budapest · Fisherman's Bastion",
  "segovia-aqueduct": "Segovia · Roman Aqueduct",
  "montreal-notre-dame-basilica": "Montreal · Notre-Dame Basilica",
  "uyuni-salar-de-uyuni": "Uyuni · Salar de Uyuni",
  "salzburg-hohensalzburg-fortress": "Salzburg · Hohensalzburg Fortress",
  "carcassonne-cite": "Carcassonne · Medieval Citadel",
  "himeji-castle": "Himeji · Himeji Castle",
  "sousse-ribat": "Sousse · Ribat of Sousse",
  "pingyao-city-walls": "Pingyao · Ancient City Walls",
  "jaisalmer-fort": "Jaisalmer · Jaisalmer Golden Fort",
  "natal-forte-dos-reis-magos": "Natal · Forte dos Reis Magos",
  "brisbane-fort-lytton": "Brisbane · Fort Lytton",
  "avila-city-walls": "Ávila · Medieval Walls of Ávila",
  "san-francisco-fort-point": "San Francisco · Fort Point",
  "san-diego-uss-midway": "San Diego · USS Midway Carrier",
  "portsmouth-uss-albacore": "Portsmouth · USS Albacore Submarine",
  "sahuarita-titan-missile-museum": "Sahuarita · Titan Missile Museum",
  "tillamook-hangar-b": "Tillamook · Airship Hangar B",
  "bedford-cardington-sheds": "Bedford · Cardington Airship Sheds",
  "thames-estuary-knock-john-fort": "Thames Estuary · Knock John Naval Fort",
  "wall-minuteman-delta-09": "Wall · Minuteman Missile Silo Delta-09",
  "ottawa-diefenbunker": "Ottawa · Diefenbunker Cold War Museum",
  "melbourne-hmas-castlemaine": "Melbourne · HMAS Castlemaine Corvette",
  "fremantle-hmas-ovens": "Fremantle · HMAS Ovens Submarine",
};

/**
 * 从 `中文名 (English Name)` 或 `中文名（English Name）` 格式中提取指定语言标题。
 */
export function splitParenthesizedLabel(
  rawLabel: string,
  locale: Locale,
): string | null {
  const match = rawLabel.match(/^(.+?)\s*[（(]([A-Za-z0-9][^）)]+)[）)]\s*$/);
  if (!match) return null;
  const zhPart = match[1]?.trim() ?? rawLabel;
  const enPart = match[2]?.trim() ?? rawLabel;
  return locale === "en" ? enPart : zhPart;
}

/**
 * 从 FE/VFX 候选题面原文首句提取英文技术标题。
 */
export function extractEnglishFromPromptText(text?: string): string | null {
  if (!text) return null;
  const m = text.match(
    /^Generate an SVG technical visualization of (.+?) (?:using|as) /,
  );
  return m?.[1]?.trim() ?? null;
}
