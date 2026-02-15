const { PAPER_SIZES } = require('../config');

function getPageSize(paper, orientation) {
  const [w, h] = PAPER_SIZES[paper];
  if (orientation === 'landscape') {
    return [Math.max(w, h), Math.min(w, h)];
  }
  return [Math.min(w, h), Math.max(w, h)];
}

function getLabelConfig(cfg) {
  const size = 10;
  const gap = 4;
  const space = cfg.labels ? size + gap : 0;
  return { size, gap, space };
}

function buildLayout(images, pageW, pageH, cfg) {
  const innerW = pageW - 2 * cfg.margin;
  const innerH = pageH - 2 * cfg.margin;
  const labelCfg = getLabelConfig(cfg);

  if (innerW <= 0 || innerH <= 0) {
    throw new Error('Page margin too large for selected paper size.');
  }

  const pages = [];
  let idx = 0;

  while (idx < images.length) {
    const rows = [];
    let usedH = 0;

    while (idx < images.length) {
      const row = chooseRow(
        images,
        idx,
        innerW,
        cfg.gap,
        cfg.minRowHeight,
        cfg.targetRowHeight,
        cfg.maxRowHeight,
        labelCfg.space,
      );
      const extraGap = rows.length > 0 ? cfg.gap : 0;

      if (usedH + extraGap + row.height > innerH) {
        if (rows.length === 0) {
          const forcedRow = forceSingleRow(images, idx, innerW, innerH, cfg, labelCfg.space);
          rows.push(forcedRow);
          idx = forcedRow.nextIndex;
          usedH = forcedRow.height;
        }
        break;
      }

      rows.push(row);
      idx = row.nextIndex;
      usedH += extraGap + row.height;
    }

    pages.push({ rows, usedH, innerH });
  }

  const waste = pages.reduce((sum, page) => sum + (page.innerH - page.usedH), 0);

  return { pages, pageW, pageH, innerW, innerH, waste };
}

function chooseRow(images, start, innerW, gap, minH, targetH, maxH, labelSpace) {
  let ratioSum = 0;
  let best = null;

  for (let end = start; end < images.length; end += 1) {
    ratioSum += images[end].ratio;
    const count = end - start + 1;
    const widthForImages = innerW - gap * (count - 1);

    if (widthForImages <= 0) break;

    const imageHeight = widthForImages / ratioSum;

    if (imageHeight <= maxH && imageHeight >= minH) {
      const diff = Math.abs(imageHeight - targetH);
      if (!best || diff < best.diff) {
        best = { end, imageHeight, diff };
      }
    }

    if (imageHeight < minH) {
      break;
    }
  }

  if (!best) {
    const single = images[start];
    const imageHeight = chooseSingleImageHeight(single, innerW, minH, maxH);
    return {
      indices: [start],
      nextIndex: start + 1,
      imageHeight,
      height: imageHeight + labelSpace,
    };
  }

  const indices = [];
  for (let i = start; i <= best.end; i += 1) {
    indices.push(i);
  }

  return {
    indices,
    nextIndex: best.end + 1,
    imageHeight: best.imageHeight,
    height: best.imageHeight + labelSpace,
  };
}

function chooseSingleImageHeight(image, innerW, minH, maxH) {
  const fitByWidth = innerW / image.ratio;

  if (!Number.isFinite(fitByWidth) || fitByWidth <= 0) {
    return 1;
  }

  const upper = Math.min(maxH, fitByWidth);
  if (upper < minH) {
    return Math.max(1, upper);
  }

  return clamp(upper, minH, maxH);
}

function forceSingleRow(images, index, innerW, innerH, cfg, labelSpace) {
  const image = images[index];
  const availableH = Math.max(1, innerH - labelSpace);
  const fitByWidth = innerW / image.ratio;
  const imageHeight = Math.max(1, Math.min(cfg.maxRowHeight, availableH, fitByWidth));

  return {
    indices: [index],
    nextIndex: index + 1,
    imageHeight,
    height: imageHeight + labelSpace,
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function pickBestOrientation(images, opts) {
  if (opts.orientation === 'portrait' || opts.orientation === 'landscape') {
    const [w, h] = getPageSize(opts.paper, opts.orientation);
    const layout = buildLayout(images, w, h, opts);
    return { orientation: opts.orientation, layout };
  }

  const [portraitW, portraitH] = getPageSize(opts.paper, 'portrait');
  const portrait = buildLayout(images, portraitW, portraitH, opts);

  const [landscapeW, landscapeH] = getPageSize(opts.paper, 'landscape');
  const landscape = buildLayout(images, landscapeW, landscapeH, opts);

  if (landscape.pages.length < portrait.pages.length) {
    return { orientation: 'landscape', layout: landscape };
  }

  if (landscape.pages.length > portrait.pages.length) {
    return { orientation: 'portrait', layout: portrait };
  }

  return landscape.waste < portrait.waste
    ? { orientation: 'landscape', layout: landscape }
    : { orientation: 'portrait', layout: portrait };
}

module.exports = {
  getLabelConfig,
  pickBestOrientation,
};
