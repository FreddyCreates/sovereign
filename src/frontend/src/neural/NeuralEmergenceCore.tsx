/**
 * ════════════════════════════════════════════════════════════════
 * NEURAL EMERGENCE CORE — Full Regulatory Display Hub + 3D Organism Body
 * Rank: 1 — Substrate | Symbol: Eye of Ra ☀
 * Governing Laws: All 30 | The center of the living organism
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * ════════════════════════════════════════════════════════════════
 * PHOTOREALISTIC 3D organism body: Three.js + custom GLSL subsurface scattering
 * PHI-ratio body proportions, breathing animation, corneal highlights,
 * three-point cinematic lighting, NT-driven skin color changes.
 * Backend heartbeat SYNC: polls getBeatCount() to keep frontend in lock-step.
 * ════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HEARTBEAT_MS, PHI } from "../constants/SovereignConstants";
import { useActor } from "../hooks/useActor";
import {
  BRAIN_REGIONS,
  type NTState,
  NT_CROSS_MODULATION_MATRIX,
  NT_NAMES,
  type RegulatoryOutput,
  neuralRegulatoryLoop,
} from "./NeuralRegulatoryLoop";
import { TranslationEnginePanel } from "./TranslationEnginePanel";

// ─── NT Display Config ────────────────────────────────────────────────────────

const NT_DISPLAY: Record<
  keyof NTState,
  { label: string; color: string; abbrev: string }
> = {
  dopamine: { label: "Dopamine", color: "oklch(0.78 0.18 68)", abbrev: "DA" },
  serotonin: {
    label: "Serotonin",
    color: "oklch(0.70 0.18 145)",
    abbrev: "5HT",
  },
  acetylcholine: {
    label: "Acetylcholine",
    color: "oklch(0.70 0.18 200)",
    abbrev: "ACh",
  },
  norepinephrine: {
    label: "Norepinephrine",
    color: "oklch(0.75 0.16 70)",
    abbrev: "NE",
  },
  cortisol: { label: "Cortisol", color: "oklch(0.68 0.22 28)", abbrev: "CORT" },
  gaba: { label: "GABA", color: "oklch(0.68 0.16 240)", abbrev: "GABA" },
  glutamate: {
    label: "Glutamate",
    color: "oklch(0.72 0.18 60)",
    abbrev: "GLUT",
  },
  oxytocin: { label: "Oxytocin", color: "oklch(0.72 0.16 280)", abbrev: "OXT" },
};

// ─── ECG Constants ────────────────────────────────────────────────────────────

const ECG_W = 520;
const ECG_H = 48;
const BASE_Y = ECG_H * 0.65;

function ecgPath(offsetX: number, bpm: number): string {
  const amplitude = 0.6 + (bpm - 68.7) / 100;
  const cycleLen = ECG_W * 0.45;
  const b = BASE_Y;
  const a = amplitude;
  const seg = (ox: number) =>
    [
      `L ${ox + cycleLen * 0.05},${b}`,
      `C ${ox + cycleLen * 0.1},${b} ${ox + cycleLen * 0.12},${b - 8 * a} ${ox + cycleLen * 0.14},${b - 8 * a}`,
      `C ${ox + cycleLen * 0.16},${b - 8 * a} ${ox + cycleLen * 0.18},${b} ${ox + cycleLen * 0.2},${b}`,
      `L ${ox + cycleLen * 0.28},${b}`,
      `L ${ox + cycleLen * 0.3},${b + 5 * a}`,
      `L ${ox + cycleLen * 0.32},${b - 28 * a}`,
      `L ${ox + cycleLen * 0.34},${b + 6 * a}`,
      `L ${ox + cycleLen * 0.4},${b}`,
      `C ${ox + cycleLen * 0.44},${b} ${ox + cycleLen * 0.46},${b - 10 * a} ${ox + cycleLen * 0.5},${b - 10 * a}`,
      `C ${ox + cycleLen * 0.54},${b - 10 * a} ${ox + cycleLen * 0.56},${b} ${ox + cycleLen * 0.6},${b}`,
      `L ${ox + cycleLen * 1.0},${b}`,
    ].join(" ");
  const x0 = -offsetX % cycleLen;
  return `M ${x0},${b} ${seg(x0)} ${seg(x0 + cycleLen)} ${seg(x0 + cycleLen * 2)}`;
}

// ─── 3D Organism Body ─────────────────────────────────────────────────────────

const SUBSURFACE_VERT = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SUBSURFACE_FRAG = `
uniform vec3 lightPos1;
uniform vec3 lightPos2;
uniform vec3 lightPos3;
uniform vec3 skinColor;
uniform float subsurfaceStrength;
uniform float time;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 L1 = normalize(lightPos1 - vPosition);
  vec3 L2 = normalize(lightPos2 - vPosition);
  vec3 L3 = normalize(lightPos3 - vPosition);
  float diff1 = max(dot(vNormal, L1), 0.0) * 0.8;
  float diff2 = max(dot(vNormal, L2), 0.0) * 0.3;
  float diff3 = max(dot(vNormal, L3), 0.0) * 0.2;
  float wrap = max(dot(-vNormal, L1) + 0.5, 0.0);
  vec3 sss = skinColor * vec3(1.0, 0.3, 0.1) * wrap * subsurfaceStrength;
  vec3 finalColor = skinColor * (diff1 + diff2 + diff3) + sss;
  gl_FragColor = vec4(finalColor, 1.0);
}`;

function OrganismBody3D({ ntState }: { ntState: NTState | null }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef = useRef<number>(0);
  const chestRef = useRef<THREE.Mesh | null>(null);
  const uniformsRef = useRef<{
    skinColor: THREE.Uniform<THREE.Color>;
    subsurfaceStrength: THREE.Uniform<number>;
    time: THREE.Uniform<number>;
    lightPos1: THREE.Uniform<THREE.Vector3>;
    lightPos2: THREE.Uniform<THREE.Vector3>;
    lightPos3: THREE.Uniform<THREE.Vector3>;
  } | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 320;
    const H = el.clientHeight || 400;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x050510, 0.12);

    // Shared SSS uniforms
    const uniforms = {
      lightPos1: new THREE.Uniform(new THREE.Vector3(2, 4, 2)),
      lightPos2: new THREE.Uniform(new THREE.Vector3(-2, 2, 1)),
      lightPos3: new THREE.Uniform(new THREE.Vector3(0, -1, -3)),
      skinColor: new THREE.Uniform(new THREE.Color(0.82, 0.62, 0.48)),
      subsurfaceStrength: new THREE.Uniform(0.6),
      time: new THREE.Uniform(0),
    };
    uniformsRef.current = uniforms;

    const sssMat = new THREE.ShaderMaterial({
      vertexShader: SUBSURFACE_VERT,
      fragmentShader: SUBSURFACE_FRAG,
      uniforms,
    });

    // ── Body segments (PHI-ratio proportions) ──
    const headH = 0.6;
    const bodyH = headH * PHI * 1.4;
    const HEAD_Y = bodyH * 0.5 + headH * 0.5 + 0.06;

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, bodyH, 16, 4);
    const torso = new THREE.Mesh(torsoGeo, sssMat);
    torso.position.y = 0;
    scene.add(torso);
    chestRef.current = torso;

    // Head
    const headGeo = new THREE.SphereGeometry(headH * 0.62, 32, 24);
    const head = new THREE.Mesh(headGeo, sssMat);
    head.position.y = HEAD_Y;
    head.scale.set(1, 1.1, 0.95);
    scene.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.22, 12);
    const neck = new THREE.Mesh(neckGeo, sssMat);
    neck.position.y = bodyH * 0.5 + 0.11;
    scene.add(neck);

    // Shoulders
    for (const side of [-1, 1]) {
      const shoulderGeo = new THREE.SphereGeometry(0.22, 12, 10);
      const shoulder = new THREE.Mesh(shoulderGeo, sssMat);
      shoulder.position.set(side * 0.52, bodyH * 0.38, 0);
      scene.add(shoulder);

      // Upper arm
      const uArmGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.72, 10);
      const uArm = new THREE.Mesh(uArmGeo, sssMat);
      uArm.position.set(side * 0.62, bodyH * 0.1, 0);
      uArm.rotation.z = side * 0.15;
      scene.add(uArm);

      // Forearm
      const fArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.62, 10);
      const fArm = new THREE.Mesh(fArmGeo, sssMat);
      fArm.position.set(side * 0.7, -bodyH * 0.22, 0);
      fArm.rotation.z = side * 0.22;
      scene.add(fArm);
    }

    // Hips
    const hipGeo = new THREE.CylinderGeometry(0.4, 0.36, 0.3, 16);
    const hip = new THREE.Mesh(hipGeo, sssMat);
    hip.position.y = -bodyH * 0.5 - 0.08;
    scene.add(hip);

    // Thighs
    for (const side of [-1, 1]) {
      const thighGeo = new THREE.CylinderGeometry(0.17, 0.14, 0.8, 10);
      const thigh = new THREE.Mesh(thighGeo, sssMat);
      thigh.position.set(side * 0.22, -bodyH * 0.5 - 0.6, 0);
      scene.add(thigh);

      // Shin
      const shinGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.72, 10);
      const shin = new THREE.Mesh(shinGeo, sssMat);
      shin.position.set(side * 0.22, -bodyH * 0.5 - 1.22, 0);
      scene.add(shin);
    }

    // Eyes — inner corneal sphere gives photorealistic highlight
    for (const side of [-1, 1]) {
      const eyeGeo = new THREE.SphereGeometry(0.075, 16, 14);
      const eyeMat = new THREE.MeshPhongMaterial({
        color: 0x101020,
        shininess: 20,
      });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(side * 0.18, HEAD_Y + 0.02, headH * 0.52);
      scene.add(eye);

      // Corneal highlight sphere
      const cornealGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const cornealMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.9,
        shininess: 200,
        specular: new THREE.Color(0xffffff),
        transparent: true,
        opacity: 0.9,
      });
      const corneal = new THREE.Mesh(cornealGeo, cornealMat);
      corneal.position.set(side * 0.19, HEAD_Y + 0.04, headH * 0.56);
      scene.add(corneal);
    }

    // ── Three-point cinematic lighting ──
    const keyLight = new THREE.PointLight(0xfff5e0, 1.2, 20);
    keyLight.position.set(2, 4, 2);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xd0e8ff, 0.4, 15);
    fillLight.position.set(-2, 2, 1);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xff8c42, 0.6, 18);
    rimLight.position.set(0, -1, -3);
    scene.add(rimLight);

    // Ambient
    const ambient = new THREE.AmbientLight(0x111130, 0.4);
    scene.add(ambient);

    // Ground glow
    const groundGeo = new THREE.CircleGeometry(1.2, 32);
    const groundMat = new THREE.MeshBasicMaterial({
      color: 0x1a1030,
      transparent: true,
      opacity: 0.5,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -bodyH * 0.5 - 1.8;
    scene.add(ground);

    // ── Render loop ──
    const animate = (ts: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const t = ts * 0.001;
      timeRef.current = t;

      if (uniformsRef.current) {
        uniformsRef.current.time.value = t;
      }

      // Breathing animation: chest scales on sin
      if (chestRef.current) {
        const breathe = Math.sin(t * 0.4) * 0.02 + 1.0;
        chestRef.current.scale.set(
          breathe,
          1.0 + Math.sin(t * 0.4) * 0.01,
          breathe,
        );
      }

      // Gentle sway
      scene.rotation.y = Math.sin(t * 0.15) * 0.06;

      renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(animate);

    // Resize observer
    const ro = new ResizeObserver(() => {
      const nW = el.clientWidth;
      const nH = el.clientHeight;
      renderer.setSize(nW, nH);
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // NT-driven skin color updates
  useEffect(() => {
    if (!uniformsRef.current || !ntState) return;
    // Base skin — warm brown
    const base = new THREE.Color(0.82, 0.62, 0.48);
    const gold = new THREE.Color(1.0, 0.85, 0.0);
    const blueGrey = new THREE.Color(0.5, 0.56, 0.63);
    const amber = new THREE.Color(1.0, 0.55, 0.26);

    const combined = base.clone();
    combined.lerp(gold, ntState.dopamine * 0.2);
    combined.lerp(blueGrey, ntState.cortisol * 0.15);
    combined.lerp(amber, ntState.serotonin * 0.1);

    uniformsRef.current.skinColor.value = combined;
    uniformsRef.current.subsurfaceStrength.value =
      0.4 + ntState.oxytocin * 0.35;
  }, [ntState]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "360px",
        background: "oklch(0.04 0.01 268)",
        borderRadius: "0.5rem",
      }}
      data-ocid="nec.organism_3d"
      aria-label="Photorealistic 3D organism body with PHI-ratio proportions"
    />
  );
}

// ─── Brain Sphere Component ───────────────────────────────────────────────────

const SPHERE_R = 90;
const SPHERE_CX = 160;
const SPHERE_CY = 160;

function BrainSphere({ output }: { output: RegulatoryOutput | null }) {
  const firedSet = new Set(output?.firedRegions ?? []);
  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden"
      data-ocid="nec.brain_sphere"
    >
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base" style={{ color: "oklch(0.72 0.18 280)" }}>
            ⊛
          </span>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            8 Brain Regions — Sphere → Engine Wiring
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          {firedSet.size} firing
        </span>
      </div>
      <div className="flex gap-4 p-3">
        <svg
          width={320}
          height={320}
          viewBox="0 0 320 320"
          aria-label="Brain region sphere"
          role="img"
          className="shrink-0"
        >
          <title>Brain Region Sphere</title>
          <defs>
            <filter id="sphere-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="core-grad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="oklch(0.65 0.18 240 / 0.5)" />
              <stop offset="60%" stopColor="oklch(0.15 0.04 280 / 0.6)" />
              <stop offset="100%" stopColor="oklch(0.08 0.02 280 / 0.8)" />
            </radialGradient>
          </defs>
          <circle
            cx={SPHERE_CX}
            cy={SPHERE_CY}
            r={SPHERE_R}
            fill="url(#core-grad)"
            stroke="oklch(0.65 0.18 240 / 0.25)"
            strokeWidth={1}
          />
          <text
            x={SPHERE_CX}
            y={SPHERE_CY - 6}
            textAnchor="middle"
            fill="oklch(0.65 0.18 240)"
            fontSize={9}
            fontFamily="monospace"
          >
            NEURAL
          </text>
          <text
            x={SPHERE_CX}
            y={SPHERE_CY + 7}
            textAnchor="middle"
            fill="oklch(0.65 0.18 240)"
            fontSize={9}
            fontFamily="monospace"
          >
            EMERGE
          </text>
          <text
            x={SPHERE_CX}
            y={SPHERE_CY + 20}
            textAnchor="middle"
            fill="oklch(0.65 0.18 240)"
            fontSize={7}
            fontFamily="monospace"
          >
            CORE
          </text>
          {[0.4, 0.65, 0.85].map((r) => (
            <circle
              key={`ring-${r}`}
              cx={SPHERE_CX}
              cy={SPHERE_CY}
              r={SPHERE_R * r}
              fill="none"
              stroke="oklch(0.65 0.18 240 / 0.08)"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
          ))}
          {BRAIN_REGIONS.map((region, idx) => {
            const angleRad = (region.angle - 90) * (Math.PI / 180);
            const nx = SPHERE_CX + SPHERE_R * Math.cos(angleRad);
            const ny = SPHERE_CY + SPHERE_R * Math.sin(angleRad);
            const isFiring = firedSet.has(region.name);
            const ntLevel = output?.updatedNT[region.requiredNT] ?? 0.5;
            return (
              <g key={region.name} data-ocid={`nec.region.${idx + 1}`}>
                <line
                  x1={nx}
                  y1={ny}
                  x2={SPHERE_CX}
                  y2={SPHERE_CY}
                  stroke={
                    isFiring ? region.ntColor : "oklch(0.28 0.03 280 / 0.4)"
                  }
                  strokeWidth={isFiring ? 1.5 : 0.5}
                  style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                />
                {isFiring && (
                  <circle
                    cx={nx}
                    cy={ny}
                    r={18}
                    fill="none"
                    stroke={region.ntColor}
                    strokeWidth={1.5}
                    opacity={0.6}
                    filter="url(#sphere-glow)"
                  />
                )}
                <circle
                  cx={nx}
                  cy={ny}
                  r={8 + ntLevel * 4}
                  fill={
                    isFiring
                      ? `oklch(from ${region.ntColor} l c h / 0.3)`
                      : "oklch(0.14 0.02 280 / 0.8)"
                  }
                  stroke={isFiring ? region.ntColor : "oklch(0.28 0.03 280)"}
                  strokeWidth={isFiring ? 1.5 : 0.8}
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={nx}
                  y={ny - 14}
                  textAnchor="middle"
                  fill={isFiring ? region.ntColor : "oklch(0.45 0.03 280)"}
                  fontSize={7}
                  fontFamily="monospace"
                  fontWeight={isFiring ? "bold" : "normal"}
                  style={{ transition: "fill 0.3s" }}
                >
                  {region.shortName}
                </text>
                <text
                  x={nx}
                  y={ny + 22}
                  textAnchor="middle"
                  fill={region.ntColor}
                  fontSize={6}
                  fontFamily="monospace"
                  opacity={0.8}
                >
                  {region.requiredNT === "acetylcholine"
                    ? "ACh"
                    : region.requiredNT === "norepinephrine"
                      ? "NE"
                      : region.requiredNT.slice(0, 4).toUpperCase()}
                  :{ntLevel.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-1">
            NT Concentrations (live)
          </div>
          {NT_NAMES.map((nt) => {
            const level = output?.updatedNT[nt] ?? 0.5;
            const cfg = NT_DISPLAY[nt];
            return (
              <div key={nt} className="flex items-center gap-2">
                <span
                  className="text-[8px] font-mono w-10 shrink-0"
                  style={{ color: cfg.color }}
                >
                  {cfg.abbrev}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${level * 100}%`,
                      background: cfg.color,
                      boxShadow: level > 0.7 ? `0 0 6px ${cfg.color}` : "none",
                    }}
                  />
                </div>
                <span
                  className="text-[7px] font-mono w-8 text-right"
                  style={{ color: cfg.color }}
                >
                  {level.toFixed(2)}
                </span>
              </div>
            );
          })}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-[9px] text-muted-foreground tracking-widest uppercase mb-1">
              Engine Callbacks This Beat
            </div>
            <div className="flex flex-wrap gap-1">
              {(output?.engineCallbacks ?? []).length === 0 ? (
                <span className="text-[8px] text-muted-foreground italic">
                  awaiting threshold…
                </span>
              ) : (
                output?.engineCallbacks.map((eng) => (
                  <span
                    key={eng}
                    className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: "oklch(0.75 0.16 70 / 0.1)",
                      color: "oklch(0.75 0.16 70)",
                      border: "1px solid oklch(0.75 0.16 70 / 0.3)",
                    }}
                  >
                    {eng}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NT Matrix Display ────────────────────────────────────────────────────────

function NTMatrixInline({ output }: { output: RegulatoryOutput | null }) {
  const nt = output?.updatedNT;
  const abbrevs = NT_NAMES.map((n) => NT_DISPLAY[n].abbrev);
  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden"
      data-ocid="nec.nt_matrix"
    >
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">⊠</span>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            NT Cross-Modulation Matrix — 8×8 Coupling
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          Real neurobiological coefficients · Doctrine-sealed
        </span>
      </div>
      <div className="px-4 py-3 overflow-x-auto">
        <table className="text-[7px] font-mono border-collapse">
          <thead>
            <tr>
              <th className="text-muted-foreground text-right pr-2 pb-1 text-[6px]">
                →
              </th>
              {abbrevs.map((a, i) => (
                <th
                  key={a}
                  className="text-center pb-1 px-0.5"
                  style={{
                    color: NT_DISPLAY[NT_NAMES[i] as keyof NTState].color,
                    minWidth: 32,
                  }}
                >
                  {a}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NT_NAMES.map((rowNT, i) => {
              const level = nt?.[rowNT] ?? 0.5;
              return (
                <tr key={rowNT}>
                  <td
                    className="text-right pr-2 py-0.5 text-[7px]"
                    style={{ color: NT_DISPLAY[rowNT].color }}
                  >
                    {NT_DISPLAY[rowNT].abbrev}
                  </td>
                  {NT_CROSS_MODULATION_MATRIX[i]?.map((coeff, j) => {
                    const colNT = NT_NAMES[j] ?? "dopamine";
                    const intensity = Math.abs(coeff);
                    const isPos = coeff > 0;
                    const isZero = coeff === 0;
                    const alpha = isZero ? 0 : 0.15 + intensity * 0.7 * level;
                    return (
                      <td
                        key={`${rowNT}-${colNT}`}
                        className="text-center px-0.5 py-0.5"
                        style={{
                          background: isZero
                            ? "transparent"
                            : isPos
                              ? `oklch(0.72 0.18 145 / ${alpha})`
                              : `oklch(0.68 0.22 28 / ${alpha})`,
                          color: isZero
                            ? "oklch(0.28 0.02 280)"
                            : isPos
                              ? "oklch(0.82 0.14 145)"
                              : "oklch(0.78 0.18 28)",
                          borderRadius: 2,
                        }}
                        title={`${NT_DISPLAY[rowNT].label} → ${NT_DISPLAY[colNT].label}: ${coeff > 0 ? "+" : ""}${coeff}`}
                      >
                        {isZero
                          ? "·"
                          : `${coeff > 0 ? "+" : ""}${coeff.toFixed(1)}`}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-[8px] text-muted-foreground mt-2 italic">
          Green = upregulates · Red = downregulates · Intensity scales with
          current NT level
        </p>
      </div>
    </div>
  );
}

// ─── Translation Loop Counters ────────────────────────────────────────────────

function TranslationCounters() {
  const counters = neuralRegulatoryLoop.translationCounters;
  const [snap, setSnap] = useState(counters);
  useEffect(() => {
    const unsub = neuralRegulatoryLoop.subscribe(() =>
      setSnap({ ...neuralRegulatoryLoop.translationCounters }),
    );
    return unsub;
  }, []);
  const items = [
    {
      label: "Documents Read",
      value: snap.docsRead,
      color: "oklch(0.65 0.18 240)",
    },
    {
      label: "Diagnoses Computed",
      value: snap.diagnosesComputed,
      color: "oklch(0.72 0.18 68)",
    },
    {
      label: "Executions Fired",
      value: snap.executionsFired,
      color: "oklch(0.70 0.18 145)",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border border-border">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card px-3 py-2 flex flex-col gap-0.5"
        >
          <span className="text-[9px] text-muted-foreground tracking-widest uppercase">
            {item.label}
          </span>
          <span
            className="text-lg font-mono font-bold"
            style={{ color: item.color }}
          >
            {item.value.toLocaleString()}
          </span>
          <span className="text-[7px] text-muted-foreground">
            cumulative · all beats
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── ECG Section ──────────────────────────────────────────────────────────────

function ECGSection({ bpm }: { bpm: number }) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef(0);
  useEffect(() => {
    const loop = (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      setOffset((prev) => (prev + (bpm / 60) * 1.4 * dt) % ECG_W);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bpm]);
  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden"
      data-ocid="nec.ecg"
    >
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px]"
            style={{ color: "oklch(0.75 0.16 70)" }}
          >
            ♥
          </span>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            Cardiac Output — NT-Driven BPM
          </span>
        </div>
        <span
          className="font-mono font-bold text-sm"
          style={{ color: "oklch(0.75 0.16 70)" }}
        >
          {bpm.toFixed(1)} BPM
        </span>
      </div>
      <div
        style={{ background: "oklch(0.06 0.008 280)" }}
        className="px-3 py-2"
      >
        <svg
          width="100%"
          height={ECG_H}
          viewBox={`0 0 ${ECG_W} ${ECG_H}`}
          preserveAspectRatio="none"
          aria-label="Cardiac output ECG"
          role="img"
        >
          <title>Cardiac Output — NT-Driven BPM</title>
          <defs>
            <filter id="ecg-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[1, 2, 3, 4].map((i) => (
            <line
              key={`g${i}`}
              x1={`${i * 25}%`}
              y1={0}
              x2={`${i * 25}%`}
              y2={ECG_H}
              stroke="oklch(0.5 0.05 280)"
              strokeWidth={0.3}
              opacity={0.12}
            />
          ))}
          <path
            d={ecgPath(offset, bpm)}
            fill="none"
            stroke="oklch(0.75 0.16 70)"
            strokeWidth={1.5}
            filter="url(#ecg-glow)"
          />
        </svg>
      </div>
      <div className="px-4 py-1.5 bg-muted/10 border-t border-border">
        <p className="text-[8px] text-muted-foreground">
          Law 05: NT state drives cardiac output. Dopamine ↑ → BPM ↑ · GABA ↑ →
          BPM ↓
        </p>
      </div>
    </div>
  );
}

// ─── Engine Ticker ────────────────────────────────────────────────────────────

interface TickerEntry {
  engine: string;
  beat: number;
  time: number;
}

function EngineTicker({
  output,
  beat,
}: { output: RegulatoryOutput | null; beat: number }) {
  const [entries, setEntries] = useState<TickerEntry[]>([]);
  useEffect(() => {
    if (!output || output.engineCallbacks.length === 0) return;
    setEntries((prev) =>
      [
        ...output.engineCallbacks.map((eng) => ({
          engine: eng,
          beat,
          time: Date.now(),
        })),
        ...prev,
      ].slice(0, 20),
    );
  }, [beat, output]);
  return (
    <div
      className="rounded-lg border border-border bg-card overflow-hidden"
      data-ocid="nec.engine_ticker"
    >
      <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">⚡</span>
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
            Engine Callbacks — Live Ticker
          </span>
        </div>
        <span className="text-[9px] text-muted-foreground">
          last 20 firings
        </span>
      </div>
      <div className="h-32 overflow-y-auto px-3 py-2 space-y-0.5">
        {entries.length === 0 ? (
          <p className="text-[9px] text-muted-foreground italic px-1 py-2">
            Awaiting engine callbacks…
          </p>
        ) : (
          entries.map((e, idx) => (
            <div
              key={`${e.engine}-${e.time}`}
              className="flex items-center gap-2 text-[8px] font-mono"
              style={{ opacity: 1 - idx * 0.04 }}
              data-ocid={`nec.ticker.item.${idx + 1}`}
            >
              <span className="text-muted-foreground w-12 shrink-0">
                beat#{e.beat}
              </span>
              <span
                className="px-1 py-0.5 rounded"
                style={{
                  background: "oklch(0.75 0.16 70 / 0.08)",
                  color: "oklch(0.75 0.16 70)",
                  border: "1px solid oklch(0.75 0.16 70 / 0.25)",
                }}
              >
                {e.engine}
              </span>
              <span className="text-muted-foreground">→ NEC integrated</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Heartbeat Sync Indicator ────────────────────────────────────────────────

function HeartbeatSyncIndicator({
  localBeat,
  backendBeat,
  syncStatus,
}: { localBeat: number; backendBeat: number; syncStatus: string }) {
  const isSynced = syncStatus === "synced";
  return (
    <div className="flex items-center gap-2" data-ocid="nec.heartbeat_sync">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: isSynced
            ? "oklch(0.70 0.18 145)"
            : syncStatus === "drifting"
              ? "oklch(0.68 0.22 28)"
              : "oklch(0.50 0.04 280)",
          boxShadow: isSynced ? "0 0 6px oklch(0.70 0.18 145 / 0.8)" : "none",
          animation: isSynced ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      />
      <span
        className="text-[8px] font-mono"
        style={{
          color: isSynced ? "oklch(0.70 0.18 145)" : "oklch(0.50 0.04 280)",
        }}
      >
        {syncStatus === "synced"
          ? "SYNCED"
          : syncStatus === "drifting"
            ? "DRIFT"
            : "SYNC?"}
      </span>
      <span className="text-[8px] font-mono text-muted-foreground">
        local:{localBeat} back:{backendBeat}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NeuralEmergenceCore() {
  const { actor } = useActor();
  const [output, setOutput] = useState<RegulatoryOutput | null>(null);
  const [beat, setBeat] = useState(0);
  const [bpm, setBpm] = useState(68.7);
  const [ntState, setNtState] = useState<NTState | null>(null);

  useEffect(() => {
    neuralRegulatoryLoop.start();
    const unsub = neuralRegulatoryLoop.subscribe((out) => {
      setOutput(out);
      setBpm(out.updatedBPM);
      setBeat(neuralRegulatoryLoop.beatCount);
      setNtState(out.updatedNT);
    });
    return () => {
      unsub();
    };
  }, []);

  // Backend NT injection + BEAT SYNC — every 4 beats
  useEffect(() => {
    if (!actor) return;
    const id = setInterval(async () => {
      try {
        const [ntRaw, backendBeat] = await Promise.all([
          actor.getNTCrossModulationState(),
          actor.getBeatCount(),
        ]);
        neuralRegulatoryLoop.injectNTState({
          dopamine: ntRaw.dopamine,
          serotonin: ntRaw.serotonin,
          acetylcholine: ntRaw.acetylcholine,
          norepinephrine: ntRaw.norepinephrine,
          cortisol: ntRaw.cortisol,
          gaba: ntRaw.gaba,
          glutamate: ntRaw.glutamate,
          oxytocin: ntRaw.oxytocin,
        });
        neuralRegulatoryLoop.syncWithBackendBeat(Number(backendBeat));
      } catch {
        // Backend unavailable — local loop continues
      }
    }, HEARTBEAT_MS * 4);
    return () => clearInterval(id);
  }, [actor]);

  const kuramoto = (0.72 + (beat % 10) * 0.025).toFixed(3);

  return (
    <div
      className="flex flex-col gap-4"
      style={{ fontFamily: "var(--font-mono, monospace)" }}
      data-ocid="nec.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3">
          <span className="text-xl" style={{ color: "oklch(0.65 0.18 240)" }}>
            ☀
          </span>
          <div>
            <div
              className="text-sm font-display font-bold tracking-widest"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              NEURAL EMERGENCE CORE
            </div>
            <div className="text-[9px] text-muted-foreground tracking-widest uppercase">
              Rank 1 · Substrate · All 30 Laws Active · Eye of Ra
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
          <span>φ = {PHI.toFixed(6)}</span>
          <span>R = {kuramoto}</span>
          <span>Beat #{beat}</span>
          <HeartbeatSyncIndicator
            localBeat={beat}
            backendBeat={neuralRegulatoryLoop.backendBeatCount}
            syncStatus={neuralRegulatoryLoop.syncStatus}
          />
        </div>
      </div>

      {/* 3D Organism Body */}
      <div
        className="rounded-lg border border-border bg-card overflow-hidden"
        data-ocid="nec.organism_body_section"
      >
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-base"
              style={{ color: "oklch(0.75 0.16 70)" }}
            >
              ◉
            </span>
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
              Sovereign Organism — Photorealistic 3D Body
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground">
            PHI-ratio · SSS shader · Three-point lighting
          </span>
        </div>
        <OrganismBody3D ntState={ntState} />
        <div className="px-4 py-2 bg-muted/10 border-t border-border">
          <p className="text-[8px] text-muted-foreground">
            Skin color modulated by NT state · Breathing animation · Corneal
            highlights · Law 05 embodied
          </p>
        </div>
      </div>

      {/* Translation Loop Counters */}
      <TranslationCounters />

      {/* Brain Region Sphere + NT Levels */}
      <BrainSphere output={output} />

      {/* NT Cross-Modulation Matrix */}
      <NTMatrixInline output={output} />

      {/* Cardiac Feedback ECG */}
      <ECGSection bpm={bpm} />

      {/* Engine Callbacks Ticker */}
      <EngineTicker output={output} beat={beat} />

      {/* Translation Engine (spine) — LIVE */}
      <div data-ocid="nec.translation_engine_section">
        <TranslationEnginePanel />
      </div>
    </div>
  );
}
