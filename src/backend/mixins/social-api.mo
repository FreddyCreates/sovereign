// mixins/social-api.mo
// Public API mixin for the SOVEREIGN Social Signal Engine
// Exposes: fetchWorldSignals, getWorldSignals, getCommercialFormats,
//          getWorldSignalFeed, subscribeWorldSignalToFilmSlate,
//          getLatestIoTInfluence, getExtendedPhenotype,
//          getSandboxEnrichedSocialAssets
// http-outcalls via ICP management canister — fallback to curated mock signals
// Auto-refresh: beatCounter drives 60-beat refresh cadence (≈60 seconds)
// Attributed to Alfredo Medina Hernandez — sealed on-chain
import Time        "mo:core/Time";
import List        "mo:core/List";
import Nat         "mo:core/Nat";
import Text        "mo:core/Text";
import Blob        "mo:core/Blob";
import SocialLib   "../lib/socialSignals";
import SocialTypes "../types/social";
import SandboxLib  "../lib/sandboxOrganisms";

mixin (
  worldSignals          : List.List<SocialTypes.WorldSignal>,
  lastFetchBeat         : [var Nat],
  beatCounter           : Nat,

  // Latest IoT influence record — set by main.mo on each logIoTSignal call
  latestIoTInfluence    : [var ?SocialTypes.IoTInfluence],

  // Set of signal IDs subscribed to the autonomous film slate
  // Stored as a flat List of Text IDs (simple, no Set needed for small cardinality)
  subscribedSignalIds   : List.List<Text>,

  // Extended phenotype state — updated by main.mo after each film seals
  extendedPhenotypeState : [var ?SocialTypes.ExtendedPhenotypeState],

  // Sandbox signal bus — passed from main.mo (read-only reference)
  sandboxBusBuf         : [var SandboxLib.SandboxSignalBus],

  // Ring 13: current production queue — updated every 10 VELA steps
  currentProductionQueueBuf : [var ?SocialTypes.ProductionQueue],
) {

  // Management canister actor type — minimal surface for http_request
  type HttpHeader = { name : Text; value : Text };
  type HttpRequestArgs = {
    url             : Text;
    max_response_bytes : ?Nat64;
    headers         : [HttpHeader];
    body            : ?Blob;
    method          : { #get; #post; #head };
    transform       : ?{
      function : shared query ({ response : HttpRequestResult; context : Blob }) -> async HttpRequestResult;
      context  : Blob;
    };
  };
  type HttpRequestResult = {
    status  : Nat;
    headers : [HttpHeader];
    body    : Blob;
  };

  let IC : actor { http_request : HttpRequestArgs -> async HttpRequestResult } =
    actor "aaaaa-aa";

  // ── Queries ────────────────────────────────────────────────────────────

  /// Returns the current cached world signals array.
  public query func getWorldSignals() : async [SocialTypes.WorldSignal] {
    worldSignals.toArray()
  };

  /// Returns all available commercial format templates with frame counts
  /// and doctrine defaults for the film organisms.
  public query func getCommercialFormats() : async [SocialTypes.CommercialFormatTemplate] {
    SocialLib.commercialFormatTemplates()
  };

  /// Returns a live WorldSignalFeed: current signals, top trending pattern,
  /// its PHI-scaled strength, and the film concept the organism would generate
  /// from those patterns right now.
  public query func getWorldSignalFeed() : async SocialTypes.WorldSignalFeed {
    let signals = worldSignals.toArray();
    let nowNs   = Time.now();
    SocialLib.buildWorldSignalFeed(signals, nowNs, beatCounter)
  };

  /// Returns what the most recent IoT signal contributed to organism state.
  /// Returns null if no IoT signal has been logged yet.
  public query func getLatestIoTInfluence() : async ?SocialTypes.IoTInfluence {
    latestIoTInfluence[0]
  };

  /// Returns the organism's extended phenotype state: what its last film
  /// expression was and what it would generate next if left alone.
  /// Returns null until the first film has been sealed.
  public query func getExtendedPhenotype() : async ?SocialTypes.ExtendedPhenotypeState {
    extendedPhenotypeState[0]
  };

  /// Returns sandbox-enriched social media assets for a given film.
  /// Each platform gets its own sandbox organism as the angle:
  ///   Instagram → CODEX cultural synthesis
  ///   TikTok    → VECTOR trending topic + emotional climate
  ///   Twitter/X → AXIOM scientific research angle
  ///   LinkedIn  → LEDGER commercial opportunity
  ///   YouTube   → FRAME visual descriptor
  /// The bus is always-current — this reads what organisms already know.
  public query func getSandboxEnrichedSocialAssets(
    filmTitle : Text,
    filmId    : Text,
  ) : async SocialTypes.SandboxEnrichedSocialAssets {
    let nowNs = Time.now();
    SocialLib.buildSandboxEnrichedSocialAssets(filmTitle, filmId, sandboxBusBuf[0], nowNs)
  };

  // ── Updates ────────────────────────────────────────────────────────────

  /// Fetches trending topics via http-outcalls and maps them to doctrine.
  /// Falls back to curated mock signals if the http-outcall fails.
  /// Called automatically every 60 beats from the heartbeat, or on demand.
  public func fetchWorldSignals() : async () {
    lastFetchBeat[0] := beatCounter;
    let nowNs = Time.now();
    let url = "https://api.allorigins.win/raw?url=https://trends.google.com/trends/trendingsearches/daily/rss?geo=US";

    let fetchedSignals : [SocialTypes.WorldSignal] = try {
      let response = await IC.http_request({
        url             = url;
        max_response_bytes = ?(50_000 : Nat64);
        headers         = [{ name = "Accept"; value = "application/rss+xml, text/xml, */*" }];
        body            = null;
        method          = #get;
        transform       = null;
      });
      if (response.status == 200) {
        let bodyText = switch (response.body.decodeUtf8()) {
          case (?t) t;
          case null "";
        };
        let topics = SocialLib.parseTopicsFromText(bodyText);
        if (topics.size() == 0) {
          SocialLib.mockSignals(beatCounter, nowNs)
        } else {
          let result = List.empty<SocialTypes.WorldSignal>();
          var rank = 1;
          for (topic in topics.values()) {
            let sig = SocialLib.buildSignal(
              "gt-" # beatCounter.toText() # "-" # rank.toText(),
              topic,
              "google_trends",
              rank,
              nowNs,
            );
            result.add(sig);
            rank += 1;
          };
          result.toArray()
        }
      } else {
        SocialLib.mockSignals(beatCounter, nowNs)
      }
    } catch (_) {
      SocialLib.mockSignals(beatCounter, nowNs)
    };

    // Replace the cached signals with the fresh batch
    worldSignals.clear();
    for (sig in fetchedSignals.values()) {
      worldSignals.add(sig);
    };
  };

  // ── Ring 13: SLATE_INTELLIGENCE API ──────────────────────────────────

  /// Returns the current production queue computed by SLATE_INTELLIGENCE.
  /// The queue is ordered by compoundedPriority descending — top slot is
  /// what MUSE-PRIME reads next. Updated every 10 VELA steps from runBeat.
  public query func getProductionQueue() : async ?SocialTypes.ProductionQueue {
    currentProductionQueueBuf[0]
  };

  /// Returns the single highest-priority production brief from the current queue.
  /// This is what MUSE-PRIME acts on immediately — the brief includes the
  /// signal text, format, doctrine alignment score, and the full brief text.
  /// Returns null if no queue has been computed yet (before first VELA step 10).
  public query func getCurrentProductionBrief() : async ?SocialTypes.SlatePriority {
    SocialLib.getCurrentProductionBrief(currentProductionQueueBuf[0])
  };

  /// Wires a specific world signal directly into the autonomous film slate.
  /// The ANALYST organism will include this signal's doctrine category and
  /// film concept when generating the next autonomous film slate.
  /// Returns true if the signal exists in the current batch and was subscribed,
  /// false if the signalId was not found.
  public func subscribeWorldSignalToFilmSlate(signalId : Text) : async Bool {
    // Verify the signal exists in the current world signals batch
    let found = worldSignals.find(func(s : SocialTypes.WorldSignal) : Bool {
      s.id == signalId
    });
    switch (found) {
      case null { false };
      case (?_) {
        // Idempotent: only add if not already subscribed
        let alreadySubscribed = subscribedSignalIds.find(func(id : Text) : Bool {
          id == signalId
        });
        switch (alreadySubscribed) {
          case (?_) { true }; // already subscribed, return true
          case null {
            // Ring-buffer: keep at most 50 subscribed signals
            if (subscribedSignalIds.size() >= 50) {
              ignore subscribedSignalIds.removeLast();
            };
            subscribedSignalIds.add(signalId);
            true
          };
        }
      };
    }
  };

}
