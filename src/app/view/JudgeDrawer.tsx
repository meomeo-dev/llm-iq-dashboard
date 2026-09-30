import React from "react";
import type { Judgement } from "@/core/judge/schema";
import { JUDGE_TEXT } from "../components/card/card-format";

/** 单件作品查看页的评审抽屉（ACR-019）：结论、闸门与逐条标准的分与理由 */
export function JudgeDrawer({ judge }: { judge: Judgement }) {
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
        {judge.contactSheet && (
          <p className="judge-sheet-note">
            联系图：一行 {judge.contactSheet.frameCount} 帧，周期 {judge.contactSheet.periodMs}ms，
            取样 {judge.contactSheet.sampleTimesMs.join(" / ")} ms
          </p>
        )}
      </div>
    </details>
  );
}
