"use client"

import { useHospitals } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  MapPin,
  Phone,
  Bed,
  Loader2,
  Droplets,
} from "lucide-react"
import type { BloodGroup } from "@/lib/types"
import { BLOOD_GROUP_COLORS } from "@/lib/types"

interface InventoryItem {
  blood_group: BloodGroup
  units_available: number
  units_reserved: number
  expiry_date: string | null
}

interface HospitalWithInventory {
  id: number
  name: string
  zone: string
  type: string
  address: string
  contact_phone: string
  bed_capacity: number
  blood_bank_license: string
  inventory: InventoryItem[] | null
}

const typeStyles: Record<string, string> = {
  Government: "bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,60%)] border-[hsl(217,91%,60%)]/30",
  Private: "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)] border-[hsl(142,71%,45%)]/30",
  Specialty: "bg-[hsl(280,65%,60%)]/15 text-[hsl(280,65%,60%)] border-[hsl(280,65%,60%)]/30",
}

export default function HospitalsPage() {
  const { data: hospitals, isLoading, error } = useHospitals()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !hospitals) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Failed to load hospitals</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Hospitals</h1>
        <p className="text-sm text-muted-foreground">
          {hospitals.length} blood banks and hospitals across Hyderabad
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(hospitals as HospitalWithInventory[]).map((hospital) => {
          const totalUnits = (hospital.inventory || []).reduce(
  (sum: number, inv: InventoryItem) => sum + inv.units_available,
  0
)
          const maxCapacity = ((hospital.inventory || []).length || 1) * 50

          return (
            <Card key={hospital.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="truncate text-sm font-semibold text-foreground">
                      {hospital.name}
                    </CardTitle>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{hospital.zone}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={typeStyles[hospital.type] || ""}>
                    {hospital.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {/* Quick stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" /> {hospital.bed_capacity} beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {hospital.contact_phone}
                    </span>
                  </div>

                  {/* Overall inventory bar */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Droplets className="h-3 w-3" /> Total Blood Stock
                      </span>
                      <span className="font-medium text-foreground">{totalUnits} units</span>
                    </div>
                    <Progress
                      value={Math.min((totalUnits / maxCapacity) * 100, 100)}
                      className="h-2"
                    />
                  </div>

                  {/* Blood group breakdown */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {(hospital.inventory || []).map((inv: InventoryItem) => (
                      <div
                        key={inv.blood_group}
                        className="flex flex-col items-center rounded-md border border-border bg-background/50 p-1.5"
                      >
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: BLOOD_GROUP_COLORS[inv.blood_group] }}
                        >
                          {inv.blood_group}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            inv.units_available < 5
                              ? "text-destructive"
                              : inv.units_available < 15
                              ? "text-[hsl(38,92%,50%)]"
                              : "text-foreground"
                          }`}
                        >
                          {inv.units_available}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* License */}
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {hospital.blood_bank_license}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
