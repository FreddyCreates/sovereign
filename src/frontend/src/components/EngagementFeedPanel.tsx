import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import {
  getOption,
  useEngagementLog,
  useFactions,
  useLawExecutionLog,
} from "../hooks/useQueries";

const DOMAIN_ICONS: Record<string, string> = {
  DRONE_SWARM: "✈",
  CYBER: "⚡",
  SPACE: "⭐",
  ELECTRONIC_WARFARE: "📡",
  AI_GROUND: "🤖",
  HYPERSONIC: "🚀",
  INFO_OPS: "📁",
  NAVAL: "⚓",
  QUANTUM: "⚛",
};

const FACTION_REGIONS = [
  "NAFC",
  "PANEURO",
  "EURASIA",
  "EASTASIA",
  "MIDEAST",
  "AFRICA",
  "SOUTHASIA",
  "SEAPAC",
  "LATAM",
  "ARCTIC",
];

function outcomeStyle(outcome: string) {
  switch (outcome) {
    case "HIT":
      return "text-green-400 bg-green-400/10 border-green-400/30";
    case "DESTROYED":
      return "text-red-400 bg-red-400/10 border-red-400/30";
    case "MISS":
      return "text-muted-foreground bg-muted/20 border-border";
    case "EVADED":
      return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    case "RETREATED":
      return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    default:
      return "text-muted-foreground bg-muted/20 border-border";
  }
}

export function EngagementFeedPanel() {
  const { data: engagements = [], isLoading: engLoading } =
    useEngagementLog(20n);
  const { data: lawRecords = [], isLoading: lawLoading } =
    useLawExecutionLog(15n);
  const { data: factions = [] } = useFactions();
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  const isLoading = engLoading || lawLoading;

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (engagements.length > prevLengthRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    prevLengthRef.current = engagements.length;
  }, [engagements.length]);

  const factionName = (id: bigint) => {
    const f = factions.find((x) => x.id === id);
    return f?.region ?? FACTION_REGIONS[Number(id) % 10] ?? `F${id}`;
  };

  return (
    <div
      className="card-panel flex flex-col h-full w-full"
      data-ocid="engagement_feed.panel"
    >
      {/* Engagement Feed */}
      <div className="px-3 py-2.5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-red-400 rounded-sm opacity-80" />
          <span className="text-xs font-mono tracking-widest text-foreground/90 uppercase">
            Live Engagement Feed
          </span>
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">
            {engagements.length} events
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ flexBasis: "55%" }}>
        <ScrollArea className="h-full scrollbar-thin">
          <div ref={scrollRef} className="px-2 py-1 space-y-0.5">
            {isLoading ? (
              ["e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7"].map((k) => (
                <div key={k} className="p-2 animate-pulse">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-2 w-2/3" />
                </div>
              ))
            ) : engagements.length === 0 ? (
              <div
                className="p-4 text-center"
                data-ocid="engagement_feed.empty_state"
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-red-400/60 mx-auto mb-2" />
                <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                  NO DATA YET — ORGANISM INITIALIZING
                </p>
                <p className="text-[9px] text-muted-foreground/50 mt-1">
                  RUN BEAT TO INITIATE SIMULATION
                </p>
              </div>
            ) : (
              engagements.map((e, idx) => {
                const lawTrig = getOption(e.lawTriggered);
                const domain = e.domain.replace("_", " ");
                const icon = DOMAIN_ICONS[e.domain] ?? "•";
                return (
                  <div
                    key={e.id.toString()}
                    className="px-2 py-1.5 rounded hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-cyan-500/30 animate-fade-in"
                    data-ocid={`engagement_feed.item.${idx + 1}`}
                  >
                    <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 flex-wrap">
                      <span className="text-[9px] font-mono text-muted-foreground">
                        B{e.beat.toString()}
                      </span>
                      <span className="text-[10px]">{icon}</span>
                      <span className="text-[10px] font-mono text-cyan tracking-wider">
                        {factionName(e.attackerFactionId)}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        →
                      </span>
                      <span className="text-[10px] font-mono text-foreground/70">
                        {factionName(e.defenderFactionId)}
                      </span>
                      <span
                        className={`ml-auto text-[9px] font-mono px-1 py-0.5 rounded-sm border ${outcomeStyle(e.outcome)}`}
                      >
                        {e.outcome}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-muted-foreground/60 font-mono tracking-wider">
                        {domain}
                      </span>
                      {lawTrig && (
                        <span className="text-[8px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1 py-0.5 rounded-sm">
                          {lawTrig.split(":")[0]}
                        </span>
                      )}
                      <span
                        className={`ml-auto text-[9px] font-mono ${e.coherenceImpact >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {e.coherenceImpact >= 0 ? "+" : ""}
                        {e.coherenceImpact.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Law Execution Log */}
      <div className="border-t border-border flex-shrink-0">
        <div className="px-3 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-amber-400 rounded-sm opacity-80" />
            <span className="text-xs font-mono tracking-widest text-foreground/90 uppercase">
              Law Execution Log
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0" style={{ flexBasis: "40%" }}>
        <ScrollArea className="h-full scrollbar-thin">
          <div className="px-2 py-1 space-y-0.5">
            {isLoading ? (
              ["l0", "l1", "l2", "l3", "l4"].map((k) => (
                <div key={k} className="p-2 animate-pulse">
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))
            ) : lawRecords.length === 0 ? (
              <div
                className="p-3 text-center"
                data-ocid="law_execution.empty_state"
              >
                <p className="text-[9px] font-mono text-muted-foreground tracking-wider">
                  NO LAWS TRIGGERED
                </p>
              </div>
            ) : (
              lawRecords.map((rec, idx) => (
                <div
                  key={`${rec.beat.toString()}-${rec.lawId.toString()}`}
                  className="px-2 py-1.5 rounded hover:bg-white/5 transition-colors animate-fade-in"
                  data-ocid={`law_execution.item.${idx + 1}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-mono text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1 py-0.5 rounded-sm flex-shrink-0">
                      B{rec.beat.toString()}
                    </span>
                    <span className="text-[10px] font-mono text-foreground/80 truncate">
                      {rec.lawName}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono truncate">
                    {rec.effect}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
