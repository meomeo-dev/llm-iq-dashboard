/** 联系图读取：文件名校验与缺失处理，在临时 PELICAN_DATA_DIR 下运行 */

import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, test } from "node:test";
import { loadContactSheet } from "@/core/judge/judge-store";

const ENV_DATA_DIR = "PELICAN_DATA_DIR";
let previous: string | undefined;
let root: string;

beforeEach(async () => {
  previous = process.env[ENV_DATA_DIR];
  root = await mkdtemp(join(tmpdir(), "judge-store-"));
  process.env[ENV_DATA_DIR] = root;
  await mkdir(join(root, "runs", "20260930T000000Z"), { recursive: true });
  await writeFile(join(root, "runs", "20260930T000000Z", "k.sheet.png"), Buffer.from("png"));
  await writeFile(join(root, "runs", "20260930T000000Z", "k.sheet.crank.png"), Buffer.from("crank"));
});

afterEach(() => {
  if (previous === undefined) delete process.env[ENV_DATA_DIR];
  else process.env[ENV_DATA_DIR] = previous;
});

describe("loadContactSheet", () => {
  test("帧序表与细节表都能读到", async () => {
    assert.equal((await loadContactSheet("20260930T000000Z", "k.sheet.png"))?.toString(), "png");
    assert.equal((await loadContactSheet("20260930T000000Z", "k.sheet.crank.png"))?.toString(), "crank");
  });

  test("不合规的文件名或 runId 不读文件系统", async () => {
    assert.equal(await loadContactSheet("20260930T000000Z", "../k.sheet.png"), null);
    assert.equal(await loadContactSheet("20260930T000000Z", "k.svg"), null);
    assert.equal(await loadContactSheet("../etc", "k.sheet.png"), null);
  });

  test("文件不存在时为 null", async () => {
    assert.equal(await loadContactSheet("20260930T000000Z", "missing.sheet.png"), null);
  });
});
