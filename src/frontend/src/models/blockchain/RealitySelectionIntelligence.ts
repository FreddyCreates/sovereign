/**
 * ════════════════════════════════════════════════════════════════
 * REALITY_SELECTION_INTELLIGENCE — Blockchain Intelligence
 * Layer: BLOCKCHAIN | crossWire: BRANCH_GENESIS_ENGINE
 * Governing Law: Law of Fundamental Branching
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * Lineage: Mayan | Queretaro | San Luis | The Medina Family
 * ════════════════════════════════════════════════════════════════
 * When two realities diverge, choosing which one continues.
 * The fork choice rule — sovereignty over which reality is real.
 * crossWire: BRANCH_GENESIS_ENGINE — the law of branching into new reality.
 * Sub-models: FORK_DETECTOR, HEAVIEST_CHAIN_SELECTOR, REALITY_PRUNER
 * ════════════════════════════════════════════════════════════════
 */

export interface ForkChoice {
  selectedChain: string;
  rejectedChains: string[];
  weight: number;
  reality: "selected" | "pruned";
  branchPoint: string;
}

// ─── SUB-MODEL: FORK_DETECTOR ────────────────────────────────────
const FORK_DETECTOR = {
  detect(chains: string[][]): string {
    // Find the divergence point — where chains differ
    if (chains.length < 2) return "NO_FORK";
    const minLen = Math.min(...chains.map((c) => c.length));
    for (let i = 0; i < minLen; i++) {
      const pivot = chains[0]?.[i];
      if (chains.some((c) => c[i] !== pivot)) {
        return `FORK::block_${i}`;
      }
    }
    return `FORK::block_${minLen}`;
  },
};

// ─── SUB-MODEL: HEAVIEST_CHAIN_SELECTOR ──────────────────────────
const HEAVIEST_CHAIN_SELECTOR = {
  /**
   * Nakamoto fork choice: longest / heaviest chain wins.
   * In PHI-weighted SOVEREIGN: most doctrine-aligned chain wins.
   */
  select(chains: string[][]): { winner: string[]; index: number } {
    let maxWeight = -1;
    let winnerIndex = 0;
    chains.forEach((chain, i) => {
      const weight = chain.reduce((acc, block) => acc + block.length, 0);
      if (weight > maxWeight) {
        maxWeight = weight;
        winnerIndex = i;
      }
    });
    return { winner: chains[winnerIndex] ?? [], index: winnerIndex };
  },
};

// ─── SUB-MODEL: REALITY_PRUNER ────────────────────────────────────
const REALITY_PRUNER = {
  prune(
    chains: string[][],
    winnerIndex: number,
    branchPoint: string,
  ): ForkChoice {
    const selected = chains[winnerIndex] ?? [];
    const rejected = chains
      .filter((_, i) => i !== winnerIndex)
      .map((c) => c.join("→"));
    return {
      selectedChain: selected.join("→"),
      rejectedChains: rejected,
      weight: selected.length,
      reality: "selected",
      branchPoint,
    };
  },
};

// ─── MASTER MODEL ────────────────────────────────────────────────
export class REALITY_SELECTION_INTELLIGENCE {
  static readonly LAYER = "BLOCKCHAIN";
  static readonly CROSS_WIRE = "BRANCH_GENESIS_ENGINE";
  static readonly SUB_MODELS = [
    "FORK_DETECTOR",
    "HEAVIEST_CHAIN_SELECTOR",
    "REALITY_PRUNER",
  ] as const;

  readonly name = "REALITY_SELECTION_INTELLIGENCE";
  readonly description =
    "When two realities diverge, choosing which one continues.";
  readonly specialty = "fork choice reality selection";
  readonly layer = "BLOCKCHAIN";
  readonly crossWire = "BRANCH_GENESIS_ENGINE";
  readonly subModels = [
    "FORK_DETECTOR",
    "HEAVIEST_CHAIN_SELECTOR",
    "REALITY_PRUNER",
  ];

  chooseReality(chains: string[][]): ForkChoice {
    const branchPoint = FORK_DETECTOR.detect(chains);
    const { index } = HEAVIEST_CHAIN_SELECTOR.select(chains);
    return REALITY_PRUNER.prune(chains, index, branchPoint);
  }

  execute(context: string): string {
    const chainA = context.split(" ");
    const chainB = [...chainA, "alt_branch"];
    const result = this.chooseReality([chainA, chainB]);
    return `${this.specialty} executed: selected=${result.reality} branch=${result.branchPoint}`;
  }
}
