// Ambient declaration for the wasm-pack output, generated into web/lib/pkg/
// by scripts/build-wasm.sh. Lets the app typecheck before the package exists.
declare module "@/lib/pkg/kcl_diff_core" {
  /** wasm-pack `--target web` default export: initializes the module. */
  export default function init(
    input?: URL | string | Request | BufferSource,
  ): Promise<unknown>;

  /** Diff two KCL sources; returns the serialized DiffReport. */
  export function diff_kcl(oldSrc: string, newSrc: string): unknown;
}
