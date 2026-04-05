"use client"

import { useState } from "react"
import { useDonationRequests, useHospitals } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Loader2,
  HeartHandshake,
  Building2,
  Clock,
  Plus,
  Droplets,
  AlertCircle,
} from "lucide-react"
import { BLOOD_GROUPS, BLOOD_GROUP_COLORS } from "@/lib/types"
import type { DonationRequest, BloodGroup } from "@/lib/types"

const urgencyStyles: Record<string, string> = {
  Critical: "bg-[hsl(0,84%,60%)]/15 text-[hsl(0,84%,60%)] border-[hsl(0,84%,60%)]/30",
  Urgent: "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]/30",
  Normal: "bg-[hsl(217,91%,60%)]/15 text-[hsl(217,91%,60%)] border-[hsl(217,91%,60%)]/30",
}

const statusStyles: Record<string, string> = {
  Open: "bg-[hsl(142,71%,45%)]/15 text-[hsl(142,71%,45%)] border-[hsl(142,71%,45%)]/30",
  "Partially Fulfilled":
    "bg-[hsl(38,92%,50%)]/15 text-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]/30",
  Fulfilled: "bg-[hsl(215,20%,55%)]/15 text-[hsl(215,20%,55%)] border-[hsl(215,20%,55%)]/30",
}

export default function RequestsPage() {
  const { data: requests, isLoading, error, mutate } = useDonationRequests()
  const { data: hospitals } = useHospitals()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    hospital_id: "",
    blood_group: "",
    units_needed: "",
    urgency: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospital_id: Number(formData.hospital_id),
          blood_group: formData.blood_group,
          units_needed: Number(formData.units_needed),
          urgency: formData.urgency,
          notes: formData.notes || null,
        }),
      })
      mutate()
      setIsDialogOpen(false)
      setFormData({ hospital_id: "", blood_group: "", units_needed: "", urgency: "", notes: "" })
    } catch (err) {
      console.error("Failed to create request:", err)
    }
    setSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Failed to load requests</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Blood Requests</h1>
          <p className="text-sm text-muted-foreground">
            Active donation requests from Hyderabad hospitals
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>

          <DialogContent className="border-border bg-card text-foreground">
            <DialogHeader>
              <DialogTitle>Create Blood Request</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label>Hospital</Label>
                <Select
                  value={formData.hospital_id}
                  onValueChange={(v) => setFormData((p) => ({ ...p, hospital_id: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {(hospitals as any[])?.map((h) => (
                      <SelectItem key={h.id} value={String(h.id)}>
                        {h.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Blood Group</Label>
                  <Select
                    value={formData.blood_group}
                    onValueChange={(v) => setFormData((p) => ({ ...p, blood_group: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Units Needed</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.units_needed}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, units_needed: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Urgency</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(v) => setFormData((p) => ({ ...p, urgency: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                />
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Request"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* REQUESTS LIST */}
      <div className="flex flex-col gap-4">
        {(requests as DonationRequest[])?.map((req) => (
          <Card key={req.id} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Droplets
                    className="h-6 w-6"
                    style={{
                      color: BLOOD_GROUP_COLORS[req.blood_group as BloodGroup],
                    }}
                  />

                  <div>
                    <h3 className="text-sm font-semibold">
                      {req.blood_group} - {req.units_needed} Units
                    </h3>

                    <div className="flex gap-2 mt-1">
                      <Badge className={urgencyStyles[req.urgency]}>
                        {req.urgency}
                      </Badge>
                      <Badge className={statusStyles[req.status]}>
                        {req.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      {req.hospital_name} - {req.hospital_zone}
                    </p>
                  </div>
                </div>

                {/* ✅ FIXED STATUS DISPLAY */}
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <Clock className="h-3 w-3" />
                  Active
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}