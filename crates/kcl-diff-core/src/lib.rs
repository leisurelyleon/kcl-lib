//! `kcl-diff-core` — a semantic diff engine for KCL (the KittyCAD Language).
//!
//! Instead of comparing two `.kcl` files as plain text, this crate parses each
//! file into KCL's real AST using Zoo's own [`kcl_lib`] parser, normalizes away
//! formatting/position noise, and reports *structural* changes: which top-level
//! declarations were added, removed, or modified.

mod ast_index;
mod diff;
mod parse;
mod report;

pub use diff::diff;
pub use report::{ChangeKind, DiffEntry, DiffReport};

/// Errors that can occur while diffing two KCL sources.
#[derive(Debug, thiserror::Error)]
pub enum DiffError {
    /// The KCL source failed to parse. Holds a human-readable description of
    /// the parser/compilation error(s).
    #[error("failed to parse KCL source ({label}): {message}")]
    Parse { label: String, message: String },

    /// The parsed AST could not be serialized for structural comparison.
    #[error("failed to serialize KCL AST: {0}")]
    Serialize(#[from] serde_json::Error),
}
