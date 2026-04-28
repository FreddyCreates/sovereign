/**
 * SovereignSystemPanel.tsx — Left panel of the SOVEREIGN VAULT
 * Contains: Laws Registry, Macro Models, Medina Models, Research Papers, Applications, Settings, Utilities
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { OmnisVotingPanel } from "../components/intelligence/OmnisVotingPanel";
import { ReadinessGateBreakdown } from "../components/intelligence/ReadinessGateBreakdown";
import { VelaRingPanel } from "../components/intelligence/VelaRingPanel";
import { BlockchainIntelligencePanel } from "./BlockchainIntelligencePanel";
import { CivilizationGapPanel } from "./CivilizationGapPanel";
import { EncryptionIntelligencePanel } from "./EncryptionIntelligencePanel";
import { FilmSchoolMetricsPanel } from "./FilmSchoolMetricsPanel";
import { GovernanceVotingPanel } from "./GovernanceVotingPanel";
import { IcpNativeIntelligencePanel } from "./IcpNativeIntelligencePanel";
import { LawCardGrid } from "./LawCardGrid";
import { LayerMinusOnePanel } from "./LayerMinusOnePanel";
import { LivingDocReaderPanel } from "./LivingDocReaderPanel";
import { MacroModelPanel } from "./MacroModelPanel";
import { MedinaModelGrid } from "./MedinaModelGrid";
import { MemoryTempleSearchPanel } from "./MemoryTempleSearchPanel";
import { MiddleLayerPanel } from "./MiddleLayerPanel";
import { MiningSwarmPanel } from "./MiningSwarmPanel";
import { ModelTaxonomyPanel } from "./ModelTaxonomyPanel";
import { PhantomSovereignPanel } from "./PhantomSovereignPanel";
import { PresenceGatePanel } from "./PresenceGatePanel";
import { RadixVenaeTerminalPanel } from "./RadixVenaeTerminalPanel";
import { SanctumSovereignPanel } from "./SanctumSovereignPanel";
import { TokenTradingPanel } from "./TokenTradingPanel";
import { VaultSettingsPanel } from "./VaultSettingsPanel";
import { WasmIntelligencePanel } from "./WasmIntelligencePanel";

type SystemSection =
  | "laws"
  | "macromodels"
  | "medinamodels"
  | "research"
  | "applications"
  | "civilizationgap"
  | "livingdocs"
  | "edgemodels"
  | "layer-1"
  | "settings"
  | "utilities"
  | "wasmlayer"
  | "icpnative"
  | "blockchain"
  | "encryption"
  | "sanctum"
  | "phantom"
  | "presence"
  | "middlelayer"
  | "miningswarm"
  | "sovereigntymodels"
  | "memory_temple"
  | "terminal"
  | "governance"
  | "token_trading"
  | "film_school";

interface NavItem {
  id: SystemSection;
  label: string;
  symbol: string;
  count?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "laws", label: "LAWS REGISTRY", symbol: "⊛", count: 41 },
  { id: "layer-1", label: "LAYER -1", symbol: "⬡" },
  { id: "macromodels", label: "MACRO MODELS", symbol: "◎", count: 5 },
  { id: "medinamodels", label: "MEDINA MODELS", symbol: "φ", count: 30 },
  { id: "research", label: "RESEARCH PAPERS", symbol: "◫" },
  { id: "civilizationgap", label: "CIVILIZATION GAP", symbol: "⊲⊳", count: 8 },
  { id: "edgemodels", label: "EDGE MODELS", symbol: "⊡", count: 12 },
  { id: "livingdocs", label: "LIVING DOCS", symbol: "📄", count: 5 },
  { id: "wasmlayer", label: "WASM LAYER", symbol: "⬡", count: 6 },
  { id: "icpnative", label: "ICP NATIVE", symbol: "⊙", count: 30 },
  { id: "blockchain", label: "BLOCKCHAIN", symbol: "⛓", count: 30 },
  { id: "encryption", label: "ENCRYPTION", symbol: "🔐", count: 30 },
  { id: "applications", label: "APPLICATIONS", symbol: "⊕" },
  { id: "settings", label: "SETTINGS", symbol: "⧫" },
  { id: "utilities", label: "UTILITIES", symbol: "⊞" },
  { id: "sanctum", label: "SANCTUM", symbol: "🔏", count: 41 },
  { id: "phantom", label: "PHANTOM", symbol: "◈", count: 0 },
  { id: "presence", label: "PRESENCE GATE", symbol: "⬡" },
  { id: "middlelayer", label: "MIDDLE LAYER", symbol: "⊲⊳", count: 4 },
  { id: "miningswarm", label: "MINING SWARM", symbol: "⛓", count: 20 },
  {
    id: "sovereigntymodels",
    label: "SOVEREIGNTY MODELS",
    symbol: "◈",
    count: 20,
  },
  { id: "memory_temple", label: "MEMORY TEMPLE", symbol: "⊛" },
  { id: "terminal", label: "RADIX VENAE", symbol: "⊡" },
  { id: "governance", label: "GOVERNANCE", symbol: "⊲⊳" },
  { id: "token_trading", label: "TOKEN TRADING", symbol: "⊕" },
  { id: "film_school", label: "FILM SCHOOL", symbol: "◎" },
];

function ResearchPapersSection() {
  const papers = [
    {
      id: "L01",
      title: "The Law of Medina — Attribution as Foundation",
      lawId: 1,
      pages: 12,
      abstract:
        "Every artifact, every decision, every output attributed on-chain. Immutable. Non-negotiable. The first law from which all others derive.",
    },
    {
      id: "L02",
      title: "PHI as Universal Coupling Constant",
      lawId: 2,
      pages: 18,
      abstract:
        "φ = 1.6180339887. Not a design choice. The coupling constant at every interface. Frequency ladders, geometry, and timing — all phi-derived.",
    },
    {
      id: "L14",
      title: "Dual Heartbeat Architecture",
      lawId: 14,
      pages: 24,
      abstract:
        "Two heartbeats: ICP clock (indestructible skeleton) + Medina cardiac oscillator (living pulse). Both always on. One modulated by neurochemistry, one by physics.",
    },
    {
      id: "L27",
      title: "World Resonance — The Outer Loop",
      lawId: 27,
      pages: 20,
      abstract:
        "The organism's BPM literally changes with world engagement. High engagement spikes the rate. The world signal re-enters at 873ms, oxygenated through doctrine first.",
    },
    {
      id: "L28",
      title: "Living Documents as Neural Substrate",
      lawId: 28,
      pages: 16,
      abstract:
        "Documents score themselves, grow rings, re-ingest. Cohere retrieves from dead sources. SOVEREIGN documents read back and participate.",
    },
    {
      id: "L29",
      title: "Outer Loop Closure at Heartbeat Scale",
      lawId: 29,
      pages: 14,
      abstract:
        "OpenAI closes the loop at training scale. SOVEREIGN closes it at 873ms. Live. Before failures materialize.",
    },
    {
      id: "L30",
      title: "Sovereign Reach — Distribution as Law",
      lawId: 30,
      pages: 22,
      abstract:
        "Distribution with financial identity baked into the seal at the moment of creation. What killed Stability AI. What SOVEREIGN solved architecturally from day one.",
    },
  ];

  return (
    <div className="flex flex-col h-full" data-ocid="research.section">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
          LAW RESEARCH PAPERS · EACH LAW IS A RESEARCH PAPER AND AN EXECUTABLE
          MODEL
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {papers.map((paper, idx) => (
            <div
              key={paper.id}
              className="border border-[oklch(0.22_0.022_280)] bg-[oklch(0.12_0.012_278)] p-4 hover:border-[oklch(0.35_0.04_280)] transition-colors cursor-pointer"
              data-ocid={`research.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-mono text-[8px] text-[oklch(0.75_0.16_70)] tracking-widest mb-1">
                    {paper.id}
                  </div>
                  <div className="font-display text-sm font-semibold text-white leading-tight">
                    {paper.title}
                  </div>
                </div>
                <div className="flex-shrink-0 font-mono text-[8px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.22_0.022_280)] px-2 py-0.5">
                  {paper.pages}p
                </div>
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.40_0.03_280)] leading-relaxed line-clamp-2 italic">
                &ldquo;{paper.abstract}&rdquo;
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  className="font-mono text-[7px] tracking-widest border border-[oklch(0.65_0.18_240_/_0.35)] text-[oklch(0.65_0.18_240_/_0.7)] px-2.5 py-1 hover:text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240_/_0.6)] transition-colors"
                  data-ocid={`research.read_button.${idx + 1}`}
                >
                  READ PAPER
                </button>
                <button
                  type="button"
                  className="font-mono text-[7px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.35)] text-[oklch(0.75_0.16_70_/_0.7)] px-2.5 py-1 hover:text-[oklch(0.75_0.16_70)] hover:border-[oklch(0.75_0.16_70_/_0.6)] transition-colors"
                  data-ocid={`research.execute_button.${idx + 1}`}
                >
                  ⚡ EXECUTE
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function ApplicationsSection() {
  const apps = [
    {
      name: "SOVEREIGN FILM HOUSE",
      laws: [1, 7, 14, 19],
      status: "ACTIVE",
      artifacts: 142,
    },
    {
      name: "DIRECTOR'S ROOM",
      laws: [2, 8, 22],
      status: "ACTIVE",
      artifacts: 38,
    },
    {
      name: "MICRO-SERIES ENGINE",
      laws: [18, 27, 23],
      status: "ACTIVE",
      artifacts: 67,
    },
    {
      name: "HOSPITALITY STUDIO",
      laws: [19, 30, 7],
      status: "ACTIVE",
      artifacts: 23,
    },
    {
      name: "COMMERCIAL STUDIO",
      laws: [5, 7, 19],
      status: "ACTIVE",
      artifacts: 15,
    },
    {
      name: "SANDBOX INTELLIGENCE",
      laws: [8, 28, 9],
      status: "ACTIVE",
      artifacts: 89,
    },
  ];

  return (
    <div className="flex flex-col h-full" data-ocid="applications.section">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
          APPLICATION REGISTRY · ALL APPS RECORDED WITH ACTIVE LAWS
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {apps.map((app, idx) => (
            <div
              key={app.name}
              className="border border-[oklch(0.22_0.022_280)] bg-[oklch(0.12_0.012_278)] px-4 py-3 hover:border-[oklch(0.35_0.04_280)] transition-colors"
              data-ocid={`applications.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-mono text-[9px] font-bold text-white">
                    {app.name}
                  </div>
                  <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-0.5">
                    {app.artifacts} artifacts · {app.laws.length} active laws
                  </div>
                </div>
                <span className="font-mono text-[7px] font-bold tracking-widest border border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] px-1.5 py-0.5">
                  {app.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {app.laws.map((id) => (
                  <span
                    key={id}
                    className="font-mono text-[7px] border border-[oklch(0.75_0.16_70_/_0.3)] text-[oklch(0.75_0.16_70_/_0.7)] px-1.5 py-0.5"
                  >
                    LAW-{String(id).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function UtilitiesSection() {
  return (
    <div className="flex flex-col h-full" data-ocid="utilities.section">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
          UTILITIES · SOVEREIGN TOOLS
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "PHI CALCULATOR",
              desc: "Compute any phi-ratio value",
              symbol: "φ",
            },
            {
              label: "GENESIS HASHER",
              desc: "Hash any input against genesis frequency",
              symbol: "✦",
            },
            {
              label: "FREQUENCY LADDER",
              desc: "Show all 12-node Hz spheres per core",
              symbol: "〰",
            },
            {
              label: "DOCTRINE SCORER",
              desc: "Score any text against active laws",
              symbol: "◎",
            },
            {
              label: "RESONANCE PROBE",
              desc: "Measure current organism resonance",
              symbol: "⊛",
            },
            {
              label: "LAW APPLICATOR",
              desc: "Select laws and inject into any context",
              symbol: "⊕",
            },
          ].map((tool, idx) => (
            <button
              key={tool.label}
              type="button"
              className="text-left border border-[oklch(0.22_0.022_280)] bg-[oklch(0.12_0.012_278)] p-4 hover:border-[oklch(0.65_0.18_240_/_0.5)] hover:bg-[oklch(0.13_0.013_278)] transition-all group"
              data-ocid={`utilities.item.${idx + 1}`}
            >
              <div
                className="text-2xl mb-2"
                style={{
                  filter: "drop-shadow(0 0 8px oklch(0.65 0.18 240 / 0.4))",
                }}
              >
                {tool.symbol}
              </div>
              <div className="font-mono text-[9px] font-bold text-white group-hover:text-[oklch(0.65_0.18_240)] transition-colors mb-0.5">
                {tool.label}
              </div>
              <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                {tool.desc}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── EdgeModelsSection ────────────────────────────────────────────────────────

function EdgeModelsSection() {
  return (
    <ScrollArea className="flex-1 h-full">
      <div className="p-3 flex flex-col gap-3">
        {/* OMNIS Voting Panel */}
        <div>
          <div
            className="font-mono text-[7px] tracking-widest mb-1.5"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            GAP_7 · OMNIS CONSENSUS SPHERE
          </div>
          <OmnisVotingPanel coreStates={[]} />
        </div>

        {/* Readiness Gate */}
        <div>
          <div
            className="font-mono text-[7px] tracking-widest mb-1.5"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            GAP_8 · READINESS GATE BREAKDOWN
          </div>
          <ReadinessGateBreakdown
            velaStep={18}
            doctrineScore={0.72}
            omnisWeight={0.65}
          />
        </div>

        {/* VELA Rings */}
        <div>
          <div
            className="font-mono text-[7px] tracking-widest mb-1.5"
            style={{ color: "oklch(0.38 0.03 280)" }}
          >
            GAP_12 · VELA RING ACTIVATION
          </div>
          <VelaRingPanel />
        </div>
      </div>
    </ScrollArea>
  );
}

export function SovereignSystemPanel() {
  const [activeSection, setActiveSection] = useState<SystemSection>("laws");

  const renderSection = () => {
    switch (activeSection) {
      case "laws":
        return <LawCardGrid />;
      case "macromodels":
        return <MacroModelPanel />;
      case "medinamodels":
        return <MedinaModelGrid />;
      case "layer-1":
        return (
          <ScrollArea className="h-full">
            <LayerMinusOnePanel />
          </ScrollArea>
        );
      case "research":
        return <ResearchPapersSection />;
      case "civilizationgap":
        return <CivilizationGapPanel />;
      case "edgemodels":
        return <EdgeModelsSection />;
      case "livingdocs":
        return <LivingDocReaderPanel />;
      case "wasmlayer":
        return <WasmIntelligencePanel />;
      case "icpnative":
        return <IcpNativeIntelligencePanel />;
      case "blockchain":
        return <BlockchainIntelligencePanel />;
      case "encryption":
        return <EncryptionIntelligencePanel />;
      case "sanctum":
        return <SanctumSovereignPanel />;
      case "phantom":
        return <PhantomSovereignPanel />;
      case "presence":
        return <PresenceGatePanel />;
      case "middlelayer":
        return <MiddleLayerPanel />;
      case "miningswarm":
        return <MiningSwarmPanel />;
      case "sovereigntymodels":
        return <ModelTaxonomyPanel />;
      case "applications":
        return <ApplicationsSection />;
      case "settings":
        return <VaultSettingsPanel />;
      case "utilities":
        return <UtilitiesSection />;
      case "memory_temple":
        return <MemoryTempleSearchPanel />;
      case "terminal":
        return <RadixVenaeTerminalPanel />;
      case "governance":
        return <GovernanceVotingPanel />;
      case "token_trading":
        return <TokenTradingPanel />;
      case "film_school":
        return <FilmSchoolMetricsPanel />;
      default:
        return <LawCardGrid />;
    }
  };

  return (
    <div className="flex h-full" data-ocid="sovereign_system.panel">
      {/* Sidebar */}
      <div className="w-40 flex-shrink-0 border-r border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)] flex flex-col">
        <div className="px-3 py-3 border-b border-[oklch(0.20_0.02_280)]">
          <div className="font-display text-[10px] font-bold tracking-widest text-white">
            SOVEREIGN
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mt-0.5">
            SYSTEM
          </div>
        </div>
        <nav className="flex-1 py-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`w-full text-left px-3 py-2.5 transition-all flex items-center gap-2 group ${
                activeSection === item.id
                  ? "bg-[oklch(0.75_0.16_70_/_0.08)] border-l-2 border-[oklch(0.75_0.16_70)]"
                  : "border-l-2 border-transparent hover:bg-[oklch(0.13_0.013_278)] hover:border-[oklch(0.75_0.16_70_/_0.3)]"
              }`}
              onClick={() => setActiveSection(item.id)}
              data-ocid={`sovereign_system.nav.${item.id}`}
            >
              <span
                className={`text-sm flex-shrink-0 transition-all ${
                  activeSection === item.id
                    ? "filter drop-shadow-[0_0_6px_oklch(0.75_0.16_70)]"
                    : "opacity-50 group-hover:opacity-70"
                }`}
                style={
                  activeSection === item.id
                    ? {
                        filter:
                          "drop-shadow(0 0 6px oklch(0.75 0.16 70 / 0.8))",
                      }
                    : {}
                }
              >
                {item.symbol}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-mono text-[7px] tracking-widest truncate transition-colors ${
                    activeSection === item.id
                      ? "text-[oklch(0.75_0.16_70)]"
                      : "text-[oklch(0.35_0.03_280)] group-hover:text-white"
                  }`}
                >
                  {item.label}
                </div>
                {item.count !== undefined && (
                  <div className="font-mono text-[6px] text-[oklch(0.30_0.02_280)]">
                    {item.count}
                  </div>
                )}
              </div>
            </button>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-[oklch(0.20_0.02_280)]">
          <div className="font-mono text-[6px] text-[oklch(0.25_0.02_280)] tracking-wider leading-relaxed">
            ATTRIBUTED TO
            <br />
            ALFREDO MEDINA
            <br />
            HERNANDEZ
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Section header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.01_280)]">
          {(() => {
            const item = NAV_ITEMS.find((n) => n.id === activeSection);
            return (
              <div className="flex items-center gap-2">
                <span
                  className="text-lg"
                  style={{
                    filter: "drop-shadow(0 0 8px oklch(0.75 0.16 70 / 0.5))",
                  }}
                >
                  {item?.symbol}
                </span>
                <div>
                  <div className="font-display text-sm font-bold text-white">
                    {item?.label}
                  </div>
                  {item?.count !== undefined && (
                    <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                      {item.count} entries
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
        {/* Section content */}
        <div className="flex-1 min-h-0 overflow-hidden">{renderSection()}</div>
      </div>
    </div>
  );
}
