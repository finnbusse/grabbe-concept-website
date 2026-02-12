import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { getSettings } from "@/lib/settings"
import "./globals.css"

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()
  const title = s.seo_title || "Grabbe-Gymnasium Detmold"
  const description = s.seo_description || "Das Christian-Dietrich-Grabbe-Gymnasium in Detmold - Wir foerdern Deine Talente und staerken Deine Persoenlichkeit."
  return {
    title: {
      default: title,
      template: `%s | ${s.school_name || "Grabbe-Gymnasium"}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "de_DE",
      ...(s.seo_og_image ? { images: [{ url: s.seo_og_image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    generator: "v0.app",
  }
}

export const viewport: Viewport = {
  themeColor: "#1a6dc0",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${_inter.variable} ${_spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
