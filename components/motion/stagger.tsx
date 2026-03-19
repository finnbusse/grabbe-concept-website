"use client"

import { useRef, useEffect, type ReactNode } from "react"
import {
  motion,
  useInView,
  useAnimationControls,
  useReducedMotion,
} from "framer-motion"
import { variants } from "@/lib/motion"

// ─── Types ───────────────────────────────────────────────────────────────────

interface StaggerRevealProps {
  children: ReactNode
  className?: string
  /**
   * Extra delay (seconds) before the stagger sequence begins.
   * Useful when the container sits alongside another animated element.
   */
  delay?: number
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

// ─── StaggerReveal ────────────────────────────────────────────────────────────
//
// A viewport-triggered container that staggers its `<StaggerItem>` children.
// Pattern:
//   <StaggerReveal className="text-center">
//     <StaggerItem><p className="label">…</p></StaggerItem>
//     <StaggerItem><h2>…</h2></StaggerItem>
//     <StaggerItem><p className="body">…</p></StaggerItem>
//   </StaggerReveal>
//
// Each StaggerItem enters 90 ms after the previous one, using the calm
// `headerItem` variant (y: 14 → 0, editorial ease, 750 ms).
//
// Respects prefers-reduced-motion: all items fade in instantly at once.

export function StaggerReveal({ children, className, delay = 0 }: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const prefersReducedMotion = useReducedMotion()

  const inView = useInView(ref, {
    once: true,
    margin: "0px 0px -40px 0px",
  })

  useEffect(() => {
    if (inView) controls.start("visible")
  }, [inView, controls])

  const containerVariant = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.09,
            delayChildren: delay,
          },
        },
      }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={containerVariant}
    >
      {children}
    </motion.div>
  )
}

// ─── StaggerItem ─────────────────────────────────────────────────────────────
//
// Direct child of StaggerReveal. Inherits the "visible" state from its
// parent and animates using the `headerItem` variant.

export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion()

  const itemVariant = prefersReducedMotion
    ? variants.reducedMotion
    : variants.headerItem

  return (
    <motion.div className={className} variants={itemVariant}>
      {children}
    </motion.div>
  )
}
