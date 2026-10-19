"use client";

import type { PromptStandard } from "@/core/prompt";
import { useI18n } from "@/i18n";
import { StandardCriteriaPanel } from "../standard/StandardCriteriaPanel";

interface ModelStandardPanelProps {
  standard: PromptStandard;
}

export function ModelStandardPanel({ standard }: ModelStandardPanelProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  return (
    <section
      className="modal-standard-panel"
      aria-label={isEn ? "Objective Reference Standard & Criteria" : "客观参考标准与判定依据"}
    >
      <StandardCriteriaPanel standard={standard} />
    </section>
  );
}
