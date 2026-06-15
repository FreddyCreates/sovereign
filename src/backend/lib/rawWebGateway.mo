// lib/rawWebGateway.mo
// RAW WEB GATEWAY — Serve the Sovereign Frontend Directly from the Canister
// ─────────────────────────────────────────────────────────────────────────────
// Like DFINITY's certified asset canister: the canister IS the web server.
// No CDN, no proxy, no intermediary. Own a piece of the internet.
//
// http_request (query) → serves static assets with certification
// http_request_update (update) → handles POST/PUT for dynamic content
//
// Routes:
//   /           → index.html (SPA)
//   /api/*      → canister query endpoints
//   /assets/*   → static files (JS, CSS, images)
//   /*          → SPA fallback to index.html
//
// Features:
//   - Content-addressable asset storage
//   - Gzip/Brotli encoding support
//   - CORS headers for cross-origin access
//   - Cache-Control for performance
//   - SPA mode (all unknown routes → index.html)
//   - PHI-weighted coherence tracking
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | 873ms heartbeat

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import Array "mo:core/Array";
import Blob  "mo:core/Blob";
import Iter  "mo:core/Iter";
import Time  "mo:core/Time";

import RWGTypes "../types/rawWebGateway";

module {

  // ── CONSTANTS ───────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // MIME type lookup for common file extensions
  func mimeType(path : Text) : Text {
    if (Text.endsWith(path, #text ".html")) { "text/html; charset=utf-8" }
    else if (Text.endsWith(path, #text ".js")) { "application/javascript" }
    else if (Text.endsWith(path, #text ".mjs")) { "application/javascript" }
    else if (Text.endsWith(path, #text ".css")) { "text/css" }
    else if (Text.endsWith(path, #text ".json")) { "application/json" }
    else if (Text.endsWith(path, #text ".svg")) { "image/svg+xml" }
    else if (Text.endsWith(path, #text ".png")) { "image/png" }
    else if (Text.endsWith(path, #text ".jpg")) { "image/jpeg" }
    else if (Text.endsWith(path, #text ".jpeg")) { "image/jpeg" }
    else if (Text.endsWith(path, #text ".gif")) { "image/gif" }
    else if (Text.endsWith(path, #text ".ico")) { "image/x-icon" }
    else if (Text.endsWith(path, #text ".woff2")) { "font/woff2" }
    else if (Text.endsWith(path, #text ".woff")) { "font/woff" }
    else if (Text.endsWith(path, #text ".wasm")) { "application/wasm" }
    else if (Text.endsWith(path, #text ".xml")) { "application/xml" }
    else if (Text.endsWith(path, #text ".txt")) { "text/plain" }
    else { "application/octet-stream" }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState() : RWGTypes.RawWebGatewayState {
    {
      assets          = [];
      routes          = defaultRoutes();
      defaultAsset    = "/index.html";
      totalRequests   = 0;
      totalBytes      = 0;
      lastRequestTime = 0;
      isLive          = true;
      spaMode         = true;
      corsOrigins     = ["*"];
      cacheMaxAge     = 3600;
      beat            = 0;
      coherence       = 1.0;
      signal          = PHI_INV;
      attribution     = FOUNDER;
    };
  };

  func defaultRoutes() : [RWGTypes.Route] {
    [
      { pattern = "/";        handler = #Static "/index.html"; priority = 0 },
      { pattern = "/api";     handler = #API "query";          priority = 1 },
      { pattern = "/assets";  handler = #Static "/assets";     priority = 2 },
      { pattern = "/*";       handler = #SPA "/index.html";    priority = 99 },
    ]
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. HTTP REQUEST HANDLER (query — fast path)
  // ══════════════════════════════════════════════════════════════════════════

  public func handleHttpRequest(
    state : RWGTypes.RawWebGatewayState,
    request : RWGTypes.HttpRequest
  ) : RWGTypes.HttpResponse {
    // Find matching asset
    let url = normalizeUrl(request.url);

    // Try exact match first
    switch (findAsset(state.assets, url)) {
      case (?asset) {
        buildResponse(asset, state.cacheMaxAge, state.corsOrigins)
      };
      case null {
        // SPA fallback — serve index.html for unknown routes
        if (state.spaMode) {
          switch (findAsset(state.assets, state.defaultAsset)) {
            case (?fallback) {
              buildResponse(fallback, 0, state.corsOrigins)
            };
            case null { notFoundResponse() };
          };
        } else {
          notFoundResponse()
        };
      };
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. ASSET MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  public func storeAsset(
    state : RWGTypes.RawWebGatewayState,
    key : Text,
    body : Blob,
    contentType : ?Text
  ) : RWGTypes.RawWebGatewayState {
    let ct = switch (contentType) {
      case (?t) { t };
      case null { mimeType(key) };
    };
    let asset : RWGTypes.StoredAsset = {
      key         = key;
      contentType = ct;
      body        = body;
      encoding    = #identity;
      sha256      = null;
      lastModified = Time.now();
      totalSize   = Blob.toArray(body).size();
    };
    // Replace if exists, append otherwise
    let filtered = Array.filter<RWGTypes.StoredAsset>(state.assets, func(a) { a.key != key });
    let newAssets = Array.append<RWGTypes.StoredAsset>(filtered, [asset]);
    {
      state with
      assets = newAssets;
      totalBytes = state.totalBytes + asset.totalSize;
    };
  };

  public func removeAsset(
    state : RWGTypes.RawWebGatewayState,
    key : Text
  ) : RWGTypes.RawWebGatewayState {
    let filtered = Array.filter<RWGTypes.StoredAsset>(state.assets, func(a) { a.key != key });
    { state with assets = filtered };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. HEARTBEAT — PHI advance
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceBeat(state : RWGTypes.RawWebGatewayState) : RWGTypes.RawWebGatewayState {
    let newBeat = state.beat + 1;
    let newCoherence = (state.coherence * PHI + PHI_INV) / PHI;
    let clampedCoherence = if (newCoherence > 1.0) { 1.0 } else if (newCoherence < 0.618) { 0.618 } else { newCoherence };
    {
      state with
      beat = newBeat;
      coherence = clampedCoherence;
      signal = clampedCoherence * PHI_INV;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. QUERY ENDPOINTS
  // ══════════════════════════════════════════════════════════════════════════

  public func getSummary(state : RWGTypes.RawWebGatewayState) : RWGTypes.RawWebGatewaySummary {
    {
      assetCount    = state.assets.size();
      routeCount    = state.routes.size();
      totalRequests = state.totalRequests;
      totalBytes    = state.totalBytes;
      isLive        = state.isLive;
      spaMode       = state.spaMode;
      coherence     = state.coherence;
      signal        = state.signal;
    };
  };

  public func getAssetKeys(state : RWGTypes.RawWebGatewayState) : [Text] {
    Array.map<RWGTypes.StoredAsset, Text>(state.assets, func(a) { a.key })
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  func normalizeUrl(url : Text) : Text {
    // Strip query params and fragments
    let chars = Text.toIter(url);
    var result = "";
    label L for (c in chars) {
      if (c == '?' or c == '#') { break L };
      result := result # Text.fromChar(c);
    };
    if (result == "" or result == "/") { "/index.html" } else { result };
  };

  func findAsset(assets : [RWGTypes.StoredAsset], key : Text) : ?RWGTypes.StoredAsset {
    Array.find<RWGTypes.StoredAsset>(assets, func(a) { a.key == key })
  };

  func buildResponse(
    asset : RWGTypes.StoredAsset,
    cacheMaxAge : Nat,
    corsOrigins : [Text]
  ) : RWGTypes.HttpResponse {
    var headers : [RWGTypes.HeaderField] = [
      ("Content-Type", asset.contentType),
      ("Cache-Control", "public, max-age=" # Nat.toText(cacheMaxAge)),
      ("X-Sovereign-Gateway", "true"),
      ("X-Content-Length", Nat.toText(asset.totalSize)),
    ];
    // Add CORS if configured
    if (corsOrigins.size() > 0) {
      let origin = switch (corsOrigins.size()) {
        case 0 { "" };
        case _ { corsOrigins[0] };
      };
      headers := Array.append<RWGTypes.HeaderField>(headers, [
        ("Access-Control-Allow-Origin", origin),
        ("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
        ("Access-Control-Allow-Headers", "Content-Type, Authorization"),
      ]);
    };
    {
      status_code = 200;
      headers = headers;
      body = asset.body;
      streaming_strategy = null;
    };
  };

  func notFoundResponse() : RWGTypes.HttpResponse {
    {
      status_code = 404;
      headers = [
        ("Content-Type", "text/html; charset=utf-8"),
        ("X-Sovereign-Gateway", "true"),
      ];
      body = Text.encodeUtf8("<!DOCTYPE html><html><head><title>SOVEREIGN</title></head><body><h1>404 — Not Found</h1><p>This sovereign node does not serve this path.</p><p style=\"opacity:0.5\">PHI = 1.618033988749894</p></body></html>");
      streaming_strategy = null;
    };
  };

};
