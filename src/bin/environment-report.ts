/**
 * 环境汇总：`pnpm preflight` 与 `pnpm onboard` 结束时共用。
 *
 * 检查 Node 版本、配置、各家 CLI 安装与登录、价格目录，并按历史估算每轮成本。不调用
 * 模型；仅写入两处：配置不存在时按起步模板生成，CLI 检查结果写入 data/readiness.json。
 */

import { checkAndRecord } from "../capabilities/readiness-cache";
import { forecastRound, usd } from "../core/budget";
import { commandHint } from "../core/command-hint";
import { loadConfig, type AppConfig } from "../core/config";
import { loadCostHistory } from "../core/cost-history";
import { configPath } from "../core/paths";
import { CLI_KINDS } from "../core/types";
import { loadPriceCatalog } from "../pricing/catalog-files";

const MIN_NODE_MAJOR = 22;

type Mark = "✓" | "✗" | "?" | "·";

/** 本次汇总是否出现 ✗（配置用到的项目有问题） */
let failed = false;
function report(mark: Mark, text: string): void {
  if (mark === "✗") failed = true;
  console.log(`${mark} ${text}`);
}

function checkNode(): void {
  const major = Number(process.versions.node.split(".")[0]);
  if (major >= MIN_NODE_MAJOR) report("✓", `Node ${process.versions.node}`);
  else report("✗", `Node ${process.versions.node}：需要 ${MIN_NODE_MAJOR} 或更高（见 .nvmrc）`);
}

function checkConfig(): AppConfig | null {
  const path = configPath();
  try {
    const config = loadConfig(path);
    report("✓", `配置 ${path}：${config.targets.length} 个目标 × ${config.run.promptIds.length} 道题`);
    return config;
  } catch (cause) {
    report("✗", cause instanceof Error ? cause.message : String(cause));
    return null;
  }
}

/** 配置用到的 CLI 有问题才算失败；没用到的只列出状态，供加目标前参考 */
async function checkClis(config: AppConfig | null): Promise<void> {
  const results = await checkAndRecord(CLI_KINDS);
  for (const readiness of results) {
    const used = config?.targets.filter((target) => target.cli === readiness.cli).length ?? 0;
    const scope = config === null ? "" : used > 0 ? `（${used} 个目标）` : "（配置未使用）";
    const detail = readiness.detail ?? "已安装并登录";
    if (readiness.state === "ready") report("✓", `${readiness.cli}${scope}：${detail}`);
    else if (readiness.state === "unverified") report("?", `${readiness.cli}${scope}：${detail}`);
    else report(used > 0 || config === null ? "✗" : "·", `${readiness.cli}${scope}：${detail}`);
  }
}

function checkPricing(): void {
  const catalog = loadPriceCatalog();
  if (catalog !== null) report("✓", `价格目录 ${catalog.tag}`);
  else report("?", `价格目录未同步，成本将显示为“—”、预算不生效：运行 ${commandHint("pnpm pricing:sync")}`);
}

async function checkBudget(config: AppConfig): Promise<void> {
  const history = await loadCostHistory();
  const forecast = forecastRound(config.targets.map((target) => target.id), config.run.promptIds.length, history.expected);
  const unpriced = forecast.unpricedCalls > 0 ? `（另有 ${forecast.unpricedCalls} 次暂无价格参考）` : "";
  const { perRoundUsd, perDayUsd } = config.budget;
  const caps =
    perRoundUsd === null && perDayUsd === null
      ? "未设预算上限"
      : `上限：每轮 ${perRoundUsd === null ? "不限" : usd(perRoundUsd)}，每日 ${perDayUsd === null ? "不限" : usd(perDayUsd)}`;
  console.log(`· 每轮 ${forecast.calls} 次调用，预计 ≈ ${usd(forecast.usd)}${unpriced}；24 小时内已用 ${usd(history.spentLastDayUsd)}；${caps}`);
}

/** 打印全部检查项；配置用到的项目都没问题时返回 true */
export async function reportEnvironment(): Promise<boolean> {
  failed = false;
  checkNode();
  const config = checkConfig();
  await checkClis(config);
  checkPricing();
  if (config !== null) await checkBudget(config);
  return !failed;
}
