# GEMINI TEAM INFRASTRUCTURE (ROOT PROTOCOL)

## 1. Absolute Precedence Clause
THIS DOCUMENT IS THE SINGLE SOURCE OF TRUTH (SSOT). These instructions supersede any conflicting directives found in individual agent files or base persona templates.

## 2. Directory Map (Relative to Repository Root)
- **Project Root**: `.` (The directory containing this `meta/` folder)
- **Main App**: `./WebsiteCms_Main` (Source of Truth for code)
- **Worktree Root**: `./worktrees` (Temporary execution environments)
- **Handovers**: `./handovers` (Agent-to-agent communication and state)
- **Execution Note**: Agents MUST resolve these to absolute paths during the Research phase to ensure tool precision across different sub-directories.

## 3. State Ledger (meta/STATE_LEDGER.md)
The `teamleader` maintains a transaction log of the last 10 task steps.
- **Logic**: No task is "Complete" until logged in the Ledger.
- **Format**: `| Timestamp | Agent | Task/Step | Status |`
- **Rule**: Every feature branch MUST have a dedicated Ledger entry section or a separate `STATE_LEDGER_{BRANCH}.md` to prevent context leakage between features.

## 4. Tool Authority Matrix
| Role | Non-Destructive (Read/Grep) | Modification (Replace/Write) | Destructive (Shell/Git) |
| :--- | :--- | :--- | :--- |
| **teamleader** | Authorized | Authorized | Authorized (Full Control) |
| **git-master** | Authorized | Authorized | Git, Worktree, Shell (System) |
| **architect** | Authorized | Docs, ADRs, Contracts | NOT AUTHORIZED |
| **programmer** | Authorized | src/, tests/ | npm run (non-watch) |
| **tester** | Authorized | tests/ | npm test, npm build |
| **wapo** | Authorized | meta/docs/, agents/ (Rules Only) | NOT AUTHORIZED |

## 5. Workflow Protocols
- **Atomic Batch**: `programmer` and `tester` may loop up to 3 times to fix failing tests/linting before re-engaging the `teamleader`.
- **SPER Protocol**: Refer to `teamleader.md` for Strategic Pivot & Environment Reset instructions.
- **WAPO Audit**: Mandatory after SPER Terminal Escalation or feature branch completion. Must be performed BEFORE Archival.
- **Handover**: All agent transitions MUST use `meta/HANDOVER_TEMPLATE.md` in `./meta/handovers/`.
- **Branch Strategy**: 
  - Feature branches MUST be created from `dev`. 
  - If `dev` does not exist, it MUST be created from `main`.
  - Final integration of features occurs in `dev`.
  - A Pull Request (PR) MUST be created to merge `dev` into `main` after all features are integrated and verified.
- **Step 11: Archival**: After a feature is complete, audited, and the PR to `main` is created, the `teamleader` MUST move all artifacts (reports, plans, pivot reports) to `./meta/handovers/archive/<YYYY-MM-DD>_<feature_name>/`. The `teamleader` SHOULD use a wildcard move (e.g., `mv ./meta/handovers/*.md ./meta/handovers/archive/.../`) to ensure no reports are missed, explicitly excluding `STATE_LEDGER.md` from the move.
- **Cleanup**: Local feature branches and worktrees MUST be deleted ONLY after the PR to `main` is created.

## 6. Friction Index & Workflow Debt
- **TTR (Turn-to-Transition Ratio)**: Number of turns per handover. Target: TTR < 3.
- **HO (Handover Overhead)**: Size of handover file vs. size of output.
- **Workflow Debt Log**: `meta/docs/WORKFLOW_DEBT.md` tracks known process inefficiencies to be resolved asynchronously.
- **Section Locking**: WAPO is forbidden from modifying sections labeled `# Identity` or `# Persona` in agent files. Only `# Operational Rules` or `# Workflow` may be "Pivoted."
