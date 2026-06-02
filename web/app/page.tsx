"use client";

import { useEffect, useState } from "react";
import KclEditor from "@/components/KclEditor";
import DiffPanel from "@/components/DiffPanel";
import PreviewViewport from "@/components/PreviewViewport";
import { runDiff } from "@/lib/api";
import type { DiffReport } from "@/lib/types";

export default function Home() {
  const [oldSrc, setOldSrc] = useState("");
  const [newSrc, setNewSrc] = useState("");
  const [report, setReport] = useState<DiffReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Preload the bundled sample pair so the demo is interactive immediately.
  useEffect(() => {
    Promise.all([
      fetch("/samples/bracket-v1.kcl").then((r) => r.text()),
      fetch("/samples/bracket-v2.kcl").then((r) => r.text()),
    ])
      .then(([a, b]) => {
        setOldSrc(a);
        setNewSrc(b);
      })
      .catch(() => {
        /* samples are a convenience; ignore load failures */
      });
  }, []);

  async function handleDiff() {
    setBusy(true);
    setError(null);
    try {
      setReport(await runDiff(oldSrc, newSrc));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to run diff. Has the WASM engine been built?",
      );
      setReport(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <header className="head">
        <h1>kcl-diff</h1>
        <p>
          Semantic diff for KCL, powered by Zoo&apos;s own <code>kcl-lib</code> parser
          compiled to WebAssembly. The two models below are compared structurally —
          formatting and whitespace are ignored.
        </p>
      </header>

      <section className="editors">
        <KclEditor label="Old (.kcl)" value={oldSrc} onChange={setOldSrc} />
        <KclEditor label="New (.kcl)" value={newSrc} onChange={setNewSrc} />
      </section>

      <div className="actions">
        <button onClick={handleDiff} disabled={busy}>
          {busy ? "Diffing…" : "Compute semantic diff"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <section className="results">
        <DiffPanel report={report} />
        <PreviewViewport enabled={false} />
      </section>

      <style jsx>{`
        .page { max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        .head h1 { font-family: var(--mono); font-size: 1.6rem; margin: 0 0 0.5rem; }
        .head p { color: var(--muted); font-size: 0.9rem; line-height: 1.6; margin: 0 0 1.5rem; max-width: 70ch; }
        .head code { font-family: var(--mono); color: var(--accent); }
        .editors {
          display: flex; gap: 1px;
          border: 1px solid var(--border); border-radius: 8px; overflow: hidden;
          background: var(--border);
        }
        .actions { margin: 1rem 0; }
        button {
          background: var(--accent); color: #0d1117; border: none;
          padding: 0.6rem 1.1rem; border-radius: 6px; font-weight: 600;
          cursor: pointer; font-size: 0.85rem;
        }
        button:disabled { opacity: 0.6; cursor: default; }
        .error {
          background: rgba(248, 81, 73, 0.1); border: 1px solid var(--removed);
          color: var(--removed); padding: 0.6rem 0.75rem; border-radius: 6px;
          font-size: 0.8rem; font-family: var(--mono); margin-bottom: 1rem;
        }
        .results { border: 1px solid var(--border); border-radius: 8px; background: var(--panel); overflow: hidden; }
        @media (max-width: 640px) { .editors { flex-direction: column; } }
      `}</style>
    </main>
  );
}
