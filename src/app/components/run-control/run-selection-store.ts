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
export function resolveRunSelection(
  available: AvailableOptions,
  currentTargets: ReadonlySet<string>,
  currentPrompts: ReadonlySet<string>,
  overridesOrStorage?: Readonly<Record<string, string>> | Storage,
  maybeStorage?: Storage,
): { targets: Set<string>; prompts: Set<string>; candidateOverrides: Record<string, string> } {
  const currentOverrides = isStorage(overridesOrStorage) ? undefined : overridesOrStorage;
  const storage = isStorage(overridesOrStorage) ? overridesOrStorage : maybeStorage;

  const availableTargetIds = new Set(available.targets.map((t) => t.id));
  const availablePromptIds = new Set(available.prompts.map((p) => p.id));

  const stored = readStoredSelection(storage);

  // --- 解析 targets ---
  let resolvedTargets: string[];
  if (currentTargets.size > 0) {
    resolvedTargets = [...currentTargets].filter((id) => availableTargetIds.has(id));
  } else if (stored !== null && stored.targets.length > 0) {
    const valid = stored.targets.filter((id) => availableTargetIds.has(id));
    resolvedTargets = valid.length > 0 ? valid : defaultSelectedIds(available.targets);
  } else {
    resolvedTargets = defaultSelectedIds(available.targets);
  }

  // --- 解析 prompts ---
  const defaultPromptIds = defaultSelectedIds(available.prompts);

  let resolvedPrompts: string[];
  if (currentPrompts.size > 0) {
    resolvedPrompts = [...currentPrompts].filter((id) => availablePromptIds.has(id));
  } else if (stored !== null && stored.prompts.length > 0) {
    const valid = stored.prompts.filter((id) => availablePromptIds.has(id));
    resolvedPrompts = valid.length > 0 ? valid : defaultPromptIds;
  } else {
    resolvedPrompts = defaultPromptIds;
  }

  // --- 解析 candidateOverrides ---
  const resolvedOverrides: Record<string, string> = {};
  const sourceOverrides = currentOverrides ?? stored?.candidateOverrides ?? {};
  for (const [pId, cId] of Object.entries(sourceOverrides)) {
    if (availablePromptIds.has(pId) && cId) {
      resolvedOverrides[pId] = cId;
    }
  }

  return {
    targets: new Set(resolvedTargets),
    prompts: new Set(resolvedPrompts),
    candidateOverrides: resolvedOverrides,
  };
}
