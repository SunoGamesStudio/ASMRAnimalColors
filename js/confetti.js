// Celebration Particles & Sparkles Engine
// Renders celebration fireworks and tap sparkles with ASMR visual delight!

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.trunkStream = null;
    this.animId = null;
    this.lastTime = 0;
    this.isPaused = false;
  }

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }

  clear() {
    this.particles = [];
    this.trunkStream = null;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  pause() {
    this.isPaused = true;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resume() {
    this.isPaused = false;
    if (this.particles.length > 0 || (this.trunkStream && this.trunkStream.active)) {
      this.startLoop();
    }
  }

  // Cute mini star sparkle at tap location
  addTapSparkles(x, y, color = '#facc15') {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 6,
        color: color,
        alpha: 1,
        life: 0.6 + Math.random() * 0.4,
        type: 'star',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2
      });
    }
    this.startLoop();
  }

  // Soft squishy dough crumbs effect at tap location
  addDoughSquish(x, y, color = '#f59e0b', count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 1.4 + Math.random() * 2.2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: 3 + Math.random() * 3.5,
        color: color,
        alpha: 0.9,
        life: 0.35 + Math.random() * 0.25,
        type: 'dough',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }
    this.startLoop();
  }

  // Soft wool fiber tufts & gentle ASMR sparkles at needle stitch tip
  addYarnStitch(x, y, color = '#f43f5e') {
    const count = 3;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.6;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        size: 2.2 + Math.random() * 2.6,
        color: color,
        alpha: 0.85,
        life: 0.30 + Math.random() * 0.20,
        type: 'dough',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }
    this.startLoop();
  }

  // Porous sponge air-bubble & paint mist particles at dab location
  addSpongeDab(x, y, color = '#38bdf8', count = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.9 + Math.random() * 2.0;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        gravity: 0.10,
        size: 2.2 + Math.random() * 2.6,
        color: color,
        alpha: 0.9,
        life: 0.32 + Math.random() * 0.22,
        type: 'sponge_bubble',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.1
      });
    }
    this.startLoop();
  }

  // ASMR Fresh Wet-Ink Micro-Gleam & Shimmer along marker stroke
  addMarkerGleam(x, y, color) {
    const count = 2;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -0.4 - Math.random() * 0.5,
        gravity: -0.02,
        size: 2.2 + Math.random() * 2.2,
        color: color,
        alpha: 0.85,
        life: 0.28,
        type: 'marker_gleam',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2
      });
    }
    this.startLoop();
  }

  // Brilliant 4-Point Diamond Sparkles for Glitter Drawing
  addGlitterSparkles(x, y, color = '#ffd700', count = 3) {
    const sparkles = ['#ffffff', '#fff9c4', '#ffeb3b', '#ffd700', color];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.8;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.25,
        gravity: -0.015,
        size: 3.5 + Math.random() * 4.5,
        color: sparkles[Math.floor(Math.random() * sparkles.length)],
        alpha: 1.0,
        life: 0.38 + Math.random() * 0.22,
        type: 'glitter_star',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3
      });
    }
    this.startLoop();
  }

  // ASMR Soft Rubber Eraser Crumbs & Shavings at wipe contact point
  addEraserCrumbs(x, y) {
    const count = 3;
    const colors = ['#fda4af', '#f43f5e', '#ffffff', '#e2e8f0'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.8;
      this.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.35,
        gravity: 0.12,
        size: 1.8 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.88,
        life: 0.30 + Math.random() * 0.18,
        type: 'eraser_crumb',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3
      });
    }
    this.startLoop();
  }

  // Active Animated Fluid Trunk Stream (quadratic curve & particle stream from nozzle tip to target)
  setTrunkStream(startX, startY, targetX, targetY, color = '#38bdf8') {
    if (!this.trunkStream) {
      this.trunkStream = {
        active: true,
        startX,
        startY,
        targetX,
        targetY,
        color,
        time: 0,
        emitTimer: 0
      };
    } else {
      this.trunkStream.active = true;
      this.trunkStream.startX = startX;
      this.trunkStream.startY = startY;
      this.trunkStream.targetX = targetX;
      this.trunkStream.targetY = targetY;
      this.trunkStream.color = color;
    }
    this.startLoop();
  }

  stopTrunkStream() {
    if (this.trunkStream) {
      this.trunkStream.active = false;
    }
  }

  // Airborne splash droplets burst when stream reaches target point on drawing
  addTrunkSplashBurst(targetX, targetY, color = '#38bdf8', count = 10) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.4 + Math.random() * 5.6;
      const isDroplet = Math.random() > 0.35;
      this.particles.push({
        x: targetX + (Math.random() - 0.5) * 6,
        y: targetY + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.8,
        gravity: 0.22 + Math.random() * 0.10,
        size: isDroplet ? (2.4 + Math.random() * 3.2) : (1.4 + Math.random() * 2),
        color: color,
        alpha: 0.95,
        life: 0.26 + Math.random() * 0.22,
        type: isDroplet ? 'water_droplet' : 'water_mist',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25
      });
    }
    this.startLoop();
  }

  // Natural Water Pipe / Hose Spray Particles
  // Gentle, focused sparkling water droplets flowing smoothly from the nozzle
  addTrunkSprayParticles(startX, startY, targetX, targetY, color = '#38bdf8', count = 8) {
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.hypot(dx, dy);
    const baseAngle = dist > 5 ? Math.atan2(dy, dx) : -Math.PI * 0.20;

    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.25;
      const angle = baseAngle + spread;
      const travelSpeed = 6 + Math.random() * 8;
      const isDroplet = Math.random() > 0.4;

      this.particles.push({
        x: startX + (Math.random() - 0.5) * 4,
        y: startY + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * travelSpeed,
        vy: Math.sin(angle) * travelSpeed,
        gravity: 0.12 + Math.random() * 0.08,
        size: isDroplet ? (2.5 + Math.random() * 3.5) : (1.5 + Math.random() * 2),
        color: color,
        alpha: 0.9,
        life: 0.28 + Math.random() * 0.22,
        type: isDroplet ? 'water_droplet' : 'water_mist',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2
      });
    }
    this.startLoop();
  }

  // Burst particles at specified coordinates
  burstAt(x, y, count = 60) {
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f97316'];
    const originX = (typeof x === 'number') ? x : this.canvas.width * 0.5;
    const originY = (typeof y === 'number') ? y : this.canvas.height * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 4 + Math.random() * 9;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        gravity: 0.32 + Math.random() * 0.15,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 2.0 + Math.random() * 1.2,
        type: Math.random() > 0.4 ? 'confetti' : 'star',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3
      });
    }
    this.startLoop();
  }

  // Giant celebration confetti explosion across the screen
  celebrate() {
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#84cc16', '#eab308', '#f97316'];
    const w = this.canvas.width;
    const h = this.canvas.height;
    const count = 120;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: w * 0.5 + (Math.random() - 0.5) * w * 0.3,
        y: h * 0.5 + (Math.random() - 0.5) * h * 0.2,
        vx: (Math.random() - 0.5) * 16,
        vy: -8 - Math.random() * 12,
        gravity: 0.35 + Math.random() * 0.15,
        size: 8 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 2.5 + Math.random() * 1.5,
        type: Math.random() > 0.4 ? 'confetti' : 'star',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.3
      });
    }
    this.startLoop();
  }

  startLoop() {
    if (this.isPaused || this.animId) return;
    this.lastTime = performance.now();
    const frame = (time) => {
      const dt = Math.min((time - this.lastTime) / 1000, 0.1);
      this.lastTime = time;
      this.update(dt);
      this.draw();

      if (this.particles.length > 0 || (this.trunkStream && this.trunkStream.active)) {
        this.animId = requestAnimationFrame(frame);
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    };
    this.animId = requestAnimationFrame(frame);
  }

  update(dt) {
    // 1. Continuous stream particle emission along the fluid path
    if (this.trunkStream && this.trunkStream.active) {
      const s = this.trunkStream;
      s.time += dt;
      s.emitTimer = (s.emitTimer || 0) + dt;

      const dx = s.targetX - s.startX;
      const dy = s.targetY - s.startY;
      const dist = Math.hypot(dx, dy);

      if (dist >= 8 && s.emitTimer >= 0.02) {
        s.emitTimer = 0;
        const mx = (s.startX + s.targetX) * 0.5;
        const my = (s.startY + s.targetY) * 0.5;
        const nx = -dy / dist;
        const ny = dx / dist;
        const wave = Math.sin(s.time * 18) * Math.min(8, dist * 0.1) + Math.sin(s.time * 30) * 3;
        const arch = -Math.min(22, dist * 0.2);
        const cx = mx + nx * wave;
        const cy = my + arch + ny * wave;

        for (let k = 0; k < 2; k++) {
          this.particles.push({
            type: 'stream_droplet',
            t: Math.random() * 0.12,
            speed: 3.5 + Math.random() * 2.2,
            p0: { x: s.startX, y: s.startY },
            p1: { x: cx, y: cy },
            p2: { x: s.targetX, y: s.targetY },
            normOffset: (Math.random() - 0.5) * 6,
            size: 2.2 + Math.random() * 2.6,
            color: s.color,
            alpha: 0.95,
            life: 0.35
          });
        }
      }
    }

    // 2. Update airborne particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'stream_droplet') {
        p.t += p.speed * dt;
        p.life -= dt;
        if (p.t >= 1.0 || p.life <= 0) {
          // Reached target point: bounce as splash droplet
          p.type = 'water_droplet';
          p.x = p.p2.x;
          p.y = p.p2.y;
          const a = Math.random() * Math.PI * 2;
          const spd = 2 + Math.random() * 4;
          p.vx = Math.cos(a) * spd;
          p.vy = Math.sin(a) * spd - 1.5;
          p.gravity = 0.22;
          p.life = 0.2 + Math.random() * 0.15;
          p.rotation = Math.random() * Math.PI * 2;
          p.vRot = (Math.random() - 0.5) * 0.2;
        } else {
          // Quadratic bezier interpolation: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
          const u = 1 - p.t;
          const bx = u * u * p.p0.x + 2 * u * p.t * p.p1.x + p.t * p.t * p.p2.x;
          const by = u * u * p.p0.y + 2 * u * p.t * p.p1.y + p.t * p.t * p.p2.y;
          const dx = p.p2.x - p.p0.x;
          const dy = p.p2.y - p.p0.y;
          const d = Math.hypot(dx, dy) || 1;
          p.x = bx + (-dy / d) * p.normOffset;
          p.y = by + (dx / d) * p.normOffset;
          p.alpha = Math.min(1, p.life * 3);
        }
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) {
        p.vy += p.gravity;
      }
      if (p.vRot) {
        p.rotation += p.vRot;
      }
      p.life -= dt;
      p.alpha = Math.max(0, p.life);

      if (p.life <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw smooth animated fluid stream (Canvas 2D quadratic curves)
    if (this.trunkStream && this.trunkStream.active) {
      const s = this.trunkStream;
      const dx = s.targetX - s.startX;
      const dy = s.targetY - s.startY;
      const dist = Math.hypot(dx, dy);

      if (dist >= 8) {
        const mx = (s.startX + s.targetX) * 0.5;
        const my = (s.startY + s.targetY) * 0.5;
        const nx = -dy / dist;
        const ny = dx / dist;
        const wave = Math.sin(s.time * 18) * Math.min(8, dist * 0.1) + Math.sin(s.time * 30) * 3;
        const arch = -Math.min(22, dist * 0.2);
        const cx = mx + nx * wave;
        const cy = my + arch + ny * wave;

        this.ctx.save();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Outer liquid aura / translucent water coat
        this.ctx.strokeStyle = s.color;
        this.ctx.globalAlpha = 0.38;
        this.ctx.lineWidth = 16;
        this.ctx.beginPath();
        this.ctx.moveTo(s.startX, s.startY);
        this.ctx.quadraticCurveTo(cx, cy, s.targetX, s.targetY);
        this.ctx.stroke();

        // Main saturated fluid stream
        this.ctx.globalAlpha = 0.95;
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(s.startX, s.startY);
        this.ctx.quadraticCurveTo(cx, cy, s.targetX, s.targetY);
        this.ctx.stroke();

        // Inner high-velocity core highlight
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.globalAlpha = 0.45;
        this.ctx.lineWidth = 4.2;
        this.ctx.beginPath();
        this.ctx.moveTo(s.startX, s.startY);
        this.ctx.quadraticCurveTo(cx, cy, s.targetX, s.targetY);
        this.ctx.stroke();

        // Glossy crest specular shine
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        this.ctx.globalAlpha = 0.75;
        this.ctx.lineWidth = 2.0;
        this.ctx.beginPath();
        this.ctx.moveTo(s.startX, s.startY);
        this.ctx.quadraticCurveTo(cx, cy - 2, s.targetX, s.targetY);
        this.ctx.stroke();

        // Nozzle exit froth / spray ring at startX, startY
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.85;
        this.ctx.beginPath();
        this.ctx.arc(s.startX, s.startY, 4.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Target impact expanding liquid ripple ring
        const ripple = (Math.sin(s.time * 22) + 1) * 0.5;
        this.ctx.strokeStyle = s.color;
        this.ctx.globalAlpha = 0.65;
        this.ctx.lineWidth = 2.2;
        this.ctx.beginPath();
        this.ctx.ellipse(s.targetX, s.targetY, 15 + ripple * 7, 9 + ripple * 4, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
      }
    }

    // 2. Draw airborne particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.min(1, p.alpha);
      this.ctx.translate(p.x, p.y);
      if (p.rotation) {
        this.ctx.rotate(p.rotation);
      }
      this.ctx.fillStyle = p.color;

      if (p.type === 'confetti') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.type === 'dough') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      } else if (p.type === 'water_droplet' || p.type === 'stream_droplet') {
        // High-velocity fluid droplet with glossy specular sheen
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        // Specular liquid reflection highlight dot
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'water_mist') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'sponge_bubble') {
        // Translucent porous bubble with specular highlight ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.70)';
        this.ctx.lineWidth = 1.0;
        this.ctx.stroke();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'marker_gleam') {
        // Juicy wet ink micro-sheen sparkle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'glitter_star') {
        // Brilliant 4-point diamond star sparkle with white-hot core
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        const s = p.size;
        const b = s * 0.22;
        this.ctx.moveTo(0, -s);
        this.ctx.quadraticCurveTo(0, 0, b, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, s);
        this.ctx.quadraticCurveTo(0, 0, -b, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, -s);
        this.ctx.moveTo(-s, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, b);
        this.ctx.quadraticCurveTo(0, 0, s, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, -b);
        this.ctx.quadraticCurveTo(0, 0, -s, 0);
        this.ctx.fill();
        // Bright central highlight
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'eraser_crumb') {
        // Soft tactile rubber shavings/crumbs
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.75, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      } else {
        // Draw 5-point star
        this.drawStar(this.ctx, 0, 0, 5, p.size, p.size * 0.45);
      }
      this.ctx.restore();
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}