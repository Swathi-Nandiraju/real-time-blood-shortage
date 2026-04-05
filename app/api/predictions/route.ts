import { NextResponse } from "next/server"
import {
  getActivePredictions,
  getPredictionById,
  runPredictionAnalysis,
  generatePredictions,
} from "@/lib/xai-engine"
import type { BloodGroup } from "@/lib/types"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // ✅ If specific prediction requested → DON'T regenerate
    if (id) {
      const prediction = await getPredictionById(Number(id))

      if (!prediction) {
        return NextResponse.json(
          { error: "Prediction not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(prediction)
    }

    // ✅ ONLY here generate predictions
    await generatePredictions()

    const predictions = await getActivePredictions()

    return NextResponse.json(predictions)

  } catch (error) {
    console.error("Predictions API error:", error)

    return NextResponse.json(
      { error: "Failed to load predictions" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { hospitalId, bloodGroup } = body as {
      hospitalId: number
      bloodGroup: BloodGroup
    }

    if (!hospitalId || !bloodGroup) {
      return NextResponse.json(
        { error: "hospitalId and bloodGroup required" },
        { status: 400 }
      )
    }

    const prediction = await runPredictionAnalysis(
      hospitalId,
      bloodGroup
    )

    return NextResponse.json(prediction)

  } catch (error) {
    console.error("Run prediction error:", error)

    return NextResponse.json(
      { error: "Failed to run prediction" },
      { status: 500 }
    )
  }
}