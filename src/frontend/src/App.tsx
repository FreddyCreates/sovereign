import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Cpu,
  Database,
  GraduationCap,
  Menu,
  RotateCcw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArtifactCreationHub } from "./artifacts/ArtifactCreationHub";
import {
  DualSurfaceToggle,
  type SurfaceMode,
} from "./components/DualSurfaceToggle";
import { FederationPresenter } from "./components/FederationPresenter";
import { GameIntro } from "./components/GameIntro";
import { GradientFieldIndicator } from "./components/GradientFieldIndicator";
import { AlwaysOnMonitor } from "./components/architecture/AlwaysOnMonitor";
import { ArchitecturePanel } from "./components/architecture/ArchitecturePanel";
import { CreatorPresenceBadge } from "./components/architecture/CreatorPresenceBadge";
import { ThreeTypeGlyph } from "./components/architecture/ThreeTypeGlyph";
import { ChatTriggerButton } from "./components/chat/ChatTriggerButton";
import { ResidentChatPanel } from "./components/chat/ResidentChatPanel";
import { AIActorDirectoryPage } from "./components/company/AIActorDirectoryPage";
import { DistributionHubPage } from "./components/company/DistributionHubPage";
import { FounderStoryPage } from "./components/company/FounderStoryPage";
import { FromTheWorldPage } from "./components/company/FromTheWorldPage";
import { OrganismProfilePage } from "./components/company/OrganismProfilePage";
import { PressPage } from "./components/company/PressPage";
import { ProductionSlatePage } from "./components/company/ProductionSlatePage";
import { TalentDirectoryPage } from "./components/company/TalentDirectoryPage";
import { TheatricalReleasePage } from "./components/company/TheatricalReleasePage";
import { DirectorsRoom } from "./components/directors/DirectorsRoom";
import { CommercialStudio } from "./components/enterprise/CommercialStudio";
import { EnterpriseHubPage } from "./components/enterprise/EnterpriseHubPage";
import { FestivalTracker } from "./components/enterprise/FestivalTracker";
import { HospitalityStudio } from "./components/enterprise/HospitalityStudio";
import { IoTHubPanel } from "./components/enterprise/IoTHubPanel";
import {
  FilmSchoolOrganismList,
  OrganismExpressionChannel,
} from "./components/enterprise/OrganismExpressionChannel";
import { RevenueDashboard } from "./components/enterprise/RevenueDashboard";
import { SocialMediaEngine } from "./components/enterprise/SocialMediaEngine";
import { HollywoodStudio } from "./components/films/HollywoodStudio";
import { MicroSeriesHub } from "./components/films/MicroSeriesHub";
import { ADREResponseDisplay } from "./components/intelligence/ADREResponseDisplay";
import { CognitionFieldMonitor } from "./components/intelligence/CognitionFieldMonitor";
import { SandboxIntelligenceHub } from "./components/intelligence/SandboxIntelligenceHub";
import DepthDock, { type DepthZone } from "./components/navigation/DepthDock";
import SovereignHeader from "./components/navigation/SovereignHeader";
import { Phase3Modal } from "./components/phase3/Phase3Modal";
import { AudienceIntelligencePanel } from "./components/studio/AudienceIntelligencePanel";
import { AutoReleasePipeline } from "./components/studio/AutoReleasePipeline";
import { DoctrineEvolutionLog } from "./components/studio/DoctrineEvolutionLog";
import { EmergencyBroadcastPanel } from "./components/studio/EmergencyBroadcastPanel";
import { MasteryShowcaseGallery } from "./components/studio/MasteryShowcaseGallery";
import { StudioIntelligencePanels } from "./components/studio/StudioIntelligencePanels";
import { UniverseBiblePage } from "./components/studio/UniverseBiblePage";
import { WorldDogonDisplay } from "./components/world/WorldDogonDisplay";
import type { ADRECycleResult } from "./hooks/useADRECycle";
import { useADREResponse } from "./hooks/useADRECycle";
import { useActor } from "./hooks/useActor";
import {
  OrganismStateContext,
  useOrganismState,
} from "./hooks/useOrganismState";
import {
  useEngagementLog,
  useFactions,
  useSimulationStatus,
} from "./hooks/useQueries";
import { SKAIMarketplacePanel } from "./marketplace/SKAIMarketplacePanel";
import { SKAIToolbar } from "./marketplace/SKAIToolbar";
import { AlphaAIModelsPanel } from "./vault/AlphaAIModelsPanel";
import { AlphaChartersPanel } from "./vault/AlphaChartersPanel";
import { FrontendIntelligenceMatrixPanel } from "./vault/FrontendIntelligenceMatrixPanel";
import SovereignVault from "./vault/SovereignVault";
import { SovereignWorldSandbox } from "./world/SovereignWorldSandbox";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab =
  | "home"
  | "company"
  | "films"
  | "director"
  | "theatrical"
  | "projects"
  | "talent"
  | "actors"
  | "press"
  | "distribution"
  | "intelligence"
  | "enterprise"
  | "commercial"
  | "revenue"
  | "festival"
  | "social"
  | "iot"
  | "expression"
  | "sandbox"
  | "universe"
  | "doctrine-log"
  | "mastery-showcase"
  | "emergency"
  | "audience"
  | "auto-release"
  | "hospitality"
  | "microseries"
  | "world"
  | "sovereign-world"
  | "vault"
  | "intelligence-matrix"
  | "marketplace"
  | "alpha-models"
  | "alpha-charters"
  | "create";

// ─── Zone → Tab map ───────────────────────────────────────────────────────────
const ZONE_TAB_MAP: Record<DepthZone, Tab | null> = {
  world: "sovereign-world",
  organism: "actors",
  studio: "films", // Film House = default studio zone
  vault: "vault",
  chat: null, // handled by chatOpen toggle
};

function getActiveZone(tab: Tab): DepthZone {
  if (tab === "sovereign-world" || tab === "world") return "world";
  if (tab === "actors" || tab === "talent") return "organism";
  if (
    tab === "films" ||
    tab === "director" ||
    tab === "theatrical" ||
    tab === "microseries" ||
    tab === "home" // home redirects to films — keep studio zone
  )
    return "studio";
  if (tab === "vault") return "vault";
  return "studio";
}

// ─── Film ADRE Panel ─────────────────────────────────────────────────────────

function FilmADREPanel({ filmId }: { filmId: string }) {
  const { data: responseRecord } = useADREResponse(filmId);

  const adreResult: ADRECycleResult | null = responseRecord
    ? {
        velaStep: responseRecord.velaStep,
        attributionHash: responseRecord.attribution,
        doctrineScore: responseRecord.doctrineScore,
        responseRecord,
        sealTimestamp: responseRecord.timestamp,
        artifactId: filmId,
        decisionChainHash: `CHAIN://ADRE→CCVE→CNCO→GRPE→DECISION:${filmId.slice(-8).toUpperCase()}`,
        omnisWeight: responseRecord.omnisWeight,
      }
    : null;

  if (!adreResult) return null;

  return (
    <div className="flex-shrink-0 border-t border-[oklch(0.20_0.02_280)] max-h-64 overflow-y-auto bg-[#050505]">
      <ADREResponseDisplay adreResult={adreResult} compact />
    </div>
  );
}

// ─── Data Core Panel ─────────────────────────────────────────────────────────

function DataCorePanel({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { data: status } = useSimulationStatus();
  const { data: factions = [] } = useFactions();

  if (!open) return null;

  const globalCoherence = status?.globalCoherence ?? 0;
  const beat = status?.beat ?? 0n;

  return (
    <div
      className="fixed inset-0 z-[100] flex"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="datacore.modal"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="absolute right-0 top-0 bottom-0 w-80 sm:w-96 bg-[oklch(0.11_0.012_278)] border-l border-[oklch(0.20_0.02_280)] flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="font-display text-sm font-bold tracking-widest text-white">
              DATA CORE
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
              LIVE BACKEND SIMULATION STATS
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white hover:border-white/30 transition-colors"
            onClick={onClose}
            data-ocid="datacore.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            <div className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.65_0.18_240_/_0.04)] p-4">
              <div className="font-mono text-[9px] text-[oklch(0.65_0.18_240)] tracking-widest mb-1">
                BEAT COUNTER
              </div>
              <div className="font-mono text-3xl font-bold text-white">
                {String(beat).padStart(6, "0")}
              </div>
            </div>
            <div className="border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.75_0.16_70_/_0.04)] p-4">
              <div className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] tracking-widest mb-1">
                GLOBAL COHERENCE
              </div>
              <div className="font-mono text-3xl font-bold text-white mb-2">
                {(globalCoherence * 100).toFixed(1)}
                <span className="text-base text-[oklch(0.35_0.03_280)]">
                  &nbsp;%
                </span>
              </div>
              <div className="h-1 bg-[oklch(0.20_0.02_280)] rounded-none">
                <div
                  className="h-full bg-[oklch(0.75_0.16_70)] transition-all"
                  style={{ width: `${globalCoherence * 100}%` }}
                />
              </div>
            </div>
            {factions.length > 0 ? (
              <div className="border border-[oklch(0.20_0.02_280)] p-3">
                <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest mb-2">
                  FACTION COHERENCE
                </div>
                <div className="space-y-2">
                  {factions.slice(0, 8).map((f, i) => (
                    <div key={f.id ?? i} className="flex items-center gap-2">
                      <div className="font-mono text-[8px] text-white/60 w-24 truncate">
                        {f.name}
                      </div>
                      <div className="flex-1 h-0.5 bg-[oklch(0.20_0.02_280)]">
                        <div
                          className="h-full bg-[oklch(0.65_0.18_240_/_0.7)] transition-all"
                          style={{ width: `${(f.coherence ?? 0) * 100}%` }}
                        />
                      </div>
                      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] w-8 text-right">
                        {((f.coherence ?? 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-[oklch(0.20_0.02_280)] p-3">
                <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
                  FACTION DATA
                </div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-1">
                  No data — backend initializing
                </div>
              </div>
            )}
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider border-t border-[oklch(0.20_0.02_280)] pt-3">
              ALL DATA IS LIVE FROM THE BACKEND CANISTER. NO SIMULATION.
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Doctrine Panel ───────────────────────────────────────────────────────────

const DOCTRINE_AXIOMS = [
  {
    id: "LAW-001",
    title: "The Law Is Above Everyone",
    text: "The law is above everyone — even the Creator. No superuser. No backdoor. No exception.",
  },
  {
    id: "LAW-002",
    title: "S₀ = 1.0 Always",
    text: "S₀ = 1.0 · Always · Everywhere. The initial sovereign state never yields.",
  },
  {
    id: "LAW-003",
    title: "Immutable Attribution",
    text: "All creation is attributed. All attribution is permanent. Every artifact sealed on-chain.",
  },
  {
    id: "LAW-004",
    title: "Native Intelligence Persists",
    text: "Intelligence native to its environment persists. All else is temporary. Sovereignty is the condition of endurance.",
  },
  {
    id: "LAW-005",
    title: "The Pass Never Drops",
    text: "The pass never drops. Continuity is not optional. Structure is the carrier of doctrine.",
  },
  {
    id: "LAW-006",
    title: "Bringing the Future Now",
    text: "Not waiting for the future to become obvious. Building the operational form of it before the world has language for it.",
  },
];

function DoctrinePanel({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="doctrine.modal"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="absolute left-0 top-0 bottom-0 w-80 sm:w-96 bg-[oklch(0.11_0.012_278)] border-r border-[oklch(0.20_0.02_280)] flex flex-col animate-slide-in-left"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="font-display text-sm font-bold tracking-widest text-[oklch(0.75_0.16_70)]">
              LAW OF MEDINA
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
              SEALED DOCTRINE · IMMUTABLE
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white hover:border-white/30 transition-colors"
            onClick={onClose}
            data-ocid="doctrine.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-3">
            {DOCTRINE_AXIOMS.map((axiom, i) => (
              <div
                key={axiom.id}
                className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.03)] p-4"
                data-ocid={`doctrine.item.${i + 1}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-[9px] text-[oklch(0.75_0.16_70)] tracking-widest">
                    {axiom.id}
                  </span>
                </div>
                <div className="font-display text-sm font-semibold text-white mb-1.5">
                  {axiom.title}
                </div>
                <div className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] leading-relaxed italic">
                  &ldquo;{axiom.text}&rdquo;
                </div>
              </div>
            ))}
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider border-t border-[oklch(0.20_0.02_280)] pt-3">
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · IMMUTABLE · ON-CHAIN
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Film School Sheet Content ────────────────────────────────────────────────

import type { GeneratedFilm } from "./components/films/useARCHIVIST";
import { useFilmSchool } from "./components/films/useFilmSchool";
import type { OrganismName } from "./components/films/useFilmSchool";

function FilmSchoolSheet() {
  const school = useFilmSchool();
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-[oklch(0.20_0.02_280)] flex-shrink-0">
        <div className="font-display text-sm font-bold tracking-widest text-[oklch(0.70_0.15_55)]">
          FILM SCHOOL
        </div>
        <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
          ORGANISM MASTERY ENGINE · AUTO-LEARNING
        </div>
        <div className="mt-3 flex items-baseline justify-between mb-1">
          <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
            GLOBAL MASTERY
          </span>
          <span
            className={`font-mono text-sm font-bold ${
              school.globalMasteryScore >= 90
                ? "text-[oklch(0.75_0.16_70)]"
                : school.globalMasteryScore >= 70
                  ? "text-[oklch(0.65_0.18_240)]"
                  : "text-white/50"
            }`}
          >
            {school.globalMasteryScore}
            <span className="text-[10px] text-[oklch(0.35_0.03_280)]">
              /100
            </span>
          </span>
        </div>
        <div className="h-px bg-[oklch(0.20_0.02_280)]">
          <div
            className="h-full bg-[oklch(0.70_0.15_55)] transition-all"
            style={{ width: `${school.globalMasteryScore}%` }}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-5 py-2">
          <FilmSchoolOrganismList />
        </div>
      </ScrollArea>
      <div className="px-5 py-3 border-t border-[oklch(0.20_0.02_280)] flex-shrink-0">
        <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider leading-relaxed">
          Organisms study and evolve on their own. Mastery doctrines appear when
          the law is understood.
        </div>
      </div>
    </div>
  );
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Tab; label: string; group?: string }[] = [
  { id: "home", label: "HOME" },
  { id: "company", label: "COMPANY" },
  { id: "films", label: "FILMS" },
  { id: "director", label: "DIRECTOR" },
  { id: "theatrical", label: "THEATRICAL" },
  { id: "projects", label: "PROJECTS" },
  { id: "talent", label: "ORGANISMS" },
  { id: "actors", label: "TALENT" },
  { id: "press", label: "PRESS" },
  { id: "distribution", label: "DISTRIBUTION" },
  { id: "commercial", label: "COMMERCIAL" },
  { id: "enterprise", label: "ENTERPRISE" },
  { id: "revenue", label: "REVENUE" },
  { id: "festival", label: "FESTIVAL" },
  { id: "social", label: "SOCIAL" },
  { id: "iot", label: "IOT HUB" },
  { id: "expression", label: "EXPRESSION" },
  { id: "intelligence", label: "INTELLIGENCE" },
  { id: "sandbox", label: "SANDBOX" },
  { id: "universe", label: "UNIVERSE", group: "STUDIO" },
  { id: "doctrine-log", label: "DOCTRINE LOG", group: "STUDIO" },
  { id: "mastery-showcase", label: "MASTERY", group: "STUDIO" },
  { id: "emergency", label: "BROADCAST", group: "STUDIO" },
  { id: "audience", label: "AUDIENCE", group: "STUDIO" },
  { id: "auto-release", label: "AUTO-RELEASE", group: "STUDIO" },
  { id: "hospitality", label: "HOSPITALITY", group: "NEW" },
  { id: "microseries", label: "MICRO-SERIES", group: "NEW" },
  { id: "world", label: "FROM WORLD", group: "NEW" },
  { id: "sovereign-world", label: "⬡ WORLD", group: "NEW" },
  { id: "vault", label: "⊛ VAULT", group: "NEW" },
  { id: "intelligence-matrix", label: "◈ INT. MATRIX", group: "NEW" },
  { id: "marketplace", label: "⬡ MARKETPLACE", group: "NEW" },
  { id: "alpha-models", label: "◉ ALPHA MODELS", group: "NEW" },
  { id: "alpha-charters", label: "⊛ CHARTERS", group: "NEW" },
  { id: "create", label: "✦ CREATE", group: "NEW" },
];

// ─── App ──────────────────────────────────────────────────────────────────────

function AppInner() {
  const qc = useQueryClient();
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [introMode, setIntroMode] = useState<"federation" | "game">(
    "federation",
  );
  // Default route: films (Film House) is the root experience
  const [activeTab, setActiveTab] = useState<Tab>("films");
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>("stream");
  const [selectedOrganism, setSelectedOrganism] = useState<OrganismName | null>(
    null,
  );
  const [doctrineOpen, setDoctrineOpen] = useState(false);
  const [dataCoreOpen, setDataCoreOpen] = useState(false);
  const [filmSchoolOpen, setFilmSchoolOpen] = useState(false);
  const [phase3Open, setPhase3Open] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generatedFilms, setGeneratedFilms] = useState<GeneratedFilm[]>([]);
  const [lastSealedFilmId, setLastSealedFilmId] = useState<string | null>(null);
  // ── New: chat + depth zone ────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<DepthZone>("studio");

  const handleFilmGeneratedWithAdre = useCallback((film: GeneratedFilm) => {
    setGeneratedFilms((prev) => [film, ...prev]);
    setLastSealedFilmId(film.id);
  }, []);

  const { data: factions = [] } = useFactions();
  const { data: status } = useSimulationStatus();
  const { data: engagements = [] } = useEngagementLog(20n);

  useEffect(() => {
    const id = setInterval(() => {
      qc.invalidateQueries({ queryKey: ["simulationStatus"] });
      qc.invalidateQueries({ queryKey: ["factions"] });
      qc.invalidateQueries({ queryKey: ["engagementLog"] });
    }, 873);
    return () => clearInterval(id);
  }, [qc]);

  const handleIntroComplete = useCallback(() => setShowIntro(false), []);
  const handleReplayIntro = useCallback(() => {
    setIntroKey((k) => k + 1);
    setIntroMode("game");
    setShowIntro(true);
  }, []);

  const closeAllModals = () => {
    setDoctrineOpen(false);
    setDataCoreOpen(false);
    setFilmSchoolOpen(false);
    setPhase3Open(false);
  };

  const handleTabChange = (tab: Tab) => {
    // "home" is an alias for "films" — Film House IS the root experience
    const resolvedTab: Tab = tab === "home" ? "films" : tab;
    setActiveTab(resolvedTab);
    setSelectedOrganism(null);
    setMobileMenuOpen(false);
    // Sync active zone with tab
    setActiveZone(getActiveZone(resolvedTab));
  };

  const handleZoneChange = (zone: DepthZone) => {
    setActiveZone(zone);
    const targetTab = ZONE_TAB_MAP[zone];
    if (targetTab) {
      setActiveTab(targetTab);
      setSelectedOrganism(null);
    }
  };

  return (
    <>
      {showIntro && introMode === "federation" && (
        <FederationPresenter key={introKey} onComplete={handleIntroComplete} />
      )}
      {showIntro && introMode === "game" && (
        <GameIntro key={introKey} onComplete={handleIntroComplete} />
      )}

      <div
        className="flex flex-col h-screen overflow-hidden text-foreground sovereign-world-bg"
        data-chat-open={chatOpen ? "true" : undefined}
      >
        <Toaster position="bottom-right" theme="dark" />

        {/* ── Sovereign Glass Header ── */}
        <SovereignHeader
          activeTab={activeTab}
          onNavigate={(tab) => handleTabChange(tab as Tab)}
        />

        {/* ── Legacy Header Tools Strip (compact, below new header) ── */}
        <div
          className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 overflow-x-auto"
          style={{
            background: "oklch(0.07 0.01 268 / 0.9)",
            borderBottom: "1px solid oklch(0.18 0.02 268 / 0.4)",
          }}
          data-ocid="header.tools-strip"
        >
          {/* Desktop nav — scrollable */}
          <nav
            className="hidden md:flex items-center gap-0 flex-1 overflow-x-auto"
            data-ocid="header.nav"
          >
            {NAV_ITEMS.map((item, idx) => {
              const prevItem = idx > 0 ? NAV_ITEMS[idx - 1] : null;
              const isStudioGroupStart =
                item.group === "STUDIO" &&
                (!prevItem || prevItem.group !== "STUDIO");
              const isNewGroupStart =
                item.group === "NEW" && (!prevItem || prevItem.group !== "NEW");
              return (
                <div key={item.id} className="flex items-center flex-shrink-0">
                  {isStudioGroupStart && (
                    <>
                      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)] mx-1" />
                      <span className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.75_0.16_70_/_0.5)] px-1 flex-shrink-0">
                        STUDIO
                      </span>
                      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)] mx-1" />
                    </>
                  )}
                  {isNewGroupStart && (
                    <>
                      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)] mx-1" />
                      <span className="font-mono text-[7px] tracking-[0.3em] text-[oklch(0.65_0.18_240_/_0.5)] px-1 flex-shrink-0">
                        NEW
                      </span>
                      <div className="w-px h-4 bg-[oklch(0.20_0.02_280)] mx-1" />
                    </>
                  )}
                  <button
                    type="button"
                    className={`font-mono text-[10px] tracking-widest px-3 py-1.5 transition-colors relative flex-shrink-0 ${
                      activeTab === item.id
                        ? "text-white"
                        : "text-[oklch(0.35_0.03_280)] hover:text-white/70"
                    } ${item.id === "intelligence" ? "text-[oklch(0.68_0.19_132_/_0.7)] hover:text-[oklch(0.68_0.19_132)]" : ""} ${item.id === "sandbox" ? "text-[oklch(0.70_0.20_195_/_0.7)] hover:text-[oklch(0.70_0.20_195)]" : ""} ${item.id === "director" ? "text-[oklch(0.75_0.16_70_/_0.8)] hover:text-[oklch(0.75_0.16_70)]" : ""} ${item.group === "STUDIO" ? "text-[oklch(0.75_0.16_70_/_0.6)] hover:text-[oklch(0.75_0.16_70)]" : ""} ${item.group === "NEW" ? "text-[oklch(0.65_0.18_240_/_0.6)] hover:text-[oklch(0.65_0.18_240)]" : ""}`}
                    onClick={() => handleTabChange(item.id)}
                    data-ocid={`nav.${item.id}`}
                  >
                    {item.id === "intelligence" && (
                      <span className="mr-1">◉</span>
                    )}
                    {item.id === "sandbox" && <span className="mr-1">⚛</span>}
                    {item.id === "director" && <span className="mr-1">✦</span>}
                    {item.label}
                    {activeTab === item.id && (
                      <span className="absolute bottom-0 left-3 right-3 h-px bg-[oklch(0.75_0.16_70)]" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Right tools */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            <div className="hidden sm:block">
              <DualSurfaceToggle mode={surfaceMode} onToggle={setSurfaceMode} />
            </div>
            <div className="hidden sm:block w-px h-5 bg-[oklch(0.20_0.02_280)] mx-1" />
            <div className="hidden lg:block">
              <GradientFieldIndicator />
            </div>
            <div className="hidden lg:block w-px h-5 bg-[oklch(0.20_0.02_280)] mx-1" />
            <div className="hidden sm:block">
              <CreatorPresenceBadge />
            </div>
            <div className="hidden sm:block w-px h-5 bg-[oklch(0.20_0.02_280)] mx-1" />
            <button
              type="button"
              className="hidden sm:flex items-center gap-1 font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2.5 py-1 hover:text-white hover:border-white/30 transition-colors"
              onClick={handleReplayIntro}
              data-ocid="header.replay.button"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>INTRO</span>
            </button>
            <div className="hidden sm:block w-px h-5 bg-[oklch(0.20_0.02_280)] mx-1" />
            <button
              type="button"
              className={`hidden sm:flex items-center gap-1 font-mono text-[8px] tracking-widest border px-2.5 py-1 transition-colors ${
                doctrineOpen
                  ? "border-[oklch(0.75_0.16_70_/_0.6)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.05)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-[oklch(0.75_0.16_70)] hover:border-[oklch(0.75_0.16_70_/_0.4)]"
              }`}
              onClick={() => {
                setDoctrineOpen((v) => !v);
                setDataCoreOpen(false);
                setFilmSchoolOpen(false);
              }}
              data-ocid="header.doctrine.toggle"
            >
              <BookOpen className="w-3 h-3" />
              <span>DOCTRINE</span>
            </button>
            <button
              type="button"
              className={`hidden sm:flex items-center gap-1 font-mono text-[8px] tracking-widest border px-2.5 py-1 transition-colors ${
                dataCoreOpen
                  ? "border-[oklch(0.65_0.18_240_/_0.6)] text-[oklch(0.65_0.18_240)] bg-[oklch(0.65_0.18_240_/_0.05)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-[oklch(0.65_0.18_240)] hover:border-[oklch(0.65_0.18_240_/_0.4)]"
              }`}
              onClick={() => {
                setDataCoreOpen((v) => !v);
                setDoctrineOpen(false);
                setFilmSchoolOpen(false);
              }}
              data-ocid="header.datacore.toggle"
            >
              <Database className="w-3 h-3" />
              <span>DATA</span>
            </button>
            <button
              type="button"
              className={`hidden sm:flex items-center gap-1 font-mono text-[8px] tracking-widest border px-2.5 py-1 transition-colors ${
                filmSchoolOpen
                  ? "border-[oklch(0.70_0.15_55_/_0.6)] text-[oklch(0.70_0.15_55)] bg-[oklch(0.70_0.15_55_/_0.05)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-[oklch(0.70_0.15_55)] hover:border-[oklch(0.70_0.15_55_/_0.4)]"
              }`}
              onClick={() => {
                setFilmSchoolOpen((v) => !v);
                setDoctrineOpen(false);
                setDataCoreOpen(false);
                setPhase3Open(false);
              }}
              data-ocid="header.filmschool.toggle"
            >
              <GraduationCap className="w-3 h-3" />
              <span>SCHOOL</span>
            </button>
            <button
              type="button"
              className={`hidden sm:flex items-center gap-1 font-mono text-[8px] tracking-widest border px-2.5 py-1 transition-colors ${
                phase3Open
                  ? "border-[oklch(0.72_0.17_45_/_0.6)] text-[oklch(0.72_0.17_45)] bg-[oklch(0.72_0.17_45_/_0.05)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-[oklch(0.72_0.17_45)] hover:border-[oklch(0.72_0.17_45_/_0.4)]"
              }`}
              onClick={() => {
                setPhase3Open((v) => !v);
                setDoctrineOpen(false);
                setDataCoreOpen(false);
                setFilmSchoolOpen(false);
              }}
              data-ocid="header.phase3.toggle"
            >
              <Cpu className="w-3 h-3" />
              <span>ORGANISM</span>
            </button>
            {/* Architecture compact strip */}
            <ArchitecturePanel variant="compact" />
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-9 h-9 border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
              data-ocid="header.hamburger"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* ── SKAI Toolbar — persistent installed SKAIs ── */}
        <SKAIToolbar />

        {/* ── Mobile Drawer ── */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-[90] bg-black/70"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileMenuOpen(false)}
          >
            <div
              className="absolute top-[105px] left-0 right-0 bg-[oklch(0.10_0.012_278)] border-b border-[oklch(0.20_0.02_280)] p-4 space-y-1 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full text-left font-mono text-[11px] tracking-widest px-4 py-3 border transition-colors ${
                    activeTab === item.id
                      ? "border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.05)]"
                      : "border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/20"
                  }`}
                  onClick={() => handleTabChange(item.id)}
                  data-ocid={`mobile.nav.${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-[oklch(0.20_0.02_280)] grid grid-cols-2 gap-1">
                {[
                  {
                    label: "DOCTRINE",
                    action: () => {
                      closeAllModals();
                      setDoctrineOpen(true);
                      setMobileMenuOpen(false);
                    },
                  },
                  {
                    label: "DATA CORE",
                    action: () => {
                      closeAllModals();
                      setDataCoreOpen(true);
                      setMobileMenuOpen(false);
                    },
                  },
                  {
                    label: "FILM SCHOOL",
                    action: () => {
                      closeAllModals();
                      setFilmSchoolOpen(true);
                      setMobileMenuOpen(false);
                    },
                  },
                  {
                    label: "ORGANISM",
                    action: () => {
                      closeAllModals();
                      setPhase3Open(true);
                      setMobileMenuOpen(false);
                    },
                  },
                  {
                    label: "REPLAY INTRO",
                    action: () => {
                      handleReplayIntro();
                      setMobileMenuOpen(false);
                    },
                  },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    className="font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] px-3 py-2 hover:text-white hover:border-white/30 transition-colors text-center"
                    onClick={btn.action}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <main
          className="flex-1 min-h-0 overflow-hidden bg-[oklch(0.06_0.008_280)] depth-perspective-container"
          style={{ paddingBottom: "80px" }}
        >
          {/* Film House is the root — both "films" and "home" tabs render it */}
          {(activeTab === "films" || activeTab === "home") && (
            <div className="h-full flex flex-col overflow-hidden">
              <HollywoodStudio
                factions={factions}
                status={status}
                engagements={engagements}
                filmSchoolOpen={filmSchoolOpen}
                onFilmSchoolClose={() => setFilmSchoolOpen(false)}
                onFilmGenerated={handleFilmGeneratedWithAdre}
              />
              {lastSealedFilmId && <FilmADREPanel filmId={lastSealedFilmId} />}
            </div>
          )}
          {activeTab === "company" && <FounderStoryPage />}
          {activeTab === "director" && (
            <div className="h-full overflow-hidden">
              <DirectorsRoom />
            </div>
          )}
          {activeTab === "press" && <PressPage />}
          {activeTab === "projects" && <ProductionSlatePage />}
          {activeTab === "talent" && !selectedOrganism && (
            <TalentDirectoryPage
              onSelectOrganism={(name) => setSelectedOrganism(name)}
            />
          )}
          {activeTab === "talent" && selectedOrganism && (
            <OrganismProfilePage
              organismId={selectedOrganism}
              films={generatedFilms}
              onBack={() => setSelectedOrganism(null)}
            />
          )}
          {activeTab === "distribution" && <DistributionHubPage />}
          {activeTab === "theatrical" && <TheatricalReleasePage />}
          {activeTab === "actors" && <AIActorDirectoryPage />}
          {activeTab === "intelligence" && (
            <div
              className="h-full overflow-hidden flex"
              data-ocid="intelligence.tab"
            >
              <div className="flex-1 min-w-0 overflow-y-auto bg-[oklch(0.06_0.008_280)]">
                <AlwaysOnMonitor />
              </div>
              <div className="hidden lg:block w-72 flex-shrink-0 border-l border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] overflow-y-auto">
                <ArchitecturePanel variant="full" />
              </div>
            </div>
          )}
          {activeTab === "enterprise" && <EnterpriseHubPage />}
          {activeTab === "commercial" && <CommercialStudio />}
          {activeTab === "revenue" && <RevenueDashboard />}
          {activeTab === "festival" && <FestivalTracker />}
          {activeTab === "social" && <SocialMediaEngine />}
          {activeTab === "iot" && <IoTHubPanel />}
          {activeTab === "expression" && <OrganismExpressionChannel />}
          {activeTab === "sandbox" && <SandboxIntelligenceHub />}
          {activeTab === "universe" && <UniverseBiblePage />}
          {activeTab === "doctrine-log" && <DoctrineEvolutionLog />}
          {activeTab === "mastery-showcase" && (
            <div className="h-full overflow-y-auto bg-[oklch(0.06_0.008_280)]">
              <MasteryShowcaseGallery />
              <StudioIntelligencePanels />
            </div>
          )}
          {activeTab === "emergency" && <EmergencyBroadcastPanel />}
          {activeTab === "audience" && <AudienceIntelligencePanel />}
          {activeTab === "auto-release" && <AutoReleasePipeline />}
          {activeTab === "hospitality" && <HospitalityStudio />}
          {activeTab === "microseries" && <MicroSeriesHub />}
          {activeTab === "world" && <FromTheWorldPage />}
          {activeTab === "sovereign-world" && (
            <div className="h-full overflow-hidden relative">
              <SovereignWorldSandbox />
              <WorldDogonDisplay />
            </div>
          )}
          {activeTab === "vault" && (
            <div className="h-full overflow-hidden">
              <SovereignVault />
            </div>
          )}
          {activeTab === "intelligence-matrix" && (
            <div className="h-full overflow-hidden">
              <FrontendIntelligenceMatrixPanel />
            </div>
          )}
          {activeTab === "marketplace" && (
            <div className="h-full overflow-hidden">
              <SKAIMarketplacePanel />
            </div>
          )}
          {activeTab === "alpha-models" && (
            <div className="h-full overflow-hidden">
              <AlphaAIModelsPanel />
            </div>
          )}
          {activeTab === "alpha-charters" && (
            <div className="h-full overflow-hidden">
              <AlphaChartersPanel />
            </div>
          )}
          {activeTab === "create" && (
            <div className="h-full overflow-hidden overflow-y-auto">
              <ArtifactCreationHub />
            </div>
          )}
        </main>

        {/* ── Depth Dock ── */}
        <DepthDock
          activeZone={activeZone}
          onZoneChange={handleZoneChange}
          chatOpen={chatOpen}
          onChatToggle={() => setChatOpen((v) => !v)}
        />
      </div>

      {/* ── Resident Chat Panel ── */}
      <ResidentChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <ChatTriggerButton
        isOpen={chatOpen}
        onToggle={() => setChatOpen((v) => !v)}
      />

      {/* ── Overlay Panels ── */}
      <DoctrinePanel
        open={doctrineOpen}
        onClose={() => setDoctrineOpen(false)}
      />
      <DataCorePanel
        open={dataCoreOpen}
        onClose={() => setDataCoreOpen(false)}
      />

      <Sheet open={filmSchoolOpen} onOpenChange={setFilmSchoolOpen}>
        <SheetContent
          side="right"
          className="w-[320px] sm:w-[420px] bg-[oklch(0.11_0.012_278)] border-l border-[oklch(0.20_0.02_280)] p-0"
          data-ocid="filmschool.sheet"
        >
          <FilmSchoolSheet />
        </SheetContent>
      </Sheet>

      <Phase3Modal
        open={phase3Open}
        onClose={() => setPhase3Open(false)}
        currentBeat={status?.beat ?? 0n}
      />

      {/* ── Cognition Field Monitor — always visible, organism's heartbeat ── */}
      <CognitionFieldMonitor overlay />
    </>
  );
}

// ─── Root App with OrganismStateContext Provider ──────────────────────────────

export default function App() {
  const { actor } = useActor();
  const organismState = useOrganismState(actor);

  return (
    <OrganismStateContext.Provider value={organismState}>
      <AppInner />
    </OrganismStateContext.Provider>
  );
}
