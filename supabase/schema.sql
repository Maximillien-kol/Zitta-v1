-- Enable the pgcrypto extension for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (Public user information)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  phone text,
  email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  price numeric NOT NULL,
  address text NOT NULL,
  beds int,
  baths int,
  sqft int,
  status text DEFAULT 'Active',
  mls_id text,
  agent text,
  badge_text text,
  badge_type text,
  image text,
  images text[] DEFAULT '{}',
  lat numeric,
  lng numeric,
  bedrooms int,
  rooms int,
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SAVED PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.saved_properties (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, property_id)
);

-- CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name text NOT NULL,
  agent_image text,
  last_message text,
  timestamp text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  text text NOT NULL,
  time text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies:
-- 1. Anyone can view profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

-- 2. Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Properties Policies:
DROP POLICY IF EXISTS "Properties are viewable by everyone." ON public.properties;
CREATE POLICY "Properties are viewable by everyone." 
  ON public.properties FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create properties." ON public.properties;
CREATE POLICY "Authenticated users can create properties." 
  ON public.properties FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update their own properties." ON public.properties;
CREATE POLICY "Users can update their own properties." 
  ON public.properties FOR UPDATE 
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete their own properties." ON public.properties;
CREATE POLICY "Users can delete their own properties." 
  ON public.properties FOR DELETE 
  USING (auth.uid() = owner_id);

-- Saved Properties Policies:
DROP POLICY IF EXISTS "Users can view own saved properties." ON public.saved_properties;
CREATE POLICY "Users can view own saved properties." 
  ON public.saved_properties FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own saved properties." ON public.saved_properties;
CREATE POLICY "Users can insert own saved properties." 
  ON public.saved_properties FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own saved properties." ON public.saved_properties;
CREATE POLICY "Users can delete own saved properties." 
  ON public.saved_properties FOR DELETE 
  USING (auth.uid() = user_id);

-- Conversations Policies:
DROP POLICY IF EXISTS "Users can view own conversations." ON public.conversations;
CREATE POLICY "Users can view own conversations."
  ON public.conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = agent_id);

DROP POLICY IF EXISTS "Users can create conversations." ON public.conversations;
CREATE POLICY "Users can create conversations."
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = agent_id);

DROP POLICY IF EXISTS "Users can update own conversations." ON public.conversations;
CREATE POLICY "Users can update own conversations."
  ON public.conversations FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = agent_id);

-- Messages Policies:
DROP POLICY IF EXISTS "Users can view messages in own conversations." ON public.messages;
CREATE POLICY "Users can view messages in own conversations."
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.buyer_id = auth.uid() OR conversations.agent_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can send messages to own conversations." ON public.messages;
CREATE POLICY "Users can send messages to own conversations."
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.buyer_id = auth.uid() OR conversations.agent_id = auth.uid())
    )
    AND auth.uid() = sender_id
  );

-- TRIGGER FUNCTION TO AUTOMATICALLY CREATE PROFILE ON SIGN UP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
