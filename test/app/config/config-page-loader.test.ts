import test from "node:test";
import assert from "node:assert/strict";
import { loadAppConfigSafely } from "@/app/config/config-page-loader";

test("config-page-loader: loadAppConfigSafely", async (t) => {
  await t.test("returns loadError when config path is invalid", () => {
    const res = loadAppConfigSafely("/nonexistent/path/config.yaml");
    assert.strictEqual(res.config, undefined);
    assert.ok(typeof res.loadError === "string");
  });
});
