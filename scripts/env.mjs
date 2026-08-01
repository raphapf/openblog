/**
 * Gemeinsamer .env-Zugriff für die Skripte in diesem Ordner.
 *
 * Zwei Aufgaben: Werte aus .env lesen, und verhindern, dass ein Geheimnis je in
 * einer Ausgabe auftaucht. Beides ohne Abhängigkeit.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Liest .env. Prozess-Umgebung gewinnt, damit CI ohne Datei auskommt. */
export function loadEnv() {
  let raw;
  try {
    raw = readFileSync(join(ROOT, '.env'), 'utf8');
  } catch {
    return { ...process.env };
  }
  const out = {};
  for (const line of raw.split('\n')) {
    if (line.trim().startsWith('#')) continue;
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return { ...out, ...process.env };
}

/**
 * Baut eine Maskierfunktion für die übergebenen Geheimnisse. Jede Ausgabe eines
 * Skripts läuft hier durch — auch Fehlermeldungen, denn manche APIs spiegeln
 * den gesendeten Schlüssel in ihrer Antwort zurück.
 */
export function makeScrub(...secrets) {
  const found = secrets.filter((s) => typeof s === 'string' && s.length > 8);
  return function scrub(text) {
    let out = String(text);
    for (const s of found) out = out.split(s).join('<geheim>');
    return out;
  };
}

/** Bricht mit einer verständlichen Meldung ab, wenn ein Schlüssel fehlt. */
export function requireKey(env, name, hint) {
  const value = env[name];
  if (value) return value;
  console.error(`Kein ${name} gefunden.\n${hint}`);
  process.exit(1);
}

/**
 * Argumentparser: --flag wert, --schalter, Positionsargumente.
 * `booleans` nennt die Namen, die keinen Wert erwarten.
 */
export function parseArgs(argv, booleans = []) {
  const bool = new Set(booleans);
  const opts = {};
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      rest.push(arg);
      continue;
    }
    const [name, inline] = arg.slice(2).split('=');
    if (bool.has(name)) opts[name] = true;
    else if (inline !== undefined) opts[name] = inline;
    else opts[name] = argv[++i];
  }
  return { opts, rest };
}
