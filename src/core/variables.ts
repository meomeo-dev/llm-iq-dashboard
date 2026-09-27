/**
 * 提示词变量引擎，兼管候选集的轮换抽取（pickCandidate）。轮换题面用于防止缓存
 * 命中或针对单题的优化抬高成绩。
 *
 * 取值方式：
 * - `sequence` 顺序轮换，游标持久化；推荐默认，N 轮内必定覆盖全部取值。
 * - `random`   随机取值，适合取值集大、不在乎覆盖顺序的场景。
 * - `shuffle`  洗牌后依次取，一遍取完前不重复，相邻两遍交界处也不重复。
 * - `fixed`    固定取第一个值，用于隔离其他变量的对比。
 *
 * 轮换周期（rotation）为 `day` 时同一天各轮共用一组取值，为 `run` 时每轮都换。
 * 当前周期的取值与游标一起落盘，重启或中断后重跑沿用同一组取值。
 * 落不落盘由调用方按 RotationLedger 决定：只预览的一次不推进游标、不确立周期取值。
 */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { dataRoot } from "./paths";

export type VariableMode = "fixed" | "random" | "sequence" | "shuffle";

export interface VariableSpec {
  name: string;
  mode: VariableMode;
  /** 候选取值。fixed 模式取第一个 */
  values: readonly string[];
}

export type RotationPeriod = "run" | "day";

export interface RotationConfig {
  /** 取值多久换一次 */
  period: RotationPeriod;
  /** 按哪个时区划分“一天”（IANA 时区名） */
  timeZone: string;
}

/**
 * 本次取值是否记入轮换状态。advance：落盘，推进游标并确立本周期取值；
 * preview：同样算出下一格给本次使用，但不落盘，轮换序列不受这一次影响。
 */
export type RotationLedger = "advance" | "preview";

/** 一次取值所需的轮换上下文 */
export interface RotationDraw {
  rotation: RotationConfig;
  now: Date;
  ledger: RotationLedger;
}

/** 一次渲染的产物：最终文本 + 本次每个变量的取值 */
export interface RenderedPrompt {
  promptId: string;
  text: string;
  bindings: Record<string, string>;
}

/** sequence 模式的游标存档：键为 `<promptId>:<变量名>` */
type CursorStore = Record<string, number>;

/** 某条提示词在当前周期里的取值 */
interface PeriodBindings {
  /** 周期键：day 为所选时区下的日期 YYYY-MM-DD；run 为 null（每轮都换） */
  periodKey: string | null;
  bindings: Record<string, string>;
  pickedAt: string;
}

/** 落盘的全部变量状态：游标 + 洗牌顺序 + 各提示词当前周期的取值 */
interface VariableState {
  /** sequence 的下一个下标；shuffle 的牌堆内位置 */
  cursors: CursorStore;
  /** shuffle 的当前牌堆：取值下标的一个随机排列，键同 cursors */
  bags: Record<string, number[]>;
  periods: Record<string, PeriodBindings>;
}

const STATE_FILE = "variable-state.json";
/** 旧版只存游标的状态文件；STATE_FILE 不存在时从它继承游标，不改写 */
const LEGACY_CURSOR_FILE = "variable-cursors.json";

/** 渲染一条提示词。无变量时逐字返回模板、bindings 为空，不可变条目依赖这一点 */
export async function renderPrompt(
  promptId: string,
  template: string,
  variables: readonly VariableSpec[],
  draw: RotationDraw,
): Promise<RenderedPrompt> {
  if (variables.length === 0) {
    return { promptId, text: template, bindings: {} };
  }

  const { rotation, now, ledger } = draw;
  const state = await readState();
  const periodKey = rotationKey(rotation, now);
  const kept = state.periods[promptId];
  // 同一周期沿用已落盘的取值；run 周期的键为 null，永远视为新周期
  const reusable = periodKey !== null && kept?.periodKey === periodKey ? kept.bindings : {};
  const bindings: Record<string, string> = {};

  for (const spec of variables) {
    const picked = stillValid(spec, reusable[spec.name]) ?? pick(promptId, spec, state);
    if (picked !== null) bindings[spec.name] = picked;
  }

  state.periods[promptId] = { periodKey, bindings, pickedAt: now.toISOString() };
  if (ledger === "advance") await writeState(state);
  return { promptId, text: substitute(template, bindings), bindings };
}

/** 候选集抽取在状态文件里的键名：periods[promptId].bindings[CANDIDATE_KEY] 为候选 id */
const CANDIDATE_KEY = "candidate";

/**
 * 抽出本周期的候选 id。同一周期内沿用已抽中的一条（它已不在候选集中时重抽）；
 * 换周期时按 shuffle 规则从牌堆取下一张。
 */
export async function pickCandidate(
  promptId: string,
  candidateIds: readonly string[],
  draw: RotationDraw,
): Promise<string> {
  if (candidateIds.length === 0) throw new Error(`提示词 ${promptId} 的候选集为空`);
  const { rotation, now, ledger } = draw;
  const state = await readState();
  const periodKey = rotationKey(rotation, now);
  const kept = state.periods[promptId];
  const keptId = periodKey !== null && kept?.periodKey === periodKey ? kept.bindings[CANDIDATE_KEY] : undefined;
  const picked =
    keptId !== undefined && candidateIds.includes(keptId)
      ? keptId
      : drawFromBag(`${promptId}:${CANDIDATE_KEY}`, candidateIds, state);

  state.periods[promptId] = { periodKey, bindings: { [CANDIDATE_KEY]: picked }, pickedAt: now.toISOString() };
  if (ledger === "advance") await writeState(state);
  return picked;
}

/** 周期键，同键各轮共用取值。day 取配置时区下的日期（en-CA 格式即 YYYY-MM-DD） */
export function rotationKey(rotation: RotationConfig, now: Date): string | null {
  if (rotation.period === "run") return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: rotation.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** 沿用的取值须仍符合当前配置；不符合时只重取该变量 */
function stillValid(spec: VariableSpec, kept: string | undefined): string | null {
  if (kept === undefined) return null;
  if (spec.mode === "fixed") return spec.values[0] === kept ? kept : null;
  return spec.values.includes(kept) ? kept : null;
}

function pick(
  promptId: string,
  spec: VariableSpec,
  state: VariableState,
): string | null {
  if (spec.values.length === 0) return null;

  if (spec.mode === "fixed") return spec.values[0] as string;

  if (spec.mode === "random") {
    const index = Math.floor(Math.random() * spec.values.length);
    return spec.values[index] as string;
  }

  const key = `${promptId}:${spec.name}`;
  if (spec.mode === "shuffle") return drawFromBag(key, spec.values, state);

  const { cursors } = state;
  const current = cursors[key] ?? 0;
  const index = ((current % spec.values.length) + spec.values.length) % spec.values.length;
  cursors[key] = index + 1;
  return spec.values[index] as string;
}

/** 从牌堆取下一张；取完或取值数变化时重洗一副。牌堆与位置随状态落盘 */
function drawFromBag(key: string, values: readonly string[], state: VariableState): string {
  let bag = state.bags[key];
  let position = state.cursors[key] ?? 0;
  if (bag === undefined || bag.length !== values.length || position >= bag.length) {
    bag = shuffledIndexes(values.length, bag?.[bag.length - 1]);
    position = 0;
    state.bags[key] = bag;
  }
  state.cursors[key] = position + 1;
  return values[bag[position] as number] as string;
}

/** Fisher–Yates 洗牌；新一副的第一张若与上一副的最后一张相同，与第二张对调 */
function shuffledIndexes(count: number, previousLast: number | undefined): number[] {
  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j] as number, order[i] as number];
  }
  if (count > 1 && order[0] === previousLast) {
    [order[0], order[1]] = [order[1] as number, order[0] as number];
  }
  return order;
}

/** 占位符替换；未登记的 `{{...}}` 原样保留，拼错的变量名不会被静默抹掉 */
function substitute(template: string, bindings: Record<string, string>): string {
  const OPEN = "{{";
  const CLOSE = "}}";
  let result = "";
  let cursor = 0;

  for (;;) {
    const open = template.indexOf(OPEN, cursor);
    if (open === -1) break;
    const close = template.indexOf(CLOSE, open);
    if (close === -1) break;

    const name = template.slice(open + OPEN.length, close).trim();
    const value = bindings[name];

    result += template.slice(cursor, open);
    result += value ?? template.slice(open, close + CLOSE.length);
    cursor = close + CLOSE.length;
  }

  return result + template.slice(cursor);
}

/** 列出模板中引用到的变量名，供配置校验发现拼写错误 */
export function referencedVariables(template: string): string[] {
  const names: string[] = [];
  let cursor = 0;

  for (;;) {
    const open = template.indexOf("{{", cursor);
    if (open === -1) break;
    const close = template.indexOf("}}", open);
    if (close === -1) break;

    const name = template.slice(open + 2, close).trim();
    if (name !== "" && !names.includes(name)) names.push(name);
    cursor = close + 2;
  }
  return names;
}

async function readState(): Promise<VariableState> {
  const state = await readJsonRecord(STATE_FILE);
  if (state !== null) {
    return {
      cursors: (state.cursors ?? {}) as CursorStore,
      bags: (state.bags ?? {}) as Record<string, number[]>,
      periods: (state.periods ?? {}) as Record<string, PeriodBindings>,
    };
  }
  // 状态文件不存在时继承旧版游标，保持轮换顺序连续
  const legacy = await readJsonRecord(LEGACY_CURSOR_FILE);
  return { cursors: (legacy ?? {}) as CursorStore, bags: {}, periods: {} };
}

async function readJsonRecord(filename: string): Promise<Record<string, unknown> | null> {
  try {
    const parsed: unknown = JSON.parse(await readFile(join(dataRoot(), filename), "utf8"));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** 写临时文件再原子替换：调度器与手动执行可能同时渲染 */
async function writeState(state: VariableState): Promise<void> {
  const path = join(dataRoot(), STATE_FILE);
  const staging = `${path}.${process.pid}.staging`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(staging, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await rename(staging, path);
}
