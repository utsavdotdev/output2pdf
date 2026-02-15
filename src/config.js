const PAPER_SIZES = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

const DEFAULT_OPTIONS = {
  output: 'javascript-report.pdf',
  paper: 'a4',
  orientation: 'auto',
  margin: 20,
  gap: 10,
  minRowHeight: 90,
  targetRowHeight: 180,
  maxRowHeight: 520,
  labels: true,
  rollNo: '',
};

const COMPACT_PRESET = {
  margin: 8,
  gap: 4,
  minRowHeight: 70,
  targetRowHeight: 120,
  maxRowHeight: 260,
};

module.exports = {
  PAPER_SIZES,
  DEFAULT_OPTIONS,
  COMPACT_PRESET,
};
