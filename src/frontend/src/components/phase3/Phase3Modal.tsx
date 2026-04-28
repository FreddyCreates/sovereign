/**
 * Phase3Modal — Full-screen overlay with all 4 Phase 3 panels
 *
 * 2×2 grid on desktop, single column on mobile
 * AnimalEnginesPanel | OmnisPanel
 * GovernancePanel    | CivilizationPanel
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { AnimalEnginesPanel } from "./AnimalEnginesPanel";
import { CivilizationPanel } from "./CivilizationPanel";
import { GovernancePanel } from "./GovernancePanel";
import { OmnisPanel } from "./OmnisPanel";

interface Phase3ModalProps {
  open: boolean;
  onClose: () => void;
  currentBeat?: bigint;
}

export function Phase3Modal({
  open,
  onClose,
  currentBeat = 0n,
}: Phase3ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col bg-[oklch(0.06_0.008_280)]"
      data-ocid="phase3.modal"
    >
      {/* Header bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 h-11 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)]">
        <div className="flex items-center gap-3">
          <div className="font-mono text-[10px] font-bold tracking-[0.2em] text-white">
            ORGANISM CORE
          </div>
          <div className="hidden sm:block font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
            PHASE 3 · ANIMAL ENGINES · OMNIS · GOVERNANCE · CIVILIZATION
          </div>
        </div>
        <button
          type="button"
          aria-label="Close Phase 3 panel"
          className="flex items-center justify-center w-7 h-7 border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 transition-colors"
          onClick={onClose}
          data-ocid="phase3.close_button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panels grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[oklch(0.20_0.02_280)]">
          {/* Top-left: Animal Engines */}
          <div
            className="p-4 sm:p-5 border-b border-[oklch(0.20_0.02_280)]"
            data-ocid="phase3.animal_engines"
          >
            <AnimalEnginesPanel currentBeat={currentBeat} />
          </div>

          {/* Top-right: OMNIS */}
          <div
            className="p-4 sm:p-5 border-b border-[oklch(0.20_0.02_280)]"
            data-ocid="phase3.omnis"
          >
            <OmnisPanel />
          </div>

          {/* Bottom-left: Governance */}
          <div className="p-4 sm:p-5" data-ocid="phase3.governance">
            <GovernancePanel />
          </div>

          {/* Bottom-right: Civilization */}
          <div className="p-4 sm:p-5" data-ocid="phase3.civilization">
            <CivilizationPanel />
          </div>
        </div>
      </ScrollArea>

      {/* Footer strip */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-2 border-t border-[oklch(0.20_0.02_280)] bg-[oklch(0.07_0.01_280)]">
        <div className="font-mono text-[7px] text-white/10 tracking-widest text-center">
          ALL DATA LIVE FROM BACKEND CANISTER · PHI=1.6180339887 · S₀=0.75 · ©
          ALFREDO MEDINA HERNANDEZ
        </div>
      </div>
    </div>
  );
}
