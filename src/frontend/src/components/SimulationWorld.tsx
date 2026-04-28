import { useCallback, useEffect, useRef } from "react";
import { useSimulationEngine } from "../hooks/useSimulationEngine";
import type { EngagementEvent, Faction } from "../types/simulation";

interface SimulationWorldProps {
  factions: Faction[];
  engagements: EngagementEvent[];
  beatCount: bigint;
  autoRunEnabled: boolean;
}

export function SimulationWorld({
  factions,
  engagements,
  beatCount,
  autoRunEnabled,
}: SimulationWorldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const { drawFrame, updateFactions, updateEngagements, setupCamera } =
    useSimulationEngine();

  // Update internal refs when props change
  useEffect(() => {
    updateFactions(factions);
  }, [factions, updateFactions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    updateEngagements(engagements, canvas.width, canvas.height);
  }, [engagements, updateEngagements]);

  // ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });
    ro.observe(container);
    // Set initial size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    return () => ro.disconnect();
  }, []);

  // Camera events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return setupCamera(canvas);
  }, [setupCamera]);

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawFrame(ctx, canvas, timestamp);

      // Draw beat counter on top (can't put in drawFrame without closures)
      ctx.save();
      ctx.textAlign = "right";
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#00e5ff";
      ctx.fillText(`BEAT #${beatCount.toString()}`, canvas.width - 14, 20);

      // Auto-run indicator
      if (autoRunEnabled) {
        ctx.fillStyle = "#66bb6a";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText("● AUTO-RUN ACTIVE", canvas.width - 14, 34);
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(animate);
    },
    [drawFrame, beatCount, autoRunEnabled],
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
      style={{ cursor: "grab" }}
      data-ocid="simulation.canvas_target"
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
