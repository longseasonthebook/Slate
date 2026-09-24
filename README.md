# qvac-translator

A small, fully offline text translator that runs entirely **on your own
device** using [Tether's QVAC SDK](https://qvac.tether.io). No API key, no
server call, no bill — and your text never leaves your machine.

It defaults to **Estonian → English**, a genuinely low-resource language
pair, using a local [Bergamot](https://browser.mt) neural machine
translation model. It also works with any of the ~50 languages QVAC bundles
Bergamot models for (Maltese, Icelandic, Albanian, Vietnamese, Swahili
region languages, etc.) by passing `--from`/`--to`.

## What it does

Loads a Bergamot NMT model on-device with QVAC's `loadModel()`, then
translates the given text locally with `translate()`. Everything — model
inference included — runs on the machine you launch it on.

## Requirements

- Node.js **>= 22.17**
- npm **>= 10.9**
- ~5 GB free disk (for the model cache directory) and a normal internet
  connection **the first time you run it**, to fetch the (small, ~30 MB)
  translation model from QVAC's model registry. After that first download,
  translation is 100% offline.
- See QVAC's [system requirements](https://docs.qvac.tether.io/system-requirements)
  for OS/GPU notes (Linux and Windows need a Vulkan 1.4+ driver; macOS uses
  Metal automatically).

## SDK version used

[`@qvac/sdk`](https://www.npmjs.com/package/@qvac/sdk) **^0.19.0** (tested
against 0.19.1).

## Install

```bash
git clone <this-repo-url>
cd qvac-translator
npm install
```

## Run

```bash
# Default: Estonian -> English
node translate.js "Tere, kuidas Sul läheb?"

# Any other bundled pair
node translate.js --from en --to mt "Where is the nearest pharmacy?"

# Translate a whole text file
node translate.js --from et --to en --file sample-et.txt
```

Or via npm:

```bash
npm start -- "Tere, kuidas Sul läheb?"
```

On the very first run, QVAC downloads the translation model to a local
cache (`~/.qvac/models` by default) and prints download progress. Every run
after that loads the model straight from disk and performs inference
locally — no network calls.

A `qvac.config.json` is included to enable QVAC's own console logs during
the run, so you can see the SDK's model-loading and inference activity.

## How it works

1. `loadModel()` loads a Bergamot NMT model (e.g. `BERGAMOT_ET_EN`) for the
   requested language pair, resolved dynamically from the SDK's exported
   model constants.
2. `translate()` runs the translation entirely on-device and streams the
   translated tokens to stdout.
3. `unloadModel()` frees the model from memory when done.

See [`translate.js`](./translate.js) for the full, ~90-line implementation.

## What app does / which QVAC function it calls

A CLI text translator that calls QVAC's `loadModel()` + `translate()` to
run an offline Bergamot NMT model on-device.

## License

[MIT](./LICENSE)
