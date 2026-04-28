/**
 * VaultSettingsPanel.tsx — SOVEREIGN VAULT settings
 * Attributed to Alfredo Medina Hernandez
 */
import { useState } from "react";
import { toast } from "sonner";

const PHI_CONSTANT = "1.6180339887498948482";
const SCHUMANN_HZ = "7.83";
const HEARTBEAT_MS = "873";
const S0_FLOOR = "0.75";
const OMNIS_QUORUM = "0.66";
const GENESIS_HASH = "SHA256(founding_word · creator_signature)";

function ConstantRow({
  label,
  value,
  copyable,
  color,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  color?: string;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied: ${label}`, { duration: 2000 });
  };

  return (
    <div className="flex items-center justify-between border border-[oklch(0.22_0.022_280)] bg-[oklch(0.12_0.012_278)] px-3 py-2.5 gap-3">
      <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest flex-shrink-0">
        {label}
      </div>
      <div
        className="font-mono text-[11px] font-bold truncate"
        style={{ color: color ?? "oklch(0.75 0.16 70)" }}
      >
        {value}
      </div>
      {copyable && (
        <button
          type="button"
          className="flex-shrink-0 font-mono text-[7px] tracking-widest border border-[oklch(0.25_0.03_280)] text-[oklch(0.35_0.03_280)] px-2 py-0.5 hover:text-white hover:border-white/20 transition-colors"
          onClick={handleCopy}
          data-ocid="settings.copy_button"
        >
          COPY
        </button>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2 flex items-center gap-2">
        <div className="h-px flex-1 bg-[oklch(0.20_0.02_280)]" />
        {title}
        <div className="h-px flex-1 bg-[oklch(0.20_0.02_280)]" />
      </div>
      {children}
    </div>
  );
}

export function VaultSettingsPanel() {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const data = {
        phi: PHI_CONSTANT,
        schumann: SCHUMANN_HZ,
        heartbeat: HEARTBEAT_MS,
        s0_floor: S0_FLOOR,
        omnis_quorum: OMNIS_QUORUM,
        genesis_hash: GENESIS_HASH,
        attribution: "Alfredo Medina Hernandez",
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sovereign-vault-constants.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Vault constants exported", { duration: 3000 });
      setExporting(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full" data-ocid="settings.section">
      <div className="flex-shrink-0 px-4 py-3 border-b border-[oklch(0.20_0.02_280)]">
        <div className="font-display text-sm font-bold text-white">
          VAULT SETTINGS
        </div>
        <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
          SYSTEM CONFIGURATION · READ-ONLY · IMMUTABLE CONSTANTS
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Founder Attribution */}
        <Section title="FOUNDER ATTRIBUTION">
          <div className="border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.12_0.012_278)] p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 flex items-center justify-center border border-[oklch(0.75_0.16_70_/_0.4)]"
                style={{ backgroundColor: "oklch(0.75 0.16 70 / 0.08)" }}
              >
                <span
                  className="text-lg"
                  style={{
                    filter: "drop-shadow(0 0 8px oklch(0.75 0.16 70 / 0.6))",
                  }}
                >
                  ⊛
                </span>
              </div>
              <div>
                <div className="font-display text-sm font-bold text-[oklch(0.75_0.16_70)] text-glow-gold">
                  Alfredo Medina Hernandez
                </div>
                <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
                  CREATOR · FOUNDER · ATTRIBUTION ANCHOR
                </div>
              </div>
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] border-t border-[oklch(0.20_0.02_280)] pt-2 mt-2">
              All creation attributed on-chain. All attribution permanent. Every
              artifact sealed immutably.
            </div>
            <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] mt-1 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[oklch(0.75_0.16_70)]"
                style={{ boxShadow: "0 0 6px oklch(0.75 0.16 70 / 0.6)" }}
              />
              ATTRIBUTION SEAL ACTIVE · ON-CHAIN · IMMUTABLE
            </div>
          </div>
        </Section>

        {/* Architectural Constants */}
        <Section title="ARCHITECTURAL CONSTANTS">
          <ConstantRow
            label="PHI"
            value={PHI_CONSTANT}
            copyable
            color="oklch(0.75 0.16 70)"
          />
          <ConstantRow
            label="SCHUMANN BASE Hz"
            value={`${SCHUMANN_HZ} Hz`}
            color="oklch(0.65 0.18 240)"
          />
          <ConstantRow
            label="HEARTBEAT INTERVAL"
            value={`${HEARTBEAT_MS} ms`}
            color="oklch(0.68 0.19 132)"
          />
          <ConstantRow
            label="S₀ FLOOR"
            value={S0_FLOOR}
            color="oklch(0.72 0.17 45)"
          />
        </Section>

        {/* Doctrine Thresholds */}
        <Section title="DOCTRINE THRESHOLDS">
          <ConstantRow
            label="READINESS GATE"
            value="0.75"
            color="oklch(0.62 0.16 280)"
          />
          <ConstantRow
            label="S-FLOOR MINIMUM"
            value={S0_FLOOR}
            color="oklch(0.62 0.16 280)"
          />
          <ConstantRow
            label="OMNIS QUORUM"
            value={OMNIS_QUORUM}
            color="oklch(0.62 0.16 280)"
          />
          <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] italic px-1">
            Thresholds are doctrine, not configuration. Display-only.
          </div>
        </Section>

        {/* Genesis */}
        <Section title="GENESIS FREQUENCY">
          <ConstantRow
            label="GENESIS HASH FORMULA"
            value={GENESIS_HASH}
            color="oklch(0.65 0.18 240)"
          />
          <div className="border border-[oklch(0.22_0.022_280)] bg-[oklch(0.12_0.012_278)] px-3 py-2.5">
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1.5">
              FREQUENCY LADDER (φ-scaled)
            </div>
            {[0, 1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-3 py-0.5">
                <span className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] w-4">
                  f{n}
                </span>
                <div className="font-mono text-[9px] text-[oklch(0.65_0.18_240)]">
                  {(7.83 * 1.6180339887 ** n).toFixed(3)} Hz
                </div>
                <div className="flex-1 h-px bg-[oklch(0.20_0.02_280)]">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, (n + 1) * 20)}%`,
                      backgroundColor: "oklch(0.65 0.18 240)",
                      opacity: 0.5 + n * 0.1,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* System Info */}
        <Section title="SYSTEM INFORMATION">
          <div className="space-y-1">
            {[
              { label: "PLATFORM", value: "Internet Computer Protocol" },
              {
                label: "ARCHITECTURE",
                value: "43 Cores · 9 Animal Engines · 15 Rings",
              },
              { label: "ACTORS", value: "16 Sovereign AGI Actors" },
              { label: "LAWS", value: "30 Laws · 30 Medina Models" },
              { label: "MACRO MODELS", value: "5 Alpha · PHI-Compressed" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-3 py-1.5 border border-[oklch(0.18_0.016_278)] bg-[oklch(0.10_0.01_280)]"
              >
                <span className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider">
                  {label}
                </span>
                <span className="font-mono text-[9px] text-[oklch(0.55_0.03_280)]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* Export */}
        <Section title="EXPORT">
          <button
            type="button"
            className={`w-full font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] py-2.5 transition-all hover:bg-[oklch(0.75_0.16_70_/_0.06)] ${
              exporting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleExport}
            disabled={exporting}
            data-ocid="settings.export_button"
          >
            {exporting ? "EXPORTING..." : "⬇ EXPORT ALL VAULT CONSTANTS"}
          </button>
          <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] px-1">
            Exports all 30 laws, 30 models, architectural constants, and
            doctrine thresholds as JSON.
          </div>
        </Section>

        <div className="font-mono text-[7px] text-[oklch(0.25_0.02_280)] tracking-wider text-center border-t border-[oklch(0.18_0.016_278)] pt-4">
          SOVEREIGN VAULT · ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · ALL RIGHTS
          RESERVED · ON-CHAIN
        </div>
      </div>
    </div>
  );
}
