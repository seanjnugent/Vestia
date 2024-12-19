import React from "react";

const ProgressTracker = ({ currentStep, steps }) => {
  const numSteps = steps.length;

  if (numSteps === 0) {
    return null;
  }

  const currentStepBounded = Math.max(1, Math.min(currentStep, numSteps));
  const progress =
    numSteps > 1
      ? ((currentStepBounded - 1) / (numSteps - 1)) * 100
      : currentStepBounded === 1
      ? 100
      : 0;

  return (
    <div className="relative mb-8 px-4">
      <div className="w-full h-2 bg-gray-300 rounded-full">
        <div
          className="h-2 bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between absolute top-0 left-0 right-0 -mt-6 w-full">

      </div>
    </div>
  );
};

export default ProgressTracker;
