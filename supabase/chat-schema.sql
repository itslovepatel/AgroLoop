-- Deal-Scoped Chat System Schema
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

-- Conversations table (deal-scoped: tied to bid or contract)
CREATE TABLE public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Deal context (at least one must be set)
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  bid_id UUID, -- Reference to the bid that started this conversation
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  
  -- Participants
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Status: open during negotiation/logistics, closed when deal completed
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'disputed')),
  
  -- Message tracking
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_preview TEXT,
  farmer_unread_count INTEGER DEFAULT 0,
  buyer_unread_count INTEGER DEFAULT 0,
  message_count INTEGER DEFAULT 0,
  
  UNIQUE(listing_id, farmer_id, buyer_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('farmer', 'buyer', 'admin', 'system')),
  
  -- Message content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'offer', 'system', 'blocked')),
  
  -- Read status
  is_read BOOLEAN DEFAULT FALSE,
  
  -- Moderation: if content was filtered
  original_content TEXT, -- Store original if filtered
  was_filtered BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_conversations_farmer ON public.conversations(farmer_id);
CREATE INDEX idx_conversations_buyer ON public.conversations(buyer_id);
CREATE INDEX idx_conversations_listing ON public.conversations(listing_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES (Critical for Security)
-- =============================================

-- Conversations: Only participants can view
CREATE POLICY "Participants can view own conversations" ON public.conversations 
FOR SELECT USING (
  auth.uid() = farmer_id OR 
  auth.uid() = buyer_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Conversations: Only participants can create
CREATE POLICY "Participants can create conversations" ON public.conversations 
FOR INSERT WITH CHECK (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

-- Conversations: Only participants can update (e.g., mark as read)
CREATE POLICY "Participants can update own conversations" ON public.conversations 
FOR UPDATE USING (
  auth.uid() = farmer_id OR auth.uid() = buyer_id
);

-- Messages: Only participants of the conversation can view
CREATE POLICY "Participants can view messages" ON public.messages 
FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE farmer_id = auth.uid() OR buyer_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Messages: Only participants can send, only to open conversations
CREATE POLICY "Participants can send messages to open conversations" ON public.messages 
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (
    SELECT id FROM public.conversations 
    WHERE (farmer_id = auth.uid() OR buyer_id = auth.uid()) AND status = 'open'
  )
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to filter phone numbers, links, emails from messages
CREATE OR REPLACE FUNCTION filter_message_content(content TEXT)
RETURNS TABLE(filtered TEXT, was_filtered BOOLEAN) AS $$
DECLARE
  filtered_content TEXT := content;
  has_filter BOOLEAN := FALSE;
BEGIN
  -- Block phone numbers (Indian format)
  IF filtered_content ~ '\d{10}|\+91\d{10}|\d{5}[\s-]\d{5}' THEN
    filtered_content := regexp_replace(filtered_content, '\d{10}|\+91\d{10}|\d{5}[\s-]\d{5}', '[phone hidden]', 'g');
    has_filter := TRUE;
  END IF;
  
  -- Block URLs
  IF filtered_content ~* 'https?://[^\s]+|www\.[^\s]+' THEN
    filtered_content := regexp_replace(filtered_content, 'https?://[^\s]+|www\.[^\s]+', '[link hidden]', 'gi');
    has_filter := TRUE;
  END IF;
  
  -- Block email addresses
  IF filtered_content ~* '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}' THEN
    filtered_content := regexp_replace(filtered_content, '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}', '[email hidden]', 'gi');
    has_filter := TRUE;
  END IF;
  
  -- Block WhatsApp mentions
  IF filtered_content ~* 'whatsapp|wa\.me' THEN
    filtered_content := regexp_replace(filtered_content, 'whatsapp|wa\.me[^\s]*', '[contact hidden]', 'gi');
    has_filter := TRUE;
  END IF;
  
  RETURN QUERY SELECT filtered_content, has_filter;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 50),
    message_count = message_count + 1,
    farmer_unread_count = CASE 
      WHEN NEW.sender_role = 'buyer' THEN farmer_unread_count + 1 
      ELSE farmer_unread_count 
    END,
    buyer_unread_count = CASE 
      WHEN NEW.sender_role = 'farmer' THEN buyer_unread_count + 1 
      ELSE buyer_unread_count 
    END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for message updates
DROP TRIGGER IF EXISTS on_new_message ON public.messages;
CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Function to close conversation when contract is completed
CREATE OR REPLACE FUNCTION close_conversation_on_contract_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('completed', 'cancelled') THEN
    UPDATE public.conversations
    SET status = 'closed'
    WHERE contract_id = NEW.id;
    
    -- Add system message
    INSERT INTO public.messages (conversation_id, sender_id, sender_role, content, message_type)
    SELECT id, farmer_id, 'system', 
      CASE WHEN NEW.status = 'completed' 
        THEN 'Deal completed. This chat is now read-only.'
        ELSE 'Deal cancelled. This chat is now read-only.'
      END,
      'system'
    FROM public.conversations WHERE contract_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to close chat when deal ends
DROP TRIGGER IF EXISTS on_contract_status_change ON public.contracts;
CREATE TRIGGER on_contract_status_change
  AFTER UPDATE OF status ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION close_conversation_on_contract_complete();
