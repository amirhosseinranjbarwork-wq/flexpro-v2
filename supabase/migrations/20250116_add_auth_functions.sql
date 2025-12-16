-- Authentication helper functions
CREATE OR REPLACE FUNCTION get_email_by_username(p_username TEXT)
RETURNS TEXT LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT email FROM profiles WHERE username = p_username LIMIT 1;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_email_by_username TO anon, authenticated;
