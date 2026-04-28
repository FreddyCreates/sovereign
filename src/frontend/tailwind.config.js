import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "General Sans", "system-ui", "sans-serif"],
        sans: ["General Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        panel: "inset 0 1px 0 oklch(0.3 0.04 278 / 0.15), 0 2px 12px oklch(0 0 0 / 0.5)",
        "glow-cyan": "0 0 20px oklch(0.65 0.18 240 / 0.4)",
        "glow-gold": "0 0 20px oklch(0.75 0.16 70 / 0.4)",
        "glow-expansive": "0 0 20px oklch(0.68 0.19 132 / 0.35)",
        "glow-receptive": "0 0 20px oklch(0.58 0.16 268 / 0.35)",
        "glow-antidrift": "0 0 20px oklch(0.72 0.17 45 / 0.35)",
        "canvas-frame": "inset 0 0 40px oklch(0 0 0 / 0.8), 0 0 40px oklch(0.75 0.16 70 / 0.15)",
        "studio-input": "0 0 16px oklch(0.75 0.16 70 / 0.3), inset 0 1px 0 oklch(0.3 0.04 278 / 0.15)",
        /* Premium cinematic shadows */
        "premium-card": "0 8px 32px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(0.3 0.04 278 / 0.2)",
        "premium-elevated": "0 12px 48px oklch(0 0 0 / 0.5), 0 0 40px oklch(0.75 0.16 70 / 0.1)",
        "premium-subtle": "0 2px 8px oklch(0 0 0 / 0.3), inset 0 1px 0 oklch(0.3 0.04 278 / 0.1)",
        "actor-portrait": "0 16px 48px oklch(0 0 0 / 0.6), 0 0 32px oklch(0.75 0.16 70 / 0.15), inset 0 1px 0 oklch(0.4 0.05 278 / 0.1)",
        "film-card-deep": "0 12px 40px oklch(0 0 0 / 0.5), 0 0 32px oklch(0.65 0.18 240 / 0.1), inset 0 1px 0 oklch(0.3 0.04 278 / 0.15)",
        "glyph-deep": "0 0 40px oklch(0.75 0.16 70 / 0.3), 0 0 80px oklch(0.75 0.16 70 / 0.1)",
        "monitor-panel": "inset 0 2px 8px oklch(0.3 0.04 278 / 0.2), inset 0 -2px 8px oklch(0 0 0 / 0.4), 0 0 24px oklch(0.65 0.18 240 / 0.15)",
        "vault-law-glow": "0 0 24px oklch(0.75 0.16 70 / 0.3), inset 0 1px 0 oklch(0.25 0.03 280 / 0.1)",
        "vault-card-lift": "0 8px 28px oklch(0 0 0 / 0.4), 0 0 32px oklch(0.65 0.18 240 / 0.1), inset 0 1px 0 oklch(0.15 0.02 280 / 0.1)",
        "vault-library-card": "0 6px 20px oklch(0 0 0 / 0.35), inset 0 1px 0 oklch(0.15 0.02 280 / 0.08)",
        "vault-review-queue": "inset 0 1px 2px oklch(0.25 0.03 280 / 0.15), 0 2px 10px oklch(0 0 0 / 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        radiate: {
          "0%": { opacity: "0", transform: "scale(0.8) rotate(0deg)" },
          "50%": { opacity: "0.5" },
          "100%": { opacity: "0", transform: "scale(1.5) rotate(360deg)" },
        },
        "focus-in": {
          "0%": { opacity: "0", transform: "scale(1.2)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "balance-sway": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "stage-activate": {
          "0%": { opacity: "0", transform: "translateX(-8px) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "stage-progress": {
          "0%": { width: "0%", backgroundColor: "oklch(0.75 0.16 70 / 0.4)" },
          "100%": { width: "100%", backgroundColor: "oklch(0.75 0.16 70 / 0.8)" },
        },
        "frame-fade-in": {
          "0%": { opacity: "0", filter: "blur(4px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        "shimmer-gold": {
          "0%": { boxShadow: "0 0 0 0 oklch(0.75 0.16 70 / 0.5)" },
          "100%": { boxShadow: "0 0 24px 8px oklch(0.75 0.16 70 / 0)" },
        },
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        "signal-pulse": {
          "0%": { opacity: "0.6" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.6" },
        },
        "mastery-unlock": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "poster-preview": {
          "0%": { opacity: "0", filter: "blur(8px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        "enterprise-pulse": {
          "0%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
          "100%": { opacity: "0.6", transform: "scale(1)" },
        },
        "iot-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        "festival-slide": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "revenue-wiggle": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(1px)" },
          "75%": { transform: "translateX(-1px)" },
        },
        "hot-signal-pulse": {
          "0%": {
            borderColor: "oklch(0.62 0.22 25 / 0.4)",
            boxShadow: "0 0 12px oklch(0.62 0.22 25 / 0.2)",
          },
          "50%": {
            borderColor: "oklch(0.62 0.22 25 / 0.8)",
            boxShadow: "0 0 20px oklch(0.62 0.22 25 / 0.4)",
          },
          "100%": {
            borderColor: "oklch(0.62 0.22 25 / 0.4)",
            boxShadow: "0 0 12px oklch(0.62 0.22 25 / 0.2)",
          },
        },
        "glyph-pulse-beat": {
          "0%": { opacity: "0.6", filter: "drop-shadow(0 0 8px oklch(0.75 0.16 70 / 0.2))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 16px oklch(0.75 0.16 70 / 0.6))" },
          "100%": { opacity: "0.6", filter: "drop-shadow(0 0 8px oklch(0.75 0.16 70 / 0.2))" },
        },
        "glyph-ring-expansive": {
          "0%": { transform: "rotate(0deg) scale(1)", opacity: "0.7" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "0.7" },
        },
        "glyph-ring-receptive": {
          "0%": { transform: "rotate(0deg) scale(1)", opacity: "0.7" },
          "100%": { transform: "rotate(-360deg) scale(1)", opacity: "0.7" },
        },
        "glyph-mediate-pulse": {
          "0%, 100%": { r: "12px", opacity: "0.8" },
          "50%": { r: "14px", opacity: "1" },
        },
        "gradient-field-rise": {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        "gradient-field-trend": {
          "0%": { opacity: "0.6" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.8" },
        },
        "tiktok-card-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "tiktok-watermark-fade": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
        "toggle-slide": {
          "0%": { opacity: "0", transform: "translateX(-4px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "actor-personality-shift": {
          "0%": { opacity: "0.7", transform: "scale(0.95)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.7", transform: "scale(1)" },
        },
        "series-escalate": {
          "0%": { height: "2px", opacity: "0.4" },
          "50%": { height: "4px", opacity: "0.8" },
          "100%": { height: "6px", opacity: "1" },
        },
        "expression-fade-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "trace-flow": {
          "0%": { opacity: "0.5", strokeDashoffset: "100" },
          "100%": { opacity: "1", strokeDashoffset: "0" },
        },
        "signal-origin-pop": {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        /* Premium cinematic keyframes */
        "actor-breathe": {
          "0%, 100%": { opacity: "0.9", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        "film-card-glow": {
          "0%": { boxShadow: "0 8px 32px oklch(0 0 0 / 0.2), 0 0 20px oklch(0.65 0.18 240 / 0.1)" },
          "50%": { boxShadow: "0 12px 48px oklch(0 0 0 / 0.4), 0 0 40px oklch(0.65 0.18 240 / 0.25)" },
          "100%": { boxShadow: "0 8px 32px oklch(0 0 0 / 0.2), 0 0 20px oklch(0.65 0.18 240 / 0.1)" },
        },
        "monitor-heartbeat": {
          "0%, 100%": { strokeWidth: "1.5", opacity: "0.8" },
          "50%": { strokeWidth: "2", opacity: "1" },
        },
        "ring-oscillate": {
          "0%": { r: "48px", opacity: "0.7" },
          "50%": { r: "52px", opacity: "0.9" },
          "100%": { r: "48px", opacity: "0.7" },
        },
        "actor-focus-glow": {
          "0%": { boxShadow: "0 0 20px oklch(0.75 0.16 70 / 0.2)" },
          "50%": { boxShadow: "0 0 40px oklch(0.75 0.16 70 / 0.4)" },
          "100%": { boxShadow: "0 0 20px oklch(0.75 0.16 70 / 0.2)" },
        },
        "premium-fade-in": {
          "0%": { opacity: "0", filter: "blur(2px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        "cinematic-pan": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        "actor-aura-pulse": {
          "0%, 100%": { opacity: "0.8", filter: "drop-shadow(0 0 40px currentColor)" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 60px currentColor)" },
        },
        "relationship-edge-pulse": {
          "0%, 100%": { opacity: "0.6", strokeWidth: "1.5" },
          "50%": { opacity: "0.9", strokeWidth: "2" },
        },
        "neurochemistry-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "glass-panel-lift": {
          "0%": { transform: "translateY(0)", opacity: "0.8" },
          "100%": { transform: "translateY(-4px)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        radiate: "radiate 2s ease-out infinite",
        "focus-in": "focus-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        balance: "balance-sway 3s ease-in-out infinite",
        "stage-activate": "stage-activate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "stage-progress": "stage-progress 1.5s ease-in-out forwards",
        "frame-fade-in": "frame-fade-in 0.8s ease-out both",
        "shimmer-gold": "shimmer-gold 2s ease-out 1",
        "float-subtle": "float-subtle 3s ease-in-out infinite",
        "signal-pulse": "signal-pulse 2s ease-in-out infinite",
        "mastery-unlock": "mastery-unlock 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "poster-preview": "poster-preview 0.8s ease-out both",
        "enterprise-pulse": "enterprise-pulse 2s ease-in-out infinite",
        "iot-blink": "iot-blink 1.2s ease-in-out infinite",
        "festival-slide": "festival-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "revenue-wiggle": "revenue-wiggle 0.3s ease-in-out",
        "hot-signal-pulse": "hot-signal-pulse 1.8s ease-in-out infinite",
        "glyph-pulse-beat": "glyph-pulse-beat 1.2s ease-in-out infinite",
        "glyph-ring-expansive": "glyph-ring-expansive 12s linear infinite",
        "glyph-ring-receptive": "glyph-ring-receptive 12s linear infinite",
        "glyph-mediate-pulse": "glyph-mediate-pulse 1.5s ease-in-out infinite",
        "gradient-field-rise": "gradient-field-rise 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "gradient-field-trend": "gradient-field-trend 2s ease-in-out infinite",
        "tiktok-card-in": "tiktok-card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "tiktok-watermark-fade": "tiktok-watermark-fade 2.5s ease-in-out infinite",
        "toggle-slide": "toggle-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "actor-personality-shift": "actor-personality-shift 1.5s ease-in-out infinite",
        "series-escalate": "series-escalate 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite",
        "expression-fade-in": "expression-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        "trace-flow": "trace-flow 1.2s ease-out",
        "signal-origin-pop": "signal-origin-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        /* Premium cinematic animations */
        "actor-breathe": "actor-breathe 3s ease-in-out infinite",
        "film-card-glow": "film-card-glow 2.5s ease-in-out infinite",
        "monitor-heartbeat": "monitor-heartbeat 0.873s ease-in-out infinite",
        "ring-oscillate": "ring-oscillate 2.5s ease-in-out infinite",
        "actor-focus-glow": "actor-focus-glow 2s ease-in-out infinite",
        "premium-fade-in": "premium-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "cinematic-pan": "cinematic-pan 8s ease-in-out infinite",
        "actor-aura-pulse": "actor-aura-pulse 2s ease-in-out infinite",
        "relationship-edge-pulse": "relationship-edge-pulse 1.5s ease-in-out infinite",
        "neurochemistry-spin": "neurochemistry-spin 8s linear infinite",
        "glass-panel-lift": "glass-panel-lift 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
