/**
 * 非默认 profile 的 codex 运行目录：每个 profile 一个临时目录，同时作 `CODEX_HOME` 与 `HOME`。
 *
 * 隔离边界落在进程上：该 profile 的 app-server 只看得到这个目录里生成的 `config.toml`
 * 和自己环境里的 key。登录卷 `~/.codex` 不可见（`HOME` 也换掉，`~/.agents`、`~/.cache`
 * 同样指向临时目录），其他 profile 的 key 从不进入本进程环境。
 *
 * key 只经环境变量交给子进程，不写进任何文件；目录在会话结束时删除。
 */

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ProfileLaunch } from "./types";

/** codex 按 `env_key` 从进程环境读 key；名字与任何官方变量都不重名，避免误用宿主机的 key */
export const PROFILE_KEY_ENV = "PELICAN_PROFILE_KEY";
/** 生成的 config.toml 里的 provider id；codex 内置的 openai 等 id 不可覆盖 */
export const PROFILE_PROVIDER_ID = "pelican";

export interface ProfileHome {
  dir: string;
  /** 叠加在宿主机环境之上的变量 */
  env: Record<string, string>;
  /** 删除临时目录；重复调用无害 */
  dispose(): Promise<void>;
}

/**
 * TOML 基本字符串与 JSON 字符串的转义规则兼容（`\"`、`\\`、`\n`、`\uXXXX`），
 * 用 JSON.stringify 生成可避免手写转义出错。
 */
function tomlString(value: string): string {
  return JSON.stringify(value);
}

function tomlInlineTable(entries: Record<string, string>): string {
  const pairs = Object.entries(entries).map(([key, value]) => `${tomlString(key)} = ${tomlString(value)}`);
  return `{ ${pairs.join(", ")} }`;
}

/**
 * 生成该 profile 的 config.toml：唯一的 provider 指向上游，走 Responses 接口，
 * 不要求 ChatGPT 登录；会话历史不落盘。
 */
export function renderProfileConfig(launch: ProfileLaunch): string {
  const lines = [
    `model_provider = ${tomlString(PROFILE_PROVIDER_ID)}`,
    "",
    `[model_providers.${PROFILE_PROVIDER_ID}]`,
    `name = ${tomlString(launch.name)}`,
    `base_url = ${tomlString(launch.baseUrl)}`,
    `env_key = ${tomlString(PROFILE_KEY_ENV)}`,
    `wire_api = "responses"`,
    "requires_openai_auth = false",
  ];
  if (Object.keys(launch.queryParams).length > 0) {
    lines.push(`query_params = ${tomlInlineTable(launch.queryParams)}`);
  }
  lines.push("", "[history]", `persistence = "none"`, "");
  return lines.join("\n");
}

/** 建临时目录并写入 config.toml；写入失败时先删目录再抛出 */
export async function createProfileHome(launch: ProfileLaunch): Promise<ProfileHome> {
  // mkdtemp 建出的目录权限为 0700，其他用户不可读
  const dir = await mkdtemp(join(tmpdir(), "pelican-codex-profile-"));
  const dispose = async (): Promise<void> => {
    await rm(dir, { recursive: true, force: true });
  };
  try {
    await writeFile(join(dir, "config.toml"), renderProfileConfig(launch), { encoding: "utf8", mode: 0o600 });
  } catch (cause) {
    await dispose();
    throw cause;
  }
  return {
    dir,
    env: { CODEX_HOME: dir, HOME: dir, [PROFILE_KEY_ENV]: launch.apiKey },
    dispose,
  };
}
