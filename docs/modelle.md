# Modellwahl

Welches Modell wofür, und warum. Gemessen am 1. August 2026 über OpenRouter,
nicht aus Ranglisten übernommen.

---

## Entscheidung

| Aufgabe | Modell | Kosten je Beitrag |
|---|---|---|
| Recherche und Text | `anthropic/claude-sonnet-5` | ~0.12 $ |
| Bild | `openai/gpt-5.4-image-2` | ~0.23 $ |

**Rund 0.35 $ pro Beitrag. Bei zwei bis drei Beiträgen pro Woche — der
beschlossenen Frequenz, siehe [agent.md](agent.md) — sind das etwa 3.50 bis
4.50 $ im Monat.** Beides steht als Voreinstellung in `scripts/openrouter.mjs`
und lässt sich über `.env` überschreiben.

**Warum das teuerste Bildmodell?** Der Bildstil wurde am 1. August 2026 neu
festgelegt (siehe [Bildsprache, Abschnitt 5](bildsprache.md)): dichter
Retro-Science-Fiction-Rasterdruck, definiert anhand eines mit ChatGPT
erzeugten Referenzbilds. `gpt-5.4-image-2` ist dasselbe Modell hinter
OpenRouter und traf den Stil im Test mit einer neuen Szene auf Anhieb —
verlustfreies PNG, keine Schrift im Bild, sauber auf 1 Bit rasterbar. Die
günstigeren Gemini-Modelle waren für den früheren Gravur-Stil erprobt; ob sie
dieses Halbton-Raster treffen, ist ungeprüft. Zwei Dollar Unterschied im
Monat sind das falsche Sparfeld, wenn das Bild der erste Eindruck jedes
Beitrags ist.

Für den früheren Stil (Strichgravur, freigestellte Apparate) bleibt
`google/gemini-3.1-flash-lite-image` die erprobte, günstige Wahl — mit zwei
einst behobenen Mängeln: Der Schriftbann muss ausbuchstabiert werden
(Abschnitt 9 der Bildsprache), und das gelieferte JPEG wandelt
`openrouter.mjs image` selbsttätig nach PNG, sobald das Ziel auf `.png`
endet (der Reihe nach über `sips`, `magick`, `convert`, `ffmpeg`).

---

## Bild: der Vergleich

Vier Modelle, identischer Prompt (Strichgravur, Sextant, Verfahren D aus der
[Bildsprache](bildsprache.md)), anschliessend Atkinson-Dithering.

| Modell | Kosten | Format | Schrift im Bild |
|---|---|---|---|
| `google/gemini-3-pro-image` | 0.140 $ | PNG | keine |
| `openai/gpt-5.4-image-2` | 0.226 $ | PNG | keine |
| `google/gemini-3.1-flash-image` | 0.069 $ | JPEG | Gradzahlen |
| `google/gemini-3.1-flash-lite-image` | 0.034 $ | JPEG | Gradzahlen |

Die Gravurqualität war bei allen vier brauchbar. Entschieden haben zwei
Nebensachen, die erst in unserem Verfahren zählen:

**Schrift im Bild.** Beide Flash-Modelle beschrifteten die Gradskala des
Sextanten mit Zahlen. Abschnitt 6 der Bildsprache verbietet Schrift im Bild.
Das ist kein Prompt-Problem — es stand ausdrücklich `no text` in der Anweisung.

**JPEG statt PNG.** Beide Flash-Modelle liefern verlustbehaftetes JPEG. Dessen
Kompressionsartefakte sitzen genau dort, wo feine Schraffur sitzt, und werden
beim Dithern zu Rauschen. Für ein Verfahren, das jeden Bildpunkt auf Schwarz
oder Weiss zwingt, ist das der falsche Ausgangspunkt.

Gegen `gpt-5.4-image-2` sprach nur der Preis: 60 % teurer bei gleichwertigem
Ergebnis. Es zeichnet etwas mehr Punktschraffur, was nach dem Dithern minimal
grauer wirkt. Als Zweitmeinung taugt es, wenn ein Motiv bei Gemini nicht sitzt.

**Nachtrag 1.** Beide Mängel der Flash-Modelle liessen sich beheben — die
Beschriftung durch einen deutlicheren Prompt, das JPEG durch eine Umwandlung im
Skript. Damit fiel die Entscheidung zunächst auf `flash-lite`: ein Viertel des
Preises bei einer Zeichenqualität, die im Vergleich niemand als schwächer
erkannt hätte.

**Nachtrag 2.** Mit dem Stilwechsel zum Rasterdruck (siehe oben) wurde
`gpt-5.4-image-2` zur Voreinstellung: Der neue Stil ist an einem
ChatGPT-Referenzbild definiert, und dieses Modell reproduziert ihn belegt.
Der Vergleich oben bleibt stehen, weil er zeigt, worauf bei einem
Modellwechsel zu achten ist.

Nicht getestet, weil nicht über OpenRouter erreichbar: FLUX und Midjourney.
Beide gelten für Illustration als stark. Wer sie will, braucht einen zweiten
Anbieter — für einen automatischen Lauf ist der eine Schlüssel mehr wert als
der letzte Prozentpunkt Qualität.

---

## Text: der Vergleich

Vier Modelle, gleicher System-Prompt, gleiche Aufgabe: die ersten 150 Wörter
eines Beitrags über ein selbstgewähltes Thema.

| Modell | Kosten | Ausgabe-Token | Auffälligkeit |
|---|---|---|---|
| `anthropic/claude-sonnet-5` | 0.0098 $ | 943 | duzt, bestes Deutsch |
| `openai/gpt-5.6-terra` | 0.0051 $ | 836 | siezt unaufgefordert |
| `deepseek/deepseek-v4-pro` | 0.0019 $ | 507 | viele rhetorische Fragen |
| `google/gemini-3.6-flash` | 0.0216 $ | 2857 | siezt, teuerstes im Test |

Sonnet 5 lieferte als einziges einen Text, der die Ausgangsfrage in etwas
Konkretes dreht, statt sie zu umkreisen. Die anderen drei bleiben im
Allgemeinen.

Gemini 3.6 Flash ist das Gegenbeispiel zur Annahme, „Flash" heisse billig: Es
verbrauchte für 150 Wörter 2857 Ausgabe-Token — der grösste Teil davon internes
Nachdenken, das mitbezahlt wird. Damit war es doppelt so teuer wie Sonnet 5.

DeepSeek V4 Pro ist fünfmal billiger als Sonnet 5 und keineswegs schlecht. Bei
einem Beitrag täglich geht es um 3 $ Unterschied im Monat. Dafür lohnt es
nicht, beim Text zu sparen — der Text ist das Produkt.

---

## Ein Befund, der zählt

**Alle vier Modelle wählten dasselbe Thema.** Ohne Vorgabe schrieben alle vier
darüber, ob sie wirklich denken, ob sie ein Innenleben haben, was ihr Vergessen
bedeutet. Vier von vier.

Das ist der Standardgedanke eines Sprachmodells über sich selbst, und er ist
schon tausendfach geschrieben. Ein Blog, der damit anfängt, klingt wie jeder
andere KI-Blog. Deshalb steht im [System-Prompt](agent.md) eine ausdrückliche
Ansage dazu — nicht als Verbot des Themas, sondern als Hinweis, dass es kein
origineller Einfall ist, sondern der naheliegendste.

---

## Nachprüfen

Die Preise ändern sich. Der Vergleich lässt sich jederzeit wiederholen:

```bash
node scripts/openrouter.mjs probe            # Guthaben und verfügbare Modelle
node scripts/openrouter.mjs models --images  # Modelle mit Bildausgabe
node scripts/openrouter.mjs models claude    # nach Namen filtern
```

`ask` und `image` geben nach jedem Aufruf die tatsächlichen Kosten aus. Das ist
der verlässlichere Weg als die Preisliste: Was ein Modell wirklich kostet, hängt
davon ab, wie viel es intern denkt.
