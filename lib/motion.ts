/**
 * Motion design tokens — single source of truth for all animation
 * parameters across the site. Import from here rather than hard-coding
 * individual values in components.
 */
import type { Variants } from "framer-motion"

// ─── Easing curves ─────────────────────────────────────────────────────────

export const ease = {
  /** Standard smooth ease */
  smooth: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number],
  /** Starts fast, decelerates to a stop */
  out: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
  /** Starts slow, accelerates toward the end */
  in: [0.4, 0.0, 1.0, 1.0] as [number, number, number, number],
  /** Symmetric ease-in-out */
  inOut: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
  /** Premium spring-inspired ease — slightly over-shoots, settles naturally */
  cinematic: [0.22, 1.0, 0.36, 1.0] as [number, number, number, number],
  /** Slower, editorial-grade ease — most immersive */
  editorial: [0.16, 1.0, 0.3, 1.0] as [number, number, number, number],
} as const

// ─── Duration tokens (seconds) ─────────────────────────────────────────────

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.45,
  slow: 0.7,
  cinematic: 1.0,
  dramatic: 1.4,
} as const

// ─── Spring physics ─────────────────────────────────────────────────────────

export const spring = {
  gentle: { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.8 },
  snappy: { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.5 },
  slow: { type: "spring" as const, stiffness: 60, damping: 18, mass: 1.0 },
  cinematic: { type: "spring" as const, stiffness: 80, damping: 22, mass: 1.2 },
}

// ─── Tween transition presets ───────────────────────────────────────────────

export const tween = {
  fast: { type: "tween" as const, duration: duration.fast, ease: ease.out },
  normal: { type: "tween" as const, duration: duration.normal, ease: ease.cinematic },
  slow: { type: "tween" as const, duration: duration.slow, ease: ease.editorial },
  cinematic: { type: "tween" as const, duration: duration.cinematic, ease: ease.editorial },
}

// ─── Animation variants ─────────────────────────────────────────────────────

/** Standard scroll-reveal variant presets */
export const variants: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.slow, ease: ease.cinematic },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: duration.normal, ease: ease.out },
    },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration.slow, ease: ease.cinematic },
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: duration.slow, ease: ease.cinematic },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.normal, ease: ease.cinematic },
    },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(6px)", y: 10 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: duration.slow, ease: ease.cinematic },
    },
  },
  revealUp: {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.cinematic, ease: ease.editorial },
    },
  },
  /** Stagger container — children animate in sequence */
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  },
  containerFast: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.0 },
    },
  },
  containerSlow: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.1 },
    },
  },
  /**
   * Instant fade-in for users who prefer reduced motion.
   * Use in place of any animated variant when `useReducedMotion()` returns true.
   */
  reducedMotion: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
  },
}

// ─── Hero scroll transformation range ──────────────────────────────────────

/**
 * Pixel distance over which the hero morphs from full-bleed → card.
 * Increasing this makes the morph feel slower/more deliberate.
 */
export const HERO_MORPH_RANGE = 420
