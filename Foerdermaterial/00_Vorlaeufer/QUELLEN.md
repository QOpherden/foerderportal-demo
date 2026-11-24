# Quellenstruktur und Zitierweise (Stand 11.11.2026)

> **Neu am 11.11.2026:** Fach *Emotional-soziale Entwicklung* mit Q3 S. 30–34, Q4 und Q5. Einzelheiten siehe [Abschnitt ES](#emotional-soziale-entwicklung-es) am Ende.

**Gilt nur für die Stufe Vorläuferfähigkeiten** (Ordner `Foerdermaterial/00_Vorlaeufer/`). Die PDFs liegen in `Quellen/`, die Quellenliste in `quellen.csv`, die Flyer-Feldüberschriften in `feldueberschriften.csv`.

So kann jede vorgeschlagene Maßnahme in den Originalmaterialien schnell gefunden werden. Die Kürzel gelten für den Förderkatalog dieser Stufe (`foerderkatalog.csv`, Spalten `quelle_id`, `fundstelle_kurz`, `fundstelle`) und alle späteren Förderempfehlungen.

## Zitierweise

| Kürzel | Quelle | Datei | Fundstelle angeben als |
|---|---|---|---|
| **Q1** | Elternflyer Deutsch („Kindergartenkind – Schulkind – mein Kind! Deutsch“) | `Elternflyer-Deutsch-zusammengefuegt.pdf` | **Q1 · S. x · Fy** = Seite x, Feld y |
| **Q2** | Elternflyer Mathematik („Kindergartenkind – Schulkind – mein Kind! Mathematik“) | `Elternflyer-Mathe-zusammengefuegt.pdf` | **Q2 · S. x · Fy** |
| **Q3** | Handout zum Materialpaket für die sozialpädagogischen Fachkräfte (Schulatelier des Schulamts Oberbergischer Kreis) | S. 1–29: `Handout-Sozpaeds-Materialbox-0821.pdf` · S. 30–34: `Handout-Sozpaeds-Materialbox-0821_ES.pdf` | **Q3 · S. x** (gedruckte Seitenzahl „Seite x von 47“; im ES-Auszug ist S. 30 = PDF-Seite 1) |
| **Q4** | Elternflyer Gefühle und Verhalten („Kindergartenkind – Schulkind – mein Kind! Gefühle und Verhalten“) | `Elternflyer-Gefuehle-zusammengefuegt.pdf` | **Q4 · S. x · Fy** |
| **Q5** | Handout 02/2026 des Schulateliers (83 Seiten, nur Auszüge vorhanden) | S. 26–28: `Handout-022026-nur-Info.pdf` · S. 50–58: `Handout-022026-nur-Info_ES.pdf` | **Q5 · S. x** (gedruckte Seitenzahl „Seite x von 83“) |

Bei Q3 und Q5 rechnet `build_data.py` die gedruckte Seitenzahl selbst in die PDF-Seite des passenden Auszugs um (je Auszug eine Zeile mit `von`/`bis` in `quellen.csv`).

**Flyer:** A4 quer, Vorderseite (S. 1) und Rückseite (S. 2) mit je 4 Feldern, von links nach rechts gezählt (F1–F4). Jedes Feld hat eine eigene Überschrift. In der PDF ist jede Seite zweimal untereinander gedruckt (zwei Flyer pro Blatt), die Inhalte sind identisch.

## Q1 – Elternflyer Deutsch

| Seite · Feld | Überschrift | Inhalt | QR-Code |
|---|---|---|---|
| S. 1 · F1 | Titelfeld | „Wie kann ich mein Kind für einen guten Übergang … unterstützen?“ | – |
| S. 1 · F2 | Der Start in die Schule gelingt leichter, wenn Kinder … | Checkliste: reimen, rhythmisch klatschen, vollständige Sätze, Mund/Zunge bewegen, Blickkontakt, Mimik/Gestik, zuhören, Stift halten, Kontakte | – |
| S. 1 · F3 | Was ist bei Eltern wichtig? | Sprachanregendes Verhalten: Blickkontakt, Ablenkung aus, Interesse, offene Fragen, Vorlesen | „Sprachentwicklung verbessern“ (schule-und-familie.de) |
| S. 1 · F4 | Miteinander sprechen – mit Worten und dem Körper | Grimassen-Ratespiel, „sprechen“ ohne Worte, vom Tag erzählen, Rollenspiel mit Puppen, Geschichten erfinden | – |
| S. 2 · F1 | Mit Sprache spielen | Kinderreime, Reimwort ergänzen, Zungenbrecher, Abzählreime, Klatschspiele, Reim-Bilderbücher, singen, Fingerspiele, Geräusche raten | Fingerspiele (eltern.de), Reime und Zungenbrecher (kindaktuell.at), Buchempfehlungen zum Vorlesen (Stiftung Lesen) |
| S. 2 · F2 | Wörter erkennen, Sätze sprechen und verstehen | Koffer packen, Wörter zu einem Thema, Signalwörter beim Vorlesen, Alltag nachspielen (Kaufladen), Wimmelbücher | Ideen zu Wimmelbüchern (sprachgold-online.de) |
| S. 2 · F3 | Mund, Zunge und Hände vielfältig bewegen, stärken und entspannen | Strohhalm blubbern, Papier ansaugen, Kerzen auspusten, Streusel mit der Zunge, Kussmünder; Lego, Teig kneten, dicke/Dreikant-Stifte, Pinsel, Straßenkreide, klettern, Tauziehen | 2× „weitere Ideen“ (kitakram.de – Mundmotorik; PDF Schreibmotorikübungen) |
| S. 2 · F4 | Was hilft meinem Kind noch? / Wo finde ich Unterstützung? | Kita, Spielkontakte, Verein, Musikschule; Beratung durch Kita- und sozpäd. Fachkräfte, Kinderarzt | – |

## Q2 – Elternflyer Mathematik

| Seite · Feld | Überschrift | Inhalt | QR-Code |
|---|---|---|---|
| S. 1 · F1 | Titelfeld | wie Q1 | – |
| S. 1 · F2 | Mathe-Spaziergänge: Formen, Muster und Zahlen liegen auf dem Weg! | Formen und Gehweg-Muster entdecken, Zahlen an Häusern/Autos/Schildern, Muster aus Naturmaterial | – |
| S. 1 · F3 | Was ist bei Eltern wichtig? | Zählen, ordnen, teilen, messen, wiegen; Kind als „Entdecker*in“ von Zahlen und Formen | „Spielerisch“ Mathematik im Kinderalltag (ja-klar-mathe.de) |
| S. 1 · F4 | Messen und vergleichen mit leckerem Ergebnis! | Backen/Kochen: wiegen, Mengen vergleichen, Längen vergleichen, Formen ausstechen | „Mit dem Löffel um die Welt“ (Kinderkochbuch, Save the Children) |
| S. 2 · F1 | Faszination Taschengeld | Kaufladen, Einkaufen, Preise, Wechselgeld, Sparen | „Taschengeld fürs Kind“ (sparkasse.de) |
| S. 2 · F2 | Was bringt das meinem Kind? | „Wir brauchen Mathe immer beim …“: Zählen, Sortieren, Muster, Messen/Wiegen, Zeit, Raum-Lage | – |
| S. 2 · F3 | Welche Materialien fördern mathematische Basiskompetenzen? | Würfel, Baumaterial, Naturmaterial, Lineal/Schablonen, Spiegel, Messinstrumente, Körper als Maß, Zahlbilder, Kalender/Uhr/Sanduhr | – |
| S. 2 · F4 | Was hilft meinem Kind noch? / Wo finde ich Unterstützung? | wie Q1 | – |

## Q3 – Handout zum Materialpaket (S. 1–29 von 47 vorhanden)

Jedes Kapitel ist gleich aufgebaut: **Grundlegende Informationen** (Teilfähigkeiten mit Fallbeispielen „Lisa“) → **Im Paket enthalten** → **Ideen / Vorschläge für weitere Anschaffungen** → **Links zum Thema** → **Ideen / Angebote im Schulalltag**.

| Seite | Kapitel › Abschnitt | Inhalte (Auswahl) |
|---|---|---|
| 1 | Deckblatt / Inhaltsübersicht | Entwicklungsbereiche mit Seitenzahlen |
| 2–4 | Deutsch › Grundlegende Informationen › Phonologische Bewusstheit (weiterer Sinn) | Reime (Reim-Suchlauf, S. 2), Sprache rhythmisieren, Kamishibai (S. 2–4) |
| 5 | Deutsch › … | Silben (Silben-Mattenweg), Anlaut/Endlaut/Inlaut (Laut-Korb), Lautsynthese |
| 6 | Deutsch › … | Wortgrenzen (Satz-Ball), Wortschatz: Erzählsteine, Zusammenhänge verstehen |
| 7 | Deutsch › … | Anweisungen umsetzen, Grammatik (betontes Erzählen), Artikulation (Korken-Lesen), Mundmotorik (Kirschkernweitspucken, Grimassen-Kreis) |
| 8 | Deutsch › Im Paket enthalten / Weitere Anschaffungen | Haus Maus Laus, Silbolo, Initialo, Scrabble Junior, Hedbanz / Spielehaus, Butschkow, Wimmlingen, Zwergenmatz, Sprech-Hexe |
| 9 | Deutsch › Links zum Thema / Ideen im Schulalltag | Links (Wimmelbücher, Phonologische Bewusstheit, Kamishibai); Lauschspiele, Abzählverse |
| 10 | Deutsch › Ideen im Schulalltag | Anlaute finden, Robotersprache, Silbenboot, Ist der Satz fertig?, Ich sehe was, Wer hat den Keks …, Vor welcher Tür stehst du? |
| 11 | Deutsch › Ideen im Schulalltag | Reimwörter finden, Reimpaare finden, Gleiche und ungleiche Wortpaare |
| 12–17 | Mathematik › Grundlegende Informationen › Vierphasenmodell (PIKAS) | Phasen 1–4 am Beispiel Zwanzigerfeld; Grundsatz „erst diagnostizieren“ (S. 17) |
| 18 | Mathematik › Pränumerische Fähigkeiten | Sortieren, Klassifizieren, Zuordnen (Tisch decken), Begriffe mehr/weniger (Gummibärchen) |
| 19 | Mathematik › … | Räumliche Begriffe (3×3-Matrix), Mengenerfassung/-vergleich |
| 20 | Mathematik › … | Mengeninvarianz, Seriation/Muster, Zählen |
| 21 | Mathematik › Im Paket enthalten / Weitere Anschaffungen | Shut The Box, Kalaha, Küchen-Timer, Elfer raus, „50 besten Spiele“, „Kinder erfinden Mathematik“ / Spielesammlung, PlusPlus, Halli Galli, Zahlen-Zauber |
| 22 | Mathematik › Links / Ideen im Schulalltag | SINUS, PIKAS; Hüpfekästchen, Klatschkette, Was ist größer?, Blitz und Donner, Münzen sortieren |
| 23 | Mathematik › Ideen im Schulalltag | Perlenketten ordnen, Bordüren/Muster, Marienkäfer-Punkte, Zählen und Bündeln |
| 24 | Motorik › Grundlegende Informationen › Grobmotorik | Körperspannung (Rollbrett), Gleichgewicht (Kreidelinie) |
| 25 | Motorik › … | Krafteinsatz, Rhythmus (Trommel), Mundmotorik (Strohhalm-Raupenrennen), Bewegungsplanung |
| 26 | Motorik › Feinmotorik | Stifthaltung/Dreipunktgriff (Stift-Drehübung), Lateralität, Sitz- und Schreibhaltung |
| 27 | Motorik › … / Im Paket enthalten | Visuomotorik (Geheimschrift); Fingertwist, Ölpastellkreiden, Knete, Strickpilz, Strickgabel, Werkstattbuch, Papierflieger, Gummitwist, Psychomotorik-Karten, BzgA |
| 28 | Motorik › Weitere Anschaffungen / Links | Straßenkreide, Origami, Ich spüre mich, Werkzeuge, Stuhl auf Stuhl, Twister, Make ’n’ Break, Diamond Painting; Kinderyoga, Bewegungsideen |
| 29 | Motorik › Ideen im Schulalltag | Bewegung durch andere, Geistertanz, Zeitungsdecke, Zeitungspartner, Klebende Körperteile, Armbänder knüpfen |
| 30–32 | Emotionalität / Sozialverhalten › Grundlegende Informationen | Teilfähigkeiten (Gefühle anderer wahrnehmen, Kompromisse, Konflikte, Respekt, Beziehung, Selbstregulation, Kommunikation, Kooperation, Regeln, Verantwortung, interkulturelle Kompetenz; Selbst: Gefühle ausdrücken, Werthaltungen, Selbstbehauptung); Beispiele Stille-Post-Pantomime (30), Positive Eigenschaften zum Namen (30), Matten und Reifen zur Trommel (31), Gespräch über Schulregeln (31) |
| 32 | Emotionalität / Sozialverhalten › Im Paket enthalten | Portmann: 50 besten Spiele Sozialkompetenz, Behnke: 50 besten Spiele Konflikte, Traurig, wütend oder froh?, BzgA Achtsamkeit und Anerkennung |
| 33 | … › Weitere Anschaffungen / Links | Bücken-Schaal: Gib auf dich acht!, Bildkarten Gefühle; Links FIPP e. V., publikationen.sachsen.de, KiTa Fachtexte (Valentien) |
| 34 | … › Ideen im Schulalltag | Ich zeig dir den Weg, Die freundlichen 10 Minuten, Heinzeln, Keiner geht über Bord |
| (35–47) | fehlen: Entspannung (35), Konzentration/Wahrnehmung (38) | – |

## Maßnahmen in der Grafik mit Fundstellen

| Platz | Bereich | Maßnahme | Fundstelle |
|---|---|---|---|
| 1 | Phonologische Bewusstheit | Lernspiele Haus Maus Laus, Silbolo, Initialo | Q3 · S. 8 (Deutsch › Im Paket enthalten) |
| 1 | | Robotersprache, Silbenboot, Reimpaare finden | Q3 · S. 10–11 (Deutsch › Ideen im Schulalltag) |
| 1 | | Zuhause: Reime, Zungenbrecher, Fingerspiele | Q1 · S. 2 · F1 („Mit Sprache spielen“) |
| 2 | Stifthaltung, Feinmotorik & Mundmuskulatur | Stift-Drehübung im Dreipunktgriff mit Dreikantstift | Q3 · S. 26 (Motorik › Feinmotorik) |
| 2 | | Fingertwist, Knete, Strickpilz, Strickgabel | Q3 · S. 27 (Motorik › Im Paket enthalten) |
| 2 | | Mundmotorik: Strohhalm-Raupenrennen, Pusten und Blubbern | Q3 · S. 25 (Motorik › Mundmotorik) + Q1 · S. 2 · F3 |
| 3 | Arithmetik | Lernspiele Kalaha, Shut The Box, Elfer raus | Q3 · S. 21 (Mathematik › Im Paket enthalten) |
| 3 | | Blitz und Donner, Marienkäfer-Punkte, Zählen und Bündeln | Q3 · S. 22–23 (Mathematik › Ideen im Schulalltag) |
| 3 | | Zuhause: beim Backen wiegen, messen, vergleichen | Q2 · S. 1 · F4 („Messen und vergleichen mit leckerem Ergebnis!“) |

---

## Emotional-soziale Entwicklung (ES)

Eigenständiges Fach, getrennt von Deutsch und Mathematik (Akzentfarbe Violett). Katalogeinträge **F132–F175**.

### Q4 – Elternflyer Gefühle und Verhalten

| Seite · Feld | Überschrift | Inhalt | QR-Code |
|---|---|---|---|
| S. 1 · F1 | Titelfeld | wie Q1 | – |
| S. 1 · F2 | Der Start in die Schule gelingt leichter, wenn Kinder … | Checkliste: Freundschaften knüpfen, sprechen, gemeinsam spielen, Streit lösen, Kompromisse und eigene Interessen, Verantwortung, aktiv werden, Regeln, eigene Gefühle erkennen/äußern/kontrollieren, Gefühle anderer erkennen | – |
| S. 1 · F3 | Was ist bei Eltern wichtig? | Vorbild sein, über Gefühle sprechen, Gefühle ernst nehmen, zugewandt und konsequent, schädigendes Verhalten stoppen, Medien begleiten, verlässliche Tagesstruktur | – |
| S. 1 · F4 | Gefühle und Verhalten im Spiel | Rollen-, Gesellschafts-, Sportspiele; Zusammenarbeit, Sieg und Niederlage | – |
| S. 2 · F1 | Über Gefühle und Verhalten sprechen | Vorlesen mit festen Zeiten und Nachfragen, Danke/Bitte, Gespräche über Erlebtes | – |
| S. 2 · F2 | Was bringt das meinem Kind? | Vorteile (Ausdauer, Miteinander, Problemlösung, Selbstwert …); Buchtipp Böhm: *Heute hab ich Wut im Bauch* | – |
| S. 2 · F3 | Bücher und Spieletipps, weiterführende Informationen | – | Elternwissen (Kinderspiele soziales Miteinander), Kinderbuch-Couch (Buchtipps zu Gefühlen), Gesundheitsmagazin (sozial-emotionale Kompetenz), Haus der Familie (Warum ist spielen wichtig?) – **nur als QR-Code, keine Link-Adresse in der PDF** |
| S. 2 · F4 | Was hilft meinem Kind noch? / Wo finde ich Unterstützung? | Kita, Spieltreffen, Verein, Musikschule; Fachkräfte, kinderärztliche Praxis | – |

### Q5 – Handout Schulatelier 02/2026 (Auszüge)

| Seite | Kapitel › Abschnitt | Inhalte | Im Katalog als |
|---|---|---|---|
| 26–27 | Emotionalität / Sozialverhalten › Emotionale Intelligenz und Kompetenz; soziale Kompetenz | Rindermann: Gefühle wahrnehmen, verstehen, regulieren; Kommunikation, Kooperation, Durchsetzung, Konflikt; Entwicklung Vorschule → Grundschule → Jugend | Konzept |
| 28 | … › Ideen zur Förderung / Links | Geschichten, Rollenspiele, Gefühlskarten, Bilderbücher, kooperative Spiele, Gemeinschaftsprojekte, Verhaltenstrainings (Petermann); Links kompetenztraining-kinder.de, brueckenbauen.bayern.de | Übung Schulalltag, Konzept, Link |
| 50 | Förderschwerpunkt ES › Definition | AO-SF §4 (4) | Konzept (mit S. 51–52) |
| 51 | … › Ursachen | Risikofaktoren (individuell, familiär, schulisch-sozial), Schutzfaktoren | Konzept |
| 52 | … › Erscheinungsformen | externalisierend, internalisierend, soziale Auffälligkeiten | Konzept |
| 53 | … › Schulische Auswirkungen – externalisierend | Grundbedürfnisse prüfen: Bindung, Selbstwert, Struktur, Autonomie, Spiel | Handlungsleitfaden |
| 54 | … › Schulische Auswirkungen – internalisierend | Anzeichen stiller Kinder | Handlungsleitfaden |
| 55 | … › Prävention | schulweite Regeln, drei Qualitätskriterien, acht Schlüsselprinzipien | Handlungsleitfaden |
| 56 | … › Schulische Handlungsmöglichkeiten | Beziehungsarbeit, Classroom Management, Fallstricke | Handlungsleitfaden |
| 57 | … › Handlungsmaßnahmen bei aggressiven Impulsdurchbrüchen | „Unaufgeregter Umgang“, 12 Verhaltensweisen (nach Hejlskov Elvén) | Handlungsleitfaden |
| 58 | … › Handlungsmaßnahmen bei internalisierendem Verhalten | sichere Lernumgebung, Ermutigung, soziale Einbindung, Vertrauenslehrkraft, eigene Grenzen | Handlungsleitfaden |

Der neue Typ **Handlungsleitfaden** kennzeichnet Vorgehen für Lehrkräfte (Haltung, Klassenführung, Deeskalation) im Unterschied zu Übungen mit Kindern.

### Bereiche (Vorschlag)

Gegliedert nach Rindermann (Q5 S. 26–27): zwei Bereiche emotionale Kompetenz, zwei Bereiche soziale Kompetenz. Sie decken die Teilfähigkeiten aus Q3 S. 30–32 und die Checkliste Q4 S. 1 · F2 ab.

| ID | Bereich | umfasst | Einträge |
|---|---|---|---|
| ES-GEF | Gefühle erkennen & ausdrücken | eigene und fremde Gefühle wahrnehmen, benennen, äußern; Empathie | 26 |
| ES-REG | Selbstregulation & Regeln | Gefühle steuern, Impulskontrolle, Regeln einhalten, Verantwortung | 18 |
| ES-KOOP | Kontakt, Kommunikation & Kooperation | Kontakt aufnehmen, respektvoll sein, zuhören und sprechen, zusammenarbeiten, helfen | 27 |
| ES-KONF | Konflikte lösen & sich behaupten | Streit lösen, Kompromisse, eigene Interessen und Meinung vertreten | 13 |

### Kuratierte Maßnahmen ES (`konfiguration.py`, Stufe `VL` › `massnahmen`)

Solange ES noch nicht erhoben wird, stehen sie oben in der Materialliste des Bereichs („Vorschläge“). Sobald eine Stufe ES-Daten hat, erscheinen sie im Maßnahmen-Kasten.

| Bereich | Schulalltag | Kleingruppe/Materialbox | Zuhause |
|---|---|---|---|
| ES-GEF | Gefühlskarten: eigene Stimmung beschreiben (Q5 · S. 28) | Stille-Post-Pantomime (Q3 · S. 30), Legespiel „Traurig, wütend oder froh?“ (Q3 · S. 32) | Bilderbücher vorlesen und über Gefühle sprechen (Q4 · S. 2 · F1) |
| ES-REG | Unaufgeregter Umgang bei Impulsdurchbrüchen (Q5 · S. 57) | Gespräch über Schulregeln (Q3 · S. 31) | Verlässlicher Tagesablauf, Medien begleiten (Q4 · S. 1 · F3) |
| ES-KOOP | Keiner geht über Bord, Heinzeln, Die freundlichen 10 Minuten (Q3 · S. 34) | Matten und Reifen zur Trommel (Q3 · S. 31) | Rollen-, Gesellschafts- und Sportspiele (Q4 · S. 1 · F4) |
| ES-KONF | Kooperative Spiele, Tischspiele, Gemeinschaftsprojekte (Q5 · S. 28) | Behnke: Die 50 besten Spiele zum Umgang mit Konflikten (Q3 · S. 32) | Zugewandt und konsequent Grenzen setzen (Q4 · S. 1 · F3) |
