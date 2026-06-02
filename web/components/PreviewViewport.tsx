"use client";

/**
 * Optional 3D preview.
 *
 * A true visual render comes from Zoo's hosted geometry engine (the 3D view is
 * a video stream over WebSocket, requiring a Zoo API token). That is OUT of
 * scope for the core, always-on diff — it's a configuration-gated enhancement.
 * Real wiring is tracked in docs/adr/0003-token-gated-3d-preview.md.
 */
export default function PreviewViewport({ enabled }: { enabled: boolean }) {
  return (
    <div className="preview">
      <div className="preview-label">3D Preview</div>
      <div className="preview-body">
        {enabled ? (
          <p>Engine configured — render integration pending (see ADR 0003).</p>
        ) : (
          <p>
            Optional. Set <code>ZOO_API_TOKEN</code> to enable a live 3D render via
            Zoo&apos;s geometry engine. The semantic diff works without it.
          </p>
        )}
      </div>
      <style jsx>{`
        .preview { border-top: 1px solid var(--border); }
        .preview-label {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--muted); padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border);
        }
        .preview-body { padding: 0.75rem; color: var(--muted); font-size: 0.8rem; }
        code { font-family: var(--mono); color: var(--accent); }
      `}</style>
    </div>
  );
}
