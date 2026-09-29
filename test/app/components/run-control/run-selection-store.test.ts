import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  defaultSelectedIds,
  readStoredSelection,
  reconcileRunSelection,
  resolveRunSelection,
  SELECTION_STORAGE_KEY,
  writeStoredSelection,
  type AvailableOptions,
} from "@/app/components/run-control/run-selection-store";

/** 模拟配置：run.promptIds 只有动态鹈鹕车 */
const DEFAULT_PROMPT_ID = "animated-pelican-v1";

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
    { id: "claude__claude-opus-5-5__low", defaultSelected: true },
    { id: "claude__claude-opus-5-5__medium", defaultSelected: false },
    { id: "claude__claude-opus-5-5__high", defaultSelected: true },
    { id: "claude__claude-opus-5-5__max", defaultSelected: false },
    { id: "codex__o3-mini__high", defaultSelected: true },
    { id: "agy__gemini-2-5-pro__low", defaultSelected: true },
  ],
  prompts: [
    { id: "classic-v1", defaultSelected: false },
    { id: "upgraded-v2", defaultSelected: false },
    { id: "animated-pelican-v1", defaultSelected: true },
    { id: "clock-v1", defaultSelected: false },
  ],
};

describe("run-selection-store", () => {
  test("用户清空后缓存为显式空数组，重新进入时保持为空而不回填默认", () => {
    const storage = createMockStorage();
    writeStoredSelection([], [], storage);
    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), storage);
    assert.equal(result.targets.size, 0);
    assert.equal(result.prompts.size, 0);
  });

  test("可选范围刷新时只剔除失效项，空选择原样保留（不回填动态鹈鹕车）", () => {
    const empty = reconcileRunSelection(mockAvailable, new Set(), new Set(), {});
    assert.equal(empty.targets.size, 0);
    assert.equal(empty.prompts.size, 0);

    const partial = reconcileRunSelection(
      mockAvailable,
      new Set(["codex__o3-mini__high", "gone__model__low"]),
      new Set(["clock-v1", "removed-v1"]),
      { "clock-v1": "c1", "removed-v1": "c2" },
    );
    assert.deepEqual([...partial.targets], ["codex__o3-mini__high"]);
    assert.deepEqual([...partial.prompts], ["clock-v1"]);
    assert.deepEqual(partial.candidateOverrides, { "clock-v1": "c1" });
  });

  test("首次进入（无缓存）时：默认勾选与定时任务一致（服务端 defaultSelected）", () => {
    const storage = createMockStorage();
    const result = resolveRunSelection(mockAvailable, new Set(), new Set(), storage);

    // 模型默认为 enabled 的目标，未进定时任务的档位仍在列表里但不勾
    assert.deepEqual(
      [...result.targets],
      [
        "claude__claude-opus-5-5__low",
        "claude__claude-opus-5-5__high",
        "codex__o3-mini__high",
        "agy__gemini-2-5-pro__low",
      ],
      "未缓存时应默认勾选 enabled 的目标",
    );

    // 题目默认为 run.promptIds
    assert.deepEqual([...result.prompts], [DEFAULT_PROMPT_ID], "未缓存时应默认勾选 run.promptIds 的题目");
  });

  test("默认值只看 defaultSelected，不按强度或题目 id 写死", () => {
    const storage = createMockStorage();
    const available: AvailableOptions = {
      targets: [
        { id: "claude__m__low", defaultSelected: false },
        { id: "claude__m__max", defaultSelected: true },
      ],
      prompts: [
        { id: "classic-v1", defaultSelected: true },
        { id: "animated-pelican-v1", defaultSelected: false },
      ],
    };
    const result = resolveRunSelection(available, new Set(), new Set(), storage);

    assert.deepEqual([...result.targets], ["claude__m__max"]);
    assert.deepEqual([...result.prompts], ["classic-v1"]);
    assert.deepEqual(defaultSelectedIds([{ id: "x" }]), [], "未标记的条目不默认勾选");
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
    assert.deepEqual([...result.targets], defaultSelectedIds(mockAvailable.targets));
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
    assert.deepEqual([...result.targets], defaultSelectedIds(mockAvailable.targets));
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

describe("上游勾选的记忆", () => {
  test("没存过返回 null；存过按原样还原；损坏的缓存返回 null", async () => {
    const { readStoredProfiles, writeStoredProfiles, PROFILE_STORAGE_KEY } = await import(
      "@/app/components/run-control/run-selection-store"
    );
    const storage = createMockStorage();
    assert.equal(readStoredProfiles(storage), null);
    writeStoredProfiles(["default", "relay-a"], storage);
    assert.deepEqual(readStoredProfiles(storage), ["default", "relay-a"]);
    storage.setItem(PROFILE_STORAGE_KEY, "{bad");
    assert.equal(readStoredProfiles(storage), null);
  });
});
