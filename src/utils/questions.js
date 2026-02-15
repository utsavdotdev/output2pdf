const path = require('path');

function parseQuestionName(filename) {
  const base = path.basename(filename, path.extname(filename));
  const match = base.match(/^(\d+)/);
  const n = match ? Number(match[1]) : Number.NaN;
  return {
    base,
    numeric: Number.isFinite(n) ? n : null,
  };
}

function sortQuestionFiles(files) {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  return [...files].sort((a, b) => {
    const qa = parseQuestionName(a);
    const qb = parseQuestionName(b);

    if (qa.numeric !== null && qb.numeric !== null && qa.numeric !== qb.numeric) {
      return qa.numeric - qb.numeric;
    }

    if (qa.numeric !== null && qb.numeric === null) return -1;
    if (qa.numeric === null && qb.numeric !== null) return 1;

    return collator.compare(qa.base, qb.base);
  });
}

module.exports = {
  parseQuestionName,
  sortQuestionFiles,
};
