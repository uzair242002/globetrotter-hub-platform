
-- Create the travel_packages table
CREATE TABLE public.travel_packages (
  id SERIAL PRIMARY KEY,
  destination TEXT NOT NULL,
  duration INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.travel_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for travel packages
-- Allow all users to view active packages
CREATE POLICY "Anyone can view active travel packages" 
  ON public.travel_packages 
  FOR SELECT 
  USING (is_active = true);

-- Allow authenticated users to view all packages (for admin)
CREATE POLICY "Authenticated users can view all travel packages" 
  ON public.travel_packages 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert packages (for admin)
CREATE POLICY "Authenticated users can create travel packages" 
  ON public.travel_packages 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update packages (for admin)
CREATE POLICY "Authenticated users can update travel packages" 
  ON public.travel_packages 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete packages (for admin)
CREATE POLICY "Authenticated users can delete travel packages" 
  ON public.travel_packages 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Add some sample data
INSERT INTO public.travel_packages (destination, duration, price, description, images, inclusions) VALUES
('Paris, France', 7, 85000, 'Experience the romance and charm of Paris with visits to the Eiffel Tower, Louvre Museum, and charming cafes.', 
 ARRAY['https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800', 'https://images.unsplash.com/photo-1571043733612-4fa1b9a2a7e0?w=800'], 
 ARRAY['Hotel accommodation', 'Daily breakfast', 'Airport transfers', 'City tour guide']),

('Tokyo, Japan', 10, 120000, 'Discover the perfect blend of traditional and modern culture in Japan''s vibrant capital city.', 
 ARRAY['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800'], 
 ARRAY['Hotel accommodation', 'Daily breakfast', 'JR Pass', 'Cultural experiences']),

('Bali, Indonesia', 5, 45000, 'Relax on pristine beaches, explore ancient temples, and enjoy the tropical paradise of Bali.', 
 ARRAY['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800', 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=800'], 
 ARRAY['Resort accommodation', 'All meals included', 'Airport transfers', 'Temple tours']),

('New York, USA', 6, 95000, 'Experience the city that never sleeps with Broadway shows, iconic landmarks, and world-class dining.', 
 ARRAY['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800'], 
 ARRAY['Hotel accommodation', 'Daily breakfast', 'Metro pass', 'Broadway show tickets']);
