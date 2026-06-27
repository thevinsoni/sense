# Changelog

## [0.1.1] - 2026-06-27

### Fixed
- Fixed vulnerability reporting structure (location.line instead of line)
- Fixed secret detection output
- Fixed destructive command reporting
- Updated to fivosense v0.1.6

### Changed
- Separate handling for vulnerabilities, secrets, and destructive commands
- Improved taint-trace proof display
- Better error messages

## [0.1.0] - 2026-06-26

### Added
- Initial release
- Real-time security scanning for JavaScript/TypeScript
- 54 detection patterns (SQL injection, XSS, command injection, secrets, destructive commands)
- Taint-trace proof generation
- Auto-fix suggestions
- Roast mode for fun security feedback
- Security badge grading system
- Scan on save
- Workspace scanning
- Configurable severity levels

### Features
- AST-based taint analysis
- Zero false negatives for critical vulnerabilities
- Detailed evidence with data-flow traces
