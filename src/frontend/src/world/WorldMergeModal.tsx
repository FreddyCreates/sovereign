/**
 * ════════════════════════════════════════════════════════════════
 * WorldMergeModal — Select two worlds, preview merged coherence,
 * execute merge via actor.mergeWorldInstances()
 * Combined coherence = Score1 + Score2 × PHI
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN
 * ════════════════════════════════════════════════════════════════
 */

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { WorldInstanceEntry } from "../hooks/useWorldInstances";
const PHI = 1.618_033_988_749_895;

interface WorldMergeModalProps {
  open: boolean;
  onClose: () => void;
  worlds: WorldInstanceEntry[];
  preSelectedIds?: [bigint, bigint] | null;
  onMerge: (sourceId: bigint, targetId: bigint) => Promise<bigint | null>;
}

function WorldCard({
  entry,
  selected,
  onSelect,
}: {
  entry: WorldInstanceEntry;
  selected: boolean;
  onSelect: () => void;
}) {
  const label = `W-${entry.worldId.toString().slice(-6).padStart(6, "0")}`;
  return (
    <button
      type="button"
      className={`w-full text-left border p-2.5 transition-colors ${
        selected
          ? "border-[oklch(0.65_0.18_240_/_0.6)] bg-[oklch(0.65_0.18_240_/_0.08)]"
          : "border-[oklch(0.18_0.02_280)] hover:border-[oklch(0.30_0.02_280)]"
      }`}
      onClick={onSelect}
      data-ocid={`merge_modal.world_select.${entry.worldId.toString().slice(-4)}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[8px] text-white font-bold">
          {label}
        </span>
        {selected && (
          <span className="font-mono text-[6px] text-[oklch(0.65_0.18_240)]">
            SELECTED
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          READINESS:{" "}
          <span className="text-white">
            {(entry.state.doctrineReadiness * 100).toFixed(0)}%
          </span>
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          SEALS:{" "}
          <span className="text-[oklch(0.75_0.16_70)]">
            {Number(entry.state.artifactSealCount)}
          </span>
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          ACTORS:{" "}
          <span className="text-[oklch(0.65_0.18_240)]">
            {entry.state.actorPositions.length}
          </span>
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          PHYSICS:{" "}
          <span className="text-white/60">
            {(entry.state.physicsEnergy * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </button>
  );
}

export function WorldMergeModal({
  open,
  onClose,
  worlds,
  preSelectedIds,
  onMerge,
}: WorldMergeModalProps) {
  const [sourceId, setSourceId] = useState<bigint | null>(
    preSelectedIds?.[0] ?? null,
  );
  const [targetId, setTargetId] = useState<bigint | null>(
    preSelectedIds?.[1] ?? null,
  );
  const [isMerging, setIsMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState<bigint | null>(null);
  const [mergeError, setMergeError] = useState<string | null>(null);

  const sourceWorld = worlds.find((w) => w.worldId === sourceId);
  const targetWorld = worlds.find((w) => w.worldId === targetId);

  // Combined coherence formula: Score1 + Score2 × PHI
  const combinedCoherence =
    sourceWorld && targetWorld
      ? sourceWorld.state.doctrineReadiness +
        targetWorld.state.doctrineReadiness * PHI
      : null;

  const combinedArtifacts =
    sourceWorld && targetWorld
      ? Number(sourceWorld.state.artifactSealCount) +
        Number(targetWorld.state.artifactSealCount)
      : null;

  const canMerge =
    sourceId !== null &&
    targetId !== null &&
    sourceId !== targetId &&
    !isMerging &&
    !mergeResult;

  const handleMerge = async () => {
    if (!sourceId || !targetId) return;
    setIsMerging(true);
    setMergeError(null);
    try {
      const result = await onMerge(sourceId, targetId);
      if (result !== null) {
        setMergeResult(result);
      } else {
        setMergeError("Merge failed — check world states");
      }
    } catch {
      setMergeError("Merge execution error");
    } finally {
      setIsMerging(false);
    }
  };

  const handleClose = () => {
    setSourceId(preSelectedIds?.[0] ?? null);
    setTargetId(preSelectedIds?.[1] ?? null);
    setMergeResult(null);
    setMergeError(null);
    onClose();
  };

  const availableWorlds = worlds.filter((w) => !w.state.isArchived);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-lg bg-[oklch(0.07_0.009_280)] border-[oklch(0.20_0.02_280)] p-0"
        data-ocid="world.merge_modal.dialog"
      >
        <DialogTitle className="sr-only">Merge World Instances</DialogTitle>

        {/* Header */}
        <div className="px-4 py-3 border-b border-[oklch(0.18_0.02_280)]">
          <div className="font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)] font-bold">
            ⊕ WORLD MERGE PROTOCOL
          </div>
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-0.5">
            COMBINED COHERENCE = SCORE₁ + SCORE₂ × Φ
          </div>
        </div>

        <div className="p-4 space-y-4">
          <AnimatePresence mode="wait">
            {mergeResult ? (
              /* Success state */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-3"
                data-ocid="world.merge_modal.success_state"
              >
                <motion.div
                  className="font-mono text-[10px] text-[oklch(0.75_0.16_70)] tracking-widest"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.6, repeat: 3 }}
                >
                  ◆ MERGE EXECUTED — WORLD UNIFIED
                </motion.div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
                  NEW WORLD ID
                </div>
                <div className="font-mono text-xl font-bold text-white">
                  W-{mergeResult.toString().slice(-6).padStart(6, "0")}
                </div>
                {combinedCoherence !== null && (
                  <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)]">
                    COMPOUND COHERENCE → {combinedCoherence.toFixed(4)}
                  </div>
                )}
                <button
                  type="button"
                  className="font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-white/60 hover:text-white px-4 py-2 mt-2 transition-colors"
                  onClick={handleClose}
                  data-ocid="world.merge_modal.close_button"
                >
                  CLOSE
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* World selection */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Source */}
                  <div className="space-y-1.5">
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                      SOURCE WORLD
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {availableWorlds.map((w) => (
                        <WorldCard
                          key={w.worldId.toString()}
                          entry={w}
                          selected={w.worldId === sourceId}
                          onSelect={() => setSourceId(w.worldId)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Target */}
                  <div className="space-y-1.5">
                    <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
                      TARGET WORLD
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {availableWorlds.map((w) => (
                        <WorldCard
                          key={w.worldId.toString()}
                          entry={w}
                          selected={w.worldId === targetId}
                          onSelect={() => setTargetId(w.worldId)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {combinedCoherence !== null && canMerge && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-[oklch(0.65_0.18_240_/_0.3)] bg-[oklch(0.65_0.18_240_/_0.04)] p-3 space-y-2"
                    data-ocid="world.merge_modal.preview"
                  >
                    <div className="font-mono text-[7px] text-[oklch(0.65_0.18_240)] tracking-widest">
                      MERGE PREVIEW
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)]">
                          COMBINED COHERENCE
                        </div>
                        <div className="font-mono text-[11px] text-[oklch(0.75_0.16_70)] font-bold">
                          {combinedCoherence.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)]">
                          COMBINED SEALS
                        </div>
                        <div className="font-mono text-[11px] text-[oklch(0.75_0.16_70)] font-bold">
                          {combinedArtifacts}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-[6px] text-[oklch(0.35_0.03_280)]">
                      {(sourceWorld?.state.doctrineReadiness ?? 0).toFixed(3)} +{" "}
                      {(targetWorld?.state.doctrineReadiness ?? 0).toFixed(3)} ×
                      Φ ({PHI.toFixed(6)})
                    </div>
                  </motion.div>
                )}

                {/* Error state */}
                {mergeError && (
                  <div
                    className="font-mono text-[7px] text-[oklch(0.62_0.22_25)] border border-[oklch(0.62_0.22_25_/_0.3)] px-3 py-2"
                    data-ocid="world.merge_modal.error_state"
                  >
                    ⚠ {mergeError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 font-mono text-[8px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white py-2 transition-colors"
                    onClick={handleClose}
                    data-ocid="world.merge_modal.cancel_button"
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    disabled={!canMerge}
                    className={`flex-1 font-mono text-[8px] tracking-widest border py-2 transition-colors ${
                      canMerge
                        ? "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.06)]"
                        : "border-[oklch(0.18_0.02_280)] text-[oklch(0.25_0.02_280)] cursor-not-allowed"
                    }`}
                    onClick={handleMerge}
                    data-ocid="world.merge_modal.confirm_button"
                  >
                    {isMerging ? (
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{
                          duration: 0.873,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        MERGING…
                      </motion.span>
                    ) : (
                      "EXECUTE MERGE"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
