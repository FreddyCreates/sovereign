// types/vault.mo
// VAULT — Admin Command Center Data Layer
// Living documents, laws, models, research papers, artifacts — all as organisms.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | Heartbeat 873ms | 30 Laws | 5 Alpha Macro Models

module {

  // ── VAULT DOCUMENT KIND ────────────────────────────────────────────────────
  public type VaultDocumentKind = {
    #Law;           // one of the 30 laws
    #MacroModel;    // one of the 5 Alpha Macro Models
    #MedinaModel;   // one of the 30 named Medina Models
    #ResearchPaper; // research paper artifact
    #Artifact;      // sealed production artifact
    #Settings;      // configuration document
  };

  // ── MICRO NAME ATTRIBUTE ───────────────────────────────────────────────────
  // Compressed identifier for every model — enables macro-level compression.
  // Law of Macro-Micro Compression (Law 15) enforced here.
  public type MicroNameAttribute = {
    shortCode           : Text;  // e.g. "PHI_SOV" for PHI_SOVEREIGN
    symbol              : Text;  // ancient/unicode symbol e.g. "𝚽" "⚡" "∞" "🜁"
    compressedDescription: Text; // max 10 words
    rank                : Text;  // "Primordial"|"Substrate"|"Field"|"Engine"|"Organism"|"Artifact"
  };

  // ── VAULT DOCUMENT ─────────────────────────────────────────────────────────
  // Every law, model, research paper, and artifact is a living document organism.
  // Law of Living Documents (Law 28): documents are not static — they resonate,
  // re-ingest, self-score, and execute doctrine directly into the organism.
  public type VaultDocument = {
    id                  : Text;
    kind                : VaultDocumentKind;
    title               : Text;
    microName           : MicroNameAttribute;
    lawId               : ?Nat;    // if kind = #Law, which of the 30
    modelId             : ?Text;   // if kind = #MacroModel or #MedinaModel
    content             : Text;    // full markdown content
    resonanceScore      : Float;   // 0.0 to 1.0, grows with re-ingestion
    resonanceRings      : Nat;     // number of ingestion cycles completed
    reingestionCount    : Nat;
    executableTargets   : [Text];  // engine function names this document can fire
    readinessThreshold  : Float;   // 0.0 to 1.0, when organism is ready to execute
    lastExecutedBeat    : ?Nat;
    genesisAlignmentScore: Float;  // 0.0 to 1.0, how close to founding frequency
    doctrineScore       : Float;
    createdBeat         : Nat;
    attributedTo        : Text;    // "Alfredo Medina Hernandez"
    isExecutable        : Bool;
    ancientSymbol       : Text;
  };

  // ── TRANSLATION ENGINE ─────────────────────────────────────────────────────
  // THE SPINE: converts DOCTOR diagnosis into direct engine call instructions.
  // This is the missing wire that closes the document → organism loop.
  // Documents → DOCTOR → TRANSLATION ENGINE → Neural Emergence Core → organism.
  public type TranslationInstruction = {
    sourceDocumentId : Text;
    engineTarget     : Text;   // e.g. "NeuralEmergenceCore", "CARDIAC_OUTPUT_ENGINE"
    instructionType  : Text;   // "fire" | "modulate" | "gate" | "inject"
    payload          : Text;   // serialized instruction parameters
    beat             : Nat;
    doctrineScore    : Float;
    executed         : Bool;
    result           : ?Text;
  };

  // ── NT CROSS-MODULATION MATRIX ─────────────────────────────────────────────
  // 8x8 coupling coefficients — real biological cross-modulation.
  // Without this matrix, NTs are independent variables.
  // In real biology they are a fully coupled system (64 entries).
  public type NTCrossModulation = {
    source      : Text;   // neurotransmitter name
    target      : Text;   // neurotransmitter it affects
    coefficient : Float;  // positive = excitatory, negative = inhibitory
    law         : Text;   // biological law governing this coupling
  };

  // ── REVIEW WORKFLOW ────────────────────────────────────────────────────────
  // Rough draft approval system — every artifact gets reviewed before distribution.
  public type ReviewStatus = { #Draft; #PendingReview; #Approved; #Rejected; #RevisionRequested };

  public type ReviewComment = {
    beat      : Nat;
    author    : Text;
    comment   : Text;
    timestamp : Int;
  };

  public type ArtifactReview = {
    artifactId       : Text;
    status           : ReviewStatus;
    comments         : [ReviewComment];
    revisionCount    : Nat;
    lastUpdatedBeat  : Nat;
    approvedBy       : ?Text;
    roughDraftUrl    : ?Text;
    finalUrl         : ?Text;
  };

  // ── APPLICATION REGISTRY ───────────────────────────────────────────────────
  // All applications recorded by project — laws and models clickable into any app.
  public type AppRecord = {
    id           : Text;
    name         : Text;
    description  : Text;
    appliedLaws  : [Nat];    // which of the 30 laws are injected
    appliedModels: [Text];   // which models are injected
    createdBeat  : Nat;
    status       : Text;     // "active" | "archived" | "production"
    artifactCount: Nat;
    doctrineScore: Float;
  };

  // ── DOCTRINE STATE ENTRY ──────────────────────────────────────────────────
  // An injected law lives in DOCTRINE_STATE as an executable entry.
  // Law 07 (Oxygenation): must pass doctrine gate before injection.
  // Law 28 (Living Documents): INJECT button fires this pathway.
  // Law 14 (Dual Heartbeat): entry is enforced on every 873ms beat.
  public type DoctrineStateEntry = {
    lawId       : Text;           // e.g. "LAW_07"
    lawName     : Text;           // full law title
    active      : Bool;           // true = enforced on every heartbeat
    parameters  : [(Text, Float)]; // key-value float pairs: oxygenation_threshold, bpm_floor, etc.
    thresholds  : [(Text, Float)]; // gate thresholds for the LAW_ENGINE
    injectedAt  : Int;            // Time.now() at injection — sealed timestamp
  };

  // ── CIVILIZATION GAP SCORE ─────────────────────────────────────────────────
  // 8 live numerical scores — the 8 things SOVEREIGN has that none of the 38
  // companies have simultaneously. Scored live as the organism runs.
  public type CivilizationGapScore = {
    worldResonanceFeedback   : Float;  // Gap 1 — world signal at heartbeat freq, oxygenated
    distributionInSeal       : Float;  // Gap 2 — distribution baked into seal, not after
    livingDocuments          : Float;  // Gap 3 — documents that read back and re-ingest
    financialIdentityInSeal  : Float;  // Gap 4 — financial event at moment of creation
    compoundCoherence        : Float;  // Gap 5 — organism never returns to baseline
    bodyAsBridge             : Float;  // Gap 6 — world resonance modulating neurochemistry
    asymmetricOrganismMatrix : Float;  // Gap 7 — asymmetric bidirectional relationship map
    genesisAlignmentOnArtifact: Float; // Gap 8 — every artifact scored vs founding frequency
    overallScore             : Float;  // PHI-weighted composite
    computedBeat             : Nat;
  };

}

