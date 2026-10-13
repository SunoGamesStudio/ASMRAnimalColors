// Celebration Tik & Victory Overlay Engine
// Displays giant animated green Tik (✓) with radial sunburst, confetti, and sound

export class CelebrationTik {
  constructor(container, onComplete) {
    this.container = container || document.body;
    this.onComplete = onComplete;
    this.overlay = null;
    this.createDOM();
  }

  createDOM() {
    let existing = document.getElementById('celebration-tik-overlay');
    if (existing) {
      existing.remove();
    }

    this.overlay = document.createElement('div');
    this.overlay.id = 'celebration-tik-overlay';
    this.overlay.className = 'celebration-tik-overlay hidden';

    this.overlay.innerHTML = `
      <div class="tik-sunburst-backdrop"></div>
      <div class="tik-card">
        <div class="tik-ring-glow"></div>
        <div class="tik-badge">
          <svg class="tik-svg" viewBox="0 0 52 52">
            <circle class="tik-circle" cx="26" cy="26" r="25" fill="#22c55e"/>
            <path class="tik-check" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="48" stroke-dashoffset="48" d="M14 27 l8 8 l16 -16"/>
          </svg>
        </div>
        <div class="tik-title">COMPLETED! ✨</div>
        <div class="tik-subtitle">Awesome coloring!</div>
      </div>
    `;

    this.container.appendChild(this.overlay);
  }

  show(options = {}) {
    if (!this.overlay) this.createDOM();
    const { title = 'COMPLETED! ✨', subtitle = 'Awesome coloring!', duration = 1600 } = options;

    const titleEl = this.overlay.querySelector('.tik-title');
    const subEl = this.overlay.querySelector('.tik-subtitle');
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = subtitle;

    this.overlay.classList.remove('hidden');
    this.overlay.classList.add('animate-in');

    // Trigger checkmark draw animation
    const checkPath = this.overlay.querySelector('.tik-check');
    if (checkPath) {
      checkPath.style.strokeDashoffset = '48';
      // Force reflow
      void checkPath.offsetWidth;
      checkPath.style.transition = 'stroke-dashoffset 0.45s cubic-bezier(0.65, 0, 0.45, 1) 0.15s';
      checkPath.style.strokeDashoffset = '0';
    }

    // Auto dismiss after celebration duration and trigger modal
    setTimeout(() => {
      this.hide();
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }, duration);
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.remove('animate-in');
      this.overlay.classList.add('hidden');
    }
  }
}
