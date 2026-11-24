"""Erzeugt data.js für das Förderportal.

Liest die Einstellungen aus konfiguration.py und dann je Stufe aus den beiden
Stufen-Ordnern (Semikolon, UTF-8):
- Schuldatenblaetter/<ordner>/<datei>          eine Zeile pro Kind
- Foerderportal/Foerdermaterial/<ordner>/      foerderkatalog.csv, quellen.csv,
                                               feldueberschriften.csv, Quellen/*.pdf
und schreibt data.js (window.DATA = {...}). Jede Stufe bekommt nur ihren
eigenen Katalog und ihre eigenen Quellen. Nur Standardbibliothek.

Datenschutz: Kinder-Codes (id_familienname, id_vorname) und Lehrkraftnamen
werden NICHT übernommen. Pro Kind bleiben nur Klasse, die Bereichswerte
und ggf. das Schulbesuchsjahr.

Aufruf:  python build_data.py
"""

import csv
import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import quote

sys.dont_write_bytecode = True  # keinen __pycache__-Ordner anlegen
import konfiguration as K  # noqa: E402

BASE = Path(__file__).resolve().parent
OUT = BASE / "data.js"
URL_RE = re.compile(r"^https?://\S+$")


def fehler(text):
    sys.exit("FEHLER: " + text)


def read_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f, delimiter=";"))


def erste_seite(seite):
    m = re.match(r"\s*(\d+)", seite or "")
    return int(m.group(1)) if m else 1


def material_ordner(name):
    return BASE / K.MATERIAL_ORDNER / name


def materialien(s):
    """Materialordner einer Stufe: der eigene Ordner plus ggf. gemeinsame Ordner (`material`)."""
    return s.get("material") or [s["ordner"]]


def daten_datei(s):
    return (BASE / K.SCHULDATEN_ORDNER / s["ordner"] / s["datei"]).resolve()


def anzeige(pfad):
    """Pfad relativ zum Projektordner für Meldungen."""
    try:
        return str(Path(pfad).resolve().relative_to(BASE.parent))
    except ValueError:
        return str(pfad)


# ---------------------------------------------------------------------------
# Konfiguration prüfen
# ---------------------------------------------------------------------------
def pruefe_konfiguration():
    fach_ids = [f["id"] for f in K.FAECHER]
    if len(set(fach_ids)) != len(fach_ids):
        fehler("Fach-IDs in FAECHER sind nicht eindeutig.")
    bereiche = {}
    for b in K.BEREICHE:
        if b["id"] in bereiche:
            fehler(f"Bereich {b['id']} ist doppelt angelegt.")
        if b["fach"] not in fach_ids:
            fehler(f"Bereich {b['id']}: unbekanntes Fach '{b['fach']}'.")
        if b["id"] in K.ZUSATZBEREICHE:
            fehler(f"{b['id']} ist zugleich Bereich und Zusatzbereich.")
        bereiche[b["id"]] = b
    for feld in ("id", "ordner"):
        werte = [s[feld] for s in K.STUFEN]
        if len(set(werte)) != len(werte):
            fehler(f"'{feld}' in STUFEN ist nicht eindeutig.")
    for s in K.STUFEN:
        for f in s["faecher"]:
            if f not in fach_ids:
                fehler(f"Stufe {s['id']}: unbekanntes Fach '{f}'.")
        ids = [b["id"] for b in s["bereiche"]]
        for bid in ids:
            if bid not in bereiche:
                fehler(f"Stufe {s['id']}: Bereich '{bid}' fehlt in BEREICHE.")
            if bereiche[bid]["fach"] not in s["faecher"]:
                fehler(f"Stufe {s['id']}: Fach von Bereich '{bid}' fehlt in 'faecher'.")
        for bid in s.get("gleichstand", []):
            if bid not in ids:
                fehler(f"Stufe {s['id']}: '{bid}' in 'gleichstand' ist kein Bereich dieser Stufe.")
        for f in s.get("beispieldaten", []):
            if f not in s["faecher"]:
                fehler(f"Stufe {s['id']}: Fach '{f}' in 'beispieldaten' fehlt in 'faecher'.")
        for bid in s.get("massnahmen", {}):
            if bid not in bereiche:
                fehler(f"Stufe {s['id']}: Maßnahmen für '{bid}', der in BEREICHE fehlt.")
            if bereiche[bid]["fach"] not in s["faecher"]:
                fehler(f"Stufe {s['id']}: Maßnahmen für '{bid}', dessen Fach in 'faecher' fehlt.")
    return bereiche


# ---------------------------------------------------------------------------
# Material je Stufe: Quellen, Feldüberschriften, Förderkatalog
# ---------------------------------------------------------------------------
def lade_quellen(ordner):
    """quellen.csv → {Kürzel: {"titel", "teile": [{"href", "von", "bis"}]}}.
    Mehrere Zeilen mit gleichem Kürzel = mehrere Auszüge einer Quelle
    (von/bis = gedruckte Seitenzahlen). Ohne von/bis: PDF-Seite = gedruckte Seite."""
    pfad = material_ordner(ordner) / K.QUELLEN_DATEI
    if not pfad.exists():
        return {}
    quellen = {}
    for nr, r in enumerate(read_csv(pfad), start=2):
        qid, titel, datei = r["kuerzel"].strip(), r["titel"].strip(), r["datei"].strip()
        pdf = material_ordner(ordner) / K.PDF_UNTERORDNER / datei
        if not pdf.exists():
            fehler(f"{anzeige(pfad)}, Zeile {nr}: PDF fehlt: {anzeige(pdf)}")
        von, bis = (r.get("von") or "").strip(), (r.get("bis") or "").strip()
        q = quellen.setdefault(qid, {"titel": titel, "teile": []})
        if q["titel"] != titel:
            fehler(f"{anzeige(pfad)}: Quelle {qid} hat unterschiedliche Titel.")
        q["teile"].append({
            "href": "/".join([K.MATERIAL_ORDNER, ordner, K.PDF_UNTERORDNER, quote(datei)]),
            "von": int(von) if von else None,
            "bis": int(bis) if bis else None,
        })
    return quellen


def lade_felder(ordner):
    pfad = material_ordner(ordner) / K.FELDER_DATEI
    if not pfad.exists():
        return {}
    return {(r["kuerzel"].strip(), int(r["seite"]), int(r["feld"])): r["ueberschrift"].strip()
            for r in read_csv(pfad)}


def pdf_link(quellen, qid, seite):
    """Link auf die PDF-Seite zur gedruckten Seitenzahl; wählt bei Auszügen den passenden."""
    for t in quellen[qid]["teile"]:
        if t["von"] is None:
            return f"{t['href']}#page={seite}"
        if t["von"] <= seite <= t["bis"]:
            return f"{t['href']}#page={seite - t['von'] + 1}"
    vorhanden = ", ".join(f"{t['von']}–{t['bis']}" for t in quellen[qid]["teile"])
    fehler(f"{qid}: Seite {seite} liegt in keinem vorhandenen Auszug (vorhanden: S. {vorhanden}).")


def build_katalog(s, bereiche):
    """Förderkatalog einer Stufe aus allen ihren Materialordnern. Kürzel und IDs
    müssen über diese Ordner hinweg eindeutig sein. Die optionale Katalogspalte
    `stufen` (z. B. „K3“) beschränkt einen Eintrag auf diese Stufen – gedacht
    für gemeinsame Ordner mehrerer Stufen."""
    alle_quellen, eintraege, ids = {}, [], set()
    stufen_ids = {x["id"] for x in K.STUFEN}
    for ordner in materialien(s):
        if not material_ordner(ordner).is_dir():
            fehler(f"Stufe {s['id']}: Materialordner {K.MATERIAL_ORDNER}/{ordner} fehlt.")
        pfad = material_ordner(ordner) / K.KATALOG_DATEI
        if not pfad.exists():
            continue
        quellen, felder = lade_quellen(ordner), lade_felder(ordner)
        for qid in quellen:
            if qid in alle_quellen:
                fehler(f"Stufe {s['id']}: Quellen-Kürzel {qid} kommt in mehreren Materialordnern vor.")
        alle_quellen.update(quellen)
        neu, neu_ids = _katalog_datei(s, pfad, quellen, felder, bereiche, stufen_ids)
        doppelt = ids & neu_ids
        if doppelt:
            fehler(f"Stufe {s['id']}: Katalog-ID(s) {', '.join(sorted(doppelt))} kommen in mehreren Materialordnern vor.")
        ids |= neu_ids
        eintraege += neu
    return eintraege, {qid: {"titel": q["titel"]} for qid, q in alle_quellen.items()}


def _katalog_datei(s, pfad, quellen, felder, bereiche, stufen_ids):
    setting_ids = [st["id"] for st in K.SETTINGS]
    eintraege, ids = [], set()
    for r in read_csv(pfad):
        eid = r["id"].strip()
        wo = f"{anzeige(pfad)}, {eid}"
        if eid in ids:
            fehler(f"{wo}: ID kommt doppelt vor.")
        ids.add(eid)
        nur = [x.strip() for x in (r.get("stufen") or "").split("|") if x.strip()]
        for x in nur:
            if x not in stufen_ids:
                fehler(f"{wo}: unbekannte Stufe '{x}' in Spalte stufen.")
        if nur and s["id"] not in nur:
            continue
        qid = r["quelle_id"].strip()
        if qid not in quellen:
            fehler(f"{wo}: Quelle '{qid}' fehlt in {K.QUELLEN_DATEI} dieser Stufe.")
        seite = r["seite"].strip()
        feld = (r.get("feld") or "").strip()
        page = erste_seite(seite)
        e = {
            "id": eid,
            "q": qid,
            "seite": seite,
            "href": pdf_link(quellen, qid, page),
            "kurz": f"{qid} · S. {seite}" + (f" · F{feld}" if feld else ""),
            "fundstelle": r["fundstelle"].strip(),
            "bereiche": [b.strip() for b in r["bereiche"].split("|") if b.strip()],
            "teil": r["teilfaehigkeit"].strip(),
            "typ": r["typ"].strip(),
            "name": r["name"].strip(),
            "text": r["wofuer_beschreibung"].strip(),
            "setting": r["setting"].strip(),
        }
        for bid in e["bereiche"]:
            if bid not in bereiche and bid not in K.ZUSATZBEREICHE:
                fehler(f"{wo}: Bereich '{bid}' ist weder in BEREICHE noch in ZUSATZBEREICHE angelegt.")
        if feld:
            ueberschrift = felder.get((qid, page, int(feld)))
            if not ueberschrift:
                fehler(f"{wo}: keine Feldüberschrift für {qid} S. {page} F{feld} in {K.FELDER_DATEI}.")
            e["feldTitel"] = f"Feld {feld}: {ueberschrift}"
        # Externe URL (Typ „Link“): steht die URL allein in der Beschreibung, wird sie zum Link
        if URL_RE.match(e["text"]):
            e["url"] = e["text"]
            e["text"] = ""
        if e["setting"] not in setting_ids:
            fehler(f"{wo}: unbekanntes Setting '{e['setting']}'.")
        eintraege.append(e)
    return eintraege, ids


# ---------------------------------------------------------------------------
# Daten je Stufe
# ---------------------------------------------------------------------------
def build_stufe(s, bereiche):
    katalog, quellen = build_katalog(s, bereiche)
    stufe = {
        "id": s["id"],
        "label": s["label"],
        "eyebrow": s["eyebrow"],
        "frage": s["frage"],
        "faecher": s["faecher"],
        "bereiche": [b["id"] for b in s["bereiche"]],
        "gleichstand": s.get("gleichstand") or [b["id"] for b in s["bereiche"]],
        "lueckenAb": s.get("luecken_ab", 3),
        "sbj": bool(s.get("schulbesuchsjahr")),
        "lernausgangslage": bool(s.get("lernausgangslage")),
        "beispieldaten": list(s.get("beispieldaten", [])),
        "massnahmen": s.get("massnahmen", {}),
        "katalog": katalog,
        "quellen": quellen,
        "hatDaten": False,
        "stand": None,
        "schule": "",
        "klassen": [],
        "kinder": [],
    }
    # Vorschau: Fächer ohne erhobene Bereiche, deren Bereiche im Katalog dieser Stufe vorkommen.
    # Ohne Datendatei gilt kein Fach als erhoben (Materialansicht), auch wenn Bereiche eingetragen sind.
    def setze_vorschau(mit_daten):
        erhoben = {bereiche[bid]["fach"] for bid in stufe["bereiche"]} if mit_daten else set()
        im_katalog = {bid for e in katalog for bid in e["bereiche"]}
        stufe["vorschau"] = [b["id"] for b in K.BEREICHE
                             if b["fach"] in s["faecher"] and b["fach"] not in erhoben and b["id"] in im_katalog]
    setze_vorschau(False)

    ids = {e["id"] for e in katalog}
    for liste in stufe["massnahmen"].values():
        for m in liste:
            for i in m["ids"]:
                if i not in ids:
                    fehler(f"Stufe {s['id']}: Maßnahme '{m['text']}' verweist auf {i}, "
                           f"das im Förderkatalog dieser Stufe fehlt.")

    pfad = daten_datei(s)
    if not pfad.exists():
        return stufe
    if not s["bereiche"]:
        fehler(f"Für Stufe {s['id']} liegt {anzeige(pfad)} vor, aber in konfiguration.py sind noch keine Bereiche eingetragen.")
    rows = read_csv(pfad)
    if not rows:
        return stufe
    spalten = set(rows[0].keys())
    pflicht = ["klasse"] + [b["spalte"] for b in s["bereiche"]]
    if stufe["sbj"]:
        pflicht.append("schulbesuchsjahr")
    fehlend = [p for p in pflicht if p not in spalten]
    if fehlend:
        fehler(f"{anzeige(pfad)}: Spalte(n) fehlen: {', '.join(fehlend)}")

    kinder = []
    for nr, r in enumerate(rows, start=2):
        werte = []
        for b in s["bereiche"]:
            v = (r.get(b["spalte"]) or "").strip()
            if v not in ("0", "1"):
                fehler(f"{anzeige(pfad)}, Zeile {nr}: ungültiger Wert '{v}' in Spalte {b['spalte']} (erlaubt: 0 oder 1)")
            werte.append(int(v))
        sbj = (r.get("schulbesuchsjahr") or "").strip() if stufe["sbj"] else ""
        kinder.append({
            "k": r["klasse"].strip(),
            "w": werte,  # Reihenfolge wie stufe["bereiche"]
            "sbj": int(sbj) if sbj.isdigit() else None,
        })
    setze_vorschau(True)
    stufe.update({
        "hatDaten": True,
        "stand": date.fromtimestamp(pfad.stat().st_mtime).isoformat(),
        "schule": (rows[0].get("schule") or "").strip(),
        "klassen": sorted({k["k"] for k in kinder}),
        "kinder": kinder,
    })
    return stufe


def bericht(s, k, bereiche):
    print(f"{s['label']}  [Material: {' + '.join(materialien(k))}]")
    print(f"  Material: {len(s['katalog'])} Einträge, Quellen {', '.join(s['quellen']) or '–'}")
    if s["beispieldaten"]:
        print(f"  ACHTUNG Beispieldaten (fiktiv) für Fach: {', '.join(s['beispieldaten'])}")
    if s["vorschau"]:
        print(f"  Vorschau (noch nicht erhoben): {', '.join(s['vorschau'])}")
    if not s["hatDaten"]:
        print(f"  Daten: keine ({anzeige(daten_datei(k))} fehlt)")
        return
    kinder = s["kinder"]
    n = len(kinder)
    alle = sum(1 for x in kinder if all(x["w"]))
    luecken = sum(1 for x in kinder if x["w"].count(0) >= s["lueckenAb"])
    zeile = (f"  Daten: {n} Kinder; {alle} alle gesichert ({round(alle / n * 100)} %); "
             f"{n - alle} mit Förderbedarf; {luecken} mit Lücken in ≥ {s['lueckenAb']} Bereichen")
    if s["sbj"]:
        zeile += f"; {sum(1 for x in kinder if x['sbj'] == 2)} im 2. Schulbesuchsjahr"
    print(zeile)
    for i, bid in enumerate(s["bereiche"]):
        print(f"    gesichert {bereiche[bid]['name']}: {sum(x['w'][i] for x in kinder)}")
    if not s["katalog"]:
        print("  HINWEIS: Daten vorhanden, aber kein Förderkatalog in diesem Ordner.")


def main():
    try:  # Windows-Konsole: Sonderzeichen wie „≥“ nicht abstürzen lassen
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass
    bereiche = pruefe_konfiguration()
    stufen = [build_stufe(s, bereiche) for s in K.STUFEN]
    for s, k in zip(stufen, K.STUFEN):
        bericht(s, k, bereiche)
    if not any(s["hatDaten"] for s in stufen):
        print("Hinweis: Für keine Stufe liegen Daten vor.")

    data = {
        "faecher": K.FAECHER,
        "bereiche": [
            {"id": b["id"], "name": b["name"], "kurz": b["kurz"], "fach": b["fach"],
             "satz": b.get("satz", b["name"]), "kopf": b.get("kopf", b["name"])}
            for b in K.BEREICHE
        ],
        "stufen": stufen,
        "zusatzbereiche": K.ZUSATZBEREICHE,
        "typLabel": K.TYP_LABEL,
        "typenAnschaffung": K.TYPEN_ANSCHAFFUNG,
        "settings": K.SETTINGS,
        "fussKuerzel": K.FUSS_KUERZEL,
        "fussHinweis": K.FUSS_HINWEIS,
    }
    js = ("// Automatisch erzeugt von build_data.py – nicht von Hand bearbeiten.\n"
          "window.DATA = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    OUT.write_text(js, encoding="utf-8")
    print(f"geschrieben: {OUT.name} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
