# REF-APP-1: Entwurf „Aufgaben“ (Referenz-App), Version 1, 2026-10-20

- Status: wartet auf Elias' Freigabe.
- Auftrag: `ProjectA_Neustart_FINAL.md` (20.10.2026).
- Ziel-ID: REF-APP-1, AgentsRoom-Backlog `f5276c87`.

## 1. Was die App kann (Mindestumfang)

1. **Projekte:** anlegen, umbenennen, archivieren.
2. **Aufgaben:** In einem Projekt kannst du Aufgaben anlegen und bearbeiten. Jede Aufgabe hat:
   - einen Titel (Pflicht);
   - eine Beschreibung;
   - einen Status;
   - optional ein Fälligkeitsdatum.
3. **Status und Filter:**
   - Jede Aufgabe hat einen der Status „Offen“, „In Arbeit“ oder „Erledigt“.
   - Ein Klick auf den Status schaltet ihn weiter.
   - Über die Filter „Alle · Offen · In Arbeit · Erledigt“ siehst du nur einen Status; die Filter zeigen die Anzahl.
4. **Speichern:**
   - Jede Änderung wird sofort gespeichert, lokal in einer Datei unter `%APPDATA%\Aufgaben\daten.json`.
   - Die Datei wird zuerst neu geschrieben und dann ausgetauscht. Ein Absturz kann sie deshalb nicht halb kaputt machen.
   - Die vorherige Fassung bleibt als `daten.bak.json` erhalten.
5. **Nach dem Neustart:** Wenn du die App ganz schließt und neu öffnest, ist alles wieder da, auch das zuletzt gewählte Projekt.
6. **Fehler werden verständlich gezeigt:**
   - Ein leerer Titel wird nicht gespeichert, und die App sagt dir warum.
   - Klappt das Speichern nicht, erscheint ein deutlicher Hinweis mit „Erneut versuchen“. Deine Eingaben bleiben dabei erhalten.
7. **Löschen:**
   - „Archivieren“ legt ein Projekt oder eine Aufgabe ins Archiv. Von dort kannst du es zurückholen.
   - Endgültig löschen kannst du nur im Archiv, und erst nach einer Rückfrage, die den Namen nennt.

**Nicht enthalten:** Konten, Cloud, Sync, Teilen, Erinnerungen, Tags, Unteraufgaben. Das sind neue Ideen und bleiben zurückgestellt.

## 2. Gestaltung

- Die App sieht ruhig aus und ist an Windows 11 angelehnt:
  - Schrift: Segoe UI;
  - Flächen: hell;
  - Akzentfarbe: ein Blau;
  - Status: kleine Punkte, immer mit Wort, nie nur Farbe.
- Aufbau:
  - links die Projektliste;
  - in der Mitte die Aufgaben;
  - zum Bearbeiten öffnet sich rechts ein Seitenfeld.
- Die App ist mit der Tastatur bedienbar, und die Kontraste erfüllen WCAG AA.
- Die Gestaltung ist bewusst getrennt vom ProjectA-Design (Meisterbüro). Änderungen an ProjectA und an der App bleiben getrennt.
- Bilder: im Ordner `entwurf/` (8 Ansichten: Hauptansicht, Filter, Projektwechsel, Bearbeiten, ungültige Eingabe, leerer Zustand, Speicherfehler, Archiv/Löschen).

## 3. Technik (Routine, entscheidet Root)

- **Grundlage:** Tauri 2 mit React und TypeScript, Speichern in Rust als JSON-Datei. Das ist dieselbe Werkzeugkette wie bei ProjectA, auf dem PC also schon vorhanden; es ist keine neue Installation nötig.
- **Lieferung:** ein Windows-Installer (NSIS) und eine startbare `.exe`.
- **Repo:** ein eigenes, getrenntes Repo `Cuarroc/aufgaben-app`, öffentlich, damit ChatGPT die Belege lesen kann. Es gibt kein öffentliches ProjectA-Release.

## 4. Der Weg über ProjectA (das eigentliche Experiment)

1. Root legt das Repo an und trägt es in der **ProjectA-Dev-App (78f6df5e)** als Projekt ein.
2. Jeder Bauauftrag geht als Aufgabe in die ProjectA-Warteschlange, und ein ProjectA-Worker (Codex-Profil) führt ihn aus.
3. Fragen der Worker beantwortet Root in ProjectA. Jede Frage und jede Antwort wird protokolliert.
4. Was **ProjectA** wirklich getan hat und was **außerhalb** lief (AgentsRoom, Root, Codex-CLI direkt), wird für jeden Schritt getrennt festgehalten. Was außerhalb lief, gilt nicht als ProjectA-Erfolg.
5. Bekanntes Risiko: Früher sind Worker in ProjectA leer gestartet oder hängen geblieben. Klemmt es, repariert Root die nötige Stelle in ProjectA, als normales Paket mit Prüfung.

**Erster Schritt** (Phase 3, direkt nach deiner Freigabe):

- Ein ProjectA-Auftrag baut die kleinste App: 1 Projekt mit 1 Aufgabe, gespeichert und nach dem Neustart wieder da.
- Daraus entsteht ein startbarer Windows-Build.
- Dieser Teil wird später ein Stück der fertigen App.

## 5. Abnahmekriterien (Vertrag v1; wer baut, darf ihn nicht abschwächen)

| ID | Kriterium | Prüfung |
|---|---|---|
| A1 | Installer bzw. `.exe` startet unter Windows 11 ohne Fehlermeldung | Start auf dem PC, Bildschirmfoto |
| A2 | 2 Projekte und mindestens 5 Aufgaben anlegen | UI-Schritte, Bildschirmfoto |
| A3 | Aufgabe bearbeiten (Titel, Beschreibung, Datum) | UI-Schritte |
| A4 | Status ändern und alle 4 Filter zeigen genau die passenden Aufgaben mit richtiger Anzahl | UI-Schritte und automatischer Test |
| A5 | App vollständig beenden (Prozess weg), neu starten: Daten gleich, verglichen mit dem Dateiinhalt vorher und nachher | Prozessliste, Datei-Hash bzw. Diff |
| A6 | Leerer Titel wird abgelehnt, Hinweis sichtbar, andere Felder bleiben | UI und automatischer Test |
| A7 | Speicherfehler (Datei schreibgeschützt, nur Testdaten): Hinweis, Eingaben bleiben, „Erneut versuchen“ klappt nach dem Aufheben des Schreibschutzes | UI-Schritte, Bildschirmfoto |
| A8 | Archivieren und Wiederherstellen; endgültig löschen nur mit Rückfrage; danach auch nach Neustart weg | UI-Schritte |
| A9 | Tastatur: alle Hauptaktionen ohne Maus erreichbar, Fokus sichtbar | UI-Schritte |
| A10 | Kontrast WCAG AA (axe-core) ohne Fehler | axe-Lauf |
| A11 | Automatische Tests (Speicher-Logik, Filter, Validierung) grün im Repo-CI | CI-Lauf mit Commit |
| A12 | Weg über ProjectA belegt: Aufträge, Worker, Rückfragen, Antworten, Ergebnis-Commits; getrennt davon, was außerhalb lief | ProjectA-Protokoll, Commits |

Geprüft wird nur mit eigenen Testdaten, nie mit echten Daten. Jeder Beleg nennt Prüfer, Commit bzw. Build und Zeit.

## 6. Prüfung

- **Code:** Prüfer aus einer anderen Familie als der Autor, nach Regel 5 und deiner Entscheidung E1.
- **Abnahme:** getrennte Urteile in `PROJECTA_ABNAHME.md`, jeweils von Root, den unabhängigen Prüfern, ChatGPT und dir.

## 7. Was du mit „Ja“ freigibst

1. Umfang, Gestaltung und Abnahmekriterien wie oben.
2. Löschen über das Archiv, endgültiges Löschen nur von dort und mit Rückfrage.
3. Ein neues öffentliches GitHub-Repo `Cuarroc/aufgaben-app` (kostenlos).
4. Root startet dafür die ProjectA-Dev-App mit echten Workern. Das kostet Abo-Kontingent, vor allem bei Codex.
