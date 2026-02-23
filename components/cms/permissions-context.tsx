"use client"

import { createContext, useContext } from "react"
import type { CmsPermissions, UserPagePermission } from "@/lib/permissions"

export interface PermissionsContextValue {
  permissions: CmsPermissions
  roleSlugs: string[]
  pagePermissions: UserPagePermission[]
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null)

export function PermissionsProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PermissionsContextValue
}) {
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions(): PermissionsContextValue {
  const ctx = useContext(PermissionsContext)
  if (!ctx) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return ctx
}
