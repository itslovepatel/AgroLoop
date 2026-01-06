// Supabase Edge Function for Bid Email Notifications
// Deploy to: supabase functions deploy send-bid-notification
// 
// This function sends email notifications to farmers when they receive new bids

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'noreply@agro.lovexog.me';

interface BidNotificationRequest {
    farmerEmail: string;
    farmerName: string;
    buyerName: string;
    companyName?: string;
    cropType: string;
    quantity: number;
    pricePerTon: number;
    totalAmount: number;
    listingId: string;
}

serve(async (req) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Content-Type': 'application/json',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers });
    }

    try {
        const payload: BidNotificationRequest = await req.json();

        const {
            farmerEmail,
            farmerName,
            buyerName,
            companyName,
            cropType,
            quantity,
            pricePerTon,
            totalAmount,
            listingId,
        } = payload;

        // Build email HTML
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Bid on Your Listing</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f0; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: linear-gradient(135deg, #2d5016 0%, #4a7c23 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 32px; }
    .bid-card { background: #f8fdf5; border: 2px solid #4a7c23; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .bid-amount { font-size: 32px; font-weight: bold; color: #2d5016; }
    .bid-detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
    .cta-button { display: inline-block; background: #4a7c23; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 24px; }
    .footer { background: #f5f5f0; padding: 24px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌾 New Bid Received!</h1>
    </div>
    <div class="content">
      <p>Hi ${farmerName},</p>
      <p>Great news! You've received a new bid on your <strong>${cropType}</strong> listing.</p>
      
      <div class="bid-card">
        <p class="bid-amount">₹${totalAmount.toLocaleString('en-IN')}</p>
        <div class="bid-detail">
          <span>Buyer</span>
          <strong>${companyName || buyerName}</strong>
        </div>
        <div class="bid-detail">
          <span>Price per Ton</span>
          <strong>₹${pricePerTon.toLocaleString('en-IN')}</strong>
        </div>
        <div class="bid-detail">
          <span>Quantity</span>
          <strong>${quantity} tons</strong>
        </div>
      </div>
      
      <p>Log in to review this bid and chat with the buyer about pricing and pickup details.</p>
      
      <a href="https://agro.lovexog.me/farmers" class="cta-button">View Bid Details →</a>
      
      <p style="margin-top: 32px; color: #666; font-size: 14px;">
        💡 Tip: Respond quickly to bids for better deals. You can negotiate directly with the buyer through our chat feature.
      </p>
    </div>
    <div class="footer">
      <p>AgriLoop India - Connecting Farmers to Markets</p>
      <p>© 2026 AgriLoop. All rights reserved.</p>
      <p><a href="https://agro.lovexog.me/unsubscribe?email=${encodeURIComponent(farmerEmail)}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
    `;

        // Send email via Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: `AgriLoop <${FROM_EMAIL}>`,
                to: [farmerEmail],
                subject: `New Bid: ₹${totalAmount.toLocaleString('en-IN')} for your ${cropType} `,
                html: emailHtml,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Resend API error:', result);
            return new Response(JSON.stringify({ error: 'Failed to send email', details: result }), {
                status: 500,
                headers,
            });
        }

        return new Response(JSON.stringify({ success: true, messageId: result.id }), {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers,
        });
    }
});
