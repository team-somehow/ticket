# Getting Started

## What is Fan Score Protocol?
A system that fairly distributes event tickets based on how big of a fan someone is. It:
- Calculates fan scores using Spotify data
- Records scores using blockchain attestations
- Distributes tickets based on fan scores
- Enables secure ticket trading

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
Install Node.js 18+
nvm install 18
nvm use 18
Clone and install
git clone https://github.com/team-somehow/ticket
cd fan-score-protocol
npm install
```

### 2. Set Up Environment
Create `.env` in the root directory:
```bash
TRUE_NETWORK_SECRET_KEY=your_key
FIREBASE_API_KEY=your_key
VITE_WC_PROJECT_ID=your_key
```

### 3. Start Development

```bash
Start frontend
cd frontend
npm run dev
In a new terminal, start Firebase
cd web3-interactions
firebase emulators:start
```
## Core Features

### 1. Fan Score Calculation

```typescript
// Calculate score based on:
Top artist ranking
Tracks in playlists
Following status
Genre overlap
```
### 2. Ticket Distribution
```typescript
// Automatic distribution based on:
Fan score threshold
Stake amount
Time of application
```

### 3. Secondary Market
```typescript
// Secure ticket trading with:
Score verification
Automated transfers
Price limits
```


## Next Steps
1. Read the [API Documentation](/api/attestation)
2. Try the [Score Generation](/components/score-generation) component
3. Set up [Firebase](/api/firebase)

## Need Help?
- Check common issues in Troubleshooting
- Join our Discord community
- Open a GitHub issue

That's it! You're ready to start building with Fan Score Protocol. 🎉