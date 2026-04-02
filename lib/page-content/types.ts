export interface PageSectionField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'image' | 'color' | 'number'
  description?: string
}

export interface PageSection {
  id: string
  title: string
  fields: PageSectionField[]
}

export interface EditablePage {
  id: string
  title: string
  description: string
  route: string
  sections: PageSection[]
  defaults: Record<string, string>
}
