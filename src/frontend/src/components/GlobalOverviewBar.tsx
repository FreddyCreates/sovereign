import { Skeleton } from "@/components/ui/skeleton";
import {
  useArtifacts,
  useBeatCount,
  useFactions,
  useSimulationStatus,
} from "../hooks/useQueries";

const DOMAINS = [
  { key: "DRONE_SWARM", label: "DRONE", idx: 0 },
  { key: "CYBER", label: "CYBER", idx: 1 },
  { key: "SPACE", label: "SPACE", idx: 2 },
  { key: "ELECTRONIC_WARFARE", label: "E-WAR", idx: 3 },
  { key: "AI_GROUND", label: "AI-GND", idx: 4 },
  { key: "HYPERSONIC", label: "HYPER", idx: 5 },
  { key: "INFO_OPS", label: "INFO", idx: 6 },
  { key: "NAVAL", label: "NAVAL", idx: 7 },
  { key: "QUANTUM", label: "QUANT", idx: 8 },
];

function coherenceState(c: number) {
  if (c > 75) return { label: "STABLE", color: "text-green-400" };
  if (c > 50) return { label: "NOMINAL", color: "text-cyan" };
  if (c > 30) return { label: "UNSTABLE", color: "text-amber-warn" };
  return { label: "CRITICAL", color: "text-hostile" };
}

export function GlobalOverviewBar() {
  const { data: status, isLoading: statusLoading } = useSimulationStatus();
  const { data: factions = [], isLoading: factionsLoading } = useFactions();
  const { data: artifacts = [], isLoading: artifactsLoading } = useArtifacts();
  const { data: beatCount } = useBeatCount();

  const isLoading = statusLoading || factionsLoading || artifactsLoading;
  const globalCoherencePct = status ? status.globalCoherence * 100 : 0;
  const state = coherenceState(globalCoherencePct);

  // Last artifact quality score (from coherenceAtEmission)
  const lastArtifactScore =
    artifacts.length > 0
      ? (artifacts[artifacts.length - 1]?.coherenceAtEmission ?? 0)
      : 0;

  const domainAverages = DOMAINS.map((d) => {
    if (factions.length === 0) return { ...d, avg: 0 };
    const avg =
      factions.reduce((s, f) => s + (f.domainStrengths[d.idx] ?? 0), 0) /
      factions.length;
    return { ...d, avg };
  });

  if (isLoading) {
    return (
      <div className="card-panel grid-bg" data-ocid="global_overview.panel">
        <div className="px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex items-start gap-4 flex-wrap mb-2">
            <Skeleton className="w-24 h-8" />
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-48 h-8" />
          </div>
          <Skeleton className="w-full h-6" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-panel grid-bg" data-ocid="global_overview.panel">
      <div className="px-3 py-2 sm:px-4 sm:py-3">
        {/* Top row */}
        <div className="flex items-start gap-4 flex-wrap mb-2 sm:mb-0">
          {/* Beat Counter */}
          <div className="flex-shrink-0">
            <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase mb-0.5">
              Global Beat
            </div>
            <div className="font-mono text-xl sm:text-2xl font-bold text-cyan text-glow-cyan tracking-wider">
              #{beatCount?.toString() ?? status?.beat.toString() ?? "0"}
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-border flex-shrink-0" />

          {/* Global Coherence */}
          <div className="flex-shrink-0">
            <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase mb-0.5">
              Global Coherence
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                {globalCoherencePct.toFixed(1)}%
              </span>
              <span
                className={`font-mono text-[10px] tracking-widest ${state.color}`}
              >
                {state.label}
              </span>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-border flex-shrink-0" />

          {/* Stats */}
          <div className="flex gap-3 sm:gap-4 flex-shrink-0 flex-wrap">
            <div>
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                Engagements
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-foreground">
                {status ? status.totalEngagements.toString() : "0"}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                Artifacts
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-amber-400">
                {artifacts.length}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                Factions
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-foreground">
                {status ? status.activeFactions.toString() : "0"}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                Last Quality
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-foreground/70">
                {(lastArtifactScore * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                Heartbeat
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    background: "oklch(0.78 0.18 68)",
                    boxShadow: "0 0 5px oklch(0.78 0.18 68 / 0.7)",
                  }}
                />
                <span
                  className="font-mono text-[10px] font-bold"
                  style={{ color: "oklch(0.78 0.18 68)" }}
                >
                  873ms
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Strengths */}
        <div className="mt-2">
          <div className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase mb-1.5">
            Domain Strength
          </div>
          <div className="sm:hidden overflow-x-auto">
            <div
              className="flex gap-2 pb-1"
              style={{ minWidth: "max-content" }}
            >
              {domainAverages.map((d) => (
                <div key={d.key} className="flex flex-col gap-0.5 w-10">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, d.avg)}%` }}
                    />
                  </div>
                  <span className="font-mono text-[8px] text-muted-foreground tracking-wider truncate text-center">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden sm:grid grid-cols-9 gap-1.5">
            {domainAverages.map((d) => (
              <div key={d.key} className="flex flex-col gap-0.5">
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-700"
                    style={{ width: `${Math.min(100, d.avg)}%` }}
                  />
                </div>
                <span className="font-mono text-[7px] text-muted-foreground tracking-wider truncate text-center">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
