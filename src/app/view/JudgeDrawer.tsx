import React from "react";
import { criterionFloors, type ContactSheet, type CriterionResult, type Judgement } from "@/core/judge/schema";
import type { DashboardCard } from "@/core/types";
import {
  localizeCriterion,
  localizeDetailSubject,
  localizeGate,
  useI18n,
  type Locale,
} from "@/i18n";
import { formatCost, judgeCostLine, judgeText, pendingJudgeText } from "../components/card/card-format";
import type { PendingJudgeState } from "../components/run-status/run-phase";

interface JudgeDrawerProps {
  judge: Judgement;
  judgeCost?: DashboardCard["judgeCost"];
  /** 待复核作品在评审队列里的实时状态；有值时结论胶囊显示它而不是记录里的「待复核」 */
  liveState?: PendingJudgeState | null;
}

/** 单件作品查看页的评审抽屉（ACR-019）：结论、闸门与逐条标准的分与理由 */
export function JudgeDrawer({ judge, judgeCost = null, liveState = null }: JudgeDrawerProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const floors = criterionFloors(judge.rubric);
  const { total, rubric } = judge;
  const pendingInfo = liveState !== null ? pendingJudgeText(liveState, locale) : null;
  return (
    <details className="viewer-drawer viewer-judge">
      <summary>
        <span className="drawer-icon" aria-hidden="true">🧠</span>
        <span className="drawer-title">{isEn ? "Judge Report" : "评审"}</span>
        {pendingInfo !== null ? (
          <span className={`judge-pill judge-${liveState === "interrupted" ? "interrupted" : "judging"}`} title={pendingInfo.title}>
            {pendingInfo.label}
          </span>
        ) : (
          <span className={`judge-pill judge-${total.verdict}`}>
            {judgeText(total.verdict, locale)} {total.score}/{total.maxScore}
          </span>
        )}
        <span className="judge-meta">
          {isEn ? `Pass threshold ${rubric.passThreshold}` : `及格线 ${rubric.passThreshold}`} · {rubric.id} v
          {rubric.version} · {judge.judges.map((j) => j.id).join(" + ")}
          {judgeCost != null && (
            <span title={judgeCostLine(judgeCost, locale) ?? ""}>
              {isEn ? ` · Judge ${formatCost(judgeCost.cost)}` : ` · 裁判 ${formatCost(judgeCost.cost)}`}
            </span>
          )}
        </span>
      </summary>
      <div className="viewer-drawer-body judge-body">
        <JudgeTable judge={judge} floors={floors} locale={locale} />
        {judge.contactSheet && <ContactSheets runId={judge.subject.runId} sheet={judge.contactSheet} locale={locale} />}
      </div>
    </details>
  );
}

function JudgeTable({ judge, floors, locale }: { judge: Judgement; floors: ReadonlyMap<string, number>; locale: Locale }) {
  const isEn = locale === "en";
  return (
    <table className="judge-table">
      <tbody>
        {judge.gates.map((rawGate) => {
          const gate = localizeGate(rawGate, locale);
          return (
            <tr key={gate.id} className={gate.passed ? "judge-pass" : "judge-fail"}>
              <td className="judge-id">{gate.id}</td>
              <td className="judge-score">{gate.passed ? (isEn ? "PASS" : "通过") : isEn ? "FAIL" : "不通过"}</td>
              <td className="judge-title" title={gate.standard}>{gate.title}</td>
              <td className="judge-reason">{gate.evidence}</td>
            </tr>
          );
        })}
        {judge.criteria.map((rawCrit) => {
          const c = localizeCriterion(rawCrit, locale);
          return (
            <tr key={c.id} className={c.score === null ? "judge-pending" : belowFloor(c, floors) ? "judge-floor-fail" : ""}>
              <td className="judge-id">{c.id}</td>
              <td className="judge-score">{c.score === null ? "-" : c.score}/{c.maxScore}</td>
              <td className="judge-title" title={c.standard}>
                {c.title}
                {floors.has(c.id) && (
                  <span
                    className="judge-floor"
                    title={isEn ? "Critical criterion floor: scoring below this disqualifies the item and marks it Degraded" : "关键标准门槛：低于此分不计入总分，直接判降智"}
                  >
                    {isEn ? `Floor ${floors.get(c.id)}` : `门槛 ${floors.get(c.id)}`}
                  </span>
                )}
              </td>
              <td className="judge-reason">{c.reason ?? (isEn ? "Pending AI Judge" : "待 AI 层判定")}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** 帧序联系表与各类细节联系表：同帧号、同取样时刻，细节表标出取景倍数、服务的标准与取景框来源 */
function ContactSheets({ runId, sheet, locale }: { runId: string; sheet: ContactSheet; locale: Locale }) {
  const isEn = locale === "en";
  const src = (file: string) => `/sheet/${encodeURIComponent(runId)}/${encodeURIComponent(file)}`;
  return (
    <div className="judge-sheets">
      <p className="judge-sheet-note">
        {isEn
          ? `Contact sheets: ${sheet.frameCount} frames per row, period ${sheet.periodMs}ms, sampled at ${sheet.sampleTimesMs.join(" / ")} ms; detail crops match the same frame indices`
          : `联系图：一行 ${sheet.frameCount} 帧，周期 ${sheet.periodMs}ms，取样 ${sheet.sampleTimesMs.join(" / ")} ms；细节表与帧序表同帧号`}
      </p>
      <figure className="judge-sheet">
        <img src={src(sheet.file)} alt={isEn ? "8-frame sequence contact sheet" : "帧序联系表"} loading="lazy" />
        <figcaption>{isEn ? "Sequence · Full Canvas" : "帧序 · 整幅画面"}</figcaption>
      </figure>
      {(sheet.details ?? []).map((d) => {
        const subject = localizeDetailSubject(d.kind, d.subject, locale);
        const locatedBy = d.locatedBy ?? "code";
        const locatedLabel =
          locatedBy === "ai"
            ? isEn
              ? "AI Located"
              : "裁判定位"
            : isEn
              ? "Geometric"
              : "几何推断";
        return (
          <figure key={d.kind} className="judge-sheet">
            <img src={src(d.file)} alt={isEn ? `${subject} detail contact sheet` : `${subject}细节联系表`} loading="lazy" />
            <figcaption>
              {subject} ×{d.zoom} · {d.criteria.join(" ")}
              <span
                className={`judge-located judge-located-${locatedBy}`}
                title={
                  isEn
                    ? "Crop box source: located by AI judge from frame 0 or inferred geometrically by code"
                    : "取景框由谁定：裁判看首帧给框，或代码层按几何推断"
                }
              >
                {locatedLabel}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function belowFloor(c: CriterionResult, floors: ReadonlyMap<string, number>): boolean {
  return c.score !== null && c.score < (floors.get(c.id) ?? 0);
}
