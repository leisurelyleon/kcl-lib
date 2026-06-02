//! Output types for a diff run.

use serde::Serialize;

/// The kind of change applied to a top-level declaration.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum ChangeKind {
    Added,
    Removed,
    Modified,
}

/// A single declaration-level change.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct DiffEntry {
    /// The declaration name (or positional key for unnamed statements).
    pub name: String,
    /// What happened to it.
    pub kind: ChangeKind,
}

/// The full result of diffing two KCL sources.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct DiffReport {
    /// Declaration-level changes, sorted by name.
    pub entries: Vec<DiffEntry>,
    /// Non-fatal parser issues from the "old" source.
    pub old_issues: Vec<String>,
    /// Non-fatal parser issues from the "new" source.
    pub new_issues: Vec<String>,
}

impl DiffReport {
    /// `true` if the two sources are semantically identical.
    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    /// Counts of (added, removed, modified).
    pub fn summary(&self) -> (usize, usize, usize) {
        let (mut added, mut removed, mut modified) = (0, 0, 0);
        for e in &self.entries {
            match e.kind {
                ChangeKind::Added => added += 1,
                ChangeKind::Removed => removed += 1,
                ChangeKind::Modified => modified += 1,
            }
        }
        (added, removed, modified)
    }

    /// A short human-readable one-line summary.
    pub fn headline(&self) -> String {
        let (a, r, m) = self.summary();
        format!("{a} added, {r} removed, {m} modified")
    }
}
