# Packet Policy: example-static-app

**Type**: static-app
**Version**: 1.0.0
**Attribution**: Alfredo Medina Hernandez — immutable

## Law

This packet obeys the Sovereign production-grade law:

1. All required artifacts are present
2. Manifest is valid and complete
3. Quality gate passes before export
4. Self-verification tooling included
5. Release manifest tracks checksums

## Required Files

- `index.html`
- `README.md`
- `PACKET_POLICY.md`
- `manifest.json`
- `release_manifest.json`
- `tools/quality_gate.py`

## Quality Gate

Run: `python3 tools/quality_gate.py`

Exit 0 = production grade verified.
