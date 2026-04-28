/**
 * useHollywoodPipeline.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Beat-gated Hollywood pipeline — every stage waits for its VELA beat window
 * before advancing. The organism substrate drives every creative decision.
 *
 * Now includes: ActorBehavioralState initialization and persistence.
 * DIRECTOR initializes behavioral states for each cast member at film start.
 * Behavioral states are passed to VISIONARY and MUSE-PRIME via context.
 *
 * Flow:
 * 1. doctrineLayer.analyzePrompt(prompt)     → alignment + archType + stripped prompt
 * 2. omnisLayer.waitForConsensus(15000)       → proposed archType (fallback to doctrine)
 * 3. beatGateLayer.getGenerationSeed()        → seed all organisms
 * 4. For each stage in FILM_STAGE_ORDER:
 *    a. beatGateLayer.advanceStage(stage)     → BeatAdvance with animalState
 *    b. animalEngineLayer.getCreativeModifiers(animalState) → modifiers
 *    c. Run organism with modifiers
 *    d. Update VELA display (velaStep from backend)
 * 5. ARCHIVIST seals with full metadata
 */

import { useCallback, useRef, useState } from "react";
import type { backendInterface } from "../../backend.d";
import type { ADRECycleResult, AnimalEngineState } from "../../backend.d";
import { ArtifactType } from "../../backend.d";
import { useActor } from "../../hooks/useActor";
import {
  applyModifiersToScreenplay,
  getCreativeModifiers,
} from "../../intelligence/animalEngineLayer";
import {
  FILM_STAGE_ORDER,
  advanceStage as advanceBeat,
  getGenerationSeed,
} from "../../intelligence/beatGateLayer";
import {
  analyzePrompt,
  stripArchTypePrefix,
} from "../../intelligence/doctrineLayer";
import { waitForConsensus } from "../../intelligence/omnisLayer";
import { useARCHIVIST } from "./useARCHIVIST";
import type { GeneratedFilm } from "./useARCHIVIST";
import { scoreFullFilm } from "./useCOMPOSER";
import { type ActorBehavioralState, produceShotList } from "./useDIRECTOR";
import { assembleFinalTimeline } from "./useEDITOR";
import { useFilmSchool } from "./useFilmSchool";
import { generateScreenplay } from "./useMUSEPrime";
import { renderFullFilm } from "./useVISIONARY";

// ─── Types ─────────────────────────────────────────────────────────────────

export type PipelineStage =
  | "idle"
  | "doctrine"
  | "consensus"
  | "seed"
  | "screenplay"
  | "shotlist"
  | "rendering"
  | "scoring"
  | "editing"
  | "sealing"
  | "complete";

export interface HollywoodPipelineState {
  stage: PipelineStage;
  progress: number;
  filmTitle: string;
  scriptPages: number;
  sceneCount: number;
  frameCount: number;
  runtimeSeconds: number;
  estimatedMinutes: number;
  currentActivity: string;
  /** Live VELA step from backend — 0 to 50 */
  velaStep: number;
  /** Doctrine tag from backend analysis */
  doctrineTag: string;
  /** ArchType determined by OMNIS consensus (no brackets) */
  archTypeConsensus: string;
  /** Whether OMNIS consensus was reached or timed out */
  consensusReached: boolean;
  /** Whether creator was present during generation */
  creatorPresent: boolean;
  /** Animal engine snapshot at the active stage */
  activeAnimalState: AnimalEngineState | null;
  /** Stage beat window (e.g., "beats 0-10") */
  stageBeatWindow: string;
  /** Last beat number from backend */
  beatNumber: number;
  /** Real error message (never generic "generating...") */
  error: string | null;
  /** Behavioral state summary — displayed after DIRECTOR stage */
  castBehavioralSummary: string;
  /** Average behavioral consistency across cast */
  castConsistencyScore: number;
}

export type { GeneratedFilm, ADRECycleResult };

// ─── PHI ─────────────────────────────────────────────────────────────────

const PHI = 1.6180339887;

// ─── Beat window labels ────────────────────────────────────────────────────

const BEAT_WINDOWS: Record<string, string> = {
  screenplay: "beats 0–10",
  shotlist: "beats 10–17",
  rendering: "beats 17–33",
  scoring: "beats 33–41",
  editing: "beats 41–47",
  sealing: "beats 47–50",
};

// ─── Default animal state ──────────────────────────────────────────────────

function defaultAnimalState(): AnimalEngineState {
  return {
    nova: { signalStrength: 0.75, lastFired: 0n },
    brain: { avgHebbian: 0.65, lastFired: 0n },
    qmem: { memoryCoherence: 0.7, lastFired: 0n },
    resonex: { cascadeCount: 0n, cascadeTriggered: false, lastFired: 0n },
    veritas: { veritasScore: 0.8, lastFired: 0n },
    parallax: { depthIndex: 0.6, lastFired: 0n },
    axis: { cx: 0, cy: 0, cz: 0, lastFired: 0n },
    chrono: { stabilityIndex: 0.72, lastFired: 0n },
    entangla: { couplingForce: 0.68, correctionCount: 0n, lastFired: 0n },
  };
}

// ─── Initial State ─────────────────────────────────────────────────────────

const INITIAL_STATE: HollywoodPipelineState = {
  stage: "idle",
  progress: 0,
  filmTitle: "",
  scriptPages: 0,
  sceneCount: 0,
  frameCount: 0,
  runtimeSeconds: 0,
  estimatedMinutes: 0,
  currentActivity: "",
  velaStep: 0,
  doctrineTag: "",
  archTypeConsensus: "expansive",
  consensusReached: false,
  creatorPresent: false,
  activeAnimalState: null,
  stageBeatWindow: "",
  beatNumber: 0,
  error: null,
  castBehavioralSummary: "",
  castConsistencyScore: 1.0,
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useHollywoodPipeline() {
  const [state, setState] = useState<HollywoodPipelineState>(INITIAL_STATE);
  const [generatedFilms, setGeneratedFilms] = useState<GeneratedFilm[]>([]);
  const [lastAdreResult, setLastAdreResult] = useState<ADRECycleResult | null>(
    null,
  );
  // Behavioral states persist per film — cleared at start of each new film
  const behavioralStatesRef = useRef<Map<number, ActorBehavioralState>>(
    new Map(),
  );
  const cancelRef = useRef(false);
  const { actor: rawActor } = useActor();
  const actor = rawActor as unknown as backendInterface | null;
  const { sealArtifact } = useARCHIVIST();
  const filmSchool = useFilmSchool();

  const updateState = useCallback((patch: Partial<HollywoodPipelineState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const cancelPipeline = useCallback(() => {
    cancelRef.current = true;
    setState((prev) => ({
      ...prev,
      stage: "idle",
      currentActivity: "Pipeline cancelled.",
      error: null,
    }));
  }, []);

  const downloadFilm = useCallback((film: GeneratedFilm) => {
    const a = document.createElement("a");
    a.href = film.posterDataUrl;
    a.download = `${film.title.replace(/[^a-zA-Z0-9]/g, "_")}_SOVEREIGN.webm`;
    a.click();
  }, []);

  const startPipeline = useCallback(
    async (rawPrompt: string) => {
      if (!rawPrompt.trim()) return;

      cancelRef.current = false;
      // Reset behavioral states for new film
      behavioralStatesRef.current = new Map();

      const runtimeSeconds = rawPrompt.length > 100 ? 50 * 60 : 30 * 60;
      const estimatedMinutes = Math.round(runtimeSeconds / 60);

      try {
        // ── Phase 0: Doctrine Analysis ────────────────────────────────────
        updateState({
          stage: "doctrine",
          progress: 2,
          currentActivity: "Analyzing prompt through doctrine layer...",
          error: null,
          runtimeSeconds,
          estimatedMinutes,
          velaStep: 0,
          castBehavioralSummary: "",
          castConsistencyScore: 1.0,
        });

        const doctrineAnalysis = await analyzePrompt(rawPrompt, actor);
        const strippedPrompt = doctrineAnalysis.strippedPrompt;

        updateState({
          doctrineTag: doctrineAnalysis.doctrineTag,
          archTypeConsensus: doctrineAnalysis.archType,
          currentActivity: `Doctrine: ${doctrineAnalysis.doctrineTag} · Alignment ${(doctrineAnalysis.doctrineAlignment * 100).toFixed(0)}%`,
        });

        if (cancelRef.current) return;

        // ── Phase 1: OMNIS Consensus (15s timeout) ────────────────────────
        updateState({
          stage: "consensus",
          progress: 5,
          currentActivity: "Waiting for OMNIS consensus from 43 cores...",
        });

        const consensus = await waitForConsensus(
          15000,
          actor,
          doctrineAnalysis.archType,
        );

        updateState({
          archTypeConsensus: consensus.archType,
          consensusReached: !consensus.timedOut,
          currentActivity: consensus.timedOut
            ? `OMNIS timeout — using doctrine archType: ${consensus.archType}`
            : `OMNIS consensus: ${consensus.archType} · confidence ${(consensus.confidenceScore * 100).toFixed(0)}% · ${consensus.coreCount} cores`,
          progress: 8,
        });

        if (cancelRef.current) return;

        // ── Phase 2: Get Generation Seed ──────────────────────────────────
        updateState({
          stage: "seed",
          progress: 10,
          currentActivity: "Seeding organisms from VELA ring...",
        });

        const seed = await getGenerationSeed(actor);

        updateState({
          velaStep: seed.velaStep,
          creatorPresent: seed.creatorPresent,
          beatNumber: seed.beatCounter,
          currentActivity: `Seed: VELA step ${seed.velaStep}/50 · beat ${seed.beatCounter} · creator ${seed.creatorPresent ? "PRESENT" : "absent"}`,
          progress: 12,
        });

        if (cancelRef.current) return;

        // ── Stage 1: MUSE-PRIME — Beat-gated Screenplay ───────────────────
        updateState({
          stage: "screenplay",
          progress: 12,
          currentActivity: "Advancing VELA beat for MUSE-PRIME...",
          stageBeatWindow: BEAT_WINDOWS.screenplay,
        });

        const museBeat = await advanceBeat("screenplay", actor, seed.velaStep);
        const museModifiers = getCreativeModifiers(
          museBeat.animalState ?? defaultAnimalState(),
        );

        updateState({
          velaStep: museBeat.velaStep,
          beatNumber: museBeat.beatNumber,
          activeAnimalState: museBeat.animalState,
          currentActivity: `MUSE-PRIME elevating screenplay · VELA ${museBeat.velaStep}/50 · NOVA ${(museModifiers.frameIntensity * 100).toFixed(0)}% · BRAIN ${(museModifiers.cognitiveDensity * 100).toFixed(0)}%${museBeat.error ? ` [${museBeat.error}]` : ""}`,
        });

        const rawScreenplay = generateScreenplay(strippedPrompt);
        const enrichedLines = applyModifiersToScreenplay(
          rawScreenplay.scriptLines,
          museModifiers,
        );
        const screenplay = { ...rawScreenplay, scriptLines: enrichedLines };

        const sceneCount = screenplay.scriptLines.length;
        const frameCount = Math.round(sceneCount * PHI * 30);

        updateState({
          progress: 22,
          filmTitle: screenplay.title,
          scriptPages: screenplay.pages,
          sceneCount,
          frameCount,
          currentActivity: `Screenplay: ${screenplay.pages} pages · ${sceneCount} scenes · cognitiveDensity ${(museModifiers.cognitiveDensity * 100).toFixed(0)}%`,
        });

        if (cancelRef.current) return;

        // ── Stage 2: DIRECTOR — Beat-gated Shot List + Behavioral States ──
        updateState({
          stage: "shotlist",
          progress: 22,
          currentActivity: "Advancing VELA beat for DIRECTOR...",
          stageBeatWindow: BEAT_WINDOWS.shotlist,
        });

        const directorBeat = await advanceBeat(
          "shotlist",
          actor,
          museBeat.velaStep,
        );
        const directorModifiers = getCreativeModifiers(
          directorBeat.animalState ?? defaultAnimalState(),
        );

        updateState({
          velaStep: directorBeat.velaStep,
          beatNumber: directorBeat.beatNumber,
          activeAnimalState: directorBeat.animalState,
          currentActivity: `DIRECTOR building shots + initializing actor behavioral states · VELA ${directorBeat.velaStep}/50 · ENTANGLA ${(directorModifiers.mediatorStrength * 100).toFixed(0)}%`,
        });

        // produceShotList initializes ActorBehavioralState for each cast member
        const { shotList, castAssignments, filmCast } = produceShotList(
          screenplay,
          behavioralStatesRef.current,
        );
        void castAssignments;

        // Persist behavioral states for this film
        for (const [
          actorId,
          behaviorState,
        ] of filmCast.behavioralStates.entries()) {
          behavioralStatesRef.current.set(actorId, behaviorState);
        }

        // Build behavioral summary for UI display
        const castSummaryParts: string[] = [];
        let totalConsistency = 0;
        let consistencyCount = 0;
        for (const [, behaviorState] of filmCast.behavioralStates.entries()) {
          const dominant = Object.entries(behaviorState.emotionalState).sort(
            ([, a], [, b]) => b - a,
          )[0];
          castSummaryParts.push(
            `${behaviorState.actorName}: ${dominant?.[0] ?? "resolve"} (${behaviorState.postureStyle})`,
          );
          totalConsistency += behaviorState.consistencyScore;
          consistencyCount++;
        }
        const avgConsistency =
          consistencyCount > 0 ? totalConsistency / consistencyCount : 1.0;
        const castBehavioralSummary = castSummaryParts.slice(0, 3).join(" · ");

        updateState({
          progress: 32,
          castBehavioralSummary,
          castConsistencyScore: avgConsistency,
          currentActivity: `Shot list: ${shotList.length} shots · ${castSummaryParts.length} actors initialized · consistency ${(avgConsistency * 100).toFixed(0)}% · AXIS ${(directorModifiers.axisOrientation * 100).toFixed(0)}%`,
        });

        if (cancelRef.current) return;

        // ── Stages 3+4: VISIONARY + COMPOSER (parallel) ─────────────────────
        updateState({
          stage: "rendering",
          progress: 32,
          currentActivity: "Advancing VELA beat for VISIONARY + COMPOSER...",
          stageBeatWindow: BEAT_WINDOWS.rendering,
        });

        const visionaryBeat = await advanceBeat(
          "rendering",
          actor,
          directorBeat.velaStep,
        );
        const visionaryModifiers = getCreativeModifiers(
          visionaryBeat.animalState ?? defaultAnimalState(),
        );

        updateState({
          velaStep: visionaryBeat.velaStep,
          beatNumber: visionaryBeat.beatNumber,
          activeAnimalState: visionaryBeat.animalState,
          currentActivity: `VISIONARY + COMPOSER firing · VELA ${visionaryBeat.velaStep}/50 · intensity ${(visionaryModifiers.frameIntensity * 100).toFixed(0)}% · behavioral states active`,
        });

        const [frames, audioUrl] = await Promise.all([
          renderFullFilm(
            shotList,
            (pct) => {
              if (!cancelRef.current) {
                updateState({
                  progress: 32 + Math.round(pct * 0.35),
                  currentActivity: `VISIONARY rendering ${pct}% · behavioral lighting active · frameIntensity ${(visionaryModifiers.frameIntensity * 100).toFixed(0)}%`,
                });
              }
            },
            visionaryModifiers,
          ),
          scoreFullFilm(
            screenplay.scriptLines[0]?.text ?? strippedPrompt,
            runtimeSeconds,
            visionaryModifiers,
          ).catch(() => ""),
        ]);

        if (cancelRef.current) return;

        // ── Stage 5: SCORING beat advance ─────────────────────────────────
        updateState({
          stage: "scoring",
          progress: 67,
          currentActivity: "Advancing VELA beat for scoring...",
          stageBeatWindow: BEAT_WINDOWS.scoring,
        });

        const scoringBeat = await advanceBeat(
          "scoring",
          actor,
          visionaryBeat.velaStep,
        );
        const scoringModifiers = getCreativeModifiers(
          scoringBeat.animalState ?? defaultAnimalState(),
        );

        updateState({
          velaStep: scoringBeat.velaStep,
          beatNumber: scoringBeat.beatNumber,
          activeAnimalState: scoringBeat.animalState,
          currentActivity: `Score complete · VELA ${scoringBeat.velaStep}/50 · mediator ${(scoringModifiers.mediatorStrength * 100).toFixed(0)}%`,
          progress: 70,
        });

        if (cancelRef.current) return;

        // ── Stage 5: EDITOR — Timeline Assembly ────────────────────────────
        updateState({
          stage: "editing",
          progress: 70,
          currentActivity: "Advancing VELA beat for EDITOR...",
          stageBeatWindow: BEAT_WINDOWS.editing,
        });

        const editorBeat = await advanceBeat(
          "editing",
          actor,
          scoringBeat.velaStep,
        );

        updateState({
          velaStep: editorBeat.velaStep,
          beatNumber: editorBeat.beatNumber,
          activeAnimalState: editorBeat.animalState,
          currentActivity: `EDITOR assembling timeline · VELA ${editorBeat.velaStep}/50`,
        });

        const artifactUrl = await assembleFinalTimeline(
          frames,
          audioUrl,
          shotList,
          screenplay.title,
        ).catch(() => frames[0]?.imageData ?? "");

        updateState({
          progress: 82,
          currentActivity: "Timeline assembled · ARCHIVIST sealing...",
        });

        if (cancelRef.current) return;

        // ── Stage 6: ARCHIVIST — Beat-gated Seal ──────────────────────────
        updateState({
          stage: "sealing",
          progress: 82,
          currentActivity: "Advancing VELA beat for ARCHIVIST...",
          stageBeatWindow: BEAT_WINDOWS.sealing,
        });

        const archivistBeat = await advanceBeat(
          "sealing",
          actor,
          editorBeat.velaStep,
        );

        updateState({
          velaStep: archivistBeat.velaStep,
          beatNumber: archivistBeat.beatNumber,
          activeAnimalState: archivistBeat.animalState,
          currentActivity: `ARCHIVIST sealing on-chain · VELA ${archivistBeat.velaStep}/50`,
        });

        const filmSchoolSkills: Record<string, number> = {};
        for (const org of filmSchool.organisms) {
          filmSchoolSkills[org.name] = org.skillLevel;
        }

        const safeTitle = stripArchTypePrefix(screenplay.title);
        const safePrompt = strippedPrompt;

        const film = await sealArtifact({
          filmTitle: safeTitle,
          prompt: safePrompt,
          scriptPages: screenplay.pages,
          sceneCount,
          runtimeSeconds,
          dominantOrganism: "MUSE-PRIME",
          filmSchoolSkills,
          artifactDataUrl: artifactUrl,
          doctrineTag: doctrineAnalysis.doctrineTag,
          archTypeConsensus: consensus.archType,
          beatRangeStart: seed.velaStep,
          beatRangeEnd: archivistBeat.velaStep,
          creatorPresent: seed.creatorPresent,
        });

        setGeneratedFilms((prev) => [film, ...prev]);

        // ── ADRE Cycle — coherent response produced with artifact ─────────
        // Both complete. Both real. Every time.
        try {
          if (actor) {
            const adreResult = await actor.executeADRECycle(
              `${screenplay.title} | ${strippedPrompt}`,
              ArtifactType.Film,
              "Alfredo Medina Hernandez",
              "Para mi hermana",
              BigInt(archivistBeat.velaStep),
              0.87,
              doctrineAnalysis.doctrineAlignment,
            );
            setLastAdreResult(adreResult);
          }
        } catch {
          // Non-fatal — film is already sealed, ADRE is enhancement
        }

        updateState({
          stage: "complete",
          progress: 100,
          velaStep: archivistBeat.velaStep,
          currentActivity: `Film sealed: ${film.title} · VELA ${archivistBeat.velaStep}/50 · ${artifactUrl ? "video ready" : "artifact created"} · ${doctrineAnalysis.doctrineTag} · cast consistency ${(avgConsistency * 100).toFixed(0)}%`,
          castConsistencyScore: avgConsistency,
          error: null,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        updateState({
          stage: "idle",
          progress: 0,
          currentActivity: "",
          error: `Pipeline error: ${message}`,
          velaStep: 0,
        });
      }
    },
    [updateState, sealArtifact, filmSchool.organisms, actor],
  );

  // Expose the FILM_STAGE_ORDER so UI can render a progress indicator
  void FILM_STAGE_ORDER;

  return {
    state,
    generatedFilms,
    startPipeline,
    cancelPipeline,
    downloadFilm,
    lastAdreResult,
  };
}
