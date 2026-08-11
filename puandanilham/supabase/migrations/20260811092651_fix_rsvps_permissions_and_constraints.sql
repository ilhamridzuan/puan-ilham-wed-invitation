-- Fix the guest_count constraint to allow 0 (for tidak_hadir)
ALTER TABLE public.rsvps DROP CONSTRAINT rsvps_guest_count_check;
ALTER TABLE public.rsvps ADD CONSTRAINT rsvps_guest_count_check CHECK (guest_count >= 0 and guest_count <= 10);

-- Grant privileges for both anon and authenticated roles
GRANT ALL ON public.rsvps TO anon, authenticated;
GRANT ALL ON public.wishes TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
