# 🩸 Blockchain-Based Intelligent Blood Donation and Supply Chain Management System

An intelligent healthcare management platform integrating Full-Stack Web Development, Blockchain Technology, and Explainable AI (XAI) to manage blood inventory, assess potential shortages, and maintain transparent transaction records.

---

## 📌 Project Overview

Blood supply management is a critical challenge in healthcare due to unpredictable demand, limited blood availability, and coordination difficulties between hospitals and blood banks.

This project aims to address these challenges through a centralized web-based blood donation and supply chain management system.

The application enables hospitals, donors, and administrators to manage blood inventory, track blood requests, assess shortage risks, and monitor blockchain-based transaction records.

It combines rule-based shortage risk assessment, cryptographic hashing, and explainable decision-support mechanisms to improve transparency and support informed blood inventory management.

---

## 🎯 Key Features

- **Dashboard Management:** Displays blood inventory statistics, shortage alerts, and recent activities.
- **Donor Management:** Maintains donor information, blood groups, eligibility status, and donation records.
- **Hospital Management:** Manages hospital information and associated blood inventory.
- **Blood Inventory Management:** Tracks blood availability across different blood groups.
- **Blood Request Management:** Supports hospital blood requests and request tracking.
- **Shortage Risk Assessment:** Evaluates potential shortages using inventory levels, donor availability, blood group rarity, and usage patterns.
- **Blockchain Integration:** Uses SHA-256 hashing and a proof-of-work mechanism to maintain transaction integrity and traceability.
- **Explainable AI (XAI):** Provides feature importance analysis, decision paths, and counterfactual explanations for shortage risk assessments.
- **Data Visualization:** Presents inventory statistics, risk assessments, and transaction information through interactive dashboards.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Next.js 14 |
| Programming Language | TypeScript |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL |
| Database Provider | Neon |
| API Communication | REST APIs |
| Blockchain | SHA-256, Proof of Work |
| Data Visualization | Recharts |
| UI Components | Radix UI |
| Styling | Tailwind CSS |
| Data Fetching | SWR |

---

## 🏗️ System Architecture

The following architecture illustrates the interaction between users, frontend, backend, database, blockchain, and the shortage risk assessment and XAI modules

### Architecture Components

1. **Users Layer:** Includes hospitals, blood banks, donors, and administrators.
2. **Frontend Layer:** Provides dashboard, inventory management, blood request, blockchain, and XAI interfaces.
3. **Backend Layer:** Handles inventory management, request processing, shortage risk assessment, and blockchain hashing through REST APIs.
4. **Data Storage Layer:** Uses PostgreSQL to store blood inventory, donor records, hospital information, and request logs.
5. **Blockchain Layer:** Maintains hash-linked blocks, timestamps, and transaction records.
6. **Shortage Risk Assessment and XAI Module:** Calculates shortage risk scores and generates explanations based on contributing factors.
7. **Output and Visualization Layer:** Displays blood availability, shortage alerts, risk assessment results, and XAI explanations.

---

## ⚙️ Working Methodology

The system follows these major steps:

1. Collect blood inventory, donor, hospital, and transaction information.
2. Store and manage the information using PostgreSQL.
3. Analyze current inventory levels, eligible donor availability, recent usage, and blood group rarity.
4. Calculate shortage risk scores using predefined rules and thresholds.
5. Classify shortage risks into Low, Medium, High, and Critical categories.
6. Generate feature importance and decision-path explanations.
7. Record blockchain transactions using SHA-256 hashing and proof of work.
8. Display inventory information, risk assessments, and transaction records through interactive dashboards.

---

## 🔗 Blockchain Implementation

The project implements a hash-based blockchain mechanism for transaction tracking and data integrity.

### Key Functionalities

- SHA-256 cryptographic hash generation.
- Genesis block creation.
- Previous block hash linking.
- Nonce generation.
- Proof-of-work mechanism.
- Block mining.
- Blockchain integrity validation.
- Transaction history and audit tracking.

Each block contains transaction information, a timestamp, a nonce, and the hash of the previous block.

This implementation demonstrates the application of blockchain principles for maintaining traceable blood supply chain transactions.

---

## 🤖 Shortage Risk Assessment and Explainable AI (XAI)

The shortage risk assessment module evaluates potential blood shortages using multiple parameters.

### Risk Assessment Parameters

| Parameter | Purpose |
|---|---|
| Current Inventory | Evaluates available blood units |
| Donor Availability | Considers the number of eligible donors |
| Monthly Usage | Evaluates recent blood consumption |
| Blood Group Rarity | Considers the relative scarcity of blood groups |

The system calculates a combined risk score and categorizes the shortage risk into four levels:

- Low
- Medium
- High
- Critical

### Explainable AI Features

The XAI module provides:

- **Feature Importance Analysis:** Identifies the factors contributing to the shortage risk score.
- **Decision Path Visualization:** Displays the steps involved in reaching a risk assessment.
- **Counterfactual Explanations:** Illustrates how changes in contributing factors could influence the assessed risk.
- **Natural Language Explanations:** Presents understandable explanations of the assessment results.

**Implementation Note:** The current implementation uses rule-based risk calculations and an XAI-inspired explanation mechanism. It does not use a trained machine learning forecasting model or actual SHAP/LIME library integration.

---

## 🗄️ Database Design

The application uses PostgreSQL through Neon for database management.

The database maintains information related to:

- Hospitals
- Donors
- Blood Inventory
- Donation Requests
- Shortage Predictions
- Blockchain Blocks
- Transaction Logs

Database schema and sample seed data are available in the `scripts/` directory.

---

## 📁 Project Structure

```text
real-time-blood-shortage/
│
├── app/
│   ├── api/
│   │   ├── blockchain/
│   │   ├── dashboard/
│   │   ├── donors/
│   │   ├── emergency/
│   │   ├── hospitals/
│   │   ├── inventory/
│   │   ├── predictions/
│   │   └── requests/
│   │
│   ├── blockchain/
│   ├── donors/
│   ├── hospitals/
│   ├── login/
│   ├── requests/
│   ├── xai/
│   ├── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── dashboard/
│   └── ui/
│
├── hooks/
│
├── lib/
│   ├── blockchain.ts
│   ├── db.ts
│   ├── hooks.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── xai-engine.ts
│   └── xai-engine-client.ts
│
├── scripts/
│   ├── 001-create-tables.sql
│   └── 002-seed-data.sql
│
├── styles/
│
├── .gitignore
├── package.json
├── package-lock.json
├── next.config.mjs
└── README.md
```

---

## 💻 Installation and Setup

### Prerequisites

- Node.js
- npm
- Git
- PostgreSQL database (Neon recommended)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Swathi-Nandiraju/real-time-blood-shortage.git
```

### Step 2: Navigate to the Project Directory

```bash
cd real-time-blood-shortage
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env.local` file in the project root directory.

Add your Neon PostgreSQL connection string:

```env
DATABASE_URL=your_neon_database_connection_string
```

### Step 5: Configure the Database

Execute the database schema provided in:

```text
scripts/001-create-tables.sql
```

The sample data script is available at:

```text
scripts/002-seed-data.sql
```

Review the seed script before execution because it truncates existing project tables and inserts sample records. Do not run it against a database containing important data.

### Step 6: Start the Development Server

```bash
npm run dev
```

### Step 7: Open the Application

Visit:

```text
http://localhost:3000
```

---

## 📸 Application Screenshots

### 1. Dashboard
![Dashboard](<Dashboard.png>)

### 2. Blood Inventory Management
![Blood Inventory](<Inventory.png>)

### 3. Donor Management
![Donor Network](<Donor Network.png>)

### 4. Blood Request Management
![Blood Requests](<Blood Requests.png>)

### 5. Blockchain Transaction Records
![Blockchain](<Blockchain.png>)

### 6. Shortage Risk Assessment and XAI
![Explainable AI](<Explainable AI.png>)

## 🏗️ System Architecture

![System Architecture](<SystemArchitecture.png>)




---

## 🎥 Project Demonstration

Watch the project demonstration to understand the application's major functionalities, workflow, and implementation.

**[▶ Watch Project Execution Video](https://drive.google.com/file/d/1Y75D3uN5WvxuAIbao5QvzzZ3aCfCAeOT/view?usp=drive_link)**

---

## 🚀 Future Enhancements

- Integration with real-time hospital and blood bank databases.
- Development of trained machine learning models for blood demand forecasting.
- Enhanced donor-hospital coordination.
- Improved authentication and authorization.
- Advanced notification mechanisms.
- Integration with additional healthcare institutions.

---

## 👩‍💻 Contributors

- **Swathi Nandiraju**
- **Lalitha Varma**

---

## ⚠️ Disclaimer

This project is an academic prototype developed for educational and demonstration purposes. It uses sample healthcare data and should not be considered a production-ready medical decision-making system.
