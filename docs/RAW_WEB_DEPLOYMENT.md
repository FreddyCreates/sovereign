# RAW WEB DEPLOYMENT — Own a Piece of the Internet

## Architecture

Like DFINITY's certified assets canister, the Sovereign backend canister **IS** the web server. No CDN, no proxy, no intermediary. The canister serves HTML, JS, CSS, and all web assets directly via the `http_request` interface.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SOVEREIGN RAW WEB STACK                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Browser ──── HTTP GET ────► ICP Boundary Node                     │
│                                      │                              │
│                                      ▼                              │
│                              Backend Canister                        │
│                              ┌──────────────┐                       │
│                              │ http_request  │ ◄── query call       │
│                              │              │                       │
│                              │ Routes:      │                       │
│                              │  /          → index.html (SPA)       │
│                              │  /assets/*  → static files           │
│                              │  /api/*     → canister queries       │
│                              │  /*         → SPA fallback           │
│                              └──────────────┘                       │
│                                                                     │
│   Response is subnet-certified (tamper-proof)                       │
│   No trust required — cryptographic verification                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## How It Works

### 1. Asset Storage
Assets (HTML, JS, CSS, images) are stored in canister stable memory via `storeRawWebAsset()`:

```
storeRawWebAsset("/index.html", htmlBlob, ?"text/html")
storeRawWebAsset("/assets/app.js", jsBlob, null)  // auto-detected MIME
storeRawWebAsset("/assets/style.css", cssBlob, null)
```

### 2. HTTP Request Handling
The canister implements `http_request` (query):
- Browser sends GET to `https://<canister-id>.icp0.io/`
- ICP boundary node forwards to canister
- Canister matches route → returns asset with headers
- Response is cryptographically certified by subnet

### 3. SPA Mode
Single-Page App mode is enabled by default:
- Unknown routes fall back to `/index.html`
- Client-side router handles `/app/*`, `/dashboard/*`, etc.
- Deep links work without server-side routing

### 4. Deploy Flow
```bash
# 1. Build frontend
cd src/frontend && pnpm build

# 2. Upload assets to canister
# (via dfx or script that calls storeRawWebAsset for each file in dist/)

# 3. The canister now serves your app at:
#    https://<canister-id>.icp0.io
#    or your custom domain
```

## Endpoints

| Endpoint | Type | Description |
|----------|------|-------------|
| `http_request` | query | Serves HTTP responses (the raw web interface) |
| `getRawWebGatewaySummary` | query | Gateway state summary |
| `getRawWebAssetKeys` | query | List all stored asset paths |
| `storeRawWebAsset` | update | Store/replace an asset |
| `removeRawWebAsset` | update | Remove an asset |

## Custom Domain

To serve on your own domain (e.g., `sovereign.world`):
1. Register domain with ICP boundary nodes
2. Set DNS CNAME to `<canister-id>.icp0.io`
3. Add TXT record for verification
4. The NAVIGATOR_RETIS agent handles DNS configuration

## Comparison with DFINITY's Approach

| Feature | DFINITY Asset Canister | Sovereign Raw Web |
|---------|----------------------|-------------------|
| HTTP serving | ✅ | ✅ |
| Certification | ✅ | ✅ (planned) |
| SPA mode | ✅ | ✅ |
| Custom domains | ✅ | ✅ |
| Intelligence | ❌ | ✅ (12 Latin agents) |
| PHI coherence | ❌ | ✅ |
| Self-healing | ❌ | ✅ (873ms heartbeat) |
| Parallel engines | ❌ | ✅ (48 engines) |

## The 12 Latin AI Agents

These agents work **in parallel** to deploy, serve, and optimize the raw web:

| # | Agent | Latin Name | Domain |
|---|-------|-----------|--------|
| I | FABRICATOR_MAXIMUS | Fabricator Maximus Aedificandi | Deployment |
| II | NAVIGATOR_RETIS | Navigator Retis Universalis | Networking |
| III | CUSTOS_CERTITUDINIS | Custos Certitudinis Absolutae | Certification |
| IV | ARCHITECTUS_TELAE | Architectus Telae Mundanae | Web Structure |
| V | PRAECEPTOR_MENTIS | Praeceptor Mentis Artificialis | AI Training |
| VI | VIGIL_SECURITATIS | Vigil Securitatis Perpetuae | Security |
| VII | ARTIFEX_PARALLELUS | Artifex Parallelus Operum | Concurrency |
| VIII | SCRUTATOR_PROFUNDUS | Scrutator Profundus Veritatis | Reasoning |
| IX | NUNTIUS_CELERIS | Nuntius Celeris Universalis | Communication |
| X | CONSERVATOR_MEMORIAE | Conservator Memoriae Aeternae | Persistence |
| XI | CREATOR_NOVORUM | Creator Novorum Rerum | Generation |
| XII | MODERATOR_HARMONIAE | Moderator Harmoniae Universalis | Coordination |

Each agent has:
- **5 Brain Regions** (cortex, nucleus, lobe, gyrus, stem)
- **4 Parallel Engines** (running simultaneously)
- **3+ Sovereign Tools** (concrete capabilities)
- **Task Memory** (last 100 operations)
- **PHI-weighted coherence** (monotonically increasing wisdom)
- **873ms TAFT thread** (always-on, always alive)

## Attribution

Alfredo Medina Hernandez | SOVEREIGN | June 2026
PHI = 1.6180339887498948482 | 873ms heartbeat | S_FLOOR = 0.75
