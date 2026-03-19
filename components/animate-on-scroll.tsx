"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { variants } from "@/lib/motion"

type AnimationType =
  | "fade-in-up"
  | "fade-in"
  | "slide-in-left"
  | "slide-in-right"
  | "scale-in"
  | "blur-in"
  | "reveal-up"

const animationMap: Record<AnimationType, string> = {
  "fade-in-up": "fadeInUp",
  "fade-in": "fadeIn",
  "slide-in-left": "slideInLeft",
  "slide-in-right": "slideInRight",
  "scale-in": "scaleIn",
  "blur-in": "blurIn",
  "reveal-up": "revealUp",
}

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  threshold?: number
}

/**
 * Scroll-triggered reveal component — Framer Motion powered.
 * Fully backwards-compatible with the previous IntersectionObserver
 * implementation; all existing callers continue to work unchanged.
 *
 * Default animation is `fade-in-up` — a subtle y-lift with editorial ease.
 * For section-header stagger sequences use <StaggerReveal> + <StaggerItem>.
 *
 * Respects the user's `prefers-reduced-motion` preference.
 */
export function AnimateOnScroll({
  children,
  className = "",
  animation = "fade-in-up",
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const inView = useInView(ref, {
    once: true,
    // Trigger slightly before the element is fully in view — feels eager
    // but not rushed.
    margin: "0px 0px -40px 0px",
    amount: threshold,
  })

  const variantKey = animationMap[animation]
  const variant = prefersReducedMotion
    ? variants.reducedMotion
    : variants[variantKey]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variant}
      transition={delay > 0 ? { delay } : undefined}
    >
      {children}
    </motion.div>
  )
}
