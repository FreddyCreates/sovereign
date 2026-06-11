# Production-Grade Packet Policy

**Version**: 1.0.0
**Attribution**: Alfredo Medina Hernandez — immutable

## The Law

Every deliverable produced in the Sovereign ecosystem is a **production-grade packet**. No exceptions. No loose files. No undocumented outputs.

## Required Artifacts

Every packet MUST contain:

| Artifact | Purpose |
|----------|---------|
| `README.md` | Human-readable purpose, usage, and context |
| `PACKET_POLICY.md` | The production law this deliverable obeys |
| `manifest.json` | Machine-readable metadata (name, type, version, author) |
| `release_manifest.json` | Release tracking (version, date, checksum, status) |
| `tools/quality_gate.py` | Self-contained verification script |

## Surface-Specific Requirements

### Static Apps
- `index.html` or entry point declared in manifest
- All assets referenced and present
- No external CDN dependencies without fallback

### Python Services
- `requirements.txt` or `pyproject.toml`
- Entry point declared in manifest
- Health check endpoint or status module

### Node Services
- `package.json` with scripts.start
- Entry point declared in manifest
- Health check endpoint or status module

### APIs (Local)
- OpenAPI spec or endpoint documentation
- Request/response examples
- Authentication scheme documented

### CI Workflows
- Trigger conditions documented
- All secrets referenced by name (never by value)
- Failure handling defined

### Datasets
- Schema definition (JSON Schema or equivalent)
- Row count and checksum in manifest
- Provenance documented

### Manifests
- JSON Schema for validation
- Version field required
- Backwards compatibility notes

### Proof Packs
- Assertion list with pass/fail status
- Evidence files referenced and present
- Timestamp and environment recorded

### Research Packets
- Hypothesis stated
- Methodology documented
- Results reproducible from included data

### Dashboards
- Data source documented
- Refresh interval specified
- Layout definition included

### Documentation
- Table of contents for >3 sections
- Cross-references validated
- Version matches parent system

### Deploy Scaffolds
- Target environment specified
- Rollback procedure documented
- Health check defined

### Repo Surfaces
- `.gitignore` appropriate for type
- License declared
- Contributing guidelines present

## Quality Gate

A packet is production-grade if and only if:

```
quality_score = (files_present / files_required) × policy_weight × manifest_validity
```

Where:
- `files_present` = count of required artifacts that exist
- `files_required` = total required artifacts for that surface type
- `policy_weight` = 1.0 if PACKET_POLICY.md exists and is non-empty, else 0.0
- `manifest_validity` = 1.0 if manifest.json is valid JSON with required fields, else 0.0

**Minimum passing score: 1.0** (all checks must pass)

## Enforcement

- The scaffold CLI generates all required artifacts automatically
- The quality gate runs before any export or commit
- Failed gates block release — no overrides
- Every generated packet includes its own quality gate copy

## Doctrine Integration

This policy implements **LAW_39_PRODUCTION_GRADE** in the Sovereign doctrine:

```
production_grade_score = structure × policy × manifest × self_verification
```

The organism produces only production-grade packets. Always on. No drafts escape.
