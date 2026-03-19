"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface AnimateOnScrollProps {
  children: ReactNode
  className?: string
  animation?: "fade-in-up" | "fade-in" | "slide-in-left" | "slide-in-right" | "scale-in" | "blur-in" | "reveal-up"
  delay?: number
  threshold?: number
}

export function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`${isVisible ? "editorial-reveal" : "opacity-0"} ${className}`}
      style={isVisible ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  )
}
