// ─── PHIGeometryEngine.ts — Golden Ratio Geometry for the Sovereign World ───
// PHI = 1.6180339887498948482. All world geometry derives from this law.
// Fibonacci spiral governs actor placement. Golden rectangle subdivides world zones.
// Schumann resonance (7.83Hz) pulses the lighting. Attributed to Alfredo Medina Hernandez.

// PHI truncated to JS-safe float precision (IEEE 754 double cannot represent more digits)
export const PHI = 1.618033988749895;
export const SCHUMANN_HZ = 7.83;
export const GOLDEN_ANGLE_DEG = 137.50776405;
export const GOLDEN_ANGLE_RAD = GOLDEN_ANGLE_DEG * (Math.PI / 180);

// Fibonacci sequence up to 34 terms
const FIB_SEQUENCE: number[] = [1, 1];
for (let i = 2; i < 34; i++) {
  FIB_SEQUENCE.push(FIB_SEQUENCE[i - 1] + FIB_SEQUENCE[i - 2]);
}

export interface Vec2 {
  x: number;
  y: number;
}
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FibonacciPoint {
  x: number;
  y: number;
  radius: number;
  angle: number;
  index: number;
}

export interface GoldenRectangleLayout {
  primary: { x: number; y: number; width: number; height: number };
  secondary: { x: number; y: number; width: number; height: number };
  tertiary: { x: number; y: number; width: number; height: number };
  phi_point: Vec2; // the golden section focal point
}

export interface PHIProportionedRect {
  width: number;
  height: number;
}

export class PHIGeometryEngine {
  // ── Fibonacci spiral: n points placed on golden angle increments ──
  fibonacciSpiral(
    n: number,
    scale = 1,
    centerX = 0,
    centerY = 0,
  ): FibonacciPoint[] {
    return Array.from({ length: n }, (_, i) => {
      const r = Math.sqrt(i + 1) * scale * 0.12;
      const theta = i * GOLDEN_ANGLE_RAD;
      return {
        x: centerX + r * Math.cos(theta),
        y: centerY + r * Math.sin(theta),
        radius: r,
        angle: theta,
        index: i,
      };
    });
  }

  // ── Golden rectangle subdivision — splits rect at PHI ratio ──
  goldenRectangle(width: number, height: number): GoldenRectangleLayout {
    // Primary: larger portion
    const primaryW = width / PHI;
    const secondaryW = width - primaryW;
    return {
      primary: { x: 0, y: 0, width: primaryW, height },
      secondary: { x: primaryW, y: 0, width: secondaryW, height },
      tertiary: {
        x: primaryW,
        y: height / PHI,
        width: secondaryW,
        height: height - height / PHI,
      },
      phi_point: {
        x: primaryW,
        y: height / PHI,
      },
    };
  }

  // ── PHI color palette using golden angle hue steps ──
  goldenColorPalette(baseHue: number, count: number): string[] {
    return Array.from({ length: count }, (_, i) => {
      const hue = (baseHue + i * GOLDEN_ANGLE_DEG) % 360;
      const sat = 60 + (i % 3) * 10;
      const lig = 40 + (i % 5) * 5;
      return `hsl(${hue.toFixed(1)}, ${sat}%, ${lig}%)`;
    });
  }

  // ── World depth layers at PHI ratio distances ──
  phiDepthLayers(totalDepth: number): number[] {
    const d = totalDepth / (1 + PHI + PHI * PHI);
    return [d, d * PHI, d * PHI * PHI];
  }

  // ── PHI-proportioned rect from height ──
  phiProportionedRect(height: number): PHIProportionedRect {
    return { width: height * PHI, height };
  }

  // ── Schumann-synced pulse — sin wave at 7.83Hz ──
  schumannPulse(t: number): number {
    return Math.sin(2 * Math.PI * SCHUMANN_HZ * t);
  }

  // ── Fibonacci spacing for arrays of objects ──
  fibSpacing(count: number, baseUnit: number): number[] {
    return Array.from({ length: count }, (_, i) => {
      const fibVal = FIB_SEQUENCE[Math.min(i + 1, FIB_SEQUENCE.length - 1)];
      const norm =
        fibVal / FIB_SEQUENCE[Math.min(count, FIB_SEQUENCE.length - 1)];
      return baseUnit * norm;
    });
  }

  // ── Convert canvas coords to world position with PHI-depth ──
  canvasToWorldPosition(
    canvasX: number,
    canvasY: number,
    canvasW: number,
    canvasH: number,
    depthLayer: 0 | 1 | 2,
  ): Vec3 {
    const depths = this.phiDepthLayers(100);
    const nx = (canvasX / canvasW) * 2 - 1;
    const ny = -((canvasY / canvasH) * 2 - 1);
    return { x: nx * 50, y: ny * 30, z: depths[depthLayer] };
  }

  // ── PHI-based building footprint ──
  buildingFootprint(baseSize: number): {
    w: number;
    h: number;
    floors: number;
  } {
    return {
      w: baseSize,
      h: baseSize * PHI,
      floors: Math.round(PHI * 3),
    };
  }

  // ── PHI path curvature for roads/corridors ──
  phiCurveControlPoints(start: Vec2, end: Vec2): { cp1: Vec2; cp2: Vec2 } {
    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2;
    const offset = ((end.x - start.x) * (1 / PHI)) / 2;
    return {
      cp1: { x: mx - offset / PHI, y: my + offset },
      cp2: { x: mx + offset / PHI, y: my - offset },
    };
  }

  // ── Actor separation score — how PHI-compliant is the current spread ──
  phiComplianceScore(positions: Vec2[]): number {
    if (positions.length < 2) return 1;
    const dists: number[] = [];
    for (let i = 0; i < positions.length - 1; i++) {
      const dx = positions[i + 1].x - positions[i].x;
      const dy = positions[i + 1].y - positions[i].y;
      dists.push(Math.sqrt(dx * dx + dy * dy));
    }
    let score = 0;
    for (let i = 0; i < dists.length - 1; i++) {
      const ratio = dists[i + 1] / (dists[i] || 1);
      score += 1 - Math.min(Math.abs(ratio - PHI) / PHI, 1);
    }
    return score / Math.max(dists.length - 1, 1);
  }
}

export const phiGeometry = new PHIGeometryEngine();
