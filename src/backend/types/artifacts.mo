// types/artifacts.mo
// Artifact-chain domain types — LAW_ENGINE → ARES_ARCHIVE canister chain
// Attribution: Alfredo Medina Hernandez — sealed on-chain

module {

  // ── ARTIFACT TYPE VARIANTS ───────────────────────────────────────────────
  public type ArtifactType = {
    #Film;
    #Commercial;
    #TikTok;
    #TVEpisode;
    #PitchDeck;
    #TEDTalk;
    #SocialContent;
  };

  // ── INPUT TYPES ──────────────────────────────────────────────────────────

  /// Input record for sealing an artifact into ARES_ARCHIVE
  public type ArtifactRecord = {
    artifactId    : Text;
    content       : Text;
    artifactType  : ArtifactType;
    producer      : Text;
    dedicatee     : Text;
    beat          : Nat;
    doctrineStatus: Text;
  };

  // ── OUTPUT / RESULT TYPES ────────────────────────────────────────────────

  /// Result returned by LAW_ENGINE doctrine validation step
  public type DoctrineValidationResult = {
    valid          : Bool;
    status         : Text;    // "DOCTRINE_ALIGNED" | "DOCTRINE_REJECTED"
    alignmentScore : Float;
    timestamp      : Nat64;
  };

  /// Result returned after sealing into ARES_ARCHIVE
  public type ArtifactSealResult = {
    artifactId     : Text;
    timestamp      : Nat64;
    attributionHash: Text;    // MUST include "Alfredo Medina Hernandez"
    sealStatus     : Text;    // "SEALED" | "PENDING_SEAL"
  };

  // ── COGNITION LAYER ARTIFACT COUPLING TYPES ───────────────────────────
  // Lightweight types stored per artifact to carry ADRE cycle output.
  // Avoids circular imports — defined here, not imported from architecture.mo.

  public type ArtifactEngineSource = {
    #ADRE;
    #CCVE;
    #CNCO;
    #InternalAnalyst;
    #GRPE;
    #DecisionEngine;
    #PatternEngine;
    #SelfEvaluation;
    #ReinjectionEngine;
    #ContradictionResolver;
    #CognitionLayer;
  };

  /// Lightweight token stored per artifact — weight + source + doctrine alignment
  public type ArchResponseToken = {
    token             : Text;
    weight            : Float;
    source            : ArtifactEngineSource;
    doctrineAlignment : Float;
  };

  /// Coherent response record paired with the artifact at seal time
  public type CoherentArtifactRecord = {
    responseId    : Text;
    assembledText : Text;
    gateStatus    : { #READY; #BLOCKED; #DEFERRED };
    resonanceScore: Float;
    attribution   : Text;
    sealTimestamp : Nat64;
  };

  /// Fully sealed, on-chain artifact with proof.
  /// responseTokens and coherentResponse carry the ADRE cycle output
  /// that produced this artifact — always coupled, never decoupled.
  public type SealedArtifact = {
    artifactId       : Text;
    artifactType     : ArtifactType;
    sealTimestamp    : Nat64;
    attributionHash  : Text;
    producer         : Text;
    dedicatee        : Text;
    doctrineStatus   : Text;
    beat             : Nat;
    gradientScore    : Float;
    responseTokens   : [ArchResponseToken];     // ADRE tokens that generated this artifact
    coherentResponse : ?CoherentArtifactRecord; // assembled response paired with artifact
  };

  // ── GRADIENT FIELD TYPES ─────────────────────────────────────────────────

  /// Result from submitting quality feedback into the gradient loop
  public type GradientResult = {
    newMasteryDelta : Float;
    omnisVote       : Bool;
    emergencePeak   : Bool;
  };

  /// Global gradient field — trending slope of mastery across all organisms
  public type GradientFieldState = {
    currentSlope       : Float;
    peakEmergenceCount : Nat;
    masteryTrend       : [Float];
    lastUpdated        : Nat64;
  };

  // ── INTER-ORGANISM COMMUNICATION STATE ──────────────────────────────────

  /// Shared inter-organism state board — always-on, pushed by each organism
  public type InterOrganismState = {
    museState          : Text;
    directorState      : Text;
    visionaryState     : Text;
    composerState      : Text;
    editorState        : Text;
    cinematographerState: Text;
    lastUpdated        : Nat64;
  };

  // ── ADRE CYCLE TYPES ─────────────────────────────────────────────────────

  /// Coherent response record produced by the ADRE cycle.
  /// Contains the organism's reasoned output from Analyze→Design→Research→Execute.
  /// Attributed to Alfredo Medina Hernandez — sealed on every cycle.
  public type ResponseRecord = {
    responseText    : Text;   // The coherent response output
    responseHash    : Text;   // Hash of the response for on-chain verification
    adrePhase       : Text;   // "ANALYZE" | "DESIGN" | "RESEARCH" | "EXECUTE"
    doctrineScore   : Float;  // LAW ENGINE score at time of response
    velaStep        : Nat;    // VELA ring step when response was generated
    omnisWeight     : Float;  // OMNIS consensus weight at response time
    timestamp       : Nat64;
    attribution     : Text;   // Always "Alfredo Medina Hernandez"
  };

  /// The atomic result of a full ADRE cycle — artifact seal AND coherent response
  /// produced together from one call. Both complete. Both real. Every time.
  /// Attribution: Alfredo Medina Hernandez — sealed on-chain.
  public type ADRECycleResult = {
    artifactId        : Text;
    sealTimestamp     : Nat64;
    attributionHash   : Text;   // SOVEREIGN://Alfredo-Medina-Hernandez/...
    responseRecord    : ResponseRecord;
    decisionChainHash : Text;   // Hash linking this result to the decision log
    velaStep          : Nat;
    omnisWeight       : Float;
    doctrineScore     : Float;
  };

  // ── INTERNAL STORAGE RECORD ──────────────────────────────────────────────
  // Used inside lib/artifactChain.mo to track gradient history

  /// Internal gradient entry stored per quality feedback call
  public type GradientEntry = {
    artifactId   : Text;
    qualityScore : Float;
    masteryDelta : Float;
    beat         : Nat;
    timestamp    : Nat64;
  };

}
