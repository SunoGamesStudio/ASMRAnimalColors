// High-Performance Spectacular Fireworks Celebration Engine
// Optimized for 60fps pyrotechnics, particle physics, and kid engagement on YouTube Playables
import { sounds } from '../audio.js';

export class FireworksFX {
  constructor(canvas) {
    this.canvas = canvas || this.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.rockets = [];
    this.particles = [];
    this.flashes = [];
    this.animId = null;
    this.lastTime = 0;
    this.celebrationActive = false;
    this.tapListener = null;

    // Curated high-contrast, dazzling pyrotechnic palettes
    this.palettes = [
      { name: 'gold', colors: ['#ffffff', '#ffd700', '#ffea00', '#ffaa00', '#fff3b0'] },
      { name: 'cyan', colors: ['#ffffff', '#00f5d4', '#00bbf9', '#38bdf8', '#e0f2fe'] },
      { name: 'ruby', colors: ['#ffffff', '#ff007f', '#f43f5e', '#ec4899', '#ffe4e6'] },
      { name: 'emerald', colors: ['#ffffff', '#39ff14', '#22c55e', '#10b981', '#dcfce7'] },
      { name: 'violet', colors: ['#ffffff', '#c084fc', '#a855f7', '#7c3aed', '#f3e8ff'] },
      { name: 'coral', colors: ['#ffffff', '#fb923c', '#f97316', '#ef4444', '#ffedd5'] },
      { name: 'rainbow', colors: ['#ffd700', '#00f5d4', '#f43f5e', '#39ff14', '#a855f7', '#fb923c'] }
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  createCanvas() {
    let el = document.getElementById('fireworks-canvas');
    if (!el) {
      el = document.createElement('canvas');
      el.id = 'fireworks-canvas';
      el.className = 'fireworks-canvas hidden';
      document.body.appendChild(el);
    }
    return el;
  }

  resize() {
    if (!this.canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  clear() {
    this.rockets = [];
    this.particles = [];
    this.flashes = [];
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.removeTapListener();
    this.celebrationActive = false;
  }

  setupTapListener() {
    if (this.tapListener) return;
    this.tapListener = (e) => {
      if (!this.celebrationActive) return;
      const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
      if (x !== null && y !== null) {
        // Launch a fast interactive rocket directly to child's tap
        this.launchRocket(x, Math.max(80, Math.min(this.canvas.height * 0.7, y)), {
          paletteIndex: Math.floor(Math.random() * this.palettes.length),
          speedFactor: 1.25,
          interactive: true
        });
      }
    };

    window.addEventListener('pointerdown', this.tapListener, { passive: true });
  }

  removeTapListener() {
    if (this.tapListener) {
      window.removeEventListener('pointerdown', this.tapListener);
      this.tapListener = null;
    }
  }

  // Launch a single pyrotechnic rocket ascending upwards
  launchRocket(targetX, targetY, options = {}) {
    const w = this.canvas.width || window.innerWidth;
    const h = this.canvas.height || window.innerHeight;

    const startX = options.startX !== undefined 
      ? options.startX 
      : targetX + (Math.random() - 0.5) * Math.min(100, w * 0.2);
    const startY = h + 10;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speed = (14 + Math.random() * 4) * (options.speedFactor || 1);
    const angle = Math.atan2(dy, dx);

    const palette = this.palettes[options.paletteIndex !== undefined ? options.paletteIndex : Math.floor(Math.random() * this.palettes.length)];

    this.rockets.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: palette.colors[1] || '#ffd700',
      palette: palette,
      trail: [],
      type: options.type || 'chrysanthemum',
      burstCount: options.burstCount || (options.interactive ? 55 : 68),
      interactive: !!options.interactive
    });

    if (sounds && typeof sounds.playFireworkLaunch === 'function') {
      sounds.playFireworkLaunch();
    }

    if (!this.animId) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  // Detonates the rocket at apex into an explosion of sparkling light
  detonate(rocket) {
    const x = rocket.targetX || rocket.x;
    const y = rocket.targetY || rocket.y;
    const palette = rocket.palette || this.palettes[0];
    const colors = palette.colors;

    if (sounds && typeof sounds.playFireworkBurst === 'function') {
      sounds.playFireworkBurst();
    }

    // 1. Core Light Flash
    this.flashes.push({
      x: x,
      y: y,
      radius: 8,
      maxRadius: 65,
      alpha: 0.85,
      color: colors[0] || '#ffffff'
    });

    // 2. High-speed spark burst
    const count = rocket.burstCount || 65;
    const isWillow = rocket.type === 'willow';

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
      const speed = isWillow 
        ? (3.0 + Math.random() * 7.5) 
        : (2.5 + Math.random() * 8.5);
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        x: x,
        y: y,
        lastX: x,
        lastY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        alpha: 1.0,
        decay: isWillow ? (0.010 + Math.random() * 0.008) : (0.014 + Math.random() * 0.012),
        drag: isWillow ? 0.94 : 0.955,
        gravity: isWillow ? 0.22 : 0.16,
        size: 2.2 + Math.random() * 1.8,
        trail: [],
        maxTrail: isWillow ? 5 : 3,
        twinkle: Math.random() > 0.4
      });
    }

    // 3. Secondary glittering sparks (willow/gold embers)
    for (let j = 0; j < 14; j++) {
      const gAngle = Math.random() * Math.PI * 2;
      const gSpeed = 1.0 + Math.random() * 4.0;
      this.particles.push({
        x: x,
        y: y,
        lastX: x,
        lastY: y,
        vx: Math.cos(gAngle) * gSpeed,
        vy: Math.sin(gAngle) * gSpeed,
        color: '#ffffff',
        alpha: 1.0,
        decay: 0.018 + Math.random() * 0.015,
        drag: 0.92,
        gravity: 0.12,
        size: 1.5,
        trail: [],
        maxTrail: 2,
        twinkle: true
      });
    }
  }

  // Orchestrates a spectacular fireworks celebration show
  startCelebration(onComplete) {
    this.clear();
    this.resize();
    this.canvas.classList.remove('hidden');
    this.celebrationActive = true;
    this.setupTapListener();

    const w = this.canvas.width || window.innerWidth;
    const h = this.canvas.height || window.innerHeight;

    // Timed festive fireworks crescendo
    const timeline = [
      // Wave 1: Opening twin bursts (Gold & Cyan)
      { delay: 0,    x: w * 0.32, y: h * 0.35, p: 0, type: 'willow' },
      { delay: 200,  x: w * 0.68, y: h * 0.30, p: 1, type: 'peony' },

      // Wave 2: High center Ruby & Emerald starbursts
      { delay: 480,  x: w * 0.50, y: h * 0.22, p: 2, type: 'chrysanthemum' },
      { delay: 750,  x: w * 0.24, y: h * 0.38, p: 3, type: 'willow' },
      { delay: 1000, x: w * 0.76, y: h * 0.36, p: 4, type: 'peony' },

      // Wave 3: Grand Finale Volley (Synchronized triple burst!)
      { delay: 1300, x: w * 0.35, y: h * 0.24, p: 6, type: 'chrysanthemum' }, // Rainbow
      { delay: 1380, x: w * 0.65, y: h * 0.24, p: 0, type: 'willow' },        // Golden Palm
      { delay: 1520, x: w * 0.50, y: h * 0.17, p: 5, type: 'peony' }          // Coral Crown
    ];

    timeline.forEach(item => {
      setTimeout(() => {
        if (!this.celebrationActive) return;
        this.launchRocket(item.x, item.y, {
          paletteIndex: item.p,
          type: item.type
        });
      }, item.delay);
    });

    // Modal opens smoothly at 2200ms once child has enjoyed the full fireworks spectacle!
    setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 2200);

    // Fade out and cleanup canvas after finale settles
    setTimeout(() => {
      this.celebrationActive = false;
      this.removeTapListener();
    }, 4200);
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.08);
    this.lastTime = currentTime;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Use gentle clear for slight luminous motion trails
    this.ctx.clearRect(0, 0, w, h);

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter'; // Additive blending for luminous glow

    // 1. Update & Render Flash Rings
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.radius += (f.maxRadius - f.radius) * 0.3;
      f.alpha -= 0.12;

      if (f.alpha <= 0.02) {
        this.flashes.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
      grad.addColorStop(0, `rgba(255, 255, 255, ${f.alpha})`);
      grad.addColorStop(0.4, f.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Update & Render Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.trail.push({ x: r.x, y: r.y, alpha: 1.0 });
      if (r.trail.length > 5) r.trail.shift();

      r.x += r.vx;
      r.y += r.vy;

      // Draw rocket trail
      for (let t = 0; t < r.trail.length; t++) {
        const pt = r.trail[t];
        const alpha = (t + 1) / r.trail.length * 0.7;
        this.ctx.fillStyle = r.color;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Draw rocket head
      this.ctx.globalAlpha = 1.0;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 2.8, 0, Math.PI * 2);
      this.ctx.fill();

      // Check detonation criteria
      const reachedTarget = r.y <= r.targetY || (r.vy >= 0);
      if (reachedTarget) {
        this.detonate(r);
        this.rockets.splice(i, 1);
      }
    }

    // 3. Update & Render Spark Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.lastX = p.x;
      p.lastY = p.y;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > p.maxTrail) p.trail.shift();

      p.vx *= p.drag;
      p.vy = (p.vy + p.gravity) * p.drag;
      p.x += p.vx;
      p.y += p.vy;

      p.alpha -= p.decay;

      if (p.alpha <= 0.01 || p.y > h + 30) {
        this.particles.splice(i, 1);
        continue;
      }

      let drawAlpha = p.alpha;
      if (p.twinkle && Math.random() > 0.45) {
        drawAlpha *= 0.4 + Math.random() * 0.8;
      }

      this.ctx.globalAlpha = Math.max(0, Math.min(1, drawAlpha));

      // Draw streak from last position
      this.ctx.strokeStyle = p.color;
      this.ctx.lineWidth = p.size;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(p.lastX, p.lastY);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();

      // Bright white head spark
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();

    const hasActiveFX = this.rockets.length > 0 || this.particles.length > 0 || this.flashes.length > 0;
    if (hasActiveFX) {
      this.animId = requestAnimationFrame((t) => this.loop(t));
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, w, h);
      if (!this.celebrationActive) {
        this.canvas.classList.add('hidden');
      }
    }
  }

  pause() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
      this.isPaused = true;
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      const hasActiveFX = this.rockets.length > 0 || this.particles.length > 0 || this.flashes.length > 0;
      if (hasActiveFX && !this.animId) {
        this.lastTime = performance.now();
        this.animId = requestAnimationFrame((t) => this.loop(t));
      }
    }
  }
}

