import Image from "next/image"
import { EditorialReveal, SplitRevealHeadline } from "@/components/cinematic-primitives"

function djb2(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = Math.imul(h, 33) ^ str.charCodeAt(i)
  return h >>> 0
}

function generateAsciiGrid(seed: string, cols = 56, rows = 16): string {
  const h = djb2(seed)
  const glyphs = ["·", ":", ".", "+", "×", "◇", "○", "▪", "▫", "◦", "∘", "⊙"]
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ""
    for (let c = 0; c < cols; c++) {
      const v =
        Math.sin((h % 997) * 0.0031 + r * 0.71 + c * 0.29) *
        Math.cos((h % 503) * 0.0017 + r * 0.43 + c * 0.61)
      line += v > 0.25 ? glyphs[Math.abs(Math.floor(v * 100 + h)) % glyphs.length] : " "
    }
    lines.push(line)
  }
  return lines.join("\n")
}

interface PageHeroProps {
  title: string
  label?: string
  subtitle?: string
  imageUrl?: string
}

export function PageHero({ title, label, subtitle, imageUrl }: PageHeroProps) {
  const ascii = imageUrl ? "" : generateAsciiGrid(title)

  return (
    <section className="cinematic-section overflow-hidden border-b border-border/60">
      <div className="cinematic-container">
        <div className="cinematic-panel grid gap-8 px-6 py-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] md:px-10 md:py-12 lg:px-12 lg:py-14">
          <div className="flex min-w-0 flex-col justify-center">
            {label && (
              <EditorialReveal className="text-[11px] uppercase tracking-[0.28em] text-primary">
                {label}
              </EditorialReveal>
            )}
            <EditorialReveal delay={120}>
              <h1 className="mt-3 font-display text-4xl tracking-[-0.05em] text-foreground md:text-5xl lg:text-6xl text-balance">
                <SplitRevealHeadline text={title} />
              </h1>
            </EditorialReveal>
            {subtitle && (
              <EditorialReveal delay={220} className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                {subtitle}
              </EditorialReveal>
            )}
          </div>

          <EditorialReveal delay={280} className="relative min-h-[16rem] overflow-hidden rounded-[calc(var(--surface-radius)-0.5rem)] border border-border/60 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            ) : (
              <>
                <pre className="absolute inset-0 overflow-hidden p-5 font-mono text-[9px] leading-[1.5] text-primary/25 select-none">
                  {ascii}
                </pre>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_30%),linear-gradient(135deg,rgba(37,99,235,0.22),transparent_60%)]" />
              </>
            )}
          </EditorialReveal>
        </div>
      </div>
    </section>
  )
}
