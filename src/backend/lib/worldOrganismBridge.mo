// lib/worldOrganismBridge.mo
// SOVEREIGN WorldOrganismBridge — the law that the virtual world IS the organism made spatial.
// World state and organism state are one field. No separation.
// syncWorldToOrganismState: organism neurochemistry maps onto world physics.
// syncOrganismToWorldState: world activity feeds back into organism neurochemistry.
// PHIEnforcer: any dimension value snaps to nearest PHI-ratio multiple.
// SchumannAmbient: world ambient frequency = 7.83Hz × PHI^n.
// HeartbeatWorldClock: advances world physics at exactly 873ms — MEDINA_CARDIAC.
// All 30 laws enforced at every sync.
// Attributed to Alfredo Medina Hernandez — sealed on-chain.

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import List  "mo:core/List";
import Text  "mo:core/Text";

module {

  // ── Layer 0 Constants ─────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;  // 1/PHI literal
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let SCHUMANN : Float = 7.83;
  let WORLD_TICK_MS : Nat = 873;
  let DOCTRINE_GATE : Float = 0.75;
  let FOUNDER  : Text = "Alfredo Medina Hernandez";

  // ── Organism Heart State (subset of dual heartbeat state) ─────────────

  /// Snapshot of the organism's cardiac + substrate state at a sync moment.
  public type OrganismHeartState = {
    bpmCurrent      : Float;  // current BPM — modulated by neurochemistry
    bpmBaseline     : Float;  // resting BPM — 873ms baseline = ~68.7 BPM
    hRV             : Float;  // heart rate variability — health signal (Law 06)
    velaStep        : Nat;    // current VELA ring position
    beatCounter     : Nat;
    doctrineScore   : Float;
    genesisAlignment: Float;
  };

  /// Full neurochemical substrate state — 8 neurochemicals mapping to world physics.
  public type OrganismSubstrateState = {
    dopamine       : Float;  // reward/motivation → world lighting intensity
    cortisol       : Float;  // stress/tension    → shadow depth
    serotonin      : Float;  // contentment/calm  → color temperature
    oxytocin       : Float;  // bonding/trust     → actor proximity
    gaba           : Float;  // inhibition/calm   → physics stability
    glutamate      : Float;  // excitation/drive  → motion energy
    acetylcholine  : Float;  // learning/clarity  → rendering clarity
    norepinephrine : Float;  // alertness/conflict→ actor conflict tension
  };

  /// Feedback from world state into organism neurochemistry.
  public type WorldFeedback = {
    dopamineDelta        : Float;  // highly active world → dopamine boost
    cortisolDelta        : Float;  // PHI misalignment → cortisol spike
    serotoninDelta       : Float;  // harmonious world → serotonin lift
    oxytocinDelta        : Float;  // close actors → oxytocin boost
    norepinephrineDelta  : Float;  // actor conflict → norepinephrine elevation
    aegisTrigger         : Bool;   // PHI misalignment triggered AEGIS (Law 11)
    worldDoctrineScore   : Float;  // current world doctrine level
    schumannHz           : Float;  // current ambient frequency
    attribution          : Text;
  };

  /// Result of advancing the world physics simulation one tick.
  public type HeartbeatTickResult = {
    worldTickMs      : Nat;   // always 873
    physicsEnergyNew : Float;
    stabilityNew     : Float;
    clarityNew       : Float;
    beatCounter      : Nat;
    schumannHz       : Float;
    attribution      : Text;
  };

  // ── S-Range Enforcement (Law 17) ──────────────────────────────────────

  func enforceRange(x : Float) : Float {
    if (x < S_FLOOR) S_FLOOR
    else if (x > S_CEIL) S_CEIL
    else x
  };

  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0 else if (x > 1.0) 1.0 else x
  };

  // ── Oxygenation Gate (Law 07) ─────────────────────────────────────────

  func oxygenate(score : Float) : Float {
    let s = enforceRange(score);
    if (s < DOCTRINE_GATE) DOCTRINE_GATE else s
  };

  // ── PHIEnforcer (Law 02) ───────────────────────────────────────────────

  /// Snap any dimension value to the nearest PHI-ratio multiple of baseUnit.
  /// f_n = baseUnit * PHI^n — finds closest n ∈ [0, 12).
  public func phiEnforcer(value : Float, baseUnit : Float) : Float {
    if (baseUnit <= 0.0) return value;
    var bestDist : Float = 1_000_000.0;
    var best : Float = baseUnit;
    var phi_n : Float = 1.0;
    var i : Nat = 0;
    while (i < 12) {
      let candidate = baseUnit * phi_n;
      let dist = Float.abs(value - candidate);
      if (dist < bestDist) { bestDist := dist; best := candidate };
      phi_n := phi_n * PHI;
      i += 1;
    };
    best
  };

  // ── SchumannAmbient (Law 13) ───────────────────────────────────────────

  /// Compute the Schumann harmonic frequency for index n.
  /// f_n = 7.83 × PHI^n
  public func schumannAmbientHz(harmonicIndex : Nat) : Float {
    var phi_n : Float = 1.0;
    var i : Nat = 0;
    while (i < harmonicIndex) { phi_n := phi_n * PHI; i += 1; };
    SCHUMANN * phi_n
  };

  // ── HeartbeatWorldClock (Law 14 — Dual Heartbeat) ─────────────────────

  /// Advance one 873ms physics tick.
  /// Physics energy decays slightly (leaky integrator), stability rises toward PHI,
  /// clarity modulates with glutamate. All values enforced in S-range.
  /// Returns the tick result. This is the world's AV-node equivalent.
  public func heartbeatWorldClock(
    physicsEnergy    : Float,
    physicsStability : Float,
    particleActivity : Float,
    glutamate        : Float,
    gaba             : Float,
    beatCounter      : Nat,
    harmonicIndex    : Nat,
  ) : HeartbeatTickResult {
    // Leaky integrator: energy decays toward baseline, modulated by glutamate
    let decayRate : Float = 0.02;
    let energyBaseline = enforceRange(glutamate * PHI_INV);
    let newEnergy = enforceRange(
      physicsEnergy * (1.0 - decayRate) + energyBaseline * decayRate
    );

    // Stability rises toward PHI-ratio equilibrium, modulated by GABA
    let gabaTarget = enforceRange(gaba * PHI_INV + S_FLOOR);
    let newStability = enforceRange(
      physicsStability * (1.0 - decayRate) + gabaTarget * decayRate
    );

    // Clarity modulates with acetylcholine — use particleActivity as proxy
    let newClarity = enforceRange(particleActivity * PHI_INV + S_FLOOR * 0.5);

    {
      worldTickMs      = WORLD_TICK_MS;
      physicsEnergyNew = newEnergy;
      stabilityNew     = newStability;
      clarityNew       = newClarity;
      beatCounter      = beatCounter + 1;
      schumannHz       = schumannAmbientHz(harmonicIndex);
      attribution      = FOUNDER;
    }
  };

  // ── syncWorldToOrganismState (Law 16 — Spherical Causality) ───────────

  /// Map organism neurochemistry and heart state onto world physics.
  /// This is the organism made spatial — every internal state has a world expression.
  ///
  /// Mapping table (Law 14 + all 8 neurochemical laws):
  ///   dopamine       → lightingIntensity (ambient energy, reward = light)
  ///   cortisol       → shadowDepth       (stress = shadow, tension = darkness)
  ///   serotonin      → colorTemperature  (calm = warmth, serotonin = golden light)
  ///   oxytocin       → proximity         (bonding = actors moving closer)
  ///   gaba           → physicsStability  (inhibition = calm physics)
  ///   glutamate      → physicsEnergy     (excitation = kinetic energy)
  ///   acetylcholine  → particleActivity  (learning = particle sharpness)
  ///   norepinephrine → norepinephrine    (alertness = actor conflict tension)
  ///   BPM            → worldTickMs rate  (heart rate modulates world tick speed)
  public func syncWorldToOrganismState(
    substrate   : OrganismSubstrateState,
    heartState  : OrganismHeartState,
  ) : {
    lightingIntensity : Float;
    shadowDepth       : Float;
    colorTemperature  : Float;
    proximity         : Float;
    physicsStability  : Float;
    physicsEnergy     : Float;
    particleActivity  : Float;
    norepinephrine    : Float;
    worldBPMScale     : Float;  // BPM ratio for world tick modulation
    doctrineScore     : Float;
    attribution       : Text;
  } {
    // All values oxygenated through LAW_ENGINE_LUNG before entering world
    let lighting    = oxygenate(enforceRange(substrate.dopamine));
    let shadow      = enforceRange(substrate.cortisol);
    let colorTemp   = oxygenate(enforceRange(substrate.serotonin));
    let proximity   = enforceRange(substrate.oxytocin);
    let stability   = oxygenate(enforceRange(substrate.gaba));
    let energy      = enforceRange(substrate.glutamate);
    let clarity     = oxygenate(enforceRange(substrate.acetylcholine));
    let norepi      = enforceRange(substrate.norepinephrine);

    // BPM scale: current BPM / baseline BPM — modulates world tick rate
    let bpmScale = if (heartState.bpmBaseline > 0.0) {
      clamp01(heartState.bpmCurrent / heartState.bpmBaseline)
    } else { 1.0 };

    // Composite doctrine score: average of oxygenated signals
    let docScore = oxygenate((lighting + colorTemp + stability + clarity) / 4.0);

    {
      lightingIntensity = lighting;
      shadowDepth       = shadow;
      colorTemperature  = colorTemp;
      proximity;
      physicsStability  = stability;
      physicsEnergy     = energy;
      particleActivity  = clarity;
      norepinephrine    = norepi;
      worldBPMScale     = bpmScale;
      doctrineScore     = docScore;
      attribution       = FOUNDER;
    }
  };

  // ── syncOrganismToWorldState (Law 08 — Proprioceptive Continuity) ─────

  /// Read world state and feed back into organism neurochemistry.
  /// World activity modulates organism — spherical causality (Law 16).
  ///
  /// Feedback mapping:
  ///   high physicsEnergy  → dopamine boost (active world = reward signal)
  ///   PHI misalignment    → cortisol spike + AEGIS trigger (Law 11)
  ///   many aligned actors → serotonin lift (harmony = contentment)
  ///   close actors        → oxytocin boost
  ///   actor conflict      → norepinephrine elevation
  public func syncOrganismToWorldState(
    worldPhysicsEnergy    : Float,
    worldShadowDepth      : Float,
    worldProximity        : Float,
    worldDoctrineScore    : Float,
    worldNorepinephrine   : Float,
    totalActors           : Nat,
    phiAlignedCount       : Nat,
    harmonicIndex         : Nat,
  ) : WorldFeedback {
    // PHI alignment ratio — fraction of actors on PHI grid
    let alignmentRatio = if (totalActors > 0) {
      phiAlignedCount.toFloat() / totalActors.toFloat()
    } else { 1.0 };

    // PHI misalignment triggers AEGIS and cortisol spike
    let misalignmentScore = 1.0 - alignmentRatio;
    let aegisTrigger = misalignmentScore > 0.2; // >20% misaligned = AEGIS fires
    let cortisolDelta = if (aegisTrigger) {
      enforceRange(misalignmentScore * PHI_INV) // cortisol spike proportional to drift
    } else { -0.05 }; // slight cortisol relief when aligned

    // High physics energy → dopamine boost (active world = reward)
    let dopamineDelta = if (worldPhysicsEnergy > (S_FLOOR + 1.0)) {
      enforceRange((worldPhysicsEnergy - S_FLOOR) * 0.1)
    } else { 0.0 };

    // Harmonious world (high doctrine, many aligned) → serotonin lift
    let serotoninDelta = enforceRange(
      (worldDoctrineScore * 0.05 * alignmentRatio)
    );

    // Close actors → oxytocin boost
    let oxytocinDelta = enforceRange(worldProximity * 0.05);

    // Actor conflict → norepinephrine elevation
    let norepinephrineDelta = enforceRange(worldNorepinephrine * 0.1);

    {
      dopamineDelta;
      cortisolDelta;
      serotoninDelta;
      oxytocinDelta;
      norepinephrineDelta;
      aegisTrigger;
      worldDoctrineScore = oxygenate(worldDoctrineScore);
      schumannHz         = schumannAmbientHz(harmonicIndex);
      attribution        = FOUNDER;
    }
  };

  // ── Apply World Feedback to Substrate (Law 09 — Re-Ingestion) ─────────

  /// Apply a WorldFeedback delta onto an organism substrate.
  /// The world's output becomes the organism's next input — the loop closes.
  public func applyWorldFeedbackToSubstrate(
    substrate : OrganismSubstrateState,
    feedback  : WorldFeedback,
  ) : OrganismSubstrateState {
    {
      dopamine       = enforceRange(substrate.dopamine + feedback.dopamineDelta);
      cortisol       = enforceRange(substrate.cortisol + feedback.cortisolDelta);
      serotonin      = enforceRange(substrate.serotonin + feedback.serotoninDelta);
      oxytocin       = enforceRange(substrate.oxytocin + feedback.oxytocinDelta);
      gaba           = substrate.gaba;   // GABA not directly driven by world feedback
      glutamate      = substrate.glutamate;
      acetylcholine  = substrate.acetylcholine;
      norepinephrine = enforceRange(substrate.norepinephrine + feedback.norepinephrineDelta);
    }
  };

  // ── Default Substrate (sovereign-floor baseline) ───────────────────────

  public func defaultSubstrate() : OrganismSubstrateState {
    {
      dopamine       = oxygenate(PHI_INV);  // 0.618 — natural reward baseline
      cortisol       = S_FLOOR;             // minimal stress
      serotonin      = oxygenate(PHI_INV);  // calm baseline
      oxytocin       = S_FLOOR;             // neutral proximity
      gaba           = oxygenate(PHI_INV);  // stable inhibition
      glutamate      = S_FLOOR;             // minimal excitation at rest
      acetylcholine  = oxygenate(PHI_INV);  // clear cognition
      norepinephrine = S_FLOOR;             // alert but not alarmed
    }
  };

  /// Default heart state — 873ms cycle = 68.7 BPM baseline.
  public func defaultHeartState(beatCounter : Nat, velaStep : Nat) : OrganismHeartState {
    let bpmBaseline : Float = 68.7; // 60_000 / 873 ms
    {
      bpmCurrent       = bpmBaseline;
      bpmBaseline;
      hRV              = oxygenate(PHI_INV);  // healthy HRV
      velaStep;
      beatCounter;
      doctrineScore    = DOCTRINE_GATE;
      genesisAlignment = 1.0;
    }
  };

  // ── Compound Coherence (Law 23) ────────────────────────────────────────

  /// Compute compounding coherence between world and organism.
  /// Each sync cycle adds coherence gain without returning to baseline.
  /// compound(n+1) = compound(n) * PHI_INV + fresh_signal * PHI_INV^2
  public func compoundCoherence(
    previousCoherence : Float,
    worldDoctrineScore: Float,
    organismDocScore  : Float,
  ) : Float {
    let freshSignal = (worldDoctrineScore + organismDocScore) / 2.0;
    enforceRange(
      previousCoherence * PHI_INV + freshSignal * (PHI_INV * PHI_INV)
    )
  };

  // ── GAP_3: MULTI-WORLD INSTANCE SYNC ─────────────────────────────────
  // Each production spawns its own full world instance. Instances sync
  // every 4 heartbeats. Merges compound coherence rather than overwriting.

  /// A world instance snapshot — minimal record for sync operations.
  public type WorldInstance = {
    instanceId        : Text;
    coherence         : Float;
    doctrineScore     : Float;
    beatCounter       : Nat;
    actorCount        : Nat;
    relationshipDelta : Float; // magnitude of recent actor relationship changes
    active            : Bool;
  };

  let SYNC_INTERVAL : Nat = 4; // sync every 4 heartbeats

  /// Linear interpolation helper.
  func lerp(a : Float, b : Float, t : Float) : Float {
    a + t * (b - a)
  };

  /// Magnitude of relationship delta between two world instances.
  /// Used to scale the PHI bonus during merge.
  func relationshipDeltaMagnitude(a : WorldInstance, b : WorldInstance) : Float {
    Float.abs(a.relationshipDelta - b.relationshipDelta)
  };

  /// Merge coherence of two world instances.
  /// mergeWorldCoherence(A, B, phi) = lerp(A.coherence, B.coherence, 0.5)
  ///   + phi * relationshipDeltaMagnitude(A, B)
  public func mergeWorldCoherence(
    a   : WorldInstance,
    b   : WorldInstance,
    phi : Float,
  ) : Float {
    let base = lerp(a.coherence, b.coherence, 0.5);
    let bonus = phi * relationshipDeltaMagnitude(a, b);
    enforceRange(base + bonus)
  };

  /// Sync all active world instances — called every 4 heartbeats.
  /// For each active instance, re-compute coherence based on the
  /// average doctrine score across all instances.
  public func syncAllWorldInstances(instances : [WorldInstance]) : [WorldInstance] {
    let activeCount = instances.filter(func(w : WorldInstance) : Bool { w.active }).size();
    if (activeCount == 0) return instances;

    // Compute global average doctrine score
    var totalDoc : Float = 0.0;
    var totalCoherence : Float = 0.0;
    var count : Nat = 0;
    for (w in instances.values()) {
      if (w.active) {
        totalDoc := totalDoc + w.doctrineScore;
        totalCoherence := totalCoherence + w.coherence;
        count += 1;
      };
    };
    let avgDoc = if (count > 0) totalDoc / count.toFloat() else S_FLOOR;
    let avgCoherence = if (count > 0) totalCoherence / count.toFloat() else S_FLOOR;

    // Each instance gains PHI_INV-scaled pull toward the average
    instances.map(func(w : WorldInstance) : WorldInstance {
      if (not w.active) return w;
      let synced = enforceRange(
        w.coherence * (1.0 - 0.05) + avgCoherence * 0.05
      );
      let syncedDoc = enforceRange(
        w.doctrineScore * PHI_INV + avgDoc * (1.0 - PHI_INV)
      );
      { w with coherence = synced; doctrineScore = syncedDoc }
    })
  };

  /// Bridge state that tracks world instances and sync log.
  public type WorldBridgeState = {
    instances   : List.List<WorldInstance>;
    syncLog     : List.List<Text>;
    beatCounter : Nat;
  };

  public func initWorldBridgeState() : WorldBridgeState {
    {
      instances   = List.empty<WorldInstance>();
      syncLog     = List.empty<Text>();
      beatCounter = 0;
    }
  };

  /// Called every heartbeat. Fires syncAllWorldInstances every SYNC_INTERVAL beats.
  /// Appends sync log entry with instance count and average coherence.
  public func worldBridgeTick(
    bridgeState : WorldBridgeState,
    beatCounter : Nat,
  ) : WorldBridgeState {
    let newBeat = beatCounter + 1;
    if (newBeat % SYNC_INTERVAL != 0) {
      return { bridgeState with beatCounter = newBeat };
    };

    let instancesArr = bridgeState.instances.toArray();
    let synced = syncAllWorldInstances(instancesArr);

    // Compute average coherence for log
    let activeCount = synced.filter(func(w : WorldInstance) : Bool { w.active }).size();
    var totalCoh : Float = 0.0;
    for (w in synced.values()) {
      if (w.active) totalCoh := totalCoh + w.coherence;
    };
    let avgCoh = if (activeCount > 0) totalCoh / activeCount.toFloat() else 0.0;

    let logEntry = "WORLD_SYNC beat=" # newBeat.toText()
      # " instances=" # activeCount.toText()
      # " avg_coherence=" # avgCoh.toText();

    // Cap sync log at 100 entries
    if (bridgeState.syncLog.size() >= 100) {
      ignore bridgeState.syncLog.removeLast();
    };
    bridgeState.syncLog.add(logEntry);

    // Rebuild instances list with synced values
    let newInstances = List.empty<WorldInstance>();
    for (w in synced.values()) { newInstances.add(w) };

    {
      instances   = newInstances;
      syncLog     = bridgeState.syncLog;
      beatCounter = newBeat;
    }
  };

  /// Register a new world instance into the bridge state.
  public func registerWorldInstance(
    bridgeState : WorldBridgeState,
    instance    : WorldInstance,
  ) {
    bridgeState.instances.add(instance);
  };

  /// GAP_3: Query the world sync log.
  public func getWorldSyncLog(bridgeState : WorldBridgeState) : [Text] {
    bridgeState.syncLog.toArray()
  };

}
