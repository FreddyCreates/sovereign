import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus =
  | "Draft"
  | "Pending Review"
  | "Approved"
  | "Needs Revision"
  | "Rejected";

type FilterOption = "All" | ReviewStatus;

interface RevisionNote {
  round: number;
  comment: string;
  status: ReviewStatus;
  timestamp: string;
}

interface QueueItem {
  id: string;
  title: string;
  type: string;
  creationBeat: bigint;
  doctrineScore: number;
  qualitySealScore: number;
  status: ReviewStatus;
  revisionHistory: RevisionNote[];
}

// ─── Seed queue items ─────────────────────────────────────────────────────────

const SEED_QUEUE: QueueItem[] = [
  {
    id: "q001",
    title: "GENESIS PROTOCOL — ROUGH CUT 3",
    type: "FILM",
    creationBeat: 2901n,
    doctrineScore: 0.94,
    qualitySealScore: 0.88,
    status: "Pending Review",
    revisionHistory: [
      {
        round: 1,
        comment: "Opening sequence needs more PHI-ratio alignment.",
        status: "Needs Revision",
        timestamp: "Beat #2750",
      },
      {
        round: 2,
        comment: "Act 2 pacing improved. Approve pending final audio.",
        status: "Pending Review",
        timestamp: "Beat #2850",
      },
    ],
  },
  {
    id: "q002",
    title: "PHI RATIO REVEAL — TIKTOK 60s",
    type: "TIKTOK",
    creationBeat: 2910n,
    doctrineScore: 0.92,
    qualitySealScore: 0.91,
    status: "Draft",
    revisionHistory: [],
  },
  {
    id: "q003",
    title: "VELA CHRONICLES · EP 47 — ROUGH",
    type: "EPISODE",
    creationBeat: 2888n,
    doctrineScore: 0.87,
    qualitySealScore: 0.82,
    status: "Draft",
    revisionHistory: [],
  },
  {
    id: "q004",
    title: "SOVEREIGN TECH — 60s COMMERCIAL",
    type: "COMMERCIAL",
    creationBeat: 2770n,
    doctrineScore: 0.96,
    qualitySealScore: 0.95,
    status: "Approved",
    revisionHistory: [
      {
        round: 1,
        comment: "Perfect doctrine alignment. Seal this.",
        status: "Approved",
        timestamp: "Beat #2800",
      },
    ],
  },
  {
    id: "q005",
    title: "GENESIS PROTOCOL — TRAILER V2",
    type: "TRAILER",
    creationBeat: 2820n,
    doctrineScore: 0.93,
    qualitySealScore: 0.9,
    status: "Needs Revision",
    revisionHistory: [
      {
        round: 1,
        comment: "Music sync off on cliffhanger moment. Fix timing at 1:42.",
        status: "Needs Revision",
        timestamp: "Beat #2830",
      },
    ],
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReviewStatus }) {
  const styleMap: Record<ReviewStatus, { color: string; bg: string }> = {
    Draft: { color: "oklch(0.35 0.03 280)", bg: "oklch(0.35 0.03 280 / 0.1)" },
    "Pending Review": {
      color: "oklch(0.65 0.18 240)",
      bg: "oklch(0.65 0.18 240 / 0.1)",
    },
    Approved: {
      color: "oklch(0.68 0.19 132)",
      bg: "oklch(0.68 0.19 132 / 0.1)",
    },
    "Needs Revision": {
      color: "oklch(0.70 0.15 55)",
      bg: "oklch(0.70 0.15 55 / 0.1)",
    },
    Rejected: { color: "oklch(0.62 0.22 25)", bg: "oklch(0.62 0.22 25 / 0.1)" },
  };
  const s = styleMap[status];
  return (
    <span
      className="font-mono text-[8px] tracking-widest px-2 py-0.5 border"
      style={{
        color: s.color,
        borderColor: s.color.replace(")", " / 0.4)"),
        backgroundColor: s.bg,
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

// ─── Queue Row ────────────────────────────────────────────────────────────────

function QueueRow({
  item,
  index,
  onApprove,
  onRevision,
  onReject,
}: {
  item: QueueItem;
  index: number;
  onApprove: (id: string) => void;
  onRevision: (id: string, comment: string) => void;
  onReject: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  return (
    <motion.div
      className="border border-[oklch(0.20_0.02_280)] bg-[oklch(0.10_0.011_278)] hover:border-[oklch(0.25_0.03_280)] transition-colors"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      data-ocid={`review-queue.item.${index + 1}`}
    >
      {/* Header row */}
      <button
        type="button"
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Type badge */}
        <span className="font-mono text-[7px] tracking-widest text-[oklch(0.35_0.03_280)] border border-[oklch(0.20_0.02_280)] px-1.5 py-0.5 flex-shrink-0 mt-0.5">
          {item.type}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-display text-sm font-semibold text-white leading-tight mb-1 truncate">
            {item.title}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={item.status} />
            <span className="font-mono text-[8px] text-[oklch(0.75_0.16_70)]">
              DOC {(item.doctrineScore * 100).toFixed(0)}
            </span>
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              SEAL {(item.qualitySealScore * 100).toFixed(0)}
            </span>
            <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)]">
              BEAT #{String(item.creationBeat).padStart(5, "0")}
            </span>
          </div>
        </div>
        <span className="font-mono text-[8px] text-[oklch(0.25_0.02_280)] flex-shrink-0 mt-1">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded actions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="border-t border-[oklch(0.15_0.02_280)] px-4 pb-4 pt-3 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 font-mono text-[8px] tracking-widest py-2.5 border border-[oklch(0.68_0.19_132_/_0.5)] text-[oklch(0.68_0.19_132)] hover:bg-[oklch(0.68_0.19_132_/_0.1)] transition-colors"
                onClick={() => onApprove(item.id)}
                data-ocid={`review-queue.approve_button.${index + 1}`}
              >
                ✓ APPROVE
              </button>
              <button
                type="button"
                className="flex-1 font-mono text-[8px] tracking-widest py-2.5 border border-[oklch(0.70_0.15_55_/_0.5)] text-[oklch(0.70_0.15_55)] hover:bg-[oklch(0.70_0.15_55_/_0.1)] transition-colors"
                onClick={() => comment.trim() && onRevision(item.id, comment)}
                data-ocid={`review-queue.revision_button.${index + 1}`}
              >
                ⟳ REVISION
              </button>
              <button
                type="button"
                className="font-mono text-[8px] tracking-widest py-2.5 px-3 border border-[oklch(0.62_0.22_25_/_0.4)] text-[oklch(0.62_0.22_25)] hover:bg-[oklch(0.62_0.22_25_/_0.08)] transition-colors"
                onClick={() => onReject(item.id)}
                data-ocid={`review-queue.delete_button.${index + 1}`}
              >
                ✗
              </button>
            </div>

            {/* Comment input */}
            <div>
              <div className="font-mono text-[7px] text-[oklch(0.30_0.02_280)] tracking-wider mb-1">
                REVISION NOTE
              </div>
              <textarea
                className="w-full bg-[oklch(0.07_0.008_280)] border border-[oklch(0.20_0.02_280)] text-white font-mono text-[10px] p-2.5 resize-none focus:border-[oklch(0.75_0.16_70_/_0.5)] focus:outline-none transition-colors"
                rows={2}
                placeholder="Describe the revision needed..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                data-ocid={`review-queue.comment_input.${index + 1}`}
              />
            </div>

            {/* Revision history */}
            {item.revisionHistory.length > 0 && (
              <div>
                <button
                  type="button"
                  className="font-mono text-[7px] tracking-widest text-[oklch(0.30_0.02_280)] hover:text-white transition-colors"
                  onClick={() => setShowHistory((v) => !v)}
                >
                  {showHistory ? "▲" : "▼"} REVISION HISTORY (
                  {item.revisionHistory.length})
                </button>
                <AnimatePresence>
                  {showHistory && (
                    <motion.div
                      className="mt-2 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {item.revisionHistory.map((note) => (
                        <div
                          key={note.round}
                          className="border-l-2 border-[oklch(0.25_0.03_280)] pl-3 py-1"
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[7px] text-[oklch(0.30_0.02_280)]">
                              ROUND {note.round}
                            </span>
                            <StatusBadge status={note.status} />
                            <span className="font-mono text-[7px] text-[oklch(0.25_0.02_280)]">
                              {note.timestamp}
                            </span>
                          </div>
                          <div className="font-mono text-[9px] text-[oklch(0.60_0.04_280)] leading-relaxed">
                            {note.comment}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4"
      data-ocid="review-queue.empty_state"
    >
      <div className="relative">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: "oklch(0.65 0.18 240)",
            animation: "pulse-dot 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <div className="font-mono text-[10px] tracking-widest text-[oklch(0.35_0.03_280)] text-center">
        ORGANISMS ARE PRODUCING
        <br />
        <span className="text-[oklch(0.25_0.02_280)]">
          Check back in a moment.
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const FILTERS: FilterOption[] = [
  "All",
  "Draft",
  "Pending Review",
  "Approved",
  "Needs Revision",
  "Rejected",
];

export function ReviewQueue() {
  const [filter, setFilter] = useState<FilterOption>("All");
  const [items, setItems] = useState<QueueItem[]>(SEED_QUEUE);
  const qc = useQueryClient();

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      qc.invalidateQueries({ queryKey: ["generatedFilms"] });
    }, 5000);
    return () => clearInterval(id);
  }, [qc]);

  const filtered =
    filter === "All" ? items : items.filter((i) => i.status === filter);

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "Approved" as ReviewStatus } : i,
      ),
    );
  };

  const handleRevision = (id: string, comment: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: "Needs Revision" as ReviewStatus,
              revisionHistory: [
                ...i.revisionHistory,
                {
                  round: i.revisionHistory.length + 1,
                  comment,
                  status: "Needs Revision" as ReviewStatus,
                  timestamp: `Beat #${Math.floor(Math.random() * 100 + 2900)}`,
                },
              ],
            }
          : i,
      ),
    );
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "Rejected" as ReviewStatus } : i,
      ),
    );
  };

  const counts = {
    All: items.length,
    Draft: items.filter((i) => i.status === "Draft").length,
    "Pending Review": items.filter((i) => i.status === "Pending Review").length,
    Approved: items.filter((i) => i.status === "Approved").length,
    "Needs Revision": items.filter((i) => i.status === "Needs Revision").length,
    Rejected: items.filter((i) => i.status === "Rejected").length,
  };

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "oklch(var(--vault-panel-bg))" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[oklch(0.15_0.02_280)] bg-[oklch(0.09_0.01_280)] space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-sm font-bold tracking-widest text-white">
              REVIEW QUEUE
            </div>
            <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider mt-0.5">
              ROUGH DRAFTS — FOUNDER REVIEW
            </div>
          </div>
          <div className="font-mono text-[8px] text-[oklch(0.65_0.18_240)] border border-[oklch(0.65_0.18_240_/_0.3)] px-2 py-1">
            AUTO-REFRESH 5s
          </div>
        </div>
        {/* Filter tabs */}
        <div
          className="flex gap-1 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          data-ocid="review-queue.filter"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`font-mono text-[8px] tracking-widest px-2.5 py-1.5 border transition-colors flex-shrink-0 ${
                filter === f
                  ? "border-[oklch(0.75_0.16_70_/_0.5)] text-[oklch(0.75_0.16_70)] bg-[oklch(0.75_0.16_70_/_0.06)]"
                  : "border-[oklch(0.20_0.02_280)] text-[oklch(0.30_0.02_280)] hover:text-white hover:border-[oklch(0.30_0.03_280)]"
              }`}
              onClick={() => setFilter(f)}
              data-ocid={`review-queue.filter.${f.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {f}{" "}
              <span className="opacity-50">
                ({counts[f as keyof typeof counts]})
              </span>
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((item, i) => (
              <QueueRow
                key={item.id}
                item={item}
                index={i}
                onApprove={handleApprove}
                onRevision={handleRevision}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
