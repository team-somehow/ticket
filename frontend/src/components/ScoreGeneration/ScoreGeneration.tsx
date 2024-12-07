import React, { useState, useEffect } from 'react';

type ScoreGenerationProps = {
  finalScore: number;
  onClose: () => void; // A callback prop to close the dialog
};

export default function ScoreGeneration({ finalScore, onClose }: ScoreGenerationProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Connecting to Spotify",
    "Fetching data related to your Artists",
    "Generating Score",
    "Score Generated",
  ];

  useEffect(() => {
    const stepInterval = 2500; // Move to the next step every 2.5 seconds
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount += 1;
      if (stepCount <= 3) {
        setCurrentStep(stepCount);
      } else {
        clearInterval(interval);
      }
    }, stepInterval);

    return () => clearInterval(interval);
  }, []);

  const loadingGifUrl = "https://i.gifer.com/ZZ5H.gif"; // Replace with your desired loading GIF URL

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neo-black/60 z-50 p-4">
      <div
        className="relative bg-neo-white w-full max-w-md sm:max-w-lg rounded-lg border-neo border-neo-black shadow-neo-xl p-6 sm:p-8"
        style={{ minHeight: '420px' }} // Adjust min height for additional spacing
      >
        <div className="flex flex-col justify-between h-full">
          {/* Title Section */}
          <div className="flex items-center justify-center h-20 sm:h-24 mb-8 sm:mb-10 mt-1">
            <h2
              className="font-neo-display text-neo-black text-center flex items-center justify-center gap-3"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', // Balanced range for font size
                fontWeight: '700', // Bold for emphasis
                letterSpacing: '0.05em', // Slight spacing for clarity
                textTransform: 'uppercase', // Uppercase for a clean title style
                lineHeight: '1.2', // Adjusted line-height for better readability
              }}
            >
              {steps[currentStep]}
              {/* {currentStep < steps.length - 1 && (
                <img
                  src={loadingGifUrl}
                  alt="Loading"
                  className="w-6 h-6 sm:w-7 sm:h-7"
                />
              )} */}
            </h2>
          </div>

          {/* Stepper */}
          <div className="relative space-y-6 sm:space-y-8">
            {steps.map((step, index) => {
              const isDone = index <= currentStep; // Include the final step
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

          {/* Final Step */}
          {currentStep === steps.length - 1 && (
            <div className="mt-8 sm:mt-10 text-center">
              <p className="text-2xl sm:text-3xl font-neo-display text-neo-black mb-6 sm:mb-8">
                Your Score: <span className="text-green-600">{finalScore}</span>
              </p>
              <button
                onClick={onClose}
                className="w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-neo text-neo-white bg-green-500 rounded-lg shadow-neo hover:bg-green-600 hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}