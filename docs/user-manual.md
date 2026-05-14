# Benutzerhandbuch: Arbeiten mit dem CMS

Dieses Dokument beschreibt detailliert, wie ein Endnutzer (Redakteur oder Administrator) mit dem Website CMS interagiert, um Inhalte zu erstellen und zu verwalten.

## 1. Das Konzept der "Site" (Mandantenfähigkeit)

Das CMS ist so aufgebaut, dass es unter derselben Codebasis verschiedene Websites (Sites) verwalten kann. 
Sobald die Applikation aufgerufen wird, prüft sie die URL im Browser (z.B. `www.meine-seite.de` oder `localhost`). 
Anhand dieser URL entscheidet das System, welche Website-Daten und Navigationselemente geladen werden.

- **Keine Site gefunden:** Wenn unter der aufgerufenen URL noch keine Website in der Datenbank existiert, zeigt das System einen "No site found" (Keine Seite gefunden) Bildschirm an.
- **Site erstellen:** Angemeldete Nutzer haben an dieser Stelle die Möglichkeit, eine neue Website für die aufgerufene URL anzulegen.

## 2. Anmeldung und Berechtigungen

Oben rechts in der Navigationsleiste befindet sich das Login-Icon. 
- Nutzer können sich per **Google-Konto** oder mit **E-Mail & Passwort** anmelden.
- **Leserechte:** Gäste und nicht-berechtigte Nutzer sehen nur die veröffentlichten Seiten und die normale Navigation.
- **Schreibrechte:** Um Seiten bearbeiten oder die Seiteneinstellungen anpassen zu können, muss der eingeloggte Nutzer vom System als Administrator (`isAdmin`) markiert sein oder der Gruppe der jeweiligen Site angehören (`siteGroups`). Nur dann werden die Bearbeitungs-Icons (Stift, Plus, Zahnrad) sichtbar.

## 3. Die Benutzeroberfläche (Shell)

Wenn eine Site existiert und geladen wurde, besteht die Oberfläche aus zwei Hauptbereichen:

1. **Die Kopfzeile (Toolbar):**
   - Zeigt den Namen der aktuellen Website an.
   - Enthält die **Hauptnavigation** mit Links zu allen Seiten, die für die Navigation freigegeben sind.
   - Bietet (für berechtigte Nutzer) Buttons zum **Hinzufügen einer neuen Hauptseite** (Root Page) und zum **Bearbeiten der Website-Einstellungen** (Zahnrad-Icon).
   - Beinhaltet das **Benutzerprofil/Login-Menü**.

2. **Der Inhaltsbereich (Content Area):**
   - Hier wird der Inhalt der aktuell ausgewählten Seite (Page) gerendert.

## 4. Seitenverwaltung (Pages)

Seiten sind das Herzstück des CMS. Sie können hierarchisch angeordnet werden.

### 4.1 Seitenhierarchie (Root vs. Child Pages)
- **Hauptseiten (Root Pages):** Diese Seiten liegen auf der obersten Ebene. Sie werden meist über das "Plus-Icon" (Post Add) in der oberen Navigationsleiste erstellt. Diese Seiten tauchen (sofern beim Erstellen ausgewählt) in der Hauptnavigation auf.
- **Unterseiten (Child Pages):** Jede Seite kann beliebig viele Unterseiten haben. Wenn du dir eine bestehende Seite ansiehst, gibt es am Ende der Seite einen Button **"+ Add Child Page"**. Diese Unterseiten werden direkt unterhalb der Elternseite (ggf. eingerückt) gerendert, sofern das Layout dies so vorgibt.

### 4.2 Seiten bearbeiten
Wenn du dich auf einer Seite befindest und die nötigen Rechte hast, siehst du neben dem Seitentitel zwei Icons:
- **Stift-Icon (Edit):** Öffnet einen Dialog, um die Seite zu bearbeiten.
- **Mülleimer-Icon (Delete):** Löscht die Seite dauerhaft (Vorsicht: Hierbei gehen die Inhalte verloren).

Im **Bearbeitungs-Dialog** einer Seite (oder beim Erstellen) können folgende Dinge angepasst werden:
- **Name:** Der Titel der Seite.
- **Bild-URL:** Ein optionales Header-Bild für die Seite.
- **Inhalt (Content):** Der eigentliche Text der Seite.
- **In Navigation anzeigen:** Legt fest, ob eine Hauptseite oben im Menü verlinkt wird.
- **Layout Optionen:** Hier kann individuell für diese Seite die Ausrichtung (z.B. linksbündig, zentriert) und eine abweichende Schriftart (Font Family) definiert werden.

## 5. Website-Einstellungen (Site Settings)

Über das **Zahnrad-Icon** oben rechts in der Toolbar können die globalen Einstellungen der gesamten Website angepasst werden.

Hier kann man das generelle "Look & Feel" der Seite definieren, welches auf alle Unterseiten angewendet wird (sofern eine Unterseite dieses nicht durch eigene Layout-Optionen überschreibt).
- **Primary Color:** Die primäre Themenfarbe (beeinflusst Header und Buttons).
- **Accent Color:** Die Akzentfarbe.
- **Font Family:** Die globale Schriftart für die gesamte Website.
- **Font Alignment:** Die standardmäßige Textausrichtung.

## 6. Zusammenfassung des Redaktions-Workflows

1. **URL aufrufen** und einloggen.
2. Wenn die Seite noch leer ist: Über das **Zahnrad** globale Farben definieren.
3. Über das **Plus-Icon** oben eine "Startseite" und z.B. eine "Über uns"-Seite anlegen (Häkchen bei "Show in Navigation" nicht vergessen).
4. Auf die erstellte Seite navigieren und den **Stift** klicken, um Inhalte hinzuzufügen.
5. Bei Bedarf **Child Pages** am Ende einer Seite anlegen, um Inhalte strukturiert zu verschachteln.
