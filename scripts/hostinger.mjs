#!/usr/bin/env node
/**
 * Kleiner Client für die Hostinger-API.
 *
 * Der Token wird aus .env gelesen und niemals ausgegeben — auch nicht in
 * Fehlermeldungen. Wenn ein Wert nach einem Token aussieht, wird er maskiert.
 *
 *   node scripts/hostinger.mjs probe        # Token testen, Rechte ermitteln
 *   node scripts/hostinger.mjs get <pfad>   # beliebigen GET-Endpunkt abfragen
 *
 * Doku: https://developers.hostinger.com
 */

import { loadEnv, makeScrub, requireKey } from './env.mjs';

const BASE = 'https://developers.hostinger.com/api';

const env = loadEnv();
const TOKEN = requireKey(
  env,
  'HOSTINGER_API_TOKEN',
  'Trage ihn in .env ein (Datei ist gitignored) und starte erneut.',
);

/** Verhindert, dass der Token je in einer Ausgabe auftaucht. */
const scrub = makeScrub(TOKEN);

async function request(path) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
      'User-Agent': 'openblog-deploy/0.1',
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

/** Endpunkte, die wir der Reihe nach anklopfen, um die Rechte zu ermitteln. */
const PROBES = [
  ['Domains — Portfolio', '/domains/v1/portfolio'],
  ['DNS — Zone openblog.ch', '/dns/v1/zones/openblog.ch'],
  ['VPS — Virtuelle Maschinen', '/vps/v1/virtual-machines'],
  ['VPS — Rechenzentren', '/vps/v1/data-centers'],
  ['Billing — Abos', '/billing/v1/subscriptions'],
];

async function probe() {
  console.log('Prüfe Token gegen die Hostinger-API …\n');
  const results = [];

  for (const [label, path] of PROBES) {
    try {
      const { status, ok, body } = await request(path);
      const note = ok
        ? Array.isArray(body)
          ? `${body.length} Einträge`
          : Array.isArray(body?.data)
            ? `${body.data.length} Einträge`
            : 'OK'
        : scrub(body?.message ?? body?.error ?? '');
      results.push({ label, status, ok, note: String(note).slice(0, 90) });
    } catch (err) {
      results.push({ label, status: '—', ok: false, note: scrub(err.message).slice(0, 90) });
    }
  }

  const w = Math.max(...results.map((r) => r.label.length));
  for (const r of results) {
    const mark = r.ok ? '✓' : '✗';
    console.log(`${mark} ${r.label.padEnd(w)}  ${String(r.status).padEnd(4)} ${r.note}`);
  }

  const anyOk = results.some((r) => r.ok);
  const allAuthFail = results.every((r) => r.status === 401 || r.status === 403);

  console.log('');
  if (allAuthFail) {
    console.log('Token wird abgelehnt — abgelaufen, falsch kopiert oder ohne Rechte.');
  } else if (anyOk) {
    console.log('Token funktioniert. Die mit ✓ markierten Bereiche sind zugänglich.');
  } else {
    console.log('Kein Bereich erreichbar. Antwortcodes oben prüfen.');
  }
}

async function get(path) {
  if (!path) {
    console.error('Pfad fehlt. Beispiel: node scripts/hostinger.mjs get /domains/v1/portfolio');
    process.exit(1);
  }
  const { status, body } = await request(path);
  console.log(`HTTP ${status}`);
  console.log(scrub(typeof body === 'string' ? body : JSON.stringify(body, null, 2)));
}

const [cmd, arg] = process.argv.slice(2);

switch (cmd) {
  case 'probe':
  case undefined:
    await probe();
    break;
  case 'get':
    await get(arg);
    break;
  default:
    console.error(`Unbekannter Befehl: ${cmd}\nVerfügbar: probe, get <pfad>`);
    process.exit(1);
}
