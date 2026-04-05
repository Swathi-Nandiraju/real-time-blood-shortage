import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { recordBloodEvent } from "@/lib/blockchain"

export const dynamic = "force-dynamic"


// GET → fetch inventory
export async function GET() {

  try {

    const sql = getDb()

    const inventory = await sql`
      SELECT bi.*, h.name as hospital_name, h.zone as hospital_zone
      FROM blood_inventory bi
      JOIN hospitals h ON bi.hospital_id = h.id
      ORDER BY bi.units_available ASC
    `

    return NextResponse.json(inventory)

  } catch (error) {

    console.error("Inventory API error:", error)

    return NextResponse.json(
      { error: "Failed to load inventory" },
      { status: 500 }
    )
  }
}



// POST → update inventory + record blockchain event
export async function POST(request: Request) {

  try {

    const body = await request.json()

    const { hospital_id, blood_group, units } = body

    if (!hospital_id || !blood_group || units === undefined) {

      return NextResponse.json(
        { error: "hospital_id, blood_group and units are required" },
        { status: 400 }
      )
    }

    const sql = getDb()

    // Update inventory
    const result = await sql`
      UPDATE blood_inventory
      SET units_available = ${units}
      WHERE hospital_id = ${hospital_id}
      AND blood_group = ${blood_group}
      RETURNING *
    `


    // Record blockchain event
    await recordBloodEvent("INVENTORY_UPDATE", {
      hospital_id,
      blood_group,
      units
    })


    return NextResponse.json({
      message: "Inventory updated and blockchain event recorded",
      inventory: result[0]
    })

  } catch (error) {

    console.error("Inventory update error:", error)

    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    )
  }
}
