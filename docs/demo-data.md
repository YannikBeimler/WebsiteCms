# Demo-Daten & Testumgebung

Um die Features des CMS vollständig auszuprobieren, existiert ein Seed-Skript (`npm run seed`), welches die lokalen Firebase Emulatoren mit einer kompletten Testumgebung füllt.

Dieses Skript demonstriert insbesondere die **Mandantenfähigkeit (Multi-Tenant)** des CMS sowie das **Rollen-basierte Rechtesystem**.

## 1. Demo Websites (Sites)

Das Skript erstellt zwei voneinander unabhängige Websites, die durch Aufruf der jeweiligen URL im Browser simuliert werden können:

### Site A: TechCorp Corporate
- **URL (zum Testen):** `http://localhost:4200`
- **Design:** Blau (`#004080`) / Orange (`#ff9900`), serifenlose Schriftart (`Roboto`).
- **Seiten & Features:**
  - **Startseite:** Demonstriert seitenspezifische Layout-Überschreibungen (zentrierter Text statt linksbündig).
  - **Produkte:** Zeigt das Verschachteln von Inhalten (Child Pages). Die Unterseiten "Software-Lösungen" und "Hardware-Systeme" werden direkt auf der Produkt-Seite untereinander gerendert (`showOnParent: true`).
  - **Internes Handbuch:** Eine "versteckte" Seite (`showInNavigation: false`), die nur über direkten Aufruf erreichbar ist, aber dennoch im CMS existiert.

### Site B: Creative Portfolio
- **URL (zum Testen):** `http://127.0.0.1:4200`
- **Design:** Dunkelgrau (`#212121`) / Pink (`#e91e63`), Serifenschrift (`Georgia`).
- **Seiten & Features:**
  - **Home:** Demonstriert die Einbindung von Header-Bildern (Image-URL).
  - **Gallery:** Eine einfache zweite Seite.

## 2. Demo Benutzer & Berechtigungen

Das CMS besitzt ein Rollensystem, welches globale Administratoren (`isAdmin: true`) und seiten-spezifische Redakteure (`siteGroups: [siteId]`) unterscheidet.

Die folgenden Benutzer werden automatisch mit dem Passwort **`password123`** erstellt:

| E-Mail Adresse | Rolle | Berechtigungen |
| :--- | :--- | :--- |
| `admin@demo.local` | **Global Admin** | Hat Vollzugriff auf **alle** Websites (`localhost` und `127.0.0.1`). Kann überall Seiten anlegen, bearbeiten und Website-Designs ändern. |
| `editor_tech@demo.local` | **Site Admin** | Hat nur Zugriff auf die TechCorp Site (`localhost`). Öffnet dieser Nutzer die Seite `127.0.0.1`, verhält er sich wie ein normaler Gast ohne Bearbeitungsrechte. |
| `editor_creative@demo.local` | **Site Admin** | Hat nur Zugriff auf das Creative Portfolio (`127.0.0.1`). Besitzt auf `localhost` keinerlei Bearbeitungsrechte. |

## 3. Demo-Daten wiederherstellen / neu laden

1. Stelle sicher, dass die Emulatoren laufen: `npm run emulators`
2. Führe das Seed-Skript aus: `npm run seed`
3. Die Konsolen-Ausgabe bestätigt das Anlegen der Sites, Benutzer und Seiten.

*(Hinweis: Da die Emulatoren standardmäßig keine Daten beim Beenden speichern, muss das Skript bei einem Neustart der Emulatoren erneut ausgeführt werden, es sei denn, man exportiert die Emulator-Daten.)*
