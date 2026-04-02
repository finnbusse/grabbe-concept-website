import { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"

// Task 125: Common CMS Page Frame for Editors and List Views
interface CmsPageFrameProps {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}

export function CmsPageFrame({ title, description, actions, children }: CmsPageFrameProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
      <Separator />
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  )
}
