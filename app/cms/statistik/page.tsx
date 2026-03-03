"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { BarChart2, RefreshCw, Users, Eye, MousePointerClick, Globe, Monitor, Compass, UserCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NormalizedAnalytics } from "@/app/api/simple-analytics/route"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts"
import { format, parseISO } from "date-fns"
import { de } from "date-fns/locale"

function formatNumber(value: number): string {
  return new Intl.NumberFormat("de-DE").format(value)
}

function formatDateLabel(dateString: string, range: string): string {
  try {
    const date = parseISO(dateString)
    if (range === "today" || range === "yesterday") {
      return format(date, "HH:mm")
    }
    return format(date, "d. MMM", { locale: de })
  } catch {
    return dateString
  }
}

const DATE_RANGES = [
  { value: "today", label: "Heute", start: "today", end: "today" },
  { value: "yesterday", label: "Gestern", start: "yesterday", end: "yesterday" },
  { value: "7d", label: "Letzte 7 Tage", start: "today-7d", end: "today" },
  { value: "30d", label: "Letzte 30 Tage", start: "today-30d", end: "today" },
  { value: "this-month", label: "Dieser Monat", start: "this-month", end: "today" },
  { value: "last-month", label: "Letzter Monat", start: "last-month", end: "last-month" },
]

export default function StatistikPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<NormalizedAnalytics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState("30d")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const activeRange = DATE_RANGES.find((r) => r.value === dateRange) || DATE_RANGES[3]

  const loadAnalytics = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        start: activeRange.start,
        end: activeRange.end,
      })
      const response = await fetch(`/api/simple-analytics?${params.toString()}`)
      const json = await response.json()

      if (!response.ok) {
        setError(json.error || "Statistiken konnten nicht geladen werden.")
        if (!isAutoRefresh) setData(null)
      } else {
        setData(json)
        setLastUpdated(new Date())
      }
    } catch {
      setError("Fehler beim Laden der Statistikdaten.")
      if (!isAutoRefresh) setData(null)
    } finally {
      if (!isAutoRefresh) setLoading(false)
    }
  }, [activeRange])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  useEffect(() => {
    const isLiveRange = dateRange === "today"
    if (!isLiveRange) return

    const interval = setInterval(() => {
      loadAnalytics(true)
    }, 60000) // Auto-refresh every minute for "today"

    return () => clearInterval(interval)
  }, [dateRange, loadAnalytics])

  const chartData = useMemo(() => {
    if (!data?.timeseries) return []
    return data.timeseries.map(item => ({
      ...item,
      label: formatDateLabel(item.date, activeRange.value)
    }))
  }, [data?.timeseries, activeRange.value])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            Statistik
            {dateRange === "today" && (
              <span className="relative flex h-3 w-3 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" title="Live Update aktiv"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
            {lastUpdated ? `Zuletzt aktualisiert: ${format(lastUpdated, "HH:mm:ss")}` : 'Lade...'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange} disabled={loading && !data}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zeitraum wählen" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => loadAnalytics(false)} disabled={loading} title="Aktualisieren" aria-label="Statistik aktualisieren">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && !data && (
        <Card className="mt-6 border-destructive/40 p-4">
          <p className="text-sm font-medium text-destructive">{error}</p>
        </Card>
      )}

      {loading && !data ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
            <Skeleton className="h-[300px] rounded-xl" />
          </div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Besucher</p>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{formatNumber(data.summary.visitors)}</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Seitenaufrufe</p>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{formatNumber(data.summary.pageviews)}</p>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <MousePointerClick className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">Besuche</p>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{formatNumber(data.summary.visits)}</p>
              {data.summary.secondsOnPage != null && (
                <p className="mt-1 text-xs text-muted-foreground">Ø Verweildauer: {Math.round(data.summary.secondsOnPage)}s</p>
              )}
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="font-semibold mb-4 text-foreground">Besucher & Aufrufe Trend</h2>
            <div className="h-[250px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                      minTickGap={20}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dx={-10}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                    />
                    <Area type="monotone" name="Aufrufe" dataKey="pageviews" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPageviews)" />
                    <Area type="monotone" name="Besucher" dataKey="visitors" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Keine Daten für diesen Zeitraum
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <TopListCard title="Top Seiten" icon={Eye} data={data.topPages} nameKey="page" />
            <TopListCard title="Herkunft (Referrers)" icon={Compass} data={data.referrers} />
            <TopListCard title="Länder" icon={Globe} data={data.countries} />
            <TopListCard title="Geräte & Browser" icon={Monitor} data={data.devices} secondaryData={data.browsers} secondaryTitle="Browser" />
          </div>

          <p className="mt-4 text-xs text-muted-foreground text-center sm:text-left">
            Quelle: {data.source} · Zeitraum: {data.range.start} bis {data.range.end}
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BarChart2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-lg font-semibold text-foreground">Keine Statistikdaten</h2>
        </div>
      )}
    </div>
  )
}

function TopListCard({
  title,
  icon: Icon,
  data,
  nameKey = "name",
  secondaryData,
  secondaryTitle
}: {
  title: string,
  icon: any,
  data: any[],
  nameKey?: string,
  secondaryData?: any[],
  secondaryTitle?: string
}) {
  return (
    <Card className="p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>

      {data && data.length > 0 ? (
        <div className="space-y-4 flex-grow">
          <ul className="space-y-3">
            {data.slice(0, 5).map((item, i) => {
              const maxVal = Math.max(...data.map(d => d.pageviews || d.visitors || 1));
              const val = item.pageviews || item.visitors;
              const percent = Math.max((val / maxVal) * 100, 2);

              return (
                <li key={i} className="group">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="truncate pr-4 text-foreground">{item[nameKey] === '' ? 'Direkt / Unbekannt' : item[nameKey]}</span>
                    <span className="text-muted-foreground font-medium shrink-0">{formatNumber(val)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary/50 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>

          {secondaryData && secondaryData.length > 0 && (
            <div className="pt-4 border-t mt-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">{secondaryTitle}</h3>
              <ul className="space-y-3">
                {secondaryData.slice(0, 3).map((item, i) => {
                  const maxVal = Math.max(...secondaryData.map(d => d.pageviews || d.visitors || 1));
                  const val = item.pageviews || item.visitors;
                  const percent = Math.max((val / maxVal) * 100, 2);

                  return (
                    <li key={`sec-${i}`} className="group">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="truncate pr-4 text-foreground">{item.name || 'Unbekannt'}</span>
                        <span className="text-muted-foreground font-medium shrink-0">{formatNumber(val)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary/50 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground flex-grow flex items-center justify-center">
          Keine Daten verfügbar.
        </p>
      )}
    </Card>
  )
}
