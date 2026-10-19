import type { HarnessGuardConfig, JudgeConfig, ModelFingerprintConfig, ProfileConfig } from "@/core/config";
import type { PromptSpec } from "@/core/prompt";
import type { CliKind, EffortLevel, Target } from "@/core/types";
import type { RotationConfig } from "@/core/variables";
import type { DataRepoDraft } from "./DataRepoForm";
import type { ScheduleDraft } from "./ScheduleForm";

export interface EditableConfig {
  schedule: ScheduleDraft;
  run: {
    promptIds: string[];
    concurrency: number;
    defaultTimeoutMs: number;
    timeoutByCli: Partial<Record<CliKind, number>>;
    timeoutByEffort?: Partial<Record<EffortLevel, number>>;
    rotation: RotationConfig;
    harnessGuard: HarnessGuardConfig;
  };
  upstreamTypes: string[];
  profiles: ProfileConfig[];
  targets: Target[];
  customPrompts: PromptSpec[];
  customModels: Partial<Record<CliKind, string[]>>;
  judge: JudgeConfig;
  modelFingerprint?: ModelFingerprintConfig;
  /** 数据仓设置；null 表示不启用（保存时删掉整段 dataRepo） */
  dataRepo: DataRepoDraft | null;
}

export type ConfigEditorStatus =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export function describeError(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/** 地址与路径去掉首尾空白；地址留空写成 null，写回时会删掉 repository 键 */
function dataRepoPatchOf(dataRepo: DataRepoDraft | null) {
  if (dataRepo === null) return null;
  const repository = dataRepo.repository.trim();
  return {
    path: dataRepo.path.trim(),
    repository: repository === "" ? null : repository,
    autoSync: dataRepo.autoSync,
    push: dataRepo.push,
  };
}

export function buildConfigPatchBody(draft: EditableConfig): string {
  const payload: Record<string, unknown> = {
    schedule: draft.schedule,
    run: draft.run,
    upstreamTypes: draft.upstreamTypes,
    profiles: draft.profiles,
    targets: draft.targets,
    prompts: draft.customPrompts,
    customModels: draft.customModels,
    judge: draft.judge,
    dataRepo: dataRepoPatchOf(draft.dataRepo),
  };
  if (draft.modelFingerprint !== undefined) {
    payload.modelFingerprint = draft.modelFingerprint;
  }
  return JSON.stringify(payload);
}

export type ConfigSectionKey =
  | "prompts"
  | "harness-guard"
  | "profiles"
  | "matrix"
  | "schedule"
  | "timeout"
  | "judge";

const SECTION_META: Record<ConfigSectionKey, { zh: [string, string]; en: [string, string] }> = {
  prompts: {
    zh: ["提示词", "经典版固定不变，作为对照；变量版按轮换周期更换主体与场景。"],
    en: ["Prompts", "The classic prompt is locked as a control baseline; variable prompts rotate subjects and scenes by period."],
  },
  "harness-guard": {
    zh: [
      "直出约束",
      "开启后每条提示词末尾附上这段话，要求模型直接作答，抑制 CLI 工具自带的联网检索、跑代码自测与截图自检，让结果反映模型本身。附加的原文记进 run.json，与不加约束的轮次区分。",
    ],
    en: [
      "Harness Guard",
      "When enabled, appends this paragraph to every prompt to require direct SVG output and suppress built-in web search, code execution, and screenshot self-checks. Recorded in run.json to distinguish from unguarded rounds.",
    ],
  },
  profiles: {
    zh: [
      "上游 Profile",
      "codex 经第三方上游调用的配置，与登录态并列对比。名字、类型、分组、官网、倍率随结果公开；接口地址与 API key 不公开。",
    ],
    en: [
      "Upstream Profiles",
      "Third-party upstream profiles for codex, compared side-by-side with official login. Name, type, group, website, and multiplier are published; baseUrl and API key remain private.",
    ],
  },
  matrix: {
    zh: ["被测矩阵", "强度只列出该模型支持的档位。"],
    en: ["Target Matrix", "Only effort levels supported by the selected model are listed."],
  },
  schedule: {
    zh: [
      "调度",
      "这里只定节奏，到点是否执行看“自动任务”开关。cron 与间隔二选一，cron 优先；保存后 30 秒内生效，无需重启。",
    ],
    en: [
      "Schedule",
      "Defines the cadence; whether a scheduled trigger runs is controlled by the Auto-Run toggle. Choose cron or interval (cron takes precedence); takes effect within 30s after saving without restart.",
    ],
  },
  timeout: {
    zh: ["执行与超时", "各家 CLI 的超时可单独设置。"],
    en: ["Execution & Timeouts", "Per-CLI and per-effort timeout overrides."],
  },
  judge: {
    zh: [
      "作品评审",
      "有评分标准的题目（动态鹈鹕车）给作品贴智商在线 / 降智标签。代码层不花配额；AI 层由裁判 CLI 看联系图打分，走裁判的登录态与配额。",
    ],
    en: [
      "Artwork Judging",
      "Evaluates prompts with rubrics (Animated Pelican) and tags artworks as Sharp / Degraded. Code layer uses zero quota; AI layer uses a cross-vendor judge CLI on contact sheets.",
    ],
  },
};

export function getConfigSectionMeta(id: ConfigSectionKey, isEn: boolean) {
  const [title, hint] = isEn ? SECTION_META[id].en : SECTION_META[id].zh;
  return { id, title, hint };
}
