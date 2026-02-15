const fs = require('fs/promises');

async function readPngMeta(filePath) {
  const data = await fs.readFile(filePath);

  if (data.length < 24) {
    throw new Error(`Invalid PNG (too small): ${filePath}`);
  }

  const signature = data.subarray(0, 8);
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!signature.equals(pngSig)) {
    throw new Error(`Not a PNG file: ${filePath}`);
  }

  const chunkName = data.subarray(12, 16).toString('ascii');
  if (chunkName !== 'IHDR') {
    throw new Error(`Invalid PNG structure (missing IHDR): ${filePath}`);
  }

  const width = data.readUInt32BE(16);
  const height = data.readUInt32BE(20);

  if (width === 0 || height === 0) {
    throw new Error(`Invalid PNG dimensions in ${filePath}`);
  }

  return { data, width, height };
}

module.exports = {
  readPngMeta,
};
