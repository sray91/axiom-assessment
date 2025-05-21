'use client';

import { useState } from 'react';

export default function FinancialInputs({ value = {}, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value: inputValue } = e.target;
    const numericValue = inputValue ? parseFloat(inputValue) : '';
    
    if (onChange) {
      onChange({
        ...value,
        [name]: numericValue
      });
    }
  };

  const handleUnitChange = (e) => {
    const { value: newUnit } = e.target;
    if (onChange) {
      onChange({
        ...value,
        time_unit: newUnit
      });
    }
  };

  const getUnitLabel = () => {
    switch (value.time_unit) {
      case 'days':
        return 'days';
      case 'shifts':
        return 'shifts';
      default:
        return 'hrs';
    }
  };
  
  return (
    <div className="my-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-base font-medium text-gray-800">Financial Information (Optional)</h3>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          aria-expanded={isExpanded}
        >
          <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Adding financial data will allow us to calculate monetary benefits and ROI.
            All information is kept confidential.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Unit
                </label>
                <select
                  name="time_unit"
                  value={value.time_unit || 'hrs'}
                  onChange={handleUnitChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="hrs">Hours</option>
                  <option value="shifts">Shifts</option>
                  <option value="days">Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Production {value.time_unit === 'shifts' ? 'Shifts' : value.time_unit === 'days' ? 'Days' : 'Hours'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="production_hours"
                    value={value.production_hours || ''}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getUnitLabel()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Unplanned Downtime
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="downtime_hours"
                    value={value.downtime_hours || ''}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{getUnitLabel()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost per Downtime {value.time_unit === 'shifts' ? 'Shift' : value.time_unit === 'days' ? 'Day' : 'Hour'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="downtime_cost_per_hour"
                    value={value.downtime_cost_per_hour || ''}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Scrap Cost
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="scrap_cost"
                    value={value.scrap_cost || ''}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Energy Spend
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="energy_spend"
                    value={value.energy_spend || ''}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 