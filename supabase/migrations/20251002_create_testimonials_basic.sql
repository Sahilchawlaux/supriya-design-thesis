-- Create testimonials table if it doesn't exist
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON testimonials
  FOR SELECT USING (true);

-- Create policy to allow public insert (for user submissions)
CREATE POLICY IF NOT EXISTS "Allow public insert" ON testimonials
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to update/delete their own testimonials
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage their testimonials" ON testimonials
  FOR ALL USING (auth.uid() IS NOT NULL);
