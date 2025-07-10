-- AquaMind Database Schema
-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE tank_type AS ENUM ('freshwater', 'saltwater', 'brackish', 'pond');
CREATE TYPE parameter_status AS ENUM ('excellent', 'good', 'warning', 'critical');
CREATE TYPE fish_health AS ENUM ('excellent', 'good', 'concerning', 'sick');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'premium');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    avatar_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tanks table
CREATE TABLE tanks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type tank_type NOT NULL,
    volume_liters DECIMAL(10,2),
    length_cm DECIMAL(8,2),
    width_cm DECIMAL(8,2),
    height_cm DECIMAL(8,2),
    setup_date DATE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fish table
CREATE TABLE fish (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    scientific_name TEXT,
    quantity INTEGER DEFAULT 1,
    health_status fish_health DEFAULT 'good',
    date_added DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Water parameters table
CREATE TABLE water_parameters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE NOT NULL,
    temperature_c DECIMAL(5,2),
    ph DECIMAL(4,2),
    ammonia_ppm DECIMAL(6,3),
    nitrite_ppm DECIMAL(6,3),
    nitrate_ppm DECIMAL(6,3),
    dissolved_oxygen_ppm DECIMAL(6,3),
    salinity_ppt DECIMAL(6,3),
    general_hardness_dgh DECIMAL(6,2),
    carbonate_hardness_dkh DECIMAL(6,2),
    status parameter_status DEFAULT 'good',
    notes TEXT,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fish ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_parameters ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for tanks
CREATE POLICY "Users can view own tanks" ON tanks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tanks" ON tanks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tanks" ON tanks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tanks" ON tanks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for fish
CREATE POLICY "Users can view fish in own tanks" ON fish FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = fish.tank_id AND tanks.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert fish in own tanks" ON fish FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = fish.tank_id AND tanks.user_id = auth.uid()
  ));
CREATE POLICY "Users can update fish in own tanks" ON fish FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = fish.tank_id AND tanks.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete fish in own tanks" ON fish FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = fish.tank_id AND tanks.user_id = auth.uid()
  ));

-- RLS Policies for water_parameters
CREATE POLICY "Users can view parameters for own tanks" ON water_parameters FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = water_parameters.tank_id AND tanks.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert parameters for own tanks" ON water_parameters FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = water_parameters.tank_id AND tanks.user_id = auth.uid()
  ));
CREATE POLICY "Users can update parameters for own tanks" ON water_parameters FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = water_parameters.tank_id AND tanks.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete parameters for own tanks" ON water_parameters FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM tanks WHERE tanks.id = water_parameters.tank_id AND tanks.user_id = auth.uid()
  ));

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER tanks_updated_at BEFORE UPDATE ON tanks FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
CREATE TRIGGER fish_updated_at BEFORE UPDATE ON fish FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
