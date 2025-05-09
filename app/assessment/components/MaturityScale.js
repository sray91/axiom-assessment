'use client';

export default function MaturityScale({ 
  id, 
  title, 
  description, 
  value = 0, 
  onChange 
}) {
  const ratings = [
    { value: 1, label: 'Initial', description: 'No capability' },
    { value: 2, label: 'Managed', description: 'Basic capability' },
    { value: 3, label: 'Defined', description: 'Standard capability' },
    { value: 4, label: 'Measured', description: 'Advanced capability' },
    { value: 5, label: 'Optimized', description: 'World class' }
  ];

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(id, parseInt(newValue));
    }
  };

  return (
    <div className="py-3 border-b border-gray-200 last:border-0">
      <div className="mb-2">
        <h3 className="text-base font-medium text-gray-800">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        {ratings.map((rating) => (
          <div key={rating.value} className="flex flex-col items-center">
            <label className="group cursor-pointer flex flex-col items-center">
              <input
                type="radio"
                name={`maturity-${id}`}
                value={rating.value}
                checked={value === rating.value}
                onChange={(e) => handleChange(e.target.value)}
                className="sr-only"
              />
              <div 
                className={`
                  w-5 h-5 mb-1 rounded-full border-2 flex items-center justify-center
                  ${value === rating.value 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300 group-hover:border-blue-300'}
                `}
              >
                {value === rating.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700">{rating.label}</span>
              <span className="text-xs text-gray-500 text-center hidden sm:block">{rating.description}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
} 