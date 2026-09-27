/**
 * GitHub App 清单（Manifest）与 OAuth State 处理。
 *
 * 依据 ACR-011 授权流程：
 * 1. 校验 origin 格式并组装 GitHub App 创建清单；
 * 2. 生成基于 CSPRNG 的一次性 state；
 * 3. 恒定时间比较（timingSafeEqual）校验回跳 state。
 */

import { randomBytes, timingSafeEqual } from "node:crypto";

export interface GitHubAppManifest {
  name: string;
  url: string;
  hook_attributes: {
    active: boolean;
  };
  public: boolean;
  default_permissions: {
    contents: "write";
    metadata: "read";
  };
  redirect_url: string;
  callback_urls: string[];
  request_oauth_on_install: boolean;
}

const ORIGIN_PATTERN = /^https?:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/;

/**
 * 校验 origin 格式，仅允许 http(s)://主机[:端口]。
 */
export function validateOrigin(origin: string): string {
  const trimmed = origin.trim();
  if (!ORIGIN_PATTERN.test(trimmed)) {
    throw new Error(
      `非法 origin "${origin}"：仅允许 http(s)://主机[:端口] 格式，不得包含路径或查询参数`,
    );
  }
  return trimmed;
}

/**
 * 生成 GitHub App 清单。
 */
export function buildManifest(origin: string, repoUrl: string): GitHubAppManifest {
  const validOrigin = validateOrigin(origin);
  const randomSuffix = randomBytes(4).toString("hex");

  return {
    name: `llm-iq-data-publisher-${randomSuffix}`,
    url: repoUrl,
    hook_attributes: {
      active: false,
    },
    public: false,
    default_permissions: {
      contents: "write",
      metadata: "read",
    },
    redirect_url: `${validOrigin}/api/data-repo/github/app-created`,
    callback_urls: [`${validOrigin}/api/data-repo/github/callback`],
    request_oauth_on_install: true,
  };
}

/**
 * 生成 24 字节随机 base64url state。
 */
export function createState(): string {
  return randomBytes(24).toString("base64url");
}

/**
 * 使用 timingSafeEqual 恒定时间校验 expected 与 actual state。
 */
export function verifyState(expected?: string | null, actual?: string | null): boolean {
  if (!expected || !actual) {
    return false;
  }
  const bufExpected = Buffer.from(expected, "utf8");
  const bufActual = Buffer.from(actual, "utf8");
  if (bufExpected.length !== bufActual.length) {
    return false;
  }
  return timingSafeEqual(bufExpected, bufActual);
}
