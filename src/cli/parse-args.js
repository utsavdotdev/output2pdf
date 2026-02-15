const path = require('path');
const { COMPACT_PRESET, DEFAULT_OPTIONS, PAPER_SIZES } = require('../config');
const { ensurePdfFilename, normalizeArgs } = require('../utils/args');

function parseArgs(argv) {
  const args = normalizeArgs(argv);
  const opts = {
    ...DEFAULT_OPTIONS,
    inputDir: process.cwd(),
  };
  const positional = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--input' || arg === '-i') {
      opts.inputDir = path.resolve(args[++i]);
    } else if (arg === '--output' || arg === '-o') {
      opts.output = ensurePdfFilename(args[++i]);
    } else if (arg === '--paper' || arg === '-p') {
      opts.paper = String(args[++i] || '').toLowerCase();
    } else if (arg === '--orientation') {
      opts.orientation = String(args[++i] || '').toLowerCase();
    } else if (arg === '--margin' || arg === '-m') {
      opts.margin = Number(args[++i]);
    } else if (arg === '--gap' || arg === '-g') {
      opts.gap = Number(args[++i]);
    } else if (arg === '--min-row-height') {
      opts.minRowHeight = Number(args[++i]);
    } else if (arg === '--target-row-height') {
      opts.targetRowHeight = Number(args[++i]);
    } else if (arg === '--max-row-height') {
      opts.maxRowHeight = Number(args[++i]);
    } else if (arg === '--roll-no' || arg === '--roll' || arg === '-r') {
      opts.rollNo = String(args[++i] || '').trim();
    } else if (arg === '--compact') {
      Object.assign(opts, COMPACT_PRESET);
    } else if (arg === '--no-labels') {
      opts.labels = false;
    } else if (arg === '--labels') {
      opts.labels = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  if (positional.length > 3) {
    throw new Error('Too many positional arguments. Use --help for usage.');
  }

  if (positional[0] && !opts.rollNo) {
    opts.rollNo = String(positional[0]).trim();
  }
  if (positional[1]) {
    opts.inputDir = path.resolve(positional[1]);
  }
  if (positional[2]) {
    opts.output = ensurePdfFilename(positional[2]);
  }

  if (!PAPER_SIZES[opts.paper]) {
    throw new Error(`Unsupported paper size "${opts.paper}". Use: a4, letter`);
  }

  if (!['auto', 'portrait', 'landscape'].includes(opts.orientation)) {
    throw new Error('Orientation must be one of: auto, portrait, landscape');
  }

  const numericValues = [
    opts.margin,
    opts.gap,
    opts.minRowHeight,
    opts.targetRowHeight,
    opts.maxRowHeight,
  ];
  if (numericValues.some((n) => Number.isNaN(n) || n < 0)) {
    throw new Error('Numeric options must be valid non-negative numbers.');
  }

  if (opts.minRowHeight > opts.maxRowHeight) {
    throw new Error('--min-row-height cannot be greater than --max-row-height');
  }

  return opts;
}

function printHelp() {
  const d = DEFAULT_OPTIONS;
  const c = COMPACT_PRESET;

  console.log(`Usage:
  node make-report-pdf.js [roll_no] [input_dir] [output_pdf] [options]

Options:
  -r, --roll, --roll-no <v>    Roll number shown beside each question label
  -i, --input <dir>            Input folder with [question_no].png files (default: current folder)
  -o, --output <file>          Output PDF file (default: ${d.output})
  -p, --paper <a4|letter>      Paper size (default: ${d.paper})
      --orientation <mode>     auto | portrait | landscape (default: ${d.orientation})
  -m, --margin <points>        Page margin in points (default: ${d.margin})
  -g, --gap <points>           Gap between items in points (default: ${d.gap})
      --min-row-height <pt>    Minimum row height (default: ${d.minRowHeight})
      --target-row-height <pt> Target row height for packing (default: ${d.targetRowHeight})
      --max-row-height <pt>    Maximum row height (default: ${d.maxRowHeight})
      --compact                Tight preset (margin=${c.margin}, gap=${c.gap}, targetRowHeight=${c.targetRowHeight})
      --labels                 Enable question labels (default)
      --no-labels              Disable question number labels
  -h, --help                   Show this help

Examples:
  node make-report-pdf.js
  node make-report-pdf.js 48
  node make-report-pdf.js 48 . submission.pdf
  node make-report-pdf.js --roll 48 --compact --orientation auto
`);
}

module.exports = {
  parseArgs,
  printHelp,
};
