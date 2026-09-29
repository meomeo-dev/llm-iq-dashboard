import { useState } from "react";
import type { ProfileConfig } from "@/core/config";
import type { ProfileCredentialStatus } from "@/core/profile-credentials";
import { isKebabName } from "./profile-panel-model";
import { ProfileModelsField } from "./ProfileModelsField";
import { ProfileCredentialField } from "./ProfileCredentialField";
import type { CredentialOutcome, ModelSyncOutcome } from "./use-profile-credentials";

export interface ProfileCardProps {
  profile: ProfileConfig;
  upstreamTypes: readonly string[];
  /** 已写进配置文件：名字锁定（key 文件以名字命名），可以填 key */
  saved: boolean;
  /** 引用它的目标数；大于 0 时不能删 */
  usage: number;
  credential: ProfileCredentialStatus | undefined;
  onChange: (changes: Partial<ProfileConfig>) => void;
  onRename: (name: string) => void;
  onRemove: () => void;
  onEnsureSaved: () => Promise<boolean>;
  onSaveKey: (apiKey: string) => Promise<CredentialOutcome>;
  onDeleteKey: () => Promise<CredentialOutcome>;
  onSyncModels: () => Promise<ModelSyncOutcome>;
}

export function ProfileCard(props: ProfileCardProps) {
  const { profile, saved, usage, onChange, onRemove } = props;
  return (
    <div className={`profile-card${profile.enabled ? "" : " profile-disabled"}`}>
      <div className="profile-card-head">
        <ProfileNameField name={profile.name} locked={saved} onRename={props.onRename} />
        <span className="profile-cli">{profile.cli}</span>
        <label className="checkbox">
          <input type="checkbox" checked={profile.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} />
          启用
        </label>
        <button
          type="button"
          className="danger"
          disabled={usage > 0}
          title={usage > 0 ? `被 ${usage} 个目标引用，先在被测矩阵里改掉或删掉` : undefined}
          onClick={onRemove}
        >
          删除
        </button>
      </div>
      <ProfileFields {...props} />
      <ProfileCredentialField
        saved={saved}
        status={props.credential}
        onEnsureSaved={props.onEnsureSaved}
        onSave={props.onSaveKey}
        onDelete={props.onDeleteKey}
      />
    </div>
  );
}

function ProfileNameField({ name, locked, onRename }: { name: string; locked: boolean; onRename: (name: string) => void }) {
  if (locked) return <strong className="profile-name" title="已保存的 profile 不能改名：API key 按名字存放">{name}</strong>;
  return (
    <label>
      名字（标识用：小写字母、数字、连字符，如 kedaya-tehui-005）
      <input
        type="text"
        value={name}
        className={isKebabName(name) ? undefined : "invalid"}
        onChange={(e) => onRename(e.target.value)}
      />
    </label>
  );
}

function ProfileFields(props: ProfileCardProps) {
  const { profile, upstreamTypes, onChange } = props;
  // 倍率保留原始输入，小数点打到一半时不被解析结果回写覆盖
  const [multiplierText, setMultiplierText] = useState(String(profile.pricing.multiplier));

  return (
    <div className="profile-fields">
      <label className="profile-wide">
        显示名（页面上展示，可含中文，如 kedaya-我又来了特惠0.05；留空则用名字）
        <input type="text" value={profile.label ?? ""} onChange={(e) => onChange({ label: e.target.value || null })} />
      </label>
      <label>
        上游类型
        <select value={profile.upstreamType} onChange={(e) => onChange({ upstreamType: e.target.value })}>
          {[...new Set([...upstreamTypes, profile.upstreamType])].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        分组
        <input type="text" value={profile.group ?? ""} onChange={(e) => onChange({ group: e.target.value || null })} />
      </label>
      <label>
        官网
        <input
          type="text"
          value={profile.website ?? ""}
          placeholder="https://"
          onChange={(e) => onChange({ website: e.target.value || null })}
        />
      </label>
      <label className="profile-wide">
        接口地址 baseUrl（不公开）
        <input
          type="text"
          value={profile.baseUrl}
          placeholder="https://api.example.com/v1"
          onChange={(e) => onChange({ baseUrl: e.target.value })}
        />
      </label>
      <ProfileModelsField
        models={profile.models}
        canSync={props.saved && props.credential !== undefined}
        onChange={(models) => onChange({ models })}
        onSync={props.onSyncModels}
      />
      <label>
        倍率（官价 ×）
        <input
          type="number"
          min={0}
          step="any"
          value={multiplierText}
          onChange={(e) => {
            setMultiplierText(e.target.value);
            const parsed = Number(e.target.value);
            if (e.target.value !== "" && Number.isFinite(parsed)) {
              onChange({ pricing: { ...profile.pricing, multiplier: parsed } });
            }
          }}
        />
      </label>
    </div>
  );
}
