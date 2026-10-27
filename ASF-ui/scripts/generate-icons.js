/*
 * Generates `src/plugins/icons-data.js` — the inline SVG registry for the
 * XinuSteamFarm icon set ("xicons").
 *
 * Icon geometry is derived from Lucide (https://lucide.dev, ISC license),
 * restyled for the Amaterasu design language: 24px grid, hairline strokes.
 * Brand and special-purpose glyphs are hand-drawn below.
 *
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const LUCIDE_DIR = path.resolve(__dirname, '../node_modules/lucide-static/icons');
const OUT_FILE = path.resolve(__dirname, '../src/plugins/icons-data.js');

// FontAwesome icon name (used across templates) -> Lucide source file name
const LUCIDE_MAP = {
  'angle-down': 'chevron-down',
  'ban': 'ban',
  'bars': 'menu',
  'book-open': 'book-open',
  'check-circle': 'circle-check',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'clipboard': 'clipboard',
  'clock': 'clock',
  'clone': 'copy',
  'cloud-download-alt': 'download',
  'code-branch': 'git-branch',
  'cogs': 'settings',
  'comments': 'messages-square',
  'edit': 'pen-line',
  'eye': 'eye',
  'eye-slash': 'eye-off',
  'file-alt': 'file-text',
  'gamepad': 'gamepad-2',
  'key': 'key',
  'language': 'languages',
  'laptop': 'terminal',
  'lock': 'lock',
  'moon': 'moon',
  'palette': 'palette',
  'paste': 'clipboard-paste',
  'pause': 'pause',
  'play': 'play',
  'plus': 'plus',
  'power-off': 'power',
  'puzzle-piece': 'puzzle',
  'question': 'circle-help',
  'redo-alt': 'rotate-cw',
  'sign-out-alt': 'log-out',
  'spinner': 'loader-circle',
  'square': 'square',
  'tachometer-alt': 'gauge',
  'times': 'x',
  'times-circle': 'circle-x',
  'trash': 'trash-2',
  'undo-alt': 'rotate-ccw',
  'users': 'users',
  'wrench': 'wrench',
};

// Hand-drawn glyphs (24px grid, hairline-stroke geometry)
const CUSTOM = {
  // Hourglass family — outline from Lucide's hourglass, sand drawn as fills
  'hourglass-start': `
<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/><path d="M9 5h6l-2.2 4H11.2z" fill="currentColor" stroke="none"/>`,
  'hourglass-half': `
<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/><path d="M9.5 5.5h5L12 8.6z" fill="currentColor" stroke="none"/><path d="M9.5 18.5h5L12 15.4z" fill="currentColor" stroke="none"/>`,
  'hourglass-end': `
<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/><path d="M9 19h6l-2.2-4H11.2z" fill="currentColor" stroke="none"/>`,
  // Small alert mark used by the footer release notification
  'exclamation': `
<path d="M12 4.5v9"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>`,
  // GitHub octocat mark (official glyph, fill-based) — 16px grid scaled 1.5x
  'github': `
<g transform="scale(1.5)"><path fill="currentColor" stroke="none" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></g>`,
  // XinuSteamFarm brand mark — an X woven from two steam wisps on rails
  'xinu': `
<path d="M4 21h16"/><path d="M7 17C7 12.5 17 12.5 17 8"/><path d="M17 17C17 12.5 7 12.5 7 8"/><path d="M9 4.5c.6-1 2-1 2.6 0"/><path d="M13.5 4.5c.6-1 2-1 2.6 0"/>`,
};

function readLucideInner(fileName) {
  const raw = fs.readFileSync(path.join(LUCIDE_DIR, `${fileName}.svg`), 'utf8');
  const match = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  if (!match) throw new Error(`No svg element found in ${fileName}.svg`);
  return match[1]
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+class="[^"]*"/g, '')
    .replace(/\n\s*/g, ' ')
    .trim();
}

const entries = {};
for (const [name, file] of Object.entries(LUCIDE_MAP)) {
  entries[name] = readLucideInner(file);
}
for (const [name, body] of Object.entries(CUSTOM)) {
  entries[name] = body.trim();
}

const names = Object.keys(entries).sort();
const fileContent = `/*
 * GENERATED FILE — do not edit by hand.
 * Regenerate with: node scripts/generate-icons.js
 *
 * Icon geometry derived from Lucide (https://lucide.dev, ISC license),
 * plus hand-drawn XinuSteamFarm glyphs. Each entry is the inner markup of a
 * 24x24 icon rendered by the \`FontAwesomeIcon\` component in icons.js.
 */

export const XICONS = {
${names.map(name => `  '${name}': ${JSON.stringify(entries[name])},`).join('\n')}
};

export const XICONS_AVAILABLE = ${JSON.stringify(names)};
`;

fs.writeFileSync(OUT_FILE, fileContent);
console.log(`Wrote ${names.length} icons to ${path.relative(process.cwd(), OUT_FILE)}`);
