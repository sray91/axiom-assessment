import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire app
export const createServerClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }

  return createClient(supabaseUrl, supabaseKey);
};

// Create a reusable client for client-side components
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// Get assessments for a user
export async function getUserAssessments(userId) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Get a single assessment by ID
export async function getAssessment(id) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('assessments')
    .select('*, organizations(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create or update an assessment
export async function saveAssessment(assessment) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('assessments')
    .upsert(assessment)
    .select();

  if (error) throw error;
  return data[0];
}

// Get benchmark data
export async function getBenchmarks() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('benchmarks')
    .select('*');

  if (error) throw error;
  return data;
}

// Get technologies data
export async function getTechnologies() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('technologies')
    .select('*');

  if (error) throw error;
  return data;
} 