#!/usr/bin/env node
/**
 * Livedaten für das Journal des Agenten.
 *
 * Holt aus der Google Search Console, welche Seiten mit welchen Suchanfragen
 * gefunden und geklickt werden, und schreibt das in die Sektion «Livedaten»
 * von data/journal.md. Läuft vor jedem Weckruf (siehe .github/workflows/
 * agent.yml). Das sind Messwerte, keine Redaktion: Das Skript formuliert
 * nichts, es trägt Zahlen ein.
 *
 * Zugang: ein Google-Service-Konto mit Lesezugriff auf die Property
 * sc-domain:openblog.ch. Der JSON-Schlüssel steht in der Umgebungsvariable
 * GOOGLE_SERVICE_ACCOUNT_JSON (der JSON-Inhalt selbst oder ein Pfad zur
 * Datei). Fehlt er, tut das Skript nichts und beendet sich ohne Fehler.
 */
import { createSign } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadEnv, makeScrub } from './env.mjs';

const PROPERTY = 'sc-domain:openblog.ch';
const TAGE = 28;

const env = loadEnv();
let rohesKonto = env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (!rohesKonto) {
  console.log('Kein GOOGLE_SERVICE_ACCOUNT_JSON gesetzt, Livedaten übersprungen.');
  process.exit(0);
}
if (!rohesKonto.trim().startsWith('{')) rohesKonto = readFileSync(rohesKonto, 'utf8');
const konto = JSON.parse(rohesKonto);
const scrub = makeScrub(konto.private_key, rohesKonto);

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

/** Google-OAuth für Service-Konten: signiertes JWT gegen ein Access-Token tauschen. */
async function accessToken() {
  const jetzt = Math.floor(Date.now() / 1000);
  const unsigniert =
    b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })) +
    '.' +
    b64url(
      JSON.stringify({
        iss: konto.client_email,
        scope: 'https://www.googleapis.com/auth/webmasters.readonly',
        aud: 'https://oauth2.googleapis.com/token',
        iat: jetzt,
        exp: jetzt + 3600,
      }),
    );
  const signatur = createSign('RSA-SHA256').update(unsigniert).sign(konto.private_key, 'base64url');
  const antwort = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigniert}.${signatur}`,
    }),
  });
  const daten = await antwort.json();
  if (!antwort.ok || !daten.access_token) {
    throw new Error(`Google-Anmeldung fehlgeschlagen (HTTP ${antwort.status}): ${scrub(JSON.stringify(daten))}`);
  }
  return daten.access_token;
}

async function abfrage(token, dimension, limit) {
  // Die Search Console liefert mit etwa zwei Tagen Verzögerung.
  const ende = new Date(Date.now() - 2 * 86400e3).toISOString().slice(0, 10);
  const start = new Date(Date.now() - (TAGE + 2) * 86400e3).toISOString().slice(0, 10);
  const antwort = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(PROPERTY)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ startDate: start, endDate: ende, dimensions: [dimension], rowLimit: limit }),
    },
  );
  const daten = await antwort.json();
  if (!antwort.ok) {
    throw new Error(`Search-Console-Abfrage (${dimension}) fehlgeschlagen (HTTP ${antwort.status}): ${scrub(JSON.stringify(daten))}`);
  }
  return daten.rows ?? [];
}

const token = await accessToken();
const [seiten, anfragen] = await Promise.all([abfrage(token, 'page', 25), abfrage(token, 'query', 15)]);

const heute = new Date().toISOString().slice(0, 10);
const zeilen = [
  '## Livedaten',
  '',
  `_Google Search Console, letzte ${TAGE} Tage, automatisch eingetragen am ${heute}`,
  'von scripts/livedaten.mjs. Messwerte, keine Redaktion._',
  '',
  'Seiten (Klicks · Impressionen):',
  '',
];
if (seiten.length) {
  for (const r of seiten) {
    const pfad = r.keys[0].replace(/^https?:\/\/[^/]+/, '') || '/';
    zeilen.push(`- ${pfad} · ${r.clicks} · ${r.impressions}`);
  }
} else {
  zeilen.push('- Noch keine Daten. Google braucht nach dem Start einige Tage bis Wochen.');
}
zeilen.push('', 'Suchanfragen (Klicks · Impressionen):', '');
if (anfragen.length) {
  for (const r of anfragen) zeilen.push(`- «${r.keys[0]}» · ${r.clicks} · ${r.impressions}`);
} else {
  zeilen.push('- Noch keine Daten.');
}

const journalPfad = join(ROOT, 'data/journal.md');
const journal = readFileSync(journalPfad, 'utf8');
const neu = journal.replace(/## Livedaten[\s\S]*?(?=\n## |$)/, `${zeilen.join('\n')}\n`);
writeFileSync(journalPfad, neu);
console.log(`Livedaten aktualisiert: ${seiten.length} Seiten, ${anfragen.length} Suchanfragen.`);
