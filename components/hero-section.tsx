"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowDown } from "lucide-react"
import { useEffect, useState, useRef } from "react"

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
        <span className="inline-block w-[2px] h-[1em] bg-primary align-middle ml-0.5 animate-pulse" />
      )}
    </span>
  )
}

function CountUpNumber({ target, suffix = "", delay = 0 }: { target: number; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(() => setStarted(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay, started])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const imageScale = 1 + scrollY * 0.0003
  const imageY = scrollY * 0.15

  return (
    <section className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Ambient blue blobs in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/[0.07] blur-[120px] animate-gentle-pulse" />
        <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-accent/[0.05] blur-[100px] animate-gentle-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[hsl(195,75%,50%)]/[0.04] blur-[100px] animate-gentle-pulse delay-500" />
      </div>

      {/* Spacer for navbar */}
      <div className="h-20" />

      {/* Image with rounded corners and padding */}
      <div className="relative z-10 px-4 pt-4 md:px-8 lg:px-12">
        <div
          className="relative w-full overflow-hidden rounded-3xl shadow-2xl shadow-primary/10"
          style={{ aspectRatio: "21/9" }}
        >
          <div
            style={{
              transform: `translateY(${imageY}px) scale(${imageScale})`,
              transition: "transform 0.1s linear",
            }}
            className="absolute inset-0"
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1770907263880.png-LbbwTH3bV3iIeTlN24uWwemZuKXx6y.jpeg"
              alt="Grabbe-Gymnasium Schulgebaeude"
              fill
              className="object-cover"
              priority
              quality={90}
            />
          </div>

          {/* Light blue overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(215,70%,15%)]/70 via-[hsl(215,70%,25%)]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,70%,15%)]/50 via-transparent to-transparent" />

          {/* Content overlay - bottom left aligned */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-10 lg:p-14">
            {/* Logo */}
            <div className="mb-4 animate-blur-in delay-200">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grabbe-axyrHnKg5v3J1TKdQffEYr4F54zwpn.jpg"
                alt="Grabbe-Gymnasium Logo"
                className="h-10 w-auto brightness-0 invert opacity-90 md:h-14"
              />
            </div>

            {/* Main headline - left aligned */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1] tracking-tight animate-blur-in delay-300 max-w-3xl">
              <span className="block">Deine Talente.</span>
              <span className="block italic text-[hsl(200,90%,75%)]">Deine Buehne.</span>
              <span className="block">Dein Grabbe.</span>
            </h1>

            {/* Subtitle with typing */}
            <p className="mt-4 max-w-md text-white/70 text-sm md:text-base leading-relaxed font-sans animate-blur-in delay-500">
              <TypingText
                text="Wir foerdern Deine Talente und staerken Deine Persoenlichkeit."
                delay={1200}
                speed={30}
              />
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row items-start gap-3 animate-blur-in delay-700">
              <Link
                href="/unsere-schule/anmeldung"
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[hsl(215,70%,25%)] transition-all hover:bg-[hsl(200,90%,75%)] hover:text-[hsl(215,70%,15%)] hover:shadow-lg hover:shadow-primary/30"
              >
                Anmeldung Klasse 5
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/unsere-schule/profilprojekte"
                className="group flex items-center gap-2 rounded-full glass-dark px-6 py-3 text-sm font-medium text-white/90 transition-all hover:bg-white/20"
              >
                Profilprojekte entdecken
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row - glass cards below the image */}
      <div className="relative z-10 px-4 md:px-8 lg:px-12 -mt-8 md:-mt-10">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-blur-in delay-900">
            {[
              { value: 900, suffix: "+", label: "Schueler:innen" },
              { value: 80, suffix: "+", label: "Lehrkraefte" },
              { value: 4, suffix: "", label: "Profilprojekte" },
              { value: 25, suffix: "+", label: "AGs & Projekte" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-4 md:p-5 text-center transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 animate-glow-pulse"
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                <p className="font-display text-2xl md:text-3xl text-primary">
                  <CountUpNumber target={stat.value} suffix={stat.suffix} delay={1500 + i * 200} />
                </p>
                <p className="mt-1 text-[10px] font-sub uppercase tracking-[0.15em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="relative z-10 flex justify-center py-10 mt-auto animate-blur-in delay-1200">
        <button
          onClick={() => {
            document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })
          }}
          className="flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-primary transition-colors"
          aria-label="Weiter scrollen"
        >
          <span className="text-[10px] font-sub uppercase tracking-[0.25em]">Entdecken</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  )
}
