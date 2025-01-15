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
    <div className="relative mb-8 px-4 w-full">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"> {/* Added overflow hidden */}
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {numSteps > 1 && ( // Only render markers if there's more than one step
        <div className="flex items-center justify-between absolute top-0 left-0 right-0 -mt-2 w-full">
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;