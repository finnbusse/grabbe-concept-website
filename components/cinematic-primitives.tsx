"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react"
import { usePathname } from "next/navigation"

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return reduced
}

export function CinematicPage({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="page-transition-shell">
      <div className="page-transition-stage">{children}</div>
    </div>
  )
}

export function EditorialReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}) {
  return (
    <Tag
      className={`editorial-reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

export function SplitRevealHeadline({
  text,
  className = "",
  stagger = 90,
}: {
  text: string
  className?: string
  stagger?: number
}) {
  const lines = useMemo(() => text.split(/\n+/).filter(Boolean), [text])

  return (
    <div className={className}>
      {lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`} className="split-line">
          {line.split(" ").map((word, wordIndex) => (
            <span
              key={`${word}-${wordIndex}`}
              className="split-word"
              style={{ ["--word-delay" as string]: `${lineIndex * stagger + wordIndex * 42}ms` } as CSSProperties}
            >
              {word}&nbsp;
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

export function CinematicHeroFrame({
  children,
  className = "",
  contentClassName = "",
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (reducedMotion) return

    const el = ref.current
    if (!el) return

    let frame = 0
    const update = () => {
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const total = Math.max(rect.height - viewport, 1)
      const next = clamp(-rect.top / total)
      setProgress(next)
      frame = 0
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [reducedMotion])

  const style = reducedMotion
    ? undefined
    : ({
        ["--hero-progress" as string]: progress.toFixed(4),
        ["--hero-scale" as string]: `${1 - progress * 0.08}`,
        ["--hero-radius" as string]: `${24 + progress * 28}px`,
        ["--hero-padding" as string]: `${20 + progress * 44}px`,
        ["--hero-translate" as string]: `${progress * 28}px`,
        ["--hero-blur-opacity" as string]: `${0.08 + progress * 0.18}`,
      } as CSSProperties)

  return (
    <section ref={ref} className={`cinematic-hero ${className}`} style={style}>
      <div className="cinematic-hero__sticky">
        <div className="cinematic-hero__frame">
          <div className="cinematic-hero__ambient" />
          <div className={`cinematic-hero__content ${contentClassName}`}>{children}</div>
        </div>
      </div>
    </section>
  )
}

export function DepthLayer({
  children,
  className = "",
  speed = 0.16,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  return (
    <div
      className={`depth-layer ${className}`}
      style={{ ["--depth-speed" as string]: `${speed}` } as CSSProperties}
    >
      {children}
    </div>
  )
}
