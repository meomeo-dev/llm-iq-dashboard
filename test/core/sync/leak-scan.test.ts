/**
 * 共享泄漏扫描规则（leak-scan）的测试。
 * 覆盖四条规则的正例与反例（含反例 desk-lamp-base-gradient-highlight-01）。
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkSecretPattern,
  sanitizeLocalPaths,
  scanText,
} from "@/core/sync/leak-scan";
import { leakGuardFromText } from "@/core/leak-guard";

describe("leak-scan 泄漏扫描规则", () => {
  describe("1. 本机绝对路径（local-path）", () => {
    it("命中 macOS / Linux / Windows / root 格式路径", () => {
      assert.equal(scanText("/Users/alice/projects/app").leaked, true);
      assert.equal(scanText("/home/bob/workspace/test").leaked, true);
      assert.equal(scanText("/root/data/file.txt").leaked, true);
      assert.equal(scanText("C:\\Users\\charlie\\code").leaked, true);
      assert.equal(scanText("d:/Users/david/repo").leaked, true);
    });

    it("不命中常规路径与非用户目录", () => {
      assert.equal(scanText("/usr/local/bin/node").leaked, false);
      assert.equal(scanText("/tmp/scratch/file").leaked, false);
      assert.equal(scanText("~/projects/my-app").leaked, false);
      assert.equal(scanText("https://example.com/Users/doc").leaked, false);
    });

    it("sanitizeLocalPaths 替换为 ~ 形式后不再触发 local-path", () => {
      const original = "Error at /Users/alice/project/main.ts and /home/bob/test.ts";
      const sanitized = sanitizeLocalPaths(original);
      assert.equal(sanitized, "Error at ~/project/main.ts and ~/test.ts");
      assert.equal(scanText(sanitized).leaked, false);

      const winPath = "File: C:\\Users\\charlie\\data.json";
      const winSanitized = sanitizeLocalPaths(winPath);
      assert.equal(winSanitized, "File: ~\\data.json");
      assert.equal(scanText(winSanitized).leaked, false);
    });
  });

  describe("2. 私钥块（private-key）", () => {
    it("命中各种格式的私钥块", () => {
      assert.equal(scanText("-----BEGIN RSA PRIVATE KEY-----\nMIIE...").leaked, true);
      assert.equal(
        scanText("-----BEGIN OPENSSH PRIVATE KEY-----\nb3Bl...").leaked,
        true,
      );
      assert.equal(scanText("-----BEGIN EC PRIVATE KEY-----\nMHQC...").leaked, true);
    });

    it("不命中公钥或证书块", () => {
      assert.equal(scanText("-----BEGIN CERTIFICATE-----\nMIIE...").leaked, false);
      assert.equal(scanText("-----BEGIN PUBLIC KEY-----\nMIIB...").leaked, false);
    });
  });

  describe("3. 令牌样式（secret-pattern）", () => {
    it("sk- / sk-ant- / sk-proj-：含数字与大写字母时命中，纯小写或非令牌不命中", () => {
      const validSecret = "sk-ant-api03-1234567890ABCDEF1234567890abcdef";
      assert.equal(checkSecretPattern(validSecret), true);

      // 反例：不含大写字母或不以 secret 前缀独立开头
      assert.equal(
        checkSecretPattern("sk-ant-api03-1234567890abcdef1234567890abcdef"),
        false,
      );
      assert.equal(checkSecretPattern("desk-lamp-base-gradient-highlight-01"), false);
      assert.equal(checkSecretPattern("my-custom-sk-key-without-length"), false);
    });

    it("GitHub tokens: ghp_ 与 github_pat_", () => {
      assert.equal(
        checkSecretPattern("ghp_123456789012345678901234567890123456"),
        true,
      );
      assert.equal(
        checkSecretPattern("github_pat_11AAAAAAA0000000000000000000000"),
        true,
      );
      // 反例：长度不足或字符不合法
      assert.equal(checkSecretPattern("ghp_short"), false);
      assert.equal(checkSecretPattern("github_pat_short"), false);
    });

    it("AWS AKIA", () => {
      assert.equal(checkSecretPattern("AKIAIOSFODNN7EXAMPLE"), true);
      assert.equal(checkSecretPattern("AKIA123"), false);
      assert.equal(checkSecretPattern("not_AKIAIOSFODNN7EXAMPLE"), false);
    });

    it("Slack tokens", () => {
      assert.equal(checkSecretPattern("xoxb-1234567890-abcdef1234"), true);
      assert.equal(checkSecretPattern("xoxb-short"), false);
    });

    it("Google AIza", () => {
      assert.equal(
        checkSecretPattern("AIzaSyA12345678901234567890123456789012"),
        true,
      );
      assert.equal(checkSecretPattern("AIzaSyShort"), false);
    });

    it("Bearer token", () => {
      assert.equal(
        checkSecretPattern("Bearer abcdef1234567890ABCDEF1234"),
        true,
      );
      assert.equal(checkSecretPattern("Bearer short_token"), false);
    });

    it("JWT: eyJ 开头的三段格式", () => {
      const jwt =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0." +
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      assert.equal(checkSecretPattern(jwt), true);

      // 反例：仅两段
      assert.equal(checkSecretPattern("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz"), false);
    });
  });

  describe("4. 凭据指纹库（leak-guard）", () => {
    it("命中传入的 leakGuard 凭据指纹", () => {
      const guard = leakGuardFromText(["my-super-secret-token-1234567890"]);
      const hit = scanText(
        "Some random output containing my-super-secret-token-1234567890 embedded",
        guard,
      );
      assert.equal(hit.leaked, true);
      if (hit.leaked) {
        assert.equal(hit.reason, "leak-guard");
      }
    });

    it("正常内容不触发 leak-guard", () => {
      const guard = leakGuardFromText(["my-super-secret-token-1234567890"]);
      const hit = scanText("<svg>Normal clean svg content</svg>", guard);
      assert.equal(hit.leaked, false);
    });
  });
});
