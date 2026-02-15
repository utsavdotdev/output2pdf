const fs = require('fs/promises');
const path = require('path');
const { readPngMeta } = require('./png-meta');
const { parseQuestionName, sortQuestionFiles } = require('../utils/questions');

async function loadImages(inputDir) {
  const entries = await fs.readdir(inputDir, { withFileTypes: true });
  const pngFiles = entries
    .filter((entry) => entry.isFile() && /\.png$/i.test(entry.name))
    .map((entry) => entry.name);

  if (pngFiles.length === 0) {
    throw new Error(`No PNG files found in: ${inputDir}`);
  }

  const sorted = sortQuestionFiles(pngFiles);
  const images = [];

  for (const file of sorted) {
    const filePath = path.join(inputDir, file);
    const { data, width, height } = await readPngMeta(filePath);
    const question = parseQuestionName(file);

    images.push({
      file,
      filePath,
      data,
      width,
      height,
      ratio: width / height,
      label: question.numeric !== null ? String(question.numeric) : question.base,
    });
  }

  return images;
}

module.exports = {
  loadImages,
};
