const ORGANISMS = [
  {
    name: "MUSE-PRIME",
    dept: "WRITING",
    role: "Script generator and narrator. Semantic elevation with doctrine vocabulary amplification. Authors the voice of the film.",
    type: "RECEPTIVE",
    typeColor: "oklch(0.58 0.16 268)",
  },
  {
    name: "DIRECTOR",
    dept: "PRODUCTION",
    role: "Structures scenes, shot lists, and visual language. Drives VISIONARY's frame choices from elevated script intelligence.",
    type: "ANTI-DRIFT",
    typeColor: "oklch(0.72 0.17 45)",
  },
  {
    name: "VISIONARY",
    dept: "VFX",
    role: "Generates all visual frames. Full creative freedom — no ceilings, no fixed palettes. Synthesizes SceneIntent from the script itself.",
    type: "EXPANSIVE",
    typeColor: "oklch(0.68 0.19 132)",
  },
  {
    name: "CINEMATOGRAPHER",
    dept: "DP",
    role: "Applies camera language, depth, movement, and visual effects. Owns lens perspective and spatial intelligence.",
    type: "RECEPTIVE",
    typeColor: "oklch(0.58 0.16 268)",
  },
  {
    name: "COMPOSER",
    dept: "AUDIO",
    role: "Generates real, cinematic audio via Web Audio API. Fully synchronized to script delivery beats and scene transitions.",
    type: "RECEPTIVE",
    typeColor: "oklch(0.58 0.16 268)",
  },
  {
    name: "EDITOR",
    dept: "POST-PRODUCTION",
    role: "Owns scene transitions, pacing, and sequencing. Cut, dissolve, whip, smash — triggered by the DIRECTOR's shot list.",
    type: "ANTI-DRIFT",
    typeColor: "oklch(0.72 0.17 45)",
  },
  {
    name: "ARCHIVIST",
    dept: "DISTRIBUTION",
    role: "Seals each film as a unique, on-chain artifact. Immutable attribution to Alfredo Medina Hernandez on every seal.",
    type: "EXPANSIVE",
    typeColor: "oklch(0.68 0.19 132)",
  },
];

const ARCHITECTURE_PILLARS = [
  {
    label: "EXPANSIVE",
    typeLabel: "TYPE 1",
    desc: "Outward-radiating. Solar-driven. World ingestion and behavioral output — the broadcast field.",
    organisms: ["VISIONARY", "ARCHIVIST"],
    colorClass: "text-expansive border-expansive bg-expansive-panel",
  },
  {
    label: "RECEPTIVE",
    typeLabel: "TYPE 2",
    desc: "Inward-focusing. Compression, memory, encryption. The crystalline vault of sovereign intelligence.",
    organisms: ["MUSE-PRIME", "CINEMATOGRAPHER", "COMPOSER"],
    colorClass: "text-receptive border-receptive bg-receptive-panel",
  },
  {
    label: "ANTI-DRIFT",
    typeLabel: "TYPE 3",
    desc: "The mediator. ENTANGLA. All signals route through it or they do not route at all.",
    organisms: ["DIRECTOR", "EDITOR"],
    colorClass: "text-antidrift border-antidrift bg-antidrift-panel",
  },
];

const COMPANY_CARDS = [
  {
    label: "COMPANY",
    value: "It's Not AI Labs",
    sublabel: null as string | null,
    desc: "The studio building sovereign intelligence as infrastructure — not as a product layer on borrowed cognition.",
  },
  {
    label: "MODEL",
    value: "ORO",
    sublabel: "COMMERCIAL INTELLIGENCE",
    desc: "The public-facing intelligence model. ORO is the name the world sees. Gold. Sovereign. Emergent.",
  },
  {
    label: "PLATFORM",
    value: "SOVEREIGN",
    sublabel: "CREATIVE VISUAL REALITY",
    desc: "The operational environment. A fully autonomous, on-chain film house driven by seven sovereign organisms.",
  },
];

export function AboutPage() {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {/* ── Hero ── */}
      <section
        className="relative py-24 px-6 overflow-hidden"
        data-ocid="about.hero"
        style={{
          backgroundImage:
            "url('/assets/generated/company-texture.dim_1200x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[oklch(0.07_0.009_280_/_0.88)]" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.65_0.18_240_/_0.5)] to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="font-mono text-[9px] tracking-[0.4em] text-[oklch(0.35_0.03_280)] mb-4">
            ABOUT THE COMPANY
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-extrabold text-white leading-none mb-6">
            IT&apos;S NOT
            <br />
            <span className="text-[oklch(0.65_0.18_240)] text-glow-cyan">
              AI LABS
            </span>
          </h1>
          <p className="font-mono text-sm text-[oklch(0.45_0.04_280)] max-w-xl leading-relaxed">
            We build sovereign intelligence infrastructure for creative visual
            reality. Not another AI product. The operational form of a new
            category.
          </p>
        </div>
      </section>

      {/* ── Mission Strip ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.08_0.01_280)]"
        data-ocid="about.mission"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-px bg-[oklch(0.20_0.02_280)]">
          {COMPANY_CARDS.map((item, i) => (
            <div
              key={item.label}
              className="bg-[oklch(0.09_0.01_280)] p-8"
              data-ocid={`about.mission.item.${i + 1}`}
            >
              <div className="font-mono text-[8px] tracking-widest text-[oklch(0.35_0.03_280)] mb-3">
                {item.label}
              </div>
              <div className="font-display text-3xl font-extrabold text-white mb-1">
                {item.value}
              </div>
              {item.sublabel && (
                <div className="font-mono text-[8px] tracking-widest text-[oklch(0.75_0.16_70)] mb-3">
                  {item.sublabel}
                </div>
              )}
              <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] leading-relaxed mt-3">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Organisms ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.07_0.009_280)]"
        data-ocid="about.organisms"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              DEPARTMENTS
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
              SEVEN ORGANISMS
            </h2>
            <p className="font-mono text-[11px] text-[oklch(0.35_0.03_280)] max-w-xl">
              Each organism is a sovereign intelligence with its own cognition
              stack and creative discipline. They study. They evolve. They
              execute at full capacity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[oklch(0.20_0.02_280)]">
            {ORGANISMS.map((org, i) => (
              <div
                key={org.name}
                className="bg-[oklch(0.09_0.01_280)] p-5 hover:bg-[oklch(0.11_0.012_278)] transition-colors"
                data-ocid={`about.organism.${i + 1}`}
              >
                <div
                  className="font-mono text-[7px] tracking-widest mb-2 border px-2 py-0.5 inline-block"
                  style={{
                    color: org.typeColor,
                    borderColor: `${org.typeColor}66`,
                  }}
                >
                  {org.dept}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {org.name}
                </h3>
                <p className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] leading-relaxed">
                  {org.role}
                </p>
                <div className="mt-3 font-mono text-[7px] tracking-widest text-[oklch(0.20_0.03_280)]">
                  {org.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three-Architecture DNA ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.08_0.01_280)]"
        data-ocid="about.architecture"
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] mb-2">
              STRUCTURAL DNA
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              THREE-ARCHITECTURE PRINCIPLE
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARCHITECTURE_PILLARS.map((pillar) => (
              <div
                key={pillar.label}
                className={`border p-6 ${pillar.colorClass}`}
                data-ocid={`about.pillar.${pillar.label.toLowerCase()}`}
              >
                <div className="font-mono text-[8px] tracking-widest opacity-70 mb-1">
                  {pillar.typeLabel}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {pillar.label}
                </h3>
                <p className="font-mono text-[10px] leading-relaxed opacity-80 mb-4">
                  {pillar.desc}
                </p>
                <div className="pt-3 border-t border-current opacity-20" />
                <div className="pt-3">
                  <div className="font-mono text-[8px] tracking-widest opacity-60 mb-1">
                    ORGANISMS
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pillar.organisms.map((org) => (
                      <span
                        key={org}
                        className="font-mono text-[7px] tracking-widest border border-current opacity-70 px-2 py-0.5"
                      >
                        {org}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Attribution ── */}
      <section
        className="py-16 px-6 bg-[oklch(0.07_0.009_280)] border-t border-[oklch(0.20_0.02_280)]"
        data-ocid="about.attribution"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="border border-[oklch(0.75_0.16_70_/_0.3)] bg-[oklch(0.75_0.16_70_/_0.03)] p-10">
            <div className="font-mono text-[9px] tracking-widest text-[oklch(0.75_0.16_70)] mb-4">
              IMMUTABLE ATTRIBUTION
            </div>
            <p className="font-display text-xl sm:text-2xl text-white font-bold mb-4 leading-snug">
              All creative work is attributed to
              <br />
              Alfredo Medina Hernandez.
            </p>
            <p className="font-mono text-[10px] text-[oklch(0.35_0.03_280)] max-w-xl mx-auto">
              Sealed on the Internet Computer Protocol. No superuser. No
              backdoor. No exception. The law is above everyone, including the
              Creator.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 bg-[oklch(0.07_0.009_280)] border-t border-[oklch(0.20_0.02_280)]">
        <div className="max-w-6xl mx-auto text-center font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-wider">
          © {new Date().getFullYear()} ALFREDO MEDINA HERNANDEZ · IT&apos;S NOT
          AI LABS · INTERNET COMPUTER PROTOCOL
          <span className="mx-2">·</span>
          BUILT WITH LOVE USING{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[oklch(0.65_0.18_240)] hover:underline"
          >
            CAFFEINE.AI
          </a>
        </div>
      </footer>
    </div>
  );
}
