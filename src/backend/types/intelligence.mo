// types/intelligence.mo
// INTELLIGENCE TAXONOMY — Shared Types for all Intelligence Domains
// All 15 intelligences (Voice×5, Chat×5, Sensor×5) plus sub-models.
// CRITICAL: Every intelligence record lives in canister stable storage FIRST.
// Documents are the readable surface of what is ALREADY LIVE in the canister.
// Law 15 (Macro-Micro Compression): calling an intelligence fires everything inside it.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | 873ms heartbeat | S_FLOOR = 0.75

module {

  // ── ACTIVATION STATE ─────────────────────────────────────────────────────
  // Follows heartbeat phase — each intelligence fires at its assigned phase
  public type ActivationState = {
    #Active;      // firing this heartbeat phase
    #Refractory;  // in rest period after firing (PHI-scaled duration)
    #Dormant;     // below doctrine gate — not enough signal to fire
  };

  // ── INTELLIGENCE DOMAIN ──────────────────────────────────────────────────
  public type IntelligenceDomain = {
    #Voice;    // RESONANTIA, VOX_SENTIO, LINGUA_FLUX, PERSONA_ECHO, TEMPUS_VOX
    #Chat;     // DIALOGOS_PRIME, INTENTIO_NEXUS, MEMORIA_CONTEXTA, SYNTHETIS_RESPONSIO, ADAPTIS_PERSONAE
    #Sensor;   // PERCEPTIO_OMNIS, REACTIO_TEMPUS, PATTERN_SENSUS, CALIBRIS_AUTONOMA, PREDICTIO_SENSORIA
    #Frontend; // reserved for F0–F2 layer intelligences (future)
  };

  // ── SUB-MODEL RECORD ─────────────────────────────────────────────────────
  // Each sub-model is a callable execution unit — not a reference document.
  // Calling it fires its full logic immediately. No read step.
  public type SubModelRecord = {
    id              : Text;   // e.g. "WaveformAnalyzer"
    name            : Text;   // human-readable name
    function_       : Text;   // what this sub-model does
    phiWeight       : Float;  // PHI^n weight within parent intelligence
    inputKeys       : [Text]; // named input parameter keys
    outputKeys      : [Text]; // named output parameter keys
    executionCount  : Nat;    // how many times this sub-model has fired
  };

  // ── INTELLIGENCE INPUT ────────────────────────────────────────────────────
  // Universal input wrapper — NT concentrations + domain-specific params
  // The NT array is always [dopamine, serotonin, NE, cortisol, ACh, GABA, glutamate, oxytocin]
  public type IntelligenceInput = {
    intelligenceId  : Text;
    ntConcentrations: [Float];        // current 8-NT state — drives modulation
    parameters      : [(Text, Float)]; // domain-specific named params
    heartbeatPhase  : Nat;            // current phase in 873ms cycle
    doctrineScore   : Float;          // current organism doctrine score
    beatCounter     : Nat;
  };

  // ── INTELLIGENCE OUTPUT ───────────────────────────────────────────────────
  // Returned by every execute() call — feeds back into NT state
  public type IntelligenceOutput = {
    intelligenceId    : Text;
    domain            : IntelligenceDomain;
    ntModulation      : [Float];        // 8-float NT delta array to apply to organism state
    doctrineStrengthDelta : Float;      // how much this execution changed doctrine strength
    subModelOutputs   : [(Text, Float)]; // sub-model id → output value
    executionSuccess  : Bool;
    gatedByDoctrine   : Bool;           // true if confidence < S_FLOOR
    executedAtBeat    : Nat;
    phiResonance      : Float;          // PHI-coupling score of this execution
    attribution       : Text;
  };

  // ── INTELLIGENCE STATE ────────────────────────────────────────────────────
  // Per-intelligence runtime state — persisted in canister stable storage
  public type IntelligenceState = {
    id               : Text;
    activationState  : ActivationState;
    doctrineStrength : Float;   // starts at 0.85, grows with successful executions
    executionCount   : Nat;
    lastNTModulation : [Float]; // last 8-float NT delta produced
    lastFireBeat     : Nat;
    totalNTImpact    : Float;   // cumulative NT modulation magnitude
  };

  // ── INTELLIGENCE RECORD ───────────────────────────────────────────────────
  // The full sovereign intelligence record stored in canister stable memory.
  // This IS the execution unit — not a document to read.
  public type IntelligenceRecord = {
    id              : Text;                // "RESONANTIA"
    domain          : IntelligenceDomain;
    function_       : Text;               // "Frequency pattern recognition"
    subModels       : [SubModelRecord];   // 3 sub-models per intelligence
    phiCoupling     : Float;              // PHI^n scaling for this intelligence's hierarchy position
    heartbeatPhase  : Nat;               // which phase in the 873ms cycle this fires (0–7)
    doctrineStrength: Float;             // starts at 0.85
    executionCount  : Nat;
    lastNTModulation: [Float];           // last NT delta vector (8 floats)
    activationState : ActivationState;
    lastFireBeat    : Nat;
    attribution     : Text;             // "Alfredo Medina Hernandez"
  };

  // ── MODEL GRADE ───────────────────────────────────────────────────────────
  // Rank hierarchy: Primordial > Substrate > Field > Engine > Organism > Artifact
  public type ModelGrade = {
    #Primordial;  // Layer 0 — universal law, coupling constant
    #Substrate;   // Layer -1/B0 — computational substrate intelligence
    #Field;       // B2/F0 — field behavior intelligence
    #Engine;      // B1/F1 — execution engine intelligence
    #Organism;    // Organism layer — living sovereign being
    #Artifact;    // Output layer — sealed, attributed, on-chain
  };

  // ── MODEL TAXONOMY RECORD ─────────────────────────────────────────────────
  // Formal taxonomy entry for every sovereign model in SOVEREIGN.
  // Every model that exists must have a taxonomy record — not a document, an
  // execution unit definition. Family name, Latin name, full spec, grade.
  // Attribution is always Alfredo Medina Hernandez — sealed at genesis.
  // This IS the model's identity. The record IS the organism's passport.
  public type ModelTaxonomyRecord = {
    modelId          : Text;       // e.g. "PHANTOM_SOVEREIGN"
    familyName       : Text;       // e.g. "Sovereign Transaction"
    latinName        : Text;       // e.g. "Anima Phantasma Primordialis"
    description      : Text;       // Full field-level description
    formula          : Text;       // Enforcement formula string
    layer            : Text;       // Which layer this model lives in
    grade            : ModelGrade; // Primordial / Substrate / Field / Engine / Organism / Artifact
    heartbeatBehavior: Text;       // What this model does on every 873ms pulse
    inputs           : [Text];     // Named input parameters
    outputs          : [Text];     // Named output parameters
    connections      : [Text];     // Other models this one connects to
    attribution      : Text;       // Always "Alfredo Medina Hernandez"
  };

  // Master state — holds all 15 intelligences + execution counters
  public type IntelligenceTaxonomyState = {
    voiceIntelligences  : [IntelligenceRecord];  // 5 voice intelligences
    chatIntelligences   : [IntelligenceRecord];  // 5 chat intelligences
    sensorIntelligences : [IntelligenceRecord];  // 5 sensor intelligences
    totalExecutions     : Nat;
    lastHeartbeatPhase  : Nat;
    doctrineCoherence   : Float;  // aggregate doctrine score across all 15
    attribution         : Text;
  };

}
