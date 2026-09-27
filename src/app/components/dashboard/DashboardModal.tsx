import type { PromptStandard } from "@/core/prompt";
import type { Moment } from "../timeline/moments";
import type { OpenCell } from "../timeline/RunGrid";
import { ModelModal } from "../model-modal/ModelModal";
import { resolveOpenCell, resolvePromptStandard } from "./dashboard-calc";

interface DashboardModalProps {
  readonly openCell: OpenCell | null;
  readonly visible: readonly Moment[];
  readonly efforts: readonly string[];
  readonly timeZone: string;
  readonly promptStandards?: Readonly<Record<string, PromptStandard>>;
  readonly onClose: () => void;
}

/** 详情弹窗包装组件：按选中的单元格解析对应的卡片与标准并展示模型模态框 */
export function DashboardModal({
  openCell,
  visible,
  efforts,
  timeZone,
  promptStandards = {},
  onClose,
}: DashboardModalProps) {
  const opened = resolveOpenCell(openCell, visible);
  if (!opened) return null;

  return (
    <ModelModal
      moment={opened.moment}
      row={opened.row}
      efforts={efforts}
      timeZone={timeZone}
      standard={resolvePromptStandard(promptStandards, opened.row.promptId, opened.bindings)}
      onClose={onClose}
    />
  );
}
