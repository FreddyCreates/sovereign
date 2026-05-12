// lib/spatialEngine.mo
// LOCUS SOVEREIGN — The Spatial Engine Implementation
// "Space is not emptiness. It is PHI-structured potential."
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

import SETypes "../types/spatialEngine";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let PHI2      : Float = 2.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;
  let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Fibonacci weights for dimensions
  let DIM_WEIGHTS : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0];

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState(seed : Nat) : SETypes.SpatialEngineState {
    let origin : SETypes.Coordinate = {
      x = 0.0; y = 0.0; z = 0.0; t = 0.0;
      e = 0.0; c = 0.0; s = 0.0; m = 0.0;
    };

    let zeroVelocity : SETypes.Velocity = {
      dx = 0.0; dy = 0.0; dz = 0.0; dt = 0.0;
      de = 0.0; dc = 0.0; ds = 0.0; dm = 0.0;
    };

    let initialOrientation : SETypes.Orientation = {
      primary = 0.0;
      secondary = 0.0;
      tilt = 0.0;
    };

    let initialSpatial : SETypes.SpatialState = {
      position = origin;
      velocity = zeroVelocity;
      orientation = initialOrientation;
      isMoving = false;
      speed = 0.0;
      direction = [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      lastMoveBeat = 0;
    };

    // Create genesis zone (universe)
    let genesisZone : SETypes.Zone = {
      zoneId = 0;
      zoneName = "UNIVERSUM";
      zoneType = #VACUUS;
      level = 0;
      parentZoneId = null;
      childZoneIds = [];
      boundary = {
        minCoord = { x = -1000.0; y = -1000.0; z = -1000.0; t = -1000.0; e = -1000.0; c = -1000.0; s = -1000.0; m = -1000.0 };
        maxCoord = { x = 1000.0; y = 1000.0; z = 1000.0; t = 1000.0; e = 1000.0; c = 1000.0; s = 1000.0; m = 1000.0 };
        boundaryType = #GRADIENT;
        permeability = 1.0;
      };
      center = origin;
      radius = 1000.0;
      resonance = PHI;
      occupants = [];
      landmarks = [];
      createdBeat = 0;
    };

    let initialNavigation : SETypes.NavigationState = {
      currentPath = null;
      currentNodeIndex = 0;
      movementMode = #WALK;
      distanceToGoal = 0.0;
      beatsToGoal = 0;
      isNavigating = false;
      pathHistory = [];
    };

    let initialProximity : SETypes.ProximityState = {
      nearbyTargets = [];
      closestTarget = null;
      crowdDensity = 0.0;
      intimateZoneOccupied = false;
      personalZoneOccupied = false;
      lastScanBeat = 0;
    };

    let initialMemory : SETypes.SpatialMemoryState = {
      landmarks = [];
      memories = [];
      visitedZones = [0];
      homeZoneId = 0;
      favoriteLocations = [];
      nextLandmarkId = 0;
      nextMemoryId = 0;
    };

    {
      engineId = "LOCUS_SOVEREIGN_" # Nat.toText(seed);
      founderLock = FOUNDER;
      genesisBeat = 0;
      currentBeat = 0;
      spatial = initialSpatial;
      zones = [genesisZone];
      currentZoneId = 0;
      zoneHistory = [0];
      nextZoneId = 1;
      navigation = initialNavigation;
      nextPathId = 0;
      proximity = initialProximity;
      memory = initialMemory;
      spatialCoherence = 1.0;
      navigationConfidence = 1.0;
      boundaryAwareness = 0.5;
      memoryIntegrity = 1.0;
      lastHeartbeatBeat = 0;
      heartbeatCount = 0;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. COORDINATE UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  // Calculate distance between two coordinates (weighted Euclidean)
  public func distance(a : SETypes.Coordinate, b : SETypes.Coordinate) : Float {
    let dx = (b.x - a.x) * DIM_WEIGHTS[0];
    let dy = (b.y - a.y) * DIM_WEIGHTS[1];
    let dz = (b.z - a.z) * DIM_WEIGHTS[2];
    let dt = (b.t - a.t) * DIM_WEIGHTS[3];
    let de = (b.e - a.e) * DIM_WEIGHTS[4];
    let dc = (b.c - a.c) * DIM_WEIGHTS[5];
    let ds = (b.s - a.s) * DIM_WEIGHTS[6];
    let dm = (b.m - a.m) * DIM_WEIGHTS[7];

    let sumSquares = dx*dx + dy*dy + dz*dz + dt*dt + de*de + dc*dc + ds*ds + dm*dm;
    Float.sqrt(sumSquares);
  };

  // Add velocity to position
  public func applyVelocity(pos : SETypes.Coordinate, vel : SETypes.Velocity, dt : Float) : SETypes.Coordinate {
    {
      x = pos.x + vel.dx * dt;
      y = pos.y + vel.dy * dt;
      z = pos.z + vel.dz * dt;
      t = pos.t + vel.dt * dt;
      e = pos.e + vel.de * dt;
      c = pos.c + vel.dc * dt;
      s = pos.s + vel.ds * dt;
      m = pos.m + vel.dm * dt;
    };
  };

  // Calculate velocity magnitude
  public func velocityMagnitude(vel : SETypes.Velocity) : Float {
    let sum = vel.dx*vel.dx + vel.dy*vel.dy + vel.dz*vel.dz + vel.dt*vel.dt +
              vel.de*vel.de + vel.dc*vel.dc + vel.ds*vel.ds + vel.dm*vel.dm;
    Float.sqrt(sum);
  };

  // Calculate direction unit vector from velocity
  public func velocityDirection(vel : SETypes.Velocity) : [Float] {
    let mag = velocityMagnitude(vel);
    if (mag < 0.0001) {
      [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    } else {
      [vel.dx/mag, vel.dy/mag, vel.dz/mag, vel.dt/mag,
       vel.de/mag, vel.dc/mag, vel.ds/mag, vel.dm/mag];
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. ZONE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Get zone name
  public func zoneName(zoneType : SETypes.ZoneType) : Text {
    switch (zoneType) {
      case (#SANCTUM) { "SANCTUM" };
      case (#FORUM) { "FORUM" };
      case (#LABORATORIUM) { "LABORATORIUM" };
      case (#CUBICULUM) { "CUBICULUM" };
      case (#TRANSITUS) { "TRANSITUS" };
      case (#LIMEN) { "LIMEN" };
      case (#VACUUS) { "VACUUS" };
      case (#NEXUS) { "NEXUS" };
    };
  };

  // Check if coordinate is inside zone boundary
  public func isInZone(coord : SETypes.Coordinate, zone : SETypes.Zone) : Bool {
    let b = zone.boundary;
    coord.x >= b.minCoord.x and coord.x <= b.maxCoord.x and
    coord.y >= b.minCoord.y and coord.y <= b.maxCoord.y and
    coord.z >= b.minCoord.z and coord.z <= b.maxCoord.z and
    coord.t >= b.minCoord.t and coord.t <= b.maxCoord.t and
    coord.e >= b.minCoord.e and coord.e <= b.maxCoord.e and
    coord.c >= b.minCoord.c and coord.c <= b.maxCoord.c and
    coord.s >= b.minCoord.s and coord.s <= b.maxCoord.s and
    coord.m >= b.minCoord.m and coord.m <= b.maxCoord.m;
  };

  // Find zone containing coordinate
  public func findZone(state : SETypes.SpatialEngineState, coord : SETypes.Coordinate) : ?SETypes.Zone {
    var bestZone : ?SETypes.Zone = null;
    var bestLevel : Nat = 0;

    for (zone in state.zones.vals()) {
      if (isInZone(coord, zone) and zone.level >= bestLevel) {
        bestZone := ?zone;
        bestLevel := zone.level;
      };
    };

    bestZone;
  };

  // Create a new zone
  public func createZone(
    state : SETypes.SpatialEngineState,
    name : Text,
    zoneType : SETypes.ZoneType,
    center : SETypes.Coordinate,
    radius : Float,
    beat : Nat
  ) : (SETypes.SpatialEngineState, SETypes.Zone) {
    // Find parent zone
    let parentOpt = findZone(state, center);
    let parentId = switch (parentOpt) {
      case (?p) { ?p.zoneId };
      case null { null };
    };
    let level = switch (parentOpt) {
      case (?p) { p.level + 1 };
      case null { 1 };
    };

    let newZone : SETypes.Zone = {
      zoneId = state.nextZoneId;
      zoneName = name;
      zoneType = zoneType;
      level = level;
      parentZoneId = parentId;
      childZoneIds = [];
      boundary = {
        minCoord = { x = center.x - radius; y = center.y - radius; z = center.z - radius;
                     t = center.t - radius; e = center.e - radius; c = center.c - radius;
                     s = center.s - radius; m = center.m - radius };
        maxCoord = { x = center.x + radius; y = center.y + radius; z = center.z + radius;
                     t = center.t + radius; e = center.e + radius; c = center.c + radius;
                     s = center.s + radius; m = center.m + radius };
        boundaryType = #PERMEABLE;
        permeability = PHI_INV;
      };
      center = center;
      radius = radius;
      resonance = PHI;
      occupants = [];
      landmarks = [];
      createdBeat = beat;
    };

    let newZones = Array.append(state.zones, [newZone]);

    ({ state with zones = newZones; nextZoneId = state.nextZoneId + 1 }, newZone);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. MOVEMENT AND NAVIGATION
  // ══════════════════════════════════════════════════════════════════════════

  // Set velocity
  public func setVelocity(state : SETypes.SpatialEngineState, vel : SETypes.Velocity) : SETypes.SpatialEngineState {
    let speed = velocityMagnitude(vel);
    let dir = velocityDirection(vel);

    {
      state with
      spatial = {
        state.spatial with
        velocity = vel;
        isMoving = speed > 0.001;
        speed = speed;
        direction = dir;
      };
    };
  };

  // Move to specific coordinate directly
  public func moveTo(state : SETypes.SpatialEngineState, dest : SETypes.Coordinate, beat : Nat) : SETypes.SpatialEngineState {
    let oldZoneOpt = findZone(state, state.spatial.position);
    let newZoneOpt = findZone(state, dest);

    let newZoneId = switch (newZoneOpt) {
      case (?z) { z.zoneId };
      case null { state.currentZoneId };
    };

    let zoneChanged = switch (oldZoneOpt, newZoneOpt) {
      case (?old, ?new) { old.zoneId != new.zoneId };
      case _ { false };
    };

    let newHistory = if (zoneChanged and state.zoneHistory.size() < 89) {
      Array.append(state.zoneHistory, [newZoneId]);
    } else if (zoneChanged) {
      Array.append(Array.subArray(state.zoneHistory, 1, state.zoneHistory.size() - 1), [newZoneId]);
    } else {
      state.zoneHistory;
    };

    {
      state with
      spatial = {
        state.spatial with
        position = dest;
        isMoving = false;
        speed = 0.0;
        lastMoveBeat = beat;
      };
      currentZoneId = newZoneId;
      zoneHistory = newHistory;
    };
  };

  // Stop movement
  public func stopMovement(state : SETypes.SpatialEngineState) : SETypes.SpatialEngineState {
    {
      state with
      spatial = {
        state.spatial with
        velocity = { dx = 0.0; dy = 0.0; dz = 0.0; dt = 0.0; de = 0.0; dc = 0.0; ds = 0.0; dm = 0.0 };
        isMoving = false;
        speed = 0.0;
      };
      navigation = {
        state.navigation with
        isNavigating = false;
      };
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. PROXIMITY SENSING
  // ══════════════════════════════════════════════════════════════════════════

  // Classify proximity zone based on distance
  public func classifyProximity(dist : Float) : SETypes.ProximityZone {
    if (dist < PHI_INV * PHI_INV) { #INTIMATE }
    else if (dist < PHI_INV) { #PERSONAL }
    else if (dist < 1.0) { #SOCIAL }
    else if (dist < PHI) { #PUBLIC }
    else if (dist < PHI2) { #DISTANT }
    else { #REMOTE };
  };

  // Calculate crowd density
  func calculateCrowdDensity(targets : [SETypes.ProximityTarget]) : Float {
    var density : Float = 0.0;
    for (t in targets.vals()) {
      // Closer targets contribute more to density
      density += 1.0 / (1.0 + t.distance);
    };
    Float.min(1.0, density / 5.0);  // Normalize: 5 close targets = full density
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. SPATIAL MEMORY
  // ══════════════════════════════════════════════════════════════════════════

  // Create a landmark
  public func createLandmark(
    state : SETypes.SpatialEngineState,
    name : Text,
    position : SETypes.Coordinate,
    beat : Nat
  ) : (SETypes.SpatialEngineState, SETypes.Landmark) {
    let zoneOpt = findZone(state, position);
    let zoneId = switch (zoneOpt) {
      case (?z) { z.zoneId };
      case null { 0 };
    };

    let newLandmark : SETypes.Landmark = {
      landmarkId = state.memory.nextLandmarkId;
      name = name;
      position = position;
      zoneId = zoneId;
      significance = 0.5;
      visitCount = 1;
      firstVisitBeat = beat;
      lastVisitBeat = beat;
      associations = [];
    };

    let newMemory = {
      state.memory with
      landmarks = Array.append(state.memory.landmarks, [newLandmark]);
      nextLandmarkId = state.memory.nextLandmarkId + 1;
    };

    ({ state with memory = newMemory }, newLandmark);
  };

  // Record a spatial memory
  public func recordSpatialMemory(
    state : SETypes.SpatialEngineState,
    eventType : SETypes.SpatialEventType,
    description : Text,
    emotionalContext : Float,
    beat : Nat
  ) : SETypes.SpatialEngineState {
    let entry : SETypes.SpatialMemoryEntry = {
      memoryId = state.memory.nextMemoryId;
      position = state.spatial.position;
      beat = beat;
      eventType = eventType;
      description = description;
      emotionalContext = emotionalContext;
      strength = 1.0;
    };

    // Keep only last 89 memories (Fibonacci)
    let existingMemories = if (state.memory.memories.size() >= 89) {
      Array.subArray(state.memory.memories, 1, 88);
    } else {
      state.memory.memories;
    };

    let newMemory = {
      state.memory with
      memories = Array.append(existingMemories, [entry]);
      nextMemoryId = state.memory.nextMemoryId + 1;
    };

    { state with memory = newMemory };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. HEARTBEAT ADVANCE
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceHeartbeat(state : SETypes.SpatialEngineState, beat : Nat) : SETypes.SpatialEngineState {
    var updatedState = state;

    // 1. Apply velocity if moving
    if (state.spatial.isMoving) {
      let dt : Float = 0.001;  // Time step per beat
      let newPos = applyVelocity(state.spatial.position, state.spatial.velocity, dt);

      // Check zone change
      let oldZoneOpt = findZone(state, state.spatial.position);
      let newZoneOpt = findZone(state, newPos);

      let zoneChanged = switch (oldZoneOpt, newZoneOpt) {
        case (?old, ?new) { old.zoneId != new.zoneId };
        case _ { false };
      };

      let newZoneId = switch (newZoneOpt) {
        case (?z) { z.zoneId };
        case null { state.currentZoneId };
      };

      updatedState := {
        updatedState with
        spatial = {
          updatedState.spatial with
          position = newPos;
          lastMoveBeat = beat;
        };
        currentZoneId = newZoneId;
      };

      // Record zone change as memory
      if (zoneChanged) {
        updatedState := recordSpatialMemory(
          updatedState,
          #ZONE_CHANGE,
          "Entered zone " # Nat.toText(newZoneId),
          0.0,
          beat
        );
      };
    };

    // 2. Update navigation if active
    if (state.navigation.isNavigating) {
      switch (state.navigation.currentPath) {
        case (?path) {
          let distToGoal = distance(updatedState.spatial.position, path.destination);
          updatedState := {
            updatedState with
            navigation = {
              updatedState.navigation with
              distanceToGoal = distToGoal;
              beatsToGoal = Nat.max(1, Int.abs(Float.toInt(distToGoal / (state.spatial.speed + 0.001))));
            };
          };
        };
        case null {};
      };
    };

    // 3. Decay memory strengths every 13 beats (Fibonacci)
    if (beat % 13 == 0) {
      let decayedMemories = Array.map<SETypes.SpatialMemoryEntry, SETypes.SpatialMemoryEntry>(
        updatedState.memory.memories,
        func(m) { { m with strength = Float.max(0.0, m.strength - 0.01) } }
      );
      updatedState := {
        updatedState with
        memory = {
          updatedState.memory with
          memories = decayedMemories;
        };
      };
    };

    // 4. Update coherence based on zone stability
    let zoneStability = if (state.zoneHistory.size() > 0) {
      let recentZones = if (state.zoneHistory.size() > 8) {
        Array.subArray(state.zoneHistory, state.zoneHistory.size() - 8, 8);
      } else {
        state.zoneHistory;
      };
      // Count unique zones in recent history
      var uniqueCount : Nat = 0;
      var seen = Buffer.Buffer<Nat>(8);
      for (z in recentZones.vals()) {
        let found = Array.find<Nat>(Buffer.toArray(seen), func(s) { s == z });
        if (Option.isNull(found)) {
          seen.add(z);
          uniqueCount += 1;
        };
      };
      1.0 - (Float.fromInt(uniqueCount) / 8.0);
    } else {
      1.0;
    };

    let newCoherence = state.spatialCoherence * 0.99 + zoneStability * 0.01;

    {
      updatedState with
      currentBeat = beat;
      spatialCoherence = newCoherence;
      lastHeartbeatBeat = beat;
      heartbeatCount = state.heartbeatCount + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. QUERY OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getCurrentPosition(state : SETypes.SpatialEngineState) : SETypes.Coordinate {
    state.spatial.position;
  };

  public func getCurrentZone(state : SETypes.SpatialEngineState) : ?SETypes.Zone {
    Array.find<SETypes.Zone>(state.zones, func(z) { z.zoneId == state.currentZoneId });
  };

  public func getZoneById(state : SETypes.SpatialEngineState, zoneId : Nat) : ?SETypes.Zone {
    Array.find<SETypes.Zone>(state.zones, func(z) { z.zoneId == zoneId });
  };

  public func getLandmarks(state : SETypes.SpatialEngineState) : [SETypes.Landmark] {
    state.memory.landmarks;
  };

  public func getSpatialStatus(state : SETypes.SpatialEngineState) : Text {
    let zoneOpt = getCurrentZone(state);
    let zoneName2 = switch (zoneOpt) {
      case (?z) { z.zoneName };
      case null { "UNKNOWN" };
    };
    let movingLabel = if (state.spatial.isMoving) { "MOVING" } else { "STATIONARY" };

    "LOCUS: Zone=" # zoneName2 # " Status=" # movingLabel # " Speed=" # Float.toText(state.spatial.speed) # " Coherence=" # Float.toText(state.spatialCoherence);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. SERIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func toStableState(state : SETypes.SpatialEngineState) : SETypes.SpatialEngineState {
    state;
  };

  public func fromStableState(stable : SETypes.SpatialEngineState) : SETypes.SpatialEngineState {
    stable;
  };

};
