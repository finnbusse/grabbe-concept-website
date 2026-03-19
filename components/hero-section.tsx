"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

export function HeroSection({ content }: { content?: Record<string, unknown> }) {
  const c = content || {}
  const headline1 = (c.headline1 as string) || 'Deine Talente.'
  const headline2 = (c.headline2 as string) || 'Deine Bühne.'
  const headline3 = (c.headline3 as string) || 'Dein Grabbe.'
  const subtitle = (c.subtitle as string) || 'Wir fördern Deine Talente und stärken Deine Persönlichkeit.'
  const cta1Text = (c.cta1_text as string) || 'Anmeldung Klasse 5'
  const cta1Link = (c.cta1_link as string) || '/unsere-schule/anmeldung'
  const cta2Text = (c.cta2_text as string) || 'Profilprojekte entdecken'
  const cta2Link = (c.cta2_link as string) || '/unsere-schule/profilprojekte'
  const scrollText = (c.scroll_text as string) || 'Entdecken'
  const heroImageUrl = (c.hero_image_url as string) || 'https://iplsqewa1jv1ew7a.public.blob.vercel-storage.com/schulwebsite/hero-a-light-JYVqm0zAQBXijY3qt5X7egYP4fmJow.webp'
  const heroImageDarkUrl = (c.hero_image_dark_url as string) || 'https://iplsqewa1jv1ew7a.public.blob.vercel-storage.com/schulwebsite/hero-a-dark-9y46Mdl0OXCy6CpagXTisMr7j5Tcl8.webp'

  const containerRef = useRef<HTMLElement>(null)

  // Track scroll progress for the cinematic morph effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Cinematic scroll transforms
  // Morph from full-bleed to contained card
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"])
  const paddingX = useTransform(scrollYProgress, [0, 1], ["0px", "16px"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]) // Parallax effect

  // Staggered text variants for anthropic-style cinematic reveal
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { ease: [0.16, 1, 0.3, 1], duration: 1 }
    },
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 1, delay: 0.8 }
    },
  }

  const ctaVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 1, delay: 1 }
    },
  }

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col bg-background h-[150vh] sm:h-auto"
    >
      {/* Sticky container to hold the morphing hero during scroll on mobile,
          or standard document flow on desktop. */}
      <div className="sticky top-0 w-full sm:relative sm:top-auto overflow-hidden bg-background z-0">
        <motion.div
          style={{
            scale,
            y,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            paddingTop: paddingX
          }}
          className="relative w-full overflow-hidden h-[calc(100svh-5.5rem)] sm:h-auto sm:aspect-[16/9] lg:aspect-[21/9] sm:rounded-b-[2rem] md:rounded-b-[3rem] origin-top"
        >
          <motion.div style={{ borderRadius, overflow: 'hidden' }} className="w-full h-full relative rounded-b-[1.5rem] sm:rounded-none">
            {/* Light mode hero image (default) */}
            <div className="hero-image-light absolute inset-0">
              <Image
                src={heroImageUrl}
                alt="Grabbe-Gymnasium Schulgebäude"
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="100vw"
              />
            </div>

            {/* Dark / night-themed hero image (shown via prefers-color-scheme: dark CSS) */}
            <div className="hero-image-dark absolute inset-0">
              <Image
                src={heroImageDarkUrl}
                alt="Grabbe-Gymnasium Schulgebäude bei Nacht"
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="100vw"
              />
            </div>

            {/* Content overlay */}
            <motion.div
              style={{ opacity }}
              className="absolute inset-0 z-10 flex flex-col justify-end p-4 pb-8 sm:p-6 md:p-10 lg:p-14"
            >
              <motion.h1
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl text-white leading-[1.1] tracking-tight"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)" }}
              >
                <motion.span variants={wordVariants} className="block">{headline1}</motion.span>
                <motion.span variants={wordVariants} className="block">{headline2}</motion.span>
                <motion.span variants={wordVariants} className="block italic text-[hsl(200,85%,80%)]" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)" }}>
                  {headline3}
                </motion.span>
              </motion.h1>

              {/* Subtitle with soft fade in */}
              <motion.p
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
                className="mt-2 sm:mt-3 max-w-md text-white/90 text-xs sm:text-sm leading-relaxed font-sans"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
              >
                {subtitle}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={ctaVariants}
                initial="hidden"
                animate="visible"
                className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-start gap-2 sm:gap-3"
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
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator - positioned absolutely at the bottom of the viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-0 right-0 z-10 flex justify-center py-6 sm:py-8 pointer-events-none"
      >
        <button
          onClick={() => {
            document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })
            trackEvent("hero_scroll_click")
          }}
          className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors pointer-events-auto"
          aria-label="Weiter scrollen"
        >
          <span className="text-[10px] font-sub uppercase tracking-[0.25em]">{scrollText}</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </motion.div>
    </section>
  )
}
