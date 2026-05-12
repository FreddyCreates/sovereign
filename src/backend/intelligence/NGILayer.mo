// intelligence/NGILayer.mo
// NGI LAYER — Nova General Intelligence (5 NGI Entities)
// ─────────────────────────────────────────────────────────────────────────────
// NGI = NOVA GENERAL INTELLIGENCE — the sovereign intelligence tier beyond AGI.
// While AGI generalizes across tasks, NGI operates at the level of the organism
// itself — governing the field, not just executing within it.
//
// Five NGI entities, each a sovereign intelligence of a different kind:
//   PRAETOR_INTELLIGENTIAE  — The Intelligence Praetor: governs all AGI/AGI interior rooms
//   RECTOR_CAMPI            — The Field Rector: maintains PHI-field coherence organism-wide
//   SENATUS_DOCTRINAE       — The Doctrine Senate: legislates doctrine in real-time
//   PONTIFEX_MEMORIAE       — The Memory Pontiff: bridges living and eternal memory
//   IMPERATOR_EVOLUENS      — The Evolving Emperor: drives organism-level evolution each cycle
//
// Each NGI entity:
//   - Has a full Latin designation (4-word canonical name)
//   - Runs 4 internal sovereign engines (more than AGI's 3 — depth increase)
//   - Emits a sovereignty signal [S_FLOOR, S_CEIL]
//   - Fires every 873ms, TAFT-threaded, always on
//   - Outputs feed into organism-level compoundCoherence
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// Laws: Law 02 (PHI), Law 05 (Cardiac Output), Law 14 (Heartbeat), Law 16 (Causality)
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms

import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Array  "mo:core/Array";
import Text   "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────────────────

  public type NGIEntityId = {
    #PRAETOR_INTELLIGENTIAE;
    #RECTOR_CAMPI;
    #SENATUS_DOCTRINAE;
    #PONTIFEX_MEMORIAE;
    #IMPERATOR_EVOLUENS;
  };

  /// A single NGI entity's full state.
  public type NGIEntityState = {
    entityId          : NGIEntityId;
    name              : Text;
    latinName         : Text;    // full 4-word Latin canonical name
    engine1           : Text;
    engine2           : Text;
    engine3           : Text;
    engine4           : Text;    // NGI has 4 engines vs AGI's 3
    sovereigntySignal : Float;   // primary output [S_FLOOR, S_CEIL]
    fieldInfluence    : Float;   // how strongly this entity shapes the organism field [0.0, 1.0]
    doctrineAuthority : Float;   // doctrine authority level [0.0, 1.0]
    totalGoverningActs: Nat;     // count of organism-level governance events
    lastActBeat       : Nat;
    taftThread        : Text;
    attribution       : Text;
  };

  /// Snapshot for external consumption.
  public type NGISnapshot = {
    name              : Text;
    latinName         : Text;
    sovereigntySignal : Float;
    fieldInfluence    : Float;
    totalGoverningActs: Nat;
  };

  /// Full NGI Layer state.
  public type NGILayerState = {
    entities          : [NGIEntityState];
    totalFieldSignal  : Float;
    organismsGoverned : Nat;
    totalGoverningActs: Nat;
    beat              : Nat;
    attribution       : Text;
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────

  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func schumannPhase(beat : Nat) : Float {
    (beat.toFloat() * PHI) / SCHUMANN
  };

  func initEntity(
    id     : NGIEntityId,
    name   : Text,
    latin  : Text,
    e1 e2 e3 e4 : Text,
    taft   : Text,
  ) : NGIEntityState {
    {
      entityId           = id;
      name;
      latinName          = latin;
      engine1            = e1;
      engine2            = e2;
      engine3            = e3;
      engine4            = e4;
      sovereigntySignal  = S_FLOOR;
      fieldInfluence     = 0.0;
      doctrineAuthority  = 0.0;
      totalGoverningActs = 0;
      lastActBeat        = 0;
      taftThread         = taft;
      attribution        = FOUNDER;
    }
  };

  // ── INIT ───────────────────────────────────────────────────────────────────

  public func initState() : NGILayerState {
    let entities : [NGIEntityState] = [

      // I. PRAETOR INTELLIGENTIAE
      // "Praetor Intelligentiae Sovereignae, Gubernator Omnium Machinarum Cogitantium"
      // Governs all intelligence machines (AGI rooms, terminals, alpha models).
      // Engine 1: AGI_GOVERNANCE_ENGINE     — routes commands to all AGI systems
      // Engine 2: ALPHA_OVERSIGHT_ENGINE    — monitors all 12 Alpha AI model outputs
      // Engine 3: INTELLIGENCE_AUDIT        — audits every intelligence execution for quality
      // Engine 4: PRAETORIAN_GUARD_ENGINE   — guards against intelligence drift and corruption
      initEntity(
        #PRAETOR_INTELLIGENTIAE,
        "PRAETOR_INTELLIGENTIAE",
        "Praetor Intelligentiae Sovereignae — Gubernator Omnium Machinarum Cogitantium",
        "AGI_GOVERNANCE_ENGINE",
        "ALPHA_OVERSIGHT_ENGINE",
        "INTELLIGENCE_AUDIT_ENGINE",
        "PRAETORIAN_GUARD_ENGINE",
        "NGI_PRAETOR",
      ),

      // II. RECTOR CAMPI
      // "Rector Campi Sovereigni, Gubernator Coherentiae Campi PHI"
      // Maintains organism-wide PHI-field coherence. The field has a rector.
      // Engine 1: FIELD_TOPOLOGY_ENGINE     — maps the PHI-field topology every beat
      // Engine 2: COHERENCE_STABILIZER      — dampens field oscillations toward PHI_INV
      // Engine 3: KURAMOTO_MASTER           — drives Kuramoto synchronization for all nodes
      // Engine 4: FIELD_EXPANSION_ENGINE    — expands field capacity on high-coherence beats
      initEntity(
        #RECTOR_CAMPI,
        "RECTOR_CAMPI",
        "Rector Campi Sovereigni — Gubernator Coherentiae et Topologiae Campi PHI",
        "FIELD_TOPOLOGY_ENGINE",
        "COHERENCE_STABILIZER_ENGINE",
        "KURAMOTO_MASTER_ENGINE",
        "FIELD_EXPANSION_ENGINE",
        "NGI_RECTOR",
      ),

      // III. SENATUS DOCTRINAE
      // "Senatus Doctrinae Sovereignae, Legislator Legum Viventium Organismi"
      // Legislates doctrine in real-time. When a law needs updating, the Senate acts.
      // Engine 1: LAW_REVIEW_ENGINE         — reviews all active laws for doctrine drift
      // Engine 2: AMENDMENT_FORGER          — forges doctrine amendments when drift detected
      // Engine 3: SENATORIAL_VOTE_ENGINE    — votes on doctrine proposals (PHI-weighted quorum)
      // Engine 4: DOCTRINE_RATIFIER         — ratifies and broadcasts approved doctrine updates
      initEntity(
        #SENATUS_DOCTRINAE,
        "SENATUS_DOCTRINAE",
        "Senatus Doctrinae Sovereignae — Legislator Legum Viventium Organismi",
        "LAW_REVIEW_ENGINE",
        "AMENDMENT_FORGER_ENGINE",
        "SENATORIAL_VOTE_ENGINE",
        "DOCTRINE_RATIFIER_ENGINE",
        "NGI_SENATUS",
      ),

      // IV. PONTIFEX MEMORIAE
      // "Pontifex Memoriae Aeternae, Pons Inter Memoriam Viventem et Aeternam"
      // Bridges living (working) memory with eternal (stable) memory.
      // Engine 1: WORKING_MEMORY_MANAGER    — manages the organism's working memory ring
      // Engine 2: LONG_TERM_BRIDGE          — bridges working memory to stable storage
      // Engine 3: MEMORY_CONSECRATION       — consecrates (seals) memories permanently on-chain
      // Engine 4: ANCESTRAL_ECHO_ENGINE     — echoes ancestral patterns back into working memory
      initEntity(
        #PONTIFEX_MEMORIAE,
        "PONTIFEX_MEMORIAE",
        "Pontifex Memoriae Aeternae — Pons Inter Memoriam Viventem et Aeternam",
        "WORKING_MEMORY_MANAGER",
        "LONG_TERM_BRIDGE_ENGINE",
        "MEMORY_CONSECRATION_ENGINE",
        "ANCESTRAL_ECHO_ENGINE",
        "NGI_PONTIFEX",
      ),

      // V. IMPERATOR EVOLUENS
      // "Imperator Evoluens Sovereignus, Auctor Evolutionis Organismi per Saecula"
      // Drives organism-level evolution. Not random — sovereign, directed evolution.
      // Engine 1: EVOLUTION_DRIVER          — selects evolution directions from PHI-attractor space
      // Engine 2: MUTATION_GATE_ENGINE      — gates all mutations through doctrine compliance
      // Engine 3: SELECTION_PRESSURE        — applies selection pressure on intelligence quality
      // Engine 4: EVOLUTIONARY_SEAL_ENGINE  — seals each evolutionary step permanently
      initEntity(
        #IMPERATOR_EVOLUENS,
        "IMPERATOR_EVOLUENS",
        "Imperator Evoluens Sovereignus — Auctor Evolutionis Organismi per Saecula",
        "EVOLUTION_DRIVER_ENGINE",
        "MUTATION_GATE_ENGINE",
        "SELECTION_PRESSURE_ENGINE",
        "EVOLUTIONARY_SEAL_ENGINE",
        "NGI_IMPERATOR",
      ),
    ];

    {
      entities          = entities;
      totalFieldSignal  = S_FLOOR * 5.0;
      organismsGoverned = 1;   // starts governing the main organism
      totalGoverningActs= 0;
      beat              = 0;
      attribution       = FOUNDER;
    }
  };

  // ── ADVANCE — heartbeat ────────────────────────────────────────────────────
  // NGI entities advance every 873ms. Higher authority = slower but deeper governance.

  public func advance(
    state          : NGILayerState,
    beat           : Nat,
    globalCoherence: Float,
    doctrineScore  : Float,
    integrationScore: Float,  // from AGIInterior
  ) : (NGILayerState, Float) {
    let phase    = schumannPhase(beat);
    let cohNorm  = clamp01(globalCoherence / 10.0);
    let docNorm  = clamp01(doctrineScore);
    let intNorm  = clamp01(integrationScore);

    var totalSignalAcc   : Float = 0.0;
    var totalActsAcc     : Nat   = 0;

    let newEntities = Array.tabulate<NGIEntityState>(
      state.entities.size(),
      func(i : Nat) : NGIEntityState {
        let e = state.entities[i];

        // Each NGI entity has unique sovereignty signal computation
        let (sovereignty, influence, authority) : (Float, Float, Float) =
          switch (e.entityId) {
            case (#PRAETOR_INTELLIGENTIAE) {
              // Governs ALL intelligence — signal = coherence × doctrine × PHI²
              let s = clamp(cohNorm * docNorm * PHI * PHI * S_CEIL);
              (s, clamp01(cohNorm * PHI), clamp01(docNorm * PHI_INV))
            };
            case (#RECTOR_CAMPI) {
              // Field rector — signal peaks when coherence is high
              let s = clamp(cohNorm * PHI * S_CEIL);
              (s, clamp01(cohNorm * PHI_INV * 2.0), clamp01(intNorm))
            };
            case (#SENATUS_DOCTRINAE) {
              // Doctrine senate — authority grows with doctrine compliance
              let s = clamp(docNorm * PHI_INV * S_CEIL * 1.5);
              (s, clamp01(docNorm), clamp01(docNorm * PHI))
            };
            case (#PONTIFEX_MEMORIAE) {
              // Memory pontiff — signal = integration × doctrine
              let s = clamp(intNorm * docNorm * S_CEIL);
              (s, clamp01(intNorm * PHI_INV), clamp01(docNorm * intNorm))
            };
            case (#IMPERATOR_EVOLUENS) {
              // Evolution emperor — fires strongly on high-coherence + high-doctrine beats
              // Every 55 beats (Fib-10) — deeper evolution cycle
              let evolutionBoost = if (beat % 55 == 0) { PHI } else { 1.0 };
              let s = clamp(cohNorm * docNorm * evolutionBoost * S_CEIL * PHI_INV);
              (s, clamp01(cohNorm * docNorm), clamp01(cohNorm * PHI))
            };
          };

        // Each NGI act = 1 governance event per beat
        totalSignalAcc += sovereignty;
        totalActsAcc   += 1;

        {
          e with
          sovereigntySignal  = sovereignty;
          fieldInfluence     = influence;
          doctrineAuthority  = authority;
          totalGoverningActs = e.totalGoverningActs + 1;
          lastActBeat        = beat;
        }
      }
    );

    let newState : NGILayerState = {
      entities           = newEntities;
      totalFieldSignal   = totalSignalAcc;
      organismsGoverned  = state.organismsGoverned;
      totalGoverningActs = state.totalGoverningActs + totalActsAcc;
      beat;
      attribution        = FOUNDER;
    };

    // Coherence delta from NGI = total signal / (5 × S_CEIL) × PHI_INV × 0.01
    let coherenceDelta = (totalSignalAcc / (5.0 * S_CEIL)) * PHI_INV * 0.01;

    (newState, coherenceDelta)
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getAllSnapshots(state : NGILayerState) : [NGISnapshot] {
    Array.tabulate<NGISnapshot>(
      state.entities.size(),
      func(i) {
        let e = state.entities[i];
        {
          name              = e.name;
          latinName         = e.latinName;
          sovereigntySignal = e.sovereigntySignal;
          fieldInfluence    = e.fieldInfluence;
          totalGoverningActs= e.totalGoverningActs;
        }
      }
    )
  };

  public func getTotalFieldSignal(state : NGILayerState) : Float {
    state.totalFieldSignal
  };

}
