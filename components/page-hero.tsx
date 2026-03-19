"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ease, duration as dur } from "@/lib/motion"

// ─── ASCII art fallback generator ──────────────────────────────────────────

/** Simple DJB2-style hash for deterministic seeding */
function djb2(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h, 33) ^ str.charCodeAt(i)
  }
  return h >>> 0
}

/**
 * Generate a deterministic ASCII art grid for the decorative right panel.
 * Uses denser glyph set and more visible patterns.
 */
function generateAsciiGrid(seed: string, cols = 56, rows = 16): string {
  const h = djb2(seed)
  const glyphs = ["·", ":", ".", "+", "×", "◇", "○", "▪", "▫", "◦", "∘", "⊙"]
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ""
    for (let c = 0; c < cols; c++) {
      const v =
        Math.sin((h % 997) * 0.0031 + r * 0.71 + c * 0.29) *
        Math.cos((h % 503) * 0.0017 + r * 0.43 + c * 0.61)
      line += v > 0.25 ? glyphs[Math.abs(Math.floor(v * 100 + h)) % glyphs.length] : " "
    }
    lines.push(line)
  }
  return lines.join("\n")
}

// ─── Component ──────────────────────────────────────────────────────────────

interface PageHeroProps {
  /** Main heading displayed on the hero */
  title: string
  /** Optional small label shown above the title (uppercase tracking) */
  label?: string
  /** Optional subtitle shown below the title */
  subtitle?: string
  /**
   * Optional hero image URL shown in the decorative right panel instead of ASCII art.
   */
  imageUrl?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.slow, ease: ease.cinematic },
  },
}

const panelVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: dur.cinematic, ease: ease.editorial },
  },
}

export function PageHero({ title, label, subtitle, imageUrl }: PageHeroProps) {
  const ascii = imageUrl ? "" : generateAsciiGrid(title)

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:pt-28 lg:px-8 lg:py-16">
        <motion.div
          className="flex items-center justify-between gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ── Left: text ── */}
          <div className="min-w-0 flex-1">
            {label && (
              <motion.p
                className="mb-2 text-xs font-sub uppercase tracking-[0.22em] text-primary"
                variants={itemVariants}
              >
                {label}
              </motion.p>
            )}
            <motion.h1
              className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p
                className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* ── Right: decorative / hero image panel (~50% width) ── */}
          <motion.div
            className="hidden sm:block shrink-0 w-[45%] md:w-[48%] lg:w-[50%] h-48 md:h-60 lg:h-72 overflow-hidden relative"
            aria-hidden={!imageUrl}
            variants={panelVariants}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover rounded-lg"
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 48vw, 45vw"
              />
            ) : (
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 50%, hsl(var(--primary) / 0.4) 100%)",
                }}
              >
                {/* ASCII texture */}
                <pre className="absolute inset-0 p-4 font-mono text-[9px] leading-[1.5] text-white/20 select-none overflow-hidden">
                  {ascii}
                </pre>
                {/* Soft left edge blend */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-transparent" />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

