"use client"

import * as React from "react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export interface DateRangePickerProps {
  date: string
  endDate: string
  time: string
  isAllDay: boolean
  onDateChange: (date: string) => void
  onEndDateChange: (endDate: string) => void
  onTimeChange: (time: string) => void
  onIsAllDayChange: (isAllDay: boolean) => void
}

const TIME_OPTIONS: string[] = []
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    TIME_OPTIONS.push(
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    )
  }
}

/** Parse a "YYYY-MM-DD" string to a local Date, avoiding UTC timezone shift. */
function parseLocalDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined
  const parts = dateStr.split("-").map(Number)
  if (parts.length !== 3) return undefined
  const [year, month, day] = parts
  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined
  const d = new Date(year, month - 1, day)
  if (isNaN(d.getTime())) return undefined
  return d
}

/** Format a Date to "YYYY-MM-DD" string in local time. */
function toDateStr(d: Date): string {
  return format(d, "yyyy-MM-dd")
}

/** Format a Date for human-readable display in German. */
function displayDate(d: Date): string {
  return format(d, "d. MMMM yyyy", { locale: de })
}

const NONE_VALUE = "__none__"

function getTriggerLabel(
  isAllDay: boolean,
  startDate: Date | undefined,
  endDate: Date | undefined
): string {
  if (isAllDay) {
    if (startDate && endDate) {
      return `${displayDate(startDate)} – ${displayDate(endDate)}`
    }
    return startDate ? displayDate(startDate) : "Zeitraum wählen"
  }
  return startDate ? displayDate(startDate) : "Datum wählen"
}

export function DateRangePicker({
  date,
  endDate,
  time,
  isAllDay,
  onDateChange,
  onEndDateChange,
  onTimeChange,
  onIsAllDayChange,
}: DateRangePickerProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false)

  const selectedDate = parseLocalDate(date)
  const selectedEndDate = parseLocalDate(endDate)

  const selectedRange: DateRange = {
    from: selectedDate,
    to: selectedEndDate,
  }

  const handleSingleSelect = (day: Date | undefined) => {
    onDateChange(day ? toDateStr(day) : "")
    setCalendarOpen(false)
  }

  const handleRangeSelect = (range: DateRange | undefined) => {
    onDateChange(range?.from ? toDateStr(range.from) : "")
    onEndDateChange(range?.to ? toDateStr(range.to) : "")
    if (range?.from && range?.to) {
      setCalendarOpen(false)
    }
  }

  const handleMultiDayToggle = (checked: boolean) => {
    onIsAllDayChange(checked)
    if (!checked) {
      onEndDateChange("")
    }
  }

  const triggerLabel = getTriggerLabel(isAllDay, selectedDate, selectedEndDate)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Switch
          id="multi-day-toggle"
          checked={isAllDay}
          onCheckedChange={handleMultiDayToggle}
        />
        <Label htmlFor="multi-day-toggle" className="cursor-pointer text-sm font-normal">
          Mehrtägiges Ereignis
        </Label>
      </div>

      <div className={cn("grid gap-4", !isAllDay && "sm:grid-cols-2")}>
        <div className="grid gap-2">
          <Label>{isAllDay ? "Zeitraum" : "Datum"}</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">{triggerLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {isAllDay ? (
                <Calendar
                  mode="range"
                  selected={selectedRange}
                  onSelect={handleRangeSelect}
                  numberOfMonths={2}
                  locale={de}
                  initialFocus
                />
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSingleSelect}
                  locale={de}
                  initialFocus
                />
              )}
            </PopoverContent>
          </Popover>
        </div>

        {!isAllDay && (
          <div className="grid gap-2">
            <Label>Uhrzeit (optional)</Label>
            <Select
              value={time || NONE_VALUE}
              onValueChange={(v) => onTimeChange(v === NONE_VALUE ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Keine Uhrzeit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Keine Uhrzeit</SelectItem>
                {TIME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t} Uhr
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
