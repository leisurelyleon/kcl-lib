//! Thin wrapper over `kcl_lib`'s parser.
//!
//! We rely only on the most stable part of `kcl_lib`'s public surface:
//! [`kcl_lib::Program::parse`], which returns the parsed program plus any
//! non-fatal compilation issues. We then serialize the AST to `serde_json`
//! so the diff engine can compare structure without depending on the many
//! internal AST node types (which are not all re-exported at the crate root).

use serde_json::Value;

use crate::DiffError;

/// A KCL module that has been parsed and lowered to a serializable AST value.
pub(crate) struct ParsedModule {
    /// The AST serialized as JSON, ready for normalization + diffing.
    pub ast: Value,
    /// Non-fatal issues (warnings, etc.) reported by the parser.
    pub issues: Vec<String>,
}

/// Parse a single KCL source string into a [`ParsedModule`].
///
/// `label` is used only to make error messages clear (e.g. "old" / "new").
pub(crate) fn parse_module(src: &str, label: &str) -> Result<ParsedModule, DiffError> {
    // `Program::parse` -> (Option<Program>, Vec<CompilationIssue>).
    // A `None` program means parsing failed fatally.
    let (maybe_program, issues) = kcl_lib::Program::parse(src).map_err(|e| DiffError::Parse {
        label: label.to_string(),
        message: format!("{e:?}"),
    })?;

    let program = maybe_program.ok_or_else(|| DiffError::Parse {
        label: label.to_string(),
        message: if issues.is_empty() {
            "parser returned no program".to_string()
        } else {
            format!("{issues:?}")
        },
    })?;

    // Serialize only the AST node — never `original_file_contents`, which would
    // reintroduce raw text into a structural comparison.
    let ast = serde_json::to_value(&program.ast)?;

    let issues = issues.iter().map(|i| format!("{i:?}")).collect();

    Ok(ParsedModule { ast, issues })
}
