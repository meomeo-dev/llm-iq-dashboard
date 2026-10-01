import React from "react";
import type { ContactSheet, Judgement } from "@/core/judge/schema";
import type { DashboardCard } from "@/core/types";
import { formatCost, JUDGE_TEXT, judgeCostLine } from "../components/card/card-format";

/** 单件作品查看页的评审抽屉（ACR-019）：结论、闸门与逐条标准的分与理由 */
export function JudgeDrawer({ judge, judgeCost = null }: { judge: Judgement; judgeCost?: DashboardCard["judgeCost"] }) {
  const { total, rubric } = judge;
  return (
    <details className="viewer-drawer viewer-judge">
      <summary>
        <span className="drawer-icon" aria-hidden="true">🧠</span>
        <span className="drawer-title">评审</span>
        <span className={`judge-pill judge-${total.verdict}`}>
          {JUDGE_TEXT[total.verdict]} {total.score}/{total.maxScore}
        </span>
        <span className="judge-meta">
          及格线 {rubric.passThreshold} · {rubric.id} v{rubric.version} · {judge.judges.map((j) => j.id).join(" + ")}
          {judgeCost != null && (
            <span title={judgeCostLine(judgeCost) ?? ""}> · 裁判 {formatCost(judgeCost.cost)}</span>
          )}
        </span>
      </summary>
      <div className="viewer-drawer-body judge-body">
        <table className="judge-table">
          <tbody>
            {judge.gates.map((gate) => (
              <tr key={gate.id} className={gate.passed ? "judge-pass" : "judge-fail"}>
                <td className="judge-id">{gate.id}</td>
                <td className="judge-score">{gate.passed ? "通过" : "不通过"}</td>
                <td className="judge-title" title={gate.standard}>{gate.title}</td>
                <td className="judge-reason">{gate.evidence}</td>
              </tr>
            ))}
            {judge.criteria.map((c) => (
              <tr key={c.id} className={c.score === null ? "judge-pending" : ""}>
                <td className="judge-id">{c.id}</td>
                <td className="judge-score">{c.score === null ? "-" : c.score}/{c.maxScore}</td>
                <td className="judge-title" title={c.standard}>{c.title}</td>
                <td className="judge-reason">{c.reason ?? "待 AI 层判定"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {judge.contactSheet && <ContactSheets runId={judge.subject.runId} sheet={judge.contactSheet} />}
      </div>
    </details>
  );
}

/** 取景框来源的标签文案：旧记录没有 locatedBy 即几何推断 */
const LOCATED_TEXT = { ai: "裁判定位", code: "几何推断" } as const;

/** 帧序联系表与各类细节联系表：同帧号、同取样时刻，细节表标出取景倍数、服务的标准与取景框来源 */
function ContactSheets({ runId, sheet }: { runId: string; sheet: ContactSheet }) {
  const src = (file: string) => `/sheet/${encodeURIComponent(runId)}/${encodeURIComponent(file)}`;
  return (
    <div className="judge-sheets">
      <p className="judge-sheet-note">
        联系图：一行 {sheet.frameCount} 帧，周期 {sheet.periodMs}ms，取样 {sheet.sampleTimesMs.join(" / ")} ms；
        细节表与帧序表同帧号
      </p>
      <figure className="judge-sheet">
        <img src={src(sheet.file)} alt="帧序联系表" loading="lazy" />
        <figcaption>帧序 · 整幅画面</figcaption>
      </figure>
      {(sheet.details ?? []).map((d) => (
        <figure key={d.kind} className="judge-sheet">
          <img src={src(d.file)} alt={`${d.subject}细节联系表`} loading="lazy" />
          <figcaption>
            {d.subject} ×{d.zoom} · {d.criteria.join(" ")}
            <span className={`judge-located judge-located-${d.locatedBy ?? "code"}`} title="取景框由谁定：裁判看首帧给框，或代码层按几何推断">
              {LOCATED_TEXT[d.locatedBy ?? "code"]}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
