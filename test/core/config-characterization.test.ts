/**
 * 配置解析与校验特征测试（Config Characterization Tests）
 *
 * 覆盖 config.ts 中即将重构的各项函数：
 * 1. parseTargets: 正常、边界、缺失属性、非法 CLI / Effort、超时优先级、extraArgs、启用状态
 * 2. loadConfig: 完整合法配置加载与校验错误聚合
 * 3. parseSchedule, parseRetention, parseBudget, parseDataRepo
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { loadConfig } from "@/core/config";

test("loadConfig: 正常读取 pelican.example.yaml", () => {
  const examplePath = join(process.cwd(), "config/pelican.example.yaml");
  const config = loadConfig(examplePath);

  assert.ok(config !== null);
  assert.ok(config.targets.length > 0);
  assert.ok(config.run.promptIds.length > 0);
  assert.ok(config.schedule !== null);
  assert.ok(config.retention !== null);
  assert.ok(config.budget !== null);
});

test("loadConfig: 校验失败时聚合所有错误信息并一次性抛出", async () => {
  const badYaml = `
schedule:
  cron: "invalid-cron-syntax"
  intervalMinutes: -5
  enabled: true
run:
  concurrency: 0
  defaultTimeoutMs: 500
  promptIds: []
targets: []
budget:
  perRoundUsd: -10
retention:
  days: -1
dataRepo:
  path: ""
  autoSync: "not-a-bool"
`;

  const workdir = await mkdtemp(join(tmpdir(), "llm-iq-cfg-test-"));
  const tempPath = join(workdir, "pelican.config.yaml");
  await writeFile(tempPath, badYaml, "utf8");

  try {
    assert.throws(
      () => loadConfig(tempPath),
      (err: Error) => {
        const msg = err.message;
        assert.ok(msg.includes("schedule.enabled 不是配置项"), "缺失 schedule.enabled 错误提示");
        assert.ok(msg.includes("schedule.intervalMinutes 必须为正数"), "缺失 intervalMinutes 错误");
        assert.ok(msg.includes("run.concurrency 必须 >= 1"), "缺失 concurrency 错误");
        assert.ok(msg.includes("run.defaultTimeoutMs 至少 1000ms"), "缺失 timeout 错误");
        assert.ok(msg.includes("run.promptIds 为空"), "缺失 promptIds 为空错误");
        assert.ok(msg.includes("targets 必须是非空数组"), "缺失 targets 非空错误");
        assert.ok(msg.includes("budget.perRoundUsd 必须是正数"), "缺失 budget 错误");
        assert.ok(msg.includes("retention.days 必须是不小于 1 的整数"), "缺失 retention 错误");
        assert.ok(msg.includes("dataRepo.path 必填"), "缺失 dataRepo.path 错误");
        assert.ok(msg.includes("dataRepo.autoSync 必须是布尔值"), "缺失 dataRepo.autoSync 错误");
        return true;
      },
    );
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
});

test("loadConfig: targets 各种超时继承与优先级解析", async () => {
  const validYaml = `
run:
  promptIds: ["classic-v1"]
  concurrency: 1
  defaultTimeoutMs: 10000
  timeoutByCli:
    claude: 20000
  timeoutByEffort:
    high: 30000
targets:
  - cli: claude
    model: opus
    effort: high
    timeoutMs: 40000
  - cli: claude
    model: sonnet
    effort: high
  - cli: claude
    model: haiku
    effort: low
  - cli: codex
    model: o3-mini
    effort: low
`;

  const workdir = await mkdtemp(join(tmpdir(), "llm-iq-cfg-test-"));
  const tempPath = join(workdir, "pelican.config.yaml");
  await writeFile(tempPath, validYaml, "utf8");

  try {
    const config = loadConfig(tempPath);
    assert.equal(config.targets[0]?.timeoutMs, 40000);
    assert.equal(config.targets[1]?.timeoutMs, 30000);
    assert.equal(config.targets[2]?.timeoutMs, 20000);
    assert.equal(config.targets[3]?.timeoutMs, 10000);
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }
});

test("loadConfig: targets 重复 ID 与全部被禁用时报错", async () => {
  const duplicateYaml = `
run:
  promptIds: ["classic-v1"]
targets:
  - cli: claude
    model: sonnet
    effort: high
  - cli: claude
    model: sonnet
    effort: high
`;
  const workdir1 = await mkdtemp(join(tmpdir(), "llm-iq-cfg-test-"));
  const tempPath1 = join(workdir1, "pelican.config.yaml");
  await writeFile(tempPath1, duplicateYaml, "utf8");
  try {
    assert.throws(() => loadConfig(tempPath1), /与前面的条目重复/);
  } finally {
    await rm(workdir1, { recursive: true, force: true });
  }

  const allDisabledYaml = `
run:
  promptIds: ["classic-v1"]
targets:
  - cli: claude
    model: sonnet
    effort: high
    enabled: false
`;
  const workdir2 = await mkdtemp(join(tmpdir(), "llm-iq-cfg-test-"));
  const tempPath2 = join(workdir2, "pelican.config.yaml");
  await writeFile(tempPath2, allDisabledYaml, "utf8");
  try {
    assert.throws(() => loadConfig(tempPath2), /targets 中没有任何已启用的条目/);
  } finally {
    await rm(workdir2, { recursive: true, force: true });
  }
});
