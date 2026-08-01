#!/usr/bin/env node
/**
 * Client für OpenRouter — Recherche, Texte und Bilder über einen Schlüssel.
 *
 *   node scripts/openrouter.mjs probe                    Schlüssel prüfen, Guthaben zeigen
 *   node scripts/openrouter.mjs models --images          Modelle mit Bildausgabe auflisten
 *   node scripts/openrouter.mjs models claude            Modelle nach Namen filtern
 *   node scripts/openrouter.mjs ask "<Frage>"            Text erzeugen
 *   node scripts/openrouter.mjs image "<Prompt>" --out roh.png
 *
 * Der Schlüssel wird aus .env gelesen und nie ausgegeben, auch nicht in
 * Fehlermeldungen.
 *
 * Bilder kommen hier als weiche Graustufe heraus. Der Ein-Bit-Charakter
 * entsteht erst danach — siehe docs/bildsprache.md, Abschnitt 8:
 *
 *   node scripts/openrouter.mjs image "…" --out roh.png
 *   node scripts/dither.mjs roh.png public/blog/<slug>.png --mode atkinson
 */

import { writeFileSync } from 'node:fs';
import { loadEnv, makeScrub, requireKey, parseArgs } from './env.mjs';

const BASE = 'https://openrouter.ai/api/v1';
const env = loadEnv();

// Nicht sofort abbrechen, wenn der Schlüssel fehlt: `--help` soll auch ohne ihn
// etwas anzeigen. Die Prüfung steht unten, vor dem eigentlichen Aufruf.
const KEY = env.OPENROUTER_API_KEY;
const scrub = makeScrub(KEY);

// Gewählt nach einem Vergleich, nicht nach Bauchgefühl — siehe docs/modelle.md.
const TEXT_MODEL = env.OPENROUTER_TEXT_MODEL || 'anthropic/claude-sonnet-5';
const IMAGE_MODEL = env.OPENROUTER_IMAGE_MODEL || 'google/gemini-3-pro-image';

async function request(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      // OpenRouter zeigt diese beiden Angaben in der Nutzungsstatistik an.
      'HTTP-Referer': 'https://openblog.ch',
      'X-Title': 'OpenBlog',
      ...init.headers,
    },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 400);
  }
  return { status: res.status, ok: res.ok, body };
}

/** Holt die Fehlermeldung aus einer Antwort, egal in welcher Form sie kommt. */
function errorOf(body) {
  const msg = body?.error?.message ?? body?.message ?? body;
  return scrub(typeof msg === 'string' ? msg : JSON.stringify(msg)).slice(0, 300);
}

function money(n) {
  return typeof n === 'number' ? `${n.toFixed(2)} $` : '—';
}

/** Preis pro Million Token; OpenRouter liefert ihn als Zeichenkette pro Token. */
function perMillion(price) {
  const n = Number(price);
  if (!Number.isFinite(n) || n === 0) return 'gratis';
  return `${(n * 1e6).toFixed(2)} $`;
}

async function fetchModels() {
  const { ok, body } = await request('/models');
  return ok && Array.isArray(body?.data) ? body.data : [];
}

function outputs(model) {
  return model?.architecture?.output_modalities ?? [];
}

// ── probe ────────────────────────────────────────────────────────────────────

async function probe() {
  console.log('Prüfe Schlüssel gegen OpenRouter …\n');

  const key = await request('/key');
  if (!key.ok) {
    console.log(`✗ Schlüssel abgelehnt (HTTP ${key.status})`);
    console.log(`  ${errorOf(key.body)}`);
    console.log('\nNeuen Schlüssel auf https://openrouter.ai/keys erstellen.');
    process.exit(1);
  }

  const d = key.body?.data ?? {};
  console.log('✓ Schlüssel gültig');
  if (d.label) console.log(`  Bezeichnung   ${d.label}`);
  console.log(`  Verbraucht    ${money(d.usage)}`);
  console.log(`  Obergrenze    ${d.limit == null ? 'keine' : money(d.limit)}`);
  if (d.is_free_tier) console.log('  Hinweis       Gratis-Stufe: nur kostenlose Modelle');

  const credits = await request('/credits');
  if (credits.ok) {
    const c = credits.body?.data ?? {};
    const rest = Number(c.total_credits ?? 0) - Number(c.total_usage ?? 0);
    console.log(`  Guthaben      ${money(rest)}`);
  }

  const models = await fetchModels();
  console.log(`\n✓ ${models.length} Modelle erreichbar`);

  // Die beiden Voreinstellungen gegen die tatsächliche Liste prüfen — ein
  // Tippfehler in .env soll hier auffallen, nicht erst mitten im Agentenlauf.
  for (const [rolle, id] of [
    ['Text', TEXT_MODEL],
    ['Bild', IMAGE_MODEL],
  ]) {
    const hit = models.find((m) => m.id === id);
    console.log(hit ? `  ${rolle}  ✓ ${id}` : `  ${rolle}  ✗ ${id} — nicht in der Liste`);
  }

  const bild = models.filter((m) => outputs(m).includes('image'));
  if (bild.length) {
    console.log(`\nModelle mit Bildausgabe (${bild.length}):`);
    for (const m of bild.slice(0, 12)) console.log(`  ${m.id}`);
    if (bild.length > 12) console.log(`  … ${bild.length - 12} weitere: models --images`);
  }
}

// ── models ───────────────────────────────────────────────────────────────────

async function models(opts, filter) {
  let list = await fetchModels();
  if (!list.length) {
    console.error('Keine Modellliste erhalten.');
    process.exit(1);
  }

  if (opts.images) list = list.filter((m) => outputs(m).includes('image'));
  if (opts.free) list = list.filter((m) => Number(m.pricing?.prompt) === 0);
  if (filter) {
    const needle = filter.toLowerCase();
    list = list.filter(
      (m) => m.id.toLowerCase().includes(needle) || (m.name ?? '').toLowerCase().includes(needle),
    );
  }

  if (!list.length) {
    console.log('Kein Modell passt zu diesen Angaben.');
    return;
  }

  list.sort((a, b) => a.id.localeCompare(b.id));
  const w = Math.min(48, Math.max(...list.map((m) => m.id.length)));
  console.log(`${list.length} Modelle · Preis je Million Token (Eingabe / Ausgabe)\n`);
  for (const m of list) {
    const preis = `${perMillion(m.pricing?.prompt)} / ${perMillion(m.pricing?.completion)}`;
    console.log(`${m.id.padEnd(w)}  ${preis}`);
  }
}

// ── ask ──────────────────────────────────────────────────────────────────────

async function ask(prompt, opts) {
  if (!prompt) {
    console.error('Prompt fehlt. Beispiel: node scripts/openrouter.mjs ask "Wer bist du?"');
    process.exit(1);
  }

  const messages = [];
  if (opts.system) messages.push({ role: 'system', content: opts.system });
  messages.push({ role: 'user', content: prompt });

  const model = opts.model || TEXT_MODEL;
  const { ok, status, body } = await request('/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model,
      messages,
      usage: { include: true }, // liefert die tatsächlichen Kosten mit
      ...(opts.plugins === 'web' ? { plugins: [{ id: 'web' }] } : {}),
    }),
  });

  if (!ok) {
    console.error(`HTTP ${status}: ${errorOf(body)}`);
    process.exit(1);
  }

  const content = body?.choices?.[0]?.message?.content;
  console.log(typeof content === 'string' ? content : JSON.stringify(content, null, 2));

  const u = body?.usage;
  if (u) {
    console.error(
      `\n[${model} · ${u.prompt_tokens} ein, ${u.completion_tokens} aus` +
        (u.cost != null ? ` · ${Number(u.cost).toFixed(4)} $]` : ']'),
    );
  }
}

// ── image ────────────────────────────────────────────────────────────────────

/** Findet das Bild in der Antwort — die Form variiert je nach Anbieter. */
function extractImage(body) {
  const msg = body?.choices?.[0]?.message;
  const url = msg?.images?.[0]?.image_url?.url ?? msg?.images?.[0]?.url;
  if (typeof url !== 'string') return null;

  const m = url.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
  if (!m) return { remote: url };
  return { mime: m[1], buffer: Buffer.from(m[2], 'base64') };
}

async function image(prompt, opts) {
  if (!prompt) {
    console.error(
      'Prompt fehlt. Beispiel:\n' +
        '  node scripts/openrouter.mjs image "a brass sextant, high contrast" --out roh.png\n\n' +
        'Vorlagen für den richtigen Bildstil: docs/bildsprache.md, Abschnitt 9.',
    );
    process.exit(1);
  }

  const out = opts.out;
  if (!out) {
    console.error('Ziel fehlt: --out roh.png');
    process.exit(1);
  }

  const model = opts.model || IMAGE_MODEL;
  console.error(`Erzeuge Bild mit ${model} …`);

  const { ok, status, body } = await request('/chat/completions', {
    method: 'POST',
    body: JSON.stringify({
      model,
      modalities: ['image', 'text'],
      messages: [{ role: 'user', content: prompt }],
      usage: { include: true },
    }),
  });

  if (!ok) {
    console.error(`HTTP ${status}: ${errorOf(body)}`);
    if (status === 404 || status === 400) {
      console.error('\nModell prüfen: node scripts/openrouter.mjs models --images');
    }
    process.exit(1);
  }

  const found = extractImage(body);
  if (!found) {
    const text = body?.choices?.[0]?.message?.content;
    console.error('Die Antwort enthält kein Bild.');
    if (text) console.error(`Modelltext: ${String(text).slice(0, 300)}`);
    console.error('\nKann dieses Modell Bilder ausgeben? models --images zeigt es.');
    process.exit(1);
  }

  if (found.remote) {
    const res = await fetch(found.remote);
    found.buffer = Buffer.from(await res.arrayBuffer());
    found.mime = res.headers.get('content-type') ?? 'image/png';
  }

  // Manche Modelle liefern JPEG, auch wenn das Ziel auf .png endet. Die Endung
  // an den tatsächlichen Inhalt anpassen, statt JPEG-Bytes in eine .png-Datei
  // zu schreiben — dither.mjs würde sie sonst als defektes PNG ablehnen.
  const echteEndung = found.mime === 'image/png' ? '.png' : found.mime === 'image/webp' ? '.webp' : '.jpg';
  const ziel = new RegExp(`\\${echteEndung}$`, 'i').test(out)
    ? out
    : out.replace(/\.[^.]+$/, '') + echteEndung;

  writeFileSync(ziel, found.buffer);
  const kb = Math.round(found.buffer.length / 1024);
  const kosten = body?.usage?.cost;
  console.log(
    `${ziel} · ${found.mime} · ${kb} kB` +
      (kosten != null ? ` · ${Number(kosten).toFixed(4)} $` : ''),
  );

  if (ziel !== out) {
    const png = ziel.replace(/\.[^.]+$/, '') + '.png';
    console.error(`\nDas Modell lieferte ${found.mime}, nicht PNG. dither.mjs liest nur PNG:`);
    console.error(`  sips -s format png ${ziel} --out ${png}`);
    console.error('JPEG ist verlustbehaftet — seine Artefakte werden beim Dithern zu Rauschen.');
    return;
  }

  console.error('\nWeiter nach docs/bildsprache.md, Schritt 3:');
  console.error(`  node scripts/dither.mjs ${ziel} public/blog/<slug>.png --mode atkinson`);
}

// ── Aufruf ───────────────────────────────────────────────────────────────────

const HELP = `OpenRouter für OpenBlog

  probe                          Schlüssel prüfen, Guthaben und Modelle zeigen
  models [filter] [--images]     Modelle auflisten (--free für kostenlose)
  ask "<Frage>" [--model x]      Text erzeugen (--system, --plugins web)
  image "<Prompt>" --out d.png   Bild erzeugen (--model x)

Voreingestellt:  Text  ${TEXT_MODEL}
                 Bild  ${IMAGE_MODEL}
Ändern über OPENROUTER_TEXT_MODEL / OPENROUTER_IMAGE_MODEL in .env.`;

const { opts, rest } = parseArgs(process.argv.slice(2), ['images', 'free', 'help']);
const [cmd, arg] = rest;

if (opts.help || cmd === 'help') {
  console.log(HELP);
  process.exit(0);
}

requireKey(
  env,
  'OPENROUTER_API_KEY',
  'Schlüssel auf https://openrouter.ai/keys erstellen und in .env eintragen\n' +
    '(Datei ist gitignored). Vorlage: .env.example',
);

switch (cmd) {
  case 'probe':
  case undefined:
    await probe();
    break;
  case 'models':
    await models(opts, arg);
    break;
  case 'ask':
    await ask(arg, opts);
    break;
  case 'image':
    await image(arg, opts);
    break;
  default:
    console.error(`Unbekannter Befehl: ${cmd}\n\n${HELP}`);
    process.exit(1);
}
