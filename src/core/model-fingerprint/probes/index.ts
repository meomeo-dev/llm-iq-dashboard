/**
 * 探针单例注册表与查找入口
 */

import { PROBE_IDS, type ProbeId } from "../types";
import { Probe, buildBigrams, countDistinctChars } from "./base";
import { RegexPromptCodec, type PromptCodec, type PromptTemplateSource } from "./codec";
import { NumberProbe } from "./number";
import { PaletteProbe } from "./palette";
import { SeedProbe } from "./seed";
import { UuidProbe } from "./uuid";
import { WordsEnProbe } from "./words-en";
import { WordsZhProbe } from "./words-zh";

export {
  Probe,
  RegexPromptCodec,
  UuidProbe,
  NumberProbe,
  SeedProbe,
  PaletteProbe,
  WordsEnProbe,
  WordsZhProbe,
  buildBigrams,
  countDistinctChars,
  type PromptCodec,
  type PromptTemplateSource,
};

export const PROBES: Readonly<Record<ProbeId, Probe>> = {
  uuid: new UuidProbe(),
  number: new NumberProbe(),
  seed: new SeedProbe(),
  palette: new PaletteProbe(),
  "words-en": new WordsEnProbe(),
  "words-zh": new WordsZhProbe(),
};

export function getProbe(id: ProbeId): Probe {
  return PROBES[id];
}

export function listProbes(ids: readonly ProbeId[] = PROBE_IDS): Probe[] {
  return ids.map((id) => PROBES[id]);
}
