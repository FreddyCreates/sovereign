/**
 * SOVEREIGN STYLE LAYER
 * Golden Flex & Fibonacci Grid System
 * 
 * Attribution: Alfredo Medina Hernandez — immutable
 * 
 * Style systems integration with Fibonacci grid and golden flex φ:1 ratio.
 * Supports: Tailwind, CSS Modules, Styled Components, Emotion, Sass, PostCSS, 
 *           Grid, Flexbox, CSS Vars, Vanilla Extract
 * 
 * Mathematical Model:
 *   grid_columns = fibonacci[n]
 *   flex_ratio = φ : 1 (1.618 : 1)
 *   spacing_scale = fibonacci_sequence × base_unit
 *   style_score = harmony × proportion × doctrine_alignment
 */

// ═══════════════════════════════════════════════════════════════════════
// I. CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_INV = 1.0 / PHI;
export const S0_FLOOR = 0.75;
export const S_CEIL = 9.75;

export const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
export const GOLDEN_RATIO_PARTS = { major: PHI, minor: 1 };

// Base spacing unit (4px in most systems)
export const BASE_UNIT = 4;

export const ATTRIBUTION = "Alfredo Medina Hernandez";

// ═══════════════════════════════════════════════════════════════════════
// II. TYPES
// ═══════════════════════════════════════════════════════════════════════

export type StyleSystem = 
  | 'tailwind'
  | 'css-modules'
  | 'styled-components'
  | 'emotion'
  | 'sass'
  | 'postcss'
  | 'grid'
  | 'flexbox'
  | 'css-vars'
  | 'vanilla-extract';

export interface FibonacciSpacing {
  index: number;
  value: number;
  name: string;
}

export interface GoldenFlexConfig {
  majorRatio: number;  // PHI
  minorRatio: number;  // 1
  direction: 'row' | 'column';
  gap: number;
}

export interface FibonacciGridConfig {
  columns: number;     // Fibonacci number
  rows: number;        // Fibonacci number
  gutter: number;      // Fibonacci spacing
  maxWidth: number;
}

export interface ColorHarmony {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  phiHue: number;      // Hue rotation based on PHI
}

export interface StyleToken {
  name: string;
  value: string | number;
  category: 'spacing' | 'sizing' | 'color' | 'typography' | 'layout';
  fibonacciIndex?: number;
  phiMultiplier?: number;
}

export interface StyleState {
  beatCount: number;
  system: StyleSystem;
  spacingScale: FibonacciSpacing[];
  gridConfig: FibonacciGridConfig;
  flexConfig: GoldenFlexConfig;
  tokens: StyleToken[];
  harmonyScore: number;
  doctrineAlignment: number;
}

export interface StyleResponse {
  spacingTokens: FibonacciSpacing[];
  gridCSS: string;
  flexCSS: string;
  harmonyScore: number;
  guidance: string;
}

// ═══════════════════════════════════════════════════════════════════════
// III. HELPERS
// ═══════════════════════════════════════════════════════════════════════

export function clampSovereign(value: number): number {
  return Math.max(S0_FLOOR, Math.min(S_CEIL, value));
}

export function phiResonance(value: number): number {
  return 0.5 + 0.5 * Math.sin(value * Math.PI * PHI);
}

export function getFibonacci(index: number): number {
  if (index < 0) return 0;
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

// ═══════════════════════════════════════════════════════════════════════
// IV. FIBONACCI SPACING SCALE
// ═══════════════════════════════════════════════════════════════════════

export function generateFibonacciSpacingScale(baseUnit: number = BASE_UNIT): FibonacciSpacing[] {
  const names = ['none', 'px', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  
  return FIBONACCI.slice(0, names.length).map((fib, index) => ({
    index,
    value: fib * baseUnit,
    name: names[index] || `fib-${index}`
  }));
}

export function getSpacingValue(name: string, scale: FibonacciSpacing[]): number {
  const spacing = scale.find(s => s.name === name);
  return spacing?.value ?? BASE_UNIT;
}

export function spacingToCSS(scale: FibonacciSpacing[]): string {
  return scale.map(s => `  --spacing-${s.name}: ${s.value}px;`).join('\n');
}

// ═══════════════════════════════════════════════════════════════════════
// V. GOLDEN FLEX SYSTEM
// ═══════════════════════════════════════════════════════════════════════

export function initGoldenFlexConfig(): GoldenFlexConfig {
  return {
    majorRatio: PHI,
    minorRatio: 1,
    direction: 'row',
    gap: getFibonacci(4) * BASE_UNIT // 3 × 4 = 12px
  };
}

export function goldenFlexCSS(config: GoldenFlexConfig): string {
  const total = config.majorRatio + config.minorRatio;
  const majorPercent = (config.majorRatio / total) * 100;
  const minorPercent = (config.minorRatio / total) * 100;

  return `
/* Golden Flex Container - φ:1 ratio */
.golden-flex {
  display: flex;
  flex-direction: ${config.direction};
  gap: ${config.gap}px;
}

.golden-flex-major {
  flex: ${config.majorRatio};
  /* ${majorPercent.toFixed(2)}% of space */
}

.golden-flex-minor {
  flex: ${config.minorRatio};
  /* ${minorPercent.toFixed(2)}% of space */
}

/* Nested golden ratio */
.golden-flex-nested {
  display: flex;
  gap: ${Math.round(config.gap * PHI_INV)}px;
}

/* PHI-based aspect ratio */
.golden-aspect {
  aspect-ratio: ${PHI.toFixed(4)} / 1;
}

.golden-aspect-inverse {
  aspect-ratio: 1 / ${PHI.toFixed(4)};
}
`.trim();
}

export function computeGoldenSplit(totalSize: number): { major: number; minor: number } {
  const major = totalSize / (1 + PHI_INV);
  const minor = totalSize - major;
  return { major, minor };
}

// ═══════════════════════════════════════════════════════════════════════
// VI. FIBONACCI GRID SYSTEM
// ═══════════════════════════════════════════════════════════════════════

export function initFibonacciGridConfig(): FibonacciGridConfig {
  return {
    columns: 13,  // Fibonacci
    rows: 8,      // Fibonacci
    gutter: getFibonacci(4) * BASE_UNIT, // 12px
    maxWidth: getFibonacci(11) * BASE_UNIT * 10 // 1440px (144 × 10)
  };
}

export function fibonacciGridCSS(config: FibonacciGridConfig): string {
  return `
/* Fibonacci Grid System - ${config.columns} columns */
.fib-grid {
  display: grid;
  grid-template-columns: repeat(${config.columns}, 1fr);
  gap: ${config.gutter}px;
  max-width: ${config.maxWidth}px;
  margin: 0 auto;
}

/* Fibonacci column spans */
${FIBONACCI.filter(f => f <= config.columns).map(f => `
.fib-col-${f} {
  grid-column: span ${f};
}`).join('\n')}

/* Fibonacci row spans */
${FIBONACCI.filter(f => f <= config.rows).map(f => `
.fib-row-${f} {
  grid-row: span ${f};
}`).join('\n')}

/* Golden ratio columns (φ:1 split) */
.fib-grid-golden {
  display: grid;
  grid-template-columns: ${PHI.toFixed(4)}fr 1fr;
  gap: ${config.gutter}px;
}

/* Responsive Fibonacci breakpoints */
@media (max-width: ${getFibonacci(10) * 10}px) { /* 550px */
  .fib-grid {
    grid-template-columns: repeat(${getFibonacci(4)}, 1fr); /* 3 columns */
  }
}

@media (max-width: ${getFibonacci(9) * 10}px) { /* 340px */
  .fib-grid {
    grid-template-columns: 1fr; /* 1 column */
  }
}
`.trim();
}

// ═══════════════════════════════════════════════════════════════════════
// VII. COLOR HARMONY
// ═══════════════════════════════════════════════════════════════════════

export function generateGoldenColorHarmony(baseHue: number): ColorHarmony {
  // Golden angle color rotation
  const goldenAngle = 137.5;
  
  return {
    primary: `hsl(${baseHue}, 70%, 50%)`,
    secondary: `hsl(${(baseHue + goldenAngle) % 360}, 60%, 45%)`,
    tertiary: `hsl(${(baseHue + goldenAngle * 2) % 360}, 50%, 40%)`,
    accent: `hsl(${(baseHue + goldenAngle * PHI) % 360}, 80%, 55%)`,
    phiHue: (baseHue + goldenAngle * PHI) % 360
  };
}

export function colorHarmonyToCSS(harmony: ColorHarmony): string {
  return `
/* Golden Color Harmony */
:root {
  --color-primary: ${harmony.primary};
  --color-secondary: ${harmony.secondary};
  --color-tertiary: ${harmony.tertiary};
  --color-accent: ${harmony.accent};
  --phi-hue: ${harmony.phiHue.toFixed(2)};
}
`.trim();
}

// ═══════════════════════════════════════════════════════════════════════
// VIII. SYSTEM-SPECIFIC CONFIGS
// ═══════════════════════════════════════════════════════════════════════

export function getSystemConfig(system: StyleSystem): Record<string, unknown> {
  const spacingScale = generateFibonacciSpacingScale();
  
  const configs: Record<StyleSystem, Record<string, unknown>> = {
    tailwind: {
      theme: {
        extend: {
          spacing: Object.fromEntries(
            spacingScale.map(s => [s.name, `${s.value}px`])
          ),
          aspectRatio: {
            'golden': `${PHI}`,
            'golden-inv': `${PHI_INV}`
          }
        }
      }
    },
    'css-modules': {
      modules: true,
      localIdentName: '[name]__[local]___phi[hash:base64:5]'
    },
    'styled-components': {
      spacing: spacingScale,
      phi: PHI,
      fibonacci: FIBONACCI
    },
    emotion: {
      spacing: spacingScale,
      phi: PHI
    },
    sass: {
      variables: `
$phi: ${PHI};
$phi-inv: ${PHI_INV};
${spacingScale.map(s => `$spacing-${s.name}: ${s.value}px;`).join('\n')}
      `.trim()
    },
    postcss: {
      plugins: ['autoprefixer', 'postcss-custom-properties']
    },
    grid: initFibonacciGridConfig(),
    flexbox: initGoldenFlexConfig(),
    'css-vars': {
      root: `
:root {
  --phi: ${PHI};
  --phi-inv: ${PHI_INV};
${spacingScale.map(s => `  --spacing-${s.name}: ${s.value}px;`).join('\n')}
}
      `.trim()
    },
    'vanilla-extract': {
      spacing: spacingScale,
      createGlobalTheme: true
    }
  };

  return configs[system] || {};
}

// ═══════════════════════════════════════════════════════════════════════
// IX. INITIALIZATION & EXECUTION
// ═══════════════════════════════════════════════════════════════════════

export function initStyleState(system: StyleSystem): StyleState {
  return {
    beatCount: 0,
    system,
    spacingScale: generateFibonacciSpacingScale(),
    gridConfig: initFibonacciGridConfig(),
    flexConfig: initGoldenFlexConfig(),
    tokens: [],
    harmonyScore: 0.8,
    doctrineAlignment: 0.8
  };
}

export function executeStyle(state: StyleState): { response: StyleResponse; state: StyleState } {
  const newBeat = state.beatCount + 1;

  // Generate outputs
  const gridCSS = fibonacciGridCSS(state.gridConfig);
  const flexCSS = goldenFlexCSS(state.flexConfig);

  // Compute harmony score
  const proportionScore = state.gridConfig.columns / (state.gridConfig.columns + state.gridConfig.rows);
  const goldenDeviation = Math.abs(proportionScore - PHI_INV);
  const baseHarmony = 1 - goldenDeviation;
  const phiRes = phiResonance(baseHarmony);
  const harmonyScore = baseHarmony * state.doctrineAlignment * (0.8 + 0.2 * phiRes);

  // Generate guidance
  const guidance = harmonyScore > 0.8 
    ? 'Golden harmony achieved — Fibonacci grid and PHI flex align perfectly'
    : harmonyScore > 0.6
    ? 'Good proportions — consider adjusting grid columns to Fibonacci number'
    : 'Harmony needs work — ensure ratios follow golden proportion';

  const newState: StyleState = {
    ...state,
    beatCount: newBeat,
    harmonyScore
  };

  const response: StyleResponse = {
    spacingTokens: state.spacingScale,
    gridCSS,
    flexCSS,
    harmonyScore,
    guidance
  };

  return { response, state: newState };
}

// ═══════════════════════════════════════════════════════════════════════
// X. SUMMARY
// ═══════════════════════════════════════════════════════════════════════

export function getStyleSummary(state: StyleState): Record<string, unknown> {
  return {
    beatCount: state.beatCount,
    system: state.system,
    gridColumns: state.gridConfig.columns,
    gridRows: state.gridConfig.rows,
    spacingLevels: state.spacingScale.length,
    flexRatio: `${state.flexConfig.majorRatio.toFixed(3)} : ${state.flexConfig.minorRatio}`,
    harmonyScore: state.harmonyScore,
    doctrineAlignment: state.doctrineAlignment,
    phi: PHI,
    attribution: ATTRIBUTION
  };
}
