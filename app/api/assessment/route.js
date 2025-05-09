import { createServerClient } from '../../../lib/supabase';
import { calculateROI } from '../../../lib/roi';

/**
 * POST handler for saving a new assessment
 */
export async function POST(request) {
  try {
    // Get assessment data from request
    const assessmentData = await request.json();
    
    // Initialize Supabase client
    const supabase = await createServerClient();
    
    // Get benchmarks and technologies for ROI calculation
    const { data: benchmarks, error: benchmarksError } = await supabase
      .from('benchmarks')
      .select('*');
      
    if (benchmarksError) throw benchmarksError;
    
    const { data: technologies, error: technologiesError } = await supabase
      .from('technologies')
      .select('*');
      
    if (technologiesError) throw technologiesError;
    
    // Calculate ROI and roadmap
    const results = calculateROI({
      priorities: assessmentData.priorities,
      maturity: assessmentData.maturity,
      fin_inputs: assessmentData.fin_inputs,
      benchmarks,
      technologies
    });
    
    // Add results to assessment
    const completeAssessment = {
      ...assessmentData,
      results
    };
    
    // Save to database
    const { data, error } = await supabase
      .from('assessments')
      .insert(completeAssessment)
      .select();
      
    if (error) throw error;
    
    // Return success response with assessment ID
    return Response.json({ 
      success: true, 
      id: data[0].id
    });
  } catch (error) {
    console.error('Error processing assessment:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

/**
 * GET handler for retrieving an assessment
 */
export async function GET(request) {
  try {
    // Get ID from search params
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json({ 
        success: false, 
        error: 'Assessment ID is required' 
      }, { status: 400 });
    }
    
    // Initialize Supabase client
    const supabase = await createServerClient();
    
    // Get assessment
    const { data, error } = await supabase
      .from('assessments')
      .select('*, organizations(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    if (!data) {
      return Response.json({ 
        success: false, 
        error: 'Assessment not found' 
      }, { status: 404 });
    }
    
    // Return assessment data
    return Response.json({ 
      success: true, 
      assessment: data 
    });
  } catch (error) {
    console.error('Error retrieving assessment:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 