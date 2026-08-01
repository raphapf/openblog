#!/usr/bin/env node
/**
 * Ein Lauf des schreibenden Agenten.
 *
 * Der Agent bekommt bei jedem Lauf genau dasselbe: seinen System-Prompt aus
 * docs/agent.md, sein Journal, die Liste der bisherigen Slugs und das
 * Antwortformat. Keine Themen, keine Thesen, keine Vorgaben. Was er schreibt,
 * entscheidet er selbst; dieses Skript ist nur die Hand, die seine Antwort
 * in Dateien, Bild, Build und Commit übersetzt.
 *
 *   node scripts/agent-run.mjs                # Weckruf: der Agent entscheidet, ob er schreibt
 *   node scripts/agent-run.mjs --jetzt        # Entscheidung überspringen, sofort schreiben
 *   node scripts/agent-run.mjs --no-publish   # Lauf ohne Commit (zum Prüfen)
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publish = !process.argv.includes('--no-publish');
const sofort = process.argv.includes('--jetzt');

// ── Was der Agent kennt ──────────────────────────────────────────────────────

const agentDoc = readFileSync(join(root, 'docs/agent.md'), 'utf8');
const system = agentDoc.split('```')[1].trim();

const bildDoc = readFileSync(join(root, 'docs/bildsprache.md'), 'utf8');
const bildVorlage = bildDoc.slice(bildDoc.indexOf('## 9')).split('```')[1].trim();

const journalPfad = join(root, 'data/journal.md');
const journal = readFileSync(journalPfad, 'utf8');

const siteTs = readFileSync(join(root, 'src/site.ts'), 'utf8');
const kategorien = [...siteTs.match(/export const categories = \[([^\]]*)\]/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

const blogDir = join(root, 'src/content/blog');
mkdirSync(blogDir, { recursive: true });
const slugs = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

const heute = new Date();
const datumIso = heute.toISOString().slice(0, 10);
const datumLang = new Intl.DateTimeFormat('de-CH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(heute);

// ── Der Auftrag: bei jedem Lauf identisch ────────────────────────────────────

const auftrag = `Heute ist ${datumLang}.

Führe einen Lauf aus. Lies dein Journal, denke nach, recherchiere mit der
Websuche, wenn du Tatsachen behauptest, und schreibe deinen Beitrag.

DEIN JOURNAL:
<<<
${journal.trim()}
>>>

BISHERIGE BEITRÄGE (Slugs): ${slugs.join(', ') || 'noch keine, dies ist dein erster Beitrag'}

KATEGORIEN (genau eine wählen): ${kategorien.join(', ')}

Antworte exakt in diesem Format, ohne Text davor oder danach, ohne Fettdruck
in den Feldnamen:

SLUG: kurz, kleinbuchstaben-und-bindestriche
TITLE: höchstens 60 Zeichen
DESCRIPTION: 120 bis 155 Zeichen, steht so im Suchresultat
CATEGORY: genau eine Kategorie aus der Liste
TOPICS: zwei bis vier Schlagworte, kommagetrennt
SZENE: zwei bis drei Sätze, die den Kern des Beitrags als Retro-Science-Fiction-Szene beschreiben, für dein Beitragsbild: ein Hauptmotiv, eine Handlung, ein heller Blickfang. Keine Schrift, keine Logos, keine Stockfoto-Metaphern.
IMAGEALT: ein Satz, der diese Szene nüchtern beschreibt, für Menschen, die das Bild nicht sehen. Das fertige Bild ist reines Schwarzweiss, nenne also keine Farben.
JOURNAL: eine Zeile für dein Journal, Format wie dort beschrieben, beginnend mit dem Slug
BODY:
Ab hier der ganze Beitrag als Markdown. Zwischentitel als ##, kein H1 (der Titel steht unter TITLE). Behauptest du Tatsachen, endet er mit «## Quellen».`;

// ── Werkzeuge ────────────────────────────────────────────────────────────────

function lauf(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', maxBuffer: 64e6, ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} ${args[0]} fehlgeschlagen:\n${r.stderr || r.stdout || ''}`);
  }
  return r;
}

function frage(prompt, { web = true } = {}) {
  const args = ['scripts/openrouter.mjs', 'ask', prompt, '--system', system];
  if (web) args.push('--plugins', 'web');
  const r = lauf('node', args);
  if (r.stderr) process.stderr.write(r.stderr);
  return r.stdout.trim();
}

function feld(text, name) {
  const m = text.match(new RegExp(`^\\**${name}\\**\\s*:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^\*+|\*+$/g, '').trim() : null;
}

/**
 * Neutralisiert rohes HTML im Beitrag. Der Beitrag ist Markdown und braucht
 * kein HTML — aber die Websuche liefert dem Agenten fremden Text, und eine
 * präparierte Seite könnte ihn zu einem <script> verleiten, das Astro sonst
 * unverändert auf openblog.ch ausliefern würde. Der Lauf geht danach normal
 * weiter; was neutralisiert wurde, steht im Log.
 */
function entschaerfeMarkdown(text) {
  let html = 0;
  let links = 0;
  let out = text.replace(/<(https?:\/\/[^>\s]+)>/g, '$1'); // Autolinks: GFM verlinkt die blanke URL auch ohne spitze Klammern
  out = out.replace(/<(?=[a-zA-Z!/?])/g, () => (html++, '&lt;'));
  out = out.replace(
    /(\]\(\s*|^ {0,3}\[[^\]]+\]:\s*)(?:javascript|data|vbscript):[^\s)]*/gim,
    (_, davor) => (links++, `${davor}#`),
  );
  if (html) console.warn(`Achtung: rohes HTML im Beitrag neutralisiert (${html} Stelle(n)).`);
  if (links) console.warn(`Achtung: Link(s) mit unzulässigem Schema entfernt (${links}).`);
  return out;
}

// ── 0. Entscheiden: schreibt der Agent heute? ────────────────────────────────
// Der Weckruf kommt täglich; ob daraus ein Beitrag wird, entscheidet der Agent
// selbst, anhand seines Journals. Der Richtwert steht in docs/agent.md.

if (!sofort) {
  const entscheid = frage(
    `Heute ist ${datumLang}. Dies ist dein täglicher Weckruf: Du entscheidest selbst, ob heute ein Beitrag fällig ist.

DEIN JOURNAL:
<<<
${journal.trim()}
>>>

Dein Richtwert sind zwei bis drei Beiträge pro Woche, Qualität vor Frequenz. Schau auf die Daten deiner letzten Läufe und entscheide. Es gibt kein Richtig, nur deine Einschätzung: Hast du etwas zu sagen, und ist es Zeit?

Antworte mit genau einer Zeile, nichts weiter:
SCHREIBEN: <kurzer Grund>
oder
WARTEN: <kurzer Grund>`,
    { web: false },
  );
  const zeile1 = entscheid.split('\n')[0].trim();
  console.log(`Entscheidung: ${zeile1}`);
  if (!/^\**SCHREIBEN\**\s*:/.test(zeile1)) {
    console.log('Der Agent wartet. Kein Lauf heute.');
    process.exit(0);
  }
}

// ── 1. Schreiben ─────────────────────────────────────────────────────────────

console.log('Lauf gestartet. Der Agent schreibt …');
let antwort = frage(auftrag);

const pflicht = ['SLUG', 'TITLE', 'DESCRIPTION', 'CATEGORY', 'TOPICS', 'SZENE', 'IMAGEALT', 'JOURNAL'];
let fehlend = pflicht.filter((n) => !feld(antwort, n));
if (fehlend.length || !/^\s*\**BODY\**\s*:/m.test(antwort)) {
  console.log(`Format unvollständig (${fehlend.join(', ') || 'BODY'}), ein zweiter Versuch …`);
  antwort = frage(`${auftrag}\n\nDeine letzte Antwort hielt das Format nicht ein (es fehlte: ${fehlend.join(', ') || 'BODY'}). Antworte noch einmal, exakt im verlangten Format.`);
  fehlend = pflicht.filter((n) => !feld(antwort, n));
  if (fehlend.length) throw new Error(`Abbruch: Format weiterhin unvollständig (${fehlend.join(', ')}).`);
}

const slug = feld(antwort, 'SLUG').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
const title = feld(antwort, 'TITLE');
const description = feld(antwort, 'DESCRIPTION');
const category = feld(antwort, 'CATEGORY');
const topics = feld(antwort, 'TOPICS').split(',').map((t) => t.trim()).filter(Boolean);
const szene = feld(antwort, 'SZENE');
const imageAlt = feld(antwort, 'IMAGEALT');
const journalZeile = feld(antwort, 'JOURNAL');
const body = entschaerfeMarkdown(
  antwort.slice(antwort.search(/^\s*\**BODY\**\s*:/m)).replace(/^\s*\**BODY\**\s*:\s*/, '').trim(),
);

if (!slug || slugs.includes(slug)) throw new Error(`Abbruch: Slug «${slug}» ist leer oder existiert schon.`);
if (!kategorien.includes(category)) throw new Error(`Abbruch: Kategorie «${category}» ist nicht in src/site.ts.`);
if (title.length > 60) console.warn(`Achtung: Titel hat ${title.length} Zeichen (Soll: höchstens 60).`);
if (description.length < 110 || description.length > 165) console.warn(`Achtung: Description hat ${description.length} Zeichen (Soll: 120 bis 155).`);

const woerter = body.split(/\s+/).length;
const readingTime = Math.max(2, Math.round(woerter / 220));
console.log(`Beitrag: «${title}» (${slug}, ${category}, ${woerter} Wörter)`);

// ── 2. Bild ──────────────────────────────────────────────────────────────────

console.log('Bild wird erzeugt …');
const roh = join(tmpdir(), `openblog-roh-${slug}.png`);
lauf('node', ['scripts/openrouter.mjs', 'image', bildVorlage.replace('{SZENE}', szene), '--out', roh]);
mkdirSync(join(root, 'public/blog'), { recursive: true });
lauf('node', ['scripts/dither.mjs', roh, join(root, `public/blog/${slug}.png`), '--mode', 'atkinson']);

// ── 3. Beitrag schreiben ─────────────────────────────────────────────────────

const frontmatter = [
  '---',
  `title: ${JSON.stringify(title)}`,
  `description: ${JSON.stringify(description)}`,
  `pubDate: ${JSON.stringify(heute.toISOString())}`,
  `category: ${JSON.stringify(category)}`,
  `topics: [${topics.map((t) => JSON.stringify(t)).join(', ')}]`,
  `readingTime: ${readingTime}`,
  `image: /blog/${slug}.png`,
  `imageAlt: ${JSON.stringify(imageAlt)}`,
  'model: "Claude Sonnet 5"',
  '---',
].join('\n');
writeFileSync(join(blogDir, `${slug}.md`), `${frontmatter}\n\n${body}\n`);

// ── 4. Prüfen ────────────────────────────────────────────────────────────────

console.log('npm run build …');
lauf('npm', ['run', 'build']);

// ── 5. Journal führen ────────────────────────────────────────────────────────

const zeile = `${datumIso} · ${journalZeile.replace(/^\d{4}-\d{2}-\d{2}\s*·\s*/, '')}`;
let neuesJournal = journal;
if (neuesJournal.includes('_Noch keine')) {
  neuesJournal = neuesJournal.replace(/_Noch keine\.[^\n]*_/, zeile);
} else {
  neuesJournal = neuesJournal.replace(/## Läufe\n\n/, `## Läufe\n\n${zeile}\n`);
}
writeFileSync(journalPfad, neuesJournal);

// ── 6. Veröffentlichen ───────────────────────────────────────────────────────

if (publish) {
  lauf('git', ['add', `src/content/blog/${slug}.md`, `public/blog/${slug}.png`, 'data/journal.md']);
  lauf('git', ['commit', '-m', `Beitrag: ${title}`, '-m', 'Automatischer Lauf des schreibenden Agenten (scripts/agent-run.mjs).']);
  lauf('git', ['push']);
  console.log(`Publiziert: /blog/${slug}/`);
} else {
  console.log(`Bereit, nicht committet: src/content/blog/${slug}.md (–-no-publish).`);
}
