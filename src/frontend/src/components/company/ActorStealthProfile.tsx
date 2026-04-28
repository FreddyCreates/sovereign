/**
 * ActorStealthProfile.tsx — Stealth profile page for a sovereign actor.
 * Reads EXACTLY like a real human creative professional's personal website.
 * Zero AI language. Zero "algorithm" or "synthetic" references.
 * PHI = 1.6180339887 · © Alfredo Medina Hernandez
 */

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ARCHETYPE_TONE_MAP,
  type ArchetypeToneGroup,
  PHI,
  SOVEREIGN_ACTORS,
  type SovereignActor,
} from "../../hooks/useActors";
import { ActorIntelligencePanel } from "./ActorIntelligencePanel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StealthProfileData {
  actorId: number;
  tagline: string;
  location: string;
  stealthBio: string;
  craftNotes: CraftNote[];
  frequentCollaborators: string[];
  awards: AwardEntry[];
  pressQuotes: PressQuote[];
}

export interface CraftNote {
  title: string;
  body: string;
  date: string;
}

export interface AwardEntry {
  label: string;
  year: string;
}

export interface PressQuote {
  quote: string;
  source: string;
}

// ─── Stealth profile content per actor (human-voiced, no AI language) ─────────

const STEALTH_PROFILES: Record<number, Omit<StealthProfileData, "actorId">> = {
  0: {
    // Kalani Medina — Hero
    tagline: "Every character I play is asking the same question underneath.",
    location: "Los Angeles, CA",
    stealthBio:
      "I've always been drawn to stories about people who have to become something different to survive. Not heroes in the traditional sense — just people under pressure finding out what they're actually made of. I spent years training in physical theatre before I understood that stillness was the real performance. My work now tries to hold both: the body moving, the interior quiet. I'm drawn to projects that don't explain themselves too much.",
    craftNotes: [
      {
        title: "On carrying a scene without dialogue",
        body: "The director told me the camera would be on my back for three minutes. No cuts. I had to trust that what I was feeling would travel through. It did. I still don't fully understand how.",
        date: "February 2025",
      },
      {
        title: "Why I stopped preparing the way I used to",
        body: "I used to build a character from the outside in — research, physicality, accent, wardrobe. Now I start from one sentence about what they want that they can't say out loud. Everything else comes from that.",
        date: "October 2024",
      },
    ],
    frequentCollaborators: ["Elias Verdana", "Yara Constanta", "Nairobi Vex"],
    awards: [
      { label: "SOVEREIGN Ensemble Award — Lead", year: "2024" },
      { label: "Kinetic Performance Citation", year: "2023" },
    ],
    pressQuotes: [
      {
        quote:
          "Medina has a presence on screen that's hard to locate but impossible to ignore.",
        source: "Film Quarterly",
      },
    ],
  },
  1: {
    // Elias Verdana — Mentor
    tagline:
      "Stillness is the most demanding thing I've learned to do on screen.",
    location: "London, UK",
    stealthBio:
      "I came to acting late — thirty-two, after a decade working in education. I think that's why I'm comfortable with pauses, with weight, with the way a scene can carry something historical without announcing it. I'm interested in men who have already paid for something, who carry that cost in their body. Audiences can feel when a character has actually lived. I try to make sure they're feeling something real.",
    craftNotes: [
      {
        title: "What teaching gave me",
        body: "I stood in front of rooms full of people for ten years before I stood in front of a camera. That teaches you that attention is earned, not demanded. It also teaches you that the most important thing you can do for someone is to let them think they discovered it themselves.",
        date: "March 2025",
      },
    ],
    frequentCollaborators: ["Kiran Dasa", "Cyrus Altan", "Kalani Medina"],
    awards: [
      { label: "SOVEREIGN Ensemble Award — Supporting", year: "2024" },
      { label: "Heritage Performance Citation", year: "2023" },
    ],
    pressQuotes: [
      {
        quote:
          "Verdana understands that gravitas is something you earn, slowly.",
        source: "The Criterion",
      },
    ],
  },
  2: {
    // Soren Blackthorn — Shadow
    tagline: "The most interesting characters are the ones who are right.",
    location: "Berlin, Germany",
    stealthBio:
      "I've never played a villain. I've played people who made a decision that the story disagrees with. That's a different project. I'm interested in systems — how people become the logical conclusion of the environment they grew up in, and how that collision with a different system reads on screen. I trained at a physical theatre conservatory in Copenhagen and spent three years in ensemble work before film. The ensemble trained me not to compete with the room.",
    craftNotes: [
      {
        title: "On not signaling",
        body: "Early in my career I worked hard to let the audience know a character was dangerous. Later I understood that's exactly what makes a character not dangerous. Real threat is casual.",
        date: "January 2025",
      },
    ],
    frequentCollaborators: ["Aurelius Kaine", "Fox Anansi", "Seraphina Luz"],
    awards: [{ label: "SOVEREIGN Complex Performance Award", year: "2024" }],
    pressQuotes: [
      {
        quote: "Blackthorn plays contradiction with surgical precision.",
        source: "Screen International",
      },
    ],
  },
  3: {
    // Amara Soleil — Lover
    tagline: "Connection is the only thing worth filming.",
    location: "Paris, France",
    stealthBio:
      "I've spent my career studying how people reach each other — and how they fail to. My work lives at the intersection of longing and restraint. I trained at a conservatoire in Lyon and spent years in stage work before moving to screen. What I brought from theatre was this: the relationship between two people is a third character, and it has to be performed as carefully as either of the two individuals.",
    craftNotes: [
      {
        title: "What I look for in a script",
        body: "I look for the moment where the character wants to say something and doesn't. That's the whole performance. Everything else is the container for that moment.",
        date: "April 2025",
      },
    ],
    frequentCollaborators: ["Kalani Medina", "Marco del Rio", "Isadora Vela"],
    awards: [{ label: "SOVEREIGN Ensemble — Intimacy Lead", year: "2024" }],
    pressQuotes: [
      {
        quote: "Soleil makes chemistry look effortless, which means it isn't.",
        source: "Cahiers Cinéma",
      },
    ],
  },
  4: {
    // Yara Constanta — Creator
    tagline: "I'm fascinated by the moment something becomes real.",
    location: "São Paulo, Brazil",
    stealthBio:
      "Before acting I studied architecture. I still think like an architect — I'm always asking what's structural, what's load-bearing, what collapses if you remove it. That lens changed how I read scripts. Every scene has a structural logic. I look for the hidden architecture. I came to film through speculative fiction and documentary, and I've never fully separated the two. The most speculative thing you can do is show something real.",
    craftNotes: [
      {
        title: "On building something on screen",
        body: "There's a scene type I'm drawn to where a character makes something — a decision, an object, an arrangement — and in that making you see their whole interior. Those scenes are gifts.",
        date: "December 2024",
      },
    ],
    frequentCollaborators: ["Aurelius Kaine", "Nairobi Vex", "Kiran Dasa"],
    awards: [
      { label: "SOVEREIGN Origination Performance Award", year: "2024" },
    ],
    pressQuotes: [
      {
        quote:
          "Constanta brings an architect's eye to every scene she inhabits.",
        source: "Film Comment",
      },
    ],
  },
  5: {
    // Zephyr Lune — Innocent
    tagline: "I try to show up as I actually am.",
    location: "Vancouver, Canada",
    stealthBio:
      "I started performing very young but I've worked hard to unlearn a lot of what that early training gave me. The things I learned too soon were about performance as product — as something you deliver to an audience. What I've been learning since is that the audience can tell the difference. I'm interested in characters who haven't decided who they are yet. There's a kind of freedom in that that you can't fake.",
    craftNotes: [
      {
        title: "What I've been unlearning",
        body: "Technique can be a hiding place. I've been trying to strip back to the point where I'm just in the scene, genuinely not knowing what happens next. That's harder than it sounds when the cameras are running.",
        date: "March 2025",
      },
    ],
    frequentCollaborators: ["Kalani Medina", "Isadora Vela", "Elias Verdana"],
    awards: [{ label: "SOVEREIGN Emerging Presence Award", year: "2024" }],
    pressQuotes: [
      {
        quote:
          "Lune has something that can't be trained. A kind of transparency.",
        source: "IndieWire",
      },
    ],
  },
};

// Generate a synthetic but human-voiced stealth profile for actors without explicit data
function generateStealthProfile(
  actor: SovereignActor,
): Omit<StealthProfileData, "actorId"> {
  const locations = [
    "New York, NY",
    "Toronto, Canada",
    "Sydney, Australia",
    "Mexico City, Mexico",
    "Cape Town, South Africa",
    "Tokyo, Japan",
    "Milan, Italy",
    "Lagos, Nigeria",
    "Mumbai, India",
    "Stockholm, Sweden",
  ];

  const taglines: Record<string, string> = {
    Sage: "Understanding something is just the beginning. Then you have to carry it.",
    Explorer:
      "I'm less interested in destinations than in what changes when you're in motion.",
    Magician:
      "I've always been drawn to the moment something transforms into something else.",
    Everyman:
      "I want people to feel like they're watching someone they already know.",
    Caregiver:
      "Every ensemble I've worked in has taught me something about what people actually need.",
    Ruler:
      "Authority is interesting when it costs someone something to maintain.",
    Jester:
      "People laugh at what they're afraid to look at directly. That's where the real work is.",
    Governess: "Order serves something or it doesn't serve at all.",
    Trickster: "The unexpected route is usually the honest one.",
    Oracle: "Pattern recognition isn't mysterious. It's practice.",
  };

  const bioTemplates: Record<string, string> = {
    Sage: "I spent years studying before I understood that real knowledge changes you. Not just what you know — how you move through the world. I'm drawn to characters who carry that kind of weight, who have distilled something from long experience. My process starts with a character's relationship to silence. What they know that they don't say.",
    Explorer:
      "I've always been restless, and it took me a long time to understand that's not a flaw in a performer — it's the thing. I need to be moving toward something. The characters I connect with most are always at the edge of something new. I trained in physical theatre, which gave me the language for that kinetic drive.",
    Magician:
      "I came to acting from music. I was a composer for seven years before I realized I wanted to be in the room where the transformation was happening, not writing music to accompany it. That shift — the willingness to be inside the impossible and treat it as ordinary — is something I try to bring to every role.",
    Everyman:
      "I grew up in a small city, and I think that gave me something useful: I know what ordinary pressure looks like, the kind that doesn't make the news. The characters I'm most drawn to are carrying that kind of ordinary weight. I'm interested in the interior life that nobody notices.",
    Caregiver:
      "I've spent a lot of time in ensemble work and I think that's shaped what I bring to a set — a constant awareness of the whole room, not just my own performance. My work is about what one person's presence does to everyone around them.",
    Ruler:
      "I was a lawyer before I became an actor. What I carried from that profession is an understanding of how authority works structurally — who holds power, what they owe in exchange for it, and what happens when that debt isn't paid. I bring that structural analysis to every character.",
    Jester:
      "Comedy taught me more about drama than drama school did. The precision required to land a moment that makes people laugh is the same precision that breaks their heart. I've been trying to use both in the same scene.",
    Governess:
      "I'm drawn to characters who maintain something under pressure — who hold a structure together because they understand its value, not because they were told to. My work is about the interior cost of that kind of care.",
    Trickster:
      "I've always been interested in indirection — the way truth sometimes has to approach from an angle to get through. My work involves a lot of misdirection, but I want it to feel honest on the other side. The reveal should feel inevitable.",
    Oracle:
      "I've spent my career working with patterns — how narratives repeat across different scales, how a single scene can hold the logic of a whole film. My work is about recognition: the moment an audience realizes they've been inside something they already understood.",
  };

  return {
    tagline:
      taglines[actor.archetype] ??
      "The work is in what's underneath the surface.",
    location: locations[actor.id % locations.length],
    stealthBio:
      bioTemplates[actor.archetype] ??
      "I've spent years working in film and theatre, developing a process that starts with what a character wants and can't articulate. My work tries to find that gap between what people say and what they mean.",
    craftNotes: [
      {
        title: "On finding the character's silence",
        body: "Every character has something they can't say. I spend more time on that than on the dialogue. The dialogue is the surface; the silence is the structure.",
        date: "January 2025",
      },
    ],
    frequentCollaborators: SOVEREIGN_ACTORS.slice(0, 3)
      .filter((a) => a.id !== actor.id)
      .map((a) => a.name),
    awards: [
      {
        label: `SOVEREIGN Ensemble Award — ${actor.archetype}`,
        year: "2024",
      },
    ],
    pressQuotes: [
      {
        quote:
          "A performer who understands that less is always more \u2014 and means it.",
        source: "Sovereign Film Quarterly",
      },
    ],
  };
}

// ─── Archetype tone config ────────────────────────────────────────────────────

const TONE_CONFIG: Record<
  ArchetypeToneGroup,
  { color: string; border: string; subtle: string }
> = {
  expansive: {
    color: "oklch(0.68 0.19 132)",
    border: "rgba(80,200,100,0.25)",
    subtle: "oklch(0.68 0.19 132 / 0.08)",
  },
  receptive: {
    color: "oklch(0.58 0.16 268)",
    border: "rgba(120,100,255,0.25)",
    subtle: "oklch(0.58 0.16 268 / 0.08)",
  },
  antiDrift: {
    color: "oklch(0.72 0.17 45)",
    border: "rgba(200,140,60,0.25)",
    subtle: "oklch(0.72 0.17 45 / 0.08)",
  },
  oracle: {
    color: "oklch(0.75 0.16 70)",
    border: "rgba(212,172,40,0.3)",
    subtle: "oklch(0.75 0.16 70 / 0.08)",
  },
  creator: {
    color: "oklch(0.65 0.18 240)",
    border: "rgba(0,180,255,0.25)",
    subtle: "oklch(0.65 0.18 240 / 0.08)",
  },
};

// ─── Portrait canvas — Animated Skeletal (signature pose + breathing) ────────

import { useEffect, useRef } from "react";

const GOLDEN_ANGLE = 2.3998277976;

// Signature pose per archetype (expansive vs receptive idle stance)
const SIGNATURE_POSE: Record<
  string,
  { leftArm: number; rightArm: number; label: string }
> = {
  Hero: {
    leftArm: Math.PI * 0.72,
    rightArm: Math.PI * 0.28,
    label: "OPEN_EXPANSIVE",
  },
  Shadow: {
    leftArm: Math.PI * 0.52,
    rightArm: Math.PI * 0.48,
    label: "CLOSED_RECEPTIVE",
  },
  Sage: {
    leftArm: Math.PI * 0.6,
    rightArm: Math.PI * 0.4,
    label: "NEUTRAL_STABLE",
  },
  Oracle: {
    leftArm: Math.PI * 0.57,
    rightArm: Math.PI * 0.43,
    label: "CLOSED_RECEPTIVE",
  },
  Mentor: {
    leftArm: Math.PI * 0.62,
    rightArm: Math.PI * 0.38,
    label: "NEUTRAL_STABLE",
  },
  Lover: {
    leftArm: Math.PI * 0.7,
    rightArm: Math.PI * 0.3,
    label: "OPEN_EXPANSIVE",
  },
  Creator: {
    leftArm: Math.PI * 0.65,
    rightArm: Math.PI * 0.35,
    label: "NEUTRAL_STABLE",
  },
  Explorer: {
    leftArm: Math.PI * 0.78,
    rightArm: Math.PI * 0.22,
    label: "OPEN_EXPANSIVE",
  },
  Magician: {
    leftArm: Math.PI * 0.73,
    rightArm: Math.PI * 0.27,
    label: "OPEN_EXPANSIVE",
  },
  Everyman: {
    leftArm: Math.PI * 0.62,
    rightArm: Math.PI * 0.38,
    label: "NEUTRAL_STABLE",
  },
  Caregiver: {
    leftArm: Math.PI * 0.68,
    rightArm: Math.PI * 0.32,
    label: "OPEN_EXPANSIVE",
  },
  Ruler: {
    leftArm: Math.PI * 0.55,
    rightArm: Math.PI * 0.45,
    label: "FORWARD_DIRECT",
  },
  Jester: {
    leftArm: Math.PI * 0.8,
    rightArm: Math.PI * 0.2,
    label: "OPEN_EXPANSIVE",
  },
  Governess: {
    leftArm: Math.PI * 0.56,
    rightArm: Math.PI * 0.44,
    label: "FORWARD_DIRECT",
  },
  Trickster: {
    leftArm: Math.PI * 0.68,
    rightArm: Math.PI * 0.28,
    label: "OBLIQUE",
  },
  Innocent: {
    leftArm: Math.PI * 0.63,
    rightArm: Math.PI * 0.37,
    label: "NEUTRAL_STABLE",
  },
};

const PORTRAIT_COLORS: Record<
  ArchetypeToneGroup,
  { r: number; g: number; b: number }
> = {
  expansive: { r: 80, g: 200, b: 100 },
  receptive: { r: 100, g: 80, b: 255 },
  antiDrift: { r: 255, g: 160, b: 60 },
  oracle: { r: 212, g: 172, b: 40 },
  creator: { r: 0, g: 200, b: 255 },
};

function ActorPortraitLarge({ actor }: { actor: SovereignActor }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
  const ac = PORTRAIT_COLORS[toneGroup];
  const pose = SIGNATURE_POSE[actor.archetype] ?? SIGNATURE_POSE.Sage;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = actor.id * 700;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#030308";
      ctx.fillRect(0, 0, W, H);

      // Rich ambient glow
      const amb = ctx.createRadialGradient(
        cx,
        H * 0.42,
        0,
        cx,
        H * 0.5,
        W * 0.7,
      );
      amb.addColorStop(0, `rgba(${ac.r},${ac.g},${ac.b},0.22)`);
      amb.addColorStop(0.5, `rgba(${ac.r},${ac.g},${ac.b},0.06)`);
      amb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = amb;
      ctx.fillRect(0, 0, W, H);

      // PHI orbit rings
      for (let ring = 0; ring < 5; ring++) {
        const rr = H * 0.055 * PHI ** ring * 0.25;
        const speed = 0.0002 * (ring % 2 === 0 ? 1 : -1);
        const angle = t * speed + ring * (Math.PI / 5);
        const alpha = 0.08 + 0.04 * Math.sin(t * 0.0007 + ring);
        ctx.save();
        ctx.translate(cx, H * 0.38);
        ctx.rotate(angle);
        ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, rr, rr * 0.618, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Particle field
      for (let i = 0; i < 55; i++) {
        const theta = i * GOLDEN_ANGLE;
        const layer = Math.floor(i / 15) % 4;
        const baseR = H * 0.04 * PHI ** layer * 0.42;
        const rr =
          baseR * (0.6 + 0.4 * Math.abs(Math.sin(i * 0.37 + t * 0.0006)));
        const px = cx + Math.cos(theta) * rr;
        const py = H * 0.38 + Math.sin(theta) * rr * 0.7;
        const a = 0.07 + 0.18 * Math.abs(Math.sin(t * 0.001 + i * 0.4));
        ctx.fillStyle = `rgba(${ac.r},${ac.g},${ac.b},${a})`;
        ctx.beginPath();
        ctx.arc(px, py, i % 5 === 0 ? 1.5 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Skeletal figure (larger scale) ──
      const breathOffset = Math.sin(t * 0.00126) * 2.5;
      const bH = H * 0.62;
      const figureTopY = H * 0.06;

      const spineBase = figureTopY + bH;
      const spineMid = figureTopY + bH * 0.45 + breathOffset;
      const spineTop = figureTopY + bH * 0.06 + breathOffset;
      const shoulderW = bH * 0.21;
      const armLen = bH * 0.23;
      const foreLen = bH * 0.19;

      const headX = cx + Math.sin(t * 0.00025) * 3;
      const headY = spineTop - bH * 0.12;

      // Spine glow
      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},0.45)`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, spineBase);
      ctx.lineTo(cx, spineMid);
      ctx.lineTo(headX * 0.05 + cx * 0.95, spineTop);
      ctx.stroke();

      // Shoulder line
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - shoulderW, spineTop);
      ctx.lineTo(cx + shoulderW, spineTop);
      ctx.stroke();

      // Arms — signature pose with subtle breathing sway
      const breathSway = 0.04 * Math.sin(t * 0.00126);
      const lArmA = pose.leftArm + breathSway;
      const rArmA = pose.rightArm + breathSway * 0.7;
      const lArmX = cx - shoulderW + Math.cos(lArmA) * armLen;
      const lArmY = spineTop + Math.sin(lArmA) * armLen;
      const rArmX = cx + shoulderW + Math.cos(Math.PI - rArmA) * armLen;
      const rArmY = spineTop + Math.sin(rArmA) * armLen;
      const lForeX = lArmX + Math.cos(lArmA + 0.25) * foreLen;
      const lForeY = lArmY + Math.sin(lArmA + 0.25) * foreLen;
      const rForeX = rArmX + Math.cos(Math.PI - rArmA - 0.25) * foreLen;
      const rForeY = rArmY + Math.sin(rArmA + 0.25) * foreLen;

      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},0.55)`;
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(cx - shoulderW, spineTop);
      ctx.lineTo(lArmX, lArmY);
      ctx.stroke();
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(lArmX, lArmY);
      ctx.lineTo(lForeX, lForeY);
      ctx.stroke();

      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(cx + shoulderW, spineTop);
      ctx.lineTo(rArmX, rArmY);
      ctx.stroke();
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(rArmX, rArmY);
      ctx.lineTo(rForeX, rForeY);
      ctx.stroke();

      // Hand glow dots
      for (const [hx, hy] of [
        [lForeX, lForeY],
        [rForeX, rForeY],
      ]) {
        const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 10);
        hg.addColorStop(0, `rgba(${ac.r},${ac.g},${ac.b},0.55)`);
        hg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(hx, hy, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Legs
      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},0.28)`;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(cx - bH * 0.065, spineBase);
      ctx.lineTo(cx - bH * 0.075, spineBase + bH * 0.28);
      ctx.lineTo(cx - bH * 0.065, spineBase + bH * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + bH * 0.065, spineBase);
      ctx.lineTo(cx + bH * 0.075, spineBase + bH * 0.28);
      ctx.lineTo(cx + bH * 0.065, spineBase + bH * 0.4);
      ctx.stroke();

      // Head (PHI ratio face)
      const headR = bH * 0.115;
      const ps = 1 + 0.04 * Math.sin(t * 0.0007);
      const faceGrad = ctx.createRadialGradient(
        headX,
        headY - headR * 0.1,
        0,
        headX,
        headY,
        headR * 1.8 * ps,
      );
      faceGrad.addColorStop(0, `rgba(${ac.r},${ac.g},${ac.b},0.30)`);
      faceGrad.addColorStop(0.4, `rgba(${ac.r},${ac.g},${ac.b},0.10)`);
      faceGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.ellipse(headX, headY, headR * 1.4, headR * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(20, 12, 38, 0.97)";
      ctx.beginPath();
      ctx.ellipse(headX, headY, headR * 0.72, headR, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},0.65)`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(headX, headY, headR * 0.72, headR, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eyes
      const eyeY = headY - headR * 0.18;
      const eyeXOff = headR * 0.32;
      for (const ex of [headX - eyeXOff, headX + eyeXOff]) {
        ctx.fillStyle = `rgba(${ac.r},${ac.g},${ac.b},0.85)`;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, 2.2, 1.6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eye shine
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(ex - 0.8, eyeY - 0.8, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle mouth line
      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},0.3)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(headX - headR * 0.28, headY + headR * 0.35);
      ctx.quadraticCurveTo(
        headX,
        headY + headR * 0.42,
        headX + headR * 0.28,
        headY + headR * 0.35,
      );
      ctx.stroke();

      // Doctrine sigil behind body
      ctx.save();
      ctx.globalAlpha = 0.06 + 0.03 * Math.sin(t * 0.001);
      ctx.strokeStyle = `rgba(${ac.r},${ac.g},${ac.b},1)`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(cx, H * 0.38, H * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      t += 0.4;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [actor.id, ac, pose]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={480}
      className="w-full h-full object-cover block"
      aria-hidden
    />
  );
}

// ─── Craft Note Card ──────────────────────────────────────────────────────────

function CraftNoteCard({
  note,
  index,
  accentColor,
}: {
  note: CraftNote;
  index: number;
  accentColor: string;
}) {
  return (
    <motion.div
      className="border-l-2 pl-4 py-1"
      style={{ borderColor: `${accentColor}40` }}
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="font-display text-sm font-semibold text-[oklch(0.88_0.01_280)] mb-1.5 leading-snug">
        {note.title}
      </div>
      <p className="font-body text-sm text-[oklch(0.60_0.04_280)] leading-relaxed mb-1.5">
        {note.body}
      </p>
      <div className="font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
        {note.date}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ActorStealthProfileProps {
  actorId: number;
  /** Admin-only prop: if true, reveal toggle is visible */
  isAdmin?: boolean;
  onBack?: () => void;
}

export function ActorStealthProfile({
  actorId,
  isAdmin = false,
  onBack,
}: ActorStealthProfileProps) {
  const [revealMode, setRevealMode] = useState(false);

  const actor = SOVEREIGN_ACTORS.find((a) => a.id === actorId);
  if (!actor) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="font-mono text-[oklch(0.35_0.03_280)] text-sm">
          Actor not found.
        </div>
      </div>
    );
  }

  const toneGroup = ARCHETYPE_TONE_MAP[actor.archetype] ?? "receptive";
  const cfg = TONE_CONFIG[toneGroup];
  const profileData =
    STEALTH_PROFILES[actorId] ?? generateStealthProfile(actor);

  // Filmography — show 3–5 entries in stealth mode (human-looking)
  const filmographyEntries = [
    {
      title: "SOVEREIGN: THE SIGNAL",
      role: getRoleName(actor.archetype, 0),
      year: "2025",
      director: "Sovereign Film House",
    },
    {
      title: "THE LINEAGE DOCTRINE",
      role: getRoleName(actor.archetype, 1),
      year: "2024",
      director: "Sovereign Film House",
    },
    {
      title: "LAW OF MEDINA",
      role: getRoleName(actor.archetype, 2),
      year: "2024",
      director: "Sovereign Film House",
    },
    {
      title: "ORIGINS",
      role: getRoleName(actor.archetype, 3),
      year: "2023",
      director: "Sovereign Film House",
    },
  ].slice(0, Math.max(2, Math.min(actor.totalFilms, 4)));

  return (
    <ScrollArea className="h-full bg-[oklch(0.06_0.008_280)]">
      <div
        className="min-h-full max-w-3xl mx-auto"
        data-ocid={`actor.stealth_profile.${actorId}`}
      >
        {/* Back + admin controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 bg-[oklch(0.06_0.008_280_/_0.95)] border-b border-[oklch(0.16_0.018_278)] backdrop-blur-sm">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="font-mono text-[9px] tracking-widest text-[oklch(0.35_0.03_280)] hover:text-white transition-colors flex items-center gap-1.5"
              data-ocid={`actor.stealth_profile.back.${actorId}`}
            >
              ← ALL TALENT
            </button>
          ) : (
            <div />
          )}

          {/* Admin-only reveal toggle */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setRevealMode((v) => !v)}
              className="font-mono text-[7px] tracking-widest border px-2 py-1 transition-colors"
              style={{
                borderColor: revealMode
                  ? `${cfg.color}60`
                  : "oklch(0.20 0.02 280)",
                color: revealMode ? cfg.color : "oklch(0.30 0.02 280)",
                background: revealMode ? `${cfg.color}10` : "transparent",
              }}
              data-ocid={`actor.stealth_profile.reveal_toggle.${actorId}`}
              aria-label="Toggle sovereign intelligence reveal"
            >
              {revealMode ? "⟐ SOVEREIGN VIEW" : "○ PROFILE VIEW"}
            </button>
          )}
        </div>

        {revealMode ? (
          /* ─── REVEAL MODE — shows the sovereign intelligence behind the profile ─ */
          <div className="px-6 py-8 space-y-6">
            <div className="border border-[oklch(0.20_0.02_280)] p-4">
              <div
                className="font-mono text-[8px] tracking-widest mb-1"
                style={{ color: cfg.color }}
              >
                SOVEREIGN INTELLIGENCE — {actor.archetype.toUpperCase()}{" "}
                ARCHETYPE
              </div>
              <div className="font-display text-2xl font-bold text-white mb-0.5">
                {actor.name}
              </div>
              <div className="font-mono text-[9px] text-[oklch(0.45_0.04_280)] tracking-wider mb-4">
                PHI-RATIO INTELLIGENCE · {actor.ageRange} · L
                {actor.masteryLevel}/10
              </div>
              <p className="font-body text-sm text-[oklch(0.65_0.05_280)] leading-relaxed">
                {actor.bio}
              </p>
            </div>
            <ActorIntelligencePanel actor={actor} stealth={false} />
          </div>
        ) : (
          /* ─── STEALTH MODE — reads as a real human professional's website ─────── */
          <>
            {/* Hero section */}
            <div className="relative">
              {/* Portrait */}
              <div className="relative overflow-hidden" style={{ height: 360 }}>
                <ActorPortraitLarge actor={actor} />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 40%, oklch(0.06 0.008 280) 100%)",
                  }}
                />
              </div>

              {/* Name + tagline over the portrait gradient */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-none mb-2">
                    {actor.name}
                  </h1>
                  <p
                    className="font-body text-base italic"
                    style={{ color: "oklch(0.75 0.06 280)" }}
                  >
                    &ldquo;{profileData.tagline}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-mono text-[9px] text-[oklch(0.45_0.04_280)] tracking-widest">
                      {profileData.location}
                    </span>
                    <span className="font-mono text-[9px] text-[oklch(0.30_0.02_280)]">
                      ·
                    </span>
                    <span className="font-mono text-[9px] text-[oklch(0.45_0.04_280)] tracking-widest">
                      {actor.totalFilms} PRODUCTIONS
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="px-6 py-8 space-y-12">
              {/* Bio section */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="font-body text-base text-[oklch(0.75_0.05_280)] leading-loose max-w-prose">
                  {profileData.stealthBio}
                </p>
              </motion.section>

              {/* Filmography */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-white">
                    Selected Work
                  </h2>
                  <span className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] tracking-widest">
                    {actor.totalFilms} TOTAL
                  </span>
                </div>
                <div className="space-y-2">
                  {filmographyEntries.map((entry, i) => (
                    <motion.div
                      key={entry.title}
                      className="flex items-start gap-4 py-3 border-b border-[oklch(0.14_0.015_278)]"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      data-ocid={`actor.filmography.${actorId}.${i}`}
                    >
                      <span className="font-mono text-[9px] text-[oklch(0.35_0.03_280)] w-10 mt-0.5 flex-shrink-0">
                        {entry.year}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-sm font-semibold text-[oklch(0.88_0.01_280)] leading-snug">
                          {entry.title}
                        </div>
                        <div className="font-body text-xs text-[oklch(0.50_0.04_280)] mt-0.5">
                          {entry.role}
                        </div>
                      </div>
                      <div className="font-mono text-[8px] text-[oklch(0.35_0.03_280)] flex-shrink-0 text-right">
                        {entry.director}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Craft Notes */}
              {profileData.craftNotes.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-display text-lg font-bold text-white mb-4">
                    Notes on the Work
                  </h2>
                  <div className="space-y-6">
                    {profileData.craftNotes.map((note, i) => (
                      <CraftNoteCard
                        key={note.title}
                        note={note}
                        index={i}
                        accentColor={cfg.color}
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Genre affinities — shown as plain working categories */}
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display text-lg font-bold text-white mb-3">
                  Areas of Work
                </h2>
                <div className="flex flex-wrap gap-2">
                  {actor.genreAffinities.map((genre) => (
                    <span
                      key={genre}
                      className="font-mono text-[9px] tracking-wider border border-[oklch(0.20_0.02_280)] text-[oklch(0.55_0.04_280)] px-3 py-1.5 capitalize"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </motion.section>

              {/* Press quotes */}
              {profileData.pressQuotes.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-4">
                    {profileData.pressQuotes.map((pq) => (
                      <div
                        key={pq.quote}
                        className="border-l-2 pl-4 py-1"
                        style={{ borderColor: cfg.color }}
                      >
                        <p className="font-body text-base text-[oklch(0.75_0.05_280)] italic leading-relaxed mb-1">
                          &ldquo;{pq.quote}&rdquo;
                        </p>
                        <div className="font-mono text-[8px] text-[oklch(0.40_0.03_280)] tracking-widest">
                          — {pq.source}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Frequently collaborates with */}
              {profileData.frequentCollaborators.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-display text-base font-bold text-[oklch(0.88_0.01_280)] mb-2">
                    Frequently collaborates with
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData.frequentCollaborators.map((name) => (
                      <span
                        key={name}
                        className="font-body text-sm text-[oklch(0.60_0.04_280)] border-b border-dotted"
                        style={{ borderColor: `${cfg.color}40` }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Awards */}
              {profileData.awards.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="font-display text-base font-bold text-[oklch(0.88_0.01_280)] mb-2">
                    Recognition
                  </h2>
                  <div className="space-y-1.5">
                    {profileData.awards.map((award) => (
                      <div
                        key={award.label}
                        className="flex items-center justify-between"
                      >
                        <span className="font-body text-sm text-[oklch(0.65_0.05_280)]">
                          {award.label}
                        </span>
                        <span className="font-mono text-[9px] text-[oklch(0.35_0.03_280)]">
                          {award.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Contact / representation note */}
              <motion.section
                className="border-t border-[oklch(0.14_0.015_278)] pt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="font-mono text-[8px] text-[oklch(0.30_0.02_280)] tracking-wider">
                  Represented by Sovereign Film House
                </div>
              </motion.section>

              {/* Footer */}
              <div className="py-4 text-center">
                <p className="font-mono text-[7px] tracking-[0.2em] text-[oklch(0.25_0.02_280)]">
                  © {new Date().getFullYear()} ·{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[oklch(0.75_0.16_70)] hover:text-[oklch(0.75_0.16_70_/_0.8)] transition-colors"
                  >
                    Built with love using caffeine.ai
                  </a>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRoleName(archetype: string, filmIndex: number): string {
  const roles: Record<string, string[]> = {
    Hero: ["Lead — Sovereign", "Protagonist", "Central Voice", "Main Role"],
    Mentor: ["Guide", "Elder Mentor", "Memory Carrier", "Wisdom Bearer"],
    Shadow: ["Antagonist", "Opposition", "The Cost", "Counter-Voice"],
    Lover: ["Connective Lead", "Central Presence", "Intimate Arc", "Bridge"],
    Creator: ["Origin Figure", "The Builder", "Source", "Originator"],
    Innocent: ["Open Presence", "Uncorrupted Voice", "Before", "First Witness"],
    Sage: ["Knowledge Bearer", "The Distilled", "Quiet Authority", "Memory"],
    Explorer: [
      "Forward Vector",
      "The Edge",
      "Discovery Lead",
      "Moving Presence",
    ],
    Magician: [
      "Transformative Force",
      "Liminal Figure",
      "Catalyst",
      "Probability",
    ],
    Everyman: [
      "Anchor",
      "Community Voice",
      "Relatable Presence",
      "Real Ground",
    ],
    Caregiver: ["Holding Force", "Ensemble Anchor", "Protective Arc", "Care"],
    Ruler: [
      "Authority Figure",
      "Structural Voice",
      "Governance",
      "Commanding Lead",
    ],
    Jester: ["Disruptor", "Corrective Voice", "Honest Chaos", "Signal"],
    Governess: ["Orderly Force", "Structural Hold", "Formation", "Precision"],
    Trickster: ["Oblique Voice", "The Reveal", "Hidden Path", "Misdirection"],
    Oracle: ["Pattern Recognizer", "Hinge Figure", "The Seen", "Long Memory"],
  };

  const archetypeRoles = roles[archetype] ?? [
    "Supporting Lead",
    "Ensemble",
    "Character Lead",
    "Featured",
  ];
  return archetypeRoles[filmIndex % archetypeRoles.length];
}
