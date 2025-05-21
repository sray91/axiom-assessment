'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TechnologyPopup from './TechnologyPopup';
import { createBrowserClient } from '../../../lib/supabase';

// Mapping of technology names to emojis
const TECH_EMOJIS = {
  'Predictive Maintenance': '🔍',
  'Manufacturing Execution System (MES)': '🏭',
  'Digital Performance Management': '📊',
  'Augmented Reality Work Instructions': '👓',
  'Automated Quality Inspection': '🔎',
  'Digital Twin': '🔄',
  'Industrial IoT Platform': '📱',
  'Robotic Process Automation': '🤖',
  'Energy Management System': '⚡',
  'Cybersecurity Platform': '🛡️'
};

// Default emoji for technologies not in the mapping
const DEFAULT_EMOJI = '💻';

export default function RoadmapTimeline({ roadmap = [] }) {
  const [selectedTech, setSelectedTech] = useState(null);
  const [techDetails, setTechDetails] = useState({});
  const [loading, setLoading] = useState(false);

  // Animation variants for the timeline
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Get emoji for a technology
  const getEmoji = (tech) => TECH_EMOJIS[tech] || DEFAULT_EMOJI;

  // Fetch technology details
  const fetchTechDetails = async (techName) => {
    try {
      setLoading(true);
      const supabase = createBrowserClient();
      
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .eq('name', techName)
        .single();
        
      if (error) throw error;
      
      setTechDetails(prev => ({
        ...prev,
        [techName]: data
      }));
      
      setSelectedTech(data);
    } catch (error) {
      console.error('Error fetching technology details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle technology click
  const handleTechClick = async (tech) => {
    if (techDetails[tech]) {
      setSelectedTech(techDetails[tech]);
    } else {
      await fetchTechDetails(tech);
    }
  };

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Your Technology Roadmap</h2>
      
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {roadmap.map((phase, phaseIndex) => (
          <motion.div key={phaseIndex} variants={itemVariants} className="relative">
            {/* Timeline connector */}
            {phaseIndex < roadmap.length - 1 && (
              <div className="absolute h-full w-0.5 bg-blue-200 left-5 top-6 ml-0.5 -z-10"></div>
            )}
            
            {/* Timeframe */}
            <div className="flex mb-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {phase.timeframe}
              </div>
            </div>
            
            {/* Technologies */}
            <div className="space-y-3 ml-3">
              {phase.technologies.map((tech, techIndex) => (
                <motion.div 
                  key={techIndex}
                  className="flex items-start"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center mr-3">
                    <span role="img" aria-label={tech}>
                      {getEmoji(tech)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTechClick(tech)}
                    className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex-1 text-left hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-medium text-gray-800">{tech}</h3>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Technology Popup */}
      <TechnologyPopup
        technology={selectedTech}
        onClose={() => setSelectedTech(null)}
      />
    </div>
  );
} 