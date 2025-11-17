-- Add new columns to testimonials table
ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS is_user_submitted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing testimonials
UPDATE testimonials
SET 
  is_user_submitted = false,
  is_approved = true,
  is_featured = false
WHERE is_user_submitted IS NULL;
