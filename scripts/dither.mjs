#!/usr/bin/env node
/**
 * Wandelt ein Bild in echtes Schwarzweiss um — ein Bit, keine Graustufen.
 *
 * Bildmodelle liefern weiche Graustufen mit Kantenglättung. Erst dieser Schritt
 * erzeugt die Anmutung aus docs/bildsprache.md.
 *
 * Nur Node-Bordmittel, keine Abhängigkeiten. Ein- und Ausgabe sind PNG.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import zlib from 'node:zlib';

const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// --- PNG ------------------------------------------------------------------

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

const crc32 = (b) => {
  let c = -1;
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

/** Dekodiert ein 8-Bit-PNG zu einer Graustufenebene (Float 0..1). */
function decodeToGray(buf) {
  if (!buf.subarray(0, 8).equals(SIG)) {
    throw new Error('Keine PNG-Datei. JPEG vorher umwandeln: sips -s format png bild.jpg --out bild.png');
  }

  const chunks = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    chunks.push({ type: buf.toString('ascii', off + 4, off + 8), data: buf.subarray(off + 8, off + 8 + len) });
    off += 12 + len;
  }

  const ihdr = chunks.find((c) => c.type === 'IHDR').data;
  const width = ihdr.readUInt32BE(0);
  const height = ihdr.readUInt32BE(4);
  const depth = ihdr[8];
  const colorType = ihdr[9];

  if (depth !== 8) throw new Error(`Bittiefe ${depth} wird nicht unterstützt (nur 8).`);
  if (ihdr[12] !== 0) throw new Error('Interlaced PNG wird nicht unterstützt.');

  const plte = chunks.find((c) => c.type === 'PLTE')?.data;
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`Farbtyp ${colorType} wird nicht unterstützt.`);

  const idat = zlib.inflateSync(
    Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data)),
  );

  const stride = width * channels;
  const raw = Buffer.alloc(height * stride);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    const filter = idat[pos++];
    const cur = raw.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? raw.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const rb = idat[pos + x];
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= channels ? prev[x - channels] : 0;
      let v;
      switch (filter) {
        case 0: v = rb; break;
        case 1: v = rb + a; break;
        case 2: v = rb + b; break;
        case 3: v = rb + ((a + b) >> 1); break;
        case 4: v = rb + paeth(a, b, c); break;
        default: throw new Error(`Unbekannter Zeilenfilter ${filter}`);
      }
      cur[x] = v & 0xff;
    }
    pos += stride;
  }

  // Rec.709-Luma, Alpha gegen Weiss verrechnet.
  const gray = new Float32Array(width * height);
  for (let i = 0, n = width * height; i < n; i++) {
    const s = i * channels;
    let r, g, b, alpha = 255;
    if (colorType === 0) { r = g = b = raw[s]; }
    else if (colorType === 4) { r = g = b = raw[s]; alpha = raw[s + 1]; }
    else if (colorType === 2) { r = raw[s]; g = raw[s + 1]; b = raw[s + 2]; }
    else if (colorType === 6) { r = raw[s]; g = raw[s + 1]; b = raw[s + 2]; alpha = raw[s + 3]; }
    else { const p = raw[s] * 3; r = plte[p]; g = plte[p + 1]; b = plte[p + 2]; }
    const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const a = alpha / 255;
    gray[i] = luma * a + (1 - a); // transparent -> Papier
  }

  return { width, height, gray };
}

/** Schreibt eine echte 1-Bit-Graustufen-PNG (8 Pixel pro Byte). */
function encode1Bit(width, height, bits) {
  const rowBytes = Math.ceil(width / 8);
  const raw = Buffer.alloc(height * (rowBytes + 1));

  for (let y = 0; y < height; y++) {
    const base = y * (rowBytes + 1);
    raw[base] = 0; // Filter: keiner
    for (let x = 0; x < width; x++) {
      if (bits[y * width + x]) raw[base + 1 + (x >> 3)] |= 0x80 >> (x & 7);
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 1; // Bittiefe
  ihdr[9] = 0; // Graustufen

  return Buffer.concat([
    SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Verfahren ------------------------------------------------------------

/** Fehlerdiffusion. Kerne aus docs/bildsprache.md, Abschnitt 4A. */
const KERNELS = {
  floyd: { div: 16, taps: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]] },
  atkinson: { div: 8, taps: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]] },
};

function diffuse(width, height, gray, kernel) {
  const buf = Float32Array.from(gray);
  const bits = new Uint8Array(width * height);
  const { div, taps } = KERNELS[kernel];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const old = buf[i];
      const val = old < 0.5 ? 0 : 1;
      bits[i] = val;
      const err = old - val;
      for (const [dx, dy, w] of taps) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny >= height) continue;
        buf[ny * width + nx] += (err * w) / div;
      }
    }
  }
  return bits;
}

/** Geordnetes 8×8-Bayer-Raster. Abschnitt 4B. */
function bayer(width, height, gray) {
  const M = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ];
  const bits = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = (M[y & 7][x & 7] + 0.5) / 64;
      bits[y * width + x] = gray[y * width + x] > t ? 1 : 0;
    }
  }
  return bits;
}

/** Zeilenraster: Linienstärke folgt der Helligkeit. Abschnitt 4C. */
function scanlines(width, height, gray, period) {
  const bits = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const phase = (y % period) / period;
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      // Je dunkler das Pixel, desto breiter das schwarze Band in der Periode.
      bits[i] = phase < gray[i] ? 1 : 0;
    }
  }
  return bits;
}

// --- CLI ------------------------------------------------------------------

const HELP = `
dither — Bild in echtes Schwarzweiss umwandeln (ein Bit, keine Graustufen)

  node scripts/dither.mjs <ein.png> <aus.png> [Optionen]

Optionen
  --mode <name>      atkinson (Standard) | floyd | bayer | lines
  --invert           negative Fassung: weisse Zeichnung auf Schwarz
  --contrast <n>     Kontrast vor dem Rastern, 1 = unverändert (Standard 1.15)
  --brightness <n>   Helligkeit vor dem Rastern, 0 = unverändert
  --period <n>       nur bei --mode lines: Zeilenabstand in Pixeln (Standard 4)
  -h, --help         diese Hilfe

Verfahren (siehe docs/bildsprache.md, Abschnitt 4)
  atkinson   Fehlerdiffusion, kontrastreich — Standard für Fotos
  floyd      Fehlerdiffusion, tonwerttreuer, feineres Korn
  bayer      geordnetes Raster, technische Anmutung
  lines      Zeilenraster, für Porträts und Frontales

Eingabe muss PNG sein. JPEG vorher umwandeln:
  sips -s format png bild.jpg --out bild.png

Beispiele
  node scripts/dither.mjs roh.png public/blog/mein-beitrag.png
  node scripts/dither.mjs roh.png public/blog/mein-beitrag-invers.png --invert
  node scripts/dither.mjs portraet.png out.png --mode lines --period 5
`;

const argv = process.argv.slice(2);

if (argv.length === 0 || argv.includes('-h') || argv.includes('--help')) {
  console.log(HELP.trim());
  process.exit(argv.length === 0 ? 1 : 0);
}

const BOOLEAN_FLAGS = new Set(['invert']);
const opts = {};
const positional = [];

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (!arg.startsWith('--')) {
    positional.push(arg);
    continue;
  }
  const name = arg.slice(2);
  if (BOOLEAN_FLAGS.has(name)) opts[name] = true;
  else opts[name] = argv[++i]; // Wert gehört zur Option, nicht zu den Dateinamen
}

const flag = (name, fallback) => opts[name] ?? fallback;
const [input, output] = positional;

if (!input || !output) {
  console.error('Ein- und Ausgabedatei angeben. --help zeigt die Hilfe.');
  process.exit(1);
}

const mode = flag('mode', 'atkinson');
const invert = Boolean(opts.invert);
const contrast = Number(flag('contrast', '1.15'));
const brightness = Number(flag('brightness', '0'));
const period = Math.max(2, Number(flag('period', '4')));

if (!['atkinson', 'floyd', 'bayer', 'lines'].includes(mode)) {
  console.error(`Unbekanntes Verfahren: ${mode}. Erlaubt: atkinson, floyd, bayer, lines`);
  process.exit(1);
}

let decoded;
try {
  decoded = decodeToGray(readFileSync(input));
} catch (err) {
  console.error(err.code === 'ENOENT' ? `Datei nicht gefunden: ${input}` : err.message);
  process.exit(1);
}
const { width, height, gray } = decoded;

// Kontrast um den Mittelton, danach Helligkeit — beides vor dem Rastern.
for (let i = 0; i < gray.length; i++) {
  let v = (gray[i] - 0.5) * contrast + 0.5 + brightness;
  gray[i] = v < 0 ? 0 : v > 1 ? 1 : v;
}

let bits;
switch (mode) {
  case 'bayer': bits = bayer(width, height, gray); break;
  case 'lines': bits = scanlines(width, height, gray, period); break;
  default: bits = diffuse(width, height, gray, mode); break;
}

if (invert) for (let i = 0; i < bits.length; i++) bits[i] ^= 1;

writeFileSync(output, encode1Bit(width, height, bits));

let ink = 0;
for (let i = 0; i < bits.length; i++) if (!bits[i]) ink++;

const pct = ((ink / bits.length) * 100).toFixed(1);
const kb = (readFileSync(output).length / 1024).toFixed(0);

console.log(
  `${output}  ${width}×${height}  ${mode}${invert ? ' invers' : ''}  ${pct} % Tinte  ${kb} kB`,
);
