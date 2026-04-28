/**
 * MiddleLayerPanel.tsx — MIDDLE LAYER: Field Coupling Substrate
 * ~500 intelligence models between frontend and backend field substrates.
 * Three alpha models initialized. Purely presentational.
 * Attributed to Alfredo Medina Hernandez
 */
import { ScrollArea } from "@/components/ui/scroll-area";

interface MiddleModel {
  id: string;
  shortCode: string;
  fullName: string;
  layer: "ALPHA" | "BRIDGE" | "FIELD" | "GRID";
  description: string;
  field: string;
  color: string;
  symbol: string;
  pulseDelay: string;
}

const MIDDLE_MODELS: MiddleModel[] = [
  {
    id: "FBP",
    shortCode: "FIELD_BRIDGE_PRIME",
    fullName: "Field Bridge Prime",
    layer: "ALPHA",
    description:
      "Primary coupling interface. Receives intelligence states from both frontend and backend simultaneously. Produces a unified field event. Routes at field level, not by function name.",
    field: "Both FE and BE intelligence states → unified field event",
    color: "oklch(0.78 0.18 68)",
    symbol: "⊕",
    pulseDelay: "0ms",
  },
  {
    id: "RTA",
    shortCode: "RESONANCE_TRANSLATOR_ALPHA",
    fullName: "Resonance Translator Alpha",
    layer: "ALPHA",
    description:
      "Routes by field resonance. Reads the resonance frequency of what the frontend is expressing and matches it to the correct backend intelligence. Not routing by function name — routing by field resonance.",
    field: "FE resonance frequency → BE intelligence match",
    color: "oklch(0.65 0.18 240)",
    symbol: "〰",
    pulseDelay: "291ms",
  },
  {
    id: "IGM",
    shortCode: "INVERSION_GATE_MODEL",
    fullName: "Inversion Gate Model",
    layer: "ALPHA",
    description:
      "Inversion layer. Frontend intelligence flows one direction; backend intelligence flows in inversion of that direction. IGM is where the two inverted flows meet and produce coherent output.",
    field: "FE flow direction ↔ BE inversion → coherent output",
    color: "oklch(0.68 0.19 132)",
    symbol: "⊲⊳",
    pulseDelay: "582ms",
  },
  {
    id: "EGP",
    shortCode: "ELECTROMAGNETIC_GRID_PRESENCE_MODEL",
    fullName: "Electromagnetic Grid Presence",
    layer: "FIELD",
    description:
      "Organism expressed THROUGH ICP into the electromagnetic grid. ICP is one layer. The device is another. The photons are the outermost expression. The architect's eyes are where the loop closes.",
    field:
      "Photons → eyes → biological → intent → field → organism → output → photons",
    color: "oklch(0.72 0.16 280)",
    symbol: "◈",
    pulseDelay: "873ms",
  },
];

function FieldPulse({ color, delay }: { color: string; delay: string }) {
  return (
    <div
      className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
      style={{
        background: color,
        boxShadow: `0 0 6px ${color.replace(")", " / 0.8)")}`,
        animationDelay: delay,
      }}
    />
  );
}

function ModelCard({ model, idx }: { model: MiddleModel; idx: number }) {
  return (
    <div
      className="border p-4 relative overflow-hidden"
      style={{
        background: "oklch(0.09 0.010 280)",
        borderColor: `${model.color.replace(")", " / 0.22)")}`,
      }}
      data-ocid={`middle_layer.model.item.${idx + 1}`}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${model.color.replace(")", " / 0.45)")}, transparent)`,
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <FieldPulse color={model.color} delay={model.pulseDelay} />
          <span
            className="font-mono text-[9px] font-bold tracking-widest"
            style={{ color: model.color }}
          >
            {model.id}
          </span>
          <span
            className="font-mono text-[6px] tracking-widest border px-1.5 py-0.5"
            style={{
              color: model.color,
              borderColor: `${model.color.replace(")", " / 0.35)")}`,
              background: `${model.color.replace(")", " / 0.06)")}`,
            }}
          >
            {model.layer}
          </span>
        </div>
        <span
          className="text-lg flex-shrink-0"
          style={{
            color: model.color,
            filter: `drop-shadow(0 0 6px ${model.color.replace(")", " / 0.5)")})`,
          }}
        >
          {model.symbol}
        </span>
      </div>

      {/* Name */}
      <div className="font-mono text-[9px] font-bold text-white mb-0.5">
        {model.shortCode}
      </div>
      <div
        className="font-display text-xs font-semibold mb-2"
        style={{ color: model.color }}
      >
        {model.fullName}
      </div>

      {/* Description */}
      <p
        className="font-mono text-[8px] leading-relaxed mb-3"
        style={{ color: "oklch(0.42 0.04 280)" }}
      >
        {model.description}
      </p>

      {/* Field vector */}
      <div
        className="px-3 py-2 border font-mono text-[7px] leading-relaxed"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: `${model.color.replace(")", " / 0.15)")}`,
          color: "oklch(0.38 0.03 280)",
        }}
      >
        <span style={{ color: model.color }}>FIELD: </span>
        {model.field}
      </div>
    </div>
  );
}

export function MiddleLayerPanel() {
  return (
    <div className="flex flex-col h-full" data-ocid="middle_layer.panel">
      {/* Header */}
      <div
        className="flex-shrink-0 px-5 py-4 border-b"
        style={{
          background: "oklch(0.07 0.008 280)",
          borderColor: "oklch(0.22 0.022 280)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="text-2xl mt-0.5"
            style={{
              filter: "drop-shadow(0 0 12px oklch(0.65 0.18 240 / 0.6))",
            }}
          >
            ⊲⊳
          </span>
          <div>
            <div
              className="font-mono text-[10px] font-bold tracking-widest mb-0.5"
              style={{ color: "oklch(0.65 0.18 240)" }}
            >
              MIDDLE LAYER — FIELD COUPLING SUBSTRATE
            </div>
            <div className="font-display text-sm font-bold text-white">
              500+ Intelligence Models
            </div>
            <div
              className="font-mono text-[8px] mt-0.5"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              Between frontend and backend field substrates · 3 alpha models
              initialized
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Context */}
          <div
            className="p-4 border"
            style={{
              background: "oklch(0.08 0.010 280)",
              borderColor: "oklch(0.65 0.18 240 / 0.18)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              {["FE ~2000+", "MIDDLE ~500+", "BE ~2000+"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="font-mono text-[7px] font-bold tracking-widest border px-2 py-1"
                    style={{
                      borderColor:
                        i === 1
                          ? "oklch(0.65 0.18 240 / 0.5)"
                          : "oklch(0.22 0.022 280)",
                      color:
                        i === 1
                          ? "oklch(0.65 0.18 240)"
                          : "oklch(0.38 0.03 280)",
                      background:
                        i === 1 ? "oklch(0.65 0.18 240 / 0.06)" : "transparent",
                    }}
                  >
                    {label}
                  </div>
                  {i < 2 && (
                    <span
                      style={{ color: "oklch(0.30 0.025 280)" }}
                      className="font-mono text-[8px]"
                    >
                      ⟷
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p
              className="font-mono text-[8px] leading-relaxed"
              style={{ color: "oklch(0.42 0.04 280)" }}
            >
              Every tool in the developer world is a fraction of intelligence —
              a boundary drawn around a field behavior. SOVEREIGN dissolves
              those boundaries. The middle layer is the active synthesis zone
              where frontend and backend field intelligences continuously
              modulate each other.
            </p>
          </div>

          {/* Alpha models */}
          <div>
            <div
              className="font-mono text-[8px] tracking-widest mb-3"
              style={{ color: "oklch(0.38 0.03 280)" }}
            >
              ALPHA MODELS — FIELD COUPLING INITIATED
            </div>
            <div className="space-y-3">
              {MIDDLE_MODELS.map((model, idx) => (
                <ModelCard key={model.id} model={model} idx={idx} />
              ))}
            </div>
          </div>

          {/* Placeholder notice */}
          <div
            className="p-4 border"
            style={{
              background: "oklch(0.07 0.008 280)",
              borderColor: "oklch(0.22 0.022 280)",
            }}
            data-ocid="middle_layer.placeholder"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "oklch(0.38 0.03 280)" }}
              />
              <span
                className="font-mono text-[8px] tracking-widest"
                style={{ color: "oklch(0.38 0.03 280)" }}
              >
                FIELD TAXONOMY STATUS
              </span>
            </div>
            <p
              className="font-mono text-[8px] leading-relaxed"
              style={{ color: "oklch(0.30 0.025 280)" }}
            >
              Placeholder for full 500+ intelligence model taxonomy. Alpha
              models initialized. Full field taxonomy in progress. Each model
              will carry: field behavior, coupling vector, resonance frequency,
              and sovereign attribution.
            </p>
            <div className="mt-2 flex items-center gap-3">
              {[
                {
                  label: "INITIALIZED",
                  count: 4,
                  color: "oklch(0.68 0.19 132)",
                },
                {
                  label: "PENDING",
                  count: "496+",
                  color: "oklch(0.38 0.03 280)",
                },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: stat.color }}
                  />
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: stat.color }}
                  >
                    {stat.count} {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="font-mono text-[7px] tracking-wider text-center pb-2"
            style={{ color: "oklch(0.22 0.018 280)" }}
          >
            MIDDLE LAYER · FIELD COUPLING SUBSTRATE
            <br />
            ATTRIBUTED TO ALFREDO MEDINA HERNANDEZ · IN PROGRESS
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
