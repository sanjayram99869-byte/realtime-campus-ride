-- Create routes table
CREATE TABLE public.routes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_number text NOT NULL UNIQUE,
  route_name text NOT NULL,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('bus', 'van')),
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create vehicle_locations table for real-time tracking
CREATE TABLE public.vehicle_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route_id uuid NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  current_location text NOT NULL,
  estimated_time text NOT NULL,
  status text NOT NULL CHECK (status IN ('on-time', 'delayed', 'arrived')),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  last_updated timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view routes and locations)
CREATE POLICY "Anyone can view routes"
  ON public.routes
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view vehicle locations"
  ON public.vehicle_locations
  FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_routes_active ON public.routes(is_active);
CREATE INDEX idx_vehicle_locations_route ON public.vehicle_locations(route_id);
CREATE INDEX idx_vehicle_locations_updated ON public.vehicle_locations(last_updated DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on routes
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for vehicle locations
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_locations;

-- Insert sample routes
INSERT INTO public.routes (route_number, route_name, vehicle_type) VALUES
  ('A1', 'Main Campus - North Gate', 'bus'),
  ('B2', 'Hostel Block - East Campus', 'van'),
  ('C3', 'Metro Station - Main Gate', 'bus'),
  ('D4', 'Downtown - Campus Center', 'bus');

-- Insert sample vehicle locations
INSERT INTO public.vehicle_locations (route_id, current_location, estimated_time, status, latitude, longitude) 
SELECT 
  r.id,
  CASE 
    WHEN r.route_number = 'A1' THEN 'Library Junction'
    WHEN r.route_number = 'B2' THEN 'Sports Complex'
    WHEN r.route_number = 'C3' THEN 'Main Gate'
    WHEN r.route_number = 'D4' THEN 'City Mall'
  END,
  CASE 
    WHEN r.route_number = 'A1' THEN '5 mins'
    WHEN r.route_number = 'B2' THEN '12 mins'
    WHEN r.route_number = 'C3' THEN 'Arrived'
    WHEN r.route_number = 'D4' THEN '8 mins'
  END,
  CASE 
    WHEN r.route_number = 'A1' THEN 'on-time'
    WHEN r.route_number = 'B2' THEN 'delayed'
    WHEN r.route_number = 'C3' THEN 'arrived'
    WHEN r.route_number = 'D4' THEN 'on-time'
  END,
  CASE 
    WHEN r.route_number = 'A1' THEN 40.7128
    WHEN r.route_number = 'B2' THEN 40.7580
    WHEN r.route_number = 'C3' THEN 40.7614
    WHEN r.route_number = 'D4' THEN 40.7489
  END,
  CASE 
    WHEN r.route_number = 'A1' THEN -74.0060
    WHEN r.route_number = 'B2' THEN -73.9855
    WHEN r.route_number = 'C3' THEN -73.9776
    WHEN r.route_number = 'D4' THEN -73.9680
  END
FROM public.routes r;