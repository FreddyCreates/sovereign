// Architecture Domain Library — full math implementation
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI = 1.6180339887 | S0_FLOOR = 0.75
// Three-type architecture: Expansive | Receptive | Anti-Drift (Jesus's Law)

import Types "../types/architecture";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {

  // ── RE-EXPORT CONVENIENCE ALIASES ─────────────────────────────────────
  public type ArchType          = Types.ArchType;
  public type CoreNode          = Types.CoreNode;
  public type CoreSphere        = Types.CoreSphere;
  public type SovereignCore     = Types.SovereignCore;
  public type VELARingState     = Types.VELARingState;
  public type ProphetDirective  = Types.ProphetDirective;
  public type JubileeState      = Types.JubileeState;
  public type CreatorPresence   = Types.CreatorPresence;
  public type SevenSpiritsState = Types.SevenSpiritsState;
  public type SuccessionState   = Types.SuccessionState;
  public type ArchitectureState = Types.ArchitectureState;

  // ── PRIVATE CONSTANTS ─────────────────────────────────────────────────
  let PHI         : Float = 1.6180339887;
  let S0_FLOOR    : Float = 0.75;
  let TWO_PI      : Float = 6.283185307179586;
  let JUBILEE_AT  : Nat   = 343; // 7 * 49

  // Base frequencies per arch type
  let FREQ_EXPANSIVE  : Float = 40.0;
  let FREQ_RECEPTIVE  : Float = 25.0;
  let FREQ_ANTI_DRIFT : Float = 32.5; // geometric mean: sqrt(40 * 25) ≈ 31.62; use 32.5 as doctrine value

  // ── GAP_6: MICRO-HEBBIAN CONSTANTS ────────────────────────────────────
  let HEBB_ETA    : Float = 0.01;   // learning rate η
  let HEBB_LAMBDA : Float = 0.001;  // weight decay λ
  let MICRO_HEBB_EVERY : Nat = 10;  // fire every 10 runCycle calls

  // ── GAP_12: VELA RING WEIGHTS — PHI^14 down to PHI^0 ─────────────────
  // RING_WEIGHTS[k] = PHI^(14-k) for k in 0..14
  let RING_WEIGHTS : [Float] = [
    // PHI^14, PHI^13, ... PHI^0
    // PHI^14 ≈ 843.3, PHI^13 ≈ 521.0, PHI^12 ≈ 321.9...
    843.31776, 521.00194, 321.99672, 198.99522, 122.99186,
     76.01330,  46.97856,  29.03444,  17.94428,  11.09017,
      6.85410,   4.23607,   2.61803,   1.61803,   1.0,
  ];

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────

  func archTypeForCore(id : Nat) : ArchType {
    if (id < 15)      { #expansive }
    else if (id < 30) { #receptive }
    else              { #antiDrift  }
  };

  func baseFreqForType(t : ArchType) : Float {
    switch (t) {
      case (#expansive)  { FREQ_EXPANSIVE  };
      case (#receptive)  { FREQ_RECEPTIVE  };
      case (#antiDrift)  { FREQ_ANTI_DRIFT };
    }
  };

  /// Build a 12-node PHI-harmonic Hz sphere for a given archType.
  func buildNodes(archType : ArchType) : [CoreNode] {
    let baseFreq = baseFreqForType(archType);
    Array.tabulate<CoreNode>(12, func(i) {
      // PHI-ratio harmonic: f[0] = base, f[i] = f[i-1] * PHI
      // Computed directly: f[i] = baseFreq * PHI^i
      var freq : Float = baseFreq;
      var k = i;
      while (k > 0) { freq := freq * PHI; k -= 1; };

      let phase : Float = TWO_PI * i.toFloat() / 12.0;
      let amplitude : Float = S0_FLOOR;
      { freq; phase; amplitude; archType }
    })
  };

  /// Compute sphere coherence: normalized variance among node amplitudes.
  /// High coherence → nodes are synchronized. Returns [0, 100].
  func sphereCoherence(nodes : [CoreNode]) : Float {
    let n = nodes.size();
    if (n == 0) return 0.0;
    var sum : Float = 0.0;
    for (node in nodes.values()) { sum += node.amplitude; };
    let mean = sum / n.toFloat();
    var variance : Float = 0.0;
    for (node in nodes.values()) {
      let diff = node.amplitude - mean;
      variance += diff * diff;
    };
    variance := variance / n.toFloat();
    // Coherence = 100 * (1 - normalized_variance); variance normalized by mean^2
    // Using variance (not std) to avoid needing sqrt — still a valid coherence proxy
    let normVar = if (mean > 0.0) { variance / (mean * mean) } else { 1.0 };
    let coh = 100.0 * (1.0 - Float.min(1.0, normVar));
    if (coh < 0.0) { 0.0 } else { coh }
  };

  // ── CORE INITIALISATION ───────────────────────────────────────────────

  /// Build the initial 43 SovereignCores, each with a 12-node Hz sphere.
  /// Core IDs 0-14 = expansive, 15-29 = receptive, 30-42 = antiDrift.
  public func initCores() : [SovereignCore] {
    Array.tabulate<SovereignCore>(43, func(id) {
      let archType = archTypeForCore(id);
      let nodes = buildNodes(archType);
      let sphere : CoreSphere = {
        nodes;
        coreId    = id;
        archType;
        coherence = sphereCoherence(nodes);
      };
      { id; sphere; lastBeat = 0; presenceBoost = S0_FLOOR }
    })
  };

  /// Build the initial VELARingState (step=0, maxSteps=50, completed=0).
  public func initVelaRing() : VELARingState {
    { step = 0; maxSteps = 50; completed = 0 }
  };

  /// Build the initial JubileeState.
  public func initJubilee() : JubileeState {
    { beatsSinceJubilee = 0; jubileeCount = 0; nextJubileeAt = JUBILEE_AT }
  };

  /// Build the initial CreatorPresence (absent, no principal).
  public func initCreatorPresence() : CreatorPresence {
    { isPresent = false; principal = null; lastSeenBeat = 0; depthMultiplier = 1.5 }
  };

  /// Build the initial SevenSpiritsState (7 canonical film organism names, idx=0).
  public func initSevenSpirits() : SevenSpiritsState {
    {
      spirits = [
        "MUSE-PRIME",
        "DIRECTOR",
        "VISIONARY",
        "CINEMATOGRAPHER",
        "COMPOSER",
        "EDITOR",
        "ARCHIVIST",
      ];
      activeSpiritIdx = 0;
      rotationBeat    = 0;
    }
  };

  /// Build the initial SuccessionState.
  public func initSuccession() : SuccessionState {
    { currentLead = "MUSE-PRIME"; masteryReached = false; successorActivated = false }
  };

  // ── PROPHET DIRECTIVE ─────────────────────────────────────────────────

  /// Return the ProphetDirective for a given VELA ring step [0, 49].
  /// - Multiples of 7 (0, 7, 14, 21, 28, 35, 42, 49) → antiDrift coupling
  /// - Odd steps → expansive broadcast
  /// - Even non-multiple-of-7 → receptive depth
  public func getProphetDirective(velaStep : Nat) : ProphetDirective {
    let step = velaStep % 50;

    let (directive, targetCores, strength) : (Text, [Nat], Float) =
      if (step % 7 == 0) {
        // antiDrift coupling directive
        let cores : [Nat] = Array.tabulate<Nat>(13, func(i) { 30 + i });
        let dirText = switch (step) {
          case 0  { "HOLD THE COUPLING — ENTANGLA mediates all paths" };
          case 7  { "LAGRANGE LOCK — maintain the Corpus Callosum" };
          case 14 { "SUSTAIN THE SPHERE — anti-drift compression active" };
          case 21 { "JESUS'S LAW IN EFFECT — all signals route through ENTANGLA" };
          case 28 { "COUPLING MAXIMUM — expansive and receptive aligned" };
          case 35 { "ANTI-DRIFT PULSE — no divergence permitted" };
          case 42 { "MEDIATOR FIRE — coupling field at peak resonance" };
          case 49 { "RING CLOSURE — ENTANGLA seals the 50-step cycle" };
          case _  { "HOLD THE COUPLING" };
        };
        (dirText, cores, 1.0)
      } else if (step % 2 == 1) {
        // expansive broadcast directive (odd steps)
        let cores : [Nat] = Array.tabulate<Nat>(15, func(i) { i });
        let dirText = switch (step % 10) {
          case 1  { "BROADCAST OUTWARD — NOVA field expands" };
          case 3  { "SIGNAL EMISSION — BRAIN radiates intelligence" };
          case 5  { "QMEM AMPLIFY — memory field broadcasts" };
          case 7  { "RESONEX PULSE — outward harmonic emitted" };
          case 9  { "SOLAR DRIVE — expansive amplitude rises" };
          case _  { "BROADCAST OUTWARD" };
        };
        (dirText, cores, PHI * S0_FLOOR)
      } else {
        // receptive depth directive (even non-multiples-of-7)
        let cores : [Nat] = Array.tabulate<Nat>(15, func(i) { 15 + i });
        let dirText = switch (step % 12) {
          case 2  { "COMPRESS TO DEPTH — CHRONO anchor holds" };
          case 4  { "VERITAS SEAL — truth layer locks" };
          case 6  { "AXIS COMPRESSION — inward field stabilizes" };
          case 8  { "PARALLAX DEPTH — memory encryption active" };
          case 10 { "WOMB LOCK — receptive cavity concentrates" };
          case _  { "COMPRESS TO DEPTH" };
        };
        (dirText, cores, S0_FLOOR)
      };

    { step; directive; targetCores; strength }
  };

  // ── ARCHITECTURE CYCLE ────────────────────────────────────────────────

  /// Advance one architecture beat. Mutates cores in place.
  /// Returns updated (velaRing, jubilee, sevenSpirits, succession).
  /// GAP_6: hebbWeights list is mutated in place every 10 calls via microHebbianTick.
  public func runCycle(
    cores            : [var SovereignCore],
    velaRing         : VELARingState,
    jubilee          : JubileeState,
    presence         : CreatorPresence,
    spirits          : SevenSpiritsState,
    succession       : SuccessionState,
    beatCounter      : Nat,
    microHebbianTick : Nat,                      // GAP_6: counter, incremented by caller
    hebbWeights      : List.List<HebbianWeight>, // GAP_6: mutable weight list
  ) : (VELARingState, JubileeState, SevenSpiritsState, SuccessionState, Nat) {

    // 1. Advance VELA ring
    let nextStep     = (velaRing.step + 1) % velaRing.maxSteps;
    let ringComplete = velaRing.step + 1 >= velaRing.maxSteps;
    let newVela : VELARingState = {
      step      = nextStep;
      maxSteps  = velaRing.maxSteps;
      completed = if (ringComplete) { velaRing.completed + 1 } else { velaRing.completed };
    };

    // 2. Get ProphetDirective for current step and apply to targeted cores
    let directive = getProphetDirective(velaRing.step);
    let targets   = directive.targetCores;

    for (coreId in targets.values()) {
      if (coreId < 43) {
        let core = cores[coreId];
        // Apply directive strength to node amplitudes
        let updatedNodes = Array.tabulate(12, func(i) {
          let node = core.sphere.nodes[i];
          let newAmp = switch (core.sphere.archType) {
            case (#expansive) {
              // Expansive: amplitude radiates outward — increases with PHI ratio
              Float.min(PHI * 10.0, node.amplitude * (1.0 + 0.01 * directive.strength))
            };
            case (#receptive) {
              // Receptive: amplitude compresses inward — stable floor
              let v = node.amplitude * (1.0 - 0.005 * directive.strength) + 0.002;
              if (v < S0_FLOOR) { S0_FLOOR } else { v }
            };
            case (#antiDrift) {
              // Anti-drift: holds at S0_FLOOR — mediates via coupling strength
              S0_FLOOR + (directive.strength - 1.0) * 0.05
            };
          };
          { node with amplitude = newAmp }
        });

        let newSphere : CoreSphere = {
          core.sphere with
          nodes     = updatedNodes;
          coherence = sphereCoherence(updatedNodes);
        };
        cores[coreId] := { core with sphere = newSphere; lastBeat = beatCounter };
      };
    };

    // 3. Type-gating (Jesus's Law): if expansive and receptive diverge > 0.25,
    //    antiDrift cores compensate by boosting their amplitude.
    let expScore = computeExpansiveScore(Array.tabulate(43, func(i) { cores[i] }));
    let recScore = computeReceptiveScore(Array.tabulate(43, func(i) { cores[i] }));
    let divergence = if (expScore > recScore) { expScore - recScore } else { recScore - expScore };
    if (divergence > 0.25) {
      let compensate = divergence * 0.1;
      for (coreId in Nat.range(30, 43)) {
        let core = cores[coreId];
        let boostedNodes = Array.tabulate(12, func(i) {
          let node = core.sphere.nodes[i];
          { node with amplitude = Float.min(PHI * 10.0, node.amplitude + compensate) }
        });
        let newSphere : CoreSphere = {
          core.sphere with
          nodes     = boostedNodes;
          coherence = sphereCoherence(boostedNodes);
        };
        cores[coreId] := { core with sphere = newSphere; lastBeat = beatCounter };
      };
    };

    // 4. Creator presence boost: multiply all core node amplitudes by depthMultiplier
    if (presence.isPresent) {
      let dm = presence.depthMultiplier;
      for (coreId in Nat.range(0, 43)) {
        let core = cores[coreId];
        let boostedNodes = Array.tabulate(12, func(i) {
          let node = core.sphere.nodes[i];
          { node with amplitude = Float.min(PHI * 10.0, node.amplitude * dm) }
        });
        let newSphere : CoreSphere = {
          core.sphere with
          nodes     = boostedNodes;
          coherence = sphereCoherence(boostedNodes);
        };
        cores[coreId] := { core with sphere = newSphere };
      };
    };

    // 5. Jubilee check — fires every 343 beats (7 * 49)
    let newBeats = jubilee.beatsSinceJubilee + 1;
    let newJubilee : JubileeState =
      if (newBeats >= JUBILEE_AT) {
        // On jubilee: reset all Core presenceBoost to S0_FLOOR
        for (coreId in Nat.range(0, 43)) {
          cores[coreId] := { cores[coreId] with presenceBoost = S0_FLOOR };
        };
        {
          beatsSinceJubilee = 0;
          jubileeCount      = jubilee.jubileeCount + 1;
          nextJubileeAt     = beatCounter + JUBILEE_AT;
        }
      } else {
        { jubilee with beatsSinceJubilee = newBeats }
      };

    // 6. Seven Spirits rotation — rotates activeSpiritIdx on VELA ring completion
    let newSpirits : SevenSpiritsState =
      if (ringComplete) {
        let nextIdx = (spirits.activeSpiritIdx + 1) % spirits.spirits.size();
        { spirits with activeSpiritIdx = nextIdx; rotationBeat = beatCounter }
      } else {
        spirits
      };

    // 7. Succession check
    // masteryReached: VELA ring completions >= 100 (each organism fire tracked via ring cycles)
    // successorActivated: >= 3 ring completions (3+ organisms mastered proxy)
    let newSuccession : SuccessionState = {
      currentLead = if (newVela.completed >= 3) {
        // Successor is the next spirit in the rotation
        let nextLeadIdx = (spirits.activeSpiritIdx + 1) % spirits.spirits.size();
        newSpirits.spirits[nextLeadIdx]
      } else { succession.currentLead };
      masteryReached     = newVela.completed >= 100;
      successorActivated = newVela.completed >= 3;
    };

    // GAP_6: micro-Hebbian tick — fire every MICRO_HEBB_EVERY runCycle calls
    let newTickCount = microHebbianTick + 1;
    if (newTickCount % MICRO_HEBB_EVERY == 0) {
      applyMicroHebbianTick(hebbWeights, Array.tabulate(43, func(i) { cores[i] }));
    };

    (newVela, newJubilee, newSpirits, newSuccession, newTickCount)
  };

  // ── SCORING ───────────────────────────────────────────────────────────

  /// Average amplitude of expansive Core nodes (IDs 0-14).
  public func computeExpansiveScore(cores : [SovereignCore]) : Float {
    var sum   : Float = 0.0;
    var count : Float = 0.0;
    for (core in cores.values()) {
      switch (core.sphere.archType) {
        case (#expansive) {
          for (node in core.sphere.nodes.values()) {
            sum   += node.amplitude;
            count += 1.0;
          };
        };
        case _ {};
      };
    };
    if (count == 0.0) { S0_FLOOR } else { sum / count }
  };

  /// Average amplitude of receptive Core nodes (IDs 15-29).
  public func computeReceptiveScore(cores : [SovereignCore]) : Float {
    var sum   : Float = 0.0;
    var count : Float = 0.0;
    for (core in cores.values()) {
      switch (core.sphere.archType) {
        case (#receptive) {
          for (node in core.sphere.nodes.values()) {
            sum   += node.amplitude;
            count += 1.0;
          };
        };
        case _ {};
      };
    };
    if (count == 0.0) { S0_FLOOR } else { sum / count }
  };

  /// Anti-drift balance: deviation between expansive and receptive scores,
  /// divided by antiDrift average amplitude. Lower = better coupling.
  /// Returns a normalized coupling quality value [0, 1].
  public func computeAntiDriftBalance(cores : [SovereignCore]) : Float {
    let expScore = computeExpansiveScore(cores);
    let recScore = computeReceptiveScore(cores);
    let divergence = if (expScore > recScore) { expScore - recScore } else { recScore - expScore };

    // Compute antiDrift average amplitude
    var adSum   : Float = 0.0;
    var adCount : Float = 0.0;
    for (core in cores.values()) {
      switch (core.sphere.archType) {
        case (#antiDrift) {
          for (node in core.sphere.nodes.values()) {
            adSum   += node.amplitude;
            adCount += 1.0;
          };
        };
        case _ {};
      };
    };
    let adAvg = if (adCount == 0.0) { S0_FLOOR } else { adSum / adCount };

    // Balance = antiDrift amplitude / (1 + divergence)
    // High balance → antiDrift is strong relative to divergence (good coupling)
    adAvg / (1.0 + divergence)
  };

  // ── CREATOR PRESENCE ─────────────────────────────────────────────────

  /// Update creator presence state; sets depthMultiplier to 1.5 when present.
  public func updatePresence(
    current   : CreatorPresence,
    present   : Bool,
    principal : ?Principal,
    beat      : Nat,
  ) : CreatorPresence {
    {
      isPresent       = present;
      principal       = if (present) { principal } else { current.principal };
      lastSeenBeat    = if (present) { beat } else { current.lastSeenBeat };
      depthMultiplier = if (present) { 1.5 } else { 1.0 };
    }
  };

  // ── ASSEMBLY ─────────────────────────────────────────────────────────

  /// Assemble the full ArchitectureState snapshot from live state slices.
  public func assembleState(
    cores      : [SovereignCore],
    velaRing   : VELARingState,
    jubilee    : JubileeState,
    presence   : CreatorPresence,
    spirits    : SevenSpiritsState,
    succession : SuccessionState,
  ) : ArchitectureState {
    {
      expansiveScore   = computeExpansiveScore(cores);
      receptiveScore   = computeReceptiveScore(cores);
      antiDriftBalance = computeAntiDriftBalance(cores);
      velaRing;
      jubilee;
      creatorPresence  = presence;
      sevenSpirits     = spirits;
      succession;
    }
  };

  // ── GAP_6: MICRO-HEBBIAN UPDATE ───────────────────────────────────────
  // Δw_ij = η × (pre_i × post_j − λ × w_ij)  clamped to [-1.0, 1.0]
  // Fires on every 10th runCycle call (simulating 1/10 heartbeat).

  public type HebbianWeight = {
    preId  : Nat;
    postId : Nat;
    weight : Float;
  };

  /// Apply one micro-Hebbian update to a weight connection.
  public func microHebbianUpdate(w : HebbianWeight, preAmp : Float, postAmp : Float) : HebbianWeight {
    let delta = HEBB_ETA * (preAmp * postAmp - HEBB_LAMBDA * w.weight);
    let newWeight = w.weight + delta;
    // Clamp to [-1.0, 1.0]
    let clamped = if (newWeight < -1.0) -1.0 else if (newWeight > 1.0) 1.0 else newWeight;
    { w with weight = clamped }
  };

  /// Apply micro-Hebbian tick across all weight connections in place.
  /// Each connection fires Δw = η*(pre_amp × post_amp − λ*w).
  /// Pre/post amplitudes drawn from the first node of each core's sphere.
  public func applyMicroHebbianTick(
    weights : List.List<HebbianWeight>,
    cores   : [SovereignCore],
  ) {
    weights.mapInPlace(func(w : HebbianWeight) : HebbianWeight {
      let preAmp  = if (w.preId  < cores.size()) cores[w.preId].sphere.nodes[0].amplitude  else S0_FLOOR;
      let postAmp = if (w.postId < cores.size()) cores[w.postId].sphere.nodes[0].amplitude else S0_FLOOR;
      microHebbianUpdate(w, preAmp, postAmp)
    });
  };

  // ── GAP_7: OMNIS 43-CORE VOTING BREAKDOWN ─────────────────────────────
  // phi_weight(k) = PHI^(43-k) for k in 1..43, normalised
  // consensus_score = Σ (vote_k × phi_weight_norm_k)

  public type OmnisVoteEntry = {
    coreId       : Nat;
    vote         : Bool;
    weight       : Float;
    contribution : Float;
  };

  /// Compute PHI weight for core index k (1-based).
  /// phi_weight(k) = PHI^(43-k)
  func phiWeight(k : Nat) : Float {
    var pw : Float = 1.0;
    let exp = if (43 >= k) 43 - k else 0;
    var i : Nat = 0;
    while (i < exp) { pw := pw * PHI; i += 1; };
    pw
  };

  /// Compute the full OMNIS voting breakdown for all 43 cores.
  /// A core votes true when its average node amplitude ≥ S0_FLOOR.
  public func computeOmnisVotingBreakdown(cores : [SovereignCore]) : [OmnisVoteEntry] {
    // Compute raw weights and total for normalization
    let rawWeights = Array.tabulate(43, func(k : Nat) : Float { phiWeight(k + 1) });
    var totalWeight : Float = 0.0;
    for (w in rawWeights.values()) { totalWeight := totalWeight + w };

    Array.tabulate<OmnisVoteEntry>(43, func(k) {
      let core = cores[k];
      // Vote = true when average node amplitude ≥ S0_FLOOR
      var ampSum : Float = 0.0;
      for (node in core.sphere.nodes.values()) { ampSum := ampSum + node.amplitude };
      let avgAmp = ampSum / 12.0;
      let vote = avgAmp >= S0_FLOOR;

      let rawW  = rawWeights[k];
      let normW = if (totalWeight > 0.0) rawW / totalWeight else 0.0;
      let contribution = if (vote) normW else 0.0;

      { coreId = k; vote; weight = normW; contribution }
    })
  };

  /// Compute consensus score from breakdown entries.
  /// consensus_score = Σ contribution_k (already normalized)
  public func computeOmnisConsensus(breakdown : [OmnisVoteEntry]) : Float {
    var sum : Float = 0.0;
    for (entry in breakdown.values()) { sum := sum + entry.contribution };
    sum
  };

  // ── GAP_12: ALL 15 VELA RINGS ACTIVE ─────────────────────────────────
  // ring_activation(k, velaStep) = if velaStep >= k then 1.0 else 0.0
  // ring_phase_harmonic(k) = cos(2π × k × PHI mod 2π)
  // ring_contribution(k, velaStep) = activation × RING_WEIGHTS[k] × phase_harmonic
  // total_ring_score(velaStep) = Σ ring_contribution(k) / Σ RING_WEIGHTS

  public type RingState = {
    ringId       : Nat;
    name         : Text;
    active       : Bool;
    contribution : Float;
  };

  let RING_NAMES : [Text] = [
    "GENESIS_RING",      // Ring 0 (step 0)
    "RESONANCE_RING",    // Ring 1
    "DOCTRINE_RING",     // Ring 2
    "CARDIAC_RING",      // Ring 3
    "NEURAL_RING",       // Ring 4
    "ENTERIC_RING",      // Ring 5
    "WORLD_RING",        // Ring 6
    "ACTOR_RING",        // Ring 7
    "ARTIFACT_RING",     // Ring 8
    "FINANCIAL_RING",    // Ring 9
    "SOVEREIGN_RING",    // Ring 10
    "OMNIS_RING",        // Ring 11
    "VELA_RING",         // Ring 12
    "JUBILEE_RING",      // Ring 13
    "OMEGA_RING",        // Ring 14
  ];

  func ringActivation(ringIdx : Nat, velaStep : Nat) : Float {
    if (velaStep >= ringIdx) 1.0 else 0.0
  };

  func ringPhaseHarmonic(k : Nat) : Float {
    let angle = Float.rem(TWO_PI * k.toFloat() * PHI, TWO_PI);
    Float.cos(angle)
  };

  func ringContribution(k : Nat, velaStep : Nat) : Float {
    let weight = if (k < RING_WEIGHTS.size()) RING_WEIGHTS[k] else 1.0;
    ringActivation(k, velaStep) * weight * ringPhaseHarmonic(k)
  };

  /// Total ring score normalized by total ring weights.
  public func totalRingScore(velaStep : Nat) : Float {
    var sumContrib : Float = 0.0;
    var sumWeights : Float = 0.0;
    var k : Nat = 0;
    while (k < 15) {
      sumContrib := sumContrib + ringContribution(k, velaStep);
      sumWeights := sumWeights + (if (k < RING_WEIGHTS.size()) RING_WEIGHTS[k] else 1.0);
      k += 1;
    };
    if (sumWeights > 0.0) sumContrib / sumWeights else 0.0
  };

  /// GAP_12: Return all 15 ring states with activation, name, and contribution.
  public func getAllRingStates(velaStep : Nat) : [RingState] {
    Array.tabulate<RingState>(15, func(k) {
      let name   = if (k < RING_NAMES.size()) RING_NAMES[k] else "RING_" # k.toText();
      let active = velaStep >= k;
      let weight = if (k < RING_WEIGHTS.size()) RING_WEIGHTS[k] else 1.0;
      var sumW : Float = 0.0;
      var i : Nat = 0;
      while (i < 15) {
        sumW := sumW + (if (i < RING_WEIGHTS.size()) RING_WEIGHTS[i] else 1.0);
        i += 1;
      };
      let contrib = if (sumW > 0.0 and active) {
        weight * ringPhaseHarmonic(k) / sumW
      } else { 0.0 };
      { ringId = k; name; active; contribution = contrib }
    })
  };

  // ── FIELD MONITOR ─────────────────────────────────────────────────────
  // Computes coherence between the backend sovereign field and the
  // frontend-reported field state. Ring 16 closure.

  /// Compute field coherence between backend state and frontend FieldReport.
  /// Returns a float [0.0, 1.0]. 1.0 = perfect alignment.
  public func computeFieldCoherence(
    report : Types.FieldReport,
    state  : { velaStep : Nat; omnisWeight : Float; doctrineScore : Float },
  ) : Float {
    // Alignment per dimension (each clamped to [0, 1])
    let rawVelaDiff = if (report.velaStep > state.velaStep) {
      (report.velaStep - state.velaStep).toFloat()
    } else {
      (state.velaStep - report.velaStep).toFloat()
    };
    let velaAlignment    = 1.0 - Float.min(1.0, rawVelaDiff / 50.0);
    let omnisAlignment   = 1.0 - Float.min(1.0, Float.abs(report.omnisWeight - state.omnisWeight));
    let rawDocDiff       = Float.abs(report.doctrineScore - state.doctrineScore);
    let doctrineAlignment = 1.0 - Float.min(1.0, rawDocDiff / 100.0);
    // Weighted coherence: VELA 40%, OMNIS 30%, doctrine 30%
    (velaAlignment * 0.4) + (omnisAlignment * 0.3) + (doctrineAlignment * 0.3)
  };

  /// Compute the readiness gate score with the updated formula.
  /// Formula: (velaStep/50 × 0.25) + (doctrineScore/100 × 0.35) + (omnisWeight × 0.25) + (fieldCoherence × 0.15)
  /// Hard block if fieldCoherence < 0.3 — organism sovereignty requires field alignment.
  public func computeReadinessGate(
    velaStep      : Nat,
    doctrineScore : Float,
    omnisWeight   : Float,
    fieldCoherence: Float,
  ) : Types.ReadinessGateResult {
    // Hard block check
    if (fieldCoherence < 0.3) {
      return {
        score   = 0.0;
        blocked = true;
        reason  = "Field coherence below 0.3 — organism sovereignty requires field alignment";
      };
    };
    let velaFraction    = velaStep.toFloat() / 50.0;
    let doctrineFraction = doctrineScore / 100.0;
    let score =
      (velaFraction    * 0.25) +
      (doctrineFraction * 0.35) +
      (omnisWeight      * 0.25) +
      (fieldCoherence   * 0.15);
    { score; blocked = false; reason = "" }
  };

};
