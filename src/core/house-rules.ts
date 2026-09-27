/**
 * 考场规则（house rules）：与考题分离的产出格式约束。
 *
 * agent 型 CLI 倾向把 SVG 存成文件、只回一句“已保存到 …”，因此需要约束；但约束
 * 不能拼进提示词，提示词逐字不变是基准可比性的前提（见 prompt.ts）。规则以 agent
 * 指令文件的形式放进每次调用的工作目录，三家 CLI 读取的文件名不同，同一内容逐字
 * 写入全部文件名，保证各家面对相同的考场。
 */

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

/** 各家 CLI 在工作目录中查找的 agent 指令文件名 */
const INSTRUCTION_FILENAMES = ["AGENTS.md", "CLAUDE.md", "GEMINI.md"] as const;

/** 规则正文。与经典提示词同用英文，避免引入语言切换这一额外变量 */
export const HOUSE_RULES = `# Benchmark harness instructions

You are answering a single benchmark prompt. Nothing else is being asked of you.

- Put the complete SVG markup **inline in your final message**, as literal text.
- Do **not** create, write, or save any files. Do not report a file path.
- Do **not** use tools. Do not read the filesystem. Do not search the web.
- Do **not** ask clarifying questions and do not offer alternatives.
- The SVG must be self-contained: no external references, no scripts, no fonts
  loaded from the network.
- Prose around the SVG is fine, but the SVG itself must be present verbatim.
`;

/** 把规则逐字写入工作目录下的每个指令文件名，不按 CLI 区分 */
export async function installHouseRules(workdir: string): Promise<void> {
  await Promise.all(
    INSTRUCTION_FILENAMES.map((name) =>
      writeFile(join(workdir, name), HOUSE_RULES, "utf8"),
    ),
  );
}
