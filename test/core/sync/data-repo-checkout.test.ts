/**
 * 数据仓本地副本准备（data-repo-checkout）测试。
 * 用临时 bare 仓做远端，经 git 的 url.<base>.insteadOf 把 GitHub 地址改写到本地路径，不联网。
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it } from "node:test";
import type { DataRepoConfig } from "@/core/config";
import {
  describeCheckout,
  ensureDataRepoCheckout,
  githubRepoSlug,
  sameGithubRepo,
} from "@/core/sync/data-repo-checkout";

const REPOSITORY = "https://github.com/acme/pelican-data";

function configFor(path: string, repository: string | null = REPOSITORY): DataRepoConfig {
  return { path, repository, autoSync: false, push: false, publishPrompts: null };
}

describe("githubRepoSlug / sameGithubRepo", () => {
  it("https 与 ssh 写法、.git 后缀、大小写都归一到同一个 owner/repo", () => {
    assert.equal(githubRepoSlug("https://github.com/Acme/Pelican-Data.git"), "acme/pelican-data");
    assert.equal(githubRepoSlug("git@github.com:acme/pelican-data.git"), "acme/pelican-data");
    assert.equal(githubRepoSlug("/tmp/not-github"), null);
    assert.ok(sameGithubRepo(REPOSITORY, "git@github.com:acme/pelican-data.git"));
    assert.ok(!sameGithubRepo(REPOSITORY, "https://github.com/acme/other"));
    assert.ok(!sameGithubRepo(REPOSITORY, null));
  });
});

describe("ensureDataRepoCheckout", () => {
  let tempBase: string;
  let remoteDir: string;
  const REWRITE_KEYS = ["GIT_CONFIG_COUNT", "GIT_CONFIG_KEY_0", "GIT_CONFIG_VALUE_0"] as const;
  const savedEnv: Record<string, string | undefined> = {};

  /**
   * 只在要 clone 的那次调用里把 https://github.com/acme/<repo> 改写到 tempBase/remotes/<repo>。
   * 改写规则对 remote get-url 同样生效，所以比对 origin 的调用要在规则撤掉后再做
   */
  async function withGithubRewrite<T>(action: () => Promise<T>): Promise<T> {
    process.env.GIT_CONFIG_COUNT = "1";
    process.env.GIT_CONFIG_KEY_0 = `url.${join(tempBase, "remotes")}/.insteadOf`;
    process.env.GIT_CONFIG_VALUE_0 = "https://github.com/acme/";
    try {
      return await action();
    } finally {
      for (const key of REWRITE_KEYS) {
        if (savedEnv[key] === undefined) delete process.env[key];
        else process.env[key] = savedEnv[key];
      }
    }
  }

  beforeEach(async () => {
    tempBase = await mkdtemp(join(tmpdir(), "llm-iq-checkout-"));
    remoteDir = join(tempBase, "remotes", "pelican-data");
    await mkdir(remoteDir, { recursive: true });
    execFileSync("git", ["init", "--bare", "--initial-branch=main", remoteDir]);
    for (const key of REWRITE_KEYS) savedEnv[key] = process.env[key];
  });

  afterEach(async () => {
    await rm(tempBase, { recursive: true, force: true });
  });

  it("没配 repository 时什么都不做", async () => {
    const path = join(tempBase, "untouched");
    assert.deepEqual(await ensureDataRepoCheckout(configFor(path, null)), { kind: "unconfigured" });
    assert.equal(describeCheckout({ kind: "unconfigured" }), null);
  });

  it("路径不存在时 clone，再次调用判定为 ready；origin 记的是配置里的地址", async () => {
    const path = join(tempBase, "work", "data");
    const logs: string[] = [];
    const first = await withGithubRewrite(() => ensureDataRepoCheckout(configFor(path), { log: (m) => logs.push(m) }));
    assert.deepEqual(first, { kind: "cloned", repository: REPOSITORY, path });
    assert.equal(logs.length, 1);
    const second = await ensureDataRepoCheckout(configFor(path));
    assert.deepEqual(second, { kind: "ready", repository: REPOSITORY, originUrl: REPOSITORY });
  });

  it("空目录也 clone；非空且不是 git 仓的目录不动", async () => {
    const empty = join(tempBase, "empty");
    await mkdir(empty);
    assert.equal((await withGithubRewrite(() => ensureDataRepoCheckout(configFor(empty)))).kind, "cloned");

    const plain = join(tempBase, "plain");
    await mkdir(plain);
    await writeFile(join(plain, "note.txt"), "x\n");
    const outcome = await ensureDataRepoCheckout(configFor(plain));
    assert.deepEqual(outcome, { kind: "not-git", path: plain });
    assert.match(describeCheckout(outcome) ?? "", /不会自动 clone/);
  });

  it("已有副本的 origin 指向别的仓时报 mismatch，不覆盖", async () => {
    const path = join(tempBase, "foreign");
    execFileSync("git", ["clone", "-q", remoteDir, path]);
    execFileSync("git", ["-C", path, "remote", "set-url", "origin", "https://github.com/acme/other"]);
    const outcome = await ensureDataRepoCheckout(configFor(path));
    assert.deepEqual(outcome, {
      kind: "mismatch", repository: REPOSITORY, originUrl: "https://github.com/acme/other",
    });
    assert.match(describeCheckout(outcome) ?? "", /不是同一个仓/);
  });

  it("本仓库目录下的空子目录不算已有副本：照样 clone 而不是读外层仓的 origin", async () => {
    const outer = join(tempBase, "outer");
    execFileSync("git", ["init", "-q", "--initial-branch=main", outer]);
    execFileSync("git", ["-C", outer, "remote", "add", "origin", "https://github.com/acme/other"]);
    const nested = join(outer, "data-repo");
    await mkdir(nested);
    assert.equal((await withGithubRewrite(() => ensureDataRepoCheckout(configFor(nested)))).kind, "cloned");
  });
});
