import type { DiffReport } from "@/lib/types";

type DiffEngine = {
  diff_kcl: (oldSrc: string, newSrc: string) => unknown;
};

let enginePromise: Promise<DiffEngine> | null = null;

/**
 * Lazily load and initialize the kcl-diff WebAssembly engine.
 * The package is produced by scripts/build-wasm.sh (wasm-pack --target web)
 * into web/lib/pkg/. If it hasn't been built, the import throws and the caller
 * surfaces a "build the WASM first" message.
 */
export function loadDiffEngine(): Promise<DiffEngine> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const mod = await import("@/lib/pkg/kcl_diff_core");
      // `--target web` requires an explicit init() before calling exports.
      await mod.default(new URL("./pkg/kcl_diff_core_bg.wasm", import.meta.url));
      return { diff_kcl: mod.diff_kcl };
    })();
  }
  return enginePromise;
}

/** Run a diff and coerce the result into the typed DiffReport shape. */
export async function runDiff(oldSrc: string, newSrc: string): Promise<DiffReport> {
  const engine = await loadDiffEngine();
  return engine.diff_kcl(oldSrc, newSrc) as DiffReport;
}
