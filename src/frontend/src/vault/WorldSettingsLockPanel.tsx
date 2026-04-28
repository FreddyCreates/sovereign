/**
 * WorldSettingsLockPanel.tsx — WORLD_SETTINGS_LOCK
 * Live governance display — world params from backend, lock/unlock mutations
 * Wired to useWorldParams() + useLockWorldParam() + useUnlockWorldParam()
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useState } from "react";
import {
  type WorldParamEntry,
  useAttemptWorldParamMutation,
  useInfrastructureLock,
  useLockWorldParam,
  useUnlockWorldParam,
  useWorldParams,
} from "../hooks/useQueries";

const RED = "oklch(0.62 0.22 25)";
const GREEN = "oklch(0.68 0.19 145)";
const AMBER = "oklch(0.78 0.18 55)";
const DIM = "oklch(0.32 0.03 280)";

function LockBadge({ locked }: { locked: boolean }) {
  return (
    <span
      className="font-mono text-[7px] tracking-widest px-2 py-0.5 flex-shrink-0"
      style={{
        background: locked
          ? "oklch(0.62 0.22 25 / 0.10)"
          : "oklch(0.68 0.19 145 / 0.10)",
        border: `1px solid ${locked ? "oklch(0.62 0.22 25 / 0.40)" : "oklch(0.68 0.19 145 / 0.40)"}`,
        color: locked ? RED : GREEN,
      }}
    >
      {locked ? "🔒 LOCKED" : "🔓 UNLOCKED"}
    </span>
  );
}

function ParamRow({ param }: { param: WorldParamEntry }) {
  const [editValue, setEditValue] = useState(String(param.value));
  const attemptMutation = useAttemptWorldParamMutation();
  const lockParam = useLockWorldParam();
  const unlockParam = useUnlockWorldParam();

  const isAutoLocked =
    param.is_locked && param.lock_reason.toLowerCase().includes("auto");
  const beatsSinceLock =
    param.is_locked && param.locked_beat > 0 ? param.locked_beat : null;

  function handleAttemptMutation() {
    const val = Number.parseFloat(editValue);
    if (Number.isNaN(val)) return;
    attemptMutation.mutate({ name: param.name, value: val });
  }

  return (
    <div
      className="border-b"
      style={{ borderColor: "oklch(0.14 0.015 280)" }}
      data-ocid={`settings_lock.param.${param.name.toLowerCase()}`}
    >
      <div
        className="flex items-start gap-3 px-4 py-3"
        style={{
          background: param.is_locked
            ? "oklch(0.085 0.01 280)"
            : "oklch(0.075 0.009 280)",
        }}
      >
        {/* Name + lock reason */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className="font-mono text-[9px] font-bold"
              style={{
                color: param.is_locked ? AMBER : "oklch(0.72 0.08 280)",
              }}
            >
              {param.name}
            </span>
            <LockBadge locked={param.is_locked} />
          </div>
          {param.is_locked && param.lock_reason && (
            <div
              className="font-mono text-[7px] leading-relaxed mb-1"
              style={{
                color: isAutoLocked ? RED : AMBER,
              }}
            >
              {isAutoLocked
                ? "AUTO-LOCKED — Anomaly Recovery in Progress"
                : param.lock_reason}
            </div>
          )}
          {beatsSinceLock !== null && (
            <div className="font-mono text-[6px]" style={{ color: DIM }}>
              LOCKED AT BEAT #{beatsSinceLock}
            </div>
          )}
        </div>

        {/* Current value + edit */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 min-w-[120px]">
          <input
            type="number"
            value={param.is_locked ? String(param.value) : editValue}
            onChange={(e) => setEditValue(e.target.value)}
            disabled={param.is_locked}
            className="font-mono text-sm font-bold w-full text-right bg-transparent outline-none border-b pb-0.5 transition-colors"
            style={{
              color: param.is_locked
                ? "oklch(0.40 0.04 280)"
                : "oklch(0.82 0.12 200)",
              borderColor: param.is_locked
                ? "oklch(0.16 0.018 280)"
                : "oklch(0.65 0.18 200 / 0.40)",
              cursor: param.is_locked ? "not-allowed" : "text",
            }}
            readOnly={param.is_locked}
            aria-label={`Value for ${param.name}`}
            data-ocid={`settings_lock.param_input.${param.name.toLowerCase()}`}
          />

          {/* Action buttons */}
          <div className="flex gap-1.5">
            {!param.is_locked && (
              <>
                <button
                  type="button"
                  className="font-mono text-[6px] tracking-widest px-2 py-1 border transition-all hover:opacity-80 disabled:opacity-30"
                  style={{
                    color: "oklch(0.65 0.18 200)",
                    borderColor: "oklch(0.65 0.18 200 / 0.35)",
                    background: "oklch(0.65 0.18 200 / 0.06)",
                  }}
                  onClick={handleAttemptMutation}
                  disabled={attemptMutation.isPending}
                  data-ocid={`settings_lock.mutate_button.${param.name.toLowerCase()}`}
                >
                  {attemptMutation.isPending ? "..." : "⊡ APPLY"}
                </button>
                <button
                  type="button"
                  className="font-mono text-[6px] tracking-widest px-2 py-1 border transition-all hover:opacity-80 disabled:opacity-30"
                  style={{
                    color: RED,
                    borderColor: `${RED.replace(")", " / 0.35)")}`,
                    background: `${RED.replace(")", " / 0.06)")}`,
                  }}
                  onClick={() => lockParam.mutate(param.name)}
                  disabled={lockParam.isPending}
                  data-ocid={`settings_lock.lock_button.${param.name.toLowerCase()}`}
                >
                  🔒
                </button>
              </>
            )}
            {param.is_locked && !isAutoLocked && (
              <button
                type="button"
                className="font-mono text-[6px] tracking-widest px-2 py-1 border transition-all hover:opacity-80 disabled:opacity-30"
                style={{
                  color: GREEN,
                  borderColor: `${GREEN.replace(")", " / 0.35)")}`,
                  background: `${GREEN.replace(")", " / 0.06)")}`,
                }}
                onClick={() => unlockParam.mutate(param.name)}
                disabled={unlockParam.isPending}
                data-ocid={`settings_lock.unlock_button.${param.name.toLowerCase()}`}
              >
                🔓 UNLOCK
              </button>
            )}
          </div>

          {/* Mutation feedback */}
          {attemptMutation.isSuccess && !param.is_locked && (
            <span
              className="font-mono text-[6px]"
              style={{ color: GREEN }}
              data-ocid="settings_lock.success_state"
            >
              ✓ APPLIED
            </span>
          )}
          {attemptMutation.isError && (
            <span
              className="font-mono text-[6px]"
              style={{ color: RED }}
              data-ocid="settings_lock.error_state"
            >
              ✕ REJECTED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LockSummaryBar({
  params,
  isGloballyLocked,
  lockReason,
  governingLaw,
}: {
  params: WorldParamEntry[];
  isGloballyLocked: boolean;
  lockReason: string;
  governingLaw: string;
}) {
  const lockedCount = params.filter((p) => p.is_locked).length;
  const lockColors = isGloballyLocked
    ? {
        accent: RED,
        bg: "oklch(0.62 0.22 25 / 0.08)",
        border: "oklch(0.62 0.22 25 / 0.35)",
      }
    : {
        accent: GREEN,
        bg: "oklch(0.68 0.19 145 / 0.08)",
        border: "oklch(0.68 0.19 145 / 0.35)",
      };

  return (
    <div
      className="flex items-center gap-4 px-5 py-3 border-b"
      style={{
        background: lockColors.bg,
        borderColor: lockColors.border,
      }}
      data-ocid="settings_lock.state_indicator"
    >
      <div
        className="text-3xl"
        style={{
          filter: `drop-shadow(0 0 14px ${isGloballyLocked ? "oklch(0.62 0.22 25 / 0.6)" : "oklch(0.68 0.19 145 / 0.6)"})`,
        }}
      >
        {isGloballyLocked ? "🔒" : "🔓"}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="font-display text-xl font-bold tracking-widest"
          style={{ color: lockColors.accent }}
        >
          {isGloballyLocked ? "LOCKED" : "UNLOCKED"}
        </div>
        <div
          className="font-mono text-[7px] tracking-widest"
          style={{ color: DIM }}
        >
          {lockedCount}/{params.length} PARAMS LOCKED · GOVERNING LAW:{" "}
          {governingLaw}
        </div>
        {isGloballyLocked && lockReason && (
          <div className="font-mono text-[7px] mt-1" style={{ color: AMBER }}>
            {lockReason}
          </div>
        )}
      </div>
    </div>
  );
}

export function WorldSettingsLockPanel() {
  const { data: params = [] } = useWorldParams();
  const { data: infraLock } = useInfrastructureLock();
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [dialogConfirmed, setDialogConfirmed] = useState(false);

  const isGloballyLocked = infraLock?.isLocked ?? false;
  const lockReason = infraLock?.lockReason ?? "";
  const governingLaw = infraLock?.governingLaw ?? "LEX_CUSTODIAE";
  const stableBeats = infraLock?.consecutiveStableBeats ?? 0;
  const beatsRequired = infraLock?.stableBeatsToRelease ?? 100;
  const progressPct = Math.min(
    100,
    (stableBeats / Math.max(1, beatsRequired)) * 100,
  );

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "oklch(0.06 0.008 280)" }}
      data-ocid="settings_lock.page"
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b"
        style={{
          background: "oklch(0.09 0.01 280)",
          borderColor: "oklch(0.20 0.02 280)",
        }}
        data-ocid="settings_lock.header"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: isGloballyLocked ? RED : GREEN }}>⊡</span>
          <span
            className="font-display text-sm font-bold tracking-widest"
            style={{ color: isGloballyLocked ? RED : GREEN }}
          >
            WORLD SETTINGS LOCK
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[7px]" style={{ color: DIM }}>
            {params.length} PARAMS · 873ms SYNC
          </span>
          {isGloballyLocked && (
            <button
              type="button"
              className="font-mono text-[7px] tracking-widest px-3 py-1 border transition-all hover:opacity-80"
              style={{
                color: AMBER,
                borderColor: "oklch(0.78 0.18 55 / 0.40)",
                background: "oklch(0.78 0.18 55 / 0.06)",
              }}
              onClick={() => setShowUnlockDialog(true)}
              data-ocid="settings_lock.manual_unlock_button"
            >
              ⊡ MANUAL UNLOCK
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {/* Lock Summary Bar */}
        <LockSummaryBar
          params={params}
          isGloballyLocked={isGloballyLocked}
          lockReason={lockReason}
          governingLaw={governingLaw}
        />

        {/* Auto-release progress (when locked) */}
        {isGloballyLocked && (
          <div
            className="px-5 py-3 border-b"
            style={{
              background: "oklch(0.08 0.01 280)",
              borderColor: "oklch(0.16 0.018 280)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[7px] flex-shrink-0 tracking-widest"
                style={{ color: DIM }}
              >
                AUTO-RELEASE PROGRESS
              </span>
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "oklch(0.14 0.015 280)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPct}%`,
                    background:
                      "linear-gradient(90deg, oklch(0.62 0.22 25), oklch(0.68 0.19 145))",
                    boxShadow: "0 0 6px oklch(0.68 0.19 145 / 0.5)",
                    transitionDuration: "873ms",
                  }}
                />
              </div>
              <span
                className="font-mono text-[7px] flex-shrink-0"
                style={{ color: "oklch(0.40 0.04 280)" }}
              >
                {stableBeats}/{beatsRequired} STABLE BEATS
              </span>
              <span
                className="font-mono text-[8px] font-bold flex-shrink-0"
                style={{ color: "oklch(0.65 0.18 200)" }}
              >
                {progressPct.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {/* Params Table */}
        <div className="px-0 pb-4">
          <div
            className="font-mono text-[7px] tracking-widest px-5 py-2.5 border-b"
            style={{
              color: DIM,
              background: "oklch(0.075 0.009 280)",
              borderColor: "oklch(0.16 0.018 280)",
            }}
          >
            WORLD PARAMETERS · {params.filter((p) => p.is_locked).length} LOCKED
            / {params.length} TOTAL
          </div>
          <div
            className="border-b"
            style={{ borderColor: "oklch(0.16 0.018 280)" }}
            data-ocid="settings_lock.params_list"
          >
            {params.map((param) => (
              <ParamRow key={param.name} param={param} />
            ))}
          </div>
          {params.length === 0 && (
            <div
              className="flex items-center justify-center py-12"
              data-ocid="settings_lock.empty_state"
            >
              <span className="font-mono text-[8px]" style={{ color: DIM }}>
                NO WORLD PARAMS — BACKEND NOT YET RETURNING DATA
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Manual Unlock Dialog */}
      {showUnlockDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0 0 0 / 0.72)" }}
          onClick={() => setShowUnlockDialog(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowUnlockDialog(false)}
          aria-label="Manual unlock confirmation dialog"
          data-ocid="settings_lock.dialog"
        >
          <div
            className="flex flex-col p-6 gap-4 max-w-sm w-full mx-4"
            style={{
              background: "oklch(0.09 0.012 280)",
              border: "1px solid oklch(0.62 0.22 25 / 0.5)",
              boxShadow: "0 0 40px oklch(0.62 0.22 25 / 0.14)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div>
              <div
                className="font-display text-base font-bold tracking-widest mb-1"
                style={{ color: RED }}
              >
                ⚠ CONFIRM MANUAL UNLOCK
              </div>
              <p
                className="font-mono text-[8px] leading-relaxed"
                style={{ color: "oklch(0.42 0.05 280)" }}
              >
                Manually unlocking the WORLD_SETTINGS_LOCK will override the
                governing law ({governingLaw}) and allow settings mutations.
                This action is sealed as a narrative event in the doctrine
                field.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 font-mono text-[8px] tracking-widest px-4 py-2 border transition-all hover:opacity-80"
                style={{
                  color: RED,
                  borderColor: "oklch(0.62 0.22 25 / 0.5)",
                  background: "oklch(0.62 0.22 25 / 0.08)",
                }}
                onClick={() => {
                  setDialogConfirmed(true);
                  setShowUnlockDialog(false);
                }}
                data-ocid="settings_lock.confirm_button"
              >
                ⊡ CONFIRM UNLOCK
              </button>
              <button
                type="button"
                className="flex-1 font-mono text-[8px] tracking-widest px-4 py-2 border transition-all hover:opacity-80"
                style={{
                  color: "oklch(0.38 0.04 280)",
                  borderColor: "oklch(0.20 0.022 280)",
                }}
                onClick={() => setShowUnlockDialog(false)}
                data-ocid="settings_lock.cancel_button"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed banner */}
      {dialogConfirmed && (
        <div
          className="flex-shrink-0 px-5 py-2 flex items-center gap-3 border-t"
          style={{
            background: "oklch(0.68 0.19 145 / 0.08)",
            borderColor: "oklch(0.68 0.19 145 / 0.30)",
          }}
          data-ocid="settings_lock.success_state"
        >
          <span className="font-mono text-[8px]" style={{ color: GREEN }}>
            ✓ MANUAL UNLOCK INITIATED — DOCTRINE EVENT SEALED
          </span>
          <button
            type="button"
            className="ml-auto font-mono text-[7px] opacity-50 hover:opacity-100"
            style={{ color: DIM }}
            onClick={() => setDialogConfirmed(false)}
            data-ocid="settings_lock.close_button"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
