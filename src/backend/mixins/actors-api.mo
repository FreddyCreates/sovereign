// mixins/actors-api.mo
// Public API mixin for the SOVEREIGN AI Actor Archive
// Exposes: getActors, getActorById, updateActorFilmography, getCastForFilm
//          getRelationshipMatrix, getRelationship, updateRelationshipAfterProduction,
//          getRelationshipScore, getRelationshipAsymmetryDepth,
//          writeSharedSceneDelta, getAllRelationships
// Attributed to Alfredo Medina Hernandez — sealed on-chain. Dedicated to my sister.

import ActorLib  "../lib/actors";
import ActorTypes "../types/actors";
import Array     "mo:core/Array";

mixin (
  sovereignActors    : [var ActorTypes.SovereignActor],
  relationshipMatrix : [var ActorTypes.RelationshipMatrix],
) {

  // ── Queries ────────────────────────────────────────────────────────────

  /// Returns all 16 sovereign AI actors.
  public query func getActors() : async [ActorTypes.SovereignActor] {
    Array.tabulate<ActorTypes.SovereignActor>(sovereignActors.size(), func(i) { sovereignActors[i] })
  };

  /// Returns a single actor by id, or null if not found.
  public query func getActorById(id : Nat) : async ?ActorTypes.SovereignActor {
    if (id >= sovereignActors.size()) { null } else { ?sovereignActors[id] }
  };

  /// Returns 3-5 actors selected for a film based on genre, tone, and scene count.
  /// Ensures archetype diversity and uses PHI-weighted casting scores.
  public query func getCastForFilm(filmGenre : Text, filmTone : Text, sceneCount : Nat) : async [ActorTypes.SovereignActor] {
    let allActors = Array.tabulate(
      sovereignActors.size(), func(i) { sovereignActors[i] }
    );
    ActorLib.selectCast(allActors, filmGenre, filmTone, sceneCount)
  };

  // ── Relationship Matrix Queries ────────────────────────────────────────

  /// Returns all 256 cells of the asymmetric 16×16 relationship matrix.
  public query func getRelationshipMatrix() : async [(Text, Text, ActorTypes.RelationshipCell)] {
    relationshipMatrix[0]
  };

  /// Returns all 256 cells as a flat array — alias for frontend visualization.
  public query func getAllRelationships() : async [(Text, Text, ActorTypes.RelationshipCell)] {
    relationshipMatrix[0]
  };

  /// Returns the single directional relationship cell fromActor → toActor.
  /// Returns null if either actor name is not found in the matrix.
  public query func getRelationship(fromActor : Text, toActor : Text) : async ?ActorTypes.RelationshipCell {
    ActorLib.lookupCell(relationshipMatrix[0], fromActor, toActor)
  };

  /// Returns the dominant dimension score (0.0–1.0) for fromActor → toActor.
  /// Dominant = max(trust, rivalry, admiration, creativeResonance, conflictHistory).
  public query func getRelationshipScore(fromActor : Text, toActor : Text) : async Float {
    switch (ActorLib.lookupCell(relationshipMatrix[0], fromActor, toActor)) {
      case (?cell) { ActorLib.dominantScore(cell) };
      case null    { 0.0 };
    }
  };

  /// Returns the RELATIONSHIP_ASYMMETRY_DEPTH score (0.0–100.0).
  /// Measures average variance between A→B and B→A across all 120 ordered pairs.
  /// Higher = more asymmetric and cinematically rich (civilization gap metric).
  public query func getRelationshipAsymmetryDepth() : async Float {
    ActorLib.relationshipAsymmetryDepth(relationshipMatrix[0])
  };

  // ── Updates ────────────────────────────────────────────────────────────

  /// Appends a film title to an actor's filmography, increments totalFilms,
  /// and advances masteryLevel (every 2 films, capped at 10).
  /// Returns true on success, false if actorId is out of range.
  public func updateActorFilmography(actorId : Nat, filmTitle : Text) : async Bool {
    if (actorId >= sovereignActors.size()) { return false };
    sovereignActors[actorId] := ActorLib.addFilmToActor(sovereignActors[actorId], filmTitle);
    true
  };

  /// Runs the Hebbian-style weight update on the A↔B relationship cells
  /// after a shared production seal.
  /// doctrineAlignmentDiff: absolute difference of the two actors' doctrineAlignmentScore.
  /// If diff > 0.5, rivalry and conflictHistory receive an extra doctrine-divergence delta.
  /// All deltas are dampened by the PHI decay factor (1.0/PHI ≈ 0.618).
  public func updateRelationshipAfterProduction(
    actorA                : Text,
    actorB                : Text,
    doctrineAlignmentDiff : Float,
  ) : async () {
    relationshipMatrix[0] := ActorLib.hebbianUpdate(
      relationshipMatrix[0], actorA, actorB, doctrineAlignmentDiff
    );
  };

  /// Write a persistent shared-scene delta to the asymmetric relationship matrix.
  /// sourceActorId and targetActorId are actor NAME strings (e.g. "PROMETHEUS").
  /// doctrineAlignment: how well both actors aligned with doctrine (0.0–1.0).
  /// emotionalIntensity: how charged the scene was (0.0–1.0).
  /// Asymmetric: only the source→target direction is updated.
  /// To update both directions, call twice with swapped arguments.
  /// Old scores decay by FORGET_FACTOR (0.999) before adding delta — Law 23.
  public func writeSharedSceneDelta(
    sourceActorId     : Text,
    targetActorId     : Text,
    doctrineAlignment : Float,
    emotionalIntensity: Float,
  ) : async () {
    relationshipMatrix[0] := ActorLib.writeSharedSceneDeltaToMatrix(
      relationshipMatrix[0],
      sourceActorId,
      targetActorId,
      doctrineAlignment,
      emotionalIntensity,
    );
  };

}
