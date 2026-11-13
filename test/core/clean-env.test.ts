import test from "node:test";
import assert from "node:assert/strict";
import { cleanCliEnv } from "../../src/core/clean-env";

test("cleanCliEnv 剥离 SSH 相关环境变量，保留其他变量并追加 CI 与 NO_COLOR", () => {
  const inputEnv = {
    PATH: "/usr/bin:/bin",
    USER: "alice",
    SSH_CONNECTION: "127.0.0.1 12345 127.0.0.1 22",
    SSH_CLIENT: "127.0.0.1 12345 22",
    SSH_TTY: "/dev/ttys001",
  };

  const output = cleanCliEnv(inputEnv, { CUSTOM_KEY: "secret" });

  assert.equal(output.PATH, "/usr/bin:/bin");
  assert.equal(output.USER, "alice");
  assert.equal(output.NO_COLOR, "1");
  assert.equal(output.CI, "1");
  assert.equal(output.CUSTOM_KEY, "secret");
  assert.equal("SSH_CONNECTION" in output, false);
  assert.equal("SSH_CLIENT" in output, false);
  assert.equal("SSH_TTY" in output, false);
});
