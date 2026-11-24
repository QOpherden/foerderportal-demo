# Förderportal (GS01)

Eine kleine Webseite für Lehrkräfte. Sie zeigt den Lernstand der Kinder für den ganzen Jahrgang oder je Klasse. Dazu findet man schnell passendes Fördermaterial.

Das Portal ist in **Stufen** gegliedert: Vorläuferfähigkeiten (Lernausgangslage zu Beginn von Klasse 1) sowie Klasse 1 bis 4. **Jede Stufe hat ihr eigenes Fördermaterial.** Wer oben eine Stufe wählt, sieht in Materialliste, Maßnahmen und Quellenangabe nur das Material aus dem Ordner dieser Stufe.

Die Bereiche sind nach **Fächern** gruppiert, jedes mit eigener Akzentfarbe: Mathe, Deutsch und Emotional-soziale Entwicklung.

Die Seite zeigt nur zusammengefasste Zahlen, keine Kinder-Codes und keine Lehrkraftnamen. Diese Angaben werden schon beim Erzeugen der Daten weggelassen.

## Ablage je Stufe

Jede Stufe hat einen Ordner mit festem Namen. Den gibt es zweimal: einmal für das Material, einmal für die Schuldaten.

| Stufe | Kürzel | Fördermaterial | Schuldatenblätter |
|---|---|---|---|
| Vorläuferfähigkeiten | VL | `Foerdermaterial/00_Vorlaeufer/` | `../Schuldatenblaetter/00_Vorlaeufer/` |
| Klasse 1 | K1 | `Foerdermaterial/01_Klasse1/` | `../Schuldatenblaetter/01_Klasse1/` |
| Klasse 2 | K2 | `Foerdermaterial/02_Klasse2/` | `../Schuldatenblaetter/02_Klasse2/` |
| Klasse 3 | K3 | `Foerdermaterial/03_Klasse3/` + `Foerdermaterial/34_Klasse3und4/` | `../Schuldatenblaetter/03_Klasse3/` |
| Klasse 4 | K4 | `Foerdermaterial/04_Klasse4/` + `Foerdermaterial/34_Klasse3und4/` | `../Schuldatenblaetter/04_Klasse4/` |

**Gemeinsamer Ordner:** Material, das für mehrere Stufen gilt, liegt nur einmal in einem eigenen Ordner, derzeit `34_Klasse3und4`. Die Stufen nutzen ihn über die Angabe `material` in `konfiguration.py`. Ihre eigenen Ordner enthalten nur einen Verweis (`LIESMICH.md`) und Platz für Material, das nur für diese Klasse gilt. Die Katalogspalte **`stufen`** (z. B. `K3`) beschränkt einen Eintrag des gemeinsamen Ordners auf einzelne Stufen. Kürzel und IDs müssen über alle Ordner einer Stufe eindeutig sein; `build_data.py` prüft das.

**Fördermaterial** (`Foerdermaterial/<Stufe>/`):

| Datei | Inhalt |
|---|---|
| `foerderkatalog.csv` | alle Förderangebote dieser Stufe (IDs F001 … gelten nur innerhalb der Stufe) |
| `quellen.csv` | die Quellen dieser Stufe: Kürzel, Titel, PDF-Datei, ggf. gedruckter Seitenbereich |
| `feldueberschriften.csv` | Überschriften der Faltflyer-Felder (nur nötig bei Flyern) |
| `Quellen/` | die PDFs |
| `QUELLEN.md` | Übersicht: was steht wo in den Quellen, Zitierweise, Bereiche |

**Schuldatenblätter** (`../Schuldatenblaetter/<Stufe>/`, außerhalb dieses Ordners): das Original-Datenblatt der Schule (z. B. `GS01_anon.xlsx`) und die daraus aufbereitete CSV-Datei für das Portal (z. B. `gs01_schueler.csv`). Sie liegen absichtlich nicht im Portal-Ordner. So lässt sich der Ordner `Foerderportal` weitergeben, ohne dass Datenblätter mit Kinder-Codes mitgehen.

Stand:
- **Vorläuferfähigkeiten:** Material (Q1–Q5, 175 Einträge) und Daten liegen vor.
- **Klasse 3 und 4:** Material liegt vor (Q1–Q10 im Ordner `34_Klasse3und4`, Klasse 3 sieht 80 Einträge, Klasse 4 sieht 74). Die Bereiche und kuratierten Maßnahmen sind angelegt.
  - Klasse 3 hat noch keine Schuldaten und erscheint in der **Materialansicht**.
  - **Klasse 4 läuft mit fiktiven Testdaten** (im Portal als „Alle Werte: Beispieldaten (fiktiv)“ gekennzeichnet, `"beispieldaten"` bei `K4`) (Schule „TEST (fiktiv)“, 47 Kinder in 4a/4b, 12 Bereiche). Was die Bereiche bedeuten und wie man die Testdaten wieder entfernt, steht in `Schuldatenblaetter/04_Klasse4/LIESMICH.md`.
- **Klasse 1 und 2:** noch nichts.

**Materialansicht:** Eine Stufe mit Fördermaterial, aber ohne Schuldaten lässt sich auswählen. Ihr Knopf trägt das Etikett „Material“. Die Seite zeigt dann einen Hinweis, alle Bereiche ohne Zahlen zum Anklicken (mit Vorschlägen oben in der Materialliste) und im Maßnahmen-Kasten je Fach die Bereiche. Kennzahlen, Klassenvergleich, Förderbedarf und Förderprofile erscheinen erst mit den Schuldaten. Stufen ganz ohne Material und Daten bleiben ausgegraut („noch keine Daten“).

## Öffnen

Doppelklick auf `index.html`. Das funktioniert in Chrome, Edge und Firefox, ohne Internet und ohne Server. Die Fundstellen-Links öffnen das jeweilige PDF aus `Foerdermaterial/<Stufe>/Quellen/` in einem neuen Tab auf der richtigen Seite.

## Bedienung

- **Stufe** oben wählen, z. B. Vorläuferfähigkeiten oder Klasse 3. Stufen mit dem Etikett „Material“ haben noch keine Schuldaten und zeigen nur das Fördermaterial. Stufen ohne Daten und ohne Material lassen sich nicht anklicken.
- **Auswahl** darunter: Jahrgang oder eine Klasse.
- **Maßnahmen-Kasten**: immer genau ein Vorschlag je Fach. Je Fach wird der Bereich mit den meisten Kindern ohne gesicherten Bereich gewählt. Die Vorschläge sind danach sortiert (Platz 1 = meiste Kinder). Weitere Bereiche stehen darunter als Link.
- **Förderempfehlungen als PDF**: Knopf oben im Maßnahmen-Kasten (erscheint, sobald Schuldaten vorliegen). Er erzeugt für die gewählte Auswahl (Klasse oder Jahrgang) eine A4-Seite mit den drei Empfehlungen, je Fach eine: Bereich, Zahl der Kinder, die hinterlegten Maßnahmen und zu jeder das Material mit Kurzbeschreibung, Einsatzort und Fundstelle. Dazu ein Kurzüberblick der Klasse und die Quellen. Es öffnet sich der Druckdialog des Browsers: als Drucker **„Als PDF speichern“** (Edge: „Microsoft Print to PDF“ oder „Als PDF speichern“) wählen. Der Dateiname ist vorbelegt, z. B. „Förderempfehlungen LK4 – Vorläuferfähigkeiten – 2026-11-12“. Das PDF enthält nur zusammengefasste Zahlen. Fächer mit Beispieldaten sind auch im PDF gekennzeichnet.
- **Klick auf einen Bereich** öffnet die Materialliste zu diesem Bereich. Das geht über einen Balken in „Wie sicher …“, einen Spaltenkopf im Klassenvergleich oder den Knopf im Maßnahmen-Kasten.
- **Klick auf ein Förderprofil** öffnet die Materialien für alle Bereiche dieses Profils. Einträge, die mehrere Bereiche abdecken, stehen oben.
- Die Materialliste schließt mit **×** oder **Esc**. Alles ist auch per Tastatur bedienbar (Tab, Enter).
- Eine Stufe lässt sich direkt verlinken: `index.html#K2` öffnet Klasse 2.

### Fächer, die noch nicht erhoben werden

Kommen Bereiche eines Fachs im Förderkatalog einer Stufe vor, werden dort aber noch nicht erhoben, zeigt die Seite das Fach als **Vorschau** („noch nicht erhoben“). Die Bereiche stehen grau schraffiert ohne Zahlen da, lassen sich aber anklicken. Oben in der Materialliste stehen dann die kuratierten Vorschläge des Bereichs. So ist es derzeit bei **Emotional-soziale Entwicklung** in Klasse 3. Ein Fach ganz ohne Material in der Stufe erscheint als Platzhalter („Bereich folgt“).

## Daten aktualisieren

1. Neue Datei in den Ordner der Stufe unter `Schuldatenblaetter/` legen und die alte ersetzen. Der Dateiname bleibt gleich (er steht in `konfiguration.py` bei der Stufe unter `datei`).
2. Im Ordner dieser README ausführen:

   ```
   python build_data.py
   ```

   Das Skript prüft Daten, Material und Konfiguration, zeigt je Stufe Material und Kennzahlen an und schreibt `data.js` neu.
3. Die Seite im Browser neu laden (F5).

Alle CSV-Dateien: Semikolon als Trennzeichen, Kodierung UTF-8.

## Erweitern

Stufen, Fächer, Bereiche und Maßnahmen stehen in **`konfiguration.py`**. Material und Quellen stehen im Ordner der Stufe. Nach jeder Änderung `python build_data.py` ausführen.

### Klasse 3 oder 4 freischalten

Material, Bereiche (`K34-M-ZAHL`, `K34-M-OP`, `K34-M-RAUM`, `K34-M-GROE`, `K34-D-SPRECH`, `K34-D-LESEN`, `K34-D-SCHREIB`, `K34-D-RECHT` sowie die ES-Bereiche) und Maßnahmen sind angelegt. Es fehlen nur die Daten:

1. In `konfiguration.py` bei `K3` bzw. `K4` unter `bereiche` die erhobenen Bereiche mit Spaltennamen eintragen, z. B. `{"id": "K34-M-ZAHL", "spalte": "mathe_zahlverstaendnis"}`.
2. Die Datei nach `Schuldatenblaetter/03_Klasse3/klasse3_schueler.csv` bzw. `04_Klasse4/klasse4_schueler.csv` legen.
3. `python build_data.py` ausführen.

Werden nur einzelne Bereiche erhoben, zeigt die Seite nur diese. Ein Fach ganz ohne Erhebung erscheint als Vorschau mit seinen Materialien.

### Eine weitere Stufe aktivieren (z. B. Klasse 2)

1. **Material** nach `Foerdermaterial/02_Klasse2/` legen: PDFs in `Quellen/`, dazu `quellen.csv` und `foerderkatalog.csv` (Aufbau wie bei `00_Vorlaeufer`; Anleitung in `LIESMICH.md` dort).
2. **Bereiche** in `konfiguration.py` bei der Stufe `K2` unter `bereiche` eintragen, je Bereich mit Spaltenname in der Datendatei, z. B. `{"id": "M-ARI", "spalte": "mathe_arithmetik"}`. Neue Bereiche vorher unter `BEREICHE` anlegen.
3. **Daten** nach `Schuldatenblaetter/02_Klasse2/klasse2_schueler.csv` legen.
   - Pflichtspalten: `schule`, `klasse` und je Bereich die angegebene Spalte. Werte: 1 = gesichert, 0 = nicht gesichert.
   - `schulbesuchsjahr` ist nur nötig, wenn bei der Stufe `"schulbesuchsjahr": True` steht.
   - Weitere Spalten (z. B. Kinder-Codes) werden ignoriert und nicht übernommen.
4. Optional: kuratierte `massnahmen` (IDs aus dem Katalog dieser Stufe) und eine Reihenfolge bei Gleichstand (`gleichstand`) eintragen.

### Neue Quelle zu einer Stufe hinzufügen

1. PDF in `Foerdermaterial/<Stufe>/Quellen/` legen.
2. In `quellen.csv` der Stufe eine Zeile ergänzen: `kuerzel;titel;datei;von;bis`. `von`/`bis` bleiben leer, wenn PDF-Seite = gedruckte Seite. Liegt eine Quelle nur in Auszügen vor (wie Q3 und Q5 bei den Vorläufern), steht je Auszug eine Zeile mit gleichem Kürzel und dem gedruckten Seitenbereich. Im Katalog steht dann immer die gedruckte Seitenzahl, der Link springt trotzdem auf die richtige PDF-Seite.
3. Einträge im `foerderkatalog.csv` der Stufe mit diesem Kürzel in `quelle_id` anlegen.

Die Kürzel (Q1, Q2 …) gelten nur innerhalb einer Stufe. Klasse 1 darf also wieder mit Q1 beginnen.

### Emotional-soziale Entwicklung bei den Vorläufern (derzeit Beispieldaten)

Seit 12.11.2026 zeigt das Portal bei den Vorläufern auch Zahlen für die vier ES-Bereiche. **Diese Werte sind ausgedacht** (Blatt „ES Beispieldaten“ in `GS01_anon.xlsx`, Spalten `es_gefuehle`, `es_regulation`, `es_kooperation`, `es_konflikte` in `gs01_schueler.csv`). Die Seite kennzeichnet das Fach deshalb überall mit **„Beispieldaten (fiktiv)“**, oben rechts und in der Hauptkachel. Gesamtkennzahlen wie „alle Bereiche gesichert“ und „Kinder mit Förderbedarf“ enthalten die ES-Werte mit (49 % statt 59 % ohne ES).

Gesteuert wird die Kennzeichnung in `konfiguration.py` bei der Stufe über `"beispieldaten": ["ES"]`.

- **Echte ES-Daten übernehmen:** die vier Spalten in `gs01_schueler.csv` mit den echten Werten füllen, `"beispieldaten"` bei der Stufe `VL` löschen, `python build_data.py`.
- **Beispieldaten wieder entfernen:** `Schuldatenblaetter/00_Vorlaeufer/gs01_schueler_vor_ES-Beispieldaten.csv` zurück nach `gs01_schueler.csv` kopieren, in `konfiguration.py` bei `VL` die vier `ES-…`-Zeilen unter `bereiche`, die ES-IDs in `gleichstand` und `"beispieldaten"` löschen, `python build_data.py`. ES erscheint dann wieder als Vorschau.

### Neues Fach

Unter `FAECHER` anlegen (Name, Kurzname, Akzentfarbe) und bei den Stufen unter `faecher` eintragen. Im Maßnahmen-Kasten erscheint dann automatisch ein weiterer Vorschlag. Die Seite passt sich der Zahl der Bereiche automatisch an.

## Dateien in diesem Ordner

| Datei | Inhalt |
|---|---|
| `index.html` | Seitengerüst |
| `style.css` | Gestaltung |
| `app.js` | Berechnungen und Bedienung |
| `konfiguration.py` | Ordner, Stufen, Fächer, Bereiche, Maßnahmen, Beschriftungen |
| `build_data.py` | erzeugt `data.js` aus Konfiguration, Material- und Datenordnern (nur Python-Standardbibliothek) |
| `data.js` | erzeugte Daten, nicht von Hand bearbeiten |
| `Foerdermaterial/` | Material je Stufe (siehe oben) |
