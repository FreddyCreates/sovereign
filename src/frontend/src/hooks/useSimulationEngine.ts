import { useCallback, useRef } from "react";
import type { EngagementEvent, Faction } from "../types/simulation";

const FACTION_POSITIONS = [
  { id: 0, name: "North America", shortName: "NOAM", x: 0.18, y: 0.35 },
  { id: 1, name: "Europe/NATO", shortName: "NATO", x: 0.47, y: 0.28 },
  { id: 2, name: "Russia/Eurasia", shortName: "RUSS", x: 0.6, y: 0.22 },
  { id: 3, name: "China/East Asia", shortName: "CHIN", x: 0.72, y: 0.35 },
  { id: 4, name: "Middle East", shortName: "MIDE", x: 0.55, y: 0.42 },
  { id: 5, name: "Africa", shortName: "AFRC", x: 0.5, y: 0.55 },
  { id: 6, name: "South Asia", shortName: "SASI", x: 0.65, y: 0.45 },
  { id: 7, name: "Southeast Asia", shortName: "SEAS", x: 0.76, y: 0.52 },
  { id: 8, name: "Latin America", shortName: "LTAM", x: 0.25, y: 0.62 },
  { id: 9, name: "Arctic/Space", shortName: "ARCT", x: 0.5, y: 0.08 },
];

const FACTION_COLORS = [
  "#00e5ff", // North America - cyan
  "#4fc3f7", // Europe/NATO - light blue
  "#ef5350", // Russia - red
  "#ff7043", // China - orange
  "#ffca28", // Middle East - amber
  "#66bb6a", // Africa - green
  "#ab47bc", // South Asia - purple
  "#26c6da", // SE Asia - teal
  "#ec407a", // Latin America - pink
  "#b0bec5", // Arctic/Space - silver
];

interface DroneEntity {
  id: number;
  factionId: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  state: "patrol" | "sortie" | "returning";
  angle: number;
  orbitAngle: number;
  orbitRadius: number;
  speed: number;
}

interface EngagementAnim {
  id: number;
  drones: DroneEntity[];
  progress: number;
  phase: "flight" | "explosion" | "returning";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  outcome: string;
  color: string;
  explodeTimer: number;
  bezierCx: number;
  bezierCy: number;
}

interface ExplosionParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

interface PulseRing {
  factionId: number;
  radius: number;
  alpha: number;
}

interface CameraState {
  offsetX: number;
  offsetY: number;
  zoom: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

interface SimState {
  drones: DroneEntity[];
  animations: EngagementAnim[];
  particles: ExplosionParticle[];
  pulseRings: PulseRing[];
  processedEngagementIds: Set<string>;
  animIdCounter: number;
  droneIdCounter: number;
  lastPulseTime: number;
  recentEngagements: { attackerId: number; defenderId: number; time: number }[];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
}

function initDrones(state: SimState, canvasW: number, canvasH: number) {
  state.drones = [];
  for (let fi = 0; fi < 10; fi++) {
    const pos = FACTION_POSITIONS[fi];
    const count = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      const orbitAngle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const orbitRadius = 30 + Math.random() * 20;
      state.drones.push({
        id: state.droneIdCounter++,
        factionId: fi,
        x: pos.x * canvasW + Math.cos(orbitAngle) * orbitRadius,
        y: pos.y * canvasH + Math.sin(orbitAngle) * orbitRadius,
        vx: 0,
        vy: 0,
        state: "patrol",
        angle: orbitAngle,
        orbitAngle,
        orbitRadius,
        speed: 0.008 + Math.random() * 0.006,
      });
    }
  }
}

function hexPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  size: number,
  color: string,
  alpha: number,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.7, -size * 0.5);
  ctx.lineTo(-size * 0.7, size * 0.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function useSimulationEngine() {
  const stateRef = useRef<SimState>({
    drones: [],
    animations: [],
    particles: [],
    pulseRings: [],
    processedEngagementIds: new Set(),
    animIdCounter: 0,
    droneIdCounter: 0,
    lastPulseTime: 0,
    recentEngagements: [],
  });

  const cameraRef = useRef<CameraState>({
    offsetX: 0,
    offsetY: 0,
    zoom: 1,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  const initializedRef = useRef(false);
  const lastTimestampRef = useRef(0);
  const factionsRef = useRef<Faction[]>([]);
  const engagementsRef = useRef<EngagementEvent[]>([]);

  const getCamera = useCallback(() => cameraRef.current, []);

  const setupCamera = useCallback((canvas: HTMLCanvasElement) => {
    const cam = cameraRef.current;

    const onMouseDown = (e: MouseEvent) => {
      cam.isDragging = true;
      cam.lastMouseX = e.clientX;
      cam.lastMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!cam.isDragging) return;
      cam.offsetX += e.clientX - cam.lastMouseX;
      cam.offsetY += e.clientY - cam.lastMouseY;
      cam.lastMouseX = e.clientX;
      cam.lastMouseY = e.clientY;
    };
    const onMouseUp = () => {
      cam.isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      cam.zoom = Math.max(0.5, Math.min(3, cam.zoom * delta));
    };
    const onDblClick = () => {
      cam.offsetX = 0;
      cam.offsetY = 0;
      cam.zoom = 1;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDblClick);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDblClick);
    };
  }, []);

  const updateFactions = useCallback((factions: Faction[]) => {
    factionsRef.current = factions;
  }, []);

  const updateEngagements = useCallback(
    (engagements: EngagementEvent[], canvasW: number, canvasH: number) => {
      const state = stateRef.current;
      engagementsRef.current = engagements;

      for (const eng of engagements) {
        const key = eng.id.toString();
        if (state.processedEngagementIds.has(key)) continue;
        state.processedEngagementIds.add(key);

        const atkId = Number(eng.attackerFactionId) % 10;
        const defId = Number(eng.defenderFactionId) % 10;
        const atkPos = FACTION_POSITIONS[atkId];
        const defPos = FACTION_POSITIONS[defId];
        if (!atkPos || !defPos) continue;

        const startX = atkPos.x * canvasW;
        const startY = atkPos.y * canvasH;
        const endX = defPos.x * canvasW;
        const endY = defPos.y * canvasH;

        // Bezier control point — arc midpoint perpendicular
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const dx = endX - startX;
        const dy = endY - startY;
        const perp = Math.sqrt(dx * dx + dy * dy) * 0.3;
        const bezierCx =
          midX - (dy / Math.sqrt(dx * dx + dy * dy + 0.001)) * perp;
        const bezierCy =
          midY + (dx / Math.sqrt(dx * dx + dy * dy + 0.001)) * perp;

        const outcome = eng.outcome.toLowerCase();
        let color = "#00e5ff";
        if (outcome.includes("hit") || outcome.includes("destroy"))
          color = "#66bb6a";
        else if (outcome.includes("miss") || outcome.includes("retreat"))
          color = "#ef5350";
        else if (outcome.includes("evad")) color = "#ffca28";

        // Spawn 3-5 sortie drones
        const count = 3 + Math.floor(Math.random() * 3);
        const drones: DroneEntity[] = [];
        for (let i = 0; i < count; i++) {
          drones.push({
            id: state.droneIdCounter++,
            factionId: atkId,
            x: startX + (Math.random() - 0.5) * 12,
            y: startY + (Math.random() - 0.5) * 12,
            vx: 0,
            vy: 0,
            state: "sortie",
            angle: Math.atan2(endY - startY, endX - startX),
            orbitAngle: 0,
            orbitRadius: 30,
            speed: 0.012,
          });
        }

        state.animations.push({
          id: state.animIdCounter++,
          drones,
          progress: 0,
          phase: "flight",
          startX,
          startY,
          endX,
          endY,
          outcome: eng.outcome,
          color,
          explodeTimer: 0,
          bezierCx,
          bezierCy,
        });

        state.recentEngagements.push({
          attackerId: atkId,
          defenderId: defId,
          time: Date.now(),
        });
        if (state.recentEngagements.length > 5) state.recentEngagements.shift();
      }
    },
    [],
  );

  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      timestamp: number,
    ) => {
      const state = stateRef.current;
      const cam = cameraRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Init drones once
      if (!initializedRef.current || state.drones.length === 0) {
        initDrones(state, W, H);
        initializedRef.current = true;
      }

      const dt = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.05);
      lastTimestampRef.current = timestamp;

      // ── Clear ──
      ctx.fillStyle = "#0a0f14";
      ctx.fillRect(0, 0, W, H);

      // ── Camera transform ──
      ctx.save();
      ctx.translate(W / 2 + cam.offsetX, H / 2 + cam.offsetY);
      ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-W / 2, -H / 2);

      // ── Dot grid ──
      ctx.fillStyle = "rgba(0, 229, 255, 0.08)";
      const gridStep = 40;
      for (let gx = 0; gx < W; gx += gridStep) {
        for (let gy = 0; gy < H; gy += gridStep) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Continent blobs (stylized) ──
      drawContinents(ctx, W, H);

      // ── Recent engagement lines ──
      const now = Date.now();
      for (const re of state.recentEngagements) {
        const age = (now - re.time) / 8000; // 8s fade
        if (age > 1) continue;
        const atkPos = FACTION_POSITIONS[re.attackerId];
        const defPos = FACTION_POSITIONS[re.defenderId];
        if (!atkPos || !defPos) continue;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.18 * (1 - age)})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 6]);
        ctx.moveTo(atkPos.x * W, atkPos.y * H);
        ctx.lineTo(defPos.x * W, defPos.y * H);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // ── Pulse rings ──
      if (timestamp - state.lastPulseTime > 2000) {
        state.lastPulseTime = timestamp;
        for (let fi = 0; fi < 10; fi++) {
          if (Math.random() > 0.4) {
            state.pulseRings.push({ factionId: fi, radius: 24, alpha: 0.6 });
          }
        }
      }
      state.pulseRings = state.pulseRings.filter((pr) => pr.alpha > 0);
      for (const pr of state.pulseRings) {
        const pos = FACTION_POSITIONS[pr.factionId];
        const color = FACTION_COLORS[pr.factionId];
        ctx.beginPath();
        ctx.arc(pos.x * W, pos.y * H, pr.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = pr.alpha;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.globalAlpha = 1;
        pr.radius += dt * 40;
        pr.alpha -= dt * 0.8;
      }

      // ── Faction bases ──
      const factions = factionsRef.current;
      for (let fi = 0; fi < 10; fi++) {
        const pos = FACTION_POSITIONS[fi];
        const color = FACTION_COLORS[fi];
        const cx = pos.x * W;
        const cy = pos.y * H;
        const faction = factions.find((f) => Number(f.id) % 10 === fi);

        // Hex fill
        hexPath(ctx, cx, cy, 24);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.12;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Hex stroke
        hexPath(ctx, cx, cy, 24);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Short name
        ctx.fillStyle = color;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pos.shortName, cx, cy - 4);

        // Coherence
        const coh = faction ? faction.coherence.toFixed(1) : "?";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(coh, cx, cy + 6);

        // Name below hex
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.font = "7px 'JetBrains Mono', monospace";
        ctx.fillText(pos.name, cx, cy + 34);
      }
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      // ── Patrol drones ──
      for (const drone of state.drones) {
        if (drone.state !== "patrol") continue;
        const pos = FACTION_POSITIONS[drone.factionId];
        drone.orbitAngle += drone.speed;
        drone.x = pos.x * W + Math.cos(drone.orbitAngle) * drone.orbitRadius;
        drone.y = pos.y * H + Math.sin(drone.orbitAngle) * drone.orbitRadius;
        drone.angle = drone.orbitAngle + Math.PI / 2;
        const color = FACTION_COLORS[drone.factionId];
        drawTriangle(ctx, drone.x, drone.y, drone.angle, 4, color, 0.7);
      }

      // ── Engagement animations ──
      state.animations = state.animations.filter((anim) => {
        if (anim.phase === "flight") {
          anim.progress += dt * 0.45;
          if (anim.progress >= 1) {
            anim.progress = 1;
            anim.phase = "explosion";
            anim.explodeTimer = 0;
            // Spawn particles
            const count = 30;
            for (let i = 0; i < count; i++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = 30 + Math.random() * 80;
              state.particles.push({
                x: anim.endX,
                y: anim.endY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: anim.color,
                size: 1.5 + Math.random() * 2,
              });
            }
          }

          // Draw flight path bezier line
          ctx.beginPath();
          ctx.strokeStyle = anim.color;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 5]);
          ctx.moveTo(anim.startX, anim.startY);
          ctx.quadraticCurveTo(
            anim.bezierCx,
            anim.bezierCy,
            anim.endX,
            anim.endY,
          );
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;

          // Draw sortie drones along bezier
          for (let i = 0; i < anim.drones.length; i++) {
            const offset = (i / anim.drones.length) * 0.12;
            const t = Math.max(0, Math.min(1, anim.progress - offset));
            const x = quadBezier(anim.startX, anim.bezierCx, anim.endX, t);
            const y = quadBezier(anim.startY, anim.bezierCy, anim.endY, t);
            const tx2 = quadBezier(
              anim.startX,
              anim.bezierCx,
              anim.endX,
              Math.min(1, t + 0.01),
            );
            const ty2 = quadBezier(
              anim.startY,
              anim.bezierCy,
              anim.endY,
              Math.min(1, t + 0.01),
            );
            const angle = Math.atan2(ty2 - y, tx2 - x);
            drawTriangle(ctx, x, y, angle, 5, anim.color, 0.9);
          }
          return true;
        }

        if (anim.phase === "explosion") {
          anim.explodeTimer += dt;
          if (anim.explodeTimer >= 0.5) {
            anim.phase = "returning";
            anim.progress = 0;
          }
          return true;
        }

        if (anim.phase === "returning") {
          anim.progress += dt * 0.6;
          if (anim.progress >= 1) return false;

          const outcome = anim.outcome.toLowerCase();
          let surviving = anim.drones.length;
          if (outcome.includes("destroy")) surviving = 0;
          else if (
            outcome.includes("hit") ||
            outcome.includes("evad") ||
            outcome.includes("retreat")
          )
            surviving = Math.ceil(anim.drones.length * 0.5);

          for (let i = 0; i < surviving; i++) {
            const t = anim.progress;
            const x =
              lerp(anim.endX, anim.startX, t) + (Math.random() - 0.5) * 6;
            const y =
              lerp(anim.endY, anim.startY, t) + (Math.random() - 0.5) * 6;
            const angle = Math.atan2(
              anim.startY - anim.endY,
              anim.startX - anim.endX,
            );
            drawTriangle(ctx, x, y, angle, 4, anim.color, 0.5);
          }
          return true;
        }
        return false;
      });

      // ── Explosion particles ──
      state.particles = state.particles.filter((p) => p.life > 0);
      for (const p of state.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life -= dt * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore(); // End camera transform

      // ── HUD overlay (not affected by camera) ──
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("SIMULATION WORLD", 14, 20);

      ctx.fillStyle = "rgba(0,229,255,0.6)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(
        `ZOOM ${cam.zoom.toFixed(1)}x  •  DBL-CLICK TO RESET VIEW`,
        14,
        34,
      );

      // Mini legend bottom-left
      const legendY = H - 12;
      let lx = 14;
      for (let i = 0; i < 3; i++) {
        const pos = FACTION_POSITIONS[i];
        const color = FACTION_COLORS[i];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(lx + 4, legendY - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(pos.shortName, lx + 10, legendY);
        lx += 52;
      }
      ctx.textAlign = "left";
    },
    [],
  );

  return {
    drawFrame,
    updateFactions,
    updateEngagements,
    getCamera,
    setupCamera,
  };
}

function drawContinents(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = "#1a3a4a";

  // North America blob
  ctx.beginPath();
  ctx.moveTo(W * 0.05, H * 0.15);
  ctx.bezierCurveTo(W * 0.08, H * 0.1, W * 0.25, H * 0.1, W * 0.3, H * 0.18);
  ctx.bezierCurveTo(W * 0.35, H * 0.25, W * 0.34, H * 0.45, W * 0.28, H * 0.52);
  ctx.bezierCurveTo(W * 0.2, H * 0.58, W * 0.1, H * 0.5, W * 0.06, H * 0.38);
  ctx.bezierCurveTo(W * 0.02, H * 0.28, W * 0.03, H * 0.2, W * 0.05, H * 0.15);
  ctx.fill();

  // Europe + Russia blob
  ctx.beginPath();
  ctx.moveTo(W * 0.4, H * 0.15);
  ctx.bezierCurveTo(W * 0.45, H * 0.1, W * 0.75, H * 0.08, W * 0.88, H * 0.2);
  ctx.bezierCurveTo(W * 0.92, H * 0.28, W * 0.85, H * 0.38, W * 0.75, H * 0.4);
  ctx.bezierCurveTo(W * 0.65, H * 0.42, W * 0.58, H * 0.38, W * 0.55, H * 0.32);
  ctx.bezierCurveTo(W * 0.5, H * 0.28, W * 0.42, H * 0.32, W * 0.4, H * 0.28);
  ctx.bezierCurveTo(W * 0.38, H * 0.22, W * 0.38, H * 0.18, W * 0.4, H * 0.15);
  ctx.fill();

  // Africa blob
  ctx.beginPath();
  ctx.moveTo(W * 0.42, H * 0.4);
  ctx.bezierCurveTo(W * 0.5, H * 0.36, W * 0.6, H * 0.38, W * 0.62, H * 0.45);
  ctx.bezierCurveTo(W * 0.64, H * 0.55, W * 0.58, H * 0.72, W * 0.52, H * 0.75);
  ctx.bezierCurveTo(W * 0.46, H * 0.72, W * 0.4, H * 0.6, W * 0.4, H * 0.5);
  ctx.bezierCurveTo(W * 0.4, H * 0.44, W * 0.4, H * 0.42, W * 0.42, H * 0.4);
  ctx.fill();

  // Asia + SE Asia blob
  ctx.beginPath();
  ctx.moveTo(W * 0.6, H * 0.28);
  ctx.bezierCurveTo(W * 0.68, H * 0.22, W * 0.9, H * 0.25, W * 0.95, H * 0.38);
  ctx.bezierCurveTo(W * 0.98, H * 0.48, W * 0.9, H * 0.6, W * 0.8, H * 0.62);
  ctx.bezierCurveTo(W * 0.72, H * 0.6, W * 0.65, H * 0.55, W * 0.62, H * 0.48);
  ctx.bezierCurveTo(W * 0.58, H * 0.4, W * 0.58, H * 0.32, W * 0.6, H * 0.28);
  ctx.fill();

  // South America blob
  ctx.beginPath();
  ctx.moveTo(W * 0.18, H * 0.52);
  ctx.bezierCurveTo(W * 0.25, H * 0.5, W * 0.33, H * 0.52, W * 0.33, H * 0.62);
  ctx.bezierCurveTo(W * 0.33, H * 0.75, W * 0.25, H * 0.85, W * 0.2, H * 0.85);
  ctx.bezierCurveTo(W * 0.14, H * 0.8, W * 0.13, H * 0.68, W * 0.15, H * 0.58);
  ctx.bezierCurveTo(W * 0.16, H * 0.55, W * 0.17, H * 0.52, W * 0.18, H * 0.52);
  ctx.fill();

  ctx.restore();
}
