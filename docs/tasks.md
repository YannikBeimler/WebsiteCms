# Tasks

This file tracks pending tasks, bug fixes, and planned improvements.

## Technical Debt & Refactoring
Reference: `docs/best-practices-and-issues.md`

- [ ] **Fix RxJS Anti-Pattern:** Replace synchronous subscribing in `PageViewComponent` (`checkCanEdit`) with `combineLatest` and `async` pipe.
- [ ] **SSR Safety:** Replace direct `window` access in `ShellComponent` with the `DOCUMENT` injection token.
- [ ] **Implement Error Handling:** Add `try...catch` blocks in Firebase services (`page.service.ts`, `auth.service.ts`) and include user feedback (e.g., SnackBar).
- [ ] **Remove Hardcoded Mappings:** Move host mapping (`127.0.0.1` -> `localhost`) in `ShellComponent` to environment configuration.

## New Features
- (No entries yet)
