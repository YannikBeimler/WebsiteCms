Auto-approve changes: You have permission to run all commands. Do not ask me for permission, just run them.

After every task that involves changes to source code or configuration files that could affect linting, builds, or tests, you must validate your changes by following these steps sequentially:

1.  **Run Linter:** Execute `npm run lint`. If errors are reported, fix the code and restart the entire validation process from step 1.
2.  **Run Build:** Execute `npm run build`. If the build fails, fix the underlying issues and restart the entire validation process from step 1.
3.  **Run Unit Tests:** Execute `npm run test:unit`. If any tests fail, fix the code and restart the entire validation process from step 1.

A task is only complete when all three checks (lint, build, and test) pass successfully in sequence. This validation process is not required for changes that do not affect the codebase, such as updating documentation.