/* Förderportal – Logik (ohne Frameworks, läuft offline)
   Stufen, Fächer und Bereiche kommen aus data.js (erzeugt aus konfiguration.py). */
(function () {
  "use strict";

  var D = window.DATA;
  if (!D || !D.stufen) {
    document.getElementById("main").innerHTML =
      '<p class="karte">data.js fehlt oder ist veraltet. Bitte <code>python build_data.py</code> ausführen.</p>';
    return;
  }

  var JAHRGANG = "Jahrgang";
  var REG = {};                                    // alle Bereiche nach ID
  D.bereiche.forEach(function (b) { REG[b.id] = b; });
  var FACH = {};
  D.faecher.forEach(function (f) { FACH[f.id] = f; });

  // Zustand: aktuelle Stufe und Auswahl (Jahrgang oder Klasse)
  var ST = null;          // aktuelle Stufe
  var BEREICHE = [];      // Bereichs-Objekte der Stufe, Reihenfolge = Werte je Kind
  var IDX = {};           // Bereichs-ID → Index in BEREICHE
  var VORSCHAU = {};      // Bereichs-IDs von Fächern, die in dieser Stufe noch nicht erhoben werden
  var state = { sel: JAHRGANG };

  /* ---------- Hilfsfunktionen ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pct(teil, ganz) { return ganz ? Math.round(teil / ganz * 100) : 0; }
  function pctTxt(teil, ganz) { return pct(teil, ganz) + " %"; }
  function kinderText(n) { return n === 1 ? "1 Kind" : n + " Kinder"; }
  function kindWort(n) { return n === 1 ? "Kind" : "Kinder"; }
  function selName(sel) { return sel === JAHRGANG ? "Jahrgang" : "Klasse " + sel; }

  function stufeById(id) {
    for (var i = 0; i < D.stufen.length; i++) if (D.stufen[i].id === id) return D.stufen[i];
    return null;
  }

  // Wählbar ist eine Stufe mit Schuldaten – oder ohne Daten, aber mit Fördermaterial (Materialansicht)
  function waehlbar(s) { return s.hatDaten || (s.katalog && s.katalog.length > 0); }

  function setzeStufe(id) {
    var s = stufeById(id);
    if (!s || !waehlbar(s)) return false;
    ST = s;
    // ohne Schuldaten keine erhobenen Bereiche – alles läuft über die Vorschau
    BEREICHE = s.hatDaten ? s.bereiche.map(function (bid) { return REG[bid]; }) : [];
    IDX = {};
    BEREICHE.forEach(function (b, i) { IDX[b.id] = i; });
    VORSCHAU = {};
    (s.vorschau || []).forEach(function (bid) { VORSCHAU[bid] = true; });
    state.sel = JAHRGANG;
    return true;
  }

  function kinderFuer(sel) {
    return sel === JAHRGANG ? ST.kinder : ST.kinder.filter(function (k) { return k.k === sel; });
  }

  function statistik(kinder) {
    var n = BEREICHE.length;
    var s = {
      n: kinder.length, alle: 0, luecken: 0, sbj2: 0, sbjFehlt: 0,
      gesichert: BEREICHE.map(function () { return 0; }),
      offen: BEREICHE.map(function () { return 0; }),
      verteilung: [0, 0, 0, 0] // 0 / 1 / 2 / ≥ 3 offen
    };
    kinder.forEach(function (k) {
      var offen = 0;
      k.w.forEach(function (v, i) {
        if (v === 1) s.gesichert[i]++; else { s.offen[i]++; offen++; }
      });
      if (offen === 0) s.alle++;
      if (offen >= ST.lueckenAb) s.luecken++;
      s.verteilung[Math.min(offen, 3)]++;
      if (k.sbj === null) s.sbjFehlt++;
      else if (k.sbj === 2) s.sbj2++;
    });
    s.bedarf = s.n - s.alle;
    s.nBereiche = n;
    return s;
  }

  // Klassen, in denen das Schulbesuchsjahr fehlt
  function klassenOhneSbj(kinder) {
    var info = {};
    kinder.forEach(function (k) {
      info[k.k] = info[k.k] || { alle: 0, fehlt: 0 };
      info[k.k].alle++;
      if (k.sbj === null) info[k.k].fehlt++;
    });
    return Object.keys(info).filter(function (k) { return info[k].fehlt > 0; }).sort();
  }

  // Gruppen für „Förderbedarf je Klasse“: 0, 1, 2, ≥ 3 offene Bereiche (nur die, die vorkommen können)
  function bedarfsGruppen() {
    var n = BEREICHE.length;
    var g = [
      { cls: "seg-ok", sw: "sw-ok", text: "alle gesichert" },
      { cls: "seg-o1", sw: "sw-o1", text: "1 Bereich offen" },
      { cls: "seg-o2", sw: "sw-o2", text: "2 Bereiche offen" },
      { cls: "seg-o3", sw: "sw-o3", text: n > 3 ? "3–" + n + " Bereiche offen" : "3 Bereiche offen" }
    ];
    return g.slice(0, Math.min(n, 3) + 1);
  }

  function katalogEintrag(id) {
    // nur im Katalog der gewählten Stufe suchen
    for (var i = 0; i < ST.katalog.length; i++) if (ST.katalog[i].id === id) return ST.katalog[i];
    return null;
  }

  function linkTitel(e) {
    var q = ST.quellen[e.q];
    var t = e.q + " " + q.titel + ", S. " + e.seite;
    if (e.feldTitel) t += " · " + e.feldTitel;
    else t = e.fundstelle;
    return t + " (öffnet PDF in neuem Tab)";
  }

  /* ---------- Kopf, Stufen & Auswahl ---------- */
  function renderStufen() {
    $("stufen").innerHTML = D.stufen.map(function (s) {
      var aktiv = ST && ST.id === s.id;
      if (!waehlbar(s)) {
        return '<button type="button" disabled title="' + esc(s.label) + ': noch keine Daten">' + esc(s.label) +
          '<span class="sr"> (noch keine Daten)</span></button>';
      }
      if (!s.hatDaten) {
        return '<button type="button" class="nur-material" data-stufe="' + esc(s.id) + '" aria-pressed="' + aktiv +
          '" title="' + esc(s.label) + ': noch keine Schuldaten, nur Fördermaterial">' + esc(s.label) +
          '<span class="stufe-zusatz" aria-hidden="true">Material</span><span class="sr"> (nur Fördermaterial)</span></button>';
      }
      return '<button type="button" data-stufe="' + esc(s.id) + '" aria-pressed="' + aktiv + '">' + esc(s.label) + "</button>";
    }).join("");
  }

  function renderKopf() {
    var monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
      "September", "Oktober", "November", "Dezember"];
    $("eyebrow").textContent = ST.eyebrow + (ST.schule ? " · Grundschule " + ST.schule : "");
    $("frage").textContent = ST.hatDaten ? ST.frage : "Fördermaterial " + ST.label;
    document.title = "Förderportal " + ST.label;
    if (ST.hatDaten) {
      var d = new Date(ST.stand + "T12:00:00");
      var stand = isNaN(d) ? ST.stand : monate[d.getMonth()] + " " + d.getFullYear();
      $("kopf-meta").innerHTML =
        "<strong>" + ST.kinder.length + " Kinder · " + ST.klassen.length + " Klassen</strong>" +
        "Erhebung der Lehrkräfte · Stand " + esc(stand) +
        (ST.beispieldaten && ST.beispieldaten.length
          ? '<span class="meta-beispiel">' + esc(beispielHinweisKopf()) + "</span>" : "");
    } else {
      $("kopf-meta").innerHTML = "<strong>" + ST.katalog.length + " Materialien</strong>noch keine Schuldaten";
    }
    // Auswahl Jahrgang/Klasse nur, wenn Schuldaten vorliegen
    $("auswahl").parentNode.hidden = !ST.hatDaten;
    $("auswahl").innerHTML = ST.hatDaten ? [JAHRGANG].concat(ST.klassen).map(function (k) {
      return '<button type="button" data-sel="' + esc(k) + '" aria-pressed="false">' + esc(k) + "</button>";
    }).join("") : "";
    renderStufen();
    renderFuss();
  }

  function renderFuss() {  // Quellen der gewählten Stufe
    var quellen = ST ? ST.quellen : {};
    var q = Object.keys(quellen).map(function (k) { return esc(k + " " + quellen[k].titel); }).join(" · ") || "–";
    $("fuss").innerHTML = "<p><strong>Quellen:</strong> " + q + (D.fussKuerzel ? " · " + esc(D.fussKuerzel) : "") + "</p>" +
      (D.fussHinweis ? "<p>" + esc(D.fussHinweis) + "</p>" : "");
  }

  /* ---------- Kacheln ---------- */
  function renderKacheln(kinder, s) {
    var n = s.nBereiche;
    var html =
      '<div class="kachel kachel-haupt"><span class="kachel-zahl">' + pct(s.alle, s.n) + '<small>%</small></span>' +
        '<div><p class="kachel-titel">' + (n === 1 ? "Bereich gesichert" : "alle Bereiche gesichert") + "</p>" +
        '<p class="kachel-text">' + s.alle + " von " + s.n + " Kindern" +
          (ST.lernausgangslage ? (s.alle === 1 ? " startet" : " starten") : "") + " ohne Lücke</p>" +
          (ST.beispieldaten && ST.beispieldaten.length
            ? '<p class="kachel-text kachel-beispiel">' + esc(beispielHinweisKachel()) + "</p>" : "") +
          "</div></div>" +
      '<div class="kachel"><span class="kachel-zahl">' + s.bedarf + "</span>" +
        '<div><p class="kachel-titel">' + kindWort(s.bedarf) + ' mit Förderbedarf</p>' +
        '<p class="kachel-text">mindestens ein Bereich noch nicht gesichert</p></div></div>';
    if (n >= ST.lueckenAb && ST.lueckenAb > 1) {
      html += '<div class="kachel"><span class="kachel-zahl">' + s.luecken + "</span>" +
        '<div><p class="kachel-titel">' + kindWort(s.luecken) + " mit Lücken in ≥ " + ST.lueckenAb + " Bereichen</p></div></div>";
    }
    if (ST.sbj) {
      var sbjZahl, sbjText = "";
      var ohne = klassenOhneSbj(kinder);
      if (s.sbjFehlt === s.n) {
        sbjZahl = '<span class="kachel-zahl leer">–</span>';
        sbjText = "keine Angabe";
      } else {
        sbjZahl = '<span class="kachel-zahl">' + s.sbj2 + "</span>";
        if (ohne.length) sbjText = ohne.join(", ") + ": keine Angabe";
      }
      html += '<div class="kachel">' + sbjZahl +
        '<div><p class="kachel-titel">' + (s.sbjFehlt === s.n ? "Kinder" : kindWort(s.sbj2)) + " im 2. Schulbesuchsjahr</p>" +
        (sbjText ? '<p class="kachel-text">' + esc(sbjText) + "</p>" : "") + "</div></div>";
    }
    $("kacheln").innerHTML = html;
  }

  /* ---------- Fächer & Platzhalter ---------- */
  function fachStil(fid) { return ' style="--fach:' + esc(FACH[fid].farbe || "#5d7393") + '"'; }
  function bereicheImFach(fid) {
    return BEREICHE.filter(function (b) { return b.fach === fid; });
  }
  // Fach ohne Daten in dieser Stufe, aber mit angelegten Bereichen: Materialien schon abrufbar
  // (welche das sind, legt build_data.py je Stufe anhand ihres Förderkatalogs fest)
  function vorschauImFach(fid) {
    return D.bereiche.filter(function (b) { return b.fach === fid && VORSCHAU[b.id]; });
  }
  var TAG_PLATZHALTER = '<span class="tag-platzhalter">Platzhalter</span>';
  var TAG_VORSCHAU = '<span class="tag-platzhalter">noch nicht erhoben</span>';
  // Fächer mit ausgedachten Werten (konfiguration.py: „beispieldaten“)
  var TAG_BEISPIEL = '<span class="tag-platzhalter tag-beispiel">Beispieldaten (fiktiv)</span>';
  function istBeispiel(fid) { return !!(ST && ST.beispieldaten && ST.beispieldaten.indexOf(fid) >= 0); }
  function alleFiktiv() {   // alle erhobenen Fächer der Stufe sind Beispieldaten
    var erhoben = ST.faecher.filter(function (fid) { return bereicheImFach(fid).length; });
    return erhoben.length > 0 && erhoben.every(istBeispiel);
  }
  function beispielFaecherText(kurz) {
    return (ST.beispieldaten || []).map(function (fid) { return kurz ? (FACH[fid].kurz || FACH[fid].name) : FACH[fid].name; }).join(", ");
  }
  function beispielHinweisKopf() {
    return alleFiktiv() ? "Alle Werte: Beispieldaten (fiktiv)" : beispielFaecherText() + ": Beispieldaten (fiktiv)";
  }
  function beispielHinweisKachel() {
    return alleFiktiv() ? "Beispieldaten (fiktiv)" : "inkl. Beispieldaten " + beispielFaecherText(true);
  }

  /* ---------- Wie sicher sind die einzelnen Bereiche? ---------- */
  function renderBereiche(s) {
    if (ST.hatDaten) {
      $("h-bereiche").textContent = "Wie sicher sind die einzelnen Bereiche?";
      $("sub-bereiche").textContent = "Anteil der Kinder mit gesicherten Fähigkeiten · " +
        (state.sel === JAHRGANG ? "alle Klassen" : "Klasse " + state.sel) + " (n = " + s.n + ")";
    } else {
      $("h-bereiche").textContent = "Bereiche und Fördermaterial";
      $("sub-bereiche").textContent = "Noch keine Schuldaten · Bereich anklicken für Vorschläge und alle Materialien";
    }
    var html = "";
    ST.faecher.forEach(function (fid) {
      var leer = !bereicheImFach(fid).length, vorschau = vorschauImFach(fid);
      html += '<div class="fach-gruppe' + (leer ? " ist-platzhalter" : "") + '"' + fachStil(fid) + ">" +
        '<p class="fach">' + esc(FACH[fid].name) + (leer ? " " + (vorschau.length ? TAG_VORSCHAU : TAG_PLATZHALTER) : (istBeispiel(fid) ? " " + TAG_BEISPIEL : "")) + "</p>";
      if (vorschau.length) {
        html += vorschau.map(function (b) {
          return '<button type="button" class="bereich-zeile vorschau" data-bereich="' + b.id + '" aria-label="' +
            esc(b.name + ": noch nicht erhoben. Alle Materialien zu diesem Bereich öffnen") + '">' +
            '<span class="bereich-name">' + esc(b.name) + "</span>" +
            '<span class="balken" aria-hidden="true"><span class="seg seg-platzhalter seg-vorschau" style="flex-grow:1">' +
            "Materialien ansehen</span></span></button>";
        }).join("") + "</div>";
        return;
      }
      if (leer) {
        html += '<p class="sr">Für ' + esc(FACH[fid].name) + " sind noch keine Bereiche hinterlegt.</p>" +
          [1, 2].map(function () {
            return '<div class="bereich-zeile platzhalter" aria-hidden="true"><span class="bereich-name">Bereich folgt</span>' +
              '<span class="balken"><span class="seg seg-platzhalter" style="flex-grow:1"></span></span></div>';
          }).join("") + "</div>";
        return;
      }
      var zeilen = "";
      BEREICHE.forEach(function (b, i) {
        if (b.fach !== fid) return;
        var ges = s.gesichert[i], off = s.offen[i];
        var label = b.name + ": " + pctTxt(ges, s.n) + " gesichert, " + kinderText(off) +
          " nicht gesichert. Alle Materialien zu diesem Bereich öffnen";
        zeilen += '<button type="button" class="bereich-zeile" data-bereich="' + b.id + '" aria-label="' + esc(label) + '">' +
          '<span class="bereich-name">' + esc(b.name) + "</span>" +
          '<span class="balken" aria-hidden="true">' +
          (ges ? '<span class="seg seg-ok" style="flex-grow:' + ges + '">' + pctTxt(ges, s.n) + "</span>" : "") +
          (off ? '<span class="seg seg-offen" style="flex-grow:' + off + '">' + off + "</span>" : "") +
          "</span></button>";
      });
      html += zeilen + "</div>";
    });
    $("bereiche").innerHTML = html;
  }

  /* ---------- Klassenvergleich ---------- */
  function farbe(p) {
    var t = Math.max(0, Math.min(1, (p - 40) / 60));
    var a = [205, 224, 248], b = [18, 60, 135];
    var c = a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); });
    return { bg: "rgb(" + c.join(",") + ")", fg: t > 0.42 ? "#fff" : "#0d2b52" };
  }
  function zelle(teil, ganz, extra) {
    var p = pct(teil, ganz), f = farbe(p);
    return '<td class="' + (extra || "") + '" style="background:' + f.bg + ";color:" + f.fg + '">' + p + " %</td>";
  }
  function kopfHtml(b) { return esc(b.kopf).replace(/\n/g, "<br>"); }

  function renderVergleich() {
    // Spalten nach Fach gruppiert; ein Fach ohne Bereiche bekommt eine Platzhalter-Spalte
    var gruppen = ST.faecher.map(function (fid) { return { fid: fid, bereiche: bereicheImFach(fid) }; });
    var fachZeile = '<tr class="fach-kopf"><td></td>' + gruppen.map(function (g) {
      var leer = !g.bereiche.length;
      return '<th scope="colgroup" colspan="' + (leer ? 1 : g.bereiche.length) + '"' + fachStil(g.fid) +
        (leer ? ' class="platzhalter"' : "") + ' title="' + esc(FACH[g.fid].name + (istBeispiel(g.fid) ? ": Beispieldaten (fiktiv)" : "")) + '">' +
        esc(FACH[g.fid].kurz || FACH[g.fid].name) + (istBeispiel(g.fid) && !leer ? ' <span class="fiktiv">(fiktiv)</span>' : "") + "</th>";
    }).join("") + '<td class="trenner" aria-hidden="true"></td><td></td></tr>';
    var kopf = "<thead>" + fachZeile + "<tr><th scope=\"col\"><span class=\"sr\">Klasse</span></th>" +
      gruppen.map(function (g) {
        if (!g.bereiche.length) {
          return '<th scope="col" class="platzhalter">' + (vorschauImFach(g.fid).length ? "noch nicht<br>erhoben" : "Bereich<br>folgt") + "</th>";
        }
        return g.bereiche.map(function (b) {
          return '<th scope="col"><button type="button" data-bereich="' + b.id + '" title="' + esc(b.name) +
            ': alle Materialien öffnen">' + kopfHtml(b) + "</button></th>";
        }).join("");
      }).join("") +
      '<td class="trenner" aria-hidden="true"></td><th scope="col">Alle<br>gesichert</th></tr></thead>';

    var zeilen = ST.klassen.concat([JAHRGANG]).map(function (k) {
      var s = statistik(kinderFuer(k));
      var aktiv = state.sel === k;
      var name = k === JAHRGANG ? "Gesamt" : k;
      return '<tr class="' + (k === JAHRGANG ? "gesamt " : "") + (aktiv ? "aktiv" : "") + '">' +
        '<th scope="row"><button type="button" data-sel="' + esc(k) + '" aria-pressed="' + aktiv + '"' +
        (k === JAHRGANG ? "" : ' aria-label="Klasse ' + esc(k) + '"') + ">" +
        esc(name) + '<span class="n">n = ' + s.n + "</span></button></th>" +
        gruppen.map(function (g) {
          if (!g.bereiche.length) return '<td class="platzhalter-zelle"><span class="sr">keine Daten</span>–</td>';
          return g.bereiche.map(function (b) { return zelle(s.gesichert[IDX[b.id]], s.n); }).join("");
        }).join("") +
        '<td class="trenner" aria-hidden="true"></td>' + zelle(s.alle, s.n, "alle4") + "</tr>";
    }).join("");

    $("vergleich").innerHTML = '<div class="tab-wrap"><table class="vergleich">' +
      '<caption class="sr">Anteil gesichert je Klasse und Bereich in Prozent</caption>' +
      kopf + "<tbody>" + zeilen + "</tbody></table></div>";
  }

  /* ---------- Förderbedarf je Klasse ---------- */
  function renderBedarf() {
    var gruppen = bedarfsGruppen();
    $("legende-bedarf").innerHTML = gruppen.map(function (g) {
      return '<span><i class="sw ' + g.sw + '"></i>' + esc(g.text) + "</span>";
    }).join("");
    $("bedarf").innerHTML = ST.klassen.concat([JAHRGANG]).map(function (k) {
      var s = statistik(kinderFuer(k));
      var aktiv = state.sel === k;
      var name = k === JAHRGANG ? "Gesamt" : "Klasse " + k;
      var segs = gruppen.map(function (g, i) {
        var v = s.verteilung[i];
        if (!v) return "";
        return '<span class="seg seg-zentriert ' + g.cls + '" style="flex-grow:' + v + '" title="' +
          esc(g.text + ": " + kinderText(v)) + '">' + v + "</span>";
      }).join("");
      var sr = name + ": " + gruppen.map(function (g, i) { return g.text + " " + s.verteilung[i]; }).join(", ");
      return '<div class="bedarf-zeile' + (k === JAHRGANG ? " gesamt" : "") + (aktiv ? " aktiv" : "") + '">' +
        '<button type="button" class="klasse-knopf" data-sel="' + esc(k) + '" aria-pressed="' + aktiv + '">' + esc(name) + "</button>" +
        '<span class="balken" aria-hidden="true">' + segs + "</span>" +
        '<span class="sr">' + esc(sr) + "</span></div>";
    }).join("");
  }

  /* ---------- Förderprofile ---------- */
  function profilName(offeneIdx) {
    if (offeneIdx.length === BEREICHE.length && BEREICHE.length > 1) return "alle Bereiche offen";
    var namen = offeneIdx.map(function (i) { return BEREICHE[i].satz; });
    return offeneIdx.length === 1 ? "nur " + namen[0] : namen.join(" + ");
  }

  function profileFuer(kinder) {
    var map = {};
    kinder.forEach(function (k) {
      var offen = [];
      k.w.forEach(function (v, i) { if (v === 0) offen.push(i); });
      if (!offen.length) return;
      var key = offen.join(",");
      map[key] = map[key] || { offen: offen, n: 0 };
      map[key].n++;
    });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) {
      return b.n - a.n || a.offen.length - b.offen.length || a.offen.join().localeCompare(b.offen.join());
    });
  }

  function renderProfile(kinder, s) {
    $("h-profile").textContent = "Förderprofile der " + s.bedarf + " Kinder mit Förderbedarf" +
      (state.sel === JAHRGANG ? "" : " · Klasse " + state.sel);
    var profile = profileFuer(kinder);
    if (!profile.length) {
      $("profile").innerHTML = '<p class="leer-hinweis">In dieser Auswahl sind bei allen Kindern alle Bereiche gesichert.</p>';
      return;
    }
    var max = profile[0].n;
    var farben = ["", "var(--o1)", "var(--o2)", "var(--o3)"];
    var html = '<div class="profil-kopf" aria-hidden="true"><span>Kinder</span>' +
      BEREICHE.map(function (b) {
        return '<span class="profil-kurz" title="' + esc(b.name) + '"' + fachStil(b.fach) + ">" + esc(b.kurz) + "</span>";
      }).join("") +
      "<span></span><span></span></div>";
    html += profile.map(function (p) {
      var name = profilName(p.offen);
      var dots = BEREICHE.map(function (b, i) {
        var offen = p.offen.indexOf(i) >= 0;
        return '<span class="dot' + (offen ? " offen" : "") + '" title="' + esc(b.name + (offen ? ": nicht gesichert" : ": gesichert")) + '"></span>';
      }).join("");
      var label = kinderText(p.n) + ": " + name + ". Materialien für diese Bereiche öffnen";
      return '<button type="button" class="profil-zeile" data-profil="' + p.offen.join(",") + '" aria-label="' + esc(label) + '">' +
        '<span class="profil-anzahl">' + p.n + "</span>" + dots +
        '<span class="profil-name">' + esc(name) + "</span>" +
        '<span class="profil-bar" aria-hidden="true"><i style="width:' + Math.max(6, p.n / max * 100) + "%;background:" +
        farben[Math.min(p.offen.length, 3)] + '"></i></span></button>';
    }).join("");
    $("profile").style.setProperty("--n", BEREICHE.length);
    $("profile").innerHTML = html;
  }

  /* ---------- Maßnahmen: genau ein Vorschlag je Fach ---------- */
  function nachBedarf(x, y) {
    return y.offen - x.offen || ST.gleichstand.indexOf(x.b.id) - ST.gleichstand.indexOf(y.b.id);
  }
  // Je Fach der Bereich mit den meisten Kindern ohne gesicherten Bereich.
  // Reihenfolge der Vorschläge: nach Bedarf, Platzhalter-Fächer zuletzt.
  function vorschlaege(s) {
    return ST.faecher.map(function (fid, pos) {
      var kand = bereicheImFach(fid).map(function (b) { return { b: b, offen: s.offen[IDX[b.id]] }; }).sort(nachBedarf);
      return { fid: fid, pos: pos, top: kand[0] || null, weitere: kand.slice(1) };
    }).sort(function (x, y) {
      if (!x.top || !y.top) return (x.top ? 0 : 1) - (y.top ? 0 : 1) || x.pos - y.pos;
      return nachBedarf(x.top, y.top) || x.pos - y.pos;
    });
  }

  function fundstellenChips(ids) {
    var gesehen = {}, html = "";
    ids.forEach(function (id) {
      var e = katalogEintrag(id);
      if (!e || gesehen[e.kurz]) return;
      gesehen[e.kurz] = true;
      html += '<a class="chip" href="' + esc(e.href) + '" target="_blank" rel="noopener" title="' + esc(linkTitel(e)) + '">' +
        esc(e.kurz) + "</a>";
    });
    return html;
  }

  function platzhalterVorschlag(v, nr) {
    var f = FACH[v.fid];
    return '<section class="platz platz-platzhalter"' + fachStil(v.fid) + ' aria-label="Vorschlag ' + nr + ": " +
      esc(f.name) + ', Platzhalter">' +
      '<span class="platz-nr" aria-hidden="true">' + nr + "</span><div>" +
      '<p class="platz-fach"><span title="' + esc(f.name) + '">' + esc(f.kurz || f.name) + "</span> " + TAG_PLATZHALTER + "</p>" +
      "<h3>Bereich folgt</h3>" +
      '<div class="platz-wert"><strong>– Kinder</strong><span class="platz-bar" aria-hidden="true"></span><span>– %</span></div>' +
      '<ul class="mass-liste">' + D.settings.map(function (st) {
        return "<li>Maßnahme für " + esc(st.label) + " folgt</li>";
      }).join("") + "</ul></div></section>";
  }

  // Fach noch nicht erhoben: kein Ranking, aber Zugang zu den Materialien je Bereich
  function vorschauVorschlag(v, nr, bereiche) {
    var f = FACH[v.fid];
    return '<section class="platz platz-platzhalter platz-vorschau"' + fachStil(v.fid) + ' aria-label="Vorschlag ' + nr + ": " +
      esc(f.name) + ', noch nicht erhoben">' +
      '<span class="platz-nr" aria-hidden="true">' + nr + "</span><div>" +
      '<p class="platz-fach"><span title="' + esc(f.name) + '">' + esc(f.kurz || f.name) + "</span> " + TAG_VORSCHAU + "</p>" +
      "<h3>Materialien je Bereich</h3>" +
      '<p class="vorschau-text">Noch keine Daten, daher keine Rangfolge. Vorschläge und Materialien:</p>' +
      '<div class="vorschau-knoepfe">' + bereiche.map(function (b) {
        return '<button type="button" class="alle-knopf" data-bereich="' + b.id + '" title="Alle Materialien zu ' +
          esc(b.name) + '">' + esc(b.name) + "</button>";
      }).join("") + "</div></div></section>";
  }

  function renderMassnahmen(s) {
    $("sub-massnahmen").textContent = ST.hatDaten
      ? "Ein Vorschlag je Fach · " + selName(state.sel) + " · Platz 1 = meiste Kinder ohne gesicherten Bereich"
      : "Je Fach die Bereiche mit Vorschlägen · ohne Rangfolge, da noch keine Schuldaten vorliegen";
    var html = "", fussTeile = [];
    $("pdf-knopf").hidden = !ST.hatDaten;
    $("pdf-knopf-text").textContent = "Förderempfehlungen " + selName(state.sel) + " als PDF";
    if (!ST.hatDaten) {  // Materialansicht: je Fach ein Kasten, ohne Rangfolge und Fußnote
      ST.faecher.forEach(function (fid, i) {
        var vb = vorschauImFach(fid);
        html += vb.length ? vorschauVorschlag({ fid: fid }, i + 1, vb) : platzhalterVorschlag({ fid: fid }, i + 1);
      });
      $("massnahmen").innerHTML = html;
      return;
    }
    vorschlaege(s).forEach(function (v, i) {
      var nr = i + 1;
      if (!v.top) {
        var vb = vorschauImFach(v.fid);
        html += vb.length ? vorschauVorschlag(v, nr, vb) : platzhalterVorschlag(v, nr);
        return;
      }
      var r = v.top, p = pct(r.offen, s.n), f = FACH[v.fid];
      var liste = ST.massnahmen[r.b.id] || [];
      var wert = r.offen
        ? '<div class="platz-wert"><strong>' + kinderText(r.offen) + '</strong><span class="platz-bar" aria-hidden="true"><i style="width:' +
          p + '%"></i></span><span>' + p + " %</span></div>"
        : '<div class="platz-wert ohne-bedarf">bei allen Kindern gesichert</div>';
      html += '<section class="platz"' + fachStil(v.fid) + ' aria-label="Vorschlag ' + nr + ": " + esc(f.name) + ", " + esc(r.b.name) + '">' +
        '<span class="platz-nr' + (i === 0 && r.offen ? " erster" : "") + '" aria-hidden="true">' + nr + "</span><div>" +
        '<p class="platz-fach"><span title="' + esc(f.name) + '">' + esc(f.kurz || f.name) + "</span>" +
        (istBeispiel(v.fid) ? " " + TAG_BEISPIEL : "") + "</p>" +
        "<h3>" + esc(r.b.name) + "</h3>" + wert +
        (liste.length ? '<ul class="mass-liste">' + liste.map(function (m) {
          return "<li>" + esc(m.text) + " " + fundstellenChips(m.ids) + "</li>";
        }).join("") + "</ul>" : "") +
        '<button type="button" class="alle-knopf" data-bereich="' + r.b.id + '">Alle Materialien zu diesem Bereich</button>' +
        "</div></section>";
      v.weitere.forEach(function (w) {
        fussTeile.push('<button type="button" data-bereich="' + w.b.id + '" title="Alle Materialien zu ' + esc(w.b.name) + '">' +
          esc(w.b.name) + "</button> (" + (w.offen ? kinderText(w.offen) : "bei allen gesichert") + ")");
      });
    });
    var fuss = "Je Fach der Bereich mit den meisten Kindern ohne gesicherten Bereich.";
    if (fussTeile.length) fuss += " Weitere Bereiche: " + fussTeile.join(", ") + ".";
    html += '<p class="fussnote">' + fuss + "</p>";
    $("massnahmen").innerHTML = html;
  }

  /* ---------- Förderempfehlungen als PDF (Druckansicht) ---------- */
  // Eigene A4-Seite mit den drei Vorschlägen (einer je Fach) der gewählten Auswahl.
  // Ausgabe über den Druckdialog des Browsers („Als PDF speichern“) – funktioniert offline ohne Zusatzprogramme.
  var MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
    "September", "Oktober", "November", "Dezember"];
  function standText() {
    var d = new Date(ST.stand + "T12:00:00");
    return isNaN(d) ? ST.stand : MONATE[d.getMonth()] + " " + d.getFullYear();
  }
  function heuteText() {
    var d = new Date();
    return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
  }
  function settingLabel(id) {
    for (var i = 0; i < D.settings.length; i++) if (D.settings[i].id === id) return D.settings[i].label;
    return id;
  }
  function fundstelleText(e) {
    var q = ST.quellen[e.q];
    return e.kurz + " – " + (q ? q.titel : e.q) + (e.feldTitel ? ", " + e.feldTitel : "");
  }

  function gleicherName(a, b) {
    function n(x) { return String(x || "").toLowerCase().replace(/[^a-zäöüß0-9]+/g, ""); }
    return n(a) === n(b);
  }
  function druckMaterial(ids, massText) {
    var gesehen = {};
    var eintraege = ids.map(katalogEintrag).filter(function (e) {
      if (!e || gesehen[e.id]) return false;
      gesehen[e.id] = true;
      return true;
    });
    if (!eintraege.length) return "";
    return '<ul class="d-mat">' + eintraege.map(function (e) {
      var doppelt = eintraege.length === 1 && gleicherName(e.name, massText);
      return "<li>" + (doppelt ? "" : '<span class="d-mat-name">' + esc(e.name) + "</span> ") +
        '<span class="d-mat-typ">' + esc((D.typLabel[e.typ] || e.typ) + " · " + settingLabel(e.setting)) + "</span>" +
        (e.text ? '<span class="d-mat-text">' + esc(e.text) + "</span>" : "") +
        '<span class="d-mat-fund">Fundstelle: <a href="' + esc(e.href) + '">' + esc(fundstelleText(e)) + "</a>" +
        (e.url ? ' · <a href="' + esc(e.url) + '">' + esc(e.url) + "</a>" : "") + "</span></li>";
    }).join("") + "</ul>";
  }

  function druckVorschlag(v, nr, s) {
    var f = FACH[v.fid];
    var kopf = '<div class="d-platz-kopf"><span class="d-nr">' + nr + '</span><span class="d-fach">' + esc(f.name) + "</span>" +
      (istBeispiel(v.fid) ? '<span class="d-tag-beispiel">Beispieldaten (fiktiv)</span>' : "") + "</div>";
    if (!v.top) {   // Fach in dieser Stufe nicht erhoben
      var vb = vorschauImFach(v.fid);
      return '<section class="d-platz d-platz-leer"' + fachStil(v.fid) + ">" + kopf +
        "<h2>" + (vb.length ? "Noch nicht erhoben" : "Bereich folgt") + "</h2>" +
        '<p class="d-leise">' + (vb.length
          ? "Für dieses Fach liegen noch keine Werte vor. Material gibt es zu: " + esc(vb.map(function (b) { return b.name; }).join(", ")) + "."
          : "Für dieses Fach sind noch keine Bereiche angelegt.") + "</p></section>";
    }
    var r = v.top, p = pct(r.offen, s.n);
    var liste = ST.massnahmen[r.b.id] || [];
    var weitere = v.weitere.filter(function (w) { return w.offen > 0; });
    return '<section class="d-platz"' + fachStil(v.fid) + ">" + kopf +
      "<h2>" + esc(r.b.name) + "</h2>" +
      (r.offen
        ? '<p class="d-wert"><span><strong>' + r.offen + " von " + s.n + " Kindern</strong> noch nicht gesichert (" + p + " %)</span>" +
          '<span class="d-bar"><i style="width:' + p + '%"></i></span></p>'
        : '<p class="d-wert">Bei allen Kindern gesichert.</p>') +
      (liste.length
        ? '<ol class="d-mass">' + liste.map(function (m) {
            return '<li><p class="d-mass-text">' + esc(m.text) + "</p>" + druckMaterial(m.ids, m.text) + "</li>";
          }).join("") + "</ol>"
        : '<p class="d-leise">Für diesen Bereich sind noch keine Maßnahmen hinterlegt. Alle Materialien stehen im Portal.</p>') +
      (weitere.length
        ? '<p class="d-weitere">Weitere Bereiche in ' + esc(f.kurz || f.name) + " mit Förderbedarf: " +
          esc(weitere.map(function (w) { return w.b.name + " (" + kinderText(w.offen) + ")"; }).join(", ")) + "</p>"
        : "") +
      "</section>";
  }

  function druckHtml(s) {
    var auswahl = state.sel === JAHRGANG ? "Jahrgang" : "Klasse " + state.sel;
    var kennzahlen = [
      [s.n, kindWort(s.n)],
      [pct(s.alle, s.n) + " %", "alle Bereiche gesichert (" + s.alle + ")"],
      [s.bedarf, kindWort(s.bedarf) + " mit Förderbedarf"]
    ];
    if (s.nBereiche >= ST.lueckenAb && ST.lueckenAb > 1) kennzahlen.push([s.luecken, "mit Lücken in ≥ " + ST.lueckenAb + " Bereichen"]);
    var vs = vorschlaege(s);
    // Quellen, die in den Empfehlungen vorkommen
    var qIds = {};
    vs.forEach(function (v) {
      if (!v.top) return;
      (ST.massnahmen[v.top.b.id] || []).forEach(function (m) {
        m.ids.forEach(function (id) { var e = katalogEintrag(id); if (e) qIds[e.q] = true; });
      });
    });
    var quellen = Object.keys(qIds).sort().map(function (k) { return esc(k + " " + ST.quellen[k].titel); }).join(" · ");
    // Seitenrand ist 0 (sonst druckt der Browser Adresse, Datum und Seitenzahl in den Rand).
    // Abstand oben/unten auf JEDER Seite: leere Tabellen-Kopf-/Fußzeile, die der Browser je Seite wiederholt.
    return '<table class="d-rahmen" role="presentation"><thead><tr><td class="d-rand"></td></tr></thead>' +
      '<tfoot><tr><td class="d-rand"></td></tr></tfoot><tbody><tr><td class="d-seite">' +
      druckInhalt(s, auswahl, kennzahlen, vs, quellen) + "</td></tr></tbody></table>";
  }

  function druckInhalt(s, auswahl, kennzahlen, vs, quellen) {
    return '<header class="d-kopf">' +
        '<p class="d-eyebrow">Förderportal · Förderempfehlungen</p>' +
        "<h1>" + esc(auswahl) + "</h1>" +
        '<p class="d-meta">' + esc(ST.label + (ST.schule ? " · Grundschule " + ST.schule : "")) +
          " · Erhebung der Lehrkräfte, Stand " + esc(standText()) + " · erstellt am " + heuteText() + "</p>" +
      "</header>" +
      (ST.beispieldaten && ST.beispieldaten.length
        ? '<p class="d-hinweis-beispiel">' + esc(beispielHinweisKopf()) + ". Die Zahlen sind ausgedacht und dienen nur zur Vorführung.</p>" : "") +
      '<div class="d-zahlen">' + kennzahlen.map(function (z) {
        return '<div><strong>' + esc(z[0]) + "</strong><span>" + esc(z[1]) + "</span></div>";
      }).join("") + "</div>" +
      '<p class="d-intro">Je Fach eine Empfehlung: der Bereich mit den meisten Kindern, bei denen er noch nicht gesichert ist, ' +
        "mit den hinterlegten Maßnahmen und dem Material dazu. Reihenfolge nach Zahl der Kinder.</p>" +
      vs.map(function (v, i) { return druckVorschlag(v, i + 1, s); }).join("") +
      '<footer class="d-fuss">' +
        (quellen ? "<p><strong>Quellen:</strong> " + quellen + (D.fussKuerzel ? " · " + esc(D.fussKuerzel) : "") + "</p>" : "") +
        (D.fussHinweis ? "<p>" + esc(D.fussHinweis) + "</p>" : "") +
      "</footer>";
  }

  function druckeEmpfehlungen() {
    if (!ST || !ST.hatDaten) return;
    var s = statistik(kinderFuer(state.sel));
    $("druck").innerHTML = druckHtml(s);
    var titelAlt = document.title;
    // Chrome/Edge schlagen den Seitentitel als Dateinamen vor
    var d = new Date();
    document.title = "Förderempfehlungen " + (state.sel === JAHRGANG ? "Jahrgang" : state.sel) + " – " + ST.label + " – " +
      d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    document.body.classList.add("druckmodus");
    function fertig() {
      document.body.classList.remove("druckmodus");
      document.title = titelAlt;
      window.removeEventListener("afterprint", fertig);
    }
    window.addEventListener("afterprint", fertig);
    window.print();
  }

  /* ---------- Gesamtdarstellung ---------- */
  // Materialansicht (Stufe ohne Schuldaten): Karten mit Zahlen ausblenden
  function setzeModus(nurMaterial) {
    $("main").classList.toggle("nur-material", nurMaterial);
    // ab 7 Bereichen: Klassenvergleich und Förderprofile brauchen die doppelte Breite
    $("main").classList.toggle("viele-bereiche", !nurMaterial && BEREICHE.length > 6);
    [".karte-vergleich", ".karte-bedarf", ".karte-profile", ".karte-bereiche .legende"].forEach(function (sel) {
      document.querySelector(sel).hidden = nurMaterial;
    });
  }

  function renderMaterialansicht() {
    var s = statistik([]);
    $("kacheln").innerHTML = '<div class="kachel kachel-hinweis"><div>' +
      '<p class="kachel-titel">Für ' + esc(ST.label) + " liegen noch keine Schuldaten vor.</p>" +
      '<p class="kachel-text">Das Fördermaterial ist trotzdem schon abrufbar: einen Bereich anklicken. ' +
      "Zahlen, Klassenvergleich und Rangfolge erscheinen, sobald die Erhebung vorliegt.</p></div></div>";
    renderBereiche(s);
    renderMassnahmen(s);
  }

  function render() {
    setzeModus(!ST.hatDaten);
    if (!ST.hatDaten) { renderMaterialansicht(); return; }
    var kinder = kinderFuer(state.sel), s = statistik(kinder);
    Array.prototype.forEach.call(document.querySelectorAll("#auswahl button"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-sel") === state.sel));
    });
    renderKacheln(kinder, s);
    renderBereiche(s);
    renderVergleich();
    renderBedarf();
    renderProfile(kinder, s);
    renderMassnahmen(s);
  }

  function wechsleStufe(id) {
    if (!setzeStufe(id)) return;
    try { history.replaceState(null, "", "#" + id); } catch (e) { /* file:// ohne History */ }
    renderKopf();
    render();
  }

  /* ---------- Materialliste ---------- */
  var panel = { bereiche: [], zuletzt: null };

  function oeffneListe(bereichIds, ausloeser) {
    panel.bereiche = bereichIds;
    if (ausloeser) panel.zuletzt = ausloeser;
    $("f-suche").value = "";
    var titel = bereichIds.length === 1
      ? REG[bereichIds[0]].name
      : profilName(bereichIds.map(function (id) { return IDX[id]; }).sort());
    $("panel-titel").textContent = titel;
    renderListe();
    var war = !$("panel").hidden;
    $("overlay").hidden = false;
    $("panel").hidden = false;
    document.body.style.overflow = "hidden";
    $("panel-inhalt").scrollTop = 0;
    if (!war) $("panel-zu").focus();
  }

  function schliesseListe() {
    if ($("panel").hidden) return;
    $("panel").hidden = true;
    $("overlay").hidden = true;
    document.body.style.overflow = "";
    if (panel.zuletzt && document.body.contains(panel.zuletzt)) panel.zuletzt.focus();
  }

  function treffer(e, suche) {
    if (!suche) return true;
    var hay = [e.name, e.text, e.teil, e.fundstelle, D.typLabel[e.typ] || e.typ, e.feldTitel || ""].join(" ").toLowerCase();
    return suche.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }

  function eintragHtml(e, abdeckung) {
    var anschaffung = D.typenAnschaffung.indexOf(e.typ) >= 0;
    var mehr = panel.bereiche.length > 1 && abdeckung >= 2;
    var chips = e.bereiche.map(function (bid) {
      if (IDX.hasOwnProperty(bid) || VORSCHAU[bid]) {   // Bereich der aktuellen Stufe: anklickbar
        var aktiv = panel.bereiche.indexOf(bid) >= 0;
        return '<button type="button" class="bchip' + (aktiv ? " treffer" : "") + '" data-bereich="' + bid +
          '" title="Alle Materialien zu ' + esc(REG[bid].name) + '">' + esc(REG[bid].name) + "</button>";
      }
      if (REG[bid]) return '<span class="bchip zusatz" title="Bereich einer anderen Stufe">' + esc(REG[bid].name) + "</span>";
      return '<span class="bchip zusatz" title="Zusatzbereich">' + esc(D.zusatzbereiche[bid] || bid) + "</span>";
    }).join("");
    var linkText = e.kurz + (e.feldTitel ? " – " + e.feldTitel : "");
    var links = '<a href="' + esc(e.href) + '" target="_blank" rel="noopener" title="' + esc(linkTitel(e)) + '">' +
      esc(linkText) + " ↗</a>";
    if (e.url) {
      links += '<a href="' + esc(e.url) + '" target="_blank" rel="noopener" title="' + esc(e.url) + '">Externer Link ↗</a>';
    }
    return '<article class="eintrag' + (mehr ? " mehrfach" : "") + '">' +
      '<div class="eintrag-kopf"><h4>' + esc(e.name) + "</h4>" +
      '<span class="etikett' + (anschaffung ? " anschaffung" : "") + '">' + esc(D.typLabel[e.typ] || e.typ) + "</span>" +
      (mehr ? '<span class="etikett mehr">deckt mehrere Bereiche ab</span>' : "") + "</div>" +
      (e.text ? "<p>" + esc(e.text) + "</p>" : "") +
      '<div class="bereich-chips">' + chips + "</div>" +
      '<div class="links">' + links + "</div></article>";
  }

  function renderListe() {
    var nurVorhanden = $("f-vorhanden").checked;
    var suche = $("f-suche").value.trim().toLowerCase();
    var gesamt = 0;
    var html = "";
    // Bereich ohne Daten (Vorschau): die kuratierten Standard-Vorschläge oben zeigen
    var bid = panel.bereiche.length === 1 ? panel.bereiche[0] : null;
    var standard = bid && VORSCHAU[bid] && ST.massnahmen[bid];
    if (standard && !suche) {
      html += '<section class="gruppe vorschlaege"><h3>Vorschläge<span>' + standard.length + "</span></h3>" +
        '<ul class="mass-liste">' + standard.map(function (m) {
          return "<li>" + esc(m.text) + " " + fundstellenChips(m.ids) + "</li>";
        }).join("") + "</ul></section>";
    }
    html += D.settings.map(function (st) {
      var liste = ST.katalog.map(function (e, pos) {
        var abdeckung = e.bereiche.filter(function (b) { return panel.bereiche.indexOf(b) >= 0; }).length;
        return { e: e, abdeckung: abdeckung, pos: pos };
      }).filter(function (x) {
        return x.abdeckung > 0 && x.e.setting === st.id &&
          !(nurVorhanden && D.typenAnschaffung.indexOf(x.e.typ) >= 0) && treffer(x.e, suche);
      }).sort(function (a, b) {
        return (panel.bereiche.length > 1 ? b.abdeckung - a.abdeckung : 0) || a.pos - b.pos;
      });
      gesamt += liste.length;
      if (!liste.length) return "";
      return '<section class="gruppe"><h3>' + esc(st.label) + "<span>" + liste.length + "</span></h3>" +
        liste.map(function (x) { return eintragHtml(x.e, x.abdeckung); }).join("") + "</section>";
    }).join("");
    $("panel-inhalt").innerHTML = html || '<p class="panel-leer">Keine Einträge für diese Filter.</p>';
    $("panel-anzahl").textContent = gesamt === 1 ? "1 Eintrag" : gesamt + " Einträge";
  }

  /* ---------- Ereignisse ---------- */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest ? ev.target.closest("button") : null;
    if (!t) return;
    var box, neu;
    if (t.hasAttribute("data-stufe")) {
      var sid = t.getAttribute("data-stufe"), fokusS = document.activeElement === t;
      wechsleStufe(sid);
      neu = $("stufen").querySelector('[data-stufe="' + sid + '"]');
      if (neu && fokusS) neu.focus();
      return;
    }
    if (t.hasAttribute("data-sel")) {
      // Knopf wird beim Neuzeichnen ersetzt → Fokus auf den neuen Knopf an gleicher Stelle setzen
      var sel = t.getAttribute("data-sel"), hatteFokus = document.activeElement === t;
      box = t.closest("[id]");
      state.sel = sel;
      render();
      neu = box && document.getElementById(box.id).querySelector('[data-sel="' + sel + '"]');
      if (neu && hatteFokus) neu.focus();
      return;
    }
    if (t.hasAttribute("data-bereich")) { oeffneListe([t.getAttribute("data-bereich")], t.closest("#panel") ? null : t); return; }
    if (t.hasAttribute("data-profil")) {
      var ids = t.getAttribute("data-profil").split(",").map(function (i) { return BEREICHE[+i].id; });
      oeffneListe(ids, t);
    }
  });
  $("pdf-knopf").addEventListener("click", druckeEmpfehlungen);
  $("panel-zu").addEventListener("click", schliesseListe);
  $("overlay").addEventListener("click", schliesseListe);
  $("f-vorhanden").addEventListener("change", renderListe);
  $("f-suche").addEventListener("input", renderListe);

  document.addEventListener("keydown", function (ev) {
    if ($("panel").hidden) return;
    if (ev.key === "Escape") { ev.preventDefault(); schliesseListe(); return; }
    if (ev.key === "Tab") {  // Fokus in der Seitenleiste halten
      var f = $("panel").querySelectorAll("button, a[href], input");
      if (!f.length) return;
      var erstes = f[0], letztes = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === erstes) { ev.preventDefault(); letztes.focus(); }
      else if (!ev.shiftKey && document.activeElement === letztes) { ev.preventDefault(); erstes.focus(); }
    }
  });

  /* ---------- Start ---------- */
  var start = (location.hash || "").replace("#", "");
  if (!setzeStufe(start)) {
    var erste = D.stufen.filter(function (s) { return s.hatDaten; })[0] || D.stufen.filter(waehlbar)[0];
    if (!erste) {
      renderStufen();
      renderFuss();
      $("main").innerHTML = '<p class="karte">Für keine Stufe liegen Daten vor. Datendatei in den Stufen-Ordner unter <code>Schuldatenblaetter/</code> legen ' +
        "und <code>python build_data.py</code> ausführen.</p>";
      return;
    }
    setzeStufe(erste.id);
  }
  renderKopf();
  render();
})();
