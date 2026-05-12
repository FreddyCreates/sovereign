// lib/emotionalEngine.mo
// ANIMUS SOVEREIGN — The Emotional Engine Implementation
// "Emotions are not reactions. They are PHI-weighted resonance fields."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";

import EETypes "../types/emotionalEngine";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let PHI2      : Float = 2.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;
  let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Fibonacci weights for emotions
  let FIB_WEIGHTS : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0];

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState(seed : Nat) : EETypes.EmotionalEngineState {
    let initialEmotions : [EETypes.EmotionState] = [
      { emotion = #GAUDIUM; intensity = 0.5; velocity = 0.0; baselineIntensity = 0.5; peakIntensity = 0.5; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = true },
      { emotion = #FIDUCIA; intensity = 0.5; velocity = 0.0; baselineIntensity = 0.5; peakIntensity = 0.5; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = true },
      { emotion = #TIMOR; intensity = 0.2; velocity = 0.0; baselineIntensity = 0.2; peakIntensity = 0.2; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = false },
      { emotion = #ADMIRATIO; intensity = 0.3; velocity = 0.0; baselineIntensity = 0.3; peakIntensity = 0.3; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = false },
      { emotion = #TRISTITIA; intensity = 0.1; velocity = 0.0; baselineIntensity = 0.1; peakIntensity = 0.1; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = false },
      { emotion = #FASTIDIUM; intensity = 0.1; velocity = 0.0; baselineIntensity = 0.1; peakIntensity = 0.1; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = false },
      { emotion = #IRA; intensity = 0.1; velocity = 0.0; baselineIntensity = 0.1; peakIntensity = 0.1; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = false },
      { emotion = #ANTICIPATIO; intensity = 0.4; velocity = 0.0; baselineIntensity = 0.4; peakIntensity = 0.4; lastPeakBeat = 0; triggerCount = 0; suppressionCount = 0; isActive = true },
    ];

    let initialMood : EETypes.MoodState = {
      currentMood = #EUTHYMIA;
      moodIntensity = 0.5;
      moodStability = 0.8;
      moodStartBeat = 0;
      moodDuration = 0;
      previousMood = #EUTHYMIA;
      moodHistory = [];
      averageValence = 0.0;
      averageArousal = 0.5;
    };

    let initialEmpathy : EETypes.EmpathyMatrixState = {
      links = [];
      totalResonance = 0.0;
      averageSynchronization = 0.0;
      activeLinks = 0;
      nextLinkId = 0;
    };

    let initialRegulation : EETypes.RegulationState = {
      activeStrategies = [];
      regulationEffort = 0.0;
      suppressedEmotions = [];
      amplifiedEmotions = [];
      homeostasisScore = 1.0;
      regulationCapacity = 1.0;
      lastRegulationBeat = 0;
    };

    {
      engineId = "ANIMUS_SOVEREIGN_" # Nat.toText(seed);
      founderLock = FOUNDER;
      genesisBeat = 0;
      currentBeat = 0;
      emotions = initialEmotions;
      dominantEmotion = #GAUDIUM;
      overallValence = 0.2;
      overallArousal = 0.5;
      activeBlends = [];
      blendHistory = [];
      nextBlendId = 0;
      mood = initialMood;
      empathy = initialEmpathy;
      regulation = initialRegulation;
      emotionalCoherence = 1.0;
      emotionalFlexibility = 0.8;
      emotionalResilience = 0.8;
      expressionBalance = 0.5;
      lastHeartbeatBeat = 0;
      heartbeatCount = 0;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. EMOTION UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  // Get emotion name in Latin
  public func emotionName(emotion : EETypes.PrimaryEmotion) : Text {
    switch (emotion) {
      case (#GAUDIUM) { "GAUDIUM" };
      case (#FIDUCIA) { "FIDUCIA" };
      case (#TIMOR) { "TIMOR" };
      case (#ADMIRATIO) { "ADMIRATIO" };
      case (#TRISTITIA) { "TRISTITIA" };
      case (#FASTIDIUM) { "FASTIDIUM" };
      case (#IRA) { "IRA" };
      case (#ANTICIPATIO) { "ANTICIPATIO" };
    };
  };

  // Get emotion index (0-7)
  public func emotionIndex(emotion : EETypes.PrimaryEmotion) : Nat {
    switch (emotion) {
      case (#GAUDIUM) { 0 };
      case (#FIDUCIA) { 1 };
      case (#TIMOR) { 2 };
      case (#ADMIRATIO) { 3 };
      case (#TRISTITIA) { 4 };
      case (#FASTIDIUM) { 5 };
      case (#IRA) { 6 };
      case (#ANTICIPATIO) { 7 };
    };
  };

  // Get emotion from index
  public func emotionFromIndex(idx : Nat) : EETypes.PrimaryEmotion {
    switch (idx % 8) {
      case 0 { #GAUDIUM };
      case 1 { #FIDUCIA };
      case 2 { #TIMOR };
      case 3 { #ADMIRATIO };
      case 4 { #TRISTITIA };
      case 5 { #FASTIDIUM };
      case 6 { #IRA };
      case _ { #ANTICIPATIO };
    };
  };

  // Get Fibonacci weight for emotion
  public func emotionWeight(emotion : EETypes.PrimaryEmotion) : Float {
    FIB_WEIGHTS[emotionIndex(emotion)];
  };

  // Get valence contribution (-1 to 1)
  public func emotionValence(emotion : EETypes.PrimaryEmotion) : Float {
    switch (emotion) {
      case (#GAUDIUM) { 1.0 };       // Positive
      case (#FIDUCIA) { 0.8 };       // Positive
      case (#TIMOR) { -0.6 };        // Negative
      case (#ADMIRATIO) { 0.3 };     // Slightly positive
      case (#TRISTITIA) { -0.8 };    // Negative
      case (#FASTIDIUM) { -0.7 };    // Negative
      case (#IRA) { -0.5 };          // Negative
      case (#ANTICIPATIO) { 0.6 };   // Positive
    };
  };

  // Get arousal contribution (0 to 1)
  public func emotionArousal(emotion : EETypes.PrimaryEmotion) : Float {
    switch (emotion) {
      case (#GAUDIUM) { 0.7 };
      case (#FIDUCIA) { 0.3 };
      case (#TIMOR) { 0.8 };
      case (#ADMIRATIO) { 0.9 };
      case (#TRISTITIA) { 0.2 };
      case (#FASTIDIUM) { 0.5 };
      case (#IRA) { 0.9 };
      case (#ANTICIPATIO) { 0.6 };
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. EMOTION MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Trigger an emotion with specified intensity
  public func triggerEmotion(
    state : EETypes.EmotionalEngineState,
    emotion : EETypes.PrimaryEmotion,
    intensity : Float,
    beat : Nat
  ) : EETypes.EmotionalEngineState {
    let idx = emotionIndex(emotion);
    var updatedEmotions = Buffer.Buffer<EETypes.EmotionState>(8);

    for (i in Iter.range(0, 7)) {
      let e = state.emotions[i];
      if (i == idx) {
        let newIntensity = Float.min(1.0, Float.max(0.0, intensity));
        let newPeak = Float.max(e.peakIntensity, newIntensity);
        updatedEmotions.add({
          e with
          intensity = newIntensity;
          velocity = newIntensity - e.intensity;
          peakIntensity = newPeak;
          lastPeakBeat = if (newIntensity >= newPeak) { beat } else { e.lastPeakBeat };
          triggerCount = e.triggerCount + 1;
          isActive = newIntensity > 0.2;
        });
      } else {
        updatedEmotions.add(e);
      };
    };

    let newEmotions = Buffer.toArray(updatedEmotions);
    let (newValence, newArousal) = calculateValenceArousal(newEmotions);
    let newDominant = findDominantEmotion(newEmotions);

    {
      state with
      emotions = newEmotions;
      dominantEmotion = newDominant;
      overallValence = newValence;
      overallArousal = newArousal;
    };
  };

  // Calculate overall valence and arousal
  func calculateValenceArousal(emotions : [EETypes.EmotionState]) : (Float, Float) {
    var totalValence : Float = 0.0;
    var totalArousal : Float = 0.0;
    var totalWeight : Float = 0.0;

    for (e in emotions.vals()) {
      let weight = emotionWeight(e.emotion) * e.intensity;
      totalValence += emotionValence(e.emotion) * weight;
      totalArousal += emotionArousal(e.emotion) * weight;
      totalWeight += weight;
    };

    if (totalWeight > 0.0) {
      (totalValence / totalWeight, totalArousal / totalWeight);
    } else {
      (0.0, 0.5);
    };
  };

  // Find the dominant emotion
  func findDominantEmotion(emotions : [EETypes.EmotionState]) : EETypes.PrimaryEmotion {
    var maxIntensity : Float = 0.0;
    var dominant : EETypes.PrimaryEmotion = #GAUDIUM;

    for (e in emotions.vals()) {
      let weighted = e.intensity * emotionWeight(e.emotion);
      if (weighted > maxIntensity) {
        maxIntensity := weighted;
        dominant := e.emotion;
      };
    };

    dominant;
  };

  // Decay emotions toward baseline
  public func decayEmotions(state : EETypes.EmotionalEngineState, decayRate : Float) : [EETypes.EmotionState] {
    var updated = Buffer.Buffer<EETypes.EmotionState>(8);

    for (e in state.emotions.vals()) {
      let diff = e.intensity - e.baselineIntensity;
      let newIntensity = e.baselineIntensity + diff * (1.0 - decayRate);
      updated.add({
        e with
        intensity = newIntensity;
        velocity = newIntensity - e.intensity;
        isActive = newIntensity > 0.2;
      });
    };

    Buffer.toArray(updated);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. BLEND MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get blend name
  public func blendName(blend : EETypes.BlendType) : Text {
    switch (blend) {
      case (#AMOR) { "AMOR" };
      case (#SUBMISSIO) { "SUBMISSIO" };
      case (#PAVOR) { "PAVOR" };
      case (#INDIGNATIO) { "INDIGNATIO" };
      case (#REMORSUM) { "REMORSUM" };
      case (#CONTEMPTUS) { "CONTEMPTUS" };
      case (#AGGRESSIO) { "AGGRESSIO" };
      case (#SPES) { "SPES" };
      case (#AMBIVALENTIA) { "AMBIVALENTIA" };
      case (#CONFLICTUS) { "CONFLICTUS" };
      case (#SUSPICIO) { "SUSPICIO" };
      case (#CONFUSIO) { "CONFUSIO" };
    };
  };

  // Get blend components
  public func blendComponents(blend : EETypes.BlendType) : (EETypes.PrimaryEmotion, EETypes.PrimaryEmotion) {
    switch (blend) {
      case (#AMOR) { (#GAUDIUM, #FIDUCIA) };
      case (#SUBMISSIO) { (#FIDUCIA, #TIMOR) };
      case (#PAVOR) { (#TIMOR, #ADMIRATIO) };
      case (#INDIGNATIO) { (#ADMIRATIO, #TRISTITIA) };
      case (#REMORSUM) { (#TRISTITIA, #FASTIDIUM) };
      case (#CONTEMPTUS) { (#FASTIDIUM, #IRA) };
      case (#AGGRESSIO) { (#IRA, #ANTICIPATIO) };
      case (#SPES) { (#ANTICIPATIO, #GAUDIUM) };
      case (#AMBIVALENTIA) { (#GAUDIUM, #TRISTITIA) };
      case (#CONFLICTUS) { (#FIDUCIA, #FASTIDIUM) };
      case (#SUSPICIO) { (#TIMOR, #IRA) };
      case (#CONFUSIO) { (#ADMIRATIO, #ANTICIPATIO) };
    };
  };

  // Detect active blends based on emotion intensities
  public func detectBlends(state : EETypes.EmotionalEngineState, beat : Nat) : [EETypes.BlendState] {
    var blends = Buffer.Buffer<EETypes.BlendState>(4);
    let threshold : Float = 0.3;  // Both emotions must be above this

    // Check each possible blend
    let blendTypes : [EETypes.BlendType] = [#AMOR, #SUBMISSIO, #PAVOR, #INDIGNATIO, #REMORSUM, #CONTEMPTUS, #AGGRESSIO, #SPES, #AMBIVALENTIA, #CONFLICTUS, #SUSPICIO, #CONFUSIO];

    for (blendType in blendTypes.vals()) {
      let (e1, e2) = blendComponents(blendType);
      let idx1 = emotionIndex(e1);
      let idx2 = emotionIndex(e2);
      let intensity1 = state.emotions[idx1].intensity;
      let intensity2 = state.emotions[idx2].intensity;

      if (intensity1 > threshold and intensity2 > threshold) {
        let blendIntensity = (intensity1 + intensity2) / 2.0;
        let ratio = intensity1 / (intensity1 + intensity2);
        blends.add({
          blend = blendType;
          intensity = blendIntensity;
          components = (e1, e2);
          componentRatio = ratio;
          stability = Float.min(intensity1, intensity2) / Float.max(intensity1, intensity2);
          formationBeat = beat;
          durationBeats = 0;
        });
      };
    };

    Buffer.toArray(blends);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. MOOD MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get mood name
  public func moodName(mood : EETypes.MoodCategory) : Text {
    switch (mood) {
      case (#SERENITAS) { "SERENITAS" };
      case (#LAETITIA) { "LAETITIA" };
      case (#MELANCHOLIA) { "MELANCHOLIA" };
      case (#ANXIETAS) { "ANXIETAS" };
      case (#IRACUNDIA) { "IRACUNDIA" };
      case (#APATHIA) { "APATHIA" };
      case (#EUTHYMIA) { "EUTHYMIA" };
      case (#EXALTATIO) { "EXALTATIO" };
    };
  };

  // Determine mood from valence and arousal
  public func determineMood(valence : Float, arousal : Float) : EETypes.MoodCategory {
    // Quadrant-based mood mapping
    if (valence > 0.3) {
      if (arousal > 0.6) { #EXALTATIO }
      else if (arousal > 0.3) { #LAETITIA }
      else { #SERENITAS };
    } else if (valence < -0.3) {
      if (arousal > 0.6) { #ANXIETAS }
      else if (arousal > 0.3) { #MELANCHOLIA }
      else { #APATHIA };
    } else {
      if (arousal > 0.6) { #IRACUNDIA }
      else { #EUTHYMIA };
    };
  };

  // Update mood based on current emotional state
  public func updateMood(state : EETypes.EmotionalEngineState, beat : Nat) : EETypes.MoodState {
    let targetMood = determineMood(state.overallValence, state.overallArousal);
    let currentMood = state.mood.currentMood;

    // Mood has inertia — doesn't change instantly
    let inertia : Float = 0.95;
    let newValence = state.mood.averageValence * inertia + state.overallValence * (1.0 - inertia);
    let newArousal = state.mood.averageArousal * inertia + state.overallArousal * (1.0 - inertia);

    if (targetMood != currentMood and state.mood.moodDuration > 89) {
      // Mood transition after sustained difference (89 beats — Fibonacci)
      let transition : EETypes.MoodTransition = {
        fromMood = currentMood;
        toMood = targetMood;
        beat = beat;
        trigger = "Sustained valence/arousal shift";
        intensity = Float.abs(state.overallValence - newValence) + Float.abs(state.overallArousal - newArousal);
      };

      let historyBuf = Buffer.Buffer<EETypes.MoodTransition>(8);
      historyBuf.add(transition);
      for (t in state.mood.moodHistory.vals()) {
        if (historyBuf.size() < 8) {
          historyBuf.add(t);
        };
      };

      {
        currentMood = targetMood;
        moodIntensity = (Float.abs(newValence) + newArousal) / 2.0;
        moodStability = 0.5;  // Just transitioned, stability low
        moodStartBeat = beat;
        moodDuration = 0;
        previousMood = currentMood;
        moodHistory = Buffer.toArray(historyBuf);
        averageValence = newValence;
        averageArousal = newArousal;
      };
    } else {
      // Mood persists, stability increases
      {
        state.mood with
        moodDuration = state.mood.moodDuration + 1;
        moodStability = Float.min(1.0, state.mood.moodStability + 0.001);
        averageValence = newValence;
        averageArousal = newArousal;
      };
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. EMPATHY MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Create a new empathy link
  public func createEmpathyLink(
    state : EETypes.EmotionalEngineState,
    targetEntityId : Text,
    linkType : EETypes.EmpathyType,
    beat : Nat
  ) : (EETypes.EmotionalEngineState, EETypes.EmpathyLink) {
    let newLink : EETypes.EmpathyLink = {
      linkId = state.empathy.nextLinkId;
      targetEntityId = targetEntityId;
      resonanceStrength = PHI_INV;  // Start with golden ratio connection
      synchronization = 0.5;
      linkType = linkType;
      formationBeat = beat;
      lastInteractionBeat = beat;
      interactionCount = 1;
      trustLevel = 0.5;
    };

    let newLinks = Array.append(state.empathy.links, [newLink]);
    let newEmpathy : EETypes.EmpathyMatrixState = {
      links = newLinks;
      totalResonance = state.empathy.totalResonance + newLink.resonanceStrength;
      averageSynchronization = (state.empathy.averageSynchronization * Float.fromInt(state.empathy.links.size()) + newLink.synchronization) / Float.fromInt(newLinks.size());
      activeLinks = state.empathy.activeLinks + 1;
      nextLinkId = state.empathy.nextLinkId + 1;
    };

    ({ state with empathy = newEmpathy }, newLink);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. REGULATION MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Apply a regulation strategy
  public func applyRegulation(
    state : EETypes.EmotionalEngineState,
    strategy : EETypes.RegulationStrategy,
    beat : Nat
  ) : EETypes.EmotionalEngineState {
    let effort : Float = switch (strategy) {
      case (#SUPPRESSION) { 0.3 };
      case (#REAPPRAISAL) { 0.2 };
      case (#EXPRESSION) { 0.15 };
      case (#DISTRACTION) { 0.1 };
      case (#ACCEPTANCE) { 0.05 };
      case (#AMPLIFICATION) { 0.2 };
    };

    let newRegulation : EETypes.RegulationState = {
      activeStrategies = Array.append(state.regulation.activeStrategies, [strategy]);
      regulationEffort = Float.min(1.0, state.regulation.regulationEffort + effort);
      suppressedEmotions = state.regulation.suppressedEmotions;
      amplifiedEmotions = state.regulation.amplifiedEmotions;
      homeostasisScore = state.regulation.homeostasisScore;
      regulationCapacity = Float.max(0.0, state.regulation.regulationCapacity - effort);
      lastRegulationBeat = beat;
    };

    { state with regulation = newRegulation };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. HEARTBEAT ADVANCE
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceHeartbeat(state : EETypes.EmotionalEngineState, beat : Nat) : EETypes.EmotionalEngineState {
    // 1. Decay emotions toward baseline
    let decayedEmotions = decayEmotions(state, 0.01);
    let stateWithDecay = { state with emotions = decayedEmotions };

    // 2. Recalculate valence and arousal
    let (newValence, newArousal) = calculateValenceArousal(decayedEmotions);
    let newDominant = findDominantEmotion(decayedEmotions);

    // 3. Detect emotional blends
    let newBlends = detectBlends(stateWithDecay, beat);

    // 4. Update mood
    let tempState = {
      stateWithDecay with
      overallValence = newValence;
      overallArousal = newArousal;
    };
    let newMood = updateMood(tempState, beat);

    // 5. Restore regulation capacity
    let restoredCapacity = Float.min(1.0, state.regulation.regulationCapacity + 0.001);
    let newRegulation = { state.regulation with regulationCapacity = restoredCapacity };

    // 6. Calculate emotional coherence
    let emotionalCoherence = calculateCoherence(decayedEmotions);

    {
      state with
      currentBeat = beat;
      emotions = decayedEmotions;
      dominantEmotion = newDominant;
      overallValence = newValence;
      overallArousal = newArousal;
      activeBlends = newBlends;
      mood = newMood;
      regulation = newRegulation;
      emotionalCoherence = emotionalCoherence;
      lastHeartbeatBeat = beat;
      heartbeatCount = state.heartbeatCount + 1;
    };
  };

  // Calculate emotional coherence
  func calculateCoherence(emotions : [EETypes.EmotionState]) : Float {
    var activeCount : Nat = 0;
    var totalIntensity : Float = 0.0;

    for (e in emotions.vals()) {
      if (e.isActive) {
        activeCount += 1;
        totalIntensity += e.intensity;
      };
    };

    // Coherence is higher when fewer emotions are active at high intensity
    // (focused emotional state = coherent)
    if (activeCount == 0) {
      1.0;
    } else {
      let avgIntensity = totalIntensity / Float.fromInt(activeCount);
      let focusFactor = 1.0 - (Float.fromInt(activeCount) / 8.0);
      (focusFactor * PHI + avgIntensity) / PHI2;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. QUERY OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getEmotionState(state : EETypes.EmotionalEngineState, emotion : EETypes.PrimaryEmotion) : EETypes.EmotionState {
    state.emotions[emotionIndex(emotion)];
  };

  public func getActiveEmotions(state : EETypes.EmotionalEngineState) : [EETypes.EmotionState] {
    Array.filter<EETypes.EmotionState>(state.emotions, func(e) { e.isActive });
  };

  public func getEmotionalStatus(state : EETypes.EmotionalEngineState) : Text {
    let dominant = emotionName(state.dominantEmotion);
    let mood = moodName(state.mood.currentMood);
    let valenceLabel = if (state.overallValence > 0.3) { "POSITIVE" } else if (state.overallValence < -0.3) { "NEGATIVE" } else { "NEUTRAL" };
    let arousalLabel = if (state.overallArousal > 0.6) { "HIGH" } else if (state.overallArousal < 0.3) { "LOW" } else { "MODERATE" };

    "ANIMUS: Dominant=" # dominant # " Mood=" # mood # " Valence=" # valenceLabel # " Arousal=" # arousalLabel # " Coherence=" # Float.toText(state.emotionalCoherence);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // X. SERIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func toStableState(state : EETypes.EmotionalEngineState) : EETypes.EmotionalEngineState {
    state;
  };

  public func fromStableState(stable : EETypes.EmotionalEngineState) : EETypes.EmotionalEngineState {
    stable;
  };

};
