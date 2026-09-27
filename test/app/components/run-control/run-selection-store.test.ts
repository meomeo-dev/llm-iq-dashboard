import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  DEFAULT_PROMPT_ID,
  defaultTargetIds,
  readStoredSelection,
  resolveRunSelection,
  SELECTION_STORAGE_KEY,
  writeStoredSelection,
  type AvailableOptions,
} from "@/app/components/run-control/run-selection-store";

function createMockStorage(initialData: Record<string, string> = {}): Storage {
  const store = new Map<string, string>(Object.entries(initialData));
  return {
    getItem(key: string): string | null {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      store.set(key, value);
    },
    removeItem(key: string): void {
      store.delete(key);
    },
    clear(): void {
      store.clear();
    },
    key(index: number): string | null {
      return [...store.keys()][index] ?? null;
    },
    get length(): number {
      return store.size;
    },
  };
}

const mockAvailable: AvailableOptions = {
  targets: [
    { id: "claude__claude-opus-5-5__low" },
    { id: "claude__claude-opus-5-5__medium" },
    { id: "claude__claude-opus-5-5__high" },
    { id: "claude__claude-opus-5-5__max" },
    { id: "codex__o3-mini__high" },
    { id: "agy__gemini-2-5-pro__low" },
  ],
  prompts: [
    { id: "classic-v1", defaultSelected: true },
    { id: "upgraded-v2", defaultSelected: false },
    { id: "animated-pelican-v1", defaultSelected: false },
    { id: "clock-v1", defaultSelected: false },
  ],
};

describe("run-selection-store", () => {
  test("首次进入（无缓存）时：默认仅勾选 low 与 high 思考强度，题目默认仅勾选动态鹈鹕车", () => {
    const storage = createMockStorage();
    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), storage);

    // 模型默认仅选 low 和 high
    assert.deepEqual(
      [...result.targets],
      [
        "claude__claude-opus-5-5__low",
        "claude__claude-opus-5-5__high",
        "codex__o3-mini__high",
        "agy__gemini-2-5-pro__low",
      ],
      "未缓存时应默认仅勾选 low 和 high 两档",
    );

    // 题目仅默认勾选动态鹈鹕车
    assert.deepEqual(
      [...result.prompts],
      [DEFAULT_PROMPT_ID],
      "未缓存时应默认只勾选动态鹈鹕车（animated-pelican-v1）",
    );
  });

  test("若题目列表中无动态鹈鹕车，回退到配置默认条目", () => {
    const storage = createMockStorage();
    const noAnimatedAvailable: AvailableOptions = {
      targets: [{ id: "t1" }, { id: "t2" }],
      prompts: [
        { id: "classic-v1", defaultSelected: true },
        { id: "upgraded-v2", defaultSelected: false },
      ],
    };
    const result = resolveRunSelection(noAnimatedAvailable, new Set(), new Set(), storage);

    assert.deepEqual([...result.targets], ["t1", "t2"]);
    assert.deepEqual([...result.prompts], ["classic-v1"]);
  });

  test("缓存读写：持久化并在重新进入时还原选择", () => {
    const storage = createMockStorage();
    const pickedTargets = ["claude__claude-opus-5-5__high", "codex__o3-mini__high"];
    const pickedPrompts = [DEFAULT_PROMPT_ID, "clock-v1"];

    writeStoredSelection(pickedTargets, pickedPrompts, storage);

    const stored = readStoredSelection(storage);
    assert.ok(stored !== null);
    assert.deepEqual(stored.targets, pickedTargets);
    assert.deepEqual(stored.prompts, pickedPrompts);

    // 重新进入（内存为空，从 storage 恢复）
    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), storage);
    assert.deepEqual([...result.targets], pickedTargets);
    assert.deepEqual([...result.prompts], pickedPrompts);
  });

  test("过滤已失效的模型或题目，其余有效项继续保留", () => {
    const storage = createMockStorage({
      [SELECTION_STORAGE_KEY]: JSON.stringify({
        targets: ["claude__claude-opus-5-5__high", "old_obsolete_model_target"],
        prompts: [DEFAULT_PROMPT_ID, "old_deleted_prompt"],
      }),
    });

    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), storage);
    assert.deepEqual([...result.targets], ["claude__claude-opus-5-5__high"]);
    assert.deepEqual([...result.prompts], [DEFAULT_PROMPT_ID]);
  });

  test("缓存中所有项均失效时，安全回退到基线默认状态", () => {
    const storage = createMockStorage({
      [SELECTION_STORAGE_KEY]: JSON.stringify({
        targets: ["non_existent_target_1", "non_existent_target_2"],
        prompts: ["non_existent_prompt"],
      }),
    });

    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), storage);
    assert.deepEqual([...result.targets], defaultTargetIds(mockAvailable.targets));
    assert.deepEqual([...result.prompts], [DEFAULT_PROMPT_ID]);
  });

  test("内存中已有选项目前优先保留", () => {
    const storage = createMockStorage({
      [SELECTION_STORAGE_KEY]: JSON.stringify({
        targets: ["agy__gemini-2-5-pro__high"],
        prompts: ["clock-v1"],
      }),
    });

    const inMemoryTargets = new Set(["claude__claude-opus-5-5__high"]);
    const inMemoryPrompts = new Set([DEFAULT_PROMPT_ID]);

    const result = resolveRunSelection(mockAvailable, inMemoryTargets, inMemoryPrompts, storage);
    assert.deepEqual([...result.targets], ["claude__claude-opus-5-5__high"]);
    assert.deepEqual([...result.prompts], [DEFAULT_PROMPT_ID]);
  });

  test("损坏的 JSON 缓存不抛错并优雅回退", () => {
    const corruptStorage = createMockStorage({
      [SELECTION_STORAGE_KEY]: "invalid-json{{{",
    });

    assert.equal(readStoredSelection(corruptStorage), null);
    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), corruptStorage);
    assert.deepEqual([...result.targets], defaultTargetIds(mockAvailable.targets));
    assert.deepEqual([...result.prompts], [DEFAULT_PROMPT_ID]);
  });

  test("候选场景覆盖（candidateOverrides）的持久化与还原", () => {
    const storage = createMockStorage();
    const pickedTargets = ["claude__claude-opus-5-5__high"];
    const pickedPrompts = ["shuihu-anim-v1"];
    const overrides = { "shuihu-anim-v1": "shuihu-anim-023" };

    writeStoredSelection(pickedTargets, pickedPrompts, overrides, storage);

    const stored = readStoredSelection(storage);
    assert.ok(stored !== null);
    assert.deepEqual(stored.candidateOverrides, overrides);

    const availableWithShuihu: AvailableOptions = {
      targets: [{ id: "claude__claude-opus-5-5__high" }],
      prompts: [{ id: "shuihu-anim-v1" }],
    };

    const resolved = resolveRunSelection(availableWithShuihu, new Set(), new Set(), storage);
    assert.deepEqual(resolved.candidateOverrides, overrides);
  });
});
