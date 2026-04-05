"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, Heart, Syringe, AlertTriangle, Brain, Clock } from "lucide-react"
import type { TransactionLog } from "@/lib/types"

interface RecentActivityProps {
  transactions: TransactionLog[]
}

const txIcons: Record<string, typeof Heart> = {
  DONATION: Heart,
  TRANSFER: ArrowRightLeft,
  USAGE: Syringe,
  SHORTAGE_ALERT: AlertTriangle,
  PREDICTION: Brain,
  EXPIRY: Clock,
}

const txColors: Record<string, string> = {
  DONATION: "text-[hsl(142,71%,45%)]",
  TRANSFER: "text-[hsl(217,91%,60%)]",
  USAGE: "text-[hsl(38,92%,50%)]",
  SHORTAGE_ALERT: "text-[hsl(0,84%,60%)]",
  PREDICTION: "text-[hsl(280,65%,60%)]",
  EXPIRY: "text-muted-foreground",
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Recent Blockchain Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {transactions.map((tx) => {
            const Icon = txIcons[tx.tx_type] || Clock
            const color = txColors[tx.tx_type] || "text-muted-foreground"
            return (
              <div
                key={tx.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-3"
              >
                <div className={`mt-0.5 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {tx.tx_type.replace("_", " ")}
                    </span>
                    {tx.blood_group && (
                      <Badge variant="outline" className="border-border text-xs">
                        {tx.blood_group}
                      </Badge>
                    )}
                    {tx.units && tx.units > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {tx.units} unit{tx.units > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {tx.hospital_name || "System"}
                    {tx.donor_name ? ` - ${tx.donor_name}` : ""}
                  </p>
                </div>
                {tx.blockchain_tx_hash && (
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {tx.blockchain_tx_hash.slice(0, 10)}...
                  </span>
                )}
              </div>
            )
          })}
          {transactions.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No recent activity
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
