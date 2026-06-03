# 4. Run the engine as a native service, not in-browser WASM

- Status: Accepted (supersedes the in-browser WASM execution model)

## Context

The original plan ran `kcl-diff-core` in the browser as WebAssembly, mirroring
how Zoo's Design Studio runs KCL. Building for `wasm32` failed: `kcl-lib`'s wasm
target binds to TypeScript files (`connectionManager.ts`, `fileSystemManager.ts`)
via `#[wasm_bindgen(module = "...")]` paths that resolve *outside* the published
crate — those files ship only inside Zoo's modeling-app monorepo. The bindings
are gated on `target_arch = "wasm32"`, so an external consumer cannot disable
them. Conclusion: the published `kcl-lib` cannot be compiled to WebAssembly
outside Zoo's repository.

## Decision

Run the proven native build of `kcl-diff-core` behind a small Axum HTTP service
(`crates/kcl-diff-server`, `POST /diff`). The Next.js frontend calls it via a
same-origin rewrite (`/api/diff` -> the service), so the browser request needs no
CORS and the service URL is configurable per environment (`DIFF_API_URL`).

## Consequences

- (+) Uses the engine exactly as built and tested natively — no toolchain risk.
- (+) The diff logic (ADR 0002) is unchanged; only the execution venue moved.
- (-) Deployment is now two pieces: frontend (Vercel) + service (a Rust host).
- (-) The live demo depends on the service being reachable.
- Future: revisit in-browser WASM if Zoo publishes a parser-only crate that
  compiles to `wasm32` cleanly (e.g. `kcl-syntax`).
