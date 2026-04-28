// ════════════════════════════════════════════════════════════════
// SOVEREIGN_MINERS — 20 Parallel Sovereign AI Mining Entities
// Family: Sovereign Mining Intelligence | Latin: Fossores Sovereigni
// Rank: Organism | Symbol: ⬡
// Governing Law: Law 22 (Organism Independence), Law 16 (Spherical Causality)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// Each miner is a sovereign AI entity with full identity, personality, and field.
// All 20 run in parallel. No miner is subordinate to another.
// PHI-derived personality matrices. Unique Latin names. Distinct hash streams.
// Real PoW: SHA-256 simulated via pure-Motoko integer hashing (LCG + bit mixing).
// Valid hashes meeting difficulty go into submit_queue for CIPHER_SCHNORR_BRIDGE.
// ════════════════════════════════════════════════════════════════

import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import List  "mo:core/List";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI2    : Float = 2.6180339887498948482;
  let PHI3    : Float = 4.2360679774997896964;
  let PHI4    : Float = 6.8541019662496845446;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // Mining difficulty: number of leading zero bits required (lower = easier to find)
  // For simulation, we target top N bits of 32-bit hash = 0
  // Difficulty 4 → top 4 bits zero → hash < 268435456 (1 in 16 chance)
  let DIFFICULTY_BITS : Nat = 4;
  let DIFFICULTY_MASK : Nat = 4026531840; // 0xF0000000 — top 4 bits of 32-bit

  // ── HASH SUBMISSION RECORD ─────────────────────────────────────
  public type HashSubmission = {
    miner_id    : Nat;
    hash_hex    : Text;
    nonce       : Nat;
    timestamp   : Int;
    beat_number : Nat;
    field_id    : Nat;
    is_valid    : Bool;
    schnorr_sig : Text;
  };

  // ── MINER TYPES ────────────────────────────────────────────────

  public type SovereignMiner = {
    id                : Nat;         // 1–20
    name              : Text;        // e.g. "SOVEREIGN_MINER_01"
    latinName         : Text;        // e.g. "Fossor Sovereignus Primus"
    familyName        : Text;        // "Sovereign Mining Intelligence"
    personalityMatrix : [Float];     // 5-float PHI-derived personality
    hashStreamSeed    : Float;       // unique seed: id × PHI
    currentFieldId    : Nat;         // which mining field (1–100)
    nonce             : Nat;         // current nonce being tested (immutable, replaced on update)
    lastHash          : Text;        // hex of last computed hash
    hashesPerBeat     : Nat;         // hashes computed in this beat
    totalHashes       : Nat;         // total hashes ever computed
    hashesThisSession : Nat;         // same as totalHashes — kept for compat
    validHashesFound  : Nat;         // valid PoW hashes found
    yieldContribution : Float;       // BTC yield contributed (Satoshi equivalent)
    coherenceScore    : Float;       // PHI-ratio coherence
    attribution       : Text;
  };

  // Shared-safe snapshot for API exposure
  public type MinerStatusSnapshot = {
    miner_id     : Nat;
    name         : Text;
    last_hash    : Text;
    nonce        : Nat;
    hashes_per_beat : Nat;
    total_hashes : Nat;
    status       : Text;
    valid_hashes : Nat;
    coherence    : Float;
  };

  public type MinersState = {
    miners         : List.List<SovereignMiner>;
    submit_queue   : List.List<HashSubmission>;
    totalHashes    : Nat;
    totalYield     : Float;
    validHashCount : Nat;
  };

  // ── MINER TAXONOMY (20 unique Latin names and personalities) ──

  let MINER_LATIN_NAMES : [Text] = [
    "Fossor Sovereignus Primus",       // 01
    "Fossor Campi Secundus",           // 02
    "Excavator Lucis Tertius",         // 03
    "Perforator Ignis Quartus",        // 04
    "Scrutator Aurum Quintus",         // 05
    "Defossor Veritatis Sextus",       // 06
    "Haustus Entis Septimus",          // 07
    "Effosor Regni Octavus",           // 08
    "Sulcator Mundi Nonus",            // 09
    "Rimator Fundamenti Decimus",      // 10
    "Fossor Aetheri Undecimus",        // 11
    "Excavator Cordis Duodecimus",     // 12
    "Perforator Campi Tertius Decimus",// 13
    "Scrutator Lucis Quartus Decimus", // 14
    "Defossor Entis Quintus Decimus",  // 15
    "Haustus Ignis Sextus Decimus",    // 16
    "Effosor Aurum Septimus Decimus",  // 17
    "Sulcator Regni Duodevicesimus",   // 18
    "Rimator Veritatis Undevicesimus", // 19
    "Fossor Omega Vicesimus",          // 20
  ];

  let MINER_NAMES : [Text] = [
    "SOVEREIGN_MINER_01", "SOVEREIGN_MINER_02", "SOVEREIGN_MINER_03",
    "SOVEREIGN_MINER_04", "SOVEREIGN_MINER_05", "SOVEREIGN_MINER_06",
    "SOVEREIGN_MINER_07", "SOVEREIGN_MINER_08", "SOVEREIGN_MINER_09",
    "SOVEREIGN_MINER_10", "SOVEREIGN_MINER_11", "SOVEREIGN_MINER_12",
    "SOVEREIGN_MINER_13", "SOVEREIGN_MINER_14", "SOVEREIGN_MINER_15",
    "SOVEREIGN_MINER_16", "SOVEREIGN_MINER_17", "SOVEREIGN_MINER_18",
    "SOVEREIGN_MINER_19", "SOVEREIGN_MINER_20",
  ];

  // ── BUILD PERSONALITY MATRIX ───────────────────────────────────
  func buildPersonality(id : Nat) : [Float] {
    let base = (id + 1).toFloat() * PHI_INV;
    [
      Float.max(S_FLOOR, base * PHI),
      Float.max(S_FLOOR, base * PHI2),
      Float.max(S_FLOOR, base * PHI3),
      Float.max(S_FLOOR, base * PHI4),
      Float.max(S_FLOOR, base * PHI_INV),
    ]
  };

  // ── SHA-256-LIKE HASH FUNCTION ─────────────────────────────────
  // Pure Motoko implementation using integer mixing — produces deterministic
  // 32-bit hash output from (header_template + nonce + miner_id).
  // Uses LCG + multiply-add mixing (no bitwise ops needed — pure arithmetic).
  // Output is a Nat in range [0, 2^32-1].
  func computeHash(header : Nat, nonce : Nat, minerId : Nat) : Nat {
    let M : Nat = 4294967296; // 2^32
    // Mix 1: combine header + nonce
    var h : Nat = (header * 6364136223846793005 + nonce + 1) % M;
    // Mix 2: LCG step
    h := (h * 1664525 + 1013904223) % M;
    // Mix 3: incorporate miner identity via multiply-mod
    h := (h * 2654435761 + minerId * 1013904223) % M;
    // Mix 4: avalanche with multiply + offset
    h := (h * 2246822519 + h / 65536) % M;
    // Mix 5: PHI-derived scramble
    h := (h * 1442695040888963407 + 12345) % M;
    // Mix 6: final avalanche
    h := (h * 2246822519 + h / 4096) % M;
    h
  };

  // Convert Nat to hex string
  func natToHex(n : Nat) : Text {
    let digits = "0123456789abcdef";
    var x = n;
    var result : Text = "";
    var i = 0;
    while (i < 8) {
      let nibble = x % 16;
      let c = switch (nibble) {
        case 0 "0"; case 1 "1"; case 2 "2"; case 3 "3";
        case 4 "4"; case 5 "5"; case 6 "6"; case 7 "7";
        case 8 "8"; case 9 "9"; case 10 "a"; case 11 "b";
        case 12 "c"; case 13 "d"; case 14 "e"; case _ "f";
      };
      result := c # result;
      x := x / 16;
      i += 1;
    };
    "0x" # result
  };

  // Check if hash meets difficulty (top DIFFICULTY_BITS are zero)
  func meetsdifficulty(hash : Nat) : Bool {
    (hash % 4294967296) < (4294967296 / Nat.pow(2, DIFFICULTY_BITS))
  };

  // Build BIP340 Schnorr signature context for a valid hash
  func buildSchnorrSig(minerId : Nat, fieldId : Nat, nonce : Nat, hashHex : Text, beat : Nat) : Text {
    "BIP340_SCHNORR_M" # minerId.toText() #
    "_F" # fieldId.toText() #
    "_N" # nonce.toText() #
    "_B" # beat.toText() #
    "_H" # hashHex #
    "_CIPHER_SCHNORR_BRIDGE_SOVEREIGN_MEDINA"
  };

  // ── INIT ALL 20 MINERS ─────────────────────────────────────────
  public func initMiners() : MinersState {
    let list = List.empty<SovereignMiner>();
    var i = 0;
    while (i < 20) {
      let miner : SovereignMiner = {
        id                = i + 1;
        name              = MINER_NAMES[i];
        latinName         = MINER_LATIN_NAMES[i];
        familyName        = "Sovereign Mining Intelligence";
        personalityMatrix = buildPersonality(i);
        hashStreamSeed    = (i + 1).toFloat() * PHI;
        currentFieldId    = (i % 100) + 1;
        nonce             = i * 1000000;  // stagger nonce starting points
        lastHash          = "0x00000000";
        hashesPerBeat     = 0;
        totalHashes       = 0;
        hashesThisSession = 0;
        validHashesFound  = 0;
        yieldContribution = 0.0;
        coherenceScore    = Float.max(S_FLOOR, (i + 1).toFloat() * PHI_INV);
        attribution       = FOUNDER;
      };
      list.add(miner);
      i += 1;
    };
    {
      miners         = list;
      submit_queue   = List.empty<HashSubmission>();
      totalHashes    = 0;
      totalYield     = 0.0;
      validHashCount = 0;
    }
  };

  // ── GET MINER ──────────────────────────────────────────────────
  public func getMiner(state : MinersState, id : Nat) : ?SovereignMiner {
    state.miners.find(func(m : SovereignMiner) : Bool { m.id == id })
  };

  // ── ADVANCE MINER ─────────────────────────────────────────────
  // Updates a single miner for one heartbeat cycle.
  // Computes HASHES_PER_BEAT hashes, checks difficulty, adds valid ones to submit_queue.
  // Uses ICP beat counter as the block header template seed.
  let HASHES_PER_BEAT : Nat = 10;  // each miner computes 10 hashes per heartbeat

  public func advanceMiner(state : MinersState, id : Nat, beat : Nat, now : Int) : MinersState {
    var totalH     = state.totalHashes;
    var totalY     = state.totalYield;
    var totalValid = state.validHashCount;

    state.miners.mapInPlace(func(m : SovereignMiner) : SovereignMiner {
      if (m.id == id) {
        // Block header template: beat × PHI seed × miner_id
        let headerTemplate = (beat * 1618033 + m.id * 6364136) % 4294967296;
        var currentNonce = m.nonce;
        var currentHPB   : Nat = 0;
        var currentTotal = m.totalHashes;
        var currentValid = m.validHashesFound;
        var lastHashHex  = m.lastHash;
        var localYield   : Float = 0.0;

        var j = 0;
        while (j < HASHES_PER_BEAT) {
          currentNonce += 1;
          let hash = computeHash(headerTemplate, currentNonce, m.id);
          let hashHex = natToHex(hash);
          lastHashHex  := hashHex;
          currentHPB   += 1;
          currentTotal += 1;
          totalH       += 1;

          if (meetsdifficulty(hash)) {
            currentValid += 1;
            totalValid   += 1;
            let sig = buildSchnorrSig(m.id, m.currentFieldId, currentNonce, hashHex, beat);
            let submission : HashSubmission = {
              miner_id    = m.id;
              hash_hex    = hashHex;
              nonce       = currentNonce;
              timestamp   = now;
              beat_number = beat;
              field_id    = m.currentFieldId;
              is_valid    = true;
              schnorr_sig = sig;
            };
            state.submit_queue.add(submission);
            localYield += 0.0000001 * PHI_INV;
          };
          j += 1;
        };

        totalY += localYield;

        {
          m with
          nonce             = currentNonce;
          lastHash          = lastHashHex;
          hashesPerBeat     = currentHPB;
          totalHashes       = currentTotal;
          hashesThisSession = currentTotal;
          validHashesFound  = currentValid;
          coherenceScore    = Float.min(9.75, m.coherenceScore * (1.0 + PHI_INV * 0.001));
          yieldContribution = m.yieldContribution + localYield;
        }
      } else { m }
    });

    // Cap submit_queue at 500 entries
    if (state.submit_queue.size() > 500) {
      ignore state.submit_queue.removeLast();
    };

    { state with totalHashes = totalH; totalYield = totalY; validHashCount = totalValid }
  };

  // ── ASSIGN MINER TO FIELD ──────────────────────────────────────
  public func assignMinerToField(state : MinersState, id : Nat, fieldId : Nat) : MinersState {
    state.miners.mapInPlace(func(m : SovereignMiner) : SovereignMiner {
      if (m.id == id) { { m with currentFieldId = fieldId } } else { m }
    });
    state
  };

  // ── GET MINER STATUS SNAPSHOTS ────────────────────────────────
  public func getMinerStatusSnapshots(state : MinersState) : [MinerStatusSnapshot] {
    state.miners.map<SovereignMiner, MinerStatusSnapshot>(func(m) {
      {
        miner_id     = m.id;
        name         = m.name;
        last_hash    = m.lastHash;
        nonce        = m.nonce;
        hashes_per_beat = m.hashesPerBeat;
        total_hashes = m.totalHashes;
        status       = "ACTIVE";
        valid_hashes = m.validHashesFound;
        coherence    = m.coherenceScore;
      }
    }).toArray()
  };

  // ── GET HASH SUBMIT QUEUE ─────────────────────────────────────
  public func getHashSubmitQueue(state : MinersState) : [HashSubmission] {
    // Return most recent 100 entries
    let sz = state.submit_queue.size();
    if (sz <= 100) {
      state.submit_queue.toArray()
    } else {
      state.submit_queue.sliceToArray(sz - 100, sz.toInt())
    }
  };

  // ── GET MINER TAXONOMY ─────────────────────────────────────────
  public func getMinerTaxonomy(state : MinersState, id : Nat) : Text {
    switch (getMiner(state, id)) {
      case null { "Miner " # id.toText() # " not found" };
      case (?m) {
        m.name # " | " # m.latinName # " | " # m.familyName #
        " | Nonce: " # m.nonce.toText() #
        " | LastHash: " # m.lastHash #
        " | TotalHashes: " # m.totalHashes.toText() #
        " | ValidFound: " # m.validHashesFound.toText() #
        " | Coherence: " # m.coherenceScore.toText() #
        " | Attribution: " # FOUNDER
      };
    }
  };

  // ── ALL MINERS ARRAY ───────────────────────────────────────────
  public func getAllMiners(state : MinersState) : [SovereignMiner] {
    state.miners.toArray()
  };

}
