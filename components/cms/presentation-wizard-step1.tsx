"use client"

import { usePresentationWizard, generateSlug } from "./presentation-wizard-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TagSelector } from "./tag-selector"
import { ImagePicker } from "./image-picker"
import { ArrowRight } from "lucide-react"

// ============================================================================
// Step 1 — Grunddaten
// ============================================================================

export function PresentationWizardStep1() {
  const { state, dispatch } = usePresentationWizard()

  const handleTitleChange = (value: string) => {
    dispatch({ type: "SET_TITLE", payload: value })
    if (!state.presentationId) {
      dispatch({ type: "SET_SLUG", payload: generateSlug(value) })
    }
  }

  const handleNext = () => {
    dispatch({ type: "SET_STEP", payload: 2 })
  }

  const canProceed = state.title.trim().length > 0

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      {/* Title + Slug */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="presentation-title" className="text-base font-semibold">
            Titel *
          </Label>
          <Input
            id="presentation-title"
            value={state.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="z.B. Schulprofil 2025"
            className="font-display text-xl h-14 px-4"
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="presentation-slug" className="text-sm text-muted-foreground">
            URL-Slug
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">/p/</span>
            <Input
              id="presentation-slug"
              value={state.slug}
              onChange={(e) => dispatch({ type: "SET_SLUG", payload: e.target.value })}
              placeholder="url-slug"
              className="font-mono text-sm"
            />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <Label htmlFor="presentation-subtitle" className="text-base font-semibold">
          Untertitel (optional)
        </Label>
        <textarea
          id="presentation-subtitle"
          value={state.subtitle}
          onChange={(e) => dispatch({ type: "SET_SUBTITLE", payload: e.target.value })}
          placeholder="Kurzer Untertitel für die Präsentation…"
          rows={2}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      {/* Cover Image */}
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <Label className="text-base font-semibold">Titelbild</Label>
        <p className="text-xs text-muted-foreground">
          Wird als großes Bild über der Präsentation und in der Übersicht angezeigt.
        </p>
        <ImagePicker
          value={state.coverImageUrl}
          onChange={(url) => dispatch({ type: "SET_COVER_IMAGE", payload: url })}
          aspectRatio="16/9"
        />
      </div>

      {/* Tags */}
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <Label className="text-base font-semibold">Tags (optional)</Label>
        <TagSelector
          selectedTagIds={state.tagIds}
          onChange={(ids) => dispatch({ type: "SET_TAG_IDS", payload: ids })}
        />
      </div>

      {/* Auto-save indicator */}
      {state.lastAutoSaved && (
        <p className="text-center text-xs text-muted-foreground">
          Automatisch gespeichert um {state.lastAutoSaved}
        </p>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!canProceed} size="lg" className="gap-2">
          Weiter
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
