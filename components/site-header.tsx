"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export type NavItemData = {
  id: string
  label: string
  href: string
  children?: NavItemData[]
}

export function SiteHeader({
  navItems,
  schoolName,
  logoUrl,
}: {
  navItems: NavItemData[]
  schoolName: string
  logoUrl?: string
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Logo + Navbar row */}
      <div className="mx-auto mt-3 flex max-w-4xl items-center gap-3 px-3 lg:mt-4 lg:px-4">
        {/* School logo */}
        <Link href="/" className="shrink-0">
          <img
            src="/images/grabbe-logo.svg"
            alt={schoolName}
            className="h-10 w-auto md:h-12 lg:h-14 drop-shadow-lg"
          />
        </Link>

        {/* Glass navbar */}
        <div className="flex flex-1 items-stretch rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-lg lg:py-0">
          {/* Start button */}
          <Link
            href="/"
            className={`flex items-center px-5 py-2.5 rounded-l-full text-[13px] font-medium transition-all duration-300 ${
              pathname === "/"
                ? "bg-white/30 text-foreground"
                : "text-foreground/80 hover:bg-white/40 hover:text-foreground"
            }`}
          >
            Start
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-stretch lg:flex flex-1" aria-label="Hauptnavigation">
            {navItems
              .filter(item => item.href !== "/")
              .map((item, index, array) =>
              item.children && item.children.length > 0 ? (
                <div
                  key={item.id}
                  className="relative flex items-stretch"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1.5 px-4 text-[13px] font-medium transition-all duration-300 ${
                      index === array.length - 1 ? "rounded-r-full" : ""
                    } ${
                      pathname.startsWith(item.href) && item.href !== "/"
                        ? "bg-white/30 text-foreground"
                        : "text-foreground/80 hover:bg-white/40 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-300 ${
                        openDropdown === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === item.id && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 min-w-[220px] bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-1.5 shadow-xl animate-blur-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`block rounded-xl px-4 py-2.5 text-[13px] transition-all duration-200 ${
                            pathname === child.href
                              ? "bg-white/25 font-medium text-foreground"
                              : "text-foreground/80 hover:bg-white/20 hover:text-foreground"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center px-4 text-[13px] font-medium transition-all duration-300 ${
                    index === array.length - 1 ? "rounded-r-full" : ""
                  } ${
                    pathname === item.href
                      ? "bg-white/30 text-foreground"
                      : "text-foreground/80 hover:bg-white/40 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 hover:bg-white/20 hover:text-foreground transition-all duration-200 lg:hidden mr-1 my-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Navigation schliessen" : "Navigation oeffnen"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="mx-4 mt-2 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 p-2 shadow-xl lg:hidden animate-blur-in">
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <div key={item.id}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-white/25 text-foreground"
                      : "text-foreground/80 hover:bg-white/20 hover:text-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    className={`block rounded-xl py-2 pl-8 pr-4 text-sm transition-all duration-200 ${
                      pathname === child.href
                        ? "font-medium text-foreground bg-white/15"
                        : "text-foreground/80 hover:bg-white/15 hover:text-foreground"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
