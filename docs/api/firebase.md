# Firebase Integration

## Overview
The project uses Firebase for backend services, including Cloud Functions, Firestore, and Authentication.

## Configuration
```typescript
// frontend/src/lib/firebase.config.ts
const firebaseConfig = {
apiKey: process.env.FIREBASE_API_KEY,
authDomain: process.env.FIREBASE_AUTH_DOMAIN,
projectId: process.env.FIREBASE_PROJECT_ID,
storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
appId: process.env.FIREBASE_APP_ID
};
```
## Cloud Functions

### Fan Score Calculation
```typescript
// web3-interactions/src/index.ts
export const setUserScores = onRequest(async (request, response) => {
if (request.method !== "POST") {
response.status(405).send({ message: "Method not allowed" });
return;
}
try {
const contract = new ethers.Contract(
CONTRACT_ADDRESS,
TicketProtocolImplementation.abi,
wallet
);
const tx = await contract.setFanScores(
[userAddress],
[score]
);
response.status(200).send({
message: "Fan scores updated successfully",
transactionHash: tx.hash,
});
} catch (error) {
response.status(500).send({ message: "Something went wrong", error });
}
});



## Firestore Schema

### User Applied Events

```typescript

interface UserAppliedEvent {
eventId: string;
isListed: boolean;
userId: string;
userWalletAddress: string;
status: 'applied' | 'approved' | 'rejected';
score: number;
artist_name: string;
}
```

## Usage Examples

### Reading Data
```typescript
const ticketRef = doc(db, "user_applied_events", ticketId);
const ticketDoc = await getDoc(ticketRef);
```

### Writing Data

```typescript
const eventUserRef = collection(db, "user_applied_events");
await addDoc(eventUserRef, {
eventId,
isListed: false,
userId: spotifyUserId,
userWalletAddress: address,
status: "applied",
score: fanScore,
artist_name: artistName
});
```


This provides a concise overview of the Firebase integration. Would you like me to expand on any particular section?