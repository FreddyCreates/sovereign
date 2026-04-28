// mixins/artifacts-api.mo
// Artifact-chain public API mixin — LAW_ENGINE → ARES_ARCHIVE canister chain
// All artifacts run through doctrine validation before sealing.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// Rings 5, 11, 12, 14, 15 all exposed here.

import ArtifactTypes "../types/artifacts";
import ArchTypes     "../types/architecture";
import ArtifactLib   "../lib/artifactChain";
import CognitionLib  "../lib/cognition_layer";
import GovLib        "../lib/governance";
import Time          "mo:core/Time";
import Int           "mo:core/Int";

mixin (
  artifactChainState   : ArtifactLib.ArtifactChainState,
  cognitionWorldModelRef : [var CognitionLib.WorldModel],
  animalStatesRef      : [var CognitionLib.AnimalEngineStates],
) {

  // ── LAW ENGINE ENDPOINT ──────────────────────────────────────────────────

  /// Step 1 of the artifact chain: validate doctrine alignment via LAW_ENGINE.
  /// Returns { valid; status; alignmentScore; timestamp }.
  /// status is "DOCTRINE_ALIGNED" for valid artifacts.
  public func validateArtifactDoctrine(
    artifactId : Text,
    content    : Text,
    archType   : Text,
  ) : async ArtifactTypes.DoctrineValidationResult {
    let nowNs = Int.abs(Time.now()).toNat64();
    ArtifactLib.validateDoctrineAlignment(artifactId, content, archType, nowNs)
  };

  // ── ARES ARCHIVE ENDPOINTS ───────────────────────────────────────────────

  /// Step 2 of the artifact chain: seal the artifact into ARES_ARCHIVE.
  /// attributionHash always contains "Alfredo Medina Hernandez".
  /// sealStatus: "SEALED" | "PENDING_SEAL".
  public func recordArtifact(
    input : ArtifactTypes.ArtifactRecord,
  ) : async ArtifactTypes.ArtifactSealResult {
    let nowNs = Int.abs(Time.now()).toNat64();
    ArtifactLib.recordArtifact(artifactChainState, input, nowNs)
  };

  /// Retrieve a single sealed artifact by ID.
  public query func getArtifact(
    artifactId : Text,
  ) : async ?ArtifactTypes.SealedArtifact {
    ArtifactLib.getArtifact(artifactChainState, artifactId)
  };

  /// Retrieve all sealed artifacts matching the given ArtifactType.
  public query func getArtifactsByType(
    artifactType : ArtifactTypes.ArtifactType,
  ) : async [ArtifactTypes.SealedArtifact] {
    ArtifactLib.getArtifactsByType(artifactChainState, artifactType)
  };

  // ── ADRE CYCLE ENDPOINT ──────────────────────────────────────────────────
  // The atomic endpoint that produces BOTH the artifact seal AND the coherent
  // response from a single ADRE cycle. Both complete. Both real. Every time.
  // Wired through CognitionLib.runADRECycle — the organism's real nervous system.
  // Attribution: Alfredo Medina Hernandez — sealed on-chain.

  /// Executes a full ADRE cycle (Analyze→Design→Research→Execute).
  /// Calls CognitionLib.runADRECycle with live field state, seals the artifact,
  /// stores the response, and returns ADRECycleResult with both — one atomic call.
  ///
  /// Returns:
  ///   - artifactId, sealTimestamp, attributionHash  (artifact side)
  ///   - responseRecord  (coherent response — reasoned from the field, not fetched)
  ///   - decisionChainHash  (links this result to the on-chain decision log)
  ///   - velaStep, omnisWeight, doctrineScore  (live field state at time of cycle)
  public func executeADRECycle(
    input        : Text,
    artifactType : ArtifactTypes.ArtifactType,
    producer     : Text,
    dedicatee    : Text,
    velaStep     : Nat,
    omnisWeight  : Float,
    doctrineScore: Float,
  ) : async ArtifactTypes.ADRECycleResult {
    let nowNs    = Int.abs(Time.now()).toNat64();
    let beat     = (nowNs / 873_000_000).toNat();
    let animalStates = animalStatesRef[0];

    // Step 1: run the real ADRE cycle through the organism's nervous system
    let cognitionResponse = CognitionLib.runADRECycle(
      input,
      velaStep,
      omnisWeight,
      doctrineScore,
      animalStates,
      // fieldCoherence derived from current world model readiness
      cognitionWorldModelRef[0].currentReadiness,
      beat,
      nowNs,
    );

    // Step 2: build the public API ResponseRecord from the cognition response
    let responseRecord : ArtifactTypes.ResponseRecord = {
      responseText  = cognitionResponse.assembledText;
      responseHash  = CognitionLib.extractResponseHash(cognitionResponse);
      adrePhase     = switch (cognitionResponse.gateStatus) {
        case (#READY)    { "EXECUTE" };
        case (#DEFERRED) { "DESIGN" };
        case (#BLOCKED)  { "ANALYZE" };
      };
      doctrineScore  = cognitionResponse.doctrineAlignment * 100.0;
      velaStep       = velaStep;
      omnisWeight    = cognitionResponse.resonanceScore;
      timestamp      = nowNs;
      attribution    = "Alfredo Medina Hernandez";
    };

    // Step 3: seal artifact and store response via the lib
    let result = ArtifactLib.executeADRECycleWithResponse(
      artifactChainState,
      input,
      artifactType,
      producer,
      dedicatee,
      velaStep,
      omnisWeight,
      doctrineScore,
      beat,
      nowNs,
      responseRecord,
    );

    // Step 4: update mastery for all participating organisms (Ring 12)
    let participatingOrgs : [Text] = [
      "MUSE-PRIME", "DIRECTOR", "VISIONARY", "COMPOSER", "EDITOR", "ARCHIVIST"
    ];
    let qualityScore = cognitionResponse.doctrineAlignment;
    for (orgId in participatingOrgs.values()) {
      let (_, tierAdvanced) = ArtifactLib.updateOrgMastery(
        artifactChainState, orgId, qualityScore, beat
      );
      if (tierAdvanced) {
        // Seal a MasteryAdvanced DecisionRecord for this organism
        let masteryRecord = GovLib.sealDecision(
          #MasteryAdvanced,
          orgId,
          doctrineScore,
          velaStep,
          omnisWeight,
          cognitionWorldModelRef[0].currentReadiness,
          beat,
          "MASTERY_ADVANCE:" # orgId # " AT_BEAT:" # beat.toText() # " ATTRIBUTION:Alfredo Medina Hernandez",
          result.responseRecord.responseHash,
        );
        ArtifactLib.recordDecision(artifactChainState, masteryRecord);
      };
    };

    // Step 5: PHI calibration (Ring 14) — update correction weights after seal
    ignore ArtifactLib.calibratePhi(
      artifactChainState,
      0,   // frameCount — unknown at ADRE level; set by sealFilm endpoint
      0,   // sceneCount
      0,   // runtimeSecs
      qualityScore,
      participatingOrgs.size().toFloat() / 16.0,  // organism credit ratio vs 16 total
      cognitionWorldModelRef[0].currentReadiness,
      cognitionResponse.gatePassScore,
    );

    // Step 6: seal a PhiDriftCorrected DecisionRecord
    let phiRecord = GovLib.sealDecision(
      #PhiDriftCorrected,
      "PHI_CALIBRATOR",
      doctrineScore,
      velaStep,
      omnisWeight,
      cognitionWorldModelRef[0].currentReadiness,
      beat,
      "PHI_DRIFT:" # Int.abs((ArtifactLib.getPhiDriftScore(artifactChainState) * 1000.0).toInt()).toText()
        # " ATTRIBUTION:Alfredo Medina Hernandez",
      result.responseRecord.responseHash,
    );
    ArtifactLib.recordDecision(artifactChainState, phiRecord);

    result
  };

  /// Returns the ResponseRecord for any artifact by ID.
  /// Lets the frontend fetch the coherent response for any sealed artifact.
  public query func getADREResponse(
    artifactId : Text,
  ) : async ?ArtifactTypes.ResponseRecord {
    ArtifactLib.getADREResponse(artifactChainState, artifactId)
  };

  // ── GRADIENT FEEDBACK LOOP ENDPOINTS ────────────────────────────────────

  /// Submit a quality score for a sealed artifact back to the mastery gradient.
  /// Increments mastery via PHI-weighted delta and records OMNIS vote.
  public func submitGradientFeedback(
    artifactId   : Text,
    qualityScore : Float,
  ) : async ArtifactTypes.GradientResult {
    let nowNs = Int.abs(Time.now()).toNat64();
    // beatCounter is not available in the mixin; pass 0 and let the lib use timestamp
    ArtifactLib.submitGradientFeedback(artifactChainState, artifactId, qualityScore, 0, nowNs)
  };

  /// Returns the current gradient field — slope, trend, and peak emergence count.
  public query func getGradientField() : async ArtifactTypes.GradientFieldState {
    ArtifactLib.getGradientField(artifactChainState, 0)
  };

  // ── INTER-ORGANISM COMMUNICATION ENDPOINTS ───────────────────────────────

  /// Called by each organism when its state changes.
  /// Organism name: "muse" | "director" | "visionary" | "composer" | "editor" | "cinematographer"
  public func updateInterOrganismState(
    organism : Text,
    orgState : Text,
  ) : async () {
    let nowNs = Int.abs(Time.now()).toNat64();
    ArtifactLib.updateInterOrganismState(artifactChainState, organism, orgState, nowNs)
  };

  /// Returns the current inter-organism state board.
  /// Readable by all organisms for live inter-communication.
  public query func getInterOrganismState() : async ArtifactTypes.InterOrganismState {
    ArtifactLib.getInterOrganismState(artifactChainState)
  };

  // ── CRYPTOGRAPHIC DECISION LOG ENDPOINTS ─────────────────────────────────
  // Every decision SOVEREIGN makes is sealed, attributed, and permanently
  // queryable. Alfredo Medina Hernandez — on every record.

  /// Returns all DecisionRecords in the given block range.
  /// Use to trace the full ancestry of any system state or artifact.
  public query func getDecisionLog(
    fromBlock : Nat,
    toBlock   : Nat,
  ) : async [ArchTypes.DecisionRecord] {
    ArtifactLib.getDecisionChain(artifactChainState, fromBlock, toBlock)
  };

  /// Returns the LEGACY_INDEX — one entry per sealed artifact with its
  /// doctrine alignment, VELA step at seal, and decision count.
  /// Ring 15: every sealed artifact is queryable with full ancestry.
  public query func getLegacyIndex() : async [ArchTypes.ArtifactLegacyEntry] {
    ArtifactLib.buildLegacyIndex(artifactChainState)
  };

  /// Returns all DecisionRecords that contributed to a specific artifact.
  /// Pass the artifact's attributionHash (SOVEREIGN://AMH/... format).
  public query func getArtifactDecisionChain(
    artifactHash : Text,
  ) : async [ArchTypes.DecisionRecord] {
    ArtifactLib.getArtifactDecisionChain(artifactChainState, artifactHash)
  };

  // ── B4: ORGANISM WEIGHT STORE ENDPOINTS ──────────────────────────────────
  // Ring 5 closure: Hebbian weight deltas persist across sessions.
  // Frontend pushes on every artifact seal, pulls on every page load.

  /// Push Hebbian weight deltas from frontend after an artifact seal.
  /// Each WeightDelta carries: organismId, pathway, delta, beatStamp, sealId.
  /// Organisms accumulate learning across sessions — never start fresh.
  public func pushOrganismWeightDeltas(
    deltas : [ArchTypes.WeightDelta],
  ) : async () {
    ArtifactLib.pushOrganismWeightDeltas(artifactChainState, deltas)
  };

  /// Pull weight deltas for a specific organism (frontend page load).
  public query func pullOrganismWeights(
    organismId : Text,
  ) : async [ArchTypes.WeightDelta] {
    ArtifactLib.pullOrganismWeights(artifactChainState, organismId)
  };

  /// Pull all weight deltas — bulk frontend initialization on page load.
  public query func pullAllWeightDeltas() : async [ArchTypes.WeightDelta] {
    ArtifactLib.pullAllWeightDeltas(artifactChainState)
  };

  // ── RING 12: MASTERY PROGRESSION ENDPOINTS ────────────────────────────────

  /// Returns mastery state for a specific organism.
  /// Includes: cumulativeQuality, masteryTier (0-10), tiersUnlocked.
  public query func getOrganismMasteryState(
    organismId : Text,
  ) : async ?ArchTypes.OrgMasteryState {
    ArtifactLib.getOrgMasteryState(artifactChainState, organismId)
  };

  /// Returns mastery state for ALL organisms as a flat array.
  public query func getAllOrganismMasteryStates() : async [ArchTypes.OrgMasteryState] {
    ArtifactLib.getAllOrgMasteryStates(artifactChainState)
  };

  // ── RING 14: PHI CALIBRATOR ENDPOINTS ────────────────────────────────────

  /// Returns the current PHI drift score (0.0 = perfect alignment, 1.0 = max drift).
  public query func getPhiDriftScore() : async Float {
    ArtifactLib.getPhiDriftScore(artifactChainState)
  };

  /// Returns the 5 PHI correction weights — one per output dimension.
  /// These feed back into the quality seal PHI_COHERENCE scoring dimension.
  public query func getPhiCorrectionWeights() : async [Float] {
    ArtifactLib.getPhiCorrectionWeights(artifactChainState)
  };

}
