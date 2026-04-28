/**
 * WorldSyncCard.tsx — COMMAND Zone Row 4
 * 52-beat world instance sync — instance count, beat countdown, token balances.
 */
import { useWorldInstanceSyncState } from "../../hooks/useQueries";

export function WorldSyncCard() {
  const { data } = useWorldInstanceSyncState();

  const instanceCount = Number(data?.instanceCount ?? 0);
  const syncBeatCounter = Number(data?.syncBeatCounter ?? 0);
  const beatsUntilNext = Number(data?.beatsUntilNextSync ?? 52);
  const instances = data?.instances ?? [];
  const syncReady = data?.syncReady ?? false;
  const progress = Math.min(100, (syncBeatCounter / 52) * 100);

  return (
    <div
      className="flex flex-col gap-3 p-3 border"
      style={{
        background: "oklch(0.08 0.01 280)",
        borderColor: "oklch(0.18 0.02 280)",
      }}
      data-ocid="command.world_sync.card"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: "oklch(0.65 0.18 200)", fontSize: "10px" }}>
            ⊕
          </span>
          <span
            className="font-mono text-[9px] tracking-widest font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            MULTI-WORLD · INSTANCE SYNC
          </span>
        </div>
        <div className="flex items-center gap-3">
          {syncReady && (
            <span
              className="font-mono text-[7px] tracking-widest px-2 py-0.5"
              style={{
                background: "oklch(0.68 0.19 132 / 0.1)",
                color: "oklch(0.68 0.19 132)",
                border: "1px solid oklch(0.68 0.19 132 / 0.4)",
              }}
            >
              SYNC READY
            </span>
          )}
          <span
            className="font-mono text-[8px] font-bold"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            {instanceCount} {instanceCount === 1 ? "INSTANCE" : "INSTANCES"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Beat countdown */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              BEATS UNTIL SYNC
            </span>
            <span
              className="font-mono text-[9px] font-bold"
              style={{
                color: syncReady
                  ? "oklch(0.68 0.19 132)"
                  : "oklch(0.65 0.18 200)",
              }}
            >
              {syncReady ? "NOW" : beatsUntilNext}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "oklch(0.14 0.015 278)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: syncReady
                  ? "linear-gradient(90deg, oklch(0.68 0.19 132), oklch(0.72 0.22 150))"
                  : "linear-gradient(90deg, oklch(0.65 0.18 200), oklch(0.72 0.20 220))",
                transition: "width 873ms ease-out",
              }}
            />
          </div>
          <span
            className="font-mono text-[7px]"
            style={{ color: "oklch(0.40 0.04 280)" }}
          >
            {syncBeatCounter} / 52 BEATS
          </span>
        </div>

        {/* Instance list */}
        <div
          className="flex flex-col gap-1 overflow-hidden"
          data-ocid="command.world_sync.instances_list"
        >
          {instances.length === 0 ? (
            <span
              className="font-mono text-[8px]"
              style={{ color: "oklch(0.28 0.02 280)" }}
            >
              No active instances
            </span>
          ) : (
            instances.slice(0, 4).map(([instanceId, balance], idx) => (
              <div
                key={instanceId}
                className="flex items-center justify-between gap-2"
                data-ocid={`command.world_sync.instance.${idx + 1}`}
              >
                <span
                  className="font-mono text-[7px] truncate min-w-0"
                  style={{ color: "oklch(0.55 0.06 280)" }}
                >
                  {instanceId}
                </span>
                <span
                  className="font-mono text-[7px] flex-shrink-0"
                  style={{ color: "oklch(0.65 0.18 200)" }}
                >
                  {balance.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
