/**
 * "跑一次"的上游选择：按当前勾选的组合算出本轮可用的上游、不可用的原因、调用数与
 * 开始按钮的形态。纯函数，供面板与"选择 Profile"模态共用。
 */

import type { RunOptionsView } from "@/app/api/run/route";
import { PROFILE_CLIS } from "@/core/config/profiles";
import { DEFAULT_PROFILE } from "@/core/types";
import { localizePromptLabel, type Locale } from "@/i18n";

export interface ProfileChoice {
  /** `default` 为登录态，其余为 profile 名 */
  id: string;
  label: string;
  available: boolean;
  /** 不可用的原因；可用时为 null */
  reason: string | null;
}

/** 开始按钮的形态，见 docs/profiles/profile-display-ux.md §2.1 */
export type StartMode =
  | { kind: "direct"; profiles: string[] | undefined; calls: number }
  | { kind: "choose" }
  | { kind: "none"; reason: string };

type TargetOption = RunOptionsView["targets"][number];

function supportsProfiles(cli: string): boolean {
  return (PROFILE_CLIS as readonly string[]).includes(cli);
}

/** 勾选的组合里支持上游的那些 */
function profileCombos(options: RunOptionsView, picked: ReadonlySet<string>): TargetOption[] {
  return options.targets.filter((target) => picked.has(target.id) && supportsProfiles(target.cli));
}

/**
 * 本轮可选的上游；勾选的组合都不支持上游时为空数组（面板与引入上游之前相同）。
 * 上游要对勾选的每个组合都可用才算可用：清单非空且缺任一模型即不可用。
 */
export function profileChoices(
  options: RunOptionsView,
  picked: ReadonlySet<string>,
  locale: Locale = "zh-CN",
): ProfileChoice[] {
  const combos = profileCombos(options, picked);
  if (combos.length === 0) return [];
  const isEn = locale === "en";
  const clis = new Set(combos.map((combo) => combo.cli));
  const loginBlocked = options.loginUnavailable.some((cli) => clis.has(cli));
  const login: ProfileChoice = {
    id: DEFAULT_PROFILE,
    label: isEn ? "Official Login" : "登录态",
    available: !loginBlocked,
    reason: loginBlocked ? (isEn ? "Not signed in" : "未登录") : null,
  };
  const upstreams = options.profiles
    .filter((profile) => clis.has(profile.cli))
    .map((profile): ProfileChoice => {
      const missing = combos.find(
        (combo) => combo.cli === profile.cli && profile.models.length > 0 && !profile.models.includes(combo.model),
      );
      const reason = !profile.enabled
        ? isEn ? "Disabled" : "已停用"
        : !profile.hasKey
          ? isEn ? "Missing API key" : "未填 key"
          : missing
            ? isEn ? `Missing ${missing.model}` : `没有 ${missing.model}`
            : null;
      return { id: profile.name, label: profile.label, available: reason === null, reason };
    });
  return [login, ...upstreams];
}

/** 调用数 = Σ 组合（支持上游的乘以所选上游数，其余算一次）× 题数 */
export function countCalls(
  options: RunOptionsView,
  picked: ReadonlySet<string>,
  promptCount: number,
  profiles: readonly string[],
): number {
  const perCombo = options.targets
    .filter((target) => picked.has(target.id))
    .reduce((sum, target) => sum + (supportsProfiles(target.cli) ? profiles.length : 1), 0);
  return perCombo * promptCount;
}

/** 已勾选且仍可用的上游；没有记忆时默认全部可用项 */
export function resolvePickedProfiles(choices: readonly ProfileChoice[], stored: readonly string[] | null): string[] {
  const available = choices.filter((choice) => choice.available).map((choice) => choice.id);
  if (stored === null) return available;
  return available.filter((id) => stored.includes(id));
}

/**
 * 开始按钮：不涉及上游或只有一个可用上游时直接开始；多个可用时先选；一个都不可用时置灰。
 * 不涉及上游时不带 `profiles`，请求与引入上游之前逐字相同。
 */
export function startMode(
  options: RunOptionsView | null,
  picked: ReadonlySet<string>,
  promptCount: number,
  locale: Locale = "zh-CN",
): StartMode {
  if (options === null) return { kind: "direct", profiles: undefined, calls: picked.size * promptCount };
  const choices = profileChoices(options, picked, locale);
  if (choices.length === 0) return { kind: "direct", profiles: undefined, calls: picked.size * promptCount };
  const available = choices.filter((choice) => choice.available);
  if (available.length === 0) {
    return { kind: "none", reason: locale === "en" ? "No available profiles" : "没有可用的上游" };
  }
  if (available.length === 1) {
    const only = available[0]!;
    return { kind: "direct", profiles: [only.id], calls: countCalls(options, picked, promptCount, [only.id]) };
  }
  return { kind: "choose" };
}

/** 模态首行：复述本轮条件，组合多于三个时收成"等 N 个" */
export function describeRound(
  options: RunOptionsView,
  picked: ReadonlySet<string>,
  prompts: ReadonlySet<string>,
  locale: Locale = "zh-CN",
): string {
  const combos = options.targets
    .filter((target) => target.id && picked.has(target.id))
    .map((target) => `${target.model} · ${target.effort}`);
  const titles = options.prompts
    .filter((prompt) => prompts.has(prompt.id))
    .map((prompt) => localizePromptLabel(prompt.id, prompt.label, locale));
  return `${shorten(combos, locale)} × ${shorten(titles, locale)}`;
}

function shorten(items: readonly string[], locale: Locale = "zh-CN"): string {
  const sep = locale === "en" ? ", " : "、";
  if (items.length <= 3) return items.join(sep);
  return locale === "en"
    ? `${items.slice(0, 3).join(sep)}... (${items.length} total)`
    : `${items.slice(0, 3).join(sep)} 等 ${items.length} 个`;
}

export function localizeReadinessDetail(detail: string | null, locale: Locale): string {
  if (detail === null) return "";
  if (locale === "zh-CN") return detail;
  return detail
    .replace(/不在 PATH 中。安装：/g, "is not in PATH. Install: ")
    .replace(/未安装。安装：/g, "is not installed. Install: ")
    .replace(/未登录。登录：/g, "is not signed in. Sign in: ")
    .replace(/已安装且已登录/g, "is installed and signed in");
}

