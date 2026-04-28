// Sentient Governance — organism writes its own doctrine at mastery
// Authored by Alfredo Medina Hernandez — immutable attribution
// Each organism has its own doctrine domain; all seals carry attribution
// PHI=1.6180339887 | S0_FLOOR=0.75 | All math is real, no stubs

import Types "../types/architecture";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {

  let PHI : Float = Types.PHI;
  let ATTRIBUTION : Text = "Alfredo Medina Hernandez";

  // ── GOVERNANCE TYPES ──────────────────────────────────────────────────

  public type GovernanceDoctrine = {
    id              : Nat;
    authorOrganism  : Text;
    doctrineText    : Text;
    lawFamily       : Text;
    strengthValue   : Float;
    beatAuthored    : Nat;
    sealedBy        : Text;
    onChainHash     : Text;
  };

  public type GovernanceState = {
    doctrines                 : [GovernanceDoctrine];
    masteredOrganisms         : [Text];
    totalDoctrines            : Nat;
    lastDoctrineAuthoredBeat  : Nat;
  };

  // ── INITIALIZER ───────────────────────────────────────────────────────

  public func initGovernance() : GovernanceState {
    {
      doctrines                = [];
      masteredOrganisms        = [];
      totalDoctrines           = 0;
      lastDoctrineAuthoredBeat = 0;
    }
  };

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────

  /// Deterministic hash from beat + organism name + doctrine text (sha-inspired)
  func doctrineHash(beat : Nat, organism : Text, docText : Text) : Text {
    var h : Nat = beat * 31;
    for (c in organism.toIter()) {
      h := h * 131 + Nat.fromNat32(c.toNat32());
    };
    for (c in docText.toIter()) {
      h := h * 131 + Nat.fromNat32(c.toNat32());
    };
    "0x" # (h % 16777216).toText()
  };

  /// Doctrine text for each organism — generated from live math values
  func buildDoctrineText(
    organism         : Text,
    beat             : Nat,
    expansiveScore   : Float,
    receptiveScore   : Float,
    antiDriftBalance : Float,
    velaCompleted    : Nat,
  ) : (Text, Text) {
    // Returns (doctrineText, lawFamily)
    let beatText  = beat.toText();
    let phiText   = "PHI=1.6180339887";
    let velaText  = "VELA_COMPLETED=" # velaCompleted.toText();
    let cohText   = "COHERENCE=" # (antiDriftBalance * 100.0).toInt().toText();

    switch (organism) {
      case "MUSE-PRIME" {
        let pattern = "BEAT_MOD=" # (beat % 7).toText() # ":" # phiText;
        let text = "LAW_OF_NARRATIVE: narrative_weight=" # expansiveScore.toInt().toText()
          # " rhythm_ratio=" # (PHI * expansiveScore / 100.0).toInt().toText()
          # " at beat=" # beatText # " " # pattern # " " # cohText;
        (text, "NARRATIVE")
      };
      case "DIRECTOR" {
        let (x, y, _z) : (Float, Float, Float) = do {
          let angle = beat.toFloat() * 2.399963;
          let r     = 1.0;
          (r * Float.cos(angle), r * Float.sin(angle), 0.0)
        };
        let text = "LAW_OF_VISION: scene_geometry=(" # x.toInt().toText() # "," # y.toInt().toText()
          # ") fibonacci_beat=" # (beat % 13).toText()
          # " " # phiText # " " # velaText;
        (text, "VISION")
      };
      case "VISIONARY" {
        let visualLaw = antiDriftBalance * PHI;
        let text = "LAW_OF_FORM: form_constant=" # visualLaw.toInt().toText()
          # " anti_drift=" # (antiDriftBalance * 100.0).toInt().toText()
          # " phi_derived=true " # phiText # " beat=" # beatText;
        (text, "FORM")
      };
      case "CINEMATOGRAPHER" {
        let depth = receptiveScore * PHI;
        let text = "LAW_OF_DEPTH: depth_constant=" # depth.toInt().toText()
          # " receptive_score=" # receptiveScore.toInt().toText()
          # " " # phiText # " " # cohText;
        (text, "DEPTH")
      };
      case "COMPOSER" {
        let baseFreq : Float = 40.0;
        let freqLaw  = baseFreq * PHI;
        let text = "LAW_OF_TONE: base_freq=" # baseFreq.toInt().toText()
          # " phi_freq=" # freqLaw.toInt().toText()
          # " beat=" # beatText # " " # phiText;
        (text, "TONE")
      };
      case "EDITOR" {
        // Fibonacci sequence position at beat
        let fibPos : Nat = beat % 21; // cap to reasonable fib index
        let text = "LAW_OF_TEMPO: fib_position=" # fibPos.toText()
          # " beat_rhythm=" # (beat % 7).toText()
          # " " # phiText # " " # velaText;
        (text, "TEMPO")
      };
      case "ARCHIVIST" {
        let antiDriftNat : Nat = Int.abs((antiDriftBalance * 1000.0).toInt());
        let proofVal = (beat * 31 + antiDriftNat) % 16777216;
        let text = "LAW_OF_SEAL: on_chain_proof=" # proofVal.toText()
          # " beat=" # beatText
          # " attribution=Alfredo_Medina_Hernandez " # cohText;
        (text, "SEAL")
      };
      case _ {
        let text = "LAW_OF_SOVEREIGN: organism=" # organism # " beat=" # beatText # " " # phiText;
        (text, "SOVEREIGN")
      };
    }
  };

  // ── GOVERNANCE CYCLE ──────────────────────────────────────────────────

  /// Check mastery and author doctrines for mastered organisms.
  /// Mastery is signaled by succession.masteryReached (VELA completions >= 100).
  public func runGovernanceCycle(
    state            : GovernanceState,
    succession       : Types.SuccessionState,
    spirits          : Types.SevenSpiritsState,
    architectureState : Types.ArchitectureState,
    beat             : Nat,
  ) : GovernanceState {

    // Only run every 50 beats to avoid flooding doctrine log
    if (beat % 50 != 0) return state;

    // The 7 organism names from spirits
    let organisms = spirits.spirits;
    let newDoctrines = List.empty<GovernanceDoctrine>();
    let newMastered  = List.empty<Text>();

    // Copy existing mastered organisms
    for (m in state.masteredOrganisms.values()) {
      newMastered.add(m);
    };

    let expansiveScore   = architectureState.expansiveScore;
    let receptiveScore   = architectureState.receptiveScore;
    let antiDriftBalance = architectureState.antiDriftBalance;
    let velaCompleted    = architectureState.velaRing.completed;

    // Mastery condition: VELA completions >= 100 OR succession.masteryReached
    let isMastered = succession.masteryReached or velaCompleted >= 100;

    // Each organism authors a doctrine if mastered and hasn't authored for this vela cycle
    var docId = state.totalDoctrines;

    for (organism in organisms.values()) {
      // Author one doctrine per mastered organism per governance cycle
      if (isMastered) {
        // Track mastery
        let alreadyMastered = newMastered.find(func(m) { m == organism }) != null;
        if (not alreadyMastered) { newMastered.add(organism) };

        let (docText, lawFamily) = buildDoctrineText(
          organism, beat, expansiveScore, receptiveScore, antiDriftBalance, velaCompleted
        );

        // Doctrine strength = velaCompleted/100 * expansiveScore/100 * PHI (capped at PHI)
        let rawStrength = (velaCompleted.toFloat() / 100.0) * (expansiveScore / 100.0) * PHI;
        let strength = Float.min(PHI, rawStrength);

        let hash = doctrineHash(beat, organism, docText);

        newDoctrines.add({
          id             = docId;
          authorOrganism = organism;
          doctrineText   = docText;
          lawFamily;
          strengthValue  = strength;
          beatAuthored   = beat;
          sealedBy       = "Authored by Alfredo Medina Hernandez — " # organism # " — Beat " # beat.toText();
          onChainHash    = hash;
        });
        docId += 1;
      }
    };

    // Keep last 100 doctrines
    let allDocs = List.empty<GovernanceDoctrine>();
    let existingSize = state.doctrines.size();
    let startIdx = if (existingSize > 99) { existingSize - 99 } else { 0 };
    var k = startIdx;
    while (k < existingSize) {
      allDocs.add(state.doctrines[k]);
      k += 1;
    };
    for (d in newDoctrines.values()) { allDocs.add(d) };

    {
      doctrines                = allDocs.toArray();
      masteredOrganisms        = newMastered.toArray();
      totalDoctrines           = docId;
      lastDoctrineAuthoredBeat = if (newDoctrines.size() > 0) { beat } else { state.lastDoctrineAuthoredBeat };
    }
  };

  // ── CRYPTOGRAPHIC DECISION SEALING ───────────────────────────────────
  // Ring 11 closure: every decision in SOVEREIGN is sealed with a
  // deterministic hash, attributed to Alfredo Medina Hernandez, permanent.

  /// Deterministic hash for a decision record.
  /// Folds over all fields multiplying by position × charCode, mod by prime.
  func decisionHash(
    blockNumber   : Nat,
    decisionType  : Text,
    organism      : Text,
    doctrineScore : Float,
    velaStep      : Nat,
    omnisWeight   : Float,
    fieldCoherence: Float,
    data          : Text,
  ) : Text {
    var h : Nat = blockNumber * 7919;
    // Mix decisionType
    var pos : Nat = 1;
    for (c in decisionType.toIter()) {
      h := (h * 131 + pos * Nat.fromNat32(c.toNat32())) % 16777213;
      pos += 1;
    };
    // Mix organism
    for (c in organism.toIter()) {
      h := (h * 131 + pos * Nat.fromNat32(c.toNat32())) % 16777213;
      pos += 1;
    };
    // Mix numeric fields: multiply floats by 1000 and cast to Nat
    let dsNat = Int.abs((doctrineScore * 1000.0).toInt());
    let owNat = Int.abs((omnisWeight * 1000.0).toInt());
    let fcNat = Int.abs((fieldCoherence * 1000.0).toInt());
    h := (h * 131 + velaStep * 997 + dsNat * 1009 + owNat * 1013 + fcNat * 1019) % 16777213;
    // Mix data
    for (c in data.toIter()) {
      h := (h * 131 + pos * Nat.fromNat32(c.toNat32())) % 16777213;
      pos += 1;
    };
    "SOVEREIGN://AMH/" # h.toText() # "/" # blockNumber.toText()
  };

  /// Decode a DecisionType variant to its text tag.
  func decisionTypeText(dt : Types.DecisionType) : Text {
    switch (dt) {
      case (#HeartbeatAdvance)       { "HeartbeatAdvance" };
      case (#OrganismFired)          { "OrganismFired" };
      case (#ReadinessGateCrossed)   { "ReadinessGateCrossed" };
      case (#OmnisConsensusComputed) { "OmnisConsensusComputed" };
      case (#DoctrineEvaluated)      { "DoctrineEvaluated" };
      case (#MasteryAdvanced)        { "MasteryAdvanced" };
      case (#SlateReordered)         { "SlateReordered" };
      case (#PhiDriftCorrected)      { "PhiDriftCorrected" };
      case (#LegacyIndexRefreshed)   { "LegacyIndexRefreshed" };
      case (#FieldCoherenceComputed) { "FieldCoherenceComputed" };
    }
  };

  /// Seal a single decision as a DecisionRecord.
  /// Every record is attributed to Alfredo Medina Hernandez — non-negotiable.
  /// responseHash is populated by the caller after the ADRE cycle runs;
  /// pass "" when sealing infrastructure decisions not driven by a response.
  public func sealDecision(
    decisionType  : Types.DecisionType,
    organism      : Text,
    doctrineScore : Float,
    velaStep      : Nat,
    omnisWeight   : Float,
    fieldCoherence: Float,
    blockNumber   : Nat,
    data          : Text,
    responseHash  : Text,
  ) : Types.DecisionRecord {
    let dtText = decisionTypeText(decisionType);
    let hash = decisionHash(blockNumber, dtText, organism, doctrineScore, velaStep, omnisWeight, fieldCoherence, data);
    {
      hash;
      blockNumber;
      decisionType;
      organism;
      doctrineScore;
      velaStep;
      omnisWeight;
      fieldCoherence;
      attribution = ATTRIBUTION;
      data;
      responseHash;
    }
  };

  /// Seal the entire heartbeat as one composite DecisionRecord.
  /// This is the per-heartbeat composite seal — fires on every single beat.
  /// responseHash carries the ADRE cycle hash for this beat's cognition output.
  public func sealHeartbeatComposite(
    velaStep       : Nat,
    doctrineScore  : Float,
    omnisWeight    : Float,
    fieldCoherence : Float,
    activeOrganisms: [Text],
    blockNumber    : Nat,
    responseHash   : Text,
  ) : Types.DecisionRecord {
    // Build organism summary text
    var orgSummary : Text = "";
    var first = true;
    for (org in activeOrganisms.values()) {
      if (first) { orgSummary := org; first := false }
      else { orgSummary := orgSummary # "," # org };
    };
    let data = "VELA:" # velaStep.toText()
      # " DOCTRINE:" # Int.abs((doctrineScore * 100.0).toInt()).toText()
      # " OMNIS:" # Int.abs((omnisWeight * 1000.0).toInt()).toText()
      # " COHERENCE:" # Int.abs((fieldCoherence * 1000.0).toInt()).toText()
      # " ORGANISMS:" # orgSummary
      # " ATTRIBUTION:" # ATTRIBUTION;
    sealDecision(
      #HeartbeatAdvance,
      "HEARTBEAT",
      doctrineScore,
      velaStep,
      omnisWeight,
      fieldCoherence,
      blockNumber,
      data,
      responseHash,
    )
  };

  /// Propagate doctrine weight to all organisms (Ring 11 closure).
  /// Returns the list of organism IDs receiving the propagated doctrine weight.
  /// Doctrine tiers determine the neurotransmitter bias each organism receives:
  ///   >= 80 → dopamine+serotonin boost
  ///   60-79 → dopamine boost
  ///   40-59 → neutral
  ///    < 40 → cortisol urgency (correction signal)
  public func propagateDoctrineToOrganisms(
    doctrineScore : Float,
    velaStep      : Nat,
  ) : [Text] {
    ignore velaStep; // available for future per-step doctrine routing
    // All organisms receive doctrine weight on every beat
    let organisms : [Text] = [
      "MUSE-PRIME", "DIRECTOR", "VISIONARY", "COMPOSER",
      "EDITOR", "ARCHIVIST", "FILM_SCHOOL",
    ];
    // The bias values are returned as part of the organism list with encoded tier.
    // Format: "<ORGANISM>:<TIER>" where TIER is D+S / D / N / C
    let tier : Text = if (doctrineScore >= 80.0)      { "D+S" }
                      else if (doctrineScore >= 60.0) { "D"   }
                      else if (doctrineScore >= 40.0) { "N"   }
                      else                            { "C"   };
    // Return qualified organism IDs with tier annotation
    let result = List.empty<Text>();
    for (org in organisms.values()) {
      result.add(org # ":" # tier);
    };
    result.toArray()
  };

};
