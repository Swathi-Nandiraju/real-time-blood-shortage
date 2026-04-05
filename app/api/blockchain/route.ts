import { NextResponse } from "next/server"
import { getAllBlocks, getChainStats, validateChain, mineBlock } from "@/lib/blockchain"
import type { BlockTransaction } from "@/lib/types"

export const dynamic = "force-dynamic"

// GET → return blockchain data
export async function GET() {
  try {

    const [blocks, stats, validation] = await Promise.all([
      getAllBlocks(),
      getChainStats(),
      validateChain(),
    ])

    return NextResponse.json({
      blocks,
      stats,
      validation,
    })

  } catch (error) {

    console.error("Blockchain API error:", error)

    return NextResponse.json(
      { error: "Failed to load blockchain" },
      { status: 500 }
    )
  }
}


// POST → mine a new block
export async function POST() {
  try {
    const block = await mineBlock([
      {
        type: "TEST",
        hospital_id: 1,
        blood_group: "O+",
        units: 1
      }
    ])

    return Response.json({
      success: true,
      block
    })
  } catch (error) {
    console.error("MINE ERROR:", error)

    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
