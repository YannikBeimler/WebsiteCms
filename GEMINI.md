**Task Complete:**

After every task that involves changes to source code or configuration files that could affect linting, builds, or tests, you must validate your changes by following these steps sequentially:

1.  **Run Linter:** Execute `npm run lint`. If errors are reported, fix the code and restart the entire validation process from step 1.
2.  **Run Unit Tests:** Execute `npm run test:unit`. If any tests fail, fix the code and restart the entire validation process from step 1.
3.  **Run Build:** Execute `npm run build`. If the build fails, fix the underlying issues and restart the entire validation process from step 1.

A task is only complete when all three checks (lint, build, and test) pass successfully in sequence. This validation process is not required for changes that do not affect the codebase, such as updating documentation.

**Project Structure & Metadata:**

- **The `meta/` Directory:** All auxiliary project information is consolidated here.
    - `meta/agents/`: (Tracked) Contains agent configurations and instructions.
    - `meta/docs/`: (Tracked) Architecture Decision Records (ADRs), system maps, and team documentation.
    - `meta/STATE_LEDGER.md`: (Tracked) The primary ledger for tracking project progress and feature states.
    - `meta/handovers/`: (Ignored) Transient state logs and detailed handover notes.
- **Feature Development:** Use native `git worktree` for developing features in isolation. Avoid manual folder duplication.
- **Package Management:** Prefer `pnpm` for efficient dependency management across multiple worktrees.

**Architectural Guidelines:**

- **Models:** When creating new data structures such as interfaces or types, place them in their own file within the `src/models` directory. For example, a `User` interface should be defined in `src/models/user.ts`.
- **Services:** Extract business logic from components and place it into services within the `src/services` directory. Business logic includes operations like data fetching, data manipulation, and API interactions. Components should import and use these services to handle such operations. For instance, logic for fetching or updating user data should reside in a `userService.ts`.
