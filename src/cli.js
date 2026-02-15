const path = require('path');
const { parseArgs } = require('./cli/parse-args');
const { loadImages } = require('./images/load-images');
const { pickBestOrientation } = require('./layout');
const { generatePdf } = require('./pdf/generate-pdf');

async function run(argv = process.argv.slice(2)) {
  const opts = parseArgs(argv);
  const images = await loadImages(opts.inputDir);
  const best = pickBestOrientation(images, opts);
  const outputPath = path.resolve(opts.output);

  await generatePdf(images, best.layout, opts, outputPath);

  console.log(`PDF created: ${outputPath}`);
  console.log(`Images: ${images.length}`);
  console.log(`Pages: ${best.layout.pages.length}`);
  console.log(`Orientation used: ${best.orientation}`);
}

module.exports = {
  run,
};
