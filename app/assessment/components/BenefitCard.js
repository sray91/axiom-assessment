'use client';

import { motion } from 'framer-motion';

export default function BenefitCard({ 
  title, 
  percent, 
  amount,
  icon, 
  color = 'blue'
}) {
  // Color scheme mapping
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      iconBg: 'bg-green-100'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100'
    }
  };
  
  // Default to blue if color is not found
  const colorScheme = colors[color] || colors.blue;
  
  return (
    <motion.div 
      className={`rounded-lg ${colorScheme.bg} ${colorScheme.border} border p-4 flex items-start`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className={`mr-4 p-2 rounded-full ${colorScheme.iconBg}`}>
          <span className="text-xl">{icon}</span>
        </div>
      )}
      
      <div>
        <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
        
        <div className="flex items-baseline space-x-2">
          {percent && (
            <motion.div 
              className={`text-2xl font-bold ${colorScheme.text}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            >
              {percent}%
            </motion.div>
          )}
          
          {amount && (
            <motion.div 
              className="text-lg font-semibold text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              (${formatCurrency(amount)})
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Format number as currency (e.g. 1000 -> 1,000)
function formatCurrency(value) {
  if (!value && value !== 0) return '';
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 0
  });
} 