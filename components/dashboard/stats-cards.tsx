"use client"

import { Building2, Users, Droplets, AlertTriangle, Boxes, HeartHandshake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardsProps {
  totalHospitals: number
  totalDonors: number
  totalUnitsAvailable: number
  activeShortages: number
  criticalShortages: number
  openRequests: number
  blockchainHeight: number
}

export function StatsCards({
  totalHospitals,
  totalDonors,
  totalUnitsAvailable,
  activeShortages,
  criticalShortages,
  openRequests,
  blockchainHeight,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Hospitals",
      value: totalHospitals,
      icon: Building2,
      color: "text-[hsl(217,91%,60%)]",
      bg: "bg-[hsl(217,91%,60%)]/10",
    },
    {
      label: "Active Donors",
      value: totalDonors,
      icon: Users,
      color: "text-[hsl(142,71%,45%)]",
      bg: "bg-[hsl(142,71%,45%)]/10",
    },
    {
      label: "Blood Units",
      value: totalUnitsAvailable,
      icon: Droplets,
      color: "text-[hsl(0,72%,51%)]",
      bg: "bg-[hsl(0,72%,51%)]/10",
    },
    {
      label: "Active Shortages",
      value: activeShortages,
      icon: AlertTriangle,
      color: criticalShortages > 0 ? "text-[hsl(0,84%,60%)]" : "text-[hsl(38,92%,50%)]",
      bg: criticalShortages > 0 ? "bg-[hsl(0,84%,60%)]/10" : "bg-[hsl(38,92%,50%)]/10",
      sub: criticalShortages > 0 ? `${criticalShortages} critical` : undefined,
    },
    {
      label: "Open Requests",
      value: openRequests,
      icon: HeartHandshake,
      color: "text-[hsl(38,92%,50%)]",
      bg: "bg-[hsl(38,92%,50%)]/10",
    },
    {
      label: "Blockchain Blocks",
      value: blockchainHeight,
      icon: Boxes,
      color: "text-[hsl(173,58%,39%)]",
      bg: "bg-[hsl(173,58%,39%)]/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                {stat.sub && (
                  <p className="text-[10px] font-medium text-destructive">{stat.sub}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
