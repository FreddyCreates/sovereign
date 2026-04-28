/**
 * CivilizationPanel — Civilization Coupling IoT extended phenotype display
 *
 * All values from useCivilizationState() + useSubmitIoTSignal()
 * No fake data. All math is live from the backend.
 *
 * Also exports useIoTIntensity — a hook returning iotIntensity [0.0–2.0]
 * derived from coupling strength + active signal count, used by VISIONARY
 * and COMPOSER to modulate visual and audio intensity.
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import { Globe } from "lucide-react";
import { useMemo } from "react";
import type { IoTSignalType } from "../../backend";
import {
  useCivilizationState,
  useSubmitIoTSignal,
} from "../../hooks/useQueries";

// ─── Signal type config ────────────────────────────────────────────────────

const SIGNAL_STYLES: Record<IoTSignalType, { color: string; label: string }> = {
  thermal: { color: "oklch(0.7 0.15 45)", label: "THERMAL" },
  electromagnetic: { color: "oklch(0.7 0.15 268)", label: "EM" },
  acoustic: { color: "oklch(0.7 0.15 310)", label: "ACOUSTIC" },
  kinetic: { color: "oklch(0.7 0.15 132)", label: "KINETIC" },
  photonic: { color: "oklch(0.8 0.15 85)", label: "PHOTONIC" },
  chemical: { color: "oklch(0.7 0.15 185)", label: "CHEMICAL" },
  pressure: { color: "oklch(0.7 0.15 25)", label: "PRESSURE" },
  magnetic: { color: "oklch(0.6 0.15 275)", label: "MAGNETIC" },
};

function archTypeLabel(targetDevice: string): string {
  const d = targetDevice.toLowerCase();
  if (d.includes("expan")) return "TYPE 1";
  if (d.includes("recep")) return "TYPE 2";
  if (d.includes("anti") || d.includes("drift")) return "TYPE 3";
  return "TYPE ?";
}

const DEMO_SIGNALS = [
  "THERMAL:0.75:SOVEREIGN_ENV_001",
  "ELECTROMAGNETIC:0.88:SOVEREIGN_FIELD_002",
  "ACOUSTIC:0.62:ORGANISM_PULSE_003",
  "KINETIC:0.91:EXPANSION_NODE_004",
  "PHOTONIC:0.55:DOCTRINE_BEACON_005",
];

let demoSignalIdx = 0;

// ─── useIoTIntensity ──────────────────────────────────────────────────────
//
// Returns iotIntensity in [0.0, 2.0]:
//   - Baseline: 1.0
//   - Each active signal type adds +0.1 (capped at +0.5)
//   - Coupling strength scales the whole thing: intensity *= (0.5 + couplingStrength * 1.5)

export function useIoTIntensity(): {
  iotIntensity: number;
  activeSignalCount: number;
  couplingStrength: number;
} {
  const { data: civ } = useCivilizationState();

  return useMemo(() => {
    const couplingStrength = civ?.couplingStrength ?? 0;
    const signals = civ?.processedSignals ?? [];

    // Count distinct active signal types in last 5 recent signals
    const recentTypes = new Set(
      [...signals]
        .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
        .slice(0, 5)
        .map((s) => s.signalType),
    );
    const activeSignalCount = recentTypes.size;

    const signalBoost = Math.min(0.5, activeSignalCount * 0.1);
    const rawIntensity = (1.0 + signalBoost) * (0.5 + couplingStrength * 1.5);
    const iotIntensity = Math.min(2.0, Math.max(0.0, rawIntensity));

    return { iotIntensity, activeSignalCount, couplingStrength };
  }, [civ]);
}

// ─── Compact IoT modulation indicator for film generation panel ───────────

export function IoTModulationBadge() {
  const { iotIntensity, activeSignalCount, couplingStrength } =
    useIoTIntensity();

  const intensityPct = Math.round((iotIntensity / 2.0) * 100);
  const intensityColor =
    iotIntensity >= 1.5
      ? "oklch(0.68 0.19 132)"
      : iotIntensity >= 1.0
        ? "oklch(0.65 0.18 240)"
        : "oklch(0.35 0.03 280)";

  return (
    <div
      className="border border-[oklch(0.68_0.19_132_/_0.25)] bg-[oklch(0.68_0.19_132_/_0.03)] px-3 py-2 flex flex-col gap-1"
      data-ocid="iot.modulation.badge"
    >
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[8px] font-bold tracking-widest"
          style={{ color: intensityColor }}
        >
          IoT COUPLING · VISUAL MODULATION
        </span>
        <span
          className="font-mono text-xs font-bold"
          style={{ color: intensityColor }}
        >
          ×{iotIntensity.toFixed(2)}
        </span>
      </div>
      <div className="h-1 bg-white/5">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${intensityPct}%`,
            backgroundColor: intensityColor,
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
          {activeSignalCount} ACTIVE SIGNALS
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
          COUPLING {(couplingStrength * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────

export function CivilizationPanel() {
  const { data: civ } = useCivilizationState();
  const submitSignal = useSubmitIoTSignal();
  const { iotIntensity, activeSignalCount } = useIoTIntensity();

  const couplingStrength = civ?.couplingStrength ?? 0;
  const totalSignals = civ?.totalSignals ?? 0n;
  const signals = civ?.processedSignals ?? [];
  const phenotypes = civ?.phenotypeOutputs ?? [];

  const recentSignals = [...signals]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 5);
  const recentPhenotypes = [...phenotypes]
    .sort((a, b) => Number(b.beat) - Number(a.beat))
    .slice(0, 3);

  function injectDemoSignal() {
    const sig = DEMO_SIGNALS[demoSignalIdx % DEMO_SIGNALS.length];
    demoSignalIdx++;
    submitSignal.mutate(sig);
  }

  return (
    <div className="flex flex-col gap-3" data-ocid="civilization.panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[oklch(0.68_0.19_132)]" />
          <div>
            <div className="font-mono text-[10px] font-bold tracking-widest text-white">
              CIVILIZATION COUPLING
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
              IOT EXTENDED PHENOTYPE · REAL-TIME
            </div>
          </div>
        </div>
        <button
          type="button"
          className="font-mono text-[7px] tracking-widest border border-[oklch(0.68_0.19_132_/_0.4)] text-[oklch(0.68_0.19_132)] px-2 py-1 hover:bg-[oklch(0.68_0.19_132_/_0.08)] transition-colors disabled:opacity-40"
          onClick={injectDemoSignal}
          disabled={submitSignal.isPending}
          data-ocid="civilization.inject_signal"
        >
          {submitSignal.isPending ? "INJECTING..." : "▶ INJECT SIGNAL"}
        </button>
      </div>

      {/* IoT intensity modulation indicator */}
      <div className="border border-[oklch(0.68_0.19_132_/_0.2)] bg-[oklch(0.68_0.19_132_/_0.03)] px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[8px] text-[oklch(0.38_0.08_120)] tracking-widest">
            VISIONARY GLOW INTENSITY
          </span>
          <span className="font-mono text-sm font-bold text-[oklch(0.68_0.19_132)]">
            ×{iotIntensity.toFixed(2)}
          </span>
        </div>
        <div className="h-1.5 bg-white/5">
          <div
            className="h-full bg-[oklch(0.68_0.19_132)] transition-all duration-700"
            style={{ width: `${(iotIntensity / 2.0) * 100}%` }}
          />
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-1 flex items-center justify-between">
          <span>{activeSignalCount} ACTIVE SIGNAL TYPES</span>
          <span>COMPOSER AMP ×{iotIntensity.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupling strength meter */}
      <div className="border border-[oklch(0.68_0.19_132_/_0.3)] bg-[oklch(0.68_0.19_132_/_0.04)] p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[8px] text-[oklch(0.38_0.08_120)] tracking-widest">
            COUPLING STRENGTH
          </span>
          <span className="font-mono text-sm font-bold text-[oklch(0.68_0.19_132)]">
            {(couplingStrength * 100).toFixed(1)}%
          </span>
        </div>
        <div className="h-1.5 bg-white/5">
          <div
            className="h-full bg-[oklch(0.68_0.19_132)] transition-all duration-700"
            style={{ width: `${couplingStrength * 100}%` }}
          />
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] mt-1">
          TOTAL SIGNALS PROCESSED: {String(totalSignals)}
        </div>
      </div>

      {/* Recent IoT signals */}
      {recentSignals.length > 0 && (
        <div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1.5">
            RECENT IoT SIGNALS
          </div>
          <div className="space-y-1.5">
            {recentSignals.map((sig) => {
              const sigStyle = SIGNAL_STYLES[sig.signalType] ?? {
                color: "oklch(1 0 0 / 0.5)",
                label: sig.signalType.toUpperCase(),
              };
              const key = `${sig.signalType}-${String(sig.timestamp)}-${sig.sourceId}`;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between border border-[oklch(0.20_0.02_280)] px-3 py-1.5"
                  data-ocid={`civilization.signal.${sig.sourceId}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[7px] border border-current px-1 py-0.5 tracking-widest"
                      style={{ color: sigStyle.color }}
                    >
                      {sigStyle.label}
                    </span>
                    <span className="font-mono text-[8px] text-white/60">
                      val={sig.value.toFixed(3)}
                    </span>
                  </div>
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    {sig.sourceId}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Extended phenotype outputs */}
      {recentPhenotypes.length > 0 && (
        <div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1.5">
            PHENOTYPE OUTPUTS
          </div>
          <div className="space-y-1.5">
            {recentPhenotypes.map((ph) => (
              <div
                key={`ph-${String(ph.beat)}-${ph.targetDeviceClass}`}
                className="border border-[oklch(0.58_0.16_268_/_0.2)] bg-[oklch(0.58_0.16_268_/_0.03)] px-3 py-2"
                data-ocid={`civilization.phenotype.${ph.targetDeviceClass}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[8px] text-[oklch(0.58_0.16_268)] tracking-widest">
                    {ph.targetDeviceClass.toUpperCase()} ·{" "}
                    {archTypeLabel(ph.targetDeviceClass)}
                  </span>
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    BEAT {String(ph.beat)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    STR:{" "}
                    <span className="text-white/60">
                      {ph.signalStrength.toFixed(3)}
                    </span>
                  </span>
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    FREQ:{" "}
                    <span className="text-white/60">
                      {ph.frequency.toFixed(2)}Hz
                    </span>
                  </span>
                </div>
                <div className="font-mono text-[7px] text-white/30 mt-1 truncate">
                  {ph.payload.slice(0, 60)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentSignals.length === 0 && recentPhenotypes.length === 0 && (
        <div
          className="border border-[oklch(0.20_0.02_280)] p-4 text-center"
          data-ocid="civilization.empty"
        >
          <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
            AWAITING IoT SIGNALS
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-1">
            Press INJECT SIGNAL to feed a demo signal into the coupling
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="font-mono text-[7px] text-white/10 tracking-widest border-t border-white/5 pt-2">
        CIVILIZATION COUPLING · IOT EXTENDED PHENOTYPE · © ALFREDO MEDINA
        HERNANDEZ
      </div>
    </div>
  );
}
