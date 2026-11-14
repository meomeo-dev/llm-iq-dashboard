import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { runDir } from "./paths";
import { listRunIds } from "./store";

const RECENT_RUNS_FOR_REVISION = 3;
const RUN_FILE = "run.json";
const JUDGE_SUFFIX = ".judge.json";

/**
 * 计算本地轮次集合与最近轮次结果文件（run.json / *.judge.json）的轻量修订标记。
 * 只读取目录列表与文件 stat，不读 JSON 全文，供 SSE 推送变更与增量接口对照。
 */
export async function computeRunsRevision(): Promise<string> {
  const ids = await listRunIds();
  const recentMarks = await Promise.all(ids.slice(0, RECENT_RUNS_FOR_REVISION).map(runFilesStamp));
  return `${ids.length}:${ids[0] ?? ""}:${ids[ids.length - 1] ?? ""}|${recentMarks.join("|")}`;
}

async function runFilesStamp(runId: string): Promise<string> {
  const dir = runDir(runId);
  let files: string[];
  try {
    files = (await readdir(dir)).filter((name) => name === RUN_FILE || name.endsWith(JUDGE_SUFFIX)).sort();
  } catch {
    return runId;
  }
  const stamps = await Promise.all(
    files.map(async (name) => {
      try {
        const info = await stat(join(dir, name));
        return `${name}=${info.mtimeMs}:${info.size}`;
      } catch {
        return name;
      }
    }),
  );
  return `${runId}[${stamps.join(",")}]`;
}
