//! Integration tests for the semantic diff engine.

use kcl_diff_core::{diff, ChangeKind};

#[test]
fn identical_sources_have_no_diff() {
    let src = "width = 10\nheight = 20\n";
    let report = diff(src, src).expect("parse + diff should succeed");
    assert!(report.is_empty(), "expected no changes, got {:?}", report.entries);
}

#[test]
fn changed_value_is_modified_not_added() {
    let report = diff("width = 10\n", "width = 12\n").expect("diff should succeed");
    let widths: Vec<_> = report.entries.iter().filter(|e| e.name == "width").collect();
    assert_eq!(widths.len(), 1);
    assert_eq!(widths[0].kind, ChangeKind::Modified);
}

#[test]
fn whitespace_only_change_is_ignored() {
    let old = "width = 10\nheight = 20\n";
    let new = "width   =   10\n\n\nheight = 20\n";
    let report = diff(old, new).expect("diff should succeed");
    assert!(
        report.is_empty(),
        "whitespace-only change should be semantically empty, got {:?}",
        report.entries
    );
}

#[test]
fn added_and_removed_declarations_are_detected() {
    let old = "width = 10\nheight = 20\n";
    let new = "width = 10\ndepth = 30\n";
    let report = diff(old, new).expect("diff should succeed");
    let kind_of = |name: &str| {
        report.entries.iter().find(|e| e.name == name).map(|e| e.kind.clone())
    };
    assert_eq!(kind_of("height"), Some(ChangeKind::Removed));
    assert_eq!(kind_of("depth"), Some(ChangeKind::Added));
}
