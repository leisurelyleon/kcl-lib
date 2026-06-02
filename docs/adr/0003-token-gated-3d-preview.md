# 3. The 3D preview is optional and token-gated

- Status: Accepted

## Context

A true visual render of a KCL model comes from Zoo's hosted geometry engine: the
3D view is a video stream delivered over WebSocket, which requires a Zoo API
token and server-side session management. The *core* value of this tool — the
semantic diff — must work with no backend and no secrets.

## Decision

Ship the semantic diff as the always-on core, executed client-side in WASM. The
3D preview is an optional enhancement, enabled only when `ZOO_API_TOKEN` is
configured. Until the engine session is implemented, the UI shows an accurate
"disabled / not configured" state rather than a faked render.

## Consequences

- (+) The deployed demo works for any reviewer, instantly, with no setup.
- (+) Honest about scope — no simulated engine protocol.
- (−) No live 3D in the default demo.
- Future: implement the engine WebSocket session behind the token gate.
