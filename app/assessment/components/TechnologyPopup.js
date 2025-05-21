import { motion, AnimatePresence } from 'framer-motion';

export default function TechnologyPopup({ technology, onClose }) {
  if (!technology) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">{technology.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
              <p className="text-gray-700">{technology.description}</p>
            </div>
            
            {technology.vendor_examples && technology.vendor_examples.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Example Vendors</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {technology.vendor_examples.map((vendor, index) => (
                    <li key={index}>{vendor}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Business Impact</h4>
              <ul className="list-disc list-inside text-gray-700">
                <li>Improves operational efficiency</li>
                <li>Reduces manual work and errors</li>
                <li>Enables data-driven decision making</li>
                <li>Supports continuous improvement</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 