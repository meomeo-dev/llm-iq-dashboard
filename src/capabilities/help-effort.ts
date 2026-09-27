/**
 * 从 `--help` 文本中解析思考强度的取值列表，使强度档位随 CLI 升级自动更新。
 *
 * 取值都在紧跟 `--effort` 的第一对括号里：
 *   claude: `--effort <level>  Effort level for the current session (low, medium, high, xhigh, max)`
 *   agy:    `--effort          Reasoning effort for the current CLI session (low|medium|high)`
 */

import { EFFORT_LEVELS, type EffortLevel } from "../core/types";

const FLAG = "--effort";

/**
 * flag 之后的解析窗口（字符数）：足够覆盖含折行缩进的一条说明，
 * 又不至于抓到下一个 flag 的括号。
 */
const WINDOW = 300;

export function parseEffortsFromHelp(help: string): EffortLevel[] {
  const flagAt = help.indexOf(FLAG);
  if (flagAt === -1) return [];

  const window = help.slice(flagAt + FLAG.length, flagAt + FLAG.length + WINDOW);
  const open = window.indexOf("(");
  if (open === -1) return [];
  const close = window.indexOf(")", open);
  if (close === -1) return [];

  // 分隔符可能是逗号、竖线或斜杠
  return splitTokens(window.slice(open + 1, close)).filter(isEffortLevel);
}

function splitTokens(inner: string): string[] {
  const tokens: string[] = [];
  let current = "";

  for (const ch of inner) {
    if (ch === "," || ch === "|" || ch === "/") {
      tokens.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  tokens.push(current);

  return tokens.map((token) => token.trim().toLowerCase()).filter((t) => t !== "");
}

/** 只保留已登记的档位；抓错括号时结果为空，调用方据此回退到内置默认 */
function isEffortLevel(token: string): token is EffortLevel {
  return (EFFORT_LEVELS as readonly string[]).includes(token);
}
