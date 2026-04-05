"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useDashboard() {
  return useSWR("/api/dashboard", fetcher, { refreshInterval: 30000 })
}

export function useHospitals() {
  return useSWR("/api/hospitals", fetcher, { refreshInterval: 60000 })
}

export function useDonors(bloodGroup?: string, zone?: string) {
  const params = new URLSearchParams()
  if (bloodGroup) params.set("blood_group", bloodGroup)
  if (zone) params.set("zone", zone)
  const query = params.toString()
  return useSWR(`/api/donors${query ? `?${query}` : ""}`, fetcher, { refreshInterval: 60000 })
}

export function useBlockchain() {
  return useSWR("/api/blockchain", fetcher, { refreshInterval: 15000 })
}

export function usePredictions() {
  return useSWR("/api/predictions", fetcher, { refreshInterval: 30000 })
}

export function usePrediction(id: number | null) {
  return useSWR(id ? `/api/predictions?id=${id}` : null, fetcher)
}

export function useDonationRequests() {
  return useSWR("/api/requests", fetcher, { refreshInterval: 30000 })
}

export function useInventory() {
  return useSWR("/api/inventory", fetcher, { refreshInterval: 30000 })
}
