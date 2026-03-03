"use client"

import { usePresentationWizard } from "./presentation-wizard-context"
import { PresentationWizardStep1 } from "./presentation-wizard-step1"
import { PresentationWizardStep2 } from "./presentation-wizard-step2"
import { PresentationWizardStep3 } from "./presentation-wizard-step3"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// ============================================================================
// Progress Steps Data
// ============================================================================

const STEPS = [
  { number: 1, label: "Grunddaten" },
  { number: 2, label: "Inhalt" },
  { number: 3, label: "Veröffentlichen" },
] as const

// ============================================================================
// Main Wizard Component
// ============================================================================

interface PresentationWizardProps {
  editMode?: boolean
}

export function PresentationWizard({ editMode }: PresentationWizardProps) {
  const { state } = usePresentationWizard()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cms/posts?tab=praesentationen">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="font-display text-2xl font-bold">
          {editMode ? "Präsentation bearbeiten" : "Neue Präsentation erstellen"}
        </h1>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center">
              {i > 0 && (
                <div
                  className={`mx-2 h-px w-8 sm:w-12 ${
                    state.currentStep > step.number - 1
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                />
              )}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    state.currentStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : state.currentStep > step.number
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`hidden text-sm sm:inline ${
                    state.currentStep === step.number
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div>
        {state.currentStep === 1 && <PresentationWizardStep1 />}
        {state.currentStep === 2 && <PresentationWizardStep2 />}
        {state.currentStep === 3 && <PresentationWizardStep3 />}
      </div>
    </div>
  )
}
