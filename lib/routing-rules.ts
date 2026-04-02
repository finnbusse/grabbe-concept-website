import { SYSTEM_ROUTES } from "./page-content/registry"

// Task 88: Helper to check if a route is a system route
export function isSystemRoute(path: string): boolean {
  return SYSTEM_ROUTES.some(r => r.path === path)
}
