# 1. Use `kcl-lib` for parsing

- Status: Accepted

## Context

We need to turn KCL source into an AST. Two options: hand-write a KCL parser,
or depend on Zoo's published `kcl-lib` crate (their actual compiler tooling —
parser, lexer, AST).

A hand-written parser would inevitably drift from KCL's real grammar, would
need constant maintenance as the language evolves, and would signal *less* domain
credibility, not more.

## Decision

Depend on the published `kcl-lib` crate and parse via `Program::parse`, which
returns the parsed program plus any non-fatal compilation issues.

## Consequences

- (+) Grammar is always correct and tracks upstream KCL.
- (+) Strong signal: the tool is built *inside* Zoo's ecosystem, on their library.
- (−) Heavy dependency tree → long first build (~7–8 min observed).
- (−) `kcl-lib`'s internal AST node types are not all re-exported at the crate
  root. Addressed in ADR 0002.
