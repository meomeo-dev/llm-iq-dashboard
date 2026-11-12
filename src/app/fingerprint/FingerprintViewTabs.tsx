import { handleTabNavigation } from "@/app/components/ui/tab-navigation";

type View = "check" | "matrix";

export function FingerprintViewTabs({ active, onSelect, label, labels }: {
  active: View;
  onSelect: (view: View) => void;
  label: string;
  labels: Record<View, string>;
}) {
  return (
    <div className="page-group-nav" role="tablist" aria-label={label}
      onKeyDown={handleTabNavigation}>
      {(["check", "matrix"] as const).map((tab) => (
        <button key={tab} type="button" role="tab" id={`fingerprint-tab-${tab}`}
          aria-selected={active === tab} aria-controls="fingerprint-panel"
          tabIndex={active === tab ? 0 : -1}
          className={`page-group-link fp-subview-btn${active === tab ? " is-active" : ""}`}
          onClick={() => onSelect(tab)}>
          <span>{labels[tab]}</span>
        </button>
      ))}
    </div>
  );
}
