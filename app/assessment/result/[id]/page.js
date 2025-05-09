'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import RoadmapTimeline from '../../components/RoadmapTimeline';
import BenefitCard from '../../components/BenefitCard';
import { createBrowserClient } from '../../../../lib/supabase';
import Image from 'next/image';

export default function ResultPage() {
  const params = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchAssessment() {
      try {
        setLoading(true);
        const supabase = createBrowserClient();
        
        if (!supabase) {
          throw new Error('Failed to initialize Supabase client');
        }
        
        const { data, error } = await supabase
          .from('assessments')
          .select('*, organizations(*)')
          .eq('id', params.id)
          .single();
        
        if (error) throw error;
        if (!data) throw new Error('Assessment not found');
        
        setAssessment(data);
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchAssessment();
    }
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 h-screen flex justify-center items-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading your assessment results...</p>
        </div>
      </div>
    );
  }
  
  if (error || !assessment) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-8 h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-medium mb-2">Error Loading Results</h2>
            <p>{error || 'Assessment not found'}</p>
          </div>
          <a href="/assessment" className="text-blue-600 hover:underline">
            Return to Assessment
          </a>
        </div>
      </div>
    );
  }
  
  // Extract results data
  const { results } = assessment;
  const { roadmap, headlineBenefits, paybackMonths, assumptions } = results || {};
  
  // Check if we have monetary benefit calculations
  const hasMonetaryBenefits = headlineBenefits && 
    (headlineBenefits.downtime_savings_annual ||
     headlineBenefits.scrap_savings_annual ||
     headlineBenefits.energy_savings_annual);
  
  // Calculate total annual savings
  const totalAnnualSavings = hasMonetaryBenefits 
    ? headlineBenefits.total_annual_savings
    : null;
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <Image 
            src="/axiom-logo.png" 
            alt="Axiom Logo" 
            width={200} 
            height={60}
            className="mb-4"
            priority
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Smart Manufacturing Roadmap
          </h1>
          <p className="text-gray-600">
            Personalized recommendations based on your assessment
          </p>
        </div>
      </motion.div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <BenefitCard
          title="Downtime Reduction"
          percent={headlineBenefits?.downtime_reduction || headlineBenefits?.downtime_reduction_pct}
          amount={headlineBenefits?.downtime_savings_annual}
          icon="🔍"
          color="blue"
        />
        
        <BenefitCard
          title="Scrap Reduction"
          percent={headlineBenefits?.scrap_reduction || headlineBenefits?.scrap_reduction_pct}
          amount={headlineBenefits?.scrap_savings_annual}
          icon="✅"
          color="green"
        />
        
        <BenefitCard
          title="Energy Savings"
          percent={headlineBenefits?.energy_savings || headlineBenefits?.energy_savings_pct}
          amount={headlineBenefits?.energy_savings_annual}
          icon="⚡"
          color="amber"
        />
      </div>
      
      {/* ROI Summary */}
      {hasMonetaryBenefits && (
        <motion.div 
          className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">ROI Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Annual Savings</h3>
              <p className="text-3xl font-bold text-blue-600">${totalAnnualSavings?.toLocaleString()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Payback Period</h3>
              <p className="text-3xl font-bold text-blue-600">{paybackMonths} months</p>
            </div>
          </div>
          
          {assumptions && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Assumptions</h3>
              <p className="text-sm text-gray-600">{assumptions}</p>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Technology Roadmap */}
      <motion.div 
        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <RoadmapTimeline roadmap={roadmap} />
      </motion.div>
      
      {/* Action Buttons */}
      <div className="flex justify-center mt-8 space-x-4">
        <button 
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          Print Report
        </button>
        
        <a 
          href="/assessment"
          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
        >
          Start New Assessment
        </a>
      </div>
    </div>
  );
} 