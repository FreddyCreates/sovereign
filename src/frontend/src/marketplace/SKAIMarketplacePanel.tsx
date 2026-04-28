import { Input } from "@/components/ui/input";
/**
 * SKAIMarketplacePanel.tsx — SKAI SOVEREIGN MARKETPLACE
 * Browse, search, install all 51 SKAI organisms.
 * SKAI_ONBOARDING_STARTER_PACK (id=51 / Initium Conscientiae) appears first as gateway product.
 * One-click install — user not developer.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useCallback, useRef, useState } from "react";
import { useHeartbeatPulse } from "../hooks/useHeartbeatPulse";
import { SKAIDetailPanel } from "./SKAIDetailPanel";
import type { SKAIFamily, SKAIOrganism } from "./types";
import {
  useDeploySKAI,
  useSKAIRegistry,
  useUndeploySKAI,
} from "./useSKAIQueries";

// ─── Family meta ─────────────────────────────────────────────────────────────

const FAMILY_COLOR: Record<SKAIFamily, string> = {
  Platform: "oklch(0.65 0.18 240)", // cyan/blue
  Swarm: "oklch(0.72 0.20 45)", // orange
  Domain: "oklch(0.72 0.18 290)", // purple
  Micro: "oklch(0.68 0.19 150)", // green
  Fusion: "oklch(0.70 0.22 320)", // pink/magenta
};

const FAMILY_GRADE: Record<SKAIFamily, string> = {
  Platform: "Primordial",
  Swarm: "Engine",
  Domain: "Field",
  Micro: "Substrate",
  Fusion: "Artifact",
};

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg {
  id: number;
  text: string;
  type: "ok" | "err";
}

function Toast({
  msg,
  onDismiss,
}: { msg: ToastMsg; onDismiss: (id: number) => void }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border font-mono text-[10px] tracking-widest backdrop-blur-sm"
      style={{
        background:
          msg.type === "ok"
            ? "oklch(0.08 0.01 280 / 0.95)"
            : "oklch(0.08 0.01 280 / 0.95)",
        borderColor:
          msg.type === "ok"
            ? "oklch(0.68 0.19 150 / 0.6)"
            : "oklch(0.62 0.22 25 / 0.6)",
        color:
          msg.type === "ok" ? "oklch(0.68 0.19 150)" : "oklch(0.72 0.22 25)",
        boxShadow:
          msg.type === "ok"
            ? "0 0 16px oklch(0.68 0.19 150 / 0.15)"
            : "0 0 16px oklch(0.62 0.22 25 / 0.15)",
        minWidth: "260px",
      }}
      data-ocid="marketplace.toast"
    >
      <span>{msg.type === "ok" ? "◉" : "✕"}</span>
      <span className="flex-1">{msg.text}</span>
      <button
        type="button"
        onClick={() => onDismiss(msg.id)}
        className="opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Dismiss toast"
        data-ocid="marketplace.toast_close"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div
      className="p-4 animate-pulse"
      style={{
        background: "oklch(0.08 0.01 280)",
        border: "1px solid oklch(0.17 0.018 280)",
      }}
    >
      <div
        className="h-3 w-3/4 rounded-none mb-2"
        style={{ background: "oklch(0.15 0.015 280)" }}
      />
      <div
        className="h-2 w-1/2 rounded-none mb-4"
        style={{ background: "oklch(0.13 0.012 280)" }}
      />
      <div className="space-y-1.5">
        <div
          className="h-1.5 w-full rounded-none"
          style={{ background: "oklch(0.12 0.01 280)" }}
        />
        <div
          className="h-1.5 w-5/6 rounded-none"
          style={{ background: "oklch(0.12 0.01 280)" }}
        />
        <div
          className="h-1.5 w-4/6 rounded-none"
          style={{ background: "oklch(0.12 0.01 280)" }}
        />
      </div>
      <div
        className="mt-4 h-6 w-full rounded-none"
        style={{ background: "oklch(0.12 0.01 280)" }}
      />
    </div>
  );
}

// ─── Onboarding Gateway Card (id=51) ─────────────────────────────────────────

interface OnboardingCardProps {
  organism: SKAIOrganism;
  pulse: boolean;
  installingId: string | null;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
  onOpenDetail: (organism: SKAIOrganism) => void;
}

function OnboardingGatewayCard({
  organism,
  pulse,
  installingId,
  onInstall,
  onUninstall,
  onOpenDetail,
}: OnboardingCardProps) {
  const isInstalling = installingId === organism.id;

  return (
    <button
      type="button"
      className="col-span-full flex flex-col p-5 transition-all duration-300 cursor-pointer text-left w-full relative overflow-hidden"
      style={{
        background: "oklch(0.09 0.025 68 / 0.95)",
        border: "1px solid oklch(0.78 0.18 68 / 0.6)",
        boxShadow: pulse
          ? "0 0 40px oklch(0.78 0.18 68 / 0.25), inset 0 0 30px oklch(0.78 0.18 68 / 0.04)"
          : "0 0 20px oklch(0.78 0.18 68 / 0.12)",
      }}
      onClick={() => onOpenDetail(organism)}
      aria-label="View SKAI Onboarding Starter Pack — Initium Conscientiae"
      data-ocid="marketplace.onboarding_card"
    >
      {/* Background aura */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, oklch(0.78 0.18 68 / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row gap-4">
        {/* Left: Identity */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: "oklch(0.78 0.18 68)",
                boxShadow: pulse
                  ? "0 0 12px oklch(0.78 0.18 68 / 1)"
                  : "0 0 6px oklch(0.78 0.18 68 / 0.6)",
                transition: "box-shadow 0.3s",
              }}
            />
            <span
              className="font-mono text-[10px] font-bold tracking-[0.3em]"
              style={{ color: "oklch(0.78 0.18 68)" }}
            >
              GATEWAY PRODUCT — SKAI MARKETPLACE ENTRY
            </span>
          </div>

          <div className="mb-1">
            <span
              className="font-mono text-sm font-bold tracking-widest"
              style={{ color: "oklch(0.92 0.05 280)" }}
            >
              {organism.name}
            </span>
          </div>
          <div className="mb-3">
            <span
              className="font-mono text-[9px] italic"
              style={{ color: "oklch(0.58 0.14 68)" }}
            >
              {organism.latinName}
            </span>
          </div>

          <p
            className="font-mono text-[8px] leading-relaxed mb-3"
            style={{ color: "oklch(0.52 0.04 280)" }}
          >
            The sovereign entry point for external AI systems and developers.
            Feed this to any AI — it reads the world, understands the territory,
            and knows how to call sovereign intelligence without external
            documentation.
          </p>

          <div className="flex flex-col gap-1">
            {organism.uses.map((use) => (
              <div key={use} className="flex items-start gap-1.5">
                <span
                  className="font-mono text-[7px] mt-0.5 flex-shrink-0"
                  style={{ color: "oklch(0.78 0.18 68)" }}
                >
                  ▸
                </span>
                <span
                  className="font-mono text-[8px] leading-tight"
                  style={{ color: "oklch(0.60 0.05 280)" }}
                >
                  {use}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Install + Kernels */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: organism.colonelKernels }, (_, k) => (
              <div
                key={`col-onb-${organism.id}-${k}`}
                className="w-2 h-2 rounded-full"
                style={{
                  background: "oklch(0.78 0.18 68)",
                  boxShadow: pulse
                    ? "0 0 8px oklch(0.78 0.18 68 / 0.9)"
                    : "none",
                  transition: "box-shadow 0.3s",
                }}
              />
            ))}
            <span
              className="font-mono text-[7px] ml-1"
              style={{ color: "oklch(0.50 0.06 68)" }}
            >
              {organism.colonelKernels}× COLONEL
            </span>
          </div>

          <div
            className="font-mono text-[7px] px-2.5 py-1 border"
            style={{
              borderColor: "oklch(0.78 0.18 68 / 0.35)",
              background: "oklch(0.78 0.18 68 / 0.1)",
              color: "oklch(0.78 0.18 68)",
            }}
          >
            Platform · Primordial
          </div>

          <button
            type="button"
            className="font-mono text-[8px] tracking-widest font-bold border px-5 py-2 transition-all"
            style={{
              background: organism.deployed
                ? "oklch(0.78 0.18 68 / 0.20)"
                : isInstalling
                  ? "oklch(0.78 0.18 68 / 0.10)"
                  : "oklch(0.78 0.18 68 / 0.08)",
              borderColor: "oklch(0.78 0.18 68)",
              color: "oklch(0.78 0.18 68)",
              boxShadow: "0 0 16px oklch(0.78 0.18 68 / 0.20)",
              cursor: isInstalling ? "wait" : "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (isInstalling) return;
              organism.deployed
                ? onUninstall(organism.id)
                : onInstall(organism.id);
            }}
            disabled={isInstalling}
            data-ocid={
              organism.deployed
                ? "marketplace.onboarding.uninstall_button"
                : "marketplace.onboarding.install_button"
            }
          >
            {organism.deployed
              ? "◉ INSTALLED — GATE OPEN"
              : isInstalling
                ? "⟳ OPENING GATEWAY…"
                : "◎ INSTALL GATEWAY"}
          </button>
        </div>
      </div>
    </button>
  );
}

// ─── SKAI Card ────────────────────────────────────────────────────────────────

interface SKAICardProps {
  organism: SKAIOrganism;
  pulse: boolean;
  installingId: string | null;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
  onOpenDetail: (organism: SKAIOrganism) => void;
}

function SKAICard({
  organism,
  pulse,
  installingId,
  onInstall,
  onUninstall,
  onOpenDetail,
}: SKAICardProps) {
  const color = FAMILY_COLOR[organism.family];
  const grade = FAMILY_GRADE[organism.family];
  const isInstalling = installingId === organism.id;
  const visibleUses = organism.uses.slice(0, 3);
  const extraCount = organism.uses.length - 3;

  return (
    <button
      type="button"
      className="flex flex-col p-4 transition-all duration-300 cursor-pointer group text-left w-full"
      style={{
        background: organism.deployed
          ? "oklch(0.10 0.015 280)"
          : "oklch(0.08 0.01 280)",
        border: `1px solid ${
          organism.deployed
            ? color.replace(")", " / 0.5)")
            : "oklch(0.17 0.018 280)"
        }`,
        boxShadow: organism.deployed
          ? `0 0 20px ${color.replace(")", " / 0.10)")}`
          : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={() => onOpenDetail(organism)}
      aria-label={`View ${organism.name} details`}
      data-ocid={`marketplace.card.${organism.phiIndex}`}
    >
      {/* Deployed aura */}
      {organism.deployed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${color.replace(")", " / 0.07)")} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
        <div className="flex flex-col min-w-0">
          <span
            className="font-mono text-[9px] font-bold tracking-widest truncate"
            style={{ color: "oklch(0.90 0.04 280)" }}
          >
            {organism.name}
          </span>
          <span
            className="font-mono text-[7px] italic mt-0.5"
            style={{ color: "oklch(0.48 0.10 200)" }}
          >
            {organism.latinName}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="font-mono text-[6px] px-1.5 py-0.5 font-bold tracking-wider"
            style={{
              background: `${color.replace(")", " / 0.15)")}`,
              color,
              border: `1px solid ${color.replace(")", " / 0.4)")}`,
            }}
          >
            {organism.family.toUpperCase()}
          </span>
          <span
            className="font-mono text-[6px] tracking-wider"
            style={{ color: "oklch(0.40 0.05 280)" }}
          >
            {grade}
          </span>
        </div>
      </div>

      {/* Colonel kernels + heartbeat */}
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="flex items-center gap-1">
          {Array.from(
            { length: Math.min(organism.colonelKernels, 5) },
            (_, k) => (
              <div
                key={`col-${organism.id}-${k}`}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "oklch(0.78 0.18 68)",
                  boxShadow: pulse
                    ? "0 0 5px oklch(0.78 0.18 68 / 0.8)"
                    : "none",
                  transition: "box-shadow 0.2s",
                }}
              />
            ),
          )}
          <span
            className="font-mono text-[6px] ml-1"
            style={{ color: "oklch(0.40 0.03 280)" }}
          >
            {organism.colonelKernels}× COLONEL
          </span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.65 0.18 200)",
              animation: "heartbeat-micro 873ms ease-in-out infinite",
            }}
          />
          <span
            className="font-mono text-[6px]"
            style={{ color: "oklch(0.45 0.08 200)" }}
          >
            873ms
          </span>
        </div>
      </div>

      {/* Uses */}
      <div className="flex flex-col gap-1 mb-3 relative z-10">
        {visibleUses.map((use) => (
          <div key={use} className="flex items-start gap-1.5">
            <span
              className="font-mono text-[6px] mt-0.5 flex-shrink-0"
              style={{ color }}
            >
              ▸
            </span>
            <span
              className="font-mono text-[7px] leading-tight"
              style={{ color: "oklch(0.55 0.04 280)" }}
            >
              {use}
            </span>
          </div>
        ))}
        {extraCount > 0 && (
          <span
            className="font-mono text-[6px] pl-3"
            style={{ color: "oklch(0.38 0.04 280)" }}
          >
            +{extraCount} more
          </span>
        )}
      </div>

      {/* Install / Uninstall button */}
      <button
        type="button"
        className="w-full py-1.5 font-mono text-[7px] tracking-widest font-bold border transition-all relative z-10"
        style={{
          background: organism.deployed
            ? `${color.replace(")", " / 0.18)")}`
            : isInstalling
              ? "oklch(0.78 0.18 68 / 0.08)"
              : "transparent",
          borderColor: organism.deployed
            ? color
            : isInstalling
              ? "oklch(0.78 0.18 68 / 0.6)"
              : "oklch(0.22 0.022 280)",
          color: organism.deployed
            ? color
            : isInstalling
              ? "oklch(0.78 0.18 68)"
              : "oklch(0.42 0.04 280)",
          cursor: isInstalling ? "wait" : "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isInstalling) return;
          organism.deployed ? onUninstall(organism.id) : onInstall(organism.id);
        }}
        disabled={isInstalling}
        data-ocid={
          organism.deployed
            ? `marketplace.uninstall_button.${organism.phiIndex}`
            : `marketplace.install_button.${organism.phiIndex}`
        }
      >
        {organism.deployed
          ? "◉ INSTALLED · ACTIVE"
          : isInstalling
            ? "⟳ INSTALLING…"
            : "◎ INSTALL SKAI"}
      </button>

      <style>{`
        @keyframes heartbeat-micro {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </button>
  );
}

// ─── Marketplace Panel ────────────────────────────────────────────────────────

export function SKAIMarketplacePanel() {
  const { pulse } = useHeartbeatPulse();
  // useInstalledSkais provides live backend registry — if it returns data, use it
  // Otherwise fall back to useSKAIRegistry (local + backend hybrid)
  const { data: registry = [], isLoading } = useSKAIRegistry();
  const deployMutation = useDeploySKAI();
  const undeployMutation = useUndeploySKAI();

  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState<SKAIFamily | "ALL">("ALL");
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [detailOrganism, setDetailOrganism] = useState<SKAIOrganism | null>(
    null,
  );
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastCounter = useRef(0);

  const addToast = useCallback((text: string, type: "ok" | "err") => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5000,
    );
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleInstall = useCallback(
    async (id: string) => {
      setInstallingId(id);
      try {
        await deployMutation.mutateAsync(id);
        addToast("SKAI installed — GENESIS_CALL complete", "ok");
      } catch {
        addToast("Install failed — try again", "err");
      } finally {
        setInstallingId(null);
      }
    },
    [deployMutation, addToast],
  );

  const handleUninstall = useCallback(
    async (id: string) => {
      try {
        await undeployMutation.mutateAsync(id);
        addToast("SKAI uninstalled", "ok");
      } catch {
        addToast("Uninstall failed — try again", "err");
      }
    },
    [undeployMutation, addToast],
  );

  const families: (SKAIFamily | "ALL")[] = [
    "ALL",
    "Platform",
    "Swarm",
    "Domain",
    "Micro",
    "Fusion",
  ];

  const filtered = registry.filter((o) => {
    const matchFamily = familyFilter === "ALL" || o.family === familyFilter;
    const matchSearch =
      !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.latinName.toLowerCase().includes(search.toLowerCase()) ||
      o.uses.some((u) => u.toLowerCase().includes(search.toLowerCase()));
    return matchFamily && matchSearch;
  });

  const installedCount = registry.filter((o) => o.deployed).length;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="marketplace.panel"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-3 border-b flex items-center justify-between"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "oklch(0.65 0.18 240)",
              boxShadow: pulse ? "0 0 10px oklch(0.65 0.18 240 / 0.9)" : "none",
              transition: "box-shadow 0.3s",
            }}
          />
          <div>
            <div
              className="font-display text-sm font-bold tracking-widest"
              style={{ color: "oklch(0.90 0.04 280)" }}
            >
              SKAI MARKETPLACE
            </div>
            <div
              className="font-mono text-[7px] tracking-widest mt-0.5"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              FORUM ORGANISMI · ONE-CLICK SOVEREIGN INSTALL
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div
              className="font-mono text-[9px] font-bold"
              style={{ color: "oklch(0.68 0.19 150)" }}
            >
              {installedCount} INSTALLED
            </div>
            <div
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              / {registry.length} TOTAL · 51 AVAILABLE
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b flex items-center gap-3 flex-wrap"
        style={{
          background: "oklch(0.07 0.009 280)",
          borderColor: "oklch(0.16 0.018 280)",
        }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Input
            placeholder="Search SKAIs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="font-mono text-[10px] tracking-wider h-7 pl-3 border-[oklch(0.20_0.02_280)] bg-transparent text-[oklch(0.82_0.02_280)] placeholder:text-[oklch(0.30_0.02_280)] focus-visible:ring-[oklch(0.65_0.18_240)]"
            data-ocid="marketplace.search_input"
          />
        </div>

        {/* Family filters */}
        <div className="flex items-center gap-1 overflow-x-auto flex-shrink-0">
          {families.map((fam) => {
            const isActive = familyFilter === fam;
            const color =
              fam === "ALL"
                ? "oklch(0.78 0.18 68)"
                : FAMILY_COLOR[fam as SKAIFamily];
            return (
              <button
                key={fam}
                type="button"
                className="flex-shrink-0 font-mono text-[7px] tracking-wider px-2 py-1 border transition-all"
                style={{
                  background: isActive
                    ? `${color.replace(")", " / 0.13)")}`
                    : "transparent",
                  borderColor: isActive ? color : "oklch(0.20 0.02 280)",
                  color: isActive ? color : "oklch(0.38 0.03 280)",
                }}
                onClick={() => setFamilyFilter(fam)}
                data-ocid={`marketplace.filter.${fam.toLowerCase()}`}
              >
                {fam.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[
              "s1",
              "s2",
              "s3",
              "s4",
              "s5",
              "s6",
              "s7",
              "s8",
              "s9",
              "s10",
              "s11",
              "s12",
            ].map((k) => (
              <CardSkeleton key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 border"
            style={{ borderColor: "oklch(0.17 0.018 280)" }}
            data-ocid="marketplace.empty_state"
          >
            <div
              className="font-mono text-2xl mb-3"
              style={{ color: "oklch(0.25 0.02 280)" }}
            >
              ◌
            </div>
            <div
              className="font-mono text-[9px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              NO SKAI ORGANISMS FOUND
            </div>
            <button
              type="button"
              className="mt-4 font-mono text-[8px] tracking-widest px-4 py-2 border transition-colors"
              style={{
                borderColor: "oklch(0.65 0.18 240 / 0.5)",
                color: "oklch(0.65 0.18 240)",
              }}
              onClick={() => {
                setSearch("");
                setFamilyFilter("ALL");
              }}
              data-ocid="marketplace.clear_filters_button"
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {/* Onboarding Gateway card always first (phiIndex === 51) */}
            {filtered
              .filter((o) => o.phiIndex === 51)
              .map((org) => (
                <OnboardingGatewayCard
                  key={org.id}
                  organism={org}
                  pulse={pulse}
                  installingId={installingId}
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onOpenDetail={setDetailOrganism}
                />
              ))}
            {/* All other organisms */}
            {filtered
              .filter((o) => o.phiIndex !== 51)
              .map((org) => (
                <SKAICard
                  key={org.id}
                  organism={org}
                  pulse={pulse}
                  installingId={installingId}
                  onInstall={handleInstall}
                  onUninstall={handleUninstall}
                  onOpenDetail={setDetailOrganism}
                />
              ))}
          </div>
        )}
      </div>

      {/* Footer attribution */}
      <div
        className="flex-shrink-0 px-5 py-1.5 border-t flex items-center justify-between"
        style={{
          borderColor: "oklch(0.14 0.015 278)",
          background: "oklch(0.07 0.009 280)",
        }}
      >
        <span
          className="font-mono text-[7px] tracking-widest"
          style={{ color: "oklch(0.25 0.02 280)" }}
        >
          ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · PHI = 1.618033988
        </span>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.22 0.02 280)" }}
        >
          TAFT · ALWAYS-ON · 873ms
        </span>
      </div>

      {/* Toast stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-24 right-4 z-[200] flex flex-col gap-2">
          {toasts.map((msg) => (
            <Toast key={msg.id} msg={msg} onDismiss={dismissToast} />
          ))}
        </div>
      )}

      {/* Detail panel */}
      <SKAIDetailPanel
        organism={detailOrganism}
        onClose={() => setDetailOrganism(null)}
        onInstall={handleInstall}
        onUninstall={handleUninstall}
        installingId={installingId}
        pulse={pulse}
      />
    </div>
  );
}
