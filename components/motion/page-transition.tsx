"use client"

import { type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ease, duration } from "@/lib/motion"

interface PageTransitionProps {
  children: ReactNode
  /** Unique key — should change on route change. Defaults to a static value. */
  motionKey?: string
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.cinematic },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.fast, ease: ease.in },
  },
}

/**
 * Wraps page content with a subtle fade+translate entrance animation.
 * Place this around the `<main>` content area of each page.
 * Using a unique `motionKey` per page enables exit animations with
 * Next.js App Router via AnimatePresence.
 */
export function PageTransition({ children, motionKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={motionKey}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
