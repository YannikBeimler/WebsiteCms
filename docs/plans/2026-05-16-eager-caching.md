# Eager Caching System Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a centralized reactive store in `CmsService` to cache all pages of the current site, enabling instant navigation and reducing Firestore reads.

**Architecture:** Single Source of Truth in `CmsService` using `BehaviorSubject`. Components consume derived Observables. Local-first updates for CUD operations.

**Tech Stack:** Angular 17, RxJS, Angular Material (SnackBar).

---

### Task 1: Refactor CmsService to Central Store
**Files:**
- Modify: `src/app/services/cms.service.ts`

**Step 1: Add store subjects and observables**
Add `allPagesSubject` and `activePageIdSubject`.

**Step 2: Define derived observables**
Implement `navigationPages$`, `currentPage$`, and a helper for `childPages$(parentId)`.

**Step 3: Implement loadSiteByUrl and refreshAllPages**
Update `loadSiteByUrl` to call `refreshAllPages` which populates the store.

**Step 4: Commit**
```bash
git add src/app/services/cms.service.ts
git commit -m "feat(services): refactor CmsService to act as central store"
```

### Task 2: Implement Router Sync in CmsService
**Files:**
- Modify: `src/app/services/cms.service.ts`

**Step 1: Synchronize activePageId with Route params**
Subscribe to `Router.events` to extract `id` from the URL and update `activePageIdSubject`.

**Step 2: Commit**
```bash
git add src/app/services/cms.service.ts
git commit -m "feat(services): sync active page ID with router events"
```

### Task 3: Refactor UI Components to Reactive Streams
**Files:**
- Modify: `src/app/components/page-view/page-view.component.ts`
- Modify: `src/app/components/page-route/page-route.component.ts`

**Step 1: Update PageViewComponent**
Remove manual loading logic. Use `cms.currentPage$` and `cms.getChildPages(id)` observables with `async` pipe.
Fix `checkCanEdit` anti-pattern by using an observable.

**Step 2: Update PageRouteComponent**
Remove local `pageId` state; rely on `cms.activePageId$`.

**Step 3: Commit**
```bash
git add src/app/components/
git commit -m "refactor(ui): use reactive streams and fix RxJS anti-patterns"
```

### Task 4: Local-First Updates & Error Handling
**Files:**
- Modify: `src/app/services/cms.service.ts`
- Modify: `src/app/components/page-view/page-view.component.ts`

**Step 1: Implement Store mutation methods in CmsService**
Methods: `addPageToStore`, `updatePageInStore`, `removePageFromStore`.

**Step 2: Integrate MatSnackBar in PageViewComponent**
Add error feedback and rollback logic (calling `refreshAllPages`).

**Step 3: Commit**
```bash
git add src/app/services/ src/app/components/
git commit -m "feat(store): implement local-first updates and error notifications"
```
