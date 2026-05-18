# Handover / Project Status

**Date:** 2026-05-16
**Branch:** `dev`

## Was wurde heute erreicht?

Wir haben zwei große Architektur-Epics zur Performance- und Strukturverbesserung erfolgreich abgeschlossen.

### 1. Database Restructuring (Priority 1)
- **Status:** ✅ Abgeschlossen
- **Was:** Pages wurden aus der flachen globalen Collection in hierarchische Subcollections (`sites/{siteId}/pages`) migriert.
- **Warum:** Ermöglicht kaskadierende Firebase Security Rules und trennt die Daten verschiedener Tenants sauber voneinander.
- **Details:** Das `siteId` Feld im `Page` Modell ist entfallen. Das Seed-Script (`seed-demo-data.mjs`) wurde angepasst. Beim Löschen einer Site werden nun per Batch alle Pages der Subcollection rekursiv mitgelöscht.

### 2. Eager Caching System (Priority 2)
- **Status:** ✅ Abgeschlossen
- **Was:** Der `CmsService` wurde zu einem zentralen "Single Source of Truth" Store refactored.
- **Warum:** Eliminiert Ladezeiten bei der Navigation und reduziert Firestore-Read-Kosten drastisch, da alle Pages einer Site nur noch einmalig geladen werden ("Full Site Fetch").
- **Details:**
  - `CmsService` hält `allPages$` und `activePageId$` (synchronisiert via Angular Router).
  - Alle Komponenten (`PageViewComponent`, `ShellComponent`) nutzen reaktive RxJS Streams anstatt manueller `async/await` Loads.
  - Das veraltete synchrone RxJS Anti-Pattern (Subscription innerhalb Subscription) für den Auth-Check wurde behoben.
  - Änderungen (Create/Update/Delete) nutzen eine **Local-First Strategie** (`addPageToStore`, etc.) mit `MatSnackBar` Error-Handling und Rollback.

## Wo stehen wir in der `tasks.md`?

Die beiden großen Epics sind durch. Offen bleiben nur noch zwei kleinere "Technical Debt" Tasks:
1.  **SSR Safety:** Ersetzen des direkten `window`-Zugriffs in der `ShellComponent` durch das `@Inject(DOCUMENT)` Token.
2.  **Hardcoded Mappings:** Auslagern des `127.0.0.1 -> localhost` Host-Mappings in eine saubere Environment-Konfiguration.

## Nächste Schritte für Morgen

1.  Mache einen kurzen Walkthrough durch die App (z.B. durch Starten des Emulators und `npm start`), um das neue Caching-Gefühl zu testen.
2.  Gehe die verbleibenden zwei Tasks aus `docs/tasks.md` an.
3.  Im Anschluss können wir über neue Features oder die Anpassung der Firebase Security Rules (basierend auf der neuen Struktur) nachdenken.
