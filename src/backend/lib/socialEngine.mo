// lib/socialEngine.mo
// SOCIETAS SOVEREIGN — The Social Engine Implementation
// "Society is not a crowd. It is PHI-structured resonance between beings."
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

import SoETypes "../types/socialEngine";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let PHI2      : Float = 2.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;
  let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Fibonacci depth scores
  let DEPTH_SCORES : [Float] = [0.1, 0.2, 0.3, 0.5, 0.8, 1.0];

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState(seed : Nat) : SoETypes.SocialEngineState {
    let initialReputation : SoETypes.ReputationProfile = {
      entityId = "SELF_" # Nat.toText(seed);
      scores = [
        { dimension = #FIDES; score = 0.5; confidence = 0.5; evidenceCount = 0; lastUpdateBeat = 0 },
        { dimension = #COMPETENTIA; score = 0.5; confidence = 0.5; evidenceCount = 0; lastUpdateBeat = 0 },
        { dimension = #BENEVOLENTIA; score = 0.5; confidence = 0.5; evidenceCount = 0; lastUpdateBeat = 0 },
        { dimension = #INTEGRITAS; score = 0.5; confidence = 0.5; evidenceCount = 0; lastUpdateBeat = 0 },
        { dimension = #AUCTORITAS; score = 0.5; confidence = 0.5; evidenceCount = 0; lastUpdateBeat = 0 },
        { dimension = #GRATIA; score = 0.5; confidence = 0.5; evidenceCount = 0; lastUpdateBeat = 0 },
      ];
      overallReputation = 0.5;
      reputationRank = #NOTUS;
      historyEvents = [];
      nextEventId = 0;
    };

    let initialInfluence : SoETypes.InfluenceState = {
      baseInfluence = 0.5;
      currentReach = PHI;
      activeEffects = [];
      historyRecords = [];
      nextInfluenceId = 0;
      resistanceLevel = 0.5;
    };

    let initialCommunication : SoETypes.CommunicationState = {
      inbox = [];
      outbox = [];
      conversations = [];
      totalSent = 0;
      totalReceived = 0;
      nextMessageId = 0;
      nextConversationId = 0;
    };

    {
      engineId = "SOCIETAS_SOVEREIGN_" # Nat.toText(seed);
      founderLock = FOUNDER;
      genesisBeat = 0;
      currentBeat = 0;
      relationships = [];
      activeRelationships = 0;
      nextRelationshipId = 0;
      ownReputation = initialReputation;
      knownReputations = [];
      influence = initialInfluence;
      groups = [];
      memberships = [];
      nextGroupId = 0;
      communication = initialCommunication;
      socialCoherence = 1.0;
      networkDensity = 0.0;
      socialCapital = 0.5;
      isolation = 1.0;
      lastHeartbeatBeat = 0;
      heartbeatCount = 0;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. RELATIONSHIP UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  // Get relationship type name
  public func relationshipTypeName(rt : SoETypes.RelationshipType) : Text {
    switch (rt) {
      case (#AMICITIA) { "AMICITIA" };
      case (#COLLEGIUM) { "COLLEGIUM" };
      case (#FAMILITAS) { "FAMILITAS" };
      case (#MAGISTER) { "MAGISTER" };
      case (#DISCIPULUS) { "DISCIPULUS" };
      case (#SOCIUS) { "SOCIUS" };
      case (#ADVERSARIUS) { "ADVERSARIUS" };
      case (#INIMICUS) { "INIMICUS" };
      case (#COGNITIO) { "COGNITIO" };
      case (#NEXUS) { "NEXUS" };
    };
  };

  // Get depth from score
  public func scoreToDepth(score : Float) : SoETypes.RelationshipDepth {
    if (score < 0.15) { #SURFACE }
    else if (score < 0.25) { #CASUAL }
    else if (score < 0.4) { #REGULAR }
    else if (score < 0.65) { #CLOSE }
    else if (score < 0.9) { #INTIMATE }
    else { #PROFOUND };
  };

  // Get depth name
  public func depthName(depth : SoETypes.RelationshipDepth) : Text {
    switch (depth) {
      case (#SURFACE) { "SURFACE" };
      case (#CASUAL) { "CASUAL" };
      case (#REGULAR) { "REGULAR" };
      case (#CLOSE) { "CLOSE" };
      case (#INTIMATE) { "INTIMATE" };
      case (#PROFOUND) { "PROFOUND" };
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. RELATIONSHIP MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Form a new relationship
  public func formRelationship(
    state : SoETypes.SocialEngineState,
    targetId : Text,
    relType : SoETypes.RelationshipType,
    beat : Nat
  ) : (SoETypes.SocialEngineState, SoETypes.RelationshipRecord) {
    // Check if relationship already exists
    let existing = Array.find<SoETypes.RelationshipRecord>(
      state.relationships,
      func(r) { r.targetEntityId == targetId and r.isActive }
    );

    switch (existing) {
      case (?rel) {
        // Update existing relationship
        (state, rel);
      };
      case null {
        // Create new relationship
        let initialTrust : Float = switch (relType) {
          case (#AMICITIA) { 0.5 };
          case (#COLLEGIUM) { 0.3 };
          case (#FAMILITAS) { 0.7 };
          case (#MAGISTER) { 0.6 };
          case (#DISCIPULUS) { 0.4 };
          case (#SOCIUS) { 0.4 };
          case (#ADVERSARIUS) { -0.2 };
          case (#INIMICUS) { -0.5 };
          case (#COGNITIO) { 0.1 };
          case (#NEXUS) { 0.0 };
        };

        let newRel : SoETypes.RelationshipRecord = {
          relationshipId = state.nextRelationshipId;
          targetEntityId = targetId;
          relationshipType = relType;
          depth = #SURFACE;
          depthScore = 0.1;
          trustLevel = initialTrust;
          affinityScore = 0.5;
          interactionCount = 1;
          lastInteractionBeat = beat;
          formationBeat = beat;
          mutualKnowledge = [];
          sharedExperiences = [];
          isActive = true;
          isMutual = false;
        };

        let newRelationships = Array.append(state.relationships, [newRel]);
        let newState = {
          state with
          relationships = newRelationships;
          activeRelationships = state.activeRelationships + 1;
          nextRelationshipId = state.nextRelationshipId + 1;
          isolation = Float.max(0.0, state.isolation - 0.05);
        };

        (newState, newRel);
      };
    };
  };

  // End a relationship
  public func endRelationship(
    state : SoETypes.SocialEngineState,
    targetId : Text
  ) : SoETypes.SocialEngineState {
    let updatedRels = Array.map<SoETypes.RelationshipRecord, SoETypes.RelationshipRecord>(
      state.relationships,
      func(r) {
        if (r.targetEntityId == targetId and r.isActive) {
          { r with isActive = false };
        } else {
          r;
        };
      }
    );

    {
      state with
      relationships = updatedRels;
      activeRelationships = Nat.max(0, state.activeRelationships - 1);
      isolation = Float.min(1.0, state.isolation + 0.05);
    };
  };

  // Update trust with an entity
  public func updateTrust(
    state : SoETypes.SocialEngineState,
    targetId : Text,
    delta : Float,
    beat : Nat
  ) : SoETypes.SocialEngineState {
    let updatedRels = Array.map<SoETypes.RelationshipRecord, SoETypes.RelationshipRecord>(
      state.relationships,
      func(r) {
        if (r.targetEntityId == targetId and r.isActive) {
          let newTrust = Float.max(-1.0, Float.min(1.0, r.trustLevel + delta));
          let newDepthScore = Float.max(0.0, Float.min(1.0, r.depthScore + Float.abs(delta) * 0.01));
          {
            r with
            trustLevel = newTrust;
            depthScore = newDepthScore;
            depth = scoreToDepth(newDepthScore);
            interactionCount = r.interactionCount + 1;
            lastInteractionBeat = beat;
          };
        } else {
          r;
        };
      }
    );

    { state with relationships = updatedRels };
  };

  // Get relationship with specific entity
  public func getRelationshipWith(
    state : SoETypes.SocialEngineState,
    targetId : Text
  ) : ?SoETypes.RelationshipRecord {
    Array.find<SoETypes.RelationshipRecord>(
      state.relationships,
      func(r) { r.targetEntityId == targetId and r.isActive }
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. REPUTATION MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get reputation rank from score
  public func scoreToRank(score : Float) : SoETypes.ReputationRank {
    if (score < -0.75) { #INFAMIS }
    else if (score < -0.25) { #SUSPECTUS }
    else if (score < 0.1) { #IGNOTUS }
    else if (score < 0.35) { #NOTUS }
    else if (score < 0.55) { #RESPECTUS }
    else if (score < 0.75) { #HONORATUS }
    else if (score < 0.9) { #VENERATUS }
    else { #SANCTUS };
  };

  // Get rank name
  public func rankName(rank : SoETypes.ReputationRank) : Text {
    switch (rank) {
      case (#INFAMIS) { "INFAMIS" };
      case (#SUSPECTUS) { "SUSPECTUS" };
      case (#IGNOTUS) { "IGNOTUS" };
      case (#NOTUS) { "NOTUS" };
      case (#RESPECTUS) { "RESPECTUS" };
      case (#HONORATUS) { "HONORATUS" };
      case (#VENERATUS) { "VENERATUS" };
      case (#SANCTUS) { "SANCTUS" };
    };
  };

  // Update own reputation
  public func updateOwnReputation(
    state : SoETypes.SocialEngineState,
    dimension : SoETypes.ReputationDimension,
    delta : Float,
    source : Text,
    beat : Nat
  ) : SoETypes.SocialEngineState {
    let updatedScores = Array.map<SoETypes.ReputationScore, SoETypes.ReputationScore>(
      state.ownReputation.scores,
      func(s) {
        if (s.dimension == dimension) {
          let newScore = Float.max(-1.0, Float.min(1.0, s.score + delta));
          {
            s with
            score = newScore;
            confidence = Float.min(1.0, s.confidence + 0.01);
            evidenceCount = s.evidenceCount + 1;
            lastUpdateBeat = beat;
          };
        } else {
          s;
        };
      }
    );

    // Calculate overall reputation
    var total : Float = 0.0;
    for (s in updatedScores.vals()) {
      total += s.score;
    };
    let overall = total / 6.0;

    let newEvent : SoETypes.ReputationEvent = {
      eventId = state.ownReputation.nextEventId;
      beat = beat;
      dimension = dimension;
      delta = delta;
      source = source;
      witnessCount = 1;
    };

    let historyBuf = Buffer.Buffer<SoETypes.ReputationEvent>(32);
    historyBuf.add(newEvent);
    for (e in state.ownReputation.historyEvents.vals()) {
      if (historyBuf.size() < 89) {
        historyBuf.add(e);
      };
    };

    let updatedReputation : SoETypes.ReputationProfile = {
      state.ownReputation with
      scores = updatedScores;
      overallReputation = overall;
      reputationRank = scoreToRank(overall);
      historyEvents = Buffer.toArray(historyBuf);
      nextEventId = state.ownReputation.nextEventId + 1;
    };

    { state with ownReputation = updatedReputation };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. GROUP MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get group type name
  public func groupTypeName(gt : SoETypes.GroupType) : Text {
    switch (gt) {
      case (#FAMILIA) { "FAMILIA" };
      case (#COLLEGIUM) { "COLLEGIUM" };
      case (#SODALITAS) { "SODALITAS" };
      case (#FACTIO) { "FACTIO" };
      case (#COMMUNITAS) { "COMMUNITAS" };
      case (#ORDO) { "ORDO" };
      case (#CONCILIUM) { "CONCILIUM" };
      case (#SECRETUM) { "SECRETUM" };
    };
  };

  // Create a new group
  public func createGroup(
    state : SoETypes.SocialEngineState,
    name : Text,
    groupType : SoETypes.GroupType,
    purpose : Text,
    beat : Nat
  ) : (SoETypes.SocialEngineState, SoETypes.GroupRecord) {
    let newGroup : SoETypes.GroupRecord = {
      groupId = state.nextGroupId;
      groupName = name;
      groupType = groupType;
      founderEntityId = state.engineId;
      createdBeat = beat;
      memberCount = 1;
      maxMembers = 144;  // Fibonacci
      cohesion = 1.0;
      influence = 0.1;
      reputation = 0.0;
      purpose = purpose;
      values = [];
      isOpen = true;
      isActive = true;
    };

    let founderMembership : SoETypes.GroupMembership = {
      groupId = state.nextGroupId;
      entityId = state.engineId;
      role = #PRINCEPS;
      joinedBeat = beat;
      standingScore = 1.0;
      contributionCount = 0;
      lastActivityBeat = beat;
      isActive = true;
    };

    let newGroups = Array.append(state.groups, [newGroup]);
    let newMemberships = Array.append(state.memberships, [founderMembership]);

    let newState = {
      state with
      groups = newGroups;
      memberships = newMemberships;
      nextGroupId = state.nextGroupId + 1;
      socialCapital = Float.min(1.0, state.socialCapital + 0.1);
    };

    (newState, newGroup);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. COMMUNICATION
  // ══════════════════════════════════════════════════════════════════════════

  // Get message type name
  public func messageTypeName(mt : SoETypes.MessageType) : Text {
    switch (mt) {
      case (#SALUTATIO) { "SALUTATIO" };
      case (#INTERROGATIO) { "INTERROGATIO" };
      case (#RESPONSIO) { "RESPONSIO" };
      case (#DECLARATIO) { "DECLARATIO" };
      case (#PETITIO) { "PETITIO" };
      case (#OBLATIO) { "OBLATIO" };
      case (#GRATIA) { "GRATIA" };
      case (#EXCUSATIO) { "EXCUSATIO" };
      case (#COMMENDATIO) { "COMMENDATIO" };
      case (#OBIURGATIO) { "OBIURGATIO" };
    };
  };

  // Send a message
  public func sendMessage(
    state : SoETypes.SocialEngineState,
    receiverId : Text,
    messageType : SoETypes.MessageType,
    content : Text,
    beat : Nat
  ) : (SoETypes.SocialEngineState, SoETypes.MessageRecord) {
    let sentiment : Float = switch (messageType) {
      case (#SALUTATIO) { 0.3 };
      case (#INTERROGATIO) { 0.0 };
      case (#RESPONSIO) { 0.1 };
      case (#DECLARATIO) { 0.0 };
      case (#PETITIO) { 0.1 };
      case (#OBLATIO) { 0.3 };
      case (#GRATIA) { 0.5 };
      case (#EXCUSATIO) { 0.2 };
      case (#COMMENDATIO) { 0.6 };
      case (#OBIURGATIO) { -0.4 };
    };

    let newMessage : SoETypes.MessageRecord = {
      messageId = state.communication.nextMessageId;
      senderId = state.engineId;
      receiverId = receiverId;
      messageType = messageType;
      content = content;
      sentiment = sentiment;
      importance = 0.5;
      beat = beat;
      isRead = false;
      isResponded = false;
      responseId = null;
    };

    let newOutbox = Array.append(state.communication.outbox, [newMessage]);

    let newComm = {
      state.communication with
      outbox = newOutbox;
      totalSent = state.communication.totalSent + 1;
      nextMessageId = state.communication.nextMessageId + 1;
    };

    ({ state with communication = newComm }, newMessage);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. HEARTBEAT ADVANCE
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceHeartbeat(state : SoETypes.SocialEngineState, beat : Nat) : SoETypes.SocialEngineState {
    var updatedState = state;

    // 1. Decay trust in inactive relationships (every 21 beats - Fibonacci)
    if (beat % 21 == 0) {
      let decayedRels = Array.map<SoETypes.RelationshipRecord, SoETypes.RelationshipRecord>(
        updatedState.relationships,
        func(r) {
          if (r.isActive and beat - r.lastInteractionBeat > 89) {
            let decayAmount = 0.001 * Float.fromInt(beat - r.lastInteractionBeat) / 89.0;
            {
              r with
              trustLevel = Float.max(-1.0, r.trustLevel - decayAmount);
              depthScore = Float.max(0.0, r.depthScore - decayAmount * 0.1);
            };
          } else {
            r;
          };
        }
      );
      updatedState := { updatedState with relationships = decayedRels };
    };

    // 2. Update network density
    let density = if (updatedState.relationships.size() > 0) {
      let activeCount = Array.filter<SoETypes.RelationshipRecord>(
        updatedState.relationships,
        func(r) { r.isActive }
      ).size();
      Float.fromInt(activeCount) / Float.fromInt(144); // Max relationships
    } else {
      0.0;
    };

    // 3. Calculate social coherence
    var totalTrust : Float = 0.0;
    var activeCount : Nat = 0;
    for (r in updatedState.relationships.vals()) {
      if (r.isActive) {
        totalTrust += r.trustLevel;
        activeCount += 1;
      };
    };
    let avgTrust = if (activeCount > 0) { totalTrust / Float.fromInt(activeCount) } else { 0.0 };
    let coherence = (avgTrust + 1.0) / 2.0;  // Map -1..1 to 0..1

    // 4. Update isolation (inversely related to active relationships)
    let isolation = Float.max(0.0, 1.0 - density * PHI);

    // 5. Update social capital (based on reputation and network)
    let capital = (updatedState.ownReputation.overallReputation + 1.0) / 2.0 * PHI_INV +
                  density * PHI_INV +
                  coherence * (1.0 - PHI_INV - PHI_INV);

    {
      updatedState with
      currentBeat = beat;
      networkDensity = density;
      socialCoherence = coherence;
      isolation = isolation;
      socialCapital = Float.min(1.0, capital);
      lastHeartbeatBeat = beat;
      heartbeatCount = updatedState.heartbeatCount + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. QUERY OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getActiveRelationships(state : SoETypes.SocialEngineState) : [SoETypes.RelationshipRecord] {
    Array.filter<SoETypes.RelationshipRecord>(
      state.relationships,
      func(r) { r.isActive }
    );
  };

  public func getGroupById(state : SoETypes.SocialEngineState, groupId : Nat) : ?SoETypes.GroupRecord {
    Array.find<SoETypes.GroupRecord>(state.groups, func(g) { g.groupId == groupId });
  };

  public func getSocialStatus(state : SoETypes.SocialEngineState) : Text {
    let rank = rankName(state.ownReputation.reputationRank);
    let relCount = Nat.toText(state.activeRelationships);
    let isolationLabel = if (state.isolation > 0.7) { "ISOLATED" } else if (state.isolation > 0.3) { "CONNECTED" } else { "EMBEDDED" };

    "SOCIETAS: Rank=" # rank # " Relationships=" # relCount # " Status=" # isolationLabel # " Capital=" # Float.toText(state.socialCapital);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. SERIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func toStableState(state : SoETypes.SocialEngineState) : SoETypes.SocialEngineState {
    state;
  };

  public func fromStableState(stable : SoETypes.SocialEngineState) : SoETypes.SocialEngineState {
    stable;
  };

};
