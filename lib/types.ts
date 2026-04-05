// ===== Database Row Types =====

export interface Hospital {
  id: number
  name: string
  zone: string
  type: "Government" | "Private" | "Specialty"
  address: string | null
  latitude: number | null
  longitude: number | null
  contact_phone: string | null
  contact_email: string | null
  bed_capacity: number
  blood_bank_license: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Donor {
  id: number
  name: string
  blood_group: BloodGroup
  zone: string
  age: number
  gender: "Male" | "Female" | "Other"
  phone: string | null
  email: string | null
  last_donation_date: string | null
  total_donations: number
  is_eligible: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BloodInventory {
  id: number
  hospital_id: number
  blood_group: BloodGroup
  units_available: number
  units_reserved: number
  last_restocked_at: string | null
  expiry_date: string | null
  updated_at: string
  // Joined fields
  hospital_name?: string
  hospital_zone?: string
}

export interface BlockchainBlock {
  id: number
  block_index: number
  timestamp: number
  previous_hash: string
  hash: string
  nonce: number
  transactions: BlockTransaction[]
  created_at: string
}

export interface BlockTransaction {
  type: string
  from?: string
  to?: string
  blood_group?: string
  units?: number
  hospital_id?: number
  donor_id?: number
  message?: string
  timestamp?: number
  metadata?: Record<string, unknown>
}

export interface ShortagePrediction {
  id: number
  hospital_id: number
  blood_group: BloodGroup
  predicted_shortage_date: string
  severity: "Low" | "Medium" | "High" | "Critical"
  confidence_score: number
  contributing_factors: ContributingFactor[]
  feature_importance: Record<string, number>
  decision_path: DecisionNode[]
  natural_language_explanation: string | null
  is_active: boolean
  blockchain_tx_hash: string | null
  created_at: string
  resolved_at: string | null
  // Joined fields
  hospital_name?: string
  hospital_zone?: string
}

export interface ContributingFactor {
  factor: string
  impact: number
}

export interface DecisionNode {
  node: string
  result: string
  threshold?: string
  confidence?: number
}

export interface DonationRequest {
  id: number
  hospital_id: number
  blood_group: BloodGroup
  units_needed: number
  urgency: "Normal" | "Urgent" | "Critical"
  status: "Open" | "Partially Fulfilled" | "Fulfilled" | "Expired"
  matched_donor_ids: number[]
  notes: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  hospital_name?: string
  hospital_zone?: string
}

export interface TransactionLog {
  id: number
  tx_type: "DONATION" | "TRANSFER" | "USAGE" | "EXPIRY" | "SHORTAGE_ALERT" | "PREDICTION"
  blood_group: BloodGroup | null
  units: number | null
  from_entity_type: string | null
  from_entity_id: number | null
  to_entity_type: string | null
  to_entity_id: number | null
  hospital_id: number | null
  donor_id: number | null
  metadata: Record<string, unknown>
  blockchain_block_index: number | null
  blockchain_tx_hash: string | null
  created_at: string
  // Joined fields
  hospital_name?: string
  donor_name?: string
}

// ===== Utility Types =====

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-"

export const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

export const SEVERITY_COLORS: Record<string, string> = {
  Critical: "#dc2626",
  High: "#ea580c",
  Medium: "#d97706",
  Low: "#16a34a",
}

export const BLOOD_GROUP_COLORS: Record<BloodGroup, string> = {
  "A+": "#ef4444",
  "A-": "#f97316",
  "B+": "#3b82f6",
  "B-": "#6366f1",
  "O+": "#22c55e",
  "O-": "#14b8a6",
  "AB+": "#a855f7",
  "AB-": "#ec4899",
}

// ===== Dashboard Stats =====

export interface DashboardStats {
  totalHospitals: number
  totalDonors: number
  totalUnitsAvailable: number
  activeShortages: number
  criticalShortages: number
  openRequests: number
  blockchainHeight: number
  inventoryByGroup: { blood_group: BloodGroup; total_units: number }[]
  recentTransactions: TransactionLog[]
  activePredictions: ShortagePrediction[]
}
