import type { Faction } from "../hooks/useQueries";

const DOMAINS = [
  "DRONE",
  "CYBER",
  "SPACE",
  "E-WAR",
  "AI-GND",
  "HYPER",
  "INFO",
  "NAVAL",
  "QUANT",
];

interface Props {
  factions: Faction[];
  isLoading: boolean;
}

export function IntelTab({ factions, isLoading }: Props) {
  return (
    <div className="p-4" data-ocid="intel.panel">
      <div className="mb-4">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Intelligence Dossier — All Factions
        </h2>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {["i0", "i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9"].map(
            (k) => (
              <div key={k} className="card-panel p-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                <div className="space-y-1.5">
                  {DOMAINS.map((d) => (
                    <div key={d} className="h-2 bg-muted rounded" />
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {factions.map((f, idx) => {
            const winRate =
              f.totalEngagements > 0n
                ? ((Number(f.wins) / Number(f.totalEngagements)) * 100).toFixed(
                    1,
                  )
                : "0.0";
            return (
              <div
                key={f.id.toString()}
                className="card-panel p-3"
                data-ocid={`intel.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-mono text-[10px] text-cyan tracking-widest">
                      {f.region}
                    </span>
                    <h3 className="text-xs font-semibold text-foreground">
                      {f.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-foreground">
                      {f.coherence.toFixed(1)}
                    </div>
                    <div className="text-[9px] text-muted-foreground font-mono">
                      COHERENCE
                    </div>
                  </div>
                </div>
                {/* Domain strengths */}
                <div className="space-y-1 mb-2">
                  {DOMAINS.map((d, i) => (
                    <div key={d} className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-muted-foreground w-10 text-right">
                        {d}
                      </span>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.min(100, f.domainStrengths[i] ?? 0)}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-foreground/70 w-6 text-right">
                        {(f.domainStrengths[i] ?? 0).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Stats row */}
                <div className="flex gap-3 pt-1.5 border-t border-border">
                  <div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      STRATEGY IDX
                    </div>
                    <div className="font-mono text-[11px] text-amber-400">
                      {f.strategyIndex.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      WIN RATE
                    </div>
                    <div className="font-mono text-[11px] text-green-400">
                      {winRate}%
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      ENGAGEMENTS
                    </div>
                    <div className="font-mono text-[11px] text-foreground">
                      {f.totalEngagements.toString()}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] text-muted-foreground">
                      W / L
                    </div>
                    <div className="font-mono text-[11px] text-foreground">
                      {f.wins.toString()}/{f.losses.toString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
