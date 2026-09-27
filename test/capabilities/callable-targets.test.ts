import assert from "node:assert/strict";
import { test } from "node:test";
import { splitByReadiness } from "../../src/capabilities/callable-targets";
import type { ReadinessSnapshot } from "../../src/capabilities/readiness-cache";

const TARGETS = [
  { id: "claude-a", cli: "claude" as const },
  { id: "codex-a", cli: "codex" as const },
  { id: "codex-b", cli: "codex" as const },
  { id: "agy-a", cli: "agy" as const },
];
const CHECKED_AT = "2026-09-26T00:00:00.000Z";

test("未登录的 CLI 的目标不列出，并按 CLI 汇总数量与原因", () => {
  const snapshot: ReadinessSnapshot = {
    claude: { cli: "claude", state: "ready", detail: null, checkedAt: CHECKED_AT },
    codex: { cli: "codex", state: "signed-out", detail: "codex 未登录", checkedAt: CHECKED_AT },
    agy: { cli: "agy", state: "unverified", detail: "无法确认", checkedAt: CHECKED_AT },
  };
  const { callable, unavailable } = splitByReadiness(TARGETS, snapshot);
  assert.deepEqual(callable.map((target) => target.id), ["claude-a", "agy-a"]);
  assert.deepEqual(unavailable, [{ cli: "codex", state: "signed-out", targets: 2, detail: "codex 未登录" }]);
});

test("登录后缓存变为 ready，目标重新出现", () => {
  const snapshot: ReadinessSnapshot = {
    codex: { cli: "codex", state: "ready", detail: null, checkedAt: CHECKED_AT },
  };
  const { callable, unavailable } = splitByReadiness(TARGETS, snapshot);
  assert.equal(callable.length, TARGETS.length);
  assert.deepEqual(unavailable, []);
});

test("没有检查记录的 CLI 视为可调用", () => {
  const { callable } = splitByReadiness(TARGETS, {});
  assert.equal(callable.length, TARGETS.length);
});
