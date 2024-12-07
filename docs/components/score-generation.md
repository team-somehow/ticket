# Score Generation Component

## Overview
The Score Generation component provides a visual interface for calculating and displaying fan scores, with a step-by-step progress indicator.

## Props Interface
```typescript
interface ScoreGenerationProps {
eventId: string; // ID of the event for score calculation
}
```

## Component Structure
```tsx

export default function ScoreGeneration({ eventId }: ScoreGenerationProps) {
return (
<div className="fixed inset-0 flex items-center justify-center bg-neo-black/60 z-50 p-4">
<div className="relative bg-neo-white w-full max-w-md rounded-lg border-neo p-6">
{/ Title Section /}
<div className="flex items-center justify-center h-20 mb-8">
<h2 className="font-neo-display text-neo-black">
Generating Score
</h2>
</div>
{/ Stepper Section /}
<div className="relative space-y-6">
{steps.map((step, index) => (
<StepIndicator
key={index}
step={step}
isActive={currentStep === index}
isCompleted={currentStep > index}
/>
))}
</div>
</div>
</div>
);
}
```

## Score Generation Steps

```typescript
const steps = [
{
title: "Spotify Data",
description: "Analyzing your Spotify listening history"
},
{
title: "Calculate Score",
description: "Computing your fan score"
},
{
title: "Attestation",
description: "Recording score on True Network"
}
];
```
## Usage Example

```tsx
function EventPage() {
return (
<div>
<h1>Event Details</h1>
<ScoreGeneration eventId="123" />
</div>
);
}
```

## Styling
The component uses Tailwind CSS with custom neo-brutalist design tokens:
- `bg-neo-white`: Background color
- `text-neo-black`: Text color
- `border-neo`: Border style
- `font-neo-display`: Custom font family

## Animation States
- Loading: Spinning animation for active step
- Completed: Checkmark animation for finished steps
- Error: Red highlight for failed steps

## Best Practices
1. Always provide a valid `eventId`
2. Handle loading and error states appropriately
3. Ensure proper z-index for modal overlay
4. Include accessible ARIA labels