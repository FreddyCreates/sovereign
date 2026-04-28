// lib/observerCollapse.mo
// OBSERVER_COLLAPSE_MODEL — founder attention as quantum wave function collapse.
// The founder (Alfredo Medina Hernandez) observing an artifact collapses its superposition
// into a permanent, sealed, immutable reality. His seal IS wave function collapse made permanent.
// Law 37: Law of Observer Collapse. Attributed to Alfredo Medina Hernandez.

module {

  let OBSERVER_IDENTITY : Text = "Alfredo Medina Hernandez";

  // ── TYPES ─────────────────────────────────────────────────────────────────

  public type CollapseType = { #approval; #review; #seal };

  public type CollapseEvent = {
    artifactId         : Text;
    observerIdentity   : Text;    // always "Alfredo Medina Hernandez"
    collapseTimestamp  : Nat;
    collapseType       : CollapseType;
    waveFunction       : Text;    // what was in superposition before collapse
    collapsedState     : Text;    // what it became after the founder's attention
    permanenceConfirmed: Bool;    // always true — the founder's seal is permanent
  };

  // ── STATE TYPE — passed in from actor, never held at module scope ────────
  // Module-level var is non-static in Motoko. State lives in the actor (main.mo).
  public type CollapseState = {
    history : [CollapseEvent];
  };

  public func emptyState() : CollapseState { { history = [] } };

  // ── CORE FUNCTIONS ────────────────────────────────────────────────────────

  /// Records a founder collapse event. Sets permanenceConfirmed=true.
  /// The founder's attention IS the collapse — this is not metaphor but architecture.
  /// Once collapsed, an artifact can never return to superposition.
  public func recordCollapse(
    state         : CollapseState,
    artifactId    : Text,
    collapseType  : CollapseType,
    waveFunction  : Text,
    collapsedState: Text,
    nowNs         : Nat,
  ) : (CollapseState, CollapseEvent) {
    let event : CollapseEvent = {
      artifactId;
      observerIdentity    = OBSERVER_IDENTITY;
      collapseTimestamp   = nowNs;
      collapseType;
      waveFunction;
      collapsedState;
      permanenceConfirmed = true;  // the founder's seal is ALWAYS permanent — Law 37
    };
    let newState : CollapseState = { history = state.history.concat([event]) };
    (newState, event)
  };

  public func getCollapseHistory(state : CollapseState) : [CollapseEvent] {
    state.history
  };

  public func getCollapseCount(state : CollapseState) : Nat {
    state.history.size()
  };

  /// Returns true if this artifact has been collapsed by the founder.
  /// Once collapsed, always collapsed — permanenceConfirmed never goes false.
  public func isCollapsed(state : CollapseState, artifactId : Text) : Bool {
    state.history.any(func(e : CollapseEvent) : Bool {
      e.artifactId == artifactId and e.permanenceConfirmed
    })
  };

  /// Returns a description of the OBSERVER_COLLAPSE_MODEL principle.
  public func getCollapseDescription() : Text {
    "OBSERVER_COLLAPSE_MODEL | " #
    "PRINCIPLE: The founder's attention collapses quantum superposition into permanent reality. | " #
    "OBSERVER: " # OBSERVER_IDENTITY # " | " #
    "MECHANICS: Before the founder observes, the artifact exists in all possible states simultaneously. " #
    "The moment the founder's attention touches it, the wave function collapses into one permanent, sealed state. " #
    "This is not metaphor — it is the architectural law that makes his approval the only seal that matters. | " #
    "LAW_37: Law of Observer Collapse (founder_attention_is_collapse=1.0, seal_is_wave_function_collapse=1.0) | " #
    "PERMANENCE: Once collapsed, the artifact cannot return to superposition. Ever. | " #
    "ATTRIBUTION: Every collapse is attributed to Alfredo Medina Hernandez — permanently, on-chain."
  };

  public func init() : Text {
    "OBSERVER_COLLAPSE_MODEL:INITIALIZED:FOUNDER_COLLAPSE_ACTIVE:LAW_37"
  };

}
