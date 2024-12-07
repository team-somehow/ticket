# Installation Guide

## Quick Install (3 steps)

### 1. Basic Setup
```bash
git clone https://github.com/team-somehow/ticket
cd fan-score-protocol
Install dependencies
npm install
```


### 2. Environment Setup
Create these `.env` files:
```bash
frontend/.env
VITE_WC_PROJECT_ID=your_wallet_connect_id
VITE_FIREBASE_API_KEY=your_firebase_key
web3-interactions/.env
PRIVATE_KEY=your_ethereum_key
attestation/.env
TRUE_NETWORK_SECRET_KEY=your_true_network_key
```

### 3. Start Development
```bash
Start frontend
cd frontend
npm run dev
Start Firebase (new terminal)
cd web3-interactions
firebase emulators:start
```

## Contract Addresses

```
Base Sepolia: 0x99C8CA6842C20F5428c8C17e6c79634e8dA539D8
BNB Chain: 0x714Cfb36Af2FDDB6558775966bB2F42377dB2927
```

## Verify Installation

### 1. Frontend

```bash
Should show:
✓ Frontend running at http://localhost:5178
```


### 2. Firebase
```bash
Should show:
✓ Functions running at http://localhost:5001
✓ Firestore running at http://localhost:8080
```
### 3. Network Connection
```bash
Should connect to:
✓ Base Sepolia testnet
✓ True Network testnet
```
## Common Issues

### Frontend Issues
```bash
Module not found
npm install
or
npm install --force
```

### Firebase Issues
```bash
Permission denied
firebase login
or
npm install -g firebase-tools
```
