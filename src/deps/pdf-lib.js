function loadPdfLib() {
  try {
    return require('pdf-lib');
  } catch (err) {
    if (err && err.code === 'MODULE_NOT_FOUND' && err.message.includes('pdf-lib')) {
      throw new Error('Missing dependency: pdf-lib. Run: npm install');
    }
    throw err;
  }
}

module.exports = {
  loadPdfLib,
};
