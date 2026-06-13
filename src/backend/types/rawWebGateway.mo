// types/rawWebGateway.mo
// RAW WEB GATEWAY — Sovereign HTTP Interface Types
// ─────────────────────────────────────────────────────────────────────────────
// Like DFINITY's certified asset canister: serve web content directly from
// the canister via http_request/http_request_update. Own a piece of the internet.
// No CDN. No intermediary. Raw sovereign web delivery.
//
// The canister IS the web server. The blockchain IS the hosting.
// Every HTTP response is certified by the subnet — tamper-proof by design.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | 873ms heartbeat

module {

  // ── HTTP TYPES (ic0 interface) ──────────────────────────────────────────────
  public type HeaderField = (Text, Text);

  public type HttpRequest = {
    method  : Text;
    url     : Text;
    headers : [HeaderField];
    body    : Blob;
  };

  public type HttpResponse = {
    status_code        : Nat16;
    headers            : [HeaderField];
    body               : Blob;
    streaming_strategy : ?StreamingStrategy;
  };

  public type StreamingStrategy = {
    #Callback : {
      callback : shared query StreamingCallbackToken -> async StreamingCallbackResponse;
      token    : StreamingCallbackToken;
    };
  };

  public type StreamingCallbackToken = {
    key        : Text;
    index      : Nat;
    content_encoding : Text;
  };

  public type StreamingCallbackResponse = {
    body  : Blob;
    token : ?StreamingCallbackToken;
  };

  // ── ASSET TYPES ─────────────────────────────────────────────────────────────
  public type AssetEncoding = {
    #identity;
    #gzip;
    #br;
    #deflate;
  };

  public type StoredAsset = {
    key             : Text;       // URL path e.g. "/index.html"
    contentType     : Text;       // MIME type e.g. "text/html"
    body            : Blob;       // raw bytes
    encoding        : AssetEncoding;
    sha256          : ?Blob;      // content hash for certification
    lastModified    : Int;        // timestamp
    totalSize       : Nat;
  };

  // ── ROUTE TYPES ─────────────────────────────────────────────────────────────
  public type RouteHandler = {
    #Static : Text;               // serve asset by key
    #API    : Text;               // forward to canister endpoint
    #Redirect : { location : Text; permanent : Bool };
    #SPA    : Text;               // single page app fallback
  };

  public type Route = {
    pattern : Text;               // URL pattern e.g. "/api/*" or "/app/*"
    handler : RouteHandler;
    priority : Nat;               // lower = higher priority
  };

  // ── CERTIFICATION TYPES ─────────────────────────────────────────────────────
  public type CertifiedResponse = {
    response     : HttpResponse;
    certificate  : ?Blob;         // ic-certificate header value
    tree         : ?Blob;         // witness/hash tree for verification
  };

  // ── GATEWAY STATE ───────────────────────────────────────────────────────────
  public type RawWebGatewayState = {
    assets          : [StoredAsset];
    routes          : [Route];
    defaultAsset    : Text;        // usually "/index.html"
    totalRequests   : Nat;
    totalBytes      : Nat;
    lastRequestTime : Int;
    isLive          : Bool;
    spaMode         : Bool;        // single-page-app mode (serve index.html for unknown routes)
    corsOrigins     : [Text];      // allowed CORS origins
    cacheMaxAge     : Nat;         // max-age seconds for static assets
    beat            : Nat;
    coherence       : Float;
    signal          : Float;
    attribution     : Text;
  };

  // ── GATEWAY SUMMARY ─────────────────────────────────────────────────────────
  public type RawWebGatewaySummary = {
    assetCount      : Nat;
    routeCount      : Nat;
    totalRequests   : Nat;
    totalBytes      : Nat;
    isLive          : Bool;
    spaMode         : Bool;
    coherence       : Float;
    signal          : Float;
  };

  // ── DEPLOY CONFIG ───────────────────────────────────────────────────────────
  public type DeployConfig = {
    targetNetwork   : Text;        // "mainnet" | "local" | "staging"
    canisterId      : ?Text;       // if known
    customDomain    : ?Text;       // e.g. "sovereign.world"
    enableCORS      : Bool;
    enableCompression : Bool;
    enableCertification : Bool;
    spaFallback     : Bool;
  };

};
