# Projektstruktur & Architektur

Die Applikation befindet sich im `src/app` Ordner und ist logisch nach Angular Best-Practices aufgeteilt.

## Verzeichnisstruktur (`src/app`)

- `components/`: UI-Komponenten (Standalone).
  - `shell/`: Die Hauptkomponente (App-Shell), die das Routing, die Navigation und das Grundlayout (Header, Main Area) verwaltet. Löst basierend auf der Host-URL die aktuelle Seite (Site) auf.
  - `page-view/`: Rendert den Inhalt einer spezifischen CMS-Seite. Nutzt Rekursion (`<app-page-view [nested]="true">`), um Unterseiten darzustellen.
  - `page-route/`: Die Route-Komponente, die als Einstiegspunkt für die dynamische Routen (`/page/:id`) dient und den `page-view` einbindet.
  - `login/`: Anmeldemaske (Google & E-Mail).
  - `edit-dialogs/`: Angular Material Dialoge für das Erstellen und Bearbeiten von Sites und Pages.
- `services/`: Geschäftslogik und Firebase-Interaktion.
  - `auth.service.ts`: Handhabt Firebase Authentication und lädt das erweiterte Benutzerprofil (inklusive Rollen) aus Firestore.
  - `cms.service.ts`: Der zentrale State-Manager für die aktuell aktive Website (`currentSite$`) und deren Navigation (`navigationPages$`).
  - `site.service.ts` & `page.service.ts`: CRUD-Operationen für die `Site` und `Page` Collections in Firestore.
- `models/`: TypeScript Interfaces für das Datenschema (Site, Page, User, LayoutOptions).
- `pipes/`: Angular Pipes (z.B. `format-content.pipe.ts` zum Formatieren des Seiteninhalts).
- `guards/`: Angular Route Guards (z.B. `auth.guard.ts` für geschützte Bereiche, falls nötig).

## Architektur-Konzepte

- **Standalone Components:** Das Projekt verzichtet auf NgModules (`app.module.ts`) und verwendet das moderne Standalone-Paradigma von Angular 14+.
- **Reaktives Paradigma:** State-Management wird hauptsächlich über RxJS (`BehaviorSubject`, `Observable`) in den Services gehandhabt. Komponenten abonnieren diese via `async` Pipe im Template.
- **Firebase Emulatoren:** Das Projekt ist für die lokale Entwicklung auf Firebase Emulatoren ausgelegt, um nicht versehentlich Produktionsdaten zu manipulieren.
