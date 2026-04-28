import { ScrollArea } from "@/components/ui/scroll-area";
import type { Artifact, LawExecutionRecord } from "../hooks/useQueries";

interface Props {
  artifacts: Artifact[];
  lawRecords: LawExecutionRecord[];
  isLoading: boolean;
}

export function LogsTab({ artifacts, lawRecords, isLoading }: Props) {
  return (
    <div className="p-4 space-y-4" data-ocid="logs.panel">
      {/* Artifact Registry */}
      <div className="card-panel">
        <div className="px-3 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-amber-400 rounded-sm" />
            <span className="font-mono text-xs tracking-widest text-foreground/90 uppercase">
              Artifact Registry
            </span>
            <span className="ml-auto font-mono text-[9px] text-muted-foreground">
              {artifacts.length} artifacts
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-3 py-1.5 text-muted-foreground tracking-wider">
                  ID
                </th>
                <th className="text-left px-3 py-1.5 text-muted-foreground tracking-wider">
                  BEAT
                </th>
                <th className="text-left px-3 py-1.5 text-muted-foreground tracking-wider">
                  TYPE
                </th>
                <th className="text-left px-3 py-1.5 text-muted-foreground tracking-wider">
                  DESCRIPTION
                </th>
                <th className="text-right px-3 py-1.5 text-muted-foreground tracking-wider">
                  COHERENCE
                </th>
                <th className="text-right px-3 py-1.5 text-muted-foreground tracking-wider">
                  STATE HASH
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? ["r0", "r1", "r2"].map((k) => (
                    <tr key={k}>
                      {["c0", "c1", "c2", "c3", "c4", "c5"].map((ck) => (
                        <td key={ck} className="px-3 py-2">
                          <div className="h-3 bg-muted rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : artifacts.map((a, idx) => (
                    <tr
                      key={a.id.toString()}
                      className="border-b border-border/50 hover:bg-white/5 transition-colors"
                      data-ocid={`artifacts.item.${idx + 1}`}
                    >
                      <td className="px-3 py-1.5 text-cyan">
                        {a.id.toString()}
                      </td>
                      <td className="px-3 py-1.5 text-foreground/70">
                        {a.beat.toString()}
                      </td>
                      <td className="px-3 py-1.5">
                        <span className="text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-sm text-[9px]">
                          {a.eventType}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-foreground/80 max-w-[300px] truncate">
                        {a.description}
                      </td>
                      <td className="px-3 py-1.5 text-right text-green-400">
                        {(a.coherenceAtEmission * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-1.5 text-right text-muted-foreground">
                        {a.stateHash}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Law Execution Log */}
      <div className="card-panel">
        <div className="px-3 py-2.5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-cyan-400 rounded-sm" />
            <span className="font-mono text-xs tracking-widest text-foreground/90 uppercase">
              Full Law Execution Log
            </span>
            <span className="ml-auto font-mono text-[9px] text-muted-foreground">
              {lawRecords.length} records
            </span>
          </div>
        </div>
        <ScrollArea className="h-64 scrollbar-thin">
          <div className="px-2 py-1 space-y-0.5">
            {isLoading
              ? ["ll0", "ll1", "ll2", "ll3", "ll4"].map((k) => (
                  <div key={k} className="p-2 animate-pulse">
                    <div className="h-3 bg-muted rounded w-4/5" />
                  </div>
                ))
              : lawRecords.map((rec, idx) => (
                  <div
                    key={`${rec.beat.toString()}-${rec.lawId.toString()}-${idx}`}
                    className="px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
                    data-ocid={`law_log.item.${idx + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1 py-0.5 rounded-sm">
                        B{rec.beat.toString()}
                      </span>
                      <span className="font-mono text-[9px] text-foreground/80">
                        {rec.lawName}
                      </span>
                    </div>
                    <p className="text-[8px] text-muted-foreground font-mono mt-0.5">
                      {rec.effect}
                    </p>
                  </div>
                ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
