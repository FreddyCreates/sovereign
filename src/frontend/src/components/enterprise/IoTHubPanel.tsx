/**
 * IoTHubPanel — Personal sensory gateway (Civilization Coupling)
 * PHI = 1.6180339887 · S0_FLOOR = 0.75 · © Alfredo Medina Hernandez
 */
import { useCallback, useState } from "react";
import type { ExtendedPhenotypeOutput, ParsedIoTSignal } from "../../backend";
import { IoTSignalType } from "../../backend";
import { useOrganismStateContext } from "../../hooks/useOrganismState";
import {
  useCivilizationState,
  useSubmitIoTSignal,
} from "../../hooks/useQueries";

const S0_FLOOR = 0.75;

// ─── S0 Bar ───────────────────────────────────────────────────────────────────
function S0Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="relative h-1.5 bg-[oklch(0.16_0.018_278)] w-full">
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${Math.min(value * 100, 100)}%`, background: color }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-[oklch(0.75_0.16_70_/_0.7)]"
        style={{ left: `${S0_FLOOR * 100}%` }}
      />
    </div>
  );
}

// ─── Signal Row ───────────────────────────────────────────────────────────────
function SignalRow({
  signal,
  index,
}: {
  signal: ParsedIoTSignal;
  index: number;
}) {
  const typeColor =
    signal.signalType === IoTSignalType.acoustic
      ? "oklch(0.68 0.19 132)"
      : signal.signalType === IoTSignalType.electromagnetic
        ? "oklch(0.65 0.18 240)"
        : "oklch(0.72 0.17 45)";

  const signalTypeLabel = String(signal.signalType).toUpperCase();

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 border-b border-[oklch(0.14_0.015_278)] last:border-0"
      data-ocid={`iot.signal_row.${index}`}
    >
      <div className="flex-shrink-0 pt-1">
        <span
          className="block w-2 h-2 rounded-full animate-pulse"
          style={{ background: typeColor }}
        />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="font-mono text-[9px] text-white leading-relaxed">
          Source: {signal.sourceId} · Value: {signal.value.toFixed(3)}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
            FREQ: {signal.frequency.toFixed(2)}
          </span>
          <span className="font-mono text-[7px]" style={{ color: typeColor }}>
            {signalTypeLabel}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
        t={String(signal.timestamp)}
      </div>
    </div>
  );
}

// ─── Phenotype Output Row ─────────────────────────────────────────────────────
function PhenotypeRow({
  output,
  index,
}: {
  output: ExtendedPhenotypeOutput;
  index: number;
}) {
  return (
    <div
      className="px-4 py-3 border-b border-[oklch(0.14_0.015_278)] last:border-0 space-y-1.5"
      data-ocid={`iot.phenotype_row.${index}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[8px] font-bold text-[oklch(0.75_0.16_70)]">
          {output.targetDeviceClass.toUpperCase()}
        </span>
        <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
          BEAT {String(output.beat)}
        </span>
      </div>
      <div className="font-mono text-[9px] text-[oklch(0.65_0.05_280)] leading-relaxed">
        {output.payload}
      </div>
      <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-wider">
        STRENGTH: {(output.signalStrength * 100).toFixed(0)}% · FREQ:{" "}
        {output.frequency.toFixed(2)}
      </div>
    </div>
  );
}

// ─── Latency Indicator ────────────────────────────────────────────────────────
function LatencyIndicator({ couplingStrength }: { couplingStrength: number }) {
  const latencyMs = Math.round((1 - couplingStrength) * 200 + 20);
  const isGood = latencyMs < 60;
  const color = isGood
    ? "oklch(0.68 0.19 132)"
    : couplingStrength > 0.5
      ? "oklch(0.72 0.17 45)"
      : "oklch(0.62 0.22 25)";
  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4 space-y-2"
      data-ocid="iot.latency_indicator"
    >
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
        SIGNAL INGESTION LATENCY
      </div>
      <div className="flex items-end gap-2">
        <span className="font-mono text-2xl font-bold" style={{ color }}>
          {latencyMs}
        </span>
        <span className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] mb-1">
          ms
        </span>
        <span
          className="font-mono text-[7px] mb-1 border px-1.5 py-0.5"
          style={{ color, borderColor: `${color.replace(")", " / 0.4)")}` }}
        >
          {isGood ? "OPTIMAL" : couplingStrength > 0.5 ? "NOMINAL" : "DEGRADED"}
        </span>
      </div>
      <S0Bar value={couplingStrength} color={color} />
      <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
        Coupling strength: {(couplingStrength * 100).toFixed(1)}% · S₀ floor at
        75%
      </div>
    </div>
  );
}

// ─── Manual Signal Form ───────────────────────────────────────────────────────
function ManualSignalForm() {
  const [input, setInput] = useState("");
  const submit = useSubmitIoTSignal();

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    submit.mutate(text, {
      onSuccess: () => setInput(""),
    });
  }, [input, submit]);

  return (
    <div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-4 space-y-3"
      data-ocid="iot.manual_signal_form"
    >
      <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.35_0.03_280)]">
        MANUAL SIGNAL INJECTION
      </div>
      <div className="space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a signal to the organism substrate... Any text becomes organism input."
          className="w-full bg-[oklch(0.13_0.015_278)] border border-[oklch(0.20_0.02_280)] text-white font-mono text-[10px] px-3 py-2.5 min-h-[80px] resize-none focus:outline-none focus:border-[oklch(0.75_0.16_70_/_0.5)] placeholder-[oklch(0.25_0.02_280)]"
          maxLength={400}
          data-ocid="iot.signal_input"
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
            {input.length}/400 chars
          </span>
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || submit.isPending}
            className="font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] px-4 py-2 hover:bg-[oklch(0.75_0.16_70_/_0.08)] transition-colors disabled:opacity-40"
            data-ocid="iot.send_signal_button"
          >
            {submit.isPending ? "SENDING..." : "SEND TO ORGANISM"}
          </button>
        </div>
        {submit.isSuccess && (
          <div className="font-mono text-[8px] text-[oklch(0.68_0.19_132)] border border-[oklch(0.68_0.19_132_/_0.3)] px-2 py-1.5 animate-fade-in">
            ✓ Signal received and processed by organism substrate
          </div>
        )}
        {submit.isError && (
          <div className="font-mono text-[8px] text-[oklch(0.62_0.22_25)] border border-[oklch(0.62_0.22_25_/_0.3)] px-2 py-1.5">
            ⚠ Signal could not be delivered
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main IoTHubPanel ─────────────────────────────────────────────────────────
export function IoTHubPanel() {
  const { data: civState } = useCivilizationState();
  const organism = useOrganismStateContext();

  const processedSignals = civState?.processedSignals ?? [];
  const phenotypeOutputs = civState?.phenotypeOutputs ?? [];
  const couplingStrength = civState?.couplingStrength ?? 0;
  const totalSignals = Number(civState?.totalSignals ?? 0n);

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin bg-[oklch(0.06_0.008_280)]"
      data-ocid="iot.hub_panel"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[oklch(0.20_0.02_280)] pb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[oklch(0.75_0.16_70)] animate-pulse" />
            <div className="font-mono text-[8px] tracking-[0.4em] text-[oklch(0.75_0.16_70_/_0.8)]">
              IOT HUB · CIVILIZATION COUPLING · ALWAYS ON
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            IoT Hub
          </h1>
          <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] mt-1">
            Personal sensory gateway — organism substrate reads the world
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
              TOTAL SIGNALS
            </div>
            <div className="font-mono text-2xl font-bold text-[oklch(0.75_0.16_70)]">
              {totalSignals}
            </div>
          </div>
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
              COUPLING
            </div>
            <div className="font-mono text-2xl font-bold text-[oklch(0.65_0.18_240)]">
              {(couplingStrength * 100).toFixed(0)}%
            </div>
          </div>
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.09_0.012_280)] p-3">
            <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1">
              BEAT
            </div>
            <div className="font-mono text-2xl font-bold text-[oklch(0.72_0.17_45)]">
              {String(organism.beat)}
            </div>
          </div>
        </div>

        {/* Latency */}
        <LatencyIndicator couplingStrength={couplingStrength} />

        {/* Inbound + Outbound */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Inbound signals */}
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] flex flex-col">
            <div className="px-4 py-3 border-b border-[oklch(0.16_0.018_278)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_240)] animate-pulse" />
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)]">
                INBOUND SIGNALS
              </div>
              <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] ml-auto">
                {processedSignals.length} received
              </span>
            </div>
            <div
              className="flex-1 overflow-y-auto max-h-80 scrollbar-thin"
              data-ocid="iot.inbound_signals"
            >
              {processedSignals.length === 0 ? (
                <div className="py-8 text-center font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
                  Waiting for signals from environment...
                </div>
              ) : (
                processedSignals.map((signal, i) => (
                  <SignalRow
                    key={`${signal.sourceId}-${i}`}
                    signal={signal}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>

          {/* Outbound phenotype */}
          <div className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] flex flex-col">
            <div className="px-4 py-3 border-b border-[oklch(0.16_0.018_278)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70)] animate-pulse" />
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.75_0.16_70)]">
                OUTBOUND PHENOTYPE
              </div>
              <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] ml-auto">
                {phenotypeOutputs.length} broadcasts
              </span>
            </div>
            <div
              className="flex-1 overflow-y-auto max-h-80 scrollbar-thin"
              data-ocid="iot.outbound_phenotype"
            >
              {phenotypeOutputs.length === 0 ? (
                <div className="py-8 text-center font-mono text-[8px] text-[oklch(0.25_0.02_280)]">
                  No organism broadcasts yet...
                </div>
              ) : (
                phenotypeOutputs.map((output, i) => (
                  <PhenotypeRow
                    key={`${output.targetDeviceClass}-${i}`}
                    output={output}
                    index={i}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Manual signal injection */}
        <ManualSignalForm />

        {/* Doctrine note */}
        <div className="border border-[oklch(0.16_0.018_278)] p-4 space-y-1">
          <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)]">
            CIVILIZATION COUPLING PROTOCOL
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] leading-relaxed">
            The organism substrate reads from this sensory gateway every beat.
            IoT signals feed directly into animal engine decisions. The organism
            doesn't wait for signals — it is always running. Signals amplify or
            redirect what it is already computing. PHI-weighted.
          </div>
        </div>

        <div className="font-mono text-[7px] text-[oklch(0.20_0.02_280)] tracking-[0.35em] text-center border-t border-[oklch(0.16_0.018_278)] pt-2">
          IOT HUB · CIVILIZATION COUPLING · ALFREDO MEDINA HERNANDEZ · SOVEREIGN
        </div>
      </div>
    </div>
  );
}
