# Design Documents Index

This directory contains the Software Design Documents (SWDs) for the WebsiteCms project.

## Active Design Documents

1.  **[Eager Caching System](./eager-caching-design.md)**
    *   **Focus:** Frontend performance and cost reduction via in-memory data management.
2.  **[Database Restructuring (Subcollections)](./database-restructuring.md)**
    *   **Focus:** Migrating pages to `sites/{siteId}/pages` for better security and isolation.

## Dependencies & Roadmap

### Recommended Sequence
**1. Database Restructuring -> 2. Eager Caching System**

### Rationale
- **Structural Foundation:** The Database Restructuring changes the API paths and data access patterns in the services. 
- **Efficiency:** Implementing the Eager Caching System *after* the restructuring avoids double work, as the service methods will already be using the new hierarchical paths.
- **Security:** The restructuring enables cleaner Firebase Security Rules, which should be verified before optimizing performance.

### Interdependencies
- The Caching System's "Full Site Fetch" logic will directly benefit from the subcollection structure, as a simple `getDocs(collection(firestore, 'sites', siteId, 'pages'))` becomes the standard entry point.
- Both designs share the goal of making the application more robust and scalable.
