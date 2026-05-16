# Database Restructuring Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate Firestore page storage to a hierarchical subcollection structure (`sites/{siteId}/pages`) and update all related services and models.

**Architecture:** Moving from a flat global collection to site-nested subcollections. Removes data redundancy (`siteId` field) and enables cascading security rules.

**Tech Stack:** Angular 17, Firebase Firestore, RxJS.

---

### Task 1: Update Page Model
**Files:**
- Modify: `src/app/models/page.model.ts`

**Step 1: Remove siteId property**
```typescript
export interface Page {
  id?: string;
  // siteId: string; // Remove this
  name: string;
  // ... rest of fields
}
```

**Step 2: Commit**
```bash
git add src/app/models/page.model.ts
git commit -m "refactor(models): remove siteId from Page model"
```

### Task 2: Update Seed Data Script
**Files:**
- Modify: `seed-demo-data.mjs`

**Step 1: Update path logic in seed script**
Update the script to write pages into the subcollection of the corresponding site.

**Step 2: Verify by running seed script**
Run: `node seed-demo-data.mjs`
Expected: Documents created in `sites/{siteId}/pages/`.

**Step 3: Commit**
```bash
git add seed-demo-data.mjs
git commit -m "chore: update seed script to use hierarchical paths"
```

### Task 3: Refactor PageService Paths
**Files:**
- Modify: `src/app/services/page.service.ts`

**Step 1: Update method signatures**
All methods fetching or modifying pages must now accept `siteId` to construct the correct Firestore path.

**Step 2: Update implementation**
Update `collection` and `doc` references to use the new path: `sites/${siteId}/pages`.

**Step 3: Commit**
```bash
git add src/app/services/page.service.ts
git commit -m "refactor(services): update PageService to use hierarchical paths"
```

### Task 4: Implement Recursive Site Deletion
**Files:**
- Modify: `src/app/services/site.service.ts`

**Step 1: Update deleteSite method**
Add logic to fetch all pages in the subcollection and delete them (preferably in a batch) before deleting the site document itself.

**Step 2: Commit**
```bash
git add src/app/services/site.service.ts
git commit -m "feat(services): add recursive deletion for sites and their pages"
```

### Task 5: Update UI Components
**Files:**
- Modify: `src/app/components/page-view/page-view.component.ts`
- Modify: `src/app/components/page-route/page-route.component.ts`
- Modify: `src/app/components/edit-dialogs/edit-page-dialog.component.ts`

**Step 1: Update calls to PageService**
Ensure `siteId` is passed correctly from the component context.

**Step 2: Commit**
```bash
git add src/app/components/
git commit -m "fix(ui): update component service calls for new data structure"
```
