"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import { AlertBanner, EmptyState } from "../components/ui/AlertBanner";
import { Button, ConfirmButton } from "../components/ui/Button";
import { DataTable } from "../components/ui/DataTable";
import { Drawer } from "../components/ui/Drawer";
import { CheckboxField, FormField } from "../components/ui/FormField";
import { Modal } from "../components/ui/Modal";
import { PageHeader, PageShell } from "../components/ui/PageHeader";
import { StatusPill } from "../components/ui/StatusPill";
import { Foundations } from "./Foundations";
import { PREVIEW_COPY, type PreviewCopy } from "./specimens";

const ATTEMPTS = [
  { id: "A-01", status: "ok", tone: "ok", label: "success", elapsed: "8.2 s" },
  { id: "A-02", status: "no-svg", tone: "warn", label: "noSvg", elapsed: "11.6 s" },
  { id: "A-03", status: "error", tone: "err", label: "failure", elapsed: "2.1 s" },
  { id: "A-04", status: "timeout", tone: "err", label: "timedOut", elapsed: "30.0 s" },
] as const;

function FormSpecimen({ copy }: { copy: PreviewCopy }) {
  return (
    <div className="ds-panel">
      <h3 className="ds-panel-title">{copy.form}</h3>
      <FormField
        label={copy.name}
        htmlFor="ds-run-label"
        hint={<span id="ds-run-label-hint">{copy.nameHint}</span>}
      >
        <input id="ds-run-label" className="ui-input" defaultValue="Sample A"
          aria-describedby="ds-run-label-hint" />
      </FormField>
      <FormField
        label={copy.timeout}
        htmlFor="ds-timeout"
        error={<span id="ds-timeout-error">{copy.timeoutError}</span>}
      >
        <input id="ds-timeout" className="ui-input" defaultValue="0" readOnly
          aria-invalid="true" aria-describedby="ds-timeout-error" />
      </FormField>
      <CheckboxField label={copy.checkbox} defaultChecked />
    </div>
  );
}

function ActionSpecimen({ copy }: { copy: PreviewCopy }) {
  const [overlay, setOverlay] = useState<"modal" | "drawer" | null>(null);
  const close = () => setOverlay(null);
  return (
    <div className="ds-panel">
      <h3 className="ds-panel-title">{copy.buttons}</h3>
      <div className="ds-actions">
        <Button variant="primary" onClick={() => setOverlay("modal")}>{copy.dialog}</Button>
        <Button onClick={() => setOverlay("drawer")}>{copy.drawer}</Button>
        <Button variant="ghost" size="sm" disabled>{copy.disabled}</Button>
        <Button busy>{copy.busy}</Button>
      </div>
      <Modal open={overlay === "modal"} onClose={close} title={copy.dialog}
        closeLabel={copy.close} size="sm" portal>
        {copy.overlayDescription}
      </Modal>
      <Drawer open={overlay === "drawer"} onClose={close} title={copy.drawer}
        closeLabel={copy.close} portal>
        {copy.overlayDescription}
      </Drawer>
    </div>
  );
}

function AttemptTable({ copy }: { copy: PreviewCopy }) {
  return (
    <DataTable aria-label={copy.patterns}>
      <thead>
        <tr>
          <th scope="col">{copy.attempt}</th>
          <th scope="col">{copy.status}</th>
          <th scope="col">{copy.elapsed}</th>
        </tr>
      </thead>
      <tbody>
        {ATTEMPTS.map(({ id, status, tone, label, elapsed }) => (
          <tr key={id}>
            <td className="ds-mono">{id}</td>
            <td><StatusPill dot tone={tone} title={status}>{copy[label]}</StatusPill></td>
            <td className="ds-mono">{elapsed}</td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

function AttemptsSpecimen({ copy }: { copy: PreviewCopy }) {
  const [cleared, setCleared] = useState(false);
  return (
    <section id="patterns" className="ds-section" aria-labelledby="ds-patterns-title">
      <h2 id="ds-patterns-title" className="ds-section-title">{copy.patterns}</h2>
      <p className="ds-description">{copy.patternDescription}</p>
      {cleared ? (
        <>
          <AlertBanner tone="ok" title={copy.cleared} />
          <EmptyState title={copy.emptyTitle} description={copy.emptyBody}
            action={<Button onClick={() => setCleared(false)}>{copy.reset}</Button>} />
        </>
      ) : (
        <>
          <AttemptTable copy={copy} />
          <div className="ds-actions">
            <ConfirmButton variant="danger" size="sm" confirmLabel={copy.confirm}
              cancelLabel={copy.cancel} onConfirm={() => setCleared(true)}>
              {copy.clear}
            </ConfirmButton>
          </div>
        </>
      )}
    </section>
  );
}

export function DesignSystemPreview() {
  const { locale } = useI18n();
  const copy = PREVIEW_COPY[locale];
  return (
    <PageShell className="ds-page">
      <PageHeader title={copy.title} titleClassName="ds-heading" subtitle={copy.description}
        backHref="/" backLabel={copy.home}
        actionsSlot={<StatusPill>{copy.version}</StatusPill>} />
      <nav className="ds-nav" aria-label={copy.title}>
        <a className="ds-nav-link" href="#foundations">{copy.foundations}</a>
        <a className="ds-nav-link" href="#components">{copy.components}</a>
        <a className="ds-nav-link" href="#patterns">{copy.patterns}</a>
      </nav>
      <Foundations copy={copy} />
      <section id="components" className="ds-section" aria-labelledby="ds-components-title">
        <h2 id="ds-components-title" className="ds-section-title">{copy.components}</h2>
        <div className="ds-component-grid">
          <ActionSpecimen copy={copy} />
          <FormSpecimen copy={copy} />
        </div>
      </section>
      <AttemptsSpecimen copy={copy} />
    </PageShell>
  );
}
