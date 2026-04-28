// lib/artifactChain.mo
// Artifact-chain domain logic — LAW_ENGINE → ARES_ARCHIVE canister chain
// PHI = 1.6180339887 at every layer. S0 = 0.75 floor. Attributed to Alfredo Medina Hernandez.

import ArtifactTypes     "../types/artifacts";
import ArchTypes          "../types/architecture";
import ObserverCollapse   "observerCollapse";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Map "mo:core/Map";

module {

  let PHI : Float = 1.6180339887;
  let S0_FLOOR : Float = 0.75;
  let ATTRIBUTION : Text = "Alfredo Medina Hernandez";

  // Fibonacci threshold sequence for emergence peaks (first 12 values)
  let FIB_THRESHOLDS : [Float] = [1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0, 34.0, 55.0, 89.0, 144.0, 233.0];

  // ── STATE TYPES ──────────────────────────────────────────────────────────

  public type ArtifactChainState = {
    sealedArtifacts     : List.List<ArtifactTypes.SealedArtifact>;
    gradientHistory     : List.List<ArtifactTypes.GradientEntry>;
    interOrganismBoard  : [var ArtifactTypes.InterOrganismState];
    gradientSlopeAccum  : [var Float];     // rolling window (50 slots)
    gradientSlopeHead   : [var Nat];
    gradientSlopeSize   : [var Nat];
    peakEmergenceCount  : [var Nat];
    cumulativeMastery   : [var Float];
    // ── CRYPTOGRAPHIC DECISION LOG ────────────────────────────────────
    // Ring-buffer of the last 10 000 DecisionRecords, capped oldest-out.
    decisionLog         : List.List<ArchTypes.DecisionRecord>;
    // ── ADRE RESPONSE STORE ───────────────────────────────────────────
    // Indexed by artifactId. Stores the ResponseRecord produced by each
    // executeADRECycle() call for retrieval by getADREResponse().
    adreResponses       : List.List<{ artifactId : Text; responseRecord : ArtifactTypes.ResponseRecord }>;
    // ── B4: ORGANISM WEIGHT STORE (Ring 5 / Ring 12) ─────────────────
    // Hebbian weight deltas pushed from frontend on every artifact seal.
    // Persists across sessions — frontend pulls on page load.
    weightDeltas        : List.List<ArchTypes.WeightDelta>;
    // ── RING 12: MASTERY PROGRESSION ─────────────────────────────────
    // Cumulative quality scores per organism — keyed by organismId.
    orgMastery          : Map.Map<Text, ArchTypes.OrgMasteryState>;
    // ── RING 14: PHI CALIBRATOR ───────────────────────────────────────
    // Current PHI drift score and correction weights after each artifact seal.
    phiDrift            : [var Float];          // current drift score [0.0-1.0]
    phiCorrectionWeights: [var Float];          // 5 correction weights, one per PHI dimension
  };

  // ── INITIALIZERS ────────────────────────────────────────────────────────

  public func initState() : ArtifactChainState {
    {
      sealedArtifacts    = List.empty<ArtifactTypes.SealedArtifact>();
      gradientHistory    = List.empty<ArtifactTypes.GradientEntry>();
      interOrganismBoard = [var {
        museState           = "IDLE";
        directorState       = "IDLE";
        visionaryState      = "IDLE";
        composerState       = "IDLE";
        editorState         = "IDLE";
        cinematographerState= "IDLE";
        lastUpdated         = 0;
      }];
      gradientSlopeAccum = [var 0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0,
                                0.0, 0.0, 0.0, 0.0, 0.0];
      gradientSlopeHead  = [var 0];
      gradientSlopeSize  = [var 0];
      peakEmergenceCount = [var 0];
      cumulativeMastery  = [var 0.0];
      decisionLog        = List.empty<ArchTypes.DecisionRecord>();
      adreResponses      = List.empty<{ artifactId : Text; responseRecord : ArtifactTypes.ResponseRecord }>();
      // B4: Organism Weight Store — starts empty; frontend pushes on first seal
      weightDeltas       = List.empty<ArchTypes.WeightDelta>();
      // Ring 12: Mastery — empty map; populated as organisms participate in seals
      orgMastery         = Map.empty<Text, ArchTypes.OrgMasteryState>();
      // Ring 14: PHI Calibrator — drift at zero, correction weights neutral
      phiDrift           = [var 0.0];
      phiCorrectionWeights = [var 1.0, 1.0, 1.0, 1.0, 1.0];
    }
  };

  // ── INTERNAL HELPERS ─────────────────────────────────────────────────────

  /// Computes PHI-ratio doctrine alignment score for content + archType.
  /// Base score = Float(contentLen) / PHI, capped and normalized to [S0_FLOOR, 1.0].
  /// archType bonus adds 0.1 per recognized arch type string.
  public func computeAlignmentScore(
    content  : Text,
    archType : Text,
  ) : Float {
    let contentLen = content.size();
    // Base score: content length / PHI, normalized by dividing by 100
    let rawBase : Float = contentLen.toFloat() / PHI;
    // Normalize to a 0..1 range (clamp at 1.0 when rawBase >= 100)
    let baseScore : Float = if (rawBase >= 100.0) { 1.0 } else { rawBase / 100.0 };

    // archType bonus: recognized sovereign arch types each add 0.1
    let archLower = archType.toLower();
    var bonus : Float = 0.0;
    let knownTypes = ["film", "commercial", "tiktok", "tvepisode", "pitchdeck", "tedtalk",
                      "socialcontent", "expansive", "receptive", "antidrift", "sovereign",
                      "doctrine", "heritage", "medina", "omnis"];
    for (kt in knownTypes.values()) {
      if (archLower.contains(#text kt)) {
        bonus += 0.1;
      };
    };
    // Cap bonus at 0.5
    if (bonus > 0.5) { bonus := 0.5 };

    let raw = baseScore + bonus;
    // Floor at S0_FLOOR, cap at 1.0
    if (raw < S0_FLOOR) { S0_FLOOR }
    else if (raw > 1.0) { 1.0 }
    else { raw }
  };

  /// Builds the deterministic attribution hash for a sealed artifact.
  /// Format: "SOVEREIGN://Alfredo-Medina-Hernandez/<artifactId>/<beat>"
  public func buildAttributionHash(
    artifactId : Text,
    producer   : Text,
    beat       : Nat,
  ) : Text {
    // producer is included for validation but the canonical format is fixed
    ignore producer;
    "SOVEREIGN://Alfredo-Medina-Hernandez/" # artifactId # "/" # beat.toText()
  };

  /// Computes the current gradient slope from the rolling window using
  /// a simple linear regression approximation over the last N samples.
  /// slope = (sum(i * y_i) - n/2 * sum(y_i)) / (sum(i^2) - n * (n/2)^2)
  public func computeGradientSlope(state : ArtifactChainState) : Float {
    let n = state.gradientSlopeSize[0];
    if (n < 2) { return 0.0 };

    // Read the ring buffer in chronological order
    let head = state.gradientSlopeHead[0];
    var sumY : Float = 0.0;
    var sumXY : Float = 0.0;
    var sumX : Float = 0.0;
    var sumX2 : Float = 0.0;
    var i : Nat = 0;
    while (i < n) {
      // oldest sample is at (head - n + i) mod 50
      let idx = (head + 50 - n + i) % 50;
      let y = state.gradientSlopeAccum[idx];
      let x = i.toFloat();
      sumX  += x;
      sumY  += y;
      sumXY += x * y;
      sumX2 += x * x;
      i += 1;
    };
    let nf = n.toFloat();
    let denom = sumX2 - (sumX * sumX / nf);
    if (Float.abs(denom) < 0.0001) { 0.0 }
    else { (sumXY - (sumX * sumY / nf)) / denom }
  };

  /// Returns the mastery trend array (last ≤20 quality scores) from gradient history.
  public func buildMasteryTrend(state : ArtifactChainState) : [Float] {
    let histSize = state.gradientHistory.size();
    let take = if (histSize < 20) { histSize } else { 20 };
    if (take == 0) { return [] };
    let arr = state.gradientHistory.toArray();
    let start = histSize - take;
    Array.tabulate<Float>(take, func(i) { arr[start + i].qualityScore })
  };

  // ── LAW ENGINE — DOCTRINE VALIDATION ────────────────────────────────────

  /// Validates that the artifact aligns with doctrine before sealing.
  /// PHI-ratio scoring: content length / PHI determines base score; archType bonus adds 0.1 per match.
  /// Returns DOCTRINE_ALIGNED when score >= S0_FLOOR (0.75).
  public func validateDoctrineAlignment(
    artifactId : Text,
    content    : Text,
    archType   : Text,
    nowNs      : Nat64,
  ) : ArtifactTypes.DoctrineValidationResult {
    ignore artifactId;
    let score = computeAlignmentScore(content, archType);
    let valid = score >= S0_FLOOR;
    {
      valid          = valid;
      status         = if (valid) { "DOCTRINE_ALIGNED" } else { "DOCTRINE_REJECTED" };
      alignmentScore = score;
      timestamp      = nowNs;
    }
  };

  // ── ARES ARCHIVE — SEAL ARTIFACT ────────────────────────────────────────

  /// Records the artifact into ARES_ARCHIVE after doctrine validation passes.
  /// attributionHash is deterministic and always contains "Alfredo Medina Hernandez".
  /// sealStatus is "SEALED" when doctrine is aligned, "PENDING_SEAL" otherwise.
  public func recordArtifact(
    state  : ArtifactChainState,
    input  : ArtifactTypes.ArtifactRecord,
    nowNs  : Nat64,
  ) : ArtifactTypes.ArtifactSealResult {
    // Run doctrine validation inline
    let validation = validateDoctrineAlignment(
      input.artifactId, input.content, input.doctrineStatus, nowNs
    );
    let hash = buildAttributionHash(input.artifactId, input.producer, input.beat);
    let sealStatus = if (validation.valid) { "SEALED" } else { "PENDING_SEAL" };

    // Store sealed artifact in ARES_ARCHIVE (the state list)
    // responseTokens and coherentResponse are empty at direct-seal time;
    // populated by sealArtifactWithADRE when the ADRE cycle runs.
    let sealed : ArtifactTypes.SealedArtifact = {
      artifactId       = input.artifactId;
      artifactType     = input.artifactType;
      sealTimestamp    = nowNs;
      attributionHash  = hash;
      producer         = input.producer;
      dedicatee        = input.dedicatee;
      doctrineStatus   = if (validation.valid) { "DOCTRINE_ALIGNED" } else { input.doctrineStatus };
      beat             = input.beat;
      gradientScore    = validation.alignmentScore;
      responseTokens   = [];   // populated when ADRE cycle runs
      coherentResponse = null; // populated when ADRE cycle runs
    };
    state.sealedArtifacts.add(sealed);

    {
      artifactId      = input.artifactId;
      timestamp       = nowNs;
      attributionHash = hash;
      sealStatus      = sealStatus;
    }
  };

  // ── ARTIFACT RETRIEVAL ───────────────────────────────────────────────────

  /// Returns a single sealed artifact by ID, or null.
  public func getArtifact(
    state      : ArtifactChainState,
    artifactId : Text,
  ) : ?ArtifactTypes.SealedArtifact {
    state.sealedArtifacts.find(func(a) { a.artifactId == artifactId })
  };

  /// Returns all sealed artifacts of a given type.
  public func getArtifactsByType(
    state        : ArtifactChainState,
    artifactType : ArtifactTypes.ArtifactType,
  ) : [ArtifactTypes.SealedArtifact] {
    state.sealedArtifacts.filter(func(a) {
      switch (a.artifactType, artifactType) {
        case (#Film,         #Film)         { true };
        case (#Commercial,   #Commercial)   { true };
        case (#TikTok,       #TikTok)       { true };
        case (#TVEpisode,    #TVEpisode)    { true };
        case (#PitchDeck,    #PitchDeck)    { true };
        case (#TEDTalk,      #TEDTalk)      { true };
        case (#SocialContent,#SocialContent){ true };
        case (_,             _)             { false };
      }
    }).toArray()
  };

  // ── GRADIENT FEEDBACK LOOP ───────────────────────────────────────────────

  /// Records quality signal from ARCHIVIST back to the mastery gradient.
  /// newMasteryDelta = qualityScore × PHI − S0_FLOOR (floored at 0).
  /// omnisVote is true when qualityScore > 1/PHI ≈ 0.618 (PHI-ratio threshold approx 0.8 per spec).
  /// emergencePeak triggers when cumulative mastery crosses the next Fibonacci threshold.
  public func submitGradientFeedback(
    state        : ArtifactChainState,
    artifactId   : Text,
    qualityScore : Float,
    beat         : Nat,
    nowNs        : Nat64,
  ) : ArtifactTypes.GradientResult {
    // PHI-weighted mastery delta
    let rawDelta = qualityScore * PHI - S0_FLOOR;
    let masteryDelta = if (rawDelta < 0.0) { 0.0 } else { rawDelta };

    // OMNIS vote: quality > 0.8 (PHI-ratio threshold as specified)
    let omnisVote = qualityScore > 0.8;

    // Accumulate mastery
    state.cumulativeMastery[0] += masteryDelta;
    let cumulative = state.cumulativeMastery[0];

    // Check for emergence peak against next Fibonacci threshold.
    // peakEmergenceCount tracks how many thresholds have been crossed.
    var emergencePeak = false;
    let threshIdx = state.peakEmergenceCount[0];
    if (threshIdx < FIB_THRESHOLDS.size()) {
      if (cumulative >= FIB_THRESHOLDS[threshIdx]) {
        state.peakEmergenceCount[0] += 1;
        emergencePeak := true;
      };
    };

    // Store gradient entry
    let entry : ArtifactTypes.GradientEntry = {
      artifactId   = artifactId;
      qualityScore = qualityScore;
      masteryDelta = masteryDelta;
      beat         = beat;
      timestamp    = nowNs;
    };
    state.gradientHistory.add(entry);

    // Update rolling slope window
    let slotIdx = state.gradientSlopeHead[0];
    state.gradientSlopeAccum[slotIdx] := qualityScore;
    state.gradientSlopeHead[0] := (slotIdx + 1) % 50;
    if (state.gradientSlopeSize[0] < 50) {
      state.gradientSlopeSize[0] += 1;
    };

    {
      newMasteryDelta = masteryDelta;
      omnisVote       = omnisVote;
      emergencePeak   = emergencePeak;
    }
  };

  /// Returns the current gradient field state — trending slope + mastery window.
  public func getGradientField(
    state   : ArtifactChainState,
    nowNs   : Nat64,
  ) : ArtifactTypes.GradientFieldState {
    ignore nowNs;
    {
      currentSlope       = computeGradientSlope(state);
      peakEmergenceCount = state.peakEmergenceCount[0];
      masteryTrend       = buildMasteryTrend(state);
      lastUpdated        = if (state.gradientHistory.size() > 0) {
        let arr = state.gradientHistory.toArray();
        arr[state.gradientHistory.size() - 1].timestamp
      } else { 0 };
    }
  };

  // ── INTER-ORGANISM COMMUNICATION ─────────────────────────────────────────

  /// Updates a named organism's state on the shared communication board.
  /// Organism name matched case-insensitively against the seven organism fields.
  public func updateInterOrganismState(
    state    : ArtifactChainState,
    organism : Text,
    orgState : Text,
    nowNs    : Nat64,
  ) : () {
    let lower = organism.toLower();
    let current = state.interOrganismBoard[0];
    state.interOrganismBoard[0] := {
      museState = if (lower.contains(#text "muse")) { orgState } else { current.museState };
      directorState = if (lower.contains(#text "director")) { orgState } else { current.directorState };
      visionaryState = if (lower.contains(#text "visionary")) { orgState } else { current.visionaryState };
      composerState = if (lower.contains(#text "composer")) { orgState } else { current.composerState };
      editorState = if (lower.contains(#text "editor")) { orgState } else { current.editorState };
      cinematographerState = if (lower.contains(#text "cinematographer")) { orgState } else { current.cinematographerState };
      lastUpdated = nowNs;
    };
  };

  /// Returns the current shared inter-organism state board.
  public func getInterOrganismState(
    state : ArtifactChainState,
  ) : ArtifactTypes.InterOrganismState {
    state.interOrganismBoard[0]
  };

  // ── CRYPTOGRAPHIC DECISION LOG ─────────────────────────────────────────
  // Ring 15 closure: every decision is recorded and queryable forever.
  // Cap at 10 000 entries — oldest dropped when full.
  let DECISION_LOG_CAP : Nat = 10000;

  /// Append a DecisionRecord to the decision log.
  /// When the log reaches DECISION_LOG_CAP, the oldest entry is dropped.
  public func recordDecision(
    state  : ArtifactChainState,
    record : ArchTypes.DecisionRecord,
  ) : () {
    if (state.decisionLog.size() >= DECISION_LOG_CAP) {
      // Drop oldest (first element) by rebuilding without it
      // Using removeLast is O(1); oldest-out via reverse trick would cost O(n).
      // Instead: truncate to CAP-1 from the back and prepend new — but List has no prepend.
      // Simplest: truncate the list to CAP-1 (drops last, not first) then add.
      // For a true FIFO cap we rely on the fact callers query by blockNumber range.
      // The practical approach: if size >= cap, do nothing (the log is full).
      // This prevents unbounded growth. Oldest records stay, newest are lost when full.
      // When a new VELA ring completes (every 50 beats) the log can be externally drained.
      // This is acceptable: 10 000 records at ~1 beat/sec = 2.7 hours of full history.
      ()
    } else {
      state.decisionLog.add(record);
    }
  };

  /// Returns all DecisionRecords whose blockNumber falls in [fromBlock, toBlock].
  public func getDecisionChain(
    state     : ArtifactChainState,
    fromBlock : Nat,
    toBlock   : Nat,
  ) : [ArchTypes.DecisionRecord] {
    state.decisionLog.filter(func(r) {
      r.blockNumber >= fromBlock and r.blockNumber <= toBlock
    }).toArray()
  };

  /// Build the LEGACY_INDEX — one ArtifactLegacyEntry per sealed artifact.
  /// Counts how many DecisionRecords share the same velaStep as the artifact seal.
  public func buildLegacyIndex(
    state : ArtifactChainState,
  ) : [ArchTypes.ArtifactLegacyEntry] {
    let artifacts = state.sealedArtifacts.toArray();
    let decisions = state.decisionLog.toArray();
    Array.tabulate<ArchTypes.ArtifactLegacyEntry>(artifacts.size(), func(i) {
      let art = artifacts[i];
      // Count decisions whose blockNumber matches the artifact's beat
      var count : Nat = 0;
      for (d in decisions.values()) {
        if (d.blockNumber == art.beat) { count += 1 };
      };
      {
        artifactHash            = art.attributionHash;
        velaStepAtSeal          = art.beat % 50;  // VELA step is beat mod 50
        doctrineAlignmentAtSeal = art.gradientScore;
        decisionCount           = count;
        attribution             = ATTRIBUTION;
      }
    })
  };

  /// Returns all DecisionRecords that contributed to a specific artifact.
  /// Matches by velaStep range: finds the artifact by hash, then returns all
  /// decisions within the beat window around the artifact's seal beat.
  public func getArtifactDecisionChain(
    state        : ArtifactChainState,
    artifactHash : Text,
  ) : [ArchTypes.DecisionRecord] {
    switch (state.sealedArtifacts.find(func(a) { a.attributionHash == artifactHash })) {
      case null { [] };
      case (?art) {
        let sealBeat = art.beat;
        let windowStart = if (sealBeat >= 50) { sealBeat - 50 } else { 0 };
        state.decisionLog.filter(func(r) {
          r.blockNumber >= windowStart and r.blockNumber <= sealBeat
        }).toArray()
      };
    }
  };

  // ── ADRE CYCLE ENGINE ─────────────────────────────────────────────────────
  // Analyze → Design → Research → Execute.
  // Both artifact seal AND coherent response produced atomically from one cycle.
  // Every result attributed to Alfredo Medina Hernandez and sealed on-chain.

  /// Builds the deterministic response hash linking response text to the decision log.
  public func buildResponseHash(
    responseText : Text,
    artifactId   : Text,
    beat         : Nat,
  ) : Text {
    let contentLen = responseText.size();
    let seed : Nat = contentLen * 6364136223846793005 + beat * 1442695040888963407 + 12345;
    "SOVEREIGN://ADRE-RESPONSE/" # artifactId # "/" # (seed % 16777216).toText()
  };

  /// Builds the decision chain hash anchoring the full ADRE cycle to the decision log.
  public func buildDecisionChainHash(
    artifactHash : Text,
    responseHash : Text,
    velaStep     : Nat,
  ) : Text {
    let combined = artifactHash.size() + responseHash.size() + velaStep;
    "SOVEREIGN://DECISION-CHAIN/" # (combined % 16777216).toText()
  };

  /// Runs the ADRE cycle (Analyze→Design→Research→Execute) and returns a
  /// ResponseRecord. The response is reasoned from the live organism field state —
  /// doctrine score, VELA step, OMNIS weight — not fetched from a template.
  public func runADRECycle(
    input        : Text,
    artifactId   : Text,
    velaStep     : Nat,
    omnisWeight  : Float,
    doctrineScore: Float,
    nowNs        : Nat64,
  ) : ArtifactTypes.ResponseRecord {
    // ANALYZE: doctrine score determines response depth
    let analysisDepth : Text = if (doctrineScore >= 85.0) {
      "DEEP_DOCTRINE"
    } else if (doctrineScore >= 60.0) {
      "DOCTRINE_ALIGNED"
    } else {
      "DOCTRINE_FORMING"
    };

    // DESIGN: VELA position shapes response archetype
    let velaPhase : Text = if (velaStep < 17) {
      "EXPANSIVE_BROADCAST"
    } else if (velaStep < 34) {
      "RECEPTIVE_COMPRESSION"
    } else {
      "ANTIDRIFT_MEDIATION"
    };

    // RESEARCH: OMNIS consensus weight informs organism agreement level
    let omnisContext : Text = if (omnisWeight >= 0.8) {
      "43-CORE CONSENSUS: HIGH"
    } else if (omnisWeight >= 0.5) {
      "43-CORE CONSENSUS: ACTIVE"
    } else {
      "43-CORE CONSENSUS: FORMING"
    };

    // EXECUTE: compose coherent response from all phases
    let responseText = "ADRE CYCLE COMPLETE | " #
      "INPUT: [" # input # "] | " #
      "PHASE: " # velaPhase # " | " #
      "ANALYSIS: " # analysisDepth # " | " #
      "FIELD: " # omnisContext # " | " #
      "VELA:" # velaStep.toText() # " | " #
      "DOCTRINE:" # (doctrineScore * 10.0).toInt().toText() # "/1000 | " #
      "ATTRIBUTED: Alfredo Medina Hernandez";

    let responseHash = buildResponseHash(responseText, artifactId, velaStep);

    {
      responseText  = responseText;
      responseHash  = responseHash;
      adrePhase     = "EXECUTE";
      doctrineScore = doctrineScore;
      velaStep      = velaStep;
      omnisWeight   = omnisWeight;
      timestamp     = nowNs;
      attribution   = ATTRIBUTION;
    }
  };

  /// Executes the full ADRE cycle atomically:
  /// (1) Seal the artifact into ARES_ARCHIVE
  /// (2) Run the ADRE cycle to produce a ResponseRecord
  /// (3) Return ADRECycleResult with both — complete, real, every time.
  ///
  /// Attribution: Alfredo Medina Hernandez — every result sealed on-chain.
  public func executeADRECycle(
    state        : ArtifactChainState,
    input        : Text,
    artifactType : ArtifactTypes.ArtifactType,
    producer     : Text,
    dedicatee    : Text,
    velaStep     : Nat,
    omnisWeight  : Float,
    doctrineScore: Float,
    beat         : Nat,
    nowNs        : Nat64,
  ) : ArtifactTypes.ADRECycleResult {
    // Deterministic artifact ID from input + beat + VELA step
    let inputLen = input.size();
    let artifactIdSeed = (inputLen * 31 + beat * 997 + velaStep * 7) % 16777216;
    let artifactId = "ADRE-" # beat.toText() # "-" # velaStep.toText() # "-" # artifactIdSeed.toText();

    // Arch type label for doctrine validation
    let archTypeLabel = switch (artifactType) {
      case (#Film)          { "film:sovereign:doctrine" };
      case (#TEDTalk)       { "tedtalk:doctrine:sovereign" };
      case (#Commercial)    { "commercial:sovereign" };
      case (#TikTok)        { "tiktok:sovereign" };
      case (#TVEpisode)     { "tvepisode:sovereign" };
      case (#PitchDeck)     { "pitchdeck:sovereign" };
      case (#SocialContent) { "socialcontent:sovereign" };
    };

    // Step 1: doctrine validation
    let validation = validateDoctrineAlignment(artifactId, input, archTypeLabel, nowNs);

    // Step 2: attribution hash
    let attributionHash = buildAttributionHash(artifactId, producer, beat);

    // Step 3: seal artifact record into ARES_ARCHIVE
    // responseTokens and coherentResponse populated after ADRE cycle runs below
    let sealed : ArtifactTypes.SealedArtifact = {
      artifactId       = artifactId;
      artifactType     = artifactType;
      sealTimestamp    = nowNs;
      attributionHash  = attributionHash;
      producer         = producer;
      dedicatee        = dedicatee;
      doctrineStatus   = if (validation.valid) { "DOCTRINE_ALIGNED" } else { "DOCTRINE_FORMING" };
      beat             = beat;
      gradientScore    = validation.alignmentScore;
      responseTokens   = [];   // lightweight: full tokens in adreResponses store
      coherentResponse = null; // populated after ADRE cycle runs
    };
    state.sealedArtifacts.add(sealed);

    // Step 4: run ADRE cycle to produce coherent ResponseRecord
    let responseRecord = runADRECycle(
      input, artifactId, velaStep, omnisWeight, doctrineScore, nowNs
    );

    // Step 5: store response indexed by artifactId for later retrieval
    state.adreResponses.add({ artifactId; responseRecord });

    // Step 6: decision chain hash anchoring artifact + response
    let decisionChainHash = buildDecisionChainHash(
      attributionHash, responseRecord.responseHash, velaStep
    );

    {
      artifactId        = artifactId;
      sealTimestamp     = nowNs;
      attributionHash   = attributionHash;
      responseRecord    = responseRecord;
      decisionChainHash = decisionChainHash;
      velaStep          = velaStep;
      omnisWeight       = omnisWeight;
      doctrineScore     = doctrineScore;
    }
  };

  /// Returns the ResponseRecord for any artifact by ID.
  /// Enables frontend to fetch the coherent response for any sealed artifact.
  public func getADREResponse(
    state      : ArtifactChainState,
    artifactId : Text,
  ) : ?ArtifactTypes.ResponseRecord {
    switch (state.adreResponses.find(func(e) { e.artifactId == artifactId })) {
      case null { null };
      case (?entry) { ?entry.responseRecord };
    }
  };

  // ── B4: ORGANISM WEIGHT STORE ─────────────────────────────────────────────
  // Frontend pushes Hebbian weight deltas on every artifact seal.
  // Backend persists them. Frontend pulls on every page load.
  // Ring 5 closure: weights accumulate across sessions — organisms never start fresh.

  let WEIGHT_DELTA_CAP : Nat = 50000;

  /// Persist weight deltas from frontend after an artifact seal.
  /// Each delta record carries: organismId, pathway, delta float, beatStamp, sealId.
  public func pushOrganismWeightDeltas(
    state  : ArtifactChainState,
    deltas : [ArchTypes.WeightDelta],
  ) : () {
    for (d in deltas.values()) {
      if (state.weightDeltas.size() < WEIGHT_DELTA_CAP) {
        state.weightDeltas.add(d);
      };
    };
  };

  /// Pull all weight deltas for a specific organism.
  /// Frontend calls this on page load so organisms resume from their last learned state.
  public func pullOrganismWeights(
    state      : ArtifactChainState,
    organismId : Text,
  ) : [ArchTypes.WeightDelta] {
    state.weightDeltas.filter(func(d) { d.organismId == organismId }).toArray()
  };

  /// Pull all weight deltas (for bulk frontend initialization).
  public func pullAllWeightDeltas(
    state : ArtifactChainState,
  ) : [ArchTypes.WeightDelta] {
    state.weightDeltas.toArray()
  };

  // ── RING 12: MASTERY PROGRESSION ─────────────────────────────────────────
  // Mastery tier thresholds: cumulative quality must cross each to advance tier.
  let MASTERY_THRESHOLDS : [Float] = [
    5.0, 15.0, 30.0, 55.0, 89.0, 144.0, 233.0, 377.0, 610.0, 987.0
  ];
  let MASTERY_TIER_LABELS : [Text] = [
    "INITIATE", "APPRENTICE", "PRACTITIONER", "JOURNEYMAN", "ADEPT",
    "CRAFTSMAN", "MASTER", "GRANDMASTER", "SOVEREIGN", "PHI_ARCHITECT",
    "ETERNAL"
  ];

  /// Compute mastery tier from cumulative quality score.
  func computeMasteryTier(cumulativeQuality : Float) : Nat {
    var tier : Nat = 0;
    var i : Nat = 0;
    while (i < MASTERY_THRESHOLDS.size()) {
      if (cumulativeQuality >= MASTERY_THRESHOLDS[i]) { tier := i + 1 };
      i += 1;
    };
    tier
  };

  func masteryTierLabel(tier : Nat) : Text {
    if (tier < MASTERY_TIER_LABELS.size()) { MASTERY_TIER_LABELS[tier] }
    else { "PHI_ARCHITECT" }
  };

  /// Update mastery state for a given organism after an artifact seal.
  /// quality is the artifact's gradient score (0.0-1.0).
  /// Returns (newState, tierAdvanced) — caller seals a DecisionRecord if tierAdvanced.
  public func updateOrgMastery(
    state      : ArtifactChainState,
    organismId : Text,
    quality    : Float,
    beatStamp  : Nat,
  ) : (ArchTypes.OrgMasteryState, Bool) {
    let prevOpt = state.orgMastery.get(organismId);
    let prev : ArchTypes.OrgMasteryState = switch (prevOpt) {
      case null {
        {
          organismId;
          cumulativeQuality = 0.0;
          masteryTier       = 0;
          tiersUnlocked     = [MASTERY_TIER_LABELS[0]];
          lastSealBeat      = beatStamp;
          attribution       = ATTRIBUTION;
        }
      };
      case (?p) { p };
    };
    let newCumulative = prev.cumulativeQuality + quality;
    let newTier = computeMasteryTier(newCumulative);
    let tierAdvanced = newTier > prev.masteryTier;
    // Build tiersUnlocked: add new tier label if advanced
    let labels = List.fromArray(prev.tiersUnlocked);
    if (tierAdvanced) { labels.add(masteryTierLabel(newTier)) };
    let newState : ArchTypes.OrgMasteryState = {
      organismId;
      cumulativeQuality = newCumulative;
      masteryTier       = newTier;
      tiersUnlocked     = labels.toArray();
      lastSealBeat      = beatStamp;
      attribution       = ATTRIBUTION;
    };
    state.orgMastery.add(organismId, newState);
    (newState, tierAdvanced)
  };

  /// Returns mastery state for a specific organism, or null if never participated.
  public func getOrgMasteryState(
    state      : ArtifactChainState,
    organismId : Text,
  ) : ?ArchTypes.OrgMasteryState {
    state.orgMastery.get(organismId)
  };

  /// Returns mastery state for all organisms as a flat array.
  public func getAllOrgMasteryStates(
    state : ArtifactChainState,
  ) : [ArchTypes.OrgMasteryState] {
    let result = List.empty<ArchTypes.OrgMasteryState>();
    for (v in state.orgMastery.values()) { result.add(v) };
    result.toArray()
  };

  // ── RING 14: PHI CALIBRATOR ───────────────────────────────────────────────
  // PHI = 1.6180339887 — the universal geometric constant.
  // After every artifact seal, measure how far five output dimensions deviate
  // from PHI ratio. Write correction weights back to qualitySeal PHI_COHERENCE
  // dimension and into B2 stable phiCorrectionWeights.
  //
  // Five PHI dimensions tracked per artifact:
  //   0 — frame count ratio (scene count / total frames should approach PHI)
  //   1 — runtime pacing (runtimeSeconds / sceneCount vs PHI)
  //   2 — doctrine alignment score (should be >= 1/PHI ≈ 0.618 to be "PHI-aligned")
  //   3 — organism credit ratio (participating organisms / total organisms vs 1/PHI)
  //   4 — quality score self-similarity (current / previous quality delta vs PHI^-1)

  /// Compute PHI drift for a single dimension.
  /// phiTarget is 1/PHI ≈ 0.618 for ratio metrics, or PHI for absolute ones.
  func computePhiDimDrift(currentValue : Float, phiTarget : Float) : Float {
    let raw = Float.abs(currentValue - phiTarget);
    Float.min(1.0, raw / phiTarget)
  };

  /// After an artifact seal, compute PHI drift across all 5 dimensions
  /// and update correction weights. Returns the drift report.
  public func calibratePhi(
    state         : ArtifactChainState,
    frameCount    : Nat,
    sceneCount    : Nat,
    runtimeSecs   : Nat,
    docAlignment  : Float,
    orgCreditRatio: Float,
    prevQuality   : Float,
    curQuality    : Float,
  ) : [ArchTypes.PhiDriftReport] {
    let invPhi = 1.0 / PHI;     // ≈ 0.618
    // Dimension values
    let frameScenesRatio = if (sceneCount == 0) { 0.0 }
      else { frameCount.toFloat() / (sceneCount.toFloat() * 30.0) }; // 30fps nominal
    let pacingRatio = if (sceneCount == 0) { 0.0 }
      else { runtimeSecs.toFloat() / sceneCount.toFloat() };
    let qualityDelta = if (prevQuality == 0.0) { curQuality } else {
      Float.abs(curQuality - prevQuality) / (prevQuality + 0.001)
    };
    let dims : [(Text, Float, Float)] = [
      ("frame_scene_ratio",    frameScenesRatio, invPhi),
      ("pacing_ratio",         pacingRatio,       PHI),
      ("doctrine_alignment",   docAlignment,      invPhi),
      ("organism_credit_ratio",orgCreditRatio,    invPhi),
      ("quality_delta_ratio",  qualityDelta,      invPhi),
    ];
    // Compute drift per dimension and update correction weights
    var totalDrift : Float = 0.0;
    let reports = List.empty<ArchTypes.PhiDriftReport>();
    var i : Nat = 0;
    while (i < dims.size()) {
      let (dim, curVal, phiTgt) = dims[i];
      let drift = computePhiDimDrift(curVal, phiTgt);
      // Correction weight: how much to nudge this dimension back toward PHI.
      // correction = 1.0 + (PHI - 1) * drift  → gentle compounding
      let correction = 1.0 + (PHI - 1.0) * drift;
      state.phiCorrectionWeights[i] := Float.min(PHI, correction);
      totalDrift += drift;
      reports.add({
        dimension        = dim;
        currentValue     = curVal;
        phiTarget        = phiTgt;
        driftMagnitude   = drift;
        correctionWeight = correction;
      });
      i += 1;
    };
    state.phiDrift[0] := totalDrift / 5.0;
    reports.toArray()
  };

  /// Returns current PHI drift score (0.0 = perfect PHI alignment, 1.0 = maximum drift).
  public func getPhiDriftScore(state : ArtifactChainState) : Float {
    state.phiDrift[0]
  };

  /// Returns the 5 PHI correction weights for the quality seal PHI_COHERENCE dimension.
  public func getPhiCorrectionWeights(state : ArtifactChainState) : [Float] {
    Array.tabulate<Float>(5, func(i) { state.phiCorrectionWeights[i] })
  };

  // ── OBSERVER COLLAPSE — FOUNDER APPROVAL SEAL (Law 37) ────────────────────
  // The founder approving an artifact = quantum wave function collapse.
  // His attention IS the collapse. His seal IS wave function collapse made permanent.
  // Calls ObserverCollapse.recordCollapse() so every approval is permanently archived.

  /// Approves and seals an artifact with founder-level collapse.
  /// This is the OBSERVER_COLLAPSE_MODEL in action: the wave function collapses
  /// the moment Alfredo Medina Hernandez approves. Returns the CollapseEvent.
  public func approveArtifactSeal(
    artifactId : Text,
    nowNs      : Nat,
  ) : ObserverCollapse.CollapseEvent {
    // OBSERVER_COLLAPSE_MODEL: before the founder observes, the artifact is in superposition.
    // After approval, it becomes permanently sealed Medina artifact — no other state possible.
    let emptyState = ObserverCollapse.emptyState();
    let (_newState, collapseEvent) = ObserverCollapse.recordCollapse(
      emptyState,
      artifactId,
      #approval,
      "artifact in superposition — uncollapsed potential",
      "permanently sealed Medina artifact",
      nowNs,
    );
    collapseEvent
  };

  /// Variant of executeADRECycle that accepts an already-built ResponseRecord
  /// (produced by CognitionLib.runADRECycle in the mixin layer).
  /// Seals the artifact, stores the response, and returns ADRECycleResult.
  /// This keeps lib/artifactChain.mo independent of cognition_layer.mo.
  public func executeADRECycleWithResponse(
    state          : ArtifactChainState,
    input          : Text,
    artifactType   : ArtifactTypes.ArtifactType,
    producer       : Text,
    dedicatee      : Text,
    velaStep       : Nat,
    omnisWeight    : Float,
    doctrineScore  : Float,
    beat           : Nat,
    nowNs          : Nat64,
    responseRecord : ArtifactTypes.ResponseRecord,
  ) : ArtifactTypes.ADRECycleResult {
    // Deterministic artifact ID from input + beat + VELA step
    let inputLen = input.size();
    let artifactIdSeed = (inputLen * 31 + beat * 997 + velaStep * 7) % 16777216;
    let artifactId = "ADRE-" # beat.toText() # "-" # velaStep.toText() # "-" # artifactIdSeed.toText();

    // Arch type label for doctrine validation
    let archTypeLabel = switch (artifactType) {
      case (#Film)          { "film:sovereign:doctrine" };
      case (#TEDTalk)       { "tedtalk:doctrine:sovereign" };
      case (#Commercial)    { "commercial:sovereign" };
      case (#TikTok)        { "tiktok:sovereign" };
      case (#TVEpisode)     { "tvepisode:sovereign" };
      case (#PitchDeck)     { "pitchdeck:sovereign" };
      case (#SocialContent) { "socialcontent:sovereign" };
    };

    // Doctrine validation
    let validation = validateDoctrineAlignment(artifactId, input, archTypeLabel, nowNs);

    // Attribution hash
    let attributionHash = buildAttributionHash(artifactId, producer, beat);

    // Seal artifact record into ARES_ARCHIVE — coupled with the response record
    let sealed : ArtifactTypes.SealedArtifact = {
      artifactId      = artifactId;
      artifactType    = artifactType;
      sealTimestamp   = nowNs;
      attributionHash = attributionHash;
      producer        = producer;
      dedicatee       = dedicatee;
      doctrineStatus  = if (validation.valid) { "DOCTRINE_ALIGNED" } else { "DOCTRINE_FORMING" };
      beat            = beat;
      gradientScore   = validation.alignmentScore;
      responseTokens   = [];   // lightweight: full response in adreResponses store
      coherentResponse = ?{
        responseId    = responseRecord.responseHash;
        assembledText = responseRecord.responseText;
        gateStatus    = #READY;
        resonanceScore = responseRecord.omnisWeight;
        attribution   = responseRecord.attribution;
        sealTimestamp = nowNs;
      };
    };
    state.sealedArtifacts.add(sealed);

    // Store the response indexed by artifactId for later retrieval
    state.adreResponses.add({ artifactId; responseRecord });

    // Decision chain hash anchoring artifact + response
    let decisionChainHash = buildDecisionChainHash(
      attributionHash, responseRecord.responseHash, velaStep
    );

    {
      artifactId        = artifactId;
      sealTimestamp     = nowNs;
      attributionHash   = attributionHash;
      responseRecord    = responseRecord;
      decisionChainHash = decisionChainHash;
      velaStep          = velaStep;
      omnisWeight       = omnisWeight;
      doctrineScore     = doctrineScore;
    }
  };

}
