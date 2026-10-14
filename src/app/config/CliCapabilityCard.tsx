import type { CliCapability } from "@/capabilities/types";
import { useI18n, type Locale } from "@/i18n";

const PROBE_NOTE_MAP_EN: Record<string, string> = {
  "claude 无模型列举命令，模型清单来自历史记录与内置候选":
    "claude has no model listing command; models come from run history and built-in candidates",
  "未能从 --help 解析出强度档位": "Could not parse effort levels from --help",
  "agy models 未返回任何条目": "agy models returned no entries",
  "模型列表读取失败": "Failed to read model list",
  "模型目录缺少 models 数组": "Model catalog is missing models array",
  "探测失败": "Probe failed",
};

export function localizeProbeNote(note: string, locale: Locale = "zh-CN"): string {
  if (locale !== "en") return note;
  if (note in PROBE_NOTE_MAP_EN) return PROBE_NOTE_MAP_EN[note]!;
  if (note.startsWith("强度档位回退到内置默认：")) {
    return `Effort levels fell back to built-in defaults: ${note.slice("强度档位回退到内置默认：".length)}`;
  }
  if (note.startsWith("模型目录不是合法 JSON：")) {
    return `Model catalog is not valid JSON: ${note.slice("模型目录不是合法 JSON：".length)}`;
  }
  const notInPath = /^(\S+) 不在 PATH 中$/.exec(note);
  if (notInPath) return `${notInPath[1]} is not in PATH`;
  const timeout = /^(\S+) 探测超时$/.exec(note);
  if (timeout) return `${timeout[1]} probe timed out`;
  const failedPlain = /^(\S+) 探测失败$/.exec(note);
  if (failedPlain) return `${failedPlain[1]} probe failed`;
  const failedWithReason = /^(\S+) 探测失败：([\s\S]+)$/.exec(note);
  if (failedWithReason) return `${failedWithReason[1]} probe failed: ${failedWithReason[2]}`;
  return note;
}

export function CliCapabilityCard({ capability }: { capability: CliCapability }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="cli-card">
      <div className="cli-head">
        <strong>{capability.cli}</strong>
        <span className={capability.available ? "cli-availability ok" : "cli-availability error"}>
          {capability.available ? (isEn ? "Available" : "可用") : isEn ? "Unavailable" : "不可用"}
        </span>
      </div>
      <div className="cli-body">
        <div>
          {isEn ? (
            <>
              Models: <b>{capability.models.length}</b>
            </>
          ) : (
            <>
              模型 <b>{capability.models.length}</b> 个
            </>
          )}
        </div>
        <div>
          {isEn ? "Efforts" : "强度"} {capability.efforts.join(" / ")}
        </div>
        {capability.notes.map((note) => (
          <div key={note} className="note">
            {localizeProbeNote(note, locale)}
          </div>
        ))}
      </div>
    </div>
  );
}
