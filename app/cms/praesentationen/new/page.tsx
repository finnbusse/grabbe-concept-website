import { PresentationWizardProvider } from "@/components/cms/presentation-wizard-context"
import { PresentationWizard } from "@/components/cms/presentation-wizard"

export default function NewPresentationPage() {
  return (
    <PresentationWizardProvider>
      <PresentationWizard />
    </PresentationWizardProvider>
  )
}
