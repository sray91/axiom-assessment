-- First, delete the old RLS policy
DROP POLICY IF EXISTS "Users can view their own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can insert their own assessments" ON assessments;

-- Create a more permissive policy for this demo app
CREATE POLICY "Anyone can view assessments" 
  ON assessments FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert assessments" 
  ON assessments FOR INSERT 
  WITH CHECK (true);

-- Optional: If you want to test with a specific dummy user
INSERT INTO auth.users (id, email) 
VALUES ('00000000-0000-0000-0000-000000000000', 'dummy@example.com')
ON CONFLICT (id) DO NOTHING; 