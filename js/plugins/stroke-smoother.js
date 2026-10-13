// Smooth Catmull-Rom & Quadratic Bezier Stroke Interpolator
// Ensures silky smooth, responsive marker lines on high-DPI touch devices

export class StrokeSmoother {
  constructor() {
    this.points = [];
  }

  begin(x, y) {
    this.points = [{ x, y }];
  }

  addPoint(x, y) {
    const last = this.points[this.points.length - 1];
    if (last) {
      const dist = Math.hypot(x - last.x, y - last.y);
      // Ignore minute jitter < 2px
      if (dist < 2) return null;
    }
    this.points.push({ x, y });

    if (this.points.length >= 3) {
      const p0 = this.points[this.points.length - 3];
      const p1 = this.points[this.points.length - 2];
      const p2 = this.points[this.points.length - 1];

      // Midpoints for smooth quadratic bezier curve
      const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      return {
        start: mid1,
        control: p1,
        end: mid2
      };
    }
    return null;
  }

  end() {
    const remaining = [...this.points];
    this.points = [];
    return remaining;
  }
}
