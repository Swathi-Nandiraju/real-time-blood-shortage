"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowRight } from "lucide-react"
import type { ShortagePrediction } from "@/lib/types"

interface ShortageAlertsProps {
  predictions: ShortagePrediction[]
}

const severityStyles: Record<string, string> = {
  Critical: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)] border-[hsl(0,84%,60%)]/30",
  High: "bg-[hsl(24,95%,53%)]/15 text-[hsl(24,95%,53%)] border-[hsl(24,95%,53%)]/30",
  Medium: "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]/30",
  Low: "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)] border-[hsl(142,71%,45%)]/30",
}

export function ShortageAlerts({ predictions }: ShortageAlertsProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <AlertTriangle className="h-4 w-4 text-[hsl(38,92%,50%)]" />
          Active Shortage Predictions
        </CardTitle>
        <Link
          href="/xai"
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {predictions.slice(0, 5).map((pred) => (
            <Link
              key={pred.id}
              href={`/xai?id=${pred.id}`}
              className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3 transition-colors hover:bg-accent"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {pred.hospital_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pred.blood_group} - {new Date(pred.predicted_shortage_date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={severityStyles[pred.severity]}>
                  {pred.severity}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {Math.round(pred.confidence_score * 100)}%
                </span>
              </div>
            </Link>
          ))}
          {predictions.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No active shortage predictions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
