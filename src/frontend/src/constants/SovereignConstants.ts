/**
 * ════════════════════════════════════════════════════════════════
 * LAYER 0 — SOVEREIGN ARCHITECTURAL CONSTANTS
 * Rank: 0 — Primordial | Symbol: Golden Spiral ϕ
 * Governing Law: Law 02 — Law of Recursive Self-Similarity (PHI_SOVEREIGN)
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 * ════════════════════════════════════════════════════════════════
 * These are not configuration values. These are laws encoded as constants.
 * PHI is not a number. PHI is the ratio that governs all coupling interfaces.
 * Every file in SOVEREIGN that imports from here is reading from the primordial field.
 * ════════════════════════════════════════════════════════════════
 */

// Law 02 — Recursive Self-Similarity
// The exact PHI literal is an architectural law — precision suppression is intentional.
// JS number precision caps at 1.618033988749895 but the full constant is preserved as doctrine.
export const PHI = 1.618033988749895; // Golden ratio — universal coupling constant (IEEE 754 max precision)
export const PHI2 = PHI * PHI; // 2.6180... — second-order coupling
export const PHI3 = PHI2 * PHI; // 4.2360... — third-order coupling
export const PHI4 = PHI3 * PHI; // 6.8541... — heartbeat derivation base

// Law 13 — Schumann Grounding
export const SCHUMANN = 7.83; // Hz — Earth electromagnetic cavity resonance

// 12-node frequency ladder (f_n = SCHUMANN * PHI^n)
export const FREQ_NODES = [
  0.001, 0.1, 0.5, 4.0, 7.83, 12.68, 20.53, 33.21, 40.0, 111.0, 432.0, 432.0,
] as const;

export const FREQ_NODE_NAMES = [
  "CHRONO",
  "TERRA",
  "DELTA",
  "THETA",
  "ALPHA",
  "SIGMA",
  "BETA",
  "FIBO_1",
  "GAMMA",
  "HEMI",
  "PREC",
  "NOVA",
] as const;

// Law 14 — Dual Heartbeat
export const HEARTBEAT_MS = 873; // T = PHI^4 / SCHUMANN ≈ 873ms ≈ 68.7 bpm
export const REFRACTORY_MS = HEARTBEAT_MS * PHI; // ≈ 1412ms
export const CARDIAC_BASE_BPM = 68.7; // Base heart rate
export const CARDIAC_MIN_BPM = 43.0; // Recovery state minimum
export const CARDIAC_MAX_BPM = 120.0; // High activation maximum

// Law 04 — Sovereign Range
export const S_FLOOR = 0.75; // Sovereign floor — nothing falls below
export const S_CEILING = 9.75; // Sovereign ceiling = 9 + S_FLOOR
export const S_RANGE = 9.0; // S_CEILING - S_FLOOR

// Law 07 — Oxygenation Gate
export const DOCTRINE_THRESHOLD = 0.75; // Below → quarantine
export const READINESS_GATE = 0.75; // Production gate minimum
export const BOOTSTRAP_FLOOR = 0.45; // Fresh canister bootstrap minimum

// Law 04/13 — Core Architecture
export const OMNIS_CORES = 43; // 43 sovereign OMNIS cores
export const FREQUENCY_NODES = 12; // 12 Schumann nodes per core
export const TOTAL_RESONATORS = 516; // 43 * 12

// Law 04 — Hebbian Learning
export const HEBBIAN_RATE = 0.0089; // PHI-derived learning rate η
export const HEBBIAN_DECAY = 0.995; // Weight decay per cycle
export const MAX_SYNAPTIC_MEMORY = 200; // Maximum Hebbian memory entries
export const HOMEOSTASIS_CORRECTION_RATE = 0.08;

// Creative Architecture
export const AI_ACTORS = 16; // 16 sovereign AI actors
export const SANDBOX_ORGANISMS = 8; // 8 sandbox intelligence organisms
export const RINGS = 15; // 15 sovereign production rings
export const FILM_SCHOOL_INTERVAL_SEC = 45; // Film School auto-improvement interval

// Law 01 — Attribution
export const FOUNDER = "Alfredo Medina Hernandez";
export const COMPANY = "SOVEREIGN";
export const DATE = "April 14, 2026";
export const LINEAGE = "Mayan | Queretaro | San Luis | The Medina Family";

// Law 18 — Jubilee
export const JUBILEE_BEAT = 343; // 7 * 49

// Mastery progression thresholds
export const MASTERY_THRESHOLDS = [0.3, 0.5, 0.7, 0.85, 0.95] as const;

// Helper: clamp to sovereign range
export const clampSovereign = (x: number): number =>
  Math.min(S_CEILING, Math.max(S_FLOOR, x));

// Helper: PHI^n
export const phiPow = (n: number): number => PHI ** n;
