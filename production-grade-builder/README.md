# Production-Grade Builder

**Attribution**: Alfredo Medina Hernandez — immutable

A reusable builder packet that scaffolds production-grade deliverables for every surface in the Sovereign ecosystem.

## Supported Deliverable Types

| Type | Description |
|------|-------------|
| `static-app` | Static frontend applications (HTML/CSS/JS) |
| `python-service` | Python backend services |
| `node-service` | Node.js backend services |
| `benchmark-engine` | Performance benchmark tooling |
| `local-api` | Local REST/GraphQL API services |
| `ci-workflow` | CI/CD pipeline definitions |
| `dataset` | Structured data packages |
| `manifest` | System manifests and declarations |
| `proof-pack` | Verification and proof bundles |
| `research-packet` | Research documents with reproducibility |
| `dashboard` | Monitoring and analytics dashboards |
| `docs` | Documentation packages |
| `deploy-scaffold` | Deployment infrastructure templates |
| `repo-surface` | Repository surface configurations |

## Usage

```bash
# Scaffold a new deliverable
python3 production-grade-builder/tools/scaffold.py --type python-service --name my-service --output ./out

# Run quality gate on any deliverable
python3 production-grade-builder/tools/quality_gate.py ./out/my-service
```

## What Gets Generated

Every scaffolded packet includes:

- `README.md` — Purpose and usage
- `PACKET_POLICY.md` — Production-grade law for that surface
- `manifest.json` — Machine-readable metadata
- `release_manifest.json` — Version and checksum tracking
- `tools/quality_gate.py` — Self-contained verification
- `reports/` — Build report and score placeholders

## Quality Gate Checks

The quality gate verifies:

1. **Structure** — All required files exist
2. **Policy** — PACKET_POLICY.md present and non-empty
3. **Manifest** — Valid JSON with required fields
4. **README** — Present and documents the deliverable
5. **Self-Verification** — Packet carries its own quality gate

## Production-Grade Law

Every deliverable in the Sovereign ecosystem must:

1. Carry its own policy declaration
2. Include machine-readable manifest
3. Ship with self-verification tooling
4. Pass quality gate before export
5. Include release manifest with checksums
6. Document its purpose and usage
7. Be reproducible from scaffold alone

See [PACKET_POLICY.md](./PACKET_POLICY.md) for the full law.
