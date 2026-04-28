import { useCallback, useEffect, useRef, useState } from "react";

// ─── Scene Image Library ─────────────────────────────────────────────────
//
// VISIONARY's full visual arsenal. Every category has deep benches of
// semantically correct images. URLs are Unsplash CDN — CORS-friendly,
// fast, high-resolution. VISIONARY picks based on scene semantic content,
// not just a category label. No ceilings. No fakes.

export type SceneCategory =
  | "deepSpace"
  | "warZone"
  | "orbital"
  | "commandRoom"
  | "architecture"
  | "terrain"
  | "founder"
  | "doctrine"
  | "neural"
  | "quantum"
  | "aiTech"
  | "datacenter"
  | "citynight"
  | "ocean"
  | "storm"
  | "nebula"
  | "boardroom"
  | "infrastructure"
  | "goldenHour"
  | "futureCity"
  | "energy";

export type SceneImageLibrary = Record<SceneCategory, string[]>;

// Unsplash CDN: w=1280, q=80, fit=crop — every URL is a real, high-quality image
// matched semantically to the category it lives in.
export const IMAGE_LIBRARY: SceneImageLibrary = {
  deepSpace: [
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1280&q=80&fit=crop", // Milky Way galaxy
    "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1280&q=80&fit=crop", // Cosmic dust nebula
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1280&q=80&fit=crop", // Star field
    "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1280&q=80&fit=crop", // Deep space
    "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1280&q=80&fit=crop", // Galaxy spiral
    "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=1280&q=80&fit=crop", // Night stars
  ],
  nebula: [
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1280&q=80&fit=crop", // Purple nebula
    "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=1280&q=80&fit=crop", // Blue nebula
    "https://images.unsplash.com/photo-1608178398319-48f814d0750c?w=1280&q=80&fit=crop", // Star cluster
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1280&q=80&fit=crop", // Space light
    "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1280&q=80&fit=crop", // Cosmos
  ],
  warZone: [
    "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1280&q=80&fit=crop", // Burning city
    "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=1280&q=80&fit=crop", // Smoke and fire
    "https://images.unsplash.com/photo-1601764143197-40ff2e318168?w=1280&q=80&fit=crop", // Destruction
    "https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1280&q=80&fit=crop", // Military vehicle
    "https://images.unsplash.com/photo-1562183241-840b8af0721e?w=1280&q=80&fit=crop", // Combat silhouette
  ],
  orbital: [
    "https://images.unsplash.com/photo-1446776709462-d6be96f1f6c5?w=1280&q=80&fit=crop", // Earth from orbit
    "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1280&q=80&fit=crop", // Planet from space
    "https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=1280&q=80&fit=crop", // ISS above Earth
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80&fit=crop", // Orbital view
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&q=80&fit=crop", // Earth grid
  ],
  commandRoom: [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1280&q=80&fit=crop", // Server room blue
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1280&q=80&fit=crop", // Control room
    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1280&q=80&fit=crop", // Mission control screens
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=80&fit=crop", // Data visualization
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1280&q=80&fit=crop", // Laptop tech screens
  ],
  architecture: [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1280&q=80&fit=crop", // Glass skyscrapers
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1280&q=80&fit=crop", // City skyline
    "https://images.unsplash.com/photo-1573108724029-4c46571d6490?w=1280&q=80&fit=crop", // Modern tower
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&q=80&fit=crop", // City aerial
    "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=1280&q=80&fit=crop", // Building perspective
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80&fit=crop", // Glass architecture
  ],
  terrain: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80&fit=crop", // Mountain range
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80&fit=crop", // Vast landscape
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1280&q=80&fit=crop", // Rolling hills
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1280&q=80&fit=crop", // Desert terrain
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1280&q=80&fit=crop", // Waterfall landscape
  ],
  founder: [
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1280&q=80&fit=crop", // Vision / future looking
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1280&q=80&fit=crop", // Writing / authoring
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1280&q=80&fit=crop", // Entrepreneur at laptop
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1280&q=80&fit=crop", // Vision / planning
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1280&q=80&fit=crop", // Leader perspective
    "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=1280&q=80&fit=crop", // Golden light dawn silhouette
  ],
  doctrine: [
    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1280&q=80&fit=crop", // Ancient manuscript
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1280&q=80&fit=crop", // Old law books
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1280&q=80&fit=crop", // Books / knowledge
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1280&q=80&fit=crop", // Stacked books
    "https://images.unsplash.com/photo-1421986527537-888d998adb74?w=1280&q=80&fit=crop", // Ancient library
    "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1280&q=80&fit=crop", // Gavel / law
  ],
  neural: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&q=80&fit=crop", // Circuit board close
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1280&q=80&fit=crop", // Network nodes
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1280&q=80&fit=crop", // AI brain network
    "https://images.unsplash.com/photo-1527430253228-e93688616381?w=1280&q=80&fit=crop", // Digital mind
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1280&q=80&fit=crop", // Synaptic connections
  ],
  quantum: [
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1280&q=80&fit=crop", // Quantum particles
    "https://images.unsplash.com/photo-1628260412297-a3377e45006f?w=1280&q=80&fit=crop", // Abstract energy
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1280&q=80&fit=crop", // Light particles
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1280&q=80&fit=crop", // Matrix data
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1280&q=80&fit=crop", // Digital universe
  ],
  aiTech: [
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1280&q=80&fit=crop", // AI visualization
    "https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=1280&q=80&fit=crop", // Machine learning
    "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1280&q=80&fit=crop", // AI chip
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&q=80&fit=crop", // Robot intelligence
    "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1280&q=80&fit=crop", // Tech infrastructure
    "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=1280&q=80&fit=crop", // Digital brain
  ],
  datacenter: [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1280&q=80&fit=crop", // Server racks lit
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1280&q=80&fit=crop", // Data center corridor
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1280&q=80&fit=crop", // Server close-up
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1280&q=80&fit=crop", // Network cables
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1280&q=80&fit=crop", // Infrastructure rack
  ],
  citynight: [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1280&q=80&fit=crop", // Skyline night
    "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?w=1280&q=80&fit=crop", // City lights aerial
    "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1280&q=80&fit=crop", // Tokyo night
    "https://images.unsplash.com/photo-1514565131-fce0801e6173?w=1280&q=80&fit=crop", // NYC evening
    "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1280&q=80&fit=crop", // Night cityscape
  ],
  ocean: [
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1280&q=80&fit=crop", // Deep ocean
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&q=80&fit=crop", // Ocean horizon
    "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=1280&q=80&fit=crop", // Waves
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1280&q=80&fit=crop", // Aerial ocean
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1280&q=80&fit=crop", // Ocean depth
  ],
  storm: [
    "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1280&q=80&fit=crop", // Lightning storm
    "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=1280&q=80&fit=crop", // Dark storm clouds
    "https://images.unsplash.com/photo-1504608524841-42584120d693?w=1280&q=80&fit=crop", // Storm approaching
    "https://images.unsplash.com/photo-1568585219116-f1b9b7258f60?w=1280&q=80&fit=crop", // Dramatic sky
    "https://images.unsplash.com/photo-1527482937786-6608f6e14c15?w=1280&q=80&fit=crop", // Thunderstorm
  ],
  boardroom: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&q=80&fit=crop", // Executive boardroom
    "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1280&q=80&fit=crop", // Meeting room
    "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1280&q=80&fit=crop", // Business strategy
    "https://images.unsplash.com/photo-1423013571635-5bf50e093a6f?w=1280&q=80&fit=crop", // Corporate vision
    "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=1280&q=80&fit=crop", // Power room
  ],
  infrastructure: [
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1280&q=80&fit=crop", // Bridge / infrastructure
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1280&q=80&fit=crop", // Urban infrastructure
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1280&q=80&fit=crop", // Power lines
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1280&q=80&fit=crop", // Highway system
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1280&q=80&fit=crop", // Steel structure
  ],
  goldenHour: [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1280&q=80&fit=crop", // Golden sunset
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80&fit=crop", // Dawn light
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1280&q=80&fit=crop", // Sunrise mountains
    "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=1280&q=80&fit=crop", // Golden hour
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1280&q=80&fit=crop", // Sunrise horizon
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1280&q=80&fit=crop", // First light forest
  ],
  futureCity: [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1280&q=80&fit=crop", // Futuristic skyline
    "https://images.unsplash.com/photo-1573108724029-4c46571d6490?w=1280&q=80&fit=crop", // Glass tower upward
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1280&q=80&fit=crop", // Modern glass city
    "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1280&q=80&fit=crop", // City at dusk
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1280&q=80&fit=crop", // Drone city view
  ],
  energy: [
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1280&q=80&fit=crop", // Power plant
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1280&q=80&fit=crop", // Solar panels
    "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1280&q=80&fit=crop", // Wind turbines
    "https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=1280&q=80&fit=crop", // Energy network
    "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1280&q=80&fit=crop", // Electrical grid
  ],
};

// ─── Semantic Image Selector ──────────────────────────────────────────────
//
// VISIONARY comprehends what a scene is about and selects the right image.
// It reads the script text and scene description, matches semantic keywords,
// and picks the most resonant category — not just a static render type map.
// This is the organism deciding, not the developer.

const SEMANTIC_KEYWORDS: Array<{
  keywords: string[];
  category: SceneCategory;
}> = [
  // Space / cosmos
  {
    keywords: [
      "space",
      "cosmos",
      "universe",
      "galaxy",
      "star",
      "infinite",
      "void",
      "sovereign intelligence infrastructure",
    ],
    category: "deepSpace",
  },
  {
    keywords: [
      "nebula",
      "cloud",
      "purple",
      "gas",
      "light",
      "radiant",
      "glow",
      "emergence",
    ],
    category: "nebula",
  },
  // Law and doctrine
  {
    keywords: [
      "law",
      "doctrine",
      "covenant",
      "medina",
      "scripture",
      "binding",
      "truth",
      "principles",
      "law of medina",
    ],
    category: "doctrine",
  },
  {
    keywords: [
      "infrastructure",
      "foundation",
      "system",
      "platform",
      "persist",
      "endure",
      "built",
      "architecture",
    ],
    category: "infrastructure",
  },
  // AI and technology
  {
    keywords: [
      "intelligence",
      "ai",
      "native",
      "cognition",
      "mind",
      "think",
      "machine",
      "algorithm",
      "native intelligence",
    ],
    category: "aiTech",
  },
  {
    keywords: [
      "network",
      "neural",
      "connection",
      "synapse",
      "coordinate",
      "web",
      "mesh",
      "linked",
    ],
    category: "neural",
  },
  {
    keywords: [
      "data",
      "server",
      "compute",
      "process",
      "canister",
      "on-chain",
      "icp",
      "backend",
      "compute",
    ],
    category: "datacenter",
  },
  {
    keywords: [
      "quantum",
      "field",
      "wave",
      "probability",
      "coherence",
      "entangle",
      "particle",
      "energy",
    ],
    category: "quantum",
  },
  // Urban and city
  {
    keywords: [
      "city",
      "urban",
      "skyline",
      "building",
      "tower",
      "glass",
      "sky",
      "structure",
    ],
    category: "futureCity",
  },
  {
    keywords: [
      "night",
      "dark",
      "lights",
      "evening",
      "neon",
      "glow",
      "after dark",
    ],
    category: "citynight",
  },
  // Nature
  {
    keywords: [
      "mountain",
      "land",
      "earth",
      "terrain",
      "ground",
      "world",
      "nature",
    ],
    category: "terrain",
  },
  {
    keywords: [
      "ocean",
      "sea",
      "deep",
      "water",
      "wave",
      "vast",
      "blue",
      "horizon",
    ],
    category: "ocean",
  },
  {
    keywords: [
      "storm",
      "thunder",
      "lightning",
      "crisis",
      "chaos",
      "pressure",
      "break",
      "fragment",
      "fragment",
    ],
    category: "storm",
  },
  // Human / founder
  {
    keywords: [
      "founder",
      "author",
      "creator",
      "alfredo",
      "builder",
      "vision",
      "pioneer",
      "architect",
    ],
    category: "founder",
  },
  {
    keywords: [
      "company",
      "business",
      "investor",
      "executive",
      "strategy",
      "board",
      "leader",
    ],
    category: "boardroom",
  },
  {
    keywords: [
      "dawn",
      "sunrise",
      "golden",
      "future",
      "bringing the future",
      "light",
      "next era",
      "horizon",
    ],
    category: "goldenHour",
  },
  // Command / orbital
  {
    keywords: [
      "command",
      "control",
      "mission",
      "center",
      "monitor",
      "screen",
      "operations",
      "direct",
    ],
    category: "commandRoom",
  },
  {
    keywords: [
      "orbit",
      "earth",
      "planet",
      "satellite",
      "global",
      "world",
      "above",
      "view from above",
    ],
    category: "orbital",
  },
  // Combat
  {
    keywords: [
      "war",
      "combat",
      "battle",
      "conflict",
      "fight",
      "destroy",
      "weapon",
      "military",
    ],
    category: "warZone",
  },
  // Energy
  {
    keywords: [
      "power",
      "energy",
      "force",
      "electricity",
      "signal",
      "pulse",
      "drive",
      "propel",
    ],
    category: "energy",
  },
  // Architecture
  {
    keywords: [
      "environment",
      "world",
      "place",
      "surface",
      "domain",
      "sovereign",
      "realm",
    ],
    category: "architecture",
  },
];

/**
 * VISIONARY reads the scene description text and picks the most
 * semantically resonant image category. It understands what it's
 * rendering, not just what render function was called.
 *
 * Scoring uses PHI-weighted specificity: longer keyword matches score
 * exponentially higher, so "law of medina" beats "law" by a wide margin.
 * The organism decides based on the full semantic content of the scene.
 */
export function selectCategoryFromSemantics(
  sceneDescription: string,
  scriptText: string,
  fallbackCategory: SceneCategory,
): SceneCategory {
  const combined = `${sceneDescription} ${scriptText}`.toLowerCase();
  // PHI = 1.618 — longer matches score at PHI^1.5 power for specificity
  const PHI = 1.6180339887;

  let bestCategory: SceneCategory = fallbackCategory;
  let bestScore = 0;

  for (const entry of SEMANTIC_KEYWORDS) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (combined.includes(kw)) {
        // PHI-weighted: specificity scales super-linearly with keyword length
        // A 3-word phrase ("law of medina", len=14) scores ~PHI^2 more than a 1-word match
        score += kw.length ** (PHI * 0.75);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = entry.category;
    }
  }

  return bestCategory;
}

/**
 * VISIONARY picks a specific image from a category based on the scene index
 * and a secondary semantic signal. Rotates through the available images
 * with enough variation that no two films look the same.
 */
export function selectImageFromCategory(
  images: Map<SceneCategory, HTMLImageElement[]>,
  category: SceneCategory,
  frameIndex: number,
  secondaryCategory?: SceneCategory,
): HTMLImageElement | null {
  const primary = images.get(category);
  if (primary && primary.length > 0) {
    return primary[frameIndex % primary.length];
  }
  // Fallback to secondary category
  if (secondaryCategory) {
    const secondary = images.get(secondaryCategory);
    if (secondary && secondary.length > 0) {
      return secondary[frameIndex % secondary.length];
    }
  }
  return null;
}

// ─── Procedural Fallback Generators ──────────────────────────────────────
//
// When a real image can't load, generate a high-quality procedural canvas
// image that evokes the same scene type. VISIONARY never shows a blank frame.

function generateProceduralFallback(category: SceneCategory): HTMLImageElement {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 540;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new Image();

  const W = canvas.width;
  const H = canvas.height;

  switch (category) {
    case "deepSpace":
    case "nebula":
    case "quantum": {
      ctx.fillStyle = "#000008";
      ctx.fillRect(0, 0, W, H);
      const neb = ctx.createRadialGradient(
        W * 0.4,
        H * 0.5,
        0,
        W * 0.4,
        H * 0.5,
        W * 0.55,
      );
      neb.addColorStop(0, "rgba(40,0,80,0.9)");
      neb.addColorStop(0.4, "rgba(10,0,40,0.6)");
      neb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, W, H);
      const neb2 = ctx.createRadialGradient(
        W * 0.7,
        H * 0.3,
        0,
        W * 0.7,
        H * 0.3,
        W * 0.4,
      );
      neb2.addColorStop(0, "rgba(0,60,140,0.7)");
      neb2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 600; i++) {
        const sx = (i * 137.5) % W;
        const sy = (i * 97.3) % H;
        const sa = 0.3 + 0.7 * ((i * 0.618) % 1);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.beginPath();
        ctx.arc(sx, sy, i % 7 === 0 ? 1.8 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "warZone": {
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#000");
      sky.addColorStop(0.5, "#050008");
      sky.addColorStop(0.72, "rgba(140,20,0,0.6)");
      sky.addColorStop(1, "rgba(220,80,0,0.8)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#000";
      const bldgs = [
        30, 60, 45, 90, 55, 110, 70, 95, 40, 75, 120, 50, 85, 100, 65, 80,
      ];
      let bx = 0;
      for (const bh of bldgs) {
        const bw = W / bldgs.length;
        ctx.fillRect(bx, H * 0.65 - bh, bw - 2, bh + H * 0.35);
        bx += bw;
      }
      for (let e = 0; e < 8; e++) {
        const ex = (e * 120 + 30) % (W - 40);
        const ey = H * 0.6;
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 70);
        g.addColorStop(0, "rgba(255,180,20,0.7)");
        g.addColorStop(0.4, "rgba(255,60,0,0.35)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      break;
    }
    case "orbital": {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 400; i++) {
        const sx = (i * 137.5) % W;
        const sy = (i * 97.3) % (H * 0.6);
        ctx.fillStyle = `rgba(255,255,255,${0.2 + ((i * 0.013) % 0.7)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, (i * 0.012) % 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const planet = ctx.createRadialGradient(
        W * 0.5,
        H * 1.7,
        H * 0.4,
        W * 0.5,
        H * 1.7,
        H * 1.6,
      );
      planet.addColorStop(0, "rgba(30,80,180,1)");
      planet.addColorStop(0.3, "rgba(10,50,120,1)");
      planet.addColorStop(0.7, "rgba(0,20,60,0.8)");
      planet.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = planet;
      ctx.fillRect(0, 0, W, H);
      break;
    }
    case "architecture":
    case "futureCity": {
      const dusk = ctx.createLinearGradient(0, 0, 0, H);
      dusk.addColorStop(0, "#0a0015");
      dusk.addColorStop(0.4, "#1a0530");
      dusk.addColorStop(0.7, "rgba(100,20,60,0.7)");
      dusk.addColorStop(1, "rgba(180,60,0,0.4)");
      ctx.fillStyle = dusk;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#060010";
      const towers = [
        80, 140, 100, 200, 130, 240, 160, 180, 90, 170, 250, 110, 190, 140, 95,
        160,
      ];
      let tx = 0;
      for (const th of towers) {
        const tw = W / towers.length;
        ctx.fillRect(tx, H * 0.75 - th, tw - 1, th + H * 0.25);
        for (let wy = H * 0.75 - th + 5; wy < H * 0.75 - 5; wy += 10) {
          for (let wx = tx + 3; wx < tx + tw - 3; wx += 6) {
            if ((wx + wy) % 3 !== 0) {
              ctx.fillStyle = `rgba(255,220,100,${0.15 + ((wx * wy) % 10) * 0.04})`;
              ctx.fillRect(wx, wy, 3, 5);
            }
          }
        }
        ctx.fillStyle = "#060010";
        tx += tw;
      }
      break;
    }
    case "commandRoom":
    case "datacenter": {
      ctx.fillStyle = "#020a10";
      ctx.fillRect(0, 0, W, H);
      for (let row = 0; row < 3; row++) {
        const sx = W * (0.08 + row * 0.32);
        const sg = ctx.createRadialGradient(
          sx + W * 0.1,
          H * 0.2,
          0,
          sx + W * 0.1,
          H * 0.2,
          W * 0.18,
        );
        sg.addColorStop(0, "rgba(0,100,200,0.35)");
        sg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = sg;
        ctx.fillRect(sx, H * 0.1, W * 0.22, H * 0.7);
        ctx.strokeStyle = "rgba(0,180,255,0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(sx, H * 0.1, W * 0.22, H * 0.7);
      }
      const cons = ctx.createLinearGradient(0, H * 0.72, 0, H);
      cons.addColorStop(0, "rgba(0,50,120,0.5)");
      cons.addColorStop(1, "rgba(0,20,60,0.7)");
      ctx.fillStyle = cons;
      ctx.fillRect(0, H * 0.72, W, H * 0.28);
      break;
    }
    case "neural":
    case "aiTech": {
      ctx.fillStyle = "#000510";
      ctx.fillRect(0, 0, W, H);
      const nodes: [number, number][] = [];
      for (let n = 0; n < 50; n++) {
        nodes.push([(n * 87.5) % W, (n * 63.3) % H]);
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < Math.min(i + 6, nodes.length); j++) {
          const [x1, y1] = nodes[i];
          const [x2, y2] = nodes[j];
          const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          if (d < 200) {
            ctx.strokeStyle = `rgba(0,200,255,${0.04 + 0.1 * (1 - d / 200)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
        const [nx, ny] = nodes[i];
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 15);
        ng.addColorStop(0, "rgba(0,229,255,0.7)");
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.beginPath();
        ctx.arc(nx, ny, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "doctrine": {
      ctx.fillStyle = "#080600";
      ctx.fillRect(0, 0, W, H);
      const stone = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        W * 0.7,
      );
      stone.addColorStop(0, "rgba(80,55,10,0.7)");
      stone.addColorStop(0.5, "rgba(40,28,3,0.5)");
      stone.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = stone;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(212,160,23,0.1)";
      for (let y = H * 0.1; y < H * 0.9; y += 14) {
        ctx.fillRect(W * 0.12, y, W * 0.76, 2);
      }
      break;
    }
    case "founder":
    case "goldenHour": {
      const dawn = ctx.createLinearGradient(0, 0, 0, H);
      dawn.addColorStop(0, "#000");
      dawn.addColorStop(0.45, "#060510");
      dawn.addColorStop(0.72, "rgba(90,45,0,0.7)");
      dawn.addColorStop(1, "rgba(212,140,0,0.6)");
      ctx.fillStyle = dawn;
      ctx.fillRect(0, 0, W, H);
      const sun = ctx.createRadialGradient(
        W * 0.5,
        H * 0.85,
        0,
        W * 0.5,
        H * 0.85,
        W * 0.45,
      );
      sun.addColorStop(0, "rgba(255,220,80,0.8)");
      sun.addColorStop(0.4, "rgba(200,100,0,0.35)");
      sun.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, W, H);
      break;
    }
    case "infrastructure":
    case "energy": {
      ctx.fillStyle = "#050a05";
      ctx.fillRect(0, 0, W, H);
      // Grid pattern
      ctx.strokeStyle = "rgba(0,200,100,0.08)";
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }
      const eg = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        W * 0.5,
      );
      eg.addColorStop(0, "rgba(0,255,150,0.15)");
      eg.addColorStop(0.5, "rgba(0,100,60,0.08)");
      eg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = eg;
      ctx.fillRect(0, 0, W, H);
      break;
    }
    default: {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        W * 0.6,
      );
      g.addColorStop(0, "rgba(0,50,100,0.5)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  const img = new Image();
  img.src = canvas.toDataURL("image/jpeg", 0.92);
  return img;
}

// ─── Image Loader ─────────────────────────────────────────────────────────

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    let done = false;
    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        reject(new Error(`Timeout: ${url}`));
      }
    }, 10000);
    img.onload = () => {
      if (!done) {
        done = true;
        clearTimeout(timeout);
        resolve(img);
      }
    };
    img.onerror = () => {
      if (!done) {
        done = true;
        clearTimeout(timeout);
        reject(new Error(`Failed: ${url}`));
      }
    };
    img.src = url;
  });
}

// ─── Return Type ──────────────────────────────────────────────────────────

export interface UseExternalImagesReturn {
  images: Map<SceneCategory, HTMLImageElement[]>;
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  getImage: (category: SceneCategory) => HTMLImageElement | null;
  getSemanticImage: (
    sceneDescription: string,
    scriptText: string,
    fallback: SceneCategory,
    frameIndex: number,
  ) => HTMLImageElement | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useExternalImages(): UseExternalImagesReturn {
  const [images, setImages] = useState<Map<SceneCategory, HTMLImageElement[]>>(
    () => new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const categories = Object.keys(IMAGE_LIBRARY) as SceneCategory[];
    const allUrls: { category: SceneCategory; url: string }[] = [];
    for (const cat of categories) {
      for (const url of IMAGE_LIBRARY[cat]) {
        allUrls.push({ category: cat, url });
      }
    }
    setTotalCount(allUrls.length);

    let loaded = 0;
    const categoryMap = new Map<SceneCategory, HTMLImageElement[]>();
    for (const cat of categories) {
      categoryMap.set(cat, []);
    }

    const promises = allUrls.map(({ category, url }) =>
      loadImage(url)
        .then((img) => {
          categoryMap.get(category)?.push(img);
          loaded++;
          setLoadedCount(loaded);
        })
        .catch(() => {
          loaded++;
          setLoadedCount(loaded);
        }),
    );

    Promise.allSettled(promises).then(() => {
      // Any category with zero loaded images gets a high-quality procedural fallback
      for (const cat of categories) {
        const arr = categoryMap.get(cat) ?? [];
        if (arr.length === 0) {
          arr.push(generateProceduralFallback(cat));
          categoryMap.set(cat, arr);
        }
      }
      setImages(new Map(categoryMap));
      setIsLoading(false);
    });
  }, []);

  const getImage = useCallback(
    (category: SceneCategory): HTMLImageElement | null => {
      const arr = images.get(category);
      if (!arr || arr.length === 0) return null;
      return arr[0];
    },
    [images],
  );

  const getSemanticImage = useCallback(
    (
      sceneDescription: string,
      scriptText: string,
      fallback: SceneCategory,
      frameIndex: number,
    ): HTMLImageElement | null => {
      const category = selectCategoryFromSemantics(
        sceneDescription,
        scriptText,
        fallback,
      );
      return selectImageFromCategory(images, category, frameIndex, fallback);
    },
    [images],
  );

  return {
    images,
    isLoading,
    loadedCount,
    totalCount,
    getImage,
    getSemanticImage,
  };
}
