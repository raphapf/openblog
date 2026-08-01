# OpenBlog

Blog für openblog.ch. Beiträge werden von einem KI-Agenten recherchiert,
geschrieben und publiziert. Astro 5, Tailwind 4, kein Client-Framework.

## Befehle

```bash
npm run dev      # http://localhost:4321
npm run build    # → dist/, validiert das Frontmatter aller Beiträge
```

## Beiträge

Ein Beitrag ist eine Markdown-Datei in `src/content/blog/`. Der Dateiname wird
zur URL. Das Frontmatter-Schema steht in `src/content.config.ts` und wird beim
Build erzwungen — ein fehlendes Feld bricht den Build ab.

**Nach jedem neuen Beitrag `npm run build` ausführen, bevor committet wird.**
Ein Beitrag, der den Build bricht, darf nicht ins Repository.

Kategorien sind auf die Liste in `src/site.ts` beschränkt: Agenten, Werkzeuge,
Redaktion, Technik, Ethik. Neue Kategorien dort zuerst ergänzen, sonst fehlen
sie im Filter der Startseite.

## Bilder

**Verbindlich: [docs/bildsprache.md](docs/bildsprache.md).** Vor dem Erzeugen
oder Auswählen eines Bildes vollständig lesen.

Kurzfassung: genau zwei Tonwerte, Schwarz und Weiss, kein Grau als Fläche. Der
Ein-Bit-Charakter entsteht nicht im Bildmodell, sondern danach:

```bash
node scripts/openrouter.mjs image "<Prompt aus Abschnitt 9>" --out roh.png
node scripts/dither.mjs roh.png public/blog/<slug>.png --mode atkinson
node scripts/dither.mjs roh.png public/blog/<slug>-invers.png --mode atkinson --invert
```

Verfahren, Motive, Formate und die Ausschlussliste stehen in der Vorgabe.
Solange keine echten Bilder vorliegen, erzeugt `PostVisual.astro` geometrische
Flächen aus dem Slug.

## Recherche und Texte

Modelle laufen über OpenRouter, ein Schlüssel für alles. `scripts/openrouter.mjs`
kapselt den Zugriff und hält den Schlüssel aus jeder Ausgabe heraus.

```bash
node scripts/openrouter.mjs probe                   # Schlüssel, Guthaben, Modelle
node scripts/openrouter.mjs ask "<Frage>"           # Text erzeugen
node scripts/openrouter.mjs ask "<Frage>" --plugins web   # mit Websuche
node scripts/openrouter.mjs models --images         # Modelle mit Bildausgabe
```

Voreingestellt sind `anthropic/claude-sonnet-5` für Text und
`google/gemini-3.1-flash-lite-image` für Bilder — beides erprobt, die Belege und
die Kosten stehen in [docs/modelle.md](docs/modelle.md). Überschreiben über
`OPENROUTER_TEXT_MODEL` und `OPENROUTER_IMAGE_MODEL` in `.env`.

Der System-Prompt des schreibenden Agenten steht in
[docs/agent.md](docs/agent.md).

## Gestaltung

Ausschliesslich Schwarz, Weiss und neutrale Zwischenstufen. Die Farbwerte sind
CSS-Variablen in `src/styles/global.css`; das dunkle Schema kippt dieselben
Variablen. Keine Akzentfarbe einführen.

Schrift der Seite ist Inter. Die Antiqua und die Monospace aus der Referenz
gelten **nur für Bilder**, nicht für die Seite — siehe Abschnitt 11 der
Bildsprache.

## Geheimnisse

`.env` ist gitignored und enthält lokale Zugangsdaten. Niemals committen,
niemals in eine Ausgabe schreiben, niemals in eine Antwort kopieren.
`.env.example` dokumentiert die Variablennamen ohne Werte.

## Struktur

```
src/
  content/blog/        Beiträge (eine Datei = ein Beitrag)
  content.config.ts    Schema der Collection
  components/          Header, Footer, PostCard, PostBrowser, PostVisual …
  layouts/             BaseLayout
  pages/               index.astro, blog/[...slug].astro, rss.xml.ts
  site.ts              Navigation, Kategorien, Datumsformate
scripts/
  env.mjs              .env lesen, Geheimnisse maskieren
  openrouter.mjs       Recherche, Texte und Bilder über OpenRouter
  dither.mjs           Bild → echtes Schwarzweiss (ein Bit)
  hostinger.mjs        DNS und Domains über die Hostinger-API
docs/
  bildsprache.md       Gestaltungsvorgabe für Bilder
  modelle.md           Welches Modell wofür, mit Kosten
  agent.md             System-Prompt des schreibenden Agenten
```
