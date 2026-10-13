// High-performance Scanline Flood Fill Engine
// Floods enclosed regions on the Color Canvas bounded by the Line Art Canvas

export function scanlineFloodFill(colorCtx, lineCtx, width, height, startX, startY, fillR, fillG, fillB, fillA = 255) {
  startX = Math.floor(startX);
  startY = Math.floor(startY);

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return false;

  const colorImgData = colorCtx.getImageData(0, 0, width, height);
  const colorPixels = colorImgData.data;

  const lineImgData = lineCtx.getImageData(0, 0, width, height);
  const linePixels = lineImgData.data;

  // Helper to test if a pixel on lineCanvas is a dark outline barrier
  const isLineBarrier = (idx) => {
    const a = linePixels[idx + 3];
    if (a < 80) return false; // Transparent = not a line
    const r = linePixels[idx];
    const g = linePixels[idx + 1];
    const b = linePixels[idx + 2];
    // Luminance test: anything darker than 130 is considered an outline
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum < 135;
  };

  let startIdx = (startY * width + startX) * 4;

  // If clicked directly on a line, look around in an expanding radius for an open area
  if (isLineBarrier(startIdx)) {
    let found = false;
    const offsets = [
      [0, -3], [0, 3], [-3, 0], [3, 0],
      [-3, -3], [3, -3], [-3, 3], [3, 3],
      [0, -6], [0, 6], [-6, 0], [6, 0],
      [-6, -6], [6, -6], [-6, 6], [6, 6],
      [0, -10], [0, 10], [-10, 0], [10, 0],
      [-10, -10], [10, -10], [-10, 10], [10, 10]
    ];
    for (const [dx, dy] of offsets) {
      const nx = startX + dx;
      const ny = startY + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = (ny * width + nx) * 4;
        if (!isLineBarrier(nIdx)) {
          startX = nx;
          startY = ny;
          startIdx = nIdx;
          found = true;
          break;
        }
      }
    }
    if (!found) return false; // In dense outline cluster
  }

  const targetR = colorPixels[startIdx];
  const targetG = colorPixels[startIdx + 1];
  const targetB = colorPixels[startIdx + 2];
  const targetA = colorPixels[startIdx + 3];

  // Already the exact same color?
  if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) {
    return false;
  }

  // Tolerance helper for matching original color on color layer
  const matchesTarget = (idx) => {
    // If it's a line barrier, we can't fill past it
    if (isLineBarrier(idx)) return false;

    const r = colorPixels[idx];
    const g = colorPixels[idx + 1];
    const b = colorPixels[idx + 2];
    const a = colorPixels[idx + 3];

    // If target was transparent, match other transparent/near-white pixels
    if (targetA === 0) {
      return a === 0 || (a < 50 && r > 200 && g > 200 && b > 200);
    }

    // Color distance tolerance
    return Math.abs(r - targetR) <= 25 &&
           Math.abs(g - targetG) <= 25 &&
           Math.abs(b - targetB) <= 25 &&
           Math.abs(a - targetA) <= 30;
  };

  // 4-way Scanline Queue
  const pixelStack = [[startX, startY]];
  const visited = new Uint8Array(width * height);
  let minX = startX;
  let maxX = startX;
  let minY = startY;
  let maxY = startY;
  let filledCount = 0;

  while (pixelStack.length > 0) {
    const [curX, curY] = pixelStack.pop();
    let y = curY;
    let x = curX;

    let idx = (y * width + x) * 4;
    let pixelOffset = y * width + x;

    // Scan up to find the top edge of this vertical span
    while (y >= 0 && matchesTarget(idx) && !visited[pixelOffset]) {
      y--;
      idx -= width * 4;
      pixelOffset -= width;
    }

    y++;
    idx += width * 4;
    pixelOffset += width;

    let reachLeft = false;
    let reachRight = false;

    // Scan down from top edge to bottom edge
    while (y < height && matchesTarget(idx) && !visited[pixelOffset]) {
      // Color this pixel
      colorPixels[idx] = fillR;
      colorPixels[idx + 1] = fillG;
      colorPixels[idx + 2] = fillB;
      colorPixels[idx + 3] = fillA;
      visited[pixelOffset] = 1;
      filledCount++;

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      // Check left
      if (x > 0) {
        const leftIdx = idx - 4;
        const leftOffset = pixelOffset - 1;
        if (matchesTarget(leftIdx) && !visited[leftOffset]) {
          if (!reachLeft) {
            pixelStack.push([x - 1, y]);
            reachLeft = true;
          }
        } else if (reachLeft) {
          reachLeft = false;
        }
      }

      // Check right
      if (x < width - 1) {
        const rightIdx = idx + 4;
        const rightOffset = pixelOffset + 1;
        if (matchesTarget(rightIdx) && !visited[rightOffset]) {
          if (!reachRight) {
            pixelStack.push([x + 1, y]);
            reachRight = true;
          }
        } else if (reachRight) {
          reachRight = false;
        }
      }

      y++;
      idx += width * 4;
      pixelOffset += width;
    }
  }

  // Under-line Dilation (2 passes): Expands paint slightly under anti-aliased outlines and fringes
  // This removes white halos around outlines AND ensures 98%+ coverage accurately triggers the completion tick!
  if (filledCount > 0) {
    const dilateVisited = new Uint8Array(visited);
    for (let pass = 0; pass < 2; pass++) {
      const bMinY = Math.max(0, minY - 2);
      const bMaxY = Math.min(height - 1, maxY + 2);
      const bMinX = Math.max(0, minX - 2);
      const bMaxX = Math.min(width - 1, maxX + 2);

      for (let py = bMinY; py <= bMaxY; py++) {
        const row = py * width;
        for (let px = bMinX; px <= bMaxX; px++) {
          const off = row + px;
          if (dilateVisited[off] === 1) {
            const neighbors = [
              px > 0 ? off - 1 : -1,
              px < width - 1 ? off + 1 : -1,
              py > 0 ? off - width : -1,
              py < height - 1 ? off + width : -1
            ];
            for (let k = 0; k < 4; k++) {
              const n = neighbors[k];
              if (n >= 0 && dilateVisited[n] === 0) {
                const nIdx = n * 4;
                const existingA = colorPixels[nIdx + 3];
                // Expand into line barrier or transparent/white anti-aliasing edge
                if (existingA < 50 || isLineBarrier(nIdx)) {
                  colorPixels[nIdx] = fillR;
                  colorPixels[nIdx + 1] = fillG;
                  colorPixels[nIdx + 2] = fillB;
                  colorPixels[nIdx + 3] = fillA;
                  dilateVisited[n] = 2;
                }
              }
            }
          }
        }
      }

      for (let py = bMinY; py <= bMaxY; py++) {
        const row = py * width;
        for (let px = bMinX; px <= bMaxX; px++) {
          const off = row + px;
          if (dilateVisited[off] === 2) {
            dilateVisited[off] = 1;
          }
        }
      }
    }
  }

  // Put updated pixels back to the Color Canvas
  colorCtx.putImageData(colorImgData, 0, 0);
  return filledCount > 0;
}