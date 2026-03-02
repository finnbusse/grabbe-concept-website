"use client"

import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePermissions } from "@/components/cms/permissions-context"
import { checkPermission } from "@/lib/permissions-shared"

type UserManagementTab = "users" | "roles"

export function UsersRolesTabs({ activeTab }: { activeTab: UserManagementTab }) {
  const { permissions } = usePermissions()
  const canViewUsers = checkPermission(permissions, "users")
  const canViewRoles = checkPermission(permissions, "roles")

  const visibleTabs = [
    canViewUsers ? { key: "users" as const, label: "Benutzer", href: "/cms/users" } : null,
    canViewRoles ? { key: "roles" as const, label: "Rollen", href: "/cms/roles" } : null,
  ].filter((tab): tab is { key: UserManagementTab; label: string; href: string } => tab !== null)

  if (visibleTabs.length <= 1) {
    return null
  }

  return (
    <Tabs value={activeTab} className="mt-5">
      <TabsList>
        {visibleTabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key} asChild>
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
