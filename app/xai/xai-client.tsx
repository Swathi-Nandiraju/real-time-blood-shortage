"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { usePredictions, usePrediction } from "@/lib/hooks"
import { computeWaterfallData, buildDecisionTree, computeCounterfactuals } from "@/lib/xai-engine-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Loader2,
  Brain,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  TreeDeciduous,
  BarChart3,
  MessageSquareText,
  Lightbulb,
} from "lucide-react"
import type { ShortagePrediction, ContributingFactor, DecisionNode } from "@/lib/types"

const severityStyles: Record<string, string> = {
  Critical: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)] border-[hsl(0,84%,60%)]/30",
  High: "bg-[hsl(24,95%,53%)]/15 text-[hsl(24,95%,53%)] border-[hsl(24,95%,53%)]/30",
  Medium: "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]/30",
  Low: "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)] border-[hsl(142,71%,45%)]/30",
}

const severityBarColors: Record<string, string> = {
  Critical: "#dc2626",

  High: "#ea580c",
  Medium: "#d97706",
  Low: "#16a34a",
}

export default function XaiClient() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id")
  const [selectedId, setSelectedId] = useState<number | null>(
    initialId ? Number(initialId) : null
  )
  const { data: predictions, isLoading } = usePredictions()
  const { data: selectedPrediction, isLoading: detailLoading } = usePrediction(selectedId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Detail view
  if (selectedId && selectedPrediction) {
    return (
      <PredictionDetail
        prediction={selectedPrediction}
        isLoading={detailLoading}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  // List view
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          XAI Shortage Predictions
        </h1>
        <p className="text-sm text-muted-foreground">
          Transparent, explainable AI predictions with full decision audit trails
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {(predictions as ShortagePrediction[])?.map((pred) => (
          <Card
            key={pred.id}
            className="cursor-pointer border-border bg-card transition-colors hover:bg-accent"
            onClick={() => setSelectedId(pred.id)}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{pred.hospital_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pred.blood_group} shortage predicted by{" "}
                    {new Date(pred.predicted_shortage_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Badge variant="outline" className={severityStyles[pred.severity]}>
                    {pred.severity}
                  </Badge>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {Math.round(pred.confidence_score * 100)}% confidence
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PredictionDetail({
  prediction,
  isLoading,
  onBack,
}: {
  prediction: ShortagePrediction
  isLoading: boolean
  onBack: () => void
}) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const waterfallData = computeWaterfallData(prediction.feature_importance || {})
  const decisionTree = buildDecisionTree(prediction.decision_path ||[])
  const counterfactuals = computeCounterfactuals({
    ...prediction,
    contributing_factors : prediction.contributing_factors || []
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back button + Header */}
      <div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Predictions
        </Button>
        <div className="flex items-center gap-3">
          <AlertTriangle
            className="h-6 w-6"
            style={{ color: severityBarColors[prediction.severity] }}
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {prediction.hospital_name} - {prediction.blood_group} Shortage
            </h1>
            <p className="text-sm text-muted-foreground">
              Predicted by {new Date(prediction.predicted_shortage_date).toLocaleDateString()} |{" "}
              {prediction.hospital_zone} Zone
            </p>
          </div>
          <Badge variant="outline" className={`ml-auto ${severityStyles[prediction.severity]}`}>
            {prediction.severity} - {Math.round(prediction.confidence_score * 100)}% Confidence
          </Badge>
        </div>
      </div>

      {/* Natural Language Explanation */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquareText className="h-4 w-4 text-[hsl(217,91%,60%)]" />
            AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-sm text-muted-foreground">
            {prediction.natural_language_explanation}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Feature Importance - SHAP Waterfall */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BarChart3 className="h-4 w-4 text-[hsl(38,92%,50%)]" />
              Feature Importance (SHAP-like Waterfall)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={waterfallData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, bottom: 5, left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(217, 33%, 17%)" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
                    tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }}
                    axisLine={{ stroke: "hsl(217, 33%, 17%)" }}
                    width={95}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(222, 47%, 9%)",
                      border: "1px solid hsl(217, 33%, 17%)",
                      borderRadius: "8px",
                      color: "hsl(210, 40%, 96%)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Impact"]}
                  />
                  <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                    {(waterfallData || []).map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#dc2626"
                            : index === 1
                            ? "#ea580c"
                            : index === 2
                            ? "#d97706"
                            : "#3b82f6"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contributing Factors */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-[hsl(0,72%,51%)]" />
              Contributing Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {(prediction.contributing_factors || []).map(
                (factor: ContributingFactor, index: number) => (
                  <div key={index} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{factor.factor}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {Math.round(factor.impact * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${factor.impact * 100}%`,
                          backgroundColor:
                            factor.impact >= 0.3
                              ? "#dc2626"
                              : factor.impact >= 0.2
                              ? "#ea580c"
                              : "#3b82f6",
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Tree Path */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <TreeDeciduous className="h-4 w-4 text-[hsl(142,71%,45%)]" />
            Decision Path (Audit Trail)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-0">
            {(decisionTree || []).map(
              (
                node: {
                  step: number
                  question: string
                  answer: string
                  threshold: string
                  isLeaf: boolean
                  confidence?: number
                },
                index: number
              ) => (
                <div key={index} className="flex gap-4">
                  {/* Vertical line connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        node.isLeaf
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {node.step}
                    </div>
                    {!node.isLeaf && (
                      <div className="h-full w-px bg-border" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <p className="text-sm font-medium text-foreground">{node.question}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Result: <span className="text-foreground">{node.answer}</span>
                    </p>
                    {node.threshold !== "N/A" && (
                      <p className="text-xs text-muted-foreground">
                        Threshold: {node.threshold}
                      </p>
                    )}
                    {node.confidence !== undefined && (
                      <Badge
                        variant="outline"
                        className="mt-1 border-primary/30 bg-primary/10 text-xs text-primary"
                      >
                        Confidence: {Math.round(node.confidence * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Counterfactual Explanations */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="h-4 w-4 text-[hsl(38,92%,50%)]" />
            Counterfactual Analysis - What Could Change the Outcome?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {(counterfactuals || []).map(
              (cf: { change: string; effect: string }, index: number) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-background/50 p-3"
                >
                  <p className="text-sm text-foreground">{cf.change}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[hsl(142,71%,45%)]">
                    <ChevronRight className="h-3 w-3" />
                    {cf.effect}
                  </p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Reference */}
      {prediction.blockchain_tx_hash && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
          <span className="text-xs text-muted-foreground">Blockchain TX:</span>
          <span className="font-mono text-xs text-[hsl(173,58%,39%)]">
            {prediction.blockchain_tx_hash}
          </span>
        </div>
      )}
    </div>
  )
}
