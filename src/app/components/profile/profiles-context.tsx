"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ProfileView } from "@/core/profile-view";

export interface ProfilesContextValue {
  /** 配置里登记的上游；远程展台或配置缺失时为空数组 */
  profiles: readonly ProfileView[];
  /** 所有者视角：信息卡才显示"在配置页编辑" */
  owner: boolean;
}

const ProfilesContext = createContext<ProfilesContextValue>({ profiles: [], owner: false });

/** 看板与大图页在根部提供一次，网格、弹窗、进度面板与信息卡各自取用，不逐层透传 */
export function ProfilesProvider({ value, children }: { value: ProfilesContextValue; children: ReactNode }) {
  return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
}

export function useProfiles(): ProfilesContextValue {
  return useContext(ProfilesContext);
}
