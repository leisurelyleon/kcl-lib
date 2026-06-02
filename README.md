# kcl-diff

A **semantic diff tool for KCL** — Zoo's parametric CAD language. Instead of
comparing two `.kcl` files as text, `kcl-diff` parses each with Zoo's own
[`kcl-lib`](https://crates.io/crates/kcl-lib) compiler, then reports the
*structural* changes: which declarations were added, removed, or modified.
Formatting and whitespace are ignored.

## Why it's built this way

- **Real parser, not a reimplementation.** It uses `kcl-lib`'s `Program::parse`,
  so the grammar is always correct and tracks upstream KCL. (ADR 0001)
- **AST-level, version-resilient diff.** It diffs the serialized AST and
  normalizes away source positions, so it depends only on stable public API. (ADR 0002)
- **Runs in the browser via WebAssembly** — the same client-side Rust/WASM model
  Zoo's Design Studio uses. The deployed demo needs no backend.

## Layout

| Path                   | What it is                                   |
|------------------------|----------------------------------------------|
| `crates/kcl-diff-core` | Rust diff engine (native + WASM)             |
| `web/`                 | Next.js frontend                             |
| `docs/`                | Architecture + ADRs                          |

## Develop

Prerequisites: Rust (via `rustup`) and Node 20+. (A `.devcontainer` ships both.)

```bash
# Engine: build + test (native)
cargo build
cargo test

# Engine: build to WebAssembly for the frontend
./scripts/build-wasm.sh

# Frontend
cd web
npm install
npm run dev      # http://localhost:3000
```

## Deploy

Deployed on Vercel with **Root Directory = `web`**. The generated WASM package
(`web/lib/pkg/`) is committed, so Vercel builds the frontend with a Node
toolchain only — no Rust required in the deploy pipeline.

## Status

- [x] Semantic diff engine (native, tested)
- [ ] WASM build verified
- [ ] Live Vercel demo
- [ ] Optional token-gated 3D preview (ADR 0003)
