//! WebAssembly bindings (enabled with the `wasm` feature).
//!
//! Exposes `diff_kcl(old, new)` to JavaScript, returning the `DiffReport`
//! as a JS object via `serde-wasm-bindgen`.

use wasm_bindgen::prelude::*;

/// Diff two KCL sources and return the report as a JS value.
#[wasm_bindgen]
pub fn diff_kcl(old_src: &str, new_src: &str) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let report =
        crate::diff(old_src, new_src).map_err(|e| JsValue::from_str(&e.to_string()))?;

    serde_wasm_bindgen::to_value(&report).map_err(|e| JsValue::from_str(&e.to_string()))
}
