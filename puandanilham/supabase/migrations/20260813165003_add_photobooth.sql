-- Create photobooth_entries table
CREATE TABLE public.photobooth_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_name text NOT NULL,
    message text NOT NULL CHECK (char_length(message) <= 200),
    photo_url text NOT NULL,
    frame_id text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.photobooth_entries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Enable insert for public on photobooth_entries" 
ON public.photobooth_entries FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public selects
CREATE POLICY "Enable select for public on photobooth_entries" 
ON public.photobooth_entries FOR SELECT 
TO public 
USING (true);

-- Configure Storage Bucket "photobooth"
INSERT INTO storage.buckets (id, name, public) VALUES ('photobooth', 'photobooth', true) ON CONFLICT (id) DO NOTHING;

-- Allow public insert to photobooth bucket
CREATE POLICY "Public insert on photobooth bucket"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'photobooth');

-- Allow public select on photobooth bucket
CREATE POLICY "Public select on photobooth bucket"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'photobooth');
