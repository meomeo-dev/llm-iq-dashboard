# 施工单 M2-05：配置管理台与设备配对页国际化

> 将所有者配置管理台（`/config`）的全部 9 个配置分区面板及设备配对页（`/pair`）接入 `useI18n()` 与题库双语映射，并在页眉提供 `<LanguageSwitch />` 切换入口。

| 项 | 内容 |
|---|---|
| 所属 Sprint | [M2-00](M2-00-bilingual-i18n-support.md) |
| 覆盖功能点 | （本单不挂功能点：所有者管理台 `/config` 与 `/pair` 国际化） |
| 依赖工单 | [M2-01](M2-01-i18n-core-and-locale-context.md), [M2-03](M2-03-prompt-and-judge-metadata-i18n.md) |
| 验收文件 | [M2-05](../acceptance/M2-05-config-and-pair-console-i18n.md)（commit 号、验收结论只记在那里，本文不重复） |

## 现状（已定位）

实测日期：2026-10-13

- **已有但硬编码中文的模块**：
  - 设备配对页：`src/app/pair/{page.tsx,PairForm.tsx,PairCodeForm.tsx,PairSignedInCard.tsx,pair-form-model.ts}`；
  - 配置页框架與导航：`src/app/config/{page.tsx,ConfigEditor.tsx,ConfigPageHeader.tsx,ConfigSideNav.tsx,config-nav-items.ts,ConfigAlerts.tsx,ConfigSection.tsx}`；
  - 能力目录与被测矩阵：`src/app/config/{CapabilityPanel.tsx,CliCapabilityCard.tsx,TargetTable.tsx,TargetRow.tsx,ManualModelInput.tsx,target-table-model.ts}`；
  - 第三方上游 Profile：`src/app/config/{ProfilePanel.tsx,ProfileCard.tsx,ProfileCredentialField.tsx,ProfileModelsField.tsx,UpstreamTypeEditor.tsx,profile-panel-model.ts}`；
  - 调度、轮换、提示词、超时、直出约束与评审面板：`src/app/config/{ScheduleForm.tsx,ScheduleRuntimeCard.tsx,schedule-form-model.ts,RotationForm.tsx,rotation-constants.ts,PromptPicker.tsx,CustomPromptEditor.tsx,TimeoutForm.tsx,TimeoutTierCard.tsx,timeout-form-model.ts,HarnessGuardForm.tsx,JudgePanel.tsx,judge-panel-model.ts}`；
  - 数据仓同步与设备管理：`src/app/config/{DataRepoPanel.tsx,DataRepoForm.tsx,DataRepoGithubCard.tsx,DataRepoPipeline.tsx,DataRepoCards.tsx,DataRepoPendingList.tsx,DataRepoPendingRun.tsx,DataRepoDiscardedList.tsx,DataRepoIssuesList.tsx,DataRepoPushDialog.tsx,data-repo-panel-model.ts,data-repo-pipeline-model.ts,DevicePanel.tsx,DeviceTable.tsx,device-panel-model.ts}`。

## ⚠️ 关键落地约束（必须先验证）

1. **现有纯模型测试兼容性**：
   - `test/app/config/` 与 `test/app/pair/` 下存在对 `*-model.ts`（如 `config-nav-items`、`schedule-form-model`、`timeout-form-model`、`data-repo-panel-model`、`pair-form-model`）的单元测试；
   - 模型函数接收可选参数 `locale: Locale = "zh-CN"`（默认保持中文或提供双语选择器），确保既有单元测试在不传参时 100% 原样通过，同时在传入 `"en"` 时返回英文文案。
2. **YAML 写回与配置校验零改动**：
   - `/config` 保存到 `POST /api/config` 的 JSON 载荷结构与 `src/core/config-writer.ts` 的 YAML 写回逻辑完全不变。
3. **代码长度红线**：
   - 所有 `src/app/config/` 与 `src/app/pair/` 下的 `.tsx` 文件保持 `≤ 300 行`、`.ts` 文件保持 `≤ 500 行`。

## 任务

### 1. 设备配对页（`/pair`）国际化

- 在 `src/app/pair/page.tsx` 或 `PairForm.tsx` 右上角放置 `<LanguageSwitch />`；
- 将 `PairForm.tsx`、`PairCodeForm.tsx`、`PairSignedInCard.tsx` 与 `pair-form-model.ts` 接入 `useI18n()`，支持中英文标题、配对码输入提示、命令引导与已配对状态卡片。

### 2. 配置管理台（`/config`）全分区国际化

- 在 `ConfigPageHeader.tsx` 放置 `<LanguageSwitch />`；
- 将 `ConfigSideNav.tsx`、`ConfigAlerts.tsx`、`CapabilityPanel.tsx`、`TargetTable.tsx`、`ProfilePanel.tsx`、`ScheduleForm.tsx`、`RotationForm.tsx`、`PromptPicker.tsx`、`CustomPromptEditor.tsx`、`TimeoutForm.tsx`、`HarnessGuardForm.tsx`、`JudgePanel.tsx`、`DataRepoPanel.tsx`、`DevicePanel.tsx` 及其子组件全部接入 `useI18n()` 与 `localizePromptLabel`。

### 不改的地方（红线）

- 不修改 `src/core/config-writer.ts`、`src/core/config/loader.ts` 的配置解析与写回语义；
- 不修改 `/api/config`、`/api/pair`、`/api/data-repo` 的请求/响应 JSON 字段名；
- 不破坏 `test/app/config/**` 与 `test/app/pair/**` 的任何既有测试断言。

### 测试

- 执行 `pnpm test`，确认 `test/app/config/**` 与 `test/app/pair/**` 既有测试与新增双语分支断言全部通过；
- 执行 `pnpm lint`、`pnpm check:length`、`pnpm build` 全部通过。

## 验收

```bash
pnpm lint
pnpm test
pnpm check:length
pnpm build
```

## 回报格式

1. `pnpm lint`、`pnpm test`、`pnpm check:length`、`pnpm build` 执行结果；
2. `/config` 与 `/pair` 改造文件清单与行数统计；
3. 既有单测兼容与新增英文模式验证说明。

## 边界

- 允许修改：`src/app/config/**`、`src/app/pair/**`、`src/i18n/**`；
- 禁止修改：`src/core/config-writer.ts`、`src/adapters/**`。

## 依赖

- 依赖 [M2-01](M2-01-i18n-core-and-locale-context.md) 与 [M2-03](M2-03-prompt-and-judge-metadata-i18n.md)。
