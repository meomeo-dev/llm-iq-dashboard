/**
 * dataRepo 配置加载与校验测试。
 */

import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import { loadConfig } from "@/core/config";

describe("dataRepo 配置", () => {
  let tempDir: string;
  const baseConfigYaml = `
schedule:
  cron: "0 9 * * *"
  runOnStart: false
run:
  promptIds: [classic-v1]
  concurrency: 1
  defaultTimeoutMs: 60000
retention:
  days: 7
targets:
  - cli: claude
    model: claude-sonnet-5
    effort: low
    label: Claude
`;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "llm-iq-config-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("未配置 dataRepo 时为 null", async () => {
    const configPath = join(tempDir, "pelican.config.yaml");
    await writeFile(configPath, baseConfigYaml);

    const config = loadConfig(configPath);
    assert.equal(config.dataRepo, null);
  });

  it("正确解析合法的 dataRepo 配置（相对路径按 cwd 解析，autoSync 与 push 默认 false）", async () => {
    const configPath = join(tempDir, "pelican.config.yaml");
    const yaml = `
${baseConfigYaml}
dataRepo:
  path: ./my-data-repo
`;
    await writeFile(configPath, yaml);

    const config = loadConfig(configPath);
    assert.ok(config.dataRepo);
    assert.equal(config.dataRepo.path, resolve(process.cwd(), "./my-data-repo"));
    assert.equal(config.dataRepo.autoSync, false);
    assert.equal(config.dataRepo.push, false);
  });

  it("显式指定 autoSync: true 与 push: true", async () => {
    const configPath = join(tempDir, "pelican.config.yaml");
    const yaml = `
${baseConfigYaml}
dataRepo:
  path: /tmp/abs-data-repo
  autoSync: true
  push: true
`;
    await writeFile(configPath, yaml);

    const config = loadConfig(configPath);
    assert.ok(config.dataRepo);
    assert.equal(config.dataRepo.path, "/tmp/abs-data-repo");
    assert.equal(config.dataRepo.autoSync, true);
    assert.equal(config.dataRepo.push, true);
  });

  it("校验失败：dataRepo 不是映射、path 缺失、autoSync 或 push 非布尔值", async () => {
    const configPath = join(tempDir, "pelican.config.yaml");

    // 不是映射
    await writeFile(configPath, `${baseConfigYaml}\ndataRepo: "invalid"\n`);
    assert.throws(() => loadConfig(configPath), /dataRepo 必须是一个映射/);

    // 缺少 path
    await writeFile(configPath, `${baseConfigYaml}\ndataRepo:\n  autoSync: true\n`);
    assert.throws(() => loadConfig(configPath), /dataRepo\.path 必填/);

    // autoSync 非布尔值
    await writeFile(
      configPath,
      `${baseConfigYaml}\ndataRepo:\n  path: ./repo\n  autoSync: "yes"\n`,
    );
    assert.throws(() => loadConfig(configPath), /dataRepo\.autoSync 必须是布尔值/);

    // push 非布尔值
    await writeFile(
      configPath,
      `${baseConfigYaml}\ndataRepo:\n  path: ./repo\n  push: 123\n`,
    );
    assert.throws(() => loadConfig(configPath), /dataRepo\.push 必须是布尔值/);
  });
});
