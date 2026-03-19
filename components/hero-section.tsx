"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion"
import { trackEvent } from "@/lib/analytics"
import { ease, duration as dur, HERO_MORPH_RANGE } from "@/lib/motion"

// ─── Typing text sub-component ─────────────────────────────────────────────

function TypingText({ text, delay = 0, speed = 40 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return (
    <span className="inline-block" style={{ minWidth: started ? "auto" : `${text.length * 0.5}em` }}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-white align-middle ml-0.5 animate-pulse" />
      )}
    </span>
  )
}

// ─── Hero section ───────────────────────────────────────────────────────────

export function HeroSection({ content }: { content?: Record<string, unknown> }) {
  const c = content || {}
  const headline1 = (c.headline1 as string) || "Deine Talente."
  const headline2 = (c.headline2 as string) || "Deine Bühne."
  const headline3 = (c.headline3 as string) || "Dein Grabbe."
  const subtitle = (c.subtitle as string) || "Wir fördern Deine Talente und stärken Deine Persönlichkeit."
  const cta1Text = (c.cta1_text as string) || "Anmeldung Klasse 5"
  const cta1Link = (c.cta1_link as string) || "/unsere-schule/anmeldung"
  const cta2Text = (c.cta2_text as string) || "Profilprojekte entdecken"
  const cta2Link = (c.cta2_link as string) || "/unsere-schule/profilprojekte"
  const scrollText = (c.scroll_text as string) || "Entdecken"

  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Container ref drives scroll progress
  const containerRef = useRef<HTMLDivElement>(null)

  // Raw page scroll (px)
  const { scrollY } = useScroll()

  // Spring-smooth the scroll value so the morph feels physically weighted
  const smoothY = useSpring(scrollY, {
    stiffness: 180,
    damping: 35,
    mass: 0.6,
  })

  const morphY = prefersReducedMotion ? scrollY : smoothY

  // ── Scroll-driven style values ────────────────────────────────────────────
  // Full-bleed  →  contained card as the user scrolls down
  const borderRadius = useTransform(
    morphY,
    [0, HERO_MORPH_RANGE],
    ["0px", "1.75rem"]
  )
  const scale = useTransform(
    morphY,
    [0, HERO_MORPH_RANGE],
    [1, 0.975]
  )
  const marginX = useTransform(
    morphY,
    [0, HERO_MORPH_RANGE],
    ["0px", "1.25rem"]
  )
  const marginTop = useTransform(
    morphY,
    [0, HERO_MORPH_RANGE],
    ["0px", "0.75rem"]
  )
  const boxShadow = useTransform(
    morphY,
    [0, HERO_MORPH_RANGE],
    [
      "0 0px 0px 0px rgba(0,0,0,0)",
      "0 24px 80px -12px rgba(0,0,0,0.22), 0 8px 24px -4px rgba(0,0,0,0.12)",
    ]
  )

  // Content overlay fades out during the first half of the morph range
  const contentOpacity = useTransform(morphY, [0, HERO_MORPH_RANGE * 0.55], [1, 0])

  // Background parallax — image drifts gently upward
  const bgParallaxY = useTransform(morphY, [0, HERO_MORPH_RANGE * 1.5], ["0%", "-6%"])

  // ── Entrance animation ────────────────────────────────────────────────────
  // Brief scroll lock so the cinematic entrance can play uninterrupted.
  // `prefersReducedMotion` is intentionally omitted from the dependency array:
  // the lock must only run once on mount, not re-run when the OS preference
  // changes mid-session (which would re-lock scroll unexpectedly).
  useEffect(() => {
    setMounted(true)

    if (prefersReducedMotion) return

    // Only lock if the user arrives at the top of the page
    if (window.scrollY > 30) return

    // Measure scrollbar width to prevent layout shift when locking
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`
    )
    document.body.classList.add("scroll-locked")

    const timer = setTimeout(() => {
      document.body.classList.remove("scroll-locked")
    }, 1100) // matches entrance animation duration

    return () => {
      clearTimeout(timer)
      document.body.classList.remove("scroll-locked")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount-only effect
  }, [])

  // Entrance: hero scales up from 0.97 and fades in
  const entranceVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: dur.cinematic,
        ease: ease.cinematic,
      },
    },
  }

  return (
    /*
     * Container creates the scroll "runway" for the pinned hero.
     * height = 100svh (the visible hero) + HERO_MORPH_RANGE (scroll space)
     * After the hero has morphed, it unsticks and the page continues.
     */
    <div
      ref={containerRef}
      style={{ height: `calc(100svh + ${HERO_MORPH_RANGE}px)` }}
      className="relative"
    >
      {/* Sticky viewport-height wrapper — hero stays at top while scrolling through the runway */}
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Entrance animation wrapper */}
        <motion.div
          className="h-full w-full"
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
          variants={entranceVariants}
        >
          {/* Scroll-morphing card */}
          <motion.div
            className="relative overflow-hidden h-full w-full"
            style={{
              borderRadius,
              scale,
              marginLeft: marginX,
              marginRight: marginX,
              marginTop,
              boxShadow,
              // Prevent subpixel bleed during scaling
              willChange: "transform, border-radius",
            }}
          >
            {/* ── Background images with parallax ─────────────────────── */}
            <motion.div
              className="absolute inset-0 scale-[1.08]"
              style={{ y: bgParallaxY }}
            >
              {/* Light mode */}
              <div className="hero-image-light absolute inset-0">
                <Image
                  src="https://iplsqewa1jv1ew7a.public.blob.vercel-storage.com/schulwebsite/hero-a-light-JYVqm0zAQBXijY3qt5X7egYP4fmJow.webp"
                  alt="Grabbe-Gymnasium Schulgebäude"
                  fill
                  className="object-cover"
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                />
              </div>
              {/* Dark mode */}
              <div className="hero-image-dark absolute inset-0">
                <Image
                  src="https://iplsqewa1jv1ew7a.public.blob.vercel-storage.com/schulwebsite/hero-a-dark-9y46Mdl0OXCy6CpagXTisMr7j5Tcl8.webp"
                  alt="Grabbe-Gymnasium Schulgebäude bei Nacht"
                  fill
                  className="object-cover"
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                />
              </div>
            </motion.div>

            {/* ── Content overlay ──────────────────────────────────────── */}
            <motion.div
              className="absolute inset-0 z-10 flex flex-col justify-end p-4 pb-10 sm:p-6 md:p-10 lg:p-14"
              style={{ opacity: contentOpacity }}
            >
              {/* Headline */}
              <motion.h1
                className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl text-white leading-[1.1] tracking-tight"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)" }}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: dur.slow, ease: ease.cinematic }}
              >
                <span className="block">{headline1}</span>
                <span className="block">{headline2}</span>
                <span
                  className="block italic text-[hsl(200,85%,80%)]"
                  style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)" }}
                >
                  {headline3}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="mt-2 sm:mt-3 max-w-md text-white/90 text-xs sm:text-sm leading-relaxed font-sans"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: dur.slow, ease: ease.cinematic }}
              >
                <TypingText text={subtitle} delay={1400} speed={28} />
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-start gap-2 sm:gap-3"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: dur.slow, ease: ease.cinematic }}
              >
                <Link
                  href={cta1Link}
                  onClick={() => trackEvent("hero_cta_click", { label: cta1Text, href: cta1Link })}
                  className="group flex items-center gap-2 rounded-full bg-white/95 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-primary shadow-lg transition-all hover:bg-white hover:shadow-xl w-full sm:w-auto justify-center sm:justify-start"
                >
                  {cta1Text}
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={cta2Link}
                  onClick={() => trackEvent("hero_cta_click", { label: cta2Text, href: cta2Link })}
                  className="group flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-lg transition-all hover:bg-white/25 w-full sm:w-auto justify-center sm:justify-start"
                >
                  {cta2Text}
                </Link>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: dur.normal, ease: ease.out }}
              >
                <button
                  onClick={() => {
                    document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })
                    trackEvent("hero_scroll_click")
                  }}
                  className="flex flex-col items-center gap-2 text-white/50 hover:text-white/90 transition-colors"
                  aria-label="Weiter scrollen"
                >
                  <span className="text-[10px] font-sub uppercase tracking-[0.25em]">{scrollText}</span>
                  <ArrowDown className="h-4 w-4 animate-bounce" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
