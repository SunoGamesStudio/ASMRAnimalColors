// ASMR Animal Colors - Dual Layer Interactive Canvas
// Features: Brush Marker with Soft Movable Nib, Magic Fill (Bucket), Eraser,
// Leak-Proof Gap-Bridging Mask Engine, and White Background Auto-Clearing.

import { ParticleSystem } from './confetti.js';
import { ConfettiFX } from './plugins/confetti-fx.js';
import { StrokeSmoother } from './plugins/stroke-smoother.js';
import { sounds } from './audio.js';
import { playables } from './playables-sdk.js';
import { scanlineFloodFill } from './flood-fill.js';

// In-memory cache for loaded SVG texts so animal switching is instant (0ms)
const svgTextCache = new Map();

// Helper to generate candidate paths for case-sensitivity tolerance across web hosts
function getCandidateSvgPaths(rawPath) {
  if (!rawPath) return [];
  const clean = rawPath.split('?')[0];
  const lastSlash = clean.lastIndexOf('/');
  if (lastSlash === -1) return [clean];
  
  const dir = clean.substring(0, lastSlash + 1);
  const file = clean.substring(lastSlash + 1);
  const candidates = [clean];
  
  if (file.toLowerCase() === 'saint_bernard.svg') {
    candidates.push(dir + 'Saint_Bernard.svg', dir + 'saint_bernard.svg');
  } else if (file.toLowerCase() === 'dove.svg') {
    candidates.push(dir + 'Dove.svg', dir + 'dove.svg');
  } else if (file.toLowerCase() === 'ant.svg') {
    candidates.push(dir + 'Ant.svg', dir + 'ant.svg');
  }

  const lowerFile = file.toLowerCase();
  if (lowerFile !== file) candidates.push(dir + lowerFile);
  const capFirst = file.charAt(0).toUpperCase() + file.slice(1);
  if (capFirst !== file) candidates.push(dir + capFirst);

  return Array.from(new Set(candidates));
}


export function prefetchAnimalSvg(path) {
  if (!path || svgTextCache.has(path)) return;
  const url = path.includes('?') ? path : `${path}?v=2`;
  fetch(url)
    .then(r => r.text())
    .then(txt => svgTextCache.set(path, txt))
    .catch(() => {});
}

// Angular linear interpolation with shortest rotational path
function lerpAngle(current, target, factor) {
  if (current === undefined || current === null || Number.isNaN(current)) return target;
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * factor;
}

export class ColoringCanvas {
  constructor(container) {
    this.container = container;
    this.width = 1000;
    this.height = 1000;

    // Canvas layers
    this.colorCanvas = document.createElement('canvas');
    this.colorCtx = this.colorCanvas.getContext('2d', { willReadFrequently: true });

    this.lineCanvas = document.createElement('canvas');
    this.lineCtx = this.lineCanvas.getContext('2d', { willReadFrequently: true });

    this.effectsCanvas = document.createElement('canvas');
    this.particles = new ParticleSystem(this.effectsCanvas);
    this.confettiFX = new ConfettiFX(this.effectsCanvas);
    this.strokeSmoother = new StrokeSmoother();

    // Offscreen mask canvas for strict animal interior clipping
    this.maskCanvas = document.createElement('canvas');
    this.maskCtx = this.maskCanvas.getContext('2d', { willReadFrequently: true });

    // Downscaled canvas for instant 60fps coverage calculation
    this.coverageScale = 0.25; // 250x250
    this.coverageW = 250;
    this.coverageH = 250;
    this.coverageCanvas = document.createElement('canvas');
    this.coverageCanvas.width = this.coverageW;
    this.coverageCanvas.height = this.coverageH;
    this.coverageCtx = this.coverageCanvas.getContext('2d', { willReadFrequently: true });
    this.colorableMask250 = null;
    this.totalColorable250 = 0;

    // Apply classes & styles
    this.colorCanvas.className = 'canvas-layer color-layer';
    this.lineCanvas.className = 'canvas-layer line-layer';
    this.effectsCanvas.className = 'canvas-layer effects-layer';

    // Preserve existing overlay elements and append canvas layers
    const loader = this.container.querySelector('.studio-loader');
    const banner = this.container.querySelector('.canvas-completion-banner');
    const tickBtn = this.container.querySelector('#btn-complete-tick');
    const undoBtn = this.container.querySelector('#btn-undo');
    const eraserBtn = this.container.querySelector('#btn-corner-eraser');
    this.container.innerHTML = '';
    this.container.appendChild(this.colorCanvas);
    this.container.appendChild(this.lineCanvas);
    this.container.appendChild(this.effectsCanvas);
    if (banner) {
      this.container.appendChild(banner);
    }
    if (loader) {
      this.container.appendChild(loader);
    }
    if (tickBtn) {
      this.container.appendChild(tickBtn);
    }
    if (undoBtn) {
      this.container.appendChild(undoBtn);
      if (!undoBtn._hasUndoListener) {
        undoBtn._hasUndoListener = true;
        undoBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.undo();
        });
      }
    }
    if (eraserBtn) {
      this.container.appendChild(eraserBtn);
    }

    // Floating visual cursor follower (Brush Marker / Fill Bucket / Eraser)
    this.setupCursorFollower();

    // Clear any previous drawing data from localStorage to ensure blank drawings always
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('animal_') || k.startsWith('ytgame_data_animal_'))) {
          localStorage.removeItem(k);
        }
      }
    } catch (e) {}

    // Tool state
    this.activeTool = 'crayon'; // 'crayon' (Brush Marker) | 'dough' (Play-Doh ASMR) | 'yarn' (Wool Thread ASMR) | 'sponge' (ASMR Sponge) | 'fill' (Magic Bucket) | 'eraser'
    this.activeColor = '#ef4444';
    this.brushSize = 78; // Large, satisfying chunky stroke matching reference example
    this.eraserSize = 48; // Calibrated 1-to-1 to match visual rubber corner contact footprint
    this.currentNibAngle = 0;
    this.targetNibAngle = 0;
    this.penDistance = 0;
    this.currentEraserAngle = 0;
    this.targetEraserAngle = 0;
    this.eraserDistance = 0;
    this.nibSpringId = null;
    this.startNibSpringLoop();
    this.spongeStamp = null;
    this.lastSpongePoint = { x: 0, y: 0 };
    this.spongeDistance = 0;
    this.currentSpongeAngle = 0;
    this.createSpongeStamp(this.activeColor);
    this.doughStamp = null;
    this.lastDoughPoint = { x: 0, y: 0 };
    this.doughDistance = 0;
    this.currentDoughAngle = 0;
    this.createDoughStamp(this.activeColor);
    this.yarnStamp = null;
    this.lastYarnPoint = { x: 0, y: 0 };
    this.yarnDistance = 0;
    this.currentNeedleAngle = 0;
    this.createYarnStamp(this.activeColor);
    this.lastSplashPoint = { x: 0, y: 0 };
    // Legacy alias
    this.clayStamp = this.doughStamp;
    this.lastClayPoint = this.lastDoughPoint;
    this.completionThreshold = 0.99; // 99% colorable coverage triggers completion tick button and celebration
    this.isDrawing = false;
    this.activePointerId = null; // Single-touch lock: tracks primary drawing pointer to prevent multi-touch glitches
    this.strokePoints = [];
    this.lastCoverageCheckTime = 0;
    this.lastBrushSoundTime = 0;
    this.lastGlitterSoundTime = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.isPaused = false;

    // Completion state
    this.currentCoverage = 0;
    this.ninetyPercentReached = false;
    this.celebrationReached = false;
    this.completedForCurrentAnimal = false;

    // Callbacks
    this.onCompletionReady = null;
    this.onCompletionRevoked = null;
    this.onColorAction = null;
    this.onCelebrate = null;

    // Undo stack
    this.undoStack = [];
    this.maxUndo = 14;

    // Current animal
    this.currentAnimal = null;
    this.svgLoaded = false;
    this.hasColored = false;

    this.bindEvents();
    this.resizeCanvases();
  }

  // Generates porous multi-pore sponge stamp for ASMR textured painting (Calibrated to 44px screen footprint)
  createSpongeStamp(colorHex) {
    const size = 110;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;

    ctx.fillStyle = colorHex;

    // Organic porous bubbles with varied alpha & radii matching 44px footprint
    const pores = [
      { dx: 0, dy: 0, rad: 20, a: 0.68 },
      { dx: -12, dy: -8, rad: 14, a: 0.62 },
      { dx: 14, dy: -10, rad: 13, a: 0.58 },
      { dx: -8, dy: 14, rad: 14, a: 0.62 },
      { dx: 12, dy: 12, rad: 12, a: 0.58 },
      { dx: -24, dy: 2, rad: 11, a: 0.52 },
      { dx: 22, dy: -2, rad: 11, a: 0.52 },
      { dx: 3, dy: -24, rad: 10, a: 0.5 },
      { dx: -2, dy: 26, rad: 10, a: 0.5 },
      { dx: -18, dy: -20, rad: 10, a: 0.48 },
      { dx: 20, dy: -22, rad: 9, a: 0.48 },
      { dx: -22, dy: 20, rad: 9, a: 0.48 },
      { dx: 18, dy: 22, rad: 10, a: 0.48 },
      { dx: -30, dy: -6, rad: 7, a: 0.38 },
      { dx: 28, dy: 8, rad: 8, a: 0.38 },
      { dx: 6, dy: 30, rad: 7, a: 0.38 },
      { dx: -8, dy: -28, rad: 7, a: 0.38 },
      { dx: 24, dy: 16, rad: 7, a: 0.38 },
      { dx: -26, dy: -14, rad: 8, a: 0.38 },
      { dx: 10, dy: -28, rad: 7, a: 0.35 },
      { dx: -32, dy: 12, rad: 5.5, a: 0.3 },
      { dx: 32, dy: -12, rad: 5.5, a: 0.3 },
      { dx: 12, dy: 30, rad: 5, a: 0.3 },
      { dx: -14, dy: -30, rad: 5.5, a: 0.3 }
    ];

    pores.forEach(p => {
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(cx + p.dx, cy + p.dy, p.rad, 0, Math.PI * 2);
      ctx.fill();
    });

    // Punch authentic negative air pores (destination-out cutouts)
    ctx.globalCompositeOperation = 'destination-out';
    const airHoles = [
      { dx: -5, dy: -4, rad: 5 },
      { dx: 8, dy: 6, rad: 4.5 },
      { dx: -14, dy: 8, rad: 4 },
      { dx: 10, dy: -8, rad: 3.6 },
      { dx: 0, dy: 14, rad: 4.2 },
      { dx: -16, dy: -14, rad: 3.6 },
      { dx: 16, dy: -16, rad: 3.4 }
    ];
    airHoles.forEach(h => {
      ctx.beginPath();
      ctx.arc(cx + h.dx, cy + h.dy, h.rad, 0, Math.PI * 2);
      ctx.fill();
    });

    this.spongeStamp = canvas;
    return canvas;
  }

  // Blits a textured sponge dab with slight rotational variation
  drawSpongeDab(x, y) {
    if (!this.spongeStamp) {
      this.createSpongeStamp(this.activeColor);
    }
    const sw = this.spongeStamp.width;
    const sh = this.spongeStamp.height;
    this.colorCtx.save();
    this.colorCtx.globalCompositeOperation = 'source-over';
    this.colorCtx.translate(x, y);
    const angle = (Math.random() - 0.5) * 0.7;
    this.colorCtx.rotate(angle);
    this.colorCtx.drawImage(this.spongeStamp, -sw / 2, -sh / 2);
    this.colorCtx.restore();
  }

  // Generates 3D Soft Play-Doh Stamp (organic finger-pressed dough blob with soft thumb impression & matte clay grain)
  createDoughStamp(colorHex) {
    const size = 96;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const rad = 34; // Generous, satisfying finger-press size

    // 1. Soft ambient occlusion drop-shadow under the dough
    const shadowGrad = ctx.createRadialGradient(cx + 2, cy + 4, rad * 0.65, cx + 2, cy + 4, rad + 8);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.25)');
    shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.08)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(cx + 2, cy + 4, rad + 8, 0, Math.PI * 2);
    ctx.fill();

    // 2. Base Play-Doh body (pure, rich matte dough pigment)
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    // 3. Volumetric pillowed dough slope (smooth diffuse bevel, exactly like molded clay)
    const bevelGrad = ctx.createRadialGradient(
      cx - rad * 0.35, cy - rad * 0.35, 0,
      cx, cy, rad
    );
    bevelGrad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    bevelGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.04)');
    bevelGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.04)');
    bevelGrad.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
    ctx.fillStyle = bevelGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    // 4. Gentle organic thumbprint indentation (soft finger pad impression from patting dough)
    const thumbGrad = ctx.createRadialGradient(
      cx + 1, cy + 1, 0,
      cx + 1, cy + 1, rad * 0.65
    );
    thumbGrad.addColorStop(0, 'rgba(0, 0, 0, 0.06)');
    thumbGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.01)');
    thumbGrad.addColorStop(0.9, 'rgba(255, 255, 255, 0.05)');
    thumbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = thumbGrad;
    ctx.beginPath();
    ctx.arc(cx + 1, cy + 1, rad * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // 5. Fine flour / matte clay grain overlay
    const imgData = ctx.getImageData(0, 0, size, size);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 20) {
        const noise = (Math.random() - 0.5) * 14;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    this.doughStamp = canvas;
    this.clayStamp = canvas; // Legacy alias
    return canvas;
  }

  // Blits an organic finger-pressed Play-Doh dab with natural squish variation
  drawDoughDab(x, y) {
    if (!this.doughStamp) {
      this.createDoughStamp(this.activeColor);
    }
    const dw = this.doughStamp.width;
    const dh = this.doughStamp.height;
    this.colorCtx.save();
    this.colorCtx.globalCompositeOperation = 'source-over';
    this.colorCtx.translate(x, y);
    const angle = (Math.random() - 0.5) * 0.35;
    const scale = 0.96 + Math.random() * 0.08;
    this.colorCtx.scale(scale, scale);
    this.colorCtx.rotate(angle);
    this.colorCtx.drawImage(this.doughStamp, -dw / 2, -dh / 2);
    this.colorCtx.restore();
  }

  // Renders a continuous, thick, organic Play-Doh smear with natural thumb-pat undulations
  drawDoughSegment(p1, p2) {
    const ctx = this.colorCtx;
    const color = this.activeColor;
    const width = 54; // Broad, chunky, finger-pad dough spread width

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Soft Ambient Occlusion Under-Shadow (gives physical 3D elevation off the paper)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.lineWidth = width + 6;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2.0;
    ctx.shadowOffsetY = 4.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();

    // 2. Base Solid Matte Dough Mass (pure, velvety, opaque playdough body)
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // 3. Diffuse Pillowed 3D Slope (broad and soft, NOT thin stripes!)
    // Top-left diffuse ambient highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = width * 0.55;
    ctx.beginPath();
    ctx.moveTo(p1.x - 1.5, p1.y - 1.5);
    ctx.lineTo(p2.x - 1.5, p2.y - 1.5);
    ctx.stroke();

    // Bottom-right soft curvature shade
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.09)';
    ctx.lineWidth = width * 0.42;
    ctx.beginPath();
    ctx.moveTo(p1.x + 1.5, p1.y + 2.0);
    ctx.lineTo(p2.x + 1.5, p2.y + 2.0);
    ctx.stroke();

    // 4. Soft Organic Thumb-Press Impression at current position
    // As child moves their finger, each impression leaves a soft thumb pad mark
    // creating that authentic, wavy, hand-kneaded dough surface from the screenshot!
    const cx = p2.x;
    const cy = p2.y;
    const thumbR = width * 0.55;
    const thumbGrad = ctx.createRadialGradient(
      cx - 2, cy - 2, 0,
      cx, cy, thumbR
    );
    thumbGrad.addColorStop(0, 'rgba(0, 0, 0, 0.04)');
    thumbGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.01)');
    thumbGrad.addColorStop(0.88, 'rgba(255, 255, 255, 0.04)');
    thumbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = thumbGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, thumbR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Aliases for backwards compatibility
  createClayStamp(colorHex) { return this.createDoughStamp(colorHex); }
  drawClayDab(x, y) { return this.drawDoughDab(x, y); }

  // Generates Fluffy Wool Yarn / Thread Rosette Stamp for single taps and thread knots
  createYarnStamp(colorHex) {
    const size = 72;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const rad = 20;

    // 1. Soft ambient drop-shadow under the wool knot
    const shadowGrad = ctx.createRadialGradient(cx + 1, cy + 3, rad * 0.5, cx + 1, cy + 3, rad + 6);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.22)');
    shadowGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.06)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.arc(cx + 1, cy + 3, rad + 6, 0, Math.PI * 2);
    ctx.fill();

    // 2. Fuzzy outer wool halo
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(cx, cy, rad + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Spun wool rosette core
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    // 4. Knitted / spun wool spiral loops
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx - 2, cy - 2, rad * 0.62, -0.4, Math.PI * 1.2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(cx + 2, cy + 2, rad * 0.65, 0.8, Math.PI * 2.1);
    ctx.stroke();

    // Inner central knot stitch
    ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
    ctx.beginPath();
    ctx.arc(cx - 1, cy - 1, rad * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Sprouting tiny fuzzy wool micro-fibers
    ctx.save();
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2) / 10 + (Math.random() - 0.5) * 0.3;
      const r1 = rad - 1;
      const r2 = rad + 3 + Math.random() * 3.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
      ctx.stroke();
    }
    ctx.restore();

    this.yarnStamp = canvas;
    return canvas;
  }

  // Blits a soft wool yarn knot / pom-pom dab with subtle organic rotation
  drawYarnDab(x, y) {
    if (!this.yarnStamp) {
      this.createYarnStamp(this.activeColor);
    }
    const yw = this.yarnStamp.width;
    const yh = this.yarnStamp.height;
    this.colorCtx.save();
    this.colorCtx.globalCompositeOperation = 'source-over';
    this.colorCtx.translate(x, y);
    const angle = (Math.random() - 0.5) * 0.5;
    const scale = 0.94 + Math.random() * 0.12;
    this.colorCtx.scale(scale, scale);
    this.colorCtx.rotate(angle);
    this.colorCtx.drawImage(this.yarnStamp, -yw / 2, -yh / 2);
    this.colorCtx.restore();
  }

  // Renders a continuous, soft, twisted, fuzzy wool yarn strand
  drawYarnSegment(p1, p2) {
    const ctx = this.colorCtx;
    const color = this.activeColor;
    const width = 24; // Cozy, authentic knitting wool cord gauge

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;

    // Perpendicular unit vector for twisted plies
    const nx = -dy / dist;
    const ny = dx / dist;

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Soft Ambient Under-Shadow (gives 3D elevation of yarn off paper)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.lineWidth = width + 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.22)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1.5;
    ctx.shadowOffsetY = 3.0;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();

    // 2. Translucent Fuzzy Wool Halo along thread
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = color;
    ctx.lineWidth = width + 4;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();

    // 3. Core Spun Wool Cord
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // 4. Realistic Twisted Wool Plies (diagonal helical knit twist stitches)
    const stepSize = 13;
    const steps = Math.max(1, Math.floor(dist / stepSize));
    ctx.save();
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = p1.x + dx * t;
      const cy = p1.y + dy * t;
      const plyLen = width * 0.45;

      // Diagonal twist angle
      const ux = dx / dist;
      const uy = dy / dist;
      const slantX = (nx * 0.85 + ux * 0.45) * plyLen;
      const slantY = (ny * 0.85 + uy * 0.45) * plyLen;

      // Top soft highlight twist ridge
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.moveTo(cx - slantX * 0.7, cy - slantY * 0.7);
      ctx.lineTo(cx + slantX * 0.7, cy + slantY * 0.7);
      ctx.stroke();

      // Bottom soft crease twist ridge
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.beginPath();
      ctx.moveTo(cx - slantX * 0.7 + nx * 2, cy - slantY * 0.7 + ny * 2);
      ctx.lineTo(cx + slantX * 0.7 + nx * 2, cy + slantY * 0.7 + ny * 2);
      ctx.stroke();

      // Micro wool fuzz sprout (occasional random tiny hair)
      if (Math.random() < 0.4) {
        const hairLen = 3 + Math.random() * 3.5;
        const hSide = Math.random() > 0.5 ? 1 : -1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(cx + nx * (width * 0.48) * hSide, cy + ny * (width * 0.48) * hSide);
        ctx.lineTo(cx + nx * (width * 0.48 + hairLen) * hSide, cy + ny * (width * 0.48 + hairLen) * hSide);
        ctx.stroke();
      }
    }
    ctx.restore();

    ctx.restore();
  }

  // Computes precise trunk nozzle tip coordinates and aim angle towards target point
  getTrunkAimGeometry(targetX, targetY, isMoving = false, moveDx = 0, moveDy = 0) {
    const streamDist = 72; // Distance between trunk tip and target point in canvas units
    let desiredAngle;

    if (isMoving && Math.hypot(moveDx, moveDy) >= 3) {
      // Aim forward in drag direction, trunk naturally trailing behind
      desiredAngle = Math.atan2(moveDy, moveDx);
    } else {
      // Natural resting aim angle facing target from bottom-left (-45deg to -15deg)
      desiredAngle = targetX < 260 ? -Math.PI * 0.12 : (targetX > 740 ? -Math.PI * 0.88 : -Math.PI * 0.28);
    }

    const aimAngle = lerpAngle(this.currentTrunkAngle, desiredAngle, isMoving ? 0.22 : 0.25);
    this.currentTrunkAngle = aimAngle;

    let trunkTipX = targetX - Math.cos(aimAngle) * streamDist;
    let trunkTipY = targetY - Math.sin(aimAngle) * streamDist;

    // Keep trunk tip within canvas bounds
    trunkTipX = Math.max(20, Math.min(this.width - 20, trunkTipX));
    trunkTipY = Math.max(20, Math.min(this.height - 20, trunkTipY));

    // Recompute exact angle from trunk tip to target point
    const exactAngle = Math.atan2(targetY - trunkTipY, targetX - trunkTipX);
    this.currentTrunkAngle = exactAngle;

    return {
      trunkTipX,
      trunkTipY,
      aimAngle: exactAngle
    };
  }

  // Fluid Color Spray Splash (Permanent droplets and puddle on drawing canvas)
  stampPermanentSplash(ctx, x, y, color, pressure = 1.0, aimAngle = 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    const baseRadius = Math.max(16, 22 * pressure);

    // 1. Organic central water puddle with fluid lobes
    ctx.fillStyle = color;
    ctx.beginPath();
    const lobes = 8;
    for (let l = 0; l < lobes; l++) {
      const lAng = (l / lobes) * Math.PI * 2;
      const lDist = baseRadius * (0.82 + Math.random() * 0.34);
      const lx = x + Math.cos(lAng) * lDist;
      const ly = y + Math.sin(lAng) * lDist;
      if (l === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.closePath();
    ctx.fill();

    // 2. Burst of small splash droplets that stay on the drawing canvas
    const dropletCount = 6 + Math.floor(Math.random() * 5); // 6 to 10 droplets per burst
    for (let i = 0; i < dropletCount; i++) {
      const spreadAngle = aimAngle + (Math.random() - 0.5) * Math.PI * 1.35;
      const dropDist = baseRadius * (0.65 + Math.random() * 0.95);
      const dropRadius = Math.max(1.8, Math.random() * (baseRadius * 0.25));
      const dx = x + Math.cos(spreadAngle) * dropDist;
      const dy = y + Math.sin(spreadAngle) * dropDist;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(dx, dy, dropRadius, 0, Math.PI * 2);
      ctx.fill();

      // Specular shine on larger droplets to look like real liquid beads
      if (dropRadius >= 3.0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.arc(dx - dropRadius * 0.3, dy - dropRadius * 0.3, dropRadius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Wet liquid sheen highlight across the main puddle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.30)';
    ctx.beginPath();
    ctx.ellipse(x - baseRadius * 0.15, y - baseRadius * 0.15, baseRadius * 0.38, baseRadius * 0.20, aimAngle, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawTrunkSplash(x, y, pressure = 1.0, aimAngle = null) {
    const color = this.activeColor || '#ef4444';
    const angle = aimAngle !== null ? aimAngle : (this.currentTrunkAngle || -Math.PI * 0.25);
    this.stampPermanentSplash(this.colorCtx, x, y, color, pressure, angle);
    if (this.particles && typeof this.particles.addTrunkSplashBurst === 'function') {
      this.particles.addTrunkSplashBurst(x, y, color, 8);
    }
  }

  // Detect whether active color is Glitter (special metallic fleck engine) or standard crayon
  getColorType(hex) {
    if (!hex) return 'normal';
    const h = hex.toLowerCase();
    const glitterHexes = ['#ffd700', '#ff69b4', '#00e676', '#00e5ff', '#d500f9', '#ffffff'];
    if (glitterHexes.includes(h)) return 'glitter';
    // Neon colors are drawn as crisp, solid, saturated standard crayon strokes as preferred
    return 'normal';
  }

  // Palette of metallic & crystal highlights for glitter colors
  getGlitterPalette(baseHex) {
    const h = (baseHex || '').toLowerCase();
    if (h === '#ffd700') {
      return ['#ffffff', '#fffde7', '#fff59d', '#ffee58', '#ffd700', '#ffb300', '#ffc107'];
    }
    if (h === '#ff69b4') {
      return ['#ffffff', '#fce4ec', '#f8bbd0', '#ff80ab', '#ff4081', '#ff69b4', '#f50057'];
    }
    if (h === '#00e676') {
      return ['#ffffff', '#e8f5e9', '#b9f6ca', '#69f0ae', '#00e676', '#00bfa5', '#1de9b6'];
    }
    if (h === '#00e5ff') {
      return ['#ffffff', '#e0f7fa', '#b2ebf2', '#80deea', '#00e5ff', '#00b0ff', '#40c4ff'];
    }
    if (h === '#d500f9') {
      return ['#ffffff', '#f3e5f5', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff', '#e1bee7'];
    }
    // Diamond White / Silver
    return ['#ffffff', '#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#e0f7fa', '#fff9c4'];
  }

  // Draw 4-point brilliant diamond star sparkle onto canvas
  drawGlitterStar(ctx, x, y, size, color) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(x, y);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    const b = size * 0.22;
    // Vertical ray
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, b, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -b, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    // Horizontal ray
    ctx.moveTo(-size, 0);
    ctx.quadraticCurveTo(0, 0, 0, b);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -b);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.fill();

    // Central diamond core sparkle
    ctx.fillStyle = color || '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw single touch glitter stamp with metallic flecks and star
  drawGlitterDot(x, y, radius, color) {
    const ctx = this.colorCtx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Stamped metallic glitter flecks
    const sparklePalette = this.getGlitterPalette(color);
    for (let i = 0; i < 9; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * (radius * 0.82);
      const fx = x + Math.cos(a) * r;
      const fy = y + Math.sin(a) * r;
      ctx.fillStyle = sparklePalette[Math.floor(Math.random() * sparklePalette.length)];
      ctx.beginPath();
      ctx.arc(fx, fy, 1.2 + Math.random() * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    this.drawGlitterStar(ctx, x, y, radius * 0.75, color);
    ctx.restore();
  }

  // Draw smooth continuous glitter stroke with dense metallic flecks & sparkle stars
  drawGlitterStroke(p1, p2, width, color) {
    const ctx = this.colorCtx;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);

    // 1. Base vibrant gel stroke with soft edge
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.restore();

    // 2. Dense metallic glitter flecks stamped inside the stroke
    const fleckCount = Math.max(4, Math.floor(dist * 0.85));
    const sparklePalette = this.getGlitterPalette(color);

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    const normalAngle = Math.atan2(dy, dx) + Math.PI / 2;
    for (let i = 0; i < fleckCount; i++) {
      const t = Math.random();
      const cx = p1.x + dx * t;
      const cy = p1.y + dy * t;
      const offset = (Math.random() - 0.5) * (width * 0.85);
      const fx = cx + Math.cos(normalAngle) * offset;
      const fy = cy + Math.sin(normalAngle) * offset;
      const fRadius = 1.0 + Math.random() * 2.5;
      const fColor = sparklePalette[Math.floor(Math.random() * sparklePalette.length)];

      ctx.fillStyle = fColor;
      ctx.beginPath();
      ctx.arc(fx, fy, fRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Crisp 4-point diamond sparkle stars stamped along stroke
    this.glitterDistCounter = (this.glitterDistCounter || 0) + dist;
    if (this.glitterDistCounter >= 22) {
      this.glitterDistCounter = 0;
      const starOffset = (Math.random() - 0.5) * (width * 0.5);
      const sx = p2.x + Math.cos(normalAngle) * starOffset;
      const sy = p2.y + Math.sin(normalAngle) * starOffset;
      const starSize = 3.5 + Math.random() * 4.5;
      this.drawGlitterStar(ctx, sx, sy, starSize, color);
    }
  }

  // Stamp sparkling glitter stars and flecks into newly filled bucket region
  stampGlitterFillSparkles(cx, cy, count = 28, color = '#ffd700') {
    const ctx = this.colorCtx;
    const sparklePalette = this.getGlitterPalette(color);
    ctx.save();
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 110;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
        const maskVal = this.maskCtx.getImageData(px, py, 1, 1).data[3];
        if (maskVal > 80) {
          if (i % 3 === 0) {
            this.drawGlitterStar(ctx, x, y, 4.0 + Math.random() * 5.0, color);
          } else {
            ctx.fillStyle = sparklePalette[Math.floor(Math.random() * sparklePalette.length)];
            ctx.beginPath();
            ctx.arc(x, y, 1.4 + Math.random() * 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    ctx.restore();
    this.clipToAnimal();
  }

  setupCursorFollower() {
    this.crayonEl = document.createElement('div');
    this.crayonEl.id = 'floating-crayon';
    this.crayonEl.className = 'floating-crayon hidden';
    this.updateCrayonGraphic();
    this.container.appendChild(this.crayonEl);
  }

  // Updates tactile needle cursor rotation and sewing bob micro-motion
  updateNeedleTransform() {
    const wrap = this.crayonEl?.querySelector('.needle-cursor-wrap');
    if (!wrap) return;
    const deg = ((this.currentNeedleAngle || 0) * 180) / Math.PI;
    const bob = this.isDrawing ? Math.sin((this.yarnDistance || 0) * 0.16) * 2.2 : 0;
    wrap.style.transform = `rotate(${deg.toFixed(1)}deg) translate(0px, ${bob.toFixed(1)}px)`;
  }

  // Updates tactile playdough finger cursor rotation and rhythmic kneading squish
  updateDoughTransform() {
    const wrap = this.crayonEl?.querySelector('.dough-cursor-wrap');
    if (!wrap) return;
    const deg = ((this.currentDoughAngle || 0) * 180) / Math.PI;
    const knead = this.isDrawing ? Math.sin((this.doughDistance || 0) * 0.14) * 0.12 : 0;
    const sx = (this.isDrawing ? 0.94 : 1.0) + knead;
    const sy = (this.isDrawing ? 0.88 : 1.0) - knead;
    wrap.style.transform = `rotate(${deg.toFixed(1)}deg) scale(${sx.toFixed(2)}, ${sy.toFixed(2)})`;
  }

  // Updates tactile sponge cursor: smooth, steady cushion compression on touch, zero jitter/vibration
  updateSpongeTransform() {
    const wrap = this.crayonEl?.querySelector('.sponge-cursor-wrap');
    if (!wrap) return;
    const transform = this.isDrawing ? 'scale(0.88) translate(0px, 2px)' : 'scale(1) translate(0px, 0px)';
    wrap.style.transform = transform;
  }

  // Starts continuous 60fps spring relaxation loop for authentic tactile nib give
  startNibSpringLoop() {
    if (this.nibSpringId) return;
    const step = () => {
      if (this.activeTool === 'crayon') {
        const needsUpdate = Math.abs(this.currentNibAngle || 0) > 0.04 || Math.abs(this.targetNibAngle || 0) > 0.04 || this.isDrawing;
        if (needsUpdate) {
          this.updateNibFlex(0, 0, this.isDrawing);
        }
      } else if (this.activeTool === 'eraser') {
        const needsUpdate = Math.abs(this.currentEraserAngle || 0) > 0.04 || Math.abs(this.targetEraserAngle || 0) > 0.04 || this.isDrawing;
        if (needsUpdate) {
          this.updateEraserTransform(0, 0);
        }
      }
      this.nibSpringId = requestAnimationFrame(step);
    };
    this.nibSpringId = requestAnimationFrame(step);
  }

  stopNibSpringLoop() {
    if (this.nibSpringId) {
      cancelAnimationFrame(this.nibSpringId);
      this.nibSpringId = null;
    }
  }

  // Updates tactile marker bullet nib flex & subtle compression ("Lachak") in response to stroke motion
  updateNibFlex(dx = 0, dy = 0, isContact = this.isDrawing) {
    const nib = this.crayonEl?.querySelector('.marker-nib-flex');
    if (!nib) return;
    const dist = Math.hypot(dx, dy);
    if (dist >= 1.2) {
      this.penDistance = (this.penDistance || 0) + dist;
      // Pen barrel axis at 140deg: unit vector is (sin 140, -cos 140) = (0.6428, 0.7660)
      // Normal vector perpendicular to barrel axis: (-0.7660, 0.6428)
      // Lateral drag force across the nib:
      const lateralForce = (dx * (-0.766) + dy * 0.643);
      // Realistic, organic flex give: max +-6.5 degrees
      this.targetNibAngle = Math.max(-6.5, Math.min(6.5, lateralForce * 0.52));
    } else {
      // Smoothly relax target angle towards zero when holding still or moving slowly
      this.targetNibAngle = (this.targetNibAngle || 0) * 0.82;
    }

    // Elastic spring interpolation for organic felt elasticity
    this.currentNibAngle = (this.currentNibAngle || 0) + (this.targetNibAngle - (this.currentNibAngle || 0)) * 0.28;

    // Minimal tactile ink-cushion pulse (subtle breathing give during drawing)
    const pulse = isContact ? Math.sin((this.penDistance || 0) * 0.16) * 0.038 : 0;
    const squishY = (isContact ? 0.91 : 1.0) - pulse;
    const squishX = (isContact ? 1.06 : 1.0) + pulse;

    const angleStr = this.currentNibAngle.toFixed(2);
    const sxStr = squishX.toFixed(3);
    const syStr = squishY.toFixed(3);

    // 1. Universal SVG matrix transformation around base at (0, -28):
    nib.setAttribute('transform', `translate(0, -28) rotate(${angleStr}) scale(${sxStr}, ${syStr}) translate(0, 28)`);

    // 2. CSS transform with transform-box & origin:
    nib.style.transformBox = 'view-box';
    nib.style.transformOrigin = '0px -28px';
    nib.style.transform = `rotate(${angleStr}deg) scale(${sxStr}, ${syStr})`;
  }

  // Updates tactile rubber eraser transform with organic drag tilt & elastic cushion squish
  updateEraserTransform(dx = 0, dy = 0) {
    const rubber = this.crayonEl?.querySelector('.eraser-rubber-flex');
    if (!rubber) return;
    const dist = Math.hypot(dx, dy);
    if (dist >= 1.2) {
      this.eraserDistance = (this.eraserDistance || 0) + dist;
      // Rubber friction drag tilt: rubber drags against motion vector
      const dragForce = Math.max(-9, Math.min(9, -dx * 0.55 - dy * 0.35));
      this.targetEraserAngle = dragForce;
    } else {
      this.targetEraserAngle = (this.targetEraserAngle || 0) * 0.80;
    }

    this.currentEraserAngle = (this.currentEraserAngle || 0) + (this.targetEraserAngle - (this.currentEraserAngle || 0)) * 0.26;

    // Tactile soft rubber compression & chatter:
    // When pressed down, rubber squishes: scale(1.08, 0.88)
    const chatter = this.isDrawing ? Math.sin((this.eraserDistance || 0) * 0.22) * 0.04 : 0;
    const sx = (this.isDrawing ? 1.08 : 1.0) + chatter;
    const sy = (this.isDrawing ? 0.88 : 1.0) - chatter;
    const baseAngle = -30 + this.currentEraserAngle;

    rubber.setAttribute('transform', `rotate(${baseAngle.toFixed(2)}) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`);
    rubber.style.transformBox = 'view-box';
    rubber.style.transformOrigin = '0px 0px';
    rubber.style.transform = `rotate(${baseAngle.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
  }

  // Updates the cursor tool graphic with operational tip situated EXACTLY at (0, 0)
  updateCrayonGraphic(flexAngle = 0) {
    if (!this.crayonEl) return;
    const color = this.activeColor;

    if (this.activeTool === 'eraser') {
      // 3D Soft Pink Rubber Eraser with Protective Sleeve & Contact Vertex at (0, 0)
      const deg = -30 + (this.currentEraserAngle || 0);
      const chatter = this.isDrawing ? Math.sin((this.eraserDistance || 0) * 0.22) * 0.04 : 0;
      const sx = (this.isDrawing ? 1.08 : 1.0) + chatter;
      const sy = (this.isDrawing ? 0.88 : 1.0) - chatter;
      this.crayonEl.innerHTML = `
        <div class="eraser-cursor-wrap" style="position: relative; width: 0; height: 0; pointer-events: none;">
          <svg viewBox="-15 -15 110 110" width="80" height="80" class="crayon-svg-art" style="position: absolute; left: -12px; top: -12px; overflow: visible; pointer-events: none;">
            <defs>
              <linearGradient id="rubberFrontGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fda4af"/>
                <stop offset="45%" stop-color="#fb7185"/>
                <stop offset="100%" stop-color="#e11d48"/>
              </linearGradient>

              <linearGradient id="rubberTopGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fecdd3"/>
                <stop offset="60%" stop-color="#fff1f2"/>
                <stop offset="100%" stop-color="#f43f5e"/>
              </linearGradient>

              <linearGradient id="rubberSleeveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0284c7"/>
                <stop offset="35%" stop-color="#38bdf8"/>
                <stop offset="65%" stop-color="#bae6fd"/>
                <stop offset="100%" stop-color="#0284c7"/>
              </linearGradient>

              <filter id="eraserDropShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="rgba(0,0,0,0.28)"/>
              </filter>
            </defs>

            <!-- Main Rubber Assembly with Contact Corner at (0, 0) -->
            <g class="eraser-rubber-flex" transform="rotate(${deg.toFixed(1)}) scale(${sx.toFixed(2)}, ${sy.toFixed(2)})" style="transform-origin: 0px 0px; transform-box: view-box;" filter="url(#eraserDropShadow)">
              <!-- Front Face of Rubber Block: Vertex touching canvas at (0, 0) -->
              <polygon points="0,0 28,-10 20,-48 -8,-38" fill="url(#rubberFrontGrad)" stroke="#db2777" stroke-width="1.6" stroke-linejoin="round"/>
              <!-- Top Face Ambient Highlight -->
              <polygon points="-8,-38 20,-48 30,-44 2,-34" fill="url(#rubberTopGrad)" opacity="0.9" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linejoin="round"/>
              <!-- Cardboard Protective Sleeve -->
              <polygon points="5,-18 25,-25 20,-44 0,-37" fill="url(#rubberSleeveGrad)" stroke="#0369a1" stroke-width="1.4" stroke-linejoin="round"/>
              <!-- Sleeve White Brand Stripe -->
              <line x1="7" y1="-28" x2="23" y2="-34" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
              <!-- Rubber Contact Tip Rounded Bevel Highlight -->
              <ellipse cx="0" cy="0" rx="3.5" ry="2" fill="#ffffff" opacity="0.55"/>
            </g>
          </svg>
        </div>
      `;
    } else if (this.activeTool === 'dough' || this.activeTool === 'clay') {
      // Tactile Finger Pressing Gesture Cursor with Selected Color Dough Blob at Front of Finger
      const deg = ((this.currentDoughAngle || 0) * 180) / Math.PI;
      const knead = this.isDrawing ? Math.sin((this.doughDistance || 0) * 0.14) * 0.12 : 0;
      const sx = (this.isDrawing ? 0.94 : 1.0) + knead;
      const sy = (this.isDrawing ? 0.88 : 1.0) - knead;
      const squish = `rotate(${deg.toFixed(1)}deg) scale(${sx.toFixed(2)}, ${sy.toFixed(2)})`;
      this.crayonEl.innerHTML = `
        <div class="dough-cursor-wrap" style="transform: ${squish}; transform-origin: 0px 0px; transition: transform 0.05s ease-out; position: relative; pointer-events: none;">
          <!-- 1. 3D Tactile Play-Doh Ball centered EXACTLY at contact point (0, 0) -->
          <div class="dough-blob-ball" style="position: absolute; left: 0px; top: 0px; width: 28px; height: 28px; transform: translate(-50%, -50%); border-radius: 50%; background: radial-gradient(circle at 35% 35%, #ffffff 0%, ${color} 45%, ${color} 80%, rgba(0,0,0,0.38) 100%); border: 2.2px solid rgba(255, 255, 255, 0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.35); pointer-events: none; z-index: 1;">
            <div style="position: absolute; left: 6px; top: 6px; width: 8px; height: 6px; border-radius: 50%; background: rgba(255, 255, 255, 0.45); transform: rotate(-25deg);"></div>
          </div>
          <!-- 2. Finger Pressing Hand Overlay: fingertip apex placed EXACTLY over (0, 0) -->
          <img src="assets/icons/gesture_hand.png" alt="Dough Finger Gesture" style="position: absolute; left: -14px; top: -25px; width: 66px; height: 66px; object-fit: contain; pointer-events: none; z-index: 2; filter: drop-shadow(2px 6px 10px rgba(0,0,0,0.28));"/>
        </div>
      `;
    } else if (this.activeTool === 'yarn') {
      // Tactile Sewing Needle Cursor with Dynamic Yarn Thread Loop from assets/icons/Needle.svg
      // Needle pin tip is mathematically aligned EXACTLY at (0, 0)
      const deg = ((this.currentNeedleAngle || 0) * 180) / Math.PI;
      const bob = this.isDrawing ? Math.sin((this.yarnDistance || 0) * 0.16) * 2.2 : 0;
      const stitch = `rotate(${deg.toFixed(1)}deg) translate(0px, ${bob.toFixed(1)}px)`;
      this.crayonEl.innerHTML = `
        <div class="needle-cursor-wrap" style="transform: ${stitch}; transform-origin: 0px 0px; transition: transform 0.05s ease-out; position: relative; pointer-events: none;">
          <svg viewBox="0 -512 512 512" width="52" height="52" class="crayon-svg-art" style="overflow: visible; filter: drop-shadow(2px 5px 8px rgba(0,0,0,0.32)); position: absolute; left: 0px; top: -52px; pointer-events: none;">
            <defs>
              <linearGradient id="needleSteelGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#94a3b8"/>
                <stop offset="25%" stop-color="#cbd5e1"/>
                <stop offset="50%" stop-color="#f8fafc"/>
                <stop offset="75%" stop-color="#e2e8f0"/>
                <stop offset="100%" stop-color="#64748b"/>
              </linearGradient>
              <filter id="yarnGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
              </filter>
            </defs>
            <g transform="translate(-4.5, -507.5)">
              <!-- 1. Metallic Sewing Needle Body from Needle.svg (pin apex touching 0,0, eye at top-right) -->
              <path d="M0 0 C16.54 13 26.89 29.16 31.51 49.56 C34.05 71.07 30.56 88.73 20.9 107.87 C20.24 107.87 19.58 107.87 18.9 107.87 C17.68 106.21 16.55 104.48 15.46 102.74 C8.38 91.88 0.26 82 -8.61 72.55 C-10.73 70.26 -12.77 67.94 -14.79 65.55 C-18.26 61.58 -22.03 58.21 -26.1 54.87 C-26.86 54.23 -26.86 54.23 -27.63 53.57 C-40.23 42.93 -52.19 36.68 -69.07 37.65 C-78.71 38.7 -87.18 43.26 -94.1 49.87 C-94.66 50.4 -95.23 50.93 -95.8 51.48 C-103.68 59.79 -107.64 71.84 -107.35 83.16 C-106.22 95.51 -100.99 106.22 -92.1 114.87 C-89.95 116.64 -87.74 118.33 -85.52 120.01 C-70.88 131.28 -60.63 145.26 -51.1 160.87 C-50.69 161.5 -50.28 162.14 -49.86 162.79 C-47.11 167.22 -47.11 167.22 -47.07 170.06 C-48.52 172.6 -50.29 173.95 -52.6 175.74 C-53.6 176.53 -54.59 177.31 -55.62 178.12 C-56.18 178.56 -56.73 178.99 -57.3 179.44 C-60.68 182.11 -63.98 184.87 -67.29 187.62 C-74.87 193.87 -82.48 200.07 -90.11 206.25 C-92.13 207.89 -94.15 209.54 -96.17 211.18 C-102.98 216.73 -109.82 222.23 -116.74 227.63 C-121.43 231.3 -126.02 235.07 -130.6 238.87 C-136.29 243.58 -142.03 248.21 -147.86 252.75 C-152.32 256.24 -156.72 259.79 -161.1 263.37 C-166.62 267.87 -172.19 272.32 -177.81 276.7 C-182.29 280.2 -186.7 283.78 -191.1 287.37 C-196.62 291.87 -202.19 296.32 -207.81 300.7 C-212.31 304.22 -216.74 307.82 -221.16 311.43 C-225.95 315.33 -230.76 319.19 -235.66 322.93 C-240.34 326.5 -244.95 330.12 -249.54 333.8 C-257.26 340 -265.04 346.12 -272.83 352.22 C-274.57 353.58 -276.3 354.94 -278.04 356.3 C-278.62 356.76 -279.19 357.21 -279.79 357.68 C-283.4 360.51 -286.98 363.37 -290.56 366.25 C-296.49 371.02 -302.47 375.7 -308.54 380.3 C-314.83 385.08 -320.98 389.99 -327.08 394.99 C-331.85 398.89 -336.7 402.65 -341.6 406.37 C-347.96 411.19 -354.19 416.14 -360.36 421.2 C-364.41 424.51 -368.5 427.76 -372.66 430.93 C-377.28 434.45 -381.83 438.04 -386.35 441.68 C-391.68 445.97 -397.08 450.17 -402.54 454.3 C-408.17 458.58 -413.7 462.94 -419.16 467.43 C-425.06 472.27 -431.08 476.92 -437.21 481.46 C-442.47 485.37 -447.64 489.39 -452.76 493.48 C-458.87 498.33 -463.35 498.6 -471.1 497.87 C-475.73 495.67 -477.79 493.36 -480.1 488.87 C-481.19 483.69 -481.14 478.89 -478.7 474.13 C-476.62 471.26 -474.4 468.57 -472.1 465.87 C-470.78 464.2 -469.47 462.51 -468.16 460.82 C-466.3 458.42 -464.4 456.03 -462.51 453.65 C-460.26 450.81 -458.03 447.96 -455.79 445.12 C-455.12 444.27 -455.12 444.27 -454.44 443.4 C-450.64 438.57 -446.87 433.72 -443.1 428.87 C-437.57 421.74 -432.01 414.64 -426.43 407.55 C-424.15 404.66 -421.88 401.76 -419.6 398.87 C-418.68 397.7 -417.77 396.53 -416.85 395.37 C-416.17 394.5 -416.17 394.5 -415.48 393.62 C-410.43 387.2 -405.39 380.78 -400.35 374.37 C-399.9 373.79 -399.44 373.21 -398.98 372.62 C-398.06 371.45 -397.14 370.28 -396.22 369.11 C-393.94 366.21 -391.66 363.31 -389.39 360.4 C-384.16 353.73 -378.89 347.09 -373.58 340.48 C-368.84 334.55 -364.14 328.58 -359.46 322.6 C-356.72 319.1 -353.97 315.61 -351.22 312.11 C-348.95 309.22 -346.68 306.33 -344.42 303.44 C-339.52 297.17 -334.57 290.96 -329.54 284.8 C-325.63 280.02 -321.78 275.21 -318.04 270.3 C-313.98 264.98 -309.82 259.74 -305.63 254.52 C-302.28 250.35 -298.96 246.15 -295.66 241.93 C-291.16 236.17 -286.56 230.49 -281.94 224.83 C-277.99 219.98 -274.11 215.09 -270.27 210.16 C-266.75 205.66 -263.15 201.23 -259.54 196.8 C-255.65 192.05 -251.83 187.25 -248.1 182.37 C-242.27 174.73 -236.18 167.31 -230.1 159.87 C-227.89 157.16 -225.68 154.45 -223.48 151.74 C-222.93 151.08 -222.39 150.41 -221.83 149.73 C-218.4 145.49 -215.02 141.23 -211.66 136.93 C-206.98 130.93 -202.16 125.05 -197.3 119.19 C-193.6 114.72 -189.98 110.2 -186.41 105.62 C-182.47 100.55 -178.4 95.63 -174.22 90.76 C-170.95 86.92 -167.82 82.98 -164.73 78.99 C-160.27 73.25 -155.59 67.73 -150.8 62.26 C-146.9 57.81 -143.13 53.26 -139.4 48.66 C-135.24 43.6 -130.95 38.66 -126.67 33.7 C-125.08 31.84 -123.49 29.98 -121.91 28.11 C-116.84 22.13 -111.78 16.28 -106.1 10.87 C-105.3 10.04 -104.49 9.22 -103.66 8.37 C-102.82 7.54 -101.97 6.72 -101.1 5.87 C-100.33 5.08 -100.33 5.08 -99.54 4.29 C-72.95 -21.05 -29.04 -19.97 0 0 Z" 
                    fill="url(#needleSteelGrad)" 
                    stroke="#1e293b" 
                    stroke-width="3.5" 
                    stroke-linejoin="round" 
                    transform="translate(480.1015625,14.1328125)"/>
              <!-- Needle Specular Spine Highlight -->
              <line x1="8" y1="495" x2="435" y2="60" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.65"/>

              <!-- 2. Active Color Yarn Thread looping through the needle's eye from Needle.svg -->
              <g filter="url(#yarnGlow)">
                <path d="M0 0 C1.11 -0.04 1.11 -0.04 2.24 -0.08 C18.59 2.11 37.55 26.54 47.03 38.74 C57.59 52.6 66.33 67.47 73.69 83.25 C74.2 84.33 74.71 85.41 75.23 86.52 C82.4 102.43 87.5 119.06 91.06 136.12 C91.3 137.26 91.54 138.4 91.79 139.57 C94.92 155.44 96.07 171.16 96 187.31 C96 188.58 96 188.58 95.99 189.88 C95.94 204.17 95.16 218.15 92.69 232.25 C92.45 233.63 92.45 233.63 92.22 235.04 C85.42 273.76 68.93 311.61 45.69 343.25 C46.49 344.18 47.3 345.11 48.12 346.06 C52.4 351.06 56.57 356.13 60.69 361.25 C61.19 361.88 61.7 362.51 62.22 363.15 C72.04 375.4 81.13 388.09 89.69 401.25 C90.26 402.13 90.84 403.01 91.44 403.91 C95.65 410.57 97.02 415.35 95.69 423.25 C93.58 427.7 91.32 430.48 86.69 432.25 C80.58 433.02 75.77 432.93 70.38 429.61 C67.25 427.09 65.4 423.8 63.38 420.38 C62.42 418.84 61.47 417.31 60.52 415.77 C60.04 415.01 59.57 414.25 59.08 413.46 C49.32 398 37.63 382.19 24.69 369.25 C24.27 369.65 23.85 370.05 23.43 370.47 C-10.47 403.05 -49.9 425.33 -98.12 424.77 C-121.22 424.07 -140.05 415.26 -156 398.5 C-173.03 378.79 -176.86 357.45 -175.31 332.25 C-173.41 315.45 -163.56 298.62 -151.31 287.25 C-150.71 286.66 -150.11 286.06 -149.5 285.45 C-133.12 269.89 -112.8 264.73 -90.69 265.05 C-60.64 265.93 -31.33 278.63 -7.31 296.25 C-6.35 296.94 -5.38 297.64 -4.39 298.35 C2.28 303.24 8.61 308.47 14.88 313.87 C18.79 317.7 18.79 317.7 23.69 319.25 C24.93 317.72 24.93 317.72 26.12 315.68 C26.6 314.9 27.08 314.12 27.57 313.31 C60.94 256.98 72.5 193.2 56.69 129.25 C50.21 105.12 39.54 82.35 24.69 62.25 C23.96 61.27 23.24 60.28 22.5 59.27 C13.76 48.06 3.18 37.34 -8.3 28.93 C-11.64 26.15 -13.93 23.38 -15.31 19.25 C-15.71 13.98 -15.14 10.73 -12.31 6.25 C-8.43 1.89 -5.83 0.12 0 0 Z M-133.39 312.67 C-142.98 325.55 -145.52 338.53 -144.31 354.25 C-142.78 362.32 -139.23 368.75 -134.31 375.25 C-133.38 376.58 -133.38 376.58 -132.44 377.94 C-125.03 386 -113.8 392.51 -102.79 393.47 C-66.52 394.97 -35.65 381.29 -8.75 357.44 C-4.84 353.81 -1.04 350.07 2.69 346.25 C-18.4 320.63 -53.29 300.24 -86.31 296.25 C-104.51 295.15 -120.34 299 -133.39 312.67 Z" 
                      fill="${color}" 
                      stroke="rgba(0,0,0,0.22)" 
                      stroke-width="2" 
                      transform="translate(416.3125,79.75)"/>
                <path d="M0 0 C1.11 -0.01 2.22 -0.02 3.36 -0.03 C4.55 -0.02 5.74 -0.01 6.96 -0 C8.2 0 9.44 0.01 10.72 0.02 C40.15 0.53 72.96 6.82 99.34 20.43 C97.84 23.88 95.83 26.26 93.27 29 C88.4 34.3 83.85 39.82 79.34 45.43 C74.93 44.82 71.07 43.71 66.9 42.18 C48.24 35.68 28.23 32.42 8.52 31.86 C-5.1 31.39 -5.1 31.39 -10.54 27.25 C-13.85 22.86 -16.04 18.95 -15.6 13.37 C-14.71 8.4 -12.52 4.76 -8.38 1.79 C-5.33 0.27 -3.39 0.03 0 0 Z" 
                      fill="${color}" 
                      stroke="rgba(0,0,0,0.22)" 
                      stroke-width="2" 
                      transform="translate(239.6640625,-0.43359375)"/>
                
                <!-- Connecting thread strand running down along the needle body to the pin tip -->
                <path d="M 416 80 Q 230 270 4.5 507.5" fill="none" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>
                <path d="M 416 80 Q 230 270 4.5 507.5" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
              </g>

              <!-- 3. Yarn bead / fiber tuft at the Needle Pin Tip (4.5, 507.5) -> (0,0) in active color -->
              <circle cx="4.5" cy="507.5" r="3.6" fill="${color}" stroke="#ffffff" stroke-width="1.3"/>
            </g>
          </svg>
        </div>
      `;
    } else if (this.activeTool === 'sponge') {
      // Tactile 3D Sponge Cursor (Calibrated to 44px matching paint footprint, smooth cushioned press with zero vibration)
      const transform = this.isDrawing ? 'scale(0.88) translate(0px, 2px)' : 'scale(1) translate(0px, 0px)';
      this.crayonEl.innerHTML = `
        <div class="sponge-cursor-wrap" style="transform: ${transform}; transform-origin: 0px 0px; transition: transform 0.12s cubic-bezier(0.2, 0.8, 0.3, 1); position: relative; pointer-events: none;">
          <div style="position: absolute; left: 0px; top: 0px; width: 44px; height: 44px; margin-left: -22px; margin-top: -22px; pointer-events: none;">
            <img src="assets/icons/sponge.webp" alt="Sponge" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.28));"/>
            <!-- Active Color Indicator Badge situated on sponge corner -->
            <div style="position: absolute; bottom: 1px; right: 1px; width: 15px; height: 15px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.35);"></div>
          </div>
        </div>
      `;
    } else if (this.activeTool === 'splash') {
      // Unified High-Quality Elephant Trunk Cursor matching the User's Reference Screenshot!
      // Nozzle Aperture is mathematically centered at (0, 0) with zero offset or detachment!
      const aimAngle = this.currentTrunkAngle !== undefined ? this.currentTrunkAngle : -Math.PI * 0.20;
      // Trunk SVG naturally points at -35deg (-0.61 rad).
      // Rotate wrapper around (0, 0) so nozzle aims along aimAngle:
      const deg = (aimAngle * 180 / Math.PI) - (-35);
      const recoilShake = this.isDrawing
        ? `translate(${((Math.random() - 0.5) * 4).toFixed(1)}px, ${((Math.random() - 0.5) * 4).toFixed(1)}px) scale(1.05)`
        : 'scale(1)';

      this.crayonEl.innerHTML = `
        <div class="elephant-trunk-cursor-wrap" style="transform: rotate(${deg.toFixed(1)}deg) ${recoilShake}; transform-origin: 0px 0px; transition: transform 0.04s ease-out; position: relative; pointer-events: none;">
          <svg viewBox="-85 -35 150 150" width="92" height="92" class="crayon-svg-art" style="overflow: visible; pointer-events: none; position: absolute; left: -52px; top: -21px;">
            <defs>
              <linearGradient id="trunkSkinGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#1e293b"/>
                <stop offset="40%" stop-color="#334155"/>
                <stop offset="75%" stop-color="#475569"/>
                <stop offset="100%" stop-color="#64748b"/>
              </linearGradient>
              <linearGradient id="trunkCollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#cbd5e1"/>
                <stop offset="50%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#64748b"/>
              </linearGradient>
              <filter id="trunk3dShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="rgba(0,0,0,0.32)"/>
              </filter>
              <filter id="apertureGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="${color}"/>
              </filter>
            </defs>

            <g filter="url(#trunk3dShadow)">
              <!-- Main Elephant Trunk Body curving from bottom-left (-54, 84) up to nozzle (0, 0) -->
              <path d="M -54 84 
                       C -75 58, -78 22, -44 -3 
                       C -30 -14, -15 -14, 0 0 
                       C -8 16, -16 30, -22 44 
                       C -28 58, -26 72, -20 88 
                       Z" 
                    fill="url(#trunkSkinGrad)" 
                    stroke="#0f172a" 
                    stroke-width="2.8" 
                    stroke-linejoin="round"/>

              <!-- Trunk Skin Wrinkles / Texture Rings -->
              <path d="M -62 50 C -54 44, -42 47, -28 52" fill="none" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M -58 34 C -50 28, -38 32, -24 37" fill="none" stroke="#1e293b" stroke-width="2.4" stroke-linecap="round"/>
              <path d="M -50 18 C -42 12, -30 16, -18 22" fill="none" stroke="#1e293b" stroke-width="2.2" stroke-linecap="round"/>
              <path d="M -36 4 C -30 -1, -20 2, -12 8" fill="none" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>

              <!-- Soft 3D Specular Spine Highlight -->
              <path d="M -52 72 C -68 50, -68 24, -40 0 C -28 -8, -14 -9, -4 -4" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.45)" 
                    stroke-width="3.2" 
                    stroke-linecap="round"/>

              <!-- Metallic Collar Rim around Snout (centered at 0, 0) -->
              <ellipse cx="0" cy="0" rx="14" ry="11" transform="rotate(-35 0 0)" fill="url(#trunkCollarGrad)" stroke="#0f172a" stroke-width="2.4"/>

              <!-- Active Color Nozzle Aperture situated EXACTLY at (0, 0) -->
              <ellipse cx="0" cy="0" rx="10" ry="7.5" transform="rotate(-35 0 0)" fill="${color}" stroke="#ffffff" stroke-width="1.6" filter="url(#apertureGlow)"/>

              <!-- Glossy reflection sheen in nozzle -->
              <ellipse cx="-2.5" cy="-2" rx="4.5" ry="2.2" transform="rotate(-35 -2.5 -2)" fill="#ffffff" opacity="0.82"/>

              <!-- When spraying: Foaming active water ring around nozzle -->
              ${this.isDrawing ? `
                <ellipse cx="0" cy="0" rx="17" ry="13" transform="rotate(-35 0 0)" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-dasharray="4 3" opacity="0.9"/>
                <circle cx="8" cy="-6" r="3" fill="#ffffff" opacity="0.85"/>
                <circle cx="12" cy="2" r="2.2" fill="${color}"/>
                <circle cx="-6" cy="-8" r="2" fill="#ffffff" opacity="0.75"/>
              ` : `
                <!-- Idle: Cute trembling liquid drop hanging at mouth -->
                <ellipse cx="2" cy="2" rx="3.5" ry="2.5" fill="${color}" stroke="#ffffff" stroke-width="0.8"/>
              `}
            </g>
          </svg>
        </div>
      `;
    } else if (this.activeTool === 'fill') {
      // Magic Paint Bucket from assets/icons/Bucket.svg (exact match to bottom toolbar icon)
      // The stream tip in 512x512 is at (471, 436).
      // At 72px x 72px:
      // tipX = 72 * (471 / 512) = 66.23px (~66px)
      // tipY = 72 * (436 / 512) = 61.31px (~61px)
      // Situating left: -66px, top: -61px lands the falling paint stream tip EXACTLY at (0, 0)
      this.crayonEl.innerHTML = `
        <div class="bucket-cursor-wrap" style="position: relative; width: 0; height: 0; pointer-events: none;">
          <!-- 1. Authentic tilted bucket image from the bottom toolbar icon -->
          <img src="assets/icons/Bucket.svg" alt="Magic Bucket" style="position: absolute; left: -66px; top: -61px; width: 72px; height: 72px; pointer-events: none; filter: drop-shadow(2px 5px 9px rgba(0, 0, 0, 0.32)); user-select: none;" />
          
          <!-- 2. Dynamic falling droplet in the active selected color situated directly where the paint falls (0, 0) -->
          <svg viewBox="-6 -2 12 18" width="12" height="18" style="position: absolute; left: -6px; top: -2px; pointer-events: none; overflow: visible;">
            <path d="M 0 0 C 2.5 3.5, 4 6.5, 4 9 C 4 11.5, 2.2 13.5, 0 13.5 C -2.2 13.5, -4 11.5, -4 9 C -4 6.5, -2.5 3.5, 0 0 Z" fill="${color}" stroke="#ffffff" stroke-width="1.2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))"/>
          </svg>
        </div>
      `;
    } else {
      // High-Fidelity 3D Marker Pen matching User Reference Image
      // Features: Sleek dark barrel with 3D reflection highlight, pastel cyan collar cone,
      // and Chunky Rounded Bullet Nib ("Moti Tip") with Dynamic ASMR "Lachak" Elasticity!
      // Vertex tip is situated EXACTLY at (0, 0), pen body extends down-right at ~140deg.
      this.crayonEl.innerHTML = `
        <div class="marker-cursor-wrap" style="position: relative; width: 0; height: 0; pointer-events: none;">
          <svg viewBox="-30 -30 160 190" width="125" height="168" class="crayon-svg-art" style="position: absolute; left: -23.44px; top: -26.53px; overflow: visible; pointer-events: none;">
            <defs>
              <!-- 1. 3D Sleek Cylindrical Dark Barrel Gradient from Reference Picture -->
              <linearGradient id="markerBarrelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0f172a"/>
                <stop offset="20%" stop-color="#1e293b"/>
                <stop offset="42%" stop-color="#334155"/>
                <stop offset="55%" stop-color="#f8fafc" stop-opacity="0.80"/>
                <stop offset="68%" stop-color="#334155"/>
                <stop offset="88%" stop-color="#0f172a"/>
                <stop offset="100%" stop-color="#020617"/>
              </linearGradient>

              <!-- 2. Pastel Cyan Collar Gradient matching Reference Picture -->
              <linearGradient id="markerCollarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0284c7"/>
                <stop offset="22%" stop-color="#38bdf8"/>
                <stop offset="50%" stop-color="#bae6fd"/>
                <stop offset="78%" stop-color="#38bdf8"/>
                <stop offset="100%" stop-color="#0369a1"/>
              </linearGradient>

              <!-- 3. Collar Rim Ring Gradient -->
              <linearGradient id="markerRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0369a1"/>
                <stop offset="35%" stop-color="#38bdf8"/>
                <stop offset="65%" stop-color="#e0f2fe"/>
                <stop offset="100%" stop-color="#0284c7"/>
              </linearGradient>

              <!-- 4. Soft Marker Elevation Drop Shadow -->
              <filter id="markerShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="3" dy="7" stdDeviation="5" flood-color="rgba(0,0,0,0.30)"/>
              </filter>
            </defs>

            <!-- Main Marker Assembly tilted at 140deg into drawing canvas -->
            <g transform="rotate(140 0 0)" filter="url(#markerShadow)">
              
              <!-- 1. SLEEK POLISHED BARREL (Starts after collar at y = -68 down to y = -170) -->
              <g id="marker-body">
                <!-- Dark Cylindrical Barrel matching Reference Image -->
                <rect x="-17" y="-170" width="34" height="106" rx="4" fill="url(#markerBarrelGrad)"/>
                <!-- Bottom Dome Cap -->
                <path d="M -17,-170 C -17,-182 17,-182 17,-170 Z" fill="#0f172a" stroke="#020617" stroke-width="1.2"/>
                <!-- 3D Glossy Reflection Highlight Stripe along barrel -->
                <line x1="2" y1="-168" x2="2" y2="-68" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" opacity="0.65"/>
                <line x1="6" y1="-165" x2="6" y2="-72" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.38"/>
                <!-- Active Ink Color Ring at tail -->
                <rect x="-17" y="-160" width="34" height="12" fill="${color}" opacity="0.95"/>
              </g>

              <!-- 2. PASTEL CYAN CONE COLLAR matching reference photo -->
              <g id="marker-collar">
                <!-- Collar Base Grip Ring -->
                <rect x="-18.5" y="-68" width="37" height="9" rx="3" fill="url(#markerRimGrad)" stroke="#0284c7" stroke-width="1.2"/>
                <!-- Smooth Curved Collar Cone tapering up to nib opening -->
                <polygon points="-10.5,-28 10.5,-28 16,-62 -16,-62" fill="url(#markerCollarGrad)" stroke="#0284c7" stroke-width="1.2"/>
                <!-- Collar Specular Highlight -->
                <path d="M 0,-30 L 4,-58" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.75"/>
                <!-- Collar Top Lip Rim around nib opening -->
                <ellipse cx="0" cy="-28" rx="10.5" ry="3" fill="#bae6fd" stroke="#0284c7" stroke-width="1.2"/>
              </g>

              <!-- 3. MOTI TIP (BULLET NIB) WITH DYNAMIC "LACHAK" (Pivots around base at y = -28) -->
              <g class="marker-nib-flex" style="transform-origin: 0px -28px; transform-box: view-box; ${this.getColorType(color) === 'glitter' ? `filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 10px ${color});` : ''}">
                <!-- Chunky Rounded Bullet Nib in active ink color (apex situated EXACTLY at 0, 0) -->
                <path d="M -8.5,-28 
                         L -8,-11 
                         C -8,-3 -4,0 0,0 
                         C 4,0 8,-3 8,-11 
                         L 8.5,-28 
                         Z" 
                      fill="${color}" 
                      stroke="rgba(0,0,0,0.28)" 
                      stroke-width="1.4"
                      stroke-linejoin="round"/>
                <!-- Nib 3D Specular Highlight for juicy wet ink look -->
                <path d="M -3,-3 C 0,-1 3,-2 4,-4 C 4,-7 3,-12 3,-16" 
                      fill="none" 
                      stroke="#ffffff" 
                      stroke-width="1.8" 
                      stroke-linecap="round" 
                      opacity="0.6"/>
                <!-- Nib base shadow inside collar opening -->
                <ellipse cx="0" cy="-27.5" rx="8" ry="2.2" fill="rgba(0,0,0,0.25)"/>
                ${this.getColorType(color) === 'glitter' ? `<polygon points="0,-7 1,-3 4,-2 1,-1 0,3 -1,-1 -4,-2 -1,-3" fill="#ffffff" opacity="0.95"/><circle cx="-3" cy="-14" r="1.2" fill="#ffffff"/><circle cx="3" cy="-12" r="1.4" fill="#ffffff"/>` : ''}
              </g>

            </g>
          </svg>
        </div>
      `;
    }
  }

  resizeCanvases() {
    [this.colorCanvas, this.lineCanvas, this.effectsCanvas, this.maskCanvas].forEach(c => {
      c.width = this.width;
      c.height = this.height;
    });
    this.particles.resize(this.width, this.height);
  }

  get currentTool() {
    return this.activeTool;
  }

  setTool(tool, silent = false) {
    if (tool === 'clay') tool = 'dough';
    if (tool !== 'crayon' && tool !== 'dough' && tool !== 'yarn' && tool !== 'fill' && tool !== 'eraser' && tool !== 'sponge' && tool !== 'splash') return;
    sounds.stopSpongeStroke();
    sounds.stopDoughStroke();
    sounds.stopClayStroke();
    sounds.stopYarnStroke();
    sounds.stopTrunkSpray?.();
    this.particles?.stopTrunkStream?.();
    this.isDrawing = false;
    this.activePointerId = null;
    this.activeTool = tool;
    this.updateCrayonGraphic();
    if (tool === 'crayon') {
      this.penDistance = 0;
      this.currentNibAngle = 0;
      this.targetNibAngle = 0;
      this.startNibSpringLoop();
      this.updateNibFlex(0, 0, false);
      if (!silent) sounds.playMarkerSqueak?.(0.3);
    } else {
      this.stopNibSpringLoop();
      if (tool === 'sponge') {
        this.currentSpongeAngle = 0;
        this.spongeDistance = 0;
        if (!silent) sounds.playSpongeSquish();
      } else if (tool === 'dough') {
        this.currentDoughAngle = 0;
        this.doughDistance = 0;
        if (!silent) sounds.playDoughSquish();
      } else if (tool === 'yarn') {
        this.currentNeedleAngle = 0;
        this.yarnDistance = 0;
        if (!silent) sounds.playYarnKnot();
      } else if (tool === 'eraser') {
        this.eraserDistance = 0;
        this.targetEraserAngle = 0;
        this.currentEraserAngle = 0;
        this.startNibSpringLoop();
        this.updateEraserTransform(0, 0);
        if (!silent) sounds.playEraser();
      } else if (tool === 'splash') {
        if (!silent) sounds.playTrunkBurst?.();
      } else {
        if (!silent) sounds.playClick();
      }
    }
    if (this.hasColored) {
      this.updateCoverage();
    }
  }

  setColor(hex) {
    this.activeColor = hex;
    this.createSpongeStamp(hex);
    this.createDoughStamp(hex);
    this.createYarnStamp(hex);
    // If was on eraser, return to brush; if was on fill, sponge, dough, or yarn, stay on that tool
    if (this.activeTool === 'eraser') {
      this.activeTool = 'crayon';
    }
    this.updateCrayonGraphic();
  }

  async loadAnimal(animal) {
    this.currentAnimal = animal;
    this.svgLoaded = false;
    this.undoStack = [];
    this.hasColored = false;
    this.currentCoverage = 0;
    this.ninetyPercentReached = false;
    this.completedForCurrentAnimal = false;
    this.isDrawing = false;
    this.activePointerId = null;

    // Reset canvases
    this.colorCtx.clearRect(0, 0, this.width, this.height);
    this.lineCtx.clearRect(0, 0, this.width, this.height);
    this.maskCtx.clearRect(0, 0, this.width, this.height);
    this.particles.clear();

    try {
            let svgText = svgTextCache.get(animal.path);
      if (!svgText) {
        const candidates = getCandidateSvgPaths(animal.path);
        for (const c of candidates) {
          try {
            const url = c.includes('?') ? c : `${c}?v=2`;
            const resp = await fetch(url);
            if (resp.ok) {
              const text = await resp.text();
              if (text && text.includes('<svg')) {
                svgText = text;
                svgTextCache.set(animal.path, svgText);
                if (c !== animal.path) svgTextCache.set(c, svgText);
                break;
              }
            }
          } catch (_) {}
        }
      }
      if (!svgText || !svgText.includes('<svg')) {
        throw new Error(`Failed to load SVG for ${animal.name} (${animal.path})`);
      }

      const lineImgData = await this.renderSvgToLineCanvas(svgText);
      this.generateAnimalInteriorMask(lineImgData);
      this.svgLoaded = true;

      // Always start fresh from a pristine blank canvas (do not restore previous drawings)
      this.saveUndoState();
      this.updateCoverage();
      return true;
    } catch (err) {
      console.error('Failed to load animal SVG:', err);
      return false;
    }
  }

  async loadBlankCanvas() {
    this.currentAnimal = { id: 'blank_canvas', name: 'Blank Canvas', isBlankCanvas: true };
    this.svgLoaded = true;
    this.undoStack = [];
    this.hasColored = false;
    this.currentCoverage = 0;
    this.ninetyPercentReached = false;
    this.completedForCurrentAnimal = false;
    this.isDrawing = false;
    this.activePointerId = null;

    // Reset canvases
    this.colorCtx.clearRect(0, 0, this.width, this.height);
    this.lineCtx.clearRect(0, 0, this.width, this.height);
    this.maskCtx.clearRect(0, 0, this.width, this.height);
    this.particles.clear();

    // On blank canvas: allow full 1000x1000 painting without clipping
    this.maskCtx.fillStyle = '#ffffff';
    this.maskCtx.fillRect(0, 0, this.width, this.height);

    const cw = this.coverageW;
    const ch = this.coverageH;
    this.colorableMask250 = new Uint8Array(cw * ch);
    this.colorableMask250.fill(1);
    this.totalColorable250 = cw * ch;

    this.saveUndoState();
    return true;
  }

  renderSvgToLineCanvas(svgText) {
    return new Promise((resolve, reject) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (svgEl) {
          // 1. Remove any full-bleed background rects with white fill
          doc.querySelectorAll('rect').forEach(rect => {
            const fill = (rect.getAttribute('fill') || '').toLowerCase();
            const w = rect.getAttribute('width');
            const h = rect.getAttribute('height');
            if ((fill === '#ffffff' || fill === '#fff' || fill === 'white') &&
                (w === '100%' || parseFloat(w) >= 200) && (h === '100%' || parseFloat(h) >= 200)) {
              rect.remove();
            }
          });

          // 2. Normalization of dimensions (Max 1000px matches 1000x1000 canvas for fast decoding)
          const vb = svgEl.getAttribute('viewBox');
          if (vb) {
            const parts = vb.trim().split(/[\s,]+/);
            if (parts.length >= 4) {
              const vbW = parseFloat(parts[2]) || 1000;
              const vbH = parseFloat(parts[3]) || 1000;
              const maxDim = Math.max(vbW, vbH);
              const scale = maxDim < 1000 ? (1000 / maxDim) : 1;
              svgEl.setAttribute('width', Math.round(vbW * scale));
              svgEl.setAttribute('height', Math.round(vbH * scale));
            }
          } else {
            svgEl.setAttribute('width', '1000');
            svgEl.setAttribute('height', '1000');
          }
          svgText = new XMLSerializer().serializeToString(svgEl);
        }
      } catch (e) {
        console.warn('SVG normalization error:', e);
      }

      const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        const margin = 40;
        const availW = this.width - margin * 2;
        const availH = this.height - margin * 2;

        const natW = img.naturalWidth || img.width || 1000;
        const natH = img.naturalHeight || img.height || 1000;
        const imgAspect = natW / natH;
        const targetAspect = availW / availH;

        let drawW, drawH, drawX, drawY;
        if (imgAspect > targetAspect) {
          drawW = availW;
          drawH = drawW / imgAspect;
          drawX = margin;
          drawY = margin + (availH - drawH) / 2;
        } else {
          drawH = availH;
          drawW = drawH * imgAspect;
          drawX = margin + (availW - drawW) / 2;
          drawY = margin;
        }

        this.lineCtx.clearRect(0, 0, this.width, this.height);
        this.lineCtx.drawImage(img, drawX, drawY, drawW, drawH);
        URL.revokeObjectURL(url);

        // 3. Clear any opaque white fills from lineCanvas so paint underneath is 100% visible!
        const lineImgData = this.lineCtx.getImageData(0, 0, this.width, this.height);
        const ld = lineImgData.data;
        const totalPixels = this.width * this.height;
        for (let i = 0; i < totalPixels; i++) {
          const idx = i * 4;
          const a = ld[idx + 3];
          if (a > 0) {
            const r = ld[idx];
            const g = ld[idx + 1];
            const b = ld[idx + 2];
            // If near-white pixel (r,g,b > 215), clear alpha so color layer shines through
            if (r > 215 && g > 215 && b > 215) {
              ld[idx + 3] = 0;
            }
          }
        }
        this.lineCtx.putImageData(lineImgData, 0, 0);

        resolve(lineImgData);
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      img.src = url;
    });
  }

  // Generates leak-proof animal interior mask for strict paint clipping
  // Ensures paint stays strictly inside the animal silhouette and never leaks to the outside background
  generateAnimalInteriorMask(preloadedLineImgData) {
    const w = this.width;
    const h = this.height;
    const lineImgData = preloadedLineImgData || this.lineCtx.getImageData(0, 0, w, h);
    const lineData = lineImgData.data;

    // 1. Identify true dark outline pixels
    const isLine = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const idx = i * 4;
      const a = lineData[idx + 3];
      if (a > 30) {
        const r = lineData[idx];
        const g = lineData[idx + 1];
        const b = lineData[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 195) {
          isLine[i] = 1;
        }
      }
    }

    // 2. Flood fill exterior from all 4 borders directly against the dark line art
    const isExterior = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;

    // Enqueue top & bottom borders
    for (let x = 0; x < w; x++) {
      const topIdx = x;
      const botIdx = (h - 1) * w + x;
      if (!isLine[topIdx] && !isExterior[topIdx]) {
        isExterior[topIdx] = 1;
        queue[tail++] = topIdx;
      }
      if (!isLine[botIdx] && !isExterior[botIdx]) {
        isExterior[botIdx] = 1;
        queue[tail++] = botIdx;
      }
    }

    // Enqueue left & right borders
    for (let y = 0; y < h; y++) {
      const leftIdx = y * w;
      const rightIdx = y * w + (w - 1);
      if (!isLine[leftIdx] && !isExterior[leftIdx]) {
        isExterior[leftIdx] = 1;
        queue[tail++] = leftIdx;
      }
      if (!isLine[rightIdx] && !isExterior[rightIdx]) {
        isExterior[rightIdx] = 1;
        queue[tail++] = rightIdx;
      }
    }

    const wMinus1 = w - 1;
    const topLimit = w;
    const botLimit = (h - 1) * w;

    // 4-connected BFS exterior search
    while (head < tail) {
      const curr = queue[head++];
      const modX = curr % w;

      if (modX > 0) {
        const n = curr - 1;
        if (!isLine[n] && !isExterior[n]) {
          isExterior[n] = 1;
          queue[tail++] = n;
        }
      }
      if (modX < wMinus1) {
        const n = curr + 1;
        if (!isLine[n] && !isExterior[n]) {
          isExterior[n] = 1;
          queue[tail++] = n;
        }
      }
      if (curr >= topLimit) {
        const n = curr - w;
        if (!isLine[n] && !isExterior[n]) {
          isExterior[n] = 1;
          queue[tail++] = n;
        }
      }
      if (curr < botLimit) {
        const n = curr + w;
        if (!isLine[n] && !isExterior[n]) {
          isExterior[n] = 1;
          queue[tail++] = n;
        }
      }
    }

    // 3. Strict exterior boundary: dilate exterior by 1px specifically over isLine pixels.
    // This creates a safe buffer inside the black line so that paint never bleeds or halos outside.
    const strictExterior = new Uint8Array(isExterior);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        if (isExterior[idx]) {
          if (x > 0 && isLine[idx - 1]) strictExterior[idx - 1] = 1;
          if (x < w - 1 && isLine[idx + 1]) strictExterior[idx + 1] = 1;
          if (y > 0 && isLine[idx - w]) strictExterior[idx - w] = 1;
          if (y < h - 1 && isLine[idx + w]) strictExterior[idx + w] = 1;
        }
      }
    }

    // 4. Construct 1000x1000 mask canvas for strict interior paint clipping
    // Anything not strictExterior is interior (mask alpha = 255)
    const maskImg = this.maskCtx.createImageData(w, h);
    const maskData = maskImg.data;
    for (let i = 0; i < w * h; i++) {
      if (!strictExterior[i]) {
        maskData[i * 4 + 3] = 255;
      }
    }
    this.maskCtx.putImageData(maskImg, 0, 0);

    // 5. Construct downsampled 250x250 colorable interior mask for fast coverage calculation
    const cw = this.coverageW;
    const ch = this.coverageH;
    const step = w / cw;
    this.colorableMask250 = new Uint8Array(cw * ch);
    this.totalColorable250 = 0;

    for (let cy = 0; cy < ch; cy++) {
      for (let cx = 0; cx < cw; cx++) {
        const sx = Math.min(w - 1, Math.round(cx * step));
        const sy = Math.min(h - 1, Math.round(cy * step));
        const sIdx = sy * w + sx;

        if (!isExterior[sIdx] && !isLine[sIdx]) {
          this.colorableMask250[cy * cw + cx] = 1;
          this.totalColorable250++;
        }
      }
    }

    if (this.totalColorable250 === 0) {
      this.totalColorable250 = 1;
    }
  }

  // Clips all painted pixels to the animal's colorable mask
  clipToAnimal() {
    this.colorCtx.save();
    this.colorCtx.globalCompositeOperation = 'destination-in';
    this.colorCtx.drawImage(this.maskCanvas, 0, 0);
    this.colorCtx.restore();
  }

  // Measures coverage accurately
  updateCoverage() {
    if (!this.colorableMask250 || this.totalColorable250 === 0) return 0;

    const cw = this.coverageW;
    const ch = this.coverageH;

    this.coverageCtx.clearRect(0, 0, cw, ch);
    this.coverageCtx.drawImage(this.colorCanvas, 0, 0, cw, ch);
    const covData = this.coverageCtx.getImageData(0, 0, cw, ch).data;

    let paintedInMask = 0;
    const total = cw * ch;

    for (let i = 0; i < total; i++) {
      if (this.colorableMask250[i]) {
        if (covData[i * 4 + 3] > 25) {
          paintedInMask++;
        }
      }
    }

    const coverage = paintedInMask / this.totalColorable250;
    this.currentCoverage = coverage;

    // Blank Canvas: Free draw without automatic level completion popups
    if (this.currentAnimal && this.currentAnimal.isBlankCanvas) {
      return coverage;
    }

    // Completion Threshold:
    // Strictly 99% (0.99) required across ALL animals and ALL tools
    // (Bucket / Fill, ASMR Sponge, Elephant Trunk Splash, Crayon / Marker, Play-Doh, Yarn Needle, etc.)
    const threshold = 0.99;

    // Completion Tick appears in Drawing Area bottom-left corner ONLY when threshold is reached
    if (coverage >= threshold && !this.ninetyPercentReached) {
      this.ninetyPercentReached = true;
      if (this.onCompletionReady) {
        this.onCompletionReady();
      }
    } else if (coverage < threshold && this.ninetyPercentReached) {
      // Only revoke completion if user actively erases or coverage drops below 95%
      if (this.activeTool === 'eraser' || coverage < 0.95) {
        this.ninetyPercentReached = false;
        if (this.onCompletionRevoked) {
          this.onCompletionRevoked();
        }
      }
    }

    return coverage;
  }

  // Clears paint layer
  clearColor() {
    this.colorCtx.clearRect(0, 0, this.width, this.height);
    this.hasColored = false;
    this.currentCoverage = 0;
    this.ninetyPercentReached = false;
    this.celebrationReached = false;
    this.completedForCurrentAnimal = false;
    this.saveUndoState();
    this.updateCoverage();
  }

  saveUndoState() {
    try {
      const snap = this.colorCtx.getImageData(0, 0, this.width, this.height);
      this.undoStack.push(snap);
      if (this.undoStack.length > this.maxUndo) {
        this.undoStack.shift();
      }
      this.triggerAutoSave();
    } catch (e) {
      console.warn('Undo save failed:', e);
    }
  }

  undo() {
    if (this.undoStack.length <= 1) {
      this.clearColor();
      return;
    }
    sounds.playClick();
    this.undoStack.pop();
    const prev = this.undoStack[this.undoStack.length - 1];
    if (prev) {
      this.colorCtx.putImageData(prev, 0, 0);
      this.clipToAnimal();
      this.updateCoverage();
      this.triggerAutoSave();
    }
  }

  triggerAutoSave() {
    // Intentionally no-op: Previous drawings are never saved, players always start blank on each level
  }

  getPointerPos(evt) {
    const rect = this.colorCanvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    let clientX = evt.clientX;
    let clientY = evt.clientY;

    const isTouch = (evt.touches && evt.touches.length > 0) || evt.pointerType === 'touch';
    if (evt.touches && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    }

    // Touch offset: On touch devices, advance & elevate marker so child's finger/thumb
    // never covers the pen tip or blocks the line being colored!
    // Pen body angles down-right (~140deg), so advancing by touchOffsetX (-16px) & touchOffsetY (72px)
    // keeps the nib clearly in front of the thumb, with color emerging directly from the tip!
    const isPenOrEraser = this.activeTool === 'crayon' || this.activeTool === 'eraser';
    const touchOffsetY = isTouch ? (isPenOrEraser ? 72 : (this.activeTool !== 'fill' ? 45 : 0)) : 0;
    const touchOffsetX = isTouch ? (isPenOrEraser ? -16 : 0) : 0;

    const rawLocalX = clientX - rect.left;
    const rawLocalY = clientY - rect.top;

    const localX = rawLocalX - touchOffsetX;
    const localY = rawLocalY - touchOffsetY;

    return {
      x: (clientX - rect.left - touchOffsetX) * scaleX,
      y: (clientY - rect.top - touchOffsetY) * scaleY,
      localX,
      localY,
      rawLocalX,
      rawLocalY,
      isTouch,
      touchOffsetX,
      touchOffsetY,
      clientX,
      clientY
    };
  }

  // Updates onscreen brush marker follower with exact tip coordinates
  updateCrayonPosition(localX, localY, isVisible = true) {
    if (!this.crayonEl) return;
    if (!isVisible) {
      this.crayonEl.classList.add('hidden');
      return;
    }
    this.crayonEl.classList.remove('hidden');
    this.crayonEl.style.transform = `translate3d(${localX}px, ${localY}px, 0)`;
  }

  bindEvents() {
    const c = this.effectsCanvas; // Topmost interactive canvas

    const onDown = (e) => {
      e.preventDefault();
      if (!this.svgLoaded || this.isPaused) return;

      // Single-Touch Locking: Ignore secondary fingers/touches to prevent multi-touch drawing glitch
      if (this.activePointerId !== null && this.activePointerId !== e.pointerId) {
        return;
      }
      this.activePointerId = e.pointerId;
      try {
        c.setPointerCapture?.(e.pointerId);
      } catch (_) {}

      const pos = this.getPointerPos(e);
      this.lastPointerX = pos.localX;
      this.lastPointerY = pos.localY;

      // Handle Magic Fill (Bucket) Mode
      if (this.activeTool === 'fill') {
        const isTouch = e.pointerType === 'touch' || (e.touches && e.touches.length > 0);
        if (isTouch) {
          this.updateCrayonPosition(pos.localX, pos.localY, true);
          setTimeout(() => {
            if (!this.isDrawing) this.updateCrayonPosition(0, 0, false);
          }, 350);
        }
        const px = Math.floor(pos.x);
        const py = Math.floor(pos.y);
        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          const maskVal = this.maskCtx.getImageData(px, py, 1, 1).data[3];
          // Only fill if tapped inside the animal interior
          if (maskVal > 80) {
            const hex = this.activeColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            const didFill = scanlineFloodFill(
              this.colorCtx,
              this.lineCtx,
              this.width,
              this.height,
              pos.x,
              pos.y,
              r,
              g,
              b,
              255
            );

            if (didFill) {
              sounds.playFillPlop();
              const colorType = this.getColorType(this.activeColor);
              if (colorType === 'glitter') {
                this.stampGlitterFillSparkles(pos.x, pos.y, 32, this.activeColor);
                if (this.particles && typeof this.particles.addGlitterSparkles === 'function') {
                  this.particles.addGlitterSparkles(pos.localX, pos.localY, this.activeColor, 8);
                }
                sounds.playGlitterShimmer?.();
              } else {
                this.particles?.addTapSparkles?.(pos.localX, pos.localY, this.activeColor);
              }
              this.clipToAnimal();
              this.saveUndoState();
              this.updateCoverage();
              this.hasColored = true;
              if (this.onColorAction) this.onColorAction(this.activeColor);
            }
          }
        }
        return;
      }

      // Handle Dough (Play-Doh ASMR Tool)
      if (this.activeTool === 'dough' || this.activeTool === 'clay') {
        this.isDrawing = true;
        this.doughDistance = 0;
        this.strokePoints = [{ x: pos.x, y: pos.y }];
        this.lastDoughPoint = { x: pos.x, y: pos.y };
        this.updateCrayonGraphic(); // Squish dough cursor
        this.updateCrayonPosition(pos.localX, pos.localY, true);
        this.updateDoughTransform();
        this.drawDoughDab(pos.x, pos.y);
        this.clipToAnimal();
        sounds.playDoughSquish();
        if (this.particles && typeof this.particles.addDoughSquish === 'function') {
          this.particles.addDoughSquish(pos.localX, pos.localY, this.activeColor, 6);
        }
        if (this.onColorAction) {
          this.onColorAction(this.activeColor);
        }
        return;
      }

      // Handle Yarn (Wool Thread ASMR Tool)
      if (this.activeTool === 'yarn') {
        this.isDrawing = true;
        this.yarnDistance = 0;
        this.strokePoints = [{ x: pos.x, y: pos.y }];
        this.lastYarnPoint = { x: pos.x, y: pos.y };
        this.updateCrayonGraphic();
        this.updateCrayonPosition(pos.localX, pos.localY, true);
        this.updateNeedleTransform();
        this.drawYarnDab(pos.x, pos.y);
        this.clipToAnimal();
        sounds.playYarnKnot();
        if (this.particles && typeof this.particles.addYarnStitch === 'function') {
          this.particles.addYarnStitch(pos.localX, pos.localY, this.activeColor);
        }
        if (this.onColorAction) {
          this.onColorAction(this.activeColor);
        }
        return;
      }

      // Handle Sponge (ASMR Texture Tool)
      if (this.activeTool === 'sponge') {
        this.isDrawing = true;
        this.strokePoints = [{ x: pos.x, y: pos.y }];
        this.lastSpongePoint = { x: pos.x, y: pos.y };
        this.spongeDistance = 0;
        this.updateCrayonGraphic(); // Squish sponge
        this.updateCrayonPosition(pos.localX, pos.localY, true);
        this.updateSpongeTransform();
        this.drawSpongeDab(pos.x, pos.y);
        this.clipToAnimal();
        sounds.playSpongeSquish();
        if (this.particles && typeof this.particles.addSpongeDab === 'function') {
          this.particles.addSpongeDab(pos.localX, pos.localY, this.activeColor, 6);
        }
        if (this.onColorAction) {
          this.onColorAction(this.activeColor);
        }
        return;
      }

      // Handle Elephant Trunk fluid color spray
      if (this.activeTool === 'splash') {
        this.isDrawing = true;
        this.strokePoints = [{ x: pos.x, y: pos.y }];
        this.lastSplashPoint = { x: pos.x, y: pos.y };

        const geom = this.getTrunkAimGeometry(pos.x, pos.y, false);
        const rect = this.colorCanvas.getBoundingClientRect();
        const trunkLocalX = geom.trunkTipX * (rect.width / this.width);
        const trunkLocalY = geom.trunkTipY * (rect.height / this.height);

        this.updateCrayonPosition(trunkLocalX, trunkLocalY, true);
        this.updateCrayonGraphic();

        // 1. Smooth animated fluid stream from trunk tip to target point
        this.particles.setTrunkStream(geom.trunkTipX, geom.trunkTipY, pos.x, pos.y, this.activeColor);

        // 2. Permanent splash droplets & puddle on drawing canvas
        this.stampPermanentSplash(this.colorCtx, pos.x, pos.y, this.activeColor, 1.0, geom.aimAngle);
        this.clipToAnimal();

        // 3. Dynamic airborne splash droplet burst at target point
        this.particles.addTrunkSplashBurst(pos.x, pos.y, this.activeColor, 10);

        this.saveUndoState();
        this.updateCoverage();
        this.hasColored = true;

        sounds.playTrunkBurst?.();
        sounds.playTrunkSpray?.();
        if (this.onColorAction) {
          this.onColorAction(this.activeColor);
        }
        return;
      }

      // Handle Brush / Crayon / Eraser
      this.isDrawing = true;
      if (this.crayonEl) {
        this.crayonEl.style.transition = 'none';
        this.crayonEl.style.opacity = '1';
      }
      this.strokePoints = [{ x: pos.x, y: pos.y }];
      this.updateCrayonPosition(pos.localX, pos.localY, true);
      if (this.activeTool === 'crayon') {
        this.penDistance = 0;
        this.targetNibAngle = 0;
        this.currentNibAngle = 0;
        this.startNibSpringLoop();
        this.updateNibFlex(0, 0, true); // Juicy felt cushion compression on touch down
        sounds.playMarkerTap?.();
        if (this.particles && typeof this.particles.addMarkerGleam === 'function') {
          this.particles.addMarkerGleam(pos.localX, pos.localY, this.activeColor);
        }
      } else if (this.activeTool === 'eraser') {
        this.eraserDistance = 0;
        this.targetEraserAngle = 0;
        this.currentEraserAngle = 0;
        this.startNibSpringLoop();
        this.updateEraserTransform(0, 0); // Tactile rubber cushion compression on contact
        sounds.playEraser(); // Soft rubber contact tap
        if (this.particles && typeof this.particles.addEraserCrumbs === 'function') {
          this.particles.addEraserCrumbs(pos.localX, pos.localY);
        }
      }

      // Start stroke
      this.colorCtx.save();
      if (this.activeTool === 'eraser') {
        this.colorCtx.globalCompositeOperation = 'destination-out';
        this.colorCtx.lineWidth = this.eraserSize;
        this.colorCtx.lineCap = 'round';
        this.colorCtx.lineJoin = 'round';
        this.colorCtx.beginPath();
        this.colorCtx.arc(pos.x, pos.y, this.eraserSize * 0.5, 0, Math.PI * 2);
        this.colorCtx.fill();
      } else {
        const colorType = this.getColorType(this.activeColor);
        if (colorType === 'glitter') {
          this.drawGlitterDot(pos.x, pos.y, this.brushSize * 0.5, this.activeColor);
          if (this.particles && typeof this.particles.addGlitterSparkles === 'function') {
            this.particles.addGlitterSparkles(pos.localX, pos.localY, this.activeColor, 4);
          }
          sounds.playGlitterShimmer?.();
        } else {
          this.colorCtx.globalCompositeOperation = 'source-over';
          this.colorCtx.strokeStyle = this.activeColor;
          this.colorCtx.fillStyle = this.activeColor;
          this.colorCtx.lineWidth = this.brushSize;
          this.colorCtx.lineCap = 'round';
          this.colorCtx.lineJoin = 'round';
          this.colorCtx.beginPath();
          this.colorCtx.arc(pos.x, pos.y, this.brushSize * 0.5, 0, Math.PI * 2);
          this.colorCtx.fill();
        }
      }
      this.colorCtx.restore();

      this.clipToAnimal();
      if (this.activeTool !== 'eraser' && this.activeTool !== 'crayon') {
        sounds.playBrush();
      }

      if (this.activeTool === 'crayon' && this.onColorAction) {
        this.onColorAction(this.activeColor);
      }
    };

    const onMove = (e) => {
      if (this.isPaused) return;

      // Ignore movement from secondary touches while drawing or tracking primary pointer
      if (this.activePointerId !== null && e.pointerId !== this.activePointerId) {
        return;
      }

      const pos = this.getPointerPos(e);
      const isTouch = e.pointerType === 'touch' || (e.touches && e.touches.length > 0);

      // Calculate movement delta for soft movable nib flexing & needle rotation
      const dx = pos.localX - this.lastPointerX;
      const dy = pos.localY - this.lastPointerY;
      const flexAngle = Math.max(-8, Math.min(8, dx * 0.7));
      this.lastPointerX = pos.localX;
      this.lastPointerY = pos.localY;

      if (this.activeTool !== 'splash') {
        if (isTouch) {
          this.updateCrayonPosition(pos.localX, pos.localY, this.isDrawing);
        } else {
          this.updateCrayonPosition(pos.localX, pos.localY, true);
        }
        if (this.activeTool === 'crayon') {
          this.updateNibFlex(dx, dy, this.isDrawing);
        } else if (this.activeTool === 'eraser') {
          this.updateEraserTransform(dx, dy);
        } else if (this.activeTool === 'yarn') {
          const moveDist = Math.hypot(dx, dy);
          if (moveDist >= 2) {
            const strokeAngle = Math.atan2(dy, dx);
            const targetRot = strokeAngle + Math.PI - (-0.8039);
            this.currentNeedleAngle = lerpAngle(this.currentNeedleAngle, targetRot, 0.18);
            this.updateNeedleTransform();
          }
        } else if (this.activeTool === 'dough' || this.activeTool === 'clay') {
          const moveDist = Math.hypot(dx, dy);
          if (moveDist >= 2) {
            const strokeAngle = Math.atan2(dy, dx);
            const targetRot = strokeAngle + Math.PI - 0.777;
            this.currentDoughAngle = lerpAngle(this.currentDoughAngle, targetRot, 0.16);
            this.updateDoughTransform();
          }
        }
      } else if (!this.isDrawing && e.pointerType !== 'touch') {
        const geom = this.getTrunkAimGeometry(pos.x, pos.y, false);
        const rect = this.colorCanvas.getBoundingClientRect();
        const trunkLocalX = geom.trunkTipX * (rect.width / this.width);
        const trunkLocalY = geom.trunkTipY * (rect.height / this.height);
        this.updateCrayonPosition(trunkLocalX, trunkLocalY, true);
        this.updateCrayonGraphic();
      }

      if (!this.isDrawing || this.activeTool === 'fill') return;
      e.preventDefault();

      // Handle Dough continuous extrusion / drag
      if (this.activeTool === 'dough' || this.activeTool === 'clay') {
        const cx = pos.x - this.lastDoughPoint.x;
        const cy = pos.y - this.lastDoughPoint.y;
        const dist = Math.hypot(cx, cy);

        // Dynamic tactile finger rotation trailing motion & rhythmic dough kneading squish
        if (dist >= 2) {
          const strokeAngle = Math.atan2(cy, cx);
          const targetRot = strokeAngle + Math.PI - 0.777;
          this.currentDoughAngle = lerpAngle(this.currentDoughAngle, targetRot, 0.24);
          this.doughDistance = (this.doughDistance || 0) + dist;
          this.updateDoughTransform();
        }

        // Smooth continuous 3D Play-Doh rope extrusion
        if (dist >= 3) {
          this.drawDoughSegment(this.lastDoughPoint, pos);
          this.lastDoughPoint = { x: pos.x, y: pos.y };
          this.clipToAnimal();

          // Emitting soft squishy dough crumbs periodically along the kneaded stroke
          if (Math.random() < 0.32 && this.particles && typeof this.particles.addDoughSquish === 'function') {
            this.particles.addDoughSquish(pos.localX, pos.localY, this.activeColor, 2);
          }
        }

        const now = performance.now();
        if (now - this.lastBrushSoundTime > 115) {
          this.lastBrushSoundTime = now;
          sounds.playDoughStroke();
        }

        if (now - this.lastCoverageCheckTime > 300) {
          this.lastCoverageCheckTime = now;
          this.updateCoverage();
        }
        return;
      }

      // Handle Sponge continuous drag (Smooth, steady stroke with zero jitter)
      if (this.activeTool === 'sponge') {
        const sx = pos.x - this.lastSpongePoint.x;
        const sy = pos.y - this.lastSpongePoint.y;
        const dist = Math.hypot(sx, sy);

        // Stamp spaced by 18px along stroke
        const stepDist = 18;
        if (dist >= stepDist) {
          const steps = Math.min(12, Math.floor(dist / stepDist));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const interpX = this.lastSpongePoint.x + sx * t + (Math.random() - 0.5) * 6;
            const interpY = this.lastSpongePoint.y + sy * t + (Math.random() - 0.5) * 6;
            this.drawSpongeDab(interpX, interpY);
          }
          this.lastSpongePoint = { x: pos.x, y: pos.y };
          this.clipToAnimal();

          // Emitting soft sponge air-bubbles & damp micro-droplets
          if (Math.random() < 0.35 && this.particles && typeof this.particles.addSpongeDab === 'function') {
            this.particles.addSpongeDab(pos.localX, pos.localY, this.activeColor, 2);
          }
        }

        const now = performance.now();
        if (now - this.lastBrushSoundTime > 115) {
          this.lastBrushSoundTime = now;
          sounds.playSpongeStroke();
        }

        if (now - this.lastCoverageCheckTime > 300) {
          this.lastCoverageCheckTime = now;
          this.updateCoverage();
        }
        return;
      }

      // Handle Yarn continuous extrusion / thread drawing
      if (this.activeTool === 'yarn') {
        const yx = pos.x - this.lastYarnPoint.x;
        const yy = pos.y - this.lastYarnPoint.y;
        const dist = Math.hypot(yx, yy);

        // Smooth dynamic needle rotation trailing finger tip & micro-stitching bob
        if (dist >= 2) {
          const strokeAngle = Math.atan2(yy, yx);
          const targetRot = strokeAngle + Math.PI - (-0.8039);
          this.currentNeedleAngle = lerpAngle(this.currentNeedleAngle, targetRot, 0.28);
          this.yarnDistance = (this.yarnDistance || 0) + dist;
          this.updateNeedleTransform();
        }

        // Smooth continuous twisted wool strand
        if (dist >= 3) {
          this.drawYarnSegment(this.lastYarnPoint, pos);
          this.lastYarnPoint = { x: pos.x, y: pos.y };
          this.clipToAnimal();

          // Emitting soft wool tufts periodically along the stitch
          if (Math.random() < 0.35 && this.particles && typeof this.particles.addYarnStitch === 'function') {
            this.particles.addYarnStitch(pos.localX, pos.localY, this.activeColor);
          }
        }

        const now = performance.now();
        if (now - this.lastBrushSoundTime > 90) {
          this.lastBrushSoundTime = now;
          sounds.playYarnGlide();
        }

        if (now - this.lastCoverageCheckTime > 300) {
          this.lastCoverageCheckTime = now;
          this.updateCoverage();
        }
        return;
      }

      // Handle Elephant Trunk fluid color spray
      if (this.activeTool === 'splash') {
        const sx = pos.x - this.lastSplashPoint.x;
        const sy = pos.y - this.lastSplashPoint.y;
        const dist = Math.hypot(sx, sy);

        const geom = this.getTrunkAimGeometry(pos.x, pos.y, true, sx, sy);
        const rect = this.colorCanvas.getBoundingClientRect();
        const trunkLocalX = geom.trunkTipX * (rect.width / this.width);
        const trunkLocalY = geom.trunkTipY * (rect.height / this.height);

        this.updateCrayonPosition(trunkLocalX, trunkLocalY, true);
        this.updateCrayonGraphic();

        // Continuous smooth animated fluid stream from trunk tip to target point
        this.particles.setTrunkStream(geom.trunkTipX, geom.trunkTipY, pos.x, pos.y, this.activeColor);

        // Step by 12px to ensure continuous, rich, organic fluid spray coverage
        const stepDist = 12;
        if (dist >= stepDist) {
          const steps = Math.min(8, Math.floor(dist / stepDist));
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const interpX = this.lastSplashPoint.x + sx * t;
            const interpY = this.lastSplashPoint.y + sy * t;
            this.stampPermanentSplash(this.colorCtx, interpX, interpY, this.activeColor, 0.95, geom.aimAngle);
          }
          this.lastSplashPoint = { x: pos.x, y: pos.y };
          this.clipToAnimal();
          this.hasColored = true;

          // Occasional airborne splash droplets while spraying
          if (Math.random() < 0.45) {
            this.particles.addTrunkSplashBurst(pos.x, pos.y, this.activeColor, 4);
          }
        }

        const now = performance.now();
        if (now - this.lastBrushSoundTime > 85) {
          this.lastBrushSoundTime = now;
          sounds.playTrunkSpray?.();
        }

        if (now - this.lastCoverageCheckTime > 250) {
          this.lastCoverageCheckTime = now;
          this.updateCoverage();
        }
        return;
      }

      this.strokePoints.push({ x: pos.x, y: pos.y });

      // Broad, smooth strokes using mid-point quadratic curves
      const pts = this.strokePoints;
      const len = pts.length;
      if (len >= 2) {
        const p1 = pts[len - 2];
        const p2 = pts[len - 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        this.colorCtx.save();
        if (this.activeTool === 'eraser') {
          this.colorCtx.globalCompositeOperation = 'destination-out';
          this.colorCtx.lineWidth = this.eraserSize;
          this.colorCtx.lineCap = 'round';
          this.colorCtx.lineJoin = 'round';
          this.colorCtx.beginPath();
          this.colorCtx.moveTo(p1.x, p1.y);
          this.colorCtx.lineTo(midX, midY);
          this.colorCtx.stroke();
        } else {
          const colorType = this.getColorType(this.activeColor);
          if (colorType === 'glitter') {
            this.drawGlitterStroke(p1, { x: midX, y: midY }, this.brushSize, this.activeColor);
          } else {
            this.colorCtx.globalCompositeOperation = 'source-over';
            this.colorCtx.strokeStyle = this.activeColor;
            this.colorCtx.lineWidth = this.brushSize;
            this.colorCtx.lineCap = 'round';
            this.colorCtx.lineJoin = 'round';
            this.colorCtx.beginPath();
            this.colorCtx.moveTo(p1.x, p1.y);
            this.colorCtx.lineTo(midX, midY);
            this.colorCtx.stroke();
          }
        }
        this.colorCtx.restore();

        // Clip exterior strokes
        this.clipToAnimal();
      }

      // Subtle ASMR brush stroke / eraser audio
      const now = performance.now();
      if (now - this.lastBrushSoundTime > 90) {
        this.lastBrushSoundTime = now;
        if (this.activeTool === 'eraser') {
          const prevPt = pts[len - 2] || pos;
          const strokeSpeed = Math.hypot(pos.x - prevPt.x, pos.y - prevPt.y);
          if (typeof sounds.playEraserRub === 'function') {
            sounds.playEraserRub(strokeSpeed);
          } else {
            sounds.playEraser();
          }
          if (Math.random() < 0.65 && this.particles && typeof this.particles.addEraserCrumbs === 'function') {
            this.particles.addEraserCrumbs(pos.localX, pos.localY);
          }
        } else if (this.activeTool === 'crayon') {
          const prevPt = pts[len - 2] || pos;
          const strokeSpeed = Math.hypot(pos.x - prevPt.x, pos.y - prevPt.y);
          sounds.playMarkerStroke(strokeSpeed);

          const colorType = this.getColorType(this.activeColor);
          if (colorType === 'glitter') {
            if (this.particles && typeof this.particles.addGlitterSparkles === 'function') {
              this.particles.addGlitterSparkles(pos.localX, pos.localY, this.activeColor, 2);
            }
            // Ultra-soft, gentle ASMR fairy-dust shimmer, throttled to at most once per 380ms
            if (now - (this.lastGlitterSoundTime || 0) > 380) {
              this.lastGlitterSoundTime = now;
              sounds.playGlitterShimmer?.();
            }
          } else {
            if (Math.random() < 0.40 && this.particles && typeof this.particles.addMarkerGleam === 'function') {
              this.particles.addMarkerGleam(pos.localX, pos.localY, this.activeColor);
            }
          }

          // Direction change marker squeak accent
          if (len >= 3) {
            const p0 = pts[len - 3];
            const p1 = pts[len - 2];
            const a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
            const a2 = Math.atan2(pos.y - p1.y, pos.x - p1.x);
            let diff = Math.abs(a2 - a1);
            if (diff > Math.PI) diff = Math.PI * 2 - diff;
            if (diff > 0.95 && Math.random() < 0.45) {
              sounds.playMarkerSqueak(0.24);
            }
          }
        } else {
          sounds.playBrush();
        }
      }

      // Check coverage periodically without pausing active stroke
      if (now - this.lastCoverageCheckTime > 300) {
        this.lastCoverageCheckTime = now;
        this.updateCoverage();
      }
    };

    const onUp = (e) => {
      // Only release/finish if this is the active pointer that started drawing
      if (this.activePointerId !== null && e.pointerId !== this.activePointerId) {
        return;
      }
      this.activePointerId = null;
      try {
        c.releasePointerCapture?.(e.pointerId);
      } catch (_) {}

      if (this.isDrawing) {
        this.isDrawing = false;
        sounds.stopSpongeStroke();
        sounds.stopDoughStroke();
        sounds.stopClayStroke();
        sounds.stopYarnStroke();
        sounds.stopTrunkSpray?.();
        this.particles?.stopTrunkStream?.();
        this.clipToAnimal();
        this.saveUndoState();
        this.updateCoverage();
        this.hasColored = true;
        if (this.activeTool === 'crayon') {
          this.targetNibAngle = 0;
          this.updateNibFlex(0, 0, false);
        } else if (this.activeTool === 'eraser') {
          this.targetEraserAngle = 0;
          this.updateEraserTransform(0, 0);
        } else {
          this.updateCrayonGraphic(0);
          if (this.activeTool === 'yarn') {
            this.updateNeedleTransform();
          } else if (this.activeTool === 'dough' || this.activeTool === 'clay') {
            this.updateDoughTransform();
          } else if (this.activeTool === 'sponge') {
            this.updateSpongeTransform();
          }
        }
      }
      const isTouch = e.pointerType === 'touch' || (e.touches && e.touches.length > 0);
      if (isTouch) {
        if (this.crayonEl) {
          this.crayonEl.style.transition = 'opacity 0.25s ease';
          this.crayonEl.style.opacity = '0';
          setTimeout(() => {
            if (!this.isDrawing) {
              this.updateCrayonPosition(0, 0, false);
              if (this.crayonEl) {
                this.crayonEl.style.opacity = '1';
                this.crayonEl.style.transition = 'none';
              }
            }
          }, 250);
        }
      }
    };

    // Pointer Events
    c.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', (e) => {
      if (this.activePointerId === null || e.pointerId === this.activePointerId) {
        onUp(e);
      }
    });

    // Leave canvas
    c.addEventListener('pointerleave', (e) => {
      if (!this.isDrawing && e.pointerType !== 'touch') {
        this.updateCrayonPosition(0, 0, false);
      }
      if (this.activePointerId !== null && e.pointerId === this.activePointerId) {
        this.particles?.stopTrunkStream?.();
        sounds.stopSpongeStroke();
        sounds.stopDoughStroke();
        sounds.stopClayStroke();
        sounds.stopYarnStroke();
        sounds.stopTrunkSpray?.();
      }
    });

    // Safety release if window loses focus or app backgrounded
    window.addEventListener('blur', () => {
      if (this.isDrawing || this.activePointerId !== null) {
        this.activePointerId = null;
        this.isDrawing = false;
        sounds.stopSpongeStroke();
        sounds.stopDoughStroke();
        sounds.stopClayStroke();
        sounds.stopYarnStroke();
        sounds.stopTrunkSpray?.();
        this.particles?.stopTrunkStream?.();
      }
    });

    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') {
        const pos = this.getPointerPos(e);
        if (this.activeTool === 'splash') {
          const geom = this.getTrunkAimGeometry(pos.x, pos.y, false);
          const rect = this.colorCanvas.getBoundingClientRect();
          const trunkLocalX = geom.trunkTipX * (rect.width / this.width);
          const trunkLocalY = geom.trunkTipY * (rect.height / this.height);
          this.updateCrayonPosition(trunkLocalX, trunkLocalY, true);
          this.updateCrayonGraphic();
        } else {
          this.updateCrayonPosition(pos.localX, pos.localY, true);
        }
      }
    });
  }

  celebrateCompletion() {
    this.completedForCurrentAnimal = true;
    this.isDrawing = false;
    this.activePointerId = null;
    if (this.crayonEl) {
      this.crayonEl.classList.add('hidden');
    }
    sounds.playFanfare();
    if (this.confettiFX) {
      this.confettiFX.burstCelebration(this.width / 2, this.height * 0.45, 90);
      this.confettiFX.fountainBothSides(60);
    } else if (typeof this.particles.burstAt === 'function') {
      this.particles.burstAt(this.width / 2, this.height * 0.45, 80);
    } else if (typeof this.particles.celebrate === 'function') {
      this.particles.celebrate();
    }

    if (this.onCelebrate) {
      this.onCelebrate();
    }
  }

  // Exports composite image with white paper background, user's paint, and top crisp line art
  exportMergedPNG() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = this.width;
    exportCanvas.height = this.height;
    const ctx = exportCanvas.getContext('2d');

    // Pure white paper background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);

    // Player's colored artwork
    ctx.drawImage(this.colorCanvas, 0, 0);

    // Original black line art & facial details on top
    ctx.drawImage(this.lineCanvas, 0, 0);

    return exportCanvas.toDataURL('image/png');
  }

  // Official YouTube Playables pause/resume handler
  pause() {
    this.isPaused = true;
    if (this.isDrawing || this.activePointerId !== null) {
      this.activePointerId = null;
      this.isDrawing = false;
      sounds.stopSpongeStroke();
      sounds.stopDoughStroke();
      sounds.stopClayStroke();
      sounds.stopYarnStroke();
      sounds.stopTrunkSpray?.();
      this.particles?.stopTrunkStream?.();
      this.clipToAnimal();
      this.saveUndoState();
      this.updateCoverage();
      this.updateCrayonGraphic(0);
    }
    this.particles?.pause?.();
    this.confettiFX?.pause?.();
    this.stopNibSpringLoop();
  }

  resume() {
    this.isPaused = false;
    this.particles?.resume?.();
    this.confettiFX?.resume?.();
    this.startNibSpringLoop();
  }
}