"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import {
  CinematicHeroFrame,
  DepthLayer,
  EditorialReveal,
  SplitRevealHeadline,
} from "@/components/cinematic-primitives"

export function HeroSection({ content }: { content?: Record<string, unknown> }) {
  const c = content || {}
  const headline1 = (c.headline1 as string) || "Deine Talente."
  const headline2 = (c.headline2 as string) || "Deine Bühne."
  const headline3 = (c.headline3 as string) || "Dein Grabbe."
  const subtitle =
    (c.subtitle as string) ||
    "Wir fördern Deine Talente und stärken Deine Persönlichkeit."
  const cta1Text = (c.cta1_text as string) || "Anmeldung Klasse 5"
  const cta1Link = (c.cta1_link as string) || "/unsere-schule/anmeldung"
  const cta2Text = (c.cta2_text as string) || "Profilprojekte entdecken"
  const cta2Link = (c.cta2_link as string) || "/unsere-schule/profilprojekte"
  const scrollText = (c.scroll_text as string) || "Entdecken"
  const heroImageUrl =
    (c.hero_image_url as string) ||
    "https://iplsqewa1jv1ew7a.public.blob.vercel-storage.com/schulwebsite/hero-a-light-JYVqm0zAQBXijY3qt5X7egYP4fmJow.webp"
  const heroImageDarkUrl =
    (c.hero_image_dark_url as string) ||
    "https://iplsqewa1jv1ew7a.public.blob.vercel-storage.com/schulwebsite/hero-a-dark-9y46Mdl0OXCy6CpagXTisMr7j5Tcl8.webp"

  return (
    <section className="relative bg-background">
      <CinematicHeroFrame contentClassName="flex h-full flex-col justify-between">
        <div className="absolute inset-0">
          <div className="hero-image-light absolute inset-0">
            <DepthLayer speed={0.12} className="absolute inset-0 h-full w-full">
              <Image
                src={heroImageUrl}
                alt="Grabbe-Gymnasium Schulgebäude"
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="100vw"
              />
            </DepthLayer>
          </div>
          <div className="hero-image-dark absolute inset-0">
            <DepthLayer speed={0.18} className="absolute inset-0 h-full w-full">
              <Image
                src={heroImageDarkUrl}
                alt="Grabbe-Gymnasium Schulgebäude bei Nacht"
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="100vw"
              />
            </DepthLayer>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,14,28,0.18),rgba(6,14,28,0.62))]" />
          <div className="absolute inset-x-[12%] top-[14%] h-40 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-full flex-col justify-between">
          <div className="flex-1" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.55fr)] lg:items-end">
            <div className="max-w-4xl">
              <EditorialReveal className="mb-5 inline-flex rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-white/78 backdrop-blur-md">
                Premium Bildungserlebnis · Detmold
              </EditorialReveal>
              <h1
                className="max-w-4xl font-display text-4xl leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6rem]"
                style={{ textShadow: "0 18px 60px rgba(0,0,0,0.28)" }}
              >
                <SplitRevealHeadline text={`${headline1}\n${headline2}`} />
                <span className="mt-2 block italic text-[hsl(197,100%,89%)]">
                  <SplitRevealHeadline text={headline3} stagger={120} />
                </span>
              </h1>
              <EditorialReveal
                delay={240}
                className="mt-6 max-w-2xl text-sm leading-7 text-white/82 sm:text-base"
              >
                {subtitle}
              </EditorialReveal>
              <EditorialReveal delay={360} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={cta1Link}
                  onClick={() => trackEvent("hero_cta_click", { label: cta1Text, href: cta1Link })}
                  className="hover-lift group inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.18)] transition-all hover:bg-white"
                >
                  {cta1Text}
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={cta2Link}
                  onClick={() => trackEvent("hero_cta_click", { label: cta2Text, href: cta2Link })}
                  className="hover-lift inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/16"
                >
                  {cta2Text}
                </Link>
              </EditorialReveal>
            </div>

            <EditorialReveal delay={420} className="hidden lg:block">
              <div className="cinematic-panel border-white/12 bg-black/18 p-6 text-white/75">
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/46">Warum Grabbe</p>
                <div className="mt-5 grid gap-4">
                  {[
                    "Klarer Fokus auf Talente, Persönlichkeit und Zukunft.",
                    "Ruhige, hochwertige Informationsarchitektur über alle Seiten hinweg.",
                    "CMS-Inhalte bleiben kuratiert, lesbar und visuell konsistent.",
                  ].map((item) => (
                    <div key={item} className="border-t border-white/12 pt-4 text-sm leading-6 text-white/76">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </EditorialReveal>
          </div>

          <EditorialReveal delay={520} className="mt-10 flex justify-center pb-2">
            <button
              onClick={() => {
                document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" })
                trackEvent("hero_scroll_click")
              }}
              className="group inline-flex flex-col items-center gap-3 text-white/66 transition-colors hover:text-white"
              aria-label="Weiter scrollen"
            >
              <span className="text-[10px] uppercase tracking-[0.35em]">{scrollText}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/8 backdrop-blur-md transition-all duration-500 group-hover:scale-105 group-hover:bg-white/14">
                <ArrowDown className="h-4 w-4" />
              </span>
            </button>
          </EditorialReveal>
        </div>
      </CinematicHeroFrame>
    </section>
  )
}
