"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { variants } from "@/lib/motion"

type RevealAnimation =
  | "fade-in-up"
  | "fade-in"
  | "slide-in-left"
  | "slide-in-right"
  | "scale-in"
  | "blur-in"
  | "reveal-up"

const animationMap: Record<RevealAnimation, string> = {
  "fade-in-up": "fadeInUp",
  "fade-in": "fadeIn",
  "slide-in-left": "slideInLeft",
  "slide-in-right": "slideInRight",
  "scale-in": "scaleIn",
  "blur-in": "blurIn",
  "reveal-up": "revealUp",
}

interface RevealProps {
  children: ReactNode
  className?: string
  animation?: RevealAnimation
  delay?: number
  /** Override IntersectionObserver threshold (0–1) */
  threshold?: number
  /** If true, the animation will replay when the element leaves and re-enters the viewport */
  once?: boolean
}

/**
 * Scroll-triggered reveal component backed by Framer Motion.
 * Drop-in replacement for <AnimateOnScroll> with the same API.
 *
 * Default animation is `fade-in-up`. For section-header stagger sequences
 * use <StaggerReveal> + <StaggerItem> from components/motion/stagger.tsx.
 *
 * Uses `useInView` with a negative bottom margin so the reveal starts
 * slightly before the element fully enters the viewport.
 */
export function Reveal({
  children,
  className,
  animation = "fade-in-up",
  delay = 0,
  threshold = 0.1,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const inView = useInView(ref, {
    once,
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
      transition={
        delay > 0
          ? { delay }
          : undefined
      }
    >
      {children}
    </motion.div>
  )
}
