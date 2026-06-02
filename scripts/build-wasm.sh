#!/usr/bin/env bash
# Build kcl-diff-core to WebAssembly for the web frontend.
# Output: web/lib/pkg/  (imported by web/lib/wasm.ts)
#
# Installs the wasm32 target and wasm-pack if they're missing.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! rustup target list --installed | grep -q '^wasm32-unknown-unknown$'; then
  echo "Adding wasm32-unknown-unknown target..."
  rustup target add wasm32-unknown-unknown
fi

if ! command -v wasm-pack >/dev/null 2>&1; then
  echo "Installing wasm-pack (this can take a few minutes)..."
  cargo install wasm-pack --locked
fi

echo "Building kcl-diff-core -> web/lib/pkg (wasm) ..."
wasm-pack build crates/kcl-diff-core \
  --target web \
  --out-dir "$ROOT/web/lib/pkg" \
  --out-name kcl_diff_core \
  -- --features wasm

echo "Done. WASM package written to web/lib/pkg/"
