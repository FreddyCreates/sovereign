/**
 * ════════════════════════════════════════════════════════════════
 * SOVEREIGN_MODEL — Abstract Base for All Five Alpha Macro Models
 * Rank: varies per model | Law 15 — Macro-Micro Compression governs all
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 14, 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * Law 15 enforced: every macro model contains all its sub-models.
 * The derivation path is inside the model.
 * Anyone reading this class finds the same intelligence at any resolution.
 * ════════════════════════════════════════════════════════════════
 */

import {
  COMPANY,
  DATE,
  FOUNDER,
  LINEAGE,
  PHI,
  S_FLOOR,
  clampSovereign,
} from "../constants/SovereignConstants";

export abstract class SovereignModel {
  // Law 01 — Medina Prime: every model carries the attribution
  readonly attribution = {
    founder: FOUNDER,
    company: COMPANY,
    date: DATE,
    lineage: LINEAGE,
  };

  // PHI coupling ratio at this model's layer depth
  readonly phiCoupling: number;

  // Compound coherence (Law 23) — never resets
  protected compoundCoherence: number = S_FLOOR;

  // Current doctrine alignment
  protected doctrineScore: number = S_FLOOR;

  constructor(layerDepth: number) {
    this.phiCoupling = PHI ** layerDepth;
  }

  // Law 23 — compound coherence (never resets, always grows)
  compound(doctrineScore: number): void {
    const growth = 1 + doctrineScore * 0.001;
    this.compoundCoherence = clampSovereign(this.compoundCoherence * growth);
    this.doctrineScore = clampSovereign(doctrineScore);
  }

  getCompoundCoherence(): number {
    return this.compoundCoherence;
  }

  getDoctrineScore(): number {
    return this.doctrineScore;
  }

  // Each macro model must declare: what laws it enforces, its name, its symbol
  abstract governingLaws(): number[];
  abstract name(): string;
  abstract symbol(): string;
}
