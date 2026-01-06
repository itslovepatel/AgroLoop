-- Chat System Schema
-- Add to Supabase SQL Editor

-- Conversations table (links farmer-buyer for a listing)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  farmer_unread_count INTEGER DEFAULT 0,
  buyer_unread_count INTEGER DEFAULT 0,
  UNIQUE(listing_id, farmer_id, buyer_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('farmer', 'buyer')),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'offer', 'system'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_farmer ON public.conversations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer ON public.conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

CREATE POLICY "Users can update own conversations" ON public.conversations FOR UPDATE USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM public.conversations WHERE farmer_id = auth.uid() OR buyer_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages in own conversations" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (
    SELECT id FROM public.conversations WHERE farmer_id = auth.uid() OR buyer_id = auth.uid()
  )
);

-- Function to update conversation on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 50),
    farmer_unread_count = CASE WHEN NEW.sender_role = 'buyer' THEN farmer_unread_count + 1 ELSE farmer_unread_count END,
    buyer_unread_count = CASE WHEN NEW.sender_role = 'farmer' THEN buyer_unread_count + 1 ELSE buyer_unread_count END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for message updates
DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();
