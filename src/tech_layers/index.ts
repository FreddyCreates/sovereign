/**
 * SOVEREIGN TECH LAYERS
 * Unified Technology Stack with PHI-Weaving
 * 
 * Attribution: Alfredo Medina Hernandez — immutable
 * 
 * Six integrated layers providing sovereign-aligned infrastructure:
 * 
 * 1. BUILD - Fibonacci weave modules, golden-ratio hot boundaries
 *    Supports: Webpack, Vite, esbuild, Rollup, Turbopack, SWC, Babel, Parcel, Biome, Nx
 * 
 * 2. STYLE - Fibonacci grid, golden flex φ:1 ratio
 *    Supports: Tailwind, CSS Modules, Styled Components, Emotion, Sass, PostCSS, Grid, Flexbox, CSS Vars, Vanilla Extract
 * 
 * 3. LANGUAGE - Golden type φ^complexity, sovereign script
 *    Supports: TypeScript, JavaScript, WebAssembly, Rust WASM, Go WASM, Java GraalVM, Kotlin/JS, Dart, Elm, ReScript
 * 
 * 4. DATA - Golden graph φ-depth, Fibonacci revalidation
 *    Supports: GraphQL, REST, tRPC, React Query, SWR, Apollo, Axios, Prisma, IndexedDB, WebSocket
 * 
 * 5. NETWORK - Golden multiplex, quantum protocol φ-proof
 *    Supports: HTTP/2, HTTP/3, WebRTC, gRPC-Web, SSE, Service Worker, WebTransport, MessageChannel, BroadcastChannel, SharedWorker
 * 
 * 6. SECURITY - OAuth, JWT, WebAuthn, Web Crypto, CSP, CORS, TLS, SRI, Passkeys, WASM Sandbox
 * 
 * Mathematical Constants:
 *   PHI = 1.6180339887498948482 (Golden Ratio)
 *   PHI_INV = 0.6180339887498949 (Golden Ratio Inverse)
 *   S0_FLOOR = 0.75 (Sovereign Lower Bound)
 *   S_CEIL = 9.75 (Sovereign Upper Bound)
 *   FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...]
 */

// ═══════════════════════════════════════════════════════════════════════
// CORE EXPORTS
// ═══════════════════════════════════════════════════════════════════════

export * from './build';
export * from './style';
export * from './language';
export * from './data';
export * from './network';
export * from './security';

// ═══════════════════════════════════════════════════════════════════════
// SHARED CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_INV = 1.0 / PHI;
export const S0_FLOOR = 0.75;
export const S_CEIL = 9.75;

export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

export const ATTRIBUTION = "Alfredo Medina Hernandez";

// ═══════════════════════════════════════════════════════════════════════
// UNIFIED STATE TYPES
// ═══════════════════════════════════════════════════════════════════════

export interface TechLayersSummary {
  build: {
    tool: string;
    modules: number;
    chunks: number;
    score: number;
  };
  style: {
    system: string;
    gridColumns: number;
    harmonyScore: number;
  };
  language: {
    languages: string[];
    moduleCount: number;
    score: number;
  };
  data: {
    systems: string[];
    queries: number;
    score: number;
  };
  network: {
    protocols: string[];
    connections: number;
    score: number;
  };
  security: {
    mechanisms: string[];
    threatLevel: string;
    score: number;
  };
  overallScore: number;
  doctrineAlignment: number;
  phi: number;
  attribution: string;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

export function clampSovereign(value: number): number {
  return Math.max(S0_FLOOR, Math.min(S_CEIL, value));
}

export function normalizeSovereign(value: number): number {
  const clamped = clampSovereign(value);
  return (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR);
}

export function phiResonance(value: number): number {
  return 0.5 + 0.5 * Math.sin(value * Math.PI * PHI);
}

export function getFibonacci(index: number): number {
  if (index < 0) return 1;
  if (index < FIBONACCI.length) return FIBONACCI[index];
  
  let a = FIBONACCI[FIBONACCI.length - 2];
  let b = FIBONACCI[FIBONACCI.length - 1];
  for (let i = FIBONACCI.length; i <= index; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

export function nearestFibonacci(value: number): { index: number; value: number } {
  let closest = { index: 0, value: FIBONACCI[0] };
  let minDiff = Math.abs(value - FIBONACCI[0]);

  for (let i = 1; i < FIBONACCI.length; i++) {
    const diff = Math.abs(value - FIBONACCI[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closest = { index: i, value: FIBONACCI[i] };
    }
  }
  return closest;
}

export function goldenSplit(total: number): { major: number; minor: number } {
  const major = total / (1 + PHI_INV);
  const minor = total - major;
  return { major, minor };
}

// ═══════════════════════════════════════════════════════════════════════
// AGGREGATE COMPUTATION
// ═══════════════════════════════════════════════════════════════════════

export function computeOverallScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  
  // Geometric mean of all scores × PHI resonance
  const product = scores.reduce((acc, score) => acc * Math.max(0.001, score), 1);
  const geometricMean = Math.pow(product, 1 / scores.length);
  const phiRes = phiResonance(geometricMean);
  
  return geometricMean * (0.9 + 0.1 * phiRes);
}
