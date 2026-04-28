/**
 * UniverseBiblePage — SOVEREIGN Universe Bible
 * Characters · Locations · Doctrine Themes
 * ARCHIVIST runs continuously — AUTO-BUILD always active
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Globe, Layers, Loader2, MapPin, User } from "lucide-react";
import { useUniverseBible } from "../../hooks/useStudioFeatures";
import type { UniverseBibleEntry } from "../../hooks/useStudioFeatures";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CyclingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-8 text-center w-full justify-center">
      <Loader2
        className="w-3 h-3 animate-spin"
        style={{ color: "oklch(0.65 0.18 240 / 0.6)" }}
      />
      <span
        className="font-mono text-[8px] tracking-widest"
        style={{ color: "oklch(0.35 0.03 280)" }}
      >
        ARCHIVIST CYCLING — {label} BUILDING
      </span>
    </div>
  );
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  type,
}: {
  entry: UniverseBibleEntry;
  type: "character" | "location" | "doctrine";
}) {
  const colorMap = {
    character: "oklch(0.72 0.17 45)",
    location: "oklch(0.65 0.18 240)",
    doctrine: "oklch(0.75 0.16 70)",
  };
  const borderMap = {
    character: "oklch(0.72 0.17 45 / 0.25)",
    location: "oklch(0.65 0.18 240 / 0.25)",
    doctrine: "oklch(0.75 0.16 70 / 0.25)",
  };

  const name =
    entry.characterName ?? entry.locationName ?? entry.doctrineTheme ?? "—";
  const accentColor = colorMap[type];
  const borderColor = borderMap[type];

  return (
    <div
      className="border p-3 space-y-2 hover:opacity-90 transition-opacity"
      style={{
        borderColor,
        background: `${accentColor.replace(")", " / 0.03)")}`,
      }}
      data-ocid={`universe-bible.entry.${type}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="font-display text-[11px] font-semibold leading-tight"
          style={{ color: accentColor }}
        >
          {name}
        </span>
        {entry.appearsInFilms.length > 0 && (
          <span
            className="font-mono text-[8px] flex-shrink-0"
            style={{ color: "oklch(0.35 0.03 280)" }}
          >
            {entry.appearsInFilms.length} film
            {entry.appearsInFilms.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <p
        className="font-body text-[10px] leading-relaxed"
        style={{ color: "oklch(0.55 0.04 280)" }}
      >
        {entry.description}
      </p>
      {entry.appearsInFilms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.appearsInFilms.slice(0, 3).map((film) => (
            <span
              key={film}
              className="font-mono text-[7px] px-1.5 py-0.5 border"
              style={{
                borderColor: `${accentColor.replace(")", " / 0.2)")}`,
                color: "oklch(0.45 0.04 280)",
              }}
            >
              {film.slice(0, 24)}
            </span>
          ))}
          {entry.appearsInFilms.length > 3 && (
            <span
              className="font-mono text-[7px]"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              +{entry.appearsInFilms.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────

function BibleColumn({
  title,
  icon,
  entries,
  type,
  accentColor,
}: {
  title: string;
  icon: React.ReactNode;
  entries: UniverseBibleEntry[];
  type: "character" | "location" | "doctrine";
  accentColor: string;
}) {
  return (
    <div className="flex flex-col border border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)] overflow-hidden">
      {/* Column header */}
      <div
        className="px-4 py-3 border-b border-[oklch(0.20_0.02_280)] flex items-center gap-2 flex-shrink-0"
        style={{ background: `${accentColor.replace(")", " / 0.05)")}` }}
      >
        <span style={{ color: accentColor }}>{icon}</span>
        <span
          className="font-mono text-[9px] tracking-widest font-bold"
          style={{ color: accentColor }}
        >
          {title}
        </span>
        <span
          className="ml-auto font-mono text-[8px]"
          style={{ color: "oklch(0.35 0.03 280)" }}
        >
          {entries.length}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {entries.length === 0 ? (
            <CyclingIndicator label={title} />
          ) : (
            entries.map((entry, i) => (
              <EntryCard
                key={
                  entry.characterName ??
                  entry.locationName ??
                  entry.doctrineTheme ??
                  i
                }
                entry={entry}
                type={type}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function UniverseBiblePage() {
  const { data: entries = [], isLoading } = useUniverseBible();

  const characters = entries.filter((e) => e.characterName != null);
  const locations = entries.filter((e) => e.locationName != null);
  const doctrines = entries.filter((e) => e.doctrineTheme != null);

  return (
    <div
      className="h-full flex flex-col bg-[oklch(0.06_0.008_280)] overflow-hidden"
      data-ocid="universe-bible.page"
    >
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-[oklch(0.20_0.02_280)] bg-[oklch(0.08_0.01_280)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen
                className="w-4 h-4"
                style={{ color: "oklch(0.75 0.16 70)" }}
              />
              <h1
                className="font-display text-lg font-extrabold tracking-widest"
                style={{ color: "oklch(0.75 0.16 70)" }}
              >
                SOVEREIGN UNIVERSE BIBLE
              </h1>
            </div>
            <p
              className="font-mono text-[9px] tracking-wider"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              CHARACTERS · LOCATIONS · DOCTRINE THEMES · AUTO-BUILT BY ARCHIVIST
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Loader2
                className="w-3 h-3 animate-spin"
                style={{ color: "oklch(0.65 0.18 240)" }}
              />
            ) : (
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.68 0.19 132)" }}
              />
            )}
            <span
              className="font-mono text-[7px] tracking-widest"
              style={{ color: "oklch(0.35 0.03 280)" }}
            >
              AUTO-BUILD
            </span>
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-3 flex items-center gap-6">
          {[
            {
              label: "CHARACTERS",
              count: characters.length,
              color: "oklch(0.72 0.17 45)",
            },
            {
              label: "LOCATIONS",
              count: locations.length,
              color: "oklch(0.65 0.18 240)",
            },
            {
              label: "DOCTRINE THEMES",
              count: doctrines.length,
              color: "oklch(0.75 0.16 70)",
            },
            {
              label: "TOTAL ENTRIES",
              count: entries.length,
              color: "oklch(0.55 0.04 280)",
            },
          ].map(({ label, count, color }) => (
            <div key={label}>
              <span
                className="font-mono text-[7px] tracking-widest"
                style={{ color: "oklch(0.35 0.03 280)" }}
              >
                {label}
              </span>
              <div
                className="font-mono text-base font-bold leading-none mt-0.5"
                style={{ color }}
              >
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three-column grid */}
      <div className="flex-1 min-h-0 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <BibleColumn
          title="CHARACTERS"
          icon={<User className="w-3 h-3" />}
          entries={characters}
          type="character"
          accentColor="oklch(0.72 0.17 45)"
        />
        <BibleColumn
          title="LOCATIONS"
          icon={<MapPin className="w-3 h-3" />}
          entries={locations}
          type="location"
          accentColor="oklch(0.65 0.18 240)"
        />
        <BibleColumn
          title="DOCTRINE THEMES"
          icon={<Layers className="w-3 h-3" />}
          entries={doctrines}
          type="doctrine"
          accentColor="oklch(0.75 0.16 70)"
        />
      </div>

      {/* Footer attribution */}
      <div
        className="flex-shrink-0 px-6 py-3 border-t border-[oklch(0.20_0.02_280)] flex items-center justify-between"
        style={{ background: "oklch(0.08 0.01 280)" }}
      >
        <div className="flex items-center gap-2">
          <Globe
            className="w-3 h-3"
            style={{ color: "oklch(0.35 0.03 280)" }}
          />
          <span
            className="font-mono text-[7px] tracking-wider"
            style={{ color: "oklch(0.25 0.02 280)" }}
          >
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · SEALED ON-CHAIN · IMMUTABLE
          </span>
        </div>
        <span
          className="font-mono text-[7px]"
          style={{ color: "oklch(0.20 0.02 280)" }}
        >
          φ=1.6180339887
        </span>
      </div>
    </div>
  );
}
