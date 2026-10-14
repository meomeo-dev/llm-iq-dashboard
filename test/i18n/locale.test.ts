import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_LOCALE,
  formatText,
  getMessages,
  isLocale,
  resolveLocale,
} from "../../src/i18n";

function collectLeafEntries(
  obj: unknown,
  prefix = "",
): Array<{ path: string; value: string }> {
  if (typeof obj === "string") {
    return [{ path: prefix, value: obj }];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((item, idx) => collectLeafEntries(item, `${prefix}[${idx}]`));
  }
  if (obj !== null && typeof obj === "object") {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      collectLeafEntries(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [];
}

describe("i18n core locale resolution and dictionary symmetry", () => {
  it("validates supported locale tags with isLocale", () => {
    assert.equal(isLocale("en"), true);
    assert.equal(isLocale("zh-CN"), true);
    assert.equal(isLocale("fr"), false);
    assert.equal(isLocale(null), false);
  });

  it("prioritizes explicit cookie/localStorage locale over Accept-Language", () => {
    assert.equal(resolveLocale("zh-CN", "en-US,en;q=0.9"), "zh-CN");
    assert.equal(resolveLocale("en", "zh-CN,zh;q=0.9"), "en");
    assert.equal(resolveLocale("zh-TW", "en-US,en;q=0.9"), "zh-CN");
  });

  it("negotiates Accept-Language by q-weight and falls back to DEFAULT_LOCALE (en)", () => {
    assert.equal(resolveLocale(null, "zh-CN,zh;q=0.9,en;q=0.8"), "zh-CN");
    assert.equal(resolveLocale(null, "en-US,en;q=0.9,zh-CN;q=0.7"), "en");
    assert.equal(resolveLocale(null, "zh;q=0.4,en;q=0.9"), "en");
    assert.equal(resolveLocale(null, "fr-FR,de;q=0.8"), DEFAULT_LOCALE);
    assert.equal(resolveLocale(undefined, undefined), "en");
  });

  it("interpolates {key} placeholders with formatText", () => {
    assert.equal(
      formatText("Requested {requested} -> {applied}", {
        requested: "max",
        applied: "high",
      }),
      "Requested max -> high",
    );
    assert.equal(formatText("No params"), "No params");
  });

  it("ensures en and zh-CN dictionaries have 100% identical key paths and non-empty strings", () => {
    const enLeaves = collectLeafEntries(getMessages("en"));
    const zhLeaves = collectLeafEntries(getMessages("zh-CN"));

    assert.equal(enLeaves.length, zhLeaves.length);
    assert.ok(enLeaves.length > 80, "expected at least 80 dictionary leaf entries");

    const zhMap = new Map(zhLeaves.map((item) => [item.path, item.value]));
    for (const { path, value } of enLeaves) {
      assert.ok(value.trim().length > 0, `empty en value at ${path}`);
      const zhVal = zhMap.get(path);
      assert.ok(zhVal !== undefined, `missing zh-CN key at ${path}`);
      assert.ok(zhVal.trim().length > 0, `empty zh-CN value at ${path}`);
    }
  });
});
