"use client";

import type { DiffReport, ChangeKind } from "@/lib/types";

const KIND_LABEL: Record<ChangeKind, string> = {
  added: "Added",
  removed: "Removed",
  modified: "Modified",
};
const KIND_COLOR: Record<ChangeKind, string> = {
  added: "var(--added)",
  removed: "var(--removed)",
  modified: "var(--modified)",
};
const KIND_SIGIL: Record<ChangeKind, string> = {
  added: "+",
  removed: "\u2212",
  modified: "~",
};

export default function DiffPanel({ report }: { report: DiffReport | null }) {
  if (!report) {
    return <p className="hint">Run a diff to see structural changes.<style jsx>{`.hint{color:var(--muted);font-size:0.85rem;padding:0.75rem;}`}</style></p>;
  }

  const counts = report.entries.reduce(
    (acc, e) => {
      acc[e.kind] += 1;
      return acc;
    },
    { added: 0, removed: 0, modified: 0 } as Record<ChangeKind, number>,
  );

  return (
    <div className="diff">
      <div className="summary">
        <span style={{ color: KIND_COLOR.added }}>{counts.added} added</span>
        <span style={{ color: KIND_COLOR.removed }}>{counts.removed} removed</span>
        <span style={{ color: KIND_COLOR.modified }}>{counts.modified} modified</span>
      </div>

      {report.entries.length === 0 ? (
        <p className="hint">No semantic changes — the two models are structurally identical.</p>
      ) : (
        <ul className="entries">
          {report.entries.map((e) => (
            <li key={`${e.kind}-${e.name}`} style={{ color: KIND_COLOR[e.kind] }}>
              <span className="sigil">{KIND_SIGIL[e.kind]}</span>
              <span className="name">{e.name}</span>
              <span className="kind">{KIND_LABEL[e.kind]}</span>
            </li>
          ))}
        </ul>
      )}

      {(report.old_issues.length > 0 || report.new_issues.length > 0) && (
        <div className="issues">
          {report.old_issues.map((m, i) => (
            <div key={`o-${i}`} className="issue">old: {m}</div>
          ))}
          {report.new_issues.map((m, i) => (
            <div key={`n-${i}`} className="issue">new: {m}</div>
          ))}
        </div>
      )}

      <style jsx>{`
        .diff { padding: 0.75rem; }
        .summary {
          display: flex; gap: 1rem; font-size: 0.8rem; font-family: var(--mono);
          padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); margin-bottom: 0.75rem;
        }
        .entries { list-style: none; margin: 0; padding: 0; font-family: var(--mono); font-size: 0.85rem; }
        .entries li { display: flex; align-items: center; gap: 0.6rem; padding: 0.2rem 0; }
        .sigil { width: 1ch; font-weight: 700; }
        .name { flex: 1; }
        .kind { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8; }
        .hint { color: var(--muted); font-size: 0.85rem; padding: 0.75rem; margin: 0; }
        .issues { margin-top: 0.75rem; border-top: 1px solid var(--border); padding-top: 0.5rem; }
        .issue { color: var(--muted); font-family: var(--mono); font-size: 0.75rem; }
      `}</style>
    </div>
  );
}
