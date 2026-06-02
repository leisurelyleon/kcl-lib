"use client";

interface KclEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function KclEditor({ label, value, onChange }: KclEditorProps) {
  return (
    <div className="editor">
      <div className="editor-label">{label}</div>
      <textarea
        className="editor-area"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="// paste KCL here"
      />
      <style jsx>{`
        .editor { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .editor-label {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--muted); padding: 0.5rem 0.75rem;
          background: var(--panel); border-bottom: 1px solid var(--border);
        }
        .editor-area {
          flex: 1; min-height: 320px; resize: vertical;
          background: var(--panel); color: var(--text); border: none;
          padding: 0.75rem; font-family: var(--mono); font-size: 0.85rem;
          line-height: 1.5; tab-size: 2;
        }
        .editor-area:focus { outline: 1px solid var(--accent); outline-offset: -1px; }
      `}</style>
    </div>
  );
}
