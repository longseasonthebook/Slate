#!/usr/bin/env node
/**
 * qvac-translator — a fully offline, on-device text translator.
 *
 * Uses Tether's QVAC SDK (@qvac/sdk) to run a Bergamot neural machine
 * translation model directly on this machine. No API key, no server call,
 * no data leaves the device. The first run downloads the model once;
 * every run after that is 100% local.
 *
 * Defaults to Estonian -> English, a genuinely low-resource language pair,
 * but works with any of the ~50 languages QVAC bundles Bergamot models for
 * (see LANGUAGES below) via --from/--to.
 *
 * Usage:
 *   node translate.js "Tere, kuidas Sul läheb?"
 *   node translate.js --from en --to mt "Where is the nearest pharmacy?"
 *   node translate.js --from et --to en --file notes.txt
 */

import { loadModel, translate, unloadModel } from '@qvac/sdk';
import * as qvac from '@qvac/sdk';
import { readFileSync } from 'node:fs';

// A sample of the low-resource Bergamot pairs QVAC ships out of the box.
// (QVAC bundles ~50 languages total; run with an unsupported code to see
// the full list from the SDK's own registry.)
const EXAMPLE_LANGUAGES = ['et', 'mt', 'is', 'sq', 'lv', 'lt', 'sk', 'bg', 'uk', 'vi'];

function parseArgs(argv) {
  const args = { from: 'et', to: 'en', file: null, text: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--from') args.from = argv[++i];
    else if (arg === '--to') args.to = argv[++i];
    else if (arg === '--file') args.file = argv[++i];
    else rest.push(arg);
  }
  if (rest.length) args.text = rest.join(' ');
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const inputText = args.file
    ? readFileSync(args.file, 'utf-8').trim()
    : args.text;

  if (!inputText) {
    console.error('Usage: node translate.js [--from et] [--to en] [--file path] "text to translate"');
    console.error(`Example low-resource pairs: ${EXAMPLE_LANGUAGES.join(', ')} (any <-> en)`);
    process.exit(1);
  }

  const from = args.from.toLowerCase();
  const to = args.to.toLowerCase();
  const constantName = `BERGAMOT_${from.toUpperCase()}_${to.toUpperCase()}`;
  const modelSrc = qvac[constantName];

  if (!modelSrc) {
    console.error(`✖ No bundled QVAC model constant "${constantName}" for ${from} -> ${to}.`);
    console.error(`  Try one of the built-in pairs, e.g. --from et --to en, --from en --to mt, --from en --to is.`);
    process.exit(1);
  }

  console.log(`▸ Loading on-device model for ${from} -> ${to} (${constantName})...`);
  console.log('  (First run downloads the model to your machine; later runs are instant.)');

  const modelId = await loadModel({
    modelSrc,
    modelType: 'nmt',
    modelConfig: { engine: 'Bergamot', from, to },
    onProgress: (p) => {
      const mb = (n) => (n / 1e6).toFixed(1);
      const line = `  ▸ Downloading ${p.percentage.toFixed(0)}% (${mb(p.downloaded)}/${mb(p.total)} MB)`;
      process.stderr.write(process.stderr.isTTY ? `\r${line}` : `${line}\n`);
      if (p.percentage >= 100) process.stderr.write('\n');
    },
  });

  console.log('✓ Model loaded on-device. Translating locally (no network calls)...\n');

  const result = translate({
    modelId,
    text: inputText,
    modelType: 'nmt',
    stream: true,
  });

  process.stdout.write(`[${from} -> ${to}] `);
  for await (const token of result.tokenStream) {
    process.stdout.write(token);
  }
  console.log('\n');

  await unloadModel({ modelId, clearStorage: false });
}

main().catch((error) => {
  console.error('✖ Error:', error?.message ?? error);
  process.exit(1);
});
