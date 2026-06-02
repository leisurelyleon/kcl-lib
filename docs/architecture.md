# Architecture

`kcl-diff` computes a **semantic** diff between two KCL documents — it reports
*structural* changes (which declarations were added, removed, or modified)
rather than line-by-line text changes. A whitespace or comment-only edit
produces an empty diff.

## Pipeline

```text
old.kcl ─┐
├─▶ kcl_lib::Program::parse ─▶ serde_json AST ─▶ normalize ─▶ index ─┐
new.kcl ─┘                               ├─▶ diff ─▶ DiffReport
┘
```

1. **Parse** — each source is parsed by Zoo's own `kcl-lib` crate (ADR 0001),
   producing KCL's real AST.
2. **Serialize** — the AST (`Program.ast`, which derives `Serialize`) is lowered
   to a `serde_json::Value` (ADR 0002). This avoids depending on `kcl-lib`'s
   internal node types, which are not all re-exported.
3. **Normalize** — source-position and caching keys (byte offsets, digests) are
   stripped, so formatting changes do not register as semantic changes.
4. **Index** — top-level declarations are keyed by name so they can be matched
   across files even if they move.
5. **Diff** — declarations are classified `added` / `removed` / `modified`.

## Components

| Crate / package        | Role                                              |
|------------------------|---------------------------------------------------|
| `crates/kcl-diff-core` | Rust diff engine; compiles to native + WASM       |
| `web/`                 | Next.js frontend; runs the engine via WebAssembly |

The engine runs **client-side in WebAssembly** — the same way Zoo's own Design
Studio runs KCL (a TypeScript frontend over a Rust/WASM core). The deployed demo
needs no backend for its core feature.

## Optional 3D preview

A true 3D render comes from Zoo's hosted geometry engine (a video stream over
WebSocket, requiring an API token). It is an optional, configuration-gated
enhancement — see ADR 0003. The semantic diff is fully functional without it.
