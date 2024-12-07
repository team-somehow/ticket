# React Hooks Guide

## Overview
Custom hooks for managing ticket purchases and user event scores in the Fan Score Protocol.

## Available Hooks

### 1. useBuyTicket
```
// Buy tickets from the secondary market
const { buyTicket, loading, error } = useBuyTicket();
// Usage
await buyTicket({
ticketId: "123",
buyerAddress: "0x..."
});
```
### 2. useUserEventScore
```
/ Get user's fan score for an event
const { getScore, loading, error } = useUserEventScore();
// Usage
const score = await getScore({
userId: "spotify_user_id",
eventId: "123"
});
```

## Common Patterns

### Loading States
```
function TicketPurchase() {
const { buyTicket, loading } = useBuyTicket();
return (
<button disabled={loading}>
{loading ? "Processing..." : "Buy Ticket"}
</button>
);
}
``` 
### Error Handling
```
function ScoreDisplay() {
const { getScore, error } = useUserEventScore();
if (error) {
return <div>Error: {error}</div>;
}
return <div>Score: {score}</div>;
}
```
