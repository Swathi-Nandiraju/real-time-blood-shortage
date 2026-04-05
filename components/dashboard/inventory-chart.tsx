"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { BLOOD_GROUP_COLORS } from "@/lib/types"
import type { BloodGroup } from "@/lib/types"

interface InventoryChartProps {
  data?: { blood_group: BloodGroup; total_units: number }[]  // ✅ made optional
}

export function InventoryChart({ data }: InventoryChartProps) {

  // ✅ SAFETY: prevent undefined/null crash
  const safeData = Array.isArray(data) ? data : []

  // ✅ HANDLE EMPTY STATE (NO CRASH)
  if (safeData.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Blood Inventory by Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No inventory data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = safeData.map((item) => ({
    name: item?.blood_group || "Unknown",
    units: Number(item?.total_units || 0),
    fill: BLOOD_GROUP_COLORS[item?.blood_group] || "#6b7280",
  }))

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Blood Inventory by Group
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
              
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(217, 33%, 17%)" }}
              />

              <YAxis
                tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
                axisLine={{ stroke: "hsl(217, 33%, 17%)" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222, 47%, 9%)",
                  border: "1px solid hsl(217, 33%, 17%)",
                  borderRadius: "8px",
                  color: "hsl(210, 40%, 96%)",
                }}
              />

              <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}