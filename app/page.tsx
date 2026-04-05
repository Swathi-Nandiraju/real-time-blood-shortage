"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useDashboard } from "@/lib/hooks"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { ShortageAlerts } from "@/components/dashboard/shortage-alerts"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  // ✅ FIXED LOGIN CHECK
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      router.replace("/login") // ✅ IMPORTANT (not push)
    } else {
      setIsChecking(false)
    }
  }, [])

  const { data, isLoading, error } = useDashboard()

  // ✅ BLOCK UI UNTIL CHECK DONE
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time blood supply chain overview
          </p>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn")
            window.location.href = "/login"
          }}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <StatsCards {...data} />

      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryChart data={data.inventoryByGroup} />
        <ShortageAlerts predictions={data.activePredictions} />
      </div>

      <RecentActivity transactions={data.recentTransactions} />
    </div>
  )
}