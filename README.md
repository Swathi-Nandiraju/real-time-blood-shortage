# Blockchain-Based Intelligent Blood Donation and Supply Chain Management System

An intelligent healthcare management platform that integrates Machine Learning, Blockchain Technology, and Explainable AI (XAI) to monitor blood inventory, predict potential shortages, and improve transparency across the blood supply chain.

## Overview

Blood supply management is a critical challenge in healthcare due to unpredictable demand, limited blood storage life, and coordination difficulties between hospitals and blood banks.

This project proposes an intelligent blood donation and supply chain management system that combines predictive analytics, blockchain-based transaction tracking, and explainable AI to support proactive blood shortage management.

The platform provides a centralized interface for hospitals, blood banks, donors, and administrators to manage blood-related activities and monitor supply conditions.

## Key Features

- **Blood Inventory Management:** Monitor available blood units and manage inventory records.
- **Blood Request Management:** Allow hospitals to submit and manage blood requests.
- **Donor Management:** Maintain donor information and donation records.
- **Shortage Prediction:** Analyze historical demand patterns and current inventory levels to identify potential blood shortages.
- **Blockchain-Based Security:** Generate cryptographic hashes for important transactions to maintain data integrity and traceability.
- **Explainable AI (XAI):** Provide insights into the factors influencing shortage predictions.
- **Dashboard and Visualization:** Display blood availability, transaction records, prediction results, and shortage alerts.
- **Notification System:** Highlight critical inventory conditions and potential shortages.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Next.js |
| Backend | Node.js |
| API Communication | REST APIs |
| Prediction Module | Machine Learning and predictive analytics |
| Blockchain | Hash-based blockchain model |
| Explainable AI | SHAP and LIME |
| Deployment | Vercel |

*Note: The technologies listed above are based on the project implementation documentation. Update this section if the actual implementation uses additional frameworks or libraries.*

## System Architecture

The application follows a modular architecture consisting of the following layers:

1. **Frontend Layer:** Provides interfaces for hospitals, blood banks, donors, and administrators.
2. **Backend Layer:** Handles authentication, inventory management, request processing, and API communication.
3. **Data Storage Layer:** Maintains donor records, hospital information, inventory details, and request logs.
4. **Blockchain Layer:** Maintains transaction hashes and timestamps to support data integrity and traceability.
5. **Prediction and XAI Layer:** Analyzes blood demand and inventory patterns to identify shortage risks and explain prediction results.
6. **Visualization Layer:** Displays inventory information, prediction results, transaction records, and alerts.

## Working Methodology

The system follows these major steps:

1. Collect blood inventory, donor, hospital, and transaction data.
2. Preprocess the collected data by handling missing values, duplicates, and inconsistencies.
3. Analyze historical demand patterns and current blood inventory.
4. Generate shortage predictions using the prediction module.
5. Record important transactions through a hash-based blockchain mechanism.
6. Generate explanations for prediction results using XAI techniques.
7. Display the results through dashboards and notification mechanisms.

## Dataset

The project uses simulated healthcare data to represent blood bank operations in a controlled prototype environment.

The dataset includes:

- Blood inventory records
- Blood request transactions
- Donor information
- Hospital information
- Blockchain transaction logs

Simulated data is used instead of actual patient or healthcare records.

## Project Structure

```text
real-time-blood-shortage/
│
├── app/
├── components/
├── hooks/
├── lib/
├── scripts/
├── styles/
│
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── package-lock.json
├── .gitignore
│
└── README.md
```

*The structure above represents the visible repository structure. Update it if additional directories or files are present.*

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Git

### Steps

1. Clone the repository:

```bash
git clone https://github.com/Swathi-Nandiraju/real-time-blood-shortage.git
```

2. Navigate to the project directory:

```bash
cd real-time-blood-shortage
```

3. Install dependencies:

```bash
npm install
```

4. Configure the required environment variables using the provided `.env.example` file, if applicable.

5. Start the development server:

```bash
npm run dev
```

6. Open the application in your browser:

```text
http://localhost:3000
```

*The setup instructions should be verified against the actual project configuration before publication.*

## Project Objectives

- Improve blood inventory monitoring.
- Identify potential blood shortages earlier.
- Maintain secure and traceable blood-related transactions.
- Improve transparency in prediction results.
- Support coordination between hospitals, blood banks, and donors.

## Future Enhancements

- Integration with real-time hospital and blood bank databases.
- Improved predictive models using larger healthcare datasets.
- Integration with additional healthcare institutions.
- Enhanced notification and emergency response mechanisms.
- Scalability and performance improvements.

## Contributors

- **Swathi Nandiraju**
- **Lalitha Varma**

## Disclaimer

This project is an academic prototype developed for educational and demonstration purposes. It uses simulated healthcare data and should not be considered a production-ready medical decision-making system.
