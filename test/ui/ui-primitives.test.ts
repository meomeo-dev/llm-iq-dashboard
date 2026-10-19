import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AlertBanner, EmptyState } from "../../src/app/components/ui/AlertBanner";
import { Button, ButtonLink, ConfirmButton } from "../../src/app/components/ui/Button";
import { DataTable } from "../../src/app/components/ui/DataTable";
import { Collapsible, Drawer } from "../../src/app/components/ui/Drawer";
import { CheckboxField, FormField } from "../../src/app/components/ui/FormField";
import { Modal } from "../../src/app/components/ui/Modal";
import { PageHeader, PageShell } from "../../src/app/components/ui/PageHeader";
import { StatusPill } from "../../src/app/components/ui/StatusPill";
import {
  dispatchOverlayEscape,
  hasActiveOverlay,
  pushOverlay,
} from "../../src/app/components/ui/use-overlay-stack";

describe("UI Primitives (Tier 1)", () => {
  it("renders PageShell and PageHeader with sibling back link outside h1", () => {
    const html = renderToStaticMarkup(
      React.createElement(
        PageShell,
        { width: "wide" },
        React.createElement(PageHeader, {
          title: "Model Fingerprint",
          backHref: "/",
          backLabel: "← Back",
          subtitle: React.createElement("span", { className: "badge" }, "Sub"),
          centerSlot: React.createElement("div", null, "Center"),
          actionsSlot: React.createElement(Button, { size: "sm" }, "Action"),
          sticky: true,
        }),
      ),
    );
    assert.ok(html.includes('class="ui-page-shell ui-page-shell-wide"'));
    assert.ok(html.includes('class="ui-page-header is-sticky"'));
    assert.ok(
      html.includes(
        '<h1 class="ui-page-title">Model Fingerprint</h1><a class="ui-back-link" href="/">← Back</a>',
      ),
    );
    assert.ok(html.includes('class="ui-page-subtitle"'));
  });

  it("renders Button with 1x1 grid busyLabel stack, ButtonLink, and ConfirmButton", () => {
    const btnHtml = renderToStaticMarkup(
      React.createElement(
        Button,
        { variant: "primary", size: "md", busy: true, busyLabel: "Running…" },
        "Start",
      ),
    );
    assert.ok(btnHtml.includes("ui-btn ui-btn-primary ui-btn-md is-busy"));
    assert.ok(btnHtml.includes("ui-btn-stack"));
    assert.ok(btnHtml.includes("ui-btn-layer is-hidden"));

    const linkHtml = renderToStaticMarkup(
      React.createElement(ButtonLink, { href: "/config", variant: "default" }, "Config"),
    );
    assert.ok(linkHtml.includes('href="/config"'));
    assert.ok(linkHtml.includes("ui-btn ui-btn-default ui-btn-md"));

    const confirmHtml = renderToStaticMarkup(
      React.createElement(
        ConfirmButton,
        { confirmLabel: "Confirm Delete", onConfirm: () => {} },
        "Delete",
      ),
    );
    assert.ok(confirmHtml.includes("Delete"));
  });

  it("renders FormField, CheckboxField, and StatusPill (static and interactive)", () => {
    const formHtml = renderToStaticMarkup(
      React.createElement(
        FormField,
        { label: "Token", hint: "Required", error: "Invalid", htmlFor: "tok", layout: "inline" },
        React.createElement("input", { id: "tok", className: "ui-input" }),
      ),
    );
    assert.ok(formHtml.includes("ui-field ui-field-inline"));
    assert.ok(formHtml.includes('class="ui-label"'));
    assert.ok(formHtml.includes('class="ui-field-error"'));

    const checkHtml = renderToStaticMarkup(
      React.createElement(CheckboxField, { label: "Enable", defaultChecked: true }),
    );
    assert.ok(checkHtml.includes('class="ui-check-row"'));

    const pillStatic = renderToStaticMarkup(
      React.createElement(StatusPill, { tone: "ok", variant: "outline", dot: true, mono: true }, "0.8226"),
    );
    assert.ok(pillStatic.includes('<span class="ui-pill ui-pill-ok ui-pill-outline is-mono"'));
    assert.ok(pillStatic.includes("ui-pill-dot"));

    const pillBtn = renderToStaticMarkup(
      React.createElement(StatusPill, { tone: "accent", onClick: () => {} }, "Golden Standard"),
    );
    assert.ok(
      pillBtn.includes(
        '<button type="button" class="ui-pill ui-pill-accent ui-pill-subtle is-interactive"',
      ),
    );
  });

  it("renders Modal and Drawer in-place during SSR for portal={false}, portal={true}, and open={false}", () => {
    assert.equal(
      renderToStaticMarkup(
        React.createElement(Modal, { open: false, onClose: () => {}, title: "Closed" }, "Body"),
      ),
      "",
    );
    assert.equal(
      renderToStaticMarkup(
        React.createElement(Drawer, { open: false, onClose: () => {}, title: "Closed" }, "Body"),
      ),
      "",
    );

    const modalDefaultHtml = renderToStaticMarkup(
      React.createElement(
        Modal,
        { open: true, onClose: () => {}, title: "Default In-Place Modal" },
        "Body",
      ),
    );
    assert.ok(modalDefaultHtml.includes("ui-modal ui-modal-md"));

    const modalHtml = renderToStaticMarkup(
      React.createElement(
        Modal,
        {
          open: true,
          onClose: () => {},
          title: "Check Details",
          size: "columns",
          colCount: 3,
          portal: true,
          footer: React.createElement("span", null, "Foot"),
        },
        React.createElement("div", null, "Modal Body Content"),
      ),
    );
    assert.ok(modalHtml.includes("ui-modal-backdrop"));
    assert.ok(modalHtml.includes("ui-modal ui-modal-columns"));
    assert.ok(modalHtml.includes("--col-count:3"));
    assert.ok(modalHtml.includes("ui-modal-foot"));

    const drawerHtml = renderToStaticMarkup(
      React.createElement(
        Drawer,
        {
          open: true,
          onClose: () => {},
          title: "Sample Drawer",
          toolbar: React.createElement("span", null, "Filter Bar"),
          portal: true,
        },
        React.createElement(
          Collapsible,
          { summary: "Probe Details", summaryExtra: "6/6" },
          "Inner Details",
        ),
      ),
    );
    assert.ok(drawerHtml.includes("ui-drawer-backdrop"));
    assert.ok(drawerHtml.includes("ui-drawer-toolbar"));
    assert.ok(drawerHtml.includes("ui-collapsible-arrow"));
    assert.ok(drawerHtml.includes("Inner Details"));
  });

  it("renders DataTable (matrix & compact), AlertBanner, and EmptyState", () => {
    const tableHtml = renderToStaticMarkup(
      React.createElement(
        DataTable,
        { variant: "matrix", stickyFirstColWidth: "200px" },
        React.createElement(
          "tbody",
          null,
          React.createElement("tr", null, React.createElement("td", { className: "ui-col-sticky-1" }, "Cell")),
        ),
      ),
    );
    assert.ok(tableHtml.includes("ui-table ui-table-matrix"));
    assert.ok(tableHtml.includes("--ui-sticky-col-1-w:200px"));

    const bannerHtml = renderToStaticMarkup(
      React.createElement(
        AlertBanner,
        { tone: "err", title: "Job Failed", onDismiss: () => {} },
        "Network timeout",
      ),
    );
    assert.ok(bannerHtml.includes("ui-alert-banner ui-alert-err"));
    assert.ok(bannerHtml.includes("ui-alert-body"));

    const emptyHtml = renderToStaticMarkup(
      React.createElement(EmptyState, {
        title: "No checks yet",
        description: "Run a check to get started",
        action: React.createElement(Button, { variant: "primary" }, "Run Check"),
      }),
    );
    assert.ok(emptyHtml.includes("ui-empty-state"));
    assert.ok(emptyHtml.includes("ui-empty-actions"));
  });

  it("ensures every .ui-* and .is-* class emitted by UI primitives exists in ui-*.css", () => {
    const cssCombined = [
      readFileSync(resolve(process.cwd(), "src/app/components/ui/ui-controls.css"), "utf8"),
      readFileSync(resolve(process.cwd(), "src/app/components/ui/ui-overlays.css"), "utf8"),
      readFileSync(resolve(process.cwd(), "src/app/components/ui/ui-layout.css"), "utf8"),
    ].join("\n");

    const definedClasses = new Set<string>();
    const clsRegex = /\.([a-zA-Z0-9_-]+)/g;
    let m: RegExpExecArray | null;
    while ((m = clsRegex.exec(cssCombined)) !== null) {
      definedClasses.add(m[1]!);
    }

    const sampleTree = React.createElement(
      PageShell,
      { width: "narrow" },
      React.createElement(PageHeader, {
        title: "T",
        subtitle: "S",
        backHref: "/",
        backLabel: "B",
        centerSlot: "C",
        actionsSlot: "A",
        sticky: true,
      }),
      React.createElement(Button, { variant: "danger", size: "sm", busy: true, busyLabel: "Wait" }, "Go"),
      React.createElement(FormField, { label: "L", hint: "H", error: "E", layout: "inline" }, "I"),
      React.createElement(CheckboxField, { label: "C" }),
      React.createElement(StatusPill, { tone: "warn", variant: "solid", dot: true, mono: true, onClick: () => {} }, "P"),
      React.createElement(Modal, { open: true, onClose: () => {}, title: "M", subtitle: "S", footer: "F", size: "columns", colCount: 2 }, "B"),
      React.createElement(Drawer, { open: true, onClose: () => {}, title: "D", toolbar: "T" }, "B"),
      React.createElement(Collapsible, { summary: "S", summaryExtra: "E" }, "B"),
      React.createElement(DataTable, { variant: "compact" }, null),
      React.createElement(AlertBanner, { tone: "info", title: "T", onDismiss: () => {} }, "B"),
      React.createElement(EmptyState, { title: "E", description: "D", action: "A" }),
    );

    const renderedHtml = renderToStaticMarkup(sampleTree);
    const classAttrRe = /class="([^"]+)"/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = classAttrRe.exec(renderedHtml)) !== null) {
      for (const token of attrMatch[1]!.split(/\s+/).filter(Boolean)) {
        assert.ok(
          definedClasses.has(token),
          `Rendered class ".${token}" must be defined in ui-*.css`,
        );
      }
    }
  });

  it("manages LIFO overlay stack and idempotent cleanup via pushOverlay", () => {
    assert.equal(hasActiveOverlay(), false);
    const closed: string[] = [];
    const popParent = pushOverlay(() => closed.push("parent"));
    assert.equal(hasActiveOverlay(), true);
    const popChild = pushOverlay(() => closed.push("child"));

    assert.equal(dispatchOverlayEscape(), true);
    assert.deepEqual(closed, ["child"]);

    popChild();
    popChild(); // idempotent second call
    assert.equal(hasActiveOverlay(), true);
    assert.equal(dispatchOverlayEscape(), true);
    assert.deepEqual(closed, ["child", "parent"]);

    popParent();
    assert.equal(hasActiveOverlay(), false);
    assert.equal(dispatchOverlayEscape(), false);
  });
});
