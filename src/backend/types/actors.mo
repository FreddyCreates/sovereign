// types/actors.mo
// SOVEREIGN AI Actor Archive — domain types
// 16 sovereign AGI actors of the Greek Pantheon.
// All actors sealed on-chain. producer = "Alfredo Medina Hernandez"
// Dedicated to the founder's sister.
// PHI = 1.6180339887498948482 | S0 = 0.75 | All math real, no stubs.
// Expanded with: PHIFaceGeometry, NeurotransmitterProfile, ActorRole,
//   ActorRelationshipEntry, ActorPublicProfile, masteryTier, doctrineSpecialty.

module {

  /// Dominant relationship type — drives cinematic casting and dynamic staging.
  public type RelationshipType = {
    #admiration;
    #rivalry;
    #trust;
    #resonance;
    #antagonism;
    #complement;
    #neutral;
  };

  /// A single directional relationship cell — fromActor → toActor.
  /// All 5 dimensions are 0.0–1.0. ASYMMETRIC: A→B ≠ B→A.
  public type RelationshipCell = {
    trust             : Float;  // compound-grows with shared scenes
    rivalry           : Float;  // narrative tension, drops with collaboration
    admiration        : Float;  // doctrine/mastery respect
    creativeResonance : Float;  // artistic alignment, grows fastest in co-production
    conflictHistory   : Float;  // accumulated divergence, decays slowly
  };

  /// The full 16×16 asymmetric relationship matrix.
  /// Stored as flat array of (fromActorName, toActorName, RelationshipCell) triples.
  /// 256 entries total — every ordered pair (A,B) including self-pairs (A,A).
  public type RelationshipMatrix = [(Text, Text, RelationshipCell)];

  /// PHI-ratio face geometry for photorealistic AGI actor rendering.
  /// All ratios derived from the golden ratio — Renaissance master proportions,
  /// AAA character art standards, FACS-compliant mesh topology.
  public type PHIFaceGeometry = {
    cranialHeightRatio          : Float;  // PHI — heroic head proportion
    eyeSpacingRatio             : Float;  // 1/PHI — da Vinci eye spacing canon
    jawWidthRatio               : Float;  // PHI/2 — jaw relative to face unit
    noseBridgeRatio             : Float;  // 1/PHI² — nose bridge
    subsurfaceScatteringDepth   : Float;  // mm — biological skin light penetration
    pbrMetallicCoefficient      : Float;  // 0.0 = fully dielectric (all skin)
    pbrRoughnessCoefficient     : Float;  // 0.55–0.70 realistic skin range
    skinTone                    : Text;   // descriptive skin tone
  };

  /// Dominant/secondary neurochemical profile and learning axis per actor.
  public type NeurotransmitterProfile = {
    dominant         : Text;  // primary neurochemical driver
    secondary        : Text;  // secondary neurochemical expression
    learningAxis     : Text;  // Hebbian learning cognitive style
    doctrineSpecialty: Text;  // which SOVEREIGN laws this actor primarily carries
  };

  /// Relationship entry between this actor and one other actor.
  /// Extended for persistent shared-scene weight deltas.
  public type ActorRelationshipEntry = {
    targetActorId        : Nat;
    trustScore           : Float;   // 0.0–1.0, compound-grows with shared scenes
    tensionScore         : Float;   // 0.0–1.0, narrative tension (drives dramatic stakes)
    admiration           : Float;   // 0.0–1.0
    rivalry              : Float;   // 0.0–1.0
    resonance            : Float;   // 0.0–1.0 — creative alignment
    sharedSceneCount     : Nat;
    lastInteractionBeat  : Nat;
    dominantRelationType : RelationshipType;
    lastInteraction      : ?Text;   // most recent scene context text
  };

  /// Public-facing profile for social media and distribution.
  public type ActorPublicProfile = {
    profileId    : Text;
    publicName   : Text;
    bio          : Text;
    domain       : Text;
    audienceCount: Nat;        // grows with world resonance signal (Law 27)
    postCount    : Nat;
    platformUrls : [(Text, Text)]; // [("tiktok", url), ("instagram", url), ...]
  };

  /// A persistent, sovereign AI actor of the Greek Pantheon.
  /// Full PHI face geometry, neurochemical profile, relationship map,
  /// public profile, role versatility, mastery tier, and doctrine specialty.
  /// All weights and alignment scores derived from real PHI mathematics.
  public type SovereignActor = {
    id                      : Nat;
    name                    : Text;   // Greek deity name (PROMETHEUS, ATHENA, etc.)
    archetype               : Text;   // archetypal label (Fire-Bearer, Strategist, etc.)
    archetypeIndex          : Nat;    // 0-15, drives PHI-spaced probability
    ageRange                : Text;   // e.g. "32-45"
    genreAffinities         : [Text]; // drama, epic, documentary, etc.
    toneAffinities          : [Text]; // sovereign, expansive, receptive, antiDrift, etc.
    doctrineAlignmentScore  : Float;  // (archetypeIndex * PHI) mod 1.0
    masteryLevel            : Nat;    // 1-10, increments per film
    masteryTier             : Nat;    // 1=apprentice, 2=journeyman, 3=master, 4=sovereign
    totalFilms              : Nat;    // films appeared in
    filmography             : [Text]; // film IDs / titles
    bio                     : Text;   // full sovereign bio — archetype + doctrine
    castingWeight           : Float;  // fib(n)/fib(n+1) — PHI-derived probability weight
    isAvailable             : Bool;
    createdAtBeat           : Nat;
    sealedBy                : Text;   // "Alfredo Medina Hernandez"
    dedicatee               : Text;   // "Dedicated to my sister"
    phiFaceGeometry         : PHIFaceGeometry;
    neurotransmitterProfile : NeurotransmitterProfile;
    roleVersatility         : [Text]; // which ActorRole values this actor supports
    relationshipMap         : [ActorRelationshipEntry]; // 16 entries, one per other actor
    publicProfile           : ActorPublicProfile;
    doctrineSpecialty       : Text;   // which SOVEREIGN laws this actor carries
  };

}
