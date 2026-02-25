// ---------------------------------------------------------------------------
// Design settings types & defaults — safe for both server and client imports
// ---------------------------------------------------------------------------

export interface DesignSettings {
  fonts: {
    heading: string   // Google Fonts family name or 'default'
    body: string
    accent: string
  }
  colors: {
    primary: string   // hex
    subjectNaturwissenschaften: string
    subjectMusik: string
    subjectKunst: string
    subjectSport: string
  }
}

export const DESIGN_DEFAULTS: DesignSettings = {
  fonts: { heading: "default", body: "default", accent: "default" },
  colors: {
    primary: "#2563eb",
    subjectNaturwissenschaften: "#16a34a",
    subjectMusik: "#ea580c",
    subjectKunst: "#7c3aed",
    subjectSport: "#0891b2",
  },
}

/** Parse stored JSON into DesignSettings, falling back to defaults */
export function parseDesignSettings(raw: string | undefined): DesignSettings {
  if (!raw) return DESIGN_DEFAULTS
  try {
    const parsed = JSON.parse(raw) as Partial<DesignSettings>
    return {
      fonts: { ...DESIGN_DEFAULTS.fonts, ...parsed.fonts },
      colors: { ...DESIGN_DEFAULTS.colors, ...parsed.colors },
    }
  } catch {
    return DESIGN_DEFAULTS
  }
}
