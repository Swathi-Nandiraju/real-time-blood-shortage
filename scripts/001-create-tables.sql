-- Hyderabad Blood Supply Chain - Database Schema

-- Hospitals table - Real Hyderabad hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  zone VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Government', 'Private', 'Specialty')),
  address TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  bed_capacity INTEGER DEFAULT 0,
  blood_bank_license VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  zone VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 65),
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
  phone VARCHAR(20),
  email VARCHAR(255),
  last_donation_date DATE,
  total_donations INTEGER DEFAULT 0,
  is_eligible BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blood inventory per hospital per blood group
CREATE TABLE IF NOT EXISTS blood_inventory (
  id SERIAL PRIMARY KEY,
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group VARCHAR(5) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  units_available INTEGER DEFAULT 0 CHECK (units_available >= 0),
  units_reserved INTEGER DEFAULT 0 CHECK (units_reserved >= 0),
  last_restocked_at TIMESTAMP,
  expiry_date DATE,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(hospital_id, blood_group)
);

-- Blockchain blocks - persisted chain
CREATE TABLE IF NOT EXISTS blockchain_blocks (
  id SERIAL PRIMARY KEY,
  block_index INTEGER NOT NULL UNIQUE,
  timestamp BIGINT NOT NULL,
  previous_hash VARCHAR(64) NOT NULL,
  hash VARCHAR(64) NOT NULL,
  nonce INTEGER NOT NULL,
  transactions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shortage predictions with XAI explanations
CREATE TABLE IF NOT EXISTS shortage_predictions (
  id SERIAL PRIMARY KEY,
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group VARCHAR(5) NOT NULL,
  predicted_shortage_date DATE,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  confidence_score DECIMAL(5, 4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  contributing_factors JSONB NOT NULL DEFAULT '[]',
  feature_importance JSONB NOT NULL DEFAULT '{}',
  decision_path JSONB NOT NULL DEFAULT '[]',
  natural_language_explanation TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  blockchain_tx_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

-- Donation requests
CREATE TABLE IF NOT EXISTS donation_requests (
  id SERIAL PRIMARY KEY,
  hospital_id INTEGER NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group VARCHAR(5) NOT NULL,
  units_needed INTEGER NOT NULL CHECK (units_needed > 0),
  urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('Normal', 'Urgent', 'Critical')),
  status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Partially Fulfilled', 'Fulfilled', 'Expired')),
  matched_donor_ids JSONB DEFAULT '[]',
  notes TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transaction log for all blood supply chain events
CREATE TABLE IF NOT EXISTS transactions_log (
  id SERIAL PRIMARY KEY,
  tx_type VARCHAR(30) NOT NULL CHECK (tx_type IN ('DONATION', 'TRANSFER', 'USAGE', 'EXPIRY', 'SHORTAGE_ALERT', 'PREDICTION')),
  blood_group VARCHAR(5),
  units INTEGER,
  from_entity_type VARCHAR(20),
  from_entity_id INTEGER,
  to_entity_type VARCHAR(20),
  to_entity_id INTEGER,
  hospital_id INTEGER REFERENCES hospitals(id),
  donor_id INTEGER REFERENCES donors(id),
  metadata JSONB DEFAULT '{}',
  blockchain_block_index INTEGER,
  blockchain_tx_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blood_inventory_hospital ON blood_inventory(hospital_id);
CREATE INDEX IF NOT EXISTS idx_blood_inventory_group ON blood_inventory(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_zone ON donors(zone);
CREATE INDEX IF NOT EXISTS idx_shortage_predictions_active ON shortage_predictions(is_active);
CREATE INDEX IF NOT EXISTS idx_donation_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_transactions_log_type ON transactions_log(tx_type);
CREATE INDEX IF NOT EXISTS idx_blockchain_blocks_index ON blockchain_blocks(block_index);



DELETE FROM shortage_predictions;