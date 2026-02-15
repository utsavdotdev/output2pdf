# javascript-report-pdf

Create a compact, print-ready A4 PDF from question screenshots named like `1.png`, `2.png`, `11.png`.

The tool balances compact packing with readability so long outputs stay visible.
Question labels are rendered above each image to avoid overlap with screenshot content.

## Install

```bash
npm install -g output2pdf
```

After global install, run from anywhere:

```bash
make-pdf --help
```

For local development in this repository:

```bash
npm install
npm run make-pdf -- --help
```

## Usage

```bash
make-pdf [roll_no] [input_dir] [output_pdf] [options]
```

## Project structure

```text
output2pdf/
├── make-report-pdf.js       # CLI entrypoint (thin wrapper)
├── src/
│   ├── cli.js               # Orchestration flow
│   ├── config.js            # Defaults and constants
│   ├── cli/
│   │   └── parse-args.js    # CLI argument parsing/help
│   ├── deps/
│   │   └── pdf-lib.js       # Dependency loading guard
│   ├── images/
│   │   ├── load-images.js   # PNG discovery + metadata load
│   │   └── png-meta.js      # PNG validation and dimensions
│   ├── layout/
│   │   └── index.js         # Page layout and orientation logic
│   ├── pdf/
│   │   └── generate-pdf.js  # PDF rendering
│   └── utils/
│       ├── args.js          # Generic arg helpers
│       └── questions.js     # Question filename parsing/sorting
├── package.json
└── README.md
```

### Quick examples

```bash
# A4 PDF from current folder, output: javascript-report.pdf
make-pdf

# Add roll number beside every label
make-pdf 48

# Custom output file (".pdf" is auto-added if missing)
make-pdf 48 . final-report

# Extra-tight layout
make-pdf --roll 48 --compact
```

## Options

- `-r, --roll, --roll-no <value>`: Add roll number beside question labels.
- `-i, --input <dir>`: Input folder containing `.png` files.
- `-o, --output <file>`: Output PDF file.
- `-p, --paper <a4|letter>`: Paper size (default: `a4`).
- `--orientation <auto|portrait|landscape>`: Page orientation strategy.
- `-m, --margin <pt>`: Page margin in points.
- `-g, --gap <pt>`: Gap between images in points.
- `--compact`: Tight preset (`margin=8`, `gap=4`, `targetRowHeight=120`).
- `--no-labels`: Disable question labels.

## Input format

- Files must be PNG: `*.png`
- Best ordering is numeric file names: `1.png`, `2.png`, ..., `10.png`

## License

MIT
