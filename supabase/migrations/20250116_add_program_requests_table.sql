-- Program Requests Table for client requests to coaches
CREATE TABLE IF NOT EXISTS program_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_type VARCHAR(50) NOT NULL, -- 'training', 'nutrition', 'supplements', 'full'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT program_requests_status_check CHECK (status IN ('pending', 'accepted', 'rejected')),
  CONSTRAINT program_requests_type_check CHECK (program_type IN ('training', 'nutrition', 'supplements', 'full'))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_program_requests_client_id ON program_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_program_requests_coach_id ON program_requests(coach_id);
CREATE INDEX IF NOT EXISTS idx_program_requests_status ON program_requests(status);
CREATE INDEX IF NOT EXISTS idx_program_requests_created_at ON program_requests(created_at DESC);

-- Enable RLS
ALTER TABLE program_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "clients_can_create_requests" ON program_requests
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "clients_can_view_own_requests" ON program_requests
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "coaches_can_view_assigned_requests" ON program_requests
  FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "coaches_can_update_assigned_requests" ON program_requests
  FOR UPDATE USING (auth.uid() = coach_id)
  WITH CHECK (auth.uid() = coach_id);

-- Grant permissions
GRANT SELECT, INSERT ON program_requests TO authenticated;
GRANT UPDATE ON program_requests TO authenticated;
