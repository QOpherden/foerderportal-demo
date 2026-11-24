"""Konfiguration des Förderportals.

Hier steht alles, was sich an die Schule anpassen lässt:
Fächer, Bereiche, Stufen (Vorläuferfähigkeiten, Klasse 1–4), Maßnahmen und
Beschriftungen. Nach jeder Änderung `python build_data.py` ausführen und die
Seite neu laden.

Ablage: Jede Stufe hat einen eigenen Ordner (z. B. `00_Vorlaeufer`), und zwar
zweimal mit gleichem Namen:
- Foerderportal/Foerdermaterial/<ordner>/   Förderkatalog, Quellenliste, PDFs
- Schuldatenblaetter/<ordner>/              Erhebungsdaten der Schulen
Eine Stufe sieht nur das Material aus ihrem eigenen Ordner.

Aufbau in Kürze
- FAECHER:  die Fächer, nach denen die Bereiche gruppiert werden.
- BEREICHE: alle Bereiche, die irgendwo erhoben werden oder in einem
            Förderkatalog vorkommen. Jeder Bereich gehört zu genau einem Fach.
            Die ID steht im Förderkatalog in der Spalte `bereiche`.
- STUFEN:   je Stufe eigener Ordner, eigene Datendatei, eigene Bereiche,
            eigener Förderkatalog und eigene Maßnahmen. Eine Stufe ohne
            Datendatei erscheint auf der Seite ausgegraut („noch keine Daten“).
"""

# ---------------------------------------------------------------------------
# Ordner (relativ zum Ordner dieser Datei)
# ---------------------------------------------------------------------------
MATERIAL_ORDNER = "Foerdermaterial"          # wird mit der Seite weitergegeben
SCHULDATEN_ORDNER = "../Schuldatenblaetter"  # bleibt außerhalb der Seite (Datenschutz)

# Dateinamen im Materialordner jeder Stufe
KATALOG_DATEI = "foerderkatalog.csv"
QUELLEN_DATEI = "quellen.csv"
FELDER_DATEI = "feldueberschriften.csv"      # nur nötig, wenn Faltflyer mit Feldern zitiert werden
PDF_UNTERORDNER = "Quellen"

# ---------------------------------------------------------------------------
# Fächer (Reihenfolge = Reihenfolge auf der Seite)
#   kurz   Kurzname für enge Stellen (Klassenvergleich)
#   farbe  Akzentfarbe des Fachs (nicht Orange – das steht für „nicht gesichert“)
# Im Maßnahmen-Kasten erscheint je Fach genau ein Vorschlag.
# ---------------------------------------------------------------------------
FAECHER = [
    {"id": "MA", "name": "Mathe", "kurz": "Mathe", "farbe": "#1f69c8"},
    {"id": "DE", "name": "Deutsch", "kurz": "Deutsch", "farbe": "#0b7a70"},
    {"id": "ES", "name": "Emotional-soziale Entwicklung", "kurz": "Emotional-sozial", "farbe": "#7656c0"},
]

# ---------------------------------------------------------------------------
# Bereiche
#   id     Kürzel, so wie im Förderkatalog (Spalte `bereiche`)
#   name   Anzeigename
#   kurz   sehr kurzes Kürzel für die Förderprofile (max. ca. 4 Zeichen)
#   fach   ID aus FAECHER
#   satz   Name mitten im Satz (z. B. kleingeschrieben), optional
#   kopf   Spaltenkopf im Klassenvergleich, „\n“ = Zeilenumbruch, optional
# Bereiche für Klasse 1–4 können hier später ergänzt werden (eigene IDs, z. B. „K1-M-ZR20“).
# ---------------------------------------------------------------------------
BEREICHE = [
    # --- Vorläuferfähigkeiten ---
    {"id": "M-ARI", "name": "Arithmetik", "kurz": "Ari", "fach": "MA"},
    {"id": "M-GEO", "name": "Geometrie", "kurz": "Geo", "fach": "MA"},
    {"id": "D-PHON", "name": "Phonologische Bewusstheit", "kurz": "Phon", "fach": "DE",
     "satz": "phonologische Bewusstheit", "kopf": "Phonologische\nBewusstheit"},
    {"id": "D-MOT", "name": "Stifthaltung, Feinmotorik & Mundmuskulatur", "kurz": "Mot", "fach": "DE",
     "kopf": "Stifthaltung &\nFeinmotorik"},

    # Emotional-soziale Entwicklung (Quellen Q3 S. 30–34, Q4, Q5 der Vorläufer-Materialien).
    # Gliederung nach Rindermann (Q5 S. 26–27): emotionale Kompetenz (innen) und
    # soziale Kompetenz (außen), je zwei Bereiche. Noch bei keiner Stufe erhoben:
    # Die Seite zeigt sie als Vorschau, die Materialien sind aber abrufbar.
    {"id": "ES-GEF", "name": "Gefühle erkennen & ausdrücken", "kurz": "Gef", "fach": "ES",
     "satz": "Gefühle erkennen & ausdrücken", "kopf": "Gefühle erkennen\n& ausdrücken"},
    {"id": "ES-REG", "name": "Selbstregulation & Regeln", "kurz": "Reg", "fach": "ES",
     "kopf": "Selbstregulation\n& Regeln"},
    {"id": "ES-KOOP", "name": "Kontakt, Kommunikation & Kooperation", "kurz": "Koop", "fach": "ES",
     "kopf": "Kontakt &\nKooperation"},
    {"id": "ES-KONF", "name": "Konflikte lösen & sich behaupten", "kurz": "Konf", "fach": "ES",
     "kopf": "Konflikte &\nSelbstbehauptung"},

    # --- Klasse 3 und 4 (Material: Foerdermaterial/34_Klasse3und4) ---
    # Gliederung nach Lehrplan NRW (Mathematik: Inhaltsbereiche, Zahlen und
    # Operationen geteilt nach den Basiskompetenzen; Deutsch: Bereiche des Fachs).
    # Für die emotional-soziale Entwicklung gelten die ES-Bereiche oben.
    {"id": "K34-M-ZAHL", "name": "Zahl- & Stellenwertverständnis", "kurz": "Zahl", "fach": "MA",
     "kopf": "Zahl- &\nStellenwert"},
    {"id": "K34-M-OP", "name": "Operationsverständnis & Rechnen", "kurz": "Rech", "fach": "MA",
     "kopf": "Operationen &\nRechnen"},
    {"id": "K34-M-RAUM", "name": "Raum und Form", "kurz": "Raum", "fach": "MA"},
    {"id": "K34-M-GROE", "name": "Größen, Messen & Daten", "kurz": "Größ", "fach": "MA",
     "kopf": "Größen &\nDaten"},
    {"id": "K34-D-SPRECH", "name": "Sprechen & Zuhören", "kurz": "Spr", "fach": "DE"},
    {"id": "K34-D-LESEN", "name": "Lesen", "kurz": "Les", "fach": "DE"},
    {"id": "K34-D-SCHREIB", "name": "Texte schreiben", "kurz": "Schr", "fach": "DE"},
    {"id": "K34-D-RECHT", "name": "Rechtschreiben", "kurz": "RS", "fach": "DE"},
]

# Zusatzbereiche: erscheinen in der Materialliste nur als Etikett (nicht anklickbar)
ZUSATZBEREICHE = {
    "D-SPR": "Sprache & Sprechen",
    "MOT-GROB": "Grobmotorik",
    "WAHR": "Wahrnehmung",
}

# ---------------------------------------------------------------------------
# Stufen
#   id                Kürzel der Stufe (auch für Links: index.html#K2)
#   label             Text auf dem Auswahlknopf
#   ordner            Ordnername der Stufe unter Foerdermaterial/ und Schuldatenblaetter/
#   datei             Datendatei im Ordner Schuldatenblaetter/<ordner>/
#                     (eine Zeile pro Kind, Semikolon, UTF-8). Pflichtspalten:
#                     schule, klasse und je Bereich die `spalte`
#                     (Werte 1 = gesichert, 0 = nicht gesichert).
#   eyebrow, frage    Kopfzeile und Überschrift der Seite
#   faecher           welche Fächer auf der Seite erscheinen (IDs aus FAECHER)
#   bereiche          erhobene Bereiche mit Spaltenname in der Datendatei
#   gleichstand       Reihenfolge bei Gleichstand im Maßnahmen-Ranking
#                     (fehlt sie, gilt die Reihenfolge von `bereiche`)
#   beispieldaten     optional: Fach-IDs, deren Werte ausgedacht sind (Test/Vorführung).
#                     Die Seite kennzeichnet diese Fächer mit „Beispieldaten (fiktiv)“.
#   luecken_ab       Kennzahl „Kinder mit Lücken in ≥ x Bereichen“
#   schulbesuchsjahr  True: Kennzahl „Kinder im 2. Schulbesuchsjahr“ zeigen
#                     (Spalte `schulbesuchsjahr` wird dann gelesen)
#   lernausgangslage  True: Kachel sagt „… Kindern starten ohne Lücke“ (Schulbeginn),
#                     sonst „… Kindern ohne Lücke“
#   massnahmen        kuratierte Maßnahmen je Bereich (IDs aus dem Katalog DIESER
#                     Stufe), je ein Vorschlag für Schulalltag, Kleingruppe, Zuhause.
#                     Für noch nicht erhobene Bereiche erscheinen sie oben in der
#                     Materialliste („Vorschläge“).
#   material          optional: Liste der Materialordner, falls die Stufe außer
#                     ihrem eigenen Ordner auch einen gemeinsamen Ordner nutzt
#                     (z. B. Klasse 3 und 4 → 34_Klasse3und4). Fehlt die Angabe,
#                     gilt nur der eigene Ordner. Im gemeinsamen Katalog kann die
#                     Spalte `stufen` einen Eintrag auf einzelne Stufen beschränken.
# ---------------------------------------------------------------------------

# Kuratierte Maßnahmen Klasse 3 und 4 (Katalog Foerdermaterial/34_Klasse3und4).
# Die Quellen enthalten kein Material für zu Hause – daher Schulalltag und Kleingruppe.
MASSNAHMEN_K34 = {
    "K34-M-ZAHL": [
        {"text": "Rituale am Zahlenstrahl: Ordnen, Zahlenrätsel, Finde die Mitte", "ids": ["F042", "F043", "F044"]},
        {"text": "Kleingruppe: Zahl unter der Lupe, Hausnummern würfeln (Stellenwerte)", "ids": ["F051", "F052"]},
        {"text": "Bei Schwierigkeiten: Diagnosegespräch und Vierphasenmodell", "ids": ["F033", "F021"]},
    ],
    "K34-M-OP": [
        {"text": "Blitzrechnen, Sprünge am Rechenstrich, Quatschgeschichten", "ids": ["F024", "F057", "F056"]},
        {"text": "Entdeckerpäckchen, Zahlenmauern und Rechenstrategien", "ids": ["F037"]},
        {"text": "Bei Schwierigkeiten: Anzeichen prüfen, Diagnosegespräch", "ids": ["F023", "F033"]},
    ],
    "K34-M-RAUM": [
        {"text": "Würfelgebäude nach Plan bauen und beschreiben", "ids": ["F059"]},
        {"text": "Matheprojekte: Geobretter, Mosaike, Pausenhof gestalten", "ids": ["F026"]},
        {"text": "Orientierung: Kompetenzerwartungen Raum und Form", "ids": ["F065"]},
    ],
    "K34-M-GROE": [
        {"text": "Größen – Stadt – Land – Fluss und Stopp-Tanz", "ids": ["F060", "F061"]},
        {"text": "Mathe-Rituale: Schätzgläser, Messaufgaben in der Pause", "ids": ["F025"]},
        {"text": "Projekte mit Alltagsbezug: Preise, Busfahrpläne, Umfragen", "ids": ["F026"]},
    ],
    "K34-D-SPRECH": [
        {"text": "Sprachspiele: Stadt-Land-Fluss, Tabu, Weder ja noch nein", "ids": ["F009"]},
        {"text": "Szenisches Spiel und Puppentheater", "ids": ["F008"]},
        {"text": "Sprachvorbild sein", "ids": ["F001"]},
    ],
    "K34-D-LESEN": [
        {"text": "Vorlesegespräch", "ids": ["F006"]},
        {"text": "Kleingruppe: Erst ich ein Stück, dann du", "ids": ["F007"]},
        {"text": "Entwicklungsstufe bestimmen und Förderansatz wählen", "ids": ["F075"]},
    ],
    "K34-D-SCHREIB": [
        {"text": "Schreibanlässe für ein Jahrbuch", "ids": ["F077"]},
        {"text": "Kleingruppe: Unterstützung beim freien Schreiben", "ids": ["F011"]},
        {"text": "Lernaufgabe: Geburtstagsgrüße schreiben", "ids": ["F079"]},
    ],
    "K34-D-RECHT": [
        {"text": "FRESCH-Strategien und Textkorrekturkarte", "ids": ["F005"]},
        {"text": "Kleingruppe: Text mit der Textkorrekturkarte überarbeiten", "ids": ["F012"]},
        {"text": "Entwicklungsstufe bestimmen und Förderansatz wählen", "ids": ["F075"]},
    ],
    # Emotional-soziale Entwicklung: in den Quellen für Klasse 3/4 nur wenig Material
    "ES-GEF": [
        {"text": "Über Gefühle schreiben (Aufgabenkarte „Gefühle“)", "ids": ["F078"]},
        {"text": "Gefühle beschreiben, Sichtweisen einnehmen (Lehrplan Deutsch)", "ids": ["F069", "F074"]},
    ],
    "ES-REG": [
        {"text": "Klassenkaufladen: Abwarten und Frustrationstoleranz beobachten", "ids": ["F080"]},
    ],
    "ES-KOOP": [
        {"text": "Geburtstagsgrüße für Menschen aus dem Umfeld", "ids": ["F079"]},
        {"text": "Wertschätzend formulieren, Sichtweisen einnehmen", "ids": ["F074"]},
    ],
    "ES-KONF": [
        {"text": "Streitschlichtungsgespräche (Lehrplan Deutsch)", "ids": ["F069"]},
    ],
}

STUFEN = [
    {
        "id": "VL",
        "label": "Vorläuferfähigkeiten",
        "ordner": "00_Vorlaeufer",
        "datei": "gs01_schueler.csv",
        "eyebrow": "Lernausgangslage Jahrgangsstufe 1",
        "frage": "Mit welchen Vorläuferfähigkeiten starten unsere Erstklässler*innen?",
        "faecher": ["MA", "DE", "ES"],
        "bereiche": [
            {"id": "M-ARI", "spalte": "mathe_arithmetik"},
            {"id": "M-GEO", "spalte": "mathe_geometrie"},
            {"id": "D-PHON", "spalte": "deutsch_phonologische_bewusstheit"},
            {"id": "D-MOT", "spalte": "deutsch_stifthaltung_feinmotorik_mundmuskulatur"},
            # ES: FIKTIVE Beispielwerte (12.11.2026), siehe Schuldatenblaetter/00_Vorlaeufer/LIESMICH.md
            {"id": "ES-GEF", "spalte": "es_gefuehle"},
            {"id": "ES-REG", "spalte": "es_regulation"},
            {"id": "ES-KOOP", "spalte": "es_kooperation"},
            {"id": "ES-KONF", "spalte": "es_konflikte"},
        ],
        "gleichstand": ["D-PHON", "D-MOT", "M-ARI", "M-GEO", "ES-REG", "ES-KONF", "ES-KOOP", "ES-GEF"],
        # Fächer, deren Werte ausgedacht sind: Die Seite kennzeichnet sie mit „Beispieldaten (fiktiv)“.
        # Sobald echte Werte vorliegen, das Fach hier entfernen.
        "beispieldaten": ["ES"],
        "luecken_ab": 3,
        "schulbesuchsjahr": True,
        "lernausgangslage": True,
        "massnahmen": {
            "D-PHON": [
                {"text": "Lernspiele Haus Maus Laus, Silbolo und Initialo", "ids": ["F007", "F008", "F009"]},
                {"text": "Robotersprache, Silbenboot, Reimpaare finden", "ids": ["F016", "F017", "F021"]},
                {"text": "Zuhause: Reime, Zungenbrecher, Fingerspiele", "ids": ["F025"]},
            ],
            "D-MOT": [
                {"text": "Stift-Drehübung im Dreipunktgriff mit Dreikantstift", "ids": ["F047"]},
                {"text": "Fingertwist, Knete, Strickpilz und Strickgabel", "ids": ["F054", "F056", "F057", "F058"]},
                {"text": "Mundmotorik: Strohhalm-Raupenrennen, Pusten und Blubbern", "ids": ["F051", "F068"]},
            ],
            "M-ARI": [
                {"text": "Lernspiele Kalaha, Shut The Box und Elfer raus", "ids": ["F099", "F098", "F101"]},
                {"text": "Blitz und Donner, Marienkäfer-Punkte, Zählen und Bündeln", "ids": ["F111", "F113", "F114"]},
                {"text": "Zuhause: beim Backen wiegen, messen, vergleichen", "ids": ["F118"]},
            ],
            "M-GEO": [
                {"text": "Bordüren malen und Muster fortsetzen", "ids": ["F128"]},
                {"text": "3×3-Plättchenmatrix: oben, unten, links, rechts", "ids": ["F125"]},
                {"text": "Zuhause: Mathe-Spaziergänge zu Formen und Mustern", "ids": ["F129"]},
            ],
            # Emotional-soziale Entwicklung (derzeit mit fiktiven Beispielwerten, siehe „beispieldaten“)
            "ES-GEF": [
                {"text": "Gefühlskarten: eigene Stimmung beschreiben", "ids": ["F164"]},
                {"text": "Stille-Post-Pantomime und Legespiel „Traurig, wütend oder froh?“", "ids": ["F133", "F139"]},
                {"text": "Zuhause: Bilderbücher vorlesen und über Gefühle sprechen", "ids": ["F154"]},
            ],
            "ES-REG": [
                {"text": "Bei Impulsdurchbrüchen: unaufgeregter Umgang (12 Verhaltensweisen)", "ids": ["F174"]},
                {"text": "Gespräch über Schulregeln", "ids": ["F136"]},
                {"text": "Zuhause: verlässlicher Tagesablauf, Mediennutzung begleiten", "ids": ["F152"]},
            ],
            "ES-KOOP": [
                {"text": "Keiner geht über Bord, Heinzeln, Die freundlichen 10 Minuten", "ids": ["F149", "F148", "F147"]},
                {"text": "Matten und Reifen zur Trommel", "ids": ["F135"]},
                {"text": "Zuhause: Rollen-, Gesellschafts- und Sportspiele", "ids": ["F153"]},
            ],
            "ES-KONF": [
                {"text": "Kooperative Spiele, Tischspiele und Gemeinschaftsprojekte", "ids": ["F165"]},
                {"text": "Ideensammlung „Die 50 besten Spiele zum Umgang mit Konflikten“", "ids": ["F138"]},
                {"text": "Zuhause: zugewandt und konsequent Grenzen setzen", "ids": ["F151"]},
            ],
        },
    },
    # Klasse 1–4: Gerüst ohne Inhalte. Zum Aktivieren: Bereiche eintragen,
    # Datendatei nach Schuldatenblaetter/<ordner>/ und Material nach
    # Foerdermaterial/<ordner>/ legen (siehe LIESMICH.md dort).
    {
        "id": "K1", "label": "Klasse 1", "ordner": "01_Klasse1", "datei": "klasse1_schueler.csv",
        "eyebrow": "Lernstand Jahrgangsstufe 1", "frage": "Lernstand der Schüler*innen in Klasse 1",
        "faecher": ["MA", "DE", "ES"], "bereiche": [], "luecken_ab": 3,
        "schulbesuchsjahr": True, "massnahmen": {},
    },
    {
        "id": "K2", "label": "Klasse 2", "ordner": "02_Klasse2", "datei": "klasse2_schueler.csv",
        "eyebrow": "Lernstand Jahrgangsstufe 2", "frage": "Lernstand der Schüler*innen in Klasse 2",
        "faecher": ["MA", "DE", "ES"], "bereiche": [], "luecken_ab": 3,
        "schulbesuchsjahr": True, "massnahmen": {},
    },
    # Klasse 3 und 4 nutzen zusätzlich den gemeinsamen Ordner 34_Klasse3und4.
    {
        "id": "K3", "label": "Klasse 3", "ordner": "03_Klasse3", "datei": "klasse3_schueler.csv",
        "material": ["03_Klasse3", "34_Klasse3und4"],
        "eyebrow": "Lernstand Jahrgangsstufe 3", "frage": "Lernstand der Schüler*innen in Klasse 3",
        "faecher": ["MA", "DE", "ES"], "bereiche": [], "luecken_ab": 3,
        "schulbesuchsjahr": False, "massnahmen": MASSNAHMEN_K34,
    },
    {
        "id": "K4", "label": "Klasse 4", "ordner": "04_Klasse4", "datei": "klasse4_schueler.csv",
        "material": ["04_Klasse4", "34_Klasse3und4"],
        "eyebrow": "Lernstand Jahrgangsstufe 4", "frage": "Lernstand der Schüler*innen in Klasse 4",
        "faecher": ["MA", "DE", "ES"],
        # TESTDATEN: Schuldatenblaetter/04_Klasse4/klasse4_schueler.csv ist fiktiv (Schule „TEST (fiktiv)“).
        # Bereiche und Spalten wie im Blatt „Kompetenzen“ von TEST_Schuldatenblatt_Klasse4_fiktiv.xlsx.
        "bereiche": [
            {"id": "K34-M-ZAHL", "spalte": "mathe_zahl_stellenwert"},
            {"id": "K34-M-OP", "spalte": "mathe_operationen_rechnen"},
            {"id": "K34-M-RAUM", "spalte": "mathe_raum_form"},
            {"id": "K34-M-GROE", "spalte": "mathe_groessen_daten"},
            {"id": "K34-D-SPRECH", "spalte": "deutsch_sprechen_zuhoeren"},
            {"id": "K34-D-LESEN", "spalte": "deutsch_lesen"},
            {"id": "K34-D-SCHREIB", "spalte": "deutsch_texte_schreiben"},
            {"id": "K34-D-RECHT", "spalte": "deutsch_rechtschreiben"},
            {"id": "ES-GEF", "spalte": "es_gefuehle"},
            {"id": "ES-REG", "spalte": "es_selbstregulation_regeln"},
            {"id": "ES-KOOP", "spalte": "es_kontakt_kooperation"},
            {"id": "ES-KONF", "spalte": "es_konflikte_selbstbehauptung"},
        ],
        # Alle Werte sind ausgedacht → Kennzeichnung „Beispieldaten (fiktiv)“. Mit echten Daten löschen.
        "beispieldaten": ["MA", "DE", "ES"],
        "luecken_ab": 3,
        "schulbesuchsjahr": False, "massnahmen": MASSNAHMEN_K34,
    },
]

# ---------------------------------------------------------------------------
# Beschriftungen
# ---------------------------------------------------------------------------
TYP_LABEL = {
    "Uebung-Beispiel": "Übung (Beispiel)",
    "Uebung-Schulalltag": "Übung Schulalltag",
    "Konzept": "Konzept",
    "Spiel-Paket": "Spiel im Paket",
    "Buch-Paket": "Buch im Paket",
    "Spiel-Anschaffung": "Spiel-Anschaffung",
    "Buch-Anschaffung": "Buch-Anschaffung",
    "Elternidee": "Elternidee",
    "Link": "Link",
    "Handlungsleitfaden": "Handlungsleitfaden",  # Vorgehen für Lehrkräfte
    "Lernaufgabe": "Lernaufgabe",                # Projekt/Lernaufgabe mit Alltagsbezug (Kl. 3/4)
}
TYPEN_ANSCHAFFUNG = ["Spiel-Anschaffung", "Buch-Anschaffung"]

SETTINGS = [
    {"id": "Schule", "label": "Unterricht/Schulalltag"},
    {"id": "Kleingruppe/Einzel", "label": "Kleingruppe/Materialbox"},
    {"id": "Zuhause", "label": "Zuhause/Eltern"},
]

# Fußzeile: Erklärung der Kürzel und Hinweis (die Quellen selbst kommen aus der jeweiligen Stufe)
FUSS_KUERZEL = "S. = Seite, F = Feld im Faltflyer (von links gezählt)"
FUSS_HINWEIS = "Handout nur für den internen Gebrauch an den Grundschulen des Oberbergischen Kreises"
