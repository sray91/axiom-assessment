'use client';

export default function ProgressTracker({ currentStep, totalSteps, titles }) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index < currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                    : 'bg-gray-200 text-gray-600'}`
              }
            >
              {index + 1}
            </div>
            
            {index < totalSteps - 1 && (
              <div 
                className={`h-1 w-24 sm:w-32 md:w-40 lg:w-52 mx-1
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`
                }
              ></div>
            )}
          </div>
        ))}
      </div>
      
      {titles && (
        <div className="flex items-center justify-between mt-1 px-1">
          {titles.map((title, index) => (
            <div 
              key={index} 
              className={`text-xs sm:text-sm font-medium text-center w-24 sm:w-32 md:w-40 lg:w-52
                ${index === currentStep ? 'text-blue-600' : 'text-gray-500'}`
              }
            >
              {title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 