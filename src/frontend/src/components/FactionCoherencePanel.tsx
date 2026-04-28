import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useFactions } from "../hooks/useQueries";

function statusChip(coherence: number) {
  if (coherence > 75)
    return {
      label: "DOMINANT",
      color: "text-cyan bg-cyan/10 border border-cyan/30",
    };
  if (coherence > 50)
    return {
      label: "STABLE",
      color: "text-green-400 bg-green-400/10 border border-green-400/30",
    };
  if (coherence > 30)
    return {
      label: "UNSTABLE",
      color: "text-amber-400 bg-amber-400/10 border border-amber-400/30",
    };
  return {
    label: "CRISIS",
    color: "text-red-400 bg-red-400/10 border border-red-400/30",
  };
}

function barColor(coherence: number) {
  if (coherence > 50) return "bg-gradient-to-r from-cyan-500/80 to-cyan-400";
  if (coherence > 30) return "bg-gradient-to-r from-amber-500/80 to-amber-400";
  return "bg-gradient-to-r from-red-500/80 to-red-400";
}

export function FactionCoherencePanel() {
  const { data: factions = [], isLoading } = useFactions();

  return (
    <div
      className="card-panel flex flex-col h-full w-full"
      data-ocid="faction_coherence.panel"
    >
      <div className="px-3 py-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-sm opacity-80" />
          <span className="text-xs font-mono tracking-widest text-foreground/90 uppercase">
            Faction Coherence — Live
          </span>
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">
            {factions.length} factions
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-2 py-1 space-y-1">
          {isLoading ? (
            ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"].map(
              (k) => (
                <div key={k} className="p-2 rounded animate-pulse">
                  <div className="h-3 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-1.5 bg-muted rounded w-full" />
                </div>
              ),
            )
          ) : factions.length === 0 ? (
            <div
              className="p-6 flex flex-col items-center gap-2"
              data-ocid="faction_coherence.empty_state"
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-400/60" />
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                NO DATA YET — ORGANISM INITIALIZING
              </p>
            </div>
          ) : (
            factions.map((faction, idx) => {
              const status = statusChip(faction.coherence);
              const winRate =
                faction.totalEngagements > 0n
                  ? (
                      (Number(faction.wins) /
                        Number(faction.totalEngagements)) *
                      100
                    ).toFixed(0)
                  : "0";
              return (
                <div
                  key={faction.id.toString()}
                  className="px-2 py-2 rounded hover:bg-white/5 transition-colors"
                  data-ocid={`faction_coherence.item.${idx + 1}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[10px] text-cyan tracking-widest opacity-80 flex-shrink-0">
                        {faction.region}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {faction.name.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[9px] px-1 py-0.5 rounded-sm tracking-wider flex-shrink-0 ml-1 ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor(faction.coherence)}`}
                        style={{
                          width: `${Math.min(100, Math.max(0, faction.coherence))}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-foreground/80 w-8 text-right flex-shrink-0">
                      {faction.coherence.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-muted-foreground font-mono">
                      W{faction.wins.toString()} / L{faction.losses.toString()}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {winRate}% WR
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
