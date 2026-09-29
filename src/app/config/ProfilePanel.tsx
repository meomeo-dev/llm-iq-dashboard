import type { ProfileConfig } from "@/core/config";
import type { Target } from "@/core/types";
import { ProfileCard } from "./ProfileCard";
import { UpstreamTypeEditor } from "./UpstreamTypeEditor";
import { createProfile, profileUsage, renameProfile } from "./profile-panel-model";
import type { useProfileCredentials } from "./use-profile-credentials";

export interface ProfilePanelProps {
  upstreamTypes: string[];
  profiles: ProfileConfig[];
  targets: Target[];
  /** 已写进配置文件的 profile 名 */
  savedNames: ReadonlySet<string>;
  credentials: ReturnType<typeof useProfileCredentials>;
  /** 保存整份配置；未落盘的 profile 填 key 前先调用它 */
  onEnsureSaved: () => Promise<boolean>;
  onUpstreamTypes: (next: string[]) => void;
  /** profile 与目标一起提交：改名要同步改掉引用它的目标 */
  onProfiles: (profiles: ProfileConfig[], targets?: Target[]) => void;
}

/** 配置页的上游 profile 段：上游类型清单 + 每个 profile 一张卡片 */
export function ProfilePanel({
  upstreamTypes,
  profiles,
  targets,
  savedNames,
  credentials,
  onEnsureSaved,
  onUpstreamTypes,
  onProfiles,
}: ProfilePanelProps) {
  const update = (index: number, changes: Partial<ProfileConfig>): void =>
    onProfiles(profiles.map((profile, i) => (i === index ? { ...profile, ...changes } : profile)));

  const rename = (index: number, name: string): void => {
    const next = renameProfile(profiles, targets, index, name);
    onProfiles(next.profiles, next.targets);
  };

  return (
    <div className="stack">
      <UpstreamTypeEditor types={upstreamTypes} profiles={profiles} onChange={onUpstreamTypes} />
      {profiles.length === 0 && <p className="note">还没有 profile。codex 目前只用登录态；新建一个即可接入第三方上游。</p>}
      {profiles.map((profile, index) => (
        <ProfileCard
          // 删除一张后按新长度整体重挂，卡片内保留的原始输入不会错位到相邻卡片
          key={`${index}-${profiles.length}`}
          profile={profile}
          upstreamTypes={upstreamTypes}
          saved={savedNames.has(profile.name)}
          usage={profileUsage(targets, profile)}
          credential={credentials.credentials[`${profile.cli}:${profile.name}`]}
          onChange={(changes) => update(index, changes)}
          onRename={(name) => rename(index, name)}
          onRemove={() => onProfiles(profiles.filter((_, i) => i !== index))}
          onEnsureSaved={onEnsureSaved}
          onSaveKey={(apiKey) => credentials.saveKey(profile.cli, profile.name, apiKey)}
          onDeleteKey={() => credentials.deleteKey(profile.cli, profile.name)}
          onSyncModels={() => credentials.syncModels(profile.cli, profile.name)}
        />
      ))}
      <div className="field-row">
        <button type="button" onClick={() => onProfiles([...profiles, createProfile(profiles, upstreamTypes)])}>
          + 新建 profile
        </button>
      </div>
    </div>
  );
}
