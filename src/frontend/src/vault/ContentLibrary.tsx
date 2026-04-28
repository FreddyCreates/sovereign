import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentStatus = "PRODUCING" | "REVIEW" | "RELEASED" | "SEALED";
type ContentCategory =
  | "FILMS"
  | "MICRO SERIES"
  | "TIKTOK"
  | "COMMERCIALS"
  | "HOSPITALITY"
  | "TRAILERS"
  | "RESEARCH";

interface ContentCard {
  id: string;
  title: string;
  category: ContentCategory;
  status: ContentStatus;
  doctrineScore: number;
  episodeCount?: number;
  duration?: string;
  archType?: string;
  beat?: bigint;
  gradient: string;
}

interface ContentDetailModalProps {
  card: ContentCard;
  onClose: () => void;
}

const GRADIENT_FILMS =
  "linear-gradient(135deg, oklch(0.14 0.025 270) 0%, oklch(0.08 0.01 280) 100%)";
const GRADIENT_MICRO_SERIES =
  "linear-gradient(135deg, oklch(0.14 0.022 240) 0%, oklch(0.08 0.01 280) 100%)";
const GRADIENT_TIKTOK =
  "linear-gradient(135deg, oklch(0.14 0.02 300) 0%, oklch(0.08 0.01 280) 100%)";
const GRADIENT_COMMERCIALS =
  "linear-gradient(135deg, oklch(0.14 0.02 45) 0%, oklch(0.08 0.01 280) 100%)";
const GRADIENT_HOSPITALITY =
  "linear-gradient(135deg, oklch(0.14 0.02 60) 0%, oklch(0.08 0.01 280) 100%)";
const GRADIENT_TRAILERS =
  "linear-gradient(135deg, oklch(0.14 0.02 25) 0%, oklch(0.08 0.01 280) 100%)";
const GRADIENT_RESEARCH =
  "linear-gradient(135deg, oklch(0.14 0.018 155) 0%, oklch(0.08 0.01 280) 100%)";

const STATUS_COLORS: Record<ContentStatus, string> = {
  PRODUCING: "oklch(0.65 0.18 240)",
  REVIEW: "oklch(0.70 0.15 55)",
  RELEASED: "oklch(0.75 0.16 70)",
  SEALED: "oklch(0.68 0.19 132)",
};

// ─── Sample hardcoded content (before backend fills it) ───────────────────────

const SEED_CONTENT: ContentCard[] = [
  {
    id: "f001",
    title: "GENESIS PROTOCOL",
    category: "FILMS",
    status: "PRODUCING",
    doctrineScore: 0.94,
    duration: "42 min",
    archType: "expansive",
    beat: 2847n,
    gradient: GRADIENT_FILMS,
  },
  {
    id: "f002",
    title: "THE MEDINA FREQUENCY",
    category: "FILMS",
    status: "REVIEW",
    doctrineScore: 0.88,
    duration: "38 min",
    archType: "antiDrift",
    beat: 2610n,
    gradient: GRADIENT_FILMS,
  },
  {
    id: "f003",
    title: "SOVEREIGN LIGHT",
    category: "FILMS",
    status: "RELEASED",
    doctrineScore: 0.97,
    duration: "51 min",
    archType: "receptive",
    beat: 2001n,
    gradient: GRADIENT_FILMS,
  },
  {
    id: "ms001",
    title: "VELA CHRONICLES · S1",
    category: "MICRO SERIES",
    status: "PRODUCING",
    doctrineScore: 0.91,
    episodeCount: 60,
    duration: "2–3 min ea",
    beat: 2900n,
    gradient: GRADIENT_MICRO_SERIES,
  },
  {
    id: "ms002",
    title: "OMNIS COURT · S1",
    category: "MICRO SERIES",
    status: "REVIEW",
    doctrineScore: 0.85,
    episodeCount: 60,
    duration: "2–3 min ea",
    beat: 2700n,
    gradient: GRADIENT_MICRO_SERIES,
  },
  {
    id: "tt001",
    title: "LAW 01 DROP",
    category: "TIKTOK",
    status: "RELEASED",
    doctrineScore: 0.89,
    duration: "30s",
    beat: 2200n,
    gradient: GRADIENT_TIKTOK,
  },
  {
    id: "tt002",
    title: "PHI RATIO REVEAL",
    category: "TIKTOK",
    status: "PRODUCING",
    doctrineScore: 0.92,
    duration: "60s",
    beat: 2910n,
    gradient: GRADIENT_TIKTOK,
  },
  {
    id: "c001",
    title: "SOVEREIGN TECH — 60s SPOT",
    category: "COMMERCIALS",
    status: "SEALED",
    doctrineScore: 0.96,
    duration: "60s",
    beat: 1800n,
    gradient: GRADIENT_COMMERCIALS,
  },
  {
    id: "h001",
    title: "ARIA HOTEL · AMBIENT",
    category: "HOSPITALITY",
    status: "RELEASED",
    doctrineScore: 0.87,
    duration: "45s",
    beat: 2300n,
    gradient: GRADIENT_HOSPITALITY,
  },
  {
    id: "tr001",
    title: "GENESIS PROTOCOL — TRAILER",
    category: "TRAILERS",
    status: "REVIEW",
    doctrineScore: 0.93,
    duration: "2 min",
    beat: 2820n,
    gradient: GRADIENT_TRAILERS,
  },
  {
    id: "r001",
    title: "PHI AS LAW — RESEARCH",
    category: "RESEARCH",
    status: "SEALED",
    doctrineScore: 0.99,
    beat: 1500n,
    gradient: GRADIENT_RESEARCH,
  },
];

// ─── Content Detail Modal ─────────────────────────────────────────────────────

function ContentDetailModal({ card, onClose }: ContentDetailModalProps) {
  const statusColor = STATUS_COLORS[card.status];
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="content-library.modal"
    >
      <div className="absolute inset-0 bg-black/75" />
      <motion.div
        className="relative w-full max-w-lg mx-4 border border-[oklch(0.25_0.03_280)] bg-[oklch(0.09_0.01_280)]"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Thumbnail */}
        <div
          className="w-full h-44 relative"
          style={{ background: card.gradient }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.4em] text-[oklch(0.35_0.03_280)]">
              {card.category}
            </span>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(180deg, transparent, oklch(0.09 0.01 280))",
            }}
          />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="font-display text-xl font-bold text-white leading-tight">
              {card.title}
            </h2>
          </div>
        </div>
        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-mono text-[9px] tracking-widest px-2 py-0.5 border"
              style={{
                color: statusColor,
                borderColor: `${statusColor.replace(")", " / 0.4)")}`,
                backgroundColor: `${statusColor.replace(")", " / 0.08)")}`,
              }}
            >
              {card.status}
            </span>
            {card.archType && (
              <span className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-2 py-0.5">
                {card.archType.toUpperCase()}
              </span>
            )}
            <span className="font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)]">
              {(card.doctrineScore * 100).toFixed(0)} DOCTRINE
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {card.duration && (
              <div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mb-0.5">
                  DURATION
                </div>
                <div className="font-mono text-xs text-white">
                  {card.duration}
                </div>
              </div>
            )}
            {card.episodeCount && (
              <div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mb-0.5">
                  EPISODES
                </div>
                <div className="font-mono text-xs text-white">
                  {card.episodeCount}
                </div>
              </div>
            )}
            {card.beat && (
              <div>
                <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider mb-0.5">
                  CREATED BEAT
                </div>
                <div className="font-mono text-xs text-white">
                  #{String(card.beat).padStart(5, "0")}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.20_0.02_280)] text-[oklch(0.35_0.03_280)] hover:text-white hover:border-white/30 px-3 py-2 transition-colors"
              onClick={onClose}
              data-ocid="content-library.close_button"
            >
              CLOSE
            </button>
            <button
              type="button"
              className="flex-1 font-mono text-[9px] tracking-widest border border-[oklch(0.75_0.16_70_/_0.4)] text-[oklch(0.75_0.16_70)] hover:bg-[oklch(0.75_0.16_70_/_0.08)] px-3 py-2 transition-colors"
              data-ocid="content-library.review_button"
            >
              SEND TO REVIEW
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────

function ContentCardItem({
  card,
  index,
  onClick,
}: {
  card: ContentCard;
  index: number;
  onClick: () => void;
}) {
  const statusColor = STATUS_COLORS[card.status];
  return (
    <motion.button
      type="button"
      className="flex-shrink-0 w-40 text-left group cursor-pointer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      data-ocid={`content-library.card.${index + 1}`}
    >
      {/* Poster */}
      <div
        className="w-full h-24 relative border border-[oklch(0.20_0.02_280)] group-hover:border-[oklch(0.75_0.16_70_/_0.5)] transition-all duration-300 overflow-hidden"
        style={{
          background: card.gradient,
          boxShadow: "0 0 0 0 transparent",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            boxShadow: "inset 0 0 20px oklch(0.75 0.16 70 / 0.12)",
          }}
        />
        {/* Status dot */}
        <div className="absolute top-2 right-2">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{
              backgroundColor: statusColor,
              boxShadow: `0 0 6px ${statusColor}`,
              animation:
                card.status === "PRODUCING" ? "pulse-dot 1.5s infinite" : "",
            }}
          />
        </div>
      </div>
      {/* Info */}
      <div className="pt-2 space-y-1">
        <div className="font-display text-xs font-semibold text-white leading-tight line-clamp-2 group-hover:text-[oklch(0.75_0.16_70)] transition-colors">
          {card.title}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-[7px] tracking-wider"
            style={{ color: statusColor }}
          >
            {card.status}
          </span>
          {card.episodeCount && (
            <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)]">
              · {card.episodeCount} EP
            </span>
          )}
        </div>
        <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)]">
          {(card.doctrineScore * 100).toFixed(0)} DOC
        </div>
      </div>
    </motion.button>
  );
}

// ─── Category Row ─────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  cards,
  onCardClick,
  onProduceNew,
}: {
  category: ContentCategory;
  cards: ContentCard[];
  onCardClick: (card: ContentCard) => void;
  onProduceNew: (cat: ContentCategory) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (cards.length === 0) return null;
  return (
    <div
      className="space-y-3"
      data-ocid={`content-library.row.${category.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-bold tracking-wider text-white">
            {category}
          </span>
          <span className="font-mono text-[8px] text-[oklch(0.30_0.02_280)]">
            {cards.length} ARTIFACTS
          </span>
        </div>
        <button
          type="button"
          className="font-mono text-[8px] tracking-widest text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.3)] px-2.5 py-1 hover:bg-[oklch(0.65_0.18_240_/_0.08)] transition-colors"
          onClick={() => onProduceNew(category)}
          data-ocid={`content-library.produce_new.${category.toLowerCase().replace(/\s+/g, "-")}`}
        >
          + PRODUCE NEW
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 px-6 scrollbar-thin"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map((card, i) => (
          <ContentCardItem
            key={card.id}
            card={card}
            index={i}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ContentLibrary() {
  const [selectedCard, setSelectedCard] = useState<ContentCard | null>(null);
  const { actor, isFetching } = useActor();

  const { data: films = [] } = useQuery({
    queryKey: ["generatedFilms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGeneratedFilms();
    },
    enabled: !!actor && !isFetching,
  });

  // Merge backend films into seed content
  const backendCards: ContentCard[] = films.map((f) => ({
    id: f.id,
    title: f.title,
    category: "FILMS" as ContentCategory,
    status: "SEALED" as ContentStatus,
    doctrineScore: 0.9,
    duration: `${Math.round(Number(f.runtimeSeconds) / 60)} min`,
    archType: typeof f.archType === "string" ? f.archType : "expansive",
    beat: f.createdAtBeat,
    gradient: GRADIENT_FILMS,
  }));

  const allCards = [
    ...backendCards,
    ...SEED_CONTENT.filter((s) => !backendCards.find((b) => b.id === s.id)),
  ];

  const categories: ContentCategory[] = [
    "FILMS",
    "MICRO SERIES",
    "TIKTOK",
    "COMMERCIALS",
    "HOSPITALITY",
    "TRAILERS",
    "RESEARCH",
  ];

  const nowProducing =
    allCards.find((c) => c.status === "PRODUCING") ?? allCards[0];
  const totalArtifacts = allCards.length;
  const avgDoctrine =
    allCards.reduce((s, c) => s + c.doctrineScore, 0) /
    Math.max(allCards.length, 1);

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--vault-panel-bg))" }}
    >
      {/* Stats bar */}
      <div className="flex-shrink-0 flex items-center gap-6 px-6 py-3 border-b border-[oklch(0.15_0.02_280)] bg-[oklch(0.09_0.01_280)]">
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider">
            TOTAL ARTIFACTS
          </div>
          <div className="font-mono text-lg font-bold text-white">
            {totalArtifacts}
          </div>
        </div>
        <div className="w-px h-8 bg-[oklch(0.20_0.02_280)]" />
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider">
            AVG DOCTRINE SCORE
          </div>
          <div className="font-mono text-lg font-bold text-[oklch(0.75_0.16_70)]">
            {(avgDoctrine * 100).toFixed(0)}%
          </div>
        </div>
        <div className="w-px h-8 bg-[oklch(0.20_0.02_280)]" />
        <div>
          <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider">
            NOW PRODUCING
          </div>
          <div className="font-mono text-xs font-bold text-[oklch(0.65_0.18_240)] truncate max-w-40">
            {nowProducing?.title ?? "—"}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-6 space-y-8">
          {/* Hero row — Now Producing */}
          {nowProducing && (
            <div className="px-6" data-ocid="content-library.hero">
              <div className="font-mono text-[8px] tracking-[0.3em] text-[oklch(0.65_0.18_240)] mb-3">
                NOW PRODUCING
              </div>
              <motion.button
                type="button"
                className="w-full relative overflow-hidden border border-[oklch(0.65_0.18_240_/_0.3)] hover:border-[oklch(0.65_0.18_240_/_0.6)] transition-all duration-300 text-left"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ background: nowProducing.gradient }}
                onClick={() => setSelectedCard(nowProducing)}
                data-ocid="content-library.hero_card"
              >
                <div
                  className="h-40 flex items-end p-5"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, oklch(0.08 0.01 280 / 0.9) 100%)",
                  }}
                >
                  <div>
                    <div className="font-mono text-[8px] tracking-widest text-[oklch(0.65_0.18_240)] mb-1">
                      {nowProducing.category}
                    </div>
                    <div className="font-display text-2xl font-bold text-white">
                      {nowProducing.title}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="font-mono text-[8px] tracking-widest px-2 py-0.5 border"
                        style={{
                          color: STATUS_COLORS[nowProducing.status],
                          borderColor: STATUS_COLORS[
                            nowProducing.status
                          ].replace(")", " / 0.4)"),
                          backgroundColor: STATUS_COLORS[
                            nowProducing.status
                          ].replace(")", " / 0.1)"),
                        }}
                      >
                        {nowProducing.status}
                      </span>
                      <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)]">
                        {(nowProducing.doctrineScore * 100).toFixed(0)} DOCTRINE
                      </span>
                      {nowProducing.duration && (
                        <span className="font-mono text-[8px] text-[oklch(0.30_0.02_280)]">
                          {nowProducing.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Pulsing border */}
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.65 0.18 240 / 0.8), transparent)",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
              </motion.button>
            </div>
          )}

          {/* Category rows */}
          {categories.map((cat) => (
            <CategoryRow
              key={cat}
              category={cat}
              cards={allCards.filter((c) => c.category === cat)}
              onCardClick={setSelectedCard}
              onProduceNew={() => {}}
            />
          ))}
        </div>
      </ScrollArea>

      {selectedCard && (
        <ContentDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
