# Website CMS - Dokumentation

Willkommen in der Dokumentation für das Website CMS Projekt. 
Dieses Dokumenten-Verzeichnis bietet einen detaillierten Einblick in die Architektur, Einrichtung und Best Practices der Applikation.

## Inhaltsverzeichnis

1. [Architektur & Projektstruktur](./architecture.md) - Details zu den Modellen, Services und Komponenten.
2. [Setup & Anleitung](./setup.md) - Wie man das Projekt lokal ausführt und nutzt.
3. [Benutzerhandbuch](./user-manual.md) - Detaillierte Erklärung der CMS-Funktionen für Endnutzer.
4. [Demo-Daten & Testumgebung](./demo-data.md) - Übersicht über das vollständige Demo-Setup (Sites & Nutzer).
5. [Code-Qualität & Best Practices](./best-practices-and-issues.md) - Eingehaltene Standards und identifizierte Verbesserungsmöglichkeiten.

## Kurzübersicht

Das Website CMS ist eine Angular 17 Applikation (Standalone Components) mit Firebase Backend (Firestore, Auth, Storage).
Das Kern-Konzept ist ein "Multi-Tenant" System: Das CMS entscheidet basierend auf der aktuellen URL (`window.location.hostname`), welche `Site` und welche `Pages` (Seiten) geladen werden sollen.

Jede Seite (Page) kann ein eigenes Design (Layout-Optionen) haben und rekursiv Unterseiten (Child Pages) einbinden.
Benutzer können sich über Google oder E-Mail/Passwort einloggen und haben rollenbasierte Rechte (z.B. `isAdmin` oder Gruppenzugehörigkeiten).
