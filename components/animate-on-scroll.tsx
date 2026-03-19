"use client"

import { type ReactNode } from "react"
import { motion, type Variants } from "framer-motion"

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  animation?: "fade-in-up" | "fade-in" | "slide-in-left" | "slide-in-right" | "scale-in" | "blur-in" | "reveal-up"
  delay?: number
  threshold?: number
}

// Minimal, elegant animation variants mirroring premium SaaS design (anthropic-style)
const cinematicVariants: Record<string, Variants> = {
  "fade-in-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 1 } },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { ease: "easeInOut", duration: 0.8 } },
  },
  "slide-in-left": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 1 } },
  },
  "slide-in-right": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 1 } },
  },
  "scale-in": {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { ease: [0.16, 1, 0.3, 1], duration: 1 } },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { ease: [0.16, 1, 0.3, 1], duration: 1 } },
  },
  "reveal-up": {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ease: [0.16, 1, 0.3, 1], duration: 1.2 } },
  },
}

export function AnimateOnScroll({
  children,
  className = "",
  animation = "blur-in",
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const selectedVariant = cinematicVariants[animation] || cinematicVariants["fade-in-up"]

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold, margin: "0px 0px -40px 0px" }}
      variants={selectedVariant}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
