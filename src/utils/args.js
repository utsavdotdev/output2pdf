function normalizeArgs(argv) {
  const out = [];
  for (const arg of argv) {
    if (arg.startsWith('--') && arg.includes('=')) {
      const [key, value] = arg.split(/=(.*)/s);
      out.push(key);
      out.push(value);
    } else {
      out.push(arg);
    }
  }
  return out;
}

function ensurePdfFilename(filename) {
  if (!filename) return 'javascript-report.pdf';
  return /\.pdf$/i.test(filename) ? filename : `${filename}.pdf`;
}

module.exports = {
  normalizeArgs,
  ensurePdfFilename,
};
