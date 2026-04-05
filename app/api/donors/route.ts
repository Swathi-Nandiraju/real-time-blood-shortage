import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"



// =======================
// ✅ GET DONORS
// =======================
export async function GET(request: Request) {
  try {
    const sql = getDb()
    const { searchParams } = new URL(request.url)

    const bloodGroup = searchParams.get("blood_group")
    const zone = searchParams.get("zone")
    const location = searchParams.get("location")

    let donors

    if (bloodGroup && zone && location) {
      donors = await sql`
        SELECT * FROM donors
        WHERE is_active = true
        AND blood_group = ${bloodGroup}
        AND zone = ${zone}
        AND location ILIKE ${"%" + location + "%"}
        ORDER BY name
      `
    } 
    else if (bloodGroup && zone) {
      donors = await sql`
        SELECT * FROM donors
        WHERE is_active = true
        AND blood_group = ${bloodGroup}
        AND zone = ${zone}
        ORDER BY name
      `
    } 
    else if (bloodGroup) {
      donors = await sql`
        SELECT * FROM donors
        WHERE is_active = true
        AND blood_group = ${bloodGroup}
        ORDER BY name
      `
    } 
    else if (zone) {
      donors = await sql`
        SELECT * FROM donors
        WHERE is_active = true
        AND zone = ${zone}
        ORDER BY name
      `
    } 
    else if (location) {
      donors = await sql`
        SELECT * FROM donors
        WHERE is_active = true
        AND location ILIKE ${"%" + location + "%"}
        ORDER BY name
      `
    } 
    else {
      donors = await sql`
        SELECT * FROM donors
        WHERE is_active = true
        ORDER BY name
      `
    }

    return NextResponse.json(donors)

  } catch (error) {
    console.error("Donors GET API error:", error)
    return NextResponse.json(
      { error: "Failed to load donors" },
      { status: 500 }
    )
  }
}



// =======================
// ✅ POST DONOR
// =======================
export async function POST(request: Request) {
  try {
    const sql = getDb()
    const body = await request.json()

    const result = await sql`
      INSERT INTO donors 
      (name, age, gender, email, phone, location, zone, blood_group, health_issues, is_active, is_eligible)
      VALUES (
        ${body.name},
        ${body.age},
        ${body.gender},
        ${body.email},
        ${body.phone},
        ${body.location},
        ${body.zone || body.location},
        ${body.blood_group},
        ${body.health_issues || ""},
        true,
        true
      )
      RETURNING *
    `

    return NextResponse.json(result[0])

  } catch (err) {
    console.error("POST ERROR:", err)
    return Response.json(
      { error: "Insert failed" },
      { status: 500 }
    )
  }
}