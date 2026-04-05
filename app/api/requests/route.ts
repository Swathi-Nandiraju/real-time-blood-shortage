import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getDb()
    const requests = await sql`
      SELECT dr.*, h.name as hospital_name, h.zone as hospital_zone
      FROM donation_requests dr
      JOIN hospitals h ON dr.hospital_id = h.id
      ORDER BY 
        CASE dr.urgency WHEN 'Critical' THEN 1 WHEN 'Urgent' THEN 2 WHEN 'Normal' THEN 3 END,
        dr.created_at DESC
    `
    return NextResponse.json(requests)
  } catch (error) {
    console.error("Requests API error:", error)
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const sql = getDb()
    const body = await request.json()
    const { hospital_id, blood_group, units_needed, urgency, notes } = body

    if (!hospital_id || !blood_group || !units_needed || !urgency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const expiresIn = urgency === "Critical" ? "24 hours" : urgency === "Urgent" ? "48 hours" : "7 days"

    const rows = await sql`
      INSERT INTO donation_requests (hospital_id, blood_group, units_needed, urgency, status, notes, expires_at)
      VALUES (${hospital_id}, ${blood_group}, ${units_needed}, ${urgency}, 'Open', ${notes || null}, NOW() + ${expiresIn}::interval)
      RETURNING *
    `

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Create request error:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
