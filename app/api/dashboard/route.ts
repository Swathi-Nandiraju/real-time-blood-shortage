import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getChainStats } from "@/lib/blockchain"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sql = getDb()

    const [
      hospitalCount,
      donorCount,
      inventoryTotal,
      activeShortages,
      criticalShortages,
      openRequests,
      inventoryByGroup,
      recentTransactions,
      activePredictions,
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM hospitals WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM donors WHERE is_active = true`,
      sql`SELECT COALESCE(SUM(units_available), 0) as total FROM blood_inventory`,
      sql`SELECT COUNT(*) as count FROM shortage_predictions WHERE is_active = true`,
      sql`SELECT COUNT(*) as count FROM shortage_predictions WHERE is_active = true AND severity = 'Critical'`,
      sql`SELECT COUNT(*) as count FROM donation_requests WHERE status = 'Open'`,
      sql`SELECT blood_group, SUM(units_available) as total_units FROM blood_inventory GROUP BY blood_group ORDER BY blood_group`,
      sql`SELECT tl.*, h.name as hospital_name, d.name as donor_name 
          FROM transactions_log tl 
          LEFT JOIN hospitals h ON tl.hospital_id = h.id 
          LEFT JOIN donors d ON tl.donor_id = d.id 
          ORDER BY tl.created_at DESC LIMIT 10`,
      sql`SELECT sp.*, h.name as hospital_name, h.zone as hospital_zone 
          FROM shortage_predictions sp 
          JOIN hospitals h ON sp.hospital_id = h.id 
          WHERE sp.is_active = true 
          ORDER BY CASE sp.severity 
            WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 
            WHEN 'Medium' THEN 3 WHEN 'Low' THEN 4 END,
          sp.confidence_score DESC`,
    ])

    const chainStats = await getChainStats()

    return NextResponse.json({
      totalHospitals: Number(hospitalCount[0].count),
      totalDonors: Number(donorCount[0].count),
      totalUnitsAvailable: Number(inventoryTotal[0].total),
      activeShortages: Number(activeShortages[0].count),
      criticalShortages: Number(criticalShortages[0].count),
      openRequests: Number(openRequests[0].count),
      blockchainHeight: chainStats.totalBlocks,
      chainValid: chainStats.chainValid,
      inventoryByGroup,
      recentTransactions,
      activePredictions,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 })
  }
}
