const fs = require('fs/promises');
const { loadPdfLib } = require('../deps/pdf-lib');
const { getLabelConfig } = require('../layout');

async function generatePdf(images, layout, opts, outputPath) {
  const { PDFDocument, StandardFonts, rgb } = loadPdfLib();
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const labelCfg = getLabelConfig(opts);

  const embedded = [];
  for (const img of images) {
    embedded.push(await pdfDoc.embedPng(img.data));
  }

  for (const pageLayout of layout.pages) {
    const page = pdfDoc.addPage([layout.pageW, layout.pageH]);
    let yTop = layout.pageH - opts.margin;

    for (const row of pageLayout.rows) {
      const imageH = row.imageHeight;

      let rowContentW = 0;
      for (const idx of row.indices) {
        rowContentW += images[idx].ratio * imageH;
      }
      rowContentW += opts.gap * (row.indices.length - 1);

      let x = opts.margin + (layout.innerW - rowContentW) / 2;
      const y = yTop - row.height;
      const imageTop = y + imageH;

      for (const idx of row.indices) {
        const img = images[idx];
        const imgW = img.ratio * imageH;

        page.drawImage(embedded[idx], {
          x,
          y,
          width: imgW,
          height: imageH,
        });

        if (opts.labels) {
          const qLabel = `Q${img.label}`;
          const label = opts.rollNo ? `${qLabel} | Roll: ${opts.rollNo}` : qLabel;
          page.drawText(label, {
            x: x + 1,
            y: imageTop + labelCfg.gap,
            size: labelCfg.size,
            font,
            color: rgb(0, 0, 0),
          });
        }

        x += imgW + opts.gap;
      }

      yTop = y - opts.gap;
    }
  }

  const bytes = await pdfDoc.save();
  await fs.writeFile(outputPath, bytes);
}

module.exports = {
  generatePdf,
};
