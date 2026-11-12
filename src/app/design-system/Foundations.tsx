import type { CSSProperties } from "react";
import { SWATCHES, TYPE_SAMPLES, type PreviewCopy } from "./specimens";

export function Foundations({ copy }: { copy: PreviewCopy }) {
  return (
    <section id="foundations" className="ds-section" aria-labelledby="ds-foundations-title">
      <h2 id="ds-foundations-title" className="ds-section-title">{copy.foundations}</h2>
      <ul className="ds-swatches">
        {SWATCHES.map(([name, token]) => (
          <li key={token} className="ds-swatch">
            <span
              className="ds-chip"
              style={{ "--ds-swatch": `var(${token})` } as CSSProperties}
              aria-hidden="true"
            />
            <span>{copy.swatches[name]}</span>
            <code className="ds-token">{token}</code>
          </li>
        ))}
      </ul>
      <div className="ds-panel">
        <h3 className="ds-panel-title">{copy.typography}</h3>
        <dl className="ds-type-scale">
          {TYPE_SAMPLES.map((size) => (
            <div className="ds-type-row" key={size}>
              <dt><code className="ds-token">--text-{size}</code></dt>
              <dd
                className="ds-type-sample"
                style={{ "--text-preview-size": `var(--text-${size})` } as CSSProperties}
              >
                {copy.typeSample}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
