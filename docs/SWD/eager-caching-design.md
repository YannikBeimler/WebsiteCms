# Software Design Document: Eager Caching System

**Status:** Draft for Review  
**Topic:** Performance Optimization & Cost Reduction for WebsiteCms  
**Date:** 2026-05-16

## 1. Objective
Optimize the application's data fetching strategy to:
- **Improve Performance (Primary):** Eliminate loading delays during navigation between pages within a site.
- **Reduce Costs (Secondary):** Minimize Firestore read operations by fetching data once per session and reusing it in memory.
- **Modernize RxJS Usage:** Resolve existing anti-patterns (synchronous subscriptions) and implement consistent error handling.

## 2. Current State Analysis
- Data is fetched via `async/await` Promises in `PageService` and `SiteService`.
- **Anti-Pattern:** `PageViewComponent` uses synchronous `.subscribe().unsubscribe()` blocks for authorization checks (`checkCanEdit`).
- **Missing Feedback:** Firebase operations lack structured error handling and user notification (e.g., SnackBar).

## 3. Proposed Architecture: Eager In-Memory Store

### 3.1 Central Data Orchestrator
The `CmsService` will be refactored to act as a central "Store" (Single Source of Truth) for the current session.

- **Primary State:** `allPagesSubject: BehaviorSubject<Page[]>`
- **Scope:** All pages belonging to the currently active site, fetched from the `sites/{siteId}/pages` subcollection.

### 3.2 Reactive Data Flow
Components will consume data through derived RxJS streams (Observables).

1.  **Navigation Stream:** `navigationPages$ = allPages$.pipe(map(pages => filterRoot(pages)))`
2.  **Current Page Stream:** `currentPage$ = combineLatest([allPages$, activeRouteId$]).pipe(map(([pages, id]) => findPage(pages, id)))`
3.  **Authorization Stream:** `canEdit$ = combineLatest([auth.userProfile$, cms.currentSite$]).pipe(map(([user, site]) => validateRole(user, site)))`
    - *Note: This replaces the synchronous `checkCanEdit()` method.*

### 3.3 Data Acquisition Strategy: "Full Site Fetch"
When a site is loaded by its URL:
1.  Fetch the `Site` document.
2.  Immediately fetch **all** documents from the subcollection `sites/{siteId}/pages`.
3.  Populate `allPagesSubject` with the result set.

## 4. Edit & Synchronization Logic

To maintain consistency without redundant server fetches, a "Local-First Update" strategy is used:

### 4.1 Create Operation
1.  Execute `PageService.createPage(siteId, newPage)`.
2.  On success, append the new page to `allPagesSubject`.
3.  On failure, show `MatSnackBar` with error message.

### 4.2 Update Operation
1.  Execute `PageService.updatePage(siteId, pageId, partialData)`.
2.  On success, merge changes in `allPagesSubject`.
3.  On failure, show `MatSnackBar` and trigger `refreshAllPages(siteId)`.

## 5. Error Handling & Consistency
- **Visual Feedback:** Use Angular Material `MatSnackBar` for all Firestore write failures.
- **Rollback:** A failure during a write operation triggers a mandatory `refreshAllPages(siteId)` call to resync the local store.
- **Initial Load Failure:** If the "Full Site Fetch" fails, the application enters an error state.

## 6. Trade-offs
- **Memory Usage:** Slightly higher RAM usage.
- **Initial Payload:** First load depends on the number of pages.
- **Data Freshness:** Users see their own changes immediately; concurrent changes require a reload.
