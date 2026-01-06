-- Database Trigger for Bid Email Notifications
-- This trigger calls the Edge Function when a new bid is placed

-- Function to notify farmer of new bid
CREATE OR REPLACE FUNCTION notify_farmer_on_new_bid()
RETURNS TRIGGER AS $$
DECLARE
  farmer_record RECORD;
  listing_record RECORD;
BEGIN
  -- Get the listing info
  SELECT * INTO listing_record FROM public.listings WHERE id = NEW.listing_id;
  
  -- Get the farmer's profile
  SELECT * INTO farmer_record FROM public.profiles WHERE id = listing_record.farmer_id;
  
  -- Call the Edge Function (non-blocking)
  -- Note: You need to set up the webhook in Supabase Dashboard or use pg_net
  -- For now, we'll insert into a notification queue table
  
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    data,
    is_read
  ) VALUES (
    listing_record.farmer_id,
    'new_bid',
    'New Bid Received',
    format('You received a bid of ₹%s for your %s listing from %s', 
           NEW.price_per_ton * NEW.quantity_tons, 
           listing_record.crop_type,
           NEW.company_name
    ),
    jsonb_build_object(
      'bid_id', NEW.id,
      'listing_id', NEW.listing_id,
      'buyer_name', NEW.buyer_name,
      'company_name', NEW.company_name,
      'price_per_ton', NEW.price_per_ton,
      'quantity', NEW.quantity_tons,
      'total_amount', NEW.price_per_ton * NEW.quantity_tons
    ),
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Trigger for new bids
DROP TRIGGER IF EXISTS on_new_bid ON public.bids;
CREATE TRIGGER on_new_bid
  AFTER INSERT ON public.bids
  FOR EACH ROW EXECUTE FUNCTION notify_farmer_on_new_bid();
