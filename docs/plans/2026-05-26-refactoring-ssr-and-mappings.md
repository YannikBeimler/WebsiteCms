# Refactoring: SSR Safety and Host Mapping Infrastructure Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve SSR compatibility by removing direct `window` access and move host mapping logic to environment configuration.

**Architecture:** 
- Inject Angular's `DOCUMENT` token in `ShellComponent` to access `location.hostname` safely.
- Add a `hostMappings` property to the `environment` object to allow optional URL aliasing.
- Update `ShellComponent` to apply these mappings before loading the site.

**Tech Stack:** Angular 17, RxJS

---

### Task 1: Update Environment Configuration

**Files:**
- Modify: `src/environments/environment.ts`
- Modify: `src/environments/environment.development.ts`

**Step 1: Add hostMappings to production environment**
Add `hostMappings: {} as Record<string, string>` to the `environment` object.

**Step 2: Add hostMappings to development environment**
Add `hostMappings: {} as Record<string, string>` to the `environment` object. (Keeping it empty as per user preference to keep localhost and 127.0.0.1 separate).

**Step 3: Commit**
```bash
git add src/environments/environment.ts src/environments/environment.development.ts
git commit -m "chore: add hostMappings infrastructure to environment config"
```

### Task 2: Implement SSR Safety in ShellComponent

**Files:**
- Modify: `src/app/components/shell/shell.component.ts`

**Step 1: Inject DOCUMENT token**
Import `DOCUMENT` and `Inject` (if needed, or use `inject()`), then use `inject(DOCUMENT)` to get a reference to the document.

**Step 2: Use document.location.hostname**
Replace `window.location.hostname` with `this.document.location.hostname`.

**Step 3: Apply hostMappings**
Check if the current hostname exists in `environment.hostMappings` and use the mapped value if it does.

**Step 4: Verify changes**
Check that the application still loads correctly (manually or via tests if available).

**Step 5: Commit**
```bash
git add src/app/components/shell/shell.component.ts
git commit -m "refactor: use DOCUMENT token for SSR safety and apply host mappings"
```

### Task 3: Cleanup Documentation

**Files:**
- Modify: `docs/tasks.md`

**Step 1: Mark tasks as completed**
Check off the SSR Safety and Hardcoded Mappings tasks.

**Step 2: Commit**
```bash
git add docs/tasks.md
git commit -m "docs: mark refactoring tasks as complete"
```
