-- Migration to add founder_description and founder_quote to about_content table
ALTER TABLE about_content 
ADD COLUMN IF NOT EXISTS founder_description TEXT,
ADD COLUMN IF NOT EXISTS founder_quote TEXT;
