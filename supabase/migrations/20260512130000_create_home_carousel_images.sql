CREATE TABLE public.home_carousel_images (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  image_url text NOT NULL,
  image_path text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT home_carousel_images_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.home_carousel_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.home_carousel_images
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.home_carousel_images
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON public.home_carousel_images
  AS PERMISSIVE FOR DELETE
  TO authenticated
  USING (true);
