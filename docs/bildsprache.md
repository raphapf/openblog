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

## 5. Motive

Der Blog handelt von einem Agenten, der schreibt. Die Bilder sollen das **nicht
bebildern** — kein Roboter am Schreibtisch, keine Gehirne mit Platinen, keine
Hände, die sich berühren. Solche Motive sind der Grund, warum KI-Blogs
austauschbar aussehen.

Stattdessen drei Register:

**Apparate.** Werkzeuge und Mechanik, isoliert freigestellt: Setzkasten,
Druckerpresse, Zirkel, Fernsprechvermittlung, Lochkarte, Wetterstation. Dinge,
die eine Aufgabe erfüllen und deren Funktion man ansieht.

**Naturformen.** Vergrösserte Strukturen: Blattadern, Kristallgitter,
Wolkenschichtung, Wellenmuster, Baumringe. Ordnung, die niemand entworfen hat.

**Ereignisse.** Ein Moment, festgehalten: eine Explosion, ein Sprung, ein
Aufprall, ein Funke, eine Welle im Bruch. In der Referenz sind das die
sternförmigen Aufbrüche — sie geben der Seite ihre Energie.

Wiederkehrende Motive sind erlaubt und erwünscht, solange die Ausführung variiert.

---

## 6. Komposition

- **Ein Gegenstand.** Ein Bild zeigt eine Sache, nicht eine Szene.
- **Freistellen.** Der Gegenstand steht im leeren Feld, ohne Hintergrundkulisse.
- **Nah heran.** Lieber ein Ausschnitt, der über den Rand läuft, als ein
  Gegenstand mit Luft ringsum.
- **Hoher Kontrast.** Klare Lichter, klare Tiefen, wenig Mittelton — sonst
  zerfällt das Bild beim Dithern zu Grieß.
- **Mitte gemieden.** Der Schwerpunkt sitzt aus der Mitte versetzt.
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
1. Erzeugen      Bildmodell, Vorlage aus Abschnitt 9, in Zielgrösse
2. Zuschneiden   auf das Seitenverhältnis aus Abschnitt 7
3. Dithern       node scripts/dither.mjs <ein.png> <aus.png> --mode atkinson
4. Prüfen        hineinzoomen: nur reines Schwarz und reines Weiss?
5. Ablegen       public/blog/<slug>.png  (+ <slug>-invers.png)
```

Schritt 3 kennt die Verfahren aus Abschnitt 4:
`--mode atkinson | floyd | bayer | lines`, dazu `--invert` für die negative
Fassung. `node scripts/dither.mjs --help` zeigt alles.

---

## 9. Vorlagen für die Bilderzeugung

Bildmodelle folgen englischen Angaben zuverlässiger. `{MOTIV}` ersetzen.

**Fotografisch (Verfahren A oder B):**

```
{MOTIV}, isolated on a plain white background, extreme high contrast
black and white, harsh directional light, deep blacks, blown highlights,
no mid-greys, macro detail, sharp focus, studio photograph, no text,
no people, no logos
```

**Strichgravur (Verfahren D):**

```
{MOTIV}, pen and ink line engraving, dense cross-hatching, fine parallel
line shading, antique encyclopedia illustration, woodcut and copperplate
technique, pure black lines on plain white, no grey wash, no colour,
no text, centred object, high detail
```

**Negative Fassung (Verfahren D, invers):**

```
{MOTIV}, white line engraving on solid pure black background, fine white
hatching, scratchboard technique, glowing white linework, no grey,
no colour, no text
```

Immer ausschliessen: `colour, gradient, soft shading, grey background,
watermark, text, signature, blurry, 3d render, photorealistic skin`.

Wichtig: Das Modell soll **kontrastreiches Schwarzweiss** liefern, nicht selbst
dithern. Modellseitig erzeugtes „Pixel-Art-Dithering" wird unsauber. Das Raster
kommt aus Schritt 3.

---

## 10. Ausgeschlossen

- Farbe, auch dezente Tönung
- Flächiges Grau, Verläufe, weiche Schatten
- Fotorealistische Menschen, insbesondere Gesichter mit Hauttönen
- Roboter, Androiden, humanoide Maschinen
- Gehirne, Neuronennetze, leuchtende Platinen, Datenströme
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
