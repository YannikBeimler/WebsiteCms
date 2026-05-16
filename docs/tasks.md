# Tasks

This file tracks pending tasks, bug fixes, and planned improvements.

## Active Design & Refactoring (Epics)
Reference: `docs/SWD/_index.md`

- [ ] **Epic: Database Restructuring (Priority 1)**
  - Reference: `docs/SWD/database-restructuring.md`
  - [ ] Update `seed-demo-data.mjs` for subcollection support.
  - [ ] Remove `siteId` from `Page` model.
  - [ ] Update `PageService` and `SiteService` paths.
  - [ ] Implement atomic recursive deletion for Sites.
  - [ ] Update Firebase Security Rules.

- [ ] **Epic: Eager Caching System (Priority 2)**
  - Reference: `docs/SWD/eager-caching-design.md`
  - [ ] Refactor `CmsService` to act as central store.
  - [ ] Implement "Full Site Fetch" on site load.
  - [ ] Convert components to use reactive data streams (Fixes RxJS Anti-Pattern).
  - [ ] Implement "Smart Update" logic for Create/Update/Delete.
  - [ ] Integrate `MatSnackBar` for error feedback.

## Technical Debt & Refactoring
Reference: `docs/best-practices-and-issues.md`

- [ ] **SSR Safety:** Replace direct `window` access in `ShellComponent` with the `DOCUMENT` injection token.
- [ ] **Remove Hardcoded Mappings:** Move host mapping (`127.0.0.1` -> `localhost`) in `ShellComponent` to environment configuration.

## New Features
- (No entries yet)
