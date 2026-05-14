# Code-Qualität, Best Practices & Issues

Dieses Dokument listet auf, welche Best Practices im Projekt eingehalten werden und an welchen Stellen es Verbesserungspotenzial (Fehler/Anti-Patterns) gibt.

## Eingehaltene Best Practices

- **Moderne Angular-Architektur:** Das Projekt nutzt aktuelle Angular-Features wie Standalone Components und den neuen `inject()` Syntax anstelle von Constructor-Injection, was den Code kompakter und lesbarer macht.
- **Separation of Concerns:** Geschäftslogik und Firebase-Calls sind sauber in Services ausgelagert. Komponenten kümmern sich primär um die Darstellung.
- **Reactive Programming (RxJS):** Zentrale States (`currentSite$`, `userProfile$`) werden über `BehaviorSubjects` verwaltet. In den Templates wird die `async` Pipe verwendet, um Memory Leaks zu vermeiden.
- **Sichere lokale Entwicklung:** Die konsequente Nutzung von Firebase Emulatoren verhindert, dass bei der Entwicklung reale Daten modifiziert werden.

## Identifizierte Probleme & Verbesserungspotenzial

Während die Architektur grundlegend solide ist, gibt es in einigen Dateien deutliche "Anti-Patterns", die zu Bugs oder Performance-Problemen führen können.

### 1. Synchrones RxJS Anti-Pattern in `PageViewComponent`
In `src/app/components/page-view/page-view.component.ts` gibt es in der Methode `checkCanEdit()` folgenden Code:
```typescript
private checkCanEdit(): boolean {
    let isAllowed = false;
    this.auth.userProfile$.subscribe(user => {
        this.cms.currentSite$.subscribe(site => {
             if (user && site) {
                 isAllowed = user.role?.isAdmin || user.role?.siteGroups?.includes(site.id!) || false;
             } else {
                 isAllowed = false;
             }
        }).unsubscribe();
    }).unsubscribe();
    return isAllowed;
}
```
**Problem:** Hier wird versucht, einen asynchronen Wert (aus einem Observable) synchron zurückzugeben, indem kurz abonniert und sofort wieder gekündigt wird. Dies ist ein bekanntes Anti-Pattern in RxJS. Wenn die `BehaviorSubjects` noch keinen Wert emittiert haben oder der Wert erst im nächsten Tick verfügbar ist, schlägt dies fehl.
**Lösung:** Man sollte stattdessen `combineLatest` in einer eigenen Observable-Property definieren (so wie es bereits in der `ShellComponent` mit `canEditSite$` sauber gelöst wurde) und diese mit der `async` Pipe im Template nutzen.

### 2. Zugriff auf das Window-Objekt
In `src/app/components/shell/shell.component.ts` wird die aktuelle URL über `window.location.hostname` ausgelesen.
**Problem:** Der direkte Zugriff auf das globale `window` Objekt kann zu Problemen führen, wenn das Projekt später Server-Side-Rendering (Angular Universal / SSR) nutzt.
**Lösung:** Angular bietet hierfür den Injection-Token `@Inject(DOCUMENT) document: Document`. Damit kann mockbar und SSR-sicher auf `document.location.hostname` zugegriffen werden.

### 3. Fehlendes Error-Handling
In den Firebase Services (z.B. `page.service.ts` oder `auth.service.ts`) werden Promises zurückgegeben (z.B. `await getDoc(...)`), jedoch gibt es keine `try...catch` Blöcke.
**Problem:** Wenn die Datenbank nicht erreichbar ist (oder Berechtigungen in Firestore fehlen), crasht der Call unkontrolliert und die UI verbleibt möglicherweise in einem undefinierten Zustand.
**Lösung:** Globale Error-Handler oder spezifische `try/catch` Blöcke in den Services/Komponenten implementieren und dem User entsprechend Feedback geben (z.B. via Angular Material `SnackBar`).

### 4. Hardcoded Check für `127.0.0.1`
In `shell.component.ts` wird explizit geprüft: `if(this.currentHostUrl === '127.0.0.1') this.currentHostUrl = 'localhost';`.
Solche fixen Netzwerk-Mapppings sollten idealerweise über Konfigurationsdateien (Environments) gelöst werden.
