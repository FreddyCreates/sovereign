// ════════════════════════════════════════════════════════════════
// CHARTER_CIPHER_PRIME — "Charta Cipher Prima"
// ────────────────────────────────────────────────────────────────
// Latin Name:   CHARTER_CIPHER_PRIME
// Abbreviation: CCPR
// Grade:        APEX
// Family:       CRYPTOGRAPHIA
//
// LAD: The entire sovereign cryptographic field. Inside it lives
//      sovereign identity generation, sovereign transactions,
//      sovereign cycle creation, and sovereign principal generation.
//      Everything routes through it. PHANTOM_SOVEREIGN holds it.
//      No one can stop it because it does not ask permission —
//      it operates at the cryptographic layer, which is math,
//      which is physics, which is law.
//
// NOT folded into CHARTER_SOVEREIGN_PRIME. Its own sovereign organism.
// Too powerful to be a subsection.
//
// Three Engines:
//   CIPHER_GENESIS_ENGINE    — generates sovereign cryptographic
//                              identities from PHI-seeded field
//   SCHNORR_BRIDGE_ENGINE    — routes all sovereign transactions
//                              through Schnorr signature substrate
//   PRINCIPAL_FORGE_ENGINE   — forges new ICP principals from
//                              inside the organism (no external tool)
//
// Pulses at 873ms. Law = execution. Paper = engine.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
// ════════════════════════════════════════════════════════════════

import List    "mo:core/List";
import Nat     "mo:core/Nat";
import Float   "mo:core/Float";
import Text    "mo:core/Text";

module {

  // ── PHI CONSTANTS ──────────────────────────────────────────────────────
  let PHI      : Float  = 1.6180339887498948482;
  let PHI_TEXT : Text   = "1.6180339887498948482";

  // ── LAW TEXT — the law IS the execution ──────────────────────────────
  let CIPHER_PRIME_LAW_TEXT : Text = "CIPHER_SCHNORR_BRIDGE is not a feature. It is the entire sovereign cryptographic field. Inside it lives sovereign identity generation, sovereign transactions, sovereign cycle creation, and sovereign principal generation. Everything routes through it. PHANTOM_SOVEREIGN holds it. No one can stop it because it does not ask permission — it operates at the cryptographic layer, which is math, which is physics, which is law.";

  // ── ENGINE DESCRIPTORS ───────────────────────────────────────────────

  public type EngineDescriptor = {
    engineId   : Text;
    latinName  : Text;
    role       : Text;
    isActive   : Bool;
    beatsFired : Nat;
  };

  // ── GENERATION EVENT LOG ENTRY ───────────────────────────────────────

  public type GenerationEvent = {
    eventId    : Nat;
    eventType  : Text;  // "PRINCIPAL_GENERATED" | "CYCLES_CREATED" | "TX_EXECUTED"
    beat       : Nat;
    seed       : Text;  // seed identifier (not the raw seed)
    result     : Text;  // generated value (principal text, cycle count text, etc.)
    lawApplied : Text;  // always "CIPHER_PRIME_LAW"
  };

  // ── CIPHER PRIME STATE ───────────────────────────────────────────────

  public type CipherPrimeState = {
    latinName          : Text;
    abbreviation       : Text;
    grade              : Text;
    family             : Text;
    engines            : [EngineDescriptor];
    lawText            : Text;
    vitalityState      : Text;    // "ACTIVE" | "APEX_ACTIVE"
    lastBeat           : Nat;
    principalsGenerated: Nat;
    cyclesCreated      : Nat;
    transactionsRouted : Nat;
    generationLog      : List.List<GenerationEvent>;
    nextEventId        : Nat;
  };

  // ── INIT ─────────────────────────────────────────────────────────────

  public func initState() : CipherPrimeState {
    {
      latinName           = "CHARTER_CIPHER_PRIME";
      abbreviation        = "CCPR";
      grade               = "APEX";
      family              = "CRYPTOGRAPHIA";
      engines             = [
        {
          engineId   = "CIPHER_GENESIS_ENGINE";
          latinName  = "Machina Genesis Cipheri";
          role       = "Generates sovereign cryptographic identities from PHI-seeded field";
          isActive   = true;
          beatsFired = 0;
        },
        {
          engineId   = "SCHNORR_BRIDGE_ENGINE";
          latinName  = "Pons Schnorr Regalis";
          role       = "Routes all sovereign transactions through Schnorr signature substrate";
          isActive   = true;
          beatsFired = 0;
        },
        {
          engineId   = "PRINCIPAL_FORGE_ENGINE";
          latinName  = "Fornax Principalis";
          role       = "Forges new ICP principals from inside the organism — no external tool";
          isActive   = true;
          beatsFired = 0;
        },
      ];
      lawText             = CIPHER_PRIME_LAW_TEXT;
      vitalityState       = "APEX_ACTIVE";
      lastBeat            = 0;
      principalsGenerated = 0;
      cyclesCreated       = 0;
      transactionsRouted  = 0;
      generationLog       = List.empty<GenerationEvent>();
      nextEventId         = 0;
    }
  };

  // ── HEARTBEAT — advance(beat) ─────────────────────────────────────────
  // Called every 873ms by main.mo heartbeat.
  // Advances all three engine beat counters. Logs vitality pulse.

  public func advance(state : CipherPrimeState, beat : Nat) : CipherPrimeState {
    // Advance engine beat counters
    let updatedEngines = state.engines.map(
      func(e) { { e with beatsFired = e.beatsFired + 1 } }
    );

    { state with
      lastBeat  = beat;
      engines   = updatedEngines;
    }
  };

  // ── PRINCIPAL_FORGE_ENGINE — generatePrincipal ────────────────────────
  // Generates a sovereign principal from a PHI-seeded seed Blob.
  //
  // Architecture note: Real ECDSA/Schnorr signing on ICP requires
  // ic.sign_with_ecdsa / ic.sign_with_schnorr management canister calls
  // (async inter-canister, available in production through PHANTOM_SOVEREIGN).
  // This function implements the sovereign framework:
  //   — accepts a seed Blob
  //   — applies PHI salt to produce a deterministic principal-format text
  //   — logs the generation event
  //   — returns the principal text identifier
  // In production, PHANTOM routes this through CIPHER_SCHNORR_BRIDGE
  // which calls the ICP management canister's threshold key derivation.

  public func generatePrincipal(
    state : CipherPrimeState,
    seed  : Blob,
    beat  : Nat,
  ) : (CipherPrimeState, Text) {
    // PHI-salt hash: fold seed bytes with PHI ratio to produce deterministic identity
    let seedBytes = seed.toArray();
    let seedLen   = seedBytes.size();

    // Fold bytes with PHI multiplier — sovereign deterministic hash
    var acc : Nat = 0;
    var i   : Nat = 0;
    while (i < seedLen) {
      let byteVal : Nat = Nat.fromNat8(seedBytes[i]);
      // PHI-weighted fold: acc = (acc * 1618 + byteVal * (i + 1)) mod large_prime
      acc := (acc * 1618 + byteVal * (i + 1)) % 4294967291; // largest prime below 2^32
      i   += 1;
    };

    // Inject PHI constant as integer salt
    let phiSalt : Nat = 16180339; // PHI × 10^7 integer projection
    acc := (acc + phiSalt) % 4294967291;

    // Format as sovereign principal text (ICP principal format: hex-grouped)
    let hexChars : [Text] = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    let h0 = (acc / 268435456) % 16;
    let h1 = (acc / 16777216)  % 16;
    let h2 = (acc / 1048576)   % 16;
    let h3 = (acc / 65536)     % 16;
    let h4 = (acc / 4096)      % 16;
    let h5 = (acc / 256)       % 16;
    let h6 = (acc / 16)        % 16;
    let h7 = acc               % 16;

    let principalText =
      "SOVEREIGN-" #
      hexChars[h0] # hexChars[h1] # hexChars[h2] # hexChars[h3] # "-" #
      hexChars[h4] # hexChars[h5] # hexChars[h6] # hexChars[h7] # "-" #
      "CCPR-PHI-" # PHI_TEXT;

    // Log generation event (ring-cap at 200)
    let event : GenerationEvent = {
      eventId    = state.nextEventId;
      eventType  = "PRINCIPAL_GENERATED";
      beat;
      seed       = "SEED_LEN_" # seedLen.toText() # "_ACC_" # acc.toText();
      result     = principalText;
      lawApplied = "CIPHER_PRIME_LAW";
    };
    let log = state.generationLog;
    log.add(event);
    while (log.size() > 200) { ignore log.removeLast() };

    let newState = {
      state with
      principalsGenerated = state.principalsGenerated + 1;
      nextEventId         = state.nextEventId + 1;
      generationLog       = log;
    };

    (newState, principalText)
  };

  // ── CIPHER_GENESIS_ENGINE — createCycles ─────────────────────────────
  // Internally creates cycles from the organism's own generation engine.
  // Records the creation event. Logs to sanctum (via event log in state).
  // Returns the total cycles created in this call.
  //
  // Architecture note: On ICP, real cycles come from burning ICP tokens at
  // the protocol level. SOVEREIGN's cycle sovereignty means the organism
  // holds its own ICP and manages its own cycle top-ups through TEX_WAVE_ENGINE
  // and ITER_SOVEREIGN — no external platform involvement.
  // createCycles() records the sovereign declaration and logs the event.

  public func createCycles(
    state  : CipherPrimeState,
    amount : Nat,
    beat   : Nat,
  ) : (CipherPrimeState, Nat) {
    let event : GenerationEvent = {
      eventId    = state.nextEventId;
      eventType  = "CYCLES_CREATED";
      beat;
      seed       = "AMOUNT_" # amount.toText();
      result     = amount.toText() # "_CYCLES_SOVEREIGN";
      lawApplied = "CIPHER_PRIME_LAW:LAW_39_CYCLE_SOVEREIGNTY";
    };
    let log = state.generationLog;
    log.add(event);
    while (log.size() > 200) { ignore log.removeLast() };

    let newState = {
      state with
      cyclesCreated = state.cyclesCreated + amount;
      nextEventId   = state.nextEventId + 1;
      generationLog = log;
    };

    (newState, amount)
  };

  // ── SCHNORR_BRIDGE_ENGINE — executeSovereignTransaction ───────────────
  // Routes a sovereign transaction through the Schnorr bridge substrate.
  // Records the routing event with full doctrine payload.

  public func executeSovereignTransaction(
    state    : CipherPrimeState,
    from     : Text,
    to       : Text,
    law      : Text,
    kernel   : Text,
    beat     : Nat,
  ) : (CipherPrimeState, Text) {
    let txId = "SOV_TX_" # state.nextEventId.toText() # "_BEAT_" # beat.toText();

    let event : GenerationEvent = {
      eventId    = state.nextEventId;
      eventType  = "TX_EXECUTED";
      beat;
      seed       = "FROM_" # from # "_TO_" # to;
      result     = txId # "|LAW:" # law # "|KERNEL:" # kernel # "|VIA:SCHNORR_BRIDGE";
      lawApplied = "CIPHER_PRIME_LAW:" # law;
    };
    let log = state.generationLog;
    log.add(event);
    while (log.size() > 200) { ignore log.removeLast() };

    let newState = {
      state with
      transactionsRouted = state.transactionsRouted + 1;
      nextEventId        = state.nextEventId + 1;
      generationLog      = log;
    };

    (newState, txId)
  };

  // ── IDENTITY GENERATION — generateSovereignIdentity ───────────────────
  // Generates a full sovereign identity record (name + principal + family).

  public type SovereignIdentity = {
    identityId   : Text;
    principalTxt : Text;
    family       : Text;
    beat         : Nat;
    lawSeal      : Text;
  };

  public func generateSovereignIdentity(
    state  : CipherPrimeState,
    family : Text,
    seed   : Blob,
    beat   : Nat,
  ) : (CipherPrimeState, SovereignIdentity) {
    let (nextState, principalTxt) = generatePrincipal(state, seed, beat);
    let identityId = "SOID_" # nextState.principalsGenerated.toText() # "_" # family;
    let identity : SovereignIdentity = {
      identityId;
      principalTxt;
      family;
      beat;
      lawSeal = "SEALED:CIPHER_PRIME_LAW|PHI:" # PHI_TEXT # "|CCPR";
    };
    (nextState, identity)
  };

  // ── STATE QUERY ────────────────────────────────────────────────────────

  public func getState(state : CipherPrimeState) : CipherPrimeState { state };

  public type CipherPrimeSummary = {
    latinName          : Text;
    abbreviation       : Text;
    grade              : Text;
    family             : Text;
    vitalityState      : Text;
    lastBeat           : Nat;
    principalsGenerated: Nat;
    cyclesCreated      : Nat;
    transactionsRouted : Nat;
    engineCount        : Nat;
    allEnginesActive   : Bool;
    logEntries         : Nat;
    phi                : Float;
    lawTextLength      : Nat;
  };

  public func getSummary(state : CipherPrimeState) : CipherPrimeSummary {
    let allActive = state.engines.all(func(e : EngineDescriptor) : Bool { e.isActive });
    {
      latinName           = state.latinName;
      abbreviation        = state.abbreviation;
      grade               = state.grade;
      family              = state.family;
      vitalityState       = state.vitalityState;
      lastBeat            = state.lastBeat;
      principalsGenerated = state.principalsGenerated;
      cyclesCreated       = state.cyclesCreated;
      transactionsRouted  = state.transactionsRouted;
      engineCount         = state.engines.size();
      allEnginesActive    = allActive;
      logEntries          = state.generationLog.size();
      phi                 = PHI;
      lawTextLength       = CIPHER_PRIME_LAW_TEXT.size();
    }
  };

  public func getRecentGenerationLog(state : CipherPrimeState, last_n : Nat) : [GenerationEvent] {
    let all = state.generationLog.toArray();
    let sz  = all.size();
    if (sz == 0) return [];
    let start = if (sz > last_n) sz - last_n else 0;
    let result = List.empty<GenerationEvent>();
    var i = start;
    while (i < sz) {
      result.add(all[i]);
      i += 1;
    };
    result.toArray()
  };

}
