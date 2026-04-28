/**
 * GovernancePanel — Sentient Governance organism-authored doctrine feed
 *
 * Organisms that reach mastery author doctrines. Doctrines are sealed on-chain.
 * All values from useGovernanceState() — no hardcoded laws.
 *
 * Also exports GovernanceDoctrineExcerpt — a compact 3-4 line card
 * for use inside FilmLibraryCard to show the doctrine authored by the
 * governing organism for that film.
 *
 * © Alfredo Medina Hernandez — immutable attribution
 */

import { Lock } from "lucide-react";
import { useGovernanceState } from "../../hooks/useQueries";

const PHI = 1.6180339887;

// ─── Law Family Colors ─────────────────────────────────────────────────────

function lawFamilyColor(family: string): string {
  const f = family.toLowerCase();
  if (f.includes("expans")) return "text-[oklch(0.68_0.19_132)]";
  if (f.includes("recept")) return "text-[oklch(0.58_0.16_268)]";
  if (f.includes("anti") || f.includes("drift") || f.includes("mediat"))
    return "text-[oklch(0.72_0.17_45)]";
  if (f.includes("phi") || f.includes("harmonic"))
    return "text-[oklch(0.75_0.16_70)]";
  return "text-[oklch(0.65_0.18_240)]";
}

function lawFamilyBgColor(family: string): string {
  const f = family.toLowerCase();
  if (f.includes("expans")) return "oklch(0.68 0.19 132)";
  if (f.includes("recept")) return "oklch(0.58 0.16 268)";
  if (f.includes("anti") || f.includes("drift") || f.includes("mediat"))
    return "oklch(0.72 0.17 45)";
  if (f.includes("phi") || f.includes("harmonic")) return "oklch(0.75 0.16 70)";
  return "oklch(0.65 0.18 240)";
}

// ─── Compact Doctrine Excerpt for Film Cards ──────────────────────────────

interface GovernanceDoctrineExcerptProps {
  /** The organism whose doctrine to display — matched by authorOrganism */
  organismName: string;
}

export function GovernanceDoctrineExcerpt({
  organismName,
}: GovernanceDoctrineExcerptProps) {
  const { data: gov } = useGovernanceState();
  const doctrines = gov?.doctrines ?? [];
  const masteredOrganisms = gov?.masteredOrganisms ?? [];

  // Find most recent doctrine authored by this organism
  const doc = [...doctrines]
    .filter(
      (d) =>
        d.authorOrganism.toLowerCase().includes(organismName.toLowerCase()) ||
        organismName.toLowerCase().includes(d.authorOrganism.toLowerCase()),
    )
    .sort((a, b) => Number(b.beatAuthored) - Number(a.beatAuthored))[0];

  const isMastered = masteredOrganisms.some(
    (n) =>
      n.toLowerCase().includes(organismName.toLowerCase()) ||
      organismName.toLowerCase().includes(n.toLowerCase()),
  );

  if (!doc) {
    return (
      <div
        className="border border-white/5 bg-white/[0.01] px-2 py-2"
        data-ocid="governance.doctrine.excerpt.pending"
      >
        <div className="font-mono text-[7px] text-white/25 tracking-widest mb-0.5">
          DOCTRINE PENDING
        </div>
        <div className="font-mono text-[7px] text-white/15 italic">
          {isMastered
            ? "Doctrine being authored — sealing soon"
            : "Organism Evolving — Doctrine unlocks at mastery"}
        </div>
      </div>
    );
  }

  const familyColor = lawFamilyColor(doc.lawFamily);
  const bgColor = lawFamilyBgColor(doc.lawFamily);

  // Truncate to ~4 lines max (~200 chars)
  const excerptText =
    doc.doctrineText.length > 200
      ? `${doc.doctrineText.slice(0, 197)}…`
      : doc.doctrineText;

  return (
    <div
      className="border border-white/8 px-2 py-2"
      style={{
        background: `${bgColor.replace(")", " / 0.03)")}`,
        borderColor: `${bgColor.replace(")", " / 0.2)")}`,
      }}
      data-ocid="governance.doctrine.excerpt"
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`font-mono text-[7px] font-bold tracking-widest ${familyColor}`}
        >
          ★ {doc.authorOrganism} · DOCTRINE AUTHORED
        </span>
        <span className="font-mono text-[6px] text-white/20">
          BEAT {String(doc.beatAuthored)}
        </span>
      </div>
      <div className="font-mono text-[8px] text-white/60 italic leading-relaxed">
        &ldquo;{excerptText}&rdquo;
      </div>
      <div className="font-mono text-[6px] text-white/20 mt-1">
        φ {(doc.strengthValue * PHI).toFixed(2)} · SEALED ON-CHAIN
      </div>
    </div>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────

export function GovernancePanel() {
  const { data: gov } = useGovernanceState();

  const doctrines = gov?.doctrines ?? [];
  const masteredOrganisms = gov?.masteredOrganisms ?? [];
  const totalDoctrines = gov?.totalDoctrines ?? 0n;
  const recentDoctrines = [...doctrines]
    .sort((a, b) => Number(b.beatAuthored) - Number(a.beatAuthored))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-3" data-ocid="governance.panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[oklch(0.72_0.17_45)]" />
          <div>
            <div className="font-mono text-[10px] font-bold tracking-widest text-white">
              SENTIENT GOVERNANCE
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mt-0.5">
              ORGANISM-AUTHORED DOCTRINE · ON-CHAIN
            </div>
          </div>
        </div>
        <div className="font-mono text-[9px] font-bold text-[oklch(0.75_0.16_70)]">
          {String(totalDoctrines)}
          <span className="text-[7px] text-[oklch(0.35_0.03_280)] ml-1">
            AUTHORED
          </span>
        </div>
      </div>

      {/* Mastered organisms */}
      {masteredOrganisms.length > 0 && (
        <div className="border border-[oklch(0.75_0.16_70_/_0.2)] bg-[oklch(0.75_0.16_70_/_0.03)] p-2">
          <div className="font-mono text-[7px] text-[oklch(0.35_0.03_280)] tracking-widest mb-1.5">
            ORGANISMS AT MASTERY · DOCTRINE AUTHORING ENABLED
          </div>
          <div className="flex flex-wrap gap-1">
            {masteredOrganisms.map((name) => (
              <span
                key={name}
                className="font-mono text-[7px] border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)] px-1.5 py-0.5"
              >
                ★ {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Doctrine feed */}
      {recentDoctrines.length > 0 ? (
        <div className="space-y-2">
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
            RECENT DOCTRINES
          </div>
          {recentDoctrines.map((doc, i) => {
            const familyColor = lawFamilyColor(doc.lawFamily);
            const bgColor = lawFamilyBgColor(doc.lawFamily);
            const strengthPct = Math.min(100, doc.strengthValue * 100);
            return (
              <div
                key={String(doc.id)}
                className="border p-3"
                style={{
                  borderColor: `${bgColor.replace(")", " / 0.25)")}`,
                  background: `${bgColor.replace(")", " / 0.04)")}`,
                }}
                data-ocid={`governance.doctrine.${i + 1}`}
              >
                {/* Meta row */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-[7px] border px-1.5 py-0.5 tracking-widest ${familyColor} border-current`}
                  >
                    {doc.lawFamily.toUpperCase()}
                  </span>
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    BEAT {String(doc.beatAuthored)}
                  </span>
                </div>

                {/* Organism */}
                <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] tracking-widest mb-1">
                  {doc.authorOrganism}
                </div>

                {/* Doctrine text (3-4 line clamp) */}
                <div className="font-mono text-[9px] text-white/70 leading-relaxed line-clamp-4 italic mb-1.5">
                  &ldquo;{doc.doctrineText}&rdquo;
                </div>

                {/* PHI strength bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-white/5">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${strengthPct}%`,
                        backgroundColor: bgColor,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[7px] text-[oklch(0.35_0.03_280)]">
                    φ{(doc.strengthValue * PHI).toFixed(2)}
                  </span>
                </div>

                {/* Attribution */}
                <div className="font-mono text-[7px] text-white/20 mt-1.5">
                  Authored by Alfredo Medina Hernandez
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="border border-[oklch(0.20_0.02_280)] p-4 text-center"
          data-ocid="governance.empty"
        >
          <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] tracking-widest">
            NO DOCTRINES AUTHORED YET
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] mt-1">
            Organisms reach mastery → author doctrine → sealed on-chain
          </div>
        </div>
      )}

      {/* Attribution footer */}
      <div className="font-mono text-[7px] text-white/10 tracking-widest border-t border-white/5 pt-2">
        PHI={PHI} · DOCTRINES AUTHORED BY SOVEREIGN ORGANISMS · IMMUTABLE
      </div>
    </div>
  );
}
