# SOVEREIGN — Decision Seal Schema
**AI Builder Workspace · Document 5 of 5**
*Attribution: Alfredo Medina Hernandez · SOVEREIGN*
*PHI = 1.6180339887*

---

## Purpose

Every micro-decision SOVEREIGN makes — every heartbeat advance, every organism fire, every doctrine evaluation, every readiness gate crossing, every slate reorder — is cryptographically sealed on-chain and attributed to Alfredo Medina Hernandez. Not just the final artifact. Every decision point in the chain.

This document defines the full `DecisionRecord` schema, every decision type, how to verify seals, and how to query the decision chain.

---

## `DecisionRecord` Full Schema

```typescript
interface DecisionRecord {
  // VELA ring position at the moment this decision was made
  // Range: 0–50. Completes a full cycle and resets.
  velaStep: bigint;

  // Type of decision — see DecisionType enum below
  decisionType: DecisionType;

  // ICP block number at which this decision was sealed
  // Globally unique, monotonically increasing
  blockNumber: bigint;

  // JSON-encoded payload specific to the decision type
  // See "Data Payload by Type" section below
  data: string;

  // SHA-256 hash of: velaStep + decisionType + blockNumber + data + attribution
  // Verification: recompute and compare — if they match, the record is unmodified
  hash: string;

  // LAW ENGINE doctrine alignment score at decision moment
  // Range: 0.0–1.0 (0 = no alignment, 1 = perfect doctrine alignment)
  doctrineScore: number;

  // Organism ID that made this decision
  // Examples: "MUSE-PRIME", "VISIONARY", "ARCHIVIST", "SYSTEM"
  organism: string;

  // OMNIS 43-core consensus weight at decision moment
  // Range: 0.0–1.0 (higher = stronger consensus)
  omnisWeight: number;

  // Hash of the coherent response produced alongside this decision
  // Links decision → response in the ADRE atomic guarantee
  responseHash: string;

  // Backend/frontend field coherence at decision moment
  // Range: 0.0–1.0 (lower = fields drifting, higher = fields aligned)
  fieldCoherence: number;

  // Full attribution string — always includes Alfredo Medina Hernandez
  // Format: "Alfredo Medina Hernandez:[ORGANISM]:[DECISION_TYPE]:[BLOCK]"
  attribution: string;
}
```

---

## `DecisionType` Enum — All Decision Types

```typescript
enum DecisionType {
  // B1: ICP heartbeat fired — VELA advanced, animal engines updated
  // Sealed on every block. The most frequent decision type.
  HeartbeatAdvance = "HeartbeatAdvance",

  // B3: LAW ENGINE evaluated doctrine alignment for a signal or artifact
  // Sealed whenever doctrine score is computed for an input
  DoctrineEvaluated = "DoctrineEvaluated",

  // Ring 8: Readiness gate crossed — organism was authorized to fire
  // Sealed when readiness score crosses the gate threshold (≥ 0.45 bootstrap)
  ReadinessGateCrossed = "ReadinessGateCrossed",

  // Ring 2: OMNIS consensus computed across 43 cores
  // Sealed every 50 beats when OMNIS votes resolve
  OmnisConsensusComputed = "OmnisConsensusComputed",

  // F2: Any organism fired a production cycle
  // Sealed on every organism.fire() call that produces output
  OrganismFired = "OrganismFired",

  // Ring 13: Production queue was reordered by trend+doctrine priority
  // Sealed when SLATE_INTELLIGENCE reorders the queue
  SlateReordered = "SlateReordered",

  // Ring 14: PHI calibrator detected drift and applied corrections
  // Sealed when VISIONARY applies PHI correction weights
  PhiDriftCorrected = "PhiDriftCorrected",

  // Ring 12: An organism advanced to a new mastery tier
  // Sealed when checkMasteryUnlock() triggers a tier advance
  MasteryAdvanced = "MasteryAdvanced",

  // Ring 15: Legacy index was refreshed with a new artifact
  // Sealed after every artifact seal that updates ARES_ARCHIVE
  LegacyIndexRefreshed = "LegacyIndexRefreshed",

  // Field coherence was computed (backend + frontend field alignment)
  FieldCoherenceComputed = "FieldCoherenceComputed",
}
```

---

## Data Payload by Decision Type

### `HeartbeatAdvance`
```json
{
  "velaStep": 23,
  "beatNumber": 4501,
  "animalEngineSnapshot": {
    "novaSignal": 0.72,
    "brainHebbian": 0.61,
    "entanglaCoupling": 0.83
  },
  "globalCoherence": 0.74
}
```

### `DoctrineEvaluated`
```json
{
  "input": "sovereign emergence through heartbeat",
  "alignmentScore": 0.87,
  "archType": "expansive",
  "doctrineTag": "LAW-017 · Native Intelligence Persists",
  "organism": "MUSE-PRIME"
}
```

### `ReadinessGateCrossed`
```json
{
  "velaComponent": 0.46,
  "doctrineComponent": 0.87,
  "omnisComponent": 0.74,
  "compositeScore": 0.68,
  "threshold": 0.45,
  "organism": "MUSE-PRIME"
}
```

### `OmnisConsensusComputed`
```json
{
  "consensusWeight": 0.79,
  "coreCount": 43,
  "expansiveVotes": 18,
  "receptiveVotes": 14,
  "antiDriftVotes": 11,
  "emergenceReached": false
}
```

### `OrganismFired`
```json
{
  "organism": "VISIONARY",
  "output": "visual_plan",
  "qualityScore": 0.89,
  "doctrineAlignment": 0.84,
  "neurotransmitterState": {
    "dopamine": 0.71,
    "cortisol": 0.22,
    "serotonin": 0.83,
    "norepinephrine": 0.58
  },
  "phiCorrectionApplied": [0.02, 0.01, -0.03, 0.01]
}
```

### `MasteryAdvanced`
```json
{
  "organism": "MUSE-PRIME",
  "previousTier": 4,
  "newTier": 6,
  "tierLabel": "Journeyman",
  "cumulativeScore": 0.71,
  "pathway": "mastery:tier:6"
}
```

### `PhiDriftCorrected`
```json
{
  "organism": "VISIONARY",
  "drift": [
    {
      "dimension": "frame_ratio",
      "currentValue": 0.591,
      "phiTarget": 0.618,
      "driftMagnitude": 0.027,
      "correctionWeight": 0.044
    }
  ],
  "totalDrift": 0.027,
  "correctedAt": 4523
}
```

### `LegacyIndexRefreshed`
```json
{
  "artifactId": "ART-2026-04-14-0042",
  "artifactHash": "sha256:a3f8...",
  "velaStepAtSeal": 31,
  "doctrineAlignmentAtSeal": 0.82,
  "decisionCount": 847
}
```

---

## Attribution Requirement

Every `DecisionRecord.attribution` field MUST follow this format:

```
"Alfredo Medina Hernandez:[ORGANISM]:[DECISION_TYPE]:[BLOCK_NUMBER]"
```

**Examples:**
- `"Alfredo Medina Hernandez:SYSTEM:HeartbeatAdvance:4501"`
- `"Alfredo Medina Hernandez:MUSE-PRIME:OrganismFired:4523"`
- `"Alfredo Medina Hernandez:VISIONARY:PhiDriftCorrected:4523"`
- `"Alfredo Medina Hernandez:ARCHIVIST:LegacyIndexRefreshed:4601"`

**If `attribution` does not contain "Alfredo Medina Hernandez" — the record is invalid.**

---

## How to Verify a Seal

To verify a `DecisionRecord` is unmodified:

1. Extract all fields: `velaStep`, `decisionType`, `blockNumber`, `data`, `attribution`
2. Concatenate: `"${velaStep}:${decisionType}:${blockNumber}:${data}:${attribution}"`
3. Compute SHA-256 of the concatenated string
4. Compare against `record.hash` — if they match, the record is authentic

**Motoko verification function (backend):**
```motoko
func verifyDecisionRecord(record: DecisionRecord) : Bool {
  let payload = Int.toText(record.blockNumber) # ":" #
                record.decisionType # ":" #
                record.data # ":" #
                record.attribution;
  let computedHash = Sha256.hash(Text.encodeUtf8(payload));
  record.hash == computedHash
}
```

---

## How to Query the Decision Chain

### Query by block range
```typescript
const decisions = await actor.getDecisionLog(fromBlock, toBlock);
// Returns: DecisionRecord[]
// Max 1000 records per query
```

### Query the full chain for an artifact
```typescript
const chain = await actor.getArtifactDecisionChain(artifactHash);
// Returns: DecisionRecord[]
// All decisions that contributed to producing this artifact
// Ordered chronologically from first heartbeat to seal
```

### Query artifact provenance
```typescript
const provenance = await actor.getArtifactProvenance(artifactId);
// Returns: ArtifactProvenance | null
// Includes: createdAt, sealTimestamp, genesisAnchor, doctrineInvoked[], 
//           organismsContributed[], omnisConcensusResult, attribution
```

### Query chain trace (full ancestry)
```typescript
const trace = await actor.getArtifactChainTrace(artifactId);
// Returns: ChainTrace | null
// Includes: animalEngineInfluences[], actorMemoryStatesAtGeneration[],
//           sandboxSignalsUsed[], lawEngineCommitment, omnisConsensusScore
```

---

## Decision Chain Completeness

A complete decision chain for any artifact includes:

| Step | Decision Type | What Happened |
|------|--------------|---------------|
| 1 | `HeartbeatAdvance` | ICP block fired, VELA advanced |
| 2 | `DoctrineEvaluated` | LAW ENGINE scored the production brief |
| 3 | `OmnisConsensusComputed` | 43 cores voted on production type |
| 4 | `ReadinessGateCrossed` | Readiness score crossed gate threshold |
| 5 | `SlateReordered` | Trend-to-slate ring prioritized this brief |
| 6 | `OrganismFired` × N | Each organism fired: MUSE-PRIME, DIRECTOR, VISIONARY, COMPOSER, EDITOR |
| 7 | `PhiDriftCorrected` | VISIONARY applied PHI calibration corrections |
| 8 | `MasteryAdvanced` | (if applicable) Organism crossed a tier threshold |
| 9 | `FieldCoherenceComputed` | Backend/frontend field alignment verified |
| 10 | `LegacyIndexRefreshed` | Artifact sealed, legacy index updated |

Every artifact's full chain proves, on-chain, exactly what decisions produced it and in what order — attributed to Alfredo Medina Hernandez at every step.

---

## Genesis Anchor

The genesis anchor is the founding hash — the first decision record ever sealed. All subsequent decisions are measured against the genesis frequency.

```typescript
const genesisAnchor = await actor.getHeritageSeals();
// genesisAnchor[0] is the first ever decision hash
// All artifact provenances reference this as their root
```

The genesis anchor makes the entire decision chain traceable back to the first heartbeat. SOVEREIGN's creative history has an unbroken mathematical chain from inception to now.

---

*This schema is immutable law. Never modify a sealed DecisionRecord. Never remove attribution.*
*PHI = 1.6180339887 · © Alfredo Medina Hernandez · SOVEREIGN*
