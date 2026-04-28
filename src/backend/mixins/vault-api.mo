// mixins/vault-api.mo
// VAULT Public API Mixin — Admin Command Center
// Laws, models, research papers, artifacts as living document organisms.
// TRANSLATION ENGINE spine. NT Cross-Modulation Matrix. Review workflow.
// Civilization Gap Scores. App Registry.
// Attribution: Alfredo Medina Hernandez — sealed on-chain

import VaultTypes "../types/vault";
import VaultLib   "../lib/vaultEngine";
import Time       "mo:core/Time";
import Int        "mo:core/Int";

mixin (
  vaultStateRef : [var VaultLib.VaultState],
  beatRef       : [var Nat],
) {

  // ── ALL VAULT DOCUMENTS ───────────────────────────────────────────────────

  /// Returns all vault documents — laws, macro models, Medina models, papers, artifacts.
  public query func getAllVaultDocuments() : async [VaultTypes.VaultDocument] {
    VaultLib.getAllDocuments(vaultStateRef[0])
  };

  /// Returns all vault documents of a specific kind.
  public query func getVaultDocumentsByKind(
    kind : VaultTypes.VaultDocumentKind,
  ) : async [VaultTypes.VaultDocument] {
    VaultLib.getDocumentsByKind(vaultStateRef[0], kind)
  };

  /// Returns a single vault document by ID.
  public query func getVaultDocument(id : Text) : async ?VaultTypes.VaultDocument {
    VaultLib.getDocument(vaultStateRef[0], id)
  };

  // ── RE-INGESTION & EXECUTION ───────────────────────────────────────────────

  /// Re-ingest a document — increments resonanceRings, updates resonanceScore (PHI-scaled).
  /// Law 09 (Re-Ingestion): every output is food. Every document is alive.
  public func reingestVaultDocument(id : Text) : async VaultTypes.VaultDocument {
    let beat = beatRef[0];
    switch (VaultLib.reingestDocument(vaultStateRef[0], id, beat)) {
      case (?doc) doc;
      case null {
        // Document not found — return a minimal error document
        {
          id                    = id;
          kind                  = #Settings;
          title                 = "NOT_FOUND";
          microName             = { shortCode = "ERR"; symbol = "⊘"; compressedDescription = "Document not found in vault"; rank = "Artifact" };
          lawId                 = null;
          modelId               = null;
          content               = "Document " # id # " not found in vault.";
          resonanceScore        = 0.0;
          resonanceRings        = 0;
          reingestionCount      = 0;
          executableTargets     = [];
          readinessThreshold    = 1.0;
          lastExecutedBeat      = null;
          genesisAlignmentScore = 0.0;
          doctrineScore         = 0.0;
          createdBeat           = 0;
          attributedTo          = "Alfredo Medina Hernandez";
          isExecutable          = false;
          ancientSymbol         = "⊘";
        }
      };
    }
  };

  /// Execute a vault document — runs TRANSLATION ENGINE (the spine).
  /// Documents → DOCTOR → TRANSLATION ENGINE → Neural Emergence Core.
  /// Returns a TranslationInstruction with engine target, payload, and execution result.
  public func executeVaultDocument(id : Text) : async VaultTypes.TranslationInstruction {
    let beat = beatRef[0];
    let state = vaultStateRef[0];
    switch (VaultLib.getDocument(state, id)) {
      case (?doc) {
        let instruction = VaultLib.translateDocumentToEngineCall(doc, "SOVEREIGN_ACTIVE", beat);
        VaultLib.addTranslationInstruction(state, instruction);
        instruction
      };
      case null {
        {
          sourceDocumentId = id;
          engineTarget     = "NONE";
          instructionType  = "gate";
          payload          = "document_not_found=" # id;
          beat             = beat;
          doctrineScore    = 0.0;
          executed         = false;
          result           = ?("ERROR: Document " # id # " not found");
        }
      };
    }
  };

  // ── APPLICATION REGISTRY ───────────────────────────────────────────────────

  /// Apply a law to an application — records the law injection in AppRecord.
  /// Creates a new AppRecord if the app hasn't been registered yet.
  public func applyLawToApplication(
    lawId : Nat,
    appId : Text,
  ) : async VaultTypes.AppRecord {
    let beat = beatRef[0];
    VaultLib.applyLawToApp(vaultStateRef[0], lawId, appId, beat)
  };

  /// Returns all registered application records.
  public query func getAllAppRecords() : async [VaultTypes.AppRecord] {
    VaultLib.getAllAppRecords(vaultStateRef[0])
  };

  // ── REVIEW WORKFLOW ────────────────────────────────────────────────────────

  /// Returns all artifact review records.
  public query func getArtifactReviews() : async [VaultTypes.ArtifactReview] {
    VaultLib.getAllReviews(vaultStateRef[0])
  };

  /// Create a new review for an artifact (sets status to #Draft).
  public func createVaultArtifactReview(artifactId : Text) : async VaultTypes.ArtifactReview {
    let beat = beatRef[0];
    VaultLib.createArtifactReview(vaultStateRef[0], artifactId, beat)
  };

  /// Update review status — approve, reject, or request revision with comment.
  public func updateArtifactReviewStatus(
    artifactId : Text,
    status     : VaultTypes.ReviewStatus,
    comment    : Text,
  ) : async VaultTypes.ArtifactReview {
    let beat = beatRef[0];
    let nowNs = Int.abs(Time.now());
    switch (status) {
      case (#Approved) {
        VaultLib.approveArtifact(vaultStateRef[0], artifactId, "Alfredo Medina Hernandez", beat)
      };
      case (#RevisionRequested) {
        VaultLib.requestRevision(vaultStateRef[0], artifactId, comment, "Alfredo Medina Hernandez", beat, nowNs)
      };
      case (#Rejected) {
        VaultLib.requestRevision(vaultStateRef[0], artifactId, "REJECTED: " # comment, "Alfredo Medina Hernandez", beat, nowNs)
      };
      case _ {
        // For Draft and PendingReview — just create/find review
        VaultLib.createArtifactReview(vaultStateRef[0], artifactId, beat)
      };
    }
  };

  // ── CIVILIZATION GAP SCORES ────────────────────────────────────────────────

  /// Returns the 8 live civilization gap scores — PHI-weighted composite.
  /// The 8 things SOVEREIGN has that no competitor in the world has simultaneously.
  public query func getCivilizationGapScores() : async VaultTypes.CivilizationGapScore {
    switch (vaultStateRef[0].lastGapScore) {
      case (?score) score;
      case null {
        // Compute on demand if not yet cached
        VaultLib.computeCivilizationGapScores(
          vaultStateRef[0],
          beatRef[0],
          50.0,  // default globalCoherence
          0,     // artifactCount
          0.75,  // doctrineScore
        )
      };
    }
  };

  // ── NT CROSS-MODULATION MATRIX ─────────────────────────────────────────────

  /// Returns the full 8×8 NT cross-modulation matrix (64 entries).
  /// Real biological coupling coefficients — not approximations.
  public query func getNTCrossModulationMatrix() : async [VaultTypes.NTCrossModulation] {
    vaultStateRef[0].ntMatrix
  };

  // ── TRANSLATION LOG ────────────────────────────────────────────────────────

  /// Returns the translation instruction log — all document → engine calls fired.
  public query func getTranslationLog() : async [VaultTypes.TranslationInstruction] {
    VaultLib.getTranslationLog(vaultStateRef[0])
  };

  // ── DOCTRINE STATE INJECTION PATHWAY ──────────────────────────────────────
  // Laws become live in DOCTRINE_STATE within one heartbeat of injection.
  // LAW_ENGINE reads doctrineStateMap on every heartbeat and enforces all active laws.

  /// Inject a law into DOCTRINE_STATE — makes it live and enforced on next heartbeat.
  /// Extracts law parameters, thresholds, and writes to doctrineStateMap immediately.
  public func injectLawToDoctrineState(lawId : Text) : async { #ok : VaultTypes.DoctrineStateEntry; #err : Text } {
    VaultLib.injectLawToDoctrineState(vaultStateRef[0], lawId)
  };

  /// Inject a law by numeric ID with caller-supplied parameters.
  /// parameters: optional override parameters merged into the law engine entry.
  /// injectedBy: audit trail — who/what triggered the injection.
  /// Returns {#ok: Bool; #err: Text} — matches frontend bindgen expectation.
  public func injectLawToDoctrineStateById(
    lawId      : Nat,
    parameters : [(Text, Float)],
    injectedBy : Text,
  ) : async { #ok : Bool; #err : Text } {
    let docId = "LAW_" # lawId.toText();
    switch (VaultLib.injectLawToDoctrineState(vaultStateRef[0], docId)) {
      case (#err(e)) { #err(e) };
      case (#ok(entry)) {
        // If caller supplied override parameters, merge them into the stored entry
        if (parameters.size() > 0) {
          let merged = entry.parameters.concat(parameters);
          let updatedEntry : VaultTypes.DoctrineStateEntry = { entry with parameters = merged };
          vaultStateRef[0].doctrineStateMap.add(docId, updatedEntry);
        };
        #ok(true)
      };
    }
  };

  /// Returns all currently active injected laws from DOCTRINE_STATE.
  /// Called by the admin vault to show which laws are live in the organism.
  public query func getActiveDoctrineState() : async [(Text, VaultTypes.DoctrineStateEntry)] {
    VaultLib.getActiveDoctrineState(vaultStateRef[0])
  };

  /// Returns active doctrine state as flat array of entries — frontend bindgen shape.
  public query func getActiveDoctrineStateFlat() : async [VaultTypes.DoctrineStateEntry] {
    let pairs = VaultLib.getActiveDoctrineState(vaultStateRef[0]);
    pairs.map<(Text, VaultTypes.DoctrineStateEntry), VaultTypes.DoctrineStateEntry>(
      func(pair : (Text, VaultTypes.DoctrineStateEntry)) : VaultTypes.DoctrineStateEntry {
        pair.1
      }
    )
  };

  /// Deactivate a law in DOCTRINE_STATE — removes from heartbeat enforcement.
  public func deactivateLawInDoctrineState(lawId : Text) : async Bool {
    VaultLib.deactivateLawInDoctrineState(vaultStateRef[0], lawId)
  };

}
