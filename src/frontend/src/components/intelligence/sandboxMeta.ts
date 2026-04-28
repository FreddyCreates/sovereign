/**
 * Sandbox organism metadata — color system, labels, domain descriptions
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { SandboxOrganismId } from "../../backend";

export interface OrganismMeta {
  id: SandboxOrganismId;
  label: string;
  domain: string;
  description: string;
  color: string;
  borderColor: string;
  glowColor: string;
  archType: "expansive" | "receptive" | "antiDrift" | "sovereign";
  icon: string;
}

// Domain-specific OKLCH colors per the design spec
export const ORGANISM_META: Record<SandboxOrganismId, OrganismMeta> = {
  [SandboxOrganismId.axiom]: {
    id: SandboxOrganismId.axiom,
    label: "AXIOM",
    domain: "Scientific Intelligence",
    description:
      "Pulls from arXiv, research papers, and scientific hypotheses. Finds the deep pattern beneath all provable things.",
    color: "oklch(0.70 0.20 195)",
    borderColor: "oklch(0.70 0.20 195 / 0.4)",
    glowColor: "oklch(0.70 0.20 195 / 0.2)",
    archType: "receptive",
    icon: "⚛",
  },
  [SandboxOrganismId.codex]: {
    id: SandboxOrganismId.codex,
    label: "CODEX",
    domain: "Knowledge Synthesis",
    description:
      "Synthesizes knowledge across open graphs, historical archives, and doctrine evolution feeds.",
    color: "oklch(0.65 0.18 280)",
    borderColor: "oklch(0.65 0.18 280 / 0.4)",
    glowColor: "oklch(0.65 0.18 280 / 0.2)",
    archType: "receptive",
    icon: "◈",
  },
  [SandboxOrganismId.vector]: {
    id: SandboxOrganismId.vector,
    label: "VECTOR",
    domain: "Market Intelligence",
    description:
      "Tracks financial signals, market patterns, and sovereign economic indicators in real time.",
    color: "oklch(0.72 0.17 80)",
    borderColor: "oklch(0.72 0.17 80 / 0.4)",
    glowColor: "oklch(0.72 0.17 80 / 0.2)",
    archType: "expansive",
    icon: "◉",
  },
  [SandboxOrganismId.frame]: {
    id: SandboxOrganismId.frame,
    label: "FRAME",
    domain: "Geospatial & Climate",
    description:
      "Monitors geospatial data, climate patterns, and territorial signals. Maps civilization's physical layer.",
    color: "oklch(0.65 0.15 105)",
    borderColor: "oklch(0.65 0.15 105 / 0.4)",
    glowColor: "oklch(0.65 0.15 105 / 0.2)",
    archType: "expansive",
    icon: "⬡",
  },
  [SandboxOrganismId.lex]: {
    id: SandboxOrganismId.lex,
    label: "LEX",
    domain: "Legal & Regulatory",
    description:
      "Monitors legal changes, regulatory signals, and IP boundaries. Enforces the doctrine boundary at the law layer.",
    color: "oklch(0.60 0.18 15)",
    borderColor: "oklch(0.60 0.18 15 / 0.4)",
    glowColor: "oklch(0.60 0.18 15 / 0.2)",
    archType: "antiDrift",
    icon: "⚖",
  },
  [SandboxOrganismId.grid]: {
    id: SandboxOrganismId.grid,
    label: "GRID",
    domain: "Infrastructure & Tech",
    description:
      "Watches infrastructure evolution, open-source signals, and distributed systems patterns.",
    color: "oklch(0.62 0.17 240)",
    borderColor: "oklch(0.62 0.17 240 / 0.4)",
    glowColor: "oklch(0.62 0.17 240 / 0.2)",
    archType: "receptive",
    icon: "▦",
  },
  [SandboxOrganismId.ledger]: {
    id: SandboxOrganismId.ledger,
    label: "LEDGER",
    domain: "Financial Accounting",
    description:
      "Runs full internal financial accounting for SOVEREIGN. PHI-ratio pricing, revenue modeling, and value tracking.",
    color: "oklch(0.75 0.16 70)",
    borderColor: "oklch(0.75 0.16 70 / 0.4)",
    glowColor: "oklch(0.75 0.16 70 / 0.25)",
    archType: "receptive",
    icon: "◎",
  },
  [SandboxOrganismId.sovereignGov]: {
    id: SandboxOrganismId.sovereignGov,
    label: "SOVEREIGN GOV",
    domain: "Sovereign Governance",
    description:
      "Governs all other organisms. Spawns entities, enforces the Law of Medina, and guards the ANTI-DRIFT coupling.",
    color: "oklch(0.92 0.01 280)",
    borderColor: "oklch(0.92 0.01 280 / 0.4)",
    glowColor: "oklch(0.92 0.01 280 / 0.15)",
    archType: "sovereign",
    icon: "◎",
  },
};

export const SANDBOX_ORGANISM_ORDER: SandboxOrganismId[] = [
  SandboxOrganismId.axiom,
  SandboxOrganismId.codex,
  SandboxOrganismId.vector,
  SandboxOrganismId.frame,
  SandboxOrganismId.lex,
  SandboxOrganismId.grid,
  SandboxOrganismId.ledger,
  SandboxOrganismId.sovereignGov,
];
