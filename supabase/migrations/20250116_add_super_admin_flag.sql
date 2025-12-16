-- Add is_super_admin flag to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_super_admin ON profiles(is_super_admin);

-- Grant permissions
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for super admin to view all profiles
CREATE POLICY "super_admin_view_all_profiles" ON profiles
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM profiles WHERE is_super_admin = true) OR
    auth.uid() = id
  );

-- Policy for super admin to update profiles
CREATE POLICY "super_admin_update_profiles" ON profiles
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM profiles WHERE is_super_admin = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_super_admin = true));

-- Update templates table to support full week programs
ALTER TABLE templates ADD COLUMN IF NOT EXISTS full_week_data JSONB;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS is_full_program BOOLEAN DEFAULT false;

-- Create index for templates
CREATE INDEX IF NOT EXISTS idx_templates_full_program ON templates(is_full_program);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);
