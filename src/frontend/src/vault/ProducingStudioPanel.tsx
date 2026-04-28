import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ContentLibrary } from "./ContentLibrary";
import { FilmPipelinePanel } from "./FilmPipelinePanel";
import { ReviewQueue } from "./ReviewQueue";
import { TikTokPipeline } from "./TikTokPipeline";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudioTab =
  | "CONTENT LIBRARY"
  | "REVIEW QUEUE"
  | "TIKTOK PIPELINE"
  | "FILM PIPELINE"
  | "DISTRIBUTION";

interface TabConfig {
  id: StudioTab;
  label: string;
  shortLabel: string;
  badge?: string;
  badgeColor?: string;
}

// ─── Distribution Panel ───────────────────────────────────────────────────────

function DistributionPanel() {
  const channels = [
    {
      id: "tiktok",
      name: "TIKTOK",
      status: "LIVE",
      color: "oklch(0.58 0.20 300)",
      count: 12,
      views: "47.2K",
    },
    {
      id: "youtube",
      name: "YOUTUBE",
      status: "LIVE",
      color: "oklch(0.62 0.22 25)",
      count: 8,
      views: "21.6K",
    },
    {
      id: "instagram",
      name: "INSTAGRAM",
      status: "LIVE",
      color: "oklch(0.62 0.22 15)",
      count: 19,
      views: "88.9K",
    },
    {
      id: "icp",
      name: "ICP ON-CHAIN",
      status: "SEALED",
      color: "oklch(0.68 0.19 132)",
      count: 34,
      views: "∞",
    },
    {
      id: "x",
      name: "X / TWITTER",
      status: "PENDING",
      color: "oklch(0.68 0.19 235)",
      count: 0,
      views: "—",
    },
    {
      id: "linkedin",
      name: "LINKEDIN",
      status: "PENDING",
      color: "oklch(0.55 0.18 250)",
      count: 0,
      views: "—",
    },
  ];

  const statusColors: Record<string, string> = {
    LIVE: "oklch(0.68 0.19 132)",
    SEALED: "oklch(0.75 0.16 70)",
    PENDING: "oklch(0.35 0.03 280)",
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--vault-panel-bg))" }}
    >
      <div className="flex-shrink-0 px-5 py-4 border-b border-[oklch(0.15_0.02_280)] bg-[oklch(0.09_0.01_280)]">
        <div className="font-display text-sm font-bold tracking-widest text-white">
          DISTRIBUTION
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider mt-0.5">
          SOVEREIGN REACH — ALL CHANNELS
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "TOTAL DISTRIBUTED", value: "73" },
              { label: "TOTAL VIEWS", value: "157.7K" },
              { label: "CHANNELS LIVE", value: "3" },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] p-3"
              >
                <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1">
                  {s.label}
                </div>
                <div className="font-mono text-lg font-bold text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Channel list */}
          <div className="space-y-2">
            {channels.map((ch, i) => (
              <motion.div
                key={ch.id}
                className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] p-4 flex items-center gap-4"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                data-ocid={`distribution.channel.${i + 1}`}
              >
                {/* Status dot */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: statusColors[ch.status],
                    boxShadow:
                      ch.status === "LIVE"
                        ? `0 0 8px ${statusColors[ch.status]}`
                        : "none",
                    animation:
                      ch.status === "LIVE" ? "pulse-dot 1.8s infinite" : "",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-mono text-sm font-bold tracking-wider"
                    style={{ color: ch.color }}
                  >
                    {ch.name}
                  </div>
                  <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mt-0.5">
                    {ch.count} ARTIFACTS · {ch.views} VIEWS
                  </div>
                </div>
                <span
                  className="font-mono text-[8px] tracking-widest px-2 py-1 border"
                  style={{
                    color: statusColors[ch.status],
                    borderColor: statusColors[ch.status].replace(
                      ")",
                      " / 0.4)",
                    ),
                    backgroundColor: statusColors[ch.status].replace(
                      ")",
                      " / 0.08)",
                    ),
                  }}
                >
                  {ch.status}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Law 30 — Sovereign Reach callout */}
          <div className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.04)] p-4">
            <div className="font-mono text-[7px] tracking-widest text-[oklch(0.75_0.16_70)] mb-2">
              LAW 30 — SOVEREIGN REACH
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.50_0.03_280)] leading-relaxed italic">
              "Distribution with financial identity baked into the seal at the
              moment of creation — not triggered after. Every artifact
              attributed on-chain. Every view is a doctrine event."
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

const TABS: TabConfig[] = [
  {
    id: "CONTENT LIBRARY",
    label: "CONTENT LIBRARY",
    shortLabel: "LIBRARY",
  },
  {
    id: "REVIEW QUEUE",
    label: "REVIEW QUEUE",
    shortLabel: "REVIEW",
    badge: "3",
    badgeColor: "oklch(0.70 0.15 55)",
  },
  {
    id: "TIKTOK PIPELINE",
    label: "TIKTOK PIPELINE",
    shortLabel: "TIKTOK",
  },
  {
    id: "FILM PIPELINE",
    label: "FILM PIPELINE",
    shortLabel: "FILMS",
    badge: "1",
    badgeColor: "oklch(0.65 0.18 240)",
  },
  {
    id: "DISTRIBUTION",
    label: "DISTRIBUTION",
    shortLabel: "DIST.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProducingStudioPanel() {
  const [activeTab, setActiveTab] = useState<StudioTab>("CONTENT LIBRARY");

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--vault-panel-bg))" }}
      data-ocid="producing-studio.panel"
    >
      {/* Panel Header */}
      <div className="flex-shrink-0 px-5 pt-4 pb-0 border-b border-[oklch(0.15_0.02_280)] bg-[oklch(0.09_0.01_280)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-display text-sm font-bold tracking-[0.2em] text-white">
              PRODUCING STUDIO
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-[0.25em] mt-0.5">
              SOVEREIGN CONTENT COMMAND
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "oklch(0.68 0.19 132)",
                boxShadow: "0 0 8px oklch(0.68 0.19 132 / 0.7)",
                animation: "pulse-dot 1.5s ease-in-out infinite",
              }}
            />
            <span className="font-mono text-[7px] tracking-widest text-[oklch(0.68_0.19_132)]">
              LIVE
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div
          className="flex gap-0 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          data-ocid="producing-studio.tab_bar"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`relative flex items-center gap-1.5 font-mono text-[9px] tracking-widest px-3 py-2.5 flex-shrink-0 border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-b-[oklch(0.75_0.16_70)] text-white"
                  : "border-b-transparent text-[oklch(0.30_0.02_280)] hover:text-[oklch(0.55_0.03_280)]"
              }`}
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`producing-studio.tab.${tab.id.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="inline sm:hidden">{tab.shortLabel}</span>
              {tab.badge && (
                <span
                  className="font-mono text-[7px] w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      tab.badgeColor?.replace(")", " / 0.15)") ??
                      "oklch(0.30 0.02 280 / 0.15)",
                    color: tab.badgeColor ?? "oklch(0.30 0.02 280)",
                    border: `1px solid ${tab.badgeColor?.replace(")", " / 0.4)") ?? "oklch(0.30 0.02 280 / 0.4)"}`,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "CONTENT LIBRARY" && <ContentLibrary />}
            {activeTab === "REVIEW QUEUE" && <ReviewQueue />}
            {activeTab === "TIKTOK PIPELINE" && <TikTokPipeline />}
            {activeTab === "FILM PIPELINE" && <FilmPipelinePanel />}
            {activeTab === "DISTRIBUTION" && <DistributionPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
