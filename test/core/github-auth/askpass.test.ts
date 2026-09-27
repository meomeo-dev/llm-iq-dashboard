/**
 * git-askpass.sh 脚本单测。
 *
 * 验证：Username/Password 两种提示的输出与退出码，以及令牌文件缺失时的非零退出与静默。
 */

import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, describe, it } from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

describe("git-askpass.sh 认证脚本", () => {
  const askpassScript = join(process.cwd(), "docker/git-askpass.sh");
  let testDir: string;

  before(async () => {
    testDir = await mkdtemp(join(tmpdir(), "askpass-test-"));
  });

  after(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("当提示包含 Username 时输出 x-access-token", async () => {
    const { stdout } = await execFileAsync(askpassScript, [
      "Username for 'https://github.com':",
    ]);
    assert.equal(stdout.trim(), "x-access-token");
  });

  it("当提示为 Password 且令牌文件存在时输出令牌文件内容", async () => {
    const tokenFile = join(testDir, "test-token");
    await writeFile(tokenFile, "ghu_SecretToken123456789\n", "utf8");

    const { stdout } = await execFileAsync(
      askpassScript,
      ["Password for 'https://x-access-token@github.com':"],
      {
        env: {
          ...process.env,
          PELICAN_GIT_TOKEN_FILE: tokenFile,
        },
      },
    );
    assert.equal(stdout.trim(), "ghu_SecretToken123456789");
  });

  it("当令牌文件不存在时以非零退出且无输出", async () => {
    const nonExistentFile = join(testDir, "does-not-exist");

    await assert.rejects(
      () =>
        execFileAsync(askpassScript, ["Password:"], {
          env: {
            ...process.env,
            PELICAN_GIT_TOKEN_FILE: nonExistentFile,
          },
        }),
      (err: Error & { stdout?: string; code?: number }) => {
        assert.ok(err.code !== 0);
        assert.equal((err.stdout ?? "").trim(), "");
        return true;
      },
    );
  });

  it("当 PELICAN_GIT_TOKEN_FILE 未设置时非零退出且无输出", async () => {
    const cleanEnv = { ...process.env };
    delete cleanEnv.PELICAN_GIT_TOKEN_FILE;

    await assert.rejects(
      () => execFileAsync(askpassScript, ["Password:"], { env: cleanEnv }),
      (err: Error & { stdout?: string; code?: number }) => {
        assert.ok(err.code !== 0);
        assert.equal((err.stdout ?? "").trim(), "");
        return true;
      },
    );
  });
});
