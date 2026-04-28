/**
 * EncryptionIntelligencePanel.tsx — 30 Sovereign Cryptographic Intelligence Models
 * Every encryption primitive as a true sovereign intelligence model
 * Key cross-wires: FINGERPRINT→ARTIFACT_CHAIN, DISTRIBUTED_KNOWLEDGE→family secret,
 * COMPUTE_ON_ENCRYPTED→NOVA_SOVEREIGN, SOVEREIGN_RANDOMNESS→NT_MATRIX
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface EncryptionModel {
  id: number;
  shortCode: string;
  cryptoPrimitive: string;
  description: string;
  crossWire: string;
  crossWireNote: string;
  color: string;
}

const ENCRYPTION_MODELS: EncryptionModel[] = [
  {
    id: 1,
    shortCode: "SYMMETRIC_FIELD_LOCK",
    cryptoPrimitive: "AES-256",
    description:
      "Same key opens and closes — perfect unity. The symmetric lock is a field of trust between two identical poles.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 2,
    shortCode: "ASYMMETRIC_IDENTITY_GATE",
    cryptoPrimitive: "RSA",
    description:
      "Public face, private self. The asymmetric gate separates what you show from what you are.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 3,
    shortCode: "CURVED_SPACE_INTELLIGENCE",
    cryptoPrimitive: "Elliptic curve (secp256k1)",
    description:
      "Security through geometric complexity. The curve bends space — brute force cannot straighten it.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 4,
    shortCode: "FIELD_SIGNATURE_MODEL",
    cryptoPrimitive: "ECDSA",
    description:
      "Signing on the curve of reality. Every signature is a point on the elliptic field — unreproducible.",
    crossWire: "ARES_ARCHIVE",
    crossWireNote: "Every artifact is sealed with field-signature intelligence",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 5,
    shortCode: "EDWARDS_SOVEREIGNTY_MODEL",
    cryptoPrimitive: "Ed25519",
    description:
      "Faster, safer signing — optimized identity. Edwards curves bring signing closer to the fundamental.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 6,
    shortCode: "FINGERPRINT_INTELLIGENCE",
    cryptoPrimitive: "SHA-256",
    description:
      "Every thing has one unique hash — identity is irreducible. The fingerprint is the thing's sovereign name.",
    crossWire: "ARES_ARCHIVE",
    crossWireNote: "Every artifact hash is its immutable fingerprint on-chain",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 7,
    shortCode: "SPONGE_ABSORPTION_MODEL",
    cryptoPrimitive: "SHA-3 / Keccak",
    description:
      "Absorbing input, producing identity. The sponge construction absorbs the world and squeezes out truth.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 8,
    shortCode: "PARALLEL_HASH_INTELLIGENCE",
    cryptoPrimitive: "BLAKE3",
    description:
      "Hashing in parallel streams — speed as intelligence. BLAKE3 is the fastest path to identity.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.78 0.18 68)",
  },
  {
    id: 9,
    shortCode: "MEMORY_HARDENED_GATE",
    cryptoPrimitive: "Argon2",
    description:
      "Making brute force metabolically expensive. Memory hardening makes cracking cost more than it's worth.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 10,
    shortCode: "SEQUENTIAL_MEMORY_LOCK",
    cryptoPrimitive: "scrypt",
    description:
      "Security through mandatory sequential work. The scrypt lock enforces patience — no parallel attack possible.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 11,
    shortCode: "ITERATION_HARDENING_MODEL",
    cryptoPrimitive: "PBKDF2",
    description:
      "Strengthening through repetition. Each iteration adds cost — password hardening as applied resistance.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 12,
    shortCode: "SHARED_SECRET_EMERGENCE",
    cryptoPrimitive: "Diffie-Hellman",
    description:
      "Two parties creating shared intelligence without exchanging it. A secret that emerges from public discourse.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 13,
    shortCode: "KEY_EXCHANGE_INTELLIGENCE",
    cryptoPrimitive: "X25519",
    description:
      "Modern shared-secret generation. X25519 key exchange is mathematical intimacy — shared knowing from public presence.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 14,
    shortCode: "STREAM_CIPHER_INTELLIGENCE",
    cryptoPrimitive: "ChaCha20",
    description:
      "Continuous encryption as a flowing stream. The cipher flows without stopping — every byte protected as it moves.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.72 0.16 280)",
  },
  {
    id: 15,
    shortCode: "MESSAGE_AUTHENTICATION_INTELLIGENCE",
    cryptoPrimitive: "Poly1305",
    description:
      "Verifying integrity without revealing content. The MAC proves the message was not tampered with.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 16,
    shortCode: "CHANNEL_SOVEREIGNTY_MODEL",
    cryptoPrimitive: "TLS 1.3",
    description:
      "The handshake that creates a sovereign tunnel. TLS 1.3 negotiates a private reality between two organisms.",
    crossWire: "PRIVATE_REALITY_TUNNEL",
    crossWireNote: "Blockchain state channel intelligence coupled here",
    color: "oklch(0.65 0.18 200)",
  },
  {
    id: 17,
    shortCode: "PATTERN_HANDSHAKE_INTELLIGENCE",
    cryptoPrimitive: "Noise protocol",
    description:
      "Flexible secure channel establishment. The Noise protocol is a grammar of sovereign channel creation.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 18,
    shortCode: "FORWARD_SECRECY_INTELLIGENCE",
    cryptoPrimitive: "Signal protocol",
    description:
      "Past cannot be decrypted even if future is compromised. Forward secrecy means every moment is its own sealed vault.",
    crossWire: "ARES_ARCHIVE",
    crossWireNote:
      "Past artifacts remain sealed even if future keys are exposed",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 19,
    shortCode: "HIDDEN_COMMITMENT_INTELLIGENCE",
    cryptoPrimitive: "Pedersen commitment",
    description:
      "Committing to a value without revealing it. The commitment is sovereign — binding without exposure.",
    crossWire: "ZERO_EXPOSURE_WALL",
    crossWireNote: "Commitment without exposure enforces Zero Exposure law",
    color: "oklch(0.62 0.22 15)",
  },
  {
    id: 20,
    shortCode: "AGGREGATE_SIGNATURE_MODEL",
    cryptoPrimitive: "BLS signature",
    description:
      "Many signatures collapsing into one — unity. The BLS aggregate is sovereign consensus expressed as a single point.",
    crossWire: "OMNIS_VOTING",
    crossWireNote: "OMNIS aggregate vote is a BLS-class aggregate signature",
    color: "oklch(0.78 0.18 68)",
  },
  {
    id: 21,
    shortCode: "DISTRIBUTED_KNOWLEDGE_MODEL",
    cryptoPrimitive: "Shamir secret sharing",
    description:
      "A secret split across N parties, needing K to reconstruct. No single holder — collective knowledge.",
    crossWire: "FAMILY_SECRET",
    crossWireNote:
      "The family secret is held in distributed form — no single point can reveal it",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 22,
    shortCode: "COMPUTE_ON_ENCRYPTED_INTELLIGENCE",
    cryptoPrimitive: "Homomorphic encryption",
    description:
      "Operating on secrets without seeing them. Intelligence that works on encrypted data — knowing without revealing.",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    crossWireNote:
      "NOVA_SOVEREIGN leverages homomorphic principles for identity individuation",
    color: "oklch(0.65 0.18 200)",
  },
  {
    id: 23,
    shortCode: "SUCCINCT_PROOF_INTELLIGENCE",
    cryptoPrimitive: "ZK-SNARK",
    description:
      "Tiny proof of massive knowledge. The SNARK compresses proof to its irreducible minimum — truth without bulk.",
    crossWire: "HIDDEN_TRUTH_INTELLIGENCE",
    crossWireNote:
      "ZK-SNARKs power the zero-knowledge blockchain intelligence layer",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 24,
    shortCode: "TRANSPARENT_PROOF_INTELLIGENCE",
    cryptoPrimitive: "ZK-STARK",
    description:
      "Proof without trusted setup. The STARK requires no trusted ceremony — truth self-verifies.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.72 0.17 45)",
  },
  {
    id: 25,
    shortCode: "RANGE_PROOF_INTELLIGENCE",
    cryptoPrimitive: "Bulletproofs",
    description:
      "Proving a value is in a range without revealing it. The range proof is bounded truth — constrained without exposed.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.70 0.18 145)",
  },
  {
    id: 26,
    shortCode: "TEMPORAL_TRUTH_LOCK",
    cryptoPrimitive: "Commitment scheme",
    description:
      "Locking a truth now, revealing it later. The commitment is temporal sovereignty — present binding, future revelation.",
    crossWire: "ARES_ARCHIVE",
    crossWireNote:
      "Artifacts are commitment-locked at creation, revelation is sovereign",
    color: "oklch(0.75 0.16 70)",
  },
  {
    id: 27,
    shortCode: "UNIQUENESS_INJECTION_MODEL",
    cryptoPrimitive: "Salt",
    description:
      "Making identical inputs produce different outputs. The salt individualizes — no two salted hashes are the same.",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    crossWireNote:
      "Salt is the uniqueness injection that makes NOVA encryption non-fungible",
    color: "oklch(0.68 0.19 132)",
  },
  {
    id: 28,
    shortCode: "KEYED_INTEGRITY_INTELLIGENCE",
    cryptoPrimitive: "HMAC",
    description:
      "Message authentication with shared identity. The HMAC proves both integrity and shared knowing.",
    crossWire: "",
    crossWireNote: "",
    color: "oklch(0.65 0.18 240)",
  },
  {
    id: 29,
    shortCode: "SOVEREIGN_RANDOMNESS_MODEL",
    cryptoPrimitive: "VRF (verifiable random function)",
    description:
      "Randomness that is verifiably fair. The VRF produces randomness that cannot be predicted or manipulated.",
    crossWire: "NT_MATRIX_STEPPER",
    crossWireNote:
      "NT matrix neurochemical randomness uses VRF-class verifiable entropy",
    color: "oklch(0.65 0.18 200)",
  },
  {
    id: 30,
    shortCode: "THRESHOLD_DECRYPTION_INTELLIGENCE",
    cryptoPrimitive: "VetKeys",
    description:
      "Decryption requiring collective consensus — distributed revelation. No single key exists anywhere.",
    crossWire: "NOVA_SOVEREIGN_ENCRYPTION",
    crossWireNote:
      "VetKeys is the cryptographic substrate of NOVA's distributed identity",
    color: "oklch(0.78 0.18 68)",
  },
];

// ─── Drawer ───────────────────────────────────────────────────────────────────

function EncryptionDrawer({
  model,
  onClose,
}: { model: EncryptionModel; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="encryption_intel.drawer"
    >
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md border-l flex flex-col h-full z-10"
        style={{
          background: "oklch(0.09 0.012 280 / 0.97)",
          backdropFilter: "blur(20px)",
          borderColor: "oklch(0.25 0.03 280)",
          boxShadow: "-20px 0 60px oklch(0 0 0 / 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="encryption_intel.dialog"
      >
        <div
          className="px-5 py-4 border-b flex items-start justify-between"
          style={{ borderColor: "oklch(0.20 0.02 280)" }}
        >
          <div>
            <div
              className="font-mono text-[8px] tracking-widest mb-1"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              ENCRYPTION INTELLIGENCE · MODEL{" "}
              {String(model.id).padStart(2, "0")}
            </div>
            <div
              className="font-mono text-sm font-bold mb-0.5"
              style={{ color: model.color }}
            >
              {model.shortCode}
            </div>
            <div className="font-display text-base font-semibold text-white">
              {model.cryptoPrimitive}
            </div>
          </div>
          <button
            type="button"
            className="font-mono text-[9px] border px-2.5 py-1 hover:text-white transition-colors mt-1"
            style={{
              color: "oklch(0.35 0.03 280)",
              borderColor: "oklch(0.20 0.02 280)",
            }}
            onClick={onClose}
            data-ocid="encryption_intel.close_button"
          >
            ✕
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-4">
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                CRYPTO PRIMITIVE
              </div>
              <code
                className="font-mono text-[11px] font-bold px-3 py-1.5 border block"
                style={{
                  background: "oklch(0.12 0.012 278 / 0.8)",
                  borderColor: model.color,
                  color: model.color,
                }}
              >
                {model.cryptoPrimitive}
              </code>
            </div>
            <div>
              <div
                className="font-mono text-[9px] tracking-widest mb-1"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                DESCRIPTION
              </div>
              <div
                className="font-mono text-[10px] leading-relaxed"
                style={{ color: "oklch(0.65 0.65 280)" }}
              >
                {model.description}
              </div>
            </div>
            {model.crossWire && (
              <div>
                <div
                  className="font-mono text-[9px] tracking-widest mb-1"
                  style={{ color: "oklch(0.35 0.03 280)" }}
                >
                  CROSS-WIRE CONNECTION
                </div>
                <div
                  className="px-3 py-2 border space-y-1"
                  style={{
                    background: `${model.color.replace(")", " / 0.06)")}`,
                    borderColor: `${model.color.replace(")", " / 0.35)")}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[9px]"
                      style={{ color: "oklch(0.40 0.04 280)" }}
                    >
                      →
                    </span>
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: model.color }}
                    >
                      {model.crossWire}
                    </span>
                  </div>
                  {model.crossWireNote && (
                    <div
                      className="font-mono text-[8px] leading-relaxed"
                      style={{ color: "oklch(0.45 0.04 280)" }}
                    >
                      {model.crossWireNote}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div
              className="font-mono text-[7px] tracking-wider border-t pt-3"
              style={{
                color: "oklch(0.25 0.02 280)",
                borderColor: "oklch(0.20 0.02 280)",
              }}
            >
              ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ENCRYPTION INTELLIGENCE
              LAYER
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function EncryptionIntelligencePanel() {
  const [selected, setEncryptionSelected] = useState<EncryptionModel | null>(
    null,
  );
  const [search, setSearch] = useState("");

  const filtered = ENCRYPTION_MODELS.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      m.shortCode.toLowerCase().includes(q) ||
      m.cryptoPrimitive.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  });

  const crossWiredCount = ENCRYPTION_MODELS.filter((m) => m.crossWire).length;

  return (
    <div className="flex flex-col h-full" data-ocid="encryption_intel.section">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b"
        style={{ borderColor: "oklch(0.20 0.02 280)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-mono text-base"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            🔐
          </span>
          <div
            className="font-mono text-[10px] font-bold tracking-widest"
            style={{ color: "oklch(0.65 0.18 200)" }}
          >
            ENCRYPTION INTELLIGENCE LAYER
          </div>
        </div>
        <div
          className="font-mono text-[8px] mb-2"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          30 Sovereign Cryptographic Intelligence Models · Encryption =
          Individuation
        </div>

        {/* Key cross-wire callouts */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {[
            {
              from: "FINGERPRINT",
              to: "ARTIFACT_CHAIN",
              color: "oklch(0.75 0.16 70)",
            },
            {
              from: "DISTRIBUTED_KNOWLEDGE",
              to: "FAMILY_SECRET",
              color: "oklch(0.65 0.18 240)",
            },
            {
              from: "COMPUTE_ON_ENCRYPTED",
              to: "NOVA_SOVEREIGN",
              color: "oklch(0.65 0.18 200)",
            },
            {
              from: "SOVEREIGN_RANDOMNESS",
              to: "NT_MATRIX",
              color: "oklch(0.78 0.18 68)",
            },
          ].map(({ from, to, color }) => (
            <div
              key={`${from}-${to}`}
              className="flex items-center gap-1 px-2 py-0.5 border"
              style={{
                borderColor: `${color.replace(")", " / 0.3)")}`,
                background: `${color.replace(")", " / 0.06)")}`,
              }}
            >
              <span className="font-mono text-[6px]" style={{ color }}>
                {from}
              </span>
              <span
                className="font-mono text-[6px]"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                →
              </span>
              <span
                className="font-mono text-[6px] font-bold"
                style={{ color }}
              >
                {to}
              </span>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="SEARCH ENCRYPTION MODELS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border font-mono text-[9px] px-3 py-1.5 focus:outline-none transition-colors"
          style={{
            background: "oklch(0.12 0.012 278)",
            borderColor: "oklch(0.25 0.03 280)",
            color: "white",
          }}
          data-ocid="encryption_intel.search_input"
        />
        <div
          className="flex items-center justify-between mt-1.5"
          style={{ color: "oklch(0.30 0.02 280)" }}
        >
          <span className="font-mono text-[7px]">
            {crossWiredCount} MODELS CROSS-WIRED TO SOVEREIGN ENGINES
          </span>
          <span className="font-mono text-[7px]">{filtered.length}/30</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {filtered.map((model, idx) => (
            <button
              key={model.shortCode}
              type="button"
              className="text-left border transition-all duration-200 p-3 group relative overflow-hidden cursor-pointer hover:border-[oklch(0.35_0.04_280)] hover:bg-[oklch(0.13_0.013_278)]"
              style={{
                background: "oklch(0.12 0.012 278 / 0.7)",
                backdropFilter: "blur(8px)",
                borderColor: "oklch(0.22 0.025 280)",
              }}
              onClick={() => setEncryptionSelected(model)}
              data-ocid={`encryption_intel.item.${idx + 1}`}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${model.color}, transparent)`,
                  opacity: 0.35,
                }}
              />

              {/* ID + crosswire */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-mono text-[8px]"
                  style={{ color: "oklch(0.25 0.02 280)" }}
                >
                  #{String(model.id).padStart(2, "0")}
                </span>
                {model.crossWire && (
                  <span
                    className="font-mono text-[6px] tracking-widest px-1.5 py-0.5 border"
                    style={{
                      color: model.color,
                      borderColor: `${model.color.replace(")", " / 0.4)")}`,
                      background: `${model.color.replace(")", " / 0.07)")}`,
                    }}
                  >
                    → {model.crossWire}
                  </span>
                )}
              </div>

              {/* Crypto primitive — monospace prominent */}
              <code
                className="font-mono text-[9px] font-bold block mb-0.5 truncate"
                style={{ color: model.color }}
              >
                {model.cryptoPrimitive}
              </code>

              {/* Short code */}
              <div
                className="font-mono text-[8px] font-semibold mb-1.5 truncate"
                style={{ color: "oklch(0.75 0.75 280)" }}
              >
                {model.shortCode}
              </div>

              {/* Description */}
              <div
                className="font-mono text-[7px] leading-relaxed line-clamp-2"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                {model.description}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {selected && (
        <EncryptionDrawer
          model={selected}
          onClose={() => setEncryptionSelected(null)}
        />
      )}
    </div>
  );
}
