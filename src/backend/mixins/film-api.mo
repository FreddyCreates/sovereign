// mixins/film-api.mo
// Public API mixin for the SOVEREIGN Hollywood Film Pipeline
// Exposes: getGeneratedFilms, getFilmById, sealGeneratedFilm,
//          getPipelineState, updatePipelineStage,
//          validateDoctrineAlignment, getFilmGenerationSeed,
//          advanceFilmBeat, sealFilmWithFullMetadata,
//          spawnProductionWorld, placeActorInWorld, mergeProductionWorlds,
//          executeDocument, getWorldState, getExecutionHistory,
//          getReadinessForExecution
// Attributed to Alfredo Medina Hernandez — sealed on-chain
import Time       "mo:core/Time";
import List       "mo:core/List";
import FilmLib    "../lib/film";
import FilmTypes  "../types/film";
import AnimalLib  "../lib/animalEngines";
import ArchTypes  "../types/architecture";
import OmnisLib   "../lib/omnis";
import CWE        "../lib/contentWorldEngine";
import DocExec    "../lib/documentExecutionEngine";

mixin (
  generatedFilms   : List.List<FilmTypes.GeneratedFilm>,
  pipelineStateBuf : [var FilmTypes.PipelineState],
  beatCounterRef   : Nat,
  animalEngineRef  : AnimalLib.AnimalEngineState,
  velaRingRef      : ArchTypes.VELARingState,
  jubileeRef       : ArchTypes.JubileeState,
  omnisStateRef    : OmnisLib.OmnisState,
  creatorPresRef   : ArchTypes.CreatorPresence,
  worldRegistryRef : [var CWE.WorldRegistry],
  docExecStateRef  : [var DocExec.DocumentExecutionState],
) {

  // ── Queries ────────────────────────────────────────────────────────────

  /// Returns all sealed films stored on-chain.
  public query func getGeneratedFilms() : async [FilmTypes.GeneratedFilm] {
    generatedFilms.toArray()
  };

  /// Returns a single film by its on-chain id, or null if not found.
  public query func getFilmById(id : Text) : async ?FilmTypes.GeneratedFilm {
    generatedFilms.find(func(f) { f.id == id })
  };

  /// Returns the current Hollywood pipeline progress state.
  public query func getPipelineState() : async FilmTypes.PipelineState {
    pipelineStateBuf[0]
  };

  /// Validate a prompt against the 6 sealed laws of Medina.
  /// Always returns a valid result — never throws on any input.
  /// archType is a plain lowercase string without brackets.
  public query func validateDoctrineAlignment(prompt : Text) : async FilmTypes.DoctrineValidationResult {
    FilmLib.validateDoctrineAlignment(prompt)
  };

  /// Returns everything the frontend needs to start a beat-gated generation.
  /// Single read: VELA step, all 9 animal engine values, OMNIS proposal type,
  /// creator presence, PHI harmonic, beat counter, jubilee progress.
  public query func getFilmGenerationSeed() : async FilmTypes.FilmGenerationSeed {
    let omnisTypeName = switch (omnisStateRef.currentProposal) {
      case (?p) {
        switch (p.proposalType) {
          case (#coherenceShift)    { "coherenceShift"    };
          case (#typeRebalance)     { "typeRebalance"     };
          case (#doctrineSeal)      { "doctrineSeal"      };
          case (#jubileeAccelerate) { "jubileeAccelerate" };
          case (#successionTrigger) { "successionTrigger" };
        }
      };
      case null { "coherenceShift" };
    };

    FilmLib.buildGenerationSeed(
      velaRingRef.step,
      animalEngineRef,
      omnisTypeName,
      creatorPresRef.isPresent,
      beatCounterRef,
      jubileeRef.beatsSinceJubilee,
    )
  };

  // ── Updates ────────────────────────────────────────────────────────────

  /// Seals a generated film record to on-chain storage.
  /// Immutably attributes producer = "Alfredo Medina Hernandez"
  /// and dedicatee = "Dedicated to my sister".
  /// Returns the sealed GeneratedFilm with assigned id and timestamp.
  public func sealGeneratedFilm(input : FilmTypes.GeneratedFilmInput) : async FilmTypes.GeneratedFilm {
    let nowNs = Time.now();
    let film  = FilmLib.sealFilm(input, beatCounterRef, nowNs);
    generatedFilms.add(film);
    film
  };

  /// Called by the frontend orchestrator to track pipeline stage and progress.
  /// stage — name of the currently active organism stage (e.g. "MUSE-PRIME")
  /// progress — 0-100 completion percentage
  public func updatePipelineStage(stage : Text, progress : Nat) : async () {
    pipelineStateBuf[0] := FilmLib.applyPipelineUpdate(
      pipelineStateBuf[0],
      stage,
      progress,
      beatCounterRef,
    );
  };

  /// Advance VELA by the correct number of steps for the given film stage.
  /// Internally computed — no external VELA mutation needed from frontend.
  /// Returns new VELA position and fresh animal engine snapshot.
  /// Stage names accepted: "MUSE-PRIME", "DIRECTOR", "VISIONARY",
  ///   "COMPOSER", "EDITOR", "ARCHIVIST" (any case).
  public func advanceFilmBeat(stage : Text) : async FilmTypes.BeatAdvanceResult {
    FilmLib.computeBeatAdvance(
      stage,
      velaRingRef.step,
      animalEngineRef,
      beatCounterRef,
    )
  };

  /// Enriched seal — carries full organism context into the on-chain artifact.
  /// All Text fields accept any non-empty string.
  /// archTypeConsensus should be plain text ("expansive", "receptive", "antiDrift").
  /// Frontend must NOT send bracket-wrapped archType strings here.
  public func sealFilmWithFullMetadata(input : FilmTypes.FilmMetadataInput) : async FilmTypes.GeneratedFilm {
    let nowNs = Time.now();
    let film  = FilmLib.sealFilmWithMetadata(input, beatCounterRef, nowNs);
    generatedFilms.add(film);
    film
  };

  // ── World Engine API ────────────────────────────────────────────────

  /// Spawn a new sovereign production world from a brief.
  /// PHI geometry initialized, Schumann ambient locked to 7.83 Hz,
  /// world clock set to 873ms. Returns the new worldId.
  public func spawnProductionWorld(brief : Text) : async Text {
    let nowNs = Time.now();
    let (worldId, world) = CWE.spawnWorld(brief, beatCounterRef, nowNs);
    CWE.putWorld(worldRegistryRef[0], worldId, world);
    worldId
  };

  /// Place a sovereign AGI actor into a production world.
  /// Position is snapped to PHI grid. Doctrine gate enforced at 0.75.
  public func placeActorInWorld(
    worldId       : Text,
    actorId       : Text,
    role          : Text,
    emotionalState: Text,
    objective     : Text,
  ) : async Bool {
    switch (CWE.getWorld(worldRegistryRef[0], worldId)) {
      case null { false };
      case (?world) {
        // Default PHI-ratio position placement: use actor ID hash for position
        let posBase = actorId.size().toFloat();
        let updated = CWE.placeActorInWorld(
          world, actorId, role, emotionalState, objective,
          posBase * 1.618, posBase * 1.0, posBase * 0.618,
          0.85, // default doctrine score for actor placement
        );
        CWE.putWorld(worldRegistryRef[0], worldId, updated);
        true
      };
    }
  };

  /// Merge two production worlds — Federation Yield (Law 25).
  /// merged doctrine = PHI × (score1 + score2). Returns merged worldId.
  public func mergeProductionWorlds(worldId1 : Text, worldId2 : Text) : async ?Text {
    let w1 = CWE.getWorld(worldRegistryRef[0], worldId1);
    let w2 = CWE.getWorld(worldRegistryRef[0], worldId2);
    switch (w1, w2) {
      case (?world1, ?world2) {
        let nowNs = Time.now();
        let (mergedId, merged) = CWE.mergeWorlds(world1, world2, beatCounterRef, nowNs);
        CWE.putWorld(worldRegistryRef[0], mergedId, merged);
        ?mergedId
      };
      case _ { null };
    }
  };

  /// Get the full state of a production world by ID.
  public query func getWorldState(worldId : Text) : async ?CWE.ContentWorldState {
    CWE.getWorld(worldRegistryRef[0], worldId)
  };

  /// List all active production world IDs.
  public query func listProductionWorlds() : async [Text] {
    CWE.listWorldIds(worldRegistryRef[0])
  };

  /// Get the self-model of a world (DOGON proprioceptive reading).
  public query func getWorldSelfModel(worldId : Text) : async ?CWE.WorldSelfModel {
    switch (CWE.getWorld(worldRegistryRef[0], worldId)) {
      case null { null };
      case (?world) { ?CWE.readWorldSelf(world) };
    }
  };

  // ── Document Execution Engine API ───────────────────────────────────

  /// Execute a living document — parses through LAW_ENGINE oxygenation gate.
  /// Must score ≥ 0.75. Failures logged as learning events (Law 09).
  /// Returns the execution result with artifact ID and behavior fired.
  public func executeDocument(
    documentId  : Text,
    content     : Text,
    doctrineScore: Float,
  ) : async DocExec.ExecutionResult {
    let nowNs = Time.now();
    let (newState, result) = DocExec.executeDocument(
      docExecStateRef[0],
      documentId,
      content,
      doctrineScore,
      beatCounterRef,
      velaRingRef.step,
      nowNs,
    );
    docExecStateRef[0] := newState;
    result
  };

  /// Chain-execute multiple living documents in sequence.
  /// Each document's doctrine score feeds into the next (Law 09 — Re-Ingestion).
  public func chainExecuteDocuments(
    documentIds : [Text],
    contents    : [Text],
    docScores   : [Float],
  ) : async [DocExec.ExecutionResult] {
    let nowNs = Time.now();
    let (newState, results) = DocExec.chainExecute(
      docExecStateRef[0],
      documentIds,
      contents,
      docScores,
      beatCounterRef,
      velaRingRef.step,
      nowNs,
    );
    docExecStateRef[0] := newState;
    results
  };

  /// Get full execution history of all document executions.
  public query func getExecutionHistory() : async [DocExec.ExecutionEvent] {
    DocExec.getExecutionHistory(docExecStateRef[0])
  };

  /// Get learning events — failed executions used for organism improvement.
  public query func getDocExecutionLearnings() : async [DocExec.ExecutionLearningEvent] {
    DocExec.getLearningEvents(docExecStateRef[0])
  };

  /// Readiness check for EXECUTE button — returns score ≥ 0.75 = active.
  /// Uses compound readiness (Law 23 — never resets to baseline).
  public query func getReadinessForExecution() : async Float {
    let omnis = switch (omnisStateRef.currentProposal) {
      case (?p) { p.emergenceValue };
      case null { 0.5 };
    };
    DocExec.readinessCheck(
      docExecStateRef[0],
      velaRingRef.step,
      0.85, // doctrine floor proxy
      omnis,
      beatCounterRef,
    )
  };

  /// Get document execution statistics.
  public query func getDocExecutionStats() : async {
    total: Nat; success: Nat; failure: Nat; compoundReadiness: Float; attribution: Text
  } {
    DocExec.getStats(docExecStateRef[0])
  };

}
