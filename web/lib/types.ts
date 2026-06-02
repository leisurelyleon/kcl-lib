// TypeScript mirror of `kcl_diff_core::DiffReport`
// (see crates/kcl-diff-core/src/report.rs). ChangeKind is serialized lowercase
// via serde(rename_all = "lowercase").

export type ChangeKind = "added" | "removed" | "modified";

export interface DiffEntry {
  name: string;
  kind: ChangeKind;
}

export interface DiffReport {
  entries: DiffEntry[];
  old_issues: string[];
  new_issues: string[];
}
