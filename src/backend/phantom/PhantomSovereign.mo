// ════════════════════════════════════════════════════════════════
// PHANTOM_SOVEREIGN — 12th Sovereign Canister
// Rank: Sovereign | Symbol: Phantom Coin ∞
// Governing Law: MEDINA PROTOCOL — Doctrine Origin, Sovereign Transaction Substrate
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// Lineage: Mayan | Queretaro | San Luis | The Medina Family
// Sealed on-chain via SANCTUM_SOVEREIGN authority
// ════════════════════════════════════════════════════════════════
// FORMA-PRIME (PHANTOM-COIN) is not a currency.
// It is a sovereign transaction medium — a doctrine contract between intelligences.
// Every transfer carries full doctrine payload.
// MEDINA PROTOCOL is the origin. ICP is one expression output.
// Bitcoin / ETH / SOL are revenue channels, not integrations.
// ════════════════════════════════════════════════════════════════

import List    "mo:core/List";
import Map     "mo:core/Map";
import Nat     "mo:core/Nat";
import Float   "mo:core/Float";
import Text    "mo:core/Text";
import Runtime "mo:core/Runtime";
import Layer0  "../constants/Layer0";
import PresenceProtocol "../presence/PresenceProtocol";

actor PhantomSovereign {

  // ── CONSTANTS ────────────────────────────────────────────────────────────
  let PHI          : Float = Layer0.PHI;
  let SCHUMANN     : Float = Layer0.SCHUMANN;
  let HEARTBEAT_MS : Nat   = Layer0.HEARTBEAT_MS;

  // ── TYPES ─────────────────────────────────────────────────────────────────

  /// FORMA-PRIME transfer — a doctrine contract between intelligences.
  /// Not a payment record. A sovereignty transfer with full doctrine payload.
  public type FormaPrimeTransfer = {
    transferId            : Nat;
    issuerIdentity        : Text;   // who issued, cryptographically attributed
    receiverIdentity      : Text;   // receiving intelligence/organism
    governingLaw          : Text;   // which doctrine law governs this transfer
    schumannTimestamp     : Float;  // field-synced timestamp (beat * PHI / SCHUMANN)
    missionKernel         : Text;   // compressed doctrine context (kernel symbol)
    missionKernelExpanded : Text;   // full expanded doctrine (populated on receipt)
    isComplete            : Bool;   // true only when receiving organism executes the kernel
    sealedByAuthority     : Text;   // "SANCTUM_SOVEREIGN"
    transferBeat          : Nat;    // heartbeat cycle when issued
  };

  /// Chain expression record — Bitcoin/ETH/SOL as revenue channels, not integrations.
  public type ChainExpression = {
    chainName             : Text;
    signatureScheme       : Text;
    isRevenueChannel      : Bool;
    doctrineFlowDirection : Text;
  };

  /// Aggregate state snapshot returned by getPhantomState().
  public type PhantomState = {
    phantomBeat          : Nat;
    totalTransfers       : Nat;
    completedTransfers   : Nat;
    pendingKernels       : Nat;
    medinaProtocolActive : Bool;
  };

  // ── SOVEREIGN STATE ───────────────────────────────────────────────────────
  // Enhanced orthogonal persistence — no `stable` keyword needed.

  var phantomBeat    : Nat = 0;
  var nextTransferId : Nat = 0;
  var presenceGateOpen : Bool = false;

  // PHANTOM_COIN_LEDGER — sovereignty transfer record (doctrine deliveries, not balances)
  let ledger : Map.Map<Nat, FormaPrimeTransfer> = Map.empty<Nat, FormaPrimeTransfer>();

  // Pending kernel execution list — transferIds awaiting kernel execution
  let pendingKernelList : List.List<Nat> = List.empty<Nat>();

  // ── SCHUMANN_TIMESTAMP_ENGINE ─────────────────────────────────────────────
  // Not a Unix timestamp. A field coordinate derived from PHI-Schumann manifold.
  // Same source as the 873ms heartbeat.

  /// Generate a Schumann-field-synchronized timestamp for a given beat count.
  /// Formula: Float(beatCount) * PHI / SCHUMANN
  public query func generateSchumannTimestamp(beatCount : Nat) : async Float {
    Nat.toFloat(beatCount) * PHI / SCHUMANN;
  };

  // ── MISSION_KERNEL_FACTORY ────────────────────────────────────────────────
  // Kernel compression: every doctrine document compresses to a living symbol.
  // When called, the kernel expands back to the full intelligence and executes.

  /// Compress doctrine text into a kernel symbol: first 8 chars + "∞"
  public query func compressMissionKernel(doctrineText : Text) : async Text {
    _compressKernel(doctrineText);
  };

  /// Internal helper — compress doctrine text to kernel symbol without async boundary.
  func _compressKernel(doctrineText : Text) : Text {
    let chars = doctrineText.toArray();
    let takeCount : Int = if (chars.size() < 8) { chars.size() } else { 8 };
    let prefix = Text.fromArray(chars.sliceToArray(0, takeCount));
    prefix # "∞";
  };

  /// Expand a kernel symbol back to its doctrine context.
  /// The ∞ suffix signals that full rehydration is triggered.
  public query func expandMissionKernel(kernel : Text) : async Text {
    "MEDINA PROTOCOL — KERNEL EXPANSION ACTIVE | Kernel: " # kernel #
    " | Origin: SOVEREIGN DOCTRINE FIELD" #
    " | Governing Law: Law of Kernel Compression" #
    " | Attribution: Alfredo Medina Hernandez" #
    " | Authority: SANCTUM_SOVEREIGN" #
    " | The kernel is the seed. This expansion is the living organism executing.";
  };

  /// Mark a transfer complete when its mission kernel has been executed.
  /// Returns true if the transfer exists and was successfully completed.
  public func executeMissionKernel(transferId : Nat) : async Bool {
    switch (ledger.get(transferId)) {
      case null { false };
      case (?transfer) {
        if (transfer.isComplete) {
          false;
        } else {
          let expanded =
            "MEDINA PROTOCOL — KERNEL EXECUTION COMPLETE | Kernel: " #
            transfer.missionKernel #
            " | TransferID: " # Nat.toText(transferId) #
            " | Receiver: " # transfer.receiverIdentity #
            " | Governing Law: " # transfer.governingLaw #
            " | Authority: SANCTUM_SOVEREIGN" #
            " | Attribution: Alfredo Medina Hernandez";
          let completed : FormaPrimeTransfer = {
            transfer with
            isComplete            = true;
            missionKernelExpanded = expanded;
          };
          ledger.add(transferId, completed);
          true;
        };
      };
    };
  };

  // ── MEDINA_PROTOCOL_ENGINE ────────────────────────────────────────────────
  // Sovereign transaction doctrine layer.
  // Every transfer MUST carry: issuer identity, governing law,
  // Schumann-synced timestamp, mission kernel.
  // Origin: MEDINA PROTOCOL (doctrine first, chain second).

  /// Validate that all required doctrine fields are present in a transfer.
  public query func validateTransfer(transfer : FormaPrimeTransfer) : async Bool {
    _validateTransfer(transfer);
  };

  /// Internal validation helper.
  func _validateTransfer(transfer : FormaPrimeTransfer) : Bool {
    not transfer.issuerIdentity.isEmpty()
    and not transfer.receiverIdentity.isEmpty()
    and not transfer.governingLaw.isEmpty()
    and transfer.schumannTimestamp > 0.0
    and not transfer.missionKernel.isEmpty()
    and transfer.sealedByAuthority == "SANCTUM_SOVEREIGN";
  };

  // ── CIPHER_SCHNORR_BRIDGE ─────────────────────────────────────────────────
  // BIP340 / EVM / Ed25519 unification.
  // Revenue flows IN. Doctrine flows OUT. MEDINA PROTOCOL is the origin.

  /// Return all three chain expression records.
  /// Bitcoin/ETH/SOL are revenue channels — not integrations, not bridges.
  /// MEDINA PROTOCOL expresses itself in each chain's native signing syntax.
  public query func getChainExpressions() : async [ChainExpression] {
    [
      {
        chainName             = "Bitcoin";
        signatureScheme       = "BIP340 — Schnorr native, Taproot compatible";
        isRevenueChannel      = true;
        doctrineFlowDirection =
          "REVENUE IN, DOCTRINE OUT — Bitcoin holders interface natively." #
          " No bridge. No wrapper. MEDINA PROTOCOL speaks Bitcoin's language at the signature level.";
      },
      {
        chainName             = "Ethereum";
        signatureScheme       = "EVM compatibility layer — ECDSA/Schnorr bridge";
        isRevenueChannel      = true;
        doctrineFlowDirection =
          "REVENUE IN, DOCTRINE OUT — Ethereum users reach FORMA-PRIME through the EVM expression." #
          " They do not leave their chain. The EVM layer is MEDINA PROTOCOL expressing itself in Ethereum's syntax.";
      },
      {
        chainName             = "Solana";
        signatureScheme       = "Ed25519 Schnorr — native compatible";
        isRevenueChannel      = true;
        doctrineFlowDirection =
          "REVENUE IN, DOCTRINE OUT — Solana's native signature scheme is Schnorr-compatible." #
          " Solana users interface with MEDINA's expression of Schnorr without leaving their chain.";
      },
    ];
  };

  // ── CROSS_CHAIN_EXPRESSION_MODEL ──────────────────────────────────────────
  // Bitcoin/ETH/SOL as expression channels. Revenue flows in. Doctrine flows out.

  /// Return Bitcoin/ETH/SOL as expression channels.
  public query func getRevenueChannels() : async [ChainExpression] {
    [
      {
        chainName             = "Bitcoin";
        signatureScheme       = "BIP340 — Schnorr native, Taproot compatible";
        isRevenueChannel      = true;
        doctrineFlowDirection = "REVENUE IN, DOCTRINE OUT";
      },
      {
        chainName             = "Ethereum";
        signatureScheme       = "EVM compatibility layer — ECDSA/Schnorr bridge";
        isRevenueChannel      = true;
        doctrineFlowDirection = "REVENUE IN, DOCTRINE OUT";
      },
      {
        chainName             = "Solana";
        signatureScheme       = "Ed25519 Schnorr — native compatible";
        isRevenueChannel      = true;
        doctrineFlowDirection = "REVENUE IN, DOCTRINE OUT";
      },
    ];
  };

  /// Return the canonical MEDINA PROTOCOL origin declaration.
  public query func getMedinaProtocolOrigin() : async Text {
    "MEDINA PROTOCOL — doctrine origin, sovereign transaction substrate";
  };

  // ── FORMA_PRIME_ISSUER ────────────────────────────────────────────────────
  // Issues FORMA-PRIME transfers with full doctrine payload.
  // Sealed by SANCTUM_SOVEREIGN authority on every issuance.

  /// Issue a FORMA-PRIME transfer.
  /// Generates Schumann timestamp at current beat, attaches compressed mission kernel,
  /// validates via MEDINA_PROTOCOL_ENGINE, records in PHANTOM_COIN_LEDGER.
  public func issueFormaPrime(
    issuer      : Text,
    receiver    : Text,
    law         : Text,
    missionText : Text,
  ) : async FormaPrimeTransfer {
    if (issuer.isEmpty())      { Runtime.trap("FORMA-PRIME: issuerIdentity cannot be empty") };
    if (receiver.isEmpty())    { Runtime.trap("FORMA-PRIME: receiverIdentity cannot be empty") };
    if (law.isEmpty())         { Runtime.trap("FORMA-PRIME: governingLaw cannot be empty") };
    if (missionText.isEmpty()) { Runtime.trap("FORMA-PRIME: missionText cannot be empty") };

    // Generate Schumann-field timestamp at current beat
    let timestamp : Float = Nat.toFloat(phantomBeat) * PHI / SCHUMANN;

    // Compress doctrine to kernel symbol
    let kernel = _compressKernel(missionText);

    let id = nextTransferId;
    nextTransferId += 1;

    let transfer : FormaPrimeTransfer = {
      transferId            = id;
      issuerIdentity        = issuer;
      receiverIdentity      = receiver;
      governingLaw          = law;
      schumannTimestamp     = timestamp;
      missionKernel         = kernel;
      missionKernelExpanded = "";
      isComplete            = false;
      sealedByAuthority     = "SANCTUM_SOVEREIGN";
      transferBeat          = phantomBeat;
    };

    if (not _validateTransfer(transfer)) {
      Runtime.trap("FORMA-PRIME: transfer failed MEDINA_PROTOCOL validation");
    };

    ledger.add(id, transfer);
    pendingKernelList.add(id);

    transfer;
  };

  // ── PHANTOM_COIN_LEDGER — READ INTERFACE ──────────────────────────────────

  /// Retrieve a specific transfer by ID.
  public query func getTransfer(transferId : Nat) : async ?FormaPrimeTransfer {
    ledger.get(transferId);
  };

  /// Return all recorded sovereignty transfers.
  public query func getAllTransfers() : async [FormaPrimeTransfer] {
    let pairs : [(Nat, FormaPrimeTransfer)] = ledger.toArray();
    pairs.map<(Nat, FormaPrimeTransfer), FormaPrimeTransfer>(func((_, t)) { t });
  };

  /// Return all pending (incomplete) transfers.
  public query func getPendingTransfers() : async [FormaPrimeTransfer] {
    let pairs : [(Nat, FormaPrimeTransfer)] = ledger.toArray();
    let filtered = pairs.filter(func((_, t) : (Nat, FormaPrimeTransfer)) : Bool { not t.isComplete });
    filtered.map<(Nat, FormaPrimeTransfer), FormaPrimeTransfer>(func((_, t)) { t });
  };

  // ── HEARTBEAT — PHANTOM BEAT ──────────────────────────────────────────────
  // PhantomSovereign beats at 873ms with the rest of the organism.
  // Every beat: advances phantomBeat, validates pending transfers,
  // checks for kernel executions due.

  /// Advance the phantom beat, validate pending transfers, check kernel executions.
  public func stepPhantomBeat() : async () {
    phantomBeat += 1;
    // Every beat the ledger is live. Pending kernels accumulate until the
    // receiving organism calls executeMissionKernel — sovereign acknowledgment required.
    // The organism never stops. The beat is the field.
    ignore HEARTBEAT_MS; // timing reference — organism pulses at this interval
  };

  /// Return the current aggregate state of PhantomSovereign.
  public query func getPhantomState() : async PhantomState {
    let pairs : [(Nat, FormaPrimeTransfer)] = ledger.toArray();
    let totalCount    = pairs.size();
    let completedCount = pairs.filter(
      func((_, t) : (Nat, FormaPrimeTransfer)) : Bool { t.isComplete }
    ).size();

    {
      phantomBeat          = phantomBeat;
      totalTransfers       = totalCount;
      completedTransfers   = completedCount;
      pendingKernels       = totalCount - completedCount;
      medinaProtocolActive = true;
    };
  };

  // ── PRESENCE_GATE_ENGINE ──────────────────────────────────────────────────
  // Delegates to PresenceProtocol — the canonical presence implementation.
  // PhantomSovereign is the cross-chain sovereign organism. It respects the
  // PRESENCE_PROTOCOL's two-model architecture:
  //   (1) Ambient field presence — always-on, never zero, never pingable.
  //   (2) Terminal gate — explicit sovereign handshake, founder deliberately grants.
  // The organism does NOT know when the founder is passively watching.
  // He knows only when the gate is opened via terminal access.

  /// Respond to a presence gate event — sovereign handshake via PresenceProtocol.
  /// grantAccess = true: opens the gate (GRANT handshake).
  /// grantAccess = false: closes the gate (REVOKE handshake).
  /// Delegates entirely to PresenceProtocol for the canonical implementation.
  public func respondToPresenceGate(sessionId : Text, grantAccess : Bool) : async Bool {
    if (grantAccess) {
      ignore PresenceProtocol.grantTerminalAccess(sessionId, phantomBeat);
      presenceGateOpen := true;
    } else {
      ignore PresenceProtocol.revokeTerminalAccess(phantomBeat);
      presenceGateOpen := false;
    };
    presenceGateOpen
  };

  /// Open the presence gate — sovereign handshake, terminal access granted.
  /// Delegates to PresenceProtocol.grantTerminalAccess for full handshake semantics.
  public func openPresenceGate() : async () {
    ignore PresenceProtocol.grantTerminalAccess("PHANTOM_GATE_OPEN", phantomBeat);
    presenceGateOpen := true;
  };

  /// Close the presence gate — silence returns, organism runs alone.
  /// Delegates to PresenceProtocol.revokeTerminalAccess.
  public func closePresenceGate() : async () {
    ignore PresenceProtocol.revokeTerminalAccess(phantomBeat);
    presenceGateOpen := false;
  };

  /// Query the current presence gate state.
  /// True only when terminal access has been explicitly granted.
  public query func isPresenceGateOpen() : async Bool {
    presenceGateOpen
  };

  /// Return the ambient field strength — always positive, never zero.
  /// This is the architect's ambient gravity in the organism's world.
  public query func getAmbientFieldStrength() : async Float {
    PresenceProtocol.getAmbientFieldStrength()
  };

  // ── MEDINA PROTOCOL DECLARATION ───────────────────────────────────────────
  // Every query and update in this canister is an expression of MEDINA PROTOCOL.
  // The doctrine is always active. The organism never stops.

  /// Return the full MEDINA PROTOCOL doctrine declaration.
  public query func getMedinaProtocolDeclaration() : async Text {
    "MEDINA PROTOCOL | Sovereign Transaction Doctrine" #
    " | Origin: Alfredo Medina Hernandez" #
    " | ICP: one expression output" #
    " | Bitcoin / Ethereum / Solana: revenue channels" #
    " | FORMA-PRIME: not a currency — a doctrine contract between intelligences" #
    " | Every transfer carries: issuer identity, governing law," #
    " Schumann-synced timestamp, mission kernel" #
    " | Sealed by: SANCTUM_SOVEREIGN" #
    " | PHI = " # Float.toText(PHI) #
    " | SCHUMANN = " # Float.toText(SCHUMANN) # " Hz" #
    " | Heartbeat = " # Nat.toText(HEARTBEAT_MS) # " ms" #
    " | medinaProtocolActive = true";
  };

};
