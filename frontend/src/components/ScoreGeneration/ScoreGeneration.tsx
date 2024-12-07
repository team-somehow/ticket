import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

type ScoreGenerationProps = {
  eventId: string;
};

export default function ScoreGeneration({ eventId }: ScoreGenerationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    "Connecting to Spotify",
    "Fetching data related to the artist",
    "Fetching number of playlists related to the artists",
    "Calculating total watchtime for the artist",
    "Calculating score for event",
  ];

  useEffect(() => {
    const stepInterval = 5000;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount += 1;
      if (stepCount <= steps.length - 1) {
        setCurrentStep(stepCount);
        if (stepCount === steps.length - 1) {
          // Trigger confetti and redirect after the last step
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Add a small delay before redirect to show the final step and confetti
          setTimeout(() => {
            navigate(`/my-events/${eventId}`);
          }, 1500);
        }
      }
    }, stepInterval);

    return () => clearInterval(interval);
  }, [eventId, navigate]);

  const loadingGifUrl = "https://i.gifer.com/ZZ5H.gif";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neo-black/60 z-50 p-4">
      <div
        className="relative bg-neo-white w-full max-w-md sm:max-w-lg rounded-lg border-neo border-neo-black shadow-neo-xl p-6 sm:p-8"
        style={{ minHeight: '420px' }}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Title Section */}
          <div className="flex items-center justify-center h-20 sm:h-24 mb-8 sm:mb-10 mt-1">
            <h2
              className="font-neo-display text-neo-black text-center flex items-center justify-center gap-3"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: '700',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                lineHeight: '1.2',
              }}
            >
              Generating Score
            </h2>
          </div>

          {/* Stepper */}
          <div className="relative space-y-6 sm:space-y-8">
            {steps.map((step, index) => {
              const isDone = index <= currentStep;
              const isCurrent = index === currentStep;

              return (
                <div key={index} className="flex items-start relative">
                  {/* Step Circle and Vertical Line */}
                  <div className="flex flex-col items-center mr-5 sm:mr-7">
                    <div
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full border-neo border-neo-black flex items-center justify-center text-base sm:text-lg font-bold
                        ${isDone ? 'bg-green-500 text-neo-white' : isCurrent ? 'bg-neo-primary text-neo-black' : 'bg-neo-white text-neo-black'}
                      `}
                    >
                      {isDone ? '✓' : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 w-px bg-neo-black" />
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="font-neo text-base sm:text-lg flex items-center gap-4">
                    <span
                      className={`${
                        isDone
                          ? 'text-green-600 font-bold'
                          : isCurrent
                          ? 'font-bold text-neo-black'
                          : 'text-neo-black/70'
                      }`}
                    >
                      {step}
                    </span>
                    {isCurrent && index < steps.length - 1 && (
                      <img
                        src={loadingGifUrl}
                        alt="Loading"
                        className="w-6 h-6 sm:w-7 sm:h-7"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}