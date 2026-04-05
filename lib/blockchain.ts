import { getDb } from "./db"
import type { BlockTransaction, BlockchainBlock } from "./types"

// =============================
// SHA-256 HASH
// =============================
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// =============================
// CALCULATE HASH
// =============================
async function calculateBlockHash(
  index: number,
  timestamp: number,
  previousHash: string,
  transactions: BlockTransaction[],
  nonce: number
): Promise<string> {

  const stableTransactions = JSON.stringify(
  transactions,
  Object.keys(transactions[0] || {}).sort()
)
const data =
  index +
  "-" +
  timestamp +
  "-" +
  previousHash +
  "-" +
  stableTransactions +
  "-" +
  nonce
  return sha256(data.toString())
}

// =============================
// PROOF OF WORK
// =============================
async function proofOfWork(
  index: number,
  timestamp: number,
  previousHash: string,
  transactions: BlockTransaction[],
  difficulty: number = 2
): Promise<{ hash: string; nonce: number }> {

  let nonce = 0
  const prefix = "0".repeat(difficulty)

  let hash = await calculateBlockHash(
    index,
    timestamp,
    previousHash,
    transactions,
    nonce
  )

  while (!hash.startsWith(prefix)) {
    nonce++

    hash = await calculateBlockHash(
      index,
      timestamp,
      previousHash,
      transactions,
      nonce
    )

    if (nonce > 100000) {
      throw new Error("Mining failed:difficulty too high or bug")
    }
  }

  return { hash, nonce }
}

// =============================
// ENSURE GENESIS BLOCK
// =============================
async function ensureGenesisBlock() {

  const sql = getDb()

  const rows = await sql`
    SELECT * FROM blockchain_blocks
    ORDER BY block_index ASC
    LIMIT 1
  `

  if (rows.length === 0) {

    const timestamp = Date.now()

    const transactions = [
      {
        type: "GENESIS",
        message: "Hyderabad Blood Supply Chain Genesis Block",
        timestamp
      }
    ]

    const previousHash =
      "0000000000000000000000000000000000000000000000000000000000000000"

    const nonce = 0

    const hash = await calculateBlockHash(
      0,
      timestamp,
      previousHash,
      transactions as any,
      nonce
    )

    await sql`
      INSERT INTO blockchain_blocks
      (block_index, timestamp, previous_hash, hash, nonce, transactions)
      VALUES (
        0,
        ${timestamp},
        ${previousHash},
        ${hash},
        ${nonce},
        ${JSON.stringify(transactions)}  -- ✅ FIXED (no stringify)
      )
    `
  }
}

// =============================
// GET LATEST BLOCK
// =============================
export async function getLatestBlock(): Promise<BlockchainBlock | null> {

  const sql = getDb()

  const rows = await sql`
    SELECT * FROM blockchain_blocks
    ORDER BY block_index DESC
    LIMIT 1
  `

  if (rows.length === 0) return null

  return rows[0] as unknown as BlockchainBlock
}

// =============================
// GET ALL BLOCKS
// =============================
export async function getAllBlocks(): Promise<BlockchainBlock[]> {

  const sql = getDb()

  const rows = await sql`
    SELECT * FROM blockchain_blocks
    ORDER BY block_index DESC
  `

  return rows as unknown as BlockchainBlock[]
}

// =============================
// MINE BLOCK
// =============================
export async function mineBlock(
  transactions: BlockTransaction[]
): Promise<BlockchainBlock> {

  const sql = getDb()

  // Ensure genesis exists
  await ensureGenesisBlock()

  const latestBlock = await getLatestBlock()

  const newIndex = latestBlock ? latestBlock.block_index + 1 : 1

  const previousHash = latestBlock
    ? latestBlock.hash
    : "0000000000000000000000000000000000000000000000000000000000000000"

  const timestamp = Date.now()

  const cleanedTransactions: BlockTransaction[] = transactions.map((tx) => ({
    type: tx.type,
    hospital_id: tx.hospital_id,
    blood_group: tx.blood_group,
    units: tx.units,
    timestamp
  }))

  const { hash, nonce } = await proofOfWork(
    newIndex,
    timestamp,
    previousHash,
    cleanedTransactions
  )
  console.log("MINED BLOCK:", {
  index: newIndex,
  previousHash,
  hash,
  nonce
})

  const rows = await sql`
    INSERT INTO blockchain_blocks
    (block_index, timestamp, previous_hash, hash, nonce, transactions)
    VALUES (
      ${newIndex},
      ${timestamp},
      ${previousHash},
      ${hash},
      ${nonce},
      ${JSON.stringify(cleanedTransactions)}   -- ✅ FIXED
    )
    RETURNING *
  `

  return rows[0] as unknown as BlockchainBlock
}

// =============================
// VALIDATE CHAIN
// =============================
export async function validateChain(): Promise<{
  isValid: boolean
  errors: string[]
}> {

  const sql = getDb()

  const blocks = await sql`
    SELECT * FROM blockchain_blocks
    ORDER BY block_index ASC
  `

  const errors: string[] = []

  for (let i = 1; i < blocks.length; i++) {

    const currentBlock = blocks[i]
    const previousBlock = blocks[i - 1]

    // Check linkage
    if (currentBlock.previous_hash !== previousBlock.hash) {
      errors.push(`Block ${currentBlock.block_index}: previous hash mismatch`)
    }

    // 🔥 FIX: handle JSON properly
    const transactions =
      typeof currentBlock.transactions === "string"
        ? JSON.parse(currentBlock.transactions)
        : currentBlock.transactions

    const recalculatedHash = await calculateBlockHash(
      currentBlock.block_index as number,
      Number(currentBlock.timestamp),
      currentBlock.previous_hash as string,
      transactions,
      currentBlock.nonce as number
    )

    if (recalculatedHash !== currentBlock.hash) {
      errors.push(`Block ${currentBlock.block_index}: hash integrity failed`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// =============================
// RECORD EVENT
// =============================
export async function recordBloodEvent(
  eventType: string,
  details: Omit<BlockTransaction, "type">
): Promise<BlockchainBlock> {

  const transaction: BlockTransaction = {
    type: eventType,
    ...details
  }

  return mineBlock([transaction])
}

// =============================
// CHAIN STATS
// =============================
export async function getChainStats() {

  const sql = getDb()

  const countResult = await sql`
    SELECT COUNT(*) as count FROM blockchain_blocks
  `

  const txResult = await sql`
    SELECT COALESCE(
      SUM(jsonb_array_length(transactions)),
      0
    ) as count
    FROM blockchain_blocks
  `

  const latest = await getLatestBlock()
  const validation = await validateChain()

  return {
    totalBlocks: Number(countResult[0].count),
    totalTransactions: Number(txResult[0].count),
    latestBlockHash: latest?.hash || "N/A",
    chainValid: validation.isValid
  }
}