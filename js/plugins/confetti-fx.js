// High-Performance Particle & Confetti Celebration Engine
// Optimized for 60fps mobile canvas performance on YouTube Playables

export class ConfettiFX {
  constructor(canvas) {
    this.canvas = canvas || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.lastTime = 0;
    this.colors = [
      '#ef4444', '#f97316', '#facc15', '#22c55e',
      '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'
    ];
    this.isPaused = false;
  }

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
  }

  clear() {
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
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
    if (this.particles.length > 0 && !this.animId) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  // Multi-cannon explosive celebration burst
  burstCelebration(centerX, centerY, count = 80) {
    const cx = centerX !== undefined ? centerX : this.canvas.width / 2;
    const cy = centerY !== undefined ? centerY : this.canvas.height / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 11;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = 6 + Math.random() * 8;
      const type = Math.random() > 0.35 ? 'rect' : (Math.random() > 0.5 ? 'star' : 'circle');

      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 4 + 2), // upward bias
        color: color,
        size: size,
        type: type,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        alpha: 1.0,
        life: 0.9 + Math.random() * 0.4,
        gravity: 0.28 + Math.random() * 0.15,
        drag: 0.97
      });
    }

    if (!this.animId && !this.isPaused) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  // Left & right celebratory cannon fountain
  fountainBothSides(count = 60) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Left cannon
    for (let i = 0; i < count / 2; i++) {
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      const speed = 8 + Math.random() * 12;
      this.particles.push({
        x: 0,
        y: h * 0.85,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: 7 + Math.random() * 6,
        type: 'rect',
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1.0,
        life: 1.2,
        gravity: 0.32,
        drag: 0.98
      });
    }

    // Right cannon
    for (let i = 0; i < count / 2; i++) {
      const angle = -Math.PI * 0.75 + (Math.random() - 0.5) * 0.5;
      const speed = 8 + Math.random() * 12;
      this.particles.push({
        x: w,
        y: h * 0.85,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        size: 7 + Math.random() * 6,
        type: 'rect',
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1.0,
        life: 1.2,
        gravity: 0.32,
        drag: 0.98
      });
    }

    if (!this.animId && !this.isPaused) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  loop(currentTime) {
    if (this.isPaused) return;
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.drag;
      p.vy = (p.vy + p.gravity) * p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha -= dt * 0.45;

      if (p.alpha <= 0 || p.y > this.canvas.height + 40) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.type === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.drawStar(0, 0, 5, p.size * 0.8, p.size * 0.4);
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame((t) => this.loop(t));
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}
