//! Normalization and indexing of the serialized KCL AST.
//!
//! 1. [`normalize`] strips positional / formatting noise (byte offsets, digests)
//!    so a pure whitespace or comment change does NOT register as a semantic diff.
//! 2. [`index_top_level`] keys each top-level declaration by its name so the diff
//!    engine can match declarations across files even if they move.

use std::collections::BTreeMap;

use serde_json::{Map, Value};

/// JSON object keys that carry source-position or caching noise rather than
/// semantic meaning. Removed before comparison.
///
/// NOTE: confirm against a real serialized AST (see the snapshot test below in
/// `tests/`) and extend if Zoo's serialization uses other position keys.
const NOISE_KEYS: &[&str] = &[
    "start",
    "end",
    "moduleId",
    "commentStart",
    "digest",
    "sourceRange",
];

/// Recursively remove noise keys from a serialized AST value.
pub(crate) fn normalize(value: &Value) -> Value {
    match value {
        Value::Object(map) => {
            let mut out = Map::new();
            for (k, v) in map {
                if NOISE_KEYS.contains(&k.as_str()) {
                    continue;
                }
                out.insert(k.clone(), normalize(v));
            }
            Value::Object(out)
        }
        Value::Array(items) => Value::Array(items.iter().map(normalize).collect()),
        other => other.clone(),
    }
}

/// Index the top-level body of a (normalized) program by a best-effort key.
///
/// Key is the declaration's name when found, else a positional fallback
/// (`#0`, `#1`, ...) so unnamed statements still participate in the diff.
pub(crate) fn index_top_level(program: &Value) -> BTreeMap<String, Value> {
    let mut map = BTreeMap::new();

    let body = program
        .get("body")
        .and_then(Value::as_array)
        .cloned()
        .unwrap_or_default();

    for (i, item) in body.iter().enumerate() {
        let mut key = extract_name(item).unwrap_or_else(|| format!("#{i}"));
        // Keep duplicate-named items distinct so neither is silently dropped.
        if map.contains_key(&key) {
            key = format!("{key}#{i}");
        }
        map.insert(key, item.clone());
    }

    map
}

/// Best-effort extraction of a declaration's name from common AST shapes.
///
/// KCL's serialized statements vary by kind; we probe the paths that hold an
/// identifier. Confirm/extend against a real serialized sample.
fn extract_name(item: &Value) -> Option<String> {
    let candidates = [
        item.pointer("/declaration/id/name"),
        item.pointer("/declaration/name"),
        item.pointer("/id/name"),
        item.pointer("/name/name"),
        item.get("name"),
    ];

    for c in candidates.into_iter().flatten() {
        if let Some(s) = c.as_str() {
            return Some(s.to_string());
        }
    }
    None
}
