// Client-side XAI utility functions (no database calls)
import type { ShortagePrediction, ContributingFactor, DecisionNode } from "./types"

// Format feature names for display
function formatFeatureName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// XAI Feature importance - SHAP-like waterfall data
export function computeWaterfallData(featureImportance?: Record<string, number>) {

  // Prevent crash if featureImportance is null/undefined
  if (!featureImportance) return []

  const entries = Object.entries(featureImportance).sort((a, b) => b[1] - a[1])

  let cumulative = 0

  return entries.map(([feature, importance]) => {

    const start = cumulative
    cumulative += importance

    return {
      feature: formatFeatureName(feature),
      importance: +(importance * 100).toFixed(1),
      start: +(start * 100).toFixed(1),
      end: +(cumulative * 100).toFixed(1),
    }

  })
}

// Generate a human-readable decision tree visualization structure
export function buildDecisionTree(decisionPath?: DecisionNode[]) {

  if (!decisionPath) return []

  return decisionPath.map((node, index) => ({
    step: index + 1,
    question: node.node,
    answer: node.result,
    threshold: node.threshold || "N/A",
    isLeaf: index === decisionPath.length - 1,
    confidence: node.confidence,
  }))

}

// Compute counterfactual explanations
export function computeCounterfactuals(
  prediction: ShortagePrediction
): { change: string; effect: string }[] {

  const counterfactuals: { change: string; effect: string }[] = []

  const factors = prediction.contributing_factors || []

  factors.forEach((factor: ContributingFactor) => {

    if (factor.impact >= 0.25) {

      counterfactuals.push({
        change: `If "${factor.factor}" impact decreased by 50%`,
        effect: `Severity could drop from ${prediction.severity} to ${
          prediction.severity === "Critical"
            ? "High"
            : prediction.severity === "High"
            ? "Medium"
            : "Low"
        }`,
      })

    }

  })

  const unitsNeeded =
    prediction.severity === "Critical"
      ? 10
      : prediction.severity === "High"
      ? 7
      : 4

  counterfactuals.push({
    change: `If ${unitsNeeded} units of ${prediction.blood_group} were donated today`,
    effect: `Predicted shortage would be delayed by approximately ${Math.ceil(
      unitsNeeded * 1.5
    )} days`,
  })

  return counterfactuals
}
