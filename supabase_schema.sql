-- CITYEYES SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  trust_score INTEGER DEFAULT 1,
  intel_credits INTEGER DEFAULT 0,
  admin_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Landmarks table
CREATE TABLE IF NOT EXISTS public.landmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  longitude DOUBLE PRECISION NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  submitted_by UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Incidents table
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('TRAFFIC', 'HAZARD', 'POLICE', 'ACCIDENT')),
  description TEXT,
  longitude DOUBLE PRECISION NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '4 hours'),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'EXPIRED')),
  image_url TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Policies for Landmarks
CREATE POLICY "Anyone can view verified landmarks" ON public.landmarks
  FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Authenticated users can submit landmarks" ON public.landmarks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all landmarks" ON public.landmarks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Policies for Incidents
CREATE POLICY "Anyone can view active incidents" ON public.incidents
  FOR SELECT USING (expires_at > NOW());

CREATE POLICY "Authenticated users can report incidents" ON public.incidents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all incidents" ON public.incidents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clear trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();