import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

type NormalizedAnalytics = {
  source: string
  range: { start: string; end: string }
  summary: {
    visitors: number
    pageviews: number
    visits: number
    bounceRate: number | null
    secondsOnPage: number | null
  }
  topPages: Array<{ page: string; pageviews: number; visitors: number; secondsOnPage: number | null }>
  timeseries: Array<{ date: string; pageviews: number; visitors: number }>
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function normalizeAnalytics(raw: any, source: string): NormalizedAnalytics {
  const histogramSource = Array.isArray(raw?.histogram) ? raw.histogram : []
  const pagesSource = Array.isArray(raw?.pages) ? raw.pages : []

  const timeseries = histogramSource
    .map((row: any) => ({
      date: String(row.date ?? row.value ?? row.day ?? ""),
      pageviews: toNumber(row.pageviews ?? row.views ?? row.count ?? row.value),
      visitors: toNumber(row.visitors ?? row.unique_visitors ?? row.uniques),
    }))
    .filter((row: { date: string }) => Boolean(row.date))

  const topPages = pagesSource
    .map((page: any) => ({
      page: String(page.value ?? page.page ?? page.path ?? "/"),
      pageviews: toNumber(page.pageviews ?? page.views),
      visitors: toNumber(page.visitors ?? page.unique_visitors ?? page.uniques),
      secondsOnPage: page.seconds_on_page == null ? null : toNumber(page.seconds_on_page),
    }))
    .sort((a: { pageviews: number }, b: { pageviews: number }) => b.pageviews - a.pageviews)
    .slice(0, 10)

  const pageviewsFromSeries = timeseries.reduce((acc: number, item: { pageviews: number }) => acc + item.pageviews, 0)
  const visitorsFromSeries = timeseries.reduce((acc: number, item: { visitors: number }) => acc + item.visitors, 0)

  return {
    source,
    range: {
      start: String(raw?.start ?? "today-30d"),
      end: String(raw?.end ?? "yesterday"),
    },
    summary: {
      visitors: toNumber(raw?.visitors) || visitorsFromSeries,
      pageviews: toNumber(raw?.pageviews) || pageviewsFromSeries,
      visits: toNumber(raw?.visits),
      bounceRate: raw?.bounce_rate == null ? null : toNumber(raw?.bounce_rate),
      secondsOnPage: raw?.seconds_on_page == null ? null : toNumber(raw?.seconds_on_page),
    },
    topPages,
    timeseries,
  }
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 })
  }

  const domain = process.env.SIMPLE_ANALYTICS_DOMAIN || "grabbe.site"
  const query = new URLSearchParams({
    version: "6",
    fields: "histogram,pages,seconds_on_page",
    start: "today-30d",
    end: "yesterday",
    timezone: "Europe/Berlin",
  })

  const url = `https://simpleanalytics.com/${domain}.json?${query.toString()}`

  const response = await fetch(url, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Simple Analytics API Anfrage fehlgeschlagen",
        status: response.status,
        details: await response.text(),
        source: url,
      },
      { status: 502 }
    )
  }

  const raw = await response.json()
  return NextResponse.json(normalizeAnalytics(raw, `simpleanalytics.com/${domain}.json`))
}
