// mixins/intelligence-api.mo
// INTELLIGENCE TAXONOMY Public API Mixin
// Exposes all 15 sovereign intelligences to the frontend as callable execution units.
// Documents are the readable surface of what is ALREADY LIVE in canister stable storage.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// Law 15: calling any intelligence fires everything inside it. No read step.

import Float       "mo:core/Float";
import IntelTypes  "../types/intelligence";
import IntelTax    "../intelligence/IntelligenceTaxonomy";
import VoiceIntel  "../intelligence/VoiceIntelligence";
import ChatIntel   "../intelligence/ChatIntelligence";
import SensorIntel "../intelligence/SensorIntelligence";

mixin (
  taxonomyRuntimeStateRef : [var IntelTax.TaxonomyRuntimeState],
) {

  // ── REGISTRY QUERIES ──────────────────────────────────────────────────────

  /// Returns all 5 Voice intelligences from canister stable storage.
  public query func getVoiceIntelligences() : async [IntelTypes.IntelligenceRecord] {
    VoiceIntel.voiceIntelligenceRegistry()
  };

  /// Returns all 5 Chat intelligences from canister stable storage.
  public query func getChatIntelligences() : async [IntelTypes.IntelligenceRecord] {
    ChatIntel.chatIntelligenceRegistry()
  };

  /// Returns all 5 Sensor intelligences from canister stable storage.
  public query func getSensorIntelligences() : async [IntelTypes.IntelligenceRecord] {
    SensorIntel.sensorIntelligenceRegistry()
  };

  /// Returns all 15 intelligences as a flat array (Voice + Chat + Sensor).
  public query func getAllIntelligences() : async [IntelTypes.IntelligenceRecord] {
    IntelTax.getAllIntelligences()
  };

  // ── EXECUTION API ─────────────────────────────────────────────────────────
  // Calling any of these fires the intelligence immediately. No read step.
  // NT modulation output feeds directly into the organism's neural state.

  /// Execute a Voice intelligence by ID. Returns NT modulation + sub-model outputs.
  public func executeVoiceIntelligence(
    id    : Text,
    input : IntelTypes.IntelligenceInput,
  ) : async IntelTypes.IntelligenceOutput {
    let output = VoiceIntel.execute(id, input);
    // Update runtime doctrine strength for this intelligence
    let delta = output.doctrineStrengthDelta;
    let success = output.executionSuccess;
    if (success) {
      taxonomyRuntimeStateRef[0].doctrineStrengths.mapInPlace(
        func((rid, str)) { if (rid == id) (rid, Float.min(1.0, str + delta)) else (rid, str) }
      );
    };
    output
  };

  /// Execute a Chat intelligence by ID. Returns NT modulation + sub-model outputs.
  public func executeChatIntelligence(
    id    : Text,
    input : IntelTypes.IntelligenceInput,
  ) : async IntelTypes.IntelligenceOutput {
    let output = ChatIntel.execute(id, input);
    let delta = output.doctrineStrengthDelta;
    let success = output.executionSuccess;
    if (success) {
      taxonomyRuntimeStateRef[0].doctrineStrengths.mapInPlace(
        func((rid, str)) { if (rid == id) (rid, Float.min(1.0, str + delta)) else (rid, str) }
      );
    };
    output
  };

  /// Execute a Sensor intelligence by ID. Returns NT modulation + sub-model outputs.
  public func executeSensorIntelligence(
    id    : Text,
    input : IntelTypes.IntelligenceInput,
  ) : async IntelTypes.IntelligenceOutput {
    let output = SensorIntel.execute(id, input);
    let delta = output.doctrineStrengthDelta;
    let success = output.executionSuccess;
    if (success) {
      taxonomyRuntimeStateRef[0].doctrineStrengths.mapInPlace(
        func((rid, str)) { if (rid == id) (rid, Float.min(1.0, str + delta)) else (rid, str) }
      );
    };
    output
  };

  /// Returns the full taxonomy state — all 15 intelligences + execution stats.
  public query func getIntelligenceTaxonomyState() : async IntelTypes.IntelligenceTaxonomyState {
    IntelTax.getTaxonomyState(taxonomyRuntimeStateRef[0])
  };

  /// Returns the state of a specific intelligence by ID.
  public query func getIntelligenceState(id : Text) : async ?IntelTypes.IntelligenceState {
    IntelTax.getIntelligenceState(id, taxonomyRuntimeStateRef[0])
  };

}
