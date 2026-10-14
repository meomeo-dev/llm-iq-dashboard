import { useI18n } from "@/i18n";
import { AutoRunToggle } from "../run-control/AutoRunToggle";
import { RunOnceMenu } from "../run-control/RunOnceMenu";

interface ToolbarCenterProps {
  owner: boolean;
  remote: boolean;
  timeZone: string;
  stats: { runs: number; works: number; rate: number };
  openMenu: string | null;
  onToggleMenu: (id: string) => void;
  onCloseMenus: () => void;
}

/** 工具栏中心区：作品统计、跑一次入口与自动执行开关 */
export function ToolbarCenter({
  owner,
  remote,
  timeZone,
  stats,
  openMenu,
  onToggleMenu,
  onCloseMenus,
}: ToolbarCenterProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <div className="toolbar-center">
      <div
        className="toolbar-stack stats"
        title={isEn ? "Rounds, artworks, and success rate on the selected date" : "所选日期的轮次、作品数与成功率"}
      >
        <span className="stack-main">
          {isEn ? `Success ${stats.rate}%` : `成功率 ${stats.rate}%`}
        </span>
        <span className="stack-sub">
          {isEn ? `${stats.runs} runs · ${stats.works} works` : `${stats.runs} 轮 · ${stats.works} 作品`}
        </span>
      </div>
      {owner && (
        <RunOnceMenu
          open={openMenu === "run-once"}
          onToggle={() => onToggleMenu("run-once")}
          onClose={onCloseMenus}
        />
      )}
      {owner ? (
        <AutoRunToggle timeZone={timeZone} />
      ) : !remote ? (
        <AutoRunToggle timeZone={timeZone} readOnly={true} />
      ) : null}
    </div>
  );
}
