import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getDb()

    const hospitals = await sql`
      SELECT h.*, 
        (SELECT json_agg(json_build_object(
          'blood_group', bi.blood_group,
          'units_available', bi.units_available,
          'units_reserved', bi.units_reserved,
          'expiry_date', bi.expiry_date
        )) 
        FROM blood_inventory bi 
        WHERE bi.hospital_id = h.id 
        AND bi.expiry_date >= CURRENT_DATE
        ) as inventory
      FROM hospitals h 
      WHERE h.is_active = true 
      ORDER BY h.name
    `

    return NextResponse.json(hospitals)

  } catch (error) {
    console.error("Hospitals API error:", error)

    return NextResponse.json(
      { error: "Failed to load hospitals" },
      { status: 500 }
    )
  }
}
