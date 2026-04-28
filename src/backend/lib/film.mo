// lib/film.mo
// Domain logic for the SOVEREIGN Hollywood Film Pipeline
// PHI = 1.618033 drives all frame-count calculations
// Attributed to Alfredo Medina Hernandez — sealed on-chain
import Float     "mo:core/Float";
import Int       "mo:core/Int";
import Nat       "mo:core/Nat";
import Text      "mo:core/Text";
import Types     "../types/film";
import AnimalLib "animalEngines";
import SandboxTypes "../types/sandboxOrganisms";

module {

  // ── Constants ──────────────────────────────────────────────────────────
  let _PHI       : Float = 1.618033;
  let PRODUCER   : Text  = "Alfredo Medina Hernandez";
  let DEDICATEE  : Text  = "Dedicated to my sister";

  // ── Frame-count calculation — PHI-driven ──────────────────────────────
  // frameCount = Int.abs(sceneCount.toFloat() * PHI * 30.0 |> .toInt())
  public func computeFrameCount(sceneCount : Nat) : Nat {
    let f : Float = sceneCount.toFloat() * 1.618033 * 30.0;
    Int.abs(f.toInt())
  };

  // ── Derive ArchType from dominant organism name ────────────────────────
  // MUSE-PRIME / DIRECTOR / CINEMATOGRAPHER / COMPOSER / EDITOR → #expansive
  // VISIONARY / ARCHIVIST → #receptive
  // anything containing "ENTANGLA" → #antiDrift
  // default → #antiDrift
  public func deriveArchType(dominantOrganism : Text) : Types.ArchType {
    let org = dominantOrganism.toUpper();
    if (org.contains(#text "ENTANGLA")) {
      #antiDrift
    } else if (
      org == "MUSE-PRIME" or
      org == "DIRECTOR"   or
      org == "CINEMATOGRAPHER" or
      org == "COMPOSER"   or
      org == "EDITOR"
    ) {
      #expansive
    } else if (org == "VISIONARY" or org == "ARCHIVIST") {
      #receptive
    } else {
      #antiDrift
    }
  };

  // ── Deterministic ID generation ───────────────────────────────────────
  // Produces "film-<beat>-<hash>" using dot-notation concat
  public func generateFilmId(_title : Text, beat : Nat, nowNs : Int) : Text {
    let h = Int.abs(nowNs) % 100000000;
    "film-".concat(beat.toText()).concat("-").concat(h.toText())
  };

  // ── Seal an input record into an immutable GeneratedFilm ─────────────
  public func sealFilm(
    input : Types.GeneratedFilmInput,
    beat  : Nat,
    nowNs : Int,
  ) : Types.GeneratedFilm {
    let id         = generateFilmId(input.title, beat, nowNs);
    let frameCount = computeFrameCount(input.sceneCount);
    let archType   = deriveArchType(input.dominantOrganism);
    {
      id               = id;
      title            = input.title;
      prompt           = input.prompt;
      scriptPages      = input.scriptPages;
      sceneCount       = input.sceneCount;
      frameCount       = frameCount;
      runtimeSeconds   = input.runtimeSeconds;
      artifactHash     = input.artifactHash;
      producer         = PRODUCER;
      dedicatee        = DEDICATEE;
      createdAtBeat    = beat;
      createdAtTime    = nowNs;
      archType         = archType;
      dominantOrganism = input.dominantOrganism;
      organismCredits  = input.organismCredits;
      sandboxSnapshot  = null; // legacy path — no sandbox snapshot available
    }
  };

  // ── Build a default idle PipelineState ────────────────────────────────
  public func idlePipeline(beat : Nat) : Types.PipelineState {
    {
      currentStage = "idle";
      progress     = 0;
      filmTitle    = "";
      beatCount    = beat;
      isRunning    = false;
    }
  };

  // ── Apply a stage + progress update to the pipeline ──────────────────
  public func applyPipelineUpdate(
    current  : Types.PipelineState,
    stage    : Text,
    progress : Nat,
    beat     : Nat,
  ) : Types.PipelineState {
    let clampedProgress = Nat.min(progress, 100);
    let isRunning       = stage != "idle" and stage != "complete";
    {
      currentStage = stage;
      progress     = clampedProgress;
      filmTitle    = current.filmTitle;
      beatCount    = beat;
      isRunning    = isRunning;
    }
  };

  // ── Update pipeline filmTitle ─────────────────────────────────────────
  public func setPipelineFilmTitle(
    current : Types.PipelineState,
    title   : Text,
    beat    : Nat,
  ) : Types.PipelineState {
    { current with filmTitle = title; beatCount = beat }
  };

  // ── Doctrine term density check ───────────────────────────────────────
  // Checks prompt against the 6 sealed laws of Medina and returns a
  // DoctrineValidationResult. Never traps. Always returns a valid record.
  let DOCTRINE_TERMS : [Text] = [
    // Law 1 — Sovereign Foundation
    "sovereign", "foundation", "law", "medina",
    // Law 2 — Creative Mandate
    "create", "creation", "creator", "film", "story", "vision",
    // Law 3 — Organism Truth
    "organism", "intelligence", "substrate", "real",
    // Law 4 — Attribution
    "alfredo", "hernandez", "heritage", "lineage",
    // Law 5 — Anti-Drift Coupling
    "balance", "coupling", "truth", "entangla", "anti",
    // Law 6 — Perpetual Motion
    "future", "sovereign", "bringing", "alive",
  ];

  let EXPANSIVE_TERMS : [Text] = ["broadcast", "expand", "nova", "solar", "signal", "outward", "create", "birth", "film", "story"];
  let RECEPTIVE_TERMS : [Text] = ["memory", "depth", "inner", "compress", "anchor", "veritas", "history", "ancient", "seal"];
  let ANTIDRIFT_TERMS : [Text] = ["balance", "law", "medina", "coupling", "truth", "entangla", "mediator", "center"];

  func countTermsInPrompt(prompt : Text, terms : [Text]) : Nat {
    let lower = prompt.toLower();
    var count : Nat = 0;
    for (term in terms.values()) {
      if (lower.contains(#text term)) { count += 1 };
    };
    count
  };

  public func validateDoctrineAlignment(prompt : Text) : Types.DoctrineValidationResult {
    if (prompt.size() == 0) {
      return {
        aligned        = false;
        alignmentScore = 0.0;
        archType       = "antiDrift";
        doctrineTag    = "LAW_ALIGNED";
        violatedLaw    = ?"Law 1: Sovereign Foundation — empty prompt";
      };
    };

    // Count doctrine term density
    let docHits   = countTermsInPrompt(prompt, DOCTRINE_TERMS);
    let totalTerms = DOCTRINE_TERMS.size();
    let rawScore  = docHits.toFloat() / totalTerms.toFloat();
    // Scale: 0 hits = 0.25 baseline (Law of Medina guarantees a floor), max = 1.0
    let score     = Float.min(1.0, 0.25 + rawScore * 0.75);

    // Determine arch type from term density
    let expHits  = countTermsInPrompt(prompt, EXPANSIVE_TERMS);
    let recHits  = countTermsInPrompt(prompt, RECEPTIVE_TERMS);
    let adHits   = countTermsInPrompt(prompt, ANTIDRIFT_TERMS);

    let archType = if (adHits >= expHits and adHits >= recHits) {
      "antiDrift"
    } else if (expHits >= recHits) {
      "expansive"
    } else {
      "receptive"
    };

    let doctrineTag = if (archType == "expansive") {
      "TYPE_1_DOCTRINE"
    } else if (archType == "receptive") {
      "TYPE_2_DOCTRINE"
    } else if (archType == "antiDrift" and score >= 0.6) {
      "TYPE_3_DOCTRINE"
    } else {
      "LAW_ALIGNED"
    };

    let aligned = score >= 0.25; // Law of Medina floor always passes
    let violatedLaw : ?Text = if (aligned) {
      null
    } else {
      ?"Law 1: Sovereign Foundation — insufficient doctrine alignment"
    };

    { aligned; alignmentScore = score; archType; doctrineTag; violatedLaw }
  };

  // ── VELA stage step ranges ────────────────────────────────────────────
  // MUSE_PRIME 0-9 (10 steps), DIRECTOR 10-19, VISIONARY 20-34 (15),
  // COMPOSER 35-44 (10), EDITOR 45-49 (5), ARCHIVIST wraps to 0
  public func stepsForStage(stage : Text) : Nat {
    let s = stage.toUpper();
    if      (s == "MUSE-PRIME" or s == "MUSE_PRIME") { 10 }
    else if (s == "DIRECTOR")                         { 10 }
    else if (s == "VISIONARY")                        { 15 }
    else if (s == "COMPOSER")                         { 10 }
    else if (s == "EDITOR")                           { 5  }
    else if (s == "ARCHIVIST")                        { 50 } // wraps ring
    else                                              { 5  }  // fallback
  };

  // ── Flatten animal engine state to shared-safe snapshot ──────────────
  public func flattenAnimalState(
    state : AnimalLib.AnimalEngineState,
  ) : Types.AnimalEngineSnapshot {
    {
      novaSignal       = state.nova.signalStrength;
      brainHebbian     = state.brain.avgHebbian;
      qmemCoherence    = state.qmem.memoryCoherence;
      resonexCascades  = state.resonex.cascadeCount;
      chronoStability  = state.chrono.stabilityIndex;
      veritasScore     = state.veritas.veritasScore;
      axisCx           = state.axis.cx;
      axisCy           = state.axis.cy;
      axisCz           = state.axis.cz;
      parallaxDepth    = state.parallax.depthIndex;
      entanglaCoupling = state.entangla.couplingForce;
    }
  };

  // ── Build FilmGenerationSeed from live canister state ─────────────────
  public func buildGenerationSeed(
    velaStep      : Nat,
    animalState   : AnimalLib.AnimalEngineState,
    omnisTypeName : Text,
    creatorPresent: Bool,
    beatCounter   : Nat,
    jubileeBeats  : Nat,
  ) : Types.FilmGenerationSeed {
    // PHI^(velaStep % 7) — drives creative amplitude from PHI geometry
    let phi : Float = 1.6180339887;
    let exp = velaStep % 7;
    var fibHarmonic : Float = 1.0;
    var k : Nat = 0;
    while (k < exp) { fibHarmonic := fibHarmonic * phi; k += 1 };

    {
      velaStep;
      animalState      = flattenAnimalState(animalState);
      omnisProposedType = omnisTypeName;
      creatorPresent;
      fibHarmonic;
      beatCounter;
      jubileeProgress  = jubileeBeats;
    }
  };

  // ── Compute BeatAdvanceResult — used by advanceFilmBeat() mixin ───────
  public func computeBeatAdvance(
    stage        : Text,
    velaStep     : Nat,
    animalState  : AnimalLib.AnimalEngineState,
    beatCounter  : Nat,
  ) : Types.BeatAdvanceResult {
    let steps       = stepsForStage(stage);
    let newVelaStep = (velaStep + steps) % 50;
    let stageComplete = true; // each call completes one stage
    {
      newVelaStep;
      stageComplete;
      animalStateSnapshot = flattenAnimalState(animalState);
      beatNumber          = beatCounter;
    }
  };

  // ── Seal an enriched film with full organism metadata ─────────────────
  public func sealFilmWithMetadata(
    input : Types.FilmMetadataInput,
    beat  : Nat,
    nowNs : Int,
  ) : Types.GeneratedFilm {
    let id = generateFilmId(input.title, beat, nowNs);
    let frameCount = computeFrameCount(input.sceneCount);
    // archType derived from the consensus field — plain text, no brackets
    let archTypeVariant = if (input.archTypeConsensus.toLower().contains(#text "expansive")) {
      #expansive
    } else if (input.archTypeConsensus.toLower().contains(#text "receptive")) {
      #receptive
    } else {
      #antiDrift
    };
    {
      id;
      title            = input.title;
      prompt           = input.prompt;
      scriptPages      = input.scriptPages;
      sceneCount       = input.sceneCount;
      frameCount;
      runtimeSeconds   = input.runtimeSeconds;
      artifactHash     = input.artifactHash;
      producer         = PRODUCER;
      dedicatee        = DEDICATEE;
      createdAtBeat    = beat;
      createdAtTime    = nowNs;
      archType         = archTypeVariant;
      dominantOrganism = input.dominantOrganism;
      organismCredits  = input.organismCredits;
      sandboxSnapshot  = input.sandboxSnapshot;
    }
  };

}
