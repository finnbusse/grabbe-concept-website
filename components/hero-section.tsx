"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"

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
    <span>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-white/80 align-middle ml-0.5 animate-pulse" />
      )}
    </span>
  )
}

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative w-full" style={{ height: "100svh" }}>
      {/* Image -- full width, flush to top, only rounded at bottom */}
      <div
        className="absolute inset-0 overflow-hidden rounded-b-[2.5rem]"
        style={{ transform: `scale(${1 + scrollY * 0.0002})` }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1770907263880.png-LbbwTH3bV3iIeTlN24uWwemZuKXx6y.jpeg"
          alt="Grabbe-Gymnasium Schulgebaeude"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Text content -- bottom left, no dark overlay on image, text has its own shadow */}
      <div className="absolute inset-0 flex flex-col justify-end rounded-b-[2.5rem]">
        <div className="relative z-10 px-6 pb-10 md:px-12 md:pb-14 lg:px-16 lg:pb-16 max-w-3xl">
          {/* Logo */}
          <div className="mb-6 animate-blur-in">
            <img
              src="/images/grabbe-logo.svg"
              alt="Grabbe-Gymnasium Logo"
              className="h-10 w-auto md:h-14"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Main headline */}
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight animate-blur-in delay-200"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)" }}
          >
            <span className="block">Deine Talente.</span>
            <span className="block text-blue-200">Deine Buehne.</span>
            <span className="block italic">Dein Grabbe.</span>
          </h1>

          {/* Subtitle with typing */}
          <p
            className="mt-5 max-w-lg text-white/80 text-sm md:text-base leading-relaxed font-sans animate-blur-in delay-400"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
          >
            <TypingText
              text="Wir foerdern Deine Talente und staerken Deine Persoenlichkeit."
              delay={1200}
              speed={35}
            />
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-start gap-3 animate-blur-in delay-600">
            <Link
              href="/unsere-schule/anmeldung"
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-blue-50 hover:shadow-lg"
            >
              Anmeldung Klasse 5
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/unsere-schule/profilprojekte"
              className="group flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/60 backdrop-blur-sm"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
            >
              Profilprojekte entdecken
            </Link>
          </div>
        </div>

        {/* Scroll indicator -- bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-blur-in delay-1000">
          <button
            onClick={() => document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors"
            aria-label="Weiter scrollen"
          >
            <span
              className="text-[10px] font-pixel uppercase tracking-[0.2em]"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
            >
              Entdecken
            </span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  )
}
