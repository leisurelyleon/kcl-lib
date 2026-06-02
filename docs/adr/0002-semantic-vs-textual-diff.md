# 2. Diff the serialized AST, not text and not typed nodes

- Status: Accepted

## Context

The goal is a *semantic* diff, so a textual diff is out. But `kcl-lib`'s inner
AST node enums are not fully re-exported, so a strongly-typed AST walk would
depend on unstable/private import paths that could break across versions.

## Decision

Serialize `Program.ast` (which derives `Serialize`) to a `serde_json::Value`,
normalize away source-position/format noise, and diff structurally at the
top-level-declaration granularity.

## Consequences

- (+) Resilient to `kcl-lib` version bumps (depends only on `Serialize`).
- (+) Ignores whitespace/formatting/comments by construction.
- (+) No dependence on unstable internal node-type paths.
- (−) Coarser than a fully-typed walk (declaration-level to start).
- Future: switch to a typed walk if/when `kcl-lib` exposes its AST nodes.
