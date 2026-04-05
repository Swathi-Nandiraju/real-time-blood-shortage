"use client"

import { useState } from "react"
import { useDonors } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Phone, Mail, MapPin } from "lucide-react"
import { BLOOD_GROUPS, BLOOD_GROUP_COLORS } from "@/lib/types"
import type { Donor, BloodGroup } from "@/lib/types"

const ZONES = [
  "All Zones","Kukatpally","Gachibowli","Tolichowki","Secunderabad","Ameerpet",
  "Old City","Miyapur","LB Nagar","Begumpet","Madhapur","Kondapur",
  "Dilsukhnagar","ECIL","Mehdipatnam","Uppal","Manikonda","Alwal",
  "Banjara Hills","Malkajgiri","Attapur",
]

export default function DonorsPage() {
  const [bloodFilter, setBloodFilter] = useState<string>("")
  const [zoneFilter, setZoneFilter] = useState<string>("")
  const [showForm, setShowForm] = useState(false)

  const { data: donors, isLoading, error } = useDonors(
    bloodFilter || undefined,
    zoneFilter || undefined
  )

  // ✅ FIXED HANDLE SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    const data = {
      name: formData.get("name"),
      age: Number(formData.get("age")),
      gender: formData.get("gender"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      zone: formData.get("location"), // ✅ FIX
      blood_group: formData.get("blood_group"),
      health_issues: formData.get("health_issues"),
    }

    // ✅ Age validation
    if (data.age < 18) {
      alert("Donor must be 18+")
      return
    }

    // ✅ SMART health check
    const risky = ["diabetes", "bp", "heart", "asthma"]

    const hasRisk = risky.some(r =>
      String(data.health_issues).toLowerCase().includes(r)
    )

    if (hasRisk) {
      alert("Health risk detected")
      return
    }

    await fetch("/api/donors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    alert("Donor Registered Successfully!")

    setShowForm(false)

    // ✅ refresh
    window.location.reload()
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Failed to load donors</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Donor Network</h1>
        <p className="text-sm text-muted-foreground">
          Registered blood donors across Hyderabad zones
        </p>

        <div className="flex gap-3 mt-3">
          <Button onClick={() => setShowForm(true)} className="bg-red-500 text-white">
            Register Donor
          </Button>

          <Button
            onClick={async () => {
              await fetch("/api/emergency", { method: "POST" })
              alert("🚨 Emergency Alert Sent!")
            }}
            className="bg-red-600 text-white"
          >
            🚨 Emergency
          </Button>
        </div>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-card p-4 rounded border">
          <form onSubmit={handleSubmit} className="space-y-3">

            <input name="name" placeholder="Full Name" required
              className="w-full p-2 border rounded text-black placeholder-gray-500" />

            <input name="age" type="number" placeholder="Age" required
              className="w-full p-2 border rounded text-black placeholder-gray-500" />

            <select name="gender" required
              className="w-full p-2 border rounded text-black">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input name="email" type="email" placeholder="Email" required
              className="w-full p-2 border rounded text-black placeholder-gray-500" />

            <input name="phone" placeholder="Phone" required
              className="w-full p-2 border rounded text-black placeholder-gray-500" />

            <input name="location" placeholder="Location" required
              className="w-full p-2 border rounded text-black placeholder-gray-500" />

            <select name="blood_group" required
              className="w-full p-2 border rounded text-black">
              <option value="">Blood Group</option>
              {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
            </select>

            <textarea name="health_issues" placeholder="Health Issues"
              className="w-full p-2 border rounded text-black placeholder-gray-500" />

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-500 text-white">Submit</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>

          </form>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={bloodFilter} onValueChange={(v) => setBloodFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Blood Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {BLOOD_GROUPS.map((bg) => (
              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={zoneFilter} onValueChange={(v) => setZoneFilter(v === "All Zones" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            {ZONES.map((zone) => (
              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="ml-auto text-xs text-muted-foreground">
          {isLoading ? "Loading..." : `${(donors as Donor[])?.length || 0} donors`}
        </span>
      </div>

      {/* DONORS */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(donors as Donor[])?.map((donor) => (
            <Card key={donor.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{donor.name}</CardTitle>
                  <Badge
                    style={{
                      color: BLOOD_GROUP_COLORS[donor.blood_group as BloodGroup],
                    }}
                  >
                    {donor.blood_group}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="text-sm space-y-1">
                <p>{donor.age} yrs • {donor.gender}</p>
                <p className="flex items-center gap-1"><Phone size={12}/> {donor.phone}</p>
                <p className="flex items-center gap-1"><Mail size={12}/> {donor.email}</p>
                <p className="flex items-center gap-1"><MapPin size={12}/> {donor.zone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* HOSPITALS */}
      <div>
        <h2 className="text-lg font-semibold">Nearby Hospitals & Blood Banks</h2>
        <div className="grid md:grid-cols-2 gap-3 mt-2">
          {["Apollo Hospital","Red Cross Blood Bank","Yashoda Hospital"].map((h,i)=>(
            <Card key={i}>
              <CardContent className="p-3">{h}</CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}