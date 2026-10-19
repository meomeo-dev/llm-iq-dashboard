/**
 * 模型指纹 CLI 参数解析与分层 `--help` 文本生成（src/bin/fingerprint-cli-args.ts）。
 */

import { isProbeId, PROBE_IDS, type ProbeId } from "../core/model-fingerprint/types";
import {
  CLI_KINDS,
  EFFORT_LEVELS,
  type CliKind,
  type EffortLevel,
} from "../core/types";
import {
  canonicalizeFlag,
  consumeFlagValue,
  expandEqualsTokens,
  extractGlobalPathFlags,
  formatCliError,
  normalizeMultiValueFlag,
  requireNonEmptyTrimmed,
  resolveModelAndDeclared,
  stripPnpmSeparators,
  suggestClosestMatch,
} from "./cli-args";

export type FingerprintCliCommand =
  | "status"
  | "fill"
  | "check"
  | "self-test"
  | "export"
  | "import";

export const VALID_CLI_COMMANDS: readonly FingerprintCliCommand[] = [
  "status",
  "fill",
  "check",
  "self-test",
  "export",
  "import",
];

export const VALID_FINGERPRINT_FLAGS: readonly string[] = [
  "--cli",
  "--clis",
  "--model",
  "--models",
  "--declared",
  "--effort",
  "--efforts",
  "--profile",
  "--profiles",
  "--probe",
  "--probes",
  "--count",
  "--exclude",
  "--include",
  "--id",
  "--out",
  "--file",
  "--reset",
  "--dry-run",
  "--yes",
  "-y",
  "--config",
  "-c",
  "--data-dir",
  "--help",
  "-h",
];

export interface ParsedFingerprintCliArgs {
  command: FingerprintCliCommand;
  cli?: CliKind;
  effort?: EffortLevel;
  profile?: string;
  model?: string;
  probes?: ProbeId[];
  count?: number;
  exclude?: string[];
  include?: string[];
  reset: boolean;
  dryRun: boolean;
  yes: boolean;
  checkId?: string;
  file?: string;
}

function isCliKind(value: string): value is CliKind {
  return (CLI_KINDS as readonly string[]).includes(value);
}

function isEffortLevel(value: string): value is EffortLevel {
  return (EFFORT_LEVELS as readonly string[]).includes(value);
}

function parseProbesList(existing: readonly ProbeId[] | undefined, raw: string): ProbeId[] {
  const tokens = normalizeMultiValueFlag(existing, raw, "--probes");
  const out: ProbeId[] = [];
  for (const item of tokens) {
    if (!isProbeId(item)) {
      const suggestion = suggestClosestMatch(item, PROBE_IDS, 2);
      const hint = suggestion ? `（您是否想输入 ${suggestion}？）` : "";
      throw new Error(`未知探针 ID：${item}${hint}（可选：${PROBE_IDS.join(", ")}）`);
    }
    if (!out.includes(item)) out.push(item);
  }
  return out;
}

interface RawFlagAccumulator {
  modelList?: string[];
  declaredList?: string[];
}

function applyBooleanOrPositionalArg(
  parsed: ParsedFingerprintCliArgs,
  argItem: string,
): boolean {
  if (argItem === "--reset") {
    parsed.reset = true;
    return true;
  }
  if (argItem === "--dry-run") {
    parsed.dryRun = true;
    return true;
  }
  if (canonicalizeFlag(argItem) === "--yes") {
    parsed.yes = true;
    return true;
  }
  if (!argItem.startsWith("-")) {
    if (parsed.command === "import" && parsed.file === undefined) {
      parsed.file = requireNonEmptyTrimmed("<bundlePath>", argItem);
      return true;
    }
    throw new Error(`无法识别的位置参数：${argItem}`);
  }
  return false;
}

function applyKeyValueFlag(
  parsed: ParsedFingerprintCliArgs,
  acc: RawFlagAccumulator,
  rawFlag: string,
  value: string,
): void {
  const flag = canonicalizeFlag(rawFlag);
  if (flag === "--cli") {
    if (!isCliKind(value)) throw new Error(`无效 --cli：${value}（可选：${CLI_KINDS.join(", ")}）`);
    parsed.cli = value;
  } else if (flag === "--effort") {
    if (!isEffortLevel(value)) {
      throw new Error(`无效 --effort：${value}（可选：${EFFORT_LEVELS.join(", ")}）`);
    }
    parsed.effort = value;
  } else if (flag === "--profile") {
    parsed.profile = requireNonEmptyTrimmed(rawFlag, value);
  } else if (flag === "--model") {
    acc.modelList = normalizeMultiValueFlag(acc.modelList, value, rawFlag);
  } else if (rawFlag === "--declared") {
    acc.declaredList = normalizeMultiValueFlag(acc.declaredList, value, rawFlag);
  } else if (flag === "--probe") {
    parsed.probes = parseProbesList(parsed.probes, value);
  } else if (flag === "--count") {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 0) {
      throw new Error(`--count 必须为非负整数，收到：${value}`);
    }
    parsed.count = num;
  } else if (flag === "--exclude") {
    parsed.exclude = normalizeMultiValueFlag(parsed.exclude, value, rawFlag);
  } else if (flag === "--include") {
    parsed.include = normalizeMultiValueFlag(parsed.include, value, rawFlag);
  } else if (flag === "--id") {
    parsed.checkId = requireNonEmptyTrimmed(rawFlag, value);
  } else if (flag === "--out" || flag === "--file") {
    parsed.file = requireNonEmptyTrimmed(rawFlag, value);
  } else {
    throw new Error(formatCliError(rawFlag, VALID_FINGERPRINT_FLAGS, "pnpm fingerprint --help"));
  }
}

function validateParsedCommandArgs(parsed: ParsedFingerprintCliArgs): void {
  if (parsed.reset) {
    if (parsed.cli === undefined || !parsed.model || (parsed.probes?.length ?? 0) === 0) {
      throw new Error("--reset 必须同时显式指定 --cli <cli>、--model <model> 与 --probes <probe,...>");
    }
  }
  if (parsed.command === "check" || parsed.command === "export") {
    if (!parsed.model) {
      throw new Error(`${parsed.command} 子命令必须显式指定 --cli <cli> 与 --model <model>`);
    }
  }
  if (parsed.command === "import" && !parsed.file) {
    throw new Error("import 子命令必须指定 <bundlePath> 或 --file <bundlePath>");
  }
}

export function parseFingerprintCliArgs(argv: readonly string[]): ParsedFingerprintCliArgs {
  const argsList = expandEqualsTokens(stripPnpmSeparators(extractGlobalPathFlags(argv)));
  const cmdRaw = argsList[0];
  if (cmdRaw === "rescore") {
    throw new Error("模型指纹历史核验重算回填命令（rescore）已停用");
  }
  if (!cmdRaw || !VALID_CLI_COMMANDS.includes(cmdRaw as FingerprintCliCommand)) {
    const suggestion = cmdRaw ? suggestClosestMatch(cmdRaw, VALID_CLI_COMMANDS, 2) : null;
    const hint = suggestion ? `，您是否想输入 ${suggestion}？` : "";
    throw new Error(
      `未知或缺失子命令：${String(cmdRaw ?? "")}（可选：${VALID_CLI_COMMANDS.join(" | ")}${hint}）`,
    );
  }

  const parsed: ParsedFingerprintCliArgs = {
    command: cmdRaw as FingerprintCliCommand,
    reset: false,
    dryRun: false,
    yes: false,
  };
  const acc: RawFlagAccumulator = {};

  for (let i = 1; i < argsList.length; i += 1) {
    const argItem = argsList[i]!;
    if (applyBooleanOrPositionalArg(parsed, argItem)) continue;
    if (!argItem.startsWith("--")) {
      throw new Error(formatCliError(argItem, VALID_FINGERPRINT_FLAGS, "pnpm fingerprint --help"));
    }
    const value = consumeFlagValue(argsList, i, argItem);
    applyKeyValueFlag(parsed, acc, argItem, value);
    i += 1;
  }

  const resolvedModels = resolveModelAndDeclared(acc.modelList, acc.declaredList);
  if (resolvedModels?.length) {
    parsed.model = resolvedModels[0];
  }
  validateParsedCommandArgs(parsed);
  return parsed;
}

export function formatFingerprintHelp(subcommand?: string): string {
  const sub = subcommand && VALID_CLI_COMMANDS.includes(subcommand as FingerprintCliCommand)
    ? (subcommand as FingerprintCliCommand)
    : undefined;
  return [
    `用法: pnpm fingerprint ${sub ?? "<command>"} [options]`,
    `别名: pnpm pelican fingerprint (或 fp) ${sub ?? "<command>"} [options]`,
    "",
    "子命令:",
    "  status                  查看本地基准样本集充足度、收敛度与补齐预计费用",
    "  fill                    采集并补齐基准样本集缺口（真实调用模型）",
    "  check                   对指定模型执行一致性指纹核验（真实调用模型）",
    "  self-test               基于本地样本执行无重叠留出自检与对偶区分度评估",
    "  export                  导出脱敏后的基准样本包（.tgz）",
    "  import <bundlePath>     校验并导入基准样本包（支持 --dry-run 预演）",
    "",
    "目标与探针选项:",
    `  --cli <${CLI_KINDS.join("|")}>        指定 CLI（仅传 --model 时可自动反查）`,
    "  --model <model>         指定模型 ID（同义别名: --models, --declared）",
    `  --effort <level>        临时覆盖采样/核验思考强度（${EFFORT_LEVELS.join("|")}）`,
    "  --profile <name>        指定上游渠道 Profile（缺省为 default 登录态）",
    `  --probe <id,...>        过滤探针（${PROBE_IDS.join(",")}；别名: --probes）`,
    "",
    "动作与安全护栏选项:",
    "  --count <n>             限制 fill 单探针本次最多新增有效样本数（0 仅改排除标记）",
    "  --exclude <reqId,...>   标记排除指定 reqId 的历史样本",
    "  --include <reqId,...>   恢复被排除的 reqId 样本",
    "  --reset                 重置指定 (--cli, --model, --probes) 的样本集",
    "  --out, --file <path>    export 输出路径或 import 输入路径",
    "  --dry-run               仅预演调用计划与预计费用，不发起模型调用或落盘",
    "  -y, --yes               跳过交互式 [y/N] 确认（非 TTY 自动化必填）",
    "  -c, --config <path>     覆盖配置文件路径（同 PELICAN_CONFIG）",
    "  --data-dir <path>       覆盖数据目录路径（同 PELICAN_DATA_DIR）",
    "  -h, --help              显示此帮助信息并退出",
    "",
    "示例:",
    "  pnpm fingerprint status --cli agy --model gemini-3.8-flash --effort low",
    "  pnpm fingerprint fill --cli agy --model gemini-3.8-flash --probe uuid --dry-run",
    "  pnpm fingerprint check --cli agy --model gemini-3.8-flash --probe uuid --yes",
  ].join("\n");
}
