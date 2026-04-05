"use client"

import { useState } from "react"
import { useBlockchain } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Boxes,
  ShieldCheck,
  ShieldAlert,
  Hash,
  Clock,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
} from "lucide-react"
import type { BlockchainBlock, BlockTransaction } from "@/lib/types"

export default function BlockchainPage() {
  const { data, isLoading, error, mutate } = useBlockchain()
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null)
  const [mining, setMining] = useState(false)

  const handleMineBlock = async () => {
    setMining(true)
    try {
      await fetch("/api/blockchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactions: [
            {
              type: "SYSTEM_CHECK",
              message: "Periodic chain validation and integrity check",
              timestamp: Date.now(),
            },
          ],
        }),
      })
      mutate()
    } catch (err) {
      console.error("Mining failed:", err)
    }
    setMining(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">Failed to load blockchain data</p>
      </div>
    )
  }

  const { blocks, stats, validation } = data as {
    blocks: BlockchainBlock[]
    stats: { totalBlocks: number; totalTransactions: number; latestBlockHash: string; chainValid: boolean }
    validation: { isValid: boolean; errors: string[] }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Blockchain Explorer
          </h1>
          <p className="text-sm text-muted-foreground">
            HydBloodChain - Immutable blood supply chain ledger
          </p>
        </div>
        <Button
          onClick={handleMineBlock}
          disabled={mining}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {mining ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mining...
            </>
          ) : (
            <>
              <Boxes className="mr-2 h-4 w-4" />
              Mine Block
            </>
          )}
        </Button>
      </div>

      {/* Chain Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(173,58%,39%)]/10">
              <Boxes className="h-5 w-5 text-[hsl(173,58%,39%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalBlocks}</p>
              <p className="text-xs text-muted-foreground">Total Blocks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(217,91%,60%)]/10">
              <Hash className="h-5 w-5 text-[hsl(217,91%,60%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              validation.isValid ? "bg-[hsl(142,71%,45%)]/10" : "bg-[hsl(0,84%,60%)]/10"
            }`}>
              {validation.isValid ? (
                <ShieldCheck className="h-5 w-5 text-[hsl(142,71%,45%)]" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-[hsl(0,84%,60%)]" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {validation.isValid ? "Valid" : "Invalid"}
              </p>
              <p className="text-xs text-muted-foreground">Chain Integrity</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(38,92%,50%)]/10">
              <LinkIcon className="h-5 w-5 text-[hsl(38,92%,50%)]" />
            </div>
            <div>
              <p className="truncate font-mono text-xs font-bold text-foreground">
                {stats.latestBlockHash.slice(0, 16)}...
              </p>
              <p className="text-xs text-muted-foreground">Latest Hash</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation errors */}
      {!validation.isValid && validation.errors.length > 0 && (
        <Card className="border-[hsl(0,84%,60%)]/30 bg-[hsl(0,84%,60%)]/5">
          <CardContent className="p-4">
            <p className="mb-2 text-sm font-semibold text-[hsl(0,84%,60%)]">Chain Integrity Issues</p>
            {validation.errors.map((err: string, i: number) => (
              <p key={i} className="text-xs text-muted-foreground">{err}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Blocks List */}
      <div className="flex flex-col gap-3">
        {blocks.map((block: BlockchainBlock, index: number) => {
          const isExpanded = expandedBlock === block.block_index
          const txList = Array.isArray(block.transactions) ? block.transactions : []
          const blockTime = new Date(Number(block.timestamp)).toLocaleString()

          return (
            <div key={block.block_index} className="animate-slide-up">
              {index > 0 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <Card className="border-border bg-card">
                <CardHeader
                  className="cursor-pointer pb-3"
                  onClick={() => setExpandedBlock(isExpanded ? null : block.block_index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-mono text-sm font-bold text-foreground">
                        #{block.block_index}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-foreground">
                          Block {block.block_index}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {blockTime}
                          <Badge variant="outline" className="border-border text-[10px]">
                            {txList.length} tx
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="border-t border-border pt-4">
                    <div className="flex flex-col gap-3">
                      {/* Hash details */}
                      <div className="grid gap-2 rounded-lg bg-background/50 p-3 font-mono text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">Hash</span>
                          <span className="break-all text-[hsl(142,71%,45%)]">{block.hash}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">Previous Hash</span>
                          <span className="break-all text-[hsl(217,91%,60%)]">
                            {block.previous_hash}
                          </span>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <span className="text-muted-foreground">Nonce: </span>
                            <span className="text-foreground">{block.nonce}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Timestamp: </span>
                            <span className="text-foreground">{block.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Transactions */}
                      {txList.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold text-muted-foreground">
                            Transactions
                          </p>
                          <div className="flex flex-col gap-2">
                            {txList.map((tx: BlockTransaction, txIdx: number) => (
                              <div
                                key={txIdx}
                                className="rounded-lg border border-border bg-background/30 p-3"
                              >
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="border-primary/30 bg-primary/10 text-xs text-primary"
                                  >
                                    {tx.type}
                                  </Badge>
                                  {tx.blood_group && (
                                    <Badge variant="outline" className="border-border text-xs">
                                      {tx.blood_group}
                                    </Badge>
                                  )}
                                  {tx.units && (
                                    <span className="text-xs text-muted-foreground">
                                      {tx.units} units
                                    </span>
                                  )}
                                </div>
                                {tx.message && (
                                  <p className="mt-1 text-xs text-muted-foreground">{tx.message}</p>
                                )}
                                {tx.from && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    From: {tx.from} {tx.to ? `-> To: ${tx.to}` : ""}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
