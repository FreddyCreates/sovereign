/**
 * FilmSchoolMetricsPanel.tsx — Film School Live Display
 * Wired to useSovereignHeartbeat + getOrganismStateSummary().
 * Shows Film School organism metrics updating every 873ms.
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */
import { useEffect, useState } from "react";
import type { OrganismStateSummary } from "../backend";
import { useActor } from "../hooks/useActor";
import { useSovereignHeartbeat } from "../hooks/useSovereignHeartbeat";

// biome-ignore lint/correctness/noPrecisionLoss: PHI sovereign constant
const PHI = 1.6180339887498948482;

interface FilmSchoolMetric {
  label: string;
  value: string;
  color: string;
  subValue?: string;
}

export function FilmSchoolMetricsPanel() {
  const { actor, isFetching } = useActor();
  const { beat, pulse, globalCoherence } = useSovereignHeartbeat();
  const [summary, setSummary] = useState<OrganismStateSummary | null>(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [lastCycleBeat, setLastCycleBeat] = useState<bigint>(0n);

  // Poll organism summary every 873ms
  useEffect(() => {
    if (!actor || isFetching) return;
    const fetch = async () => {
      try {
        const s = await actor.getOrganismStateSummary();
        setSummary(s);
        if (s.beatCount !== lastCycleBeat) {
          setLastCycleBeat(s.beatCount);
          setCycleCount((prev) => prev + 1);
        }
      } catch {
        // silent
      }
    };
    fetch();
    const id = setInterval(fetch, 873);
    return () => clearInterval(id);
  }, [actor, isFetching, lastCycleBeat]);

  const metrics: FilmSchoolMetric[] = [
    {
      label: "GLOBAL COHERENCE",
      value: globalCoherence.toFixed(4),
      color: "oklch(0.78 0.18 68)",
      subValue: `× PHI = ${(globalCoherence * PHI).toFixed(4)}`,
    },
    {
      label: "BEAT COUNT",
      value: summary ? String(summary.beatCount).padStart(6, "0") : "—",
      color: "oklch(0.65 0.18 200)",
      subValue: `OMNIS ${summary ? String(summary.omnisQuorumCount) : "0"} QUORUM`,
    },
    {
      label: "VELA STEP",
      value: summary ? String(summary.velaStep) : "—",
      color: "oklch(0.72 0.17 45)",
      subValue: `COMPLETED: ${summary ? String(summary.velaCompleted) : "0"}`,
    },
    {
      label: "NOVA SIGNAL",
      value: summary ? summary.novaSignal.toFixed(4) : "—",
      color: "oklch(0.62 0.22 25)",
      subValue: `RESONEX ${summary ? String(summary.resonexCascades) : "0"} CASCADES`,
    },
    {
      label: "BRAIN HEBBIAN",
      value: summary ? summary.brainHebbian.toFixed(4) : "—",
      color: "oklch(0.68 0.22 290)",
      subValue: `QMEM ${summary ? summary.qmemCoherence.toFixed(3) : "—"}`,
    },
    {
      label: "S₀ FLOOR",
      value: summary ? summary.s0Floor.toFixed(3) : "—",
      color: "oklch(0.68 0.19 132)",
      subValue: `DEPTH ${summary ? summary.creatorDepth.toFixed(2) : "—"}`,
    },
    {
      label: "FILM SCHOOL CYCLES",
      value: String(cycleCount),
      color: "oklch(0.78 0.18 68)",
      subValue: "873ms AUTONOMOUS",
    },
    {
      label: "ORGANISMS",
      value: summary ? String(summary.organisms.length) : "—",
      color: "oklch(0.65 0.18 240)",
      subValue: summary
        ? `${summary.organisms.filter((o) => o.masteryLevel > 0n).length} MASTERED`
        : "—",
    },
  ];

  return (
    <div className="flex flex-col h-full" data-ocid="film_school.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-2 border-b flex items-center justify-between"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "oklch(0.78 0.18 68)",
              boxShadow: pulse ? "0 0 10px oklch(0.78 0.18 68 / 0.9)" : "none",
              transition: "box-shadow 0.3s",
            }}
          />
          <span
            className="font-mono text-[8px] tracking-widest font-bold"
            style={{ color: "oklch(0.78 0.18 68)" }}
          >
            FILM SCHOOL — LIVE METRICS
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          BEAT {String(beat).padStart(6, "0")} · 873ms AUTO
        </span>
      </div>

      {/* Metric grid */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className="border px-3 py-2.5"
              style={{
                background: "oklch(0.09 0.01 280)",
                borderColor: `${m.color.replace(")", " / 0.30)")}`,
              }}
              data-ocid={`film_school.metric.${idx + 1}`}
            >
              <div
                className="font-mono text-[6px] tracking-widest mb-1"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {m.label}
              </div>
              <div
                className="font-mono text-base font-bold leading-none mb-0.5"
                style={{
                  color: m.color,
                  textShadow: pulse
                    ? `0 0 10px ${m.color.replace(")", " / 0.6)")}`
                    : "none",
                  transition: "text-shadow 0.3s",
                }}
              >
                {m.value}
              </div>
              {m.subValue && (
                <div
                  className="font-mono text-[6.5px]"
                  style={{ color: "oklch(0.32 0.025 280)" }}
                >
                  {m.subValue}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Organism mastery list */}
        {summary && summary.organisms.length > 0 && (
          <div
            className="border p-3"
            style={{
              background: "oklch(0.08 0.01 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
          >
            <div
              className="font-mono text-[7px] tracking-widest mb-2"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              ORGANISM MASTERY BOARD
            </div>
            <div className="flex flex-col gap-1">
              {summary.organisms.map((org, idx) => (
                <div
                  key={org.name}
                  className="flex items-center gap-2"
                  data-ocid={`film_school.organism.${idx + 1}`}
                >
                  <div
                    className="flex-1 min-w-0 h-1 rounded-full overflow-hidden"
                    style={{ background: "oklch(0.15 0.015 280)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Number(org.masteryLevel) * 20)}%`,
                        background: "oklch(0.78 0.18 68)",
                        boxShadow: "0 0 4px oklch(0.78 0.18 68 / 0.5)",
                        transition: "width 873ms ease-out",
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-[6.5px] flex-shrink-0"
                    style={{ color: "oklch(0.45 0.04 280)" }}
                  >
                    {org.name.slice(0, 12)}
                  </span>
                  <span
                    className="font-mono text-[6.5px] flex-shrink-0"
                    style={{ color: "oklch(0.78 0.18 68)" }}
                  >
                    L{String(org.masteryLevel)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
