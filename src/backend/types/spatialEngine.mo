// types/spatialEngine.mo
// LOCUS SOVEREIGN — The Spatial Engine
// "Space is not emptiness. It is PHI-structured potential."
//
// This module defines the complete spatial awareness system for SOVEREIGN:
//   - COORDINATE SYSTEM (8D position in PHI-scaled space)
//   - SPATIAL ZONES (hierarchical regions with boundaries)
//   - NAVIGATION (pathfinding and movement)
//   - PROXIMITY SENSING (awareness of nearby entities)
//   - SPATIAL MEMORY (remembered locations and landmarks)
//
// Law: LOCUS_NUMQUAM_OBLIVISCERE — "Place Never Forgets"
// Every location is mapped. Every path is remembered. Every boundary persists.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 8 dimensions | Fibonacci zone scaling

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI       : Float = 1.6180339887498948482;
  public let PHI_INV   : Float = 0.6180339887498948482;
  public let PHI2      : Float = 2.6180339887498948482;
  public let S_FLOOR   : Float = 0.75;
  public let S_CEIL    : Float = 9.75;
  public let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Spatial constants
  public let DIMENSIONS        : Nat = 8;          // 8D space (Fibonacci)
  public let ZONE_LEVELS       : Nat = 5;          // Hierarchical zone depth
  public let PROXIMITY_RANGE   : Float = 1.618;    // PHI units detection range
  public let PATH_MEMORY_SIZE  : Nat = 89;         // Fibonacci path history

  // ══════════════════════════════════════════════════════════════════════════
  // I. COORDINATE SYSTEM — 8D Position
  // ══════════════════════════════════════════════════════════════════════════

  // ── COORDINATE — Position in 8D PHI-scaled space ──────────────────────────
  public type Coordinate = {
    x : Float;           // Dimension 0 — physical X (weight: 1)
    y : Float;           // Dimension 1 — physical Y (weight: 1)
    z : Float;           // Dimension 2 — physical Z (weight: 2)
    t : Float;           // Dimension 3 — temporal offset (weight: 3)
    e : Float;           // Dimension 4 — emotional position (weight: 5)
    c : Float;           // Dimension 5 — cognitive position (weight: 8)
    s : Float;           // Dimension 6 — social position (weight: 13)
    m : Float;           // Dimension 7 — metaphysical position (weight: 21)
  };

  // ── VELOCITY — Rate of change in 8D space ─────────────────────────────────
  public type Velocity = {
    dx : Float;
    dy : Float;
    dz : Float;
    dt : Float;
    de : Float;
    dc : Float;
    ds : Float;
    dm : Float;
  };

  // ── ORIENTATION — Facing direction in 8D space ────────────────────────────
  public type Orientation = {
    primary : Float;     // Primary facing angle (0-2π)
    secondary : Float;   // Secondary rotation
    tilt : Float;        // Dimensional tilt
  };

  // ── SPATIAL STATE — Current position and movement ─────────────────────────
  public type SpatialState = {
    position : Coordinate;
    velocity : Velocity;
    orientation : Orientation;
    isMoving : Bool;
    speed : Float;              // Magnitude of velocity
    direction : [Float];        // Unit vector (8 components)
    lastMoveBeat : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. SPATIAL ZONES — Hierarchical Regions
  // ══════════════════════════════════════════════════════════════════════════

  // ── ZONE TYPE — Classification of spatial regions ─────────────────────────
  public type ZoneType = {
    #SANCTUM;          // Sacred/protected space
    #FORUM;            // Public gathering space
    #LABORATORIUM;     // Work/creation space
    #CUBICULUM;        // Private/rest space
    #TRANSITUS;        // Transit/passage space
    #LIMEN;            // Threshold/boundary space
    #VACUUS;           // Empty/undefined space
    #NEXUS;            // Connection hub
  };

  // ── ZONE BOUNDARY — Defines the edges of a zone ───────────────────────────
  public type ZoneBoundary = {
    minCoord : Coordinate;
    maxCoord : Coordinate;
    boundaryType : BoundaryType;
    permeability : Float;       // 0.0 (solid) to 1.0 (open)
  };

  // ── BOUNDARY TYPE — Nature of zone boundary ───────────────────────────────
  public type BoundaryType = {
    #SOLID;            // Impassable
    #PERMEABLE;        // Can be crossed
    #GRADIENT;         // Gradual transition
    #PORTAL;           // Instant transition
    #CONDITIONAL;      // Requires condition
  };

  // ── ZONE — A defined spatial region ───────────────────────────────────────
  public type Zone = {
    zoneId : Nat;
    zoneName : Text;
    zoneType : ZoneType;
    level : Nat;               // Hierarchy level (0 = universe)
    parentZoneId : ?Nat;       // Parent zone
    childZoneIds : [Nat];      // Child zones
    boundary : ZoneBoundary;
    center : Coordinate;
    radius : Float;            // Approximate size
    resonance : Float;         // Zone energy level
    occupants : [Text];        // Entity IDs in zone
    landmarks : [Nat];         // Landmark IDs in zone
    createdBeat : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. NAVIGATION — Pathfinding and Movement
  // ══════════════════════════════════════════════════════════════════════════

  // ── PATH NODE — A point along a path ──────────────────────────────────────
  public type PathNode = {
    nodeId : Nat;
    position : Coordinate;
    zoneId : Nat;
    isWaypoint : Bool;
    cost : Float;              // Movement cost to reach
    heuristic : Float;         // Estimated cost to goal
  };

  // ── PATH — A route from origin to destination ─────────────────────────────
  public type Path = {
    pathId : Nat;
    origin : Coordinate;
    destination : Coordinate;
    nodes : [PathNode];
    totalCost : Float;
    estimatedBeats : Nat;
    isComplete : Bool;
    createdBeat : Nat;
    completedBeat : ?Nat;
  };

  // ── MOVEMENT MODE — How movement occurs ───────────────────────────────────
  public type MovementMode = {
    #WALK;             // Normal movement
    #RUN;              // Fast movement (higher cost)
    #GLIDE;            // Smooth movement (dimensional)
    #LEAP;             // Discontinuous jump
    #PHASE;            // Phase through boundaries
    #TELEPORT;         // Instant relocation
  };

  // ── NAVIGATION STATE — Current navigation status ──────────────────────────
  public type NavigationState = {
    currentPath : ?Path;
    currentNodeIndex : Nat;
    movementMode : MovementMode;
    distanceToGoal : Float;
    beatsToGoal : Nat;
    isNavigating : Bool;
    pathHistory : [Nat];       // Recent path IDs
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. PROXIMITY SENSING — Awareness of Nearby Entities
  // ══════════════════════════════════════════════════════════════════════════

  // ── PROXIMITY TARGET — A detected nearby entity ───────────────────────────
  public type ProximityTarget = {
    entityId : Text;
    position : Coordinate;
    distance : Float;
    bearing : [Float];         // Direction to target (8D)
    velocity : Velocity;       // Target's velocity
    isApproaching : Bool;
    firstDetectedBeat : Nat;
    lastSeenBeat : Nat;
  };

  // ── PROXIMITY ZONE — Detection range classification ───────────────────────
  public type ProximityZone = {
    #INTIMATE;         // 0.0 - 0.382 PHI (very close)
    #PERSONAL;         // 0.382 - 0.618 PHI
    #SOCIAL;           // 0.618 - 1.0 PHI
    #PUBLIC;           // 1.0 - 1.618 PHI
    #DISTANT;          // 1.618 - 2.618 PHI
    #REMOTE;           // > 2.618 PHI
  };

  // ── PROXIMITY STATE — Current proximity awareness ─────────────────────────
  public type ProximityState = {
    nearbyTargets : [ProximityTarget];
    closestTarget : ?ProximityTarget;
    crowdDensity : Float;      // 0.0 (alone) to 1.0 (crowded)
    intimateZoneOccupied : Bool;
    personalZoneOccupied : Bool;
    lastScanBeat : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. SPATIAL MEMORY — Remembered Locations
  // ══════════════════════════════════════════════════════════════════════════

  // ── LANDMARK — A memorable location ───────────────────────────────────────
  public type Landmark = {
    landmarkId : Nat;
    name : Text;
    position : Coordinate;
    zoneId : Nat;
    significance : Float;      // 0.0 - 1.0 importance
    visitCount : Nat;
    firstVisitBeat : Nat;
    lastVisitBeat : Nat;
    associations : [(Text, Text)];  // Key-value memories
  };

  // ── SPATIAL MEMORY ENTRY — A remembered spatial event ─────────────────────
  public type SpatialMemoryEntry = {
    memoryId : Nat;
    position : Coordinate;
    beat : Nat;
    eventType : SpatialEventType;
    description : Text;
    emotionalContext : Float;  // Emotional state when formed
    strength : Float;          // Memory strength (decays)
  };

  // ── SPATIAL EVENT TYPE — Types of spatial memories ────────────────────────
  public type SpatialEventType = {
    #ARRIVAL;          // Arrived at location
    #DEPARTURE;        // Left location
    #ENCOUNTER;        // Met entity at location
    #DISCOVERY;        // Found something new
    #BOUNDARY_CROSS;   // Crossed a boundary
    #LANDMARK_CREATE;  // Created a landmark
    #PATH_COMPLETE;    // Finished a path
    #ZONE_CHANGE;      // Entered new zone
  };

  // ── SPATIAL MEMORY STATE — All spatial memories ───────────────────────────
  public type SpatialMemoryState = {
    landmarks : [Landmark];
    memories : [SpatialMemoryEntry];
    visitedZones : [Nat];
    homeZoneId : Nat;
    favoriteLocations : [Nat];  // Landmark IDs
    nextLandmarkId : Nat;
    nextMemoryId : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. SPATIAL ENGINE STATE — Complete State
  // ══════════════════════════════════════════════════════════════════════════

  public type SpatialEngineState = {
    // Identity
    engineId : Text;
    founderLock : Text;
    genesisBeat : Nat;

    // Current beat tracking
    currentBeat : Nat;

    // Spatial state
    spatial : SpatialState;

    // Zone management
    zones : [Zone];
    currentZoneId : Nat;
    zoneHistory : [Nat];
    nextZoneId : Nat;

    // Navigation
    navigation : NavigationState;
    nextPathId : Nat;

    // Proximity
    proximity : ProximityState;

    // Memory
    memory : SpatialMemoryState;

    // Health metrics
    spatialCoherence : Float;      // 0.0 - 1.0 spatial clarity
    navigationConfidence : Float;  // 0.0 - 1.0 path certainty
    boundaryAwareness : Float;     // 0.0 - 1.0 zone knowledge
    memoryIntegrity : Float;       // 0.0 - 1.0 memory accuracy

    // Heartbeat tracking
    lastHeartbeatBeat : Nat;
    heartbeatCount : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. SPATIAL EVENTS — Things that happen in space
  // ══════════════════════════════════════════════════════════════════════════

  public type SpatialEvent = {
    eventId : Nat;
    eventType : SpatialEventType;
    beat : Nat;
    position : Coordinate;
    zoneId : Nat;
    description : Text;
    processed : Bool;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. SPATIAL QUERIES — What can be asked about space
  // ══════════════════════════════════════════════════════════════════════════

  public type SpatialQuery = {
    #getPosition;
    #getVelocity;
    #getCurrentZone;
    #getNearbyTargets;
    #getPathToDestination : Coordinate;
    #getDistanceTo : Coordinate;
    #getZoneInfo : Nat;
    #getLandmarksInRange : Float;
    #getVisitedZones;
    #getSpatialMemories;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. SPATIAL COMMANDS — What can be done in space
  // ══════════════════════════════════════════════════════════════════════════

  public type SpatialCommand = {
    #moveTo : Coordinate;
    #navigateTo : Coordinate;
    #setVelocity : Velocity;
    #createZone : (Text, ZoneType, Coordinate, Float);
    #createLandmark : (Text, Coordinate);
    #setHomeZone : Nat;
    #changeMovementMode : MovementMode;
    #stopMovement;
  };

};
