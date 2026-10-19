import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkCssSelectors,
  checkCssValuesAndMedia,
  checkCssVariablesAndOwnership,
  stripCssComments,
} from "../../scripts/ui-hygiene/css-rules";
import { checkTsxFile } from "../../scripts/ui-hygiene/tsx-rules";
import { checkUiHygiene } from "../../scripts/check-ui-hygiene";

describe("scripts/check-ui-hygiene.ts", () => {
  it("passes on full enforced src/app tree", () => {
    const report = checkUiHygiene({ cwd: process.cwd() });
    assert.equal(
      report.success,
      true,
      `Expected 0 violations, got: ${JSON.stringify(report.violations, null, 2)}`,
    );
    assert.ok(report.checkedFiles >= 290);
  });

  it("UI-00 & UI-01: detects @/core imports, static inline styles, spreads, ternary branches, and gridTemplateColumns", () => {
    const badUiFile = `
      import type { RunRecord } from "@/core/types";
      export function BadBox({ pct, cond, ext }: { pct: number; cond: boolean; ext: Record<string, unknown> }) {
        const boxStyle = { fontSize: 12, width: "100%" };
        const altStyle = cond ? { "--ok-var": 1 } : { gridTemplateColumns: "1fr 1fr" };
        const width = "50%";
        return (
          <div style={boxStyle}>
            <div style={altStyle} />
            <div style={{ ...boxStyle }} />
            <div style={{ ...ext }} />
            <div style={{ width }} />
            <span style={{ "--custom-var": 1, width: \`\${pct}%\`, background: profileColor("a"), color: "#ff0000" }} />
          </div>
        );
      }
    `;
    const { violations } = checkTsxFile("src/app/components/ui/BadBox.tsx", badUiFile);
    const rules = violations.map((v) => v.rule);
    assert.ok(rules.includes("UI-00"), "Should catch @/core import in ui/");
    assert.ok(
      violations.some((v) => v.rule === "UI-01" && v.message.includes('"fontSize"')),
      "Should catch static fontSize via identifier style object",
    );
    assert.ok(
      violations.some((v) => v.rule === "UI-01" && v.message.includes('"gridTemplateColumns"')),
      "Should catch gridTemplateColumns in ternary style object",
    );
    assert.ok(
      violations.some((v) => v.rule === "UI-01" && v.message.includes("unresolved spread")),
      "Should catch unresolved spread style={{ ...ext }}",
    );
    assert.ok(
      violations.some((v) => v.rule === "UI-01" && v.message.includes('shorthand property "width"')),
      "Should catch shorthand static width variable",
    );
    assert.ok(
      !violations.some((v) => v.message.includes('"--custom-var"') || v.message.includes("profileColor")),
      "Should allow --custom-var, dynamic template width, and dynamic background function call",
    );
  });

  it("UI-02: detects JSX SVG color attributes (string & expression) while respecting export/profile-color exemptions", () => {
    const svgCode = `
      export function Icon() {
        return <svg><path fill="#ff0000" stroke={"rgb(0, 0, 0)"} /></svg>;
      }
    `;
    const { violations: vNormal } = checkTsxFile("src/app/fingerprint/Icon.tsx", svgCode);
    assert.equal(vNormal.filter((v) => v.rule === "UI-02").length, 2);

    const { violations: vExport } = checkTsxFile("src/app/components/export/timeline-svg.ts", svgCode);
    assert.equal(vExport.filter((v) => v.rule === "UI-02").length, 0);

    const { violations: vProfileColor } = checkTsxFile(
      "src/app/components/profile/profile-color.ts",
      svgCode,
    );
    assert.equal(vProfileColor.filter((v) => v.rule === "UI-02").length, 0);
  });

  it("UI-02 & UI-03: detects raw colors, non-token font-size, bad breakpoints, tag-qualified classes, bare descendant controls, and chained :not()", () => {
    const badCss = stripCssComments(`
      /* #fff inside comment is ignored */
      button.primary { color: var(--text); }
      .fp-card button:not(.a):hover:not(.b) {
        background: rgba(255, 0, 0, 0.2);
        font-size: 13px;
      }
      .config label, .config select { color: var(--text); }
      .ui-check-row > input, .menu-row input { cursor: pointer; }
      @media (max-width: 768px) {
        .fp-card { padding: var(--space-2); }
      }
    `);
    const v2 = checkCssValuesAndMedia("src/app/fingerprint/bad.css", badCss);
    assert.ok(v2.some((v) => v.rule === "UI-02" && v.message.includes("Raw color")));
    assert.ok(v2.some((v) => v.rule === "UI-02" && v.message.includes("Non-token font-size")));
    assert.ok(v2.some((v) => v.rule === "UI-02" && v.message.includes("768px")));

    const { violations: v3 } = checkCssSelectors("src/app/fingerprint/bad.css", badCss);
    assert.ok(
      v3.some((v) => v.rule === "UI-03a" && v.message.includes("button.primary")),
      "Should catch tag-qualified class button.primary",
    );
    assert.ok(
      v3.some((v) => v.rule === "UI-03b" && v.message.includes('"label"')),
      "Should catch descendant bare .config label",
    );
    assert.ok(
      v3.some((v) => v.rule === "UI-03b" && v.message.includes('"select"')),
      "Should catch descendant bare .config select",
    );
    assert.ok(
      !v3.some((v) => v.rule === "UI-03b" && v.message.includes(".ui-check-row")),
      "Should exempt .ui-check-row > input and .menu-row input",
    );
    assert.ok(
      v3.some((v) => v.rule === "UI-03c"),
      "Should catch non-adjacent chained :not(.a):hover:not(.b)",
    );
  });

  it("UI-04a/b/c: detects cross-dir leadingClass collision, standalone class leak (.actions), and undefined/fallback vars while allowing same-dir & .ui-*", () => {
    const fileA = {
      relFile: "src/app/components/profile/profile.css",
      stripped: ".profile-card { color: var(--unknown-ghost-var); }",
      leadingClasses: new Map([["profile-card", 1]]),
      standaloneClasses: new Map([["profile-card", 1]]),
      referencedClasses: new Map([["profile-card", 1]]),
    };
    const fileSameDir = {
      relFile: "src/app/components/profile/profile-extra.css",
      stripped: ".profile-card:hover { color: var(--text); }",
      leadingClasses: new Map([["profile-card", 1]]),
      standaloneClasses: new Map([["profile-card", 1]]),
      referencedClasses: new Map([["profile-card", 1]]),
    };
    const fileB = {
      relFile: "src/app/config/config-profiles.css",
      stripped: ".profile-card { border-radius: var(--radius-md, 7px); } .actions { display: flex; }",
      leadingClasses: new Map([
        ["profile-card", 1],
        ["actions", 1],
      ]),
      standaloneClasses: new Map([["actions", 1]]),
      referencedClasses: new Map([["actions", 1]]),
    };
    const filePairCss = {
      relFile: "src/app/pair/pair.css",
      stripped: ".pair-card .actions { gap: var(--space-2); }",
      leadingClasses: new Map([["pair-card", 1]]),
      standaloneClasses: new Map(),
      referencedClasses: new Map([
        ["pair-card", 1],
        ["actions", 1],
      ]),
    };
    const filePairTsx = {
      relFile: "src/app/pair/PairCodeForm.tsx",
      usedClasses: new Map([["actions", 12]]),
    };
    const definedVars = new Set(["--radius-md", "--text", "--space-2"]);
    const globalTokenVars = new Set(["--radius-md", "--text", "--space-2"]);

    const v4 = checkCssVariablesAndOwnership(
      [fileA, fileSameDir, fileB, filePairCss],
      definedVars,
      globalTokenVars,
      [filePairTsx],
    );
    assert.equal(
      v4.filter((v) => v.rule === "UI-04a" && v.message.includes(".profile-card")).length,
      1,
      "Same-dir fileSameDir should not trigger UI-04a; cross-dir fileB should trigger once",
    );
    assert.ok(
      v4.some((v) => v.rule === "UI-04b" && v.file === "src/app/pair/pair.css"),
      "Should catch standalone .actions leaked into pair.css",
    );
    assert.ok(
      v4.some((v) => v.rule === "UI-04b" && v.file === "src/app/pair/PairCodeForm.tsx"),
      "Should catch standalone .actions referenced in PairCodeForm.tsx",
    );
    assert.ok(v4.some((v) => v.rule === "UI-04c" && v.message.includes("--unknown-ghost-var")));
    assert.ok(v4.some((v) => v.rule === "UI-04c" && v.message.includes("--radius-md")));
  });
});
