# Setup & Anleitung

Diese Anleitung beschreibt, wie das Projekt lokal ausgeführt und bedient wird.

## Voraussetzungen

- Node.js (gemäß Dev Container Spezifikation)
- Angular CLI
- Firebase Tools (CLI)
- Java (wird manchmal von den Firebase Emulatoren benötigt)

Dieses Projekt nutzt Dev Containers. Wenn du die Umgebung in VS Code (oder GitHub Codespaces) öffnest, sind alle Abhängigkeiten bereits vorinstalliert.

## Lokal Ausführen

Da die Applikation auf Firebase Services (Firestore, Auth, Storage) zugreift, müssen für die lokale Entwicklung **zuerst** die Emulatoren gestartet werden.

1. **Emulatoren starten:**
   Öffne ein Terminal und führe folgenden Befehl aus:
   ```bash
   npm run emulators
   ```
   *Die Emulatoren laufen auf verschiedenen Ports (z.B. Auth auf 9099, Firestore auf 8080). Dies ist in der `firebase.json` und `angular.json` konfiguriert.*

2. **Angular Applikation starten:**
   Öffne ein **zweites** Terminal und starte den Entwicklungsserver:
   ```bash
   npm run start
   ```

Die Applikation ist nun unter `http://localhost:4200` erreichbar.

## Nutzung der Applikation (CMS Workflow)

1. **Erster Aufruf:** Wenn du die App zum ersten Mal öffnest (auf `localhost`), existiert noch keine "Site" für diese URL in der Datenbank.
2. **Login:** Klicke auf "Login" und melde dich an (oder registriere dich über die Emulatoren).
3. **Site erstellen:** Nach dem Login bietet dir die Oberfläche an, eine neue "Site" für die aktuelle URL (z.B. `localhost`) zu erstellen.
4. **Seiten verwalten:** 
   - Über das `+` (Post Add) Icon im Header kannst du Root-Pages hinzufügen (Seiten auf der obersten Ebene).
   - In der `PageViewComponent` kannst du bestehende Seiten bearbeiten, löschen oder "Child Pages" (Unterseiten) hinzufügen.
5. **Design anpassen:** Über das Zahnrad-Symbol (`settings`) kannst du das generelle Layout und die Farben der aktuellen Website (Site) anpassen.
