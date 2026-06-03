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
- **Native engine, thin web frontend.** The diff engine runs as a small native
  Rust service; the Next.js frontend calls it. (Building `kcl-lib` to in-browser
  WASM isn't possible outside Zoo's monorepo — see ADR 0004.)

## Layout

| Path                     | What it is                              |
|--------------------------|-----------------------------------------|
| `crates/kcl-diff-core`   | Rust diff engine (library)              |
| `crates/kcl-diff-server` | Axum HTTP service exposing `POST /diff` |
| `web/`                   | Next.js frontend                        |
| `docs/`                  | Architecture + ADRs                     |

## Develop

Prerequisites: Rust (via `rustup`) and Node 20+. (A `.devcontainer` ships both.)

```bash
# Engine: build + test
cargo build --workspace
cargo test --workspace

# Run the diff service (listens on :8080)
cargo run -p kcl-diff-server

# In another terminal: run the frontend (proxies /api/diff -> :8080)
cd web
npm install
npm run dev      # http://localhost:3000
```

## Deploy

- **Frontend** -> Vercel, Root Directory = `web`. Set `DIFF_API_URL` to the
  deployed service URL; the `/api/diff` rewrite proxies to it.
- **Service** -> any Rust-friendly host (e.g. Fly.io or Shuttle) running
  `kcl-diff-server`.

## Status

- [x] Semantic diff engine (native, tested)
- [x] HTTP service over the engine
- [ ] Live frontend wired to the service
- [ ] Deployed demo (Vercel + Rust host)
- [ ] Optional token-gated 3D preview (ADR 0003)
