/**
 * 模型指纹命令行主入口（src/bin/model-fingerprint.ts）：
 * 支持 status | fill | check | self-test | export | import 六个子命令。
 */

import { pathToFileURL } from "node:url";
import { readCachedCatalog } from "../capabilities/catalog";
import { inferCliForModel } from "../core/cli-run-selection";
import { loadConfig, resolveModelFingerprintConfig, type AppConfig } from "../core/config";
import { listAllSampleSets } from "../core/model-fingerprint/store";
import { configPath } from "../core/paths";
import { extractGlobalPathFlags, hasHelpFlag, stripPnpmSeparators } from "./cli-args";
import {
  formatFingerprintHelp,
  parseFingerprintCliArgs,
  VALID_CLI_COMMANDS,
  type FingerprintCliCommand,
  type ParsedFingerprintCliArgs,
} from "./fingerprint-cli-args";
import {
  handleCheckCommand,
  handleExportCommand,
  handleFillCommand,
  handleImportCommand,
  handleSelfTestCommand,
  handleStatusCommand,
  type FingerprintCliDeps,
} from "./fingerprint-cli-handlers";

export {
  formatFingerprintHelp,
  parseFingerprintCliArgs,
  type FingerprintCliCommand,
  type FingerprintCliDeps,
  type ParsedFingerprintCliArgs,
};

function applyEffortOverride(config: AppConfig, args: ParsedFingerprintCliArgs): AppConfig {
  if (!args.effort) return config;
  const resolved = resolveModelFingerprintConfig(config);
  return {
    ...config,
    modelFingerprint: {
      ...resolved,
      effort: args.effort,
    },
  };
}

async function ensureCliResolvedForModel(
  config: AppConfig,
  args: ParsedFingerprintCliArgs,
  deps: FingerprintCliDeps,
): Promise<void> {
  if (args.cli !== undefined || !args.model) return;
  const fpCfg = resolveModelFingerprintConfig(config);
  const diskSets = await listAllSampleSets({ appliedEffort: fpCfg.effort, model: args.model });
  const catalog = await (deps.collectDeps?.loadCapabilityCatalog ?? readCachedCatalog)();
  args.cli = inferCliForModel(args.model, config, catalog, [
    ...fpCfg.references,
    ...diskSets.map((s) => ({ cli: s.cli, model: s.model })),
  ]);
}

export async function runModelFingerprintCli(
  argv: readonly string[],
  deps: FingerprintCliDeps = {},
): Promise<void> {
  const writeLine = deps.writeLine ?? ((line: string) => console.log(line));
  const rawStripped = stripPnpmSeparators(argv);
  if (rawStripped.includes("rescore")) {
    throw new Error("模型指纹历史核验重算回填命令（rescore）已停用");
  }
  if (rawStripped.length === 0 || hasHelpFlag(rawStripped)) {
    const sub = rawStripped.find((t) =>
      (VALID_CLI_COMMANDS as readonly string[]).includes(t),
    );
    writeLine(formatFingerprintHelp(sub));
    return;
  }

  const remainingArgv = extractGlobalPathFlags(argv);
  const args = parseFingerprintCliArgs(remainingArgv);
  const baseConfig = await (deps.loadConfig ? deps.loadConfig() : loadConfig(configPath()));
  const config = applyEffortOverride(baseConfig, args);
  await ensureCliResolvedForModel(config, args, deps);

  switch (args.command) {
    case "status":
      await handleStatusCommand(config, args, writeLine);
      break;
    case "fill":
      await handleFillCommand(config, args, deps, writeLine);
      break;
    case "check":
      await handleCheckCommand(config, args, deps, writeLine);
      break;
    case "self-test":
      await handleSelfTestCommand(config, args, writeLine);
      break;
    case "export":
      await handleExportCommand(config, args, writeLine);
      break;
    case "import":
      await handleImportCommand(config, args, writeLine);
      break;
  }
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  runModelFingerprintCli(process.argv.slice(2)).catch((err: unknown) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  });
}
