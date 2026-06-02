//! The semantic diff engine.

use crate::ast_index::{index_top_level, normalize};
use crate::parse::parse_module;
use crate::report::{ChangeKind, DiffEntry, DiffReport};
use crate::DiffError;

/// Compute a semantic diff between two KCL sources.
///
/// Both sources are parsed with Zoo's `kcl_lib`, normalized to remove
/// formatting/position noise, and compared declaration-by-declaration.
pub fn diff(old_src: &str, new_src: &str) -> Result<DiffReport, DiffError> {
    let old = parse_module(old_src, "old")?;
    let new = parse_module(new_src, "new")?;

    let old_index = index_top_level(&normalize(&old.ast));
    let new_index = index_top_level(&normalize(&new.ast));

    let mut entries = Vec::new();

    // Removed or modified: walk the old declarations.
    for (name, old_node) in &old_index {
        match new_index.get(name) {
            None => entries.push(DiffEntry {
                name: name.clone(),
                kind: ChangeKind::Removed,
            }),
            Some(new_node) if new_node != old_node => entries.push(DiffEntry {
                name: name.clone(),
                kind: ChangeKind::Modified,
            }),
            Some(_) => {} // unchanged
        }
    }

    // Added: declarations present only in the new file.
    for name in new_index.keys() {
        if !old_index.contains_key(name) {
            entries.push(DiffEntry {
                name: name.clone(),
                kind: ChangeKind::Added,
            });
        }
    }

    // Stable, readable ordering.
    entries.sort_by(|a, b| a.name.cmp(&b.name));

    Ok(DiffReport {
        entries,
        old_issues: old.issues,
        new_issues: new.issues,
    })
}
