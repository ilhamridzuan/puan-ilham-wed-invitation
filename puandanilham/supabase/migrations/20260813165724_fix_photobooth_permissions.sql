-- Grant necessary privileges to roles for photobooth_entries
GRANT SELECT, INSERT, UPDATE, DELETE ON public.photobooth_entries TO anon, authenticated, service_role;
