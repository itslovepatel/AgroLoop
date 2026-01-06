-- AgriLoop Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
  phone TEXT,
  location TEXT,
  district TEXT,
  state TEXT,
  company_name TEXT,
  company_type TEXT,
  total_earnings NUMERIC DEFAULT 0,
  total_purchases NUMERIC DEFAULT 0,
  total_listings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT
);

-- Listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  farmer_name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  residue_type TEXT NOT NULL,
  quantity_tons NUMERIC NOT NULL,
  price_per_ton NUMERIC NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  harvest_window_start DATE NOT NULL,
  harvest_window_end DATE NOT NULL,
  quality_grade TEXT DEFAULT 'Standard',
  moisture_content NUMERIC,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'bidding', 'contracted', 'collected', 'completed')),
  image_url TEXT,
  description TEXT
);

-- Bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  company_name TEXT,
  price_per_ton NUMERIC NOT NULL,
  quantity_tons NUMERIC NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  logistics_included BOOLEAN DEFAULT FALSE
);

-- Contracts table
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  farmer_name TEXT NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price_per_ton NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  logistics_cost NUMERIC DEFAULT 0,
  platform_fee NUMERIC DEFAULT 0,
  farmer_payout NUMERIC NOT NULL,
  carbon_credits NUMERIC DEFAULT 0,
  carbon_revenue NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'pickup_scheduled', 'in_transit', 'delivered', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'escrow', 'released', 'refunded')),
  scheduled_pickup TIMESTAMPTZ,
  actual_pickup TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ
);

-- Forward Contracts table
CREATE TABLE IF NOT EXISTS public.forward_contracts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  residue_type TEXT NOT NULL,
  quantity_required NUMERIC NOT NULL,
  price_per_ton NUMERIC NOT NULL,
  delivery_start DATE NOT NULL,
  delivery_end DATE NOT NULL,
  location TEXT NOT NULL,
  advance_payment_percent NUMERIC DEFAULT 20,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'partially_filled', 'filled', 'cancelled', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Pickup Tracking table
CREATE TABLE IF NOT EXISTS public.pickup_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'assigned', 'en_route', 'collected', 'in_transit', 'delivered', 'completed')),
  scheduled_date TIMESTAMPTZ,
  estimated_arrival TIMESTAMPTZ,
  transporter_name TEXT,
  transporter_phone TEXT,
  vehicle_number TEXT,
  proof_of_collection TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_farmer_id ON public.listings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_state ON public.listings(state);
CREATE INDEX IF NOT EXISTS idx_bids_listing_id ON public.bids(listing_id);
CREATE INDEX IF NOT EXISTS idx_bids_buyer_id ON public.bids(buyer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_farmer_id ON public.contracts(farmer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_buyer_id ON public.contracts(buyer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forward_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for listings
CREATE POLICY "Listings are viewable by everyone" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Farmers can insert own listings" ON public.listings FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update own listings" ON public.listings FOR UPDATE USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers can delete own listings" ON public.listings FOR DELETE USING (auth.uid() = farmer_id);

-- RLS Policies for bids
CREATE POLICY "Bids are viewable by listing owner and bid owner" ON public.bids FOR SELECT USING (
  auth.uid() = buyer_id OR 
  auth.uid() IN (SELECT farmer_id FROM public.listings WHERE id = listing_id)
);
CREATE POLICY "Buyers can insert bids" ON public.bids FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own bids" ON public.bids FOR UPDATE USING (auth.uid() = buyer_id);

-- RLS Policies for contracts
CREATE POLICY "Contracts are viewable by participants" ON public.contracts FOR SELECT USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);
CREATE POLICY "Insert contracts" ON public.contracts FOR INSERT WITH CHECK (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);
CREATE POLICY "Update own contracts" ON public.contracts FOR UPDATE USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

-- RLS Policies for forward_contracts
CREATE POLICY "Forward contracts viewable by all" ON public.forward_contracts FOR SELECT USING (true);
CREATE POLICY "Buyers can insert forward contracts" ON public.forward_contracts FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update own forward contracts" ON public.forward_contracts FOR UPDATE USING (auth.uid() = buyer_id);

-- RLS Policies for pickup_tracking
CREATE POLICY "Pickup tracking viewable by participants" ON public.pickup_tracking FOR SELECT USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);
CREATE POLICY "Insert pickup tracking" ON public.pickup_tracking FOR INSERT WITH CHECK (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);
CREATE POLICY "Update pickup tracking" ON public.pickup_tracking FOR UPDATE USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, location, company_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    NEW.raw_user_meta_data->>'location',
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Admin access policies (add admin user IDs here after creating admin account)
-- CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL USING (
--   auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
-- );
