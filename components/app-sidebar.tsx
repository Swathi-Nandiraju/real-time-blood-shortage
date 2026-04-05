"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Boxes,
  Brain,
  HeartHandshake,
  Droplets,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hospitals", label: "Hospitals", icon: Building2 },
  { href: "/blockchain", label: "Blockchain", icon: Boxes },
  { href: "/xai", label: "XAI Predictions", icon: Brain },
  { href: "/donors", label: "Donors", icon: Users },
  { href: "/requests", label: "Blood Requests", icon: HeartHandshake },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-[hsl(222,47%,7%)]">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Droplets className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-foreground">HydBloodChain</h1>
          <p className="text-[11px] text-muted-foreground">Hyderabad Blood Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1" role="list">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(142,71%,45%)]" />
          <span className="text-xs text-muted-foreground">Chain Status: Active</span>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">Hyderabad, Telangana</p>
      </div>
    </aside>
  )
}
