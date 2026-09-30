/**
 * 远程数据源从记录里汇总 profile 视图：按首次出现排序、去重；卡片带 profile；
 * 没有 profiles 字段的旧记录照常读；clearCache 一并清空。
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { RemoteDataSource, type FetchFn } from "@/core/data-source/remote";

const RELAY_A = { name: "relay-a", label: "甲", cli: "codex", upstreamType: "chatgpt-pro-5x", group: null, website: null, multiplier: 0.07, enabled: true };
const RELAY_B = { ...RELAY_A, name: "relay-b", label: "乙", multiplier: 0.16 };

function attempt(targetId: string, profile?: string) {
  return {
    targetId, promptId: "classic-v1", cli: "codex", ...(profile === undefined ? {} : { profile }), model: "gpt-5.5",
    effort: "low", appliedEffort: "low", effortHonored: true, label: "GPT-5.5", status: "error", svgFile: null,
    rawFile: null, startedAt: "2026-09-30T03:00:01.000Z", finishedAt: "2026-09-30T03:00:02.000Z",
    durationMs: 1000, svgBytes: null, error: "boom", usage: null,
  };
}

function run(runId: string, startedAt: string, profiles: object[] | undefined, attempts: object[]) {
  return {
    publicSchemaVersion: 1, runId, prompts: [{ promptId: "classic-v1", text: "draw", bindings: {} }],
    startedAt, finishedAt: startedAt, durationMs: 0, trigger: "manual", inProgress: false, attempts, redactions: [],
    ...(profiles === undefined ? {} : { profiles }),
  };
}

const FILES: Record<string, object> = {
  "index.json": { schemaVersion: 1, name: "t", description: "", repository: "", updatedAt: "2026-09-30T03:10:00.000Z", totalRuns: 2, days: [{ date: "2026-09-30", runs: 2, path: "runs/2026/09/30" }] },
  "runs/2026/09/30/index.json": { schemaVersion: 1, date: "2026-09-30", runs: [
    { runId: "20260930T030000Z", startedAt: "2026-09-30T03:00:00.000Z", finishedAt: "2026-09-30T03:00:00.000Z", trigger: "manual", promptIds: ["classic-v1"], attempts: 2, ok: 0, path: "runs/2026/09/30/20260930T030000Z" },
    { runId: "20260930T031000Z", startedAt: "2026-09-30T03:10:00.000Z", finishedAt: "2026-09-30T03:10:00.000Z", trigger: "manual", promptIds: ["classic-v1"], attempts: 2, ok: 0, path: "runs/2026/09/30/20260930T031000Z" },
  ] },
  "runs/2026/09/30/20260930T030000Z/run.json": run("20260930T030000Z", "2026-09-30T03:00:00.000Z", undefined, [attempt("codex__gpt-5.5__low")]),
  "runs/2026/09/30/20260930T031000Z/run.json": run("20260930T031000Z", "2026-09-30T03:10:00.000Z", [RELAY_B, RELAY_A], [attempt("codex__gpt-5.5__low__relay-b", "relay-b"), attempt("codex__gpt-5.5__low__relay-a", "relay-a")]),
};

const fetchFn: FetchFn = async (input) => {
  const path = new URL(String(input)).pathname.replace(/^\/repo\//, "");
  const file = FILES[path];
  return file === undefined ? new Response("Not Found", { status: 404 }) : new Response(JSON.stringify(file), { status: 200 });
};

test("knownProfiles：读过的记录里的 profile 按首次出现汇总；卡片带 profile；旧记录无 profiles 也能读", async () => {
  const ds = new RemoteDataSource({ repoUrl: "https://example.com/repo", fetchFn });
  assert.deepEqual(ds.knownProfiles(), []);
  const cards = await ds.loadCardsBetween(new Date("2026-09-30T00:00:00Z"), new Date("2026-10-01T00:00:00Z"));
  assert.equal(cards.length, 3);
  assert.deepEqual(cards.map((card) => card.profile ?? "default").sort(), ["default", "relay-a", "relay-b"]);
  assert.deepEqual(ds.knownProfiles().map((view) => view.name), ["relay-b", "relay-a"]);
  assert.deepEqual(ds.knownProfiles()[1], RELAY_A);
  ds.clearCache();
  assert.deepEqual(ds.knownProfiles(), []);
});
