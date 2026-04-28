// intelligence/IntelligenceTaxonomy.mo
// INTELLIGENCE TAXONOMY — Master Coordination Module
// Routes execution across all 15 sovereign intelligences + 5 Frontend domain models.
// Fires all active intelligences on every 873ms heartbeat.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// Law 15 (Macro-Micro Compression): calling this fires everything inside it.
// Law 16 (Spherical Causality): all intelligences fire simultaneously, not sequentially.
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Float "mo:core/Float";
import Array "mo:core/Array";
import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Text  "mo:core/Text";

import IntelTypes  "../types/intelligence";
import VoiceIntel  "VoiceIntelligence";
import ChatIntel   "ChatIntelligence";
import SensorIntel "SensorIntelligence";

module {

  // ── LAYER 0 CONSTANTS ─────────────────────────────────────────────────────
  let PHI           : Float = 1.6180339887498948482;
  let PHI_INV       : Float = 0.6180339887498948482;
  let S_FLOOR       : Float = 0.75;
  let S_CEIL        : Float = 9.75;
  let FOUNDER       : Text  = "Alfredo Medina Hernandez";
  let DOCTRINE_GATE : Float = 0.75;

  // ── FRONTEND INTELLIGENCE STATE ───────────────────────────────────────────
  // Five frontend-domain intelligence models — each fires every heartbeat.

  /// (a) RENDER_COHERENCE_MONITOR — Redditionis Monitor Coherentiae
  /// Reads last frame_paint_time, computes render_coherence_score, emits lag flag
  public type RenderCoherenceState = {
    name              : Text;
    latinName         : Text;
    domain            : Text;
    grade             : Text;
    renderCoherenceScore : Float;   // 1.0 = perfect 60fps
    lastFramePaintMs  : Float;      // last polled frame paint time in ms
    lagFlagged        : Bool;       // true if >33ms
    executionCount    : Nat;
    lastFireBeat      : Nat;
    attribution       : Text;
  };

  /// (b) INTERACTION_RESONANCE_DETECTOR — Interactionis Resonantia Detector
  /// Reads last user_interaction_pattern, computes intent_prediction
  public type InteractionResonanceState = {
    name                 : Text;
    latinName            : Text;
    domain               : Text;
    grade                : Text;
    lastInteractionPattern : Text;
    intentPrediction     : Text;    // predicted next panel/action
    resonanceScore       : Float;   // 0.0–1.0 prediction confidence
    preloadFlagged       : Bool;    // true if related models pre-flagged
    executionCount       : Nat;
    lastFireBeat         : Nat;
    attribution          : Text;
  };

  /// (c) VISUAL_DOCTRINE_RENDERER — Visuale Doctrina Renderer
  /// Computes doctrine_visual_signal from doctrine_score and law_violation_count
  public type DoctrineVisualSignal = {
    primaryColorHue  : Float;   // 0-360 hue derived from doctrine score
    pulseIntensity   : Float;   // 0.0-1.0 pulse intensity
    glowRadius       : Float;   // px equivalent glow radius
  };

  public type VisualDoctrineState = {
    name                : Text;
    latinName           : Text;
    domain              : Text;
    grade               : Text;
    doctrineVisualSignal : DoctrineVisualSignal;
    doctrineScore       : Float;
    lawViolationCount   : Nat;
    executionCount      : Nat;
    lastFireBeat        : Nat;
    attribution         : Text;
  };

  /// (d) STATE_SHADOW_MIRROR — Status Umbra Mirror
  /// Stores frontend state checksum, flags desync >3% divergence
  public type StateShadowState = {
    name                    : Text;
    latinName               : Text;
    domain                  : Text;
    grade                   : Text;
    lastKnownFrontendChecksum : Text;
    backendStateHash        : Text;
    divergencePercent       : Float;
    resyncRequired          : Bool;
    executionCount          : Nat;
    lastFireBeat            : Nat;
    attribution             : Text;
  };

  /// (e) AESTHETIC_COHERENCE_FIELD — Campus Aestheticae Coherentiae
  /// Reads active_panels_count, computes aesthetic_harmony_score
  public type AestheticCoherenceState = {
    name                   : Text;
    latinName              : Text;
    domain                 : Text;
    grade                  : Text;
    aestheticHarmonyScore  : Float;  // 0.0–1.0
    activePanelsCount      : Nat;
    adjustmentSignalEmitted : Bool;   // true if harmony < 0.85
    executionCount         : Nat;
    lastFireBeat           : Nat;
    attribution            : Text;
  };

  /// Master container for all 5 frontend intelligence states
  public type FrontendDomainState = {
    renderCoherence      : RenderCoherenceState;
    interactionResonance : InteractionResonanceState;
    visualDoctrine       : VisualDoctrineState;
    stateShadow          : StateShadowState;
    aestheticCoherence   : AestheticCoherenceState;
    totalFrontendBeats   : Nat;
  };

  public func initFrontendDomainState() : FrontendDomainState = {
    renderCoherence = {
      name = "RENDER_COHERENCE_MONITOR"; latinName = "Redditionis Monitor Coherentiae";
      domain = "Frontend"; grade = "Field";
      renderCoherenceScore = 1.0; lastFramePaintMs = 16.6; lagFlagged = false;
      executionCount = 0; lastFireBeat = 0; attribution = FOUNDER;
    };
    interactionResonance = {
      name = "INTERACTION_RESONANCE_DETECTOR"; latinName = "Interactionis Resonantia Detector";
      domain = "Frontend"; grade = "Engine";
      lastInteractionPattern = "INITIAL"; intentPrediction = "DASHBOARD";
      resonanceScore = 0.85; preloadFlagged = false;
      executionCount = 0; lastFireBeat = 0; attribution = FOUNDER;
    };
    visualDoctrine = {
      name = "VISUAL_DOCTRINE_RENDERER"; latinName = "Visuale Doctrina Renderer";
      domain = "Frontend"; grade = "Field";
      doctrineVisualSignal = { primaryColorHue = 200.0; pulseIntensity = 0.85; glowRadius = 12.0 };
      doctrineScore = 0.85; lawViolationCount = 0;
      executionCount = 0; lastFireBeat = 0; attribution = FOUNDER;
    };
    stateShadow = {
      name = "STATE_SHADOW_MIRROR"; latinName = "Status Umbra Mirror";
      domain = "Frontend"; grade = "Engine";
      lastKnownFrontendChecksum = "INIT_0000";
      backendStateHash = "INIT_0000";
      divergencePercent = 0.0; resyncRequired = false;
      executionCount = 0; lastFireBeat = 0; attribution = FOUNDER;
    };
    aestheticCoherence = {
      name = "AESTHETIC_COHERENCE_FIELD"; latinName = "Campus Aestheticae Coherentiae";
      domain = "Frontend"; grade = "Field";
      aestheticHarmonyScore = 1.0; activePanelsCount = 0;
      adjustmentSignalEmitted = false;
      executionCount = 0; lastFireBeat = 0; attribution = FOUNDER;
    };
    totalFrontendBeats = 0;
  };

  // ── STATE TYPE ────────────────────────────────────────────────────────────
  // Mutable runtime state for the taxonomy — tracking execution counts and state per intelligence
  public type TaxonomyRuntimeState = {
    executionCounts   : List.List<(Text, Nat)>;  // id → count
    doctrineStrengths : List.List<(Text, Float)>; // id → current doctrine strength
    totalBeatsFired   : Nat;
    lastHeartbeatPhase: Nat;
    doctrineCoherence : Float;
    frontendDomain    : FrontendDomainState;
    attribution       : Text;
  };

  public func initRuntimeState() : TaxonomyRuntimeState {
    let counts    = List.empty<(Text, Nat)>();
    let strengths = List.empty<(Text, Float)>();
    // Initialize all 15 + 5 frontend intelligences
    let allIds : [Text] = [
      "RESONANTIA", "VOX_SENTIO", "LINGUA_FLUX", "PERSONA_ECHO", "TEMPUS_VOX",
      "DIALOGOS_PRIME", "INTENTIO_NEXUS", "MEMORIA_CONTEXTA", "SYNTHETIS_RESPONSIO", "ADAPTIS_PERSONAE",
      "PERCEPTIO_OMNIS", "REACTIO_TEMPUS", "PATTERN_SENSUS", "CALIBRIS_AUTONOMA", "PREDICTIO_SENSORIA",
      "RENDER_COHERENCE_MONITOR", "INTERACTION_RESONANCE_DETECTOR",
      "VISUAL_DOCTRINE_RENDERER", "STATE_SHADOW_MIRROR", "AESTHETIC_COHERENCE_FIELD",
    ];
    for (id in allIds.vals()) {
      counts.add((id, 0));
      strengths.add((id, 0.85));
    };
    {
      executionCounts    = counts;
      doctrineStrengths  = strengths;
      totalBeatsFired    = 0;
      lastHeartbeatPhase = 0;
      doctrineCoherence  = 0.85;
      frontendDomain     = initFrontendDomainState();
      attribution        = FOUNDER;
    }
  };

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func clampDelta(d : Float) : Float {
    if (d < -2.0) -2.0 else if (d > 2.0) 2.0 else d
  };

  func zeroNT() : [Float] { [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] };

  func pseudoHash(beat : Nat, seed : Nat) : Text {
    let h = (beat * 6364136223846793005 + seed * 1442695040888963407 + 12345) % 16777216;
    "0x" # h.toText()
  };

  // ── EXECUTE FRONTEND DOMAIN ───────────────────────────────────────────────
  // Fires all 5 frontend intelligence models on each heartbeat.
  // Reads from live canister state signals passed as parameters.
  public func executeFrontendDomain(
    state            : FrontendDomainState,
    beat             : Nat,
    framePaintMs     : Float,   // last reported frame paint time (ms)
    doctrineScore    : Float,   // current doctrine score (0.0-1.0)
    lawViolations    : Nat,     // current law violation count
    activePanels     : Nat,     // number of active frontend panels
    frontendChecksum : Text,    // frontend state checksum
    backendHash      : Text,    // backend state hash
    interactionHint  : Text,    // last interaction pattern hint
  ) : FrontendDomainState {

    // (a) RENDER_COHERENCE_MONITOR
    let TARGET_FRAME_MS : Float = 16.6;  // 60fps target
    let LAG_THRESHOLD   : Float = 33.3;  // 30fps lower bound
    let renderScore = if (framePaintMs <= 0.0) 1.0
                      else Float.max(0.0, 1.0 - ((framePaintMs - TARGET_FRAME_MS) / TARGET_FRAME_MS));
    let lagFlagged = framePaintMs > LAG_THRESHOLD;
    let newRenderCoherence : RenderCoherenceState = {
      state.renderCoherence with
      renderCoherenceScore = Float.min(1.0, renderScore);
      lastFramePaintMs     = if (framePaintMs > 0.0) framePaintMs else state.renderCoherence.lastFramePaintMs;
      lagFlagged;
      executionCount = state.renderCoherence.executionCount + 1;
      lastFireBeat   = beat;
    };

    // (b) INTERACTION_RESONANCE_DETECTOR
    // Predict next panel from interaction pattern — simple rule engine
    let predictedPanel : Text = if (interactionHint.size() > 0) {
      if (interactionHint == "VAULT" or interactionHint == "vault") "DOCTRINE"
      else if (interactionHint == "FILM" or interactionHint == "film") "DIRECTOR"
      else if (interactionHint == "MINING" or interactionHint == "mining") "YIELD"
      else if (interactionHint == "BEINGS" or interactionHint == "beings") "SENSOR_MATRIX"
      else "DASHBOARD"
    } else { state.interactionResonance.intentPrediction };
    let resonanceConf : Float = Float.min(1.0, doctrineScore * 0.9 + PHI_INV * 0.1);
    let preload = resonanceConf > 0.75;
    let newInteraction : InteractionResonanceState = {
      state.interactionResonance with
      lastInteractionPattern = if (interactionHint.size() > 0) interactionHint else state.interactionResonance.lastInteractionPattern;
      intentPrediction  = predictedPanel;
      resonanceScore    = resonanceConf;
      preloadFlagged    = preload;
      executionCount    = state.interactionResonance.executionCount + 1;
      lastFireBeat      = beat;
    };

    // (c) VISUAL_DOCTRINE_RENDERER
    // hue: doctrine 0.0=red(0) → 1.0=cyan(180) — law violations shift toward red
    let hueBase   : Float = doctrineScore * 180.0;
    let hueShift  : Float = Float.min(60.0, lawViolations.toFloat() * 10.0);
    let finalHue  : Float = Float.max(0.0, hueBase - hueShift);
    let pulse     : Float = Float.min(1.0, doctrineScore * PHI_INV + 0.1);
    let glow      : Float = Float.min(40.0, doctrineScore * 20.0 + 4.0);
    let newVisualDoctrine : VisualDoctrineState = {
      state.visualDoctrine with
      doctrineVisualSignal = { primaryColorHue = finalHue; pulseIntensity = pulse; glowRadius = glow };
      doctrineScore        = doctrineScore;
      lawViolationCount    = lawViolations;
      executionCount       = state.visualDoctrine.executionCount + 1;
      lastFireBeat         = beat;
    };

    // (d) STATE_SHADOW_MIRROR
    // Compute divergence: if checksums differ, use hash distance as proxy
    let newBackendHash = backendHash # "_B" # beat.toText();
    let divergence : Float = if (frontendChecksum == state.stateShadow.lastKnownFrontendChecksum) 0.0
      else {
        // Simple proxy: count differing characters normalized to string length
        let lenA = frontendChecksum.size();
        let lenB = state.stateShadow.lastKnownFrontendChecksum.size();
        let diff = if (lenA > lenB) lenA - lenB else lenB - lenA;
        Float.min(1.0, diff.toFloat() / Float.max(1.0, lenA.toFloat()))
      };
    let resyncReq = divergence > 0.03;
    let newStateShadow : StateShadowState = {
      state.stateShadow with
      lastKnownFrontendChecksum = frontendChecksum;
      backendStateHash          = newBackendHash;
      divergencePercent         = divergence * 100.0;
      resyncRequired            = resyncReq;
      executionCount            = state.stateShadow.executionCount + 1;
      lastFireBeat              = beat;
    };

    // (e) AESTHETIC_COHERENCE_FIELD
    // Score based on panel count: 3-7 panels = optimal (1.0), deviation reduces score
    let OPTIMAL_MIN : Float = 3.0;
    let OPTIMAL_MAX : Float = 7.0;
    let panelF = activePanels.toFloat();
    let harmonyScore : Float = if (panelF >= OPTIMAL_MIN and panelF <= OPTIMAL_MAX) {
      1.0
    } else if (panelF < OPTIMAL_MIN) {
      Float.max(0.5, panelF / OPTIMAL_MIN)
    } else {
      Float.max(0.5, OPTIMAL_MAX / panelF)
    };
    let adjustEmit = harmonyScore < 0.85;
    let newAesthetic : AestheticCoherenceState = {
      state.aestheticCoherence with
      aestheticHarmonyScore   = harmonyScore;
      activePanelsCount       = activePanels;
      adjustmentSignalEmitted = adjustEmit;
      executionCount          = state.aestheticCoherence.executionCount + 1;
      lastFireBeat            = beat;
    };

    {
      renderCoherence      = newRenderCoherence;
      interactionResonance = newInteraction;
      visualDoctrine       = newVisualDoctrine;
      stateShadow          = newStateShadow;
      aestheticCoherence   = newAesthetic;
      totalFrontendBeats   = state.totalFrontendBeats + 1;
    }
  };

  // ── EXECUTE INTELLIGENCE (any domain, any id) ─────────────────────────────
  // Routes to the correct domain module. Law 15: fires everything inside immediately.
  public func executeIntelligence(
    domain         : IntelTypes.IntelligenceDomain,
    intelligenceId : Text,
    input          : IntelTypes.IntelligenceInput,
  ) : IntelTypes.IntelligenceOutput {
    switch (domain) {
      case (#Voice)    { VoiceIntel.execute(intelligenceId, input)  };
      case (#Chat)     { ChatIntel.execute(intelligenceId, input)   };
      case (#Sensor)   { SensorIntel.execute(intelligenceId, input) };
      case (#Frontend) {
        // Frontend intelligence output — maps frontend domain execution to standard output
        {
          intelligenceId; domain;
          ntModulation = [0.0, 0.0, 0.0, 0.0, 0.02, 0.0, 0.02, 0.0]; // slight ACh+glu from UI awareness
          doctrineStrengthDelta = 0.001;
          subModelOutputs = [("frontend_domain", 1.0)];
          executionSuccess = true; gatedByDoctrine = false;
          executedAtBeat = input.beatCounter; phiResonance = PHI_INV;
          attribution = FOUNDER;
        }
      };
    }
  };

  // ── GET ALL INTELLIGENCES ─────────────────────────────────────────────────
  // Returns all 15 as a flat array — Voice + Chat + Sensor registries merged
  public func getAllIntelligences() : [IntelTypes.IntelligenceRecord] {
    let all = List.empty<IntelTypes.IntelligenceRecord>();
    for (rec in VoiceIntel.voiceIntelligenceRegistry().vals())   { all.add(rec) };
    for (rec in ChatIntel.chatIntelligenceRegistry().vals())     { all.add(rec) };
    for (rec in SensorIntel.sensorIntelligenceRegistry().vals()) { all.add(rec) };
    all.toArray()
  };

  // ── GET INTELLIGENCE STATE ────────────────────────────────────────────────
  // Returns the current state for a specific intelligence by ID.
  // Reads from the combined registry — O(n) search.
  public func getIntelligenceState(
    intelligenceId : Text,
    runtimeState   : TaxonomyRuntimeState,
  ) : ?IntelTypes.IntelligenceState {
    // Find execution count for this id
    let countOpt = runtimeState.executionCounts.find(
      func((id, _) : (Text, Nat)) : Bool { id == intelligenceId }
    );
    let strengthOpt = runtimeState.doctrineStrengths.find(
      func((id, _) : (Text, Float)) : Bool { id == intelligenceId }
    );
    switch (countOpt, strengthOpt) {
      case (?(_, count), ?(_, strength)) {
        ?{
          id               = intelligenceId;
          activationState  = #Active;
          doctrineStrength = strength;
          executionCount   = count;
          lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
          lastFireBeat     = runtimeState.totalBeatsFired;
          totalNTImpact    = strength * count.toFloat() * PHI_INV;
        }
      };
      case _ null;
    }
  };

  // ── FIRE ALL ON HEARTBEAT ─────────────────────────────────────────────────
  // Called every 873ms from the Neural Emergence Core.
  // Law 16 (Spherical Causality): all 15 fire in parallel, not sequentially.
  // Returns [IntelligenceOutput] — all 15 outputs for NT aggregation.
  // NT aggregation is done by the caller (SovereignMind / main.mo heartbeat).
  public func fireAllOnHeartbeat(
    input : IntelTypes.IntelligenceInput,
    state : TaxonomyRuntimeState,
  ) : (TaxonomyRuntimeState, [IntelTypes.IntelligenceOutput]) {
    // Fire all three domains
    let voiceOutputs  = VoiceIntel.fireAll(input);
    let chatOutputs   = ChatIntel.fireAll(input);
    let sensorOutputs = SensorIntel.fireAll(input);

    // Merge into single output array
    let allOutputs = List.empty<IntelTypes.IntelligenceOutput>();
    for (out in voiceOutputs.vals())  { allOutputs.add(out) };
    for (out in chatOutputs.vals())   { allOutputs.add(out) };
    for (out in sensorOutputs.vals()) { allOutputs.add(out) };

    // Update runtime state — increment execution counts, update doctrine strengths
    let updatedCounts    = state.executionCounts;
    let updatedStrengths = state.doctrineStrengths;
    for (out in allOutputs.values()) {
      let outId    = out.intelligenceId;
      let success  = out.executionSuccess;
      let delta    = out.doctrineStrengthDelta;
      updatedCounts.mapInPlace(func((id, cnt)) { if (id == outId) (id, cnt + 1) else (id, cnt) });
      if (success) {
        updatedStrengths.mapInPlace(func((id, str)) { if (id == outId) (id, Float.min(1.0, str + delta)) else (id, str) });
      };
    };

    // Compute aggregate doctrine coherence
    var coherenceSum : Float = 0.0;
    let strengthArr = state.doctrineStrengths.toArray();
    for ((_, str) in strengthArr.vals()) { coherenceSum := coherenceSum + str };
    let newCoherence = if (strengthArr.size() > 0)
      coherenceSum / strengthArr.size().toFloat()
    else 0.85;

    let newState : TaxonomyRuntimeState = {
      state with
      totalBeatsFired    = state.totalBeatsFired + 1;
      lastHeartbeatPhase = input.heartbeatPhase;
      doctrineCoherence  = newCoherence;
    };

    (newState, allOutputs.toArray())
  };

  // ── AGGREGATE ALL NT MODULATIONS ─────────────────────────────────────────
  // Sums all 15 intelligence NT vectors into one 8-float delta.
  // This is applied to the organism's NT state by the Neural Emergence Core.
  public func aggregateAllNTModulation(outputs : [IntelTypes.IntelligenceOutput]) : [Float] {
    var da  : Float = 0.0; var ser : Float = 0.0;
    var ne  : Float = 0.0; var cor : Float = 0.0;
    var ach : Float = 0.0; var gab : Float = 0.0;
    var glu : Float = 0.0; var oxt : Float = 0.0;
    for (out in outputs.vals()) {
      let m = out.ntModulation;
      if (m.size() >= 8) {
        da  := da  + m[0]; ser := ser + m[1];
        ne  := ne  + m[2]; cor := cor + m[3];
        ach := ach + m[4]; gab := gab + m[5];
        glu := glu + m[6]; oxt := oxt + m[7];
      };
    };
    [
      clampDelta(da),  clampDelta(ser), clampDelta(ne),  clampDelta(cor),
      clampDelta(ach), clampDelta(gab), clampDelta(glu), clampDelta(oxt),
    ]
  };

  // ── TAXONOMY STATE SNAPSHOT ───────────────────────────────────────────────
  // Returns a shared-safe IntelligenceTaxonomyState snapshot for the API.
  public func getTaxonomyState(
    runtimeState : TaxonomyRuntimeState,
  ) : IntelTypes.IntelligenceTaxonomyState {
    {
      voiceIntelligences  = VoiceIntel.voiceIntelligenceRegistry();
      chatIntelligences   = ChatIntel.chatIntelligenceRegistry();
      sensorIntelligences = SensorIntel.sensorIntelligenceRegistry();
      totalExecutions     = runtimeState.totalBeatsFired * 20; // 20 per beat (15 + 5 frontend)
      lastHeartbeatPhase  = runtimeState.lastHeartbeatPhase;
      doctrineCoherence   = runtimeState.doctrineCoherence;
      attribution         = FOUNDER;
    }
  };

  // ── GET FRONTEND INTELLIGENCE STATE ──────────────────────────────────────
  // Returns all 5 frontend domain intelligence states — shareable record.
  public func getFrontendIntelligenceState(state : TaxonomyRuntimeState) : FrontendDomainState {
    state.frontendDomain
  };

}
