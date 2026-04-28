// types/film.mo
// Domain types for the SOVEREIGN Hollywood Film Pipeline
// Attributed to Alfredo Medina Hernandez — sealed on-chain
import SandboxTypes "../types/sandboxOrganisms";

module {

  // ── Three-architecture type encoded on every film ──────────────────────
  public type ArchType = {
    #expansive;   // TYPE 1 — outward-radiating, broadcast, solar-driven
    #receptive;   // TYPE 2 — inward-focusing, compression, deep memory
    #antiDrift;   // TYPE 3 — mediator / ENTANGLA / anti-drift
  };

  // ── Organism credit stamped at time of film creation ──────────────────
  public type OrganismCredit = {
    name     : Text;  // e.g. "MUSE-PRIME", "VISIONARY"
    skillAt  : Nat;   // skill level (0-100) at time of creation
    role     : Text;  // e.g. "Writing", "VFX"
  };

  // ── Input record supplied by the frontend orchestrator ────────────────
  public type GeneratedFilmInput = {
    title            : Text;
    prompt           : Text;
    scriptPages      : Nat;
    sceneCount       : Nat;
    runtimeSeconds   : Nat;
    artifactHash     : Text;
    dominantOrganism : Text;   // determines archType
    organismCredits  : [OrganismCredit];
  };

  // ── Legacy film record (V0 — no sandboxSnapshot) — used for stable migration ──
  public type GeneratedFilmV0 = {
    id               : Text;
    title            : Text;
    prompt           : Text;
    scriptPages      : Nat;
    sceneCount       : Nat;
    frameCount       : Nat;
    runtimeSeconds   : Nat;
    artifactHash     : Text;
    producer         : Text;
    dedicatee        : Text;
    createdAtBeat    : Nat;
    createdAtTime    : Int;
    archType         : ArchType;
    dominantOrganism : Text;
    organismCredits  : [OrganismCredit];
  };

  // ── Sealed, immutable on-chain film record ────────────────────────────
  public type GeneratedFilm = {
    id               : Text;
    title            : Text;
    prompt           : Text;
    scriptPages      : Nat;
    sceneCount       : Nat;
    frameCount       : Nat;   // sceneCount * PHI * 30.0 frames
    runtimeSeconds   : Nat;
    artifactHash     : Text;
    producer         : Text;  // always "Alfredo Medina Hernandez"
    dedicatee        : Text;  // always "Dedicated to my sister"
    createdAtBeat    : Nat;
    createdAtTime    : Int;
    archType         : ArchType;
    dominantOrganism : Text;
    organismCredits  : [OrganismCredit];
    // sandbox signal provenance — which sandbox signals informed this production
    sandboxSnapshot  : ?SandboxTypes.SandboxSignalSnapshot;
  };

  // ── Pipeline progress state ────────────────────────────────────────────
  public type PipelineState = {
    currentStage : Text;   // e.g. "MUSE-PRIME", "VISIONARY", "idle"
    progress     : Nat;    // 0-100
    filmTitle    : Text;
    beatCount    : Nat;
    isRunning    : Bool;
  };

  // ── Animal engine snapshot (shared-safe flat record) ──────────────────
  public type AnimalEngineSnapshot = {
    novaSignal      : Float;
    brainHebbian    : Float;
    qmemCoherence   : Float;
    resonexCascades : Nat;
    chronoStability : Float;
    veritasScore    : Float;
    axisCx          : Float;
    axisCy          : Float;
    axisCz          : Float;
    parallaxDepth   : Float;
    entanglaCoupling: Float;
  };

  // ── Doctrine validation result ─────────────────────────────────────────
  // archType is a plain lowercase string: "expansive", "receptive", or "antiDrift"
  // doctrineTag is one of: "LAW_ALIGNED", "TYPE_1_DOCTRINE", "TYPE_2_DOCTRINE", "TYPE_3_DOCTRINE"
  // Never throws on any input — always returns a valid record.
  public type DoctrineValidationResult = {
    aligned        : Bool;
    alignmentScore : Float;   // 0.0 - 1.0
    archType       : Text;    // plain lowercase, no brackets
    doctrineTag    : Text;    // one of the four plain-text tags above
    violatedLaw    : ?Text;   // null when aligned=true
  };

  // ── Film generation seed — single read for beat-gated generation ───────
  public type FilmGenerationSeed = {
    velaStep         : Nat;
    animalState      : AnimalEngineSnapshot;
    omnisProposedType: Text;   // plain text description of current OMNIS proposal type
    creatorPresent   : Bool;
    fibHarmonic      : Float;  // PHI^(velaStep % 7) — drives creative amplitude
    beatCounter      : Nat;
    jubileeProgress  : Nat;    // beats since last jubilee
  };

  // ── Beat advance result — returned by advanceFilmBeat() ────────────────
  public type BeatAdvanceResult = {
    newVelaStep        : Nat;
    stageComplete      : Bool;
    animalStateSnapshot: AnimalEngineSnapshot;
    beatNumber         : Nat;
  };

  // ── Enriched seal input — extends GeneratedFilmInput with organism context ─
  public type FilmMetadataInput = {
    title            : Text;
    prompt           : Text;
    scriptPages      : Nat;
    sceneCount       : Nat;
    runtimeSeconds   : Nat;
    artifactHash     : Text;
    dominantOrganism : Text;
    organismCredits  : [OrganismCredit];
    // enrichment fields
    doctrineTag      : Text;
    archTypeConsensus: Text;   // plain text, never bracket-wrapped
    beatRangeStart   : Nat;
    beatRangeEnd     : Nat;
    animalSnapshot   : Text;   // JSON string of animal engine state
    creatorPresent   : Bool;
    // sandbox provenance — captured from the signal bus at generation start
    sandboxSnapshot  : ?SandboxTypes.SandboxSignalSnapshot;
  };

}
