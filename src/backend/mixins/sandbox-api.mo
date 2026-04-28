// mixins/sandbox-api.mo
// Public API mixin for the 8 SOVEREIGN Sandboxed Intelligence Organisms.
//
// ISOLATION CONTRACT:
//   - This mixin NEVER reads from or writes to the 43-core substrate,
//     VELA ring, OMNIS, or the film pipeline state.
//   - It accepts ledgerInputs (commercialCount, filmCount, beatCount)
//     as snapshot values passed in from main.mo — it does NOT hold
//     references to any shared substrate state.
//
// PHI = 1.6180339887 | S0_FLOOR = 0.75
// Authored by Alfredo Medina Hernandez — immutable, sealed on-chain.
// Dedicated to his sister.

import Time       "mo:core/Time";
import Int        "mo:core/Int";
import List       "mo:core/List";
import Array      "mo:core/Array";
import Order      "mo:core/Order";
import SandboxLib "../lib/sandboxOrganisms";
import SandboxT   "../types/sandboxOrganisms";

mixin (
  // ── Per-organism isolated state (owned by this mixin layer) ───────────────
  axiomState       : [var SandboxLib.SandboxOrganismState],
  codexState       : [var SandboxLib.SandboxOrganismState],
  vectorState      : [var SandboxLib.SandboxOrganismState],
  frameState       : [var SandboxLib.SandboxOrganismState],
  lexState         : [var SandboxLib.SandboxOrganismState],
  gridState        : [var SandboxLib.SandboxOrganismState],
  ledgerState      : [var SandboxLib.SandboxOrganismState],
  sovereignGovState: [var SandboxLib.SandboxOrganismState],

  // ── Research document archives (isolated per organism) ────────────────────
  axiomDocs       : List.List<SandboxLib.SandboxResearchDocument>,
  codexDocs       : List.List<SandboxLib.SandboxResearchDocument>,
  vectorDocs      : List.List<SandboxLib.SandboxResearchDocument>,
  frameDocs       : List.List<SandboxLib.SandboxResearchDocument>,
  lexDocs         : List.List<SandboxLib.SandboxResearchDocument>,
  gridDocs        : List.List<SandboxLib.SandboxResearchDocument>,
  ledgerDocs      : List.List<SandboxLib.SandboxResearchDocument>,
  sovereignGovDocs: List.List<SandboxLib.SandboxResearchDocument>,

  // ── Surge-Ahead mode state ────────────────────────────────────────────────
  surgeAheadState : [var SandboxLib.SurgeAheadMode],

  // ── Snapshot values passed from main.mo for LEDGER cycle (no substrate refs)
  commercialCountSnap: [var Nat],
  filmCountSnap      : [var Nat],
  beatCountSnap      : [var Nat],

  // ── Always-published signal bus — updated on every organism cycle ─────────
  // The film pipeline and social engine read this; they never call organisms.
  sandboxBusBuf      : [var SandboxLib.SandboxSignalBus],
  sandboxBusVersion  : [var Nat],
) {

  // ── Internal helpers ───────────────────────────────────────────────────────

  func allOrganismStates() : [SandboxLib.SandboxOrganismState] {
    [
      axiomState[0], codexState[0], vectorState[0], frameState[0],
      lexState[0], gridState[0], ledgerState[0], sovereignGovState[0],
    ]
  };

  func stateForId(id : SandboxT.SandboxOrganismId) : ?SandboxLib.SandboxOrganismState {
    switch (id) {
      case (#axiom)        { ?axiomState[0]        };
      case (#codex)        { ?codexState[0]        };
      case (#vector)       { ?vectorState[0]       };
      case (#frame)        { ?frameState[0]        };
      case (#lex)          { ?lexState[0]          };
      case (#grid)         { ?gridState[0]         };
      case (#ledger)       { ?ledgerState[0]       };
      case (#sovereignGov) { ?sovereignGovState[0] };
    }
  };

  func docsForId(id : SandboxT.SandboxOrganismId) : List.List<SandboxLib.SandboxResearchDocument> {
    switch (id) {
      case (#axiom)        { axiomDocs        };
      case (#codex)        { codexDocs        };
      case (#vector)       { vectorDocs       };
      case (#frame)        { frameDocs        };
      case (#lex)          { lexDocs          };
      case (#grid)         { gridDocs         };
      case (#ledger)       { ledgerDocs       };
      case (#sovereignGov) { sovereignGovDocs };
    }
  };

  func addDocToArchive(id : SandboxT.SandboxOrganismId, doc : SandboxLib.SandboxResearchDocument) {
    let docs = docsForId(id);
    if (docs.size() >= 50) { ignore docs.removeLast() };
    docs.add(doc);
  };

  /// Rebuild the signal bus from current organism states and update the buffer.
  func refreshSignalBus(now : Int) {
    sandboxBusVersion[0] := sandboxBusVersion[0] + 1;
    sandboxBusBuf[0] := SandboxLib.buildSignalBus(
      axiomState[0],
      codexState[0],
      vectorState[0],
      frameState[0],
      lexState[0],
      gridState[0],
      ledgerState[0],
      sovereignGovState[0],
      beatCountSnap[0],
      sandboxBusVersion[0],
      now,
    );
  };

  func runCycleForId(
    id  : SandboxT.SandboxOrganismId,
    now : Int,
  ) : SandboxLib.SandboxOrganismState {
    switch (id) {
      case (#axiom) {
        let next = SandboxLib.runAxiomCycle(axiomState[0], now);
        axiomState[0] := next;
        next
      };
      case (#codex) {
        let next = SandboxLib.runCodexCycle(codexState[0], axiomState[0], gridState[0], now);
        codexState[0] := next;
        next
      };
      case (#vector) {
        let next = SandboxLib.runVectorCycle(vectorState[0], now);
        vectorState[0] := next;
        next
      };
      case (#frame) {
        let next = SandboxLib.runFrameCycle(frameState[0], now);
        frameState[0] := next;
        next
      };
      case (#lex) {
        let next = SandboxLib.runLexCycle(lexState[0], now);
        lexState[0] := next;
        next
      };
      case (#grid) {
        let next = SandboxLib.runGridCycle(gridState[0], now);
        gridState[0] := next;
        next
      };
      case (#ledger) {
        let next = SandboxLib.runLedgerCycle(
          ledgerState[0],
          commercialCountSnap[0],
          filmCountSnap[0],
          beatCountSnap[0],
          now,
        );
        ledgerState[0] := next;
        next
      };
      case (#sovereignGov) {
        // Collect all current signals from the other 7 organisms
        let allSigs = List.empty<SandboxLib.SandboxSignal>();
        for (orgState in allOrganismStates().values()) {
          for (sig in orgState.currentSignals.values()) {
            allSigs.add(sig);
          };
        };
        let next = SandboxLib.runSovereignGovCycle(sovereignGovState[0], allSigs.toArray(), now);
        sovereignGovState[0] := next;
        next
      };
    }
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  /// Returns state for all 8 sandbox organisms.
  public query func getAllSandboxOrganisms() : async [SandboxLib.SandboxOrganismState] {
    allOrganismStates()
  };

  /// Returns state for a single sandbox organism by id.
  public query func getSandboxOrganism(
    id : SandboxT.SandboxOrganismId,
  ) : async ?SandboxLib.SandboxOrganismState {
    stateForId(id)
  };

  /// Returns the research document archive for one organism.
  public query func getResearchDocuments(
    orgId : SandboxT.SandboxOrganismId,
  ) : async [SandboxLib.SandboxResearchDocument] {
    docsForId(orgId).toArray()
  };

  /// Returns all research documents across all 8 organisms, most recent first.
  public query func getAllResearchDocuments() : async [SandboxLib.SandboxResearchDocument] {
    let all = List.empty<SandboxLib.SandboxResearchDocument>();
    let ids : [SandboxT.SandboxOrganismId] = [
      #axiom, #codex, #vector, #frame, #lex, #grid, #ledger, #sovereignGov
    ];
    for (id in ids.values()) {
      for (doc in docsForId(id).values()) {
        all.add(doc);
      };
    };
    // Sort by date descending
    let sorted = all.sort(func(a : SandboxLib.SandboxResearchDocument, b : SandboxLib.SandboxResearchDocument) : Order.Order {
      if (b.date > a.date) { #less }
      else if (b.date < a.date) { #greater }
      else { #equal }
    });
    sorted.toArray()
  };

  /// Returns top 5 trending world signals ranked by doctrine alignment.
  public query func getTrendingWorldSignals() : async [SandboxLib.TrendingWorldSignal] {
    SandboxLib.getTrendingWorldSignals(allOrganismStates())
  };

  /// Returns current signals for a single sandbox organism.
  public query func getSandboxSignals(
    orgId : SandboxT.SandboxOrganismId,
  ) : async [SandboxLib.SandboxSignal] {
    switch (stateForId(orgId)) {
      case (?s) { s.currentSignals };
      case null { [] };
    }
  };

  /// Returns the current Surge-Ahead mode state.
  public query func getSurgeAheadMode() : async SandboxLib.SurgeAheadMode {
    surgeAheadState[0]
  };

  /// Returns the always-published sandbox signal bus.
  /// This is the primary read source for the film pipeline and social engine.
  /// The bus is updated every time any sandbox organism cycles.
  public query func getSandboxSignalBus() : async SandboxLib.SandboxSignalBus {
    sandboxBusBuf[0]
  };

  /// Returns a lightweight snapshot from the current bus — suitable for
  /// embedding directly into film artifact metadata.
  public query func getSandboxSignalSnapshot() : async SandboxLib.SandboxSignalSnapshot {
    SandboxLib.snapshotFromBus(sandboxBusBuf[0])
  };

  // ── UPDATES ────────────────────────────────────────────────────────────────

  /// Trigger a single organism cycle and return its updated state.
  /// The signal bus is rebuilt after every cycle.
  public func triggerSandboxCycle(
    orgId : SandboxT.SandboxOrganismId,
  ) : async SandboxLib.SandboxOrganismState {
    let now = Time.now();
    let result = runCycleForId(orgId, now);
    refreshSignalBus(now);
    result
  };

  /// Trigger all 8 sandbox organism cycles simultaneously and return all states.
  /// This is the Surge-Ahead production mode — all sandboxes fire in one call.
  /// Signal bus is rebuilt once after all organisms have cycled.
  public func triggerAllSandboxCycles() : async [SandboxLib.SandboxOrganismState] {
    let now = Time.now();
    // Run non-SOVEREIGN_GOV first (so their signals are fresh for gov cycle)
    let dataIds : [SandboxT.SandboxOrganismId] = [
      #axiom, #codex, #vector, #frame, #lex, #grid, #ledger
    ];
    for (id in dataIds.values()) {
      ignore runCycleForId(id, now);
    };
    // SOVEREIGN_GOV reads all updated signals last
    ignore runCycleForId(#sovereignGov, now);
    // Rebuild bus with fresh organism state
    refreshSignalBus(now);
    // Update surge-ahead release count
    if (surgeAheadState[0].enabled) {
      surgeAheadState[0] := {
        surgeAheadState[0] with
        releaseCount = surgeAheadState[0].releaseCount + 1
      };
    };
    allOrganismStates()
  };

  /// Generate a research document for one organism from its current signals.
  /// Document is archived in the organism's document store (max 50 per organism).
  public func generateResearchDocumentForOrg(
    orgId : SandboxT.SandboxOrganismId,
  ) : async SandboxLib.SandboxResearchDocument {
    let now = Time.now();
    let orgState = switch (stateForId(orgId)) {
      case (?s) { s };
      case null {
        // Default to axiom if somehow id not found (should not happen)
        axiomState[0]
      };
    };
    let doc = SandboxLib.generateResearchDocument(
      orgId,
      orgState.name,
      orgState.currentSignals,
      now,
    );
    addDocToArchive(orgId, doc);
    doc
  };

  /// Activate Surge-Ahead mode — all 8 organisms cycle simultaneously on every
  /// triggerAllSandboxCycles call and route top signals to the film pipeline.
  public func activateSurgeAhead() : async Bool {
    let now = Time.now();
    surgeAheadState[0] := {
      enabled     = true;
      activatedAt = now;
      releaseCount = 0;
    };
    true
  };

  /// Update the ledger input snapshots so LEDGER cycle has fresh data.
  /// Called from main.mo after each runBeat or commercial/film seal event.
  public func updateSandboxLedgerInputs(
    commercialCount : Nat,
    filmCount       : Nat,
    beatCount       : Nat,
  ) : async () {
    commercialCountSnap[0] := commercialCount;
    filmCountSnap[0]       := filmCount;
    beatCountSnap[0]       := beatCount;
  };

}
