/**
 * Claude Code 能力探针：只探测强度档位。
 *
 * claude 没有模型列举命令，`claude models` 会被当成提示词发起真实会话并消耗配额；
 * 模型清单由 catalog 从历史记录、内置候选与用户自定义补齐。
 */

import type { CliKind } from "../core/types";
import { parseEffortsFromHelp } from "./help-effort";
import { runProbeCommand } from "./probe-command";
import type { CapabilityProbe, ProbeResult } from "./types";

export const claudeProbe: CapabilityProbe = {
  cli: "claude" as CliKind,

  async probe(): Promise<ProbeResult> {
    const help = await runProbeCommand("claude", ["--help"]);
    if (!help.ok) {
      return {
        available: false,
        models: [],
        efforts: [],
        notes: [help.error ?? "claude 探测失败"],
      };
    }

    const efforts = parseEffortsFromHelp(help.stdout);
    const notes = ["claude 无模型列举命令，模型清单来自历史记录与内置候选"];
    if (efforts.length === 0) notes.push("未能从 --help 解析出强度档位");

    return { available: true, models: [], efforts, notes };
  },
};
