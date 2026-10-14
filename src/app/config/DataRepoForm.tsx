"use client";

import { useI18n } from "@/i18n/context";
import { ConfigSection } from "./ConfigSection";

/** 配置页「数据仓设置」表单的草稿：仓地址与路径按用户填的原文保存，空地址表示仓库由本地副本的 origin 决定 */
export interface DataRepoDraft {
  path: string;
  repository: string;
  autoSync: boolean;
  push: boolean;
}

/** 新开启数据仓时的起点：路径留空由用户填，地址留空即沿用本地副本的 origin */
const EMPTY_DRAFT: DataRepoDraft = { path: "", repository: "", autoSync: false, push: false };

/** 配置页的「数据仓设置」区块：区块文案与表单放在一起，ConfigEditor 只负责摆位 */
export function DataRepoSettingsSection({
  value,
  onChange,
}: {
  value: DataRepoDraft | null;
  onChange: (value: DataRepoDraft | null) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <ConfigSection
      id="data-repo-settings"
      title={isEn ? "Data Repo Settings" : "数据仓设置"}
      hint={
        isEn
          ? 'Configure which public data repository receives sanitized benchmark results. When a GitHub URL is set, the runner automatically clones the local working copy; prompt allowlist (publishPrompts) is still edited in the YAML config file. See the "Data Repository" panel below after saving.'
          : "评测结果脱敏后同步到哪个公开数据仓。填 GitHub 地址后执行器会把本地副本 clone 好；题目白名单 publishPrompts 仍只在配置文件里改。保存后状态见下方「数据仓」面板。"
      }
    >
      <DataRepoForm value={value} onChange={onChange} />
    </ConfigSection>
  );
}

export function DataRepoForm({
  value,
  onChange,
}: {
  value: DataRepoDraft | null;
  onChange: (next: DataRepoDraft | null) => void;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const enabled = value !== null;
  const draft = value ?? EMPTY_DRAFT;
  const set = <K extends keyof DataRepoDraft>(key: K, next: DataRepoDraft[K]) =>
    onChange({ ...draft, [key]: next });

  return (
    <div className="stack">
      <label className="checkbox">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked ? { ...EMPTY_DRAFT } : null)}
        />
        {isEn
          ? "Enable data repository sync (unchecking and saving removes the entire dataRepo block, including publishPrompts)"
          : "启用数据仓同步（关闭并保存会删掉配置里的整段 dataRepo，含题目白名单 publishPrompts）"}
      </label>
      <label className="data-repo-field">
        {isEn ? "Repository URL" : "数据仓地址"}
        <input
          type="url"
          value={draft.repository}
          disabled={!enabled}
          placeholder="https://github.com/<owner>/llm-iq-data"
          onChange={(e) => set("repository", e.target.value)}
        />
        <span className="note">
          {isEn
            ? "GitHub HTTPS URL. Before runner startup and sync, if the local path is missing or empty, it clones from this URL; if the local origin points elsewhere, it warns and refuses to sync. Leave empty to follow the local working copy's origin."
            : "GitHub https 地址。执行器启动与同步前，本地路径不存在或为空目录时按它 clone；本地副本的 origin 与它不是同一个仓时报警并拒绝同步。留空则仓库由本地副本的 origin 决定。"}
        </span>
      </label>
      <label className="data-repo-field">
        {isEn ? "Local Path" : "本地路径"}
        <input
          type="text"
          value={draft.path}
          disabled={!enabled}
          placeholder={isEn ? "../llm-iq-data (use /data-repo in Docker)" : "../llm-iq-data（容器部署填 /data-repo）"}
          onChange={(e) => set("path", e.target.value)}
        />
        <span className="note">
          {isEn
            ? "Relative paths resolve against the runner working directory; in split-container deployments, use the path inside the runner container."
            : "相对路径按执行进程的工作目录解析；分容器部署时是 runner 容器里的路径。"}
        </span>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={draft.autoSync} disabled={!enabled} onChange={(e) => set("autoSync", e.target.checked)} />
        {isEn
          ? "Automatically sanitize, export, and commit locally after each run"
          : "每轮评测结束后自动脱敏导出并本地提交"}
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={draft.push} disabled={!enabled} onChange={(e) => set("push", e.target.checked)} />
        {isEn
          ? "Automatically push to remote after export commit (pushing publishes publicly; in Docker deployments, consider leaving this off and confirming in the panel below)"
          : "导出提交后自动推送到远端（推送即公开发布；容器部署建议关闭，在下方面板确认后再推）"}
      </label>
    </div>
  );
}
