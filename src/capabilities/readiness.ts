/**
 * CLI 就绪预检：是否已安装、是否已登录，未就绪时给出安装或登录命令。
 *
 * 只拦确定的问题：预检命令本身失败（超时、断网、输出格式变化）记为 unverified
 * 并放行，因为误拦可用的 CLI 比多一次失败调用代价更大。
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { commandHint, runsInContainer } from "../core/command-hint";
import type { CliKind } from "../core/types";
import { runProbeCommand, type CommandOutput } from "./probe-command";

export type ReadinessState = "ready" | "missing" | "signed-out" | "unverified";

export interface CliReadiness {
  cli: CliKind;
  state: ReadinessState;
  /** 给人看的说明；missing / signed-out 时含安装或登录命令 */
  detail: string | null;
}

interface CliGuide {
  install: string;
  /** 设置了这些环境变量时，CLI 直接用密钥鉴权，不依赖登录态 */
  keyEnv: readonly string[];
  statusArgs: readonly string[];
  /** 从登录状态命令的输出判断是否已登录；判断不了返回 null */
  signedIn: (output: CommandOutput) => boolean | null;
  /**
   * 本机是否留有可自动续期的登录凭据；没有离线判断手段的 CLI 缺省。
   * 有凭据时状态命令报"未登录"多半是联网续期失败，按 unverified 放行而不是拦下。
   */
  localCredential?: () => Promise<boolean>;
}

const GUIDES: Readonly<Record<CliKind, CliGuide>> = {
  claude: {
    install: "npm install -g @anthropic-ai/claude-code",
    keyEnv: ["ANTHROPIC_API_KEY", "CLAUDE_CODE_OAUTH_TOKEN"],
    statusArgs: ["auth", "status"],
    signedIn: claudeSignedIn,
  },
  codex: {
    install: "npm install -g @openai/codex",
    keyEnv: ["OPENAI_API_KEY", "CODEX_API_KEY"],
    statusArgs: ["login", "status"],
    signedIn: codexSignedIn,
  },
  agy: {
    install: "curl -fsSL https://antigravity.google/cli/install.sh | bash",
    keyEnv: [],
    // agy 没有登录状态命令；列模型需要登录，未登录时明确提示 sign in
    statusArgs: ["models"],
    signedIn: agySignedIn,
    localCredential: agyHasRefreshToken,
  },
};

/** agy 的 OAuth 凭据文件；带 refresh_token 即可在联网时自动续期，无需再登录 */
const AGY_TOKEN_FILE = join(homedir(), ".gemini", "antigravity-cli", "antigravity-oauth-token");

export async function agyHasRefreshToken(tokenFile: string = AGY_TOKEN_FILE): Promise<boolean> {
  try {
    const parsed = JSON.parse(await readFile(tokenFile, "utf8")) as { token?: { refresh_token?: unknown } };
    return typeof parsed.token?.refresh_token === "string" && parsed.token.refresh_token !== "";
  } catch {
    return false;
  }
}

/** `claude auth status` 输出 JSON，loggedIn 为布尔值；未登录时同样以 0 退出 */
export function claudeSignedIn(output: CommandOutput): boolean | null {
  try {
    const status = JSON.parse(output.stdout) as { loggedIn?: unknown };
    return typeof status.loggedIn === "boolean" ? status.loggedIn : null;
  } catch {
    return null;
  }
}

/** `codex login status`：已登录为 "Logged in using …"，未登录为 "Not logged in" */
export function codexSignedIn(output: CommandOutput): boolean | null {
  const text = output.stdout.toLowerCase();
  if (text.includes("not logged in")) return false;
  if (text.includes("logged in")) return true;
  return null;
}

/** `agy models` 未登录时打印 "Please sign in …" 并以 0 退出；能列出模型即已登录 */
export function agySignedIn(output: CommandOutput): boolean | null {
  if (output.stdout.includes("Please sign in")) return false;
  if (output.error === null && output.ok) return true;
  return null;
}

/**
 * 把一次登录状态查询的结果归类（纯函数）。
 *
 * 提示里的命令可在用户终端直接执行：登录指向 `pnpm onboard <cli>`；容器部署时
 * 带 `docker exec` 前缀，缺 CLI 则提示运行容器内的安装脚本。
 */
export function classifyReadiness(
  cli: CliKind,
  output: CommandOutput,
  env: Readonly<Record<string, string | undefined>> = process.env,
  hasLocalCredential = false,
): CliReadiness {
  const guide = GUIDES[cli];
  if (output.notFound) {
    const install = runsInContainer(env)
      ? `${cli} 未安装。安装：${commandHint("sh docker/install-clis.sh", env)}`
      : `${cli} 不在 PATH 中。安装：${guide.install}`;
    return { cli, state: "missing", detail: install };
  }
  const signedIn = guide.signedIn(output);
  if (signedIn === true) return { cli, state: "ready", detail: null };

  const keyVar = guide.keyEnv.find((name) => (env[name] ?? "").trim() !== "");
  if (keyVar !== undefined) {
    return { cli, state: "ready", detail: `未登录，但已设置 ${keyVar}，按密钥鉴权` };
  }
  if (signedIn === false && hasLocalCredential) {
    return {
      cli,
      state: "unverified",
      detail: `${cli} 报告未登录，但本机仍有可续期的登录凭据，多为网络波动；照常发起调用`,
    };
  }
  if (signedIn === false) {
    return { cli, state: "signed-out", detail: `${cli} 未登录。登录：${commandHint(`pnpm onboard ${cli}`, env)}` };
  }
  const reason = output.error ?? "输出无法识别";
  return { cli, state: "unverified", detail: `无法确认 ${cli} 的登录状态（${reason}），照常发起调用` };
}

export async function checkReadiness(cli: CliKind): Promise<CliReadiness> {
  const guide = GUIDES[cli];
  const [output, hasLocalCredential] = await Promise.all([
    runProbeCommand(cli, [...guide.statusArgs]),
    guide.localCredential?.() ?? Promise.resolve(false),
  ]);
  return classifyReadiness(cli, output, process.env, hasLocalCredential);
}

/** 只有确定的问题才拦下该 CLI 的调用，见文件头 */
export function blocksCalls(readiness: CliReadiness): boolean {
  return readiness.state === "missing" || readiness.state === "signed-out";
}
