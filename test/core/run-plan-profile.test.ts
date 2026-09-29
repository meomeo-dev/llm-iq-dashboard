/**
 * 按 profile 分道与分组：同模型不同 profile 是不同的道；分组保留全局道号；
 * 没有启动参数的 profile 调用记 error，不回落到登录态。不启动任何 CLI。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { leakGuardFromText } from "@/core/leak-guard";
import { describeProgress, groupIntoLanes, laneIdentity, type Job } from "@/core/run-plan";
import { executeLanes, groupLanesByProfile, type LaneHooks } from "@/core/run/execute-lanes";
import { buildTargetId, type Attempt, type EffortLevel, type Target } from "@/core/types";

const originalEnv = { ...process.env };
let workdir: string;

before(async () => {
  workdir = await mkdtemp(join(tmpdir(), "llm-iq-run-plan-profile-"));
  process.env.PELICAN_DATA_DIR = join(workdir, "data");
});

after(async () => {
  process.env = { ...originalEnv };
  await rm(workdir, { recursive: true, force: true });
});

function job(model: string, effort: EffortLevel, profile?: string): Job {
  const target: Target = {
    id: buildTargetId("codex", model, effort, profile),
    cli: "codex",
    ...(profile === undefined ? {} : { profile }),
    model,
    effort,
    label: model,
    timeoutMs: 60_000,
    extraArgs: [],
    enabled: true,
  };
  return {
    target,
    prompt: { promptId: "classic-v1", text: "draw", bindings: {} },
    appliedEffort: effort,
    effortAdjustable: true,
  };
}

const JOBS = [
  job("gpt-5.5", "high"),
  job("gpt-5.5", "low", "relay-a"),
  job("gpt-5.5", "low"),
  job("gpt-6", "low", "relay-a"),
  job("gpt-5.5", "low", "relay-b"),
];

test("groupIntoLanes: 同模型经不同 profile 各成一道，道内仍按强度排列", () => {
  const lanes = groupIntoLanes(JOBS);
  assert.deepEqual(lanes.map(laneIdentity), [
    { cli: "codex", model: "gpt-5.5" },
    { cli: "codex", model: "gpt-5.5", profile: "relay-a" },
    { cli: "codex", model: "gpt-6", profile: "relay-a" },
    { cli: "codex", model: "gpt-5.5", profile: "relay-b" },
  ]);
  assert.deepEqual(lanes[0]!.map((item) => item.job.target.effort), ["low", "high"]);
});

test("describeProgress: 只有非默认 profile 的道写 profile 字段", () => {
  const progress = describeProgress("r", "manual", new Date(0), 2, groupIntoLanes(JOBS));
  assert.equal("profile" in progress.lanes[0]!, false);
  assert.equal(progress.lanes[1]!.profile, "relay-a");
});

test("groupLanesByProfile: 按 profile 首次出现的顺序分组，保留全局道号", () => {
  const groups = groupLanesByProfile(groupIntoLanes(JOBS));
  assert.deepEqual(
    groups.map((group) => group.map(({ laneIndex }) => laneIndex)),
    [[0], [1, 2], [3]],
  );
});

test("executeLanes: 放行但没有启动参数的 profile 调用记 error，登录态调用被拦时同样不发起", async () => {
  const lanes = groupIntoLanes([job("gpt-5.5", "low", "relay-a"), job("gpt-5.5", "low")]);
  const done: Attempt[] = [];
  const hooks: LaneHooks = {
    // 登录态的道在此拦下，确保测试不启动 codex；profile 的道放行，考察会话池的兜底
    admit: (item) => (item.target.profile === undefined ? { kind: "fail", error: "blocked" } : null),
    onSkipped: () => assert.fail("不应跳过"),
    onStart: () => {},
    onDone: (_lane, _call, _item, attempt) => done.push(attempt),
    onCancelled: () => assert.fail("不应取消"),
  };
  const round = {
    runId: "20260929T000000Z",
    signal: new AbortController().signal,
    leakGuard: leakGuardFromText([]),
    profileLaunches: new Map(),
  };
  await executeLanes(lanes, { profiles: 5, lanesPerProfile: 2 }, round, hooks);

  const byProfile = new Map(done.map((attempt) => [attempt.profile ?? "default", attempt]));
  assert.equal(byProfile.get("relay-a")?.status, "error");
  assert.match(byProfile.get("relay-a")?.error ?? "", /没有启动参数/);
  assert.equal(byProfile.get("default")?.error, "blocked");
});
