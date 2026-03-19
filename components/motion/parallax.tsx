"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

interface ParallaxProps {
  /** Content to render inside the parallax layer */
  children: ReactNode
  className?: string
  /**
   * How many pixels the layer shifts over a full viewport scroll.
   * Positive = moves up (classic parallax), negative = moves down.
   * Keep values small (20–60px) for subtlety.
   */
  offset?: number
  /** Apply gentle spring smoothing to the scroll value */
  smooth?: boolean
}

/**
 * Scroll-linked parallax wrapper. The children translate vertically
 * as the user scrolls, creating a subtle depth illusion. Designed to
 * be applied to background image containers or decorative elements.
 *
 * Performance: uses CSS `transform` (compositor-only) so it never
 * triggers layout or paint, maintaining 60 fps.
 */
export function Parallax({
  children,
  className,
  offset = 40,
  smooth = true,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const raw = useTransform(scrollYProgress, [0, 1], [offset / 2, -offset / 2])
  const springY = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.5 })
  const y = smooth ? springY : raw

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}
