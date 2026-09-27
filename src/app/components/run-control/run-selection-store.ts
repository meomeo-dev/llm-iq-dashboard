/**
 * “跑一次”面板的选择状态缓存与解析。
 *
 * 1. 记住用户的最后一次勾选状态（存储于当前浏览器的 localStorage），避免刷新或重新进入时丢失；
 * 2. 首次进入或无缓存时，默认勾选与定时任务的范围一致，由服务端的 defaultSelected 给出：
 *    - 模型范围（targets）：配置里 enabled 的目标
 *    - 题目选择（prompts）：配置里 run.promptIds 的条目
 */

export const SELECTION_STORAGE_KEY = "pelican.runOnce.selection.v3";

export interface StoredRunSelection {
  readonly targets: readonly string[];
  readonly prompts: readonly string[];
  readonly candidateOverrides?: Readonly<Record<string, string>>;
}

export interface MinimalOptionItem {
  readonly id: string;
  /** 进入定时任务的条目，作为无缓存时的默认勾选 */
  readonly defaultSelected?: boolean;
}

export type MinimalPromptItem = MinimalOptionItem;

export interface AvailableOptions {
  readonly targets: readonly MinimalOptionItem[];
  readonly prompts: readonly MinimalPromptItem[];
}

/** 从存储中读取已保存的选择；若未存或格式非法则返回 null */
export function readStoredSelection(storage?: Storage): StoredRunSelection | null {
  const s = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!s) return null;
  try {
    const raw = s.getItem(SELECTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const rec = parsed as Record<string, unknown>;
    const targets = Array.isArray(rec.targets)
      ? rec.targets.filter((item): item is string => typeof item === "string")
      : null;
    const prompts = Array.isArray(rec.prompts)
      ? rec.prompts.filter((item): item is string => typeof item === "string")
      : null;
    if (targets === null || prompts === null) return null;
    let candidateOverrides: Record<string, string> | undefined;
    if (rec.candidateOverrides && typeof rec.candidateOverrides === "object") {
      candidateOverrides = {};
      for (const [k, v] of Object.entries(rec.candidateOverrides as Record<string, unknown>)) {
        if (typeof v === "string") {
          candidateOverrides[k] = v;
        }
      }
    }
    return { targets, prompts, ...(candidateOverrides ? { candidateOverrides } : {}) };
  } catch {
    return null;
  }
}

function isStorage(value: unknown): value is Storage {
  return typeof value === "object" && value !== null && "getItem" in value && "setItem" in value;
}

/** 将当前勾选持久化至 localStorage */
export function writeStoredSelection(
  targets: Iterable<string>,
  prompts: Iterable<string>,
  candidateOverridesOrStorage?: Record<string, string> | Storage,
  maybeStorage?: Storage,
): void {
  const candidateOverrides = isStorage(candidateOverridesOrStorage) ? undefined : candidateOverridesOrStorage;
  const storage = isStorage(candidateOverridesOrStorage) ? candidateOverridesOrStorage : maybeStorage;
  const s = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!s) return;
  try {
    const data: StoredRunSelection = {
      targets: [...targets],
      prompts: [...prompts],
      ...(candidateOverrides ? { candidateOverrides } : {}),
    };
    s.setItem(SELECTION_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 写入失败（如隐私模式或存储超额）静默忽略
  }
}

/** 默认勾选：服务端标为 defaultSelected 的条目（即定时任务的范围） */
export function defaultSelectedIds(items: readonly MinimalOptionItem[]): string[] {
  return items.filter((item) => item.defaultSelected === true).map((item) => item.id);
}

/**
 * 决定“跑一次”弹窗的勾选状态：
 * 1. 若当前页面内存已持有用户的有效勾选，优先维持；
 * 2. 否则从 localStorage 读取上次的选择，并过滤掉不再存在的项；
 * 3. 若无缓存或缓存全失效，采用默认状态：
 *    - 模型（targets）：各模型的 low 和 high 两档思考强度
 *    - 题目（prompts）：默认只勾选动态鹈鹕车（animated-pelican-v1）
 */
function resolveTargetsSelection(
  availableTargets: readonly MinimalOptionItem[],
  currentTargets: ReadonlySet<string>,
  storedTargets: readonly string[] | undefined,
): string[] {
  const availableIds = new Set(availableTargets.map((t) => t.id));
  if (currentTargets.size > 0) {
    return [...currentTargets].filter((id) => availableIds.has(id));
  }
  if (storedTargets) {
    // 缓存里明确存的空数组是用户清空的结果，照常还原为空；全部失效才回退默认
    if (storedTargets.length === 0) return [];
    const valid = storedTargets.filter((id) => availableIds.has(id));
    return valid.length > 0 ? valid : defaultSelectedIds(availableTargets);
  }
  return defaultSelectedIds(availableTargets);
}

function resolvePromptsSelection(
  availablePrompts: readonly MinimalPromptItem[],
  currentPrompts: ReadonlySet<string>,
  storedPrompts: readonly string[] | undefined,
): string[] {
  const availableIds = new Set(availablePrompts.map((p) => p.id));
  const defaults = defaultSelectedIds(availablePrompts);
  if (currentPrompts.size > 0) {
    return [...currentPrompts].filter((id) => availableIds.has(id));
  }
  if (storedPrompts) {
    if (storedPrompts.length === 0) return [];
    const valid = storedPrompts.filter((id) => availableIds.has(id));
    return valid.length > 0 ? valid : defaults;
  }
  return defaults;
}

function resolveCandidateOverrides(
  availablePrompts: readonly MinimalPromptItem[],
  currentOverrides?: Readonly<Record<string, string>>,
  storedOverrides?: Readonly<Record<string, string>>,
): Record<string, string> {
  const availablePromptIds = new Set(availablePrompts.map((p) => p.id));
  const resolved: Record<string, string> = {};
  const source = currentOverrides ?? storedOverrides ?? {};
  for (const [pId, cId] of Object.entries(source)) {
    if (availablePromptIds.has(pId) && cId) {
      resolved[pId] = cId;
    }
  }
  return resolved;
}

/**
 * 可选范围刷新后校正已初始化的选择：只剔除不再存在的项，空集合原样保留。
 * 用户清空后不得回填默认值，那是 resolveRunSelection 只在首次初始化时做的事。
 */
export function reconcileRunSelection(
  available: AvailableOptions,
  currentTargets: ReadonlySet<string>,
  currentPrompts: ReadonlySet<string>,
  currentOverrides: Readonly<Record<string, string>>,
): { targets: Set<string>; prompts: Set<string>; candidateOverrides: Record<string, string> } {
  const targetIds = new Set(available.targets.map((t) => t.id));
  const promptIds = new Set(available.prompts.map((p) => p.id));
  return {
    targets: new Set([...currentTargets].filter((id) => targetIds.has(id))),
    prompts: new Set([...currentPrompts].filter((id) => promptIds.has(id))),
    candidateOverrides: resolveCandidateOverrides(available.prompts, currentOverrides),
  };
}

export function resolveRunSelection(
  available: AvailableOptions,
  currentTargets: ReadonlySet<string>,
  currentPrompts: ReadonlySet<string>,
  overridesOrStorage?: Readonly<Record<string, string>> | Storage,
  maybeStorage?: Storage,
): { targets: Set<string>; prompts: Set<string>; candidateOverrides: Record<string, string> } {
  const currentOverrides = isStorage(overridesOrStorage) ? undefined : overridesOrStorage;
  const storage = isStorage(overridesOrStorage) ? overridesOrStorage : maybeStorage;
  const stored = readStoredSelection(storage);

  return {
    targets: new Set(resolveTargetsSelection(available.targets, currentTargets, stored?.targets)),
    prompts: new Set(resolvePromptsSelection(available.prompts, currentPrompts, stored?.prompts)),
    candidateOverrides: resolveCandidateOverrides(available.prompts, currentOverrides, stored?.candidateOverrides),
  };
}
