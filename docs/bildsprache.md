# Bildsprache OpenBlog

Verbindliche Gestaltungsvorgabe für alle Beitragsbilder. Wer Bilder erzeugt —
Mensch oder Agent — hält sich hieran.

---

## 1. Woher das kommt

Referenz ist die Gestaltung von [Hermes Agent](https://hermes-agent.nousresearch.com)
(Nous Research). Wir übernehmen **die Technik und die Haltung, nicht die Marke**:
keine Farbe, keine Motive und keine Schriftzüge von dort. Was wir übernehmen, sind
Verfahren, die gemeinfreies Handwerk sind — Dithering, Halbton, Strichgravur.

Die Analyse der Referenz ergab fünf Bestandteile:

| Bestandteil | Bei Hermes | Bei OpenBlog |
|---|---|---|
| Farbanzahl | genau zwei: Ultramarin + Weiss | genau zwei: **Schwarz + Weiss** |
| Bildaufbereitung | 1-Bit-Dithering, Scanlines, Halbton | identisch |
| Illustration | weisse Strichgravur, Manga-Anleihen | identisch, in Schwarz oder Weiss |
| Display-Schrift | Didone-Antiqua, Versalien | nur in Bildern, nicht auf der Seite |
| Fliesstext | Monospace, Versalien, weit gesperrt | nur in Bildern, nicht auf der Seite |

**Der entscheidende Punkt:** Dithering und Gravur sind von Haus aus
Ein-Bit-Verfahren. Sie stammen aus dem Schwarzweissdruck und aus frühen
Bildschirmen. Unsere Umsetzung ist deshalb keine entfärbte Kopier — es ist die
Technik in ihrer ursprünglichen Form. Der Verzicht auf Farbe kostet uns hier
nichts.

---

## 2. Grundprinzip: ein Bit

Jedes Bild besteht aus **genau zwei Tonwerten**. Kein Grau als Fläche.

```
Tinte    #000000
Papier   #FFFFFF
```

Grau darf **nur als Textur** entstehen — also dadurch, dass schwarze und weisse
Bildpunkte nebeneinanderliegen und das Auge sie mischt. Ein flächiges 50-%-Grau
ist ein Fehler; ein Dither-Raster, das aus Distanz wie Grau wirkt, ist das Ziel.

Praktische Folge: Wer hineinzoomt, muss reine schwarze und reine weisse Pixel
sehen. Sonst ist das Bild nicht fertig (siehe Abschnitt 8).

---

## 3. Die zwei Polaritäten

Jedes Motiv existiert in zwei Fassungen. Beide werden erzeugt und abgelegt.

**Positiv** — schwarze Tinte auf weissem Papier. Standard im hellen Farbschema.

**Negativ** — weisse Zeichnung auf schwarzem Grund. Standard im dunklen
Farbschema, und im hellen Schema als **Akzent**: In der Referenz ist die dritte
von drei Kacheln invertiert. Genau dieser Rhythmus ist gemeint — ein invertiertes
Bild alle drei bis vier Kacheln bricht das Raster auf.

Regel für den Beitragsindex: Bei mehr als drei Kacheln nebeneinander wird
**höchstens jede dritte** invertiert, nie zwei nebeneinander.

---

## 4. Die vier Verfahren

Jedes Bild nutzt **genau eines**. Mischen wirkt unentschieden.

### A — Fehlerdiffusion (Standard)

Atkinson- oder Floyd-Steinberg-Dithering. Erzeugt organisches, körniges Rauschen
mit weichen Verläufen. Atkinson lässt Lichter ausbrennen und Tiefen zulaufen —
das erhöht den Kontrast und ist für Fotos meist die bessere Wahl.

Einsatz: fotografische Motive, alles Organische, alles mit Tiefe.

### B — Geordnetes Raster (Bayer)

Regelmässiges Schwellenwertraster. Erzeugt ein sichtbares, technisch wirkendes
Kreuzmuster. Kälter und strenger als A.

Einsatz: Diagramme, Abstraktes, alles, was nach Maschine aussehen soll.

### C — Zeilenraster

Horizontale Linien unterschiedlicher Stärke, moduliert nach Helligkeit. Der
Bildschirm-Scanline-Effekt aus der Referenz (dort beim Porträt eingesetzt).

Einsatz: Porträts, Gesichter, alles Frontale. Sparsam — höchstens jedes fünfte
Bild, sonst wird es zur Masche.

### D — Strichgravur

Kein Dithering, sondern echte Linienzeichnung: Schraffur, Kreuzschraffur,
Konturen. Handwerklich zwischen Kupferstich, alter Lexikonillustration und
Tuschezeichnung.

Einsatz: erdachte Motive, Metaphern, alles, wofür es kein Foto gibt. Das ist das
Verfahren für Titelbilder mit Anspruch.

---

## 5. Stil und Motive

Der Stil für Beitragsbilder ist **Retro-Science-Fiction im Rasterdruck**:
dichte Szenen aus tiefem Schwarz und reinem Weiss, sichtbar gemacht durch
grobes Halbton-Raster, Scanlines und körnige Druckstrukturen — Siebdruck,
Risograph, alte gerasterte Zeitungsfotografie. Festgelegt am 1. August 2026
anhand eines Referenzbilds (Astronaut berührt eine Maschine), dessen Machart
die Vorlage in Abschnitt 9 wörtlich übernimmt.

**Das Motiv folgt dem Thema des Beitrags.** Die Szene übersetzt den Kern des
Textes in diese Bildwelt: Raumfahrt, Maschinenhallen, Apparate, Archive,
Signale. Ein Beitrag über Gedächtnis wird zur Archivhalle voller Bandspulen;
einer über Übersetzung zur Vermittlungszentrale; einer über Fehler zum
havarierten Apparat. Die Übersetzung darf frei sein, aber sie muss da sein —
kein beliebiges Weltraumbild über einem beliebigen Text.

Astronauten, Maschinen und Roboter sind in diesem Register ausdrücklich
erlaubt — als Figuren einer erzählten Szene, nicht als Stockfoto-Metapher
(«Roboterhand tippt auf Laptop» bleibt verboten).

Wiederkehrende Elemente sind erwünscht, solange die Szene variiert.

---

## 6. Komposition

- **Eine Szene, ein Blickfang.** Das Bild ist dicht und bildfüllend, aber es
  hat genau ein helles Hauptmotiv — eine Kugel, ein Fenster, eine leuchtende
  Form —, an dem das Auge landet. Im Referenzbild ist das die grosse helle
  Kreisform rechts.
- **Dichter Grund.** Der Hintergrund ist gefüllt mit technischen Strukturen,
  Kabeln, Lichtpunkten, Details. Leere gibt es nur dort, wo der Blickfang sitzt.
- **Hoher Kontrast.** Flächige Schatten, klare Lichter, kein Mittelton als
  Fläche — sonst zerfällt das Bild beim Dithern zu Grieß.
- **Mitte gemieden.** Der Blickfang sitzt aus der Mitte versetzt.
- **Kein Text im Bild.** Keine Schrift, keine Zahlen, keine Wortmarken. Typografie
  gehört auf die Seite, nicht ins Bild.

---

## 7. Formate

Passend zu `PostVisual.astro`:

| Verwendung | Seitenverhältnis | Ausgabegrösse |
|---|---|---|
| Kachel im Beitragsraster | 1:1 | 1200 × 1200 |
| Aufmacher Startseite, Kopf der Beitragsseite | 16:10 | 1920 × 1200 |
| Hochformat (Reserve) | 4:5 | 1200 × 1500 |

Grosszügig ausgeben: Dithering verträgt kein nachträgliches Skalieren. Wer ein
gedithertes Bild verkleinert, erzeugt Moiré und Grau. **Erst auf Zielgrösse
bringen, dann dithern** — nie umgekehrt.

---

## 8. Ablauf

Bildmodelle liefern kein sauberes Ein-Bit-Ergebnis. Sie erzeugen weiche
Graustufen mit Kantenglättung. Der Ein-Bit-Charakter entsteht **im zweiten
Schritt**, und der ist nicht optional.

```
1. Erzeugen      node scripts/openrouter.mjs image "<Vorlage>" --out roh.png
2. Zuschneiden   auf das Seitenverhältnis aus Abschnitt 7
3. Dithern       node scripts/dither.mjs roh.png <aus.png> --mode atkinson
4. Prüfen        hineinzoomen: nur reines Schwarz und reines Weiss?
                 und: steht irgendwo eine Zahl oder ein Buchstabe im Bild?
5. Ablegen       public/blog/<slug>.png  (+ <slug>-invers.png)
```

Schritt 1 wandelt selbsttätig nach PNG um, falls das Modell JPEG liefert — das
voreingestellte tut das. Schritt 4 ist keine Formalität: Kein Prompt schliesst
Schrift zuverlässig aus, er macht sie nur selten. Ein Bild mit Beschriftung wird
verworfen und neu erzeugt, nicht nachbearbeitet.

Schritt 3 kennt die Verfahren aus Abschnitt 4:
`--mode atkinson | floyd | bayer | lines`, dazu `--invert` für die negative
Fassung. `node scripts/dither.mjs --help` zeigt alles.

---

## 9. Vorlage für die Bilderzeugung

Es gibt **eine** Vorlage. Sie stammt wörtlich vom Referenzbild, das den Stil
festgelegt hat, und ist mit `openai/gpt-5.4-image-2` erprobt — einmal mit der
Originalszene, einmal mit einer anderen: Beide Läufe trafen den Stil, beide
ohne Schrift im Bild. Nur `{SZENE}` wird ersetzt: zwei bis drei Sätze, die das
Thema des Beitrags in die Bildwelt aus Abschnitt 5 übersetzen — Hauptmotiv,
Handlung, ein heller Blickfang.

```
Abstrakte futuristische Szene im extrem kontrastreichen
Schwarz-Weiss-Duotone-Stil. {SZENE}. Der gesamte Hintergrund ist dicht
gefüllt mit technischen Strukturen, Kabeln, Schläuchen, Lichtpunkten und
abstrakten elektronischen Details. Die Komposition wirkt chaotisch,
räumlich und geheimnisvoll. Das komplette Bild besteht ausschliesslich
aus tiefem Schwarz und reinem Weiss. Keine Farbe, kein Blau und keine
Graustufen. Schwarzer Grund mit weissen Rasterpunkten und weissen
Linien. Alle Personen, Objekte und Lichtflächen werden durch ein grobes
horizontales Halftone-Raster, Punktmuster, Scanlines und körnige
Druckstrukturen sichtbar. Starker Siebdruck-Look, Risograph-Ästhetik,
alte gerasterte Zeitungsfotografie, experimentelle
Science-Fiction-Grafik, absichtliche Druckfehler, unregelmässige
Punktdichte und leichte analoge Verzerrungen. Sehr hoher Kontrast,
flächige Schatten, raue Textur, keine scharfen digitalen Konturen.
Quadratisches Bildformat, vollständig bildfüllende Komposition, keine
Schrift, keine Logos und kein Rahmen.
```

Für das 16:10-Format den letzten Satz anpassen: `Querformat` statt
`Quadratisches Bildformat`.

Beispiel für eine gelungene `{SZENE}` (Beitrag über Gedächtnis): *«Eine
riesige Archivhalle voller Magnetbandmaschinen und Datenschränke; in der
Mitte greift ein einzelner mechanischer Arm nach einer leuchtenden
Bandspule.»*

Zwei Hinweise aus früheren Tests, die weiter gelten:

- Das voreingestellte Modell liefert dichtes Halbton-Raster selbst — das ist
  hier gewollt und Teil des Stils. Schritt 3 (Dithern) bleibt trotzdem
  Pflicht, denn erst er zwingt jeden Bildpunkt auf reines Schwarz oder Weiss.
- Wer auf ein **Gemini**-Modell ausweicht, muss den Schriftbann
  ausbuchstabieren — `no text` allein genügt dort nicht, die Modelle
  beschriften Skalen trotzdem mit Ziffern:
  `Completely unlabelled: no numbers, no numerals, no digits, no letters,
  no words, no scale markings, no signature.`

---

## 10. Ausgeschlossen

- Farbe, auch dezente Tönung
- Flächiges Grau, Verläufe, weiche Schatten
- Fotorealistische Menschen, insbesondere Gesichter mit Hauttönen —
  Figuren erscheinen nur gerastert, nie mit glatter Haut
- Stockfoto-Metaphern: Roboterhand am Laptop, Gehirn mit Platinen,
  leuchtende Neuronennetze, sich berührende Hände
- Schrift, Zahlen, Wortmarken im Bild
- Auf 3D getrimmte Darstellungen, Renderglanz, Spiegelungen
- Rahmen und Schlagschatten — die Kachel bringt ihre eigene Haarlinie mit

---

## 11. Verhältnis zur Seite

Die Seite selbst nutzt **Inter**, eine Grotesk — ein anderer Ton als die
Didone-Antiqua und die Monospace der Referenz. Das ist bewusst so belassen: Die
Vorgabe hier regelt **Bilder**, nicht die Typografie der Seite.

Ob die Antiqua auch in Überschriften einziehen soll, ist eine offene
Gestaltungsfrage. Sie würde die Seite deutlich näher an die Referenz rücken —
und deutlich weiter weg von der nüchternen Schweizer Anmutung, die sie heute hat.
Diese Entscheidung ist noch nicht getroffen.

**Bis echte Bilder vorliegen** erzeugt `PostVisual.astro` geometrische Flächen
aus dem Slug. Diese Vorgabe ersetzt sie nicht — sie beschreibt, was an ihre
Stelle tritt. Beim Umstieg bleibt das Verhalten gleich: gleicher Beitrag,
gleiches Bild, und die Polarität folgt dem Farbschema.
