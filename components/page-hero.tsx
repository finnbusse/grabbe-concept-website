"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

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

export function PageHero({ title, label, subtitle, imageUrl }: PageHeroProps) {
  const ascii = imageUrl ? "" : generateAsciiGrid(title)
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Subtle parallax effect on the right panel
  const y = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section ref={ref} className="border-b border-border bg-background overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:pt-28 lg:px-8 lg:py-16">
        <div className="flex items-center justify-between gap-8">

          {/* ── Left: text ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="min-w-0 flex-1 relative z-10"
          >
            {label && (
              <p className="mb-2 text-xs font-sub uppercase tracking-[0.22em] text-primary">
                {label}
              </p>
            )}
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-xl text-base text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* ── Right: decorative / hero image panel (~50% width) ── */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block shrink-0 w-[45%] md:w-[48%] lg:w-[50%] h-48 md:h-60 lg:h-72 overflow-hidden relative"
            aria-hidden={!imageUrl}
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

        </div>
      </div>
    </section>
  )
}

