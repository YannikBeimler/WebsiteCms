# Software Design Document: Database Restructuring (Subcollections)

**Status:** Draft for Review  
**Topic:** Migration to Hierarchical Firestore Structure  
**Date:** 2026-05-16

## 1. Objective
Refactor the Firestore data model from a flat collection to a hierarchical subcollection structure to:
- **Simplify Security Rules:** Enable cascading permissions based on the parent site.
- **Improve Data Isolation:** Ensure pages are logically and physically bound to their respective sites.
- **Enhance Maintainability:** Align the database structure with the application's domain model.

## 2. Current vs. Proposed Structure

### 2.1 Current (Flat)
- `/sites/{siteId}`
- `/pages/{pageId}` (filtered by `siteId` field)
  - `Page` model contains `siteId` property.

### 2.2 Proposed (Hierarchical)
- `/sites/{siteId}`
- `/sites/{siteId}/pages/{pageId}`
  - `Page` model drops the redundant `siteId` property. The context is derived from the URL/Service state.

## 3. Critical Evaluation

### 3.1 Pros
- **Security Rules:** Permissions can be granted at the site level and inherited by the `pages` subcollection.
- **Query Simplicity:** No need to pass `where('siteId', '==', siteId)` in every page query; the path itself defines the scope.
- **DRY Data Model:** Removing `siteId` from the page document reduces redundancy.

### 3.2 Cons
- **Collection Group Queries:** Global search across all sites would require Collection Group Indexes (Not required for current scope).
- **Deletion Complexity:** Firestore does not auto-delete subcollections when a parent document is deleted.

## 4. Implementation Plan

Since there is no production data yet, a complex data migration is unnecessary.

### 4.1 Seed Script Update
- Update `seed-demo-data.mjs` to write pages to `sites/{siteId}/pages` instead of the root `/pages` collection.

### 4.2 Data Model & Service Updates
- **Models:** Remove `siteId` from `Page` interface (`src/app/models/page.model.ts`).
- **PageService:** Update all Firestore paths from `collection(this.firestore, 'pages')` to `collection(this.firestore, 'sites', siteId, 'pages')`. Methods will need `siteId` passed as an argument where context is required.

### 4.3 Recursive Deletion (SiteService)
- Update `SiteService.deleteSite(id)`.
- Before deleting the site document, fetch and delete all documents within `/sites/{id}/pages`.
- Execute via Firestore Batch to ensure atomic operation.

## 5. Security Rules Impact
```javascript
// New Rules Pattern
match /sites/{siteId} {
  // Site access rules...
  
  match /pages/{pageId} {
    // Inherits site-level context for authorization
    allow read, write: if isUserInSiteGroup(siteId);
  }
}
```
