'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProgressTracker from './components/ProgressTracker';
import PriorityRanker from './components/PriorityRanker';
import MaturityScale from './components/MaturityScale';
import FinancialInputs from './components/FinancialInputs';
import { calculateROI } from '../../lib/roi';
import { createBrowserClient } from '../../lib/supabase';
import Image from 'next/image';

// Define maturity questions (SIRI-based)
const MATURITY_QUESTIONS = [
  {
    id: 'Process',
    title: 'Process Excellence & Standardization',
    description: 'Processes are documented, standardized, and continuously improved.',
  },
  {
    id: 'Asset',
    title: 'Asset Management & Reliability',
    description: 'Equipment is monitored, maintained, and optimized for performance.',
  },
  {
    id: 'People',
    title: 'Workforce Skills & Readiness',
    description: 'Teams have appropriate digital skills and engagement for Industry 4.0 applications.',
  },
  {
    id: 'Technology',
    title: 'Technology Infrastructure',
    description: 'IT/OT systems, networks, and cybersecurity are ready for Industry 4.0 applications.',
  },
  {
    id: 'Organization',
    title: 'Organizational Culture & Leadership',
    description: 'Organization is aligned around digital transformation goals with clear governance.',
  },
  {
    id: 'Quality',
    title: 'Quality Management',
    description: 'Quality systems detect issues early and enable root cause resolution.',
  },
  {
    id: 'Delivery',
    title: 'On-Time Delivery',
    description: 'Production planning is optimized to meet customer demand and delivery requirements.',
  },
  {
    id: 'Sustainability',
    title: 'Sustainability Practices',
    description: 'Energy usage and waste are monitored and continuously improved.',
  }
];

export default function AssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [supabase, setSupabase] = useState(null);
  const [assessment, setAssessment] = useState({
    priorities: { ranking: [] },
    maturity: {},
    fin_inputs: {}
  });
  const [benchmarks, setBenchmarks] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  
  // Step titles for the progress tracker
  const stepTitles = ['Priorities', 'Readiness', 'Financials', 'Review'];
  
  // Initialize Supabase
  useEffect(() => {
    const client = createBrowserClient();
    setSupabase(client);
    
    // Load benchmark and technology data
    async function loadReferenceData() {
      try {
        const { data: benchData } = await client.from('benchmarks').select('*');
        const { data: techData } = await client.from('technologies').select('*');
        
        if (benchData) setBenchmarks(benchData);
        if (techData) setTechnologies(techData);
      } catch (error) {
        console.error('Error loading reference data:', error);
      }
    }
    
    loadReferenceData();
  }, []);
  
  // Handle priority changes
  const handlePriorityChange = (priorities) => {
    setAssessment({
      ...assessment,
      priorities: { ranking: priorities }
    });
  };
  
  // Handle maturity input changes
  const handleMaturityChange = (id, value) => {
    setAssessment({
      ...assessment,
      maturity: {
        ...assessment.maturity,
        [id]: value
      }
    });
  };
  
  // Handle financial input changes
  const handleFinancialChange = (values) => {
    setAssessment({
      ...assessment,
      fin_inputs: values
    });
  };
  
  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: // Priorities
        return assessment.priorities.ranking.length > 0;
      case 1: // Maturity
        return Object.keys(assessment.maturity).length >= MATURITY_QUESTIONS.length;
      case 2: // Financials (optional)
        return true;
      case 3: // Review
        return true;
      default:
        return false;
    }
  };
  
  // Navigate to next step
  const handleNext = () => {
    if (currentStep < stepTitles.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Navigate to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Submit assessment
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Calculate results
      const results = calculateROI({
        priorities: assessment.priorities,
        maturity: assessment.maturity,
        fin_inputs: assessment.fin_inputs,
        benchmarks,
        technologies
      });
      
      // Add results to assessment
      const completeAssessment = {
        ...assessment,
        results,
        // Using a dummy user ID for now since we don't have authentication
        // This helps with RLS policies that require a user_id
        user_id: '00000000-0000-0000-0000-000000000000'
      };
      
      console.log("Submitting assessment:", JSON.stringify(completeAssessment));
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('assessments')
        .insert(completeAssessment)
        .select();
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from insert operation');
      }
      
      console.log('Successful submission, data:', data);
      
      // Navigate to results page
      router.push(`/assessment/result/${data[0].id}`);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert(`Error submitting assessment: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Priorities</h2>
            <p className="text-gray-600 mb-6">
              Rank these business priorities from most important (top) to least important (bottom) for your manufacturing operation.
            </p>
            
            <PriorityRanker 
              value={assessment.priorities.ranking}
              onChange={handlePriorityChange}
            />
          </div>
        );
        
      case 1:
        return (
          <div className="py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Digital Readiness Assessment</h2>
            <p className="text-gray-600 mb-6">
              Rate your current capabilities in these areas on a scale from 1 (Initial) to 5 (Optimized).
            </p>
            
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              {MATURITY_QUESTIONS.map((question) => (
                <MaturityScale
                  key={question.id}
                  id={question.id}
                  title={question.title}
                  description={question.description}
                  value={assessment.maturity[question.id] || 0}
                  onChange={handleMaturityChange}
                />
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Financial Information</h2>
            <p className="text-gray-600 mb-6">
              Provide operational cost data to calculate ROI. This step is optional but will provide more accurate financial projections.
            </p>
            
            <FinancialInputs
              value={assessment.fin_inputs}
              onChange={handleFinancialChange}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Review & Submit</h2>
            <p className="text-gray-600 mb-6">
              Review your assessment before submitting to generate your personalized technology roadmap.
            </p>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Business Priorities</h3>
              <ol className="list-decimal list-inside text-gray-600 pl-2">
                {assessment.priorities.ranking.map((priority, index) => (
                  <li key={index}>{priority}</li>
                ))}
              </ol>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Maturity Assessment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MATURITY_QUESTIONS.map((question) => (
                  <div key={question.id} className="flex justify-between">
                    <span className="text-gray-600">{question.title}:</span>
                    <span className="font-medium">{assessment.maturity[question.id] || 0}/5</span>
                  </div>
                ))}
              </div>
            </div>
            
            {Object.keys(assessment.fin_inputs).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium text-gray-800 mb-2">Financial Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(assessment.fin_inputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key.replace('_', ' ')}:</span>
                      <span className="font-medium">
                        {key.includes('cost') || key.includes('spend') ? `$${value}` : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Image 
          src="/axiom-logo.png" 
          alt="Axiom Logo" 
          width={160} 
          height={50} 
          className="mb-4"
          priority
        />
        <h1 className="text-3xl font-bold text-center">
          Smart Manufacturing Assessment
        </h1>
      </div>
      
      <ProgressTracker
        currentStep={currentStep}
        totalSteps={stepTitles.length}
        titles={stepTitles}
      />
      
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        {renderStepContent()}
        
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-md font-medium
              ${currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            Back
          </button>
          
          {currentStep < stepTitles.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepComplete()}
              className={`px-4 py-2 rounded-md font-medium
                ${!isStepComplete()
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`
              }
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Generate Roadmap'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 